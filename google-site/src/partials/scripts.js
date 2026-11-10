(function () {
  if (window.__ztgInit) return; window.__ztgInit = true;

  /* 1. Keep ad click IDs and UTMs across pages of this site.
     The website-level GoHighLevel script copies them from the CURRENT address bar only,
     so a visitor who lands on /cacao?gclid=... and then opens /faq would lose the gclid.
     This stores the last ad visit for 30 days and adds it to zeotein.com links that do not
     already carry the value. Parameters already on a link always win. */
  var KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','gclid','gbraid','wbraid','fbclid','ttclid','msclkid','ref'];
  var HOSTS = ['zeotein.com','www.zeotein.com'];
  var STORE = 'zt_gsite_params', TTL = 30 * 24 * 60 * 60 * 1000;
  function fromUrl() {
    var out = {};
    try { var q = new URLSearchParams(window.location.search); KEYS.forEach(function (k) { var v = q.get(k); if (v) out[k] = v; }); } catch (e) {}
    return out;
  }
  function fromStore() {
    try {
      var raw = window.localStorage.getItem(STORE); if (!raw) return {};
      var o = JSON.parse(raw);
      if (!o || !o.t || (Date.now() - o.t) > TTL) { window.localStorage.removeItem(STORE); return {}; }
      return o.p || {};
    } catch (e) { return {}; }
  }
  var params = fromUrl();
  if (Object.keys(params).length) {
    try { window.localStorage.setItem(STORE, JSON.stringify({ t: Date.now(), p: params })); } catch (e) {}
  } else {
    params = fromStore();
  }
  function decorate(a) {
    try {
      if (!a || !a.getAttribute('href')) return;
      var u = new URL(a.getAttribute('href'), window.location.href);
      if (HOSTS.indexOf(u.hostname) === -1) return;
      var changed = false;
      Object.keys(params).forEach(function (k) { if (!u.searchParams.has(k)) { u.searchParams.set(k, params[k]); changed = true; } });
      if (changed) a.setAttribute('href', u.toString());
    } catch (e) {}
  }
  function decorateAll() { if (!Object.keys(params).length) return; document.querySelectorAll('.ztg a[href]').forEach(decorate); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', decorateAll); } else { decorateAll(); }
  window.addEventListener('load', decorateAll);
  document.addEventListener('click', function (e) { var a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (a) decorate(a); }, true);

  /* 2. Mobile menu */
  document.querySelectorAll('.ztg [data-zt-menu]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var h = btn.closest('[data-zt-hdr]'); if (!h) return;
      var open = !h.classList.contains('open');
      h.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  });

  /* 3. Sticky offer bar on phones, shown once the hero button has scrolled out of view */
  var bar = document.querySelector('.ztg [data-zt-sticky]');
  var heroCta = document.querySelector('.ztg [data-zt-hero-cta]');
  if (bar) {
    var setBar = function (show) { bar.classList.toggle('show', show); bar.setAttribute('aria-hidden', show ? 'false' : 'true'); try { bar.inert = !show; } catch (e) {} };
    setBar(false);
    if (heroCta && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { setBar(!en.isIntersecting && en.boundingClientRect.top < 0); });
      }).observe(heroCta);
    }
  }

  /* 4. Star rating. Shows ONLY the live store-wide Judge.me figure, read when the page loads.
     With no public token set, or if Judge.me does not answer, the rating line stays hidden.
     Nothing is ever hardcoded. */
  var TOKEN = '{{judgemePublicToken}}', SHOP = '{{judgemeShopDomain}}';
  var starEls = document.querySelectorAll('.ztg [data-zt-stars]');
  function parseRating(text) {
    var s = String(text || '').replace(/\\u0027/g, "'").replace(/\\u0022/g, '"').replace(/\\"/g, '"');
    var r = s.match(/data-average-rating=['"]([0-9.]+)['"]/);
    var n = s.match(/data-number-of-reviews=['"]([0-9]+)['"]/);
    if (!r || !n) return null;
    var avg = parseFloat(r[1]), cnt = parseInt(n[1], 10);
    if (!(avg > 0) || !(cnt > 0)) return null;
    return { avg: avg, cnt: cnt };
  }
  window.__ztgParseRating = parseRating;
  if (TOKEN && starEls.length && window.fetch) {
    fetch('https://judge.me/api/v1/widgets/all_reviews_page?api_token=' + encodeURIComponent(TOKEN) + '&shop_domain=' + encodeURIComponent(SHOP) + '&page=1&per_page=1', { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (t) {
        var x = parseRating(t); if (!x) return;
        starEls.forEach(function (el) {
          var label = el.querySelector('[data-zt-stars-text]');
          if (label) label.textContent = x.avg.toFixed(1) + ' average from ' + x.cnt + ' Judge.me reviews';
          el.classList.add('on');
        });
      })
      .catch(function () {});
  }

  /* 5. Footer year */
  document.querySelectorAll('.ztg [data-zt-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
