const { chromium } = require('playwright');
(async () => {
  const pages = [
    ['home','https://zeotein.com/'],
    ['sticks30','https://zeotein.com/products/zeotein-cacao-sticks-30'],
    ['bag30','https://zeotein.com/products/zeotein-cacao-bag-30'],
    ['vegan30','https://zeotein.com/products/zeotein-vegan-sticks-30'],
    ['sticks7','https://zeotein.com/products/zeotein-cacao-sticks-7'],
    ['zeolite','https://zeotein.com/products/zeolite'],
    ['shopall','https://zeotein.com/collections/shop-all'],
  ];
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true, userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});
  for (const [n,u] of pages) {
    const p = await ctx.newPage();
    await p.goto(u,{waitUntil:'load',timeout:90000});
    await p.waitForTimeout(6000);
    await p.screenshot({path:`report/img/before_${n}.png`});
    // second screen
    await p.evaluate(()=>window.scrollTo(0, 844));
    await p.waitForTimeout(1500);
    await p.screenshot({path:`report/img/before_${n}_2.png`});
    await p.close();
    console.log('shot',n);
  }
  // cart drawer: add bag to cart then open cart page
  const p = await ctx.newPage();
  await p.goto('https://zeotein.com/cart/add?id=0',{waitUntil:'load'}).catch(()=>{});
  await browser.close();
})();
