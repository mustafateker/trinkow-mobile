/** Kalıcı oturum Keychain/Keystore'da, hatırlanmayan oturum yalnız bellekte. */
import * as SecureStore from 'expo-secure-store';
import { openDatabaseAsync } from 'expo-sqlite';
import { Platform } from 'react-native';
import { DB_ADI } from '@/db/sabitler';

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
    // Eski açık SQLite token'larını bir kez taşı ve güvenli yazım sonrası sil.
    const db = await openDatabaseAsync(DB_ADI);
    const tablo = await db.getFirstAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type='table' AND name='oturum'");
    if (tablo) {
      const eski = await db.getFirstAsync<{ erisim_tokeni: string; yenileme_tokeni: string; kullanici_id: string; email: string; kimlik_saglayici: string }>('SELECT * FROM oturum WHERE id = 1');
      if (!bellek && eski) {
        bellek = { erisimTokeni: eski.erisim_tokeni, yenilemeTokeni: eski.yenileme_tokeni, kullaniciId: eski.kullanici_id, email: eski.email, kimlikSaglayici: eski.kimlik_saglayici, oturumKimligi: kimlik() };
        kalici = Platform.OS !== 'web';
        if (kalici) await SecureStore.setItemAsync(ANAHTAR, JSON.stringify(bellek));
      }
      await db.execAsync('PRAGMA secure_delete = ON; DELETE FROM oturum;');
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
