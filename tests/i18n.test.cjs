const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

// Her test kendi çekirdek örneğiyle çalışır (paylaşılan Türkçe örneği kirletmez).
function yeniCekirdek() {
  const cekirdek = yukle('src/i18n/cekirdek.ts');
  const tr = yukle('src/i18n/kaynaklar/tr.ts').default;
  cekirdek.paketKaydet('tr', tr);
  return { cekirdek, tr };
}

/** Türkçe paketin kopyası; verilen metinler üstüne yazılır, eksik bırakılanlar silinir. */
function sahtePaket(tr, metinler, eksik = []) {
  const kopya = { ...tr.metinler, ...metinler };
  for (const k of eksik) delete kopya[k];
  return { ...tr, metinler: kopya, takvim: { ...tr.takvim, aylar: tr.takvim.aylar.map((a) => `X-${a}`) } };
}

test('cihaz dili desteklenen dile eşlenir, tanınmayan dil İngilizce olur (ActivationKing MapToSupportedLanguage)', () => {
  const { cekirdek } = yeniCekirdek();
  assert.equal(cekirdek.desteklenenDil('tr-TR'), 'tr');
  assert.equal(cekirdek.desteklenenDil('de-AT'), 'de');
  assert.equal(cekirdek.desteklenenDil('pt_BR'), 'pt');
  assert.equal(cekirdek.desteklenenDil('CS'), 'cs');
  assert.equal(cekirdek.desteklenenDil('ja'), 'en');
  assert.equal(cekirdek.desteklenenDil(''), 'en');
  assert.equal(cekirdek.desteklenenDil(null), 'en');
  // vm bağlamından gelen dizi ayrı realm'e ait; düz diziye çevrilir.
  assert.deepEqual(Array.from(cekirdek.DILLER, (d) => d.kod), ['en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'ro', 'pl', 'ru', 'cs']);
});

test('çoğul kuralları (CLDR, tam sayı)', () => {
  const { cekirdek } = yeniCekirdek();
  const k = (dil, n) => cekirdek.cogulKategorisi(dil, n);
  assert.deepEqual([0, 1, 2, 5].map((n) => k('en', n)), ['other', 'one', 'other', 'other']);
  assert.deepEqual([0, 1, 2].map((n) => k('fr', n)), ['one', 'one', 'other']);
  assert.deepEqual([1, 2, 4, 5, 11, 12, 21, 22, 25, 111].map((n) => k('ru', n)),
    ['one', 'few', 'few', 'many', 'many', 'many', 'one', 'few', 'many', 'many']);
  assert.deepEqual([1, 2, 4, 5, 12, 21, 22, 25].map((n) => k('pl', n)),
    ['one', 'few', 'few', 'many', 'many', 'many', 'few', 'many']);
  assert.deepEqual([0, 1, 2, 4, 5].map((n) => k('cs', n)), ['other', 'one', 'few', 'few', 'other']);
  assert.deepEqual([0, 1, 2, 19, 20, 101, 120].map((n) => k('ro', n)), ['few', 'one', 'few', 'few', 'other', 'few', 'other']);
  assert.deepEqual([1, 3].map((n) => k('tr', n)), ['one', 'other']);
});

test('şablon biçimleme: yer tutucu, çoğul (#, =0), seçim, eksik değer, kesme işareti', () => {
  const { cekirdek } = yeniCekirdek();
  const b = (s, d, dil = 'en') => cekirdek.bicimle(s, d, dil);
  assert.equal(b('{tutar} kaydedildi', { tutar: '50 ₺' }, 'tr'), '50 ₺ kaydedildi');
  assert.equal(b("{gAy}'ta başladın", { gAy: '12 Eylül' }, 'tr'), "12 Eylül'ta başladın");
  const gun = '{n, plural, =0 {no days} one {# day} other {# days}} left';
  assert.equal(b(gun, { n: 0 }), 'no days left');
  assert.equal(b(gun, { n: 1 }), '1 day left');
  assert.equal(b(gun, { n: 7 }), '7 days left');
  const ru = '{n, plural, one {# день} few {# дня} many {# дней} other {# дня}}';
  assert.deepEqual([1, 3, 5, 21].map((n) => b(ru, { n }, 'ru')), ['1 день', '3 дня', '5 дней', '21 день']);
  assert.equal(b('{n, plural, one {{ad}: # item} other {{ad}: # items}}', { n: 2, ad: 'Kahve' }), 'Kahve: 2 items');
  const sec = '{hal, select, gecildi {passed} sirada {next} other {ahead}}';
  assert.equal(b(sec, { hal: 'sirada' }), 'next');
  assert.equal(b(sec, { hal: 'ileride' }), 'ahead');
  assert.equal(b('Merhaba {ad}', {}), 'Merhaba {ad}');
});

test('eksik çeviri sırası: aktif dil → İngilizce → Türkçe', () => {
  const { cekirdek, tr } = yeniCekirdek();
  cekirdek.paketKaydet('en', sahtePaket(tr, { 'eylem.kaydet': 'Save', 'eylem.sil': 'Delete' }, ['eylem.vazgec']));
  cekirdek.paketKaydet('de', sahtePaket(tr, { 'eylem.kaydet': 'Speichern' }, ['eylem.sil', 'eylem.vazgec']));
  cekirdek.diliAyarla('de');
  assert.equal(cekirdek.t['eylem.kaydet'], 'Speichern');
  assert.equal(cekirdek.t['eylem.sil'], 'Delete'); // Almanca yok → İngilizce
  assert.equal(cekirdek.t['eylem.vazgec'], 'Vazgeç'); // ikisinde de yok → Türkçe
});

test('dil değişince t ve takvim YERİNDE güncellenir, aboneler bir kez haberdar edilir', () => {
  const { cekirdek, tr } = yeniCekirdek();
  cekirdek.paketKaydet('en', sahtePaket(tr, { 'eylem.kaydet': 'Save' }));
  cekirdek.diliAyarla('tr');
  const t = cekirdek.t;
  const aylar = cekirdek.takvim.aylar;
  let bildirim = 0;
  const bitir = cekirdek.dilDegisimineAbone(() => { bildirim += 1; });
  cekirdek.diliAyarla('en');
  assert.equal(cekirdek.aktifDil(), 'en');
  assert.equal(cekirdek.aktifEtiket(), 'en-US');
  assert.equal(t['eylem.kaydet'], 'Save'); // aynı nesne
  assert.equal(aylar[0], 'X-Ocak'); // aynı dizi
  cekirdek.diliAyarla('en'); // değişmedi → haber yok
  assert.equal(bildirim, 1);
  cekirdek.diliAyarla('tr');
  assert.equal(t['eylem.kaydet'], 'Kaydet');
  assert.equal(bildirim, 2);
  bitir();
  cekirdek.diliAyarla('en');
  assert.equal(bildirim, 2);
});

test('metinler.ts uyumluluk katmanı aktif dilin şablonunu doldurur', () => {
  const cekirdek = yukle('src/i18n/cekirdek.ts');
  const tr = yukle('src/i18n/kaynaklar/tr.ts').default;
  cekirdek.paketKaydet('tr', tr);
  cekirdek.paketKaydet('en', sahtePaket(tr, {
    'cumle.toastKaydedildi': '{tutar} saved',
    'cumle.seriAktifGovde': "You've logged entries for {n, plural, one {# day} other {# days}}.",
  }));
  const metinler = yukle('src/content/metinler.ts', { '@/i18n/cekirdek': cekirdek });
  cekirdek.diliAyarla('tr');
  assert.equal(metinler.toastKaydedildi('50 ₺'), '50 ₺ kaydedildi');
  assert.equal(metinler.seriAktifGovde(5), '5 gündür kayıt giriyorsun.');
  assert.equal(metinler.ayLokatif(9), "Eylül'de");
  cekirdek.diliAyarla('en');
  assert.equal(metinler.toastKaydedildi('50 ₺'), '50 ₺ saved');
  assert.equal(metinler.seriAktifGovde(1), "You've logged entries for 1 day.");
  assert.equal(metinler.seriAktifGovde(5), "You've logged entries for 5 days.");
});
