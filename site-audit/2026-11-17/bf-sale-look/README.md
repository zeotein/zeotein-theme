# Black Friday sale look (theme 187825914069, unpublished)

Nov 17 2026, per Dana: remove the small black "BLACK FRIDAY" tag from product cards and show a real sale price
(regular price struck through, Black Friday price next to it). Display only: no product price, compare-at price,
discount, Seal plan or app setting was changed.

Theme commit (Shopify version): aaa2e4bc254dc5201456f14ec49c6d48c67f908c

| File | Change |
|---|---|
| snippets/card-product.liquid | card now renders `zt-bf-blend-price` mode `price` instead of mode `card` (black tag gone) |
| snippets/zt-bf-blend-price.liquid | new mode `price` (cards) and `price` + `pdp: true` (product page, follows variant changes) |
| sections/main-product.liquid | renders the BF price right under the product price block |
| sections/zt-bf-countdown-sitewide.liquid | styles for the new price line; hides the theme price while the BF price shows |

`before/` = exact copies of the theme files before this change (MD5 matched against the theme). `after/` = what was committed.
Restore: paste a `before/` file back into theme 187825914069 via the code editor.

Math: same as the real scheduled discounts. 30% off the regular price, rounded to the cent, for the products in
collection `bfcm-storewide-sale` (one-time only, Nov 27 12:00 AM to Nov 30 11:59 PM CT). Vegan 30 sticks uses the
"BF Vegan Sticks 1 pack" fixed $42.00 off (Nov 24 to Nov 30). Gift cards and anything not covered keep the normal price.
The line is hidden outside the sale window and always shows on the unpublished theme preview.

| Product | Regular | Black Friday |
|---|---|---|
| Cacao Bulk Bag (zeotein-cacao-bag-30) | $109.99 | $76.99 |
| Cacao 30 sticks (zeotein-cacao-sticks-30) | $134.99 | $94.49 |
| Vegan 30 sticks (zeotein-vegan-sticks-30) | $139.99 | $97.99 |
