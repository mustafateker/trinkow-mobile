const test = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const { abonelikTarihBilgisi, abonelikDurumEtiketi } = yukle('src/lib/abonelik.ts');

test('gelecek yenilenme gününü hesaplar', () => {
  const sonuc = abonelikTarihBilgisi(20, '2026-10-16', null);
  assert.equal(sonuc.siradakiGun, '2026-10-20');
  assert.equal(abonelikDurumEtiketi(sonuc), '4 gün kaldı');
});

test('geçmiş yenilenmeyi gecikmiş gösterir', () => {
  const sonuc = abonelikTarihBilgisi(10, '2026-10-16', null);
  assert.equal(sonuc.durum, 'gecikti');
  assert.equal(abonelikDurumEtiketi(sonuc), '6 gün gecikti');
});

test('bu ay ödendiyse sonraki aya geçer', () => {
  const sonuc = abonelikTarihBilgisi(10, '2026-10-16', '2026-10-10');
  assert.equal(sonuc.siradakiGun, '2026-11-10');
  assert.equal(abonelikDurumEtiketi(sonuc), 'Bu ay ödendi');
});

test('ayın 31i kısa ayda son güne sabitlenir', () => {
  const sonuc = abonelikTarihBilgisi(31, '2027-02-10', null);
  assert.equal(sonuc.siradakiGun, '2027-02-28');
});
