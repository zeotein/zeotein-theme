// Load a page the way a Meta ad visitor does: iPhone 13, Facebook in-app browser user agent,
// "Slow 4G" network (150 ms RTT, 1.6 Mbps down, 750 kbps up) and 4x CPU slowdown.
// Analytics and ad beacons are blocked so the test is not counted as a visit.
// Usage: node lpperf.js <url> <outPrefix> [label]
const { chromium, devices } = require('playwright');
const BLOCK = [/facebook\.com\/tr/, /connect\.facebook\.net/, /google-analytics\.com/, /googletagmanager\.com/,
  /googleadservices\.com/, /doubleclick\.net/, /clarity\.ms/, /analytics\.tiktok\.com/, /monorail-edge\.shopifysvc\.com/,
  /\/\.well-known\/shopify\/monorail/, /\/api\/collect/, /bat\.bing\.com/, /trekkie/, /\/web-pixels/,
  /a\.klaviyo\.com\/client\/events/, /static-tracking\.klaviyo\.com/];
const FB_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22B83 [FBAN/FBIOS;FBAV/490.0.0.40.104;FBBV/655000000;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/18.1;FBSS/3;FBCR/;FBID/phone;FBLC/en_US;FBOP/80]';
(async () => {
  const [,, url, out, label] = process.argv;
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], userAgent: FB_UA });
  await ctx.route('**/*', r => BLOCK.some(re => re.test(r.request().url())) ? r.abort() : r.continue());
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0, reqs = 0; const byType = {};
  const types = {};
  cdp.on('Network.responseReceived', e => { types[e.requestId] = e.type; });
  cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; reqs++; const t = types[e.requestId] || 'Other'; byType[t] = (byType[t] || 0) + e.encodedDataLength; });
  await p.addInitScript(() => {
    window.__perf = { lcp: 0, fcp: 0, cls: 0 };
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__perf.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__perf.fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  const t0 = Date.now();
  const nav = p.goto(url, { waitUntil: 'load', timeout: 90000 }).catch(e => ({ err: String(e) }));
  const shots = [3, 6, 10];
  const overlays = {};
  for (const s of shots) {
    const wait = s * 1000 - (Date.now() - t0);
    if (wait > 0) await p.waitForTimeout(wait);
    try {
      await p.screenshot({ path: `${out}-${s}s.png` });
      overlays[s] = await p.evaluate(() => {
        const vw = innerWidth, vh = innerHeight;
        const big = [...document.querySelectorAll('body *')].filter(e => {
          const st = getComputedStyle(e); if (st.position !== 'fixed' || st.display === 'none' || st.visibility === 'hidden' || +st.opacity < 0.1) return false;
          const r = e.getBoundingClientRect(); const area = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
          return area > 0.2 * vw * vh;
        }).map(e => (e.id ? '#' + e.id : e.tagName.toLowerCase()) + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''));
        const cta = [...document.querySelectorAll('button, a')].find(e => /add to cart|get started|buy|claim|subscribe|start/i.test(e.textContent || '') && e.getBoundingClientRect().top < innerHeight && e.getBoundingClientRect().bottom > 0 && e.offsetHeight > 0);
        const h1 = document.querySelector('h1');
        return { overlays: big.slice(0, 5), ctaInView: cta ? (cta.textContent || '').trim().slice(0, 40) : null, h1: h1 ? h1.textContent.trim().slice(0, 60) : null };
      });
    } catch (e) { overlays[s] = { err: String(e).slice(0, 120) }; }
  }
  const navRes = await nav;
  const loadMs = Date.now() - t0;
  const perf = await p.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0] || {};
    return { ...window.__perf, ttfb: n.responseStart, dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd, htmlKB: Math.round((n.encodedBodySize || 0) / 1024) };
  }).catch(e => ({ err: String(e) }));
  const r = { label, url, loadMs, navErr: navRes && navRes.err, ...perf, requests: reqs, transferKB: Math.round(bytes / 1024),
    byTypeKB: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)]).sort((a, b) => b[1] - a[1])), at: overlays };
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
