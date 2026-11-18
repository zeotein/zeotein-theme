# Replacing "Simplify your daily routine." on the Cacao landing pages (18 Nov 2026)

Dana (18 Nov, iPhone, Black Friday preview): not a fan of this section, especially "Six named ingredients". Wants a visual of
something better; it can look completely different.

**Where it is:** section `daily_routine_cacao_lp_FbdPWk` (`sections/daily-routine-cacao-lp.liquid`), 5th on the page.
- Black Friday landing page `/products/30-day-cacao-bulk-bag-black-friday` (template `product.cacao-lp-bf.json`, BF theme).
- Live landing page `/products/cacao-protein-starter-kit` (template `product.cacao-lp.json`), same section, slightly different text.

**Why it reads weak:** it repeats what the page already says five more times. "23g protein" and "14g collagen" are in the hero
chips, the ticker, this section, Nutrition Gaps, One Serving and the comparison table; "six named ingredients" is here, in
Nutrition Gaps, in What's Inside and in the comparison. Nothing above the FAQ answers how it tastes, which is the first
question about a bone broth and collagen chocolate protein (two verified reviews on the bag page: "I don't like the taste",
"Takes a little getting use to").

The current section is heading + 4 icons + bag photo. The price and button in Dana's screenshot are the phone sticky offer
bar, so the options carry no button or price of their own.

| Option | Angle | Look | Photo | iPhone height |
|---|---|---|---|---|
| 1 Taste (recommended) | How it tastes, 4 ways to drink it, one verified review | warm cream, purple review card | `cacao_3.png` (bag, shake, cacao) | 1,341 px |
| 2 Routine | 3 steps using the kit's shaker and Save-A-Scoop, one verified review | lavender, numbered steps | `zeotein-cacao-starter-kit.webp` | 1,027 px |
| 3 Customers | 3 verified buyers on how they drink it, "Rated 4.9 stars by verified buyers" | dark purple, quote cards | `one_simple_daily_routine_drinking.png` | 1,182 px |

Current section: 817 px on iPhone.

**Copy sources (nothing invented):** label (Total Sugars 0 g, read from the bag page), What's Inside card ("Never alkalized"),
product description (two scoops into 10 to 12 oz of water, milk or a milk alternative; smoothie; coffee; the Save-A-Scoop
hooks to the bag), kit contents, homepage heading "Made for Real Life.", and verbatim verified Judge.me reviews on
`/products/zeotein-cacao-bag-30` (Elsie Unruh, Rita L Mord Sanders, Alice Clark; shown as first name + last initial like
the page's other reviews).

**Checks:** compliance pre-scan (zeotein-compliance-scrub `prescan.py`) 0 CRITICAL, 0 HIGH, 0 MEDIUM on all three; no em
dashes, no "zeolite", no "complete protein", no detox words; no tub count (4 Nov rule); bag photos shown whole, never
cropped (10 Nov rule).

**Files:** `option-*.html` (drop-in markup), `render.js` (renders each option inside the real BF landing page on iPhone 13
and desktop 1440, preview only), `renders/` (current + 3 options, both devices, plus `compare-iphone.jpg` and
`compare-desktop.jpg`).

**Not done yet:** nothing is changed in any theme. Once Dana picks, it is built as a proper section (editable in the theme
editor) on the Black Friday theme, and for the live landing page either in theme #188242723029 before it is published or
as a paste.
