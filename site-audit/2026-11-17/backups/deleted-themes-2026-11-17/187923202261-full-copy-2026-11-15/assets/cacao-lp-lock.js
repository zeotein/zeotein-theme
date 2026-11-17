/**
 * Cacao LP lock helpers:
 * - Keep Essential Free Shipping ($150) bar removed if the app re-injects it
 * - Soft-hide common checkout-bound free-shipping widgets on this storefront path
 */
(function () {
  if (!document.body || !document.body.classList.contains('cacao-lp-locked')) return;
  if (window.__ztCacaoLpLock) return;
  window.__ztCacaoLpLock = true;

  var SELECTORS = [
    '.essential_free_shipping_bar_wrapper',
    '[class*="essential_free_shipping"]',
    '[id*="essential_free_shipping"]',
    '[class*="EssentialFreeShipping"]',
    '.efs-bar',
    '#efs-bar',
  ];

  function matchesShippingBar(node) {
    if (!node || node.nodeType !== 1) return false;
    return SELECTORS.some(function (sel) {
      try {
        return node.matches(sel) || (node.querySelector && node.querySelector(sel));
      } catch (e) {
        return false;
      }
    });
  }

  function hide(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.matches) {
      SELECTORS.forEach(function (sel) {
        try {
          if (node.matches(sel)) {
            node.style.setProperty('display', 'none', 'important');
            node.setAttribute('hidden', '');
            node.setAttribute('aria-hidden', 'true');
          }
          if (node.querySelectorAll) {
            node.querySelectorAll(sel).forEach(function (el) {
              el.style.setProperty('display', 'none', 'important');
              el.setAttribute('hidden', '');
              el.setAttribute('aria-hidden', 'true');
            });
          }
        } catch (e) {}
      });
    }
  }

  function sweep() {
    SELECTORS.forEach(function (sel) {
      try {
        document.querySelectorAll(sel).forEach(hide);
      } catch (e) {}
    });
  }

  sweep();

  if (typeof MutationObserver === 'function') {
    var obs = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach(function (n) {
            if (matchesShippingBar(n)) hide(n);
          });
        }
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  // Do NOT stamp landing_page / cacao_lp_locked on page load.
  // That leaked onto later non-LP orders (#2700). Buy-box ATC owns those attrs.

  // Hide LeadConnector chat while Dawn cart drawer is open
  function syncChatWithDrawer() {
    var open = Boolean(document.querySelector('cart-drawer.active'));
    document.documentElement.classList.toggle('zt-lp-cart-drawer-open', open);
  }
  if (typeof MutationObserver === 'function') {
    var drawerHost = document.querySelector('cart-drawer');
    if (drawerHost) {
      new MutationObserver(syncChatWithDrawer).observe(drawerHost, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }
  }
  document.addEventListener('click', function () {
    setTimeout(syncChatWithDrawer, 0);
  });
  syncChatWithDrawer();
})();
