#!/usr/bin/env bash
# يبني APK لعُهدة يثبّت مباشرة على أندرويد
set -euo pipefail
VER="${VER:-$(node -p "require('./package.json').appVersion")}"
echo "== أدوات" ; node -v ; java -version 2>&1 | head -1
npm install --no-audit --no-fund
bash scripts/prepare-www.sh
npx cap add android
npx @capacitor/assets generate --android --iconBackgroundColor '#3B2A8C' --splashBackgroundColor '#F4F2FB' --splashBackgroundColorDark '#F4F2FB' || echo "!! تعذّر توليد الأيقونات، سيستمر البناء بالأيقونة الافتراضية"
npx cap sync android
G=android/app/build.gradle
sed -i "s/versionName \"[^\"]*\"/versionName \"$VER\"/" "$G" || true
sed -i "s/versionCode [0-9]*/versionCode ${GITHUB_RUN_NUMBER:-1}/" "$G" || true
if [ -n "${ANDROID_HOME:-}" ] && [ -x "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --licenses > /dev/null || true; fi
cd android && chmod +x gradlew && ./gradlew assembleDebug --no-daemon --stacktrace --warning-mode none
mkdir -p ../out && cp app/build/outputs/apk/debug/app-debug.apk "../out/Uhda.apk"
ls -la ../out
