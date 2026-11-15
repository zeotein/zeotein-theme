const { chromium } = require('playwright');
const OUT = process.argv[2]; const PAGES = process.argv[3].split(','); const GAP = parseInt(process.argv[4] || '45000');
const EXP = { 'zeotein-cacao-bag-30': [99.99, 109.99], 'zeotein-cacao-sticks-30': [114.99, 134.99], 'zeotein-cacao-sticks-7': [null, 39.99],
  'zeotein-vegan-sticks-30': [124.99, 139.99], 'zeotein-vegan-sticks-7': [null, 44.99], 'organic-fermented-cacao-powder-premium-unsweetened': [null, 17.99],
  'zeolite': [null, 29.99], 'zeotein-cacao-bag-30-try': [76.99, 93.49] };
const HIDE = '#PBarNextFrameWrapper,#shopify-pc__banner,.shopify-pc__banner__dialog{display:none!important}';
(async () => {
  const b = await chromium.launch();
  for (let i = 0; i < PAGES.length; i++) {
    const h = PAGES[i]; const r = { page: h };
    if (i > 0) await new Promise(res => setTimeout(res, GAP));
    const ctx = await b.newContext({ viewport: { width: 390, height: 664 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 120)));
    try {
      await p.goto('https://zeotein.com/products/' + h + '?preview_theme_id=187923202261', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await p.waitForTimeout(8000);
      if (/moment/i.test(await p.title())) throw new Error('BOT CHECK');
      await p.addStyleTag({ content: HIDE }); await p.evaluate(() => window.dispatchEvent(new Event('resize'))); await p.waitForTimeout(500);
      Object.assign(r, await p.evaluate(() => {
        const q = s => document.querySelector(s); const txt = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : null;
        const ours = [...document.querySelectorAll('.zt-rating,.zt-formats,.sealsubs-container .zt-perk,.zt-perks-src.is-static,.zt-trust,.zt-review,.zt-desc,.zt-sticky,#MainContent .product__info-container > .product__text')].map(e => e.innerText).join(' \n ');
        return { title: document.title.slice(0, 40), rating: (txt(q('.zt-rating')) || '').replace(/★/g, '').trim(), quick: txt(q('#MainContent .product__info-container > .product__text')),
          tiles: [...document.querySelectorAll('.zt-format')].map(a => a.getAttribute('href').replace('/products/', '') + (a.classList.contains('is-current') ? '*' : '')),
          sealWidgets: document.querySelectorAll('.sealsubs-container').length, gift: [...document.querySelectorAll('.sealsubs-container .zt-perk--sub .zt-perk__txt, .zt-perks-src.is-static .zt-perk__txt')].map(txt),
          fan: document.querySelectorAll('.zt-perk__fan img').length, once: [...document.querySelectorAll('.sealsubs-container .zt-perk--once .zt-perk__txt')].map(txt),
          renew: [...document.querySelectorAll('.sls-selling-plan-description-content')].map(e => e.textContent.trim()).filter(Boolean).slice(0, 1),
          trust: txt(q('.zt-trust')), review: (txt(q('.zt-review')) || '').slice(0, 50), desc: txt(q('.zt-desc h2')) || (txt(q('#MainContent .product__description')) || '').slice(0, 45),
          sticky: q('[data-zt-sticky]') ? q('[data-zt-sticky]').classList.contains('is-on') + ' ' + txt(q('[data-zt-sticky]')) : null,
          links: [...document.querySelectorAll('.zt-formats a, .zt-desc a')].map(a => a.getAttribute('href')),
          banned: ['—', 'complete protein', '76.99', '89.99', '84.99', '93.49', '15%'].filter(w => ours.includes(w)), zeolite: /zeolite/i.test(ours) };
      }));
      await p.screenshot({ path: `${OUT}/m-${h.slice(0, 26)}-fold.png` });
      await p.addStyleTag({ content: '.zt-sticky{visibility:hidden!important}' });
      const top = await p.evaluate(() => document.querySelector('.product__title').getBoundingClientRect().top + scrollY - 10);
      const bottom = await p.evaluate(() => { const e = document.querySelector('.zt-review') || document.querySelector('.zt-trust'); return e.getBoundingClientRect().bottom + scrollY + 14; });
      await p.screenshot({ path: `${OUT}/m-${h.slice(0, 26)}-buybox.png`, fullPage: true, clip: { x: 0, y: top, width: 390, height: bottom - top } });
      // add to cart through the page's own product form (same fields the button posts), no page navigation
      const addVia = async (mode) => p.evaluate(async (mode) => {
        const box = document.querySelector('.sealsubs-container');
        if (box) { const opt = [...box.querySelectorAll('.sls-option-container')].find(x => mode === 'sub' ? x.hasAttribute('data-selling-plan-group') : !x.hasAttribute('data-selling-plan-group')); if (opt) (opt.querySelector('input') || opt).click(); }
        await new Promise(r => setTimeout(r, 900));
        const form = document.querySelector('#MainContent form[data-type="add-to-cart-form"]');
        const fd = new FormData(form);
        await fetch('/cart/clear.js', { method: 'POST' });
        const res = await fetch('/cart/add.js', { method: 'POST', body: fd, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
        const c = await (await fetch('/cart.js')).json();
        await fetch('/cart/clear.js', { method: 'POST' });
        return { status: res.status, sentPlan: fd.get('selling_plan') || '', items: c.items.map(i => ({ price: i.final_line_price / 100, plan: i.selling_plan_allocation ? i.selling_plan_allocation.selling_plan.name : null })) };
      }, mode);
      const [es, eo] = EXP[h];
      if (es !== null) { r.sub = await addVia('sub'); r.subOk = r.sub.items.length === 1 && Math.abs(r.sub.items[0].price - es) < 0.005 && !!r.sub.items[0].plan; }
      r.once = await addVia('once'); r.onceOk = r.once.items.length === 1 && Math.abs(r.once.items[0].price - eo) < 0.005 && !r.once.items[0].plan;
      r.errors = errs.filter(e => !/Failed to fetch/.test(e));
    } catch (e) { r.fail = e.message.slice(0, 140); }
    console.log(JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
