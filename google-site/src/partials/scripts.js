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
  var params = fromUrl(), landing = '';
  if (Object.keys(params).length) {
    landing = window.location.hostname + window.location.pathname;
    try { window.localStorage.setItem(STORE, JSON.stringify({ t: Date.now(), p: params, l: landing })); } catch (e) {}
  } else {
    params = fromStore();
    try { landing = (JSON.parse(window.localStorage.getItem(STORE) || '{}') || {}).l || ''; } catch (e) {}
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
    if (heroCta) {
      /* Scroll position, not IntersectionObserver: a fast fling or an in-page link can jump straight past the
         button without it ever being on screen, and the observer would then never fire. */
      var queued = false;
      var place = function () { queued = false; setBar(heroCta.getBoundingClientRect().bottom < 0); };
      window.addEventListener('scroll', function () { if (!queued) { queued = true; window.requestAnimationFrame(place); } }, { passive: true });
      window.addEventListener('resize', place);
      place();
    }
  }

  /* 4. Optional live star rating. The visible rating lines use the approved store-wide figure from config
     (ratingText). Elements marked data-zt-stars, if any are added later, show the live Judge.me figure
     instead once a public token is set; with no token, or if Judge.me does not answer, they stay hidden. */
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

  /* 6. On-site cart. Visitors add protein blends and single ingredients here, on shop.zeotein.com, and check out once.
     Checkout adds every line (with its subscription plan) to the zeotein.com cart in one request, saves the ad
     parameters on the order as cart attributes, then opens Shopify checkout. Nobody is sent to browse the live store. */
  /* The catalog is written straight into this script at build time (src/catalog.json), so the cart does not depend on
     GoHighLevel keeping a separate data tag intact. */
  var CATALOG = {{catalogJson}} || {};
  var ITEMS = CATALOG.items || {}, SHOPIFY = CATALOG.store || 'https://zeotein.com';
  var CART_KEY = 'zt_cart_v1', CART_TTL = 14 * 24 * 60 * 60 * 1000;
  var cartEl = document.querySelector('.ztg [data-zt-cart]');
  function loadCart() {
    try { var o = JSON.parse(window.localStorage.getItem(CART_KEY) || 'null'); if (o && o.t && (Date.now() - o.t) < CART_TTL && o.lines) return o.lines; } catch (e) {}
    return [];
  }
  function saveCart() { try { window.localStorage.setItem(CART_KEY, JSON.stringify({ t: Date.now(), lines: lines })); } catch (e) {} }
  function money(n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* A saved cart is rebuilt from the current catalog on every page load, so prices, names and plans are always
     today's. A line whose size or delivery plan is no longer offered is dropped rather than sent to checkout. */
  function refreshLine(l) {
    var it = l && ITEMS[l.id], idx = 0; if (!it) return null;
    if (it.sizes) { idx = -1; it.sizes.forEach(function (s, i) { if (String(s[1]) === String(l.vid)) idx = i; }); }
    else if (it.plans) { idx = -1; it.plans.forEach(function (p, i) { if (String(p[1]) === String(l.sp)) idx = i; }); }
    if (idx < 0) return null;
    var n = makeLine(l.id, idx); n.qty = n.max ? 1 : Math.max(1, Math.min(parseInt(l.qty, 10) || 1, 10)); return n;
  }
  var lines = loadCart().map(refreshLine).filter(Boolean);
  function makeLine(id, opt) {
    var it = ITEMS[id]; if (!it) return null; opt = parseInt(opt || 0, 10) || 0;
    if (it.sizes) {
      var s = it.sizes[opt] || it.sizes[0];
      return { key: id + '|' + s[1], id: id, vid: s[1], sp: null, name: it.name, detail: s[0], price: s[2], img: it.img, qty: 1 };
    }
    var p = it.plans ? (it.plans[opt] || it.plans[0]) : null;
    return { key: id + '|' + it.variant + '|' + (p ? p[1] : ''), id: id, vid: it.variant, sp: p ? p[1] : null, name: it.name,
      detail: it.detail + (p ? ' · ' + p[0].toLowerCase() : ''), price: it.price, renew: it.renew || 0, max: it.max || 0,
      img: it.img, qty: 1, freeShip: !!it.freeShip };
  }
  function addLine(id, opt) {
    var l = makeLine(id, opt); if (!l) return;
    if (l.max) { lines = lines.filter(function (x) { return x.id !== l.id; }); lines.push(l); }
    else {
      var ex = null; lines.forEach(function (x) { if (x.key === l.key) ex = x; });
      if (ex) ex.qty = Math.min(ex.qty + 1, 10); else lines.push(l);
    }
    saveCart(); renderCart(); openCart();
  }
  function checkoutUrl() {
    var q = [], a = [], E = encodeURIComponent;
    lines.forEach(function (l, i) {
      q.push(E('items[' + i + '][id]') + '=' + l.vid, E('items[' + i + '][quantity]') + '=' + l.qty);
      if (l.sp) q.push(E('items[' + i + '][selling_plan]') + '=' + l.sp);
    });
    Object.keys(params).forEach(function (k) { a.push(E('attributes[' + k + ']') + '=' + E(params[k])); });
    a.push(E('attributes[source_site]') + '=' + E(window.location.hostname || 'shop.zeotein.com'));
    if (landing) a.push(E('attributes[landing_page]') + '=' + E(landing));
    a.push('return_to=' + E('/checkout'));
    q.push('return_to=' + E('/cart/update?' + a.join('&')));
    /* Clear the zeotein.com cart first, so Checkout always carries exactly this cart: a shopper who
       goes to checkout, comes back and checks out again would otherwise get every item twice.
       Chain: /cart/clear -> /cart/add (items + plans) -> /cart/update (UTMs, gclid) -> /checkout.
       UTMs ride on the first URL too, so Shopify's own session attribution sees them. */
    var u = ['return_to=' + E('/cart/add?' + q.join('&'))];
    Object.keys(params).forEach(function (k) { u.push(E(k) + '=' + E(params[k])); });
    return SHOPIFY + '/cart/clear?' + u.join('&');
  }
  function renderCart() {
    var count = 0, total = 0, anyFree = false, subs = [];
    lines.forEach(function (l) { count += l.qty; total += l.price * l.qty; if (l.freeShip) anyFree = true; if (l.sp && l.renew) subs.push(l); });
    document.querySelectorAll('.ztg [data-zt-cart-count]').forEach(function (b) { b.textContent = String(count); b.hidden = !count; });
    if (!cartEl) return;
    var box = cartEl.querySelector('[data-zt-cart-items]');
    if (!lines.length) {
      box.innerHTML = '<div class="cart-empty"><p>Your cart is empty.</p><p><a href="' + esc(cartEl.getAttribute('data-cacao')) + '">Shop Cacao</a> &middot; <a href="' +
        esc(cartEl.getAttribute('data-vegan')) + '">Shop Vegan</a> &middot; <a href="' + esc(cartEl.getAttribute('data-singles')) + '">Single ingredients</a></p></div>';
    } else {
      box.innerHTML = lines.map(function (l) {
        var k = esc(l.key);
        var qty = l.max ? '<span class="one">1 per customer</span>' :
          '<span class="stepper"><button type="button" data-zt-qty="-1" data-key="' + k + '" aria-label="One fewer">&minus;</button><b>' + l.qty +
          '</b><button type="button" data-zt-qty="1" data-key="' + k + '" aria-label="One more">+</button></span>';
        var renew = (l.sp && l.renew) ? '<span class="renew">' + (l.renew !== l.price ? 'First order ' + money(l.price) + ', then ' : '') + money(l.renew) + ' per delivery until you cancel</span>' : '';
        return '<div class="cl"><img src="' + esc(l.img) + '" width="64" height="64" alt=""><div class="cl-info"><b>' + esc(l.name) + '</b><span>' + esc(l.detail) + '</span>' + renew +
          '<div class="cl-row">' + qty + '<button type="button" class="rm" data-zt-remove data-key="' + k + '">Remove</button></div></div><div class="cl-price">' + money(l.price * l.qty) + '</div></div>';
      }).join('');
    }
    var t = cartEl.querySelector('[data-zt-cart-total]'); if (t) t.textContent = money(total);
    var note = cartEl.querySelector('[data-zt-cart-note]');
    if (note) note.textContent = 'Shipping and tax are calculated at checkout.' + (anyFree ? ' The Cacao Starter Kit and Cacao bulk bag ship free in the US.' : '') +
      (subs.length ? ' Subscriptions renew at the price shown until you cancel; skip, pause or cancel anytime.' : '');
    var go = cartEl.querySelector('[data-zt-checkout]');
    if (go) {
      if (lines.length) { go.setAttribute('href', checkoutUrl()); go.removeAttribute('aria-disabled'); }
      else { go.setAttribute('href', '#'); go.setAttribute('aria-disabled', 'true'); }
    }
  }
  var lastFocus = null;
  function openCart() {
    if (!cartEl) return; lastFocus = document.activeElement;
    cartEl.hidden = false; document.documentElement.classList.add('zt-cart-open');
    window.requestAnimationFrame(function () { cartEl.classList.add('open'); var x = cartEl.querySelector('.cart-x'); if (x) x.focus(); });
  }
  function closeCart() {
    if (!cartEl || cartEl.hidden) return;
    cartEl.classList.remove('open'); document.documentElement.classList.remove('zt-cart-open');
    setTimeout(function () { cartEl.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }, 220);
  }
  function chosen(form) {
    var r = form.querySelector('input[type="radio"]:checked'), id = r ? r.value : form.getAttribute('data-zt-default');
    var plan = form.querySelector('[data-zt-plan]');
    return { id: id, opt: (ITEMS[id] && ITEMS[id].plans && plan) ? plan.value : 0 };
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var b;
    if ((b = t.closest('.ztg [data-zt-add]'))) {
      e.preventDefault(); var opt = 0, src = b.getAttribute('data-zt-opt-from');
      if (src) { var s = document.querySelector(src); if (s) opt = s.value; } else if (b.hasAttribute('data-zt-opt')) opt = b.getAttribute('data-zt-opt');
      addLine(b.getAttribute('data-zt-add'), opt); return;
    }
    if ((b = t.closest('.ztg [data-zt-buy-add]'))) { e.preventDefault(); var f = b.closest('[data-zt-buy]'); if (f) { var c = chosen(f); addLine(c.id, c.opt); } return; }
    if (t.closest('.ztg [data-zt-cart-open]')) { e.preventDefault(); openCart(); return; }
    if (t.closest('.ztg [data-zt-cart-close]')) { e.preventDefault(); closeCart(); return; }
    if ((b = t.closest('.ztg [data-zt-qty]'))) {
      var key = b.getAttribute('data-key'), d = parseInt(b.getAttribute('data-zt-qty'), 10);
      lines = lines.map(function (x) { if (x.key === key) x.qty = Math.max(0, Math.min(10, x.qty + d)); return x; }).filter(function (x) { return x.qty > 0; });
      saveCart(); renderCart(); return;
    }
    if ((b = t.closest('.ztg [data-zt-remove]'))) { var rk = b.getAttribute('data-key'); lines = lines.filter(function (x) { return x.key !== rk; }); saveCart(); renderCart(); return; }
    if ((b = t.closest('.ztg [data-zt-checkout]'))) {
      if (!lines.length) { e.preventDefault(); return; }
      b.setAttribute('href', checkoutUrl());
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });
  window.addEventListener('storage', function (e) { if (e.key === CART_KEY) { lines = loadCart().map(refreshLine).filter(Boolean); renderCart(); } });
  window.__ztgCart = { lines: function () { return lines; }, url: checkoutUrl, add: addLine, items: ITEMS };
  renderCart();

  /* 7. Buy box: show the delivery schedule only for subscriptions, keep price, note and photo in step with the option */
  document.querySelectorAll('.ztg [data-zt-buy]').forEach(function (form) {
    function sync() {
      var c = chosen(form), it = ITEMS[c.id] || {};
      var fq = form.querySelector('[data-zt-freq]'); if (fq) fq.hidden = !it.plans;
      var pr = form.querySelector('[data-zt-buy-price]'); if (pr) pr.textContent = money(it.price || 0);
      var nt = form.querySelector('[data-zt-buy-note]');
      if (nt) nt.textContent = it.plans ? ((it.renew && it.renew !== it.price) ? 'First order, then ' + money(it.renew) + ' per delivery. Skip, pause or cancel anytime.' : money(it.renew || it.price) + ' per delivery. Skip, pause or cancel anytime.') : 'One-time purchase.';
      var img = document.querySelector(form.getAttribute('data-zt-img') || 'x-none');
      if (img && it.img) { if (it.imgLg) { img.srcset = it.img + ' 640w, ' + it.imgLg + ' 1024w'; img.src = it.imgLg; } else { img.removeAttribute('srcset'); img.src = it.img; } }
      form.querySelectorAll('.opt').forEach(function (o) { var r = o.querySelector('input'); o.classList.toggle('on', !!(r && r.checked)); });
    }
    form.addEventListener('change', sync); sync();
  });

  /* 8. Size pickers on single-ingredient cards and pages */
  document.querySelectorAll('.ztg [data-zt-size]').forEach(function (sel) {
    var it = ITEMS[sel.getAttribute('data-zt-size')], card = sel.closest('[data-zt-card]');
    function sync() { var s = it && it.sizes[parseInt(sel.value, 10) || 0]; var out = card && card.querySelector('[data-zt-price]'); if (s && out) out.textContent = money(s[2]); }
    sel.addEventListener('change', sync); sync();
  });
})();
