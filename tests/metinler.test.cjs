const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');
const metinler = yukle('src/content/metinler.ts');

// AY_LOKATIF yanlış eklerle yazılmıştı (düzeltildi) — 12 ayın tamamı için
// doğru bulunma hâli eki burada kilitlenir.
const beklenen = [
  "Ocak'ta", "Şubat'ta", "Mart'ta", "Nisan'da", "Mayıs'ta", "Haziran'da",
  "Temmuz'da", "Ağustos'ta", "Eylül'de", "Ekim'de", "Kasım'da", "Aralık'ta",
];

test('AY_LOKATIF 12 ay için doğru bulunma hâli ekini üretir', () => {
  // vm bağlamından gelen dizi ayrı bir realm'e ait; deepEqual bunu
  // reference-eşitliği sorunuyla karıştırmasın diye düz diziye çevrilir.
  assert.deepEqual(Array.from(metinler.AY_LOKATIF), beklenen);
});

test('ayLokatif(ay) 1-12 aralığında doğru indeksi okur', () => {
  assert.equal(metinler.ayLokatif(1), "Ocak'ta");
  assert.equal(metinler.ayLokatif(9), "Eylül'de");
  assert.equal(metinler.ayLokatif(12), "Aralık'ta");
});

test('ayLokatif(ay) aralık dışı değerlerde 12 modunda sarar', () => {
  assert.equal(metinler.ayLokatif(0), "Aralık'ta");
  assert.equal(metinler.ayLokatif(13), "Ocak'ta");
});
