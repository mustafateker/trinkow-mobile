/**
 * Yerelleştirme tercihi — DİL + PARA BİRİMİ.
 *
 * Dil, 11 dilli i18n çekirdeğinin (`src/i18n/cekirdek.ts`) aktif dilidir; bu
 * modül onu okur ve yazar, kendi kopyasını tutmaz (tek kaynak). Cihazdaki
 * kaydı `src/i18n/dilDeposu.ts` yapar.
 *
 * Para birimi dilden bağımsızdır ve burada tutulur; cihaz kaydı ve sunucu
 * eşitlemesi `yerellestirmeDeposu.ts`te.
 */
import {
  aktifDil,
  aktifEtiket,
  diliAyarla,
  dilDegisimineAbone,
  type Dil as UygulamaDili,
} from '@/i18n/cekirdek';

export type Dil = UygulamaDili;
export type ParaBirimi = 'TRY' | 'USD' | 'EUR';

/** Sunucunun `tercihler.dil` alanı yalnız bu iki değeri kabul eder (e-posta vb. sunucu metinleri). */
export type SunucuDili = 'tr' | 'en';

export type YerellestirmeTercihi = {
  dil: Dil;
  paraBirimi: ParaBirimi;
};

let paraBirimiDegeri: ParaBirimi = 'TRY';
const dinleyiciler = new Set<() => void>();

export function yerellestirmeTercihi(): YerellestirmeTercihi {
  return { dil: aktifDil(), paraBirimi: paraBirimiDegeri };
}

export function dilKodu(): Dil {
  return aktifDil();
}

export function ingilizceMi(): boolean {
  return aktifDil() === 'en';
}

/** Aktif dilin BCP-47 etiketi — "tr-TR", "en-US", "de-DE" … (`Intl` ve konuşma tanıma için). */
export function localeKodu(): string {
  return aktifEtiket();
}

/** Uygulama dili → sunucuya yazılan dil: Türkçe dışındaki her dil için İngilizce. */
export function sunucuDili(dil: Dil): SunucuDili {
  return dil === 'tr' ? 'tr' : 'en';
}

export function paraBirimi(): ParaBirimi {
  return paraBirimiDegeri;
}

export function yerellestirmeAyarla(yeni: Partial<YerellestirmeTercihi>): void {
  // Dil değişimini çekirdek kendi abonelerine duyurur (aşağıdaki abonelik onları da kapsar).
  if (yeni.dil && yeni.dil !== aktifDil()) diliAyarla(yeni.dil);
  if (yeni.paraBirimi && yeni.paraBirimi !== paraBirimiDegeri) {
    paraBirimiDegeri = yeni.paraBirimi;
    for (const dinleyici of dinleyiciler) dinleyici();
  }
}

/** Dil YA DA para birimi değişince haber verir; aboneliği bitiren fonksiyonu döner. */
export function yerellestirmeDegisimineAbone(dinleyici: () => void): () => void {
  dinleyiciler.add(dinleyici);
  const dilAboneligiBitir = dilDegisimineAbone(dinleyici);
  return () => {
    dinleyiciler.delete(dinleyici);
    dilAboneligiBitir();
  };
}

export function yerellestirmeAnlikDeger(): string {
  return `${aktifDil()}:${paraBirimiDegeri}`;
}
