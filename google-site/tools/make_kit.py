#!/usr/bin/env python3
"""Build dist/install-kit.html from the latest build, QA results and screenshots.

  python3 tools/make_kit.py      (run after build.py, qa/compliance_check.py and qa/render_check.js)
"""
import json, pathlib, base64, io, datetime, html as htmllib

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
    {"level": "crit", "tag": "Do now", "title": "Re-paste four blocks: Home, Cacao, Vegan, Our story",
     "why": "11 Nov update. Home now opens with the full lineup (Cacao, Vegan and eight single-ingredient powders) and why Zeotein. Product photos are each product's first image on zeotein.com, with ZEOLITE, IMMUNE, DETOX and INFLAMMATION garbled where the label prints them, and no scoop shots. The rating reads <b>4.9/5 &middot; Verified Buyers</b> only. FAQ, Contact, Shipping and Refund policy look the same, so leave those four as they are.",
     "closes": "the four live pages match the build. Tell Claude and it re-checks them."},
    {"level": "warn", "tag": "Decision", "title": "Zeolite Powder is left off the Google site",
     "why": "The house rules never name the mineral on Google-facing pages, and the product's name on its pouch is the word itself, so it can't be shown or garbled sensibly. The other eight single-ingredient powders are on Home and link to their zeotein.com pages, whose descriptions read clean (checked 11 Nov).",
     "closes": "you confirm, or say otherwise."},
    {"level": "crit", "tag": "On hold", "title": "Move Google off /starter-kit-google to shop.zeotein.com",
     "why": "Read live on 10 Nov. The hero bag photo still shows <b>INFLAMMATION SUPPORT</b> in full; the new site garbles it along with ZEOLITE, IMMUNE and DETOX. The old page also shows <b>4.8 average, 214 verified reviews</b> while Judge.me shows 4.94 from 155, lists refills at <b>$2.83 a serving</b> when $99.99 over 30 servings is $3.33, shows Josh M.'s review of Vegan 7 Stick Packs on the Cacao page, and uses \"zero grams of added sugar\" and \"Nothing hidden\", both retired wording.",
     "closes": "you say go (your call, 11 Nov): Search_NB_Sales and Z_Pmax_RET point at https://shop.zeotein.com/cacao, the sitelinks below are added, and the Ad Setup Guardrails list the domain as approved. Live check 11 Nov: 8 of 8 pages match the build, compliance scan 0 blocking, test ad click carries gclid and UTMs into Shopify at $76.99 and $96.99."},
    {"level": "warn", "tag": "Optional", "title": "Keep the Google rep's OK in writing",
     "why": "You have the reps' go-ahead on the garbled label photos. A short email from Ayesha Ali saying so, kept with the Ad Decisions log, is what you'd point to if an automated review ever flags the images or the volcanic mineral.",
     "closes": "the email is saved and logged in Ad Decisions."},
    {"level": "warn", "tag": "Fix soon", "title": "Hide claim-bearing reviews on zeotein.com",
     "why": "Judge.me's featured carousel shows \"I lost 6 Pounds already\". The Vegan widget shows \"lost 5 lbs so far\" and \"already have a clear mind\". A store review says it helps \"clearout my head and dizziness\". Published reviews count as your claims.",
     "closes": "those reviews are hidden in Judge.me."},
    {"level": "warn", "tag": "Align", "title": "Product pages promise more than the refund policy",
     "why": "The Vegan 7-day product page promises the 30-day money-back guarantee, but the refund policy covers 30-day supplies only. The Cacao bag product pages say \"Drink the whole bag\" and \"Keep the kit\", while the policy requires the product to come back (opened is fine). The new site follows the policy word for word.",
     "closes": "product pages and the refund policy say the same thing."},
    {"level": "ok", "tag": "Verify", "title": "Vegan Starter Kit buyers get the guides email",
     "why": "The site says the Starter Guide and two recipe guides arrive by email, matching the Vegan product page. Confirm an order of zeotein-vegan-sticks-30-intro triggers that email in GoHighLevel.",
     "closes": "one order shows the guides email went out."},
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
html = html.replace("__HEAD_SNIPPET__", htmllib.escape((ROOT / "dist" / "ghl" / "00-website-head.html").read_text()))
assert "__" not in "".join(x for x in [html[:200]]), "placeholder left at top"
left = [t for t in ["__SHOT_", "__BLOCKS_JSON__", "__PAGES_JSON__", "__COMP_JSON__", "__ITEMS_JSON__", "__BUILT__", "__HEAD_SNIPPET__"] if t in html]
if left:
    raise SystemExit(f"unfilled placeholders: {left}")
out = ROOT / "dist" / "install-kit.html"
out.write_text(html)
print(f"wrote {out.relative_to(ROOT)} {len(html.encode())//1024} KB")
