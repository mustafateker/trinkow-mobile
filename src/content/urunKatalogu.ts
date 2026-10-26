import { katalogAdi } from '@/i18n/cekirdek';
import type { KategoriKodu } from '@/lib/kategoriler';

/**
 * F-18 ürün kataloğu — delta-v4.md T-4 "Ürün kataloğu (tam liste)" (satır
 * 1221-1341), 80 kalem · 13 kategori. BAĞLAYICI kurallar (aynı yerden):
 *
 * 1. Fiyat alanı YOKTUR (K-050 · K-037) — şema yalnız `id, ad, kategori`.
 * 2. Jenerik kalem, marka değil. Marka adı kullanıcının kendi geçmişinden
 *    gelir (`db/harcama.ts#sikAlinanlar`/`urunAra`), kataloğa yazılmaz.
 * 3. Her kalem bir kategoriye bağlıdır ama bağ değiştirilebilir — kullanıcı
 *    dropdown'dan değiştirirse o kalem için kalıcı öğrenilir
 *    (`db/urunKategori.ts`).
 * 4. Katalog uygulamayla gelir, sunucu yok; arama tamamen çevrimdışı ve
 *    senkron (80 kalem RAM'de, `FlatList` gerekmez).
 * 5. Liste kapalı değildir: eşleşme yoksa kullanıcı kendi kalemini yazar
 *    ("… olarak ekle", `src/lib/urunArama.ts`).
 *
 * Bilinçli olarak DIŞARIDA bırakılanlar: kredi kartı ödemesi/transfer
 * (harcama değil), kuaför/hediye/bağış/kuru temizleme/evcil hayvan maması
 * gibi "Diğer"e düşen kalemler (13. kategori bir kaçış kapısıdır, katalog
 * satırıyla doldurulmaz), marka adları, ürün fotoğrafı/logo, miktar/adet/
 * birim alanı. "fotokopi" bilerek katalogda YOKTUR (eşleşme-yok yüzeyi bu
 * kalemle test edilir).
 */
export type KatalogOgesi = {
  id: string;
  ad: string;
  kategori: KategoriKodu;
};

/**
 * Katalog kalemi. `ad` aktif dilin paketinden kimlikle okunur
 * (`src/i18n/kaynaklar/<dil>.ts#katalog`); pakette olmayan (sunucudan yeni
 * gelmiş) kalemde `yedekAd` — sunucunun verdiği ad — gösterilir.
 */
export function katalogOgesi(id: string, kategori: KategoriKodu, yedekAd: string = id): KatalogOgesi {
  return {
    id,
    kategori,
    get ad() {
      return katalogAdi(id) ?? yedekAd;
    },
  };
}

/** Gömülü 80 kalem: [kimlik, kategori]. Adlar dil paketlerinde. */
const GOMULU_KATALOG: readonly (readonly [string, KategoriKodu])[] = [
  // Kafe
  ['filtre-kahve', 'kafe'],
  ['turk-kahvesi', 'kafe'],
  ['latte', 'kafe'],
  ['sutlu-kahve', 'kafe'],
  ['soguk-kahve', 'kafe'],
  ['cay', 'kafe'],
  ['simit', 'kafe'],
  ['pogaca', 'kafe'],
  ['tatli', 'kafe'],
  // Restoran
  ['doner', 'restoran'],
  ['lahmacun', 'restoran'],
  ['pide', 'restoran'],
  ['kebap', 'restoran'],
  ['tost', 'restoran'],
  ['hamburger', 'restoran'],
  ['pizza', 'restoran'],
  ['ogle-yemegi', 'restoran'],
  ['kahvalti-tabagi', 'restoran'],
  ['yemek-siparisi', 'restoran'],
  // Market
  ['haftalik-market', 'market'],
  ['ekmek', 'market'],
  ['sut', 'market'],
  ['yumurta', 'market'],
  ['peynir', 'market'],
  ['meyve-sebze', 'market'],
  ['et-tavuk', 'market'],
  ['su-damacanasi', 'market'],
  ['temizlik-malzemesi', 'market'],
  ['kisisel-bakim', 'market'],
  ['atistirmalik', 'market'],
  // Ulaşım
  ['toplu-tasima-yuklemesi', 'ulasim'],
  ['sehirlerarasi-otobus-bileti', 'ulasim'],
  ['taksi', 'ulasim'],
  ['otopark', 'ulasim'],
  ['kopru-otoyol-gecisi', 'ulasim'],
  ['ucak-bileti', 'ulasim'],
  ['kargo', 'ulasim'],
  ['arac-bakimi', 'ulasim'],
  // Akaryakıt
  ['benzin', 'akaryakit'],
  ['motorin', 'akaryakit'],
  ['lpg', 'akaryakit'],
  // Fatura
  ['elektrik-faturasi', 'fatura'],
  ['su-faturasi', 'fatura'],
  ['dogalgaz-faturasi', 'fatura'],
  ['internet-faturasi', 'fatura'],
  ['telefon-faturasi', 'fatura'],
  ['aidat', 'fatura'],
  ['motorlu-tasitlar-vergisi', 'fatura'],
  // Kira ve ev
  ['kira', 'kiraev'],
  ['ev-esyasi', 'kiraev'],
  ['mobilya', 'kiraev'],
  ['tadilat-usta', 'kiraev'],
  ['ev-tekstili', 'kiraev'],
  // Abonelik
  ['muzik-aboneligi', 'abonelik'],
  ['dizi-film-aboneligi', 'abonelik'],
  ['spor-salonu-uyeligi', 'abonelik'],
  ['bulut-depolama', 'abonelik'],
  ['oyun-aboneligi', 'abonelik'],
  ['yazilim-aboneligi', 'abonelik'],
  // Eğlence
  ['sinema-bileti', 'eglence'],
  ['konser-bileti', 'eglence'],
  ['mac-bileti', 'eglence'],
  ['oyun-ici-satin-alma', 'eglence'],
  ['kitap', 'eglence'],
  ['muze-sergi', 'eglence'],
  // Giyim
  ['ust-giyim', 'giyim'],
  ['pantolon', 'giyim'],
  ['ayakkabi', 'giyim'],
  ['dis-giyim', 'giyim'],
  // Sağlık
  ['eczane', 'saglik'],
  ['doktor-muayenesi', 'saglik'],
  ['dis-hekimi', 'saglik'],
  ['gozluk-lens', 'saglik'],
  ['tahlil-goruntuleme', 'saglik'],
  ['vitamin-takviye', 'saglik'],
  // Alışkanlıklar
  ['sigara-paketi', 'aliskanliklar'],
  ['sarma-tutun', 'aliskanliklar'],
  ['nargile', 'aliskanliklar'],
  ['bira', 'aliskanliklar'],
  ['sans-oyunu', 'aliskanliklar'],
];

export const URUN_KATALOGU: readonly KatalogOgesi[] = GOMULU_KATALOG.map(([id, kategori]) => katalogOgesi(id, kategori));

/**
 * BE-6c Madde 4 — açılışta `GET /katalog/` ETag ile kontrol edilir
 * (`db/katalog.ts#katalogTazele`); sunucu farklı bir sürüm dönerse arama
 * bu değişkenden okumaya devam eder ama İÇERİĞİ günceller. Varsayılan HER
 * ZAMAN yukarıdaki gömülü 80 kalemdir — ilk açılış anlık ve çevrimdışı
 * çalışsın diye (görev notu); `URUN_KATALOGU` sabitinin KENDİSİ bir daha
 * yeniden atanmaz, yalnız bu değişken değişir.
 */
let aktifKatalog: readonly KatalogOgesi[] = URUN_KATALOGU;

/** `src/lib/urunArama.ts#katalogAra` bunu okur — her zaman EN GÜNCEL listeyi döner. */
export function aktifKatalogu(): readonly KatalogOgesi[] {
  return aktifKatalog;
}

/** Yalnız `db/katalog.ts#katalogTazele` çağırır (sunucu sürümü değiştiyse). */
export function katalogGuncelle(yeni: readonly KatalogOgesi[]): void {
  aktifKatalog = yeni;
}
