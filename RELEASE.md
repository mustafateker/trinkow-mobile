# Trinkow native Android release

Android uygulama kimliği: `com.triworkster.trinkow`

Bu akış EAS Build veya EAS Submit kullanmaz. AAB doğrudan yerel Android Gradle wrapper ile derlenir, yerel upload keystore ile imzalanır ve Fastlane üzerinden Google Play Developer API'ye gönderilir.

`android/` klasörü artık kalıcı native kaynak kodudur. `expo prebuild --clean` çalıştırmak imzalama ve release ayarlarını yeniden üretebileceği için kullanılmamalıdır. Native bir ayar değiştiğinde ilgili Android dosyası doğrudan güncellenmelidir.

## Bir kerelik hazırlık

1. Google Cloud'dan `trinkow-oto-release@trinkow.iam.gserviceaccount.com` hesabına ait JSON anahtarı indirin.
2. Şunu çalıştırın:

   ```bash
   npm run release:setup -- /Users/kullanici/Downloads/service-account.json
   ```

Kurulum:

- Servis hesabı anahtarını doğrular.
- Ayrı bir production upload keystore oluşturur.
- Anahtarları yalnız `.release-secrets/` altında `0600` dosya izniyle saklar.
- Upload sertifikasının SHA-1 ve SHA-256 parmak izlerini ekrana basar.

`.release-secrets/` dizinini güvenli bir parola kasasına yedekleyin. Bu dosyalar git tarafından yok sayılır.

Uygulama daha önce başka bir upload keystore ile Google Play'e gönderildiyse yeni anahtar üretmeyin. Mevcut anahtarı şu değişkenlerle içeri aktarın:

```bash
TRINKOW_UPLOAD_KEYSTORE_PATH=/tam/yol/upload.jks \
TRINKOW_UPLOAD_STORE_PASSWORD='...' \
TRINKOW_UPLOAD_KEY_PASSWORD='...' \
TRINKOW_UPLOAD_KEY_ALIAS='...' \
npm run release:setup -- /tam/yol/service-account.json
```

Google Play Developer API yalnız Play Console'a en az bir AAB/APK elle yüklenmiş mevcut uygulamalarda çalışır. İlk sürümse, aşağıdaki build komutuyla oluşan AAB'yi Play Console'a bir kez elle yükleyin.

## Yayın oluşturma

```bash
npm run release
```

Varsayılan olarak patch sürümü ve Android `versionCode` artırılır:

```text
0.1.0 (1) → 0.1.1 (2)
```

Diğer seçenekler:

```bash
npm run release -- minor
npm run release -- major
npm run release -- 1.0.0
```

Komut sırasıyla testleri çalıştırır, sürümü artırır, `android/gradlew :app:bundleRelease` ile imzalı AAB üretir ve production kanalına gönderir. Yayın başarısız olursa sürüm dosyaları otomatik geri alınır.

Yalnız AAB üretmek için:

```bash
cd android
NODE_ENV=production ./gradlew :app:bundleRelease
```

Çıktı: `android/app/build/outputs/bundle/release/app-release.aab`

## Uygulama içi güncelleme

Yeni sürümler `in_app_update_priority: 5` ile yayınlanır. Play Store'dan kurulmuş eski sürüm açıldığında uygulama yeni sürümü kontrol eder; zorunlu güncelleme penceresindeki **Şimdi güncelle** düğmesi Google Play immediate update akışını başlatır.
