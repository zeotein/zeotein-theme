#!/usr/bin/env python3
"""Lay out before/after screenshots side by side on one labelled board (PNG).

    python3 tools/compare_board.py OUT.png "Board title" "Subtitle" \
        "Row label|before.png|Before caption|after.png|After caption" [more rows...]

Images are scaled to a common column width; nothing is cropped beyond what the input shots contain.
"""
import sys
from PIL import Image, ImageDraw, ImageFont

PURPLE, PLUM, TEAL, INK, MUTED, LINE, CREAM = (95, 45, 144), (46, 22, 80), (50, 186, 192), (35, 30, 50), (105, 98, 120), (226, 220, 236), (248, 245, 240)
FONT_DIR = "/usr/share/fonts/opentype/inter/"


def font(weight, size):
    for name in (f"Inter-{weight}.otf", "Inter-Regular.otf"):
        try:
            return ImageFont.truetype(FONT_DIR + name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def wrap(draw, text, fnt, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= width:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def main():
    argv = sys.argv[1:]
    col = next((int(a[6:]) for a in argv if a.startswith("--col=")), 1100)
    argv = [a for a in argv if not a.startswith("--col=")]
    out, title, subtitle, *rows = argv
    COL, GAP, PAD = col, 56, 72
    W = PAD * 2 + COL * 2 + GAP
    probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    f_title, f_sub, f_row, f_tag, f_cap = font("Bold", 52), font("Regular", 28), font("SemiBold", 34), font("Bold", 24), font("Regular", 26)
    parsed = []
    for r in rows:
        label, b_path, b_cap, a_path, a_cap = r.split("|")
        imgs = []
        for pth in (b_path, a_path):
            im = Image.open(pth).convert("RGB")
            im = im.resize((COL, round(im.height * COL / im.width)), Image.LANCZOS)
            imgs.append(im)
        caps = [wrap(probe, b_cap, f_cap, COL), wrap(probe, a_cap, f_cap, COL)]
        cap_h = max(len(c) for c in caps) * 36
        parsed.append((label, imgs, caps, cap_h))
    sub_lines = wrap(probe, subtitle, f_sub, W - PAD * 2)
    H = PAD + 64 + len(sub_lines) * 40 + 40
    for label, imgs, caps, cap_h in parsed:
        H += 60 + 44 + max(i.height for i in imgs) + 18 + cap_h + 56
    H += PAD - 40
    board = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(board)
    d.rectangle([0, 0, W, 14], fill=PURPLE)
    y = PAD
    d.text((PAD, y), title, font=f_title, fill=PLUM)
    y += 72
    for ln in sub_lines:
        d.text((PAD, y), ln, font=f_sub, fill=MUTED)
        y += 40
    y += 30
    for label, imgs, caps, cap_h in parsed:
        d.line([PAD, y, W - PAD, y], fill=LINE, width=2)
        y += 22
        d.text((PAD, y), label, font=f_row, fill=PURPLE)
        y += 60
        for k, (im, tag, color) in enumerate(zip(imgs, ("BEFORE  ·  live shop.zeotein.com today", "AFTER  ·  rebuilt block, not pasted yet"), (MUTED, (18, 119, 124)))):
            x = PAD + k * (COL + GAP)
            d.text((x, y), tag, font=f_tag, fill=color)
        y += 40
        img_h = max(i.height for i in imgs)
        for k, im in enumerate(imgs):
            x = PAD + k * (COL + GAP)
            d.rectangle([x - 2, y - 2, x + COL + 1, y + im.height + 1], outline=LINE, width=2)
            board.paste(im, (x, y))
        y += img_h + 18
        for k, cap in enumerate(caps):
            x, yy = PAD + k * (COL + GAP), y
            for ln in cap:
                d.text((x, yy), ln, font=f_cap, fill=INK)
                yy += 36
        y += cap_h + 56
    board.save(out, optimize=True)
    print(f"wrote {out} {W}x{H}")


if __name__ == "__main__":
    main()
