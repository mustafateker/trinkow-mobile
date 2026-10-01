import { StyleSheet, View } from 'react-native';

import { color, radius } from '@/theme/tokens';

/**
 * tokens.md §8 — "sürekli dönen dekoratif öğe" YASAK; bu yüzden spinner
 * DÖNMEZ, tek renkli statik bir halkadır (bkz. `Button` yükleniyor durumu,
 * prototip `.spinner`). `arama-alani` yükleniyor durumu (F-18) `dark`
 * varyantı kullanır — açık `well` zemin üstünde beyaz halka görünmez.
 */
export function Spinner({ size = 20, varyant = 'dark' }: { size?: number; varyant?: 'dark' | 'light' }) {
  const trackColor = varyant === 'dark' ? 'rgba(23,28,66,0.18)' : 'rgba(255,255,255,0.35)';
  const headColor = varyant === 'dark' ? color.primaryDeep : color.onPrimary;
  return (
    <View
      style={[
        stil.halka,
        { width: size, height: size, borderColor: trackColor, borderTopColor: headColor },
      ]}
    />
  );
}

const stil = StyleSheet.create({
  halka: { borderWidth: 2, borderRadius: radius.pill },
});
