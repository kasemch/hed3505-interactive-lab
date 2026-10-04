const required = ['HED3505_DATABASE_URL','HED3505_STUDENT_A_EMAIL','HED3505_STUDENT_A_OTP','HED3505_STUDENT_B_EMAIL','HED3505_STUDENT_B_OTP','HED3505_TEACHER_EMAIL','HED3505_TEACHER_OTP'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('SKIP: authenticated role sessions are not available to CI. Missing runtime credentials: ' + missing.join(', '));
  process.exit(2);
}
console.error('Harness intentionally requires ephemeral authenticated sessions. Do not store OTPs, passwords, JWTs, or session cookies in the repository.');
process.exit(2);
