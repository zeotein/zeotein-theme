const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 2 });
  for (const v of process.argv.slice(3)) {
    await p.goto('file://' + process.argv[2] + '/kit-' + v + '.html');
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(800);
    const fam = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight).join(', '));
    const over = await p.evaluate(() => { const c = document.querySelector('.card').getBoundingClientRect(); const ft = document.querySelector('.ft').getBoundingClientRect(); const h = document.querySelector('h1').getBoundingClientRect(); return { cardTop: c.top, cardBottom: c.bottom, h1Bottom: h.bottom, ftTop: ft.top, ftBottom: ft.bottom }; });
    console.log(v, 'fonts:', fam, JSON.stringify(over));
    await p.screenshot({ path: process.argv[2] + '/kit-' + v + '@2x.png' });
  }
  await b.close();
})();
