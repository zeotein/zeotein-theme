# Zeotein Google Site

The Google-only Zeotein website, built for the GoHighLevel website **"Zeotein Google Site"**
(`XybYbqU2CgF1TyKDc9GR`, location `Kch9YmRfzpmQrAs5Bchz`). It mirrors zeotein.com with copy
written to pass Google Ads healthcare review, so Google campaigns can use sitelinks and more
pages without touching the live Shopify store (Ad Setup Guardrails, long-term plan of 5 Nov 2026).

Since the 12 Nov rebuild it looks like zeotein.com (bright, photography-led) and sells from an **on-site cart**:
shoppers add protein blends (Starter Kits, 30-day bulk bag, stick packs) and single-ingredient powders on
shop.zeotein.com, then check out once on Shopify. Checkout sends `/cart/clear` → `/cart/add` (each line with its
variant and selling plan) → `/cart/update` (gclid, UTMs, landing page as cart attributes) → `/checkout`, so orders,
Seal subscriptions and the Google channel purchase conversion work as they do today and nobody browses zeotein.com.
Every variant and plan ID is in `src/catalog.json`.

## What's here

| Path | What it is |
|---|---|
| `dist/ghl/01-home.html` … `17-lions-mane.html` | **The deliverable.** One paste-ready block per GoHighLevel page (17). |
| `dist/ghl/no-rating/` | Home, Cacao and Vegan without the store-wide rating line, for use if that copy is not approved. |
| `dist/ghl/00-website-head.html` | Pasted once in the website's Head tracking code: noindex meta first, then the fit CSS (no default padding or 1170px row, pinned header) and empty-SEO fallback. |
| `dist/install-kit.html` | Install steps, copy buttons for every block and SEO field, compliance results, open items. |
| `dist/preview/` | The same pages as plain HTML for testing (`python3 -m http.server --directory dist/preview`). |
| `src/config.json` | Every page, price, link and image in one place. |
| `src/catalog.json` | Every buy button's Shopify variant, selling plan and price (read from Shopify 12 Nov 2026). Never plan 4659019989 ($89.99 renewal). Zeolite Powder is not listed (hold). |
| `src/pages/`, `src/partials/`, `src/styles.css` | Page content, shared header/footer/sections, styles. |
| `build.py` | Assembles `src/` into `dist/`. Python standard library only. |
| `qa/compliance_check.py` | Two-layer compliance gate (the zeotein-compliance-scrub prescan plus Zeotein house rules). |
| `qa/render_check.js`, `qa/fold_check.js` | Playwright checks: rendering, overflow, broken images, links, ad-parameter passthrough, sticky bar, first-screen offer. |
| `qa/e2e_cart.js` | Every buy option, plan, size and button against `src/catalog.json`; the cart; the checkout link; with `--checkout`, live hand-offs to Shopify checkout (never pays). |
| `qa/link_check.py` | Every internal link and anchor, external link and image URL. |
| `qa/verify_noindex.py` | Noindex on the ads-only pages, zeotein.com still indexable, no robots.txt blocks. |
| `reports/zeus-workstream-2026-11-11/shop-visuals/` | 12 Nov test report, before/after boards, checkout screenshots, noindex checks. |
| `tools/compare_board.py` | Lays before/after screenshots side by side on one labelled image. |

## Pages

| GHL page | Path | Sells / covers |
|---|---|---|
| Home | `/home` | zeotein.com-style home: hero, Choose Your Zeotein (Cacao, Vegan, Single Ingredients), reviews, guarantee, FAQ |
| Cacao | `/cacao` | Starter Kit ($76.99 first order, then $99.99; every 30 days, 6 or 8 weeks), 30-day bag ($93.49), 30 stick packs (subscribe $114.99 or once $134.99), 7 stick packs ($39.99) |
| Vegan | `/vegan` | Starter Kit ($96.99 first order, then $124.99), 30 stick packs ($139.99), 7 stick packs ($44.99) |
| Our story | `/our-story` | Brand page, no founder story |
| FAQ | `/faq` | Formulas, mixing, subscriptions, shipping, guarantee |
| Contact | `/contact` | hello@zeotein.com, subscription portal, order help |
| Shipping | `/shipping` | Summary plus the published Shopify shipping policy, verbatim |
| Refund policy | `/refund-policy` | Summary plus the published Shopify refund policy, verbatim |
| Single Ingredients (new) | `/single-ingredients` | All eight powders with size pickers and Add to cart |
| Collagen, Bone Broth, Hemp Protein, Pumpkin Seed Protein, Cacao Powder, MCT Oil Powder, Sea Moss, Lion's Mane (new) | `/collagen`, `/bone-broth`, `/hemp-protein`, `/pumpkin-seed-protein`, `/cacao-powder`, `/mct-oil-powder`, `/sea-moss`, `/lions-mane` | One page per powder: sizes, price, how to use, final-sale note |

## Install (short version; the install kit has the full checklist)

Kit: https://claude.ai/artifact/7xHhZwMmCAHnwAEc7dAmmb

1. Get Dana's answer on the rating line (standard blocks, or `dist/ghl/no-rating/` for Home, Cacao and Vegan).
2. GoHighLevel: Sites, Websites, **Zeotein Google Site**. Create the nine new pages with the paths above.
3. For all 17 pages: remove what's there, add one full-width section with one column, add a **Custom JS/HTML**
   element, paste the page's block, save. Set its SEO title and description from `dist/manifest.json`.
4. Website settings, Tracking code, Head: keep the Google Ads tag AW-18130788543, Meta pixel and Clarity; replace the old
   Zeotein snippet with `dist/ghl/00-website-head.html`. Leave the Body code (gclid/UTM passthrough) as it is.
5. Publish, then re-test live: `node qa/e2e_cart.js https://shop.zeotein.com reports/live --checkout`,
   `python3 qa/link_check.py`, and the compliance prescan. Google Ads final URLs stay where they are (hold, 12 Nov).

## Change something

Edit `src/` (prices and links live in `src/config.json`), then:

```bash
python3 build.py
python3 qa/compliance_check.py /path/to/zeotein-compliance-scrub/scripts/prescan.py   # must end TOTAL BLOCKING: 0
python3 -m http.server 8765 --directory dist/preview &  node qa/render_check.js http://127.0.0.1:8765
node qa/e2e_cart.js http://127.0.0.1:8765        # must end "0 failed"
python3 qa/link_check.py                         # must end "problems: 0"
python3 tools/make_kit.py                        # refreshes dist/install-kit.html
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
- Zeolite hold (12 Nov): Zeotein Zeolite Powder is not sold or shown, and the word appears in no block or page source.
- Rating line: "4.9 from 155 reviews" (Zeus, 12 Nov brief; product pages add "across Zeotein"), replacing Dana's 11 Nov
  "4.9/5 · Verified Buyers". **Not to be pasted until Dana approves** the before/after board; `dist/ghl/no-rating/`
  is the fallback. `ratingText` in `src/config.json`.
- Holds (12 Nov): no $89.99 renewal anywhere, no shipping-threshold change ($150, as on zeotein.com), no Google Ads
  final URL switch, no changes to zeotein.com, go.zeotein.com or the Starter Kit funnel.
- 23g is Cacao only, Vegan is 20g. Cacao says "zero sugar", Vegan says "zero added sugar". "First order", never
  "first month". No time of day, no frequency, no "one scoop", no founder language.
- The 30-day guarantee is described exactly as the published refund policy states it (first order, one 30-day
  supply, return required, opened is fine).
