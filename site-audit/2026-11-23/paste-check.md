# Black Friday paste check: Mon 23 Nov 2026, 1:18 PM CT

This was the scheduled read-only check before early access (Tue 24 Nov, 12:00 AM CT). Nothing was written to Shopify, GoHighLevel or any theme.

Sources:
- GraphQL `theme.files` on the live theme #188199928021, read 19:18 to 19:22 UTC. The live theme was last saved at 19:04:46 UTC (1:04 PM CT).
- The live pages, fetched at 19:19 UTC.
- Products and discounts, read 19:20 to 19:30 UTC.
- Two add-to-cart checks with no checkout. Each cart was cleared afterwards.

Nothing new was said in this conversation after the 19 Nov 1:40 PM CT paste order. There is no recorded yes from Dana, no word on the purple bar, and no Relay progress report.

## What shoppers see right now

| Page | Result |
|---|---|
| https://zeotein.com/bf | **Black Friday landing page is live.** "Black Friday 57% off your Starter Kit", subscription $68.99 that "Renews at $89.99", one-time $99.99 struck to $69.99. These match the bag's selling plans and price, read 23 Nov. Landing page lock present, no $109.99, no store ticker. 0 Liquid errors |
| https://zeotein.com/ | Hero reads "Rated 4.9 stars by verified buyers". No "5.0" anywhere. 0 Liquid errors |
| https://zeotein.com/products/cacao-protein-starter-kit | **Still "5.0 stars" in the hero and "5.0/5.0 (155 Reviews)" in the buy box.** 0 Liquid errors |
| https://zeotein.com/products/zeotein-vegan-sticks-30 | **The hidden Black Friday table, shown from 12:00 AM, has the wrong prices:** $129.99 regular, then $87.99 / $169.99 / $245.99 / $315.99. With the discounts as they stand, checkout charges more: $91.00 / $173.99 / $251.99 / $323.99. 0 Liquid errors |
| /pages/protein-blends, /pages/the-zeotein-difference | Load, 0 Liquid errors. The Difference page still has its old layout (K1-17 not pasted) |

## Changed since 19 Nov by someone other than this session (read 23 Nov)

- **Prices:**
  - Cacao 30 sticks and Vegan 30 sticks: one-time $134.99 to **$129.99** (updated 23 Nov 12:02 and 14:30 UTC).
  - Vegan has a second Subscribe & Save group at $109.99, beside the $114.99 one.
- **Black Friday bag:**
  - One-time $69.99 (compare at $99.99).
  - Plans: 1 bag $68.99, then $89.99; 2 bags $66.99, then $89.99 (per bag); 3 bags $65.33, then $79.99 (per bag). Updated 23 Nov 15:43 UTC.
- **Black Friday stick packs (Cacao):** still $134.99.
- **Discounts:**
  - "BFCM Storewide: 30% off everything (one-time only)" and "BF Subscribe: 30% off first month" now start **Tue 24 Nov 12:00 AM CT**, no longer Fri 27 Nov (changed 19 Nov 22:00 UTC).
  - The Vegan 1-pack discount (ID 1534097653973) is now "BF Sticks 1 pack 30% (Vegan + BF Cacao)", 30% with a minimum of 1, on Vegan 30 and the BF stick packs.
  - Vegan 30 sticks is now in the BFCM Storewide Sale collection. Both the storewide 30% and "BF Subscribe: 30% off first month" apply to it.
  - "BF Cacao 2 bags" and "3 bags" were ended on 22 Nov. "BF Cacao 4 bags" ($160 off, minimum 4) is still scheduled for 24 Nov.

## Risks for 12:00 AM CT (Dana's decisions; nothing was changed)

1. **Discounts may stack.**
   - Every scheduled Black Friday product discount is set to combine with other product discounts.
   - Shopify's Admin API docs (DiscountCombinesWith) say any number of product discounts can apply to the same line when they combine.
   - Vegan 30 sticks qualifies for three of them at once: storewide 30%, the 1-pack 30%, and the 2, 3 or 4-pack fixed amount. If they stack, 2 packs could fall from $173.99 to under $20.
   - The BF stick packs and the BF bag have the same setting.
   - The safe setting: in Shopify admin > Discounts, open each Black Friday discount and under Combinations uncheck "Product discounts". Shopify then gives each item its single best discount, which is what the theme prices assume.
   - A cart check (add to cart only) is scheduled for 12:05 AM CT to confirm what Shopify charges.
2. **"BF Cacao 4 bags" ($160 off)** was set against the old $109.99 bag price. At today's $69.99 one-time price, 4 bags would cost $119.96 ($29.99 a bag). The 2 and 3-bag discounts were already ended.
3. **The Vegan Black Friday price no longer matches the Cacao stick packs** (Dana, 19 Nov). Vegan 30 is $129.99, so its BF prices are $91.00 / $173.99 / $251.99 / $323.99. The BF Cacao stick packs are still $134.99, at $94.50 / $183.99 / $266.99 / $343.99.

## Correction to 19 Nov

Shopify takes 30% off each item and rounds the discount down. The cart check on 23 Nov showed $134.99 at 30% off = **$94.50**, with 2 packs at $40.49 off each.

So these 19 Nov statements were wrong:
- the Master Pricing doc edit ($94.50 to $94.49);
- the kit notes that the 1-pack is $94.49.

The theme files that compute 30% with `round` (kit 1 step 18, kit 2 D1 and the BF subscribe script) can show 1 cent less than checkout. The rebuilt Vegan file below rounds down, as Shopify does.

## Paste status against site-audit/2026-11-19/RELAY-PASTE-ORDER.md

"Saved" means the live file equals the kit file. A file with the same text but different line endings or a missing final newline also counts, and so does JSON with the same content. "Newer on live" means live has the kit file plus later edits, or a different version. Pasting the kit file would undo those edits.

| Steps | Status |
|---|---|
| K1-2, K1-3, K1-4 (line endings only), K1-6, K1-9 to K1-16 | Saved |
| K1-0 and K1-7b (`templates/page.zt-chooser-blends.json`) | Newer on live: the 7b file plus 10 lines (22 Nov 04:46 UTC) |
| K1-1, K1-5, K1-7, K1-8 | Newer on live (20 to 23 Nov) |
| K1-17 | Not yet. The old Difference template was re-saved unchanged on 23 Nov 14:22 UTC, losing only its final newline. **Still valid to paste** |
| K1-18 | Not yet (Dana's yes). **Superseded by R3 below:** K1-18's 1-pack price is now wrong |
| K2-BF2, BF3, BF5, BF12 (same JSON) | Saved |
| K2-BF1, BF4, BF6 to BF11, BF13, BF14, BF18, BF19, BF21, BF22 | Newer on live (21 to 23 Nov). BF6 adds 292 lines and BF14 is a reworked template |
| K2-BF15, BF16 | Newer on live, but both still round the score up. **Superseded by R1 and R2 below** |
| K2-BF17 | Not yet. Live is unchanged, so **the kit file is still valid** |
| K2-BF20, BF23 | Not yet. Live unchanged |
| K2-D1 | Not yet. **Out of date:** it starts storewide prices on 27 Nov and uses the old Vegan 1-pack amount |
| K2-H1, H3 | Not on live (on hold, correct) |
| K2-H2 (`snippets/cart-drawer.liquid`) | **Changed on live 23 Nov 18:13 UTC, not by the kit** (+50 / -46 lines). The kit's H2 is on hold |

The banner on live is still the purple "Black Friday ends in" / "Shop blend deals" bar, from 24 Nov 12:00 AM to 30 Nov 11:59 PM CT. Because storewide now starts on 24 Nov, kit 2 BF20 to BF23 and D1 (built for a 27 Nov storewide start) should not be pasted as they are.

## Files in this folder

- `live-now/`: exact copies of the 25 live files that differ from the kits, read 23 Nov 19:20 UTC. Each copy matches Shopify's checksum.
- `rebuilt/`: three files built on top of today's live versions, each with the smallest change:

| ID | Live file | Built from (live md5) | Change | Before check | After |
|---|---|---|---|---|---|
| R1 | snippets/cacao-lp-review-score.liquid | e383c869 (69 lines, Windows line endings) | Line 37: `round` to `floor` | 69 lines; line 37 ends with `round` | 69 lines; line 37 ends with `floor` |
| R2 | sections/buy-box-cacao-lp-v2.liquid | 5a578cd8 (994 lines) | Line 268: `round` to `floor` | 994 lines; line 268 ends with `round` | 994 lines; line 268 ends with `floor` |
| R3 | snippets/zt-bf-blend-price.liquid | a99c6fc3 (71 lines) | Vegan table follows the live price and today's discounts (30% per pack, rounded down, or the 2 to 4-pack fixed amounts if bigger). "Up to 36%" is now computed (37% at $129.99). The false line "Subscription prices stay the same and are not part of the sale." is removed | 71 lines; line 34 is the old `vegan_off` line with 4200,8999,14398,20397 | 82 lines; md5 5da5b8a475698aabecc429ceef59d2b3 |

R1 md5 9ea4d3fdc2ee8dd059834e9e6308b58b. R2 md5 4874bca313a2f288d37d948cf05fbb1f. If a paste turns Windows line endings into plain ones, that's fine.

R3 was rendered locally with python-liquid 1.12.1:
- at $129.99: $91.00 / $173.99 / $251.99 / $323.99, "up to 37%";
- at $134.99: $94.50 / $183.99 / $266.99 / $343.99;
- any other product: nothing.

With R1, R2 and kit 2 BF17, the Cacao landing page shows 4.9 (Judge.me average 4.95).
