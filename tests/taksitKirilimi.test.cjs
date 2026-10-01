const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

// rev3-taksitler.md — E-18 kategori/ürün kırılımının saf hesap katmanı.
// `SurenSeri` type-only import olduğu için stub gerekmez.
const k = yukle('src/lib/taksitKirilimi.ts');

const KATEGORI_SIRASI = ['market', 'saglik', 'giyim', 'diger'];

function seri(over) {
  return {
    id: 'h1',
    taksitId: 't1',
    kategori: 'diger',
    urunAdi: 'Ürün',
    taksitNo: 1,
    taksitToplam: 12,
    tutarKurus: 100000,
    sonAy: '2027-01',
    kalanKurus: 0,
    ...over,
  };
}

test('kurusToLira — kuruş DAİMA atılır (aşağı yuvarlama), yukarı yuvarlama yok', () => {
  assert.equal(k.kurusToLira(104167), 1041);
  assert.equal(k.kurusToLira(104199), 1041);
  assert.equal(k.kurusToLira(104100), 1041);
  assert.equal(k.kurusToLira(0), 0);
});

test('§5.1.1 (K-T13) — kategori toplamı ekranda YAZAN satır değerlerinin toplamıdır', () => {
  // Üç ürün, her biri 1.041,67 — satırda "1.041 ₺" yazar (kuruş atılır).
  const seriler = [
    seri({ id: 'a', taksitId: 'a', urunAdi: 'Telefon', tutarKurus: 104167 }),
    seri({ id: 'b', taksitId: 'b', urunAdi: 'Buzdolabı', tutarKurus: 104167 }),
    seri({ id: 'c', taksitId: 'c', urunAdi: 'Süpürge', tutarKurus: 104167 }),
  ];
  const gruplar = k.kategoriKirilimiOlustur(seriler, KATEGORI_SIRASI);
  assert.equal(gruplar.length, 1);
  // Σ satır(görünen) = 1041 + 1041 + 1041 = 3123 — kendi kuruşundan (313500)
  // yuvarlanmış 3123'ten (floor(313500... )) FARKLI olabilirdi ama burada
  // eşit çıkıyor; asıl garanti bir SONRAKİ testte (farklı kuruş kuyruğu).
  assert.equal(gruplar[0].toplamLira, 3123);
});

test('§5.1.1 — Σ(yuvarlanmış satır) ≠ yuvarla(Σ satır) olduğu durumda EKRANIN kuralı (yaprakta yuvarlama) uygulanır', () => {
  // İki kategori, her birinde tek ürün: 141,67 ve 141,66 — ham toplam
  // 283,33 olur ve tek seferde yuvarlanırsa 283 çıkar. Ama K-T13 her
  // SATIRI kendi başına yuvarlar: 141 + 141 = 282. Ay toplamı (kahraman)
  // BUNU görmeli, 283'ü DEĞİL.
  const seriler = [
    seri({ id: 'a', taksitId: 'a', kategori: 'market', urunAdi: 'A', tutarKurus: 14167 }),
    seri({ id: 'b', taksitId: 'b', kategori: 'saglik', urunAdi: 'B', tutarKurus: 14166 }),
  ];
  const gruplar = k.kategoriKirilimiOlustur(seriler, KATEGORI_SIRASI);
  assert.equal(k.ayToplamLiraHesapla(gruplar), 282);
  assert.notEqual(k.ayToplamLiraHesapla(gruplar), Math.floor((14167 + 14166) / 100));
});

test('§5.1.1 — gizli satırlar (liste sınırının arkası) kategori toplamına DAHİLDİR', () => {
  const seriler = Array.from({ length: 8 }, (_, i) =>
    seri({ id: `u${i}`, taksitId: `u${i}`, urunAdi: `Ürün ${i}`, tutarKurus: 10000 * (8 - i) }),
  );
  const gruplar = k.kategoriKirilimiOlustur(seriler, KATEGORI_SIRASI);
  assert.equal(gruplar[0].urunSayisi, 8);
  assert.equal(gruplar[0].toplamLira, (8 + 7 + 6 + 5 + 4 + 3 + 2 + 1) * 100);
  const gorunenVarsayilan = k.gorunenSatirlar(gruplar[0].satirlar, false);
  assert.equal(gorunenVarsayilan.length, k.KATEGORI_SATIR_SINIRI);
  const gorunenTumu = k.gorunenSatirlar(gruplar[0].satirlar, true);
  assert.equal(gorunenTumu.length, 8);
});

test('§4.3 — kategori içi sıra: tutar azalan, eşitlikte taksitNo azalan, sonra ürün adı (tr)', () => {
  const seriler = [
    seri({ id: 'a', taksitId: 'a', urunAdi: 'Çamaşır makinesi', tutarKurus: 50000, taksitNo: 3 }),
    seri({ id: 'b', taksitId: 'b', urunAdi: 'Ayakkabı', tutarKurus: 50000, taksitNo: 5 }),
    seri({ id: 'c', taksitId: 'c', urunAdi: 'Gözlük', tutarKurus: 90000, taksitNo: 1 }),
  ];
  const gruplar = k.kategoriKirilimiOlustur(seriler, KATEGORI_SIRASI);
  // vm realm'inden gelen dizi düz diziye çevrilir (bkz. tests/seriKurali.test.cjs notu).
  const adlar = Array.from(gruplar[0].satirlar.map((s) => s.urunAdi));
  assert.deepEqual(adlar, ['Gözlük', 'Ayakkabı', 'Çamaşır makinesi']);
});

test('§4.3 — kategoriler arası sıra: toplam azalan, eşitlikte kategoriSirasi', () => {
  const seriler = [
    seri({ id: 'a', taksitId: 'a', kategori: 'giyim', tutarKurus: 50000 }),
    seri({ id: 'b', taksitId: 'b', kategori: 'saglik', tutarKurus: 50000 }),
    seri({ id: 'c', taksitId: 'c', kategori: 'diger', tutarKurus: 90000 }),
  ];
  const gruplar = k.kategoriKirilimiOlustur(seriler, KATEGORI_SIRASI);
  assert.deepEqual(Array.from(gruplar.map((g) => g.kategoriKodu)), ['diger', 'saglik', 'giyim']);
});

test('son taksit (mevcut === toplam) `son: true` üretir', () => {
  const seriler = [seri({ taksitNo: 6, taksitToplam: 6 })];
  const gruplar = k.kategoriKirilimiOlustur(seriler, KATEGORI_SIRASI);
  assert.equal(gruplar[0].satirlar[0].son, true);
});

test('K-T2/tekKategoriMi — bölüm başlığı kararı yalnız kategori SAYISINA bakar', () => {
  const tek = k.kategoriKirilimiOlustur([seri({ kategori: 'diger' })], KATEGORI_SIRASI);
  assert.equal(k.tekKategoriMi(tek), true);
  const cok = k.kategoriKirilimiOlustur(
    [seri({ id: 'a', taksitId: 'a', kategori: 'diger' }), seri({ id: 'b', taksitId: 'b', kategori: 'giyim' })],
    KATEGORI_SIRASI,
  );
  assert.equal(k.tekKategoriMi(cok), false);
  assert.equal(k.tekKategoriMi([]), false);
});

test('§5.3.1 — kalanAySayisiHesapla: aynı ay 0, gelecek ay 1, yıl atlaması doğru', () => {
  assert.equal(k.kalanAySayisiHesapla('2026-09', '2026-09'), 0);
  assert.equal(k.kalanAySayisiHesapla('2026-09', '2026-10'), 1);
  assert.equal(k.kalanAySayisiHesapla('2026-09', '2027-05'), 8);
});

test('§5.3.1 (B7/r3) — eşik SABİT 5 DEĞİL, çubuk kartının satır sayısından türer', () => {
  // 3 satırlık (hayali) bir çubuk kartında eşik 2'dir, 6 satırlık kartta 5.
  const aylar3 = [1000, 2000, 3000];
  assert.notEqual(k.kalanToplamGorunenKurus({ aylarKurus: aylar3, kalanAySayisi: 2 }), null);
  assert.equal(k.kalanToplamGorunenKurus({ aylarKurus: aylar3, kalanAySayisi: 3 }), null);

  const aylar6 = [1000, 2000, 3000, 4000, 5000, 6000];
  assert.notEqual(k.kalanToplamGorunenKurus({ aylarKurus: aylar6, kalanAySayisi: 5 }), null);
  assert.equal(k.kalanToplamGorunenKurus({ aylarKurus: aylar6, kalanAySayisi: 6 }), null);
});

test('§5.3.1 (B7) — garanti uygulanınca dip = Σ(görünen aylar − İÇİNDE BULUNULAN AY)', () => {
  // 2 ay kalmış, her ikisi de 1.041,72 — çubuklar 1.041 + 1.041 = 2.082
  // olmalı; içinde bulunulan ayı da katıp 3 × 1.041 = 3.123 üretmek B7'nin
  // düzelttiği hatadır.
  const aylarKurus = [312072, 104172, 104172, 0, 0, 0];
  const dip = k.kalanToplamGorunenKurus({ aylarKurus, kalanAySayisi: 2 });
  assert.equal(dip, 208200); // 2.082 ₺ kuruş cinsinden
  assert.notEqual(dip, 312300); // yanlış hesap: 3 × 1.041 = 3.123 ₺ DEĞİL
});

test('§5.3.1 — garanti sağlanmıyorsa (kalan ay eşiği aşıyor) null döner, çağıran ham toplamı kullanır', () => {
  const aylarKurus = [100000, 100000, 100000, 100000, 100000, 100000];
  assert.equal(k.kalanToplamGorunenKurus({ aylarKurus, kalanAySayisi: 6 }), null);
  // Eski yol: tek kuruş toplamının bir kez aşağı yuvarlanması.
  assert.equal(k.kalanToplamHamYuvarla(1483204), 1483200);
});

test('kalanToplamHamYuvarla — kuruş atılır, yukarı yuvarlanmaz', () => {
  assert.equal(k.kalanToplamHamYuvarla(999), 900);
  assert.equal(k.kalanToplamHamYuvarla(100099), 100000);
});
