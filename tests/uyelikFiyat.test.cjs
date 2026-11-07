const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const fiyat = yukle('src/lib/uyelikFiyat.ts');

test('ücretsiz deneme süresi güne çevrilir (P7D ve P1W yedi gün)', () => {
  assert.equal(fiyat.denemeGunSayisi('DAY', 7), 7);
  assert.equal(fiyat.denemeGunSayisi('WEEK', 1), 7);
  assert.equal(fiyat.denemeGunSayisi('MONTH', 1), null);
  assert.equal(fiyat.denemeGunSayisi(null, 7), null);
  assert.equal(fiyat.denemeGunSayisi('DAY', 0), null);
});

test('Trinkow fiyatlarında indirim yüzdesi 50 çıkar (USD ve TL)', () => {
  assert.equal(fiyat.indirimYuzdesi(15.99, 7.99), 50);
  assert.equal(fiyat.indirimYuzdesi(79.99, 39.99), 50);
  assert.equal(fiyat.indirimYuzdesi(198.99, 99), 50);
  assert.equal(fiyat.indirimYuzdesi(998.99, 499), 50);
});

test('indirim yoksa ya da fiyat geçersizse yüzde gösterilmez', () => {
  assert.equal(fiyat.indirimYuzdesi(7.99, 7.99), null);
  assert.equal(fiyat.indirimYuzdesi(7.99, 15.99), null);
  assert.equal(fiyat.indirimYuzdesi(0, 7.99), null);
  assert.equal(fiyat.indirimYuzdesi(null, 7.99), null);
});

test('paywall ekranı oturum-açık korumalı ekran grubunda listeli', () => {
  const kaynak = fs.readFileSync(path.resolve(__dirname, '..', 'app/_layout.tsx'), 'utf8');
  const baslangic = kaynak.indexOf("guard={durum === 'acik'}");
  const acikGrubu = kaynak.slice(baslangic, kaynak.indexOf('</Stack.Protected>', baslangic));
  assert.match(acikGrubu, /<Stack\.Screen name="premium" /);
});

test('paywall ve kilit ekranları sabit Türkçe metin içermez ve rozeti ClayPressable dışında tutar', () => {
  const paywall = fs.readFileSync(path.resolve(__dirname, '..', 'app/premium.tsx'), 'utf8');
  const kilit = fs.readFileSync(path.resolve(__dirname, '..', 'src/components/PremiumKilidi.tsx'), 'utf8');
  assert.doesNotMatch(paywall, /toUpperCase\(\)/, 'locale-duyarlı toLocaleUpperCase kullanılmalı');
  assert.doesNotMatch(kilit, /toUpperCase\(\)/, 'locale-duyarlı toLocaleUpperCase kullanılmalı');
  assert.doesNotMatch(paywall, /Yıllık faturalandırılır|Aylık yenilenir|tek tıkla iptal/);
  assert.doesNotMatch(kilit, /Harcama Trendi|Birikim & Tasarruf|Önizleme|\+₺1\.450/);
  const rozetKonumu = paywall.indexOf('stil.avantajBadge');
  const basilebilirKonumu = paywall.indexOf('<ClayPressable', rozetKonumu);
  assert.ok(rozetKonumu > 0 && basilebilirKonumu > rozetKonumu, 'avantajBadge ClayPressable overflow:hidden dışında olmalı');
});
