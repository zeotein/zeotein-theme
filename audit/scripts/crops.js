const { chromium } = require('playwright');
(async () => {
  const f = process.argv[2];
  const b = await chromium.launch();
  const ctx = await b.newContext({viewport:{width:1280,height:900}, deviceScaleFactor:1, colorScheme:'light'});
  const p = await ctx.newPage();
  await p.goto('file://' + f, {waitUntil:'load'});
  await p.waitForTimeout(1500);
  for (const id of ['dropoff','pricing']) { const el = await p.$('#'+id); await el.screenshot({path:`crop_${id}.png`}); }
  const ba = await p.$$('.page-ba'); await ba[0].screenshot({path:'crop_ba0.png'});
  const top = await p.$('header.mast'); await top.screenshot({path:'crop_top.png'});
  await b.close();
})();
