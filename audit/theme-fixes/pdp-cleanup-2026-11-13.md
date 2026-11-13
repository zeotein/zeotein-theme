# Product page buy box cleanup, November 13, 2026

> **Superseded by v2** (same day, after Dana's review): `pdp-v2-2026-11-13/README.md`. v2 moves the format picker to the top, adds gift photos, an always-visible Add to cart bar and the store rating line, and covers the cacao powder and zeolite pages too. The v1 files below are kept for reference only. Don't paste them.

Dana's request: the Cacao product page says too much under the price. Put the first-order gifts in the subscription option instead of a list of check marks, and make it cleaner.

Built in the unpublished theme **Live + script error fixes (Nov 10)** (ID `187923202261`), so the live store is unchanged until that theme is published. Screenshots: `pdp-cleanup/`.

## What changed (Cacao bulk bag, 30 stick packs, 7-Day)

| Before | After |
|---|---|
| Two check-mark lists under the button (6 lines: flavor, guarantee, shipping, scoop, shaker, guides) | Gone. The gifts now sit inside each purchase option, and guarantee + shipping are one two-column row |
| Seal's line "Your rate: $99.99 every month, first order and every order after, for as long as you stay subscribed. Cancel, pause or skip anytime." | "Renews at $99.99 every month until you cancel. Skip, pause or cancel anytime." (same terms, shorter; follows the interval picked) |
| No gift info in the options | Subscribe & Save: "Free with your first order: shaker, Save-A-Scoop and 3 digital guides". One-time: "Free with your first bag: Save-A-Scoop and 3 digital guides" (sticks: shaker and 3 guides / 3 guides; 7-Day: the guides) |
| "Want single-serve convenience? …" and "New to Zeotein? …" text links | A three-card "Choose your format" row: Bulk bag, 30 stick packs, 7-Day pack, with the current one highlighted |
| Quantity under the Add to cart button | Quantity above the button |
| Rewards launcher covered the purchase options on phones | Hidden on these product pages on phones (still on every other page, and on desktop) |
| Zoom button sat on top of the first image's top-left corner (covering the "30 servings" badge and the "Try it for 30 days" headline) | Moved to the top-right corner |

The old blocks are kept in the templates as disabled blocks, so any of them can be switched back on in the theme editor.

## Files

- `snippets/zt-buybox-tidy.liquid` (new): gift lines, trust row, format row, and the small script that places the gift lines inside Seal's options. If Seal's widget isn't found, the gift lines show as a plain row under it instead.
- `templates/product.zeotein-cacao-30-day-bag.json`, `templates/product.cacao-30-day.json`, `templates/product.cacao-7-day.json`: three custom-liquid blocks added, four or five old blocks disabled, quantity moved above the button.

No product data, prices, Seal plans or discounts were changed.

## Checked

- Phone (390 px) and desktop renders of all three pages; no new console errors.
- Gift lines appear inside both options and the renewal sentence is shortened (bag and 30 sticks); the 7-Day shows the plain gift row.
- Add to cart on the preview: a 6-week subscription adds with the right plan ("1 bag every 6 weeks", $99.99), and the renewal line and gift lines update when the interval changes. Still to confirm: the default monthly add and a one-time add. Shopify's bot check kept interrupting the test browser on Nov 13.

## How it goes live

Don't publish the preview theme: the live theme has changed since that copy was made. After Dana's yes:

1. Live theme (needs someone with live access, e.g. Orbit): Online Store → Themes → live theme → Edit code. Add `snippets/zt-buybox-tidy.liquid`, then replace the three templates with the versions in `pdp-cleanup/files/`. The live templates haven't changed since Nov 5, so whole-file replacement is safe.
2. Black Friday theme (unpublished, so Claude can write it): the same four files. Its three templates are identical to live's.

Preview: https://zeotein.com/products/zeotein-cacao-bag-30?preview_theme_id=187923202261
