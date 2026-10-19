const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const locale = { value: 'tr-TR' };
const { ayYilEtiketi } = yukle('src/lib/tarih.ts', {
  '@/lib/yerellestirme': { localeKodu: () => locale.value },
});

test('ay ve yıl etiketi aktif locale göre biçimlenir', () => {
  assert.equal(ayYilEtiketi('2026-10'), 'Ekim 2026');
  locale.value = 'en-US';
  assert.equal(ayYilEtiketi('2026-10'), 'October 2026');
  locale.value = 'tr-TR';
});
