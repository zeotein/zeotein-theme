// Renders a hero page itself (phone layout) to a 1080x1920, 30 fps MP4: 540x960 viewport at 2x.
// Usage: node render_direct.js pour.html out/zeotein-pour-reel.mp4 [seconds=13.6]
//        node render_direct.js pour.html --stills dir 3 6 10
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
(async () => {
  const [pageFile, ...rest] = process.argv.slice(2), FPS = 30;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + path.resolve(__dirname, pageFile) + '?manual=1', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  const set = t => page.evaluate(t => window.__zmSetTime(t), t);
  if (rest[0] === '--stills') {
    fs.mkdirSync(rest[1], { recursive: true });
    for (const s of rest.slice(2)) { await set(+s); await page.screenshot({ path: path.join(rest[1], `direct-${s}.png`) }); }
  } else {
    const out = path.resolve(rest[0]), dur = parseFloat(rest[1] || '13.6'), n = Math.round(dur * FPS);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zmdirect-'));
    for (let i = 0; i < n; i++) { await set(i / FPS); await page.screenshot({ path: path.join(dir, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 94 }); }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, '%05d.jpg'),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
    fs.rmSync(dir, { recursive: true, force: true }); console.log('wrote', out, n, 'frames');
  }
  console.log('page errors:', errors.length ? errors : 'none'); await browser.close();
})();
