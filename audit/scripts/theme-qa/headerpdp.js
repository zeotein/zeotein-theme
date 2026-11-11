// Header + PDP regression on live vs preview. Usage: node headerpdp.js <label> <query-suffix> <outdir>
const { chromium, devices } = require('playwright');
const fs = require('fs');
(async () => {
  const [label, q, outdir] = process.argv.slice(2);
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  const stub = async (ctx) => ctx.route(/^https?:\/\/(?!zeotein\.com|cdn\.shopify\.com)/, async (route) => {
    try { const r = await route.fetch({ timeout: 8000 }); await route.fulfill({ response: r }); }
    catch (e) { await route.fulfill({ status: 204, body: '' }); }
  });
  const out = { label };
  // ---- mobile header
  let ctx = await browser.newContext({ ...devices['iPhone 13'] }); await stub(ctx);
  let page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  await page.goto('https://zeotein.com/' + q, { waitUntil: 'load', timeout: 90000 }); await page.waitForTimeout(3000);
  await page.locator('summary.header__icon--menu:visible').first().click(); await page.waitForTimeout(1200);
  out.mobileMenu = await page.evaluate(() => {
    const d = document.querySelector('details.menu-drawer-container');
    const links = [...(d?.querySelectorAll('.menu-drawer a') || [])].filter(a => a.offsetParent !== null).map(a => a.textContent.trim().replace(/\s+/g, ' ')).filter(Boolean);
    return { open: !!d?.open, visibleLinks: links.slice(0, 30) };
  });
  await page.screenshot({ path: `${outdir}/${label}-mobile-menu.png` });
  // close via the drawer's own close button (falls back to reload so the search test starts clean)
  const closeBtn = page.locator('.menu-drawer__close-button:visible').first();
  out.menuCloseButton = await closeBtn.count() ? 'present' : 'absent';
  if (await closeBtn.count()) { await closeBtn.click().catch(() => {}); await page.waitForTimeout(800); }
  out.menuClosedAfter = await page.evaluate(() => !document.querySelector('details.menu-drawer-container')?.open);
  if (!out.menuClosedAfter) { await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(3000); }
  await page.locator('[data-zt-search-open]:visible').first().click(); await page.waitForTimeout(1200);
  out.search = await page.evaluate(() => { const m = document.getElementById('zt-search-modal'); if (!m) return 'no modal'; const cs = getComputedStyle(m); return { open: m.open ?? null, display: cs.display, visibility: cs.visibility, hasInput: !!m.querySelector('input[type="search"], input[name="q"]') }; });
  await page.screenshot({ path: `${outdir}/${label}-mobile-search.png` });
  out.mobileErrors = [...new Set(errs)];
  await ctx.close();
  // ---- desktop header dropdown
  ctx = await browser.newContext({ ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }); await stub(ctx);
  page = await ctx.newPage(); const derrs = []; page.on('pageerror', e => derrs.push(e.message.slice(0, 160)));
  await page.goto('https://zeotein.com/' + q, { waitUntil: 'load', timeout: 90000 }); await page.waitForTimeout(3000);
  const parent = page.locator('.zt-nav-item--has-children').first();
  await parent.hover(); await page.waitForTimeout(800);
  out.desktopDropdown = await page.evaluate(() => { const li = document.querySelector('.zt-nav-item--has-children'); const sub = li?.querySelector('.zt-header-submenu-panel'); if (!sub) return 'no submenu'; const cs = getComputedStyle(sub); return { parent: li.querySelector('.menu-list__link-title')?.textContent.trim(), visible: cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0', links: [...sub.querySelectorAll('a')].map(a => a.textContent.trim()) }; });
  await page.screenshot({ path: `${outdir}/${label}-desktop-dropdown.png` });
  // ---- desktop PDP add to cart
  await page.goto('https://zeotein.com/products/zeotein-cacao-bag-30' + q, { waitUntil: 'load', timeout: 90000 }); await page.waitForTimeout(5000);
  out.pdpSeal = await page.evaluate(() => { const els = [...document.querySelectorAll('[class*="seal"], [id*="seal"]')].filter(e => e.offsetParent !== null); const txt = els.map(e => e.innerText).join(' ').replace(/\s+/g, ' '); return { sealVisibleEls: els.length, hasSubscribe: /subscribe/i.test(txt), snippet: txt.slice(0, 160) }; });
  const before = await page.evaluate(() => document.querySelector('.cart-bubble__text-count')?.textContent.trim());
  const atc = page.locator('form[action*="/cart/add"] button[type="submit"][name="add"], form[action*="/cart/add"] button[type="submit"]').first();
  out.atcLabel = (await atc.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  await atc.click(); await page.waitForTimeout(6000);
  out.afterAdd = await page.evaluate(async () => { const c = await (await fetch('/cart.js')).json(); return { url: location.pathname, bubble: document.querySelector('.cart-bubble__text-count')?.textContent.trim(), item_count: c.item_count, items: c.items.map(i => [i.variant_id, i.quantity, i.selling_plan_allocation ? i.selling_plan_allocation.selling_plan.id : null]) }; });
  out.bubbleBefore = before;
  await page.screenshot({ path: `${outdir}/${label}-pdp-after-add.png` });
  out.desktopErrors = [...new Set(derrs)];
  await ctx.close();
  fs.writeFileSync(`${outdir}/${label}-header-pdp.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
