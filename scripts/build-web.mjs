// يبني صفحة الويب (index.html + app.js) من ملف التصميم src/Uhda.dc.html
// الاستخدام: node scripts/build-web.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const VER = process.env.VER || pkg.appVersion;
const src = readFileSync(join(root, 'src/Uhda.dc.html'), 'utf8');

const cut = (s, a, b) => {
  const i = s.indexOf(a); if (i < 0) throw new Error('missing ' + a);
  const j = s.indexOf(b, i + a.length); if (j < 0) throw new Error('missing ' + b);
  return s.slice(i + a.length, j);
};

let helmet = cut(src, '<helmet>', '</helmet>');
helmet = helmet.replace(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\s*/g, '');
const tpl = cut(src, '</helmet>', '</x-dc>').trim();
const scriptOpen = src.indexOf('<script type="text/x-dc"');
const logic = cut(src.slice(scriptOpen), '>', '</script>').trim();

if (!/class Component extends DCLogic/.test(logic)) throw new Error('component class not found');
if (tpl.includes('</template>')) throw new Error('template contains </template>');

const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="theme-color" content="#EFF2F5">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="عُهدة">
<title>عُهدة · Uhda ${VER}</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<link rel="icon" type="image/png" sizes="32x32" href="icons/icon-32.png">
<link rel="stylesheet" href="fonts/almarai.css">
${helmet.trim()}
<style>
/* تشغيل مستقل: ملء الشاشة + منع التكبير والتحديد */
html,body{margin:0;height:100%;overflow:hidden;overscroll-behavior:none;-webkit-text-size-adjust:100%;text-size-adjust:100%;touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
/* أعلى الشاشة بلون الصفحة وأسفلها بلون شريط التنقل، فلا يظهر شريط فارغ تحت التطبيق */
body{background:linear-gradient(#EFF2F5 0 50%,#FFFFFF 50% 100%)}
body:has(.app.dark){background:linear-gradient(#0D1014 0 50%,#161B21 50% 100%)}
body:has(.app:not(.dark) .actionbar),body:has(.app:not(.dark) .ob){background:#EFF2F5}
body:has(.app.dark .actionbar),body:has(.app.dark .ob){background:#0D1014}
body:has(.app.dark .splash){background:#0B0A18}
body:has(.app:not(.dark) .splash){background:#F4F2FB}
#root{position:fixed;top:env(safe-area-inset-top);left:0;right:0;bottom:0;display:flex;justify-content:center}
#root>.app{width:100%!important;max-width:560px;height:100%!important}
@media (min-width:600px){#root>.app{border-inline:1px solid var(--line)}}
input,textarea{-webkit-user-select:text;user-select:text}
</style>
</head>
<body>
<div id="root"></div>
<template id="dc-template">
${tpl}
</template>
<script src="lib/preact.min.js"></script>
<script src="lib/html2canvas.min.js"></script>
<script src="lib/jspdf.umd.min.js"></script>
<script src="dc-runtime.js"></script>
<script src="app.js"></script>
<script>
DCStart(Component);
if ('serviceWorker' in navigator && location.protocol === 'https:' && !(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}
</script>
</body>
</html>
`;

writeFileSync(join(root, 'index.html'), html);
writeFileSync(join(root, 'app.js'), `/* عُهدة · Uhda ${VER} — منطق التطبيق (مأخوذ كما هو من src/Uhda.dc.html) */\n${logic}\n`);

// رقم نسخة ذاكرة العمل بدون إنترنت يتبع رقم الإصدار
const swPath = join(root, 'sw.js');
const sw = readFileSync(swPath, 'utf8').replace(/const CACHE = '[^']*';/, `const CACHE = 'uhda-v${VER}';`);
writeFileSync(swPath, sw);
console.log('built index.html + app.js for v' + VER);
