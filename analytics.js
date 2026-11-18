/* عُهدة · Uhda — عدّاد مجهول لعدد الأجهزة والتثبيتات
 * لا يُرسَل أي شيء من بيانات المستخدم (لا وثائق ولا سيارات ولا صور ولا اسم).
 * يُرسَل فقط: رقم عشوائي للجهاز + نوع النظام + نوع الحدث (visit / install) + رقم الإصدار.
 * كل حدث يُرسَل مرة واحدة لكل جهاز، وإذا لم يوجد إنترنت يُحفظ ويُرسَل لاحقاً.
 */
(function () {
  'use strict';
  var URL_ = 'https://iwskyziaxbnrnsipwmsp.supabase.co/rest/v1/uhda_events';
  var KEY = 'sb_publishable_3R8TWXC6_3Ib56dr5vzoug_ISPkrdGJ';
  var K_ID = 'uhda_device_id', K_DONE = 'uhda_stats_done', K_Q = 'uhda_stats_queue';

  var ls;
  try { ls = window.localStorage; ls.setItem('__t', '1'); ls.removeItem('__t'); } catch (e) { return; }

  function uuid() {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    var b = new Uint8Array(16);
    try { crypto.getRandomValues(b); } catch (e) { for (var i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256); }
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }
  function read(k, d) { try { var v = JSON.parse(ls.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function write(k, v) { try { ls.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var id = ls.getItem(K_ID);
  if (!/^[0-9a-f-]{36}$/i.test(id || '')) { id = uuid(); ls.setItem(K_ID, id); }

  var cap = window.Capacitor;
  var native = !!(cap && cap.isNativePlatform && cap.isNativePlatform());
  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  var platform = native
    ? (cap.getPlatform && cap.getPlatform() === 'ios' ? 'ios-ipa' : 'android-apk')
    : (isIOS ? 'ios' : isAndroid ? 'android' : 'desktop');
  var standalone = false;
  try { standalone = !!(navigator.standalone || window.matchMedia('(display-mode: standalone)').matches); } catch (e) {}
  var ver = ((document.title || '').match(/\d+\.\d+(\.\d+)?/) || [''])[0];

  var done = read(K_DONE, {}), queue = read(K_Q, []), busy = false;

  function track(type) {
    if (done[type] || queue.indexOf(type) >= 0) return;
    queue.push(type); write(K_Q, queue); flush();
  }
  function flush() {
    if (busy || !queue.length || navigator.onLine === false) return;
    busy = true;
    var type = queue[0];
    fetch(URL_, {
      method: 'POST',
      headers: { 'apikey': KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ device_id: id, platform: platform, event_type: type, app_version: ver || null }),
      keepalive: true
    }).then(function (r) {
      busy = false;
      // 201 = سُجّل، 409 = مسجّل من قبل لنفس الجهاز — في الحالتين انتهينا منه
      if (r.status === 201 || r.status === 409) {
        done[type] = 1; write(K_DONE, done);
        queue = queue.filter(function (t) { return t !== type; }); write(K_Q, queue);
        flush();
      }
    }).catch(function () { busy = false; });
  }

  // داخل APK / IPA أو التطبيق المثبّت على الشاشة الرئيسية = تثبيت؛ في المتصفح = زيارة
  if (native || standalone) track('install'); else track('visit');
  window.addEventListener('appinstalled', function () { track('install'); });
  window.addEventListener('online', flush);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') flush(); });
})();
