import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { t } from '@/content/metinler';
import { useReduceMotion } from '@/lib/hareket';
import { color, motion, radius, rhythm } from '@/theme/tokens';

/**
 * Tasarım kiti §7.2 "Onboarding progress" — ince, sakin 4 nokta göstergesi,
 * koyu üst barın içinde oturur. Dolu öğe `primary` (indigo); boş öğe koyu
 * zemin üstünde soluk beyaz iz. Metnin kendisi ekran başlığında ayrı bir
 * `Txt` olarak durur; bu yüzden burada yalnız erişilebilir `progressbar` +
 * doldurulmuş oluklar var. Yüzde yazılmaz. Yalnız YENİ dolan oluk
 * `motion.arc` 250ms genişlik animasyonuyla dolar; reduce motion açıkken
 * anında dolar.
 */
export function StepIndicator({ adim, toplam = 3 }: { adim: number; toplam?: number }) {
  const reduceMotion = useReduceMotion();
  const oncekiAdim = useRef(adim);
  const doluluklar = useRef(Array.from({ length: toplam }, (_, i) => new Animated.Value(i < adim ? 1 : 0))).current;

  useEffect(() => {
    const onceki = oncekiAdim.current;
    if (adim > onceki && !reduceMotion) {
      const yeniDolan = onceki; // 0 tabanlı — yeni dolan tek oluk
      doluluklar.forEach((deger, i) => {
        if (i < yeniDolan) deger.setValue(1);
        else if (i > yeniDolan) deger.setValue(0);
      });
      if (doluluklar[yeniDolan]) {
        doluluklar[yeniDolan].setValue(0);
        Animated.timing(doluluklar[yeniDolan], {
          toValue: 1,
          duration: motion.arc,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      }
    } else {
      doluluklar.forEach((deger, i) => deger.setValue(i < adim ? 1 : 0));
    }
    oncekiAdim.current = adim;
  }, [adim, reduceMotion, doluluklar]);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t['a11y.kurulum_ilerlemesi']}
      accessibilityValue={{ min: 1, max: toplam, now: adim }}
      style={stil.satir}>
      {doluluklar.map((deger, i) => (
        <View key={i} style={stil.oluk}>
          <Animated.View
            style={[
              stil.dolgu,
              { width: deger.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', gap: rhythm.group },
  oluk: {
    flex: 1,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  dolgu: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: color.primary, borderRadius: radius.pill },
});
