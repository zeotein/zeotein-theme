// Compare per-section heights live vs preview (overlays hidden, animations frozen).
const { chromium, devices } = require('playwright');
(async () => {
  const [path, dev] = process.argv.slice(2);
  const browser = await chromium.launch();
  const res = {};
  for (const [label, q] of [['live', ''], ['preview', '?preview_theme_id=187923202261']]) {
    const ctx = await browser.newContext({ ...devices[dev || 'iPhone 13'], reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('https://zeotein.com' + path + q, { waitUntil: 'load', timeout: 90000 });
    await page.waitForTimeout(4000);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(4000);
    res[label] = await page.evaluate(() => ({
      body: document.body.scrollHeight,
      sections: [...document.querySelectorAll('.shopify-section, main > *')].filter(s => s.id).map(s => [s.id.replace(/^shopify-section-(sections--\d+__|template--\d+__)?/, ''), s.offsetHeight]),
      slot: document.querySelectorAll('[data-zt-bb-drawer-slot]').length,
      jdgm: document.querySelectorAll('.jdgm-rev, .jdgm-carousel-item').length,
    }));
    await ctx.close();
  }
  const L = res.live, P = res.preview;
  console.log('body height live/preview:', L.body, P.body, '| drawer slot live/preview:', L.slot, P.slot, '| judge.me review nodes:', L.jdgm, P.jdgm);
  const pm = new Map(P.sections);
  for (const [id, h] of L.sections) { const ph = pm.get(id); if (ph !== h) console.log(`  DIFF ${id}: live=${h} preview=${ph}`); }
  console.log('sections compared:', L.sections.length, P.sections.length);
  await browser.close();
})();
