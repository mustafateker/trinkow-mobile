import type { SQLiteDatabase } from 'expo-sqlite';

export const SEMA_SURUMU = 7;

/**
 * Şema — BE-6c ile büyük ölçüde küçüldü. `harcama` · `profil` · `gun_durumu` ·
 * `limit_gecmisi` · `urun_kategori_ogrenme` tabloları artık TAMAMEN sunucuda
 * (K-068) — bu turdan sonra buradan kaldırıldılar; ilgili kod yolları
 * (`db/harcama.ts`, `db/profil.ts`, `db/seri.ts`, `db/urunKategori.ts`) zaten
 * yalnız `/*` uçlarını çağırıyordu (BE-6a/6b'den beri), bu yüzden şemayı
 * silmek veri kaybına yol AÇMAZ (bu tablolar zaten yazılmıyordu).
 *
 * Örnek/demo veri tohumlama (`ornekVeriYaz`) da bu turda KALDIRILDI: BE-6b'den
 * beri `harcamaEkle` sunucuya yazdığı için yerel `harcama` tablosu HİÇBİR
 * ZAMAN dolmuyordu — bu da her açılışta "boş" sanılıp aynı ~19 demo kaydın
 * KULLANICININ GERÇEK SUNUCU HESABINA tekrar tekrar POST edilmesine ve
 * `ayar.gunluk_limit_kurus`ün sabit 300 ₺'ye ÜZERİNE YAZILMASINA yol açan
 * sessiz bir veri bütünlüğü hatasıydı (bkz. PM raporu) — kaldırılması bir
 * "iyileştirme" değil, bu turun kapsamındaki bir düzeltmedir.
 *
 * BE-6d (K-087): `kategori_limiti` tablosu da bu turda kaldırıldı —
 * `limitler.ts#kategoriLimitiSil` artık `DELETE /harcama/ayar/kategori-limitleri/{kategori}`
 * çağırıyor (K-085 Madde 2), yerelde okunan/yazılan hiçbir yol kalmadı.
 * `gunluk_limit_kurus` anahtarı da `ayar`dan bu turda TAMAMEN çekildi — tek
 * otorite `kullanici_profilleri.gunluk_limit_kurus` (`db/profil.ts#gunlukLimitKurusOku`).
 * `DROP TABLE` cihazda kalmış eski satırları temizler, idempotent.
 *
 * Kalan: `ayar` — yalnız profilleme/ipucu bayrakları + seri kutlama takibi
 * (`seri_en_yuksek_gosterilen_donum`, `db/seri.ts`) için canlı; bu SAF bir UI
 * durumudur, finansal veri DEĞİLDİR (K-068 kapsamı dışı).
 * PARA: tüm tutar kolonları INTEGER ve KURUŞ cinsinden. REAL kullanılmaz.
 */
const SEMA = `
PRAGMA journal_mode = WAL;

DROP TABLE IF EXISTS kategori_limiti;

CREATE TABLE IF NOT EXISTS ayar (
  anahtar TEXT PRIMARY KEY,
  deger   TEXT NOT NULL
);
`;

export async function semayiKur(db: SQLiteDatabase): Promise<void> {
  const { user_version: surum = 0 } =
    (await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')) ?? {};
  await db.execAsync(SEMA);
  if (surum < SEMA_SURUMU) {
    await db.execAsync(`PRAGMA user_version = ${SEMA_SURUMU}`);
  }
}
