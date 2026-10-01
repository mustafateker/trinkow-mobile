import type { SQLiteDatabase } from 'expo-sqlite';

import { ODEME_VARSAYILAN, type OdemeTipi } from '@/db/harcama';
import { tercihleriGetir, tercihleriGuncelle, type TercihlerYaniti } from '@/lib/api';
import { gunAnahtari, gunSiniriSaatiniAyarla } from '@/lib/tarih';

/**
 * D-2c-1 · E-19 Ayarlar — arka oda tercihleri. BE-6a ile `GET/PATCH
 * /kullanici/tercihler`e bağlandı (K-068) — yerel `ayar` anahtar/değer
 * tablosuna bu dosyadan bir daha OKUMA/YAZMA YAPILMAZ (`ayar` tablosu
 * BAŞKA modüllerin — limitler/harcama/seri, BE-6b/6c — hâlâ kullandığı
 * farklı anahtarları taşıdığı için tablonun kendisi SİLİNMEDİ, yalnız bu
 * dosyanın yolu kesildi). Her fonksiyon "Kaydet yok" ilkesine göre ANINDA
 * yazar (bkz. not-kutusu: "Her anahtar dokunulduğu anda geçerlidir").
 *
 * `db: SQLiteDatabase` parametreleri yalnız dışa verilen imzayı — bu
 * modülü çağıran `app/ayarlar.tsx` ve `app/_layout.tsx`'i DEĞİŞTİRMEMEK
 * için korunur; gövdede kullanılmazlar.
 */

export type GunSiniriSaat = 0 | 3 | 6;
const GUN_SINIRI_VARSAYILAN: GunSiniriSaat = 0;
const BILDIRIM_SAATI_VARSAYILAN = '21.00';

/**
 * Aynı ekranda (`app/ayarlar.tsx#oku`) tercihlerin birden çok alanı
 * eşzamanlı okunuyor (`Promise.all`) — istek tekilleştirme, `src/db/profil.ts`
 * ile AYNI desen (bir doğruluk kaynağı değil, yalnız eşzamanlı çağrıları
 * TEK ağ isteğine indirger).
 */
let ucustakiIstek: Promise<TercihlerYaniti> | null = null;

async function tercihleriGetirTekil(): Promise<TercihlerYaniti> {
  if (ucustakiIstek) return ucustakiIstek;
  ucustakiIstek = tercihleriGetir().finally(() => {
    ucustakiIstek = null;
  });
  return ucustakiIstek;
}

export async function bildirimAksamOzetOku(_db: SQLiteDatabase): Promise<boolean> {
  // Sunucu varsayılanı zaten `true` (kullanici_model.py) — cevaplanmamışsa
  // da açık gösterilir, eski yerel davranışla birebir.
  return (await tercihleriGetirTekil()).bildirim_aksam_ozet;
}

/** Anahtarın kendisi + E-20'nin "cevaplandı mı" kontrolü aynı çağrıda güncellenir (sunucu tarafında). */
export async function bildirimAksamOzetKaydet(_db: SQLiteDatabase, acik: boolean): Promise<void> {
  await tercihleriGuncelle({ bildirim_aksam_ozet: acik });
}

/** E-20 `prof.bildirim` sorusunun "zaten cevaplandı" kontrolü — varsayılan değerle karışmasın diye ayrı bayrak. */
export async function bildirimTercihBelirlendiMi(_db: SQLiteDatabase): Promise<boolean> {
  return (await tercihleriGetirTekil()).bildirim_tercih_belirlendi;
}

export async function bildirimSaatiOku(_db: SQLiteDatabase): Promise<string> {
  const t = await tercihleriGetirTekil();
  return t.bildirim_saati || BILDIRIM_SAATI_VARSAYILAN;
}

export async function bildirimSaatiKaydet(_db: SQLiteDatabase, saat: string): Promise<void> {
  await tercihleriGuncelle({ bildirim_saati: saat });
}

export async function gunSiniriOku(_db: SQLiteDatabase): Promise<GunSiniriSaat> {
  const t = await tercihleriGetirTekil();
  return t.gun_siniri ?? GUN_SINIRI_VARSAYILAN;
}

/**
 * D-2c-1b — tercihi yazar VE `gunAnahtari`nin önbelleğini anında günceller
 * ("Kaydet yok" ilkesi: dokunulduğu an geçerli olmalı, ekranı yeniden
 * açmayı beklemez). `tarih.ts`'in senkron sözleşmesi BOZULMADI: önbellek
 * hâlâ senkron okunuyor, yalnız onu BESLEYEN yer artık sunucu.
 */
export async function gunSiniriKaydet(_db: SQLiteDatabase, saat: GunSiniriSaat): Promise<void> {
  await tercihleriGuncelle({ gun_siniri: saat });
  gunSiniriSaatiniAyarla(saat);
}

export async function varsayilanOdemeOku(_db: SQLiteDatabase): Promise<OdemeTipi> {
  const t = await tercihleriGetirTekil();
  return t.varsayilan_odeme === 'nakit' ? 'nakit' : t.varsayilan_odeme === 'kart' ? 'kart' : ODEME_VARSAYILAN;
}

/** NOT: yalnız tercihi saklar; `app/harcama-ekle.tsx` bu turda DEĞİŞMEDİ (bkz. rapor). */
export async function varsayilanOdemeKaydet(_db: SQLiteDatabase, odeme: OdemeTipi): Promise<void> {
  await tercihleriGuncelle({ varsayilan_odeme: odeme });
}

/**
 * K-084/2 — kurulum günü TEKİLLEŞTİRİLDİ: sunucudaki `tercihler.kurulum_gunu`
 * TEK otoritedir (K-068). Yerel `ayar.kurulum_gunu` bir daha YAZILMAZ/OKUNMAZ
 * (`db/semasi.ts` ve `db/profilleme.ts`nin eski okumaları kaldırıldı).
 */
export async function kurulumGunuOku(_db: SQLiteDatabase): Promise<string> {
  const t = await tercihleriGetirTekil();
  return t.kurulum_gunu ?? gunAnahtari(new Date());
}

/**
 * Sunucu `kurulum_gunu`nu YALNIZ hiç ayarlanmamışsa yazar (write-once,
 * `kullanici_service.py`) — bu yüzden her açılışta ÇAĞRILABİLİR: değer
 * zaten varsa gönderilen tarih sessizce yok sayılır, ikinci bir "zaten
 * var mı" kontrolüne gerek YOK (K-084/2, `app/_layout.tsx` açılışta çağırır).
 */
export async function kurulumGunuBaslat(_db: SQLiteDatabase): Promise<void> {
  await tercihleriGuncelle({ kurulum_gunu: gunAnahtari(new Date()) });
}
