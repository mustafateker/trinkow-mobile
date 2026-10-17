/** Kalıcı oturum Keychain/Keystore'da, hatırlanmayan oturum yalnız bellekte. */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type Oturum = {
  erisimTokeni: string;
  yenilemeTokeni: string;
  kullaniciId: string;
  email: string;
  kimlikSaglayici: string;
  oturumKimligi?: string;
};
const ANAHTAR = 'trinkow.oturum.v2';
let bellek: Oturum | null = null;
let kalici = false;
let hazir: Promise<void> | null = null;
let sira: Promise<unknown> = Promise.resolve();
const kimlik = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

async function baslat(): Promise<void> {
  if (!hazir) hazir = (async () => {
    const ham = Platform.OS === 'web' ? null : await SecureStore.getItemAsync(ANAHTAR);
    if (ham) {
      try { bellek = JSON.parse(ham) as Oturum; kalici = true; }
      catch { await SecureStore.deleteItemAsync(ANAHTAR); }
    }
  })().catch((hata) => { hazir = null; throw hata; });
  await hazir;
}

function sirala<T>(islem: () => Promise<T>): Promise<T> {
  const sonuc = sira.then(async () => { await baslat(); return islem(); });
  sira = sonuc.catch(() => {});
  return sonuc;
}
async function sakla(oturum: Oturum | null, hatirla: boolean): Promise<void> {
  if (Platform.OS !== 'web') {
    if (oturum && hatirla) await SecureStore.setItemAsync(ANAHTAR, JSON.stringify(oturum));
    else await SecureStore.deleteItemAsync(ANAHTAR);
  }
  bellek = oturum;
  kalici = hatirla && Platform.OS !== 'web';
}
export async function oturumOku(): Promise<Oturum | null> {
  await baslat();
  await sira;
  return bellek ? { ...bellek } : null;
}
export async function oturumYaz(oturum: Oturum, hatirla = true): Promise<void> {
  await sirala(() => sakla({ ...oturum, oturumKimligi: kimlik() }, hatirla));
  oturumDegisti();
}
export async function oturumErisimTokeniGuncelle(erisimTokeni: string, eskiYenileme: string, yeniYenileme: string): Promise<void> {
  await sirala(async () => {
    if (bellek?.yenilemeTokeni === eskiYenileme) await sakla({ ...bellek, erisimTokeni, yenilemeTokeni: yeniYenileme }, kalici);
  });
}
export async function oturumGecersizKil(yenilemeTokeni: string): Promise<void> {
  const degisti = await sirala(async () => {
    if (bellek?.yenilemeTokeni !== yenilemeTokeni) return false;
    await sakla(null, false);
    return true;
  });
  if (degisti) oturumDegisti();
}
export async function oturumSil(): Promise<void> {
  await sirala(() => sakla(null, false));
  oturumDegisti();
}
type Dinleyici = () => void;
const dinleyiciler = new Set<Dinleyici>();
export function oturumDegisti(): void { for (const d of dinleyiciler) d(); }
export function oturumDegisimineAbone(dinleyici: Dinleyici): () => void {
  dinleyiciler.add(dinleyici);
  return () => dinleyiciler.delete(dinleyici);
}
