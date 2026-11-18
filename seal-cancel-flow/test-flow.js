const { chromium, devices } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const url = 'file://' + path.resolve('harness.html');
  const R = [['too_much','I have too much product','Every 6 weeks','Seal frequency changed to: Every 6 weeks'],
             ['taste',"I'm not loving the taste",'Cacao recipes','popup'],
             ['money','It costs too much right now','Skip next delivery','Seal control clicked: Skip next delivery'],
             ['other','Something else','Pause my subscription','Seal control clicked: Pause subscription']];
  const results = [];
  for (const [k, reason, save, expect] of R) {
    for (const pts of [4120]) {
      const p = await ctx.newPage();
      await p.goto(url + '?pts=' + pts);
      await p.click('#open');
      await p.check(`input[value="${reason}"]`);
      await p.screenshot({ path: `screens/1-reason-${k}.png` });
      await p.click('#sealCancel');
      await p.waitForSelector('#zt-cf h2');
      const s2 = await p.textContent('#zt-cf h2');
      await p.screenshot({ path: `screens/2-video-${k}.png` });
      await p.click('#zt-cf [data-a=next]');
      await p.screenshot({ path: `screens/3-save-${k}.png` });
      const s3 = await p.textContent('#zt-cf h2');
      const words = (await p.innerText('#zt-cf .zt-cf-card')).replace('×','').replace('★','').split(/\s+/).filter(w=>/[A-Za-z0-9]/.test(w)).length;
      // save path
      let saveOk;
      if (expect === 'popup') { const [pop] = await Promise.all([ctx.waitForEvent('page'), p.click(`text=${save}`)]); await pop.waitForLoadState('commit').catch(()=>{}); saveOk = /6ac6ab3522bc27f58fc3e9d7\.pdf/.test(pop.url()); await pop.close(); }
      else { await p.click(`#zt-cf >> text=${save}`); saveOk = (await p.textContent('#log')).includes(expect); }
      const cancelledOnSave = (await p.textContent('#log')).includes('SEAL CANCEL');
      // cancel path
      await p.goto(url + '?pts=' + pts); await p.click('#open'); await p.check(`input[value="${reason}"]`);
      await p.click('#sealCancel'); await p.click('#zt-cf [data-a=next]'); await p.click('#zt-cf .zt-cf-cancel');
      const cancelLog = await p.textContent('#log');
      results.push({ k, s2, s3, words_on_screen3_incl_step_label: words, saveOk, cancelledOnSave, cancelReachedSeal: cancelLog.includes('SEAL CANCEL HANDLER RAN with reason: ' + reason) });
      await p.close();
    }
  }
  // points unknown variant
  const p = await ctx.newPage(); await p.goto(url); await p.click('#open'); await p.check('input[value="Something else"]');
  await p.click('#sealCancel'); await p.click('#zt-cf [data-a=next]'); await p.screenshot({ path: 'screens/3-save-other-points-unknown.png' });
  // fail open: no reason picked
  await p.goto(url); await p.click('#open'); await p.click('#sealCancel');
  const failOpen = (await p.textContent('#log')).includes('SEAL CANCEL HANDLER RAN') && !(await p.$('#zt-cf:not([hidden]) h2'));
  // screen 2 cancel link and escape
  await p.goto(url); await p.click('#open'); await p.check('input[value="Something else"]'); await p.click('#sealCancel');
  await p.keyboard.press('Escape'); const escClosed = !(await p.$('#zt-cf:not([hidden]) h2'));
  await p.click('#sealCancel'); await p.click('#zt-cf .zt-cf-link'); const s2cancel = (await p.textContent('#log')).includes('SEAL CANCEL HANDLER RAN');
  console.log(JSON.stringify({ results, failOpen, escClosed, s2cancel }, null, 1));
  await b.close();
})();
