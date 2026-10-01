import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { a11y, clay, color, fontFamily, radius, rhythm, size } from '@/theme/tokens';

/**
 * Bileşen envanteri (delta-v4 T-2) `PasswordField` — `TextField`'ın sağ
 * yuvalı varyantı. Durumlar: `default` / `focused` / `error` / `visible` /
 * `hidden`. Göz düğmesi 44pt, alanın sağ iç boşluğu 16 → 8 (RN inşa notu 5:
 * yalnız `secureTextEntry`'yi çevirir, odak/imleç konumu korunur).
 */
export function PasswordField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  autoComplete,
  textContentType,
  accessibilityLabel,
}: {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  /** rev2 §7.2 "Şifre tekrar" — doğrulama anı `onBlur` ve gönderimde, her tuşta değil. */
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  /** RN inşa notu 4 — şifre yöneticileri çalışsın diye doğru autofill eşlemesi. */
  autoComplete: 'current-password' | 'new-password' | 'password';
  textContentType: 'password' | 'newPassword';
  accessibilityLabel?: string;
}) {
  const [odakli, setOdakli] = useState(false);
  const [gorunur, setGorunur] = useState(false);

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
      <View style={[stil.kuyu, { boxShadow: halka ? `${clay.sunken}, 0 0 0 2px ${halka}` : clay.sunken }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.text3}
          secureTextEntry={!gorunur}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          importantForAutofill="yes"
          numberOfLines={1}
          accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
          onFocus={() => setOdakli(true)}
          onBlur={() => {
            setOdakli(false);
            onBlur?.();
          }}
          style={stil.girdi}
        />
        <Pressable
          onPress={() => setGorunur((g) => !g)}
          hitSlop={a11y.minTarget}
          accessibilityRole="button"
          accessibilityLabel={gorunur ? t['alan.sifre.gizli'] : t['alan.sifre.gorunur']}
          style={stil.gozBtn}>
          <Icon name={gorunur ? 'eye-off' : 'eye'} size={20} color={color.text2} />
        </Pressable>
      </View>
      {error ? (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={color.dangerInk}>
            {error}
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
    paddingLeft: rhythm.pad,
    paddingRight: rhythm.group,
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
  gozBtn: {
    width: size.iconButton,
    height: size.iconButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
