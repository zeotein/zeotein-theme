# Zeotein GoHighLevel funnel audit (read-only)

Pulled 2026-11-10 from location Kch9YmRfzpmQrAs5Bchz through the Automator_Ai GHL connector. Nothing was created, edited, published, enrolled, tagged or sent. Shopify was only read (one GraphQL `nodes` lookup of 9 variant IDs). Contact names, emails and phones are deliberately left out of this file. Statements marked **DOC** come from the team decision log (`ad_decisions_clean.md` in this folder), not from the GHL API. Network access to the funnel domains is blocked from this container, so no path was HTTP-tested.

## Headline numbers

- Funnels in account: 296. Untouched Dec-2025 template imports: 259. Non-template funnels: 37 (14 domain-connected).
- Classification of the 37 non-template funnels: LIVE-IN-USE 6, LIVE-BUT-RETIRED 8, DORMANT 23.
- GHL URL redirects: 0 (`fetch-redirects-list` returned `count: 0`).
- GHL orders: 1,842 all-time; 258 created 2026-08-12..2026-11-10, every one `sourceType: external`, `sourceSubType: shopify` (synced Shopify orders, no funnel attribution).
- GHL order-form (funnel) orders: 100 all-time from the three Howie funnels (46 Howie 2.0, 45 Howie Final Version, 9 Test Site), by `sourceId`. 0 for each of the 7 other domain-connected funnels checked, including every approved one. The funnel transaction ledger names no other funnel.
- GHL funnel transactions: 114 all-time (2026-06-23..2026-09-07); 9 live-mode, 105 test-mode. Last 90 days: 10 (9 test, 1 live renewal on 2026-08-23).
- GHL subscriptions: 16, all `canceled` or `incomplete_expired`; none active.
- Form submissions (2026-09-11..11-10): 17; survey submissions: 7; contacts created: 147.
- Workflows: 110 (55 published, 55 draft). Workflow definitions are not readable: `get-workflow-definition` returns 403 `WORKFLOW_API_NOT_ENABLED_FOR_LOCATION`.

## (a) Domain map

No read operation lists domains (the funnels API has only getFunnels, getPagesByFunnelId, getPagesCountByFunnelId and the four redirect operations; `get-location` returns `"domain": ""`). The map below is built from domain names that GHL itself recorded on funnel routes, orders and submissions.

| domainId | Domain | Funnels on it | Evidence |
|---|---|---|---|
| RAvRDi2nx6JzyVA46Y5W | **go.zeotein.com** (confirmed) | ECf5BDptvwguPNefZikN, DE4OhGSMMY1uNuc5qeGT, bv1fI2cXX8tzW8NCy8zI, lCxlMY2Z4Hv0t4ZHzgVW | Purple step 1 `additionalRoutes: [{domain: "go.zeotein.com", lookupId: "nTcor4jSDsgdczuwtoHW", path: "/"}]`; all 114 funnel transactions (funnels DE4O…, SFrJu…, bv1f…) record `domain: go.zeotein.com`; Howie popup form and Purple survey submissions record `go.zeotein.com`. |
| F42MADkrYxJchsMp01eI | **marketing.zeotein.com** (confirmed) | hP8rlVYceQty6fjPFgXe, To0JJYumPq6qcm2fTKY5, 1LzRjMFaXI24eo2rKJWX, p3GJqD61mz9CGcLMDEsC, aJ57oms4DRVjZHAiLqCt, wcaIgZz5yfm2W6Jo9J8q, LhKFhCyhJiY1nKWzbwox, LMBnb2IIx4DXfvOvWs6c, gyWMkUIpp308SciACJyF | Survey submission 2026-10-13 on funnel aJ57oms4DRVjZHAiLqCt (this domainId) recorded `domain_name: marketing.zeotein.com`; Google tag linker in hP8r… lists `marketing.zeotein.com`; approved paths /starter-kit-page, /starter-kit-google, /stick-packs are steps/paths of funnels on this domainId. |
| ZkF0VpgHz6QCl2gUdD4Z | **gift.zeotein.com** (per team doc; not API-confirmed) | HodAoTBtFU3muDO5CxKB | Only funnel is HodAo… which the guardrails doc maps to gift.zeotein.com. API caveat: the 2026-10-07 Holiday Guide form submission recorded `domain_name: try.zeotein.com`, `page_url: /holiday-guide`, so on 7 Oct this funnel was served on try.zeotein.com. DOC (29 Oct) already cites gift.zeotein.com/holiday-guide. |
| (none) | try.zeotein.com | none today | No funnel currently on it and no GHL redirect exists, so its 301 to zeotein.com/products/cacao is not a GHL URL redirect. Where that 301 lives is not visible through the API. |

Domain-default ("root") bindings are not exposed by the API. The only root route visible is Purple's `additionalRoutes "/"`. In September the go.zeotein.com root served the Howie Bulk Bag page: both Howie popup submissions (2026-09-17, 09-22) record funnel lCxl…, page us01efzu0E7bz9i3tdwu, `page_url "/"`.

## (b) Non-template funnels (37)

Last updated = funnel `dateUpdated`. Paths = funnel path plus step paths as configured now. "Reachable" means configured on a connected domain; none were HTTP-tested.

| # | Funnel id | Name | Domain | Funnel path / step paths | Pages | Added | Last updated | Classification | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ECf5BDptvwguPNefZikN | Purple — Clean Protein Offer (ex-Howie) | go.zeotein.com | `/zeotein-offer-home` / /clean-protein, /cacao-protein-starter-kit-bag + root `/` (additionalRoutes) | 4 | 2026-10-15 | 2026-11-10 | **LIVE-IN-USE** | Approved destination go.zeotein.com/clean-protein (team doc). Step 1 is a live 50/50 split (split=true, controlTraffic 50, splitStartedAt 2026-10-15T12:30:33Z, no end) and carries additionalRoutes [{domain: go.zeotein.com, path: '/'}], i.e. a root route on go.zeotein.com (DOC earlier described the root as a domain-level Default Page binding; which binding wins today is not visible via API). Leads: 13 contacts with source 'Protein Label Test — Funnel Capture' created 2026-11-07..08; 3 completed survey submissions (survey Nr94AuqhnwPGS1Npa3zH) on 2026-11-07/08 recorded funnel_id ECf5BDptvwguPNefZikN, domain go.zeotein.com, page_url /cacao-protein-starter-kit (page ITj4…) and /cacao-starter-kit (page qcfw…), referrer facebook/instagram, campaign_id 120255245726920066. 0 GHL orders (list-orders sourceId=ECf5… totalCount 0) because buy buttons go to Shopify. |
| 2 | hP8rlVYceQty6fjPFgXe | Zeotein Cacao Starter Kit - GOOGLE ADS | marketing.zeotein.com | `/google-kit` / /starter-kit-google | 1 | 2026-10-30 | 2026-11-09 | **LIVE-IN-USE** | Approved Google destination marketing.zeotein.com/starter-kit-google (team doc). Carries the Google Ads tag AW-18130788543 in its Head tracking code (linker domains zeotein.com + marketing.zeotein.com); the only other funnel with that tag is the BF 2026 Google draft. Clone of LhKF… (originId). 0 GHL orders/forms (buttons go to Shopify). Page updated 2026-11-09T21:03. |
| 3 | aJ57oms4DRVjZHAiLqCt | Zeotein Quiz Funnel (Cacao or Vegan) New Version | marketing.zeotein.com | `/quiz` / /q1-9460, /q2-1246, /q3, /q4, /result-cacao-2454, /result-vegan-4655 | 6 | 2026-07-11 | 2026-11-08 | **LIVE-IN-USE (low volume; not an approved ad destination)** | 1 real lead in 60 days: survey 'Survey - Animal Based Protein for Funnel' (G4j5pHNhdtay5qecQrOc) submission 2026-10-13 recorded funnel_id aJ57…, page w7baewyiOViECF5iq5i5 (step Q3), domain marketing.zeotein.com, page_url /quiz/animal-goals, referrer facebook.com (fbclid). Published workflow 'QZ · Quiz leads · Quiz result nurture' (v121, updated 2026-11-09). DOC: '/q1-9460, which becomes /quiz' confirmed live 28 Oct; 'the quiz at the marketing.zeotein.com root'. Note recorded path /quiz/animal-goals differs from current step path /q3. |
| 4 | wcaIgZz5yfm2W6Jo9J8q | ZEOTEIN — Cacao 30-Day Stick Packs Starter Kit | marketing.zeotein.com | `/stick-packs` / /cacao-stick-packs-starter-kit | 1 | 2026-10-14 | 2026-11-08 | **LIVE-IN-USE** | Approved destination marketing.zeotein.com/stick-packs (team doc, approved for Meta 27 Oct). 0 GHL orders/forms (buttons go to Shopify). DOC Oct 21 audit: $10.35 Meta spend to /stick-packs in 30 days; DOC also records 'stick packs have never launched' as an open loop. Edited 2026-11-08T20:50. |
| 5 | LhKFhCyhJiY1nKWzbwox | Zeotein Cacao Starter Kit | marketing.zeotein.com | `/starter-kit` / /starter-kit-page | 1 | 2026-08-04 | 2026-11-08 | **LIVE-IN-USE** | Approved destination marketing.zeotein.com/starter-kit-page (team doc; Google flagged it 28 Oct so Google traffic moved to /starter-kit-google). 0 GHL orders/forms (buttons go to Shopify). DOC: Shopify order #2710 inferred (not read) as a purchase via this page. Edited 2026-11-08T20:46. |
| 6 | HodAoTBtFU3muDO5CxKB | Holiday Guide opt-in landing page | gift.zeotein.com | `/holiday-guide` / /holiday-guide-opt-in-landing-page, /thank-you-/-download-page, /final-thank-you | 3 | 2026-10-07 | 2026-11-05 | **LIVE-IN-USE (approved; light traffic)** | Approved: gift.zeotein.com = Holiday Guide funnel HodAo… (team doc). 1 real lead in 60 days: form 'GET YOUR HOLIDAY FREE GUIDE' (PpCqz6TQWOIJAOrREDhd) 2026-10-07T08:32 recorded funnel_id HodAo…, page 1W3uPxw6k3tqowZL4b7U, domain try.zeotein.com, page_url /holiday-guide (so on 7 Oct the funnel was served on try.zeotein.com); plus 1 internal preview the same morning. No submissions after 2026-10-07. Published workflow 'HG · Holiday Guide leads · Guide delivery and Black Friday list' (updated 2026-11-09). 0 GHL orders. |
| 7 | DE4OhGSMMY1uNuc5qeGT | [Not in use] Zeotein x Howie Mandel Final Version 2.0 | go.zeotein.com | `/howie` / /landing-page, /checkout, /upsell, /thank-you-page | 6 | 2026-06-28 | 2026-11-10 | **LIVE-BUT-RETIRED** | Name says '[Not in use]'; team doc: /howie and /landing-page not allowed. 46 GHL orders (sourceId), 62 funnel transactions; last NEW order 2026-08-07 (test mode, $94 upsell); last live charge 2026-08-23 ($106.24 'Subscription update', renewal of the 2026-07-23 live subscription); that subscription (sub_1TwMVvCsO8nC1HzYepkqtBFn) is now 'canceled'. All 13 subscriptions from this funnel are canceled. Funnel isLivePaymentMode=false today. Pages still being edited (Landing page Rm3e… updatedAt 2026-11-09T16:51). |
| 8 | bv1fI2cXX8tzW8NCy8zI | [DO NOT USE] - Test Site - Howie Mandel x Zeotein | go.zeotein.com | `/test-0123123123123123-donotuse` / /test-03123123123231-donotuse, /checkout-265915, /upsell-1352, /thank-you-page-885642 | 6 | 2026-07-23 | 2026-11-09 | **LIVE-BUT-RETIRED** | Name '[DO NOT USE] - Test Site'. 9 GHL orders / 7 transactions, all test mode (liveMode false), last 2026-07-30. isLivePaymentMode=false, requireCreditCard=false. Still domain-connected; pages edited 2026-11-09T16:49–16:51. |
| 9 | lCxlMY2Z4Hv0t4ZHzgVW | Zeotein x Howie Mandel with Bulk Bag | go.zeotein.com | `/howie-bulk-offer` / /howie-bulk-offer--landing-page | 1 | 2026-08-16 | 2026-11-09 | **LIVE-BUT-RETIRED** | Team doc: /howie-bulk-offer--landing-page not allowed (legacy). But it had real traffic inside 90 days: 2 'Howie Funnel — 15% Popup' form submissions (form 4clQASXd5hGUj1clZ863) on 2026-09-17 and 2026-09-22 recorded funnel_id lCxl…, page us01efzu0E7bz9i3tdwu, domain go.zeotein.com, page_url '/' (the domain root served this page then), title "Howie Mandel's Exclusive Zeotein Offer \| Save 15% Today", one with utm_source facebook campaign 120252678380930066. 14 Shopify orders used coupon HOWIE15 between 2026-08-17 and 2026-09-18 ($2,043.59) — indirect, coupon could come from elsewhere. 0 GHL orders (buttons go to Shopify). No GHL evidence after 2026-09-22. Page us01… updatedAt 2026-11-09T16:51. |
| 10 | To0JJYumPq6qcm2fTKY5 | Zeotein Cacao Landing Page | marketing.zeotein.com | `/zeotein-cacao-landing-page` / /zeotein-cacao | 1 | 2026-05-31 | 2026-11-08 | **LIVE-BUT-RETIRED** | Domain-connected, not an approved destination, no tracking code, 0 GHL orders/forms/surveys in window. Edited 2026-11-08T21:27 (same batch as other marketing funnels). |
| 11 | 1LzRjMFaXI24eo2rKJWX | Zeotein Cacao Landing Page – New Version | marketing.zeotein.com | `/zeotein-cacao-946213` / /landing-page-cacao | 1 | 2026-07-04 | 2026-11-08 | **LIVE-BUT-RETIRED** | Domain-connected, not an approved destination, no tracking code, isLivePaymentMode=true, no GHL evidence. Edited 2026-11-08T21:24. |
| 12 | p3GJqD61mz9CGcLMDEsC | Zeotein Cacao Offer Funnel | marketing.zeotein.com | `/zeotein-cacao-offer` / /cacao-sales-page | 1 | 2026-07-29 | 2026-11-08 | **LIVE-BUT-RETIRED** | Domain-connected, not an approved destination, no tracking code, no GHL evidence. Edited 2026-11-08T21:12. |
| 13 | LMBnb2IIx4DXfvOvWs6c | Zeotein Formula Finder V2 | marketing.zeotein.com | `/zeotein-formula-finder-v2` / /v2-start, /v2-q1, /v2-q2-cacao, /v2-q2-vegan, /v2-email-cacao, /v2-email-vegan, /v2-result-cacao, /v2-result-vegan | 8 | 2026-05-14 | 2026-05-25 | **LIVE-BUT-RETIRED** | Domain-connected (marketing.zeotein.com), not an approved destination, last edited 2026-05-25, no GHL evidence in window. Superseded by the quiz funnels (Okhf… has originId LMBnb…). |
| 14 | gyWMkUIpp308SciACJyF | Zeotein Formula Finder | marketing.zeotein.com | `/zeotein-formula-finder` / /start, /q1, /q2, /email, /result-cacao, /result-vegan | 6 | 2026-05-14 | 2026-05-15 | **LIVE-BUT-RETIRED** | Domain-connected (marketing.zeotein.com), not an approved destination, last edited 2026-05-15, no GHL evidence in window. |
| 15 | 2u6D8ImYbnwchnJACOei | BF 2026 Google Store-Wide (DRAFT) | (none) | `/bf-2026-google` / /bf-google | 1 | 2026-11-08 | 2026-11-08 | **DORMANT (draft in progress)** | No domain. Created 2026-11-08, name says DRAFT. Has Google Ads tag + Clarity in Head code. |
| 16 | SDbmugj5ZE1ttyQYRDqT | [DRAFT] Holiday Guide — Christmassy revamp | (none) | `/holiday-guide` / /holiday-guide-opt-in-landing-page, /thank-you-/-download-page, /final-thank-you-401378 | 3 | 2026-11-07 | 2026-11-07 | **DORMANT (draft in progress)** | No domain. Clone of HodAo… (originId), created 2026-11-07, name says DRAFT. |
| 17 | 3Njwg8GmQRUI6uY4ARt4 | [DRAFT] Stocking Stuffers 7-Day Gift | (none) | `/draft-stocking-stuffers-7-day-gift` / /stocking-stuffers | 1 | 2026-11-06 | 2026-11-07 | **DORMANT (draft in progress)** | No domain. Created 2026-11-06, name says DRAFT. DOC: draft path was try.zeotein.com/stocking-stuffers, flagged as breaking the never-touch-try rule. GHL product 6aef19620a0d0aa7ce12d1cc 'Stocking Stuffers — 7-Day Gift' exists. |
| 18 | vnwgYBT4h8J1kZLUqHgX | Howie Mandel x Zeotein V2 not using | (none) | `/ai-generated-funnel` / /howie-mandel, /exclusive-checkout, /upsell | 3 | 2026-06-19 | 2026-11-02 | **DORMANT** | No domain; 0 funnel transactions in the all-time pull; pages last edited June-Aug 2026, funnel-level dateUpdated 2026-11-02 19:52-19:56 (all six old Howie copies touched within 5 minutes). Name marks it as an old Howie copy or backup. |
| 19 | aEMleStqAwLBnqgMc10G | Zeotein x Howie Mandel Final Version Copy-back up of older copy | (none) | `/ai-generated-funnel-460590-427738` / /landing-page-977575, /product-choice, /checkout-7-day-supply, /checkout-30-day-supply, /upsell-offer-for-another-bag, /thank-you-page-7960-8855, /complete-check-out | 7 | 2026-06-23 | 2026-11-02 | **DORMANT** | No domain; 0 funnel transactions in the all-time pull; pages last edited June-Aug 2026, funnel-level dateUpdated 2026-11-02 19:52-19:56 (all six old Howie copies touched within 5 minutes). Name marks it as an old Howie copy or backup. |
| 20 | XknfczDZxTBYMmG6utYN | Daniel Howie Mandel | (none) | `/daniel` / landing-page, /complete-checkout, /upsell-offer-for-30-day-supply, /thank-you-page-7960 | 4 | 2026-07-01 | 2026-11-02 | **DORMANT** | No domain; 0 funnel transactions in the all-time pull; pages last edited June-Aug 2026, funnel-level dateUpdated 2026-11-02 19:52-19:56 (all six old Howie copies touched within 5 minutes). Name marks it as an old Howie copy or backup. |
| 21 | SFrJuIUhGpXUnInW7GQB | Zeotein x Howie Mandel Final Version | (none) | `/howie1` / /landing-page, /complete-checkout, /upsell-offer-for-30-day-supply, /thank-you-page-7960 | 4 | 2026-06-18 | 2026-11-02 | **DORMANT (formerly live)** | No domain today, but 45 GHL orders / 45 transactions historically recorded domain go.zeotein.com (pages /complete-checkout, /upsell-offer-for-30-day-supply, /complete-checkout-page, /checkout, /continue-to-check-out, /upsell-offer). Last new order 2026-07-01; last live transaction 2026-07-01 (2 live charges refunded, 1 subscription incomplete_expired); only later activity is a test-mode renewal on 2026-09-01. All 3 subscriptions canceled/incomplete_expired. |
| 22 | BUIbbu0jE2p3tcxluncB | Zeotein x Howie Mandel Final Version 2.0 with Bulk Bag | (none) | `/howie-bulk-offer-copy` / /landing-page-826404 | 2 | 2026-08-10 | 2026-11-02 | **DORMANT** | No domain; 0 funnel transactions in the all-time pull; pages last edited June-Aug 2026, funnel-level dateUpdated 2026-11-02 19:52-19:56 (all six old Howie copies touched within 5 minutes). Name marks it as an old Howie copy or backup. |
| 23 | etoeAP7Xlw2lS2aYErXM | Howie Mandel x Zeotein 1.0 | (none) | `/ai-generated-funnel` / /untitled-page, /exclusive-checkout, /upsell | 3 | 2026-06-18 | 2026-11-02 | **DORMANT** | No domain; 0 funnel transactions in the all-time pull; pages last edited June-Aug 2026, funnel-level dateUpdated 2026-11-02 19:52-19:56 (all six old Howie copies touched within 5 minutes). Name marks it as an old Howie copy or backup. |
| 24 | kWgcC9x86A6CSDuhUZiA | AI Generated Funnel | (none) | `/ai-generated-funnel` / /untitled-page | 1 | 2026-06-16 | 2026-08-07 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 25 | Okhf14fYR77xbIUUevd7 | Zeotein Quiz Funnel (Cacao or Vegan) | (none) | `/quiz-old` / /question, /question-910633, /results-for-cacao, /results-for-vegan, /contact-us, /terms-and-condition, /private-policy, /unsubscribe | 8 | 2026-05-25 | 2026-07-20 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 26 | XOS9YPAY8qO9gMQaTVix | Zeotein Quiz Funnel AI Built | (none) | `/ai-generated-funnel` / /untitled-page, /quiz | 2 | 2026-07-05 | 2026-07-06 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 27 | rMfMWFBerrRDkDilckp9 | Sample | (none) | `/sample` / /opt-in, /check-out-sample, /starter-check-out, /best-value-checkout, /confirmation-page, /landing-page | 6 | 2026-06-21 | 2026-06-22 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 28 | OUvPVknC9tqTdoR010Am | AI Generated Funnel (5) | (none) | `/ai-generated-funnel` / /untitled-page, /checkout | 2 | 2026-06-18 | 2026-06-18 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 29 | qodRD7scLzSs05gmNxRP | AI Generated Funnel (1) Copy | (none) | `/ai-generated-funnel` / /untitled-page, /thankyou_howie | 2 | 2026-06-18 | 2026-06-18 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 30 | bX7YT4eYOIt7j22YYsqi | AI Generated Funnel (2) | (none) | `/ai-generated-funnel` / /untitled-page | 1 | 2026-06-18 | 2026-06-18 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 31 | Ziy2mDLELUAUluj32em5 | AI Generated Funnel (4) | (none) | `/ai-generated-funnel` / /untitled-page | 1 | 2026-06-18 | 2026-06-18 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 32 | TwquMyeirECul6BMVebw | AI Generated Funnel (3) | (none) | `/ai-generated-funnel` / /untitled-page | 1 | 2026-06-18 | 2026-06-18 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 33 | YI7JEhQ02aajfig1knvv | AI Generated Funnel (1) | (none) | `/ai-generated-funnel` / /untitled-page, /thankyou_howie | 2 | 2026-06-17 | 2026-06-18 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 34 | c8rW9qvzXfG4innSw3LZ | Howie Mandel x Zeotein — Cacao Landing Page | (none) | `/ai-generated-funnel` / /untitled-page | 1 | 2026-06-16 | 2026-06-17 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 35 | 7guG0GmsPFW6ONslzqd9 | Shaker Funnel | (none) | `/shaker-funnel` / /sales, /choose-zeotein, /checkout, /upsell-bundle, /downsell-bag, /thank-you | 6 | 2026-04-24 | 2026-05-15 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 36 | QXgwukOVr1UhFZACgZju | A.I. - Lead Magnet Funnel - Cutting Edge | (none) | `/lead-magnet-funnel` / /short-opt-in-page-version-a-7934-1804-2102, /thank-you-page-3121-6688-7077, /------cheat-sheet-------9419, /short-opt-in-page-version-b-2687-6139-4219, /long-opt-in-page-version-a-3953-4914-9278, /long-opt-in-page-version-b-7844 | 6 | 2025-12-18 | 2026-02-10 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |
| 37 | aj1QPnZcBSbMKnXbXN6c | Zeotein Starter Guide | (none) | `/zeotein-starter-guide` / /starter-guide | 1 | 2026-01-24 | 2026-01-24 | **DORMANT** | No domain; no GHL orders, form/survey submissions or contacts attributable to it in the pulls; not edited since the date shown. |

### Shopify products sold, by live and live-but-retired funnel

Funnel page HTML (and therefore buy-button links) is not exposed by any GHL read operation. Every step `products` array is empty or absent, and no current approved funnel has a GHL order form (0 GHL orders each), so buy buttons go to Shopify. Product evidence comes from funnel tracking code (Purple only) or from the team doc.

| Funnel | Products (evidence) |
|---|---|
| Purple — Clean Protein Offer (ex-Howie) (ECf5BDptvwguPNefZikN) | From the funnel's Body tracking code 'ZT funnel gift cart route v2 (2026-11-05)' variant map, resolved via Shopify read: SUBSCRIBE 67710100308181 = Zeotein Cacao Starter Kit — 30-Day Bulk Bag (zeotein-cacao-bag-30-try, $93.49) and 67758454669525 = Zeotein Cacao Starter Kit 30-Day Stick Packs (zeotein-cacao-sticks-30-web, $134.99); BUY-ONCE 54944151634133 = Zeotein Cacao Protein Powder Bulk Bag – Cacao Landing Page (zeotein-cacao-bag-30-web, $109.99) and 67775397986517 = Zeotein Cacao 30-Day Stick Packs — One-Time Purchase (zeotein-cacao-sticks-30-onetime, $134.99); $0 gift lines lp-gift-cleanblend-shaker, lp-gift-save-a-scoop, lp-gift-starter-guide, lp-gift-cacao-recipe-guide, lp-gift-vegan-recipe-guide. |
| Zeotein Cacao Starter Kit - GOOGLE ADS (hP8rlVYceQty6fjPFgXe) | Not readable via API (page HTML not exposed). DOC (30 Oct, verified live by team): same script/destinations as /starter-kit-page, i.e. /products/zeotein-cacao-bag-30-try and /products/zeotein-cacao-bag-30-onetime. |
| Zeotein Quiz Funnel (Cacao or Vegan) New Version (aJ57oms4DRVjZHAiLqCt) | Not readable via API. DOC: result pages /result-cacao-2454 and /result-vegan-4655 carry buy links with WELCOME15. |
| ZEOTEIN — Cacao 30-Day Stick Packs Starter Kit (wcaIgZz5yfm2W6Jo9J8q) | Not readable via API. DOC (30 Oct, verified live): buttons go to zeotein.com/products/zeotein-cacao-sticks-30-web and /products/zeotein-cacao-sticks-30-onetime. |
| Zeotein Cacao Starter Kit (LhKFhCyhJiY1nKWzbwox) | Not readable via API. DOC (verified live): buttons go to /products/zeotein-cacao-bag-30-try (subscribe) and /products/zeotein-cacao-bag-30-onetime (buy once). |
| Holiday Guide opt-in landing page (HodAoTBtFU3muDO5CxKB) | Lead magnet opt-in (form GET YOUR HOLIDAY FREE GUIDE); any product links on its pages are not readable via API. |
| [Not in use] Zeotein x Howie Mandel Final Version 2.0 (DE4OhGSMMY1uNuc5qeGT) | GHL order-form products (all Shopify-sourced, legacy): 6a449ee669b40bddd6e1cab2 'Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides ✅' (Shopify 9435977187541 zeotein-cacao-30-legacy-sub), 6a4395ee84703cb55768973c 'Zeotein Cacao 7-Day Stick Packs' (9435948613845 zeotein-cacao-sticks-7-legacy), 6a439d47c8e4bb80f2ee3ae1 'Zeotein Cacao 30-Day Supply + Free Shaker + 3 Guides ✅' (slug zeotein-cacao-30-legacy-bundle), upsell 6a3b60215ee4f3e5eee52f58 'Zeotein Cacao 30-Day Supply – Second Bag (25% Off Upsell)' (9431042359509 zeotein-cacao-30-legacy-upsell). |
| [DO NOT USE] - Test Site - Howie Mandel x Zeotein (bv1fI2cXX8tzW8NCy8zI) | Test order-form products: 69f3c7ce4f77386b0c53a7f2 'Zeotein Vegan 7-Day Supply' price @44.99 (Shopify 9254295306453 zeotein-vegan-sticks-7); 'Zeotein Cacao 30-Day Supply ($134.99)' (charge description only). |
| Zeotein x Howie Mandel with Bulk Bag (lCxlMY2Z4Hv0t4ZHzgVW) | Not readable via API. Name says 'with Bulk Bag'. |
| Zeotein Cacao Landing Page (To0JJYumPq6qcm2fTKY5) | Not readable via API. |
| Zeotein Cacao Landing Page – New Version (1LzRjMFaXI24eo2rKJWX) | Not readable via API. |
| Zeotein Cacao Offer Funnel (p3GJqD61mz9CGcLMDEsC) | Not readable via API. |
| Zeotein Formula Finder V2 (LMBnb2IIx4DXfvOvWs6c) | Not readable via API. |
| Zeotein Formula Finder (gyWMkUIpp308SciACJyF) | Not readable via API. |

### Paths still configured on connected domains for LIVE-BUT-RETIRED funnels

| Funnel | Paths (configured; not HTTP-verified) |
|---|---|
| [Not in use] Zeotein x Howie Mandel Final Version 2.0 (DE4OhGSMMY1uNuc5qeGT) | go.zeotein.com/howie (funnel path), /landing-page, /checkout, /upsell, /thank-you-page; historical URLs recorded on transactions: /checkout-1965, /checkout-574507; on a contact attribution: /landing-page-page |
| [DO NOT USE] - Test Site - Howie Mandel x Zeotein (bv1fI2cXX8tzW8NCy8zI) | go.zeotein.com/test-0123123123123123-donotuse, /test-03123123123231-donotuse, /checkout-265915, /upsell-1352, /thank-you-page-885642 |
| Zeotein x Howie Mandel with Bulk Bag (lCxlMY2Z4Hv0t4ZHzgVW) | go.zeotein.com/howie-bulk-offer (funnel path), /howie-bulk-offer--landing-page |
| Zeotein Cacao Landing Page (To0JJYumPq6qcm2fTKY5) | marketing.zeotein.com/zeotein-cacao, /zeotein-cacao-landing-page (funnel path) |
| Zeotein Cacao Landing Page – New Version (1LzRjMFaXI24eo2rKJWX) | marketing.zeotein.com/landing-page-cacao, /zeotein-cacao-946213 (funnel path) |
| Zeotein Cacao Offer Funnel (p3GJqD61mz9CGcLMDEsC) | marketing.zeotein.com/cacao-sales-page, /zeotein-cacao-offer (funnel path) |
| Zeotein Formula Finder V2 (LMBnb2IIx4DXfvOvWs6c) | marketing.zeotein.com/zeotein-formula-finder-v2 (funnel path), /v2-start, /v2-q1, /v2-q2-cacao, /v2-q2-vegan, /v2-email-cacao, /v2-email-vegan, /v2-result-cacao, /v2-result-vegan |
| Zeotein Formula Finder (gyWMkUIpp308SciACJyF) | marketing.zeotein.com/zeotein-formula-finder (funnel path), /start, /q1, /q2, /email, /result-cacao, /result-vegan |

Pages of funnels with no domain are still viewable through the white-label preview host (`link.automator.ai/preview/<pageId>`, seen in the 2026-10-25 survey submissions), but not on a Zeotein domain.

### Notes on the live funnels

- **Purple (ECf5BDptvwguPNefZikN)**: step 1 `/clean-protein` holds 2 pages, `qcfwpXXQyoTSO36yP1r3` "Clean Protein Offer" (updated 2026-11-09T20:40) and `ITj4RWjYM2T2jtvF0FqC` "Purple — Operator" (updated 2026-11-09T20:41). Survey submissions recorded the page *title* of qcfw… as "Howie Mandel's Exclusive Zeotein Offer \| Up to 55% Off" (2026-11-08) and of ITj4… as "Zeotein Clean Protein: First Order Offer + Free Shaker". Step 2 "Cacao Starter Kit - Bulk Bag (DRAFT)" (`/cacao-protein-starter-kit-bag`, pages GJqX… and ezXZ… "Purple — Operator Clone", updated 2026-11-10) sits on the same connected domain. The tracking code rewrites `utm_source` on cart and checkout links to `purple-celeb` / `purple-operator` when a page link carries those tags. The ads that produced the 7-8 Nov leads landed with `utm_source=CONVERSIONS oSUBSCRIBE`, `utm_medium=TARGET AUDIENCES (BULK)`.
- **Recorded vs configured paths**: submissions recorded `/cacao-starter-kit`, `/cacao-protein-starter-kit` (Purple variants; DOC 5 Nov: these are the A/B variant addresses, ad link stays `/clean-protein`) and `/quiz/animal-goals` (quiz step Q3, whose step path is now `/q3`).
- **Batch edit**: To0J…, 1LzR…, p3GJ…, aJ57…, wcaI… and LhKF… were all re-saved 2026-11-08 between 20:46 and 21:27 UTC; DE4O…, bv1f… and lCxl… pages between 2026-11-09T16:49 and 16:51.
- **Six old Howie copies** (SFrJu…, vnwg…, aEMl…, Xknf…, BUIb…, etoe…) all have funnel `dateUpdated` 2026-11-02 19:52-19:56 while their pages were last edited in June-August, and none has a domain now. SFrJu… previously ran on go.zeotein.com (45 orders recorded that domain).

### Pages per funnel (getPagesByFunnelId, limit 20, offset 0; API caps limit at 20, max page count here is 8)

`getPagesByFunnelId` returns only `_id, name, stepId, updatedAt, deleted`. It exposes no content, links, product ids or order-form settings.

**Purple — Clean Protein Offer (ex-Howie)** (`ECf5BDptvwguPNefZikN`), 4 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| ezXZY7ssSaMXym9Qza4F | Purple — Operator Clone | Cacao Starter Kit - Bulk Bag (DRAFT) (`/cacao-protein-starter-kit-bag`) | 2026-11-10T01:38:11 |
| GJqXAUJU2RG1DnekCBvL | Cacao Starter Kit - Bulk Bag (DRAFT) | Cacao Starter Kit - Bulk Bag (DRAFT) (`/cacao-protein-starter-kit-bag`) | 2026-11-10T00:42:11 |
| ITj4RWjYM2T2jtvF0FqC | Purple — Operator | Clean Protein Offer (`/clean-protein`) | 2026-11-09T20:41:44 |
| qcfwpXXQyoTSO36yP1r3 | Clean Protein Offer | Clean Protein Offer (`/clean-protein`) | 2026-11-09T20:40:15 |

Split test on step `/clean-protein`: controlTraffic 50, routeAllRequests True, splitStartedAt 2026-10-15T12:30:33.061Z, splitEndedAt None.

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 1370 chars, trackingCodeBody 4931 chars.

**Zeotein Cacao Starter Kit - GOOGLE ADS** (`hP8rlVYceQty6fjPFgXe`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| 2kGabbNImf42DuuRm2ox | Starter Kit Page | Starter Kit Page (`/starter-kit-google`) | 2026-11-09T21:03:29 |

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 1016 chars, trackingCodeBody 2526 chars.

**Zeotein Quiz Funnel (Cacao or Vegan) New Version** (`aJ57oms4DRVjZHAiLqCt`), 6 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| i8DCkpMNxCpOdNyGgS3O | Q1 | Q1 (`/q1-9460`) | 2026-11-08T21:06:55 |
| hWefKLqYZP2ZA9TZBVSZ | Result Vegan | Result Vegan (`/result-vegan-4655`) | 2026-10-30T23:21:29 |
| VCgeH7D2qbwGQOIfBsNl | Result Cacao | Result Cacao (`/result-cacao-2454`) | 2026-10-30T23:19:15 |
| w7baewyiOViECF5iq5i5 | Q3 | Q3 (`/q3`) | 2026-07-20T19:13:53 |
| bLE7hjLBH6Ifo7w2B5HS | Q2 | Q2 (`/q2-1246`) | 2026-07-13T10:11:14 |
| kGcaNQ0Hdh9yjirlmKkX | Q4 | Q4 (`/q4`) | 2026-07-13T09:41:11 |

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 419 chars, trackingCodeBody 1569 chars.

**ZEOTEIN — Cacao 30-Day Stick Packs Starter Kit** (`wcaIgZz5yfm2W6Jo9J8q`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| sDaGDgSfCSViOFa1lu0P | Cacao Stick Packs Starter Kit | Cacao Stick Packs Starter Kit (`/cacao-stick-packs-starter-kit`) | 2026-11-08T20:50:34 |

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 665 chars, trackingCodeBody 2526 chars.

**Zeotein Cacao Starter Kit** (`LhKFhCyhJiY1nKWzbwox`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| BPLP63opNAIm8fmH0CLp | Starter Kit Page | Starter Kit Page (`/starter-kit-page`) | 2026-11-08T20:46:40 |

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 664 chars, trackingCodeBody 2525 chars.

**Holiday Guide opt-in landing page** (`HodAoTBtFU3muDO5CxKB`), 3 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| hmACwGhasKmPUvzZGpTP | Thank You / Download page | Thank You / Download page (`/thank-you-/-download-page`) | 2026-11-05T22:49:30 |
| c6RjGLh0NkIa870jwMBc | Final Thank You | Final Thank You (`/final-thank-you`) | 2026-11-05T22:33:02 |
| 1W3uPxw6k3tqowZL4b7U | Holiday Guide opt-in landing page | Holiday Guide opt-in landing page (`/holiday-guide-opt-in-landing-page`) | 2026-10-07T08:40:19 |

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 665 chars, trackingCodeBody 1407 chars.

**[Not in use] Zeotein x Howie Mandel Final Version 2.0** (`DE4OhGSMMY1uNuc5qeGT`), 6 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| Rm3e5k7ogeGkUHE032U8 | Landing page | Landing page (`/landing-page`) | 2026-11-09T16:51:29 |
| qP4rOvc6GsWEBHwtg10M | Landing page | Landing page (`/landing-page`) | 2026-10-30T15:35:03 |
| r7fsG27OJShra8PujXXz | Checkout | Checkout (`/checkout`) | 2026-08-07T17:55:02 |
| 7i4nkp1Nuj4aJy166hlM | Checkout | Checkout (`/checkout`) | 2026-08-07T17:49:03 |
| fXvMEalQJbj2DCSHV8rT | Thank You Page | Thank You Page (`/thank-you-page`) | 2026-07-06T21:53:17 |
| majwxWOQoyGQzYZY5ENP | Upsell | Upsell (`/upsell`) | 2026-07-06T21:52:37 |

Split test on step `/landing-page`: controlTraffic 0, routeAllRequests True, splitStartedAt 2026-08-10T15:44:44.219Z, splitEndedAt None.

Split test on step `/checkout`: controlTraffic 50, routeAllRequests True, splitStartedAt 2026-07-16T23:24:34.950Z, splitEndedAt None.

Funnel flags: isLivePaymentMode=False, requireCreditCard=True, trackingCodeHead 2312 chars, trackingCodeBody 1651 chars.

**[DO NOT USE] - Test Site - Howie Mandel x Zeotein** (`bv1fI2cXX8tzW8NCy8zI`), 6 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| XfjXhHzJyOkrX75IFOIR | Landing page Clone | Landing page (`/test-03123123123231-donotuse`) | 2026-11-09T16:51:47 |
| jQQRjnBs75JQ8u0hicpz | Landing page | Landing page (`/test-03123123123231-donotuse`) | 2026-11-09T16:51:26 |
| YcicKsUIgChIr7rYPsO4 | Checkout Clone | Checkout (`/checkout-265915`) | 2026-11-09T16:51:09 |
| BMwBBJorEMEOKPtbEAtT | Checkout Clone | Checkout (`/checkout-265915`) | 2026-11-09T16:49:57 |
| 5RzF0cDc4R0DBzylT6Cv | Thank You Page Clone | Thank You Page (`/thank-you-page-885642`) | 2026-07-23T21:26:22 |
| jEcieHUSHOqi5gcJB433 | Upsell Clone | Upsell (`/upsell-1352`) | 2026-07-23T21:26:22 |

Funnel flags: isLivePaymentMode=False, requireCreditCard=False, trackingCodeHead 419 chars, trackingCodeBody 243 chars.

**Zeotein x Howie Mandel with Bulk Bag** (`lCxlMY2Z4Hv0t4ZHzgVW`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| us01efzu0E7bz9i3tdwu | Howie Bulk Offer – Landing Page | Howie Bulk Offer – Landing Page (`/howie-bulk-offer--landing-page`) | 2026-11-09T16:51:21 |

Funnel flags: isLivePaymentMode=False, requireCreditCard=True, trackingCodeHead 664 chars, trackingCodeBody 1787 chars.

**Zeotein Cacao Landing Page** (`To0JJYumPq6qcm2fTKY5`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| vdPio3XC3qGyBmFeLeKy | Zeotein Cacao | Zeotein Cacao (`/zeotein-cacao`) | 2026-11-08T21:27:42 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Zeotein Cacao Landing Page – New Version** (`1LzRjMFaXI24eo2rKJWX`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| UXvTdjR1IfDwBYb6oGRt | Landing Page | Landing Page (`/landing-page-cacao`) | 2026-11-08T21:24:14 |

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Zeotein Cacao Offer Funnel** (`p3GJqD61mz9CGcLMDEsC`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| dmgiW53dyWkOK32NMZPf | Cacao Sales Page | Cacao Sales Page (`/cacao-sales-page`) | 2026-11-08T21:12:48 |

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Zeotein Formula Finder V2** (`LMBnb2IIx4DXfvOvWs6c`), 8 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| mDxNrbQsayWYh6soFNcM | Question 1 | Question 1 (`/v2-q1`) | 2026-05-25T11:37:48 |
| vLuuUQfcxTuIDCLaMD2R | Email Capture - Cacao | Email Capture - Cacao (`/v2-email-cacao`) | 2026-05-25T11:21:04 |
| apJn6kIVClMENbZDVd8H | Question 2 - Vegan | Question 2 - Vegan (`/v2-q2-vegan`) | 2026-05-19T15:56:21 |
| 7g3dnmzgDS6M6aNuEojw | Question 2 - Cacao | Question 2 - Cacao (`/v2-q2-cacao`) | 2026-05-19T15:46:31 |
| 8VF7JO56FykDnXKOwOei | Email Capture - Vegan | Email Capture - Vegan (`/v2-email-vegan`) | 2026-05-17T15:58:41 |
| bVeowBgZ1LmHRvLitbbk | Landing Page | Landing Page (`/v2-start`) | 2026-05-17T15:50:02 |
| MOZ1GEm3L76E6HYzL3TM | Result - Cacao | Result - Cacao (`/v2-result-cacao`) | 2026-05-15T22:23:05 |
| LubHtGTIp1fY2wwXv0uQ | Result - Vegan | Result - Vegan (`/v2-result-vegan`) | 2026-05-15T20:38:12 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Zeotein Formula Finder** (`gyWMkUIpp308SciACJyF`), 6 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| fPXYXMGjoKk6tgssv7Ee | Result - Cacao | Result - Cacao (`/result-cacao`) | 2026-05-15T02:17:45 |
| P2nxdtvuzEOnczY2vLis | Result - Vegan | Result - Vegan (`/result-vegan`) | 2026-05-14T17:36:28 |
| AVcwPTGf9Sh6B9aPU2MQ | Question 2 - Goals | Question 2 - Goals (`/q2`) | 2026-05-14T17:22:10 |
| aBAQaKJk8Dzgt0CjjQjL | Email Opt-in | Email Opt-in (`/email`) | 2026-05-14T17:22:06 |
| vB40CUBDjkYFRDWA2OZw | Landing Page | Landing Page (`/start`) | 2026-05-14T17:15:11 |
| RGR8uxa7UdusXiU5l905 | Question 1 - Protein Source | Question 1 - Protein Source (`/q1`) | 2026-05-14T17:13:39 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**BF 2026 Google Store-Wide (DRAFT)** (`2u6D8ImYbnwchnJACOei`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| ewEpruMiiDuMDSw5ng1h | bf-google | bf-google (`/bf-google`) | 2026-11-08T02:40:05 |

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 1377 chars, trackingCodeBody 1120 chars.

**[DRAFT] Holiday Guide — Christmassy revamp** (`SDbmugj5ZE1ttyQYRDqT`), 3 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| j6TGrF1MRNeaAOGlYS1h | Holiday Guide opt-in landing page Clone | Holiday Guide opt-in landing page (`/holiday-guide-opt-in-landing-page`) | 2026-11-07T01:33:43 |
| TG7ZQw1wTwSUvtGWczi2 | Final Thank You Clone | Final Thank You (`/final-thank-you-401378`) | 2026-11-07T01:33:43 |
| NAPImm5owokl7t5RCyj7 | Thank You / Download page Clone | Thank You / Download page (`/thank-you-/-download-page`) | 2026-11-07T01:33:43 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**[DRAFT] Stocking Stuffers 7-Day Gift** (`3Njwg8GmQRUI6uY4ARt4`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| K9qOq3F3t0JaBy4z3zFn | Stocking Stuffers | Stocking Stuffers (`/stocking-stuffers`) | 2026-11-07T01:27:52 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Howie Mandel x Zeotein V2 not using** (`vnwgYBT4h8J1kZLUqHgX`), 3 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| cE18kpcmZueFQ3aPn5Yv | howie mandel landing page Clone | howie mandel landing page (`/howie-mandel`) | 2026-06-19T18:36:44 |
| c7w3xnXZiASFCu7R7GuD | One-Click Upsell Clone | One-Click Upsell (`/upsell`) | 2026-06-19T10:21:06 |
| Gnfh3uDZs5COkuPQmBnT | Exclusive Checkout Clone | Exclusive Checkout (`/exclusive-checkout`) | 2026-06-19T02:40:06 |

Funnel flags: isLivePaymentMode=False, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Zeotein x Howie Mandel Final Version Copy-back up of older copy** (`aEMleStqAwLBnqgMc10G`), 7 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| LJMwFMwq6tfVuuXKfTAn | Complete check out | Complete check out (`/complete-check-out`) | 2026-06-30T00:15:23 |
| PwwEWwveyXVRT3gtT34k | Landing Page Clone | Landing Page (`/landing-page-977575`) | 2026-06-24T17:04:32 |
| EtPLBeOpMXxnnrp8AP77 | Checkout 30 Day Supply | Checkout 30 Day Supply (`/checkout-30-day-supply`) | 2026-06-24T08:14:40 |
| ogrY6SgLvC5Nzi56kBBR | Checkout 7 Day Supply | Checkout 7 Day Supply (`/checkout-7-day-supply`) | 2026-06-24T08:13:44 |
| cFeArj2J9ulvLrq7yhI4 | Product Choice | Product Choice (`/product-choice`) | 2026-06-24T08:07:00 |
| Aheqp45t2q91hq5xnwb0 | Upsell Offer for Another Bag | Upsell Offer for Another Bag (`/upsell-offer-for-another-bag`) | 2026-06-24T03:12:50 |
| UpLxtAT2MKXtmaomkZW2 | Thank You Page Clone | Thank You Page (`/thank-you-page-7960-8855`) | 2026-06-24T01:01:12 |

Funnel flags: isLivePaymentMode=False, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Daniel Howie Mandel** (`XknfczDZxTBYMmG6utYN`), 4 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| uoAVK5S752W6ZbKUsk6v | Landing Page | Landing Page (`landing-page`) | 2026-07-01T19:44:56 |
| zfJ22p5HTsXN5LUUaA7L | Thank You Page Clone | Thank You Page (`/thank-you-page-7960`) | 2026-07-01T15:40:25 |
| biSPiaaKvR2rwpNFtU6u | Complete checkout Clone | Complete checkout (`/complete-checkout`) | 2026-07-01T15:40:24 |
| QARFjaYgbLLyMocqLgUN | Upsell Offer for 30 Day Supply Clone | Upsell Offer for 30 Day Supply (`/upsell-offer-for-30-day-supply`) | 2026-07-01T15:40:24 |

Funnel flags: isLivePaymentMode=False, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Zeotein x Howie Mandel Final Version** (`SFrJuIUhGpXUnInW7GQB`), 4 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| 489TSMOBJAsS9G4irCHl | Complete checkout | Complete checkout (`/complete-checkout`) | 2026-07-19T02:43:21 |
| 83YvSJcO0u9U9qxo8uw7 | Landing Page | Landing Page (`/landing-page`) | 2026-07-03T18:58:26 |
| urVsJalDrVs3jxeDXhww | Thank You Page | Thank You Page (`/thank-you-page-7960`) | 2026-07-01T15:47:06 |
| lVP00Q0qkXZfbLVAVYVG | Upsell Offer for 30 Day Supply | Upsell Offer for 30 Day Supply (`/upsell-offer-for-30-day-supply`) | 2026-07-01T03:07:49 |

Funnel flags: isLivePaymentMode=False, requireCreditCard=True, trackingCodeHead 664 chars, trackingCodeBody 0 chars.

**Zeotein x Howie Mandel Final Version 2.0 with Bulk Bag** (`BUIbbu0jE2p3tcxluncB`), 2 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| rNTam97IhmwZHwCyFeWO | Landing page Clone | Landing page (`/landing-page-826404`) | 2026-08-16T08:15:02 |
| rVnPhCBSWqpKXsbOfyAW | Landing page Clone | Landing page (`/landing-page-826404`) | 2026-08-16T07:01:07 |

Funnel flags: isLivePaymentMode=False, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Howie Mandel x Zeotein 1.0** (`etoeAP7Xlw2lS2aYErXM`), 3 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| jBUoS4xnQr1IiaIz26zd | One-Click Upsell Clone | One-Click Upsell (`/upsell`) | 2026-06-18T23:57:18 |
| QencY12lBO6xVL1GFOco | Exclusive Checkout Clone | Exclusive Checkout (`/exclusive-checkout`) | 2026-06-18T23:57:18 |
| CJMP5tEWVBnmZEe56Vjf | Landing Page Clone | Post-Purchase One-Click Upsell (`/untitled-page`) | 2026-06-18T23:57:18 |

Funnel flags: isLivePaymentMode=False, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 1787 chars.

**AI Generated Funnel** (`kWgcC9x86A6CSDuhUZiA`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| sqZsiGjRa3KueZoEnkfT | Howie Mandel x Zeotein — Cacao Landing Page | Howie Mandel x Zeotein — Cacao Landing Page (`/untitled-page`) | 2026-08-07T01:09:19 |

Funnel flags: isLivePaymentMode=False, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Zeotein Quiz Funnel (Cacao or Vegan)** (`Okhf14fYR77xbIUUevd7`), 8 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| 51J8NJV25peq9SmxO19U | Result - Vegan | Result - Vegan (`/results-for-vegan`) | 2026-07-09T22:45:50 |
| QFfJVXL6Hk0m5BogVf5v | Q1 | Q1 (`/question`) | 2026-07-05T21:52:18 |
| tdRzLqvqpfSSULp7MWqx | Q2 | Q2 (`/question-910633`) | 2026-06-29T14:27:26 |
| sdh3rwnGmFdRo2ZsgIok | Result - Cacao | Result - Cacao (`/results-for-cacao`) | 2026-06-18T01:00:29 |
| neUFka7hVkodP0d3IXAh | Contact Us | Contact Us (`/contact-us`) | 2026-06-15T14:14:20 |
| GCiCM9tmYOh8bxbQP6Ln | Unsubscribe  | Unsubscribe  (`/unsubscribe`) | 2026-06-15T13:47:55 |
| 8lRhJWH22KZhNhyUvaS7 | Private Policy | Private Policy (`/private-policy`) | 2026-06-15T13:47:38 |
| VYgEWHPqpl28a56UQeNs | Terms and Condition  | Terms and Condition  (`/terms-and-condition`) | 2026-06-15T13:47:20 |

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Zeotein Quiz Funnel AI Built** (`XOS9YPAY8qO9gMQaTVix`), 2 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| 46BaAcFWIrZ5jvcB0Snw | Zeotein Personalized Quiz | Zeotein Personalized Quiz (`/quiz`) | 2026-07-05T22:27:09 |
| mboxOJ1NWv5Shu2pjtjO | Zeotein Quiz Funnel | Zeotein Quiz Funnel (`/untitled-page`) | 2026-07-05T22:14:18 |

Funnel flags: isLivePaymentMode=True, requireCreditCard=True, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Sample** (`rMfMWFBerrRDkDilckp9`), 6 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| vcRASmtV1uDspurbxiJg | Landing Page | Landing Page (`/landing-page`) | 2026-06-22T08:42:22 |
| 7LhMFtGrnu0KYneNtCFF | Opt-in | Opt-in (`/opt-in`) | 2026-06-22T08:41:09 |
| doqCK1iBJmbeuDCypMRt | Check out sample | Check out sample (`/check-out-sample`) | 2026-06-21T11:52:02 |
| rQRXsV1UnS4wyz4KbBqM | Starter Check Out | Starter Check Out (`/starter-check-out`) | 2026-06-21T09:00:47 |
| AFZ0iqyB4KAvRM7PTMtH | Confirmation page | Confirmation page (`/confirmation-page`) | 2026-06-21T08:29:10 |
| 421BgytL7GngJmR2jFFq | Best Value Checkout | Best Value Checkout (`/best-value-checkout`) | 2026-06-21T08:19:25 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**AI Generated Funnel (5)** (`OUvPVknC9tqTdoR010Am`), 2 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| alQWqYeauipLcXOflGw1 | landing page | Exclusive Checkout (`/untitled-page`) | 2026-06-23T16:41:09 |
| W9Eipr3DoAAUqyC8Yorc | Checkout Cart | Checkout Cart (`/checkout`) | 2026-06-18T19:49:37 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**AI Generated Funnel (1) Copy** (`qodRD7scLzSs05gmNxRP`), 2 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| gh20YF2xrqLETCYoHSbg | Zeotein Cacao Premium Landing Page Clone | Zeotein Cacao Premium Landing Page (`/untitled-page`) | 2026-06-18T19:45:59 |
| oCKB6AlzCYyCs9FRBnHT | Zeotein Confirmation Clone | Zeotein Confirmation (`/thankyou_howie`) | 2026-06-18T19:02:34 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**AI Generated Funnel (2)** (`bX7YT4eYOIt7j22YYsqi`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| uVlfIGZzru8xrQxlZhKa | Zeotein Premium Direct Response | Zeotein Premium Direct Response (`/untitled-page`) | 2026-06-18T19:36:24 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**AI Generated Funnel (4)** (`Ziy2mDLELUAUluj32em5`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| E2sgWtJTuk3YT4ON3bEJ | Untitled Page | Untitled Page (`/untitled-page`) | 2026-06-18T19:19:38 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**AI Generated Funnel (3)** (`TwquMyeirECul6BMVebw`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| D6bMVe5Jkf6h7cNaEe6Z | Untitled Page | Untitled Page (`/untitled-page`) | 2026-06-18T19:19:35 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**AI Generated Funnel (1)** (`YI7JEhQ02aajfig1knvv`), 2 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| BlYDVFXsi8bhsz1ABHGz | Zeotein Cacao Premium Landing Page | Zeotein Cacao Premium Landing Page (`/untitled-page`) | 2026-06-18T16:57:17 |
| 5qRhbK5NWguz6JNFkYPC | Zeotein Confirmation | Zeotein Confirmation (`/thankyou_howie`) | 2026-06-18T15:20:59 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Howie Mandel x Zeotein — Cacao Landing Page** (`c8rW9qvzXfG4innSw3LZ`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| En2UcMwnsHfVrXk2uMGU | Howie Mandel x Zeotein — Cacao Landing Page Clone | Howie Mandel x Zeotein — Cacao Landing Page (`/untitled-page`) | 2026-06-17T21:10:00 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Shaker Funnel** (`7guG0GmsPFW6ONslzqd9`), 6 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| PFFN2h8pTVM1RJFw8njv | Thank You | Thank You (`/thank-you`) | 2026-05-15T21:30:03 |
| 6zzLW4QUm419UhxmcRiO | Downsell - Extra Bag | Downsell - Extra Bag (`/downsell-bag`) | 2026-05-15T19:09:43 |
| K2kDDRzN7KaOKPX2yRx0 | Upsell - 90 Day Bundle | Upsell - 90 Day Bundle (`/upsell-bundle`) | 2026-05-15T19:09:14 |
| D5Ld9XTWVM8Zqe8f4kCt | Checkout | Checkout (`/checkout`) | 2026-05-15T19:08:50 |
| 7S5Ja6agMok3ZCp0w9WG | 👉 Choose Your Zeotein | 👉 Choose Your Zeotein (`/choose-zeotein`) | 2026-05-15T19:07:02 |
| 3E8HXhfN8pbLlF6kutub | Sales Page | Sales Page (`/sales`) | 2026-05-15T19:06:13 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**A.I. - Lead Magnet Funnel - Cutting Edge** (`QXgwukOVr1UhFZACgZju`), 6 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| GD4QFZAOVXSQFjXJd11e | Short Opt-In Page (Version A) | Short Opt-In Page (Version A) (`/short-opt-in-page-version-a-7934-1804-2102`) | 2026-02-10T04:18:46 |
| 6Dvz2mJiYZFSmcHNcsWz | Thank You Page | Thank You Page (`/thank-you-page-3121-6688-7077`) | 2026-02-10T04:11:22 |
| agsqDVssbSYGOKQD2JZI | Short Opt-In Page (Version B) | Short Opt-In Page (Version B) (`/short-opt-in-page-version-b-2687-6139-4219`) | 2025-12-18T18:08:20 |
| JdHH6UsTmLmhAffza19R | ----- CHEAT SHEET ----- | ----- CHEAT SHEET ----- (`/------cheat-sheet-------9419`) | 2025-12-18T18:08:20 |
| GUdP1Mq6426nlxABJXZs | Long Opt-In Page (Version B) | Long Opt-In Page (Version B) (`/long-opt-in-page-version-b-7844`) | 2025-12-18T18:08:20 |
| AxvC5c2sLo2Tgn9p040F | Long Opt-In Page (Version A) | Long Opt-In Page (Version A) (`/long-opt-in-page-version-a-3953-4914-9278`) | 2025-12-18T18:08:20 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

**Zeotein Starter Guide** (`aj1QPnZcBSbMKnXbXN6c`), 1 pages

| Page id | Page name | Step (path) | updatedAt |
|---|---|---|---|
| T9lRwB0LyZ5ld4tOO5PH | Starter Guide | Starter Guide (`/starter-guide`) | 2026-01-24T20:49:25 |

Funnel flags: isLivePaymentMode=None, requireCreditCard=None, trackingCodeHead 0 chars, trackingCodeBody 0 chars.

## (c) Orders and leads evidence

### c1. GHL orders, last 90 days (2026-08-12 .. 2026-11-10)

`list-orders` with startAt/endAt returned totalCount 258. All 258 are `sourceType: external`, `sourceSubType: shopify`, `sourceName: https://zeotein-llc.myshopify.com`. List results carry no product names and no funnel, page or step ids, so none of them can be tied to a funnel inside GHL. Gross `amount` total $38,646.08. Per-order rows (id, date, amount, discount, coupon, status; no customer data) are in orders/orders_90d_condensed.json.

| Month | Orders |
|---|---|
| 2026-08 | 61 |
| 2026-09 | 111 |
| 2026-10 | 67 |
| 2026-11 | 19 |

Coupon codes on those orders: (none) 217, HOWIE15 14, GHH20 8, WELCOME10 6, GET15 5, Free shipping 3, REORDER10 1, CART15 1, WELCOME15 1, Replacement for short shipment 1, ZEOFB10 1.
HOWIE15 orders: 14, from 2026-08-17T14:31:48 to 2026-09-18T11:56:57, $2,043.59 total, none after 2026-09-18. This is indirect evidence of Howie-offer traffic: the coupon could also have been used outside the funnel.

### c2. GHL orders by source funnel (list-orders `sourceId`, all time)

| Funnel | totalCount | Latest order |
|---|---|---|
| Purple — Clean Protein Offer (ex-Howie) (ECf5BDptvwguPNefZikN) | 0 |  |
| [Not in use] Zeotein x Howie Mandel Final Version 2.0 (DE4OhGSMMY1uNuc5qeGT) | 46 | 2026-08-07T16:54 (test, $94 upsell) |
| Zeotein x Howie Mandel Final Version (SFrJuIUhGpXUnInW7GQB) | 45 | 2026-07-01T18:53 (test, $101.24 upsell) |
| [DO NOT USE] - Test Site - Howie Mandel x Zeotein (bv1fI2cXX8tzW8NCy8zI) | 9 | 2026-07-30T16:18 (test, $44.99) |
| Zeotein x Howie Mandel with Bulk Bag (lCxlMY2Z4Hv0t4ZHzgVW) | 0 |  |
| Zeotein Cacao Starter Kit (LhKFhCyhJiY1nKWzbwox) | 0 |  |
| ZEOTEIN — Cacao 30-Day Stick Packs Starter Kit (wcaIgZz5yfm2W6Jo9J8q) | 0 |  |
| Zeotein Cacao Starter Kit - GOOGLE ADS (hP8rlVYceQty6fjPFgXe) | 0 |  |
| Zeotein Quiz Funnel (Cacao or Vegan) New Version (aJ57oms4DRVjZHAiLqCt) | 0 |  |
| Holiday Guide opt-in landing page (HodAoTBtFU3muDO5CxKB) | 0 |  |

### c3. GHL funnel transactions (`list-transactions entitySourceType=funnel`, 114 rows)

| Funnel | Live-mode tx | Test-mode tx | Last tx | Last live tx |
|---|---|---|---|---|
| [Not in use] Zeotein x Howie Mandel Final Version 2.0 (DE4OhGSMMY1uNuc5qeGT) | 6 | 56 | 2026-09-07T03:46:04 | 2026-08-23T14:22:08 |
| Zeotein x Howie Mandel Final Version (SFrJuIUhGpXUnInW7GQB) | 3 | 42 | 2026-09-01T14:19:44 | 2026-07-01T13:10:50 |
| [DO NOT USE] - Test Site - Howie Mandel x Zeotein (bv1fI2cXX8tzW8NCy8zI) | 0 | 7 | 2026-07-30T16:18:41 | none |

All rows record `domain: go.zeotein.com`. By month: 2026-06 7, 2026-07 82, 2026-08 17, 2026-09 8.

Transactions in the last 90 days, plus every live-mode transaction (product = Stripe/PayPal charge description):

| Date (UTC) | Amount | Refunded | Status | Mode | Form type | Funnel | Step id | Page id | Page URL | Order id | Product (charge description) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-09-07T03:46:04 | 124.99 | 0 | succeeded | test | two_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | 7i4nkp1Nuj4aJy166hlM | /checkout | 6a4c67bc4c952b4499cd63e0 | Subscription update |
| 2026-09-07T03:24:01 | 124.99 | 0 | succeeded | test | two_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | 7i4nkp1Nuj4aJy166hlM | /checkout | 6a4c6266537d480a3b84e475 | Subscription update |
| 2026-09-07T03:19:07 | 124.99 | 0 | succeeded | test | two_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | 7i4nkp1Nuj4aJy166hlM | /checkout | 6a4c6148d0f2a07e15ba71a3 | Subscription update |
| 2026-09-07T02:56:49 | 124.99 | 0 | succeeded | test | two_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | 7i4nkp1Nuj4aJy166hlM | /checkout | 6a4c5c28537d480295814e35 | Subscription update |
| 2026-09-07T02:38:45 | 124.99 | 0 | succeeded | test | two_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | 7i4nkp1Nuj4aJy166hlM | /checkout | 6a4c57fee54fdf51fa26ebfb | Subscription update |
| 2026-09-06T22:57:09 | 124.99 | 0 | succeeded | test | two_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | 7i4nkp1Nuj4aJy166hlM | /checkout-1965 | 6a4c2400406eeea9c123327d | Subscription update |
| 2026-09-06T22:22:54 | 106.24 | 0 | succeeded | test | one_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | r7fsG27OJShra8PujXXz | /checkout-574507 | 6a74fa6b35f6de46125b32c7 | Subscription update |
| 2026-09-01T14:19:44 | 114.99 | 0 | succeeded | test | two_step_order_form | SFrJuIUhGpXUnInW7GQB | 604a19f7-e612-4387-b2cf-ae59bc2e8a00 | 489TSMOBJAsS9G4irCHl | /complete-checkout | 6a45130fe8b92c7ca823d6cd | Subscription update |
| 2026-08-30T17:30:08 | 106.24 | 0 | succeeded | test | one_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | r7fsG27OJShra8PujXXz | /checkout-574507 | 6a6b7b52d0b78659d0c6e6ee | Subscription update |
| 2026-08-23T14:22:08 | 106.24 | 0 | succeeded | LIVE | one_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | r7fsG27OJShra8PujXXz | /checkout-574507 | 6a6214951be11115dfd4e1e0 | Subscription update |
| 2026-08-06T21:57:59 | 38.99 | 0 | failed | LIVE | one_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | r7fsG27OJShra8PujXXz | /checkout-574507 | 6a750365f42643478ed1b3df | Zeotein Cacao 7-Day Supply — $38.99 ($38.99) |
| 2026-07-23T13:18:17 | 106.24 | 0 | succeeded | LIVE | one_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | r7fsG27OJShra8PujXXz | /checkout-574507 | 6a6214951be11115dfd4e1e0 | Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides |
| 2026-07-19T04:52:42 | 124.99 | 0 | succeeded | LIVE | two_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | r7fsG27OJShra8PujXXz | /checkout-574507 | 6a5c581a8c75e5136bedbe3b | (none; PayPal) |
| 2026-07-09T20:25:27 | 124.99 | 0 | succeeded | LIVE | two_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | 7i4nkp1Nuj4aJy166hlM | /checkout | 6a5003b647f931359dc96257 | Zeotein Cacao 30-Day + Free Shaker + 3 Guides ($124.99) |
| 2026-07-08T05:08:31 | 38.99 | 0 | succeeded | LIVE | two_step_order_form | DE4OhGSMMY1uNuc5qeGT | 17c8c589-566c-4b97-88a1-bd36f104bf85 | 7i4nkp1Nuj4aJy166hlM | /checkout | 6a4ddb4efc0934f8c92c3883 | Zeotein Cacao 7-Day Stick Packs ($38.99) |
| 2026-07-01T13:10:50 | 114.99 | 0 | pending | LIVE | two_step_order_form | SFrJuIUhGpXUnInW7GQB | 604a19f7-e612-4387-b2cf-ae59bc2e8a00 | 489TSMOBJAsS9G4irCHl | /complete-checkout | 6a4511d78a68fe04e5d3d72e | Subscription creation |
| 2026-07-01T12:58:21 | 101.24 | 101.24 | refunded | LIVE | upsell | SFrJuIUhGpXUnInW7GQB | 630cba77-c07b-4c85-b34d-cc7f1701a2f3 | lVP00Q0qkXZfbLVAVYVG | /upsell-offer-for-30-day-supply | 6a450eeb5919e80df61f3ee8 | Zeotein Cacao 30-Day Supply – Second Bag (25% Off Upsell) ✅ ($101.24) |
| 2026-07-01T12:58:08 | 114.99 | 114.99 | refunded | LIVE | two_step_order_form | SFrJuIUhGpXUnInW7GQB | 604a19f7-e612-4387-b2cf-ae59bc2e8a00 | 489TSMOBJAsS9G4irCHl | /complete-checkout | 6a450edeeaf30460b10133e4 | Zeotein Cacao 30-Day Supply (15% Off Offer) ✅ ($114.99) |

Live-mode totals: 9 transactions; succeeded $501.45 (5), refunded 2 (both 2026-07-01, by a contact whose phone equals the sub-account's business phone), failed 1 (2026-08-06, $38.99), pending 1 (2026-07-01). The most recent live charge, 2026-08-23 $106.24 'Subscription update', is the first renewal of the 2026-07-23 live subscription. That subscription is now `canceled` and no later charge exists.

Charge descriptions across all 114 transactions (count):

- Zeotein Cacao 30-Day Supply (15% Off Offer) ✅ ($114.99): 21
- Subscription update: 20
- Zeotein Cacao 30-Day Supply – Second Bag (25% Off Upsell) ✅ ($101.24): 16
- Zeotein Cacao 30-Day Supply – Second Bag (25% Off Upsell) ✅ ($94): 8
- Zeotein Cacao 30-Day Supply + Free Shaker + 3 Guides ($124.99): 7
- Zeotein Vegan 7-Day Supply ($44.99): 6
- Zeotein Cacao 30-Day Subscription: 6
- Zeotein Cacao 7-Day Stick Packs ($38.99): 5
- Zeotein Cacao 30-Day Supply – Second Bag (25% Off Upsell) ($94): 4
- Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides ✅: 3
- Zeotein Cacao 30-Day + Free Shaker + 3 Guides ($124.99): 2
- Zeotein Cacao 30-Day Supply Subscription + Free Shaker + 3 Guides: 2
- Best Value – 30-Day Subscription (15% Off for Life)✅: 2
- Zeotein Cacao 7-Day Supply — $38.99 ($38.99): 1
- Zeotein Cacao 30-Day Supply + Free Shaker + 3 Guides ✅ ($124.99): 1
- Zeotein Cacao 30-Day Supply ($134.99): 1
- Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides: 1
- (none): 1
- Zeotein Cacao 30-Day Supply Subscription: 1
- Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides ($124.99): 1
- Zeotein Cacao 7-Day Stick Packs (15% Off Offer) ✅ ($39.99): 1
- Subscription creation: 1
- Zeotein CleanBlend Shaker (27oz \| USA Made) ($15.99): 1
- Copy of Zeotein Cacao 30-Day Supply- 25% OFF ($101.24): 1
- Zeotein Cacao — 7-Day Supply ($33.99): 1

### c4. GHL subscriptions (`list-subscriptions`, totalCount 16)

| Created | Status | Mode | Amount | Funnel | Page URL | GHL product | Price id |
|---|---|---|---|---|---|---|---|
| 2026-08-07T16:54:10 | canceled | test | 106.24 | DE4OhGSMMY1uNuc5qeGT | /checkout-574507 | 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides ✅" | 6a449ee684703cde1eacb61d |
| 2026-08-06T21:19:43 | canceled | test | 106.24 | DE4OhGSMMY1uNuc5qeGT | /checkout-574507 | 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides ✅" | 6a449ee684703cde1eacb61d |
| 2026-07-30T16:27:03 | canceled | test | 106.24 | DE4OhGSMMY1uNuc5qeGT | /checkout-574507 | 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides ✅" | 6a449ee684703cde1eacb61d |
| 2026-07-23T13:18:17 | canceled | LIVE | 106.24 | DE4OhGSMMY1uNuc5qeGT | /checkout-574507 | 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides" | 6a449ee684703cde1eacb61d |
| 2026-07-09T19:25:33 | canceled | test | 124.99 | DE4OhGSMMY1uNuc5qeGT | /checkout | 6a439d47c8e4bb80f2ee3ae1 "Zeotein Cacao 30-Day Supply Subscription" | 6a439d47f35d4a096ce98cdf |
| 2026-07-08T18:13:55 | canceled | test | 124.99 | DE4OhGSMMY1uNuc5qeGT | /checkout | 6a439d47c8e4bb80f2ee3ae1 "Zeotein Cacao 30-Day Supply Subscription + Free Shaker + 3 Guides" | 6a439d47f35d4a096ce98cdf |
| 2026-07-08T18:13:05 | canceled | test | 124.99 | DE4OhGSMMY1uNuc5qeGT | /checkout | 6a439d47c8e4bb80f2ee3ae1 "Zeotein Cacao 30-Day Supply Subscription + Free Shaker + 3 Guides" | 6a439d47f35d4a096ce98cdf |
| 2026-07-07T02:43:13 | canceled | test | 124.99 | DE4OhGSMMY1uNuc5qeGT | /checkout | 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription" | 6a449ee684703cde1eacb61d |
| 2026-07-07T02:20:26 | canceled | test | 124.99 | DE4OhGSMMY1uNuc5qeGT | /checkout | 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription" | 6a449ee684703cde1eacb61d |
| 2026-07-07T02:15:41 | canceled | test | 124.99 | DE4OhGSMMY1uNuc5qeGT | /checkout | 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription" | 6a449ee684703cde1eacb61d |
| 2026-07-07T01:53:48 | canceled | test | 124.99 | DE4OhGSMMY1uNuc5qeGT | /checkout | 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription" | 6a449ee684703cde1eacb61d |
| 2026-07-07T01:36:02 | canceled | test | 124.99 | DE4OhGSMMY1uNuc5qeGT | /checkout | 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription" | 6a449ee684703cde1eacb61d |
| 2026-07-06T21:54:12 | canceled | test | 124.99 | DE4OhGSMMY1uNuc5qeGT | /checkout-1965 | 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription" | 6a449ee684703cde1eacb61d |
| 2026-07-01T13:16:03 | canceled | test | 114.99 | SFrJuIUhGpXUnInW7GQB | /complete-checkout | 6a3df4cfd3fc5ef596d9b78c "Best Value – 30-Day Subscription (15% Off for Life)✅" | 6a3df4cfd3fc5eebcbd9b797 |
| 2026-07-01T13:12:29 | incomplete_expired | test | 114.99 | SFrJuIUhGpXUnInW7GQB | /complete-checkout | 6a3df4cfd3fc5ef596d9b78c "Best Value – 30-Day Subscription (15% Off for Life)✅" | 6a3df4cfd3fc5eebcbd9b797 |
| 2026-07-01T13:10:50 | incomplete_expired | LIVE | 114.99 | SFrJuIUhGpXUnInW7GQB | /complete-checkout | 6a3df4cfd3fc5ef596d9b78c "Best Value – 30-Day Subscription (15% Off for Life)✅" | 6a3df4cfd3fc5eebcbd9b797 |

### c5. Form submissions, 2026-09-11 .. 2026-11-10 (`get-forms-submissions`, meta.total 17)

| Created (UTC) | Form | Domain | Page URL | Funnel | Page id | Source | Internal? |
|---|---|---|---|---|---|---|---|
| 2026-10-07T08:32:46 | GET YOUR HOLIDAY FREE GUIDE (PpCqz6TQWOIJAOrREDhd) | try.zeotein.com | /holiday-guide | HodAoTBtFU3muDO5CxKB | 1W3uPxw6k3tqowZL4b7U | Direct traffic |  |
| 2026-10-07T08:14:06 | GET YOUR HOLIDAY FREE GUIDE (PpCqz6TQWOIJAOrREDhd) | link.automator.ai | /preview/1W3uPxw6k3tqowZL4b7U | HodAoTBtFU3muDO5CxKB | 1W3uPxw6k3tqowZL4b7U | Direct traffic | yes (preview) |
| 2026-09-22T19:30:33 | Howie Funnel — 15% Popup (4clQASXd5hGUj1clZ863) | go.zeotein.com | / | lCxlMY2Z4Hv0t4ZHzgVW | us01efzu0E7bz9i3tdwu | Social media / meta |  |
| 2026-09-18T18:01:38 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Paid Search |  |
| 2026-09-17T22:47:54 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Social media / meta / campaign 120254376652610066 |  |
| 2026-09-17T22:16:47 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Organic Search |  |
| 2026-09-17T14:29:55 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Direct traffic |  |
| 2026-09-17T11:20:48 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Organic Search |  |
| 2026-09-17T00:56:28 | Howie Funnel — 15% Popup (4clQASXd5hGUj1clZ863) | go.zeotein.com | / | lCxlMY2Z4Hv0t4ZHzgVW | us01efzu0E7bz9i3tdwu | Paid Social / facebook / campaign 120252678380930066 |  |
| 2026-09-16T07:36:06 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Paid Search |  |
| 2026-09-15T16:51:42 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Direct traffic |  |
| 2026-09-15T04:18:42 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Organic Search |  |
| 2026-09-13T14:23:54 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Paid Search |  |
| 2026-09-13T11:58:03 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Organic Search |  |
| 2026-09-13T11:55:54 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Organic Search |  |
| 2026-09-13T11:55:31 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Organic Search |  |
| 2026-09-11T12:04:31 | Email Capture (Website) (79zt6IaeUMtBqWOYXSb3) | link.msgsndr.com |  |  |  | Paid Search / google |  |

Summary: 13 "Email Capture (Website)" (GHL-hosted embed on link.msgsndr.com, no funnel; last 2026-09-18), 2 Howie popup (funnel lCxl…, go.zeotein.com root, 09-17 and 09-22), 1 Holiday Guide (funnel HodAo…, try.zeotein.com, 10-07) and 1 internal Holiday Guide preview. No form submissions after 2026-10-07.

### c6. Survey submissions, 2026-09-11 .. 2026-11-10 (`get-surveys-submissions`, meta.total 7)

| Created (UTC) | Survey | Domain | Page URL | Funnel | Page id | Page title | Source / UTM | Internal? |
|---|---|---|---|---|---|---|---|---|
| 2026-11-08T17:05:21 | Protein Label Test — Funnel Capture (Nr94AuqhnwPGS1Npa3zH) | go.zeotein.com | /cacao-protein-starter-kit | ECf5BDptvwguPNefZikN | ITj4RWjYM2T2jtvF0FqC | Zeotein Clean Protein: First Order Offer + Free Shaker | Social media (m.facebook.com) ; utm_source=CONVERSIONS oSUBSCRIBE, utm_medium=TARGET AUDIENCES (BULK), utm_campaign=AD2, campaign_id 120255245726920066 |  |
| 2026-11-08T13:18:35 | Protein Label Test — Funnel Capture (Nr94AuqhnwPGS1Npa3zH) | go.zeotein.com | /cacao-starter-kit | ECf5BDptvwguPNefZikN | qcfwpXXQyoTSO36yP1r3 | Howie Mandel's Exclusive Zeotein Offer \| Up to 55% Off | Social media (m.facebook.com) ; utm_source=CONVERSIONS oSUBSCRIBE, utm_medium=TARGET AUDIENCES (BULK), utm_campaign=AD2, campaign_id 120255245726920066 |  |
| 2026-11-07T13:12:20 | Protein Label Test — Funnel Capture (Nr94AuqhnwPGS1Npa3zH) | go.zeotein.com | /cacao-protein-starter-kit | ECf5BDptvwguPNefZikN | ITj4RWjYM2T2jtvF0FqC | Zeotein Clean Protein: First Order Offer + Free Shaker | Social media (instagram.com) ; utm_source=CONVERSIONS oSUBSCRIBE, utm_medium=TARGET AUDIENCES (BULK), utm_campaign=AD1NATURALLY, campaign_id 120255245726920066 |  |
| 2026-10-25T07:44:49 | Protein Label Test — Funnel Capture (Nr94AuqhnwPGS1Npa3zH) | link.automator.ai | /preview/ITj4RWjYM2T2jtvF0FqC | ECf5BDptvwguPNefZikN | ITj4RWjYM2T2jtvF0FqC | Zeotein Clean Protein — First Order Offer + Free Shaker | Direct (preview, notrack=true) | yes |
| 2026-10-25T07:02:58 | Protein Label Test — Funnel Capture (Nr94AuqhnwPGS1Npa3zH) | link.automator.ai | /preview/qcfwpXXQyoTSO36yP1r3 | ECf5BDptvwguPNefZikN | qcfwpXXQyoTSO36yP1r3 | Howie Mandel's Exclusive Zeotein Offer \| Up to 55% Off | Direct (preview, notrack=true) | yes |
| 2026-10-25T06:04:55 | Protein Label Test — Funnel Capture (Nr94AuqhnwPGS1Npa3zH) | link.automator.ai | /widget/survey/Nr94AuqhnwPGS1Npa3zH |  |  |  | Referral (survey builder) | yes |
| 2026-10-13T07:06:06 | Survey - Animal Based Protein for Funnel (G4j5pHNhdtay5qecQrOc) | marketing.zeotein.com | /quiz/animal-goals | aJ57oms4DRVjZHAiLqCt | w7baewyiOViECF5iq5i5 | Animal-Based Protein Goals \| Zeotein Formula Quiz | Social media (facebook.com, fbclid) |  |

### c7. Contacts created 2026-09-11 .. 2026-11-10 (`search-contacts-advanced`, dateAdded range, 2 pages, total 147)

| Contact `source` | Contacts |
|---|---|
| (null) | 105 |
| Protein Label Test — Funnel Capture (survey on Purple funnel ECf5BDptvwguPNefZikN) | 17 |
| Shopify - Main Store Abandoned Cart | 13 |
| Email Capture (Website) (form 79zt6IaeUMtBqWOYXSb3) | 8 |
| Howie Funnel — 15% Popup (form 4clQASXd5hGUj1clZ863) | 2 |
| GET YOUR HOLIDAY FREE GUIDE (form PpCqz6TQWOIJAOrREDhd) | 1 |
| Survey - Animal Based Protein for Funnel (survey G4j5pHNhdtay5qecQrOc, quiz funnel aJ57oms4DRVjZHAiLqCt) | 1 |

By month: 2026-11-01..10 24, 2026-10 50, 2026-09-11..30 73. 'Protein Label Test — Funnel Capture' detail: 13 on 2026-11-07..08 (the 3 completed survey submissions among them came from Facebook/Instagram ads, see c6) and 4 on 2026-10-25 (the same day as internal preview tests). 14 contacts (13 with null source, 1 with the Shopify abandoned-cart source) carry the site-popup tags `get15` / `popup-lead` / `acq-optimonk-a`. `attributionSource` came back empty under the projection used, so contacts were not grouped by attribution URL.

## (d) Workflows (`get-workflow`, 110)

Status and updatedAt come from the API. Flags are keyword matches on the workflow **name** only, because definitions return 403 `WORKFLOW_API_NOT_ENABLED_FOR_LOCATION`, so triggers and product-name filters could not be read. Flag key: HOWIE, 15-DAY, QUIZ, FORMULA-FINDER, SHAKER, HOLIDAY-GUIDE, FUNNEL, WINBACK/RESUB, PRODUCT (names a product, line or tier), OFFER/PRICE (names a discount, price or promo), SUB-SWITCH (subscribe-conversion path). ROUTING marks names that imply routing by purchased product or tier.

| Status | Updated | Version | Name | Flags | Note |
|---|---|---|---|---|---|
| published | 2026-11-09 | 20 | 1. Winback — 90 Day Lapsed | WINBACK/RESUB |  |
| published | 2026-10-29 | 18 | 2: Subscription Switch | SUB-SWITCH |  |
| published | 2026-10-15 | 5 | 3. Subscription Switch — A1 Click Exit | SUB-SWITCH |  |
| published | 2026-10-15 | 5 | 4. Subscription Switch — Purchase Exit | SUB-SWITCH |  |
| published | 2026-10-30 | 8 | 5. Winback — Purchase Exit | WINBACK/RESUB |  |
| published | 2026-10-19 | 16 | 7. Tagger — 90 Day Clock. |  |  |
| published | 2026-11-09 | 61 | AC · Cart abandoners · Abandoned cart recovery |  |  |
| published | 2026-11-09 | 91 | B30 · 30-day one-time buyers · Post-purchase, ask to subscribe | PRODUCT |  |
| published | 2026-11-09 | 51 | B7 · 7-day buyers · Post-purchase, move to 30-day | PRODUCT |  |
| published | 2026-11-09 | 17 | BF · New and past one-time buyers · Black Friday and Cyber Monday | OFFER/PRICE |  |
| published | 2026-11-09 | 10 | BSW · Leads, never bought · Big sale week offer | OFFER/PRICE |  |
| published | 2026-07-24 | 4 | Chat Escalation Notification |  |  |
| published | 2026-10-28 | 13 | Chat Lead No Purchase Follow-Up |  |  |
| published | 2026-10-30 | 24 | Chat Lead Nurture |  |  |
| published | 2026-10-29 | 10 | DRAINING since 2026-10-29 - 6. Tagger 60 Day Clock (no triggers, lets the 17 already waiting finish; replaced by Switch Eligible Tagger; set to Draft after 2026-12-28) | SUB-SWITCH |  |
| published | 2026-11-09 | 14 | G2 · Subscribers, order 2 · Gift coming teaser | PRODUCT |  |
| published | 2026-11-09 | 13 | G3 · Subscribers, order 3 · Free collagen gift | PRODUCT |  |
| published | 2026-11-09 | 13 | GC · Everyone · Holiday gift cards | PRODUCT |  |
| published | 2026-10-12 | 4 | Gift Tagger — Collagen Gift Shipped | PRODUCT |  |
| published | 2026-11-09 | 15 | HAL · Leads, never bought · Halloween first-order nudge | OFFER/PRICE |  |
| published | 2026-11-09 | 19 | HG · Holiday Guide leads · Guide delivery and Black Friday list | HOLIDAY-GUIDE, OFFER/PRICE | Holiday Guide funnel HodAo… (1 lead in 60 days). |
| published | 2026-11-09 | 38 | ING · Single-ingredient buyers · Post-purchase, move to a blend | PRODUCT |  |
| published | 2026-07-17 | 24 | Nurture — Animal-Based Lead |  |  |
| published | 2026-09-17 | 6 | Nurture — Plant-Based Lead |  |  |
| published | 2026-11-09 | 23 | OptiMonk - Welcome Email |  |  |
| published | 2026-10-28 | 13 | PP Product Line Tagger — assigns pp-* tag | PRODUCT, ROUTING |  |
| published | 2026-10-13 | 12 | PP Tier Tagger — assigns flow-* tag | ROUTING |  |
| published | 2026-11-09 | 16 | PS · Paused subscribers · Resume and retain | WINBACK/RESUB |  |
| published | 2026-11-09 | 9 | PSE · Paused subscribers · Resume, free 7-Day | WINBACK/RESUB, PRODUCT, OFFER/PRICE |  |
| published | 2026-09-20 | 6 | Pipeline — Move to Repeat Customer v2 |  |  |
| published | 2026-10-13 | 6 | Pipeline — Move to Subscription |  |  |
| published | 2026-10-28 | 30 | Post-Purchase Router — v6 | ROUTING |  |
| published | 2026-10-30 | 21 | Protein Label Test — Lead Magnet Nurture |  | Linked by name to survey "Protein Label Test — Funnel Capture" on the Purple funnel (17 contacts with that source). |
| published | 2026-11-09 | 121 | QZ · Quiz leads · Quiz result nurture | QUIZ | Quiz funnel aJ57… lead (2026-10-13). |
| published | 2026-11-09 | 8 | SBF · Subscribers · Black Friday note and SUBSCRIBER30 | OFFER/PRICE |  |
| published | 2026-11-09 | 81 | SUB · Subscribers · Welcome series |  |  |
| published | 2026-05-26 | 9 | Shopify Tags — Cacao/Vegan/Weight Loss Tags | PRODUCT, ROUTING |  |
| published | 2026-09-22 | 7 | Shopify — Abandoned Cart Purchase Exit |  |  |
| published | 2026-07-20 | 5 | Shopify — Abandoned Checkout |  |  |
| published | 2026-10-17 | 9 | Shopify — Order Count Tags |  |  |
| published | 2026-10-29 | 37 | Shopify — Order Placed | ROUTING |  |
| published | 2026-10-30 | 8 | Sub Order Counter — sub-order-1/2/3 |  |  |
| published | 2026-10-28 | 4 | Subscription Cancelled — Exit Subscriber Flow | WINBACK/RESUB |  |
| published | 2026-10-29 | 4 | Switch Eligible Tagger: 60 days, no subscription | SUB-SWITCH |  |
| published | 2026-07-20 | 3 | Tag — Animal-Based Lead |  |  |
| published | 2026-07-20 | 3 | Tag — Plant-Based Lead |  |  |
| published | 2026-10-27 | 5 | UGC – Approved – One-Time Buyer |  |  |
| published | 2026-10-27 | 6 | UGC – Approved – Subscriber |  |  |
| published | 2026-10-27 | 6 | UGC – Declined |  |  |
| published | 2026-08-30 | 6 | UGC – Form Submitted |  |  |
| published | 2026-10-27 | 8 | UGC – Reshoot |  |  |
| published | 2026-11-09 | 36 | Website Email Capture Discount Code | OFFER/PRICE |  |
| published | 2026-11-09 | 96 | Winback — Subscription Cancelled | WINBACK/RESUB |  |
| published | 2026-10-03 | 10 | Zeotein Cacao 30-Day Bulk Powder Subscription — @ $84.99 | PRODUCT, OFFER/PRICE | Name carries a price. GHL product 6a7b08e3ba3043607e5c2284 / Shopify zeotein-cacao-bag-30-sub-go is titled "…Subscription — 15% Off — $84.99/month" but catalog.tsv price is 76.99. |
| published | 2026-09-20 | 10 | Zeotein Cacao 30-Day Subscription - Renewal | PRODUCT | Published. All 16 GHL subscriptions are canceled/incomplete_expired. If this fires on GHL subscription renewals, nothing is left to fire it (inference, definition unreadable). |
| draft | 2026-05-12 | 6 | 1.1a - New Lead Incubator (needs edited) |  |  |
| draft | 2025-12-18 | 2 | 1.1b - Stop / Pause Lead Incubator (publish) |  |  |
| draft | 2025-12-18 | 2 | 1.2 - Appointment Reminders (edits needed) |  |  |
| draft | 2025-12-18 | 2 | 1.3 - Appointment Status: No Show / Canceled (edits optional) |  |  |
| draft | 2025-12-18 | 2 | 1.4 - Video Engagement (needs edited) |  |  |
| draft | 2025-12-18 | 2 | 2.1 - Purchased Product (needs edited) | PRODUCT |  |
| draft | 2025-12-18 | 2 | 2.2 - Abandoned Cart (needs edited) |  |  |
| draft | 2025-12-18 | 2 | 2.3 - Affiliate Program Sign Up (needs edit) |  |  |
| draft | 2025-12-18 | 2 | 3.1 - Contact Us Notification (edits optional) |  |  |
| draft | 2025-12-18 | 2 | 3.2 - Incoming Message Notification (edits optional) |  |  |
| draft | 2025-12-18 | 2 | 3.3 - General Appointment Reminders (needs edited) |  |  |
| draft | 2026-09-18 | 6 | Abandon Cart |  |  |
| draft | 2026-09-18 | 4 | Abandoned Cart Test |  |  |
| draft | 2026-10-30 | 2 | Cancelled Long Tail - Day 120 (DRAFT awaiting Dana approval) | WINBACK/RESUB |  |
| draft | 2026-09-21 | 8 | Cold Lead Nurture — 15% | OFFER/PRICE |  |
| draft | 2026-10-28 | 30 | INACTIVE 2026-10-27 - 30-Day Supply Upsell (25% Off) 2.0 (Howie GHL funnel retired, do not republish) | HOWIE, FUNNEL, PRODUCT, OFFER/PRICE |  |
| draft | 2026-10-28 | 10 | INACTIVE 2026-10-27 - 7-Day Supply (15% Off Offer) 2.0 (Howie GHL funnel retired, do not republish) | HOWIE, FUNNEL, PRODUCT, OFFER/PRICE |  |
| draft | 2026-10-27 | 30 | INACTIVE 2026-10-27 - Abandoned Cart Recovery (Howie funnel retired, do not republish) | HOWIE, FUNNEL |  |
| draft | 2026-10-27 | 12 | INACTIVE 2026-10-27 - Cacao 30-Day Bulk Bag One-Time 93.49 (Howie GHL funnel retired, do not republish) | HOWIE, FUNNEL, PRODUCT |  |
| draft | 2026-10-27 | 47 | INACTIVE 2026-10-27 - Cacao 30-Day One Time Payment 2.0 (Howie GHL funnel retired, do not republish) | HOWIE, FUNNEL, PRODUCT |  |
| draft | 2026-10-27 | 33 | INACTIVE 2026-10-27 - Cacao 30-Day Supply Subscription 2.0 (Howie GHL funnel retired, do not republish) | HOWIE, FUNNEL, PRODUCT |  |
| draft | 2026-10-28 | 14 | INACTIVE 2026-10-27 - Chat Widget SMS (Howie funnel retired, do not republish) | HOWIE, FUNNEL |  |
| draft | 2026-10-28 | 4 | INACTIVE 2026-10-27 - Chat Widget SMS duplicate (trigger never matched, quiz link dead, do not republish) | QUIZ |  |
| draft | 2026-10-27 | 20 | INACTIVE 2026-10-27 - Howie Popup Email Capture Nurture (Howie funnel retired, do not republish) | HOWIE, FUNNEL |  |
| draft | 2026-10-27 | 6 | INACTIVE 2026-10-27 - Howie Subscription Confirmation and Support (Howie funnel retired, do not republish) | HOWIE, FUNNEL |  |
| draft | 2026-10-27 | 8 | INACTIVE 2026-10-27 - Shopify Howie Abandoned Checkout (Howie funnel retired, do not republish) | HOWIE, FUNNEL |  |
| draft | 2026-10-28 | 14 | INACTIVE 2026-10-28 - 30-Day Supply (15% Off) (Howie GHL funnel retired, do not republish) | HOWIE, FUNNEL, PRODUCT, OFFER/PRICE |  |
| draft | 2026-10-28 | 20 | INACTIVE 2026-10-28 - 7-Day Supply (15% Off Offer) (Howie GHL funnel retired, do not republish) | HOWIE, FUNNEL, PRODUCT, OFFER/PRICE |  |
| draft | 2026-10-28 | 8 | INACTIVE 2026-10-28 - Howie Funnel Cart Started Tag (Howie funnel retired, do not republish) | HOWIE, FUNNEL |  |
| draft | 2026-10-28 | 12 | INACTIVE 2026-10-28 - Howie Funnel Remove Cart Tags On Purchase (Howie funnel retired, do not republish) | HOWIE, FUNNEL |  |
| draft | 2026-10-28 | 9 | INACTIVE 2026-10-28 - Zeotein Cacao 7-Day (15% off) $39.99 (Howie GHL funnel retired, do not republish) | HOWIE, FUNNEL, PRODUCT, OFFER/PRICE |  |
| draft | 2026-10-29 | 10 | INACTIVE 2026-10-29 - Day 24 Reorder Clock (duplicated the post-purchase flows' own reorder asks, do not republish) |  |  |
| draft | 2026-10-29 | 9 | INACTIVE 2026-10-29 - Reorder Nudge - One-Time Buyers (fed only by the retired Day 24 clock, do not republish) |  |  |
| draft | 2026-10-30 | 3 | Lapsed Single-Ingredient Buyer - 90 Days (DRAFT awaiting Dana approval) | WINBACK/RESUB, PRODUCT |  |
| draft | 2026-11-07 | 3 | Lead Evergreen Nurture - After Welcome (DRAFT awaiting Dana approval) |  |  |
| draft | 2026-05-21 | 2 | Post-Purchase Multi-Step Follow-Up |  |  |
| draft | 2026-10-12 | 1 | Post-Purchase — Subscriber v2 |  |  |
| draft | 2026-10-30 | 73 | RETIRED — Main Pipeline Customer (replaced by Router + Post-Purchase flows, do not use) |  |  |
| draft | 2026-11-09 | 19 | SHK · One-time buyers · Free shaker to subscribe | SHAKER |  |
| draft | 2026-10-17 | 2 | Seal Webhook — Subscription Status |  |  |
| draft | 2026-10-31 | 3 | Serial Skipper - Cadence Offer (DRAFT awaiting Dana approval) | OFFER/PRICE |  |
| draft | 2026-07-01 | 6 | Shopify Cart Recovery |  |  |
| draft | 2026-10-13 | 6 | Shopify Tag — Subscription Cancelled | WINBACK/RESUB |  |
| draft | 2026-10-13 | 7 | Shopify — Subscription Active |  |  |
| draft | 2026-10-31 | 5 | Subscriber Order 4 - Thank You (DRAFT awaiting Dana approval) | PRODUCT |  |
| draft | 2026-10-30 | 3 | Subscription Card Failing - Update Payment (DRAFT awaiting Dana approval) |  |  |
| draft | 2026-10-28 | 14 | UGC – Tier A Invite |  |  |
| draft | 2026-10-28 | 13 | UGC – Tier B Invite |  |  |
| draft | 2026-10-30 | 3 | Wholesale Post-Order - Thank You and Reorder (DRAFT awaiting Dana approval) |  |  |
| draft | 2026-08-05 | 15 | Zeotein Cacao 30-Day (15% off) | PRODUCT, OFFER/PRICE |  |
| draft | 2026-08-05 | 11 | Zeotein Cacao 30-Day (15% off) + Free Shaker + 3 Guides | SHAKER, PRODUCT, OFFER/PRICE |  |
| draft | 2026-08-05 | 5 | Zeotein Cacao 30-Day (15% off) - Best Value | PRODUCT, OFFER/PRICE |  |
| draft | 2026-08-05 | 8 | Zeotein Cacao 30-Day Subscription | PRODUCT |  |
| draft | 2026-05-20 | 2 | Zeotein Post-Purchase Journey |  |  |
| draft | 2026-08-03 | 2 | Zeotein – Successful Subscription Renewal → Shopify |  |  |

Published workflows with at least one flag: 32. All 15 Howie-named workflows are drafts named 'INACTIVE 2026-10-27/28 … (Howie … funnel retired, do not republish)'. 4 old order-form workflows named after products (Zeotein Cacao 30-Day (15% off), … + Free Shaker + 3 Guides, … - Best Value, Zeotein Cacao 30-Day Subscription) are drafts last edited 2026-08-05. Two product-named workflows are still published: 'Zeotein Cacao 30-Day Bulk Powder Subscription — @ $84.99' and 'Zeotein Cacao 30-Day Subscription - Renewal'.

## (e) GHL products and prices tied to order forms

GHL holds 65 products (`products.list-invoices`, total 65). 63 have a slug equal to a Shopify handle in catalog.tsv, and order snapshots show `meta.source: "shopify"` with the Shopify product gid. Every funnel-sourced transaction (114) and subscription (16) comes from the three Howie go.zeotein.com funnels. The order-form lines below come from `get-order-by-id` on sample orders and from `list-subscriptions`:

| Funnel / step | Order-form line (funnel product) id | GHL product id → name at order time | Price id (type, amount, SKU) | Shopify product (gid / handle) | Seen in |
|---|---|---|---|---|---|
| funnel one_step_order_form DE4OhGSMMY1uNuc5qeGT step 17c8c589-566c-4b97-88a1-bd36f104bf85 page r7fsG27OJShra8PujXXz go.zeotein.com/checkout-574507 | 6a5d506025da733b8bc68ca5 | 6a449ee669b40bddd6e1cab2 → "Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides" | 6a449ee684703cde1eacb61d (recurring month, 106.24, HOWIE-CAC30-SUB-BNS) | shopify gid://shopify/Product/9435977187541 | order 6a6214951be11115dfd4e1e0 (2026-07-23T13:18:13, LIVE) |
| funnel two_step_order_form DE4OhGSMMY1uNuc5qeGT step 17c8c589 page 7i4nkp1Nuj4aJy166hlM go.zeotein.com/checkout | 6a44da06738bf9dca11d09e2 | 6a449ee669b40bddd6e1cab2 → "Zeotein Cacao 30-Day + Free Shaker + 3 Guides" | 6a449ee684703cde1eacb61d (one_time, 124.99, HOWIE-CAC30-SUB-BNS) | shopify gid://shopify/Product/9435977187541 | order 6a5003b647f931359dc96257 (2026-07-09T20:25:26, LIVE) |
| funnel two_step_order_form DE4OhGSMMY1uNuc5qeGT step 17c8c589 page 7i4nkp1Nuj4aJy166hlM go.zeotein.com/checkout | 6a44a757e82283fc80d52741 | 6a4395ee84703cb55768973c → "Zeotein Cacao 7-Day Stick Packs" | 6a4395eec8e4bb6c86ec57f9 (one_time, 38.99, HOWIE-CAC7-OT) | shopify gid://shopify/Product/9435948613845 | order 6a4ddb4efc0934f8c92c3883 (2026-07-08T05:08:30, LIVE) |
| funnel two_step_order_form DE4OhGSMMY1uNuc5qeGT step 17c8c589 page r7fsG27OJShra8PujXXz go.zeotein.com/checkout-574507 | 6a44da06738bf9dca11d09e2 | 6a449ee669b40bddd6e1cab2 → "Zeotein Cacao 30-Day Supply + Free Shaker + 3 Guides — $124.99" | 6a449ee684703cde1eacb61d (one_time, 124.99, HOWIE-CAC30-SUB-BNS) | shopify gid://shopify/Product/9435977187541 | order 6a5c581a8c75e5136bedbe3b (2026-07-19T04:52:42, LIVE) |
| funnel two_step_order_form SFrJuIUhGpXUnInW7GQB step 604a19f7-e612-4387-b2cf-ae59bc2e8a00 page 489TSMOBJAsS9G4irCHl go.zeotein.com/complete-checkout | 6a430e3d1ce287140be3ce53 | 6a3b5f2562f10855dd790736 → "Zeotein Cacao 30-Day Supply (15% Off Offer) ✅" | 6a3b5f25765ffb56b96e4056 (one_time, 114.99, CACAO-30-DAY STICK PACK) | shopify gid://shopify/Product/9431042130133 | order 6a450edeeaf30460b10133e4 (2026-07-01T12:58:06, LIVE) |
| funnel one_step_order_form bv1fI2cXX8tzW8NCy8zI step 50f9c18a-3e6a-48fb-8c2f-730315def206 page BMwBBJorEMEOKPtbEAtT go.zeotein.com/checkout-265915 | 6a628d2c97e0441b38520fb3 | 69f3c7ce4f77386b0c53a7f2 → "Zeotein Vegan 7-Day Supply" | 69f3c7cec88c092ee085e61b (one_time, 44.99, VEGAN-7-Day-Stick Pack) | shopify gid://shopify/Product/9254295306453 | order 6a6b795f6834f087283b28a7 (2026-07-30T16:18:39, test) |
| funnel upsell DE4OhGSMMY1uNuc5qeGT step 848edabf-08fa-4459-bab3-fdd156d2021d page majwxWOQoyGQzYZY5ENP go.zeotein.com/upsell | 6a4c074c72456748f0e3091b | 6a3b60215ee4f3e5eee52f58 → "Zeotein Cacao 30-Day Supply – Second Bag (25% Off Upsell)" | 6a3b602162f1085522796878 (one_time, 94, HOWIE-CAC30-UP) | shopify gid://shopify/Product/9431042359509 | order 6a760dde21617a42ea485e68 (2026-08-07T16:54:54, test) |
| DE4O… /checkout | (subscription line) 6a44a7b696734426afaa24f3 | 6a439d47c8e4bb80f2ee3ae1 → "Zeotein Cacao 30-Day Supply Subscription (+ Free Shaker + 3 Guides)"; the same line id carried 6a449ee669b40bddd6e1cab2 "Zeotein Cacao 30-Day Subscription" (price 6a449ee684703cde1eacb61d) in the 2026-07-06..07 subscriptions | 6a439d47f35d4a096ce98cdf (recurring monthly, 124.99) | slug zeotein-cacao-30-legacy-bundle = Shopify 9435963261141 | subscriptions 2026-07-06..09 (test) |
| SFrJu… /complete-checkout | (subscription line) 6a430e48956648f0646042ed | 6a3df4cfd3fc5ef596d9b78c → "Best Value – 30-Day Subscription (15% Off for Life)✅" | 6a3df4cfd3fc5eebcbd9b797 (recurring monthly, 114.99) | none (GHL-only DIGITAL product) | subscriptions 2026-07-01 |

Price id 6a449ee684703cde1eacb61d (SKU HOWIE-CAC30-SUB-BNS) was `one_time` $124.99 in the 2026-07-09 and 07-19 orders and `recurring` monthly $106.24 in the 2026-07-23 order. The price was edited in place, and the product name changed three times across those orders ("Zeotein Cacao 30-Day + Free Shaker + 3 Guides" → "… Supply + Free Shaker + 3 Guides — $124.99" → "Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides"). Today it reads "Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides ✅".

The currently approved funnels use no GHL products. Their steps have empty `products` arrays and their buy buttons go to Shopify. The Purple funnel's Body tracking code routes these Shopify variants (titles and handles read from Shopify):

| Role in Purple script | Variant id | Shopify product | Handle | Price | Status |
|---|---|---|---|---|---|
| SUBSCRIBE (gifts: shaker, scoop, starter guide, cacao guide, vegan guide) | 67710100308181 | Zeotein Cacao Starter Kit — 30-Day Bulk Bag | zeotein-cacao-bag-30-try | 93.49 | UNLISTED |
| SUBSCRIBE (gifts: shaker, starter guide, cacao guide, vegan guide) | 67758454669525 | Zeotein Cacao Starter Kit 30-Day Stick Packs | zeotein-cacao-sticks-30-web | 134.99 | UNLISTED |
| BUY ONCE (gifts: scoop, 3 guides) | 54944151634133 | Zeotein Cacao Protein Powder Bulk Bag – Cacao Landing Page | zeotein-cacao-bag-30-web | 109.99 | UNLISTED |
| BUY ONCE (gifts: 3 guides) | 67775397986517 | Zeotein Cacao 30-Day Stick Packs — One-Time Purchase | zeotein-cacao-sticks-30-onetime | 134.99 | UNLISTED |
| gift line | 67706369704149 | Zeotein CleanBlend Shaker Bottle - 27 oz (Black) | lp-gift-cleanblend-shaker | 15.99 | UNLISTED |
| gift line | 67706369507541 | Zeotein Save-A-Scoop - Protein Powder Scoop Holder for Bags & Tubs | lp-gift-save-a-scoop | 6.99 | UNLISTED |
| gift line | 67706369540309 | Zeotein Starter Guide | lp-gift-starter-guide | 12.00 | UNLISTED |
| gift line | 67706369605845 | Cacao Recipe Guide | lp-gift-cacao-recipe-guide | 14.00 | UNLISTED |
| gift line | 67706369638613 | Vegan Recipe Guide | lp-gift-vegan-recipe-guide | 14.00 | UNLISTED |

GHL product names that no longer match the Shopify title for the same handle (risk for name-based triggers):

| GHL product id | GHL name | Shopify title (catalog.tsv) | Handle |
|---|---|---|---|
| 69f3c7e17730cfc6cfb99b6a | Men’s premium tank top | Men's premium tank top | men-s-premium-tank-top |
| 6a439d47c8e4bb80f2ee3ae1 | Zeotein Cacao 30-Day Supply + Free Shaker + 3 Guides ✅ | Zeotein Cacao 30-Day Supply + Free Shaker + 3 Guides ✅ (howie) | zeotein-cacao-30-legacy-bundle |
| 6a4c1cf58de40e7904727dbc | Zeotein Cacao 30-Day Supply – Second Bag (25% Off) ✅ | Zeotein Cacao 30-Day Supply – Second Bag (25% Off) ✅ (howie) | zeotein-cacao-30-legacy-upsell-b |
| 6a736807bc919aee55f9c7aa | Zeotein Cacao Protein Powder Bulk Bag - 4 Pack, 120 Servings (Buy 3, Get 1 Free) | Zeotein Cacao Bulk Bag - 4 Pack (Buy 3 Get 1 Free) | zeotein-cacao-bulk-bag-4-month-supply-buy-3-get-1-free |
| 6ac801b3aea026a29b7b35f6 | Zeotein Starter Guide | Zeotein Starter Guide (cacao-lp-gift) | lp-gift-starter-guide |
| 6ac801b473b18570276aefb4 | Zeotein Save-A-Scoop - Protein Powder Scoop Holder for Bags & Tubs | Save-A-Scoop (cacao-lp-gift) | lp-gift-save-a-scoop |
| 6ac801b759763fa6c1dc2dda | Vegan Recipe Guide | Vegan Recipe Guide (cacao-lp-gift) | lp-gift-vegan-recipe-guide |
| 6ac801b720e171f943e8a9c6 | Cacao Recipe Guide | Cacao Recipe Guide (cacao-lp-gift) | lp-gift-cacao-recipe-guide |
| 6ac801b820e171f943e8a9f6 | Zeotein CleanBlend Shaker Bottle - 27 oz | CleanBlend Shaker (cacao-lp-gift) | lp-gift-cleanblend-shaker |
| 6ad26a31bd402eeb24c97d3d | Zeotein Cacao | Zeotein Cacao (cacao-lp) | cacao-protein-starter-kit |
| 6ade27af8a1b798ccaa11f5d | Zeotein Cacao Protein Powder Bulk Bag - 30 Servings - Returning Subscriber | Cacao Bulk Bag - Returning Subscriber (winback) | zeotein-cacao-bag-30-return |
| 6ae214ad5af3881928185aa6 | Zeotein Cacao Protein Powder Bulk Bag - 30 Servings - Resubscribe No Intro | Cacao Bulk Bag - Resubscribe No Intro | zeotein-cacao-bag-30-resub |
| 6ae214c581da6aba2a95e021 | Zeotein Cacao Protein Powder - 30 Stick Packs - Resubscribe No Intro | Cacao 30 Sticks - Resubscribe No Intro | zeotein-cacao-sticks-30-resub |
| 6ae214d5d0b92ffdf729fd20 | Zeotein Vegan Protein Powder - 30 Stick Packs - Resubscribe No Intro | Vegan 30 Sticks - Resubscribe No Intro | zeotein-vegan-sticks-30-resub |

GHL products with no Shopify handle match: 6a3df4cfd3fc5ef596d9b78c "✅ Best Value – Zeotein Cacao 30-Day Supply Subscription + Free Shaker + 3 Guides — $124.99 per month" (DIGITAL) and 6a7b04d4a7680d67bf2dc205 "Zeotein Cacao Bulk Bag @ $99.99" (DIGITAL).

Full GHL product list:

| GHL id | Name | Type | Slug | Created | Updated | Shopify id | Shopify status |
|---|---|---|---|---|---|---|---|
| 69f3c7cb51a55a9519dc9742 | Zeotein Cacao Protein Powder - 7 Stick Packs, Collagen & Bone Broth | PHYSICAL | zeotein-cacao-sticks-7 | 2026-04-30 | 2026-11-07 | 9174425993429 | ACTIVE |
| 69f3c7cc4f7738534153a7bc | Zeotein Cacao Protein Powder - 30 Stick Packs, Collagen & Bone Broth | PHYSICAL | zeotein-cacao-sticks-30 | 2026-04-30 | 2026-11-05 | 9202824380629 | ACTIVE |
| 69f3c7cd7730cf8b07b9983b | Zeotein 15-Day Reset | PHYSICAL | zeotein-15-day-reset | 2026-04-30 | 2026-11-05 | 9203721339093 | UNLISTED |
| 69f3c7ce4f77386b0c53a7f2 | Zeotein Vegan Protein Powder - 7 Stick Packs, Pumpkin Seed & Hemp | PHYSICAL | zeotein-vegan-sticks-7 | 2026-04-30 | 2026-11-04 | 9254295306453 | ACTIVE |
| 69f3c7cfc23ecfb3dd10f8c3 | Zeotein Vegan Protein Powder - 30 Stick Packs, Pumpkin Seed & Hemp | PHYSICAL | zeotein-vegan-sticks-30 | 2026-04-30 | 2026-11-04 | 9254632653013 | ACTIVE |
| 69f3c7d0274f32118ebcc306 | Zeotein Grass-Fed Bone Broth Powder – Unflavored | PHYSICAL | zeotein-bone-broth-protein-powder | 2026-04-30 | 2026-11-05 | 9262718910677 | ACTIVE |
| 69f3c7d1c23ecfa7ed10f93c | Zeotein Grass-Fed Collagen Peptides Powder - Unflavored | PHYSICAL | zeotein-collagen-peptides | 2026-04-30 | 2026-11-05 | 9264652910805 | ACTIVE |
| 69f3c7d3c0a84c79727da81e | Zeotein Zeolite Powder - Natural Volcanic Mineral, Unflavored | PHYSICAL | zeolite | 2026-04-30 | 2026-11-05 | 9264679256277 | ACTIVE |
| 69f3c7d4c23ecfa8d610f94d | Zeotein Organic MCT Oil Powder - Unflavored | PHYSICAL | organic-mct-oil-powder | 2026-04-30 | 2026-11-05 | 9264871375061 | ACTIVE |
| 69f3c7d54a451b10da4f0753 | Zeotein Organic Sea Moss Powder - Wildcrafted St. Lucia Gold & Purple | PHYSICAL | organic-sea-moss-powder | 2026-04-30 | 2026-11-05 | 9266819203285 | ACTIVE |
| 69f3c7d6eb848d819c8605ec | Zeotein Organic Lion's Mane Mushroom Powder – Unflavored | PHYSICAL | organic-lion-s-mane-mushroom-powder | 2026-04-30 | 2026-11-05 | 9266900566229 | ACTIVE |
| 69f3c7d86446c27e17aadd3b | Zeotein Organic Cacao Powder – Fermented | PHYSICAL | organic-fermented-cacao-powder-premium-unsweetened | 2026-04-30 | 2026-11-05 | 9266912198869 | ACTIVE |
| 69f3c7d9b24e208537fe3d95 | Zeotein Organic Hemp Protein Powder – Plant-Based, Naturally Nutty | PHYSICAL | organic-hemp-protein-powder-premium-plant-based-protein | 2026-04-30 | 2026-11-05 | 9266916655317 | ACTIVE |
| 69f3c7dac0a84ce9f47da8c5 | Zeotein Organic Pumpkin Seed Protein Powder – Styrian, Vegan | PHYSICAL | organic-pumpkin-seed-protein-powder | 2026-04-30 | 2026-11-05 | 9269244231893 | ACTIVE |
| 69f3c7dbc0a84c5eff7da931 | Unisex t-shirt | PHYSICAL | unisex-t-shirt | 2026-04-30 | 2026-05-20 | 9288308588757 | DRAFT |
| 69f3c7df6446c25da6aade51 | Unisex organic sweatshirt | PHYSICAL | unisex-organic-sweatshirt | 2026-04-30 | 2026-06-08 | 9303078043861 | DRAFT |
| 69f3c7e17730cfc6cfb99b6a | Men’s premium tank top | PHYSICAL | men-s-premium-tank-top | 2026-04-30 | 2026-05-20 | 9303190995157 | DRAFT |
| 69f3c7e24f77380c0353aa87 | Women's Racerback Tank | PHYSICAL | womens-racerback-tank | 2026-04-30 | 2026-05-20 | 9303193223381 | DRAFT |
| 69f3c7e4c88c0961e985e896 | Zeotein Keep it Clean heavyweight long-sleeve shirt | PHYSICAL | zeotein-long-sleeve-shirt | 2026-04-30 | 2026-10-29 | 9307376845013 | UNLISTED |
| 69f3c7e6c107fd731c7df380 | Zeotein CleanBlend Shaker Bottle – 27 oz | PHYSICAL | zeotein-cleanblend-shaker-27oz-usa-made | 2026-04-30 | 2026-11-05 | 9340801515733 | ACTIVE |
| 69f3c7e7c0a84c11817daa8c | Zeotein Cacao Protein Powder Bulk Bag - 30 Servings, Collagen & Bone Broth | PHYSICAL | zeotein-cacao-bag-30 | 2026-04-30 | 2026-11-10 | 9342459674837 | ACTIVE |
| 69f3c7e796ff9d7596b1cef7 | Zeotein Save-A-Scoop - Protein Powder Scoop Holder for Bags & Tubs | PHYSICAL | save-a-scoop | 2026-04-30 | 2026-11-07 | 9342517182677 | ACTIVE |
| 6a3b5dbe5ee4f30192e403e9 | Zeotein Cacao 7-Day Stick Packs (15% Off Offer) ✅ | PHYSICAL | zeotein-cacao-sticks-7-legacy-b | 2026-06-24 | 2026-11-05 | 9431041573077 | UNLISTED |
| 6a3b5f2562f10855dd790736 | Zeotein Cacao 30-Day Supply (15% Off Offer) | PHYSICAL | zeotein-cacao-30-legacy-onetime-b | 2026-06-24 | 2026-11-05 | 9431042130133 | UNLISTED |
| 6a3b60215ee4f3e5eee52f58 | Zeotein Cacao 30-Day Supply – Second Bag (25% Off Upsell) | PHYSICAL | zeotein-cacao-30-legacy-upsell | 2026-06-24 | 2026-11-05 | 9431042359509 | UNLISTED |
| 6a3df4cfd3fc5ef596d9b78c | ✅ Best Value – Zeotein Cacao 30-Day Supply Subscription + Free Shaker + 3 Guides — $124.99 per month | DIGITAL |  | 2026-06-26 | 2026-07-19 |  |  |
| 6a4395ee84703cb55768973c | Zeotein Cacao 7-Day Stick Packs | PHYSICAL | zeotein-cacao-sticks-7-legacy | 2026-06-30 | 2026-11-05 | 9435948613845 | UNLISTED |
| 6a439d47c8e4bb80f2ee3ae1 | Zeotein Cacao 30-Day Supply + Free Shaker + 3 Guides ✅ | PHYSICAL | zeotein-cacao-30-legacy-bundle | 2026-06-30 | 2026-11-05 | 9435963261141 | UNLISTED |
| 6a449ee669b40bddd6e1cab2 | Zeotein Cacao 30-Day Subscription + Free Shaker + 3 Guides ✅ | PHYSICAL | zeotein-cacao-30-legacy-sub | 2026-07-01 | 2026-11-05 | 9435977187541 | UNLISTED |
| 6a4c1cf58de40e7904727dbc | Zeotein Cacao 30-Day Supply – Second Bag (25% Off) ✅ | PHYSICAL | zeotein-cacao-30-legacy-upsell-b | 2026-07-06 | 2026-11-05 | 9446080970965 | UNLISTED |
| 6a6481ed0d4e3a628d1fe19e | Zeotein Cacao 30-Day Supply | PHYSICAL | zeotein-cacao-30-legacy-onetime | 2026-07-25 | 2026-11-05 | 9435961983189 | UNLISTED |
| 6a736807bc919aee55f9c7aa | Zeotein Cacao Protein Powder Bulk Bag - 4 Pack, 120 Servings (Buy 3, Get 1 Free) | PHYSICAL | zeotein-cacao-bulk-bag-4-month-supply-buy-3-get-1-free | 2026-08-05 | 2026-11-04 | 9523394740437 | DRAFT |
| 6a744b6cc5e8541aeebd61fb | Zeotein Cacao Bulk Bag Starter Kit | PHYSICAL | zeotein-cacao-bag-30-intro | 2026-08-06 | 2026-11-09 | 9524324040917 | UNLISTED |
| 6a7b04d4a7680d67bf2dc205 | Zeotein Cacao Bulk Bag @ $99.99 | DIGITAL |  | 2026-08-11 | 2026-08-11 |  |  |
| 6a7b083f5dfe2a34bd06c0e0 | Zeotein Cacao — 30-Day Bulk Bag — One-Time — 15% Off — $93.49 | PHYSICAL | zeotein-cacao-bag-30-onetime-go | 2026-08-11 | 2026-11-04 | 9530381041877 | UNLISTED |
| 6a7b08e3ba3043607e5c2284 | Zeotein Cacao — 30-Day Bulk Bag — Subscription — 15% Off — $84.99/month | PHYSICAL | zeotein-cacao-bag-30-sub-go | 2026-08-11 | 2026-11-04 | 9530381893845 | UNLISTED |
| 6a7e5aff3f30e00c3345ef4f | Zeotein Cacao — 7-Day Stick Packs — 15% Off — $33.99 | PHYSICAL | zeotein-cacao-sticks-7-onetime-go | 2026-08-14 | 2026-11-05 | 9533741367509 | UNLISTED |
| 6a7e5b87a0b66a21f61c7ac6 | Zeotein Cacao — 30-Day Stick Packs — One-Time — 15% Off — $114.74 | PHYSICAL | zeotein-cacao-sticks-30-onetime-go | 2026-08-14 | 2026-11-05 | 9533742645461 | UNLISTED |
| 6a7e5c43d31949e5b55d2491 | Zeotein Cacao — 30-Day Stick Packs — Subscription — 15% Off — $97.74/month | PHYSICAL | zeotein-cacao-sticks-30-sub-go | 2026-08-14 | 2026-11-05 | 9533743202517 | UNLISTED |
| 6a7e998e58d1f417098921df | Cacao Recipe Guide | PHYSICAL | cacao-recipe-guide | 2026-08-14 | 2026-11-05 | 9534096081109 | ACTIVE |
| 6a7e9beaa0b66a21f63c2d4e | Vegan Recipe Guide | PHYSICAL | vegan-recipe-guide | 2026-08-14 | 2026-11-05 | 9534096474325 | ACTIVE |
| 6a7e9d127ef1e55b64b407cf | Zeotein Starter Guide | PHYSICAL | zeotein-starter-guide | 2026-08-14 | 2026-11-05 | 9534097686741 | ACTIVE |
| 6a7ea86409562f3eac1d4c9f | Zeotein Cacao 30-Day Bulk Bag — Buy Once | PHYSICAL | zeotein-cacao-bag-30-onetime | 2026-08-14 | 2026-11-04 | 9534174593237 | UNLISTED |
| 6aa8ac4e9d313aecccb35fe9 | Zeotein Cacao Protein Powder Bulk Bag – Cacao Landing Page | PHYSICAL | zeotein-cacao-bag-30-web | 2026-09-15 | 2026-11-04 | 9607050952917 | UNLISTED |
| 6ab21cadfb71ff7561935bda | Free Gift: Collagen, Thanks for 3 Months! | PHYSICAL | lp-gift-collagen | 2026-09-22 | 2026-11-09 | 9621447344341 | UNLISTED |
| 6abca957abe15dc0148f5af6 | 30-Day Cacao Bulk Bag | PHYSICAL | zeotein-cacao-bag-30-landing-page | 2026-09-30 | 2026-11-04 | 15398808027349 | UNLISTED |
| 6ac33d401ec6c0c084fbc2be | Zeotein Gift Card | PHYSICAL | zeotein-gift-card | 2026-10-05 | 2026-10-23 | 15407626682581 | ACTIVE |
| 6ac801b3aea026a29b7b35f6 | Zeotein Starter Guide | PHYSICAL | lp-gift-starter-guide | 2026-10-08 | 2026-11-05 | 15420486254805 | UNLISTED |
| 6ac801b473b18570276aefb4 | Zeotein Save-A-Scoop - Protein Powder Scoop Holder for Bags & Tubs | PHYSICAL | lp-gift-save-a-scoop | 2026-10-08 | 2026-11-05 | 15420486222037 | UNLISTED |
| 6ac801b759763fa6c1dc2dda | Vegan Recipe Guide | PHYSICAL | lp-gift-vegan-recipe-guide | 2026-10-08 | 2026-11-05 | 15420486353109 | UNLISTED |
| 6ac801b720e171f943e8a9c6 | Cacao Recipe Guide | PHYSICAL | lp-gift-cacao-recipe-guide | 2026-10-08 | 2026-11-05 | 15420486320341 | UNLISTED |
| 6ac801b820e171f943e8a9f6 | Zeotein CleanBlend Shaker Bottle - 27 oz | PHYSICAL | lp-gift-cleanblend-shaker | 2026-10-08 | 2026-11-05 | 15420486451413 | UNLISTED |
| 6ac8538359763fa6c1f14966 | Zeotein Cacao Starter Kit — 30-Day Bulk Bag | PHYSICAL | zeotein-cacao-bag-30-try | 2026-10-09 | 2026-11-05 | 15421119398101 | UNLISTED |
| 6acee88ace2e593f739c631b | Zeotein Cacao Starter Kit 30-Day Stick Packs | PHYSICAL | zeotein-cacao-sticks-30-web | 2026-10-14 | 2026-11-05 | 15432486125781 | UNLISTED |
| 6ad04762f264d6c665c07a6b | Zeotein Cacao 30-Day Stick Packs — One-Time Purchase | PHYSICAL | zeotein-cacao-sticks-30-onetime | 2026-10-15 | 2026-11-04 | 15435750310101 | UNLISTED |
| 6ad26a31bd402eeb24c97d3d | Zeotein Cacao | PHYSICAL | cacao-protein-starter-kit | 2026-10-16 | 2026-10-30 | 15439760556245 | UNLISTED |
| 6ade27af8a1b798ccaa11f5d | Zeotein Cacao Protein Powder Bulk Bag - 30 Servings - Returning Subscriber | PHYSICAL | zeotein-cacao-bag-30-return | 2026-10-25 | 2026-10-29 | 15468436848853 | UNLISTED |
| 6ae214ad5af3881928185aa6 | Zeotein Cacao Protein Powder Bulk Bag - 30 Servings - Resubscribe No Intro | PHYSICAL | zeotein-cacao-bag-30-resub | 2026-10-28 | 2026-11-03 | 15478746972373 | UNLISTED |
| 6ae214c581da6aba2a95e021 | Zeotein Cacao Protein Powder - 30 Stick Packs - Resubscribe No Intro | PHYSICAL | zeotein-cacao-sticks-30-resub | 2026-10-28 | 2026-11-03 | 15478747529429 | UNLISTED |
| 6ae214d5d0b92ffdf729fd20 | Zeotein Vegan Protein Powder - 30 Stick Packs - Resubscribe No Intro | PHYSICAL | zeotein-vegan-sticks-30-resub | 2026-10-28 | 2026-10-29 | 15478747955413 | UNLISTED |
| 6ae339f1a1d437084e0627b5 | Free Gift: 7-Day Cacao with Gift Card | PHYSICAL | gc-gift-7day-cacao | 2026-10-29 | 2026-11-05 | 15480736350421 | UNLISTED |
| 6ae3c95231c99788e13ab652 | Zeotein Vegan Starter Kit 30-Day Stick Packs | PHYSICAL | zeotein-vegan-sticks-30-intro | 2026-10-29 | 2026-10-31 | 15481820643541 | UNLISTED |
| 6aedd13b640cf3c1b314783b | 30-Day Cacao Bulk Bag - Black Friday | PHYSICAL | 30-day-cacao-bulk-bag-black-friday | 2026-11-06 | 2026-11-07 | 15501241352405 | UNLISTED |
| 6aeddfa1640cf3c1b31f5a97 | 30-Day Cacao Stick Packs - Black Friday | PHYSICAL | 30-day-cacao-stick-packs-black-friday | 2026-11-06 | 2026-11-07 | 15501284770005 | UNLISTED |
| 6aef19620a0d0aa7ce12d1cc | Stocking Stuffers — 7-Day Gift | PHYSICAL | stocking-stuffers-7-day-gift | 2026-11-07 | 2026-11-07 | 15503435890901 | UNLISTED |

## (f) Turning off a funnel path: the operations that exist

The funnels operations found are getFunnels, getPagesByFunnelId, getPagesCountByFunnelId, fetch-redirects-list, create-redirect, update-redirect-by-id and delete-redirect-by-id. A funnels-domain search for update, delete, unpublish or domain returned only the redirect writes. So there is no API way to delete, unpublish or detach a funnel, step or domain; the only API lever for a retired path is a URL redirect. **None of these writes was executed.**

| operationId | Method + path | Kind / safety | Body (from describe_operation) |
|---|---|---|---|
| `fetch-redirects-list` | GET /funnels/lookup/redirect/list | read; scope funnels/redirect.readonly | query: `limit` (number, required, **max 20**), `offset` (number, required), `search` (string, optional). locationId injected. Current result: `{"data": [], "count": 0}` |
| `create-redirect` | POST /funnels/lookup/redirect | write; scope funnels/redirect.write; idempotencyRequired true; requiresApproval true | body (all required): `domain` string (e.g. "example.com"), `path` string (e.g. "/Hello"), `target` string (e.g. "https://www.google.com"), `action` enum `funnel` \| `website` \| `url` \| `all`. locationId injected into the body. |
| `update-redirect-by-id` | PATCH /funnels/lookup/redirect/{id} | write; idempotencyRequired; requiresApproval | path `id`; body (required): `target` string, `action` enum funnel \| website \| url \| all |
| `delete-redirect-by-id` | DELETE /funnels/lookup/redirect/{id} | delete (destructiveHint true); idempotencyRequired; requiresApproval | path `id`, no body |

Example call shape for one retired path (NOT executed; the target is a placeholder the team must choose):

```json
{
  "operationId": "create-redirect",
  "idempotencyKey": "<unique key>",
  "params": {
    "body": {
      "domain": "go.zeotein.com",
      "path": "/howie-bulk-offer--landing-page",
      "target": "<approved destination URL>",
      "action": "url"
    }
  }
}
```

Caveats: the schema does not document what each `action` value does (the field example reads "URL" and the payloadExample uses "funnel"). The API does not say whether a redirect takes precedence over a live funnel step on the same path. Test one low-risk path, such as the test site `/test-03123123123231-donotuse`, and check it in a browser before doing the rest. Candidate paths are the configured paths listed in (b) for the LIVE-BUT-RETIRED funnels.

## (g) Template funnels (259)

All 259 have dateAdded, dateUpdated and updatedAt in 2025-12. None has a domainId, step products or additionalRoutes, and none was updated in 2026. Format: id — name (pages).

- YhKhJUYix9DQzLUEofpW — A.I. - Appointment - Cutting Edge (6)
- 8OAvRVEHDUQwInmcPM5p — A.I. - Limited Time Offer - Cutting Edge (8)
- tIU98FMsGRTADQrXtgxQ — A.I. - Quiz Funnel - Cutting Edge (7)
- P9Xqe49erQJr2paL6O6T — A.I. - Video Sales Letter - Cutting Edge (5)
- cpJqRjgixTS1C5iEJMY9 — A.I. - Webinar Registration - Cutting Edge (6)
- hu4lf8XbNbj6qcdRZlYG — A.I. - Webinar Sales - Cutting Edge (5)
- 9QSCIvp93iuMmFovRh5A — Affiliate Signup (1)
- mIISW3lG3SGodTXH9Ydt — Affiliates - Appointment - Tart and Tangy (6)
- 8JLw88hmm0eJxtlWH5ux — Affiliates - Lead Magnet - Tart and Tangy (6)
- SyvBCHpWbPKBwVzLvG1R — Affiliates - Limited Time Offer - Tart and Tangy (8)
- phVRPuviui1pQHuJ4J5d — Affiliates - Quiz Funnel - Tart and Tangy (7)
- ja8BP2HjZ6N8urumakvT — Affiliates - Video Sales Letter - Tart and Tangy (5)
- 9uUsHsh7elUJ8gHSd6xJ — Affiliates - Webinar Registration - Tart and Tangy (6)
- KzJbfSvZZEr6zkLAOQWi — Affiliates - Webinar Sales - Tart and Tangy (5)
- 2unDX7gQussQRwYapefB — Agency - Appointment - Black & Yellow (6)
- D9bABudbAuqFrQ7ZiJ47 — Agency - Lead Magnet - Black & Yellow (6)
- DhoZW11kV4TttMN8PM3k — Agency - Limited Time Offer - Black & Yellow (8)
- CCwB3a6sLOy4Xc8DqWJc — Agency - Quiz Funnel - Black & Yellow (7)
- cGH44UhuCoYXS8XEcBn0 — Agency - Video Sales - Black & Yellow (5)
- DmOkcX76DhHVLjhMiImV — Agency - Webinar Registration - Black & Yellow (6)
- 46YfeSpgiPJOzQZJgAQm — Agency - Webinar Sales - Black & Yellow (5)
- Ct02DW0nty6EuxtqAa55 — Amazon Seller - Appointment - Sunset Sodalite (6)
- mrpbMw9Qky13bJnpoxFG — Amazon Seller - Lead Magnet - Sunset Sodalite (6)
- JnFgAAFD0gXUI1Qhybhp — Amazon Seller - Limited Time Offer - Sunset Sodalite (8)
- DziPd1h2hSFxIUROY3UA — Amazon Seller - Quiz Funnel - Sunset Sodalite (7)
- hpRqLhB4YDVvHviDpwlA — Amazon Seller - Video Sales Letter - Sunset Sodalite (5)
- SYj6VvGFp4wSD0WoZQg0 — Amazon Seller - Webinar Registration - Sunset Sodalite (6)
- VuP73SOZb6Vzhg5shyGR — Amazon Seller - Webinar Sales - Sunset Sodalite (5)
- 7PrJIVzEJdodhd9Uam4q — Appointment - Aqua Bliss (6)
- no29hyQhmhI7Xvd9f5vm — Appointment - Black & Yellow (6)
- HuQodRd0rYV7lOPCw49c — Appointment - Blue Blaze (6)
- FQxblizx407udvYqG4ih — Appointment - Cherry Bomb (6)
- Z4eYyJKYQpMAkKWTSfhx — Appointment - Cutting Edge (6)
- azZqqBNZz8joNEchtY96 — Appointment - Cyberspace (6)
- 8wjmoQ2iXRlqmLDmbYYw — Appointment - Dollar Bill Dreams (6)
- 6RIhSZKKFit2AH3CEdoB — Appointment - Keep it Green (6)
- t9e1q8Xz142QOjo4V9mn — Appointment - Modern Disco (6)
- 5SmkhOBqHDMzAiNxOAar — Appointment - Monochrome (6)
- dtgn2EndtcMoOTVCaz69 — Appointment - Oodles of Doodles (6)
- UMBN9IqJ3ERWOefsNLJu — Appointment - Pistachio Paradise (6)
- t9fCC1uH36SjJ20weON7 — Appointment - Purple Passion (6)
- y8GVeZSWin26QUAWHWyJ — Appointment - Sand Dunes (6)
- coSfLjQPYhPxyI7s2rMm — Appointment - Silver Lining (6)
- US7NLe7KlhNEdiu2qF9t — Appointment - Sunset Sodalite (6)
- byZS9CoKu7AIniSEjgcC — Appointment - Tart and Tangy (6)
- nN5uQTHkFEZzzkZ8e4hT — Appointment - Teal Tranquility (6)
- 5CYHWbb07XthCklkhySN — Art & Design - Appointment - Monochrome (6)
- dRJyiMV6SQww9Jw3r3W4 — Art & Design - Lead Magnet - Monochrome (6)
- gh0sija9hVzasxxBskTl — Art & Design - Limited Time Offer - Monochrome (8)
- 7GNC0fAQiweZCuJuyiyL — Art & Design - Quiz Funnel - Monochrome (7)
- blfrUejgil5Fg192v3bG — Art & Design - Video Sales - Monochrome (5)
- Tgo19vmmqFizHuuCpNC7 — Art & Design - Webinar Registration - Monochrome (6)
- qa7Nv2M1pAmHrMGzRnwB — Art & Design - Webinar Sales - Monochrome (5)
- ibgVZnEpOXEqzpkz5C3H — Coaching - Appointment - Teal Tranquility (6)
- Gu3rR3bjL2xCfSnErhZg — Coaching - Lead Magnet - Teal Tranquility (6)
- QG85AhKyLYEpp9qIy0eM — Coaching - Limited Time Offer - Teal Tranquility (8)
- bNxDRttIWgwJ7uSXmUZs — Coaching - Quiz Funnel - Teal Tranquility (7)
- Gvd26BgrzP8henqKaOzX — Coaching - Video Sales Letter - Teal Tranquility (5)
- jfuPHCx695GqyCimhe9u — Coaching - Webinar Registration - Teal Tranquility (6)
- S5ztRUV5LLOaq65BQXaH — Coaching - Webinar Sales - Teal Tranquility (5)
- ysIwMOCrHH64dxco1oE3 — Consulting - Appointment - Sand Dunes (6)
- 3KcgUOBvMEraKXjO8EJ5 — Consulting - Lead Magnet - Sand Dunes (6)
- 5dzyYklX7eJRqzo1ff8K — Consulting - Limited Time Offer - Sand Dunes (8)
- eynMUoz2L0g1B5npCA9V — Consulting - Quiz Funnel - Sand Dunes (7)
- nV320apEIvknOeFQbFd9 — Consulting - Video Sales Letter - Sand Dunes (5)
- BQruPvLJu9wWMlDVqRL9 — Consulting - Webinar Registration - Sand Dunes (6)
- GzGdOLD7WkhSJLMQnrq0 — Consulting - Webinar Sales - Sand Dunes (5)
- YelxxhSMhGuFjfRMcqAg — Contact Us (1)
- dWkn3Czx73Sy0PVZoZNX — Course Creator - Appointment - Modern Disco (6)
- fLWo5RAy3Orum0euZz3M — Course Creator - Lead Magnet - Modern Disco (6)
- M8a3HPsYhCrvTs5dl94f — Course Creator - Limited Time Offer - Modern Disco (8)
- 56QjLJJnJSC0O1vi8Ipz — Course Creator - Quiz Funnel - Modern Disco (7)
- OtPaYNqLMDHarofAZcIH — Course Creator - Video Sales Letter - Modern Disco (5)
- WgADWz4yXYTjfjKU2C4q — Course Creator - Webinar Registration - Modern Disco (6)
- d6h8ibMg35zphj9nwq1N — Course Creator - Webinar Sales - Modern Disco (5)
- r794jQnadgSt08Rc9m4C — Doctors - Appointment - Blue Blaze (6)
- H2HakWIloQiyOyjlecpI — Doctors - Lead Magnet Funnel - Blue Blaze (6)
- GKdMyM58qawk9cQMAtCh — Doctors - Limited Time Offer - Blue Blaze (8)
- iMiY7qOVd5u9Nrbgs4X3 — Doctors - Quiz Funnel - Doctors - Blue Blaze (7)
- JsIygSIURRywMBjaQ6hf — Doctors - Video Sales Letter - Blue Blaze (5)
- hIwqObdA8xF3f1iHc9NR — Doctors - Webinar Registration - Doctors - Blue Blaze (6)
- 21mwRvoIcJIgSJ6FNStS — Doctors - Webinar Sales - Doctors - Blue Blaze (5)
- hR5k94kH2JqTCv3viTis — Error 404 (1)
- YqRtMeFfutnRRfpcpcql — Events - Appointment - Aqua Bliss (6)
- CjBoffxQWj3cE8awLX2z — Events - Lead Magnet - Aqua Bliss (6)
- 3hAxVpfpT92y8WsZiccv — Events - Limited Time Offer - Aqua Bliss (8)
- o4ROKQgETCKS9QUubuLj — Events - Quiz Funnel - Aqua Bliss (7)
- j304isHkPg37Xm2dPLIp — Events - Video Sales Letter - Aqua Bliss (5)
- cTU1MwXi0ah1uxkMMJ4O — Events - Webinar Registration - Aqua Bliss (6)
- cjxtFLbz4cxXZBbLyVqZ — Events - Webinar Sales - Aqua Bliss (5)
- o3Ag0SzqRvM4fMziMDLK — Financial - Appointment - Silver Lining (6)
- 9PpwbzR2z2Mt8HlgBLD1 — Financial - Lead Magnet - Silver Lining (6)
- d0fDLe5bK6gNDj78QMjc — Financial - Limited Time Offer - Silver Lining (8)
- 2lffBzs4DhGmYyITq2l4 — Financial - Quiz Funnel - Silver Lining (7)
- Xx5o6NyMlxtq1NMt3WUy — Financial - Video Sales Letter - Silver Lining (5)
- DU2uyFPRmpNBzHO13Ps3 — Financial - Webinar Registration - Silver Lining (6)
- sDPPXHaX1HZT3KvE1Jsj — Financial - Webinar Sales - Silver Lining (5)
- OkRhn9gWxXwkAYgBbEa4 — Fitness - Appointment - Purple Passion (6)
- 1YVfk3c7Z6VPYyp5RiX5 — Fitness - Lead Magnet - Purple Passion (6)
- EqrdGe8j4u7xCUp4ic2l — Fitness - Limited Time Offer - Purple Passion (8)
- rRKkj5JIkOvUoJ8zgBMc — Fitness - Quiz Funnel - Purple Passion (7)
- UKupi1715cmDG7cTFEnf — Fitness - Video Sales Letter - Purple Passion (5)
- MA0rw3OYE82aMjQyX36k — Fitness - Webinar Registration - Purple Passion (6)
- 7bFXo1OaSX5ZXd3IJFnW — Fitness - Webinar Sales - Purple Passion (5)
- 4nJbh6G5fsZqPzbT9F5S — Global Page Footer (1)
- KpFKjmJwq7IhaIeQOYNU — Influencer - Appointment - Cherry Bomb (6)
- rguNgXzLL8krlhI1RfLO — Influencer - Lead Magnet Funnel - Cherry Bomb (6)
- 628KjD2tuHIGw264mJUF — Influencer - Limited Time Offer - Cherry Bomb (8)
- NufGhLioAVEGNrwXjK5s — Influencer - Quiz Funnel - Cherry Bomb (7)
- 9RwjwoY90a5RntMPYdZ6 — Influencer - Video Sales Letter - Cherry Bomb (5)
- OKW0Tb3zpDF4sadPYuqL — Influencer - Webinar Registration - Cherry Bomb (6)
- GdobJTRVFYeNDGOIJJLR — Influencer - Webinar Sales - Cherry Bomb (5)
- Nt16pvPVM9lqXFu9PTBR — Lead Magnet - Aqua Bliss (6)
- eN3k3HJaKCuHGPRacnwk — Lead Magnet - Black & Yellow (6)
- HaJIe5fMzh3igUodhFoF — Lead Magnet - Keep it Green (6)
- zRUWijmETtCKX4k9TVCc — Lead Magnet - Modern Disco (6)
- NSYCyHprfMRPZzmOZJUg — Lead Magnet - Monochrome (6)
- jLh9X0NCLDbAf2pwlVKU — Lead Magnet - Oodles of Doodles (6)
- Xf7uoit8VFgBlk3TdGuj — Lead Magnet - Pistachio Paradise (6)
- SusyDHayBVpEM2eEPvOL — Lead Magnet - Purple Passion (6)
- IatgXzAu7iQBs160TSZi — Lead Magnet - Sand Dunes (6)
- 19NSfIkIcbBb2WOvb7ww — Lead Magnet - Silver Lining (6)
- fpgYJkHQE3s0fGBlkhjF — Lead Magnet - Sunset Sodalite (6)
- sICZa6ujxIqoA64Ws1Ku — Lead Magnet - Tart and Tangy (6)
- 69yAWZe65siF1xguRPMw — Lead Magnet - Teal Tranquility (6)
- xbEX5MsKBe7rsHxU9HBb — Lead Magnet Funnel - Blue Blaze  (6)
- DBXAeqAiojqjgmBPlo1a — Lead Magnet Funnel - Cherry Bomb (6)
- a39tDewjWOowyXJf9cPb — Lead Magnet Funnel - Cutting Edge (6)
- NWbuMtUnrNizAHhWzQix — Lead Magnet Funnel - Cyberspace (6)
- iTaHNxaLhE8le3cTybXE — Lead Magnet Funnel - Dollar Bill Dreams (6)
- aaoSI2F73kbFGU8YcbnA — Limited Time Offer - Aqua Bliss (8)
- NRugkLDEFaVIjPcQEyTa — Limited Time Offer - Black & Yellow (8)
- 2KNZqTjUsgRwgTiJPuxI — Limited Time Offer - Blue Blaze  (8)
- 238y2rZ8xZzDmLEVROl8 — Limited Time Offer - Cherry Bomb (8)
- HfbOT4mztNWEIfppzb7i — Limited Time Offer - Cutting Edge (8)
- 8GDutu6OeoXIi4ZZZTuO — Limited Time Offer - Cyberspace (8)
- CUkUpbm1qPhJj0skhqSI — Limited Time Offer - Dollar Bill Dreams (8)
- gHrbYYnoRQbo8m1QDeqe — Limited Time Offer - Keep it Green (8)
- JngYCT8zKG3uALmSgz6e — Limited Time Offer - Modern Disco (8)
- tXqti2lOj6gFDYXs2z8L — Limited Time Offer - Monochrome (8)
- KoNQLw1rUi0bMoBwEBOF — Limited Time Offer - Oodles of Doodles (8)
- Y57GMQ3R85pfnyORXls7 — Limited Time Offer - Pistachio Paradise (8)
- M6SNTNK8Yjpol2soibja — Limited Time Offer - Purple Passion (8)
- atKS4k5Ppdo3Jd4b8XYt — Limited Time Offer - Sand Dunes (8)
- 79oqrjrTCP1BnNFzQv5E — Limited Time Offer - Silver Lining (8)
- 054Ry6ZjZ5f41WZT8HOd — Limited Time Offer - Sunset Sodalite (8)
- AnHJpQeWFDkDXMD04flc — Limited Time Offer - Tart and Tangy (8)
- dOhk8tNqNgcvE8csvlvK — Limited Time Offer - Teal Tranquility (8)
- WgWCgeDOiOA1FLyfjzrU — MLM - Appointment - Dollar Bill Dreams (6)
- EPNYJnIVGNu90W6IrrnL — MLM - Lead Magnet Funnel - Dollar Bill Dreams (6)
- uVVr084gvHSCFbs96TEv — MLM - Limited Time Offer - Dollar Bill Dreams (8)
- 2jaxvwT4UHg7sY0c7xdh — MLM - Quiz Funnel - Dollar Bill Dreams (7)
- nUUkkyZAFEQwQL0yKWmR — MLM - Video Sales Letter - Dollar Bill Dreams (5)
- 5kC4HLxnvFVKJ8nFU3T5 — MLM - Webinar Registration  - Dollar Bill Dreams (6)
- 69iJuKvsIlbN6ya3IoU5 — MLM - Webinar Sales - Dollar Bill Dreams (5)
- WNMfXuxfPrupOpHL2AO5 — Meeting Scheduler (2)
- IUMm4Qa4jBO0ano3uJAA — Pets - Appointment - Oodles of Doodles (6)
- 9BVjEPLKmKUlPuzzdZNQ — Pets - Lead Magnet - Oodles of Doodles (6)
- CUCwwrP47mwpS3SGvsEb — Pets - Limited Time Offer - Oodles of Doodles (8)
- uUbLe1DCsK7Q6wblvLRK — Pets - Quiz Funnel - Oodles of Doodles (7)
- nAfAyFztp8CWFinZ5f8a — Pets - Video Sales Letter - Oodles of Doodles (5)
- jksnjOvUBoBfksI00efQ — Pets - Webinar Registration - Pets - Oodles of Doodles (6)
- Kd4v0JkgFn7kEahNtYqh — Pets - Webinar Sales - Oodles of Doodles (5)
- P1R0NgdwRzVUxPRKgvVm — Privacy Policy (1)
- wJtyvqQnXVN8HWpHdFlM — Quiz Funnel - Aqua Bliss (7)
- WltukgMOkAOH1SLuqXlt — Quiz Funnel - Black & Yellow (7)
- qs5LIHOnXoLkk6UmFf3h — Quiz Funnel - Blue Blaze (7)
- lKPPdfPMQha9GZK2OSqs — Quiz Funnel - Cherry Bomb (7)
- 4hMdkgRI15fHrFUR6dy5 — Quiz Funnel - Cutting Edge (7)
- Buu2M4w04PQ0Si683ND9 — Quiz Funnel - Cyberspace (7)
- gmgZw2o3oJlMNvU1Zigt — Quiz Funnel - Dollar Bill Dreams (7)
- TpE1abwAIMNYuEy5hTvL — Quiz Funnel - Keep it Green  (7)
- UKz2dMIxie6Mw3CfB5fu — Quiz Funnel - Modern Disco (7)
- 9x9Lhr4z73bhFaR9dLfy — Quiz Funnel - Monochrome (7)
- bMsWK2QpduFlGf5yldTR — Quiz Funnel - Oodles of Doodles (7)
- hy4z8gQ9HOx40GN29RMx — Quiz Funnel - Pistachio Paradise (7)
- nO7SnQFObBDgWF3ENM1d — Quiz Funnel - Purple Passion (7)
- 9OCX86cMUdgqTwbfoysA — Quiz Funnel - Sand Dunes (7)
- FVg0i7WXgQf2NcxEwnCo — Quiz Funnel - Silver Lining (7)
- gDZ5KDQO1C8d682fljvM — Quiz Funnel - Sunset Sodalite  (7)
- ZdYaOZQNE2PSoIJtH5Dd — Quiz Funnel - Tart and Tangy (7)
- BSUeB9rHKyA45w2EykQt — Quiz Funnel - Teal Tranquility (7)
- t9HJKP2hCcXAbrtxuJPX — Real Estate - Appointment - Keep it Green (6)
- bHLnen2MogtnO9vsOxLz — Real Estate - Lead Magnet - Keep it Green (6)
- vPUmGDXyxvxgaamsBN33 — Real Estate - Limited Time Offer - Keep it Green (8)
- X7nywZhIhBFCIaZtGHiK — Real Estate - Quiz Funnel - Keep it Green (7)
- YQQ7bu4hN1avDj2c3cnb — Real Estate - Video Sales Letter - Keep it Green (5)
- etBWnT70RPss8VU8nNRu — Real Estate - Webinar Registration - Keep it Green (6)
- w7XvW2H5VY0zOfLptKrz — Real Estate - Webinar Sales - Keep it Green (5)
- guwlXTkQQAIzbnBgtyP7 — Technology - Appointment - Cyberspace (6)
- rgE79dYFQpibOAM512FH — Technology - Lead Magnet Funnel - Cyberspace (6)
- zT6Bpq8AR1ROR9mX2s7u — Technology - Limited Time Offer - Cyberspace (8)
- mVcfBRYEAUDrMcoVzU9s — Technology - Quiz Funnel - Cyberspace (7)
- iolDmD1WOIQpOb3VyAN8 — Technology - Video Sales Letter - Cyberspace (5)
- 91fauzIhtBfrq13hkLO5 — Technology - Webinar Registration - Cyberspace (6)
- nOzW3lFPfM00qEJTb6Qf — Technology - Webinar Sales - Cyberspace (5)
- 3q6didOTABtsXxtwYiE5 — Terms Of Use (1)
- 5j6jyodIeyapgroypgLi — Unsubscribe Funnel (1)
- gpIjoZ2E0SbCHuaHH1q5 — Video Sales - Black & Yellow (5)
- PRogNmGwtilVcS5uIKya — Video Sales - Monochrome (5)
- U3l76VpLWrPTesQuNi8B — Video Sales Letter - Aqua Bliss (5)
- RZghwu5BEwuuyjZjzaRL — Video Sales Letter - Blue Blaze  (5)
- J7vFsGFGzxqEYYlYyeyg — Video Sales Letter - Cherry Bomb (5)
- Eq7lUic4BmdwQFizAkRp — Video Sales Letter - Cutting Edge (5)
- bDoH8cMntgL0kMqJ4OXh — Video Sales Letter - Cyberspace (5)
- 9yHI9giy9g2NXiKey1pL — Video Sales Letter - Dollar Bill Dreams (5)
- uiClvMgSit2391xOINpA — Video Sales Letter - Keep it Green (5)
- HRdFYFPd2JJPpnnkKe7c — Video Sales Letter - Modern Disco (5)
- NG2qMNBEaKv6SdkUuaZe — Video Sales Letter - Oodles of Doodles (5)
- 6DziVys6c3CEZYx6svmY — Video Sales Letter - Pistachio Paradise (5)
- 3fi3sxSyLHbZDocu6ea4 — Video Sales Letter - Purple Passion (5)
- 8MBFC7YiK1ZfvNl8ng99 — Video Sales Letter - Sand Dunes (5)
- 29AlSwPNwcAZNtSxyuok — Video Sales Letter - Silver Lining (5)
- PIyyJpWp4IN3HPKvpQ7h — Video Sales Letter - Sunset Sodalite (5)
- gBWk0rBtPFKPIwb0o7xY — Video Sales Letter - Tart and Tangy (5)
- Og8ZDqqRWJo4isTqXr6e — Video Sales Letter - Teal Tranquility (5)
- uTKF9zv8aIQgCbAaaVhY — Webinar Registration - Aqua Bliss (6)
- dCv8WRt6PRkE73UcwtdD — Webinar Registration - Black & Yellow (6)
- uy6re2Y0WNE18uUtE83o — Webinar Registration - Blue Blaze  (6)
- tV3PZIcmY1PpcEpMyPdC — Webinar Registration - Cherry Bomb (6)
- YbLYa1dsz6VkQOmVjSyB — Webinar Registration - Cutting Edge (6)
- MOyMWr5Ea5K2ZM1bybUm — Webinar Registration - Cyberspace  (6)
- Clj2mblWVafv9BgvcqkE — Webinar Registration - Dollar Bill Dreams (6)
- VI7gC13D2R8AcKSRAZF2 — Webinar Registration - Keep it Green (6)
- sTR162C84mNiEIjSBw0b — Webinar Registration - Modern Disco (6)
- 1pggzejS9fM3dyZc9nXr — Webinar Registration - Monochrome (6)
- GJMqDYlKzUWxRlxJrZHk — Webinar Registration - Oodles of Doodles (6)
- RCDotFgUN9qpsAHpUN6o — Webinar Registration - Pistachio Paradise (6)
- cbNcq2hijCJpNkeGXgg9 — Webinar Registration - Purple Passion (6)
- IfoAS7Lzh0StCrwL7030 — Webinar Registration - Sand Dunes (6)
- MXhf8PE9fXbPEPMbl2rF — Webinar Registration - Silver Lining (6)
- hGcfYmNEmb46TqnCPent — Webinar Registration - Sunset Sodalite (6)
- yD2D2vOcSawUnoMNyQEJ — Webinar Registration - Tart and Tangy (6)
- PeMDEdVm2ZfWkBe77YXW — Webinar Registration - Teal Tranquility (6)
- QrqtJLiCbLTobIy8xVyM — Webinar Sales - Aqua Bliss (5)
- YICrUjSqY9E2MqmFKI9G — Webinar Sales - Black & Yellow (5)
- Cfl919bmP94O6iFAytN7 — Webinar Sales - Blue Blaze (5)
- Q2az5gOjkqt4FG7m5aXg — Webinar Sales - Cherry Bomb (5)
- sFr169USZTn3REqW70Cz — Webinar Sales - Cutting Edge (5)
- 3ymRi8Q5BlmVst4V9PHq — Webinar Sales - Cyberspace (5)
- lMoM3pnknmayt6rTG02K — Webinar Sales - Dollar Bill Dreams (5)
- jeYj0WvLB1lM6bXukFCD — Webinar Sales - Keep it Green (5)
- 0XCL53Mpw6pqT0YfSAtu — Webinar Sales - Modern Disco (5)
- M0v8InJPbTtQXHFEgLhq — Webinar Sales - Monochrome (5)
- MhOy3wxyZoqxmDujNDHY — Webinar Sales - Oodles of Doodles (5)
- KyiDCOvhs3BNAhZW6Kqg — Webinar Sales - Pistachio Paradise (5)
- 6sPxnewFEIHEEB5SfnGc — Webinar Sales - Purple Passion (5)
- lHFjjL3XhRB0zKu71C7u — Webinar Sales - Sand Dunes (5)
- z0RD0trrRPkNpuTjmILe — Webinar Sales - Silver Lining (5)
- 4FX4g2NJXMZqIakBc8iL — Webinar Sales - Sunset Sodalite (5)
- pGMO4zzsXWheHGENd47p — Webinar Sales - Tart and Tangy (5)
- jwdHrwr03wtyAkcZrgQz — Webinar Sales - Teal Tranquility (5)
- PlTCUv9mlXc1nA5gHdfg — eCommerce - Appointment - Pistachio Paradise (6)
- FDKm9WCA3nALdU1ZFqvR — eCommerce - Lead Magnet - Pistachio Paradise (6)
- 9eTQoSYHGsDFVX8UtreM — eCommerce - Limited Time Offer - Pistachio Paradise (8)
- aVbM7opZnsbdX7pSaqkJ — eCommerce - Quiz Funnel - Pistachio Paradise (7)
- uMselWtx71M0jpt8Mg6y — eCommerce - Video Sales Letter - Pistachio Paradise (5)
- RBFCbMLoaTnZRf1sOJ6F — eCommerce - Webinar Registration - Pistachio Paradise (6)
- ceAOmRblpOVv8gIYzYII — eCommerce - Webinar Sales - Pistachio Paradise (5)

## Operation failures and limits

- `fetch-redirects-list` and `getPagesByFunnelId` with limit 50 or 100 returned 422 "limit must not be greater than 20". Retried with 20 and succeeded.
- `get-order-by-id` without `altType` returned 422. Retried with `altType=location` and succeeded.
- `get-workflow-definition` returned 403 `WORKFLOW_API_NOT_ENABLED_FOR_LOCATION` for 4 workflows, so no workflow triggers or product filters could be read.
- No operation lists domains or domain default-page bindings, and none returns funnel page HTML. Buy-button destinations for Starter Kit, Stick Packs and Google pages are therefore DOC-sourced.
- `get-forms` returned 50 of 82 forms (list not paged further; submissions query covers all forms).
- `search-contacts-advanced` returned empty `attributionSource` under projection.

Raw and condensed data in this folder: ghl_pages.json, nt_steps.txt, tracking_codes.txt, orders/ (funnel_tx_rows.json, order_items.json, subscriptions_summary.json, orders_90d_condensed.json, raw pages), leads/ (form_subs_rows.json, survey_subs_rows.json, contacts_60d_summary.json), workflows/ (workflows.tsv, workflows_flagged.json), products/ (ghl_products_condensed.json, raw), scripts/ (load_raw.py, classify.py, build_report.py).
