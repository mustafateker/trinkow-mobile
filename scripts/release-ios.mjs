import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const paketYolu = resolve(kok, 'package.json');
const kilitYolu = resolve(kok, 'package-lock.json');
const appYolu = resolve(kok, 'app.json');
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
const apiKeyYolu = resolve(kok, '.release-secrets/AuthKey_6JM37H93JC.p8');
const anaProfilYolu = resolve(kok, '.release-secrets/com.triworkster.trinkow.mobileprovision');
const widgetProfilYolu = resolve(kok, '.release-secrets/com.triworkster.trinkow.ExpoWidgetsTarget.mobileprovision');

const BUNDLE_ID = 'com.triworkster.trinkow';
const WIDGET_BUNDLE_ID = 'com.triworkster.trinkow.ExpoWidgetsTarget';
const TEAM_ID = '3RRAH7Q65B';
const KEY_ID = '6JM37H93JC';
const ISSUER_ID = 'c52e6cf6-318d-452a-9a47-82f5b2d39467';

function calistir(komut, args, secenekler = {}) {
  const sonuc = spawnSync(komut, args, {
    cwd: kok,
    stdio: 'inherit',
    shell: false,
    ...secenekler,
    env: { ...process.env, NODE_ENV: 'production', ...secenekler.env },
  });
  if (sonuc.error) throw sonuc.error;
  if (sonuc.status !== 0) throw new Error(`${komut} komutu ${sonuc.status ?? 1} koduyla başarısız oldu.`);
}

const kip = process.argv[2] ?? 'build';
if (!['build', 'testflight'].includes(kip)) {
  console.error('Kullanım: npm run release:ios -- [build|testflight]');
  process.exit(1);
}

const gerekliDosyalar = [apiKeyYolu, anaProfilYolu, widgetProfilYolu, workspaceYolu, pbxprojYolu];
if (gerekliDosyalar.some((yol) => !existsSync(yol))) {
  throw new Error('iOS release dosyaları veya profilleri (.release-secrets/) eksik.');
}

const paket = JSON.parse(readFileSync(paketYolu, 'utf8'));
const app = JSON.parse(readFileSync(appYolu, 'utf8'));
if (app.expo?.ios?.bundleIdentifier !== BUNDLE_ID) {
  throw new Error(`iOS bundleIdentifier ${BUNDLE_ID} olmalı.`);
}

const surum = paket.version;
const kod = Number(app.expo?.android?.versionCode ?? 15);

console.log(`\nTrinkow iOS ${surum} (${kod}) native ${kip} akışı`);
console.log('1/4 Testler ve tip kontrolü çalışıyor…');
calistir('npm', ['test']);
calistir('npm', ['run', 'typecheck']);

console.log('2/4 iOS sürüm bilgileri senkronize ediliyor…');
for (const plistYolu of [infoPlistYolu, widgetInfoPlistYolu]) {
  const icerik = readFileSync(plistYolu, 'utf8')
    .replace(/(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+(<\/string>)/, `$1${surum}$2`)
    .replace(/(<key>CFBundleVersion<\/key>\s*<string>)[^<]+(<\/string>)/, `$1${kod}$2`);
  writeFileSync(plistYolu, icerik);
}
const pbxproj = readFileSync(pbxprojYolu, 'utf8')
  .replaceAll(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${surum};`)
  .replaceAll(/CURRENT_PROJECT_VERSION = \d+;/g, `CURRENT_PROJECT_VERSION = ${kod};`);
writeFileSync(pbxprojYolu, pbxproj);

console.log('3/4 Native iOS Archive ve IPA üretiliyor…');
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

console.log(`\nİmzalı IPA hazır: ${ipaYolu}`);

if (kip === 'testflight') {
  console.log('4/4 IPA App Store Connect (TestFlight) kanalına yükleniyor…');
  calistir('fastlane', ['ios', 'testflight'], {
    env: {
      IOS_IPA_PATH: ipaYolu,
      APP_STORE_CONNECT_API_KEY_PATH: apiKeyYolu,
      APP_STORE_CONNECT_KEY_ID: KEY_ID,
      APP_STORE_CONNECT_ISSUER_ID: ISSUER_ID,
    },
  });
}

