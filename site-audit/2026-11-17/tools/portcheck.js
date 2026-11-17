// Verify the product-template port: buy-box parts, facts, BF price elements, errors, overflow. iPhone 13, 1x.
// Usage: node portcheck.js <themeId|live> <outdir> <comma-separated paths>
const { chromium, devices } = require('playwright');
const fs = require('fs');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/, /clarity\.ms/, /monorail-edge\.shopifysvc\.com/, /\/\.well-known\/shopify\/monorail/, /trekkie/, /\/web-pixels/, /privacy-banner/];
const THEME = process.argv[2];
const OUT = process.argv[3];
const paths = process.argv[4].split(',');
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });
  await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
  const report = [];
  for (const path of paths) {
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => { if (!/Failed to fetch/.test(e.message)) errs.push(e.message.slice(0, 160)); });
    const q = THEME === 'live' ? '' : `&preview_theme_id=${THEME}`;
    let status = null;
    try { const r = await p.goto(`https://zeotein.com${path}?zt_internal=1${q}`, { waitUntil: 'load', timeout: 60000 }); status = r && r.status(); } catch (e) { errs.push('goto: ' + e.message.slice(0, 100)); }
    await p.addStyleTag({ content: '#PBarNextFrameWrapper,#preview-bar-iframe,[id*="preview-bar"]{display:none!important}' }).catch(() => {});
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 0); }).catch(() => {});
    await p.waitForTimeout(1500);
    const info = await p.evaluate(() => {
      const vis = el => { if (!el) return false; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && !el.closest('[hidden]') && (r.width > 0 || r.height > 0); };
      const count = sel => { const all = [...document.querySelectorAll(sel)]; return `${all.filter(vis).length}/${all.length}`; };
      const text = document.body.innerText.replace(/\s+/g, ' ');
      const pick = re => { const m = text.match(re); return m ? m[0].slice(0, 90) : null; };
      return {
        themeId: window.Shopify && Shopify.theme && Shopify.theme.id,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        parts: { rating: count('.zt-rating'), formats: count('.zt-formats'), perk: count('.zt-perk'), trust: count('.zt-trust'), review: count('.zt-review'), sticky: count('.zt-sticky'), bfPanel: count('.ztbf-panel'), bfStrip: count('.ztbf-strip'), atc: count('form[action*="/cart/add"] [type="submit"], .product-form__submit') },
        quick: pick(/14g grass-fed collagen peptides[^.]*\.|23g protein\. Zero sugar\. 6 ingredients\.|20g plant protein\. Zero added sugar\. 5 ingredients\./),
        fat: pick(/Total Fat:? ?[\d.]+ ?g/), cal: pick(/Calories:? ?\d+/), serving: pick(/Serving size:? ?[^A-Z]{0,30}/),
        ingredient: pick(/(Grass-fed bovine collagen peptides|Organic hemp protein powder)/),
        collagenMentions: (text.match(/collagen/gi) || []).length,
        brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.offsetParent !== null && !/judge/.test(i.currentSrc)).length,
      };
    }).catch(e => ({ evalError: e.message }));
    const slug = path.replace(/[\/?=&]+/g, '_');
    await p.screenshot({ path: `${OUT}/${slug}.png`, fullPage: false }).catch(() => {});
    await p.evaluate(() => scrollTo(0, 560)).catch(() => {});
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${OUT}/${slug}-2.png`, fullPage: false }).catch(() => {});
    report.push({ path, status, ...info, errs });
    console.log(JSON.stringify({ path, status, ...info, errs }));
    await p.close();
    await new Promise(r => setTimeout(r, 2500));
  }
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
  await b.close();
})();
