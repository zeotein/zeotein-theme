# Live paste kit: FAQ, gifts and Difference page (19 Nov 2026)

> **HOLD (19 Nov 2026, 1:40 PM CT): do not run the Chrome prompt in this README.** Relay is the only one pasting into the live theme, one file at a time with a test after each, in the order in `site-audit/2026-11-19/RELAY-PASTE-ORDER.md` (after Relay's current queue). Nobody pastes into the BF theme #187825914069. Step 18 waits for Dana's own yes.

This folder has 20 files. They bring the finished FAQ, gift and Difference page work onto zeotein.com, plus the Vegan Black Friday price display (step 18, needed before Tue 24 Nov).
Since 19 Nov, Dana's rule is that edits go straight into the live theme, **"Zeotein live theme - edit this one directly"**,
in Shopify's code editor, one file at a time, and no theme is ever published.
Claude's Shopify connection can't write to the live theme, so a person or Dana's Claude in Chrome session does the pasting.

- **Steps 1 to 17:** exact copies of the finished work in the theme "Do not publish - source: FAQ, gifts, Difference" (#188281815253).
- **Step 0:** the approved Protein Blends template, copied from `site-audit/2026-11-19/live-paste/`.

12 files are new on live. The rest replace an existing live file; one of them, the Protein Blends template, is replaced twice, at step 0 and again at step 7b. Paste them in the order below and check the page after each group.

Updated 19 Nov, about 9:15 AM CT, by the parent session:
- **Step 7b added:** it re-pastes the Protein Blends template with `"faq_set": "none"`, so the page keeps one FAQ once the new picker is in (open point 1).
- **Step 18 added:** the Vegan Black Friday prices now match Cacao. Dana decided this at 8:00 AM CT on 19 Nov, and the Shopify discounts were already changed.

Built 19 Nov 2026, 14:35 UTC (8:35 AM CT), using only read-only Shopify GraphQL calls. Nothing was changed in Shopify or GoHighLevel.

## Paste order

| Step | File | New or replace | What it does | md5 |
|---|---|---|---|---|
| 0 | templates/page.zt-chooser-blends.json | Replace | Adds five sections under the product picker on the Protein Blends page | 60c3a56edc803efbca1502795ceaca81 |
| **Group 1: FAQ** | | | | |
| 1 | snippets/zt-faq-content.liquid | New | Holds the 12 standard FAQ questions and answers | fa60d95e43c114393ca13593e884869b |
| 2 | assets/zt-faq.css | New | Styles the FAQ | 5b2f3824871ea870e42e77ead2b40f93 |
| 3 | blocks/faq.liquid | Replace | Homepage and FAQs page show the 12 standard questions | b7977ca7d824afdfaa9f8a81236c9d7e |
| 4 | sections/zt-pdp-faq.liquid | Replace | Product pages show the standard questions for that product | bca01c016270d2202f70d6f70b239fff |
| **Group 2: gifts in the product picker** | | | | |
| 5 | snippets/zt-ch-perk.liquid | New | Gift line inside the chosen size card | 5fd98db771b6496629c010cff973c03c |
| 6 | snippets/zt-ch-kit.liquid | New | "Your FREE Starter Kit" card that lists each gift | d163bc8e040860bfd4fb699dd9560ddd |
| 7 | sections/zt-blend-chooser.liquid | Replace | Product picker with gift badges, gift card, new button text, guarantee line and FAQ | dfa070ef051a7dca5534ec2ed2668a42 |
| 7b | templates/page.zt-chooser-blends.json (kit file: templates/page.zt-chooser-blends.after-group2.json) | Replace again | Same as step 0, plus `"faq_set": "none"`. Without it, Protein Blends shows the FAQ twice after step 7 | f1a8f5733092d2163385d48d9b2cc086 |
| **Group 3: homepage gift badges** | | | | |
| 8 | blocks/zt-home-choose.liquid | Replace | Gift badges and "Up to $X in free gifts" on the homepage Cacao and Vegan cards | 92ac280dec7c3e758b440a31f624d7c2 |
| **Group 4: Difference page** | | | | |
| 9 | assets/zt-diff.css | New | Styles the Difference page | e249a266968f23cb0e7316c1cd092eb8 |
| 10 | snippets/zt-diff-head.liquid | New | Loads the Difference page fonts and styles | 428c11b586e8b666ca571f54b476f837 |
| 11 | sections/zt-diff-hero.liquid | New | Top banner "Intentional by design." with four stats | a70355156945ba175f014d48aced7a97 |
| 12 | sections/zt-diff-choices.liquid | New | "Six choices" cards | 4be024656f2569896a582f2eb7c65cbe |
| 13 | sections/zt-diff-blends.liquid | New | Cacao and Vegan "What's inside" cards | 1138497d5ecc5f1d95b1328db4d71148 |
| 14 | sections/zt-diff-taste.liquid | New | "Does it taste like bone broth?" panel | d5a19051ed222da5252bee084c097c84 |
| 15 | sections/zt-diff-flex.liquid | New | Delivery options and skip or pause panel | cb5c153a213af38feaf84d1a35dafefd |
| 16 | sections/zt-diff-close.liquid | New | Closing band with the "Find Your Zeotein" button | 152d2b12645327a38ae5f9ab4d29f8ec |
| 17 | templates/page.the-zeotein-difference.json | Replace | Switches the Difference page to the new sections (paste LAST) | 76ead86fd6456af3efa32dd582e4b763 |
| **Group 5: Vegan Black Friday prices (before Tue 24 Nov, 12:00 AM CT)** | | | | |
| 18 | snippets/zt-bf-blend-price.liquid | Replace | Changes one line: the Vegan 30 Black Friday price lines show $94.49, $183.99, $266.99 and $343.99, matching Cacao and the changed Shopify discounts. **Skip it if the live file already has 238 lines:** that is step D1 of the Black Friday kit (`site-audit/2026-11-19/bf-live-paste/`), which has the same amounts and more | 7009330d7158f47abec4f746693f039b |

Each group only uses files from its own group or an earlier one. Step 17 must come after steps 11 to 16, because Shopify refuses to save a template that names a section file that doesn't exist yet.

### Checks per file

These checks come from the live theme and the source theme on 19 Nov at 14:35 UTC.

- **Lines:** what the code editor should show after pasting. Its last line number is this number, or this number plus 1.
- **md5 if the last newline is dropped:** on 19 Nov the code editor dropped the final newline from `_blocks.liquid`, `section.liquid` and `util-palette-hover-shift.liquid`. If live shows this md5 after a paste, the paste is still exact.

| Step | Lines | Bytes | md5 in source theme | md5 on live now | md5 if the last newline is dropped |
|---|---|---|---|---|---|
| 0 | 320 | 12616 | f1a8f5733092d2163385d48d9b2cc086 (differs, see note 1) | b970b6aee5ee5ca75834f975f2651c8b | c914109846f20cf7ad92513eb7ed05a1 |
| 1 | 40 | 5960 | fa60d95e43c114393ca13593e884869b | new | 9e66a9b64350e0a109c13286696b37e1 |
| 2 | 41 | 3546 | 5b2f3824871ea870e42e77ead2b40f93 | new | 1f694ae49d10b658ad8c3315de45f467 |
| 3 | 46 | 2340 | b7977ca7d824afdfaa9f8a81236c9d7e | 187b08391792c722c8da833e11da0e46 | 9fe69097cd5725b54d270143e27b8681 |
| 4 | 93 | 4896 | bca01c016270d2202f70d6f70b239fff | 2c905226490c067c1aa252d474f9e229 | d1c43b0239129c71399e09d2d09486ad |
| 5 | 55 | 3123 | 5fd98db771b6496629c010cff973c03c | new | 46db7623a09d3fb606c488d995e2753f |
| 6 | 41 | 3656 | d163bc8e040860bfd4fb699dd9560ddd | new | 3576735515d3bc21a1d607ac231a4b7f |
| 7 | 527 | 35813 | dfa070ef051a7dca5534ec2ed2668a42 | 82fa34e68ca31ba1d1444f5a8f832de4 | 53ffc29dad138772187f11beb2e76f86 |
| 7b | 321 | 12643 | f1a8f5733092d2163385d48d9b2cc086 (the 18 Nov merge file) | b970b6aee5ee5ca75834f975f2651c8b, or step 0's file once pasted | 46f712e0f5299881a13490c69d9fc2bf |
| 8 | 176 | 13484 | 92ac280dec7c3e758b440a31f624d7c2 | 58737eb25abfcb9c2674a5b3ed8b8cee | a5506567d17b85236cbe6e6c58523c6d |
| 9 | 121 | 9402 | e249a266968f23cb0e7316c1cd092eb8 | new | 10351dbaf4b888f1550b3482649ce2aa |
| 10 | 5 | 468 | 428c11b586e8b666ca571f54b476f837 | new | b4dcc2d9db589fe1aa0af23a8ac283a5 |
| 11 | 59 | 3323 | a70355156945ba175f014d48aced7a97 | new | 8cee1572d919c5d35d16c13889f624e5 |
| 12 | 39 | 1830 | 4be024656f2569896a582f2eb7c65cbe | new | 3a7561f1b8d489448f0c9499eb64e18a |
| 13 | 64 | 3490 | 1138497d5ecc5f1d95b1328db4d71148 | new | c939d21974eaf594c668afbd6ae944bd |
| 14 | 35 | 1634 | d5a19051ed222da5252bee084c097c84 | new | 3351351f3ee73738e05c07e17da112f8 |
| 15 | 46 | 2640 | cb5c153a213af38feaf84d1a35dafefd | new | 2bbbdc8c14528165ba1d8e4f7679c759 |
| 16 | 24 | 1344 | 152d2b12645327a38ae5f9ab4d29f8ec | new | 398f62866e329e4274aecd29a48d4bdf |
| 17 | 93 | 5829 | 76ead86fd6456af3efa32dd582e4b763 | 172ddfb810f0d1d0c67a5ebf04c4e738 | 5bb86c52dd3563c5acd82267e4d1331f |
| 18 | 71 | 3359 | 7009330d7158f47abec4f746693f039b (live file a99c6fc3 with one line changed) | a99c6fc3d942b7b482f3636cf96f8abe | 7009330d (the file has no final newline) |

**How the files were read.** Each file in steps 1 to 17 was read from the source theme with a read-only GraphQL query. All 17 bodies were text, and each saved file matches Shopify's own md5 and byte size for that file.

**Step 17 has no comment header.** For `templates/page.the-zeotein-difference.json`, the API puts Shopify's 9-line "IMPORTANT: The contents of this file are auto-generated" comment (363 bytes) in front of the body. The stored file has no such comment, and Shopify's md5 is for the file without it, so the kit file has none either. If the code editor shows or adds that comment, that's fine.

**The six live files replaced here were last saved on 17 Nov** (02:34 to 03:10 UTC), so none is newer than its kit version. Three already have byte-identical backups in this repo:

| Live file | Backup in this repo |
|---|---|
| blocks/faq.liquid | `site-audit/2026-11-17/backups/deleted-themes-2026-11-17/187740487893-full-copy-2026-11-14/blocks/faq.liquid` |
| sections/zt-pdp-faq.liquid | `.../187740487893-full-copy-2026-11-14/sections/zt-pdp-faq.liquid` |
| templates/page.zt-chooser-blends.json | `site-audit/2026-11-17/backups/live-188199928021/templates__page.zt-chooser-blends.json.before-blends-sections` |

The other three (`zt-blend-chooser.liquid`, `zt-home-choose.liquid`, `page.the-zeotein-difference.json`) only get the backup taken during the paste.

## Copy-rule scan

All 18 files were searched, code included. The searches covered:
- em dashes (the character itself, `&mdash;`, `&#8212;` and its backslash-u escape)
- "complete protein"
- "zeolite"
- "5.0" and five-star wording
- "tub" or "tubs"

Each hit was then sorted as customer-visible or not.

| Rule | Result |
|---|---|
| Em dashes | **None.** No file was edited, so every md5 above is the file exactly as read. The only mention is a code comment in `zt-faq-content.liquid` line 9: "Never use an em dash here." |
| "complete protein" | None. |
| "zeolite" | None. The Difference page calls it "Volcanic Mineral" tagged "NATURALLY OCCURRING". Step 0 calls it "A Naturally Occurring Volcanic Mineral". |
| "5.0" stars | None. `sections/zt-blend-chooser.liquid` line 92 shows five star symbols before the rating line, which reads "Rated 4.9 stars by verified buyers". That row is already live on Protein Blends and Shop Cacao. |
| Tub count | **1 hit, visible:** `templates/page.zt-chooser-blends.json` line 166 (step 0), "Protein, plus the ingredients you would otherwise buy one tub at a time." It's the intro of "More Than a Protein Shake.", and the same sentence is already live on the homepage. Not changed, because only em dashes may be edited here. Dana's call. |
| For information | Step 0 lines 27, 41, 55, 69 and 83 use en dashes, not em dashes, in the five size titles, for example "30-Day Bulk Bag – Cacao". Left as they are. |

## Open points found while building the kit (not changed here)

1. **Protein Blends would show the FAQ twice after group 2. Handled by step 7b,** which pastes the 18 Nov merge file described below.
   - The new picker (step 7) has a setting "FAQ under the chooser". Its default is Automatic, which prints the 12 questions, with FAQPage schema, under the picker.
   - Step 0 adds its own "Good Questions. Straight Answers." section lower on the page and doesn't turn that setting off.
   - Result: /pages/protein-blends gets the same FAQ twice and two FAQPage schema blocks.
   - The source theme avoids this with `"faq_set": "none"` on the chooser section. Its copy is `site-audit/2026-11-18/merge-188281815253/templates/page.zt-chooser-blends.json` (md5 f1a8f573), which is step 0 plus that one line.
   - Either use that file as step 0, or after group 2 open Customize > Protein Blends > Zeotein blend chooser and set "FAQ under the chooser" to None.
   - Shop Cacao and Shop Vegan have no FAQ today and get one.
2. **Files changed in the source theme that this kit leaves out.** All 600 source files were compared with live's 588:
   - checksums were compared for the first 200 files (all matched) and for every file saved after the 18 Nov 21:14:53 UTC copy in either theme;
   - the other files haven't been saved in either theme since the copy;
   - the 12 files only in the source are the 12 new kit files, and no file exists only on live.

   Outside the paste order:
   - `snippets/zt-guides-cart-data.liquid` (free guides in the cart):
     - Source md5 b6504e16 (19 Nov 00:53 UTC); live md5 2a5645df (19 Nov 01:22 UTC), so **live is newer**.
     - Both carry Dana's 18 Nov 6:48 PM CT rule: regular store bags and stick packs don't add guides in the cart.
     - Besides the comments, the only difference is that the source still lists product 9523394740437. That's "Zeotein Cacao Protein Powder Bulk Bag - 4 Pack, 120 Servings (Buy 3, Get 1 Free)", which is a draft. Leave live as it is.
   - `sections/_blocks.liquid`, `snippets/section.liquid` and `snippets/util-palette-hover-shift.liquid` (from the 18 Nov merge) were already pasted into live on 19 Nov between 02:47 and 02:50 UTC. The only difference is the missing final newline. Nothing to do.
   - `assets/zt-guides-cart.js` and `snippets/zt-buybox-tidy.liquid` were saved again in the source but are identical to live.
3. **Live has a file newer than the source:** `assets/cacao-lp-gift-guard.js`.
   - It was changed on live on 19 Nov at 02:09 UTC (md5 d34bd9ef, 8574 bytes). The source still holds the 18 Nov copy (4cccf395, 6870 bytes).
   - The kit doesn't touch it. Never copy the source theme over live as a whole.

## Click steps in Shopify

1. Open Shopify admin (https://admin.shopify.com/store/wmzz7i-xw).
2. Go to **Online Store > Themes**.
3. On **"Zeotein live theme - edit this one directly"** (the current theme), click **...** and then **Edit code**. Check that the code editor's top bar shows that theme's name.
   - Never click Publish.
   - Don't open "Do not publish - source: FAQ, gifts, Difference".
4. Work through the steps in the order of the table, one file at a time.
5. **Get the kit file:** open its raw link (pattern below) in a new tab. Press Ctrl+A then Ctrl+C (Cmd+A, Cmd+C on a Mac).
6. **New file:** in the left file list, use the folder's **Add a new snippet**, **Add a new asset** or **Add a new section**. In the newer editor, hover the folder name and click **+**.
   - Snippets and sections: type the file name without the folder, for example `zt-faq-content.liquid`.
   - Assets: choose "Create a blank file" if asked, and type `zt-faq.css` or `zt-diff.css`.
   - If the box already adds `.liquid` or `.css` itself, type the name without the extension.
   - Then check that the file list shows exactly the path from the table, with no `.liquid.liquid`.
   - No block file is new in this kit; both block files replace existing ones.
7. **Existing file:** open it and **back it up before changing anything**. Click in the code, press Ctrl+A and Ctrl+C, and save that text as a plain-text file on the computer. Name it after the path, for example `blocks__faq.liquid.live-backup-2026-11-19.txt`.
   - Shopify also keeps earlier saves under **Older versions** at the top of the open file. That's a second fallback, not the backup.
8. **Paste:** click in the code area, press Ctrl+A (this selects the backup text, or the starter text Shopify puts in a new file), then Ctrl+V. Check the last line number (Lines column) and that the last line matches the raw file.
9. **Save** with the Save button or Ctrl+S. Wait for the save to finish.
   - If Shopify shows any error, stop. Don't go on to the next file.
   - If a page looks broken, paste the backup back in.
10. After the last file of each group, open that group's page check (below) on a computer and a phone.
    - Right-click and choose **View page source**, then search for `Liquid error`. There should be 0 results.

## Raw links

`https://raw.githubusercontent.com/zeotein/zeotein-theme/08520e1c1462e0948d95afe02c0c554e8525b6b8/site-audit/2026-11-19/live-paste-all/<path>`

`<path>` is the File column, for example
`https://raw.githubusercontent.com/zeotein/zeotein-theme/08520e1c1462e0948d95afe02c0c554e8525b6b8/site-audit/2026-11-19/live-paste-all/snippets/zt-faq-content.liquid`.

`08520e1c1462e0948d95afe02c0c554e8525b6b8` is filled in after the push. If the repository is private and a raw link shows 404, open the same path on github.com (`https://github.com/zeotein/zeotein-theme/blob/08520e1c1462e0948d95afe02c0c554e8525b6b8/site-audit/2026-11-19/live-paste-all/<path>`) while signed in, and click **Raw**.

## Prompt for Dana's Claude in Chrome session

Copy everything in the box and paste it into Claude in Chrome on the laptop, with Shopify admin signed in.

```text
HOLD (19 Nov 2026, 1:40 PM CT): DO NOT RUN THIS PROMPT. Stop and tell Dana.
Relay pastes from site-audit/2026-11-19/RELAY-PASTE-ORDER.md instead.

You are in Dana's Chrome on her laptop, signed in to Shopify admin for zeotein.com:
https://admin.shopify.com/store/wmzz7i-xw
Your job: paste 20 files into the LIVE theme's code, one file at a time, in exactly the order below.
Dana's rule since 19 Nov: edits go straight into the live theme, and no theme is ever published.

RULES (follow all of them):
1. Work only in the theme "Zeotein live theme - edit this one directly" (the current theme):
   Online Store > Themes > on that theme click "..." > Edit code. Check that the editor's top bar shows that name.
2. Never click Publish on any theme. Never open or edit "Do not publish - source: FAQ, gifts, Difference".
   Do not use Customize. Do not change any file, setting or product that is not in the list below.
3. One file at a time: create or open it, paste, Save, confirm the save finished, and only then move on.
4. Back up every REPLACE file before you change it. With the file open, click in the code, press Ctrl+A and
   Ctrl+C (Cmd on a Mac), and save that text as a plain-text file in the laptop's Downloads folder, named
   like blocks__faq.liquid.live-backup-2026-11-19.txt (the path with "/" replaced by "__").
   If you have no way to save a file yourself, stop and ask Dana to save it, then wait for her OK.
5. STOP at the first error of any kind and tell Dana exactly what you saw. Errors include:
   - Shopify shows an error after Save;
   - a raw link does not load or is not plain text;
   - a NEW file name already exists;
   - the line count or last line does not match;
   - a page check fails, or "Liquid error" appears in the page source;
   - the screen does not match these steps.
   Do not retry, guess or work around it.
6. Never type file contents yourself. Always copy the whole raw file and paste it.

THE KIT FILES. BASE = https://raw.githubusercontent.com/zeotein/zeotein-theme/08520e1c1462e0948d95afe02c0c554e8525b6b8/site-audit/2026-11-19/live-paste-all/
For each step, open BASE + path in a new tab. Check that it shows plain text. Press Ctrl+A, Ctrl+C.
(If it shows 404, open https://github.com/zeotein/zeotein-theme/blob/08520e1c1462e0948d95afe02c0c554e8525b6b8/site-audit/2026-11-19/live-paste-all/ + path
and click Raw.)

HOW TO DO ONE STEP:
a. Copy the raw file as above.
b. NEW: in the code editor's file list, use the folder's "Add a new snippet", "Add a new asset" or "Add a new section"
   (newer editor: hover the folder name, click +). Type the file name without the folder. If the box adds .liquid or
   .css itself, leave the extension off. Check that the file list then shows exactly the path below.
   REPLACE: open the existing file, then back it up (rule 4).
c. Click in the code area, press Ctrl+A, then Ctrl+V.
d. Check: the last line number is the given count (or count + 1), and the last line matches the raw file.
e. Click Save and wait for the save to finish.
f. Note the step number and the time it saved.

STEPS (path | NEW or REPLACE | lines):
0  templates/page.zt-chooser-blends.json | REPLACE | 320
   CHECK: https://zeotein.com/pages/protein-blends shows, under the product picker: "What's Inside Matters.",
   "More Than a Protein Shake.", "Made for Real Life.", "Real People. Real Reviews.", "Good Questions. Straight Answers."
GROUP 1, FAQ
1  snippets/zt-faq-content.liquid | NEW | 40
2  assets/zt-faq.css | NEW | 41
3  blocks/faq.liquid | REPLACE | 46
4  sections/zt-pdp-faq.liquid | REPLACE | 93
   CHECK: https://zeotein.com/ FAQ has 12 questions, first "Does Zeotein Cacao taste like bone broth?",
   last "How fast does Zeotein ship?". https://zeotein.com/products/zeotein-vegan-sticks-30 FAQ starts
   with "What does Zeotein taste like?".
GROUP 2, GIFTS IN THE PRODUCT PICKER
5  snippets/zt-ch-perk.liquid | NEW | 55
6  snippets/zt-ch-kit.liquid | NEW | 41
7  sections/zt-blend-chooser.liquid | REPLACE | 527
   CHECK: https://zeotein.com/pages/protein-blends size cards show "+ FREE STARTER KIT" (7-Day sizes: "+ 3 FREE GUIDES"),
   a purple "Your FREE Starter Kit" card lists each gift with FREE, the button reads "Continue · $... + Free Starter Kit",
   and the old "Included free" box is gone. The FAQ may show twice here; step 7b fixes that.
7b templates/page.zt-chooser-blends.json | REPLACE (again) | 321
   Copy from BASE + templates/page.zt-chooser-blends.after-group2.json (a different kit file name)
   and paste it into the theme file templates/page.zt-chooser-blends.json. Back up first (rule 4).
   CHECK: https://zeotein.com/pages/protein-blends shows "Good Questions. Straight Answers." exactly once.
GROUP 3, HOMEPAGE GIFT BADGES
8  blocks/zt-home-choose.liquid | REPLACE | 176
   CHECK: https://zeotein.com/ "Choose Your Zeotein": Cacao and Vegan cards show "30-Day + FREE STARTER KIT",
   "7-Day + 3 FREE GUIDES" and "Up to $... in free gifts with your first order".
GROUP 4, DIFFERENCE PAGE (step 17 LAST)
9  assets/zt-diff.css | NEW | 121
10 snippets/zt-diff-head.liquid | NEW | 5
11 sections/zt-diff-hero.liquid | NEW | 59
12 sections/zt-diff-choices.liquid | NEW | 39
13 sections/zt-diff-blends.liquid | NEW | 64
14 sections/zt-diff-taste.liquid | NEW | 35
15 sections/zt-diff-flex.liquid | NEW | 46
16 sections/zt-diff-close.liquid | NEW | 24
17 templates/page.the-zeotein-difference.json | REPLACE | 93
   CHECK: https://zeotein.com/pages/the-zeotein-difference starts with the purple "Intentional by design." banner
   and ends with the teal "Simple on purpose. Made to fit your life." band.
GROUP 5, VEGAN BLACK FRIDAY PRICES (must be saved before Tue 24 Nov, 12:00 AM CT)
18 snippets/zt-bf-blend-price.liquid | REPLACE | 71
   BEFORE: the live file has 71 lines and line 34 reads   assign vegan_off = '4200,8999,14398,20397' | split: ','
   If it already has 238 lines, step D1 of the Black Friday kit (site-audit/2026-11-19/bf-live-paste/) is in and
   already carries the new amounts: SKIP step 18, do not paste, and tell Dana. Pasting step 18 over D1 would remove
   the Black Friday price lines on product pages and cards.
   It changes one line: vegan_off = '4050,8599,13798,19597' (was '4200,8999,14398,20397').
   CHECK: open https://zeotein.com/products/zeotein-vegan-sticks-30, right-click > View page source, search "94.49".
   The hidden Black Friday table must list $94.49, $183.99, $266.99 and $343.99.
   Before this step it lists $92.99, $179.99, $260.99 and $335.99. The table stays hidden on the page until 24 Nov, which is correct.

AFTER EVERY CHECK: open the page source (right-click > View page source), search "Liquid error": it must be 0.

REPORT: after each group, and when you finish or stop, give Dana one line: the steps done, the save times,
and any error. If you have the send_message tool, also send that line to session_01D28ukaCB7Cnc3EGQpjbouB.
```

## Page check after each group

Also open the page on a phone. Every page should show 0 results for "Liquid error" in View page source.

| After | Open | What should be visible |
|---|---|---|
| Step 0 | https://zeotein.com/pages/protein-blends | Under the unchanged picker (which still has the "Included free" box): "What's Inside Matters.", "More Than a Protein Shake.", "Made for Real Life.", "Real People. Real Reviews." and "Good Questions. Straight Answers." |
| Group 1 | https://zeotein.com/ (and /pages/faqs) | "Good Questions. Straight Answers." lists 12 questions, from "Does Zeotein Cacao taste like bone broth?" to "How fast does Zeotein ship?". https://zeotein.com/products/zeotein-vegan-sticks-30 starts with "What does Zeotein taste like?". Page source has "FAQPage" (no page has it today). |
| Group 2 | https://zeotein.com/pages/protein-blends (and /pages/shop-cacao, /pages/shop-vegan) | Size cards show "+ FREE STARTER KIT" (7-Day: "+ 3 FREE GUIDES"). The chosen card shows a gift line. A purple "Your FREE Starter Kit" card shows struck prices and FREE (Bulk Bag on Subscribe: $62.98 value). The button reads "Continue · $… + Free Starter Kit", with "30-day money-back guarantee · Ships in 1 to 2 business days" under it. "Included free" is gone. An FAQ sits under the picker. On Protein Blends it shows twice until step 7b is saved. |
| Group 3 | https://zeotein.com/ | In "Choose Your Zeotein", the Cacao and Vegan cards show "30-Day + FREE STARTER KIT" and "7-Day + 3 FREE GUIDES". The Cacao card says "Up to $62.98 in free gifts with your first order" and the Vegan card says $55.99. |
| Step 7b | https://zeotein.com/pages/protein-blends | "Good Questions. Straight Answers." appears exactly once. |
| Group 4 | https://zeotein.com/pages/the-zeotein-difference | In order: the purple "Intentional by design." banner with the stats 6, 5, 0g and 0g; "Six choices that make Zeotein, Zeotein."; "Two blends. One standard."; "Does it taste like bone broth?"; "Your routine. Your schedule."; and the teal "Simple on purpose. Made to fit your life." band. |
| Step 18 | https://zeotein.com/products/zeotein-vegan-sticks-30 (View page source, search "94.49") | The hidden Black Friday table lists $94.49, $183.99, $266.99 and $343.99. Before step 18 it lists $92.99, $179.99, $260.99 and $335.99. It stays hidden on the page until 24 Nov. |
