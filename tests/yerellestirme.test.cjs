const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const yerellestirme = yukle('src/lib/yerellestirme.ts');

test('varsayılan uygulama dili Türkçedir', () => {
  assert.equal(yerellestirme.dilKodu(), 'tr');
});

test('dil değişikliği abonelere anında bildirilir', () => {
  let bildirimSayisi = 0;
  const aboneliktenCik = yerellestirme.yerellestirmeDegisimineAbone(() => {
    bildirimSayisi += 1;
  });

  yerellestirme.yerellestirmeAyarla({ dil: 'en' });
  assert.equal(yerellestirme.dilKodu(), 'en');
  assert.equal(bildirimSayisi, 1);
  aboneliktenCik();
});
