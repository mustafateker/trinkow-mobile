import { localeKodu } from '@/lib/yerellestirme';

export type AnalizDonemi = 'hafta' | 'ay' | 'yil';

export type GrafikNoktasi = {
  anahtar: string;
  etiket: string;
  eksenEtiketi: string;
  erisilebilirEtiket: string;
  gider: number;
  gelecek: boolean;
};

export type HarcamaNoktasi = { gun: string; tutarKurus: number };

function gunBaslangici(tarih: Date) {
  return new Date(tarih.getFullYear(), tarih.getMonth(), tarih.getDate(), 12);
}

function gunEkle(tarih: Date, fark: number) {
  const sonuc = new Date(tarih);
  sonuc.setDate(sonuc.getDate() + fark);
  return sonuc;
}

function gunAnahtari(tarih: Date) {
  return `${tarih.getFullYear()}-${String(tarih.getMonth() + 1).padStart(2, '0')}-${String(tarih.getDate()).padStart(2, '0')}`;
}

function kisaTarih(tarih: Date) {
  if (localeKodu() === 'tr-TR') {
    return `${tarih.getDate()} ${new Intl.DateTimeFormat(localeKodu(), { month: 'short' }).format(tarih)}`;
  }
  return new Intl.DateTimeFormat(localeKodu(), { month: 'short', day: 'numeric' }).format(tarih);
}

function ayKisa(tarih: Date) {
  return new Intl.DateTimeFormat(localeKodu(), { month: 'short' }).format(tarih);
}

export function analizAraligi(donem: AnalizDonemi, simdi = new Date()) {
  const bitis = gunBaslangici(simdi);
  if (donem === 'hafta') {
    const baslangic = gunEkle(bitis, -6);
    return { baslangic, bitis, baslik: `${kisaTarih(baslangic)} – ${kisaTarih(bitis)}` };
  }
  if (donem === 'ay') {
    const baslangic = gunEkle(bitis, -29);
    return { baslangic, bitis, baslik: `${kisaTarih(baslangic)} – ${kisaTarih(bitis)}` };
  }
  const baslangic = new Date(bitis.getFullYear(), 0, 1, 12);
  const yilAylari = `${new Intl.DateTimeFormat(localeKodu(), { month: 'long' }).format(new Date(bitis.getFullYear(), 0, 1))} – ${new Intl.DateTimeFormat(localeKodu(), { month: 'long' }).format(new Date(bitis.getFullYear(), 11, 1))}`;
  return { baslangic, bitis, baslik: `${bitis.getFullYear()} · ${yilAylari}` };
}

function giderHaritasi(harcamalar: readonly HarcamaNoktasi[]) {
  const gunler = new Map<string, number>();
  for (const harcama of harcamalar) {
    gunler.set(harcama.gun, (gunler.get(harcama.gun) ?? 0) + harcama.tutarKurus);
  }
  return gunler;
}

export function grafikNoktalariOlustur(
  harcamalar: readonly HarcamaNoktasi[],
  donem: AnalizDonemi,
  baslangic: Date,
  bitis: Date,
): GrafikNoktasi[] {
  const toplamlar = giderHaritasi(harcamalar);
  if (donem === 'yil') {
    return Array.from({ length: 12 }, (_, ay) => {
      const etiket = ayKisa(new Date(bitis.getFullYear(), ay, 1));
      const ayAnahtari = `${bitis.getFullYear()}-${String(ay + 1).padStart(2, '0')}`;
      const gider = harcamalar
        .filter((harcama) => harcama.gun.startsWith(ayAnahtari))
        .reduce((toplam, harcama) => toplam + harcama.tutarKurus, 0);
      return {
        anahtar: ayAnahtari,
        etiket,
        eksenEtiketi: etiket,
        erisilebilirEtiket: localeKodu() === 'tr-TR' ? `${ay + 1}. ay` : `Month ${ay + 1}`,
        gider,
        gelecek: ay > bitis.getMonth(),
      };
    });
  }

  const adet = donem === 'hafta' ? 7 : 30;
  return Array.from({ length: adet }, (_, index) => {
    const tarih = gunEkle(baslangic, index);
    const anahtar = gunAnahtari(tarih);
    return {
      anahtar,
      etiket: donem === 'hafta' ? new Intl.DateTimeFormat(localeKodu(), { weekday: 'short' }).format(tarih) : String(tarih.getDate()),
      eksenEtiketi: kisaTarih(tarih),
      erisilebilirEtiket: new Intl.DateTimeFormat(localeKodu(), { day: 'numeric', month: 'long', weekday: 'long' }).format(tarih),
      gider: toplamlar.get(anahtar) ?? 0,
      gelecek: tarih.getTime() > bitis.getTime(),
    };
  });
}

function gunSayisi(baslangic: Date, bitis: Date) {
  const ilk = Date.UTC(baslangic.getFullYear(), baslangic.getMonth(), baslangic.getDate());
  const son = Date.UTC(bitis.getFullYear(), bitis.getMonth(), bitis.getDate());
  return Math.round((son - ilk) / 86_400_000) + 1;
}

export function donemGeliriHesapla(aylikGelir: number, donem: AnalizDonemi, baslangic: Date, bitis: Date) {
  if (donem === 'ay') return aylikGelir;
  if (donem === 'yil') return aylikGelir * 12;
  const ayGunSayisi = new Date(bitis.getFullYear(), bitis.getMonth() + 1, 0).getDate();
  return Math.round((aylikGelir / ayGunSayisi) * gunSayisi(baslangic, bitis));
}
