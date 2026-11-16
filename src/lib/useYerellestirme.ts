import { useSyncExternalStore } from 'react';

import {
  dilKodu,
  paraBirimi,
  yerellestirmeAnlikDeger,
  yerellestirmeDegisimineAbone,
  type YerellestirmeTercihi,
} from './yerellestirme';

let onbellek: YerellestirmeTercihi | null = null;
let sonAnahtar = '';

/**
 * Dil veya para birimi değiştiğinde bileşeni yeniden çizen React hook'u.
 * `useSyncExternalStore` snapshot olarak referans değil primitive anahtar
 * (`"tr:TRY"`) kullandığı için döngü üretmez.
 */
export function useYerellestirme(): YerellestirmeTercihi {
  const anahtar = useSyncExternalStore(
    yerellestirmeDegisimineAbone,
    yerellestirmeAnlikDeger,
    yerellestirmeAnlikDeger,
  );
  if (!onbellek || anahtar !== sonAnahtar) {
    sonAnahtar = anahtar;
    onbellek = { dil: dilKodu(), paraBirimi: paraBirimi() };
  }
  return onbellek;
}
