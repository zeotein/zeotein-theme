#!/usr/bin/env python3
"""Check every link and image in the built GoHighLevel blocks.

    python3 qa/link_check.py [OUT.json] [--live https://shop.zeotein.com]

With --live, every page's block is read from the live site instead of dist/, and every internal link is also
fetched on the live site and must answer 200.

Internal links must point at one of this site's pages (src/config.json), and any #anchor must exist on the
target page. External links and image URLs are fetched (GET, redirects followed) and must answer 200.
Font preconnect hints are skipped. The cart's checkout link is built in JavaScript and is covered by
qa/e2e_cart.js instead.
"""
import html as htmlmod
import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
ARGS = sys.argv[1:]
LIVE = ARGS[ARGS.index("--live") + 1].rstrip("/") if "--live" in ARGS else None
POS = [a for i, a in enumerate(ARGS) if a != "--live" and (i == 0 or ARGS[i - 1] != "--live")]
cfg = json.loads((ROOT / "src" / "config.json").read_text())
PAGES = {p["path"].rstrip("/") or "/": p["slug"] for p in cfg["pages"]}
PAGES.setdefault("/home", "home")
blocks = {}
if LIVE:
    from live_fetch import live_block, fetch as live_get
    manifest = {x["slug"]: x for x in json.loads((ROOT / "dist" / "manifest.json").read_text())["pages"]}
for p in cfg["pages"]:
    if LIVE:
        blocks[p["slug"]] = live_block(LIVE, manifest[p["slug"]])[0]
        continue
    f = next(x for x in (ROOT / "dist" / "ghl").glob("*.html") if re.fullmatch(rf"\d\d-{re.escape(p['slug'])}\.html", x.name))
    blocks[p["slug"]] = f.read_text()


def cf_email(href):
    """Cloudflare email obfuscation serves mailto links as /cdn-cgi/l/email-protection#<hex>; its script decodes them in
    the browser. Decode the same way (XOR with the first byte) so the real address can be checked."""
    h = href.split("#", 1)[1] if "#" in href else ""
    try:
        key = int(h[:2], 16)
        return "mailto:" + "".join(chr(int(h[i:i + 2], 16) ^ key) for i in range(2, len(h), 2))
    except ValueError:
        return None


cf_decoded = []


def ids(slug):
    return set(re.findall(r'\sid="([^"]+)"', blocks[slug]))


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (link-check)"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:  # noqa: BLE001
        return f"error: {e.__class__.__name__}"


problems, external, images, internal_count = [], set(), set(), 0
for slug, raw in blocks.items():
    no_js = re.sub(r"<script\b.*?</script>", " ", raw, flags=re.S)
    for href in re.findall(r'<a\b[^>]*\shref="([^"]*)"', no_js):
        href = htmlmod.unescape(href)
        if href.startswith("/cdn-cgi/l/email-protection"):
            dec = cf_email(href)
            if not dec:
                problems.append({"page": slug, "href": href, "issue": "undecodable Cloudflare email link"})
                continue
            cf_decoded.append(dec)
            href = dec
        if href in ("#",) or href.startswith("mailto:") or href.startswith("tel:"):
            if href.startswith("mailto:") and not re.fullmatch(r"mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}(\?.*)?", href):
                problems.append({"page": slug, "href": href, "issue": "malformed mailto"})
            continue
        if href.startswith("http"):
            external.add(href)
            continue
        internal_count += 1
        path, _, frag = href.partition("#")
        target = slug if path == "" else PAGES.get(path.rstrip("/") or "/")
        if target is None:
            problems.append({"page": slug, "href": href, "issue": "internal link to a page that is not on this site"})
        elif LIVE and path:
            st = live_get(LIVE + path)[0]
            if st != 200:
                problems.append({"page": slug, "href": href, "issue": f"live {LIVE + path} answered {st}"})
        elif frag and frag not in ids(target):
            problems.append({"page": slug, "href": href, "issue": f"anchor #{frag} missing on {target}"})
    for src in re.findall(r'<img\b[^>]*\ssrc="([^"]+)"', no_js):
        images.add(htmlmod.unescape(src))
    for srcset in re.findall(r'\ssrcset="([^"]+)"', no_js):
        for part in srcset.split(","):
            images.add(htmlmod.unescape(part.strip().split(" ")[0]))
# images inside the cart catalog (thumbnails, product photos the buy box swaps in)
for slug, raw in blocks.items():
    m = re.search(r"var CATALOG = (\{.*?\}) \|\| \{\};", raw)
    if m:
        for it in json.loads(m.group(1).replace("<\\/", "</"))["items"].values():
            for k in ("img", "imgLg"):
                if it.get(k):
                    images.add(it[k])
        break

with ThreadPoolExecutor(max_workers=8) as ex:
    ext_status = dict(zip(sorted(external), ex.map(fetch, sorted(external))))
    img_status = dict(zip(sorted(images), ex.map(fetch, sorted(images))))
for u, s in {**ext_status, **img_status}.items():
    if s != 200:
        problems.append({"url": u, "issue": f"status {s}"})
zeotein_links = sorted(u for u in external if re.match(r"https?://(www\.)?zeotein\.com", u))
browse = [u for u in zeotein_links if re.search(r"/(products|collections|pages)/|zeotein\.com/?(\?|$)", u)]
for u in browse:
    problems.append({"url": u, "issue": "sends shoppers to browse zeotein.com"})

out = {"pages": len(blocks), "internalLinks": internal_count, "external": ext_status, "images": len(img_status),
       "zeoteinComLinks": zeotein_links, "problems": problems}
dest = Path(POS[0]) if POS else ROOT / "qa" / "link-report.json"
out["source"] = LIVE or "dist/ghl"
out["cloudflareEmailLinks"] = {"count": len(cf_decoded), "decodedTo": sorted(set(cf_decoded))}
dest.write_text(json.dumps(out, indent=1))
print(f"{len(blocks)} pages | {internal_count} internal links | {len(external)} external links | {len(images)} image URLs")
print("zeotein.com links:", *zeotein_links, sep="\n  ")
print(f"problems: {len(problems)}")
for p in problems:
    print("  ", p)
sys.exit(1 if problems else 0)
