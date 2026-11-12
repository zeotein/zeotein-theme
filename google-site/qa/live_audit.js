// Rendered audit of the LIVE site after a GoHighLevel install. Read-only: it only loads pages.
//
//   node qa/live_audit.js [BASE=https://shop.zeotein.com] [OUT_DIR]
//
// Per page, on a 1440px desktop and an iPhone 13:
//   - exactly one Zeotein block and no other visible content (no leftover sections from the old pages)
//   - email links decoded by Cloudflare into working mailto links
//   - holds: no "zeolite" anywhere in the rendered page or its HTML, no $89.99, free shipping threshold still $150,
//     none of the retired offer copy ("Claim My 55% Off")
//   - no sideways scroll, no broken images, no JavaScript errors
// Analytics and ad tags are blocked so the audit does not show up as visits.
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const BASE = (process.argv[2] || 'https://shop.zeotein.com').replace(/\/$/, '');
const OUT = path.resolve(process.argv[3] || path.join(ROOT, 'reports/live-audit'));
fs.mkdirSync(OUT, { recursive: true });
const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/manifest.json'), 'utf8')).pages;
const TRACKERS = /(^|\.)(googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|facebook\.net|facebook\.com|clarity\.ms|bing\.com|tiktok\.com)$/;

(async () => {
  const browser = await chromium.launch();
  const rows = [];
  let fails = 0;
  for (const [vp, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['phone', { ...devices['iPhone 13'], deviceScaleFactor: 1 }]]) {
    const ctx = await browser.newContext(opts);
    await ctx.route('**/*', r => { let h = ''; try { h = new URL(r.request().url()).hostname; } catch (e) {} return TRACKERS.test(h) ? r.abort() : r.continue(); });
    for (const p of pages) {
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
      const resp = await page.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 90000 }).catch(e => null);
      await page.waitForTimeout(800);
      const raw = await page.content();
      const r = await page.evaluate(() => {
        const roots = [...document.querySelectorAll('.ztg')].filter(e => !e.parentElement.closest('.ztg'));
        const all = document.body.innerText || '';
        // Visible text outside the Zeotein block. Screen-reader-only elements (e.g. GoHighLevel's 1x1px, clipped Nuxt
        // route announcer that reads the page title aloud) are not visible content and are skipped.
        const outsideBits = [];
        document.querySelectorAll('body *').forEach(el => {
          if (el.closest('.ztg') || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) return;
          const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
          if (!own) return;
          const rc = el.getBoundingClientRect(), cs = getComputedStyle(el);
          const hidden = rc.width <= 2 || rc.height <= 2 || cs.visibility === 'hidden' || cs.display === 'none' || cs.clipPath === 'inset(50%)' || +cs.opacity === 0;
          if (!hidden) outsideBits.push(own);
        });
        const outside = outsideBits.join(' ');
        const imgs = [...document.querySelectorAll('.ztg img')];
        const mailto = [...document.querySelectorAll('.ztg a[href^="mailto:"]')].map(a => a.getAttribute('href'));
        const cfLeft = document.querySelectorAll('.ztg a[href*="email-protection"], .ztg .__cf_email__').length;
        return {
          roots: roots.length,
          outsideText: outside.replace(/\s+/g, ' ').trim().slice(0, 200),
          overflowPx: document.documentElement.scrollWidth - window.innerWidth,
          brokenImages: imgs.filter(i => i.loading !== 'lazy' && i.complete && !i.naturalWidth).map(i => i.src).slice(0, 5),
          mailtoCount: mailto.length, mailtoOk: mailto.every(h => /^mailto:hello@zeotein\.com(\?|$)/.test(h)), cfUndecoded: cfLeft,
          text: all,
        };
      });
      const holds = {
        noZeolite: !/zeolite/i.test(r.text) && !/zeolite/i.test(raw),
        no8999: !r.text.includes('89.99') && !raw.includes('89.99'),
        threshold150: /orders over \$150/.test(r.text),
        noOldOffer: !/Claim My 55% Off/i.test(r.text),
      };
      const ok = resp && resp.status() === 200 && r.roots === 1 && !r.outsideText && r.overflowPx <= 0 && !r.brokenImages.length &&
        r.mailtoOk && r.mailtoCount > 0 && !r.cfUndecoded && !errors.length && Object.values(holds).every(Boolean);
      if (!ok) fails++;
      delete r.text;
      rows.push({ viewport: vp, path: p.path, status: resp ? resp.status() : 'no response', ok, ...r, holds, jsErrors: errors });
      if (['/home', '/cacao', '/single-ingredients'].includes(p.path)) await page.screenshot({ path: path.join(OUT, `live-${p.slug}-${vp}.png`) });
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'live-audit.json'), JSON.stringify({ ranAt: new Date().toISOString(), base: BASE, checked: rows.length, failed: fails, rows }, null, 1));
  rows.filter(r => !r.ok).forEach(r => console.log('FAIL', r.viewport, r.path, JSON.stringify(r).slice(0, 400)));
  console.log(`${rows.length - fails} of ${rows.length} page views pass  ->  ${path.join(OUT, 'live-audit.json')}`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
