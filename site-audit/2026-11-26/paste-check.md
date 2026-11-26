# Black Friday mid-sale check: Thu 26 Nov 2026, 2:15 PM CT

Scheduled read-only check.
- Discounts, products and themes were read with GraphQL.
- Add-to-cart tests used zeotein.com/cart/update.js and cart.js. No checkout was started, and each cart was cleared.
- Five pages were fetched.

Nothing was written to Shopify, GoHighLevel or any theme. The 24 Nov 1:05 AM CT write hold was respected: this check only read and ran cart tests.

Nothing new was said in this conversation after the 24 Nov morning review list.

## The three open items from 24 Nov: all fixed

| Item | 24 Nov | Now (26 Nov, 2:15 PM CT) |
|---|---|---|
| /bf copy against checkout | 12:15 AM: "60% off", "Renews at $99.99", one-time "$109.99, now $76.99", while Shopify charged renews $89.99 and one-time $69.99 | **Matches.** "Black Friday 57% off your Starter Kit", "$68.99 first order", "Renews at $89.99", one-time "$76.99". The bag's plan (1 bag $68.99, then $89.99) and price ($76.99, changed 26 Nov 1:22 PM CT) agree |
| Black Friday price lines 1 cent under checkout | $90.99 against $91.00, $11.19 against $11.20, and so on | **Fixed.** Shop All and product pages now round down like Shopify: $15.99 to $11.20, $17.99 to $12.60, $19.99 to $14.00, $21.99 to $15.40, $27.99 to $19.60, $29.99 to $21.00, $34.99 to $24.50, $129.99 to $91.00. $12.00 to $8.40 and $14.00 to $9.80 are exact |
| Vegan Black Friday table | Wrong numbers and a false subscription line | **Removed.** The Vegan 30 page no longer has the table. Its price line shows $129.99 to $91.00, the same as checkout |

## Checkout (cart test, 2:14 PM CT): no stacking

Each line gets one discount, the best one.

| Product | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Vegan 30 sticks ($129.99) | $91.00 | $163.80 | $218.40 | $291.20 |
| Cacao 30 sticks ($129.99) | not tested | $163.80 | not tested | not tested |
| BF Cacao stick packs ($134.99) | $94.50 | $183.99 | $266.99 | $343.99 |
| Cacao bag 30 ($99.99) | $70.00 | $126.00 | $168.00 | not tested |
| Vegan 7-day ($39.99) | not tested | $50.40 | not tested | not tested |
| BF bag, one-time ($76.99) | $76.99 (no discount) | not tested | not tested | not tested |

The discounts applied were:
- storewide 30% for 1;
- "Black Friday: 2 boxes of sticks, save 10% + 30%" (37%) and "3 boxes, save 20% + 30%" (44%), with the same for bags and 7-day packs;
- BF Sticks 1 pack 30% and the fixed 2 to 4-pack amounts on the BF stick packs.

The regular "Bundle savings" 10% and 20% (active since 15 Nov) are also eligible, but Shopify gives only the best one. The totals match the single best discount, taken off each unit and rounded down.

Discount changes since 24 Nov:
- "BFCM Storewide" now also combines with order discounts (25 Nov 2:35 PM CT).
- "BF Subscribe: 30% off first month" now targets named products (the Cacao and Vegan sticks, bone broth, collagen, zeolite, MCT, sea moss, lion's mane) instead of the collection (25 Nov).

## Other pages

- **Homepage:** "Rated 4.9 stars by verified buyers"; banner "Black Friday 30% off storewide, Ends in".
- **Cacao landing page:** "4.9 stars", no 5.0.
- "Liquid error": 0 on all 5 pages.

## Themes changed

- **The published theme is now #188502048981 "Cart tag icon size Nov 24"** (created 24 Nov 11:07 AM CT, last saved 26 Nov 12:03 PM CT). All five pages were served by it.
- "Zeotein live theme - edit this one directly" (#188199928021) is **unpublished** (last saved 25 Nov 9:44 AM CT).
- The old BF draft #187825914069 is renamed "OLD BF draft - DO NOT PUBLISH".
- 12 preview themes were created on 24 Nov, plus "Do not publish - test blends qty Nov 26 (Claude)".

Effect on this repo: the paste kits (`site-audit/2026-11-19/live-paste-all/`, `bf-live-paste/`) and `RELAY-PASTE-ORDER.md` were built for #188199928021, so they no longer describe the published theme.

## Still open (Dana)

1. **1 Dec list** (`site-audit/2026-11-19/bf-live-paste/README.md`):
   - After Mon 30 Nov 11:59 PM CT, the /bf bag keeps selling the $68.99 first order, and $76.99 one-time, until it is taken down.
   - People who subscribe there renew on that product, so check with Seal before setting it to Draft.
   - Removing the /bf redirect stops the email links from reaching it.
   - The Black Friday discounts end by themselves on 30 Nov 11:59 PM CT. "Bundle savings" 10% and 20% have no end date.
2. **Pricing doc correction:** 30% off $134.99 is $94.50, not $94.49 (the 19 Nov edit was wrong). It waits for Dana's go-ahead.
