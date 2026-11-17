#!/usr/bin/env bash
# يبني صفحة الويب من ملف التصميم ثم ينسخها إلى مجلد www الذي يغلّفه Capacitor
set -euo pipefail
node scripts/build-web.mjs
rm -rf www && mkdir -p www
cp index.html app.js dc-runtime.js sw.js manifest.webmanifest www/
cp -r icons fonts lib www/
cp node_modules/@capacitor/core/dist/capacitor.js www/capacitor.js
# capacitor.js يُحمَّل قبل التطبيق داخل APK / IPA فقط
node -e "const f='www/index.html',fs=require('fs');fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace('<script src=\"lib/preact.min.js\"></script>','<script src=\"capacitor.js\"></script>\n<script src=\"lib/preact.min.js\"></script>'))"
