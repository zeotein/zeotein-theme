// Renders reel.html to a 1080x1920, 30 fps MP4, one exact frame at a time.
// Usage: node render_reel.js [--query 'src=pour.html&hold=12.4'] [outfile.mp4]   full render (needs ffmpeg)
//        node render_reel.js --stills out_dir 1 9 15  stills at those seconds
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const ROOT = __dirname, FPS = 30;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  let args = process.argv.slice(2), query = '';
  if (args[0] === '--query') { query = args[1]; args = args.slice(2); }
  await page.goto(base + '/reel.html' + (query ? '?' + query : ''), { waitUntil: 'networkidle' });
  await page.waitForFunction(() => { const w = document.getElementById('hero').contentWindow; return w && w.__zmSetTime; });
  await page.evaluate(async () => { await document.fonts.ready; await document.getElementById('hero').contentDocument.fonts.ready; });
  await page.waitForTimeout(500);

  
  if (args[0] === '--stills') {
    const dir = args[1]; fs.mkdirSync(dir, { recursive: true });
    for (const s of args.slice(2)) { await page.evaluate(t => window.__reelSet(t), +s); await page.screenshot({ path: path.join(dir, `reel-${s}.png`) }); }
  } else {
    const out = path.resolve(args[0] || path.join(ROOT, 'out', 'zeotein-mix-reel.mp4'));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const frames = fs.mkdtempSync(path.join(require('os').tmpdir(), 'zmreel-'));
    const dur = await page.evaluate(() => window.__reelDuration), n = Math.round(dur * FPS);
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.__reelSet(t), i / FPS);
      await page.screenshot({ path: path.join(frames, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 94 });
      if (i % 60 === 0) process.stdout.write(`frame ${i}/${n}\n`);
    }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, '%05d.jpg'),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
    fs.rmSync(frames, { recursive: true, force: true });
    console.log('wrote', out, `${n} frames, ${dur}s`);
  }
  console.log('page errors:', errors.length ? errors : 'none');
  await browser.close(); server.close();
})();
