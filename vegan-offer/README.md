# Vegan Starter Kit offer page: build sheet

Status 19 Nov 2026: **built as a preview, not in GoHighLevel yet, not published.**
GoHighLevel's API cannot clone a funnel or edit page content, so the clone and the swaps
below are done in the GHL editor (about 15 minutes). The live Cacao funnel `7YlIu85HLKPF0F6kmrpH`
is never edited: only cloned.

Phone preview of the finished page (the Cacao page with every swap below applied):
`screens/vegan-starter-kit-phone-1.png` to `-4.png`.

## 1. Clone (GHL, 2 minutes)

1. Sites, Funnels, the Cacao offer funnel, three dots, **Clone**. Do not open the original.
2. Name the clone **Vegan Starter Kit Offer**.
3. Keep one page (the light control page). Delete the dark-hero variation in the clone.
4. Page path: **/vegan-starter-kit**, domain **offer.zeotein.com**.
5. Leave it unpublished (do not add it to any ad, do not add a redirect).

## 2. Text swaps (every one is in the preview)

| Cacao page says | Vegan page says |
|---|---|
| GRASS-FED BONE BROTH + COLLAGEN PROTEIN | ORGANIC PUMPKIN SEED + HEMP PROTEIN |
| 23G PROTEIN. SIX INGREDIENTS. ZERO SUGAR. | 20G PLANT PROTEIN. FIVE INGREDIENTS. ZERO ADDED SUGAR. |
| Intentionally unsweetened cacao. | Intentionally plant-based. Intentionally unsweetened. |
| ZEOTEIN CACAO · 30-Day Bulk Bag | ZEOTEIN VEGAN · 30 Stick Packs |
| $76.99 / $172.97 / 55% OFF | **$79.99 / $190.98 / 58% OFF** |
| Starter Kit $62.98 value | **$55.99 value** (shaker $15.99 + 3 guides $40) |
| Renews at $89.99 per order | **First order $79.99, then renews at $114.99 per order** |
| Stat cards: 23g grass-fed protein · ZERO sugar · 140 calories · 6 ingredients, zero junk | 20g plant protein · ZERO added sugar · 170 calories · 5 intentional ingredients |
| Badge "Zero sugar" | "Zero added sugar" |
| 30-DAY BULK BAG + STARTER KIT | 30 STICK PACKS + STARTER KIT |
| What's included: 30-Day Cacao Bulk Bag $109.99 → $76.99 | 30 Vegan Stick Packs $134.99 → $79.99 |
| Save-A-Scoop $6.99 FREE | **Delete the row** (sticks, no scoop) |
| Page title / share title | Zeotein Vegan Starter Kit \| Free Shaker + 3 Guides |

Fine print stays as is: it already says the intro price is for first-time subscribers only,
one per customer, and every order after the first renews at the price shown.

## 3. Label panel

| Line | Vegan |
|---|---|
| Serving size | 1 Stick Pack (42g), 30 per container |
| Calories | 170 |
| Total Fat | 6.5g (8%) |
| Saturated Fat | 2g (10%) |
| Sodium | 145mg (6%) |
| Total Carbohydrate | 5g (2%) |
| Dietary Fiber | 2g (7%) |
| Total Sugars | **copy from the printed Vegan label** (not on file; 0g added sugar) |
| Protein | 20g |
| Blend | Zeotein Vegan Protein Blend, **weight from the printed label** |
| Ingredients (5) | Organic Pumpkin Seed Protein · Organic Hemp Protein · Organic MCT Oil Powder · Zeolite (Clinoptilolite) · Organic Sea Moss (Gracilaria spp.) |

The %DV figures are computed from the label numbers against FDA daily values; check them
against the printed panel before publishing.

## 4. Reviews (real Judge.me Vegan reviews, verified buyers)

Use these six; remove the other three Cacao cards. Never use the "lost 5 lbs" or "clear mind" reviews.

1. "Love the nutty flavor and texture. Great product, and I highly recommend it!" K.W.
2. "Great taste and mixes very well" Josh Moon
3. "Easy-peasy to use. Love the product." Anonymous
4. "Almost as good as the cacao! I just add to it but I like it just the same." Anonymous
5. "Taste great and it only took a week to get to Australia" Scott Haugen
6. "Great brand and concept" Anonymous

Rating line stays "4.9/5 · Verified Buyers" (Vegan average 4.88).

## 5. Images

| Spot | Use |
|---|---|
| Hero | `zeotein-vegan-protein-powder-gym-lifestyle-image-setting.png` (Shopify Files) |
| Offer block, product | `zeotein-vegan-protein-powder-stick-pack-image.png` (three sticks with seeds) |
| Offer block, gifts | **Needs a new image.** The Cacao gift image shows the Save-A-Scoop. Use shaker + 3 guides only. |
| Share image | `og-share-zeotein-starter-kit-62-98-vegan.jpg` already exists in GHL, but it says $62.98: needs a $55.99 version |

## 6. Buttons (all three)

```
https://zeotein.com/cart/add?id=68402055119061&quantity=1&selling_plan=VEGAN_OFFER_PLAN_ID&attributes[utm_content]=vegan_starter_kit
```

`68402055119061` is the variant of the new unlisted Shopify product
**Zeotein Vegan Starter Kit (offer page) - 30 Stick Packs** (`zeotein-vegan-starter-kit-offer`).
Replace `VEGAN_OFFER_PLAN_ID` with the monthly plan ID once the Seal plan exists (step 7).
Until then the product cannot be bought at all: it is set to "subscription only", and a cart test
returned "Variant can only be purchased with a selling plan".

## 7. Seal plan (Dana, about 3 minutes)

Seal, Subscription rules, new rule on **Zeotein Vegan Starter Kit (offer page) - 30 Stick Packs** only:

- Every 30 days, every 6 weeks, every 8 weeks
- Fixed price **$79.99 on the first order**, then **$114.99 on every order after**
- Plan names (customer sees them): "30 stick packs every 30 days · Starter Kit included with your first order (shaker + guides)", same for 6 and 8 weeks
- Internal name: "VEGAN OFFER | Vegan 30 Sticks | $79.99 first, $114.99 after"

## 8. Gifts: wiring status

The Cacao offer's gifts reach the customer two ways: Shopify Flow adds the shaker and scoop to the
order after purchase, and the guides arrive through the "GUIDES · First protein-blend order" Flow and
Digital Products. Neither is reachable through the API, so these need the Shopify admin:

1. **Shopify Flow** (the shaker Flow used by the Cacao offer): add the new product as a trigger
   condition, shaker only, no scoop.
2. **"Stick Pack Kit bonus"** automatic discount (shaker + 3 guides free): add the new product
   under Customer buys. Shopify refused the API edit because the store is at its cap of
   25 automatic discounts; even editing one counts.
3. **Theme**: add product `15560508408021` to `veganProducts` in `snippets/zt-guides-cart-data.liquid`
   (live theme and the "Live + FAQ, gifts and Difference page" theme) so the guides land in the cart.

## 9. Offer emails

No offer sequence is built for this page yet. Any sequence that sends this offer must check the
**Sale active** flag before every send, so nothing offer-based goes out Nov 20 to Dec 1.

## 10. Before publish

- Seal plan created and plan ID in the three buttons
- Gifts wired (section 8) and a test order placed and refunded, or a checkout stopped before payment
- Label panel checked against the printed Vegan label
- Gift image without the scoop
- Dana's yes to publish, and Dana's yes to Jewels' Vegan ad test as a **new campaign**
