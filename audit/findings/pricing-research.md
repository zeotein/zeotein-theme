# Zeotein Competitive Pricing Research (US retail, as of 10 Nov 2026)

## Bottom line

- **Cacao is not overpriced against its closest rival.** Per serving, Zeotein Cacao costs 3–21% less than Ka'Chava. The bulk bag is $3.67 one-time and $3.33 on subscription; Ka'Chava is $4.66 one-time and $4.00 on subscription. The funnel intro price of $2.57 a serving is lower than every bone-broth protein's one-time price.
- **Cacao looks expensive when shoppers compare it with plain protein.** Measured per 10 g of protein, Zeotein Cacao costs 20–80% more than bone-broth and collagen tubs from Ancient Nutrition, Paleovalley, Equip and Vital Proteins. The price only holds up if the page sells "six ingredients in one scoop", not "protein".
- **Vegan has a real price problem.** At $139.99 for 30 sticks it costs $2.33 per 10 g of protein, the most expensive figure in the whole dataset. That is 43–159% more than premium plant proteins such as Ritual, Truvani, KOS, Garden of Life and Orgain. It also costs $5 more than Cacao while giving 3 g less protein.
- **How the prices are presented is a bigger barrier than the price level.**
  - Every core SKU is over $100. Most competitors' core SKU costs $45–$70, because they sell 15–20 serving units.
  - Zeotein's site advertises free shipping from $150. That is the highest threshold in the set; competitors use $35–$100.
  - The ongoing bulk-bag subscription saves only 9%, against a market norm of 15–25%.
  - The 7-stick trial costs $5.71 a serving, the highest trial price per serving in the set.
- **Stick packs are not overpriced.** Zeotein charges 15–23% more per serving for sticks than for the bulk bag. Competitors' single-serve formats carry a median premium of about 57%.
- **Single ingredients are mixed.** At the 32 oz tier, zeolite, bone broth, collagen, MCT and cacao are competitive. Hemp (about 2.2x Manitoba Harvest), pumpkin seed (about 1.6x), sea moss (about 2x the mass brands, about 1.1x boutique brands) and lion's mane (about 1.5x) are premium-priced.

---

## 1. Method and data quality

- **Today's date:** 2026-11-10.
- **Where prices came from:** WebFetch was blocked by the session's network policy (kachava.com and support.kachava.com failed DNS), so every price below comes from **WebSearch result snippets** of brand pages and retailers. The date each page was crawled is not shown, and some pages may be stale.
- **Source labels:**
  - **[B]** means the price appeared on the brand's own domain.
  - **[3P]** means a third-party retailer or aggregator.
  - **[U]** means unverified, conflicting or estimated. Treat [U] figures as directional only.
- **$/10 g protein** = $/serving ÷ (protein grams ÷ 10).
- **Subscription %** is the discount against the brand's own one-time price.
- **Zeotein prices** are as you supplied them, cross-checked against `catalog.tsv` in the audit folder. Zeotein's guarantee, free-shipping bar and unit-economics inputs come from internal notes in `/tmp/claude-0/-home-user-zeotein-theme/cebad199-acf9-5993-b486-6404c594be45/scratchpad/audit/ad_decisions_clean.md`, not from the web:
  - a 30-day first-order refund;
  - subscriptions ship free;
  - the store bar reads "Free shipping on orders over $150 (U.S only)";
  - card fees estimated at 2.9% + $0.30 and shipping at about $10 per order.
- **Zeotein single-ingredient sizes:** only Pumpkin Seed Protein is verified, at 8 oz $19.99, 16 oz $36.99 and 32 oz $56.99 ([zeotein.com/products/organic-pumpkin-seed-protein-powder](https://zeotein.com/products/organic-pumpkin-seed-protein-powder)). For the other single ingredients, **8/16/32 oz is an assumption [U]**.

---

## 2. Zeotein baseline

| SKU | Price | Servings | $/serving | Protein g | $/10 g protein | Discount vs one-time |
|---|---|---|---|---|---|---|
| Cacao bulk bag, one-time | $109.99 | 30 | $3.67 | 23 | $1.59 | — |
| Cacao bulk bag, subscription renewal | $99.99 | 30 | $3.33 | 23 | $1.45 | 9.1% |
| Cacao bulk bag, funnel intro (first order) | $76.99 | 30 | $2.57 | 23 | $1.12 | 30.0% |
| Cacao 30 sticks, one-time | $134.99 | 30 | $4.50 | 23 | $1.96 | — |
| Cacao 30 sticks, subscription renewal | $114.99 | 30 | $3.83 | 23 | $1.67 | 14.8% |
| Cacao 30 sticks, funnel intro | $91.99 | 30 | $3.07 | 23 | $1.33 | 31.9% |
| Cacao 7 sticks | $39.99 | 7 | $5.71 | 23 | $2.48 | — |
| Vegan 30 sticks | $139.99 | 30 | $4.67 | 20 | $2.33 | — |
| Vegan 7 sticks | $44.99 | 7 | $6.43 | 20 | $3.21 | — |

**Contribution model.** Contribution = price − COGS − card fees (2.9% + $0.30) − about $10 shipping. The fee and shipping figures are the internal-notes estimates. The model reproduces the internal figures: a $99.99 renewal nets about $54 (notes say about $53), and the $76.99 intro nets about $31.70 before gifts (notes say about $23 after welcome-kit gifts).

| Scenario | Price | COGS | Contribution | % of price |
|---|---|---|---|---|
| Bulk, one-time | $109.99 | $32.78 | $63.72 | 57.9% |
| Bulk, renewal (now) | $99.99 | $32.78 | $54.01 | 54.0% |
| Bulk, renewal at 15% off | $93.49 | $32.78 | $47.70 | 51.0% |
| Bulk, intro (now) | $76.99 | $32.78 | $31.68 before gifts (about $23 after) | 41.1% (about 30%) |
| Bulk, intro at $84.99 | $84.99 | $32.78 | $39.45 before gifts (about $30.75 after) | 46.4% |
| Sticks, one-time | $134.99 | $52.54 | $68.24 | 50.6% |
| Sticks, renewal (now) | $114.99 | $52.54 | $48.82 | 42.5% |
| Sticks, renewal at $119.99 | $119.99 | $52.54 | $53.67 | 44.7% |
| Sticks, intro | $91.99 | $52.54 | $26.48 before gifts | 28.8% |
| 7 sticks (COGS pro-rated, [U]) | $39.99 | about $12.26 | $16.27 | 40.7% |
| Hypothetical 15-serving bag (COGS = half bag + $1, [U]) | $59.99 | about $17.39 | $30.56 | 50.9% |
| Hypothetical 15-serving bag, subscription | $54.99 | about $17.39 | $25.71 | 46.8% |
| "Buy 3 Get 1" 4-pack (draft SKU; shipping assumed $20, [U]) | $329.97 | $131.12 | $168.98 | 51.2% |

---

## 3. Master comparison table: protein products

The $/serving and $/10 g columns show the one-time figure first and the subscription figure second, unless noted.

### A. All-in-one and meal shakes

| Brand | Product | Price (one-time) | Servings | $/serving | Protein g | $/10 g protein | Subscription | Source |
|---|---|---|---|---|---|---|---|---|
| **Zeotein** | Cacao bulk bag / 30 sticks | $109.99 / $134.99 | 30 | $3.67–$4.50 / $3.33–$3.83 | 23 | $1.59–$1.96 / $1.45–$1.67 | 9% / 15% | supplied; `catalog.tsv` |
| Ka'Chava | All-in-One Nutrition Shake bag | $69.95 [B] | 15 | $4.66 / $4.00 | 25 [B] | $1.87 / $1.60 | $59.95 ($10 off, 14%). Extra 10% off the first subscription order ($53.96) | [support.kachava.com …How-much-does-Ka-Chava-cost](https://support.kachava.com/hc/en-us/articles/360045974531-How-much-does-Ka-Chava-cost); [kachava.com/products/shakes/chocolate](https://www.kachava.com/products/shakes/chocolate); [kachava.com/rescue](https://www.kachava.com/rescue); protein: [support.kachava.com …calories-in-each-serving](https://support.kachava.com/hc/en-us/articles/115001618906-How-many-calories-are-in-each-serving) |
| Ka'Chava | 15-serving single-serve variety pack | $74.95 [B] | 15 packets | $5.00 / $4.25 | 25 | $2.00 / $1.70 | $63.71 (15%) | [kachava.com/products/15-serving-variety-pack-shake](https://www.kachava.com/products/15-serving-variety-pack-shake) |
| Huel | Black Edition powder | $60 [B] | 17 | $3.53 / $2.65 | 40 [3P] | $0.88 / $0.66 | $45 (25%) | [huel.com/products/huel-black-edition](https://huel.com/products/huel-black-edition); protein: [nosh.com Huel Black Edition release](https://www.nosh.com/pr/2025/05/01/huel-expands-us-retail-presence-with-launch-of-black-edition-highprotein-complete-meal-in-gnc) |

### B. Bone broth, beef and collagen proteins

| Brand | Product | Price (one-time) | Servings | $/serving | Protein g | $/10 g protein | Subscription | Source |
|---|---|---|---|---|---|---|---|---|
| Ancient Nutrition | Bone Broth Protein Pure (15.7 oz) | $52.95 [B] | 20 | $2.65 / $2.25 | 20 | $1.32 / $1.13 | 15% plus free shipping | [checkout.ancientnutrition.com/products/bone-broth-protein-pure](https://checkout.ancientnutrition.com/products/bone-broth-protein-pure); subscription: [ancientnutrition.gorgias.help …subscribe-&-save](https://ancientnutrition.gorgias.help/en-US/can-i-use-a-discount-code-on-a-subscribe-&-save-order-12559); protein: [vitacost.com …pure-15-7-oz](https://www.vitacost.com/products/ancient-nutrition-bone-broth-protein-pure-15-7-oz-446-g-71285) |
| Ancient Nutrition | Bone Broth Protein Pure (2 lb) | $89.95 [B] | 40 | $2.25 / $1.91 | 20 | $1.12 / $0.96 | 15% | same as above |
| Ancient Nutrition | Multi Collagen Protein, Unflavored | $49.95 sale, $52.95 regular [B] | 45 | $1.11 / $1.00 | 9 [3P] | $1.23 / $1.11 | 15% | [checkout.ancientnutrition.com/products/collagen-protein](https://checkout.ancientnutrition.com/products/collagen-protein); protein: [fullscript.com …multi-collagen-protein-powder](https://fullscript.com/catalog/products/multi-collagen-protein-powder) |
| Vital Proteins | Collagen Peptides (19.3 oz) | $45.00 [B] | 28 | $1.61 / $1.37 | 18 [3P] | $0.89 / $0.76 | 15% plus free shipping | [vitalproteins.com/products/vp-collagen-peptides](https://www.vitalproteins.com/products/vp-collagen-peptides); [vitalproteins.com/pages/new-subscriptions](https://vitalproteins.com/pages/new-subscriptions); protein: [recipal.com …vital-proteins-collagen-peptides](https://www.recipal.com/ingredients/57807-nutrition-facts-calories-protein-carbs-fat-vital-proteins-collagen-peptides) |
| Vital Proteins | Collagen Peptides (9.33 oz) | $27.00 [B] | 14 | $1.93 / $1.64 | 18 | $1.07 / $0.91 | $22.95 (15%) | same as above |
| Paleovalley | Grass-Fed Bone Broth Protein | $59.99 plus $7.95 shipping [B] | 30 | $2.00 / $1.60 ($2.26 with shipping) | 15 unflavored, 13 flavored [3P] | $1.33 / $1.07 | 20% | [paleovalley.com/store/grass-fed-bone-broth-protein](https://paleovalley.com/store/grass-fed-bone-broth-protein); protein: [supp.co …pure-unflavored](https://supp.co/products/paleovalley-bone-broth-protein-pure-unflavored-850822006557) |
| Equip Foods | Prime Protein (grass-fed beef isolate) | $63.99 [B] | 30 [B] | $2.13 / $1.81 | 21 [B] | $1.02 / $0.86 | $54.39 (15%) | [equipfoods.com …prime-protein-beef-isolate-protein](https://www.equipfoods.com/products/prime-protein-beef-isolate-protein?view=v2); servings: [help.equipfoods.com …scoops-in-the-bags](https://help.equipfoods.com/en-US/how-many-scoops-are-in-the-bags-of-protein-powder-561967) |
| Equip Foods | Prime Protein on Amazon | $67.99 [3P] | 30 | $2.27 / $2.04 | 21 | $1.08 / $0.97 | $61.19 (10% Subscribe & Save) | [supplementscience.ai …B013MRPPL6](https://supplementscience.ai/products/equip-foods-prime-protein-beef-powder-B013MRPPL6) |
| Kettle & Fire | **No protein powder found**, liquid broth only | $6.36–$14.49 per carton depending on pack [B][U] | — | — | 10–19 per serving | Well above every powder | Up to 20% | [kettleandfire.com/products/grass-fed-beef-bone-broth](https://www.kettleandfire.com/products/grass-fed-beef-bone-broth); [help.kettleandfire.com …beef-bone-broth](https://help.kettleandfire.com/en-US/beef-bone-broth-75261) |
| Bulletproof | Unflavored Collagen Peptides (17.6 oz) | $44.95 [B] | about 25 [U] (sources say 15 or 25; 25 matches 500 g ÷ 20 g) | $1.80 / $1.44 | 18 [3P] | $1.00 / $0.80 | 20% recurring [U]; an older snapshot shows 35% off the first order, then 10% | [bulletproof.com/products/collagen-protein-17-6oz](https://www.bulletproof.com/products/collagen-protein-17-6oz) |
| Perfect Supplements | Perfect Hydrolyzed Collagen (660 g pouch) | $42.95 [B] (promos at $30.92) | about 60 | $0.72 | about 10 [U] (estimated from an 11 g serving) | about $0.72 [U] | No subscription found; buy 3 or more, save 20% | [perfectsupplements.com …unflavored-in-pouch](https://www.perfectsupplements.com/perfect-hydrolyzed-collagen-unflavored-in-pouch/); [perfectsupplements.com/buy-more-save-more](https://www.perfectsupplements.com/buy-more-save-more/) |
| Further Food | Grass-Fed Collagen Peptides | from $38.49 [3P] | 30 | $1.28 (vanilla), $1.50 (unflavored) | about 18 [U] | about $0.71–$0.83 [U] | not found | [supp.co …further-food…vanilla](https://supp.co/products/further-food-grass-fed-collagen-peptides-tremella-mushroom-vanilla-850006249718); [supp.co …further-food-collagen-peptides-unflavored](https://supp.co/products/further-food-collagen-peptides-unflavored) |

### C. Plant proteins

| Brand | Product | Price (one-time) | Servings | $/serving | Protein g | $/10 g protein | Subscription | Source |
|---|---|---|---|---|---|---|---|---|
| **Zeotein** | Vegan 30 sticks | $139.99 | 30 | $4.67 | 20 | $2.33 | — | supplied |
| Ritual | Essential Protein Daily Shake 18+ | $49 [B] ($48.99 at Grove [3P]) | 15 | $3.27 / $2.93 (promo $2.35) | 20 [3P] | $1.63 / $1.47 (promo $1.17) | $44 a month; 20% new-subscriber promo ($35.20), then renews at full price | [ritual.com/products/essential-protein-daily-shake-18](https://ritual.com/products/essential-protein-daily-shake-18); [ritual.com …pregnancy-postpartum](https://ritual.com/products/essential-protein-pregnancy-postpartum); [grove.co …essential-protein-daily-ritual](https://www.grove.co/products/essential-protein-daily-ritual) |
| Truvani | Plant Based Protein | $59.99 [B] (also shown as a "value" price on promo pages) | 20 | $3.00 / $2.49 | 20 [B] | $1.50 / $1.24 | 17% (main page); 25% off the first month (promo page) | [shop.truvani.com/pages/protein-powder](https://shop.truvani.com/pages/protein-powder); [shop.truvani.com/pages/protein-bonus](https://shop.truvani.com/pages/protein-bonus) |
| Sprout Living | Epic Protein Original (2 lb) | $64.95 [B] (sale $55.21) | 24 | $2.71 | 26 [B] | $1.04 | 15% plus free shipping on $50+ | [sproutliving.com …unflavored-3](https://sproutliving.com/products/organic-plant-protein-prebiotics-unsweetened-unflavored-3); [sproutliving.com/epic-plant-protein](https://sproutliving.com/epic-plant-protein) |
| Sprout Living | Epic Protein Original (5 lb) | $139.95 [B] | 60 | $2.33 | 26 | $0.90 | 15% | [sproutliving.com …unflavored-4](https://sproutliving.com/products/organic-plant-protein-prebiotics-unsweetened-unflavored-4) |
| Nuzest | Clean Lean Protein (20 servings) | $44.99 [B] | 20 | $2.25 | about 20 (18–21 by flavor) | $1.12 | not found | [nuzest.com/products/clean-lean-protein](https://www.nuzest.com/products/clean-lean-protein) |
| Nuzest | Clean Lean Protein (40 / 100 servings) | $79.99 / $169.99 [B] | 40 / 100 | $2.00 / $1.70 | about 20 | $1.00 / $0.85 | — | same as above |
| KOS | Organic Plant Protein | $59.99 [B]; a bundle page shows $49.99 for 1 bag and $44.99 each for 2 | 28 | $2.14 ($1.79 on the bundle page) | 20 | $1.07 ($0.89) | "15% off $49.99 MSRP" (promo lander) [U]; Amazon Subscribe & Save 10–15% | [kos.com …vanilla-28-servings](https://kos.com/products/kos-organic-plant-protein-vanilla-28-servings); [kos.com/pages/a1-plant-based-protein-ch28](https://kos.com/pages/a1-plant-based-protein-ch28); [kos.com/pages/kos-plant-protein-powder-40](https://kos.com/pages/kos-plant-protein-powder-40) |
| Garden of Life | Raw Organic Protein | $40.79 [B] | 20 [3P] | $2.04 | 22 | $0.93 | not found | [gardenoflife.com …raw-organic-protein](https://www.gardenoflife.com/products/our-vitamins/raw-organic-protein); servings: [vitaminshoppe.com …gu-7020](https://www.vitaminshoppe.com/p/garden-of-life-raw-protein-original-622-g-powder/gu-7020) |
| Orgain | Organic Protein Plant-Based (2.03 lb) | $37.99 [B]; a $32.29 option is shown, label unclear [U] | about 20 [3P] | $1.90 / $1.61 | 21 | $0.90 / $0.77 | about 15% [U]; subscriptions ship free | [orgain.com …organic-protein-plant-based-protein-powder](https://orgain.com/products/organic-protein-plant-based-protein-powder); Target $30.99: [target.com/p/-/A-46785365](https://www.target.com/p/-/A-46785365) |
| Naked Nutrition | Naked Pea (5 lb) | $57.99 [B][U: older page] ($57.99 at Walmart [3P]) | 76 | $0.76 / $0.61 | 27 | $0.28 / $0.23 | Autoship 20% off the first order, 10% after | [nakednutrition.com/products/pea-protein-powder](https://nakednutrition.com/products/pea-protein-powder); [walmart.com …Naked-Pea-5LB](https://www.walmart.com/ip/Naked-Pea-5LB-100-Pea-Protein-Powder-From-U-S-and-Canadian-Farms-Unflavored-Vegan-Pea-Protein-Isolate-76-Servings/14614557252) |

**Amazon street prices run below brand-site prices** for mass brands [3P]:
- Orgain 2.03 lb has repeatedly sold for about $15–$21 with coupons plus 5% Subscribe & Save ([slickdeals.net/f/18693709](https://slickdeals.net/f/18693709)).
- Vital Proteins 20 oz has sold for $32.99–$33.27 at grocery and Walmart.

Shoppers who compare on Amazon will see even wider gaps than the brand-site figures above.

### Ranking: $/10 g protein, one-time price (most expensive first)

This ranks the SKUs in the tables above.

1. Zeotein Vegan 7 sticks: $3.21
2. Zeotein Cacao 7 sticks: $2.48
3. Zeotein Vegan 30 sticks: $2.33
4. Ka'Chava single-serve variety pack: $2.00
5. Zeotein Cacao 30 sticks: $1.96
6. Ka'Chava bag: $1.87
7. Ritual: $1.63
8. Zeotein Cacao bulk bag: $1.59
9. Truvani: $1.50

Every other SKU in the tables is $1.33 or less. Other brands' single-serve packets from section 5 would rank between $1.63 and $2.17 per 10 g:

| Packet SKU | $/10 g protein |
|---|---|
| Vital Proteins sticks | about $2.17 |
| Garden of Life packets | $1.86 |
| Ancient Nutrition packets | $1.83 |
| Nuzest sachet | $1.75 |
| Orgain packets | $1.67 |
| Sprout Living packet box | $1.63 |

---

## 4. Offer terms: subscription, first order, shipping, guarantee and gifts

| Brand | Ongoing subscription discount | First-order or intro offer | Free-shipping threshold | Guarantee | Gifts, bundles, loyalty | Source |
|---|---|---|---|---|---|---|
| **Zeotein** | 9% bulk, 15% sticks | Intro 30% (bulk) / 32% (sticks) in funnels | Subscriptions ship free; store bar says **$150+** | 30-day first-order refund | Free shaker, 3 guides, Save-A-Scoop; month-3 collagen gift; draft "Buy 3 Get 1 Free" SKU | `ad_decisions_clean.md`, `catalog.tsv` |
| Ka'Chava | $10 off per bag (14%) | Extra 10% off the first subscription order; 10% off a first one-time order for email signup [3P] | $99+ [B]; otherwise $7.95 [3P] | "If you don't absolutely love Ka'Chava, for any reason… money back" [B]; reviewers complain of getting store credit [3P] | Free 5-flavor variety pack (MSRP $34.99) when subscribing to 2 bags; 500 reward points | [kachava.com/rescue](https://www.kachava.com/rescue); [kachava.com/products/shakes/chocolate](https://www.kachava.com/products/shakes/chocolate); [kachava.com 5-flavor terms](https://www.kachava.com/terms-and-conditions-5-flavor-variety-pack); [barbend.com/?p=278532](https://barbend.com/?p=278532); [joinchargeback.com …kachava-refund](https://www.joinchargeback.com/refunds/how-to-get-a-kachava-refund) |
| Huel | 25% (some pages say 20%) | Free shaker ($15) for new customers; free t-shirt with the first subscription [U] | $65+; otherwise $9.99 | 30-day money-back on first orders, capped at $115 | — | [huel.com/pages/refund-policy](https://huel.com/pages/refund-policy); [try.huel.com/black-edition-US](https://try.huel.com/black-edition-US) |
| Ancient Nutrition | 15% plus free shipping | Codes cannot be combined with subscriptions | Subscriptions ship free; one-time $49+ [U, coupon sites] | 30-day returns; $8 return fee unless the $2.98 Checkout+ add-on is bought | Loyalty program | [ancientnutrition.gorgias.help returns](https://ancientnutrition.gorgias.help/en-US/articles/returns-+-refunds-2892); [subscription FAQ](https://ancientnutrition.gorgias.help/en-US/can-i-use-a-discount-code-on-a-subscribe-&-save-order-12559) |
| Vital Proteins | 15% plus free shipping | — | $50+ | No guarantee found | — | [vitalproteins.com/pages/new-subscriptions](https://vitalproteins.com/pages/new-subscriptions) |
| Paleovalley | 20% | — | $75+ or 2 or more bags; otherwise $7.95 | 60-day money-back [3P] | — | [paleovalley.com/store/grass-fed-bone-broth-protein](https://paleovalley.com/store/grass-fed-bone-broth-protein); [jp.trustpilot.com …paleovalley](https://jp.trustpilot.com/review/paleovalley.com?page=10) |
| Equip | 15% | Partner and influencer codes (for example a 20% "SKINNY" code) | $100+ | 30-day refund or return | — | [help.equipfoods.com …recurring-subscription](https://help.equipfoods.com/en-US/how-can-i-sign-up-for-a-recurring-subscription-251697); [help.equipfoods.com …return-and-refund-policy](https://help.equipfoods.com/en-US/return-and-refund-policy-240597); [equipfoods.com/pages/skinny](https://www.equipfoods.com/pages/skinny) |
| Bulletproof | 20% recurring, or 35% first then 10% [U] | 35% off the first subscription order (older snapshot) | not found | not found | Volume discounts of 10% (1 item) up to 30% (5 items) | [bulletproof.com/products/collagen-protein-17-6oz](https://www.bulletproof.com/products/collagen-protein-17-6oz); [shop.bulletproof.com 8.5 oz](https://shop.bulletproof.com/products/unflavored-collagen-protein-8-5-oz) |
| Perfect Supplements | none found | Promo prices about 28% off ($30.92 vs $42.95) | not found | not found | Buy 3 or more and save 20% | [perfectsupplements.com/buy-more-save-more](https://www.perfectsupplements.com/buy-more-save-more/) |
| Orgain | about 15% [U]; first order discounted more than later orders | — | Subscriptions free with no minimum; one-time $75+ | 60-day satisfaction guarantee, one refund per household per year | Buy 2 get 1 free promos | [orgain.com/pages/shipping-and-returns](https://orgain.com/pages/shipping-and-returns); [help.orgain.com …satisfaction-guarantee](https://help.orgain.com/en-US/satisfaction-guarantee-policy-949598); [milled.com Orgain BOGO](https://milled.com/orgain/buy-2-get-1-free-starts-now-2PBYx07MWm_FmeTf) |
| KOS | 15% off MSRP [U]; Amazon Subscribe & Save 10–15% | "Save 20% OFF Lifetime + Free Insulated Bottle With First Order" | $75+ [B] (help center says $50); otherwise $8.99 | not found | Starter pack: 2 bags plus free greens for $80 | [kos.com/policies/shipping-policy](https://kos.com/policies/shipping-policy); [try.kos.com/a1-chocolate](https://try.kos.com/a1-chocolate); [kos.com/pages/starter-pack-v5-1](https://kos.com/pages/starter-pack-v5-1) |
| Truvani | 17% | 25% off the first month; starter kits at $34.99–$44.99 with a scoop, straw and eBooks | not found (customers ask for free subscription shipping) [3P] | 30-day, first purchase only, shipping not refunded | Sample pack of 10 flavors for $19.90; Black Friday bundles | [faq.truvani.com …refund-policy](https://faq.truvani.com/en-US/what-is-your-refund-policy-679206); [shop.truvani.com/pages/protein-50](https://shop.truvani.com/pages/protein-50); [shop.truvani.com/pages/pb-single-signup](https://shop.truvani.com/pages/pb-single-signup) |
| Naked Nutrition | Autoship 20% first, then 10% | — | $99+ ($49+ for paid members) | not found | Paid membership | [nakednutrition.com/pages/membership-program](https://nakednutrition.com/pages/membership-program) |
| Ritual | $44 a month ($5 below one-time) | 20% off the first subscription (promo), then renews at full price | Always free for subscribers | 30-day refund on the first order | — | [ritual.com/pages/subscriber-perks](https://ritual.com/pages/subscriber-perks) |
| Nuzest | not found | — | $70+ (subscriptions included); otherwise $8.95 | One-time 30-day money-back for new subscribers | 10-serving tub $25.99; sachets $3.50 | [nuzest.com/pages/shipping](https://nuzest.com/pages/shipping); [nuzest.com/pages/subscription-terms-conditions](https://www.nuzest.com/pages/subscription-terms-conditions) |
| Sprout Living | 15% | $15 sample kits with free shipping | $35+ ($50+ on subscriptions) | not found | — | [sproutliving.com/epic-plant-protein](https://sproutliving.com/epic-plant-protein); [sproutliving.com sample kit](https://www.sproutliving.com/shop/epic-protein-sample-kit/) |

---

## 5. Single-serve (stick or packet) premium vs the same brand's bulk format

| Brand | Single-serve SKU | $/serving | Bulk comparator | $/serving | Premium | Source |
|---|---|---|---|---|---|---|
| **Zeotein Cacao** | 30 sticks, $134.99 | $4.50 | Bulk bag, $109.99 | $3.67 | **+23%** | supplied |
| **Zeotein Cacao (subscription)** | $114.99 | $3.83 | $99.99 | $3.33 | **+15%** | supplied |
| **Zeotein Cacao (intro)** | $91.99 | $3.07 | $76.99 | $2.57 | **+19%** | supplied |
| **Zeotein Cacao trial** | 7 sticks, $39.99 | $5.71 | Bulk bag, one-time | $3.67 | **+56%** | supplied |
| Ka'Chava | 15-packet variety pack, $74.95 ($63.71 subscription) | $5.00 ($4.25) | 15-serving bag, $69.95 ($59.95) | $4.66 ($4.00) | +7% (+6%) | [kachava.com …variety-pack](https://www.kachava.com/products/15-serving-variety-pack-shake) |
| Ka'Chava | 5-flavor variety pack, $34.99 MSRP (used as a gift) | $7.00 | bag | $4.66 | +50% | [kachava.com 5-flavor terms](https://www.kachava.com/terms-and-conditions-5-flavor-variety-pack) |
| Ancient Nutrition BBP | 15 packets, $54.95 [3P] | $3.66 | 20-serving tub, $52.95 | $2.65 | +38% | [shop.bodybuilding.com …bone-broth-protein-20g](https://shop.bodybuilding.com/products/ancient-nutrition-bone-broth-protein-20g) |
| Nuzest | Sachet, $3.50 | $3.50 | 20-serving tub, $44.99 | $2.25 | +56% (+75% vs the 40-serving tub) | [nuzest.com …sachets](https://www.nuzest.com/products/clean-lean-protein-sachets) |
| Sprout Living | 16-packet box, $68 | $4.25 | 2 lb, $64.95 | $2.71 | +57% | [sproutliving.com …unflavored-5](https://sproutliving.com/products/organic-plant-protein-prebiotics-unsweetened-unflavored-5) |
| Further Food | 12 packets, $24.99 [3P] | $2.08 | tub | $1.28–$1.50 | +39% to +62% | [vitacost.com …12-packets](https://www.vitacost.com/products/further-food-grass-fed-collagen-peptides-vanilla-12-packets-0-74-oz-21-g-each-141339) |
| Orgain | 10 packets, $34.99 | $3.50 | 2.03 lb tub, $37.99 | $1.90 | +84% | [orgain.com …single-serve…vanilla-bean](https://orgain.com/products/single-serve-organic-protein-plant-based-protein-powder-vanilla-bean) |
| Garden of Life | 10 packets, $40.99 regular ($32.79 special) | $4.10 ($3.28) | tub, $40.79 ($37.59 special) | $2.04 ($1.88) | +101% (+74%) | [gardenoflife.com …10 packets](https://www.gardenoflife.com/raw-organic-protein-original-powder-658010115544) |
| Vital Proteins | 20 sticks of 10 g, $39 | $1.95 per 10 g collagen | 19.3 oz / 28 servings of 20 g, $45 | $0.80 per 10 g collagen | +143% | [vitalproteins.com/products/vp-collagen-peptides](https://www.vitalproteins.com/products/vp-collagen-peptides) |
| Bulletproof | 15 packets, $23.95 [B] | $1.60 | 17.6 oz tub | $1.80 per 20 g | not comparable [U] (packet size not verified) | [shop.bulletproof.com …packets-15-count](https://shop.bulletproof.com/products/collagen-protein-packets-15-count) |

Across the nine comparable competitor rows, the median premium is about +57%. Only Ka'Chava (+7%) prices its single-serve format closer to bulk than Zeotein does (+15–23%).

---

## 6. Single-ingredient price check ($/oz)

Zeotein's $/oz assumes the 8 oz and 32 oz sizes. Only pumpkin seed sizes are verified.

| Ingredient | Zeotein price range | Zeotein $/oz (8 oz → 32 oz) | Market examples ($/oz) | Position at 32 oz | Sources |
|---|---|---|---|---|---|
| Bone broth protein | $29.99–$79.99 | $3.75 → $2.50 | Ancient Nutrition 15.7 oz $52.95 = $3.37 [B]; AN 2 lb $89.95 = $2.86 [B]; Left Coast 16 oz $41 = $2.56 [3P]; Wild Foods 1 lb $23.70 = $1.48 [U] | **Competitive** (13% below AN) | [checkout.ancientnutrition.com …pure](https://checkout.ancientnutrition.com/products/bone-broth-protein-pure); [outliyr.com …left-coast](https://outliyr.com/shop/left-coast-bone-broth-protein); [sites.google.com …wildfoods](https://sites.google.com/view/bonebrothproteinpowderbywildfo) |
| Collagen peptides | $27.99–$74.99 | $3.50 → $2.34 | Vital 19.3 oz $45 = $2.33 [B]; Vital 9.33 oz $27 = $2.89 [B]; Sports Research 16 oz $32.95 = $2.06 [3P]; Perfect 660 g $42.95 = $1.84 [B]; Bulletproof 17.6 oz $44.95 = $2.55 [B] | **At parity** with brand sites; 14–27% above value brands. 8 oz is 21% above Vital's small tub | [vitacost.com …sports-research…16-oz](https://www.vitacost.com/products/sports-research-collagen-peptides-unflavored-16-oz-454-g-71106) and the links above |
| Zeolite (clinoptilolite) | $29.99–$79.99 | $3.75 → $2.50 | Zeolite Pure 400 g $52.95 = $3.75 [3P]; Aviva 8 oz $46.99 = $5.87 [3P]; a non-food-grade 1 lb at $12.78 is not comparable | **At or below market** | [reach.dog …zeolite-pure-powder](https://reach.dog/shop/healthy-by-nature/products/zeolite-pure-powder); [avivahealth.com …zeolite-powder](https://avivahealth.com/products/zeolite-powder) |
| MCT oil powder | $21.99–$58.99 | $2.75 → $1.84 | Sports Research 10.6 oz $24.95 = $2.35 ($0.83 a serving) [3P]; Garden of Life 10.58 oz $21.97 = $2.08 ($0.73 a serving) [3P] | **Competitive** at 32 oz; 8 oz is 17–32% above | [walmart.com …Sports-Research-Organic-MCT](https://www.walmart.com/ip/Sports-Research-Organic-MCT-Oil-Powder-Unflavored-10-6-oz-300-g/737165902); [target.com …mct-oil-powder](https://www.target.com/s/organic+mct+oil+powder) |
| Sea moss powder | $34.99–$109.99 | $4.37 → $3.44 | Nutricost 1 lb $27.95 = about $1.75 ($0.06 per 1 g serving) [3P]; BareOrganics 8 oz $25.19 = $3.15 ($0.22 a serving) [3P]; Bulk Supplements about 500 g $28.97 = about $1.64 ($0.12 a serving) [3P]; Plnt 4 oz about $24.90 = about $6.22 ($0.83 a serving) [3P] | **Premium**: 1.1x boutique, about 2x mass | [vitacost.com …nutricost-sea-moss](https://www.vitacost.com/products/nutricost-organic-irish-sea-moss-powder-unflavored-16-2-oz-454-g-124174); [vitacost.com …bareorganics](https://www.vitacost.com/products/bareorganics-organic-irish-sea-moss-powder-8-oz-227-g-131806); [supp.co …bulk-supplements-sea-moss](https://supp.co/products/bulk-supplements-organic-sea-moss-powder-x003tl6qs3); [vitaminshoppe.com …vs-4338](https://www.vitaminshoppe.com/p/organic-sea-moss-powder-4-2-oz-powder/vs-4338) |
| Lion's mane powder | $39.99–$119.99 | $5.00 → $3.75 | Micro Ingredients 1 lb $38.95 = $2.43 [3P]; Om 100 g $18.93 = $5.36 [3P]; extracts such as Real Mushrooms 60 g at about $36.70 are a different product | **Premium vs mass** (+54%), below Om | [vitacost.com …micro-ingredients-lions-mane](https://www.vitacost.com/products/micro-ingredients-organic-lion-s-mane-powder-1-lb-454-g-146515); [vitacost.com …om-lions-mane](https://www.vitacost.com/products/om-mushrooms-mushroom-powder-lion-s-mane-3-5-oz-100-g-76399) |
| Fermented cacao powder | $17.99–$48.99 | $2.25 → $1.53 | MRM fermented 8.5 oz $12.99–$14.09 = $1.53–$1.66 [3P]; Navitas 8 oz $14.24 = $1.78, 24 oz $28.90 = $1.20 [3P]; Viva Naturals 2 lb $33.99 = $1.06 [3P] | **Parity** with MRM; 28–44% above big-bag organics; 8 oz is 26–47% above | [walmart.com/c/kp/cacao](https://www.walmart.com/c/kp/cacao); [walmart.com/ip/113166186](https://www.walmart.com/ip/113166186) |
| Hemp protein | $21.99–$58.99 | $2.75 → $1.84 | Manitoba Harvest 1 lb $17.01 = $1.06, 2 lb $26.89 = $0.84 [3P]; Nutiva 16 oz $20.96 = $1.31 [3P] | **Most overpriced**: +119% vs Manitoba 2 lb, +40% vs Nutiva | [vitacost.com …manitoba…1-lb](https://www.vitacost.com/products/manitoba-harvest-organic-max-protein-powder-unsweetened-1-lb-454-g-21269); [vitacost.com …manitoba…2-lbs](https://vitacost.com/manitoba-harvest-organic-hemp-yeah-max-protein-unsweetened-hemp-protein-powder-2-lbs); [heb.com …nutiva](https://heb.com/product-detail/nutiva-hemp-organic-hemp-protein-hi-fiber/1875634) |
| Pumpkin seed protein (sizes verified) | $19.99 / $36.99 / $56.99 | $2.50 / $2.31 / $1.78 | Micro Ingredients 2 lb $34.99 = $1.09 [3P]; Food to Live 8 oz $15.14 = $1.89 [3P]; NOW Sports $0.87 a serving [3P] | **Premium**: +63% at 32 oz, +32% at 8 oz | [vitacost.com …micro-ingredients-pumpkin](https://www.vitacost.com/products/micro-ingredients-organic-pumpkin-seed-protein-powder-unflavored-2-lbs-907-g-160443); [walmart.com/ip/seort/869813665](https://www.walmart.com/ip/seort/869813665); [supp.co …now-sports-pumpkin](https://supp.co/products/now-sports-organic-pumpkin-seed-protein-unflavored) |

Typical per-serving costs at mainstream retail:

| Ingredient | Typical $/serving |
|---|---|
| Sea moss powder | $0.06–$0.83 |
| Zeolite powder | $0.13–$0.66 (Zeolite Pure's label states 80–400 servings per 400 g) |
| MCT oil powder | $0.73–$0.83 |
| Lion's mane | about $0.16–$0.47 ([supp.co …bulksupplements lion's mane](https://supp.co/products/bulksupplementscom-lions-mane-mushroom-30-polysaccharides) [3P]; [living.fit …freshcap](https://www.living.fit/collections/deals/products/freshcap-organic-lions-mane-mushroom-powder) [3P]) |
| Hemp protein | $0.90–$1.21 |
| Pumpkin seed protein | about $0.87 |

---

## 7. Analysis

### 7.1 Where Zeotein sits per serving

**All-in-one shakes (the right comparison set for Cacao).**
- Bulk bag: per serving, it is 21% below Ka'Chava one-time and 17% below Ka'Chava subscription. Per 10 g of protein it is still 9–15% below Ka'Chava.
- 30 sticks: about 3–4% below Ka'Chava per serving, and about 4–5% above Ka'Chava per gram of protein.
- Huel Black Edition is far cheaper ($2.65–$3.53 a serving, $0.66–$0.88 per 10 g). It is a 400-calorie, 40 g protein meal, so it does a different job.
- **Verdict for this set: Cacao is mid-pack to cheaper.**

**Bone broth, beef and collagen proteins (the comparison set a "protein powder" shopper uses).**
- Competitors cost $1.37–$2.65 a serving and $0.76–$1.33 per 10 g.
- The Zeotein bulk bag ($1.59 per 10 g one-time) costs about 20% more per gram of protein than Ancient Nutrition Bone Broth Protein and Paleovalley, about 56% more than Equip, and about 79% more than Vital Proteins.
- The stick packs ($1.96) cost 47–120% more.
- Zeotein's case rests on the five other ingredients. The illustrative calculation below shows that case.

**Illustrative do-it-yourself stack [U].** Zeotein does not publish per-ingredient doses (the stick panel shows only a 38.7 g serving, 140 kcal and 23 g protein). The calculation assumes half-servings of bone broth and collagen, to reach about 19 g of protein, plus one standard serving of each other ingredient.

| Component | Mainstream product | $/serving |
|---|---|---|
| Bone broth protein, half serving | Ancient Nutrition $52.95 / 20 | $1.32 |
| Collagen peptides, half serving | Vital Proteins $45 / 28 | $0.80 |
| MCT oil powder | Garden of Life or Sports Research | $0.73–$0.83 |
| Sea moss powder | various | $0.06–$0.83 |
| Organic cacao, 5–15 g | Navitas 24 oz $28.90 | about $0.21–$0.64 |
| Zeolite powder | Zeolite Pure | $0.13–$0.66 |
| **Total** | — | **about $3.25–$5.08 a day**, plus about $230 up front for six containers |

Zeotein's $3.33 subscription sits at the low end of that range and its $2.57 intro sits below it. Use this as a value argument, but run any "replaces X products" copy through the compliance scrub first. Avoid detox or binding claims for zeolite.

**Plant proteins (the comparison set for Vegan).**
- Zeotein Vegan costs $4.67 a serving and $2.33 per 10 g, the most expensive in the set by a wide margin:

| Competitor | $/serving | $/10 g protein | Zeotein Vegan premium per gram |
|---|---|---|---|
| Ritual | $3.27 | $1.63 | +43% |
| Truvani | $3.00 | $1.50 | +55% |
| Sprout Living | $2.71 | $1.04 | +124% |
| KOS | $2.14 | $1.07 | +118% |
| Garden of Life | $2.04 | $0.93 | +150% |
| Orgain | $1.90 | $0.90 | +159% |
| Naked Pea | $0.76 | $0.28 | about 8x |

- There is no Vegan bulk bag, so there is no cheaper entry.
- Vegan costs more than Cacao despite having less protein.
- **This is the one place where the price itself is clearly a barrier.**

### 7.2 Stick-pack premium

- **The premium is modest.** Zeotein charges 15–23% more per serving for sticks than for the bulk bag. Competitors' single-serve formats carry a median premium of about +57% (range +7% to +143%). Zeotein is not overcharging for convenience.
- **The stick subscription does not cover its extra cost.** Sticks cost $19.76 more to make than the bulk bag (COGS $52.54 vs $32.78). The one-time stick premium of $25 covers that; the subscription premium of $15 does not.
  - Stick subscription nets about $48.82 (42.5%).
  - Bulk subscription nets about $54.01 (54%).
  - Every subscriber who picks sticks over bulk costs about $5 a month in contribution.
- **The 7-stick trial looks small next to competitors' boxes.** It costs $5.71 a serving, 56% above the bulk bag, and is the highest trial price per serving among the brands checked. Competitors' trials are cheaper or larger:
  - Sprout Living: $15 sample kit with free shipping.
  - Truvani: 10-flavor sampler for $19.90.
  - Nuzest: 10-serving tub for $25.99, or 5 sachets for $17.50.
  - Ritual: 15 servings for $44.

  At $39.99, the trial costs about the same as a competitor's full 15–20 serving tub.

### 7.3 Single ingredients vs Amazon and mass retail

- **Competitive at 32 oz:** zeolite (below supplement-grade peers), bone broth (below Ancient Nutrition), collagen (parity with brand sites), MCT (below Sports Research and Garden of Life) and cacao (parity with fermented peers).
- **Overpriced:**
  - hemp protein: about 2.2x Manitoba Harvest's 2 lb price;
  - pumpkin seed: about 1.6x Micro Ingredients;
  - sea moss: about 2x mass brands, about 1.1x boutique;
  - lion's mane: about 1.5x mass.
- **Most 8 oz tiers carry a 17–160% per-oz premium.** The exceptions are zeolite (36% below Aviva) and lion's mane (7% below Om). In Google Shopping these sit next to Amazon listings priced per oz, so the 8 oz price is the one shoppers will compare.

### 7.4 Psychological price points and offer structures in the market

- **Sticker prices.** Competitors' core SKU almost always costs $45–$70: Ka'Chava $69.95, Equip $63.99, Huel $60, Paleovalley, KOS and Truvani $59.99, Ancient Nutrition $52.95, Ritual $49, Nuzest and Vital $44.99–$45. They get there by selling 15–28 serving units. Ka'Chava recommends two bags a month, about $119.90 on subscription, so its monthly spend is close to Zeotein's, but the price on the page reads $59.95.
- **Zeotein shows no price under $100 except the 7-stick trial.**
- **Price endings.** Ka'Chava and Ancient Nutrition end in .95. Most others end in .99. Huel, Ritual and Vital Proteins use round numbers to signal premium.
- **Per-serving framing is standard.** Ka'Chava shows "$3.99 per meal", Huel "$2.65 per meal", Equip "$1.81 per serving" and KOS "$1.79 / serving".
- **Subscription discounts.**
  - The market norm is 15% (Ancient Nutrition, Vital Proteins, Equip, Sprout Living, Orgain) up to 20–25% (Paleovalley, Huel, Bulletproof). Ka'Chava gives $10 off (14%).
  - Front-loaded patterns are common: Naked 20% then 10%; Bulletproof 35% then 10%; Truvani 25% off the first month then 17%; Ritual 20% off then full price; Ka'Chava an extra 10% on the first subscription order.
  - Zeotein's front-loading (30%) is deeper than most. Its ongoing bulk discount (9%) is shallower than the norm, so the jump at renewal (+30%) is among the steepest in the market, between Ritual (+25%) and Bulletproof (about +38%).
- **Gifts.** Ka'Chava gives a 5-flavor pack plus 500 points; Huel a shaker plus t-shirt; KOS an insulated bottle; Truvani a scoop, straw and eBooks. Zeotein's shaker, guides and Save-A-Scoop bundle is on par.
- **Volume pricing.** Perfect Supplements takes 20% off 3 or more items; Bulletproof 10–30% by quantity; KOS 2 bags at $44.99 each; Orgain buy 2 get 1. Zeotein's draft "Buy 3 Get 1 Free" (25%) fits this pattern.
- **Guarantees.**

| Window | Brands |
|---|---|
| 60 days | Paleovalley; Orgain (one refund per household per year) |
| 30 days | Huel (first order, capped at $115), Ritual, Truvani, Nuzest (all first order); Equip; Ancient Nutrition ($8 return fee) |
| "For any reason" | Ka'Chava (store-credit complaints) |

  Zeotein's 30-day first-order refund is standard, not a differentiator.

- **Free-shipping thresholds.** Ritual (subscribers) and Orgain (subscriptions) ship free with no minimum. One-time thresholds are $35 (Sprout Living), $50 (Vital Proteins), $65 (Huel), $70 (Nuzest), $75 (KOS, Paleovalley, Orgain one-time), $99 (Ka'Chava, Naked) and $100 (Equip). **Zeotein's $150 bar is the highest in the set.** It means a one-time 30-day order at $109.99 or $134.99 does not ship free, which adds about $8–13 at checkout according to internal notes.

---

## 8. Verdict and recommended moves

**Verdict.** Zeotein Cacao's prices are not the core barrier. Per serving it is cheaper than Ka'Chava, the closest all-in-one competitor, and the funnel intro price is aggressive. The barriers are how the price is presented and the terms around it:
- three-digit sticker prices against a market that sells $45–$70 units;
- a $150 free-shipping bar;
- a weak 9% ongoing bulk discount;
- a 7-stick trial that looks small and expensive.

**Vegan is the exception: its prices are a real problem** at 1.4–2.6x premium plant proteins per gram. Single ingredients are fine at 32 oz for five SKUs but overpriced on hemp and pumpkin.

Recommended moves, in order of impact against margin cost. Contribution uses the section 2 model.

1. **Kill the $150 free-shipping bar.**
   - Set free shipping at $99, or "free shipping on every 30-day supply", to match Ka'Chava, Naked and Equip.
   - Cost: only the shipping revenue now collected on one-time 30-day orders (about $8–13 each). One-time bulk still nets about $63.72 (58%).
   - This is the cheapest conversion fix available.
2. **Lead with per-serving price and the all-in-one comparison.**
   - Show "$3.33 a serving" on subscription and "first month from $2.57 a serving" rather than $99.99 or $76.99 as the headline.
   - Add a value line about six ingredients in one scoop.
   - Zero margin cost. Run the copy through the compliance scrub.
3. **Fix the stick subscription margin leak and make bulk the default.**
   - Pre-select the bulk bag as the default subscription.
   - Move the stick subscription to $119.99, which still carries only a 20% premium over bulk, far below the market's ~57%.
   - That lifts the stick renewal from $48.82 to $53.67, level with bulk. Keep sticks at $134.99 one-time.
4. **Re-price Vegan.**
   - At minimum, bring the 30 sticks to Cacao parity: $134.99 one-time, $114.99–$119.99 on subscription.
   - Better: launch a Vegan bulk bag at $109.99 one-time and $93.49–$99.99 on subscription, if Vegan COGS is at or below the Cacao bag's. **Vegan COGS was not provided; verify before committing.**
5. **Add an entry SKU under $60.**
   - A 15-serving bag at $59.99 one-time and $54.99 on subscription would match the competitive sticker range.
   - It would also cost more per serving ($4.00 / $3.67) than the 30-serving bag, which creates a natural "upgrade and save" ladder.
   - Estimated contribution is about $30.56 (51%) one-time and $25.71 (47%) on subscription, assuming half-bag COGS plus $1 packaging and $10 shipping [U].
   - On the website, this could replace the $39.99 7-stick as the main "try it" option. Alternatively, let the 7-stick price count as credit toward a first subscription.
6. **Keep the funnel intro. Treat the renewal jump as a retention test, not a price cut.**
   - Today's intro at $76.99 nets about $23, and each renewal at $99.99 nets about $54, so the first four orders net about $185.
   - Option A: intro $84.99 and renewal $93.49 (15%, a 10% step-up). The first four orders would net about $174 (−6%), so retention to order 4 would need to rise at least 6.4% to break even.
   - Run Option A only if month-2 churn data show the +30% step-up is costing renewals. Otherwise keep $99.99 and frame it as "save $10 every month, ships free, skip anytime", which is how Ka'Chava frames its own 14%.
7. **Launch the "Buy 3 Get 1 Free" 4-bag bundle** ($329.97, $82.49 a bag) for one-time and prepay buyers. Estimated contribution is about $169 (51%), assuming about $20 shipping [U]. It is in line with the volume discounts at Perfect Supplements, Bulletproof and KOS.
8. **Guarantee.**
   - Show the 30-day refund next to every price.
   - Consider testing a 60-day "empty bag" guarantee (Paleovalley and Orgain use 60 days).
   - Do not add return fees.
   - The cost is low because refund requests on consumables are usually a small share of orders. No Zeotein refund data was available to quantify this.
9. **Single ingredients.**
   - Make 32 oz the default and "best value" in Shopping feeds and show $/oz.
   - Cut hemp 32 oz to about $44.99–$49.99, or justify the price with sourcing. Do the same for pumpkin seed (about $44.99, or lean on the Austrian Styrian origin).
   - Hold zeolite, bone broth, collagen, MCT and cacao, which are already competitive.

**What not to do.** Do not cut the core Cacao bulk or stick list prices across the board. They are not out of market against the true peer, and each $10 cut removes about $9.70 of contribution per order.

---

## 9. Open items to verify (all [U] above)

- Zeotein single-ingredient sizes other than pumpkin seed (assumed 8/16/32 oz). Get these from the Shopify variants.
- Vegan COGS, the 7-stick COGS (pro-rated here), real per-order shipping cost, and gift costs. Fees and shipping in this report are the internal estimates of 2.9% + $0.30 and $10.
- Live checkout prices for Ka'Chava, Huel, Ritual, Truvani and KOS, because snippets conflicted on discount percentages.
- Protein per serving for Perfect Supplements and Further Food, servings for Bulletproof, and the size of a Bulletproof packet.
- Paleovalley's 60-day guarantee comes from a Trustpilot reply and an ad summary, not the policy page.

## 10. Additional sources consulted

- [ancientnutrition.gorgias.help](https://ancientnutrition.gorgias.help/en-US/articles/returns-+-refunds-2892)
- [help.orgain.com shipping](https://help.orgain.com/en-US/will-my-order-ship-for-free-645998)
- [hip2save.com KOS](https://hip2save.com/deals/kos/)
- [ringly.io Truvani alternatives](https://www.ringly.io/discover/truvani-alternatives)
- [nosh.com Ka'Chava single-serve release](https://www.nosh.com/pr/2026/05/13/kachava-introduces-new-singleserve-variety-packs-for-easy-onthego-nutrition)
- [garagegymreviews.com Naked Pea](https://www.garagegymreviews.com/equipment/naked-nutrition-naked-pea)
- [gnc.com Vital Proteins](https://www.gnc.com/powders/542520.html)
- [blueskyvitamin.com Ancient Nutrition BBP](https://blueskyvitamin.com/products/ancient-nutrition-bone-broth-protein-pure-20-servings)
- [zeotein.com/products/zeotein-protein-cacao](https://zeotein.com/products/zeotein-protein-cacao) (stick panel: 38.7 g, 140 kcal, 23 g protein)
