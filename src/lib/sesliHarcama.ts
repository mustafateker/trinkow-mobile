import type { OdemeTipi } from '@/db/harcama';

export type SesliHarcamaTaslagi = {
  hamMetin: string;
  tutarKurus: number | null;
  urunAdi: string | null;
  gunFarki: number | null;
  odeme: OdemeTipi | null;
  taksitSayisi: number | null;
  notMetni: string | null;
};

const SAYILAR: Record<string, number> = {
  sifir: 0,
  bir: 1,
  iki: 2,
  uc: 3,
  dort: 4,
  bes: 5,
  alti: 6,
  yedi: 7,
  sekiz: 8,
  dokuz: 9,
  on: 10,
  yirmi: 20,
  otuz: 30,
  kirk: 40,
  elli: 50,
  altmis: 60,
  yetmis: 70,
  seksen: 80,
  doksan: 90,
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const SAYI_KELIMELERI = new Set([
  ...Object.keys(SAYILAR),
  'yuz',
  'bin',
  'milyon',
  'hundred',
  'thousand',
  'million',
]);

function sade(metin: string): string {
  return metin
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c');
}

function sayiKelimeleriniOku(kelimeler: string[]): number | null {
  if (kelimeler.length === 0 || kelimeler.some((k) => !SAYI_KELIMELERI.has(k))) return null;
  let toplam = 0;
  let parca = 0;
  for (const kelime of kelimeler) {
    const basit = SAYILAR[kelime];
    if (basit !== undefined) {
      parca += basit;
    } else if (kelime === 'yuz' || kelime === 'hundred') {
      parca = Math.max(parca, 1) * 100;
    } else if (kelime === 'bin' || kelime === 'thousand') {
      toplam += Math.max(parca, 1) * 1_000;
      parca = 0;
    } else if (kelime === 'milyon' || kelime === 'million') {
      toplam += Math.max(parca, 1) * 1_000_000;
      parca = 0;
    }
  }
  return toplam + parca;
}

function yaziliSayiyiOku(metin: string): number | null {
  const deger = metin.trim().replace(/\s+/g, '');
  if (!/^[0-9.,]+$/.test(deger)) return null;
  const sonVirgul = deger.lastIndexOf(',');
  const sonNokta = deger.lastIndexOf('.');
  const sonAyirac = Math.max(sonVirgul, sonNokta);
  let normalize: string;
  if (sonAyirac >= 0 && deger.length - sonAyirac - 1 <= 2) {
    normalize = `${deger.slice(0, sonAyirac).replace(/[.,]/g, '')}.${deger.slice(sonAyirac + 1)}`;
  } else {
    normalize = deger.replace(/[.,]/g, '');
  }
  const sayi = Number(normalize);
  return Number.isFinite(sayi) ? sayi : null;
}

function ifadeSayisiniOku(ifade: string): number | null {
  const yazili = yaziliSayiyiOku(ifade);
  if (yazili !== null) return yazili;
  return sayiKelimeleriniOku(sade(ifade).split(/\s+/).filter(Boolean));
}

type Eslesme = { metin: string; deger: number; baslangic: number; bitis: number };

function paraEslesmesiBul(metin: string): Eslesme | null {
  const normal = sade(metin);
  const paraBirimi = /\b(?:tl|try|lira|liraya|liralik|dolar|dollar|euro)\b|₺/g;
  for (const birim of normal.matchAll(paraBirimi)) {
    const birimBaslangic = birim.index ?? 0;
    const onceki = normal.slice(0, birimBaslangic);
    const sayisal = onceki.match(/([0-9][0-9.,]*)\s*$/);
    if (sayisal?.[1]) {
      const deger = ifadeSayisiniOku(sayisal[1]);
      if (deger !== null) {
        const baslangic = birimBaslangic - sayisal[0].length;
        return { metin: metin.slice(baslangic, birimBaslangic + birim[0].length), deger, baslangic, bitis: birimBaslangic + birim[0].length };
      }
    }
    const kelimeler = onceki.trimEnd().split(/\s+/);
    let ilk = kelimeler.length;
    while (ilk > 0 && SAYI_KELIMELERI.has(kelimeler[ilk - 1])) ilk -= 1;
    if (ilk < kelimeler.length) {
      const ifade = kelimeler.slice(ilk).join(' ');
      const deger = ifadeSayisiniOku(ifade);
      if (deger !== null) {
        const baslangic = onceki.lastIndexOf(ifade);
        return { metin: metin.slice(baslangic, birimBaslangic + birim[0].length), deger, baslangic, bitis: birimBaslangic + birim[0].length };
      }
    }
  }
  return null;
}

function taksitEslesmesiBul(metin: string): Eslesme | null {
  const normal = sade(metin);
  const taksit = /(?:\b([0-9]{1,2})\s*(?:taksit|installments?)\b)|(?:\b([a-z]+(?:\s+[a-z]+){0,2})\s+(?:taksit|installments?)\b)/g;
  for (const sonuc of normal.matchAll(taksit)) {
    const ifade = sonuc[1] ?? sonuc[2];
    const deger = ifadeSayisiniOku(ifade);
    if (deger !== null && Number.isInteger(deger) && deger >= 2 && deger <= 36) {
      return { metin: sonuc[0], deger, baslangic: sonuc.index ?? 0, bitis: (sonuc.index ?? 0) + sonuc[0].length };
    }
  }
  return null;
}

function birimsizParaEslesmesiBul(metin: string, taksit: Eslesme | null): Eslesme | null {
  const normal = sade(metin);
  const sayilar = [...normal.matchAll(/\b[0-9][0-9.,]*\b/g)];
  const adaylar = sayilar.filter((s) => {
    const baslangic = s.index ?? 0;
    return !taksit || baslangic < taksit.baslangic || baslangic >= taksit.bitis;
  });
  if (adaylar.length === 1) {
    const sonuc = adaylar[0];
    const deger = ifadeSayisiniOku(sonuc[0]);
    if (deger !== null) {
      return { metin: sonuc[0], deger, baslangic: sonuc.index ?? 0, bitis: (sonuc.index ?? 0) + sonuc[0].length };
    }
  }

  const kelimeler = [...normal.matchAll(/\b[a-z]+\b/g)];
  let enIyi: Eslesme | null = null;
  for (let i = 0; i < kelimeler.length; i += 1) {
    if (!SAYI_KELIMELERI.has(kelimeler[i][0])) continue;
    let j = i;
    while (j + 1 < kelimeler.length && SAYI_KELIMELERI.has(kelimeler[j + 1][0])) j += 1;
    const sonrakiKelime = kelimeler[j + 1]?.[0];
    const tutarBaglami = !sonrakiKelime || /^(?:harcadim|odedim|verdim|spent|paid)$/.test(sonrakiKelime);
    if (!tutarBaglami) {
      i = j;
      continue;
    }
    const baslangic = kelimeler[i].index ?? 0;
    const bitis = (kelimeler[j].index ?? 0) + kelimeler[j][0].length;
    if (!taksit || bitis <= taksit.baslangic || baslangic >= taksit.bitis) {
      const ifade = normal.slice(baslangic, bitis);
      const deger = ifadeSayisiniOku(ifade);
      if (deger !== null && (!enIyi || deger > enIyi.deger)) enIyi = { metin: metin.slice(baslangic, bitis), deger, baslangic, bitis };
    }
    i = j;
  }
  return enIyi;
}

function notuAyir(metin: string): { ana: string; notMetni: string | null } {
  const sonuc = metin.match(/\b(?:not olarak|notum|note)\s+(.+)$/i);
  if (!sonuc || sonuc.index === undefined) return { ana: metin, notMetni: null };
  return { ana: metin.slice(0, sonuc.index).trim(), notMetni: sonuc[1].trim().slice(0, 60) || null };
}

function gunFarkiniBul(metin: string): number | null {
  const normal = sade(metin);
  if (/\b(?:evvelsi gun|onceki gun)\b/.test(normal)) return -2;
  if (/\b(?:dun|yesterday)\b/.test(normal)) return -1;
  if (/\b(?:bugun|today)\b/.test(normal)) return 0;
  const once = normal.match(/\b([0-9]{1,2})\s+gun once\b/);
  return once ? -Number(once[1]) : null;
}

function odemeyiBul(metin: string): OdemeTipi | null {
  const normal = sade(metin);
  if (/\b(?:nakit|cash)\b/.test(normal)) return 'nakit';
  if (/\b(?:kart|kartla|kredi karti|banka karti|card)\b/.test(normal)) return 'kart';
  return null;
}

function urunAdiniBul(metin: string, para: Eslesme | null, taksit: Eslesme | null): string | null {
  let kalan = sade(metin);
  for (const eslesme of [para, taksit]) {
    if (eslesme) kalan = kalan.replace(sade(eslesme.metin), ' ');
  }
  kalan = kalan
    .replace(/\b(?:bugun|dun|evvelsi gun|onceki gun|today|yesterday|[0-9]{1,2}\s+gun once)\b/g, ' ')
    .replace(/\b(?:kredi kartiyla|kredi karti|banka kartiyla|banka karti|kartla|kart|nakit|cash|card)\b/g, ' ')
    .replace(/\b(?:tl|try|lira|liraya|liralik|dolar|dollar|euro)\b|₺/g, ' ')
    .replace(/\b(?:harcadim|odedim|verdim|aldim|harcama|ekle|kaydet|spent|paid|bought|add)\b/g, ' ')
    .replace(/\b(?:icin|olarak|ile|bir)\b/g, ' ')
    .replace(/['’](?:da|de|ta|te|ya|ye)\b/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!kalan || /^[0-9.,\s]+$/.test(kalan)) return null;
  return kalan
    .split(' ')
    .map((kelime) => kelime ? kelime[0].toLocaleUpperCase('tr-TR') + kelime.slice(1) : kelime)
    .join(' ')
    .slice(0, 80);
}

/** Konuşma metnini ağ kullanmadan mevcut harcama formunun alanlarına dönüştürür. */
export function sesliHarcamaAyristir(hamMetin: string): SesliHarcamaTaslagi {
  const { ana, notMetni } = notuAyir(hamMetin.trim());
  const taksit = taksitEslesmesiBul(ana);
  const para = paraEslesmesiBul(ana) ?? birimsizParaEslesmesiBul(ana, taksit);
  const tutarKurus = para && para.deger > 0 ? Math.round(para.deger * 100) : null;
  return {
    hamMetin: hamMetin.trim(),
    tutarKurus,
    urunAdi: urunAdiniBul(ana, para, taksit),
    gunFarki: gunFarkiniBul(ana),
    odeme: odemeyiBul(ana),
    taksitSayisi: taksit?.deger ?? null,
    notMetni,
  };
}
