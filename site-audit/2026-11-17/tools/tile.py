import sys
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]
seg = int(sys.argv[3]) if len(sys.argv) > 3 else 1400
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 4
im = Image.open(src).convert('RGB')
w, h = im.size
tiles = [im.crop((0, y, w, min(y + seg, h))) for y in range(0, h, seg)]
pages = [tiles[i:i + cols] for i in range(0, len(tiles), cols)]
for pi, group in enumerate(pages):
    sheet = Image.new('RGB', (cols * (w + 12), seg + 20), (40, 40, 40))
    d = ImageDraw.Draw(sheet)
    for i, t in enumerate(group):
        x = i * (w + 12)
        sheet.paste(t, (x, 20))
        d.text((x + 4, 4), f'y={ (pi*cols+i)*seg }', fill='white')
    sheet.save(out.replace('.jpg', f'-{pi+1}.jpg'), quality=82)
    print(out.replace('.jpg', f'-{pi+1}.jpg'))
