const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle, i18n } = require('./yukle.cjs');

const metinler = yukle('src/content/metinler.ts');

/** Gövdeyi İngilizce'de çalıştırır, sonra Türkçe'ye döner (dil paketleri `yukle.cjs#i18n`de kayıtlı). */
function ingilizce(govde) {
  i18n().diliAyarla('en');
  try {
    govde();
  } finally {
    i18n().diliAyarla('tr');
  }
}

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
  const tr = yukle('src/i18n/kaynaklar/tr.ts').default.metinler;
  const en = yukle('src/i18n/kaynaklar/en.ts').default.metinler;
  const eksik = Object.keys(tr).filter((anahtar) => typeof en[anahtar] !== 'string' || en[anahtar] === '');
  assert.deepEqual(eksik, []);
});

test('t aktif dili anında kullanır', () => {
  assert.equal(metinler.t['ayar.dil'], 'Dil');
  ingilizce(() => {
    assert.equal(metinler.t['ayar.dil'], 'Language');
    assert.equal(metinler.t['ayar.para_birimi'], 'Currency');
  });
  assert.equal(metinler.t['ayar.dil'], 'Dil');
});

test('cümle fonksiyonları İngilizce şablonları değerlerle doldurur ve çoğulları seçer', () => {
  ingilizce(() => {
    assert.equal(metinler.panoLimitsizOzet(1), "You've logged 1 entry today. Since you haven't set a limit, there's no remaining amount to show.");
    assert.equal(metinler.panoLimitsizOzet(3), "You've logged 3 entries today. Since you haven't set a limit, there's no remaining amount to show.");
    assert.equal(metinler.taksitOzetKategorili(1, 2), '1 category · 2 items');
    assert.equal(metinler.altAltinda('$20', '$5'), "$20 spent today. You're $5 under your limit.");
  });
});

test('tarih ve özel durum cümleleri seçili dili kullanır', () => {
  assert.equal(metinler.ayLokatif(9), "Eylül'de");
  ingilizce(() => {
    assert.equal(metinler.ayLokatif(9), 'in September');
    assert.equal(metinler.tasarrufGostergeCumleGecmisAy(metinler.ayLokatif(1), 8), 'Calculated for 8 days based on the income and expenses you logged in January.');
    assert.equal(metinler.gunsecA11yGun('Monday, September 9', 'under the limit', true), 'Monday, September 9, under the limit, today');
    assert.equal(metinler.seriGunA11y('9', 'disinda'), '9, over limit');
    assert.equal(metinler.kutlamaGovde(30, null), 'Your streak reached 30 days.');
  });
});

test('günlük rutin bölüm etiketi güncel bölüm başlığını kullanır', () => {
  assert.equal(metinler.a11yGunlukRutinBolumGecmis('16 Eylül', '3 rutin · 2 işaretsiz'), 'Rutinler ve Abonelikler. 16 Eylül. 3 rutin · 2 işaretsiz');
  ingilizce(() => {
    assert.equal(metinler.a11yGunlukRutinBolum('3 routines'), 'Routines and Subscriptions. 3 routines');
  });
});

test('abonelik ve rutin metinleri İngilizce şablonları ve çoğulları kullanır', () => {
  ingilizce(() => {
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
  });
});
