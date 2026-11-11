// Preview both blocks in the real landing page context: loads gift.zeotein.com/holiday-guide-opt-in-landing-page,
// swaps the native GHL form for the one-step block, adds the pop-up, mocks the relay. Nothing is posted to GHL.
const { chromium, devices } = require('playwright'); const fs = require('fs'), path = require('path');
const LP = 'https://gift.zeotein.com/holiday-guide-opt-in-landing-page';
const popup = fs.readFileSync(path.join(__dirname, 'inject-popup.html'), 'utf8');
const lpForm = fs.readFileSync(path.join(__dirname, 'inject-lp.html'), 'utf8');
const out = path.join(__dirname, 'screens');
async function inject(p) {
  await p.evaluate(([popup, lpForm]) => {
    const add = (html, where) => { const t = document.createElement('div'); t.innerHTML = html; [...t.childNodes].forEach(n => { if (n.tagName === 'SCRIPT') { const s = document.createElement('script'); s.textContent = n.textContent; where.appendChild(s); } else where.appendChild(n); }); };
    const native = document.querySelector('#_builder-form .form-side') || document.querySelector('#_builder-form');
    if (native) { [...native.children].forEach(c => c.style.display = 'none'); add(lpForm, native); }
    add(popup, document.body);
  }, [popup, lpForm]);
}
(async () => { const b = await chromium.launch();
  for (const [n, o] of [['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }], ['mobile', { ...devices['iPhone 13'] }]]) {
    const c = await b.newContext(o); await c.route('https://relay.mock/**', r => r.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"ok":true}' }));
    const p = await c.newPage();
    await p.goto(LP + '?zt_popup=1', { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(2500); await inject(p);
    await p.waitForSelector('#zt-hp.is-open'); await p.waitForTimeout(1500);
    await p.screenshot({ path: `${out}/lp-${n}-popup.png` });
    console.log(n, 'layout', await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, sx: scrollX, form: Math.round(document.querySelector('#zt-hg-lp').getBoundingClientRect().width) })));
    await p.evaluate(() => document.querySelector('#zt-hp .zt-hp__later').click()); await p.waitForTimeout(500);
    const f = await p.$('#zt-hg-lp'); await f.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
    if (n === 'mobile') await p.evaluate(() => window.scrollBy(0, -120));
    await p.screenshot({ path: `${out}/lp-${n}-form.png` });
    // submit LP form end to end against the mock relay and confirm Lead fired
    const leads = await p.evaluate(async () => { window.__l = 0; const o = window.fbq; window.fbq = function (a, e) { if (e === 'Lead') window.__l++; return o && o.apply(this, arguments); };
      const F = document.querySelector('#zt-hg-lp form'); F.firstName.value = 'Preview'; F.email.value = 'preview@example.com'; F.querySelector('.zt-hg-btn').click();
      await new Promise(r => setTimeout(r, 800)); return { lead: window.__l, done: !document.querySelector('#zt-hg-lp .zt-hg-lp__done').hidden }; });
    console.log(n, 'native pixel:', await p.evaluate(() => typeof window.fbq), leads);
    await c.close(); }
  await b.close(); })();
