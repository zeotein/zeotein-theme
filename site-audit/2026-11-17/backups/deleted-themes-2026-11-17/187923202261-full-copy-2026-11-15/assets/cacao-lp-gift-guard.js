/**
 * Cacao LP gift anti-cheat + shaker hard-cap.
 * - If LP bulk bag is gone, strip welcome-kit gift lines.
 * - Keep at most ONE shaker line (qty 1) across known shaker variants (#2697).
 * - Clear stale cacao LP cart attrs when bag is gone (#2700 leak).
 */
(function () {
  const LP_VARIANT_ID = 67596435783893;
  const GIFT_VARIANT_IDS = [
    67706369507541, // scoop
    67706369540309, // starter
    67706369605845, // cacao
    67706369638613, // vegan
    67706369704149, // LP gift shaker
  ];
  // Live CleanBlend + LP gift — both must not stack
  const SHAKER_VARIANT_IDS = [67706369704149, 53710123892949];

  let busy = false;
  let queued = false;

  function isGift(item) {
    if (!item) return false;
    if (item.properties && item.properties._zt_bb_gift) return true;
    if (item.properties && item.properties._zeotein_free_subscription_shaker) return true;
    if (GIFT_VARIANT_IDS.indexOf(Number(item.variant_id)) !== -1) return true;
    if (SHAKER_VARIANT_IDS.indexOf(Number(item.variant_id)) !== -1) return true;
    return String(item.handle || '').indexOf('lp-gift-') === 0;
  }

  function isShaker(item) {
    if (!item) return false;
    if (SHAKER_VARIANT_IDS.indexOf(Number(item.variant_id)) !== -1) return true;
    if (item.properties && item.properties._zt_bb_gift === 'cleanblend_shaker') return true;
    if (item.properties && item.properties._zeotein_free_subscription_shaker) return true;
    return false;
  }

  function hasBag(items) {
    return (items || []).some(function (item) {
      return Number(item.variant_id) === LP_VARIANT_ID && Number(item.quantity) > 0;
    });
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
          detail: { cart: data, itemCount: data.item_count, source: 'zt-gift-guard' },
        })
      );
    } catch (e) {}
  }

  async function cartUpdate(payload) {
    const res = await fetch('/cart/update.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async function clearLpAttrsIfNeeded(cart) {
    const attrs = (cart && cart.attributes) || {};
    const stamped =
      attrs.landing_page === 'cacao-lp' ||
      attrs.cacao_lp_locked === 'true' ||
      attrs['Cacao Landing Page'] === 'Yes';
    if (!stamped || hasBag(cart.items)) return null;
    return cartUpdate({
      attributes: {
        landing_page: '',
        cacao_lp_locked: '',
        'Cacao Landing Page': '',
      },
      sections: 'cart-drawer,cart-icon-bubble',
      sections_url: window.location.pathname,
    });
  }

  /**
   * Keep first shaker line at qty 1; remove extras (other lines / higher qty).
   */
  function shakerUpdates(items) {
    const shakers = (items || []).filter(isShaker);
    if (!shakers.length) return null;
    const updates = {};
    let kept = false;
    shakers.forEach(function (item) {
      if (!kept) {
        kept = true;
        if (Number(item.quantity) > 1) {
          if (item.key) updates[item.key] = 1;
          else updates[String(item.variant_id)] = 1;
        }
        return;
      }
      if (item.key) updates[item.key] = 0;
      updates[String(item.variant_id)] = 0;
    });
    return Object.keys(updates).length ? updates : null;
  }

  async function strip() {
    if (busy) {
      queued = true;
      return;
    }
    busy = true;
    try {
      let cart = await fetchCart();
      let last = cart;

      // Cap shakers even when bag is present
      const shakeUpd = shakerUpdates(cart.items);
      if (shakeUpd) {
        last = await cartUpdate({
          updates: shakeUpd,
          sections: 'cart-drawer,cart-icon-bubble',
          sections_url: window.location.pathname,
        });
        if (last && last.items) cart = last;
      }

      if (!hasBag(cart.items)) {
        const gifts = (cart.items || []).filter(isGift);
        if (gifts.length) {
          const updates = {};
          gifts.forEach(function (item) {
            if (item.key) updates[item.key] = 0;
            updates[String(item.variant_id)] = 0;
          });
          last = await cartUpdate({
            updates: updates,
            sections: 'cart-drawer,cart-icon-bubble',
            sections_url: window.location.pathname,
          });
          if (!last || last.status) {
            for (let i = 0; i < gifts.length; i++) {
              const r = await fetch('/cart/change.js', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                  id: gifts[i].key,
                  quantity: 0,
                  sections: 'cart-drawer',
                  sections_url: window.location.pathname,
                }),
              });
              last = await r.json().catch(function () {
                return last;
              });
            }
          }
        }
        const cleared = await clearLpAttrsIfNeeded(last && last.items ? last : cart);
        if (cleared) last = cleared;
      }

      paint(last);
    } catch (err) {
      console.warn('[zt-gift-guard]', err);
    } finally {
      busy = false;
      if (queued) {
        queued = false;
        strip();
      }
    }
  }

  function schedule() {
    setTimeout(strip, 0);
    setTimeout(strip, 150);
    setTimeout(strip, 400);
  }

  document.addEventListener('cart:updated', function (event) {
    if (event && event.detail && event.detail.source === 'zt-gift-guard') return;
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
