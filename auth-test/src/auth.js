import { createAuthClient } from '@neondatabase/neon-js/auth';

const authUrl = globalThis.HED3505_R2_AUTH_URL;

if (!authUrl || !authUrl.startsWith('https://')) {
  throw new Error('HED3505 R2 Auth URL is missing or invalid. Refusing to fall back to production.');
}

export const authClient = createAuthClient(authUrl);
