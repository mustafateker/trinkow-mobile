import * as Haptics from 'expo-haptics';
import { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { GradFill } from '@/components/GradFill';
import { clay, color, gradient, radius, slider } from '@/theme/tokens';

/**
 * Bileşen envanteri `Slider` (E-25/E-26) — tokens.md §7.13. RN inşa notu 1:
 * `@react-native-community/slider` platform bileşeni clay dilini uygulayamaz
 * (yeni kütüphane eklenmedi) → `PanResponder` + üç `View`.
 *
 * `value`/`max` YÜZDE (0-100, tam sayı). Dolgu topuzun MERKEZİNDE biter.
 * Üst sınıra dayanınca topuz durur, `warning-soft` olur ve `Haptics` BİR KEZ
 * tetiklenir (RN inşa notu 3 — sürükleme boyunca tekrar etmez).
 */
export function Slider({
  value,
  max,
  onChange,
  accessibilityLabel,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  accessibilityLabel: string;
}) {
  const [trackW, setTrackW] = useState(0);
  const maxRef = useRef(max);
  maxRef.current = max;
  const valueRef = useRef(value);
  valueRef.current = value;
  const trackWRef = useRef(0);
  const uyariVerildiRef = useRef(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          hesaplaVeBildir(e.nativeEvent.locationX);
        },
        onPanResponderMove: (e) => {
          hesaplaVeBildir(e.nativeEvent.locationX);
        },
        onPanResponderRelease: () => {
          uyariVerildiRef.current = false;
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  function hesaplaVeBildir(x: number) {
    const w = trackWRef.current;
    if (w <= 0) return;
    const oran = Math.min(1, Math.max(0, x / w));
    const yeniHam = Math.round(oran * maxRef.current);
    const yeni = Math.min(maxRef.current, Math.max(0, yeniHam));
    if (yeni >= maxRef.current && maxRef.current > 0) {
      if (!uyariVerildiRef.current) {
        uyariVerildiRef.current = true;
        Haptics.selectionAsync().catch(() => {});
      }
    } else {
      uyariVerildiRef.current = false;
    }
    if (yeni !== valueRef.current) onChange(yeni);
  }

  function onLayout(e: LayoutChangeEvent) {
    const w = e.nativeEvent.layout.width;
    trackWRef.current = w;
    setTrackW(w);
  }

  const sinirda = max > 0 && value >= max;
  const dolguOrani = max > 0 ? Math.min(1, value / max) : 0;
  const topuzMerkezi = trackW * dolguOrani;
  const topuzSol = Math.max(0, Math.min(trackW - slider.knob, topuzMerkezi - slider.knob / 2));

  return (
    <View
      style={stil.satir}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max, now: value, text: `%${value}` }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'increment') onChange(Math.min(max, value + 1));
        if (e.nativeEvent.actionName === 'decrement') onChange(Math.max(0, value - 1));
      }}
      {...panResponder.panHandlers}>
      <View style={stil.oluk} onLayout={onLayout}>
        <View style={[stil.dolguKirp, { width: trackW ? topuzMerkezi : 0 }]}>
          {trackW ? <GradFill colors={gradient.action} /> : null}
        </View>
      </View>
      <View style={[stil.topuzYer, { left: topuzSol }]} pointerEvents="none">
        <View style={[stil.topuz, sinirda ? stil.topuzSinirda : null]} />
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { height: slider.row, justifyContent: 'center' },
  oluk: {
    height: slider.track,
    borderRadius: radius.pill,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
    overflow: 'hidden',
  },
  dolguKirp: { height: slider.track, borderRadius: radius.pill, overflow: 'hidden' },
  topuzYer: { position: 'absolute', top: 0, bottom: 0, justifyContent: 'center' },
  topuz: {
    width: slider.knob,
    height: slider.knob,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    boxShadow: clay.raised,
  },
  topuzSinirda: { backgroundColor: color.warningSoft },
});
