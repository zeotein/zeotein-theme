const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const dev of ['iPhone 13', 'iPhone SE', 'Pixel 7']) {
    const ctx = await b.newContext({ ...devices[dev], deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    for (const slug of ['home', 'cacao', 'vegan']) {
      await p.goto('http://127.0.0.1:8765/' + slug + '/', { waitUntil: 'networkidle' });
      const r = await p.evaluate(() => { const q = s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().bottom) : null; }; return { vh: innerHeight, cta: q('[data-zt-hero-cta]'), price: q('.hero .priceline'), fine: q('.hero .fine') }; });
      console.log(dev.padEnd(10), slug.padEnd(6), JSON.stringify(r), r.price <= r.vh ? 'PRICE IN FIRST SCREEN' : 'price below fold', r.fine <= r.vh ? '| guarantee in first screen' : '| guarantee below fold');
      if (dev === 'iPhone 13') await p.screenshot({ path: __dirname + '/screens/' + slug + '-mobile-fold.png' });
    }
    await ctx.close();
  }
  await b.close();
})();
