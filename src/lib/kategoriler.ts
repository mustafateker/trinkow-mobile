import type { IconName } from '@/components/Icon';
import { t } from '@/content/metinler';
import { catColor, type CatFamily } from '@/theme/tokens';
import { ozelKategoriBul } from '@/lib/ozelKategoriler';

/**
 * tokens.md §1.4 — 6 aile · 13 kategori (metinler.md §17 ile birebir).
 * Aile rengi GRUP bilgisi taşır; kategoriyi ayıran şey ikon + adtır
 * (WCAG 1.4.1: renk tek başına bilgi taşımaz).
 */
export type StandartKategoriKodu =
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

export type KategoriKodu = StandartKategoriKodu | (string & {});

export type Kategori = {
  kod: KategoriKodu;
  ad: string;
  aile: CatFamily;
  ikon: IconName;
};

/** Kategori — `ad` aktif dilden okunur (`kategori.ad.<kod>`), kod dilden bağımsızdır. */
function kat(kod: StandartKategoriKodu, aile: CatFamily, ikon: IconName): Kategori {
  return {
    kod,
    aile,
    ikon,
    get ad() {
      return t[`kategori.ad.${kod}`];
    },
  };
}

export const KATEGORILER: Record<StandartKategoriKodu, Kategori> = {
  market: kat('market', 'yesil', 'shopping-basket'),
  kafe: kat('kafe', 'amber', 'coffee'),
  ulasim: kat('ulasim', 'mavi', 'bus'),
  restoran: kat('restoran', 'amber', 'utensils'),
  fatura: kat('fatura', 'lacivert', 'receipt-text'),
  akaryakit: kat('akaryakit', 'mavi', 'fuel'),
  saglik: kat('saglik', 'yesil', 'pill'),
  kiraev: kat('kiraev', 'lacivert', 'house'),
  abonelik: kat('abonelik', 'lacivert', 'repeat'),
  eglence: kat('eglence', 'kiremit', 'ticket'),
  giyim: kat('giyim', 'kiremit', 'shirt'),
  aliskanliklar: kat('aliskanliklar', 'duman', 'footprints'),
  diger: kat('diger', 'duman', 'circle-dashed'),
};

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
  const secilen = KATEGORILER[kod as StandartKategoriKodu];
  if (secilen) {
    const adAnahtari: `kategori.ad.${StandartKategoriKodu}` = `kategori.ad.${secilen.kod as StandartKategoriKodu}`;
    return { ...secilen, ad: t[adAnahtari] ?? secilen.ad };
  }
  const ozel = ozelKategoriBul(kod);
  if (ozel) {
    return {
      kod: ozel.kod as KategoriKodu,
      ad: ozel.ad,
      aile: ozel.aile,
      ikon: ozel.ikon,
    };
  }
  return {
    kod: kod as KategoriKodu,
    ad: kod.startsWith('ozel_') ? kod.replace(/^ozel_([^_]+)_.*$/, '$1') : (kod.charAt(0).toUpperCase() + kod.slice(1)),
    aile: 'duman',
    ikon: 'circle-dashed',
  };
}

export function aileRenkleri(aile: CatFamily) {
  return catColor[aile] ?? catColor.duman;
}
