// What does the SEOAnt Sticky Add to Cart app embed put on a page? Elements, visibility, network requests.
// Usage: node seoant.js <url> [desktop]
const { chromium, devices } = require('playwright');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/,
  /googleadservices\.com/, /doubleclick\.net/, /clarity\.ms/, /analytics\.tiktok\.com/, /monorail-edge\.shopifysvc\.com/,
  /\/\.well-known\/shopify\/monorail/, /\/api\/collect/, /bat\.bing\.com/, /trekkie/, /\/web-pixels/,
  /a\.klaviyo\.com\/client\/events/, /static-tracking\.klaviyo\.com/];
(async () => {
  const [,, url, mode] = process.argv;
  const b = await chromium.launch();
  const ctx = await b.newContext(mode === 'desktop' ? { viewport: { width: 1366, height: 900 } } : { ...devices['iPhone 13'] });
  const reqs = [];
  await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
  const p = await ctx.newPage();
  p.on('request', r => { const u = r.url(); if (/seoant|giraffly|sticky|currency/i.test(u)) reqs.push(r.method() + ' ' + u.slice(0, 160)); });
  await p.goto(url, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(4000);
  for (const y of [600, 1500, 2600]) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(800); }
  const els = await p.evaluate(() => [...document.querySelectorAll('[id*="seoant" i],[class*="seoant" i],[id*="sticky_cart" i],[class*="sticky-cart" i],[id*="giraff" i],[class*="giraff" i],[id*="stickycart" i],[class*="stickycart" i]')]
    .map(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect();
      return { tag: e.tagName, id: e.id.slice(0, 50), cls: String(e.className).slice(0, 70), display: s.display, vis: s.visibility, op: s.opacity, pos: s.position, w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top) }; })
    .slice(0, 15));
  const globals = await p.evaluate(() => Object.keys(window).filter(k => /seoant|sticky|giraff|currencyconverter|autohide/i.test(k)).slice(0, 20));
  console.log(JSON.stringify({ url, mode: mode || 'iphone', elements: els, globals, requests: reqs.slice(0, 15) }, null, 1));
  await b.close();
})();
