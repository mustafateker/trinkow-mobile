import { StyleSheet, View } from 'react-native';

import { GradFill } from '@/components/GradFill';
import { clay, color, gradient, radius, size } from '@/theme/tokens';

/**
 * tokens.md §7.12 `LoadBar` — E-18 ay yükü çubuğu. Yükseklik 12, radius
 * 999, oluk `well` + `clay.sunken`, dolgu `grad.action`. `oran` 0..1.
 */
export function LoadBar({ oran }: { oran: number }) {
  const genislik = Math.max(0, Math.min(1, oran));
  return (
    <View style={stil.oluk}>
      {genislik > 0 ? (
        <View style={[stil.dolguSarma, { width: `${genislik * 100}%` }]}>
          <View style={stil.dolgu}>
            <GradFill colors={gradient.action} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const stil = StyleSheet.create({
  oluk: {
    flex: 1,
    height: size.catBarHeight,
    borderRadius: radius.pill,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
    overflow: 'hidden',
  },
  dolguSarma: { height: size.catBarHeight },
  dolgu: { flex: 1, borderRadius: radius.pill, overflow: 'hidden' },
});
