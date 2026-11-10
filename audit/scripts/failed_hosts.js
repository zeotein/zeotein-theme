const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({...devices['iPhone 13'], deviceScaleFactor: 1});
  const page = await ctx.newPage();
  const failed = {}, ok = {};
  page.on('requestfailed', r => { try { const h = new URL(r.url()).hostname; failed[h] = (failed[h]||0)+1; } catch(e){} });
  page.on('requestfinished', r => { try { const h = new URL(r.url()).hostname; ok[h] = (ok[h]||0)+1; } catch(e){} });
  await page.goto(process.argv[2], {waitUntil:'load', timeout:90000});
  await page.waitForTimeout(6000);
  console.log('FAILED', JSON.stringify(failed));
  console.log('OK', JSON.stringify(ok));
  await browser.close();
})();
