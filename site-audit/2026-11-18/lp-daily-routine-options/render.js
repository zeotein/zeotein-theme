// Renders the "Simplify your daily routine." replacement options inside the real Black Friday landing page (preview only,
// nothing is saved to any theme). For each device: screenshot of the current section ("before"), then each option swapped
// into the same spot, with a strip of the sections above and below for context.
// Usage: node render.js <outDir> [iphone,desktop]
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const [,, outDir = '.', which = 'iphone,desktop'] = process.argv;
const URL = 'https://zeotein.com/products/30-day-cacao-bulk-bag-black-friday?zt_internal=1&preview_theme_id=187825914069';
const BLOCK = /facebook\.com\/tr|connect\.facebook\.net|google-analytics\.com|googletagmanager\.com|googleadservices\.com|doubleclick\.net|clarity\.ms|analytics\.tiktok\.com|monorail-edge\.shopifysvc\.com|\/\.well-known\/shopify\/monorail|\/api\/collect|bat\.bing\.com|trekkie|\/web-pixels|a\.klaviyo\.com\/client\/events|static-tracking\.klaviyo\.com/;
const OPTIONS = ['option-1-taste.html', 'option-2-routine.html', 'option-3-customers.html'];
const HIDE = '#shopify-pc__banner, #PBarNextFrameWrapper, #preview-bar-iframe, .zt-sticky-offer, [data-zt-sticky-offer], #bon-loyalty-btn, iframe[title*="chat" i] { display: none !important; }';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const passChallenge = async (p) => { for (let i = 0; i < 25; i++) { const t = await p.title().catch(() => ''); if (!/just a moment|attention required/i.test(t)) return true; await sleep(2000); if (i === 12) await p.reload({ waitUntil: 'load' }).catch(() => {}); } return false; };
fs.mkdirSync(outDir, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const report = [];
  const profiles = { iphone: { ...devices['iPhone 13'] }, desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' } };
  for (const prof of which.split(',')) {
    const ctx = await b.newContext(profiles[prof]);
    await ctx.route('**/*', r => BLOCK.test(r.request().url()) ? r.abort() : r.continue());
    const p = await ctx.newPage();
    const resp = await p.goto(URL, { waitUntil: 'load', timeout: 90000 }); await passChallenge(p); await sleep(4000);
    await p.addStyleTag({ content: HIDE }).catch(() => {});
    // scroll through once so lazy images above and below the section load
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await sleep(1500);
    const info = await p.evaluate(() => { const w = document.querySelector('[id$="__daily_routine_cacao_lp_FbdPWk"]') || document.querySelector('[id*="daily_routine_cacao_lp"]'); return w ? { id: w.id, theme: window.Shopify && Shopify.theme && Shopify.theme.id } : null; });
    report.push({ prof, status: resp && resp.status(), info });
    if (!info) { console.log('section not found', prof); await ctx.close(); continue; }
    const shoot = async (name) => {
      await p.evaluate(async (id) => { const w = document.getElementById(id); await document.fonts.ready; await Promise.all([...w.querySelectorAll('img')].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; }))); w.scrollIntoView(); }, info.id);
      await sleep(900);
      const r = await p.evaluate((id) => { const e = document.getElementById(id).getBoundingClientRect(); return { top: e.top + window.scrollY, h: e.height, w: document.documentElement.clientWidth }; }, info.id);
      const pad = prof === 'iphone' ? 90 : 120;
      const clip = { x: 0, y: Math.max(0, Math.round(r.top - pad)), width: r.w, height: Math.round(r.h + pad * 2) };
      const file = path.join(outDir, `${prof}-${name}.jpg`);
      await p.screenshot({ path: file, type: 'jpeg', quality: 84, fullPage: true, clip });
      report.push({ prof, name, sectionHeight: Math.round(r.h), file });
    };
    await shoot('0-current');
    for (const opt of OPTIONS) {
      const html = fs.readFileSync(path.join(__dirname, opt), 'utf8');
      await p.evaluate(([id, h]) => { document.getElementById(id).innerHTML = h; }, [info.id, html]);
      await shoot(opt.replace('.html', ''));
    }
    await ctx.close();
  }
  console.log(JSON.stringify(report, null, 1));
  await b.close();
})();
