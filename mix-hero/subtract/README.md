# Subtraction: "Simple on Purpose" (evergreen homepage scroll animation)

Brand-level homepage scroll animation that doesn't depend on any one product or price:

1. **The noise.** A full-screen "Ingredients:" wall (an illustrative long label, not any one brand). "Most labels keep adding."
2. **The subtraction.** Words are struck through and fall away as you scroll; the counter drops 56 → 9. "So we kept taking things out."
3. **What's left.** The nine survivors glide into a page-wide row and become flat-lay photographs. "Simple on purpose."
4. **Concept packaging.** Pouches whose label *is* the ingredient list: Cacao (6), Vegan (5), a single (1). "The label is the design."
5. **Manifesto + two doors.** "Short list. Nothing extra. Nothing to hide." Protein blends / Single ingredients.

- `index.html` - the page (`?p=0.5` freezes any point). Fixed design stage (1600x900, phone 420x746) scaled to fit.
- `img/` - nine new flat-lay ingredient photos generated for this (no store photos). Hemp and lion's mane are upscaled previews (Figma's Starter-plan MCP limit was hit); regenerate at full size before launch.
- Pouches are drawn in SVG + HTML (concept only, not production packaging); the label text is live.
- `record.js` - frame-exact recordings: `node record.js desktop|phone out/x.mp4`.
- "Nine ingredients" counts the current catalog with Zeolite Powder on hold.
