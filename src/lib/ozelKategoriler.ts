import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { IconName } from '@/components/Icon';
import type { CatFamily } from '@/theme/tokens';
import { veriDegisti } from '@/lib/veriBus';

export type OzelKategori = {
  kod: string;
  ad: string;
  aile: CatFamily;
  ikon: IconName;
};

const ANAHTAR = 'trinkow.ozel_kategoriler.v1';

let ozelKategorilerCache: OzelKategori[] = [];

export function ozelKategoriBul(kod: string): OzelKategori | undefined {
  const k = kod.trim().toLowerCase();
  return ozelKategorilerCache.find(
    (item) => item.kod.toLowerCase() === k || item.ad.toLowerCase() === k,
  );
}

export function ozelKategorileriGetirSync(): OzelKategori[] {
  return ozelKategorilerCache;
}

export async function ozelKategorileriYukle(): Promise<OzelKategori[]> {
  try {
    let ham: string | null = null;
    if (Platform.OS === 'web') {
      ham = globalThis.localStorage?.getItem(ANAHTAR) ?? null;
    } else {
      ham = await SecureStore.getItemAsync(ANAHTAR);
    }
    if (ham) {
      const parsed = JSON.parse(ham);
      if (Array.isArray(parsed)) {
        ozelKategorilerCache = parsed;
        return ozelKategorilerCache;
      }
    }
  } catch {
    // Bozuk veri durumunda varsayılana düşer
  }
  return ozelKategorilerCache;
}

export async function ozelKategoriEkle(
  ad: string,
  aile: CatFamily = 'lacivert',
  ikon: IconName = 'circle-dashed',
): Promise<OzelKategori> {
  const temizAd = ad.trim();
  if (!temizAd) throw new Error('Kategori adı boş olamaz');

  const slug = temizAd
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '_');
  const kod = `ozel_${slug}_${Date.now().toString(36).slice(-4)}`;

  const yeni: OzelKategori = {
    kod,
    ad: temizAd,
    aile,
    ikon,
  };

  ozelKategorilerCache = [
    ...ozelKategorilerCache.filter((item) => item.ad.toLowerCase() !== temizAd.toLowerCase()),
    yeni,
  ];

  const ham = JSON.stringify(ozelKategorilerCache);
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(ANAHTAR, ham);
  } else {
    await SecureStore.setItemAsync(ANAHTAR, ham);
  }
  veriDegisti();
  return yeni;
}

export async function ozelKategoriSil(kod: string): Promise<void> {
  ozelKategorilerCache = ozelKategorilerCache.filter((item) => item.kod !== kod);
  const ham = JSON.stringify(ozelKategorilerCache);
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(ANAHTAR, ham);
  } else {
    await SecureStore.setItemAsync(ANAHTAR, ham);
  }
  veriDegisti();
}

