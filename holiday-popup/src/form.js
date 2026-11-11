/* Shared one-step signup logic for the pop-up and the landing page form.
   window.ZT_HG = { endpoint, source } must be set before this runs.
   onSuccess(form, info) is called after the relay confirms; Meta Lead fires exactly once per success. */
window.ztHgBind = function (form, onSuccess) {
  var cfg = window.ZT_HG || {};
  function err(msg) { form.querySelector('.zt-hg-err').textContent = msg || ''; }
  function post(payload) {
    if (!cfg.endpoint) return Promise.reject(new Error('not_configured'));
    return fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || !j.ok) throw new Error(j.error || 'failed'); return j; }); });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault(); err();
    var fn = form.firstName.value.trim(), em = form.email.value.trim();
    var raw = form.phone.value.trim(), consent = form.smsConsent.checked;
    var digits = raw.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
    if (!fn) return err('Please add your first name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) return err('Please enter a valid email.');
    if (raw && digits.length !== 10) return err('Please enter a 10-digit US mobile number, or leave it blank.');
    if (consent && !raw) return err('Add your mobile number to get texts, or uncheck the box.');
    var source = form.getAttribute('data-source') || cfg.source;
    var payload = { firstName: fn, email: em, company: form.company.value, source: source, pageUrl: location.href };
    // Phone is only sent with explicit consent (box is unchecked by default).
    if (raw && consent) { payload.phone = '+1' + digits; payload.smsConsent = true; payload.consentText = form.querySelector('[data-zt-consent]').innerText.trim(); }
    var btn = form.querySelector('.zt-hg-btn'); btn.disabled = true;
    post(payload).then(function () {
      try { if (typeof window.fbq === 'function') fbq('track', 'Lead', { content_name: 'Holiday Recipe Guide', content_category: source }); } catch (x) {}
      try { (window.dataLayer = window.dataLayer || []).push({ event: 'zt_holiday_guide_lead', source: source, sms: !!payload.smsConsent }); } catch (x) {}
      onSuccess && onSuccess(form, { email: em, sms: !!payload.smsConsent });
    }).catch(function () { err('Something went wrong. Please try again.'); })
      .then(function () { btn.disabled = false; });
  });
};
