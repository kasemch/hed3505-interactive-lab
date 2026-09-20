const P="hed3505_eval_lab_v1_";
const iocRows=[
 {item:"Q1",ratings:[1,1,1,0,1],sum:4,ioc:.80},
 {item:"Q2",ratings:[1,0,-1,1,0],sum:1,ioc:.20},
 {item:"Q3",ratings:[1,1,1,1,1],sum:5,ioc:1.00},
 {item:"Q4",ratings:[0,1,0,1,1],sum:3,ioc:.60},
 {item:"Q5",ratings:[-1,0,1,0,-1],sum:-1,ioc:-.20}
];
const relData=[
[4,4,5,3,4],[3,4,4,3,4],[5,5,4,5,4],[2,3,3,2,2],[4,4,3,4,5],[3,2,4,3,3],
[5,4,5,4,4],[2,2,3,2,3],[4,5,4,3,4],[3,4,2,3,4],[5,4,5,4,5],[2,3,2,2,2]
];
const statsData=[[6,8],[7,9],[5,7],[8,9],[6,8],[7,8],[4,7],[5,7],[6,8],[7,9],[5,7],[6,8]];
const methodKey={a:"Cronbach's alpha",b:"KR-20",c:"Inter-rater reliability",d:"Test–retest reliability"};
const LEARNER_KEY=P+"learner";
const labLabels=[
  ["lab1","LAB 1","Blueprint"],
  ["ioc","LAB 2","IOC"],
  ["rel","LAB 3","Reliability"],
  ["stats","LAB 4","Statistics"],
  ["lab5","LAB 5","Judgment"]
];

function validStudentId(v){return /^\d{6,15}$/.test((v||"").trim())}
function maskStudentId(v){
  v=(v||"").trim();
  if(v.length<=4)return v;
  return v.slice(0,4)+"••••"+v.slice(-2);
}
function getLearner(){try{return JSON.parse(localStorage.getItem(LEARNER_KEY))}catch(e){return null}}
function saveLearner(x){localStorage.setItem(LEARNER_KEY,JSON.stringify(x))}
function enterLab(){
  const student_id=document.getElementById("studentId").value.trim();
  const display_name=document.getElementById("displayName").value.trim();
  let problems=[];
  if(!validStudentId(student_id))problems.push("กรอกรหัสนักศึกษาเป็นตัวเลข 6–15 หลัก");
  if(display_name.length<2)problems.push("กรอกชื่อที่ใช้แสดงผล");
  if(problems.length){
    document.getElementById("checkinFeedback").innerHTML='<div class="warn">'+problems.join("<br>")+'</div>';
    return;
  }
  saveLearner({student_id,display_name,checkin_at:new Date().toISOString()});
  openLabApp();
}
function changeLearner(){
  if(confirm("ออกจาก session ปัจจุบันและกลับไปหน้า Check-in? คำตอบใน LAB จะยังคงอยู่ใน browser นี้")){
    localStorage.removeItem(LEARNER_KEY);
    document.getElementById("labApp").classList.add("hidden");
    document.getElementById("checkinGate").classList.remove("hidden");
  }
}
function isLabStarted(key){
  const x=load(key,{});
  return x && Object.keys(x).some(k=>String(x[k]??"").trim()!=="");
}
function isLabComplete(key){
  const x=load(key,{});
  if(key==="lab1")return ["lab1Indicator","lab1Evidence","lab1Instrument","lab1Claim","lab1Reason"].every(k=>String(x[k]??"").trim()!=="");
  if(key==="ioc")return iocRows.every((r,i)=>String(x["ioc"+i]??"").trim()!=="")&&String(x.reason??"").trim()!=="";
  if(key==="rel")return ["suspectItem","conflictReason","finalDecision","finalEvidence1","finalEvidence2","finalRisk","finalAction"].every(k=>String(x[k]??"").trim()!=="");
  if(key==="stats")return ["preMean","preSD","postMean","postSD","meanChange","statResult","statInterpret","statLimit","causalDecision","causalReason"].every(k=>String(x[k]??"").trim()!=="");
  if(key==="lab5")return ["lab5Fact","lab5Interpret","lab5Judgment","lab5Recommendation","lab5Missing","lab5Need"].every(k=>String(x[k]??"").trim()!=="");
  return false;
}
function allLabsComplete(){
  return labLabels.every(([key])=>isLabComplete(key));
}
function hashText(s){
  let h=2166136261;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
  return (h>>>0).toString(36).toUpperCase().padStart(7,"0").slice(0,7);
}
function ensureCompletionRecord(){
  if(!allLabsComplete()) return null;
  let rec=load("completion",null);
  const learner=getLearner()||{};
  if(!rec){
    const now=new Date();
    const dateISO=now.toISOString().slice(0,10);
    rec={
      completed_at:now.toISOString(),
      completion_date:dateISO,
      certificate_id:"HED3505-"+dateISO.replaceAll("-","")+"-"+hashText((learner.student_id||"")+"|"+dateISO)
    };
    save("completion",rec);
  }
  return rec;
}
function formatThaiDate(iso){
  if(!iso)return "-";
  const d=new Date(iso+"T00:00:00");
  try{return new Intl.DateTimeFormat("th-TH",{day:"numeric",month:"long",year:"numeric"}).format(d)}
  catch(e){return iso}
}
function renderCongratulations(){
  const learner=getLearner()||{},rec=ensureCompletionRecord();
  if(!rec)return;
  const n=document.getElementById("congratsName");
  const m=document.getElementById("certificateMeta");
  if(n)n.textContent="ยินดีด้วย "+(learner.display_name||"")+" — คุณทำครบทั้ง 5 LAB แล้ว";
  if(m)m.textContent="Completion Date: "+formatThaiDate(rec.completion_date)+" · Certificate ID: "+rec.certificate_id;
  const nav=document.getElementById("congratsNav"); if(nav)nav.classList.remove("hidden");
}
function labKeyFromPanel(id){
  if(id==="lab1")return "lab1";
  if(id==="lab2")return "ioc";
  if(id==="lab3")return "rel";
  if(id==="lab4")return "stats";
  if(id==="lab5")return "lab5";
  return null;
}
function goToLab(id){
  const targetKey=labKeyFromPanel(id);
  const order=["lab1","lab2","lab3","lab4","lab5"];
  const currentVisible=order.find(x=>{
    const el=document.getElementById(x);
    return el&&!el.classList.contains("hidden");
  });
  const currentKey=labKeyFromPanel(currentVisible);
  if(targetKey&&currentKey){
    const currentIndex=order.indexOf(currentVisible);
    const targetIndex=order.indexOf(id);
    if(targetIndex>currentIndex && !isLabComplete(currentKey)){
      const proceed=confirm("LAB นี้ยังไม่ครบตามเกณฑ์ที่ระบบตรวจได้\n\nแนะนำให้ทำให้ครบก่อนเพื่อให้การเรียนรู้ต่อเนื่อง\n\nต้องการไป LAB ถัดไปหรือไม่?");
      if(!proceed)return;
    }
  }
  showPanel(id);
  const target=document.getElementById(id);
  if(target)target.scrollIntoView({behavior:"smooth",block:"start"});
}
function finishLabJourney(){
  if(!allLabsComplete()){
    alert("ยังทำกิจกรรมไม่ครบทั้ง 5 LAB\n\nกรุณาตรวจ Progress Dashboard หรือกลับไปเติมคำตอบที่ยังไม่ครบ");
    renderDashboard();
    window.scrollTo({top:document.querySelector(".dashboard").offsetTop-12,behavior:"smooth"});
    return;
  }
  renderCongratulations();
  showPanel("congratulations");
  document.getElementById("congratulations").scrollIntoView({behavior:"smooth",block:"start"});
}

function showPanel(id){
  document.querySelectorAll(".panel").forEach(x=>{
    if(!x.classList.contains("dashboard")&&!x.classList.contains("student-session"))x.classList.add("hidden");
  });
  const el=document.getElementById(id); if(el)el.classList.remove("hidden");
  if(id==="congratulations")renderCongratulations();
}
function maybeCelebrate(previousDone){
  if(!allLabsComplete())return;
  const first=!load("celebrated",false);
  renderCongratulations();
  if(first){
    save("celebrated",true);
    showPanel("congratulations");
    window.scrollTo({top:document.getElementById("congratulations").offsetTop-14,behavior:"smooth"});
  }
}

function renderDashboard(){
  const learner=getLearner(); if(!learner)return;
  document.getElementById("welcomeName").textContent="สวัสดี "+learner.display_name;
  document.getElementById("sessionStudent").textContent="Student: "+maskStudentId(learner.student_id);
  let done=0;
  const cards=labLabels.map(([key,label,title])=>{
    const complete=isLabComplete(key),started=isLabStarted(key);
    if(complete)done++;
    const state=complete?"Completed":started?"In progress":"Not started";
    const cls=complete?"status-done":started?"status-progress":"status-new";
    const target=key==="ioc"?"lab2":key==="rel"?"lab3":key==="stats"?"lab4":key;
    return '<button class="progress-card '+cls+'" data-target="'+target+'"><strong>'+label+'</strong><span>'+title+'</span><em>'+state+'</em></button>';
  }).join("");
  document.getElementById("progressCards").innerHTML=cards;
  document.getElementById("progressText").textContent="Progress: "+done+"/5 LABs";
  document.getElementById("progressRing").textContent=done+"/5";
  if(done===5)renderCongratulations();
  document.querySelectorAll(".progress-card").forEach(b=>b.onclick=()=>{
    document.querySelectorAll(".panel").forEach(x=>{
      if(!x.classList.contains("dashboard")&&!x.classList.contains("student-session"))x.classList.add("hidden");
    });
    const target=document.getElementById(b.dataset.target);
    if(target)target.classList.remove("hidden");
    window.scrollTo({top:document.querySelector(".tabs").offsetTop-10,behavior:"smooth"});
  });
}
function openLabApp(){
  const learner=getLearner(); if(!learner)return;
  document.getElementById("checkinGate").classList.add("hidden");
  document.getElementById("labApp").classList.remove("hidden");
  renderDashboard();
}
function bootLearnerGate(){
  const learner=getLearner();
  if(learner){
    document.getElementById("checkinGate").classList.add("hidden");
    document.getElementById("labApp").classList.remove("hidden");
    renderDashboard();
  }else{
    document.getElementById("checkinGate").classList.remove("hidden");
    document.getElementById("labApp").classList.add("hidden");
  }
}

function load(k,f={}){try{return JSON.parse(localStorage.getItem(P+k))??f}catch(e){return f}}
function save(k,v){localStorage.setItem(P+k,JSON.stringify(v))}
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]))}
document.querySelectorAll("[data-show]").forEach(b=>b.onclick=()=>showPanel(b.dataset.show));

function renderLab1(){
 let s=load("lab1",{});
 ["lab1Indicator","lab1Evidence","lab1Instrument","lab1Claim","lab1Reason"].forEach(id=>{
   let el=document.getElementById(id); if(!el)return;
   el.value=s[id]??"";
   el.oninput=saveLab1; el.onchange=saveLab1;
 });
}
function saveLab1(){
 let s={};["lab1Indicator","lab1Evidence","lab1Instrument","lab1Claim","lab1Reason"].forEach(id=>s[id]=document.getElementById(id).value);save("lab1",s); if(getLearner())renderDashboard()
}
function checkLab1(){
 saveLab1();let s=load("lab1",{}),score=0,notes=[];
 if(s.lab1Indicator==="ความถูกต้องของการปฏิบัติ CPR")score++;else notes.push("Indicator ต้องสะท้อน performance โดยตรง");
 if(s.lab1Evidence==="คะแนนการปฏิบัติ")score++;else notes.push("Evidence ต้องตรงกับทักษะที่ต้องการประเมิน");
 if(s.lab1Instrument==="Performance checklist")score++;else notes.push("Performance ควรใช้เครื่องมือที่สังเกตการปฏิบัติ");
 if(s.lab1Claim==="NOT SUFFICIENT")score++;else notes.push("Satisfaction ไม่เพียงพอสำหรับสรุป performance");
 lab1Feedback.innerHTML='<div class="'+(score===4?'good':'note')+'"><strong>'+(score===4?'✓ เชื่อมโยงได้ถูกต้อง':'ทบทวนการเชื่อมโยง')+'</strong><br>Alignment score '+score+'/4'+(notes.length?'<br>'+notes.join('<br>'):'<br>EQ → Indicator → Evidence → Instrument สอดคล้องกัน')+'<div class="micro-review"><b>Key idea:</b> ถ้าโจทย์ถาม performance หลักฐานและเครื่องมือต้องสังเกตการปฏิบัติจริง ไม่ใช่ใช้ satisfaction แทน</div></div>'; maybeCelebrate()
}


function renderIOC(){
 let s=load("ioc",{});
 iocTable.innerHTML='<div class="table-wrap"><table><thead><tr><th>Item</th><th>E1</th><th>E2</th><th>E3</th><th>E4</th><th>E5</th><th>ΣR</th><th>IOC</th><th>Decision</th></tr></thead><tbody>'+
 iocRows.map((r,i)=>'<tr><td>'+r.item+'</td>'+r.ratings.map(v=>'<td>'+v+'</td>').join('')+
 '<td><input aria-label="sum '+r.item+'" data-sum="'+i+'" inputmode="numeric" value="'+(s["sum"+i]??"")+'"></td>'+
 '<td><input aria-label="ioc '+r.item+'" data-ioc="'+i+'" inputmode="decimal" value="'+(s["ioc"+i]??"")+'"></td>'+
 '<td><select data-dec="'+i+'"><option value="">เลือก</option><option>RETAIN</option><option>REVIEW</option><option>REVISE</option><option>REMOVE</option></select></td></tr>').join('')+'</tbody></table></div>';
 iocRows.forEach((r,i)=>{let d=document.querySelector('[data-dec="'+i+'"]');d.value=s["dec"+i]??"";});
 document.querySelectorAll('[data-sum],[data-ioc],[data-dec]').forEach(e=>e.oninput=saveIOC);
 iocReason.value=s.reason??""; iocReason.oninput=saveIOC;
}
function saveIOC(){let s={reason:iocReason.value};iocRows.forEach((r,i)=>{s["sum"+i]=document.querySelector('[data-sum="'+i+'"]').value;s["ioc"+i]=document.querySelector('[data-ioc="'+i+'"]').value;s["dec"+i]=document.querySelector('[data-dec="'+i+'"]').value});save("ioc",s); if(getLearner())renderDashboard()}
function checkIOC(){saveIOC();let s=load("ioc",{}),correct=0; iocRows.forEach((r,i)=>{if(Number(s["sum"+i])===r.sum && Math.abs(Number(s["ioc"+i])-r.ioc)<.011)correct++});iocFeedback.innerHTML='<div class="'+(correct===5?'good':'note')+'"><strong>'+(correct===5?'✓ Calculation complete':'ลองตรวจอีกครั้ง')+'</strong><br>คำนวณถูก '+correct+'/5 ข้อ '+(correct<5?'ตรวจ ΣR ก่อน แล้วหารด้วยจำนวนผู้เชี่ยวชาญ 5 คน':'จากนี้ให้พิจารณา decision และเหตุผล ไม่ใช่ดูตัวเลขเพียงอย่างเดียว')+'<div class="micro-review"><b>Key idea:</b> IOC เป็นหลักฐานด้าน content validity ไม่ใช่คำสั่งอัตโนมัติให้ลบหรือเก็บข้อคำถาม</div></div>'; maybeCelebrate()}

function renderReliability(){
 const sc=[["a","Multi-item Likert scale"],["b","Dichotomous 0/1 knowledge test"],["c","Multiple assessors scoring performance"],["d","Same instrument at two time points"]];
 reliabilityScenarios.innerHTML=sc.map(([id,t])=>'<label>'+t+'<select id="m_'+id+'"><option value="">เลือก</option>'+Object.values(methodKey).map(x=>'<option>'+x+'</option>').join('')+'</select></label>').join('');
 let s=load("rel",{});
 ["a","b","c","d"].forEach(id=>{document.getElementById("m_"+id).value=s["m_"+id]??"";document.getElementById("m_"+id).onchange=saveRel});
 ["relPrediction","relPredictionReason","alphaMeaning","alphaLimit","suspectItem","suspectReason","deleteI3","conflictReason","mysteryDecision","mysteryReason","finalDecision","finalEvidence1","finalEvidence2","finalRisk","finalAction"].forEach(id=>{let el=document.getElementById(id);if(el){el.value=s[id]??"";el.oninput=saveRel;el.onchange=saveRel}});
}
function saveRel(){
 let s={};
 ["a","b","c","d"].forEach(id=>s["m_"+id]=document.getElementById("m_"+id).value);
 ["relPrediction","relPredictionReason","alphaMeaning","alphaLimit","suspectItem","suspectReason","deleteI3","conflictReason","mysteryDecision","mysteryReason","finalDecision","finalEvidence1","finalEvidence2","finalRisk","finalAction"].forEach(id=>{let el=document.getElementById(id);if(el)s[id]=el.value});
 save("rel",s); if(getLearner())renderDashboard()
}
function checkReliabilityMethods(){
 saveRel();let s=load("rel",{}),c=0;
 ["a","b","c","d"].forEach(id=>{if(s["m_"+id]===methodKey[id])c++});
 methodFeedback.innerHTML='<div class="'+(c===4?'good':'note')+'">เลือกถูก '+c+'/4 สถานการณ์ — ต้องเลือกวิธีให้ตรงกับชนิดเครื่องมือและข้อมูลก่อนอ่านค่าความเที่ยง</div>'
}
function checkReliabilityChallenge(){
 saveRel();let s=load("rel",{});
 let score=0,notes=[];
 if(s.suspectItem==="I3"){score++;} else notes.push("ตรวจ item-total correlation และ alpha if item deleted อีกครั้ง");
 if(s.deleteI3==="DO NOT DELETE YET"||s.deleteI3==="NOT ENOUGH EVIDENCE"){score++;} else notes.push("อย่าตัดสินลบข้อคำถามจาก alpha อย่างเดียว");
 if(s.mysteryDecision==="DISAGREE"||s.mysteryDecision==="NOT ENOUGH EVIDENCE"){score++;} else notes.push("alpha สูงไม่ใช่หลักฐานยืนยัน validity ทั้งหมด");
 const required=["alphaMeaning","alphaLimit","suspectReason","conflictReason","mysteryReason","finalDecision","finalEvidence1","finalEvidence2","finalRisk","finalAction"];
 let filled=required.filter(k=>(s[k]||"").trim().length>=8).length;
 if(filled>=8)score++;
 alphaFeedback.innerHTML='<div class="'+(score>=3?'good':'note')+'"><strong>'+(score>=3?'Evidence-supported reasoning':'Needs stronger evidence')+'</strong><br>Challenge score '+score+'/4'+(notes.length?'<br>'+notes.join('<br>'):'<br>เหตุผลมีทิศทางสอดคล้องกับการใช้หลักฐานหลายแหล่ง')+'<div class="micro-review"><b>Key idea:</b> Reliability evidence และ validity evidence ตอบคำถามคนละด้าน จึงต้องอ่านร่วมกันก่อนตัดสินใจ</div></div>'; maybeCelebrate()
}

function renderStats(){
 statsDataEl=document.getElementById("statsData");statsDataEl.innerHTML='<div class="table-wrap"><table><thead><tr><th>Learner</th><th>Pre</th><th>Post</th></tr></thead><tbody>'+statsData.map((r,i)=>'<tr><td>'+(i+1)+'</td><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')+'</tbody></table></div>';
 let s=load("stats",{});["preMean","preSD","postMean","postSD","meanChange","statResult","statInterpret","statLimit","causalDecision","causalReason"].forEach(id=>{document.getElementById(id).value=s[id]??"";document.getElementById(id).oninput=saveStats});
}
function saveStats(){let s={};["preMean","preSD","postMean","postSD","meanChange","statResult","statInterpret","statLimit","causalDecision","causalReason"].forEach(id=>s[id]=document.getElementById(id).value);save("stats",s); if(getLearner())renderDashboard()}
function near(v,t,tol=.03){return Math.abs(Number(v)-t)<=tol}
function checkStats(){saveStats();let s=load("stats",{});let c=0;if(near(s.preMean,6,.01))c++;if(near(s.preSD,1.13,.04))c++;if(near(s.postMean,7.92,.04))c++;if(near(s.postSD,.79,.04))c++;if(near(s.meanChange,1.92,.04))c++;let causalOK=(s.causalDecision==='OVERSTATED'||s.causalDecision==='NOT ENOUGH EVIDENCE');statsFeedback.innerHTML='<div class="'+(c===5&&causalOK?'good':'note')+'"><strong>'+(c===5&&causalOK?'✓ Evidence-boundary respected':'ทบทวนข้อมูลและขอบเขตข้อสรุป')+'</strong><br>ค่าพรรณนาถูก '+c+'/5 ค่า'+(c===5?'':' — ตรวจ mean และ sample SD อีกครั้ง')+'<br>Causal reasoning: '+(causalOK?'ผ่าน — ไม่สรุปเหตุเกินหลักฐาน':'ทบทวน Evaluation Design และ alternative explanations')+'<div class="micro-review"><b>Key idea:</b> pre–post change แสดงการเปลี่ยนแปลง แต่ยังไม่เพียงพอที่จะยืนยัน causal effect ของโปรแกรม</div></div>'; maybeCelebrate()}


function renderLab5(){
 let s=load("lab5",{});
 ["lab5Fact","lab5Interpret","lab5Judgment","lab5Recommendation","lab5Missing","lab5Need"].forEach(id=>{
   let el=document.getElementById(id); if(!el)return; el.value=s[id]??""; el.oninput=saveLab5;
 });
}
function saveLab5(){let s={};["lab5Fact","lab5Interpret","lab5Judgment","lab5Recommendation","lab5Missing","lab5Need"].forEach(id=>s[id]=document.getElementById(id).value);save("lab5",s); if(getLearner())renderDashboard()}
function checkLab5(){
 saveLab5();let s=load("lab5",{}),fields=["lab5Fact","lab5Interpret","lab5Judgment","lab5Recommendation","lab5Missing","lab5Need"];
 let filled=fields.filter(k=>(s[k]||"").trim().length>=12).length;
 lab5Feedback.innerHTML='<div class="'+(filled===6?'good':'note')+'"><strong>'+(filled===6?'✓ Reasoning ladder complete':'เติมเหตุผลให้ครบทุกขั้น')+'</strong><br>Reasoning components completed '+filled+'/6'+(filled===6?'<br>ตรวจต่อว่า Recommendation เชื่อมกับ Judgment และไม่เดาสาเหตุเกินหลักฐาน':'<br>เติม Fact → Interpretation → Judgment → Recommendation และ Missing Evidence ให้ครบ')+'<div class="micro-review"><b>Key idea:</b> อย่ากระโดดจาก Fact ไป Recommendation โดยข้าม Interpretation และ Judgment</div></div>'; maybeCelebrate()
}

function resetLab(k){if(confirm("ล้างคำตอบของ Lab นี้ในอุปกรณ์นี้?")){localStorage.removeItem(P+k);localStorage.removeItem(P+"completion");localStorage.removeItem(P+"celebrated");location.reload()}}
function evidenceText(){
 let learner=getLearner()||{},l1=load("lab1",{}),i=load("ioc",{}),r=load("rel",{}),s=load("stats",{}),l5=load("lab5",{});
 return '# HED3505 Evaluation Analysis Lab Evidence\n\nStudent ID: '+(learner.student_id??"-")+'\nDisplay Name: '+(learner.display_name??"-")+'\nGenerated: '+new Date().toISOString()+'\n\n'
 +'## LAB 1 Blueprint\nIndicator: '+(l1.lab1Indicator??"-")+'\nEvidence: '+(l1.lab1Evidence??"-")+'\nInstrument: '+(l1.lab1Instrument??"-")+'\nConstruct challenge: '+(l1.lab1Claim??"-")+'\nReasoning: '+(l1.lab1Reason??"-")+'\n\n'
 +'## LAB 2 IOC\n'+iocRows.map((x,n)=>'- '+x.item+': ΣR='+(i["sum"+n]??"-")+', IOC='+(i["ioc"+n]??"-")+', Decision='+(i["dec"+n]??"-")).join('\n')+'\nReasoning: '+(i.reason??"-")+'\n\n'
 +'## LAB 3 Reliability Investigation\nPrediction: '+(r.relPrediction??"-")+'\nMeaning: '+(r.alphaMeaning??"-")+'\nLimitation: '+(r.alphaLimit??"-")+'\nSuspect item: '+(r.suspectItem??"-")+'\nConflict decision: '+(r.deleteI3??"-")+'\nMystery decision: '+(r.mysteryDecision??"-")+'\nFinal decision: '+(r.finalDecision??"-")+'\nEvidence 1: '+(r.finalEvidence1??"-")+'\nEvidence 2: '+(r.finalEvidence2??"-")+'\nRisk: '+(r.finalRisk??"-")+'\nNext action: '+(r.finalAction??"-")+'\n\n'
 +'## LAB 4 Statistics\nPre Mean: '+(s.preMean??"-")+'\nPre SD: '+(s.preSD??"-")+'\nPost Mean: '+(s.postMean??"-")+'\nPost SD: '+(s.postSD??"-")+'\nMean change: '+(s.meanChange??"-")+'\nResult: '+(s.statResult??"-")+'\nInterpretation: '+(s.statInterpret??"-")+'\nLimitation: '+(s.statLimit??"-")+'\nCausal decision: '+(s.causalDecision??"-")+'\nAlternative evidence: '+(s.causalReason??"-")+'\n\n'
 +'## LAB 5 Judgment\nFact: '+(l5.lab5Fact??"-")+'\nInterpretation: '+(l5.lab5Interpret??"-")+'\nJudgment: '+(l5.lab5Judgment??"-")+'\nRecommendation: '+(l5.lab5Recommendation??"-")+'\nMissing evidence: '+(l5.lab5Missing??"-")+'\nEvidence needed: '+(l5.lab5Need??"-")+'\n';
}
function renderEvidence(){evidencePreview.textContent=evidenceText()}
async function copyEvidence(){let t=evidenceText();try{await navigator.clipboard.writeText(t);alert("คัดลอกแล้ว")}catch(e){renderEvidence()}}
function downloadEvidence(){let t=evidenceText(),b=new Blob([t],{type:"text/markdown;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="HED3505_Evaluation_Analysis_Lab_Evidence.md";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
renderLab1();renderIOC();renderReliability();renderStats();renderLab5();bootLearnerGate();