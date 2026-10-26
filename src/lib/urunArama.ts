import { aktifKatalogu, type KatalogOgesi } from '@/content/urunKatalogu';
import { aktifEtiket } from '@/i18n/cekirdek';

/**
 * F-18 — Türkçe normalizasyon + katalog arama. RN inşa notu #2 (delta-v4.md
 * satır 1373-1377) bağlayıcı: `toLocaleLowerCase("tr")` + aksan/nokta
 * normalizasyonu (İ→i, I→ı, ş→s, ç→c, ğ→g, ü→u, ö→o) İKİ TARAFA da
 * uygulanır (aranan metin + karşılaştırılan ad). Sıralama: katalogda önce
 * baştan eşleşenler, sonra içinde geçenler; aktif dilin `localeCompare`'i
 * kullanılır (aksi hâlde "Çay" listenin sonuna düşer).
 *
 * DİKKAT: Bu fonksiyon aynı zamanda sunucudaki ürün→kategori öğrenme
 * anahtarıdır (`harcama_service.py#_turkce_normalize` ile birebir) —
 * değiştirilmez. Diğer dillerin aksanları için arama `aramaNormalize` kullanır.
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
/**
 * Yalnız ARAMA eşleşmesi için: Türkçe normalizasyonun üstüne diğer dillerin
 * aksanlarını da düşürür (é→e, ñ→n, ą→a, č→c, ł→l …) — "cafe" "Café"yi bulur.
 * Türkçe metinde sonuç `turkceNormalize` ile aynıdır.
 */
export function aramaNormalize(metin: string): string {
  // Tipografik kesme işareti (’) düz olanla aynı sayılır: "billet d'avion" ↔ "Billet d’avion".
  const temel = turkceNormalize(metin).replace(/[’‘]/g, "'");
  try {
    return temel.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/ø/g, 'o').replace(/ß/g, 'ss');
  } catch {
    return temel;
  }
}

export function katalogAra(sorgu: string, haricTut: ReadonlySet<string> = new Set()): KatalogOgesi[] {
  const q = aramaNormalize(sorgu);
  if (!q) return [];

  const adaylar = aktifKatalogu().filter((u) => {
    if (haricTut.has(turkceNormalize(u.ad))) return false;
    return aramaNormalize(u.ad).includes(q);
  });

  const etiket = aktifEtiket();
  const sirala = (a: KatalogOgesi, b: KatalogOgesi) => a.ad.localeCompare(b.ad, etiket);
  const bastanEslesen = adaylar.filter((u) => aramaNormalize(u.ad).startsWith(q)).sort(sirala);
  const icindeGecen = adaylar.filter((u) => !aramaNormalize(u.ad).startsWith(q)).sort(sirala);
  return [...bastanEslesen, ...icindeGecen];
}
