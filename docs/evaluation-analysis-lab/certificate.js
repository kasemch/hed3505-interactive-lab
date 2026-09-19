const P="hed3505_eval_lab_v1_";
function load(k,f=null){try{return JSON.parse(localStorage.getItem(P+k))??f}catch(e){return f}}
function formatThaiDate(iso){
  if(!iso)return "-";
  try{return new Intl.DateTimeFormat("th-TH",{day:"numeric",month:"long",year:"numeric"}).format(new Date(iso+"T00:00:00"))}
  catch(e){return iso}
}
const learner=load("learner",{}),rec=load("completion",null);
if(!learner||!rec){
  document.body.innerHTML='<main style="font-family:system-ui;padding:30px;max-width:720px;margin:auto"><h1>Certificate ยังไม่พร้อม</h1><p>กรุณากลับไปทำ HED3505 Evaluation Analysis Lab ให้ครบทั้ง 5 LAB ก่อน</p><p><a href="./">กลับไปยัง LAB</a></p></main>';
}else{
  document.getElementById("certName").textContent=learner.display_name||"-";
  document.getElementById("certStudentId").textContent=learner.student_id||"-";
  document.getElementById("certDate").textContent=formatThaiDate(rec.completion_date);
  document.getElementById("certId").textContent=rec.certificate_id||"-";
}
