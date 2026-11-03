/**
 * Trinkow Premium üyeliği: RevenueCat istemcisi ve uygulama içi durum.
 *
 * - RevenueCat kullanıcı kimliği, backend kullanıcı kimliğiyle aynıdır
 *   (`Oturum.kullaniciId`). Oturum açılınca `uyelikBaslat`, kapanınca
 *   `uyelikKapat` çağrılır (`app/_layout.tsx#OturumGezgini`). Böylece abonelik
 *   cihaza değil hesaba bağlı kalır.
 * - Premium hakkı RevenueCat'teki `premium` entitlement'ıdır. Teklif grupları:
 *   `standard` (kayıttan sonra, onboarding'den önce, standart fiyat) ve
 *   `discount` (onboarding sonrası ve kilitli ekranlar, %50 indirim ve 7 gün deneme).
 * - Yalnız API anahtarı olan platformda etkindir. iOS anahtarı App Store
 *   ürünleri hazır olunca eklenecek; o zamana kadar iOS'ta kilit YOKTUR.
 */
import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesError,
  type PurchasesPackage,
} from 'react-native-purchases';

import { denemeGunSayisi, indirimYuzdesi } from '@/lib/uyelikFiyat';

/** RevenueCat public SDK anahtarı. Gizli değildir, uygulamaya gömülmek için üretilir. */
const API_ANAHTARI = Platform.OS === 'android' ? 'goog_DCSiecagjgXrYhJtxhErhZYwxIZ' : null;

/** Bu platformda satın alma ve Premium kilitleri açık mı? */
export const uyelikEtkin = API_ANAHTARI !== null;

const PREMIUM_HAKKI = 'premium';
const TEKLIF_KIMLIGI = { standart: 'standard', indirim: 'discount' } as const;
export type PaywallTuru = keyof typeof TEKLIF_KIMLIGI;

/** Aboneliğin yönetildiği ve iptal edildiği mağaza (yasal notlarda geçer). */
export const MAGAZA_ADI = Platform.OS === 'ios' ? 'App Store' : 'Google Play';

const YONETIM_ADRESI =
  Platform.OS === 'ios'
    ? 'https://apps.apple.com/account/subscriptions'
    : 'https://play.google.com/store/account/subscriptions?package=com.triworkster.trinkow';

/* ------------------------------------------------------------------ durum */

export type UyelikDurumu = 'bilinmiyor' | 'ucretsiz' | 'premium';

let durum: UyelikDurumu = 'bilinmiyor';
let aktifKullanici: string | null = null;
let yapilandirildi = false;
let sira: Promise<unknown> = Promise.resolve();
const dinleyiciler = new Set<() => void>();

function durumAyarla(yeni: UyelikDurumu): void {
  if (yeni === durum) return;
  durum = yeni;
  for (const dinleyici of dinleyiciler) dinleyici();
}

function premiumMu(bilgi: CustomerInfo): boolean {
  return bilgi.entitlements.active[PREMIUM_HAKKI] !== undefined;
}

function bilgiyiUygula(bilgi: CustomerInfo): void {
  durumAyarla(premiumMu(bilgi) ? 'premium' : 'ucretsiz');
}

/**
 * RevenueCat'in arka plan güncellemeleri (yenileme, iade, başka cihazdan alım).
 * Çıkış sırasında gelen anonim kullanıcı bilgisi yok sayılır.
 */
function musteriBilgisiDegisti(bilgi: CustomerInfo): void {
  if (aktifKullanici !== null) bilgiyiUygula(bilgi);
}

/** Giriş/çıkış çağrıları üst üste binmesin diye sırayla çalışır. */
function sirala<T>(is: () => Promise<T>): Promise<T> {
  const sonuc = sira.then(is);
  sira = sonuc.catch(() => {});
  return sonuc;
}

/* ------------------------------------------------------- oturum bağlantısı */

/** Oturum açıkken çağrılır: RevenueCat'i bu kullanıcıyla kurar ve Premium durumunu okur. */
export function uyelikBaslat(kullaniciId: string): Promise<void> {
  const apiKey = API_ANAHTARI;
  if (!apiKey) return Promise.resolve();
  return sirala(async () => {
    try {
      if (!yapilandirildi) {
        Purchases.configure({ apiKey, appUserID: kullaniciId });
        Purchases.addCustomerInfoUpdateListener(musteriBilgisiDegisti);
        yapilandirildi = true;
        aktifKullanici = kullaniciId;
        bilgiyiUygula(await Purchases.getCustomerInfo());
      } else if (aktifKullanici !== kullaniciId) {
        aktifKullanici = kullaniciId;
        durumAyarla('bilinmiyor');
        bilgiyiUygula((await Purchases.logIn(kullaniciId)).customerInfo);
      } else {
        bilgiyiUygula(await Purchases.getCustomerInfo());
      }
    } catch {
      // Ağ ya da mağaza hizmeti yoksa kullanıcı şimdilik ücretsiz sayılır;
      // bağlantı gelince RevenueCat dinleyicisi durumu kendiliğinden düzeltir.
      if (durum === 'bilinmiyor') durumAyarla('ucretsiz');
    }
  });
}

/** `uyelikBaslat`ı en fazla `ms` bekler; RevenueCat yavaşsa açılış takılmaz. */
export async function uyelikBaslatBekle(kullaniciId: string, ms: number): Promise<void> {
  await Promise.race([uyelikBaslat(kullaniciId), new Promise<void>((tamam) => setTimeout(tamam, ms))]);
}

/** Oturum kapanınca çağrılır. Sonraki kullanıcı öncekinin Premium'unu görmez. */
export function uyelikKapat(): Promise<void> {
  if (!API_ANAHTARI) return Promise.resolve();
  return sirala(async () => {
    const oturumVardi = aktifKullanici !== null;
    aktifKullanici = null;
    durumAyarla('bilinmiyor');
    if (yapilandirildi && oturumVardi) {
      try {
        await Purchases.logOut();
      } catch {
        // Kullanıcı zaten anonimse RevenueCat hata verir; çıkış için önemi yok.
      }
    }
  });
}

/* -------------------------------------------------------------- paywall */

export type PaywallPaketi = {
  kimlik: string;
  donem: 'yillik' | 'aylik';
  /** Mağazanın biçimlediği fiyat: "₺499,00", "$39.99". */
  fiyat: string;
  /** Yıllık planın aylık karşılığı; aylık planda `null`. */
  aylikKarsilik: string | null;
  /** Kullanıcı ücretsiz denemeye uygunsa gün sayısı, değilse `null`. */
  denemeGunu: number | null;
  /** İndirimli teklifte üstü çizili gösterilen standart fiyat. */
  standartFiyat: string | null;
  indirimYuzdesi: number | null;
  paket: PurchasesPackage;
};

/** Paywall'da gösterilecek yıllık ve aylık paketler (yıllık önce). */
export async function paywallPaketleri(tur: PaywallTuru): Promise<PaywallPaketi[]> {
  await sira;
  if (!yapilandirildi) throw new Error('RevenueCat yapılandırılmadı');
  const teklifler = await Purchases.getOfferings();
  const teklif = teklifler.all[TEKLIF_KIMLIGI[tur]];
  if (!teklif) throw new Error(`"${TEKLIF_KIMLIGI[tur]}" teklif grubu bulunamadı`);
  const standart = tur === 'indirim' ? (teklifler.all[TEKLIF_KIMLIGI.standart] ?? null) : null;

  const satirlar: ['yillik' | 'aylik', PurchasesPackage | null, PurchasesPackage | null][] = [
    ['yillik', teklif.annual, standart?.annual ?? null],
    ['aylik', teklif.monthly, standart?.monthly ?? null],
  ];
  const sonuc: PaywallPaketi[] = [];
  for (const [donem, paket, capa] of satirlar) {
    if (!paket) continue;
    const urun = paket.product;
    // Android: Google yalnız kullanıcının uygun olduğu teklifi döner, deneme
    // daha önce kullanıldıysa varsayılan seçenekte ücretsiz faz olmaz.
    const ucretsizFaz = urun.defaultOption?.freePhase?.billingPeriod ?? null;
    const giris = urun.introPrice;
    sonuc.push({
      kimlik: paket.identifier,
      donem,
      fiyat: urun.priceString,
      aylikKarsilik: donem === 'yillik' ? urun.pricePerMonthString : null,
      denemeGunu: ucretsizFaz
        ? denemeGunSayisi(ucretsizFaz.unit, ucretsizFaz.value)
        : giris && giris.price === 0
          ? denemeGunSayisi(giris.periodUnit, giris.periodNumberOfUnits)
          : null,
      standartFiyat: capa ? capa.product.priceString : null,
      indirimYuzdesi: capa ? indirimYuzdesi(capa.product.price, urun.price) : null,
      paket,
    });
  }
  if (sonuc.length === 0) throw new Error(`"${TEKLIF_KIMLIGI[tur]}" teklif grubunda paket yok`);
  return sonuc;
}

export type SatinAlmaSonucu = 'premium' | 'iptal' | 'beklemede' | 'hata';

export async function satinAl(paket: PurchasesPackage): Promise<SatinAlmaSonucu> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(paket);
    bilgiyiUygula(customerInfo);
    return premiumMu(customerInfo) ? 'premium' : 'hata';
  } catch (hata) {
    const kod = (hata as Partial<PurchasesError> | null)?.code;
    if (kod === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return 'iptal';
    if (kod === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) return 'beklemede';
    if (kod === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR) {
      // Mağaza "zaten sahipsin" diyorsa satın alma bu hesaba geri yüklenir.
      try {
        if (await geriYukle()) return 'premium';
      } catch {
        // aşağıdaki genel hataya düşer
      }
    }
    return 'hata';
  }
}

/** Mağazadaki satın alımları bu hesaba geri yükler; Premium açıldıysa `true`. Ağ hatasında fırlatır. */
export async function geriYukle(): Promise<boolean> {
  await sira;
  if (!yapilandirildi) throw new Error('RevenueCat yapılandırılmadı');
  const bilgi = await Purchases.restorePurchases();
  bilgiyiUygula(bilgi);
  return premiumMu(bilgi);
}

/** Aboneliği yönetme/iptal sayfası (mağazanın kendi sayfası). */
export async function abonelikYonetimAdresi(): Promise<string> {
  if (!yapilandirildi) return YONETIM_ADRESI;
  try {
    return (await Purchases.getCustomerInfo()).managementURL ?? YONETIM_ADRESI;
  } catch {
    return YONETIM_ADRESI;
  }
}

/* ------------------------------------------------------------ akış kararı */

function standartAnahtari(kullaniciId: string): string {
  return `trinkow.paywall.standart.${kullaniciId.replace(/[^A-Za-z0-9._-]/g, '_')}`;
}

/** Kayıttan sonra, onboarding'den önce standart fiyatlı paywall gösterilsin mi? Kullanıcı başına bir kez. */
export function standartPaywallGosterilsinMi(kullaniciId: string): boolean {
  if (!uyelikEtkin || durum === 'premium') return false;
  try {
    return SecureStore.getItem(standartAnahtari(kullaniciId)) !== '1';
  } catch {
    return false;
  }
}

/** Standart paywall ekrana geldiğinde çağrılır; uygulama yeniden açılınca tekrar gösterilmez. */
export function standartPaywallGosterildi(): void {
  if (!aktifKullanici) return;
  try {
    SecureStore.setItem(standartAnahtari(aktifKullanici), '1');
  } catch {
    // Yazılamazsa bir sonraki açılışta yeniden gösterilir; akışı bozmaz.
  }
}

/** Onboarding bitince indirimli paywall gösterilsin mi? */
export function indirimPaywallGosterilsinMi(): boolean {
  return uyelikEtkin && durum !== 'premium';
}

/* ------------------------------------------------------------------ hook */

function abone(dinleyici: () => void): () => void {
  dinleyiciler.add(dinleyici);
  return () => {
    dinleyiciler.delete(dinleyici);
  };
}

function anlikDurum(): UyelikDurumu {
  return durum;
}

/**
 * Ekranlar için Premium durumu.
 * - `kilitli`: Premium özelliği gösterilmemeli (ücretsiz ya da henüz bilinmiyor).
 * - `hazir`: durum biliniyor; `kilitli && !hazir` iken iskelet gösterilir.
 * RevenueCat'in kurulu olmadığı platformda hiçbir şey kilitli değildir.
 */
export function useUyelik() {
  const anlik = useSyncExternalStore(abone, anlikDurum, anlikDurum);
  return {
    premium: anlik === 'premium',
    kilitli: uyelikEtkin && anlik !== 'premium',
    hazir: !uyelikEtkin || anlik !== 'bilinmiyor',
  };
}
