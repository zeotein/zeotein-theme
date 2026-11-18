# Never-bought win-back: free Vegan 7-Day, 5-day deadline

Live build page: https://claude.ai/artifact/9NWGjDEPGSya6D9oYvV3BC (source: `page/index.html`).

- `qa/screens/deadline-proof.png`: same cart, a per-person $44.99 code on the Vegan 7 Stick Packs. Accepted before its deadline, refused after (Shopify Admin draftOrderCalculate, 18 Nov 2026).
- `qa/screens/live-checkout-min-spend-blocks-code.png`: live checkout showing a minimum-spend version of the code does not apply, because Shopify counts only the gift product toward the minimum.
- `qa/code_check.js`: one-shot storefront cart check (the cloud workspace hits Shopify's bot check, so the Lenovo session runs the checkout screenshots).

Both TEST ONLY codes (TESTWBGIFT5D, TESTWBGIFTEXP) are expired.
