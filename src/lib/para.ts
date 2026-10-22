/**
 * Para biçimi — tokens.md §2.3 / metinler.md §0.
 *
 * Para DAİMA kuruş cinsinden integer tutulur. Float ile para tutmak
 * sessiz kuruş hatası üretir; bu yüzden `number` değerleri kuruştur ve
 * biçimlendirme yalnız gösterim anında yapılır.
 *
 * Para birimi ve ayraçlar kullanıcının yerelleştirme tercihinden gelir.
 * Saklanan integer seçili para biriminin alt birimidir (kuruş/cent).
 */

import { localeKodu, paraBirimi } from '@/lib/yerellestirme';

const PARA_SIMGE: Record<ReturnType<typeof paraBirimi>, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
};

export function paraSimgesi(): string {
  return PARA_SIMGE[paraBirimi()];
}

/** "Çok büyük" eşiği — 100.000 ₺ üzeri girişte kontrol istenir (E-11 · E-12 ortak). */
export const TUTAR_BUYUK_ESIK_KURUS = 100_000_00;

/** 1.250 → "1.250" (binlik ayracı nokta) */
function binlik(tamKisim: number): string {
  return new Intl.NumberFormat(localeKodu(), { maximumFractionDigits: 0 }).format(tamKisim);
}

/**
 * Kuruş integer → gösterim sayısı (simge YOK).
 * `kurus` seçeneği açıkken kuruş iki hane yazılır.
 */
export function sayiyaCevir(kurusDeger: number, kurus = false): string {
  const deger = Math.round(kurusDeger) / 100;
  return new Intl.NumberFormat(localeKodu(), {
    minimumFractionDigits: kurus ? 2 : 0,
    maximumFractionDigits: kurus ? 2 : 0,
  }).format(deger);
}

/** Kuruş integer → `1.250 ₺` (liste/kahraman: kuruşsuz) */
export function paraYaz(kurusDeger: number, kurus = false): string {
  const locale = localeKodu();
  const sayiSecenekleri: Intl.NumberFormatOptions = {
    minimumFractionDigits: kurus ? 2 : 0,
    maximumFractionDigits: kurus ? 2 : 0,
  };
  const tutar = Math.round(kurusDeger) / 100;
  if (locale === 'tr-TR') {
    // Hermes'in bazı iOS sürümlerinde `formatToParts` bulunmuyor. Türkçe
    // gösterimde simgeyi zaten sonda kullandığımız için sayıyı doğrudan
    // biçimlendirip eklemek hem aynı sonucu verir hem de bu API'ye bağımlılığı
    // ortadan kaldırır.
    const sayi = new Intl.NumberFormat(locale, sayiSecenekleri).format(tutar);
    return `${sayi} ${PARA_SIMGE[paraBirimi()]}`;
  }
  const formatter = new Intl.NumberFormat(locale, {
    ...sayiSecenekleri,
    style: 'currency',
    currency: paraBirimi(),
    currencyDisplay: 'narrowSymbol',
  });
  return formatter.format(tutar);
}

/** Liraları kuruşa çevirir — yalnız sabit/örnek veri yazarken kullanılır. */
export function lira(tutar: number): number {
  return Math.round(tutar * 100);
}

/**
 * §7.11 kil tuş takımı — kullanıcı yalnız rakam ve `,` yazar, `.` binlik
 * ayracı otomatik eklenir. `buffer` ekranda GÖRÜNMEYEN ham durumdur
 * (ör. "1250,5"); gösterim `tutarGosterimi`, kayıt değeri `tutarKurus`
 * ile üretilir. Float'a hiç dönülmez — hepsi string/integer.
 */
const TUTAR_TAM_KISIM_MAKS = 10;

/** Ham buffer → `1.250,5` gösterimi (yazarken); boşsa `0`. */
export function tutarGosterimi(buffer: string): string {
  if (!buffer) return '0';
  const [tam, kurus] = buffer.split(',');
  const tamGosterim = binlik(Number(tam || '0'));
  const ondalik = localeKodu() === 'en-US' ? '.' : ',';
  return kurus === undefined ? tamGosterim : `${tamGosterim}${ondalik}${kurus}`;
}

/** Ham buffer → kuruş integer (kayıt anında). */
export function tutarGirisindenKurus(buffer: string): number {
  if (!buffer) return 0;
  const [tam, kurus = ''] = buffer.split(',');
  const kurusIki = kurus.padEnd(2, '0').slice(0, 2);
  return Number(tam || '0') * 100 + Number(kurusIki || '0');
}

/** Kuruş integer → keypad buffer (E-12 düzenleme — mevcut tutarla başlatmak için). */
export function kurustanTutarGirisi(kurusDeger: number): string {
  const mutlak = Math.abs(Math.round(kurusDeger));
  const tam = Math.floor(mutlak / 100);
  const ondalik = String(mutlak % 100).padStart(2, '0');
  return `${kurusDeger < 0 ? '-' : ''}${tam},${ondalik}`;
}

/** Accept decimal comma/dot and pasted Turkish/English grouped amounts. */
export function nativeTutarGirisi(text: string): string {
  const clean = text.replace(/[^\d.,]/g, '');
  const comma = clean.lastIndexOf(',');
  const dot = clean.lastIndexOf('.');
  const ayiraclar = clean.match(/[.,]/g) ?? [];
  const ikiTurVar = comma >= 0 && dot >= 0;
  const son = Math.max(comma, dot);
  const sonrasinda = son < 0 ? 0 : clean.length - son - 1;
  const yalnizGruplama = !ikiTurVar && sonrasinda === 3 &&
    (ayiraclar.length === 1 || clean.split(/[.,]/).slice(1).every((parca) => parca.length === 3));
  if (yalnizGruplama) return clean.replace(/[.,]/g, '').slice(0, TUTAR_TAM_KISIM_MAKS);
  const separator = son;
  if (separator < 0) return clean.slice(0, TUTAR_TAM_KISIM_MAKS);
  // A single separator is decimal; both formats use their last separator.
  const whole = clean.slice(0, separator).replace(/[.,]/g, '').slice(0, TUTAR_TAM_KISIM_MAKS);
  const fraction = clean.slice(separator + 1).replace(/[.,]/g, '').slice(0, 2);
  return `${whole || '0'},${fraction}`;
}
