const AUTH = process.env.HED3505_NEON_AUTH_URL;
const API = process.env.HED3505_NEON_DATA_API_URL;
const ORIGIN = process.env.HED3505_STAGING_ORIGIN || 'https://staging.kengkasem.com';

const requiredNames = [
  'HED3505_NEON_AUTH_URL','HED3505_NEON_DATA_API_URL',
  'HED3505_STUDENT_A_EMAIL','HED3505_STUDENT_A_OTP',
  'HED3505_STUDENT_B_EMAIL','HED3505_STUDENT_B_OTP',
  'HED3505_TEACHER_EMAIL','HED3505_TEACHER_OTP'
];
const missing = requiredNames.filter(k => !process.env[k]);
if (missing.length) {
  console.error('SKIP: genuine ephemeral authenticated sessions are unavailable. Missing runtime inputs: ' + missing.join(', '));
  process.exit(2);
}
if (![AUTH, API, ORIGIN].every(v => typeof v === 'string' && v.startsWith('https://'))) {
  throw new Error('Refusing runtime matrix: HTTPS endpoint/origin configuration is required.');
}

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = null; }
  return { status: response.status, ok: response.ok, body, headers: response.headers };
}
function cookies(headers) {
  const raw = typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : [headers.get('set-cookie')].filter(Boolean);
  return raw.map(v => v.split(';', 1)[0]).join('; ');
}
function assert(condition, message) { if (!condition) throw new Error(message); }
function eq(value) { return encodeURIComponent(`eq.${value}`); }
async function signIn(email, otp) {
  const login = await jsonFetch(`${AUTH}/sign-in/email-otp`, {
    method: 'POST', headers: { 'content-type': 'application/json', origin: ORIGIN },
    body: JSON.stringify({ email, otp, callbackURL: `${ORIGIN}/hed3505-final-learning-studio/` })
  });
  assert(login.ok, `Genuine OTP sign-in failed: HTTP ${login.status}`);
  const cookie = cookies(login.headers);
  assert(cookie, 'Genuine OTP sign-in returned no session cookie');
  const session = await jsonFetch(`${AUTH}/get-session`, { headers: { origin: ORIGIN, cookie } });
  assert(session.ok && session.body?.user, 'Authenticated session was not accepted');
  const tokenResponse = await jsonFetch(`${AUTH}/token`, { headers: { origin: ORIGIN, cookie } });
  assert(tokenResponse.ok, `JWT exchange failed: HTTP ${tokenResponse.status}`);
  const token = tokenResponse.body?.token || tokenResponse.body?.access_token;
  assert(token, 'Authenticated token endpoint returned no token');
  return token;
}
async function api(path, token, options = {}) {
  const headers = {
    ...(options.headers || {}), authorization: `Bearer ${token}`,
    'accept-profile': 'hed3505', 'content-profile': 'hed3505', 'content-type': 'application/json'
  };
  return jsonFetch(`${API}/${path}`, { ...options, headers });
}

const anon = await jsonFetch(`${API}/learner_identity?select=learner_id&limit=1`, { headers: { 'accept-profile': 'hed3505' } });
assert([400,401,403].includes(anon.status), 'AUTH-01: anonymous evidence access was not denied');

const [studentA, studentB, teacher] = await Promise.all([
  signIn(process.env.HED3505_STUDENT_A_EMAIL, process.env.HED3505_STUDENT_A_OTP),
  signIn(process.env.HED3505_STUDENT_B_EMAIL, process.env.HED3505_STUDENT_B_OTP),
  signIn(process.env.HED3505_TEACHER_EMAIL, process.env.HED3505_TEACHER_OTP)
]);

const aOwn = await api('learner_identity?select=learner_id,auth_user_id', studentA);
const bOwn = await api('learner_identity?select=learner_id,auth_user_id', studentB);
assert(aOwn.ok && Array.isArray(aOwn.body) && aOwn.body.length === 1, 'RLS-01: Student A must resolve exactly one own learner identity');
assert(bOwn.ok && Array.isArray(bOwn.body) && bOwn.body.length === 1, 'RLS-03: Student B must resolve exactly one own learner identity');
assert(aOwn.body[0].auth_user_id !== bOwn.body[0].auth_user_id, 'AUTH-04: Student A/B principals must be distinct');

const aLearnerId = aOwn.body[0].learner_id;
const bLearnerId = bOwn.body[0].learner_id;
const [aAttempts, bAttempts, aTargetsBIdentity, bTargetsAIdentity, aTargetsBAttempts, bTargetsAAttempts] = await Promise.all([
  api('activity_attempt?select=attempt_id,learner_id', studentA),
  api('activity_attempt?select=attempt_id,learner_id', studentB),
  api(`learner_identity?select=learner_id&learner_id=${eq(bLearnerId)}`, studentA),
  api(`learner_identity?select=learner_id&learner_id=${eq(aLearnerId)}`, studentB),
  api(`activity_attempt?select=attempt_id,learner_id&learner_id=${eq(bLearnerId)}`, studentA),
  api(`activity_attempt?select=attempt_id,learner_id&learner_id=${eq(aLearnerId)}`, studentB)
]);
assert(aAttempts.ok && Array.isArray(aAttempts.body), 'RLS-01: Student A own activity read failed');
assert(bAttempts.ok && Array.isArray(bAttempts.body), 'RLS-03: Student B own activity read failed');
assert(aAttempts.body.every(x => x.learner_id === aLearnerId), 'RLS-02: Student A can see another learner attempt');
assert(bAttempts.body.every(x => x.learner_id === bLearnerId), 'RLS-04: Student B can see another learner attempt');
assert(aTargetsBIdentity.ok && Array.isArray(aTargetsBIdentity.body) && aTargetsBIdentity.body.length === 0, 'RLS-02: Student A can target-read Student B identity');
assert(bTargetsAIdentity.ok && Array.isArray(bTargetsAIdentity.body) && bTargetsAIdentity.body.length === 0, 'RLS-04: Student B can target-read Student A identity');
assert(aTargetsBAttempts.ok && Array.isArray(aTargetsBAttempts.body) && aTargetsBAttempts.body.length === 0, 'RLS-02: Student A can target-read Student B attempts');
assert(bTargetsAAttempts.ok && Array.isArray(bTargetsAAttempts.body) && bTargetsAAttempts.body.length === 0, 'RLS-04: Student B can target-read Student A attempts');

const validObjectId = aAttempts.body[0]?.attempt_id;
assert(validObjectId, 'RLS-05 precondition: Student A requires at least one own synthetic activity_attempt so teacher-write denial is not vacuous');
const deniedAssessment = await api('assessment', studentA, {
  method: 'POST', headers: { Prefer: 'return=minimal' },
  body: JSON.stringify({
    object_type: 'activity_attempt', object_id: validObjectId,
    assessor_user_id: aOwn.body[0].auth_user_id, rubric_version: 'synthetic-deny-test',
    rubric_payload: { synthetic: true }, assessment_status: 'draft'
  })
});
assert(!deniedAssessment.ok, 'RLS-05: student teacher-only assessment write was not denied');

const staff = await api('course_staff?select=auth_user_id,staff_role,active', teacher);
assert(staff.ok && Array.isArray(staff.body) && staff.body.length === 1 && staff.body[0].active === true, 'TEACHER-01: teacher must resolve exactly one active course_staff row');
assert(['teacher','assessor','admin'].includes(staff.body[0].staff_role), 'TEACHER-01: unsupported teacher role');

const audit = await api('audit_event?select=event_id&limit=1', studentA);
assert([401,403].includes(audit.status) || (audit.ok && Array.isArray(audit.body) && audit.body.length === 0), 'AUDIT-02: student can see protected audit events');

console.log(JSON.stringify({
  AUTH_01_anonymous_deny: 'PASS', AUTH_02_student_A_session: 'PASS', AUTH_03_student_B_session: 'PASS', AUTH_04_distinct_principals: 'PASS',
  RLS_01_student_A_scope: 'PASS', RLS_02_A_cannot_read_B: 'PASS', RLS_03_student_B_scope: 'PASS', RLS_04_B_cannot_read_A: 'PASS', RLS_05_teacher_write_denied_to_student: 'PASS',
  TEACHER_01_staff_binding: 'PASS', AUDIT_02_student_audit_isolation: 'PASS'
}));
