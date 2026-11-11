import sys, json, cv2, numpy as np
sys.path.insert(0, '/home/user/zeotein-theme/google-site/tools')
from garble import garble_word, _segments
D = '/tmp/claude-0/-home-user-zeotein-theme/de92fffb-0446-5b62-b9a6-c9f40b3b41b9/scratchpad'
img = cv2.imread(f'{D}/firstimg/cacao-bag.png', cv2.IMREAD_UNCHANGED)
log = json.load(open(f'{D}/garbled/garble-log.json'))
for i, w in enumerate(['ZEOLITE', 'INFLAMMATION', 'IMMUNE']):
    img, info = garble_word(img, tuple(int(v) for v in log['cacao-bag'][w]['tight_box']), pad=2, seed=11 + i)
    assert info['order'] == log['cacao-bag'][w]['order'], w
X0, Y0, X1, Y1 = 708, 815, 740, 833
S = 4
roi = img[Y0:Y1, X0:X1, :3].copy()
big = cv2.resize(roi, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC)
bf = big.astype(np.float32)
lum = cv2.cvtColor(big, cv2.COLOR_BGR2GRAY).astype(np.float32)
sat = bf.max(axis=2) - bf.min(axis=2)
yy, xx = np.mgrid[0:big.shape[0], 0:big.shape[1]]
ox, oy = X0 + (xx + 0.5) / S, Y0 + (yy + 0.5) / S
band = oy < (832 - (ox - 712) * (2 / 24))            # above the tilted gap between DETOX and SUPPORT
mask = ((lum > 115) & (sat < 90) & band).astype(np.uint8)
halo = cv2.dilate(mask, np.ones((5, 5), np.uint8), iterations=1) & band.astype(np.uint8)
clean = cv2.inpaint(big, halo * 255, 5, cv2.INPAINT_TELEA).astype(np.float32)
# letters touch at this size, so cut at the four deepest valleys of the column profile
strict = ((lum > 150) & (sat < 90) & band)
prof = cv2.GaussianBlur(strict.sum(axis=0).astype(np.float32).reshape(1, -1), (5, 1), 0).ravel()
cols = np.where(prof > 0.5)[0]; L, R = int(cols[0]), int(cols[-1]) + 1
minima = [x for x in range(L + 8, R - 8) if prof[x] <= prof[x - 1] and prof[x] <= prof[x + 1]]
cuts = []
for x in sorted(minima, key=lambda x: prof[x]):
    if all(abs(x - c) >= 12 for c in cuts): cuts.append(x)
    if len(cuts) == 4: break
cuts = sorted(cuts)
print('profile', [int(v) for v in prof[L:R]], 'cuts', cuts)
assert len(cuts) == 4, 'could not find four letter boundaries'
edges = [L] + cuts + [R]
segs = [[edges[i], edges[i + 1]] for i in range(5)]
print('letters (4x px)', segs, '-> original x', [round(X0 + a / S, 1) for a, _ in segs])
diff = np.abs(bf - clean).max(axis=2)
alpha = np.clip(diff / max(1.0, np.percentile(diff[halo > 0], 90)), 0, 1) * (halo > 0)
cys = [float((yy * mask)[:, a:b].sum() / max(1, mask[:, a:b].sum())) for a, b in segs]
print('letter centre y (4x)', [round(c, 1) for c in cys])
cxs = [(a + b) / 2 for a, b in segs]
order = [4, 3, 1, 0, 2]                                # X O E D T: every letter leaves its slot
out = clean.copy(); newfoot = np.zeros(mask.shape, np.float32)
for slot, j in enumerate(order):
    a, b = segs[j]; a0, b0 = a, b
    src = bf[:, a0:b0]; al = alpha[:, a0:b0]
    dx = int(round(cxs[slot] - cxs[j])); dy = int(round(cys[slot] - cys[j]))
    Mt = np.float32([[1, 0, a0 + dx], [0, 1, dy]])
    src_w = cv2.warpAffine(src, Mt, (big.shape[1], big.shape[0]), borderValue=0)
    al_w = cv2.warpAffine(al, Mt, (big.shape[1], big.shape[0]), borderValue=0)[..., None]
    out = out * (1 - al_w) + src_w * al_w
    newfoot = np.maximum(newfoot, al_w[..., 0])
small = cv2.resize(np.clip(out, 0, 255).astype(np.uint8), (X1 - X0, Y1 - Y0), interpolation=cv2.INTER_AREA).astype(np.float32)
foot = cv2.resize(np.maximum(halo.astype(np.float32), newfoot), (X1 - X0, Y1 - Y0), interpolation=cv2.INTER_AREA)
foot = cv2.GaussianBlur(cv2.dilate((foot > 0.02).astype(np.float32), np.ones((3, 3), np.uint8)), (3, 3), 0)[..., None]
img[Y0:Y1, X0:X1, :3] = np.clip(roi * (1 - foot) + small * foot, 0, 255).astype(np.uint8)
log['cacao-bag']['DETOX'] = {'tight_box': [X0, Y0, X1 - X0, Y1 - Y0], 'method': 'tilted label: 4x, five letters swapped along the tilt (X O E D T), blended back over the word only', 'glyph_groups': len(segs), 'order': order}
json.dump(log, open(f'{D}/garbled/garble-log.json', 'w'), indent=1, default=int)
cv2.imwrite(f'{D}/garbled/cacao-bag.png', img)
cv2.imwrite(f'{D}/garbled/cacao-bag-640.png', cv2.resize(img, (640, 640), interpolation=cv2.INTER_AREA))
from PIL import Image
a = Image.open(f'{D}/firstimg/cacao-bag.png').convert('RGB').crop((690, 800, 760, 850)).resize((560, 400), Image.LANCZOS)
b = Image.open(f'{D}/garbled/cacao-bag.png').convert('RGB').crop((690, 800, 760, 850)).resize((560, 400), Image.LANCZOS)
t = Image.new('RGB', (1140, 400), 'white'); t.paste(a, (0, 0)); t.paste(b, (580, 0)); t.save(f'{D}/detox-compare.png')
