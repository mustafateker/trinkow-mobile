# Trinkow: ürün, akış ve toparlama raporu

Tarih: 2026-10-02 · Yazan: Claude · Kapsam: `trinkow-mobile` (kod okuma + `npm test` 95/95 geçti, `tsc --noEmit` temiz)

> Not: Ekranları cihazda çalıştırıp denemedim. Aşağıdaki bulgular koddan çıkarıldı. Kullanıcı davranışı hakkındaki yorumlar varsayımdır, ölçüm değildir.

## 0. Kararlar (bu sürümde sabitlenenler)

| # | Karar | Sonuç |
|---|---|---|
| K1 | Seri artık yalnızca "o gün kayıt girildi mi" sorusuna bakar. Limiti aşıp aşmadığı seriyi etkilemez. | Bölüm 4 |
| K2 | Önce manuel giriş en iyi hale getirilecek. Sonra yapay zekâ ile geçmiş harcama alışkanlığı analizi ve grafikler eklenecek. | Bölüm 5 |
| K3 | Kategori tahmini yapılacak. | Bölüm 5.2 |
| K4 | Kod temizlenecek, kullanılmayan kod kaldırılacak. | Bölüm 6 |
| K5 | Görsel dil `trinkow-design-kit.md` dosyasına göre olacak. Referans görsel: `85e2d2e8...webp` (koyu lacivert üst alan, açık içerik paneli, coral tek CTA). | Bölüm 7 |

## 1. Uygulama şu an ne yapıyor

Temel fikir: **gelir − sabit giderler − birikim hedefi, kalan güne bölünür, günlük harcama limiti çıkar.** Üstüne eklenenler:

- günlük sayfa (geçmiş günler solda, yatay kaydırma) ve seri (streak)
- rutinler: günlük kahve, sigara gibi kalemler, "almadım" butonu ve rutin tasarrufu
- taksit takibi, kategori limitleri, favoriler, birikim hareketleri
- 3 sekme (Bugün, Tasarruf, Profil), arkasında yaklaşık 20 ekran
- Expo / React Native, veri `trinkow-backend` (FastAPI + MongoDB) üzerinde, yerel SQLite fiilen kullanılmıyor

Çoğu bütçe uygulaması geriye bakar ("ne harcadın"). Trinkow ileriye bakar ("bugün ne kadar harcayabilirsin"). Ürünün ayırt edici yanı bu. Tasarım kiti de aynı vaadi söylüyor: *Günlük limiti gör → harcama ekle → günün kalanını anında gör.*

## 2. Bulgular: kullanıcının benimsemesini zorlaştıran noktalar

### 2.1 İlk değere ulaşma yolu uzun (yüksek risk)
Akış: hesap aç → hedef seç → gelir + 4 sabit gider + hedef + borç → rutinler → plan özeti → ilk harcama. Kullanıcı "bugün X ₺ harcayabilirim" anını ancak bu formdan sonra görüyor. Giriş ekranında "Hesapsız devam et" metni var, ayarlarda "Hesap zorunlu" yazıyor. İkisi çelişiyor.
Öneri: ilk açılışta yalnız gelir + maaş günü sor, limiti hemen göster. Sabit gider ve rutinleri ilk harcamadan sonra, günlük profilleme sorusu mantığıyla (zaten var) sor. Tasarım kiti 7.2 ile uyumlu: 4 adım kalabilir ama adım 2 sadeleşmeli.

### 2.2 Harcama girişi gereğinden uzun
- `app/harcama-ekle.tsx` 708 satır: arama, ürün, tutar, tarih, ödeme, taksit, not.
- Kategori ekranda seçilemiyor, önceki ekrandan param olarak geliyor. Bugün boşsa kullanıcı "Kategori seç" → aşağı kaydır → kategorinin "+" simgesi → tutar → kaydet yapıyor.
- Tasarım kiti 7.3 ve 7.4 bunun tersini söylüyor: ana sayfada 10 satırlık kategori listesi olmayacak, harcama ekleme bottom sheet olacak ve tutar önce gelecek.

### 2.3 Çevrimdışı kayıt yok
Harcama doğrudan API'ye gidiyor (`src/lib/api.ts` `harcamaEkleIstegi`). Ağ yoksa kayıt kaybolur. Manuel giriş ana ürünse en kritik güvenilirlik eksiği bu. `istemciId` zaten var, yerel kuyruk + sonra senkron için temel hazır.

### 2.4 Bildirim sahte
`src/lib/bildirimIzni.ts` sabit `true` dönen stub, `expo-notifications` yüklü değil. Ama Ayarlar'da "Akşam özeti" anahtarı ve saat seçici var. Kullanıcıya verilemeyen bir söz veriliyor. Manuel giriş + seri mekanizmasında hatırlatma retention'ın ana aracı. Seri artık yalnız "kayıt girildi mi"ye bakacağı için akşam hatırlatması (K1 sonrası) daha da anlamlı.

### 2.5 Tasarruf ekranı zor anlaşılıyor
Üç kavram var ve hiçbir yerde toplanmıyor: hesaplanan tasarruf, gerçek birikim, rutin tasarrufu. Dört akordiyon. Kullanıcı "toplam ne kadar biriktirdim" sorusuna tek sayı bulamıyor. Tasarım kiti 7.5: üstte üçlü özet (Harcanabilir / Harcanan / Kalan), kategori dağılımı, diğerleri açılır satır.

### 2.6 Profil ekranı ve gezinme
Profil'de 10'dan fazla satır. Kit 7.6 üç grup öneriyor (Planın, Takip, Hesabın). Metin tutarsızlığı: plan özeti "Profil → Bütçe ve rutinler" diyor, ekranda "Gelir ve bütçe" yazıyor.

### 2.7 Güven ve kapsam boşlukları
- Veri dışa aktarma yok (hesap silme var).
- Yalnız açık tema (`userInterfaceStyle: light`). Kit de açık içerik + koyu header yapısı tanımlıyor, bu yüzden bu bir sorun değil, bilinçli sınır.
- Apple/Google girişi hazır değil. iOS'ta başka sosyal giriş sunulacaksa Apple girişi gerekir.
- Kategoriler sabit 13 tane. Tek hedef, tek cüzdan.

## 3. Rakip farkı ve potansiyel

Fark: limit odaklı, ileriye bakan günlük karar. Büyütülebilecek yönler:
- rutinden vazgeçme tasarrufu ("bu ay kahveden vazgeçerek 420 ₺ biriktirdin") imza özellik olabilir
- taksit ve abonelik takibi
- **K2 ile birlikte:** yapay zekâ destekli alışkanlık analizi (hafta günü kalıpları, kategori eğilimleri, "genelde cuma akşamı harcıyorsun"). Bunun için temiz, tutarlı ve kategorisi doğru veri şart. Bu yüzden kategori tahmini ve hızlı giriş, analizin ön koşulu.

Kullanıcıyla doğrulanmamış kısım: bu özelliklerin gerçek ihtiyaç olup olmadığı. 5-10 kişiye ilk açılış + ilk harcama testi önerilir (ölçü: ilk harcamaya kadar geçen süre).

## 4. Seri değişikliği (K1)

**Yeni kural:** bir gün, o gün en az bir harcama kaydı varsa (veya "harcamasız gün" işaretliyse) seriye sayılır. Limit durumu serinin dışındadır.

Etkilenen yerler (bulunanlar):

| Yer | Şimdi | Yapılacak |
|---|---|---|
| `src/db/seri.ts` `gunSeriDurumu` | `altinda` / `disinda` / `bos` | `girildi` / `bos` (2 durum) |
| `src/db/useGunSecici.ts` | ay ızgarası limite göre boyar | yalnız girildi / bos |
| `src/components/pano/GunlukSayfa.tsx` (~450-460) | "seriye sayıldı/sayılmadı" şeridi `seriyeSayildiMi`'ye bağlı | kayıt var mı'ya bağlanacak |
| `src/components/streak/Legend.tsx`, `MonthGrid.tsx`, `DayStatusBox.tsx` | "limit altında / limit dışı / kayıt yok" | "kayıt girildi / kayıt yok" |
| `src/content/metinler.ts` | `seri.lejant.*`, `seri.kural.*`, `seri.kapali.*` ("Seri için günlük limit gerekir") | yeniden yazılacak. Limit artık şart olmadığı için "Seri kapalı" durumu kalkabilir |
| `app/seri.tsx`, `src/db/useSeriOzet.ts` | sunucudan gelen hesap | sunucu davranışı değişmeli |
| `tests/seriKurali.test.cjs` | mevcut kurala göre | yeni kurala göre güncellenecek |
| **Backend** `trinkow-backend` (`ozet_service`, `gun_izgara_durumu`, `seri_sinir_gunu_belirle`) | seri hesabı sunucuda, "tek otorite" | **Burada da değişmeli.** Yalnız mobil değiştirilirse mobil ile sunucu farklı seri sayısı üretir |

Dikkat: mobilde `gunSeriDurumu` yorumunda "sunucudakiyle birebir aynı saf kural" yazıyor. İki taraf birlikte değişmeli. Mevcut kullanıcılar için seri sayısı yeniden hesaplanınca değişebilir (geçmişte limit aşılan gün serisi kıranlar artık kırmayacak). Bu bilinçli ve olumlu bir geçiş, ama "en uzun seri" kalıcı kayıt (ratchet) olduğu için ayrıca düşünülmeli.

Yan fayda: limit tanımsız (limitsiz kip) kullanıcılar da seri kazanabilir. Kırmızı = suçluluk olmasın ilkesiyle (kit bölüm 1) uyumlu.

## 5. Manuel giriş: en iyi hale getirme (K2, K3)

### 5.1 Hedef akış
`Bugün → Harcama ekle → tutar yaz → (kategori önerilir) → Kaydet`. Tasarım kiti 7.4: tutar önce, kategori grid'i en çok 8 öğe, tarih ve not isteğe bağlı, sabit alt CTA.

Yapılacaklar:
1. Harcama ekleme bottom sheet'e taşınır (şu an modal ekran). Kategori yine seçilebilir olur (REV2'deki "kategori seçilemez" kararı bununla değişir, çünkü tahmin + düzeltme akışı bunu gerektirir).
2. Ana sayfadaki kategori listesi kalkar. Yerine "Sık kullanılanlar" chip'leri gelir.
3. Boş durum metni kit'teki gibi kısalır: "Henüz harcama eklemedin."
4. Kayıt sonrası sheet kapanır, kalan tutar güncellenir, toast: "125 ₺ kafe harcaması eklendi."
5. Çevrimdışı kuyruk (bkz. 2.3). Manuel girişin güvenilirliği olmadan analiz için veri toplanamaz.
6. Gerçek bildirimler (akşam özeti / "bugün kayıt girmedin" hatırlatması).

### 5.2 Kategori tahmini (K3)
Mevcut zemin: `src/db/urunKategori.ts` (kullanıcı başına öğrenilen ürün → kategori), `src/content/urunKatalogu.ts` + `src/lib/urunArama.ts` (hazır katalog), `sikAlinanlar`. Yani tahminin yarısı zaten var, yalnız ekranda "seçilemez" olduğu için görünmüyor.

Önerilen sıra (ucuzdan pahalıya, her adım bir öncekinin yedeği):
1. **Kişisel geçmiş:** yazılan ürün adı daha önce kaydedilmişse o kategori (`tumOgrenilenKategoriler`).
2. **Katalog eşleşmesi:** `katalogAra` ile Türkçe normalize edilmiş eşleşme (zaten var).
3. **Bağlam sezgisi:** saat + tutar aralığı + kullanıcının geçmiş dağılımı (ör. 08-10 arası, 40-120 ₺ → kafe). Basit bir sıklık tablosu yeter.
4. **Güven eşiği:** düşükse kategori önerilmez, kullanıcıdan seçmesi istenir. Yanlış tahmin sessizce kaydedilmez, her zaman tek dokunuşla düzeltilebilir chip olarak gösterilir.
5. Kullanıcı düzeltince `urunKategori` öğrenir (geri bildirim döngüsü).

Neden önemli: yapay zekâ analiz katmanı yanlış kategorili veriyle yanlış sonuç üretir. Tahmin kalitesi doğrudan analiz kalitesidir. Düzeltme oranını (öneri kabul/ret) ölçmek, ileride AI katmanının ne kadar gerektiğini de söyler.

### 5.3 Yapay zekâ analiz katmanı (sonraki faz, planlama notu)
- Önce deterministik analizler (hafta günü kalıpları, kategori eğilimi, ay karşılaştırma). Bunlar AI gerektirmez, grafikle gösterilir. AI ancak yorum ve öneri metni için devreye girmeli.
- Grafik kütüphanesi: projede `react-native-svg` var. Kütüphane eklemeden çizilebilir, ama karar sonra.
- Gizlilik: harcama verisi bir LLM'e gidecekse bunu açıkça belirt ve gizlilik metnini güncelle (`app/legal.tsx`). Veri minimizasyonu: ham not metni yerine kategori + tutar + gün özeti gönder.
- Önkoşul: temiz veri (5.2), çevrimdışı kuyruk (2.3), tutarlı seri/kayıt alışkanlığı (K1).

## 6. Kod temizliği (K4)

Doğrulananlar ve yapılacaklar:

| Konu | Durum | Aksiyon |
|---|---|---|
| SQLite | Düzeltme: harcama tablosu zaten şemadan kalkmış. Yerelde yalnız `ayar` tablosu (ipucu/profilleme bayrakları) canlı | `expo-sqlite` gerekli, kaldırılmadı |
| Yönlendirme stub'ları | `app/tanisma.tsx`, `app/plan.tsx`, `app/kayitlar.tsx` yalnız `<Redirect>` | Hiçbir link kalmadıysa sil. `_layout.tsx` içindeki `Stack.Screen` kayıtlarını da kaldır |
| Kopya UUID üretici | `harcama-ekle.tsx` ve `revApi.ts` içinde aynı satır | Tek yardımcıya taşı |
| Ham API çağrısı ekranda | `harcama-ekle.tsx` içinde `istek('/butce/rutinler...')` | `revApi`'ye taşı |
| Bildirim stub'ı | `bildirimIzni.ts` | Gerçek uygulamaya çevrilecek (5.1/6) ya da ayarlardaki anahtar kalkacak |
| Eski metinler | `metinler.ts`: `giris.test_modu`, `giris.sifirlama_yok`, `giris.hesapsiz`, `giris.sosyal_yok` vb. | Kullanılıp kullanılmadığını tarayıp kullanılmayanları sil (ben doğrulamadım) |
| İç not yorumları | `K-082`, `BE-6c`, `D-2c-1` gibi etiketler yorumlarda çok | Yeni birinin anlayacağı sade yorumlara indir. Kritik "neden" bilgilerini koru |
| Büyük dosyalar | `metinler.ts` 1815, `harcama-ekle.tsx` 708, `api.ts` 658 satır | Alana göre böl |
| Seri hesabı | bkz. Bölüm 4 | K1 ile sadeleşir |

Sıra önerisi: temizliği tasarım değişikliğinden **önce** yap. Çünkü yeniden tasarım ekranların çoğuna dokunacak. Ölü kodu önce atmak yeniden yazılacak yüzeyi küçültür. Her adım sonrası `npm test` + `npm run typecheck`.

## 7. Tasarım: `trinkow-design-kit.md` uyumu (K5)

Referans görselden (Modychat örneği) alınacak ilkeler:
- Koyu lacivert üst alan, içinde başlık ve segmentli mini tab. Altında büyük köşe yarıçaplı açık panel.
- Kompakt liste satırları (renkli küçük ikon kutusu + iki satır metin + sağda değer).
- Tek coral/pembe CTA. Köşede küçük yuvarlak FAB.
- Kopyalanmayacak olan: sohbet içeriği. Yalnız yüzey dili, ritim ve renk.

Mevcut durumla fark:
- Koda bakınca bileşenler `Clay*` (ClaySurface, ClayPressable, ClayKeypad, ClaySwitch) üzerine kurulu. Kit bunu açıkça bırakmayı söylüyor ("neumorphic/kabartmalı" yok, gölge çok az). Bu, ~100 bileşenlik sistemde en büyük görsel iş.
- Font zaten Plus Jakarta Sans. Kit 3 ağırlık yerine 700/750 kullanıyor. 750 ağırlığı bu font paketinde yok, en yakın `800ExtraBold` ya da `700Bold` seçilecek.
- Renk tokenları (`src/theme/tokens.ts`, `brand.ts`) kitteki paletle (`ink-950 #171C42`, `primary #5C5AF6`, `action #F45B6B` ...) eşleştirilecek. `app.json` splash rengi (`#171C42`) zaten kit ile uyumlu.
- Kitle çelişen ya da tamamlanması gereken yerler:
  1. Kit 7.4 kategori grid'ini harcama sheet'ine koyuyor. Mevcut kod kategoriyi kaldırmış. Tahmin akışı (5.2) bu ikisini birleştirir: tahmin edilen kategori öne çıkar, grid'den değiştirilir.
  2. Kit Profil'de "Hesabın: Bildirimler" satırı istiyor. Bildirim şu an stub (2.4), önce gerçek olmalı.
  3. Kit "Seri" satırını Takip grubunda tutuyor. K1 ile uyumlu, değişiklik gerekmiyor.
  4. Kit boş durum metnini "Henüz harcama eklemedin." yapıyor. Mevcut "İlk kahve iyi bir başlangıç." bundan farklı, kit kazanır.
  5. Kit "gauge varsayılan görünümden çıkar" diyor. `LimitGauge.tsx` Bugün ekranından çıkacak, kalırsa analiz ekranlarında küçük görsel olarak.

Kit'in önerdiği uygulama sırası geçerli: tokenlar + app shell + tab bar → Bugün → harcama sheet → diğer ekranlar.

## 8. Önerilen yol haritası

| Faz | İçerik | Not |
|---|---|---|
| 1 | Ölü kod ve eski metin temizliği (Bölüm 6) | Küçük, düşük risk, sonraki işleri kolaylaştırır |
| 2 | Seri kuralı değişikliği, mobil + backend birlikte (Bölüm 4) | Backend repo'su ayrı (`../trinkow-backend`) |
| 3 | Design kit: tokenlar, shell, tab bar, Bugün ekranı (Bölüm 7) | Diğer ekranlara referans olur |
| 4 | Harcama ekleme sheet'i + kategori tahmini (5.1, 5.2) | Faz 3'ün sheet bileşenine bağlı |
| 5 | Çevrimdışı kuyruk + gerçek bildirimler | Manuel girişin güvenilirliği |
| 6 | Tasarruf, Profil, onboarding sadeleştirme (2.1, 2.5, 2.6) | Kit ekranlarına göre |
| 7 | Alışkanlık analizi + grafikler, ardından AI yorumları (5.3) | Faz 1-5 tamamlanmadan başlama |

## 9. Açık sorular

1. Seri geçişinde mevcut kullanıcıların serisi yeniden mi hesaplansın, yoksa yalnız bugünden sonrası yeni kurala mı tabi olsun?
2. Backend repo'sunda bu değişiklikleri de ben mi yapayım?
3. `expo-sqlite` yerel ayarlar için gerçekten gerekli mi, yoksa tamamen kaldırılabilir mi? (kontrol edilecek)
4. Kategori tahmini için bağlam sezgisi (saat/tutar) ilk sürümde olsun mu, yoksa yalnız geçmiş + katalog mu?

## 10. Uygulananlar (2026-10-02)

Doğrulama: `npm test` 95/95, `tsc --noEmit` temiz, `expo export --platform ios` başarılı. Ekranları cihazda çalıştırıp görsel olarak denemedim.

**Kod temizliği (14 dosya, yaklaşık 970 satır silindi)**
- Kullanılmayan 16 dosya silindi: `CategoryValueRow`, `ClayKeypad`, `FactStrip`, `FrequencyChips`, `LimitGauge`, `ProgressBar`, `ResetSentCard`, `ShareBar`, `ShareRow`, `Slider`, `SuggestionTag`, `WeekStrip`, `pano/CategoryLimitCard`, `tasarruf/BudgetCard`, `lib/gruplama`, `lib/yonlendirme`.
- Yönlendirme stub'ları silindi: `app/tanisma.tsx`, `app/plan.tsx`, `app/kayitlar.tsx`. Ayarlar'daki iki bağlantı doğrudan `/rutinler` ve `/butce`'ye çevrildi, `_layout.tsx` kayıtları ve ilgili test güncellendi.
- Hiçbir yerde çağrılmayan 69 fonksiyon/sabit (çoğu `metinler.ts` içinde) ve 278 kullanılmayan metin anahtarı silindi. `ob.niyet.*` dinamik kullanıldığı için korundu.
- Kullanılmayan import ve yerel fonksiyonlar temizlendi. Kullanılmayan `share`, `slider`, `gauge` tokenları kaldırıldı.
- `harcama-ekle.tsx`: kopya UUID üretici ve ham `istek(...)` çağrısı kaldırıldı (`yeniId`, `routinesGet` kullanılıyor).

**Tasarım kiti uyumu**
- Zaten uygulanmış olanlar: tokenlar, koyu header + açık panel, alt dock, Tasarruf özet satırı, Profil'in koyu header'ı.
- **Bugün:** `HeroCard` kit 7.3'e göre yeniden yazıldı (etiket, tek büyük tutar, ince ilerleme çubuğu, tek cümle; halka ve üçlü değer kaldırıldı). Bugün büyük tutar kalan, limitsiz gün ve geçmiş günde harcanan. Tek coral CTA "Harcama ekle" her zaman görünür. "Bugünün hareketleri" son 3 kaydı gösterir, "Tümünü gör" ile açılır. "Sık kullanılanlar" chip'leri tek dokunuşla formu tutar ve kategoriyle açar. Rutin bölümü ve kategori listesi (limit + hızlı ekleme) aşağıda kalır, kategori listesi artık kapalı bir açılır kaptır. İşlevler korundu.
- **Harcama ekle:** kategori artık formda seçilebiliyor (`CategoryPicker`), param ya da seçilen ürün ön-seçim veriyor.
- **Profil:** gruplar kit'teki gibi Planın / Takip / Hesabın oldu (Favoriler Planın'a, Taksitler Takip'e taşındı).
- **Metinler:** "Bugün kalan", "Henüz harcama eklemedin." gibi kit tonuna çekildi.

**Bilerek yapılmayanlar**
- Seri kuralı değişikliği (K1) ve kategori tahmini (K3): bunlar "UI ve temizlik" kapsamı dışında kaldı. Seri için backend de değişmeli.
- Yorumlardaki `K-0xx` / `BE-6c` iç etiketlerinin sadeleştirilmesi: çok sayıda ve davranışa dokunmayan bir iş, ayrı bir tur olarak bırakıldı.
- Çevrimdışı kuyruk ve gerçek bildirimler.
- Onboarding ve giriş/kayıt ekranlarının kit 7.1/7.2'ye göre gözden geçirilmesi.

## 11. Kategori tahmini (uygulandı)

- **Modül:** `src/lib/kategoriTahmin.ts` (saf fonksiyon, ağ bilmez). Sıra: öğrenilmiş eşleme → kullanıcının geçmişinde aynı ürün → katalog (tam ad, adın içinde geçen kalem, tek kategorili ön ek) → bağlam (benzer saat ve tutardaki geçmiş kayıtların oyu). Güven eşiği 0,6; altında tahmin dönmez.
- **Veri:** son 200 kayıt `GET /harcama/` ile çekilir (`tahminGecmisi`, taksit satırları hariç). Backend'e değişiklik gerekmedi: öğrenme zaten sunucuda, kayıt sırasında ürün adı verilince otomatik öğreniliyor.
- **Form:** `harcama-ekle` kategori param'ı yoksa tahmini ön-seçer ve "Tahmin: X. Yanlışsa değiştir." notunu gösterir. Param, ürün seçimi ya da elle seçim kategoriyi kilitler, sonra tahmin ezmez. Bugün ekranındaki "Harcama ekle" butonu artık kategori göndermiyor.
- **Test:** `tests/kategoriTahmin.test.cjs`, 13 senaryo.
- **Bilinen sınır:** kullanıcı yanlış tahmini fark etmeden kaydederse sunucu o ürün adını yanlış kategoriyle öğrenir. Öğrenmeyi yalnız elle seçilen/onaylanan kategoriyle sınırlamak ayrı bir backend kararı.

## 12. Tasarruf ve Profil düzenlemeleri (uygulandı)

- **Tasarruf:** "Gerçek birikim" bölümü artık çerçevesiz ve en üstte tek büyük "Toplam birikim" sayısı var (altında bu ayın hareketi, hedef çubuğu, "Birikim hareketi ekle"). Son hareketler hemen altında. "Kategori dağılımı" bottom sheet'ten çıkarılıp sayfada açık gösteriliyor (en çok 5 satır + "Tümünü gör"). "Rutin tasarrufu" açılır satıra döndü. "Aylık analiz" satırları ve ikinci bottom sheet kaldırıldı. Üç tasarruf kavramı hâlâ toplanmıyor, yalnız sayfada ayrı bölümlerde duruyor.
- **Profil:** Gruplar Planın / Takip / Hesabın. Onboarding'deki "Profil → Bütçe ve rutinler" metni gerçek satır adına ("Gelir ve bütçe") düzeltildi.
