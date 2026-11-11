(function () {
  var KEY = 'zt_hp_v1', DISMISS_DAYS = 7, day = 864e5;
  var root = document.getElementById('zt-hp'); if (!root) return;
  var q = new URLSearchParams(location.search);
  var force = q.get('zt_popup') === '1';
  function store() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(Object.assign(store(), o))); } catch (e) {} }
  var st = store(), now = Date.now();
  if (!force) {
    if (st.submitted) return;
    if (st.dismissed && now - st.dismissed < DISMISS_DAYS * day) return;
    try { if (sessionStorage.getItem(KEY + '_shown')) return; } catch (e) {}
    var src = (q.get('utm_source') || '') + (q.get('utm_medium') || '');
    if (/email|sms|ghl|klaviyo|leadconnector/i.test(src)) { save({ dismissed: now }); return; }
  }
  var s1 = root.querySelector('.zt-hp__s1'), s2 = root.querySelector('.zt-hp__s2');
  var form = root.querySelector('.zt-hg-form');
  var opened = false, done = false;
  function open(trigger) {
    if (opened || (!force && store().submitted)) return; opened = true;
    try { sessionStorage.setItem(KEY + '_shown', '1'); } catch (e) {}
    root.hidden = false; root.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { root.classList.add('is-open'); });
    document.documentElement.style.overflow = 'hidden';
    try { (window.dataLayer = window.dataLayer || []).push({ event: 'zt_holiday_popup_view', trigger: trigger }); } catch (e) {}
    setTimeout(function () { if (window.matchMedia('(pointer:fine)').matches) form.firstName.focus(); }, 350);
  }
  function close() {
    root.classList.remove('is-open'); document.documentElement.style.overflow = '';
    setTimeout(function () { root.hidden = true; root.setAttribute('aria-hidden', 'true'); }, 300);
    if (!done) save({ dismissed: Date.now() });
  }
  root.addEventListener('click', function (e) { if (e.target.closest('[data-zt-close]')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && opened && !root.hidden) close(); });
  window.ztHgBind(form, function () { done = true; save({ submitted: Date.now() }); s1.hidden = true; s2.hidden = false; });
  // A visitor who submits the page's own form should never see the pop-up.
  document.addEventListener('zt:hg-submitted', function () { done = true; save({ submitted: Date.now() }); });

  if (force) { setTimeout(function () { open('preview'); }, 400); return; }
  var start = Date.now();
  if (window.matchMedia('(min-width:701px) and (pointer:fine)').matches) {
    // Desktop: exit intent only, armed after 8s so it never fires early.
    document.addEventListener('mouseout', function (e) {
      if (e.relatedTarget || e.toElement || e.clientY > 10 || Date.now() - start < 8000) return;
      open('exit_intent');
    });
  } else {
    // Mobile: 35s on this page (Dana: 30-45s). Leaving the page cancels it.
    var t = setTimeout(function () { if (document.visibilityState === 'visible' && !store().submitted) open('mobile_35s'); }, 35000);
    window.addEventListener('pagehide', function () { clearTimeout(t); });
  }
})();
