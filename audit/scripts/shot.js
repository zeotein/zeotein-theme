const { chromium } = require('playwright');
(async () => {
  const f = process.argv[2];
  const b = await chromium.launch();
  for (const [w, h, name, scheme] of [[1280, 900, 'desk', 'light'], [390, 844, 'mob', 'dark']]) {
    const ctx = await b.newContext({viewport:{width:w,height:h}, deviceScaleFactor:1, colorScheme: scheme});
    const p = await ctx.newPage();
    const errs = [];
    p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + f, {waitUntil:'load'});
    await p.waitForTimeout(1500);
    const ov = await p.evaluate(() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight}));
    console.log(name, JSON.stringify(ov), 'errors:', errs.slice(0,5));
    await p.screenshot({path: `check_${name}.png`, fullPage: true});
    await ctx.close();
  }
  await b.close();
})();
