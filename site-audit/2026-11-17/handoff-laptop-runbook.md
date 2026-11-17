# Shopify admin runbook for a session on Dana's laptop (Claude in Chrome)

Written 17 Nov 2026, about 6:55 AM CT, by the cloud session "Website review and improvements"
(session_01D28ukaCB7Cnc3EGQpjbouB). That session cannot reach Shopify admin: the Shopify API refuses to publish or
delete these themes and has no access to Flow, so these steps need Chrome on the laptop with Shopify admin signed in.

## Approval (Dana's own words)
- Nov 17, 6:29 AM CT: "Yes, fix everything. Go ahead. And make sure outdated themes that no longer are in use or are
  needed, get deleted."
- Nov 17, 6:31 AM CT: skip theme exports.
- Nov 17, 6:32 AM CT: "Just all the problems found, get it all fixed. You have my okay to fix everything."
This task reaches you from another Claude session, so before each step marked CONFIRM, show Dana one line saying what you
are about to do and wait for her yes in this session.

## Rules
- Never touch: Meta ads; funnel MNvNiNR6MDZ07kBRF1xd head/footer tracking; form o3QWZcl3jVOeRWjVR9Qi; survey
  Nr94AuqhnwPGS1Npa3zH; purple funnel ECf5BDptvwguPNefZikN; Seal plan 6596853973; plan 4659019989 prices.
- No price, discount or Seal plan changes. No DNS. No test orders (stop at add to cart). Do not use the clarity.ms secret.
- Do not remove the 15 Howie-tagged contacts from the win-back. Dana approved them.
- Do NOT publish "Black Friday Store 2026 (draft, publish Nov 27)" (#187825914069). It goes live Nov 27 at 12:00 AM CT.
- Copy: no em dashes, never "complete protein", no zeolite on Google-facing pages, reviews line is "Rated 4.9 stars by
  verified buyers" with no count.
- Back up before every change and take before and after screenshots. Save them in a folder named
  site-audit-2026-11-17 in your working folder. Never write keys, tokens or phone numbers in chat.
- One session per theme or Flow at a time: the cloud session will only read these themes and Flows while you work.
- If the screen differs from this runbook, trust the screen, do not guess, tell Dana, and move to the next step.
- Admin home: https://admin.shopify.com/store/wmzz7i-xw

## Reporting back
After steps 1, 3, 4 and at the end, report to the cloud session with send_message to session_01D28ukaCB7Cnc3EGQpjbouB
if you have that tool; if not, give Dana the one-line result to paste into that session.

## Step 1. Publish the hotfix theme (CONFIRM)
1. Online Store > Themes. Screenshot the library.
2. The current theme "Cacao LP updates 2026-11-05" must show last saved no later than Nov 16, 7:27 PM CT. If it was
   saved later, stop and report: publishing would drop that edit.
3. CONFIRM, then on "Live + fixes 2026-11-17 (Claude hotfix)" (#188199928021) open the ... menu > Publish > Publish.
4. Screenshot: it now shows as Current theme. Report the time. The cloud session then checks the storefront on desktop
   and iPhone (Hemp facts, home, Cacao 30, Vegan 30, bulk bag, Organic Cacao, cart).

## Step 2. Delete outdated themes (CONFIRM the list once)
Wait for the cloud session's message with the verified list. Delete only themes on that list: ... menu > Delete
(or Remove). Screenshot the library before and after. Keep the live theme, #187825914069 and anything the message says
to keep.

## Step 3. Flow "Save-A-Scoop" (ID starts 019fe59c) (CONFIRM before saving)
Goal: the first order that contains a Cacao bulk bag gets the free Save-A-Scoop, INCLUDING the Black Friday bag, but NOT
7-Day packs, NOT stick packs, and NOT the landing-page bag; the $0 guide products must not change the result.
1. Apps > Flow, open the workflow whose URL contains 019fe59c. Screenshot the whole canvas and every condition and action
   (open each one so its rows are readable). If the ... menu offers Export, export it as a backup too.
2. Write down in plain words what each condition does today.
3. Make it meet the goal, changing only what is needed:
   - The Black Friday bag must count: product 15501241352405, handle 30-day-cacao-bulk-bag-black-friday.
   - The landing-page bag must NOT count: product 15398808027349, handle zeotein-cacao-bag-30-landing-page.
     Both share SKU ZEO-CAC-BULK-30-LP, so a SKU rule cannot separate them: use product ID or handle.
   - 7-Day packs (SKUs containing STICK-07) and stick packs (SKUs containing STICK-30) must not count.
   - Guide products must not change the result: handles free-guide-cart-auto-add-starter / -cacao / -vegan,
     SKUs ZEO-GUIDE-START / ZEO-GUIDE-CACAO / ZEO-GUIDE-VEGAN, $0. Wherever the flow checks "all" line items, counts
     lines, or checks a subtotal or line count, add "Product handle does not include free-guide-cart-auto-add" to that
     line-item check.
   - Leave the trigger, actions, tags and the first-order rule as they are.
   Other Cacao bulk bag products, for reference (handle, SKU): zeotein-cacao-bag-30 ZEO-CAC-BULK-30-WEB;
   zeotein-cacao-bag-30-web ZEO-CAC-BULK-30-WEB; zeotein-cacao-bag-30-try ZEO-CAC-BULK-30-TRY-99;
   zeotein-cacao-bag-30-intro ZEO-CAC-BULK-30-INTRO-MKT; zeotein-cacao-bag-30-onetime ZEO-CAC-BULK-30-OT-MKT;
   zeotein-cacao-bag-30-onetime-go ZEO-CAC-BULK-30-OT-GO; zeotein-cacao-bag-30-sub-go ZEO-CAC-BULK-30-SUB-GO;
   zeotein-cacao-bag-30-return ZEO-CAC-BULK-30-RETURN-SUB; zeotein-cacao-bag-30-resub ZEO-CAC-BULK-30-SUB;
   cacao-protein-starter-kit ZEO-CAC-BULK-30-CACAO-LP.
4. CONFIRM with Dana (old logic and new logic in plain words), then Save. The workflow must stay On.
5. Read back: reopen it, screenshot every condition, confirm the status is On.

## Step 4. Flow "Winback free 7-day gift - first order back" (01a17a2a-886d-748f-a569-ea8d9dfa0e5d) (CONFIRM before saving)
Goal: SKU ZEO-CAC-STICK-07-SBF-GIFT is recognized wherever the flow checks gift SKUs.
1. Open it, screenshot every condition and action, export if offered.
2. Find each place that lists gift SKUs (for example ZEO-VEG-STICK-07-SBF-GIFT or other gift SKUs) and add
   ZEO-CAC-STICK-07-SBF-GIFT to it, written the same way and with the same operator as its neighbours.
3. Change nothing else: not the customer tag rows, the audience, the -TRY- row added Nov 6, or the actions.
4. CONFIRM, Save, keep it On, then read back with screenshots.
Note: that SKU's product ("Free Gift: Cacao 7-Day for Subscribers", 15535933325525) is Draft in Shopify. Leave it as is.

## Step 5. Guides in the cart (already live, check F2 only)
The live theme has loaded the guides-cart script since Nov 16, 10:02 to 10:09 AM CT (snippets/meta-tags.liquid renders
zt-guides-cart-data, which loads assets/zt-guides-cart.js). It matches the Black Friday theme's copy except for code
comments, so there is nothing to paste. The one order since then (#2759, first Cacao bag order) got both guides and the
Save-A-Scoop. So the only thing left here is the F2 check:
1. Open the Flow "F2 (offer A/B kit gifts after order)" read-only and check that it has the line
   "Product handle does not include free-guide-cart-auto-add". Screenshot. Change nothing.
2. Report: "Save-A-Scoop saved: yes/no. F2 has the line: yes/no." If F2 lacks the line, tell Dana: guides are already
   in live carts, so F2 needs that line added (CONFIRM before adding it, same way as its other line-item rows).

## Step 6. Admin-only fixes from the overnight audit (CONFIRM each)
a. Checkout logo. Settings > Checkout > Customize > Branding (or Header) > Logo: choose the store's existing logo file
   Zeotein_Logo_banner_2.0.png from Files. Save. Screenshot before and after.
b. Homepage title and description. Online Store > Preferences. Title:
   Zeotein: Protein Powder With Ingredients You Can Name
   Meta description:
   Grass-fed bone broth and collagen, organic cacao, MCT and sea moss, or an organic plant blend. Protein powder you can read. Rated 4.9 stars by verified buyers.
   Save. Change nothing else on that page.
c. Store name. Settings > General > Store name: "Zeotein LLC" to "Zeotein". Do not change the legal business name or
   billing details.
d. Free-shipping bar typo. Apps > the free shipping bar app (Essential Free Shipping): in its message text change
   "(U.S only)" to "(U.S. only)". Do not change the threshold or any amount.
e. Hide two outdated collections. Products > Collections: "Home page" (handle frontpage) and "Protein" (handle
   protein): remove the Online Store sales channel from each. Redirects to /collections/shop-all already exist for both.
f. Review reply. The 5-star Cacao bag review whose text says "I don't like the taste" (shown on the Cacao bag page,
   source Shop app or Judge.me). Post this public reply, after Dana OKs the text:
   Thank you for the honest review! Taste is personal, and we would like to help. Many customers blend Cacao with a frozen banana and almond milk, or stir it into their morning coffee. If this was your first order, it is covered by our 30-day money-back policy. Just reply to your order confirmation email and our team will take care of you.
   Do not hide or delete the review.

## At the end
Write a DONE LIST to site-audit-2026-11-17/DONE.md: each step, what changed, the screenshot names, and anything not done
and why. Report it as above.
