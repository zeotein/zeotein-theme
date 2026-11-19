# Black Friday into the live theme: paste kit (19 Nov 2026)

This folder moves the Black Friday work onto zeotein.com without publishing a theme.

The work was built in the unpublished theme **"Black Friday Store 2026 (draft, publish Nov 27)"** (#187825914069), which was meant to be published at 12:00 AM CT on Fri 27 Nov.
Since 19 Nov, Dana's rule is that no theme is ever published: every change goes straight into the live theme **"Zeotein live theme - edit this one directly"** (#188199928021), in Shopify's code editor, one file at a time.
Claude's Shopify connection can't write to the live theme, so a person or Dana's Claude in Chrome session pastes each file from the raw links below.

What has to be live, and when (all times CT; note that 24 Nov 2026 is a Tuesday):

| Deadline | What | Steps |
|---|---|---|
| **Tue 24 Nov, 12:00 AM** (early access; the BF01 email to about 784 people links https://zeotein.com/bf) | The Black Friday bag landing page. Today /bf opens the plain product page: store menu, purple ticker, $109.99, "Add to cart". | Group 1, BF1 to BF14 |
| **Tue 24 Nov, 12:00 AM** (wrong today, so as soon as possible) | The review score rounds down. Judge.me's average is 4.95, so the live homepage reads "5.0 from 155 reviews" today and the Cacao landing page rounds up to 5.0 too. | Group 2, BF15 to BF19 |
| **Fri 27 Nov, 12:00 AM** (storewide 30% off one-time) | The black "BLACK FRIDAY 30% OFF STOREWIDE" banner, and the Black Friday price lines on product pages and product cards. All date-gated: they stay hidden until their start time, so they can be pasted early. | Group 3, BF20 to BF23, then step D1 |
| Mon 30 Nov, 11:59 PM | The sale ends. The banner and the price lines hide themselves. | none |
| Tue 1 Dec | Black Friday items come off. | 1 Dec list below |

**23 files** are in the paste order: 14 new, 7 replace, 2 merge. Step D1 replaces one more file; its kit copy is in `dated/` (see D1). 3 more files, for the Stocking Stuffers gift page, are **on hold** for Dana.

Already on live, nothing to paste: the subscriber Black Friday gift (24 to 30 Nov), the Vegan 30 Black Friday table (step 18 of `site-audit/2026-11-19/live-paste-all/` updates its prices), and the Protein Blends sections (steps 0 and 7b of that kit). The Black Friday discounts themselves are scheduled in Shopify and apply at checkout whatever the theme shows.

Built 19 Nov 2026, 15:00 to 16:15 UTC (9:00 to 10:15 AM CT), using only read-only Shopify GraphQL calls and read-only theme greps. Nothing was changed in Shopify or GoHighLevel. Nothing in this folder has been pasted yet. A second full listing at about 15:50 UTC found no file changed in either theme since the first read (live last saved 12:59:58 UTC, BF theme 14:35:52 UTC).

## How the two themes compare

Every file in both themes was listed with GraphQL (`theme.files`, 100 per page, `checksumMd5`) on 19 Nov at about 15:00 UTC:
- BF theme 607 files, live 588.
- **19 files only in the BF theme, 0 only on live.**
- **51 files in both with different checksums.** Each pair was read with GraphQL and compared line by line, and JSON was also compared as parsed data.

Each difference was sorted into three classes (full list in the appendix):
- **(a) BF content that must go live:** 27 files. 23 in the paste order, D1, and the 3 on hold.
- **(b) Live changes the BF theme lacks.** Never paste the BF copy over these:
  - `snippets/zt-buybox-tidy.liquid` (live 277274bc is newer; merge BF19 keeps it);
  - `sections/_blocks.liquid`, `snippets/section.liquid`, `snippets/util-palette-hover-shift.liquid` (pasted 19 Nov; final newline only);
  - `snippets/zt-guides-cart-data.liquid` (live 2a5645df; final newline only);
  - `assets/cacao-lp-gift-guard.js` (live d34bd9ef; only the final line ending differs);
  - the homepage block texts in `templates/index.json`, and live's own header settings in `sections/header-group.json` (merge BF21 keeps them).
  - `AGENTS.md` is identical in both themes now (2ee4d8bd), so it needs nothing.
- **(c) Noise:** 33 of the 51 differ only by a final newline, spaces, line endings, code comments, JSON formatting or the order of keys (as do the 5 whitespace-only (b) files above). One more, `templates/page.zt-chooser-blends.json`, is exactly live-paste-all step 0 in the BF theme, so that kit handles it.
  - `config/settings_data.json`: both themes hold the same settings. The only difference is where the Microsoft Clarity app embed block (switched off in both) sits in the file. **No BF setting differs, so nothing needs setting in Customize from it,** and it is not in the paste list.
  - 3 BF-only files are not needed: `sections/one-scoop-cacao-lp-bf.liquid` (no template uses it), `sections/zt-bf-hero.liquid` and `sections/zt-bf-blends-band.liquid` (only used by two header sections that are switched off in the BF theme since Dana's 17 Nov "one black banner" call).

## Paste order

| Step | File | New, replace or merge | Go-live deadline | Date-gated | What it does | md5 |
|---|---|---|---|---|---|---|
| **Group 1: Black Friday bag landing page (/bf)** | | | | | | |
| BF1 | snippets/zt-bf-bb-extras.liquid | New | 24 Nov | No | Landing page buy box: extra styles and scripts | 7286837e3a2850f865cde33cf37b72ac |
| BF2 | snippets/zt-bf-bb-gallery.liquid | New | 24 Nov | No | Buy box photo gallery | dff63588d56a310aadf4aa52d43d2f84 |
| BF3 | snippets/zt-bf-bb-nutrition.liquid | New | 24 Nov | No | Buy box Nutrition Facts sheet | 456514a4fcacffb6d5f20bac3e7add0c |
| BF4 | snippets/zt-bf-bb-panel.liquid | New | 24 Nov | No | Buy box purchase panel (bags, plans, button; score rounds down) | 90327c4a3079776e079a782688079358 |
| BF5 | snippets/zt-bf-bb-sticky.liquid | New | 24 Nov | No | Buy box sticky offset script | 2859438bcddd3f4864905ee65415d4b6 |
| BF6 | sections/buy-box-cacao-lp-bf.liquid | New | 24 Nov | No | The Black Friday buy box (uses BF1 to BF5) | 3e7214dd886aba7be759a9b457c87fd6 |
| BF7 | sections/bf-countdown-bar.liquid | New | 24 Nov | No (counts down to 30 Nov 11:59 PM, then reads "Black Friday has ended") | Black bar above the hero: "60% off your Starter Kit. Ends in" | 1ca66b338bd7a6adad7244cb5e7fb367 |
| BF8 | sections/hero-banner-cacao-lp-bf.liquid | New | 24 Nov | No | Hero: "Black Friday", "60% off your Zeotein Cacao Starter Kit", $68.99 | e10cd38bf7e5961e48c6c86abf7034a5 |
| BF9 | sections/whats-in-kit-cacao-lp-bf.liquid | New | 24 Nov | No | "What is in the Starter Kit" section | 4f442a61b4b7daea419e64d3a9bd4739 |
| BF10 | sections/cacao-lp-reviews-bf.liquid | New | 24 Nov | No | Reviews section without review counts | 46685cc4616ff18a6e187fd71c1df325 |
| BF11 | sections/header-cacao-lp-bf.liquid | New | 24 Nov | No | Landing page header: logo and cart, no menu | 8ac8515a0112b6a2ba3f1c7d6d8a065a |
| BF12 | sections/header-group-cacao-lp-bf.json | New (a JSON file in Sections) | 24 Nov | No | Header group that holds BF11 | f3e53d1458976c623d7bd08066085a8a |
| BF13 | layout/theme.cacao-lp-bf.liquid | New (layout) | 24 Nov | No | Landing page layout: no store menu or footer, Rewards and chat bubble hidden | fc04fff7f2858ba6d14f11fe9aa3ce4c |
| BF14 | templates/product.cacao-lp-bf.json | New (template), **LAST of group 1** | 24 Nov | No: the bag's page switches the moment this saves | The template the BF bag already asks for (templateSuffix `cacao-lp-bf`). Until it exists, /bf falls back to the plain product page | d0bde3d06b97273a22a40a5c06184f53 |
| **Group 2: review score shows 4.9, not 5.0** | | | | | | |
| BF15 | snippets/cacao-lp-review-score.liquid | Replace | 24 Nov | No | Landing page score text rounds down (4.95 shows 4.9) | 907bd415b98ccbf636d617d940f45bf3 |
| BF16 | sections/buy-box-cacao-lp-v2.liquid | Replace | 24 Nov | No | Cacao landing page buy box score rounds down | 4147fe280c12ef6de83ade75d85480aa |
| BF17 | sections/hero-banner-cacao-lp.liquid | Replace | 24 Nov | No | Cacao landing page hero score rounds down | 3d15c628173b909158f0dbaeaed84460 |
| BF18 | sections/zt-home-hero.liquid | Replace | 24 Nov | No | Homepage hero reads "4.9 from 155 reviews" | b705f0e32846ab62ce05db23cb7e2182 |
| BF19 | snippets/zt-buybox-tidy.liquid (kit file `merged/snippets/zt-buybox-tidy.liquid`) | **Merge** | 24 Nov | No | Live's newer file (277274bc) plus BF's one line: the product page score rounds down | 27c854240f1a86e7838512c58d9ee964 |
| **Group 3: storewide sale banner and sale prices** | | | | | | |
| BF20 | sections/zt-bf-countdown-sitewide.liquid | Replace | 27 Nov | **Yes:** shows 27 Nov 12:00 AM to 30 Nov 11:59 PM CT (dates from BF21), always with `?zt_bf_preview=1` | Black storewide banner with a countdown and "Shop the sale". Also carries the shared sale price styles and the show/hide script for every Black Friday price | 9e03cd966fd64f484263ecca5df48a1f |
| BF21 | sections/header-group.json (kit file `merged/sections/header-group.json`) | **Merge**, right after BF20 | 27 Nov | Yes (it holds BF20's dates) | Live's header group with BF's banner settings: start 27 Nov (live has 24 Nov), "Shop the sale" to Shop All. Ticker and header unchanged | bfc1c54527dad58e88787d882c7b1c6e |
| BF22 | sections/main-product.liquid | Replace | 27 Nov | Yes, through zt-bf-blend-price (shows nothing until D1) | Adds one line: the Black Friday price under the product price | 20c230bc145804766779bbed89198bdf |
| BF23 | snippets/card-product.liquid | Replace | 27 Nov | Yes, the same way | Adds one line: the Black Friday price on product cards | 3c45a1175caf9f60c73deb6d66e33c48 |
| **Dated step (kit file `dated/snippets/zt-bf-blend-price.liquid`)** | | | | | | |
| D1 | snippets/zt-bf-blend-price.liquid | Replace | 27 Nov | **Yes:** Vegan 30 from 24 Nov 12:00 AM, every other sale product from 27 Nov 12:00 AM, all hidden after 30 Nov 11:59 PM CT | The BF theme's full version (BF theme commit cbe952e0): the 30% prices that BF22 and BF23 show, and the first-month subscription price for 27 to 30 Nov. Same Vegan amounts as live-paste-all step 18 | c00b4a1bd3b30d8788408be5cc6415ea |
| **Hold: Stocking Stuffers gift page (only on Dana's OK)** | | | | | | |
| H1 | sections/stocking-gift-lp.liquid | New | Not before Dana's OK (built for 1 to 14 Dec) | No | The gift page | cdb07262e41616d8cbad58f812766ccb |
| H2 | snippets/cart-drawer.liquid | Replace | same | No | Adds the stocking-gift template to the rule that stops cart.js loading twice. Changes nothing on other pages | 95006b9356e0482ab5da19a696d49cec |
| H3 | templates/product.stocking-gift.json | New (template), last | same | No | The template the Stocking Stuffers product already asks for (templateSuffix `stocking-gift`) | 62b85b15cfaf8f19a3517886554bb373 |

### Order rules
- **Group 1:** the snippets, then the sections, then the section group BF12 (it names BF11), then the layout BF13 (it loads BF12), and BF14 last. Shopify refuses to save a template that names a section or layout that doesn't exist yet.
- **BF20, then BF21 straight away.** BF20 brings new banner text ("Black Friday", "30% off storewide") that falls back to built-in defaults until BF21 is in. BF21 also moves the start from 24 Nov to 27 Nov. Done before 24 Nov 12:00 AM, the banner stays hidden throughout. After that time, the banner would read "30% off storewide" with live's 24 Nov start in the minute between the two saves.
- **D1 after BF20,** because BF20 carries the price styles; without them the Black Friday price would show unstyled next to the normal price.
- **D1 after live-paste-all step 18, and never step 18 after D1.** Step 18 pastes the short Vegan-only file; pasted after D1 it would remove every Black Friday price line except the Vegan 30 table.
- **Hold:** H1 and H2 before H3.

### Timing: what changes on 24 to 26 Nov
The recommended plan is to paste groups 1, 2 and 3 and D1 before Tue 24 Nov, 12:00 AM CT. Two things then differ from what live would show today:
1. **The old purple "Black Friday ends in" bar does not show on 24 to 26 Nov.** Live is set today to show Orbit's purple countdown bar ("Black Friday ends in", "Shop blend deals", to /collections/protein-blends) from 24 Nov. BF20 and BF21 replace it with the black banner, which starts 27 Nov. If Dana wants the purple bar during early access, do BF20 and BF21 on Thu 26 Nov in the evening instead, back to back, and D1 after them.
2. **Vegan 30 shows its Black Friday price on its product page and product cards from 24 Nov** (D1), matching its discounts, which start 24 Nov. Today live shows only the Vegan 30 table.

For information: Shopify also has discounts that start 24 Nov:
- for the BF bag and the BF stick packs (`30-day-cacao-stick-packs-black-friday`): "BF Early Access one-time 30% (BF products)" (24 to 26 Nov), "BF Cacao 1 to 4 bags" and "BF Cacao Sticks 2 to 4 packs";
- for the SU-A Active Subscribers segment: "Subscriber Black Friday 30% off".

Apart from /bf, which shows the bag's own prices, the site shows no Black Friday price for these before 27 Nov, in the BF theme too. Checkout applies them anyway.

### D1: the full Black Friday price file
The build instructions said not to include the BF theme's version of `snippets/zt-bf-blend-price.liquid`, because step 18 of live-paste-all replaces that file with the short live version. The full version is still needed on live from 27 Nov:
- BF22 and BF23 call it in "price" mode, and the short version renders nothing in that mode.
- Without D1, the black banner says "30% off storewide" on 27 Nov but no product page or card shows a Black Friday price. Checkout still takes the 30% off.

Source: the BF theme's current file (BF theme commit cbe952e0), md5 `c00b4a1bd3b30d8788408be5cc6415ea`, 14325 bytes, 238 lines, md5 `0df949b0d59e1b4eacd4e7175edd0f67` if the last newline is dropped. Its line 50 reads `assign vegan_off = '4050,8599,13798,19597' | split: ','`, the same amounts as step 18.

**Added 19 Nov, 16:20 UTC** at `dated/snippets/zt-bf-blend-price.liquid`. It is the 17 Nov repo copy (`site-audit/2026-11-17/bf-sub/after-3/`, commit 2bb73ac) with the two 19 Nov Vegan edits: line 50, and the 2 and 3 pack note on line 86. Its md5 is c00b4a1b, the same as Shopify's checksum for the BF theme file read at 16:18 UTC, and 0df949b0 without the final newline.

### Hold: Stocking Stuffers gift page (H1 to H3)
Classed (a) because the BF theme would have taken it live on 27 Nov, but not ready to paste:
- It was built for an ad running 1 to 14 Dec ("AD9"), not for the sale. Its own code comment says "Theme: unpublished 'Black Friday page build 6 Nov' only. Do not copy to MAIN."
- It shows Vegan 7-Day at **$44.99** (chip, total and script). The Vegan 7-Day variant is $39.99 (read 19 Nov), so the page shows more than the cart charges.
- It shows "Free shipping on 2+ pouches (shipping rule still being wired for go-live)." to shoppers, when 2 or 3 pouches are picked.
- It has 4 visible em dashes (copy-rule scan below). The product's own title also has one, between "Stocking Stuffers" and "7-Day Gift".
- Until H3 exists, https://zeotein.com/products/stocking-stuffers-7-day-gift (unlisted, $0.00 shell) shows the default product page.

### Checks per file

- **Lines after:** what the code editor shows after pasting. Its last line number is this number, or this number plus 1.
- **Lines on live now:** the BEFORE check for a replace or merge. If live shows another count, live has changed since 19 Nov: stop.
- **md5 if the last newline is dropped:** the code editor may drop the final newline, as it did on 19 Nov. A file with this md5 is still an exact paste.

| Step | Lines after | Bytes | md5 of the kit file | md5 if the last newline is dropped | Live now: lines, md5 |
|---|---|---|---|---|---|
| BF1 | 141 | 3709 | 7286837e3a2850f865cde33cf37b72ac | 75a9393314211fa72cf48bc82ccef88e | new |
| BF2 | 90 | 3732 | dff63588d56a310aadf4aa52d43d2f84 | d0990c18c7be469f3dd90b48b46b18fc | new |
| BF3 | 89 | 3907 | 456514a4fcacffb6d5f20bac3e7add0c | ab67f47e2c1a91a6d95a38abd086fe36 | new |
| BF4 | 203 | 12154 | 90327c4a3079776e079a782688079358 | 70bc0a0b100d83e61a163a81cb3f12d9 | new |
| BF5 | 66 | 2211 | 2859438bcddd3f4864905ee65415d4b6 | same (file has no final newline) | new |
| BF6 | 186 | 11006 | 3e7214dd886aba7be759a9b457c87fd6 | 6e047d4608e9bc0f324d4b0b3cad2066 | new |
| BF7 | 189 | 6564 | 1ca66b338bd7a6adad7244cb5e7fb367 | same (file has no final newline) | new |
| BF8 | 1911 | 56035 | e10cd38bf7e5961e48c6c86abf7034a5 | 869807f61de6cd0f6e55bb5cedd1aaff | new |
| BF9 | 137 | 9492 | 4f442a61b4b7daea419e64d3a9bd4739 | 7456466742fa3f6ad6fa6a1508dfc47e | new |
| BF10 | 340 | 11730 | 46685cc4616ff18a6e187fd71c1df325 | 7f0ef78ef31a804288d258ae7786fcc9 | new |
| BF11 | 358 | 10516 | 8ac8515a0112b6a2ba3f1c7d6d8a065a | 1cbfea54ac89b65884031d628d47482c | new |
| BF12 | 16 | 318 | f3e53d1458976c623d7bd08066085a8a | 8bfb2ac86eb1579dcb02bb74a10e1f77 | new |
| BF13 | 453 | 25617 | fc04fff7f2858ba6d14f11fe9aa3ce4c | 5aa44a75b26186e8c75b3a8f2bed0aaf | new |
| BF14 | 10 | 38709 | d0bde3d06b97273a22a40a5c06184f53 | acc9f07ce7559564b5bc8a4957cdace9 | new |
| BF15 | 65 | 2251 | 907bd415b98ccbf636d617d940f45bf3 | 0d280d231a26e536a6875acace95177c | 65, 2af2b03bcab6a62bec5e939253b3c7dc |
| BF16 | 1051 | 44203 | 4147fe280c12ef6de83ade75d85480aa | 13867212b49a340f076ddfb542876cbd | 1051, 719401c142db5542896eb2701d6348df |
| BF17 | 1870 | 54516 | 3d15c628173b909158f0dbaeaed84460 | 51f83bb999e31ca0b657b9d3ae708491 | 1870, fcf0a6ae657a18fa6d443dd946abb27a |
| BF18 | 271 | 7924 | b705f0e32846ab62ce05db23cb7e2182 | 0374d511f8b4e8478578a9740b0042f8 | 271, f6b594d323c5f9bdd05d5e531f7fc204 |
| BF19 | 705 | 44815 | 27c854240f1a86e7838512c58d9ee964 | same (file has no final newline) | 705, 277274bcbd8bdf289c876875b02bdfdd |
| BF20 | 186 | 13204 | 9e03cd966fd64f484263ecca5df48a1f | 1ea82ed34fd06fe7e656e9a5068f38a8 | 143, 5a147c263199413d4ec5a6088c192259 |
| BF21 | 187 | 5524 | bfc1c54527dad58e88787d882c7b1c6e | same (file has no final newline) | 185, 9260234e47a63a9f06a91baa82a87056 |
| BF22 | 2269 | 98692 | 20c230bc145804766779bbed89198bdf | 11830c37f29681476112391c5c4bbd0d | 2268, 3653e1df1ffe0336b4b1ef8a61f04294 |
| BF23 | 625 | 34284 | 3c45a1175caf9f60c73deb6d66e33c48 | 9b2ae4c8b17fc6a29f10d36772a0e17a | 624, 6d89659cf62264bdb2aa59bffd19eb6e |
| D1 | 238 | 14325 | c00b4a1bd3b30d8788408be5cc6415ea | 0df949b0d59e1b4eacd4e7175edd0f67 | 71, 7009330d7158f47abec4f746693f039b once step 18 is in (a99c6fc3d942b7b482f3636cf96f8abe before it) |
| H1 | 327 | 10898 | cdb07262e41616d8cbad58f812766ccb | 03fbd5a9a17c73af1bcc262ceee7d1f9 | new |
| H2 | 587 | 30218 | 95006b9356e0482ab5da19a696d49cec | 2290f4cf44d271e25e7c151a3bb31a07 | 587, 741d42c050ae30610dfda9fbfedcbfb0 |
| H3 | 12 | 176 | 62b85b15cfaf8f19a3517886554bb373 | 45f1c9832380636cb27575854773a293 | new |

**How the files were read.** Every kit file outside `merged/` is the BF theme's file exactly as read with a read-only GraphQL query, and matches Shopify's md5 and byte size for it. JSON headers:
- `sections/header-group-cacao-lp-bf.json` and `templates/product.stocking-gift.json` are stored without Shopify's 9-line "IMPORTANT: The contents of this file are auto-generated" comment. The API puts the comment in front of the body, so these kit files leave it out, as the stored files do.
- `templates/product.cacao-lp-bf.json` and `sections/header-group.json` are stored with the comment, so those kit files keep it.
- If the code editor shows, adds or reformats a JSON file's comment or layout on Save, that's fine as long as Shopify shows no error.

**The replaced files are BF's file, not merges, because live has no change of its own in them.** Apart from the final newline, each BF15 to BF18, BF20 to BF23 and H2 file is live's current file plus only the BF change:
- BF15 to BF18: one rounding line each, at lines 37, 325, 39 and 7;
- BF22: line 117 added;
- BF23: line 208 added;
- BF20: rewritten by BF;
- H2: line 14.

Live's copies of these files have not been saved since the 17 Nov copy (02:34 to 03:10 UTC).

**How the two merges were built** (from live's exact bytes):
- **BF19** `snippets/zt-buybox-tidy.liquid`: live 277274bc with line 82 `assign shown = avg | round: 1` changed to BF's `assign shown = avg | times: 10 | floor | divided_by: 10.0`. Nothing else changed. The result equals the BF file minus its final newline.
- **BF21** `sections/header-group.json`: live 9260234e with only the `zt_bf_countdown` settings replaced by BF's:
  - title "Black Friday", offer "30% off storewide", fine print empty, label "Ends in";
  - button "Shop the sale" to /collections/shop-all;
  - start 1795759200 (27 Nov 12:00 AM CT; live has 1795500000, 24 Nov), end 1796104740 (30 Nov 11:59 PM CT, unchanged);
  - background #0B0B0D (live #171320), accent #32BAC0.

  Parsed, the merged file equals live's except that block, and the block equals BF's. Two BF changes were left out on purpose:
  1. **The ticker switched off** (with its Black Friday texts). In the file it is static, so the purple ticker would vanish the moment the file is saved, days early. It's a Customize step on 27 Nov instead (below).
  2. **The `bf_hero` and `zt_bf_blends` sections.** They are switched off in the BF theme and would need two more BF-only files.

**Files that both themes changed but need no merge:**
- `templates/index.json`: every BF change sits in 6 homepage sections that are switched off on both themes (Howie offer buttons changed to "Shop the sale"), plus the hero set to another upload of the same photo. Pasting it would change nothing visible and would put the whole homepage file at risk. Keep live's.
- `config/settings_data.json`: no setting differs (see above).
- `snippets/cart-drawer.liquid`: live has no change of its own, so H2 is a plain replace.

## Customize settings (by hand, Dana)

Customize edits on the live theme go live on Save, with no publish. The Chrome session doesn't do these.

1. **From config/settings_data.json: none.** The two themes hold the same theme settings and app embeds.
2. **Purple ticker during the sale (optional, Fri 27 Nov from 12:00 AM CT).** In the BF theme the header's purple ticker ("Simple on purpose. Zero sugar. ...") is switched off for the sale, per Dana's 17 Nov call for one black banner on top. BF21 keeps it on.
   - To match the BF look: Online Store > Themes > "Zeotein live theme - edit this one directly" > Customize. In the left panel under Header, find the ticker section, "Marquee announcement" (it may show as "Announcement"). Click its eye icon to hide it, then Save.
   - On 1 Dec, show it again the same way.
3. **Fallback for BF21 only:** use this if the merged header group can't be pasted, or the live header has changed since 19 Nov. After BF20, Customize > Header > "BF banner (sitewide)":

   | Setting | Value |
   |---|---|
   | Title | Black Friday |
   | Offer (shown in the accent color) | 30% off storewide |
   | Fine print (leave blank for none) | (empty) |
   | Countdown label (desktop) | Ends in |
   | Button text | Shop the sale |
   | Button link | /collections/shop-all |
   | Show from (Unix seconds) | 1795759200 |
   | Count down to (Unix seconds) | 1796104740 |
   | Background | #0B0B0D |
   | Accent and button color | #32BAC0 |

   Save, right after BF20.

## 1 Dec removal list

| What | What happens by itself | What to do on Tue 1 Dec |
|---|---|---|
| Black banner (BF20, BF21) | Hides at 30 Nov 11:59 PM CT | Nothing. Optional: Customize > Header > "BF banner (sitewide)" > hide. Keep the file: it also runs the show/hide for every Black Friday price |
| Purple ticker | - | If it was hidden on 27 Nov, show it again (Customize > Header > "Marquee announcement" > eye icon > Save) |
| Black Friday prices on product pages and cards (BF22, BF23, D1) and the Vegan 30 table | Hide at 30 Nov 11:59 PM CT | Nothing. They never show outside the sale window, so the files can stay |
| BF bag landing page (/bf, BF1 to BF14) | **Does not switch off.** After 30 Nov the bar reads "Black Friday has ended", but the hero still says "60% off" and $68.99, and the bag's plans still give $68.99 on the first order | Dana's call (product and pricing): set "30-Day Cacao Bulk Bag - Black Friday" to Draft, and point the `/bf` redirect elsewhere or delete it (Online Store > Navigation > URL Redirects). The 14 theme files can stay, since they only render for that product. To delete them anyway: BF14 first, then BF13, BF12, the sections, the snippets |
| Stocking Stuffers page (H1 to H3), if pasted | - | Runs 1 to 14 Dec. Afterwards set its product to Draft. Leave H2: it only skips a duplicate cart.js |
| Review score rounding (group 2) | - | Keep. It's a permanent fix |

## Page checks

Open each page on a computer and a phone. In every page source (right-click > View page source), "Liquid error" must give 0 results.

**Preview switch:** adding `?zt_bf_preview=1` to a store page shows the Black Friday banner and price lines before their start time, for that browser tab only. Always end with `?zt_bf_preview=0`, which switches it off again.

| After | Open | What should be visible |
|---|---|---|
| BF14 (group 1) | **https://zeotein.com/bf** (it redirects to /products/30-day-cacao-bulk-bag-black-friday) | **The Black Friday landing page, not the plain product page.** Look for:<br>- a black bar with a "Black Friday" tag, "60% off your Starter Kit. Ends in" and a running clock;<br>- the hero "Black Friday", "60% off your Zeotein Cacao Starter Kit", "$68.99 your first order", "Get My Black Friday Kit" and "Renews at $99.99. First-time subscribers only.";<br>- no store menu and no footer, only the logo and the cart.<br>**Fail:** the store menu (Home, About Zeotein, Shop...), the purple "Simple on purpose." ticker, "$109.99" or "Add to cart" mean the plain page.<br>Page source: `zt-bf-lp-chrome-lock` is found.<br>Optional, by a person: add 1 bag in the buy box, the cart drawer opens with it; remove it, and don't check out |
| BF19 (group 2) | https://zeotein.com/ | Hero line "4.9 from 155 reviews" (today: "5.0 from 155 reviews") |
| BF19 (group 2) | https://zeotein.com/products/cacao-protein-starter-kit | "4.9 stars" in the hero and "4.9/5.0 (155 Reviews)" in the buy box. Never "5.0 stars" or "5.0/5.0" (today it shows "5.0 stars" twice and "5.0/5.0 (155 Reviews)") |
| BF19 (group 2) | https://zeotein.com/products/zeotein-cacao-bag-30 | Rating line "4.9 from verified buyers", as before |
| BF21 (group 3) | https://zeotein.com/ | No Black Friday banner (correct until 27 Nov). Page source has `data-ztbf-start="1795759200"` (before BF21 it had `1795500000`) |
| BF21 (group 3) | https://zeotein.com/?zt_bf_preview=1, then https://zeotein.com/?zt_bf_preview=0 | With preview: black banner "BLACK FRIDAY 30% OFF STOREWIDE", "Ends in", a countdown and a teal "Shop the sale" button to Shop All. The free-shipping bar above it turns black. The purple ticker is still there. After `=0`: no banner |
| BF23 | https://zeotein.com/products/zeotein-cacao-bag-30 and https://zeotein.com/collections/shop-all | Look exactly as before. Black Friday prices need D1 |
| D1 | https://zeotein.com/collections/shop-all?zt_bf_preview=1 | Each sale product card: the regular price struck through and a purple Black Friday price. The gift card shows only its normal price |
| D1 | https://zeotein.com/products/zeotein-cacao-bag-30?zt_bf_preview=1 | Under the price, the regular price struck through and a purple Black Friday price |
| D1 | https://zeotein.com/products/zeotein-vegan-sticks-30?zt_bf_preview=1 | The table shows $94.49, $183.99, $266.99 and $343.99 |
| D1 | https://zeotein.com/?zt_bf_preview=0 | Preview off. Nothing shows before 24 Nov |
| H3 (hold only) | https://zeotein.com/products/stocking-stuffers-7-day-gift | "Gift a 7-Day pouch" with Cacao and Vegan chips. Page source: no "Liquid error" and no "has already been declared" error in the browser console |
| Tue 24 Nov, after 12:00 AM | https://zeotein.com/bf | The landing page as above, with the clock running |
| Tue 24 Nov, after 12:00 AM | https://zeotein.com/products/zeotein-vegan-sticks-30 | The Black Friday table. With D1 in: the Black Friday price under the price while One-time is picked, and on its product cards |
| Tue 24 Nov, after 12:00 AM | https://zeotein.com/ | No banner (unless BF20 and BF21 were kept for 26 Nov, in which case the purple bar shows) |
| Fri 27 Nov, after 12:00 AM | https://zeotein.com/ (no preview), any product page and Shop All | The black banner on every store page. It doesn't show on /bf or the Cacao landing page, which have their own layouts. Product pages and cards show Black Friday prices |
| Tue 1 Dec | https://zeotein.com/ and Shop All | No banner and no Black Friday price lines. Then do the 1 Dec list |

## Click steps in Shopify

1. Open Shopify admin (https://admin.shopify.com/store/wmzz7i-xw), then **Online Store > Themes**.
2. On **"Zeotein live theme - edit this one directly"** (the current theme), click **...** and then **Edit code**. Check that the code editor's top bar shows that theme's name.
   - Never click Publish.
   - Don't open "Black Friday Store 2026 (draft, publish Nov 27)" or any "Do not publish - source" theme.
3. Work through the steps in the order of the table, one file at a time.
4. **Get the kit file:** open its raw link (below) in a new tab. Press Ctrl+A then Ctrl+C (Cmd+A, Cmd+C on a Mac).
5. **New file:** use the folder's **Add a new snippet**, **Add a new section**, **Add a new layout** or **Add a new template**. In the newer editor, hover the folder name and click **+**.
   - Snippets, sections and layouts: type the name without the folder, for example `zt-bf-bb-extras.liquid` or `theme.cacao-lp-bf`. If the box adds `.liquid` itself, leave it off.
   - BF12 is a JSON file in Sections: type `header-group-cacao-lp-bf.json`, and choose JSON if the box offers Liquid or JSON. If the editor can't make a JSON file there, stop.
   - BF14 and H3 are templates: choose "product", type JSON, and name them `cacao-lp-bf` and `stocking-gift`.
   - Then check that the file list shows exactly the path from the table, with no `.liquid.liquid` or `.json.liquid`.
6. **Existing file (replace or merge):** open it, do the BEFORE check (Lines on live now, and the line quoted in the prompt), then back it up before changing anything.
   - To back up: click in the code, press Ctrl+A and Ctrl+C, and save the text as a plain-text file named after the path and the day, for example `sections__main-product.liquid.live-backup-2026-11-22.txt`.
   - Shopify also keeps earlier saves under **Older versions**. That's a second fallback, not the backup.
7. **Paste:** click in the code area, press Ctrl+A, then Ctrl+V. Check the last line number (Lines after) and that the last line matches the raw file.
8. **Save** with the Save button or Ctrl+S, and wait for the save to finish.
   - If Shopify shows any error, stop and don't go on.
   - If a page looks broken, paste the backup back in.
9. After each group, do that group's page checks.

## Raw links

`https://raw.githubusercontent.com/zeotein/zeotein-theme/ab932f284e2d99e91c7d9387c4df9a02ef8006ee/site-audit/2026-11-19/bf-live-paste/<kit path>`

`<kit path>` is the theme path, except:
- BF19: `merged/snippets/zt-buybox-tidy.liquid`;
- BF21: `merged/sections/header-group.json`;
- D1: `dated/snippets/zt-bf-blend-price.liquid`.

For example: `https://raw.githubusercontent.com/zeotein/zeotein-theme/ab932f284e2d99e91c7d9387c4df9a02ef8006ee/site-audit/2026-11-19/bf-live-paste/snippets/zt-bf-bb-extras.liquid`.

`ab932f284e2d99e91c7d9387c4df9a02ef8006ee` is filled in after the push. If a raw link shows 404, open the same path on github.com (`https://github.com/zeotein/zeotein-theme/blob/ab932f284e2d99e91c7d9387c4df9a02ef8006ee/site-audit/2026-11-19/bf-live-paste/<kit path>`) and click **Raw**.

## Prompt for Dana's Claude in Chrome session

Copy everything in the box and paste it into Claude in Chrome on the laptop, with Shopify admin signed in.

```text
You are in Dana's Chrome on her laptop, signed in to Shopify admin for zeotein.com:
https://admin.shopify.com/store/wmzz7i-xw
Your job: paste the Black Friday files into the LIVE theme's code, one file at a time, in exactly the order below.
Dana's rule since 19 Nov: edits go straight into the live theme, and no theme is ever published.

RULES (follow all of them):
1. Work only in the theme "Zeotein live theme - edit this one directly" (the current theme):
   Online Store > Themes > on that theme click "..." > Edit code. Check that the editor's top bar shows that name.
2. Never click Publish on any theme. Never open or edit "Black Friday Store 2026 (draft, publish Nov 27)" or any
   theme named "Do not publish - source: ...". Do not use Customize. Do not change any file, setting or product
   that is not in the list below.
3. One file at a time: create or open it, paste, Save, confirm the save finished, and only then move on.
4. Back up every REPLACE and MERGE file before you change it. With the file open, click in the code, press Ctrl+A and
   Ctrl+C (Cmd on a Mac), and save that text as a plain-text file in the laptop's Downloads folder, named
   like sections__main-product.liquid.live-backup-2026-11-22.txt (the path with "/" replaced by "__", and today's date).
   If you have no way to save a file yourself, stop and ask Dana to save it, then wait for her OK.
5. Before you back up and paste a REPLACE or MERGE file, do its BEFORE check (line count and the quoted line).
   If it does not match, live was changed after 19 Nov: stop.
6. STOP at the first error of any kind and tell Dana exactly what you saw. Errors include:
   - Shopify shows an error after Save;
   - a raw link does not load or is not plain text;
   - a NEW file name already exists, or the editor cannot create that kind of file;
   - a BEFORE check, the line count or the last line does not match;
   - a page check fails, or "Liquid error" appears in the page source;
   - the screen does not match these steps.
   Do not retry, guess or work around it.
7. Never type file contents yourself. Always copy the whole raw file and paste it.
8. Do groups 1, 2 and 3 in order. Do D1 only when its conditions below are met. Never do H1 to H3 unless Dana
   tells you in this chat to do the Stocking Stuffers page.

THE KIT FILES. BASE = https://raw.githubusercontent.com/zeotein/zeotein-theme/ab932f284e2d99e91c7d9387c4df9a02ef8006ee/site-audit/2026-11-19/bf-live-paste/
For each step, open BASE + kit path in a new tab. Check that it shows plain text. Press Ctrl+A, Ctrl+C.
(If it shows 404, open https://github.com/zeotein/zeotein-theme/blob/ab932f284e2d99e91c7d9387c4df9a02ef8006ee/site-audit/2026-11-19/bf-live-paste/ + kit path
and click Raw.) The kit path is the theme path, unless the step gives another one.

HOW TO DO ONE STEP:
a. Copy the raw file as above.
b. NEW: in the code editor's file list, use the folder's "Add a new snippet", "Add a new section", "Add a new layout"
   or "Add a new template" (newer editor: hover the folder name, click +). Type the file name without the folder.
   If the box adds .liquid itself, leave the extension off. Check that the file list then shows exactly the path below.
   REPLACE or MERGE: open the existing file, do the BEFORE check (rule 5), then back it up (rule 4).
c. Click in the code area, press Ctrl+A, then Ctrl+V.
d. Check: the last line number is the given count (or count + 1), and the last line matches the raw file.
   JSON files: Shopify may reformat them when it saves; a different count after Save is fine if Shopify shows no error.
e. Click Save and wait for the save to finish.
f. Note the step number and the time it saved.

STEPS (theme path | NEW, REPLACE or MERGE | lines after paste)
GROUP 1, BLACK FRIDAY BAG LANDING PAGE (must be saved before Tue 24 Nov, 12:00 AM CT)
BF1  snippets/zt-bf-bb-extras.liquid | NEW | 141
BF2  snippets/zt-bf-bb-gallery.liquid | NEW | 90
BF3  snippets/zt-bf-bb-nutrition.liquid | NEW | 89
BF4  snippets/zt-bf-bb-panel.liquid | NEW | 203
BF5  snippets/zt-bf-bb-sticky.liquid | NEW | 66
BF6  sections/buy-box-cacao-lp-bf.liquid | NEW | 186
BF7  sections/bf-countdown-bar.liquid | NEW | 189
BF8  sections/hero-banner-cacao-lp-bf.liquid | NEW | 1911
BF9  sections/whats-in-kit-cacao-lp-bf.liquid | NEW | 137
BF10 sections/cacao-lp-reviews-bf.liquid | NEW | 340
BF11 sections/header-cacao-lp-bf.liquid | NEW | 358
BF12 sections/header-group-cacao-lp-bf.json | NEW | 16
     A JSON file in Sections: type the full name header-group-cacao-lp-bf.json; if the box offers Liquid or JSON,
     choose JSON. The file list must show sections/header-group-cacao-lp-bf.json (not .json.liquid).
BF13 layout/theme.cacao-lp-bf.liquid | NEW | 453
     Layout > "Add a new layout", name theme.cacao-lp-bf.
BF14 templates/product.cacao-lp-bf.json | NEW | 10 (LAST of group 1)
     Templates > "Add a new template": choose "product", type JSON, name cacao-lp-bf. The file list must show
     templates/product.cacao-lp-bf.json. Press Ctrl+A over the starter text, then paste. Line 10 is very long and
     ends with "sticky_offer_cacao_lp_raf1"]}
   CHECK: https://zeotein.com/bf (it redirects to /products/30-day-cacao-bulk-bag-black-friday) shows the Black Friday
   landing page: a black bar with a "Black Friday" tag, "60% off your Starter Kit. Ends in" and a running clock; the
   hero "60% off your Zeotein Cacao Starter Kit" with "$68.99" and the button "Get My Black Friday Kit"; no store menu
   and no footer, only the logo and the cart. It FAILS if you see the store menu (Home, About Zeotein, Shop ...), the
   purple "Simple on purpose." ticker, "$109.99" or "Add to cart": that is the plain product page.
   Page source: "zt-bf-lp-chrome-lock" is found.
GROUP 2, REVIEW SCORE 4.9 INSTEAD OF 5.0 (must be saved before Tue 24 Nov, 12:00 AM CT)
BF15 snippets/cacao-lp-review-score.liquid | REPLACE | 65
     BEFORE: 65 lines; line 37 ends "times: 10 | round". After the paste it ends "times: 10 | floor".
BF16 sections/buy-box-cacao-lp-v2.liquid | REPLACE | 1051
     BEFORE: 1051 lines; line 325 ends "times: 10 | round". After: "times: 10 | floor".
BF17 sections/hero-banner-cacao-lp.liquid | REPLACE | 1870
     BEFORE: 1870 lines; line 39 ends "plus: 0 | round: 1". After: "times: 10 | floor | divided_by: 10.0".
BF18 sections/zt-home-hero.liquid | REPLACE | 271
     BEFORE: 271 lines; line 7 ends "times: 1.0 | round: 1". After: "times: 10 | floor | divided_by: 10.0".
BF19 snippets/zt-buybox-tidy.liquid | MERGE | 705 | kit path: merged/snippets/zt-buybox-tidy.liquid
     BEFORE: 705 lines; line 82 reads "assign shown = avg | round: 1". After: "assign shown = avg | times: 10 | floor | divided_by: 10.0".
   CHECK: https://zeotein.com/ hero line reads "4.9 from 155 reviews" (before: "5.0 from 155 reviews").
   https://zeotein.com/products/cacao-protein-starter-kit shows "4.9 stars" in the hero and "4.9/5.0 (155 Reviews)"
   in the buy box, and never "5.0 stars" or "5.0/5.0".
GROUP 3, STOREWIDE SALE BANNER AND SALE PRICES (must be saved before Fri 27 Nov, 12:00 AM CT; they stay hidden until then)
BF20 sections/zt-bf-countdown-sitewide.liquid | REPLACE | 186
     BEFORE: 143 lines; line 2 starts "Sitewide Black Friday countdown (Orbit, Nov 15 2026)".
BF21 sections/header-group.json | MERGE | 187 | kit path: merged/sections/header-group.json
     Do it right after BF20.
     BEFORE: 185 lines; the "zt_bf_countdown" block reads "cta_text": "Shop blend deals" and "start_epoch": 1795500000.
     After: "cta_text": "Shop the sale" and "start_epoch": 1795759200.
   CHECK: https://zeotein.com/ shows no Black Friday banner (correct until 27 Nov), and its page source has
   data-ztbf-start="1795759200". Then open https://zeotein.com/?zt_bf_preview=1: a black banner
   "BLACK FRIDAY 30% OFF STOREWIDE" with "Ends in", a countdown and a teal "Shop the sale" button, and the
   free-shipping bar above it turns black. Then open https://zeotein.com/?zt_bf_preview=0: the banner must be gone.
BF22 sections/main-product.liquid | REPLACE | 2269
     BEFORE: 2268 lines. After: line 117 reads {%- render 'zt-bf-blend-price', product: product, mode: 'price', pdp: true -%}
BF23 snippets/card-product.liquid | REPLACE | 625
     BEFORE: 624 lines. After: line 208 reads {% render 'zt-bf-blend-price', product: card_product, mode: 'price' %}
   CHECK: https://zeotein.com/products/zeotein-cacao-bag-30 and https://zeotein.com/collections/shop-all look the
   same as before (no Black Friday price yet; that needs D1).
DATED STEP D1 (must be saved before Fri 27 Nov, 12:00 AM CT). Do it only if all three are true:
   - Dana confirms step 18 of the live-paste-all kit is done: snippets/zt-bf-blend-price.liquid on live has
     71 lines and line 34 reads   assign vegan_off = '4050,8599,13798,19597' | split: ','
   - BF20 is saved;
   - BASE + dated/snippets/zt-bf-blend-price.liquid opens as plain text.
   If any is not true, skip D1 and tell Dana.
D1   snippets/zt-bf-blend-price.liquid | REPLACE | 238 | kit path: dated/snippets/zt-bf-blend-price.liquid
     BEFORE: as in the first condition. After: line 2 starts "zt-bf-blend-price (Orbit, Nov 15 2026). Shows the real
     Black Friday price" and line 50 reads   assign vegan_off = '4050,8599,13798,19597' | split: ','
   CHECK: https://zeotein.com/collections/shop-all?zt_bf_preview=1 shows each sale product's regular price struck
   through and a purple Black Friday price; the gift card shows only its normal price.
   https://zeotein.com/products/zeotein-vegan-sticks-30?zt_bf_preview=1 still shows the table $94.49, $183.99, $266.99
   and $343.99. Then open https://zeotein.com/?zt_bf_preview=0.
HOLD GROUP (only if Dana tells you in this chat to do the Stocking Stuffers page)
H1   sections/stocking-gift-lp.liquid | NEW | 327
H2   snippets/cart-drawer.liquid | REPLACE | 587
     BEFORE: 587 lines; line 14 reads {%- unless template.suffix contains 'cacao-lp' -%}
H3   templates/product.stocking-gift.json | NEW | 12 (LAST: "Add a new template", product, JSON, name stocking-gift)
   CHECK: https://zeotein.com/products/stocking-stuffers-7-day-gift shows "Gift a 7-Day pouch" with Cacao and Vegan chips.

AFTER EVERY CHECK: open the page source (right-click > View page source), search "Liquid error": it must be 0.

NEVER: paste any other file from the Black Friday theme, paste step 18 of live-paste-all after D1, or publish a theme.

REPORT: after each group, and when you finish or stop, give Dana one line: the steps done, the save times,
and any error. If you have the send_message tool, also send that line to session_01D28ukaCB7Cnc3EGQpjbouB.
```

## Copy-rule scan

All 27 kit files were searched, code included. D1 was added after the first scan and checked the same way: its only hit is the product handle `zeolite` in a code list, which is never shown. The searches covered:
- em dashes (the character itself, `&mdash;`, `&#8212;`, `&#x2014;` and its backslash-u escape);
- "complete protein";
- "zeolite";
- "5.0" and five-star wording;
- "tub" or "tubs".

Each hit was sorted as customer-visible or not. Nothing was edited, so every md5 above is the file exactly as read (or merged).

"Already live" below means the hit is on a line the kit doesn't change: BF16 and BF19 are live's own files plus one rounding line.

| Rule | Visible | Not visible |
|---|---|---|
| Em dashes | **Hold group only, 4 hits:** `sections/stocking-gift-lp.liquid`, all visible on the Stocking Stuffers page (shown here as [em dash]):<br>- line 196: "...seven single-serve stick packs [em dash] one pouch that fits in a stocking.";<br>- lines 199 and 245: "Six real ingredients [em dash] that's the whole list";<br>- line 251: "Pumpkin seed & hemp [em dash] clean and simple".<br>The paste-order files have none. | Code comments: `header-cacao-lp-bf.liquid` lines 2, 163 and 269, `layout/theme.cacao-lp-bf.liquid` line 449, `stocking-gift-lp.liquid` lines 1 and 3.<br>Theme editor help text: `header-cacao-lp-bf.liquid` line 317.<br>A script pattern: `cacao-lp-reviews-bf.liquid` line 193 (the backslash-u escape for an em dash, inside a regular expression) |
| "complete protein" | `sections/buy-box-cacao-lp-v2.liquid` (BF16) line 301: "23g complete protein" in the Cacao landing page buy box's image benefit list. **Already live.** Not shown today: on 19 Nov at 16:20 UTC the phrase was not on https://zeotein.com/products/cacao-protein-starter-kit, and the BF landing page uses its own buy box (BF6) with image benefits off. No change made. | Same file, lines 736 (setting default) and 977 (preset): "23g of complete protein in every serving". Only shown if a template leaves that setting empty |
| "zeolite" | BF16 line 535 "Zeolite Mineral" (What's Inside chip), and lines 587 and 1030 "Zeolite (Clinoptilolite)" (ingredient statement). **Already live.** The BF landing page itself has none | `hero-banner-cacao-lp.liquid` (BF17) lines 1796 (default) and 1852 (preset): "...sea moss and zeolite." For information: the live template `templates/product.cacao-lp.json` (not in this kit) sets that same subtext, so the Cacao landing page hero shows it today |
| "5.0" stars | Group 2 removes them: after it, 4.95 shows as 4.9 everywhere. Still visible: "5.0" as the scale in "4.9/5.0 (155 Reviews)" (BF16 line 333, BF15 line 57) | Fallback texts used only when the Judge.me score is missing: BF17 lines 1789 and 1845 ("5.0 stars"), BF16 line 717 ("5.0/5.0 (149 Reviews)"), BF15 comment lines 10 to 12. Code: BF19 line 83 (`divided_by: 5.0`) |
| Five-star wording | BF19 line 575: `aria-label="5 out of 5 stars"` on each customer quote (screen readers). **Already live.** Five star symbols before the score: BF18, BF16, BF19 (3 places), BF4. Same as the other kit, where they were noted for information | none |
| Tub | `templates/product.cacao-lp-bf.json` (BF14): the review title "Better value than stacking tubs" and the comparison column "multiple supplement tubs". Neither is a count. Both texts are already live on the Cacao landing page (`templates/product.cacao-lp.json`). Dana's call | none |
| For information | The BF landing page's "What people like you are saying." section shows a fixed "4.98 stars" (Judge.me reads 4.95). En dashes: "10–12 oz" (BF16, BF3), "Ships in 1&ndash;2 business days" (BF19, already live), and `&ndash;` in the page title (BF13) | |

## Do not paste the BF copy of these files

Never copy the BF theme over live as a whole. These files differ, but the BF copy must not go over live:
- the (b) files above;
- `templates/index.json`, `config/settings_data.json`;
- `templates/page.zt-chooser-blends.json` (use live-paste-all steps 0 and 7b);
- `sections/zt-blend-chooser.liquid` (live-paste-all step 7 replaces it);
- `assets/zt-guides-cart.js`;
- the 3 unused BF-only sections;
- every noise file in the appendix.

The files in live-paste-all (FAQ, gifts, Difference page) are not in the BF theme at all, so the BF theme is now behind live there too.

**The 26 Nov scheduled check** "BF theme pre-launch sync check" (trig_01Qs4TUWYcWbq5RhYNq7uv7X, 26 Nov 2:13 PM CT) was changed on 19 Nov: it no longer builds its own list. It checks which steps of this kit and of `site-audit/2026-11-19/live-paste-all/` are saved on live, and tells Dana what is still missing before 27 Nov. A first check runs on Mon 23 Nov, before the 24 Nov steps are due.

## Appendix: all 70 files that differ

Classes: (a) BF content for live, (b) live change the BF theme lacks, (c) noise. md5 and last save (UTC) as read on 19 Nov.

| File | In | BF theme md5 (saved) | Live md5 (saved) | Class | Step | Note |
|---|---|---|---|---|---|---|
| assets/cacao-lp-gift-guard.js | both | a0e0f564 (11-19 01:46) | d34bd9ef (11-19 02:09) | b | - | Live is newer (19 Nov 02:09 UTC). The only difference is the final line ending. Keep live |
| assets/zt-giftcard-gift.js | both | 4252b121 (11-15 15:29) | ee5aac7d (11-17 02:34) | c | - | Final newline only |
| assets/zt-guides-cart.js | both | 6d631ec0 (11-16 14:59) | a272997b (11-17 02:34) | c | - | Code comments only; live has the newer comments. Keep live |
| assets/zt-sub-bf-gift.js | both | 461ccf5e (11-15 21:15) | 1562a40c (11-17 02:34) | c | - | Final newline only |
| config/settings_data.json | both | 18f2f6b1 (11-17 12:56) | af67729c (11-17 12:55) | c | - | Same settings. Only the position of the Microsoft Clarity app embed block (off in both) differs. Nothing to set |
| layout/theme.cacao-lp-bf.liquid | BF only | fc04fff7 (11-15 22:21) | - | a | BF13 | Landing page layout: logo and cart only, no menu or footer |
| layout/theme.liquid | both | 0924a5d4 (11-17 03:30) | f1f32389 (11-17 03:10) | c | - | Indentation of one line |
| sections/_blocks.liquid | both | 6917fec6 (11-17 14:17) | 7abd8d7e (11-19 02:48) | b | - | Pasted into live 19 Nov 02:48 UTC; final newline only |
| sections/bf-countdown-bar.liquid | BF only | 1ca66b33 (11-15 21:31) | - | a | BF7 | Black bar on the landing page counting down to 30 Nov 11:59 PM CT |
| sections/buy-box-cacao-lp-bf.liquid | BF only | 3e7214dd (11-15 20:51) | - | a | BF6 | Landing page buy box |
| sections/buy-box-cacao-lp-v2.liquid | both | 4147fe28 (11-17 14:09) | 719401c1 (11-17 02:34) | a | BF16 | Review score rounds down (4.9, not 5.0). Otherwise identical |
| sections/cacao-lp-reviews-bf.liquid | BF only | 46685cc4 (11-15 22:54) | - | a | BF10 | Landing page reviews |
| sections/header-cacao-lp-bf.liquid | BF only | 8ac8515a (11-13 18:56) | - | a | BF11 | Landing page header (logo and cart) |
| sections/header-cacao-lp.liquid | both | 0eb9f08d (11-13 18:57) | 070260ae (11-17 02:34) | c | - | Line endings only (live has CRLF) |
| sections/header-custom.liquid | both | 24283e51 (11-13 18:57) | 3897f4b3 (11-17 02:34) | c | - | Final newline only |
| sections/header-group-cacao-lp-bf.json | BF only | f3e53d14 (11-13 18:57) | - | a | BF12 | Header group for the landing page layout |
| sections/header-group.json | both | 61dce20f (11-19 13:55) | 9260234e (11-17 02:34) | a+b | BF21 (merge) | BF: black banner settings, ticker off, 2 sections added switched off. Live: its own header settings. Merge = live + banner settings |
| sections/hero-banner-cacao-lp-bf.liquid | BF only | e10cd38b (11-17 14:09) | - | a | BF8 | Landing page hero: Black Friday, 60% off, $68.99 |
| sections/hero-banner-cacao-lp.liquid | both | 3d15c628 (11-17 14:09) | fcf0a6ae (11-17 02:34) | a | BF17 | Review score rounds down. Otherwise identical |
| sections/main-cart-items.liquid | both | a163aa65 (11-16 17:25) | 6faf426e (11-17 02:34) | c | - | Final newline only |
| sections/main-product.liquid | both | 20c230bc (11-17 18:06) | 3653e1df (11-17 02:34) | a | BF22 | Adds one line: Black Friday price under the product price (date-gated) |
| sections/one-scoop-cacao-lp-bf.liquid | BF only | 25f4d9e8 (11-15 18:10) | - | c | - | Not used by any template. Leave out |
| sections/stocking-gift-lp.liquid | BF only | cdb07262 (11-13 18:57) | - | a (hold) | H1 | Stocking Stuffers gift page (built for 1 to 14 Dec). Hold, see notes |
| sections/whats-in-kit-cacao-lp-bf.liquid | BF only | 4f442a61 (11-15 21:21) | - | a | BF9 | Landing page: what is in the kit |
| sections/zt-bf-blends-band.liquid | BF only | 65486702 (11-15 15:30) | - | c | - | Only used by a header-group section that is switched off (Dana, 17 Nov). Leave out. Date-gated (24 to 30 Nov) if ever switched on |
| sections/zt-bf-countdown-sitewide.liquid | both | 9e03cd96 (11-19 13:55) | 5a147c26 (11-17 02:34) | a | BF20 | Black storewide banner (27 to 30 Nov), shared sale price styles and show/hide script |
| sections/zt-bf-hero.liquid | BF only | 0cf378d5 (11-15 15:30) | - | c | - | Only used by a header-group section that is switched off (Dana, 17 Nov). Leave out. Not date-gated: switched on, its "30% off everything." hero would show at once |
| sections/zt-blend-chooser.liquid | both | 2f1d13a3 (11-17 01:01) | 82fa34e6 (11-17 02:34) | c | - | Final newline only. live-paste-all step 7 replaces it on live; do not paste the BF copy |
| sections/zt-home-hero.liquid | both | b705f0e3 (11-17 14:09) | f6b594d3 (11-17 03:10) | a | BF18 | Homepage hero score rounds down. Otherwise identical |
| sections/zt-pdp-guarantee.liquid | both | 8192004c (11-16 12:41) | f04181e4 (11-17 02:34) | c | - | Final newline only |
| sections/zt-pdp-reviews.liquid | both | 67c46be4 (11-16 12:58) | 08378efd (11-17 02:34) | c | - | Final newline only |
| snippets/cacao-lp-review-score.liquid | both | 907bd415 (11-17 14:07) | 2af2b03b (11-17 02:34) | a | BF15 | Landing page score rounds down. Otherwise identical |
| snippets/card-product.liquid | both | 3c45a117 (11-17 18:06) | 6d89659c (11-17 02:34) | a | BF23 | Adds one line: Black Friday price on product cards (date-gated) |
| snippets/cart-drawer.liquid | both | 95006b93 (11-16 17:25) | 741d42c0 (11-17 02:34) | a (hold) | H2 | Adds the stocking-gift template to the cart.js skip rule. Only matters for the Stocking Stuffers page |
| snippets/header-custom-actions.liquid | both | d4d2dde0 (11-11 16:31) | 884059af (11-17 02:34) | c | - | Final newline only |
| snippets/header-custom-drawer.liquid | both | b3934094 (11-13 18:57) | 7284b330 (11-17 02:34) | c | - | Final newline only |
| snippets/meta-tags.liquid | both | cafc2ca8 (11-16 14:45) | 6be9720b (11-17 02:34) | c | - | Final newlines only |
| snippets/section.liquid | both | a9a303a6 (11-17 14:17) | faf4ce4c (11-19 02:49) | b | - | Pasted into live 19 Nov 02:49 UTC; final newline only |
| snippets/util-palette-hover-shift.liquid | both | 865a9c91 (11-17 14:01) | a013c02f (11-19 02:49) | b | - | Pasted into live 19 Nov 02:49 UTC; final newline only |
| snippets/zt-bf-bb-extras.liquid | BF only | 7286837e (11-15 23:03) | - | a | BF1 | Buy box part |
| snippets/zt-bf-bb-gallery.liquid | BF only | dff63588 (11-15 20:51) | - | a | BF2 | Buy box part |
| snippets/zt-bf-bb-nutrition.liquid | BF only | 456514a4 (11-15 18:10) | - | a | BF3 | Buy box part |
| snippets/zt-bf-bb-panel.liquid | BF only | 90327c4a (11-17 14:09) | - | a | BF4 | Buy box part (score rounds down) |
| snippets/zt-bf-bb-sticky.liquid | BF only | 2859438b (11-13 18:56) | - | a | BF5 | Buy box part |
| snippets/zt-bf-blend-price.liquid | both | c00b4a1b (11-19 14:35) | a99c6fc3 (11-17 02:34) | a | D1 (dated) | BF full version (Vegan + 30% storewide + price mode). Live gets the short Vegan-only version from live-paste-all step 18 first |
| snippets/zt-buybox-tidy.liquid | both | c0c77743 (11-17 19:47) | 277274bc (11-19 03:17) | a+b | BF19 (merge) | Live is newer (277274bc, 19 Nov 03:17 UTC). Only other difference: BF rounds the score down. Merge = live + that line |
| snippets/zt-clarity-internal.liquid | both | 9fe2b651 (11-14 19:12) | fc8d1b30 (11-17 02:34) | c | - | Indentation only |
| snippets/zt-guides-cart-data.liquid | both | 6dbcf8cd (11-19 01:11) | 2a5645df (11-19 01:22) | b | - | Live 2a5645df (19 Nov 01:22 UTC); same content, final newline only. Keep live |
| snippets/zt-om-float-hide.liquid | both | ebca37ea (11-15 21:55) | 92cc5ef6 (11-17 02:34) | c | - | Final newline only |
| snippets/zt-sub-bf-gift-data.liquid | both | c883595d (11-15 21:15) | 35319e59 (11-17 02:34) | c | - | Final newline only |
| templates/index.json | both | 805f2f6a (11-16 14:30) | ea7ed7cc (11-17 02:34) | b (+c) | - | Live has the homepage block texts (keep). BF changes only buttons in 6 sections that are switched off on both themes, plus a hero photo upload of the same picture. No merge needed |
| templates/page.about-zeotein.json | both | 0d13d124 (11-08 00:41) | 39603ea8 (11-17 02:57) | c | - | Same content, JSON formatting only |
| templates/page.faqs.json | both | 99c677ac (11-08 00:41) | f9e7885d (11-17 02:57) | c | - | Same content, JSON formatting only |
| templates/page.sms-terms.json | both | 819ef29f (11-14 18:19) | 15f33304 (11-17 02:34) | c | - | Same content, JSON formatting only |
| templates/page.zt-chooser-blends.json | both | 395a11c9 (11-17 22:10) | b970b6ae (11-17 02:34) | c | - | BF copy = live-paste-all step 0 exactly; that kit (step 0, then 7b) handles it |
| templates/page.zt-chooser-cacao.json | both | 8bd57776 (11-16 17:25) | 86e2584a (11-17 02:34) | c | - | Final newline only |
| templates/page.zt-chooser-vegan.json | both | a08a6859 (11-16 17:25) | e6bcda90 (11-17 02:34) | c | - | Final newline only |
| templates/password.json | both | 4749b3d6 (11-08 00:41) | bb473407 (11-17 02:57) | c | - | Same content, JSON formatting only |
| templates/product.bone-broth.json | both | f529da52 (11-16 12:41) | 3bdc9baf (11-17 02:34) | c | - | Final newline only |
| templates/product.cacao-lp-bf.json | BF only | d0bde3d0 (11-17 03:30) | - | a | BF14 | The landing page template used by the BF bag (templateSuffix cacao-lp-bf) |
| templates/product.collagen-peptides.json | both | d2bafe4f (11-16 12:41) | 6c09150c (11-17 02:34) | c | - | Final newline only |
| templates/product.gift-card-product.json | both | 1d1b758a (11-15 15:29) | ddb2c976 (11-17 02:34) | c | - | Final newline only |
| templates/product.json | both | c90a3b10 (11-08 00:41) | ae503bda (11-17 02:57) | c | - | Same content, JSON formatting only |
| templates/product.lions-mane.json | both | 73202d1a (11-16 12:41) | d790b0d5 (11-17 02:34) | c | - | Final newline only |
| templates/product.mct.json | both | 1c2f06ed (11-16 12:41) | b2423ce7 (11-17 02:34) | c | - | Final newline only |
| templates/product.merch.json | both | d071de1f (11-08 00:41) | df5b5f17 (11-17 02:57) | c | - | Same content, JSON formatting only |
| templates/product.organic-seamoss.json | both | 0bb87d64 (11-16 12:41) | 228888a8 (11-17 02:34) | c | - | Final newline only |
| templates/product.pumpkin-seed-protein.json | both | bd53fa39 (11-16 12:41) | fce81a2b (11-17 02:34) | c | - | Final newline only |
| templates/product.stocking-gift.json | BF only | 62b85b15 (11-13 18:57) | - | a (hold) | H3 | Template used by the Stocking Stuffers product (templateSuffix stocking-gift). Hold |
| templates/product.zeotein-vegan-products.json | both | 4a5f2b87 (11-08 00:41) | abaf26f1 (11-17 02:57) | c | - | Same content, JSON formatting only |
