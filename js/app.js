'use strict';

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const storeKey = 'ait_mobile_rental_v2';

const AIT = {
  lang: localStorage.getItem('ait_lang') || 'ar',
  dark: localStorage.getItem('ait_dark') === '1',
  currentScreen: 'homeScreen',
  selectedCompanyId: null,
  selectedEquipmentId: null,
  selectedContractId: null,
  data: null
};

const demoData = {
  companies:[
    {id:'c1', name:'EGY Tech Power', owner:'عمر نور الدين عبدالعزيز حسن', title:'مالك', phone:'01025866909', address:'سوهاج - مركز أخميم', commercialNo:'27067', taxNo:'618-812-598', bankName:'بنك مصر', bankAccount:'3430555000000147', iban:'EG290002034303430555000000147', swift:'BMISEGCXXXX', rep:'م. عمر نور الدين', documents:['السجل التجاري','البطاقة الضريبية','التوكيل']},
    {id:'c2', name:'Delta Heavy Equipment', owner:'محمود عادل منصور', title:'مفوض بالتوقيع', phone:'01099221188', address:'القاهرة - مدينة نصر', commercialNo:'55129', taxNo:'311-775-940', bankName:'CIB', bankAccount:'118901234', iban:'EG11000600000118901234', swift:'CIBEEGCX', rep:'محمود عادل', documents:['عقد توريد','بطاقة ضريبية']},
    {id:'c3', name:'Sinai Contractors', owner:'أحمد سمير عبدالقادر', title:'مالك', phone:'01277889900', address:'السويس - عتاقة', commercialNo:'88412', taxNo:'799-201-220', bankName:'QNB', bankAccount:'78005511', iban:'EG14003700078005511', swift:'QNBAEGCX', rep:'أحمد سمير', documents:['سجل تجاري','رخصة تشغيل']}
  ],
  equipment:[
    {id:'e1', companyId:'c1', type:'جريدر', brand:'Caterpillar', model:'G140', year:'1997', chassis:'72714471', engine:'08765898', customs:'39991', status:'شغالة', location:'MAS-01 / Zone A', docOwner:'شريف حسن مبروك علي', docAddress:'كفر ابو صير غرب', dailyRate:20000, transportCost:100000, workHours:10, fuelResp:'المستأجر', files:['grader-front.jpg','customs-release.pdf']},
    {id:'e2', companyId:'c1', type:'لودر', brand:'Komatsu', model:'WA380', year:'2010', chassis:'KMTWA38010', engine:'KM998812', customs:'51240', status:'واقفة', location:'ورشة الصيانة', docOwner:'EGY Tech Power', docAddress:'سوهاج', dailyRate:18000, transportCost:85000, workHours:9, fuelResp:'المؤجر', files:['loader.jpg']},
    {id:'e3', companyId:'c2', type:'حفار', brand:'Volvo', model:'EC210', year:'2016', chassis:'VOL210778', engine:'V883310', customs:'70551', status:'شغالة', location:'Marsa Alam Mine 2', docOwner:'Delta Heavy Equipment', docAddress:'القاهرة', dailyRate:25000, transportCost:120000, workHours:10, fuelResp:'المستأجر', files:['excavator.jpg']},
    {id:'e4', companyId:'c3', type:'قلّاب', brand:'Mercedes', model:'Actros', year:'2015', chassis:'MBC88120', engine:'AC551020', customs:'90881', status:'متاحة', location:'المخزن', docOwner:'Sinai Contractors', docAddress:'السويس', dailyRate:12000, transportCost:45000, workHours:8, fuelResp:'المستأجر', files:['truck.jpg']}
  ],
  contracts:[
    {id:'k1', companyId:'c1', equipmentId:'e1', title:'عقد إيجار جريدر', start:'2025-11-22', end:'2026-02-22', rentType:'يومي', status:'نشط', paymentMethod:'أسبوعي', dailyRate:20000, transportCost:100000, fuelResp:'المستأجر', maintenanceResp:'المؤجر', firstSign:'م. مصطفى عصام الدين أحمد خيرت', secondSign:'م. عمر نور الدين', notes:'شامل السائق وكافة مستلزمات التشغيل'},
    {id:'k2', companyId:'c2', equipmentId:'e3', title:'عقد إيجار حفار', start:'2026-01-01', end:'2026-04-01', rentType:'شهري', status:'نشط', paymentMethod:'شهري', dailyRate:25000, transportCost:120000, fuelResp:'المستأجر', maintenanceResp:'المؤجر', firstSign:'م. مصطفى عصام الدين أحمد خيرت', secondSign:'محمود عادل', notes:'تشغيل داخل المنجم الرئيسي'},
    {id:'k3', companyId:'c1', equipmentId:'e2', title:'عقد إيجار لودر', start:'2025-09-01', end:'2025-12-01', rentType:'يومي', status:'منتهي', paymentMethod:'أسبوعي', dailyRate:18000, transportCost:85000, fuelResp:'المؤجر', maintenanceResp:'المؤجر', firstSign:'م. مصطفى عصام الدين أحمد خيرت', secondSign:'م. عمر نور الدين', notes:'العقد منتهي ويحتاج تجديد'}
  ],
  shifts:[
    {id:'s1', equipmentId:'e1', date:'2025-11-27', mine:'Marsa Alam Mine 1', location:'MAS-01-01-02', driver:'حسن علي', hours:10, m3:350, density:1.6, ton:560, fuel:180},
    {id:'s2', equipmentId:'e3', date:'2025-11-27', mine:'Marsa Alam Mine 2', location:'Zone B', driver:'كريم محمود', hours:9, m3:420, density:1.9, ton:798, fuel:220}
  ],
  mines:[
    {id:'m1', name:'Marsa Alam Mine 1', zones:8, activeEquipment:2, access:'Allowed'},
    {id:'m2', name:'Marsa Alam Mine 2', zones:5, activeEquipment:1, access:'Allowed'},
    {id:'m3', name:'Eastern Desert Mine', zones:4, activeEquipment:0, access:'Restricted'}
  ]
};

function init(){
  const saved = localStorage.getItem(storeKey);
  AIT.data = saved ? JSON.parse(saved) : structuredClone(demoData);
  document.documentElement.lang = AIT.lang;
  document.documentElement.dir = AIT.lang === 'ar' ? 'rtl' : 'ltr';
  $('#app').classList.toggle('dark', AIT.dark);
  $('#app').classList.toggle('en', AIT.lang === 'en');
  bindEvents();
  fillSelects();
  renderAll();
  navigate('homeScreen', false);
  updateSettingsLabels();
}
function save(){ localStorage.setItem(storeKey, JSON.stringify(AIT.data)); renderAll(); }
function uid(prefix='id'){ return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function money(n){ return Number(n || 0).toLocaleString(AIT.lang === 'ar' ? 'ar-EG':'en-US'); }
function todayISO(){ return new Date().toISOString().slice(0,10); }
function esc(v){ return String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function company(id){ return AIT.data.companies.find(x=>x.id===id); }
function equipment(id){ return AIT.data.equipment.find(x=>x.id===id); }
function contract(id){ return AIT.data.contracts.find(x=>x.id===id); }
function contractForEquipment(eid){ return AIT.data.contracts.find(c=>c.equipmentId===eid && c.status==='نشط') || AIT.data.contracts.find(c=>c.equipmentId===eid); }
function daysLeft(end){ const d = Math.ceil((new Date(end) - new Date()) / 86400000); return Number.isFinite(d) ? d : 0; }
function statusChip(status){
  const cls = status === 'شغالة' || status === 'نشط' || status === 'متاحة' ? 'good' : status === 'واقفة' || status === 'منتهي' ? 'bad' : 'warn';
  return `<span class="chip ${cls}">${esc(status || '-')}</span>`;
}
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove('show'),2200); }

function bindEvents(){
  $$('[data-open]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.open)));
  $('[data-action="home"]')?.addEventListener('click', () => navigate('homeScreen'));
  $('#backBtn').addEventListener('click', goBackSmart);
  $('#previewBackBtn').addEventListener('click', goBackSmart);
  $('#floatingAdd').addEventListener('click', () => navigate('equipmentScreen'));
  $('#themeToggle').addEventListener('click', toggleTheme);
  $('#langToggle').addEventListener('click', toggleLang);
  $('#settingsLang').addEventListener('click', toggleLang);
  $('#settingsTheme').addEventListener('click', toggleTheme);
  $('#companySearch').addEventListener('input', renderCompanies);
  $('#contractSearch').addEventListener('input', renderContracts);
  $('#addCompanyBtn').addEventListener('click', addDemoCompany);
  $('#newContractBtn').addEventListener('click', () => { buildContractPreview(AIT.data.contracts[0].id); navigate('contractPreviewScreen'); });
  $('#equipmentCompany').addEventListener('change', showSelectedCompanyInfo);
  $('#equipmentForm').addEventListener('submit', saveEquipmentAndPreview);
  $('#shiftForm').addEventListener('submit', saveShift);
  $('#shiftM3').addEventListener('input', calcShiftTon);
  $('#shiftDensity').addEventListener('change', calcShiftTon);
  $('#printContractBtn').addEventListener('click', () => window.print());
  $$('[data-report]').forEach(btn => btn.addEventListener('click', () => buildReport(btn.dataset.report)));
}
function navigate(id, push=true){
  AIT.currentScreen = id;
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  $$('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.open === id));
  const s = $('#'+id);
  $('#screenTitle').textContent = s.dataset[AIT.lang === 'ar' ? 'titleAr' : 'titleEn'] || s.dataset.titleAr || '';
  $('#screenEyebrow').textContent = s.dataset[AIT.lang === 'ar' ? 'eyeAr' : 'eyeEn'] || '';
  $('#backBtn').style.display = id === 'homeScreen' ? 'none' : 'grid';
  $('#floatingAdd').style.display = ['contractPreviewScreen','settingsScreen'].includes(id) ? 'none' : 'block';
  $('.screen-stack').scrollTop = 0;
  if(push) history.replaceState({screen:id}, '', '#'+id);
}
function goBackSmart(){
  if(AIT.currentScreen === 'companyDetailScreen') return navigate('companiesScreen');
  if(AIT.currentScreen === 'equipmentDetailScreen') return navigate('companyDetailScreen');
  if(AIT.currentScreen === 'contractPreviewScreen') return navigate('contractsScreen');
  navigate('homeScreen');
}
function toggleTheme(){ AIT.dark = !AIT.dark; localStorage.setItem('ait_dark', AIT.dark ? '1':'0'); $('#app').classList.toggle('dark', AIT.dark); updateSettingsLabels(); }
function toggleLang(){ AIT.lang = AIT.lang === 'ar' ? 'en':'ar'; localStorage.setItem('ait_lang', AIT.lang); document.documentElement.lang = AIT.lang; document.documentElement.dir = AIT.lang === 'ar' ? 'rtl':'ltr'; $('#app').classList.toggle('en', AIT.lang==='en'); $('#langToggle').textContent = AIT.lang.toUpperCase(); updateSettingsLabels(); navigate(AIT.currentScreen, false); renderAll(); }
function updateSettingsLabels(){ $('#langToggle').textContent = AIT.lang.toUpperCase(); $('#themeToggle').textContent = AIT.dark ? '☀':'☾'; $('#settingsLangValue').textContent = AIT.lang === 'ar' ? 'العربية':'English'; $('#settingsThemeValue').textContent = AIT.dark ? 'On':'Off'; }

function fillSelects(){
  const companyOptions = AIT.data.companies.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  $('#equipmentCompany').innerHTML = companyOptions;
  const eqOptions = AIT.data.equipment.map(e=>`<option value="${e.id}">${esc(e.type)} - ${esc(e.brand)} ${esc(e.model)}</option>`).join('');
  $('#shiftEquipment').innerHTML = eqOptions;
  showSelectedCompanyInfo();
}
function renderAll(){ fillSelects(); renderHome(); renderCompanies(); renderContracts(); renderShifts(); renderFinance(); renderMines(); buildReport('operation'); }
function renderHome(){
  $('#sumEquipment').textContent = AIT.data.equipment.length;
  $('#sumContracts').textContent = AIT.data.contracts.filter(c=>c.status==='نشط').length;
  $('#sumDue').textContent = AIT.data.contracts.filter(c=>daysLeft(c.end)<=7 && daysLeft(c.end)>=0).length;
}
function renderCompanies(){
  const q = ($('#companySearch')?.value || '').toLowerCase().trim();
  const list = AIT.data.companies.filter(c => !q || JSON.stringify(c).toLowerCase().includes(q) || AIT.data.equipment.some(e=>e.companyId===c.id && JSON.stringify(e).toLowerCase().includes(q)));
  $('#companiesList').innerHTML = list.length ? list.map(c => {
    const eqs = AIT.data.equipment.filter(e=>e.companyId===c.id);
    const active = eqs.filter(e=>e.status==='شغالة').length;
    const contracts = AIT.data.contracts.filter(k=>k.companyId===c.id);
    return `<article class="list-card" data-company-id="${c.id}">
      <div class="thumb">${esc(c.name.slice(0,2))}</div>
      <div class="list-body">
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.owner)} · ${esc(c.phone)}<br>${esc(c.address)}</p>
        <div class="meta-row"><span class="chip ait">${eqs.length} معدة</span><span class="chip good">${active} شغالة</span><span class="chip">${contracts.length} عقد</span></div>
      </div>
      <div class="card-actions"><button class="tiny-btn" data-view-company="${c.id}">فتح</button></div>
    </article>`;
  }).join('') : `<div class="empty">لا توجد نتائج</div>`;
  $$('[data-view-company]').forEach(b => b.addEventListener('click', () => openCompany(b.dataset.viewCompany)));
}
function openCompany(id){ AIT.selectedCompanyId = id; renderCompanyDetail(); navigate('companyDetailScreen'); }
function renderCompanyDetail(){
  const c = company(AIT.selectedCompanyId); if(!c) return;
  const eqs = AIT.data.equipment.filter(e=>e.companyId===c.id);
  const ks = AIT.data.contracts.filter(k=>k.companyId===c.id);
  $('#companyDetail').innerHTML = `
    <div class="detail-hero"><h2>${esc(c.name)}</h2><p>${esc(c.owner)} · ${esc(c.phone)}<br>${esc(c.address)}</p><div class="stats-row"><div class="stat-box"><b>${eqs.length}</b><span>معدات</span></div><div class="stat-box"><b>${eqs.filter(e=>e.status==='شغالة').length}</b><span>شغالة</span></div><div class="stat-box"><b>${ks.length}</b><span>عقود</span></div></div></div>
    <div class="tabs"><button class="active" data-tab="profile">ملف الشركة</button><button data-tab="equip">المعدات التابعة</button><button data-tab="cont">العقود</button><button data-tab="fin">المالية</button></div>
    <div class="tab-panel active" id="tab-profile">
      ${infoLine('السجل التجاري', c.commercialNo)}${infoLine('البطاقة الضريبية', c.taxNo)}${infoLine('البنك', c.bankName)}${infoLine('رقم الحساب', c.bankAccount)}${infoLine('IBAN', c.iban)}${infoLine('SWIFT', c.swift)}${infoLine('المستندات', (c.documents||[]).join(' - '))}
    </div>
    <div class="tab-panel" id="tab-equip">${eqs.map(e=>equipmentCard(e)).join('') || '<div class="empty">لا توجد معدات لهذه الشركة</div>'}</div>
    <div class="tab-panel" id="tab-cont">${ks.map(k=>contractCard(k)).join('') || '<div class="empty">لا توجد عقود</div>'}</div>
    <div class="tab-panel" id="tab-fin">${financeForCompany(c.id)}</div>`;
  $$('#companyDetail [data-tab]').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
  $$('#companyDetail [data-view-equipment]').forEach(b => b.addEventListener('click', () => openEquipment(b.dataset.viewEquipment)));
  $$('#companyDetail [data-preview-contract]').forEach(b => b.addEventListener('click', () => { buildContractPreview(b.dataset.previewContract); navigate('contractPreviewScreen'); }));
}
function setTab(name){ $$('#companyDetail [data-tab]').forEach(b=>b.classList.toggle('active', b.dataset.tab===name)); $$('#companyDetail .tab-panel').forEach(p=>p.classList.toggle('active', p.id==='tab-'+name)); }
function infoLine(label,value){ return `<div class="info-line"><span>${esc(label)}</span><b>${esc(value || '-')}</b></div>`; }
function equipmentCard(e){
  const k = contractForEquipment(e.id); const remain = k ? daysLeft(k.end) : null;
  const remainChip = k ? `<span class="chip ${remain < 0 ? 'bad' : remain <= 7 ? 'warn':'good'}">${remain < 0 ? 'منتهي' : remain + ' يوم متبقي'}</span>` : '<span class="chip bad">بدون عقد</span>';
  return `<article class="list-card"><div class="thumb">${esc(e.type[0]||'م')}</div><div class="list-body"><h3>${esc(e.type)} ${esc(e.brand)} ${esc(e.model)}</h3><p>الشاسيه: ${esc(e.chassis)}<br>الموقع: ${esc(e.location)}</p><div class="meta-row">${statusChip(e.status)}${remainChip}<span class="chip ait">${money(e.dailyRate)} ج/يوم</span></div></div><div class="card-actions"><button class="tiny-btn" data-view-equipment="${e.id}">تفاصيل</button>${k?`<button class="tiny-btn" data-preview-contract="${k.id}">العقد</button>`:''}</div></article>`;
}
function contractCard(k){
  const e = equipment(k.equipmentId); const remain = daysLeft(k.end);
  return `<article class="list-card"><div class="thumb">ع</div><div class="list-body"><h3>${esc(k.title)}</h3><p>${esc(e?.type || '-')} ${esc(e?.brand || '')} · ${esc(k.start)} إلى ${esc(k.end)}</p><div class="meta-row">${statusChip(k.status)}<span class="chip ${remain <= 7 && remain>=0 ? 'warn': remain<0 ? 'bad':'good'}">${remain<0?'منتهي':remain+' يوم'}</span><span class="chip ait">${money(k.dailyRate)} ج/يوم</span></div></div><div class="card-actions"><button class="tiny-btn" data-preview-contract="${k.id}">معاينة</button></div></article>`;
}
function financeForCompany(companyId){
  const ks = AIT.data.contracts.filter(k=>k.companyId===companyId);
  const total = ks.reduce((s,k)=>s+(Number(k.dailyRate||0)*Math.max(1, Math.min(30, daysLeft(k.end)>0 ? daysLeft(k.end): 1))),0);
  return `${infoLine('المستحقات التقديرية', money(total)+' جنيه')}${infoLine('عدد العقود المالية', ks.length)}${infoLine('تنبيه الاستحقاق', 'قبل تاريخ الاستحقاق بـ 2 يوم')}`;
}
function openEquipment(id){ AIT.selectedEquipmentId = id; renderEquipmentDetail(); navigate('equipmentDetailScreen'); }
function renderEquipmentDetail(){
  const e = equipment(AIT.selectedEquipmentId); if(!e) return; const c = company(e.companyId); const k = contractForEquipment(e.id); const remain = k ? daysLeft(k.end) : null;
  $('#equipmentDetail').innerHTML = `<div class="detail-hero"><h2>${esc(e.type)} ${esc(e.brand)} ${esc(e.model)}</h2><p>${esc(c?.name||'-')}<br>${esc(e.location)}</p><div class="stats-row"><div class="stat-box"><b>${esc(e.status)}</b><span>الحالة</span></div><div class="stat-box"><b>${k ? (remain<0?'0':remain) : '-'}</b><span>أيام متبقية</span></div><div class="stat-box"><b>${money(e.dailyRate)}</b><span>ج/يوم</span></div></div></div>
  <div class="info-grid">${infoLine('رقم الشاسيه', e.chassis)}${infoLine('رقم الموتور', e.engine)}${infoLine('رقم الرسالة الجمركية', e.customs)}${infoLine('سنة الصنع', e.year)}${infoLine('المالك حسب المستند', e.docOwner)}${infoLine('عنوان المالك', e.docAddress)}${infoLine('مسؤولية الوقود', e.fuelResp)}${infoLine('المستندات', (e.files||[]).join(' - '))}</div>
  <div class="preview-toolbar" style="margin-top:12px">${k?`<button class="primary-action" data-preview-contract="${k.id}">معاينة العقد</button>`:''}<button class="ghost-action" data-open="equipmentScreen">إضافة معدة جديدة</button></div>`;
  $$('#equipmentDetail [data-preview-contract]').forEach(b=>b.addEventListener('click',()=>{buildContractPreview(b.dataset.previewContract);navigate('contractPreviewScreen');}));
  $$('#equipmentDetail [data-open]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.open)));
}
function renderContracts(){
  const q = ($('#contractSearch')?.value || '').toLowerCase().trim();
  const list = AIT.data.contracts.filter(k => !q || JSON.stringify(k).toLowerCase().includes(q));
  $('#contractsList').innerHTML = list.map(k=>contractCard(k)).join('') || '<div class="empty">لا توجد عقود</div>';
  $$('#contractsList [data-preview-contract]').forEach(b => b.addEventListener('click', () => { buildContractPreview(b.dataset.previewContract); navigate('contractPreviewScreen'); }));
}
function showSelectedCompanyInfo(){
  const c = company($('#equipmentCompany').value);
  $('#selectedCompanyInfo').innerHTML = c ? `<b>${esc(c.name)}</b><br>المالك: ${esc(c.owner)} · الهاتف: ${esc(c.phone)}<br>البنك: ${esc(c.bankName)} · IBAN: ${esc(c.iban)}` : 'اختر الشركة لاستدعاء بياناتها تلقائياً';
}
function saveEquipmentAndPreview(e){
  e.preventDefault();
  const id = uid('e');
  const eq = {id, companyId:$('#equipmentCompany').value, type:$('#eqType').value, brand:$('#eqBrand').value, model:$('#eqModel').value, year:$('#eqYear').value, chassis:$('#eqChassis').value, engine:$('#eqEngine').value, customs:$('#eqCustoms').value, status:$('#eqStatus').value, location:$('#eqLocation').value, docOwner:$('#eqDocOwner').value, docAddress:$('#eqDocAddress').value, dailyRate:Number($('#eqDailyRate').value||0), transportCost:Number($('#eqTransportCost').value||0), workHours:Number($('#eqWorkHours').value||0), fuelResp:$('#eqFuelResp').value, files:Array.from($('#eqFiles').files||[]).map(f=>f.name)};
  AIT.data.equipment.unshift(eq);
  const k = {id:uid('k'), companyId:eq.companyId, equipmentId:eq.id, title:'عقد إيجار '+eq.type, start:todayISO(), end:addDaysISO(90), rentType:'يومي', status:'نشط', paymentMethod:'أسبوعي', dailyRate:eq.dailyRate, transportCost:eq.transportCost, fuelResp:eq.fuelResp, maintenanceResp:'المؤجر', firstSign:'م. مصطفى عصام الدين أحمد خيرت', secondSign:company(eq.companyId)?.rep || company(eq.companyId)?.owner || '', notes:'شامل التشغيل والسائق وكافة المستلزمات'};
  AIT.data.contracts.unshift(k);
  save(); e.target.reset(); showSelectedCompanyInfo(); buildContractPreview(k.id); navigate('contractPreviewScreen'); toast('تم حفظ المعدة وتجهيز معاينة العقد');
}
function addDaysISO(days){ const d = new Date(); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); }
function addDemoCompany(){
  const id = uid('c');
  AIT.data.companies.unshift({id,name:'New Rental Company '+AIT.data.companies.length,owner:'اسم المالك',title:'مالك',phone:'01000000000',address:'العنوان',commercialNo:'-',taxNo:'-',bankName:'-',bankAccount:'-',iban:'-',swift:'-',rep:'',documents:['مستند تجريبي']});
  save(); toast('تمت إضافة شركة ديمو');
}
function saveShift(e){
  e.preventDefault(); calcShiftTon();
  AIT.data.shifts.unshift({id:uid('s'), equipmentId:$('#shiftEquipment').value, date:$('#shiftDate').value, mine:$('#shiftMine').value, location:$('#shiftLocation').value, driver:$('#shiftDriver').value, hours:Number($('#shiftHours').value||0), m3:Number($('#shiftM3').value||0), density:Number($('#shiftDensity').value||1), ton:Number($('#shiftTon').value||0), fuel:0});
  save(); e.target.reset(); toast('تم حفظ الوردية');
}
function calcShiftTon(){ $('#shiftTon').value = (Number($('#shiftM3').value||0) * Number($('#shiftDensity').value||1)).toFixed(2); }
function renderShifts(){
  $('#shiftsList').innerHTML = AIT.data.shifts.map(s=>{const e=equipment(s.equipmentId);return `<article class="list-card"><div class="thumb">و</div><div class="list-body"><h3>${esc(e?.type||'-')} ${esc(e?.brand||'')}</h3><p>${esc(s.mine)} · ${esc(s.location)}<br>${esc(s.date)} · السائق: ${esc(s.driver)}</p><div class="meta-row"><span class="chip ait">${money(s.hours)} ساعة</span><span class="chip good">${money(s.m3)} م³</span><span class="chip">${money(s.ton)} طن</span></div></div></article>`}).join('') || '<div class="empty">لا توجد ورديات</div>';
}
function renderFinance(){
  $('#financeList').innerHTML = AIT.data.contracts.map(k=>{const c=company(k.companyId);const e=equipment(k.equipmentId);const remain=daysLeft(k.end);const amount=Number(k.dailyRate||0)*7;return `<article class="list-card"><div class="thumb">$</div><div class="list-body"><h3>${esc(c?.name||'-')}</h3><p>${esc(e?.type||'-')} ${esc(e?.brand||'')} · طريقة السداد: ${esc(k.paymentMethod)}</p><div class="meta-row"><span class="chip ait">مستحق أسبوعي ${money(amount)}</span><span class="chip ${remain<=7&&remain>=0?'warn':'good'}">${remain<0?'منتهي':remain+' يوم متبقي'}</span><span class="chip">تنبيه قبل الاستحقاق بيومين</span></div></div></article>`}).join('');
}
function renderMines(){
  $('#minesList').innerHTML = AIT.data.mines.map(m=>`<article class="list-card"><div class="thumb">M</div><div class="list-body"><h3>${esc(m.name)}</h3><p>Zones: ${m.zones} · Active Equipment: ${m.activeEquipment}</p><div class="meta-row"><span class="chip ${m.access==='Allowed'?'good':'bad'}">${esc(m.access)}</span><span class="chip ait">Mine-level access demo</span></div></div></article>`).join('');
}
function buildReport(type){
  const title = type === 'finance' ? 'تقرير مالي' : type === 'contracts' ? 'تقرير العقود' : 'تقرير التشغيل';
  const rows = type === 'finance' ? [
    ['إجمالي عقود نشطة', AIT.data.contracts.filter(k=>k.status==='نشط').length],
    ['إجمالي مستحقات أسبوعية تقديرية', money(AIT.data.contracts.reduce((s,k)=>s+Number(k.dailyRate||0)*7,0))+' جنيه'],
    ['عدد التنبيهات القريبة', AIT.data.contracts.filter(k=>daysLeft(k.end)<=7 && daysLeft(k.end)>=0).length]
  ] : type === 'contracts' ? [
    ['العقود النشطة', AIT.data.contracts.filter(k=>k.status==='نشط').length],
    ['العقود المنتهية', AIT.data.contracts.filter(k=>k.status==='منتهي').length],
    ['مطلوب تجديد خلال أسبوع', AIT.data.contracts.filter(k=>daysLeft(k.end)<=7 && daysLeft(k.end)>=0).length]
  ] : [
    ['إجمالي ساعات التشغيل', money(AIT.data.shifts.reduce((s,x)=>s+Number(x.hours||0),0))],
    ['إجمالي الإنتاج م³', money(AIT.data.shifts.reduce((s,x)=>s+Number(x.m3||0),0))],
    ['إجمالي الإنتاج طن', money(AIT.data.shifts.reduce((s,x)=>s+Number(x.ton||0),0))]
  ];
  $('#reportOutput').innerHTML = `<div class="form-panel"><div class="form-title"><h2>${title}</h2><p>تقرير ديمو من بيانات التطبيق الحالية.</p></div>${rows.map(r=>infoLine(r[0],r[1])).join('')}</div>`;
}

function buildContractPreview(contractId){
  const k = contract(contractId) || AIT.data.contracts[0]; const e = equipment(k.equipmentId); const c = company(k.companyId);
  AIT.selectedContractId = k.id;
  const lessee = {
    name:'شركة الياسمين الدولية للتجارة – شركة مساهمة مصرية', reg:'92364 - استثمار القاهرة', address:'294 ش عمر بن الخطاب متفرع من ش جسر السويس – جمهورية مصر العربية', rep:'السيد / مصطفى عصام الدين أحمد خيرت', title:'الرئيس التنفيذي', phone:'01008333661', tax:'521-088-429'
  };
  const page = (content) => `<section class="contract-page"><div class="contract-head"><div class="contract-logo">AIT.</div><div class="contract-brand"><span>YOUR SOURCE FOR ESSENTIAL ELEMENTS</span><b>AL YASMEIN INTERNATIONAL FOR TRADE</b></div><div class="contract-ship"></div></div><div class="doc-watermark"><div><span>YOUR SOURCE FOR</span>AIT.<span>EST. 1993 — EGYPT</span></div></div>${content}<div class="contract-foot"><div>polygon - sodic - bevely hills, B10.1, Sheikh Zayed City Giza</div><div>(+2) 01008333661<br>mkhairat@info-ait.com</div></div></section>`;
  const p1 = page(`<h2 class="doc-title">عقد إيجار ( ${esc(e?.type || 'معدة')} )</h2>
    <div class="contract-section"><h3>أولاً: تاريخ التعاقد</h3><p>تم الاتفاق في يوم: ${formatDate(todayISO())} الموافق: ${formatDate(todayISO())}</p></div>
    <div class="contract-section"><h3>ثانياً: أطراف التعاقد</h3><p><b>الطرف الأول (المستأجر):</b><br>${lessee.name}<br>السجل التجاري: ${lessee.reg}<br>العنوان: ${lessee.address}<br>يمثلها: ${lessee.rep}<br>الصفة: ${lessee.title}<br>رقم الهاتف: ${lessee.phone}<br>البطاقة الضريبية: ${lessee.tax}</p><p><b>الطرف الثاني (المؤجر):</b><br>شركة: ${esc(c?.name)}<br>ويمثلها: ${esc(c?.owner)}<br>الصفة: ${esc(c?.title || 'مالك')}<br>العنوان: ${esc(c?.address)}<br>رقم الهاتف: ${esc(c?.phone)}<br>السجل التجاري: ${esc(c?.commercialNo)}<br>البطاقة الضريبية: ${esc(c?.taxNo)}</p><p><b>البيانات البنكية للطرف الثاني:</b><br>البنك: ${esc(c?.bankName)}<br>رقم الحساب: ${esc(c?.bankAccount)}<br>IBAN: ${esc(c?.iban)}<br>SWIFT: ${esc(c?.swift)}</p></div>
    <div class="contract-section"><h3>ثالثاً: موضوع العقد</h3><p>يقوم الطرف الثاني بتأجير ${esc(e?.type)} (${esc(e?.brand)} ${esc(e?.model)}) للطرف الأول للعمل بالموقع، شامل التشغيل والسائق وكافة المستلزمات.</p></div>`);
  const p2 = page(`<div class="contract-section"><h3>رابعاً: تفاصيل المعدة</h3><ul><li>النوع: ${esc(e?.type)} ${esc(e?.brand)} أو ما يعادله</li><li>الحالة: ${esc(e?.status)} وصالحة للعمل حسب المعاينة</li><li>شامل سائق تشغيل حسب الاتفاق</li></ul></div>
    <div class="contract-section"><h3>خامساً: بيانات المعدة</h3><ul><li>الماركة: ${esc(e?.brand)}</li><li>الموديل: ${esc(e?.model)}</li><li>سنة الصنع: ${esc(e?.year)}</li><li>رقم الشاسيه: ${esc(e?.chassis)}</li><li>رقم الموتور: ${esc(e?.engine)}</li><li>رقم الرسالة الجمركية: ${esc(e?.customs)}</li></ul><p><b>بيانات المالك حسب المستند</b><br>اسم المالك: ${esc(e?.docOwner || c?.owner)}<br>عنوان المالك: ${esc(e?.docAddress || c?.address)}</p><p><b>بيانات الاستيراد</b><br>جهة الإصدار: مصلحة الجمارك المصرية<br>نوع المستند: إخطار إفراج نهائي<br>رقم مسلسل: ${esc(e?.customs || '-')}</p></div>
    <div class="contract-section"><h3>سادساً: مدة العقد</h3><p>تبدأ من: ${formatDate(k.start)}<br>وتنتهي في: ${formatDate(k.end)}<br>أو تنتهي بانتهاء المشروع أيهما أقرب، مع إمكانية التجديد باتفاق الطرفين.</p></div>
    <div class="contract-section"><h3>سابعاً: القيمة المالية</h3><p>إيجار ${esc(e?.type)}: ${money(k.dailyRate || e?.dailyRate)} جنيه / اليوم<br>تكلفة نقل المعدة ذهاب وعودة: ${money(k.transportCost || e?.transportCost)} جنيه</p></div>`);
  const internalBase = Math.round(Number(k.dailyRate||e?.dailyRate||0)*0.6); const driver = 2000; const living = 1500; const dailyTotal = internalBase+driver+living; const supervision = Math.round(dailyTotal*.17); const net = dailyTotal+supervision;
  const p3 = page(`<div class="contract-section"><h3>ثامناً: تفصيل التكاليف الداخلية (للتوضيح)</h3></div><table class="cost-table"><thead><tr><th>البيان</th><th>القيمة</th></tr></thead><tbody><tr><td>إيجار يومي شامل المعدة</td><td>${money(internalBase)}</td></tr><tr><td>إقامة السائق</td><td>${money(driver)}</td></tr><tr><td>انتقالات</td><td>على الشركة</td></tr><tr><td>مصاريف معيشة</td><td>${money(living)}</td></tr><tr><td>إجمالي التكلفة اليومية</td><td>${money(dailyTotal)}</td></tr><tr><td>إشراف ومتابعة</td><td>${money(supervision)}</td></tr><tr><th>الصافي</th><th>${money(net)}</th></tr></tbody></table><p style="position:relative;z-index:1;font-size:12px"><b>ملاحظة:</b> هذه التكاليف داخلية ولا يعتد بها محاسبياً أمام الطرف الأول.</p>
    <div class="contract-section"><h3>ثامناً: طريقة السداد</h3><ul><li>يتم سداد الإيجار بشكل: ${esc(k.paymentMethod || 'يومي / أسبوعي / مقدم')}</li><li>يتم سداد تكلفة النقل مقدماً بالكامل.</li></ul></div>
    <div class="contract-section"><h3>تاسعاً: التزامات الطرف الثاني</h3><ul><li>توفير المعدة بحالة جيدة.</li><li>توفير سائق مؤهل.</li><li>الالتزام بمواعيد العمل.</li><li>الصيانة على حسابه.</li></ul></div>
    <div class="contract-section"><h3>عاشراً: التزامات الطرف الأول</h3><ul><li>توفير موقع العمل المناسب.</li><li>تأمين المعدة داخل الموقع.</li><li>سداد المستحقات في مواعيدها.</li><li>توفير الحراسة.</li></ul></div>
    <div class="contract-section"><h3>الحادي عشر: الوقود والصيانة</h3><ul><li>يتحمل ${esc(k.fuelResp || e?.fuelResp)} تكلفة الوقود بالكامل.</li><li>يتحمل ${esc(k.maintenanceResp || 'المؤجر')} أعمال الصيانة الدورية والإصلاحات.</li></ul></div>`);
  const p4 = page(`<div class="contract-section"><h3>الثاني عشر: العمالة والتشغيل</h3><ul><li>تعمل المعدة بسائق تابع للمؤجر.</li><li>يلتزم المستأجر بتوفير الإقامة والإعاشة المناسبة للسائق طوال فترة التشغيل.</li></ul></div>
    <div class="contract-section"><h3>الثالث عشر: ساعات العمل</h3><ul><li>عدد ساعات العمل اليومية: ${esc(e?.workHours || '..........')} ساعة.</li><li>أي ساعات إضافية يتم حسابها بسعر إضافي يتم الاتفاق عليه.</li></ul></div>
    <div class="contract-section"><h3>الرابع عشر: الأعطال والتوقف</h3><ul><li>لا يتم احتساب فترات التوقف الناتجة عن الأعطال.</li><li>يلتزم المؤجر بسرعة إصلاح الأعطال وإعادة المعدة للعمل في أقرب وقت ممكن.</li></ul></div>
    <div class="contract-section"><h3>الخامس عشر: التأخير والتعطل</h3><p>في حالة توقف المعدة:</p><ul><li>لا يتم احتساب اليوم في حالة العطل الفني.</li><li>يتم احتساب اليوم في حالة توقف بسبب الموقع.</li></ul></div>
    <div class="contract-section"><h3>السادس عشر: الالتزامات العامة</h3><ol><li>عدم سوء استخدام المعدة أو تحميلها بما يتجاوز طاقتها.</li><li>الالتزام بإجراءات السلامة المهنية أثناء التشغيل.</li><li>عدم تأجير المعدة من الباطن دون موافقة كتابية من المؤجر.</li></ol></div>
    <div class="contract-section"><h3>السابع عشر: فسخ العقد</h3><ul><li>الإخلال بأي من بنود العقد.</li><li>التأخير في السداد.</li><li>سوء الاستخدام أو مخالفة شروط التشغيل.</li></ul></div>
    <div class="contract-section"><h3>الثامن عشر: الاختصاص القضائي</h3><ul><li>تختص محاكم الجيزة بنظر أي نزاع.</li></ul></div>`);
  const p5 = page(`<div class="contract-section"><h3>التاسع عشر: أحكام عامة</h3><ul><li>العقد من نسختين.</li><li>كل نسخة لها نفس القوة القانونية.</li></ul></div>
    <div class="contract-section"><h3>العشرون: أحكام عامة</h3><ol><li>هذا العقد ملزم قانوناً للطرفين.</li><li>لا يجوز تعديل أي بند إلا بموافقة كتابية من الطرفين.</li><li>حرر العقد من نسختين بيد كل طرف نسخة للعمل بها.</li></ol></div>
    <div class="contract-section"><h3>التوقيعات</h3><div class="sign-grid"><div class="sign-box"><b>الطرف الأول (شركة الياسمين)</b><p>الاسم: ${esc(k.firstSign)}</p><p>التوقيع</p></div><div class="sign-box"><b>الطرف الثاني (${esc(c?.name)})</b><p>الاسم: ${esc(k.secondSign || c?.owner)}</p><p>التوقيع</p></div></div></div>`);
  $('#contractPreview').innerHTML = p1+p2+p3+p4+p5;
}
function formatDate(d){ if(!d) return '.... / .... / ........'; const x = new Date(d); if(isNaN(x)) return d; return x.toLocaleDateString('ar-EG'); }

if('serviceWorker' in navigator){ window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(()=>{})); }
init();
