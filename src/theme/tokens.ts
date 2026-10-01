import type { TextStyle } from 'react-native';

/**
 * Trinkow tasarım tokenları — tek kaynak.
 * Türetildiği yer: ../agency/projects/trinkow/docs/trinkow-design-kit.md.
 * Buradaki değerler bileşenlere KOPYALANMAZ; bileşen daima buradan okur.
 *
 * Bu dosya, önceki "claymorphism" (v3.1) tokenlarının yerine geçer: koyu
 * lacivert navigasyon + açık, havadar içerik yüzeyleri, kontrollü canlı
 * aksanlar ve tekil coral CTA. Aşağıdaki isimler (bileşenlerin okuduğu API)
 * kasıtlı olarak KORUNDU — yalnız değerler değişti — böylece tüm ekranlar
 * tek dosyadan yeniden temalanır.
 */

/* ---------------------------------------------------------------- §1 RENK */

export const color = {
  // §1.1 zemin ve yüzey
  bg: '#F5F6FC',
  surface: '#FFFFFF',
  groove: '#EEF0FA',
  well: '#EEF0FA',
  line: '#E3E6F2',
  disabledBg: '#E3E6F2',
  scrim: 'rgba(23,28,66,0.38)',
  /** §6.A/§6.J — koyu app header ve alt sekme çubuğu zemini (`ink-950`). */
  navDark: '#171C42',
  /** Koyu zemin üstündeki pasif ikon/metin tonu. */
  navMuted: '#8890C2',
  /** Koyu zemin üstündeki ikon buton zemini (dinlenme/basılı). */
  navGlassBg: 'rgba(255,255,255,0.12)',
  navGlassBgPressed: 'rgba(255,255,255,0.20)',

  // §1.2 metin
  text: '#272F66',
  text2: '#56618F',
  text3: '#9AA3CB',
  onPrimary: '#FFFFFF',

  // §1.3 eylem ve durum
  /**
   * `primary` = ana etkileşim/seçili durum (indigo). `primaryDeep` aynı
   * ailenin daha koyu tonu — dolu/seçili kontroller (Checkbox, ClaySwitch,
   * DayBox, LimitGauge dolgusu, streak) bunu kullanır. Ekranın BİRİCİK
   * canlı CTA rengi ise `action` (coral) — yalnız `Button` "primary"
   * varyantı ve eşdeğer birincil kaydet/ekle eylemleri bunu kullanır.
   */
  primary: '#5C5AF6',
  primaryDeep: '#4744D4',
  primaryPress: '#3B39B3',
  primaryText: '#5C5AF6',
  primarySoft: '#ECEBFF',
  /** Tekil parlak CTA — ekran başına en fazla bir görünür kullanım. */
  action: '#F45B6B',
  actionPressed: '#DE4558',
  warning: '#D88718',
  warningDeep: '#B4700F',
  warningInk: '#8A560B',
  warningSoft: '#FFF2DB',
  /** yalnız dört bağlam: taksit serisi silme · tüm veriyi silme · form hatası kenarlığı · silme toast göstergesi */
  danger: '#E23D4F',
  dangerInk: '#C22E3F',
  dangerSoft: '#FCE3E6',
  success: '#20A876',
  successInk: '#187F5A',
  successSoft: '#E2F6ED',
} as const;

/**
 * Plan pay çubuğunun (`ShareBar`/`ShareRow`) ÜÇ segment rengi.
 * `success` yalnız bu grafik bağlamda kullanılır ve ÜSTÜNDE METİN TAŞIMAZ
 * (pay adları çubuğun dışındaki `ShareRow`da).
 */
export const share = {
  zorunlu: color.primaryDeep,
  sosyal: color.primary,
  birikim: color.success,
} as const;

/** `Slider` — oluk/topuz/satır. */
export const slider = {
  track: 12,
  knob: 32,
  row: 44,
} as const;

/** Kategori aileleri — 6 aile, tasarım kitinin kategori paletinden. */
export const catColor = {
  mavi: { solid: '#4B87FF', soft: '#E7EFFF' },
  lacivert: { solid: '#7D60E8', soft: '#EFEAFC' },
  yesil: { solid: '#29AD7B', soft: '#E2F6ED' },
  amber: { solid: '#F39B42', soft: '#FFF2DB' },
  kiremit: { solid: '#E96881', soft: '#FCE8EC' },
  duman: { solid: '#6B7290', soft: '#EAEBF2' },
} as const;

export type CatFamily = keyof typeof catColor;

/** İzinli gradyanlar. */
export const gradient = {
  /** Kahraman yay dolgusu (yay boyunca) */
  arc: ['#5C5AF6', '#4744D4'] as const,
  /** Taşma yayı — yalnız limit dışı */
  arcOver: ['#D88718', '#B4700F'] as const,
  /** Birincil buton, FAB — dikey, koyu uçlu (coral CTA) */
  action: ['#F45B6B', '#DE4558'] as const,
  actionPressed: ['#DE4558', '#C93B4C'] as const,
} as const;

/* ----------------------------------------------------------- §2 TİPOGRAFİ */

/** Birincil font: Plus Jakarta Sans (tasarım kiti §4). Üç ağırlık dosyası. */
export const fontFamily = {
  /** Plus Jakarta Sans 500 */
  uiRegular: 'PlusJakartaSans_500Medium',
  /** Plus Jakarta Sans 700 */
  uiSemibold: 'PlusJakartaSans_700Bold',
  /** Plus Jakarta Sans 800 — tüm rakamlar (tabular) */
  numBold: 'PlusJakartaSans_800ExtraBold',
  /** Plus Jakarta Sans 800 — başlıklar */
  display: 'PlusJakartaSans_800ExtraBold',
} as const;

/** Tabular rakam. `₺` ve tutarlar daima bununla dizilir. */
export const TABULAR = ['tabular-nums'] as NonNullable<TextStyle['fontVariant']>;

/**
 * Tip rolü seti — tasarım kiti §4 tablosuna göre.
 * `hero` yalnız ana ekrandaki "bugün kalan" tutarında kullanılır (kitin
 * `display` rolü); `display` rolü kitin `amount-lg` (özet değer) karşılığı;
 * `amount` rolü kitin `amount-sm` (liste satırı tutarı) karşılığıdır. Rol
 * ADLARI eski bileşenlerle uyum için korunur, yalnız değerler kit'e göre.
 */
export const type = {
  hero: {
    fontFamily: fontFamily.numBold,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.5,
    fontVariant: TABULAR,
  },
  display: {
    fontFamily: fontFamily.numBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
    fontVariant: TABULAR,
  },
  amount: {
    fontFamily: fontFamily.numBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.1,
    fontVariant: TABULAR,
  },
  h1: {
    fontFamily: fontFamily.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fontFamily.display,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  body: { fontFamily: fontFamily.uiRegular, fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  bodyStrong: { fontFamily: fontFamily.uiSemibold, fontSize: 16, lineHeight: 22, letterSpacing: 0 },
  label: { fontFamily: fontFamily.uiSemibold, fontSize: 13, lineHeight: 18, letterSpacing: 0.1 },
  caption: { fontFamily: fontFamily.uiRegular, fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  micro: { fontFamily: fontFamily.uiRegular, fontSize: 12, lineHeight: 16, letterSpacing: 0.1 },
} satisfies Record<string, TextStyle>;

/* ------------------------------------------------------------ §3 SPACING */

/** §3 — taban 4pt. Bu altı değerin dışında boşluk kullanılamaz. */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 40,
  8: 48,
} as const;

/**
 * §3.1 dikey ritim seti — her değerin TEK bir işi vardır.
 * Kodda `space[n]` yerine bu adları kullan; hangi işi yaptığı okunsun.
 */
export const rhythm = {
  /** 4 — aynı nesnenin iki satırı */
  sameObject: space[1],
  /** 8 — başlık↔gövde · etiket↔girdi · aynı grubun tekrarlayan öğeleri */
  group: space[2],
  /** 12 — kartın İÇİNDE iki bağımsız blok */
  blockInCard: space[3],
  /** 16 — iç boşluk (padding), dikey ritim değil */
  pad: space[4],
  /** 24 — ekran düzeyinde iki bağımsız blok · içerik alt boşluğu */
  section: space[5],
} as const;

export const layout = {
  /** §3 — tüm ekranlarda sabit */
  screenPaddingX: space[5],
  /** §3.1 .ekran-basi → üst 8 / alt 16 */
  headerPadTop: space[2],
  headerPadBottom: space[4],
  /** §3.1 kaydırılan içeriğin sonu */
  scrollPadBottom: space[5],
} as const;

/* ------------------------------------------------------------- §4 RADIUS */

/** Tasarım kiti §5 — ana yüzey/sheet 28 · özet kartı 24 · kart/input 16 · pill 999. */
export const radius = {
  hero: 28,
  card: 24,
  tile: 16,
  pill: 999,
  none: 0,
} as const;

/** §4 — odak halkası = eleman radius + 4 */
export const focusRing = {
  width: 2,
  color: color.primaryText,
  /** koyu zeminde */
  colorOnDark: '#FFFFFF',
  offset: 2,
} as const;

/* ------------------------------------------------------- §5 GÖLGE (flat) */

/**
 * Tasarım kiti §5 "Gölge ve sınır" — kabartmalı/neumorphic dil tamamen
 * bırakıldı. `clay.*` adları eski bileşenlerle uyum için korunur; artık
 * hepsi kitin üç düz gölge tokenına (`shadow-subtle` / `shadow-float` /
 * `shadow-nav`) veya "gölge yok"a eşlenir. Inset katman kalmadı.
 */
export const clay = {
  /** Normal kart, liste satırı, kategori kutusu, çip — `shadow-subtle` */
  raised: '0 2px 8px rgba(23,28,66,0.06)',
  /** Bottom sheet, modal, yüzen sekme çubuğu, toast — `shadow-float` */
  raisedLg: '0 12px 30px rgba(23,28,66,0.12)',
  /** Basılı etkileşimli yüzey — çok hafif, kabartma yok */
  pressed: '0 1px 3px rgba(23,28,66,0.08)',
  /** Oluk, metin girişi kuyusu, segment track, ilerleme oluğu — düz zemin, gölge yok */
  sunken: 'none',
  /** Birincil buton / FAB — tekil coral CTA'nın kendi renginde yumuşak gölgesi */
  action: '0 10px 22px -6px rgba(244,91,107,0.45), 0 2px 6px -2px rgba(244,91,107,0.25)',
  /** Birincil buton / FAB pressed */
  actionPressed: '0 4px 10px -2px rgba(222,69,88,0.35)',
} as const;

/* ------------------------------------------------ §6 DOKUNMA / ERİŞİM */

export const a11y = {
  /** §6 — minimum dokunma hedefi */
  minTarget: 44,
} as const;

/* -------------------------------------------------- §7 BİLEŞEN ÖLÇÜLERİ */

export const size = {
  /** §7.1 buton yükseklikleri */
  buttonPrimary: 52,
  buttonSecondary: 52,
  buttonGhost: 44,
  buttonPadX: space[5],
  buttonGhostPadX: space[4],
  /** §7.1 ikon: buton içi 20, varsayılan 24, FAB 28 (§9) */
  iconSm: 20,
  icon: 24,
  iconFab: 28,
  /** §7.3 liste satırı */
  rowMinHeight: 68,
  rowPadY: space[3],
  rowPadX: space[4],
  /** §7.3 sol kategori kabı */
  catBox: 44,
  /** §7.4 metin girişi */
  input: 56,
  /** §7.6 çip */
  chipHeight: 40,
  chipPadX: space[4],
  chipMaxWidth: 240,
  chipNameMaxWidth: 120,
  /** §7.7 alt sekme çubuğu */
  tabBarHeight: 60,
  tabItemWidth: 64,
  tabItemHeight: 48,
  tabIconBox: 40,
  tabIconBoxHeight: 24,
  tabIconBoxHeightActive: 32,
  /** §7.7 FAB — bar üstünden 16 taşar, sağdan 8 */
  fab: 64,
  fabOverhang: space[4],
  fabRight: space[2],
  /** ikon butonu (44) */
  iconButton: 44,
  iconButtonGlyph: 22,
  /** §7.5 kategori çubuğu */
  catBarHeight: 12,
  /** §7.12 `ClaySwitch` — track 56×32, iç boşluk 4, topuz 24 */
  switchTrackW: 56,
  switchTrackH: 32,
  switchTrackPad: 4,
  switchKnob: 24,
} as const;

/** §7.5 kahraman gösterge geometrisi — prototipteki ölçüler birebir. */
export const gauge = {
  /** Günlük özetindeki kompakt dairesel kullanım grafiği. */
  summaryDiameter: 104,
  summaryTrackWidth: 10,
  summaryOverWidth: 4,
  /** dış kabarık disk çapı */
  diameter: 224,
  /** oluk merkez yarıçapı (78..94) */
  trackRadius: 86,
  /** oluk + dolgu kalınlığı */
  trackWidth: 16,
  /** çukurluk kenar yayları */
  edgeOuterRadius: 92.5,
  edgeInnerRadius: 79.5,
  edgeWidth: 2.5,
  edgeOuterColor: 'rgba(23,28,66,0.13)',
  edgeInnerColor: 'rgba(255,255,255,0.95)',
  /** dolgu parlaması */
  fillGlossWidth: 5,
  fillGlossColor: 'rgba(255,255,255,0.30)',
  /** yay açıklığı 270°, boşluk altta, başlangıç saat 7 */
  sweepDegrees: 270,
  startAngleDeg: 135,
  /** topuz (§7.5) */
  knobRadius: 13,
  knobRingWidth: 4,
  knobRingRadius: 11,
  knobShadowRadius: 13.5,
  knobShadowColor: 'rgba(23,28,66,0.18)',
  knobGlossRadius: 8,
  knobGlossWidth: 1.5,
  knobGlossColor: 'rgba(255,255,255,0.55)',
  /** taşma yayı — merkez yarıçapı 102, 8pt, saat 12'den saat yönünde */
  overRadius: 102,
  overWidth: 8,
  overGlossWidth: 3,
  overGlossColor: 'rgba(255,255,255,0.32)',
  /** iç alan genişliği — uzun tutar kuralının ölçüldüğü yer */
  innerWidth: 156,
  /** §7.5 — 1.000 gibi dört haneli tutarlar iç daireye sığması için küçülür. */
  heroDigitLimit: 5,
  /** §7.8 boş durum illüstrasyonu */
  emptyDiameter: 176,
  emptyTrackRadius: 70,
  emptyTrackWidth: 12,
  emptyEdgeOuterRadius: 75,
  emptyEdgeInnerRadius: 65,
} as const;

/* ------------------------------------------------------------ §8 HAREKET */

/** §8 — 150–250ms, ease-out. Reduce motion açıkken tüm süreler 0ms. */
export const motion = {
  press: 150,
  arc: 250,
  count: 250,
  sheet: 250,
  /** rev2-tasarruf-profil.md §3.12.3 · rev3-gunluk-rutin.md §3 — `Accordion` yükseklik/ok animasyonu. */
  accordion: 200,
} as const;

/** §9 — Lucide, çizgi kalınlığı 2.0 (FAB 2.5, prototipte böyle) */
export const icon = {
  strokeWidth: 2,
  strokeWidthFab: 2.5,
} as const;

/**
 * §7.13 v4 bileşenleri (E-10 sayfalama · E-21 seri · E-24 gün seçici).
 * Yeni ölçü ailesi AÇILMAZ — hepsi mevcut 8/24/44/96 değerlerinden.
 */
export const v4 = {
  /** `MilestoneRail` durağı — 44 dairesi (a11y.minTarget), 24×8 bağlantı yolu */
  durakDiameter: a11y.minTarget,
  durakTrackWidth: space[5],
  durakTrackHeight: space[2],
  /** `StreakDayGrid` / `MonthGrid` kutusu — mevcut `DayBox` (44), lejant karesi 24 */
  dayBox: a11y.minTarget,
  legendSwatch: space[5],
  /** Kutlama kartı (`MilestoneOverlay`) diski — mevcut hata dairesi ölçüsü */
  milestoneDisk: 96,
  /** `MonthGrid` bugün noktası */
  monthTodayDot: space[2],
  /** Hücreler arası boşluk (§3.3 negatif oluk telafisi) */
  gridGap: space[2],
} as const;
