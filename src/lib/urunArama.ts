import { aktifKatalogu, type KatalogOgesi } from '@/content/urunKatalogu';

/**
 * F-18 — Türkçe normalizasyon + katalog arama. RN inşa notu #2 (delta-v4.md
 * satır 1373-1377) bağlayıcı: `toLocaleLowerCase("tr")` + aksan/nokta
 * normalizasyonu (İ→i, I→ı, ş→s, ç→c, ğ→g, ü→u, ö→o) İKİ TARAFA da
 * uygulanır (aranan metin + karşılaştırılan ad). Sıralama: katalogda önce
 * baştan eşleşenler, sonra içinde geçenler; `localeCompare("tr")` kullanılır
 * (aksi hâlde "Çay" listenin sonuna düşer).
 */
export function turkceNormalize(metin: string): string {
  return metin
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .trim();
}

/**
 * Katalogda arama. `haricTut` — normalize edilmiş ad kümesi — kullanıcının
 * KENDİ geçmişinde zaten görünen ürünler katalog grubunda TEKRAR gösterilmez
 * (prototip "kah" örneği: "Sütlü kahve" kullanıcının geçmişindeyse katalog
 * grubunda ikinci kez listelenmez).
 */
export function katalogAra(sorgu: string, haricTut: ReadonlySet<string> = new Set()): KatalogOgesi[] {
  const q = turkceNormalize(sorgu);
  if (!q) return [];

  const adaylar = aktifKatalogu().filter((u) => {
    const adNorm = turkceNormalize(u.ad);
    if (haricTut.has(adNorm)) return false;
    return adNorm.includes(q);
  });

  const sirala = (a: KatalogOgesi, b: KatalogOgesi) => a.ad.localeCompare(b.ad, 'tr');
  const bastanEslesen = adaylar.filter((u) => turkceNormalize(u.ad).startsWith(q)).sort(sirala);
  const icindeGecen = adaylar.filter((u) => !turkceNormalize(u.ad).startsWith(q)).sort(sirala);
  return [...bastanEslesen, ...icindeGecen];
}
