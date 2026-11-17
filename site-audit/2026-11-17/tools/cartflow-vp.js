// Cart and checkout-start check, slow and careful (17 Nov 2026 verification pass).
// Usage: node cartflow-vp.js <outDir> live|bf [waitSecondsFirst]
// Desktop and iPhone: Cacao bag page -> Add to cart (button as shown) -> cart.js -> /cart (guides should be added at $0)
// -> Checkout button -> checkout page opened, screenshot, STOP (nothing entered, no order). Then the cart is cleared.
// Also re-checks pages that hit Shopify's rate limit in the main pass.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const [,, outDir, mode = 'live', waitFirst = '0'] = process.argv;
const BLOCK = /facebook\.com\/tr|connect\.facebook\.net|google-analytics\.com|googletagmanager\.com|googleadservices\.com|doubleclick\.net|clarity\.ms|analytics\.tiktok\.com|monorail-edge\.shopifysvc\.com|\/\.well-known\/shopify\/monorail|\/api\/collect|bat\.bing\.com|trekkie|\/web-pixels|a\.klaviyo\.com\/client\/events|static-tracking\.klaviyo\.com/;
const url = p => 'https://zeotein.com' + p + (p.includes('?') ? '&' : '?') + 'zt_internal=1' + (mode === 'bf' ? '&preview_theme_id=187825914069' : '');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const RECHECK = (process.env.RECHECK || '').split(',').filter(Boolean);
const passChallenge = async (p) => { for (let i = 0; i < 25; i++) { const t = await p.title().catch(() => ''); if (!/just a moment|attention required/i.test(t)) return true; await new Promise(r => setTimeout(r, 2000)); if (i === 12) await p.reload({ waitUntil: 'load' }).catch(() => {}); } return false; };
const DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
fs.mkdirSync(outDir, { recursive: true });
(async () => {
  await sleep(Number(waitFirst) * 1000);
  const b = await chromium.launch();
  const out = { mode, flows: [], rechecks: [] };
  const ONLY = (process.env.PROFILES || 'desktop,iphone').split(',');
  for (const [prof, opts] of [['desktop', { viewport: { width: 1440, height: 900 }, userAgent: DESKTOP_UA }], ['iphone', { ...devices['iPhone 13'] }]]) {
    if (!ONLY.includes(prof)) continue;
    const ctx = await b.newContext(opts);
    await ctx.route('**/*', r => BLOCK.test(r.request().url()) ? r.abort() : r.continue());
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => { if (!/Failed to fetch|Load failed|NetworkError/i.test(e.message)) errs.push(e.message.slice(0, 160) + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' ').slice(0, 200) + ' on ' + p.url().replace(/\?.*/, '')); });
    const cartJs = async () => p.evaluate(async () => { const r = await fetch('/cart.js', { headers: { Accept: 'application/json' } }); const t = await r.text();
      try { const c = JSON.parse(t); return { status: r.status, total: (c.total_price / 100).toFixed(2), items: c.items.map(i => `${i.quantity} x ${i.product_title} | ${i.variant_title || ''} | $${(i.final_line_price / 100).toFixed(2)}${i.selling_plan_allocation ? ' | ' + i.selling_plan_allocation.selling_plan.name : ''}`) }; }
      catch (e) { return { status: r.status, notJson: t.slice(0, 80) }; } });
    const f = { prof };
    try {
      await p.goto(url('/products/zeotein-cacao-bag-30'), { waitUntil: 'load', timeout: 90000 }); await passChallenge(p); await sleep(3500);
      await p.evaluate(() => document.querySelectorAll('#shopify-pc__banner, #PBarNextFrameWrapper, [id^="PBar"]').forEach(e => e.remove())).catch(() => {});
      await p.evaluate(() => fetch('/cart/clear.js', { method: 'POST' })); await sleep(800);
      f.selected = await p.evaluate(() => { const s = document.querySelector('input[name="selling_plan"], select[name="selling_plan"]'); return s ? (s.value ? 'subscription plan ' + s.value : 'one-time') : 'no plan field'; });
      const btn = p.locator('form[action*="/cart/add"] [type="submit"]:visible, form[action*="/cart/add"] [name="add"]:visible').first();
      f.buttonText = (await btn.count()) ? (await btn.innerText()).trim().replace(/\s+/g, ' ').slice(0, 60) : null;
      const addResp = p.waitForResponse(r => /\/cart\/add/.test(r.url()) && r.request().method() === 'POST', { timeout: 25000 }).catch(() => null);
      await btn.scrollIntoViewIfNeeded(); await btn.click({ timeout: 10000 });
      const ar = await addResp; f.addStatus = ar ? ar.status() : 'no /cart/add request seen';
      await sleep(3500);
      f.afterAdd = await cartJs();
      await p.goto(url('/cart'), { waitUntil: 'load', timeout: 90000 }); await passChallenge(p); await sleep(7000);
      f.cartPage = await cartJs();
      f.cartLiquidErrors = await p.evaluate(() => (document.documentElement.outerHTML.match(/Liquid error[^<]{0,100}/g) || []).length);
      await p.screenshot({ path: `${outDir}/${prof}-cart.jpg`, type: 'jpeg', quality: 72 });
      const co = p.locator('button[name="checkout"]:visible, input[name="checkout"]:visible, a[href*="/checkout"]:visible').first();
      if (await co.count()) {
        await Promise.all([p.waitForURL(u => /\/checkouts?\//.test(String(u)), { timeout: 45000 }).catch(() => null), co.click({ timeout: 10000 })]);
        await sleep(7000);
        const u = new URL(p.url());
        f.checkout = { host: u.host, path: u.pathname.replace(/[A-Za-z0-9]{16,}/g, '<id>'), title: (await p.title()).slice(0, 80),
          sections: await p.evaluate(() => ['Contact', 'Delivery', 'Shipping', 'Payment', 'Order summary'].filter(k => document.body.innerText.includes(k))),
          lines: await p.evaluate(() => (document.body.innerText.match(/Free Gift[^\n]{0,70}|Zeotein Cacao[^\n]{0,70}/g) || []).slice(0, 6)) };
        await p.screenshot({ path: `${outDir}/${prof}-checkout.jpg`, type: 'jpeg', quality: 72 });
      } else f.checkout = 'no checkout button found';
    } catch (e) { f.error = String(e).slice(0, 200); }
    try { await p.goto(url('/'), { waitUntil: 'load', timeout: 90000 }); await passChallenge(p); await p.evaluate(() => fetch('/cart/clear.js', { method: 'POST' })); f.cleared = true; } catch (e) { f.cleared = false; }
    f.scriptErrors = errs.slice(0, 4);
    out.flows.push(f);
    for (const path of (prof === 'iphone' ? RECHECK : [])) {
      await sleep(4000);
      const e2 = []; const h = e => e2.push(e.message.slice(0, 160)); p.on('pageerror', h);
      try { const r = await p.goto(url(path), { waitUntil: 'load', timeout: 90000 }); await passChallenge(p); await sleep(3500);
        const info = await p.evaluate(() => ({ title: document.title.slice(0, 70), liquid: (document.documentElement.outerHTML.match(/Liquid error/g) || []).length, side: document.documentElement.scrollWidth > innerWidth + 1 }));
        await p.screenshot({ path: `${outDir}/${prof}-recheck${path.replace(/\//g, '-')}.jpg`, type: 'jpeg', quality: 70 });
        out.rechecks.push({ prof, path, status: r && r.status(), ...info, scriptErrors: e2.filter(m => !/Failed to fetch|Load failed/.test(m)).slice(0, 3) });
      } catch (e) { out.rechecks.push({ prof, path, error: String(e).slice(0, 160) }); }
      p.off('pageerror', h);
    }
    await ctx.close();
  }
  fs.writeFileSync(`${outDir}/cartflow-${process.env.PROFILES || 'all'}.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
