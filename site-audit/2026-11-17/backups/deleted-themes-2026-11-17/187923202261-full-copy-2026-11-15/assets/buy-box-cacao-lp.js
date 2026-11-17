/**
 * Buy Box Cacao LP — bag tiers, subscribe/OTP, gallery, ATC
 * Self-contained (no importmap). Optionally syncs Horizon cart events when available.
 */

// CTAs use #purchase; leaving that hash in the URL made refresh land mid-page on pricing.
(function clearPurchaseHashOnLoad() {
  if (typeof window === 'undefined' || window.location.hash !== '#purchase') return;
  const clean = window.location.pathname + window.location.search;
  if (window.history.replaceState) window.history.replaceState(null, '', clean);
  const toTop = () => window.scrollTo(0, 0);
  toTop();
  window.addEventListener('load', toTop, { once: true });
})();

/** @type {any} */
let CartLinesUpdateEvent = null;

async function loadCartEvents() {
  if (CartLinesUpdateEvent) return CartLinesUpdateEvent;
  try {
    const mod = await import('@shopify/events');
    CartLinesUpdateEvent = mod.CartLinesUpdateEvent || null;
  } catch (e) {
    CartLinesUpdateEvent = null;
  }
  return CartLinesUpdateEvent;
}

function money(n) {
  let v = Number(n);
  if (Number.isNaN(v)) v = 0;
  return `$${v.toFixed(2)}`;
}

function parseMoney(str) {
  const n = parseFloat(String(str || '').replace(/[^0-9.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function storeRoot() {
  if (window.Shopify?.routes?.root) return window.Shopify.routes.root;
  if (window.Theme?.routes?.root) return window.Theme.routes.root;
  return '/';
}

/** Keep landing-page UTMs on cart/checkout navigations (ClickUp funnel tracking). */
function withPageQuery(url) {
  const qs = window.location.search || '';
  if (!qs) return url;
  try {
    const u = new URL(url, window.location.origin);
    const page = new URLSearchParams(qs);
    page.forEach((v, k) => {
      u.searchParams.set(k, v);
    });
    return `${u.pathname}${u.search}${u.hash}`;
  } catch (err) {
    if (String(url).includes('?')) return url;
    return `${url}${qs}`;
  }
}

function cartAddUrl() {
  return window.Theme?.routes?.cart_add_url || `${storeRoot()}cart/add.js`;
}

function cartUpdateUrl() {
  return `${storeRoot()}cart/update.js`;
}

function cartJsonUrl() {
  return window.Theme?.routes?.cart_url
    ? `${window.Theme.routes.cart_url}.js`
    : `${storeRoot()}cart.js`;
}

/** Marks the cart/order so Admin shows it came from the Cacao LP. */
async function markCacaoLandingPageOrder() {
  try {
    await fetch(cartUpdateUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        attributes: {
          'Cacao Landing Page': 'Yes',
          landing_page: 'cacao-lp',
          cacao_lp_locked: 'true',
        },
      }),
    });
  } catch (err) {
    console.warn('[zt-bb] landing page order mark skipped', err);
  }
}

function cartPageUrl() {
  return withPageQuery(window.Theme?.routes?.cart_url || `${storeRoot()}cart`);
}

function checkoutUrl() {
  return withPageQuery(`${storeRoot()}checkout`);
}

function cartSectionIds() {
  /** @type {string[]} */
  const ids = [];
  document.querySelectorAll('cart-items-component').forEach((el) => {
    if (el instanceof HTMLElement && el.dataset.sectionId) {
      ids.push(el.dataset.sectionId);
    }
  });

  // Horizon cart drawer (cacao LP / theme-drawer)
  if (document.querySelector('theme-drawer#cart-drawer, #shopify-section-cart-drawer-section')) {
    if (!ids.includes('cart-drawer-section')) ids.push('cart-drawer-section');
  }

  // Dawn cart drawer + bubble (must request these on /cart/add.js and Section Rendering)
  const dawnDrawer = document.querySelector('cart-drawer');
  if (dawnDrawer && typeof dawnDrawer.getSectionsToRender === 'function') {
    dawnDrawer.getSectionsToRender().forEach((section) => {
      if (!section?.id || ids.includes(section.id)) return;
      if (section.id === 'cart-icon-bubble' && !document.getElementById('cart-icon-bubble')) return;
      ids.push(section.id);
    });
  } else if (dawnDrawer) {
    if (!ids.includes('cart-drawer')) ids.push('cart-drawer');
  }

  const dawnNotification = document.querySelector('cart-notification');
  if (dawnNotification && typeof dawnNotification.getSectionsToRender === 'function') {
    dawnNotification.getSectionsToRender().forEach((section) => {
      if (section?.id && !ids.includes(section.id)) ids.push(section.id);
    });
  } else if (!dawnDrawer && document.querySelector('cart-notification, #cart-icon-bubble')) {
    ['cart-notification-product', 'cart-notification-button', 'cart-icon-bubble'].forEach((id) => {
      if (!ids.includes(id)) ids.push(id);
    });
  }

  return ids;
}

async function fetchCart() {
  const res = await fetch(cartJsonUrl(), {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  });
  if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
  return res.json();
}

/**
 * Fetch rendered section HTML via Shopify Section Rendering API.
 * Do NOT use /cart?sections= — with Accept:application/json that returns cart.js, not HTML.
 * @param {string[]} sectionIds
 */
async function fetchCartSections(sectionIds) {
  if (!sectionIds.length) return {};
  try {
    const root = storeRoot();
    const path =
      window.location.pathname && window.location.pathname !== '/cart'
        ? window.location.pathname
        : root;
    const base = path.endsWith('/') ? path : `${path}`;
    const url = `${base}${base.includes('?') ? '&' : '?'}sections=${encodeURIComponent(sectionIds.join(','))}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    });
    if (!res.ok) return {};
    const data = await res.json();
    // Guard: cart.js payload looks like { token, items, item_count } — not usable here
    if (data && typeof data.item_count === 'number' && !data['cart-drawer'] && !data['cart-icon-bubble']) {
      console.warn('[zt-bb] section fetch returned cart.json, not sections');
      return {};
    }
    return data && typeof data === 'object' ? data : {};
  } catch (e) {
    return {};
  }
}

/**
 * Slide the drawer open with no network wait.
 * Dawn or Horizon. Never calls Shopify.actions.openCart.
 * @returns {boolean}
 */
function isCartPageUrl(url) {
  try {
    const parsed = new URL(String(url), window.location.origin);
    const path = parsed.pathname.replace(/\/+$/, '');
    return path === '/cart' || path.endsWith('/cart');
  } catch (e) {
    return false;
  }
}

/**
 * Keep a drawer add on this page. Other templates never load this script,
 * so their cart-page and notification behavior stays on the theme setting.
 * @param {number} [ms]
 */
function holdCartPageNavigation(ms) {
  if (!window.__ztBbCartGuard) {
    window.__ztBbCartGuard = true;
    window.__ztBbHoldCart = false;

    if (window.navigation && typeof window.navigation.addEventListener === 'function') {
      window.navigation.addEventListener('navigate', (event) => {
        if (!window.__ztBbHoldCart) return;
        const url = event.destination && event.destination.url;
        if (url && isCartPageUrl(url) && event.cancelable) event.preventDefault();
      });
    }

    document.addEventListener(
      'click',
      (event) => {
        if (!window.__ztBbHoldCart) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest('a[href]');
        if (!(link instanceof HTMLAnchorElement) || !isCartPageUrl(link.href)) return;
        event.preventDefault();
      },
      true
    );

    document.addEventListener(
      'submit',
      (event) => {
        if (!window.__ztBbHoldCart) return;
        const form = event.target;
        if (!(form instanceof HTMLFormElement)) return;
        const action = form.getAttribute('action') || '';
        if (action.includes('/cart')) event.preventDefault();
      },
      true
    );
  }

  window.__ztBbHoldCart = true;
  window.clearTimeout(window.__ztBbHoldTimer);
  window.__ztBbHoldTimer = window.setTimeout(() => {
    window.__ztBbHoldCart = false;
  }, ms || 3000);
}

function mountPageCartDrawer() {
  keepDawnCartUpdatesOnThisPage();
  const slot = document.querySelector('[data-zt-bb-drawer-slot]');
  if (!(slot instanceof HTMLElement) || slot.dataset.ztMounted === '1') return;
  slot.dataset.ztMounted = '1';
  document.body.appendChild(slot);
  const drawer = slot.querySelector('cart-drawer');
  if (drawer instanceof HTMLElement) drawer.style.zIndex = '100000';
}

function bindPageCartIconToDrawer() {
  document.querySelectorAll('a.action__cart[href], a.header-actions__action.action__cart').forEach((link) => {
    if (!(link instanceof HTMLAnchorElement) || link.dataset.ztBbDrawerLink === '1') return;
    link.dataset.ztBbDrawerLink = '1';
    link.addEventListener('click', (event) => {
      const drawer = /** @type {(HTMLElement & { open?: (opener?: Element | null) => void }) | null} */ (
        document.querySelector('cart-drawer')
      );
      if (!drawer || typeof drawer.open !== 'function') return;
      event.preventDefault();
      drawer.open(link);
    });
  });
}

function openCartDrawerImmediately() {
  mountPageCartDrawer();
  // Horizon theme-drawer: do NOT open before /cart/add completes. Opening empty
  // then replaceWith()'ing the section destroys the open instance and the
  // post-add open often never sticks. Full open happens in openCartDrawer().
  if (
    document.querySelector('theme-drawer#cart-drawer, #shopify-section-cart-drawer-section') &&
    !document.querySelector('cart-drawer')
  ) {
    return false;
  }

  const opener = document.querySelector('[data-zt-bb-cta]') || document.activeElement;
  const dawnDrawer = /** @type {(HTMLElement & { open?: (opener?: Element | null) => void }) | null} */ (
    document.querySelector('cart-drawer')
  );
  if (dawnDrawer && typeof dawnDrawer.open === 'function') {
    dawnDrawer.classList.add('zt-bb-adding');
    dawnDrawer.open(opener);
    // Re-assert after open() in case any listener mutated classes.
    dawnDrawer.classList.add('zt-bb-adding');
    return true;
  }

  const trigger = /** @type {HTMLElement | null} */ (
    document.querySelector(
      '#cart-icon-bubble[aria-controls="cart-drawer"], a[aria-controls="CartDrawer"], cart-drawer-button, [aria-controls="cart-drawer"]:not([href="/cart"])'
    )
  );
  if (trigger) {
    trigger.click();
    return true;
  }

  return false;
}

/**
 * Item count already painted in the header. Null when the badge is not on the page.
 * @returns {number | null}
 */
function visibleCartCount() {
  const icon = document.querySelector('cart-icon.header-actions__cart-icon');
  if (!(icon instanceof HTMLElement)) return null;
  if (!icon.classList.contains('header-actions__cart-icon--has-cart')) return 0;
  const number = icon.querySelector('.cart-bubble__text-count');
  const count = parseInt(number?.textContent || '', 10);
  return Number.isNaN(count) ? 1 : count;
}

/**
 * Fill the open drawer from the add response. Fetches section HTML only when that response has none.
 * @param {any} [addResponse]
 * @returns {Promise<boolean>}
 */
/**
 * @returns {Promise<void>}
 */
function waitFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Refresh Horizon cart drawer markup, then open theme-drawer reliably.
 * Prefer swapping inner content so the upgraded <theme-drawer> instance stays alive.
 * @param {Record<string, string>} [sections]
 * @returns {Promise<boolean>}
 */
async function refreshAndOpenHorizonCartDrawer(sections) {
  let html =
    (sections && (sections['cart-drawer-section'] || sections['cart-drawer'])) || '';
  if (!html || typeof html !== 'string' || !html.trim()) {
    try {
      const fetched = await fetchCartSections(['cart-drawer-section']);
      html = fetched['cart-drawer-section'] || fetched['cart-drawer'] || '';
    } catch (e) {
      html = '';
    }
  }

  const host = document.getElementById('shopify-section-cart-drawer-section');
  const existingDrawer = /** @type {(HTMLElement & { open?: () => void; refs?: { panel?: Element } }) | null} */ (
    document.querySelector('theme-drawer#cart-drawer')
  );

  if (typeof html === 'string' && html.trim()) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html.trim();

    const newComponent = tmp.querySelector('cart-drawer-component');
    const liveComponent = existingDrawer?.querySelector('cart-drawer-component');
    const newInner = tmp.querySelector('.cart-drawer__inner');
    const liveInner = existingDrawer?.querySelector('.cart-drawer__inner');

    // Keep the live <theme-drawer> so open()/refs survive the refresh.
    if (existingDrawer && newComponent && liveComponent) {
      liveComponent.replaceWith(newComponent);
    } else if (existingDrawer && newInner && liveInner) {
      liveInner.replaceWith(newInner);
    } else {
      const next =
        tmp.querySelector('#shopify-section-cart-drawer-section') ||
        tmp.querySelector('theme-drawer#cart-drawer')?.closest('.shopify-section') ||
        tmp.firstElementChild;
      if (next) {
        if (host) host.replaceWith(next);
        else if (next instanceof HTMLElement) document.body.prepend(next);
      }
    }
  }

  if (window.customElements?.whenDefined) {
    try {
      await customElements.whenDefined('theme-drawer');
    } catch (e) {
      /* ignore */
    }
  }

  // Component refs are filled in connectedCallback — give the new tree a tick.
  await waitFrame();
  await waitFrame();

  for (let attempt = 0; attempt < 20; attempt++) {
    const drawer = /** @type {(HTMLElement & { open?: () => void; refs?: { panel?: Element } }) | null} */ (
      document.querySelector('theme-drawer#cart-drawer')
    );
    if (drawer && typeof drawer.open === 'function') {
      try {
        if (drawer.refs && !drawer.refs.panel) {
          await new Promise((r) => setTimeout(r, 40));
          continue;
        }
        drawer.open();
        // Confirm it actually opened (attribute or dialog[open]).
        await waitFrame();
        const panel = drawer.querySelector('dialog');
        if (drawer.hasAttribute('open') || (panel instanceof HTMLDialogElement && panel.open)) {
          return true;
        }
      } catch (e) {
        console.warn('[zt-bb] theme-drawer open attempt failed', e);
      }
    }
    await new Promise((r) => setTimeout(r, 40));
  }

  console.warn('[zt-bb] theme-drawer open gave up');
  return false;
}

async function openCartDrawer(addResponse) {
  mountPageCartDrawer();

  // Horizon theme-drawer path (cacao LP)
  const hasHorizonDrawer = Boolean(
    document.querySelector('theme-drawer#cart-drawer, #shopify-section-cart-drawer-section')
  );
  if (hasHorizonDrawer && !document.querySelector('cart-drawer')) {
    try {
      // Always re-fetch drawer HTML after add so line items are current.
      // Add-response sections can be missing or stale when gifts are added in a second request.
      let sections = { ...(addResponse?.sections || {}) };
      const fetched = await fetchCartSections(['cart-drawer-section']);
      sections = { ...sections, ...fetched };
      const opened = await refreshAndOpenHorizonCartDrawer(sections);
      if (opened) return true;
    } catch (e) {
      console.warn('[zt-bb] horizon cart-drawer open failed', e);
    }
  }

  // Refresh Dawn cart-drawer HTML via Section Rendering when possible
  const dawnDrawer = /** @type {(HTMLElement & { open?: (opener?: Element | null) => void; renderContents?: (s: any) => void; classList: DOMTokenList }) | null} */ (
    document.querySelector('cart-drawer')
  );
  if (dawnDrawer) {
    try {
      // Always re-fetch drawer HTML after add (gift lines may arrive in a 2nd request).
      let sections = { ...(addResponse?.sections || {}) };
      const sectionIds = document.body.classList.contains('cacao-lp-locked')
        ? ['cart-drawer']
        : ['cart-drawer', 'cart-icon-bubble'];
      const fetched = await fetchCartSections(sectionIds);
      sections = { ...sections, ...fetched };

      dawnDrawer.classList.remove('zt-bb-adding', 'is-empty');
      const inner = dawnDrawer.querySelector('.drawer__inner');
      if (inner) inner.classList.remove('is-empty');

      if (sections['cart-drawer'] && typeof dawnDrawer.renderContents === 'function') {
        const safeSections = { ...sections };
        if (document.body.classList.contains('cacao-lp-locked')) {
          delete safeSections['cart-icon-bubble'];
        }
        dawnDrawer.renderContents({
          id: addResponse?.id || addResponse?.items?.[0]?.id || addResponse?.key,
          sections: safeSections,
        });
        return true;
      }

      // Fallback: open current DOM (never leave zt-bb-adding stuck)
      if (typeof dawnDrawer.open === 'function') {
        dawnDrawer.open(document.querySelector('[data-zt-bb-cta]') || document.activeElement);
        return true;
      }
      dawnDrawer.classList.add('active');
      document.body.classList.add('overflow-hidden');
      return true;
    } catch (e) {
      console.warn('[zt-bb] cart-drawer open failed', e);
      try {
        dawnDrawer.classList.remove('zt-bb-adding', 'is-empty');
        if (typeof dawnDrawer.open === 'function') {
          dawnDrawer.open();
          return true;
        }
      } catch (e2) {
        /* ignore */
      }
    }
  }

  const horizonDrawer = /** @type {(HTMLElement & { open?: () => void }) | null} */ (
    document.querySelector('theme-drawer#cart-drawer')
  );
  if (horizonDrawer && typeof horizonDrawer.open === 'function') {
    try {
      horizonDrawer.open();
      return true;
    } catch (e) {
      console.warn('[zt-bb] theme-drawer open failed', e);
    }
  }

  const trigger = /** @type {HTMLElement | null} */ (
    document.querySelector(
      '#cart-icon-bubble[aria-controls="cart-drawer"], a[aria-controls="CartDrawer"], cart-drawer-button, [aria-controls="cart-drawer"]:not([href="/cart"])'
    )
  );
  if (trigger) {
    trigger.click();
    return true;
  }

  // Last resort: notification popup (only if no drawer exists)
  const dawnNotification = /** @type {(HTMLElement & { open?: () => void; renderContents?: (s: any) => void; setActiveElement?: (el: Element | null) => void }) | null} */ (
    document.querySelector('cart-notification')
  );
  if (dawnNotification) {
    try {
      if (typeof dawnNotification.setActiveElement === 'function') {
        dawnNotification.setActiveElement(document.activeElement);
      }
      if (addResponse?.sections && typeof dawnNotification.renderContents === 'function') {
        dawnNotification.renderContents(addResponse);
      } else if (typeof dawnNotification.open === 'function') {
        dawnNotification.open();
      }
      return true;
    } catch (e) {
      console.warn('[zt-bb] cart-notification open failed', e);
    }
  }

  return false;
}

/**
 * Refresh cart UI when Horizon events aren't available (classic Dawn).
 * @param {any} ajaxCart
 * @param {any} [sections]
 */
function refreshCartUi(ajaxCart, sections) {
  document.dispatchEvent(
    new CustomEvent('cart:updated', {
      detail: { cart: ajaxCart, sections },
    })
  );
  document.dispatchEvent(new CustomEvent('cart:refresh'));

  const count = ajaxCart?.item_count;
  if (typeof count === 'number') {
    document.querySelectorAll('.cart-count-bubble, [data-cart-count]').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      el.textContent = String(count);
      el.classList.toggle('hidden', count === 0);
      if ('hidden' in el) el.hidden = count === 0;
    });
    document.querySelectorAll('[data-zt-lp-cart-count]').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      el.textContent = String(count);
      el.classList.toggle('zt-lp-header__cart-count--empty', count === 0);
    });
    document.querySelectorAll('[data-zt-lp-cart]').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      el.setAttribute('aria-label', count > 0 ? `Cart (${count})` : 'Cart');
    });
  }

  if (sections && typeof sections === 'object') {
    Object.entries(sections).forEach(([id, html]) => {
      if (typeof html !== 'string') return;
      // Never rewrite the LP header cart control — section HTML is another <a>
      // and nested anchors shatter the sticky header layout after add-to-cart.
      if (id === 'cart-icon-bubble' && document.body.classList.contains('cacao-lp-locked')) {
        return;
      }
      const el = document.getElementById(`shopify-section-${id}`) || document.getElementById(id);
      if (!el || el.hasAttribute('data-zt-lp-cart') || el.closest('[data-zt-lp-header]')) return;
      el.innerHTML = html;
    });
  }

  // Keep the cacao LP header badge in sync without touching Dawn's bubble section.
  if (typeof count === 'number') {
    document.querySelectorAll('[data-zt-lp-cart-count]').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      el.textContent = String(count);
      el.classList.toggle('zt-lp-header__cart-count--empty', count === 0);
    });
  }
}

/**
 * @param {{ afterAddAction?: string }} cfg
 * @param {any} [addResponse]
 */
async function afterAdd(cfg, addResponse) {
  const action = cfg.afterAddAction || 'none';
  if (action === 'checkout') {
    window.location.href = checkoutUrl();
    return;
  }
  if (action === 'cart') {
    window.location.href = cartPageUrl();
    return;
  }
  if (action === 'drawer') {
    const opened = await openCartDrawer(addResponse);
    if (!opened) {
      console.warn('[zt-bb] cart drawer not found — staying on page (no /cart redirect)');
    }
  }
}

/**
 * @param {HTMLElement} root
 */
function init(root) {
  if (!root || root.dataset.ztBbReady === '1') return;
  root.dataset.ztBbReady = '1';

  /** @type {Record<string, any>} */
  let cfg = {};
  try {
    const cfgId = root.getAttribute('data-zt-bb-config');
    const cfgEl = cfgId ? document.getElementById(cfgId) : null;
    if (cfgEl) cfg = JSON.parse(cfgEl.textContent || '{}');
  } catch (e) {
    cfg = {};
  }

  const tiers = cfg.tiers || [];
  const state = {
    bagIndex: Math.max(
      0,
      tiers.findIndex(/** @param {any} t */ (t) => t.key === cfg.defaultBag)
    ),
    plan: cfg.defaultPlan === 'once' ? 'once' : 'sub',
    slide: 0,
    added: false,
    adding: false,
  };
  if (state.bagIndex < 0) state.bagIndex = 0;
  if ((cfg.afterAddAction || 'none') === 'drawer') {
    mountPageCartDrawer();
    bindPageCartIconToDrawer();
  }

  const mainEl = /** @type {HTMLElement | null} */ (root.querySelector('[data-zt-bb-main]'));
  const mainImg = /** @type {HTMLImageElement | null} */ (root.querySelector('.zt-bb__main-img'));
  const thumbsEl = /** @type {HTMLElement | null} */ (root.querySelector('[data-zt-bb-thumbs]'));
  const thumbs = /** @type {NodeListOf<HTMLElement>} */ (root.querySelectorAll('[data-zt-bb-thumb]'));
  const bagBtns = root.querySelectorAll('[data-zt-bb-bag]');
  const planCards = root.querySelectorAll('[data-zt-bb-plan]');
  const subMeta = root.querySelector('[data-zt-bb-sub-meta]');
  const subPrice = root.querySelector('[data-zt-bb-sub-price]');
  const subRenew = root.querySelector('[data-zt-bb-sub-renew]');
  const subBanner = root.querySelector('[data-zt-bb-sub-banner]');
  const oncePrice = root.querySelector('[data-zt-bb-once-price]');
  const onceMeta = root.querySelector('[data-zt-bb-once-meta]');
  const onceSave = /** @type {HTMLElement | null} */ (root.querySelector('[data-zt-bb-once-save]'));
  const kit = root.querySelector('[data-zt-bb-kit]');
  const cta = /** @type {HTMLButtonElement | null} */ (root.querySelector('[data-zt-bb-cta]'));
  const ctaLabel = root.querySelector('[data-zt-bb-cta-label]');
  const statusEl = root.querySelector('[data-zt-bb-status]');
  const variantInput = /** @type {HTMLInputElement | null} */ (root.querySelector('[data-zt-bb-variant]'));
  const qtyInput = /** @type {HTMLInputElement | null} */ (root.querySelector('[data-zt-bb-qty]'));
  const planInput = /** @type {HTMLInputElement | null} */ (root.querySelector('[data-zt-bb-selling-plan]'));

  /** Prefer DOM thumb URLs (always in sync with rendered gallery), then config JSON. */
  const slideSrcs = Array.from(thumbs)
    .map((btn) => btn.getAttribute('data-zt-bb-full-src') || '')
    .filter(Boolean);
  const slides = slideSrcs.length ? slideSrcs : cfg.slides || [];

  function currentTier() {
    return tiers[state.bagIndex] || tiers[0] || {};
  }

  /**
   * @param {string} [msg]
   * @param {boolean} [ok]
   */
  function setStatus(msg, ok) {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    statusEl.classList.toggle('is-ok', !!ok);
  }

  /**
   * @param {number} i
   * @param {{ animate?: boolean }} [opts]
   */
  function setSlide(i, opts = {}) {
    if (!slides.length) return;
    const next = ((i % slides.length) + slides.length) % slides.length;
    const src = slides[next];
    if (!src) return;

    state.slide = next;

    if (mainImg) {
      const apply = () => {
        // Drop Shopify srcset so the browser can't keep showing the first image.
        mainImg.removeAttribute('srcset');
        mainImg.removeAttribute('sizes');
        mainImg.src = src;
        mainImg.alt = cfg.productTitle || 'Product image';
        mainImg.classList.remove('is-switching');
      };

      if (opts.animate !== false) {
        mainImg.classList.add('is-switching');
        window.setTimeout(apply, 80);
      } else {
        apply();
      }
    }

    thumbs.forEach((btn, idx) => {
      const active = idx === state.slide;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      // Do not scroll on first paint — scrollIntoView was pulling the page to the buy box.
      if (
        active &&
        opts.scrollThumb !== false &&
        thumbsEl &&
        typeof btn.scrollIntoView === 'function'
      ) {
        btn.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      }
    });
  }

  /**
   * Horizontal swipe helper for main image (and keyboard arrows).
   * @param {HTMLElement | null} el
   * @param {(dir: number) => void} onSwipe
   */
  function bindSwipe(el, onSwipe) {
    if (!el || el.dataset.ztBbSwipe === 'true') return;
    el.dataset.ztBbSwipe = 'true';

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let tracking = false;
    let fired = false;
    const threshold = 36;

    /**
     * @param {number} dx
     * @param {number} dy
     */
    function finish(dx, dy) {
      if (!tracking || fired) {
        tracking = false;
        return;
      }
      tracking = false;
      if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return;
      fired = true;
      onSwipe(dx < 0 ? 1 : -1);
    }

    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      tracking = true;
      fired = false;
      startX = lastX = e.clientX;
      startY = lastY = e.clientY;
    });

    el.addEventListener('pointermove', (e) => {
      if (!tracking || fired) return;
      lastX = e.clientX;
      lastY = e.clientY;
      const dx = lastX - startX;
      const dy = lastY - startY;
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        finish(dx, dy);
      }
    });

    el.addEventListener('pointerup', (e) => {
      if (!tracking) return;
      finish(e.clientX - startX, e.clientY - startY);
    });

    el.addEventListener('pointercancel', () => {
      if (!tracking) return;
      finish(lastX - startX, lastY - startY);
    });

    el.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onSwipe(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onSwipe(-1);
      }
    });
  }

  function render() {
    const tier = currentTier();
    const qty = parseInt(tier.qty, 10) || 1;
    const first = parseMoney(tier.firstPrice);
    const renew = parseMoney(tier.renewPrice);
    const once = parseMoney(tier.oncePrice);
    const saveLabel = tier.saveLabel || '';
    const badge = tier.badge || '';

    bagBtns.forEach((btn, idx) => {
      btn.classList.toggle('is-active', idx === state.bagIndex);
      btn.setAttribute('aria-pressed', idx === state.bagIndex ? 'true' : 'false');
    });

    planCards.forEach((card) => {
      const plan = card.getAttribute('data-zt-bb-plan');
      card.classList.toggle('is-active', plan === state.plan);
      card.setAttribute('aria-pressed', plan === state.plan ? 'true' : 'false');
    });

    if (root.dataset.ztBbVersion === 'v2') {
      const bagWord = qty === 1 ? 'bag' : 'bags';
      const days = qty * 30;
      const gated = introGateActive() && state.plan === 'sub';
      const displaySub = gated ? renew : first;
      const perServing = money(Math.round((displaySub / days) * 100) / 100);
      const planNote = root.querySelector('[data-zt-bb-plan-note]');
      const kitPrice = root.querySelector('[data-zt-bb-kit-price]');
      const shaker = root.querySelector('[data-zt-bb-gift="shaker"]');

      root.classList.toggle('is-once', state.plan !== 'sub');
      root.classList.toggle('is-intro-gated', gated);
      if (subMeta) subMeta.textContent = `${qty} ${bagWord} every ${days} days - ${perServing} per serving`;
      if (subPrice) subPrice.textContent = money(displaySub);
      if (subRenew) {
        subRenew.textContent = gated
          ? `returning subscriber rate · every ${days} days`
          : `then ${money(renew)} every ${days} days`;
      }
      if (oncePrice) oncePrice.textContent = money(once);
      if (onceMeta) onceMeta.textContent = `${qty} ${bagWord} delivered at once`;
      if (planNote) {
        planNote.textContent =
          state.plan === 'sub'
            ? gated
              ? `Returning subscribers: ${money(renew)} every ${days} days. Reactivate in portal.`
              : `Renews at ${money(renew)} every ${days} days. Cancel anytime.`
            : 'One-time order. No subscription.';
      }
      if (kitPrice) kitPrice.textContent = money(displaySub);
      if (shaker) shaker.classList.toggle('is-locked', state.plan !== 'sub');
      if (cta) {
        cta.classList.toggle('is-added', state.added && !state.adding);
        cta.classList.toggle('is-loading', state.adding);
      }
      if (ctaLabel) {
        if (state.adding) ctaLabel.textContent = 'Adding...';
        else if (state.added) ctaLabel.textContent = 'Added to cart';
        else if (gated) ctaLabel.textContent = 'Reactivate subscription';
        else ctaLabel.textContent = state.plan === 'sub' ? cfg.ctaSub || 'Claim My 55% Off' : cfg.ctaOnce || 'Claim My 55% Off';
      }
    } else {
      if (subBanner) {
        const parts = [];
        if (badge) parts.push(badge);
        if (saveLabel) parts.push(saveLabel);
        subBanner.textContent = parts.join(' - ');
      }
      if (subMeta) subMeta.textContent = tier.meta || '';
      if (subPrice) subPrice.textContent = money(first);
      if (subRenew) subRenew.textContent = tier.renewNote || `then ${money(renew)}`;
      if (oncePrice) oncePrice.textContent = money(once);
      if (onceMeta) {
        onceMeta.textContent = tier.onceMeta || `${qty} bag${qty > 1 ? 's' : ''}, delivered once`;
      }
      if (onceSave) {
        onceSave.textContent = tier.onceSave || '';
        onceSave.hidden = !tier.onceSave;
      }

      if (kit) kit.classList.toggle('is-otp', state.plan === 'once');

      const ctaPrice = state.plan === 'sub' ? first : once;
      if (ctaLabel) {
        const prefix = cfg.ctaPrefix || 'Start Now';
        ctaLabel.textContent = `${prefix} - ${money(ctaPrice)}`;
      }
    }

    if (variantInput) variantInput.value = cfg.variantId || '';
    if (qtyInput) qtyInput.value = String(qty);
    if (planInput) {
      planInput.value =
        state.plan === 'sub' && tier.sellingPlanId ? String(tier.sellingPlanId) : '';
    }
  }

  bagBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      state.bagIndex = idx;
      state.added = false;
      render();
    });
  });

  planCards.forEach((card) => {
    card.addEventListener('click', () => {
      state.plan = card.getAttribute('data-zt-bb-plan') === 'once' ? 'once' : 'sub';
      state.added = false;
      render();
    });
  });

  thumbs.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setSlide(idx);
    });
  });

  bindSwipe(mainEl, (dir) => setSlide(state.slide + dir));

  /**
   * Spec §01: prefer real subscription bag total; fallback 76.99 / predicted_ltv 330.00.
   * Sum ALL matching bag lines (Shopify may split qty across lines, e.g. 2+1 → 219.99).
   * @param {{ qty: number, variantId: number, tier: Record<string, any>, cart?: any }} opts
   */
  function resolveSubscribeValue(opts) {
    const variantId = String(opts.variantId || '');
    const cart = opts.cart;
    if (cart && Array.isArray(cart.items)) {
      /** @param {any} li */
      const isBagLine = (li) =>
        String(li.variant_id || li.id) === variantId && !li.properties?._zt_bb_gift;
      const subBags = cart.items.filter(
        /** @param {any} li */ (li) =>
          isBagLine(li) &&
          (li.selling_plan_allocation || li.properties?._zt_bb_plan === 'subscription')
      );
      const bags = subBags.length ? subBags : cart.items.filter(isBagLine);
      let cents = 0;
      let hit = false;
      bags.forEach(/** @param {any} li */ (li) => {
        if (li.final_line_price != null) {
          cents += Number(li.final_line_price) || 0;
          hit = true;
        }
      });
      if (hit && cents > 0) return (cents / 100).toFixed(2);
    }
    const tier = opts.tier || {};
    const first = parseFloat(String(tier.firstPrice ?? ''));
    if (Number.isFinite(first) && first > 0) return first.toFixed(2);
    return '76.99';
  }

  /**
   * Spec §04–06: Subscribe fires from Shopify Custom Pixel on checkout_completed.
   * ATC does NOT fire Subscribe (would double-count vs thank-you with different eventIDs).
   * Jewel ASAP ATC fire retired once Spec §06 custom pixel is installed.
   */
  function trackMetaSubscribe(_opts) {
    /* no-op — checkout Custom Pixel owns Subscribe */
  }

  function introGateActive() {
    const gate = window.ZT_INTRO_GATE;
    return !!(gate && gate.active);
  }

  function blockIntroSubscribe(tier) {
    if (state.plan !== 'sub') return false;
    if (!introGateActive()) return false;
    const gate = window.ZT_INTRO_GATE;
    const planId = Number(tier?.sellingPlanId || 0);
    const blocked =
      (gate && typeof gate.isBlockedPlan === 'function' && gate.isBlockedPlan(planId)) ||
      !!planId;
    if (!blocked) return false;
    if (gate && typeof gate.showBanner === 'function') gate.showBanner(root);
    const resub = gate && gate.resubscribeUrl;
    const portal = (gate && gate.portalUrl) || '/a/subscriptions/login';
    const dest = resub || portal;
    setStatus(
      resub
        ? 'Intro pricing is for first-time subscribers. Opening regular-rate checkout…'
        : 'Intro pricing is for first-time subscribers. Opening customer portal to reactivate…'
    );
    window.location.href = withPageQuery(dest);
    return true;
  }

  async function addToCart() {
    const tier = currentTier();
    const variantId = Number(cfg.variantId || 0);
    if (!variantId) {
      setStatus('Select a product in the Theme Editor for this buy box.');
      return;
    }

    if (blockIntroSubscribe(tier)) return;

    const qty = parseInt(tier.qty, 10) || 1;
    /** @type {Record<string, any>} */
    const item = {
      id: variantId,
      quantity: qty,
      properties: {
        _zt_bb_source: 'cacao-lp',
        _zt_bb_plan: state.plan === 'sub' ? 'subscription' : 'one_time',
        _zt_bb_bags: String(qty),
      },
    };
    if (state.plan === 'sub' && tier.sellingPlanId) {
      item.selling_plan = Number(tier.sellingPlanId);
    }

    if (state.plan === 'sub' && !tier.sellingPlanId) {
      setStatus(
        'LP Seal plans not wired yet — add isolated selling plan IDs in Pricing tiers (do not use live Save $10 plans).'
      );
      return;
    }

    if (cta) {
      cta.disabled = true;
      cta.setAttribute('aria-busy', 'true');
    }
    setStatus('');
    state.adding = true;
    render();

    if ((cfg.afterAddAction || 'none') === 'drawer') {
      holdCartPageNavigation(8000);
      openCartDrawerImmediately();
    }

    const CartEvent = await loadCartEvents();
    /** @type {{ promise: Promise<any>; resolve: (v: any) => void; reject: (e: any) => void } | null} */
    let deferredEventPromise = null;
    if (CartEvent?.createPromise) {
      deferredEventPromise = CartEvent.createPromise();
      document.dispatchEvent(
        new CartEvent({
          action: 'add',
          context: 'product',
          lines: [
            {
              merchandiseId: String(variantId),
              quantity: qty,
            },
          ],
          promise: deferredEventPromise.promise,
        })
      );
    }

    try {
      const sectionIds = cartSectionIds();
      /** @type {{ id: number, quantity: number, properties: Record<string, string> }[]} */
      let giftItems = [];

      // Decide gifts before the bag add. Skip the extra cart read when the badge is empty.
      try {
        /** @type {{ id: number|string, key: string }[]} */
        const pendingGifts = [];
        const giftCfg = cfg.giftItems || {};
        const bulkGifts = Array.isArray(giftCfg.bulkBag) ? giftCfg.bulkBag : [];
        const subGifts = Array.isArray(giftCfg.subscribeOnly) ? giftCfg.subscribeOnly : [];

        if (cfg.addBulkBagGifts !== false) {
          bulkGifts.forEach((g) => {
            if (g?.id && String(g.id) !== String(variantId)) pendingGifts.push(g);
          });
        }
        if (state.plan === 'sub' && cfg.addShakerGift !== false) {
          subGifts.forEach((g) => {
            if (g?.id && String(g.id) !== String(variantId)) pendingGifts.push(g);
          });
          if (
            !subGifts.length &&
            cfg.shakerVariantId &&
            String(cfg.shakerVariantId) !== String(variantId)
          ) {
            pendingGifts.push({ id: cfg.shakerVariantId, key: 'cleanblend_shaker' });
          }
        }

        if (pendingGifts.length) {
          /** @type {Set<string>} */
          let existingIds = new Set();
          /** @type {Set<string>} */
          let existingGiftKeys = new Set();
          let cartHasShaker = false;
          const SHAKER_IDS = new Set(['67706369704149', '53710123892949']);
          const paintedCount = visibleCartCount();
          if (paintedCount === null || paintedCount > 0) {
            const existingCart = await fetchCart();
            existingIds = new Set(
              (existingCart.items || []).map(/** @param {any} line */ (line) => String(line.id))
            );
            existingGiftKeys = new Set(
              (existingCart.items || [])
                .map(/** @param {any} line */ (line) => line.properties?._zt_bb_gift)
                .filter(Boolean)
            );
            cartHasShaker = (existingCart.items || []).some(
              /** @param {any} line */ (line) =>
                SHAKER_IDS.has(String(line.variant_id || line.id)) ||
                line.properties?._zt_bb_gift === 'cleanblend_shaker' ||
                line.properties?._zeotein_free_subscription_shaker
            );
          }

          giftItems = pendingGifts
            .filter((g) => {
              if (existingIds.has(String(g.id)) || existingGiftKeys.has(String(g.key))) return false;
              // Never add a second shaker (legacy live variant or LP gift)
              if (
                cartHasShaker &&
                (g.key === 'cleanblend_shaker' || SHAKER_IDS.has(String(g.id)))
              ) {
                return false;
              }
              return true;
            })
            .map((g) => ({
              id: Number(g.id),
              quantity: 1,
              properties: { _zt_bb_gift: String(g.key) },
            }));
        }
      } catch (giftErr) {
        console.warn('[zt-bb] welcome kit gifts skipped', giftErr);
      }

      // Bag first so the subscription stays one line. Skip section HTML here when gifts follow.
      /** @type {Record<string, any>} */
      const payload = {
        items: [item],
        attributes: {
          'Cacao Landing Page': 'Yes',
          landing_page: 'cacao-lp',
          cacao_lp_locked: 'true',
        },
      };
      if (!giftItems.length && sectionIds.length) {
        payload.sections = sectionIds.join(',');
        payload.sections_url = window.location.pathname;
      }

      const res = await fetch(cartAddUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      let data = await res.json();
      if (!res.ok || (data && data.status && data.message)) {
        throw new Error((data && (data.description || data.message)) || 'Could not add to cart');
      }

      await markCacaoLandingPageOrder();

      if (giftItems.length) {
        /** @type {Record<string, any>} */
        const giftPayload = { items: giftItems };
        if (sectionIds.length) {
          giftPayload.sections = sectionIds.join(',');
          giftPayload.sections_url = window.location.pathname;
        }
        const giftRes = await fetch(cartAddUrl(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(giftPayload),
        });
        const giftData = await giftRes.json();
        if (!giftRes.ok || (giftData && giftData.status && giftData.message)) {
          console.warn('[zt-bb] welcome kit gifts skipped', giftData);
        } else if (giftData?.sections) {
          data = giftData;
        }
      }

      if (root.dataset.ztBbVersion === 'v2') setStatus('');
      else setStatus('Added to cart', true);
      state.added = true;

      const ajaxCart = await fetchCart();

      // Signal Meta to optimize for subscriptions (Spec §01: dynamic bag total).
      if (state.plan === 'sub') {
        trackMetaSubscribe({ qty, variantId, tier, cart: ajaxCart });
      }

      // Header badge first (LP header is not Dawn cart-icon-bubble).
      refreshCartUi(ajaxCart, data.sections);

      // Resolve cart event before opening so listeners see correct totals.
      // Omit sections — afterAdd refreshes the drawer once; a second morph closes it.
      if (deferredEventPromise && CartEvent?.createCartFromAjaxResponse) {
        deferredEventPromise.resolve({
          cart: CartEvent.createCartFromAjaxResponse(ajaxCart),
          detail: {
            items: ajaxCart.items,
            source: 'buy-box-cacao-lp',
            itemCount: ajaxCart.item_count ?? qty,
            sections: undefined,
            didError: false,
          },
        });
      }

      await afterAdd(cfg, data);
      if ((cfg.afterAddAction || 'none') === 'drawer') holdCartPageNavigation(2500);
    } catch (err) {
      if (deferredEventPromise) deferredEventPromise.reject(err);
      setStatus(err && err.message ? err.message : 'Could not add to cart');
      const dawnDrawer = /** @type {(HTMLElement & { close?: () => void; classList: DOMTokenList }) | null} */ (
        document.querySelector('cart-drawer')
      );
      if (dawnDrawer) dawnDrawer.classList.remove('zt-bb-adding', 'is-empty');
      if (dawnDrawer && typeof dawnDrawer.close === 'function') {
        dawnDrawer.close();
      }
    } finally {
      const stuck = document.querySelector('cart-drawer');
      if (stuck) stuck.classList.remove('zt-bb-adding');
      state.adding = false;
      if (cta) {
        cta.disabled = false;
        cta.removeAttribute('aria-busy');
      }
      render();
    }
  }

  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart();
    });
  }

  const nutritionBtn = root.querySelector('[data-zt-bb-nutrition-open]');
  const nutritionDialog = root.querySelector('[data-zt-bb-nutrition]');
  if (nutritionBtn && nutritionDialog instanceof HTMLDialogElement) {
    nutritionBtn.addEventListener('click', () => {
      if (!nutritionDialog.open) nutritionDialog.showModal();
    });
    nutritionDialog.querySelectorAll('[data-zt-bb-nutrition-close]').forEach((btn) => {
      btn.addEventListener('click', () => nutritionDialog.close());
    });
    nutritionDialog.addEventListener('click', (e) => {
      if (e.target === nutritionDialog) nutritionDialog.close();
    });
  }

  // FAQ: keep one item open at a time (native <details> still works without JS).
  root.querySelectorAll('[data-zt-bb-faq]').forEach((faq) => {
    faq.addEventListener('toggle', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLDetailsElement) || !target.open) return;
      faq.querySelectorAll('details.zt-bb__faq-item').forEach((item) => {
        if (item !== target) item.open = false;
      });
    }, true);
  });

  setSlide(0, { animate: false, scrollThumb: false });
  render();
}

/**
 * Dawn's drawer refresh also rewrites #cart-icon-bubble. This header does not
 * use that node, so a remove or quantity change threw and showed the cart error.
 * Skip sections that are not on the page. Other product templates do not load this file.
 */
function keepDawnCartUpdatesOnThisPage() {
  const Items = customElements.get('cart-drawer-items');
  if (!Items || Items.prototype.__ztSections) return;
  const original = Items.prototype.getSectionsToRender;
  if (typeof original !== 'function') return;
  Items.prototype.getSectionsToRender = function () {
    return original.call(this).filter((section) => section && section.id && document.getElementById(section.id));
  };
  Items.prototype.__ztSections = true;
}

/** Cart drawer / cart page checkout posts to /cart — keep page UTMs on the form action. */
function keepCheckoutUtms() {
  if (window.__ztCheckoutUtmBound) return;
  window.__ztCheckoutUtmBound = true;
  document.addEventListener(
    'click',
    (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const btn = t.closest('[name="checkout"], a[href*="/checkout"]');
      if (!btn) return;
      const form = btn.closest('form');
      if (form && form instanceof HTMLFormElement) {
        const action = form.getAttribute('action') || form.action || `${storeRoot()}cart`;
        form.setAttribute('action', withPageQuery(action));
      }
      if (btn instanceof HTMLAnchorElement && btn.href) {
        btn.href = withPageQuery(btn.href);
      }
    },
    true
  );
}

function boot() {
  keepDawnCartUpdatesOnThisPage();
  keepCheckoutUtms();
  customElements.whenDefined('cart-drawer-items').then(keepDawnCartUpdatesOnThisPage);
  document.querySelectorAll('[data-zt-bb]').forEach((el) => {
    if (el instanceof HTMLElement) init(el);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

document.addEventListener('shopify:section:load', (e) => {
  if (!e?.target || !(e.target instanceof Element)) return;
  const root = e.target.querySelector('[data-zt-bb]');
  if (root instanceof HTMLElement) {
    root.dataset.ztBbReady = '';
    init(root);
  }
});
