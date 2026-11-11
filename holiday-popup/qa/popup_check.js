// Functional + visual QA for the holiday pop-up (mock relay).
const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'screens'); fs.mkdirSync(out, { recursive: true });
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.statusCode = 404; return r.end(); } r.setHeader('Content-Type', f.endsWith('.html') ? 'text/html' : f.endsWith('.webp') ? 'image/webp' : 'text/plain'); r.end(d); }); }).listen(8765);
const URL = 'http://localhost:8765/qa/preview.html';
const results = []; const ok = (n, c) => { results.push([c ? 'PASS' : 'FAIL', n]); };
async function ctx(b, opts) { const c = await b.newContext(opts); const posts = []; await c.route('**/mock', async r => { posts.push(JSON.parse(r.request().postData())); await r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); }); return { c, posts }; }
(async () => {
  const b = await chromium.launch();
  // 1. Desktop flow via preview flag
  for (const [name, opts] of [['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }], ['mobile', { ...devices['iPhone 13'] }]]) {
    const { c, posts } = await ctx(b, opts); const p = await c.newPage();
    await p.goto(URL + '?zt_popup=1'); await p.waitForSelector('#zt-hp.is-open'); await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/${name}-step1.png` });
    await p.click('.zt-hp__s1 .zt-hp__btn'); ok(`${name}: blocks empty submit`, (await p.textContent('.zt-hp__s1 .zt-hp__err')).includes('first name') && posts.length === 0);
    await p.fill('input[name=firstName]', 'QA'); await p.fill('input[name=email]', 'bad@'); await p.click('.zt-hp__s1 .zt-hp__btn');
    ok(`${name}: blocks bad email`, posts.length === 0);
    await p.fill('input[name=email]', 'qa@example.com'); await p.click('.zt-hp__s1 .zt-hp__btn');
    await p.waitForSelector('.zt-hp__s2:not([hidden])'); await p.waitForTimeout(300);
    ok(`${name}: step1 payload`, posts[0] && posts[0].step === 'email' && posts[0].email === 'qa@example.com' && posts[0].firstName === 'QA');
    await p.screenshot({ path: `${out}/${name}-step2.png` });
    await p.fill('input[name=phone]', '555 01'); await p.click('.zt-hp__s2 .zt-hp__btn'); ok(`${name}: blocks short phone`, posts.length === 1);
    await p.fill('input[name=phone]', '(555) 555-0123'); await p.click('.zt-hp__s2 .zt-hp__btn'); await p.waitForTimeout(400);
    ok(`${name}: step2 payload + consent text`, posts[1] && posts[1].phone === '+15555550123' && /Reply STOP to opt out/.test(posts[1].consentText) && posts[1].email === 'qa@example.com');
    await p.screenshot({ path: `${out}/${name}-done.png` });
    // suppression after submit
    const p2 = await c.newPage(); await p2.goto(URL); await p2.waitForTimeout(500);
    const st = await p2.evaluate(() => localStorage.getItem('zt_hp_v1')); ok(`${name}: submitted flag stored`, /submitted/.test(st));
    await c.close();
  }
  // 2. Desktop exit intent: must NOT fire in first 8s, must fire after
  { const { c } = await ctx(b, { viewport: { width: 1440, height: 900 } }); const p = await c.newPage(); await p.goto(URL);
    const exit = () => p.evaluate(() => document.dispatchEvent(new MouseEvent('mouseout', { clientY: -5, relatedTarget: null, bubbles: true })));
    await p.waitForTimeout(2000); await exit(); await p.waitForTimeout(300);
    ok('desktop: exit intent ignored before 8s', await p.evaluate(() => document.getElementById('zt-hp').hidden));
    await p.mouse.move(700, 400); await p.waitForTimeout(15000);
    ok('desktop: no time/scroll trigger (exit-only)', await p.evaluate(() => document.getElementById('zt-hp').hidden));
    await exit(); await p.waitForTimeout(400); ok('desktop: exit intent opens after 8s', await p.evaluate(() => !document.getElementById('zt-hp').hidden));
    await p.click('.zt-hp__s1 .zt-hp__later'); await p.waitForTimeout(400);
    ok('desktop: Maybe later closes + sets 7-day dismiss', await p.evaluate(() => document.getElementById('zt-hp').hidden && /dismissed/.test(localStorage.getItem('zt_hp_v1'))));
    await p.reload(); await p.waitForTimeout(9000); await exit(); await p.waitForTimeout(300);
    ok('desktop: stays suppressed after dismiss', await p.evaluate(() => document.getElementById('zt-hp').hidden)); await c.close(); }
  // 3. Mobile: not before 25s, fires after 25s + 40% scroll
  { const { c } = await ctx(b, { ...devices['iPhone 13'] }); const p = await c.newPage(); await p.goto(URL);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * .6)); await p.waitForTimeout(3000);
    ok('mobile: not shown at 3s even with scroll', await p.evaluate(() => document.getElementById('zt-hp').hidden));
    await p.waitForTimeout(23000); await p.evaluate(() => window.scrollBy(0, 10)); await p.waitForTimeout(500);
    ok('mobile: shown after 25s + 40% scroll', await p.evaluate(() => !document.getElementById('zt-hp').hidden)); await c.close(); }
  // 4. email/sms traffic suppressed
  { const { c } = await ctx(b, { viewport: { width: 1440, height: 900 } }); const p = await c.newPage(); await p.goto(URL + '?utm_source=ghl&utm_medium=email');
    await p.waitForTimeout(9000); await p.evaluate(() => document.dispatchEvent(new MouseEvent('mouseout', { clientY: -5 }))); await p.waitForTimeout(300);
    ok('suppressed for visitors from our own email/SMS', await p.evaluate(() => document.getElementById('zt-hp').hidden)); await c.close(); }
  await b.close(); srv.close();
  results.forEach(r => console.log(r.join('  '))); fs.writeFileSync(path.join(__dirname, 'popup-check.json'), JSON.stringify(results, null, 1));
  process.exit(results.some(r => r[0] === 'FAIL') ? 1 : 0);
})();
