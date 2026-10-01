import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { clay, color, radius } from '@/theme/tokens';

/**
 * Yüzey seviyeleri. Tasarım kiti §5 — neumorphic üst parlama (`ClayGloss`)
 * KALDIRILDI; düz yüzey + `clay.*`'in artık ince/düz gölgesi yeterli.
 */
export type ClayLevel = 'raised' | 'raisedLg' | 'pressed' | 'sunken';

const zemin: Record<ClayLevel, string> = {
  raised: color.surface,
  raisedLg: color.surface,
  pressed: color.groove,
  sunken: color.well,
};

type Props = ViewProps & {
  level: ClayLevel;
  /** tokens.md §4 — eleman tipinden türer, serbest değer verilmez. */
  borderRadius?: number;
  /** Zemin tonu gerekiyorsa (ör. kahraman kart `primary-soft`). */
  background?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export function ClaySurface({
  level,
  borderRadius = radius.card,
  background,
  style,
  children,
  ...rest
}: Props) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: background ?? zemin[level],
          borderRadius,
          boxShadow: clay[level],
          // parlama dikdörtgeni köşelerden taşmasın
          overflow: 'hidden',
        },
        style,
      ]}>
      {children}
    </View>
  );
}
