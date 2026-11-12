# Pricing audit, November 12, 2026

Visual report: https://claude.ai/artifact/UyCZzNGPsgaQoumqUNJTpQ (private). The same page is in `../report/zeotein-pricing-audit.html`; rebuild it with `python3 audit/scripts/pricing/build_pricing.py`.

## Answers

| Question | Answer |
|---|---|
| Is pricing the problem? | No. Cacao bag $3.67/serving and sticks $4.50 sit at or below Ka'Chava ($4.66). The Meta-page first bag, $76.99 delivered for 30 servings, is one of the best first-order deals in the set. Cacao only looks expensive next to bone-broth and collagen tubs ($1.67–$3.00/serving). Per 10 g of protein it's $1.59, level with Paleovalley ($1.54). |
| Is it costs? | Not product costs. Bag COGS $29.04 (down from $35.71 in May), 74% product margin; full-price orders leave $57–$75 after label, box and card fees. Since July marketing has averaged $8,690/month against $7,110/month of gross profit. October: $7,074 marketing, 17 new customers, net loss $12,882. |
| Do they just want free shipping? | Unproven. Email-captured checkouts finish at 74% with or without a shipping charge, and cheaper Ground rates didn't lift completion. But in October 102 sessions reached checkout and 31 finished; most leavers never typed an email, so that data can't see them. Test it. |
| 7-Day priced higher per serving? | Yes, and correctly: +56% per serving over the bag vs a market median of +57% for single-serve formats. Keep $39.99. Shipping ($10.23 average) takes it to $7.17/serving. |
| $150 line? | Doing nothing: 36 web orders at $99–$149.99 vs 8 at $150–$174.99 in 90 days. A bag plus a 7-Day is $149.98. |

## Shipping facts (90 days, Aug 14 – Nov 11, US)

- Rates are Shopify's USPS price plus a $2.00 handling fee (median markup over the real label: $2.00). Shoppers who paid shipping paid $11.95 (sticks) to $12.39 (bag) on single-item orders; labels averaged $8.88 and $9.52.
- 78 of 102 renewals paid shipping, $11.37 average. The automatic discount "Free shipping" (subscriptions, $119.99+, since Mar 3) never reaches renewals: all 35 renewals between $119.99 and $149.99 paid shipping. Renewals of $150+ ship free (the $150 rate). Funnel-profile subscriptions ship free.
- Cost of free shipping, shipping revenue given up per month (last 30 days / last 90 days): every web order $153 / $311; $35+ $124 / $257; $99+ $27 / $173; every renewal $232 / $300.
- Rivals: free-shipping lines are $25–$99; subscriptions ship free at 9 of 13 (`competitor-quality-2026-11-12.md`).

## Holiday free-shipping test (awaiting Dana's yes)

- Free US shipping on orders of $35+, one-time and first subscription orders; renewals untouched.
- Dec 1, 2026 12:00 am CT to Jan 11, 2027 11:59 pm CT. Not during Black Friday: all 13 scheduled BF discounts have `combinesWith.shippingDiscounts = false`.
- Set up as one automatic free-shipping discount (US, $35 minimum, `appliesOnOneTimePurchase: true`, `appliesOnSubscription: true`, `recurringCycleLimit: 1`, combines with product and order discounts, start and end dates). No change to delivery profiles.
- Cost about $175–$355 over six weeks; break-even 2–4 extra new customers.
- Baseline Oct 13 – Nov 23. Exclude internal test sessions (Nov 4–5, Nov 10–11). Keep if new customers per 1,000 sessions are 15%+ above baseline and margin per 1,000 sessions holds.

## Unit economics used

| Order | Customer pays | Left after product, label, box, fees, gifts |
|---|---|---|
| Bag one-time (store) | $122.38 | $75.18 |
| Bag renewal (store) | $112.38 | $68.81 |
| Bag first order (Meta page, $76.99) | $76.99 | $26.63 |
| Bag renewal (Meta-page subscriber) | $99.99 | $56.83 |
| 30 sticks renewal (store) | $126.94 | $74.57 |
| 7-Day one-time | $50.22 | $30.81 |
| Black Friday first bag ($68.99) | $68.99 | $18.89 |

Inputs: Wennie's COGS V2 October weighted average (bag $29.04, 30 sticks $38.00, 7-Day $9.00); real labels matched to orders (bag $9.52, sticks $8.88, 7-Day box $7.45); box $1.30; card fees 3.3%; shaker $4.66, Save-A-Scoop $3.30. A Meta-page bag subscriber is worth about $160 over the observed 3.35 payments; at $176 per new customer the average subscriber doesn't pay back.

## Smaller fixes

- Zeolite 1 lb ($64.99, $4.06/oz) costs more per ounce than ½ lb ($3.75/oz). Suggest $54.99 ($3.44/oz).
- Vegan: leave the price and don't invest; it still brought $2,311 in 90 days, mostly existing customers.
- Singles priced above Amazon (hemp, pumpkin seed, sea moss, lion's mane) will lose Google Shopping price comparisons.
- No testing claims on the site; rivals show NSF/Informed Sport or published lab results. Any zeolite wording must avoid detox or binding claims.

## Corrections to the Nov 11–12 notes

- The win-back workflows are live (customer journey map): 90-day lapsed, subscription cancelled (128 enrolled), purchase exit, Switch to subscription (since Oct 29), Day 24 reorder clock. The earlier "in draft since Aug 3" claim came from an old Decision Log entry.
- Meta destinations are Dana's and the media buyer's call; the product-page recommendation is withdrawn.
- Vegan Starter Kit shipping change withdrawn.
- "Keep $150" replaced by the holiday test.

## Sources

Shopify Admin (live, Nov 12): products, selling plans, delivery profiles, discounts, ShopifyQL sales and sessions. 90-day order export joined to the label log (153 of 248 orders matched; no customer details used). Wennie's COGS V2, shipping-box/label workbook and Jan–Oct P&L. Seal export figures and Master Pricing v2 via the Decision Log. Competitor data: `pricing-research.md` (Nov 10) and `competitor-quality-2026-11-12.md` (Nov 12). Cart abandonment reasons: [Baymard Institute](https://baymard.com/blog/cart-abandonment-rate).
