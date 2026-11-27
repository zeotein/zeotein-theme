// Records the scroll animation full-screen, frame-exact: node record.js desktop|phone out.mp4
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const [mode, outArg] = process.argv.slice(2);
const V = mode === 'phone' ? { width: 405, height: 720, dpr: 1080 / 405 } : { width: 1600, height: 900, dpr: 1.2 };
// scroll script: [p to rest on, seconds to hold]; moves take 1.4s
const STOPS = [[0, 2.4, 0], [.335, 1.6, 6.0], [.49, 2.8, 1.8], [.71, 3.2, 1.8], [.985, 3.4, 1.9]];
const MOVE = 1.4, FPS = 30;
const KEYS = []; let t = 0;
STOPS.forEach(([p, hold, mv], i) => { if (i) { t += mv; } KEYS.push([t, p]); t += hold; KEYS.push([t, p]); });
const DUR = t;
const io = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const pAt = T => { for (let i = 1; i < KEYS.length; i++) if (T <= KEYS[i][0]) { const [t0, a] = KEYS[i - 1], [t1, b] = KEYS[i]; return a + (b - a) * io((T - t0) / ((t1 - t0) || 1)); } return KEYS.at(-1)[1]; };
(async () => {
  const b = await chromium.launch(), page = await b.newPage({ viewport: { width: V.width, height: V.height }, deviceScaleFactor: V.dpr });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?manual=1', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zscroll-')), n = Math.round(DUR * FPS);
  for (let i = 0; i < n; i++) { await page.evaluate(([p, s]) => __zmSetProgress(p, s), [pAt(i / FPS), i / FPS]); await page.screenshot({ path: path.join(dir, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 93 }); }
  const out = path.resolve(outArg); fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, '%05d.jpg'), '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('wrote', out, n, 'frames', DUR.toFixed(1) + 's', 'errors:', errs.length ? errs : 'none'); await b.close();
})();
