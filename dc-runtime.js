/* عُهدة · Uhda — مشغّل القالب (.dc.html) كتطبيق مستقل يعمل بدون إنترنت
   يحوّل قالب <x-dc> (sc-if / sc-for / {{…}}) إلى عناصر Preact، ويحفظ البيانات في الجهاز. */
(function () {
  'use strict';
  var P = window.preact, h = P.h;

  /* ---------- 1) منع التكبير بالنقر المزدوج / القرص ومنع تحديد النص ---------- */
  function isField(t) {
    if (t && t.nodeType === 3) t = t.parentElement;
    return !!(t && t.closest && t.closest('input, textarea, [contenteditable="true"]'));
  }
  var stop = function (e) { e.preventDefault(); };
  document.addEventListener('gesturestart', stop, { passive: false });
  document.addEventListener('gesturechange', stop, { passive: false });
  document.addEventListener('dblclick', stop, { passive: false });
  document.addEventListener('touchmove', function (e) { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener('selectstart', function (e) { if (!isField(e.target)) e.preventDefault(); });
  document.addEventListener('contextmenu', function (e) { if (!isField(e.target)) e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { if (!isField(e.target)) e.preventDefault(); });
  /* نقرتان سريعتان على نفس المكان في Safari القديم: نلغي التكبير فقط ونبقي النقرة */
  var lastTouch = 0;
  document.addEventListener('touchend', function (e) {
    var now = Date.now();
    if (now - lastTouch < 320 && e.changedTouches && e.changedTouches.length === 1 && !isField(e.target)) {
      e.preventDefault();
      var t = e.target && e.target.nodeType === 3 ? e.target.parentElement : e.target;
      if (t && typeof t.click === 'function') t.click();
    }
    lastTouch = now;
  }, { passive: false });

  /* سحب النافذة السفلية (الإعدادات وغيرها) للأسفل يغلقها */
  var sw = null;
  document.addEventListener('touchstart', function (e) {
    var t = e.target && e.target.nodeType === 3 ? e.target.parentElement : e.target;
    var sh = t && t.closest && t.closest('.sheet');
    if (!sh || !e.touches || e.touches.length !== 1 || isField(t)) { sw = null; return; }
    sw = { sh: sh, x: e.touches[0].clientX, y: e.touches[0].clientY, dy: 0, t: Date.now(), ok: sh.scrollTop <= 0, drag: false };
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    if (!sw || !sw.ok || !e.touches || e.touches.length !== 1) return;
    var dy = e.touches[0].clientY - sw.y, dx = e.touches[0].clientX - sw.x;
    if (!sw.drag) {
      if (sw.sh.scrollTop > 0 || dy <= 4) { if (dy < 0) sw.ok = false; return; }
      if (Math.abs(dx) > Math.abs(dy)) { sw.ok = false; return; }
      sw.drag = true;
    }
    sw.dy = Math.max(0, dy);
    sw.sh.style.transition = 'none';
    sw.sh.style.transform = 'translateY(' + sw.dy + 'px)';
    if (e.cancelable) e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', function () {
    var s = sw; sw = null;
    if (!s || !s.drag) return;
    var sh = s.sh, close = s.dy > 110 || (s.dy > 40 && Date.now() - s.t < 260);
    sh.style.transition = 'transform .2s ease';
    sh.style.transform = close ? 'translateY(100%)' : '';
    setTimeout(function () {
      sh.style.transition = '';
      if (close) { var w = sh.closest('.sheetwrap'), sc = w && w.querySelector('.scrim'); sh.style.transform = ''; if (sc) sc.click(); }
    }, 200);
  });

  /* ---------- 2) جسر المشاركة والحفظ داخل تطبيق APK / IPA ---------- */
  var C = window.Capacitor;
  var native = !!(C && typeof C.isNativePlatform === 'function' && C.isNativePlatform());
  if (native) {
    var Pl = C.Plugins || {};
    var toB64 = function (blob) {
      return new Promise(function (res, rej) {
        var r = new FileReader();
        r.onload = function () { res(String(r.result).split(',')[1] || ''); };
        r.onerror = rej; r.readAsDataURL(blob);
      });
    };
    var shareFiles = function (files, title, text) {
      var FS = Pl.Filesystem, SH = Pl.Share;
      if (!SH) return Promise.reject(new Error('share-missing'));
      return Promise.all((files || []).map(function (f, i) {
        if (!FS) return null;
        var name = (f && f.name) || ('uhda-' + Date.now() + '-' + i);
        return toB64(f).then(function (b64) {
          return FS.writeFile({ path: name, data: b64, directory: 'CACHE' }).then(function (r) { return r.uri; });
        });
      })).then(function (uris) {
        uris = uris.filter(Boolean);
        var o = { title: title || 'عُهدة', dialogTitle: title || 'عُهدة' };
        if (text) o.text = text;
        if (uris.length) o.files = uris;
        return SH.share(o);
      });
    };
    navigator.canShare = function () { return true; };
    navigator.share = function (d) { d = d || {}; return shareFiles(d.files, d.title, d.text); };
    /* روابط التنزيل (a.download) لا تعمل داخل التطبيق: نحوّلها إلى نافذة المشاركة */
    var origClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      var a = this;
      if (a.download && /^(blob:|data:)/.test(a.href)) {
        fetch(a.href).then(function (r) { return r.blob(); }).then(function (b) {
          var f; try { f = new File([b], a.download, { type: b.type || 'application/octet-stream' }); } catch (e) { f = b; f.name = a.download; }
          return shareFiles([f], a.download);
        }).catch(function () {});
        return;
      }
      return origClick.call(this);
    };
  }

  /* ---------- 3) حفظ البيانات في الجهاز (IndexedDB) ---------- */
  var KEEP = ['lang', 'dark', 'cars', 'items', 'nextId', 'nextR', 'nextF', 'nextC', 'notifTime', 'odoEvery', 'lastExport', 'autoAt', 'spendRange', 'spendScope', 'carSel', 'tab', 'carSub', 'onboarded'];
  var DBN = 'uhda', ST = 'kv', KEY = 'state-v2';
  var idb = function () {
    return new Promise(function (res, rej) {
      if (!window.indexedDB) return rej(new Error('no-idb'));
      var q = indexedDB.open(DBN, 1);
      q.onupgradeneeded = function () { q.result.createObjectStore(ST); };
      q.onsuccess = function () { res(q.result); };
      q.onerror = function () { rej(q.error); };
    });
  };
  var revive = function (k, v) { return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v) ? new Date(v) : v; };
  function load() {
    return idb().then(function (db) {
      return new Promise(function (res) {
        var q = db.transaction(ST, 'readonly').objectStore(ST).get(KEY);
        q.onsuccess = function () { res(q.result ? JSON.parse(q.result, revive) : null); };
        q.onerror = function () { res(null); };
      });
    }).catch(function () {
      try { var s = localStorage.getItem('uhda:' + KEY); return s ? JSON.parse(s, revive) : null; } catch (e) { return null; }
    });
  }
  function save(st) {
    var o = {}; KEEP.forEach(function (k) { if (st[k] !== undefined) o[k] = st[k]; });
    var txt = JSON.stringify(o);
    return idb().then(function (db) {
      return new Promise(function (res) {
        var t = db.transaction(ST, 'readwrite'); t.objectStore(ST).put(txt, KEY);
        t.oncomplete = res; t.onerror = res;
      });
    }).catch(function () { try { localStorage.setItem('uhda:' + KEY, txt); } catch (e) {} });
  }
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

  /* ---------- 4) تحويل القالب ---------- */
  var HOLE = /\{\{\s*([^}]*?)\s*\}\}/g, WHOLE = /^\s*\{\{\s*([^}]*?)\s*\}\}\s*$/;
  var BOOL = { hidden: 1, disabled: 1, readonly: 1, checked: 1, multiple: 1, required: 1, autofocus: 1, selected: 1 };
  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true; if (path === 'false') return false;
    if (path === 'null') return null; if (path === '') return undefined;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.'), head = parts[0], base;
    for (var i = scope.length - 1; i >= 0; i--) { if (scope[i] && head in scope[i]) { base = scope[i][head]; break; } }
    for (var j = 1; j < parts.length; j++) { if (base == null) return undefined; base = base[parts[j]]; }
    return base;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (_, p) { var v = lookup(p, scope); return v == null ? '' : String(v); });
  }
  function attrVal(raw, scope) {
    var m = WHOLE.exec(raw);
    if (m) return lookup(m[1], scope);
    return raw.indexOf('{{') >= 0 ? interp(raw, scope) : raw;
  }
  function compile(node) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      if (!t.trim() && t.indexOf('\n') >= 0) return null;
      if (t.indexOf('{{') < 0) return function () { return t; };
      return function (sc) { return interp(t, sc); };
    }
    if (node.nodeType !== 1) return null;
    var tag = node.localName;
    var kids = Array.prototype.map.call(node.childNodes, compile).filter(Boolean);
    /* نُبقي مكان العنصر الغائب (null) حتى لا تُعاد صناعة ما بعده عند ظهور عنصر شرطي */
    var run = function (sc) { var out = []; for (var i = 0; i < kids.length; i++) { var r = kids[i](sc); out.push(r == null || r === false ? null : r); } return out; };
    if (tag === 'sc-if') {
      var cond = node.getAttribute('value') || '';
      return function (sc) { return attrVal(cond, sc) ? run(sc) : null; };
    }
    if (tag === 'sc-for') {
      var lst = node.getAttribute('list') || '', as = node.getAttribute('as') || 'item';
      return function (sc) {
        var arr = attrVal(lst, sc); if (!arr || !arr.length) return null;
        var out = [];
        for (var i = 0; i < arr.length; i++) { var o = { $index: i }; o[as] = arr[i]; out.push(run(sc.concat([o]))); }
        return out;
      };
    }
    var attrs = Array.prototype.map.call(node.attributes, function (a) { return [a.name, a.value]; })
      .filter(function (a) { return a[0].indexOf('hint-') !== 0; });
    var type = (node.getAttribute('type') || '').toLowerCase();
    var textLike = (tag === 'input' && ['file', 'checkbox', 'radio', 'button', 'submit'].indexOf(type) < 0) || tag === 'textarea';
    return function (sc) {
      var props = {};
      for (var i = 0; i < attrs.length; i++) {
        var n = attrs[i][0], v = attrVal(attrs[i][1], sc);
        if (n === 'onchange' && textLike) n = 'oninput';
        else if (n === 'value' && v == null) v = '';
        else if (BOOL[n] && v === '') v = true;
        props[n] = v;
      }
      return h.apply(null, [tag, props].concat(run(sc)));
    };
  }

  /* ---------- 5) التشغيل ---------- */
  var tplEl = document.getElementById('dc-template');
  var frag = tplEl.content;
  var roots = Array.prototype.map.call(frag.childNodes, compile).filter(Boolean);
  var renderTpl = function (vals) { var sc = [vals || {}], out = []; roots.forEach(function (f) { var r = f(sc); out.push(r == null || r === false ? null : r); }); return out.length === 1 ? out[0] : h(P.Fragment, null, out); };

  window.DCLogic = class DCLogic extends P.Component {
    renderVals() { return {}; }
    render() { return renderTpl(this.renderVals()); }
  };

  window.DCStart = function (Comp) {
    load().then(function (saved) {
      var timer = null, inst = null;
      /* لون نص شريط الحالة في APK / IPA يتبع المظهر */
      var bar = function (dark) {
        try { var SB = native && C.Plugins && C.Plugins.StatusBar; if (SB) SB.setStyle({ style: dark ? 'DARK' : 'LIGHT' }); } catch (e) {}
      };
      class App extends Comp {
        constructor(props) {
          super(props);
          if (saved && this.state) {
            var s = Object.assign({}, this.state);
            KEEP.forEach(function (k) { if (saved[k] !== undefined) s[k] = saved[k]; });
            if (s.cars && s.carSel && !s.cars.some(function (c) { return c.id === s.carSel; })) s.carSel = s.cars[0] ? s.cars[0].id : null;
            this.state = s;
          }
        }
        componentDidUpdate(pp, ps) {
          if (super.componentDidUpdate) super.componentDidUpdate(pp, ps);
          inst = this;
          if (ps.dark !== this.state.dark) bar(this.state.dark);
          var st = this.state, changed = KEEP.some(function (k) { return ps[k] !== st[k]; });
          if (changed) { clearTimeout(timer); timer = setTimeout(function () { save(st); }, 250); }
        }
      }
      var root = document.getElementById('root');
      P.render(h(App, {}), root);
      bar(!!(saved && saved.dark));
      document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && inst) { clearTimeout(timer); save(inst.state); } });
    });
  };
})();
