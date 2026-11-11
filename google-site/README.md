# Zeotein Google Site

The Google-only Zeotein website, built for the GoHighLevel website **"Zeotein Google Site"**
(`XybYbqU2CgF1TyKDc9GR`, location `Kch9YmRfzpmQrAs5Bchz`). It mirrors zeotein.com with copy
written to pass Google Ads healthcare review, so Google campaigns can use sitelinks and more
pages without touching the live Shopify store (Ad Setup Guardrails, long-term plan of 5 Nov 2026).

Checkout stays on Shopify. Every buy button goes to the same unlisted Shopify products the
current Google funnel uses, so orders, Seal subscriptions and the Google channel purchase
conversion work exactly as they do today.

## What's here

| Path | What it is |
|---|---|
| `dist/ghl/01-home.html` … `08-refund-policy.html` | **The deliverable.** One paste-ready block per GoHighLevel page. |
| `dist/ghl/00-website-head.html` | Pasted once at the end of the website's Head tracking code: removes GoHighLevel's default padding and 1170px row, keeps the header pinned, fills empty SEO titles. |
| `dist/install-kit.html` | Install steps, copy buttons for every block and SEO field, compliance results, open items. |
| `dist/preview/` | The same pages as plain HTML for testing (`python3 -m http.server --directory dist/preview`). |
| `src/config.json` | Every price, link and image in one place. Prices verified live in Shopify on 10 Nov 2026. |
| `src/pages/`, `src/partials/`, `src/styles.css` | Page content, shared header/footer/sections, styles. |
| `build.py` | Assembles `src/` into `dist/`. Python standard library only. |
| `qa/compliance_check.py` | Two-layer compliance gate (the zeotein-compliance-scrub prescan plus Zeotein house rules). |
| `qa/render_check.js`, `qa/fold_check.js` | Playwright checks: rendering, overflow, broken images, links, ad-parameter passthrough, sticky bar, first-screen offer. |

## Pages

| GHL page | Path | Sells / covers |
|---|---|---|
| Home | `/home` | Full lineup first (Cacao, Vegan, eight single-ingredient powders) and why Zeotein, then the Cacao deep-dive, reviews, FAQ |
| Cacao | `/cacao` | Cacao Starter Kit ($76.99 first order, then $99.99) and the one-time bag ($93.49) |
| Vegan | `/vegan` | Vegan Starter Kit ($96.99 first order, then $124.99) and the 7-day pack ($44.99) |
| Our story | `/our-story` | Brand page, no founder story |
| FAQ | `/faq` | Formulas, mixing, subscriptions, shipping, guarantee |
| Contact | `/contact` | hello@zeotein.com, subscription portal, order help |
| Shipping | `/shipping` | Summary plus the published Shopify shipping policy, verbatim |
| Refund policy | `/refund-policy` | Summary plus the published Shopify refund policy, verbatim |

## Install (short version; the install kit has the full checklist)

1. GoHighLevel: Sites, Websites, **Zeotein Google Site**. Open each page in the builder, remove what's there,
   add one full-width section with one column, add a **Custom JS/HTML** element, paste that page's block from
   `dist/ghl/`, save. Set the page's SEO title and description from `dist/manifest.json`.
2. Website settings, Tracking code, Head: keep what is there (Google Ads tag AW-18130788543, Meta pixel, Clarity) and
   paste `dist/ghl/00-website-head.html` at the very end. Leave the Body code (gclid/UTM passthrough) as it is.
3. DNS is at GoDaddy: add a CNAME `shop` → `sites.ludicrous.cloud` (same target as marketing.zeotein.com). Then connect
   `shop.zeotein.com` (approved 10 Nov) in GoHighLevel, set this website as the domain's default, publish.
4. Re-scan the live pages (`python3 prescan.py --url https://shop.zeotein.com/cacao` and the others), then move Google
   final URLs and sitelinks over. Final URL expansion stays OFF.

## Change something

Edit `src/` (prices and links live in `src/config.json`), then:

```bash
python3 build.py
python3 qa/compliance_check.py /path/to/zeotein-compliance-scrub/scripts/prescan.py   # must end TOTAL BLOCKING: 0
python3 -m http.server 8765 --directory dist/preview &  node qa/render_check.js http://127.0.0.1:8765
```

Re-paste only the pages whose block changed.

## Rules this site is built to

- Describes the mineral as "a naturally occurring volcanic mineral" and points to the Supplement Facts panel on
  the bag for the full name (Guardrails section 4).
- No disease, detox, immune, inflammation, weight-loss or GLP-1 language anywhere, including alt text and schema.
- Packaging photos are never cropped. Product photos are each product's first image on zeotein.com (Dana, 11 Nov):
  the bag for Cacao, the stick-pack shot for Vegan, the pouch for each single-ingredient powder. No scoop shots.
  Where a label prints ZEOLITE, IMMUNE, DETOX or INFLAMMATION (Cacao bag, Vegan stick packs, including the small print
  on each stick) those words are garbled by reordering the label's own letters, so font and lighting stay as
  photographed. Each file passes the OCR gate (3x upscale, contrast, inverted, several page modes) at full size and
  640px. Garbled files live in Shopify Files (uploaded 11 Nov 2026); the job scripts are in `tools/jobs/`.
- Zeotein Zeolite Powder is not shown: the mineral is never named on Google-facing pages and its pouch name is the word.
- Ratings read "4.9/5 · Verified Buyers" and nothing else (Dana, 11 Nov; `ratingText` in `src/config.json`).
  Judge.me showed 4.92 to 4.94 when this was set. No review counts.
- 23g is Cacao only, Vegan is 20g. Cacao says "zero sugar", Vegan says "zero added sugar". "First order", never
  "first month". No time of day, no frequency, no "one scoop", no founder language.
- The 30-day guarantee is described exactly as the published refund policy states it (first order, one 30-day
  supply, return required, opened is fine).
