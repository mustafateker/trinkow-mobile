import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MoneyInput } from '@/components/MoneyInput';
import { Txt } from '@/components/Txt';
import { SIMGE } from '@/lib/para';
import { clay, color, radius, rhythm, size } from '@/theme/tokens';

/**
 * rev2-onboarding-kayit.md §4.2 — `TextField`/`AmountWell`ın Rev sonrası
 * hâli. Kil tuş takımı YOK: gerçek `TextInput`, `decimal-pad`, iOS'ta
 * `InputAccessoryView` → "Bitti" (`MoneyInput` bunu zaten üretiyor).
 * Tam genişlik alan — gelir/hedef/borç. Sabit gider satırları için
 * kompakt `MoneyRow` kullanılır (§4.3), bu bileşen değil.
 */
export function MoneyField({
  label,
  value,
  onChangeText,
  onBlur,
  note,
  error,
  accessibilityLabel,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  onBlur?: () => void;
  /** Kuyunun altında `caption`/`text-2` not satırı (hata yokken). */
  note?: string;
  error?: string;
  accessibilityLabel?: string;
}) {
  const [odakli, setOdakli] = useState(false);
  const halka = error ? color.danger : odakli ? color.primaryText : null;

  return (
    <View>
      <Txt role="label" tone={color.text2}>
        {label}
      </Txt>
      <View style={{ height: rhythm.group }} />
      <View style={[stil.kuyu, { boxShadow: halka ? `${clay.sunken}, 0 0 0 2px ${halka}` : clay.sunken }]}>
        <MoneyInput
          hideLabel
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setOdakli(true)}
          onBlur={() => {
            setOdakli(false);
            onBlur?.();
          }}
          label={accessibilityLabel ?? label}
          style={stil.girdi}
        />
        <View style={{ width: rhythm.group }} />
        <Txt role="label" tone={color.text2}>
          {SIMGE}
        </Txt>
      </View>
      {error ? (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={color.dangerInk}>
            {error}
          </Txt>
        </>
      ) : note ? (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={color.text2}>
            {note}
          </Txt>
        </>
      ) : null}
    </View>
  );
}

const stil = StyleSheet.create({
  kuyu: {
    flexDirection: 'row',
    alignItems: 'center',
    height: size.input,
    paddingHorizontal: rhythm.pad,
    borderRadius: radius.tile,
    backgroundColor: color.well,
  },
  girdi: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'transparent',
    minHeight: 0,
    padding: 0,
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'left',
  },
});
