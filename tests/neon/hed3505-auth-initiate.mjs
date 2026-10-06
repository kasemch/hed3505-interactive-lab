const AUTH = process.env.HED3505_NEON_AUTH_URL;
const ORIGIN = process.env.HED3505_STAGING_ORIGIN || 'https://staging.kengkasem.com';
const EMAIL = process.env.HED3505_AUTH_TEST_EMAIL;

if (!AUTH) throw new Error('Missing HED3505_NEON_AUTH_URL');
if (!EMAIL) throw new Error('Missing HED3505_AUTH_TEST_EMAIL');
if (!AUTH.startsWith('https://')) throw new Error('Auth endpoint must use HTTPS');

async function request(path, body) {
  const response = await fetch(`${AUTH}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: ORIGIN,
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  });
  const text = await response.text();
  let parsed = null;
  try { parsed = text ? JSON.parse(text) : null; } catch {}
  return { status: response.status, ok: response.ok, body: parsed };
}

// This harness intentionally initiates the supported email-OTP sign-in flow.
// It never reads verification storage, never prints an OTP, and never fabricates a session.
const result = await request('/email-otp/send-verification-otp', {
  email: EMAIL,
  type: 'sign-in',
});

if (!result.ok) {
  const safeCode = result.body?.code || result.body?.error || 'unknown';
  throw new Error(`Neon Auth OTP initiation failed: HTTP ${result.status}; code=${safeCode}`);
}

console.log(JSON.stringify({
  authInitiation: 'PASS',
  deliveryRequested: true,
  otpExposed: false,
  sessionFabricated: false,
}));
