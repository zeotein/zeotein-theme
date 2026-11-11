// Captures stacks of page errors, and re-runs with blocked third-party hosts stubbed (HTTP 204) to see if errors persist.
const { chromium, devices } = require('playwright');
(async () => {
  const urls = process.argv.slice(2);
  const browser = await chromium.launch();
  for (const stub of [false, true]) {
    const ctx = await browser.newContext({ ...devices['iPhone 13'] });
    if (stub) {
      await ctx.route(/^https?:\/\/(?!zeotein\.com|cdn\.shopify\.com)/, async (route) => {
        try { const r = await route.fetch({ timeout: 8000 }); await route.fulfill({ response: r }); }
        catch (e) { await route.fulfill({ status: 204, body: '' }); }
      });
    }
    for (const url of urls) {
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', e => errs.push((e.stack || e.message).split('\n').slice(0, 4).join(' | ').slice(0, 400)));
      await page.goto(url, { waitUntil: 'load', timeout: 90000 }).catch(e => errs.push('NAV ' + e));
      await page.waitForTimeout(6000);
      const theme = await page.evaluate(() => (window.Shopify && Shopify.theme) ? Shopify.theme.name + ' #' + Shopify.theme.id : 'n/a');
      console.log(`== stub=${stub} ${url}\n   theme: ${theme}`);
      [...new Set(errs)].forEach(e => console.log('   ', e));
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
})();
