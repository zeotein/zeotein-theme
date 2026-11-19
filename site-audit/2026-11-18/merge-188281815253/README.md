# Merge into theme #188281815253 (18 to 19 Nov 2026)

Theme #188281815253 "Live + FAQ, gifts and Difference page (Claude)" was copied from live at 18 Nov 21:14 UTC by the
session "Zeotein Shopify store updates" (session_01D28uka3n5Xr6f5Ds76C7Vz). It did not hold the five files Dana approved
on 18 Nov in theme #188242723029 "Live + fixes 2026-11-18 (sticky bar line, Claude)". Whichever theme is published last
decides what is live, so both copies need the five files. The other session agreed (19 Nov 00:02 UTC) and asked this
session to copy them in with themeFilesUpsert, since theme_commit does not work for it there and its workspace holds a
pending test edit (snippets/zt-commit-test.liquid) that a theme_commit would also save.

| File | Source (byte-exact, md5) | Change on the way in |
|---|---|---|
| snippets/zt-buybox-tidy.liquid | verify/live-paste/snippets/zt-buybox-tidy.liquid, 277274bc | none (sticky bar without the guarantee line) |
| sections/_blocks.liquid | verify/live-paste/sections/_blocks.liquid, 6917fec6 | none |
| snippets/section.liquid | verify/live-paste/snippets/section.liquid, a9a303a6 | none |
| snippets/util-palette-hover-shift.liquid | verify/live-paste/snippets/util-palette-hover-shift.liquid, 865a9c91 | none |
| templates/page.zt-chooser-blends.json | this folder | `"faq_set": "none"` on the `chooser` section, so /pages/protein-blends shows one FAQ (the `blends_faq` block, which in that theme renders the 12 single-source questions with FAQPage schema) instead of two |

Everything else in the template is identical to the approved version (same sections, order and settings).
The other session's own files (sections/zt-blend-chooser.liquid, blocks/faq.liquid, sections/zt-pdp-faq.liquid,
blocks/zt-home-choose.liquid, assets/zt-guides-cart.js, the zt-diff and zt-faq files) are not touched.
Theme #188242723029 is not changed.
