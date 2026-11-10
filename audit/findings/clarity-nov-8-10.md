# Microsoft Clarity, Nov 8–10, 2026

Pulled through the Clarity Data Export API (project v65ogd4cbw) on Nov 10. The API covers the last 3 days only and allows 10 requests a day; 7 were used.

## Totals

| Metric | Value |
|---|---|
| Real sessions | 169 (148 distinct users) |
| Bot sessions flagged by Clarity | 119 |
| Pages per session | 1.57 |
| Average scroll depth | 41.6% |
| Sessions with script errors | 21.9% (152 errors) |
| Sessions with dead clicks | 4.7% |
| Sessions with quick-backs | 4.1% |
| Sessions with rage clicks | 0% |
| Devices | Mobile 99, PC 64, tablet 6 |
| Countries | US 130, Malaysia 29, Philippines 6, other 4 |

All Google Ads clicks in the last 30 days were in the United States (checked in Google Ads), so the Malaysia sessions are not ad clicks. They are most likely unflagged bots or scrapers.

## By page (real sessions)

| Page | Sessions | Bots | Avg scroll | Script-error sessions |
|---|---|---|---|---|
| Homepage | 63 | 8 | 37% | 11 |
| Organic fermented cacao powder | 32 | 2 | 37% | 1 |
| Zeolite powder | 23 | 14 | 41% | 2 |
| Cacao landing page (Meta ads, try.zeotein.com) | 13 | 13 | 17% | 6 (66 errors) |
| Bone broth powder | 9 | 5 | 26% | 0 |
| Cart | 6 | 3 | 72% | 2 |
| Cacao Bulk Bag | 3 | 5 | 24% | 0 |
| Cacao 30 sticks | 3 | 5 | 48% | 2 |

GoHighLevel preview pages (link.automator.ai/preview/…) also appear with 14 sessions. They are internal and should be excluded in Clarity.

## By channel

| Channel | Sessions | Bots | Pages/visit | Avg scroll |
|---|---|---|---|---|
| Other (no referrer) | 84 | 100 | 1.65 | 39% |
| Paid search | 68 | 12 | 1.40 | 38% |
| Direct | 18 | 2 | 3.89 | 64% |
| Referral | 16 | 6 | 2.75 | 28% |
| Organic search | 7 | 4 | 2.14 | 35% |

## Script errors, traced

Captured in a real browser on Nov 10:

1. Every page: the header section runs an inline module `import { hydrate } from '@theme/section-hydration'`. The theme's layout has no import map, so the import fails ("Failed to resolve module specifier"). Fix: add an import map for the `@theme/*` modules the header uses, or remove that inline script from the header section.
2. Cacao landing page: "Identifier 'CartRemoveButton' has already been declared" and "'CartDrawer' has already been declared". The landing page layout loads the cart scripts twice. Fix: load cart.js and cart-drawer.js once in `layout/theme.cacao-lp.liquid`.

Neither blocked adding to cart or reaching checkout in testing.
