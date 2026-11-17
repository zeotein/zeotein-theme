// Screenshot the hemp page's Nutrition Facts and Ingredients panels: live vs the hotfix preview. iPhone 13 at 2x.
const { chromium, devices } = require('playwright');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/, /clarity\.ms/, /monorail-edge\.shopifysvc\.com/, /\/\.well-known\/shopify\/monorail/, /trekkie/, /\/web-pixels/, /privacy-banner/];
const URL = 'https://zeotein.com/products/organic-hemp-protein-powder-premium-plant-based-protein?zt_internal=1';
(async () => {
  const b = await chromium.launch();
  for (const [name, q] of [['live', ''], ['hotfix', '&preview_theme_id=188199928021']]) {
    const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
    await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
    const p = await ctx.newPage();
    await p.goto(URL + q, { waitUntil: 'load', timeout: 60000 });
    await p.addStyleTag({ content: '#PBarNextFrameWrapper,#preview-bar-iframe,[id*="preview-bar"],.zt-sticky,[id*="bon-"],[class*="bon-"],iframe{display:none!important}' });
    // open the Nutrition Facts and Ingredients accordions
    const opened = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('details').forEach(d => {
        const s = (d.querySelector('summary') || {}).innerText || '';
        if (/nutrition|ingredient/i.test(s)) { d.open = true; out.push(s.trim().slice(0, 40)); }
      });
      return out;
    });
    await p.waitForTimeout(600);
    const box = await p.evaluate(() => {
      const ds = [...document.querySelectorAll('details')].filter(d => d.open && /nutrition|ingredient/i.test((d.querySelector('summary') || {}).innerText || ''));
      if (!ds.length) return null;
      const r1 = ds[0].getBoundingClientRect(); const r2 = ds[ds.length - 1].getBoundingClientRect();
      return { top: r1.top + scrollY, bottom: r2.bottom + scrollY };
    });
    console.log(name, opened, box);
    if (box) {
      await p.evaluate(y => scrollTo(0, y - 10), box.top);
      await p.waitForTimeout(400);
      const h = Math.min(820, box.bottom - box.top + 20);
      await p.screenshot({ path: `hemp-${name}.png`, clip: { x: 0, y: 0, width: 390, height: h } });
    }
    await ctx.close();
    await new Promise(r => setTimeout(r, 2000));
  }
  await b.close();
})();
