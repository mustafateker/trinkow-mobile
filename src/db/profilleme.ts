import type { SQLiteDatabase } from 'expo-sqlite';

import { bildirimAksamOzetKaydet, bildirimTercihBelirlendiMi, kurulumGunuOku } from '@/db/ayarTercihleri';
import { ayarOku, ayarYaz } from '@/db/harcama';
import { profilDetayAlanKaydet, profilDetayOku, profilOku, type TaksitSiklik } from '@/db/profil';
import type { YatirimNiyet } from '@/lib/plan';
import { gunAnahtari, gunFarkiHesapla, tarihtenGun } from '@/lib/tarih';

/**
 * D-2c-1 · E-20 bağlamsal profilleme sheet'i (F-12).
 *
 * metinler.md §12/§22.5 ve delta-v4.md "B-3 · Gelir bir kez sorulur" TAM
 * OLARAK üç sabit soru tanımlıyor (gün2 Yatırım · gün3 Taksit · gün4
 * Bildirim) — yalnız Yatırım E-25'in 7/8 kartıyla birebir aynı metni
 * paylaşıyor. Görev brifinginin "sorular E-25'in cevaplanmamış
 * kartlarından seçilir" cümlesi bunun genellemesi; içerik otoritesi
 * (metinler.md) burada esas alındı — PM'e raporda bildirildi.
 *
 * Kurallar (bileşen envanteri `ProfilingSheet`): günde en fazla 1 ·
 * reddedilen soru (Şimdi değil VEYA kapatma X — ikisi de eşit "çıkış
 * kapısı", not-kutu) 14 gün geri gelmez · toplam 3 soru, hepsi
 * cevaplanınca/bırakılınca bileşen bir daha görünmez.
 */
export type ProfillemeSoruId = 'yatirim' | 'taksit' | 'bildirim';

const RED_COOLDOWN_GUN = 14;

/**
 * Soru sırası = gösterilme sırası; her biri "en erken bu gün" eşiği taşır.
 * `ProfilingHost` sheet'in `micro` gün etiketini ("2. gün" vb.) buradan
 * okur — kullanıcı geç açarsa (ör. 10. günde ilk kez görür) etiket yine de
 * SORUNUN PLANLANMIŞ günüdür, o anki takvim günü değil (prototipteki
 * sahnelerle birebir eşleşsin diye).
 */
export const SORU_GUNU: Record<ProfillemeSoruId, number> = { yatirim: 2, taksit: 3, bildirim: 4 };
const SIRA: ProfillemeSoruId[] = ['yatirim', 'taksit', 'bildirim'];

async function kurulumdanBuGune(db: SQLiteDatabase): Promise<number> {
  // K-084/2 — sunucudaki tercihler.kurulum_gunu TEK otoritedir.
  const kurulum = await kurulumGunuOku(db);
  // kurulum günü = gün 1 (henüz uygulamayı yeni açmış birine "2. gün" gösterilmez).
  return gunFarkiHesapla(new Date(), tarihtenGun(kurulum)) + 1;
}

async function cevaplandiMi(db: SQLiteDatabase, id: ProfillemeSoruId): Promise<boolean> {
  if (id === 'yatirim') return (await profilDetayOku(db)).yatirimNiyet !== null;
  if (id === 'taksit') return (await profilDetayOku(db)).taksitSiklik !== null;
  return bildirimTercihBelirlendiMi(db);
}

async function redCooldowndaMi(db: SQLiteDatabase, id: ProfillemeSoruId): Promise<boolean> {
  const redTarihi = await ayarOku(db, `profilleme_red_${id}`);
  if (!redTarihi) return false;
  return gunFarkiHesapla(new Date(), tarihtenGun(redTarihi)) < RED_COOLDOWN_GUN;
}

/** Bugün gösterilecek soru var mı? Yoksa `null` (bileşen bu turda hiç render edilmez). */
export async function aktifProfillemeSorusu(db: SQLiteDatabase): Promise<ProfillemeSoruId | null> {
  const profil = await profilOku(db);
  if (!profil.onboardingTamamlandi) return null;

  const bugunAnahtari = gunAnahtari(new Date());
  const sonGosterim = await ayarOku(db, 'profilleme_son_gosterim_gun');
  if (sonGosterim === bugunAnahtari) return null; // günde en fazla 1

  const gunSayisi = await kurulumdanBuGune(db);

  for (const id of SIRA) {
    if (gunSayisi < SORU_GUNU[id]) continue;
    if (await cevaplandiMi(db, id)) continue;
    if (await redCooldowndaMi(db, id)) continue;
    return id;
  }
  return null;
}

async function gosterildiIsaretle(db: SQLiteDatabase): Promise<void> {
  await ayarYaz(db, 'profilleme_son_gosterim_gun', gunAnahtari(new Date()));
}

/** "Şimdi değil" / kapatma (X) — ikisi de reddet sayılır, 14 gün cooldown başlar. */
export async function profillemeReddet(db: SQLiteDatabase, id: ProfillemeSoruId): Promise<void> {
  await ayarYaz(db, `profilleme_red_${id}`, gunAnahtari(new Date()));
  await gosterildiIsaretle(db);
}

export async function profillemeYatirimCevapla(db: SQLiteDatabase, niyet: YatirimNiyet): Promise<void> {
  await profilDetayAlanKaydet(db, 'yatirim_niyet', niyet);
  await gosterildiIsaretle(db);
}

export async function profillemeTaksitCevapla(db: SQLiteDatabase, siklik: TaksitSiklik): Promise<void> {
  await profilDetayAlanKaydet(db, 'taksit_siklik', siklik);
  await gosterildiIsaretle(db);
}

export async function profillemeBildirimCevapla(db: SQLiteDatabase, gonder: boolean): Promise<void> {
  await bildirimAksamOzetKaydet(db, gonder);
  await gosterildiIsaretle(db);
}
