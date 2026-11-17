/**
 * Gift card -> free Cacao 7-Day (v3, Nov 15 2026).
 *
 * $50 or more of gift cards in the cart adds one free Cacao 7-Day line
 * (variant 68044701171925, $0, title "Free Gift: Cacao 7-Day with $50+ Gift Card").
 * The line drops back out on its own when the gift card total goes below $50
 * (gift card removed or quantity lowered).
 *
 * v3 change: the gift is now added or removed BEFORE the theme sees the
 * response of its own cart request (add to cart, quantity change, remove).
 * So the redirect to /cart, the cart page list and any drawer or notification
 * render with the gift already in place. No more "only shows at checkout".
 * The response is passed through untouched except: when the theme asked for
 * section HTML and the gift changed, those sections are re-rendered fresh and
 * item_count is updated, so the first paint is already correct.
 *
 * If the shopper removes the gift while gift cards still total $50+, it
 * stays removed for this browser tab (sessionStorage zt_gc_gift_declined).
 * The flag clears when the gift card total drops below $50.
 *
 * Checkout backstop is unchanged: Shopify Flow 01a1751f still adds the $0
 * copy at order time only if the order has $50+ of gift cards and no gift line.
 */
(function () {
  if (window.__ztGcGiftV3) return;
  window.__ztGcGiftV3 = true;

  var GIFT_VARIANT_ID = 68044701171925;
  var GIFT_CARD_VARIANT_IDS = [
    67648700186837, // $10
    67648700219605, // $25
    67648700252373, // $50
    67648700285141 // $100
  ];
  var THRESHOLD_CENTS = 5000;
  var GIFT_PROPERTY = '_zt_gc_gift';
  var GIFT_PROPERTY_VALUE = 'cacao_7day';
  var SOURCE = 'zt-giftcard-gift';
  var DECLINED_KEY = 'zt_gc_gift_declined';
  var MAX_SECTIONS = 5; // Shopify Ajax API limit per request

  var rawFetch = window.fetch ? window.fetch.bind(window) : null;
  if (!rawFetch) return;

  var lastItems = null; // items from the last cart we read on this page
  var lock = Promise.resolve();

  function isGiftCardLine(item) {
    return GIFT_CARD_VARIANT_IDS.indexOf(Number(item.variant_id)) !== -1;
  }
  function isGiftLine(item) {
    if (!item) return false;
    if (Number(item.variant_id) === GIFT_VARIANT_ID) return true;
    return !!(item.properties && item.properties[GIFT_PROPERTY]);
  }
  function giftCardCents(items) {
    return (items || []).reduce(function (sum, item) {
      return isGiftCardLine(item) ? sum + Number(item.line_price || 0) : sum;
    }, 0);
  }
  function isCartPage() {
    return /^\/cart\/?$/.test(window.location.pathname);
  }
  function isDeclined() {
    try { return sessionStorage.getItem(DECLINED_KEY) === '1'; } catch (e) { return false; }
  }
  function setDeclined(v) {
    try { v ? sessionStorage.setItem(DECLINED_KEY, '1') : sessionStorage.removeItem(DECLINED_KEY); } catch (e) {}
  }
  function isCartMutationUrl(url) {
    var u = String(url || '').split('?')[0].split('#')[0];
    return /\/cart\/(add|change|update|clear)(\.js)?$/.test(u);
  }

  function withLock(fn) {
    var run = lock.then(fn, fn);
    lock = run.catch(function () {});
    return run;
  }

  function getCart() {
    return rawFetch('/cart.js', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    }).then(function (r) {
      if (!r.ok) throw new Error('cart.js ' + r.status);
      return r.json();
    });
  }
  function postJson(url, payload) {
    return rawFetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); });
  }

  /**
   * Bring the cart in line with the rule. Returns { changed, cart }.
   * Never throws.
   */
  function reconcile() {
    return getCart().then(function (cart) {
      var items = cart.items || [];
      var giftLines = items.filter(isGiftLine);
      var hadGift = !!(lastItems && lastItems.some(isGiftLine));
      var qualified = !!(lastItems && giftCardCents(lastItems) >= THRESHOLD_CENTS);
      var qualifies = giftCardCents(items) >= THRESHOLD_CENTS;
      var op = null;

      if (!qualifies) {
        setDeclined(false);
        if (giftLines.length) {
          var rm = {};
          giftLines.forEach(function (it) { rm[it.key] = 0; });
          op = postJson('/cart/update.js', { updates: rm });
        }
      } else if (giftLines.length === 0) {
        if (hadGift && qualified) {
          // Gift vanished while gift cards still qualified: the shopper removed it.
          setDeclined(true);
        } else if (!isDeclined()) {
          var props = {};
          props[GIFT_PROPERTY] = GIFT_PROPERTY_VALUE;
          op = postJson('/cart/add.js', { items: [{ id: GIFT_VARIANT_ID, quantity: 1, properties: props }] });
        }
      } else {
        // Keep exactly one gift line at quantity 1.
        var up = {}, need = false;
        giftLines.forEach(function (it, i) {
          var want = i === 0 ? 1 : 0;
          if (Number(it.quantity) !== want) { up[it.key] = want; need = true; }
        });
        if (need) op = postJson('/cart/update.js', { updates: up });
      }

      if (!op) {
        lastItems = items;
        return { changed: false, cart: cart };
      }
      return op.then(function () { return getCart(); }).then(function (fresh) {
        lastItems = fresh.items || [];
        return { changed: true, cart: fresh };
      });
    }).catch(function (err) {
      try { console.warn('[' + SOURCE + ']', err); } catch (e) {}
      return { changed: false, cart: null };
    });
  }

  /* ---------- section rendering ---------- */

  function chunk(list, n) {
    var out = [];
    for (var i = 0; i < list.length; i += n) out.push(list.slice(i, i + n));
    return out;
  }
  function fetchSections(ids, path) {
    ids = (ids || []).filter(Boolean);
    if (!ids.length) return Promise.resolve({});
    var base = path || window.location.pathname;
    return Promise.all(chunk(ids, MAX_SECTIONS).map(function (group) {
      var sep = base.indexOf('?') === -1 ? '?' : '&';
      // No Accept: application/json here. On /cart that returns cart.js instead.
      return rawFetch(base + sep + 'sections=' + encodeURIComponent(group.join(',')), {
        credentials: 'same-origin',
        cache: 'no-store'
      }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    })).then(function (parts) {
      var out = {};
      parts.forEach(function (p) {
        if (p && !Array.isArray(p.items)) Object.keys(p).forEach(function (k) { out[k] = p[k]; });
      });
      return out;
    });
  }

  function sectionIdOf(node) {
    var el = node;
    while (el && el !== document.documentElement) {
      if (el.id && el.id.indexOf('shopify-section-') === 0) return el.id.slice(16);
      el = el.parentElement;
    }
    return null;
  }
  function pageCartSectionIds() {
    var ids = [];
    if (document.getElementById('shopify-section-cart-icon-bubble')) ids.push('cart-icon-bubble');
    if (document.getElementById('shopify-section-cart-drawer')) ids.push('cart-drawer');
    if (isCartPage()) {
      document.querySelectorAll('#main-cart-items, #main-cart-footer').forEach(function (el) {
        var id = sectionIdOf(el);
        if (id && ids.indexOf(id) === -1) ids.push(id);
      });
    }
    return ids;
  }
  function applySection(id, html) {
    var el = document.getElementById('shopify-section-' + id);
    if (!el || !html) return false;
    el.outerHTML = html;
    return true;
  }

  /** Repaint everything cart-related on the current page (load-time path). */
  function repaintPage(cart) {
    var ids = pageCartSectionIds();
    return fetchSections(ids).then(function (sections) {
      var drawer = document.querySelector('cart-drawer');
      if (drawer && cart) drawer.classList.toggle('is-empty', Number(cart.item_count) === 0);
      var ok = false;
      ids.forEach(function (id) { if (applySection(id, sections[id])) ok = true; });
      var footer = document.getElementById('main-cart-footer');
      if (footer && cart) footer.classList.toggle('is-empty', Number(cart.item_count) === 0);
      var ci = document.querySelector('cart-items');
      if (ci && cart) ci.classList.toggle('is-empty', Number(cart.item_count) === 0);
      if (!ok && isCartPage()) {
        var done = false;
        try { done = sessionStorage.getItem('zt_gc_cart_reloaded') === '1'; } catch (e) { done = true; }
        if (!done) {
          try { sessionStorage.setItem('zt_gc_cart_reloaded', '1'); } catch (e) {}
          window.location.reload();
        }
      }
      try {
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: cart, itemCount: cart && cart.item_count, source: SOURCE } }));
      } catch (e) {}
    });
  }

  /* ---------- fetch wrapper: fix the cart before the theme sees the response ---------- */

  function requestedSections(init) {
    var body = init && init.body;
    var sections = null, path = null;
    try {
      if (typeof body === 'string') {
        var j = JSON.parse(body);
        sections = j.sections;
        path = j.sections_url;
      } else if (body && typeof FormData !== 'undefined' && body instanceof FormData) {
        sections = body.get('sections');
        path = body.get('sections_url');
      } else if (body && typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) {
        sections = body.get('sections');
        path = body.get('sections_url');
      }
    } catch (e) {}
    if (typeof sections === 'string') sections = sections.split(',');
    if (!Array.isArray(sections)) sections = [];
    sections = sections.map(function (s) { return String(s).trim(); }).filter(Boolean);
    return { ids: sections, path: path || window.location.pathname };
  }

  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var p = rawFetch(input, init);
    if (!isCartMutationUrl(url)) return p;
    var req = requestedSections(init);
    return p.then(function (res) {
      if (!res || !res.ok) {
        withLock(reconcile);
        return res;
      }
      return withLock(reconcile).then(function (result) {
        if (!result.changed) return res;
        return res.clone().text().then(function (text) {
          var data;
          try { data = JSON.parse(text); } catch (e) { return res; }
          if (!data || typeof data !== 'object' || data.status) return res;
          var finish = function (sections) {
            if (sections) data.sections = sections;
            if ('item_count' in data && result.cart) data.item_count = result.cart.item_count;
            var headers = new Headers(res.headers);
            headers.delete('content-length');
            headers.delete('content-encoding');
            return new Response(JSON.stringify(data), { status: res.status, statusText: res.statusText, headers: headers });
          };
          if (data.sections && req.ids.length) {
            return fetchSections(req.ids, req.path).then(function (fresh) {
              var merged = {};
              Object.keys(data.sections).forEach(function (k) { merged[k] = fresh[k] || data.sections[k]; });
              return finish(merged);
            });
          }
          // Theme did not ask for sections: repaint ourselves after it renders.
          setTimeout(function () { repaintPage(result.cart); }, 60);
          return finish(null);
        }).catch(function () { return res; });
      });
    });
  };

  /* Other cart writers (XHR apps): catch up shortly after. */
  if (window.XMLHttpRequest) {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      if (isCartMutationUrl(url)) {
        this.addEventListener('loadend', function () {
          setTimeout(function () {
            withLock(reconcile).then(function (r) { if (r.changed) repaintPage(r.cart); });
          }, 50);
        });
      }
      return origOpen.apply(this, arguments);
    };
  }

  /* Shopper removed the gift line on purpose: remember it for this tab. */
  document.addEventListener('click', function (event) {
    var t = event.target && event.target.closest && event.target.closest('cart-remove-button, a[href*="/cart/change"], button[name="minus"]');
    if (!t || !lastItems) return;
    var el = t, idx = null;
    while (el && el.getAttribute && idx === null) {
      var di = el.getAttribute('data-index');
      if (di && /^\d+$/.test(di)) idx = Number(di);
      var m = (el.id || '').match(/^(?:Remove|Quantity|CartItem|CartDrawer-Item|CartDrawer-Remove)-(\d+)$/);
      if (idx === null && m) idx = Number(m[1]);
      el = el.parentElement;
    }
    var item = idx ? lastItems[idx - 1] : null;
    if (!isGiftLine(item)) return;
    var isMinus = t.getAttribute && t.getAttribute('name') === 'minus';
    if (!isMinus || Number(item.quantity) <= 1) setDeclined(true);
  }, true);

  /* Page load: settle the cart (covers carts built on another page or tab). */
  function onLoad() {
    withLock(reconcile).then(function (r) { if (r.changed) repaintPage(r.cart); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onLoad);
  else onLoad();
  window.addEventListener('pageshow', function (e) { if (e.persisted) onLoad(); });
})();
