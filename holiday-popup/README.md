# Holiday Recipe Guide pop-up + one-step landing form

**Scope (Dana, Nov 11):** the pop-up goes on the **new GHL holiday guide landing page only**. The draft funnel is "[DRAFT] Holiday Guide — Christmassy revamp", step "Holiday Guide opt-in landing page". Homepage and store placement is a later decision. Nothing is live.

Preview page with live demo, landing-page screenshots and open items: https://claude.ai/artifact/V9HGzW78ttmmoHZAduxiAH (private until shared).

## What's here
| Path | What |
|---|---|
| `src/` | Single source: `form.*` (shared one-step form + submit logic), `popup.*` (festive pop-up), `landing-form.html` |
| `build.py` | Builds everything below. Set `ENDPOINT` (and optionally `NEXT_URL`) and rerun. |
| `dist/ghl-popup.html` | **Paste into the GHL landing page** as a Custom Code element (or the step's Footer Tracking Code). |
| `dist/ghl-landing-form.html` | **Paste into the GHL landing page** as a Custom Code element in place of the native form. |
| `snippet/zt-holiday-popup.liquid` | Shopify build, parked and not rendered anywhere. |
| `worker/worker.js` | Cloudflare Worker relay. It keeps the GHL key off the page. |
| `qa/popup_check.js` | 40 behavior checks against a local mock: `python3 build.py && node qa/popup_check.js` |
| `qa/lp_context.js` | Injects both blocks into the real gift.zeotein.com landing page (mock relay) and screenshots it. |

The cover image is hosted on Shopify Files: `zt-holiday-guide-cover-v3-hd.webp`.

## Behavior
- **One step:** first name, email, an optional US mobile number, and an SMS consent checkbox that is **unchecked by default**. A phone number is only sent when the box is checked, and the relay enforces this again.
- **Meta Pixel:** `fbq('track','Lead')` fires once, only after the relay confirms. The GHL funnel already loads Pixel 2030642037869344 in its head code.
- **Pop-up triggers:** exit intent only on desktop, armed after 8 seconds. 35 seconds on the page on mobile. It never shows after a signup through either form. "Maybe later" hides it for 7 days. It shows at most once per session and is suppressed for visitors arriving from our own emails or texts.
- **Relay (GHL writes):**
  - Upsert the contact (never sending `tags`, because upsert overwrites all tags).
  - Add `holiday-guide` plus `acq-holiday-popup` or `acq-holiday-lp`.
  - With consent, also save the phone, set SMS DND to inactive, add `sms-opted-in` and `holiday-popup-sms`, and write these custom fields:
    - SMS Consent Timestamp `dHt8bKGRJDMonW9RxmIK`
    - Source `moRFFbcOuZUE4Fryigb5`
    - Text `ROBEY26uJci7GEUJ23GQ`
    - Page URL `8kiKSYbmUCWy1ClyClqO`

## Go-live steps
1. Fix the guide email trigger (see the open issue below).
2. Deploy `worker/worker.js` with these settings:
   - `GHL_TOKEN`: a Private Integration token with contacts read/write.
   - `GHL_LOCATION_ID=Kch9YmRfzpmQrAs5Bchz`
   - `ALLOWED_ORIGINS=https://gift.zeotein.com`
   - `CF_SMS_TS`, `CF_SMS_SOURCE`, `CF_SMS_TEXT`, `CF_SMS_PAGE`: the four field ids above.
3. Set `ENDPOINT` in `build.py`, plus `NEXT_URL` to the funnel's thank-you step if wanted, and run `python3 build.py`.
4. In the GHL draft funnel page:
   - Replace the native form with `dist/ghl-landing-form.html`.
   - Add `dist/ghl-popup.html`.
   - Save, preview, and submit one test.
   - Publish only with Dana's OK.

## Open issue: the guide email didn't fire
The test contacts `zeotein+hgpopup1111@gmail.com` and `zeotein+hgpopup1111b@gmail.com` got `holiday-guide`, and no guide email was sent. The workflow API isn't enabled for this location, so the trigger has to be checked in the GHL UI. It needs to be **Contact Tag added = holiday-guide**, with re-entry allowed and the workflow published.
