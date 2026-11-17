// Black Friday theme preview check for the one black banner (Nov 17 2026).
// Loads home, Shop All and one product page in the BF theme preview on desktop and iPhone 13,
// takes first-screen shots (for Dana) and full-page shots (for the check), and reports:
// theme id, banner visible + colors + text, whether the old purple ticker / purple hero / price band render,
// BF price notes on cards and product pages, Liquid errors in the HTML, sideways scroll, script errors.
// Usage: node bf-banner-shots.js <outDir> [themeId]
const { chromium, devices } = require('playwright');
const fs = require('fs');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/,
  /googleadservices\.com/, /doubleclick\.net/, /clarity\.ms/, /analytics\.tiktok\.com/, /monorail-edge\.shopifysvc\.com/,
  /\/\.well-known\/shopify\/monorail/, /\/api\/collect/, /bat\.bing\.com/, /trekkie/, /\/web-pixels/,
  /a\.klaviyo\.com\/client\/events/, /static-tracking\.klaviyo\.com/];
const [,, outDir, themeId = '187825914069'] = process.argv;
const PAGES = [['home', '/'], ['shop-all', '/collections/shop-all'], ['cacao-bag', '/products/zeotein-cacao-bag-30']];
const PROFILES = [
  ['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, PAGES],
  ['iphone', { ...devices['iPhone 13'] }, PAGES],
  ['tablet', { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 1 }, [['home', '/']]],
  ['laptop', { viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1 }, [['home', '/']]],
];
// Clean shots for review: answer the cookie banner (Decline) and hide the Shopify preview bar.
async function tidy(p) {
  try { const d = p.locator('#shopify-pc__banner button', { hasText: /^\s*Decline\s*$/i }).first(); if (await d.count()) await d.click({ timeout: 4000 }); } catch (e) {}
  await p.evaluate(() => document.querySelectorAll('#preview-bar-iframe, #PBarNextFrameWrapper, iframe[src*="preview_bar"], [id^="PBar"]').forEach(e => e.remove()));
  await p.waitForTimeout(500);
}
fs.mkdirSync(outDir, { recursive: true });
const q = p => p + (p.includes('?') ? '&' : '?') + 'zt_internal=1&preview_theme_id=' + themeId;
(async () => {
  const b = await chromium.launch();
  const report = [];
  for (const [prof, opts, pages] of PROFILES) {
    const ctx = await b.newContext(opts);
    await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => { if (!/Failed to fetch|Load failed|NetworkError/i.test(e.message)) errs.push(e.message.slice(0, 160)); });
    for (const [name, path] of pages) {
      const resp = await p.goto('https://zeotein.com' + q(path), { waitUntil: 'load', timeout: 90000 });
      await p.waitForTimeout(3500);
      await tidy(p);
      const info = await p.evaluate(() => {
        const vis = el => !!el && !el.hidden && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 0;
        const html = document.documentElement.innerHTML;
        const bn = document.querySelector('.ztbfcd');
        const bs = bn ? getComputedStyle(bn) : null;
        const offer = bn && bn.querySelector('.ztbfcd__offer');
        const cta = bn && bn.querySelector('.ztbfcd__cta');
        const hdr = document.querySelector('header, .header, [class*="header-custom"]');
        return {
          theme: (window.Shopify && Shopify.theme) ? `${Shopify.theme.id} ${Shopify.theme.role}` : null,
          title: document.title.trim().slice(0, 80),
          banner: bn ? {
            visible: vis(bn), bg: bs.backgroundColor, color: bs.color, height: Math.round(bn.getBoundingClientRect().height),
            top: Math.round(bn.getBoundingClientRect().top + scrollY),
            text: bn.innerText.replace(/\s+/g, ' ').trim().slice(0, 160),
            offerColor: offer ? getComputedStyle(offer).color : null,
            ctaBg: cta ? getComputedStyle(cta).backgroundColor : null, ctaHref: cta ? cta.getAttribute('href') : null,
          } : null,
          headerTop: hdr ? Math.round(hdr.getBoundingClientRect().top + scrollY) : null,
          marquee: [...document.querySelectorAll('[class*="announcement-marquee"], [class*="marquee"]')].filter(vis).length,
          bfHero: [...document.querySelectorAll('[class*="zt-bf-hero"], [class*="ztbf-hero"], [id*="bf_hero"]')].filter(vis).length,
          priceBand: [...document.querySelectorAll('.ztbf-band')].filter(vis).length,
          bfCardNotes: [...document.querySelectorAll('.ztbf-card')].filter(vis).length,
          bfPanels: [...document.querySelectorAll('.ztbf-panel, .ztbf-strip')].filter(vis).length,
          purpleBlocksTop: [...document.querySelectorAll('body *')].filter(el => {
            const r = el.getBoundingClientRect();
            if (r.top + scrollY > 700 || r.height < 30 || r.width < innerWidth * 0.8) return false;
            const c = getComputedStyle(el).backgroundColor; return c === 'rgb(95, 45, 144)';
          }).length,
          shipBar: (() => { const w = document.querySelector('.essential_free_shipping_bar_wrapper.top_page'); if (!w) return null; const t = w.querySelector('[class*="free_shipping_bar_title"]'); return { bg: getComputedStyle(w).backgroundColor, h: Math.round(w.getBoundingClientRect().height), text: w.innerText.trim().slice(0, 80), color: t ? getComputedStyle(t).color : null, font: t ? getComputedStyle(t).fontSize + ' ' + getComputedStyle(t).fontFamily.slice(0, 20) : null }; })(),
          titleLines: bn ? Math.round(bn.querySelector('.ztbfcd__title').getBoundingClientRect().height / parseFloat(getComputedStyle(bn.querySelector('.ztbfcd__title')).lineHeight || 20)) : null,
          cardsWithoutNote: [...document.querySelectorAll('.product-grid > li, ul#product-grid > li')].filter(li => !li.querySelector('.ztbf-card')).map(li => (li.innerText || '').trim().split('\n')[0].slice(0, 60)),
          liquidErrors: (html.match(/Liquid error[^<]{0,120}/g) || []).slice(0, 5),
          sideScroll: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      await p.screenshot({ path: `${outDir}/${prof}-${name}-top.png` });
      if (name === 'home') {
        await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
        await p.waitForTimeout(800);
        await p.screenshot({ path: `${outDir}/${prof}-${name}-full.png`, fullPage: true, scale: 'css' });
      }
      report.push({ prof, name, status: resp && resp.status(), ...info });
    }
    if (errs.length) report.push({ prof, name: 'script-errors', errs });
    await ctx.close();
  }
  fs.writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 1));
  for (const r of report) console.log(JSON.stringify(r));
  await b.close();
})();
