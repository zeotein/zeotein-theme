# For Dana's morning review, Tue 24 Nov 2026

**Hold:** read at 1:05 AM CT. Claude makes no Shopify writes of any kind until Dana reviews. Only reads, add-to-cart tests without orders, and this git branch.

Everything below was read between 12:05 and 1:08 AM CT. Details: `cart-check.md` in this folder.

1. **Which theme is published:** the live theme #188199928021 "Zeotein live theme - edit this one directly" (last saved 1:00 AM CT). The BF draft #187825914069 is unpublished (last saved 1:04 AM CT).
2. **Checkout (cart test 12:06 AM CT, no orders): no stacking.** Each item gets one discount, the best one.
   - Vegan or Cacao 30 sticks: $91.00 / $163.80 / $218.40 / $291.20
   - BF Cacao stick packs: $94.50 / $183.99 / $266.99 / $343.99
   - Cacao bag: $70.00 / $126.00 / $168.00
   - BF bag one-time: $69.99
3. **The 1-cent round-up on the Black Friday price lines.** At 12:15 AM CT, product pages and Shop All showed Black Friday prices 1 cent under checkout wherever 30% doesn't divide evenly: $90.99 against $91.00, $69.99 against $70.00, $27.99 against $28.00. The lines round the 30% discount up to the nearest cent, while Shopify rounds it down for each item. Fix: round down. At 1:07 AM CT no Black Friday price lines showed on product pages or Shop All.
4. **/bf against checkout.** At 12:15 AM CT the page said "60% off", "Renews at $99.99" and one-time "$109.99, now $76.99", while Shopify charges renews $89.99 and one-time $69.99. **At 1:06 AM CT it matches again:** "57% off", "Renews at $89.99", one-time "$99.99, now $69.99".
5. **The Vegan table against checkout (still wrong at 1:06 AM CT).** The Vegan 30 page shows $87.99 / $169.99 / $245.99 / $315.99, against checkout $91.00 / $163.80 / $218.40 / $291.20. So 1 pack shows $3.01 under what checkout charges, and 2 to 4 packs show more than checkout. Its line "Subscription prices stay the same and are not part of the sale" is also false: subscriptions get 30% off the first order, and the 2 and 3-box discounts include subscriptions. Fix once writes are allowed: hide the table, or rebuild it for the 37% and 44% tiers.
6. **Also seen:**
   - The homepage and the Cacao landing page show 4.9.
   - At 1:07 AM CT the homepage has no Black Friday banner text, though storewide 30% is on. At 12:15 AM CT it had "Black Friday 30% off storewide, Shop the sale".
   - 0 Liquid errors on every page checked.
7. **Could write before the review:** the Lenovo task "Test Black Friday carts" (6:15 AM CT, in another conversation) says "Fix anything off". Pause it or change it to report-only, or it may change something first. Claude's own scheduled check (Thu 26 Nov) is read-only.
8. **Correction from 19 Nov:** 30% off $134.99 charges $94.50, not $94.49. The pricing doc edit to $94.49 was wrong, and the fix waits for Dana.
