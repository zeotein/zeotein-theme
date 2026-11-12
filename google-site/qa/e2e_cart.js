// End-to-end test of every buy button, the on-site cart and the hand-off to Shopify checkout.
//
//   node qa/e2e_cart.js [BASE] [OUT_DIR] [--checkout]
//
// BASE     the local preview (python3 -m http.server 8765 --directory dist/preview, the default) or the live shop.
// OUT_DIR  where e2e-results.json and screenshots go (default reports/e2e).
// --only-checkout  run only part D.   --gap=N  seconds between live flows (default 30).
// --checkout  also click Checkout and follow it to Shopify. Every run stops on the checkout page:
//             no email, address or payment details are entered and no order is placed.
//
// What it proves:
//   A. every buy-box option and delivery schedule, every size and every Add to cart button adds exactly the
//      Shopify variant and selling plan in src/catalog.json, at the catalog price
//   B. the cart drawer: quantities, remove, one Starter Kit per customer, persistence, stale or tampered carts
//   C. the checkout link: clears the zeotein.com cart, adds the items with plans, saves UTMs and gclid as cart
//      attributes, then opens /checkout; the $89.99-renewal plan never appears
//   D. (--checkout) real hand-offs: a single item, a blend plus a single, checkout -> back -> checkout again,
//      the Vegan kit, and the Cacao stick-pack subscription
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CAT = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/catalog.json'), 'utf8'));
const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/config.json'), 'utf8'));
const ITEMS = CAT.items, STORE = CAT.store;
const args = process.argv.slice(2);
const LIVE = args.includes('--checkout') || args.includes('--only-checkout');
const ONLY_LIVE = args.includes('--only-checkout');
const GAP = parseInt((args.find(a => a.startsWith('--gap=')) || '--gap=30').slice(6), 10) * 1000; // pause between live flows
const pos = args.filter(a => !a.startsWith('--'));
const BASE = (pos[0] || 'http://127.0.0.1:8765').replace(/\/$/, '');
const OUT = path.resolve(pos[1] || path.join(ROOT, 'reports/e2e'));
fs.mkdirSync(OUT, { recursive: true });
const PREVIEW = /127\.0\.0\.1|localhost/.test(BASE);
const pageUrl = (slug, qs = '') => `${BASE}/${slug}${PREVIEW ? '/' : ''}${qs}`;
const money = n => '$' + (Math.round(n * 100) / 100).toFixed(2);
const FORBIDDEN_PLAN = '4659019989'; // Cacao kit plan that renews at $89.99: must never be offered on this site
const SLUGS = CFG.pages.map(p => p.slug);

const results = [];
const flows = [];
let fails = 0;
function check(name, ok, detail) {
  results.push({ name, ok: !!ok, ...(ok ? {} : { detail }) });
  if (!ok) { fails++; console.log('FAIL', name, detail === undefined ? '' : JSON.stringify(detail).slice(0, 400)); }
}
function expectLine(id, opt) {
  const it = ITEMS[id];
  if (it.sizes) { const s = it.sizes[opt]; return { id, vid: s[1], sp: null, price: s[2], label: s[0] }; }
  const pl = it.plans ? it.plans[opt] : null;
  return { id, vid: it.variant, sp: pl ? pl[1] : null, price: it.price, label: pl ? pl[0] : 'one-time' };
}
const sameLine = (l, e) => !!l && l.id === e.id && String(l.vid) === String(e.vid) && String(l.sp || '') === String(e.sp || '') && Math.abs(l.price - e.price) < 0.001;

async function open(p, slug, qs = '') {
  await p.goto(pageUrl(slug, qs), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForFunction(() => !!window.__ztgCart, null, { timeout: 30000 });
}
const lines = p => p.evaluate(() => JSON.parse(JSON.stringify(window.__ztgCart.lines())));
const drawerOpen = p => p.locator('.ztg [data-zt-cart]').isVisible();
async function closeDrawer(p) { if (await drawerOpen(p)) { await p.keyboard.press('Escape'); await p.waitForTimeout(320); } }
async function emptyCart(p) { // through the real Remove buttons
  for (let i = 0; i < 25 && (await lines(p)).length; i++) {
    if (!(await drawerOpen(p))) { await p.locator('.ztg [data-zt-cart-open]').first().click(); await p.waitForTimeout(250); }
    await p.locator('.ztg [data-zt-remove]').first().click();
  }
  await closeDrawer(p);
}
const total = async p => ((await p.locator('.ztg [data-zt-cart-total]').textContent()) || '').trim();

// On the live site, keep test traffic out of Zeotein's analytics and ad reporting: block tag and pixel requests.
// (The page's own code, GoHighLevel and Shopify are untouched.)
const TRACKERS = /(^|\.)(googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|facebook\.net|facebook\.com|clarity\.ms|bing\.com|tiktok\.com)$/;
async function newCtx(browser, opts) {
  const c = await browser.newContext(opts);
  if (!PREVIEW) await c.route('**/*', r => { let h = ''; try { h = new URL(r.request().url()).hostname; } catch (e) {} return TRACKERS.test(h) ? r.abort() : r.continue(); });
  return c;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await newCtx(browser, { viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const consoleErrors = [];
  p.on('pageerror', e => consoleErrors.push(String(e)));

  if (!ONLY_LIVE) {
  /* ---------- A1. Buy boxes on the Cacao and Vegan pages: every option x every delivery schedule ---------- */
  for (const page of ['cacao', 'vegan']) {
    await open(p, page);
    const opts = await p.$$eval('.ztg [data-zt-buy] input[type=radio]', els => els.map(e => e.value));
    check(`${page}: buy box shows ${opts.length} options`, opts.length >= 3, opts);
    for (const id of opts) {
      const it = ITEMS[id];
      check(`${page}: option ${id} is in the catalog`, !!it); if (!it) continue;
      for (let i = 0; i < (it.plans ? it.plans.length : 1); i++) {
        await p.locator('.ztg label.opt', { has: p.locator(`input[value="${id}"]`) }).click();
        const tag = `${page} / ${id}${it.plans ? ' / ' + it.plans[i][0] : ''}`;
        check(`${tag}: delivery picker ${it.plans ? 'shown' : 'hidden'}`, (await p.locator('.ztg [data-zt-freq]').isVisible()) === !!it.plans);
        if (it.plans) await p.selectOption('.ztg [data-zt-plan]', String(i));
        const shown = ((await p.locator('.ztg [data-zt-buy-price]').textContent()) || '').trim();
        check(`${tag}: shows ${money(it.price)}`, shown === money(it.price), shown);
        const note = ((await p.locator('.ztg [data-zt-buy-note]').textContent()) || '').trim();
        const want = it.plans ? (it.renew && it.renew !== it.price ? `then ${money(it.renew)} per delivery` : `${money(it.renew || it.price)} per delivery`) : 'One-time purchase';
        check(`${tag}: note says "${want}"`, note.includes(want) && !note.includes('89.99'), note);
        const ph = await p.evaluate(id => { const c = window.__ztgCart.items[id]; const im = document.getElementById('zt-pdp-img');
          return { want: c.imgLg || c.img, src: im.getAttribute('src'), srcset: im.getAttribute('srcset') || '' }; }, id);
        check(`${tag}: photo swaps to this option, full-size`, ph.src === ph.want && (!ph.srcset || ph.srcset.includes(' 1024w')), ph);
        await p.click('.ztg [data-zt-buy-add]'); await p.waitForTimeout(150);
        const ls = await lines(p), e = expectLine(id, i);
        check(`${tag}: Add to cart -> variant ${e.vid}${e.sp ? ' + plan ' + e.sp : ''} at ${money(e.price)}`, ls.length === 1 && sameLine(ls[0], e), ls);
        check(`${tag}: drawer opens, subtotal ${money(e.price)}`, (await drawerOpen(p)) && (await total(p)) === money(e.price), await total(p));
        await emptyCart(p);
      }
    }
  }

  /* ---------- A2. Every other Add to cart button on every page, every size ---------- */
  for (const slug of SLUGS) {
    await open(p, slug);
    const btns = await p.$$eval('.ztg [data-zt-add]', els => els.map((e, k) => ({ k, id: e.getAttribute('data-zt-add'), opt: e.getAttribute('data-zt-opt'),
      from: e.getAttribute('data-zt-opt-from'), sticky: !!e.closest('[data-zt-sticky]'), text: e.textContent.replace(/\s+/g, ' ').trim() })));
    for (const b of btns) {
      const it = ITEMS[b.id];
      check(`${slug}: button "${b.text}" (${b.id}) is in the catalog`, !!it); if (!it) continue;
      const choices = b.from ? it.sizes.map((_, i) => i) : [parseInt(b.opt || '0', 10)];
      for (const i of choices) {
        const e = expectLine(b.id, i);
        const tag = `${slug}: ${b.sticky ? 'sticky bar ' : ''}"${b.text}" ${b.id}${it.sizes ? ' ' + e.label : it.plans ? ' / ' + e.label : ''}`;
        if (b.from) {
          await p.selectOption(b.from, String(i));
          const shown = await p.evaluate(k => { const c = document.querySelectorAll('.ztg [data-zt-add]')[k].closest('[data-zt-card]'); const o = c && c.querySelector('[data-zt-price]'); return o ? o.textContent.trim() : ''; }, b.k);
          check(`${tag}: price label shows ${money(e.price)}`, shown === money(e.price), shown);
        }
        if (b.sticky) await p.evaluate(k => document.querySelectorAll('.ztg [data-zt-add]')[k].click(), b.k); // phone-only bar: wiring checked here, tap checked in A3
        else { const loc = p.locator('.ztg [data-zt-add]').nth(b.k); await loc.scrollIntoViewIfNeeded(); await loc.click(); }
        await p.waitForTimeout(120);
        const ls = await lines(p);
        check(`${tag}: adds variant ${e.vid}${e.sp ? ' + plan ' + e.sp : ''} at ${money(e.price)}`, ls.length === 1 && sameLine(ls[0], e), ls);
        await emptyCart(p);
      }
    }
  }

  /* ---------- A3. Phone: the sticky bar appears after the buy button scrolls away, and its button works ---------- */
  const mctx = await newCtx(browser, { ...devices['iPhone 13'] });
  const mp = await mctx.newPage();
  for (const slug of ['cacao', 'vegan']) {
    await open(mp, slug);
    check(`${slug} (phone): sticky bar hidden at the top`, (await mp.locator('.ztg [data-zt-sticky].show').count()) === 0);
    await mp.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4)); await mp.waitForTimeout(600);
    check(`${slug} (phone): sticky bar shows once the buy button is off screen`, (await mp.locator('.ztg [data-zt-sticky].show').count()) === 1);
    await mp.locator('.ztg [data-zt-sticky] [data-zt-add]').click(); await mp.waitForTimeout(200);
    const id = slug === 'cacao' ? 'cacao-kit' : 'vegan-kit', e = expectLine(id, 0), ls = await lines(mp);
    check(`${slug} (phone): sticky Add to cart -> ${id} every 30 days`, ls.length === 1 && sameLine(ls[0], e), ls);
    if (slug === 'cacao') await mp.screenshot({ path: path.join(OUT, 'phone-sticky-add-cacao-kit.png') });
    await emptyCart(mp);
  }
  await open(mp, 'home');
  check('home (phone): sticky bar button goes to the product chooser', (await mp.getAttribute('.ztg [data-zt-sticky] a', 'href')) === '#choose' && (await mp.locator('#choose').count()) === 1);
  await mctx.close();

  /* ---------- B. Cart drawer behaviour ---------- */
  await open(p, 'collagen');
  check('empty cart: Checkout is disabled', (await p.getAttribute('.ztg [data-zt-checkout]', 'aria-disabled')) === 'true' && (await p.getAttribute('.ztg [data-zt-checkout]', 'href')) === '#');
  await p.click('.ztg [data-zt-add="collagen"]'); await p.waitForTimeout(100); await closeDrawer(p);
  await p.click('.ztg [data-zt-add="collagen"]'); await p.waitForTimeout(100);
  let ls = await lines(p);
  check('same item twice -> one line, quantity 2', ls.length === 1 && ls[0].qty === 2, ls);
  check('subtotal follows quantity ($55.98)', (await total(p)) === money(2 * 27.99), await total(p));
  check('cart badge shows 2', ((await p.locator('.ztg [data-zt-cart-count]').first().textContent()) || '').trim() === '2');
  await p.click('.ztg [data-zt-qty="1"]'); ls = await lines(p); check('+ raises quantity to 3', ls[0] && ls[0].qty === 3, ls);
  await p.click('.ztg [data-zt-qty="-1"]'); ls = await lines(p); check('- lowers quantity to 2', ls[0] && ls[0].qty === 2, ls);
  await p.click('.ztg [data-zt-qty="-1"]'); await p.click('.ztg [data-zt-qty="-1"]'); ls = await lines(p);
  check('- to zero removes the line', ls.length === 0, ls);
  check('empty drawer offers Cacao, Vegan and Single ingredients', (await p.locator('.ztg .cart-empty a').count()) === 3);
  await closeDrawer(p);
  await open(p, 'cacao');
  await p.selectOption('.ztg [data-zt-plan]', '0'); await p.click('.ztg [data-zt-buy-add]'); await p.waitForTimeout(100); await closeDrawer(p);
  await p.selectOption('.ztg [data-zt-plan]', '2'); await p.click('.ztg [data-zt-buy-add]'); await p.waitForTimeout(100);
  ls = await lines(p);
  check('Starter Kit added twice -> still one kit, newest schedule (every 8 weeks)', ls.length === 1 && ls[0].qty === 1 && String(ls[0].sp) === String(ITEMS['cacao-kit'].plans[2][1]), ls);
  check('Starter Kit line has no + button (one per customer)', (await p.locator('.ztg .cl [data-zt-qty]').count()) === 0);
  check('drawer states first order $76.99 then $99.99', /First order \$76\.99, then \$99\.99 per delivery/.test(await p.locator('.ztg .cl .renew').first().textContent()));
  await closeDrawer(p);
  await open(p, 'sea-moss'); await p.selectOption('#size-sea-moss-pdp', '1'); await p.click('.ztg [data-zt-add="sea-moss"]'); await p.waitForTimeout(100);
  await open(p, 'faq'); ls = await lines(p);
  check('cart follows the shopper to other pages', ls.length === 2, ls);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForFunction(() => !!window.__ztgCart);
  check('cart survives a reload', (await lines(p)).length === 2);
  // A cart saved with an old price and with the $89.99-renewal plan (never offered here) is repaired on load
  await p.evaluate(F => { const o = JSON.parse(localStorage.getItem('zt_cart_v1'));
    o.lines.forEach(l => { if (l.id === 'sea-moss') l.price = 1; });
    o.lines.push({ key: 'bad', id: 'cacao-kit', vid: 67710100308181, sp: Number(F), price: 0.5, qty: 1, max: 1 });
    localStorage.setItem('zt_cart_v1', JSON.stringify(o)); }, FORBIDDEN_PLAN);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForFunction(() => !!window.__ztgCart);
  ls = await lines(p);
  check('stale price is refreshed from the catalog (Sea Moss 1/2 lb back to $59.99)', ls.some(l => l.id === 'sea-moss' && l.price === 59.99), ls);
  check('a line on the $89.99-renewal plan is dropped on load', !ls.some(l => String(l.sp) === FORBIDDEN_PLAN) && ls.length === 2, ls);
  await p.locator('.ztg [data-zt-cart-open]').first().click(); await p.waitForTimeout(250);
  check('header cart button opens the drawer', await drawerOpen(p));
  await p.keyboard.press('Escape'); await p.waitForTimeout(320);
  check('Escape closes the drawer', !(await drawerOpen(p)));
  await emptyCart(p);

  /* ---------- C. The checkout link: UTMs from the ad landing survive to Shopify ---------- */
  const c2 = await newCtx(browser, { viewport: { width: 1280, height: 900 } });
  const q = await c2.newPage();
  await open(q, 'home', '?gclid=ZTE2E_GCLID&utm_source=google&utm_medium=cpc&utm_campaign=zt_e2e&utm_term=protein%20powder&utm_content=home_hero');
  await open(q, 'cacao'); // no parameters on this address: they must come from the landing visit
  await q.selectOption('.ztg [data-zt-plan]', '1'); await q.click('.ztg [data-zt-buy-add]'); await q.waitForTimeout(100); await closeDrawer(q);
  await open(q, 'single-ingredients'); await q.selectOption('#size-sea-moss', '1'); await q.click('.ztg [data-zt-add="sea-moss"]'); await q.waitForTimeout(100);
  const href = await q.evaluate(() => window.__ztgCart.url());
  const u0 = new URL(href);
  check('checkout link first clears the zeotein.com cart', u0.origin === STORE && u0.pathname === '/cart/clear', href.slice(0, 80));
  check('gclid and UTMs ride on the first hop', u0.searchParams.get('gclid') === 'ZTE2E_GCLID' && u0.searchParams.get('utm_campaign') === 'zt_e2e' && u0.searchParams.get('utm_term') === 'protein powder');
  const u1 = new URL(u0.searchParams.get('return_to') || '/', STORE);
  check('then adds the items (/cart/add)', u1.pathname === '/cart/add', u1.pathname);
  const g = k => u1.searchParams.get(k);
  check('item 1 = Cacao Starter Kit, every 6 weeks plan', g('items[0][id]') === String(ITEMS['cacao-kit'].variant) && g('items[0][selling_plan]') === String(ITEMS['cacao-kit'].plans[1][1]) && g('items[0][quantity]') === '1');
  check('item 2 = Sea Moss 1/2 lb, no plan', g('items[1][id]') === String(ITEMS['sea-moss'].sizes[1][1]) && g('items[1][selling_plan]') === null);
  const u2 = new URL(u1.searchParams.get('return_to') || '/', STORE);
  const at = k => u2.searchParams.get(`attributes[${k}]`);
  check('then saves the ad data on the cart (/cart/update)', u2.pathname === '/cart/update', u2.pathname);
  check('cart attributes: gclid, utm_source/medium/campaign/term/content', at('gclid') === 'ZTE2E_GCLID' && at('utm_source') === 'google' && at('utm_medium') === 'cpc' && at('utm_campaign') === 'zt_e2e' && at('utm_term') === 'protein powder' && at('utm_content') === 'home_hero');
  check('cart attributes: landing page and source site', /\/home\/?$/.test(at('landing_page') || '') && !!at('source_site'), { landing: at('landing_page'), site: at('source_site') });
  check('then opens /checkout', u2.searchParams.get('return_to') === '/checkout');
  check('the $89.99-renewal plan is nowhere in the link', !href.includes(FORBIDDEN_PLAN));
  const pol = await q.getAttribute('.ztg a[href*="policies/privacy-policy"]', 'href');
  check('remaining zeotein.com links (policies, subscriptions) also carry the gclid', (pol || '').includes('gclid=ZTE2E_GCLID'), pol);
  await c2.close();
  check('no JavaScript errors on any page', consoleErrors.length === 0, consoleErrors);
  } // end of parts A-C

  /* ---------- D. Real hand-offs to Shopify checkout (no order is placed) ---------- */
  if (LIVE) {
    const flow = async (name, title, run) => {
      const fx = await newCtx(browser, { viewport: { width: 1280, height: 900 } });
      const fp = await fx.newPage();
      const rec = { name, title, hops: [], screenshots: [] };
      try {
        await run(fp, rec);
      } catch (err) { rec.error = String(err); check(`${title}: flow ran`, false, String(err)); }
      flows.push(rec);
      await fx.close();
      await new Promise(r => setTimeout(r, GAP));
    };
    const toCheckout = async (fp, rec, shot) => {
      await fp.screenshot({ path: path.join(OUT, `${shot}-cart.png`) }); rec.screenshots.push(`${shot}-cart.png`);
      const hops = [];
      const onResp = r => { try { if (r.request().isNavigationRequest() && r.frame() === fp.mainFrame()) hops.push(`${r.status()} ${decodeURIComponent(r.url()).slice(0, 150)}`); } catch (e) {} };
      fp.on('response', onResp);
      await fp.click('.ztg [data-zt-checkout]');
      const CHALLENGE = /connection needs to be verified|verify you are human/i;
      let challenged = false;
      for (let w = 0; w < 45 && !/zeotein\.com\/checkouts\//.test(fp.url()); w++) {
        await fp.waitForTimeout(2000);
        const t = await fp.evaluate(() => document.body ? document.body.innerText.slice(0, 300) : '').catch(() => '');
        if (CHALLENGE.test(t)) { challenged = true; break; }
      }
      await fp.waitForLoadState('load').catch(() => {}); await fp.waitForTimeout(6000);
      fp.off('response', onResp);
      rec.hops.push(hops);
      await fp.screenshot({ path: path.join(OUT, `${shot}-checkout.png`) }); rec.screenshots.push(`${shot}-checkout.png`);
      const text = await fp.evaluate(() => document.body.innerText).catch(() => '');
      if (challenged || CHALLENGE.test(text)) { rec.blocked = 'Shopify bot protection (429 + Cloudflare check) answered this test browser'; throw new Error(rec.blocked); }
      if (!/zeotein\.com\/checkouts\//.test(fp.url())) throw new Error('did not reach checkout: ' + fp.url().slice(0, 120));
      let cart = null;
      for (let r = 0; r < 3 && !cart; r++) {
        cart = await fp.evaluate(async () => { const res = await fetch('/cart.js', { cache: 'no-store' }); const t = await res.text(); try { return JSON.parse(t); } catch (e) { return null; } }).catch(() => null);
        if (!cart) await fp.waitForTimeout(15000);
      }
      if (!cart) throw new Error('checkout reached, but /cart.js would not answer (bot protection)');
      return { text, cart, landed: fp.url().replace(/\?.*/, '') };
    };
    const verify = (title, res, expected, wantAttrs) => {
      const items = res.cart.items.map(i => ({ vid: String(i.variant_id), qty: i.quantity, sp: i.selling_plan_allocation ? String(i.selling_plan_allocation.selling_plan.id) : null,
        price: i.final_line_price / 100, plan: i.selling_plan_allocation ? i.selling_plan_allocation.selling_plan.name : null,
        later: i.selling_plan_allocation ? (i.selling_plan_allocation.price_adjustments || []).map(a => a.price / 100) : null, title: `${i.product_title} ${i.variant_title || ''}`.trim() }));
      check(`${title}: lands on Shopify checkout`, /\/checkouts?\//.test(res.landed), res.landed);
      check(`${title}: checkout holds exactly ${expected.length} line(s)`, items.length === expected.length, items);
      for (const e of expected) {
        const m = items.find(i => i.vid === String(e.vid) && (i.sp || '') === String(e.sp || ''));
        check(`${title}: ${e.what} -> variant ${e.vid}${e.sp ? ' plan ' + e.sp : ''}, qty ${e.qty || 1}, ${money(e.price * (e.qty || 1))}`, !!m && m.qty === (e.qty || 1) && Math.abs(m.price - e.price * (e.qty || 1)) < 0.001, m || items);
        if (e.renew && m) check(`${title}: ${e.what} renews at ${money(e.renew)} (Shopify plan pricing)`, (m.later || []).includes(e.renew) && !(m.later || []).includes(89.99), m.later);
        check(`${title}: checkout page shows ${money(e.price * (e.qty || 1))}`, res.text.includes(money(e.price * (e.qty || 1)).slice(1)));
      }
      for (const [k, v] of Object.entries(wantAttrs)) check(`${title}: cart attribute ${k} = ${v}`, String(res.cart.attributes[k] || '') === v || (v === '*' && !!res.cart.attributes[k]), res.cart.attributes);
      check(`${title}: no $89.99 anywhere on the checkout page`, !res.text.includes('89.99'));
      return items;
    };

    // (a) single item: Collagen 1 lb
    await flow('a-single', 'Flow A, single item', async (fp, rec) => {
      await open(fp, 'collagen', '?gclid=ZTA_SINGLE&utm_source=google&utm_medium=cpc&utm_campaign=zt_e2e_single');
      await fp.selectOption('#size-collagen-pdp', '1'); await fp.click('.ztg [data-zt-add="collagen"]'); await fp.waitForTimeout(300);
      const res = await toCheckout(fp, rec, 'A-single-collagen');
      rec.items = verify('Flow A (Collagen 1 lb)', res, [{ what: 'Collagen 1 lb', vid: ITEMS.collagen.sizes[1][1], price: ITEMS.collagen.sizes[1][2] }],
        { gclid: 'ZTA_SINGLE', utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'zt_e2e_single', landing_page: '*', source_site: '*' });
      rec.attributes = res.cart.attributes;
    });
    // (b) blend + single, browsing from the home page, then (c) back to the shop, add one more, checkout again
    await flow('b-blend-plus-single', 'Flow B + C, blend plus single, then back and checkout again', async (fp, rec) => {
      await open(fp, 'home', '?gclid=ZTB_BLEND&utm_source=google&utm_medium=cpc&utm_campaign=zt_e2e_blend&utm_content=home');
      await fp.click('.ztg .hhero a[href="#choose"]'); await fp.waitForTimeout(500);
      await Promise.all([fp.waitForNavigation(), fp.click('.ztg .zcard a.ph[href="/cacao"]')]); await fp.waitForFunction(() => !!window.__ztgCart);
      await fp.selectOption('.ztg [data-zt-plan]', '1'); await fp.click('.ztg [data-zt-buy-add]'); await fp.waitForTimeout(300); await closeDrawer(fp);
      await Promise.all([fp.waitForNavigation(), fp.click('.ztg .nav a[href="/single-ingredients"]')]); await fp.waitForFunction(() => !!window.__ztgCart);
      await fp.selectOption('#size-sea-moss', '1'); await fp.click('.ztg [data-zt-add="sea-moss"]'); await fp.waitForTimeout(400);
      const kit = ITEMS['cacao-kit'], sea = ITEMS['sea-moss'];
      const expB = [{ what: 'Cacao Starter Kit every 6 weeks', vid: kit.variant, sp: kit.plans[1][1], price: kit.price, renew: kit.renew },
        { what: 'Sea Moss 1/2 lb', vid: sea.sizes[1][1], price: sea.sizes[1][2] }];
      const attrs = { gclid: 'ZTB_BLEND', utm_campaign: 'zt_e2e_blend', utm_content: 'home', landing_page: '*' };
      let res = await toCheckout(fp, rec, 'B-blend-plus-single');
      rec.items = verify('Flow B (Cacao kit + Sea Moss)', res, expB, attrs);
      rec.attributes = res.cart.attributes;
      // (c) shopper goes back, adds Collagen 1/2 lb and checks out again: nothing may be doubled
      await fp.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
      if (!/single-ingredients/.test(fp.url())) await open(fp, 'single-ingredients');
      await fp.waitForFunction(() => !!window.__ztgCart);
      await closeDrawer(fp);
      await fp.selectOption('#size-collagen', '0'); await fp.click('.ztg [data-zt-add="collagen"]'); await fp.waitForTimeout(400);
      res = await toCheckout(fp, rec, 'C-back-and-checkout-again');
      rec.itemsAfterReturn = verify('Flow C (back, add Collagen, checkout again)', res,
        [...expB, { what: 'Collagen 1/2 lb', vid: ITEMS.collagen.sizes[0][1], price: ITEMS.collagen.sizes[0][2] }], attrs);
    });
    // (d) Vegan Starter Kit every 8 weeks + Hemp 2 lb
    await flow('d-vegan', 'Flow D, Vegan kit plus Hemp', async (fp, rec) => {
      await open(fp, 'vegan', '?gclid=ZTD_VEGAN&utm_source=google&utm_medium=cpc&utm_campaign=zt_e2e_vegan');
      await fp.selectOption('.ztg [data-zt-plan]', '2'); await fp.click('.ztg [data-zt-buy-add]'); await fp.waitForTimeout(300); await closeDrawer(fp);
      await open(fp, 'hemp-protein'); await fp.selectOption('#size-hemp-protein-pdp', '2'); await fp.click('.ztg [data-zt-add="hemp-protein"]'); await fp.waitForTimeout(300);
      const vk = ITEMS['vegan-kit'], hp = ITEMS['hemp-protein'];
      const res = await toCheckout(fp, rec, 'D-vegan-kit-plus-hemp');
      rec.items = verify('Flow D (Vegan kit + Hemp 2 lb)', res, [{ what: 'Vegan Starter Kit every 8 weeks', vid: vk.variant, sp: vk.plans[2][1], price: vk.price, renew: vk.renew },
        { what: 'Hemp 2 lb', vid: hp.sizes[2][1], price: hp.sizes[2][2] }], { gclid: 'ZTD_VEGAN', utm_campaign: 'zt_e2e_vegan' });
      rec.attributes = res.cart.attributes;
    });
    // (e) Cacao 30 stick packs on subscription + Lion's Mane 1 lb
    await flow('e-sticks', "Flow E, Cacao stick-pack subscription plus Lion's Mane", async (fp, rec) => {
      await open(fp, 'cacao', '?gclid=ZTE_STICKS&utm_source=google&utm_medium=cpc&utm_campaign=zt_e2e_sticks');
      await fp.locator('.ztg label.opt', { has: fp.locator('input[value="cacao-sticks-sub"]') }).click();
      await fp.selectOption('.ztg [data-zt-plan]', '0'); await fp.click('.ztg [data-zt-buy-add]'); await fp.waitForTimeout(300); await closeDrawer(fp);
      await open(fp, 'lions-mane'); await fp.selectOption('#size-lions-mane-pdp', '1'); await fp.click('.ztg [data-zt-add="lions-mane"]'); await fp.waitForTimeout(300);
      const st = ITEMS['cacao-sticks-sub'], lm = ITEMS['lions-mane'];
      const res = await toCheckout(fp, rec, 'E-cacao-sticks-sub-plus-lions-mane');
      rec.items = verify("Flow E (Cacao sticks subscription + Lion's Mane 1 lb)", res, [{ what: 'Cacao 30 stick packs every 30 days', vid: st.variant, sp: st.plans[0][1], price: st.price, renew: st.renew },
        { what: "Lion's Mane 1 lb", vid: lm.sizes[1][1], price: lm.sizes[1][2] }], { gclid: 'ZTE_STICKS', utm_campaign: 'zt_e2e_sticks' });
      rec.attributes = res.cart.attributes;
    });
  }

  await browser.close();
  const passed = results.filter(r => r.ok).length;
  const out = { ranAt: new Date().toISOString(), base: BASE, liveCheckout: LIVE, passed, failed: fails, checks: results, flows };
  fs.writeFileSync(path.join(OUT, 'e2e-results.json'), JSON.stringify(out, null, 1));
  console.log(`\n${passed} passed, ${fails} failed  ->  ${path.join(OUT, 'e2e-results.json')}`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
