import { abonelikGecikmeGun, abonelikKalanGun, t } from '@/content/metinler';
import { localeKodu } from '@/lib/yerellestirme';

export type AbonelikTarihBilgisi = {
  siradakiGun: string;
  gunFarki: number;
  buAyOdendi: boolean;
  durum: 'yaklasiyor' | 'bugun' | 'gecikti' | 'odendi';
};

function tarihi(gun: string): Date {
  const [yil, ay, tarih] = gun.split('-').map(Number);
  return new Date(Date.UTC(yil, ay - 1, tarih));
}

function gunYaz(yil: number, ayIndeksi: number, yenilenmeGunu: number): string {
  const ayBasi = new Date(Date.UTC(yil, ayIndeksi, 1));
  const hedefYil = ayBasi.getUTCFullYear();
  const hedefAy = ayBasi.getUTCMonth();
  const sonGun = new Date(Date.UTC(hedefYil, hedefAy + 1, 0)).getUTCDate();
  const gun = Math.min(yenilenmeGunu, sonGun);
  return `${hedefYil}-${String(hedefAy + 1).padStart(2, '0')}-${String(gun).padStart(2, '0')}`;
}

/** 29–31 gibi günleri kısa aylarda ayın son gününe sabitler. */
export function abonelikTarihBilgisi(
  yenilenmeGunu: number,
  bugun: string,
  sonOdemeGunu: string | null,
): AbonelikTarihBilgisi {
  const simdi = tarihi(bugun);
  const ayAnahtari = bugun.slice(0, 7);
  const buAyOdendi = sonOdemeGunu?.slice(0, 7) === ayAnahtari;
  const buAy = gunYaz(simdi.getUTCFullYear(), simdi.getUTCMonth(), yenilenmeGunu);
  const sonraki = gunYaz(simdi.getUTCFullYear(), simdi.getUTCMonth() + 1, yenilenmeGunu);
  const siradakiGun = buAyOdendi ? sonraki : buAy;
  const gunFarki = Math.round((tarihi(siradakiGun).getTime() - simdi.getTime()) / 86_400_000);
  return {
    siradakiGun,
    gunFarki,
    buAyOdendi,
    durum: buAyOdendi ? 'odendi' : gunFarki < 0 ? 'gecikti' : gunFarki === 0 ? 'bugun' : 'yaklasiyor',
  };
}

export function abonelikDurumEtiketi(bilgi: AbonelikTarihBilgisi): string {
  if (bilgi.durum === 'odendi') return t['ui.subscriptions.paid_status'];
  if (bilgi.durum === 'bugun') return t['ui.subscriptions.renewing_status'];
  if (bilgi.durum === 'gecikti') return abonelikGecikmeGun(Math.abs(bilgi.gunFarki));
  return abonelikKalanGun(bilgi.gunFarki);
}

export function abonelikTarihEtiketi(gun: string): string {
  return new Intl.DateTimeFormat(localeKodu(), { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(tarihi(gun));
}
