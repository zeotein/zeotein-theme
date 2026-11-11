// Functional + visual QA for the holiday pop-up (mock relay).
const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'screens'); fs.mkdirSync(out, { recursive: true });
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.statusCode = 404; return r.end(); } r.setHeader('Content-Type', f.endsWith('.html') ? 'text/html' : f.endsWith('.webp') ? 'image/webp' : 'text/plain'); r.end(d); }); }).listen(8765);
const URL = 'http://localhost:8765/qa/preview-lp.html';
const results = []; const ok = (n, c) => { results.push([c ? 'PASS' : 'FAIL', n]); };
async function ctx(b, opts) { const c = await b.newContext(opts); const posts = []; await c.route('**/mock', async r => { posts.push(JSON.parse(r.request().postData())); await r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); }); return { c, posts }; }
(async () => {
  const b = await chromium.launch();
  // 1. One-step form, desktop + mobile
  for (const [name, opts] of [['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }], ['mobile', { ...devices['iPhone 13'] }]]) {
    const { c, posts } = await ctx(b, opts); const p = await c.newPage();
    await p.addInitScript(() => { window.__fb = []; window.fbq = function () { window.__fb.push([].slice.call(arguments)); }; });
    await p.goto(URL + '?zt_popup=1'); await p.waitForSelector('#zt-hp.is-open'); await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/${name}-form.png` });
    ok(`${name}: consent box unchecked by default`, !(await p.isChecked('#zt-hp input[name=smsConsent]')));
    await p.click('#zt-hp .zt-hg-btn'); ok(`${name}: blocks empty submit`, posts.length === 0);
    await p.fill('#zt-hp input[name=firstName]', 'QA'); await p.fill('#zt-hp input[name=email]', 'qa@example.com');
    await p.check('#zt-hp input[name=smsConsent]'); await p.click('#zt-hp .zt-hg-btn');
    ok(`${name}: blocks consent without phone`, posts.length === 0);
    await p.fill('#zt-hp input[name=phone]', '555 01'); await p.click('#zt-hp .zt-hg-btn');
    ok(`${name}: blocks short phone`, posts.length === 0);
    ok(`${name}: no Pixel Lead before success`, (await p.evaluate(() => window.__fb.length)) === 0);
    await p.fill('#zt-hp input[name=phone]', '(555) 555-0123'); await p.click('#zt-hp .zt-hg-btn');
    await p.waitForSelector('.zt-hp__s2:not([hidden])'); await p.waitForTimeout(300);
    const q = posts[0] || {};
    ok(`${name}: popup posts source holiday-popup`, q.source === 'holiday-popup');
    ok(`${name}: one request with email + phone + consent`, posts.length === 1 && q.email === 'qa@example.com' && q.phone === '+15555550123' && q.smsConsent === true && /Reply STOP to opt out/.test(q.consentText));
    const fb = await p.evaluate(() => window.__fb);
    ok(`${name}: Pixel Lead fired once on success`, fb.length === 1 && fb[0][0] === 'track' && fb[0][1] === 'Lead');
    await p.screenshot({ path: `${out}/${name}-done.png` });
    // phone typed but box left unchecked -> phone NOT sent
    const p3 = await c.newPage(); await p3.goto(URL + '?zt_popup=1'); await p3.waitForSelector('#zt-hp.is-open');
    await p3.fill('#zt-hp input[name=firstName]', 'QA2'); await p3.fill('#zt-hp input[name=email]', 'qa2@example.com'); await p3.fill('#zt-hp input[name=phone]', '5555550123');
    await p3.click('#zt-hp .zt-hg-btn'); await p3.waitForTimeout(500);
    ok(`${name}: phone without consent is not sent`, posts[1] && !posts[1].phone && !posts[1].smsConsent);
    const p2 = await c.newPage(); await p2.goto(URL); await p2.waitForTimeout(500);
    ok(`${name}: submitted flag stored`, /submitted/.test(await p2.evaluate(() => localStorage.getItem('zt_hp_v1'))));
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
    await p.click('#zt-hp .zt-hp__later'); await p.waitForTimeout(400);
    ok('desktop: Maybe later closes + sets 7-day dismiss', await p.evaluate(() => document.getElementById('zt-hp').hidden && /dismissed/.test(localStorage.getItem('zt_hp_v1'))));
    await p.reload(); await p.waitForTimeout(9000); await exit(); await p.waitForTimeout(300);
    ok('desktop: stays suppressed after dismiss', await p.evaluate(() => document.getElementById('zt-hp').hidden)); await c.close(); }
  // 3. Mobile: 35s timer only
  { const { c } = await ctx(b, { ...devices['iPhone 13'] }); const p = await c.newPage(); await p.goto(URL);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * .8)); await p.waitForTimeout(30000);
    ok('mobile: not shown at 30s', await p.evaluate(() => document.getElementById('zt-hp').hidden));
    await p.waitForTimeout(6000);
    ok('mobile: shown at ~35s', await p.evaluate(() => !document.getElementById('zt-hp').hidden)); await c.close(); }
  // 4. email/sms traffic suppressed
  { const { c } = await ctx(b, { viewport: { width: 1440, height: 900 } }); const p = await c.newPage(); await p.goto(URL + '?utm_source=ghl&utm_medium=email');
    await p.waitForTimeout(9000); await p.evaluate(() => document.dispatchEvent(new MouseEvent('mouseout', { clientY: -5 }))); await p.waitForTimeout(300);
    ok('suppressed for visitors from our own email/SMS', await p.evaluate(() => document.getElementById('zt-hp').hidden)); await c.close(); }
  // 5. Landing page one-step form (inline, no pop-up trigger involved)
  for (const [name, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobile', { ...devices['iPhone 13'] }]]) {
    const { c, posts } = await ctx(b, opts); const p = await c.newPage();
    await p.addInitScript(() => { window.__fb = []; window.fbq = function () { window.__fb.push([].slice.call(arguments)); }; });
    await p.goto(URL); const F = '#zt-hg-lp ';
    ok(`LP ${name}: consent unchecked by default`, !(await p.isChecked(F + 'input[name=smsConsent]')));
    await p.fill(F + 'input[name=firstName]', 'LP'); await p.fill(F + 'input[name=email]', 'lp@example.com');
    await p.check(F + 'input[name=smsConsent]'); await p.click(F + '.zt-hg-btn');
    ok(`LP ${name}: blocks consent without phone`, posts.length === 0);
    await p.fill(F + 'input[name=phone]', '555-555-0123'); await p.click(F + '.zt-hg-btn'); await p.waitForTimeout(500);
    const q = posts[0] || {};
    ok(`LP ${name}: one request, source holiday-guide-lp, phone+consent`, posts.length === 1 && q.source === 'holiday-guide-lp' && q.phone === '+15555550123' && q.smsConsent === true);
    const fb = await p.evaluate(() => window.__fb);
    ok(`LP ${name}: Pixel Lead fired once`, fb.length === 1 && fb[0][1] === 'Lead');
    ok(`LP ${name}: success message shown`, await p.isVisible('#zt-hg-lp .zt-hg-done'));
    // after LP submit, the pop-up must never open
    await p.evaluate(() => document.dispatchEvent(new MouseEvent('mouseout', { clientY: -5 }))); await p.waitForTimeout(9000);
    await p.evaluate(() => document.dispatchEvent(new MouseEvent('mouseout', { clientY: -5 }))); await p.waitForTimeout(300);
    ok(`LP ${name}: pop-up suppressed after LP signup`, await p.evaluate(() => document.getElementById('zt-hp').hidden));
    await c.close();
  }
  await b.close(); srv.close();
  results.forEach(r => console.log(r.join('  '))); fs.writeFileSync(path.join(__dirname, 'popup-check.json'), JSON.stringify(results, null, 1));
  process.exit(results.some(r => r[0] === 'FAIL') ? 1 : 0);
})();
