const { chromium, devices } = require('playwright');
const fs = require('fs');
const pages = JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const outDir = process.argv[3];
(async () => {
  const browser = await chromium.launch();
  for (const mode of ['mobile','desktop']) {
    const ctx = await browser.newContext(mode==='mobile' ? {...devices['iPhone 13'], deviceScaleFactor: 1} : {viewport:{width:1440,height:900}, deviceScaleFactor:1});
    for (const p of pages) {
      const page = await ctx.newPage();
      let bytes=0, reqs=0, scripts=0, thirdParty={};
      page.on('response', async r => { reqs++; try{ const h=r.headers(); const len=parseInt(h['content-length']||'0'); bytes+=len; const u=new URL(r.url()); if(r.request().resourceType()==='script'){scripts++; thirdParty[u.hostname]=(thirdParty[u.hostname]||0)+1;} }catch(e){} });
      const t0=Date.now();
      try { await page.goto(p.url, {waitUntil:'load', timeout:60000}); } catch(e){ console.log('ERR', p.url, e.message); }
      const loadMs=Date.now()-t0;
      await page.waitForTimeout(3500);
      const lcp = await page.evaluate(() => new Promise(res => { let v=0; try{ new PerformanceObserver(l=>{ for(const e of l.getEntries()) v=e.startTime; }).observe({type:'largest-contentful-paint', buffered:true}); }catch(e){} setTimeout(()=>res(v),500); }));
      const info = await page.evaluate(() => {
        const q=s=>Array.from(document.querySelectorAll(s));
        return {
          finalUrl: location.href,
          title: document.title,
          metaDesc: (document.querySelector('meta[name=description]')||{}).content||null,
          canonical: (document.querySelector('link[rel=canonical]')||{}).href||null,
          robots: (document.querySelector('meta[name=robots]')||{}).content||null,
          h1: q('h1').map(e=>e.innerText.trim()).filter(Boolean),
          h2: q('h2').map(e=>e.innerText.trim()).filter(Boolean).slice(0,40),
          jsonld: q('script[type="application/ld+json"]').map(e=>{try{const j=JSON.parse(e.textContent);return (Array.isArray(j)?j.map(x=>x['@type']):j['@type']);}catch(err){return 'PARSE_ERR'}}),
          imgsNoAlt: q('img').filter(i=>!i.getAttribute('alt')).length,
          imgs: q('img').length,
          productLinks: Array.from(new Set(q('a[href]').map(a=>a.href).filter(h=>/\/products\/|\/cart|checkout|\/collections\//.test(h)))).slice(0,80),
          buttons: q('button, a.button, input[type=submit]').map(b=>(b.innerText||b.value||'').trim()).filter(Boolean).slice(0,60),
          text: document.body.innerText,
          docHeight: document.documentElement.scrollHeight,
        };
      });
      const slug = p.name + '_' + mode;
      await page.screenshot({path: `${outDir}/${slug}_fold.png`});
      try { await page.screenshot({path: `${outDir}/${slug}_full.png`, fullPage:true}); } catch(e) {}
      fs.writeFileSync(`${outDir}/${slug}.json`, JSON.stringify({...info, loadMs, lcp, reqs, bytes, scripts, thirdParty}, null, 1));
      fs.writeFileSync(`${outDir}/${slug}.txt`, info.text);
      console.log(mode, p.name, 'load', loadMs, 'lcp', Math.round(lcp), 'reqs', reqs, 'scripts', scripts, 'height', info.docHeight);
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
})();
