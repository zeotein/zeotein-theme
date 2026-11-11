// Mobile menu step-by-step: state + errors after each step. Usage: node menutest.js <label> <query> <outdir>
const { chromium, devices } = require('playwright');
const fs = require('fs');
(async () => {
  const [label, q, outdir] = process.argv.slice(2);
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  await ctx.route(/^https?:\/\/(?!zeotein\.com|cdn\.shopify\.com)/, async (route) => { try { const r = await route.fetch({ timeout: 8000 }); await route.fulfill({ response: r }); } catch (e) { await route.fulfill({ status: 204, body: '' }); } });
  const page = await ctx.newPage();
  let step = 'load'; const log = [];
  page.on('pageerror', e => log.push({ step, error: e.message.slice(0, 160) }));
  const state = async (s) => {
    const st = await page.evaluate(() => {
      const d = document.querySelector('details.menu-drawer-container');
      const shop = document.getElementById('Details-menu-drawer-shop');
      const vis = (el) => !!el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
      const links = [...(d?.querySelectorAll('.menu-drawer a') || [])].filter(vis).map(a => a.textContent.trim().replace(/\s+/g, ' ')).filter(Boolean);
      return { url: location.pathname, open: !!d?.open, menuOpenClass: !!d?.classList.contains('menu-open'), shopOpen: !!shop?.open, summaryAria: d?.querySelector('summary')?.getAttribute('aria-expanded'), visibleLinks: links.length, firstLinks: links.slice(0, 8) };
    });
    log.push({ step: s, ...st });
  };
  await page.goto('https://zeotein.com/' + q, { waitUntil: 'load', timeout: 90000 }); await page.waitForTimeout(3000);
  await state('loaded');
  step = 'open'; await page.locator('summary.header__icon--menu:visible').first().click(); await page.waitForTimeout(1500); await state('open');
  await page.screenshot({ path: `${outdir}/${label}-menu-open.png` });
  step = 'tap-shop';
  const shopSummary = page.locator('#Details-menu-drawer-shop > summary');
  if (await shopSummary.count() && await shopSummary.isVisible()) { await shopSummary.click(); await page.waitForTimeout(1500); await state('tap-shop'); await page.screenshot({ path: `${outdir}/${label}-menu-shop.png` }); }
  else log.push({ step: 'tap-shop', note: 'shop summary not visible' });
  step = 'close-button'; const cb = page.locator('.menu-drawer__close-button:visible').first();
  if (await cb.count()) { await cb.click(); await page.waitForTimeout(1500); } await state('close-button');
  step = 'reopen'; await page.locator('summary.header__icon--menu:visible').first().click(); await page.waitForTimeout(1500); await state('reopen');
  step = 'tap-summary-to-close'; await page.locator('summary.header__icon--menu:visible').first().click({ force: true }).catch(e => log.push({ step, note: 'summary not clickable: ' + String(e).slice(0, 80) })); await page.waitForTimeout(1500); await state('tap-summary-to-close');
  step = 'escape'; await page.locator('summary.header__icon--menu:visible').first().click({ force: true }).catch(() => {}); await page.waitForTimeout(1200); await page.keyboard.press('Escape'); await page.waitForTimeout(1200); await state('escape');
  step = 'link-nav'; const d = await page.evaluate(() => document.querySelector('details.menu-drawer-container')?.open);
  if (!d) { await page.locator('summary.header__icon--menu:visible').first().click({ force: true }).catch(() => {}); await page.waitForTimeout(1200); }
  const about = page.locator('.menu-drawer a[href="/pages/about-zeotein"]:visible').first();
  if (await about.count()) { await Promise.all([page.waitForLoadState('load').catch(() => {}), about.click()]); await page.waitForTimeout(2500); }
  await state('link-nav');
  fs.writeFileSync(`${outdir}/${label}-menu.json`, JSON.stringify(log, null, 1));
  for (const l of log) console.log(JSON.stringify(l));
  await browser.close();
})();
