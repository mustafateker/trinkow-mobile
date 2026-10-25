/**
 * Dil seçiminin cihazdaki kaydı — ActivationKing `Preferences["AppLanguage"]`
 * karşılığı. `expo-secure-store`un SENKRON API'siyle (web'de `localStorage`)
 * okunur, böylece ilk çizim doğru dilde olur.
 *
 * Kural (ActivationKing ile aynı):
 *  - İlk açılışta telefonun dili desteklenen 11 dilden birine eşlenir
 *    (desteklenmiyorsa İngilizce) ve kaydedilir.
 *  - Sonraki açılışlarda kayıtlı seçim kullanılır; Ayarlar'dan değiştirilir.
 *  - Ek: telefonun (ya da iOS/Android'de uygulamaya özel) dili sistem
 *    ayarlarından değiştirilirse bir sonraki açılışta o dile geçilir.
 */
import { getLocales } from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { desteklenenDil, diliAyarla, type Dil } from './cekirdek';

const DIL_ANAHTARI = 'AppLanguage';
const CIHAZ_DILI_ANAHTARI = 'AppLanguage.cihaz';

function cihazDili(): string | null {
  try {
    return getLocales()[0]?.languageCode ?? null;
  } catch {
    return null;
  }
}

function oku(anahtar: string): string | null {
  try {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(anahtar) ?? null;
    return SecureStore.getItem(anahtar);
  } catch {
    return null;
  }
}

function yaz(anahtar: string, deger: string): void {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(anahtar, deger);
    else SecureStore.setItem(anahtar, deger);
  } catch {
    // Yazılamazsa seçim bu oturumda geçerli kalır; bir sonraki açılışta cihaz diline düşülür.
  }
}

/** Uygulama açılışında bir kez çağrılır (ActivationKing `LocalizationService` kurucusu). */
export function dilBaslat(): Dil {
  const cihaz = cihazDili();
  const kayitli = oku(DIL_ANAHTARI);
  const sonCihaz = oku(CIHAZ_DILI_ANAHTARI);
  const cihazDegisti = cihaz !== null && cihaz !== sonCihaz;
  const dil = kayitli && !cihazDegisti ? desteklenenDil(kayitli) : desteklenenDil(cihaz);
  diliAyarla(dil);
  yaz(DIL_ANAHTARI, dil);
  if (cihaz) yaz(CIHAZ_DILI_ANAHTARI, cihaz);
  return dil;
}

/** Kullanıcı dil seçince: anında uygular (ekranlar yenilenir) ve kalıcı kaydeder. */
export function diliDegistir(dil: Dil): void {
  diliAyarla(dil);
  yaz(DIL_ANAHTARI, dil);
}
