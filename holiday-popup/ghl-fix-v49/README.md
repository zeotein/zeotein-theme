# v4.9: mobile clipping fix for the Starter Kit A/B landers (Nov 13)

**Funnel:** "Cacao Starter Kit · New Customers · $89.99 Renewal A/B (2)" (`MNvNiNR6MDZ07kBRF1xd`). **Pages:** go.zeotein.com/starter-kit-offer (A/B split).

**Install** (funnel Settings → Head tracking code only; do not open or publish the page builder):
1. Delete the whole v4.8 block: its comment, `<style id="zeotein-holiday-popup-skin-v48-css">` and `<script id="zeotein-holiday-popup-skin-v48">`.
2. Paste `v4.9-block-paste-in-place-of-v4.8.html` in its place, at the very end.
3. Everything above it stays byte-identical: Meta pixel, #zeotein-pink-cta, #zeotein-holiday-popup-fix, v4, v4.1 and v4.7. `head-tracking-full-after-fix.html` is the complete expected result.

**Cause:**
- v4.7 caps the mobile sheet at 75dvh. Inside it, the form area scrolls on its own, under a 128px art panel.
- v4.8 raised the art panel to 184px, which left the form area about 180px tall.
- On a 390x664 phone the button sat at 692-736px, below the screen, and only an inner scroll could reach it.

**Fix:**
- Art panel back to 128px.
- Mobile sheet cap raised to 92dvh (the v4 value).
- Desktop is unchanged.

**Verified (unsaved preview, v4.8 swapped for v4.9 in the browser, no submit):**
- A and B at 390x664: button at 570-614px, no inner scroll needed.
- A and B at 360x640: button at 546-590px.
- The tap target at the button's centre is the button.
- Full page scrolls to the bottom on A and B.

`probe_live.js` reproduces the check:

```bash
node probe_live.js https://go.zeotein.com/starter-kit-offer-a tag 390 664 v49.css
```

The final argument is a CSS file to swap in for v4.8 (extract it from the v4.9 block). Leave it off to test the live page as it is.
