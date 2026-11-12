# Noindex for ads-only GoHighLevel pages (approved by Dana, 11 Nov ~8:52 PM CT)

**Status (12 Nov, overnight): ready to paste, not live yet.** The GoHighLevel API this session has can read
funnels and pages but cannot write tracking code or page settings (its only funnel writes are redirects), so the
tag has to be pasted in the GoHighLevel UI. It is one line per site/funnel, about 10 minutes in total.

The tag (also in `dist/ghl/noindex-meta.txt`):

```html
<meta name="robots" content="noindex, follow">
```

`follow` keeps links crawlable, and noindex does not block crawling, so Google Ads review can still read the pages.
Nothing goes in robots.txt (both are empty today and must stay that way). zeotein.com is not touched.

## Where to paste it (first line of each Head box, keep everything already there)

| Site / funnel in GoHighLevel | Live path | Where |
|---|---|---|
| **01 · Zeotein Google Site** (website `XybYbqU2CgF1TyKDc9GR`) | shop.zeotein.com, all 8 pages | Website settings → Tracking code → **Head** |
| **Zeotein Cacao Starter Kit - GOOGLE ADS** (`hP8rlVYceQty6fjPFgXe`) | marketing.zeotein.com/starter-kit-google | Funnel settings → Tracking code → **Head** |
| **Zeotein Cacao Starter Kit** (`LhKFhCyhJiY1nKWzbwox`) | /starter-kit-page | Funnel settings → Tracking code → Head |
| **Zeotein Cacao Landing Page** (`To0JJYumPq6qcm2fTKY5`) | /zeotein-cacao | Funnel settings → Tracking code → Head |
| **Zeotein Cacao Landing Page – New Version** (`1LzRjMFaXI24eo2rKJWX`) | /landing-page-cacao | Funnel settings → Tracking code → Head |
| **Zeotein Cacao Offer Funnel** (`p3GJqD61mz9CGcLMDEsC`) | /cacao-sales-page | Funnel settings → Tracking code → Head |
| **ZEOTEIN — Cacao 30-Day Stick Packs Starter Kit** (`wcaIgZz5yfm2W6Jo9J8q`) | /cacao-stick-packs-starter-kit (also live on marketing, 200) | Funnel settings → Tracking code → Head |
| **BF 2026 Google Store-Wide (DRAFT)** (`2u6D8ImYbnwchnJACOei`) | not published, no domain | Settings only; saving settings does not publish |

For the Google Site, if you re-paste the whole Head snippet instead, `dist/ghl/00-website-head.html` now starts with this tag.

**/starter-kit** answers 200 with the same page title as the Google lander, but it is not a step in any of the
300 funnels or 42 websites in the account, so GoHighLevel is probably falling back to one of the starter-kit funnels
above. Re-check it after the paste; if it still shows `index`, search GoHighLevel for "starter-kit".

**Quiz at marketing.zeotein.com/** ("Find Your Zeotein Formula", served by the funnel whose first step is
`/q1-9460`: *Zeotein Quiz Funnel (Cacao or Vegan) New Version*, `aJ57oms4DRVjZHAiLqCt`). Nothing on zeotein.com links to
it (home, contact, all products, a product page and the blog checked), and noindex does not affect ad, social or
email links. Recommendation: noindex it too, unless you know it brings in Google organic traffic; this session cannot
see Search Console.

**GoHighLevel's own `index, follow` tag** appears on /starter-kit-google, /starter-kit-page and /starter-kit. With the
noindex line added, Google applies the more restrictive rule, so those pages drop out of results. If the page's SEO
settings in the builder show a search-visibility or indexing switch, turn that off as well so no `index` tag is left.

## Check it

```bash
python3 google-site/qa/verify_noindex.py
```

It checks all 16 pages plus the quiz, confirms zeotein.com is still indexable and that robots.txt blocks nothing,
and ends with `RESULT: PASS`. The baseline taken before the change is in `noindex-check-baseline.txt` next to this file.
