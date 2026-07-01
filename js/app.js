'use strict';

const AIT = {
  storageKey: 'ait_rental_pwa_v1',
  data: {
    companies: [], equipment: [], contracts: [], payments: [], shifts: []
  }
};

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const money = v => Number(v || 0).toLocaleString('ar-EG', { maximumFractionDigits: 2 });

function save(){ localStorage.setItem(AIT.storageKey, JSON.stringify(AIT.data)); updateAll(); }
function load(){
  const raw = localStorage.getItem(AIT.storageKey);
  if(raw){
    try{ AIT.data = JSON.parse(raw); }catch(e){ console.warn(e); }
  } else {
    seedDemoData();
  }
}
function toast(msg){
  const box = $('#toast'); box.textContent = msg; box.classList.add('show');
  setTimeout(()=>box.classList.remove('show'), 2200);
}
function val(id){ return $('#'+id)?.value?.trim() || ''; }
function setVal(id, value){ const el = $('#'+id); if(el) el.value = value ?? ''; }
function num(id){ return Number(String(val(id)).replace(',', '.')) || 0; }
function fileNames(inputId){ const input = $('#'+inputId); return input?.files ? Array.from(input.files).map(f => ({name:f.name,size:f.size,type:f.type,date:new Date().toISOString()})) : []; }

function seedDemoData(){
  const companyId = uid(); const equipId = uid(); const contractId = uid();
  AIT.data.companies = [{
    id: companyId, name:'شركة الصحراء لتأجير المعدات', owner:'أحمد محمود', phone:'01000000000', address:'القاهرة - مصر', nationalId:'', rep:'', commercialNo:'CR-2026-001', taxNo:'TX-5521', bankName:'CIB', bankAccount:'123456789', iban:'EG000000000000000000', swift:'CIBEEGCX', files:[], notes:'بيانات تجريبية'
  }];
  AIT.data.equipment = [{
    id:equipId, companyId, brand:'Caterpillar', model:'966H', year:'2020', chassis:'CH-99881', engine:'EN-8831', customs:'CUST-1020', importSource:'USA', status:'عقد نشط', responsibility:'المستأجر', operators:'1', assistants:'1', files:[]
  }];
  AIT.data.contracts = [{
    id:contractId, companyId, equipmentId:equipId, start:'2026-07-01', end:'2026-08-01', rentType:'شهري', status:'نشط', costMethod:'m3', priceM3:120, oreDensity:1.6, priceTon:75, transportResp:'المستأجر', transportStartCost:5000, fuelResp:'المستأجر', maintenanceResp:'المؤجر', advancePayment:20000, notes:'عقد تجريبي'
  }];
  AIT.data.payments = [];
  AIT.data.shifts = [];
  save();
}

function navigate(id){
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.go === id));
  window.scrollTo({top:0,behavior:'smooth'});
}

document.addEventListener('click', e => {
  const go = e.target.closest('[data-go]');
  if(go) navigate(go.dataset.go);
  const edit = e.target.closest('[data-edit]');
  if(edit) editEntity(edit.dataset.type, edit.dataset.edit);
  const del = e.target.closest('[data-delete]');
  if(del) deleteEntity(del.dataset.type, del.dataset.delete);
});

function updateAll(){
  updateSelects(); renderCompanies(); renderEquipment(); renderContracts(); renderPayments(); renderShifts(); renderKpis(); calcPriceTon(); calcShiftTon();
}
function renderKpis(){
  $('#kpiCompanies').textContent = AIT.data.companies.length;
  $('#kpiEquipment').textContent = AIT.data.equipment.length;
  $('#kpiContracts').textContent = AIT.data.contracts.filter(c=>c.status==='نشط').length;
  const soon = AIT.data.payments.filter(p => daysBetween(new Date(), new Date(p.nextDueDate)) <= 3).length;
  $('#kpiDue').textContent = soon;
}
function daysBetween(a,b){ return Math.ceil((b-a)/(1000*60*60*24)); }
function companyName(id){ return AIT.data.companies.find(c=>c.id===id)?.name || 'غير محدد'; }
function equipmentName(id){ const e = AIT.data.equipment.find(x=>x.id===id); return e ? `${e.brand} ${e.model}` : 'غير محدد'; }
function contractLabel(id){ const c = AIT.data.contracts.find(x=>x.id===id); return c ? `${companyName(c.companyId)} - ${equipmentName(c.equipmentId)}` : 'غير محدد'; }

function optionList(items, selected='', labelFn=x=>x.name){
  return '<option value="">اختر...</option>' + items.map(x=>`<option value="${x.id}" ${x.id===selected?'selected':''}>${escapeHtml(labelFn(x))}</option>`).join('');
}
function updateSelects(){
  ['equipmentCompany','contractCompany'].forEach(id => { const el=$('#'+id); if(el) el.innerHTML = optionList(AIT.data.companies); });
  ['contractEquipment','shiftEquipment'].forEach(id => { const el=$('#'+id); if(el) el.innerHTML = optionList(AIT.data.equipment, '', e=>`${e.brand} ${e.model} - ${companyName(e.companyId)}`); });
  const pc = $('#paymentContract'); if(pc) pc.innerHTML = optionList(AIT.data.contracts, '', c=>`${companyName(c.companyId)} / ${equipmentName(c.equipmentId)} / ${c.status}`);
}
function escapeHtml(str=''){ return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function empty(text){ return `<div class="empty-state">${text}</div>`; }

function renderCompanies(){
  const box = $('#companiesList'); if(!box) return;
  if(!AIT.data.companies.length){ box.innerHTML = empty('لا توجد شركات مسجلة بعد'); return; }
  box.innerHTML = AIT.data.companies.map(c=>`
    <article class="entity-item" data-text="${escapeHtml([c.name,c.owner,c.phone,c.commercialNo,c.taxNo].join(' '))}">
      <div>
        <h4>${escapeHtml(c.name)}</h4>
        <p>المالك: ${escapeHtml(c.owner || '-')} | الهاتف: ${escapeHtml(c.phone || '-')}</p>
        <p>السجل التجاري: ${escapeHtml(c.commercialNo || '-')} | البطاقة الضريبية: ${escapeHtml(c.taxNo || '-')}</p>
        <div class="entity-meta"><span class="tag">${escapeHtml(c.bankName || 'بدون بنك')}</span><span class="tag">مرفقات: ${(c.files||[]).length}</span></div>
      </div>
      <div class="entity-actions"><button class="icon-btn" data-edit="${c.id}" data-type="companies">تعديل</button><button class="icon-btn danger" data-delete="${c.id}" data-type="companies">حذف</button></div>
    </article>`).join('');
}
function renderEquipment(){
  const box = $('#equipmentList'); if(!box) return;
  if(!AIT.data.equipment.length){ box.innerHTML = empty('لا توجد معدات مسجلة بعد'); return; }
  box.innerHTML = AIT.data.equipment.map(e=>`
    <article class="entity-item" data-text="${escapeHtml([e.brand,e.model,e.status,companyName(e.companyId),e.chassis,e.engine].join(' '))}">
      <div>
        <h4>${escapeHtml(e.brand)} ${escapeHtml(e.model)}</h4>
        <p>الشركة المالكة: ${escapeHtml(companyName(e.companyId))}</p>
        <p>الشاسيه: ${escapeHtml(e.chassis || '-')} | المحرك: ${escapeHtml(e.engine || '-')}</p>
        <div class="entity-meta"><span class="tag">${escapeHtml(e.status || 'متاحة للعمل')}</span><span class="tag">تشغيل: ${escapeHtml(e.responsibility || '-')}</span></div>
      </div>
      <div class="entity-actions"><button class="icon-btn" data-edit="${e.id}" data-type="equipment">تعديل</button><button class="icon-btn danger" data-delete="${e.id}" data-type="equipment">حذف</button></div>
    </article>`).join('');
}
function renderContracts(){
  const box = $('#contractsList'); if(!box) return;
  if(!AIT.data.contracts.length){ box.innerHTML = empty('لا توجد عقود مسجلة بعد'); return; }
  box.innerHTML = AIT.data.contracts.map(c=>`
    <article class="entity-item" data-text="${escapeHtml([companyName(c.companyId),equipmentName(c.equipmentId),c.status,c.rentType].join(' '))}">
      <div>
        <h4>${escapeHtml(companyName(c.companyId))}</h4>
        <p>المعدة: ${escapeHtml(equipmentName(c.equipmentId))} | من ${c.start || '-'} إلى ${c.end || '-'}</p>
        <p>التسعير: ${c.costMethod === 'm3' ? `متر مكعب - ${money(c.priceM3)} / سعر الطن ${money(c.priceTon)}` : 'بالساعة'}</p>
        <div class="entity-meta"><span class="tag">${escapeHtml(c.status)}</span><span class="tag">${escapeHtml(c.rentType)}</span><span class="tag">سلفة: ${money(c.advancePayment)}</span></div>
      </div>
      <div class="entity-actions"><button class="icon-btn" data-edit="${c.id}" data-type="contracts">تعديل</button><button class="icon-btn danger" data-delete="${c.id}" data-type="contracts">حذف</button></div>
    </article>`).join('');
}
function renderPayments(){
  const box = $('#paymentsList'); if(!box) return;
  if(!AIT.data.payments.length){ box.innerHTML = empty('لا توجد عمليات مالية بعد'); return; }
  box.innerHTML = AIT.data.payments.map(p=>{
    const remain = Number(p.dueAmount||0)-Number(p.paidAmount||0);
    return `<article class="entity-item">
      <div><h4>${escapeHtml(contractLabel(p.contractId))}</h4><p>الاستحقاق القادم: ${p.nextDueDate || '-'} | طريقة السداد: ${p.method}</p><div class="entity-meta"><span class="tag">مستحق: ${money(p.dueAmount)}</span><span class="tag">مدفوع: ${money(p.paidAmount)}</span><span class="tag">متبقي: ${money(remain)}</span></div></div>
      <div class="entity-actions"><button class="icon-btn danger" data-delete="${p.id}" data-type="payments">حذف</button></div>
    </article>`;
  }).join('');
}
function renderShifts(){
  const box = $('#shiftsList'); if(!box) return;
  if(!AIT.data.shifts.length){ box.innerHTML = empty('لا توجد ورديات مسجلة بعد'); return; }
  box.innerHTML = AIT.data.shifts.map(s=>`
    <article class="entity-item">
      <div><h4>${escapeHtml(equipmentName(s.equipmentId))}</h4><p>${s.date || '-'} | ${escapeHtml(s.mine || '-')} | ${escapeHtml(s.location || '-')}</p><div class="entity-meta"><span class="tag">ساعات: ${money(s.hours)}</span><span class="tag">م³: ${money(s.m3)}</span><span class="tag">طن: ${money(s.ton)}</span><span class="tag">وقود: ${money(s.fuel)}</span></div></div>
      <div class="entity-actions"><button class="icon-btn danger" data-delete="${s.id}" data-type="shifts">حذف</button></div>
    </article>`).join('');
}

$('#companyForm')?.addEventListener('submit', e=>{
  e.preventDefault();
  const id = val('companyId') || uid();
  const item = { id, name:val('companyName'), owner:val('ownerName'), phone:val('ownerPhone'), address:val('companyAddress'), nationalId:val('ownerNationalId'), rep:val('repName'), commercialNo:val('commercialNo'), taxNo:val('taxNo'), bankName:val('bankName'), bankAccount:val('bankAccount'), iban:val('iban'), swift:val('swift'), files:fileNames('companyFiles'), notes:val('companyFileNotes') };
  upsert('companies', item); e.target.reset(); setVal('companyId',''); toast('تم حفظ بيانات الشركة');
});
$('#equipmentForm')?.addEventListener('submit', e=>{
  e.preventDefault();
  const id = val('equipmentId') || uid();
  const item = { id, companyId:val('equipmentCompany'), brand:val('equipmentBrand'), model:val('equipmentModel'), year:val('manufactureYear'), chassis:val('chassisNo'), engine:val('engineNo'), customs:val('customsNo'), importSource:val('importSource'), status:val('equipmentStatus'), responsibility:val('operationResponsibility'), operators:val('operatorsCount'), assistants:val('assistantsCount'), files:fileNames('equipmentFiles') };
  upsert('equipment', item); e.target.reset(); setVal('equipmentId',''); $('#autoCompanyBox').textContent = 'اختر شركة لاستدعاء بياناتها تلقائياً'; toast('تم حفظ بيانات المعدة');
});
$('#contractForm')?.addEventListener('submit', e=>{
  e.preventDefault();
  calcPriceTon();
  const id = val('contractId') || uid();
  const item = { id, companyId:val('contractCompany'), equipmentId:val('contractEquipment'), start:val('contractStart'), end:val('contractEnd'), rentType:val('rentType'), status:val('contractStatus'), costMethod:val('costMethod'), priceM3:num('priceM3'), oreDensity:num('oreType'), priceTon:num('priceTon'), transportResp:val('transportResp'), transportStartCost:num('transportStartCost'), fuelResp:val('fuelResp'), maintenanceResp:val('maintenanceResp'), advancePayment:num('advancePayment'), notes:val('contractNotes') };
  upsert('contracts', item); e.target.reset(); setVal('contractId',''); toast('تم حفظ العقد');
});
$('#paymentForm')?.addEventListener('submit', e=>{
  e.preventDefault();
  const item = { id:uid(), contractId:val('paymentContract'), method:val('paymentMethod'), nextDueDate:val('nextDueDate'), dueAmount:num('dueAmount'), paidAmount:num('paidAmount'), emails:val('notifyEmails'), notes:val('paymentNotes') };
  AIT.data.payments.unshift(item); save(); e.target.reset(); toast('تم تسجيل العملية المالية');
});
$('#shiftForm')?.addEventListener('submit', e=>{
  e.preventDefault(); calcShiftTon();
  const item = { id:uid(), equipmentId:val('shiftEquipment'), date:val('shiftDate'), start:val('shiftStart'), mine:val('mineName'), location:val('currentLocation'), hours:num('operatingHours'), m3:num('productionM3'), density:num('shiftDensity'), ton:num('productionTon'), driver:val('driverName'), assistant:val('assistantName'), fuel:num('fuelConsumption'), downtime:val('downtimeNotes') };
  AIT.data.shifts.unshift(item); save(); e.target.reset(); toast('تم حفظ الوردية');
});
function upsert(type, item){
  const idx = AIT.data[type].findIndex(x=>x.id===item.id);
  if(idx >= 0) AIT.data[type][idx] = item; else AIT.data[type].unshift(item);
  save();
}

function editEntity(type,id){
  const item = AIT.data[type].find(x=>x.id===id); if(!item) return;
  if(type==='companies'){
    navigate('companies'); setVal('companyId',item.id); setVal('companyName',item.name); setVal('ownerName',item.owner); setVal('ownerPhone',item.phone); setVal('companyAddress',item.address); setVal('ownerNationalId',item.nationalId); setVal('repName',item.rep); setVal('commercialNo',item.commercialNo); setVal('taxNo',item.taxNo); setVal('bankName',item.bankName); setVal('bankAccount',item.bankAccount); setVal('iban',item.iban); setVal('swift',item.swift); setVal('companyFileNotes',item.notes);
  }
  if(type==='equipment'){
    navigate('equipment'); setVal('equipmentId',item.id); setVal('equipmentCompany',item.companyId); showAutoCompany(); setVal('equipmentBrand',item.brand); setVal('equipmentModel',item.model); setVal('manufactureYear',item.year); setVal('chassisNo',item.chassis); setVal('engineNo',item.engine); setVal('customsNo',item.customs); setVal('importSource',item.importSource); setVal('equipmentStatus',item.status); setVal('operationResponsibility',item.responsibility); setVal('operatorsCount',item.operators); setVal('assistantsCount',item.assistants); toggleOperatorCounts();
  }
  if(type==='contracts'){
    navigate('contracts'); setVal('contractId',item.id); setVal('contractCompany',item.companyId); setVal('contractEquipment',item.equipmentId); setVal('contractStart',item.start); setVal('contractEnd',item.end); setVal('rentType',item.rentType); setVal('contractStatus',item.status); setVal('costMethod',item.costMethod); setVal('priceM3',item.priceM3); setVal('oreType',item.oreDensity); setVal('priceTon',item.priceTon); setVal('transportResp',item.transportResp); setVal('transportStartCost',item.transportStartCost); setVal('fuelResp',item.fuelResp); setVal('maintenanceResp',item.maintenanceResp); setVal('advancePayment',item.advancePayment); setVal('contractNotes',item.notes); toggleCostBox();
  }
}
function deleteEntity(type,id){
  if(!confirm('هل تريد حذف هذا السجل؟')) return;
  AIT.data[type] = AIT.data[type].filter(x=>x.id!==id); save(); toast('تم الحذف');
}

function showAutoCompany(){
  const c = AIT.data.companies.find(x=>x.id===val('equipmentCompany'));
  $('#autoCompanyBox').innerHTML = c ? `<b>${escapeHtml(c.name)}</b><br>المالك: ${escapeHtml(c.owner||'-')}<br>العنوان: ${escapeHtml(c.address||'-')}<br>البنك: ${escapeHtml(c.bankName||'-')}` : 'اختر شركة لاستدعاء بياناتها تلقائياً';
}
function toggleOperatorCounts(){ $('#operatorCounts')?.classList.toggle('show', val('operationResponsibility') === 'المستأجر'); }
function toggleCostBox(){ $('#m3CostBox')?.classList.toggle('conditional', val('costMethod') !== 'm3'); }
function calcPriceTon(){ const p = num('priceM3'), d = num('oreType') || 1; setVal('priceTon', (p / d).toFixed(2)); }
function calcShiftTon(){ const m3 = num('productionM3'), d = num('shiftDensity') || 1; setVal('productionTon', (m3*d).toFixed(2)); }
$('#equipmentCompany')?.addEventListener('change', showAutoCompany);
$('#operationResponsibility')?.addEventListener('change', toggleOperatorCounts);
$('#costMethod')?.addEventListener('change', toggleCostBox);
['priceM3','oreType'].forEach(id=>$('#'+id)?.addEventListener('input', calcPriceTon));
['productionM3','shiftDensity'].forEach(id=>$('#'+id)?.addEventListener('input', calcShiftTon));
$('#simulateAlert')?.addEventListener('click', ()=> toast('تم إرسال تنبيه تجريبي داخل النظام'));
$('#generateContract')?.addEventListener('click', ()=>{
  const c = companyName(val('contractCompany')); const e = equipmentName(val('contractEquipment'));
  toast('تم تجهيز معاينة العقد داخل التقارير'); navigate('reports'); buildReport(`عقد تأجير معدات`, [{label:'المؤجر', value:c},{label:'المستأجر', value:'AL YASMEIN INTERNATIONAL FOR TRADE'},{label:'المعدة', value:e},{label:'مدة العقد', value:`${val('contractStart')} إلى ${val('contractEnd')}`},{label:'طريقة الحساب', value: val('costMethod') === 'm3' ? 'بالمتر المكعب' : 'بالساعة'}]);
});
$('#buildReport')?.addEventListener('click', ()=> buildReport());
function buildReport(title='تقرير تنفيذي للنظام', rows){
  const defaultRows = [
    {label:'عدد شركات التأجير والمقاولين', value:AIT.data.companies.length},
    {label:'عدد المعدات المسجلة', value:AIT.data.equipment.length},
    {label:'العقود النشطة', value:AIT.data.contracts.filter(c=>c.status==='نشط').length},
    {label:'إجمالي المستحقات', value:money(AIT.data.payments.reduce((s,p)=>s+Number(p.dueAmount||0),0))},
    {label:'إجمالي الإنتاج بالمتر المكعب', value:money(AIT.data.shifts.reduce((s,p)=>s+Number(p.m3||0),0))},
    {label:'إجمالي الإنتاج بالطن', value:money(AIT.data.shifts.reduce((s,p)=>s+Number(p.ton||0),0))}
  ];
  const data = rows || defaultRows;
  $('#reportOutput').innerHTML = `<div class="screen-title"><p>AL YASMEIN INTERNATIONAL FOR TRADE</p><h2>${escapeHtml(title)}</h2></div><table class="report-table"><thead><tr><th>البند</th><th>القيمة</th></tr></thead><tbody>${data.map(r=>`<tr><td>${escapeHtml(r.label)}</td><td>${escapeHtml(r.value)}</td></tr>`).join('')}</tbody></table>`;
}
$$('.search-input').forEach(input=>input.addEventListener('input', e=>{
  const target = $('#'+e.target.dataset.search); const q = e.target.value.trim().toLowerCase();
  $$('.entity-item', target).forEach(item => item.style.display = item.dataset.text?.toLowerCase().includes(q) ? '' : 'none');
}));

if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(console.warn)); }
load(); updateAll(); toggleCostBox(); toggleOperatorCounts();
