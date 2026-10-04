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
