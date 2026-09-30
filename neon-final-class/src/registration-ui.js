import {validateRegistration} from './registration-state.js';
// UI validation only. The database remains authoritative for enrollment and identity.
const form=document.getElementById('joinForm');
const status=document.getElementById('joinMessage');
if(form){
  form.addEventListener('submit',(event)=>{
    const result=validateRegistration({name:document.getElementById('displayName').value,studentId:document.getElementById('studentId').value,email:document.getElementById('accountEmail').textContent});
    if(!result.valid){
      event.preventDefault();event.stopImmediatePropagation();
      status.textContent=Object.values(result.errors).join(' · ');
      status.className='danger';return;
    }
    document.getElementById('displayName').value=result.value.name;
    document.getElementById('studentId').value=result.value.studentId;
  },true);
}
