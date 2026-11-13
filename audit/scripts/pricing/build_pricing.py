"""Builds the Zeotein pricing audit page (zeotein-pricing-audit.html) from computed numbers.
Charts are HTML/CSS (horizontal) or SVG (monthly columns) so they stay readable at phone width."""
import json, html, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
N = json.load(open(os.path.join(HERE, 'numbers.json')))
Q = json.load(open(os.path.join(HERE, 'quality.json'))) if os.path.exists(os.path.join(HERE, 'quality.json')) else None
U, L, FS, SHIP = N['U'], N['L'], N['FS'], N['SHIP']
TH = json.load(open(os.path.join(HERE, 'threshold.json')))
PC = json.load(open(os.path.join(HERE, 'pricecheck.json')))
esc = html.escape

def money(v, d=2):
    s = f"{abs(v):,.{d}f}"
    return ("−$" if v < 0 else "$") + s

def pct(a, b):  # position of value a on 0..b scale as percent
    return max(0.0, min(100.0, a / b * 100))

def tip(*parts):
    return esc(" | ".join(parts), quote=True)

# ---------------------------------------------------------------- chart helpers
def axis_row(maxv, ticks, fmt):
    cells = "".join(f'<span style="left:{pct(t, maxv):.2f}%">{esc(fmt(t))}</span>' for t in ticks)
    return f'<div class="hrow axis" aria-hidden="true"><div class="hlab"></div><div class="htrack axis-track">{cells}</div><div class="hval"></div></div>'

def grid_lines(maxv, ticks):
    return "".join(f'<i class="gl" style="left:{pct(t, maxv):.2f}%"></i>' for t in ticks)

def dumbbell(rows, maxv, ticks):
    out = ['<div class="hchart dumbbell" role="img" aria-label="Price per serving, one-time and subscription, by product">']
    for r in rows:
        name, sub, one, cls, note = r['name'], r.get('sub'), r['one'], r.get('cls', ''), r.get('note', '')
        lo = min(x for x in (sub, one) if x is not None)
        hi = max(x for x in (sub, one) if x is not None)
        seg = ''
        if sub is not None and abs(one - sub) > 0.001:
            seg = f'<i class="db-line" style="left:{pct(lo, maxv):.2f}%;width:{pct(hi, maxv) - pct(lo, maxv):.2f}%"></i>'
        dots = ''
        if sub is not None:
            dots += f'<i class="db-dot sub" style="left:{pct(sub, maxv):.2f}%"></i>'
        dots += f'<i class="db-dot one" style="left:{pct(one, maxv):.2f}%"></i>'
        t = tip(f"{money(one)} one-time" + (f" · {money(sub)} subscribe" if sub is not None else ""), name + (f" · {note}" if note else ""))
        val = money(one) + (f' <span class="muted">/ {money(sub)}</span>' if sub is not None else '')
        out.append(f'<div class="hrow {cls}" tabindex="0" data-tip="{t}"><div class="hlab">{esc(name)}</div>'
                   f'<div class="htrack">{grid_lines(maxv, ticks)}{seg}{dots}</div><div class="hval num">{val}</div></div>')
    out.append(axis_row(maxv, ticks, lambda t: f"${t:.0f}" if t == int(t) else f"${t:.2f}"))
    out.append('</div>')
    return "".join(out)


def rangechart(rows, maxv, ticks, fmt):
    """Market range band (cheapest to priciest comparable) with Zeotein's own price marks on top."""
    out = ['<div class="hchart range" role="img" aria-label="Zeotein price against the market range">']
    for r in rows:
        lo, hi = r['lo'], r['hi']
        band = f'<i class="band" style="left:{pct(lo, maxv):.2f}%;width:{max(0.6, pct(hi, maxv) - pct(lo, maxv)):.2f}%"></i>'
        dots = ''.join(f'<i class="db-dot {k} zt-dot" style="left:{pct(v, maxv):.2f}%"></i>' for v, k in r['ours'])
        t = tip(' · '.join(f"{fmt(v)} {lab}" for v, k, lab in r['ourslab']), r['name'] + f" · market {fmt(lo)} to {fmt(hi)}")
        out.append(f'<div class="hrow" tabindex="0" data-tip="{t}"><div class="hlab">{esc(r["name"])}</div>'
                   f'<div class="htrack">{grid_lines(maxv, ticks)}{band}{dots}</div><div class="hval num">{r["label"]}</div></div>')
    out.append(axis_row(maxv, ticks, lambda t: f"${t:.0f}"))
    out.append('</div>')
    return "".join(out)

def bars(rows, maxv, ticks, fmt=lambda v: money(v, 0)):
    out = ['<div class="hchart bars" role="img">']
    for r in rows:
        w = pct(r['v'], maxv)
        out.append(f'<div class="hrow {r.get("cls", "")}" tabindex="0" data-tip="{tip(r.get("tipv", fmt(r["v"])), r["name"])}"><div class="hlab">{esc(r["name"])}</div>'
                   f'<div class="htrack">{grid_lines(maxv, ticks)}<i class="bar {r.get("bcls", "")}" style="width:{w:.2f}%"></i></div>'
                   f'<div class="hval num">{r.get("label", fmt(r["v"]))}</div></div>')
    out.append(axis_row(maxv, ticks, lambda t: f"${t:,.0f}"))
    out.append('</div>')
    return "".join(out)

def stacked(rows, maxv, ticks, keys):
    out = ['<div class="hchart stacked" role="img">']
    for r in rows:
        segs = ''
        for k, cls, lab in keys:
            v = r['parts'].get(k, 0)
            if v <= 0:
                continue
            segs += f'<i class="seg {cls}" style="width:{pct(v, maxv):.2f}%" data-tip="{tip(money(v), lab + " · " + r["name"])}" tabindex="-1"></i>'
        out.append(f'<div class="hrow {r.get("cls", "")}" tabindex="0" data-tip="{tip(r["tipv"], r["name"])}"><div class="hlab">{esc(r["name"])}</div>'
                   f'<div class="htrack">{grid_lines(maxv, ticks)}<span class="segs">{segs}</span></div><div class="hval num">{r["label"]}</div></div>')
    out.append(axis_row(maxv, ticks, lambda t: f"${t:,.0f}"))
    out.append('</div>')
    return "".join(out)

def segmented(rows, keys):
    """Tall segmented bars: each row is one whole (what the customer paid), split into parts."""
    out = ['<div class="segchart">']
    for r in rows:
        total = r['total']
        blocks = ''
        for k, cls, lab in keys:
            v = r['parts'][k]
            if v <= 0:
                continue
            share = v / total * 100
            txt = money(v, 0) if share >= 13 else ''
            blocks += (f'<span class="blk {cls}" style="flex:{v:.4f} 1 0" tabindex="0" '
                       f'data-tip="{tip(money(v), lab + " · " + r["name"] + f" · {share:.0f}% of {money(total)}")}">{txt}</span>')
        out.append(f'<div class="segrow"><div class="seg-head"><span class="seg-name">{esc(r["name"])}</span>'
                   f'<span class="seg-meta num">customer pays {money(total)} · <b>{money(r["parts"]["left"])} left</b></span></div>'
                   f'<div class="segbar" role="img" aria-label="{esc(r["name"])}: customer pays {money(total)}, {money(r["parts"]["left"])} left after costs">{blocks}</div></div>')
    out.append('</div>')
    return "".join(out)

def pnl_svg(months, gp, ads, opex):
    W, H, pl, pr, pt, pb = 760, 300, 46, 10, 14, 34
    maxv = 25000
    ih = H - pt - pb
    iw = W - pl - pr
    gw = iw / len(months)
    bw = min(18, gw * 0.3)
    y = lambda v: pt + ih - v / maxv * ih
    s = [f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="Monthly gross profit against marketing and other operating costs, January to October 2026">']
    for t in range(0, maxv + 1, 5000):
        s.append(f'<line class="grid" x1="{pl}" x2="{W - pr}" y1="{y(t):.1f}" y2="{y(t):.1f}"/>')
        s.append(f'<text x="{pl - 8}" y="{y(t) + 4:.1f}" text-anchor="end">{"0" if t == 0 else f"{t // 1000}K"}</text>')
    def rect(x, ybot, ytop, cls, label, val, m, rounded):
        """Column from pixel ybot up to ytop; 4px rounded data end only on the top segment."""
        r = min(4, max(0, (ybot - ytop) / 2)) if rounded else 0
        if r:
            path = (f'M{x:.1f},{ybot:.1f} V{ytop + r:.1f} Q{x:.1f},{ytop:.1f} {x + r:.1f},{ytop:.1f} H{x + bw - r:.1f} '
                    f'Q{x + bw:.1f},{ytop:.1f} {x + bw:.1f},{ytop + r:.1f} V{ybot:.1f} Z')
        else:
            path = f'M{x:.1f},{ybot:.1f} V{ytop:.1f} H{x + bw:.1f} V{ybot:.1f} Z'
        return f'<path class="mark {cls}" d="{path}" tabindex="0" data-tip="{tip(money(val, 0), label + " · " + m + " 2026")}"/>'
    base = y(0)
    for i, m in enumerate(months):
        cx = pl + gw * i + gw / 2
        x1 = cx - bw - 1
        x2 = cx + 1
        s.append(rect(x1, base, y(gp[i]), 's2', 'Gross profit', gp[i], m, True))
        ya = y(ads[i])
        s.append(rect(x2, base, ya, 's3', 'Marketing', ads[i], m, False))
        # 2px surface gap between the two stacked segments
        s.append(rect(x2, ya - 2, min(ya - 2, y(ads[i] + opex[i])), 's1', 'Other operating costs', opex[i], m, True))
        s.append(f'<text x="{cx:.1f}" y="{H - 12}" text-anchor="middle">{m}</text>')
    # selective labels: October
    i = len(months) - 1
    cx = pl + gw * i + gw / 2
    s.append(f'<text class="lbl" x="{cx - 3:.1f}" y="{y(gp[i]) - 6:.1f}" text-anchor="end">$4.1K</text>')
    s.append(f'<text class="lbl" x="{cx + 1 + bw / 2:.1f}" y="{y(ads[i] + opex[i]) - 6:.1f}" text-anchor="middle">$17.1K</text>')
    s.append('</svg>')
    return "".join(s)

def table(head, rows, right=()):
    th = "".join(f'<th class="{"r" if i in right else ""}">{h}</th>' for i, h in enumerate(head))
    trs = "".join("<tr>" + "".join(f'<td class="{"r" if i in right else ""}">{c}</td>' for i, c in enumerate(r)) + "</tr>" for r in rows)
    return f'<div class="tbl-wrap"><table><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table></div>'

def tableview(title, head, rows, right=()):
    return f'<details class="tv"><summary>{esc(title)}</summary>{table(head, rows, right)}</details>'

# ---------------------------------------------------------------- data
COMP = [  # name, servings, one-time price, ongoing subscribe price (None if unclear), protein g, group, note  (brand sites, Nov 10–12, 2026; chocolate where it exists)
    ("Ka'Chava shake", 15, 69.95, 59.95, 25, 'shake', 'all-in-one shake'),
    ("Zeotein Cacao 30 sticks", 30, 134.99, 114.99, 23, 'zt', 'store prices'),
    ("Zeotein Cacao bag", 30, 109.99, 99.99, 23, 'zt', 'store prices'),
    ("Huel Black Edition", 17, 60.00, 45.00, 40, 'shake', 'meal shake'),
    ("Ritual Essential Protein", 15, 49.00, 44.00, 20, 'plant', 'plant protein'),
    ("Bulletproof collagen + MCT", 15, 44.95, None, 18, 'broth', 'chocolate collagen; subscribe rate unclear'),
    ("Truvani plant protein", 20, 59.99, None, 20, 'plant', 'plant protein; ongoing subscribe rate not stated'),
    ("Ancient Nutrition bone broth", 20, 52.95, 45.01, 20, 'broth', 'first subscription order 35% off, then 15%'),
    ("Perfect Keto collagen + MCT", 20, 43.99, 35.19, 10, 'broth', 'chocolate collagen'),
    ("KOS plant protein", 28, 59.99, 47.99, 20, 'plant', '20% off every subscription order'),
    ("Equip Prime Protein", 30, 63.99, 54.39, 21, 'broth', 'beef protein isolate'),
    ("Paleovalley bone broth", 30, 59.99, 47.99, 13, 'broth', 'bone broth protein'),
    ("Vital Proteins chocolate collagen", 14, 27.00, 22.95, 18, 'broth', 'collagen'),
    ("Orgain plant protein", 20, 37.99, 32.29, 21, 'plant', 'plant protein'),
    ("Primal Kitchen Collagen Fuel", 24, 39.99, 35.99, 11, 'broth', 'collagen'),
]
LP = dict(name="Zeotein bag, first order on Meta page", one=76.99 / 30, sub=None, cls='zt lp', note='$76.99 delivered, then $99.99')

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
gp = [6117.05, 9351.10, 18662.95, 16961.57, 7159.07, 8003.97, 8121.35, 8847.81, 7422.12, 4050.19]
ads = [2597.00, 1368.22, 1616.81, 1289.69, 1913.07, 2182.97, 9386.72, 8556.31, 9742.70, 7073.70]
totexp = [3389.76, 7416.88, 9022.36, 23938.51, 3004.05, 4809.00, 16089.04, 12447.36, 16951.44, 17086.09]
opex = [round(t - a, 2) for t, a in zip(totexp, ads)]
ni = [2737.91, 1953.55, 9653.38, -6960.50, 4174.08, 3332.09, -7867.41, -3453.52, -9432.65, -12882.11]
income = [22347.61, 23209.17, 31784.36, 30763.70, 20565.57, 15565.06, 17101.75, 15317.26, 13242.25, 8357.64]

# ---------------------------------------------------------------- sections
def sec(id_, eyebrow, title, lead, body):
    return (f'<section class="block" id="{id_}"><div class="wrap"><div class="sec-head"><p class="eyebrow">{eyebrow}</p>'
            f'<h2>{title}</h2><p class="lede">{lead}</p></div>{body}</div></section>')

def card(q, chip, chipcls, body):
    return f'<article class="qa"><div class="qa-top"><h3>{q}</h3><span class="chip {chipcls}">{chip}</span></div><p>{body}</p></article>'

parts = []

# Answers
answers = "".join([
    card("Is my pricing the problem?", "No", "good",
         "Per serving, the Cacao bag ($3.67) and sticks ($4.50) sit at or below Ka'Chava ($4.66), the closest premium shake. "
         "Your Meta landing-page offer, $76.99 delivered for 30 servings, is one of the best first-order deals in the market. "
         "You only look expensive next to bone-broth and collagen tubs ($1.67 to $3.00 a serving), and that is who Google puts you beside."),
    card("Is it my costs?", "Not product costs", "warn",
         "A bag costs $29.04 to make and leaves $69 to $75 after shipping, box and card fees at full price. "
         "The problem is spending. Since July, marketing has averaged $8,690 a month, more than the $7,110 of gross profit it helped bring in, "
         "before any other overhead. In October the marketing line was $7,074 and the store gained 17 new customers."),
    card("Do people just want free shipping?", "Unproven, so test it", "info",
         "Cheaper shipping didn't raise checkout completion, and shoppers who type an email finish at the same rate with or without a shipping charge. "
         "But most people who leave checkout never type an email, so that data can't see them. "
         "Test it at $75: every bag and stick pack qualifies, even with a 15% code. With no extra orders it costs $77 to $208 a month. "
         "It pays for itself at 2 to 4 extra orders a month, and I'd expect 3 to 5."),
    card("Should the 7-Day cost more per serving?", "Yes", "good",
         "Smaller packs should cost more per serving, and yours is set right: 56% above the bag per serving, against a market median of 57% for single-serve formats. "
         "Keep $39.99. What hurts is the $10.23 of shipping on top, which takes it to $7.17 a serving."),
    card("Is the $150 free-shipping line doing anything?", "No", "bad",
         f"In 90 days, {SHIP['band_99_149']} web orders landed between $99 and $149.99 and only {SHIP['band_150_175']} between $150 and $175, so it isn't pulling carts up. "
         "Every core product sits under it, and a bag plus a 7-Day comes to $149.98, two cents short."),
    card("So what would make money?", "Volume, not price", "info",
         "Run the holiday free-shipping test. If shipping turns out to matter, fix renewal shipping next. Put the real effort into what a customer costs to win and how long they stay. "
         "A 10% price rise on everything would add about $800 a month at October volume, and October lost $12,882."),
])
parts.append(sec('answers', 'The short version', 'Straight answers',
                 'Six questions from your note, answered from your own numbers.', f'<div class="qa-grid">{answers}</div>'))

# Market
rows = []
for name, sv, one, sub, prot, grp, note in COMP:
    r = dict(name=name, one=one / sv, sub=(sub / sv if sub else None), note=note)
    if grp == 'zt':
        r['cls'] = 'zt'
    rows.append(r)
rows.insert(3, LP)
rows.sort(key=lambda r: -r['one'])
ticks = [0, 1, 2, 3, 4, 5]
chart = dumbbell(rows, 5.0, ticks)
legend = ('<div class="legend"><span><i class="lg-dot one"></i>One-time price</span><span><i class="lg-dot sub"></i>Subscription price</span>'
          '<span><i class="lg-dot zt"></i>Zeotein</span></div>')
tv_rows = []
for name, sv, one, sub, prot, grp, note in COMP:
    tv_rows.append([esc(name), str(sv), money(one), money(sub) if sub else '—', money(one / sv), money(sub / sv) if sub else '—', f"{prot} g", money(one / sv / (prot / 10))])
body = (f'<div class="chart-card"><h3>Price per serving</h3>{legend}{chart}'
        '<p class="note">Brand-site prices checked Nov 10–12, 2026. Subscription = the brand\'s ongoing subscribe price. '
        'Zeotein store subscriptions renew at $99.99 (bag) and $114.99 (sticks); the intro price lives only on funnels and landing pages.</p>'
        + tableview('Table view: prices, servings and price per 10 g of protein',
                    ['Product', 'Servings', 'One-time', 'Subscribe', '$/serving', '$/serving sub', 'Protein', '$/10 g protein'],
                    tv_rows, right=(1, 2, 3, 4, 5, 6, 7)) + '</div>'
        '<div class="split"><div class="panel"><h4>Why Meta shoppers see a fair price</h4><p>Ka\'Chava sells 15 servings for $69.95. The same 30 servings from them cost $139.90, '
        'and you charge $109.99 one-time or $76.99 delivered as a first subscription order. On Meta you compete with shakes, and you win on price per serving.</p></div>'
        '<div class="panel"><h4>Why Google shoppers see an expensive tub</h4><p>Search "bone broth protein" and the bag sits next to Ancient Nutrition ($52.95), Equip ($63.99) and Paleovalley ($59.99). '
        'Per serving you cost 38% to 84% more, but a Zeotein serving carries more protein: per 10 g of protein you\'re at $1.59, level with Paleovalley ($1.54) and below the collagen-plus-MCT mixes ($1.66 to $2.20). '
        'Pages that sell "protein" lose the sticker comparison. Pages that sell six ingredients in one scoop can win it.</p></div></div>')
parts.append(sec('market', 'Price vs the market', 'Price per serving against 13 rivals',
                 'Per serving, Cacao sits between Ka\'Chava and Huel, the shakes you compete with on Meta. Next to bone-broth and collagen tubs it costs 22% to 120% more per serving, mostly because each serving carries more protein and more ingredients.', body))

# Quality
if Q:
    qrows = Q['rows']
    head = Q['head']
    body = (table(head, qrows) + f'<p class="note">{Q["note"]}</p>' + (f'<div class="split">{Q["panels"]}</div>' if Q.get('panels') else ''))
    parts.append(sec('quality', 'Quality', 'What the price buys', Q['lead'], body))


# Every product vs the market
def chip_for(c):
    return {'keep': ('good', 'Keep'), 'fix': ('bad', 'Fix'), 'watch': ('warn', 'Watch')}[c]
crows = []
for c in PC['core']:
    lo = min(v for _, v in c['market']); hi = max(v for _, v in c['market'])
    ours = [(v, 'one' if i == 0 else 'sub') for i, (l, v) in enumerate(c['ours'])]
    crows.append(dict(name=c['name'], lo=lo, hi=hi, ours=ours, ourslab=[(v, k, l.split(' $')[0].lower()) for (v, k), (l, _) in zip(ours, c['ours'])],
                      label=' / '.join(money(v) for _, v in c['ours'])))
srows = []
for x in PC['singles']:
    lab, price, oz, cogs = x['sizes'][-1]
    lo = min(v for _, v in x['market']); hi = max(v for _, v in x['market'])
    srows.append(dict(name=f"{x['name']} ({lab})", lo=lo, hi=hi, ours=[(price / oz, 'one')], ourslab=[(price / oz, 'one', 'yours')], label=money(price / oz) + '/oz'))
legend = ('<div class="legend"><span><i class="lg-band"></i>Market range (cheapest to priciest comparable)</span>'
          '<span><i class="lg-dot zt-one"></i>Yours, one-time</span><span><i class="lg-dot zt"></i>Yours, subscribe</span></div>')
tbl = []
for c in PC['core']:
    lo = min(v for _, v in c['market']); hi = max(v for _, v in c['market'])
    cl, ct = chip_for(c['call'])
    tbl.append([f"<b>{esc(c['name'])}</b>", ' / '.join(esc(l) for l, _ in c['ours']), ' / '.join(money(v) for _, v in c['ours']) + '/serving',
                f"{money(lo)}–{money(hi)}", f"{(c['price'] - c['cogs']) / c['price'] * 100:.0f}%", f'<span class="chip {cl}">{ct}</span> {esc(c["rec"])}<br><span class="muted">{esc(c["why"])}</span>'])
for x in PC['singles']:
    lo = min(v for _, v in x['market']); hi = max(v for _, v in x['market'])
    cl, ct = chip_for(x['call'])
    tbl.append([f"<b>{esc(x['name'])}</b>", ' / '.join(f"{l} {money(p)}" for l, p, o, c in x['sizes']), ' / '.join(f"{money(p / o)}" for l, p, o, c in x['sizes']) + '/oz',
                f"{money(lo)}–{money(hi)}/oz", ' / '.join(f"{(p - c) / p * 100:.0f}%" for l, p, o, c in x['sizes']), f'<span class="chip {cl}">{ct}</span> {esc(x["rec"])}<br><span class="muted">{esc(x["why"])}</span>'])
body = (f'<div class="chart-card"><h3>Shakes and stick packs, price per serving</h3>{legend}{rangechart(crows, 8.0, [0, 2, 4, 6, 8], lambda v: money(v))}'
        '<p class="note">Comparables: Ka\'Chava, Huel, Ancient Nutrition, Paleovalley and Equip for the bag; single-serve packets from Ka\'Chava, Ancient Nutrition, Orgain and Sprout Living for sticks and the 7-Day; Ritual, Truvani and plant packets for Vegan.</p></div>'
        f'<div class="chart-card"><h3>Single ingredients, price per ounce (largest size)</h3>{rangechart(srows, 7.0, [0, 1, 2, 3, 4, 5, 6, 7], lambda v: money(v))}'
        f'<p class="note">{esc(PC["note"])}. Zeotein margins are product margin after product cost, before shipping and card fees.</p></div>'
        + table(['Product', 'Your prices', 'Per serving or ounce', 'Market', 'Product margin', 'Call'], tbl) +
        '<div class="split"><div class="panel"><h4>What I\'d change</h4><p>Zeolite 1 lb from $64.99 to $54.99, so a bigger size never costs more per ounce. '
        'Optional: 30 stick packs one-time from $134.99 to $139.99 (subscribers keep $114.99). Nothing else needs a price move to sell.</p></div>'
        '<div class="panel"><h4>What I wouldn\'t touch</h4><p>Hemp and sea moss cost more than the mass brands, but your own cost per ounce is close to their shelf price, so cutting would wipe out the margin. '
        'Sell them as premium, keep them out of Shopping ads, and let Cacao carry the business.</p></div></div>')
parts.append(sec('prices', 'Every product', 'Every product, priced against the market',
                 'Your Cacao line is priced right against the brands shoppers compare it with. One price is broken (zeolite 1 lb), Vegan is the most expensive plant shake in the market, and a few singles cost more than mass brands because your ingredients cost more.', body))

# Checkout totals (landed)
LANDED = json.load(open(os.path.join(HERE, 'landed.json')))
lrows = []
for r in LANDED['rows']:
    tot = r['price'] + r['ship']
    lab = f"{money(tot)} <span class=\"muted\">· {money(tot / r['servings'])}/serving</span>"
    lrows.append(dict(name=r['name'], cls=r.get('cls', ''), parts=dict(price=r['price'], ship=r['ship']), label=lab,
                      tipv=f"{money(tot)} at checkout · {r['servings']} servings", ))
chart = stacked(lrows, 160, [0, 40, 80, 120, 160], [('price', 's2', 'Product price'), ('ship', 's3', 'Shipping')])
legend = '<div class="legend"><span><i class="lg-sq s2"></i>Product price</span><span><i class="lg-sq s3"></i>Shipping charged</span><span><i class="lg-dot zt"></i>Zeotein</span></div>'
body = (f'<div class="chart-card"><h3>First full-size order, one-time, no codes</h3>{legend}{chart}<p class="note">{LANDED["note"]}</p>'
        + tableview('Table view', ['Order', 'Servings', 'Product', 'Shipping', 'Total', 'Per serving'],
                    [[esc(r['name']), str(r['servings']), money(r['price']), money(r['ship']), money(r['price'] + r['ship']), money((r['price'] + r['ship']) / r['servings'])] for r in LANDED['rows']],
                    right=(1, 2, 3, 4, 5)) + '</div>')
parts.append(sec('checkout', 'Checkout total', 'What a first order costs at checkout', LANDED['lead'], body))

# Shipping
facts = "".join([
    '<div class="fact"><h4>You charge more than shipping costs you</h4><p>Your rates are Shopify\'s USPS price plus a $2.00 handling fee. '
    'Shoppers who paid shipping on a single item paid $11.95 (sticks) to $12.39 (bag) on average. The real label averaged $8.88 for sticks and $9.52 for a bag. '
    'Rivals that charge under their line charge a flat $7.95 to $9.99.</p></div>',
    f'<div class="fact"><h4>Renewals pay shipping too</h4><p>{SHIP["renewals_paying"]} of {SHIP["renewals_n"]} renewals in the last 90 days paid shipping, {money(SHIP["renewals_avg_paid"])} on average. '
    'The "free shipping on subscriptions over $119.99" discount set up in March never reaches renewals: all 35 renewals between $119.99 and $149.99 paid shipping, '
    'because renewals are re-priced at the store\'s normal rates. Only renewals of $150 or more ship free. Funnel subscriptions do ship free.</p></div>',
    f'<div class="fact"><h4>The $150 line doesn\'t lift carts</h4><p>{SHIP["band_99_149"]} web orders landed at $99 to $149.99 and {SHIP["band_150_175"]} at $150 to $174.99 in 90 days. '
    'Every core product is under the line. A bag plus a 7-Day comes to $149.98. A bag plus a shaker is $125.98.</p></div>',
    '<div class="fact"><h4>What the checkout data can and can\'t see</h4><p>Shoppers who typed an email finished 74% of the time with or without a shipping charge, and the move to cheaper Ground shipping didn\'t change that (75.9% before, 72.1% after). '
    'But in October 102 store sessions reached checkout and 31 finished. Most of the 71 who left never typed an email, so we can\'t see what stopped them. '
    'Across US shoppers, extra costs such as shipping are the most common reason for leaving a checkout '
    '(<a href="https://baymard.com/blog/cart-abandonment-rate" target="_blank" rel="noopener">Baymard Institute</a>).</p></div>',
])
fsrows = [
    dict(name='Every web order', v=TH['90_0']['cost'] if '90_0' in TH else FS['0']['per_month'], label=f"{money(FS['0']['per_month'], 0)}/mo"),
    dict(name='Orders $75+ (test plan)', v=TH['90_75']['cost'], label=f"{money(TH['90_75']['cost'], 0)}/mo", cls='zt'),
    dict(name='Orders $99+', v=TH['90_99']['cost'], label=f"{money(TH['90_99']['cost'], 0)}/mo"),
    dict(name='Orders $100+', v=TH['90_100']['cost'], label=f"{money(TH['90_100']['cost'], 0)}/mo"),
    dict(name='Every renewal (separate change)', v=FS['renewals_all']['per_month'], label=f"{money(FS['renewals_all']['per_month'], 0)}/mo"),
]
for r in fsrows:
    r['tipv'] = f"{money(r['v'], 0)} a month of shipping you'd stop collecting"
chart = bars(fsrows, 400, [0, 100, 200, 300, 400])
SHIPTBL = json.load(open(os.path.join(HERE, 'shiptbl.json')))
body = (f'<div class="facts">{facts}</div>'
        f'<div class="chart-card"><h3>What free shipping would cost each month</h3>{chart}'
        '<p class="note">Shipping charged on US orders, monthly average of the last 90 days. At the last 30 days\' slower pace: $153 for every web order, $77 for $75+, $27 for $99+, $15 for $100+. Extra orders that free shipping brings in also need labels, but each one '
        'brings its own margin, so this is the cost to compare against the extra customers. For comparison, October\'s marketing line alone was $7,074.</p>'
        + tableview('Table view', ['Option', 'Orders affected (90 days)', 'Per month'],
                    [['Every web order', str(FS['0']['orders_90d']), money(FS['0']['per_month'])], ['$75+', str(FS['75']['orders_90d']), money(TH['90_75']['cost'])],
                     ['$99+', str(FS['99']['orders_90d']), money(TH['90_99']['cost'])], ['$100+', '31', money(TH['90_100']['cost'])],
                     ['Every renewal', str(FS['renewals_all']['orders_90d']), money(FS['renewals_all']['per_month'])]],
                    right=(1, 2)) + '</div>'
        f'<h3 class="sub-h">Rivals\' shipping terms</h3>{table(SHIPTBL["head"], SHIPTBL["rows"])}<p class="note">{SHIPTBL["note"]}</p>')
parts.append(sec('shipping', 'Shipping', 'Shipping is the weakest part of the offer',
                 'Your shipping charges run above your own label costs and above what rivals charge, renewals pay it too, and the $150 line doesn\'t change what people buy.', body))

# Margins
def segrow(name, u):
    other = u['label'] + u['box'] + u['fees'] + u['gifts']
    return dict(name=name, total=u['paid'], parts=dict(product=u['cogs'], other=round(other, 2), left=u['left']))
segrows = [
    segrow('Bag, one-time on the store', U['bag_onetime_store']),
    segrow('Bag, store subscription renewal', U['bag_renewal_store']),
    segrow('Bag, first order on the Meta page ($76.99)', U['bag_first_lp']),
    segrow('Bag, renewal of a Meta-page subscriber', U['bag_renewal_lp']),
    segrow('30 sticks, store subscription renewal', U['sticks_renewal_store']),
    segrow('7-Day, one-time', U['day7_onetime']),
    segrow('Black Friday first bag ($68.99)', U['bf_first_bag']),
]
keys = [('product', 's2', 'Product cost'), ('other', 's3', 'Shipping label, box, card fees and gifts'), ('left', 's1', 'Left after these costs')]
legend = '<div class="legend"><span><i class="lg-sq s2"></i>Product cost</span><span><i class="lg-sq s3"></i>Label, box, card fees, gifts</span><span><i class="lg-sq s1"></i>Left for marketing and overhead</span></div>'
mtv = [[esc(r['name']), money(r['total']), money(r['parts']['product']), money(r['parts']['other']), money(r['parts']['left']), f"{r['parts']['left'] / r['total'] * 100:.0f}%"] for r in segrows]
body = (f'<div class="chart-card"><h3>Where each order\'s money goes</h3>{legend}{segmented(segrows, keys)}'
        '<p class="note">Product cost is Wennie\'s October weighted average: bag $29.04, 30 sticks $38.00, 7-Day $9.00. Label is the average real label for that item, Aug to Oct '
        '(bag $9.52, sticks $8.88, 7-Day $7.45). Box $1.30. Card fees 3.3% of what the customer paid. Gifts: shaker $4.66, Save-A-Scoop $3.30. '
        'Store orders include the shipping the customer paid.</p>'
        + tableview('Table view', ['Order', 'Customer pays', 'Product', 'Label, box, fees, gifts', 'Left', 'Left %'], mtv, right=(1, 2, 3, 4, 5)) + '</div>'
        '<div class="split"><div class="panel"><h4>Product margins are healthy and improving</h4><p>Product margin is 74% on a $109.99 bag, 71% on a $99.99 renewal and 72% on $134.99 sticks. '
        'The bag\'s cost fell from $35.71 in May to $29.04 in October, and 30 sticks from $63.82 in January to $38.00.</p></div>'
        f'<div class="panel"><h4>What a subscriber is worth</h4><p>A Meta-page bag subscriber leaves about {money(N["LT"]["lp_bag"], 0)} over the 3.35 payments the average subscriber makes. '
        f'At $80 per new customer they pay back by payment {N["PB"]["80"]:.1f}. At $176 (Meta and Google spend per new customer, last 90 days) it takes {N["PB"]["176"]:.1f} payments, more than the 3.35 the average subscriber makes.</p></div></div>')
parts.append(sec('margins', 'Margins', 'What each order leaves you',
                 'Full-price orders leave $57 to $75 after product, shipping, box and card fees. The intro offers are thin by design: the Meta first bag leaves $26.63 and the Black Friday first bag $18.89, and renewals have to pay back the rest.', body))

# Costs
legend = '<div class="legend"><span><i class="lg-sq s2"></i>Gross profit</span><span><i class="lg-sq s3"></i>Marketing</span><span><i class="lg-sq s1"></i>Other operating costs</span></div>'
ptv = [[m, money(income[i], 0), money(gp[i], 0), money(ads[i], 0), money(opex[i], 0), money(ni[i], 0)] for i, m in enumerate(months)]
stats = ('<div class="mini-stats">'
         '<div class="ms"><span class="ms-l">Revenue needed to break even</span><span class="ms-v">≈ $33,000/mo</span><span class="ms-s">at Jul–Oct marketing and overhead, 48% gross margin. October: $8,358.</span></div>'
         '<div class="ms"><span class="ms-l">New customers a month</span><span class="ms-v">17–41</span><span class="ms-s">Jun–Oct, down from 66–164 in Dec–Apr</span></div>'
         '<div class="ms"><span class="ms-l">Returning customers a month</span><span class="ms-v">46</span><span class="ms-s">in October, down from 112 in March</span></div>'
         '</div>')
body = (f'<div class="chart-card"><h3>Gross profit against spending, 2026</h3>{legend}<div class="svg-scroll">{pnl_svg(months, gp, ads, opex)}</div>'
        '<p class="note">From Wennie\'s Jan–Oct P&amp;L. Gross profit is after product cost, shipping, boxes, card fees and production. Each month shows gross profit on the left and spending on the right. '
        'April\'s other costs include a one-off $22,649 month. The marketing line ($25,373 in Aug–Oct) is bigger than Meta and Google media alone ($13,723 over 90 days), so it includes other marketing costs.</p>'
        + tableview('Table view', ['Month', 'Revenue', 'Gross profit', 'Marketing', 'Other costs', 'Net income'], ptv, right=(1, 2, 3, 4, 5)) + '</div>'
        + stats)
parts.append(sec('costs', 'Costs', 'Is it your costs?',
                 'Product, shipping and fees take about 52 cents of each dollar, which is normal. What changed is marketing: about $1,800 a month from January to June, $8,700 from July to October, while revenue fell from $24,000 to $13,500 a month.', body))

# 7-Day ladder
lad = [
    dict(name='7-Day pack', v=39.99 / 7, d=(39.99 + 10.23) / 7, cls='zt'),
    dict(name='30 sticks, one-time', v=134.99 / 30, d=(134.99 + 11.95) / 30),
    dict(name='30 sticks, subscription', v=114.99 / 30, d=(114.99 + 11.95) / 30),
    dict(name='Bag, one-time', v=109.99 / 30, d=(109.99 + 12.39) / 30),
    dict(name='Bag, subscription', v=99.99 / 30, d=(99.99 + 12.39) / 30),
    dict(name='Bag, first order on Meta page', v=76.99 / 30, d=76.99 / 30),
]
out = ['<div class="hchart bars ladder" role="img" aria-label="Price per serving by pack, with and without shipping">']
mx = 8.0
tk = [0, 2, 4, 6, 8]
for r in lad:
    out.append(f'<div class="hrow {r.get("cls", "")}" tabindex="0" data-tip="{tip(money(r["v"]) + " list · " + money(r["d"]) + " with shipping", r["name"])}"><div class="hlab">{esc(r["name"])}</div>'
               f'<div class="htrack">{grid_lines(mx, tk)}<i class="bar" style="width:{pct(r["v"], mx):.2f}%"></i><i class="db-dot one ship" style="left:{pct(r["d"], mx):.2f}%"></i>'
               f'<i class="ref" style="left:{pct(3.6663 * 1.57, mx):.2f}%"></i></div>'
               f'<div class="hval num">{money(r["v"])} <span class="muted">/ {money(r["d"])}</span></div></div>')
out.append(axis_row(mx, tk, lambda t: f"${t:.0f}"))
out.append('</div>')
legend = '<div class="legend"><span><i class="lg-sq s1"></i>List price per serving</span><span><i class="lg-dot one"></i>With the average shipping paid</span><span><i class="lg-line"></i>Market median trial premium (bag +57%)</span></div>'
body = (f'<div class="chart-card"><h3>Price per serving by pack</h3>{legend}{"".join(out)}'
        '<p class="note">Market median: across 9 brands, single-serve formats cost 57% more per serving than the same brand\'s bulk tub. '
        'Your 7-Day is 56% above the bag and 27% above 30 sticks. Shipping is the average paid by customers who paid it, single-item orders, last 90 days.</p></div>'
        '<div class="split"><div class="panel"><h4>Keep it as it is</h4><p>$39.99, one-time only, no subscribe option. The high per-serving price is what makes the 30-day options read as the deal. '
        'It also makes a good win-back gift, which is how you\'re already using it.</p></div>'
        '<div class="panel"><h4>Watch the shipping on it</h4><p>A $39.99 trial with $10.23 of shipping is $50.22 for a week, $7.17 a serving, the most expensive serving in the whole comparison. '
        'At the $75 test line a single 7-Day still pays shipping and two ship free, which suits a trial whose job is to point people to the 30-day.</p></div></div>')
parts.append(sec('sevenday', 'The 7-Day pack', 'The 7-Day is priced right',
                 'Yes, the smaller pack should cost more per serving. That\'s what makes the 30-day look like the deal, and your step-up matches the market.', body))

# What-ifs
wrows = [
    ['Bag one-time $109.99 → $99.99', money(L['bag_onetime_cut_99.99']['delta']) + ' per order', f"+{L['bag_onetime_cut_99.99']['breakeven_volume_pct']:.0f}% more one-time bag orders", '<span class="chip bad">No</span>'],
    ['Bag one-time $109.99 → $89.99', money(L['bag_onetime_cut_89.99']['delta']) + ' per order', f"+{L['bag_onetime_cut_89.99']['breakeven_volume_pct']:.0f}% more one-time bag orders", '<span class="chip bad">No</span>'],
    ['Store bag subscription from 9% to 15% off ($93.49)', money(L['bag_renewal_15pct_93.49']['delta']) + ' per renewal', f"+{L['bag_renewal_15pct_93.49']['breakeven_volume_pct']:.0f}% more renewals", '<span class="chip bad">No</span> price is behind 3.9% of cancellations'],
    ['30 sticks one-time $134.99 → $139.99', '+' + money(L['sticks_onetime_raise_139.99']['delta']) + ' per order', 'can lose up to 5% of those orders', '<span class="chip warn">Optional</span> small'],
    ['Free shipping on a one-time bag', money(L['bag_onetime_freeship']['delta']) + ' per order', f"+{L['bag_onetime_freeship']['breakeven_volume_pct']:.0f}% more of those orders", '<span class="chip info">Test</span>'],
    ['Free shipping on every web order $75+', '−$77 to −$208 a month', '2 to 4 more orders a month (5% to 8% more web orders)', '<span class="chip info">Test</span>'],
    ['Raise every price 10%', 'about +$800 a month at October volume', 'no volume change assumed', '<span class="chip warn">Too small</span> October lost $12,882'],
]
body = (table(['Change', 'Effect', 'Needed to break even', 'Call'], wrows) +
        '<p class="note">Per-order effects use the margins above. Break-even is the extra volume needed for the change to leave the same total margin. '
        'A new customer is counted at about $83 of margin to date: $172.73 of revenue per recent customer (June-onward cohort) at about 55% margin, less their first order\'s shipping.</p>')
parts.append(sec('whatif', 'What-ifs', 'What a price change would do',
                 'Price cuts need big volume gains to break even, and price rises are too small to matter at today\'s volume. Shipping is the only lever cheap enough to test.', body))


# Which free-shipping line, and what it pays out vs brings in
def net(T, lift, vol='90'):
    base = TH[f'{vol}_{T}']['base']
    return base * lift * 60 - TH[f'{vol}_{T}']['cost']
lines = [
    ['<b>$75 (recommended)</b>', 'Every bag, stick pack and 4-pack, even after a 15% to 30% code; two 7-Days; single-ingredient orders of $75+', f"{money(TH['30_75']['cost'], 0)} / {money(TH['90_75']['cost'], 0)}", '2 to 4 orders', 'Costs about $35 a month more than $99'],
    ['$99', 'Full-price bags and stick packs', f"{money(TH['30_99']['cost'], 0)} / {money(TH['90_99']['cost'], 0)}", '1 to 3 orders', 'A $109.99 bag with a 15% welcome code is $93.49, so it misses free shipping'],
    ['$100', 'Full-price one-time bags and stick packs', f"{money(TH['30_100']['cost'], 0)} / {money(TH['90_100']['cost'], 0)}", '1 to 3 orders', 'Misses the $99.99 bag subscription by one cent'],
    ['$150 (today)', 'Multi-bag orders and 4-packs', '$0', '–', '36 web orders landed just under it in 90 days and 8 just over, so it isn\'t raising cart size'],
]
scen = []
for lab, lift in [('No extra orders', 0), ('5% more web orders', .05), ('10% more (my estimate)', .10), ('20% more', .20)]:
    base = TH['90_75']['base']
    scen.append([lab, f"{base * lift:.1f}", money(base * lift * 60, 0), money(net(75, lift), 0), money(net(99, lift), 0)])
THRESH = ('<h3 class="sub-h">Which line to test</h3>'
          + table(['Free shipping from', 'What qualifies', 'Shipping you\'d stop collecting, per month (last 30 / 90 days\' volume)', 'Pays for itself at', 'Catch'], lines) +
          '<h3 class="sub-h">What it pays out vs what it could bring in, per month</h3>'
          + table(['If free shipping brings', 'Extra orders', 'Extra margin', 'Net at $75', 'Net at $99'], scen, right=(1, 2, 3, 4)) +
          '<p class="note">At the last 90 days\' volume (46 web orders a month). Each extra order is counted at $60, what a first order leaves after product, label, box, card fees and free shipping; '
          'a new subscriber is worth more over time (about $160 over the 3.35 payments the average subscriber makes), so this is the cautious case. '
          'My 10% estimate: about 78 store sessions a month reach checkout and leave without ordering, and extra costs like shipping are the most common reason shoppers give for leaving. '
          'Winning back 1 in 17 of them is about 4.6 orders.</p>')

# Holiday test
spec = [
    ('What', 'Free US shipping on orders of $75 or more: one-time orders and the first order of a new subscription. Renewals stay as they are. Every bag, stick pack and 4-pack qualifies, even after a 15% to 30% code. A 7-Day on its own doesn\'t; two do.'),
    ('When', 'Tuesday Dec 1, 2026, 12:00 am CT to Monday Jan 11, 2027, 11:59 pm CT. It starts the day after Black Friday pricing ends and covers holiday gifting and New Year demand. Your 13 Black Friday discounts are set not to combine with shipping discounts, so running both in the same week would make some shoppers pick one or the other, and the 30% sale would blur the read.'),
    ('How it\'s set up', 'One automatic free-shipping discount: US only, $75 minimum, one-time orders on, subscriptions on for the first order only, combines with product and order discounts, with a start and end date. The shipping rates themselves don\'t change, so it switches itself off and can\'t leak into renewals.'),
    ('Tell people', 'Top bar and cart bar ($150 to $75 for the test), the shipping line on product pages, emails, ads, and Merchant Center shipping so Google Shopping shows free shipping.'),
    ('Cost', 'With no extra orders: $77 to $208 a month in shipping you\'d otherwise collect ($77 at the last 30 days\' volume, $208 at the last 90 days\'), so about $105 to $290 over the six weeks.'),
    ('Break-even', 'About 2 to 4 extra orders a month, which is 5% to 8% more web orders.'),
    ('Baseline', 'Oct 13 to Nov 23, the six weeks before Black Friday. Internal test sessions on Nov 4–5 and Nov 10–11 are excluded.'),
    ('Watch weekly', 'Sessions, add-to-cart rate, checkout starts, orders per 1,000 sessions, new customers, average order, shipping given up, margin per order.'),
    ('Keep it if', 'New customers per 1,000 sessions run at least 15% above the baseline and margin per 1,000 sessions holds. Then make $75+ permanent and decide on renewal shipping. If not, go back to today\'s setup.'),
    ('Read it carefully', 'Holiday traffic isn\'t October traffic and volume is small. Treat a gap under 15% as noise.'),
]
specs = "".join(f'<div class="spec"><dt>{esc(k)}</dt><dd>{esc(v)}</dd></div>' for k, v in spec)
body = (f'<dl class="specs">{specs}</dl>'
        + THRESH + '<div class="decision"><span class="chip warn">Your call</span><p><b>Needed from you:</b> a yes on the dates and the $75 minimum. '
        'I\'ll then create the discount already scheduled, so nothing changes in the store before Dec 1, and set up the weekly read.</p></div>')
parts.append(sec('test', 'Holiday test', 'The holiday free-shipping test',
                 'Six weeks, right after Black Friday, new orders only, at $75. A small, capped bet that answers whether free shipping wins customers.', body))

# Small fixes
fixes = [
    ('Zeolite 1 lb costs more per ounce than the ½ lb', 'warn', 'Quick fix',
     '½ lb is $29.99 ($3.75/oz), 1 lb is $64.99 ($4.06/oz) and 2 lb is $79.99 ($2.50/oz). A bigger size should never cost more per ounce. Set the 1 lb to $54.99 ($3.44/oz): the ladder runs in order and the 2 lb stays the obvious deal.'),
    ('Renewal shipping doesn\'t match the setup', 'warn', 'Decide after the test',
     'The March discount meant to make subscriptions over $119.99 ship free doesn\'t apply to renewals. Making renewals ship free needs a change to how Seal prices renewal shipping, not another discount. All renewals free would cost about $300 a month and turn the 9% subscription saving into about 18% on what a subscriber pays.'),
    ('Vegan: leave the price, don\'t spend on it', 'info', 'Agree with you',
     'It\'s the most expensive product per gram of protein in the market ($2.33 per 10 g), but it still brought in $2,311 over 90 days, mostly from existing customers. Changing the price risks those subscribers for little gain.'),
    ('Singles on Google Shopping', 'info', 'For Orbit\'s Google work',
     'Bone broth, collagen, zeolite, MCT and cacao are priced at market. Hemp (about 2.2x Manitoba Harvest), pumpkin seed (1.6x), sea moss (about 2x mass brands) and lion\'s mane (1.5x) are priced above Amazon, so a Shopping feed led by those will lose most price comparisons.'),
    ('Show proof of quality', 'info', 'Supports the premium',
     'None of your pages mention third-party testing or lab results. If you have test results, especially heavy-metal tests on zeolite and cacao, showing them is the cheapest way to back up a premium price.'),
    ('The $2 handling fee', 'info', 'Decide after the test',
     'It adds $2.00 to every shipping charge, about $60 a month in total, and makes your shipping look higher than rivals\' flat $7.95. If the test says shipping matters, drop it with the rest.'),
]
fx = "".join(f'<article class="fix"><div class="qa-top"><h3>{esc(t)}</h3><span class="chip {c}">{esc(ch)}</span></div><p>{esc(b)}</p></article>' for t, c, ch, b in fixes)
parts.append(sec('fixes', 'Smaller fixes', 'Smaller things worth fixing', 'None of these moves the P&L on its own. Each one makes the offer cleaner.', f'<div class="qa-grid">{fx}</div>'))


# Still open (Nov 13)
items = [
    ('Holiday free-shipping test at $75', 'warn', 'Your call', 'A yes on Dec 1 to Jan 11 and the $75 line. Then I create the discount already scheduled, so nothing changes before Dec 1.'),
    ('Product page cleanup', 'warn', 'Your call', 'Preview: zeotein.com/products/zeotein-cacao-bag-30?preview_theme_id=187923202261. On your yes, Orbit pastes four files into the live theme and I add them to the Black Friday theme.'),
    ('Bulk bag shows only 13 reviews', 'info', 'You or Orbit', 'In Judge.me, add the bulk bag to the Cacao stick-pack review group. Same formula, so all three Cacao pages show 4.98 from 91 reviews.'),
    ('Homepage says "4.9 from 155 reviews"', 'info', 'Orbit', 'Judge.me product reviews add up to about 112, and the agreed wording has no count. Change it to "4.9/5 average rating"; skip "Verified Buyers", since not every review is marked verified.'),
    ('Zeolite 1 lb costs more per ounce than ½ lb', 'warn', 'Your call', '$64.99 to $54.99. I can change it on your yes.'),
    ('Renewals pay shipping under $150', 'warn', 'After the test', 'The March "free shipping on subscriptions over $119.99" discount never reaches renewals. Fixing it needs a Seal change; about $300 a month.'),
    ('$2 handling fee on every shipping charge', 'warn', 'After the test', 'About $60 a month of income, and it makes shipping look higher than rivals\' flat $7.95.'),
    ('Show testing results', 'info', 'You', 'Rivals show NSF or Informed Sport certificates or lab results; your pages mention none. Keep zeolite wording clear of detox claims.'),
    ('Singles in Google Shopping', 'info', 'Orbit', 'Hemp, pumpkin seed, sea moss and lion\'s mane are priced above Amazon, so lead the feed with Cacao and the at-market singles.'),
    ('Script errors', 'good', 'Done Nov 13', 'All five fixes are on the live theme and the Black Friday theme, checked on the live page.'),
]
st = "".join(f'<article class="fix"><div class="qa-top"><h3>{esc(t)}</h3><span class="chip {c}">{esc(ch)}</span></div><p>{esc(b)}</p></article>' for t, c, ch, b in items)
parts.append(sec('open', 'Still open', 'What still needs a decision or a hand', 'Checked against the store on Nov 13. Orbit\'s session isn\'t reachable from here, so the Orbit items are listed for Dana to pass on.', f'<div class="qa-grid">{st}</div>'))

# Sources
src = """<ul class="src">
<li><b>Shopify, live, Nov 12, 2026:</b> product and subscription prices, shipping profiles and rates, active and scheduled discounts, sales by product (90 days and 12 months), monthly orders and new vs returning customers, sessions funnel by month and day.</li>
<li><b>Orders, Aug 14 to Nov 11, 2026:</b> 248 orders with shipping charged and order type (one-time, first subscription, renewal), matched to real label costs for 153 of them. No customer names or contact details were used.</li>
<li><b>Wennie's files (Accounting &amp; Finance):</b> COGS V2 (weighted average cost by month), shipping box log and labels (577 US labels Jan to Oct), Jan–Oct 2026 P&amp;L.</li>
<li><b>Internal records:</b> Seal subscription export of Oct 27 (3.35 payments per customer, cancel reasons), Master Pricing v2 (Oct 8, with the Oct 29 and Nov 9 notes), Ground shipping results.</li>
<li><b>Competitors:</b> brand sites and retailer listings checked Nov 10 to 12, 2026. Full sources in <code>audit/findings/pricing-research.md</code> and <code>audit/findings/pricing-audit-2026-11-12.md</code>.</li>
<li><b>Not counted:</b> payroll and overhead by item, the third-order collagen gift, and returns. All three would lower the margins shown slightly.</li>
</ul>"""
parts.append(sec('sources', 'Sources', 'Where the numbers come from', 'Every figure on this page comes from one of these.', src))

CSS = open(os.path.join(HERE, 'style.css')).read()
JS = open(os.path.join(HERE, 'tip.js')).read()
index = "".join(f'<a href="#{i}">{t}</a>' for i, t in [('answers', 'Answers'), ('open', 'Still open'), ('market', 'Market'), ('quality', 'Quality'), ('prices', 'Every product'), ('checkout', 'Checkout total'), ('shipping', 'Shipping'),
                                                        ('margins', 'Margins'), ('costs', 'Costs'), ('sevenday', '7-Day'), ('whatif', 'What-ifs'), ('test', 'Holiday test'), ('fixes', 'Fixes'), ('sources', 'Sources')] if (i != 'quality' or Q))
mast = f"""<header class="mast"><div class="wrap">
<p class="eyebrow">Pricing audit · Nov 12, 2026 · for Dana and Orbit</p>
<h1>Your prices aren't what's <span>losing money</span></h1>
<p class="verdict">Per serving, Cacao costs less than Ka'Chava, its closest premium rival, with a cleaner label: grass-fed bone broth and collagen, organic cacao, MCT oil and sea moss, and no sugar or sweetener of any kind. Product margins are healthy and getting better. The losses come from what each new customer costs and from overhead that a shrinking revenue base has to carry. Changing prices can't close that gap. Shipping is the one part of the offer that's out of line with the market, and it's cheap to test.</p>
<div class="kpis">
<div class="kpi"><span class="k-label">Cacao bag, per serving</span><span class="k-val">$3.67</span><span class="k-sub">Ka'Chava: $4.66, so 21% less</span></div>
<div class="kpi"><span class="k-label">Product margin, bag</span><span class="k-val">74%</span><span class="k-sub">costs $29.04, down from $35.71 in May</span></div>
<div class="kpi bad"><span class="k-label">October marketing vs revenue</span><span class="k-val">85%</span><span class="k-sub">$7,074 spent on $8,358 of revenue</span></div>
<div class="kpi"><span class="k-label">Free shipping test at $75</span><span class="k-val">$77–208</span><span class="k-sub">a month in shipping you'd stop collecting, before any extra orders</span></div>
</div></div></header>
<nav class="index" aria-label="Sections"><div class="wrap">{index}</div></nav>"""
page = f"""<title>Zeotein Pricing Audit</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap">
<style>{CSS}</style>
{mast}
<main>{''.join(parts)}</main>
<footer class="foot"><div class="wrap"><p>Prepared Nov 12, 2026 from live store data and Wennie's finance files. Nothing in the store was changed for this audit.</p></div></footer>
<div id="tt" class="tt" role="tooltip" hidden></div>
<script>{JS}</script>
"""
OUT = os.path.join(HERE, '..', '..', 'report', 'zeotein-pricing-audit.html')
open(OUT, 'w').write(page)
print('written', len(page))
