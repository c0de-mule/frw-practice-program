// Field Guide sign-up → ActiveCampaign.
// Our own styled form (on /receive-field-guide/) POSTs here; this runs server-side
// so the AC credentials never touch the browser. It syncs the contact and applies
// the "OPT IN Field Guide (Tapping)" tag. If the optional box was ticked AND a
// marketing tag is configured, it applies that too.
//
// Required Vercel environment variables (Settings → Environment Variables):
//   AC_API_URL   e.g. https://edenmethod.api-us1.com   (ActiveCampaign → Settings → Developer)
//   AC_API_KEY   the API key from that same page
// Optional:
//   AC_MARKETING_TAG   tag name applied only when someone ticks the follow-up checkbox
//
// Amber still builds the AC automation that emails the Guide when the tag lands.

const TAG = 'OPT IN Field Guide (Tapping)';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const base = (process.env.AC_API_URL || '').replace(/\/+$/, '');
  const key = process.env.AC_API_KEY;

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  const email = String(body.email || '').trim().toLowerCase();
  const firstName = String(body.first_name || '').trim();
  const optin = body.optin === true || body.optin === 'yes' || body.optin === 'on';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid_email' });
  }
  // Not wired to AC yet (env vars unset): report it, but let the page proceed so
  // the reader still gets the Guide. Flip this on by adding the two env vars.
  if (!base || !key) return res.status(503).json({ error: 'not_configured' });

  const headers = { 'Api-Token': key, 'Content-Type': 'application/json' };
  try {
    const cRes = await fetch(base + '/api/3/contact/sync', {
      method: 'POST', headers,
      body: JSON.stringify({ contact: { email, firstName } }),
    });
    const cData = await cRes.json().catch(() => ({}));
    const contactId = cData && cData.contact && cData.contact.id;
    if (!contactId) return res.status(502).json({ error: 'contact_sync_failed' });

    const tagId = await findOrCreateTag(base, headers, TAG);
    if (tagId) await applyTag(base, headers, contactId, tagId);

    const mkt = process.env.AC_MARKETING_TAG;
    if (optin && mkt) {
      const mId = await findOrCreateTag(base, headers, mkt);
      if (mId) await applyTag(base, headers, contactId, mId);
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'activecampaign_error' });
  }
};

async function findOrCreateTag(base, headers, name) {
  const s = await fetch(base + '/api/3/tags?limit=100&search=' + encodeURIComponent(name), { headers });
  const sd = await s.json().catch(() => ({}));
  const hit = (sd.tags || []).find((t) => t.tag === name);
  if (hit) return hit.id;
  const c = await fetch(base + '/api/3/tags', {
    method: 'POST', headers,
    body: JSON.stringify({ tag: { tag: name, tagType: 'contact', description: '' } }),
  });
  const cd = await c.json().catch(() => ({}));
  return cd && cd.tag && cd.tag.id;
}

function applyTag(base, headers, contactId, tagId) {
  return fetch(base + '/api/3/contactTags', {
    method: 'POST', headers,
    body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
  });
}
