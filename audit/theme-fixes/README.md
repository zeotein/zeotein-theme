# Theme script-error fixes, November 10–11, 2026

> **Update, Nov 13:** all five fixes are now on the **live** theme (applied 19:12–19:14 UTC by someone with live access) and in the **Black Friday** theme. Checked on the live product page: no `@theme/section-hydration` import, none of the four missing header scripts, and the menu uses `<zt-header-drawer>`. The Black Friday theme's copies match the fixed files; its cart drawer also skips the scripts on the `stocking-gift` template. **Don't publish "Live + script error fixes (Nov 10)"**: the live theme has changed since (layout, gift-card script, cart footer, a new digital-guides template), so publishing it would undo those. It is now only a preview for the product page cleanup.

Fixed theme (unpublished, ready to publish): **Live + script error fixes (Nov 10)**, ID `187923202261`.
Preview: https://zeotein.com/?preview_theme_id=187923202261

It is an exact copy of the live theme ("Cacao LP updates 2026-11-05", ID `187740487893`) with five files changed. Nothing on the live theme was edited. The live theme has not been changed since Nov 9, 21:03 UTC (checked Nov 11), so publishing the fixed copy loses no one's work.

## Why nobody saw these errors

They only appear in the browser's developer console. Nothing visibly breaks, so a normal test click-through looks fine. Microsoft Clarity records them from real visitors: 21.9% of sessions on Nov 8–10 had script errors (152 errors), and the Cacao landing page had 66 errors across 6 sessions.

## What was broken and what changed

| # | Where | What shoppers' browsers hit | Fix | File |
|---|---|---|---|---|
| 1 | Every page except the Cacao landing page | Header ran `import { hydrate } from '@theme/section-hydration'`. The theme has no import map, so it failed on every page load ("Failed to resolve module specifier"). It never ran; the menus are fully rendered without it. | Removed the dead inline script | `sections/header-custom.liquid` |
| 2 | Every page except the landing page | 4 script files requested that do not exist in the theme: `header.js`, `header-drawer.js`, `cart-icon.js`, `header-actions.js` (4 × 404 per page view) | Removed the 4 references. The header already works through inline scripts. | `sections/header-custom.liquid`, `snippets/header-custom-actions.liquid`, `snippets/header-custom-drawer.liquid` |
| 3 | Mobile menu, every page | Every tap on the menu icon threw "Cannot read properties of null (reading 'classList')". The old Dawn menu script in `global.js` grabbed the new menu (both use the tag `<header-drawer>`) and looked for page parts the new header does not have. | Renamed the new menu's tag to `<zt-header-drawer>` so the old script leaves it alone. Also keeps `aria-expanded` correct when the menu closes (screen readers). | `snippets/header-custom-drawer.liquid` |
| 4 | Cacao landing page (Meta ads) | `cart.js` loaded 3 times, `cart-drawer.js` 2 times, `quantity-popover.js` 3 times, and 2 full copies of the cart drawer were built (duplicate `#CartDrawer` IDs). Threw "CartRemoveButton / CartDrawer has already been declared" on every load. | The landing-page layout already loads these once, in the right order. The cart-drawer snippet and the buy box now skip their extra copies on the `cacao-lp` template. | `snippets/cart-drawer.liquid`, `sections/buy-box-cacao-lp-v2.liquid` |

Line-by-line diffs: [`diffs/`](diffs/). Re-apply to another copy of the same code: `python3 audit/scripts/theme-qa/apply_fixes.py <originals> <output>` (refuses to run if the files have drifted).

## Verification (live theme vs fixed copy, real browser, Nov 10–11)

**Script errors** (7 page types × iPhone 13 and desktop Chrome: home, collection, product, landing page, cart, search, About):

| | Live | Fixed copy |
|---|---|---|
| Header module error | every page | 0 |
| Missing theme files (404) | 4 per page | 0 |
| Mobile menu error | every open | 0 |
| Landing page "already declared" errors | 2 per load | 0 |
| Cart drawers on landing page | 2 | 1 |

The only console error left in testing, "Failed to fetch", comes from Shopify's analytics trying to reach hosts the test machine blocks. It disappears when those hosts answer, so real shoppers do not get it.

**Landing page cart**: identical on both themes, line by line (variants, quantities, subscription plan, gift properties, drawer contents, totals):

| Option | Total |
|---|---|
| Subscribe, 1 / 2 / 3 bags | $76.99 / $149.98 / $219.99 |
| One-time, 1 / 2 / 3 bags | $109.99 / $199.98 / $269.97 |

Gift lock unchanged: subscribe adds one shaker, plus the 4 bulk-bag gifts. Removing an item in the drawer works.

**Header and product page**: identical behavior. Mobile menu (11 links, Shop submenu, close button, link navigation), search popup, desktop Shop dropdown, add to cart (goes to /cart, counter shows 1), Subscribe & Save widget ("SAVE $10.00, $99.99, deliver every month / 6 weeks / 8 weeks").

**Visual**: full-page screenshots, pixel diff with pop-ups hidden. Home (phone and desktop), landing page, cart and product page (desktop) are pixel-identical. On the phone product page, one Judge.me review card sometimes shows a shorter excerpt; it flips between themes from run to run (a timing race inside the review widget), so it is unrelated to these changes.

## Black Friday draft theme (ID `187825914069`)

Its five files were byte-identical to live, so the same fixes apply. Status as of Nov 11:

| File | Status |
|---|---|
| `snippets/header-custom-actions.liquid` | Fixed, checksum verified |
| `snippets/header-custom-drawer.liquid` | Update sent; read-back was blocked, so not verified |
| `sections/header-custom.liquid`, `snippets/cart-drawer.liquid`, `sections/buy-box-cacao-lp-v2.liquid` | Not yet changed (original code) |

Each fix stands alone, so this partial state breaks nothing. The remaining files were paused pending Dana's explicit OK. The draft was not published.

## Housekeeping

- **Delete in Shopify admin:** theme "TEMP control copy for QA (delete me)" (ID `187931492565`), an untouched copy used only as a test control. Theme deletion is blocked for Claude.
- **Shopify Files:** five temporary uploads named `ztfix-*.txt` carry the fixed file contents (used to write them into the theme). Keep them until the Black Friday draft is finished, then delete them (Content → Files).

## Not changed (noticed while testing)

- Subscribing to 3 bags on the landing page puts the bags in the cart as two lines (2 × $73.33 and 1 × $73.33) instead of one line of 3. It was like this before the fix and the total is correct ($219.99). It is cosmetic, but worth tidying.
