/**
 * D-2c-2 — Apple/Google ile giriş dikişi. `SocialAuthButton` tasarımdaki
 * gibi ÇİZİLİR ama bu turda BAĞLANMAZ: sağlayıcı kütüphaneleri
 * (`expo-apple-authentication`, `@react-native-google-signin/google-signin`)
 * yeni bağımlılık oldukları için onay bekliyor (delta-v4.md RN inşa notu
 * 1-2). BE-2d turunda bu iki gövde doldurulacak.
 *
 * Platform kuralı (K-057, Mustafa kararı 2026-09-17): iOS'ta Apple + Google,
 * Android'de yalnız Google — bkz. `sosyalSaglayicilar()`.
 */
import { Platform } from 'react-native';
import { t } from '@/content/metinler';
import { toastGoster } from '@/lib/toastBus';

export type SosyalSaglayici = 'apple' | 'google';

export function sosyalSaglayicilar(): SosyalSaglayici[] {
  return Platform.OS === 'ios' ? ['apple', 'google'] : ['google'];
}

export async function appleIleDevamEt(): Promise<void> {
  toastGoster({ tur: 'info', metin: t['giris.sosyal_yok'] });
}

export async function googleIleDevamEt(): Promise<void> {
  toastGoster({ tur: 'info', metin: t['giris.sosyal_yok'] });
}
