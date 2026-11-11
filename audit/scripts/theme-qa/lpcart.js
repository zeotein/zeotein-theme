// LP cart regression: same clicks on live vs preview; records cart.js, drawer state, errors, screenshots.
// Usage: node lpcart.js <label> <baseUrl> <outdir>
const { chromium, devices } = require('playwright');
const fs = require('fs');
(async () => {
  const [label, base, outdir] = process.argv.slice(2);
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const plan of ['sub', 'once']) {
    for (const bag of [0, 1, 2]) {
      const ctx = await browser.newContext({ ...devices['iPhone 13'] });
      // let 3rd-party hosts "answer" so app scripts behave like for a real shopper
      await ctx.route(/^https?:\/\/(?!zeotein\.com|cdn\.shopify\.com)/, async (route) => {
        try { const r = await route.fetch({ timeout: 8000 }); await route.fulfill({ response: r }); }
        catch (e) { await route.fulfill({ status: 204, body: '' }); }
      });
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', e => errs.push(String(e.message).slice(0, 200)));
      const url = base.includes('?') ? base : base;
      await page.goto(url, { waitUntil: 'load', timeout: 90000 });
      await page.waitForTimeout(3000);
      const bags = page.locator('[data-zt-bb-bag]');
      await bags.nth(bag).scrollIntoViewIfNeeded();
      await bags.nth(bag).click();
      await page.locator(`[data-zt-bb-plan="${plan}"]`).click();
      await page.waitForTimeout(500);
      const ctaText = (await page.locator('[data-zt-bb-cta]').innerText()).replace(/\s+/g, ' ').trim();
      await page.locator('[data-zt-bb-cta]').click();
      await page.waitForTimeout(6000);
      const state = await page.evaluate(async () => {
        const drawers = [...document.querySelectorAll('cart-drawer')].map(d => {
          const r = d.getBoundingClientRect();
          const cs = getComputedStyle(d);
          return {
            active: d.classList.contains('active'),
            visibility: cs.visibility,
            inSlot: !!d.closest('[data-zt-bb-drawer-slot]'),
            items: [...d.querySelectorAll('.cart-item')].map(ci => ({
              name: (ci.querySelector('.cart-item__name')?.textContent || '').trim().replace(/\s+/g, ' '),
              qty: ci.querySelector('input.quantity__input')?.value || null,
              price: (ci.querySelector('.cart-item__totals .price, .cart-item__price-wrapper .price, .price')?.textContent || '').trim().replace(/\s+/g, ' '),
            })),
            total: (d.querySelector('.totals__total-value')?.textContent || '').trim(),
          };
        });
        const cart = await (await fetch('/cart.js')).json();
        return {
          drawers,
          cartDrawerIds: document.querySelectorAll('#CartDrawer').length,
          customElements: { cartDrawer: !!customElements.get('cart-drawer'), cartRemove: !!customElements.get('cart-remove-button'), drawerItems: !!customElements.get('cart-drawer-items') },
          cart: {
            item_count: cart.item_count, total_price: cart.total_price,
            items: cart.items.map(i => ({ variant_id: i.variant_id, qty: i.quantity, plan: i.selling_plan_allocation ? i.selling_plan_allocation.selling_plan.id : null, line: i.final_line_price, props: i.properties })),
          },
        };
      });
      const shot = `${outdir}/${label}-${plan}-${bag + 1}bag.png`;
      await page.screenshot({ path: shot });
      // remove test on the 1-bag subscribe run: remove the bag line inside the open drawer
      let removeTest = null;
      if (plan === 'sub' && bag === 0) {
        const btn = page.locator('cart-drawer.active cart-remove-button button, cart-drawer.active cart-remove-button').first();
        if (await btn.count()) {
          await btn.click().catch(() => {});
          await page.waitForTimeout(5000);
          removeTest = await page.evaluate(async () => { const c = await (await fetch('/cart.js')).json(); return { item_count: c.item_count, items: c.items.map(i => [i.variant_id, i.quantity]) }; });
        } else removeTest = 'no remove button found';
      }
      results.push({ label, plan, bags: bag + 1, ctaText, errors: [...new Set(errs)], ...state, removeTest });
      console.log(`[${label}] ${plan} ${bag + 1} bag(s): cart items=${state.cart.item_count} total=${state.cart.total_price} drawers=${state.drawers.length} active=${state.drawers.filter(d => d.active).length} errs=${[...new Set(errs)].length}${removeTest ? ' remove->' + JSON.stringify(removeTest) : ''}`);
      await ctx.close();
    }
  }
  fs.writeFileSync(`${outdir}/${label}.json`, JSON.stringify(results, null, 1));
  await browser.close();
})();
