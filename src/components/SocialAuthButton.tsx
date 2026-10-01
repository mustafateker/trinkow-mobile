import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { brand } from '@/theme/brand';
import { clay, radius, rhythm, size } from '@/theme/tokens';

/**
 * Bileşen envanteri (delta-v4 T-2) `SocialAuthButton` — E-22/E-23.
 * `default` / `pressed` / `disabled`. Kap ölçüsü ve gölgesi bizim
 * (`clay.raised`/`clay.pressed`, 56pt, pill), dolgu/logo/etiket
 * sağlayıcının kılavuzundan (`src/theme/brand.ts`) — TEMA TOKENI DEĞİL.
 *
 * RN inşa notu 1 (delta-v4): Apple'ı iOS'ta idealde
 * `expo-apple-authentication`'ın native düğmesi çizer; o paket henüz
 * onaylı bağımlılık listesinde değil (BE-2d turu bekliyor) — bu yüzden bu
 * turda Apple da kendi `Pressable`'ımızla, yalnız GÖRSEL olarak
 * çizilmiştir (bkz. rapor "sapmalar").
 */
export function SocialAuthButton({
  provider,
  onPress,
  disabled = false,
  compact = false,
}: {
  provider: 'apple' | 'google';
  onPress?: () => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const label = provider === 'apple' ? t['giris.sosyal.apple'] : t['giris.sosyal.google'];
  const renkler = provider === 'apple' ? brand.apple : brand.google;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        stil.taban,
        compact ? stil.compact : null,
        provider === 'apple'
          ? {
              backgroundColor: pressed ? brand.apple.bgPressed : brand.apple.bg,
              boxShadow: pressed ? clay.pressed : clay.raised,
            }
          : {
              backgroundColor: pressed ? brand.google.bgPressed : brand.google.bg,
              boxShadow: `${pressed ? clay.pressed : clay.raised}, inset 0 0 0 1px ${brand.google.border}`,
            },
      ]}>
      {() => (
        <>
          <MarkaGlifi provider={provider} />
          <View style={{ width: rhythm.group }} />
          <Txt role="bodyStrong" tone={renkler.ink}>
            {label}
          </Txt>
        </>
      )}
    </Pressable>
  );
}

function MarkaGlifi({ provider }: { provider: 'apple' | 'google' }) {
  if (provider === 'apple') {
    return (
      <Svg width={20} height={20} viewBox="0 0 17 20">
        <Path
          fill={brand.apple.ink}
          d="M13.62 10.62c.01 2.9 2.53 3.86 2.56 3.87-.02.06-.4 1.37-1.33 2.72-.8 1.17-1.63 2.33-2.94 2.35-1.29.03-1.7-.76-3.17-.76-1.47 0-1.93.74-3.15.79-1.26.05-2.22-1.26-3.03-2.42C.9 15.3-.4 10.98 1.3 8.05c.84-1.45 2.35-2.37 3.98-2.4 1.24-.02 2.41.83 3.17.83.75 0 2.18-1.03 3.67-.88.62.03 2.37.23 3.5 1.71-.09.06-2.08 1.22-2.06 3.63M11.15 3.38c.67-.81 1.12-1.94.99-3.06-.96.04-2.13.64-2.82 1.45-.62.71-1.16 1.86-1.01 2.96 1.07.08 2.17-.54 2.84-1.35"
        />
      </Svg>
    );
  }
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path
        fill={brand.google.g.mavi}
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <Path
        fill={brand.google.g.yesil}
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.3-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <Path
        fill={brand.google.g.sari}
        d="M11.7 28.18c-.44-1.32-.68-2.72-.68-4.18s.25-2.86.68-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.36-5.7z"
      />
      <Path
        fill={brand.google.g.kirmizi}
        d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.18 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.36 5.7c1.72-5.2 6.57-9.07 12.3-9.07z"
      />
    </Svg>
  );
}

const stil = StyleSheet.create({
  taban: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: size.buttonPrimary,
    paddingHorizontal: rhythm.section,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  compact: { flex: 1, width: 'auto', paddingHorizontal: rhythm.group },
});
