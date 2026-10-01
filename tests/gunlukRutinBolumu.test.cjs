const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

// rev3-gunluk-rutin.md §5 (sıralama kuralı, B4) · §5/6 (yükleniyor kilidi) ·
// §8 (geçmiş gün a11y etiketi) · rev2-tasarruf-profil.md §3.12.5 (akordiyon
// özet/hata kararı).

const gunlukRutin = yukle('src/lib/gunlukRutin.ts');
const metinler = yukle('src/content/metinler.ts');

// --- Sıralama kuralı ------------------------------------------------------

test('≤5 rutinde sıralama hiç çalışmaz — kullanıcının kendi sırası korunur', () => {
  const girdi = [
    { id: 'a', isaretliMi: false, tutarKurus: 1000 },
    { id: 'b', isaretliMi: true, tutarKurus: 90000 },
    { id: 'c', isaretliMi: false, tutarKurus: 500 },
  ];
  assert.deepEqual(Array.from(gunlukRutin.rutinSiralamasi(girdi), (r) => r.id), ['a', 'b', 'c']);
});

test('>5 rutinde işaretsizler önce, eşitlikte tutarı büyük olan önce sıralanır', () => {
  const girdi = [
    { id: 'kahve', isaretliMi: true, tutarKurus: 3100 },
    { id: 'sigara', isaretliMi: false, tutarKurus: 6000 },
    { id: 'enerji', isaretliMi: false, tutarKurus: 2800 },
    { id: 'ulasim', isaretliMi: false, tutarKurus: 4000 },
    { id: 'yemek', isaretliMi: true, tutarKurus: 9000 },
    { id: 'atistirma', isaretliMi: false, tutarKurus: 1500 },
  ];
  const sirali = gunlukRutin.rutinSiralamasi(girdi);
  assert.deepEqual(
    Array.from(sirali, (r) => r.id),
    ['sigara', 'ulasim', 'enerji', 'atistirma', 'yemek', 'kahve'],
  );
});

test('sıralama saf fonksiyondur — aynı girdiyle tekrar çağrılınca hep aynı sonucu verir (satır zıplamaz)', () => {
  const girdi = [
    { id: '1', isaretliMi: false, tutarKurus: 100 },
    { id: '2', isaretliMi: false, tutarKurus: 200 },
    { id: '3', isaretliMi: false, tutarKurus: 300 },
    { id: '4', isaretliMi: false, tutarKurus: 400 },
    { id: '5', isaretliMi: false, tutarKurus: 500 },
    { id: '6', isaretliMi: false, tutarKurus: 600 },
  ];
  const birinci = Array.from(gunlukRutin.rutinSiralamasi(girdi), (r) => r.id);
  // Kullanıcı "6"yı işaretlese bile ÇAĞRILAN FONKSİYON aynı girdiyle aynı
  // diziyi üretir — bileşenin görevi bunu YENİDEN ÇAĞIRMAMAKTIR (yalnız
  // mount'ta bir kez). Bu test o sözleşmenin saf yarısını kilitler.
  const ikinci = Array.from(gunlukRutin.rutinSiralamasi(girdi), (r) => r.id);
  assert.deepEqual(birinci, ikinci);
});

// --- Yükleniyorken iki eylemin de kilitli olması ---------------------------

test('yazılıyor/işaretleniyor durumunda İKİ düğme de kilitli', () => {
  assert.deepEqual({ ...gunlukRutin.rutinButonlariKilitli('aldimYaziliyor') }, { aldim: true, almadim: true });
  assert.deepEqual({ ...gunlukRutin.rutinButonlariKilitli('almadimIsaretleniyor') }, { aldim: true, almadim: true });
});

test('"aldı" durumunda Almadım pasif kalır, artı tekrar adet ekleyebilir', () => {
  assert.deepEqual({ ...gunlukRutin.rutinButonlariKilitli('aldi') }, { aldim: false, almadim: true });
});

test('"vazgeçti" durumunda Aldım etkin kalır (fikir değiştirebilir)', () => {
  assert.deepEqual({ ...gunlukRutin.rutinButonlariKilitli('vazgecti') }, { aldim: false, almadim: false });
});

test('işaretsiz durumda iki düğme de etkin', () => {
  assert.deepEqual({ ...gunlukRutin.rutinButonlariKilitli('isaretsiz') }, { aldim: false, almadim: false });
});

// --- Sunucudan gelen `vazgecilen_adet` → satır durumu (kalıcılık) ----------

test('tamGunVazgecildiMi: vazgecilen_adet gunluk_adet\'e eşit/üstündeyse TAM gün sayılır', () => {
  assert.equal(gunlukRutin.tamGunVazgecildiMi(1, 1), true);
  assert.equal(gunlukRutin.tamGunVazgecildiMi(2, 2), true);
});

test('tamGunVazgecildiMi: KISMİ vazgeçme (0 < adet < gunluk_adet) TAM gün sayılmaz', () => {
  assert.equal(gunlukRutin.tamGunVazgecildiMi(1, 2), false);
});

test('tamGunVazgecildiMi: 0 vazgeçme ya da geçersiz gunluk_adet hep false', () => {
  assert.equal(gunlukRutin.tamGunVazgecildiMi(0, 2), false);
  assert.equal(gunlukRutin.tamGunVazgecildiMi(5, 0), false);
});

test('rutinSatirDurumuHesapla: gerçek harcama kaydı (aldı) tam gün vazgeçmeyi bile ezer', () => {
  assert.equal(
    gunlukRutin.rutinSatirDurumuHesapla({ yaziliyor: false, isaretleniyor: false, aldiMi: true, vazgecilenAdet: 2, gunlukAdet: 2 }),
    'aldi',
  );
});

test('rutinSatirDurumuHesapla: TAM gün vazgeçme "vazgecti" döner', () => {
  assert.equal(
    gunlukRutin.rutinSatirDurumuHesapla({ yaziliyor: false, isaretleniyor: false, aldiMi: false, vazgecilenAdet: 2, gunlukAdet: 2 }),
    'vazgecti',
  );
});

test('rutinSatirDurumuHesapla: KISMİ vazgeçme (2 kahveden 1i) "vazgecti" DEĞİL "isaretsiz" gösterir — yanlış bilgi verilmez', () => {
  assert.equal(
    gunlukRutin.rutinSatirDurumuHesapla({ yaziliyor: false, isaretleniyor: false, aldiMi: false, vazgecilenAdet: 1, gunlukAdet: 2 }),
    'isaretsiz',
  );
});

test('rutinSatirDurumuHesapla: yazılıyor/işaretleniyor bayrakları sunucu değerinden bağımsız önceliklidir', () => {
  assert.equal(
    gunlukRutin.rutinSatirDurumuHesapla({ yaziliyor: true, isaretleniyor: false, aldiMi: false, vazgecilenAdet: 2, gunlukAdet: 2 }),
    'aldimYaziliyor',
  );
  assert.equal(
    gunlukRutin.rutinSatirDurumuHesapla({ yaziliyor: false, isaretleniyor: true, aldiMi: true, vazgecilenAdet: 0, gunlukAdet: 2 }),
    'almadimIsaretleniyor',
  );
});

test('almadimYeniAdet: TAM gün işaretliyken düğme kaldırır (0), değilse günün tamamını yazar (gunluk_adet)', () => {
  assert.equal(gunlukRutin.almadimYeniAdet({ vazgecilen_adet: 2, gunluk_adet: 2 }), 0);
  assert.equal(gunlukRutin.almadimYeniAdet({ vazgecilen_adet: 0, gunluk_adet: 2 }), 2);
  // Kısmi bir kalıntı da "kaldırma" değil "günün TAMAMINI işaretleme" sayılır.
  assert.equal(gunlukRutin.almadimYeniAdet({ vazgecilen_adet: 1, gunluk_adet: 2 }), 2);
});

// --- Günlük rutin bölümü özeti (§3.1) --------------------------------------

test('hiçbiri işaretli değilse özet "işaretlenmedi" der', () => {
  assert.equal(metinler.gunlukRutinOzetSec(3, 3, false), '3 rutin · işaretlenmedi');
});

test('hepsi işaretliyse özet "hepsi işaretli" der', () => {
  assert.equal(metinler.gunlukRutinOzetSec(3, 0, false), '3 rutin · hepsi işaretli');
});

test('kısmi işaretlemede özet "{n} işaretsiz" der', () => {
  assert.equal(metinler.gunlukRutinOzetSec(3, 1, false), '3 rutin · 1 işaretsiz');
});

test('hata varken özet toplamı değil "işaret bekliyor"u söyler — sayı ne olursa olsun', () => {
  assert.equal(metinler.gunlukRutinOzetSec(3, 0, true), '3 rutin · işaret bekliyor');
  assert.equal(metinler.gunlukRutinOzetSec(3, 3, true), '3 rutin · işaret bekliyor');
});

// --- Geçmiş gün a11y etiketi (B3) ------------------------------------------

test('geçmiş günde eylem etiketi cümle başında günü taşır, görünür etiket gün-nötr kalır', () => {
  assert.equal(
    metinler.a11yGunlukRutinAldimGecmis('Kahve', '16 Eylül', '31 ₺'),
    'Kahve, 16 Eylül. Aldım olarak işaretle, 31 ₺',
  );
  assert.equal(
    metinler.a11yGunlukRutinAlmadimGecmis('Sigara', '16 Eylül', '60 ₺'),
    'Sigara, 16 Eylül. Almadım olarak işaretle, 60 ₺ rutin tasarrufu',
  );
});

test('bugünkü etiket günü hiç taşımaz (gün-nötr)', () => {
  assert.equal(metinler.a11yGunlukRutinAldim('Kahve', '31 ₺'), 'Kahve aldım olarak işaretle, 31 ₺');
  assert.doesNotMatch(metinler.a11yGunlukRutinAldim('Kahve', '31 ₺'), /bugün/i);
});

test('bölüm etiketi geçmiş günde günü taşır', () => {
  assert.equal(
    metinler.a11yGunlukRutinBolumGecmis('16 Eylül', '3 rutin · 2 işaretsiz'),
    'Rutinler. 16 Eylül. 3 rutin · 2 işaretsiz',
  );
});

// --- Paylaşılan "yükleniyor" a11y anahtarı (Ö5) ----------------------------

test('a11y.bolumYukleniyor iki farklı başlıkla da yarım kalmaz', () => {
  assert.equal(metinler.a11yBolumYukleniyor('Rutinler'), 'Rutinler. Yükleniyor');
  assert.equal(metinler.a11yBolumYukleniyor('Gerçek birikim'), 'Gerçek birikim. Yükleniyor');
});

// --- Tasarruf akordiyonu özet/hata kararı (§3.12.5 / Ö4) -------------------

test('akordiyon özetleri tutar/sayı/olgu taşır, asla "…" ya da boş olmaz', () => {
  assert.equal(metinler.tasarrufOzetButce('8.760 ₺'), 'Kalan 8.760 ₺');
  assert.equal(metinler.tasarrufOzetBirikim('9.500 ₺', 95), "9.500 ₺ · hedefin %95'i");
  assert.equal(metinler.tasarrufOzetRutin('1.240 ₺', 3), '1.240 ₺ · 3 rutin');
  assert.equal(metinler.t['tasarruf.ozet.acilamadi'], 'Açılamadı');
});

test('a11y.tasarruf.bolum kapalı/açık fark etmeksizin her zaman değeri söyler', () => {
  assert.equal(metinler.a11yTasarrufBolum('Gerçek birikim', 'Açılamadı'), 'Gerçek birikim. Açılamadı');
});
