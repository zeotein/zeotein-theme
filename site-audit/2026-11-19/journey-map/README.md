# Customer Journey Map: 19 Nov deliverability update

Published to the existing map (https://claude.ai/artifact/TZgCUzBfP5Wtri9sfR7g5R) as version 160 (version id 1795096301-6f1e).
It was built on version 1795058439-dfd0. The published data block was read back and is byte-identical to `index.html` in this folder.

The update used read-only GoHighLevel calls (`get-email-template`) and nothing else. No template, workflow, send or contact was changed.

## What changed on the map

### 46 templates from the deliverability pass
These are the 47 card entries for the 46 templates (HG01 appears twice). The source is a GoHighLevel read-back of 19 Nov 2026, 13:12 UTC.

| Check | Result |
|---|---|
| Sender | All 46 send as Dana at Zeotein from support@mail.zeotein.com |
| Outside font | None of the 46 links one |
| Content links | 0 to 2 each |
| Renders | Already matched, so no render files changed |

- 40 renders were pixel-identical.
- G201, G302, HG01, HG02, HG03 and HGW01C use images from files.leadconnectorhq.com, which this sandbox blocks. All their text and layout matched.

Card corrections:
- **SUB D4, D7, D10, D27 (Cacao and Vegan):** the inline guide link became bold text, and the link lists now match the email.
- **PS01, PS03, PS04:** bodies rebuilt from the email.
- **G201 and G302:** new subject and preview.
- **HG01 and HGW01C:** the header logo link was added.
- **HG02 and HG03:** body text now matches the email word for word, and the sender note was corrected.
- **All 47 entries:** an evidence sentence was added.

Details per template are in `render_check_46.tsv`.

### Flow notes corrected
- **Paused subscribers (PS):** the note said all sends go out "as Zeotein Team". It now says the three emails send as Dana at Zeotein since the 19 Nov pass.
- **Quiz (QZ):**
  - The note now says 27 of the 36 emails were in the pass.
  - EMAIL 8, 11 and 12 in all three branches were not in the pass. They still send as Team Zeotein and load the Google font.
  - Those 9 cards carry the same line.
- **BF and SBF (Black Friday, Nov 24 to 30):** the notes now say none of the 10 emails were in the pass. All 10 still send as Team Zeotein and load the Google font. BF01, BF03, BF05 and BF06 have 8 links and 11 images each.

The figures for these 19 emails are in `sender_check_not_in_pass.tsv`. That table was read 19 Nov.

The "19 Nov" bar at the top of the page also changed: "one or two links" now reads "at most two links", because G201 has no content link.

## Open points found while checking (not changed here)
1. **10 Black Friday emails:**
   - All 10 send as Team Zeotein, while the nurture flows now send as Dana at Zeotein.
   - All 10 load Google Fonts (Inter and Poppins).
   - BF01, BF03, BF05 and BF06 carry 8 links and 11 images.
   - The 19 Nov bar says sale campaigns were left out on purpose. Whether to bring them in line before Nov 24 is Dana's call.
   - The /bf link redirects to /products/30-day-cacao-bulk-bag-black-friday, which returned 200 on 19 Nov.
2. **Quiz EMAIL 8, 11 and 12 (9 emails):** a quiz lead gets Dana at Zeotein for emails 1 to 7, 9 and 10, then Team Zeotein for 8, 11 and 12.
3. **G201 and G302:** the HTML title, the hidden preheader and G201's headline still use the old wording. Only the subject and preview fields changed.
4. **QZP04, QZA05 and QZB05:** they say the recipe guide has more combinations, with no link. The quiz Email 1s still link the June guide PDFs.
5. **Renders still show headings in Poppins.** The 46 emails no longer load that font, so inboxes show the fallback font.
