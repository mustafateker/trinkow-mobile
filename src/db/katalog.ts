
import { ayarOku, ayarYaz } from '@/db/harcama';
import { katalogGuncelle, katalogOgesi, type KatalogOgesi } from '@/content/urunKatalogu';
import { katalogGetir } from '@/lib/api';
import type { KategoriKodu } from '@/lib/kategoriler';

const SURUM_ANAHTARI = 'katalog_surumu';

/**
 * BE-6c Madde 4 — açılışta kataloğu `GET /katalog/` ile ETag üzerinden
 * kontrol eder. Katalog bir KULLANICI VERİSİ değil, uygulama kaynağıdır
 * (K-068 ihlali değil, görev notu) — bu yüzden:
 *  · sürüm DEĞİŞMEDİYSE (304) hiçbir şey yapmaz, gömülü 80 kalem kalır.
 *  · ağ yoksa/hata olursa SESSİZCE gömülü listede kalınır — `ErrorState`
 *    TETİKLEMEZ, arama çevrimdışı çalışmaya devam eder (görev notu #4).
 *  · yalnız sürüm GERÇEKTEN değiştiyse `aktifKatalogu()`nun içeriği değişir.
 */
export async function katalogTazele(): Promise<void> {
  try {
    const bilinenSurum = await ayarOku(SURUM_ANAHTARI);
    const sonuc = await katalogGetir(bilinenSurum);
    if (!sonuc.degisti) return;
    // Ad dil paketinden kimlikle okunur; sunucunun (Türkçe) adı yalnız pakette olmayan yeni kalemde görünür.
    const yeni: KatalogOgesi[] = sonuc.katalog.ogeler.map((o) => katalogOgesi(o.kod, o.kategori as KategoriKodu, o.ad));
    katalogGuncelle(yeni);
    await ayarYaz(SURUM_ANAHTARI, sonuc.katalog.surum);
  } catch {
    // bkz. üstteki not — sessiz kalınır, gömülü katalog kullanılmaya devam eder.
  }
}
