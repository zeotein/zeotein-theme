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
