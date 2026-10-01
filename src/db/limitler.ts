import type { SQLiteDatabase } from 'expo-sqlite';

import {
  gunlukLimitiAyarlaIstegi,
  kategoriLimitiSilIstegi,
  kategoriLimitiYazIstegi,
  kategoriLimitleriGetirIstegi,
  limitGecmisiYazIstegi,
} from '@/lib/api';
import { TUM_KATEGORILER, type KategoriKodu } from '@/lib/kategoriler';
import { gunAnahtari } from '@/lib/tarih';

/**
 * E-17 — günlük limit + kategori limitleri yazma/okuma. BE-6d (K-087): TAMAMI
 * artık sunucuda — `db: SQLiteDatabase` parametreleri yalnız dışa verilen
 * imzayı korumak için tutuldu (`db/profil.ts`teki `_db` deseniyle aynı).
 *
 * Günlük limitin OKUNMASI `db/profil.ts#gunlukLimitKurusOku`den yapılır (tek
 * otorite `kullanici_profilleri.gunluk_limit_kurus`, `GET /kullanici/profil`).
 * Bu dosyadaki `gunlukLimitKaydet` yalnız YAZAR — `PUT /kullanici/plan/gunluk-limit`
 * hem otoriteyi hem `limit_gecmisi`ni TEK istekte günceller (K-085 Madde 6),
 * istemci ikinci kez `limit_gecmisi`ye yazmaz.
 */

/** Tüm kategori limitleri — yalnız DEĞERİ OLANLAR (Record: kod → kuruş). */
export async function tumKategoriLimitleri(_db: SQLiteDatabase): Promise<Record<string, number>> {
  const satirlar = await kategoriLimitleriGetirIstegi();
  const sonuc: Record<string, number> = {};
  for (const s of satirlar) sonuc[s.kategori] = s.limit_kurus;
  return sonuc;
}

/** Kategori limiti yaz/güncelle. `sira` kategori listesindeki sabit sıradan gelir. */
export async function kategoriLimitiKaydet(
  _db: SQLiteDatabase,
  kod: KategoriKodu,
  limitKurus: number,
): Promise<void> {
  const sira = TUM_KATEGORILER.indexOf(kod) + 1;
  await kategoriLimitiYazIstegi(kod, Math.round(limitKurus), sira);
}

/**
 * Kategori limitini kaldır — veri (harcama) SİLİNMEZ, yalnız takip durur (K-029).
 * BE-6d (K-085 Madde 2): `DELETE /harcama/ayar/kategori-limitleri/{kategori}`
 * (204, idempotent) — geri al (K-029) `kategoriLimitiKaydet` ile eski değeri
 * yeniden yazar.
 */
export async function kategoriLimitiSil(_db: SQLiteDatabase, kod: KategoriKodu): Promise<void> {
  await kategoriLimitiSilIstegi(kod);
}

/**
 * K-059/3 — plan kurulunca (E-26 "Planı kur") kategori limitleri OTOMATİK
 * tohumlanır. Hangi kategoriye ne yazılacağı hiçbir belgede yok (delta-v4.md
 * satır 1452-1456: "ürün kararı olarak doğrulanmalı"); bu turun kararı —
 * PM'e bildirildi:
 *  · Sabit giderler (kira/fatura/ulaşım/kredi) tohumlanmaz — bunlar zaten
 *    "Zorunlu" payın kendisi, altında kalınacak bir keyfi harcama değil.
 *  · Yalnız E-25'in ALIŞKANLIK kartlarından hesaplanan aylık tutar,
 *    KARŞILIĞI OLAN kategoriye yazılır: kahve→Kafe, dışarıda yemek→Restoran,
 *    abonelikler→Abonelik, sigara+alkol (toplanır)→Alışkanlıklar ailesi.
 *  · Yalnız tutarı > 0 olan kategoriler tohumlanır ("Hiç" cevabı zaten 0
 *    üretir, satır yazılmaz). Kullanıcı sonradan E-17'den değiştirebilir —
 *    bu yalnız BAŞLANGIÇ değeridir, üzerine yazmaz (yalnız plan kurulurken
 *    çağrılır, tekrar tekrar tetiklenmez).
 */
export async function kategoriLimitleriniTohumla(
  db: SQLiteDatabase,
  aylikKurus: { kafe: number; restoran: number; abonelik: number; aliskanliklar: number },
): Promise<void> {
  const girdiler: [KategoriKodu, number][] = [
    ['kafe', aylikKurus.kafe],
    ['restoran', aylikKurus.restoran],
    ['abonelik', aylikKurus.abonelik],
    ['aliskanliklar', aylikKurus.aliskanliklar],
  ];
  for (const [kod, tutar] of girdiler) {
    if (tutar > 0) await kategoriLimitiKaydet(db, kod, tutar);
  }
}

/**
 * Günlük limiti ELLE yaz/güncelle (Ayarlar > Limitler, Plan "eksi" ekranı).
 * `PUT /kullanici/plan/gunluk-limit` TEK istekte hem otoriteyi
 * (`kullanici_profilleri.gunluk_limit_kurus`) hem `limit_gecmisi`yi günceller
 * (K-085 Madde 6) — istemci ikinci bir `limit_gecmisi` yazmaz.
 */
export async function gunlukLimitKaydet(_db: SQLiteDatabase, limitKurus: number): Promise<void> {
  await gunlukLimitiAyarlaIstegi(Math.round(limitKurus), gunAnahtari(new Date()));
}

/**
 * Yalnız `limit_gecmisi`ye satır yaz — `POST /kullanici/plan/kur` otoriteyi
 * (`gunluk_limit_kurus`) SUNUCUDA hesaplayıp kaydeder ama `limit_gecmisi`yi
 * YAZMAZ (README "kullanici" bölümü, yalnız `PUT /gunluk-limit` yazar); plan
 * kurulunca geçmişe bu satır AYRICA eklenir (K-064/1 — o günden itibaren
 * yürürlükte olan değer, seri hesabının geçmişe dönük doğru limiti kullanması
 * için). `db/profil.ts#planKur` çağırır.
 */
export async function gunlukLimitGecmisiKaydet(limitKurus: number): Promise<void> {
  await limitGecmisiYazIstegi(gunAnahtari(new Date()), Math.round(limitKurus));
}
