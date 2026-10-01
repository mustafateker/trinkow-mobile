import type { SQLiteDatabase } from 'expo-sqlite';

import { tumSayfalariGetir } from '@/db/harcama';
import { ozetDonemGetir, type OzetDonemYaniti } from '@/lib/api';

/**
 * E-16 — haftalık özet sorguları. `db/harcama.ts`'teki gün/ay bazlı
 * fonksiyonlardan ayrı: burada aralık (hafta) bazlı gruplama var.
 *
 * BE-6c: kategori dağılımı + Latte Faktörü artık `GET /ozet/donem`den gelir
 * (K-068 — toplama sunucuda, istemci bir daha kayıt çekip kendi toplamaz).
 * Günlük toplamlar (`WeekStrip` şeridi için) için sunucuda ayrı bir "aralıktaki
 * gün başına toplam" ucu YOK (yalnız tekil gün `/ozet/pano` ve dönem TOPLAMI
 * `/ozet/donem` var) — bu yüzden `haftaGunToplamlari` ham kayıt listesini
 * (`/harcama/`) çekip İSTEMCİDE gruplar; `db/harcama.ts#ayHarcamalari`nin
 * zaten yaptığı liste-gruplamasıyla AYNI desendir, sunucunun toplama
 * mantığının tekrarı DEĞİLDİR.
 */

export type GunToplami = { gun: string; toplamKurus: number };

/** Hafta aralığındaki (dahil) günlük toplamlar — veri olmayan günler listede yok. */
export async function haftaGunToplamlari(
  _db: SQLiteDatabase,
  baslangicGunu: string,
  bitisGunu: string,
): Promise<GunToplami[]> {
  const kayitlar = await tumSayfalariGetir({ baslangic_gun: baslangicGunu, bitis_gun: bitisGunu });
  const harita = new Map<string, number>();
  for (const k of kayitlar) harita.set(k.gun, (harita.get(k.gun) ?? 0) + k.tutar_kurus);
  return Array.from(harita, ([gun, toplamKurus]) => ({ gun, toplamKurus }));
}

/**
 * `haftaKategoriDagilimi` ve `haftaKucukHarcamaOzeti` her ikisi de AYNI
 * `/ozet/donem` yanıtından beslenir (app/ozet.tsx ikisini birlikte,
 * `Promise.all` ile çağırır) — aynı parametrelerle eşzamanlı çağrıları TEK
 * ağ isteğine indirgeyen basit bir tekilleştirme (bir doğruluk kaynağı
 * DEĞİL, yalnız gereksiz ikinci isteği önler; `db/profil.ts`teki
 * `profilYanitiGetir` ile aynı desen).
 */
let ucustakiDonem: { anahtar: string; soz: Promise<OzetDonemYaniti> } | null = null;

async function donemGetirTekil(baslangicGunu: string, bitisGunu: string, esikKurus: number): Promise<OzetDonemYaniti> {
  const anahtar = `${baslangicGunu}|${bitisGunu}|${esikKurus}`;
  if (ucustakiDonem && ucustakiDonem.anahtar === anahtar) return ucustakiDonem.soz;
  const soz = ozetDonemGetir(baslangicGunu, bitisGunu, esikKurus).finally(() => {
    if (ucustakiDonem?.soz === soz) ucustakiDonem = null;
  });
  ucustakiDonem = { anahtar, soz };
  return soz;
}

/** E-16 varsayılan eşik — backend `VARSAYILAN_KUCUK_HARCAMA_ESIGI_KURUS` ile aynı (50 ₺). */
const VARSAYILAN_ESIK_KURUS = 5000;

export type KategoriPayi = { kategori: string; toplamKurus: number };

/** Hafta aralığında kategoriye göre toplam — sunucu zaten büyükten küçüğe sıralı döner. */
export async function haftaKategoriDagilimi(
  _db: SQLiteDatabase,
  baslangicGunu: string,
  bitisGunu: string,
): Promise<KategoriPayi[]> {
  const ozet = await donemGetirTekil(baslangicGunu, bitisGunu, VARSAYILAN_ESIK_KURUS);
  return ozet.kategori_dagilimi.map((k) => ({ kategori: k.kategori, toplamKurus: k.toplam_kurus }));
}

export type KucukHarcamaOzeti = { adet: number; toplamKurus: number };

/** "50 ₺ altı" harcamaların adedi + toplamı (Latte Faktörü — ürünün varlık sebebi). */
export async function haftaKucukHarcamaOzeti(
  _db: SQLiteDatabase,
  baslangicGunu: string,
  bitisGunu: string,
  esikKurus = VARSAYILAN_ESIK_KURUS,
): Promise<KucukHarcamaOzeti> {
  const ozet = await donemGetirTekil(baslangicGunu, bitisGunu, esikKurus);
  return { adet: ozet.kucuk_harcama.adet, toplamKurus: ozet.kucuk_harcama.toplam_kurus };
}
