// Clean review shots of the BF theme preview (cookie pop-up and Shopify preview bar removed from the screenshot only).
// Usage: node bf-banner-final.js <outDir> [themeId]
const { chromium } = require('playwright');
const [,, outDir, themeId = '187825914069'] = process.argv;
const BLOCK = /facebook|google-analytics|googletagmanager|googleadservices|doubleclick|clarity\.ms|monorail|trekkie|web-pixels|bat\.bing|tiktok|klaviyo\.com\/client\/events|static-tracking\.klaviyo/;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await ctx.route('**/*', r => BLOCK.test(r.request().url()) ? r.abort() : r.continue());
  const p = await ctx.newPage();
  for (const [name, path] of [['home', '/'], ['shop-all', '/collections/shop-all']]) {
    await p.goto(`https://zeotein.com${path}?zt_internal=1&preview_theme_id=${themeId}`, { waitUntil: 'load', timeout: 90000 });
    await p.waitForTimeout(4000);
    await p.evaluate(() => document.querySelectorAll('#shopify-pc__banner, #preview-bar-iframe, #PBarNextFrameWrapper, iframe[src*="preview_bar"], [id^="PBar"]').forEach(e => e.remove()));
    if (name === 'shop-all') { await p.evaluate(() => { const g = document.querySelector('ul#product-grid, .product-grid'); if (g) scrollTo(0, g.getBoundingClientRect().top + scrollY - 260); }); }
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${outDir}/clean-desktop-${name}.png` });
    console.log(name, 'ok');
  }
  await b.close();
})();
