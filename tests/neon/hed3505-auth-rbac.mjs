const AUTH = required('HED3505_NEON_AUTH_URL');
const API = required('HED3505_NEON_DATA_API_URL');
const ORIGIN = required('HED3505_STAGING_ORIGIN');
const RUN_ID = required('HED3505_TEST_RUN_ID');

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required runtime input: ${name}`);
  return value;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateSandboxEndpoints() {
  const expectedAuth = 'https://ep-broad-haze-b3jbuo1d.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth';
  const expectedApi = 'https://ep-broad-haze-b3jbuo1d.apirest.c-4.ap-southeast-1.aws.neon.tech/neondb/rest/v1';
  const forbidden = 'br-hidden-dream-b3jh4lgz';
  assert(AUTH === expectedAuth, 'Auth endpoint is not the approved HED3505 sandbox endpoint');
  assert(API === expectedApi, 'Data API endpoint is not the approved HED3505 sandbox endpoint');
  assert(!`${AUTH} ${API}`.includes(forbidden), 'Production branch endpoint detected; refusing runtime test');
  for (const [label, value] of [['Auth', AUTH], ['Data API', API], ['staging origin', ORIGIN]]) {
    assert(new URL(value).protocol === 'https:', `${label} must use HTTPS`);
  }
}

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, { redirect: 'manual', ...options });
  const raw = await response.text();
  let body = null;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = null;
  }
  return { status: response.status, ok: response.ok, body, headers: response.headers };
}

function cookieHeader(headers) {
  const values = typeof headers.getSetCookie === 'function'
    ? headers.getSetCookie()
    : [headers.get('set-cookie')].filter(Boolean);
  return values.map((value) => value.split(';', 1)[0]).filter(Boolean).join('; ');
}

function roleCredentials(role) {
  const prefix = `HED3505_SYNTH_${role}`;
  return {
    email: required(`${prefix}_EMAIL`),
    password: required(`${prefix}_PASSWORD`),
  };
}

async function signInEmailPassword(role) {
  const { email, password } = roleCredentials(role);
  const login = await jsonFetch(`${AUTH}/sign-in/email`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: ORIGIN },
    body: JSON.stringify({
      email,
      password,
      callbackURL: `${ORIGIN}/hed3505-final-learning-studio/`,
    }),
  });
  if (!login.ok) throw new Error(`${role} password sign-in failed (HTTP ${login.status})`);

  const cookie = cookieHeader(login.headers);
  if (!cookie) throw new Error(`${role} sign-in returned no session cookie`);

  const session = await jsonFetch(`${AUTH}/get-session`, {
    headers: { origin: ORIGIN, cookie },
  });
  const userId = session.body?.user?.id;
  if (!session.ok || typeof userId !== 'string' || !userId) {
    throw new Error(`${role} session could not be verified`);
  }

  const tokenResponse = await jsonFetch(`${AUTH}/token`, {
    headers: { origin: ORIGIN, cookie },
  });
  const token = tokenResponse.body?.token || tokenResponse.body?.access_token;
  if (!tokenResponse.ok || typeof token !== 'string' || !token) {
    throw new Error(`${role} session-to-JWT exchange failed (HTTP ${tokenResponse.status})`);
  }
  return { token, userId };
}

function apiUrl(path, query = {}) {
  const url = new URL(`${API}/${path}`);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  return url;
}

async function api(path, token, { method = 'GET', query = {}, body, prefer } = {}) {
  const headers = {
    accept: 'application/json',
    'accept-profile': 'hed3505',
    'content-profile': 'hed3505',
    authorization: `Bearer ${token}`,
  };
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (prefer) headers.prefer = prefer;
  return jsonFetch(apiUrl(path, query), {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

async function anonymousDenied() {
  const response = await jsonFetch(apiUrl('learner_identity', { select: 'learner_id', limit: '1' }), {
    headers: { 'accept-profile': 'hed3505' },
  });
  if (response.status === 401 || response.status === 403) return true;
  const message = String(response.body?.message || response.body?.error || '').toLowerCase();
  return response.status === 400 && message.includes('jwt') && message.includes('authentication');
}

async function oneLearnerIdentity(role, session) {
  const response = await api('learner_identity', session.token, {
    query: { select: 'learner_id,auth_user_id', limit: '2' },
  });
  assert(response.ok && Array.isArray(response.body) && response.body.length === 1,
    `${role} must resolve exactly one mapped synthetic learner`);
  assert(response.body[0].auth_user_id === session.userId,
    `${role} Auth identity does not match its learner fixture`);
  return response.body[0];
}

async function ensureSyntheticAttempt(role, session, learnerId) {
  const activityCode = `E2E_${RUN_ID.replace(/[^A-Za-z0-9_-]/g, '_')}`.slice(0, 48);
  const existing = await api('activity_attempt', session.token, {
    query: {
      select: 'attempt_id,learner_id,activity_code,response_payload',
      learner_id: `eq.${learnerId}`,
      activity_code: `eq.${activityCode}`,
      limit: '2',
    },
  });
  assert(existing.ok && Array.isArray(existing.body), `${role} synthetic attempt lookup failed`);
  if (existing.body.length > 1) throw new Error(`${role} has duplicate synthetic attempts for this run`);

  let attempt = existing.body[0];
  if (!attempt) {
    const inserted = await api('activity_attempt', session.token, {
      method: 'POST',
      prefer: 'return=representation',
      body: {
        learner_id: learnerId,
        activity_code: activityCode,
        revision_no: 1,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        response_payload: {
          test_classification: 'SYNTHETIC_E2E',
          test_run_id: RUN_ID,
          evidence: 'Synthetic R2 persistence probe; not learner work',
        },
        self_confidence: 'moderate',
      },
    });
    assert(inserted.ok && Array.isArray(inserted.body) && inserted.body.length === 1,
      `${role} could not persist its synthetic activity record (HTTP ${inserted.status})`);
    attempt = inserted.body[0];
  }

  const persisted = await api('activity_attempt', session.token, {
    query: {
      select: 'attempt_id,learner_id,activity_code,status,response_payload',
      attempt_id: `eq.${attempt.attempt_id}`,
      limit: '2',
    },
  });
  assert(persisted.ok && Array.isArray(persisted.body) && persisted.body.length === 1,
    `${role} could not read back its persisted synthetic activity record`);
  const row = persisted.body[0];
  assert(row.learner_id === learnerId && row.activity_code === activityCode,
    `${role} persisted record is not scoped to its own synthetic learner`);
  assert(row.response_payload?.test_classification === 'SYNTHETIC_E2E'
      && row.response_payload?.test_run_id === RUN_ID,
    `${role} persistence marker did not survive the round trip`);
  return row;
}

async function assertNoCrossUserAccess(role, session, otherLearnerId, otherAttemptId) {
  const [identity, attempt] = await Promise.all([
    api('learner_identity', session.token, {
      query: { select: 'learner_id', learner_id: `eq.${otherLearnerId}`, limit: '2' },
    }),
    api('activity_attempt', session.token, {
      query: { select: 'attempt_id,learner_id', attempt_id: `eq.${otherAttemptId}`, limit: '2' },
    }),
  ]);
  assert(identity.ok && Array.isArray(identity.body) && identity.body.length === 0,
    `${role} could access another synthetic learner identity`);
  assert(attempt.ok && Array.isArray(attempt.body) && attempt.body.length === 0,
    `${role} could access another synthetic learner's activity record`);
}

async function teacherAssessmentPersistence(teacher, studentAAttempt) {
  const rubricVersion = `SYNTHETIC_E2E_${RUN_ID.replace(/[^A-Za-z0-9_-]/g, '_')}`.slice(0, 64);
  const existing = await api('assessment', teacher.token, {
    query: {
      select: 'assessment_id,object_id,assessor_user_id,rubric_version,rubric_payload',
      object_id: `eq.${studentAAttempt.attempt_id}`,
      assessor_user_id: `eq.${teacher.userId}`,
      rubric_version: `eq.${rubricVersion}`,
      limit: '2',
    },
  });
  assert(existing.ok && Array.isArray(existing.body), 'Teacher assessment lookup failed');
  if (existing.body.length > 1) throw new Error('Duplicate synthetic teacher assessment for this run');

  let assessment = existing.body[0];
  if (!assessment) {
    const inserted = await api('assessment', teacher.token, {
      method: 'POST',
      prefer: 'return=representation',
      body: {
        object_type: 'activity_attempt',
        object_id: studentAAttempt.attempt_id,
        assessor_user_id: teacher.userId,
        rubric_version: rubricVersion,
        rubric_payload: { test_classification: 'SYNTHETIC_E2E', test_run_id: RUN_ID },
        assessment_status: 'draft',
      },
    });
    assert(inserted.ok && Array.isArray(inserted.body) && inserted.body.length === 1,
      `Teacher assessment insert failed (HTTP ${inserted.status})`);
    assessment = inserted.body[0];
  }

  const persisted = await api('assessment', teacher.token, {
    query: {
      select: 'assessment_id,object_id,assessor_user_id,rubric_version,rubric_payload',
      assessment_id: `eq.${assessment.assessment_id}`,
      limit: '2',
    },
  });
  assert(persisted.ok && Array.isArray(persisted.body) && persisted.body.length === 1,
    'Teacher assessment did not persist/read back');
  assert(persisted.body[0].object_id === studentAAttempt.attempt_id
      && persisted.body[0].assessor_user_id === teacher.userId
      && persisted.body[0].rubric_payload?.test_run_id === RUN_ID,
    'Teacher assessment persistence did not preserve the synthetic test linkage');
}

async function studentAssessmentDenied(studentA, attemptId) {
  const response = await api('assessment', studentA.token, {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      object_type: 'activity_attempt',
      object_id: attemptId,
      assessor_user_id: studentA.userId,
      rubric_version: `STUDENT_DENY_${RUN_ID}`.slice(0, 64),
      rubric_payload: { test_classification: 'SYNTHETIC_E2E', test_run_id: RUN_ID },
      assessment_status: 'draft',
    },
  });
  assert(!response.ok, 'Student assessment write unexpectedly succeeded');
}

async function auditEventNotExposed(studentA) {
  const response = await api('audit_event', studentA.token, {
    query: { select: 'event_id', limit: '1' },
  });
  assert(response.status === 401 || response.status === 403
      || (response.ok && Array.isArray(response.body) && response.body.length === 0),
    'audit_event exposed client-readable rows');
}

validateSandboxEndpoints();
const roles = {
  studentA: await signInEmailPassword('STUDENT_A'),
  studentB: await signInEmailPassword('STUDENT_B'),
  teacher: await signInEmailPassword('TEACHER'),
};

assert(await anonymousDenied(), 'Anonymous learning-evidence access was not denied');

const learners = {
  studentA: await oneLearnerIdentity('Student A', roles.studentA),
  studentB: await oneLearnerIdentity('Student B', roles.studentB),
};
assert(learners.studentA.learner_id !== learners.studentB.learner_id,
  'Synthetic Student A and Student B must map to distinct learner fixtures');

const [attemptA, attemptB] = await Promise.all([
  ensureSyntheticAttempt('Student A', roles.studentA, learners.studentA.learner_id),
  ensureSyntheticAttempt('Student B', roles.studentB, learners.studentB.learner_id),
]);
await Promise.all([
  assertNoCrossUserAccess('Student A', roles.studentA, learners.studentB.learner_id, attemptB.attempt_id),
  assertNoCrossUserAccess('Student B', roles.studentB, learners.studentA.learner_id, attemptA.attempt_id),
]);

const staff = await api('course_staff', roles.teacher.token, {
  query: { select: 'auth_user_id,staff_role,active', limit: '2' },
});
assert(staff.ok && Array.isArray(staff.body) && staff.body.length === 1
    && staff.body[0].active === true
    && ['teacher', 'assessor', 'admin'].includes(staff.body[0].staff_role)
    && staff.body[0].auth_user_id === roles.teacher.userId,
  'Teacher must resolve to exactly one active synthetic course_staff identity');

const teacherAttempts = await api('activity_attempt', roles.teacher.token, {
  query: {
    select: 'attempt_id,learner_id',
    attempt_id: `in.(${attemptA.attempt_id},${attemptB.attempt_id})`,
    limit: '3',
  },
});
assert(teacherAttempts.ok && Array.isArray(teacherAttempts.body) && teacherAttempts.body.length === 2,
  'Teacher could not read both synthetic evidence records');

await teacherAssessmentPersistence(roles.teacher, attemptA);
await studentAssessmentDenied(roles.studentA, attemptA.attempt_id);
await auditEventNotExposed(roles.studentA);

console.log(JSON.stringify({
  environment: 'NON_PRODUCTION_SANDBOX',
  authentication: 'PASS',
  sessionToJwt: 'PASS',
  anonymousDeny: 'PASS',
  studentAOwnReadAndPersistence: 'PASS',
  studentBOwnReadAndPersistence: 'PASS',
  crossLearnerIsolation: 'PASS',
  teacherStaffAndEvidenceRead: 'PASS',
  teacherAssessmentPersistence: 'PASS',
  studentAssessmentWriteDeny: 'PASS',
  auditEventClientIsolation: 'PASS',
  syntheticRecordsAreRetainedInSandbox: true,
}));
