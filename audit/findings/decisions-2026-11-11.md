# Decisions brief, November 11, 2026

Answers to Dana's Nov 11 questions. Data pulled Nov 11 (read-only). Full visual version: the "Decisions Nov 11" section of the audit report.

## Biggest money levers, ranked
1. Send Meta prospecting to the store product page. Last 30 days, same ad set: product page $64.92 per purchase (4 sales on $259.69); try./marketing./go. pages $415.61 per purchase (5 sales on $2,078.06). Add-to-cart: 30% of product-page visitors vs 4% on the landing page. Small sample, pixel attribution. Conflicts with the current guardrail, so Dana decides.
2. Pause zero-purchase spend: CONVERSIONS oSUBSCRIBE (~$37/day on Nov 9, 0 purchases, broken URL tags); westonprice ($149.55, 0 purchases, idle since Oct 27). About $1,100/month at Nov 9 pace.
3. Replace the influencer channel with commission-based creators/affiliates. New customers: Dec 164, Mar 94, Oct 17.
4. Retention: free renewal shipping (~$229/month now) pays if ~4 subscribers/month stay (each ~$54/month contribution). Win-back offer before Black Friday.
5. Store friction: BON launcher on phones (mobile ATC 4.2% vs desktop 6.7%), shipping, publish the script-error fix theme.

## Free shipping (revised Nov 12: keep $150 for now)
- Recommendation changed after reading the Decision Log (S-01, S-04, S-10, O-04, O-14) and re-running the Ground Advantage test at 60+ days.
- Checkout completion, US website checkouts Aug 15–Nov 11: shipping charged 74% (75 of 101); shipping free and under $150, mostly funnel kits, 74% (25 of 34). No difference.
- Ground test re-run (log S-01 definition, paid-shipping website orders): before Aug 15–Sep 6, 22 of 29 completed (75.9%), avg shipping $15.84 (matches the log); after Sep 7–Nov 11, 49 of 68 (72.1%), avg $10.24. Cheaper shipping did not raise completion. Oct 7–Nov 11 alone: 14 of 23 (60.9%).
- Seal charges renewals the cheapest available rate (log S-10), so any line under $99.99 makes renewals ship free automatically.
- Cost of lowering the line (US shipping no longer collected, actual orders Aug 14–Nov 11):

| Option | Now / month | Aug–Oct volume / month |
|---|---|---|
| $99 line | $209 (renewals $182, new $27) | $431 |
| $25 line, new and one-time | $151 | $292 |
| $25 line, renewals | $229 | $303 |

- $150 line is not raising cart size (90 days: 36 US store orders at $99–$150 paid shipping vs 8 at $150–$175), but keeping it costs nothing.
- Do instead: move the Vegan Starter Kit (zeotein-vegan-sticks-30-intro, General profile) into the "Funnel — free shipping" profile; revisit the line with bundle tiers (S-04 / P-06); use free shipping as a dated promo with a clean baseline (O-14 gift page).
- 7-day trial: keep $39.99; Master Pricing already rules these are priced high per stick on purpose (no discount, no subscribe option).
- Retention: top cancel reasons are "I still have product" and "Not the items I want" (Numbers Playbook), not shipping. Turn on the 7 retention workflows in draft since Aug 3 (O-15) before Black Friday.

## Google-only site (shop.zeotein.com)
- Good: FDA disclaimer on all pages, first-order guarantee wording, no detox/weight/energy claims, Google Ads tag AW-18130788543, Meta pixel, Clarity, click-ID carryover to store links, 4 store links return 200.
- Fix: add GA4 (cross-domain with zeotein.com); confirm the AW tag belongs to account 957-683-4317 and purchase is primary; Vegan Starter Kit charged shipping; "Organic MCT oil powder" wording; "Claim My 55% Off" counts gift value.
- Caution: policy limits follow products and claims; get exact reasons from Google Ads Policy manager and Merchant Center; never show Google different content than shoppers (circumventing systems). Cap the test (~$15/day, stop at $250 with no sale).

## Black Friday theme (187825914069) vs live
- BF = live (Nov 8) + sale marquee, zt-bf-hero section, product sale strip, plus 1 of 5 script fixes and a 69-byte test file (snippets/zt-write-test.liquid).
- Missing from BF: live's Nov 9 line in sections/header-cacao-lp.liquid (hides BON button and chat widget on cacao-protein-starter-kit).
- Still to port: header-custom.liquid, header-custom-drawer.liquid, cart-drawer.liquid, buy-box-cacao-lp-v2.liquid fixes (API URL-body writes fail silently on this theme; use the code editor).
- Copy conflicts: "30% off everything" vs "one-time orders"; /collections/all vs /collections/shop-all; sale strip renders on the gift-card product.
