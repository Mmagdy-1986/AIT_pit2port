'use strict';

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const storeKey = 'ait_mobile_rental_pro_v3';

const AIT = {
  lang: localStorage.getItem('ait_lang') || 'ar',
  dark: localStorage.getItem('ait_dark') === '1',
  currentScreen: 'homeScreen',
  selectedCompanyId: null,
  selectedEquipmentId: null,
  selectedContractId: null,
  lastCreatedEquipmentId: null,
  data: null
};

const demoData = {
  companies:[
    {id:'c1', name:'EGY Tech Power', owner:'عمر نور الدين عبدالعزيز حسن', title:'مالك', ownerId:'', phone:'01025866909', email:'operations@egytech.example', address:'سوهاج - مركز أخميم', commercialNo:'27067', taxNo:'618-812-598', bankName:'بنك مصر', bankAccount:'3430555000000147', iban:'EG290002034303430555000000147', swift:'BMISEGCXXXX', rep:'م. عمر نور الدين', contacts:'م. عمر نور الدين - مالك - 01025866909', financialNotes:'التحويل البنكي أسبوعي بعد اعتماد المستخلص.', documentNotes:'السجل والبطاقة الضريبية محفوظين داخل الأرشيف.', documents:['السجل التجاري','البطاقة الضريبية','التوكيل']},
    {id:'c2', name:'Delta Heavy Equipment', owner:'محمود عادل منصور', title:'مفوض بالتوقيع', ownerId:'', phone:'01099221188', email:'finance@delta.example', address:'القاهرة - مدينة نصر', commercialNo:'55129', taxNo:'311-775-940', bankName:'CIB', bankAccount:'118901234', iban:'EG11000600000118901234', swift:'CIBEEGCX', rep:'محمود عادل', contacts:'محمود عادل - مفوض - 01099221188', financialNotes:'إرسال إشعار قبل الاستحقاق بيومين.', documentNotes:'يوجد عقد توريد وبطاقة ضريبية.', documents:['عقد توريد','بطاقة ضريبية']},
    {id:'c3', name:'Sinai Contractors', owner:'أحمد سمير عبدالقادر', title:'مالك', ownerId:'', phone:'01277889900', email:'legal@sinai.example', address:'السويس - عتاقة', commercialNo:'88412', taxNo:'799-201-220', bankName:'QNB', bankAccount:'78005511', iban:'EG14003700078005511', swift:'QNBAEGCX', rep:'أحمد سمير', contacts:'أحمد سمير - مالك - 01277889900', financialNotes:'لا يتم الصرف إلا بعد مطابقة ساعات التشغيل.', documentNotes:'رخصة التشغيل مرفقة.', documents:['سجل تجاري','رخصة تشغيل']}
  ],
  equipment:[
    {id:'e1', companyId:'c1', type:'جريدر', brand:'Caterpillar', model:'G140', year:'1997', chassis:'72714471', engine:'08765898', customs:'39991', importData:'إخطار إفراج نهائي - مصلحة الجمارك المصرية', status:'شغالة', location:'MAS-01 / Zone A', operationOwner:'المؤجر', operators:1, assistants:1, docOwner:'شريف حسن مبروك علي', docAddress:'كفر ابو صير غرب', dailyRate:20000, transportCost:100000, workHours:10, fuelResp:'المستأجر', maintenanceResp:'المؤجر', files:['grader-front.jpg','customs-release.pdf']},
    {id:'e2', companyId:'c1', type:'لودر', brand:'Komatsu', model:'WA380', year:'2010', chassis:'KMTWA38010', engine:'KM998812', customs:'51240', importData:'بيانات استيراد مسجلة', status:'صيانة', location:'ورشة الصيانة', operationOwner:'المؤجر', operators:1, assistants:0, docOwner:'EGY Tech Power', docAddress:'سوهاج', dailyRate:18000, transportCost:85000, workHours:9, fuelResp:'المؤجر', maintenanceResp:'المؤجر', files:['loader.jpg']},
    {id:'e3', companyId:'c2', type:'حفار', brand:'Volvo', model:'EC210', year:'2016', chassis:'VOL210778', engine:'V883310', customs:'70551', importData:'إفراج جمركي كامل', status:'شغالة', location:'Marsa Alam Mine 2', operationOwner:'مشترك', operators:1, assistants:1, docOwner:'Delta Heavy Equipment', docAddress:'القاهرة', dailyRate:25000, transportCost:120000, workHours:10, fuelResp:'المستأجر', maintenanceResp:'المؤجر', files:['excavator.jpg']},
    {id:'e4', companyId:'c3', type:'قلّاب', brand:'Mercedes', model:'Actros', year:'2015', chassis:'MBC88120', engine:'AC551020', customs:'90881', importData:'مستندات استيراد متاحة', status:'متاحة', location:'المخزن', operationOwner:'المستأجر', operators:1, assistants:0, docOwner:'Sinai Contractors', docAddress:'السويس', dailyRate:12000, transportCost:45000, workHours:8, fuelResp:'المستأجر', maintenanceResp:'المؤجر', files:['truck.jpg']}
  ],
  contracts:[
    {id:'k1', companyId:'c1', equipmentId:'e1', title:'عقد إيجار جريدر', start:'2026-07-01', end:'2026-10-01', rentType:'يومي', status:'نشط', paymentMethod:'أسبوعي', pricingMode:'daily', dailyRate:20000, hourlyRate:0, m3Rate:0, density:1.6, tonRate:0, transportStart:100000, transportEnd:0, transportResponsible:'المستأجر', fuelResp:'المستأجر', maintenanceResp:'المؤجر', advanceAmount:50000, paidAmount:50000, alertDays:2, firstSign:'م. مصطفى عصام الدين أحمد خيرت', secondSign:'م. عمر نور الدين', notes:'شامل السائق وكافة مستلزمات التشغيل', payments:[{date:'2026-07-01', amount:50000, note:'دفعة مقدمة'}]},
    {id:'k2', companyId:'c2', equipmentId:'e3', title:'عقد إيجار حفار', start:'2026-06-15', end:'2026-09-15', rentType:'شهري', status:'نشط', paymentMethod:'شهري', pricingMode:'daily', dailyRate:25000, hourlyRate:0, m3Rate:0, density:1.9, tonRate:0, transportStart:120000, transportEnd:0, transportResponsible:'المستأجر', fuelResp:'المستأجر', maintenanceResp:'المؤجر', advanceAmount:0, paidAmount:0, alertDays:3, firstSign:'م. مصطفى عصام الدين أحمد خيرت', secondSign:'محمود عادل', notes:'تشغيل داخل المنجم الرئيسي', payments:[]},
    {id:'k3', companyId:'c1', equipmentId:'e2', title:'عقد إيجار لودر', start:'2026-05-01', end:'2026-06-30', rentType:'يومي', status:'منتهي', paymentMethod:'أسبوعي', pricingMode:'hourly', dailyRate:18000, hourlyRate:1800, m3Rate:0, density:1.6, tonRate:0, transportStart:85000, transportEnd:0, transportResponsible:'المستأجر', fuelResp:'المؤجر', maintenanceResp:'المؤجر', advanceAmount:0, paidAmount:90000, alertDays:2, firstSign:'م. مصطفى عصام الدين أحمد خيرت', secondSign:'م. عمر نور الدين', notes:'العقد منتهي ويحتاج تجديد', payments:[{date:'2026-05-10', amount:90000, note:'دفعة تشغيل'}]}
  ],
  shifts:[
    {id:'s1', equipmentId:'e1', date:'2026-07-03', mine:'Marsa Alam Mine 1', location:'MAS-01-01-02', driver:'حسن علي', assistant:'محمد سيد', hours:10, m3:350, density:1.6, ton:560, fuel:180},
    {id:'s2', equipmentId:'e3', date:'2026-07-03', mine:'Marsa Alam Mine 2', location:'Zone B', driver:'كريم محمود', assistant:'أحمد رضا', hours:9, m3:420, density:1.9, ton:798, fuel:220}
  ],
  mines:[
    {id:'m1', name:'Marsa Alam Mine 1', zones:8, activeEquipment:2, access:'Allowed'},
    {id:'m2', name:'Marsa Alam Mine 2', zones:5, activeEquipment:1, access:'Allowed'},
    {id:'m3', name:'Eastern Desert Mine', zones:4, activeEquipment:0, access:'Restricted'}
  ]
};

function init(){
  const saved = localStorage.getItem(storeKey);
  try { AIT.data = saved ? normalizeData(JSON.parse(saved)) : structuredClone(demoData); }
  catch(e){ AIT.data = structuredClone(demoData); }
  document.documentElement.lang = AIT.lang;
  document.documentElement.dir = AIT.lang === 'ar' ? 'rtl' : 'ltr';
  $('#app').classList.toggle('dark', AIT.dark);
  $('#app').classList.toggle('en', AIT.lang === 'en');
  bindEvents();
  fillSelects();
  renderAll();
  navigate(location.hash ? location.hash.replace('#','') : 'homeScreen', false);
  updateSettingsLabels();
}
function normalizeData(data){
  data.companies ||= []; data.equipment ||= []; data.contracts ||= []; data.shifts ||= []; data.mines ||= demoData.mines;
  data.contracts.forEach(k => { k.payments ||= []; k.paidAmount = Number(k.paidAmount || k.payments.reduce((s,p)=>s+Number(p.amount||0),0) || 0); k.alertDays = Number(k.alertDays || 2); });
  data.equipment.forEach(e => { e.operationOwner ||= 'المؤجر'; e.operators ||= 1; e.assistants ||= 0; e.maintenanceResp ||= 'المؤجر'; });
  return data;
}
function persist(){ localStorage.setItem(storeKey, JSON.stringify(AIT.data)); }
function save(){ persist(); renderAll(); }
function uid(prefix='id'){ return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function money(n){ return Number(n || 0).toLocaleString(AIT.lang === 'ar' ? 'ar-EG':'en-US'); }
function todayISO(){ return new Date().toISOString().slice(0,10); }
function addDaysISO(days, base=todayISO()){ const d = new Date(base); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); }
function esc(v){ const el = document.createElement('span'); el.textContent = String(v ?? ''); return el.innerHTML; }
function company(id){ return AIT.data.companies.find(x=>x.id===id); }
function equipment(id){ return AIT.data.equipment.find(x=>x.id===id); }
function contract(id){ return AIT.data.contracts.find(x=>x.id===id); }
function activeContracts(){ return AIT.data.contracts.filter(c=>c.status === 'نشط'); }
function contractForEquipment(eid){ return activeContracts().find(c=>c.equipmentId===eid) || AIT.data.contracts.find(c=>c.equipmentId===eid); }
function startOfToday(){ const d = new Date(); d.setHours(0,0,0,0); return d; }
function daysLeft(end){ const d = Math.ceil((new Date(end) - startOfToday()) / 86400000); return Number.isFinite(d) ? d : 0; }
function cycleDays(method){ return method === 'يومي' ? 1 : method === 'شهري' ? 30 : 7; }
function contractPeriodDays(k){ return Math.max(1, Math.ceil((new Date(k.end)-new Date(k.start))/86400000)); }
function nextDueDate(k){
  const step = cycleDays(k.paymentMethod);
  let d = new Date(k.start || todayISO());
  const end = new Date(k.end || todayISO());
  const today = startOfToday();
  while(d < today && d < end){ d.setDate(d.getDate()+step); }
  if(d > end) d = end;
  return d.toISOString().slice(0,10);
}
function cycleAmount(k){
  const baseDaily = Number(k.dailyRate || 0);
  if(k.paymentMethod === 'يومي') return baseDaily;
  if(k.paymentMethod === 'شهري') return baseDaily * 30;
  return baseDaily * 7;
}
function contractGross(k){ return Number(k.dailyRate||0) * contractPeriodDays(k) + Number(k.transportStart||0) + Number(k.transportEnd||0); }
function dueBalance(k){ return Math.max(0, contractGross(k) - Number(k.paidAmount||0)); }
function statusChip(status){
  const cls = ['شغالة','نشط','متاحة'].includes(status) ? 'good' : ['واقفة','منتهي','موقوف'].includes(status) ? 'bad' : 'warn';
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
  $('#resetDemo').addEventListener('click', resetDemoData);
  $('#openAlertsBtn').addEventListener('click', () => { navigate('financeScreen'); toast('تم فتح شاشة التنبيهات والمستحقات'); });
  $('#companySearch').addEventListener('input', renderCompanies);
  $('#contractSearch').addEventListener('input', renderContracts);
  $('#addCompanyBtn').addEventListener('click', () => navigate('companyFormScreen'));
  $('#newContractBtn').addEventListener('click', () => navigate('contractFormScreen'));
  $('#equipmentCompany').addEventListener('change', showSelectedCompanyInfo);
  $('#equipmentForm').addEventListener('submit', saveEquipment);
  $('#companyForm').addEventListener('submit', saveCompany);
  $('#contractForm').addEventListener('submit', saveContract);
  $('#contractCompany').addEventListener('change', () => { fillContractEquipment(); hydrateContractFromEquipment(); });
  $('#contractEquipment').addEventListener('change', hydrateContractFromEquipment);
  ['contractPricingMode','contractDailyRate','contractHourlyRate','contractM3Rate','contractDensity'].forEach(id => $('#'+id).addEventListener('input', updatePricingPreview));
  $('#shiftForm').addEventListener('submit', saveShift);
  $('#shiftM3').addEventListener('input', calcShiftTon);
  $('#shiftDensity').addEventListener('change', calcShiftTon);
  $('#printContractBtn').addEventListener('click', () => window.print());
  $$('[data-report]').forEach(btn => btn.addEventListener('click', () => buildReport(btn.dataset.report)));
}
function navigate(id, push=true){
  if(!$('#'+id)) id='homeScreen';
  AIT.currentScreen = id;
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  $$('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.open === id));
  const s = $('#'+id);
  $('#screenTitle').textContent = s.dataset[AIT.lang === 'ar' ? 'titleAr' : 'titleEn'] || s.dataset.titleAr || '';
  $('#screenEyebrow').textContent = s.dataset[AIT.lang === 'ar' ? 'eyeAr' : 'eyeEn'] || '';
  $('#backBtn').style.display = id === 'homeScreen' ? 'none' : 'grid';
  $('#floatingAdd').style.display = ['contractPreviewScreen','settingsScreen','companyFormScreen','contractFormScreen'].includes(id) ? 'none' : 'block';
  $('.screen-stack').scrollTop = 0;
  if(id === 'contractFormScreen') hydrateContractFromEquipment();
  if(push) history.replaceState({screen:id}, '', '#'+id);
}
function goBackSmart(){
  if(AIT.currentScreen === 'companyDetailScreen') return navigate('companiesScreen');
  if(AIT.currentScreen === 'equipmentDetailScreen') return navigate(AIT.selectedCompanyId ? 'companyDetailScreen' : 'companiesScreen');
  if(AIT.currentScreen === 'contractPreviewScreen') return navigate('contractsScreen');
  if(['companyFormScreen','contractFormScreen','equipmentScreen'].includes(AIT.currentScreen)) return navigate('homeScreen');
  navigate('homeScreen');
}
function toggleTheme(){ AIT.dark = !AIT.dark; localStorage.setItem('ait_dark', AIT.dark ? '1':'0'); $('#app').classList.toggle('dark', AIT.dark); updateSettingsLabels(); }
function toggleLang(){ AIT.lang = AIT.lang === 'ar' ? 'en':'ar'; localStorage.setItem('ait_lang', AIT.lang); document.documentElement.lang = AIT.lang; document.documentElement.dir = AIT.lang === 'ar' ? 'rtl':'ltr'; $('#app').classList.toggle('en', AIT.lang==='en'); updateSettingsLabels(); navigate(AIT.currentScreen, false); renderAll(); }
function updateSettingsLabels(){ $('#langToggle').textContent = AIT.lang.toUpperCase(); $('#themeToggle').textContent = AIT.dark ? '☀':'☾'; $('#settingsLangValue').textContent = AIT.lang === 'ar' ? 'العربية':'English'; $('#settingsThemeValue').textContent = AIT.dark ? 'On':'Off'; }
function resetDemoData(){ if(confirm('سيتم حذف البيانات المحلية والرجوع لبيانات الديمو. متابعة؟')){ AIT.data = structuredClone(demoData); persist(); renderAll(); navigate('homeScreen'); toast('تمت إعادة ضبط البيانات'); } }

function fillSelects(){
  const companyOptions = AIT.data.companies.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  $('#equipmentCompany').innerHTML = companyOptions || '<option value="">لا توجد شركات</option>';
  $('#contractCompany').innerHTML = companyOptions || '<option value="">لا توجد شركات</option>';
  fillContractEquipment();
  const eqOptions = AIT.data.equipment.map(e=>`<option value="${e.id}">${esc(e.type)} - ${esc(e.brand)} ${esc(e.model)}</option>`).join('');
  $('#shiftEquipment').innerHTML = eqOptions || '<option value="">لا توجد معدات</option>';
  showSelectedCompanyInfo();
  updatePricingPreview();
}
function fillContractEquipment(){
  const companyId = $('#contractCompany').value || AIT.data.companies[0]?.id;
  const eqs = AIT.data.equipment.filter(e => !companyId || e.companyId === companyId);
  $('#contractEquipment').innerHTML = eqs.map(e=>`<option value="${e.id}">${esc(e.type)} - ${esc(e.brand)} ${esc(e.model)} / ${esc(e.status)}</option>`).join('') || '<option value="">لا توجد معدات لهذه الشركة</option>';
  if(AIT.lastCreatedEquipmentId && eqs.some(e=>e.id===AIT.lastCreatedEquipmentId)) $('#contractEquipment').value = AIT.lastCreatedEquipmentId;
}
function renderAll(){ fillSelects(); renderHome(); renderCompanies(); renderContracts(); renderShifts(); renderFinance(); buildReport('operation'); }

function renderHome(){
  const working = AIT.data.equipment.filter(e=>e.status==='شغالة').length;
  const dueSoonContracts = activeContracts().filter(k => daysLeft(nextDueDate(k)) <= Number(k.alertDays || 2));
  const dueAmount = dueSoonContracts.reduce((s,k)=>s+Math.min(cycleAmount(k), dueBalance(k)),0);
  const todayTons = AIT.data.shifts.filter(s=>s.date===todayISO()).reduce((s,x)=>s+Number(x.ton||0),0);
  const renewalRisk = activeContracts().filter(k=>daysLeft(k.end)<=14 && daysLeft(k.end)>=0).length;
  $('#sumEquipment').textContent = AIT.data.equipment.length;
  $('#sumWorking').textContent = `${working} شغالة الآن`;
  $('#sumContracts').textContent = activeContracts().length;
  $('#sumDue').textContent = dueSoonContracts.length;
  $('#sumDueAmount').textContent = `${money(dueAmount)} ج`;
  $('#sumTons').textContent = money(todayTons);
  $('#sumRenewals').textContent = renewalRisk;
  $('#riskBanner').innerHTML = dueSoonContracts.length ? `<b>تنبيه مالي</b><span>يوجد ${dueSoonContracts.length} استحقاق قريب بقيمة تقديرية ${money(dueAmount)} جنيه.</span>` : `<b>الوضع مستقر</b><span>لا توجد مستحقات عاجلة حسب دورة السداد الحالية.</span>`;
  $('#riskBanner').classList.toggle('danger', dueSoonContracts.length > 0);
}

function renderCompanies(){
  const q = ($('#companySearch')?.value || '').toLowerCase().trim();
  const list = AIT.data.companies.filter(c => !q || JSON.stringify(c).toLowerCase().includes(q) || AIT.data.equipment.some(e=>e.companyId===c.id && JSON.stringify(e).toLowerCase().includes(q)));
  $('#companiesList').innerHTML = list.length ? list.map(c => {
    const eqs = AIT.data.equipment.filter(e=>e.companyId===c.id);
    const active = eqs.filter(e=>e.status==='شغالة').length;
    const contracts = AIT.data.contracts.filter(k=>k.companyId===c.id);
    const balance = contracts.reduce((s,k)=>s+dueBalance(k),0);
    return `<article class="list-card" data-company-id="${c.id}">
      <div class="thumb">${esc(c.name.slice(0,2))}</div>
      <div class="list-body"><h3>${esc(c.name)}</h3><p>${esc(c.owner)} · ${esc(c.phone)}<br>${esc(c.address)}</p>
      <div class="meta-row"><span class="chip ait">${eqs.length} معدة</span><span class="chip good">${active} شغالة</span><span class="chip">${contracts.length} عقد</span><span class="chip warn">${money(balance)} ج متبقي</span></div></div>
      <div class="card-actions"><button class="tiny-btn" data-view-company="${c.id}">فتح</button></div>
    </article>`;
  }).join('') : `<div class="empty">لا توجد نتائج</div>`;
  $$('[data-view-company]').forEach(b => b.addEventListener('click', () => openCompany(b.dataset.viewCompany)));
}
function saveCompany(e){
  e.preventDefault();
  const id = uid('c');
  const files = Array.from($('#companyFiles').files || []).map(f=>f.name);
  AIT.data.companies.unshift({
    id,
    name:$('#companyName').value.trim(), owner:$('#companyOwner').value.trim(), title:$('#companyTitle').value.trim() || 'مالك', ownerId:$('#companyOwnerId').value.trim(), phone:$('#companyPhone').value.trim(), email:$('#companyEmail').value.trim(), address:$('#companyAddress').value.trim(), commercialNo:$('#companyCommercialNo').value.trim(), taxNo:$('#companyTaxNo').value.trim(), contacts:$('#companyContacts').value.trim(), bankName:$('#companyBankName').value.trim(), bankAccount:$('#companyBankAccount').value.trim(), iban:$('#companyIban').value.trim(), swift:$('#companySwift').value.trim(), financialNotes:$('#companyFinancialNotes').value.trim(), documentNotes:$('#companyDocumentNotes').value.trim(), rep:$('#companyOwner').value.trim(), documents:files.length ? files : ['ملف شركة جديد']
  });
  save(); e.target.reset(); AIT.selectedCompanyId = id; renderCompanyDetail(); navigate('companyDetailScreen'); toast('تم إنشاء ملف الشركة وربطه بالنظام');
}
function openCompany(id){ AIT.selectedCompanyId = id; renderCompanyDetail(); navigate('companyDetailScreen'); }
function renderCompanyDetail(){
  const c = company(AIT.selectedCompanyId); if(!c) return;
  const eqs = AIT.data.equipment.filter(e=>e.companyId===c.id);
  const ks = AIT.data.contracts.filter(k=>k.companyId===c.id);
  const balance = ks.reduce((s,k)=>s+dueBalance(k),0);
  $('#companyDetail').innerHTML = `
    <div class="detail-hero"><h2>${esc(c.name)}</h2><p>${esc(c.owner)} · ${esc(c.phone)}<br>${esc(c.address)}</p><div class="stats-row"><div class="stat-box"><b>${eqs.length}</b><span>معدات</span></div><div class="stat-box"><b>${eqs.filter(e=>e.status==='شغالة').length}</b><span>شغالة</span></div><div class="stat-box"><b>${money(balance)}</b><span>رصيد</span></div></div></div>
    <div class="tabs"><button class="active" data-tab="profile">ملف الشركة</button><button data-tab="equip">المعدات التابعة</button><button data-tab="cont">العقود</button><button data-tab="fin">المالية</button></div>
    <div class="tab-panel active" id="tab-profile"><div class="info-grid">
      ${infoLine('المالك / المفوض', c.owner)}${infoLine('الصفة', c.title)}${infoLine('رقم الهوية', c.ownerId)}${infoLine('البريد الإلكتروني', c.email)}${infoLine('السجل التجاري', c.commercialNo)}${infoLine('البطاقة الضريبية', c.taxNo)}${infoLine('البنك', c.bankName)}${infoLine('رقم الحساب', c.bankAccount)}${infoLine('IBAN', c.iban)}${infoLine('SWIFT', c.swift)}${infoLine('جهات الاتصال', c.contacts)}${infoLine('ملاحظات مالية', c.financialNotes)}${infoLine('المستندات', (c.documents||[]).join(' - '))}${infoLine('ملاحظات المستندات', c.documentNotes)}
    </div></div>
    <div class="tab-panel" id="tab-equip">${eqs.map(e=>equipmentCard(e)).join('') || '<div class="empty">لا توجد معدات لهذه الشركة</div>'}</div>
    <div class="tab-panel" id="tab-cont">${ks.map(k=>contractCard(k)).join('') || '<div class="empty">لا توجد عقود</div>'}</div>
    <div class="tab-panel" id="tab-fin">${financeForCompany(c.id)}</div>`;
  $$('#companyDetail [data-tab]').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
  $$('#companyDetail [data-view-equipment]').forEach(b => b.addEventListener('click', () => openEquipment(b.dataset.viewEquipment)));
  $$('#companyDetail [data-preview-contract]').forEach(b => b.addEventListener('click', () => { buildContractPreview(b.dataset.previewContract); navigate('contractPreviewScreen'); }));
  $$('#companyDetail [data-register-payment]').forEach(b => b.addEventListener('click', () => registerPayment(b.dataset.registerPayment)));
}
function setTab(name){ $$('#companyDetail [data-tab]').forEach(b=>b.classList.toggle('active', b.dataset.tab===name)); $$('#companyDetail .tab-panel').forEach(p=>p.classList.toggle('active', p.id==='tab-'+name)); }
function infoLine(label,value){ return `<div class="info-line"><span>${esc(label)}</span><b>${esc(value || '-')}</b></div>`; }
function equipmentCard(e){
  const k = contractForEquipment(e.id); const remain = k ? daysLeft(k.end) : null;
  const remainChip = k ? `<span class="chip ${remain < 0 ? 'bad' : remain <= 14 ? 'warn':'good'}">${remain < 0 ? 'منتهي' : remain + ' يوم متبقي'}</span>` : '<span class="chip bad">بدون عقد</span>';
  return `<article class="list-card"><div class="thumb">${esc((e.type||'م')[0])}</div><div class="list-body"><h3>${esc(e.type)} ${esc(e.brand)} ${esc(e.model)}</h3><p>الشاسيه: ${esc(e.chassis)}<br>الموقع: ${esc(e.location)}</p><div class="meta-row">${statusChip(e.status)}${remainChip}<span class="chip ait">${money(e.dailyRate)} ج/يوم</span><span class="chip">${esc(e.operators)} مشغل / ${esc(e.assistants)} مساعد</span></div></div><div class="card-actions"><button class="tiny-btn" data-view-equipment="${e.id}">تفاصيل</button>${k?`<button class="tiny-btn" data-preview-contract="${k.id}">العقد</button>`:''}</div></article>`;
}
function contractCard(k){
  const e = equipment(k.equipmentId); const c = company(k.companyId); const remain = daysLeft(k.end); const dueDate = nextDueDate(k); const dueSoon = daysLeft(dueDate) <= Number(k.alertDays || 2);
  return `<article class="list-card"><div class="thumb">ع</div><div class="list-body"><h3>${esc(k.title)}</h3><p>${esc(c?.name||'-')} · ${esc(e?.type || '-')} ${esc(e?.brand || '')}<br>${esc(k.start)} إلى ${esc(k.end)}</p><div class="meta-row">${statusChip(k.status)}<span class="chip ${remain <= 14 && remain>=0 ? 'warn': remain<0 ? 'bad':'good'}">${remain<0?'منتهي':remain+' يوم'}</span><span class="chip ait">${money(k.dailyRate)} ج/يوم</span><span class="chip ${dueSoon?'warn':'good'}">استحقاق ${formatDate(dueDate)}</span><span class="chip bad">متبقي ${money(dueBalance(k))}</span></div></div><div class="card-actions"><button class="tiny-btn" data-preview-contract="${k.id}">معاينة</button><button class="tiny-btn" data-register-payment="${k.id}">دفعة</button></div></article>`;
}
function financeForCompany(companyId){
  const ks = AIT.data.contracts.filter(k=>k.companyId===companyId);
  return ks.length ? ks.map(k=>contractCard(k)).join('') : '<div class="empty">لا توجد مستحقات لهذه الشركة</div>';
}

function openEquipment(id){ AIT.selectedEquipmentId = id; renderEquipmentDetail(); navigate('equipmentDetailScreen'); }
function renderEquipmentDetail(){
  const e = equipment(AIT.selectedEquipmentId); if(!e) return; const c = company(e.companyId); const k = contractForEquipment(e.id); const remain = k ? daysLeft(k.end) : null;
  $('#equipmentDetail').innerHTML = `<div class="detail-hero"><h2>${esc(e.type)} ${esc(e.brand)} ${esc(e.model)}</h2><p>${esc(c?.name||'-')}<br>${esc(e.location)}</p><div class="stats-row"><div class="stat-box"><b>${esc(e.status)}</b><span>الحالة</span></div><div class="stat-box"><b>${k ? (remain<0?'0':remain) : '-'}</b><span>أيام متبقية</span></div><div class="stat-box"><b>${money(e.dailyRate)}</b><span>ج/يوم</span></div></div></div>
  <div class="info-grid">${infoLine('رقم الشاسيه', e.chassis)}${infoLine('رقم المحرك', e.engine)}${infoLine('رقم الرسالة الجمركية', e.customs)}${infoLine('بيانات الاستيراد', e.importData)}${infoLine('سنة الصنع', e.year)}${infoLine('المالك حسب المستند', e.docOwner)}${infoLine('عنوان المالك', e.docAddress)}${infoLine('جهة التشغيل', e.operationOwner)}${infoLine('عدد المشغلين', e.operators)}${infoLine('عدد المساعدين', e.assistants)}${infoLine('مسؤولية الوقود', e.fuelResp)}${infoLine('مسؤولية الصيانة', e.maintenanceResp)}${infoLine('المستندات', (e.files||[]).join(' - '))}</div>
  <div class="preview-toolbar" style="margin-top:12px">${k?`<button class="primary-action" data-preview-contract="${k.id}">معاينة العقد</button>`:''}<button class="ghost-action" data-open="contractFormScreen" data-contract-equipment="${e.id}">إنشاء عقد</button></div>`;
  $$('#equipmentDetail [data-preview-contract]').forEach(b=>b.addEventListener('click',()=>{buildContractPreview(b.dataset.previewContract);navigate('contractPreviewScreen');}));
  $$('#equipmentDetail [data-contract-equipment]').forEach(b=>b.addEventListener('click',()=>{ const eq=equipment(b.dataset.contractEquipment); if(eq){ $('#contractCompany').value=eq.companyId; fillContractEquipment(); $('#contractEquipment').value=eq.id; hydrateContractFromEquipment(); } navigate('contractFormScreen'); }));
}
function showSelectedCompanyInfo(){
  const c = company($('#equipmentCompany').value);
  $('#selectedCompanyInfo').innerHTML = c ? `<b>${esc(c.name)}</b><br>المالك: ${esc(c.owner)} · الهاتف: ${esc(c.phone)}<br>البنك: ${esc(c.bankName)} · IBAN: ${esc(c.iban)}` : 'اختر الشركة لاستدعاء بياناتها تلقائياً';
}
function saveEquipment(e){
  e.preventDefault();
  const id = uid('e');
  const eq = {id, companyId:$('#equipmentCompany').value, type:$('#eqType').value.trim(), brand:$('#eqBrand').value.trim(), model:$('#eqModel').value.trim(), year:$('#eqYear').value.trim(), chassis:$('#eqChassis').value.trim(), engine:$('#eqEngine').value.trim(), customs:$('#eqCustoms').value.trim(), importData:$('#eqImportData').value.trim(), status:$('#eqStatus').value, location:$('#eqLocation').value.trim(), operationOwner:$('#eqOperationOwner').value, operators:Number($('#eqOperators').value||0), assistants:Number($('#eqAssistants').value||0), docOwner:$('#eqDocOwner').value.trim(), docAddress:$('#eqDocAddress').value.trim(), dailyRate:Number($('#eqDailyRate').value||0), transportCost:Number($('#eqTransportCost').value||0), workHours:Number($('#eqWorkHours').value||0), fuelResp:$('#eqFuelResp').value, maintenanceResp:$('#eqMaintenanceResp').value, files:Array.from($('#eqFiles').files||[]).map(f=>f.name)};
  AIT.data.equipment.unshift(eq);
  AIT.lastCreatedEquipmentId = id;
  save();
  const createContract = e.submitter?.dataset.createContract === '1';
  e.target.reset(); showSelectedCompanyInfo();
  if(createContract){ $('#contractCompany').value = eq.companyId; fillContractEquipment(); $('#contractEquipment').value = eq.id; hydrateContractFromEquipment(); navigate('contractFormScreen'); toast('تم حفظ المعدة. أكمل بيانات العقد الآن'); }
  else { AIT.selectedEquipmentId = id; renderEquipmentDetail(); navigate('equipmentDetailScreen'); toast('تم حفظ المعدة'); }
}

function hydrateContractFromEquipment(){
  const e = equipment($('#contractEquipment').value); if(!e) return;
  if($('#contractCompany').value !== e.companyId) $('#contractCompany').value = e.companyId;
  if(!$('#contractStart').value) $('#contractStart').value = todayISO();
  if(!$('#contractEnd').value) $('#contractEnd').value = addDaysISO(90, $('#contractStart').value || todayISO());
  $('#contractDailyRate').value = e.dailyRate || 0;
  $('#contractTransportStart').value = e.transportCost || 0;
  $('#contractFuelResp').value = e.fuelResp || 'المستأجر';
  $('#contractMaintenanceResp').value = e.maintenanceResp || 'المؤجر';
  updatePricingPreview();
}
function updatePricingPreview(){
  const mode = $('#contractPricingMode')?.value || 'daily';
  const e = equipment($('#contractEquipment')?.value);
  const density = Number($('#contractDensity')?.value || 1);
  const m3Rate = Number($('#contractM3Rate')?.value || 0);
  const hourlyRate = Number($('#contractHourlyRate')?.value || 0);
  let daily = Number($('#contractDailyRate')?.value || 0);
  if(mode === 'hourly' && hourlyRate && e) daily = hourlyRate * Number(e.workHours || 10);
  if(mode === 'm3' && m3Rate && !daily) daily = m3Rate * 300;
  if($('#contractTonRate')) $('#contractTonRate').value = m3Rate && density ? (m3Rate / density).toFixed(2) : '';
  if(mode !== 'daily' && daily && $('#contractDailyRate')) $('#contractDailyRate').value = Math.round(daily);
}
function saveContract(e){
  e.preventDefault(); updatePricingPreview();
  const eq = equipment($('#contractEquipment').value); const c = company($('#contractCompany').value);
  const density = Number($('#contractDensity').value || 1); const m3Rate = Number($('#contractM3Rate').value || 0);
  const k = {id:uid('k'), companyId:$('#contractCompany').value, equipmentId:$('#contractEquipment').value, title:'عقد إيجار '+(eq?.type || 'معدة'), start:$('#contractStart').value, end:$('#contractEnd').value, rentType:$('#contractRentType').value, status:$('#contractStatus').value, paymentMethod:$('#contractPaymentMethod').value, pricingMode:$('#contractPricingMode').value, dailyRate:Number($('#contractDailyRate').value||0), hourlyRate:Number($('#contractHourlyRate').value||0), m3Rate, density, tonRate:m3Rate && density ? Number((m3Rate/density).toFixed(2)) : 0, transportStart:Number($('#contractTransportStart').value||0), transportEnd:Number($('#contractTransportEnd').value||0), transportResponsible:$('#contractTransportResponsible').value, fuelResp:$('#contractFuelResp').value, maintenanceResp:$('#contractMaintenanceResp').value, advanceAmount:Number($('#contractAdvance').value||0), paidAmount:Number($('#contractAdvance').value||0), alertDays:Number($('#contractAlertDays').value||2), firstSign:'م. مصطفى عصام الدين أحمد خيرت', secondSign:c?.rep || c?.owner || '', notes:$('#contractNotes').value.trim(), payments:[]};
  if(k.advanceAmount > 0) k.payments.push({date:todayISO(), amount:k.advanceAmount, note:'دفعة مقدمة / سلفة'});
  AIT.data.contracts.unshift(k);
  if(eq) eq.status = 'شغالة';
  save(); e.target.reset(); fillSelects(); buildContractPreview(k.id); navigate('contractPreviewScreen'); toast('تم إنشاء العقد وتجهيز نسخة PDF');
}
function renderContracts(){
  const q = ($('#contractSearch')?.value || '').toLowerCase().trim();
  const list = AIT.data.contracts.filter(k => !q || JSON.stringify(k).toLowerCase().includes(q) || JSON.stringify(equipment(k.equipmentId)||{}).toLowerCase().includes(q) || JSON.stringify(company(k.companyId)||{}).toLowerCase().includes(q));
  $('#contractsList').innerHTML = list.map(k=>contractCard(k)).join('') || '<div class="empty">لا توجد عقود</div>';
  $$('#contractsList [data-preview-contract]').forEach(b => b.addEventListener('click', () => { buildContractPreview(b.dataset.previewContract); navigate('contractPreviewScreen'); }));
  $$('#contractsList [data-register-payment]').forEach(b => b.addEventListener('click', () => registerPayment(b.dataset.registerPayment)));
}
function registerPayment(contractId){
  const k = contract(contractId); if(!k) return;
  const amount = Number(prompt('أدخل قيمة الدفعة بالجنيه:', String(Math.min(cycleAmount(k), dueBalance(k)) || 0)) || 0);
  if(!amount || amount <= 0) return;
  const note = prompt('ملاحظة الدفعة:', 'دفعة مستحقات') || 'دفعة مستحقات';
  k.payments ||= []; k.payments.unshift({date:todayISO(), amount, note}); k.paidAmount = Number(k.paidAmount||0) + amount;
  save(); toast('تم تسجيل الدفعة وتحديث الرصيد');
}

function saveShift(e){
  e.preventDefault(); calcShiftTon();
  AIT.data.shifts.unshift({id:uid('s'), equipmentId:$('#shiftEquipment').value, date:$('#shiftDate').value || todayISO(), mine:$('#shiftMine').value.trim(), location:$('#shiftLocation').value.trim(), driver:$('#shiftDriver').value.trim(), assistant:$('#shiftAssistant').value.trim(), hours:Number($('#shiftHours').value||0), m3:Number($('#shiftM3').value||0), density:Number($('#shiftDensity').value||1), ton:Number($('#shiftTon').value||0), fuel:Number($('#shiftFuel').value||0)});
  save(); e.target.reset(); toast('تم حفظ الوردية');
}
function calcShiftTon(){ $('#shiftTon').value = (Number($('#shiftM3').value||0) * Number($('#shiftDensity').value||1)).toFixed(2); }
function renderShifts(){
  $('#shiftsList').innerHTML = AIT.data.shifts.map(s=>{const e=equipment(s.equipmentId);return `<article class="list-card"><div class="thumb">و</div><div class="list-body"><h3>${esc(e?.type||'-')} ${esc(e?.brand||'')}</h3><p>${esc(s.mine)} · ${esc(s.location)}<br>${esc(s.date)} · السائق: ${esc(s.driver)} · المساعد: ${esc(s.assistant||'-')}</p><div class="meta-row"><span class="chip ait">${money(s.hours)} ساعة</span><span class="chip good">${money(s.m3)} م³</span><span class="chip">${money(s.ton)} طن</span><span class="chip warn">${money(s.fuel)} لتر</span></div></div></article>`}).join('') || '<div class="empty">لا توجد ورديات</div>';
}
function renderFinance(){
  $('#financeList').innerHTML = AIT.data.contracts.map(k=>{const c=company(k.companyId); const e=equipment(k.equipmentId); const dueDate = nextDueDate(k); const alert = daysLeft(dueDate) <= Number(k.alertDays||2); return `<article class="list-card finance-card"><div class="thumb">$</div><div class="list-body"><h3>${esc(c?.name||'-')}</h3><p>${esc(e?.type||'-')} ${esc(e?.brand||'')} · السداد: ${esc(k.paymentMethod)} · الاستحقاق القادم: ${formatDate(dueDate)}</p><div class="meta-row"><span class="chip ait">دورة ${money(cycleAmount(k))}</span><span class="chip good">مدفوع ${money(k.paidAmount)}</span><span class="chip bad">متبقي ${money(dueBalance(k))}</span><span class="chip ${alert?'warn':'good'}">تنبيه قبل ${esc(k.alertDays)} يوم</span></div></div><div class="card-actions"><button class="tiny-btn" data-register-payment="${k.id}">تسجيل دفعة</button><button class="tiny-btn" data-preview-contract="${k.id}">العقد</button></div></article>`}).join('') || '<div class="empty">لا توجد مستحقات</div>';
  $$('#financeList [data-register-payment]').forEach(b => b.addEventListener('click', () => registerPayment(b.dataset.registerPayment)));
  $$('#financeList [data-preview-contract]').forEach(b => b.addEventListener('click', () => { buildContractPreview(b.dataset.previewContract); navigate('contractPreviewScreen'); }));
}
function buildReport(type){
  const contractBalance = AIT.data.contracts.reduce((s,k)=>s+dueBalance(k),0);
  const paid = AIT.data.contracts.reduce((s,k)=>s+Number(k.paidAmount||0),0);
  const active = activeContracts();
  const rows = type === 'finance' ? [
    ['إجمالي العقود النشطة', active.length], ['إجمالي المستحقات المتبقية', money(contractBalance)+' جنيه'], ['إجمالي المدفوع', money(paid)+' جنيه'], ['استحقاقات قريبة', active.filter(k=>daysLeft(nextDueDate(k))<=Number(k.alertDays||2)).length]
  ] : type === 'contracts' ? [
    ['العقود النشطة', active.length], ['العقود المنتهية', AIT.data.contracts.filter(k=>k.status==='منتهي').length], ['مطلوب تجديد خلال 14 يوم', active.filter(k=>daysLeft(k.end)<=14 && daysLeft(k.end)>=0).length], ['متوسط قيمة اليوم', money(active.reduce((s,k)=>s+Number(k.dailyRate||0),0) / Math.max(1, active.length))+' جنيه']
  ] : [
    ['إجمالي ساعات التشغيل', money(AIT.data.shifts.reduce((s,x)=>s+Number(x.hours||0),0))], ['إجمالي الإنتاج م³', money(AIT.data.shifts.reduce((s,x)=>s+Number(x.m3||0),0))], ['إجمالي الإنتاج طن', money(AIT.data.shifts.reduce((s,x)=>s+Number(x.ton||0),0))], ['إجمالي الوقود لتر', money(AIT.data.shifts.reduce((s,x)=>s+Number(x.fuel||0),0))]
  ];
  const title = type === 'finance' ? 'تقرير مالي' : type === 'contracts' ? 'تقرير العقود' : 'تقرير التشغيل';
  $('#reportOutput').innerHTML = `<div class="form-panel"><div class="form-title"><h2>${title}</h2><p>تقرير تشغيلي من بيانات التطبيق الحالية، قابل للتصدير عند ربط قاعدة البيانات.</p></div>${rows.map(r=>infoLine(r[0],r[1])).join('')}</div>`;
}

function buildContractPreview(contractId){
  const k = contract(contractId) || AIT.data.contracts[0]; const e = equipment(k.equipmentId); const c = company(k.companyId);
  if(!k || !e || !c){ $('#contractPreview').innerHTML = '<div class="empty">لا توجد بيانات كافية لإنشاء العقد</div>'; return; }
  AIT.selectedContractId = k.id;
  const lessee = {name:'شركة الياسمين الدولية للتجارة – شركة مساهمة مصرية', reg:'92364 - استثمار القاهرة', address:'294 ش عمر بن الخطاب متفرع من ش جسر السويس – جمهورية مصر العربية', rep:'السيد / مصطفى عصام الدين أحمد خيرت', title:'الرئيس التنفيذي', phone:'01008333661', tax:'521-088-429'};
  const page = (content) => `<section class="contract-page"><div class="contract-head"><div class="contract-logo">AIT.</div><div class="contract-brand"><span>YOUR SOURCE FOR ESSENTIAL ELEMENTS</span><b>AL YASMEIN INTERNATIONAL FOR TRADE</b></div><div class="contract-ship"></div></div><div class="doc-watermark"><div><span>YOUR SOURCE FOR</span>AIT.<span>EST. 1993 — EGYPT</span></div></div>${content}<div class="contract-foot"><div>polygon - sodic - bevely hills, B10.1, Sheikh Zayed City Giza</div><div>(+2) 01008333661<br>mkhairat@info-ait.com</div></div></section>`;
  const pricingLine = k.pricingMode === 'hourly' ? `سعر الساعة: ${money(k.hourlyRate)} جنيه، سعر اليوم المعتمد: ${money(k.dailyRate)} جنيه` : k.pricingMode === 'm3' ? `سعر المتر المكعب: ${money(k.m3Rate)} جنيه، كثافة الخام: ${k.density}، سعر الطن التلقائي: ${money(k.tonRate)} جنيه` : `سعر اليوم المعتمد: ${money(k.dailyRate)} جنيه`;
  const p1 = page(`<h2 class="doc-title">عقد إيجار ( ${esc(e.type || 'معدة')} )</h2>
    <div class="contract-section"><h3>أولاً: تاريخ التعاقد</h3><p>تم الاتفاق في يوم: ${formatDate(todayISO())} الموافق: ${formatDate(todayISO())}</p></div>
    <div class="contract-section"><h3>ثانياً: أطراف التعاقد</h3><p><b>الطرف الأول (المستأجر):</b><br>${lessee.name}<br>السجل التجاري: ${lessee.reg}<br>العنوان: ${lessee.address}<br>يمثلها: ${lessee.rep}<br>الصفة: ${lessee.title}<br>رقم الهاتف: ${lessee.phone}<br>البطاقة الضريبية: ${lessee.tax}</p><p><b>الطرف الثاني (المؤجر):</b><br>شركة: ${esc(c.name)}<br>ويمثلها: ${esc(c.owner)}<br>الصفة: ${esc(c.title || 'مالك')}<br>العنوان: ${esc(c.address)}<br>رقم الهاتف: ${esc(c.phone)}<br>السجل التجاري: ${esc(c.commercialNo)}<br>البطاقة الضريبية: ${esc(c.taxNo)}</p><p><b>البيانات البنكية للطرف الثاني:</b><br>البنك: ${esc(c.bankName)}<br>رقم الحساب: ${esc(c.bankAccount)}<br>IBAN: ${esc(c.iban)}<br>SWIFT: ${esc(c.swift)}</p></div>
    <div class="contract-section"><h3>ثالثاً: موضوع العقد</h3><p>يقوم الطرف الثاني بتأجير ${esc(e.type)} (${esc(e.brand)} ${esc(e.model)}) للطرف الأول للعمل بالموقع، وفقاً للبيانات التشغيلية والمالية الموضحة بهذا العقد.</p></div>`);
  const p2 = page(`<div class="contract-section"><h3>رابعاً: تفاصيل المعدة</h3><ul><li>النوع: ${esc(e.type)} ${esc(e.brand)} أو ما يعادله</li><li>الحالة: ${esc(e.status)} وصالحة للعمل حسب المعاينة</li><li>جهة التشغيل: ${esc(e.operationOwner)}</li><li>عدد المشغلين: ${esc(e.operators)} - عدد المساعدين: ${esc(e.assistants)}</li></ul></div>
    <div class="contract-section"><h3>خامساً: بيانات المعدة</h3><ul><li>الماركة: ${esc(e.brand)}</li><li>الموديل: ${esc(e.model)}</li><li>سنة الصنع: ${esc(e.year)}</li><li>رقم الشاسيه: ${esc(e.chassis)}</li><li>رقم المحرك: ${esc(e.engine)}</li><li>رقم الرسالة الجمركية: ${esc(e.customs)}</li></ul><p><b>بيانات الاستيراد والإفراج:</b><br>${esc(e.importData || '-')}</p><p><b>بيانات المالك حسب المستند</b><br>اسم المالك: ${esc(e.docOwner || c.owner)}<br>عنوان المالك: ${esc(e.docAddress || c.address)}</p></div>
    <div class="contract-section"><h3>سادساً: مدة العقد</h3><p>تبدأ من: ${formatDate(k.start)}<br>وتنتهي في: ${formatDate(k.end)}<br>أو تنتهي بانتهاء المشروع أيهما أقرب، مع إمكانية التجديد باتفاق الطرفين.</p></div>
    <div class="contract-section"><h3>سابعاً: القيمة المالية وطريقة التسعير</h3><p>${pricingLine}<br>نوع الإيجار: ${esc(k.rentType)}<br>تكلفة نقل بداية العقد: ${money(k.transportStart)} جنيه<br>تكلفة نقل نهاية العقد: ${money(k.transportEnd)} جنيه<br>مسؤول النقل: ${esc(k.transportResponsible)}</p></div>`);
  const internalBase = Math.round(Number(k.dailyRate||e.dailyRate||0)*0.6); const driver = 2000; const living = 1500; const dailyTotal = internalBase+driver+living; const supervision = Math.round(dailyTotal*.17); const net = dailyTotal+supervision;
  const p3 = page(`<div class="contract-section"><h3>ثامناً: دورة السداد والمستحقات</h3><ul><li>آلية السداد: ${esc(k.paymentMethod)}</li><li>موعد الاستحقاق القادم: ${formatDate(nextDueDate(k))}</li><li>قيمة الدورة التقديرية: ${money(cycleAmount(k))} جنيه</li><li>إجمالي قيمة العقد التقديرية: ${money(contractGross(k))} جنيه</li><li>المدفوع حتى تاريخه: ${money(k.paidAmount)} جنيه</li><li>الرصيد المتبقي: ${money(dueBalance(k))} جنيه</li><li>التنبيه قبل الاستحقاق بـ ${esc(k.alertDays)} يوم.</li></ul></div>
    <div class="contract-section"><h3>تاسعاً: تفصيل التكاليف الداخلية (للتوضيح)</h3></div><table class="cost-table"><thead><tr><th>البيان</th><th>القيمة</th></tr></thead><tbody><tr><td>إيجار يومي شامل المعدة</td><td>${money(internalBase)}</td></tr><tr><td>إقامة السائق</td><td>${money(driver)}</td></tr><tr><td>انتقالات</td><td>حسب مسؤولية النقل</td></tr><tr><td>مصاريف معيشة</td><td>${money(living)}</td></tr><tr><td>إجمالي التكلفة اليومية</td><td>${money(dailyTotal)}</td></tr><tr><td>إشراف ومتابعة</td><td>${money(supervision)}</td></tr><tr><th>الصافي</th><th>${money(net)}</th></tr></tbody></table><p style="position:relative;z-index:1;font-size:12px"><b>ملاحظة:</b> هذه التكاليف داخلية ولا يعتد بها محاسبياً أمام الطرف الأول.</p>
    <div class="contract-section"><h3>عاشراً: الوقود والصيانة</h3><ul><li>يتحمل ${esc(k.fuelResp || e.fuelResp)} تكلفة الوقود بالكامل.</li><li>يتحمل ${esc(k.maintenanceResp || 'المؤجر')} أعمال الصيانة الدورية والإصلاحات.</li></ul></div>`);
  const p4 = page(`<div class="contract-section"><h3>الحادي عشر: التزامات الطرف الثاني</h3><ul><li>توفير المعدة بحالة جيدة.</li><li>توفير سائق مؤهل ومساعدين حسب بيانات التشغيل.</li><li>الالتزام بمواعيد العمل وساعات التشغيل المتفق عليها.</li><li>توفير المستندات الرسمية الخاصة بالمعدة عند الطلب.</li></ul></div>
    <div class="contract-section"><h3>الثاني عشر: التزامات الطرف الأول</h3><ul><li>توفير موقع العمل المناسب وتأمين المعدة داخل الموقع.</li><li>سداد المستحقات في مواعيدها حسب دورة السداد.</li><li>توفير الحراسة والالتزام بإجراءات السلامة المهنية.</li></ul></div>
    <div class="contract-section"><h3>الثالث عشر: ساعات العمل والأعطال</h3><ul><li>عدد ساعات العمل اليومية: ${esc(e.workHours || '..........')} ساعة.</li><li>لا يتم احتساب فترات التوقف الناتجة عن الأعطال الفنية المثبتة.</li><li>يتم احتساب اليوم في حالة التوقف بسبب الموقع أو عدم جاهزية التشغيل من جانب المستأجر.</li></ul></div>
    <div class="contract-section"><h3>الرابع عشر: أحكام عامة</h3><ol><li>عدم سوء استخدام المعدة أو تحميلها بما يتجاوز طاقتها.</li><li>عدم تأجير المعدة من الباطن دون موافقة كتابية.</li><li>تختص محاكم الجيزة بنظر أي نزاع.</li></ol></div>`);
  const p5 = page(`<div class="contract-section"><h3>الخامس عشر: ملاحظات خاصة</h3><p>${esc(k.notes || 'لا توجد ملاحظات إضافية.')}</p></div>
    <div class="contract-section"><h3>السادس عشر: أحكام ختامية</h3><ol><li>هذا العقد ملزم قانوناً للطرفين.</li><li>لا يجوز تعديل أي بند إلا بموافقة كتابية من الطرفين.</li><li>حرر العقد من نسختين بيد كل طرف نسخة للعمل بها.</li></ol></div>
    <div class="contract-section"><h3>التوقيعات</h3><div class="sign-grid"><div class="sign-box"><b>الطرف الأول (شركة الياسمين)</b><p>الاسم: ${esc(k.firstSign)}</p><p>التوقيع</p></div><div class="sign-box"><b>الطرف الثاني (${esc(c.name)})</b><p>الاسم: ${esc(k.secondSign || c.owner)}</p><p>التوقيع</p></div></div></div>`);
  $('#contractPreview').innerHTML = p1+p2+p3+p4+p5;
}
function formatDate(d){ if(!d) return '.... / .... / ........'; const x = new Date(d); if(isNaN(x)) return d; return x.toLocaleDateString('ar-EG'); }

if('serviceWorker' in navigator){ window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(()=>{})); }
init();
