# Trinkow — Modern Mobile UI Design Kit

> Claude için uygulama talimatı. Bu dosyayı Trinkow arayüzünü yeniden tasarlarken tek görsel kaynak olarak kullan. Mevcut ekranlardaki tüm işlevleri koru; görsel hiyerarşiyi ve bilgi yoğunluğunu bu kitteki kurallara göre sadeleştir.

## 1. Ürün özeti ve tasarım hedefi

Trinkow, kapsamlı muhasebe veya bütçe takip ürünü değildir. Kullanıcının gün içinde yaptığı harcamayı yaklaşık **10 saniye içinde fark etmesini** sağlayan, yargılamayan kişisel para farkındalığı uygulamasıdır.

Ana döngü:

`Günlük limiti gör → harcama ekle → günün kalanını anında gör`

Uygulamanın tasarım hissi şu olmalı:

- Referanstaki modern mobil ürün estetiği: temiz, kontrollü, premium ve sakin.
- Ana sayfada tek güçlü odak: **bugün kalan tutar**.
- Koyu lacivert navigasyon alanları + açık, havadar içerik yüzeyleri.
- Canlı renkler sadece yön bulma, kategori ve kritik durumlar için kullanılır; ekranda aynı anda çok sayıda vurgu rengi kullanılmaz.
- Kısa metinler, okunaklı sayılar, yumuşak ama zayıf olmayan kontrast.
- “Finans uygulaması” kadar güven veren fakat banka uygulaması kadar soğuk görünmeyen bir arayüz.

### Kesinlikle kaçınılacaklar

- Her öğeyi büyük beyaz, aşırı yuvarlatılmış ve yoğun gölgeli kartlara koyma.
- Aynı ekranda gauge, büyük özet kartı, açıklama kutusu, kategori kartı ve rutin kartını art arda kullanma.
- Tüm yüzeyleri açık maviye boyama veya her input'u kabartmalı/neumorphic gösterme.
- Büyük başlıklar ile uzun açıklama metinlerini aynı anda kullanma.
- Kırmızıyı suçluluk, hata veya kullanıcının “başarısızlığı” anlamında kullanma.
- Emoji, slogan bombardımanı, “harika gidiyorsun!” tarzı yapay motivasyon dili kullanma.

## 2. Görsel yön: referanstan alınan ilkeler

Referanstaki stile sadık kalınacak noktalar:

1. **Koyu üst alan:** Sayfa üstünde güçlü bir lacivert/indigo navigasyon veya başlık bölgesi kullan. Bu alan app bar, sekme ve hızlı eylemler için bir görsel çerçeve sağlar.
2. **Açık içerik katmanı:** Koyu alanın altından başlayan kırık beyaz yüzey; büyük bir üst köşe yarıçapı ile ana içerik bölgesini oluşturur.
3. **Kompakt listeler:** Satırlar düz, rahat aralıklı ve taranabilir olmalı. Her satırda küçük renkli ikon bloğu, iki satır metin ve gerektiğinde sağda tutar/chevron bulunur.
4. **Net aktif durum:** Seçili sekme, kategori veya tab; dolu arka plan ve belirgin yazı rengiyle görünür. Sadece ince sınırla seçili durum yaratma.
5. **Tekil parlak CTA:** Bir ekranda yalnızca bir tane birincil aksiyon düğmesi olsun. Coral/pembe aksan, yalnızca bu CTA veya önemli kaydet/onay eylemlerinde kullanılır.
6. **Renkli küçük işlev blokları:** Kategori ikonları, filtre veya kısa aksiyonlar için küçük kare/pill alanlar kullan; büyük renkli kartlar kullanma.

Referanstaki sohbet ürününü kopyalama. Trinkow'a ait içerik, ikonografi ve finans davranışları korunmalı; sadece hiyerarşi, ritim, renk kullanımı ve yüzey dili benimsenmeli.

## 3. Renk sistemi

Bu palet önceki tek-ton açık mavi görünümü değiştirir. Açık arka plan ile koyu navigasyon kontrastı, uygulamayı daha modern ve daha az amatör gösterir.

| Token | Değer | Kullanım |
|---|---:|---|
| `ink-950` | `#171C42` | Üst bar, koyu tab bar, ana koyu yüzey |
| `ink-800` | `#272F66` | Başlıklar, seçili ikon/yazı |
| `ink-600` | `#56618F` | İkincil metin, pasif ikon |
| `canvas` | `#F5F6FC` | Uygulama arka planı |
| `surface` | `#FFFFFF` | Kart, alt sheet, input yüzeyi |
| `surface-soft` | `#EEF0FA` | Nötr ikon zeminleri, pasif sekmeler |
| `line` | `#E3E6F2` | Ayraçlar, input sınırları |
| `primary` | `#5C5AF6` | Ana etkileşim, seçili durum, progress |
| `primary-soft` | `#ECEBFF` | Primary'nin soluk yüzeyi |
| `action` | `#F45B6B` | Birincil Kaydet/Ekle CTA; günde en fazla 1 görünür kullanım |
| `action-pressed` | `#DE4558` | CTA pressed state |
| `success` | `#20A876` | Limit içinde/olumlu doğrulama |
| `success-soft` | `#E2F6ED` | Başarı ikonu zemini |
| `warning` | `#D88718` | Limit yaklaşıyor veya aşıldı; yargılayıcı olmayan uyarı |
| `warning-soft` | `#FFF2DB` | Uyarı yüzeyi |
| `category-blue` | `#4B87FF` | Ulaşım, genel |
| `category-purple` | `#7D60E8` | Abonelik, eğitim |
| `category-orange` | `#F39B42` | Kafe, restoran |
| `category-green` | `#29AD7B` | Market, sağlık |
| `category-pink` | `#E96881` | Eğlence, giyim |

### Renk kullanım oranı

- Ekranın yaklaşık %70'i `canvas` ve `surface` tonlarıdır.
- Koyu lacivert tek bir navigasyon/başlık alanı ile sınırlıdır.
- `primary` yalnızca etkileşim ve seçili durum içindir.
- `action` yalnızca kullanıcıyı ileri götüren birincil eylemde kullanılır. Aynı ekranda `primary` ve `action` ile iki güçlü CTA yarışmaz.

## 4. Tipografi

**Birincil font: Plus Jakarta Sans.** Google Fonts'tan yüklenebiliyorsa bu fontu kullan. Yüklenemiyorsa `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` fallback kullan.

Bu font, güncel uygulama hissi verir; rakamları temiz, Türkçe karakterleri rahat okunur ve başlıklarda amatörleşmeden karakterlidir.

| Stil | Boyut / satır | Ağırlık | Kullanım |
|---|---|---:|---|
| `display` | 36 / 42 | 750 | Bugün kalan tutar (yalnızca ana ekranda) |
| `h1` | 28 / 34 | 750 | Sayfa başlığı |
| `h2` | 20 / 26 | 700 | Bölüm başlığı |
| `title` | 16 / 22 | 700 | Liste satırı, kart başlığı |
| `body` | 15 / 22 | 500 | Normal açıklama |
| `caption` | 13 / 18 | 500 | İkincil bilgi, tarih, durum |
| `amount-lg` | 32 / 38 | 750 | Özet değer |
| `amount-sm` | 16 / 22 | 750 | Liste satırı tutarı |

- Tüm para değerlerinde tabular numerals kullan: `font-variant-numeric: tabular-nums`.
- Başlıkta tek satıra sığmayan metni küçültme; gerekirse iki satıra izin ver.
- Gövde metni `ink-600`; başlık ve tutarlar `ink-800` kullanır.
- Ekranlarda metin uzunluğunu azalt; açıklama görünür bir karara yardım etmiyorsa gösterme.

## 5. Yerleşim, ölçü ve yüzey kuralları

### Telefon çerçevesi

- Hedef genişlik: 390–430 px (iPhone Pro/Pro Max ölçeği).
- Minimum yatay padding: 20 px; standart: 24 px.
- Üst güvenli alanı koru. İçerik başlığı, status bar altından en az 16 px başlasın.
- Sticky alanlar (bottom navigation / primary CTA) safe area padding içermeli.

### 8 px grid

`4, 8, 12, 16, 20, 24, 32, 40, 48` dışında rastgele boşluklar kullanma.

| Alan | Değer |
|---|---:|
| Sayfa yatay boşluğu | 24 px |
| Bölüm arası | 32 px |
| Başlık–içerik arası | 16 px |
| Liste satırı dikey padding | 14–16 px |
| Kart içi boşluk | 16–20 px |
| Input yüksekliği | 52 px |
| Birincil buton yüksekliği | 52 px |
| Bottom nav yüksekliği | 72 px + safe area |

### Köşe yarıçapları

- Ana içerik yüzeyi / bottom sheet: `28 px`
- Özet kartı: `24 px`
- Normal kart veya input: `16 px`
- Küçük ikon kutusu: `12 px`
- Pill, segmented control, CTA: `999 px`

### Gölge ve sınır

Gölge çok az kullanılmalı. Eski tasarımdaki gibi her kartta kalın, açık mavi halo oluşturma.

```css
--shadow-float: 0 12px 30px rgba(23, 28, 66, 0.12);
--shadow-nav: 0 -8px 24px rgba(23, 28, 66, 0.10);
--shadow-subtle: 0 2px 8px rgba(23, 28, 66, 0.06);
```

- Normal kart: 1 px `line` border **veya** `shadow-subtle`; ikisini aynı anda gereksiz biçimde ağır kullanma.
- Modal/bottom sheet: `shadow-float`.
- Tıklanabilir satırlar hover/pressed durumda `surface-soft` alır; büyük gölgeyle zıplamaz.

## 6. Temel bileşenler

### A. Koyu app header

Sayfanın üst bölümünde `ink-950` arka plan kullan. Header içinde:

- Solda kısa selamlama veya sayfa etiketi.
- Alt satırda 28 px `h1` sayfa başlığı.
- Sağda tek dairesel ikon butonu: tarih, ayarlar veya bildirim.
- İsteğe bağlı 3–4 segmentli mini tab: `Bugün | Geçmiş` veya `Harcama | Gelir`.

Header boyunca çok sayıda bilgi verme. Bir sayfada başlık, filtre ve sekme gerekiyorsa, başlık koyu alanda; sekme açık yüzeyin üst sınırında yer alır.

### B. Ana içerik paneli

Header'ın altından başlayan `surface` paneli, üst köşelerde 28 px yarıçapa sahip. Sayfanın geri kalanı bu panelde akar. Bu yapı, her şeyi bağımsız kartlara bölmeden düzen yaratır.

### C. Birincil CTA

- Yükseklik: 52 px; tam genişlik veya listede küçük kare floating action button.
- Renk: `action`.
- Metin: beyaz, 16 px / 700.
- Örnekler: `Harcama ekle`, `Kaydet`, `Devam`.
- CTA metni fiille başlar; `Kategori seç` gibi ara seçimler primary outline/secondary olabilir.

### D. Secondary button

- `surface-soft` arka plan, `ink-800` metin.
- Border yok; pressed'te `#E2E5F5`.
- Örnekler: `Tümünü gör`, `Düzenle`, `Daha sonra`.

### E. Icon button

- 44 × 44 px, `surface` veya `surface-soft` arka planı.
- Lucide ikonları 20–22 px stroke 2 kullan.
- Daima görünür bir dokunma alanı olsun; ikonlar yalnız başına 24 px bırakılmasın.

### F. Liste satırı

Kategoriler, profildeki ayarlar ve hareket listeleri bu yapıyı kullanır.

```
[32–40 px renkli ikon kutusu]  Başlık                  1.250 ₺ / chevron
                               İkincil bilgi
```

- Satır yüksekliği: 64–72 px.
- Satırlar arasında ayrı büyük kartlar yerine 1 px ayraç kullan.
- En fazla 5–6 satır görünür; sonrası “Tümünü gör”.

### G. Para input'u

- Beyaz zemin, 1 px `line` sınır, 16 px radius, 52 px yükseklik.
- Odakta `primary` 2 px ring; kabarık mavi gölge kullanma.
- Para birimi sağda sabit `₺` eki olarak görünür.
- Büyük para girişi gerekiyorsa tek belirgin amount input'u kullan; aynı formda birçok büyük kutu sıralama.

### H. Segmented control / chip

- Bölümlü kontrol: `surface-soft` container, seçili öğede `surface` + `shadow-subtle`.
- Kategori chipleri tek satır yatay kaydırılabilir; seçili chip `ink-950` zemin, beyaz metin.
- 44 px minimum dokunma yüksekliği.

### I. Bottom sheet

Harcama ekleme, rutin oluşturma ve filtreler yeni sayfa yerine mümkün olduğunda bottom sheet ile açılır.

- Arkada `%25–35` koyu overlay.
- Sheet: `surface`, 28 px üst köşe yarıçapı, üstte 36 px drag handle.
- İçerik hızlı tamamlanır: başlık → gerekli alanlar → sabit alttaki CTA.
- Bir sheet içinde 5'ten fazla temel karar varsa ayrı ekrana geç.

### J. Bottom navigation

Üç sekme korunur: `Bugün`, `Tasarruf`, `Profil`.

- Koyu lacivert, düz container; üst köşeler 24 px veya ekran tabanında düz dock.
- Aktif sekme: `primary-soft` kapsül içinde `primary` ikon + beyaz/lacivert yazı.
- Pasif sekmeler: `#BFC6E5` ikon/yazı.
- Her sekmede ikon + kısa Türkçe etiket zorunlu.
- Bu bar ekran kaydırıldığında da sabit kalır.

## 7. Ekran bazlı yeniden tasarım

### 7.1 Giriş ve hesap oluşturma

**Sorun:** Mevcut giriş/kayıt ekranlarında birbirinden kopuk çok sayıda input, açıklama ve sosyal buton var; uzun ekranda ana eylem kayboluyor.

**Yeni düzen:**

1. Koyu header: küçük Trinkow kelime işareti, `Hoş geldin` başlığı, tek cümle “Günün parasını, yargılamadan gör.”
2. Açık içerik paneli: e-posta ve şifre alanları.
3. `Beni hatırla` bir satırda küçük switch; `Şifremi unuttum` text link.
4. Tam genişlik `Giriş yap` CTA.
5. İnce “veya” ayıracı ardından Apple/Google için iki compact provider butonu.
6. En altta tek yönlendirme: `Hesabın yok mu? Hesap oluştur`.

Kayıt ekranında şartlar iki ayrı checkbox duvarı olarak görünmesin: 
`Hesap oluşturarak Kullanım Koşulları'nı ve Gizlilik Politikası'nı kabul ediyorum.`
Bu metin içindeki iki bağlantı tıklanabilir olsun. Input doğrulaması alanın altında sadece gerektiğinde görünsün.

### 7.2 Onboarding: hedef seçimi

Onboarding 4 kısa adımdan oluşur. Her adım üstte koyu header, altında açık panel yapısını kullanır.

1. **Hedefin ne?** `Paramı görmek`, `Birikim yapmak`, `Borcu azaltmak` seçenekleri. Her biri ayrı dev kart değil; ikon + başlık + tek satırla 72 px liste satırı. Seçili seçenek primary border/soft fill alır.
2. **Gelir ve zorunlu giderler.** Aylık gelir ayrı ekran odağıdır. Sabit giderler varsayılan kategoriler olarak listelenir; bir satıra dokununca düzenleme sheet'i açılır. Sıfır değerli her gideri dev input'a dönüştürme.
3. **Rutinlerin.** “Kahve, sigara, ulaşım...” açıklaması 2 satırı geçmez. `Rutin ekle` secondary button; mevcut rutinler düz listede görünür.
4. **Planın hazır.** Büyük sayı yerine, sade özet: `Bugün için 1.379 ₺ ayırdık` + 3 satırlık hesap özeti. Ana CTA `Trinkow'u aç`.

#### Onboarding progress

- `1 / 4` yerine başlığın yanında küçük metin veya 4 noktalı progress kullan.
- Dolu öğe `primary`, boş öğe `#D9DEF4`.
- Tüm ekran boyunca sabit uzun progress bar kullanma; ince, sakin bir gösterge yeterli.

### 7.3 Bugün (ana ekran)

Bu en önemli ekran. Kullanıcı tek bakışta “bugün ne kadar kalmış?” sorusunun yanıtını almalı.

**Yerleşim:**

1. Koyu header:
   - Küçük tarih: `30 Eylül, Çarşamba`
   - Başlık: `Bugün`
   - Sağda tarih filtresi ikon butonu.
2. Açık içerik panelinin ilk alanı: sade günlük özet.
   - Etiket: `Bugün kalan`
   - Büyük tutar: `1.379 ₺`
   - Tek ince progress: `Günlük limitin %32'si kullanıldı`.
   - Gauge/dairesel sayaç varsayılan görünümden çıkarılır. Sadece aylık analiz içinde küçük veri görselleştirme olarak kullanılabilir.
3. Tam genişlik coral CTA: `Harcama ekle`.
4. `Bugünün hareketleri` listesi.
   - Boş durumda: küçük, sakin bir ikon ve `Henüz harcama eklemedin.`; uzun motivasyon cümlesi yok.
   - Dolu durumda: saat, kategori, açıklama, sağda tutar. En son 3 kayıt gösterilir.
5. `Sık kullanılanlar`: yatay küçük chips veya 2 sütunlu mini ikon butonları: Market, Kahve, Ulaşım, Diğer.

Kategori listesini ana sayfada 10 satır halinde sürekli gösterme. Bu liste sadece `Harcama ekle` akışında açılır.

### 7.4 Harcama ekle (bottom sheet)

Akış üç küçük karar kadar hızlı olmalıdır:

1. Büyük tutar alanı: `0 ₺`.
2. Kategori grid'i: en fazla 8 görünür kategori; `Tümü` ile tam liste açılır.
3. Opsiyonel not ve tarih; varsayılan bugün.
4. Sabit CTA: `Harcamayı kaydet`.

Ekleme sonrasında sheet kapanır ve ana ekrandaki kalan tutar + hareket listesi animasyonla güncellenir. Başarı toast'ı: `125 ₺ kafe harcaması eklendi.`

### 7.5 Tasarruf / aylık özet

**Amaç:** Aylık detayları gösterir; bugünkü ekrandan daha analitiktir fakat dashboard kalabalığına dönüşmez.

1. Koyu header: `Eylül 2026` küçük etiket, `Tasarruf` başlık, ay değiştirme ikonları.
2. Açık panelde üstte üçlü özet, kart yığını değil:

| Harcanabilir | Harcanan | Kalan |
|---:|---:|---:|
| 41.370 ₺ | 12.540 ₺ | 28.830 ₺ |

3. `Bu ay` progress bar + kısa cümle: `Ayın 12. günündesin.`
4. `Kategori dağılımı`: 4–5 satırlık renkli bar listesi. Boşsa kapalı accordion gösterme; `Henüz yeterli veri yok.` metni ve minik grafik placeholder kullan.
5. `Gerçek birikim` ve `Rutin tasarrufu`: ayrı büyük kartlar yerine açılır satırlar. Kullanıcı ilgili satıra dokununca ayrıntı aynı sayfada açılır.

### 7.6 Profil

**Amaç:** Ayarların tamamı tek uzun kart dizisi değil, üç net grupta listelenir.**

Koyu header: kullanıcının adı/baş harfi avatarı, `Profil` başlığı, sağda ayarlar ikonu.

İçerik grupları:

- **Planın:** Gelir ve bütçe, Limitler, Rutinler.
- **Takip:** Aylık özet, Seri.
- **Hesabın:** Bildirimler, Gizlilik, Çıkış yap.

Her grup bir yüzey içinde ayrı satırlardan oluşur. Satırların arası ayraçtır; ayrı ayrı büyük kart değildir. Subtext yalnızca anlam kattığında kullanılır. Örneğin `Limitler — Günlük 1.379 ₺`.

### 7.7 Rutin ekle

Rutin ekleme, onboarding üzerinde dev modal ve çoklu gölgelerle açılmamalı; standart bottom sheet olmalı.

- Başlık: `Rutin ekle`
- Ad (ör. Sabah kahvesi)
- Kategori chips
- Yan yana iki küçük input: `Günde kaç kez?` / `Birim tutar`
- Altta canlı hesap özeti: `Aylık tahmini: 1.500 ₺`
- CTA: `Rutini kaydet`

## 8. Metin ve ton

Tüm kullanıcıya görünen metin Türkçe olacak.

### Ton ilkeleri

- Doğrudan, kısa, sıcak ve yargılamayan “sen” dili.
- Sayıyı önce ver; açıklamayı sonra ekle.
- Duygusal baskı veya suçluluk yaratma.
- Ünlem, emoji ve abartılı vaat kullanma.

| Kaçın | Kullan |
|---|---|
| “Harika gidiyorsun! Harcamalarına dikkat et!” | “Bugün 1.379 ₺ kaldı.” |
| “Limitini aştın!” | “Bugünkü limitinin üzerine çıktın.” |
| “Bütçeni kontrol altına al.” | “Paranın bugün nereye gittiğini gör.” |
| “Bugün henüz bir şey yazmadın. İlk kahve iyi bir başlangıç.” | “Henüz harcama eklemedin.” |

## 9. Hareket ve geri bildirim

- Geçişler: 180–240 ms, `ease-out`.
- Bottom sheet: 280 ms spring, yumuşak fakat zıplamayan.
- CTA pressed: 0.98 scale, 120 ms.
- Tutar güncellenmesi: kısa crossfade + sayı geçişi (200 ms); dramatik sayma animasyonu yapma.
- Başarı/hata geri bildirimleri: ekranın altında snackbar/toast; 3 saniye; birincil CTA'yı kapatmamalı.
- `prefers-reduced-motion` seçeneğine saygı göster.

## 10. Erişilebilirlik ve uygulama kuralları

- Normal metinde minimum 4.5:1 kontrast.
- Sadece renk ile anlam verme; limit uyarısında metin ve ikon ekle.
- Tüm dokunma hedefleri minimum 44 × 44 px.
- Form alanlarında görünür label kullan; placeholder label'ın yerine geçmez.
- Para tutarını Turkish locale ile biçimlendir: `1.379 ₺`; ondalık gerektiğinde `1.379,50 ₺`.
- Ekran okuyucu için ikon butonlarına açık `aria-label` ekle.
- Koyu header ve açık panel arasında 8–16 px net görsel ayrım bırak.

## 11. Uygulama sırası

1. Önce global tokenları, fontu, app shell'i ve bottom navigation'ı uygula.
2. Ardından `Bugün` ekranını bu kitteki sade hiyerarşiyle yeniden kur. Bu ekran, diğerlerinin görsel referansı olsun.
3. Harcama ekleme bottom sheet'ini kur ve bu akışı çalışır hale getir.
4. Tasarruf, Profil, onboarding ve kimlik ekranlarını aynı bileşenleri tekrar kullanarak düzenle.
5. Son kontrol: Bir ekran görüntüsünde kullanıcı 2 saniye içinde sayfanın amacını ve birincil aksiyonu anlayabiliyor mu? Anlaşılmıyorsa ekrandaki kart/başlık/metin sayısını azalt.

## 12. Claude'a nihai çalışma komutu

> Trinkow'u bu `trinkow-design-kit.md` dosyasına göre yeniden tasarla. Mevcut işlevleri (günlük limit, harcama ekleme, kategori seçimi, rutinler, aylık tasarruf özeti, profil, giriş/kayıt ve 4 adımlı onboarding) koru; fakat mevcut açık mavi neumorphic kart yığınını tamamen bırak. Referanstaki gibi koyu lacivert üst alan, geniş açık içerik paneli, kompakt liste satırları, kontrollü canlı aksan renkleri ve tekil coral CTA kullan. UI modern, güven veren, hafif ve premium görünmeli; kopya sohbet uygulaması gibi görünmemeli. Tüm uygulama metinleri Türkçe olsun. Her bileşeni tekrar kullanılabilir tasarım tokenları ve erişilebilir dokunma alanlarıyla üret.
