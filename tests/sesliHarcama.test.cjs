const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const { sesliHarcamaAyristir } = yukle('src/lib/sesliHarcama.ts', {
  '@/db/harcama': {},
});

test('Türkçe doğal cümleden temel harcama alanlarını çıkarır', () => {
  const sonuc = sesliHarcamaAyristir("Dün Migros'ta kartla 850 lira harcadım");
  assert.equal(sonuc.tutarKurus, 85_000);
  assert.equal(sonuc.urunAdi, 'Migros');
  assert.equal(sonuc.gunFarki, -1);
  assert.equal(sonuc.odeme, 'kart');
  assert.equal(sonuc.taksitSayisi, null);
});

test('sözcüklerle söylenen tutarı ve taksidi anlar', () => {
  const sonuc = sesliHarcamaAyristir('Telefon yirmi dört bin lira kredi kartı 6 taksit');
  assert.equal(sonuc.tutarKurus, 2_400_000);
  assert.equal(sonuc.urunAdi, 'Telefon');
  assert.equal(sonuc.odeme, 'kart');
  assert.equal(sonuc.taksitSayisi, 6);
});

test('para birimi söylenmeden tek sayıyı tutar kabul eder', () => {
  const sonuc = sesliHarcamaAyristir('Bugün market 750');
  assert.equal(sonuc.tutarKurus, 75_000);
  assert.equal(sonuc.urunAdi, 'Market');
  assert.equal(sonuc.gunFarki, 0);
});

test('ondalıklı Türkçe tutarı kuruşa çevirir', () => {
  const sonuc = sesliHarcamaAyristir('Kahve 150,50 lira nakit');
  assert.equal(sonuc.tutarKurus, 15_050);
  assert.equal(sonuc.urunAdi, 'Kahve');
  assert.equal(sonuc.odeme, 'nakit');
});

test('not ifadesini ayrı alana taşır', () => {
  const sonuc = sesliHarcamaAyristir('Netflix 230 lira kartla not olarak aile paketi');
  assert.equal(sonuc.tutarKurus, 23_000);
  assert.equal(sonuc.urunAdi, 'Netflix');
  assert.equal(sonuc.notMetni, 'aile paketi');
});

test('tutar anlaşılmadığında güvenli biçimde null döner', () => {
  const sonuc = sesliHarcamaAyristir('Dün marketten bir şeyler aldım');
  assert.equal(sonuc.tutarKurus, null);
  assert.equal(sonuc.gunFarki, -1);
});
