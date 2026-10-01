import type { IconName } from '@/components/Icon';
import { catColor, type CatFamily } from '@/theme/tokens';

/**
 * tokens.md §1.4 — 6 aile · 13 kategori (metinler.md §17 ile birebir).
 * Aile rengi GRUP bilgisi taşır; kategoriyi ayıran şey ikon + adtır
 * (WCAG 1.4.1: renk tek başına bilgi taşımaz).
 */
export type KategoriKodu =
  | 'market'
  | 'saglik'
  | 'kafe'
  | 'restoran'
  | 'ulasim'
  | 'akaryakit'
  | 'fatura'
  | 'kiraev'
  | 'abonelik'
  | 'eglence'
  | 'giyim'
  | 'aliskanliklar'
  | 'diger';

export type Kategori = {
  kod: KategoriKodu;
  ad: string;
  aile: CatFamily;
  ikon: IconName;
};

export const KATEGORILER: Record<KategoriKodu, Kategori> = {
  market: { kod: 'market', ad: 'Market', aile: 'yesil', ikon: 'shopping-basket' },
  kafe: { kod: 'kafe', ad: 'Kafe', aile: 'amber', ikon: 'coffee' },
  ulasim: { kod: 'ulasim', ad: 'Ulaşım', aile: 'mavi', ikon: 'bus' },
  restoran: { kod: 'restoran', ad: 'Restoran', aile: 'amber', ikon: 'utensils' },
  fatura: { kod: 'fatura', ad: 'Fatura', aile: 'lacivert', ikon: 'receipt-text' },
  akaryakit: { kod: 'akaryakit', ad: 'Akaryakıt', aile: 'mavi', ikon: 'fuel' },
  saglik: { kod: 'saglik', ad: 'Sağlık', aile: 'yesil', ikon: 'pill' },
  kiraev: { kod: 'kiraev', ad: 'Kira ve ev', aile: 'lacivert', ikon: 'house' },
  abonelik: { kod: 'abonelik', ad: 'Abonelik', aile: 'lacivert', ikon: 'repeat' },
  eglence: { kod: 'eglence', ad: 'Eğlence', aile: 'kiremit', ikon: 'ticket' },
  giyim: { kod: 'giyim', ad: 'Giyim', aile: 'kiremit', ikon: 'shirt' },
  aliskanliklar: { kod: 'aliskanliklar', ad: 'Alışkanlıklar', aile: 'duman', ikon: 'footprints' },
  diger: { kod: 'diger', ad: 'Diğer', aile: 'duman', ikon: 'circle-dashed' },
} as const;

/** §4 dokunuş bütçesi — ilk 6 çip (frekansa göre sıralı; Faz 1 iskeletinde sabit sıra). */
export const ILK_ALTI: KategoriKodu[] = [
  'kafe',
  'market',
  'ulasim',
  'restoran',
  'fatura',
  'akaryakit',
];

/**
 * rev2-onboarding-kayit.md §5.2 `RoutineSheet` — çip şeridi bu sırayla
 * (prototip yüzey 6-9): günlük tekrar eden harcamalara özgü 6 kategori.
 * §4 `ILK_ALTI`den (frekans sıralı, harcama ekle) FARKLI bir küme —
 * hazır rutin çipleri yok, ad ve fiyatı kullanıcı yazar (K-050).
 */
export const RUTIN_KATEGORILERI: KategoriKodu[] = [
  'kafe',
  'ulasim',
  'market',
  'fatura',
  'abonelik',
  'aliskanliklar',
];

/** Kategori seçici tam ızgara — 13 kategori, aile bloklarına göre sıralı (prototip §"Kategori"). */
export const TUM_KATEGORILER: KategoriKodu[] = [
  'market',
  'saglik',
  'kafe',
  'restoran',
  'ulasim',
  'akaryakit',
  'fatura',
  'kiraev',
  'abonelik',
  'eglence',
  'giyim',
  'aliskanliklar',
  'diger',
];

/** Günlük hızlı ekleme alanı; planlı/sabit ödemeler kendi akışlarında kalır. */
export const GUNLUK_HARCAMA_KATEGORILERI: KategoriKodu[] = TUM_KATEGORILER.filter(
  (kod) => !(['abonelik', 'fatura', 'kiraev'] as KategoriKodu[]).includes(kod),
);

export const SABIT_ODEME_KATEGORILERI: KategoriKodu[] = ['abonelik', 'fatura', 'kiraev'];

export function kategori(kod: string): Kategori {
  return KATEGORILER[kod as KategoriKodu] ?? KATEGORILER.market;
}

export function aileRenkleri(aile: CatFamily) {
  return catColor[aile];
}
