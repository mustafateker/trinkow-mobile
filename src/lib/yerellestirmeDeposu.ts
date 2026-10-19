import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import {
  yerellestirmeAyarla,
  yerellestirmeTercihi,
  type Dil,
  type ParaBirimi,
  type YerellestirmeTercihi,
} from '@/lib/yerellestirme';

const ANAHTAR = 'trinkow.yerellestirme.v1';

function gecerliTercih(deger: unknown): deger is YerellestirmeTercihi {
  if (!deger || typeof deger !== 'object') return false;
  const aday = deger as Partial<YerellestirmeTercihi>;
  return (aday.dil === 'tr' || aday.dil === 'en')
    && (aday.paraBirimi === 'TRY' || aday.paraBirimi === 'USD' || aday.paraBirimi === 'EUR');
}

export async function yerellestirmeyiBaslat(): Promise<void> {
  let kayitli: string | null = null;
  if (Platform.OS === 'web') kayitli = globalThis.localStorage?.getItem(ANAHTAR) ?? null;
  else kayitli = await SecureStore.getItemAsync(ANAHTAR);

  if (kayitli) {
    try {
      const deger: unknown = JSON.parse(kayitli);
      if (gecerliTercih(deger)) {
        yerellestirmeAyarla(deger);
        return;
      }
    } catch {
      // Bozuk yerel tercih cihaz varsayılanına düşer.
    }
  }
  yerellestirmeAyarla({ dil: 'en', paraBirimi: 'TRY' });
}

export async function yerellestirmeyiSakla(dil: Dil, paraBirimi: ParaBirimi): Promise<void> {
  const tercih = { dil, paraBirimi } satisfies YerellestirmeTercihi;
  yerellestirmeAyarla(tercih);
  const ham = JSON.stringify(tercih);
  if (Platform.OS === 'web') globalThis.localStorage?.setItem(ANAHTAR, ham);
  else await SecureStore.setItemAsync(ANAHTAR, ham);
}

export async function sunucuYerellestirmesiniUygula(dil: Dil, paraBirimi: ParaBirimi): Promise<void> {
  const mevcut = yerellestirmeTercihi();
  if (mevcut.dil === dil && mevcut.paraBirimi === paraBirimi) return;
  await yerellestirmeyiSakla(dil, paraBirimi);
}
