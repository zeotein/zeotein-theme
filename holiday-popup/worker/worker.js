// Zeotein holiday pop-up -> GoHighLevel relay (Cloudflare Worker).
// Keeps the GHL Private Integration token server-side.
//
// Env vars (wrangler secret / dashboard):
//   GHL_TOKEN        Private Integration token, scopes: contacts.write, contacts.readonly
//   GHL_LOCATION_ID  Kch9YmRfzpmQrAs5Bchz
//   ALLOWED_ORIGINS  comma list: https://gift.zeotein.com (landing page) plus https://zeotein.com,https://www.zeotein.com if the store pop-up is ever turned on
//   CF_SMS_TS, CF_SMS_SOURCE, CF_SMS_TEXT, CF_SMS_PAGE   GHL custom field ids (see README)

const GHL = 'https://services.leadconnectorhq.com';
// holiday-guide fires the guide email workflow; the acq-* tag records which form the lead came from.
const SOURCES = { 'holiday-popup': 'acq-holiday-popup', 'holiday-guide-lp': 'acq-holiday-lp', 'holiday-popup-store': 'acq-holiday-popup' };
const EMAIL_TAGS = ['holiday-guide'];
const SMS_TAGS = ['sms-opted-in', 'holiday-popup-sms'];

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const okOrigin = allowed.includes(origin) || /^https:\/\/[a-z0-9-]+\.shopifypreview\.com$/.test(origin);
    const cors = {
      'Access-Control-Allow-Origin': okOrigin ? origin : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
    if (!okOrigin) return json({ ok: false, error: 'origin' }, 403);

    let b;
    try { b = await req.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
    if (b.company) return json({ ok: true }); // honeypot: pretend success for bots

    try {
      const out = await handle(b, env);
      return json({ ok: true, ...out });
    } catch (e) {
      return json({ ok: false, error: e.message || 'error' }, e.status || 500);
    }
  },
};

export async function handle(b, env, fetchImpl = fetch) {
  const email = String(b.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) throw httpErr('email', 400);
  const firstName = String(b.firstName || '').trim().slice(0, 60);
  const now = new Date().toISOString();

  if (!firstName) throw httpErr('first_name', 400);
  const source = SOURCES[b.source] ? b.source : 'holiday-popup';
  const emailTags = [...EMAIL_TAGS, SOURCES[source]];
  const wantsSms = b.smsConsent === true && b.phone != null;
  if (wantsSms && !/^\+1\d{10}$/.test(String(b.phone))) throw httpErr('phone', 400);

  // One request from the pop-up: email lead always; phone + SMS consent only when the box was checked.
  const body = wantsSms
    ? { ...buildEmailUpsert({ email, firstName, source }, env), ...buildSmsUpsert({ email, phone: String(b.phone), consentText: b.consentText, pageUrl: b.pageUrl, now, source }, env) }
    : buildEmailUpsert({ email, firstName, source }, env);
  const c = await ghl('/contacts/upsert', body, env, fetchImpl);
  await addTags(c.id, wantsSms ? [...emailTags, ...SMS_TAGS] : emailTags, env, fetchImpl);
  return { contactId: c.id, sms: wantsSms };
}

export function buildEmailUpsert({ email, firstName, source }, env) {
  // pageUrl is not written on the email step so existing attribution fields are never overwritten.
  // NOTE: never send `tags` on upsert: GHL overwrites ALL existing tags. Tags are added separately.
  return { locationId: env.GHL_LOCATION_ID, email, firstName, source };
}

export function buildSmsUpsert({ email, phone, consentText, pageUrl, now, source }, env) {
  return {
    locationId: env.GHL_LOCATION_ID, email, phone,
    dndSettings: { sms: { status: 'inactive', message: 'SMS opt-in via ' + source + ' ' + now } },
    customFields: cf(env, {
      CF_SMS_TS: now,
      CF_SMS_SOURCE: source,
      CF_SMS_TEXT: String(consentText || '').slice(0, 1000),
      CF_SMS_PAGE: String(pageUrl || '').slice(0, 500),
    }),
  };
}

function cf(env, map) {
  return Object.entries(map).filter(([k, v]) => env[k] && v !== undefined).map(([k, v]) => ({ id: env[k], fieldValue: v }));
}

async function addTags(id, tags, env, fetchImpl) {
  await ghl(`/contacts/${id}/tags`, { tags }, env, fetchImpl);
}

async function ghl(path, body, env, fetchImpl) {
  const r = await fetchImpl(GHL + path, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.GHL_TOKEN, Version: '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw httpErr('ghl_' + r.status, 502);
  return j.contact || j;
}

function httpErr(msg, status) { const e = new Error(msg); e.status = status; return e; }
