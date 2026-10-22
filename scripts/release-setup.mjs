import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const gizliKlasor = resolve(kok, '.release-secrets');
const servisAnahtariYolu = resolve(gizliKlasor, 'google-play-service-account.json');
const keystoreYolu = resolve(gizliKlasor, 'android-upload-keystore.jks');
const keystoreAyarYolu = resolve(gizliKlasor, 'android-keystore.properties');
const SERVIS_HESABI = 'trinkow-oto-release@trinkow.iam.gserviceaccount.com';
const KEY_ALIAS = 'trinkow-upload';

function calistir(komut, args, env = process.env) {
  const sonuc = spawnSync(komut, args, { cwd: kok, stdio: 'inherit', shell: false, env });
  if (sonuc.error) throw sonuc.error;
  if (sonuc.status !== 0) throw new Error(`${komut} komutu ${sonuc.status ?? 1} koduyla başarısız oldu.`);
}

function komutVarMi(komut) {
  return spawnSync('sh', ['-c', `command -v ${komut}`], { stdio: 'ignore' }).status === 0;
}

if (!komutVarMi('keytool')) throw new Error('Java keytool bulunamadı. JDK 17 kurulmalı.');
if (!komutVarMi('fastlane')) throw new Error('Fastlane bulunamadı. `brew install fastlane` ile kurun.');

const kaynakAnahtar = process.argv[2] ?? process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH;
if (!kaynakAnahtar || !existsSync(resolve(kaynakAnahtar))) {
  console.error('\nGoogle Play servis hesabının indirilen JSON anahtarı gerekli.');
  console.error('Kullanım: npm run release:setup -- /tam/yol/service-account.json');
  process.exit(1);
}

const anahtar = JSON.parse(readFileSync(resolve(kaynakAnahtar), 'utf8'));
if (anahtar.type !== 'service_account' || anahtar.client_email !== SERVIS_HESABI || !anahtar.private_key) {
  throw new Error(`JSON anahtarı ${SERVIS_HESABI} servis hesabına ait değil.`);
}

mkdirSync(gizliKlasor, { recursive: true, mode: 0o700 });
copyFileSync(resolve(kaynakAnahtar), servisAnahtariYolu);
chmodSync(servisAnahtariYolu, 0o600);

if (!existsSync(keystoreYolu)) {
  const disKeystore = process.env.TRINKOW_UPLOAD_KEYSTORE_PATH;
  if (disKeystore) {
    const gerekli = ['TRINKOW_UPLOAD_STORE_PASSWORD', 'TRINKOW_UPLOAD_KEY_PASSWORD', 'TRINKOW_UPLOAD_KEY_ALIAS'];
    const eksik = gerekli.filter((ad) => !process.env[ad]);
    if (eksik.length) throw new Error(`Mevcut keystore için eksik değişkenler: ${eksik.join(', ')}`);
    copyFileSync(resolve(disKeystore), keystoreYolu);
    writeFileSync(
      keystoreAyarYolu,
      `storePassword=${process.env.TRINKOW_UPLOAD_STORE_PASSWORD}\nkeyPassword=${process.env.TRINKOW_UPLOAD_KEY_PASSWORD}\nkeyAlias=${process.env.TRINKOW_UPLOAD_KEY_ALIAS}\n`,
      { mode: 0o600 },
    );
  } else {
    const storePassword = randomBytes(24).toString('base64url');
    const keyPassword = randomBytes(24).toString('base64url');
    calistir('keytool', [
      '-genkeypair', '-v',
      '-storetype', 'JKS',
      '-keystore', keystoreYolu,
      '-alias', KEY_ALIAS,
      '-keyalg', 'RSA',
      '-keysize', '2048',
      '-validity', '10000',
      '-storepass', storePassword,
      '-keypass', keyPassword,
      '-dname', 'CN=Trinkow, OU=Mobile, O=Triworkster, L=Istanbul, ST=Istanbul, C=TR',
    ]);
    writeFileSync(
      keystoreAyarYolu,
      `storePassword=${storePassword}\nkeyPassword=${keyPassword}\nkeyAlias=${KEY_ALIAS}\n`,
      { mode: 0o600 },
    );
  }
}

if (!existsSync(keystoreAyarYolu)) {
  throw new Error('Keystore bulundu ancak android-keystore.properties bulunamadı.');
}
chmodSync(keystoreYolu, 0o600);
chmodSync(keystoreAyarYolu, 0o600);

console.log('\nGoogle Play API erişimi doğrulanıyor…');
calistir('fastlane', ['run', 'validate_play_store_json_key', `json_key:${servisAnahtariYolu}`]);

console.log('\nUpload sertifikası:');
const ayarlar = Object.fromEntries(
  readFileSync(keystoreAyarYolu, 'utf8').trim().split('\n').map((satir) => {
    const ayirici = satir.indexOf('=');
    if (ayirici < 1) throw new Error('Geçersiz android-keystore.properties satırı.');
    return [satir.slice(0, ayirici), satir.slice(ayirici + 1)];
  }),
);
calistir('keytool', [
  '-list', '-v',
  '-keystore', keystoreYolu,
  '-alias', ayarlar.keyAlias,
  '-storepass', ayarlar.storePassword,
]);

console.log('\nNative Android release hazırlığı tamamlandı.');
console.log('Internal testing: npm run release:internal');
console.log('Kapalı testing:   npm run release:closed');
console.log('UYARI: .release-secrets klasörünü güvenli bir yerde yedekleyin; upload keystore kaybedilmemeli.');
