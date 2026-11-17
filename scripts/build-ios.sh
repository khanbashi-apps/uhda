#!/usr/bin/env bash
# يبني IPA غير موقّع لعُهدة (يُوقَّع لاحقاً بتطبيق التوقيع)
set -euo pipefail
VER="${VER:-$(node -p "require('./package.json').appVersion")}"
XC=$(ls -d /Applications/Xcode_26*.app 2>/dev/null | sort -V | tail -1 || true)
if [ -n "$XC" ]; then sudo xcode-select -s "$XC/Contents/Developer"; fi
echo "== أدوات" ; node -v ; xcodebuild -version
npm install --no-audit --no-fund
bash scripts/prepare-www.sh
npx cap add ios
P=ios/App/App/Info.plist
pb() { /usr/libexec/PlistBuddy -c "Delete :$1" "$P" 2>/dev/null || true; /usr/libexec/PlistBuddy -c "Add :$1 string $2" "$P"; }
pb NSPhotoLibraryAddUsageDescription "لحفظ صور الضمانات والفواتير في ألبوم الصور"
pb NSPhotoLibraryUsageDescription "لإرفاق صور الفواتير والضمانات والسيارات"
pb NSCameraUsageDescription "لتصوير الفواتير والضمانات والسيارات"
pb CFBundleDisplayName "عُهدة"
pb CFBundleDevelopmentRegion "ar"
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VER" "$P" 2>/dev/null || pb CFBundleShortVersionString "$VER"
npx @capacitor/assets generate --ios --iconBackgroundColor '#3B2A8C' --splashBackgroundColor '#0B0A18' --splashBackgroundColorDark '#0B0A18' || echo "!! تعذّر توليد الأيقونات، سيستمر البناء بالأيقونة الافتراضية"
npx cap sync ios
if [ -d ios/App/App.xcworkspace ]; then SRC=(-workspace ios/App/App.xcworkspace); else SRC=(-project ios/App/App.xcodeproj); fi
xcodebuild "${SRC[@]}" -scheme App -configuration Release -sdk iphoneos -destination 'generic/platform=iOS' \
  -derivedDataPath build CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY="" \
  MARKETING_VERSION="$VER" CURRENT_PROJECT_VERSION="${GITHUB_RUN_NUMBER:-1}" build
APP=$(find build/Build/Products/Release-iphoneos -maxdepth 1 -name "*.app" | head -1)
echo "APP=$APP"
rm -rf Payload out && mkdir -p Payload out && cp -R "$APP" Payload/
zip -qry "out/Uhda-unsigned.ipa" Payload
ls -la out
