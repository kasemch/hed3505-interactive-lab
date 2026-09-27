// Pure, side-effect-free helpers. Do not infer identity verification from email ownership.
export function normalizeRegistration({name, studentId, email}) {
  return {name: String(name ?? '').trim().replace(/\s+/g,' '), studentId: String(studentId ?? '').trim(), email: String(email ?? '').trim().toLowerCase()};
}
export function validateRegistration(input) {
  const value=normalizeRegistration(input);
  const errors={};
  if(value.name.length<2 || value.name.length>150) errors.name='กรุณากรอกชื่อ–นามสกุล 2–150 ตัวอักษร';
  if(!/^[0-9]{6,15}$/.test(value.studentId)) errors.studentId='รหัสนักศึกษาต้องเป็นตัวเลข 6–15 หลัก';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) || value.email.length>254) errors.email='กรุณากรอกอีเมลที่ถูกต้อง';
  return {value,errors,valid:Object.keys(errors).length===0};
}
export function classifyEnrollment(existing, candidate) {
  const current=normalizeRegistration(candidate);
  if(existing.some(p=>p.auth_subject===candidate.authSubject)) return 'RETURNING_SUBJECT';
  if(existing.some(p=>String(p.student_id)===current.studentId)) return 'STUDENT_ID_REVIEW_REQUIRED';
  return 'NEW_ENROLLMENT';
}
export const INITIAL_REGISTRATION_STATE=Object.freeze({emailVerified:false,rosterVerified:false});
