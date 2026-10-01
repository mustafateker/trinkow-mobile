import type { SQLiteDatabase } from 'expo-sqlite';

import { urunKategoriOgrenIstegi, urunKategoriOgrenmeleriGetirIstegi } from '@/lib/api';

/**
 * F-18 RN inşa notu #5 (delta-v4.md satır 1384-1386) — ürün→kategori öğrenme
 * tablosu. Katalog kalemi bir kategoriye bağlıdır ama bağ sabit değildir:
 * kullanıcı kategori dropdown'undan değiştirirse bir sonraki sefer o kategori
 * gelir.
 *
 * BE-6b (K-068): "Yerel, sunucuya gitmez (K-052)" notu BAYATTI, K-068 ile
 * GEÇERSİZ — bu tablo artık `/harcama/ayar/urun-kategori-ogrenme` üzerinden
 * sunucudadır. `harcamaEkle` çağrısında ürün adı verilirse öğrenme sunucu
 * TARAFINDAN otomatik yapılır (README) — `urunKategoriOgren` yalnız E-11'in
 * "kategoriyi elle düzelt" akışı (harcama eklemeden) için kalır.
 */

/** Bir ürün adı için kategoriyi elle öğretir/düzeltir (E-11 — kategori dropdown'undan değiştirme). */
export async function urunKategoriOgren(
  _db: SQLiteDatabase,
  urunAdi: string,
  kategori: string,
): Promise<void> {
  if (!urunAdi.trim()) return;
  await urunKategoriOgrenIstegi(urunAdi, kategori);
}

/** Tüm öğrenilmiş eşlemeler — arama ekranında bir kerede yüklenip katalog sonuçlarına uygulanır. */
export async function tumOgrenilenKategoriler(_db: SQLiteDatabase): Promise<Map<string, string>> {
  const satirlar = await urunKategoriOgrenmeleriGetirIstegi();
  return new Map(satirlar.map((s) => [s.urun_anahtari, s.kategori]));
}
