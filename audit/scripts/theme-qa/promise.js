// Probe the Shop Promise delivery widget on live, the fix preview, and an untouched theme's preview.
const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const targets = [
    ['live', ''],
    ['fix-preview', '?preview_theme_id=187923202261'],
    ['untouched-preview(gift lock theme)', '?preview_theme_id=187734720725'],
    ['untouched-preview(BF draft)', '?preview_theme_id=187825914069'],
  ];
  for (const [label, q] of targets) {
    const ctx = await browser.newContext({ ...devices['iPhone 13'] });
    const page = await ctx.newPage();
    const promiseReqs = [];
    page.on('request', r => { if (/promise|delivery|edd/i.test(r.url())) promiseReqs.push(r.url().slice(0, 120)); });
    await page.goto('https://zeotein.com/products/zeotein-cacao-bag-30' + q, { waitUntil: 'load', timeout: 90000 });
    await page.waitForTimeout(9000);
    const info = await page.evaluate(() => {
      const els = [...document.querySelectorAll('*')].filter(e => /promise/i.test(e.tagName) || /promise/i.test(e.className && e.className.baseVal === undefined ? e.className : '') || /promise/i.test(e.id));
      const txt = document.body.innerText.match(/Arrives as soon as[^\n]*/);
      return { theme: Shopify?.theme?.name, els: els.slice(0, 5).map(e => `${e.tagName.toLowerCase()}#${e.id}.${String(e.className).slice(0, 60)} h=${e.offsetHeight}`), arrivesText: txt ? txt[0] : null };
    });
    console.log(`== ${label} | theme: ${info.theme}\n   arrives: ${info.arrivesText}\n   elements: ${JSON.stringify(info.els)}\n   promise-ish requests: ${promiseReqs.length} ${JSON.stringify(promiseReqs.slice(0, 3))}`);
    await ctx.close();
  }
  await browser.close();
})();
