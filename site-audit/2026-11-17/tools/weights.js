// List every script, font and stylesheet a page downloads, with transfer size, sorted.
// Usage: node weights.js <url>
const { chromium, devices } = require('playwright');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/,
  /googleadservices\.com/, /doubleclick\.net/, /clarity\.ms/, /analytics\.tiktok\.com/, /monorail-edge\.shopifysvc\.com/,
  /\/\.well-known\/shopify\/monorail/, /\/api\/collect/, /bat\.bing\.com/, /trekkie/, /\/web-pixels/,
  /a\.klaviyo\.com\/client\/events/, /static-tracking\.klaviyo\.com/];
(async () => {
  const [,, url] = process.argv;
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  const meta = {}; const rows = [];
  cdp.on('Network.responseReceived', e => { meta[e.requestId] = { url: e.response.url, type: e.type }; });
  cdp.on('Network.loadingFinished', e => { const m = meta[e.requestId]; if (m) rows.push({ ...m, kb: e.encodedDataLength / 1024 }); });
  await p.goto(url, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(6000);
  const pick = t => rows.filter(r => r.type === t).sort((a, b) => b.kb - a.kb);
  const fmt = r => `${r.kb.toFixed(1).padStart(7)} KB  ${r.url.replace(/^https?:\/\//, '').replace(/\?.*$/, '').slice(0, 120)}`;
  for (const t of ['Script', 'Font', 'Stylesheet']) {
    const list = pick(t); const tot = list.reduce((s, r) => s + r.kb, 0);
    console.log(`\n== ${t}: ${list.length} files, ${tot.toFixed(0)} KB`);
    list.slice(0, t === 'Script' ? 25 : 14).forEach(r => console.log(fmt(r)));
    // by host
    const host = {}; list.forEach(r => { const h = r.url.split('/')[2] + (r.url.includes('/extensions/') ? ' (app ext: ' + (r.url.split('/extensions/')[1] || '').split('/')[1] + ')' : ''); host[h] = (host[h] || 0) + r.kb; });
    console.log('  by host:', Object.entries(host).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([h, k]) => `${h} ${k.toFixed(0)}KB`).join(' | '));
  }
  await b.close();
})();
