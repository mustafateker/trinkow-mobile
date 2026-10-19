const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');
const dil = { ingilizce: false };
const metinler = yukle('src/content/metinler.ts', {
  '@/lib/yerellestirme': { ingilizceMi: () => dil.ingilizce },
});

// AY_LOKATIF yanlış eklerle yazılmıştı (düzeltildi) — 12 ayın tamamı için
// doğru bulunma hâli eki burada kilitlenir.
const beklenen = [
  "Ocak'ta", "Şubat'ta", "Mart'ta", "Nisan'da", "Mayıs'ta", "Haziran'da",
  "Temmuz'da", "Ağustos'ta", "Eylül'de", "Ekim'de", "Kasım'da", "Aralık'ta",
];

test('AY_LOKATIF 12 ay için doğru bulunma hâli ekini üretir', () => {
  // vm bağlamından gelen dizi ayrı bir realm'e ait; deepEqual bunu
  // reference-eşitliği sorunuyla karıştırmasın diye düz diziye çevrilir.
  assert.deepEqual(Array.from(metinler.AY_LOKATIF), beklenen);
});

test('ayLokatif(ay) 1-12 aralığında doğru indeksi okur', () => {
  assert.equal(metinler.ayLokatif(1), "Ocak'ta");
  assert.equal(metinler.ayLokatif(9), "Eylül'de");
  assert.equal(metinler.ayLokatif(12), "Aralık'ta");
});

test('ayLokatif(ay) aralık dışı değerlerde 12 modunda sarar', () => {
  assert.equal(metinler.ayLokatif(0), "Aralık'ta");
  assert.equal(metinler.ayLokatif(13), "Ocak'ta");
});

test('her Türkçe metin anahtarının İngilizce karşılığı bulunur', () => {
  const english = yukle('src/content/metinler.en.ts').en;
  const missing = Object.keys(metinler.t).filter((key) => typeof english[key] !== 'string');
  assert.deepEqual(missing, []);
});

test('t aktif dili anında kullanır', () => {
  assert.equal(metinler.t['ayar.dil'], 'Dil');
  dil.ingilizce = true;
  assert.equal(metinler.t['ayar.dil'], 'Language');
  assert.equal(metinler.t['ayar.para_birimi'], 'Currency');
  dil.ingilizce = false;
});

test('dinamik metinler İngilizce şablonları değerlerle doldurur ve çoğulları seçer', () => {
  dil.ingilizce = true;
  assert.equal(metinler.panoLimitsizOzet(1), 'You logged 1 expense today. Remaining amount is not shown because you have no limit.');
  assert.equal(metinler.panoLimitsizOzet(3), 'You logged 3 expenses today. Remaining amount is not shown because you have no limit.');
  assert.equal(metinler.taksitOzetKategorili(1, 2), '1 category · 2 items');
  assert.equal(metinler.altAltinda('$20', '$5'), 'You spent $20 today. You are $5 under your limit.');
  dil.ingilizce = false;
});

test('dinamik tarih ve özel durum etiketleri seçili dili kullanır', () => {
  assert.equal(metinler.ayLokatif(9), "Eylül'de");
  dil.ingilizce = true;
  assert.equal(metinler.ayLokatif(9), 'in September');
  assert.equal(metinler.tasarrufGostergeCumleGecmisAy(metinler.ayLokatif(1), 8), 'Based on the income and expenses entered in January, 8 days were calculated.');
  assert.equal(metinler.gunsecA11yGun('Monday, September 9', 'under the limit', true), 'Monday, September 9, under the limit, today');
  assert.equal(metinler.seriGunA11y('9', 'disinda'), '9, over the limit');
  assert.equal(metinler.kutlamaGovde(30, null), 'You reached a 30-day streak.');
  dil.ingilizce = false;
});

test('abonelik ve rutin metinleri İngilizce şablonları ve çoğulları kullanır', () => {
  dil.ingilizce = true;
  assert.equal(metinler.abonelikGecikmeGun(1), '1 day overdue');
  assert.equal(metinler.abonelikGecikmeGun(4), '4 days overdue');
  assert.equal(metinler.abonelikKalanGun(1), '1 day left');
  assert.equal(metinler.abonelikSilGovde('Netflix'), '“Netflix” will be removed from your tracking list. Past expenses will be kept.');
  assert.equal(metinler.abonelikAdiylaEkle('My service'), 'Add “My service” as a subscription');
  assert.equal(metinler.abonelikServisSayisi(1), '1 service');
  assert.equal(metinler.abonelikServisSayisi(2), '2 services');
  assert.equal(metinler.rutinSatiriA11y('Coffee', 'Cafe', 2, '$3'), 'Coffee. Cafe, 2 per day × $3. Edit.');
  assert.equal(metinler.rutinGunlukOzeti(2, '$3'), '2 per day × $3');
  assert.equal(metinler.rutinKaldirA11y('Coffee'), 'Remove Coffee routine');
  assert.equal(metinler.onboardingRutinSatiriA11y('Coffee', '2 each day × $3', '$6'), 'Coffee, 2 each day × $3, daily total $6. Edit.');
  assert.equal(metinler.abonelikSatiriA11y('Netflix', '$10', 'Renews today'), 'Netflix, $10, Renews today. Edit.');
  assert.equal(metinler.abonelikKayitliA11y('Netflix'), 'Netflix recorded as an expense');
  assert.equal(metinler.abonelikYenilendiyseEkleA11y('Netflix', '$10'), 'If Netflix renewed, add $10 as an expense');
  assert.equal(metinler.yarinTekAbonelikUyarisi('Netflix', '$10'), 'Tomorrow, your Netflix subscription will renew automatically for $10. Cancel it if you no longer use it.');
  assert.equal(metinler.yarinCokluAbonelikUyarisi(2, '$20'), 'Tomorrow, 2 subscriptions will renew automatically for $20 in total. Cancel any you no longer use.');
  assert.equal(metinler.rutinAlimSayisiBugun(2), 'Today · 2 times');
  assert.equal(metinler.harcamaSatiriA11y('Coffee', '$3', '9:00 AM · Card', true), 'Coffee, $3, 9:00 AM · Card, over the limit');
  assert.equal(metinler.hesapAcA11y('a@example.com', '12 expenses', 'this month'), 'Open your account. a@example.com. 12 expenses, this month');
  assert.equal(metinler.hesapEpostasiA11y('a@example.com'), 'Account email a@example.com');
  assert.equal(metinler.tasarrufGenelDurumA11y('$40'), 'Overall savings status: $40');
  assert.equal(metinler.kategoriPayA11y('Cafe'), 'Cafe share');
  assert.equal(metinler.tasarrufDonemiA11y('Month'), 'Savings period: Month');
  assert.equal(metinler.favoriOzet('Cafe', '$3'), 'Cafe · Last price $3');
  assert.equal(metinler.favoriHarcamaA11y('Coffee', 'Cafe · Last price $3'), 'Coffee. Cafe · Last price $3. Add expense.');
  assert.equal(metinler.favoriKaldirA11y('Coffee'), 'Remove Coffee from favorites');
  assert.equal(metinler.kategoriLimitKaldirA11y('Cafe'), 'Remove Cafe limit');
  assert.equal(metinler.taksitKisaEtiketi(3, 12), ' · installment 3 of 12');
  assert.equal(metinler.tutarDuzeltA11y(false), 'Edit amount');
  assert.equal(metinler.tutarDuzeltA11y(true), 'Close amount editor');
  dil.ingilizce = false;
});
