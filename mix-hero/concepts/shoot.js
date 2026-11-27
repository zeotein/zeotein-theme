const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const f of ['c1-short-list', 'c2-pantry', 'c3-pick']) {
    for (const [tag, w, h, dpr] of [['desktop', 1440, 900, 1], ['mobile', 390, 844, 2]]) {
      const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
      p.on('pageerror', e => errs.push(f + ': ' + e.message));
      p.on('requestfailed', r => errs.push(f + ' failed: ' + r.url()));
      await p.goto('file://' + __dirname + '/' + f + '.html', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: `shots/${f}-${tag}.png`, fullPage: tag === 'desktop' });
      await p.close();
    }
  }
  console.log('errors:', errs); await b.close();
})();
