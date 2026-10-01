import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { a11y, clay, color, fontFamily, radius, rhythm, size } from '@/theme/tokens';

/**
 * tokens.md §7.4 — metin girişi (`.giris`). Yükseklik 56, radius 16,
 * zemin `well`, gölge `clay.sunken`, kenarlık yok. Sistem klavyesi normal
 * metin için serbesttir (yalnız TUTAR alanı §7.11 kil tuş takımı kullanır).
 *
 * Durumlar: `default` / `focused` (2pt `primary-text`) / `error` (2pt
 * `danger` + hata metni) / `disabled`. Sayaç yalnız son 10 karakterde
 * görünür (bilesen envanteri `NoteField`).
 */
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  maxLength,
  clearable = false,
  accessibilityLabel,
  onBlur,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType,
  placeholderTone,
}: {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  clearable?: boolean;
  accessibilityLabel?: string;
  /** D-2c-2 · E-22/E-23 — e-posta alanı `onBlur`'da biçim doğrular. */
  onBlur?: () => void;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  /** rev2-tasarruf-profil.md §3.7 (B2) — `well` zemininde `text-3` AA altı kalıyor; bu ekranlarda `text-2` verilir. Verilmezse eski `text-3` korunur. */
  placeholderTone?: string;
}) {
  const [odakli, setOdakli] = useState(false);
  const kalan = maxLength !== undefined ? maxLength - value.length : null;
  const sayacGoster = kalan !== null && kalan <= 10;

  const halka = error ? color.danger : odakli ? color.primaryText : null;

  return (
    <View>
      {label ? (
        <>
          <Txt role="label" tone={color.text2}>
            {label}
          </Txt>
          <View style={{ height: rhythm.group }} />
        </>
      ) : null}
      <View
        style={[
          stil.kuyu,
          { boxShadow: halka ? `${clay.sunken}, 0 0 0 2px ${halka}` : clay.sunken },
        ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTone ?? color.text3}
          maxLength={maxLength}
          numberOfLines={1}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          importantForAutofill={autoComplete ? 'yes' : undefined}
          accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
          onFocus={() => setOdakli(true)}
          onBlur={() => {
            setOdakli(false);
            onBlur?.();
          }}
          style={stil.girdi}
        />
        {clearable && value.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={a11y.minTarget}
            accessibilityRole="button"
            accessibilityLabel="Temizle">
            <Icon name="x" size={20} color={color.text2} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={color.dangerInk}>
            {error}
          </Txt>
        </>
      ) : sayacGoster ? (
        <>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="micro" tone={color.text2} style={stil.sagHiza}>
            {kalan} kaldı
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
    fontFamily: fontFamily.uiRegular,
    fontSize: 16,
    lineHeight: 24,
    color: color.text,
    padding: 0,
  },
  sagHiza: { textAlign: 'right' },
});
