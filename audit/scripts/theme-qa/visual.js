// Full-page screenshots live vs preview with animations frozen; also checks Seal widget text on the PDP.
const { chromium, devices } = require('playwright');
const fs = require('fs');
(async () => {
  const [outdir] = process.argv.slice(2);
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  const only = process.argv[3];
  const pages = [
    ['home-mobile', 'iPhone 13', '/'],
    ['home-desktop', 'Desktop Chrome', '/'],
    ['pdp-mobile', 'iPhone 13', '/products/zeotein-cacao-bag-30'],
    ['pdp-desktop', 'Desktop Chrome', '/products/zeotein-cacao-bag-30'],
    ['lp-mobile', 'iPhone 13', '/products/cacao-protein-starter-kit'],
    ['cart-mobile', 'iPhone 13', '/cart'],
  ].filter(p => !only || p[0].startsWith(only));
  for (const [name, dev, path] of pages) {
    for (const [label, q] of [['live', ''], ['preview', '?preview_theme_id=187923202261']]) {
      const ctx = await browser.newContext({ ...devices[dev], reducedMotion: 'reduce', deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.goto('https://zeotein.com' + path + q, { waitUntil: 'load', timeout: 90000 });
      await page.waitForTimeout(4000);
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(3000);
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } window.scrollTo(0, 0); });
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important} #preview-bar-iframe,#PBarNextFrameWrapper,iframe,[id^="shopify-pc"],[class*="shopify-pc"],chat-widget,[id*="lc_text-widget"],[class*="bon-"],[id*="bon-"],[id*="optimonk"],[class*="optimonk"],[class*="om-"]{display:none!important;visibility:hidden!important}' });
      await page.waitForTimeout(3000);
      if (name.startsWith('pdp')) {
        await page.waitForFunction(() => { const w = document.querySelector('delivery-promise-wc'); return w && w.offsetHeight > 0; }, null, { timeout: 30000 }).catch(() => console.log('promise widget never rendered on', name));
        await page.waitForTimeout(1500);
        const seal = await page.evaluate(() => { const t = document.body.innerText; const i = t.search(/subscribe\s*(&|and)\s*save|subscribe/i); return i >= 0 ? t.slice(Math.max(0, i - 60), i + 140).replace(/\s+/g, ' ') : 'NO SUBSCRIBE TEXT'; });
        console.log(`[${label}] PDP subscribe text: ${seal}`);
      }
      await page.screenshot({ path: `${outdir}/${name}-${label}.png`, fullPage: true });
      await ctx.close();
    }
    console.log('shot', name);
  }
  await browser.close();
})();
