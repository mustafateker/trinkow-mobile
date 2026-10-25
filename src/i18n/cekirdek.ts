/**
 * Lokalizasyon çekirdeği — ActivationKing `LocalizationService` karşılığı.
 *
 * - Dil paketleri `paketKaydet` ile kaydedilir (ActivationKing `Register`).
 *   Uygulama hepsini `src/i18n/kaynaklar/index.ts` üzerinden bir kez kaydeder.
 * - `diliAyarla` aktif dili değiştirir: `t` sözlüğü ve `takvim` dizileri
 *   YERİNDE güncellenir, abonelere haber verilir (ActivationKing `CultureChanged`).
 * - Eksik çeviri sırası: aktif dil → İngilizce → Türkçe → anahtarın kendisi.
 *
 * Saf modül: React/Expo bağımlılığı yoktur, testler doğrudan yükler.
 * Cihaz dilini okuma ve seçimi saklama `dilDeposu.ts`te.
 */
import type { DilPaketi, MetinAnahtari, Takvim } from './tip';

export type { MetinAnahtari } from './tip';

export type Dil = 'en' | 'tr' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'ro' | 'pl' | 'ru' | 'cs';

/** Desteklenen diller — TEK liste. Seçici, cihaz dili eşlemesi ve testler buradan okur. */
export const DILLER: readonly { kod: Dil; ad: string; etiket: string }[] = [
  { kod: 'en', ad: 'English', etiket: 'en-US' },
  { kod: 'tr', ad: 'Türkçe', etiket: 'tr-TR' },
  { kod: 'de', ad: 'Deutsch', etiket: 'de-DE' },
  { kod: 'fr', ad: 'Français', etiket: 'fr-FR' },
  { kod: 'es', ad: 'Español', etiket: 'es-ES' },
  { kod: 'it', ad: 'Italiano', etiket: 'it-IT' },
  { kod: 'pt', ad: 'Português', etiket: 'pt-PT' },
  { kod: 'ro', ad: 'Română', etiket: 'ro-RO' },
  { kod: 'pl', ad: 'Polski', etiket: 'pl-PL' },
  { kod: 'ru', ad: 'Русский', etiket: 'ru-RU' },
  { kod: 'cs', ad: 'Čeština', etiket: 'cs-CZ' },
];

/** Desteklenmeyen cihaz dilinde ve eksik çeviride düşülen dil. */
export const VARSAYILAN_DIL: Dil = 'en';
/** Metinlerin yazıldığı kaynak dil — son yedek. */
export const KAYNAK_DIL: Dil = 'tr';

/** "de-AT", "pt_BR", "TR" → desteklenen dil; tanınmazsa İngilizce (ActivationKing `MapToSupportedLanguage`). */
export function desteklenenDil(kod: string | null | undefined): Dil {
  const iki = (kod ?? '').trim().slice(0, 2).toLowerCase();
  return DILLER.some((d) => d.kod === iki) ? (iki as Dil) : VARSAYILAN_DIL;
}

/* ------------------------------------------------------------------ durum */

const paketler: Partial<Record<Dil, DilPaketi>> = {};
let aktif: Dil = VARSAYILAN_DIL;
const dinleyiciler = new Set<() => void>();

/** Aktif dilin metinleri. Nesne SABİTTİR, içeriği dil değişince yerinde yenilenir. */
export const t = {} as Record<MetinAnahtari, string>;

/** Aktif dilin takvim adları. Diziler SABİTTİR, içerikleri yerinde yenilenir. */
export const takvim: Takvim = {
  aylar: [],
  aylarTarih: [],
  aylarKisa: [],
  ayIcinde: [],
  gunler: [],
  haftaGunKisa: [],
  haftaGunMikro: [],
};

function zincir(): DilPaketi[] {
  const sira: Dil[] = [aktif, VARSAYILAN_DIL, KAYNAK_DIL];
  const sonuc: DilPaketi[] = [];
  for (const dil of sira) {
    const paket = paketler[dil];
    if (paket && !sonuc.includes(paket)) sonuc.push(paket);
  }
  return sonuc;
}

function uygula(): void {
  const paketlerSirali = zincir();
  if (paketlerSirali.length === 0) return;
  // En düşük öncelikliden başlayıp üstüne yaz: eksik anahtar yedekten gelir.
  for (const paket of [...paketlerSirali].reverse()) {
    for (const [anahtar, deger] of Object.entries(paket.metinler)) {
      if (deger) (t as Record<string, string>)[anahtar] = deger;
    }
  }
  const kaynak = paketlerSirali[0].takvim;
  for (const alan of Object.keys(takvim) as (keyof Takvim)[]) {
    takvim[alan].splice(0, takvim[alan].length, ...kaynak[alan]);
  }
}

/** Bir dil paketini kaydeder (ActivationKing `LocalizationService.Register`). */
export function paketKaydet(dil: Dil, paket: DilPaketi): void {
  paketler[dil] = paket;
  uygula();
}

/** Aktif dili değiştirir; değiştiyse abonelere haber verir. Kalıcı kayıt `dilDeposu.ts#diliDegistir`. */
export function diliAyarla(dil: Dil): void {
  const yeni = desteklenenDil(dil);
  const degisti = yeni !== aktif;
  aktif = yeni;
  uygula();
  if (degisti) for (const dinleyici of dinleyiciler) dinleyici();
}

export function aktifDil(): Dil {
  return aktif;
}

/** "tr-TR", "en-US" — `localeCompare` ve `Intl` için. */
export function aktifEtiket(): string {
  return DILLER.find((d) => d.kod === aktif)?.etiket ?? 'en-US';
}

/** Dil değişimine abone olur; aboneliği bitiren fonksiyonu döner (`useSyncExternalStore` uyumlu). */
export function dilDegisimineAbone(dinleyici: () => void): () => void {
  dinleyiciler.add(dinleyici);
  return () => {
    dinleyiciler.delete(dinleyici);
  };
}

function aktifPaket(): DilPaketi | undefined {
  return zincir()[0];
}

/** Ayın günü, "o gün" anlamında — tr "15'inde", en "15th". */
export function gunBulunma(gun: number): string {
  return aktifPaket()?.gunBulunma(gun) ?? String(gun);
}

/** Ayın günü, "ayın X'i" anlamında — tr "15'i", en "15th". */
export function gunIyelik(gun: number): string {
  return aktifPaket()?.gunIyelik(gun) ?? String(gun);
}

/**
 * Bir anahtarın KAYITLI BÜTÜN dillerdeki metinleri (tekrarsız). Kullanıcının
 * başka bir dildeyken kaydettiği adı tanımak için — ör. Türkçe'yken eklenen
 * "Kahve" rutini, uygulama İngilizce'yken "Coffee" önerisiyle eşleşsin.
 */
export function butunDillerde(anahtar: MetinAnahtari): string[] {
  const sonuc = new Set<string>();
  for (const paket of Object.values(paketler)) {
    const deger = paket?.metinler[anahtar];
    if (deger) sonuc.add(deger);
  }
  return [...sonuc];
}

/** Katalog kalemi adı; aktif dilde yoksa yedek dillerden, hiçbirinde yoksa `undefined`. */
export function katalogAdi(kimlik: string): string | undefined {
  for (const paket of zincir()) {
    const ad = (paket.katalog as Record<string, string>)[kimlik];
    if (ad) return ad;
  }
  return undefined;
}

/* ------------------------------------------------------- şablon biçimleme */

export type Degerler = Record<string, string | number>;

/** Anahtarın şablonunu aktif dilde doldurur: `metin('toast.x', { tutar })`. */
export function metin(anahtar: MetinAnahtari, degerler: Degerler = {}): string {
  return bicimle(t[anahtar] ?? anahtar, degerler, aktif);
}

export type CogulKategori = 'one' | 'few' | 'many' | 'other';

/** CLDR çoğul kuralları (yalnız tam sayılar; sayaçlar hep tam sayıdır). */
export function cogulKategorisi(dil: Dil, n: number): CogulKategori {
  const i = Math.floor(Math.abs(n));
  if (!Number.isInteger(n)) return dil === 'cs' ? 'many' : 'other';
  const son = i % 10;
  const sonIki = i % 100;
  switch (dil) {
    case 'fr':
      return i === 0 || i === 1 ? 'one' : 'other';
    case 'ro':
      if (i === 1) return 'one';
      return i === 0 || (sonIki >= 1 && sonIki <= 19) ? 'few' : 'other';
    case 'pl':
      if (i === 1) return 'one';
      if (son >= 2 && son <= 4 && !(sonIki >= 12 && sonIki <= 14)) return 'few';
      return 'many';
    case 'ru':
      if (son === 1 && sonIki !== 11) return 'one';
      if (son >= 2 && son <= 4 && !(sonIki >= 12 && sonIki <= 14)) return 'few';
      return 'many';
    case 'cs':
      if (i === 1) return 'one';
      return i >= 2 && i <= 4 ? 'few' : 'other';
    default:
      // en, tr, de, es, it, pt
      return i === 1 ? 'one' : 'other';
  }
}

/**
 * ICU MessageFormat alt kümesi:
 *  - `{ad}` yer tutucu
 *  - `{n, plural, =0 {...} one {...} few {...} many {...} other {...}}` — dal içinde `#` sayıdır
 *  - `{x, select, a {...} b {...} other {...}}`
 * Kesme işareti (') özel DEĞİLDİR — Türkçe ekler ("Eylül'de") olduğu gibi kalır.
 */
export function bicimle(sablon: string, degerler: Degerler, dil: Dil): string {
  return parcaBicimle(sablon, degerler, dil, null);
}

function parcaBicimle(sablon: string, degerler: Degerler, dil: Dil, diyez: string | null): string {
  let cikti = '';
  let i = 0;
  while (i < sablon.length) {
    const c = sablon[i];
    if (c === '{') {
      const kapanis = eslesenKapanis(sablon, i);
      if (kapanis < 0) {
        cikti += sablon.slice(i);
        break;
      }
      cikti += argumanBicimle(sablon.slice(i + 1, kapanis), degerler, dil);
      i = kapanis + 1;
    } else if (c === '#' && diyez !== null) {
      cikti += diyez;
      i += 1;
    } else {
      cikti += c;
      i += 1;
    }
  }
  return cikti;
}

function eslesenKapanis(metinParcasi: string, acilis: number): number {
  let derinlik = 0;
  for (let j = acilis; j < metinParcasi.length; j += 1) {
    if (metinParcasi[j] === '{') derinlik += 1;
    else if (metinParcasi[j] === '}') {
      derinlik -= 1;
      if (derinlik === 0) return j;
    }
  }
  return -1;
}

function argumanBicimle(ic: string, degerler: Degerler, dil: Dil): string {
  const virgul = ic.indexOf(',');
  if (virgul < 0) {
    const ad = ic.trim();
    return Object.prototype.hasOwnProperty.call(degerler, ad) ? String(degerler[ad]) : `{${ad}}`;
  }
  const ad = ic.slice(0, virgul).trim();
  const kalan = ic.slice(virgul + 1);
  const virgul2 = kalan.indexOf(',');
  const tur = (virgul2 < 0 ? kalan : kalan.slice(0, virgul2)).trim();
  const secenekler = secenekleriAyristir(virgul2 < 0 ? '' : kalan.slice(virgul2 + 1));
  const deger = degerler[ad];
  if (tur === 'plural') {
    const sayi = Number(deger);
    const dal = secenekler.get(`=${sayi}`) ?? secenekler.get(cogulKategorisi(dil, sayi)) ?? secenekler.get('other') ?? '';
    return parcaBicimle(dal, degerler, dil, String(deger));
  }
  if (tur === 'select') {
    const dal = secenekler.get(String(deger)) ?? secenekler.get('other') ?? '';
    return parcaBicimle(dal, degerler, dil, null);
  }
  return deger === undefined ? `{${ad}}` : String(deger);
}

function secenekleriAyristir(metinParcasi: string): Map<string, string> {
  const secenekler = new Map<string, string>();
  let i = 0;
  while (i < metinParcasi.length) {
    const acilis = metinParcasi.indexOf('{', i);
    if (acilis < 0) break;
    const anahtar = metinParcasi.slice(i, acilis).trim();
    const kapanis = eslesenKapanis(metinParcasi, acilis);
    if (kapanis < 0) break;
    secenekler.set(anahtar, metinParcasi.slice(acilis + 1, kapanis));
    i = kapanis + 1;
  }
  return secenekler;
}
