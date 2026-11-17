/* عُهدة · Uhda 1.0 — منطق التطبيق (مأخوذ كما هو من src/Uhda.dc.html) */
class Component extends DCLogic {
  constructor(...a) {
    super(...a); this._t = null; this.state = this.init();
    this._s1 = setTimeout(() => this.setState({ splash: 'out' }), 4900); this._s2 = setTimeout(() => this.setState({ splash: false }), 5350);
    this._a1 = setTimeout(() => this.onOpen(), 5700);
    this._vis = () => { if (document.visibilityState === 'visible') this.checkAlerts(false); };
    try { document.addEventListener('visibilitychange', this._vis); } catch (e) {}
    try { const C = window.Capacitor, LN = C && C.isNativePlatform && C.isNativePlatform() && C.Plugins ? C.Plugins.LocalNotifications : null; if (LN && LN.addListener) LN.addListener('localNotificationActionPerformed', (ev) => { const x = ev && ev.notification && ev.notification.extra; if (x && x.id != null) setTimeout(() => this.openItem(x.id), 300); }); } catch (e) {}
    try { if (navigator.serviceWorker) navigator.serviceWorker.addEventListener('message', (e) => { const d = (e && e.data) || {}; if (d.open != null) this.openItem(d.open); }); } catch (e) {}
  }
  componentDidUpdate(pp, ps) { if (ps && (ps.items !== this.state.items || ps.notifTime !== this.state.notifTime || ps.lang !== this.state.lang)) { clearTimeout(this._ws); this._ws = setTimeout(() => this.writeSched(), 700); } }
  playSplash() { clearTimeout(this._s1); clearTimeout(this._s2); this.setState({ splash: false }); setTimeout(() => this.setState({ splash: 'in' }), 30); this._s1 = setTimeout(() => this.setState({ splash: 'out' }), 4930); this._s2 = setTimeout(() => this.setState({ splash: false }), 5380); }
  componentWillUnmount() { clearTimeout(this._t); clearTimeout(this._s1); clearTimeout(this._s2); clearTimeout(this._a1); clearTimeout(this._ws); try { document.removeEventListener('visibilitychange', this._vis); } catch (e) {} }
  get en() { return !!this.state && this.state.lang === 'en'; }
  w(a, e) { return this.en ? e : a; }
  tx(v) { if (v && typeof v === 'object' && !(v instanceof Date)) return (this.en ? v.en : v.ar) || v.ar || v.en || ''; return v == null ? '' : String(v); }
  T0() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  dA(n) { const d = this.T0(); d.setDate(d.getDate() + n); return d; }
  addM(d, m) { const x = new Date(d.getTime()); x.setMonth(x.getMonth() + Number(m || 0)); return x; }
  addD(d, n) { const x = new Date(d.getTime()); x.setDate(x.getDate() + Number(n || 0)); return x; }
  addDur(d, n, u) { n = Number(n) || 0; if (u === 'd') return this.addD(d, n); if (u === 'w') return this.addD(d, n * 7); if (u === 'y') return this.addM(d, n * 12); return this.addM(d, n); }
  dd(d) { return Math.round((d.getTime() - this.T0().getTime()) / 864e5); }
  iso(d) { const z = (n) => String(n).padStart(2, '0'); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
  pd(s) { const p = String(s || '').split('-'); if (p.length < 3 || !p[0]) return null; const d = new Date(+p[0], +p[1] - 1, +p[2]); return isNaN(d.getTime()) ? null : d; }
  fmt(d) { if (!d) return ''; try { return d.toLocaleDateString(this.en ? 'en-GB' : 'ar-OM-u-nu-latn', { day: 'numeric', month: this.en ? 'short' : 'long', year: 'numeric' }); } catch (e) { return this.iso(d); } }
  fmtT(d) { if (!d) return ''; try { return this.fmt(d) + ' · ' + d.toLocaleTimeString(this.en ? 'en-GB' : 'ar-OM-u-nu-latn', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return this.fmt(d); } }
  num(n, dec) { return Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: dec == null ? 3 : dec }); }
  money(n) { return this.num(n) + this.w(' ر.ع', ' OMR'); }
  P(v) { return Number(String(v == null ? '' : v).replace(/[^0-9.]/g, '')) || 0; }
  dU(n) { if (this.en) return n === 1 ? '1 day' : n + ' days'; return n === 1 ? 'يوم واحد' : (n === 2 ? 'يومان' : (n <= 10 ? n + ' أيام' : n + ' يوماً')); }
  wU(n) { if (this.en) return n === 1 ? '1 week' : n + ' weeks'; return n === 1 ? 'أسبوع' : (n === 2 ? 'أسبوعان' : (n <= 10 ? n + ' أسابيع' : n + ' أسبوعاً')); }
  mU(m) { if (this.en) return m === 1 ? '1 month' : m + ' months'; return m === 1 ? 'شهر' : (m === 2 ? 'شهران' : (m <= 10 ? m + ' أشهر' : m + ' شهراً')); }
  yU(y) { if (this.en) return y === 1 ? '1 year' : y + ' years'; return y === 1 ? 'سنة' : (y === 2 ? 'سنتان' : (y <= 10 ? y + ' سنوات' : y + ' سنة')); }
  dtext(n) {
    n = Math.abs(n);
    if (n >= 365) { let y = Math.floor(n / 365), m = Math.round((n - y * 365) / 30); if (m >= 12) { y++; m = 0; } return this.yU(y) + (m ? this.w(' و', ' ') + this.mU(m) : ''); }
    if (n >= 60) return this.mU(Math.round(n / 30));
    return this.dU(n);
  }
  durText(n, u) { n = Number(n) || 0; return u === 'd' ? this.dU(n) : (u === 'w' ? this.wU(n) : (u === 'y' ? this.yU(n) : this.mU(n))); }
  kul(s) {
    if (this.en) return 'every ' + String(s).replace(/^1 /, '').replace(/ or 1 /, ' or ');
    return 'كل ' + String(s).replace('سنتان', 'سنتين').replace('شهران', 'شهرين').replace('يومان', 'يومين').replace('أسبوعان', 'أسبوعين').replace('يوم واحد', 'يوم');
  }
  N(ar, en) { return { ar: ar, en: en }; }
  uid() { return 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  ICON(k) {
    return ({
      doc: 'M3 6.5h18v11H3z M7 10.5h5 M7 14h7 M16 10.5h1.5',
      car: 'M4 16.5V12l2.4-5h11.2L20 12v4.5z M4 12h16 M7 16.5v2 M17 16.5v2 M7.5 14.2h1.5 M15 14.2h1.5',
      dev: 'M3 5h18v11H3z M8 20h8 M12 16v4',
      custom: 'M3.5 12.5v-9h9l8.5 8.5-9 9z M8 8h.01',
      all: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
      fuel: 'M5 20V5h9v15 M4 20h11 M7.5 8.5h4 M14 9l3 2v6.5a1.5 1.5 0 0 0 3 0V9l-3-3',
      chart: 'M5 20V11 M11 20V5 M17 20v-7 M3 20h18',
      carplus: 'M3 16.5V12l2.4-5h8 M3 12h11 M6 16.5v2 M3 16.5h11 M18 9v8 M14 13h8'
    })[k];
  }
  /* أيقونات للأشياء الشائعة: تُختار من اسم العنصر */
  IICON() {
    return {
      oil: 'M12 3c3 4 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0C6.5 10 9 7 12 3z M9.5 14a2.5 2.5 0 0 0 2.5 2.5',
      gear: 'M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z M12 2.5v3 M12 18.5v3 M2.5 12h3 M18.5 12h3 M5.3 5.3l2.1 2.1 M16.6 16.6l2.1 2.1 M5.3 18.7l2.1-2.1 M16.6 7.4l2.1-2.1',
      tire: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 3v5 M12 16v5 M3 12h5 M16 12h5',
      battery: 'M4 8h16v11H4z M7 8V6h3v2 M14 8V6h3v2 M7.5 13.5h3 M14 13.5h3 M15.5 12v3',
      brake: 'M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16z M12 9.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z M7 6.5l1.5 1.5 M17 6.5L15.5 8',
      filter: 'M4 5h16l-6 7v6l-4 2v-8z',
      phone: 'M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3z M11 18h2',
      ac: 'M3 6h18v7H3z M6 10h12 M7 16.5c0 1.5-1 2-1 3 M12 16.5v3 M17 16.5c0 1.5 1 2 1 3',
      washer: 'M5 3h14v18H5z M5 7h14 M8 5h.01 M11 5h.01 M12 10a4 4 0 1 0 0 8a4 4 0 1 0 0-8z',
      fridge: 'M6 3h12v18H6z M6 10h12 M9 6v2 M9 13v3',
      tv: 'M3 7h18v11H3z M8 3l4 4 4-4 M9 21h6',
      laptop: 'M5 5h14v10H5z M3 19h18',
      heater: 'M7 3h10v18H7z M10 7h4 M12 11c1.5 1.5 1.5 3 0 4.5c-1.5-1.5-1.5-3 0-4.5z',
      passport: 'M6 3h12v18H6z M12 8.5a3 3 0 1 0 0 6a3 3 0 1 0 0-6z M9 17.5h6',
      idcard: 'M3 6h18v12H3z M8.5 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4z M13 10h5 M13 14h4',
      licence: 'M3 6h18v12H3z M6 15h5 M14 10h4 M14 13h4 M6 9h5v3H6z',
      reg: 'M5 3h10l4 4v14H5z M14 3v5h5 M8 17v-2.5l1.3-2.5h5.4l1.3 2.5V17z M8 14.5h8',
      shield: 'M12 3l7 3v5c0 4.5-3 8-7 10c-4-2-7-5.5-7-10V6z M9 12l2 2 4-4',
      check: 'M8 4h8v3H8z M6 5.5H5v15h14v-15h-1 M9 13l2 2 4-4'
    };
  }
  itemIcon(it) {
    const nm = it && it.name, txt = (nm && typeof nm === 'object' ? (nm.ar || '') + ' ' + (nm.en || '') : String(nm || '')).toLowerCase();
    const R = [['gear', /زيت الجير|زيت القير|ناقل الحركة|transmission|gear oil/], ['oil', /زيت|oil/], ['tire', /إطار|اطار|كفر|تاير|tire|tyre/], ['battery', /بطاري|battery/], ['brake', /فرامل|فحمات|بريك|brake/], ['filter', /فلتر|filter/],
      ['phone', /هاتف|جوال|موبايل|آيفون|ايفون|phone|mobile/], ['ac', /مكيف|تكييف|air ?con|\bac\b/], ['washer', /غسال|wash/], ['fridge', /ثلاج|براد|fridge|refrigerator/], ['tv', /تلفزيون|تلفاز|tv|television/], ['laptop', /لابتوب|حاسوب|كمبيوتر|laptop|computer/], ['heater', /سخان|heater/],
      ['passport', /جواز|passport/], ['licence', /رخصة|licen/], ['reg', /ملكية|registration|mulkiya/], ['shield', /تأمين|تامين|insurance/], ['check', /فحص|inspection/], ['idcard', /بطاقة|هوية|\bid\b|identity/]];
    const m = R.find((x) => x[1].test(txt));
    return m ? this.IICON()[m[0]] : this.ICON(it && it.cat);
  }
  RN() {
    return {
      doc: this.N('انتهاء الوثيقة', 'Document expiry'), car: this.N('التغيير القادم', 'Next change'), war: this.N('انتهاء الضمان', 'Warranty end'),
      maint: this.N('الصيانة الدورية', 'Periodic maintenance'), cdate: this.N('الموعد', 'Due date'), crep: this.N('الموعد القادم', 'Next due')
    };
  }
  init() {
    const d = (n) => this.dA(n), N = (a, e) => this.N(a, e), R = this.RN();
    const doc = (id, carId, name, issue, exp, before, specs, history) => ({ id: id, cat: 'doc', carId: carId, name: name, number: '', issue: d(issue), specs: specs || [], rems: [{ id: 'b1', base: true, type: 'date', name: R.doc, date: d(exp), start: d(issue), renew: true, before: before || [30, 7] }], history: history || [] });
    const part = (id, carId, name, lastDate, lastKm, n, u, km, cost, specs, history, extra) => ({ id: id, cat: 'car', carId: carId, name: name, cost: cost, specs: specs || [], rems: [{ id: 'b1', base: true, type: 'cycle', name: R.car, lastDate: d(lastDate), lastKm: lastKm, n: n, u: u, everyKm: km, before: [14] }].concat(extra || []), history: history || [] });
    return {
      splash: 'in', dlg: null, draft: null, discardFor: null, onboarded: false, notified: {}, notifAsked: false, alertDay: '', flashId: null, hd: null, cm: null, changes: [], pendingSave: null, nTick: 0, ob: 'welcome', obCar: { name: '', plate: '', odo: '' }, obDocs: {}, obErr: '', lang: 'ar', dark: false, tab: 'cars', carSel: null, carSub: 'parts', screen: 'home', from: 'home', sel: null, q: '', cat: 'all', st: 'all', showArch: false, showExtra: false, editId: null,
      sheet: null, form: null, formErr: '', rf: {}, remF: null, remErr: false, specF: { k: '', v: '' }, odoIn: '', fuelF: null, carF: null, carEditId: null, carErr: '',
      toast: '', undo: null, zoom: false, pending: null, lastExport: null,
      nextId: 100, nextR: 10, nextF: 100, nextC: 3, notifTime: '09:00', odoEvery: 14,
      cars: [],
      items: []
    };
  }
  OBDEFS(withCar) {
    const N = (a, e) => this.N(a, e);
    const own = [{ key: 'id', name: N('البطاقة الشخصية', 'National ID card') }, { key: 'lic', name: N('رخصة القيادة', 'Driving licence') }, { key: 'pass', name: N('جواز السفر', 'Passport') }];
    const car = withCar ? this.CTPL().map((t, i) => ({ key: 'c' + i, name: t, car: true })) : [];
    return own.concat(car);
  }
  obGo(step) { this.setState({ ob: step, obErr: '' }); }
  obNextStep() {
    const s = this.state, st = s.ob;
    if (st === 'car') {
      const c = s.obCar || {};
      const any = String(c.plate || '').trim() || String(c.odo || '').trim();
      if (!String(c.name || '').trim() && any) { this.setState({ obErr: this.w('اكتب اسم السيارة، أو اضغط «ليس لدي سيارة الآن»', 'Enter the car name, or tap “No car for now”') }); return; }
      this.obGo('docs'); return;
    }
    if (st === 'docs') {
      const hasCar = !!String((s.obCar || {}).name || '').trim();
      const miss = this.OBDEFS(hasCar).find((d) => { const v = (s.obDocs || {})[d.key]; return v && v.on && !this.pd(v.exp); });
      if (miss) { this.setState({ obErr: this.w('اكتب تاريخ انتهاء «' + this.tx(miss.name) + '»', 'Enter the expiry date for “' + this.tx(miss.name) + '”') }); return; }
      this.obGo('rem'); return;
    }
    if (st === 'rem') this.obFinish();
  }
  obBackStep() { const st = this.state.ob; this.obGo(st === 'rem' ? 'docs' : (st === 'docs' ? 'car' : 'welcome')); }
  obFinish() {
    const s = this.state, oc = s.obCar || {}, od = s.obDocs || {}, T = this.T0();
    const nm = String(oc.name || '').trim();
    let cars = s.cars, nextC = s.nextC, nextId = s.nextId, carId = null;
    if (nm) {
      carId = 'c' + nextC; nextC += 1;
      const odo = Math.round(this.P(oc.odo));
      cars = cars.concat([{ id: carId, name: nm, plate: String(oc.plate || '').trim(), photo: null, odo: odo, odoLog: [{ date: T, km: odo }], fuel: [] }]);
    }
    const items = [];
    this.OBDEFS(!!nm).forEach((d) => {
      const v = od[d.key]; if (!v || !v.on) return;
      const ex = this.pd(v.exp); if (!ex) return;
      const iss = ex.getTime() >= T.getTime() ? T : this.addM(ex, -12);
      const f = Object.assign(this.defaults('doc', d.car ? carId : null), { name: this.tx(d.name), nameObj: d.name, issue: this.iso(iss), expiry: this.iso(ex) });
      const it = this.build(f, null); if (typeof it === 'string') return;
      it.id = nextId; nextId += 1; items.push(it);
    });
    this.setState({ cars: cars, items: items.concat(s.items), nextC: nextC, nextId: nextId, carSel: carId || s.carSel, tab: nm || !items.length ? 'cars' : 'docs', carSub: items.some((x) => x.carId) ? 'docs' : 'parts', screen: 'home', onboarded: true, ob: null, obCar: { name: '', plate: '', odo: '' }, obDocs: {}, obErr: '' });
    const parts = [];
    if (nm) parts.push(this.w('سيارتك', 'your car'));
    if (items.length) parts.push(this.w(items.length === 1 ? 'وثيقة واحدة' : (items.length === 2 ? 'وثيقتان' : items.length + ' وثائق'), items.length === 1 ? '1 document' : items.length + ' documents'));
    this.toast(parts.length ? this.w('جاهز! أُضيفت ', 'All set! Added ') + parts.join(this.w(' و', ' and ')) : this.w('جاهز! ابدأ بإضافة ما تريد متابعته', 'All set! Start adding what you want to track'));
    setTimeout(() => this.checkAlerts(true), 900);
  }
  obVals(s) {
    const en = this.en, st = s.onboarded ? null : (s.ob || 'welcome');
    const O = {
      aria: this.w('الترحيب والإعداد', 'Welcome and setup'),
      hi: this.w('أهلاً بك في عُهدة', 'Welcome to Uhda'),
      hiSub: this.w('وثائقك وضماناتك وصيانة سياراتك وأجهزتك في مكان واحد، مع تذكير قبل كل موعد.', 'Your documents, warranties, car and device maintenance in one place, with a reminder before every date.'),
      f1: this.w('سياراتي', 'My cars'), f1s: this.w('الزيت والقطع ووثائق السيارة بالكيلومتر أو بالوقت', 'Oil, parts and car papers by km or by time'),
      f2: this.w('وثائقي وأجهزتي', 'Documents & devices'), f2s: this.w('تواريخ الانتهاء والضمانات والفواتير', 'Expiry dates, warranties and invoices'),
      f3: this.w('تنبيه تلقائي', 'Automatic alerts'), f3s: this.w('يوم الانتهاء أو الصيانة، ويتكرر يومياً حتى تجدّد', 'On the due day, repeated daily until you renew'),
      start: this.w('ابدأ الإعداد', 'Start setup'), restore: this.w('لدي نسخة احتياطية — استرجاع', 'I have a backup — restore'), skip: this.w('تخطٍّ، سأضيف لاحقاً', 'Skip, I’ll add things later'),
      back: this.w('رجوع', 'Back'),
      carName: this.w('اسم السيارة', 'Car name'), carNamePh: this.w('مثال: سيارتي الشخصية', 'e.g. My car'),
      plate: this.w('رقم اللوحة (اختياري)', 'Plate number (optional)'), platePh: this.w('مثال: 12345 أ ب', 'e.g. 12345 AB'),
      odo: this.w('قراءة العداد الآن (كم)', 'Odometer now (km)'), odoPh: this.w('مثال: 84650', 'e.g. 84650'),
      noCar: this.w('ليس لدي سيارة الآن', 'No car for now'), expiry: this.w('تاريخ الانتهاء', 'Expiry date'),
      remNote: this.w('يصلك التنبيه تلقائياً يوم انتهاء الوثيقة أو موعد الصيانة في هذا الوقت، ويتكرر كل يوم حتى تجدّد أو تُسكته.', 'Alerts arrive automatically on the expiry or service day at this time, and repeat daily until you renew or silence them.')
    };
    const oc = s.obCar || { name: '', plate: '', odo: '' }, hasCar = !!String(oc.name || '').trim(), od = s.obDocs || {};
    const steps = ['car', 'docs', 'rem'], idx = steps.indexOf(st);
    const row = (d) => {
      const v = od[d.key] || { on: false, exp: '' };
      const upd = (patch) => this.setState({ obErr: '', obDocs: Object.assign({}, this.state.obDocs, { [d.key]: Object.assign({ on: false, exp: '' }, (this.state.obDocs || {})[d.key], patch) }) });
      return { label: this.tx(d.name), on: v.on ? 'on' : '', isOn: !!v.on, pressed: v.on ? 'true' : 'false', exp: v.exp || '', pick: () => upd({ on: !v.on }), onExp: (e) => upd({ exp: e.target.value }) };
    };
    const defs = this.OBDEFS(hasCar);
    const groups = [{ title: this.w('وثائقك الشخصية', 'Personal documents'), rows: defs.filter((d) => !d.car).map(row) }];
    if (hasCar) groups.push({ title: this.w('وثائق «', 'Documents for “') + String(oc.name).trim() + this.w('»', '”'), rows: defs.filter((d) => d.car).map(row) });
    const nDocs = defs.filter((d) => (od[d.key] || {}).on).length;
    const sum = [];
    if (hasCar) sum.push(this.w('سيارة: ', 'Car: ') + String(oc.name).trim());
    sum.push(nDocs ? this.w('وثائق للمتابعة: ', 'Documents to track: ') + nDocs : this.w('بدون وثائق الآن — يمكنك إضافتها لاحقاً', 'No documents yet — you can add them later'));
    return {
      O: O, obOn: !!st, obWelcome: st === 'welcome', obStep: idx >= 0, obCarStep: st === 'car', obDocsStep: st === 'docs', obRemStep: st === 'rem',
      obProg: steps.map((x, i) => ({ on: i <= idx ? 'on' : '' })), obStepText: idx >= 0 ? this.w('الخطوة ' + (idx + 1) + ' من 3', 'Step ' + (idx + 1) + ' of 3') : '',
      obTitle: st === 'car' ? this.w('سيارتك', 'Your car') : (st === 'docs' ? this.w('وثائقك', 'Your documents') : this.w('التذكيرات', 'Reminders')),
      obSub: st === 'car' ? this.w('أضف سيارتك لمتابعة الزيت والقطع ووثائق السيارة. يمكنك إضافة سيارات أخرى لاحقاً.', 'Add your car to track oil, parts and car papers. You can add more cars later.') : (st === 'docs' ? this.w('اختر ما تريد متابعته واكتب تاريخ انتهائه.', 'Choose what to track and enter its expiry date.') : this.w('متى يصلك التذكير؟', 'When should reminders arrive?')),
      obNextText: st === 'rem' ? this.w('ابدأ استخدام عُهدة', 'Start using Uhda') : this.w('التالي', 'Next'),
      obCar: oc, obHasCar: hasCar, obGroups: groups, obSummary: sum.join(' · '), obErr: s.obErr, obHasErr: !!s.obErr,
      obStart: () => this.obGo('car'), obSkip: () => { this.setState({ onboarded: true, ob: null, obErr: '' }); setTimeout(() => this.checkAlerts(true), 600); },
      obImport: (e) => { this.setState({ onboarded: true, ob: null, obErr: '' }); this.onImportFile(e); },
      obBack: () => this.obBackStep(), obNext: () => this.obNextStep(), obNoCar: () => this.setState({ obCar: { name: '', plate: '', odo: '' }, ob: 'docs', obErr: '' }),
      obCarName: (e) => this.setState({ obErr: '', obCar: Object.assign({}, this.state.obCar, { name: e.target.value }) }),
      obCarPlate: (e) => this.setState({ obCar: Object.assign({}, this.state.obCar, { plate: e.target.value }) }),
      obCarOdo: (e) => this.setState({ obCar: Object.assign({}, this.state.obCar, { odo: String(e.target.value).replace(/[^0-9]/g, '') }) })
    };
  }
  setLang(l) {
    if (l === this.state.lang) return;
    this.setState({ lang: l, flip: true });
    setTimeout(() => this.setState({ flip: false }), 40);
  }
  car(id) { return (this.state.cars || []).find((c) => c.id === id) || null; }
  curCar() { const s = this.state; return this.car(s.carSel) || s.cars[0] || null; }
  avgKnown(c) { const L = (c && c.odoLog) || []; if (L.length < 2) return false; const a = L[0], b = L[L.length - 1]; return (b.date.getTime() - a.date.getTime()) / 864e5 >= 7 && b.km > a.km; }
  avg(c) {
    if (!this.avgKnown(c)) return 40;
    const L = c.odoLog, a = L[0], b = L[L.length - 1];
    return (b.km - a.km) / ((b.date.getTime() - a.date.getTime()) / 864e5);
  }
  bfa(a, dflt) { return a && a.length ? a.slice().sort((x, y) => y - x) : dflt; }
  BOPTS() { return [[1, 'يوم', '1 day'], [3, '3 أيام', '3 days'], [7, 'أسبوع', '1 week'], [14, 'أسبوعان', '2 weeks'], [30, 'شهر', '1 month'], [60, 'شهران', '2 months']]; }
  UNITS() { return [['d', 'أيام', 'Days'], ['w', 'أسابيع', 'Weeks'], ['m', 'أشهر', 'Months'], ['y', 'سنوات', 'Years']]; }
  track(it, r) {
    const c = it.carId ? this.car(it.carId) : null;
    const o = c ? c.odo : 0, avg = this.avg(c);
    let due = null, start = null, dueKm = null, startKm = null;
    if (r.type === 'date') { due = r.date; start = r.start; }
    else {
      start = r.lastDate;
      if (Number(r.n)) due = this.addDur(r.lastDate, r.n, r.u);
      if (Number(r.everyKm) && c) { startKm = Number(r.lastKm) || 0; dueKm = startKm + Number(r.everyKm); }
    }
    const days = due ? this.dd(due) : null;
    const km = dueKm != null ? dueKm - o : null;
    const inactive = !!r.warranty && days != null && days < 0;
    let lv = 'g';
    if ((days != null && days < 0) || (km != null && km < 0)) lv = 'r';
    else if ((days != null && days < 15) || (km != null && km < 500)) lv = 'o';
    if (inactive) lv = 'x';
    let p = 0;
    if (due && start) { const tot = due.getTime() - start.getTime(); p = tot > 0 ? (this.T0().getTime() - start.getTime()) / tot : 1; }
    if (km != null && dueKm > startKm) p = Math.max(p, (o - startKm) / (dueKm - startKm));
    p = Math.min(1, Math.max(0, p));
    const kmDays = km != null ? Math.round(km / avg) : null;
    const u = Math.min(days != null ? days : 1e9, km != null ? km / avg : 1e9);
    const useKm = km != null && (days == null || km / avg < days);
    const doc = it.cat === 'doc';
    let text;
    if (inactive) text = this.w('الضمان منتهي', 'Warranty expired');
    else if (useKm) text = km < 0 ? this.w('تجاوز بـ ' + this.num(-km) + ' كم', 'Over by ' + this.num(-km) + ' km') : this.w('متبقي ' + this.num(km) + ' كم', this.num(km) + ' km left');
    else if (days == null) text = this.w('بدون تنبيه', 'No alert');
    else if (days < 0) text = this.en ? (doc ? 'Expired ' + this.dtext(-days) + ' ago' : 'Overdue by ' + this.dtext(-days)) : (doc ? 'انتهت منذ ' : 'متأخر ') + this.dtext(-days);
    else if (days === 0) text = this.w('الموعد اليوم', 'Due today');
    else text = this.w('متبقي ' + this.dtext(days), this.dtext(days) + ' left');
    let dueText = due ? this.fmt(due) : '';
    if (dueKm != null) dueText += (dueText ? this.w(' أو عند ', ' or at ') : this.w('عند ', 'at ')) + this.num(dueKm) + this.w(' كم', ' km');
    let predict = '';
    if (km != null && km >= 0 && this.avgKnown(c)) predict = this.w('حسب معدّل قيادتك: متوقع ', 'At your driving rate: expected ') + (kmDays <= 0 ? this.w('اليوم', 'today') : this.w('خلال ', 'in ') + this.dtext(kmDays));
    const bf = (r.before || []).filter((n) => n > 0);
    const beforeText = r.warranty || !bf.length ? '' : this.w('تنبيه قبل ', 'Alert ') + bf.map((n) => this.dtext(n)).join(this.w(' ثم ', ', ')) + this.w('', ' before') + this.w(' · الساعة ', ' · at ') + this.state.notifTime;
    let typeText;
    if (r.warranty) typeText = this.w('ضمان — ينتهي ', 'Warranty — ends ') + this.fmt(due);
    else if (r.once) typeText = this.w('تذكير لمرة واحدة', 'One-time reminder');
    else if (r.type === 'date') typeText = this.w('تاريخ ثابت — يُجدَّد', 'Fixed date — renewable');
    else { const parts = []; if (Number(r.n)) parts.push(this.durText(r.n, r.u)); if (Number(r.everyKm)) parts.push(this.num(r.everyKm) + this.w(' كم', ' km')); typeText = this.w('يتكرر ', 'Repeats ') + this.kul(parts.join(this.w(' أو ', ' or '))) + (parts.length > 1 ? this.w(' (أيهما أولاً)', ' (whichever first)') : ''); }
    const LT = { r: doc ? this.w('منتهي', 'Expired') : this.w('متأخر', 'Overdue'), o: this.w('قريب', 'Due soon'), g: this.w('ساري', 'Valid'), x: this.w('منتهي', 'Expired') };
    const canDone = !r.warranty;
    const doneLabel = r.once ? this.w('تم', 'Done') : (r.type === 'date' ? this.w('تم التجديد', 'Renewed') : (it.cat === 'car' ? this.w('تم التغيير', 'Changed') : (it.cat === 'dev' ? this.w('تمت الصيانة', 'Serviced') : this.w('تم', 'Done'))));
    return { id: r.id, doc: doc, name: this.tx(r.name), days: days, km: km, lv: lv, lvText: LT[lv], inactive: inactive, p: p, left: Math.round((1 - p) * 100), u: u, useKm: useKm, text: text, dueText: dueText, predict: predict, hasPredict: !!predict, beforeText: beforeText, hasBefore: !!beforeText, typeText: typeText, canDone: canDone, custom: !r.base, hasActions: canDone || !r.base, doneLabel: doneLabel };
  }
  big(t) {
    if (!t) return { big: '—', unit: this.w('بدون تنبيه', 'no alert') };
    if (t.inactive) return { big: '—', unit: this.w('الضمان منتهي', 'warranty expired') };
    if (t.useKm) return { big: this.num(Math.abs(t.km)), unit: t.km < 0 ? this.w('كم تجاوز', 'km over') : this.w('كم', 'km') };
    const a = Math.abs(t.days), pre = t.days < 0 ? (t.doc ? this.w('منتهي منذ · ', 'expired · ') : this.w('متأخر · ', 'overdue · ')) : '';
    if (a >= 365) { let y = Math.floor(a / 365), m = Math.round((a - y * 365) / 30); if (m >= 12) { y++; m = 0; } return { big: String(y), unit: pre + (this.en ? (y === 1 ? 'year' : 'years') + (m ? ' ' + this.mU(m) : '') : (y >= 3 && y <= 10 ? 'سنوات' : 'سنة') + (m ? ' و' + this.mU(m) : '')) }; }
    if (a >= 60) { const m = Math.round(a / 30); return { big: String(m), unit: pre + (this.en ? 'months' : (m <= 10 ? 'أشهر' : 'شهراً')) }; }
    return { big: String(a), unit: pre + (this.en ? (a === 1 ? 'day' : 'days') : (a >= 3 && a <= 10 ? 'أيام' : 'يوم')) };
  }
  dash(left) { return (Math.max(0.03, (left == null ? 100 : left) / 100) * 301.6).toFixed(1) + ' 301.6'; }
  CNAME(c) { return ({ doc: this.w('وثيقة', 'Document'), car: this.w('قطعة سيارة', 'Car part'), dev: this.w('جهاز', 'Device'), custom: this.w('مخصص', 'Custom') })[c]; }
  view(it) {
    const ts = (it.rems || []).filter((r) => !r.done).map((r) => this.track(it, r));
    const act = ts.filter((t) => !t.inactive);
    let m = null; act.forEach((t) => { if (!m || t.u < m.u) m = t; });
    let dn = null; act.filter((t) => t.canDone).forEach((t) => { if (!dn || t.u < dn.u) dn = t; });
    const lv = m ? m.lv : 'n';
    const arch = ts.length > 0 && act.length === 0;
    const doc = it.cat === 'doc';
    const LT = { r: doc ? this.w('منتهي', 'Expired') : this.w('متأخر', 'Overdue'), o: this.w('قريب', 'Due soon'), g: this.w('ساري', 'Valid'), n: arch ? this.w('مؤرشف', 'Archived') : this.w('بدون تنبيه', 'No alert') };
    const b = this.big(m || ts[0]);
    const c = it.carId ? this.car(it.carId) : null;
    const catName = this.CNAME(it.cat);
    return Object.assign({}, it, {
      name: this.tx(it.name), ts: ts, lv: lv, lvText: LT[lv], arch: arch, u: m ? m.u : 1e12,
      sub: m ? m.text : (ts.length ? ts[0].text : this.w('حفظ بيانات فقط', 'Data only')), mainName: m ? m.name : '',
      due: m ? m.dueText : '', left: m ? m.left : 100, ringDash: this.dash(m ? m.left : 100),
      big: b.big, unit: b.unit, icon: this.itemIcon(it), catName: catName, carName: c ? this.tx(c.name) : '', catLine: catName + (c ? ' · ' + this.tx(c.name) : ''),
      mainRem: dn ? dn.id : null, mainRemName: dn ? dn.name : '', mainDoneLabel: dn ? dn.doneLabel : '',
      flash: this.state.flashId === it.id ? 'flash' : '',
      open: () => this.setState({ screen: 'detail', from: 'home', sel: it.id, zoom: false })
    });
  }
  FD() {
    return {
      doc: [['name', 'اسم الوثيقة', 'Document name', 'text', 'مثال: جواز السفر', 'e.g. Passport', 0], ['expiry', 'تاريخ الانتهاء', 'Expiry date', 'date', '', '', 0], ['number', 'رقم الوثيقة', 'Document number', 'text', 'اختياري', 'Optional', 1], ['issue', 'تاريخ الإصدار', 'Issue date', 'date', '', '', 1]],
      car: [['name', 'اسم القطعة أو الصيانة', 'Part or service name', 'text', 'مثال: زيت المكينة', 'e.g. Engine oil', 0], ['life', 'العمر الافتراضي بالزمن', 'Lifespan by time', 'dur', '6', '6', 0], ['everyKm', 'العمر الافتراضي (بالكيلومترات)', 'Lifespan (km)', 'num', '5000', '5000', 0], ['lastDate', 'تاريخ التركيب أو التغيير', 'Installed / changed on', 'date', '', '', 0], ['cost', 'التكلفة (ر.ع)', 'Cost (OMR)', 'dec', '', '', 1]],
      dev: [['name', 'اسم الجهاز', 'Device name', 'text', 'مثال: مكيف غرفة النوم', 'e.g. Bedroom AC', 0], ['purchase', 'تاريخ الشراء', 'Purchase date', 'date', '', '', 0], ['warranty', 'مدة الضمان', 'Warranty period', 'dur', '2', '2', 0], ['model', 'الموديل أو الرقم التسلسلي', 'Model or serial number', 'text', '', '', 1]],
      custom: [['name', 'اسم العنصر', 'Item name', 'text', 'مثال: تجديد اشتراك النادي', 'e.g. Gym membership renewal', 0]]
    };
  }
  CTPL() { return [this.N('ملكية السيارة', 'Car registration'), this.N('التأمين', 'Insurance'), this.N('الفحص الدوري', 'Inspection')]; }
  PRE(cat, carId) {
    const N = (a, e) => this.N(a, e);
    if (cat === 'doc') return carId ? this.CTPL().map((x) => [x, {}]) : [[N('البطاقة الشخصية', 'National ID card'), {}], [N('رخصة القيادة', 'Driving licence'), {}], [N('جواز السفر', 'Passport'), {}]];
    if (cat === 'car') return [[N('زيت المكينة', 'Engine oil'), { lifeN: '6', lifeU: 'm', everyKm: '5000' }], [N('زيت الجير', 'Transmission oil'), { lifeN: '2', lifeU: 'y', everyKm: '40000' }], [N('البطارية', 'Battery'), { lifeN: '2', lifeU: 'y', everyKm: '' }], [N('الإطارات', 'Tires'), { lifeN: '4', lifeU: 'y', everyKm: '50000' }], [N('فحمات الفرامل', 'Brake pads'), { lifeN: '', everyKm: '35000' }], [N('فلتر الهواء', 'Air filter'), { lifeN: '1', lifeU: 'y', everyKm: '15000' }]];
    if (cat === 'dev') return [[N('مكيف', 'AC'), { warrantyN: '2', warrantyU: 'y', maintN: '3', maintU: 'm', maintName: '', maintObj: N('تنظيف الفلتر', 'Clean filter') }], [N('ثلاجة', 'Fridge'), { warrantyN: '2', warrantyU: 'y', maintN: '6', maintU: 'm', maintName: '', maintObj: N('تغيير فلتر الماء', 'Replace water filter') }], [N('تلفزيون', 'TV'), { warrantyN: '2', warrantyU: 'y', maintN: '', maintName: '', maintObj: null }], [N('هاتف', 'Phone'), { warrantyN: '1', warrantyU: 'y', maintN: '', maintName: '', maintObj: null }], [N('لابتوب', 'Laptop'), { warrantyN: '1', warrantyU: 'y', maintN: '', maintName: '', maintObj: null }], [N('سخان الماء', 'Water heater'), { warrantyN: '2', warrantyU: 'y', maintN: '6', maintU: 'm', maintName: '', maintObj: N('تنظيف الخزان', 'Flush the tank') }], [N('غسالة', 'Washing machine'), { warrantyN: '2', warrantyU: 'y', maintN: '1', maintU: 'm', maintName: '', maintObj: N('تنظيف الحوض', 'Clean drum') }]];
    return [];
  }
  TPL(it) {
    const N = (a, e) => this.N(a, e), n = this.tx(it.name) + ' ' + (it.name && it.name.ar ? it.name.ar : '');
    if (it.cat === 'car') return [[N('تدوير الإطارات', 'Tire rotation'), { kind: 'km', km: '10000' }], [N('فحص ضغط الهواء', 'Tire pressure check'), { kind: 'cycle', n: '1', u: 'm' }], [N('فحص الفرامل', 'Brake check'), { kind: 'km', km: '20000' }]];
    if (/مكيف|AC/i.test(n)) return [[N('تنظيف الفلتر', 'Clean filter'), { kind: 'cycle', n: '3', u: 'm' }], [N('فحص الغاز', 'Gas check'), { kind: 'cycle', n: '1', u: 'y' }], [N('صيانة شاملة', 'Full service'), { kind: 'cycle', n: '1', u: 'y' }]];
    if (/ثلاج|fridge/i.test(n)) return [[N('تغيير فلتر الماء', 'Replace water filter'), { kind: 'cycle', n: '6', u: 'm' }], [N('تنظيف الملف الخلفي', 'Clean rear coil'), { kind: 'cycle', n: '1', u: 'y' }]];
    if (/غسال|wash/i.test(n)) return [[N('تنظيف الحوض', 'Clean drum'), { kind: 'cycle', n: '1', u: 'm' }], [N('تنظيف فلتر التصريف', 'Clean drain filter'), { kind: 'cycle', n: '3', u: 'm' }]];
    if (it.cat === 'doc') return [[N('تجهيز أوراق التجديد', 'Prepare renewal papers'), { kind: 'once' }]];
    return [[N('فحص دوري', 'Routine check'), { kind: 'cycle', n: '6', u: 'm' }]];
  }
  defaults(c, carId) {
    const t = this.iso(this.T0());
    if (c === 'doc') return { cat: c, carId: carId || null, name: '', number: '', issue: t, expiry: this.iso(this.addM(this.T0(), 12)), before: [30, 7], specK: '', specV: '' };
    if (c === 'car') { const cr = this.car(carId) || this.curCar(); return { cat: c, carId: cr ? cr.id : null, name: '', lastDate: t, lastKm: '', odoMode: 'last', lifeN: '6', lifeU: 'm', everyKm: '5000', before: [14], cost: '', specK: '', specV: '' }; }
    if (c === 'dev') return { cat: c, name: '', model: '', purchase: t, warrantyN: '2', warrantyU: 'y', maintN: '', maintU: 'm', maintName: '', maintLast: t, maintCustom: false, before: [3], specK: '', specV: '' };
    return { cat: c, name: '', mode: 'repeat', date: this.iso(this.dA(30)), everyN: '1', everyU: 'm', lastDate: t, before: [3], specK: '', specV: '' };
  }
  toForm(it) {
    const R = it.rems || [], b1 = R.find((r) => r.id === 'b1') || {}, b2 = R.find((r) => r.id === 'b2') || {};
    const base = { cat: it.cat, carId: it.carId || null, name: this.tx(it.name), nameObj: typeof it.name === 'object' ? it.name : null };
    if (it.cat === 'doc') return Object.assign(base, { number: this.tx(it.number), issue: this.iso(it.issue || this.T0()), expiry: b1.date ? this.iso(b1.date) : '', before: b1.before || [30, 7], photo: it.photo || null });
    if (it.cat === 'car') return Object.assign(base, { lastDate: this.iso(b1.lastDate || this.T0()), lastKm: String(b1.lastKm || ''), odoMode: 'new', lifeN: b1.n ? String(b1.n) : '', lifeU: b1.u || 'm', everyKm: b1.everyKm ? String(b1.everyKm) : '', before: b1.before || [14], cost: it.cost ? String(it.cost) : '', photo: it.photo || null });
    if (it.cat === 'dev') { const MS = [[1, 'm'], [3, 'm'], [6, 'm'], [1, 'y']]; return Object.assign(base, { model: this.tx(it.model), purchase: this.iso(it.purchase || this.T0()), warrantyN: it.warrantyN ? String(it.warrantyN) : '', warrantyU: it.warrantyU || 'm', maintN: b2.n ? String(b2.n) : '', maintU: b2.u || 'm', maintName: b2.name ? this.tx(b2.name) : '', maintObj: b2.name && typeof b2.name === 'object' ? b2.name : null, maintLast: this.iso(b2.lastDate || this.T0()), maintCustom: !!b2.n && !MS.some((m) => m[0] === Number(b2.n) && m[1] === (b2.u || 'm')), before: b2.before || [3], photo: it.photo || null }); }
    return Object.assign(base, { photo: it.photo || null, mode: it.mode || 'none', date: b1.type === 'date' && b1.date ? this.iso(b1.date) : this.iso(this.dA(30)), everyN: b1.n ? String(b1.n) : '1', everyU: b1.u || 'm', lastDate: this.iso(b1.lastDate || this.T0()), before: b1.before || [3] });
  }
  build(f, old) {
    const T = this.T0(), n = (v) => this.P(v), R = this.RN();
    const keep = old ? (old.rems || []).filter((r) => !r.base) : [];
    const nm = String(f.name).trim();
    const it = Object.assign({}, old || { id: this.state.nextId, history: [], specs: [] }, { cat: f.cat, name: f.nameObj && this.tx(f.nameObj) === nm ? f.nameObj : nm });
    if (f.photo) it.photo = f.photo;
    if (!old && String(f.specV || '').trim()) it.specs = [{ k: String(f.specK || '').trim() || this.w('مواصفات', 'Spec'), v: String(f.specV).trim() }];
    let base = [];
    if (f.cat === 'doc') {
      it.carId = f.carId || null; it.number = f.number; it.issue = this.pd(f.issue) || T;
      const ex = this.pd(f.expiry) || this.addM(T, 12);
      if (ex.getTime() < it.issue.getTime()) return this.w('تاريخ الانتهاء قبل تاريخ الإصدار — راجع التاريخين', 'Expiry date is before issue date — please check');
      base = [{ id: 'b1', base: true, type: 'date', name: R.doc, date: ex, start: it.issue, renew: true, before: this.bfa(f.before, [30, 7]) }];
      if (!old && f.photo) it.history = [{ id: this.uid(), date: it.issue, cost: 0, note: this.N('صورة الوثيقة', 'Document photo'), photo: f.photo }];
    }
    if (f.cat === 'car') {
      const cr = this.car(f.carId);
      if (!cr) return this.w('اختر السيارة أولاً', 'Choose a car first');
      if (!n(f.lifeN) && !n(f.everyKm)) return this.w('حدد العمر الافتراضي بالزمن أو بالكيلومترات', 'Set a lifespan by time or by km');
      it.carId = cr.id; it.cost = n(f.cost);
      base = [{ id: 'b1', base: true, type: 'cycle', name: R.car, lastDate: this.pd(f.lastDate) || T, lastKm: f.odoMode === 'new' ? n(f.lastKm) : cr.odo, n: n(f.lifeN), u: f.lifeU || 'm', everyKm: n(f.everyKm), before: this.bfa(f.before, [14]) }];
      if (!old && (it.cost || f.photo)) it.history = [{ id: this.uid(), date: base[0].lastDate, km: base[0].lastKm, cost: it.cost, note: this.N('التركيب / التغيير', 'Installed / changed'), photo: f.photo || null }];
    }
    if (f.cat === 'dev') {
      it.model = f.model; it.purchase = this.pd(f.purchase) || T; it.warrantyN = n(f.warrantyN); it.warrantyU = f.warrantyU || 'm';
      if (it.warrantyN) base.push({ id: 'b1', base: true, type: 'date', name: R.war, date: this.addDur(it.purchase, it.warrantyN, it.warrantyU), start: it.purchase, warranty: true });
      if (n(f.maintN)) {
        const ob = old ? (old.rems || []).find((r) => r.id === 'b2') : null;
        const mn = String(f.maintName || '').trim();
        const mname = mn ? (f.maintObj && this.tx(f.maintObj) === mn ? f.maintObj : mn) : (f.maintObj || R.maint);
        base.push({ id: 'b2', base: true, type: 'cycle', name: mname, lastDate: this.pd(f.maintLast) || (ob ? ob.lastDate : T), n: n(f.maintN), u: f.maintU || 'm', before: this.bfa(f.before, [3]), muted: ob ? !!ob.muted : false });
      }
      if (!old && f.photo) it.history = [{ id: this.uid(), date: it.purchase, cost: 0, note: this.N('الشراء — الفاتورة والضمان', 'Purchase — invoice & warranty'), photo: f.photo }];
    }
    if (f.cat === 'custom') {
      it.mode = f.mode;
      if (f.mode === 'date') base = [{ id: 'b1', base: true, type: 'date', name: R.cdate, date: this.pd(f.date) || this.dA(30), start: T, renew: true, before: this.bfa(f.before, [3]) }];
      if (f.mode === 'repeat') base = [{ id: 'b1', base: true, type: 'cycle', name: R.crep, lastDate: this.pd(f.lastDate) || T, n: n(f.everyN) || 1, u: f.everyU || 'm', before: this.bfa(f.before, [3]) }];
    }
    it.rems = base.concat(keep);
    return it;
  }
  bumpCar(cars, carId, km) {
    const T = this.T0();
    return cars.map((c) => (c.id === carId && km > c.odo ? Object.assign({}, c, { odo: km, odoLog: c.odoLog.concat([{ date: T, km: km }]) }) : c));
  }
  toast(msg, undo, ms) { clearTimeout(this._t); this.setState({ toast: msg, undo: undo || null }); this._t = setTimeout(() => this.setState({ toast: '', undo: null }), ms || (undo ? 5000 : 2800)); }
  snap() { return { items: this.state.items, cars: this.state.cars }; }
  cur() { return this.state.items.find((x) => x.id === this.state.sel); }
  upCur(fn) { const id = this.state.sel; this.setState({ items: this.state.items.map((x) => (x.id === id ? fn(x) : x)) }); }
  diffForm(old, f) {
    const o = this.toForm(old), en = this.en, out = [];
    const defs = this.FD()[f.cat].slice();
    if (f.cat === 'dev') defs.push(['maint', 'الصيانة الدورية', 'Periodic maintenance', 'dur'], ['maintName', 'نوع الصيانة', 'Maintenance type', 'text'], ['maintLast', 'تاريخ آخر صيانة', 'Last maintenance', 'date']);
    if (f.cat === 'custom') defs.push(['date', 'تاريخ التنبيه', 'Alert date', 'date'], ['every', 'يتكرر كل', 'Repeats every', 'dur']);
    const show = (type, k, F) => {
      if (type === 'date') { const d = this.pd(F[k]); return d ? this.fmt(d) : '—'; }
      if (type === 'dur') return this.P(F[k + 'N']) ? this.kul(this.durText(F[k + 'N'], F[k + 'U'] || 'm')) : this.w('بدون', 'None');
      const v = String(F[k] == null ? '' : F[k]).trim(); return v || '—';
    };
    defs.forEach((x) => { const a = show(x[3], x[0], o), b = show(x[3], x[0], f); if (a !== b) out.push({ label: en ? x[2] : x[1], from: a, to: b }); });
    if (f.cat === 'custom' && (o.mode || 'none') !== (f.mode || 'none')) { const M = { repeat: this.w('تكرار دوري', 'Repeating'), date: this.w('تاريخ محدد', 'Fixed date'), none: this.w('بدون تنبيه', 'No alert') }; out.push({ label: this.w('طريقة التنبيه', 'Alert type'), from: M[o.mode || 'none'], to: M[f.mode || 'none'] }); }
    if (f.cat === 'car') { const ek = (F) => (F.odoMode === 'new' ? this.P(F.lastKm) : ((this.car(F.carId) || {}).odo || 0)); const a = ek(o), b = ek(f); if (a !== b) out.push({ label: this.w('العداد عند التغيير', 'Odometer at change'), from: this.num(a) + this.w(' كم', ' km'), to: this.num(b) + this.w(' كم', ' km') }); }
    if ((o.carId || null) !== (f.carId || null)) { const cn = (id) => (id ? this.tx((this.car(id) || {}).name) : this.w('بدون', 'None')); out.push({ label: this.w('السيارة', 'Car'), from: cn(o.carId), to: cn(f.carId) }); }
    if ((o.photo || null) !== (f.photo || null)) out.push({ label: this.photoLabel(f.cat), from: o.photo ? this.w('الصورة السابقة', 'Previous photo') : '—', to: this.w('صورة جديدة', 'New photo') });
    return out;
  }
  photoLabel(cat) { return cat === 'doc' ? this.w('صورة الوثيقة', 'Document photo') : (cat === 'dev' ? this.w('صورة الضمان والفاتورة', 'Warranty & invoice photo') : (cat === 'car' ? this.w('صورة الفاتورة', 'Invoice photo') : this.w('الصورة', 'Photo'))); }
  saveForm(confirmed) {
    const s = this.state, f = s.form;
    if (!f || !String(f.name || '').trim()) { this.setState({ formErr: this.w('اكتب الاسم أولاً', 'Enter a name first') }); return; }
    if (f.cat === 'car' && f.odoMode === 'new' && !this.P(f.lastKm)) { this.setState({ formErr: this.w('اكتب قراءة العداد الجديدة، أو اختر «آخر قراءة مسجلة»', 'Enter the new odometer reading, or choose “Last recorded reading”') }); return; }
    const old = s.editId ? s.items.find((x) => x.id === s.editId) : null;
    if (old && !confirmed) {
      const ch = this.diffForm(old, f);
      if (!ch.length) { this.setState({ screen: 'detail', form: null, editId: null, formErr: '' }); this.toast(this.w('لم تغيّر شيئاً', 'Nothing changed')); return; }
      const probe = this.build(f, old);
      if (typeof probe === 'string') { this.setState({ formErr: probe, showExtra: true }); return; }
      this.setState({ sheet: 'saveConfirm', changes: ch, pendingSave: 'item' }); return;
    }
    const it = this.build(f, old);
    if (typeof it === 'string') { this.setState({ formErr: it, showExtra: true, sheet: null }); return; }
    const items = old ? s.items.map((x) => (x.id === old.id ? it : x)) : [it].concat(s.items);
    const cr = f.cat === 'car' ? this.car(f.carId) : null;
    const lk = f.cat === 'car' && f.odoMode === 'new' ? this.P(f.lastKm) : 0;
    const bump = !!cr && lk > cr.odo;
    const cars = bump ? this.bumpCar(s.cars, cr.id, lk) : s.cars;
    const nmx = this.tx(it.name);
    if (old) {
      this.setState({ items: items, screen: 'detail', from: 'home', sel: it.id, form: null, formErr: '', editId: null, showExtra: false, cars: cars, sheet: null, changes: [], pendingSave: null });
      this.toast(this.w('تم حفظ التعديلات', 'Changes saved') + (bump ? this.w(' · وتحدّث العداد', ' · odometer updated') : ''));
      return;
    }
    const carNm = it.carId ? this.tx((this.car(it.carId) || {}).name) : '';
    let dest, place;
    if (it.cat === 'car') { dest = { tab: 'cars', carSel: it.carId, carSub: 'parts' }; place = this.w('القطع — ', 'Parts — ') + carNm; }
    else if (it.carId) { dest = { tab: 'cars', carSel: it.carId, carSub: 'docs' }; place = this.w('وثائق ', 'Documents of ') + carNm; }
    else { dest = { tab: 'docs', cat: 'all', st: 'all', q: '' }; place = this.w('وثائقي وأجهزتي', 'Docs & devices'); }
    this.setState(Object.assign({ items: items, nextId: s.nextId + 1, screen: 'home', sel: null, form: null, formErr: '', editId: null, showExtra: false, cars: cars, flashId: it.id, sheet: null }, dest));
    clearTimeout(this._fl); this._fl = setTimeout(() => this.setState({ flashId: null }), 2600);
    setTimeout(() => { try { const el = document.querySelector('.lrow.flash'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} }, 140);
    this.toast(this.w('أُضيف «' + nmx + '» إلى ', '“' + nmx + '” added to ') + place + (bump ? this.w(' · وتحدّث العداد', ' · odometer updated') : ''));
  }
  openRenew(remId, itemId) {
    const s = this.state, it = itemId != null ? s.items.find((x) => x.id === itemId) : this.cur(); if (!it) return;
    const r = (it.rems || []).find((x) => x.id === remId); if (!r) return;
    const c = it.carId ? this.car(it.carId) : null;
    let exp = '';
    if (r.type === 'date' && r.renew) { const len = r.start ? Math.max(30, Math.round((r.date.getTime() - r.start.getTime()) / 864e5)) : 365; exp = this.iso(this.dA(len)); }
    this.setState({ sel: it.id, screen: 'detail', zoom: false, sheet: 'renew', rf: { remId: remId, date: this.iso(this.T0()), cost: r.base && it.cost ? String(it.cost) : '', note: '', km: '', odoMode: 'last', exp: exp, photo: null } });
  }
  confirmRenew() {
    const s = this.state, rf = s.rf || {}, it = this.cur(); if (!it) return;
    const r = (it.rems || []).find((x) => x.id === rf.remId); if (!r) return;
    const c = it.carId ? this.car(it.carId) : null;
    const T = this.pd(rf.date) || this.T0(), km = rf.odoMode === 'new' ? this.P(rf.km) : (c ? c.odo : 0);
    if (c && rf.odoMode === 'new' && !km) { this.toast(this.w('اكتب قراءة العداد الجديدة', 'Enter the new odometer reading')); return; }
    const nmI = this.tx(it.name), defNote = it.cat === 'doc' ? this.w('تجديد ', 'Renewed ') + nmI : (it.cat === 'car' ? this.w('تغيير ', 'Changed ') + nmI : (it.cat === 'dev' ? this.tx(r.name) : this.tx(r.name)));
    if (T.getTime() > this.T0().getTime()) { this.toast(this.w('التاريخ في المستقبل — اختر تاريخ اليوم أو قبله', 'That date is in the future — pick today or earlier')); return; }
    const usesKm = !!c && (it.cat === 'car' || !!Number(r.everyKm));
    const h = { id: this.uid(), date: T, cost: this.P(rf.cost), note: String(rf.note || '').trim() || defNote, photo: rf.photo || null };
    if (usesKm) h.km = km;
    const nr = Object.assign({}, r, { muted: false });
    if (r.type === 'cycle') { nr.lastDate = T; if (usesKm) nr.lastKm = km; }
    else if (r.once) nr.done = true;
    else if (r.renew) { nr.start = T; nr.date = this.pd(rf.exp) || this.addM(T, 12); }
    const u = Object.assign({}, it, { rems: it.rems.map((x) => (x.id === r.id ? nr : x)), history: (it.history || []).concat([h]) });
    if (rf.photo) u.photo = rf.photo;
    if (it.cat === 'doc' && r.base) u.issue = T;
    if (r.base && h.cost && (it.cat === 'car' || it.cat === 'custom')) u.cost = h.cost;
    const nf = Object.assign({}, s.notified || {}); delete nf[it.id + ':' + r.id];
    this.setState({ items: s.items.map((x) => (x.id === it.id ? u : x)), sheet: null, notified: nf, cars: usesKm ? this.bumpCar(s.cars, c.id, km) : s.cars });
    this.toast(r.once ? this.w('تم — أُغلق التذكير وحُفظ في السجل', 'Done — reminder closed and saved to history') : this.w('حُفظ في السجل مع الفاتورة، وبدأت دورة جديدة — توقف التنبيه اليومي', 'Saved to history with the invoice — new cycle started, daily alert stopped'));
  }
  setRemP(itemId, remId, patch) { this.setState({ items: this.state.items.map((x) => (x.id === itemId ? Object.assign({}, x, { rems: (x.rems || []).map((r) => (r.id === remId ? Object.assign({}, r, patch) : r)) }) : x)) }); }
  muteRem(itemId, remId, fromSheet) {
    this.setRemP(itemId, remId, { muted: true });
    if (fromSheet) { const left = this.dueList().filter((d) => !(d.it.id === itemId && d.r.id === remId)).length; if (!left) this.setState({ sheet: null }); }
    this.toast(this.w('أُسكت التنبيه — يعود تلقائياً مع الموعد القادم', 'Alert silenced — it returns with the next due date'));
  }
  unmuteRem(itemId, remId) { this.setRemP(itemId, remId, { muted: false }); this.toast(this.w('عاد التنبيه اليومي', 'Daily alert is back on')); }
  delRem(id) {
    const snap = this.snap(), it = this.cur(), r = it && (it.rems || []).find((x) => x.id === id);
    this.upCur((x) => Object.assign({}, x, { rems: x.rems.filter((y) => y.id !== id) }));
    this.toast(this.w('حُذف التذكير', 'Reminder deleted') + (r ? ' «' + this.tx(r.name) + '»' : ''), snap);
  }
  /* تعديلات صفحة العنصر (الصورة والمواصفات) تُعتمد بزر «حفظ» بعد التأكيد */
  curD() { const it = this.cur(), d = this.state.draft; return it && d && d.id === it.id ? Object.assign({}, it, d.patch) : it; }
  setDraft(patch) { const it = this.cur(); if (!it) return; const d = this.state.draft && this.state.draft.id === it.id ? this.state.draft : { id: it.id, patch: {} }; this.setState({ draft: { id: it.id, patch: Object.assign({}, d.patch, patch) } }); }
  draftChanges() {
    const it = this.cur(), d = this.state.draft; if (!it || !d || d.id !== it.id) return [];
    const out = [], p = d.patch;
    if ('photo' in p && p.photo !== it.photo) out.push({ label: this.photoLabel(it.cat), from: it.photo ? this.w('الصورة السابقة (تبقى في السجل)', 'Previous photo (kept in history)') : '—', to: this.w('صورة جديدة', 'New photo') });
    if ('specs' in p) {
      const key = (x) => this.tx(x.k) + ': ' + this.tx(x.v), A = (it.specs || []).map(key), B = (p.specs || []).map(key);
      B.filter((x) => A.indexOf(x) < 0).forEach((x) => out.push({ label: this.w('مواصفة مضافة', 'Spec added'), from: '—', to: x }));
      A.filter((x) => B.indexOf(x) < 0).forEach((x) => out.push({ label: this.w('مواصفة محذوفة', 'Spec removed'), from: x, to: this.w('حذف', 'Removed') }));
    }
    return out;
  }
  detailSave(confirmed) {
    const it = this.cur(); if (!it) return;
    const ch = this.draftChanges();
    if (!ch.length) { this.setState({ screen: 'home', sel: null, draft: null, zoom: false }); return; }
    if (!confirmed) { this.setState({ sheet: 'saveConfirm', changes: ch, pendingSave: 'detail' }); return; }
    const p = this.state.draft.patch, u = Object.assign({}, it, p);
    if ('photo' in p && it.photo && p.photo !== it.photo && !(it.history || []).some((h) => h.photo === it.photo)) u.history = (it.history || []).concat([{ id: this.uid(), date: this.T0(), cost: 0, note: this.N('الصورة السابقة', 'Previous photo'), photo: it.photo }]);
    this.setState({ items: this.state.items.map((x) => (x.id === it.id ? u : x)), draft: null, sheet: null, changes: [], pendingSave: null, screen: 'home', sel: null, zoom: false });
    this.toast(this.w('تم حفظ التغييرات', 'Changes saved'));
  }
  saveSpec() {
    const f = this.state.specF || {};
    if (!String(f.v || '').trim()) { this.toast(this.w('اكتب القيمة', 'Enter a value')); return; }
    const d = this.curD();
    this.setDraft({ specs: (d.specs || []).concat([{ k: String(f.k || '').trim() || this.w('مواصفة', 'Spec'), v: String(f.v).trim() }]) });
    this.setState({ sheet: null, specF: { k: '', v: '' } });
    this.toast(this.w('أُضيفت — اضغط «حفظ» لاعتمادها', 'Added — tap Save to keep it'));
  }
  delSpec(i) { const d = this.curD(); this.setDraft({ specs: (d.specs || []).filter((_, j) => j !== i) }); this.toast(this.w('ستُحذف عند «حفظ» — بعد التأكيد', 'Removed on Save — after you confirm')); }
  copy(v) {
    const fail = () => this.toast(this.w('النسخ يعمل في النسخة النهائية: ', 'Copy works in the final app: ') + v);
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(() => this.toast(this.w('تم النسخ: ', 'Copied: ') + v)).catch(fail); else fail(); } catch (e) { fail(); }
  }
  saveOdo() {
    const s = this.state, c = this.curCar(); if (!c) return;
    const v = Math.round(this.P(s.odoIn));
    if (!v) { this.toast(this.w('اكتب قراءة صحيحة', 'Enter a valid reading')); return; }
    if (v < c.odo) { this.toast(this.w('القراءة أقل من آخر قراءة (' + this.num(c.odo) + ' كم)', 'Reading is below the last one (' + this.num(c.odo) + ' km)')); return; }
    this.setState({ cars: s.cars.map((x) => (x.id === c.id ? Object.assign({}, x, { odo: v, odoLog: x.odoLog.concat([{ date: this.T0(), km: v }]) }) : x)), sheet: null });
    this.toast(this.w('تم تحديث عداد «' + this.tx(c.name) + '»', '“' + this.tx(c.name) + '” odometer updated'));
  }
  saveCar(confirmed) {
    const s = this.state, f = s.carF || {};
    const nm = String(f.name || '').trim();
    if (!nm) { this.setState({ carErr: this.w('اكتب اسم السيارة', 'Enter a car name') }); return; }
    const odo = Math.round(this.P(f.odo));
    const T = this.T0();
    if (s.carEditId && !confirmed) {
      const c0 = this.car(s.carEditId) || {}, ch = [];
      const cmp = (label, a, b) => { a = String(a == null ? '' : a).trim(); b = String(b == null ? '' : b).trim(); if (a !== b) ch.push({ label: label, from: a || '—', to: b || '—' }); };
      cmp(this.w('اسم السيارة', 'Car name'), this.tx(c0.name), nm); cmp(this.w('رقم اللوحة', 'Plate'), this.tx(c0.plate), f.plate);
      if (odo !== c0.odo) ch.push({ label: this.w('العداد', 'Odometer'), from: this.num(c0.odo), to: this.num(odo) });
      if ((c0.photo || null) !== (f.photo || null)) ch.push({ label: this.w('صورة السيارة', 'Car photo'), from: c0.photo ? this.w('الصورة السابقة', 'Previous photo') : '—', to: this.w('صورة جديدة', 'New photo') });
      if (!ch.length) { this.setState({ screen: 'home', tab: 'cars', carF: null, carEditId: null, carErr: '' }); this.toast(this.w('لم تغيّر شيئاً', 'Nothing changed')); return; }
      if (odo < c0.odo) { this.setState({ carErr: this.w('العداد أقل من آخر قراءة (' + this.num(c0.odo) + ' كم)', 'Odometer is below the last reading (' + this.num(c0.odo) + ' km)') }); return; }
      this.setState({ sheet: 'saveConfirm', changes: ch, pendingSave: 'car' }); return;
    }
    if (s.carEditId) {
      const cars = s.cars.map((c) => {
        if (c.id !== s.carEditId) return c;
        const pl = String(f.plate || '').trim();
        const u = Object.assign({}, c, { name: f.nameObj && this.tx(f.nameObj) === nm ? f.nameObj : nm, plate: f.plateObj && this.tx(f.plateObj) === pl ? f.plateObj : pl, photo: f.photo || null });
        if (odo > c.odo) { u.odo = odo; u.odoLog = c.odoLog.concat([{ date: T, km: odo }]); }
        return u;
      });
      this.setState({ cars: cars, screen: 'home', tab: 'cars', carF: null, carEditId: null, carErr: '', sheet: null, changes: [], pendingSave: null });
      this.toast(this.w('تم حفظ بيانات السيارة', 'Car saved'));
      return;
    }
    const id = 'c' + s.nextC;
    const c = { id: id, name: nm, plate: String(f.plate || '').trim(), photo: f.photo || null, odo: odo, odoLog: [{ date: T, km: odo }], fuel: [] };
    this.setState({ cars: s.cars.concat([c]), nextC: s.nextC + 1, carSel: id, carSub: 'docs', screen: 'home', tab: 'cars', carF: null, carErr: '', sheet: null });
    this.toast(this.w('أُضيفت السيارة — أضف قطعها ووثائقها بزر +', 'Car added — add its parts and documents with the + button'));
  }
  KEY() { return [77, 84, 75, 45, 65, 77, 66, 45, 50, 48, 50, 54, 33, 115, 101, 99]; }
  enc(str) { const b = new TextEncoder().encode(str), k = this.KEY(); let bin = ''; for (let i = 0; i < b.length; i++) bin += String.fromCharCode(b[i] ^ k[i % k.length]); return btoa(bin); }
  dec(b64) { const bin = atob(String(b64).trim()), k = this.KEY(); const b = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i) ^ k[i % k.length]; return new TextDecoder().decode(b); }
  isIOS() { const ua = navigator.userAgent || ''; return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1); }
  backupData() {
    const s = this.state;
    const payload = { app: 'asset-manager', v: 2, at: new Date().toISOString(), lang: s.lang, notifTime: s.notifTime, odoEvery: s.odoEvery, nextId: s.nextId, nextR: s.nextR, nextF: s.nextF, nextC: s.nextC, cars: s.cars, items: s.items };
    const b64 = this.enc(JSON.stringify(payload));
    const lines = []; for (let i = 0; i < b64.length; i += 76) lines.push(b64.slice(i, i + 76));
    const data = 'UHDA1:\n' + lines.join('\n') + '\n:END';
    return { data: data, name: 'uhda-backup-' + this.iso(this.T0()) + '.uhda' };
  }
  /* مشاركة ملف: إن رفضها المتصفح لأن الضغطة انتهت (بعد عمل طويل) نعرض زر «جاهز» ليضغطه المستخدم من جديد */
  shareFile(file, okMsg, onDone) {
    if (!this.canShareFile(file)) return false;
    navigator.share({ files: [file], title: file.name }).then(() => { if (onDone) onDone(); if (okMsg) this.toast(okMsg); }).catch((err) => {
      if (err && err.name === 'AbortError') return;
      this._ready = { file: file, okMsg: okMsg, onDone: onDone };
      clearTimeout(this._t); this.setState({ sheet: 'ready', toast: '', undo: null });
    });
    return true;
  }
  shareReady() {
    const r = this._ready; this.setState({ sheet: null }); if (!r) return; this._ready = null;
    navigator.share({ files: [r.file], title: r.file.name }).then(() => { if (r.onDone) r.onDone(); if (r.okMsg) this.toast(r.okMsg); }).catch((err) => {
      if (err && err.name === 'AbortError') return;
      if (this.dlFile(r.file, r.file.name)) this.toast(this.w('تم إنشاء الملف: ', 'File created: ') + r.file.name);
    });
  }
  backupFile(b) { try { return new File([b.data], b.name, { type: 'application/octet-stream' }); } catch (e) { return null; } }
  canShareFile(f) { try { return !!(f && navigator.canShare && navigator.share && navigator.canShare({ files: [f] })); } catch (e) { return false; } }
  exportBackup() {
    const b = this.backupData(), file = this.backupFile(b);
    const ok = () => { this.setState({ lastExport: new Date() }); this.toast(this.w('تم تصدير النسخة: ', 'Backup exported: ') + b.name); };
    if (this.shareFile(file, '', ok)) return;
    if (this.dlFile(b.data, b.name)) ok(); else this.toast(this.w('تعذّر إنشاء الملف', 'Could not create the file'));
  }
  dlFile(data, name, type) {
    try { const url = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type: type || 'application/octet-stream' })); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(url); try { a.remove(); } catch (e) {} }, 8000); return true; } catch (e) { return false; }
  }
  saveBackup() {
    const b = this.backupData(), file = this.backupFile(b);
    const done = () => { this.setState({ lastExport: new Date() }); this.toast(this.w('حُفظت النسخة: ', 'Backup saved: ') + b.name); };
    try {
      if (window.showSaveFilePicker) {
        window.showSaveFilePicker({ suggestedName: b.name, types: [{ description: 'Uhda backup', accept: { 'application/octet-stream': ['.uhda'] } }] })
          .then((h) => h.createWritable().then((wr) => wr.write(b.data).then(() => wr.close())))
          .then(done)
          .catch((err) => { if (!err || err.name !== 'AbortError') { if (this.dlFile(b.data, b.name)) done(); } });
        return;
      }
    } catch (e) {}
    /* الآيفون: لا يوجد منتقي مجلدات في المتصفح — نافذة المشاركة فيها «حفظ في الملفات» */
    if (this.isIOS() && this.shareFile(file, this.w('حُفظت النسخة: ', 'Backup saved: ') + b.name, () => this.setState({ lastExport: new Date() }))) { this.toast(this.w('اختر «حفظ في الملفات» ثم المجلد', 'Choose “Save to Files”, then a folder')); return; }
    if (this.dlFile(b.data, b.name)) { this.setState({ lastExport: new Date() }); this.toast(this.w('حُفظت في التنزيلات: ', 'Saved to Downloads: ') + b.name); }
    else this.toast(this.w('تعذّر حفظ الملف', 'Could not save the file'));
  }
  parseBackup(txt) {
    const revive = (k, v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v) ? new Date(v) : v);
    txt = String(txt || '').replace(/^﻿/, '');
    let obj = null;
    const m = txt.match(/(?:UHDA1|AMB1)\s*:\s*([A-Za-z0-9+/=_\-\s]+)/);
    if (m) {
      let b = m[1].replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
      while (b.length % 4) b += '=';
      try { obj = JSON.parse(this.dec(b), revive); } catch (e) { obj = null; }
      if (!obj) { try { obj = JSON.parse(atob(b), revive); } catch (e) { obj = null; } }
    } else {
      const k = txt.indexOf('{'); if (k >= 0) { try { obj = JSON.parse(txt.slice(k), revive); } catch (e) { obj = null; } }
    }
    if (!obj || !Array.isArray(obj.cars) || !Array.isArray(obj.items)) return null;
    obj.items.forEach((it) => { it.history = it.history || []; it.rems = it.rems || []; it.specs = it.specs || []; });
    obj.cars.forEach((c) => { c.odoLog = c.odoLog && c.odoLog.length ? c.odoLog : [{ date: this.T0(), km: Number(c.odo) || 0 }]; });
    return obj;
  }
  makePdf(mode) {
    const H = window.html2canvas, J = window.jspdf && window.jspdf.jsPDF;
    const wrap = document.querySelector('.rep-wrap');
    if (!H || !J || !wrap) { this.toast(this.w('إنشاء ملف PDF يعمل في التطبيق وصفحة الويب', 'PDF export works in the app and the web page')); return; }
    if (this._pdfBusy) return;
    this._pdfBusy = true;
    this.toast(this.w('جارٍ إنشاء ملف PDF…', 'Creating PDF…'));
    const blockAt = (i) => { const w = document.querySelector('.rep-wrap'); if (!w) return null; return i === 0 ? w.querySelector('.rep-head') : w.querySelectorAll('.rep-sec')[i - 1]; };
    const count = 1 + wrap.querySelectorAll('.rep-sec').length;
    const opt = {
      scale: 2, backgroundColor: '#EFF2F5', logging: false, useCORS: true,
      ignoreElements: (el) => !!(el.classList && el.classList.contains('pdf-skip')),
      onclone: (doc) => {
        const a = doc.querySelector('.app'); if (a) { a.classList.remove('dark'); a.style.height = 'auto'; a.style.overflow = 'visible'; }
        const w = doc.querySelector('.rep-wrap'); if (w) { w.style.position = 'relative'; w.style.overflow = 'visible'; w.style.bottom = 'auto'; }
        doc.querySelectorAll('.toast,.nav,.actionbar').forEach((n) => { n.style.display = 'none'; });
      }
    };
    const shots = [];
    const next = (i) => {
      if (i >= count) return Promise.resolve();
      const el = blockAt(i); if (!el) return Promise.reject(new Error('report-closed'));
      const top = el.getBoundingClientRect().top;
      const cuts = Array.prototype.slice.call(el.querySelectorAll('.rgrid')).map((r) => r.getBoundingClientRect().top - top);
      const w = el.offsetWidth, hh = el.offsetHeight;
      return H(el, opt).then((cv) => { shots.push({ cv: cv, w: w, h: hh, cuts: cuts, head: i === 0 }); return next(i + 1); });
    };
    next(0).then(() => {
      const pdf = new J({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
      const PW = 210, PH = 297, M = 12, GAP = 4, CW = PW - M * 2, BOTTOM = PH - M - 6;
      const paint = () => { pdf.setFillColor(239, 242, 245); pdf.rect(0, 0, PW, PH, 'F'); };
      paint();
      let y = M, pages = 1;
      const newPage = () => { pdf.addPage(); paint(); y = M; pages += 1; };
      shots.forEach((sh) => {
        const f = CW / sh.w, hmm = sh.h * f;
        if (y + hmm <= BOTTOM) { pdf.addImage(sh.cv, 'JPEG', M, y, CW, hmm, undefined, 'FAST'); y += hmm + GAP; return; }
        if (hmm <= BOTTOM - M) { newPage(); pdf.addImage(sh.cv, 'JPEG', M, y, CW, hmm, undefined, 'FAST'); y += hmm + GAP; return; }
        let from = 0;
        const k = sh.cv.height / sh.h;
        while (from < sh.h - 1) {
          if (BOTTOM - y < 30) newPage();
          const room = (BOTTOM - y) / f;
          let to = Math.min(sh.h, from + room);
          if (to < sh.h) { const ok = sh.cuts.filter((c) => c > from + 20 && c <= to); if (ok.length) to = ok[ok.length - 1]; }
          const part = document.createElement('canvas');
          part.width = sh.cv.width; part.height = Math.max(1, Math.round((to - from) * k));
          part.getContext('2d').drawImage(sh.cv, 0, Math.round(from * k), sh.cv.width, part.height, 0, 0, sh.cv.width, part.height);
          pdf.addImage(part, 'JPEG', M, y, CW, (to - from) * f, undefined, 'FAST');
          y += (to - from) * f + GAP; from = to;
          if (from < sh.h - 1) newPage();
        }
      });
      for (let p = 1; p <= pages; p++) { pdf.setPage(p); pdf.setFontSize(9); pdf.setTextColor(120, 128, 138); pdf.text(p + ' / ' + pages, PW / 2, PH - 7, { align: 'center' }); }
      const name = 'uhda-report-' + this.iso(this.T0()) + '.pdf';
      const blob = pdf.output('blob');
      let file = null; try { file = new File([blob], name, { type: 'application/pdf' }); } catch (e) { file = null; }
      this._pdfBusy = false;
      const dl = () => { if (this.dlFile(blob, name, 'application/pdf')) this.toast(this.w('تم إنشاء الملف: ', 'File created: ') + name); else this.toast(this.w('تعذّر حفظ الملف', 'Could not save the file')); };
      if (mode === 'share' || this.isIOS()) {
        if (this.shareFile(file, '')) { if (mode !== 'share') this.toast(this.w('اختر «حفظ في الملفات»', 'Choose “Save to Files”')); return; }
        if (mode === 'share') { dl(); return; }
      }
      try {
        if (window.showSaveFilePicker) {
          window.showSaveFilePicker({ suggestedName: name, types: [{ description: 'PDF', accept: { 'application/pdf': ['.pdf'] } }] })
            .then((h) => h.createWritable().then((wr) => wr.write(blob).then(() => wr.close())))
            .then(() => this.toast(this.w('حُفظ الملف: ', 'Saved: ') + name))
            .catch((err) => { if (!err || err.name !== 'AbortError') dl(); });
          return;
        }
      } catch (e) {}
      dl();
    }).catch((err) => { try { console.error('pdf', err && err.message, err && err.stack); } catch (e) {} this._pdfBusy = false; this.toast(this.w('تعذّر إنشاء ملف PDF', 'Could not create the PDF')); });
  }
  readImage(file) {
    return new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => {
        const src = String(fr.result || '');
        const img = new Image();
        img.onload = () => {
          try {
            const sc = Math.min(1, 1600 / Math.max(img.width, img.height));
            const cv = document.createElement('canvas');
            cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
            cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
            res(cv.toDataURL('image/jpeg', 0.82));
          } catch (e) { res(src); }
        };
        img.onerror = () => res(src);
        img.src = src;
      };
      fr.onerror = () => res('');
      fr.readAsDataURL(file);
    });
  }
  photoFile() {
    const it = this.curD(); const src = typeof this.state.zoom === 'string' ? this.state.zoom : (it && it.photo); if (!it || !src) return null;
    try {
      const p = String(src).split(','), mime = (p[0].match(/data:([^;]+)/) || [])[1] || 'image/jpeg';
      const bin = atob(p[1] || ''), u = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      return new File([u], 'uhda-' + this.tx(it.name).replace(/\s+/g, '-') + '.jpg', { type: mime });
    } catch (e) { return null; }
  }
  sharePhoto() {
    const f = this.photoFile();
    try { if (f && navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f] }).catch(() => {}); return; } } catch (e) {}
    this.toast(this.w('المشاركة لواتساب وتطبيقات التواصل تعمل من الهاتف في النسخة النهائية', 'Sharing to WhatsApp and social apps works on the phone in the final app'));
  }
  savePhoto() {
    const f = this.photoFile(); if (!f) return;
    try {
      if (/iPhone|iPad/.test(navigator.userAgent) && navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f] }).catch(() => {}); this.toast(this.w('اختر «حفظ الصورة» لتنزل في الاستوديو', 'Choose “Save Image” to add it to Photos')); return; }
    } catch (e) {}
    if (this.dlFile(f, f.name)) this.toast(this.w('حُفظت الصورة في الاستوديو / التنزيلات', 'Photo saved to gallery / downloads'));
    else this.toast(this.w('الحفظ في الاستوديو يعمل من الهاتف في النسخة النهائية', 'Saving to Photos works on the phone in the final app'));
  }
  onImportFile(e) {
    const input = e.target, file = input.files && input.files[0];
    if (!file) return;
    const kb = Math.max(1, Math.round((file.size || 0) / 1024));
    const fail = (why) => this.toast(this.w('تعذّر قراءة «' + file.name + '» (' + kb + ' KB): ', 'Could not read “' + file.name + '” (' + kb + ' KB): ') + why, null, 6500);
    const reader = new FileReader();
    reader.onload = () => {
      const txt = String(reader.result || '');
      const obj = this.parseBackup(txt);
      if (obj) { this.setState({ pending: obj, sheet: 'import' }); return; }
      if (/^%PDF/.test(txt)) fail(this.w('هذا ملف PDF وليس نسخة احتياطية — اختر ملف ‎.uhda', 'this is a PDF, not a backup — pick the .uhda file'));
      else if (txt.indexOf('UHDA1') >= 0 || txt.indexOf('AMB1') >= 0) fail(this.w('الملف ناقص أو تالف — صدّر نسخة جديدة', 'the file is incomplete or damaged — export a new one'));
      else fail(this.w('ليس ملف نسخة من عُهدة', 'not an Uhda backup file'));
    };
    reader.onerror = () => fail(this.w('لا يمكن فتح الملف', 'the file cannot be opened'));
    reader.readAsText(file);
    try { input.value = ''; } catch (err) {}
  }
  confirmImport() {
    const s = this.state, p = s.pending; if (!p) return;
    const snap = this.snap();
    const maxId = p.items.reduce((a, x) => Math.max(a, Number(x.id) || 0), 0);
    this.setState({ cars: p.cars, items: p.items, nextId: Math.max(p.nextId || 0, maxId + 1, 100), nextR: p.nextR || s.nextR, nextF: p.nextF || s.nextF, nextC: p.nextC || s.nextC, notifTime: p.notifTime || s.notifTime, odoEvery: p.odoEvery || s.odoEvery, carSel: p.cars[0] ? p.cars[0].id : null, pending: null, sheet: null, screen: 'home', tab: 'cars' });
    this.toast(this.w('تم استرجاع النسخة الاحتياطية', 'Backup restored'), snap);
  }
  report() {
    const s = this.state;
    const specOf = (it) => (it.specs || []).map((x) => this.tx(x.k) + ': ' + this.tx(x.v)).join(' · ');
    const rowOf = (it) => { const v = this.view(it), sp = specOf(it); return { name: v.name, status: v.lvText, lv: v.lv, due: v.due || v.sub, specs: sp, hasSpecs: !!sp, u: v.u }; };
    const byU = (a, b) => a.u - b.u;
    const sections = [];
    s.cars.forEach((c) => {
      const rows = s.items.filter((x) => x.carId === c.id).map(rowOf).sort(byU);
      sections.push({ title: this.tx(c.name), sub: (c.plate ? this.tx(c.plate) + ' · ' : '') + this.w('العداد ', 'Odometer ') + this.num(c.odo) + this.w(' كم', ' km'), hasSub: true, rows: rows });
    });
    const grp = (cat, title) => { const rows = s.items.filter((x) => !x.carId && x.cat === cat).map(rowOf).sort(byU); if (rows.length) sections.push({ title: title, sub: '', hasSub: false, rows: rows }); };
    grp('doc', this.w('الوثائق الشخصية', 'Personal documents'));
    grp('dev', this.w('الأجهزة', 'Devices'));
    grp('custom', this.w('مخصص', 'Custom'));
    return { when: this.w('أُنشئ في ', 'Generated ') + this.fmtT(new Date()), sections: sections };
  }
  DICT() {
    return {
      ar: { readyTitle: 'الملف جاهز', readyBtn: 'حفظ أو مشاركة', byLine: 'إعداد: أحمد الخنبشي', odoAtChange: 'ممشى السيارة (العداد) عند التغيير', recNoPhoto: 'لا توجد صورة مرفقة لهذا السجل', recRO: 'السجل للاطلاع فقط ولا يُعدَّل', histDelWarn: 'سيُحذف السجل وصورة فاتورته نهائياً، ولا يمكن استرجاعه بعد ثوانٍ.', naQ: 'السماح بالتنبيهات؟', naQs: 'لتصلك تنبيهات انتهاء الوثائق ومواعيد الصيانة.', notNow: 'ليس الآن', ok: 'موافق', arrow: '←', schedTitle: 'المواعيد والتنبيه التلقائي', mute: 'إسكات التنبيه', unmute: 'إعادة التنبيه', aDelHist: 'حذف السجل', editItem: 'تعديل البيانات', maintTitle: 'الصيانة الدورية — اختر ما يناسب الجهاز', maintEvery: 'الصيانة كل', maintName: 'نوع الصيانة', maintLast: 'تاريخ آخر صيانة (يبدأ العد منه)', photosW: 'صور', oldInvKept: 'الفواتير والصور السابقة تبقى محفوظة في السجل', histDelTitle: 'حذف هذا السجل؟', cancelMaintMsg: 'سيتوقف التنبيه اليومي لهذه الصيانة. يبقى الجهاز وسجله وصوره كما هي، ويمكنك إعادتها من «تعديل».', cancelMaintBtn: 'إلغاء الصيانة الدورية', keepIt: 'إبقاء', confirmChgTitle: 'تأكيد التغيير', confirmChgSub: 'راجع ما عدّلته قبل الحفظ', confirmSave: 'تأكيد وحفظ', keepEditing: 'متابعة التعديل', discardTitle: 'الخروج بدون حفظ؟', discardMsg: 'عدّلت بيانات ولم تحفظها بعد — إذا خرجت ستضيع التعديلات.', discardBtn: 'خروج بدون حفظ', naEx1: 'جواز السفر — ينتهي اليوم', naEx1s: 'نذكّرك كل يوم حتى تضغط «تم التجديد»', naAllow: 'السماح بالتنبيهات', alertsTitle: 'تنبيهات اليوم', alertsSub: 'تتكرر كل يوم حتى التجديد أو الصيانة أو الإسكات', later: 'لاحقاً', notifSec: 'التنبيهات', enable: 'تفعيل', testNotif: 'إرسال تنبيه تجريبي', ver: 'عُهدة · 1.0', about: 'حول التطبيق', aboutTap: 'اضغط لعرض شاشة البداية', langBtn: 'EN', aLang: 'Switch to English', settings: 'الإعدادات', searchPh: 'ابحث: وثيقة، جهاز، قطعة، مقاس…', aSearch: 'بحث', attnTitle: 'تحتاج انتباهك', allGood: 'كل شيء ساري — لا يوجد ما يحتاج انتباهك الآن', carAllGood: 'هذه السيارة سليمة — لا مواعيد قريبة', updated: 'آخر تحديث', update: 'تحديث العداد', km: 'كم', odoDueMsg: 'حان وقت إدخال قراءة العداد ليُحدَّث المتبقي لكل القطع', noResults: 'لا توجد نتائج مطابقة', archTitle: 'المؤرشف — ضمان منتهي', switchCar: 'تبديل السيارة', chooseCar: 'اختر السيارة', addCarFull: 'إضافة سيارة', noPlate: 'بدون لوحة', editCar: 'تعديل بيانات السيارة', noParts: 'لا توجد قطع بعد', addPart: 'إضافة قطعة أو صيانة', noCarDocs: 'لا توجد وثائق لهذه السيارة بعد', tplQuick: 'قوالب سريعة — بلمسة', addCarDoc: 'وثيقة أخرى لهذه السيارة', kmpl: 'الاستهلاك', kmplU: 'كم/لتر', cpk: 'تكلفة الكيلو', cpkU: 'بيسة/كم', fuelMonth: 'وقود الشهر', omr: 'ر.ع', noFuel: 'لا توجد تعبئات بعد — سجّل أول تعبئة لحساب الاستهلاك', addFuel: 'تعبئة وقود', aDelFuel: 'حذف التعبئة', noCars: 'لم تُضِف أي سيارة بعد', addFirstCar: 'أضف سيارتك الأولى', add: 'إضافة', aNav: 'التنقل الرئيسي', aBack: 'رجوع', aEdit: 'تعديل', aDelete: 'حذف', reminders: 'التذكيرات', noRems: 'لا توجد مواعيد — هذا العنصر لحفظ البيانات فقط.', addRem: 'إضافة تذكير', aDelRem: 'حذف التذكير', specsTitle: 'حافظة المواصفات — اضغط على أي سطر لنسخه', noSpecs: 'احفظ هنا ما يُنسى بسهولة: مقاس، نوع زيت، رقم حساب…', addSpec: 'إضافة مواصفة', aDelSpec: 'حذف المواصفة', aCopy: 'نسخ', photoTitle: 'الفاتورة / صورة الوثيقة', aZoom: 'تكبير الصورة', altPhoto: 'الصورة المرفقة', histTitle: 'السجل والفواتير', opsCount: 'عدد العمليات', totalSpend: 'إجمالي التكلفة', noHist: 'لا توجد عمليات سابقة بعد.', addRemFor: '+ إضافة تذكير لهذا العنصر', change: 'تغيير', quickPick: 'اختيار سريع — يعبّي القيم المعتادة', alertMethod: 'طريقة التنبيه', extraDetails: 'تفاصيل إضافية', alertBefore: 'التنبيه المسبق — اختر واحداً أو أكثر', altPreview: 'معاينة الصورة', takePhoto: 'تصوير أو اختيار صورة', totalDash: 'الإجمالي —', opsWord: 'عملية', noSpendRange: 'لا توجد مصاريف في هذه الفترة', byCat: 'حسب القسم', topCost: 'الأكثر تكلفة', recentOps: 'آخر العمليات', aClose: 'إغلاق', odoNow: 'قراءة العداد الآن (كم)', cost: 'التكلفة (ر.ع)', noteOpt: 'ملاحظة (اختياري)', notePh: 'مثال: اسم مركز الخدمة', saveLog: 'حفظ في السجل', newRem: 'تذكير جديد', tplTitle: 'قوالب مقترحة', remName: 'اسم التذكير', remNamePh: 'مثال: تنظيف الفلتر', type: 'النوع', repeatEvery: 'يتكرر كل', everyKm: 'يتكرر كل (كم)', date: 'التاريخ', remNameErr: 'اكتب اسم التذكير', addRemBtn: 'إضافة التذكير', newSpec: 'مواصفة جديدة', specK: 'الاسم', specKPh: 'مثال: مقاس الإطار', specV: 'القيمة', saveSpec: 'حفظ المواصفة', delMsg: 'سيُحذف العنصر مع مواعيده وسجله وصوره. يمكنك التراجع خلال ثوانٍ.', delCarMsg: 'ستُحذف السيارة مع قطعها ووثائقها وسجلاتها. يمكنك التراجع خلال ثوانٍ.', delBtn: 'حذف', cancel: 'إلغاء', odoSheet: 'قراءة العداد', lastRead: 'آخر قراءة:', aOdoIn: 'قراءة العداد الجديدة', livePrev: 'معاينة مباشرة للمتبقي', saveRead: 'حفظ القراءة', language: 'اللغة', notifTime: 'وقت التنبيه اليومي', odoRemind: 'تذكير بإدخال قراءة العداد', look: 'المظهر', aShare: 'مشاركة', aPrint: 'طباعة', undo: 'تراجع', aLogo: 'شعار عُهدة — اضغط لعرض شاشة البداية', verLong: 'الإصدار 1.0', tagline: 'ضماناتك ووثائقك في عُهدة آمنة', addCarTile: 'أضف سيارة', photoSafe: 'نسخة محفوظة داخل عُهدة — لن تضيع لو حذفتها من الاستوديو', saveGallery: 'حفظ في الاستوديو', sharePhoto: 'مشاركة', saveIn: 'حفظ في…', shareB: 'مشاركة', savePathHint: 'الآيفون: «حفظ في الملفات» وتختار iCloud Drive أو «على الآيفون». الأندرويد: يفتح مدير الملفات وتختار المجلد.', savePdf: 'حفظ PDF في…', sharePdf: 'مشاركة PDF', carPhoto: 'صورة السيارة', carName: 'اسم السيارة', carNamePh: 'مثال: الكامري البيضاء', plate: 'رقم اللوحة', platePh: 'مثال: 12345 أ ب', odoField: 'قراءة العداد الحالية (كم)', newCarHint: 'بعد الحفظ تقدر تضيف الملكية والتأمين والفحص بلمسة من القوالب.', delCar: 'حذف السيارة', saveCar: 'حفظ السيارة', car: 'السيارة', liters: 'اللترات', fuelCost: 'المبلغ (ر.ع)', odoAtFill: 'قراءة العداد عند التعبئة (كم)', tank: 'الخزان', saveFuel: 'حفظ التعبئة', bkTitle: 'النسخ الاحتياطي والاسترجاع', bkSub: 'بدون سيرفر وبدون تسجيل دخول — بياناتك على جهازك', bkRowDesc: 'ملف مشفّر، استرجاع، تقرير PDF', bk1Title: 'النسخ التلقائي للنظام', bk1Desc: 'تُحفظ بيانات التطبيق تلقائياً ضمن نسخة iCloud في الآيفون أو Android Auto Backup، وتعود عند تغيير الهاتف.', on: 'مفعّل', bk1Last: 'آخر حفظ للبيانات على الجهاز', bk2Title: 'ملف نسخة احتياطية مشفّر', bk2Desc: 'يجمع البيانات والصور في ملف واحد مشفّر (.uhda) تحفظه في ملفاتك أو ترسله لنفسك عبر واتساب. للاسترجاع اختر نفس الملف من «الملفات».', cars: 'سيارات', itemsW: 'عناصر', fills: 'تعبئات', exportB: 'تصدير نسخة احتياطية', importB: 'استيراد نسخة', bk3Title: 'تقرير PDF للطوارئ', bk3Desc: 'جدول مقروء بكل البيانات والتواريخ والمواصفات — مرجع لو تعطّل الهاتف.', openReport: 'عرض التقرير وتصديره', bkNote: 'الملف مشفّر تلقائياً بدون كلمة مرور: لا يُقرأ خارج التطبيق، لكن أي جهاز عليه التطبيق يقدر يفتحه — احفظه في مكان آمن.', impTitle: 'استرجاع نسخة احتياطية', impWarn: 'ستُستبدل كل البيانات الحالية بمحتوى الملف.', impConfirm: 'استبدال واسترجاع', repTitle: 'تقرير البيانات', colName: 'العنصر والمواصفات', colStatus: 'الحالة', colDue: 'الموعد القادم', printPdf: 'حفظ كـ PDF / طباعة' },
      en: { readyTitle: 'Your file is ready', readyBtn: 'Save or share', byLine: 'AHMED ALKHANBASHI', odoAtChange: 'Odometer at the change', recNoPhoto: 'No photo attached to this record', recRO: 'Records are view-only and can’t be edited', histDelWarn: 'The record and its invoice photo will be deleted. You can only undo for a few seconds.', naQ: 'Allow notifications?', naQs: 'To get alerts for expiring documents and due maintenance.', notNow: 'Not now', ok: 'OK', arrow: '→', schedTitle: 'Schedule & automatic alerts', mute: 'Silence alert', unmute: 'Turn alert back on', aDelHist: 'Delete record', editItem: 'Edit details', maintTitle: 'Periodic maintenance — pick what fits', maintEvery: 'Maintenance every', maintName: 'Maintenance type', maintLast: 'Last maintenance (count starts here)', photosW: 'Photos', oldInvKept: 'Earlier invoices and photos stay in the history', histDelTitle: 'Delete this record?', cancelMaintMsg: 'The daily alert for this maintenance stops. The device, its history and photos stay, and you can add it back from Edit.', cancelMaintBtn: 'Cancel periodic maintenance', keepIt: 'Keep', confirmChgTitle: 'Confirm changes', confirmChgSub: 'Review what you changed before saving', confirmSave: 'Confirm and save', keepEditing: 'Keep editing', discardTitle: 'Leave without saving?', discardMsg: 'You changed details but haven’t saved — leaving will discard them.', discardBtn: 'Leave without saving', naEx1: 'Passport — expires today', naEx1s: 'We remind you daily until you tap “Renewed”', naAllow: 'Allow notifications', alertsTitle: 'Today’s alerts', alertsSub: 'Repeated daily until you renew, service or silence', later: 'Later', notifSec: 'Notifications', enable: 'Turn on', testNotif: 'Send a test notification', ver: 'Uhda · 1.0', about: 'About', aboutTap: 'Tap to replay the splash screen', langBtn: 'ع', aLang: 'التبديل إلى العربية', settings: 'Settings', searchPh: 'Search: document, device, part, size…', aSearch: 'Search', attnTitle: 'Needs attention', allGood: 'All good — nothing needs your attention now', carAllGood: 'This car is in good shape — nothing due soon', updated: 'Updated', update: 'Update odometer', km: 'km', odoDueMsg: 'Time to enter the odometer reading to refresh all parts', noResults: 'No matching results', archTitle: 'Archived — warranty expired', switchCar: 'Switch car', chooseCar: 'Choose a car', addCarFull: 'Add a car', noPlate: 'No plate', editCar: 'Edit car details', noParts: 'No parts yet', addPart: 'Add part or service', noCarDocs: 'No documents for this car yet', tplQuick: 'Quick templates — one tap', addCarDoc: 'Another document for this car', kmpl: 'Economy', kmplU: 'km/L', cpk: 'Cost per km', cpkU: 'baisa/km', fuelMonth: 'Fuel this month', omr: 'OMR', noFuel: 'No fill-ups yet — log your first to calculate economy', addFuel: 'Fuel fill-up', aDelFuel: 'Delete fill-up', noCars: 'You haven’t added a car yet', addFirstCar: 'Add your first car', add: 'Add', aNav: 'Main navigation', aBack: 'Back', aEdit: 'Edit', aDelete: 'Delete', reminders: 'Reminders', noRems: 'No due dates — this item only stores data.', addRem: 'Add reminder', aDelRem: 'Delete reminder', specsTitle: 'Quick specs — tap a line to copy', noSpecs: 'Keep easy-to-forget details here: sizes, oil type, account numbers…', addSpec: 'Add spec', aDelSpec: 'Delete spec', aCopy: 'Copy', photoTitle: 'Invoice / document photo', aZoom: 'Enlarge photo', altPhoto: 'Attached photo', histTitle: 'History & invoices', opsCount: 'Operations', totalSpend: 'Total cost', noHist: 'No past operations yet.', addRemFor: '+ Add a reminder to this item', change: 'Change', quickPick: 'Quick pick — fills typical values', alertMethod: 'Alert type', extraDetails: 'More details', alertBefore: 'Advance alerts — pick one or more', altPreview: 'Photo preview', takePhoto: 'Take or choose a photo', totalDash: 'Total —', opsWord: 'operations', noSpendRange: 'No expenses in this period', byCat: 'By section', topCost: 'Most expensive', recentOps: 'Recent operations', aClose: 'Close', odoNow: 'Current odometer (km)', cost: 'Cost (OMR)', noteOpt: 'Note (optional)', notePh: 'e.g. service center name', saveLog: 'Save to history', newRem: 'New reminder', tplTitle: 'Suggested templates', remName: 'Reminder name', remNamePh: 'e.g. Clean filter', type: 'Type', repeatEvery: 'Repeats every', everyKm: 'Repeats every (km)', date: 'Date', remNameErr: 'Enter a reminder name', addRemBtn: 'Add reminder', newSpec: 'New spec', specK: 'Name', specKPh: 'e.g. Tire size', specV: 'Value', saveSpec: 'Save spec', delMsg: 'The item, its reminders, history and photos will be deleted. You can undo for a few seconds.', delCarMsg: 'The car, its parts, documents and records will be deleted. You can undo for a few seconds.', delBtn: 'Delete', cancel: 'Cancel', odoSheet: 'Odometer', lastRead: 'Last reading:', aOdoIn: 'New odometer reading', livePrev: 'Live preview of remaining', saveRead: 'Save reading', language: 'Language', notifTime: 'Daily alert time', odoRemind: 'Odometer reading reminder', look: 'Appearance', aShare: 'Share', aPrint: 'Print', undo: 'Undo', aLogo: 'Uhda logo — tap to show the splash screen', verLong: 'Version 1.0', tagline: 'Your warranties and documents, safely kept', addCarTile: 'Add car', photoSafe: 'A copy is kept inside Uhda — safe even if deleted from your gallery', saveGallery: 'Save to Photos', sharePhoto: 'Share', saveIn: 'Save to…', shareB: 'Share', savePathHint: 'iPhone: “Save to Files”, then pick iCloud Drive or On My iPhone. Android: opens the file manager so you pick the folder.', savePdf: 'Save PDF to…', sharePdf: 'Share PDF', carPhoto: 'Car photo', carName: 'Car name', carNamePh: 'e.g. White Camry', plate: 'Plate number', platePh: 'e.g. 12345 AB', odoField: 'Current odometer (km)', newCarHint: 'After saving, add registration, insurance and inspection with one tap from the templates.', delCar: 'Delete car', saveCar: 'Save car', car: 'Car', liters: 'Liters', fuelCost: 'Amount (OMR)', odoAtFill: 'Odometer at fill-up (km)', tank: 'Tank', saveFuel: 'Save fill-up', bkTitle: 'Backup & restore', bkSub: 'No server, no sign-in — your data stays on your phone', bkRowDesc: 'Encrypted file, restore, PDF report', bk1Title: 'System auto backup', bk1Desc: 'App data is saved automatically in your iPhone’s iCloud backup or Android Auto Backup, and returns when you switch phones.', on: 'On', bk1Last: 'Last saved on this phone', bk2Title: 'Encrypted backup file', bk2Desc: 'Packs your data and photos into one encrypted file (.uhda) to save in Files or send to yourself on WhatsApp.', cars: 'Cars', itemsW: 'Items', fills: 'Fill-ups', exportB: 'Export backup', importB: 'Import backup', bk3Title: 'Emergency PDF report', bk3Desc: 'A readable table of all data, dates and specs — a reference if your phone fails.', openReport: 'View and export report', bkNote: 'The file is encrypted automatically without a password: it can’t be read outside the app, but any device with the app can open it — keep it somewhere safe.', impTitle: 'Restore a backup', impWarn: 'All current data will be replaced with the file’s contents.', impConfirm: 'Replace and restore', repTitle: 'Data report', colName: 'Item & specs', colStatus: 'Status', colDue: 'Next due', printPdf: 'Save as PDF / Print' }
    };
  }
  /* ---------- التنبيه التلقائي: يوم الموعد ويتكرر يومياً حتى التجديد / الصيانة / الإسكات ---------- */
  nInfo() {
    let api = false, perm = 'unsupported';
    try { api = typeof Notification !== 'undefined'; perm = api ? Notification.permission : 'unsupported'; } catch (e) {}
    let sa = false; try { sa = !!(navigator.standalone || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)); } catch (e) {}
    const C = window.Capacitor, native = !!(C && C.isNativePlatform && C.isNativePlatform()), LN = native && C.Plugins ? C.Plugins.LocalNotifications : null;
    return { api: api, perm: perm, ios: this.isIOS(), standalone: sa, native: native, LN: LN };
  }
  isDue(t) { return (t.days != null && t.days <= 0) || (t.km != null && t.km <= 0); }
  dueList() {
    const out = [];
    (this.state.items || []).forEach((it) => (it.rems || []).forEach((r) => {
      if (r.done) return;
      const t = this.track(it, r);
      if (!this.isDue(t)) return;
      if (r.warranty) { if (t.days !== 0) return; } else if (r.muted) return;
      out.push({ it: it, r: r, t: t, key: it.id + ':' + r.id });
    }));
    return out.sort((a, b) => a.t.u - b.t.u);
  }
  dueMsg(it, r) {
    const nm = this.tx(it.name), c = it.carId ? this.car(it.carId) : null, cn = c ? ' — ' + this.tx(c.name) : '';
    if (r.warranty) return { title: this.w('انتهى ضمان «' + nm + '»', 'Warranty ended: ' + nm), body: this.w('صورة الضمان والفاتورة محفوظة في عُهدة.', 'The warranty and invoice photo stay in Uhda.') };
    if (it.cat === 'doc') return { title: this.w('تجديد «' + nm + '»', 'Renew: ' + nm) + cn, body: this.w('بعد التجديد اضغط «تم التجديد» — نذكّرك كل يوم حتى ذلك.', 'Tap “Renewed” once done — we’ll remind you daily until then.') };
    if (it.cat === 'car') return { title: this.w('تغيير «' + nm + '»', 'Change: ' + nm) + cn, body: this.w('بعد الصيانة اضغط «تم التغيير» — نذكّرك كل يوم حتى ذلك.', 'Tap “Changed” after the service — we’ll remind you daily until then.') };
    if (it.cat === 'dev') return { title: this.w('صيانة «' + nm + '»: ', 'Service ' + nm + ': ') + this.tx(r.name), body: this.w('بعد الصيانة اضغط «تمت الصيانة» — نذكّرك كل يوم حتى ذلك.', 'Tap “Serviced” when done — we’ll remind you daily until then.') };
    return { title: this.w('موعد «' + nm + '»', 'Due: ' + nm), body: this.w('اضغط «تم» بعد الإنجاز — نذكّرك كل يوم حتى ذلك.', 'Tap “Done” when finished — we’ll remind you daily until then.') };
  }
  getReg() {
    try { if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) return Promise.race([navigator.serviceWorker.getRegistration(), new Promise((r) => setTimeout(() => r(null), 1500))]).catch(() => null); } catch (e) {}
    return Promise.resolve(null);
  }
  openItem(id) { const it = (this.state.items || []).find((x) => String(x.id) === String(id)); if (it) this.setState({ screen: 'detail', from: 'home', sel: it.id, sheet: null, zoom: false }); }
  onOpen() {
    let q = null; try { q = new URLSearchParams(location.search).get('open'); } catch (e) {}
    if (q) { this.openItem(q); try { history.replaceState(null, '', location.pathname); } catch (e) {} }
    this.checkAlerts(!q);
  }
  checkAlerts(onOpen) {
    const s = this.state; if (!s.onboarded) return;
    const n = this.nInfo();
    const canAsk = (n.native && !!n.LN) || (n.api && n.perm === 'default');
    if (onOpen && !s.notifAsked && canAsk && !s.sheet && !s.dlg && s.screen === 'home') { this.setState({ dlg: 'notif', notifAsked: true }); return; }
    const due = this.dueList(), today = this.iso(this.T0());
    if (onOpen && due.length && s.alertDay !== today && !s.sheet && s.screen === 'home') this.setState({ sheet: 'alerts', alertDay: today });
    this.pushSystem(due); this.writeSched();
  }
  pushSystem(due) {
    const n = this.nInfo(); if (n.native || !n.api || n.perm !== 'granted') return;
    const today = this.iso(this.T0()), map = Object.assign({}, this.state.notified || {});
    const fresh = due.filter((d) => map[d.key] !== today); if (!fresh.length) return;
    this.getReg().then((reg) => {
      fresh.forEach((d) => {
        const m = this.dueMsg(d.it, d.r), body = d.t.text + ' · ' + m.body;
        try { if (reg && reg.showNotification) reg.showNotification(m.title, { body: body, tag: 'uhda-' + d.key, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', data: { id: d.it.id }, renotify: true, lang: this.en ? 'en' : 'ar', dir: this.en ? 'ltr' : 'rtl' }); else new Notification(m.title, { body: body, tag: 'uhda-' + d.key, icon: 'icons/icon-192.png' }); map[d.key] = today; } catch (e) {}
      });
      this.setState({ notified: map });
    });
  }
  schedList() {
    const s = this.state, tm = String(s.notifTime || '09:00').split(':'), hh = Number(tm[0]) || 9, mm = Number(tm[1]) || 0, out = [];
    (s.items || []).forEach((it) => (it.rems || []).forEach((r) => {
      if (r.done || r.muted) return;
      const t = this.track(it, r); if (t.inactive) return;
      let d = t.days;
      if (t.km != null) { const kd = Math.round(t.km / this.avg(it.carId ? this.car(it.carId) : null)); d = d == null ? kd : Math.min(d, kd); }
      if (d == null) return;
      const at = this.dA(Math.max(d, 0)); at.setHours(hh, mm, 0, 0);
      const m = this.dueMsg(it, r);
      out.push({ key: it.id + ':' + r.id, id: it.id, at: at.getTime(), once: !!r.warranty, title: m.title, body: m.body });
    }));
    return out.sort((a, b) => a.at - b.at);
  }
  writeSched() {
    let list = []; try { list = this.schedList(); } catch (e) { return; }
    const txt = JSON.stringify({ v: 1, items: list });
    if (txt === this._lastSched) return; this._lastSched = txt;
    try { if (window.UhdaKV) window.UhdaKV.set('sched', txt); } catch (e) {}
    const n = this.nInfo(); if (!n.native || !n.LN) return;
    /* داخل APK / IPA: تنبيهات محلية مجدولة — يوم الموعد ثم يومياً لأسبوع، وتُعاد جدولتها عند كل فتح */
    const now = Date.now(), N = [];
    list.forEach((x, i) => { for (let k = 0; k < (x.once ? 1 : 7) && N.length < 60; k++) { const at = x.at + k * 864e5; if (at > now + 5000) N.push({ id: 1000 + i * 10 + k, title: x.title, body: x.body, schedule: { at: new Date(at), allowWhileIdle: true }, extra: { id: x.id } }); } });
    try { n.LN.getPending().then((p) => (p && p.notifications && p.notifications.length ? n.LN.cancel({ notifications: p.notifications }) : null)).then(() => (N.length ? n.LN.schedule({ notifications: N }) : null)).catch(() => {}); } catch (e) {}
  }
  regPeriodic() {
    this.getReg().then((reg) => {
      try { if (!reg || !reg.periodicSync) return; const go = () => reg.periodicSync.register('uhda-daily', { minInterval: 12 * 3600 * 1000 }).catch(() => {}); if (navigator.permissions && navigator.permissions.query) navigator.permissions.query({ name: 'periodic-background-sync' }).then((st) => { if (st.state === 'granted') go(); }).catch(go); else go(); } catch (e) {}
    });
  }
  askNotif() {
    const n = this.nInfo(); let fired = false;
    const after = (ok) => { if (fired) return; fired = true; this.setState({ notifAsked: true, nTick: Date.now(), dlg: null }); if (!ok) this.toast(this.w('لم تُفعَّل — يمكنك تفعيلها لاحقاً من الإعدادات', 'Not turned on — you can enable it later in Settings')); if (ok) { this.toast(this.w('تم تفعيل التنبيهات', 'Notifications are on')); this._lastSched = ''; this.regPeriodic(); setTimeout(() => this.checkAlerts(true), 500); } };
    if (n.native && n.LN) { n.LN.requestPermissions().then((r) => after(!!r && r.display === 'granted')).catch(() => after(false)); return; }
    if (!n.api) { this.toast(this.w('هذا المتصفح لا يدعم التنبيهات', 'This browser does not support notifications')); return; }
    try { const r = Notification.requestPermission((p) => after(p === 'granted')); if (r && r.then) r.then((p) => after(p === 'granted')).catch(() => after(false)); } catch (e) { after(false); }
  }
  testNotif() {
    const n = this.nInfo(), title = this.w('عُهدة · تنبيه تجريبي', 'Uhda · Test alert'), body = this.w('هكذا يصلك التنبيه يوم الموعد، ويتكرر كل يوم حتى التجديد أو الصيانة.', 'This is how alerts arrive on the due day, repeated daily until you renew or service.');
    if (n.native && n.LN) { n.LN.schedule({ notifications: [{ id: 999001, title: title, body: body, schedule: { at: new Date(Date.now() + 3000) } }] }).then(() => this.toast(this.w('سيصلك التنبيه خلال ثوانٍ', 'The alert arrives in a few seconds'))).catch(() => this.toast(this.w('تعذّر إرسال التنبيه', 'Could not send the alert'))); return; }
    if (n.api && n.perm === 'granted') {
      this.getReg().then((reg) => { try { if (reg && reg.showNotification) reg.showNotification(title, { body: body, tag: 'uhda-test', icon: 'icons/icon-192.png' }); else new Notification(title, { body: body, icon: 'icons/icon-192.png' }); this.toast(this.w('أُرسل تنبيه تجريبي', 'Test alert sent')); } catch (e) { this.toast(this.w('تعذّر إرسال التنبيه', 'Could not send the alert')); } });
      return;
    }
    this.toast(this.w('فعّل التنبيهات أولاً', 'Turn on notifications first'));
  }
  naVals() {
    const n = this.nInfo(), s = this.state, at = this.w(' الساعة ', ' at ') + s.notifTime;
    const needInstall = n.ios && !n.standalone && !n.native;
    let ns = { show: false };
    if (n.native && n.LN) ns = { show: true, title: this.w('تنبيهات الهاتف', 'Phone notifications'), sub: this.w('يوم الموعد', 'On the due day') + at + this.w(' وتتكرر يومياً', ', repeated daily'), color: 'var(--acc)', canEnable: true, canTest: true };
    else if (n.perm === 'granted') ns = { show: true, title: this.w('التنبيهات مفعّلة', 'Notifications are on'), sub: this.w('يوم الموعد', 'On the due day') + at + this.w(' وتتكرر يومياً حتى التجديد', ', repeated daily until renewed'), color: 'var(--g)', canEnable: false, canTest: true };
    else if (n.api && n.perm === 'default') ns = { show: true, title: this.w('التنبيهات غير مفعّلة', 'Notifications are off'), sub: this.w('اضغط «تفعيل» ثم «سماح»', 'Tap “Turn on”, then “Allow”'), color: 'var(--o)', canEnable: true, canTest: false };
    else if (n.perm === 'denied') ns = { show: true, title: this.w('التنبيهات موقوفة', 'Notifications are blocked'), sub: this.w('فعّلها من إعدادات الهاتف ← الإشعارات ← عُهدة', 'Turn them on in phone Settings › Notifications › Uhda'), color: 'var(--r)', canEnable: false, canTest: false };
    else if (needInstall) ns = { show: true, title: this.w('للآيفون فقط: ثبّت التطبيق', 'iPhone only: install the app'), sub: this.w('على الآيفون (iOS 16.4 أو أحدث) تصل التنبيهات بعد إضافة عُهدة إلى الشاشة الرئيسية من Safari ← مشاركة. الأندرويد لا يحتاج هذه الخطوة.', 'On iPhone (iOS 16.4 or later) alerts work after adding Uhda to the Home Screen from Safari › Share. Android doesn’t need this step.'), color: 'var(--o)', canEnable: false, canTest: false };
    return { ns: ns };
  }
  renderVals() {
    const s = this.state, en = this.en;
    const TAB = s.tab === 'spend' ? 'cars' : s.tab, SUB = s.carSub === 'fuel' ? 'parts' : s.carSub;
    if (TAB !== s.tab || SUB !== s.carSub) setTimeout(() => this.setState({ tab: TAB, carSub: SUB }), 0);
    const all = s.items.map((it) => this.view(it));
    const raw = this.cur();
    const rawD = this.curD();
    const car = this.curCar();
    const both = (v) => (v && typeof v === 'object' && !(v instanceof Date) ? (v.ar || '') + ' ' + (v.en || '') : String(v || ''));
    const q = String(s.q || '').trim().toLowerCase();
    const match = (v) => { if (!q) return true; const r0 = s.items.find((x) => x.id === v.id) || {}; return [both(r0.name), both(r0.number), both(r0.model), v.catLine].concat((r0.specs || []).map((x) => both(x.k) + ' ' + both(x.v))).concat((r0.rems || []).map((x) => both(x.name))).join(' ').toLowerCase().indexOf(q) >= 0; };
    const byU = (a, b) => a.u - b.u;
    const swipeHint = (n) => (n > 1 ? this.w('الدائرة = المتبقي · اسحب', 'Ring = remaining · swipe') : this.w('الدائرة = المتبقي', 'Ring = remaining'));
    const markSolo = (arr) => arr.map((x) => Object.assign({}, x, { solo: arr.length === 1 ? 'solo' : '' }));

    const carItems = car ? all.filter((v) => v.carId === car.id) : [];
    const carParts = carItems.filter((v) => v.cat === 'car').sort(byU);
    const carDocs = carItems.filter((v) => v.cat === 'doc').sort(byU);
    const carAttn = markSolo(carItems.filter((v) => !v.arch && (v.lv === 'r' || v.lv === 'o')).sort(byU));
    let carV = { name: '', plate: '', digits: [], hasPhoto: false, photo: '', hasPlate: false, noPlate: true };
    if (car) {
      const lastLog = car.odoLog[car.odoLog.length - 1];
      const od = lastLog ? -this.dd(lastLog.date) : 0;
      const known = this.avgKnown(car);
      carV = { name: this.tx(car.name), plate: this.tx(car.plate), hasPlate: !!car.plate, noPlate: !car.plate, hasPhoto: !!car.photo, photo: car.photo || '', odoText: this.num(car.odo), digits: String(car.odo).padStart(6, '0').split('').map((c) => ({ c: c })), avgLine: known ? Math.round(this.avg(car)) + this.w(' كم يومياً', ' km/day') : this.w('المعدّل يُحسب بعد قراءتين', 'average needs 2 readings'), odoAgo: od <= 0 ? this.w('اليوم', 'today') : this.w('قبل ' + this.dtext(od), this.dtext(od) + ' ago'), odoDue: od >= s.odoEvery && car.odoLog.length > 1 };
    }
    const carIdx = car ? s.cars.findIndex((c) => c.id === car.id) + 1 : 0;
    const carCountText = s.cars.length > 1 ? this.w('السيارة ' + carIdx + ' من ' + s.cars.length, 'Car ' + carIdx + ' of ' + s.cars.length) : '';
    const carList = s.cars.map((c) => {
      const its = all.filter((v) => v.carId === c.id && !v.arch);
      const r = its.filter((v) => v.lv === 'r').length, o = its.filter((v) => v.lv === 'o').length;
      const isOn = !!car && c.id === car.id;
      return { name: this.tx(c.name), meta: (c.plate ? this.tx(c.plate) + ' · ' : '') + this.num(c.odo) + this.w(' كم', ' km'), photo: c.photo || '', hasPhoto: !!c.photo, noPhoto: !c.photo, hasAttn: r + o > 0, lv: r ? 'r' : 'o', attnText: (r + o) + this.w(' تنبيه', ' alerts'), isOn: isOn, on: isOn ? 'on' : '', pick: () => this.setState({ carSel: c.id, sheet: null }) };
    });
    const carSubs = [['parts', this.w('القطع والصيانة', 'Parts & service'), carParts.length], ['docs', this.w('الوثائق', 'Docs'), carDocs.length]].map((x) => ({ label: x[1] + ' (' + x[2] + ')', on: SUB === x[0] ? 'on' : '', pick: () => this.setState({ carSub: x[0] }) }));
    const carDocTpls = car ? this.CTPL().filter((t) => !carDocs.some((d) => d.name === this.tx(t))).map((t) => ({ label: this.tx(t), pick: () => this.setState({ screen: 'add', editId: null, formErr: '', showExtra: false, form: Object.assign(this.defaults('doc', car.id), { name: this.tx(t), nameObj: t }) }) })) : [];

    const docsAll = all.filter((v) => v.cat !== 'car');
    const live = docsAll.filter((v) => !v.arch), archAll = docsAll.filter((v) => v.arch);
    const cnt = { r: 0, o: 0, g: 0, n: 0 }; live.forEach((v) => { cnt[v.lv]++; });
    const tiles = [['r', 'متأخر', 'Overdue'], ['o', 'قريب', 'Due soon'], ['g', 'ساري', 'Valid']].map((x) => ({ key: x[0], label: en ? x[2] : x[1], count: cnt[x[0]], on: s.st === x[0] ? 'on' : '', pick: () => this.setState({ st: this.state.st === x[0] ? 'all' : x[0] }) }));
    const CH = [['all', 'الكل', 'All'], ['doc', 'الوثائق', 'Documents'], ['dev', 'الأجهزة', 'Devices']].concat(s.items.some((x) => x.cat === 'custom') ? [['custom', 'أخرى', 'Other']] : []);
    const docChips = CH.map((x) => ({ label: en ? x[2] : x[1], icon: this.ICON(x[0]), count: x[0] === 'all' ? live.length : live.filter((v) => v.cat === x[0]).length, on: s.cat === x[0] ? 'on' : '', pick: () => this.setState({ cat: x[0] }) }));
    const docList = live.filter((v) => (s.cat === 'all' || v.cat === s.cat) && (s.st === 'all' || v.lv === s.st) && match(v)).sort(byU);
    const archList = archAll.filter((v) => (s.cat === 'all' || v.cat === s.cat) && match(v));
    const docAttn = markSolo(live.filter((v) => v.lv === 'r' || v.lv === 'o').sort(byU));

    let cur = { name: '', ts: [], fields: [], hist: [], specList: [], photo: '', icon: '', lv: 'n', ringDash: '0 301.6' };
    if (raw) {
      const v = this.view(raw); const F = [];
      const add = (l, val) => { if (val !== undefined && val !== null && val !== '') F.push({ label: l, value: String(val) }); };
      if (raw.cat === 'doc') { add(this.w('رقم الوثيقة', 'Document number'), this.tx(raw.number)); add(this.w('تاريخ الإصدار', 'Issue date'), this.fmt(raw.issue)); }
      if (raw.cat === 'car') { const b1 = (raw.rems || []).find((r) => r.id === 'b1'); if (b1) { add(this.w('آخر تركيب / تغيير', 'Last installed / changed'), this.fmt(b1.lastDate)); add(this.w('العداد عند التغيير', 'Odometer at change'), this.num(b1.lastKm) + this.w(' كم', ' km')); } add(this.w('آخر تكلفة', 'Last cost'), raw.cost ? this.money(raw.cost) : ''); }
      if (raw.carId) add(this.w('السيارة', 'Car'), v.carName);
      if (raw.cat === 'dev') { add(this.w('الموديل / الرقم التسلسلي', 'Model / serial no.'), this.tx(raw.model)); add(this.w('تاريخ الشراء', 'Purchase date'), this.fmt(raw.purchase)); add(this.w('مدة الضمان', 'Warranty period'), raw.warrantyN ? this.durText(raw.warrantyN, raw.warrantyU) : ''); }
      if (raw.cat === 'custom') add(this.w('طريقة التنبيه', 'Alert type'), ({ date: this.w('تاريخ محدد', 'Fixed date'), repeat: this.w('تكرار دوري', 'Repeating'), none: this.w('بدون تنبيه — حفظ بيانات', 'No alert — data only') })[raw.mode]);
      const hist = (raw.history || []).map((h, i) => ({ h: h, i: i })).sort((a, b) => b.h.date.getTime() - a.h.date.getTime()).map((o) => { const h = o.h; return { date: this.fmt(h.date), note: this.tx(h.note) || '—', cost: h.cost ? this.money(h.cost) : this.w('بدون تكلفة', 'No cost'), km: h.km ? this.num(h.km) + this.w(' كم', ' km') : '', hasKm: !!h.km, photo: h.photo || '', hasPhoto: !!h.photo, noPhoto: !h.photo, view: () => this.setState({ sheet: 'rec', hd: o.i }) }; });
      const total = raw.history.reduce((a, h) => a + (Number(h.cost) || 0), 0);
      const specList = (rawD.specs || []).map((x, i) => ({ k: this.tx(x.k), v: this.tx(x.v), copy: () => this.copy(this.tx(x.v)), del: () => this.delSpec(i) }));
      const ts = v.ts.map((t) => {
        const r = (raw.rems || []).find((x) => x.id === t.id) || {}, due = this.isDue(t), muted = !!r.muted && !r.warranty;
        const soon = !due && !muted && t.lv === 'o' && t.canDone;
        const showAlert = !t.inactive && !r.warranty && (due || muted || soon);
        const what = raw.cat === 'doc' ? this.w('التجديد', 'renewal') : (raw.cat === 'custom' ? this.w('الإنجاز', 'it’s done') : this.w('الصيانة', 'the service'));
        const hasDue = t.days != null || t.km != null;
        return Object.assign({}, t, {
          done: () => this.openRenew(t.id), del: () => this.delRem(t.id),
          showAlert: showAlert, abCls: muted ? 'muted' : (soon ? 'soon' : ''), canMute: due && !muted, canUnmute: muted,
          alertText: soon ? this.w('اقترب الموعد — إذا أنجزته مبكراً سجّله الآن', 'Due soon — if you already did it, log it now') : muted ? this.w('التنبيه مُسكت — يعود تلقائياً مع الموعد القادم', 'Alert silenced — returns with the next due date') : this.w('تنبيه يومي مفعّل — نذكّرك كل يوم حتى ' + what, 'Daily alert on — we remind you every day until ' + what),
          showInfo: !showAlert && !t.inactive && hasDue,
          infoText: r.warranty ? this.w('تنبيه واحد يوم انتهاء الضمان', 'One alert on the day the warranty ends') : this.w('التنبيه اليومي يبدأ يوم الموعد الساعة ', 'Daily alert starts on the due day at ') + s.notifTime,
          canCancel: raw.cat === 'dev' && r.id === 'b2', cancelLabel: this.w('إلغاء الصيانة الدورية', 'Cancel periodic maintenance'),
          cancel: () => this.setState({ sheet: 'cancelMaint', cm: r.id })
        });
      });
      cur = Object.assign({}, v, {
        ts: ts, remCount: ts.length, noTracks: ts.length === 0, fields: F, hasFields: F.length > 0,
        specList: specList, noSpecs: specList.length === 0,
        hist: hist, noHist: hist.length === 0, histCount: hist.length, histTotal: this.money(total),
        photoTitle: this.photoLabel(raw.cat), hasPhoto: !!rawD.photo, photo: rawD.photo || '', photoBtn: rawD.photo ? this.w('استبدال الصورة', 'Replace photo') : this.w('تصوير أو إرفاق صورة', 'Take or attach a photo'),
        dirty: this.draftChanges().length > 0, saveLabel: this.draftChanges().length ? this.w('حفظ التغييرات', 'Save changes') : this.w('حفظ', 'Save'),
        hasMain: !!v.mainRem, noMain: !v.mainRem, mainLabel: v.mainRem ? v.mainDoneLabel + ': ' + v.mainRemName : '',
        doMain: () => { if (v.mainRem) this.openRenew(v.mainRem); }
      });
    }

    const setF = (k) => (e) => this.setState({ form: Object.assign({}, this.state.form, { [k]: e.target.value }), formErr: '' });
    const setRf = (k) => (e) => this.setState({ rf: Object.assign({}, this.state.rf, { [k]: e.target.value }) });
    const setSpec = (k) => (e) => this.setState({ specF: Object.assign({}, this.state.specF, { [k]: e.target.value }) });
    const setCar = (k) => (e) => this.setState({ carF: Object.assign({}, this.state.carF, { [k]: e.target.value }), carErr: '' });
    const f = s.form, editing = !!s.editId;
    const unitsFor = (val, setter) => this.UNITS().map((u) => ({ label: en ? u[2] : u[1], on: val === u[0] ? 'on' : '', pick: () => setter(u[0]) }));
    const beforeFor = (arr, setter) => this.BOPTS().map((b) => { const on = (arr || []).indexOf(b[0]) >= 0; return { label: en ? b[2] : b[1], on: on ? 'on' : '', pick: () => setter(on ? arr.filter((x) => x !== b[0]) : (arr || []).concat([b[0]])) }; });
    let mainFields = [], extraFields = [], presets = [], modes = [], formBefore = [], formCarOpts = [];
    if (f) {
      const defs = this.FD()[f.cat].slice();
      if (f.cat === 'custom') {
        if (f.mode === 'date') defs.push(['date', 'تاريخ التنبيه', 'Alert date', 'date', '', '', 0]);
        if (f.mode === 'repeat') { defs.push(['every', 'يتكرر كل', 'Repeats every', 'dur', '1', '1', 0]); defs.push(['lastDate', 'بداية العد', 'Count starts on', 'date', '', '', 1]); }
      }
      if (!editing && f.cat !== 'doc') { defs.push(['specK', 'مواصفة سريعة — الاسم', 'Quick spec — name', 'text', 'مثال: المقاس', 'e.g. Size', 1]); defs.push(['specV', 'مواصفة سريعة — القيمة', 'Quick spec — value', 'text', 'مثال: 235/45R18', 'e.g. 235/45R18', 1]); }
      const fl = defs.map((x) => {
        const key = x[0], type = x[3], isDur = type === 'dur';
        const vk = isDur ? key + 'N' : key;
        const o = { key: key, label: en ? x[2] : x[1], ph: en ? x[5] : x[4], x: x[6], isDur: isDur, isDate: type === 'date', isText: type !== 'date' && !isDur, im: type === 'num' ? 'numeric' : (type === 'dec' ? 'decimal' : 'text'), value: f[vk] == null ? '' : String(f[vk]), onChange: setF(vk) };
        if (isDur) o.units = unitsFor(f[key + 'U'] || 'm', (u) => this.setState({ form: Object.assign({}, this.state.form, { [key + 'U']: u }) }));
        return o;
      });
      mainFields = fl.filter((x) => !x.x); extraFields = fl.filter((x) => x.x && (editing || f.cat !== 'doc'));
      if (!editing) presets = this.PRE(f.cat, f.carId).map((x) => ({ icon: this.itemIcon({ cat: f.cat, name: x[0] }), label: this.tx(x[0]), on: f.name === this.tx(x[0]) ? 'on' : '', pick: () => this.setState({ form: Object.assign({}, this.state.form, { name: this.tx(x[0]), nameObj: x[0] }, x[1]), formErr: '' }) }));
      modes = [['repeat', 'تكرار دوري', 'Repeating'], ['date', 'تاريخ محدد', 'Fixed date'], ['none', 'بدون تنبيه', 'No alert']].map((x) => ({ label: en ? x[2] : x[1], on: f.mode === x[0] ? 'on' : '', pick: () => this.setState({ form: Object.assign({}, this.state.form, { mode: x[0] }) }) }));
      if (f.cat === 'car' || f.cat === 'doc') {
        const opts = (f.cat === 'doc' ? [[null, this.w('بدون', 'None')]] : []).concat(s.cars.map((c) => [c.id, this.tx(c.name)]));
        formCarOpts = opts.map((o) => ({ label: o[1], on: (f.carId || null) === o[0] ? 'on' : '', pick: () => { const patch = { carId: o[0] }; const cr = o[0] ? this.car(o[0]) : null; if (f.cat === 'car' && cr && !this.state.editId) patch.lastKm = String(cr.odo); this.setState({ form: Object.assign({}, this.state.form, patch) }); } }));
      }
    }
    const formHasPhoto = !!f && (f.cat === 'doc' || f.cat === 'dev' || f.cat === 'car');
    const setForm = (patch) => this.setState({ form: Object.assign({}, this.state.form, patch), formErr: '' });
    let maint = { isDevForm: false, maintOpts: [], maintOn: false, maintCustom: false, maintUnits: [] };
    if (f && f.cat === 'dev') {
      const MO = [['none', 'بدون', 'None', 0, 'm'], ['1m', 'كل شهر', 'Monthly', 1, 'm'], ['3m', 'كل 3 أشهر', 'Every 3 months', 3, 'm'], ['6m', 'كل 6 أشهر', 'Every 6 months', 6, 'm'], ['1y', 'كل سنة', 'Yearly', 1, 'y'], ['custom', 'مدة أخرى', 'Other', 0, 'm']];
      const mN = this.P(f.maintN);
      const pick = f.maintCustom ? 'custom' : (!mN ? 'none' : ((MO.find((o) => o[3] === mN && o[4] === (f.maintU || 'm')) || ['custom'])[0]));
      const today = this.iso(this.T0());
      maint = {
        isDevForm: true, maintOn: pick !== 'none', maintCustom: pick === 'custom',
        maintOpts: MO.map((o) => ({ label: en ? o[2] : o[1], on: pick === o[0] ? 'on' : '', pick: () => setForm(o[0] === 'none' ? { maintN: '', maintCustom: false } : (o[0] === 'custom' ? { maintCustom: true, maintN: f.maintN || '2', maintU: f.maintU || 'm', maintLast: f.maintLast || today } : { maintN: String(o[3]), maintU: o[4], maintCustom: false, maintLast: f.maintLast || today })) })),
        maintNVal: f.maintN || '', setMaintN: (e) => setForm({ maintN: String(e.target.value).replace(/[^0-9]/g, '') }),
        maintUnits: unitsFor(f.maintU || 'm', (u) => setForm({ maintU: u })),
        maintNameVal: f.maintName || '', maintNamePh: f.maintObj ? this.tx(f.maintObj) : this.w('مثال: تنظيف الفلتر', 'e.g. Clean filter'), setMaintName: (e) => setForm({ maintName: e.target.value }),
        maintLastVal: f.maintLast || today, setMaintLast: (e) => setForm({ maintLast: e.target.value }),
        maintNote: this.w('يصلك تنبيه يوم الصيانة الساعة ' + s.notifTime + ' ويتكرر كل يوم حتى تضغط «تمت الصيانة» وتسجّل تاريخها، أو تُسكت التنبيه.', 'You get an alert on the service day at ' + s.notifTime + ', repeated daily until you tap “Serviced” and log the date, or silence it.')
      };
    }
    let partOdo = { isPartForm: false, odoModes: [], odoNewMode: false };
    if (f && f.cat === 'car') {
      const pc = this.car(f.carId), last = pc ? pc.odo : 0, mode = f.odoMode === 'new' ? 'new' : 'last';
      partOdo = {
        isPartForm: true, odoNewMode: mode === 'new', odoNewVal: f.lastKm || '', setOdoNew: (e) => setForm({ lastKm: String(e.target.value).replace(/[^0-9]/g, '') }),
        odoModes: [['last', this.w('آخر قراءة مسجلة · ', 'Last recorded · ') + this.num(last), { odoMode: 'last' }], ['new', this.w('تسجيل قراءة جديدة', 'Enter a new reading'), { odoMode: 'new', lastKm: f.lastKm || '' }]].map((x) => ({ label: x[1], on: mode === x[0] ? 'on' : '', pick: () => setForm(x[2]) })),
        odoHint: mode === 'new' ? (this.P(f.lastKm) > last ? this.w('القراءة أعلى من المسجلة — سيتحدّث عداد السيارة تلقائياً', 'Higher than recorded — the car odometer will update too') : this.w('اكتب قراءة العداد يوم التغيير', 'Enter the odometer on the day of the change')) : this.w('يُحسب المتبقي من آخر قراءة: ', 'Remaining is counted from the last reading: ') + this.num(last) + this.w(' كم', ' km')
      };
    }
    const FCAT = { car: [this.w('قطعة أو صيانة سيارة', 'Car part or service'), this.ICON('car')], doc: [this.w('وثيقة', 'Document'), this.ICON('doc')], dev: [this.w('جهاز', 'Device'), this.ICON('dev')], custom: [this.w('مخصص', 'Custom'), this.ICON('custom')] };
    const newCarState = { screen: 'carForm', carF: { name: '', plate: '', odo: '', photo: null }, carEditId: null, carErr: '', sheet: null };
    const needCar = (fn) => () => { if (!s.cars.length) { this.toast(this.w('أضف سيارة أولاً', 'Add a car first')); this.setState(newCarState); return; } fn(); };
    const carSelId = car ? car.id : null;
    const addGroups = [
      { title: this.w('السيارات', 'Cars'), items: [
        { label: this.w('قطعة أو صيانة', 'Part or service'), desc: this.w('زيت، بطارية، إطارات — بالزمن أو المسافة', 'Oil, battery, tires — by time or distance'), icon: this.ICON('car'), pick: needCar(() => this.setState({ form: this.defaults('car', carSelId), formErr: '', showExtra: false })) },
        { label: this.w('وثيقة سيارة', 'Car document'), desc: this.w('ملكية، تأمين، فحص — تظهر في القسمين', 'Registration, insurance, inspection — shown in both sections'), icon: this.ICON('doc'), pick: needCar(() => this.setState({ form: this.defaults('doc', carSelId), formErr: '', showExtra: false })) },
        { label: this.w('سيارة جديدة', 'New car'), desc: this.w('الاسم واللوحة والعداد والصورة', 'Name, plate, odometer and photo'), icon: this.ICON('carplus'), pick: () => this.setState(newCarState) }
      ] },
      { title: this.w('الوثائق والأجهزة', 'Documents & devices'), items: [
        { label: this.w('وثيقة شخصية', 'Personal document'), desc: this.w('بطاقة، رخصة، جواز — تنبيه يوم الانتهاء', 'ID, licence, passport — alert on expiry day'), icon: this.ICON('doc'), pick: () => this.setState({ form: this.defaults('doc', null), formErr: '', showExtra: false }) },
        { label: this.w('جهاز', 'Device'), desc: this.w('الضمان وصورته + صيانة دورية بتنبيه يومي', 'Warranty & its photo + periodic maintenance'), icon: this.ICON('dev'), pick: () => this.setState({ form: this.defaults('dev'), formErr: '', showExtra: false }) }
      ] }
    ];
    if (TAB === 'docs') addGroups.reverse();
    const lastCarOdo = car ? car.odo : 0;
    const ov = this.P(s.odoIn) || lastCarOdo;
    const odoPreview = [];
    if (car) s.items.forEach((x) => { if (x.carId !== car.id) return; (x.rems || []).forEach((r) => { if (r.done || !Number(r.everyKm)) return; const left = Number(r.lastKm) + Number(r.everyKm) - ov; const lv = left < 0 ? 'r' : (left < 500 ? 'o' : 'g'); odoPreview.push({ name: this.tx(x.name) + (r.base ? '' : ' · ' + this.tx(r.name)), text: left < 0 ? this.w('تجاوز بـ ' + this.num(-left) + ' كم', 'Over by ' + this.num(-left) + ' km') : this.w('متبقي ' + this.num(left) + ' كم', this.num(left) + ' km left'), lv: lv, lvText: ({ r: this.w('متأخر', 'Overdue'), o: this.w('قريب', 'Due soon'), g: this.w('ساري', 'Valid') })[lv] }); }); });
    const rf = s.rf || {};
    const rr = raw && rf.remId ? (raw.rems || []).find((x) => x.id === rf.remId) : null;
    const rfUsesKm = !!raw && !!raw.carId && !!rr && (raw.cat === 'car' || !!Number(rr.everyKm));
    const rfExp = !!rr && rr.type === 'date' && !!rr.renew;
    const rrName = rr ? this.tx(rr.name) : '';
    const carF = s.carF || { name: '', plate: '', odo: '', photo: null };
    const nmCur = raw ? this.tx(raw.name) : '';
    const tabT = { cars: this.w('سياراتي', 'My cars'), docs: this.w('وثائقي وأجهزتي', 'Docs & devices') };
    let nPhotos = 0; s.cars.forEach((c) => { if (c.photo) nPhotos++; }); s.items.forEach((x) => { if (x.photo) nPhotos++; (x.history || []).forEach((h) => { if (h.photo && h.photo !== x.photo) nPhotos++; }); });
    const zoomSrc = typeof s.zoom === 'string' ? s.zoom : (rawD && rawD.photo ? rawD.photo : '');
    const NV = this.naVals();
    const due = s.sheet === 'alerts' ? this.dueList() : [];
    const alertsList = due.map((d) => { const v = this.view(d.it); return { cat: v.catLine, name: v.name + (d.r.base ? '' : ' · ' + this.tx(d.r.name)) + (d.it.cat === 'dev' && d.r.id === 'b2' ? ' · ' + this.tx(d.r.name) : ''), text: d.t.text, lv: d.t.lv, cls: '', canDone: d.t.canDone, doneLabel: d.t.doneLabel, canMute: !d.r.warranty, done: () => this.openRenew(d.r.id, d.it.id), mute: () => this.muteRem(d.it.id, d.r.id, true), open: () => this.openItem(d.it.id) }; });
    const editOld = s.editId ? s.items.find((x) => x.id === s.editId) : null;
    const hd = raw && s.hd != null ? (raw.history || [])[s.hd] : null;
    const cmR = raw && s.cm ? (raw.rems || []).find((x) => x.id === s.cm) : null;
    const pend = s.pending;
    return {
      L: this.DICT()[en ? 'en' : 'ar'], dir: en ? 'ltr' : 'rtl', langCode: en ? 'en' : 'ar',
      backPath: en ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6', fwdPath: en ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6',
      ringTransform: 'rotate(-90 60 60)',
      toggleLang: () => this.setLang(this.state.lang === 'en' ? 'ar' : 'en'),
      langOpts: [['ar', 'العربية'], ['en', 'English']].map((x) => ({ label: x[1], on: (s.lang || 'ar') === x[0] ? 'on' : '', pick: () => this.setLang(x[0]) })),
      splashOn: !!s.splash, splashCls: s.splash === 'out' ? 'out' : '', lg: s.dark ? { sq: '#14112B', card: '#7C6CF2', ln: '#FFFFFF', lnOp: '0.38', chk: '#14112B', art: '#A99CFF' } : { sq: '#3B2A8C', card: '#FFFFFF', ln: '#3B2A8C', lnOp: '0.22', chk: '#16124A', art: '#3B2A8C' }, showSplash: () => this.playSplash(), themeClass: s.dark ? 'dark' : '', isDark: !!s.dark, isLight: !s.dark,
      isHome: s.screen === 'home' && !s.flip, isDetail: s.screen === 'detail' && !!raw, isAdd: s.screen === 'add', isCarForm: s.screen === 'carForm', isBackup: s.screen === 'backup', isReport: s.screen === 'report',
      isCars: TAB === 'cars', isDocs: TAB === 'docs', homeTitle: tabT[TAB],
      toggleTheme: () => this.setState({ dark: !this.state.dark }), themeAria: s.dark ? this.w('الوضع النهاري', 'Light mode') : this.w('الوضع الليلي', 'Dark mode'),
      fabAria: TAB === 'cars' ? (SUB === 'docs' ? this.w('إضافة وثيقة للسيارة', 'Add a car document') : this.w('إضافة قطعة أو صيانة', 'Add part or service')) : this.w('إضافة وثيقة أو جهاز', 'Add a document or device'),
      fabTap: () => { if (TAB === 'cars') { if (!s.cars.length) { this.setState(newCarState); this.toast(this.w('أضف سيارتك أولاً', 'Add your car first')); return; } this.setState({ screen: 'add', editId: null, formErr: '', showExtra: false, sheet: null, form: this.defaults(SUB === 'docs' ? 'doc' : 'car', carSelId) }); return; } this.setState({ screen: 'add', form: null, formErr: '', editId: null, showExtra: false, sheet: null }); },
      navTabs: [['cars', this.ICON('car')], ['docs', this.ICON('doc')]].map((x, i) => ({ gap: i === 1, label: tabT[x[0]], icon: x[1], on: TAB === x[0] ? 'on' : '', pick: () => this.setState({ tab: x[0], screen: 'home', sel: null }) })),
      todayText: this.fmt(this.T0()),
      hasCars: s.cars.length > 0, noCars: s.cars.length === 0, multiCars: s.cars.length > 1,
      car: carV, carCountText: carCountText, carList: carList, carStrip: carList, openCarList: () => this.setState({ sheet: 'cars' }),
      carSubs: carSubs, subParts: SUB === 'parts', subDocs: SUB === 'docs',
      carParts: carParts, noParts: carParts.length === 0, carDocs: carDocs, noCarDocs: carDocs.length === 0,
      carAttn: carAttn, carAttnCount: carAttn.length, hasCarAttn: carAttn.length > 0, noCarAttn: carAttn.length === 0, carAttnHint: swipeHint(carAttn.length),
      carDocTpls: carDocTpls, hasCarDocTpls: carDocTpls.length > 0,
      addPartForCar: () => this.setState({ screen: 'add', editId: null, formErr: '', showExtra: false, form: this.defaults('car', carSelId) }),
      addDocForCar: () => this.setState({ screen: 'add', editId: null, formErr: '', showExtra: false, form: this.defaults('doc', carSelId) }),
      openCarNew: () => this.setState(newCarState),
      openCarEdit: () => { if (car) this.setState({ screen: 'carForm', carF: { name: this.tx(car.name), nameObj: typeof car.name === 'object' ? car.name : null, plate: this.tx(car.plate), plateObj: car.plate && typeof car.plate === 'object' ? car.plate : null, odo: String(car.odo), photo: car.photo || null }, carEditId: car.id, carErr: '' }); },
      q: s.q, onQ: (e) => this.setState({ q: e.target.value }),
      tiles: tiles, docChips: docChips, docList: docList, docListEmpty: docList.length === 0,
      docAttn: docAttn, docAttnCount: docAttn.length, hasDocAttn: docAttn.length > 0, noDocAttn: docAttn.length === 0, docAttnHint: swipeHint(docAttn.length),
      archList: archList, archCount: archList.length, hasArch: archList.length > 0, showArch: !!s.showArch, archToggleText: s.showArch ? this.w('إخفاء', 'Hide') : this.w('عرض', 'Show'),
      toggleArch: () => this.setState({ showArch: !this.state.showArch }),
      cur: cur,
      back: () => { if (this.draftChanges().length) { this.setState({ sheet: 'discard', discardFor: 'detail' }); return; } this.setState({ screen: 'home', sel: null, zoom: false, draft: null }); }, detailSave: () => this.detailSave(),
      goHome: () => this.setState({ screen: 'home', sel: null }),
      openAdd: () => this.setState({ screen: 'add', form: null, formErr: '', editId: null, showExtra: false }),
      openEdit: () => { if (raw) this.setState({ screen: 'add', form: this.toForm(raw), editId: raw.id, formErr: '', showExtra: false }); },
      cancelForm: () => { if (editOld && f && this.diffForm(editOld, f).length) { this.setState({ sheet: 'discard', discardFor: 'form' }); return; } this.setState(this.state.editId ? { screen: 'detail', form: null, editId: null, formErr: '' } : { screen: 'home', form: null, formErr: '' }); },
      confirmDiscard: () => this.setState(this.state.discardFor === 'detail' ? { sheet: null, screen: 'home', sel: null, draft: null, discardFor: null } : { sheet: null, screen: 'detail', form: null, editId: null, formErr: '', discardFor: null }),
      changeList: s.changes || [], confirmSave: () => { const ps = this.state.pendingSave; if (ps === 'car') this.saveCar(true); else if (ps === 'detail') this.detailSave(true); else this.saveForm(true); },
      backToPick: () => this.setState({ form: null, formErr: '' }),
      formTitle: editing ? this.w('تعديل العنصر', 'Edit item') : (f ? this.w('عنصر جديد', 'New item') : this.w('ماذا تريد أن تضيف؟', 'What would you like to add?')), formSub: editing ? this.w('غيّر ما تريد ثم احفظ', 'Change what you need, then save') : this.w('الحقول الأساسية فقط — والباقي اختياري', 'Essentials only — the rest is optional'),
      saveLabel: editing ? this.w('حفظ التعديلات', 'Save changes') : this.w('حفظ', 'Save'), canChangeCat: !editing,
      addPick: s.screen === 'add' && !f, addPickCls: s.screen === 'add' && !f ? 'pickfull' : '', addForm: s.screen === 'add' && !!f, addGroups: addGroups,
      fcatLabel: f ? FCAT[f.cat][0] : '', fcatIcon: f ? FCAT[f.cat][1] : '',
      formHasCar: !!f && (f.cat === 'car' || f.cat === 'doc') && s.cars.length > 0, formCarOpts: formCarOpts, formCarLabel: f && f.cat === 'doc' ? this.w('مرتبطة بسيارة؟', 'Linked to a car?') : this.w('السيارة', 'Car'),
      mainFields: mainFields, extraFields: extraFields, hasExtra: extraFields.length > 0, extraCount: extraFields.length,
      showExtra: !!s.showExtra, extraToggleText: s.showExtra ? this.w('إخفاء', 'Hide') : this.w('إظهار', 'Show'), toggleExtra: () => this.setState({ showExtra: !this.state.showExtra }),
      presets: presets, hasPresets: presets.length > 0, modes: modes, isCustomForm: !!f && f.cat === 'custom',
      ...maint, ...partOdo, odoNewPh: this.w('مثال: 85200', 'e.g. 85200'),
      formHasPhoto: formHasPhoto, formPhoto: f && f.photo ? f.photo : '', hasFormPhoto: !!(f && f.photo),
      formPhotoLabel: f ? this.photoLabel(f.cat) : '', formPhotoBtn: f && f.photo ? this.w('تغيير الصورة', 'Change photo') : this.w('تصوير أو اختيار صورة', 'Take or choose a photo'),
      onFormPhoto: (e) => { const file = e.target.files && e.target.files[0]; if (file) this.readImage(file).then((u) => { if (u) this.setState({ form: Object.assign({}, this.state.form, { photo: u }) }); }); },
      formErr: s.formErr, hasErr: !!s.formErr, saveForm: () => this.saveForm(),
      carF: { name: carF.name || '', plate: carF.plate || '', odo: carF.odo || '', photo: carF.photo || '', hasPhoto: !!carF.photo, noPhoto: !carF.photo, photoBtn: carF.photo ? this.w('تغيير الصورة', 'Change photo') : this.w('تصوير السيارة أو اختيار صورة', 'Take or choose a car photo') },
      carFormTitle: s.carEditId ? this.w('بيانات السيارة', 'Car details') : this.w('سيارة جديدة', 'New car'), carIsNew: !s.carEditId, carIsEdit: !!s.carEditId,
      setCarName: setCar('name'), setCarPlate: setCar('plate'), setCarOdo: setCar('odo'),
      onCarPhoto: (e) => { const file = e.target.files && e.target.files[0]; if (file) this.readImage(file).then((u) => { if (u) this.setState({ carF: Object.assign({}, this.state.carF, { photo: u }) }); }); },
      carErr: s.carErr, hasCarErr: !!s.carErr, saveCar: () => this.saveCar(),
      cancelCar: () => this.setState({ screen: 'home', carF: null, carEditId: null, carErr: '' }),
      askDelCar: () => this.setState({ sheet: 'delCar' }), delCarTitle: this.w('حذف «', 'Delete “') + (s.carEditId ? this.tx((this.car(s.carEditId) || {}).name) : '') + this.w('»؟', '”?'),
      confirmDelCar: () => { const id = this.state.carEditId, snap = this.snap(), nm = this.tx((this.car(id) || {}).name); const cars = this.state.cars.filter((c) => c.id !== id); this.setState({ cars: cars, items: this.state.items.filter((x) => x.carId !== id), carSel: cars[0] ? cars[0].id : null, sheet: null, screen: 'home', tab: 'cars', carF: null, carEditId: null }); this.toast(this.w('حُذفت «' + nm + '»', '“' + nm + '” deleted'), snap); },
      onPhoto: (e) => { const file = e.target.files && e.target.files[0]; if (!file) return; this.readImage(file).then((u) => { if (!u) return; this.upCur((x) => Object.assign({}, x, { photo: u })); this.toast(this.w('حُفظت نسخة من الصورة داخل عُهدة', 'A copy of the photo is now kept inside Uhda')); }); },
      openZoom: () => this.setState({ zoom: true }), closeZoom: () => this.setState({ zoom: false }), zoomOn: !!(s.zoom && zoomSrc), zoomSrc: zoomSrc,
      share: () => { if (navigator.share) { navigator.share({ title: nmCur, text: nmCur }).catch(() => {}); } else { this.toast(this.w('المشاركة تعمل من الهاتف في النسخة النهائية', 'Sharing works from the phone in the final app')); } },
      printIt: () => this.toast(this.w('الطباعة متاحة في النسخة النهائية', 'Printing is available in the final app')),
      rf: { cost: rf.cost || '', note: rf.note || '', km: rf.km || '', exp: rf.exp || '', date: rf.date || '', photo: rf.photo || '', hasPhoto: !!rf.photo, photoBtn: rf.photo ? this.w('تغيير الصورة', 'Change photo') : this.w('تصوير أو إرفاق صورة', 'Take or attach a photo') },
      rfDateLabel: raw && raw.cat === 'doc' ? this.w('تاريخ التجديد', 'Renewal date') : (raw && raw.cat === 'car' ? this.w('تاريخ التغيير', 'Change date') : (raw && raw.cat === 'dev' ? this.w('تاريخ الصيانة', 'Service date') : this.w('التاريخ', 'Date'))),
      rfPhotoLabel: raw && raw.cat === 'doc' ? this.w('صورة الوثيقة الجديدة (اختياري)', 'New document photo (optional)') : (raw && raw.cat === 'dev' ? this.w('صورة الفاتورة أو الضمان الجديد (اختياري)', 'New invoice or warranty photo (optional)') : this.w('صورة الفاتورة الجديدة (اختياري)', 'New invoice photo (optional)')),
      setRfDate: setRf('date'), onRfPhoto: (e) => { const file = e.target.files && e.target.files[0]; if (file) this.readImage(file).then((u) => { if (u) this.setState({ rf: Object.assign({}, this.state.rf, { photo: u }) }); }); },
      renewTitle: rr ? (rr.once ? this.w('تم: ', 'Done: ') + rrName : (rr.type === 'date' ? this.w('تم التجديد: ', 'Renewed: ') : (raw.cat === 'car' ? this.w('تم التغيير: ', 'Changed: ') : (raw.cat === 'dev' ? this.w('تمت الصيانة: ', 'Serviced: ') : this.w('تم: ', 'Done: ')))) + (raw.cat === 'dev' && !rr.base ? rrName : (raw.cat === 'dev' ? rrName + ' — ' + nmCur : nmCur))) : '',
      renewHint: '«' + nmCur + '» — ' + (rr && rr.once ? this.w('يُغلق هذا التذكير ويُحفظ في السجل.', 'This reminder will be closed and saved to history.') : this.w('تُحفظ العملية وتكلفتها وفاتورتها في السجل، وتبدأ دورة جديدة من تاريخها ويتوقف التنبيه اليومي.', 'The operation, its cost and invoice are saved, a new cycle starts from its date and the daily alert stops.')),
      rfKm: rfUsesKm, rfExp: rfExp, rfExpLabel: raw && raw.cat === 'doc' ? this.w('تاريخ الانتهاء الجديد', 'New expiry date') : this.w('الموعد التالي', 'Next date'),
      rfOdoNew: rf.odoMode === 'new', rfOdoModes: (() => { const c = raw && raw.carId ? this.car(raw.carId) : null, last = c ? c.odo : 0; return [['last', this.w('آخر قراءة مسجلة · ', 'Last recorded · ') + this.num(last)], ['new', this.w('تسجيل قراءة جديدة', 'Enter a new reading')]].map((x) => ({ label: x[1], on: (rf.odoMode === 'new' ? 'new' : 'last') === x[0] ? 'on' : '', pick: () => this.setState({ rf: Object.assign({}, this.state.rf, { odoMode: x[0] }) }) })); })(),
      setRfCost: setRf('cost'), setRfNote: setRf('note'), setRfKm: (e) => this.setState({ rf: Object.assign({}, this.state.rf, { km: String(e.target.value).replace(/[^0-9]/g, '') }) }), setRfExp: setRf('exp'),
      confirmRenew: () => this.confirmRenew(),
      openSpec: () => this.setState({ sheet: 'spec', specF: { k: '', v: '' } }), specF: s.specF || { k: '', v: '' },
      setSpecK: setSpec('k'), setSpecV: setSpec('v'), saveSpec: () => this.saveSpec(),
      askDel: () => this.setState({ sheet: 'del' }), delTitle: this.w('حذف «' + nmCur + '»؟', 'Delete “' + nmCur + '”?'),
      confirmDel: () => { const snap = this.snap(), id = this.state.sel; this.setState({ items: this.state.items.filter((x) => x.id !== id), sheet: null, screen: 'home', sel: null }); this.toast(this.w('حُذف «' + nmCur + '»', '“' + nmCur + '” deleted'), snap); },
      bk: { autoLast: window.__uhdaSavedAt ? this.fmtT(window.__uhdaSavedAt) : this.w('تلقائياً عند كل تعديل', 'Automatically on every change'), nCars: String(s.cars.length), nItems: String(s.items.length), nPhotos: String(nPhotos), lastExport: s.lastExport ? this.w('آخر تصدير: ', 'Last export: ') + this.fmtT(s.lastExport) : this.w('لم تُصدَّر أي نسخة يدوية بعد — صدّر نسخة واحفظها خارج الهاتف', 'No manual backup yet — export one and keep it off the phone') },
      openBackup: () => this.setState({ screen: 'backup', sheet: null }),
      exportBackup: () => this.exportBackup(), saveBackup: () => this.saveBackup(), savePhoto: () => this.savePhoto(), sharePhoto: () => this.sharePhoto(),
      sharePdf: () => this.makePdf('share'), onImportFile: (e) => this.onImportFile(e), confirmImport: () => this.confirmImport(),
      impInfo: pend ? this.w('نسخة بتاريخ ', 'Backup from ') + this.fmtT(new Date(pend.at)) + ' · ' + pend.cars.length + this.w(' سيارات · ', ' cars · ') + pend.items.length + this.w(' عناصر', ' items') : '',
      openReport: () => this.setState({ screen: 'report' }), backToBackup: () => this.setState({ screen: 'backup' }),
      report: s.screen === 'report' ? this.report() : { when: '', sections: [] },
      printReport: () => this.makePdf('save'),
      ...this.obVals(s),
      sheetCars: s.sheet === 'cars', sheetImport: s.sheet === 'import', sheetReady: s.sheet === 'ready', shareReady: () => this.shareReady(), readyName: this._ready ? this._ready.file.name : '', sheetRenew: s.sheet === 'renew', sheetSpec: s.sheet === 'spec', sheetDel: s.sheet === 'del', sheetDelCar: s.sheet === 'delCar', sheetOdo: s.sheet === 'odo', sheetSettings: s.sheet === 'settings', hasSheet: !!s.sheet,
      sheetHistDel: s.sheet === 'histDel' && !!hd, sheetCancelMaint: s.sheet === 'cancelMaint' && !!cmR, sheetSaveConfirm: s.sheet === 'saveConfirm', sheetDiscard: s.sheet === 'discard', sheetAlerts: s.sheet === 'alerts',
      histDelInfo: hd ? (this.tx(hd.note) || '—') + ' · ' + this.fmt(hd.date) + (hd.cost ? ' · ' + this.money(hd.cost) : '') + (hd.photo ? this.w(' · مع صورة الفاتورة', ' · with invoice photo') : '') : '',
      sheetRec: s.sheet === 'rec' && !!hd, askHistDel: () => this.setState({ sheet: 'histDel' }), backToRec: () => this.setState({ sheet: 'rec' }),
      rec: hd ? { item: raw ? this.tx(raw.name) : '', title: this.tx(hd.note) || '—', photo: hd.photo || '', hasPhoto: !!hd.photo, noPhoto: !hd.photo, zoom: () => this.setState({ zoom: hd.photo }), rows: [[this.w('التاريخ', 'Date'), this.fmt(hd.date)]].concat(hd.km ? [[this.w('العداد', 'Odometer'), this.num(hd.km) + this.w(' كم', ' km')]] : []).concat([[this.w('التكلفة', 'Cost'), hd.cost ? this.money(hd.cost) : this.w('بدون تكلفة', 'No cost')]]).map((x) => ({ k: x[0], v: x[1] })) } : { rows: [] },
      confirmHistDel: () => { const snap = this.snap(), i = this.state.hd; this.upCur((x) => Object.assign({}, x, { history: (x.history || []).filter((_, j) => j !== i) })); this.setState({ sheet: null, hd: null, zoom: false }); this.toast(this.w('حُذف السجل', 'Record deleted'), snap); },
      cancelMaintTitle: cmR ? this.w('إلغاء «' + this.tx(cmR.name) + '»؟', 'Cancel “' + this.tx(cmR.name) + '”?') : '',
      confirmCancelMaint: () => { const snap = this.snap(), id = this.state.cm; this.upCur((x) => Object.assign({}, x, { rems: (x.rems || []).filter((r) => r.id !== id) })); this.setState({ sheet: null, cm: null }); this.toast(this.w('أُلغيت الصيانة الدورية وتوقف تنبيهها', 'Periodic maintenance cancelled — its alert stopped'), snap); },
      ns: NV.ns, dlgNotif: s.dlg === 'notif', askNotif: () => this.askNotif(), notifLater: () => { this.setState({ dlg: null, notifAsked: true }); setTimeout(() => this.checkAlerts(true), 450); }, testNotif: () => this.testNotif(),
      alertsList: alertsList, alertsCount: alertsList.length,
      closeSheet: () => this.setState({ sheet: null, pending: null }),
      openOdo: () => this.setState({ sheet: 'odo', odoIn: String(lastCarOdo) }),
      odoIn: s.odoIn, onOdo: (e) => this.setState({ odoIn: e.target.value }), odoPreview: odoPreview, hasOdoPreview: odoPreview.length > 0, saveOdo: () => this.saveOdo(),
      openSettings: () => this.setState({ sheet: 'settings' }),
      notifTime: s.notifTime, onNotif: (e) => this.setState({ notifTime: e.target.value }),
      odoEveryOpts: [[7, 'كل أسبوع', 'Weekly'], [14, 'كل أسبوعين', 'Every 2 weeks'], [30, 'كل شهر', 'Monthly']].map((x) => ({ label: en ? x[2] : x[1], on: s.odoEvery === x[0] ? 'on' : '', pick: () => this.setState({ odoEvery: x[0] }) })),
      themeOpts: [[false, 'نهاري', 'Light'], [true, 'ليلي', 'Dark']].map((x) => ({ label: en ? x[2] : x[1], on: !!s.dark === x[0] ? 'on' : '', pick: () => this.setState({ dark: x[0] }) })),
      toast: s.toast, hasToast: !!s.toast, hasUndo: !!s.undo,
      doUndo: () => { const u = this.state.undo; if (u) { clearTimeout(this._t); this.setState({ items: u.items, cars: u.cars, undo: null, toast: '' }); } }
    };
  }
}
