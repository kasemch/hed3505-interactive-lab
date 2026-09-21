import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const SUPABASE_URL="https://lztxpjsuzqvtgyasfnyj.supabase.co";
const SUPABASE_KEY="sb_publishable_7bv5GR0-ksXJn91sRHV0Mg_k4nblIGI";
const sb=createClient(SUPABASE_URL,SUPABASE_KEY);
let rows=[],filter="all";
const $=id=>document.getElementById(id);

function fmtDate(v){
  if(!v)return "—";
  try{return new Intl.DateTimeFormat("th-TH",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date(v))}
  catch(e){return v}
}
function statusPill(s){
  const cls=s==="COMPLETED"?"s-complete":s==="IN_PROGRESS"?"s-progress":"s-not";
  const text=s==="COMPLETED"?"✓":s==="IN_PROGRESS"?"กำลังทำ":"—";
  return '<span class="status-pill '+cls+'">'+text+'</span>';
}
function render(){
  const now=Date.now();
  $("mEntered").textContent=rows.length;
  $("mWorking").textContent=rows.filter(r=>r.completed_count>0&&r.completed_count<5 || (r.completed_count===0 && [r.lab1_status,r.lab2_status,r.lab3_status,r.lab4_status,r.lab5_status].includes("IN_PROGRESS"))).length;
  $("mCompleted").textContent=rows.filter(r=>r.completed_count===5).length;
  $("mRecent").textContent=rows.filter(r=>now-new Date(r.last_active_at).getTime()<=86400000).length;

  const data=rows.filter(r=>filter==="complete"?r.completed_count===5:filter==="working"?r.completed_count<5:true);
  $("progressBody").innerHTML=data.map(r=>'<tr>'+
    '<td>'+r.student_id+'</td>'+
    '<td>'+escapeHtml(r.display_name)+'</td>'+
    '<td>'+statusPill(r.lab1_status)+'</td>'+
    '<td>'+statusPill(r.lab2_status)+'</td>'+
    '<td>'+statusPill(r.lab3_status)+'</td>'+
    '<td>'+statusPill(r.lab4_status)+'</td>'+
    '<td>'+statusPill(r.lab5_status)+'</td>'+
    '<td><strong>'+r.completed_count+'/5</strong></td>'+
    '<td>'+fmtDate(r.last_active_at)+'</td>'+
    '<td>'+(r.certificate_id?'<span class="cert-yes">✓</span>':'<span class="cert-no">—</span>')+'</td>'+
  '</tr>').join('');
  $("statusMessage").textContent=data.length?("แสดง "+data.length+" คน · อัปเดตล่าสุด "+new Date().toLocaleTimeString("th-TH")):"ยังไม่มีข้อมูลในตัวกรองนี้";
}
function escapeHtml(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]))}
async function loadRows(){
  $("statusMessage").textContent="กำลังโหลด…";
  const {data,error}=await sb.rpc("hed3505_progress_dashboard");
  if(error){
    $("statusMessage").textContent="ไม่สามารถอ่าน Dashboard ได้: "+error.message;
    return;
  }
  rows=data||[];
  render();
}
async function updateSession(){
  const {data:{session}}=await sb.auth.getSession();
  if(session){
    $("loginPanel").classList.add("hidden");
    $("dashboardPanel").classList.remove("hidden");
    await loadRows();
  }else{
    $("loginPanel").classList.remove("hidden");
    $("dashboardPanel").classList.add("hidden");
  }
}
$("loginBtn").onclick=async()=>{
  $("loginMessage").textContent="กำลังเปิด Google Sign-in…";
  const {error}=await sb.auth.signInWithOAuth({
    provider:"google",
    options:{redirectTo:location.origin+location.pathname}
  });
  if(error)$("loginMessage").textContent=error.message;
};
$("logoutBtn").onclick=async()=>{await sb.auth.signOut();await updateSession()};
$("refreshBtn").onclick=loadRows;
document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");filter=b.dataset.filter;render();
});
sb.auth.onAuthStateChange(()=>setTimeout(updateSession,0));
updateSession();
