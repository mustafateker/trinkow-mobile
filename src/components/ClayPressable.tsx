import type { ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { clay, color, radius } from '@/theme/tokens';

/**
 * §6 — her etkileşimli eleman için `pressed` zorunlu (hover yoktur).
 * Geri bildirim zeminin/gölgenin değişmesiyle verilir; `scale` animasyonu
 * yasak (§7.1). Pasiflik `opacity` ile DEĞİL, renk + `clay.sunken` ile
 * verilir (§6). Tasarım kiti §5 — neumorphic üst parlama (`ClayGloss`)
 * varsayılan olarak KAPALI; `gloss` artık kullanılmıyor, geri dönük uyumluluk
 * için prop olarak kabul edilir ama render etmez.
 */
type Props = {
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  accessibilityRole?: 'button' | 'tab' | 'link';
  accessibilityHint?: string;
  selected?: boolean;
  borderRadius?: number;
  /** Dinlenme durumunun zemini */
  background?: string;
  /** Basılı durumun zemini — §7 tablolarındaki değer */
  pressedBackground?: string;
  shadow?: string;
  pressedShadow?: string;
  /** §5.3 üst parlama — basılı ve pasif durumda uygulanmaz */
  gloss?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Yalnız görsel hedef 44 pt'den küçükse gereken farkın yarısı kadar verilir. */
  hitSlop?: PressableProps['hitSlop'];
  /** Basılı durumu çocuklarına geçirmesi gerekenler için fonksiyon verebilir. */
  children?: ReactNode | ((pressed: boolean) => ReactNode);
  /**
   * Kaydırma gibi jest-yalnız eylemler için erişilebilirlik alternatifi
   * (VoiceOver/TalkBack "eylemler" rotoru) — ör. `ExpenseRow` sola/sağa
   * kaydırma (Akış C/D). Görsel bir öğe EKLEMEZ.
   */
  accessibilityActions?: AccessibilityActionInfo[];
  onAccessibilityAction?: (event: AccessibilityActionEvent) => void;
};

export function ClayPressable({
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityHint,
  selected,
  borderRadius = radius.pill,
  background = color.surface,
  pressedBackground = color.groove,
  shadow = clay.raised,
  pressedShadow = clay.pressed,
  style,
  hitSlop,
  children,
  accessibilityActions,
  onAccessibilityAction,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, selected }}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={onAccessibilityAction}
      hitSlop={hitSlop}
      style={({ pressed }) => [
        {
          borderRadius,
          backgroundColor: disabled
            ? color.disabledBg
            : pressed
              ? pressedBackground
              : background,
          boxShadow: disabled ? clay.sunken : pressed ? pressedShadow : shadow,
          overflow: 'hidden',
        },
        style,
      ]}>
      {({ pressed }) => (typeof children === 'function' ? children(pressed) : children)}
    </Pressable>
  );
}
