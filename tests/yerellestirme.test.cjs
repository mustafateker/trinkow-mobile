const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const yerellestirme = yukle('src/lib/yerellestirme.ts');

test('varsayılan uygulama dili İngilizcedir', () => {
  assert.equal(yerellestirme.dilKodu(), 'en');
});

test('dil değişikliği abonelere anında bildirilir', () => {
  let bildirimSayisi = 0;
  const aboneliktenCik = yerellestirme.yerellestirmeDegisimineAbone(() => {
    bildirimSayisi += 1;
  });

  yerellestirme.yerellestirmeAyarla({ dil: 'tr' });
  assert.equal(yerellestirme.dilKodu(), 'tr');
  assert.equal(bildirimSayisi, 1);
  aboneliktenCik();
});
