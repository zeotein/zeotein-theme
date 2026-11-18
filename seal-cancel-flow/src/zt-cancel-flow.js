/* Zeotein cancel flow for the Seal customer portal (zeotein.com/a/subscriptions).
   Screen 1 is Seal's own reason question, left as it is.
   When the customer presses Seal's final cancel button, this shows
   screen 2 (short note + video) and screen 3 (one save option matched to the
   reason, the rewards line, and one cancel button). The cancel button hands
   the click straight back to Seal, so Seal records the reason and cancels.

   Safety rules built in:
   - Fail open. Any error, or no reason found, and Seal's cancel runs untouched.
   - Every screen has a visible way to cancel. Escape or the X goes back to Seal.
   - Nothing here touches billing, failed payment retries or ads.
*/
(function () {
  'use strict';
  if (window.__ztCancelFlow) return;
  window.__ztCancelFlow = true;

  var CFG = Object.assign({
    // YouTube video ID of the UNLISTED cancellation video. Leave blank to show the thumbnail card.
    videoId: '',
    // 'autoplay' = plays on its own, muted, captions on. 'thumbnail' = big image that opens the video.
    videoMode: 'autoplay',
    poster: '',
    cacaoGuide: 'https://assets.cdn.filesafe.space/Kch9YmRfzpmQrAs5Bchz/media/6ac6ab3522bc27f58fc3e9d7.pdf',
    veganGuide: 'https://assets.cdn.filesafe.space/Kch9YmRfzpmQrAs5Bchz/media/6ac6ab41045e774991a86e2c.pdf',
    points: null,               // number, if the page can supply the customer's points
    // How to recognise Seal's buttons. Text based so it survives Seal markup changes.
    cancelText: /^\s*(cancel( my)? subscription|confirm cancel(lation)?|yes,? cancel)\s*$/i,
    skipText: /^\s*skip( (next|this))?( (order|delivery|shipment))?\s*$/i,
    pauseText: /^\s*pause( subscription)?\s*$/i,
    frequencyText: /(change )?(delivery )?(frequency|interval|schedule)/i
  }, window.ZT_CANCEL_FLOW || {});

  var COPY = {
    s2: { title: 'Thanks for telling us', body: "Here's a quick note from Dana. It plays muted with captions on.", next: 'Continue' },
    s3: {
      too_much: { title: 'Get it less often', body: 'Switch to one bag every 6 or 8 weeks. Change it back anytime.', actions: [['Every 6 weeks', 'freq6'], ['Every 8 weeks', 'freq8']] },
      taste:    { title: 'Try it a new way', body: 'Our recipe guides turn it into shakes, smoothies and coffee drinks in minutes.', actions: [['Cacao recipes', 'cacao'], ['Vegan recipes', 'vegan']] },
      money:    { title: 'Skip your next delivery', body: 'Nothing ships and nothing is charged next time. Your plan and price stay the same.', actions: [['Skip next delivery', 'skip']] },
      other:    { title: 'Pause instead', body: 'Take a break and keep your plan and price. Start again whenever you like.', actions: [['Pause my subscription', 'pause']] }
    },
    pointsKnown: 'You have {n} rewards points. 3,500 points = $10 off.',
    pointsUnknown: 'Your rewards points stay yours. 3,500 = $10 off.',
    cancel: 'Cancel my subscription'
  };

  function bucket(reason) {
    var r = (reason || '').toLowerCase();
    // money first: "costs too much" must not land in "too much product"
    if (/cost|price|expens|money|afford|budget|cheap/.test(r)) return 'money';
    if (/too much|enough|stock|piling|often|frequen|left over|leftover/.test(r)) return 'too_much';
    if (/tast|flavo|texture|like it/.test(r)) return 'taste';
    return 'other';
  }

  function textOf(el) { return (el && (el.innerText || el.textContent) || '').replace(/\s+/g, ' ').trim(); }

  function findReason(btn) {
    var scope = btn.closest('[role="dialog"], .seal-modal, [class*="modal"], form, .seal-subscription-page') || document;
    var checked = scope.querySelector('input[type="radio"]:checked, input[type="checkbox"]:checked');
    if (checked) {
      var lab = checked.id && scope.querySelector('label[for="' + checked.id + '"]');
      return textOf(lab || checked.closest('label') || checked.parentElement) || checked.value;
    }
    var sel = scope.querySelector('select');
    if (sel && sel.selectedIndex > 0) return textOf(sel.options[sel.selectedIndex]);
    var picked = scope.querySelector('[aria-checked="true"], [aria-pressed="true"], .selected, .active');
    return picked ? textOf(picked) : '';
  }

  function findSealControl(re) {
    var els = document.querySelectorAll('.seal-subscription-page button, .seal-subscription-page a, .seal-subscription-page [role="button"], button, a');
    for (var i = 0; i < els.length; i++) {
      if (els[i].closest('#zt-cf')) continue;
      if (re.test(textOf(els[i]))) return els[i];
    }
    return null;
  }

  var pending = null, bypass = false;

  document.addEventListener('click', function (e) {
    if (bypass) return;
    try {
      var btn = e.target.closest('button, a, [role="button"], input[type="submit"]');
      if (!btn || btn.closest('#zt-cf')) return;
      if (!CFG.cancelText.test(textOf(btn) || btn.value || '')) return;
      var reason = findReason(btn);
      if (!reason) return;                 // reason step not done yet: let Seal carry on
      e.preventDefault();
      e.stopImmediatePropagation();
      pending = btn;
      open(bucket(reason));
    } catch (err) { /* fail open */ }
  }, true);

  function finishCancel() {
    var b = pending; close();
    if (!b) return;
    bypass = true;
    try { b.click(); } finally { setTimeout(function () { bypass = false; }, 400); }
  }

  function videoHTML() {
    var id = CFG.videoId;
    if (id && CFG.videoMode === 'autoplay') {
      var src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
        '?autoplay=1&mute=1&playsinline=1&cc_load_policy=1&cc_lang_pref=en&rel=0&modestbranding=1&controls=1';
      return '<div class="zt-cf-video"><iframe src="' + src + '" title="A note from Dana" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>';
    }
    var href = id ? 'https://youtu.be/' + encodeURIComponent(id) : '#';
    var bg = CFG.poster ? ' style="background-image:url(' + CFG.poster + ')"' : '';
    return '<a class="zt-cf-video zt-cf-thumb" href="' + href + '" target="_blank" rel="noopener"' + bg + '>' +
      '<span class="zt-cf-play" aria-hidden="true"></span><span class="zt-cf-chip">Muted · CC</span>' +
      '<span class="zt-cf-cap">A quick note from Dana</span></a>';
  }

  function pointsLine() {
    var n = CFG.points;
    return (typeof n === 'number' && isFinite(n)) ? COPY.pointsKnown.replace('{n}', n.toLocaleString('en-US')) : COPY.pointsUnknown;
  }

  var root = null;
  function shell(inner, step) {
    if (!root) { root = document.createElement('div'); root.id = 'zt-cf'; document.body.appendChild(root); }
    root.innerHTML = '<div class="zt-cf-back"></div><div class="zt-cf-card" role="dialog" aria-modal="true" aria-labelledby="zt-cf-h">' +
      '<div class="zt-cf-top"><span class="zt-cf-dots" aria-label="Step ' + step + ' of 3">' + [1, 2, 3].map(function (i) { return '<i' + (i <= step ? ' class="on"' : '') + '></i>'; }).join('') + '</span>' +
      '<button class="zt-cf-x" type="button" aria-label="Close" data-a="close">×</button></div>' + inner + '</div>';
    root.hidden = false;
    var h = root.querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
  }

  function screen2(b) {
    shell('<h2 id="zt-cf-h">' + COPY.s2.title + '</h2><p class="zt-cf-p">' + COPY.s2.body + '</p>' + videoHTML() +
      '<button class="zt-cf-btn" type="button" data-a="next" data-b="' + b + '">' + COPY.s2.next + '</button>' +
      '<button class="zt-cf-link" type="button" data-a="cancel">' + COPY.cancel + '</button>', 2);
  }

  function screen3(b) {
    var c = COPY.s3[b];
    var acts = c.actions.map(function (a, i) {
      return '<button class="zt-cf-btn' + (i ? ' zt-cf-btn2' : '') + '" type="button" data-a="' + a[1] + '">' + a[0] + '</button>';
    }).join('');
    shell('<h2 id="zt-cf-h">' + c.title + '</h2><p class="zt-cf-p">' + c.body + '</p>' +
      '<div class="zt-cf-acts' + (c.actions.length > 1 ? ' two' : '') + '">' + acts + '</div>' +
      '<p class="zt-cf-pts"><span aria-hidden="true">★</span> ' + pointsLine() + '</p>' +
      '<button class="zt-cf-cancel" type="button" data-a="cancel">' + COPY.cancel + '</button>', 3);
  }

  function open(b) { screen2(b); }
  function close() { if (root) { root.hidden = true; root.innerHTML = ''; } pending = null; }

  function save(action) {
    var target = null;
    if (action === 'cacao' || action === 'vegan') { window.open(action === 'cacao' ? CFG.cacaoGuide : CFG.veganGuide, '_blank', 'noopener'); return; }
    if (action === 'skip') target = findSealControl(CFG.skipText);
    if (action === 'pause') target = findSealControl(CFG.pauseText);
    if (action === 'freq6' || action === 'freq8') {
      var weeks = action === 'freq6' ? 6 : 8;
      var sel = Array.prototype.find.call(document.querySelectorAll('.seal-subscription-page select'), function (s) {
        return Array.prototype.some.call(s.options, function (o) { return new RegExp('\\b' + weeks + '\\s*week', 'i').test(o.text); });
      });
      if (sel) {
        var opt = Array.prototype.find.call(sel.options, function (o) { return new RegExp('\\b' + weeks + '\\s*week', 'i').test(o.text); });
        sel.value = opt.value; sel.dispatchEvent(new Event('change', { bubbles: true }));
        close(); dismissSealModal(); sel.scrollIntoView({ block: 'center' }); return;
      }
      target = findSealControl(CFG.frequencyText);
    }
    close(); dismissSealModal();
    if (target) { target.scrollIntoView({ block: 'center' }); target.click(); }
  }

  function dismissSealModal() {
    var x = document.querySelector('[role="dialog"] [aria-label*="lose" i], .seal-modal .seal-close, [class*="modal"] [class*="close"]');
    if (x && !x.closest('#zt-cf')) try { x.click(); } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('#zt-cf [data-a]');
    if (!el) { if (e.target.classList && e.target.classList.contains('zt-cf-back')) close(); return; }
    var a = el.getAttribute('data-a');
    if (a === 'close') close();
    else if (a === 'next') screen3(el.getAttribute('data-b'));
    else if (a === 'cancel') finishCancel();
    else save(a);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root && !root.hidden) close(); });

  window.ztCancelFlowOpen = open; // used by the test page only
})();
