// QA for the Zeotein Google Site preview. Usage: node qa/render_check.js http://127.0.0.1:8765
const { chromium, devices } = require('playwright');
const fs = require('fs');
const BASE = process.argv[2] || 'http://127.0.0.1:8765';
const OUT = __dirname + '/screens';
const pages = JSON.parse(fs.readFileSync(__dirname + '/../dist/manifest.json')).pages;
(async () => {
  const browser = await chromium.launch();
  const report = { pages: [], passthrough: {}, sticky: {}, ratingParser: {} };
  for (const p of pages) {
    for (const vp of [{ name: 'mobile', ctx: { ...devices['iPhone 13'], deviceScaleFactor: 1 } }, { name: 'desktop', ctx: { viewport: { width: 1440, height: 900 } } }]) {
      const ctx = await browser.newContext(vp.ctx);
      const page = await ctx.newPage();
      const errors = [], failed = [];
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', e => errors.push('pageerror: ' + e.message));
      page.on('requestfailed', r => failed.push(r.url() + ' ' + (r.failure() && r.failure().errorText)));
      page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
      await page.goto(`${BASE}/${p.slug}/`, { waitUntil: 'networkidle', timeout: 90000 });
      // load lazy images
      const H = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < H; y += 600) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(60); }
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
      const info = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const overflow = document.documentElement.scrollWidth - vw;
        const wide = [...document.querySelectorAll('.ztg *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed'; }).slice(0, 8).map(e => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right));
        const broken = [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src);
        const cta = document.querySelector('[data-zt-hero-cta]');
        const price = document.querySelector('.hero .priceline');
        const fine = document.querySelector('.hero .fine');
        const box = el => el ? Math.round(el.getBoundingClientRect().bottom + window.scrollY) : null;
        const links = [...document.querySelectorAll('.ztg a[href]')].map(a => a.getAttribute('href'));
        const h1 = (document.querySelector('.ztg h1') || {}).innerText;
        return { vw, overflow, wide, broken, ctaBottom: box(cta), priceBottom: box(price), fineBottom: box(fine), links: [...new Set(links)], h1, height: document.body.scrollHeight };
      });
      await page.screenshot({ path: `${OUT}/${p.slug}-${vp.name}.png`, fullPage: true });
      await page.screenshot({ path: `${OUT}/${p.slug}-${vp.name}-fold.png`, fullPage: false });
      report.pages.push({ slug: p.slug, viewport: vp.name, errors, failed: [...new Set(failed)], ...info });
      await ctx.close();
    }
  }
  // Passthrough: land with ad params on /cacao, then browse to /faq and check outbound links
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/cacao/?gclid=TESTGCLID123&utm_source=google&utm_medium=cpc&utm_campaign=987&utm_content=adA`, { waitUntil: 'networkidle' });
    const landing = await page.evaluate(() => [...document.querySelectorAll('.ztg a[href*="zeotein.com"]')].map(a => a.href));
    await page.click('.ztg .nav a[href="/faq"]');
    await page.waitForLoadState('networkidle');
    const afterNav = await page.evaluate(() => ({ url: location.href, hrefs: [...document.querySelectorAll('.ztg a[href*="zeotein.com"]')].map(a => a.href) }));
    // a link that already carries a value must keep its own value
    const keepsOwn = await page.evaluate(() => { const a = document.createElement('a'); a.href = 'https://zeotein.com/products/x?utm_source=email'; a.className = 'zt-test'; document.querySelector('.ztg').appendChild(a); a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); return a.href; });
    report.passthrough = {
      landingAllCarryGclid: landing.length > 0 && landing.filter(h => h.startsWith('https://zeotein.com')).every(h => h.includes('gclid=TESTGCLID123') && h.includes('utm_source=google')),
      landingCount: landing.length,
      faqUrl: afterNav.url,
      faqAllCarryGclid: afterNav.hrefs.length > 0 && afterNav.hrefs.filter(h => h.startsWith('https://zeotein.com')).every(h => h.includes('gclid=TESTGCLID123') && h.includes('utm_campaign=987')),
      faqCount: afterNav.hrefs.length,
      sampleFaqHref: afterNav.hrefs.find(h => h.includes('/products/')),
      existingParamKept: keepsOwn,
    };
    await ctx.close();
  }
  // No params, fresh visitor: links stay clean
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/cacao/`, { waitUntil: 'networkidle' });
    report.passthrough.cleanVisitorUntouched = await page.evaluate(() => [...document.querySelectorAll('.ztg a[href*="zeotein.com/products"]')].every(a => !a.href.includes('?')));
    // sticky bar on phone width
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
    const top = await page.evaluate(() => document.querySelector('[data-zt-sticky]').classList.contains('show'));
    await page.evaluate(() => window.scrollTo(0, 2200)); await page.waitForTimeout(600);
    const down = await page.evaluate(() => document.querySelector('[data-zt-sticky]').classList.contains('show'));
    await page.screenshot({ path: `${OUT}/cacao-mobile-sticky.png` });
    report.sticky = { hiddenAtTop: !top, shownAfterScroll: down };
    // mobile menu
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('[data-zt-menu]'); await page.waitForTimeout(200);
    report.menu = await page.evaluate(() => ({ open: document.querySelector('[data-zt-hdr]').classList.contains('open'), expanded: document.querySelector('[data-zt-menu]').getAttribute('aria-expanded') }));
    await page.screenshot({ path: `${OUT}/cacao-mobile-menu.png` });
    // rating parser
    report.ratingParser = await page.evaluate(() => {
      const f = window.__ztgParseRating;
      const a = "<div class='jdgm-all-reviews__header' data-number-of-reviews='155' data-average-rating='4.94' data-number-of-product-reviews='127'>";
      const b = JSON.stringify({ all_reviews: a });
      const c = '{"html":"<div data-average-rating=\\u00274.94\\u0027 data-number-of-reviews=\\u0027155\\u0027>"}';
      const d = '<div data-average-rating="0" data-number-of-reviews="0">';
      return { single: f(a), jsonWrapped: f(b), unicodeEscaped: f(c), zeroRejected: f(d) === null, garbageRejected: f('nope') === null };
    });
    await ctx.close();
  }
  fs.writeFileSync(__dirname + '/render-report.json', JSON.stringify(report, null, 2));
  await browser.close();
  console.log('done');
})();
