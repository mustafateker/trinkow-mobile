import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';

/** §6 — Reduce motion açıkken tüm süreler 0ms. */
export function useReduceMotion(): boolean {
  const [kapali, setKapali] = useState(false);
  useEffect(() => {
    let canli = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (canli) setKapali(v);
    });
    const abone = AccessibilityInfo.addEventListener('reduceMotionChanged', setKapali);
    return () => {
      canli = false;
      abone.remove();
    };
  }, []);
  return kapali;
}

/**
 * 0 → `hedef` arası ease-out ilerleme. §8: `motion.arc` 250ms.
 * Kahraman sayı yay ile EŞ ZAMANLI sayar, bu yüzden tek kaynak yeter.
 * Reduce motion açıkken doğrudan hedefe oturur (süre 0ms).
 */
export function useIlerleme(hedef: number, sure: number): number {
  const reduceMotion = useReduceMotion();
  const deger = useRef(new Animated.Value(0)).current;
  const [oran, setOran] = useState(reduceMotion ? hedef : 0);

  useEffect(() => {
    if (reduceMotion) {
      setOran(hedef);
      return;
    }
    const abone = deger.addListener(({ value }) => setOran(value));
    const animasyon = Animated.timing(deger, {
      toValue: hedef,
      duration: sure,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    });
    animasyon.start();
    return () => {
      animasyon.stop();
      deger.removeListener(abone);
    };
  }, [deger, hedef, reduceMotion, sure]);

  return oran;
}
