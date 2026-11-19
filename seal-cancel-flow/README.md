# Seal cancel flow (zeotein.com/a/subscriptions)

Status 18 Nov 2026: built and tested on a phone-sized test page that runs the real script. **Not installed on any Shopify theme yet.** Needs Dana's yes plus one test-subscriber login to check Seal's live markup (see "Install").

## The flow

| Screen | What shows | Words |
|---|---|---|
| 1 | Seal's own reason question, kept. Reason labels Seal should use: I have too much product / I'm not loving the taste / It costs too much right now / Something else | 24 incl. Seal's button |
| 2 | "Thanks for telling us" + one line + Dana's video (plays on its own, muted, captions on) + Continue + a small cancel link | 20 |
| 3 too much | "Get it less often": Every 6 weeks / Every 8 weeks | 35 |
| 3 taste | "Try it a new way": Cacao recipes / Vegan recipes (the same PDF guides the SUB emails link) | 34 |
| 3 money | "Skip your next delivery": Skip next delivery | 34 |
| 3 other | "Pause instead": Pause my subscription | 31 |

Every screen 3 ends with the rewards line and one clear "Cancel my subscription" button. No guilt lines, no em dashes, and nothing says the subscription can be restarted after cancelling.

## How it works

`src/zt-cancel-flow.js` waits for Seal's final cancel click. If a reason has been picked it pauses that click, shows screens 2 and 3, and on "Cancel my subscription" hands the same click back to Seal, so Seal records the reason and does the cancel. If anything goes wrong, or no reason is picked, Seal's cancel runs as normal (fail open). Escape or X returns to Seal.

## Tests run (iPhone 13 viewport, `node test-flow.js`)

All four reasons: right save screen, save action reaches the Seal control (frequency select, Skip, Pause; recipe button opens the Cacao PDF), save never cancels, cancel reaches Seal's own handler with the reason. Fail-open, Escape and the screen 2 cancel link pass. Screenshots in `screens/`.

## Install (needs Dana's yes)

1. Upload `src/zt-cancel-flow.js` and `src/zt-cancel-flow.css` to theme assets.
2. In `layout/theme.liquid`, inside the existing `{%- if request.path contains '/a/subscriptions' -%}` block, add the stylesheet, `<script>window.ZT_CANCEL_FLOW={videoId:'YOUTUBE_ID'};</script>` and the script with `defer`.
3. Which theme (note from the website session, 19 Nov): live #188199928021 is about to be replaced by #188281815253 ("Live + FAQ, gifts and Difference page (Claude)", 23 approved changes). Do not copy #188199928021. If #188281815253 is live, copy it; if not, install into #188281815253 itself with themeFilesUpsert (its workspace holds another session's pending edit, so no theme_commit). Also install into the Black Friday theme #187825914069, which goes live 27 Nov 12:00 AM CT, or the flow disappears that day.
4. Stage it, log in to the portal as the test subscriber with `?preview_theme_id=`, run all four reasons, adjust the `cancelText` / `skipText` / `pauseText` patterns to Seal's real button labels if needed.
5. Set the four reason labels in Seal (Settings, Customer portal, cancellation reasons) to the list above.
6. Seal's cancellation confirmation text must not say the subscription can be restarted.

Video: unlisted YouTube, embedded with `youtube-nocookie.com`, `autoplay=1&mute=1&playsinline=1&cc_load_policy=1`. Captions only show if the video has a caption track on YouTube. Set `videoMode:'thumbnail'` for the big-thumbnail fallback.
