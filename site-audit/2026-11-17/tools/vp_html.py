#!/usr/bin/env python3
"""Light HTML check of every page (17 Nov 2026 verification pass), for when the headless browser is rate limited.
Usage: python3 vp_html.py <outDir> live|bf
One plain request per page (Chrome user agent, ~1.5 s apart, cookies kept for the BF preview). Per page: status,
theme id/role, title, H1, Liquid errors, copy rules (em dash, "complete protein", review count lines), approved
features present in the HTML (rating line, PDP reviews, guarantee/trust, chooser, BF banner and BF price notes).
"""
import html as H, json, re, subprocess, sys, time, os
out_dir, mode = sys.argv[1], sys.argv[2]
os.makedirs(out_dir, exist_ok=True)
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
PRODUCTS = ['zeotein-cacao-bag-30', 'zeotein-cacao-sticks-30', 'zeotein-cacao-sticks-7', 'zeotein-vegan-sticks-30', 'zeotein-vegan-sticks-7',
            'zeotein-bone-broth-protein-powder', 'zeotein-collagen-peptides', 'zeolite', 'organic-mct-oil-powder', 'organic-sea-moss-powder',
            'organic-lion-s-mane-mushroom-powder', 'organic-fermented-cacao-powder-premium-unsweetened',
            'organic-hemp-protein-powder-premium-plant-based-protein', 'organic-pumpkin-seed-protein-powder',
            'zeotein-cleanblend-shaker-27oz-usa-made', 'save-a-scoop', 'cacao-recipe-guide', 'vegan-recipe-guide', 'zeotein-starter-guide',
            'zeotein-gift-card', 'cacao-protein-starter-kit']
PAGES = [('home', '/'), ('shop-all', '/collections/shop-all'), ('all', '/collections/all'), ('protein-blends', '/pages/protein-blends'),
         ('shop-cacao', '/pages/shop-cacao'), ('shop-vegan', '/pages/shop-vegan'), ('coll-cacao', '/collections/zeotein'),
         ('coll-vegan', '/collections/zeotein-vegan-1'), ('coll-singles', '/collections/single-ingredient-supplements'),
         ('coll-protein-blends', '/collections/protein-blends'), ('privacy', '/pages/data-sharing-opt-out'), ('cart', '/cart')]
PAGES += [('p-' + h, '/products/' + h) for h in PRODUCTS]
if mode == 'bf':
    PAGES += [('p-30-day-cacao-bulk-bag-black-friday', '/products/30-day-cacao-bulk-bag-black-friday'),
              ('p-stocking-stuffers-7-day-gift', '/products/stocking-stuffers-7-day-gift')]
jar = os.path.join(out_dir, f'cookies-{mode}.txt')
def get(path):
    url = 'https://zeotein.com' + path + ('&' if '?' in path else '?') + 'zt_internal=1' + ('&preview_theme_id=187825914069' if mode == 'bf' else '')
    r = subprocess.run(['curl', '-sS', '-L', '-A', UA, '-c', jar, '-b', jar, '-w', '\n%{http_code}', url], capture_output=True, text=True, timeout=90)
    body, _, code = r.stdout.rpartition('\n')
    return int(code or 0), body
def text(s):
    s = re.sub(r'(?s)<script.*?</script>|<style.*?</style>|<noscript.*?</noscript>', ' ', s)
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', s)))
rows = []
for name, path in PAGES:
    code, h = get(path)
    if code == 429 or 'Just a moment' in h[:3000]:
        time.sleep(20); code, h = get(path)
    t = text(h)
    th = re.search(r'Shopify\.theme = (\{[^}]*\})', h)
    theme = json.loads(th.group(1)) if th else {}
    ctx = lambda rx, n=2: [t[max(0, m.start() - 40): m.end() + 50] for m in list(re.finditer(rx, t, re.I))[:n]]
    rows.append({
        'name': name, 'path': path, 'status': code, 'theme': f"{theme.get('id')} {theme.get('role')}",
        'title': (re.search(r'(?s)<title>(.*?)</title>', h) or [None, ''])[1].strip().replace('\n', ' ')[:90],
        'h1': re.sub(r'<[^>]+>|\s+', ' ', (re.search(r'(?s)<h1[^>]*>(.*?)</h1>', h) or [None, ''])[1]).strip()[:80],
        'liquidErrors': sorted(set(re.findall(r'Liquid error[^<]{0,110}', h)))[:3],
        'emDashText': ctx('—'), 'completeProtein': len(re.findall(r'complete protein', t, re.I)),
        'reviewCountLines': ctx(r'\b\d\.\d\s*(?:stars?)?\s*(?:from|·)?\s*\d{2,4}\s*(?:reviews|customer)', 2),
        'ratingLine': bool(re.search(r'class="[^"]*\bzt-rating\b', h)), 'pdpReviews': 'zt-pdp-reviews' in h,
        'guaranteeOrTrust': bool(re.search(r'zt-pdp-guarantee|zt-trust__guarantee', h)), 'chooser': 'data-zt-chooser' in h,
        'savingsText': ctx(r'you save|save \d+%|bundle & save', 2), 'bfBanner': 'class="ztbfcd' in h,
        'bfNotes': len(re.findall(r'class="ztbf-(?:strip|card|panel)"', h)),
    })
    time.sleep(1.5)
json.dump(rows, open(os.path.join(out_dir, f'html-{mode}.json'), 'w'), indent=1)
for r in rows:
    bad = []
    if r['status'] != 200: bad.append(f"status {r['status']}")
    if r['liquidErrors']: bad.append('liquid: ' + r['liquidErrors'][0][:80])
    if r['completeProtein']: bad.append('complete protein')
    print(f"{r['name'][:44]:44} {r['theme'][:24]:24} {'OK' if not bad else '; '.join(bad)}")
