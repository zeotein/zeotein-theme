# Zeotein — Paid Media & Analytics Audit (Google Ads, GA4, Meta, GMC)

**Question from the owner:** "Why aren't Google searches getting me sales, and why aren't people buying?"

- Pulled 2026-11-10 via Supermetrics. **Read-only: nothing was changed in any account.**
- **Date windows (verified):** last 90 days = **2026-08-12 → 2026-11-09**; last 30 days = **2026-10-11 → 2026-11-09**. Monthly trends run 2026-05-01 → 2026-11-09 (November = Nov 1–9 only).
- **Sources and accounts:** Google Ads `9576834317` (USD); GA4 property `535557069` (the second property, `535580236`, returned **0 rows** for 90 days); Meta `act_2265230500634366` (the other two connected Meta accounts had no spend); GMC `5777774223` is **not licensed** (see §5).
- **Attribution caveats:**
  - Google "Conversions" = the *Google Shopping App Purchase* action only.
  - Meta purchases use the pixel with the account's default attribution (7-day click / 1-day view).
  - GA4 numbers are session-scoped last click.
  - Google and Meta purchases **overlap**, so they cannot be summed.
  - No Shopify order data was pulled. GA4 "first-time purchasers" stands in for "new customers".

---

## 0. Executive summary (numbers)

| | 90d | 30d |
|---|---|---|
| Google Ads spend / purchases / CPA / ROAS | $4,250.02 / 37 / $114.87 / 0.90 | $1,405.10 / 5 / $281.02 / 0.29 |
| Meta spend / pixel purchases / CPA / ROAS | $9,473.29 / 46 / $205.94 / 0.62 | $2,337.75 / 9 / $259.75 / 0.57 |
| Total ad spend | $13,723.31 | $3,742.85 |
| GA4 purchases / revenue | 135 / $18,384.27 | 31 / $4,047.19 |
| GA4 first-time purchasers | 125 | 29 |
| **Blended ad spend per new customer** (target ≤ $60, red > $90) | **$109.79** | **$129.06** |
| MER (GA4 revenue ÷ ad spend) | 1.34 | 1.08 |
| Store conversion rate (GA4 purchases ÷ sessions; target 2%+) | 2.52% | **1.36%** (Nov 1–9: 0.80%) |

**Headline:** Sales fell from 69 purchases in September to 31 in October, then 7 in Nov 1–9. All three trackers agree on the drop (GA4 69→31, Google Ads 24→9, Meta pixel 28→9), so this is a real sales decline and not a tracking break.

Over the same period, blended cost per new customer rose from $81–$93 (Jun–Sep) to $154 (Oct) and $162 (Nov 1–9).

---

## 1. Google Ads

### 1.1 Campaign performance — last 90 days

| Campaign | Status | Type | Bidding | Cost | Impr | Clicks | CTR | Avg CPC (target ≤ $1.20) | Purchases | Conv value | Cost / purchase | ROAS | Search IS | Lost IS (budget) | Lost IS (rank) | "All conv." |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Z_Pamx_All_Prodcuts_Feed_Only | paused | PMax | Max Conversions | $1,377.42 | 79,287 | 594 | 0.75% | $2.32 | 15 | $1,246.73 | $91.83 | 0.91 | 13.4% | 16.9% | 69.7% | 1,636.63 |
| Z_S_Brand_Core | enabled | Search | Max Conv. (tCPA $40) | $927.67 | 3,978 | 196 | 4.93% | **$4.73** | 13 | $1,801.58 | **$71.36** | **1.94** | 48.7% | 27.8% | 23.5% | 893.5 |
| Z_Pmax_RET | paused | PMax | Max Conversions | $775.94 | 67,379 | 463 | 0.69% | $1.68 | 6 | $603.10 | $129.32 | 0.78 | 17.3% | 13.1% | 69.6% | 843.89 |
| Z_Shopping_SI | enabled | Shopping | Max Conv. Value | $488.36 | 72,294 | 674 | 0.93% | $0.72 | 3 | $171.48 | $162.79 | 0.35 | 27.9% | 14.9% | 57.3% | 1,556.64 |
| Z_Shopping_Blends | paused (Nov 5) | Shopping | Max clicks, $2 cap | $313.08 | 21,532 | 147 | 0.68% | $2.13 | **0** | $0 | — | 0 | 17.8% | 13.2% | 69.0% | 326.34 |
| Z_Pamx_All_Prodcuts_Feed_Single_I | paused | PMax | Max Conversions | $199.13 | 15,165 | 103 | 0.68% | $1.93 | **0** | $0 | — | 0 | 24.2% | 3.0% | 72.8% | 211 |
| Search_NB_Sales | enabled | Search | Max clicks, $2 cap | $168.42 | 2,391 | 148 | 6.19% | $1.14 | **0** | $0 | — | 0 | **10.0%** | 30.3% | **67.9%** | 23 |
| **Total** | | | | **$4,250.02** | 262,026 | 2,325 | 0.89% | $1.83 | **37** | $3,822.89 | **$114.87** | 0.90 | | | | |

### 1.2 Campaign performance — last 30 days

| Campaign | Cost | Impr | Clicks | CTR | Avg CPC | Purchases | Conv value | Cost / purchase | ROAS | Search IS | Lost IS (budget) | Lost IS (rank) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Z_Shopping_SI | $488.36 | 72,294 | 674 | 0.93% | $0.72 | 3 | $171.48 | $162.79 | 0.35 | 27.9% | 14.9% | 57.3% |
| Z_Shopping_Blends | $313.08 | 21,532 | 147 | 0.68% | $2.13 | 0 | $0 | — | 0 | 17.8% | 13.2% | 69.0% |
| Z_Pamx_All_Prodcuts_Feed_Single_I | $199.13 | 15,165 | 103 | 0.68% | $1.93 | 0 | $0 | — | 0 | 24.2% | 3.0% | 72.8% |
| Search_NB_Sales | $168.42 | 2,391 | 148 | 6.19% | $1.14 | 0 | $0 | — | 0 | 10.0% | 30.3% | 67.9% |
| Z_S_Brand_Core | $126.09 | **100** | 31 | 31.0% | $4.07 | 2 | $231.96 | **$63.05** | 1.84 | **83.8%** | 4.4% | 11.8% |
| Z_Pamx_All_Prodcuts_Feed_Only | $110.01 | 8,437 | 29 | 0.34% | $3.79 | 0 | $0 | — | 0 | 22.6% | 0.8% | 76.7% |
| **Total** | **$1,405.10** | 119,919 | 1,132 | 0.94% | $1.24 | **5** | $403.44 | **$281.02** | 0.29 | | | |

Z_Pmax_RET had no delivery in the last 30 days.

### 1.3 Campaign settings snapshot (read via API)

| Campaign | ID | Status | Daily budget | Bidding | Primary status / reasons | Start |
|---|---|---|---|---|---|---|
| Z_Shopping_SI | 24379489176 | ENABLED | $25 | Max conversion value | ELIGIBLE | 2026-10-22 |
| Z_Shopping_Blends | 24379462296 | PAUSED | $25 | Target spend (max clicks), $2 CPC ceiling | PAUSED | 2026-10-22 |
| Z_Pamx_All_Prodcuts_Feed_Single_I | 24348610729 | PAUSED | $10 | Max conversions | PAUSED + **HAS_ASSET_GROUPS_LIMITED_BY_POLICY** | 2026-10-11 |
| Z_Pamx_All_Prodcuts_Feed_Only | 24114185888 | PAUSED | $10 | Max conversions (final URL expansion ON) | PAUSED + **HAS_ASSET_GROUPS_LIMITED_BY_POLICY** | 2026-08-07 |
| Search_NB_Sales | 24056015881 | ENABLED | $10 | Target spend, $2 CPC ceiling | LIMITED (reason UNKNOWN) | 2026-07-20 |
| Z_S_Brand_Core | 23873663227 | ENABLED | $10 | Max conversions, tCPA $40 | LIMITED: **HAS_ADS_LIMITED_BY_POLICY** | 2026-05-21 |
| Z_Pmax_RET | 23813490889 | PAUSED | $25 | Max conversions | PAUSED | 2026-04-30 |
| Shopping_NB_Cacao / Shopping_Branded_Cacao | 24063262798 / 24058527545 | PAUSED | $10 each | — | PAUSED | 2026-07-22 |

- **Also present:** `ZEO_DG_CleanProtocol_1026` (Demand Gen). Its ad groups are `AG1_PastBuyers_Lookalike` and `AG2_Zeolite_ProtocolReaders`, its ads are "Approved (limited)", it has 0 impressions, and its final URL is marketing.zeotein.com/starter-kit-page.
- **Not visible:** `Z_Pmax_Blends_Only` did not appear in the campaign list or in any performance data. This is consistent with it being unpublished.
- **Location targeting:** every campaign uses "Presence" targeting, and 96–100% of spend is US (Brand $37.98 and RET $21.13 went to Canada).

### 1.4 Monthly trend (account)

| Month | Google cost | Clicks | Purchases | Conv value | Cost / purchase | Brand campaign cost | Brand campaign impressions |
|---|---|---|---|---|---|---|---|
| 2026-05 | $969.95 | 4,487 | 7 | $921.92 | $138.56 | $229.14 | 17,669 |
| 2026-06 | $1,356.65 | 756 | 9 | $767.60 | $150.74 | $759.33 | 32,266 |
| 2026-07 | $1,824.86 | 694 | 10 | $1,103.04 | $182.49 | $740.85 | 11,093 |
| 2026-08 | $1,032.27 | 443 | 9 | $1,010.08 | $114.70 | $396.54 | 3,395 |
| 2026-09 | $1,719.12 | 798 | 24 | $2,596.78 | $71.63 | $523.00 | 529 |
| 2026-10 | $1,506.96 | 639 | 9 | $803.80 | $167.44 | $117.27 | 87 |
| 2026-11 (1–9) | $469.66 | 647 | 1 | $74.98 | $469.66 | $34.23 | 40 |

May included "Zeotein Test": $249.84, 3,553 clicks at $0.07 CPC, 2 conversions. That is junk-click traffic, and it accounts for most of May's clicks.

**Per-campaign monthly detail** (cost / clicks / purchases):

| Campaign | May | Jun | Jul | Aug | Sep | Oct | Nov 1–9 |
|---|---|---|---|---|---|---|---|
| Z_S_Brand_Core | $229.14 / 172 / 0 | $759.33 / 472 / 2 | $740.85 / 139 / 5 | $396.54 / 111 / 5 | $523.00 / 77 / 9 | $117.27 / 21 / 1 | $34.23 / 15 / 1 |
| Z_Pmax_RET | $490.98 / 762 / 5 | $597.32 / 284 / 7 | $787.89 / 371 / 5 | $92.38 / 32 / 3 | $575.37 / 379 / 5 | $200.57 / 84 / 1 | — |
| Z_Pamx_All_Prodcuts_Feed_Only | — | — | — | $418.15 / 207 / 1 | $620.76 / 342 / 10 | $455.56 / 94 / 4 | — |
| Z_Pamx_All_Prodcuts_Feed_Single_I | — | — | — | — | — | $199.13 / 103 / 0 | — |
| Z_Shopping_SI | — | — | — | — | — | $249.73 / 210 / 3 | **$238.63 / 464 / 0** |
| Z_Shopping_Blends | — | — | — | — | — | $214.70 / 65 / 0 | $98.38 / 82 / 0 |
| Search_NB_Sales | — | — | $120.02 / 46 / 0 | $43.77 / 10 / 0 | — | $70.00 / 62 / 0 | $98.42 / 86 / 0 |
| Shopping_Branded_Cacao | — | — | $62.70 / 109 / 0 | $29.55 / 64 / 0 | — | — | — |
| Shopping_NB_Cacao | — | — | $113.40 / 29 / 0 | $51.89 / 19 / 0 | — | — | — |
| Zeotein Test | $249.84 / 3,553 / 2 | — | — | — | — | — | — |

**Search_NB_Sales has spent $332.21 since launch (Jul–Nov) with 0 purchases.**

The October 22 restructure replaced PMax (the paused Feed_Only and RET campaigns) with Standard Shopping SI and Blends. Since then, Shopping has spent $801.44 for 3 purchases. Over the 90-day window, the PMax campaigns produced 21 purchases at $91.83–$129.32 each.

### 1.5 Conversion actions (tracking check)

- All conversion actions come from the Shopify **Google & YouTube ("Google Shopping App")** integration:
  - Purchase (category PURCHASE): the only action counted in "Conversions", so it is effectively the primary action.
  - Begin Checkout, Add To Cart, Page View, View Item, Search, Add Payment Info: counted only in "All conversions".
  - YouTube subscriptions and follow-on views are also enabled.
- **"All conversions" are dominated by page-view actions.** For example, Z_Shopping_SI shows 813 Page View + 714 View Item "conversions" against 3 purchases. Read the Conversions (Purchase) column only.
- Purchase signal is thin: 3 purchases in Z_Shopping_SI under *Maximize Conversion Value*, which is not enough data for value-based bidding.

**Secondary-funnel evidence by campaign, 90d** (events counted by the Shopping App tag):

| Campaign | Clicks | Page View | View Item | Add To Cart | Begin Checkout | Add Payment Info | Purchase |
|---|---|---|---|---|---|---|---|
| Z_S_Brand_Core | 196 | 600.5 | 123 | **94** | **51** | 10 | **13** |
| Z_Pamx_All_Prodcuts_Feed_Only | 594 | 919.26 | 638.37 | 40 | 17 | 5 | 15 |
| Z_Pmax_RET | 463 | 559.25 | 251.63 | 21 | 5 | 1 | 6 |
| Z_Shopping_SI | 674 | 813.32 | 714.33 | 14 | 8 | 2 | 3 |
| Z_Shopping_Blends | 147 | 174.68 | 149.67 | 2 | 0 | 0 | 0 |
| Z_Pamx_All_Prodcuts_Feed_Single_I | 103 | 109 | 101 | 1 | 0 | 0 | 0 |
| **Search_NB_Sales** | **148** | **14** | **9** | **0** | **0** | **0** | **0** |

Of 148 non-brand clicks, only about 14 produced a tracked zeotein.com page view, and none added to cart. The cause is that the ad sends people to marketing.zeotein.com (see §1.10).

### 1.6 Top 40 search terms by cost — last 90 days

Google hides low-volume terms. The search-term report shows $1,171.38 of the $1,897.53 spent by the four Search/Shopping campaigns (62%). PMax search terms are not included.

| # | Search term | Campaign | Cost | Impr | Clicks | CPC | Purchases | Value |
|---|---|---|---|---|---|---|---|---|
| 1 | zeotein | Z_S_Brand_Core | $435.34 | 221 | 90 | $4.84 | 10 | $1,566.61 |
| 2 | organized powder supplement | Z_Shopping_Blends | $35.15 | 3 | 1 | $35.15 | 0 | $0 |
| 3 | vegan clear protein | Z_Shopping_Blends | $30.23 | 5 | 1 | $30.23 | 0 | $0 |
| 4 | healthycell | Z_S_Brand_Core (broad) | $29.57 | 2 | 1 | $29.57 | 0 | $0 |
| 5 | pure astaxanthin | Z_S_Brand_Core (broad) | $26.88 | 2 | 1 | $26.88 | 0 | $0 |
| 6 | zein | Z_S_Brand_Core (broad) | $20.37 | 2 | 1 | $20.37 | 0 | $0 |
| 7 | zeotein com | Z_S_Brand_Core | $17.30 | 11 | 4 | $4.33 | 1 | $102.99 |
| 8 | nutri 11 protein | Z_Shopping_Blends | $16.19 | 6 | 1 | $16.19 | 0 | $0 |
| 9 | zeolit detox | Z_Shopping_SI | $13.46 | 7 | 1 | $13.46 | 0 | $0 |
| 10 | organic ground pumpkin seeds | Z_Shopping_SI | $13.11 | 8 | 1 | $13.11 | 1 | $59.99 |
| 11 | cleanest casein protein powder | Z_S_Brand_Core (broad) | $12.13 | 4 | 1 | $12.13 | 0 | $0 |
| 12 | zeolite | Z_Shopping_SI | $11.48 | 4,061 | 9 | $1.28 | 0 | $0 |
| 13 | yonder collagen | Z_Shopping_SI | $11.45 | 8 | 1 | $11.45 | 0 | $0 |
| 14 | cacao powder | Z_Shopping_SI | $11.19 | 2,094 | 19 | $0.59 | 0 | $0 |
| 15 | zeolite powder | Z_Shopping_SI | $10.86 | 380 | 10 | $1.09 | 0 | $0 |
| 16 | natural blood sugar control | Z_S_Brand_Core (broad) | $10.70 | 1 | 1 | $10.70 | 0 | $0 |
| 17 | bicarb | Z_S_Brand_Core (broad) | $9.22 | 4 | 1 | $9.22 | 0 | $0 |
| 18 | zeolite clinoptilolite food grade | Z_Shopping_SI | $9.22 | 1 | 1 | $9.22 | 0 | $0 |
| 19 | complement protein powder | Z_S_Brand_Core (broad) | $9.17 | 2 | 1 | $9.17 | 0 | $0 |
| 20 | bioprotein | Z_S_Brand_Core (broad) | $9.03 | 1 | 1 | $9.03 | 0 | $0 |
| 21 | bone broth protein | Z_Shopping_SI | $8.64 | 436 | 3 | $2.88 | 0 | $0 |
| 22 | protein powder | Search_NB_Sales | $8.15 | 86 | 7 | $1.16 | 0 | $0 |
| 23 | protein powder with superfoods | Z_S_Brand_Core (broad) | $7.77 | 2 | 1 | $7.77 | 0 | $0 |
| 24 | healthy food australia | Z_Shopping_Blends | $7.18 | 5 | 4 | $1.79 | 0 | $0 |
| 25 | epatrol | Z_Shopping_Blends | $6.60 | 11 | 1 | $6.60 | 0 | $0 |
| 26 | protein shake without artificial sweeteners | Z_S_Brand_Core (broad) | $6.47 | 2 | 1 | $6.47 | 0 | $0 |
| 27 | high protein pumpkin seeds | Z_Shopping_SI | $5.63 | 3 | 1 | $5.63 | 0 | $0 |
| 28 | hemp protein powder | Z_Shopping_SI | $5.53 | 503 | 7 | $0.79 | 0 | $0 |
| 29 | grass fed beef bone broth powder | Z_Shopping_SI | $4.84 | 22 | 2 | $2.42 | 0 | $0 |
| 30 | cacao puro | Z_Shopping_SI | $4.81 | 276 | 12 | $0.40 | 0 | $0 |
| 31 | organic collagen peptides powder | Z_Shopping_SI | $4.70 | 8 | 1 | $4.70 | 0 | $0 |
| 32 | cacao | Z_Shopping_Blends | $4.67 | 312 | 3 | $1.56 | 0 | $0 |
| 33 | non dairy protein powder | Z_S_Brand_Core (broad) | $4.38 | 1 | 1 | $4.38 | 0 | $0 |
| 34 | cacao drink | Z_Shopping_SI | $4.32 | 38 | 2 | $2.16 | 0 | $0 |
| 35 | irish sea moss powder | Z_Shopping_SI | $4.17 | 22 | 3 | $1.39 | 0 | $0 |
| 36 | strongher supplements | Z_Shopping_Blends | $4.04 | 22 | 5 | $0.81 | 0 | $0 |
| 37 | bulk sea moss powder | Z_Shopping_SI | $3.96 | 5 | 1 | $3.96 | 0 | $0 |
| 38 | raw cocoa powder | Z_Shopping_SI | $3.96 | 181 | 1 | $3.96 | 0 | $0 |
| 39 | mct oil | Z_Shopping_SI | $3.71 | 894 | 5 | $0.74 | 0 | $0 |
| 40 | cacao | Z_Shopping_SI | $3.67 | 1,990 | 9 | $0.41 | 0 | $0 |

**Search-term intent mix** (visible terms only; categories were assigned by keyword heuristics, so treat them as approximate):

| Query type | Cost | Clicks | Purchases |
|---|---|---|---|
| Brand ("zeotein…") | $452.64 | 94 | 11 |
| Generic commercial (e.g., "protein powder", "cacao powder", "zeolite") | $442.12 | 307 | 2 |
| Competitor / other brand (huel, truvani, orgain, kachava, healthycell, yonder…) | $155.51 | 69 | 0 |
| Non-English query (Spanish, Korean, Arabic, Russian, Vietnamese…) | $79.74 | 144 | 0 |
| Informational / research ("what is…", "how to…", "benefits", "vs") | $41.37 | 42 | 0 |

**Brand campaign leakage:** the broad-match keyword `zeotein` matched non-brand queries. Those queries cost $152.97 for 15 clicks ($10.20 per click) and produced 0 purchases.

Search_NB_Sales visible terms were generic ($50.03), competitor ($17.32) and informational ($17.28), with 0 purchases. Examples: "protein powder", "best protein supplement", "what is protein powder made of", "huel black edition", "truvani protein powder", "ensure protein drink".

### 1.7 Keywords and Quality Score (90d)

| Campaign | Keyword (match) | QS | Ad relevance / creative | Landing page exp. | Impr | Clicks | Cost | Purchases |
|---|---|---|---|---|---|---|---|---|
| Z_S_Brand_Core | zeotein (**Broad**) | — | — | — | 866 | 66 | **$468.54** | **1** |
| Z_S_Brand_Core | zeotein (Phrase) | **10** | Above avg | Above avg | 212 | 73 | $397.15 | **11** |
| Z_S_Brand_Core | zeotein reviews (Phrase) | 8 | Above avg | Above avg | 21 | 3 | $17.04 | 0 |
| Z_S_Brand_Core | zeotein com (Broad) | — | — | — | 4 | 2 | $14.10 | 1 |
| Search_NB_Sales | protein shake powder (Broad) | 3 | Below avg | **Below avg** | 397 | 15 | $14.86 | 0 |
| Search_NB_Sales | high protein powder (Broad) | — | — | — | 386 | 26 | $27.45 | 0 |
| Search_NB_Sales | nutrition protein powder (Phrase) | — | — | — | 256 | 19 | $21.45 | 0 |
| Search_NB_Sales | bone broth protein powder (Broad) | **1** | Below avg | **Below avg** | 215 | 7 | $7.87 | 0 |
| Search_NB_Sales | best protein supplement (Phrase / Broad) | **1** / **1** | Below avg | **Below avg** | 187 / 149 | 14 / 12 | $16.54 / $14.19 | 0 |
| Search_NB_Sales | protein powder without artificial sweeteners (Broad) | 3 | Below avg | **Below avg** | 168 | 12 | $12.62 | 0 |
| Search_NB_Sales | best clean protein powder (Broad) | 3 | Below avg | **Below avg** | 86 | 5 | $5.36 | 0 |
| Search_NB_Sales | clean protein powder (Phrase) | 4 | Average | **Below avg** | 47 | 5 | $6.71 | 0 |

**Every non-brand keyword that has a Quality Score (1–4) shows a "Below average" landing page experience.**

### 1.8 Shopping / feed performance by product — 90d (Standard Shopping + PMax, all campaigns)

**Summary by product group:**

| Group | Impr | Share of impr | Clicks | CTR | Cost | Purchases | Value | Cost / purchase | ROAS |
|---|---|---|---|---|---|---|---|---|---|
| Single-ingredient powders | 267,670 | **79.0%** | 1,223 | 0.46% | $1,535.96 | 10.9 | $772.44 | $140.91 | 0.50 |
| **Zeotein blends (core Cacao / Vegan)** | 48,776 | **14.4%** | 234 | 0.48% | $722.86 | **3.0** | $318.97 | **$240.95** | 0.44 |
| Accessories (shaker, Save A Scoop) | 19,193 | 5.7% | 14 | 0.07% | $19.18 | 0.1 | $11.78 | — | — |
| (no item) | 3,063 | 0.9% | 6 | 0.20% | $6.40 | 0 | $0 | — | — |
| **Total** | 338,702 | 100% | 1,477 | 0.44% | $2,284.40 | 14.0 | $1,103.19 | $163.17 | 0.48 |

**All items, 90d** (all campaigns combined):

| Product title | Item ID (one variant shown where several exist) | Impr | Clicks | CTR | Cost | Purchases | Value |
|---|---|---|---|---|---|---|---|
| Zeolite Powder (Clinoptilolite) — 1/2 lb | shopify_zz_9264679256277_53176075583701 | 40,969 | 275 | 0.67% | $353.90 | 7.1 | $503.23 |
| Organic Fermented Cacao Powder — 1/2 lb | shopify_zz_9266912198869_53196659327189 | 32,463 | 185 | 0.57% | $218.62 | 1.1 | $43.77 |
| **Zeotein Cacao Bulk Powder — 30 Servings + Save A Scoop** | shopify_zz_9342459674837_53720454004949 | 22,842 | 94 | 0.41% | **$277.49** | **0** | $0 |
| Organic Fermented Cacao Powder — 1 lb | shopify_zz_9266912198869_53196659359957 | 21,327 | 147 | 0.69% | $204.10 | 0 | $0 |
| Beef Bone Broth Protein Powder — 1/2 lb | shopify_zz_9262718910677_53107187056853 | 19,903 | 32 | 0.16% | $46.80 | 0.1 | $11.78 |
| Organic Sea Moss Powder — 1/4 lb | shopify_zz_9266819203285_53196544966869 | 19,757 | 38 | 0.19% | $55.96 | 0.1 | $11.78 |
| Organic Hemp Protein Powder — 1/2 lb | shopify_zz_9266916655317_53196989235413 | 15,705 | 25 | 0.16% | $54.31 | 0.1 | $11.78 |
| Organic Pumpkin Seed Protein — 1 lb | shopify_zz_9269244231893_53207147741397 | 14,934 | 50 | 0.33% | $59.71 | 0.1 | $11.78 |
| Zeotein Shaker — Black | shopify_zz_9340801515733_53710123892949 | 14,198 | 13 | 0.09% | $18.16 | 0.1 | $11.78 |
| Organic Lion's Mane — 1 lb | shopify_zz_9266900566229_53196571902165 | 13,594 | 6 | 0.04% | $19.88 | 0.1 | $11.78 |
| Organic Fermented Cacao Powder — 2 lb | shopify_zz_9266912198869_53196659392725 | 10,895 | 119 | 1.09% | $82.59 | 0 | $0 |
| Organic MCT Oil Powder — 1/2 lb | shopify_zz_9264871375061_53176161272021 | 9,718 | 16 | 0.16% | $14.71 | 0 | $0 |
| Organic Collagen Peptides — 2 lb | shopify_zz_9264652910805_53174839247061 | 9,280 | 40 | 0.43% | $20.76 | 0 | $0 |
| **Zeotein Vegan — 7-Day Starter** | shopify_zz_9254295306453_53059759112405 | 9,015 | 40 | 0.44% | $129.81 | 1 | $77.99 |
| Organic Pumpkin Seed Protein — 1/2 lb | shopify_zz_9269244231893_53207147708629 | 8,090 | 48 | 0.59% | $32.66 | 0 | $0 |
| Organic Collagen Peptides — 1/2 lb | shopify_zz_9264652910805_53174839181525 | 7,804 | 20 | 0.26% | $22.55 | 0 | $0 |
| **Zeotein Cacao — 7-Day Starter** | shopify_zz_9174425993429_52342958031061 | 6,699 | 24 | 0.36% | $151.43 | 1 | $112.99 |
| Organic MCT Oil Powder — 1 lb | shopify_zz_9264871375061_53176161304789 | 6,585 | 8 | 0.12% | $33.59 | 0 | $0 |
| Beef Bone Broth Protein Powder — 1 lb | shopify_zz_9262718910677_53107187089621 | 5,505 | 15 | 0.27% | $34.22 | 0 | $0 |
| Zeolite Powder — 1 lb | shopify_zz_9264679256277_53176075616469 | 5,196 | 50 | 0.96% | $66.46 | 1 | $82.99 |
| **Zeotein Vegan — 30-Day Stick Packs** | shopify_zz_9254632653013_53061513511125 | 4,684 | 36 | 0.77% | $108.92 | 1 | $127.99 |
| Save A Scoop | shopify_zz_9342517182677_53720591892693 | 4,460 | 1 | 0.02% | $0.98 | 0 | $0 |
| Zeolite Powder — 2 lb | shopify_zz_9264679256277_53176075649237 | 4,391 | 31 | 0.71% | $80.45 | 0 | $0 |
| **Zeotein Cacao — All-In-One \| 30-Day Supply (sticks)** | shopify_zz_9202824380629_52649698132181 | **4,347** | 40 | 0.92% | $55.09 | **0** | $0 |
| Beef Bone Broth Protein Powder — 2 lb | shopify_zz_9262718910677_53107187122389 | 3,473 | 14 | 0.40% | $18.61 | 0 | $0 |
| Organic Hemp Protein Powder — 1 lb | shopify_zz_9266916655317_53196989268181 | 3,376 | 19 | 0.56% | $18.42 | 0 | $0 |
| Organic Lion's Mane — 2 lb | shopify_zz_9266900566229_53196571934933 | 3,145 | 18 | 0.57% | $9.59 | 0 | $0 |
| Organic Lion's Mane — 1/2 lb | shopify_zz_9266900566229_53196571869397 | 3,101 | 14 | 0.45% | $15.62 | 0 | $0 |
| (no item) | — | 3,063 | 6 | 0.20% | $6.40 | 0 | $0 |
| Organic Collagen Peptides — 1 lb | shopify_zz_9264652910805_53174839214293 | 2,642 | 16 | 0.61% | $17.16 | 0.1 | $11.78 |
| Organic MCT Oil Powder — 2 lb | shopify_zz_9264871375061_53176161337557 | 1,825 | 4 | 0.22% | $3.34 | 0.1 | $11.78 |
| **Zeotein 15-Day Reset** | shopify_zz_9203721339093_52703116165333 | 1,189 | 0 | 0% | $0.12 | 0 | $0 |
| Organic Sea Moss Powder — 1 lb | shopify_zz_9266819203285_53196545032405 | 1,132 | 4 | 0.35% | $8.05 | 0 | $0 |
| Organic Pumpkin Seed Protein — 2 lb | shopify_zz_9269244231893_53207147774165 | 1,126 | 13 | 1.15% | $25.42 | 1 | $59.99 |
| Organic Hemp Protein Powder — 2 lb | shopify_zz_9266916655317_53196989300949 | 986 | 6 | 0.61% | $11.16 | 0 | $0 |
| Organic Sea Moss Powder — 1/2 lb | shopify_zz_9266819203285_53196544999637 | 748 | 10 | 1.34% | $7.30 | 0 | $0 |
| Zeotein Shaker — White | shopify_zz_9340801515733_53710157381845 | 535 | 0 | 0% | $0.04 | 0 | $0 |

**What's in the two live Shopping campaigns:**

- Z_Shopping_SI's 3 purchases came from Zeolite 1/2 lb ($28.50), Zeolite 1 lb ($82.99) and Pumpkin Seed 2 lb ($59.99).
- Its biggest spenders had **0** purchases: Fermented Cacao 1/2 lb ($58.04, 116 clicks), 2 lb ($44.55, 90 clicks) and 1 lb ($38.04, 74 clicks).
- Z_Shopping_Blends ($313.08, 0 purchases) items:
  - Cacao Bulk 30-serving: $73.74, 52 clicks
  - Vegan 7-Day: $81.87, 22 clicks
  - Vegan 30-Day sticks: $75.84, 29 clicks
  - Cacao 30-Day sticks: $53.76, 35 clicks
  - Cacao 7-Day: $27.87, 9 clicks

**UTM conflict on paid Shopping URLs:** feed URLs carry `utm_medium=product_sync&utm_source=google&utm_campaign=sag_organic` (the free-listing tag). GA4 resolves the source through gclid. Any UTM-based reporting, such as Shopify's marketing attribution, will likely record paid Shopping clicks as "sag_organic".

### 1.9 Device split — 90d (all campaigns)

| Device | Cost | Share | Impr | Clicks | CPC | Purchases | Value | Cost / purchase | ROAS |
|---|---|---|---|---|---|---|---|---|---|
| Mobile | $3,326.27 | 78.3% | 205,594 | 1,963 | $1.69 | 31 | $3,322.60 | $107.30 | 1.00 |
| Computers | $787.91 | 18.5% | 36,817 | 280 | $2.81 | 6 | $500.29 | $131.32 | 0.63 |
| Tablets | $125.87 | 3.0% | 18,714 | 80 | $1.57 | 0 | $0 | — | 0 |
| TV screens | $9.97 | 0.2% | 899 | 2 | $4.98 | 0 | $0 | — | 0 |

- Search_NB_Sales: 97% of its spend was mobile ($163.96, 144 clicks, 0 purchases).
- Z_Pmax_RET on computers: $247.03, 0 purchases.

### 1.10 Landing pages / final URLs — 90d

| Destination | Campaign | Impr | Clicks | Cost | Purchases | Value |
|---|---|---|---|---|---|---|
| zeotein.com homepage (/, www, and the {ignore} UTM version) | Z_S_Brand_Core | 4,671 | 182 | $816.74 | **13** | $1,801.58 |
| Brand sitelinks (single-ingredient collection, about, pre-launch bundle, contact) | Z_S_Brand_Core | — | 13 | $109.82 | 0 | $0 |
| **marketing.zeotein.com/starter-kit-page** (used Oct 25–Nov 6) | Search_NB_Sales | 1,995 | **112** | $123.97 | **0** | $0 |
| **marketing.zeotein.com/starter-kit-google** (from Nov 6) | Search_NB_Sales | 396 | **31** | $37.99 | **0** | $0 |
| NB sitelinks to zeotein.com (collections/all, protein-blends, etc.) | Search_NB_Sales | 5,303 | 5 | $6.46 | 0 | $0 |
| zeotein.com homepage | Z_Pmax_RET | 35,419 | 244 | $216.54 | 1 | $117.75 |
| zeotein.com homepage (final URL expansion) | Z_Pamx_All_Prodcuts_Feed_Only | 11,742 | 36 | $215.12 | 4 | $459.83 |
| go.zeotein.com/ | Feed_Only + RET | 133 | 2 | $5.50 | 0 | $0 |
| Product detail pages (feed items, ~200 URL rows) | Shopping / PMax | rest | rest | rest | 19 | — |

- Search_NB_Sales sent 143 of its 148 clicks (97%) to marketing.zeotein.com. That page is not tracked in GA4 (see §2.1).
- The final URL changed on Nov 6, from `/starter-kit-page` to `/starter-kit-google`.
- On the brand campaign, only 15 clicks carried the UTM suffix (`{ignore}?utm_source=google…`). Search_NB_Sales has campaign-level URL tags. All other campaigns show `url_tags: null`, so they rely on gclid auto-tagging (which works in GA4).

---

## 2. Google Analytics 4 (property 535557069)

### 2.1 Hostname check — 90d

| Hostname | Sessions | Engaged | Purchases | Revenue |
|---|---|---|---|---|
| zeotein.com | 5,358 | 2,812 | 130 | $17,739.81 |
| account.zeotein.com | 202 | 137 | — | — |
| try.zeotein.com | **20** | 16 | — | — |
| (not set) | 5 | 0 | 5 | $644.46 |
| **marketing.zeotein.com** | **0 (not present)** | | | |
| **go.zeotein.com** | **0 (not present)** | | | |

- **GA4 receives no data from marketing.zeotein.com or go.zeotein.com.** It barely sees try.zeotein.com: 20 sessions in 90 days, while Meta logged 133 landing page views to try.zeotein.com in the last 30 days alone.
- GA4 property 535580236 has 0 sessions.
- The "(not set)" purchases have no hostname. They may be server-side or subscription orders; this is unverified.

### 2.2 Channel performance — 90d

Add-to-cart counts are inflated by internal/QA traffic (see §2.8).

| Channel | Sessions | Engaged | Eng. rate | Avg engagement time / session (s) | Add-to-carts* | Checkouts | Purchases | Revenue | Session CR | 1st-time purchasers |
|---|---|---|---|---|---|---|---|---|---|---|
| Direct | 1,796 | 869 | 48.4% | 56 | 275 | 132 | **62** | $7,745.13 | 3.45% | 59 |
| Cross-network (PMax) | 1,069 | 523 | 48.9% | 43 | 57 | 17 | 16 | $1,088.51 | 1.50% | 16 |
| Paid Shopping | 705 | 474 | 67.2% | 31 | 13 | 6 | 3 | $162.48 | **0.43%** | 3 |
| Organic Search | 435 | 267 | 61.4% | 66 | 543* | 35 | 10 | $2,079.08 | 2.30% | 9 |
| Paid Search (all brand) | 243 | 138 | 56.8% | 60 | 67 | 30 | 12 | $1,651.84 | 4.94% | 12 |
| Email | 227 | 138 | 60.8% | 70 | 49 | 14 | 16 | $4,168.14 | **7.05%** | 13 |
| Organic Social | 223 | 119 | 53.4% | 51 | 9 | 5 | 1 | $28.99 | 0.45% | 1 |
| Paid Social | 219 | 85 | 38.8% | 32 | 23 | 4 | 4 | $310.71 | 1.83% | 4 |
| Organic Shopping (= Shopify admin, internal) | 111 | 84 | 75.7% | 290 | 544* | 39 | 0 | $0 | 0% | 0 |
| Unassigned | 107 | 48 | 44.9% | 33 | 176* | 13 | 5 | $644.46 | 4.67% | 4 |
| AI Assistant (chatgpt.com) | 99 | 57 | 57.6% | 23 | 8 | 6 | 1 | $34.00 | 1.01% | 1 |
| Referral | 82 | 56 | 68.3% | 983 | 22 | 4 | 5 | $470.93 | 6.10% | 3 |
| Display | 42 | 14 | 33.3% | 18 | 1 | 1 | 0 | $0 | 0% | 0 |
| Paid Other | 4 | 1 | 25.0% | 0 | 3 | 0 | 0 | $0 | 0% | 0 |
| **Total** | **5,362** | 2,873 | 53.6% | 68 | 1,790* | 306 | **135** | **$18,384.27** | **2.52%** | **125** |

### 2.3 Channel performance — 30d

| Channel | Sessions | Engaged | Eng. rate | Avg eng. time (s) | Add-to-carts* | Checkouts | Purchases | Revenue | Session CR | 1st-time purchasers |
|---|---|---|---|---|---|---|---|---|---|---|
| Direct | 696 | 297 | 42.7% | 47 | 89 | 24 | 7 | $589.69 | 1.01% | 7 |
| Paid Shopping | 677 | 463 | 68.4% | 31 | 12 | 6 | 3 | $162.48 | **0.44%** | 3 |
| Organic Search | 156 | 107 | 68.6% | 98 | 514* | 17 | 2 | $421.90 | 1.28% | 2 |
| Cross-network | 152 | 95 | 62.5% | 58 | 16 | 3 | 2 | $293.37 | 1.32% | 2 |
| Paid Social | 126 | 52 | 41.3% | 22 | 22 | 2 | 3 | $212.97 | 2.38% | 3 |
| Organic Social | 106 | 55 | 51.9% | 61 | 8 | 2 | 1 | $28.99 | 0.94% | 1 |
| Email | 94 | 62 | 66.0% | 78 | 28 | 3 | 6 | $1,280.40 | 6.38% | 6 |
| Unassigned | 79 | 41 | 51.9% | 30 | 175* | 11 | 3 | $551.46 | 3.80% | 2 |
| Paid Search | 70 | 38 | 54.3% | 51 | 41 | 14 | 2 | $225.96 | 2.86% | 2 |
| Organic Shopping (internal) | 45 | 38 | 84.4% | 446 | 385* | 13 | 0 | $0 | 0% | 0 |
| Referral | 45 | 32 | 71.1% | 96 | 17 | 3 | 2 | $279.97 | 4.44% | 1 |
| AI Assistant | 35 | 20 | 57.1% | 17 | 1 | 0 | 0 | $0 | 0% | 0 |
| Paid Other | 4 | 1 | 25.0% | 0 | 3 | 0 | 0 | $0 | 0% | 0 |
| **Total** | **2,285** | 1,301 | 56.9% | 55 | 1,311* | 98 | **31** | **$4,047.19** | **1.36%** | **29** |

### 2.4 Monthly trend (GA4)

| Month | Sessions | Engaged | Add-to-carts* | Checkouts | Purchases | Revenue | 1st-time purchasers | Session CR |
|---|---|---|---|---|---|---|---|---|
| 2026-05 | 1,852 | 758 | — | — | — (ecommerce not tracked yet) | — | — | — |
| 2026-06 | 1,278 | 595 | 97 | 60 | 16 | $2,249.62 | 16 | 1.25% |
| 2026-07 | 1,939 | 996 | 280 | 157 | 44 | $5,533.83 | 42 | 2.27% |
| 2026-08 | 1,205 | 606 | 139 | 73 | 41 | $6,831.89 | 38 | 3.40% |
| 2026-09 | 1,821 | 950 | 227 | 132 | **69** | **$8,129.47** | 64 | 3.79% |
| 2026-10 | 1,958 | 1,007 | 961* | 82 | **31** | $3,506.09 | 29 | 1.58% |
| 2026-11 (1–9) | 870 | 559 | 517* | 39 | **7** | $1,190.04 | 7 | 0.80% |

**Purchases by channel by month:**

| Channel | Jun | Jul | Aug | Sep | Oct | Nov 1–9 |
|---|---|---|---|---|---|---|
| Direct | 9 | 21 | 16 | **42** | **7** | 2 |
| Email | 2 | 0 | 10 | 1 | 4 | 2 |
| Organic Search | 5 | 7 | 6 | 4 | 1 | 1 |
| Paid Search (brand) | 0 | 7 | 6 | 6 | 2 | 1 |
| Cross-network (PMax) | — | 4 | 2 | **12** | 3 | 1 |
| Paid Shopping | — | 0 | — | 0 | 3 | 0 |
| Paid Social | — | 1 | — | 1 | 3 | 0 |
| Other (org. social, referral, unassigned, AI, org. shopping) | 0 | 4 | 1 | 3 | 11 | 0 |
| **Total** | 16 | 44 | 41 | 69 | 31 | 7 |

**GA4 sees only a fraction of Meta traffic.** Paid Social sessions in GA4 compared with Meta link clicks:

| Month | GA4 Paid Social sessions | Meta link clicks | Share visible to GA4 |
|---|---|---|---|
| Jul | 116 | 871 | 13% |
| Aug | 7 | 1,171 | **0.6%** |
| Sep | 44 | 1,457 | **3%** |
| Oct | 130 | 856 | 15% |
| 90d | 219 | 3,233 | 6.8% |

### 2.5 Paid / notable source–medium–campaign rows — 90d (GA4 view)

| Source / medium | Campaign | Sessions | Eng. rate | ATC | Checkouts | Purchases | Revenue |
|---|---|---|---|---|---|---|---|
| google / cpc | Z_Shopping_SI | 561 | 68.5% | 10 | 6 | 3 | $162.48 |
| google / cpc | Z_Pamx_All_Prodcuts_Feed_Only | 520 | 51.5% | 32 | 12 | 11 | $649.40 |
| google / cpc | Z_Pmax_RET | 403 | 39.7% | 20 | 3 | 5 | $439.11 |
| google / cpc | Z_S_Brand_Core | 254 | 55.9% | 31 | 17 | **12** | $1,651.84 |
| google / cpc | Z_Shopping_Blends | 113 | 68.1% | 2 | 0 | 0 | — |
| google / cpc | Z_Pamx_All_Prodcuts_Feed_Single_I | 84 | 58.3% | 1 | 0 | 0 | — |
| google / cpc | **Search_NB_Sales** | **4** | 75% | 0 | 0 | **0** | — |
| google / cpc | 24379489176 / 24379462296 (= SI / Blends IDs in utm_campaign) | 8 / 3 | 0% | — | — | — | — |
| fb / paid_social | Z_I_Cacao_Cold_Purchases_102026 | 87 | 41.4% | 15 | 1 | 1 | $58.99 |
| meta / paid | Z_I_Howie_Engaged_Shoppers_Purchases_091726 | 31 | 45.2% | 1 | 0 | 0 | — |
| meta / paid | Z_I_Volcano_Cold-Protein_Purchases_Funnel_10.1.26 | 28 | 21.4% | — | — | — | — |
| meta / paid | Z_I_Volcano_Cold-Protein_Purchases_091826 | 17 | 29.4% | 0 | 1 | 1 | $97.74 |
| facebook / paid | Z_I_Cacao_Cold_Purchases_102026 | 12 | 16.7% | 6 | 0 | 1 | $76.99 |
| howie / landing_page · purple-celeb / landing_page · purple-operator / landing_page · ghl / funnel | howie_bulk_offer, clean_protein_offer, holiday-guide | 18 · 6 · 3 · 5 | — | 5 · 0 · 0 · — | 5 · 1 · 2 · — | 0 | — |
| email / owned | stockupweek | 91 | 59.3% | 16 | 5 | **10** | **$2,887.74** |
| **admin.shopify.com / referral** (internal) | — | 103 | 76.7% | **543** | 38 | 0 | — |
| zz123 / (not set) (test) | cc456 | 6 | — | **146** | 0 | 0 | — |
| **127.0.0.1:27652 / referral** (local dev) | — | 4 | — | 5 | 0 | **3** | $94.97 |
| test, googletest/UTMCHECK, audit/jewels_audit, NIGHTLY_UTM_TEST, PASSTHROUGH_TEST | — | 30 | — | 15 | 1 | 0 | — |
| app.clickup.com, app.automator.ai, link.automator.ai, adsmanager.facebook.com, wmzz7i-xw.myshopify.com | referral | 75 | — | 20 | 2 | 0 | — |

Off-site landing pages pass users to the store with **hard-coded UTMs** (howie, purple-celeb, purple-operator, ghl). Those UTMs overwrite the original Google or Meta source.

### 2.6 Organic Search landing pages — 90d (top 25)

| Landing page | Sessions | Eng. rate | ATC* | Purchases | Revenue |
|---|---|---|---|---|---|
| / | 206 | 70.4% | 38 | 6 | $1,575.16 |
| (not set) | 45 | 4.4% | — | — | — |
| /collections/zeotein | 26 | 84.6% | 5 | 2 | $238.97 |
| /products/zeolite | 25 | 44.0% | 2 | 0 | — |
| /products/cacao-protein-starter-kit | 14 | 78.6% | **276*** | 0 | — |
| /products/cacao | 13 | 69.2% | **209*** | 0 | — |
| /products/zeotein-30-day-supply | 7 | 71.4% | 1 | 1 | $114.99 |
| /products/zeotein-cacao-30-day-bulk-powder | 7 | 57.1% | 3 | 0 | — |
| /products/zeotein-protein-cacao | 7 | 100% | 2 | 0 | — |
| /products/organic-fermented-cacao-powder-premium-unsweetened | 5 | 20.0% | — | — | — |
| /products/cacao-recipe-guide | 4 | 100% | — | — | — |
| /products/zeotein-vegan-7-day-supply | 4 | 50.0% | 2 | 0 | — |
| /a/subscriptions/login | 3 | 66.7% | — | — | — |
| /orders/8941bc5d… (order status page) | 3 | 0% | — | — | — |
| /pages/faqs | 3 | 66.7% | — | — | — |
| /products/save-a-scoop | 3 | 33.3% | — | — | — |
| /products/zeotein-cacao-sticks-30 | 3 | 66.7% | — | — | — |
| /a/subscriptions/manage | 2 | 50.0% | — | — | — |
| /cart | 2 | 50.0% | 2 | 0 | — |
| /collections/protein | 2 | 100% | — | — | — |
| /collections/zeotein-vegan-1 | 2 | 100% | — | — | — |
| /orders/7036976005333 | 2 | 0% | — | — | — |
| /orders/a966d5d7… | 2 | 50.0% | — | — | — |
| /orders/f1ee399f… | 2 | 50.0% | — | — | — |
| /products/organic-hemp-protein-powder-premium-plant-based-protein | 2 | 50.0% | — | — | — |

Organic search is small: about 4.8 sessions a day, and mostly brand-navigational traffic to the homepage. The add-to-cart spikes on `/products/cacao` and `/products/cacao-protein-starter-kit` come from QA sessions:

- Oct 21: 2 desktop sessions on /products/cacao produced 197 ATC.
- Nov 5: 2 desktop sessions on /products/cacao-protein-starter-kit produced 226 ATC.

### 2.7 Top 30 landing pages overall — 90d

| Landing page | Sessions | Eng. rate | ATC* | Checkouts | Purchases | Revenue |
|---|---|---|---|---|---|---|
| / | 1,680 | 55.0% | 306 | 96 | **55** | $8,045.38 |
| /products/zeolite | 482 | 58.1% | 27 | 12 | 10 | $450.41 |
| /products/organic-fermented-cacao-powder-premium-unsweetened | 441 | 59.6% | 11 | 4 | 2 | $57.98 |
| (not set) | 240 | 5.0% | 1 | 0 | 5 | $644.46 |
| /products/cacao | 206 | 49.0% | 392* | 18 | 2 | $226.97 |
| /products/zeotein-cacao-30-day-bulk-powder | 186 | 36.6% | 56 | 10 | **0** | — |
| /products/zeotein-30-day-supply | 146 | 54.8% | 41 | 9 | 3 | $235.97 |
| /products/zeotein-bone-broth-protein-powder | 114 | 60.5% | 16 | 3 | 0 | — |
| /products/organic-pumpkin-seed-protein-powder | 109 | 48.6% | 2 | 0 | 2 | $76.98 |
| /products/cacao-protein-starter-kit | 98 | 58.2% | 335* | 9 | **0** | — |
| /collections/zeotein | 72 | 61.1% | 12 | 8 | 3 | $908.91 |
| /products/organic-hemp-protein-powder-premium-plant-based-protein | 68 | 73.5% | — | — | — | — |
| /products/zeotein-protein-cacao | 68 | 60.3% | 10 | 4 | 0 | — |
| /products/zeotein-cacao-bulk-bag-starter-kit-try-99-99-renewal | 54 | 33.3% | 15 | 6 | 0 | — |
| /products/zeotein-collagen-peptides | 52 | 69.2% | 1 | 1 | 0 | — |
| /products/zeotein-cacao-starter-kit | 51 | 49.0% | 6 | 3 | 4 | $347.69 |
| /pages/about-zeotein | 47 | 36.2% | 1 | 0 | 0 | — |
| /products/organic-sea-moss-powder-8oz-… | 46 | 52.2% | 6 | 1 | 1 | $34.99 |
| /products/zeotein-cacao-bag-30 | 46 | 71.7% | — | — | — | — |
| /a/subscriptions/login | 44 | 52.3% | 6 | 1 | 2 | $284.48 |
| /collections/all | 43 | 51.2% | 10 | 4 | 4 | $593.97 |
| /products/organic-mct-oil-powder | 40 | 62.5% | — | — | — | — |
| /products/cacao-recipe-guide | 39 | 89.7% | 281* | 12 | 0 | — |
| /products/organic-lion-s-mane-mushroom-powder | 39 | 61.5% | 3 | 1 | 1 | $39.99 |
| /products/zeotein-vegan-7-day-supply | 39 | 56.4% | 3 | 2 | 1 | $58.99 |
| /pages/labor-day-sale | 34 | 61.8% | 22 | 3 | 2 | $364.97 |
| /collections/halloween-sale | 30 | 73.3% | 12 | 0 | 4 | $642.46 |
| /products/zeotein-cacao-sticks-30 | 30 | 73.3% | — | — | — | — |
| /products/zeotein-cleanblend-shaker-27oz-usa-made | 25 | 36.0% | 2 | 2 | 0 | — |
| /cart | 22 | 54.5% | 7 | 1 | 1 | $244.98 |

- The homepage drives 55 of 135 purchases (41%).
- The core blend product pages convert poorly as entry pages:
  - 30-day bulk powder: 186 sessions, 0 purchases
  - Starter-kit pages: 98 sessions, 0 purchases (with QA-inflated ATC)
  - Zeotein-protein-cacao: 68 sessions, 0 purchases

### 2.8 Ecommerce funnel by device — 90d (event counts)

**All traffic:**

| Device | session_start | view_item | add_to_cart | begin_checkout | add_shipping_info | add_payment_info | purchase | Purchases ÷ sessions |
|---|---|---|---|---|---|---|---|---|
| Mobile | 3,267 | 2,850 | 352 | 130 | 101 | 29 | 92 | 2.82% |
| Desktop | 1,989 | 1,930 | 1,431* | 169 | 56 | 14 | 42 | 2.11% |
| Tablet | 92 | 54 | 7 | 7 | 8 | 0 | 1 | 1.09% |
| Smart TV | 2 | 4 | 0 | 0 | 0 | 0 | 0 | — |

**Excluding the known internal/test sources** (admin.shopify, zz123, test, 127.0.0.1, googletest, audit, clickup, automator, myshopify, adsmanager):

| Device | session_start | view_item | add_to_cart | begin_checkout | add_shipping_info | add_payment_info | purchase |
|---|---|---|---|---|---|---|---|
| Mobile | 3,267 | 2,850 | 352 | 130 | 101 | 29 | 92 |
| Desktop | 1,954 | 1,861 | 1,257* (still includes QA on organic sessions) | 166 | 56 | 14 | 42 |
| Tablet | 92 | 54 | 7 | 7 | 8 | 0 | 1 |

**Mobile is the cleanest read:**

- sessions → add_to_cart: **10.8%**
- add_to_cart → begin_checkout: 36.9%
- begin_checkout → purchase: **70.8%**

**The leak is at the product page (view → add to cart), not at checkout.** Checkout completion is healthy.

Note that add_payment_info (43) is lower than purchases (135), so express checkouts skip that step.

### 2.9 GA4 data-quality issues found

1. **Internal Shopify-admin traffic** (admin.shopify.com) is classified by GA4 as **"Organic Shopping"**: 103 sessions, 543 add-to-carts, 0 purchases.
2. **QA sessions.** Small groups of 2–6 sessions fired 50–226 add-to-carts per group (Oct 21: 197; Nov 4: 50; Nov 5: 226; zz123/cc456: 146). October ATC (961) and November ATC (517) are therefore mostly noise.
3. **Test purchases from local development:** 127.0.0.1:27652 recorded 3 purchases and $94.97.
4. **Test UTMs in production data:** UTMCHECK, jewels_audit, NIGHTLY_UTM_TEST, PASSTHROUGH_TEST.
5. **No GA4 tag on marketing.zeotein.com or go.zeotein.com**, and only partial coverage of try.zeotein.com.
6. **Hand-off links overwrite source attribution** with hard-coded UTMs (howie / landing_page, ghl / funnel, etc.).

---

## 3. Meta Ads (act_2265230500634366)

### 3.1 Account totals vs. team targets

| Metric | 90d | 30d | Target | Status |
|---|---|---|---|---|
| Spend | $9,473.29 | $2,337.75 | | |
| Impressions / Reach / Frequency | 206,492 / 53,432 / 3.86 | 54,958 / 15,199 / 3.62 | | |
| CPM | **$45.88** | **$42.54** | ≤ $18 | **Miss (2.4–2.5×)** |
| Link clicks | 3,233 | 657 | | |
| Link CTR | 1.57% | **1.20%** | ≥ 1.5% | 90d OK / 30d **miss** |
| CPC (link) | **$2.93** | **$3.56** | ≤ $1.20 | **Miss (2.4–3×)** |
| Landing page views (LPV / link click) | 1,274 (39%) | 555 (84%) | | 90d LPV rate is low (see Old_Try) |
| Pixel ATC / Initiate checkout | 146 / 156 | 47 / 28 | | |
| Pixel purchases / value | 46 / $5,875.82 | 9 / $1,332.64 | | |
| Cost per purchase | **$205.94** | **$259.75** | CAC ≤ $60 | **Red (> $90)** |
| ROAS | 0.62 | 0.57 | | |

All spend is US-only: the "- MX" in one campaign name is not Mexico targeting. By platform (90d):

- Facebook: $7,828.90, CPM $47.59, 41 purchases
- Instagram: $1,600.64, CPM $39.62, 5 purchases

### 3.2 Campaigns — 90d

| Campaign | Status | Spend | Impr | CPM | Link clicks | Link CTR | CPC link | LPV | LPV ÷ clicks | ATC | IC | Purchases | Value | Cost / purchase | ROAS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Z_I_Old_Try_10.1.26 | PAUSED | **$3,033.23** | 59,746 | $50.77 | 1,108 | 1.85% | $2.74 | 51 | **5%** | 41 | 68 | 18 | $2,114.09 | $168.51 | 0.70 |
| Z_V_Howie_Engaged_Protein_Cold_Purchases_092526 | PAUSED | $1,027.37 | 15,460 | $66.45 | 371 | 2.40% | $2.77 | 34 | 9% | 13 | 19 | 6 | $851.98 | $171.23 | 0.83 |
| Z_I_Volcano_Cold-Try_Purchases_10726 | PAUSED | $827.84 | 19,577 | $42.29 | 225 | 1.15% | $3.68 | 174 | 77% | 13 | 13 | 6 | $497.42 | $137.97 | 0.60 |
| [BRTV] [SALES] [ABO] New Approaches \| Key Assets - MX | PAUSED | $465.73 | 8,374 | $55.62 | 179 | 2.14% | $2.60 | 140 | 78% | 4 | 5 | 1 | $106.18 | **$465.73** | 0.23 |
| Z_IV_Q4_AD1_Cold_Try_Purchases_101226 | PAUSED | $447.08 | 10,309 | $43.37 | 104 | 1.01% | $4.30 | 82 | 79% | 4 | 5 | 3 | $274.72 | $149.03 | 0.61 |
| Z_I_Howie_Engaged_Funnel_Purchases_091726 | PAUSED | $437.82 | 13,432 | $32.60 | 125 | 0.93% | $3.50 | 53 | 42% | 15 | 7 | 3 | $375.79 | $145.94 | 0.86 |
| Z_I_Kit_Cold_Purchases_102026 | PAUSED | $432.94 | 7,722 | $56.07 | 100 | 1.30% | $4.33 | 82 | 82% | 4 | 1 | 1 | $76.99 | **$432.94** | 0.18 |
| Z_I_Sticks_Cold_Purchases_102026 | PAUSED | $377.92 | 9,396 | $40.22 | 86 | 0.92% | $4.39 | 70 | 81% | 12 | 7 | 1 | $149.98 | **$377.92** | 0.40 |
| Z_I_Cacao_Cold_Purchases_102026 | PAUSED | $376.73 | 11,941 | $31.55 | 111 | 0.93% | $3.39 | 96 | 86% | 24 | 10 | 4 | $830.95 | **$94.18** | **2.21** |
| Z_V_Volcano_Cold-Protein_Purchases_091726 | PAUSED | $313.90 | 9,424 | $33.31 | 115 | 1.22% | $2.73 | 66 | 57% | 3 | 3 | 1 | $97.74 | $313.90 | 0.31 |
| Z_I_Volcano_Cold-Protein_Purchases_Try_10.1.26 | PAUSED | $265.63 | 8,238 | $32.24 | 189 | 2.29% | $1.41 | 38 | 20% | 1 | 1 | 1 | $225.00 | $265.63 | 0.85 |
| Z_V_RET_Try_92526 | PAUSED | $219.08 | 5,113 | $42.85 | 84 | 1.64% | $2.61 | 50 | 60% | 2 | 2 | **0** | $0 | — | 0 |
| ZEO_Sales_Howie_Aug26 - Copy | PAUSED | $214.08 | 1,778 | $120.40 | 60 | 3.37% | $3.57 | 53 | 88% | 7 | 8 | 1 | $274.98 | $214.08 | 1.28 |
| Z_V_Cacao_Volcano_Cold-Try_Feed_Purchases_10.1.26 | PAUSED | $182.38 | 4,056 | $44.97 | 53 | 1.31% | $3.44 | 42 | 79% | 0 | 0 | **0** | $0 | — | 0 |
| Z_I_Whitebaord-Ai_Try_10726 | PAUSED | $176.73 | 5,830 | $30.31 | 47 | 0.81% | $3.76 | 41 | 87% | 1 | 1 | **0** | $0 | — | 0 |
| Z_I_Volcano_RET_Purchases_092526 | PAUSED | $161.18 | 3,582 | $45.00 | 45 | 1.26% | $3.58 | 37 | 82% | 1 | 1 | **0** | $0 | — | 0 |
| Z_V_Volcano_Cold-Protein_Purchases_Try_10.1.26 | PAUSED | $154.63 | 4,030 | $38.37 | 39 | 0.97% | $3.96 | 14 | 36% | 1 | 0 | **0** | $0 | — | 0 |
| cold-meta-sales-westonprice-202610 | **ACTIVE** | $149.55 | 2,148 | $69.62 | 10 | **0.47%** | **$14.96** | 10 | 100% | 0 | 0 | **0** | $0 | — | 0 |
| Z_V_RET_Funnel_10_1_26 | PAUSED | $104.84 | 2,926 | $35.83 | 37 | 1.26% | $2.83 | 5 | 14% | 0 | 1 | **0** | $0 | — | 0 |
| CONVERSIONS oSUBSCRIBE | **ACTIVE** | $104.63 | 3,410 | $30.68 | 145 | 4.25% | $0.72 | 136 | 94% | 0 | 4 | **0** | $0 | — | 0 |

- **Zero-purchase campaigns:** 8 campaigns, **$1,253.02**.
- **One purchase at more than $300 each:** 4 campaigns, **$1,590.49**.
- **Z_I_Old_Try ($3,033):** only 51 LPV from 1,108 link clicks. The page either didn't load or didn't fire the pixel's landing page view.

### 3.3 Campaigns — 30d

| Campaign | Status | Spend | CPM | Link clicks | CTR | CPC | LPV | ATC | IC | Purchases | Value | Cost / purchase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Z_IV_Q4_AD1_Cold_Try_Purchases_101226 | PAUSED | $447.08 | $43.37 | 104 | 1.01% | $4.30 | 82 | 4 | 5 | 3 | $274.72 | $149.03 |
| Z_I_Kit_Cold_Purchases_102026 | PAUSED | $432.94 | $56.07 | 100 | 1.30% | $4.33 | 82 | 4 | 1 | 1 | $76.99 | $432.94 |
| Z_I_Sticks_Cold_Purchases_102026 | PAUSED | $377.92 | $40.22 | 86 | 0.92% | $4.39 | 70 | 12 | 7 | 1 | $149.98 | $377.92 |
| Z_I_Cacao_Cold_Purchases_102026 | PAUSED | $376.73 | $31.55 | 111 | 0.93% | $3.39 | 96 | 24 | 10 | 4 | $830.95 | **$94.18** |
| cold-meta-sales-westonprice-202610 | ACTIVE | $149.55 | $69.62 | 10 | 0.47% | $14.96 | 10 | — | — | 0 | — | — |
| Z_I_Old_Try_10.1.26 | PAUSED | $106.02 | $58.57 | 17 | 0.94% | $6.24 | 12 | — | — | 0 | — | — |
| CONVERSIONS oSUBSCRIBE | ACTIVE | $104.63 | $30.68 | 145 | 4.25% | $0.72 | 136 | — | 4 | 0 | — | — |
| Z_I_Whitebaord-Ai_Try_10726 | PAUSED | $94.63 | $30.19 | 25 | 0.80% | $3.79 | 22 | 1 | 1 | 0 | — | — |
| Z_I_Volcano_Cold-Protein_Purchases_Try_10.1.26 | PAUSED | $91.71 | $40.19 | 17 | 0.74% | $5.39 | 13 | — | — | 0 | — | — |
| Z_I_Volcano_Cold-Try_Purchases_10726 | PAUSED | $74.90 | $53.12 | 19 | 1.35% | $3.94 | 13 | 1 | — | 0 | — | — |
| Z_V_Volcano_Cold-Protein_Purchases_Try_10.1.26 | PAUSED | $45.19 | $52.30 | 14 | 1.62% | $3.23 | 10 | 1 | — | 0 | — | — |
| Z_V_Cacao_Volcano_Cold-Try_Feed_Purchases_10.1.26 | PAUSED | $36.45 | $68.52 | 9 | 1.69% | $4.05 | 9 | — | — | 0 | — | — |
| **Total** | | **$2,337.75** | $42.54 | 657 | 1.20% | $3.56 | 555 | 47 | 28 | **9** | $1,332.64 | **$259.75** |

**What has delivered most recently** (daily data, Nov 6–9):

- CONVERSIONS oSUBSCRIBE: first spend Nov 6; $104.63 to date; 0 purchases; destination go.zeotein.com.
- Z_IV_Q4_AD1: $63.13 on Nov 6–8; 1 purchase.
- The three `_102026` campaigns: stopped after Nov 8.
- On Nov 9, only CONVERSIONS oSUBSCRIBE spent ($36.69).
- cold-meta-sales-westonprice is ACTIVE but had no delivery from Oct 27 to Nov 9.

CONVERSIONS oSUBSCRIBE's URL tags are mis-mapped: `utm_source={{campaign.name}}&utm_medium={{adset.name}}&utm_campaign={{ad.name}}`.

### 3.4 Ad sets — 90d (main ad set name: Cold_US_35-65_Purchases)

| Campaign | Ad set | Spend | CPM | Freq. | Link CTR | CPC | LPV | Purchases | Value | Cost / purchase |
|---|---|---|---|---|---|---|---|---|---|---|
| Z_I_Old_Try_10.1.26 | [SALES] Audience 1 \| Statics \| F | $1,716.18 | $41.52 | 4.97 | 1.24% | $3.35 | 38 | 11 | $1,239.64 | $156.02 |
| Z_I_Old_Try_10.1.26 | [SALES] Audience 1 \| Statics \| SR | $1,317.05 | $71.51 | 2.44 | 3.24% | $2.21 | 13 | 7 | $874.45 | $188.15 |
| Z_V_Howie_Engaged_Protein… | Engaged Shoppers 30-60 | $1,014.51 | $68.64 | 2.58 | 2.50% | $2.75 | 33 | 6 | $851.98 | $169.09 |
| Z_I_Volcano_Cold-Try… | Cold Protein 30-60 | $827.84 | $42.29 | 2.63 | 1.15% | $3.68 | 174 | 6 | $497.42 | $137.97 |
| Z_IV_Q4_AD1… | **AD1_Cold_US_35-65_Purchases** | $447.08 | $43.37 | 3.37 | 1.01% | $4.30 | 82 | 3 | $274.72 | $149.03 |
| Z_I_Howie_Engaged_Funnel… | Engaged Shoppers 30-60 | $437.82 | $32.60 | 3.25 | 0.93% | $3.50 | 53 | 3 | $375.79 | $145.94 |
| Z_I_Kit_Cold… | **Cold_US_35-65_Purchases** | $432.94 | $56.07 | 2.15 | 1.30% | $4.33 | 82 | 1 | $76.99 | $432.94 |
| [BRTV] … - MX | [SALES] Audience 1 \| Key Assets \| Up | $421.88 | $63.74 | 2.47 | 2.58% | $2.47 | 140 | 1 | $106.18 | $421.88 |
| Z_I_Sticks_Cold… | **Cold_US_35-65_Purchases** | $377.92 | $40.22 | 3.43 | 0.92% | $4.39 | 70 | 1 | $149.98 | $377.92 |
| Z_I_Cacao_Cold… | **Cold_US_35-65_Purchases** | $376.73 | $31.55 | 3.48 | 0.93% | $3.39 | 96 | 4 | $830.95 | $94.18 |
| Z_V_Volcano_Cold-Protein_091726 | Cold Protein 30-60 | $313.90 | $33.31 | 1.48 | 1.22% | $2.73 | 66 | 1 | $97.74 | $313.90 |
| Z_I_Volcano_Cold-Protein_Try | Cold Protein 25-60 | $265.63 | $32.24 | 3.25 | 2.29% | $1.41 | 38 | 1 | $225.00 | $265.63 |
| (remaining 13 ad sets) | RET, Whiteboard - AI, westonprice-dc, LAL1 Buyers, Stack_IncShop, TARGET AUDIENCES (BULK) … | $1,523.81 | — | — | — | — | — | 1 | $274.98 | — |

**The four "Cold_US_35-65" ad sets combined:** $1,634.67, 9 purchases, **$181.63 per purchase**.

### 3.5 Monthly Meta trend

| Month | Spend | Impr | Link clicks | LPV | Pixel purchases | Value | Cost / purchase |
|---|---|---|---|---|---|---|---|
| 2026-05 | $412.54 | 20,459 | 276 | 75 | 1 | $59.94 | $412.54 |
| 2026-06 | $0 | — | — | — | — | — | — |
| 2026-07 | $1,708.11 | 45,761 | 871 | 759 | 10 | $880.78 | $170.81 |
| 2026-08 | $2,064.98 | 47,148 | 1,171 | 663 | 8 | $965.19 | $258.12 |
| 2026-09 | $4,237.66 | 90,986 | 1,457 | 337 | 28 | $3,382.15 | $151.35 |
| 2026-10 | $2,956.38 | 71,924 | 856 | 505 | 9 | $969.12 | $328.49 |
| 2026-11 (1–9) | $664.34 | 17,533 | 267 | 230 | 2 | $673.03 | $332.17 |

### 3.6 Top ads by spend — 30d, with destination URL

| Ad | Ad set / campaign | Destination URL | Spend | CPM | Link clicks | CTR | CPC | LPV | ATC | Purchases | Value |
|---|---|---|---|---|---|---|---|---|---|---|---|
| NoJunk | Cold_US_35-65 / Kit | marketing.zeotein.com/starter-kit-page | $345.15 | $54.93 | 72 | 1.15% | $4.79 | 60 | 4 | 1 | $76.99 |
| car breakfast | Cold_US_35-65 / Sticks | marketing.zeotein.com/stick-packs | $231.42 | $48.92 | 58 | 1.23% | $3.99 | 49 | 5 | 0 | — |
| AD1_V2_Unboxing | AD1_Cold_US_35-65 / Q4_AD1 | try.zeotein.com/ | $128.49 | $38.57 | 28 | 0.84% | $4.59 | 17 | 2 | 1 | $76.99 |
| AD1_01_SixIngredients | AD1_Cold_US_35-65 / Q4_AD1 | try.zeotein.com/ | $126.95 | $47.78 | 33 | 1.24% | $3.85 | 30 | 0 | 0 | — |
| AD1_01_SixIngredients | Cold_US_35-65 / Cacao | **zeotein.com/products/cacao** | $126.66 | $34.21 | 31 | 0.84% | $4.09 | 23 | 9 | 1 | $68.57 |
| AD1_04_Unboxing | Cold_US_35-65 / Cacao | facebook.com/reel/2431858647619239 (video; CTA URL not exposed) | $116.11 | $35.40 | 40 | 1.22% | $2.90 | 36 | 6 | 0 | — |
| **AD1_V2_Unboxing** | Cold_US_35-65 / Cacao | **zeotein.com/products/cacao** | $108.21 | $25.92 | 37 | 0.89% | $2.92 | 34 | 9 | **3** | **$762.38** |
| AD1_04_Unboxing | AD1_Cold_US_35-65 / Q4_AD1 | facebook.com/reel/1597893911274481 (video) | $106.77 | $51.78 | 25 | 1.21% | $4.27 | 19 | 1 | 1 | $85.65 |
| AD01 - Static \| NP1 \| F | Statics F / Old_Try | try.zeotein.com/ | $106.02 | $58.57 | 17 | 0.94% | $6.24 | 12 | — | 0 | — |
| Whiteboard CLEAN TRY | Whiteboard - AI | try.zeotein.com/ | $94.63 | $30.19 | 25 | 0.80% | $3.79 | 22 | 1 | 0 | — |
| Image V2 | Cold Protein 25-60 | try.zeotein.com/ | $91.55 | $40.24 | 17 | 0.75% | $5.39 | 13 | — | 0 | — |
| color block | Cold_US_35-65 / Sticks | marketing.zeotein.com/stick-packs | $91.47 | $29.51 | 18 | 0.58% | $5.08 | 13 | — | 0 | — |
| 6 Ingredients | Cold_US_35-65 / Kit | marketing.zeotein.com/starter-kit-page | $87.79 | $61.05 | 28 | 1.95% | $3.14 | 22 | — | 0 | — |
| Image V1 | Cold Protein 30-60 | try.zeotein.com/ | $74.90 | $53.12 | 19 | 1.35% | $3.94 | 13 | 1 | 0 | — |
| AD10-wapf-dc-28-kitchen | westonprice-dc | try.zeotein.com/ | $65.60 | $73.46 | 4 | 0.45% | $16.40 | 3 | — | 0 | — |
| AD2 | TARGET AUDIENCES (BULK) / oSUBSCRIBE | go.zeotein.com/s/zeotein-offer-home | $57.51 | $40.50 | 85 | 5.99% | $0.68 | 77 | — | 0 | — |
| AD1_V1_WhatYouGet | AD1_Cold_US_35-65 / Q4_AD1 | try.zeotein.com/ | $57.24 | $37.14 | 11 | 0.71% | $5.20 | 12 | — | 0 | — |
| sticky notes | Cold_US_35-65 / Sticks | marketing.zeotein.com/stick-packs | $55.03 | $35.16 | 10 | 0.64% | $5.50 | 8 | 7 | 1 | $149.98 |
| Volcano video 1 | Cold Protein 30-60 | facebook.com/reel/… (video) | $45.19 | $52.30 | 14 | 1.62% | $3.23 | 10 | 1 | 0 | — |
| AD1NATURALLY | TARGET AUDIENCES (BULK) / oSUBSCRIBE | go.zeotein.com/s/zeotein-offer-home | $45.14 | $23.49 | 59 | 3.07% | $0.77 | 57 | — | 0 | — |

**Results grouped by destination, 30d:**

| Destination | Ads | Spend | Share of spend | Link clicks | LPV | Pixel ATC | Purchases | Value | Cost / purchase | ROAS |
|---|---|---|---|---|---|---|---|---|---|---|
| **zeotein.com/products/cacao (store product page)** | 4 | **$259.69** | 11% | 71 | 60 | **18** | **4** | $830.95 | **$64.92** | **3.20** |
| try.zeotein.com | 14 | $857.12 | 37% | 167 | 133 | 5 | 2 | $189.07 | $428.56 | 0.22 |
| marketing.zeotein.com/starter-kit-page | 3 | $433.87 | 19% | 100 | 82 | 4 | 1 | $76.99 | $433.87 | 0.18 |
| marketing.zeotein.com/stick-packs | 3 | $377.92 | 16% | 86 | 70 | 12 | 1 | $149.98 | $377.92 | 0.40 |
| facebook.com/reel (video creatives; CTA URL not exposed) | 5 | $304.52 | 13% | 88 | 74 | 8 | 1 | $85.65 | $304.52 | 0.28 |
| go.zeotein.com/s/zeotein-offer-home | 3 | $104.63 | 4% | 145 | 136 | **0** | **0** | $0 | — | 0 |

Within the same ad set (`Cold_US_35-65_Purchases`, launched Oct 20), the store product page delivered 4 purchases on $259.69. The two marketing.zeotein.com pages delivered 2 purchases on $811.79. The sample is small and attribution is pixel-based, but the difference is about 6×.

### 3.7 Age split — 90d

| Age | Spend | CPM | Link CTR | LPV | Purchases | Value | Cost / purchase | ROAS |
|---|---|---|---|---|---|---|---|---|
| 65+ | $3,468.76 | $62.10 | **2.05%** | 445 | **21** | $2,503.36 | **$165.18** | 0.72 |
| 55–64 | $2,970.01 | $48.14 | 1.62% | 439 | 13 | $1,552.38 | $228.46 | 0.52 |
| 45–54 | $1,755.82 | $39.32 | 1.22% | 234 | 7 | $1,125.01 | $250.83 | 0.64 |
| 35–44 | $909.83 | $30.36 | 0.99% | 102 | 4 | $549.12 | $227.46 | 0.60 |
| 25–34 | $352.17 | $26.40 | 1.73% | 53 | 1 | $145.95 | $352.17 | 0.41 |
| 18–24 | $16.59 | $17.12 | 1.24% | 1 | 0 | — | — | 0 |

---

## 4. Blended economics — cost per new customer by channel

| Channel | 90d spend | Platform purchases | Platform CPA | Platform ROAS | GA4 last-click 1st-time purchasers | Spend ÷ GA4 new customer | 30d spend | 30d platform CPA | 30d GA4 1st-time | 30d spend ÷ GA4 new cust. |
|---|---|---|---|---|---|---|---|---|---|---|
| Google Ads — all | $4,250.02 | 37 | $114.87 | 0.90 | 31 | $137.10 | $1,405.10 | $281.02 | 7 | $200.73 |
| Google: brand search | $927.67 | 13 | **$71.36** | 1.94 | 12 | $77.31 | $126.09 | **$63.05** | 2 | $63.05 |
| Google: non-brand (PMax + Shopping + NB Search) | $3,322.35 | 24 | $138.43 | 0.61 | 19 | $174.86 | $1,279.00 | **$426.33** | 5 | $255.80 |
| Google: Search_NB_Sales | $168.42 | 0 | — | 0 | 0 | — | $168.42 | — | 0 | — |
| Meta | $9,473.29 | 46 (pixel, 7d click / 1d view) | $205.94 | 0.62 | 4 (GA4 undercounts; see §2.4) | $2,368.32 | $2,337.75 | $259.75 | 3 | $779.25 |
| **Blended: all ad spend ÷ all GA4 first-time purchasers** | **$13,723.31** | — | — | MER 1.34 | **125** | **$109.79** | **$3,742.85** | — | **29** | **$129.06** (MER 1.08) |

**Monthly blended view:**

| Month | Google spend | Meta spend | Total | GA4 1st-time purchasers | Spend ÷ new customer | MER |
|---|---|---|---|---|---|---|
| Jun | $1,356.65 | $0 | $1,356.65 | 16 | $84.79 | 1.66 |
| Jul | $1,824.86 | $1,708.11 | $3,532.97 | 42 | $84.12 | 1.57 |
| Aug | $1,032.27 | $2,064.98 | $3,097.25 | 38 | $81.51 | 2.21 |
| Sep | $1,719.12 | $4,237.66 | $5,956.78 | 64 | $93.07 | 1.36 |
| Oct | $1,506.96 | $2,956.38 | $4,463.34 | 29 | **$153.91** | **0.79** |
| Nov 1–9 | $469.66 | $664.34 | $1,134.00 | 7 | **$162.00** | 1.05 |

**Average order value:** GA4 overall $136.18; brand search $138.58; Z_Shopping_SI $57.16; Meta pixel $127.74.

The recurring $76.99 purchase value matches the "First month $76.99" starter offer. At a $110–$130 blended CAC, a customer needs at least two paid months to pay back.

---

## 5. Google Merchant Center

**Not available.** Both the `diagnostics` and `merchant_performance_view` queries returned `LICENSE_DATA_SOURCE_NOT_AVAILABLE`: "Google Merchant Center (GMC) is not available in your license 1881884 on team Team Zeotein".

Item-level disapprovals and issue codes could not be pulled. Indirect evidence of policy restriction comes from Google Ads instead:

- Brand campaign: `HAS_ADS_LIMITED_BY_POLICY`
- Both PMax feed campaigns: `HAS_ASSET_GROUPS_LIMITED_BY_POLICY`
- Demand Gen ads: "Approved (limited)", 0 impressions

Check item status directly in Merchant Center under Products → Needs attention.

---

## 6. Analysis

### (1) Why Google search isn't producing sales

| Factor | Verdict | Evidence |
|---|---|---|
| **Demand / impressions** | **Major** | Brand demand is tiny (detail below). Non-brand search reach is tiny. |
| **Click quality / intent** | **Major** | Non-brand and Shopping queries are generic, informational, competitor or foreign-language. The brand campaign leaks into non-brand terms. |
| **Landing page** | **Major (non-brand search and Meta)** | Off-store pages leak most clicks before the store, and every scored non-brand keyword has a "Below average" landing page experience. |
| **Policy (zeolite)** | **Confirmed, partial** | The policy flags are confirmed and the core blends get little Shopping visibility, but the limit is partial (detail below). |
| **Tracking** | **Major (for decisions), minor (for Google bidding)** | Google purchase tracking works on the store, but GA4 is blind to the off-store pages and polluted by internal traffic. |
| **Offer / price** | **Contributing** | Premium-priced blends are shown to shoppers comparing commodity ingredients. |

**Demand / impressions:**

- The search term "zeotein" got **221 impressions in 90 days** (about 2.5 a day).
- In the last 30 days the brand campaign captured 83.8% impression share and got only 100 impressions.
- Organic search brings about 4.8 sessions a day, mostly to the homepage.
- Search_NB_Sales: 2,391 impressions in 90 days, 10.0% impression share, losing 30.3% to budget ($10/day) and 67.9% to rank ($2 CPC ceiling, QS 1–4).

**Click quality / intent:**

- Search_NB_Sales: 148 clicks produced **0 add-to-carts and 0 purchases** (lifetime $332.21, 0 purchases).
- Queries are generic or informational ("protein powder", "what is protein powder made of") or competitor names (huel, truvani, ensure).
- In Shopping, single-ingredient commodity queries dominate ("zeolite" 4,061 impressions, "cacao powder" 2,094, "cocoa powder", "mct oil"). Non-English queries took 144 clicks for $79.74 with 0 purchases.
- Brand broad match leaked $152.97 into "healthycell", "pure astaxanthin", "zein" and "bicarb" ($10.20 a click, 0 purchases). The broad keyword "zeotein" cost $468.54 for 1 purchase, while phrase "zeotein" (QS 10) cost $397.15 for 11.

**Landing page:**

- 97% of Search_NB_Sales clicks went to marketing.zeotein.com. Only about 14 of 148 clicks reached a tracked store page view.
- Every scored non-brand keyword has a "Below average" landing page experience, which suppresses Ad Rank.
- Brand clicks to the zeotein.com homepage convert **6.6% of clicks to purchase** (13 / 196).
- On Meta in the last 30 days, the store PDP cost **$64.92 per purchase**. try., marketing. and go. pages cost **$378–$434 per purchase**, or no purchases at all.

**Policy (zeolite):**

- Confirmed: Brand `HAS_ADS_LIMITED_BY_POLICY`; both PMax feed campaigns `HAS_ASSET_GROUPS_LIMITED_BY_POLICY`; the Demand Gen campaign is "Approved (limited)" with 0 impressions.
- The core blends got only **14.4% of feed impressions** (48,776 of 338,702) and 3 purchases on $722.86. The flagship Cacao 30-day stick SKU had only 4,347 impressions in 90 days.
- The limit is not a full block: the single-ingredient Zeolite Powder is the #1 served item (40,969 impressions, 7.1 purchases).
- The RSAs include headlines such as "Sea Moss & Zeolite Detox", "Zeolite: Natural Binding Mineral" and "Daily Detox Support", which are likely triggers.
- GMC item status could not be verified (not licensed).

**Tracking:**

- Google purchase tracking works on the store (Shopping App Purchase). It cannot see purchases that start on marketing./go. pages unless users carry the gclid through.
- GA4 has **no data from marketing.zeotein.com or go.zeotein.com**, sees about 7% of Meta clicks, and loses attribution at the hand-off through hard-coded UTMs.
- GA4 is polluted by Shopify-admin and QA sessions (October ATC 961 is mostly noise) and by 3 localhost test purchases.
- Paid Shopping URLs carry `utm_campaign=sag_organic`.
- Z_Shopping_SI bids on value with only 3 purchases.
- The missing UTMs on Google before about Oct 23 mostly affect non-GA4 tools; GA4 attribution still works through gclid.

**Offer / price:**

- Blends sell for $109.99–$139.99 per 30 servings ($3.67–$4.67 a serving) and appear next to commodity powders.
- Blend Shopping CTR is 0.48%, and 3 of 234 blend clicks purchased.
- Single-ingredient Shopping sales are low-ticket: AOV $57.16 against $162.79 per purchase, so even the successes lose money (ROAS 0.35).
- The 7-day starters ($39.99 tier) did not convert cold Shopping traffic either: Vegan 7-day had 1 purchase on $129.81, Cacao 7-day 1 on $151.43.

**Why people aren't buying** (mobile funnel, the cleanest data):

- Only **10.8% of sessions add to cart**, but **70.8% of checkouts complete**. The problem is product-page persuasion and offer for cold traffic, not checkout.
- Warm traffic converts well: email 7.05%, brand search 4.94%, direct 3.45%.
- Cold paid traffic does not: Paid Shopping 0.43%, PMax 1.50%.
- **September's peak was promotion-led:**
  - The Labor Day sale page and the "stockupweek" email (10 purchases, $2,887.74).
  - Direct purchases (42), which collapsed to 7 in October once promotions ended.
  - The October 22 switch from PMax (21 purchases in 90 days) to Standard Shopping (3 purchases since).

### (2) Is paid traffic converting anywhere?

**Yes, in a few places:**

- **Google brand search:** $71.36 per purchase over 90 days, $63.05 over 30 days. Close to the ≤ $60 target, but it is not new-customer acquisition.
- **The (paused) PMax Feed_Only campaign:** $91.83 per purchase, some of it brand capture through final URL expansion to the homepage.
- **Meta ads that send people straight to the store PDP:** the Z_I_Cacao_Cold_Purchases_102026 campaign cost $94.18 per purchase (ROAS 2.21), and its PDP ads alone cost $64.92.
- **Meta age 65+:** $165.18 per purchase, the best age band.

**Blended cost per new customer:** $109.79 over 90 days and $129.06 over 30 days (red zone above $90).

- Platform CPA: Google all $114.87 (90d) / $281.02 (30d); Google non-brand $138.43 / $426.33; Meta $205.94 / $259.75.
- GA4 last-click: paid channels produced 35 of 125 first-time purchasers in 90 days.

### (3) Biggest wasted spend (90d unless noted)

1. **Meta zero-purchase campaigns: $1,253.02** across 8 campaigns. Two are still ACTIVE:
   - CONVERSIONS oSUBSCRIBE: $104.63, 145 clicks, 0 ATC, go.zeotein.com
   - cold-meta-sales-westonprice: $149.55, CTR 0.47%, $14.96 CPC
2. **Meta one-purchase campaigns at more than $300 each: $1,590.49** for 4 purchases:
   - BRTV: $465.73
   - Kit (marketing.zeotein.com): $432.94
   - Sticks (marketing.zeotein.com): $377.92
   - Volcano_Cold-Protein_091726: $313.90
3. **Meta Z_I_Old_Try_10.1.26: $3,033.23.** It produced 18 purchases at $168.51, nearly 3× the target CAC, and only 5% of its link clicks produced a landing page view.
4. **Google zero-purchase campaigns: $680.63.**
   - Z_Shopping_Blends: $313.08
   - PMax Single_I: $199.13
   - Search_NB_Sales: $168.42 (lifetime $332.21)
   - Also, Z_Shopping_SI since Nov 1: **$238.63, 464 clicks, 0 purchases**.
5. **Brand broad-match leakage: $152.97** on non-brand queries. The broad "zeotein" keyword cost $468.54 for 1 purchase.
6. **Feed items with no conversions:**
   - Zeotein Cacao Bulk 30-serving: $277.49, 94 clicks, 0 purchases
   - Fermented Cacao powders in Z_Shopping_SI: $140.63, 280 clicks, 0 purchases
   - Non-English Shopping queries: about $80 visible

### (4) Five prioritized recommendations

None of these were executed.

1. **Fix measurement before spending more (this week, low cost).**
   - Install GA4 (535557069) and the Google tag on marketing.zeotein.com, go.zeotein.com and try.zeotein.com, or rebuild those pages inside Shopify, with cross-domain measurement.
   - Pass inbound UTMs, gclid and fbclid through on hand-off links instead of hard-coding `howie/landing_page`.
   - Add GA4 internal-traffic and unwanted-referral rules (admin.shopify.com, clickup, automator, 127.0.0.1) and move QA to a dev store.
   - Remove `sag_organic` UTMs from paid Shopping URLs.
   - Fix the UTM template on CONVERSIONS oSUBSCRIBE.
   - Without these fixes, about 93% of Meta clicks and 97% of non-brand Google clicks can't be followed to a sale.
2. **Send paid traffic to the store product page, not the off-store pages.**
   - Meta in the last 30 days: PDP $64.92 per purchase (ROAS 3.20) against $378–$434 on marketing./try. pages. Store pages also earn better Quality Scores than the "Below average" off-store pages.
   - Repoint Search_NB_Sales to zeotein.com/products/cacao (or a Shopify landing page) or pause it. It has spent $332 lifetime with 0 purchases and 0 add-to-carts.
3. **Stop the Google leaks and protect brand.**
   - Pause broad "zeotein" (1 purchase on $468.54). Keep phrase and exact (QS 10, 11 purchases on $397.15).
   - Add negatives for the leaking non-brand and competitor terms ($152.97) and for informational and foreign-language queries (about $121 visible).
   - Set language targeting to English.
   - Cap brand CPC: $4.07–$4.84 for the brand's own name is high.
   - Restrict Z_Shopping_SI to items with purchase history (Zeolite 1/2 lb and 1 lb, Pumpkin 2 lb) or pause it: $238.63 and 0 purchases since Nov 1.
4. **Make the core Cacao blend eligible before relaunching blends or PMax.**
   - Run the compliance scrub on feed titles and descriptions, RSA assets and the PDP.
   - Remove detox and binding claims, for example "Sea Moss & Zeolite Detox", "Zeolite: Natural Binding Mineral" and "Daily Detox Support".
   - Request policy review, and check item status in Merchant Center directly (not licensed in Supermetrics).
   - Blends got 14% of feed impressions and 3 purchases on $723. Relaunching Blends or PMax before this is fixed will repeat that result.
   - Confirm whether the Vegan blend contains zeolite. If it doesn't, it may be the cleaner product to lead Google with.
5. **Consolidate Meta to what has worked, under strict kill rules.**
   - Run one sales campaign with the proven creative (AD1_V2_Unboxing → PDP: 3 purchases on $108.21) sending people to the PDP.
   - Weight budget toward ages 55+ (65+ costs $165 per purchase against $227–$251 for 35–64).
   - Turn off the two active zero-purchase campaigns (oSUBSCRIBE, westonprice).
   - Kill any ad set that spends $90 (the team's red line) with 0 ATC.
   - CPM ($42–$46) and link CPC ($2.93–$3.56) are 2.4–3× target, so refresh creative and test broader or Advantage+ audiences.
   - Judge results on GA4/Shopify first-time purchasers once item 1 is done, not on pixel purchases alone.

---

## 7. Query log and failures

- **GMC:** both queries failed with `LICENSE_DATA_SOURCE_NOT_AVAILABLE` (license 1881884).
- **GA4 property 535580236:** returned 0 rows for 90 days. All GA4 figures come from 535557069.
- **Google Ads search terms:** the first pull hit the 1,000-row cap. It was re-run with a filter of `Cost > 0` (379 rows, complete) and aggregated by term and campaign.
- **Google asset-level policy topics** (AdGroupAdAssetView / AssetGroupAsset): the fields returned empty values, so policy evidence uses campaign primary-status reasons and ad approval status instead.
- **Meta "Destination URL" for video creatives** returns the reel permalink rather than the CTA link. The actual landing URL for those ads is not exposed by this field.
- **Search-term intent categories** (§1.6) were assigned by keyword heuristics, so treat them as approximate.
