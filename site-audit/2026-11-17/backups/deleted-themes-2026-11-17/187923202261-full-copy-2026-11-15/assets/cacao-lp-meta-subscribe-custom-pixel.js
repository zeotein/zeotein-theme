/**
 * PASTE INTO: Shopify Admin → Settings → Customer events → Add custom pixel
 * Name: Meta Subscribe
 * Permissions: Marketing + Analytics
 *
 * Dana Meta Subscribe Event Spec §06 (Oct 22 2026).
 * Do NOT also fire Purchase here — Facebook & Instagram app already sends it.
 *
 * Copy everything between --- begin paste --- and --- end paste --- only.
 */
// --- begin paste ---
// Shopify → Settings → Customer events → Add custom pixel
// Name: Meta Subscribe   ·   Permissions: Marketing + Analytics

// 1 — load the Meta pixel inside the sandbox
!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = '2.0';
  n.queue = [];
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '2030642037869344'); // Spec §06 — verified Oct 22 2026

// 2 — fire Subscribe only on subscription orders
analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data.checkout;
  const items = checkout.lineItems || [];

  // Spec §05 step 2: confirm selling-plan key from a logged payload if this misses.
  // Covers Spec keys + common Shopify Web Pixel snake_case variants.
  const isSubscription = items.some(
    (li) =>
      li.sellingPlanAllocation ||
      li.sellingPlan ||
      li.selling_plan_allocation ||
      li.selling_plan
  );

  if (!isSubscription) return; // one-time orders keep Purchase only

  // Spec §02: order total minus tax & shipping → prefer subtotal.
  // No hardcoded 76.99 fallback — if price is missing, skip (do not invent bulk-bag value).
  const raw =
    checkout.subtotalPrice?.amount ??
    checkout.totalPrice?.amount;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return;

  // Howie 15% stick pack SKU bills the same every month — no intro discount
  const FLAT_SKUS = ['ZEO-CAC-STICK-30-SUB-GO'];
  const isFlat = items.some((li) => FLAT_SKUS.includes(li.variant?.sku));

  fbq(
    'track',
    'Subscribe',
    {
      value: value, // real charge, number not string
      currency: checkout.currencyCode || 'USD',
      predicted_ltv: +(value * (isFlat ? 3.55 : 4.3)).toFixed(2),
    },
    {
      eventID: checkout.order?.id || checkout.token, // dedupe key
    }
  );
});
// --- end paste ---
