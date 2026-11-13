# Trim white margins from product photos and make the white background transparent (edge flood fill).
import sys
from PIL import Image, ImageFilter, ImageChops, ImageDraw
src, dst = sys.argv[1], sys.argv[2]
THR = int(sys.argv[3]) if len(sys.argv) > 3 else 243
im = Image.open(src).convert('RGB')
w, h = im.size
# mask of "background" = near-white pixels connected to the border
g = im.convert('L')
near = g.point(lambda v: 255 if v >= THR else 0)          # candidate background
mask = Image.new('L', (w + 2, h + 2), 255)
mask.paste(near, (1, 1))
# flood fill from the padded border so only edge-connected white is background
ImageDraw.floodfill(mask, (0, 0), 128, thresh=0)
bg = mask.crop((1, 1, w + 1, h + 1)).point(lambda v: 255 if v == 128 else 0)
alpha = ImageChops.invert(bg).filter(ImageFilter.GaussianBlur(1.2))
rgba = im.copy(); rgba.putalpha(alpha)
bbox = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
pad = 8
bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad))
out = rgba.crop(bbox)
out.save(dst)
print(dst, out.size)
