import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const paketYolu = resolve(kok, 'package.json');
const kilitYolu = resolve(kok, 'package-lock.json');
const appYolu = resolve(kok, 'app.json');

// Android yolları
const androidKoku = resolve(kok, 'android');
const gradleYolu = resolve(androidKoku, 'app/build.gradle');
const gradlewYolu = resolve(androidKoku, 'gradlew');
const androidAppBuildYolu = resolve(androidKoku, 'app/build');
const androidAppCxxYolu = resolve(androidKoku, 'app/.cxx');
const aabYolu = resolve(androidKoku, 'app/build/outputs/bundle/release/app-release.aab');

// iOS yolları
const iosKoku = resolve(kok, 'ios');
const workspaceYolu = resolve(iosKoku, 'Trinkow.xcworkspace');
const pbxprojYolu = resolve(iosKoku, 'Trinkow.xcodeproj/project.pbxproj');
const infoPlistYolu = resolve(iosKoku, 'Trinkow/Info.plist');
const widgetInfoPlistYolu = resolve(iosKoku, 'ExpoWidgetsTarget/Info.plist');
const buildKlasoru = resolve(iosKoku, 'build');
const archiveYolu = resolve(buildKlasoru, 'Trinkow.xcarchive');
const exportKlasoru = resolve(buildKlasoru, 'export');
const exportOptionsYolu = resolve(buildKlasoru, 'ExportOptions.plist');
const ipaYolu = resolve(exportKlasoru, 'Trinkow.ipa');

// Gizli anahtarlar ve profiller
const androidServisAnahtariYolu = resolve(kok, '.release-secrets/google-play-service-account.json');
const androidKeystoreYolu = resolve(kok, '.release-secrets/android-upload-keystore.jks');
const androidKeystoreAyarYolu = resolve(kok, '.release-secrets/android-keystore.properties');

const iosApiKeyYolu = resolve(kok, '.release-secrets/AuthKey_6JM37H93JC.p8');
const iosAnaProfilYolu = resolve(kok, '.release-secrets/com.triworkster.trinkow.mobileprovision');
const iosWidgetProfilYolu = resolve(kok, '.release-secrets/com.triworkster.trinkow.ExpoWidgetsTarget.mobileprovision');

const BUNDLE_ID = 'com.triworkster.trinkow';
const WIDGET_BUNDLE_ID = 'com.triworkster.trinkow.ExpoWidgetsTarget';
const TEAM_ID = '3RRAH7Q65B';
const KEY_ID = '6JM37H93JC';
const ISSUER_ID = 'c52e6cf6-318d-452a-9a47-82f5b2d39467';
const SERVIS_HESABI = 'trinkow-oto-release@trinkow.iam.gserviceaccount.com';

const HEDEFLER = {
  'internal-testflight': {
    ad: 'Internal Test (Google Play) & TestFlight (App Store)',
    androidLane: 'internal',
    iosLane: 'testflight',
    komut: 'npm run release:internal-testflight',
  },
  'production': {
    ad: 'Production (Google Play Canlı & App Store)',
    androidLane: 'production',
    iosLane: 'appstore',
    komut: 'npm run release:production',
  },
};

function calistir(komut, args, secenekler = {}) {
  const sonuc = spawnSync(komut, args, {
    cwd: kok,
    stdio: 'inherit',
    shell: false,
    ...secenekler,
    env: { ...process.env, NODE_ENV: 'production', ...secenekler.env },
  });
  if (sonuc.error) throw sonuc.error;
  if (sonuc.status !== 0) {
    throw new Error(`${komut} komutu ${sonuc.status ?? 1} koduyla başarısız oldu.`);
  }
}

function sonrakiSurum(mevcut, istek = 'patch', kullanimKomutu = 'npm run release:internal-testflight') {
  if (/^\d+\.\d+\.\d+$/.test(istek)) return istek;
  const parcalar = mevcut.match(/^(\d+)\.(\d+)\.(\d+)$/)?.slice(1).map(Number);
  if (!parcalar || !['patch', 'minor', 'major'].includes(istek)) {
    throw new Error(`Kullanım: ${kullanimKomutu} -- [patch|minor|major|1.2.3]`);
  }
  let [major, minor, patch] = parcalar;
  if (istek === 'major') [major, minor, patch] = [major + 1, 0, 0];
  if (istek === 'minor') [minor, patch] = [minor + 1, 0];
  if (istek === 'patch') patch += 1;
  return `${major}.${minor}.${patch}`;
}

const hedefKodu = process.argv[2];
const hedef = HEDEFLER[hedefKodu];
if (!hedef) {
  console.error('\nLütfen geçerli bir yayın hedefi belirtin:');
  console.error('  npm run release:internal-testflight -- [patch|minor|major|1.2.3]');
  console.error('  npm run release:production -- [patch|minor|major|1.2.3]');
  process.exit(1);
}

// 1. Ortam ve Anahtar Kontrolleri
const gerekliGerecler = ['fastlane', 'xcodebuild'];
for (const arac of gerekliGerecler) {
  if (spawnSync('sh', ['-c', `command -v ${arac}`], { stdio: 'ignore' }).status !== 0) {
    throw new Error(`Gerekli araç bulunamadı: ${arac}. Lütfen sisteminize kurun.`);
  }
}

const gerekliDosyalar = [
  androidServisAnahtariYolu,
  androidKeystoreYolu,
  androidKeystoreAyarYolu,
  gradlewYolu,
  gradleYolu,
  iosApiKeyYolu,
  iosAnaProfilYolu,
  iosWidgetProfilYolu,
  workspaceYolu,
  pbxprojYolu,
  infoPlistYolu,
  widgetInfoPlistYolu,
];

const eksikler = gerekliDosyalar.filter((yol) => !existsSync(yol));
if (eksikler.length > 0) {
  console.error('Release için gerekli anahtar veya yapılandırma dosyaları eksik:');
  for (const e of eksikler) console.error(`  - ${e}`);
  process.exit(1);
}

const servisAnahtari = JSON.parse(readFileSync(androidServisAnahtariYolu, 'utf8'));
if (servisAnahtari.type !== 'service_account' || servisAnahtari.client_email !== SERVIS_HESABI || !servisAnahtari.private_key) {
  throw new Error(`Geçersiz servis anahtarı. ${SERVIS_HESABI} hesabının JSON anahtarı gerekli.`);
}

// 2. Mevcut Sürüm ve Kodları Okuma
const oncekiPaket = readFileSync(paketYolu, 'utf8');
const oncekiApp = readFileSync(appYolu, 'utf8');
const oncekiKilit = readFileSync(kilitYolu, 'utf8');
const oncekiGradle = readFileSync(gradleYolu, 'utf8');
const oncekiInfoPlist = readFileSync(infoPlistYolu, 'utf8');
const oncekiWidgetInfoPlist = readFileSync(widgetInfoPlistYolu, 'utf8');
const oncekiPbxproj = readFileSync(pbxprojYolu, 'utf8');

const paket = JSON.parse(oncekiPaket);
const app = JSON.parse(oncekiApp);
const kilit = JSON.parse(oncekiKilit);

if (app.expo?.android?.package !== BUNDLE_ID || app.expo?.ios?.bundleIdentifier !== BUNDLE_ID) {
  throw new Error(`Paket kimlikleri ${BUNDLE_ID} ile eşleşmiyor.`);
}

const androidKodEslesmesi = oncekiGradle.match(/versionCode\s+(\d+)/);
if (!androidKodEslesmesi) throw new Error('android/app/build.gradle içinde versionCode bulunamadı.');

const iosKodEslesmesi = oncekiPbxproj.match(/CURRENT_PROJECT_VERSION = (\d+);/);
const mevcutAndroidKod = Number(androidKodEslesmesi[1]);
const mevcutIosKod = Number(iosKodEslesmesi ? iosKodEslesmesi[1] : (app.expo?.ios?.buildNumber ?? 16));

// Her iki platformu da en yüksek kodun bir üstüne eşitle
const yeniKod = Math.max(mevcutAndroidKod, mevcutIosKod) + 1;
const yeniSurum = sonrakiSurum(paket.version, process.argv[3], hedef.komut);

console.log(`\n======================================================`);
console.log(`🚀 TRINKOW OTOMATİK RELEASE: ${hedef.ad}`);
console.log(`Sürüm: ${paket.version} → ${yeniSurum} | Build Kodu: ${yeniKod}`);
console.log(`======================================================\n`);

// 3. Testler ve Tip Kontrolleri
console.log('1/6 Testler ve tip kontrolleri çalıştırılıyor…');
calistir('npm', ['test']);
calistir('npm', ['run', 'typecheck']);

// 4. Sürüm Dosyalarını Senkronize Etme
console.log('2/6 Tüm platformlar için sürüm ve build numaraları güncelleniyor…');
paket.version = yeniSurum;
app.expo.version = yeniSurum;
app.expo.android.versionCode = yeniKod;
app.expo.ios.buildNumber = String(yeniKod);
kilit.version = yeniSurum;
if (kilit.packages?.['']) kilit.packages[''].version = yeniSurum;

writeFileSync(paketYolu, `${JSON.stringify(paket, null, 2)}\n`);
writeFileSync(kilitYolu, `${JSON.stringify(kilit, null, 2)}\n`);
writeFileSync(appYolu, `${JSON.stringify(app, null, 2)}\n`);

writeFileSync(
  gradleYolu,
  oncekiGradle
    .replace(/versionCode\s+\d+/, `versionCode ${yeniKod}`)
    .replace(/versionName\s+"[^"]+"/, `versionName "${yeniSurum}"`),
);

for (const [pYolu, pIcerik] of [
  [infoPlistYolu, oncekiInfoPlist],
  [widgetInfoPlistYolu, oncekiWidgetInfoPlist],
]) {
  const guncel = pIcerik
    .replace(/(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+(<\/string>)/, `$1${yeniSurum}$2`)
    .replace(/(<key>CFBundleVersion<\/key>\s*<string>)[^<]+(<\/string>)/, `$1${yeniKod}$2`);
  writeFileSync(pYolu, guncel);
}

const guncelPbxproj = oncekiPbxproj
  .replaceAll(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${yeniSurum};`)
  .replaceAll(/CURRENT_PROJECT_VERSION = \d+;/g, `CURRENT_PROJECT_VERSION = ${yeniKod};`)
  .replaceAll(/TARGETED_DEVICE_FAMILY = "1,2";/g, 'TARGETED_DEVICE_FAMILY = 1;');
writeFileSync(pbxprojYolu, guncelPbxproj);

try {
  // 5. Android Derleme & Yükleme
  console.log('\n3/6 [Android] Native App Bundle (AAB) derleniyor…');
  rmSync(androidAppBuildYolu, { recursive: true, force: true });
  rmSync(androidAppCxxYolu, { recursive: true, force: true });
  calistir(gradlewYolu, [':app:bundleRelease'], { cwd: androidKoku });
  if (!existsSync(aabYolu) || statSync(aabYolu).size === 0) {
    throw new Error('Release AAB üretilemedi.');
  }

  console.log(`4/6 [Android] AAB Google Play (${hedef.androidLane}) kanalına yükleniyor…`);
  calistir('fastlane', ['android', hedef.androidLane], {
    env: {
      GOOGLE_PLAY_JSON_KEY: androidServisAnahtariYolu,
      ANDROID_AAB_PATH: aabYolu,
      ANDROID_VERSION_NAME: yeniSurum,
    },
  });

  // 6. iOS Derleme & Yükleme
  console.log('\n5/6 [iOS] Native Archive & İmzalı IPA üretiliyor…');
  rmSync(archiveYolu, { recursive: true, force: true });
  rmSync(exportKlasoru, { recursive: true, force: true });
  mkdirSync(buildKlasoru, { recursive: true });

  writeFileSync(
    exportOptionsYolu,
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>method</key>
\t<string>app-store-connect</string>
\t<key>teamID</key>
\t<string>${TEAM_ID}</string>
\t<key>signingStyle</key>
\t<string>manual</string>
\t<key>signingCertificate</key>
\t<string>Apple Distribution</string>
\t<key>provisioningProfiles</key>
\t<dict>
\t\t<key>${BUNDLE_ID}</key>
\t\t<string>Trinkow AppStore</string>
\t\t<key>${WIDGET_BUNDLE_ID}</key>
\t\t<string>Trinkow Widget AppStore</string>
\t</dict>
\t<key>uploadSymbols</key>
\t<true/>
</dict>
</plist>
`,
  );

  calistir('xcodebuild', [
    '-workspace',
    workspaceYolu,
    '-scheme',
    'Trinkow',
    '-configuration',
    'Release',
    '-destination',
    'generic/platform=iOS',
    '-archivePath',
    archiveYolu,
    'archive',
  ]);

  calistir('xcodebuild', [
    '-exportArchive',
    '-archivePath',
    archiveYolu,
    '-exportOptionsPlist',
    exportOptionsYolu,
    '-exportPath',
    exportKlasoru,
  ]);

  if (!existsSync(ipaYolu) || statSync(ipaYolu).size === 0) {
    throw new Error('İmzalı Trinkow.ipa üretilemedi.');
  }

  console.log(`6/6 [iOS] IPA App Store Connect (${hedef.iosLane}) kanalına yükleniyor…`);
  calistir('fastlane', ['ios', hedef.iosLane], {
    env: {
      IOS_IPA_PATH: ipaYolu,
      APP_STORE_CONNECT_API_KEY_PATH: iosApiKeyYolu,
      APP_STORE_CONNECT_KEY_ID: KEY_ID,
      APP_STORE_CONNECT_ISSUER_ID: ISSUER_ID,
    },
  });

  console.log(`\n======================================================`);
  console.log(`🎉 BAŞARILI! Sürüm v${yeniSurum} (Build ${yeniKod})`);
  console.log(`🤖 Android: Google Play [${hedef.androidLane}] kanalına yüklendi.`);
  console.log(`🍎 iOS: App Store Connect [${hedef.iosLane}] kanalına yüklendi.`);
  console.log(`======================================================\n`);
} catch (hata) {
  // Geri alma (Rollback)
  console.error('\n⚠️ Hata oluştu! Sürüm dosyaları önceki değerlerine geri alınıyor…');
  writeFileSync(paketYolu, oncekiPaket);
  writeFileSync(appYolu, oncekiApp);
  writeFileSync(kilitYolu, oncekiKilit);
  writeFileSync(gradleYolu, oncekiGradle);
  writeFileSync(infoPlistYolu, oncekiInfoPlist);
  writeFileSync(widgetInfoPlistYolu, oncekiWidgetInfoPlist);
  writeFileSync(pbxprojYolu, oncekiPbxproj);
  console.error('Dosyalar başarıyla geri alındı.\n');
  throw hata;
}

