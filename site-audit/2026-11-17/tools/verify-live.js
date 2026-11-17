// Before/after check of the live store (or a theme preview) on desktop and iPhone.
// Pages: home, Organic Hemp (Nutrition Facts check), Cacao 30 sticks, Vegan 30 sticks, Cacao bulk bag,
// Organic Cacao, and the cart after clicking the bulk bag's real Add to cart button (no checkout).
// Analytics and ad beacons are blocked; every URL carries ?zt_internal=1. The cart is cleared afterwards.
// Usage: node verify-live.js <outDir> [previewThemeId]
const { chromium, devices } = require('playwright');
const fs = require('fs');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/,
  /googleadservices\.com/, /doubleclick\.net/, /clarity\.ms/, /analytics\.tiktok\.com/, /monorail-edge\.shopifysvc\.com/,
  /\/\.well-known\/shopify\/monorail/, /\/api\/collect/, /bat\.bing\.com/, /trekkie/, /\/web-pixels/,
  /a\.klaviyo\.com\/client\/events/, /static-tracking\.klaviyo\.com/];
const PAGES = [
  ['home', '/'],
  ['hemp', '/products/organic-hemp-protein-powder-premium-plant-based-protein'],
  ['cacao-30', '/products/zeotein-cacao-sticks-30'],
  ['vegan-30', '/products/zeotein-vegan-sticks-30'],
  ['bulk-bag', '/products/zeotein-cacao-bag-30'],
  ['organic-cacao', '/products/organic-fermented-cacao-powder-premium-unsweetened'],
];
const [,, outDir, previewId] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const q = p => p + (p.includes('?') ? '&' : '?') + 'zt_internal=1' + (previewId ? `&preview_theme_id=${previewId}` : '');
(async () => {
  const b = await chromium.launch();
  const report = [];
  for (const [prof, opts] of [['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }], ['mobile', { ...devices['iPhone 13'] }]]) {
    const ctx = await b.newContext(opts);
    await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => { if (!/Failed to fetch|Load failed|NetworkError/i.test(e.message)) errs.push(e.message.slice(0, 160)); });
    for (const [name, path] of PAGES) {
      const resp = await p.goto('https://zeotein.com' + q(path), { waitUntil: 'load', timeout: 90000 });
      await p.waitForTimeout(3000);
      const info = await p.evaluate(() => {
        const t = document.body.innerText;
        return {
          theme: (window.Shopify && Shopify.theme) ? `${Shopify.theme.id} ${Shopify.theme.name}` : null,
          title: document.title.trim().slice(0, 90),
          h1: (document.querySelector('h1') || {}).innerText?.trim().slice(0, 80) || null,
          hempIngredient: /Organic hemp protein powder/i.test(t),
          collagenIngredient: /Grass-fed bovine collagen peptides/i.test(t),
          serving: (t.match(/Serving size[:\s]*([^\n]{2,40})/i) || [])[1] || null,
          calories: (t.match(/Calories\s*\n?\s*(\d{2,4})/) || [])[1] || null,
          brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:')).length,
          sideScroll: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      await p.screenshot({ path: `${outDir}/${prof}-${name}.png` });
      if (name === 'hemp') {
        // The facts sit in closed <details> accordions: open Nutrition and Ingredients, then shoot that band.
        try {
          await p.evaluate(() => document.querySelectorAll('details').forEach(d => {
            if (/nutrition|ingredient/i.test((d.querySelector('summary') || {}).innerText || '')) d.open = true; }));
          await p.waitForTimeout(600);
          const box = await p.evaluate(() => {
            const ds = [...document.querySelectorAll('details')].filter(d => d.open && /nutrition|ingredient/i.test((d.querySelector('summary') || {}).innerText || ''));
            if (!ds.length) return null;
            const a = ds[0].getBoundingClientRect(), z = ds[ds.length - 1].getBoundingClientRect();
            return { top: a.top + scrollY, bottom: z.bottom + scrollY, left: Math.max(0, Math.min(a.left, z.left) - 10), width: Math.max(a.width, z.width) + 20 };
          });
          if (box) {
            await p.evaluate(y => scrollTo(0, y - 10), box.top); await p.waitForTimeout(500);
            const vp = p.viewportSize();
            await p.screenshot({ path: `${outDir}/${prof}-hemp-nutrition-facts.png`, clip: { x: box.left, y: 0, width: Math.min(box.width, vp.width - box.left), height: Math.min(vp.height, box.bottom - box.top + 20) } });
          }
          info.factsText = await p.evaluate(() => [...document.querySelectorAll('details')].filter(d => d.open && /nutrition/i.test((d.querySelector('summary') || {}).innerText || '')).map(d => d.innerText.replace(/\s+/g, ' ').slice(0, 260)).join(' | '));
        } catch (e) { info.factsErr = String(e).slice(0, 120); }
      }
      report.push({ prof, name, status: resp && resp.status(), ...info });
    }
    // Cart: click the bulk bag page's own Add to cart button, then open /cart. No checkout.
    await p.goto('https://zeotein.com' + q('/products/zeotein-cacao-bag-30'), { waitUntil: 'load', timeout: 90000 });
    await p.waitForTimeout(2500);
    await p.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }));
    const btn = p.locator('form[action*="/cart/add"] button[type="submit"]:visible, form[action*="/cart/add"] [name="add"]:visible').first();
    let clicked = false;
    if (await btn.count()) {
      await btn.scrollIntoViewIfNeeded();
      const addResp = p.waitForResponse(r => /\/cart\/add/.test(r.url()), { timeout: 20000 }).catch(() => null);
      await btn.click({ timeout: 10000 }).then(() => { clicked = true; }).catch(() => {});
      await addResp; await p.waitForTimeout(2500);
    }
    await p.goto('https://zeotein.com' + q('/cart'), { waitUntil: 'load', timeout: 90000 });
    await p.waitForTimeout(3000);
    const cart = await p.evaluate(async () => {
      const c = await (await fetch('/cart.js')).json();
      return { items: c.items.map(i => `${i.quantity} x ${i.product_title} | ${i.variant_title || ''} | $${(i.final_line_price / 100).toFixed(2)}${i.selling_plan_allocation ? ' | plan: ' + i.selling_plan_allocation.selling_plan.name : ''}`), total: (c.total_price / 100).toFixed(2), theme: window.Shopify && Shopify.theme ? Shopify.theme.id : null };
    });
    await p.screenshot({ path: `${outDir}/${prof}-cart.png` });
    report.push({ prof, name: 'cart', clickedAddToCart: clicked, ...cart });
    await p.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }));
    if (errs.length) report.push({ prof, name: 'script-errors', errs });
    await ctx.close();
  }
  fs.writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 1));
  for (const r of report) console.log(JSON.stringify(r));
  await b.close();
})();
