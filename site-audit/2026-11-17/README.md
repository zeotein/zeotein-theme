# zeotein.com audit, 17 Nov 2026

Live store audit of zeotein.com (Shopify, live theme "Cacao LP updates 2026-11-05", `#187740487893`), desktop and phone,
plus fixes. Report for Dana: https://claude.ai/artifact/5td2VJohqYXkEWyggC2a6b (same page saved here as `report.html`).

## Result in one paragraph

The site is technically healthy: 79 pages on desktop and iPhone, 119 internal links, 0 broken links, 0 real script errors,
no sideways scrolling, and 0 disease, detox or weight-loss claims. Live now: redirects for dead links that real shoppers
used, two retired pages hidden, blog name and search descriptions, plant-only "You may also like" on the Vegan, pumpkin
seed and hemp pages, and two outdated collections hidden from Google. Eleven theme fixes, including the Organic Hemp Protein
page that has shown the collagen page since Nov 16, are built and verified in an unpublished copy of the live theme; Dana
approved publishing and they go live with one Publish click in admin. The Black Friday theme is patched, synced with live
and price-checked. Four small admin tasks need a person because Shopify does not allow them by API.

## Changed on the live store (all reversible)

| What | Where | Before | After | Undo |
|---|---|---|---|---|
| Redirect | `/collections/halloween-sale` (36 visits, 4 orders in 60 days, was 404) | 404 | `/collections/protein-blends` | delete UrlRedirect `776036712661` |
| Redirect | `/products/zeotein-cacao-bulk-bag-4-month-supply-buy-3-get-1-free` | 404 | `/products/zeotein-cacao-bag-30` | delete `776036745429` |
| Redirect | `/zeotein-30-day-supply` | 404 | `/products/zeotein-cacao-sticks-30` | delete `776036778197` |
| Redirect | `/products/zeotein-cacao-30-day-supply-15-off-for-life` | 404 | `/products/zeotein-cacao-bag-30` | delete `776036810965` |
| Redirect | `/products/zeotein-30-day-slack` | 404 | `/products/zeotein-cacao-sticks-30` | delete `776036843733` |
| Page hidden + redirect | "Labor Day Sale" `/pages/labor-day-sale` (Page `592382853333`): expired, in the sitemap, showed the Zeotein Difference layout | published | hidden, redirects to `/collections/protein-blends` | publish the page, delete redirect `776036876501` |
| Page hidden + redirect | "Zeotein Cacao — Landing Page" `/pages/zeotein-cacao-lp` (Page `589259079893`): showed the Zeotein Difference layout under an internal title, 0 visits in 60 days | published | hidden, redirects to `/products/cacao-protein-starter-kit` | publish the page, delete redirect `776036909269` |
| Blog name | Blog `100389978325` (`/blogs/news`) | "News" | "Wellness & Education" (matches the menu) + search description | rename back |
| Search description | Contact (`581904761045`), Shipping & Guarantee (`593821237461`) | auto text from the page body | written descriptions | delete metafield `global.description_tag` |
| Hidden from search engines | Collections "Home page" (`frontpage`, `503460692181`) and "Protein" (`protein`, `504838553813`): in no menu, outdated, listed in the sitemap (`publishableUnpublish` is blocked for the app) | indexed, in `sitemap_collections` | metafield `seo.hidden = 1`: `noindex,nofollow`, removed from the sitemap and storefront search; the pages still open by direct link. Verified live 17 Nov | delete metafields `193436326625493`, `193436326658261` |
| Menus (new, not shown until the hotfix theme is live) | `footer-shop`, `footer-learn`, `footer-help` | none | Shop / Learn / Help menus | delete the menus |
| Page template | "The Zeotein Difference" (`583315128533`) | template `page` (did not exist, fell back to the default) | template `the-zeotein-difference` (falls back to the same default layout on the current live theme, so nothing changes until the hotfix is live) | set back to `page` |

Verified live after the change: every redirect returns the target page; blog title, H1 and descriptions render.

## Built, verified, not live yet: hotfix theme

Theme **"Live + fixes 2026-11-17 (Claude hotfix)"** `#188199928021`, an exact copy of the live theme made 02:34 UTC with:

1. **Your Privacy Choices page fixed.** The default page template had been turned into the Zeotein Difference layout, so
   `/pages/data-sharing-opt-out` showed "More than protein" instead of the opt-out text and form. New section
   `sections/main-page-content.liquid`; `templates/page.json` now renders the page's own title and content; the old layout
   moved to `templates/page.the-zeotein-difference.json`.
2. **Footer menus.** The custom footer never rendered menus or social links. It now renders "Menu" blocks: Shop, Learn,
   Help (Contact Us, Shipping & Guarantee, Manage Subscription, Your Privacy Choices, SMS Terms). Shopify shows the Privacy
   Choices link only to visitors in states where it applies.
3. **Vegan Supplement Facts.** `Total Fat: 6 g` → `Total Fat: 6.5 g` on both Vegan product templates, matching the locked
   label spec (compliance-scrub SPEC and shop.zeotein.com). Confirm against a physical bag.
4. **Shop All on one page.** Collection grid 16 → 24 products per page (Shop All has 20).

Checked on the preview (`?preview_theme_id=188199928021`), desktop and iPhone: privacy page shows H1 and the opt-out form;
the Zeotein Difference page unchanged; footer menus on home, product, collection and page templates; Vegan facts 6.5 g;
Shop All 20 products, no pagination; 30 more pages (home, all blog posts, collections) load with no errors. The Black Friday
countdown shows in theme previews by design (`zt-bf-countdown-sitewide`: previews always show it) and stays hidden on the
live theme until 24 Nov.

### Publishing it (approved by Dana 17 Nov; the click is hers)

Dana approved publishing. Shopify's tool refused ("Only agent-created themes can be published here": a theme made with
`themeDuplicate` doesn't count), so the switch is one click in admin: Online Store → Themes → "Live + fixes 2026-11-17
(Claude hotfix)" → … → Publish. Also added to the hotfix after approval: the compact Rewards icon and chat bubble on every
phone page except cart (`layout/theme.liquid`, same change as step 6 below). Drift check at 02:56 UTC: live theme last
changed 01:27 UTC, before the 02:34 copy, so nothing to merge.


Before publishing, compare every file's `checksumMd5` between the live theme and the hotfix (GraphQL `theme.files`).
Any file that changed on live after 02:34 UTC 17 Nov, other than the files below, must be copied into the hotfix first, or
that change is lost. Files the hotfix changes: `sections/main-page-content.liquid` (new), `templates/page.json`,
`templates/page.the-zeotein-difference.json` (new), `sections/footer.liquid`, `sections/footer-group.json`,
`templates/collection.json`, `templates/product.vegan-30-day.json`, `templates/product.vegan-7-day.json`,
`layout/theme.liquid`, `blocks/zt-home-choose.liquid`, `sections/zt-home-hero.liquid`, `templates/product.cacao-lp.json`,
`sections/daily-routine-cacao-lp.liquid`, `sections/start-strong-cacao-lp.liquid`, `sections/whats-inside-cacao-lp.liquid`,
`templates/product.hemp.json`, `config/settings_data.json` (SEOAnt Sticky Add to Cart app embed off; if live's settings
changed after 02:34 UTC, take live's file and switch that one embed off again). Simplest check: in Online Store > Themes, the live theme's "last saved" time must still be
before 8:34 PM CT on 16 Nov (it still was at 05:11 UTC 17 Nov: last live change 01:27 UTC).
Rollback: publish "Cacao LP updates 2026-11-05" again (Online Store > Themes).

Publish soon: until then the live Organic Hemp Protein page keeps showing the collagen page's ingredient and Nutrition Facts
(about one landing visit a day, 63 in 60 days; 2 units sold in 90 days). A temporary switch of the hemp product to another
template was checked and rejected: on live, the default `product.json` is the Zeotein Cacao page (collagen, bone broth, Cacao
facts) and `product.zeotein-vegan-products.json` has the old 6 g fat and "detox" wording, and any switch would have to be
undone after publishing or the fixed hemp page would never show.

## Black Friday theme: patched 17 Nov (Dana approved)

"Black Friday Store 2026 (draft, publish Nov 27)" `#187825914069` had the same `page.json`, footer and collection files as
live and the same 6 g Vegan fat. Dana approved patching it; applied 17 Nov around 03:05 UTC (theme commits `1b19866`, `364b77b`)
after confirming no unsaved edits in its workspace and that every edited file matched the server. Verified through its preview:
privacy page opt-out form, footer menus, Vegan 30 and 7 at 6.5 g, Shop All 20 products on one page, compact Rewards icon.
The steps below are the record of what was applied (and how to re-apply to any future copy of live):

1. Add `theme-patch/sections/main-page-content.liquid` as `sections/main-page-content.liquid`.
2. Copy `templates/page.json` to `templates/page.the-zeotein-difference.json`, then replace `templates/page.json` with
   `theme-patch/templates/page.json`.
3. In `sections/footer.liquid`: insert `theme-patch/footer/footer-menus.css.liquid` right after the `{%- endstyle -%}` that
   closes the footer's main style block (just above `<footer`), and `theme-patch/footer/footer-menus.markup.liquid` right after
   `<div class="z-footer__bottom-inner">`. Add the three blocks in `theme-patch/footer/footer-group-blocks.json` to
   `sections/footer-group.json`.
4. `templates/collection.json`: `product-grid` → `products_per_page: 24`.
5. Both Vegan product templates: `Total Fat: 6 g` → `Total Fat: 6.5 g`.
6. `layout/theme.liquid` (Rewards/chat on phones, Dana approved 17 Nov): the `zt-pdp-floating-buttons` block condition
   `{%- if template.name == 'product' -%}` → `{%- if template.name != 'cart' -%}`, and add `form button[type="submit"]` to the
   script's `AVOID` list so the icon fades over form buttons.

Do not edit the theme's JSON in a stale workspace: check `theme.files` `updatedAt` first (theme_bash snapshots were up to
3 days old on 17 Nov).

## Round 2, overnight 17 Nov (Dana: "fix everything, no need to ask")

### Clarity
- Read the weekly Clarity digests in Gmail (project "Zeotein LLC", `v65yhyq9ay`, Nov 8 to 14): rage clicks 0% of sessions,
  dead clicks 3.92% (down 33.8%), quick backs 4.9% (up 65.4%), JavaScript errors 18.6% of sessions.
- JavaScript errors: on the top six pages the only errors are Shopify's own analytics/agent scripts throwing "Failed to fetch"
  when their tracking calls are blocked (ad blockers do this for real shoppers) and Shopify's experiment fetch. Not theme code,
  harmless to shoppers; most likely what drives the 18.6%. The theme's own fetch wrappers handle failures correctly.
- Two Clarity projects record zeotein.com and both email Dana a weekly digest named "Zeotein LLC": `v65yhyq9ay` (Clarity
  Shopify app pixel) and `v65ogd4cbw` (hard-coded in `layout/theme.liquid`). Nov 8 to 14 on `v65ogd4cbw`: dead clicks 4.84%,
  quick backs 6.18% (up 59%), script errors 16.2% (down 51.8%). The internal-traffic tag (`?zt_internal=1`) only reaches
  `v65ogd4cbw`. Decision for Dana: keep one. Not changed.
- Page-level Clarity data (which elements get dead clicks, error messages) needs a Clarity Data Export API token
  (Clarity, project settings, Data Export). `www.clarity.ms` is reachable from the session. Dana chose not to add the token
  on 17 Nov; optional, nothing in this audit depends on it.

### Live store (data, live now)
- Search & Discovery related products (metafield `shopify--discovery--product_recommendation.related_products`) on Vegan 30,
  Vegan 7, Organic Pumpkin Seed Protein and Organic Hemp Protein: plant-based items only (Vegan packs, pumpkin seed, hemp, MCT,
  shaker) instead of collagen and bone broth. Verified with `/recommendations/products.json`. Undo: delete those 4 metafields.
- Uploaded 3 PNG copies of the Cacao landing page cutouts (`zeotein-cacao-bag-cutout.png`, `zeotein-cacao-routine-cutout.png`,
  `zeotein-beef-bone-broth-cutout.png`), same pixels. Shopify's CDN sends iPhones a lossless PNG for transparent WebP sources
  (bag at 1000px: 821 KB) but a WebP for PNG sources (61 KB). Old files kept.

### Added to the hotfix theme `#188199928021` (and the Black Friday theme)
- Homepage dead clicks: the product photos in "Choose Your Zeotein" and the hero photo now link like their buttons
  (`blocks/zt-home-choose.liquid`, `sections/zt-home-hero.liquid`). Verified: tapping the Cacao photo opens the Cacao bag page.
- LeadConnector chat loads after the page `load` event (idle, or first tap/scroll) instead of a blocking script at the end of
  `body` (`layout/theme.liquid`). Verified the same three widget files load as on live.
- Cacao landing page (`templates/product.cacao-lp.json`, and BF `product.cacao-lp-bf.json`): the three cutouts point at the PNG
  copies. iPhone image weight on `/products/cacao-protein-starter-kit` at 1x: 1,271 KB on live, 667 KB on the hotfix; more at
  retina sizes. Visually identical (side-by-side checked).
- "Transform your daily routine." → "Simplify your daily routine." on the Cacao landing pages (compliance prescan HIGH flag on
  "transform"; landing page used by Meta ads).
- The default "Home page" collection and the outdated "Protein" collection: unpublishing is blocked for the app
  (`publishableUnpublish` refused), so both are hidden from search engines, the sitemap and storefront search instead
  (`seo.hidden`, see the change table). Fully unpublishing them in admin is optional.

### Black Friday theme audit
- 10 key pages in preview (home, protein-blends collection and page, regular and BF Cacao bag, BF and regular stick packs,
  Vegan 30, Stocking Stuffers, Cacao landing page): HTTP 200, no script errors, no broken images, no sideways scroll.
- Prices match the scheduled discounts and selling plans: bag $76.99 (30% off), sticks $94.49, Vegan 30 $97.99 with 2 packs
  $189.99, 3 packs $275.99, 4 packs $355.99 (36.4% = "up to 36%"), 7-day $27.99 and $31.49; BF landing page $68.99, $133.98,
  $195.99 for 1/2/3 bags (subscription, first order), renews $99.99.
- The storewide "30% off everything (one-time only)" discount starts Nov 27 12:00 AM CT. The live theme correctly shows Black
  Friday prices only for Vegan 30 during Nov 24 to 26 (matching the Vegan discounts that start Nov 24). **Publish the BF theme at
  Nov 27 12:00 AM CT, not earlier**, or its "30% off everything" copy shows before that discount is active.
- "30% off everything" collection holds every active product except the gift card (Shopify never discounts gift cards) and
  Vegan 30 (own tiers). Optional: add "Gift cards excluded." to the fine print.
- BF bag and Stocking Stuffers gift have inventory tracking off, so they can't sell out by accident.
- Compliance prescan on BF pages: no disease, detox or weight-loss language; Vegan facts now match the label.

### Live bug found and fixed in the hotfix: Organic Hemp Protein page showed the collagen page
- Since Nov 16 ~8 AM CT, `templates/product.hemp.json` on the live theme has been an exact copy of
  `product.collagen-peptides.json` (same checksum, `6c09150c…`). Live `/products/organic-hemp-protein-powder-premium-plant-based-protein`
  shows the collagen Nutrition Facts (2 tbsp / 12.5 g, 45 calories, 0 g fat), lists the ingredient as
  "Grass-fed bovine collagen peptides", and the cross-sell says "the same grass-fed collagen peptides in Zeotein Cacao".
  A vegan shopper is told the product is bovine collagen.
- Fixed in the hotfix theme (commit `f1f044db`): restored the hemp template (1/4 cup / 28 g, 120 calories, 3.5 g fat,
  "Organic hemp protein powder", Vegan cross-sell). The Black Friday theme already had the correct hemp page.
  Verified in the hotfix preview: hemp facts shown, zero "collagen" mentions. Goes live when the hotfix is published.
- Checked every other single-ingredient template (bone broth, collagen, lion's mane, MCT, sea moss, pumpkin seed, zeolite,
  organic cacao): serving sizes and calories match their own products.

### Black Friday theme brought up to date with live (commit `23c04116`)
- Compared all 448 BF files with live (checksums, then content diffs with JSON normalised). 44 files had been edited on
  both themes since Nov 8; 38 of those differ only in a trailing newline, line endings or indentation, or on purpose
  (BF-only prices, BF header, BF homepage buttons, BF stocking-gift cart rule).
- Live changes the BF theme was missing, now ported:
  - The Nov 16 buy-box redesign Dana approved (rating line, format switcher, subscription perks, trust row, review quote,
    sticky add-to-cart, Vegan 30 Black Friday price table, "14g grass-fed collagen peptides" lead) on 7 product
    templates: Vegan 30, Vegan 7, Cacao 30 sticks, Cacao 7, Cacao bag, Organic Cacao, Zeolite. Without this, publishing
    the BF theme on Nov 27 would have put the old buy box back on every blend page.
  - The checkout SMS consent text (`shopify.checkout.marketing.sms.disclaimer` in `locales/en.default.json`, live since
    Nov 14). Without it, checkout would fall back to Shopify's default SMS wording on Nov 27.
- Verified in the BF preview on iPhone: all 7 pages 200, no script errors, no sideways scroll, every buy-box part visible,
  Black Friday strip on every product, Vegan 30 table $97.99 / $189.99 / $275.99 / $355.99 for 1 to 4 packs.
- Left alone on purpose: homepage copy (renders the same on both), homepage hero (same photo, BF copy has alt text),
  `zt-guides-cart.js` (comment-only difference), `zt-clarity-internal` (BF copy is the cleanly indented one).
- Note for whoever edits live before Nov 27: the BF theme does not pick up live edits. Re-run the comparison before
  publishing (`tools/theme-sync-check.sh` for theme_bash, `tools/portcheck.js` for the preview). A scheduled re-check runs in
  this Claude session on Thu Nov 26 at 2:13 PM CT (scheduled task `trig_01Qs4TUWYcWbq5RhYNq7uv7X`; delete it to cancel).

## Round 3, late 16 Nov CT: where shoppers drop off

Dana re-sent "use Clarity to see where people stop... fix everything". She declined the Clarity API token, so the drop-off
was read from Shopify (ShopifyQL), GA4, Meta Ads and Google Ads (Supermetrics, read only). Per the zeotein-ad-decisions skill,
the Ad Decisions doc and the Ad Setup Guardrails were read first; nothing decided there is re-raised (Z_Shopping_SI is a
deliberate campaign, the LP-only discounts were fixed 5 Nov, the Merchant Center price override is in progress).

### Findings
- Checkout is fine. Phones, 30 days, Manitowoc and no-city sessions removed: 1,529 visits → 72 add to cart (4.7%) → 53
  reached checkout (74% of carts) → 25 orders (47% of checkouts, normal).
- GA4 (property `535557069`, `G-PMY2ZXX539`; the second "Zeotein Website" property `535580236` returns no data), 30 days:
  `/products/cacao-protein-starter-kit` bounces 73% of phone visits after about 15 s of engagement; same page on desktop 32%;
  other product pages on phones about 35%.
- Page speed (`tools/lpperf.js`: Facebook iOS user agent, iPhone 13, Slow 4G 150 ms / 1.6 Mbps, 4x CPU) on the live LP: first
  paint 2.2 s, LCP 3.3 s, DOM ready 8.8 s, load 12.2 s, 1.97 MB in 250 requests (scripts 841 KB, fonts 337 KB in four families:
  GT Standard 128 KB for Shop Promise, Inter, Manrope x5, Poppins x5). Nothing covers the page; the "Claim My 55% Off" button
  is `<a href="#purchase">`, so it works before scripts finish. Biggest scripts (`tools/weights.js`): Judge.me 253 KB in many
  chunks, Shop Promise PDP 120 KB, Shopify web pixels 87 KB, Seal 75 KB, BON Loyalty 68 KB.
- LP HTML is 805 KB: inline CSS 244 KB, inline JS 290 KB. 88 KB of `girafflybounce` CSS and a 33 KB currency-converter script
  come from the SEOAnt Sticky Add to Cart app embed, which renders nothing on any page type (`tools/seoant.js`: bag, Vegan 30,
  LP, zeolite, shaker, gift card, Shop All; phone and desktop) and calls codeblackbelt.com with `shop=zeotein-llc.myshopify.com`.
- Organic Cacao page: 264 Google sessions in 30 days, 6 add to cart, 2 orders, normal engagement. Intent and price, not a broken
  page (Z_Shopping_SI traffic).
- New customers per week (Shopify): 8, 12, 12, 9 from Sep 7; 1, 4, 3, 5, 3, 5 from Oct 5. Orders held at 15 to 20 a week on
  repeat and subscription customers. Matches the Decisions doc open question "Paid ads produced no new customers, Oct 1–22".
- GA4 add-to-carts on the LP read about 5x high (352 on 248 sessions): the four free gifts are added automatically.
- `/cart` landings that rarely reach checkout are test traffic (no-city and Manitowoc, week of Nov 9), not shoppers.
- Ad funnel buy links (marketing.zeotein.com, go.zeotein.com) all resolve: product links 301 to current handles, cart
  permalinks open checkout. Old product URLs still getting visits all 301 to current products.
- Shopify's cookie banner shows in theme previews only (`tools/banner.js`: live `shouldShowBanner()` false, region US).
- The Black Friday bag (`30-day-cacao-bulk-bag-black-friday`, UNLISTED, $109.99) has its selling-plan first-order prices
  ($68.99 / $133.98 / $195.99) usable today by anyone with the direct link. Pricing call for Dana; not changed.

### Changed
- Hotfix `#188199928021` commit `ef8d055` and Black Friday `#187825914069` commit `f19b0fe`: in `config/settings_data.json` the
  SEOAnt Sticky Add to Cart app embed (block `6248343940173316906`) is `disabled: true`. One-line diff each, every other embed
  unchanged. Verified in both previews: home, LP, bag, zeolite and Shop All return 200 with no SEOAnt code; LP HTML 806 KB on
  live vs 690 KB; theme sticky bars present; no script errors. Undo: Theme settings › App embeds › SEOAnt Sticky Add to Cart on.
- Ad Decisions doc: the "Run a page speed test on zeotein.com/products/cacao" item now reads DONE 16 Nov; a "SITE AUDIT
  FOLLOW-UP, Mon 16 Nov 2026" entry at the end holds these findings and an open question on the LP phone bounce.
- ClickUp, Meta Ads list: task `86bd48yhm` "Recheck Cacao landing page phone bounce 14 days after the hotfix theme is
  published", due Dec 1, assigned to Dana.
- Report v6: "Where shoppers drop off" section, fix 11, corrected Clarity wording.

### For the Nov 26 pre-launch check (`trig_01Qs4TUWYcWbq5RhYNq7uv7X`)
Editing that scheduled task's prompt was not permitted in this session, so these notes carry two additions:
- Keep the SEOAnt Sticky Add to Cart embed OFF in `config/settings_data.json` of both the hotfix and the BF theme; if live has
  it on, do not copy that setting across.
- If the hotfix is live by then, re-time the LP with `tools/lpperf.js` on the live URL (not a preview: previews add Shopify's
  preview bar and cookie banner scripts) against the baseline above, and note the publish date for ClickUp `86bd48yhm`.

## Round 4, morning 17 Nov CT (Dana 6:29 / 6:31 / 6:32 AM: "fix everything", publish, delete old themes, two Flows, guides script)

### Blocked in this cloud session (needs Shopify admin in a browser)
- Publish the hotfix: `theme_publish` refused again ("Only agent-created themes can be published here"); the GraphQL
  publish and `themeDelete` are blocked for this app. No Admin API exists for Shopify Flow workflows (checked shopify.dev).
- No Claude in Chrome tools in this session. LenovoPro's folders are not offered to cloud sessions, starting a session in the
  LenovoPro bridge environment was refused until the owner trusts this session, and Dana declined that trust card, so it
  was not asked again.
- Ready to run instead: `handoff-laptop-runbook.md` (paste into a Claude session on the laptop with Claude in Chrome).
  It covers: publish the hotfix, delete outdated themes, Save-A-Scoop and win-back Flow edits, the F2 check, and the
  admin-only fixes (checkout logo, homepage title and description, store name, "(U.S. only)" typo, hide the Home page and
  Protein collections, the review reply). Copy in it passed the compliance prescan with 0 findings and has no em dashes.
- Facts for the Save-A-Scoop Flow: the Black Friday bag (product 15501241352405) and the landing-page bag (15398808027349)
  share SKU `ZEO-CAC-BULK-30-LP`, so only a product ID or handle rule can include one and exclude the other.
- The Black Friday theme already loads the guides-cart script (`snippets/meta-tags.liquid` renders
  `snippets/zt-guides-cart-data.liquid`, which loads `assets/zt-guides-cart.js`). **The Save-A-Scoop Flow fix and the F2
  handle exclusion must be in place before the Black Friday theme is published on Nov 27**, or the guides go live with
  unfixed Flows. Gift SKU `ZEO-CAC-STICK-07-SBF-GIFT` belongs to a Draft product (15535933325525), left as is.

### Done via the API (verified)
- Black Friday hero fine print now ends "...on their own. Gift cards excluded." (`sections/header-group.json`, BF commit
  `d6d65192`). The sandbox copy of that file was older than Shopify's (Shopify had the Nov 15 "30% off one-time orders"
  announcement), so the edit was built on Shopify's copy, checked byte for byte (md5 `466c18e4` before, `5f595e63` after)
  and read back from Shopify and the BF preview. Backup: `backups/bf-187825914069/sections__header-group.json.server-2026-11-15T153013Z`.
- Prices without the "USD" code, one consistent style (`config/settings_data.json` `current.currency_code_enabled` false;
  hotfix commit `5262e7bc`, BF commit `90ca9883`; one-line canonical diff each). Previews: Shop All 40 to 0 prices with
  "USD", Zeolite page 2 to 0. The cart's estimated total keeps "USD", as Dawn always does. Undo: Theme settings, Currency
  format, show currency codes.
- Blog SEO titles shortened on 8 posts (metafield `global.title_tag`), live now; live page titles read back at 49 to 62
  characters. Backup of the old values: `backups/blog-seo-titles-before-2026-11-17.tsv`.
- Redirects `/collections/frontpage` and `/collections/protein` to `/collections/shop-all` (IDs 776120434901, 776120467669).
  They stay dormant (both collections still return 200) until the collections are hidden from the Online Store.
- "Before" screenshots of the live store (desktop: home, Hemp, Cacao 30, Vegan 30, bulk bag, Organic Cacao, cart; phone:
  home, Hemp, Cacao 30, Organic Cacao): the Hemp facts pair is in `evidence/screenshots/2026-11-17-morning/`. Two phone
  pages hit Shopify's Cloudflare check for the test machine and need a retake after publishing (`tools/verify-live.js`).

### Not done on purpose
- Old Facebook link `/products/zeotein-cacao-30-day-supply`: still goes to the legacy $91.99 then $114.99 offer. Changing it
  changes the offer people get from an old post, and plan prices are on the never-touch list. Dana's call.
- Which Clarity project to keep: Dana's call (only `v65ogd4cbw` is in the page code; the app's project records separately).
- Black Friday bag $68.99 first order reachable by direct link today: pricing, not allowed in this pass.
- Polish left for a follow-up: H1 headings on FAQs, Contact, Shipping & Guarantee and The Zeotein Difference (their first
  sections are shared custom sections that need a heading-tag setting); best sellers on the 404 and empty-cart pages;
  shorter homepage with prices; footer social links (need the URLs).

## Needs a person (not available by API on this plan)

1. **Checkout logo.** Checkout header shows the text "Zeotein LLC". Settings → Checkout → Customize → Branding → Logo.
   (Checkout Branding API is Shopify Plus only.)
2. **Homepage title and description.** The homepage `<title>` is "Zeotein LLC". Online Store → Preferences.
3. **Store name.** "Zeotein LLC" is appended to every page title and shown in checkout and the footer copyright. Consider
   "Zeotein", keeping the LLC as the legal business name.
4. **Free-shipping bar typo.** "(U.S only)" → "(U.S. only)" in the shipping bar app's message settings.

## Files here

| Path | What |
|---|---|
| `theme-patch/` | The exact code changes, for the Black Friday theme or any future copy of live |
| `evidence/analytics-2026-11-17.md` | Sessions by device, internal-traffic breakdown, 404 landing pages, top landing pages |
| `evidence/crawl-summary.json` | 158 page loads (79 pages × desktop, phone): status, title, description, H1, width, broken images, timings |
| `evidence/compliance-summary.json` | Compliance prescan results and verdict |
| `evidence/landing-pages-60d.txt` | Every landing path with traffic in 60 days and its visits |
| `evidence/screenshots/` | Before/after and issue screenshots used in the report |
| `tools/` | The Playwright scripts used (crawl, full-page capture, preview check, cart flow, script inventory) |

Test runs blocked analytics and ad beacons (Meta, Google, Clarity, Shopify monorail and web pixels), so they should not
appear as visits. One cart → checkout flow was opened (no details entered, no order). Heavy crawling triggered Shopify's
"verify your connection" check for the test machine around 02:40 UTC; it cleared within minutes and does not affect shoppers.
