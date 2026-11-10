from PIL import Image
import sys
files = sys.argv[2:]
ims = [Image.open(f) for f in files]
W = max(i.width for i in ims)
H = sum(i.height for i in ims)
s = Image.new('RGB', (W, H), 'white')
y = 0
for i in ims:
    s.paste(i, (0, y))
    y += i.height
s.thumbnail((1400, 99999))
s.save(sys.argv[1])
print(s.size)
