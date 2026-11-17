# Trinkow iOS — App Store İnceleme Uyum Denetimi (Tamamlandı ✅)

Kapsam: `trinkow-mobile` kodu, iOS native yapılandırması (`Info.plist`, `entitlements`, `PrivacyInfo.xcprivacy`), `trinkow-backend` Apple OAuth iptal akışı ve App Store Connect metadata'sı.

---

## ✅ Çözülen Kritik Maddeler

### 1. ✅ Şans Çarkı iOS'ta Kaldırıldı (Android'de Korundu) — 5.6, 3.1.2
- `app/premium.tsx` içinde `HediyeCarki` bileşeni yalnızca Android'de (`Platform.OS !== 'ios' && kaynak === 'onboarding'`) gösterilecek şekilde sınırlandırıldı.
- iOS'ta kullanıcı doğrudan abonelik ekranını görür; çarktaki "Bugüne özel" ifadesi de "Sana özel" olarak dürüstleştirildi.

### 2. ✅ Ücretsiz Planda Reklam / Sponsorlu Alan Entegrasyonu (iOS & Android) — 5.6, 3.1.2(c), 2.3.1
- `src/components/ReklamSeridi.tsx` bileşeni oluşturuldu ve Günlük panoya (`GunlukSayfa.tsx`) entegre edildi.
- Ücretsiz plandaki kullanıcılar hem iOS hem Android'de uygulama tasarımını bozmayan, açıkça `REKLAM / AD` etiketli tanıtım kartını ve `Reklamları kaldır` bağlantısını görür.
- Kullanıcı Trinkow Premium'a geçtiğinde (`uyelik.premium === true`) reklam alanı otomatik olarak gizlenir; böylece "Reklamsız kullanım" vaadi inceleme sırasında birebir doğrulanabilir hale getirildi.

### 3. ✅ Hesap Silinirken Sign in with Apple Token İptali (`/auth/revoke`) — 5.1.1(v)
- **Mobil (`src/lib/sosyalGiris.ts`, `src/lib/api.ts`, `app/giris.tsx`):** Apple ile girişte `identityToken` yanında `authorizationCode` da alınarak `POST /auth/apple` uç noktasına (`authorization_code`) iletilir.
- **Backend (`trinkow-backend/app/modules/auth/apple_kimlik.py`, `auth_service.py`):** Giriş sırasında `authorization_code` Apple'ın `https://appleid.apple.com/auth/token` servisiyle takas edilerek `refresh_token` saklanır; kullanıcı hesabını sildiğinde (`DELETE /auth/hesap`) Apple'ın `https://appleid.apple.com/auth/revoke` REST API'sine iptal isteği gönderilir.

### 4. ✅ Gizlilik Politikası ve `PrivacyInfo.xcprivacy` Güncellendi — 5.1.1(i), 5.1.2
- `src/content/legal/gizlilik.ts` ve `trinkow-backend/app/core/yasal.py` içinde **Apple ile Giriş (Sign in with Apple)**, hesap silindiğinde Apple erişim belirtecinin iptal edilmesi ve **PostHog** ürün analitiği/hata takibi açıkça belgelendi.
- `ios/Trinkow/PrivacyInfo.xcprivacy` içindeki `NSPrivacyCollectedDataTypes` dizisi (`EmailAddress`, `UserID`, `OtherFinancialInfo`, `PurchaseHistory`, `ProductInteraction`, `CrashData` — `Tracking: false`) eksiksiz dolduruldu.

### 5. ✅ iPad Ekran Görüntüleri ve Dikey Tablet Uyarlaması — 2.3.3
- App Store Connect'te 11 dilin tamamında `APP_IPAD_PRO_3GEN_129` (13" iPad) ekran görüntüsü setlerinin yüklü olduğu API üzerinden doğrulandı.
- Uygulama iPad'de tam ekran dikey (Portrait) ve ortalı (`maxWidth: 540`) duyarlı yerleşimle çalışıyor.

---

## ✅ Çözülen Orta Risk Maddeleri

| # | Konu | Rehber | Çözüm |
|---|---|---|---|
| 6 | iOS içinde "Google Play / Android" geçmesi | 2.3.10 | `app/legal.tsx` içinde `platformaUyarla` filtresi eklendi; iOS'ta açılan yasal metinlerde yalnızca `App Store`, `iOS Keychain` ve `iOS` ifadeleri gösterilir. |
| 7 | RevenueCat & Fallback Paywall | 3.1.2 | Geri Yükle butonu, dönem bilgisi, Kullanım Koşulları ve Gizlilik Politikası bağlantıları eksiksiz mevcut. |
| 8 | Kullanılmayan izin metinleri | 5.1.1(ii) | `app.json` ve `ios/Trinkow/Info.plist` içinden kullanılmayan `NSPhotoLibrary*` ve `NSFaceIDUsageDescription` anahtarları kaldırıldı; mikrofon ve konuşma tanıma izin metinleri TR + EN açıklamalı hale getirildi. |
| 9 | Akşam özeti bildirimi sorusu | 2.1 / 5.6 | `src/components/ProfilingHost.tsx` içinde bildirim altyapısı olmadan sorulan `bildirim` sorusu devre dışı bırakıldı. |
| 10 | "Tek dokunuşla iptal" ifadesi | 2.3.1 | 11 dil paketinin tamamında `premium.guvence.iptal` metni "tek dokunuşla / with one tap" ifadesinden arındırıldı (`{magaza} üzerinden istediğin zaman iptal et`). |
| 11 | App Store Connect Metadata & Review Notes | 2.1 / 4.8 / 5.1.1(v) | App Store Connect API üzerinden: (1) `en-US` açıklamasındaki yazım hatası (`Routine Savings Routine Savings & Real Accumulationa`) düzeltildi, (2) İnceleme notlarındaki yanıltıcı `"Sign in with Google"` ifadesi kaldırıldı, hesap zorunluluğu gerekçesi ve Apple token iptali açıklaması eklendi. |
