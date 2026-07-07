(() => {
  'use strict';

  const STORE_KEY = 'ait_pit2port_erp_v2';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const state = {
    route: 'home',
    currentMineId: 'mine-1',
    role: 'Administrator',
    selectedCompanyId: null,
    selectedEquipmentId: null,
    companyTab: 'basic',
    reportType: 'equipment',
    data: loadData()
  };

  const pageMeta = {
    home: ['لوحة التحكم', 'مرحباً، تابع تشغيل المعدات والعقود والإنتاج اليوم.'],
    companies: ['شركات التأجير', 'ملفات قانونية وبنكية ومرفقات وشركات المعدات.'],
    equipments: ['المعدات', 'إدارة الأسطول والعقود والحالة التشغيلية.'],
    operations: ['تشغيل المعدات', 'بدء وإنهاء الورديات وتسجيل أسباب التوقف.'],
    quality: ['الجودة والإنتاج', 'إنشاء Lots وحساب الحجم والوزن والكثافة تلقائياً.'],
    consumption: ['استهلاك المعدات', 'وقود وزيوت وفلاتر وقطع غيار يومية.'],
    contracts: ['العقود', 'إنشاء ومراجعة وطباعة عقود إيجار المعدات.'],
    accounts: ['الحسابات', 'فواتير تلقائية ودفعات ومستحقات.'],
    reports: ['التقارير', 'تقارير عربية وإنجليزية وCSV وطباعة.'],
    notifications: ['الإشعارات', 'تنبيهات الصيانة والعقود والمدفوعات والتراخيص.'],
    settings: ['الإعدادات', 'الأدوار والصلاحيات وبيانات النظام.'],
    more: ['المزيد', 'كل موديولات نظام AIT Pit2Port ERP.']
  };

  function loadData() {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      try { return normalize(JSON.parse(saved)); } catch (e) { console.warn(e); }
    }
    const data = createDemoData();
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    return data;
  }

  function normalize(d) {
    const base = createDemoData();
    return Object.assign(base, d || {});
  }

  function persist() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state.data));
  }

  function createDemoData() {
    const companyNames = [
      'Delta Heavy Equipment', 'Al Manar Mining Rentals', 'Nile Contractors Fleet', 'Sinai Earth Movers',
      'Red Sea Equipment Co.', 'Golden Loader Rental', 'Marsa Alam Heavy Lift', 'Eastern Desert Services'
    ];
    const mines = ['Marsa Alam Mine 1', 'Marsa Alam Mine 2', 'Eastern Desert Mine', 'Sukari Support Area', 'Wadi El Gemal Quarry'].map((name, i) => ({
      id: `mine-${i + 1}`, name, code: `M-${String(i + 1).padStart(2, '0')}`
    }));
    const zones = Array.from({ length: 18 }, (_, i) => ({
      id: `zone-${i + 1}`,
      mineId: mines[i % mines.length].id,
      name: `Zone ${String.fromCharCode(65 + (i % 6))}-${Math.floor(i / 6) + 1}`
    }));
    const subZones = Array.from({ length: 40 }, (_, i) => ({
      id: `sub-${i + 1}`,
      zoneId: zones[i % zones.length].id,
      name: `Sub Zone ${i + 1}`,
      subSub: `Bench ${((i % 5) + 1)}`
    }));
    const banks = ['CIB', 'QNB Al Ahli', 'Banque Misr', 'NBE', 'Alex Bank'];
    const people = ['أحمد محمود', 'محمد علي', 'كريم حسن', 'مصطفى سمير', 'إسلام خالد', 'حسن جابر', 'مينا عادل', 'توماس فايز', 'مارلين سامي', 'حجازي ثابت', 'نور الدين', 'عمر أشرف', 'محمود عادل', 'رامي وليم', 'سيد فتحي', 'ياسر كمال', 'أمير فؤاد', 'خالد منصور', 'باسم إيهاب', 'عماد فاروق', 'كامل رزق', 'جورج فريد', 'مروان سليم', 'شادي يوسف', 'إيهاب صابر'];
    const companies = companyNames.map((name, i) => ({
      id: `co-${i + 1}`,
      name,
      ownerName: people[i],
      ownerPhone: `010${(10000000 + i * 381729).toString().slice(0, 8)}`,
      ownerNationalId: `29${String(800000000000 + i * 762931)}`,
      ownerIdImage: `owner-id-${i + 1}.jpg`,
      representative: people[(i + 5) % people.length],
      representativePosition: i % 2 ? 'Operations Representative' : 'Authorized Signatory',
      representativePhone: `011${(10000000 + i * 129877).toString().slice(0, 8)}`,
      representativeNationalId: `30${String(100000000000 + i * 498123)}`,
      representativeIdImage: `rep-id-${i + 1}.jpg`,
      commercialRegisterNumber: `CR-${2026}${1000 + i}`,
      commercialRegisterImage: `commercial-register-${i + 1}.pdf`,
      taxCardNumber: `TX-${310000 + i * 27}`,
      taxCardImage: `tax-card-${i + 1}.pdf`,
      address: `${12 + i} AIT Business District, Cairo - Egypt`,
      email: `contact${i + 1}@${name.toLowerCase().replaceAll(' ', '').replaceAll('.', '')}.com`,
      notes: i % 2 ? 'Preferred supplier for emergency replacement equipment.' : 'Approved supplier with complete legal documents.',
      ownerType: i % 2 ? 'Representative' : 'Owner',
      bank: { bankName: banks[i % banks.length], accountNumber: `EGACC${20260000 + i}`, iban: `EG38${String(90000000000000000000n + BigInt(i * 33333333)).slice(0, 20)}`, swift: `${banks[i % banks.length].slice(0, 4).toUpperCase()}EGCX` },
      attachments: [
        { id: `att-cr-${i}`, type: 'Commercial Register', file: `commercial-register-${i + 1}.pdf`, description: 'Valid commercial register copy' },
        { id: `att-tax-${i}`, type: 'Tax Card', file: `tax-card-${i + 1}.pdf`, description: 'Tax card document' },
        { id: `att-contract-${i}`, type: 'Contracts', file: `framework-contract-${i + 1}.pdf`, description: 'Framework agreement' }
      ],
      createdAt: addDays(-140 + i * 8)
    }));

    const drivers = Array.from({ length: 25 }, (_, i) => ({ id: `driver-${i + 1}`, name: people[i], phone: `010${(22200000 + i * 20411).toString().slice(0, 8)}`, role: 'Driver' }));
    const helpers = Array.from({ length: 25 }, (_, i) => ({ id: `helper-${i + 1}`, name: people[(i + 8) % people.length], phone: `012${(33300000 + i * 19433).toString().slice(0, 8)}`, role: 'Helper' }));
    const types = ['Excavator', 'Loader', 'Bulldozer', 'Grader', 'Dump Truck', 'Drilling Rig', 'Crusher Feed Loader', 'Water Tanker'];
    const brands = ['Caterpillar', 'Komatsu', 'Volvo', 'Hitachi', 'Liebherr', 'Doosan', 'JCB', 'XCMG'];
    const statuses = ['Running', 'Available', 'Maintenance', 'Stopped'];
    const equipments = Array.from({ length: 60 }, (_, i) => {
      const company = companies[i % companies.length];
      const mine = mines[i % mines.length];
      const zone = zones[i % zones.length];
      return {
        id: `eq-${i + 1}`,
        companyId: company.id,
        code: `AIT-EQ-${String(i + 1).padStart(4, '0')}`,
        name: `${brands[i % brands.length]} ${types[i % types.length]} ${320 + (i % 9) * 10}`,
        type: types[i % types.length],
        brand: brands[i % brands.length],
        model: `${types[i % types.length].slice(0, 2).toUpperCase()}-${2020 + (i % 6)}`,
        year: 2017 + (i % 8),
        engineNumber: `ENG-${700000 + i * 91}`,
        chassisNumber: `CH-${900000 + i * 119}`,
        importDeclaration: `IMP-${2026}-${5000 + i}`,
        importType: i % 2 ? 'Temporary Admission' : 'Permanent Import',
        importSerial: `SER-${7000 + i}`,
        status: statuses[i % statuses.length],
        currentDriverId: drivers[i % drivers.length].id,
        currentHelperId: helpers[i % helpers.length].id,
        mineId: mine.id,
        zoneId: zone.id,
        subZoneId: subZones[i % subZones.length].id,
        photo: `equipment-${(i % 8) + 1}.jpg`,
        receivingPhotos: [`receive-${i + 1}-1.jpg`, `receive-${i + 1}-2.jpg`],
        ownerAuto: company.ownerName,
        addressAuto: company.address,
        bankAuto: company.bank.bankName,
        licenseExpiry: addDays(25 + (i % 80)),
        insuranceExpiry: addDays(40 + (i % 120)),
        importExpiry: addDays(15 + (i % 150))
      };
    });

    const rentalTypes = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const calcModes = ['Hourly', 'Cubic Meter', 'Daily'];
    const contracts = Array.from({ length: 40 }, (_, i) => {
      const eq = equipments[i];
      const start = addDays(-60 + i);
      const end = addDays(20 + (i % 95));
      const calcMode = calcModes[i % calcModes.length];
      const daily = 14000 + (i % 10) * 1700;
      const hourly = 1500 + (i % 7) * 220;
      const m3 = 42 + (i % 12) * 5;
      const density = [1.5, 1.6, 1.75][i % 3];
      return {
        id: `ct-${i + 1}`,
        companyId: eq.companyId,
        equipmentId: eq.id,
        contractDate: addDays(-65 + i),
        startDate: start,
        endDate: end,
        transportationCost: 40000 + i * 850,
        returnTransportationCost: 25000 + i * 500,
        whoPays: i % 2 ? 'Lessor' : 'Lessee',
        rentalType: rentalTypes[i % rentalTypes.length],
        costCalculation: calcMode,
        hourlyRate: hourly,
        m3Rate: m3,
        pricePerTon: Number((m3 / density).toFixed(2)),
        dailyRate: daily,
        maintenanceResponsibility: i % 3 ? 'Lessor' : 'Lessee',
        maintenanceNotes: i % 3 ? '' : 'Lessee must provide preventive maintenance reports every week.',
        fuelResponsibility: i % 2 ? 'Lessor' : 'Lessee',
        operatingResponsibility: i % 4 ? 'Lessor' : 'Lessee',
        operatorCount: i % 4 ? 1 : 2,
        helpersCount: i % 4 ? 1 : 2,
        advancePayment: 25000 + (i % 8) * 5000,
        paymentMethod: ['Daily', 'Weekly', 'Monthly'][i % 3],
        status: daysBetween(new Date(), new Date(end)) < 0 ? 'Expired' : (daysBetween(new Date(), new Date(end)) <= 15 ? 'Ending Soon' : 'Running'),
        signedContract: i % 5 === 0 ? `signed-contract-${i + 1}.pdf` : '',
        history: [`Created ${start}`, `Reviewed by Accounts`, i % 5 === 0 ? 'Signed uploaded' : 'Pending signature']
      };
    });

    const shifts = Array.from({ length: 300 }, (_, i) => {
      const eq = equipments[i % equipments.length];
      const lotM3 = 120 + (i % 16) * 22;
      const density = [1.5, 1.6, 1.75][i % 3];
      return {
        id: `sh-${i + 1}`,
        date: addDays(-(i % 45)),
        startTime: `${String(6 + (i % 5)).padStart(2, '0')}:00`,
        endTime: `${String(15 + (i % 4)).padStart(2, '0')}:30`,
        equipmentId: eq.id,
        mineId: eq.mineId,
        zoneId: eq.zoneId,
        subZoneId: eq.subZoneId,
        driverId: eq.currentDriverId,
        helperId: eq.currentHelperId,
        hours: 8 + (i % 4),
        stopReason: ['End Of Shift', 'Maintenance', 'Mechanical Failure', 'Waiting Truck', 'Waiting Material', 'Administrative', 'Weather', 'Fuel', 'Other'][i % 9],
        notes: i % 9 === 2 ? 'Hydraulic pressure issue reported.' : 'Shift completed and logged.',
        volumeM3: lotM3,
        density,
        weightTon: Number((lotM3 * density).toFixed(2))
      };
    });

    const lotTypes = ['Extraction', 'Before Crusher', 'After Crusher'];
    const lots = Array.from({ length: 250 }, (_, i) => {
      const lotType = lotTypes[i % lotTypes.length];
      const density = lotType === 'Extraction' ? 1.5 : lotType === 'Before Crusher' ? 1.6 : 1.75;
      const baseCircumference = 18 + (i % 12) * 1.6;
      const height = 3 + (i % 5) * .45;
      const volume = Number((Math.pow(baseCircumference / (2 * Math.PI), 2) * Math.PI * height).toFixed(2));
      return {
        id: `lot-${i + 1}`,
        date: addDays(-(i % 45)),
        mineId: mines[i % mines.length].id,
        zoneId: zones[i % zones.length].id,
        subZoneId: subZones[i % subZones.length].id,
        lotType,
        baseCircumference,
        height,
        density,
        estimatedVolume: volume,
        estimatedWeight: Number((volume * density).toFixed(2)),
        materialSize: lotType === 'Extraction' ? '0.5 m to 2.0 m' : lotType === 'Before Crusher' ? '10 cm to 70 cm' : '2 mm to 7 cm',
        linkedEquipmentId: equipments[i % equipments.length].id,
        createdBy: 'Quality Department'
      };
    });

    const consumptionTypes = ['Fuel', 'Water', 'Engine Oil', 'Hydraulic Oil', 'Grease', 'Drill Bits', 'Oil Filter', 'Fuel Filter', 'Air Filter', 'Battery', 'Tyres', 'Spare Parts'];
    const consumption = Array.from({ length: 200 }, (_, i) => ({
      id: `con-${i + 1}`,
      date: addDays(-(i % 55)),
      equipmentId: equipments[i % equipments.length].id,
      type: consumptionTypes[i % consumptionTypes.length],
      quantity: 20 + (i % 13) * 9,
      unit: i % 4 === 0 ? 'pcs' : 'liter',
      notes: i % 3 ? 'Normal daily consumption.' : 'Attached photo for warehouse review.',
      photos: [`consumption-${i + 1}.jpg`]
    }));

    const invoices = Array.from({ length: 150 }, (_, i) => {
      const ct = contracts[i % contracts.length];
      const amount = ct.costCalculation === 'Hourly' ? 10 * ct.hourlyRate : ct.costCalculation === 'Cubic Meter' ? 350 * ct.m3Rate : ct.dailyRate;
      return {
        id: `inv-${i + 1}`,
        contractId: ct.id,
        companyId: ct.companyId,
        equipmentId: ct.equipmentId,
        date: addDays(-(i % 80)),
        dueDate: addDays(3 + (i % 30)),
        amount,
        status: i % 5 === 0 ? 'Overdue' : i % 4 === 0 ? 'Paid' : 'Upcoming',
        source: ct.costCalculation === 'Hourly' ? 'Operating Hours' : ct.costCalculation === 'Cubic Meter' ? 'Quality Production' : 'Contract Daily Rate'
      };
    });

    const payments = Array.from({ length: 100 }, (_, i) => {
      const inv = invoices[i % invoices.length];
      return {
        id: `pay-${i + 1}`,
        invoiceId: inv.id,
        companyId: inv.companyId,
        date: addDays(-(i % 65)),
        amount: Math.round(inv.amount * (i % 3 === 0 ? .5 : 1)),
        method: ['Bank Transfer', 'Cash', 'Cheque'][i % 3],
        notes: 'Payment recorded by accounts.'
      };
    });

    const roles = ['Administrator', 'Operation Manager', 'Quality', 'Accounts', 'Maintenance', 'Warehouse', 'Driver', 'Viewer'];
    const permissions = roles.map(role => ({
      role,
      view: true,
      add: !['Viewer'].includes(role),
      edit: !['Viewer', 'Driver'].includes(role),
      delete: ['Administrator'].includes(role),
      print: !['Driver'].includes(role),
      download: !['Driver'].includes(role),
      financialAccess: ['Administrator', 'Accounts', 'Operation Manager'].includes(role),
      reports: !['Driver'].includes(role)
    }));

    return { companies, equipments, drivers, helpers, mines, zones, subZones, contracts, shifts, lots, consumption, invoices, payments, permissions };
  }

  function addDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }
  function daysBetween(a, b) { return Math.ceil((b - a) / 86400000); }
  function fmt(n) { return Number(n || 0).toLocaleString('ar-EG'); }
  function money(n) { return `${fmt(Math.round(n || 0))} ج.م`; }
  function byId(arr, id) { return arr.find(x => x.id === id) || {}; }
  function escapeHtml(v) { const div = document.createElement('div'); div.textContent = String(v ?? ''); return div.innerHTML; }
  function statusChip(status) {
    const s = String(status || '-');
    const cls = ['Running', 'Available', 'Paid', 'End Of Shift'].includes(s) ? 'good' : ['Stopped', 'Expired', 'Overdue', 'Mechanical Failure'].includes(s) ? 'bad' : ['Maintenance', 'Ending Soon', 'Upcoming'].includes(s) ? 'warn' : 'info';
    return `<span class="chip ${cls}">${escapeHtml(s)}</span>`;
  }
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 2300);
  }

  function init() {
    $('#todayLabel').textContent = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    $('#mineSelector').innerHTML = state.data.mines.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
    $('#mineSelector').value = state.currentMineId;
    $('#mineSelector').addEventListener('change', e => {
      state.currentMineId = e.target.value;
      $('#topMine').textContent = byId(state.data.mines, state.currentMineId).name;
      render();
    });
    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('input', onInput);
    $('#notifyBtn').addEventListener('click', () => navigate('notifications'));
    $('#topMine').textContent = byId(state.data.mines, state.currentMineId).name;
    if (location.hash) state.route = location.hash.replace('#', '') || 'home';
    render();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }

  function navigate(route) {
    state.route = route;
    if (!pageMeta[route] && route !== 'companyDetail' && route !== 'equipmentDetail') state.route = 'home';
    history.replaceState(null, '', `#${state.route}`);
    render();
  }

  function render() {
    const meta = pageMeta[state.route] || (state.route === 'companyDetail' ? ['تفاصيل الشركة', 'ملف الشركة والمعدات والماليات والتقارير.'] : ['تفاصيل المعدة', 'الحالة والعقد والتشغيل.']);
    $('#pageTitle').textContent = meta[0];
    $('#pageHint').textContent = meta[1];
    $$('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.route === navRoute(state.route)));
    const view = $('#view');
    view.innerHTML = routeView();
    $('#notifyDot').style.display = getNotifications().length ? 'block' : 'none';
  }

  function navRoute(route) {
    if (['home'].includes(route)) return 'home';
    if (['equipments', 'equipmentDetail', 'contracts'].includes(route)) return 'equipments';
    if (['quality'].includes(route)) return 'quality';
    if (['reports'].includes(route)) return 'reports';
    return 'more';
  }

  function routeView() {
    switch (state.route) {
      case 'home': return renderHome();
      case 'companies': return renderCompanies();
      case 'companyDetail': return renderCompanyDetail();
      case 'equipments': return renderEquipments();
      case 'equipmentDetail': return renderEquipmentDetail();
      case 'contracts': return renderContracts();
      case 'operations': return renderOperations();
      case 'quality': return renderQuality();
      case 'consumption': return renderConsumption();
      case 'accounts': return renderAccounts();
      case 'notifications': return renderNotifications();
      case 'reports': return renderReports();
      case 'settings': return renderSettings();
      case 'more': return renderMore();
      default: return renderHome();
    }
  }

  function calcKpis() {
    const eq = state.data.equipments;
    const contracts = state.data.contracts;
    const today = new Date().toISOString().slice(0, 10);
    const todayShifts = state.data.shifts.filter(s => s.date === today || daysBetween(new Date(s.date), new Date()) <= 1).slice(0, 16);
    const todaysLots = state.data.lots.filter(l => l.date === today || daysBetween(new Date(l.date), new Date()) <= 1).slice(0, 12);
    return {
      companies: state.data.companies.length,
      totalEquipments: eq.length,
      running: eq.filter(e => e.status === 'Running').length,
      maintenance: eq.filter(e => e.status === 'Maintenance').length,
      stopped: eq.filter(e => e.status === 'Stopped').length,
      runningContracts: contracts.filter(c => c.status === 'Running').length,
      endingSoon: contracts.filter(c => c.status === 'Ending Soon').length,
      production: todaysLots.reduce((s, l) => s + l.estimatedWeight, 0),
      fuel: state.data.consumption.filter(c => c.type === 'Fuel').slice(0, 18).reduce((s, c) => s + c.quantity, 0),
      hours: todayShifts.reduce((s, c) => s + c.hours, 0),
      due: state.data.invoices.filter(i => ['Upcoming', 'Overdue'].includes(i.status)).slice(0, 15).reduce((s, i) => s + i.amount, 0)
    };
  }

  function renderHome() {
    const k = calcKpis();
    return `<section class="panel">
      <div class="hero">
        <div class="hero-icon">⛏️</div>
        <div><h2>صباح الخير يا AIT</h2><p>لوحة تشغيل Enterprise للمعدات والتعدين والعقود من Pit إلى Port.</p></div>
      </div>
      <div class="kpi-grid">
        ${kpi('🏢', 'Equipment Companies', k.companies, 'شركة ومقاول')}
        ${kpi('🚜', 'Total Equipments', k.totalEquipments, 'معدة')}
        ${kpi('✅', 'Running Equipments', k.running, 'تعمل الآن', 'good')}
        ${kpi('🛠️', 'Maintenance Equipments', k.maintenance, 'داخل الصيانة', 'warn')}
        ${kpi('⛔', 'Stopped Equipments', k.stopped, 'متوقفة', 'bad')}
        ${kpi('📄', 'Running Contracts', k.runningContracts, 'عقد نشط')}
        ${kpi('⚠️', 'Contracts Ending Soon', k.endingSoon, 'تحتاج متابعة', 'warn')}
        ${kpi('🏗️', "Today's Production", fmt(k.production), 'طن')}
        ${kpi('⛽', "Today's Fuel", fmt(k.fuel), 'لتر')}
        ${kpi('⏱️', "Today's Operating Hours", fmt(k.hours), 'ساعة')}
        ${kpi('💰', "Today's Financial Due", money(k.due), 'مستحقات', 'warn')}
      </div>
      <div class="section-title"><div><h3>Quick Actions</h3><p>اختار الموديول المطلوب بسرعة</p></div></div>
      <div class="quick-grid">
        ${moduleCard('🏢','Equipment Companies','ملفات ومرفقات','companies')}
        ${moduleCard('🚜','Equipments','الأصول والحالات','equipments')}
        ${moduleCard('⚙️','Equipment Operation','ورديات وتشغيل','operations')}
        ${moduleCard('📋','Quality','Lots وإنتاج','quality')}
        ${moduleCard('⛽','Equipment Consumption','وقود وزيوت','consumption')}
        ${moduleCard('📄','Contracts','عقود وتجديد','contracts')}
        ${moduleCard('💰','Accounts','فواتير ودفعات','accounts')}
        ${moduleCard('📊','Reports','PDF / Excel','reports')}
        ${moduleCard('🔔','Notifications','تنبيهات','notifications')}
        ${moduleCard('⚙️','Settings','صلاحيات','settings')}
      </div>
    </section>`;
  }
  function kpi(icon, label, value, sub, cls = '') { return `<article class="kpi ${cls}"><span>${icon} ${label}</span><strong>${value}</strong><small>${sub}</small></article>`; }
  function moduleCard(icon, title, sub, route) { return `<button class="module-card" data-route="${route}"><i>${icon}</i><b>${title}</b><span>${sub}</span></button>`; }

  function renderCompanies() {
    return `<section class="panel">
      <div class="toolbar"><label class="search">⌕<input id="companySearch" placeholder="بحث باسم الشركة / المالك / السجل"></label><button class="btn primary" data-modal="companyForm">+ شركة</button></div>
      <div class="list">${state.data.companies.map(companyCard).join('')}</div>
    </section>`;
  }
  function companyCard(c) {
    const eqCount = state.data.equipments.filter(e => e.companyId === c.id).length;
    const running = state.data.equipments.filter(e => e.companyId === c.id && e.status === 'Running').length;
    const balance = state.data.invoices.filter(i => i.companyId === c.id && i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);
    return `<article class="card entity" data-company-search="${escapeHtml([c.name,c.ownerName,c.commercialRegisterNumber].join(' '))}">
      <div class="thumb">🏢</div><div class="entity-body"><h4>${escapeHtml(c.name)}</h4><p>${escapeHtml(c.ownerName)} - ${escapeHtml(c.ownerPhone)}<br>${escapeHtml(c.address)}</p>
      <div class="meta-row"><span class="chip info">${eqCount} معدات</span><span class="chip good">${running} شغالة</span><span class="chip warn">${money(balance)} مستحق</span></div>
      <div class="wide-actions"><button class="btn blue" data-company-id="${c.id}">تفاصيل</button><button class="btn ghost" data-report-company="${c.id}">تقرير</button></div></div>
    </article>`;
  }

  function renderCompanyDetail() {
    const c = byId(state.data.companies, state.selectedCompanyId) || state.data.companies[0];
    if (!c.id) return `<div class="empty">اختر شركة أولاً</div>`;
    const tabs = [['basic','Basic Information'],['equipments','Company Equipments'],['financial','Financial'],['reports','Reports']];
    return `<section class="panel">
      <div class="card entity"><div class="thumb">🏢</div><div class="entity-body"><h4>${escapeHtml(c.name)}</h4><p>${escapeHtml(c.email)}<br>${escapeHtml(c.address)}</p><div class="meta-row"><span class="chip info">${escapeHtml(c.commercialRegisterNumber)}</span><span class="chip warn">${escapeHtml(c.taxCardNumber)}</span></div></div></div>
      <div class="tabs">${tabs.map(t => `<button data-company-tab="${t[0]}" class="${state.companyTab === t[0] ? 'active' : ''}">${t[1]}</button>`).join('')}</div>
      ${companyTabContent(c)}
    </section>`;
  }
  function companyTabContent(c) {
    if (state.companyTab === 'equipments') {
      const eqs = state.data.equipments.filter(e => e.companyId === c.id);
      return `<div class="toolbar"><label class="search">⌕<input id="equipmentFilter" placeholder="Available / Running / Maintenance / Stopped"></label></div><div class="list">${eqs.map(equipmentCard).join('')}</div>`;
    }
    if (state.companyTab === 'financial') {
      const contracts = state.data.contracts.filter(x => x.companyId === c.id);
      const invoices = state.data.invoices.filter(x => x.companyId === c.id);
      const payments = state.data.payments.filter(x => x.companyId === c.id);
      const remaining = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0) - payments.reduce((s, p) => s + p.amount, 0);
      return `<div class="card"><div class="stat-row"><div class="stat"><span>Contracts</span><b>${contracts.length}</b></div><div class="stat"><span>Payments</span><b>${money(payments.reduce((s,p)=>s+p.amount,0))}</b></div><div class="stat"><span>Remaining</span><b>${money(Math.max(0, remaining))}</b></div></div></div>
      <div class="list">${invoices.slice(0,8).map(invoiceCard).join('')}</div>`;
    }
    if (state.companyTab === 'reports') {
      return `<div class="card"><h4>Company Reports</h4><p>تصدير تقارير الشركة عربي وإنجليزي وCSV.</p><div class="wide-actions"><button class="btn primary" data-print-company="${c.id}">Arabic PDF</button><button class="btn blue" data-export-company="${c.id}">Excel CSV</button></div></div>`;
    }
    return `<div class="card form">
      <div class="section-title"><div><h3>Company Information</h3><p>Basic legal profile</p></div><button class="btn ghost" data-print-company="${c.id}">Download PDF</button></div>
      <div class="stat-row"><div class="stat"><span>Owner</span><b>${escapeHtml(c.ownerName)}</b></div><div class="stat"><span>Representative</span><b>${escapeHtml(c.representative)}</b></div><div class="stat"><span>Bank</span><b>${escapeHtml(c.bank.bankName)}</b></div></div>
      <p><b>Owner Phone:</b> ${escapeHtml(c.ownerPhone)}<br><b>Owner National ID:</b> ${escapeHtml(c.ownerNationalId)}<br><b>Representative Position:</b> ${escapeHtml(c.representativePosition)}<br><b>IBAN:</b> ${escapeHtml(c.bank.iban)}<br><b>SWIFT:</b> ${escapeHtml(c.bank.swift)}</p>
      <div class="section-title"><h3>Attachments</h3></div>
      ${c.attachments.map(a => `<div class="alert"><span>📎</span><div><b>${escapeHtml(a.type)}</b><span>${escapeHtml(a.file)} - ${escapeHtml(a.description)}</span></div></div>`).join('')}
      <button class="btn blue" data-download-all="${c.id}">Download All</button>
    </div>`;
  }

  function renderEquipments() {
    return `<section class="panel">
      <div class="toolbar"><label class="search">⌕<input id="equipmentSearch" placeholder="بحث بالمعدة / الكود / الحالة"></label><button class="btn primary" data-modal="equipmentForm">+ معدة</button></div>
      <div class="list">${state.data.equipments.slice(0, 60).map(equipmentCard).join('')}</div>
    </section>`;
  }
  function equipmentCard(e) {
    const c = byId(state.data.companies, e.companyId), d = byId(state.data.drivers, e.currentDriverId), h = byId(state.data.helpers, e.currentHelperId);
    const mine = byId(state.data.mines, e.mineId), zone = byId(state.data.zones, e.zoneId);
    const contract = state.data.contracts.find(x => x.equipmentId === e.id) || {};
    return `<article class="card entity" data-equipment-search="${escapeHtml([e.name,e.code,e.status].join(' '))}">
      <div class="thumb">🚜</div><div class="entity-body"><h4>${escapeHtml(e.name)}</h4><p>${escapeHtml(e.code)} - ${escapeHtml(c.name)}<br>Driver: ${escapeHtml(d.name)} / Helper: ${escapeHtml(h.name)}<br>${escapeHtml(mine.name)} - ${escapeHtml(zone.name)}</p>
      <div class="meta-row">${statusChip(e.status)}${statusChip(contract.status || 'No Contract')}<span class="chip info">${e.year}</span></div>
      <div class="wide-actions"><button class="btn blue" data-equipment-id="${e.id}">تفاصيل</button><button class="btn ghost" data-contract-equipment="${e.id}">عقد</button></div></div>
    </article>`;
  }
  function renderEquipmentDetail() {
    const e = byId(state.data.equipments, state.selectedEquipmentId) || state.data.equipments[0];
    if (!e.id) return `<div class="empty">اختر معدة أولاً</div>`;
    const c = byId(state.data.companies, e.companyId);
    const contract = state.data.contracts.find(x => x.equipmentId === e.id) || {};
    const shifts = state.data.shifts.filter(s => s.equipmentId === e.id).slice(0, 6);
    return `<section class="panel"><div class="card entity"><div class="thumb">🚜</div><div class="entity-body"><h4>${escapeHtml(e.name)}</h4><p>${escapeHtml(e.code)}<br>${escapeHtml(c.name)}</p><div class="meta-row">${statusChip(e.status)}${statusChip(contract.status || 'No Contract')}</div></div></div>
      <div class="card"><h4>Equipment Fields</h4><p>Brand: ${e.brand}<br>Model: ${e.model}<br>Year: ${e.year}<br>Engine: ${e.engineNumber}<br>Chassis: ${e.chassisNumber}<br>Import Declaration: ${e.importDeclaration}<br>Owner Auto: ${escapeHtml(e.ownerAuto)}<br>Address Auto: ${escapeHtml(e.addressAuto)}<br>Bank Auto: ${escapeHtml(e.bankAuto)}</p></div>
      <div class="card"><h4>Contract</h4>${contract.id ? contractSummary(contract) : '<p>لا يوجد عقد نشط.</p>'}<div class="wide-actions"><button class="btn primary" data-contract-equipment="${e.id}">Generate Contract</button><button class="btn ghost" onclick="window.print()">Print</button></div></div>
      <div class="section-title"><h3>Recent Shifts</h3></div><div class="list">${shifts.map(shiftCard).join('')}</div>
    </section>`;
  }
  function contractSummary(c) {
    return `<p>Contract Date: ${c.contractDate}<br>Start: ${c.startDate} / End: ${c.endDate}<br>Rental Type: ${c.rentalType}<br>Calculation: ${c.costCalculation}<br>m³ Rate: ${money(c.m3Rate)} / Ton Rate Auto: ${money(c.pricePerTon)}<br>Maintenance: ${c.maintenanceResponsibility}<br>Fuel: ${c.fuelResponsibility}<br>Advance: ${money(c.advancePayment)}<br>Payment: ${c.paymentMethod}</p>`;
  }

  function renderContracts() {
    return `<section class="panel"><div class="toolbar"><label class="search">⌕<input id="contractSearch" placeholder="بحث عقد / شركة / معدة"></label><button class="btn primary" data-modal="contractForm">+ عقد</button></div><div class="list">${state.data.contracts.map(contractCard).join('')}</div></section>`;
  }
  function contractCard(c) {
    const co = byId(state.data.companies, c.companyId), eq = byId(state.data.equipments, c.equipmentId);
    return `<article class="card" data-contract-search="${escapeHtml([co.name,eq.name,c.status].join(' '))}"><div class="entity"><div class="thumb">📄</div><div class="entity-body"><h4>${escapeHtml(eq.name)}</h4><p>${escapeHtml(co.name)}<br>${c.startDate} → ${c.endDate}</p><div class="meta-row">${statusChip(c.status)}<span class="chip info">${c.costCalculation}</span><span class="chip warn">${money(c.advancePayment)} advance</span></div></div></div><div class="wide-actions"><button class="btn blue" data-preview-contract="${c.id}">Preview PDF</button><button class="btn ghost" data-renew-contract="${c.id}">Renewal</button></div></article>`;
  }

  function renderOperations() {
    return `<section class="panel"><div class="card"><div class="section-title"><div><h3>Create Shift</h3><p>ابدأ وردية تشغيل جديدة</p></div></div>${shiftForm()}</div><div class="section-title"><h3>Latest Shifts</h3></div><div class="list">${state.data.shifts.slice(0, 20).map(shiftCard).join('')}</div></section>`;
  }
  function shiftForm() {
    return `<form class="form" id="shiftForm"><div class="form-grid"><label>Date<input name="date" type="date" value="${new Date().toISOString().slice(0,10)}"></label><label>Start Time<input name="startTime" type="time" value="07:00"></label><label class="full">Equipment<select name="equipmentId">${state.data.equipments.map(e => `<option value="${e.id}">${e.code} - ${e.name}</option>`).join('')}</select></label><label>Mine<select name="mineId">${state.data.mines.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}</select></label><label>Zone<select name="zoneId">${state.data.zones.map(z => `<option value="${z.id}">${z.name}</option>`).join('')}</select></label><label>Sub Zone<select name="subZoneId">${state.data.subZones.slice(0,40).map(s => `<option value="${s.id}">${s.name} / ${s.subSub}</option>`).join('')}</select></label><label>End Reason<select name="stopReason"><option>End Of Shift</option><option>Maintenance</option><option>Mechanical Failure</option><option>Waiting Truck</option><option>Waiting Material</option><option>Administrative</option><option>Weather</option><option>Fuel</option><option>Other</option></select></label><label>Notes<textarea name="notes" required placeholder="Mandatory notes when ending shift"></textarea></label><label>Hours<input name="hours" type="number" value="8"></label></div><button class="btn primary" type="submit">Start / Save Shift</button></form>`;
  }
  function shiftCard(s) {
    const e = byId(state.data.equipments, s.equipmentId), m = byId(state.data.mines, s.mineId), d = byId(state.data.drivers, s.driverId), h = byId(state.data.helpers, s.helperId);
    return `<article class="card entity"><div class="thumb">⚙️</div><div class="entity-body"><h4>${escapeHtml(e.code)} - ${escapeHtml(e.name)}</h4><p>${s.date} / ${s.startTime} - ${s.endTime || 'Running'}<br>${escapeHtml(m.name)}<br>Driver: ${escapeHtml(d.name)} / Helper: ${escapeHtml(h.name)}</p><div class="meta-row">${statusChip(s.stopReason)}<span class="chip info">${fmt(s.hours)}h</span><span class="chip good">${fmt(s.weightTon)} ton</span></div></div></article>`;
  }

  function renderQuality() {
    const lots = state.data.lots.slice(0, 24);
    return `<section class="panel"><div class="card"><div class="section-title"><div><h3>Quality Lot</h3><p>Only Quality Department can create lots</p></div>${state.role === 'Quality' || state.role === 'Administrator' ? '<span class="chip good">Allowed</span>' : '<span class="chip bad">Restricted</span>'}</div>${qualityForm()}</div><div class="section-title"><h3>Quality Lots</h3></div><div class="list">${lots.map(lotCard).join('')}</div></section>`;
  }
  function qualityForm() {
    return `<form class="form" id="lotForm"><div class="form-grid"><label>Mine<select name="mineId">${state.data.mines.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}</select></label><label>Zone<select name="zoneId">${state.data.zones.map(z => `<option value="${z.id}">${z.name}</option>`).join('')}</select></label><label>Sub Zone<select name="subZoneId">${state.data.subZones.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></label><label>Lot Type<select name="lotType" id="lotType"><option>Extraction</option><option>Before Crusher</option><option>After Crusher</option></select></label><label>Base Circumference<input name="baseCircumference" type="number" step="0.01" value="24"></label><label>Height<input name="height" type="number" step="0.01" value="4.2"></label><label>Density<input name="density" id="densityField" type="number" step="0.01" value="1.50" readonly></label><label>Linked Equipment<select name="linkedEquipmentId">${state.data.equipments.filter(e=>e.status==='Running').map(e => `<option value="${e.id}">${e.code} - ${e.name}</option>`).join('')}</select></label></div><div class="form-hint" id="qualityCalcHint">Estimated volume and weight will be calculated automatically.</div><button class="btn primary" type="submit">Save Lot</button></form>`;
  }
  function lotCard(l) {
    const e = byId(state.data.equipments, l.linkedEquipmentId), m = byId(state.data.mines, l.mineId);
    return `<article class="card entity"><div class="thumb">📋</div><div class="entity-body"><h4>${escapeHtml(l.lotType)} - ${escapeHtml(m.name)}</h4><p>${l.date}<br>${escapeHtml(l.materialSize)}<br>Linked: ${escapeHtml(e.code)}</p><div class="meta-row"><span class="chip info">${fmt(l.estimatedVolume)} m³</span><span class="chip good">${fmt(l.estimatedWeight)} ton</span><span class="chip warn">Density ${l.density}</span></div></div></article>`;
  }

  function renderConsumption() {
    return `<section class="panel"><div class="card"><div class="section-title"><div><h3>Daily Consumption</h3><p>Fuel, oils, filters, tyres and spare parts</p></div></div>${consumptionForm()}</div><div class="section-title"><h3>Records</h3></div><div class="list">${state.data.consumption.slice(0, 35).map(consumptionCard).join('')}</div></section>`;
  }
  function consumptionForm() {
    const types = ['Fuel','Water','Engine Oil','Hydraulic Oil','Grease','Drill Bits','Oil Filter','Fuel Filter','Air Filter','Battery','Tyres','Spare Parts'];
    return `<form class="form" id="consumptionForm"><div class="form-grid"><label>Date<input name="date" type="date" value="${new Date().toISOString().slice(0,10)}"></label><label>Type<select name="type">${types.map(t => `<option>${t}</option>`).join('')}</select></label><label class="full">Equipment<select name="equipmentId">${state.data.equipments.map(e => `<option value="${e.id}">${e.code} - ${e.name}</option>`).join('')}</select></label><label>Quantity<input name="quantity" type="number" value="100"></label><label>Unit<select name="unit"><option>liter</option><option>kg</option><option>pcs</option></select></label><label class="full">Notes<textarea name="notes" placeholder="Notes"></textarea></label><label class="full">Photos<input name="photos" type="file" multiple></label></div><button class="btn primary" type="submit">Save Consumption</button></form>`;
  }
  function consumptionCard(c) {
    const e = byId(state.data.equipments, c.equipmentId);
    return `<article class="card entity"><div class="thumb">⛽</div><div class="entity-body"><h4>${escapeHtml(c.type)} - ${fmt(c.quantity)} ${escapeHtml(c.unit)}</h4><p>${c.date}<br>${escapeHtml(e.code)} - ${escapeHtml(e.name)}<br>${escapeHtml(c.notes)}</p><div class="meta-row"><span class="chip info">Photos: ${c.photos.length}</span></div></div></article>`;
  }

  function renderAccounts() {
    const upcoming = state.data.invoices.filter(i=>i.status==='Upcoming').reduce((s,i)=>s+i.amount,0);
    const paid = state.data.invoices.filter(i=>i.status==='Paid').reduce((s,i)=>s+i.amount,0);
    const overdue = state.data.invoices.filter(i=>i.status==='Overdue').reduce((s,i)=>s+i.amount,0);
    return `<section class="panel"><div class="kpi-grid">${kpi('📅','Upcoming Due',money(upcoming),'مستحق قريب','warn')}${kpi('✅','Paid',money(paid),'مدفوع','good')}${kpi('⛔','Overdue',money(overdue),'متأخر','bad')}${kpi('💳','Payments',state.data.payments.length,'دفعة')}</div><div class="card"><div class="section-title"><div><h3>Generate Invoice</h3><p>Automatic according to contract hours or quality production</p></div></div>${invoiceForm()}</div><div class="section-title"><h3>Invoices</h3></div><div class="list">${state.data.invoices.slice(0,30).map(invoiceCard).join('')}</div></section>`;
  }
  function invoiceForm() {
    return `<form class="form" id="invoiceForm"><div class="form-grid"><label>Contract<select name="contractId">${state.data.contracts.map(c => { const e=byId(state.data.equipments,c.equipmentId); return `<option value="${c.id}">${c.id} - ${e.code}</option>`; }).join('')}</select></label><label>Amount<input name="amount" type="number" value="25000"></label><label>Due Date<input name="dueDate" type="date" value="${addDays(7)}"></label><label>Status<select name="status"><option>Upcoming</option><option>Paid</option><option>Overdue</option></select></label></div><button class="btn primary" type="submit">Generate Invoice PDF</button></form>`;
  }
  function invoiceCard(i) {
    const c = byId(state.data.companies, i.companyId), e = byId(state.data.equipments, i.equipmentId);
    return `<article class="card entity"><div class="thumb">💰</div><div class="entity-body"><h4>${escapeHtml(i.id)} - ${money(i.amount)}</h4><p>${escapeHtml(c.name)}<br>${escapeHtml(e.code)} - ${escapeHtml(e.name)}<br>Due: ${i.dueDate} / Source: ${escapeHtml(i.source)}</p><div class="meta-row">${statusChip(i.status)}</div></div></article>`;
  }

  function getNotifications() {
    const contractEnding = state.data.contracts.filter(c => c.status === 'Ending Soon').slice(0, 8).map(c => ({ type:'Contract Ending', title:`Contract ${c.id} ending soon`, body:`Ends on ${c.endDate}`, severity:'warn' }));
    const overdue = state.data.invoices.filter(i => i.status === 'Overdue').slice(0, 8).map(i => ({ type:'Payment Due', title:`Invoice ${i.id} overdue`, body:money(i.amount), severity:'bad' }));
    const maintenance = state.data.equipments.filter(e => e.status === 'Maintenance').slice(0, 8).map(e => ({ type:'Equipment Maintenance', title:e.code, body:e.name, severity:'warn' }));
    const expiry = state.data.equipments.filter(e => daysBetween(new Date(), new Date(e.licenseExpiry)) < 35).slice(0, 8).map(e => ({ type:'License Expiry', title:e.code, body:`License expires ${e.licenseExpiry}`, severity:'info' }));
    return [...contractEnding, ...overdue, ...maintenance, ...expiry];
  }
  function renderNotifications() {
    const n = getNotifications();
    return `<section class="panel"><div class="section-title"><div><h3>Notifications</h3><p>Email + Mobile notification ready workflow</p></div><span class="chip warn">${n.length}</span></div><div class="list">${n.map(x => `<div class="alert"><span>${x.severity==='bad'?'⛔':x.severity==='warn'?'⚠️':'ℹ️'}</span><div><b>${escapeHtml(x.type)} - ${escapeHtml(x.title)}</b><span>${escapeHtml(x.body)}</span></div></div>`).join('')}</div></section>`;
  }

  function renderReports() {
    const type = state.reportType;
    return `<section class="panel"><div class="tabs">${['equipment','company','financial','production','fuel','consumption','contract'].map(t => `<button class="${type===t?'active':''}" data-report-type="${t}">${t}</button>`).join('')}</div><div class="report-paper" id="reportPaper">${reportBody(type)}</div><div class="wide-actions"><button class="btn primary" onclick="window.print()">Arabic PDF / Print</button><button class="btn blue" data-export-report="${type}">Excel CSV</button></div></section>`;
  }
  function reportBody(type) {
    if (type === 'company') return `<h2>Company Report</h2><table class="mini-table"><thead><tr><th>Company</th><th>Owner</th><th>Equipments</th><th>Due</th></tr></thead><tbody>${state.data.companies.map(c => `<tr><td>${escapeHtml(c.name)}</td><td>${escapeHtml(c.ownerName)}</td><td>${state.data.equipments.filter(e=>e.companyId===c.id).length}</td><td>${money(state.data.invoices.filter(i=>i.companyId===c.id&&i.status!=='Paid').reduce((s,i)=>s+i.amount,0))}</td></tr>`).join('')}</tbody></table>`;
    if (type === 'financial') return `<h2>Financial Report</h2><p class="invoice-total">${money(state.data.invoices.reduce((s,i)=>s+i.amount,0))}</p><table class="mini-table"><thead><tr><th>Invoice</th><th>Company</th><th>Status</th><th>Amount</th></tr></thead><tbody>${state.data.invoices.slice(0,20).map(i => `<tr><td>${i.id}</td><td>${escapeHtml(byId(state.data.companies,i.companyId).name)}</td><td>${i.status}</td><td>${money(i.amount)}</td></tr>`).join('')}</tbody></table>`;
    if (type === 'production') return `<h2>Production Report</h2><table class="mini-table"><thead><tr><th>Lot</th><th>Type</th><th>m³</th><th>Ton</th></tr></thead><tbody>${state.data.lots.slice(0,24).map(l => `<tr><td>${l.id}</td><td>${l.lotType}</td><td>${fmt(l.estimatedVolume)}</td><td>${fmt(l.estimatedWeight)}</td></tr>`).join('')}</tbody></table>`;
    if (type === 'fuel' || type === 'consumption') return `<h2>${type === 'fuel' ? 'Fuel' : 'Consumption'} Report</h2><table class="mini-table"><thead><tr><th>Date</th><th>Equipment</th><th>Type</th><th>Qty</th></tr></thead><tbody>${state.data.consumption.filter(c=>type==='consumption'||c.type==='Fuel').slice(0,24).map(c => `<tr><td>${c.date}</td><td>${escapeHtml(byId(state.data.equipments,c.equipmentId).code)}</td><td>${c.type}</td><td>${fmt(c.quantity)} ${c.unit}</td></tr>`).join('')}</tbody></table>`;
    if (type === 'contract') return `<h2>Contract Report</h2><table class="mini-table"><thead><tr><th>Contract</th><th>Equipment</th><th>Status</th><th>End</th></tr></thead><tbody>${state.data.contracts.map(c => `<tr><td>${c.id}</td><td>${escapeHtml(byId(state.data.equipments,c.equipmentId).code)}</td><td>${c.status}</td><td>${c.endDate}</td></tr>`).join('')}</tbody></table>`;
    return `<h2>Equipment Report</h2><table class="mini-table"><thead><tr><th>Code</th><th>Name</th><th>Status</th><th>Mine</th></tr></thead><tbody>${state.data.equipments.slice(0,30).map(e => `<tr><td>${e.code}</td><td>${escapeHtml(e.name)}</td><td>${e.status}</td><td>${escapeHtml(byId(state.data.mines,e.mineId).name)}</td></tr>`).join('')}</tbody></table>`;
  }

  function renderSettings() {
    return `<section class="panel"><div class="card"><div class="section-title"><div><h3>Role Based Access</h3><p>Administrator, Operation Manager, Quality, Accounts, Maintenance, Warehouse, Driver, Viewer</p></div></div><label class="form"><span>Current Role</span><select id="roleSelect">${state.data.permissions.map(p => `<option ${p.role===state.role?'selected':''}>${p.role}</option>`).join('')}</select></label></div><div class="list">${state.data.permissions.map(permissionCard).join('')}</div><div class="card"><h4>Data Tools</h4><p>Reset demo data or export backup JSON.</p><div class="wide-actions"><button class="btn ghost" data-reset-demo="1">Reset Demo</button><button class="btn blue" data-export-json="1">Export JSON</button></div></div></section>`;
  }
  function permissionCard(p) {
    return `<article class="card"><h4>${p.role}</h4><div class="meta-row">${['view','add','edit','delete','print','download','financialAccess','reports'].map(k => `<span class="chip ${p[k]?'good':'bad'}">${k}: ${p[k]?'Yes':'No'}</span>`).join('')}</div></article>`;
  }

  function renderMore() {
    return `<section class="panel"><div class="more-grid">${moduleCard('🏢','Companies','شركات ومرفقات','companies')}${moduleCard('📄','Contracts','عقود','contracts')}${moduleCard('⚙️','Operations','تشغيل','operations')}${moduleCard('⛽','Consumption','استهلاك','consumption')}${moduleCard('💰','Accounts','ماليات','accounts')}${moduleCard('🔔','Notifications','تنبيهات','notifications')}${moduleCard('⚙️','Settings','صلاحيات','settings')}${moduleCard('⌂','Dashboard','الرئيسية','home')}</div></section>`;
  }

  function onClick(e) {
    const route = e.target.closest('[data-route]')?.dataset.route;
    if (route) return navigate(route);
    const companyId = e.target.closest('[data-company-id]')?.dataset.companyId;
    if (companyId) { state.selectedCompanyId = companyId; state.companyTab = 'basic'; return navigate('companyDetail'); }
    const equipmentId = e.target.closest('[data-equipment-id]')?.dataset.equipmentId;
    if (equipmentId) { state.selectedEquipmentId = equipmentId; return navigate('equipmentDetail'); }
    const tab = e.target.closest('[data-company-tab]')?.dataset.companyTab;
    if (tab) { state.companyTab = tab; return render(); }
    const modal = e.target.closest('[data-modal]')?.dataset.modal;
    if (modal) return openModal(modal);
    if (e.target.closest('[data-close-modal]')) return closeModal();
    const reportType = e.target.closest('[data-report-type]')?.dataset.reportType;
    if (reportType) { state.reportType = reportType; return render(); }
    const exportReport = e.target.closest('[data-export-report]')?.dataset.exportReport;
    if (exportReport) return exportCSV(exportReport);
    const contractEquipment = e.target.closest('[data-contract-equipment]')?.dataset.contractEquipment;
    if (contractEquipment) return openModal('contractForm', { equipmentId: contractEquipment });
    const preview = e.target.closest('[data-preview-contract]')?.dataset.previewContract;
    if (preview) return openContractPreview(preview);
    const renew = e.target.closest('[data-renew-contract]')?.dataset.renewContract;
    if (renew) { duplicateContract(renew); return; }
    if (e.target.closest('[data-reset-demo]')) { if(confirm('Reset all local demo data?')) { localStorage.removeItem(STORE_KEY); state.data = createDemoData(); persist(); render(); toast('تمت إعادة ضبط بيانات الديمو'); } }
    if (e.target.closest('[data-export-json]')) return downloadFile('ait-pit2port-backup.json', JSON.stringify(state.data, null, 2), 'application/json');
    if (e.target.closest('[data-print-company]')) return window.print();
    if (e.target.closest('[data-export-company]')) return exportCSV('company');
    if (e.target.closest('[data-download-all]')) return toast('تم تجهيز تحميل كل المرفقات كحزمة ديمو.');
  }

  function onInput(e) {
    if (e.target.id === 'companySearch') filterCards('[data-company-search]', e.target.value);
    if (e.target.id === 'equipmentSearch' || e.target.id === 'equipmentFilter') filterCards('[data-equipment-search]', e.target.value);
    if (e.target.id === 'contractSearch') filterCards('[data-contract-search]', e.target.value);
    if (e.target.id === 'lotType') {
      const d = e.target.value === 'Extraction' ? 1.50 : e.target.value === 'Before Crusher' ? 1.60 : 1.75;
      $('#densityField').value = d.toFixed(2);
    }
    if (e.target.id === 'roleSelect') { state.role = e.target.value; toast(`Role changed to ${state.role}`); }
    if (e.target.name === 'companyId' && $('#autoCompanyInfo')) updateAutoCompany(e.target.value);
    if (['m3Rate','density'].includes(e.target.name) && $('#pricePerTonHint')) updateTonHint();
  }

  function filterCards(selector, q) {
    const term = q.trim().toLowerCase();
    $$(selector).forEach(el => el.style.display = el.dataset[Object.keys(el.dataset)[0]].toLowerCase().includes(term) ? '' : 'none');
  }

  function onSubmit(e) {
    e.preventDefault();
    const id = e.target.id;
    if (id === 'companyForm') return saveCompany(new FormData(e.target));
    if (id === 'equipmentForm') return saveEquipment(new FormData(e.target));
    if (id === 'contractForm') return saveContract(new FormData(e.target));
    if (id === 'shiftForm') return saveShift(new FormData(e.target));
    if (id === 'lotForm') return saveLot(new FormData(e.target));
    if (id === 'consumptionForm') return saveConsumption(new FormData(e.target));
    if (id === 'invoiceForm') return saveInvoice(new FormData(e.target));
  }

  function openModal(kind, defaults = {}) {
    const modal = $('#modal');
    modal.innerHTML = `<div class="modal-sheet"><div class="modal-head"><h3>${modalTitle(kind)}</h3><button class="btn ghost" data-close-modal>إغلاق</button></div>${modalBody(kind, defaults)}</div>`;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    if (kind === 'equipmentForm') updateAutoCompany($('#modal [name="companyId"]').value);
    if (kind === 'contractForm') updateTonHint();
  }
  function closeModal() { $('#modal').classList.remove('show'); $('#modal').setAttribute('aria-hidden','true'); $('#modal').innerHTML = ''; }
  function modalTitle(kind) { return { companyForm:'Create Company', equipmentForm:'Create Equipment', contractForm:'Generate Contract' }[kind] || 'Form'; }
  function modalBody(kind, defaults) {
    if (kind === 'companyForm') return companyForm();
    if (kind === 'equipmentForm') return equipmentForm();
    if (kind === 'contractForm') return contractForm(defaults.equipmentId);
    return '';
  }
  function companyForm() {
    return `<form id="companyForm" class="form"><div class="form-grid"><label>Company Name<input name="name" required></label><label>Owner Name<input name="ownerName" required></label><label>Owner Phone<input name="ownerPhone" required></label><label>Owner National ID<input name="ownerNationalId"></label><label>Owner ID Image<input name="ownerIdImage" type="file"></label><label>Representative<input name="representative"></label><label>Representative Position<input name="representativePosition"></label><label>Representative Phone<input name="representativePhone"></label><label>Commercial Register Number<input name="commercialRegisterNumber"></label><label>Commercial Register Image<input name="commercialRegisterImage" type="file"></label><label>Tax Card Number<input name="taxCardNumber"></label><label>Tax Card Image<input name="taxCardImage" type="file"></label><label class="full">Address<input name="address"></label><label>Email<input name="email" type="email"></label><label>Bank Name<input name="bankName"></label><label>Account Number<input name="accountNumber"></label><label>IBAN<input name="iban"></label><label>SWIFT<input name="swift"></label><label class="full">Notes<textarea name="notes"></textarea></label><label class="full">Unlimited Attachments<input name="attachments" type="file" multiple></label></div><button class="btn primary" type="submit">Save Company</button></form>`;
  }
  function equipmentForm() {
    return `<form id="equipmentForm" class="form"><div class="form-grid"><label class="full">Company<select name="companyId">${state.data.companies.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></label><div class="form-hint full" id="autoCompanyInfo"></div><label>Brand<input name="brand" required value="Caterpillar"></label><label>Model<input name="model" required value="CAT-336"></label><label>Year<input name="year" type="number" value="2022"></label><label>Type<input name="type" value="Excavator"></label><label>Engine Number<input name="engineNumber"></label><label>Chassis Number<input name="chassisNumber"></label><label>Import Declaration<input name="importDeclaration"></label><label>Import Type<select name="importType"><option>Permanent Import</option><option>Temporary Admission</option></select></label><label>Import Serial<input name="importSerial"></label><label>Status<select name="status"><option>Available</option><option>Running</option><option>Maintenance</option><option>Stopped</option></select></label><label>Mine<select name="mineId">${state.data.mines.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}</select></label><label>Zone<select name="zoneId">${state.data.zones.map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></label><label class="full">Equipment Photos<input name="photos" type="file" multiple></label><label class="full">Receiving Photos<input name="receivingPhotos" type="file" multiple></label></div><button class="btn primary" type="submit">Save Equipment</button></form>`;
  }
  function contractForm(defaultEquipmentId) {
    const eq = defaultEquipmentId ? byId(state.data.equipments, defaultEquipmentId) : state.data.equipments[0];
    const companyId = eq.companyId || state.data.companies[0].id;
    return `<form id="contractForm" class="form"><div class="form-grid"><label>Company<select name="companyId">${state.data.companies.map(c=>`<option ${c.id===companyId?'selected':''} value="${c.id}">${c.name}</option>`).join('')}</select></label><label>Equipment<select name="equipmentId">${state.data.equipments.map(e=>`<option ${e.id===(defaultEquipmentId||'')?'selected':''} value="${e.id}">${e.code} - ${e.name}</option>`).join('')}</select></label><label>Contract Date<input name="contractDate" type="date" value="${new Date().toISOString().slice(0,10)}"></label><label>Start Date<input name="startDate" type="date" value="${new Date().toISOString().slice(0,10)}"></label><label>End Date<input name="endDate" type="date" value="${addDays(30)}"></label><label>Transportation Cost<input name="transportationCost" type="number" value="50000"></label><label>Return Transportation Cost<input name="returnTransportationCost" type="number" value="25000"></label><label>Who Pays<select name="whoPays"><option>Lessor</option><option>Lessee</option></select></label><label>Rental Type<select name="rentalType"><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Yearly</option></select></label><label>Cost Calculation<select name="costCalculation"><option>Hourly</option><option>Cubic Meter</option><option>Daily</option></select></label><label>Hourly Rate<input name="hourlyRate" type="number" value="1800"></label><label>Price Per m³<input name="m3Rate" type="number" value="55"></label><label>Density<input name="density" type="number" step="0.01" value="1.60"></label><label>Daily Rate<input name="dailyRate" type="number" value="22000"></label><div class="form-hint full" id="pricePerTonHint"></div><label>Maintenance Responsibility<select name="maintenanceResponsibility"><option>Lessor</option><option>Lessee</option></select></label><label>Fuel Responsibility<select name="fuelResponsibility"><option>Lessor</option><option>Lessee</option></select></label><label>Operating Responsibility<select name="operatingResponsibility"><option>Lessor</option><option>Lessee</option></select></label><label>Operator Count<input name="operatorCount" type="number" value="1"></label><label>Helpers Count<input name="helpersCount" type="number" value="1"></label><label>Advance Payment<input name="advancePayment" type="number" value="25000"></label><label>Payment Method<select name="paymentMethod"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label><label class="full">Mandatory Notes<textarea name="maintenanceNotes"></textarea></label><label class="full">Upload Signed Contract<input name="signedContract" type="file"></label></div><button class="btn primary" type="submit">Generate Contract / Save</button></form>`;
  }

  function updateAutoCompany(id) {
    const c = byId(state.data.companies, id);
    const el = $('#autoCompanyInfo');
    if (el && c.id) el.innerHTML = `Owner: <b>${escapeHtml(c.ownerName)}</b><br>Address: ${escapeHtml(c.address)}<br>Bank: ${escapeHtml(c.bank.bankName)} / ${escapeHtml(c.bank.iban)}`;
  }
  function updateTonHint() {
    const m3 = Number($('#modal [name="m3Rate"]')?.value || 0);
    const density = Number($('#modal [name="density"]')?.value || 1.6);
    const ton = density ? (m3 / density) : 0;
    const el = $('#pricePerTonHint');
    if (el) el.textContent = `Price per ton is calculated automatically: ${money(ton)}. Only m³ appears in the contract.`;
  }

  function saveCompany(fd) {
    const id = `co-${Date.now()}`;
    state.data.companies.unshift({ id, name: fd.get('name'), ownerName: fd.get('ownerName'), ownerPhone: fd.get('ownerPhone'), ownerNationalId: fd.get('ownerNationalId'), ownerIdImage: fileName(fd.get('ownerIdImage')), representative: fd.get('representative'), representativePosition: fd.get('representativePosition'), representativePhone: fd.get('representativePhone'), representativeNationalId: '', representativeIdImage: '', commercialRegisterNumber: fd.get('commercialRegisterNumber'), commercialRegisterImage: fileName(fd.get('commercialRegisterImage')), taxCardNumber: fd.get('taxCardNumber'), taxCardImage: fileName(fd.get('taxCardImage')), address: fd.get('address'), email: fd.get('email'), notes: fd.get('notes'), ownerType: 'Owner', bank: { bankName: fd.get('bankName'), accountNumber: fd.get('accountNumber'), iban: fd.get('iban'), swift: fd.get('swift') }, attachments: files(fd.getAll('attachments')).map((f,i)=>({id:`att-${id}-${i}`, type:'Official Documents', file:f, description:'Uploaded attachment'})), createdAt: new Date().toISOString().slice(0,10) });
    persist(); closeModal(); toast('تم حفظ الشركة'); render();
  }
  function saveEquipment(fd) {
    const c = byId(state.data.companies, fd.get('companyId'));
    const id = `eq-${Date.now()}`;
    const code = `AIT-EQ-${String(state.data.equipments.length + 1).padStart(4, '0')}`;
    state.data.equipments.unshift({ id, companyId: fd.get('companyId'), code, name: `${fd.get('brand')} ${fd.get('type')} ${fd.get('model')}`, type: fd.get('type'), brand: fd.get('brand'), model: fd.get('model'), year: Number(fd.get('year')), engineNumber: fd.get('engineNumber'), chassisNumber: fd.get('chassisNumber'), importDeclaration: fd.get('importDeclaration'), importType: fd.get('importType'), importSerial: fd.get('importSerial'), status: fd.get('status'), currentDriverId: state.data.drivers[0].id, currentHelperId: state.data.helpers[0].id, mineId: fd.get('mineId'), zoneId: fd.get('zoneId'), subZoneId: state.data.subZones[0].id, photo: files(fd.getAll('photos'))[0] || 'new-equipment.jpg', receivingPhotos: files(fd.getAll('receivingPhotos')), ownerAuto: c.ownerName, addressAuto: c.address, bankAuto: c.bank.bankName, licenseExpiry: addDays(365), insuranceExpiry: addDays(365), importExpiry: addDays(180) });
    persist(); closeModal(); toast('تم حفظ المعدة مع استدعاء بيانات الشركة'); render();
  }
  function saveContract(fd) {
    const density = Number(fd.get('density') || 1.6);
    const m3Rate = Number(fd.get('m3Rate') || 0);
    const id = `ct-${Date.now()}`;
    state.data.contracts.unshift({ id, companyId: fd.get('companyId'), equipmentId: fd.get('equipmentId'), contractDate: fd.get('contractDate'), startDate: fd.get('startDate'), endDate: fd.get('endDate'), transportationCost: Number(fd.get('transportationCost')), returnTransportationCost: Number(fd.get('returnTransportationCost')), whoPays: fd.get('whoPays'), rentalType: fd.get('rentalType'), costCalculation: fd.get('costCalculation'), hourlyRate: Number(fd.get('hourlyRate')), m3Rate, pricePerTon: Number((m3Rate / density).toFixed(2)), dailyRate: Number(fd.get('dailyRate')), maintenanceResponsibility: fd.get('maintenanceResponsibility'), maintenanceNotes: fd.get('maintenanceNotes'), fuelResponsibility: fd.get('fuelResponsibility'), operatingResponsibility: fd.get('operatingResponsibility'), operatorCount: Number(fd.get('operatorCount')), helpersCount: Number(fd.get('helpersCount')), advancePayment: Number(fd.get('advancePayment')), paymentMethod: fd.get('paymentMethod'), status: 'Running', signedContract: fileName(fd.get('signedContract')), history: ['Generated contract', 'Saved contract'] });
    persist(); closeModal(); toast('تم إنشاء العقد ويمكن طباعته PDF'); openContractPreview(id);
  }
  function saveShift(fd) {
    const eq = byId(state.data.equipments, fd.get('equipmentId'));
    state.data.shifts.unshift({ id:`sh-${Date.now()}`, date:fd.get('date'), startTime:fd.get('startTime'), endTime:new Date().toTimeString().slice(0,5), equipmentId:eq.id, mineId:fd.get('mineId'), zoneId:fd.get('zoneId'), subZoneId:fd.get('subZoneId'), driverId:eq.currentDriverId, helperId:eq.currentHelperId, hours:Number(fd.get('hours')), stopReason:fd.get('stopReason'), notes:fd.get('notes'), volumeM3:0, density:1.6, weightTon:0 });
    eq.status = fd.get('stopReason') === 'Maintenance' || fd.get('stopReason') === 'Mechanical Failure' ? 'Maintenance' : 'Running';
    persist(); toast('تم حفظ الوردية وسبب التوقف'); render();
  }
  function saveLot(fd) {
    if (!['Administrator','Quality'].includes(state.role)) return toast('غير مسموح: إنشاء Lots خاص بقسم الجودة فقط');
    const lotType = fd.get('lotType');
    const density = lotType === 'Extraction' ? 1.5 : lotType === 'Before Crusher' ? 1.6 : 1.75;
    const base = Number(fd.get('baseCircumference')), height = Number(fd.get('height'));
    const volume = Number((Math.pow(base / (2 * Math.PI), 2) * Math.PI * height).toFixed(2));
    state.data.lots.unshift({ id:`lot-${Date.now()}`, date:new Date().toISOString().slice(0,10), mineId:fd.get('mineId'), zoneId:fd.get('zoneId'), subZoneId:fd.get('subZoneId'), lotType, baseCircumference:base, height, density, estimatedVolume:volume, estimatedWeight:Number((volume*density).toFixed(2)), materialSize: lotType==='Extraction'?'0.5 m to 2.0 m':lotType==='Before Crusher'?'10 cm to 70 cm':'2 mm to 7 cm', linkedEquipmentId:fd.get('linkedEquipmentId'), createdBy:'Quality Department' });
    persist(); toast('تم حفظ Lot وحساب الحجم والوزن'); render();
  }
  function saveConsumption(fd) {
    state.data.consumption.unshift({ id:`con-${Date.now()}`, date:fd.get('date'), equipmentId:fd.get('equipmentId'), type:fd.get('type'), quantity:Number(fd.get('quantity')), unit:fd.get('unit'), notes:fd.get('notes'), photos:files(fd.getAll('photos')) });
    persist(); toast('تم تسجيل الاستهلاك'); render();
  }
  function saveInvoice(fd) {
    const ct = byId(state.data.contracts, fd.get('contractId'));
    state.data.invoices.unshift({ id:`inv-${Date.now()}`, contractId:ct.id, companyId:ct.companyId, equipmentId:ct.equipmentId, date:new Date().toISOString().slice(0,10), dueDate:fd.get('dueDate'), amount:Number(fd.get('amount')), status:fd.get('status'), source: ct.costCalculation === 'Hourly' ? 'Operating Hours' : ct.costCalculation === 'Cubic Meter' ? 'Quality Production' : 'Contract Daily Rate' });
    persist(); toast('تم إنشاء الفاتورة'); render();
  }
  function fileName(f) { return f && f.name ? f.name : ''; }
  function files(list) { return list.filter(f => f && f.name).map(f => f.name); }

  function openContractPreview(id) {
    const c = byId(state.data.contracts, id), co = byId(state.data.companies, c.companyId), eq = byId(state.data.equipments, c.equipmentId);
    const html = `<div class="modal-sheet"><div class="modal-head"><h3>Professional Contract PDF</h3><button class="btn ghost" data-close-modal>إغلاق</button></div><div class="report-paper"><h2>AIT Equipment Rental Contract</h2><p><b>AIT Data:</b> AIT Company - Mining Operations ERP<br><b>Company:</b> ${escapeHtml(co.name)} / ${escapeHtml(co.ownerName)}<br><b>Equipment:</b> ${escapeHtml(eq.code)} - ${escapeHtml(eq.name)}<br><b>Contract:</b> ${c.contractDate} / ${c.startDate} → ${c.endDate}</p>${contractSummary(c)}<p><b>Signatures</b><br>AIT Representative: ____________________<br>Lessor Representative: ____________________</p></div><div class="wide-actions"><button class="btn primary" onclick="window.print()">Download / Print PDF</button><button class="btn blue" data-close-modal>Save</button></div></div>`;
    $('#modal').innerHTML = html;
    $('#modal').classList.add('show');
  }
  function duplicateContract(id) {
    const old = byId(state.data.contracts, id);
    const copy = { ...old, id:`ct-${Date.now()}`, contractDate:new Date().toISOString().slice(0,10), startDate:addDays(1), endDate:addDays(31), status:'Running', history:[...(old.history||[]),'Renewed'] };
    state.data.contracts.unshift(copy); persist(); toast('تم تجديد العقد كنسخة جديدة'); render();
  }

  function exportCSV(type) {
    let rows = [];
    if (type === 'company') rows = [['Company','Owner','Phone','CR','Tax'], ...state.data.companies.map(c => [c.name,c.ownerName,c.ownerPhone,c.commercialRegisterNumber,c.taxCardNumber])];
    else if (type === 'financial') rows = [['Invoice','Company','Amount','Status'], ...state.data.invoices.map(i => [i.id, byId(state.data.companies,i.companyId).name, i.amount, i.status])];
    else if (type === 'production') rows = [['Lot','Type','m3','Ton'], ...state.data.lots.map(l => [l.id,l.lotType,l.estimatedVolume,l.estimatedWeight])];
    else if (type === 'contract') rows = [['Contract','Equipment','Status','Start','End'], ...state.data.contracts.map(c => [c.id, byId(state.data.equipments,c.equipmentId).code, c.status, c.startDate, c.endDate])];
    else rows = [['Code','Name','Status','Company'], ...state.data.equipments.map(e => [e.code,e.name,e.status,byId(state.data.companies,e.companyId).name])];
    const csv = rows.map(r => r.map(v => `"${String(v ?? '').replaceAll('"','""')}"`).join(',')).join('\n');
    downloadFile(`ait-${type}-report.csv`, csv, 'text/csv;charset=utf-8');
    toast('تم تصدير ملف CSV');
  }
  function downloadFile(name, content, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  init();
})();
