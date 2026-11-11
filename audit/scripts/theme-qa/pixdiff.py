import sys, glob, os
from PIL import Image, ImageChops
d = sys.argv[1]
for live in sorted(glob.glob(f'{d}/*-live.png')):
    name = os.path.basename(live)[:-9]
    a = Image.open(live).convert('RGB'); b = Image.open(f'{d}/{name}-preview.png').convert('RGB')
    if a.size != b.size:
        print(f'{name:14s} SIZE DIFF live={a.size} preview={b.size}')
        h = min(a.height, b.height); a = a.crop((0, 0, a.width, h)); b = b.crop((0, 0, b.width, h))
    diff = ImageChops.difference(a, b).convert('L').point(lambda v: 255 if v > 24 else 0)
    bbox = diff.getbbox()
    n = sum(1 for v in diff.getdata() if v)
    pct = 100.0 * n / (a.width * a.height)
    print(f'{name:14s} size={a.size} changed_pixels={n} ({pct:.3f}%) bbox={bbox}')
    if bbox:
        # save a crop of the changed region from both, side by side, for inspection
        x0, y0, x1, y1 = bbox; pad = 40
        box = (max(0, x0 - pad), max(0, y0 - pad), min(a.width, x1 + pad), min(a.height, min(y1 + pad, y0 + 1600)))
        ca, cb = a.crop(box), b.crop(box)
        out = Image.new('RGB', (ca.width * 2 + 10, ca.height), 'red'); out.paste(ca, (0, 0)); out.paste(cb, (ca.width + 10, 0))
        out.save(f'{d}/{name}-DIFF.png')
