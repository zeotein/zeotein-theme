/**
 * Gift card -> free 7-Day Cacao.
 *
 * $50 or more of gift cards in the cart adds one free 7-Day Cacao line.
 * The gift is a physical item, so checkout asks for a shipping address and
 * charges a rate on what would otherwise be a digital-only order.
 * The line drops back out on its own if the gift cards leave the cart.
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

  let busy = false;
  let queued = false;

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

  function sectionsPayload() {
    return {
      sections: 'cart-drawer,cart-icon-bubble',
      sections_url: window.location.pathname,
    };
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

  function paint(data) {
    if (!data) return;
    const drawer = document.querySelector('cart-drawer');
    if (drawer) {
      drawer.classList.toggle('is-empty', Number(data.item_count) === 0);
      if (data.sections && typeof drawer.renderContents === 'function') {
        drawer.renderContents({ sections: data.sections });
      }
    }
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
   */
  function normalizeUpdates(giftLines) {
    const updates = {};
    let kept = false;
    giftLines.forEach(function (item) {
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
      const qualifies = giftCardCents(items) >= THRESHOLD_CENTS;
      let last = null;

      if (qualifies && giftLines.length === 0) {
        const added = await addGift();
        if (added && !added.status) last = await fetchCart();
      } else if (qualifies && giftLines.length) {
        const updates = normalizeUpdates(giftLines);
        if (updates) last = await post('/cart/update.js', Object.assign({ updates: updates }, sectionsPayload()));
      } else if (!qualifies && giftLines.length) {
        const updates = removeUpdates(giftLines);
        if (updates) last = await post('/cart/update.js', Object.assign({ updates: updates }, sectionsPayload()));
      }

      if (last) paint(last);
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
    setTimeout(sync, 250);
  }

  document.addEventListener('cart:updated', function (event) {
    if (event && event.detail && event.detail.source === SOURCE) return;
    schedule();
  });

  document.addEventListener(
    'click',
    function (event) {
      const btn = event.target && event.target.closest && event.target.closest('cart-remove-button');
      if (!btn) return;
      schedule();
    },
    true
  );

  document.addEventListener('DOMContentLoaded', schedule);
  if (document.readyState !== 'loading') schedule();
})();
