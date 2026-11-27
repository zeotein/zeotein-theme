# Zeotein Mix Hero, Ingredient Pour + Reels

## Ingredient Pour (homepage concept, `pour.html`)

The Cacao bag tips, the blend pours out, splits mid-air into its six ingredients, each lands in its own pile and a tag names it while the counter ticks 1 to 6 ("6 ingredients. That's all of them."). Bag rights itself, piles hold, loop (14 s). Desktop: copy left, visual right with full tags. Phone: visual on top, short tags (Bone broth, Collagen, Cacao, MCT, Sea moss, Mineral). Reduced-motion shows the finished, labelled state.

- `out/zeotein-pour-reel.mp4`: 13.6 s, 1080x1920, the phone layout rendered directly (`node render_direct.js pour.html out/zeotein-pour-reel.mp4`).
- `out/pour-contact-sheet.png`: six frames.
- Laptop version: `node render_reel.js --query 'src=pour.html&hold=12.4' out/x.mp4`.

## Mix hero (first concept)

A Zeotein take on the "build the drink" website hero (the reference was a coffee-site reel by enkywebstudio): a clear shaker fills with milk, ice drops in, cacao powder swirls through, ingredient cards fly in, the lid snaps on and it shakes, then it pours into a glass next to the Cacao bag.

| File | What it is |
|---|---|
| `hero.html` | The animated hero, self-contained (one file, CDN images). Loops every 18 s in four scenes with clickable dots. Respects reduced-motion (shows the final scene still). Responsive down to phone width. |
| `reel.html` | 1080x1920 stage: the hero playing on a laptop on a desk, slow push-in, end card. |
| `render_direct.js` | Renders any hero page itself in phone layout to a 1080x1920 MP4. |
| `render_reel.js` | Renders `reel.html` frame by frame to MP4 (`node render_reel.js`), or stills (`--stills dir 3 12 17`). |
| `out/zeotein-mix-reel.mp4` | The finished reel: 21 s, 1080x1920, 30 fps, H.264. Ready for Instagram/TikTok/Shorts. |
| `out/reel-cover.jpg`, `out/reel-contact-sheet.png` | Cover frame and an 8-frame overview. |

Preview the hero: `python3 -m http.server 8000` here, open `http://localhost:8000/hero.html` (`?t=11` freezes at 11 s).

## Copy and compliance

Pour: "Pour out the bag. Count to six." Mix scenes: "Shake up your usual." / "Six ingredients. That's it." / "Good things happen when you shake." / "Meet your new favorite."
Follows the Google Site house rules: 23g is Cacao, "zero sugar", "first order", the mineral as "a naturally occurring volcanic mineral", rating line "4.9 from 155 reviews", no scoop-shot photography (the bag is the approved garbled first image, uncropped). zeotein-compliance-scrub prescan: 0 critical, 0 high, 0 medium.

## Not installed anywhere

This is not pasted into GoHighLevel or Shopify. To use it as the Cacao or Home hero on shop.zeotein.com it would go into `google-site/src` as a partial, with its buttons wired to the on-site cart, then the normal build and QA run.
