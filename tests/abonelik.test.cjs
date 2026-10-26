const test = require('node:test');
const assert = require('node:assert/strict');
const { yukle, i18n } = require('./yukle.cjs');

// Metinler dil çekirdeğinden (`i18n()`), tarih biçimi `localeKodu`ndan gelir.
const dil = { locale: 'tr-TR' };
const yerellestirme = {
  localeKodu: () => dil.locale,
};
const metinler = yukle('src/content/metinler.ts');
const { abonelikTarihBilgisi, abonelikDurumEtiketi, abonelikTarihEtiketi } = yukle('src/lib/abonelik.ts', {
  '@/content/metinler': metinler,
  '@/lib/yerellestirme': yerellestirme,
});

test('gelecek yenilenme gününü hesaplar', () => {
  const sonuc = abonelikTarihBilgisi(20, '2026-10-16', null);
  assert.equal(sonuc.siradakiGun, '2026-10-20');
  assert.equal(abonelikDurumEtiketi(sonuc), '4 gün kaldı');
});

test('geçmiş yenilenmeyi gecikmiş gösterir', () => {
  const sonuc = abonelikTarihBilgisi(10, '2026-10-16', null);
  assert.equal(sonuc.durum, 'gecikti');
  assert.equal(abonelikDurumEtiketi(sonuc), '6 gün gecikti');
});

test('bu ay ödendiyse sonraki aya geçer', () => {
  const sonuc = abonelikTarihBilgisi(10, '2026-10-16', '2026-10-10');
  assert.equal(sonuc.siradakiGun, '2026-11-10');
  assert.equal(abonelikDurumEtiketi(sonuc), 'Bu ay ödendi');
});

test('ayın 31i kısa ayda son güne sabitlenir', () => {
  const sonuc = abonelikTarihBilgisi(31, '2027-02-10', null);
  assert.equal(sonuc.siradakiGun, '2027-02-28');
});

test('abonelik tarih etiketleri ve durumları seçili dili kullanır', (ctx) => {
  i18n().diliAyarla('en');
  dil.locale = 'en-US';
  ctx.after(() => {
    i18n().diliAyarla('tr');
    dil.locale = 'tr-TR';
  });
  assert.equal(abonelikTarihEtiketi('2026-10-17'), 'October 17');
  assert.equal(abonelikDurumEtiketi({
    siradakiGun: '2026-10-17',
    gunFarki: 1,
    buAyOdendi: false,
    durum: 'yaklasiyor',
  }), '1 day left');
  assert.equal(abonelikDurumEtiketi({
    siradakiGun: '2026-10-17',
    gunFarki: -2,
    buAyOdendi: false,
    durum: 'gecikti',
  }), '2 days overdue');
  assert.equal(abonelikDurumEtiketi({
    siradakiGun: '2026-10-17',
    gunFarki: 0,
    buAyOdendi: false,
    durum: 'bugun',
  }), 'Renews today');
  assert.equal(abonelikDurumEtiketi({
    siradakiGun: '2026-11-17',
    gunFarki: 31,
    buAyOdendi: true,
    durum: 'odendi',
  }), 'Paid this month');
});
