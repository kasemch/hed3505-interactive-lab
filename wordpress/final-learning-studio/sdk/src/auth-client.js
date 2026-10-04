import { createClient } from '@neondatabase/neon-js';

const DATABASE_URL = 'https://ep-broad-haze-b3jbuo1d.c-4.ap-southeast-1.aws.neon.tech/neondb';
const CALLBACK_URL = 'https://staging.kengkasem.com/hed3505-final-learning-studio/';
const client = createClient(DATABASE_URL);

export async function getSession() {
  return client.auth.getSession();
}

export async function signInGoogle() {
  return client.auth.signIn.social({ provider: 'google', callbackURL: CALLBACK_URL });
}

export async function sendOtp(email) {
  return client.auth.emailOtp.sendVerificationOtp({ email, type: 'sign-in' });
}

export async function signInOtp(email, otp) {
  return client.auth.signIn.emailOtp({ email, otp });
}

export async function signOut() {
  return client.auth.signOut();
}

export async function rlsProbe() {
  const session = await client.auth.getSession();
  if (session.error || !session.data?.session) return { ok: false, stage: 'session' };
  const result = await client.from('learner_identity').select('learner_id,auth_user_id,status');
  if (result.error) return { ok: false, stage: 'data-api', error: result.error.message };
  return { ok: true, stage: 'rls', rows: Array.isArray(result.data) ? result.data.length : 0 };
}


function requireSession(session) {
  if (session?.error || !session?.data?.session) {
    throw new Error('AUTH_REQUIRED');
  }
}

export async function saveActivityEvidence(activityCode, payload, confidence = null) {
  if (!['C2', 'C3'].includes(activityCode)) throw new Error('INVALID_ACTIVITY_CODE');
  const session = await client.auth.getSession();
  requireSession(session);

  const learner = await client.from('learner_identity').select('learner_id').single();
  if (learner.error || !learner.data?.learner_id) throw new Error('LEARNER_NOT_ENROLLED');

  const previous = await client.from('activity_attempt')
    .select('revision_no')
    .eq('learner_id', learner.data.learner_id)
    .eq('activity_code', activityCode)
    .order('revision_no', { ascending: false })
    .limit(1);

  if (previous.error) throw new Error('REVISION_LOOKUP_FAILED');
  const revisionNo = (previous.data?.[0]?.revision_no || 0) + 1;

  const row = {
    learner_id: learner.data.learner_id,
    activity_code: activityCode,
    revision_no: revisionNo,
    status: 'submitted',
    response_payload: payload,
    self_confidence: confidence,
    submitted_at: new Date().toISOString()
  };
  const result = await client.from('activity_attempt').insert(row).select('attempt_id,activity_code,revision_no,status,submitted_at').single();
  if (result.error) throw new Error(result.error.message || 'ACTIVITY_SAVE_FAILED');
  return { ok: true, data: result.data };
}

const DECISION_CODES = new Set(['CONTINUE','CONTINUE_WITH_MODIFICATION','COLLECT_MORE_EVIDENCE','DISCONTINUE']);

export async function saveHearingEvidence(payload) {
  const session = await client.auth.getSession();
  requireSession(session);
  if (!DECISION_CODES.has(payload?.decision_code)) throw new Error('INVALID_DECISION_CODE');

  const row = {
    group_id: payload.group_id,
    decision_code: payload.decision_code,
    evidence_summary: payload.evidence_summary,
    interpretation_summary: payload.interpretation_summary,
    criterion_summary: payload.criterion_summary,
    judgment_summary: payload.judgment_summary,
    limitation_summary: payload.limitation_summary || null,
    recommendation_summary: payload.recommendation_summary,
    confidence_level: payload.confidence_level || null,
    submitted_at: new Date().toISOString()
  };
  const result = await client.from('group_hearing').insert(row).select('hearing_id,group_id,decision_code,confidence_level,submitted_at').single();
  if (result.error) throw new Error(result.error.message || 'HEARING_SAVE_FAILED');
  return { ok: true, data: result.data };
}
