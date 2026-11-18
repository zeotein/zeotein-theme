// Sticky Add to cart bar check on phones (18 Nov 2026, Dana: no guarantee line in the sticky bar, keep it everywhere else).
// Usage: node sticky-check.js <outDir> <themeId|live>
// iPhone 13, every blend product page: scroll past the main Add to cart, the sticky bar slides in. Records the bar's text,
// whether the guarantee element exists, and whether "30 days to try it" still shows under the main Add to cart button.
// On the Cacao bag page it also taps the sticky bar's Add to cart and reads /cart.js, then clears the cart (no checkout).
const { chromium, devices } = require('playwright');
const fs = require('fs');
const [,, outDir, theme = 'live'] = process.argv;
const BLOCK = /facebook\.com\/tr|connect\.facebook\.net|google-analytics\.com|googletagmanager\.com|googleadservices\.com|doubleclick\.net|clarity\.ms|analytics\.tiktok\.com|monorail-edge\.shopifysvc\.com|\/\.well-known\/shopify\/monorail|\/api\/collect|bat\.bing\.com|trekkie|\/web-pixels|a\.klaviyo\.com\/client\/events|static-tracking\.klaviyo\.com/;
const url = p => 'https://zeotein.com' + p + '?zt_internal=1' + (theme !== 'live' ? '&preview_theme_id=' + theme : '');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const passChallenge = async (p) => { for (let i = 0; i < 25; i++) { const t = await p.title().catch(() => ''); if (!/just a moment|attention required/i.test(t)) return true; await sleep(2000); if (i === 12) await p.reload({ waitUntil: 'load' }).catch(() => {}); } return false; };
// Shopify's preview bar and cookie banner only exist in a preview session; hide them so the page looks like the live store.
const hidePreviewChrome = (p) => p.addStyleTag({ content: '#shopify-pc__banner, #PBarNextFrameWrapper, #preview-bar-iframe { display: none !important; }' }).catch(() => {});
const PAGES = ['zeotein-cacao-bag-30', 'zeotein-cacao-sticks-30', 'zeotein-cacao-sticks-7', 'zeotein-vegan-sticks-30', 'zeotein-vegan-sticks-7'];
fs.mkdirSync(outDir, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  await ctx.route('**/*', r => BLOCK.test(r.request().url()) ? r.abort() : r.continue());
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => { if (!/Failed to fetch|Load failed|NetworkError/i.test(e.message)) errs.push(e.message.slice(0, 160) + ' on ' + p.url().replace(/\?.*/, '')); });
  const out = { theme, pages: [] };
  for (const h of PAGES) {
    const r = { page: h };
    try {
      const resp = await p.goto(url('/products/' + h), { waitUntil: 'load', timeout: 90000 }); await passChallenge(p); await sleep(3500);
      r.status = resp && resp.status();
      await hidePreviewChrome(p);
      r.themeId = await p.evaluate(() => (window.Shopify && Shopify.theme) ? Shopify.theme.id + ' ' + Shopify.theme.role : null);
      r.liquidErrors = await p.evaluate(() => (document.documentElement.outerHTML.match(/Liquid error/g) || []).length);
      r.underMainButton = await p.evaluate(() => { const els = [...document.querySelectorAll('#MainContent *')].filter(e => e.children.length === 0 && /30 days to try it/.test(e.textContent) && !e.closest('.zt-sticky')); return els.length ? els[0].closest('li, p, div').innerText.trim().slice(0, 80) : null; });
      await p.evaluate(() => { const m = document.querySelector('#MainContent .product-form__submit'); if (m) window.scrollTo(0, m.getBoundingClientRect().bottom + window.scrollY + 700); });
      await sleep(1800);
      r.sticky = await p.evaluate(() => { const s = document.querySelector('[data-zt-sticky]'); if (!s) return null; const cs = getComputedStyle(s); const rc = s.getBoundingClientRect();
        return { on: s.classList.contains('is-on'), shown: cs.display !== 'none' && rc.top < innerHeight && rc.bottom > 0, height: Math.round(rc.height), text: s.innerText.replace(/\s+/g, ' ').trim(),
          guaranteeEl: !!s.querySelector('.zt-sticky__guarantee'), bodyPad: getComputedStyle(document.body).paddingBottom, guaranteeClass: document.body.classList.contains('zt-has-sticky-guarantee') }; });
      await p.screenshot({ path: `${outDir}/iphone-sticky-${h}.jpg`, type: 'jpeg', quality: 75 });
      if (h === 'zeotein-cacao-bag-30') {
        await p.evaluate(() => fetch('/cart/clear.js', { method: 'POST' })); await sleep(800);
        const addResp = p.waitForResponse(x => /\/cart\/add/.test(x.url()) && x.request().method() === 'POST', { timeout: 20000 }).catch(() => null);
        await p.locator('[data-zt-sticky-btn]').click({ timeout: 10000 });
        const ar = await addResp; r.stickyAddStatus = ar ? ar.status() : 'no /cart/add request seen';
        await sleep(3500);
        r.cartAfterStickyTap = await p.evaluate(async () => { const c = await (await fetch('/cart.js')).json(); return c.items.map(i => `${i.quantity} x ${i.product_title} | $${(i.final_line_price / 100).toFixed(2)}${i.selling_plan_allocation ? ' | ' + i.selling_plan_allocation.selling_plan.name : ''}`); });
        await p.screenshot({ path: `${outDir}/iphone-sticky-tap-result.jpg`, type: 'jpeg', quality: 72 });
        await p.evaluate(() => fetch('/cart/clear.js', { method: 'POST' })); await sleep(800);
        r.cartCleared = await p.evaluate(async () => (await (await fetch('/cart.js')).json()).item_count === 0);
      }
    } catch (e) { r.error = String(e).slice(0, 200); }
    out.pages.push(r); await sleep(2500);
  }
  out.scriptErrors = errs.slice(0, 6);
  fs.writeFileSync(`${outDir}/sticky-check.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
