# Product pages: final package for the live paste (Nov 15, 2026)

Built overnight on Dana's instructions (relayed by Orbit). Everything is in the preview duplicate **"Live + script error fixes (Nov 10)"** (`187923202261`). The Black Friday theme gets the same files (see "Black Friday theme" below). **Nothing was written to the live theme `187740487893`.**

## Preview links (open on a phone)
| Page | Link |
|---|---|
| Cacao bulk bag | https://zeotein.com/products/zeotein-cacao-bag-30?preview_theme_id=187923202261 |
| Cacao 30 sticks | https://zeotein.com/products/zeotein-cacao-sticks-30?preview_theme_id=187923202261 |
| Cacao 7-Day | https://zeotein.com/products/zeotein-cacao-sticks-7?preview_theme_id=187923202261 |
| Vegan 30 sticks | https://zeotein.com/products/zeotein-vegan-sticks-30?preview_theme_id=187923202261 |
| Vegan 7-Day | https://zeotein.com/products/zeotein-vegan-sticks-7?preview_theme_id=187923202261 |
| Cacao powder | https://zeotein.com/products/organic-fermented-cacao-powder-premium-unsweetened?preview_theme_id=187923202261 |
| Zeolite | https://zeotein.com/products/zeolite?preview_theme_id=187923202261 |

## Files for the live paste (10)
Contents: `files/` in this folder (branch `claude/website-audit-conversion-w8z58m`). Whole-file replacement: the live copies of every replaced file are unchanged since Nov 5 (checked Nov 15 04:00 UTC). Exact originals are in `originals/` for rollback.

| # | Live theme path | New/replace | md5 of the file to paste |
|---|---|---|---|
| 1 | `snippets/zt-buybox-tidy.liquid` | **new** | `0524ca06fbc5e8f354a95eb2ca871b7c` |
| 2 | `snippets/zt-desc-cacao.liquid` | **new** | `b4a4a18eea58f2b4ec0c9df98ee670c8` |
| 3 | `snippets/meta-tags.liquid` | replace | `36238a69e92570e2927a714a270c3dfa` |
| 4 | `templates/product.zeotein-cacao-30-day-bag.json` | replace | `2d188453fe8922b3869ce47faecc73af` |
| 5 | `templates/product.cacao-30-day.json` | replace | `0d246dded95177b9d2b987cd68ec52d7` |
| 6 | `templates/product.cacao-7-day.json` | replace | `57104c45e663eed6a8d563eee1a874c0` |
| 7 | `templates/product.vegan-30-day.json` | replace | `32e7b5b913a8afb9c8e6745b5dba9a59` |
| 8 | `templates/product.vegan-7-day.json` | replace | `984a147cfb50b855f058e0c08cf7bfc5` |
| 9 | `templates/product.organic-cacao.json` | replace | `cbb0b8319a4142961c1b0afdefab8f29` |
| 10 | `templates/product.zeolite.json` | replace | `74b95c93654c97f97bf1cd18ebf0a04b` |

Paste order: snippets first (1–3), then templates (4–10), because the templates call the snippets.

**Zeus's "$150" lines:** files 9 and 10 hide that text block and show "Free U.S. shipping on orders $130+" from the snippet instead. If Zeus already edited those two templates, pasting these replaces his edit, but nothing visible regresses. The other 7 single-ingredient templates are not in this package; Zeus's edits there stand.

## What changed, page by page
**All five blend pages (Cacao bag, 30 sticks, 7-Day; Vegan 30 sticks, 7-Day)**
- **Format picker** under the title: photo tiles with price per serving, "Best value" on the bag (Vegan: on 30 sticks). Tiles open the other format's page at the same spot on screen and are pre-loaded. Per serving uses the regular price only, never an intro price.
- **Rating line** read live from Judge.me's verified-buyer average: "★★★★★ 4.9 from verified buyers". It updates itself and shows no small review count.
- **Quick line:**
  - Cacao now leads with collagen: "14g grass-fed collagen peptides. 23g protein. Zero sugar."
  - Vegan keeps "20g plant protein. Zero added sugar. 5 ingredients."
- **Gift line inside Subscribe & Save:** "Free Starter Kit · $62.98 value" (sticks $55.99) and "With your first subscription: shaker, Save-A-Scoop + 3 guides" (sticks: shaker + 3 guides), with small photos of the shaker, Save-A-Scoop and all three guide covers. One-time: "Free with your first bag/order: … 3 digital guides". 7-Day: "Included: the Starter Guide and 2 recipe guides, by email".
- **Renewal line:** "Renews at $X every Y. Skip, pause or cancel anytime."
- **Add to cart:** quantity and button on one row, level. A sticky price + Add to cart bar shows whenever the main button is off screen (full width on phones, floating over the photos on desktop). Shopify's "Shop Promise / Returns accepted" badge is hidden.
- **Trust row:** "30-Day Money-Back Guarantee" (wording unchanged) + "Ships in 1–2 business days".
- **One verified customer quote** under the button:
  - Cacao bag: Elsie U.
  - Cacao 30 sticks and 7-Day: Melissa M.
  - Vegan 30: K.W.
  - Vegan 7-Day: Josh M.
- **Removed** (kept as disabled blocks, so they can be switched back on): the old check-mark lists, the "New to Zeotein? / Try the 7-Day" text links and the per-product review count badge.
- **Layout:** on phones the Rewards button and the second scrolling top bar are hidden on these pages. On desktop the photo column is narrower, so the buy box is wider.

**Cacao bag, 30 sticks, 7-Day: new descriptions** (`snippets/zt-desc-cacao.liquid`, copies in `copy/`)
- They lead with "14g grass-fed collagen peptides and 23g protein".
- Then: why people switch, how to use, what's inside, what comes with your first order, the guarantee (word for word), stay stocked, and the FDA line.
- No zeolite (the "naturally occurring volcanic mineral" wording stays), no "complete protein", no em dashes, only regular prices. The compliance pre-scan shows 0 critical; the only flags are the guarantee wording.
- The description is stored in the theme, not in product data. The products' own descriptions, which Google Shopping uses, are unchanged. Starter Kit funnel products on the same templates keep their own description.

**Cacao powder and zeolite (Google Ads pages)**
- Add to cart directly under the size picker, plus the sticky bar with size and price.
- Rating line instead of "No reviews".
- "Free U.S. shipping on orders $130+" + "Ships in 1–2 business days".
- No guarantee wording (final sale).

**Site-wide:** `meta-tags.liquid` serves the share image (og:image) over https.

## Product gallery change (already live, product data)
Before Orbit's stop instruction, the **Starter Kit image** was added as the 2nd gallery image on Cacao bag, Cacao 30 sticks and Vegan 30 sticks. The old text-only "Try it for 30 days" image was moved to the last position; nothing was deleted. IDs, original order and undo steps: `gallery-change-2026-11-15.json`. No other product data was changed: no price, selling plan, title, handle, description or discount.

## Black Friday theme
The same 10 files go to `187825914069`; `meta-tags.liquid` is already there since Nov 13. Its versions of these templates are identical to live's, so the result matches live after the paste.

## Test results (Nov 15, 04:00–04:40 UTC)
| Check | Result |
|---|---|
| Files on the preview theme `187923202261` and the Black Friday theme `187825914069` | **Pass.** All 10 match the package checksums. Live `187740487893` untouched: bag template still the original, new snippets absent. |
| Server-side render, all 7 listed pages + Starter Kit funnel page, preview and Black Friday | **Pass.** HTTP 200, no Liquid errors. Rating line, format tiles (Cacao 3, Vegan 2), sticky bar, trust row and one subscription widget per page are present; new descriptions show on the three Cacao pages; the funnel page keeps its own description and shows no tiles. |
| Banned words in everything we add (em dash, "complete protein", $76.99, $89.99, $84.99, $93.49, "15%") | **Pass.** None found. "Zeolite" appears only on the zeolite product's own page. |
| Prices | **Pass.** The one-time price shown matches the listed price on all 7 pages in both themes. Subscription plans read from Shopify: Cacao bag $99.99, Cacao 30 sticks $114.99, Vegan 30 sticks $124.99, all three intervals, fixed price, no intro policy. No price, plan, title, handle or discount was edited. |
| Real-browser check, Cacao bag (phone) | **Pass.** Rating "4.9 from verified buyers", the collagen quick line, tiles (all 3 links 200), gift lines with 3 guide covers, renewal line, "30-Day Money-Back Guarantee", review, the new description and the sticky bar are all present, with no banned words. |
| Real-browser checks on the other pages, desktop shots, Add to cart by button | **Not run tonight.** Shopify's bot protection ("Just a moment…") blocked the test browser after the first page. Retried every 4 min for about 30 min, then stopped. Not bypassed. |
| Add to cart (earlier sessions, same code) | Nov 13–14, real browser: bag Subscribe & Save → "1 bag every 30 days" $99.99; one-time → $109.99; the sticky bar adds the same items; cacao powder and zeolite size changes update the bar. Tile click-through bag → sticks → 7-Day → bag passed on Nov 14. |

**Before the live paste, a 3-minute manual check on a phone (the bot block stopped me from doing these):**
1. Vegan 30 preview: the gift line sits inside Subscribe & Save, and Add to cart gives "30 stick packs every 30 days" at $124.99. This template now has its own subscription widget block; before, the app injected it. The server check shows exactly one widget.
2. Vegan 7-Day and Cacao 7-Day: Add to cart gives $44.99 and $39.99.
3. On a Vegan page, tap both format tiles.
