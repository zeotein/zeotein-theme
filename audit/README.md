# Zeotein store audit, November 2026

Full visual report: https://claude.ai/artifact/CKDzjWHVSwHaAK1Tv6Ar7K (private). The same page is in `report/zeotein-store-audit.html`.

## What's here

| Path | Contents |
|---|---|
| `report/zeotein-store-audit.html` | The finished report with before/after page mockups (self-contained, open in a browser) |
| `report/template.html`, `report/build.py`, `report/img/` | Source for the report; `python3 report/build.py` rebuilds it |
| `CHANGES-2026-11-10.md` | Every change made to the store on Nov 10, with IDs and how to undo it |
| `findings/ghl-funnel-audit.md` | All 296 GoHighLevel funnels classified (in use, retired but live, dormant, template) with evidence |
| `findings/ads-and-analytics.md` | Google Ads, Meta and GA4 pull (90 and 30 days) with the diagnosis |
| `findings/pricing-research.md` | Competitor price-per-serving research with source links |
| `findings/shopify-catalog-before-cleanup.tsv` | The 63-product catalog as it stood before cleanup |
| `findings/ghl-live-funnel-links.json` | Every Shopify link on every live funnel page |
| `findings/url-status.txt` | Status of key store URLs |
| `findings/compliance-prescan/` | Rule-based compliance scan of each crawled page |
| `scripts/` | Crawl, screenshot and check scripts (Playwright) |

## Top findings

1. Ads cost about $176 per new customer over 90 days ($13,723 spend, 78 new customers), against a $60 target and $90 red line.
2. Add-to-cart rate fell from 13.2% of sessions (March) to 4.7% (November). On phones the Rewards button covers the price or Add to Cart on product pages.
3. Free shipping starts at $150, above every core product, so store shoppers pay $8–$20 at checkout. Subscription renewals are charged shipping too.
4. Google non-brand search sends 97% of clicks to marketing.zeotein.com: 148 clicks, 0 add-to-carts, 0 sales.
5. Cacao is priced competitively per serving; Vegan, the $150 shipping line, the 9% bag subscription discount and the zeolite 1 lb price are the weak spots.
6. 8 retired GoHighLevel funnels are still public; 7 dead unlisted products were archived on Nov 10.

No customer names, emails or phone numbers are stored in this folder.
