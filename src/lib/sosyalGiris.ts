/** Native sosyal kimlik sağlayıcı akışları. Google ID token'ı yalnız backend'e
 * taşınır; Trinkow oturumu backend doğrulamasından sonra açılır. */
import { Platform, TurboModuleRegistry } from 'react-native';
import { t } from '@/content/metinler';
import { toastGoster } from '@/lib/toastBus';

export type SosyalSaglayici = 'apple' | 'google';
export type SosyalGirisHataKodu = 'yapilandirma' | 'native-modul' | 'play-services' | 'genel';
type GoogleSignInModulu = typeof import('react-native-nitro-google-signin');

export class SosyalGirisHatasi extends Error {
  readonly kod: SosyalGirisHataKodu;

  constructor(kod: SosyalGirisHataKodu) {
    super(kod);
    this.kod = kod;
  }
}

let googleYapilandirildi = false;
let googleModulu: GoogleSignInModulu | null = null;

function googleModulunuYukle(): GoogleSignInModulu {
  if (googleModulu) return googleModulu;

  // Metro, bulunamayan native paketin değerlendirme hatasını çağıran kod hatayı
  // yakalasa bile LogBox'a yazabiliyor. Paketi require etmeden önce Nitro'nun bu
  // native binary'ye gerçekten gömülü olduğunu güvenli `get` çağrısıyla denetle.
  const nitroKurulu = TurboModuleRegistry.get('NitroModules') !== null;
  if (!nitroKurulu) throw new SosyalGirisHatasi('native-modul');

  try {
    // Native modülü route yüklenirken değil, yalnız kullanıcı Google düğmesine
    // dokunduğunda değerlendir. Böylece Expo Go/eski development client bütün
    // auth route'larını düşürmez; kullanıcıya anlaşılır rebuild hatası verilir.
    googleModulu = require('react-native-nitro-google-signin') as GoogleSignInModulu;
    return googleModulu;
  } catch {
    throw new SosyalGirisHatasi('native-modul');
  }
}

function googleYapilandir(webClientId: string): GoogleSignInModulu {
  webClientId = webClientId.trim();
  if (!webClientId.endsWith('.apps.googleusercontent.com')) {
    throw new SosyalGirisHatasi('yapilandirma');
  }
  const modul = googleModulunuYukle();
  if (googleYapilandirildi) return modul;
  modul.GoogleOneTapSignIn.configure({
    webClientId,
    autoSelectOnSignIn: false,
  });
  googleYapilandirildi = true;
  return modul;
}

export function sosyalSaglayicilar(): SosyalSaglayici[] {
  // Native Google iOS dönüşü gerçek REVERSED_CLIENT_ID URL scheme'inin
  // Info.plist'e gömülmesini zorunlu kılar. Mobilde hiçbir OAuth kimliği
  // tutulmaması politikası nedeniyle Google şimdilik yalnız Android'de açılır.
  return Platform.OS === 'ios' ? ['apple'] : ['google'];
}

export async function appleIleDevamEt(): Promise<void> {
  toastGoster({ tur: 'info', metin: t['giris.sosyal_yok'] });
}

export async function googleIleDevamEt(webClientId: string): Promise<string | null> {
  try {
    const modul = googleYapilandir(webClientId);
    await modul.GoogleOneTapSignIn.checkPlayServices(true);
    let yanit = await modul.GoogleOneTapSignIn.signIn();
    if (modul.isNoSavedCredentialFoundResponse(yanit)) {
      yanit = await modul.GoogleOneTapSignIn.createAccount();
    }
    if (modul.isNoSavedCredentialFoundResponse(yanit)) {
      yanit = await modul.GoogleOneTapSignIn.presentExplicitSignIn();
    }
    if (modul.isCancelledResponse(yanit)) return null;
    if (!modul.isSuccessResponse(yanit) || !yanit.data.idToken) {
      throw new SosyalGirisHatasi('genel');
    }
    return yanit.data.idToken;
  } catch (hata) {
    if (hata instanceof SosyalGirisHatasi) throw hata;
    if (typeof hata === 'object' && hata !== null && 'code' in hata) {
      if (hata.code === 'SIGN_IN_CANCELLED') return null;
      if (hata.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new SosyalGirisHatasi('play-services');
      }
    }
    throw new SosyalGirisHatasi('genel');
  }
}

/** Uygulama oturumu kapatıldığında sessiz yeniden girişi de kapatır. */
export async function googleOturumunuKapat(): Promise<void> {
  try {
    if (googleModulu && googleYapilandirildi) {
      await googleModulu.GoogleOneTapSignIn.signOut();
    }
  } catch {
    // Trinkow oturumunun yerelde kapanmasını Google SDK hatası engellemez.
  }
}
