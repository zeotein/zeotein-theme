// After-publish proof on iPhone 13: Hemp Nutrition Facts, landing page first screen, shipping-bar wording. 3 page loads.
const { chromium, devices } = require('playwright');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/, /clarity\.ms/, /monorail-edge\.shopifysvc\.com/, /\/\.well-known\/shopify\/monorail/, /trekkie/, /\/web-pixels/, /bat\.bing\.com/, /analytics\.tiktok\.com/];
const out = process.argv[2];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
  const p = await ctx.newPage();
  await p.goto('https://zeotein.com/products/organic-hemp-protein-powder-premium-plant-based-protein?zt_internal=1', { waitUntil: 'load', timeout: 90000 });
  await p.waitForTimeout(3000);
  console.log('hemp theme', await p.evaluate(() => window.Shopify && Shopify.theme && Shopify.theme.id));
  await p.evaluate(() => document.querySelectorAll('details').forEach(d => { if (/nutrition|ingredient/i.test((d.querySelector('summary') || {}).innerText || '')) d.open = true; }));
  await p.waitForTimeout(600);
  const box = await p.evaluate(() => { const ds = [...document.querySelectorAll('details')].filter(d => d.open && /nutrition|ingredient/i.test((d.querySelector('summary') || {}).innerText || '')); if (!ds.length) return null; const a = ds[0].getBoundingClientRect(), z = ds[ds.length - 1].getBoundingClientRect(); return { top: a.top + scrollY, h: z.bottom - a.top }; });
  if (box) { await p.evaluate(y => scrollTo(0, y - 10), box.top); await p.waitForTimeout(500); await p.screenshot({ path: `${out}/after-live-mobile-hemp-facts.png`, clip: { x: 0, y: 0, width: 390, height: Math.min(844, box.h + 20) } }); }
  console.log('hemp facts', await p.evaluate(() => [...document.querySelectorAll('details')].filter(d => d.open && /nutrition/i.test((d.querySelector('summary') || {}).innerText || '')).map(d => d.innerText.replace(/\s+/g, ' ').slice(0, 140)).join(' | ')));
  await p.goto('https://zeotein.com/products/cacao-protein-starter-kit?zt_internal=1', { waitUntil: 'load', timeout: 90000 });
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${out}/after-live-mobile-lp-top.png` });
  await p.goto('https://zeotein.com/?zt_internal=1', { waitUntil: 'load', timeout: 90000 });
  await p.waitForTimeout(5000);
  console.log('shipping wording', await p.evaluate(() => { const t = document.body.innerText; return { old: /U\.S only/.test(t), fixed: /U\.S\. only/.test(t), sample: (t.match(/[^\n]{0,60}U\.S\.? only[^\n]{0,20}/) || [''])[0] }; }));
  await b.close();
})();
