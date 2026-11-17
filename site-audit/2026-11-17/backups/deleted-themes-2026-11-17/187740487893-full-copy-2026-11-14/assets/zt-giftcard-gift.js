/**
 * Gift card -> free 7-Day Cacao.
 *
 * $50 or more of gift cards in the cart adds one free 7-Day Cacao line.
 * The gift is a physical item, so checkout asks for a shipping address and
 * charges a rate on what would otherwise be a digital-only order.
 * The line drops back out on its own if the gift cards leave the cart.
 *
 * If the shopper removes the gift while gift cards still total $50+, it
 * stays removed for this browser tab (sessionStorage). The flag clears
 * when the gift card total drops below $50, so a later qualifying cart
 * can receive the gift again.
 *
 * When this script adds or removes the gift on the /cart page, it also
 * refreshes the main cart list (not only the drawer and icon).
 */
(function () {
  const GIFT_VARIANT_ID = 68044701171925;
  const GIFT_CARD_VARIANT_IDS = [
    67648700186837, // $10
    67648700219605, // $25
    67648700252373, // $50
    67648700285141, // $100
  ];
  const THRESHOLD_CENTS = 5000;
  const GIFT_PROPERTY = '_zt_gc_gift';
  const GIFT_PROPERTY_VALUE = 'cacao_7day';
  const SOURCE = 'zt-giftcard-gift';
  const DECLINED_KEY = 'zt_gc_gift_declined';
  const BASE_SECTIONS = ['cart-drawer', 'cart-icon-bubble'];

  let busy = false;
  let queued = false;
  let lastItems = [];
  let didReload = false;
  let hookInstalled = false;

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
      if (!isGiftCardLine(item)) return sum;
      return sum + Number(item.line_price || 0);
    }, 0);
  }

  function isCartPage() {
    return /^\/cart\/?$/.test(window.location.pathname);
  }

  function isDeclined() {
    try {
      return sessionStorage.getItem(DECLINED_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setDeclined(value) {
    try {
      if (value) sessionStorage.setItem(DECLINED_KEY, '1');
      else sessionStorage.removeItem(DECLINED_KEY);
    } catch (e) {}
  }

  function unique(list) {
    const seen = {};
    const out = [];
    (list || []).forEach(function (id) {
      if (!id || seen[id]) return;
      seen[id] = true;
      out.push(id);
    });
    return out;
  }

  function sectionIdFromNode(node) {
    let el = node;
    while (el && el !== document.documentElement) {
      const id = el.id || '';
      if (id.indexOf('shopify-section-') === 0) {
        return id.slice('shopify-section-'.length);
      }
      el = el.parentElement;
    }
    return null;
  }

  function discoverCartSectionIds() {
    const ids = BASE_SECTIONS.slice();
    if (!isCartPage()) return unique(ids);
    // Only the main cart list and footer, never header or announcement sections.
    const anchors = document.querySelectorAll('#main-cart-items, #main-cart-footer, cart-items');
    anchors.forEach(function (el) {
      const id = sectionIdFromNode(el);
      if (id) ids.push(id);
    });
    // Static keys from templates/cart.json, used if the DOM is not ready yet.
    ids.push('cart-items', 'cart-footer');
    return unique(ids);
  }

  function sectionsPayload() {
    return {
      sections: discoverCartSectionIds().join(','),
      sections_url: window.location.pathname,
    };
  }

  function applySectionHtml(sectionId, html) {
    if (!sectionId || !html) return false;
    const el = document.getElementById('shopify-section-' + sectionId);
    if (!el) return false;
    el.outerHTML = html;
    return true;
  }

  function mainCartNeedsRefresh() {
    if (!isCartPage()) return false;
    return !!(
      document.querySelector('#main-cart-items, #main-cart-footer, cart-items') ||
      document.querySelector('[id^="shopify-section-cart-items"], [id^="shopify-section-cart-footer"]') ||
      document.querySelector('[id*="__cart-items"], [id*="__cart-footer"]')
    );
  }

  async function fetchSectionsById(ids) {
    const out = {};
    for (let i = 0; i < ids.length; i++) {
      const id = String(ids[i] || '').replace(/^shopify-section-/, '');
      if (!id) continue;
      const url = new URL(window.location.href);
      url.searchParams.set('section_id', id);
      const res = await fetch(url.toString(), {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (res.ok) out[id] = await res.text();
    }
    return out;
  }

  async function fetchSections(ids) {
    if (!ids || !ids.length) return {};
    // Do not send Accept: application/json. On /cart that returns cart.js
    // instead of section HTML.
    const res = await fetch(window.location.pathname + '?sections=' + ids.join(','), {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('sections ' + res.status);
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (data && Array.isArray(data.items) && data.token) {
        return fetchSectionsById(ids);
      }
      return data;
    } catch (e) {
      return fetchSectionsById(ids);
    }
  }

  async function refreshMainCart(data) {
    if (!isCartPage()) return;
    let appliedMain = false;
    if (data && data.sections) {
      Object.keys(data.sections).forEach(function (id) {
        if (BASE_SECTIONS.indexOf(id) !== -1) return;
        if (applySectionHtml(id, data.sections[id])) appliedMain = true;
      });
    }
    if (!appliedMain && mainCartNeedsRefresh()) {
      const ids = discoverCartSectionIds().filter(function (id) {
        return BASE_SECTIONS.indexOf(id) === -1;
      });
      try {
        const json = await fetchSections(ids);
        Object.keys(json || {}).forEach(function (id) {
          if (applySectionHtml(id, json[id])) appliedMain = true;
        });
      } catch (e) {}
    }
    if (!appliedMain && mainCartNeedsRefresh()) {
      var already = false;
      try {
        already = sessionStorage.getItem('zt_gc_cart_reloaded') === '1';
      } catch (e) {
        already = true;
      }
      if (!already && !didReload) {
        didReload = true;
        try {
          sessionStorage.setItem('zt_gc_cart_reloaded', '1');
        } catch (e) {}
        window.location.reload();
      }
    }
  }

  async function fetchCart() {
    const res = await fetch('/cart.js', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('cart.js ' + res.status);
    return res.json();
  }

  async function post(url, payload) {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async function paint(data) {
    if (!data) return;
    const drawer = document.querySelector('cart-drawer');
    if (drawer) {
      drawer.classList.toggle('is-empty', Number(data.item_count) === 0);
      if (data.sections && typeof drawer.renderContents === 'function') {
        drawer.renderContents({ sections: data.sections });
      }
    }
    if (data.sections) {
      BASE_SECTIONS.forEach(function (id) {
        if (data.sections[id]) applySectionHtml(id, data.sections[id]);
      });
    }
    await refreshMainCart(data);
    try {
      document.dispatchEvent(
        new CustomEvent('cart:updated', {
          detail: { cart: data, itemCount: data.item_count, source: SOURCE },
        })
      );
    } catch (e) {}
  }

  async function addGift() {
    const payload = Object.assign(
      {
        id: GIFT_VARIANT_ID,
        quantity: 1,
        properties: {},
      },
      sectionsPayload()
    );
    payload.properties[GIFT_PROPERTY] = GIFT_PROPERTY_VALUE;
    return post('/cart/add.js', payload);
  }

  /**
   * Keep the first gift line at qty 1 and clear any extras.
   * A qty of 0 is a removal, not a qty change to restore.
   */
  function normalizeUpdates(giftLines) {
    const live = giftLines.filter(function (item) {
      return Number(item.quantity) > 0;
    });
    if (!live.length) {
      setDeclined(true);
      return null;
    }
    const updates = {};
    let kept = false;
    live.forEach(function (item) {
      if (!kept) {
        kept = true;
        if (Number(item.quantity) !== 1 && item.key) updates[item.key] = 1;
        return;
      }
      if (item.key) updates[item.key] = 0;
    });
    return Object.keys(updates).length ? updates : null;
  }

  function removeUpdates(giftLines) {
    const updates = {};
    giftLines.forEach(function (item) {
      if (item.key) updates[item.key] = 0;
      updates[String(item.variant_id)] = 0;
    });
    return Object.keys(updates).length ? updates : null;
  }

  function itemIndexFromNode(node) {
    let el = node;
    while (el && el !== document && el.getAttribute) {
      const dataIndex = el.getAttribute('data-index');
      if (dataIndex && /^\d+$/.test(dataIndex)) return Number(dataIndex);
      const id = el.id || '';
      const match = id.match(/^(?:Remove|Quantity|CartItem|CartDrawer-Item)-(\d+)$/);
      if (match) return Number(match[1]);
      el = el.parentElement;
    }
    return null;
  }

  function itemFromNode(node) {
    const index = itemIndexFromNode(node);
    if (!index) return null;
    return lastItems[index - 1] || null;
  }

  async function sync() {
    if (busy) {
      queued = true;
      return;
    }
    busy = true;
    try {
      const cart = await fetchCart();
      const items = cart.items || [];
      const giftLines = items.filter(isGiftLine);
      const hadGift = lastItems.some(isGiftLine);
      lastItems = items;
      const qualifies = giftCardCents(items) >= THRESHOLD_CENTS;
      let last = null;

      if (!qualifies) {
        setDeclined(false);
        if (giftLines.length) {
          const updates = removeUpdates(giftLines);
          if (updates) last = await post('/cart/update.js', Object.assign({ updates: updates }, sectionsPayload()));
        }
      } else if (isDeclined()) {
        // Shopper already removed the gift; leave it out for this session.
      } else if (giftLines.length === 0) {
        if (hadGift) {
          setDeclined(true);
        } else {
          const added = await addGift();
          if (added && !added.status) last = added.items ? added : await fetchCart();
          if (last && !last.sections && added && added.sections) last.sections = added.sections;
          if (last && !last.sections) last = await fetchCart();
        }
      } else {
        const updates = normalizeUpdates(giftLines);
        if (updates) last = await post('/cart/update.js', Object.assign({ updates: updates }, sectionsPayload()));
      }

      if (last) {
        lastItems = last.items || lastItems;
        await paint(last);
      }
    } catch (err) {
      console.warn('[' + SOURCE + ']', err);
    } finally {
      busy = false;
      if (queued) {
        queued = false;
        sync();
      }
    }
  }

  function schedule() {
    setTimeout(sync, 0);
    setTimeout(sync, 300);
    setTimeout(sync, 900);
  }

  function isCartMutationUrl(url) {
    const u = String(url || '').split('?')[0];
    return /\/cart\/(add|change|update|clear)(\.js)?$/.test(u);
  }

  function hookCartNetwork() {
    if (hookInstalled || !window.fetch) return;
    hookInstalled = true;
    const orig = window.fetch;
    window.fetch = function () {
      const ret = orig.apply(this, arguments);
      try {
        const req = arguments[0];
        const url = typeof req === 'string' ? req : req && req.url;
        if (isCartMutationUrl(url)) {
          ret
            .then(function () {
              schedule();
            })
            .catch(function () {
              schedule();
            });
        }
      } catch (e) {}
      return ret;
    };
  }

  document.addEventListener('cart:updated', function (event) {
    if (event && event.detail && event.detail.source === SOURCE) return;
    schedule();
  });

  document.addEventListener(
    'click',
    function (event) {
      const target =
        event.target &&
        event.target.closest &&
        event.target.closest('cart-remove-button, a[href*="/cart/change"], button[name="minus"], button[name="plus"]');
      if (!target) return;
      const isMinus = target.matches && (target.matches('button[name="minus"]') || target.getAttribute('name') === 'minus');
      const isPlus = target.matches && (target.matches('button[name="plus"]') || target.getAttribute('name') === 'plus');
      const item = itemFromNode(target);
      if (isGiftLine(item)) {
        if (isPlus) {
          // Qty bump only; clamp handles this. Do not treat as a removal.
        } else if (isMinus) {
          if (Number(item.quantity) <= 1) setDeclined(true);
        } else {
          setDeclined(true);
        }
      }
      schedule();
    },
    true
  );

  hookCartNetwork();
  document.addEventListener('DOMContentLoaded', schedule);
  if (document.readyState !== 'loading') schedule();
})();