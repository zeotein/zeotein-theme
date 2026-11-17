const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/, /googleadservices\.com/, /doubleclick\.net/, /clarity\.ms/, /analytics\.tiktok\.com/, /monorail-edge\.shopifysvc\.com/, /\/\.well-known\/shopify\/monorail/, /\/api\/collect/, /bat\.bing\.com/, /trekkie/, /\/web-pixels/, /a\.klaviyo\.com\/client\/events/, /static-tracking\.klaviyo\.com/];
const [,, listFile, outDir, mode] = process.argv;
const urls = fs.readFileSync(listFile, 'utf8').split('\n').filter(Boolean);
fs.mkdirSync(outDir, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const phone = mode !== 'desktop';
  const ctx = await b.newContext(phone ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' } : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
  for (const u of urls) {
    const p = await ctx.newPage();
    try {
      await p.goto(u, { waitUntil: 'load', timeout: 60000 });
      await p.waitForTimeout(2000);
      await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } window.scrollTo(0, 0); });
      await p.waitForTimeout(1200);
      const name = (new URL(u).pathname.replace(/^\/|\/$/g, '') || 'home').replace(/\//g, '__');
      const f = path.join(outDir, `${name}-${phone ? 'phone' : 'desktop'}-full.png`);
      await p.screenshot({ path: f, fullPage: true });
      const h = await p.evaluate(() => document.body.scrollHeight);
      console.log(f, h);
    } catch (e) { console.log('ERR', u, e.message.slice(0, 120)); }
    await p.close();
  }
  await b.close();
})();
