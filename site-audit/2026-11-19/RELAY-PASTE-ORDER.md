# Relay paste order: kit 1, then kit 2 (19 Nov 2026)

## UPDATE 24 Nov 2026, 12:20 AM CT: read this first

- **Do not paste R1, R2 or K2-BF17.** 4.9 is already live on the Cacao landing page and the homepage (checked 12:15 AM CT), and those live files changed overnight.
- **Do not paste R3.** It was built for the 2 to 4-pack fixed amounts, which ended on 23 Nov. The new 37% and 44% discounts make it wrong. The Vegan table on live is drawn by another file now.
- Details: `site-audit/2026-11-24/cart-check.md`.

## UPDATE 23 Nov 2026, 1:45 PM CT: read this before any step below

Live has moved on since 19 Nov, and the discounts changed: storewide 30% now starts **Tue 24 Nov**, not Fri 27 Nov. Where this section and the tables below differ, this section wins. Details: `site-audit/2026-11-23/paste-check.md`.

- **Already saved, skip:** K1-2, K1-3, K1-4, K1-6, K1-9 to K1-16; K2-BF2, BF3, BF5, BF12.
- **Do not paste the kit file.** Live has a newer version, and pasting would undo it (its BEFORE check fails anyway): K1-0, K1-1, K1-5, K1-7, K1-7b, K1-8; K2-BF1, BF4, BF6 to BF11, BF13, BF14, BF15, BF16, BF18, BF19, BF21, BF22.
- **Still GO as listed:** K1-17. Live still has the old Difference template, so its BEFORE check holds.
- **HOLD, out of date for the 24 Nov storewide start:** K2-BF20 to BF23 and K2-D1. Claude will rebuild them only if Dana wants Black Friday price lines on product pages and cards.
- **Replaced, still waiting for Dana's own yes:**
  - K1-18 is replaced by **R3**;
  - K2-BF15 and BF16 are replaced by **R1** and **R2**;
  - K2-BF17 stays as listed (live unchanged).

R source = `https://raw.githubusercontent.com/zeotein/zeotein-theme/b01dcd908e82066e1d17acf43f5c62ebc0763183/site-audit/2026-11-23/rebuilt/` + the live path. Each R file is today's live file with the smallest change. R1 to R3 and BF17 don't depend on each other or on any other step.

- **R1** `snippets/cacao-lp-review-score.liquid` (REPLACE)
  - BEFORE: 69 lines; line 37 ends with `round` (live md5 e383c869)
  - AFTER: 69 lines; line 37 ends with `floor`
  - TEST: /products/cacao-protein-starter-kit loads, 0 Liquid errors
- **R2** `sections/buy-box-cacao-lp-v2.liquid` (REPLACE)
  - BEFORE: 994 lines; line 268 ends with `round` (live md5 5a578cd8)
  - AFTER: 994 lines; line 268 ends with `floor`
  - TEST: /products/cacao-protein-starter-kit buy box reads "4.9/5.0 (155 Reviews)"
- **K2-BF17** `sections/hero-banner-cacao-lp.liquid`: as listed below (kit file, live unchanged)
  - TEST: same page, hero reads "4.9 stars", and "5.0 stars" appears nowhere
- **R3** `snippets/zt-bf-blend-price.liquid` (REPLACE)
  - BEFORE: 71 lines; line 34 is the old `vegan_off` line with 4200,8999,14398,20397 (live md5 a99c6fc3)
  - AFTER: 82 lines
  - TEST: view source of /products/zeotein-vegan-sticks-30, search "91.00". The Black Friday table lists $91.00, $173.99, $251.99 and $323.99


Written 19 Nov 2026, 1:40 PM CT, on Dana's instruction:
- **Relay is the only one pasting** into the live theme "Zeotein live theme - edit this one directly" (#188199928021): one file at a time, with a test after each.
- **Nobody pastes into the BF theme** "Black Friday Store 2026 (draft, publish Nov 27)" (#187825914069).
- **Dana's Lenovo Claude in Chrome does not run either kit.** The Chrome prompts in both kit READMEs carry a HOLD line.
- **Order:** Relay's current queue, then kit 1, then kit 2.
- **WAIT for Dana's own yes:** K1-18, K2-BF1 to BF14 (/bf files), K2-BF15 to BF19 (4.9 review score) and K2-D1 (it replaces the same Vegan BF price file as K1-18, with the full version).
- **HOLD, not in this order:** K2-H1 to H3 (Stocking Stuffers page).

Checked 19 Nov at about 1:35 PM CT:
- Nothing from either kit is on live.
- Every REPLACE and MERGE file on live still matches its BEFORE md5 below (live last saved 19 Nov, 6:59 AM CT).
- All 47 raw links return the exact kit file.

## Where the files come from

Paste only from these pinned links. The commits never change, so every file is exactly the one checked. Never copy a file out of a theme.

- **K1** = `https://raw.githubusercontent.com/zeotein/zeotein-theme/08520e1c1462e0948d95afe02c0c554e8525b6b8/site-audit/2026-11-19/live-paste-all/` + source file
- **K2** = `https://raw.githubusercontent.com/zeotein/zeotein-theme/ab932f284e2d99e91c7d9387c4df9a02ef8006ee/site-audit/2026-11-19/bf-live-paste/` + source file
- If a raw link shows 404, open the same path at `https://github.com/zeotein/zeotein-theme/blob/<commit>/...` while signed in, and click Raw.

The "From" column names where the file was copied from, for reference only.

## Rules for every step

1. **Theme:** work only in the live theme's code editor: Online Store > Themes > "Zeotein live theme - edit this one directly" > ... > Edit code. Never Publish, never use Customize, never open the BF theme or a "Do not publish - source" theme.
2. **NEW:** the file must not exist yet; if it does, stop. **REPLACE or MERGE:** do the BEFORE check first, then save a backup of the current text (path with "/" as "__", plus the date), then paste.
3. **Paste:** open the raw link, Ctrl+A, Ctrl+C; in the editor Ctrl+A, Ctrl+V. Never type file contents.
4. **Line counts:** the editor's last line number is the number given, or one more. JSON templates may be reformatted, or get Shopify's "auto-generated" comment on top, when saved. That's fine if Shopify shows no error.
5. **Save:** if Shopify shows any error, stop. Then run the step's test, and check that the test page's source has 0 "Liquid error".
6. **BEFORE mismatch means live changed** (for example from Relay's own queue). Stop and ask Claude to rebuild that file on top of the new live version. Never paste over it. Claude can re-check every BEFORE md5 in one read-only call whenever asked.

## Kit 1: FAQ, gifts, Difference page, Vegan BF price (20 steps, 19 files)

| Step | Live file | Action | Source file (K1 +) | From | Status and notes |
|---|---|---|---|---|---|
| K1-0 | `templates/page.zt-chooser-blends.json` | REPLACE | `templates/page.zt-chooser-blends.json` | Branch only (approved Protein Blends template, from site-audit/2026-11-19/live-paste/) | GO. Replaced again at 7b |
| K1-1 | `snippets/zt-faq-content.liquid` | NEW | `snippets/zt-faq-content.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-2 | `assets/zt-faq.css` | NEW | `assets/zt-faq.css` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-3 | `blocks/faq.liquid` | REPLACE | `blocks/faq.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO. Needs 1 and 2 |
| K1-4 | `sections/zt-pdp-faq.liquid` | REPLACE | `sections/zt-pdp-faq.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO. Needs 1 and 2 |
| K1-5 | `snippets/zt-ch-perk.liquid` | NEW | `snippets/zt-ch-perk.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-6 | `snippets/zt-ch-kit.liquid` | NEW | `snippets/zt-ch-kit.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-7 | `sections/zt-blend-chooser.liquid` | REPLACE | `sections/zt-blend-chooser.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO. Needs 5 and 6 |
| K1-7b | `templates/page.zt-chooser-blends.json` | REPLACE again | `templates/page.zt-chooser-blends.after-group2.json` | #188281815253, its templates/page.zt-chooser-blends.json (same bytes) | GO. Right after 7. Copy from the kit file `templates/page.zt-chooser-blends.after-group2.json`, paste into the live file `templates/page.zt-chooser-blends.json` |
| K1-8 | `blocks/zt-home-choose.liquid` | REPLACE | `blocks/zt-home-choose.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-9 | `assets/zt-diff.css` | NEW | `assets/zt-diff.css` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-10 | `snippets/zt-diff-head.liquid` | NEW | `snippets/zt-diff-head.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-11 | `sections/zt-diff-hero.liquid` | NEW | `sections/zt-diff-hero.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-12 | `sections/zt-diff-choices.liquid` | NEW | `sections/zt-diff-choices.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-13 | `sections/zt-diff-blends.liquid` | NEW | `sections/zt-diff-blends.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-14 | `sections/zt-diff-taste.liquid` | NEW | `sections/zt-diff-taste.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-15 | `sections/zt-diff-flex.liquid` | NEW | `sections/zt-diff-flex.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-16 | `sections/zt-diff-close.liquid` | NEW | `sections/zt-diff-close.liquid` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO |
| K1-17 | `templates/page.the-zeotein-difference.json` | REPLACE | `templates/page.the-zeotein-difference.json` | #188281815253 "Do not publish - source: FAQ, gifts, Difference" (same bytes) | GO. **LAST of 9 to 17.** Shopify refuses to save it if any of 11 to 16 is missing |
| K1-18 | `snippets/zt-bf-blend-price.liquid` | REPLACE | `snippets/zt-bf-blend-price.liquid` | Branch only (live file a99c6fc3 with line 34 changed) | **WAIT: Dana's own yes** (Vegan BF price file). Before K2-D1, never after it. Due before Tue 24 Nov 12:00 AM CT |

### Kit 1 checks per step

BEFORE is what live must show before the paste; AFTER is the line count after it; TEST is the check after Save.

- **K1-0** `templates/page.zt-chooser-blends.json`
  - BEFORE: 131 lines; line 13 reads `"type": "zt-blend-chooser",` (live md5 b970b6ae)
  - AFTER: 320 lines
  - TEST: /pages/protein-blends: under the picker, "What's Inside Matters.", "More Than a Protein Shake.", "Made for Real Life.", "Real People. Real Reviews.", "Good Questions. Straight Answers."
- **K1-1** `snippets/zt-faq-content.liquid`
  - BEFORE: Must not exist
  - AFTER: 40 lines
  - TEST: Save only (used from step 3). Homepage: 0 Liquid errors
- **K1-2** `assets/zt-faq.css`
  - BEFORE: Must not exist
  - AFTER: 41 lines
  - TEST: Save only (used from step 3)
- **K1-3** `blocks/faq.liquid`
  - BEFORE: 660 lines; line 2 reads `assign section_id = 'zt-faq-' | append: block.id` (187b0839)
  - AFTER: 46 lines
  - TEST: Homepage and /pages/faqs: "Good Questions. Straight Answers." has 12 questions, first "Does Zeotein Cacao taste like bone broth?", last "How fast does Zeotein ship?". Source has "FAQPage"
- **K1-4** `sections/zt-pdp-faq.liquid`
  - BEFORE: 395 lines; line 2 starts `Product-page FAQ (product templates only).` (2c905226)
  - AFTER: 93 lines
  - TEST: /products/zeotein-vegan-sticks-30: FAQ starts with "What does Zeotein taste like?"
- **K1-5** `snippets/zt-ch-perk.liquid`
  - BEFORE: Must not exist
  - AFTER: 55 lines
  - TEST: Save only (used from step 7)
- **K1-6** `snippets/zt-ch-kit.liquid`
  - BEFORE: Must not exist
  - AFTER: 41 lines
  - TEST: Save only (used from step 7)
- **K1-7** `sections/zt-blend-chooser.liquid`
  - BEFORE: 421 lines; line 2 starts `ZEOTEIN BLEND CHOOSER (Nov 16 2026, simplified 11:30 AM CT` (82fa34e6)
  - AFTER: 527 lines
  - TEST: /pages/protein-blends, /pages/shop-cacao, /pages/shop-vegan: "+ FREE STARTER KIT" (7-Day: "+ 3 FREE GUIDES"), purple "Your FREE Starter Kit" card, button "Continue · $... + Free Starter Kit", no "Included free". The FAQ shows twice on Protein Blends until 7b (expected)
- **K1-7b** `templates/page.zt-chooser-blends.json`
  - BEFORE: Step 0 file is in: 320 lines (60c3a56e)
  - AFTER: 321 lines
  - TEST: /pages/protein-blends: "Good Questions. Straight Answers." exactly once
- **K1-8** `blocks/zt-home-choose.liquid`
  - BEFORE: 146 lines; line 2 reads `ZEOTEIN HOMEPAGE: CHOOSE YOUR ZEOTEIN (Nov 2026)` (58737eb2)
  - AFTER: 176 lines
  - TEST: Homepage "Choose Your Zeotein": Cacao and Vegan cards show "30-Day + FREE STARTER KIT" and "7-Day + 3 FREE GUIDES"; "Up to $62.98 in free gifts with your first order" (Cacao), $55.99 (Vegan)
- **K1-9** `assets/zt-diff.css`
  - BEFORE: Must not exist
  - AFTER: 121 lines
  - TEST: Save only (used from step 17)
- **K1-10** `snippets/zt-diff-head.liquid`
  - BEFORE: Must not exist
  - AFTER: 5 lines
  - TEST: Save only (used from step 17)
- **K1-11** `sections/zt-diff-hero.liquid`
  - BEFORE: Must not exist
  - AFTER: 59 lines
  - TEST: Save only (used from step 17)
- **K1-12** `sections/zt-diff-choices.liquid`
  - BEFORE: Must not exist
  - AFTER: 39 lines
  - TEST: Save only (used from step 17)
- **K1-13** `sections/zt-diff-blends.liquid`
  - BEFORE: Must not exist
  - AFTER: 64 lines
  - TEST: Save only (used from step 17)
- **K1-14** `sections/zt-diff-taste.liquid`
  - BEFORE: Must not exist
  - AFTER: 35 lines
  - TEST: Save only (used from step 17)
- **K1-15** `sections/zt-diff-flex.liquid`
  - BEFORE: Must not exist
  - AFTER: 46 lines
  - TEST: Save only (used from step 17)
- **K1-16** `sections/zt-diff-close.liquid`
  - BEFORE: Must not exist
  - AFTER: 24 lines
  - TEST: Save only (used from step 17)
- **K1-17** `templates/page.the-zeotein-difference.json`
  - BEFORE: 340 lines; line 13 reads `"type": "zeotein-how-it-works",` (172ddfb8)
  - AFTER: 93 lines
  - TEST: /pages/the-zeotein-difference: starts with the purple "Intentional by design." banner (6, 5, 0g, 0g) and ends with the teal "Simple on purpose. Made to fit your life." band
- **K1-18** `snippets/zt-bf-blend-price.liquid`
  - BEFORE: 71 lines; line 34 reads `assign vegan_off = '4200,8999,14398,20397' | split: ','` (a99c6fc3). **If the file has 238 lines, D1 is already in: skip, do not paste.**
  - AFTER: 71 lines
  - TEST: View source of /products/zeotein-vegan-sticks-30, search "94.49": the hidden table lists $94.49, $183.99, $266.99, $343.99 (before: $92.99 ...)

## Kit 2: Black Friday (24 steps; H1 to H3 on hold)

| Step | Live file | Action | Source file (K2 +) | From | Status and notes |
|---|---|---|---|---|---|
| K2-BF1 | `snippets/zt-bf-bb-extras.liquid` | NEW | `snippets/zt-bf-bb-extras.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files) |
| K2-BF2 | `snippets/zt-bf-bb-gallery.liquid` | NEW | `snippets/zt-bf-bb-gallery.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files) |
| K2-BF3 | `snippets/zt-bf-bb-nutrition.liquid` | NEW | `snippets/zt-bf-bb-nutrition.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files) |
| K2-BF4 | `snippets/zt-bf-bb-panel.liquid` | NEW | `snippets/zt-bf-bb-panel.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files) |
| K2-BF5 | `snippets/zt-bf-bb-sticky.liquid` | NEW | `snippets/zt-bf-bb-sticky.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files) |
| K2-BF6 | `sections/buy-box-cacao-lp-bf.liquid` | NEW | `sections/buy-box-cacao-lp-bf.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files). Needs BF1 to BF5 |
| K2-BF7 | `sections/bf-countdown-bar.liquid` | NEW | `sections/bf-countdown-bar.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files) |
| K2-BF8 | `sections/hero-banner-cacao-lp-bf.liquid` | NEW | `sections/hero-banner-cacao-lp-bf.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files) |
| K2-BF9 | `sections/whats-in-kit-cacao-lp-bf.liquid` | NEW | `sections/whats-in-kit-cacao-lp-bf.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files) |
| K2-BF10 | `sections/cacao-lp-reviews-bf.liquid` | NEW | `sections/cacao-lp-reviews-bf.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files) |
| K2-BF11 | `sections/header-cacao-lp-bf.liquid` | NEW | `sections/header-cacao-lp-bf.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files) |
| K2-BF12 | `sections/header-group-cacao-lp-bf.json` | NEW | `sections/header-group-cacao-lp-bf.json` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files). Needs BF11. JSON file in Sections: name `header-group-cacao-lp-bf.json`; the list must show `sections/header-group-cacao-lp-bf.json`, not `.json.liquid`. If the editor cannot make a JSON file here, stop |
| K2-BF13 | `layout/theme.cacao-lp-bf.liquid` | NEW | `layout/theme.cacao-lp-bf.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files). Needs BF12. Layout > Add a new layout, name `theme.cacao-lp-bf` |
| K2-BF14 | `templates/product.cacao-lp-bf.json` | NEW | `templates/product.cacao-lp-bf.json` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (/bf files). **LAST of BF1 to BF14.** Templates > Add a new template > product, JSON, name `cacao-lp-bf`. /bf switches the moment it saves. Due before Tue 24 Nov 12:00 AM CT |
| K2-BF15 | `snippets/cacao-lp-review-score.liquid` | REPLACE | `snippets/cacao-lp-review-score.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (4.9 review score) |
| K2-BF16 | `sections/buy-box-cacao-lp-v2.liquid` | REPLACE | `sections/buy-box-cacao-lp-v2.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (4.9 review score) |
| K2-BF17 | `sections/hero-banner-cacao-lp.liquid` | REPLACE | `sections/hero-banner-cacao-lp.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (4.9 review score) |
| K2-BF18 | `sections/zt-home-hero.liquid` | REPLACE | `sections/zt-home-hero.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (4.9 review score) |
| K2-BF19 | `snippets/zt-buybox-tidy.liquid` | MERGE | `merged/snippets/zt-buybox-tidy.liquid` | Branch only: live 277274bc plus line 82 from the BF theme | **WAIT: Dana's own yes** (4.9 review score). Merge file: paste from `merged/` |
| K2-BF20 | `sections/zt-bf-countdown-sitewide.liquid` | REPLACE | `sections/zt-bf-countdown-sitewide.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | GO. Do BF21 straight after it |
| K2-BF21 | `sections/header-group.json` | MERGE | `merged/sections/header-group.json` | Branch only: live 9260234e with the BF banner settings | GO. Merge file: paste from `merged/`. Right after BF20. This ends the purple "Black Friday ends in" bar set for 24 to 26 Nov (see notes) |
| K2-BF22 | `sections/main-product.liquid` | REPLACE | `sections/main-product.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | GO. Shows nothing new until D1 |
| K2-BF23 | `snippets/card-product.liquid` | REPLACE | `snippets/card-product.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | GO. Shows nothing new until D1 |
| K2-D1 | `snippets/zt-bf-blend-price.liquid` | REPLACE | `dated/snippets/zt-bf-blend-price.liquid` | BF theme #187825914069 (same bytes, read 19 Nov) | **WAIT: Dana's own yes** (Vegan BF price file, full version). Needs K1-18 and BF20 first. Due before Fri 27 Nov 12:00 AM CT for the storewide prices; Vegan prices show from 24 Nov |

### Kit 2 checks per step

BEFORE is what live must show before the paste; AFTER is the line count after it; TEST is the check after Save.

- **K2-BF1** `snippets/zt-bf-bb-extras.liquid`
  - BEFORE: Must not exist
  - AFTER: 141 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF2** `snippets/zt-bf-bb-gallery.liquid`
  - BEFORE: Must not exist
  - AFTER: 90 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF3** `snippets/zt-bf-bb-nutrition.liquid`
  - BEFORE: Must not exist
  - AFTER: 89 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF4** `snippets/zt-bf-bb-panel.liquid`
  - BEFORE: Must not exist
  - AFTER: 203 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF5** `snippets/zt-bf-bb-sticky.liquid`
  - BEFORE: Must not exist
  - AFTER: 66 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF6** `sections/buy-box-cacao-lp-bf.liquid`
  - BEFORE: Must not exist
  - AFTER: 186 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF7** `sections/bf-countdown-bar.liquid`
  - BEFORE: Must not exist
  - AFTER: 189 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF8** `sections/hero-banner-cacao-lp-bf.liquid`
  - BEFORE: Must not exist
  - AFTER: 1911 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF9** `sections/whats-in-kit-cacao-lp-bf.liquid`
  - BEFORE: Must not exist
  - AFTER: 137 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF10** `sections/cacao-lp-reviews-bf.liquid`
  - BEFORE: Must not exist
  - AFTER: 340 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF11** `sections/header-cacao-lp-bf.liquid`
  - BEFORE: Must not exist
  - AFTER: 358 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF12** `sections/header-group-cacao-lp-bf.json`
  - BEFORE: Must not exist
  - AFTER: 16 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF13** `layout/theme.cacao-lp-bf.liquid`
  - BEFORE: Must not exist
  - AFTER: 453 lines
  - TEST: Save only (nothing uses it until BF14). https://zeotein.com/bf still loads, unchanged, 0 Liquid errors
- **K2-BF14** `templates/product.cacao-lp-bf.json`
  - BEFORE: Must not exist
  - AFTER: 10 lines; line 10 is one long line ending `"sticky_offer_cacao_lp_raf1"]}`
  - TEST: https://zeotein.com/bf shows the landing page: black bar with a "Black Friday" tag, "60% off your Starter Kit. Ends in" and a running clock; hero "60% off your Zeotein Cacao Starter Kit", "$68.99", "Get My Black Friday Kit"; logo and cart only, no store menu or footer. FAIL if the store menu, the "Simple on purpose." ticker, "$109.99" or "Add to cart" show. Source has `zt-bf-lp-chrome-lock`
- **K2-BF15** `snippets/cacao-lp-review-score.liquid`
  - BEFORE: 65 lines; line 37 ends `times: 10 | round` (2af2b03b)
  - AFTER: 65 lines; line 37 ends `times: 10 | floor`
  - TEST: /products/cacao-protein-starter-kit loads, 0 Liquid errors (full 4.9 check after BF17)
- **K2-BF16** `sections/buy-box-cacao-lp-v2.liquid`
  - BEFORE: 1051 lines; line 325 ends `times: 10 | round` (719401c1)
  - AFTER: 1051 lines; line 325 ends `times: 10 | floor`
  - TEST: /products/cacao-protein-starter-kit buy box reads "4.9/5.0 (155 Reviews)", not "5.0/5.0"
- **K2-BF17** `sections/hero-banner-cacao-lp.liquid`
  - BEFORE: 1870 lines; line 39 ends `plus: 0 | round: 1` (fcf0a6ae)
  - AFTER: 1870 lines; line 39 ends `times: 10 | floor | divided_by: 10.0`
  - TEST: Same page, hero reads "4.9 stars", never "5.0 stars"
- **K2-BF18** `sections/zt-home-hero.liquid`
  - BEFORE: 271 lines; line 7 ends `times: 1.0 | round: 1` (f6b594d3)
  - AFTER: 271 lines; line 7 ends `times: 10 | floor | divided_by: 10.0`
  - TEST: Homepage hero reads "4.9 from 155 reviews" (today "5.0 from 155 reviews")
- **K2-BF19** `snippets/zt-buybox-tidy.liquid`
  - BEFORE: 705 lines; line 82 reads `assign shown = avg | round: 1` (277274bc)
  - AFTER: 705 lines; line 82 reads `assign shown = avg | times: 10 | floor | divided_by: 10.0`
  - TEST: /products/zeotein-cacao-bag-30 rating line reads "4.9 from verified buyers"
- **K2-BF20** `sections/zt-bf-countdown-sitewide.liquid`
  - BEFORE: 143 lines; line 2 starts `Sitewide Black Friday countdown (Orbit, Nov 15 2026)` (5a147c26)
  - AFTER: 186 lines
  - TEST: Homepage loads, 0 Liquid errors, no banner (correct before 27 Nov)
- **K2-BF21** `sections/header-group.json`
  - BEFORE: 185 lines; the `zt_bf_countdown` block has `"cta_text": "Shop blend deals"` and `"start_epoch": 1795500000` (9260234e)
  - AFTER: 187 lines; `"cta_text": "Shop the sale"`, `"start_epoch": 1795759200`
  - TEST: Homepage source has `data-ztbf-start="1795759200"`. /?zt_bf_preview=1 shows the black "BLACK FRIDAY 30% OFF STOREWIDE" banner with "Ends in", a countdown and a teal "Shop the sale" button; then open /?zt_bf_preview=0 and the banner is gone
- **K2-BF22** `sections/main-product.liquid`
  - BEFORE: 2268 lines (3653e1df)
  - AFTER: 2269 lines; line 117 reads `{%- render 'zt-bf-blend-price', product: product, mode: 'price', pdp: true -%}`
  - TEST: /products/zeotein-cacao-bag-30 looks the same as before, 0 Liquid errors
- **K2-BF23** `snippets/card-product.liquid`
  - BEFORE: 624 lines (6d89659c)
  - AFTER: 625 lines; line 208 reads `{% render 'zt-bf-blend-price', product: card_product, mode: 'price' %}`
  - TEST: /collections/shop-all looks the same as before, 0 Liquid errors
- **K2-D1** `snippets/zt-bf-blend-price.liquid`
  - BEFORE: 71 lines and line 34 reads `assign vegan_off = '4050,8599,13798,19597' | split: ','`, i.e. K1-18 is in (7009330d). Any other state: stop
  - AFTER: 238 lines; line 2 starts `zt-bf-blend-price (Orbit, Nov 15 2026).`; line 50 has the same vegan_off line
  - TEST: /collections/shop-all?zt_bf_preview=1: sale cards show the regular price struck through and a purple Black Friday price (gift card: normal price only). /products/zeotein-vegan-sticks-30?zt_bf_preview=1: table $94.49, $183.99, $266.99, $343.99. Then open /?zt_bf_preview=0

**On hold, not in this order:** K2-H1 `sections/stocking-gift-lp.liquid`, K2-H2 `snippets/cart-drawer.liquid`, K2-H3 `templates/product.stocking-gift.json`. They need Dana's OK and fixes first: the page shows Vegan 7-Day at $44.99 (the price is $39.99) and the text "shipping rule still being wired".

## Dependencies and deadlines

| Rule | Why |
|---|---|
| K1-0 before K1-7b; K1-7b right after K1-7 | 7b replaces step 0's file again with `"faq_set": "none"`, or Protein Blends shows the FAQ twice |
| K1-1 and K1-2 before K1-3 and K1-4; K1-5 and K1-6 before K1-7 | The replaced files call the new snippets and CSS |
| K1-9 to K1-16 before K1-17 | Shopify refuses a template that names a missing section |
| K1-18 before K2-D1, and **never K1-18 after K2-D1** | K1-18 is the short Vegan-only file; pasted after D1 it removes the Black Friday price lines on product pages and cards |
| K2-BF1 to BF5, then BF6 to BF11, then BF12, then BF13, then BF14 last | Each later file names the earlier ones; Shopify refuses a template whose sections or layout don't exist yet |
| K2-BF20, then BF21 straight away | BF20 brings the new banner texts and BF21 holds their settings and the 27 Nov start |
| K2-D1 after K1-18 and K2-BF20 | D1's BEFORE check expects K1-18's file; BF20 carries the price styles D1 uses |
| **Before Tue 24 Nov, 12:00 AM CT** | K2-BF1 to BF14 (the BF01 email links /bf), K2-BF15 to BF19 (5.0 shows today), K1-18 (Vegan BF prices start 24 Nov) |
| **Before Fri 27 Nov, 12:00 AM CT** | K2-BF20 to BF23 and K2-D1 (storewide 30% off starts; without D1 no product page or card shows a Black Friday price, though checkout still takes it off) |

## Notes for Dana

- **BF20 and BF21 end Orbit's purple "Black Friday ends in" bar,** which live is set to show 24 to 26 Nov. From the moment they're saved, no sitewide bar shows until the black banner starts on 27 Nov. To keep the purple bar during early access, hold K2-BF20 to BF23 (and D1) until the evening of Thu 26 Nov.
- **K1-18 and D1 replace the same file.** A yes to "the Vegan BF price file" covers K1-18 then D1, in that order, unless Dana says otherwise.
- **After 30 Nov, /bf keeps selling** the $68.99 first order until it's taken down. See the 1 Dec list in `bf-live-paste/README.md`.

## Change log

- 24 Nov 2026, 12:20 AM CT: R1, R2, K2-BF17 and R3 marked do not paste. No kit file changed.
- 23 Nov 2026, 1:45 PM CT: update section added at the top (live state, 24 Nov storewide start, R1 to R3). No kit file changed.
- 19 Nov 2026, 1:40 PM CT: list written. Minutes later, before it was sent: the BEFORE, AFTER and TEST details moved from the tables into the per-step check lists, because some quoted code lines contain the | character, which splits Markdown table cells. The steps, order and files are the same. The paste files are unchanged (pinned commits above). Only the two kit READMEs changed, to add the HOLD lines. Any later change to a kit file will be announced in Dana's chat with Claude first and recorded here.
