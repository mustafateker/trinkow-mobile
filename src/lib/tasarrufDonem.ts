import { ayBasligi, gunAnahtari, gunEkle, kisaTarih, tarihtenGun } from '@/lib/tarih';

export type TasarrufDonemi = 'gun' | 'hafta' | 'ay' | 'yil';

export const TASARRUF_DONEMLERI: { value: TasarrufDonemi; label: string }[] = [
  { value: 'gun', label: 'Gün' },
  { value: 'hafta', label: 'Hafta' },
  { value: 'ay', label: 'Ay' },
  { value: 'yil', label: 'Yıl' },
];

export function tasarrufDonemSinirlari(tur: TasarrufDonemi, referans: string): { baslangic: string; bitis: string } {
  const gun = tarihtenGun(referans);
  if (tur === 'gun') return { baslangic: referans, bitis: referans };
  if (tur === 'hafta') {
    const pazartesiFarki = -((gun.getDay() + 6) % 7);
    const baslangic = gunEkle(gun, pazartesiFarki);
    return { baslangic: gunAnahtari(baslangic), bitis: gunAnahtari(gunEkle(baslangic, 6)) };
  }
  if (tur === 'ay') {
    return {
      baslangic: gunAnahtari(new Date(gun.getFullYear(), gun.getMonth(), 1, 12)),
      bitis: gunAnahtari(new Date(gun.getFullYear(), gun.getMonth() + 1, 0, 12)),
    };
  }
  return {
    baslangic: `${gun.getFullYear()}-01-01`,
    bitis: `${gun.getFullYear()}-12-31`,
  };
}

export function tasarrufDonemBasligi(tur: TasarrufDonemi, referans: string): string {
  const gun = tarihtenGun(referans);
  if (tur === 'gun') return `${kisaTarih(gun)} ${gun.getFullYear()}`;
  if (tur === 'hafta') {
    const { baslangic, bitis } = tasarrufDonemSinirlari(tur, referans);
    return `${kisaTarih(tarihtenGun(baslangic))} – ${kisaTarih(tarihtenGun(bitis))}`;
  }
  if (tur === 'ay') return ayBasligi(referans.slice(0, 7));
  return String(gun.getFullYear());
}

export function tasarrufDonemKisaEtiketi(tur: TasarrufDonemi): string {
  return TASARRUF_DONEMLERI.find((secenek) => secenek.value === tur)?.label ?? 'Dönem';
}
