# Vegan Black Friday prices matched to Cacao stick packs (19 Nov 2026)

Dana, 8:00 AM CT: "So Black Friday and regular prices, the vegan are going to match whatever the cacao stick packs prices were."

## Regular prices: already matched (no change)
These were read live from Shopify on 19 Nov:

| | Vegan 30 sticks | Cacao 30 sticks |
|---|---|---|
| One-time | $134.99 | $134.99 |
| Subscribe | $114.99 | $114.99 |
| Starter Kit | $91.99, then $114.99 | $91.99, then $114.99 |
| 7 sticks | $39.99 | $39.99 |

Existing Vegan subscribers stay at the price they signed up at (Dana, 18 Nov). No Seal plan was touched. Protected plans 6596853973 and 4659019989 are Cacao bag plans and were not involved.

## Black Friday one-time: changed to match Cacao

| Packs | Vegan before | Vegan now = Cacao | Shopify discount (one-time only, 24 Nov 12:00 AM to 30 Nov 11:59 PM CT) |
|---|---|---|---|
| 1 | $92.99 | **$94.49** | BF Vegan Sticks 1 pack: $42.00 off, now $40.50 off |
| 2 | $179.99 | **$183.99** | BF Vegan Sticks 2 packs: $89.99 off, now $85.99 off |
| 3 | $260.99 | **$266.99** | BF Vegan Sticks 3 packs: $143.98 off, now $137.98 off |
| 4 | $335.99 | **$343.99** | BF Vegan Sticks 4 packs: $203.97 off, now $195.97 off |

The "before" prices came from the old dollar amounts, which were set against the old $139.99 price. The Master Pricing doc had $97.99, $189.99, $275.99 and $355.99.

The Cacao amounts were read from:
- "BF Cacao Sticks 2 to 4 packs": $85.99, $137.98 and $195.97 off;
- the 1-pack 30% offer: $134.99 x 0.70 = $94.49.

## Where it was changed

| Place | Change | Verified |
|---|---|---|
| Shopify automatic discounts, IDs in BACKUP-vegan-bf-discounts-before.json | Amounts above. Title, dates, product, one-time-only setting, minimum quantity and combinations unchanged | Read back 19 Nov: all four SCHEDULED, with the new amounts |
| Black Friday draft theme #187825914069, snippets/zt-bf-blend-price.liquid | vegan_off '4200,8999,14398,20397' to '4050,8599,13798,19597', and the 2 and 3 pack note on line 86 (8999 to 8599, 14398 to 13798). Theme commit cbe952e0 | md5 c00b4a1b on Shopify. No other file still has the old amounts |
| Live theme #188199928021, snippets/zt-bf-blend-price.liquid | **Needs a paste**: Claude cannot write the live theme. It is step 18 of site-audit/2026-11-19/live-paste-all/. The file is live-paste/snippets/zt-bf-blend-price.liquid (md5 7009330d), the live file (a99c6fc3) with one line changed | Today the live Vegan page's hidden Black Friday table shows $92.99, $179.99, $260.99 and $335.99. After the paste it shows $94.49, $183.99, $266.99 and $343.99 |
| Master Pricing doc (Google Doc 1BQXOG1VxukcRLGUrYpqc5lpqVsEyk7g0doZKc1Q-1ZA) | Vegan BF one-time cells set to the new prices. The Cacao 1-pack cell went from $94.50 to $94.49, the amount Shopify charges. The "still to recheck" note was replaced with a dated 19 Nov update | Read back: one change each |

## Still open (Dana)
- **Nov 24 cart test** ("Test Black Friday carts", 6:15 AM CT, tied to the LenovoPro computer). It still expects Vegan at $97.99, $189.99, $275.99 and $355.99, and it says "Fix anything off", so it could undo this. It can only be edited from that conversation. The Vegan line should read $94.49 / $183.99 / $266.99 / $343.99.
- **Black Friday subscription offer.** The Cacao sticks also get "BF Subscribe: 30% off first month", 27 to 30 Nov. Vegan does not, per Dana on 17 Nov ("no Vegan subscription discount"). Match Cacao there too?
- **Black Friday Starter Kit.** Cacao has a Black Friday kit product at $75.99; Vegan has none.
- **Funnel spec.** The Vegan Starter Kit prices for 2 to 4 packs in the funnel table ($189.99, $279.99, $364.99) differ from Cacao ($179.99, $264.99, $344.99). The Vegan funnel price is still an open decision, so they were left alone.
