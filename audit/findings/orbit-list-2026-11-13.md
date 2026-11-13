# Orbit's list, November 13, 2026: what was done

Everything below is in the preview theme `187923202261` unless it says otherwise. Nothing on the live theme changed. Files and screenshots: `audit/theme-fixes/pdp-v2-2026-11-13/`.

## Changed
| # | Item | What I did |
|---|---|---|
| 1 | Google Ads pages: mobile above the fold | Cacao powder and zeolite: an Add to cart bar with size and price is on screen at load. Add to cart moved directly under the size picker (was ~1,200px down). The Rewards button no longer covers the price on phones. The two shipping lines became one row. |
| — | Zeus: 0.00/0 reviews on single-ingredient pages | Replaced with "★★★★★ 4.9/5 store rating · 1,500+ orders" on cacao powder and zeolite. Blend pages show "4.9/5 rating · 1,500+ orders" plus a real verified quote. No small review counts at the top of any of these pages. |
| — | Dana's PDP notes | Format picker up top, Starter Kit gift box with photos, Add to cart always visible (phone and desktop), Starter Kit gallery image drafted. |

## Checked, nothing to fix
| # | Item | Finding |
|---|---|---|
| 2 | Theme script errors (`@theme/section-hydration`, `@theme/component`, `.header-wrapper` null, cart scripts loading twice) | None on live today. Checked: cacao powder, zeolite, bulk bag and `/products/cacao-protein-starter-kit`. These were fixed and pushed to live and the Black Friday theme Nov 10–13. Clarity's 30-day window still includes older sessions, so the 24% will fall off over the next few weeks. |
| 3 | "Claim My --% Off" on the Cacao starter-kit page | Renders "Claim My 55% Off" now: at load, for 1, 2 and 3 bags, and on one-time. **But see the 55% flag below.** |
| 5 | myshopify.com links | No customer-facing links use `wmzz7i-xw.myshopify.com`. Menus, redirects and page links all use zeotein.com. The domain shows up in page code only as Shopify and app IDs (Seal, Bon, pixels), which have to stay. The myshopify visits in Clarity are the theme editor, previews and bots. |

## Skipped, and why
| Item | Why |
|---|---|
| 4. Clarity tag for staff and bot visits | Forge's item. One idea for Forge: load Clarity only when the host is zeotein.com and the page isn't in the theme editor. That drops the myshopify noise at the source. |
| Same change on the other 7 single-ingredient pages (collagen, bone broth, MCT, sea moss, lion's mane, hemp, pumpkin) | Waiting for Dana's reaction to cacao powder and zeolite first. Same recipe, about 15 minutes once approved. |
| Richer spec-sheet content | These pages already have serving size, servings per size, taste, nutrition or supplement facts, ingredients, how to use and an FAQ. Adding more facts needs the label panels as the source. I won't invent specs. |
| Final-sale note on single-ingredient pages | The refund policy covers it. Adding it next to the button would be the cautious choice but may cost some add-to-carts. Dana's call. |

## Flags for Dana (need a decision)
1. **Policy contradiction (legal text).** The "Cancellations" (subscription) policy that Shopify shows at checkout ends with: "Returns & Refunds: All sales are final. Due to the nature of our products, we do not accept returns or offer refunds." The Refund Policy and every product page promise a 30-day money-back guarantee on blends. Suggested replacement for that paragraph: "Returns & Refunds: Our protein blends are covered by our 30-Day Money-Back Guarantee on your first order, as described in our Refund Policy. Single-ingredient supplements, digital guides and merchandise are final sale." I'll update it on Dana's yes.
2. **"Claim My 55% Off" (starter-kit page).** 55% only works if the free gifts count as discount: ($109.99 + $62.98 gifts − $76.99) ÷ $172.97. The price itself is 30% off the first subscription order ($76.99 vs $109.99). One-time buyers get no price cut at all, but the button says 55% for them too. That's FTC price-claim risk. Safer: "Claim 30% Off + Free Starter Kit" on subscription and "Get My Starter Kit" on one-time. Zeus owns that page, so I didn't change it.
3. **Rafael's mockup claims to avoid.** "1445+ 5-Star Reviews" (we have about 155), "87% Sold" (fake scarcity), "4.8/5 · 1524 Sold" (unverified), "Support Your Immunity" and "Sharpen Your Focus" (outside our approved claims). His layout ideas (formats on top, gift photos, price on the button) are good and are in v2.

---

# Part 2: Zeus's open zeotein.com items (Nov 13, evening)

**What I touched:** only the preview theme `187923202261` (snippet `zt-buybox-tidy.liquid`, five product templates, `meta-tags.liquid`) and, in the Black Friday theme `187825914069`, **only `snippets/meta-tags.liquid`**. Nothing on live: my connection can't write to the live theme. Every live change below is a paste for Orbit or Zeus.

| # | Item | Call | What happened |
|---|---|---|---|
| 1 | Jewels checkout trust (staging 188057845973) | **Worth doing, after the policy fix** | The guarantee link and "How to cancel" under the checkout button are the strongest pieces: they help trust and auto-renewal disclosure. "Includes $62.98 in free gifts" matches the product page's "$62.98 value" (live store prices), so they agree. The "Secure checkout" lock line is fine but low impact. Don't ship until the Cancellations policy stops saying "All sales are final" (see flag 1 in part 1). |
| 2 | Store-wide rating instead of per-product badges | **Done on the 5 key pages (preview)** | "★★★★★ Verified buyers rate Zeotein 4.9/5", read live from Judge.me's verified-buyer average (4.93 from 119 verified reviews). It updates itself, with no hard-coded number. On cacao powder it replaces the hidden 0.00/0 badge, so the #1 ad page now has a rating under the title. The rest of the product pages follow once Dana approves. |
| 3 | Spec-sheet content for single-ingredient pages | Skip for now | Needs the supplier spec sheets as the source. Happy to build it from them. No certification or testing claims either way. |
| 4 | JS error hardening | Skip until after Black Friday | Root causes are fixed on live and BF (I agree with Zeus's check; none on live today). A `customElements.define` guard wouldn't stop the "already declared" error anyway: that happens when the whole file loads twice, which is fixed. The `.header-wrapper` null guard is cheap but touches `global.js`. Low value right before BF. |
| 5 | myshopify.com 301 | Agree | Nothing to do. |
| 6 | Starter-kit page: "Claim My 55% Off" below the fold on phones; sticky bar | **Two-setting fix for Zeus** | On a 390×664 phone, the hero button sits at the bottom edge (top at 618px). The sticky bar only appears after the whole hero section scrolls away and hides while any part of the tall buy box is on screen. In my test it never showed through the first 1,400px. Fix in the theme editor, Cacao LP template, **Sticky Offer CTA** section: **Hero CSS selector** → `.hbclp__cta` and **Buy box CSS selector** → `.zt-bb2__cta`. The bar then shows whenever neither button is on screen. No code change. |
| 7a | og:image uses http | **Fixed in preview + BF** | `snippets/meta-tags.liquid` now says `https:`. Live needs the same one-word change: in `snippets/meta-tags.liquid`, `content="http:{{ page_image` → `content="https:{{ page_image`. |
| 7b | Title suffix " – Zeotein LLC", homepage title "Zeotein LLC" | Settings, not code | Fastest: Online Store → Preferences → Homepage title (e.g. "Zeotein Cacao Protein with Collagen & Bone Broth"). The suffix comes from the store name. Renaming "Zeotein LLC" → "Zeotein" in Settings → Store details also changes how emails and checkout show the name, so that's Dana's call. A `theme.liquid` edit can change the suffix alone if she prefers. |
| 7c | Two H1s on the homepage | Not done | Needs `templates/index.json` (28 KB). Low SEO impact. Zeus can set the second heading's size to H2 in the theme editor. |
| 7d | Review stars split from Product JSON-LD | Not done | Needs `main-product.liquid` or Judge.me's rich-snippet setting. Cacao powder has 0 reviews, so there's nothing to mark up yet anyway. |
| 8 | BF banner "30% off everything" vs hero "30% off one-time orders" | Held for Dana | Flag: if subscriptions are excluded, "30% off everything" is inaccurate. Use "30% off one-time orders" in both places. |

**Also noticed:** free U.S. shipping changed from $150 to **$130** today (shipping settings and the top bar). The product-page shipping row now says $130+. The amount sits in one place at the top of `zt-buybox-tidy.liquid` for the next change.

**For Zeus, today (Dana's $130 decision):** 9 single-ingredient product templates still say "Orders of $150 and up ship free." under Add to cart: organic-cacao, zeolite, bone-broth, collagen-peptides, mct, organic-seamoss, lions-mane, hemp, pumpkin-seed-protein. In the theme editor, for each template, click that text block and change 150 → 130. Do it in live `187740487893` and in Black Friday `187825914069` (the templates are identical in both). I checked everything else on the site: no other $150 shipping text. The v2 cacao powder and zeolite pages already drop this line and show "Free U.S. shipping on orders $130+".
