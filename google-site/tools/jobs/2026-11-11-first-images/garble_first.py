import sys, json, cv2, numpy as np
sys.path.insert(0, '/home/user/zeotein-theme/google-site/tools')
from garble import garble_word
D = '/tmp/claude-0/-home-user-zeotein-theme/de92fffb-0446-5b62-b9a6-c9f40b3b41b9/scratchpad'
JOBS = {  # OCR boxes (x, y, w, h) from the gate, original pixels
  'cacao-bag':      {'ZEOLITE': (357, 687, 84, 18), 'INFLAMMATION': (490, 828, 72, 7), 'IMMUNE': (583, 827, 39, 8), 'DETOX': (713, 819, 22, 10)},
  'vegan-sticks30': {'ZEOLITE': (533, 657, 50, 20), 'IMMUNE': (684, 784, 27, 6), 'DETOX': (797, 781, 22, 7)},
  'vegan-sticks7':  {'ZEOLITE': (589, 658, 62, 17), 'IMMUNE': (752, 784, 27, 6), 'DETOX': (865, 782, 20, 11)},
}
def tight_box(img, box, m=6):
    x, y, w, h = box
    x0, y0 = max(0, x - m), max(0, y - m); x1, y1 = min(img.shape[1], x + w + m), min(img.shape[0], y + h + m)
    roi = img[y0:y1, x0:x1, :3].astype(int); b, g, r = roi[..., 0], roi[..., 1], roi[..., 2]
    mask = (r > 150) & (g > 150) & (b > 140) & ((roi.max(axis=2) - roi.min(axis=2)) < 80)
    rows = mask.any(axis=1); cy = (y + h / 2) - y0
    # contiguous row band around the OCR box's centre line
    idx = np.where(rows)[0]
    if not len(idx): raise SystemExit(f'no light text found near {box}')
    c = int(idx[np.argmin(np.abs(idx - cy))]); top = bot = c
    while top - 1 >= 0 and rows[top - 1]: top -= 1
    while bot + 1 < len(rows) and rows[bot + 1]: bot += 1
    cols = mask[top:bot + 1].any(axis=0); cidx = np.where(cols)[0]
    # cluster columns (gap >= 5 px splits words); keep clusters overlapping the OCR box
    clusters, s = [], cidx[0]
    for a, bb in zip(cidx, cidx[1:]):
        if bb - a >= 5: clusters.append((s, a)); s = bb
    clusters.append((s, cidx[-1]))
    bx0, bx1 = x - x0, x + w - x0
    keep = [cl for cl in clusters if cl[1] >= bx0 - 2 and cl[0] <= bx1 + 2]
    left, right = min(k[0] for k in keep), max(k[1] for k in keep)
    return (x0 + left, y0 + top, right - left + 1, bot - top + 1)
log = {}
for name, words in JOBS.items():
    img = cv2.imread(f'{D}/firstimg/{name}.png', cv2.IMREAD_UNCHANGED)
    log[name] = {}
    for i, (word, box) in enumerate(words.items()):
        tb = tight_box(img, box)
        img, info = garble_word(img, tb, pad=2, seed=11 + i)
        log[name][word] = {'ocr_box': box, 'tight_box': tb, 'glyph_groups': info['segments'], 'order': info['order']}
        print(f'{name:15} {word:13} box {tb}  groups {info["segments"]}  order {info["order"]}')
    cv2.imwrite(f'{D}/garbled/{name}.png', img)
    small = cv2.resize(img, (640, 640), interpolation=cv2.INTER_AREA)
    cv2.imwrite(f'{D}/garbled/{name}-640.png', small)
json.dump(log, open(f'{D}/garbled/garble-log.json', 'w'), indent=1, default=int)
