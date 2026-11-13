const {chromium,devices}=require('playwright');
const OUT=__dirname; const url=process.argv[2]; const tag=process.argv[3]; const vw=+process.argv[4], vh=+process.argv[5]; const mobile=vw<768; const inject=process.argv[6];
(async()=>{const b=await chromium.launch();
const c=await b.newContext(mobile?{...devices['iPhone 13'],viewport:{width:vw,height:vh}}:{viewport:{width:vw,height:vh}});
if(inject){const css=require('fs').readFileSync(inject,'utf8');await c.addInitScript(css=>{const swap=()=>{const o=document.getElementById('zeotein-holiday-popup-skin-v48-css');if(o)o.remove();if(!document.getElementById('zt-v49-preview')){const s=document.createElement('style');s.id='zt-v49-preview';s.textContent=css;(document.head||document.documentElement).appendChild(s)}};document.addEventListener('DOMContentLoaded',swap);new MutationObserver(swap).observe(document.documentElement,{childList:true,subtree:true});},css);}
await c.addInitScript(()=>{window.__ztSeen=[];new MutationObserver(ms=>{for(const m of ms){for(const n of m.addedNodes){const t=(n.textContent||'');if(/submission|in progress|submitting/i.test(t)&&t.length<300)window.__ztSeen.push([performance.now()|0,t.trim().slice(0,90)])}if(m.type==='characterData'&&/progress|submission/i.test(m.target.data))window.__ztSeen.push([performance.now()|0,m.target.data.slice(0,90)])}}).observe(document,{childList:true,subtree:true,characterData:true})});
await c.route(/\/(submit|surveys\/submit|forms\/submit)/,r=>r.abort()); // never submit
const p=await c.newPage();const texts=[];
await p.goto(url,{waitUntil:'load',timeout:60000});
const t0=Date.now();let popupAt=null;
for(let i=0;i<90;i++){await p.waitForTimeout(500);
 const st=await p.evaluate(()=>{const P=[...document.querySelectorAll('[id="hl_main_popup-k47rXJwWBv"]')].find(e=>e.getAttribute('data-zt-holiday')==='1');
  const sub=[...document.querySelectorAll('body *')].filter(e=>e.children.length===0&&/submission in progress|submitting|please wait/i.test(e.textContent)&&e.getBoundingClientRect().height>0&&getComputedStyle(e).visibility!=='hidden').map(e=>e.textContent.trim().slice(0,60)+' @'+Math.round(e.getBoundingClientRect().top));
  if(!P)return {open:false,sub};const r=P.getBoundingClientRect();const s=getComputedStyle(P);return {open:s.display!=='none'&&r.height>2,sub,r:[Math.round(r.top),Math.round(r.height)]}});
 if(st.sub.length)texts.push([(Date.now()-t0)/1000,st.sub]);
 if(st.open&&!popupAt){popupAt=(Date.now()-t0)/1000;break;}
 if(!mobile&&i==20){await p.mouse.move(700,300);await p.mouse.move(700,2);await p.evaluate(()=>document.dispatchEvent(new MouseEvent('mouseout',{clientY:-5,bubbles:true})));await p.mouse.move(700,-10).catch(()=>{});}
}
const page=await p.evaluate(()=>({url:location.href,sh:document.documentElement.scrollHeight,bodyOverflow:getComputedStyle(document.body).overflow,htmlOverflow:getComputedStyle(document.documentElement).overflow}));
let m=null;
if(popupAt){await p.waitForTimeout(1500);
 m=await p.evaluate(()=>{const P=[...document.querySelectorAll('[id="hl_main_popup-k47rXJwWBv"]')].find(e=>e.getAttribute('data-zt-holiday')==='1');const R=e=>{if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.top),Math.round(r.bottom)]};
  const q=s=>P.querySelector(s);const btn=q('button[type=submit],button.button-element');const cs=getComputedStyle(P);
  const art=q('.zt-art'),aft=art&&getComputedStyle(art,'::after');
  // element at the center of the submit button: is it the button?
  let hit=null;if(btn){const r=btn.getBoundingClientRect();const e=document.elementFromPoint(r.left+r.width/2,Math.min(r.top+r.height/2,innerHeight-1));hit=e&&(btn.contains(e)?'button':(e.className+'').slice(0,50)||e.tagName)}
  return {styles:['v48-css','v47-css','v41-css','skin-css'].map(k=>k+':'+!!document.getElementById('zeotein-holiday-popup-skin-'+k)).concat(['v49:'+!!document.getElementById('zt-v49-preview')]),vh:innerHeight,popup:R(P),ovf:cs.overflow+'/'+cs.overflowY,maxH:cs.maxHeight,h:cs.height,art:R(art),artH:art&&getComputedStyle(art).height,artMin:art&&getComputedStyle(art).minHeight,copy:R(q('.zt-copy')),first:R(q('input[name=first_name]')),email:R(q('input[name=email],input[type=email]')),btn:R(btn),hit,afterPos:aft&&aft.position+' z'+aft.zIndex+' pe:'+aft.pointerEvents,scrollH:P.scrollHeight,clientH:P.clientHeight,dz:(d=>d&&[d.scrollHeight,d.clientHeight,getComputedStyle(d).overflowY])(P.querySelector(':scope > .drop-zone-draggable'))}});
 await p.screenshot({path:`${OUT}/${tag}.png`});}
const seen=await p.evaluate(()=>window.__ztSeen);let scrolled=null;if(popupAt){scrolled=await p.evaluate(()=>{const P=[...document.querySelectorAll('[id="hl_main_popup-k47rXJwWBv"]')].find(e=>e.getAttribute('data-zt-holiday')==='1');P.scrollTop=9999;const b=P.querySelector('button[type=submit],button.button-element').getBoundingClientRect();return [P.scrollTop,Math.round(b.bottom),innerHeight]});await p.screenshot({path:`${OUT}/${tag}-scrolled.png`});}
console.log(JSON.stringify({tag,popupAt,texts,seen,page,m,scrolled}));await b.close()})();
