# Live check after install (step 9): shop.zeotein.com, 12 Nov 2026

Run against https://shop.zeotein.com after Zeus installed all 17 blocks from INSTALL-PACKET.md. Read-only:
nothing in GoHighLevel, Google Ads, zeotein.com or robots.txt was changed, and no order was placed. The test
browser blocked analytics and ad tags, so these runs do not show up as visits.

| Check | Result | Evidence |
|---|---|---|
| Live pages = the built 12 Nov blocks (build stamp, CSS, script, embedded catalog) | **PASS**, 17 of 17 | parity run in this session |
| Cart and buttons: `node qa/e2e_cart.js https://shop.zeotein.com` | **PASS**, 306 of 306, no JavaScript errors | `e2e/e2e-results.json` |
| Links and images: `python3 qa/link_check.py --live https://shop.zeotein.com` | **PASS**, 0 problems: 367 internal links and anchors (each target page answers 200 live), 3 external, 31 images, 38 email links | `link-check-live.json` |
| Noindex: `python3 qa/verify_noindex.py` | **PASS** for the shop: all 18 URLs (`/` plus 17 pages) serve `noindex, follow`; zeotein.com indexable; robots.txt empty, so no Googlebot or AdsBot block | `noindex.txt` |
| Compliance: `python3 qa/compliance_check.py <prescan> --live https://shop.zeotein.com` | **PASS**, 0 blocking. Flags match the build: High = the "guarantee" money-back wording; 1 Medium = "promotional items" in the refund policy. Live SEO title and description match the packet on 17 of 17 | `compliance-live.json`, `compliance-live.txt` |
| Rendered audit, desktop + iPhone: `node qa/live_audit.js` | **PASS**, 34 of 34 page views. One Zeotein block per page with no leftover content; no sideways scroll, broken images or JavaScript errors; email links decode. Holds: no "zeolite" in the rendered page or its HTML, no $89.99, free shipping still "over $150", no retired offer copy | `audit/live-audit.json`, `audit/live-*.png` |

Notes:
- **Email links.** shop.zeotein.com is behind Cloudflare email obfuscation. `mailto:hello@zeotein.com` links are served
  as `/cdn-cgi/l/email-protection#…` and decoded by Cloudflare's script in the browser. The link check decodes them the
  same way, and the rendered audit confirms they become working mailto links. This is a hosting feature, not a defect.
- **Hidden page-title text.** The only text outside the block is GoHighLevel's screen-reader route announcer, a 1×1 px
  clipped element that reads the page title aloud. It is invisible to sighted visitors.
- **Live checkouts.** Zeus ran packet checks 5 to 8 by hand in incognito: subtotals $136.98, $155.98 and $184.98; no
  $89.99; back-and-forth kept quantity 1; cart attributes carried gclid, utm_source, utm_medium, utm_campaign,
  landing_page and source_site. That closes the two flows Shopify's bot check had blocked for the cloud machine.
- **Funnel noindex (not this site).** marketing.zeotein.com /starter-kit-google, /starter-kit-page and /starter-kit
  are still noindexed only by script, and /cacao-stick-packs-starter-kit has no robots tag; it is not used by any
  Google ad. Unchanged and outside this workstream.
