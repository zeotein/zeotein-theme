# Single-ingredient price recheck (US, 13 Nov 2026)

## Method and labels

- **Source of every figure:** WebSearch result snippets, standard mode. One extended search was used, for Vital Proteins, because the brand snapshots conflicted. WebFetch is blocked in this session (ancientnutrition.com failed DNS), so no live page was opened. That host, and any others, would have to be allowed in the session's network settings first.
- **Page dates:** snippets do not show when a page was captured. Where the search tool reported a page age, it is noted in the row.
- **Labels:**
  - **[B]**: the price appeared on the brand's own site.
  - **[3P]**: a third-party retailer or aggregator.
  - **[U]**: uncertain, conflicting, stale, or a size or URL that could not be pinned down.
- **$/oz** = price ÷ net ounces on the label. Where a listing gives only grams, grams are converted at 28.35 g/oz. Prices are one-time unless marked.
- **Zeotein reference lines** use internal figures, not the live store: the Merchant Center entry of 27 Oct 2026 in `scratchpad/audit/ad_decisions_clean.md`, the price ranges in `audit/findings/shopify-catalog-before-cleanup.tsv`, the variant names in `scratchpad/prod90.txt`, and "Sea moss ¼ lb $34.99" in `scratchpad/audit/report/decide_section.html`. A size marked "range top" is inferred from the top of the catalog price range.

## Summary: typical $/oz

| Ingredient | Premium brands | Mass / value | Zeotein (smallest → largest) |
|---|---|---|---|
| Bone broth protein | $2.06–$3.37 (Ancient Nutrition $2.86–$3.37; Left Coast $2.06–$2.55; Paleovalley about $3.33 [U]) | $1.56–$1.77 (Nutricost) | $3.75 (½ lb) → $2.50 (2 lb) |
| Collagen peptides | $2.03–$2.53 at 16–21 oz (Vital list $2.35) | $1.59–$1.60 (Vital and Great Lakes at Walmart); 4 lb bag $1.43 | $3.50 → $2.94 → $2.34 |
| Zeolite | $3.26–$3.83 at 400 g; Aviva $5.87 at 8 oz | $1.87–$2.71 (Amazon) | $3.75 → $4.06 (1 lb) → $2.50 |
| Organic MCT powder | $2.35–$2.49 (10.6 oz tubs) | $1.87–$2.06 (organic 1 lb); non-organic 2 lb $1.22 | $2.75 → $2.31 → $1.84 |
| Sea moss powder | Brand-site organic 1 lb $1.56–$1.94; 8 oz $2.15–$3.75; blends $6.25 | 1 kg $1.16 | $8.75 (¼ lb) → $6.87 (1 lb, range top) |
| Lion's mane | Om $6.74–$6.77; extracts $16.51–$18.89 (a different product class) | $2.43–$2.50 (1 lb); $1.37 (fruiting body plus mycelium) | $5.00 (½ lb) → $3.75 (2 lb, range top) |
| Organic cacao | Navitas $1.46–$1.87 [B]; MRM fermented $1.53–$1.67 | $1.06–$1.25 (1–2 lb) | $2.25 → $1.53 |
| Organic hemp protein | 16 oz $1.31 at brand list price | 16 oz $1.16–$1.34; 32 oz $0.92–$1.06 | $2.75 → $2.31 → $1.84 |
| Organic pumpkin seed protein | 1 lb $2.06 (Sprout Living, NOW) | $0.94–$1.64 (Micro Ingredients, Anthony's, Food to Live) | $2.50 → $2.31 → $1.78 |
| Shaker, 27–28 oz | BlenderBottle Classic $10.99 [B] | $11.50 (Walmart) | CleanBlend 27 oz $15.99 |

---

## 1. Grass-fed bone broth protein, unflavored

Zeotein: ½ lb $29.99 ($3.75/oz) · 2 lb $79.99 ($2.50/oz). The 1 lb price is not in the internal notes.

| Brand | Product | Net wt | Price | $/oz | Organic / grass-fed | Label | Source |
|---|---|---|---|---|---|---|---|
| Ancient Nutrition | Bone Broth Protein Pure, 20 servings | 15.7 oz (446 g) | $52.95 | $3.37 | Chicken plus grass-fed beef bone broth blend (per retailer label text); not organic | [B] | https://checkout.ancientnutrition.com/products/bone-broth-protein-pure |
| Ancient Nutrition | Bone Broth Protein Pure, 40 servings | 31.5 oz (892 g) | $89.95 | $2.86 | as above | [B] | https://checkout.ancientnutrition.com/products/bone-broth-protein-pure (Thrive Market also $89.95: https://thrivemarket.com/p/ancient-nutrition-bone-broth-protein-pure-31-5-oz-tub) |
| Ancient Nutrition | Bone Broth Protein Pure, 20 servings, at Vitacost | 15.7 oz | $44.99 | $2.87 | as above | [3P] | https://www.vitacost.com/products/ancient-nutrition-bone-broth-protein-pure-15-7-oz-446-g-71285 |
| Left Coast Performance | Bone Broth Protein, Unflavored, single ingredient | 16 oz | $40.79 | $2.55 | Grass-fed beef | [B] | https://leftcoastperformance.com/products/bone-broth-protein-unflavored |
| Left Coast Performance | Bone Broth Protein, Unflavored | 32 oz | $65.99 | $2.06 | Grass-fed beef | [B] [U] (one page shows it sold out) | https://leftcoastperformance.com/products/bone-broth-protein-unflavored-32oz |
| Left Coast Performance | Organic Bone Broth Protein | 16 oz | $75.59 | $4.72 | USDA organic, grass-fed | [B] | https://leftcoastperformance.com/products/16oz-organic-bone-broth |
| Left Coast Performance | Bone Broth Protein, Unflavored, at Target | 16 oz | $33.99 sale ($45.59 list) | $2.12 ($2.85 at list) | Grass-fed beef | [3P] | https://target.com/p/bone-broth-protein-left-coast-performance-unflavored-16-oz/-/A-88813552 |
| Paleovalley | 100% Grass Fed Bone Broth Protein, Pure Unflavored, 30 servings | about 18 oz (30 × 17 g; label weight not confirmed) | $59.99 | about $3.33 | 100% grass-fed | [3P] [U] | https://supp.co/products/paleovalley-bone-broth-protein-pure-unflavored-850822006557 |
| Nutricost (mass) | Bone Broth Protein, Unflavored, 20 servings | 400 g (14.1 oz; Vitacost lists 14.3 oz) | $21.95 | $1.56 | Grass-fed not stated | [3P] | https://www.vitacost.com/products/nutricost-bone-broth-protein-unflavored-14-3-oz-400-g-147374 |
| Nutricost (mass) | Beef Bone Broth Protein Powder (brand site) | 400 g presumed | $24.97 | $1.77 | not stated | [B] [U] (size not shown in snippet) | https://nutricost.com/collections/all-items/products/nutricost-beef-bone-broth-protein-powder |

- **Kettle & Fire:** two searches found no protein powder, only liquid broth ([kettleandfire.com guide](https://www.kettleandfire.com/pages/bone-broth-product-guide)).
- **Ancient Nutrition's list price:** the brand site's struck-through "$158.85" is three times $52.95, a multi-pack artifact. The site also advertises 15–25% discounts based on order size.

## 2. Grass-fed collagen peptides, unflavored

Zeotein: ½ lb $27.99 ($3.50/oz) · 1 lb $46.99 ($2.94/oz) · 2 lb $74.99 ($2.34/oz).

| Brand | Product | Net wt | Price | $/oz | Organic / grass-fed | Label | Source |
|---|---|---|---|---|---|---|---|
| Vital Proteins | Collagen Peptides, Unflavored (new paperboard canister) | 20 oz (567 g) | $47.00 list | $2.35 | Grass-fed, pasture-raised bovine hide (brand) | [B] | https://www.vitalproteins.com/products/vp-collagen-peptides (other brand snapshots: $45.00 = $2.25, and an 18%-off sale at $38.60 = $1.93 [U]; 15% off on auto-delivery) |
| Vital Proteins | Collagen Peptides, Unflavored, at Walmart | 20 oz | $31.97 | $1.60 (Walmart's unit price) | as above | [3P] | https://www.walmart.com/ip/Vital-Proteins-Collagen-Peptides-Powder-Supplement-for-Hair-Skin-and-Nails-Unflavored-20-oz/350254837 (a price tracker recorded Harris Teeter at $31.99, Aug–Oct 2026: https://www.fortheconsumers.com/product/vital-proteins-collagen-peptides-for-skin-hair-nail-joint-GFg) |
| Vital Proteins | Collagen Peptides, Unflavored, at iHerb | 20 oz | $39.95 (15% off $47.00) | $2.00 | as above | [3P] | https://www.iherb.com/pr/vital-proteins-collagen-peptides-unflavored-20-oz-567-g/71356 |
| Sports Research | Collagen Peptides, Unflavored | 16 oz | $32.95 ($28.01 subscription) | $2.06 ($1.75) | Bovine; grass-fed not stated for this SKU (their organic grass-fed SKU is $35.95, size not shown) | [B] | https://www.sportsresearch.com/products/collagen-peptides-hydrolyzed-gelatin-2 |
| Great Lakes Wellness | Collagen Peptides | 16 oz | $32.49 | $2.03 | Grass-fed bovine | [B] | https://greatlakeswellness.com/products/collagen-peptides (Vitacost $33.49 = $2.09 [3P]: https://www.vitacost.com/products/great-lakes-wellness-grass-fed-bovine-collagen-peptides-unflavored-16-oz-454-g-52774) |
| Great Lakes Wellness | 20oz Unflavored Collagen Peptides | 20 oz | $41.99 | $2.10 | Grass-fed | [B] [U] (limited run, low stock) | https://greatlakeswellness.com/products/20oz-collagen-peptides |
| Great Lakes Wellness | Grass-Fed Collagen Peptides, bag | 4 lb (64 oz) | $91.79 ($107.99 regular) | $1.43 ($1.69 at regular) | Grass-fed | [B] | https://greatlakeswellness.com/products/4lb-collagen-peptides-bag |
| Great Lakes Wellness (mass) | Quick Dissolve Collagen Peptides, at Walmart | 16 oz | $25.49 (was $32.29) | $1.59 | not stated | [3P] | https://www.walmart.com/ip/39452787 |
| Further Food | Grass-Fed Collagen Peptides, Unflavored | 9.88 oz (280 g) | $24.99 | $2.53 | 100% grass-fed | [3P] | https://www.vitacost.com/products/further-food-grass-fed-collagen-peptides-unflavored-9-88-oz-280-g-90212 (brand site shows $24.99–$25.00 for unflavored, size not shown [B][U]) |
| Further Food | Grass-Fed Collagen Peptides, Unflavored | 21.16 oz (600 g) | $49.99 | $2.36 | 100% grass-fed | [3P] | https://www.vitacost.com/products/further-food-grass-fed-collagen-peptides-unflavored-21-16-oz-600-g-138697 |

## 3. Zeolite (clinoptilolite) powder, food grade

Zeotein: ½ lb $29.99 ($3.75/oz) · 1 lb $64.99 ($4.06/oz) · 2 lb $79.99 ($2.50/oz).

| Brand | Product | Net wt | Price | $/oz | Grade / notes | Label | Source |
|---|---|---|---|---|---|---|---|
| Zeolite Pure (Healthy by Nature) | Zeolite Pure Powder | 400 g (14.1 oz) | $52.95 | $3.75 | 94% clinoptilolite, third-party tested in the US | [3P] | https://reach.dog/shop/healthy-by-nature/products/zeolite-pure-powder (TikTok Shop $52.99; no brand-site page found) |
| Zeo Health | Zeolite Pure (Powder) | 400 g (14 oz) | $54.00 | $3.83 | — | [3P] | https://reach.dog/shop/andrew-kaufman-md/products/zeohealth-zeolite-pure (eBay $52.99: https://www.ebay.com/p/1900480346; one buyer comment there alleges a past recall, unverified) |
| Aviva | Zeolite Clinoptilolite Mineral Powder | ½ lb (227 g) | $46.99 | $5.87 | Described as food grade, micronized | [B] | https://avivahealth.com/products/zeolite-powder |
| Piping Rock (Inner Health) | Micronized Zeolite | 400 g (14.11 oz) | $45.99–$52.00 | $3.26–$3.69 | — | [B] [U] (two snapshot prices) | https://www.pipingrock.com/detox-supplements/zeolite-micronized-400-g-1411-oz-bag-40678 |
| Healthy by Nature (mass) | HolyLand Zeolite Cleanse, at Amazon | 400 g (14.1 oz) | $38.21 (15% off) | $2.71 | — | [3P] | https://www.amazon.com/HolyLand-Zeolite-Detox-Cleanse-Powder/dp/B082C4X7NZ |
| KARN (mass) | Zeolite powder, 95% clinoptilolite, at Amazon | 1 lb | $29.99 ($26.99 Subscribe & Save) | $1.87 | Food grade not stated | [3P] [U] (seen in an Amazon search snippet; the listing URL was not isolated) | https://www.amazon.com/zeolite-powder-food-grade/s?k=zeolite+powder+food+grade |

- **Purezeo:** no listing found in two searches.
- **"Mind Body Health":** no zeolite listing found. Zeolite Pure appears under Healthy by Nature and Zeo Health.
- **Excluded:** non-food-grade listings, such as a $12.78 1 lb product that is out of stock and garden-grade bags.

## 4. Organic MCT oil powder

Zeotein: ½ lb $21.99 ($2.75/oz) · 1 lb $36.99 ($2.31/oz) · 2 lb $58.99 ($1.84/oz, range top).

| Brand | Product | Net wt | Price | $/oz | Organic | Label | Source |
|---|---|---|---|---|---|---|---|
| Sports Research | Organic MCT Oil Powder, Unflavored, 30 servings | 10.6 oz (300 g) | $24.95 ($21.21 subscription) | $2.35 ($2.00) | USDA organic | [B] | https://www.sportsresearch.com/products/mct-oil-powder |
| Garden of Life | Dr. Formulated Keto Organic MCT Powder | 10.58 oz (300 g) | $26.39 | $2.49 | USDA organic; contains acacia fiber and probiotics, so not single-ingredient | [B] | https://www.gardenoflife.com/keto-organic-mct-powder (an older listing shows $24.79 [U]) |
| Perfect Keto | MCT Oil Powder, 30 servings (only flavored versions seen) | about 11.6 oz (30 × about 11 g) | from $40.99 | about $3.52 | Not organic | [B] [U] | https://perfectketo.com/ |
| Sports Research | Organic MCT Oil Powder, at Walmart / Target | 10.6 oz | $24.95 / $27.45 | $2.35 / $2.59 | USDA organic | [3P] | https://www.walmart.com/c/kp/mct-powder ; https://www.target.com/s/mct+oil+powder |
| Nutricost (mass) | Organic MCT Oil Powder | 1 lb (½ lb option) | $32.97 (½ lb $20.97) | $2.06 ($2.62) | USDA organic | [B] (a second Nutricost page shows $39.95 [U]) | https://nutricost.com/products/nutricost-organic-mct-oil-powder |
| Nutricost (mass) | Organic MCT Oil Powder, at Walmart | 1 lb | $29.99 | $1.87 | USDA organic | [3P] [U] (page about 540 days old) | https://www.walmart.com/ip/Nutricost-Organic-MCT-Oil-Powder-1LB-Organic-Medium-Chain-Triglycerides-Vegetarian-Gluten-Free/13253601936 |
| Micro Ingredients (mass) | Organic MCT Oil Powder with Prebiotic Fiber, at Walmart / Target | 1 lb | $29.95 / $32.99 | $1.87 / $2.06 | Organic | [3P] | https://www.walmart.com/c/kp/mct-powder ; https://www.target.com/s/mct+oil+powder |
| Nutricost (reference only) | MCT Oil Powder, unflavored | 2 lb | $38.95 | $1.22 | **Not organic** | [3P] | https://www.walmart.com/c/kp/mct-powder |

- **NOW Foods:** no organic MCT powder found. nowfoods.com lists organic MCT only as a liquid, 16 fl oz at $24.99 ([nowfoods.com](https://www.nowfoods.com/products/sports-nutrition/mct-oil-organic)).

## 5. Sea moss powder

Zeotein: ¼ lb $34.99 ($8.75/oz) · 1 lb $109.99 ($6.87/oz, range top). The ½ lb price is not in the internal notes. Variants are ¼, ½ and 1 lb (`prod90.txt`), and all three ads-feed titles read "Organic Sea Moss Powder — Wildcrafted, 8oz".

| Brand | Product | Net wt | Price | $/oz | Organic | Label | Source |
|---|---|---|---|---|---|---|---|
| Nutricost (mass) | Organic Irish Sea Moss Powder (Chondrus crispus, whole plant) | 1 lb (454 g) | $30.97 | $1.94 | USDA organic | [B] | https://nutricost.com/collections/best-sellers/products/nutricost-organic-irish-moss-powder |
| Nutricost (mass) | as above, at Vitacost | 1 lb (454 g; Vitacost lists 16.2 oz) | $27.95 sale | $1.75 | USDA organic | [3P] | https://www.vitacost.com/products/nutricost-organic-irish-sea-moss-powder-unflavored-16-2-oz-454-g-124174 |
| Ocean's Balance | Organic Sea Moss Powder (Chondrus canaliculatus, Maine) | 1 lb | $24.95 (collection page $26.95) | $1.56–$1.68 | USDA organic | [B] [U] (shown sold out) | https://oceansbalance.com/products/organic-sea-moss-powder |
| BareOrganics | Organic Irish Sea Moss Powder, at Vitacost | 8 oz (227 g) | $23.99–$25.19 | $3.00–$3.15 | Organic | [3P] | https://www.vitacost.com/products/bareorganics-organic-irish-sea-moss-powder-8-oz-227-g-131806 |
| BareOrganics | as above, at H-E-B | 8 oz | $29.98 | $3.75 | Organic | [3P] | https://www.heb.com/product-detail/-/12813524 |
| BulkSupplements (mass) | Organic Sea Moss Powder, at Walmart | 250 g (8.8 oz) | $18.97 | $2.15 | Organic | [3P] | https://www.walmart.com/ip/BulkSupplements-Organic-Sea-Moss-Powder-2g-per-Serving-250-Grams-8-8-oz-125-Servings/1224581003 (brand site $23.97 = $2.72, marked out of stock [B][U]: https://www.bulksupplements.com/products/organic-sea-moss) |
| BulkSupplements (mass) | Organic Irish Sea Moss Powder, at Amazon | 1 kg (35.3 oz) | $40.97 | $1.16 | Organic | [3P] | https://www.amazon.com/BULKSUPPLEMENTS-COM-Organic-Irish-Moss-Powder/dp/B0C54FLGT3 |
| TrueSeaMoss | Premium Vitamin Complex Sea Moss Powder (a blend, not single-ingredient) | 8 oz (227 g) | $49.99 | $6.25 | — | [3P] [U] | https://www.vitacost.com/products/true-sea-moss-premium-vitamin-complex-sea-moss-powder-8-oz-227-g-146333 |

- **TrueSeaMoss:** no single-ingredient powder found.
  - Its brand-site "Organic Irish Sea Moss Powder 8 in 1" is $60.00, size not shown [B][U] ([trueseamoss.com](https://trueseamoss.com/products/green-powder)).
  - Its raw dried sea moss, sold for making gel rather than as a powder, is $23.99 for 16 oz on Amazon, $1.50/oz ([amazon.com](https://www.amazon.com/Organic-Sea-Moss-Raw-TrueSeaMoss/dp/B08KD4SWPZ)).
- **Akua:** sells kelp foods only, no sea moss powder ([akua.co](https://akua.co/collections/kelp-jerky)).
- **Micro Ingredients:** no sea moss powder found on its site.

## 6. Lion's mane mushroom powder (fruiting body)

Zeotein: ½ lb $39.99 ($5.00/oz) · 2 lb $119.99 ($3.75/oz, range top). Variants are ½, 1 and 2 lb (`prod90.txt`).

| Brand | Product | Net wt | Price | $/oz | Organic / source material | Label | Source |
|---|---|---|---|---|---|---|---|
| Real Mushrooms | Organic Lion's Mane Powder (extract) | 60 g (2.1 oz) | from $34.95 | $16.51 | USDA organic; fruiting bodies only; an **extract**, not like-for-like | [B] | https://realmushrooms.com/products/organic-lions-mane-mushroom-powder-supplement |
| FreshCap | Lion's Mane Mushroom Extract Powder (14:1, at least 31% beta-glucans) | 60 g (2.1 oz) | $39.99 | $18.89 | Organic; 100% fruiting body; an **extract** | [B] [U] (page about 671 days old) | https://freshcap.com/products/lions-mane-mushroom-extract-60g-powder |
| Om | Lion's Mane Organic Mushroom Powder, 90 servings | 180 g (6.35 oz) | $42.99 | $6.77 | Organic; mycelium and fruit body cultured on organic oats | [B] | https://ommushrooms.com/pages/shop/lions-mane |
| Om | Lion's Mane Mushroom Superfood, at Walmart | 100 g (3.5 oz) | $23.78 | $6.74 | as above | [3P] | https://www.walmart.com/ip/Om-Lions-Mane-Mushroom-Superfood-100g/197492792 |
| Nutricost (mass) | Organic Lion's Mane Mushroom Powder, at Walmart / Amazon | 1 lb | $39.95 (Amazon Subscribe & Save $33.96) | $2.50 | USDA organic; fruiting body per the listing | [3P] | https://www.walmart.com/ip/Nutricost-Organic-Lion-s-Mane-Mushroom-Powder-1-lb-Supplement-454-Servings/704722297 ; https://www.amazon.com/Nutricost-Organic-Lions-Mushroom-Powder/dp/B07W8W2PS6 (Walmart also lists 8 oz at $22.95 = $2.87 and 4 oz at $13.95 = $3.49) |
| Micro Ingredients (mass) | Organic Lion's Mane Mushroom Powder | 16 oz / 8 oz | $38.95 sale ($44.95 regular) / $24.95 | $2.43 ($2.81) / $3.12 | Organic; fruiting body and mycelium | [B] [U] (sizes showed sold out) | https://www.microingredients.com/products/organic-lions-mane-mushroom-powder |
| NatureBell (value) | Organic Lion's Mane Powder, at Amazon | 1 lb | $21.99 (Subscribe & Save $18.69) | $1.37 | Organic; fruiting body and mycelium | [3P] | https://www.amazon.com/Organic-Lions-Mane-Powder-1lb/dp/B0CFP9DF3C |

## 7. Organic fermented / raw cacao powder

Zeotein: ½ lb $17.99 ($2.25/oz) · 2 lb $48.99 ($1.53/oz).

| Brand | Product | Net wt | Price | $/oz | Organic | Label | Source |
|---|---|---|---|---|---|---|---|
| Navitas Organics | Organic Cacao Powder | 8 oz | $14.99 ($11.99 subscription) | $1.87 | Organic; regenerative certified; Fairtrade | [B] | https://navitasorganics.com/products/cacao-powder |
| Navitas Organics | Organic Cacao Powder | 16 oz | $27.99 ($22.39 subscription) | $1.75 | as above | [B] | https://navitasorganics.com/products/cacao-powder |
| Navitas Organics | Organic Cacao Powder | 24 oz | $34.99 ($27.99 subscription) | $1.46 | as above | [B] | https://navitasorganics.com/products/cacao-powder (page data: offers valid 11 Nov 2026 to 10 Feb 2027; Navitas says it raised cacao prices) |
| MRM Nutrition | Organic Fermented Cacao Powder, at Vitacost | 8.5 oz (240 g) | $12.99 | $1.53 | Organic, fermented | [3P] | https://www.vitacost.com/products/mrm-nutrition-organic-fermented-cacao-powder-8-5-oz-240-g-96388 |
| MRM Nutrition | as above, at Target | 8.5 oz | $13.99 | $1.65 | Organic, fermented | [3P] | https://www.target.com/p/mrm-nutrition-organic-fermented-cacao-powder-8-5-oz-240-g/-/A-82569817 (Walmart snapshots show $14.09–$14.19 = $1.66–$1.67 [3P]) |
| Viva Naturals (mass) | Organic Cacao Powder, at Walmart | 2 lb | $33.99 | $1.06 | Organic | [3P] | https://www.walmart.com/ip/113166186 (Amazon $33.99 per a Slickdeals thread updated 3 Feb 2026 [3P][U]) |
| Terrasoul | Raw Organic Cacao Powder | 16 oz / 2 lb | $19.99 / $36.99 | $1.25 / $1.16 | Organic, raw | [B] [U] (indexed about 1,000 days ago) | https://www.terrasoul.com/products/cacao-powder |
| Terrasoul | Raw Organic Cacao Powder, at Walmart | 1 lb | $17.99 | $1.12 | Organic, raw | [3P] [U] (listing URL not isolated) | https://www.walmart.com/ip/960093969 or https://www.walmart.com/ip/815460317 |

## 8. Organic hemp protein powder

Zeotein: ½ lb $21.99 ($2.75/oz) · 1 lb $36.99 ($2.31/oz) · 2 lb $58.99 ($1.84/oz, range top).

| Brand | Product | Net wt | Price | $/oz | Organic | Label | Source |
|---|---|---|---|---|---|---|---|
| Manitoba Harvest | Hemp Yeah! Organic Max Protein, Unsweetened | 16 oz presumed (the "from" price; the site lists 16 and 32 oz) | from $20.89 | $1.31 | USDA organic | [B] [U] | https://manitobaharvest.com/products/max-protein-unsweetened |
| Manitoba Harvest (mass) | Organic Max Protein, Unsweetened, at Vitacost | 32 oz | $29.49 | $0.92 | Organic | [3P] | https://www.vitacost.com/manitoba-harvest-hemp-pro-70-protein-supplement |
| Manitoba Harvest (mass) | as above, at Walmart / Amazon | 32 oz | $33.93 (Amazon Subscribe & Save $28.84) | $1.06 ($0.90) | Organic | [3P] | https://www.walmart.com/ip/Manitoba-Harvest-Organic-Max-Protein-Powder-Hemp-Yeah-Hemp-Protein-Powder-Unsweetened-32-oz-2-lb/30148642 ; https://www.amazon.com/Manitoba-Harvest-Protein-Serving-Non-GMO/dp/B005VUHCGY (another Walmart snapshot shows $45.23 [U]) |
| Nutiva | Organic Hemp Protein, Peak Protein | 16 oz / 3 lb | $20.99 / $50.99 | $1.31 / $1.06 | USDA organic | [B] [U] (cached about 1,690 days ago) | https://nutiva.com/products/organic-hemp-protein-powder |
| Nutiva (mass) | Organic Hemp Protein, Peak Protein, at Amazon | 16 oz | $18.57 (Subscribe & Save $15.78) | $1.16 | USDA organic | [3P] | https://www.amazon.com/Organic-Cold-Pressed-Protein-Powder-Pound/dp/B001JU81ZG |
| Nutiva (mass) | as above, at H-E-B / Vitacost | 16 oz | $18.98 / $21.49 | $1.19 / $1.34 | USDA organic | [3P] | https://www.heb.com/product-detail/nutiva-organic-hemp-protein/1705666 ; https://www.vitacost.com/nutiva-organic-hemp-protein-powder-peak-protein |

## 9. Organic pumpkin seed protein powder

Zeotein (verified 10 Nov): 8 oz $19.99 ($2.50/oz) · 16 oz $36.99 ($2.31/oz) · 32 oz $56.99 ($1.78/oz).

| Brand | Product | Net wt | Price | $/oz | Organic | Label | Source |
|---|---|---|---|---|---|---|---|
| Sprout Living | Simple Protein, Organic Pumpkin Seed, Unflavored | 1 lb | $32.95 (subscription about $28.01) | $2.06 | Organic | [B] [U] (snapshots 444–1,808 days old) | https://sproutliving.com/products/organic-pumpkin-seed-protein-powder-unflavored-2 |
| NOW Foods | Pumpkin Seed Protein, Organic Powder | 1 lb | $32.99 | $2.06 | Organic | [B] (snapshot about 85 days old; some pages show out of stock) | https://www.nowfoods.com/products/sports-nutrition/pumpkin-seed-protein-organic-powder |
| Food to Live | Organic Raw Pumpkin Seed Protein Powder (60% protein) | 8 oz / 1 lb | $13.12 / $19.85 | $1.64 / $1.24 | Organic | [B] | https://foodtolive.com/shop/organic-pumpkin-seeds-powder/ |
| Food to Live | Organic Toasted Pumpkin Seeds Protein Powder | 8 oz | $15.14 | $1.89 | Organic | [B] | https://foodtolive.com/shop/organic-toasted-pumpkin-seeds-protein-powder/ |
| Micro Ingredients (mass) | Organic Pumpkin Seed Protein Powder | 2 lb | $29.99 | $0.94 | Organic | [B] [U] (sold out at snapshot) | https://www.microingredients.com/products/micro-ingredients-organic-pumpkin-seed-protein-powder-2lb |
| Anthony's Goods (mass) | Organic Pumpkin Seed Protein Powder | 1 lb | $17.09 | $1.07 | Organic | [B] | https://anthonysgoods.com/products/organic-pumpkin-seed-protein-powder |

- **Sunfood:** pumpkin protein appears only inside blends, such as Supergreens & Protein at 8 oz for $19.99 ([sunfood.com](https://www.sunfood.com/collections/protein)).
- **Navitas:** no pumpkin seed protein found.

## 10. Shaker bottle, 27–28 oz (price only)

Zeotein: CleanBlend Shaker, 27 oz, USA-made, $15.99 (`shopify-catalog-before-cleanup.tsv`).

| Brand | Product | Price | Label | Source |
|---|---|---|---|---|
| BlenderBottle | Classic, 28 oz | $10.99 ("from $9.99" depending on color; shown sold out at snapshot) | [B] | https://www.blenderbottle.com/products/classic-v1 |
| BlenderBottle | Classic, 28 oz, Clear/Blue, at Walmart | $11.50 | [3P] | https://www.walmart.com/ip/BlenderBottle-28oz-Classic-Shaker-Cup-Clear-Blue/39969625 |
| BlenderBottle | Classic, 28 oz, FC Black / Pebble Gray / Clear-Red, at Walmart | $19.99–$30.00, mostly out of stock | [3P] [U] (probably marketplace sellers) | https://www.walmart.com/ip/BlenderBottle-28oz-Classic-Shaker-Cup-FC-Black/450963740 |
| BlenderBottle | Classic, 28 oz, 2-pack, at Amazon | $29.99 (about $15.00 each) | [3P] | https://www.amazon.com/Blender-Bottle-Classic-Shaker-28-Ounce/dp/B06XDCB2DP |

---

## What changed against the 10 Nov snapshot (section 6 of pricing-research.md)

1. **Sea moss: the sizes were wrong, and this is the biggest change.**
   - Nov 10 assumed the price range covered 8 oz to 32 oz, giving $4.37 → $3.44/oz.
   - The variants are actually ¼, ½ and 1 lb, and ¼ lb is $34.99. That puts Zeotein at **$8.75/oz (¼ lb) and about $6.87/oz (1 lb)**.
   - The 1 lb price is 3.5–4.4x the 1 lb organic powders: Nutricost $1.75–$1.94 and Ocean's Balance $1.56.
   - The ¼ lb price is 2.3–2.9x BareOrganics 8 oz ($3.00–$3.75) and about 40% above TrueSeaMoss's blend ($6.25).
   - Nov 10's "1.1x boutique, about 2x mass" no longer holds.
   - All three ads-feed titles read "8oz", which may be where the assumption came from.
2. **Collagen.**
   - Vital Proteins now sells a 20 oz canister at $47.00 list, replacing the 19.3 oz tub at $45. The per-ounce price is unchanged at about $2.35.
   - Walmart sells the same tub at $31.97, or $1.60/oz. Zeotein's 2 lb ($2.34) is therefore about **46% above mass retail**, not 14–27% above value brands.
   - Zeotein's 1 lb ($2.94) is 25% above Vital's own list price and 43–45% above Sports Research and Great Lakes at 16 oz.
3. **Bone broth.**
   - Ancient Nutrition's prices are unchanged ($52.95 and $89.95), so "Zeotein 2 lb is 13% below Ancient Nutrition" still holds.
   - However, Ancient Nutrition is a chicken and beef blend. The single-ingredient grass-fed rival, Left Coast, sells 32 oz for $65.99 on its own site, or $2.06/oz. Zeotein's 2 lb ($2.50) is about **21% above** it.
   - Zeotein's ½ lb ($3.75) costs more per ounce than every 1 lb option found.
4. **Cacao.**
   - Navitas raised prices. Its own site now lists 24 oz at $34.99 ($1.46/oz), against $28.90 ($1.20) from a third party on Nov 10.
   - Zeotein's 2 lb ($1.53) is now only about 5% above Navitas, where Nov 10 had it 28–44% above. It is still 32–44% above Viva Naturals and Terrasoul at 2 lb.
   - Zeotein's ½ lb is 20% above Navitas 8 oz (Nov 10: 26–47%) and 35–47% above MRM.
5. **Hemp.**
   - Manitoba Harvest's 2 lb now costs $29.49–$33.93 ($0.92–$1.06/oz), against $26.89 ($0.84) on Nov 10.
   - Zeotein's 2 lb is therefore **1.7–2.0x**, not 2.2x. Zeotein's 1 lb ($2.31) is about 1.8x the brand-site 16 oz prices ($1.31).
6. **Pumpkin seed.**
   - Micro Ingredients' own site lists 2 lb at $29.99 ($0.94/oz), against $34.99 ($1.09) on Nov 10. That makes Zeotein's 2 lb **1.9x**, not 1.6x, though the item was sold out.
   - Against premium 1 lb bags (Sprout Living and NOW at $2.06/oz), Zeotein's 1 lb ($2.31) is only 12% higher.
   - Zeotein's ½ lb is 52% above Food to Live raw at 8 oz. Nov 10 had 32%, measured against the toasted version.
7. **Lion's mane.**
   - Om now costs $6.74–$6.77/oz, against $5.36 on Nov 10, so Zeotein's ½ lb ($5.00) is **26% below Om**, not 7%.
   - The gap to mass brands is unchanged: Zeotein's 2 lb is 50–54% above Nutricost and Micro Ingredients.
   - Om and Micro Ingredients include mycelium. Nutricost, at $2.50/oz, is the closest fruiting-body-only mass comparator.
8. **MCT.**
   - Garden of Life's own site lists $26.39 ($2.49/oz). Nov 10 had $21.97 ($2.08) from a Target search page.
   - Zeotein's ½ lb is now 10–17% above the premium tubs (Nov 10: 17–32%). Its 2 lb ($1.84) is level with mass organic 1 lb bags ($1.87).
9. **Zeolite.**
   - Prices are unchanged: Zeolite Pure $52.95 for 400 g ($3.75/oz), Aviva $46.99 for 8 oz ($5.87/oz).
   - Label fix: avivahealth.com is Aviva's own site, so it should be [B], not [3P].
   - Internal notes put Zeotein's 1 lb at $64.99 ($4.06/oz). That is above Zeotein's own ½ lb and above Zeolite Pure, so the size ladder is inverted.
10. **Shaker.** Zeotein's $15.99 is about 40–45% above BlenderBottle Classic 28 oz ($10.99 on the brand site, $11.50 at Walmart).
