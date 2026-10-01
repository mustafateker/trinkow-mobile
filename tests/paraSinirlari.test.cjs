const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');
const para = yukle('src/lib/para.ts');

// `MoneyField`/`MoneyRow` (via `MoneyInput`) bu fonksiyonların üzerine
// kurulu; render altyapısı olmadığı için sınır davranışı doğrudan `para.ts`
// üzerinden kilitlenir (para.test.cjs zaten kapsadığı yolları tekrar etmez).

test('boş giriş: hiçbir yol NaN/undefined üretmez, 0 kuruş sayılır', () => {
  assert.equal(para.nativeTutarGirisi(''), '');
  assert.equal(para.tutarGirisindenKurus(''), 0);
  assert.equal(para.tutarGosterimi(''), '0');
});

test('sıfır tutar tüm gösterim yollarında "0" olarak basılır', () => {
  assert.equal(para.sayiyaCevir(0), '0');
  assert.equal(para.paraYaz(0), '0 ₺');
  assert.equal(para.paraYaz(0, true), '0,00 ₺');
  assert.equal(para.tutarGirisindenKurus('0'), 0);
});

test('çok büyük tutar eşiği (E-11/E-12) tam sınırda aşılmaz, bir kuruş üstünde aşılır', () => {
  const esikGirisi = para.nativeTutarGirisi('100.000');
  const esikUstuGirisi = para.nativeTutarGirisi('100.000,01');
  assert.equal(para.tutarGirisindenKurus(esikGirisi), para.TUTAR_BUYUK_ESIK_KURUS);
  assert.equal(para.tutarGirisindenKurus(esikGirisi) > para.TUTAR_BUYUK_ESIK_KURUS, false);
  assert.equal(para.tutarGirisindenKurus(esikUstuGirisi) > para.TUTAR_BUYUK_ESIK_KURUS, true);
});

test('kuruş hassasiyeti: tek haneli kuruş sağa 0 ile tamamlanır, kaybolmaz', () => {
  assert.equal(para.tutarGirisindenKurus('12,3'), 1230);
  assert.equal(para.tutarGirisindenKurus('12,34'), 1234);
  assert.equal(para.tutarGosterimi('12,3'), '12,3');
});

test('çok büyük tutar float hatasına düşmeden kuruş cinsinden doğru biçimlenir', () => {
  assert.equal(para.paraYaz(123456789012, true), '1.234.567.890,12 ₺');
  const girisBuffer = para.nativeTutarGirisi('1.234.567,89');
  assert.equal(Number.isInteger(para.tutarGirisindenKurus(girisBuffer)), true);
  assert.equal(para.tutarGirisindenKurus(girisBuffer), 123456789);
});
