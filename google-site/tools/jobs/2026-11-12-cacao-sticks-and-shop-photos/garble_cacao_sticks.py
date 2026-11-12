# Archived as run on 12 Nov 2026. SP points at that session's scratchpad (source photos and outputs); set it to a local folder to re-run.
"""Garble ZEOLITE, INFLAMMATION, IMMUNE and DETOX on the Cacao 30-stick and 7-stick first images.
Main pouch words: OCR box refined to the light glyphs. Stick labels: boxes measured on 4x/6x gridded close-ups."""
import sys, json, cv2, numpy as np
sys.path.insert(0, '/home/user/zeotein-theme/google-site/tools')
from garble import garble_word
SP = '/tmp/claude-0/-home-user-zeotein-theme/de92fffb-0446-5b62-b9a6-c9f40b3b41b9/scratchpad'

def tight_box(img, box, m=6):
    x, y, w, h = box
    x0, y0 = max(0, x - m), max(0, y - m); x1, y1 = min(img.shape[1], x + w + m), min(img.shape[0], y + h + m)
    roi = img[y0:y1, x0:x1, :3].astype(int); b, g, r = roi[..., 0], roi[..., 1], roi[..., 2]
    mask = (r > 150) & (g > 150) & (b > 140) & ((roi.max(axis=2) - roi.min(axis=2)) < 80)
    rows = mask.any(axis=1); cy = (y + h / 2) - y0
    idx = np.where(rows)[0]
    c = int(idx[np.argmin(np.abs(idx - cy))]); top = bot = c
    while top - 1 >= 0 and rows[top - 1]: top -= 1
    while bot + 1 < len(rows) and rows[bot + 1]: bot += 1
    cols = mask[top:bot + 1].any(axis=0); cidx = np.where(cols)[0]
    clusters, s = [], cidx[0]
    for a, bb in zip(cidx, cidx[1:]):
        if bb - a >= 5: clusters.append((s, a)); s = bb
    clusters.append((s, cidx[-1]))
    keep = [cl for cl in clusters if cl[1] >= (x - x0) - 2 and cl[0] <= (x + w - x0) + 2]
    return (x0 + min(k[0] for k in keep), y0 + top, max(k[1] for k in keep) - min(k[0] for k in keep) + 1, bot - top + 1)

JOBS = {
  'cacao-sticks30': {'src': f'{SP}/firstimg/cacao-sticks30.png',
    'refine': [('ZEOLITE', (503, 645, 62, 14))],
    'boxes': [('INFLAMMATION', (621, 759, 64, 8), 1), ('IMMUNE', (700, 760, 35, 6), 1), ('DETOX', (803, 758, 25, 9), 1),
              ('ZEOLITE@s1', (75, 695, 22, 8), 0), ('INFLAMMATION@s1', (167, 760, 34, 6), 0), ('IMMUNE@s1', (82, 810, 25, 6), 0), ('DETOX@s1', (162, 810, 20, 6), 0),
              ('ZEOLITE@s2', (247, 695, 21, 8), 0), ('INFLAMMATION@s2', (338, 760, 31, 6), 0), ('IMMUNE@s2', (252, 810, 25, 6), 0), ('DETOX@s2', (333, 810, 20, 6), 0)]},
  'cacao-sticks7': {'src': f'{SP}/lifeimg/cacao-sticks7.png',
    'refine': [('ZEOLITE', (553, 642, 73, 20))],
    'boxes': [('INFLAMMATION', (671, 759, 65, 8), 1), ('IMMUNE', (750, 760, 35, 6), 1), ('DETOX', (852, 758, 26, 9), 1),
              ('ZEOLITE@s1', (108, 695, 21, 8), 0), ('INFLAMMATION@s1', (199, 760, 34, 6), 0), ('IMMUNE@s1', (113, 810, 25, 6), 0), ('DETOX@s1', (192, 810, 22, 6), 0),
              ('ZEOLITE@s2', (280, 695, 21, 8), 0), ('INFLAMMATION@s2', (370, 760, 32, 6), 0), ('IMMUNE@s2', (285, 810, 25, 6), 0), ('DETOX@s2', (363, 810, 25, 6), 0)]},
}
def garble_slices(img, box, word, seed):
    """Fallback for print too small or tilted for glyph grouping: work at 4x, cut the word into its letters at the
    column-profile valleys (equal widths if valleys are unclear), move every letter to another letter's slot."""
    x, y, w, h = box; S = 4
    roi = img[y:y + h, x:x + w, :3].copy()
    big = cv2.resize(roi, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC); bf = big.astype(np.float32)
    lum = cv2.cvtColor(big, cv2.COLOR_BGR2GRAY).astype(np.float32)
    mask = (lum > (np.median(lum) + lum.max()) / 2).astype(np.uint8)
    halo = cv2.dilate(mask, np.ones((5, 5), np.uint8))
    clean = cv2.inpaint(big, halo * 255, 5, cv2.INPAINT_TELEA).astype(np.float32)
    cols = np.where(mask.sum(axis=0) > 0)[0]
    L, R = (int(cols[0]), int(cols[-1]) + 1) if len(cols) else (0, big.shape[1])
    n = len(word); prof = cv2.GaussianBlur(mask.sum(axis=0).astype(np.float32).reshape(1, -1), (5, 1), 0).ravel()
    step = (R - L) / n
    cuts = []
    for k in range(1, n):  # look for the lowest column near each equal-width boundary
        c = int(L + k * step); lo, hi = max(L + 1, c - int(step / 3)), min(R - 1, c + int(step / 3))
        cuts.append(lo + int(np.argmin(prof[lo:hi + 1])) if hi > lo else c)
    edges = [L] + sorted(cuts) + [R]
    segs = [(edges[i], edges[i + 1]) for i in range(n)]
    order = scramble_order(n, seed)
    diff = np.abs(bf - clean).max(axis=2)
    alpha = np.clip(diff / max(1.0, np.percentile(diff[halo > 0], 90) if (halo > 0).any() else 1.0), 0, 1) * (halo > 0)
    out = clean.copy()
    for slot, j in enumerate(order):
        a, b = segs[j]; sa, sb = segs[slot]
        src = bf[:, a:b]; al = alpha[:, a:b][..., None]
        dx = int(round((sa + sb) / 2 - (a + b) / 2))
        x0 = max(0, a + dx); x1 = min(big.shape[1], b + dx); s0 = x0 - (a + dx)
        if x1 <= x0: continue
        out[:, x0:x1] = out[:, x0:x1] * (1 - al[:, s0:s0 + (x1 - x0)]) + src[:, s0:s0 + (x1 - x0)] * al[:, s0:s0 + (x1 - x0)]
    small = cv2.resize(np.clip(out, 0, 255).astype(np.uint8), (w, h), interpolation=cv2.INTER_AREA)
    new = img.copy(); new[y:y + h, x:x + w, :3] = small
    return new, {'segments': n, 'order': order, 'method': 'letter slices at 4x'}

def scramble_order(n, seed):
    """Every letter leaves its place and no two letters that were neighbours stay side by side (no 'TOX', 'INFLA'...)."""
    rng = np.random.default_rng(seed); order = list(range(n))
    for _ in range(20000):
        rng.shuffle(order)
        if all(order[i] != i for i in range(n)) and all(order[i + 1] != order[i] + 1 for i in range(n - 1)):
            return list(order)
    raise ValueError('no scramble found')

def safe_garble(img, box, word, pad, seed):
    w = word.split('@')[0]
    try:
        groups = garble_word(img, box, pad=pad, seed=seed)[1]['segments']
    except ValueError:
        groups = 1
    if groups == len(w):          # one glyph group per letter: move the real letters
        return garble_word(img, box, pad=pad, order=scramble_order(groups, seed))
    return garble_slices(img, box, w, seed)   # merged or tiny print: cut into letters first

log = {}
for name, job in JOBS.items():
    img = cv2.imread(job['src'], cv2.IMREAD_UNCHANGED)
    if img.shape[2] == 4: img = img[:, :, :3].copy()
    log[name] = {}; seed = 50
    for word, box in job['refine']:
        tb = tight_box(img, box); img, info = safe_garble(img, tb, word, 2, seed); seed += 1
        log[name][word] = {'box': [int(v) for v in tb], 'groups': info['segments'], 'order': info['order']}
    for word, box, pad in job['boxes']:
        img, info = safe_garble(img, box, word, pad, seed); seed += 1
        log[name][word] = {'box': list(box), 'groups': info['segments'], 'order': info['order']}
    for w, v in log[name].items(): print(f'{name:15} {w:16} box {v["box"]} groups {v["groups"]} order {v["order"]}')
    cv2.imwrite(f'{SP}/garbled/{name}.png', img)
    cv2.imwrite(f'{SP}/garbled/{name}-640.png', cv2.resize(img, (640, 640), interpolation=cv2.INTER_AREA))
json.dump(log, open(f'{SP}/garbled/garble-log-cacao-sticks.json', 'w'), indent=1)
