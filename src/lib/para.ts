/**
 * Para biçimi — tokens.md §2.3 / metinler.md §0.
 *
 * Para DAİMA kuruş cinsinden integer tutulur. Float ile para tutmak
 * sessiz kuruş hatası üretir; bu yüzden `number` değerleri kuruştur ve
 * biçimlendirme yalnız gösterim anında yapılır.
 *
 * Biçim: `1.250,50 ₺` — binlik nokta, kuruş virgül, simge sonda, tek boşluk.
 * Liste ve kahraman sayıda kuruş gösterilmez.
 */

export const SIMGE = '₺';

/** "Çok büyük" eşiği — 100.000 ₺ üzeri girişte kontrol istenir (E-11 · E-12 ortak). */
export const TUTAR_BUYUK_ESIK_KURUS = 100_000_00;

/** 1.250 → "1.250" (binlik ayracı nokta) */
function binlik(tamKisim: number): string {
  const s = String(tamKisim);
  let out = '';
  for (let i = 0; i < s.length; i += 1) {
    if (i > 0 && (s.length - i) % 3 === 0) out += '.';
    out += s[i];
  }
  return out;
}

/**
 * Kuruş integer → gösterim sayısı (simge YOK).
 * `kurus` seçeneği açıkken kuruş iki hane yazılır.
 */
export function sayiyaCevir(kurusDeger: number, kurus = false): string {
  const mutlak = Math.abs(Math.round(kurusDeger));
  const lira = Math.floor(mutlak / 100);
  const isaret = kurusDeger < 0 ? '-' : '';
  if (!kurus) return isaret + binlik(lira);
  const kalan = mutlak % 100;
  return `${isaret}${binlik(lira)},${String(kalan).padStart(2, '0')}`;
}

/** Kuruş integer → `1.250 ₺` (liste/kahraman: kuruşsuz) */
export function paraYaz(kurusDeger: number, kurus = false): string {
  return `${sayiyaCevir(kurusDeger, kurus)} ${SIMGE}`;
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
  return kurus === undefined ? tamGosterim : `${tamGosterim},${kurus}`;
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
  const tamStr = sayiyaCevir(kurusDeger, true);
  return tamStr.replace(/\./g, '');
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
