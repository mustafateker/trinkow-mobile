const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle, i18n } = require('./yukle.cjs');

const { aySonGunu, ayYilEtiketi } = yukle('src/lib/tarih.ts');

test('ay sonu API sorguları için her ay geçerli gün üretir', () => {
  assert.equal(aySonGunu('2026-09'), '2026-09-30');
  assert.equal(aySonGunu('2026-02'), '2026-02-28');
  assert.equal(aySonGunu('2028-02'), '2028-02-29');
  assert.equal(aySonGunu('2026-12'), '2026-12-31');
});

test('ay ve yıl etiketi aktif dile göre biçimlenir', () => {
  assert.equal(ayYilEtiketi('2026-10'), 'Ekim 2026');
  i18n().diliAyarla('en');
  try {
    assert.equal(ayYilEtiketi('2026-10'), 'October 2026');
  } finally {
    i18n().diliAyarla('tr');
  }
});
