import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { aktifDil } from '@/i18n/cekirdek';
import { diliDegistir } from '@/i18n/dilDeposu';
import {
  yerellestirmeAyarla,
  paraBirimi as aktifParaBirimi,
  type Dil,
  type ParaBirimi,
} from '@/lib/yerellestirme';

const ANAHTAR = 'trinkow.yerellestirme.v1';

function gecerliParaBirimi(deger: unknown): deger is ParaBirimi {
  return deger === 'TRY' || deger === 'USD' || deger === 'EUR';
}

/**
 * Açılışta cihazda saklanan PARA BİRİMİNİ yükler. Dil burada uygulanmaz:
 * dili `src/i18n/dilDeposu.ts#dilBaslat` ilk çizimden önce kurar (kayıtlı
 * seçim ya da telefonun dili). Bu kayıttaki eski `dil` alanı yok sayılır.
 */
export async function yerellestirmeyiBaslat(): Promise<void> {
  let kayitli: string | null = null;
  if (Platform.OS === 'web') kayitli = globalThis.localStorage?.getItem(ANAHTAR) ?? null;
  else kayitli = await SecureStore.getItemAsync(ANAHTAR);

  if (kayitli) {
    try {
      const deger = JSON.parse(kayitli) as { paraBirimi?: unknown };
      if (gecerliParaBirimi(deger.paraBirimi)) {
        yerellestirmeAyarla({ paraBirimi: deger.paraBirimi });
        return;
      }
    } catch {
      // Bozuk yerel tercih varsayılana düşer.
    }
  }
  yerellestirmeAyarla({ paraBirimi: 'TRY' });
}

/** Ayarlar'dan: dil değiştiyse uygular ve kaydeder (`diliDegistir`), para birimini uygular ve saklar. */
export async function yerellestirmeyiSakla(dil: Dil, paraBirimi: ParaBirimi): Promise<void> {
  if (dil !== aktifDil()) diliDegistir(dil);
  yerellestirmeAyarla({ paraBirimi });
  const ham = JSON.stringify({ dil, paraBirimi });
  if (Platform.OS === 'web') globalThis.localStorage?.setItem(ANAHTAR, ham);
  else await SecureStore.setItemAsync(ANAHTAR, ham);
}

/**
 * Sunucudaki tercihi uygular — yalnız PARA BİRİMİNİ. Sunucunun `dil` alanı
 * yalnız tr/en tutar (sunucu taraflı metinler için); cihazda seçilen 11
 * dilden birini ezmesin diye uygulanmaz.
 */
export async function sunucuYerellestirmesiniUygula(_dil: Dil, paraBirimi: ParaBirimi): Promise<void> {
  if (aktifParaBirimi() === paraBirimi) return;
  await yerellestirmeyiSakla(aktifDil(), paraBirimi);
}
