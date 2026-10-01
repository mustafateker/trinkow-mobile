import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

let sayac = 0;

/**
 * §1.8 #3 — `grad.action` dikey (üst→alt) gradyan dolgusu.
 * Metin gradyanın ALT-KOYU yarısına denk gelir; kontrast `primary-deep`
 * üzerinden ölçülür (§1.6). `expo-linear-gradient` onaylı listede olmadığı
 * için `react-native-svg` ile çizilir.
 */
export function GradFill({ colors }: { colors: readonly [string, string] }) {
  const id = `grad${++sayac}`;
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors[0]} />
          <Stop offset="1" stopColor={colors[1]} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}
