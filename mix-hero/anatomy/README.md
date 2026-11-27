# The Anatomy of a Shake (Zeotein Cacao)

Cinematic, scroll-driven homepage section in the style of the "anatomy" sites: one pinned dark stage, a spotlight
beam, giant serif words drifting behind, and photo-real imagery. Scrolling takes you **into** the Cacao bag, then
through the six ingredients one chapter at a time (01 / 06 to 06 / 06, side rail), and out to the finale: the shake,
the bag and all six ingredients orbiting, with the Starter Kit offer.

| File | What it is |
|---|---|
| `index.html` | The section (self-contained apart from `img/` and the CDN logo). Smoothed scroll, desktop and phone layouts, reduced-motion shows the finale. `?p=0.5` freezes at any point. |
| `img/` | Six ingredient shots and the shake (generated for this, photo-real, dark plum studio), the Cacao bag cut out from the approved first image (uncropped), the desk/laptop photo for the reel. |
| `reel.html`, `render.js` | The page warped onto the photographed laptop screen (homography), scripted scroll with holds on every chapter. `node render.js out/x.mp4`. |
| `out/zeotein-anatomy-reel.mp4` | 24.4 s, 1080x1920, 30 fps. |

Copy follows the Google Site house rules (23g Cacao, zero sugar, "first order", mineral wording, rating line);
zeotein-compliance-scrub prescan 0/0/0. The MCT image is plain powder on purpose: the label doesn't say coconut.
Generated source images also live in Figma: "Zeotein Anatomy Hero Assets".
