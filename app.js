const approvedCase = {
  students:"1,800", personnel:"108", physicalActivity:"59% sufficient / 41% insufficient",
  overweight:"24.8%", sugaryDrink:"37%", sleep:"44%", stress:"22%", vaping:"11%",
  cprKnowledge:"81%", cprPerformance:"38%", satisfaction:"4.3/5"
};

const modules = [
  {
    id:1,title:"จากปัญหาสู่สิ่งที่ต้องประเมิน",path:"Problem → Indicator",artifact:"WS1 Assessment Planning",
    steps:[
      ["Check-in","ข้อมูลหนึ่งตัวเท่ากับตัวชี้วัดที่ดีเสมอหรือไม่?",["ใช่","ไม่ใช่","ขึ้นอยู่กับวัตถุประสงค์"],"ตัวชี้วัดต้องเชื่อมกับประเด็นและคำถามการประเมิน ไม่ใช่เพียงมีตัวเลขให้ใช้"],
      ["Pre-test","ข้อใดเป็น ‘ปัญหา/ประเด็น’ มากที่สุด?",["นักเรียน 1,800 คน","นอนน้อยกว่า 7 ชม. 44%","ควรเพิ่มกิจกรรมพักผ่อน"],"ข้อมูล 44% เป็นหลักฐานของประเด็น ส่วนข้อเสนอให้เพิ่มกิจกรรมยังเป็น recommendation"],
      ["Live Poll","ข้อมูลใดควรนำไปตั้งคำถามประเมินต่อ?",["PA insufficient 41%","บุคลากร 108","ความพึงพอใจ 4.3/5"],"ไม่มีคำตอบเดียวโดยอัตโนมัติ ต้องขึ้นกับคำถามและสิ่งที่ต้องการประเมิน"],
      ["Class Result","ถ้าคนในชั้นเลือกไม่เหมือนกัน สิ่งใดสำคัญที่สุด?",["เสียงข้างมาก","เหตุผลที่เชื่อมกับหลักฐาน","เลือกตัวเลขสูงสุด"],"การประเมินต้องอาศัยเหตุผลและความสอดคล้อง ไม่ใช่เพียงเสียงส่วนใหญ่"],
      ["Case Card","เลือกหลักฐานหนึ่งรายการเพื่อใช้ต่อ",["Sleep <7h 44%","High stress 22%","Sugary drink ≥5d 37%"],"รายการทั้งหมดเป็น approved teaching-case data"],
      ["Indicator Challenge","ตัวชี้วัดที่ดีควรมีลักษณะใด?",["วัดได้และสัมพันธ์กับประเด็น","ฟังดูสำคัญ","มีตัวเลขเยอะ"],"ตัวชี้วัดควรสะท้อนสิ่งที่ต้องการประเมินและมีวิธีได้มาของข้อมูลที่ชัด"],
      ["Evidence vs Assumption","ข้อใดเป็น assumption?",["Sleep <7h = 44%","การนอนน้อยเกิดจากการใช้มือถือ","Students = 1,800"],"สาเหตุเรื่องมือถือยังไม่มีหลักฐานใน baseline"],
      ["Decision Point","ก่อนสรุปว่าปัญหาควรถูกแก้ด้วยมาตรการหนึ่ง เราควรทำอะไร?",["หา evidence เพิ่ม","สรุปจากเปอร์เซ็นต์ทันที","เลือก recommendation ที่ง่าย"],"ต้องตรวจหลักฐานเพิ่มเติมและรักษาความไม่แน่นอน"],
      ["WS1 Builder","เขียน Problem → Indicator → Evidence Need ในช่องบันทึกด้านล่าง",["พร้อมเขียน WS1"],"บันทึกต้องแยก FACT / ASSUMPTION และระบุสิ่งที่ยังไม่ควรสรุป"],
      ["Exit Ticket","โมดูลถัดไปต้องตอบคำถามใด?",["จะวัด indicator นี้ด้วยอะไร?","indicator ไหนสูงสุด?","ใครควรได้คะแนน?"],"Module 2 จะเปลี่ยน Indicator → Instrument"]
    ]
  },
  {
    id:2,title:"จากตัวชี้วัดสู่เครื่องมือประเมิน",path:"Indicator → Instrument",artifact:"WS2 Instrument Blueprint",
    steps:[
      ["Check-in","เครื่องมือควรถูกเลือกจากอะไรเป็นอันดับแรก?",["ตัวชี้วัด/construct","ความสะดวก","รูปแบบที่สวย"],"เริ่มจากสิ่งที่ต้องการวัด แล้วจึงเลือกวิธีและเครื่องมือ"],
      ["Pre-test","ถ้าต้องการวัด performance ควรพึ่ง self-report อย่างเดียวหรือไม่?",["ควร","ไม่ควร","ไม่แน่ใจ"],"performance มักต้องการหลักฐานการปฏิบัติหรือการสังเกตที่เหมาะสม"],
      ["Live Poll","Indicator เดียวควรใช้เครื่องมือชนิดเดียวเสมอหรือไม่?",["ใช่","ไม่ใช่"],"อาจใช้หลายแหล่งหลักฐานเพื่อ triangulate ได้"],
      ["Class Result","เมื่อกลุ่มเลือกเครื่องมือต่างกัน ควรเปรียบเทียบอะไร?",["ความสอดคล้องกับ construct","จำนวนหน้า","สีของแบบฟอร์ม"],"ความสอดคล้องกับ construct และคุณภาพ evidence สำคัญกว่า"],
      ["Instrument Match","ข้อใดเป็นคู่ที่สมเหตุผลที่สุด?",["Performance → observation checklist","Stress → attendance count","Sugary drink → CPR checklist"],"เครื่องมือต้องสอดคล้องกับสิ่งที่ต้องการวัด"],
      ["Item Design Challenge","ข้อคำถามที่ดีควรหลีกเลี่ยงอะไร?",["ความกำกวมและถามสองเรื่องในข้อเดียว","ภาษาชัดเจน","เกณฑ์ตอบชัด"],"ambiguity และ double-barreled items ลดคุณภาพข้อมูล"],
      ["Evidence vs Assumption","การออกแบบ scoring rule ก่อนเก็บข้อมูลมีประโยชน์อย่างไร?",["ลดความกำกวมในการตีความ","ทำให้ผลดีขึ้นอัตโนมัติ","แทน validity ได้"],"scoring rule ชัดช่วยความสม่ำเสมอ แต่ไม่แทนหลักฐาน validity"],
      ["Decision Point","ถ้าเครื่องมือสะดวกแต่ไม่ตรง construct ควรทำอย่างไร?",["ปรับหรือเปลี่ยนเครื่องมือ","ใช้ต่อเพราะสะดวก","เปลี่ยน indicator ให้เข้ากับเครื่องมือ"],"เครื่องมือต้องตามวัตถุประสงค์ ไม่ใช่กลับกัน"],
      ["WS2 Builder","เขียน Indicator → Construct → Instrument → Item → Scoring → Evidence",["พร้อมเขียน WS2"],"ระบุอย่างน้อยหนึ่ง design risk"],
      ["Exit Ticket","ก่อนเชื่อข้อมูลจากเครื่องมือ เราต้องตรวจอะไรต่อ?",["คุณภาพเครื่องมือ","จำนวนผู้ตอบอย่างเดียว","สีของแบบประเมิน"],"Module 3 ตรวจ Content Validity → IOC → Reliability → Revision"]
    ]
  },
  {
    id:3,title:"คุณภาพของเครื่องมือประเมิน",path:"Content Validity → IOC → Reliability → Revision",artifact:"WS3 Instrument Quality Record",
    steps:[
      ["Check-in","เครื่องมือที่ดูดีถือว่ามีคุณภาพแล้วหรือไม่?",["ใช่","ไม่ใช่"],"ต้องมี evidence ด้าน validity/reliability ที่เหมาะสม"],
      ["Pre-test","Content validity ถามคำถามหลักว่าอะไร?",["ข้อคำถามครอบคลุมสิ่งที่ตั้งใจวัดหรือไม่","ตอบเร็วหรือไม่","แบบฟอร์มสวยหรือไม่"],"Content validity เน้นความสอดคล้องของเนื้อหากับ construct/objective"],
      ["Live Poll","ก่อนเห็นผลผู้เชี่ยวชาญ เราควรตัดสิน item จาก intuition อย่างเดียวหรือไม่?",["ควร","ไม่ควร"],"intuition อาจใช้ตั้งข้อสังเกต แต่การตัดสินควรมี evidence"],
      ["Class Result","ความเห็นผู้เชี่ยวชาญต่างกันแปลว่าอะไร?",["ต้องพิจารณาหลักฐานและเหตุผลเพิ่ม","item ผิดเสมอ","เลือกเสียงข้างมากอย่างเดียว"],"ความต่างเป็นสัญญาณให้ตรวจ alignment และเหตุผล"],
      ["Content Validity","ข้อใดควรตรวจ?",["Item ↔ Objective/Indicator","Item ↔ สีหน้าเว็บ","Item ↔ จำนวนหน้า"],"ตรวจว่า item แทนสิ่งที่ตั้งใจวัดจริงหรือไม่"],
      ["IOC Lab","SIMULATED expert ratings: +1, +1, 0. IOC เท่าไร?",["0.67","1.00","0.33"],"IOC = (1+1+0)/3 = 0.67 — ค่านี้เป็น instructional example ไม่ใช่ข้อมูลจริงของโรงเรียน"],
      ["Reliability Check","High reliability หมายความว่า valid เสมอหรือไม่?",["ใช่","ไม่ใช่"],"ความสม่ำเสมอสูงไม่รับประกันว่าเครื่องมือวัด construct ที่ตั้งใจ"],
      ["Decision Point","เมื่อ evidence ยังไม่ชัด ควรเลือกสถานะใด?",["REVIEW / REVISE","RETAIN เสมอ","REMOVE เสมอ"],"ใช้ RETAIN / REVIEW / REVISE / REMOVE ตาม evidence และเหตุผล"],
      ["WS3 Builder","บันทึก validity, IOC, reliability และ revision decision",["พร้อมเขียน WS3"],"ระบุชัดว่าข้อมูลฝึกเป็น INSTRUCTIONAL / SIMULATED DATA"],
      ["Exit Ticket","IOC ผ่านแล้วเพียงพอจะสรุปว่าเครื่องมือมีคุณภาพทุกด้านหรือไม่?",["พอ","ไม่พอ"],"ยังต้องพิจารณาหลักฐานคุณภาพด้านอื่นและบริบทการใช้"]
    ]
  },
  {
    id:4,title:"การวิเคราะห์และแปลผลข้อมูล",path:"Data → Interpretation → Decision",artifact:"WS4 Interpretation & Decision Matrix",
    steps:[
      ["Check-in","เครื่องมือมีคุณภาพแล้ว แปลว่าการตีความจะถูกต้องอัตโนมัติหรือไม่?",["ใช่","ไม่ใช่"],"ยังต้องแยก data, finding, interpretation และ decision"],
      ["Pre-test","‘CPR performance pass 38%’ เป็นอะไร?",["Data/Finding","สาเหตุ","Recommendation"],"เป็นข้อมูล/ผลที่สังเกตได้ ไม่ใช่คำอธิบายเชิงสาเหตุ"],
      ["Live Poll","ข้อใด overclaim มากที่สุด?",["performance ต่ำเพราะฝึกน้อย","performance pass 38%","ต้องหา evidence เพิ่ม"],"สาเหตุเรื่องฝึกน้อยยังไม่มีหลักฐานใน baseline"],
      ["Class Result","ความมั่นใจในการตัดสินควรขึ้นกับอะไร?",["คุณภาพและความครบของ evidence","ความรู้สึก","จำนวนคำในรายงาน"],"ความมั่นใจควรสัมพันธ์กับ evidence และข้อจำกัด"],
      ["Data Pattern Card","CPR knowledge 81% เทียบ performance 38% บอกอะไรแน่นอน?",["ผลสองตัวต่างกัน","การสอนล้มเหลว","นักเรียนไม่ตั้งใจ"],"เราบอกได้ว่าผลต่างกัน แต่ยังระบุสาเหตุไม่ได้"],
      ["Contradictory Evidence","เมื่อหลักฐานชี้คนละทิศ ควรทำอะไร?",["triangulate / หา evidence เพิ่ม","เลือกตัวเลขที่ชอบ","เฉลี่ยแล้วจบ"],"contradiction เป็นเหตุให้ตรวจแหล่งข้อมูลและคำอธิบายทางเลือก"],
      ["Triangulation Move","หลักฐานเพิ่มแบบใดช่วยได้?",["observation + scoring process + context","สีเครื่องมือ","ชื่อไฟล์"],"เพิ่ม evidence ที่ช่วยแยก competing explanations"],
      ["Decision Point","ข้อสรุปใดปลอดภัยกว่า?",["ต้องตรวจ performance training/evidence เพิ่ม","สาเหตุคือขาดความรู้","โปรแกรมไม่มีคุณภาพ"],"เลือกภาษาที่รักษาความไม่แน่นอน"],
      ["WS4 Builder","เขียน Data → Finding → Interpretation → Alternative Explanation → Decision",["พร้อมเขียน WS4"],"เพิ่ม claim ที่ ‘ยังพูดไม่ได้’ อย่างน้อยหนึ่งข้อ"],
      ["Exit Ticket","Module 5 จะนำสิ่งใดไปใช้?",["interpretation + uncertainty + evidence need","ตัวเลขอย่างเดียว","recommendation อย่างเดียว"],"สิ่งเหล่านี้จะกลายเป็น decision logic ใน evaluation plan"]
    ]
  },
  {
    id:5,title:"การสร้างแผนประเมินผลแบบบูรณาการ",path:"Integrated Evidence → Evaluation Plan",artifact:"WS5 Integrated Evaluation Plan",
    steps:[
      ["Check-in","WS5 ควรเริ่มใหม่ทั้งหมดหรือใช้ WS1–WS4?",["ใช้ WS1–WS4","เริ่มใหม่"],"Module 5 เป็นการบูรณาการ ไม่ใช่กิจกรรมแยกขาด"],
      ["Pre-test","ลำดับใดสอดคล้องที่สุด?",["Question → Indicator → Instrument → Evidence → Decision","Instrument → Question → Score","Decision → Data → Indicator"],"เริ่มจาก evaluation question แล้วสร้าง evidence chain"],
      ["Live Poll","แผน ‘ครบช่อง’ เท่ากับแผน ‘สอดคล้อง’ หรือไม่?",["เท่ากัน","ไม่เท่ากัน"],"ความครบไม่รับประกัน alignment"],
      ["Class Result","จุดอ่อนของแผนควรถูกซ่อนหรือระบุ?",["ระบุ","ซ่อน"],"ข้อจำกัดและ uncertainty เป็นส่วนหนึ่งของแผนที่รับผิดชอบ"],
      ["Alignment Card","คู่ใดต้องเชื่อมกันโดยตรง?",["Question ↔ Indicator ↔ Instrument","สี ↔ คะแนน","ชื่อไฟล์ ↔ outcome"],"traceability เป็นแกนของ evaluation plan"],
      ["Evidence Quality Gate","ถ้า evidence quality ยังต่ำควรทำอย่างไร?",["จำกัด claim และวางแผนเก็บเพิ่ม","สรุปเต็มที่","ละข้อจำกัด"],"decision rule ต้องสะท้อนคุณภาพ evidence"],
      ["Decision Rule","ข้อใดเป็น decision rule ที่รับผิดชอบกว่า?",["ตัดสินเมื่อ evidence ที่กำหนดครบและสอดคล้อง","ตัดสินทันทีเมื่อมีตัวเลข","ใช้ความเห็นผู้สอนอย่างเดียว"],"ต้องกำหนด evidence requirement และข้อจำกัด"],
      ["Decision Point","เมื่อ evidence ขัดกัน ควรทำอย่างไรในแผน?",["บันทึก uncertainty และ evidence need","ลบค่าที่ไม่ชอบ","เลือกค่าที่สูง"],"contradiction ต้องถูกจัดการอย่างโปร่งใส"],
      ["WS5 Builder","เขียน Evaluation Question → Indicator → Instrument → Evidence Quality → Data → Interpretation → Decision",["พร้อมเขียน WS5"],"เชื่อมกลับไปยัง WS1–WS4"],
      ["Exit Ticket","จุดอ่อนหนึ่งจุดของแผนคุณคืออะไร?",["บันทึกใน notes ด้านล่าง"],"ใช้คำตอบนี้เป็นแผนปรับปรุง evaluation cycle ถัดไป"]
    ]
  }
];

let currentModule=0,currentStep=0;
const moduleState=modules.map(()=>({selected:{},notes:""}));

function state(){ return moduleState[currentModule]; }

const $=s=>document.querySelector(s);
const nav=$("#moduleNav");
const intro=$("#moduleIntro");
const interaction=$("#interaction");

modules.forEach((m,i)=>{
  const b=document.createElement("button");
  b.className="module-btn";
  b.type="button";
  b.textContent="M"+m.id+" · "+m.path;
  b.onclick=()=>{
    state().notes=$("#notes").value;
    currentModule=i;
    currentStep=0;
    $("#notes").value=state().notes;
    $("#stepStatus").textContent="";
    $("#saveStatus").textContent="";
    render();
  };
  nav.appendChild(b);
});

function render(){
  const m=modules[currentModule];
  const step=m.steps[currentStep];
  const selected=state().selected;

  [...nav.children].forEach((b,i)=>{
    b.setAttribute("aria-current",i===currentModule?"true":"false");
  });

  intro.innerHTML=
    '<p class="eyebrow">MODULE '+m.id+'</p>'+
    '<h2>'+m.title+'</h2>'+
    '<p><strong>'+m.path+'</strong></p>'+
    '<p class="muted">Progressive artifact: '+m.artifact+'</p>';

  $("#stepTitle").textContent=step[0];
  $("#progressText").textContent=(currentStep+1)+" / "+m.steps.length;
  $("#progressBar").style.width=((currentStep+1)/m.steps.length*100)+"%";

  const track=document.querySelector(".progress-track");
  track.setAttribute("aria-valuemax",String(m.steps.length));
  track.setAttribute("aria-valuenow",String(currentStep+1));

  interaction.innerHTML=
    '<h3>'+step[1]+'</h3>'+
    '<div class="option-list" id="opts"></div>'+
    '<div id="reveal" class="reveal hidden"></div>';

  step[2].forEach(opt=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="option";
    b.textContent=opt;
    b.setAttribute("aria-pressed","false");
    b.onclick=()=>{
      selected[currentStep]=opt;
      [...$("#opts").children].forEach(x=>{
        x.classList.remove("selected");
        x.setAttribute("aria-pressed","false");
      });
      b.classList.add("selected");
      b.setAttribute("aria-pressed","true");
      const r=$("#reveal");
      r.textContent=step[3];
      r.classList.remove("hidden");
      $("#stepStatus").textContent="";
    };
    $("#opts").appendChild(b);
  });

  if(selected[currentStep]){
    [...$("#opts").children].forEach(b=>{
      if(b.textContent===selected[currentStep]){
        b.classList.add("selected");
        b.setAttribute("aria-pressed","true");
      }
    });
    $("#reveal").textContent=step[3];
    $("#reveal").classList.remove("hidden");
  }

  $("#prevBtn").disabled=currentStep===0;
  $("#nextBtn").textContent=currentStep===m.steps.length-1?"จบโมดูล":"ถัดไป";
}

$("#prevBtn").onclick=()=>{
  state().notes=$("#notes").value;
  if(currentStep>0){
    currentStep--;
    $("#stepStatus").textContent="";
    render();
  }
};

$("#nextBtn").onclick=()=>{
  const m=modules[currentModule];
  state().notes=$("#notes").value;

  if(!state().selected[currentStep]){
    $("#stepStatus").textContent="กรุณาเลือก/ยืนยันการตัดสินใจก่อนกดถัดไป";
    return;
  }

  $("#stepStatus").textContent="";
  if(currentStep<m.steps.length-1){
    currentStep++;
    render();
  }else{
    $("#saveStatus").textContent=
      "ครบกิจกรรม Module "+m.id+" แล้ว — บันทึก reasoning และ export "+m.artifact+" ได้ด้านล่าง";
  }
};

$("#notes").addEventListener("input",()=>{
  state().notes=$("#notes").value;
});

function summary(){
  const m=modules[currentModule];
  state().notes=$("#notes").value;

  const lines=[
    "# HED3505 Learning Evidence",
    "",
    "Module: "+m.id+" — "+m.title,
    "Path: "+m.path,
    "Artifact: "+m.artifact,
    "",
    "## Interaction decisions"
  ];

  m.steps.forEach((s,i)=>{
    lines.push("- "+s[0]+": "+(state().selected[i]||"PENDING"));
  });

  lines.push(
    "",
    "## Reasoning / Evidence Notes",
    state().notes||"PENDING",
    "",
    "## Evidence Rule",
    "Use approved case evidence only. Simulated IOC/Reliability data must be labeled INSTRUCTIONAL / SIMULATED DATA."
  );

  return lines.join("\n");
}

$("#copyBtn").onclick=async()=>{
  try{
    await navigator.clipboard.writeText(summary());
    $("#saveStatus").textContent="คัดลอกสรุปแล้ว";
  }catch{
    $("#saveStatus").textContent="ไม่สามารถคัดลอกอัตโนมัติได้ โปรดใช้การบันทึกเป็น Markdown";
  }
};

$("#downloadBtn").onclick=()=>{
  const blob=new Blob([summary()],{type:"text/markdown;charset=utf-8"});
  const a=document.createElement("a");
  const url=URL.createObjectURL(blob);
  a.href=url;
  a.download="HED3505-Module-"+modules[currentModule].id+"-Evidence.md";
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
  $("#saveStatus").textContent="สร้างไฟล์ Markdown แล้ว";
};

$("#notes").value=state().notes;
render();
