const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const rutinTasarruf = yukle('src/lib/rutinTasarruf.ts');
const metinler = yukle('src/content/metinler.ts');

const kahve = {
  rutin_id: 'kahve', ad: 'Kahve', kategori: 'kafe', tasarruf_kurus: 15_000,
  adet: 3, gun_sayisi: 3,
  gunler: [
    { gun: '2026-10-03', adet: 1, birim_fiyat_kurus: 5_000, tasarruf_kurus: 5_000 },
    { gun: '2026-10-05', adet: 1, birim_fiyat_kurus: 5_000, tasarruf_kurus: 5_000 },
    { gun: '2026-10-04', adet: 1, birim_fiyat_kurus: 5_000, tasarruf_kurus: 5_000 },
  ],
};

test('rutin tasarrufları toplam tutara göre büyükten küçüğe sıralanır', () => {
  const sirali = rutinTasarruf.rutinTasarruflariniSirala([
    kahve,
    { ...kahve, rutin_id: 'sigara', ad: 'Sigara', tasarruf_kurus: 30_000 },
  ]);
  assert.deepEqual(Array.from(sirali, (r) => r.rutin_id), ['sigara', 'kahve']);
});

test('rutin detayı en yeni yedi günü gösterir ve kalan günü bildirir', () => {
  const sekizGun = Array.from({ length: 8 }, (_, i) => ({
    gun: `2026-10-${String(i + 1).padStart(2, '0')}`,
    adet: 1,
    birim_fiyat_kurus: 5_000,
    tasarruf_kurus: 5_000,
  }));
  const sonuc = rutinTasarruf.rutinTasarrufGunleriniGoster({ ...kahve, gunler: sekizGun, gun_sayisi: 8 }, 7);
  assert.equal(sonuc.gunler.length, 7);
  assert.equal(sonuc.gunler[0].gun, '2026-10-08');
  assert.equal(sonuc.gunler[6].gun, '2026-10-02');
  assert.equal(sonuc.kalanGunSayisi, 1);
});

test('rutin akordiyonu metinleri gün, adet ve birim tutarı açıkça söyler', () => {
  assert.equal(metinler.tasarrufRutinOzet(3, 5), '3 gün · 5 adet alınmadı');
  assert.equal(metinler.tasarrufRutinGunDetay(2, '60 ₺'), '2 adet alınmadı · birim 60 ₺');
  assert.equal(metinler.tasarrufRutinFazlaGun(4), '+4 gün daha bu toplama dahil');
});

test('eski backend yalnız toplam döndürürse detay özeti güvenli sıfırdır', () => {
  assert.deepEqual(
    { ...rutinTasarruf.rutinTasarrufSayilari({ rutin_id: 'eski', ad: 'Eski rutin', tasarruf_kurus: 5_000 }) },
    { gunSayisi: 0, adet: 0 },
  );
});
