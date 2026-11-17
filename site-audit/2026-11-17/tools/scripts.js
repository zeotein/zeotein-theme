const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const reqs = [];
  p.on('response', async r => { const req = r.request(); if (req.resourceType() === 'script') { let len = 0; try { len = (await r.body()).length; } catch (e) {} reqs.push({ url: r.url(), len }); } });
  const blocked = [];
  p.on('requestfailed', r => { if (r.resourceType() === 'script') blocked.push(r.url().slice(0, 120)); });
  await p.goto(process.argv[2], { waitUntil: 'load', timeout: 90000 });
  await p.waitForTimeout(6000);
  const groups = {};
  for (const r of reqs) {
    const u = new URL(r.url);
    let key = u.host;
    const m = u.pathname.match(/\/extensions\/([0-9a-f-]+)\/([^/]+)\//); if (m) key = 'app-ext:' + m[2] + ':' + m[1].slice(0, 8);
    if (u.pathname.includes('/assets/') && u.host.includes('zeotein.com')) key = 'theme-assets';
    if (u.pathname.startsWith('/cdn/shopifycloud') || u.host === 'cdn.shopify.com' && u.pathname.startsWith('/shopifycloud')) key = 'shopifycloud';
    if (u.pathname.startsWith('/cdn/wpm') ) key = 'web-pixels';
    groups[key] = groups[key] || { n: 0, kb: 0 }; groups[key].n++; groups[key].kb += r.len / 1024;
  }
  const rows = Object.entries(groups).sort((a, b) => b[1].kb - a[1].kb);
  let tn = 0, tkb = 0; for (const [k, v] of rows) { tn += v.n; tkb += v.kb; console.log(String(v.n).padStart(4), String(Math.round(v.kb)).padStart(6) + 'KB', k); }
  console.log('TOTAL', tn, Math.round(tkb) + 'KB (decoded)');
  console.log('BLOCKED-IN-SANDBOX scripts:', blocked.length, [...new Set(blocked.map(x => new URL(x).host))].join(', '));
  const inline = await p.evaluate(() => [...document.scripts].filter(s => !s.src).reduce((a, s) => a + s.textContent.length, 0));
  console.log('inline script chars', inline);
  await b.close();
})();
