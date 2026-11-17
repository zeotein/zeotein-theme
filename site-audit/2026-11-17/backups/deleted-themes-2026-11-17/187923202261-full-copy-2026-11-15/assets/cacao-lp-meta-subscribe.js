/**
 * Cacao LP — Meta Subscribe helpers (Dana Meta Subscribe Event Spec).
 * Browser Pixel only here. Checkout thank-you uses the Customer Events
 * custom pixel in assets/cacao-lp-meta-subscribe-custom-pixel.js (paste into Admin).
 */
(function (w) {
  'use strict';

  var STORAGE_EID = 'zt_meta_subscribe_eid';
  var STORAGE_FIRED = 'zt_meta_subscribe_pixel_fired';

  function uuid() {
    if (w.crypto && typeof w.crypto.randomUUID === 'function') {
      return w.crypto.randomUUID();
    }
    return 'zt_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  /**
   * @param {Record<string, unknown>} [params]
   * @returns {Record<string, string|number>}
   */
  function buildPayload(params) {
    var p = params || {};
    /** @type {Record<string, string|number>} */
    var out = {
      // Spec §01/§02: numbers; LTV = value × 4.3 when caller omits predicted_ltv
      value: p.value != null ? Number(p.value) : 76.99,
      currency: p.currency != null ? String(p.currency) : 'USD',
      predicted_ltv:
        p.predicted_ltv != null
          ? Number(p.predicted_ltv)
          : +(Number(p.value != null ? p.value : 76.99) * 4.3).toFixed(2),
      content_category: p.content_category != null ? String(p.content_category) : 'Subscription',
      status: p.status != null ? String(p.status) : 'subscribed',
    };
    if (p.content_name) out.content_name = String(p.content_name);
    if (p.content_ids) out.content_ids = /** @type {any} */ (p.content_ids);
    if (p.content_type) out.content_type = String(p.content_type);
    return out;
  }

  /**
   * Fire Subscribe when fbq is ready (queue briefly if Pixel loads late).
   * @param {Record<string, unknown>} [params]
   * @param {string} [eventId]
   * @returns {string} eventId used
   */
  function trackSubscribe(params, eventId) {
    var eid = eventId || uuid();
    var payload = buildPayload(params);

    function send() {
      if (typeof w.fbq !== 'function') return false;
      try {
        w.fbq('track', 'Subscribe', payload, { eventID: eid });
        try {
          w.sessionStorage.setItem(STORAGE_EID, eid);
          w.sessionStorage.setItem(STORAGE_FIRED, '1');
        } catch (e) {}
        return true;
      } catch (err) {
        console.warn('[zt-meta-sub] Subscribe pixel failed', err);
        return false;
      }
    }

    if (send()) return eid;

    var tries = 0;
    var timer = w.setInterval(function () {
      tries += 1;
      if (send() || tries >= 40) w.clearInterval(timer);
    }, 250);

    return eid;
  }

  /**
   * Persist event id on the cart so thank-you / CAPI can dedupe.
   * @param {string} eventId
   * @param {Record<string, string>} [extra]
   */
  function persistCartSubscribeMeta(eventId, extra) {
    /** @type {Record<string, string>} */
    var attributes = {
      zt_meta_subscribe_eid: eventId,
      zt_meta_subscribe_browser: '1',
      landing_page: 'cacao-lp',
    };
    if (extra) {
      Object.keys(extra).forEach(function (k) {
        if (extra[k] != null && extra[k] !== '') attributes[k] = String(extra[k]);
      });
    }
    return fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ attributes: attributes }),
    }).catch(function () {});
  }

  function alreadyFiredInBrowser() {
    try {
      return w.sessionStorage.getItem(STORAGE_FIRED) === '1';
    } catch (e) {
      return false;
    }
  }

  function getStoredEventId() {
    try {
      return w.sessionStorage.getItem(STORAGE_EID) || '';
    } catch (e) {
      return '';
    }
  }

  w.ZtMetaSubscribe = {
    uuid: uuid,
    trackSubscribe: trackSubscribe,
    persistCartSubscribeMeta: persistCartSubscribeMeta,
    alreadyFiredInBrowser: alreadyFiredInBrowser,
    getStoredEventId: getStoredEventId,
    buildPayload: buildPayload,
  };
})(window);
