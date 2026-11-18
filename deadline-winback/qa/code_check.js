// Adds the real $76.99 win-back Starter Kit (plan 4659019989) + Vegan 7-Day to a fresh cart on zeotein.com,
// applies a code, reads Shopify's own verdict from /cart.js, then opens checkout and screenshots it.
const { chromium } = require('playwright');
const [code, label] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto('https://zeotein.com/', { waitUntil: 'domcontentloaded' });
  const r = await p.evaluate(async (code) => {
    const j = (u, o) => fetch(u, o).then(r => r.json());
    const H = { 'Content-Type': 'application/json' };
    await j('/cart/clear.js', { method: 'POST' });
    await j('/cart/add.js', { method: 'POST', headers: H, body: JSON.stringify({ items: [
      { id: 67710100308181, quantity: 1, selling_plan: 4659019989 },
      { id: 53059759112405, quantity: 1 } ] }) });
    await j('/cart/update.js', { method: 'POST', headers: H, body: JSON.stringify({ discount: code }) });
    const c = await j('/cart.js');
    return { discount_codes: c.discount_codes, total: c.total_price / 100, original: c.original_total_price / 100,
      items: c.items.map(i => ({ t: i.product_title, plan: i.selling_plan_allocation && i.selling_plan_allocation.selling_plan.name, line: i.final_line_price / 100, disc: i.line_level_discount_allocations.map(d => d.amount / 100) })) };
  }, code);
  console.log(JSON.stringify({ when: new Date().toISOString(), code, ...r }, null, 1));
  await p.goto('https://zeotein.com/checkout', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(4000);
  await p.screenshot({ path: `${__dirname}/screens/${label}.png`, fullPage: true });
  console.log('checkout url', p.url());
  await b.close();
})();
