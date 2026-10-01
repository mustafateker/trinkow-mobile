const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');
const { ayarGorunumDurumu } = yukle('src/lib/ayarGorunumu.ts');

// Kapanış QA bulgusu: `ayarVerisi.error` okunmadığı için ağ hatasında
// sessizce "Henüz ayarlanmadı" boş-durum metnine düşülüyordu. Bu test
// veri YOKLUĞU ile veri OKUNAMAMASI'nın karıştırılmadığını kilitler.

test('yükleme sürerken iskelet döner (hata henüz set edilmemiş olsa bile)', () => {
  assert.equal(ayarGorunumDurumu({ loading: true, error: '', data: null }), 'iskelet');
});

test('ağ hatasında ve hiç veri yokken hata döner — boş-durum metnine düşmez', () => {
  assert.equal(ayarGorunumDurumu({ loading: false, error: 'Bilgiler yüklenemedi.', data: null }), 'hata');
});

test('daha önce yüklenmiş veri varsa yeniden deneme başarısız olsa da eski veri gösterilmeye devam eder', () => {
  assert.equal(ayarGorunumDurumu({ loading: false, error: 'Bilgiler yüklenemedi.', data: { gelirKurus: 100000 } }), 'hazir');
});

test('hata yokken ve veri varken hazır döner', () => {
  assert.equal(ayarGorunumDurumu({ loading: false, error: '', data: { gelirKurus: 100000 } }), 'hazir');
});
