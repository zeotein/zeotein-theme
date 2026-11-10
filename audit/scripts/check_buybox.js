const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({...devices['iPhone 13'], deviceScaleFactor: 1});
  for (const url of process.argv.slice(2)) {
    const page = await ctx.newPage();
    await page.goto(url, {waitUntil:'load', timeout:60000});
    await page.waitForTimeout(5000);
    const r = await page.evaluate(() => {
      const form = document.querySelector('form[action*="/cart/add"]');
      const sp = Array.from(document.querySelectorAll('input[name="selling_plan"], select[name="selling_plan"], [name*="selling_plan"]')).map(e=>({tag:e.tagName,type:e.type,value:e.value,checked:e.checked}));
      const sealEls = document.querySelectorAll('[class*="sls-"], [class*="seal"], [id*="seal"], [class*="subscription"]');
      const radios = Array.from(document.querySelectorAll('form[action*="/cart/add"] input[type=radio]')).map(e=>({name:e.name,value:e.value,checked:e.checked, label:(e.closest('label')||{}).innerText}));
      const formText = form ? form.innerText.slice(0,1500) : null;
      const area = document.querySelector('.product__info-container, .product__info-wrapper');
      return {hasForm: !!form, sellingPlanInputs: sp, sealCount: sealEls.length, sealSamples: Array.from(sealEls).slice(0,8).map(e=>e.className+'|'+(e.innerText||'').slice(0,120)), radios, formText, infoText: area? area.innerText.slice(0,1200):null};
    });
    console.log('=====', url); console.log(JSON.stringify(r,null,1));
    await page.close();
  }
  await browser.close();
})();
