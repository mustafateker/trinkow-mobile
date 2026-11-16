import { useMemo, useSyncExternalStore } from 'react';

import {
  yerellestirmeAnlikDeger,
  yerellestirmeDegisimineAbone,
  type Dil,
  type ParaBirimi,
  type YerellestirmeTercihi,
} from './yerellestirme';

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
  return useMemo(() => {
    const [dil, para] = anahtar.split(':') as [Dil, ParaBirimi];
    return { dil, paraBirimi: para };
  }, [anahtar]);
}
