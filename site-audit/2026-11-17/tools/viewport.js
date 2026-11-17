const { chromium, devices } = require('playwright');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/, /googleadservices\.com/, /doubleclick\.net/, /clarity\.ms/, /analytics\.tiktok\.com/, /monorail-edge\.shopifysvc\.com/, /\/\.well-known\/shopify\/monorail/, /\/api\/collect/, /bat\.bing\.com/, /trekkie/, /\/web-pixels/, /a\.klaviyo\.com\/client\/events/, /static-tracking\.klaviyo\.com/];
(async () => {
  const [,, url, out, scrolls] = process.argv;
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });
  await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(3000);
  const ys = (scrolls || '0').split(',').map(Number);
  for (const y of ys) {
    await p.evaluate(y => window.scrollTo(0, y), y);
    await p.waitForTimeout(900);
    await p.screenshot({ path: out.replace('.png', `-y${y}.png`) });
  }
  // info about sticky bar
  const info = await p.evaluate(() => {
    const els = [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e); return s.position === 'fixed' && e.offsetHeight > 30 && e.offsetHeight < 400 && s.display !== 'none' && s.visibility !== 'hidden'; });
    return els.map(e => ({ tag: e.tagName, id: e.id, cls: String(e.className).slice(0, 80), top: Math.round(e.getBoundingClientRect().top), h: e.offsetHeight, op: getComputedStyle(e).opacity }));
  });
  console.log(JSON.stringify(info, null, 1));
  await b.close();
})();
