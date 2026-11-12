#!/usr/bin/env python3
"""Live check for the 11 Nov noindex change.
  python3 qa/verify_noindex.py            prints a table and exits 1 if any target is not noindexed
Targets must carry noindex (meta robots or X-Robots-Tag) and keep 'follow'; zeotein.com must NOT be noindexed;
shop/marketing robots.txt must not disallow Googlebot or AdsBot."""
import re, sys, urllib.request
NOINDEX = ["https://shop.zeotein.com/", "https://shop.zeotein.com/home", "https://shop.zeotein.com/cacao", "https://shop.zeotein.com/vegan",
           "https://shop.zeotein.com/our-story", "https://shop.zeotein.com/faq", "https://shop.zeotein.com/contact", "https://shop.zeotein.com/shipping",
           "https://shop.zeotein.com/refund-policy",
           # 12 Nov rebuild: the nine new shop pages
           "https://shop.zeotein.com/single-ingredients", "https://shop.zeotein.com/collagen", "https://shop.zeotein.com/bone-broth",
           "https://shop.zeotein.com/hemp-protein", "https://shop.zeotein.com/pumpkin-seed-protein", "https://shop.zeotein.com/cacao-powder",
           "https://shop.zeotein.com/mct-oil-powder", "https://shop.zeotein.com/sea-moss", "https://shop.zeotein.com/lions-mane",
           "https://marketing.zeotein.com/starter-kit-google", "https://marketing.zeotein.com/starter-kit-page",
           "https://marketing.zeotein.com/starter-kit", "https://marketing.zeotein.com/zeotein-cacao", "https://marketing.zeotein.com/landing-page-cacao",
           "https://marketing.zeotein.com/cacao-sales-page", "https://marketing.zeotein.com/cacao-stick-packs-starter-kit"]
OPTIONAL = ["https://marketing.zeotein.com/"]          # quiz: noindex only if it is ads-only
MUST_INDEX = ["https://zeotein.com/"]
ROBOTS = ["https://shop.zeotein.com/robots.txt", "https://marketing.zeotein.com/robots.txt"]
def fetch(u):
    req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (zeotein noindex check)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.headers.get("X-Robots-Tag", ""), r.read().decode("utf-8", "ignore")
def robots_of(html):
    return [m.lower() for m in re.findall(r'<meta[^>]+name=["\']robots["\'][^>]*content=["\']([^"\']*)["\']', html, re.I)]
bad = 0
print(f"{'URL':55} {'HTTP':4}  NOINDEX  FOLLOW  meta robots / X-Robots-Tag")
for group, urls in (("noindex", NOINDEX), ("optional", OPTIONAL), ("index", MUST_INDEX)):
    for u in urls:
        try: code, xr, html = fetch(u)
        except Exception as e: print(f"{u:55} ERR   {e}"); bad += group != "optional"; continue
        tags = robots_of(html) + ([xr.lower()] if xr else [])
        noindex = any("noindex" in t or "none" == t.strip() for t in tags)
        follow_ok = not any("nofollow" in t or t.strip() == "none" for t in tags)
        ok = (noindex and follow_ok) if group == "noindex" else (not noindex) if group == "index" else True
        bad += 0 if ok else 1
        print(f"{u:55} {code:<4}  {'yes' if noindex else 'no':7}  {'yes' if follow_ok else 'NO':6}  {' | '.join(tags) or '-'}  {'' if ok else '  <-- ' + ('needs noindex' if group == 'noindex' else 'must stay indexable')}")
for u in ROBOTS:
    code, _, body = fetch(u)
    blocks = re.findall(r'(?is)user-agent:\s*(googlebot|adsbot[-\w]*|\*)\s*\n(?:[^\n]*\n)*?\s*disallow:\s*/\s*$', body)
    print(f"{u:55} {code:<4}  {len(body)} bytes  {'Googlebot/AdsBot blocked' if blocks else 'no Googlebot/AdsBot block'}")
    bad += 1 if blocks else 0
print("RESULT:", "PASS" if not bad else f"{bad} item(s) not done yet")
sys.exit(1 if bad else 0)
