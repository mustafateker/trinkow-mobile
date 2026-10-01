import { StyleSheet } from 'react-native';

import { ClayPressable } from '@/components/ClayPressable';
import { Icon, type IconName } from '@/components/Icon';
import { color, radius, size } from '@/theme/tokens';

/** 44pt ikon butonu (prototip `.ikon-btn`). Etiket Türkçe ve fiille. */
export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  tone = color.text,
  disabled = false,
  background,
  pressedBackground,
  gloss,
}: {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
  tone?: string;
  /** §6 — pasif oklar (E-10 gün sınırı, E-24 ay sınırı): opaklık DEĞİL, `disabled-bg` + `clay.sunken`. */
  disabled?: boolean;
  /** Koyu üst bar gibi zeminlerde varsayılan beyaz/`surface` yerine geçmek için. */
  background?: string;
  pressedBackground?: string;
  gloss?: boolean;
}) {
  return (
    <ClayPressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      borderRadius={radius.pill}
      background={background}
      pressedBackground={pressedBackground}
      gloss={gloss}
      style={stil.kutu}>
      <Icon name={icon} size={22} color={disabled ? color.text2 : tone} />
    </ClayPressable>
  );
}

const stil = StyleSheet.create({
  kutu: {
    width: size.iconButton,
    height: size.iconButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
