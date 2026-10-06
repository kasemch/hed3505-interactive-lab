// HED3505 synthetic fixture contract — no credentials, no production access.
const API = process.env.HED3505_NEON_DATA_API_URL;
if (!API) throw new Error('Missing HED3505_NEON_DATA_API_URL');

async function request(path, options={}) {
  const r = await fetch(`${API}/${path}`, options);
  const text = await r.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = null; }
  return { status:r.status, ok:r.ok, body };
}
function assert(condition, message) { if (!condition) throw new Error(message); }

// Contract 1: anonymous access must fail closed.
const anon = await request('learner_identity?select=learner_id&limit=1', {
  headers: { 'accept-profile':'hed3505' }
});
const recognizedDeny = anon.status === 401 || anon.status === 403 ||
  (anon.status === 400 && /missing authentication credentials/i.test(String(anon.body?.message || '')));
assert(recognizedDeny, `AUTH-01 failed closed contract: HTTP ${anon.status}`);

// Contract 2: fixture SQL must never be used as an Auth/session bypass.
// Authenticated fixture writes are intentionally delegated to hed3505-auth-rbac.mjs
// after a supported Better Auth session has been established.

console.log(JSON.stringify({
  fixtureContract:'PASS',
  AUTH_01:'PASS',
  authBoundary:'SUPPORTED_SESSION_REQUIRED',
  credentialMaterialLogged:false
}));
