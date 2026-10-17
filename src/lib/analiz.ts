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

const HAFTA_GUNLERI = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const AYLAR_KISA = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

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
  return `${tarih.getDate()} ${AYLAR_KISA[tarih.getMonth()]}`;
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
  return { baslangic, bitis, baslik: `${bitis.getFullYear()} · Ocak – Aralık` };
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
    return AYLAR_KISA.map((etiket, ay) => {
      const ayAnahtari = `${bitis.getFullYear()}-${String(ay + 1).padStart(2, '0')}`;
      const gider = harcamalar
        .filter((harcama) => harcama.gun.startsWith(ayAnahtari))
        .reduce((toplam, harcama) => toplam + harcama.tutarKurus, 0);
      return {
        anahtar: ayAnahtari,
        etiket,
        eksenEtiketi: etiket,
        erisilebilirEtiket: `${ay + 1}. ay`,
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
      etiket: donem === 'hafta' ? HAFTA_GUNLERI[tarih.getDay()] : String(tarih.getDate()),
      eksenEtiketi: kisaTarih(tarih),
      erisilebilirEtiket: tarih.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }),
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
