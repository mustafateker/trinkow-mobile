import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * rev2-onboarding-kayit.md §7.1 — YENİ bileşen. Projede onay kutusu yoktu.
 * Yeni ölçü ailesi açılmadı: 32 kutu · radius 16 · 44 satır · 12 aralık ·
 * 20pt glif — hepsi mevcut kümelerden.
 *
 * Bilinçli sapma (§7.1 not, tokens.md §5.4 "32pt ve altı kontroller"):
 * 32pt'de SEÇİM dili (`primary-soft` + `clay.sunken`) işaretli/işaretsizi
 * ayırt edemiyor (`well` ile `primary-soft` farkı 1.0x, ikisi de çukur).
 * Bu yüzden burada DOLGU dili uygulanır: işaretsiz = çukur `well` kuyu,
 * işaretli = düz `primary-deep` + kabartma + beyaz glif. Halka yine yok.
 *
 * Metin içine gömülü bağlantı YOK (Ö4): `hitSlop` bir `Pressable` prop'udur,
 * iç içe `Text onPress` onu almaz. Belgeler ayrı 44pt `button.ghost`
 * satırlarından açılır (bkz. `app/kayit.tsx`).
 */
export function Checkbox({
  checked,
  onPress,
  label,
  error = false,
  disabled = false,
  accessibilityLabel,
}: {
  checked: boolean;
  onPress: () => void;
  label: ReactNode;
  error?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const [odakli, setOdakli] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onFocus={() => setOdakli(true)}
      onBlur={() => setOdakli(false)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : undefined)}
      hitSlop={{ top: 8, bottom: 8, left: 0, right: 0 }}
      style={stil.satir}>
      {({ pressed }) => {
        const zemin = disabled
          ? color.disabledBg
          : checked
            ? pressed
              ? color.primaryPress
              : color.primaryDeep
            : pressed
              ? color.groove
              : color.well;
        const golge = disabled
          ? clay.sunken
          : checked
            ? pressed
              ? clay.actionPressed
              : clay.raised
            : pressed
              ? clay.pressed
              : clay.sunken;
        const halka = error ? color.danger : odakli ? color.primaryText : null;
        return (
          <>
            <View
              style={[
                stil.kutu,
                {
                  backgroundColor: zemin,
                  boxShadow: halka ? `${golge}, 0 0 0 2px ${halka}` : golge,
                },
              ]}>
              {checked ? <Icon name="check" size={20} color={disabled ? color.text2 : color.onPrimary} /> : null}
            </View>
            <View style={{ width: rhythm.blockInCard }} />
            <View style={stil.etiket}>{typeof label === 'string' ? <Txt role="caption" tone={color.text}>{label}</Txt> : label}</View>
          </>
        );
      }}
    </Pressable>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'center', minHeight: 44, width: '100%' },
  kutu: { width: 32, height: 32, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  etiket: { flex: 1, minWidth: 0 },
});
