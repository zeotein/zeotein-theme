# Black Friday cart check: Tue 24 Nov 2026, 12:05 AM CT

Scheduled check, run 06:05 to 06:20 UTC.

Method:
- Add to cart only, through zeotein.com/cart/update.js and cart.js. No checkout was started.
- Each cart was cleared afterwards.
- Discounts and prices were re-read with read-only GraphQL first.

Nothing was written to Shopify, GoHighLevel or any theme.

## Result: no stacking

Every cart line got exactly one discount, the best one. All Black Friday discounts are still set to combine with other product discounts, but Shopify applied only one per item.

Discount changes since the 23 Nov 1:18 PM CT check:
- **Ended:** "BF Cacao 4 bags" and "BF Vegan Sticks 2, 3 and 4 packs" (23 Nov, 2:50 PM and 6:34 PM CT).
- **New:**
  - "2 boxes of sticks, save 10% + 30%" (37%) and "3 boxes of sticks, save 20% + 30%" (44%), for Cacao and Vegan 30 sticks, one-time and subscription.
  - The same for bags (zeotein-cacao-bag-30).
  - 7-day packs: 37% for 2, 40.5% for 3, 44% for 4, one-time only.
- **Changed:** "BF Subscribe: 30% off first month" now combines with product discounts.

| Product (price) | 1 | 2 | 3 | 4 | Discount applied |
|---|---|---|---|---|---|
| Vegan 30 sticks ($129.99) | $91.00 | $163.80 | $218.40 | $291.20 | 1: storewide 30%. 2: 37%. 3 and 4: 44% |
| Cacao 30 sticks ($129.99) | $91.00 | $163.80 | $218.40 | not tested | same as Vegan |
| BF Cacao stick packs ($134.99) | $94.50 | $183.99 | $266.99 | $343.99 | 1: BF Sticks 1 pack 30%. 2 to 4: fixed $85.99 / $137.98 / $195.97 |
| Cacao bag 30 ($99.99) | $70.00 | $126.00 | $168.00 | not tested | 30%, 37%, 44% |
| Vegan 7-day ($39.99) | $28.00 | $50.40 | $71.40 | $89.60 | 30%, 37%, 40.5%, 44% |
| BF bag one-time ($69.99) | $69.99 | not tested | not tested | $279.96 | none (no one-time Black Friday discount on this product now) |

Every total equals the single best discount with Shopify's rounding, which takes the percentage off each unit and rounds down.

## What the pages show against what checkout charges

| Page | Page says | Checkout charges | Issue |
|---|---|---|---|
| https://zeotein.com/bf (BF email link) | "Black Friday 60% off", "$68.99 your first order", "Renews at $99.99" (3 places), one-time "1 bag $109.99 $76.99 Save 30%" | Subscription $68.99, renews at **$89.99** (plan read 24 Nov). One-time **$69.99** (product price, no discount) | Page renewal and one-time prices don't match Shopify. At 1:18 PM CT on 23 Nov the page said "57% off" and "Renews at $89.99", which matched. The /bf files were changed at 01:37 to 01:40 UTC (7:37 to 7:40 PM CT) |
| Product pages and Shop All cards, Black Friday price lines | $129.99 to $90.99, $99.99 to $69.99, $39.99 to $27.99, $15.99 to $11.19, $17.99 to $12.59, $19.99 to $13.99, $21.99 to $15.39, $27.99 to $19.59 | $91.00, $70.00, $28.00, $11.20, $12.60, $14.00, $15.40, $19.60 | **1 cent less than checkout** wherever 30% doesn't come out even. The lines round 30% to the nearest cent, but Shopify rounds the discount down per unit. $12.00 and $14.00 items are right |
| https://zeotein.com/products/zeotein-vegan-sticks-30 table | $90.99 / $173.99 / $251.99 / $323.99, and "Subscription prices stay the same and are not part of the sale." | $91.00 / $163.80 / $218.40 / $291.20. Subscriptions get "BF Subscribe: 30% off first month", and the 2 and 3-box discounts include subscriptions | Table is 1 cent low for 1 pack and too high for 2 to 4 packs, and the subscription line is wrong. R3 (23 Nov) is now out of date too, because it was built for the fixed 2 to 4-pack amounts |
| https://zeotein.com/products/cacao-protein-starter-kit | "4.9 stars", "4.9/5.0 (155 Reviews)" | n/a | Fixed overnight (no 5.0) |
| https://zeotein.com/ | "4.9 from 155 reviews"; banner "Black Friday 30% off storewide", "Shop the sale" | n/a | OK |

"Liquid error": 0 on all 8 pages fetched.

## Other observations

- The live theme #188199928021 is still the published theme. It was saved at 06:07 and 07:00 UTC, so it was being edited after midnight. The BF theme #187825914069 (unpublished) was saved at 07:02 UTC.
- These files on live were saved overnight, by someone other than this session:
  - `sections/hero-banner-cacao-lp-bf.liquid`, `templates/product.cacao-lp-bf.json`, `snippets/zt-bf-bb-panel.liquid` (the /bf page, 01:37 to 01:40 UTC);
  - `sections/hero-banner-cacao-lp.liquid`, `sections/buy-box-cacao-lp-v2.liquid`, `snippets/cacao-lp-review-score.liquid` (4.9);
  - `templates/index.json`, `templates/page.the-zeotein-difference.json` (03:07 UTC), `templates/page.zt-chooser-blends.json`;
  - `snippets/zt-buybox-tidy.liquid`, `snippets/cart-drawer.liquid`, `snippets/zt-bundle-qty.liquid`, `sections/main-cart-footer.liquid`, `sections/zt-jdgm-reviews-tidy.liquid`, `sections/zt-pdp-reviews.liquid`, `sections/zt-gc-top-banner.liquid`;
  - three JS assets.
- The Black Friday price lines and the Vegan table are not drawn by `snippets/zt-bf-blend-price.liquid`, which is unchanged (a99c6fc3). The file that draws them could not be found with the read-only file listing.
