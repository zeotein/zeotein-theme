# zeotein.com audit, 17 Nov 2026

Live store audit of zeotein.com (Shopify, live theme "Cacao LP updates 2026-11-05", `#187740487893`), desktop and phone,
plus fixes. Report for Dana: https://claude.ai/artifact/5td2VJohqYXkEWyggC2a6b (same page saved here as `report.html`).

## Result in one paragraph

The site is technically healthy: 79 pages on desktop and iPhone, 119 internal links, 0 broken links, 0 real script errors,
no sideways scrolling, and 0 disease, detox or weight-loss claims. Seven live fixes are done (redirects for dead links that
real shoppers used, two retired pages, blog name and search descriptions). Four theme fixes are built and verified in an
unpublished copy of the live theme and wait for Dana's OK to publish. Four small admin tasks need a person because Shopify
does not allow them by API.

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

### Publishing it (needs Dana's yes in the session)

Before publishing, compare every file's `checksumMd5` between the live theme and the hotfix (GraphQL `theme.files`).
Any file that changed on live after 02:34 UTC 17 Nov, other than the eight below, must be copied into the hotfix first, or
that change is lost. Files the hotfix changes: `sections/main-page-content.liquid` (new), `templates/page.json`,
`templates/page.the-zeotein-difference.json` (new), `sections/footer.liquid`, `sections/footer-group.json`,
`templates/collection.json`, `templates/product.vegan-30-day.json`, `templates/product.vegan-7-day.json`.
Rollback: publish "Cacao LP updates 2026-11-05" again (Online Store > Themes).

## Black Friday theme: same bugs, patch not applied yet

"Black Friday Store 2026 (draft, publish Nov 27)" `#187825914069` has the same `page.json`, footer and collection files as
live (identical checksums) and shows the same 6 g Vegan fat. If it is published without this patch, the fixes above roll
back on 27 Nov. Another agent committed to that theme as recently as 00:08 UTC 17 Nov and its theme_bash workspace is
shared, so the patch was not applied without coordination. To apply (about 2 minutes, in this order):

1. Add `theme-patch/sections/main-page-content.liquid` as `sections/main-page-content.liquid`.
2. Copy `templates/page.json` to `templates/page.the-zeotein-difference.json`, then replace `templates/page.json` with
   `theme-patch/templates/page.json`.
3. In `sections/footer.liquid`: insert `theme-patch/footer/footer-menus.css.liquid` right after the `{%- endstyle -%}` that
   closes the footer's main style block (just above `<footer`), and `theme-patch/footer/footer-menus.markup.liquid` right after
   `<div class="z-footer__bottom-inner">`. Add the three blocks in `theme-patch/footer/footer-group-blocks.json` to
   `sections/footer-group.json`.
4. `templates/collection.json`: `product-grid` → `products_per_page: 24`.
5. Both Vegan product templates: `Total Fat: 6 g` → `Total Fat: 6.5 g`.

Do not edit the theme's JSON in a stale workspace: check `theme.files` `updatedAt` first (theme_bash snapshots were up to
3 days old on 17 Nov).

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
