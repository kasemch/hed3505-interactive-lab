import { createClient } from '@neondatabase/neon-js';
import './style.css';

// Public HTTPS endpoint only; never use a Postgres connection string in a browser.
const client = createClient({
  auth: { url: 'https://ep-gentle-term-b3w3l5hi.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth' },
  dataApi: { url: 'https://ep-gentle-term-b3w3l5hi.apirest.c-4.ap-southeast-1.aws.neon.tech/neondb/rest/v1' }
});
const db = client.schema('hed3505_final_class');
const $ = (id) => document.getElementById(id);
let signedIn = null;
let activeParticipant = null;
let activeSession = null;
const stages = [
  ['PRETEST','Pretest'],
  ['INITIAL_JUDGMENT','Initial Judgment'],
  ['EVIDENCE_REGISTER','Evidence Register'],
  ['DATA_INTEGRITY','Data Integrity'],
  ['QUALITY_AUDIT','Quality Audit'],
  ['REVISED_JUDGMENT','Revised Judgment'],
  ['DECISION_BRIEF','Decision Brief'],
  ['REFLECTION','Reflection'],
  ['POSTTEST','Posttest']
];
const firstRound = new Set(['PRETEST','INITIAL_JUDGMENT','EVIDENCE_REGISTER']);
const rubric = [
  ['evidence_extraction','สกัดหลักฐานและอ้างแหล่ง'],
  ['denominator_conflict','ตรวจตัวหารและความขัดแย้ง'],
  ['relevance','จำแนกความเกี่ยวข้องของข้อมูล'],
  ['instrument_limits','ประเมินคุณภาพและข้อจำกัด'],
  ['judgment_recommendation','Judgment & Recommendation']
];
const safe = (v) => String(v ?? '').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function note(id,message,error=false){$(id).textContent=message;$(id).className=error?'danger':'ok';}
function fail(e){return e?.message || 'ไม่สามารถทำรายการได้ โปรดลองใหม่';}
async function checked(query){const {data,error}=await query;if(error)throw error;return data;}
function hideAll(){$('workspace').hidden=true;$('teacherPanel').hidden=true;$('studentPanel').hidden=true;}
async function refresh(){
  hideAll();
  const {data,error}=await client.auth.getSession();
  if(error)throw error;
  signedIn=data?.user || data?.session?.user || null;
  if(!signedIn){$('authPanel').hidden=false;return;}
  if(signedIn.emailVerified!==true){$('authPanel').hidden=false;note('authMessage','บัญชีนี้ยังไม่ยืนยันอีเมล กรุณายืนยันด้วยรหัสที่ส่งไปยังอีเมลทดลอง',true);return;}
  $('authPanel').hidden=true;$('workspace').hidden=false;
  $('accountEmail').textContent=signedIn.email || 'บัญชีทดสอบ';
  $('accountSubject').textContent='Auth subject: '+signedIn.id;
  const [sessions,teacher] = await Promise.all([
    checked(db.from('class_sessions').select('id,session_code,title,phase,capacity').order('created_at',{ascending:false})),
    checked(db.rpc('is_instructor'))
  ]);
  const isTeacher=teacher===true;
  $('sessionMessage').textContent=sessions.length?'รายการกิจกรรมที่บัญชีนี้มีสิทธิ์เห็น':'ยังไม่มีกิจกรรมเปิดให้บัญชีนี้';
  $('sessions').innerHTML=sessions.map(s=>'<div class="item"><strong>'+safe(s.title)+'</strong> · '+safe(s.session_code)+' · '+safe(s.phase)+'</div>').join('');
  if(isTeacher){$('teacherPanel').hidden=false;await loadTeacher();}
  else{$('studentPanel').hidden=false;await loadMine();}
}
async function loadMine(){
  const rows=await checked(db.from('participants').select('id,session_id,student_id,display_name').eq('auth_subject',signedIn.id));
  activeParticipant=rows[0]||null;
  if(!activeParticipant){$('myWork').textContent='ยังไม่ได้เข้าร่วมกิจกรรมทดลอง';return;}
  const sessionRows=await checked(db.from('class_sessions').select('id,session_code,title,phase').eq('id',activeParticipant.session_id));
  activeSession=sessionRows[0]||null;
  if(!activeSession){$('myWork').textContent='ไม่พบกิจกรรม';return;}
  const docs=await checked(db.from('case_documents').select('round_no,title,content,version').eq('session_id',activeSession.id).order('round_no'));
  const answers=await checked(db.from('responses').select('id,stage,revision_no,submitted_at').eq('participant_id',activeParticipant.id).order('submitted_at',{ascending:false}));
  const grades=answers.length?await checked(db.from('assessments').select('response_id,total_score,feedback,assessed_at').in('response_id',answers.map(a=>a.id)).order('assessed_at',{ascending:false})):[];
  const gradeByResponse=new Map();
  for(const grade of grades)if(!gradeByResponse.has(grade.response_id))gradeByResponse.set(grade.response_id,grade);
  const open=activeSession.phase;
  $('myWork').innerHTML='<h3>'+safe(activeSession.title)+'</h3><p>สถานะ: '+safe(open)+'</p>'+
    '<h4>เอกสารที่เปิดแล้ว</h4>'+docs.map(d=>'<details class="item"><summary>'+safe(d.title)+' · รอบ '+d.round_no+'</summary><pre>'+safe(JSON.stringify(d.content,null,2))+'</pre></details>').join('')+
    '<h4>คำตอบของฉัน</h4>'+answers.map(a=>{const grade=gradeByResponse.get(a.id);return '<div class="item">'+safe(a.stage)+' · ฉบับ '+a.revision_no+(grade?' · คะแนน '+safe(grade.total_score)+'/10 · ข้อเสนอแนะ: '+safe(grade.feedback||'ไม่มีข้อความ'):' · รอประเมิน')+'</div>';}).join('')+
    '<button id="refreshEvidence" class="secondary" type="button">ตรวจสอบหลักฐานใหม่</button>'+
    '<form id="answerForm"><label for="stage">ขั้นกิจกรรม</label><select id="stage" required></select><label for="answer">คำตอบ (ข้อมูลจำลองเท่านั้น)</label><textarea id="answer" required rows="6" maxlength="10000"></textarea><button type="submit">บันทึกฉบับใหม่</button></form><p id="answerMessage" role="status"></p>';
  const choices=stages.filter(([v])=>open==='ROUND2_OPEN'? !firstRound.has(v) : (open==='ROUND1_OPEN'&&firstRound.has(v)));
  $('stage').innerHTML=choices.map(([v,t])=>'<option value="'+v+'">'+safe(t)+'</option>').join('');
  $('answerForm').hidden=choices.length===0;
  $('refreshEvidence').onclick=()=>loadMine().catch(err=>note('answerMessage',fail(err),true));
  $('answerForm').onsubmit=async(e)=>{
    e.preventDefault();const stage=$('stage').value,answer=$('answer').value.trim();
    if(!answer)return;
    try{
      const existing=answers.filter(x=>x.stage===stage);
      const revision_no=Math.max(0,...existing.map(x=>x.revision_no))+1;
      await checked(db.from('responses').insert({
        session_id:activeSession.id,participant_id:activeParticipant.id,
        stage,revision_no,answer:{text:answer,synthetic:true}
      }));
      note('answerMessage','บันทึกฉบับ '+revision_no+' แล้ว');await loadMine();
    }catch(err){note('answerMessage',fail(err),true);}
  };
}
async function loadTeacher(){
  const [sessions,participants,responses]=await Promise.all([
    checked(db.from('class_sessions').select('id,session_code,title,phase,capacity,round2_opened_at').order('created_at',{ascending:false})),
    checked(db.from('participants').select('id,session_id,student_id,display_name,joined_at').order('joined_at',{ascending:false})),
    checked(db.from('responses').select('id,participant_id,session_id,stage,revision_no,submitted_at,answer').order('submitted_at',{ascending:false}))
  ]);
  const assessments=await checked(db.from('assessments').select('response_id,total_score,criteria,feedback,assessed_at').order('assessed_at',{ascending:false}));
  const initial=new Set(responses.filter(r=>r.stage==='INITIAL_JUDGMENT').map(r=>r.participant_id));
  $('teacherData').innerHTML=sessions.map(s=>{
    const people=participants.filter(p=>p.session_id===s.id);
    const done=people.filter(p=>initial.has(p.id)).length;
    const ready=s.phase==='ROUND1_OPEN' && people.length===s.capacity && done===people.length;
    const summary='<div class="item"><strong>'+safe(s.title)+'</strong> · '+safe(s.session_code)+
      '<p>สถานะ '+safe(s.phase)+' · ผู้เข้าร่วม '+people.length+'/'+s.capacity+
      ' · Initial Judgment '+done+'/'+people.length+'</p>';
    const list=people.map(p=>'<div class="item">'+safe(p.display_name)+' · '+safe(p.student_id)+
      ' · คำตอบ '+responses.filter(r=>r.participant_id===p.id).length+' ฉบับ</div>').join('');
    const button=s.phase==='ROUND1_OPEN'?'<button type="button" data-open-round2="'+safe(s.id)+'" '+(ready?'':'disabled')+'>เปิดหลักฐานรอบที่ 2</button>':'';
    return summary+list+button+'</div>';
  }).join('') || '<p>ยังไม่มีรอบกิจกรรมทดลอง</p>';
  // Individual evidence and scoring stay in the instructor-only view; no answer key is shipped to students.
  const assessable=responses.filter(r=>r.stage==='REVISED_JUDGMENT'||r.stage==='DECISION_BRIEF');
  const personById=new Map(participants.map(p=>[p.id,p]));
  const existingByResponse=new Map();
  for(const a of assessments)if(!existingByResponse.has(a.response_id))existingByResponse.set(a.response_id,a);
  $('teacherData').insertAdjacentHTML('beforeend',
    '<h3>ประเมินผลงานรายบุคคล (ฉบับที่ส่งแล้ว)</h3>'+
    (assessable.length?assessable.map(r=>{
      const person=personById.get(r.participant_id);
      const previous=existingByResponse.get(r.id);
      return '<details class="item"><summary>'+safe(person?.display_name||'ผู้เรียน')+' · '+safe(r.stage)+' · ฉบับ '+r.revision_no+
        (previous?' · คะแนนล่าสุด '+safe(previous.total_score)+'/10':' · ยังไม่ประเมิน')+'</summary>'+
        '<pre>'+safe(JSON.stringify(r.answer,null,2))+'</pre>'+
        '<form data-assess="'+safe(r.id)+'"><p>ให้คะแนนตาม Rubric v5.1 (0, 1 หรือ 2 คะแนนต่อเกณฑ์)</p>'+
        rubric.map(([key,label])=>'<label>'+safe(label)+'</label><select name="'+key+'" required>'+
          [0,1,2].map(n=>'<option value="'+n+'" '+(previous?.criteria?.[key]===n?'selected':'')+'>'+n+'</option>').join('')+'</select>').join('')+
        '<label>ข้อเสนอแนะรายบุคคล</label><textarea name="feedback" maxlength="4000" rows="3">'+safe(previous?.feedback||'')+'</textarea>'+
        '<output>รวม: '+safe(previous?.total_score??0)+'/10</output><button type="submit">บันทึกการประเมินฉบับใหม่</button>'+
        '<p role="status" class="assessment-message"></p></form></details>';
    }).join(''):'<p>ยังไม่มี Revised Judgment หรือ Decision Brief ให้ประเมิน'));
  for(const form of $('teacherData').querySelectorAll('[data-assess]')){
    const updateTotal=()=>{
      const total=rubric.reduce((sum,[key])=>sum+Number(form.elements.namedItem(key).value),0);
      form.querySelector('output').textContent='รวม: '+total+'/10';
      return total;
    };
    form.onchange=updateTotal;
    form.onsubmit=async(e)=>{
      e.preventDefault();
      const btn=form.querySelector('button'),status=form.querySelector('.assessment-message');
      const criteria=Object.fromEntries(rubric.map(([key])=>[key,Number(form.elements.namedItem(key).value)]));
      btn.disabled=true;
      try{
        await checked(db.from('assessments').insert({
          response_id:form.dataset.assess,assessed_by_subject:signedIn.id,rubric_version:'v5.1',
          criteria,total_score:updateTotal(),feedback:form.elements.namedItem('feedback').value.trim()
        }));
        status.textContent='บันทึกคะแนนแล้ว (เก็บเป็นฉบับใหม่ ไม่เขียนทับ)';
        await loadTeacher();
      }catch(err){status.textContent=fail(err);btn.disabled=false;}
    };
  }
  for(const button of $('teacherData').querySelectorAll('[data-open-round2]')){
    button.onclick=async()=>{
      if(!confirm('ยืนยันเปิดหลักฐานรอบที่ 2? การส่ง Initial Judgment จะถูกล็อกทันที'))return;
      button.disabled=true;
      try{
        await checked(db.rpc('open_round2',{p_session_id:button.dataset.openRound2}));
        await refresh();
      }catch(err){alert(fail(err));button.disabled=false;}
    };
  }
}
$('signupForm').onsubmit=async(e)=>{
  e.preventDefault();
  const email=$('signupEmail').value.trim();
  const password=$('signupPassword').value;
  try{
    const {data,error}=await client.auth.signUp.email({email,password,name:'HED3505 Synthetic Tester'});
    if(error)throw error;
    $('signupPassword').value='';
    if(data?.user?.emailVerified===true){note('authMessage','สร้างบัญชีแล้วและอีเมลได้รับการยืนยัน');await refresh();return;}
    $('signupVerifyForm').hidden=false;
    note('authMessage','ตรวจสอบรหัสยืนยันในอีเมลทดสอบและกรอกด้านล่าง');
  }catch(err){$('signupPassword').value='';note('authMessage',fail(err),true);}
};
$('signupVerifyForm').onsubmit=async(e)=>{
  e.preventDefault();
  try{
    const {error}=await client.auth.emailOtp.verifyEmail({email:$('signupEmail').value.trim(),otp:$('signupOtp').value.trim()});
    if(error)throw error;
    $('signupOtp').value='';
    $('signupVerifyForm').hidden=true;
    note('authMessage','ยืนยันอีเมลแล้ว กรุณาเข้าสู่ระบบด้วย OTP หากยังไม่มีเซสชัน');
    await refresh();
  }catch(err){note('authMessage',fail(err),true);}
};
$('otpForm').onsubmit=async(e)=>{
  e.preventDefault();const email=$('email').value.trim();
  try{
    const {error}=await client.auth.emailOtp.sendVerificationOtp({email,type:'sign-in'});
    if(error)throw error;
    $('verifyForm').hidden=false;note('authMessage','ส่งรหัส OTP แล้ว ตรวจสอบอีเมลทดสอบ');
  }catch(err){note('authMessage',fail(err),true);}
};
$('verifyForm').onsubmit=async(e)=>{
  e.preventDefault();
  try{
    const {error}=await client.auth.signIn.emailOtp({email:$('email').value.trim(),otp:$('otp').value.trim()});
    if(error)throw error;await refresh();
  }catch(err){note('authMessage',fail(err),true);}
};
$('googleBtn').onclick=async()=>{
  try{
    const {error}=await client.auth.signIn.social({provider:'google',callbackURL:location.href.split('?')[0]});
    if(error)throw error;
  }catch(err){note('authMessage',fail(err),true);}
};
$('signOut').onclick=async()=>{await client.auth.signOut();signedIn=null;hideAll();$('authPanel').hidden=false;};
$('joinForm').onsubmit=async(e)=>{
  e.preventDefault();
  try{
    if(!signedIn)throw new Error('กรุณาเข้าสู่ระบบก่อน');
    const code=$('sessionCode').value.trim();
    const rows=await checked(db.from('class_sessions').select('id,phase').eq('session_code',code));
    if(!rows.length)throw new Error('ไม่พบกิจกรรมที่เปิดอยู่');
    const s=rows[0];
    if(s.phase!=='ROUND1_OPEN')throw new Error('รับผู้เข้าร่วมเฉพาะรอบที่ 1 ก่อนเปิดหลักฐานใหม่');
    await checked(db.from('participants').insert({
      session_id:s.id,auth_subject:signedIn.id,student_id:$('studentId').value.trim(),
      display_name:$('displayName').value.trim(),identity_verified:false
    }));
    note('joinMessage','เข้าร่วมกิจกรรมทดสอบแล้ว');await loadMine();
  }catch(err){note('joinMessage',fail(err),true);}
};
refresh().catch(e=>{hideAll();$('authPanel').hidden=false;note('authMessage',fail(e),true);});
