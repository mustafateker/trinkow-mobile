import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

export type HizliErisimSonucu =
  | 'requested'
  | 'added'
  | 'already_added'
  | 'dismissed'
  | 'manual_opened'
  | 'manual_required'
  | 'unsupported'
  | 'unavailable';

type HizliErisimNative = {
  requestPinWidget(): Promise<HizliErisimSonucu>;
  requestAddQuickSettingsTile(): Promise<HizliErisimSonucu>;
};

function androidModulu(): HizliErisimNative | null {
  if (Platform.OS !== 'android') return null;
  return requireOptionalNativeModule<HizliErisimNative>('TrinkowQuickAccess');
}

export async function anaEkranWidgetiIste(): Promise<HizliErisimSonucu> {
  return androidModulu()?.requestPinWidget() ?? 'unsupported';
}

export async function hizliAyarKutusunuIste(): Promise<HizliErisimSonucu> {
  return androidModulu()?.requestAddQuickSettingsTile() ?? 'unsupported';
}
