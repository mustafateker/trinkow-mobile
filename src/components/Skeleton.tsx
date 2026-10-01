import { StyleSheet, View, type DimensionValue } from 'react-native';

import { clay, color, radius } from '@/theme/tokens';

/**
 * tokens.md §7.10 — yükleniyor iskeleti. Gerçek düzenin kabarık kutuları
 * yerinde durur, içleri çukur (`well` + `clay.sunken`) bloklara döner.
 * Shimmer/parıldama YOK. Yalnız ≥150ms okuma için kullanılır (çağıran
 * sorumluluğunda).
 */
export function Skeleton({
  width,
  height,
  borderRadius = radius.pill,
}: {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
}) {
  return <View style={[stil.blok, { width, height, borderRadius }]} />;
}

const stil = StyleSheet.create({
  blok: { backgroundColor: color.well, boxShadow: clay.sunken },
});
