// Screenshot the pop-up on the unpublished draft theme (preview link).
const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [n,o] of [['desktop',{viewport:{width:1440,height:900},deviceScaleFactor:2}],['mobile',devices['iPhone 13']]]){
const c=await b.newContext(o);const p=await c.newPage();
await p.goto('https://zeotein.com/?preview_theme_id=187982840021&zt_popup=1',{waitUntil:'domcontentloaded',timeout:60000});
await p.waitForSelector('#zt-hp.is-open',{timeout:20000});await p.waitForTimeout(1500);
await p.screenshot({path:`qa/screens/live-${n}-step1.png`});
console.log(n, await p.evaluate(()=>{const i=document.querySelector('.zt-hp__cover');return {op:getComputedStyle(i).opacity,eager:i.loading,w:i.getBoundingClientRect().width}}));
await c.close();}
await b.close()})();
