# Holiday Recipe Guide pop-up

v3 design (Dana approved Nov 11, 2026). It's built on a Shopify draft theme and isn't live.

| Piece | Where |
|---|---|
| Pop-up (HTML/CSS/JS, Liquid) | `snippet/zt-holiday-popup.liquid` → `snippets/zt-holiday-popup.liquid` on the draft theme |
| Footer-group section that renders it | `sections/zt-holiday-popup.liquid` + entry in `sections/footer-group.json` (draft theme only) |
| Cover image | `assets/zt-holiday-guide-cover.webp` |
| GHL relay (keeps the API key off the browser) | `worker/worker.js` (Cloudflare Worker) |
| QA | `qa/popup_check.js` (20 behavior checks), `qa/live_check.js`, `qa/screens/` |

Draft theme: **Holiday Popup DRAFT (Nov 11) - do not publish** (id 187982840021), a copy of the live "Cacao LP updates 2026-11-05".
Preview: https://zeotein.com/?preview_theme_id=187982840021&zt_popup=1 (`zt_popup=1` opens it right away and skips the triggers).

## Behavior
- **Desktop:** centered modal. It opens on **exit intent only**, and only after 8s on the page, so it can't fire early.
- **Mobile:** bottom sheet. It opens after **25s on the page AND 40% scroll depth**, or on a fast scroll back up after reading 40%.
- **Suppression:** it never shows again after a submit. "Maybe later" or close hides it for 7 days. It shows at most once per session. It's skipped for logged-in customers who accept marketing and for visitors arriving from our own email or SMS (`utm_source`/`utm_medium` containing email, sms, ghl, klaviyo). It's also skipped on cart, account, subscription portal and checkout pages.
- **Step 1:** first name + email. The relay upserts the contact (source `holiday-popup`) and **adds** the tags `holiday-guide` and `acq-holiday-popup`.
- **Step 2 (optional):** a US mobile number plus the exact TCPA line from the mockup. The relay sets the phone, sets SMS DND to inactive, and adds the tags `sms-opted-in` and `holiday-popup-sms`. It also writes these custom fields:
  - SMS Consent Timestamp (`dHt8bKGRJDMonW9RxmIK`)
  - SMS Consent Source = holiday-popup (`moRFFbcOuZUE4Fryigb5`)
  - SMS Consent Text (`ROBEY26uJci7GEUJ23GQ`)
  - SMS Consent Page URL (`8kiKSYbmUCWy1ClyClqO`)
- **Skipping step 2** keeps the email lead.
- **Tags are never sent on upsert.** GHL's upsert replaces all of a contact's tags, so tags are added in a separate call.

## Go-live steps
1. Deploy `worker/worker.js` to Cloudflare Workers with these settings:
   - `GHL_TOKEN`: a GHL Private Integration token with the contacts read/write scopes.
   - `GHL_LOCATION_ID=Kch9YmRfzpmQrAs5Bchz`
   - `ALLOWED_ORIGINS=https://zeotein.com,https://www.zeotein.com`
   - `CF_SMS_TS`, `CF_SMS_SOURCE`, `CF_SMS_TEXT`, `CF_SMS_PAGE`: the four custom field ids listed above.
2. Paste the Worker URL into `zt_hp_endpoint` in the snippet. Until then the form shows "Something went wrong" and sends nothing.
3. Fix the guide-email trigger (see the open issue below).
4. Turn it on. Either copy the snippet, the section and the footer-group entry into the live theme, or publish this draft. Don't publish the draft if the live theme has changed since Nov 11.

## Open issue: the guide email didn't fire
The test contacts `zeotein+hgpopup1111@gmail.com` (tag added after the contact was created) and `zeotein+hgpopup1111b@gmail.com` (created with the tag) both got the `holiday-guide` tag, and neither received the guide email. The Nov 10 QA contact did. The workflow API isn't enabled for this location, so its trigger has to be checked in the GHL UI. The workflow needs a trigger of **Contact Tag added = holiday-guide**, with re-entry allowed and the workflow published.
