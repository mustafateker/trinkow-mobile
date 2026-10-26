import { useSyncExternalStore } from 'react';

import { aktifDil, dilDegisimineAbone, type Dil } from './cekirdek';

/**
 * Aktif dili döner ve bileşeni dil değişimine abone eder — dil değişince
 * bileşen yeniden çizilir, `t[...]` ve cümle fonksiyonları yeni dilde okunur
 * (ActivationKing'de ekranların `CultureChanged`'e abone olmasının karşılığı).
 *
 * Her ekranın (route) gövdesinde bir kez çağrılır; ekranın içindeki sıradan
 * bileşenler ekranla birlikte yeniden çizildiği için ayrıca çağırmaz.
 * `memo`'lu bileşenler, kendi state'ine metin kopyalayanlar ve `FlatList`
 * (`extraData={dil}`) ayrıca bağlanmalıdır.
 */
export function useDil(): Dil {
  return useSyncExternalStore(dilDegisimineAbone, aktifDil, aktifDil);
}
