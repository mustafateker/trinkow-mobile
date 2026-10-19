const test = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

const locale = { value: 'tr-TR' };
const { analizAraligi, grafikNoktalariOlustur } = yukle('src/lib/analiz.ts', {
  '@/lib/yerellestirme': { localeKodu: () => locale.value },
});
const bugun = new Date(2026, 9, 17, 12);

test('haftalık analiz bugün dahil son 7 günü kapsar', () => {
  const aralik = analizAraligi('hafta', bugun);
  assert.equal(aralik.baslangic.getFullYear(), 2026);
  assert.equal(aralik.baslangic.getMonth(), 9);
  assert.equal(aralik.baslangic.getDate(), 11);
  assert.equal(aralik.bitis.getDate(), 17);
  const noktalar = grafikNoktalariOlustur([], 'hafta', aralik.baslangic, aralik.bitis);
  assert.equal(noktalar.length, 7);
  assert.equal(noktalar[0].anahtar, '2026-10-11');
  assert.equal(noktalar[6].anahtar, '2026-10-17');
});

test('aylık analiz bugün dahil son 30 günü gün gün üretir', () => {
  const aralik = analizAraligi('ay', bugun);
  const noktalar = grafikNoktalariOlustur([
    { gun: '2026-09-18', tutarKurus: 1000 },
    { gun: '2026-10-17', tutarKurus: 2500 },
  ], 'ay', aralik.baslangic, aralik.bitis);
  assert.equal(aralik.baslangic.getDate(), 18);
  assert.equal(aralik.baslangic.getMonth(), 8);
  assert.equal(noktalar.length, 30);
  assert.equal(noktalar[0].gider, 1000);
  assert.equal(noktalar[29].gider, 2500);
});

test('yıllık analiz sabit Ocak-Aralık eksenini korur', () => {
  const aralik = analizAraligi('yil', bugun);
  const noktalar = grafikNoktalariOlustur([
    { gun: '2026-01-05', tutarKurus: 1000 },
    { gun: '2026-10-01', tutarKurus: 2000 },
  ], 'yil', aralik.baslangic, aralik.bitis);
  assert.equal(noktalar.length, 12);
  assert.deepEqual(Array.from(noktalar, (nokta) => nokta.etiket), ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']);
  assert.equal(noktalar[0].gider, 1000);
  assert.equal(noktalar[9].gider, 2000);
  assert.equal(noktalar[10].gelecek, true);
});

test('analiz tarih aralıkları ve grafik etiketleri İngilizce locale kullanır', () => {
  locale.value = 'en-US';
  const aralik = analizAraligi('hafta', bugun);
  assert.equal(aralik.baslik, 'Oct 11 – Oct 17');
  const noktalar = grafikNoktalariOlustur([], 'hafta', aralik.baslangic, aralik.bitis);
  assert.equal(noktalar[0].etiket, 'Sun');
  assert.equal(noktalar[0].eksenEtiketi, 'Oct 11');
  assert.equal(noktalar[0].erisilebilirEtiket, 'Sunday, October 11');

  const yillik = analizAraligi('yil', bugun);
  assert.equal(yillik.baslik, '2026 · January – December');
  const aylar = grafikNoktalariOlustur([], 'yil', yillik.baslangic, yillik.bitis);
  assert.equal(aylar[0].etiket, 'Jan');
  assert.equal(aylar[0].erisilebilirEtiket, 'Month 1');
  locale.value = 'tr-TR';
});
