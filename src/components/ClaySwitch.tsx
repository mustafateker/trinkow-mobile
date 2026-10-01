import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useReduceMotion } from '@/lib/hareket';
import { clay, color, motion, radius, size } from '@/theme/tokens';

/**
 * Bileşen envanteri §1 `ClaySwitch` (eski `Switch`) — tokens.md §7.12.
 * Platform `Switch` KULLANILMAZ (iOS/Android farklı çizer, clay dili
 * uygulanamaz). Track 56×32, iç boşluk 4, topuz 24pt. Kapalı: `well` +
 * `clay.sunken`. Açık: `grad.action` yerine — burada metin taşımayan tek
 * renkli zemin olduğu için gradyanın koyu ucu `primaryDeep` + `clay.action`
 * kullanıldı (K-062 aynı gerekçe: metin taşımayan dolgu bile "birincil
 * eylem" gradyanını `button.primary` dışında çoğaltmaz — düz renk).
 * Dokunma hedefi TÜM SATIRDIR (`SettingRow`), bu bileşen yalnız görseldir;
 * satırın `onPress`'i tetikler, kendi `onPress`'i yoktur.
 */
export function ClaySwitch({ value, disabled = false }: { value: boolean; disabled?: boolean }) {
  const reduceMotion = useReduceMotion();
  const ilerleme = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(ilerleme, {
      toValue: value ? 1 : 0,
      duration: reduceMotion ? 0 : motion.press,
      useNativeDriver: true,
    }).start();
  }, [value, reduceMotion, ilerleme]);

  const topuzX = ilerleme.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size.switchTrackW - size.switchTrackPad * 2 - size.switchKnob],
  });

  return (
    <View
      importantForAccessibility="no"
      style={[
        stil.track,
        disabled
          ? { backgroundColor: color.disabledBg, boxShadow: clay.sunken }
          : value
            ? { backgroundColor: color.primaryDeep, boxShadow: clay.action }
            : { backgroundColor: color.well, boxShadow: clay.sunken },
      ]}>
      <Animated.View style={[stil.topuz, { transform: [{ translateX: topuzX }] }]} />
    </View>
  );
}

const stil = StyleSheet.create({
  track: {
    width: size.switchTrackW,
    height: size.switchTrackH,
    borderRadius: radius.pill,
    padding: size.switchTrackPad,
    justifyContent: 'center',
  },
  topuz: {
    width: size.switchKnob,
    height: size.switchKnob,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    boxShadow: clay.raised,
  },
});
