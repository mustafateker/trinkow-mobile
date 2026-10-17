import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const paketYolu = resolve(kok, 'package.json');
const kilitYolu = resolve(kok, 'package-lock.json');
const appYolu = resolve(kok, 'app.json');
const gradleYolu = resolve(kok, 'android/app/build.gradle');
const androidKoku = resolve(kok, 'android');
const gradlewYolu = resolve(androidKoku, 'gradlew');
const androidAppBuildYolu = resolve(androidKoku, 'app/build');
const androidAppCxxYolu = resolve(androidKoku, 'app/.cxx');
const aabYolu = resolve(androidKoku, 'app/build/outputs/bundle/release/app-release.aab');
const servisAnahtariYolu = resolve(kok, '.release-secrets/google-play-service-account.json');
const keystoreYolu = resolve(kok, '.release-secrets/android-upload-keystore.jks');
const keystoreAyarYolu = resolve(kok, '.release-secrets/android-keystore.properties');
const PAKET_ADI = 'com.triworkster.trinkow';
const SERVIS_HESABI = 'trinkow-oto-release@trinkow.iam.gserviceaccount.com';

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

function sonrakiSurum(mevcut, istek = 'patch') {
  if (/^\d+\.\d+\.\d+$/.test(istek)) return istek;
  const parcalar = mevcut.match(/^(\d+)\.(\d+)\.(\d+)$/)?.slice(1).map(Number);
  if (!parcalar || !['patch', 'minor', 'major'].includes(istek)) {
    throw new Error('Kullanım: npm run release -- [patch|minor|major|1.2.3]');
  }
  let [major, minor, patch] = parcalar;
  if (istek === 'major') [major, minor, patch] = [major + 1, 0, 0];
  if (istek === 'minor') [minor, patch] = [minor + 1, 0];
  if (istek === 'patch') patch += 1;
  return `${major}.${minor}.${patch}`;
}

const gerekliDosyalar = [servisAnahtariYolu, keystoreYolu, keystoreAyarYolu, gradlewYolu, gradleYolu];
if (gerekliDosyalar.some((yol) => !existsSync(yol))) {
  console.error('Native release anahtarları eksik. Önce `npm run release:setup -- /tam/yol/service-account.json` çalıştırın.');
  process.exit(1);
}
if (spawnSync('sh', ['-c', 'command -v fastlane'], { stdio: 'ignore' }).status !== 0) {
  throw new Error('Fastlane bulunamadı. `brew install fastlane` ile kurun.');
}

const servisAnahtari = JSON.parse(readFileSync(servisAnahtariYolu, 'utf8'));
if (servisAnahtari.type !== 'service_account' || servisAnahtari.client_email !== SERVIS_HESABI || !servisAnahtari.private_key) {
  throw new Error(`Geçersiz servis anahtarı. ${SERVIS_HESABI} hesabının JSON anahtarı gerekli.`);
}

const oncekiPaket = readFileSync(paketYolu, 'utf8');
const oncekiApp = readFileSync(appYolu, 'utf8');
const oncekiKilit = readFileSync(kilitYolu, 'utf8');
const oncekiGradle = readFileSync(gradleYolu, 'utf8');
const paket = JSON.parse(oncekiPaket);
const app = JSON.parse(oncekiApp);
const kilit = JSON.parse(oncekiKilit);

if (app.expo?.android?.package !== PAKET_ADI) throw new Error(`Android paket adı ${PAKET_ADI} olmalı.`);
if (paket.version !== app.expo.version) {
  throw new Error(`Sürüm dosyaları eşleşmiyor: package.json=${paket.version}, app.json=${app.expo.version}`);
}

const kodEslesmesi = oncekiGradle.match(/versionCode\s+(\d+)/);
if (!kodEslesmesi) throw new Error('android/app/build.gradle içinde versionCode bulunamadı.');
const yeniKod = Number(kodEslesmesi[1]) + 1;
const yeniSurum = sonrakiSurum(paket.version, process.argv[2]);
const eskiSayilar = paket.version.split('.').map(Number);
const yeniSayilar = yeniSurum.split('.').map(Number);
const dahaYeni = yeniSayilar.some((deger, i) => deger > eskiSayilar[i] && yeniSayilar.slice(0, i).every((x, j) => x === eskiSayilar[j]));
if (!dahaYeni) throw new Error(`Yeni sürüm ${paket.version} sürümünden büyük olmalı.`);

console.log(`\nTrinkow ${paket.version} (${kodEslesmesi[1]}) → ${yeniSurum} (${yeniKod}) native kapalı test yayını`);
console.log('1/4 Testler ve tip kontrolü çalışıyor…');
calistir('npm', ['test']);
calistir('npm', ['run', 'typecheck']);

console.log('2/4 Sürüm dosyaları güncelleniyor…');
paket.version = yeniSurum;
app.expo.version = yeniSurum;
app.expo.android.versionCode = yeniKod;
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

try {
  console.log('3/4 Native Android App Bundle derleniyor…');
  // RN yeni mimaride Gradle `clean`, bağımlılıkların Codegen/JNI klasörlerini
  // uygulamanın CMake temizliğinden önce kaldırabiliyor. Eski autolinking dosyası
  // daha sonra bu klasörlere erişince `add_subdirectory ... does not exist` ile
  // release duruyor. Yalnız uygulamanın üretilmiş build/CMake çıktılarını silmek
  // temiz ve yeniden üretilebilir bir derleme sağlar; kaynaklara dokunmaz.
  rmSync(androidAppBuildYolu, { recursive: true, force: true });
  rmSync(androidAppCxxYolu, { recursive: true, force: true });
  calistir(gradlewYolu, [':app:bundleRelease'], { cwd: androidKoku });
  if (!existsSync(aabYolu) || statSync(aabYolu).size === 0) throw new Error('Release AAB üretilemedi.');

  console.log('4/4 AAB Google Play kapalı test kanalına yükleniyor…');
  calistir('fastlane', ['android', 'release'], {
    env: {
      GOOGLE_PLAY_JSON_KEY: servisAnahtariYolu,
      ANDROID_AAB_PATH: aabYolu,
      ANDROID_VERSION_NAME: yeniSurum,
    },
  });
} catch (hata) {
  writeFileSync(paketYolu, oncekiPaket);
  writeFileSync(appYolu, oncekiApp);
  writeFileSync(kilitYolu, oncekiKilit);
  writeFileSync(gradleYolu, oncekiGradle);
  console.error('\nYayın tamamlanamadı; sürüm dosyaları önceki değerlerine geri alındı.');
  throw hata;
}

console.log(`\nTrinkow ${yeniSurum} (${yeniKod}) Google Play kapalı test kanalına gönderildi.`);
console.log(`AAB: ${aabYolu}`);
