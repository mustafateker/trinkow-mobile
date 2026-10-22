const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const locale = { value: 'tr-TR' };
const { aySonGunu, ayYilEtiketi } = yukle('src/lib/tarih.ts', {
  '@/lib/yerellestirme': { localeKodu: () => locale.value },
});

test('ay sonu API sorguları için her ay geçerli gün üretir', () => {
  assert.equal(aySonGunu('2026-09'), '2026-09-30');
  assert.equal(aySonGunu('2026-02'), '2026-02-28');
  assert.equal(aySonGunu('2028-02'), '2028-02-29');
  assert.equal(aySonGunu('2026-12'), '2026-12-31');
});

test('ay ve yıl etiketi aktif locale göre biçimlenir', () => {
  assert.equal(ayYilEtiketi('2026-10'), 'Ekim 2026');
  locale.value = 'en-US';
  assert.equal(ayYilEtiketi('2026-10'), 'October 2026');
  locale.value = 'tr-TR';
});
