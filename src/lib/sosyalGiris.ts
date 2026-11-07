/** Native sosyal kimlik sağlayıcı akışları. Apple ve Google ID token'ı yalnız
 * backend'e taşınır; Trinkow oturumu backend doğrulamasından sonra açılır. */
import { Platform, TurboModuleRegistry } from 'react-native';

export type SosyalSaglayici = 'apple' | 'google';
export type SosyalGirisHataKodu =
  | 'yapilandirma'
  | 'oauth-yapilandirma'
  | 'native-modul'
  | 'play-services'
  | 'genel';
type AppleAuthModulu = typeof import('expo-apple-authentication');
type GoogleSignInModulu = typeof import('react-native-nitro-google-signin');

export class SosyalGirisHatasi extends Error {
  readonly kod: SosyalGirisHataKodu;

  constructor(kod: SosyalGirisHataKodu) {
    super(kod);
    this.kod = kod;
  }
}

let appleModulu: AppleAuthModulu | null = null;
let googleYapilandirildi = false;
let googleModulu: GoogleSignInModulu | null = null;

function appleModulunuYukle(): AppleAuthModulu {
  if (appleModulu) return appleModulu;
  if (Platform.OS !== 'ios') throw new SosyalGirisHatasi('native-modul');
  try {
    const ham = require('expo-apple-authentication') as AppleAuthModulu & { default?: AppleAuthModulu };
    appleModulu = typeof ham.signInAsync === 'function' ? ham : (ham.default ?? ham);
    return appleModulu;
  } catch {
    throw new SosyalGirisHatasi('native-modul');
  }
}

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

export async function appleIleDevamEt(): Promise<string | null> {
  try {
    const modul = appleModulunuYukle();
    const kullanilabilir = await modul.isAvailableAsync();
    if (!kullanilabilir) throw new SosyalGirisHatasi('yapilandirma');
    const yanit = await modul.signInAsync({
      requestedScopes: [
        modul.AppleAuthenticationScope.FULL_NAME,
        modul.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!yanit.identityToken) {
      throw new SosyalGirisHatasi('genel');
    }
    return yanit.identityToken;
  } catch (hata) {
    if (hata instanceof SosyalGirisHatasi) throw hata;
    if (typeof hata === 'object' && hata !== null && 'code' in hata) {
      if (hata.code === 'ERR_REQUEST_CANCELED' || hata.code === 'ERR_CANCELED') {
        return null;
      }
    }
    throw new SosyalGirisHatasi('genel');
  }
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
      if (hata.code === 'DEVELOPER_ERROR') {
        // Yanlış Web client ID ya da Android OAuth istemcisindeki package/SHA-1
        // uyuşmazlığı ağ hatası değildir; kullanıcıya yeniden denetmek yerine
        // yapılandırmanın düzeltilmesi gerektiğini bildir.
        throw new SosyalGirisHatasi('oauth-yapilandirma');
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
