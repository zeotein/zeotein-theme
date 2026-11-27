// node render.js out.mp4 | node render.js --stills dir 1 5 9
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const ROOT = __dirname, FPS = 30, T = { '.html': 'text/html', '.webp': 'image/webp', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const b = await chromium.launch(), page = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(`http://127.0.0.1:${srv.address().port}/reel.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => { const w = document.getElementById('scr').contentWindow; return w && w.__zmSetProgress; });
  await page.evaluate(async () => { await document.getElementById('scr').contentDocument.fonts.ready; });
  await page.waitForTimeout(600);
  const a = process.argv.slice(2);
  if (a[0] === '--stills') { fs.mkdirSync(a[1], { recursive: true }); for (const s of a.slice(2)) { await page.evaluate(t => __reelSet(t), +s); await page.screenshot({ path: path.join(a[1], `r-${s}.png`) }); } }
  else {
    const out = path.resolve(a[0]), dur = await page.evaluate(() => __reelDuration), n = Math.round(dur * FPS), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'anat-'));
    for (let i = 0; i < n; i++) { await page.evaluate(t => __reelSet(t), i / FPS); await page.screenshot({ path: path.join(dir, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 94 }); if (i % 150 === 0) console.log('frame', i, '/', n); }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', path.join(dir, '%05d.jpg'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
    fs.rmSync(dir, { recursive: true, force: true }); console.log('wrote', out, n, 'frames', dur.toFixed(1) + 's');
  }
  console.log('page errors:', errs.length ? errs : 'none'); await b.close(); srv.close();
})();
