// End-to-end verification pass (17 Nov 2026, Dana 10:07 AM CT: "make sure it's all working").
// Usage: node vp.js <outDir> live|bf
//   live = zeotein.com as shoppers see it (theme 188199928021)
//   bf   = Black Friday theme preview (?preview_theme_id=187825914069), stays unpublished
// Per page (desktop 1440 and iPhone 13): status, theme, title, H1, Liquid errors, script errors, broken images,
// sideways scroll, copy-rule checks, and the approved features (rating line, PDP reviews, guarantee/trust row,
// savings callouts off, bundle tiers off, chooser). Flows: add to cart on the Cacao bag page, guides added at $0,
// cart page, checkout page opened (stopped there, nothing entered, no order), chooser button opens the product page.
// Analytics, ad pixels and Clarity are blocked; every URL carries zt_internal=1. The cart is cleared afterwards.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const [,, outDir, mode = 'live'] = process.argv;
const BF = '187825914069';
const BLOCK = /facebook\.com\/tr|connect\.facebook\.net|google-analytics\.com|googletagmanager\.com|googleadservices\.com|doubleclick\.net|clarity\.ms|analytics\.tiktok\.com|monorail-edge\.shopifysvc\.com|\/\.well-known\/shopify\/monorail|\/api\/collect|bat\.bing\.com|trekkie|\/web-pixels|a\.klaviyo\.com\/client\/events|static-tracking\.klaviyo\.com/;
const PRODUCTS = ['zeotein-cacao-bag-30', 'zeotein-cacao-sticks-30', 'zeotein-cacao-sticks-7', 'zeotein-vegan-sticks-30',
  'zeotein-vegan-sticks-7', 'zeotein-bone-broth-protein-powder', 'zeotein-collagen-peptides', 'zeolite', 'organic-mct-oil-powder',
  'organic-sea-moss-powder', 'organic-lion-s-mane-mushroom-powder', 'organic-fermented-cacao-powder-premium-unsweetened',
  'organic-hemp-protein-powder-premium-plant-based-protein', 'organic-pumpkin-seed-protein-powder',
  'zeotein-cleanblend-shaker-27oz-usa-made', 'save-a-scoop', 'cacao-recipe-guide', 'vegan-recipe-guide', 'zeotein-starter-guide',
  'zeotein-gift-card', 'cacao-protein-starter-kit'];
const BLENDS = new Set(['zeotein-cacao-bag-30', 'zeotein-cacao-sticks-30', 'zeotein-cacao-sticks-7', 'zeotein-vegan-sticks-30', 'zeotein-vegan-sticks-7']);
const PAGES = [['home', '/'], ['shop-all', '/collections/shop-all'], ['all', '/collections/all'], ['protein-blends', '/pages/protein-blends'],
  ['shop-cacao', '/pages/shop-cacao'], ['shop-vegan', '/pages/shop-vegan'], ['coll-cacao', '/collections/zeotein'],
  ['coll-vegan', '/collections/zeotein-vegan-1'], ['coll-singles', '/collections/single-ingredient-supplements'],
  ['coll-protein-blends', '/collections/protein-blends'],
  ...PRODUCTS.map(h => ['p-' + h, '/products/' + h]),
  ...(mode === 'bf' ? [['p-30-day-cacao-bulk-bag-black-friday', '/products/30-day-cacao-bulk-bag-black-friday'], ['p-stocking-stuffers-7-day-gift', '/products/stocking-stuffers-7-day-gift']] : [])];
const url = p => 'https://zeotein.com' + p + (p.includes('?') ? '&' : '?') + 'zt_internal=1' + (mode === 'bf' ? '&preview_theme_id=' + BF : '');
const passChallenge = async (p) => { for (let i = 0; i < 25; i++) { const t = await p.title().catch(() => ''); if (!/just a moment|attention required/i.test(t)) return true; await new Promise(r => setTimeout(r, 2000)); if (i === 12) await p.reload({ waitUntil: 'load' }).catch(() => {}); } return false; };
const DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
fs.mkdirSync(outDir, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function tidy(p) {
  await p.evaluate(() => document.querySelectorAll('#shopify-pc__banner, #preview-bar-iframe, #PBarNextFrameWrapper, iframe[src*="preview_bar"], [id^="PBar"]').forEach(e => e.remove())).catch(() => {});
}
async function inspect(p) {
  return p.evaluate(() => {
    const vis = el => { if (!el) return false; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
    const anyVis = sel => [...document.querySelectorAll(sel)].some(vis);
    const t = document.body ? document.body.innerText : '';
    const html = document.documentElement.outerHTML;
    const ctx = (re, n = 3) => { const out = []; let m; const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'); while ((m = r.exec(t)) && out.length < n) out.push(t.slice(Math.max(0, m.index - 45), m.index + 55).replace(/\s+/g, ' ')); return out; };
    const count = re => (t.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')) || []).length;
    const atc = [...document.querySelectorAll('form[action*="/cart/add"] [type="submit"], form[action*="/cart/add"] [name="add"]')].filter(vis);
    const rating = document.querySelector('.zt-rating');
    return {
      theme: window.Shopify && Shopify.theme ? `${Shopify.theme.id} ${Shopify.theme.role}` : null,
      title: document.title.trim().slice(0, 100),
      h1: ((document.querySelector('h1') || {}).innerText || '').trim().replace(/\s+/g, ' ').slice(0, 90),
      liquidErrors: (html.match(/Liquid error[^<]{0,140}/g) || []).slice(0, 4),
      brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:')).map(i => i.src.slice(0, 120)).slice(0, 4),
      sideScroll: document.documentElement.scrollWidth > innerWidth + 1,
      emDash: ctx(/—/), emDashCount: count(/—/),
      completeProtein: count(/complete protein/i),
      zeolite: count(/zeolite/i),
      youSave: ctx(/you save|save \d+%|save \$\d|bundle & save/i),
      ratings: ctx(/\d\.\d\s*(?:stars|out of 5|from|★)|rated \d\.\d/i, 4),
      recipes: ctx(/\b\d+\s+(?:holiday\s+)?recipes\b/i, 3),
      ratingLine: rating && vis(rating) ? rating.innerText.replace(/\s+/g, ' ').trim() : null,
      pdpReviews: anyVis('[class*="zt-pdp-reviews"]'),
      pdpGuarantee: anyVis('.zt-pdp-guarantee') || anyVis('.zt-trust__guarantee'),
      trustRow: anyVis('.zt-trust'),
      savingsBadgeVisible: anyVis('.sls-savings-badge'),
      bundleTiersVisible: anyVis('.bundler-volume-target-element, .bndlr-automatic-volume-bundle'),
      bfBanner: anyVis('.ztbfcd'), bfPriceNotes: [...document.querySelectorAll('.ztbf-strip, .ztbf-card, .ztbf-panel')].filter(vis).length,
      chooser: anyVis('[data-zt-chooser]'),
      addToCartButtons: atc.length,
      firstPrice: ((document.querySelector('.price-item--regular, .price__regular, .price') || {}).innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60),
    };
  });
}
(async () => {
  const b = await chromium.launch();
  const report = { mode, pages: [], flows: [] };
  for (const [prof, opts] of [['desktop', { viewport: { width: 1440, height: 900 }, userAgent: DESKTOP_UA }], ['iphone', { ...devices['iPhone 13'] }]]) {
    const ctx = await b.newContext(opts);
    await ctx.route('**/*', r => BLOCK.test(r.request().url()) ? r.abort() : r.continue());
    const p = await ctx.newPage();
    let errs = [];
    p.on('pageerror', e => { if (!/Failed to fetch|Load failed|NetworkError|net::ERR/i.test(e.message)) errs.push(e.message.slice(0, 160)); });
    for (const [name, path] of PAGES) {
      errs = [];
      let status = null;
      try {
        const resp = await p.goto(url(path), { waitUntil: 'load', timeout: 90000 }); await passChallenge(p);
        status = resp && resp.status();
        await sleep(2500); await tidy(p);
        const info = await inspect(p);
        if (prof === 'iphone' || BLENDS.has(path.replace('/products/', '')) || ['home', 'shop-all', 'protein-blends', 'shop-cacao', 'shop-vegan'].includes(name))
          await p.screenshot({ path: `${outDir}/${prof}-${name}.jpg`, type: 'jpeg', quality: 70 });
        report.pages.push({ prof, name, path, status, finalPath: new URL(p.url()).pathname, ...info, scriptErrors: errs.slice(0, 3) });
      } catch (e) { report.pages.push({ prof, name, path, status, error: String(e).slice(0, 160) }); }
      await sleep(Number(process.env.PACE || 1200));
    }
    // Header Shop menu + footer menus (home)
    try {
      await p.goto(url('/'), { waitUntil: 'load', timeout: 90000 }); await passChallenge(p); await sleep(2000);
      const nav = await p.evaluate(() => ({
        headerLinks: [...document.querySelectorAll('header a[href]')].map(a => `${(a.innerText || a.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ')} -> ${a.getAttribute('href')}`).filter(s => !s.startsWith(' ->')).slice(0, 40),
        footerMenus: [...document.querySelectorAll('.z-footer__menu')].map(m => ((m.querySelector('.z-footer__menu-heading') || {}).innerText || '') + ': ' + [...m.querySelectorAll('a')].map(a => a.innerText.trim()).join(' | ')),
      }));
      report.flows.push({ prof, flow: 'nav', ...nav });
    } catch (e) { report.flows.push({ prof, flow: 'nav', error: String(e).slice(0, 160) }); }
    // Chooser: pick Cacao, One-Time, first card; the button must open the real product page
    try {
      await p.goto(url('/pages/protein-blends'), { waitUntil: 'load', timeout: 90000 }); await passChallenge(p); await sleep(2500); await tidy(p);
      const before = await p.evaluate(() => { const a = document.querySelector('[data-zt-cta]'); return a ? a.getAttribute('href') : null; });
      await p.click('[data-zt-blend-btn="cacao"]', { timeout: 5000 }).catch(() => {});
      await p.click('[data-zt-mode-btn="once"]', { timeout: 5000 }).catch(() => {});
      const opt = p.locator('[data-zt-opt]:visible').first(); if (await opt.count()) await opt.click({ timeout: 5000 }).catch(() => {});
      await sleep(600);
      const sel = await p.evaluate(() => ({ href: (document.querySelector('[data-zt-cta]') || {}).getAttribute?.('href') || null,
        summary: ((document.querySelector('[data-zt-summary]') || {}).innerText || '').trim(), price: ((document.querySelector('[data-zt-cta-price]') || {}).innerText || '').trim() }));
      await p.screenshot({ path: `${outDir}/${prof}-flow-chooser.jpg`, type: 'jpeg', quality: 70 });
      const cta = p.locator('[data-zt-cta]:visible').first();
      let landed = null;
      if (await cta.count()) { await Promise.all([p.waitForNavigation({ timeout: 30000 }).catch(() => null), cta.click({ timeout: 5000 })]); await sleep(1500); landed = new URL(p.url()).pathname + new URL(p.url()).search.replace(/zt_internal=1&?|preview_theme_id=\d+&?/g, ''); }
      report.flows.push({ prof, flow: 'chooser', before, ...sel, landed });
    } catch (e) { report.flows.push({ prof, flow: 'chooser', error: String(e).slice(0, 160) }); }
    // Add to cart on the Cacao bag page, guides added at $0, cart page, checkout page (stop)
    try {
      await p.goto(url('/products/zeotein-cacao-bag-30'), { waitUntil: 'load', timeout: 90000 }); await passChallenge(p); await sleep(2500); await tidy(p);
      await p.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }));
      await sleep(500);
      const btn = p.locator('form[action*="/cart/add"] [type="submit"]:visible, form[action*="/cart/add"] [name="add"]:visible').first();
      let added = false;
      if (await btn.count()) {
        await btn.scrollIntoViewIfNeeded();
        const addResp = p.waitForResponse(r => /\/cart\/add/.test(r.url()), { timeout: 20000 }).catch(() => null);
        await btn.click({ timeout: 10000 }).then(() => { added = true; }).catch(() => {});
        await addResp; await sleep(3000);
      }
      await p.goto(url('/cart'), { waitUntil: 'load', timeout: 90000 }); await passChallenge(p); await sleep(5000); await tidy(p);
      const cart = await p.evaluate(async () => { const c = await (await fetch('/cart.js')).json();
        return { items: c.items.map(i => `${i.quantity} x ${i.product_title} | ${i.variant_title || ''} | $${(i.final_line_price / 100).toFixed(2)}${i.selling_plan_allocation ? ' | ' + i.selling_plan_allocation.selling_plan.name : ''}`), total: (c.total_price / 100).toFixed(2) }; });
      const cartInfo = await inspect(p);
      await p.screenshot({ path: `${outDir}/${prof}-flow-cart.jpg`, type: 'jpeg', quality: 70 });
      const co = p.locator('[name="checkout"]:visible, a[href*="/checkout"]:visible').first();
      let checkout = null;
      if (await co.count()) {
        await Promise.all([p.waitForURL(u => /checkouts?\//.test(String(u)), { timeout: 45000 }).catch(() => null), co.click({ timeout: 10000 })]);
        await sleep(6000);
        const u = new URL(p.url());
        checkout = { host: u.host, path: u.pathname.replace(/[a-z0-9]{20,}/gi, '…'), title: (await p.title()).slice(0, 80),
          hasContact: await p.evaluate(() => /contact|email|delivery|shipping|payment/i.test(document.body.innerText)) };
        await p.screenshot({ path: `${outDir}/${prof}-flow-checkout.jpg`, type: 'jpeg', quality: 70 });
      }
      report.flows.push({ prof, flow: 'cart-checkout', clickedAdd: added, ...cart, cartLiquidErrors: cartInfo.liquidErrors, cartYouSave: cartInfo.youSave, checkout });
      await p.goto(url('/'), { waitUntil: 'load', timeout: 90000 }).catch(() => {});
      await p.evaluate(() => fetch('/cart/clear.js', { method: 'POST' })).catch(() => {});
    } catch (e) { report.flows.push({ prof, flow: 'cart-checkout', error: String(e).slice(0, 200) }); }
    await ctx.close();
  }
  fs.writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 1));
  await b.close();
  console.log('done', report.pages.length, 'page checks,', report.flows.length, 'flows');
})();
