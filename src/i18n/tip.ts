/**
 * Dil paketi sözleşmesi. Anahtar listesinin TEK kaynağı Türkçe pakettir
 * (`kaynaklar/tr.ts`); diğer diller aynı anahtarları taşımak zorundadır —
 * eksik ya da fazla anahtar derleme hatası verir.
 */
import type { katalog, metinler } from './kaynaklar/tr';

export type MetinAnahtari = keyof typeof metinler;
export type KatalogKimligi = keyof typeof katalog;

/** Takvim adları. Ay dizileri 12, gün dizileri 7 elemanlıdır. */
export type Takvim = {
  /** Tek başına ay adı — ay başlığı, "Eylül 2026". */
  aylar: string[];
  /** Gün sayısıyla birlikte tarihte kullanılan biçim — "10 Eylül" (Rusça/Lehçe/Çekçe'de -in hâli). */
  aylarTarih: string[];
  /** Kısa ay adı — "Eyl". */
  aylarKisa: string[];
  /** "O ayda" ifadesi — "Eylül'de", "in September", "im September". */
  ayIcinde: string[];
  /** Haftanın günleri, Pazar ilk (Date#getDay sırası) — "Pazar". */
  gunler: string[];
  /** Kısa gün adı, Pazartesi ilk — "Pzt". */
  haftaGunKisa: string[];
  /** İki harflik gün adı, Pazartesi ilk — "Pt". */
  haftaGunMikro: string[];
};

export type DilPaketi = {
  metinler: Record<MetinAnahtari, string>;
  takvim: Takvim;
  /** Ayın günü, "o gün" anlamında — tr "15'inde", en "15th". */
  gunBulunma: (gun: number) => string;
  /** Ayın günü, "ayın X'i" anlamında — tr "15'i", en "15th". */
  gunIyelik: (gun: number) => string;
  /** Ürün kataloğu adları (`urunKatalogu.ts` kimliğiyle). */
  katalog: Record<KatalogKimligi, string>;
};
