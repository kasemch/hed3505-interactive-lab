/**
 * HED3505 staging-only signed-session RLS negative harness.
 * Run in the browser DevTools console while signed in to the account under test.
 * It never prints OTP, cookies, access tokens, response bodies, or auth subject IDs.
 *
 * Purpose: exercise the same Neon Data API with the CURRENT browser session.
 * Expected for an uninvited student account:
 *   session discovery -> 0 rows
 *   own participant -> 0 rows
 *   responses visible -> 0 rows
 *
 * Direct cross-account mutation tests intentionally require opaque IDs supplied
 * locally in DevTools and are never committed or pasted into chat.
 */
(async () => {
  const client = window.__HED3505_TEST_CLIENT__;
  if (!client) throw new Error('Test client unavailable. Use a staging build with harness exposure enabled.');
  const db = client.schema('hed3505_final_class');
  const result = [];
  const check = async (name, query, expectZero = true) => {
    const { data, error } = await query;
    const count = Array.isArray(data) ? data.length : null;
    const pass = !error && (!expectZero || count === 0);
    result.push({ test: name, pass, rows: count, error: error ? 'DENIED_OR_ERROR' : null });
  };
  await check('visible_sessions', db.from('class_sessions').select('id').limit(5));
  await check('visible_participants', db.from('participants').select('id').limit(5));
  await check('visible_responses', db.from('responses').select('id').limit(5));
  console.table(result);
  console.log('HED3505_RLS_NEGATIVE_RESULT', result.every(x => x.pass) ? 'PASS' : 'REVIEW');
})();