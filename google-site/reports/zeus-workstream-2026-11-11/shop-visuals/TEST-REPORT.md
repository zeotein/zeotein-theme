# shop.zeotein.com rebuild: cart, checkout and UTM test report

**12 Nov 2026, overnight.** All 17 blocks are built and tested. Nothing is pasted into GoHighLevel yet: GoHighLevel's
API can't write page code, and the rating line needs Dana's approval first. No order was placed and no payment was
taken. No checkout form was filled in.

Install kit (blocks, steps, approval, results): https://claude.ai/artifact/7xHhZwMmCAHnwAEc7dAmmb

## Results at a glance

| Check | Result | Evidence |
|---|---|---|
| Every buy option, delivery schedule, size and Add to cart button adds the exact Shopify variant + selling plan at the catalog price | **250 of 250 pass** | `e2e/e2e-results.json` |
| (a) Single item → live Shopify checkout (Collagen 1 lb, from the on-site Checkout button) | **Pass:** checkout shows 1 × Collagen Peptides 1 lb, $46.99 | `checkout/A-single-item-onsite-cart.png`, `checkout/A-single-item-LIVE-shopify-checkout.png` |
| (b) Blend + single → live Shopify checkout (Cacao Starter Kit every 6 weeks + Sea Moss ½ lb) | **Pass:** $136.98; "First payment $76.99, then $99.99 every 6 weeks"; gclid, utm_source and landing_page saved on the cart. The live run (04:30 UTC) sent the exact chain the Checkout button builds for this cart (asserted field by field in part C); the later button-click run was stopped by the bot check | `checkout/B-blend-plus-single-onsite-cart.png`, `checkout/B-blend-plus-single-LIVE-shopify-checkout.png` |
| Checkout → back → add more → checkout again | **Fixed:** checkout now clears the Shopify cart first. Verified live that a stale 2 × Collagen cart was wiped before the new items were added | `checkout/B-blend-plus-single-LIVE-shopify-checkout.png` |
| Vegan kit + Hemp; Cacao stick-pack subscription + Lion's Mane | Cart and checkout link pass. **The live runs were blocked by Shopify's bot check** on this cloud machine (see below). Retest after paste | `checkout/D-…-onsite-cart.png`, `checkout/E-…-onsite-cart.png`, `checkout/BLOCKED-shopify-bot-check-0450UTC.png` |
| UTM + gclid passthrough | **Pass:** gclid, utm_source/medium/campaign/term/content, landing_page and source_site are written to the Shopify cart (they become the order's additional details) and also ride on the first zeotein.com request | `e2e/e2e-results.json`, part C |
| No $89.99 anywhere: pages, cart, checkout link, Shopify checkout | **Pass:** the $89.99-renewal plan (4659019989) is never offered, and an old cart holding it is cleaned on load | tests A–D |
| Links: 349 internal links and anchors, 3 external, 31 images | **0 problems.** The only zeotein.com links are subscription login, privacy and terms; nothing sends shoppers to browse zeotein.com | `link-check.json` |
| Render: 17 pages × phone + desktop | **34 of 34 clean:** no JavaScript errors, failed requests, broken images or sideways scroll | `qa/render-report.json` |
| Compliance gate (zeotein-compliance-scrub prescan + house rules) | **0 blocking.** The High hits are the word "guarantee" in the money-back terms; the one Medium is "promotional items" in the refund policy | `qa/compliance-report.json` |

## How checkout works now

The cart lives on shop.zeotein.com. Shoppers add blends and single ingredients there and never browse zeotein.com.
**Checkout** sends one request chain to Shopify:

`/cart/clear` → `/cart/add` (every line with its variant and selling plan) → `/cart/update` (gclid, UTMs, landing page,
source site as cart attributes) → `/checkout`

Shopify's redirects drop query parameters, so the ad data is written into the cart itself, where it stays on the
order. Clearing first means the checkout always matches the on-site cart exactly.

## Bugs found and fixed tonight

1. **Items doubled** if a shopper went to checkout, came back and checked out again. Fix: clear the Shopify cart first. Verified live.
2. **The phone "Add to cart" bar never appeared** on Cacao and Vegan after a fast scroll or an in-page link. It now tracks scroll position instead of a visibility observer.
3. **A saved cart kept old prices.** Every line is now rebuilt from the current catalog on load, and any size or plan no longer offered (including the $89.99 plan) is dropped.
4. **The product photo went soft** on retina screens after switching options. It now swaps to the full-size image.
5. Cart quantity stepper stacked vertically; broken `/cacao#label` link from Home; announcement bar wrapping on phones; rating line wrapping awkwardly; cramped single-ingredient cards on phones.
6. An internal catalog note containing the word "Zeolite" was shipping in every page's source. It is now stripped from the build.

## Holds respected

- **$89.99 renewal:** never offered. Cacao Starter Kit plans are 6596853973 / 6622773461 / 6622806229 only ($76.99, then $99.99).
- **Shipping threshold:** unchanged. The site states the existing free US shipping over $150, the same as zeotein.com.
- **Review text:** not published. Before/after board: `before-after/REVIEW-TEXT-before-after.png`. If Dana says no, the no-rating versions of Home, Cacao and Vegan are ready in `dist/ghl/no-rating/`.
- **Google Ads final URLs:** not touched; marked on hold in the kit.
- **Zeolite:** Zeolite Powder is not sold or shown, and the word appears in no block. The blends disclose "a naturally occurring volcanic mineral" in ingredient lists and the FAQ only; it is garbled on every package photo.
- **zeotein.com, go.zeotein.com and the Starter Kit funnel:** not changed. The only contact was read-only page checks and test carts in a separate browser.

## Shopify's bot check (why the last two live flows are pending)

After a night of automated cart and checkout requests, Shopify began answering this cloud machine's cart requests
with HTTP 429 and a Cloudflare "Your connection needs to be verified" check (from about 04:40 UTC). A plain cart read
still worked; every cart change was challenged, with or without the new chain. This affects the test machine, not
the site: real shoppers' browsers normally pass that check automatically. The check was not bypassed. Retest after
paste: `node qa/e2e_cart.js https://shop.zeotein.com reports/live --only-checkout --gap=45`.

## Noindex (Zeus and Dana's item): re-checked 05:12 UTC

| Pages | Status |
|---|---|
| shop.zeotein.com: all 9 URLs | **Done:** `noindex, follow` in the page HTML |
| marketing.zeotein.com/zeotein-cacao, /landing-page-cacao, /cacao-sales-page | **Done** |
| /starter-kit-google, /starter-kit-page, /starter-kit | **Script-only:** the HTML says index and a script switches it to noindex. Add the meta line to each funnel step's Head for a reliable result |
| /cacao-stick-packs-starter-kit | **Not noindexed** |
| Quiz at marketing.zeotein.com/ | Not noindexed (Zeus and Dana handling) |
| zeotein.com, robots.txt | Correct: indexable, no bot blocks |

Details: `NOINDEX.md`, `noindex-check-0512utc.txt`.

## What needs a person

1. **Dana:** approve or decline "4.9 from 155 reviews" (`before-after/REVIEW-TEXT-before-after.png`).
2. **Whoever installs:**
   - create the 9 new pages (paths are in the kit);
   - paste all 17 blocks and the new Head snippet;
   - publish.

   It takes about 45 minutes, or paste the kit's prompt into Claude on a PC with Chrome.
3. **Then Claude:** re-run the cart, link and compliance tests against the live shop, including the two pending live flows.

## Files in this folder

| Path | What |
|---|---|
| `before-after/PAGES-desktop-before-after.png`, `PAGES-phone-before-after.png` | Home, Cacao and Vegan: live today vs rebuilt |
| `before-after/REVIEW-TEXT-before-after.png` | The rating-line approval board |
| `before-after/before-*.png`, `after-*.png` | Raw first-screen shots, desktop and phone |
| `checkout/` | On-site carts and live Shopify checkouts, plus the bot-check screenshot |
| `e2e/e2e-results.json` | All 250 checks, by name |
| `link-check.json` | Every external link and image status |
| `NOINDEX.md`, `noindex-check-*.txt` | Noindex paste guide and verification runs |
