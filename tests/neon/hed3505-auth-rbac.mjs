const AUTH = process.env.HED3505_NEON_AUTH_URL;
const API = process.env.HED3505_NEON_DATA_API_URL;
const ORIGIN = process.env.HED3505_STAGING_ORIGIN || 'https://staging.kengkasem.com';

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required ephemeral runtime input: ${name}`);
  return v;
}
async function jsonFetch(url, options={}) {
  const r = await fetch(url, options);
  const text = await r.text();
  let body=null; try { body=text?JSON.parse(text):null; } catch { body={raw:text.slice(0,200)}; }
  return {status:r.status, ok:r.ok, body, headers:r.headers};
}
function cookieHeader(headers) {
  const raw = typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : [headers.get('set-cookie')].filter(Boolean);
  return raw.map(v => v.split(';',1)[0]).join('; ');
}
async function signInOtpAndToken(email,otp){
  const login=await jsonFetch(`${AUTH}/sign-in/email-otp`,{
    method:'POST',
    headers:{'content-type':'application/json','origin':ORIGIN},
    body:JSON.stringify({email,otp,callbackURL:ORIGIN+'/hed3505-final-learning-studio/'})
  });
  if(!login.ok) throw new Error(`OTP sign-in failed for synthetic account: HTTP ${login.status}`);
  const cookie=cookieHeader(login.headers);
  if(!cookie) throw new Error('OTP sign-in succeeded but no session cookie was returned');

  const session=await jsonFetch(`${AUTH}/get-session`,{
    headers:{origin:ORIGIN,cookie}
  });
  if(!session.ok || !session.body?.user) throw new Error('session cookie was not accepted by Neon Auth');

  const tokenResponse=await jsonFetch(`${AUTH}/token`,{
    headers:{origin:ORIGIN,cookie}
  });
  if(!tokenResponse.ok) throw new Error(`token exchange failed: HTTP ${tokenResponse.status}`);
  const token=tokenResponse.body?.token || tokenResponse.body?.access_token;
  if(!token) throw new Error('Neon Auth token endpoint returned no JWT');
  return token;
}
async function api(path,token,options={}){
  const headers={...(options.headers||{}),authorization:`Bearer ${token}`,'accept-profile':'hed3505','content-profile':'hed3505','content-type':'application/json'};
  return jsonFetch(`${API}/${path}`,{...options,headers});
}
function assert(cond,msg){if(!cond) throw new Error(msg);}

const studentA={email:required('HED3505_STUDENT_A_EMAIL'),otp:required('HED3505_STUDENT_A_OTP')};
const studentB={email:required('HED3505_STUDENT_B_EMAIL'),otp:required('HED3505_STUDENT_B_OTP')};
const teacher={email:required('HED3505_TEACHER_EMAIL'),otp:required('HED3505_TEACHER_OTP')};
if(!AUTH||!API) throw new Error('Missing Neon endpoint configuration');

const anon=await jsonFetch(`${API}/learner_identity?select=learner_id`,{headers:{'accept-profile':'hed3505'}});
assert(anon.status===401 || anon.status===403,'Anonymous learning-evidence access was not denied');

const [a,b,t]=await Promise.all([
  signInOtpAndToken(studentA.email,studentA.otp),
  signInOtpAndToken(studentB.email,studentB.otp),
  signInOtpAndToken(teacher.email,teacher.otp)
]);

const aOwn=await api('learner_identity?select=learner_id,auth_user_id',a);
assert(aOwn.ok && Array.isArray(aOwn.body) && aOwn.body.length===1,'Student A must see exactly own learner identity');
const bOwn=await api('learner_identity?select=learner_id,auth_user_id',b);
assert(bOwn.ok && Array.isArray(bOwn.body) && bOwn.body.length===1,'Student B must see exactly own learner identity');
assert(aOwn.body[0].auth_user_id!==bOwn.body[0].auth_user_id,'Synthetic identities must be distinct');

const aAttempts=await api('activity_attempt?select=attempt_id,learner_id',a);
const bAttempts=await api('activity_attempt?select=attempt_id,learner_id',b);
assert(aAttempts.ok && bAttempts.ok,'Student activity reads must succeed');
assert(aAttempts.body.every(x=>x.learner_id===aOwn.body[0].learner_id),'Student A leaked another learner attempt');
assert(bAttempts.body.every(x=>x.learner_id===bOwn.body[0].learner_id),'Student B leaked another learner attempt');

const studentAssessmentWrite=await api('assessment',a,{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({object_type:'activity_attempt',object_id:'00000000-0000-0000-0000-000000000000',assessor_user_id:aOwn.body[0].auth_user_id,rubric_version:'synthetic-deny-test',rubric_payload:{synthetic:true},assessment_status:'draft'})});
assert(!studentAssessmentWrite.ok,'Student assessment write must be denied');

const staff=await api('course_staff?select=auth_user_id,staff_role,active',t);
assert(staff.ok && Array.isArray(staff.body) && staff.body.length===1 && staff.body[0].active===true,'Teacher must resolve to active course_staff');

const audit=await api('audit_event?select=event_id',a);
assert(audit.status===401 || audit.status===403 || (audit.ok && Array.isArray(audit.body) && audit.body.length===0),'audit_event must not expose client data');

console.log(JSON.stringify({
  anonymous:'PASS',
  sessionToJwt:'PASS',
  studentAIsolation:'PASS',
  studentBIsolation:'PASS',
  studentAssessmentWriteDeny:'PASS',
  teacherStaffRead:'PASS',
  auditClientIsolation:'PASS'
}));
