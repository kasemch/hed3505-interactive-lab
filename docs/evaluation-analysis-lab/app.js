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
function load(k,f={}){try{return JSON.parse(localStorage.getItem(P+k))??f}catch(e){return f}}
function save(k,v){localStorage.setItem(P+k,JSON.stringify(v))}
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]))}
document.querySelectorAll("[data-show]").forEach(b=>b.onclick=()=>{document.querySelectorAll(".panel").forEach(x=>x.classList.add("hidden"));document.getElementById(b.dataset.show).classList.remove("hidden")});

function renderLab1(){
 let s=load("lab1",{});
 ["lab1Indicator","lab1Evidence","lab1Instrument","lab1Claim","lab1Reason"].forEach(id=>{
   let el=document.getElementById(id); if(!el)return;
   el.value=s[id]??"";
   el.oninput=saveLab1; el.onchange=saveLab1;
 });
}
function saveLab1(){
 let s={};["lab1Indicator","lab1Evidence","lab1Instrument","lab1Claim","lab1Reason"].forEach(id=>s[id]=document.getElementById(id).value);save("lab1",s)
}
function checkLab1(){
 saveLab1();let s=load("lab1",{}),score=0,notes=[];
 if(s.lab1Indicator==="ความถูกต้องของการปฏิบัติ CPR")score++;else notes.push("Indicator ต้องสะท้อน performance โดยตรง");
 if(s.lab1Evidence==="คะแนนการปฏิบัติ")score++;else notes.push("Evidence ต้องตรงกับทักษะที่ต้องการประเมิน");
 if(s.lab1Instrument==="Performance checklist")score++;else notes.push("Performance ควรใช้เครื่องมือที่สังเกตการปฏิบัติ");
 if(s.lab1Claim==="NOT SUFFICIENT")score++;else notes.push("Satisfaction ไม่เพียงพอสำหรับสรุป performance");
 lab1Feedback.innerHTML='<div class="'+(score===4?'good':'note')+'">Alignment score '+score+'/4'+(notes.length?'<br>'+notes.join('<br>'):'<br>EQ → Indicator → Evidence → Instrument สอดคล้องกัน')+'</div>'
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
function saveIOC(){let s={reason:iocReason.value};iocRows.forEach((r,i)=>{s["sum"+i]=document.querySelector('[data-sum="'+i+'"]').value;s["ioc"+i]=document.querySelector('[data-ioc="'+i+'"]').value;s["dec"+i]=document.querySelector('[data-dec="'+i+'"]').value});save("ioc",s)}
function checkIOC(){saveIOC();let s=load("ioc",{}),correct=0; iocRows.forEach((r,i)=>{if(Number(s["sum"+i])===r.sum && Math.abs(Number(s["ioc"+i])-r.ioc)<.011)correct++});iocFeedback.innerHTML='<div class="'+(correct===5?'good':'note')+'">คำนวณถูก '+correct+'/5 ข้อ '+(correct<5?'ตรวจ ΣR ก่อน แล้วหารด้วยจำนวนผู้เชี่ยวชาญ 5 คน':'จากนี้ให้พิจารณา decision และเหตุผล ไม่ใช่ดูตัวเลขเพียงอย่างเดียว')+'</div>'}

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
 save("rel",s)
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
 alphaFeedback.innerHTML='<div class="'+(score>=3?'good':'note')+'">Challenge score '+score+'/4'+(notes.length?'<br>'+notes.join('<br>'):'<br>เหตุผลมีทิศทางสอดคล้องกับการใช้หลักฐานหลายแหล่ง')+'<br><strong>Key idea:</strong> Reliability evidence และ validity evidence ตอบคำถามคนละด้าน</div>'
}

function renderStats(){
 statsDataEl=document.getElementById("statsData");statsDataEl.innerHTML='<div class="table-wrap"><table><thead><tr><th>Learner</th><th>Pre</th><th>Post</th></tr></thead><tbody>'+statsData.map((r,i)=>'<tr><td>'+(i+1)+'</td><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')+'</tbody></table></div>';
 let s=load("stats",{});["preMean","preSD","postMean","postSD","meanChange","statResult","statInterpret","statLimit","causalDecision","causalReason"].forEach(id=>{document.getElementById(id).value=s[id]??"";document.getElementById(id).oninput=saveStats});
}
function saveStats(){let s={};["preMean","preSD","postMean","postSD","meanChange","statResult","statInterpret","statLimit","causalDecision","causalReason"].forEach(id=>s[id]=document.getElementById(id).value);save("stats",s)}
function near(v,t,tol=.03){return Math.abs(Number(v)-t)<=tol}
function checkStats(){saveStats();let s=load("stats",{});let c=0;if(near(s.preMean,6,.01))c++;if(near(s.preSD,1.13,.04))c++;if(near(s.postMean,7.92,.04))c++;if(near(s.postSD,.79,.04))c++;if(near(s.meanChange,1.92,.04))c++;let causalOK=(s.causalDecision==='OVERSTATED'||s.causalDecision==='NOT ENOUGH EVIDENCE');statsFeedback.innerHTML='<div class="'+(c===5&&causalOK?'good':'note')+'">ค่าพรรณนาถูก '+c+'/5 ค่า'+(c===5?'':' — ตรวจ mean และ sample SD อีกครั้ง')+'<br>Causal reasoning: '+(causalOK?'ผ่าน — ไม่สรุปเหตุเกินหลักฐาน':'ทบทวน Evaluation Design และ alternative explanations')+'<br><strong>ข้อควรระวัง:</strong> pre–post change แสดงการเปลี่ยนแปลง แต่ยังไม่เพียงพอที่จะยืนยัน causal effect ของโปรแกรม</div>'}


function renderLab5(){
 let s=load("lab5",{});
 ["lab5Fact","lab5Interpret","lab5Judgment","lab5Recommendation","lab5Missing","lab5Need"].forEach(id=>{
   let el=document.getElementById(id); if(!el)return; el.value=s[id]??""; el.oninput=saveLab5;
 });
}
function saveLab5(){let s={};["lab5Fact","lab5Interpret","lab5Judgment","lab5Recommendation","lab5Missing","lab5Need"].forEach(id=>s[id]=document.getElementById(id).value);save("lab5",s)}
function checkLab5(){
 saveLab5();let s=load("lab5",{}),fields=["lab5Fact","lab5Interpret","lab5Judgment","lab5Recommendation","lab5Missing","lab5Need"];
 let filled=fields.filter(k=>(s[k]||"").trim().length>=12).length;
 lab5Feedback.innerHTML='<div class="'+(filled===6?'good':'note')+'">Reasoning components completed '+filled+'/6'+(filled===6?'<br>ตรวจต่อว่า Recommendation เชื่อมกับ Judgment และไม่เดาสาเหตุเกินหลักฐาน':'<br>เติม Fact → Interpretation → Judgment → Recommendation และ Missing Evidence ให้ครบ')+'</div>'
}

function resetLab(k){if(confirm("ล้างคำตอบของ Lab นี้ในอุปกรณ์นี้?")){localStorage.removeItem(P+k);location.reload()}}
function evidenceText(){
 let l1=load("lab1",{}),i=load("ioc",{}),r=load("rel",{}),s=load("stats",{}),l5=load("lab5",{});
 return '# HED3505 Evaluation Analysis Lab Evidence\n\n'
 +'## LAB 1 Blueprint\nIndicator: '+(l1.lab1Indicator??"-")+'\nEvidence: '+(l1.lab1Evidence??"-")+'\nInstrument: '+(l1.lab1Instrument??"-")+'\nConstruct challenge: '+(l1.lab1Claim??"-")+'\nReasoning: '+(l1.lab1Reason??"-")+'\n\n'
 +'## LAB 2 IOC\n'+iocRows.map((x,n)=>'- '+x.item+': ΣR='+(i["sum"+n]??"-")+', IOC='+(i["ioc"+n]??"-")+', Decision='+(i["dec"+n]??"-")).join('\n')+'\nReasoning: '+(i.reason??"-")+'\n\n'
 +'## LAB 3 Reliability Investigation\nPrediction: '+(r.relPrediction??"-")+'\nMeaning: '+(r.alphaMeaning??"-")+'\nLimitation: '+(r.alphaLimit??"-")+'\nSuspect item: '+(r.suspectItem??"-")+'\nConflict decision: '+(r.deleteI3??"-")+'\nMystery decision: '+(r.mysteryDecision??"-")+'\nFinal decision: '+(r.finalDecision??"-")+'\nEvidence 1: '+(r.finalEvidence1??"-")+'\nEvidence 2: '+(r.finalEvidence2??"-")+'\nRisk: '+(r.finalRisk??"-")+'\nNext action: '+(r.finalAction??"-")+'\n\n'
 +'## LAB 4 Statistics\nPre Mean: '+(s.preMean??"-")+'\nPre SD: '+(s.preSD??"-")+'\nPost Mean: '+(s.postMean??"-")+'\nPost SD: '+(s.postSD??"-")+'\nMean change: '+(s.meanChange??"-")+'\nResult: '+(s.statResult??"-")+'\nInterpretation: '+(s.statInterpret??"-")+'\nLimitation: '+(s.statLimit??"-")+'\nCausal decision: '+(s.causalDecision??"-")+'\nAlternative evidence: '+(s.causalReason??"-")+'\n\n'
 +'## LAB 5 Judgment\nFact: '+(l5.lab5Fact??"-")+'\nInterpretation: '+(l5.lab5Interpret??"-")+'\nJudgment: '+(l5.lab5Judgment??"-")+'\nRecommendation: '+(l5.lab5Recommendation??"-")+'\nMissing evidence: '+(l5.lab5Missing??"-")+'\nEvidence needed: '+(l5.lab5Need??"-")+'\n';
}
function renderEvidence(){evidencePreview.textContent=evidenceText()}
async function copyEvidence(){let t=evidenceText();try{await navigator.clipboard.writeText(t);alert("คัดลอกแล้ว")}catch(e){renderEvidence()}}
function downloadEvidence(){let t=evidenceText(),b=new Blob([t],{type:"text/markdown;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="HED3505_Evaluation_Analysis_Lab_Evidence.md";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
renderLab1();renderIOC();renderReliability();renderStats();renderLab5();