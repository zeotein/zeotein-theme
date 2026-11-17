// Crawl zeotein.com pages on desktop + phone; collect errors, broken assets, SEO tags, overflow, weight.
// Blocks analytics/ad beacons so the audit does not count as visits or pollute ad data.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[3] || path.join(__dirname, 'crawl');
const urls = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });

const BLOCK = [
  /facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com\/gtag\/js/,
  /googleadservices\.com/, /doubleclick\.net/, /clarity\.ms/, /analytics\.tiktok\.com/, /ct\.pinterest\.com/,
  /monorail-edge\.shopifysvc\.com/, /\/\.well-known\/shopify\/monorail/, /\/api\/collect/, /bat\.bing\.com/,
  /static\.hotjar\.com/, /snap\.licdn\.com/, /sc-static\.net/, /tr\.snapchat\.com/, /trekkie/, /\/web-pixels/,
  /a\.klaviyo\.com\/client\/events/, /static-tracking\.klaviyo\.com/, /fast\.a\.klaviyo\.com\/.*track/,
];

const slug = u => (new URL(u).pathname.replace(/\/$/, '').replace(/^\//, '') || 'home').replace(/[\/]/g, '__');

(async () => {
  const browser = await chromium.launch();
  const results = [];
  const profiles = [
    { name: 'desktop', ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
    { name: 'phone', ctx: { ...devices['iPhone 13'] } },
  ];
  for (const prof of profiles) {
    const context = await browser.newContext({ ...prof.ctx, locale: 'en-US', timezoneId: 'America/Chicago' });
    await context.route('**/*', route => {
      const u = route.request().url();
      if (BLOCK.some(re => re.test(u))) return route.abort();
      return route.continue();
    });
    const queue = urls.slice();
    const worker = async () => { while (queue.length) { const url = queue.shift();
      const page = await context.newPage();
      const rec = { url, profile: prof.name, consoleErrors: [], pageErrors: [], failed: [], badStatus: [] };
      let bytes = 0, reqs = 0;
      page.on('console', m => { if (m.type() === 'error') { const t = m.text(); if (/ERR_TUNNEL_CONNECTION_FAILED|net::ERR_FAILED/.test(t)) return; rec.consoleErrors.push(t.slice(0, 300)); } });
      page.on('pageerror', e => rec.pageErrors.push(String(e && e.message || e).slice(0, 300)));
      page.on('requestfailed', r => {
        const u = r.url();
        if (BLOCK.some(re => re.test(u))) return;
        if (/ERR_TUNNEL_CONNECTION_FAILED/.test((r.failure()||{}).errorText||'')) { rec.envBlocked = (rec.envBlocked||0)+1; return; }
        rec.failed.push({ url: u.slice(0, 200), err: (r.failure() || {}).errorText });
      });
      page.on('response', async r => {
        reqs++;
        const s = r.status();
        if (s >= 400) rec.badStatus.push({ url: r.url().slice(0, 200), status: s });
        try { const h = await r.headerValue('content-length'); if (h) bytes += parseInt(h, 10) || 0; } catch (e) {}
      });
      const t0 = Date.now();
      let resp;
      try {
        resp = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      } catch (e) { rec.gotoError = String(e.message).slice(0, 200); }
      rec.status = resp ? resp.status() : null;
      rec.finalUrl = page.url();
      rec.loadMs = Date.now() - t0;
      await page.waitForTimeout(2500);
      // scroll to trigger lazy content
      try {
        await page.evaluate(async () => {
          const h = document.body.scrollHeight; for (let y = 0; y < h; y += 900) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(600);
      } catch (e) {}
      try {
        Object.assign(rec, await page.evaluate(() => {
          const q = s => document.querySelector(s);
          const meta = n => { const m = q(`meta[name="${n}"]`) || q(`meta[property="${n}"]`); return m ? m.getAttribute('content') : null; };
          const imgs = [...document.images].filter(i => i.complete && i.currentSrc && i.naturalWidth === 0 && i.offsetParent !== null).map(i => i.currentSrc.slice(0, 200));
          const noAlt = [...document.images].filter(i => !i.hasAttribute('alt')).length;
          const links = [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith('http'));
          const emptyLinks = [...document.querySelectorAll('a[href="#"], a[href=""], a:not([href])')].filter(a => a.offsetParent !== null).map(a => (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 60));
          const h1s = [...document.querySelectorAll('h1')].map(h => h.innerText.trim().slice(0, 120));
          const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { const j = JSON.parse(s.textContent); return (Array.isArray(j) ? j : [j]).map(x => x['@type']).join(','); } catch (e) { return 'INVALID_JSON'; } });
          // elements wider than viewport
          const vw = document.documentElement.clientWidth;
          const wide = [];
          document.querySelectorAll('body *').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && (r.right > vw + 2) && getComputedStyle(el).position !== 'fixed') {
              const cs = getComputedStyle(el.parentElement || el);
              wide.push((el.tagName + '.' + (el.className && el.className.baseVal === undefined ? el.className : '')).slice(0, 80) + ` r=${Math.round(r.right)}`);
            }
          });
          return {
            title: document.title, metaDescription: meta('description'), canonical: (q('link[rel="canonical"]') || {}).href || null,
            robots: meta('robots'), ogImage: meta('og:image'), h1s, ldTypes: ld,
            brokenImgs: imgs, imgsNoAlt: noAlt, linkCount: links.length, links: [...new Set(links)],
            emptyLinks: emptyLinks.slice(0, 20),
            scrollW: document.documentElement.scrollWidth, clientW: vw, wideCount: wide.length, wideSample: wide.slice(0, 8),
            docHeight: document.body.scrollHeight,
            bodyTextLen: document.body.innerText.length,
          };
        }));
      } catch (e) { rec.evalError = String(e.message).slice(0, 200); }
      try {
        const perf = await page.evaluate(() => {
          const n = performance.getEntriesByType('navigation')[0] || {};
          const res = performance.getEntriesByType('resource');
          const tb = res.reduce((a, r) => a + (r.transferSize || 0), 0) + (n.transferSize || 0);
          const js = res.filter(r => r.initiatorType === 'script').length;
          return { ttfb: Math.round(n.responseStart || 0), dcl: Math.round(n.domContentLoadedEventEnd || 0), load: Math.round(n.loadEventEnd || 0), transferKB: Math.round(tb / 1024), resources: res.length, scripts: js };
        });
        rec.perf = perf;
      } catch (e) {}
      rec.reqs = reqs;
      try {
        await page.screenshot({ path: path.join(OUT, 'shots', `${slug(url)}-${prof.name}.jpg`), type: 'jpeg', quality: 70 });
      } catch (e) {}
      results.push(rec);
      console.log(`${prof.name} ${rec.status} ${url} cerr=${rec.consoleErrors.length} perr=${rec.pageErrors.length} bad=${rec.badStatus.length} fail=${rec.failed.length} broken=${(rec.brokenImgs||[]).length} overflow=${rec.scrollW > rec.clientW}`);
      await page.close();
    } };
    await Promise.all([worker(), worker(), worker(), worker(), worker()]);
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
})();
