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

export const URUN_KATALOGU: readonly KatalogOgesi[] = [
  // Kafe
  { id: 'filtre-kahve', ad: 'Filtre kahve', kategori: 'kafe' },
  { id: 'turk-kahvesi', ad: 'Türk kahvesi', kategori: 'kafe' },
  { id: 'latte', ad: 'Latte', kategori: 'kafe' },
  { id: 'sutlu-kahve', ad: 'Sütlü kahve', kategori: 'kafe' },
  { id: 'soguk-kahve', ad: 'Soğuk kahve', kategori: 'kafe' },
  { id: 'cay', ad: 'Çay', kategori: 'kafe' },
  { id: 'simit', ad: 'Simit', kategori: 'kafe' },
  { id: 'pogaca', ad: 'Poğaça', kategori: 'kafe' },
  { id: 'tatli', ad: 'Tatlı', kategori: 'kafe' },
  // Restoran
  { id: 'doner', ad: 'Döner', kategori: 'restoran' },
  { id: 'lahmacun', ad: 'Lahmacun', kategori: 'restoran' },
  { id: 'pide', ad: 'Pide', kategori: 'restoran' },
  { id: 'kebap', ad: 'Kebap', kategori: 'restoran' },
  { id: 'tost', ad: 'Tost', kategori: 'restoran' },
  { id: 'hamburger', ad: 'Hamburger', kategori: 'restoran' },
  { id: 'pizza', ad: 'Pizza', kategori: 'restoran' },
  { id: 'ogle-yemegi', ad: 'Öğle yemeği', kategori: 'restoran' },
  { id: 'kahvalti-tabagi', ad: 'Kahvaltı tabağı', kategori: 'restoran' },
  { id: 'yemek-siparisi', ad: 'Yemek siparişi', kategori: 'restoran' },
  // Market
  { id: 'haftalik-market', ad: 'Haftalık market', kategori: 'market' },
  { id: 'ekmek', ad: 'Ekmek', kategori: 'market' },
  { id: 'sut', ad: 'Süt', kategori: 'market' },
  { id: 'yumurta', ad: 'Yumurta', kategori: 'market' },
  { id: 'peynir', ad: 'Peynir', kategori: 'market' },
  { id: 'meyve-sebze', ad: 'Meyve ve sebze', kategori: 'market' },
  { id: 'et-tavuk', ad: 'Et ve tavuk', kategori: 'market' },
  { id: 'su-damacanasi', ad: 'Su damacanası', kategori: 'market' },
  { id: 'temizlik-malzemesi', ad: 'Temizlik malzemesi', kategori: 'market' },
  { id: 'kisisel-bakim', ad: 'Kişisel bakım', kategori: 'market' },
  { id: 'atistirmalik', ad: 'Atıştırmalık', kategori: 'market' },
  // Ulaşım
  { id: 'toplu-tasima-yuklemesi', ad: 'Toplu taşıma yüklemesi', kategori: 'ulasim' },
  { id: 'sehirlerarasi-otobus-bileti', ad: 'Şehirlerarası otobüs bileti', kategori: 'ulasim' },
  { id: 'taksi', ad: 'Taksi', kategori: 'ulasim' },
  { id: 'otopark', ad: 'Otopark', kategori: 'ulasim' },
  { id: 'kopru-otoyol-gecisi', ad: 'Köprü ve otoyol geçişi', kategori: 'ulasim' },
  { id: 'ucak-bileti', ad: 'Uçak bileti', kategori: 'ulasim' },
  { id: 'kargo', ad: 'Kargo', kategori: 'ulasim' },
  { id: 'arac-bakimi', ad: 'Araç bakımı', kategori: 'ulasim' },
  // Akaryakıt
  { id: 'benzin', ad: 'Benzin', kategori: 'akaryakit' },
  { id: 'motorin', ad: 'Motorin', kategori: 'akaryakit' },
  { id: 'lpg', ad: 'LPG', kategori: 'akaryakit' },
  // Fatura
  { id: 'elektrik-faturasi', ad: 'Elektrik faturası', kategori: 'fatura' },
  { id: 'su-faturasi', ad: 'Su faturası', kategori: 'fatura' },
  { id: 'dogalgaz-faturasi', ad: 'Doğalgaz faturası', kategori: 'fatura' },
  { id: 'internet-faturasi', ad: 'İnternet faturası', kategori: 'fatura' },
  { id: 'telefon-faturasi', ad: 'Telefon faturası', kategori: 'fatura' },
  { id: 'aidat', ad: 'Aidat', kategori: 'fatura' },
  { id: 'motorlu-tasitlar-vergisi', ad: 'Motorlu taşıtlar vergisi', kategori: 'fatura' },
  // Kira ve ev
  { id: 'kira', ad: 'Kira', kategori: 'kiraev' },
  { id: 'ev-esyasi', ad: 'Ev eşyası', kategori: 'kiraev' },
  { id: 'mobilya', ad: 'Mobilya', kategori: 'kiraev' },
  { id: 'tadilat-usta', ad: 'Tadilat ve usta', kategori: 'kiraev' },
  { id: 'ev-tekstili', ad: 'Ev tekstili', kategori: 'kiraev' },
  // Abonelik
  { id: 'muzik-aboneligi', ad: 'Müzik aboneliği', kategori: 'abonelik' },
  { id: 'dizi-film-aboneligi', ad: 'Dizi ve film aboneliği', kategori: 'abonelik' },
  { id: 'spor-salonu-uyeligi', ad: 'Spor salonu üyeliği', kategori: 'abonelik' },
  { id: 'bulut-depolama', ad: 'Bulut depolama', kategori: 'abonelik' },
  { id: 'oyun-aboneligi', ad: 'Oyun aboneliği', kategori: 'abonelik' },
  { id: 'yazilim-aboneligi', ad: 'Yazılım aboneliği', kategori: 'abonelik' },
  // Eğlence
  { id: 'sinema-bileti', ad: 'Sinema bileti', kategori: 'eglence' },
  { id: 'konser-bileti', ad: 'Konser bileti', kategori: 'eglence' },
  { id: 'mac-bileti', ad: 'Maç bileti', kategori: 'eglence' },
  { id: 'oyun-ici-satin-alma', ad: 'Oyun içi satın alma', kategori: 'eglence' },
  { id: 'kitap', ad: 'Kitap', kategori: 'eglence' },
  { id: 'muze-sergi', ad: 'Müze ve sergi', kategori: 'eglence' },
  // Giyim
  { id: 'ust-giyim', ad: 'Üst giyim', kategori: 'giyim' },
  { id: 'pantolon', ad: 'Pantolon', kategori: 'giyim' },
  { id: 'ayakkabi', ad: 'Ayakkabı', kategori: 'giyim' },
  { id: 'dis-giyim', ad: 'Dış giyim', kategori: 'giyim' },
  // Sağlık
  { id: 'eczane', ad: 'Eczane', kategori: 'saglik' },
  { id: 'doktor-muayenesi', ad: 'Doktor muayenesi', kategori: 'saglik' },
  { id: 'dis-hekimi', ad: 'Diş hekimi', kategori: 'saglik' },
  { id: 'gozluk-lens', ad: 'Gözlük ve lens', kategori: 'saglik' },
  { id: 'tahlil-goruntuleme', ad: 'Tahlil ve görüntüleme', kategori: 'saglik' },
  { id: 'vitamin-takviye', ad: 'Vitamin ve takviye', kategori: 'saglik' },
  // Alışkanlıklar
  { id: 'sigara-paketi', ad: 'Sigara paketi', kategori: 'aliskanliklar' },
  { id: 'sarma-tutun', ad: 'Sarma tütün', kategori: 'aliskanliklar' },
  { id: 'nargile', ad: 'Nargile', kategori: 'aliskanliklar' },
  { id: 'bira', ad: 'Bira', kategori: 'aliskanliklar' },
  { id: 'sans-oyunu', ad: 'Şans oyunu', kategori: 'aliskanliklar' },
] as const;

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
