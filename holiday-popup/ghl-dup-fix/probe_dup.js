// Read-only probe of the parked duplicate preview: opens the pop-up, types into fields (no submit), logs focus/attribute churn and field geometry.
const {chromium,devices}=require('playwright');
const [url,tag,vw,vh,inject]=[process.argv[2],process.argv[3],+process.argv[4],+process.argv[5],process.argv[6]];
const mobile=vw<768;const fs=require('fs');const OUT=require('path').join(__dirname,'screens');
(async()=>{const b=await chromium.launch();
const c=await b.newContext(mobile?{...devices['iPhone 13'],viewport:{width:vw,height:vh}}:{viewport:{width:vw,height:vh}});
await c.route(/forms\/submit|surveys\/submit/,r=>r.abort());
if(inject){const code=fs.readFileSync(inject,'utf8');await c.addInitScript(code=>{const add=()=>{if(document.getElementById('zt-v413-preview'))return;const t=document.createElement('template');t.innerHTML=code;const box=document.createElement('div');box.id='zt-v413-preview';[...t.content.childNodes].forEach(n=>{if(n.tagName==='SCRIPT'){const s=document.createElement('script');s.textContent=n.textContent;box.appendChild(s)}else box.appendChild(n)});(document.head||document.documentElement).appendChild(box)};document.addEventListener('DOMContentLoaded',add)},code);}
await c.addInitScript(()=>{window.__log=[];const mo=new MutationObserver(ms=>{for(const m of ms){if(m.target.tagName==='INPUT'&&m.type==='attributes')window.__log.push(['attr',m.target.name,m.attributeName,m.target.getAttribute(m.attributeName),performance.now()|0]);if(m.type==='childList')for(const n of m.removedNodes){if(n.querySelector&&n.querySelector('input[name=first_name],input[name=email],input[name=phone]'))window.__log.push(['removed-input-container',performance.now()|0])}}});document.addEventListener('DOMContentLoaded',()=>mo.observe(document.body,{attributes:true,subtree:true,childList:true,attributeOldValue:true}));document.addEventListener('focusout',e=>window.__log.push(['blur',e.target.name||e.target.tagName,performance.now()|0]),true);document.addEventListener('focusin',e=>window.__log.push(['focus',e.target.name||e.target.tagName,performance.now()|0]),true);});
const p=await c.newPage();await p.goto(url,{waitUntil:'load',timeout:60000});
// open: mobile waits for the real 35s timer; desktop uses a real exit-intent mouseout
if(mobile){await p.waitForFunction(()=>{const o=document.getElementById('overlay');return o&&o.style.display==='block'},null,{timeout:60000});}
else{await p.waitForTimeout(3500);await p.evaluate(()=>document.dispatchEvent(new MouseEvent('mouseout',{clientX:400,clientY:-1,relatedTarget:null,bubbles:true})));await p.waitForFunction(()=>{const o=document.getElementById('overlay');return o&&o.style.display==='block'},null,{timeout:15000});}
await p.waitForTimeout(1500);
const P='[id="hl_main_popup-k47rXJwWBv"][data-zt-holiday="1"]';
await p.screenshot({path:`${OUT}/${tag}-form.png`});
const geo=async()=>p.evaluate(P=>{const pp=document.querySelector(P);const g=n=>{const e=pp.querySelector(`input[name=${n}]`);if(!e)return null;const cs=getComputedStyle(e);const r=e.getBoundingClientRect();return {type:e.type,ac:e.getAttribute('autocomplete'),ekh:e.getAttribute('enterkeyhint'),im:e.getAttribute('inputmode'),fs:cs.fontSize,textX:Math.round(r.left+parseFloat(cs.paddingLeft)+parseFloat(cs.textIndent||0)),boxL:Math.round(r.left),boxR:Math.round(r.right)}};return {first:g('first_name'),email:g('email'),phone:g('phone')}},P);
const before=await geo();
await p.evaluate(()=>window.__log.length=0);
// type through the fields using Enter (the keyboard's Next/Go key)
await p.click(`${P} input[name=first_name]`);await p.keyboard.type('Qa',{delay:60});await p.keyboard.press('Enter');
await p.keyboard.type('qa@example.com',{delay:40});await p.keyboard.press('Enter');
await p.keyboard.type('5555550142',{delay:40});
await p.waitForTimeout(800);
const log=await p.evaluate(()=>window.__log);const active=await p.evaluate(()=>document.activeElement&&document.activeElement.name);
const vals=await p.evaluate(P=>['first_name','email','phone'].map(n=>document.querySelector(P).querySelector(`input[name=${n}]`).value),P);
const churn={};log.filter(l=>l[0]==="attr").forEach(l=>{const k=l[1]+"."+l[2];churn[k]=(churn[k]||0)+1});
console.log(JSON.stringify({churn,tag,before,active,vals,typeChanges:log.filter(l=>l[0]==='attr'&&l[2]==='type'),attrChanges:log.filter(l=>l[0]==='attr').length,removed:log.filter(l=>l[0]==='removed-input-container').length,focusSeq:log.filter(l=>l[0]!=='attr').map(l=>l[0]+':'+l[1]).join(' ')}));
await b.close()})();
