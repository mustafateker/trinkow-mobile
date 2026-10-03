const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const kategoriler = yukle('src/lib/kategoriler.ts', { '@/theme/tokens': { catColor: {} } });
const urunArama = yukle('src/lib/urunArama.ts', { '@/content/urunKatalogu': { aktifKatalogu: () => [] } });
const { tahminEt, TAHMIN_ESIGI } = yukle('src/lib/kategoriTahmin.ts', {
  '@/lib/kategoriler': kategoriler,
  '@/lib/urunArama': urunArama,
});

const KATALOG = [
  { ad: 'Latte', kategori: 'kafe' },
  { ad: 'Filtre kahve', kategori: 'kafe' },
  { ad: 'Çay', kategori: 'kafe' },
  { ad: 'Döner', kategori: 'restoran' },
  { ad: 'Ekmek', kategori: 'market' },
  { ad: 'Market alışverişi', kategori: 'market' },
];
const taban = { urunAdi: '', saat: 9, tutarKurus: 0, ogrenilen: new Map(), gecmis: [], katalog: KATALOG };
const kayit = (kategori, saat, tutarKurus, urunAdi = null) => ({ kategori, saat, tutarKurus, urunAdi });

test('öğrenilmiş eşleme her şeyden önce gelir ve güveni 1 olur', () => {
  const t = tahminEt({ ...taban, urunAdi: 'Latte', ogrenilen: new Map([['latte', 'eglence']]) });
  assert.deepEqual({ ...t }, { kategori: 'eglence', kaynak: 'ogrenilen', guven: 1 });
});

test('Türkçe büyük/küçük harf ve aksan farkı eşlemeyi bozmaz', () => {
  const t = tahminEt({ ...taban, urunAdi: 'ÇAY', katalog: KATALOG });
  assert.equal(t.kategori, 'kafe');
  assert.equal(t.kaynak, 'katalog');
});

test('geçmişte hep aynı kategoriyle yazılmış ürün geçmişten tahmin edilir', () => {
  const gecmis = [kayit('market', 18, 5000, 'Bakkal'), kayit('market', 12, 4000, 'bakkal')];
  const t = tahminEt({ ...taban, urunAdi: 'Bakkal', gecmis });
  assert.equal(t.kategori, 'market');
  assert.equal(t.kaynak, 'gecmis');
  assert.ok(t.guven >= TAHMIN_ESIGI);
});

test('geçmişte kategori bölünmüşse ve çoğunluk zayıfsa geçmişten tahmin edilmez', () => {
  const gecmis = [kayit('market', 18, 5000, 'Bakkal'), kayit('kafe', 12, 4000, 'Bakkal')];
  const t = tahminEt({ ...taban, urunAdi: 'Bakkal', gecmis });
  assert.equal(t, null);
});

test('katalog kaleminin adı serbest yazıda kelime olarak geçerse bulunur', () => {
  const t = tahminEt({ ...taban, urunAdi: 'Sabah latte' });
  assert.equal(t.kategori, 'kafe');
  assert.equal(t.kaynak, 'katalog');
});

test('kelimenin ortasında geçen eşleşme sayılmaz ("ekmekci" ≠ "ekmek")', () => {
  assert.equal(tahminEt({ ...taban, urunAdi: 'Ekmekçi' }), null);
});

test('tek kategorili ön ek tahmin edilir, kategoriler karışıyorsa edilmez', () => {
  assert.equal(tahminEt({ ...taban, urunAdi: 'dön' }).kategori, 'restoran');
  const karisik = [...KATALOG, { ad: 'Dönüş taksisi', kategori: 'ulasim' }];
  assert.equal(tahminEt({ ...taban, urunAdi: 'dön', katalog: karisik }), null);
});

test('öğrenilmiş kategori katalog kaleminin kendi kategorisini ezer', () => {
  const t = tahminEt({ ...taban, urunAdi: 'Sabah latte', ogrenilen: new Map([['latte', 'eglence']]) });
  assert.equal(t.kategori, 'eglence');
});

test('ürün adı yokken saat ve tutar benzerliği bağlam tahmini üretir', () => {
  const gecmis = [
    kayit('kafe', 9, 12000), kayit('kafe', 8, 13000), kayit('kafe', 10, 11000),
    kayit('restoran', 13, 30000), kayit('market', 19, 50000),
  ];
  const t = tahminEt({ ...taban, saat: 9, tutarKurus: 12500, gecmis });
  assert.equal(t.kategori, 'kafe');
  assert.equal(t.kaynak, 'baglam');
});

test('saat ya da tutar uymuyorsa bağlam tahmini yapılmaz', () => {
  const gecmis = [
    kayit('kafe', 9, 12000), kayit('kafe', 8, 13000), kayit('kafe', 10, 11000),
    kayit('restoran', 13, 30000), kayit('market', 19, 50000),
  ];
  assert.equal(tahminEt({ ...taban, saat: 23, tutarKurus: 12500, gecmis }), null);
  assert.equal(tahminEt({ ...taban, saat: 9, tutarKurus: 900000, gecmis }), null);
});

test('az geçmişle bağlam tahmini yapılmaz', () => {
  const gecmis = [kayit('kafe', 9, 12000), kayit('kafe', 9, 12000)];
  assert.equal(tahminEt({ ...taban, saat: 9, tutarKurus: 12000, gecmis }), null);
});

test('bilinmeyen kategori koduyla gelen kayıt tahmini bozmaz', () => {
  const gecmis = [kayit('yok_boyle', 9, 12000, 'X'), kayit('yok_boyle', 9, 12000, 'X')];
  assert.equal(tahminEt({ ...taban, urunAdi: 'X', gecmis }), null);
});

test('gece yarısını aşan saat farkı dairesel hesaplanır (23 ile 0 komşudur)', () => {
  const gecmis = Array.from({ length: 5 }, () => kayit('eglence', 23, 20000));
  const t = tahminEt({ ...taban, saat: 0, tutarKurus: 20000, gecmis });
  assert.equal(t.kategori, 'eglence');
});
