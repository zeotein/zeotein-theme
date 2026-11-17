// Screenshots live vs hotfix preview for given paths; reports key DOM facts.
const { chromium, devices } = require('playwright');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/, /googleadservices\.com/, /doubleclick\.net/, /clarity\.ms/, /analytics\.tiktok\.com/, /monorail-edge\.shopifysvc\.com/, /\/\.well-known\/shopify\/monorail/, /\/api\/collect/, /bat\.bing\.com/, /trekkie/, /\/web-pixels/, /a\.klaviyo\.com\/client\/events/, /static-tracking\.klaviyo\.com/];
const [,, themeId, outDir, ...paths] = process.argv;
require('fs').mkdirSync(outDir, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const prof of ['desktop', 'phone']) {
    const ctx = await b.newContext(prof === 'phone' ? { ...devices['iPhone 13'], deviceScaleFactor: 1 } : { viewport: { width: 1440, height: 900 } });
    await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => { if (!/Failed to fetch/.test(e.message)) errs.push(e.message.slice(0, 160)); });
    // set preview cookie once
    if (themeId !== 'live') { await p.goto(`https://zeotein.com/?preview_theme_id=${themeId}`, { waitUntil: 'load' }); await p.waitForTimeout(1500); }
    for (const path of paths) {
      const url = `https://zeotein.com${path}${themeId !== 'live' ? (path.includes('?') ? '&' : '?') + 'preview_theme_id=' + themeId : ''}`;
      await p.goto(url, { waitUntil: 'load', timeout: 60000 });
      await p.waitForTimeout(2500);
      const info = await p.evaluate(() => ({
        title: document.title.trim().slice(0, 80),
        h1: [...document.querySelectorAll('h1')].map(h => h.innerText.trim().slice(0, 60)),
        optOut: !!document.querySelector('#pc--optOutFormContainer'),
        optOutKids: (document.querySelector('#pc--optOutFormContainer') || { children: [] }).children.length,
        footerMenus: [...document.querySelectorAll('.z-footer__menu')].map(m => m.querySelector('.z-footer__menu-heading')?.innerText + ': ' + [...m.querySelectorAll('a')].map(a => a.innerText.trim()).join(' | ')),
        fat: (document.body.innerText.match(/Total Fat:?\s*[\d.]+\s*g/) || [''])[0],
        products: document.querySelectorAll('.product-grid > li, ul#product-grid > li').length,
        pagination: !!document.querySelector('.pagination'),
        diffHeading: (document.querySelector('.zeotein-how-it-works, [class*="how-it-works"]') || {}).className || null,
        themeIdInPage: (window.Shopify && Shopify.theme && Shopify.theme.id) || null,
      }));
      const slug = (path.replace(/[\/?=&]+/g, '_') || 'home');
      await p.screenshot({ path: `${outDir}/${prof}${slug}.png`, fullPage: false });
      // footer screenshot
      const f = await p.$('footer.z-footer');
      if (f) { await f.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); await f.screenshot({ path: `${outDir}/${prof}${slug}-footer.png` }); }
      console.log(prof, path, JSON.stringify(info));
    }
    if (errs.length) console.log(prof, 'JS errors:', errs);
    await ctx.close();
  }
  await b.close();
})();
