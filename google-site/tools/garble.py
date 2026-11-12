"""Scramble one printed word on a packaging photo by reordering its own letter glyphs.
The rest of the photo is untouched: no crop, no blur, no pasted text."""
import cv2, numpy as np

def _segments(mask_cols, min_gap=1):
    segs, inside, start = [], False, 0
    for x, v in enumerate(mask_cols):
        if v and not inside: inside, start = True, x
        if not v and inside:
            inside = False; segs.append([start, x])
    if inside: segs.append([start, len(mask_cols)])
    return segs

def garble_word(img, box, order=None, light_thresh=None, pad=3, seed=7):
    """img: BGR or BGRA uint8. box: (x, y, w, h) around the word. Returns new image and info."""
    x, y, w, h = box
    x0, y0, x1, y1 = max(0, x - pad), max(0, y - pad), x + w + pad, y + h + pad
    has_alpha = img.shape[2] == 4
    bgr = img[:, :, :3].copy()
    roi = bgr[y0:y1, x0:x1].copy()
    lum = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY).astype(np.float32)
    if light_thresh is None:
        light_thresh = (np.percentile(lum, 50) + lum.max()) / 2.0
    glyph = (lum > light_thresh).astype(np.uint8)
    # include the dark outline / anti-aliasing around the glyphs
    halo = cv2.dilate(glyph, np.ones((3, 3), np.uint8), iterations=1)
    # clean background under the word
    clean = cv2.inpaint(roi, halo * 255, 3, cv2.INPAINT_TELEA)
    cols = glyph.sum(axis=0) > 0
    segs = _segments(cols)
    # merge tiny slivers into neighbours
    merged = []
    for s in segs:
        if merged and (s[1] - s[0] <= 1):
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    segs = merged
    if len(segs) < 2:
        # letters merged into one group (tiny or tilted print): nothing to reorder; caller must handle it
        raise ValueError(f"word split into {len(segs)} glyph group(s); use letter-by-letter cutting")
    if order is None:
        rng = np.random.default_rng(seed)
        order = list(range(len(segs)))
        while True:
            rng.shuffle(order)
            if order != sorted(order) and order[0] != 0: break
    if len(order) != len(segs):
        raise ValueError(f"order has {len(order)} items but the word split into {len(segs)} glyph groups")
    gaps = [segs[i + 1][0] - segs[i][1] for i in range(len(segs) - 1)]
    widths = [s[1] - s[0] for s in segs]
    # soft alpha for glyph transfer: difference from the clean background, feathered
    diff = np.abs(roi.astype(np.float32) - clean.astype(np.float32)).max(axis=2)
    alpha_full = np.clip(diff / max(1.0, np.percentile(diff[halo > 0], 90)), 0, 1)
    alpha_full *= cv2.GaussianBlur(halo.astype(np.float32), (3, 3), 0) > 0.01
    out_roi = clean.astype(np.float32)
    # even letter spacing, word re-centred on its original position
    gap = int(round(np.median(gaps))) if gaps else 0
    total = sum(widths) + gap * (len(segs) - 1)
    orig_center = (segs[0][0] + segs[-1][1]) / 2.0
    cursor = int(round(orig_center - total / 2.0))
    for k, idx in enumerate(order):
        sx0, sx1 = segs[idx]
        src = roi[:, max(0, sx0 - 1):min(roi.shape[1], sx1 + 1)].astype(np.float32)
        a = alpha_full[:, max(0, sx0 - 1):min(roi.shape[1], sx1 + 1)][..., None]
        dx0 = cursor - (sx0 - max(0, sx0 - 1))
        dx1 = dx0 + src.shape[1]
        dx0c, dx1c = max(0, dx0), min(out_roi.shape[1], dx1)
        s0 = dx0c - dx0; s1 = s0 + (dx1c - dx0c)
        region = out_roi[:, dx0c:dx1c]
        out_roi[:, dx0c:dx1c] = region * (1 - a[:, s0:s1]) + src[:, s0:s1] * a[:, s0:s1]
        cursor += widths[idx] + gap
    new = img.copy()
    new[y0:y1, x0:x1, :3] = np.clip(out_roi, 0, 255).astype(np.uint8)
    return new, {"segments": len(segs), "order": order, "box": [x0, y0, x1 - x0, y1 - y0]}
