/**
 * Scroll cacao LP CTAs to Subscribe / One-time + Add to Cart (not just #purchase top).
 * Keeps ATC on screen; when the offer block fits, shows plans through CTA together.
 */
(function (window) {
  if (window.ztGetCacaoOfferScrollY) return;

  function headerOffset() {
    var offset = 0;
    document
      .querySelectorAll(
        '.essential_free_shipping_bar_wrapper, .header-section, .shopify-section-header, #shopify-section-header'
      )
      .forEach(function (el) {
        var style = window.getComputedStyle(el);
        if (style.position !== 'sticky' && style.position !== 'fixed') return;
        var rect = el.getBoundingClientRect();
        if (rect.height < 1 || rect.top > 180) return;
        offset = Math.max(offset, rect.bottom);
      });
    return offset || (window.matchMedia('(max-width: 749px)').matches ? 72 : 100);
  }

  function bottomPad() {
    // Mobile sticky Get Offer bar + safe area (new section or legacy class)
    if (
      document.documentElement.classList.contains('zt-sticky-offer-on') ||
      document.documentElement.classList.contains('zt-bb2-sticky-cta-on') ||
      window.matchMedia('(max-width: 749px)').matches
    ) {
      return 96;
    }
    return 24;
  }

  /**
   * @returns {number|null} document Y to scrollTo
   */
  window.ztGetCacaoOfferScrollY = function ztGetCacaoOfferScrollY() {
    var cta = document.querySelector('.zt-bb2 [data-zt-bb-cta]');
    var plans =
      document.querySelector('.zt-bb2__plans-head') ||
      document.querySelector('.zt-bb2__plans') ||
      document.getElementById('zt-bb2-offer');
    var purchase = document.getElementById('purchase');

    if (!cta && !purchase) return null;

    var scrollY = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;
    var topPad = headerOffset();
    var botPad = bottomPad();

    if (!cta) {
      var margin = parseFloat(window.getComputedStyle(purchase).scrollMarginTop) || 0;
      return Math.max(0, purchase.getBoundingClientRect().top + scrollY - margin);
    }

    var ctaRect = cta.getBoundingClientRect();
    var ctaTopDoc = ctaRect.top + scrollY;
    var ctaBottomDoc = ctaTopDoc + ctaRect.height;

    // Prefer ATC fully visible above bottom chrome
    var scrollForCta = ctaBottomDoc - (vh - botPad);

    if (plans) {
      var plansTopDoc = plans.getBoundingClientRect().top + scrollY;
      var offerHeight = ctaBottomDoc - plansTopDoc;
      var available = vh - topPad - botPad;

      if (offerHeight <= available) {
        // Plans through ATC fit — pin plans under sticky header
        return Math.max(0, plansTopDoc - topPad - 8);
      }
    }

    // Tall mobile stack — keep ATC on screen (plans sit just above)
    return Math.max(0, scrollForCta);
  };

  /**
   * @param {{ frameKey?: string, duration?: number }} [options]
   * @returns {boolean}
   */
  window.ztScrollToCacaoOffer = function ztScrollToCacaoOffer(options) {
    options = options || {};
    var frameKey = options.frameKey || 'ztCacaoOfferFrame';
    var end = window.ztGetCacaoOfferScrollY();
    if (end == null) return false;

    var start = window.scrollY || window.pageYOffset;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cleanUrl = window.location.pathname + window.location.search;

    function clearHash() {
      if (window.history.replaceState) {
        window.history.replaceState(null, '', cleanUrl);
      }
    }

    if (window[frameKey]) {
      window.cancelAnimationFrame(window[frameKey]);
      window[frameKey] = 0;
    }

    if (reduce || Math.abs(end - start) < 2) {
      window.scrollTo(0, end);
      clearHash();
      return true;
    }

    var duration = options.duration || 1300;
    var startTime = null;

    function ease(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function finish(cancelled) {
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window[frameKey] = 0;
      if (!cancelled) clearHash();
    }

    function cancel() {
      if (window[frameKey]) window.cancelAnimationFrame(window[frameKey]);
      finish(true);
    }

    function step(now) {
      if (startTime === null) startTime = now;
      var progress = Math.min(1, (now - startTime) / duration);
      window.scrollTo(0, start + (end - start) * ease(progress));
      if (progress < 1) {
        window[frameKey] = window.requestAnimationFrame(step);
      } else {
        finish(false);
      }
    }

    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window[frameKey] = window.requestAnimationFrame(step);
    return true;
  };
})(window);
