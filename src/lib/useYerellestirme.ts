import { useSyncExternalStore } from 'react';

import {
  yerellestirmeDegisimineAbone,
  yerellestirmeTercihi,
  type YerellestirmeTercihi,
} from './yerellestirme';

/**
 * Dil veya para birimi değiştiğinde bileşeni yeniden çizen React hook'u.
 */
export function useYerellestirme(): YerellestirmeTercihi {
  return useSyncExternalStore(yerellestirmeDegisimineAbone, yerellestirmeTercihi, yerellestirmeTercihi);
}
