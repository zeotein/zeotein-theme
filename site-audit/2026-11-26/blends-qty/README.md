# Protein Blends: card prices follow "How many?" (26 Nov 2026)

Dana, 26 Nov, 2:39 PM CT, with a phone screenshot: "when someone picks like 2 or 3 bags on the protein plunge page, the price in the subscription or one-time box should also change with it."

## What changes

On https://zeotein.com/pages/protein-blends, picking 2 or 3 in "How many?" now also changes the price inside the 30-Day Bulk Bag and 30-Day Stick Packs cards:
- The big price becomes the price per bag or box at that quantity, for example **$56.70/bag**.
- A small line under it shows the total, for example **$113.40 total**.
- The struck-through regular price stays the regular price for one bag or box.
- Picking 1 puts the original prices back.
- The 7-Day cards don't change, because they are always quantity 1.

The numbers come from the picker's own math: tiers 0/10/20%, or 30/37/44% during Black Friday, taken off each unit and rounded down. So the cards always agree with the picker and with the Add to cart total.

| Picked | Bulk Bag, Subscribe | Bulk Bag, One-Time | 30-Day Sticks, Subscribe | 30-Day Sticks, One-Time |
|---|---|---|---|---|
| 1 | $63.00 (was $89.99) | $70.00 (was $99.99) | $77.00 (was $109.99) | $91.00 (was $129.99) |
| 2 | $56.70/bag, $113.40 total | $63.00/bag, $126.00 total | $69.30/box, $138.60 total | $81.90/box, $163.80 total |
| 3 | $50.40/bag, $151.20 total | $56.00/bag, $168.00 total | $61.60/box, $184.80 total | $72.80/box, $218.40 total |

These are Black Friday prices (26 Nov). After the sale the same code shows the everyday tiers: $80.99/bag for 2 bags on Subscribe, and so on.

## The file

There is one file, `sections/zt-blend-chooser.liquid`, built on the published theme's current copy. That copy was read 26 Nov at 2:30 PM CT, md5 692efc7f, last saved there 12:03 PM CT. Its exact copy is in `live-before/`.

Three changes:
1. In the picker's script, after it updates the tiers and the button, it now also updates each Bulk Bag and 30-Day Sticks card.
2. Three style rules were added, for the small "/bag" and the total line.
3. Nothing else in the file changed: no Liquid logic, settings, gifts or cart behaviour.

| | Lines | md5 | Check |
|---|---|---|---|
| Live now (BEFORE) | 780 | 692efc7f3b8b19c947cd74a30308f386 | Line 710 starts `<script>(function () { var root = document.getElementById('{{ uid }}'); if (!root) return; var box = root.querySelector('[data-zt-qty]');` and the file has no `paintCards` |
| After the paste | 783 | 5ebd9a21d20a07c67aebf5d410d08147 (62d5ad9c if the editor drops the final newline) | Line 713 contains `paintCards` |

## Tested

The test used Playwright (Chromium) on an exact copy of the live page HTML, saved 26 Nov 2:30 PM CT, with only the changed script and styles swapped in. Phone size was 390 x 844.

- Subscribe and One-Time were each clicked at 1, 2 and 3. Every card price, total and the Add to cart total matched the table above. After picking 1, the original prices were back.
- No new page errors. The 2 errors seen are Shopify's own shop-js modules failing to load offline, and they were the same before the change.
- One-time totals match Shopify's cart today: 2 bags $126.00, 3 bags $168.00, 2 boxes $163.80, 3 boxes $218.40. These came from add-to-cart only, no checkout, at 2:14 PM CT.
- Subscription totals could not be checked in a cart. Shopify's bot check started answering 429 to the test carts. These are the prices the picker already shows on the live site.
- Screenshots: `screens-before-sub-2bags-mobile.png` and `screens-after-sub-2bags-mobile.png`. They were taken offline without the store's stylesheet, so the fonts and the product photo differ from the real page.

## How to put it live

Claude can't write to the published theme, and Dana's team placed a hold on Claude's Shopify writes on 24 Nov. So Dana or Relay does the paste, one file:

1. Shopify admin > Online Store > Themes. On the current theme, "Cart tag icon size Nov 24", choose ... > Edit code.
2. Open `sections/zt-blend-chooser.liquid`. Check the BEFORE row above: 780 lines, line 710 as quoted, no `paintCards`. If it doesn't match, the file changed after 12:03 PM CT today. Stop and ask Claude to rebuild on top of the new version.
3. Back it up: click in the code, press Ctrl+A and Ctrl+C, and save the text as a file.
4. Open the raw link for `site-audit/2026-11-26/blends-qty/sections/zt-blend-chooser.liquid` (pinned commit in the chat message). Copy all, paste over everything in the editor, and Save.
5. Check: 783 lines, and line 713 contains `paintCards`.
6. Test on a phone at https://zeotein.com/pages/protein-blends. Pick 2 bags: the Bulk Bag card shows $56.70/bag and $113.40 total (Subscribe), or $63.00/bag and $126.00 total (One-Time). Pick 1: it shows $63.00 or $70.00 again.

**Undo:** paste the backup from step 3, or the file in `live-before/`.

## Status 27 Nov: ON HOLD, not pasted (read-only live check)

The live chooser was changed separately on 26 Nov at 3:30 PM CT: published theme #188502048981, `sections/zt-blend-chooser.liquid`, now md5 a76fafc0, 61,722 bytes. It is neither this kit's file nor the 692efc7f it was built on.

Checked on zeotein.com/pages/protein-blends with Playwright, desktop 1366 px and iPhone 13, picking 2 and then 3:

| Picked | Bulk Bag, Subscribe | Bulk Bag, One-Time | 30-Day Sticks, Subscribe | 30-Day Sticks, One-Time |
|---|---|---|---|---|
| 2 | ~~$179.98~~ $113.40 | ~~$199.98~~ $126.00 | ~~$219.98~~ $138.60 | ~~$259.98~~ $163.80 |
| 3 | ~~$269.97~~ $151.20 | ~~$299.97~~ $168.00 | ~~$329.97~~ $184.80 | ~~$389.97~~ $218.40 |

The buttons above read "Buy 1 / Buy 2 / Buy 3" with "$56.70 each" and "$113.40 total" (Subscribe, 2). Desktop and mobile showed the same.

So the cards follow the quantity, but they show the **total** with the regular total struck through. They do not show this kit's **per bag or box plus total** ("$56.70/bag" and "$113.40 total"). The answer to "is the 2/3 per-bag display live?" is **no, on both devices**.

This kit stays on hold. Its BEFORE check (692efc7f, 780 lines) no longer matches live, so **do not paste it as is**. If the per-bag format is still wanted, it has to be rebuilt on top of a76fafc0. Screenshots: `live-27nov-mobile-bagcard-sub-2.png` and `live-27nov-desktop-bagcard-sub-2.png`.
