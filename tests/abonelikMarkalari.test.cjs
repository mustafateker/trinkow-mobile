const test = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const {
  ABONELIK_MARKALARI,
  abonelikMarkalariniAra,
  abonelikMarkasiBul,
  populerAbonelikMarkalari,
} = yukle('src/lib/abonelikMarkalari.ts');

test('global abonelik kataloğu popüler servisleri kapsar', () => {
  assert.ok(ABONELIK_MARKALARI.length >= 45);
  const populer = populerAbonelikMarkalari().map((marka) => marka.id);
  assert.ok(populer.includes('netflix'));
  assert.ok(populer.includes('amazon-prime'));
  assert.ok(populer.includes('spotify'));
  assert.ok(populer.includes('chatgpt'));
});

test('arama ad, sağlayıcı kodu ve alternatif adlarda çalışır', () => {
  assert.equal(abonelikMarkalariniAra('hbo')[0].id, 'max');
  assert.equal(abonelikMarkalariniAra('office 365')[0].id, 'microsoft-365');
  assert.equal(abonelikMarkalariniAra('NVIDIA')[0].id, 'geforce-now');
  assert.equal(abonelikMarkalariniAra('Duo')[0].id, 'duolingo-super');
});

test('eski kayıt sağlayıcı kodu yoksa adından marka bulur', () => {
  assert.equal(abonelikMarkasiBul('apple', 'Apple').id, 'apple-one');
  assert.equal(abonelikMarkasiBul(null, 'ChatGPT Plus').id, 'chatgpt');
  assert.equal(abonelikMarkasiBul(null, 'Yerel spor salonu').id, 'diger');
});
