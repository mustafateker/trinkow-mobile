import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import { kutlamaBaslik, kutlamaGovde, t } from '@/content/metinler';
import { useReduceMotion } from '@/lib/hareket';
import { clay, color, layout, motion, radius, rhythm, v4 } from '@/theme/tokens';

const BEKLEME_MS = 700;

/**
 * §7.13 `MilestoneOverlay` (K-048) — milestone kutlaması. Emoji/konfeti YOK,
 * scrim YOK (modal değildir, sekme çubuğunu/FAB'ı engellemez). Süre toplam
 * ≤1.2 sn (giriş 250 + bekleme 700 + çıkış 250); dokunmayla anında atlanır.
 */
export function CelebrationOverlay({
  milestone,
  sonrakiDurak,
  onKapat,
}: {
  milestone: number;
  sonrakiDurak: number | null;
  onKapat: () => void;
}) {
  const reduceMotion = useReduceMotion();
  const fade = useRef(new Animated.Value(0)).current;
  const kapatildi = useRef(false);

  function kapat() {
    if (kapatildi.current) return;
    kapatildi.current = true;
    if (reduceMotion) {
      onKapat();
      return;
    }
    Animated.timing(fade, { toValue: 0, duration: motion.sheet, useNativeDriver: true }).start(onKapat);
  }

  useEffect(() => {
    if (reduceMotion) {
      const zamanlayici = setTimeout(kapat, BEKLEME_MS);
      return () => clearTimeout(zamanlayici);
    }
    Animated.timing(fade, { toValue: 1, duration: motion.sheet, useNativeDriver: true }).start();
    const zamanlayici = setTimeout(kapat, motion.sheet + BEKLEME_MS);
    return () => clearTimeout(zamanlayici);
    // yalnız mount'ta bir kez çalışır
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={stil.katman} pointerEvents="box-none">
      <Animated.View style={{ opacity: reduceMotion ? 1 : fade }}>
        <Pressable
          onPress={kapat}
          accessibilityRole="button"
          accessibilityLabel={t['kutlama.a11y_kapat']}
          style={stil.kart}>
          <View style={stil.disk}>
            <Txt role="display">{milestone}</Txt>
          </View>
          <View style={{ height: rhythm.blockInCard }} />
          <Txt role="h2">{kutlamaBaslik(milestone)}</Txt>
          <View style={{ height: rhythm.group }} />
          <Txt role="body" style={stil.ortali}>
            {kutlamaGovde(milestone, sonrakiDurak)}
          </Txt>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={color.text2}>
            {t['kutlama.kapat']}
          </Txt>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const stil = StyleSheet.create({
  katman: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.headerPadTop,
  },
  kart: {
    alignItems: 'center',
    backgroundColor: color.surface,
    borderRadius: radius.hero,
    boxShadow: clay.raisedLg,
    padding: rhythm.pad,
  },
  disk: {
    width: v4.milestoneDisk,
    height: v4.milestoneDisk,
    borderRadius: radius.pill,
    backgroundColor: color.primarySoft,
    boxShadow: clay.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ortali: { textAlign: 'center' },
});
