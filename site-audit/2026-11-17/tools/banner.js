// Is Shopify's cookie banner shown? Checks the privacy banner element and Shopify.customerPrivacy state.
const { chromium, devices } = require('playwright');
(async () => {
  const [,, url] = process.argv;
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });
  await ctx.route('**/*', r => /facebook\.com\/tr|connect\.facebook\.net|google-analytics|googletagmanager|clarity\.ms|monorail|\/web-pixels|trekkie/.test(r.request().url()) ? r.abort() : r.continue());
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(6000);
  const r = await p.evaluate(() => {
    const el = document.querySelector('#shopify-pc__banner, .shopify-pc__banner__dialog, [id^="shopify-pc__"]');
    const vis = el ? (() => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return { display: s.display, vis: s.visibility, h: Math.round(b.height), top: Math.round(b.top) }; })() : null;
    const cp = window.Shopify && Shopify.customerPrivacy;
    let region = null, shouldShow = null;
    try { shouldShow = cp && cp.shouldShowBanner ? cp.shouldShowBanner() : null; } catch (e) { shouldShow = 'err'; }
    try { region = cp && cp.getRegion ? cp.getRegion() : null; } catch (e) { region = 'err'; }
    return { bannerEl: el ? el.id || el.className : null, vis, shouldShowBanner: shouldShow, region, text: el ? el.innerText.slice(0, 60) : null };
  });
  console.log(url.replace(/\?.*$/, '') + (url.includes('preview_theme_id') ? ' [preview]' : ' [live]'), JSON.stringify(r));
  await b.close();
})();
