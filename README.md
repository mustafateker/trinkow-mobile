# Trinkow mobil uygulaması

React Native / Expo + TypeScript. Finansal verinin kaynağı `../backend` içindeki
FastAPI / MongoDB servisidir; Expo tek başına API'yi çalıştırmaz.

## Yerel geliştirme (önerilen)

```bash
cd mobile
npm run dev
```

Bu komut yerel MongoDB'yi `127.0.0.1:27018`, API'yi `0.0.0.0:8000` ve Expo'yu
başlatır. `i` ile iOS simülatörünü açabilir veya telefonda QR kodunu okutabilirsin.
Bilgisayar ve telefon aynı ağda olmalı. Ctrl+C bu komutun başlattığı süreçleri durdurur.
Başka bir Expo zaten açıksa yalnız API için: `python3 ../dev.py --no-app`.

Normal giriş ve kayıt formları e-posta/şifreyi gerçek backend ile doğrular. Yerel
başlatıcı ayrıca **Test hesabıyla devam et** seçeneğini açar; bu seçenek yalnız
geliştirme içindir ve normal formun doğrulamasını gevşetmez. İlk girişte onboarding
gelir.

Google ile giriş Android native geliştirme derlemelerinde desteklenir
(Expo Go native modülü yükleyemediği için kullanılamaz). Mobil build içine hiçbir
OAuth kimliği gömülmemesi politikasıyla Google girişi şu anda Android'de açıktır.
iOS native Google SDK, callback için public iOS istemci kimliğinden türetilen URL
scheme'ini Info.plist'e gömmeyi zorunlu kılar; iOS için sıfır-gömülü-kimlik
yaklaşımı backend aracılı web OAuth akışı gerektirir. Google Cloud Console'da:

- Android istemcisine `com.triworkster.trinkow` paketini ve debug/upload/Play App
  Signing SHA-1 parmak izlerini ekle.
- Web OAuth istemci kimliği yalnız backend'deki `GOOGLE_OAUTH_CLIENT_IDS`
  ayarında tutulur. Mobil uygulama public kimliği `/auth/google/yapilandirma`
  endpoint'inden çalışma anında alır; build içine OAuth kimliği gömülmez.
- Native ayarlar değiştiği için uygulamayı yeniden derle (`npm run android` veya
  `npm run ios`); yalnız Metro'yu yeniden başlatmak yeterli değildir.

Test hesabı da gerçek JWT ve ayrı bir yerel backend kullanır. Veriler
`../backend/.local/data` içinde kalıcı, `trinkow_demo` veritabanındadır. Atlas `.env` ve
mevcut Atlas verileri değiştirilmez.
Yerel MongoDB yalnız bilgisayardan erişilebilir; mobil cihaz API'ye bağlanır.

### İlk kurulum / başka bilgisayar

```bash
npm ci
cd ../backend
python3 -m venv .venv
.venv/bin/pip install -e '.[dev]'
# .env yoksa .env.example'dan oluştur ve JWT_SECRET_KEY'i ayarla.
```

PATH üzerinde `mongod` varsa başlatıcı onu kullanır. Bu çalışma ortamına resmi
MongoDB Community 8.0.30 paketi `../backend/.local/mongodb` içine kuruldu (Git'e girmez).
Başka bir Apple Silicon Mac'te aynı kurulumu yapmak için proje kökünde:

```bash
mkdir -p backend/.local/mongodb
curl -fL https://fastdl.mongodb.org/osx/mongodb-macos-arm64-8.0.30.tgz -o /tmp/trinkow-mongodb.tgz
tar -xzf /tmp/trinkow-mongodb.tgz -C backend/.local/mongodb --strip-components=1
```

Diğer platformlar: [MongoDB resmi kurulum belgesi](https://www.mongodb.com/docs/v8.0/administration/install-community/).

## Atlas / normal giriş

Backend'i kendi `.env` ayarlarıyla `.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0`
ile başlat. `TRINKOW_DEV_LOGIN` varsayılan olarak kapalıdır; normal `/auth/giris`
her zaman gerçek şifre doğrular. İstemciyi `EXPO_PUBLIC_DEV_LOGIN=0 npm start` ile aç.
Üretim derlemesinde istemcinin demo girişi daima kapalıdır.

`EXPO_PUBLIC_API_URL` verilmezse geliştirmede Expo bilgisayarının adresi seçilir;
Android emülatöründe localhost için `10.0.2.2` kullanılır. Farklı bir API için
`.env.example` içindeki açıklamayı izle. Expo tunnel yalnız Metro'yu taşır,
API için ayrıca erişilebilir bir adres gerekir.

## Kontroller

```bash
npm test
npm run typecheck
npx expo-doctor
npx expo export --platform ios --platform android --output-dir /tmp/trinkow-export
cd ../backend
MONGODB_URI=mongodb://127.0.0.1:27018 .venv/bin/python -m pytest -q
```

Backend testleri ayrı `trinkow_test` veritabanını temizler. Özel ad `TEST_DB_NAME`
ile verilir; `_test` ile bitmeli ve uygulamanın veritabanından farklı olmalıdır.
Web hedefi bu mobil projenin kurulu bağımlılıkları arasında değildir.

E-posta ile parola sıfırlama gerçek, süreli ve tek kullanımlık bağlantıyla çalışır;
yerelde backend posta kutusuna, canlı ayarda SMTP'ye gönderilir. Hatırlanan oturum
SecureStore'da tutulur; hatırlanmayan oturum uygulama belleğiyle sınırlıdır.
Google girişi aktiftir. Apple girişi ve gerçek telefon bildirimleri henüz bağlı
değildir; Apple düğmesi iOS'ta pasif gösterilir.

## Google Play test yayınları

İlk bilgisayar kurulumunda servis hesabını ve upload anahtarını bir kez hazırla:

```bash
npm run release:setup -- /tam/yol/google-play-service-account.json
```

Internal testing için hızlı yayın:

```bash
npm run release:internal
```

Kapalı testing (`alpha`) kanalına taslak göndermek için:

```bash
npm run release:closed
```

İki komut da testleri çalıştırır, sürümü ve Android `versionCode` değerini artırır,
release AAB üretir ve yalnız seçilen kanala yükler. Varsayılan artış `patch`tir;
örneğin `npm run release:internal -- minor` veya
`npm run release:closed -- 0.2.0` kullanılabilir. Hedefsiz `npm run release`
bilerek yayın yapmaz ve doğru komutları gösterir.
