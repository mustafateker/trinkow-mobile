const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const dil = { english: false };
const metinler = yukle('src/content/metinler.ts', {
  '@/lib/yerellestirme': { ingilizceMi: () => dil.english },
});
const donem = yukle('src/lib/tasarrufDonem.ts', {
  '@/content/metinler': metinler,
  '@/lib/tarih': {},
});

test('tasarruf dönemi etiketleri seçili dili kullanır', () => {
  assert.deepEqual(
    Array.from(donem.TASARRUF_DONEMLERI, ({ value, labelKey }) => [value, metinler.t[labelKey]]),
    [['gun', 'Gün'], ['hafta', 'Hafta'], ['ay', 'Ay'], ['yil', 'Yıl']],
  );
  assert.equal(donem.tasarrufDonemKisaEtiketi('hafta'), 'Hafta');
  dil.english = true;
  assert.deepEqual(
    Array.from(donem.TASARRUF_DONEMLERI, ({ value, labelKey }) => [value, metinler.t[labelKey]]),
    [['gun', 'Day'], ['hafta', 'Week'], ['ay', 'Month'], ['yil', 'Year']],
  );
  assert.equal(donem.tasarrufDonemKisaEtiketi('hafta'), 'Week');
  dil.english = false;
});
