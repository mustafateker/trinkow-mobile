const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');
const metinler = yukle('src/content/metinler.ts');
const hedef = yukle('src/content/hedefEtiketleri.ts', { '@/content/metinler': metinler });

// Niyet → hedef alanı etiketi ve özet açıklaması eşleşmesi (app/onboarding.tsx
// adım 2 / adım 4). Bir niyet eklendiğinde ya da eşleşme çapraz kayarsa
// (ör. borc metni tasarrufa atanırsa) bu test kırılmalı.
for (const niyet of /** @type {const} */ (['takip', 'tasarruf', 'borc'])) {
  test(`"${niyet}" niyeti kendi hedef etiketine ve özet açıklamasına eşlenir`, () => {
    assert.equal(hedef.HEDEF_ETIKET_ALAN[niyet], metinler.t[`alan.hedef.${niyet}`]);
    assert.equal(hedef.OZET_ACIKLAMA[niyet], metinler.t[`ob.ozet.aciklama.${niyet}`]);
  });
}

test('üç niyetin hedef etiketleri birbirinden farklıdır (çapraz kayma yok)', () => {
  const degerler = Object.values(hedef.HEDEF_ETIKET_ALAN);
  assert.equal(new Set(degerler).size, degerler.length);
});

test('üç niyetin özet açıklamaları birbirinden farklıdır (çapraz kayma yok)', () => {
  const degerler = Object.values(hedef.OZET_ACIKLAMA);
  assert.equal(new Set(degerler).size, degerler.length);
});
