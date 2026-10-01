const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

// Direktif: "Seri günlük limiti aşsın ya da aşmazsan devam etsin" — kayıt
// girmek seriyi sürdürür, limit aşımının seriye hiçbir etkisi yoktur.
// Bu test istemcide görünen metinlerin eski kuralı ("limit altında kapat")
// yeniden anlatmasını engeller.

const metinler = yukle('src/content/metinler.ts');

const eskiKuralDeseni = /limit(in)? altında kapat|altında kapatırsan/i;

test('seri.kural.1 artık kayıt girmeyi anlatır, limit aşımını değil', () => {
  const metin = metinler.t['seri.kural.1'];
  assert.match(metin, /kayıt girdiğin/i);
  assert.doesNotMatch(metin, eskiKuralDeseni);
});

test('gunluk.seri_baslar.govde artık "kayıt ekle" der, "limit altında kapat" demez', () => {
  const metin = metinler.t['gunluk.seri_baslar.govde'];
  assert.match(metin, /kayıt ekle/i);
  assert.doesNotMatch(metin, eskiKuralDeseni);
});

test('seri.bos.govde artık "kayıt ekle" der, "limit altında kapat" demez', () => {
  const metin = metinler.t['seri.bos.govde'];
  assert.match(metin, /kayıt ekle/i);
  assert.doesNotMatch(metin, eskiKuralDeseni);
});

test('seriAktifGovde limit yerine kayıt girmeyi anlatır', () => {
  assert.equal(metinler.seriAktifGovde(5), '5 gündür kayıt giriyorsun.');
  assert.doesNotMatch(metinler.seriAktifGovde(5), /limit/i);
});

// İzgara (grid) sınıflandırması — gun_izgara_durumu ile birebir aynı SAF
// kural — bilerek DEĞİŞMEDİ; bu testler onu kilitler ki bu görevde yanlışlıkla
// bozulmadığı doğrulansın (limit karşılaştırması burada KALIR, yalnız streak
// devam kararında kullanılmaz).
const seriDb = yukle('src/db/seri.ts', {
  '@/db/harcama': { ayarOku: async () => null, ayarYaz: async () => {} },
  '@/lib/api': {
    enEskiKayitGunuGetirIstegi: async () => ({ gun: null }),
    gunDurumuYazIstegi: async () => {},
    ozetSeriGetir: async () => ({}),
    tercihleriGetir: async () => ({}),
  },
  '@/lib/tarih': {
    ayAnahtari: () => '',
    ayBasligi: () => '',
    gunAnahtari: () => '',
    tarihtenGun: () => new Date(),
  },
});

test('gunSeriDurumu (ızgara) kayıt yoksa "bos" döner — streak kuralından bağımsız', () => {
  assert.equal(seriDb.gunSeriDurumu(0, 0, 100000), 'bos');
});

test('gunSeriDurumu (ızgara) kayıt varken limit aşılırsa "disinda" döner', () => {
  assert.equal(seriDb.gunSeriDurumu(150000, 1, 100000), 'disinda');
});

test('gunSeriDurumu (ızgara) kayıt varken limit aşılmazsa "altinda" döner', () => {
  assert.equal(seriDb.gunSeriDurumu(50000, 1, 100000), 'altinda');
});
