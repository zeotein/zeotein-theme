// Zeotein holiday pop-up -> GoHighLevel relay (Cloudflare Worker).
// Keeps the GHL Private Integration token server-side.
//
// Env vars (wrangler secret / dashboard):
//   GHL_TOKEN        Private Integration token, scopes: contacts.write, contacts.readonly
//   GHL_LOCATION_ID  Kch9YmRfzpmQrAs5Bchz
//   ALLOWED_ORIGINS  comma list, e.g. https://zeotein.com,https://www.zeotein.com,https://zeotein-llc.myshopify.com
//   CF_SMS_TS, CF_SMS_SOURCE, CF_SMS_TEXT, CF_SMS_PAGE   GHL custom field ids (see README)

const GHL = 'https://services.leadconnectorhq.com';
const EMAIL_TAGS = ['holiday-guide', 'acq-holiday-popup'];        // holiday-guide fires the guide email workflow
const SMS_TAGS = ['sms-opted-in', 'holiday-popup-sms'];
const SOURCE = 'holiday-popup';

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

  if (b.step === 'email') {
    if (!firstName) throw httpErr('first_name', 400);
    const body = buildEmailUpsert({ email, firstName, pageUrl: b.pageUrl }, env);
    const c = await ghl('/contacts/upsert', body, env, fetchImpl);
    await addTags(c.id, EMAIL_TAGS, env, fetchImpl); // explicit add so the tag-added trigger fires even on existing contacts
    return { contactId: c.id };
  }

  if (b.step === 'sms') {
    const phone = String(b.phone || '');
    if (!/^\+1\d{10}$/.test(phone)) throw httpErr('phone', 400);
    const body = buildSmsUpsert({ email, firstName, phone, consentText: b.consentText, pageUrl: b.pageUrl, now }, env);
    const c = await ghl('/contacts/upsert', body, env, fetchImpl);
    await addTags(c.id, SMS_TAGS, env, fetchImpl);
    return { contactId: c.id };
  }
  throw httpErr('step', 400);
}

export function buildEmailUpsert({ email, firstName, pageUrl }, env) {
  // pageUrl is not written on the email step so existing attribution fields are never overwritten.
  // NOTE: never send `tags` on upsert: GHL overwrites ALL existing tags. Tags are added separately.
  return { locationId: env.GHL_LOCATION_ID, email, firstName, source: SOURCE };
}

export function buildSmsUpsert({ email, firstName, phone, consentText, pageUrl, now }, env) {
  return {
    locationId: env.GHL_LOCATION_ID, email, phone,
    dndSettings: { sms: { status: 'inactive', message: 'SMS opt-in via holiday-popup ' + now } },
    customFields: cf(env, {
      CF_SMS_TS: now,
      CF_SMS_SOURCE: SOURCE,
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
