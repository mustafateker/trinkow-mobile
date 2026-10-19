const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');
const tercih = { locale: 'tr-TR', currency: 'TRY' };
const para = yukle('src/lib/para.ts', {
  '@/lib/yerellestirme': {
    localeKodu: () => tercih.locale,
    paraBirimi: () => tercih.currency,
  },
});

test('native para girişi virgül ve noktayı ondalık kabul eder', () => {
  assert.equal(para.nativeTutarGirisi('12,34'), '12,34');
  assert.equal(para.nativeTutarGirisi('12.34'), '12,34');
  assert.equal(para.tutarGirisindenKurus(para.nativeTutarGirisi('12.34')), 1234);
});

test('yapıştırılan Türkçe ve İngilizce biçimler kuruş kaybetmez', () => {
  assert.equal(para.nativeTutarGirisi('₺ 1.250,75'), '1250,75');
  assert.equal(para.nativeTutarGirisi('1,250.75 TL'), '1250,75');
  assert.equal(para.nativeTutarGirisi('1.234.567'), '1234567');
});

test('para eksi değerleri tek işaretle biçimler', () => {
  assert.equal(para.paraYaz(-12345, true), '-123,45 ₺');
});

test('para seçimi aktif para birimini ve locale ayıracını uygular', () => {
  tercih.locale = 'en-US';
  tercih.currency = 'USD';
  assert.equal(para.paraYaz(123456, true), '$1,234.56');

  tercih.locale = 'de-DE';
  tercih.currency = 'EUR';
  assert.equal(para.paraYaz(123456, true), '1.234,56 €');
});
