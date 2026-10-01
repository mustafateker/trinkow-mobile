const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

// D-2c-1 · E-20 bağlamsal profilleme (F-12) — `aktifProfillemeSorusu` karar
// tablosunu kilitler: gün eşikleri (yatirim=2 · taksit=3 · bildirim=4),
// "günde en fazla 1", 14 gün red cooldown, cevaplanmışlık ve onboarding
// koşulu. Bu testler yokken 2026-09 turunda "kartlar hiç çıkmıyor" şüphesi
// araştırıldı; kod tarafında kanıtlanmış bir mantık hatası BULUNAMADI (bkz.
// PM raporu) — bu dosya bulguyu regresyona karşı sabitler.

const tarih = yukle('src/lib/tarih.ts');

const RealDate = Date;
function mockDate(isoAn) {
  const hedef = new RealDate(isoAn);
  return class MockDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) { super(hedef.getTime()); return; }
      super(...args);
    }
    static now() { return hedef.getTime(); }
  };
}

/**
 * `aktifProfillemeSorusu`yu izole kurar. `kurulum` = "YYYY-MM-DD" kurulum
 * günü, `su_an` = kontrolün yapıldığı an (ISO), `cevaplar`/`bildirimBelirlendi`
 * sunucudaki cevaplanmışlık durumunu, `ayar` yerel `ayar` tablosunu taklit eder.
 */
function kur({ kurulum, suAn, cevaplar = {}, bildirimBelirlendi = false, ayar = {}, onboardingTamamlandi = true }) {
  return yukle('src/db/profilleme.ts', {
    '@/db/ayarTercihleri': {
      kurulumGunuOku: async () => kurulum,
      bildirimTercihBelirlendiMi: async () => bildirimBelirlendi,
      bildirimAksamOzetKaydet: async () => {},
    },
    '@/db/harcama': {
      ayarOku: async (_db, k) => ayar[k] ?? null,
      ayarYaz: async (_db, k, v) => { ayar[k] = v; },
    },
    '@/db/profil': {
      profilDetayAlanKaydet: async () => {},
      profilDetayOku: async () => ({ yatirimNiyet: null, taksitSiklik: null, ...cevaplar }),
      profilOku: async () => ({ onboardingTamamlandi }),
    },
    '@/lib/tarih': tarih,
  }, { Date: mockDate(suAn) });
}

test('onboarding tamamlanmadıysa hiçbir soru gösterilmez (gün eşiği geçmiş olsa bile)', async () => {
  const prof = kur({ kurulum: '2026-09-20', suAn: '2026-09-26T10:00:00', onboardingTamamlandi: false });
  assert.equal(await prof.aktifProfillemeSorusu({}), null);
});

test('kurulum günü = gün 1 — eşik gün 2 olan Yatırım henüz gösterilmez', async () => {
  // suAn == kurulum günüyle aynı takvim günü → kurulumdanBuGune() = 1.
  const prof = kur({ kurulum: '2026-09-20', suAn: '2026-09-20T10:00:00' });
  assert.equal(await prof.aktifProfillemeSorusu({}), null);
});

test('gün 2 (kurulumdan +1 tam gün) — Yatırım sorusu döner', async () => {
  const prof = kur({ kurulum: '2026-09-20', suAn: '2026-09-21T10:00:00' });
  assert.equal(await prof.aktifProfillemeSorusu({}), 'yatirim');
});

test('gün 3 — Yatırım cevaplanmışsa sıradaki Taksit sorusu döner', async () => {
  const prof = kur({
    kurulum: '2026-09-20',
    suAn: '2026-09-22T10:00:00',
    cevaplar: { yatirimNiyet: 'yapiyorum' },
  });
  assert.equal(await prof.aktifProfillemeSorusu({}), 'taksit');
});

test('gün 3 ama Taksit de cevaplanmış — henüz gün 4 olmadığından Bildirim gösterilmez', async () => {
  const prof = kur({
    kurulum: '2026-09-20',
    suAn: '2026-09-22T10:00:00',
    cevaplar: { yatirimNiyet: 'yapiyorum', taksitSiklik: 'bazen' },
  });
  assert.equal(await prof.aktifProfillemeSorusu({}), null);
});

test('üçü de cevaplanınca bileşen bir daha hiç görünmez (gün 4+)', async () => {
  const prof = kur({
    kurulum: '2026-09-20',
    suAn: '2026-09-30T10:00:00',
    cevaplar: { yatirimNiyet: 'yapiyorum', taksitSiklik: 'bazen' },
    bildirimBelirlendi: true,
  });
  assert.equal(await prof.aktifProfillemeSorusu({}), null);
});

test('günde en fazla 1 — bugün zaten gösterildiyse eşik geçmiş başka bir soru bile çıkmaz', async () => {
  const prof = kur({
    kurulum: '2026-09-20',
    suAn: '2026-09-25T10:00:00', // gün 6, üç soru da eşiği geçti
    ayar: { profilleme_son_gosterim_gun: '2026-09-25' },
  });
  assert.equal(await prof.aktifProfillemeSorusu({}), null);
});

test('reddedilen soru 14 gün dolmadan geri gelmez', async () => {
  const prof = kur({
    kurulum: '2026-09-20',
    suAn: '2026-10-02T10:00:00', // red'den 13 gün sonra
    ayar: { profilleme_red_yatirim: '2026-09-19' },
  });
  // 2026-09-19'dan 2026-10-02'ye 13 gün — hâlâ cooldown içinde, sıradaki soruya geç.
  assert.equal(await prof.aktifProfillemeSorusu({}), 'taksit');
});

test('reddedilen soru 14 gün dolunca geri gelir', async () => {
  const prof = kur({
    kurulum: '2026-09-20',
    suAn: '2026-10-04T10:00:00', // red'den 15 gün sonra
    ayar: { profilleme_red_yatirim: '2026-09-19' },
  });
  assert.equal(await prof.aktifProfillemeSorusu({}), 'yatirim');
});

test('profillemeReddet çağrısı red tarihini VE günlük gösterim damgasını yazar', async () => {
  const ayar = {};
  const prof = kur({ kurulum: '2026-09-20', suAn: '2026-09-25T10:00:00', ayar });
  await prof.profillemeReddet({}, 'yatirim');
  assert.equal(ayar['profilleme_red_yatirim'], '2026-09-25');
  assert.equal(ayar['profilleme_son_gosterim_gun'], '2026-09-25');
});
