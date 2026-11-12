#!/usr/bin/env python3
"""Write INSTALL-PACKET.md (the GoHighLevel install guide for Zeus) from the current build.

    python3 tools/make_packet.py        (run after build.py; page names, paths, files and SEO fields come from dist/manifest.json)
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
m = json.loads((ROOT / "dist" / "manifest.json").read_text())
pages = m["pages"]
NEW = {"single-ingredients", "collagen", "bone-broth", "hemp-protein", "pumpkin-seed-protein", "cacao-powder",
       "mct-oil-powder", "sea-moss", "lions-mane"}
BRANCH = "claude/go-automator-ai-website-jdhgjg"
REPO = "https://github.com/zeotein/zeotein-theme"
KIT = "https://claude.ai/artifact/7xHhZwMmCAHnwAEc7dAmmb"
ROLLBACK = "8e166fe"  # last commit before the 12 Nov rebuild: the blocks that are live on shop.zeotein.com today
by_slug = {p["slug"]: p for p in pages}
ORDER = ["single-ingredients", "collagen", "bone-broth", "hemp-protein", "pumpkin-seed-protein", "cacao-powder",
         "mct-oil-powder", "sea-moss", "lions-mane", "cacao", "vegan", "home", "our-story", "faq", "contact", "shipping",
         "refund-policy"]
assert set(ORDER) == set(by_slug), "install order must cover every built page"


def esc(s):
    return s.replace("|", "\\|")


def file_of(p):
    return f"google-site/{p['ghlFile']}"


L = []
w = L.append
w("# Install packet: shop.zeotein.com rebuild")
w("")
w(f"**For Zeus. Nothing in this packet is for Dana.** Built {m['built']} from branch `{BRANCH}` of {REPO}.")
w("About 45 minutes in GoHighLevel. Every file below is on that branch; the install kit has the same blocks with")
w(f"one-click Copy buttons: {KIT}")
w("")
w("| | |")
w("|---|---|")
w("| GoHighLevel location | `Kch9YmRfzpmQrAs5Bchz` |")
w("| Website | **01 · Zeotein Google Site** (`XybYbqU2CgF1TyKDc9GR`), under Sites → Websites |")
w("| Domain | shop.zeotein.com, already connected (HTTPS) |")
w("| Work | 1 Head snippet, 9 new pages to create, 17 page blocks to paste (8 existing pages + 9 new) |")
w("| Approved | The rating line \"4.9 from 155 reviews\" (Dana's standing approval, 9 Nov) |")
w("| Do not | Change Google Ads final URLs · touch zeotein.com, go.zeotein.com, the Starter Kit funnel or the quiz · noindex zeotein.com · block Googlebot or AdsBot · enter details or pay at checkout |")
w("")
w("## Order of install")
w("")
w("1. **Head snippet** (site level). Do this first, so every page, including the new ones, renders edge to edge and carries noindex from its first save.")
w("2. **Create and paste the 9 new pages** (section 2, steps 1 to 9; files 09 to 17), so links from the re-pasted pages never 404.")
w("3. **Re-paste the 8 existing pages** (section 2, steps 10 to 17): Cacao, Vegan, Home, Our story, FAQ, Contact, Shipping, Refund policy.")
w("4. **Publish** anything the builder has not published on save.")
w("5. **Post-install checks** (section 5).")
w("")
w("## 1. Site-level code")
w("")
w("| Where in GoHighLevel | What to do | File |")
w("|---|---|---|")
w("| 01 · Zeotein Google Site → Settings → Tracking code → **Head** | Keep the Google Ads tag (AW-18130788543), the Meta pixel and Clarity. Delete the old Zeotein snippet (it starts `<!-- Zeotein Google Site fit`), then paste the whole new file at the end. Save. | `google-site/dist/ghl/00-website-head.html` |")
w("| Same place → **Body** | No change. It holds the gclid/UTM passthrough script the cart relies on. | none |")
w("")
w("The new Head snippet starts with `<meta name=\"robots\" content=\"noindex, follow\">`. If a noindex line was already pasted by hand,")
w("it can stay (a duplicate is harmless) or be removed. The snippet also removes GoHighLevel's default section padding and 1170px")
w("row, keeps the header pinned, and fills any empty SEO title or description.")
w("")
w("## 2. Page blocks: create, paste, save")
w("")
w("| Step | GHL page name | Path | Status | Where the code goes | File |")
w("|---|---|---|---|---|---|")
for n, slug in enumerate(ORDER, 1):
    p = by_slug[slug]
    status = "**NEW: create the page first**" if slug in NEW else "Existing: replace the content"
    w(f"| {n} | {esc(p['name'])} | `{p['path']}` | {status} | Page body → 1 full-width section → **Custom JS/HTML** element | `{file_of(p)}` |")
w("")
w("**The same steps for every page:**")
w("")
w("1. Sites → Websites → **01 · Zeotein Google Site** → Pages.")
w("   - New page: add a page, give it the name in the table, and set its path (URL slug) exactly as in the table. The")
w("     blocks link to these paths, so a different path breaks links.")
w("   - Existing page: clone it first if you want a backup, then open it in the builder.")
w("2. In the builder, delete every existing section on the page.")
w("3. Add **one full-width section** with one row and one column. Set section, row and column padding to 0 on all sides and")
w("   background to none.")
w("4. Add a **Custom JS/HTML** element (newer builders call it Code). Paste the **entire** file: it starts with")
w("   `<!-- Zeotein Google Site |` and ends with `</script>`. Save the element.")
w("5. Reopen the element and scroll to the very end: it must still end with `</script>`. Blocks are 63 to 82 KB, so a")
w("   cut-off paste is the most likely install error.")
w("6. Page settings → SEO: paste the title and description from section 3. Save the page, and Publish if the builder")
w("   shows a separate Publish button.")
w("")
w("To copy a file from GitHub: open it on the branch, press **Raw**, select all, copy. Or use the Copy block button in the kit.")
w("")
w("## 3. SEO fields (page settings → SEO)")
w("")
w("| GHL page | SEO title | SEO description |")
w("|---|---|---|")
for slug in ORDER:
    p = by_slug[slug]
    w(f"| {esc(p['name'])} (`{p['path']}`) | {esc(p['seoTitle'])} | {esc(p['seoDescription'])} |")
w("")
w("## 4. Noindex")
w("")
w("- **shop.zeotein.com, all 17 pages:** covered by the Head snippet in step 1. Nothing is needed per page.")
w("- **marketing.zeotein.com/cacao-stick-packs-starter-kit:** not used by any Google ad, so no step is included. Checked 12 Nov")
w("  across the current ads, Performance Max asset groups and sitelinks in all 9 campaigns, plus 90 days of landing-page")
w("  data; the only funnel URLs in use are /starter-kit-google and, in the last 90 days, /starter-kit-page. If an ad ever")
w("  points to it, add the same line to that funnel's Settings → Tracking code → Head: `<meta name=\"robots\" content=\"noindex, follow\">`.")
w("- **Quiz at marketing.zeotein.com/:** leave alone.")
w("- **zeotein.com:** never noindex it. **robots.txt:** never block Googlebot or AdsBot.")
w("")
w("## 5. Post-install checks")
w("")
w("Use a **new private (incognito) window for each of checks 5, 6 and 7**, so each test starts with an empty cart.")
w("**At Shopify checkout, stop.** Do not enter an email, address or card; just close the window. No order should be placed.")
w("")
w("- [ ] **1. Every page loads** (no 404, no blank page):")
for slug in ["home", "cacao", "vegan", "single-ingredients", "collagen", "bone-broth", "hemp-protein", "pumpkin-seed-protein",
             "cacao-powder", "mct-oil-powder", "sea-moss", "lions-mane", "our-story", "faq", "contact", "shipping", "refund-policy"]:
    w(f"  https://shop.zeotein.com{by_slug[slug]['path']}")
w("- [ ] **2. Noindex is on.** Open `view-source:https://shop.zeotein.com/collagen`, search for `noindex`, and expect `noindex, follow`.")
w("  Claude can check all 17 at once with `python3 qa/verify_noindex.py`.")
w("- [ ] **3. It looks right** on a desktop and on a phone:")
w("  - bright header with a cart icon, no grey GoHighLevel padding or boxed width;")
w("  - Home shows \"4.9 from 155 reviews\" above \"Real Nutrition. Made for Real Life.\";")
w("  - every product photo is whole, not cropped.")
w("- [ ] **4. Phone add-to-cart bar.** On an iPhone, open /cacao and scroll past the purple Add to cart button. A bar with")
w("  Add to cart appears at the bottom. Automated tests ran on Chrome's engine, so this is the Safari check.")
w("- [ ] **5. Blend + single ingredient, with ad tracking.**")
w("  1. Open `https://shop.zeotein.com/cacao?gclid=PACKETTEST&utm_source=google&utm_medium=cpc&utm_campaign=install_check`.")
w("  2. Keep \"Starter Kit · 30-day bulk bag\", set Delivery to **Every 6 weeks**, press Add to cart. The cart shows $76.99")
w("     and \"First order $76.99, then $99.99 per delivery\".")
w("  3. Press Keep shopping, open Single Ingredients, pick Sea Moss **1/2 lb · $59.99**, press Add to cart. The subtotal is **$136.98**.")
w("  4. Press Checkout. Shopify checkout lists Sea Moss 1/2 lb $59.99 and the Cacao Starter Kit \"1 bag every 6 weeks,")
w("     First payment $76.99, then $99.99 every 6 weeks\". **No $89.99 anywhere.**")
w("  5. In the same window, open `https://zeotein.com/cart.js`. Under `attributes` it shows `\"gclid\":\"PACKETTEST\"`,")
w("     `utm_source`, `utm_campaign` and `landing_page`. Close the window.")
w("- [ ] **6. Vegan Starter Kit + Hemp** (one of the two live tests Shopify's bot check blocked on the cloud machine):")
w("  open https://shop.zeotein.com/vegan, keep \"Starter Kit · 30 stick packs\" and choose **Every 8 weeks**. Add Hemp Protein")
w("  **2 lb · $58.99** from /hemp-protein. The subtotal is **$155.98**. At checkout, the kit is $96.99 now and $124.99")
w("  per later delivery, every 8 weeks. Close the window.")
w("- [ ] **7. Cacao stick-pack subscription + Lion's Mane** (the other blocked live test): open https://shop.zeotein.com/cacao,")
w("  pick \"30 stick packs · subscribe\", **Every 30 days**. Add Lion's Mane **1 lb · $69.99** from /lions-mane. The subtotal is")
w("  **$184.98**. At checkout, the stick packs are $114.99 on a 30-day subscription. Close the window.")
w("- [ ] **8. Back-and-forth.** In a private window, add any one item, press Checkout, press the browser's Back button, add a")
w("  second item, and press Checkout again. Each item appears once (quantity 1).")
w("- [ ] **9. Tell Claude it's installed.** Claude re-runs the automated tests against the live site and reports back:")
w("  cart and buttons (`qa/e2e_cart.js`), links (`qa/link_check.py`), noindex, and the compliance prescan.")
w("")
w("## If something looks wrong")
w("")
w("| What you see | Likely cause | Fix |")
w("|---|---|---|")
w("| The code shows as text on the page | Pasted into a text or HTML-text element | Delete it; use the Custom JS/HTML (Code) element |")
w("| Grey padding or a boxed, narrow page | The Head snippet is missing, or the old one is still there | Redo step 1 |")
w("| Buttons do nothing, or the cart never opens | The paste was cut off | Re-paste; check that the element ends with `</script>` |")
w("| A link 404s | A new page's path differs from the table | Fix the path in that page's settings |")
w("| Checkout shows anything at $89.99, or the wrong item | Stop and tell Claude | None; do not work around it |")
w("")
w("## Rollback")
w("")
w(f"The blocks live on shop.zeotein.com before this install are in git at commit `{ROLLBACK}`")
w(f"({REPO}/tree/{ROLLBACK}/google-site/dist/ghl): `00-website-head.html` and `01-home.html` to `08-refund-policy.html`.")
w("To roll back a page, paste its old file the same way, or restore the clone you made. New pages can be unpublished. Google Ads")
w("does not point at shop.zeotein.com, so a rollback affects no live campaign.")
w("")
(ROOT / "INSTALL-PACKET.md").write_text("\n".join(L) + "\n")
print(f"wrote INSTALL-PACKET.md ({len(L)} lines)")
