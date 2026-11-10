import base64, re, os, html

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, 'img')

def data_uri(name):
    path = os.path.join(IMG, name + '.jpg')
    with open(path, 'rb') as f:
        return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()

def esc(s):
    return html.escape(str(s), quote=True)

def money(v):
    return '${:,.0f}'.format(v)

# ---------- Chart 1: monthly net sales (single series, vertical bars) ----------
def bars_monthly(values, labels, cls, fmt, partial_last=True, title=''):
    W, H = 640, 260
    left, right, top, bottom = 52, 12, 18, 34
    pw, ph = W - left - right, H - top - bottom
    vmax = max(values)
    # nice max
    step_candidates = [1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000]
    target = vmax / 4
    step = next(s for s in step_candidates if s >= target)
    top_val = step * (int(vmax / step) + (1 if vmax % step else 0))
    if top_val < vmax:
        top_val += step
    n = len(values)
    slot = pw / n
    bw = min(30, slot * 0.62)
    out = [f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="{esc(title)}">']
    k = 0
    while k <= top_val + 1e-9:
        y = top + ph - (k / top_val) * ph
        out.append(f'<line class="grid" x1="{left}" x2="{W-right}" y1="{y:.1f}" y2="{y:.1f}"/>')
        out.append(f'<text x="{left-8}" y="{y+4:.1f}" text-anchor="end">{esc(fmt(k))}</text>')
        k += step
    for i, (v, lab) in enumerate(zip(values, labels)):
        x = left + slot * i + (slot - bw) / 2
        h = (v / top_val) * ph
        y = top + ph - h
        r = min(4, h / 2)
        op = ' opacity="0.45"' if (partial_last and i == n - 1) else ''
        # rounded top corners only
        path = (f'M{x:.1f},{top+ph:.1f} L{x:.1f},{y+r:.1f} Q{x:.1f},{y:.1f} {x+r:.1f},{y:.1f} '
                f'L{x+bw-r:.1f},{y:.1f} Q{x+bw:.1f},{y:.1f} {x+bw:.1f},{y+r:.1f} L{x+bw:.1f},{top+ph:.1f} Z')
        tip = f'{lab}: {fmt(v)}' + (' (Nov 1–9 only)' if (partial_last and i == n - 1) else '')
        out.append(f'<path class="{cls} mark" d="{path}"{op}><title>{esc(tip)}</title></path>')
        out.append(f'<text x="{x+bw/2:.1f}" y="{H-12}" text-anchor="middle">{esc(lab)}</text>')
    # direct labels: peak and last full month
    peak_i = values.index(vmax)
    for i in sorted({peak_i, n - 2}):
        v = values[i]
        x = left + slot * i + slot / 2
        y = top + ph - (v / top_val) * ph - 6
        out.append(f'<text class="lbl" x="{x:.1f}" y="{y:.1f}" text-anchor="middle">{esc(fmt(v))}</text>')
    out.append('</svg>')
    return ''.join(out)

months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
sales = [25451, 20402, 22876, 29473, 28241, 18761, 14143, 15282, 14253, 12493, 7879, 2610]
newc = [164, 88, 65, 94, 66, 29, 16, 34, 25, 41, 17, 3]

def kfmt(v):
    return '$0' if v == 0 else ('${:.0f}K'.format(v / 1000) if v % 1000 == 0 else '${:,.1f}K'.format(v / 1000))

svg_sales = bars_monthly(sales, months, 's1', kfmt, title='Net sales by month, Dec 2025 to Nov 2026')
svg_newc = bars_monthly(newc, months, 's2', lambda v: f'{v:,.0f}', title='New customers by month')

# ---------- Chart 2: funnel, per 100 visitors, two periods ----------
def funnel():
    steps = ['Visited', 'Added to cart', 'Reached checkout', 'Ordered']
    mar = [100, 13.2, 12.0, 6.4]
    nov = [100, 4.7, 3.6, 0.6]
    W, rowh = 640, 52
    left, right, top = 132, 52, 8
    H = top + rowh * len(steps) + 8
    pw = W - left - right
    out = [f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="Out of 100 visitors: March vs November">']
    for i, s in enumerate(steps):
        y0 = top + i * rowh
        out.append(f'<text x="{left-10}" y="{y0+rowh/2+4:.1f}" text-anchor="end" class="lbl" style="font-weight:600">{esc(s)}</text>')
        for j, (vals, cls, lab) in enumerate([(mar, 's1', 'March'), (nov, 's2', 'Nov 1–9')]):
            v = vals[i]
            bh = 16
            y = y0 + 8 + j * (bh + 4)
            w = max(2.0, pw * v / 100)
            r = min(4, w / 2)
            path = (f'M{left},{y:.1f} L{left+w-r:.1f},{y:.1f} Q{left+w:.1f},{y:.1f} {left+w:.1f},{y+r:.1f} '
                    f'L{left+w:.1f},{y+bh-r:.1f} Q{left+w:.1f},{y+bh:.1f} {left+w-r:.1f},{y+bh:.1f} L{left},{y+bh:.1f} Z')
            out.append(f'<path class="{cls} mark" d="{path}"><title>{esc(lab)}: {v:g} of 100 visitors</title></path>')
            out.append(f'<text x="{left+w+6:.1f}" y="{y+bh-4:.1f}">{v:g}</text>')
    out.append('</svg>')
    return ''.join(out)

# ---------- Chart 3: price per serving ----------
def price_chart():
    rows = [
        ("Ka'Chava single-serve packets", 5.00, False),
        ('Zeotein Vegan, 30 sticks', 4.67, True),
        ("Ka'Chava bag", 4.66, False),
        ('Zeotein Cacao, 30 sticks', 4.50, True),
        ('Zeotein Cacao, bulk bag', 3.67, True),
        ('Huel Black Edition', 3.53, False),
        ('Ritual Essential Protein', 3.27, False),
        ('Truvani Plant Protein', 3.00, False),
        ('Ancient Nutrition Bone Broth Protein', 2.65, False),
        ('KOS Organic Plant Protein', 2.14, False),
        ('Equip Prime Protein (beef)', 2.13, False),
        ('Garden of Life Raw Protein', 2.04, False),
        ('Paleovalley Bone Broth Protein', 2.00, False),
        ('Orgain Organic Protein', 1.90, False),
        ('Vital Proteins Collagen Peptides', 1.61, False),
    ]
    W, rowh = 760, 24
    left, right, top = 236, 54, 6
    H = top + rowh * len(rows) + 22
    pw = W - left - right
    vmax = 5.5
    out = [f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="Price per serving, one-time purchase">']
    for t in [0, 1, 2, 3, 4, 5]:
        x = left + pw * t / vmax
        out.append(f'<line class="grid" x1="{x:.1f}" x2="{x:.1f}" y1="{top}" y2="{top + rowh*len(rows)}"/>')
        out.append(f'<text x="{x:.1f}" y="{H-6}" text-anchor="middle">${t}</text>')
    for i, (name, v, z) in enumerate(rows):
        y = top + i * rowh + 5
        bh = rowh - 9
        w = pw * v / vmax
        r = min(4, w / 2)
        cls = 's1' if z else 's2'
        path = (f'M{left},{y:.1f} L{left+w-r:.1f},{y:.1f} Q{left+w:.1f},{y:.1f} {left+w:.1f},{y+r:.1f} '
                f'L{left+w:.1f},{y+bh-r:.1f} Q{left+w:.1f},{y+bh:.1f} {left+w-r:.1f},{y+bh:.1f} L{left},{y+bh:.1f} Z')
        weight = ' class="lbl"' if z else ''
        out.append(f'<text x="{left-10}" y="{y+bh-3:.1f}" text-anchor="end"{weight}>{esc(name)}</text>')
        out.append(f'<path class="{cls} mark" d="{path}"><title>{esc(name)}: ${v:.2f} a serving</title></path>')
        out.append(f'<text x="{left+w+6:.1f}" y="{y+bh-3:.1f}"{weight}>${v:.2f}</text>')
    out.append('</svg>')
    return ''.join(out)

svgs = {'sales': svg_sales, 'newcust': svg_newc, 'funnel': funnel(), 'price': price_chart()}

src = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
src = re.sub(r'\{\{SVG:(\w+)\}\}', lambda m: svgs[m.group(1)], src)
used = set(re.findall(r'\{\{IMG:(\w+)\}\}', src))
cache = {n: data_uri(n) for n in used}
src = re.sub(r'\{\{IMG:(\w+)\}\}', lambda m: cache[m.group(1)], src)
assert '{{' not in src, 'unreplaced placeholder'
out = os.path.join(HERE, 'zeotein-store-audit.html')
open(out, 'w', encoding='utf-8').write(src)
print('wrote', out, round(len(src) / 1024), 'KB; images used:', len(used))
