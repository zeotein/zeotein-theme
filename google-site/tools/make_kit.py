#!/usr/bin/env python3
"""Build dist/install-kit.html from the latest build, QA results and screenshots.

  python3 tools/make_kit.py      (run after build.py, qa/compliance_check.py and qa/render_check.js)
"""
import json, pathlib, base64, io, datetime

ROOT = pathlib.Path(__file__).resolve().parents[1]
TPL = (ROOT / "tools" / "kit_template.html").read_text()
manifest = json.loads((ROOT / "dist" / "manifest.json").read_text())
comp = json.loads((ROOT / "qa" / "compliance-report.json").read_text())

blocks = {}
for p in manifest["pages"]:
    blocks[p["slug"]] = (ROOT / p["ghlFile"]).read_text()

comp_rows = []
for c in comp:
    specs = {k: v for k, v in c["checks"].items() if k.startswith("spec_")}
    facts = ""
    if specs:
        n_ok = sum(1 for v in specs.values() if v[0] == v[1])
        formula = next(iter(specs)).split("_")[1].title()
        facts = f"{formula}: {n_ok} of {len(specs)} match"
    comp_rows.append({
        "page": c["page"],
        "critical": c["prescan"]["counts"]["CRITICAL"],
        "high": c["prescan"]["counts"]["HIGH"],
        "house": len(c["house_rules"]),
        "facts": facts,
        "fda": c["checks"]["fda_disclaimer"],
        "images": c["checks"]["images_all_approved"] and not c["checks"]["ghl_assets_referenced"],
    })

ITEMS = [
    {"level": "crit", "tag": "Decide", "title": "Approve the domain: shop.zeotein.com",
     "why": "The site needs a domain before it can be published, re-scanned or used in ads. Any zeotein.com subdomain works for Google; this one reads cleanly in an ad and doesn't collide with go., try., gift. or marketing.",
     "closes": "the domain is connected in GoHighLevel and the bare domain opens Home."},
    {"level": "crit", "tag": "Do first", "title": "Paste the eight blocks, publish, re-scan, then move Google over",
     "why": "Until then every Google campaign with its own final URL still lands on marketing.zeotein.com/starter-kit-google.",
     "closes": "Search_NB_Sales and Z_Pmax_RET point at /cacao on the new domain and the Ad Setup Guardrails list it as approved."},
    {"level": "crit", "tag": "Fix soon", "title": "Stop sending Google traffic to /starter-kit-google",
     "why": "Read live on 10 Nov. The hero bag photo shows <b>INFLAMMATION SUPPORT</b> in full. The scrambled label words (ZTLOIEE, INMUEM, DTXOE) are the kind of image change Google's ad network policy lists as getting around review, and Google treats circumventing systems as egregious: the account is suspended on detection, with no warning first. The page also shows <b>4.8 average, 214 verified reviews</b> while Judge.me shows 4.94 from 155, lists refills at <b>$2.83 a serving</b> when $99.99 over 30 servings is $3.33, shows Josh M.'s review of Vegan 7 Stick Packs on the Cacao page, and uses \"zero grams of added sugar\" and \"Nothing hidden\", both retired wording.",
     "closes": "no Google campaign points at it. The new site replaces it and uses only unaltered photos."},
    {"level": "warn", "tag": "Decide", "title": "Get a written answer from Google on the volcanic mineral",
     "why": "Both formulas contain it, and only Google carries the Unapproved substances flag. The new site follows your standing rule and describes it without naming it, but only Google can say whether Cacao and Vegan are eligible to advertise at all. The 12 Nov catch-up with Ayesha Ali is the natural place to ask, with the new site's link in hand.",
     "closes": "the rep's answer is in writing and logged in Ad Decisions."},
    {"level": "warn", "tag": "Next print run", "title": "Take the claim icons off the pouch",
     "why": "The front prints Inflammation Support, Immune Support and Detox Support. The back panel says the mineral is \"known for its ability to bind toxins and impurities, supporting internal cleansing\". Your compliance scrub classes each of these as a violation, and they are the reason every label photo needs special handling.",
     "closes": "the next print run carries structure/function wording with the FDA line, or drops those icons."},
    {"level": "warn", "tag": "Fix soon", "title": "Hide claim-bearing reviews on zeotein.com",
     "why": "Judge.me's featured carousel shows \"I lost 6 Pounds already\". The Vegan widget shows \"lost 5 lbs so far\" and \"already have a clear mind\". A store review says it helps \"clearout my head and dizziness\". Published reviews count as your claims. Separately, the 28 Oct Starter Kit review from <b>J Grace</b>: if that is Jewels, her paid role is a material connection the FTC requires you to disclose, or the review comes down (Dana and the attorney).",
     "closes": "those reviews are hidden in Judge.me and the J Grace review is settled."},
    {"level": "warn", "tag": "Align", "title": "Product pages promise more than the refund policy",
     "why": "The Vegan 7-day product page promises the 30-day money-back guarantee, but the refund policy covers 30-day supplies only. The Cacao bag product pages say \"Drink the whole bag\" and \"Keep the kit\", while the policy requires the product to come back (opened is fine). The new site follows the policy word for word.",
     "closes": "product pages and the refund policy say the same thing."},
    {"level": "ok", "tag": "Verify", "title": "Vegan Starter Kit buyers get the guides email",
     "why": "The site says the Starter Guide and two recipe guides arrive by email, matching the Vegan product page. Confirm an order of zeotein-vegan-sticks-30-intro triggers that email in GoHighLevel.",
     "closes": "one order shows the guides email went out."},
    {"level": "ok", "tag": "Optional", "title": "Turn on the live star rating",
     "why": "Your rule is the live store-wide Judge.me figure or nothing, so the rating line is hidden for now. Judge.me → Settings → Integrations → View API tokens → copy the Public token into <span class=\"mono\">judgemePublicToken</span> in src/config.json, rebuild, and re-paste Home, Cacao and Vegan. Store-wide today: 4.94 from 155 reviews.",
     "closes": "the token is set and the rating shows on the live pages."},
]


def shots():
    out = {}
    try:
        from PIL import Image
    except ImportError:
        return out
    for key, path, width in [("home_m", "home-mobile-fold.png", 390), ("cacao_m", "cacao-mobile-fold.png", 390),
                             ("vegan_m", "vegan-mobile-fold.png", 390), ("cacao_d", "cacao-desktop-fold.png", 960)]:
        p = ROOT / "qa" / "screens" / path
        if not p.exists():
            continue
        im = Image.open(p).convert("RGB")
        if im.width > width:
            im = im.resize((width, int(im.height * width / im.width)), Image.LANCZOS)
        b = io.BytesIO()
        im.save(b, "JPEG", quality=72, optimize=True, progressive=True)
        out[key] = "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
    return out


def jsafe(obj):
    return json.dumps(obj).replace("</", "<\\/")


html = TPL
for k, v in shots().items():
    html = html.replace(f"__SHOT_{k}__", v)
html = html.replace("__BLOCKS_JSON__", jsafe(blocks))
html = html.replace("__PAGES_JSON__", jsafe(manifest["pages"]))
html = html.replace("__COMP_JSON__", jsafe(comp_rows))
html = html.replace("__ITEMS_JSON__", jsafe(ITEMS))
html = html.replace("__BUILT__", manifest["built"])
assert "__" not in "".join(x for x in [html[:200]]), "placeholder left at top"
left = [t for t in ["__SHOT_", "__BLOCKS_JSON__", "__PAGES_JSON__", "__COMP_JSON__", "__ITEMS_JSON__", "__BUILT__"] if t in html]
if left:
    raise SystemExit(f"unfilled placeholders: {left}")
out = ROOT / "dist" / "install-kit.html"
out.write_text(html)
print(f"wrote {out.relative_to(ROOT)} {len(html.encode())//1024} KB")
