// Full console/script/404 scan. Usage: node errscan.js <outfile.json> <url> [url...]
const { chromium, devices } = require('playwright');
const fs = require('fs');
(async () => {
  const [out, ...urls] = process.argv.slice(2);
  const browser = await chromium.launch();
  const results = [];
  for (const dev of ['iPhone 13', 'Desktop Chrome']) {
    const ctx = await browser.newContext({ ...devices[dev] });
    for (const url of urls) {
      const page = await ctx.newPage();
      const r = { device: dev, url, pageErrors: [], consoleErrors: [], badResponses: [], failed: [] };
      page.on('pageerror', e => r.pageErrors.push(String(e.message).slice(0, 300)));
      page.on('console', m => { if (m.type() === 'error') r.consoleErrors.push(m.text().slice(0, 300)); });
      page.on('response', resp => { const s = resp.status(); if (s >= 400) r.badResponses.push(s + ' ' + resp.url().slice(0, 200)); });
      page.on('requestfailed', req => r.failed.push((req.failure() || {}).errorText + ' ' + req.url().slice(0, 200)));
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 90000 });
        await page.waitForTimeout(3500);
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(res => setTimeout(res, 100)); } });
        await page.waitForTimeout(2500);
      } catch (e) { r.navError = String(e).slice(0, 200); }
      results.push(r);
      const own = r.badResponses.filter(x => /zeotein\.com\/cdn\/shop\/t\//.test(x));
      console.log(`== [${dev}] ${url}\n   pageErrors=${r.pageErrors.length} consoleErrors=${r.consoleErrors.length} bad=${r.badResponses.length} (theme assets: ${own.length}) failed=${r.failed.length}`);
      [...new Set(r.pageErrors)].forEach(e => console.log('   PAGEERROR', e));
      [...new Set(own)].forEach(e => console.log('   THEME-404', e));
      await page.close();
      await new Promise(res => setTimeout(res, 1500));
    }
    await ctx.close();
  }
  fs.writeFileSync(out, JSON.stringify(results, null, 1));
  await browser.close();
})();
