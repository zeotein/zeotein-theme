# Install packet: shop.zeotein.com rebuild

**For Zeus. Nothing in this packet is for Dana.** Built 2026-11-12 from branch `claude/go-automator-ai-website-jdhgjg` of https://github.com/zeotein/zeotein-theme.
About 45 minutes in GoHighLevel. Every file below is on that branch; the install kit has the same blocks with
one-click Copy buttons: https://claude.ai/artifact/7xHhZwMmCAHnwAEc7dAmmb

| | |
|---|---|
| GoHighLevel location | `Kch9YmRfzpmQrAs5Bchz` |
| Website | **01 · Zeotein Google Site** (`XybYbqU2CgF1TyKDc9GR`), under Sites → Websites |
| Domain | shop.zeotein.com, already connected (HTTPS) |
| Work | 1 Head snippet, 9 new pages to create, 17 page blocks to paste (8 existing pages + 9 new) |
| Approved | The rating line "4.9 from 155 reviews" (Dana's standing approval, 9 Nov) |
| Do not | Change Google Ads final URLs · touch zeotein.com, go.zeotein.com, the Starter Kit funnel or the quiz · noindex zeotein.com · block Googlebot or AdsBot · enter details or pay at checkout |

## Order of install

1. **Head snippet** (site level). Do this first, so every page, including the new ones, renders edge to edge and carries noindex from its first save.
2. **Create and paste the 9 new pages** (section 2, steps 1 to 9; files 09 to 17), so links from the re-pasted pages never 404.
3. **Re-paste the 8 existing pages** (section 2, steps 10 to 17): Cacao, Vegan, Home, Our story, FAQ, Contact, Shipping, Refund policy.
4. **Publish** anything the builder has not published on save.
5. **Post-install checks** (section 5).

## 1. Site-level code

| Where in GoHighLevel | What to do | File |
|---|---|---|
| 01 · Zeotein Google Site → Settings → Tracking code → **Head** | Keep the Google Ads tag (AW-18130788543), the Meta pixel and Clarity. Delete the old Zeotein snippet (it starts `<!-- Zeotein Google Site fit`), then paste the whole new file at the end. Save. | `google-site/dist/ghl/00-website-head.html` |
| Same place → **Body** | No change. It holds the gclid/UTM passthrough script the cart relies on. | none |

The new Head snippet starts with `<meta name="robots" content="noindex, follow">`. If a noindex line was already pasted by hand,
it can stay (a duplicate is harmless) or be removed. The snippet also removes GoHighLevel's default section padding and 1170px
row, keeps the header pinned, and fills any empty SEO title or description.

## 2. Page blocks: create, paste, save

| Step | GHL page name | Path | Status | Where the code goes | File |
|---|---|---|---|---|---|
| 1 | Single Ingredients | `/single-ingredients` | **NEW: create the page first** | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/09-single-ingredients.html` |
| 2 | Grass-Fed Collagen Peptides | `/collagen` | **NEW: create the page first** | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/10-collagen.html` |
| 3 | Grass-Fed Bone Broth Protein | `/bone-broth` | **NEW: create the page first** | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/11-bone-broth.html` |
| 4 | Organic Hemp Protein | `/hemp-protein` | **NEW: create the page first** | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/12-hemp-protein.html` |
| 5 | Organic Pumpkin Seed Protein | `/pumpkin-seed-protein` | **NEW: create the page first** | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/13-pumpkin-seed-protein.html` |
| 6 | Organic Fermented Cacao Powder | `/cacao-powder` | **NEW: create the page first** | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/14-cacao-powder.html` |
| 7 | Organic MCT Oil Powder | `/mct-oil-powder` | **NEW: create the page first** | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/15-mct-oil-powder.html` |
| 8 | Organic Sea Moss Powder | `/sea-moss` | **NEW: create the page first** | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/16-sea-moss.html` |
| 9 | Organic Lion's Mane Powder | `/lions-mane` | **NEW: create the page first** | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/17-lions-mane.html` |
| 10 | Cacao | `/cacao` | Existing: replace the content | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/02-cacao.html` |
| 11 | Vegan | `/vegan` | Existing: replace the content | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/03-vegan.html` |
| 12 | Home | `/home` | Existing: replace the content | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/01-home.html` |
| 13 | Our story | `/our-story` | Existing: replace the content | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/04-our-story.html` |
| 14 | FAQ | `/faq` | Existing: replace the content | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/05-faq.html` |
| 15 | Contact | `/contact` | Existing: replace the content | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/06-contact.html` |
| 16 | Shipping | `/shipping` | Existing: replace the content | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/07-shipping.html` |
| 17 | Refund policy | `/refund-policy` | Existing: replace the content | Page body → 1 full-width section → **Custom JS/HTML** element | `google-site/dist/ghl/08-refund-policy.html` |

**The same steps for every page:**

1. Sites → Websites → **01 · Zeotein Google Site** → Pages.
   - New page: add a page, give it the name in the table, and set its path (URL slug) exactly as in the table. The
     blocks link to these paths, so a different path breaks links.
   - Existing page: clone it first if you want a backup, then open it in the builder.
2. In the builder, delete every existing section on the page.
3. Add **one full-width section** with one row and one column. Set section, row and column padding to 0 on all sides and
   background to none.
4. Add a **Custom JS/HTML** element (newer builders call it Code). Paste the **entire** file: it starts with
   `<!-- Zeotein Google Site |` and ends with `</script>`. Save the element.
5. Reopen the element and scroll to the very end: it must still end with `</script>`. Blocks are 63 to 82 KB, so a
   cut-off paste is the most likely install error.
6. Page settings → SEO: paste the title and description from section 3. Save the page, and Publish if the builder
   shows a separate Publish button.

To copy a file from GitHub: open it on the branch, press **Raw**, select all, copy. Or use the Copy block button in the kit.

## 3. SEO fields (page settings → SEO)

| GHL page | SEO title | SEO description |
|---|---|---|
| Single Ingredients (`/single-ingredients`) | Single-Ingredient Powders \| Zeotein | Collagen, bone broth, hemp, pumpkin seed, cacao, MCT, sea moss and lion's mane. Plain, unsweetened powders you can add to any Zeotein order. |
| Grass-Fed Collagen Peptides (`/collagen`) | Grass-Fed Collagen Peptides Powder, Unflavored \| Zeotein | Collagen peptides from grass-fed cattle, 11g protein per serving. Dissolves clear in hot or cold drinks. 1/2 lb, 1 lb and 2 lb pouches. |
| Grass-Fed Bone Broth Protein (`/bone-broth`) | Grass-Fed Bone Broth Protein Powder, Unflavored \| Zeotein | Grass-fed beef bone broth protein powder, 15g protein per serving. Mild and unflavored for coffee, soup or a smoothie. 1/2 lb to 2 lb pouches. |
| Organic Hemp Protein (`/hemp-protein`) | Organic Hemp Protein Powder \| Zeotein | Organic hemp protein, 14g protein and 6g fiber per serving. Naturally nutty, and the same hemp protein in Zeotein Vegan. 1/2 lb to 2 lb pouches. |
| Organic Pumpkin Seed Protein (`/pumpkin-seed-protein`) | Organic Styrian Pumpkin Seed Protein Powder \| Zeotein | Organic Styrian pumpkin seed protein, 11g protein per serving. Mild and nutty, and the same pumpkin seed protein in Zeotein Vegan. |
| Organic Fermented Cacao Powder (`/cacao-powder`) | Organic Fermented Cacao Powder, Unsweetened \| Zeotein | Raw, fermented organic cacao with a deep dark chocolate taste, the same cacao in Zeotein Cacao. Swap it 1:1 for cocoa powder. |
| Organic MCT Oil Powder (`/mct-oil-powder`) | Organic MCT Oil Powder, Unflavored \| Zeotein | MCT oil from coconut in an easy powder that mixes into coffee, shakes and smoothies. 1/2 lb, 1 lb and 2 lb pouches. |
| Organic Sea Moss Powder (`/sea-moss`) | Organic Sea Moss Powder, Wildcrafted in St. Lucia \| Zeotein | Wildcrafted organic sea moss from St. Lucia, 75% gold and 25% purple, finely milled. A mild taste that disappears in a fruit smoothie. |
| Organic Lion's Mane Powder (`/lions-mane`) | Organic Lion's Mane Mushroom Powder, Unflavored \| Zeotein | Organic lion's mane mushroom powder, finely milled, 1,400 mg per serving. Mild and earthy, and it disappears into coffee. |
| Cacao (`/cacao`) | Zeotein Cacao Starter Kit \| 23g Protein, 14g Collagen, Zero Sugar | 23g protein and 14g grass-fed collagen peptides per serving. Six ingredients, no sweeteners. Bag, shaker, Save-A-Scoop and three guides for $76.99 your first order. |
| Vegan (`/vegan`) | Zeotein Vegan \| 20g Plant Protein, Five Ingredients | 20g plant protein from organic pumpkin seed and organic hemp. Five ingredients, zero added sugar, single-serve stick packs. Vegan Starter Kit $96.99 your first order. |
| Home (`/home`) | Zeotein \| Cacao and Vegan Protein Powder, Short Ingredient Lists | Cacao protein with grass-fed bone broth and collagen, or plant protein from pumpkin seed and hemp. No sweeteners. Cacao Starter Kit $76.99 first order with free US shipping. |
| Our story (`/our-story`) | Our Story \| Zeotein | Why Zeotein puts protein and the rest of your shelf into one serving, with an ingredient list short enough to read in seconds. Shipped from Manitowoc, Wisconsin. |
| FAQ (`/faq`) | Questions \| Zeotein | Ingredients, nutrition, how to mix it, subscriptions, shipping and the 30-day money-back guarantee, answered plainly. |
| Contact (`/contact`) | Contact Zeotein | Email hello@zeotein.com. Real replies within 1 to 2 business days. Manage or cancel a subscription online anytime. |
| Shipping (`/shipping`) | Shipping \| Zeotein | Orders ship from Manitowoc, Wisconsin in 1 to 2 business days. Free US shipping on Cacao Starter Kit and bag orders from this site. |
| Refund policy (`/refund-policy`) | Refund Policy \| Zeotein | Our 30-day money-back guarantee on your first order of a protein blend, and how to start a claim. |

## 4. Noindex

- **shop.zeotein.com, all 17 pages:** covered by the Head snippet in step 1. Nothing is needed per page.
- **marketing.zeotein.com/cacao-stick-packs-starter-kit:** not used by any Google ad, so no step is included. Checked 12 Nov
  across the current ads, Performance Max asset groups and sitelinks in all 9 campaigns, plus 90 days of landing-page
  data; the only funnel URLs in use are /starter-kit-google and, in the last 90 days, /starter-kit-page. If an ad ever
  points to it, add the same line to that funnel's Settings → Tracking code → Head: `<meta name="robots" content="noindex, follow">`.
- **Quiz at marketing.zeotein.com/:** leave alone.
- **zeotein.com:** never noindex it. **robots.txt:** never block Googlebot or AdsBot.

## 5. Post-install checks

Use a **new private (incognito) window for each of checks 5, 6 and 7**, so each test starts with an empty cart.
**At Shopify checkout, stop.** Do not enter an email, address or card; just close the window. No order should be placed.

- [ ] **1. Every page loads** (no 404, no blank page):
  https://shop.zeotein.com/home
  https://shop.zeotein.com/cacao
  https://shop.zeotein.com/vegan
  https://shop.zeotein.com/single-ingredients
  https://shop.zeotein.com/collagen
  https://shop.zeotein.com/bone-broth
  https://shop.zeotein.com/hemp-protein
  https://shop.zeotein.com/pumpkin-seed-protein
  https://shop.zeotein.com/cacao-powder
  https://shop.zeotein.com/mct-oil-powder
  https://shop.zeotein.com/sea-moss
  https://shop.zeotein.com/lions-mane
  https://shop.zeotein.com/our-story
  https://shop.zeotein.com/faq
  https://shop.zeotein.com/contact
  https://shop.zeotein.com/shipping
  https://shop.zeotein.com/refund-policy
- [ ] **2. Noindex is on.** Open `view-source:https://shop.zeotein.com/collagen`, search for `noindex`, and expect `noindex, follow`.
  Claude can check all 17 at once with `python3 qa/verify_noindex.py`.
- [ ] **3. It looks right** on a desktop and on a phone:
  - bright header with a cart icon, no grey GoHighLevel padding or boxed width;
  - Home shows "4.9 from 155 reviews" above "Real Nutrition. Made for Real Life.";
  - every product photo is whole, not cropped.
- [ ] **4. Phone add-to-cart bar.** On an iPhone, open /cacao and scroll past the purple Add to cart button. A bar with
  Add to cart appears at the bottom. Automated tests ran on Chrome's engine, so this is the Safari check.
- [ ] **5. Blend + single ingredient, with ad tracking.**
  1. Open `https://shop.zeotein.com/cacao?gclid=PACKETTEST&utm_source=google&utm_medium=cpc&utm_campaign=install_check`.
  2. Keep "Starter Kit · 30-day bulk bag", set Delivery to **Every 6 weeks**, press Add to cart. The cart shows $76.99
     and "First order $76.99, then $99.99 per delivery".
  3. Press Keep shopping, open Single Ingredients, pick Sea Moss **1/2 lb · $59.99**, press Add to cart. The subtotal is **$136.98**.
  4. Press Checkout. Shopify checkout lists Sea Moss 1/2 lb $59.99 and the Cacao Starter Kit "1 bag every 6 weeks,
     First payment $76.99, then $99.99 every 6 weeks". **No $89.99 anywhere.**
  5. In the same window, open `https://zeotein.com/cart.js`. Under `attributes` it shows `"gclid":"PACKETTEST"`,
     `utm_source`, `utm_campaign` and `landing_page`. Close the window.
- [ ] **6. Vegan Starter Kit + Hemp** (one of the two live tests Shopify's bot check blocked on the cloud machine):
  open https://shop.zeotein.com/vegan, keep "Starter Kit · 30 stick packs" and choose **Every 8 weeks**. Add Hemp Protein
  **2 lb · $58.99** from /hemp-protein. The subtotal is **$155.98**. At checkout, the kit is $96.99 now and $124.99
  per later delivery, every 8 weeks. Close the window.
- [ ] **7. Cacao stick-pack subscription + Lion's Mane** (the other blocked live test): open https://shop.zeotein.com/cacao,
  pick "30 stick packs · subscribe", **Every 30 days**. Add Lion's Mane **1 lb · $69.99** from /lions-mane. The subtotal is
  **$184.98**. At checkout, the stick packs are $114.99 on a 30-day subscription. Close the window.
- [ ] **8. Back-and-forth.** In a private window, add any one item, press Checkout, press the browser's Back button, add a
  second item, and press Checkout again. Each item appears once (quantity 1).
- [ ] **9. Tell Claude it's installed.** Claude re-runs the automated tests against the live site and reports back:
  cart and buttons (`qa/e2e_cart.js`), links (`qa/link_check.py`), noindex, and the compliance prescan.

## If something looks wrong

| What you see | Likely cause | Fix |
|---|---|---|
| The code shows as text on the page | Pasted into a text or HTML-text element | Delete it; use the Custom JS/HTML (Code) element |
| Grey padding or a boxed, narrow page | The Head snippet is missing, or the old one is still there | Redo step 1 |
| Buttons do nothing, or the cart never opens | The paste was cut off | Re-paste; check that the element ends with `</script>` |
| A link 404s | A new page's path differs from the table | Fix the path in that page's settings |
| Checkout shows anything at $89.99, or the wrong item | Stop and tell Claude | None; do not work around it |

## Rollback

The blocks live on shop.zeotein.com before this install are in git at commit `8e166fe`
(https://github.com/zeotein/zeotein-theme/tree/8e166fe/google-site/dist/ghl): `00-website-head.html` and `01-home.html` to `08-refund-policy.html`.
To roll back a page, paste its old file the same way, or restore the clone you made. New pages can be unpublished. Google Ads
does not point at shop.zeotein.com, so a rollback affects no live campaign.

