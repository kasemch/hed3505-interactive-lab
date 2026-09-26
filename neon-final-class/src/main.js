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
const firstRound = new Set(stages.slice(0,5).map(([v])=>v));
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
  const answers=await checked(db.from('responses').select('stage,revision_no,submitted_at').eq('participant_id',activeParticipant.id).order('submitted_at',{ascending:false}));
  const open=activeSession.phase;
  $('myWork').innerHTML='<h3>'+safe(activeSession.title)+'</h3><p>สถานะ: '+safe(open)+'</p>'+
    '<h4>เอกสารที่เปิดแล้ว</h4>'+docs.map(d=>'<details class="item"><summary>'+safe(d.title)+' · รอบ '+d.round_no+'</summary><pre>'+safe(JSON.stringify(d.content,null,2))+'</pre></details>').join('')+
    '<h4>คำตอบของฉัน</h4>'+answers.map(a=>'<div class="item">'+safe(a.stage)+' · ฉบับ '+a.revision_no+'</div>').join('')+
    '<button id="refreshEvidence" class="secondary" type="button">ตรวจสอบหลักฐานใหม่</button>'+
    '<form id="answerForm"><label for="stage">ขั้นกิจกรรม</label><select id="stage" required></select><label for="answer">คำตอบ (ข้อมูลจำลองเท่านั้น)</label><textarea id="answer" required rows="6" maxlength="10000"></textarea><button type="submit">บันทึกฉบับใหม่</button></form><p id="answerMessage" role="status"></p>';
  const choices=stages.filter(([v])=>open==='ROUND2_OPEN'? !firstRound.has(v) : (open==='ROUND1_OPEN'&&firstRound.has(v)));
  $('stage').innerHTML=choices.map(([v,t])=>'<option value="'+v+'">'+safe(t)+'</option>').join('');
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
    checked(db.from('responses').select('id,participant_id,session_id,stage,revision_no,submitted_at').order('submitted_at',{ascending:false}))
  ]);
  const initial=new Set(responses.filter(r=>r.stage==='INITIAL_JUDGMENT').map(r=>r.participant_id));
  $('teacherData').innerHTML=sessions.map(s=>{
    const people=participants.filter(p=>p.session_id===s.id);
    const done=people.filter(p=>initial.has(p.id)).length;
    const ready=s.phase==='ROUND1_OPEN' && people.length>0 && done===people.length;
    const summary='<div class="item"><strong>'+safe(s.title)+'</strong> · '+safe(s.session_code)+
      '<p>สถานะ '+safe(s.phase)+' · ผู้เข้าร่วม '+people.length+'/'+s.capacity+
      ' · Initial Judgment '+done+'/'+people.length+'</p>';
    const list=people.map(p=>'<div class="item">'+safe(p.display_name)+' · '+safe(p.student_id)+
      ' · คำตอบ '+responses.filter(r=>r.participant_id===p.id).length+' ฉบับ</div>').join('');
    const button=s.phase==='ROUND1_OPEN'?'<button type="button" data-open-round2="'+safe(s.id)+'" '+(ready?'':'disabled')+'>เปิดหลักฐานรอบที่ 2</button>':'';
    return summary+list+button+'</div>';
  }).join('') || '<p>ยังไม่มีรอบกิจกรรมทดลอง</p>';
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
    if(!['ROUND1_OPEN','ROUND2_OPEN'].includes(s.phase))throw new Error('กิจกรรมยังไม่เปิด');
    await checked(db.from('participants').insert({
      session_id:s.id,auth_subject:signedIn.id,student_id:$('studentId').value.trim(),
      display_name:$('displayName').value.trim(),identity_verified:false
    }));
    note('joinMessage','เข้าร่วมกิจกรรมทดสอบแล้ว');await loadMine();
  }catch(err){note('joinMessage',fail(err),true);}
};
refresh().catch(e=>{hideAll();$('authPanel').hidden=false;note('authMessage',fail(e),true);});
