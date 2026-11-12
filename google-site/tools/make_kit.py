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

NEW_PAGES = {"single-ingredients", "collagen", "bone-broth", "hemp-protein", "pumpkin-seed-protein", "cacao-powder",
             "mct-oil-powder", "sea-moss", "lions-mane"}
for p in manifest["pages"]:
    p["isNew"] = p["slug"] in NEW_PAGES
no_rating = {}
for p in manifest["pages"]:
    f = ROOT / "dist" / "ghl" / "no-rating" / pathlib.Path(p["ghlFile"]).name
    if f.exists():
        no_rating[p["slug"]] = f.read_text()

REPORT = ROOT / "reports" / "zeus-workstream-2026-11-11" / "shop-visuals"
e2e = json.loads((REPORT / "e2e" / "e2e-results.json").read_text()) if (REPORT / "e2e" / "e2e-results.json").exists() else {"passed": 0, "failed": 0}
links = json.loads((REPORT / "link-check.json").read_text()) if (REPORT / "link-check.json").exists() else {}
render = json.loads((ROOT / "qa" / "render-report.json").read_text())
render_clean = sum(1 for r in render["pages"] if not any(r.get(k) for k in ("errors", "failed", "overflow", "wide", "broken")))
TESTS = {"e2ePassed": e2e.get("passed", 0), "e2eFailed": e2e.get("failed", 0), "renderClean": render_clean, "renderTotal": len(render["pages"]),
         "internalLinks": links.get("internalLinks", 0), "externalLinks": len(links.get("external", {})), "images": links.get("images", 0),
         "linkProblems": len(links.get("problems", [])), "pages": len(manifest["pages"])}

ITEMS = [
    {"level": "crit", "tag": "Approve", "title": "Approve the star-rating line: 4.9 from 155 reviews",
     "why": "The rebuilt Home, Cacao and Vegan pages add a store-wide rating line (Home: <b>4.9 from 155 reviews</b>; product pages: <b>4.9 from 155 reviews across Zeotein</b>, since the 155 reviews cover the whole store). Today's live pages show no overall rating; the 11 Nov choice (<b>4.9/5 &middot; Verified Buyers</b>, no count) was built but never pasted. Review quotes are unchanged. See <a href=\"#approval\">Approval</a> for the before and after.",
     "closes": "Dana says yes (paste the standard blocks) or no (paste the no-rating versions of Home, Cacao and Vegan; nothing else changes)."},
    {"level": "crit", "tag": "Do now", "title": "Create 9 pages, then paste all 17 blocks and the Head snippet",
     "why": "New pages: Single Ingredients and one page per powder (Collagen, Bone Broth, Hemp Protein, Pumpkin Seed Protein, Cacao Powder, MCT Oil Powder, Sea Moss, Lion's Mane). All 8 existing pages changed too (new look, header with cart, footer), so every block is re-pasted. GoHighLevel's API can't write page code, so this is a paste job in the builder: about 45 minutes by hand, or hand it to Claude on your PC with the prompt in <a href=\"#install\">Install</a>.",
     "closes": "all 17 pages on shop.zeotein.com match the build and Claude re-runs the cart and link tests on the live site."},
    {"level": "warn", "tag": "On hold", "title": "Google Ads final URLs stay where they are",
     "why": "Per the 12 Nov brief, no campaign moves to shop.zeotein.com yet. The <a href=\"#ads\">Google Ads</a> table is ready for when the hold lifts.",
     "closes": "Dana or Zeus lift the hold."},
    {"level": "ok", "tag": "Hold kept", "title": "Zeolite stays off shop.zeotein.com",
     "why": "Zeolite Powder is not sold or shown anywhere on the site, and the word appears in no block or page source. The blends' fifth ingredient is disclosed as \"a naturally occurring volcanic mineral\" in ingredient lists and the FAQ only, and it is garbled on every package photo. zeotein.com and the Shopping feed are untouched.",
     "closes": "the hold is lifted."},
    {"level": "warn", "tag": "Retest", "title": "Last live checkout runs, once Shopify stops challenging the test machine",
     "why": "The single-item flow and the blend-plus-single checkout reached real Shopify checkout with the right items, plans and prices, and UTMs and gclid saved on the cart. After a night of automated tests, Shopify's bot check (429 plus a Cloudflare check) began challenging this cloud machine's cart requests, so the Vegan kit and stick-pack runs were finished on the local cart and the checkout link only. Real shoppers' browsers normally pass that check automatically.",
     "closes": "Claude re-runs qa/e2e_cart.js --only-checkout and all five live flows pass."},
    {"level": "warn", "tag": "Recommend", "title": "Finish the funnel noindex (Zeus / Dana side)",
     "why": "Re-checked 12 Nov 05:00 UTC. Solid (noindex in the page HTML): all 9 shop.zeotein.com URLs, plus marketing.zeotein.com/zeotein-cacao, /landing-page-cacao and /cacao-sales-page. Script-only (the page HTML still says index, a script switches it to noindex): /starter-kit-google, /starter-kit-page and /starter-kit. Google usually honors that, but the reliable version is this line in each funnel step's Head code: <span class=\"mono\">&lt;meta name=\"robots\" content=\"noindex, follow\"&gt;</span>. No robots tag at all: /cacao-stick-packs-starter-kit, and the quiz at marketing.zeotein.com/ (Zeus and Dana are handling the quiz). zeotein.com stays indexable and no robots.txt blocks Googlebot or AdsBot. These funnels are outside this workstream, so they are listed, not changed.",
     "closes": "the tag is in those funnel steps' Head code, or Zeus and Dana decide the script is enough."},
    {"level": "warn", "tag": "Fix soon", "title": "Hide claim-bearing reviews on zeotein.com",
     "why": "From the 10 Nov read: Judge.me's featured carousel shows \"I lost 6 Pounds already\"; the Vegan widget shows \"lost 5 lbs so far\" and \"already have a clear mind\". Published reviews count as your claims. None of these are used on shop.zeotein.com.",
     "closes": "those reviews are hidden in Judge.me."},
    {"level": "warn", "tag": "Align", "title": "Product pages promise more than the refund policy",
     "why": "From the 10 Nov read: the Vegan 7-day product page promises the 30-day money-back guarantee, but the refund policy covers 30-day supplies only. The shop site follows the policy word for word.",
     "closes": "zeotein.com product pages and the refund policy say the same thing."},
    {"level": "ok", "tag": "Verify", "title": "Vegan Starter Kit buyers get the guides email",
     "why": "The site says the three digital guides arrive by email. Confirm an order of the Vegan Starter Kit triggers that email in GoHighLevel.",
     "closes": "one order shows the guides email went out."},
]


def shots():
    out = {}
    try:
        from PIL import Image
    except ImportError:
        return out
    R = "reports/zeus-workstream-2026-11-11/shop-visuals/"
    for key, path, width in [("home_m", "qa/screens/home-mobile-fold.png", 390), ("cacao_m", "qa/screens/cacao-mobile-fold.png", 390),
                             ("vegan_m", "qa/screens/vegan-mobile-fold.png", 390), ("cacao_d", "qa/screens/cacao-desktop-fold.png", 960),
                             ("home_d", "qa/screens/home-desktop-fold.png", 960), ("singles_d", "qa/screens/single-ingredients-desktop-fold.png", 960),
                             ("review_board", R + "before-after/REVIEW-TEXT-before-after.png", 1100),
                             ("co_a", R + "checkout/A-single-item-LIVE-shopify-checkout.png", 900),
                             ("co_b", R + "checkout/B-blend-plus-single-LIVE-shopify-checkout.png", 900),
                             ("cart_b", R + "checkout/B-blend-plus-single-onsite-cart.png", 900)]:
        p = ROOT / path
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
html = html.replace("__NORATING_JSON__", jsafe(no_rating))
html = html.replace("__TESTS_JSON__", jsafe(TESTS))
html = html.replace("__BUILT__", manifest["built"])
html = html.replace("__HEAD_SNIPPET__", htmllib.escape((ROOT / "dist" / "ghl" / "00-website-head.html").read_text()))
assert "__" not in "".join(x for x in [html[:200]]), "placeholder left at top"
left = [t for t in ["__SHOT_", "__BLOCKS_JSON__", "__PAGES_JSON__", "__COMP_JSON__", "__ITEMS_JSON__", "__BUILT__", "__HEAD_SNIPPET__", "__NORATING_JSON__", "__TESTS_JSON__"] if t in html]
if left:
    raise SystemExit(f"unfilled placeholders: {left}")
out = ROOT / "dist" / "install-kit.html"
out.write_text(html)
print(f"wrote {out.relative_to(ROOT)} {len(html.encode())//1024} KB")
