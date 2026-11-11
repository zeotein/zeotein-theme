// Screenshots of the pop-up + landing form on the local LP mock (mock relay).
const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.statusCode = 404; return r.end(); } r.setHeader('Content-Type', f.endsWith('.html') ? 'text/html' : 'image/webp'); r.end(d); }); }).listen(8770);
(async () => { const b = await chromium.launch();
  for (const [n, o] of [['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }], ['mobile', { ...devices['iPhone 13'] }], ['mobile-se', { ...devices['iPhone SE'] }]]) {
    const c = await b.newContext(o); const p = await c.newPage();
    await p.goto('http://localhost:8770/qa/preview-lp.html?zt_popup=1'); await p.waitForSelector('#zt-hp.is-open'); await p.waitForTimeout(1200);
    await p.screenshot({ path: `${__dirname}/screens/mock-${n}-popup.png` });
    console.log(n, await p.evaluate(() => { const r = document.querySelector('#zt-hp .zt-hg-btn').getBoundingClientRect(), c = document.querySelector('.zt-hp__cover').getBoundingClientRect(); return { btnBottom: Math.round(r.bottom), vh: innerHeight, cover: [Math.round(c.width), Math.round(c.height)] }; }));
    await c.close(); }
  await b.close(); srv.close(); })();
