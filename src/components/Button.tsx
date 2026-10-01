import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Txt, type TypeRole } from '@/components/Txt';
import { a11y, clay, color, radius, rhythm, size } from '@/theme/tokens';

/** §7.1 — üç varyant. Ekran başına birincil buton en fazla 1. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  variant: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  /** Metin genişliğinde durması gerekiyorsa (prototipte kart içi ikincil buton) */
  auto?: boolean;
  accessibilityLabel?: string;
  /** §7.1 varsayılan "Kaydediliyor" yerine ekrana özgü meşgul metni (ör. "Oturum açılıyor"). */
  loadingLabel?: string;
  /** Metinsel/yardımcı aksiyonlarda düğme yüksekliğini değiştirmeden tip rolünü küçültür. */
  textRole?: TypeRole;
};

const yukseklik: Record<ButtonVariant, number> = {
  primary: size.buttonPrimary,
  secondary: size.buttonSecondary,
  ghost: size.buttonGhost,
  danger: size.buttonPrimary,
};

export function Button({
  label,
  variant,
  onPress,
  disabled = false,
  loading = false,
  icon,
  auto = false,
  accessibilityLabel,
  loadingLabel,
  textRole = 'bodyStrong',
}: Props) {
  const pasif = disabled || loading;
  // §7.1 loading: metin "Kaydediliyor" + disabled. Spinner yalnız buton içinde.
  const metin = loading ? (loadingLabel ?? 'Kaydediliyor') : label;

  return (
    <Pressable
      onPress={onPress}
      disabled={pasif}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? metin}
      accessibilityState={{ disabled: pasif, busy: loading }}
      hitSlop={variant === 'ghost' ? a11y.minTarget - size.buttonGhost : 0}
      style={({ pressed }) => [
        stil.taban,
        {
          height: yukseklik[variant],
          width: auto ? undefined : '100%',
          alignSelf: auto ? 'flex-start' : undefined,
          paddingHorizontal: variant === 'ghost' ? size.buttonGhostPadX : size.buttonPadX,
        },
        variant === 'primary' && {
          // Tekil coral CTA — pasif: zemin disabled-bg, gölge yok. Opaklık YOK (§6).
          backgroundColor: pasif ? color.disabledBg : pressed ? color.actionPressed : color.action,
          boxShadow: pasif ? clay.sunken : pressed ? clay.actionPressed : clay.action,
        },
        variant === 'secondary' && {
          backgroundColor: pasif ? color.disabledBg : pressed ? color.well : color.surface,
          boxShadow: pasif ? clay.sunken : pressed ? clay.pressed : clay.raised,
        },
        variant === 'ghost' && {
          backgroundColor: pressed ? color.well : 'transparent',
          boxShadow: pressed ? clay.pressed : undefined,
        },
        variant === 'danger' && {
          backgroundColor: pasif ? color.disabledBg : pressed ? color.dangerInk : color.danger,
          boxShadow: pasif ? clay.sunken : pressed ? clay.actionPressed : clay.action,
        },
      ]}>
      {() => {
        const metinRengi =
          pasif
            ? color.text2
            : variant === 'primary' || variant === 'danger'
              ? color.onPrimary
              : variant === 'secondary'
                ? color.text
                : color.text2;
        return (
          <>
            {icon ? (
              <>
                <Icon name={icon} size={size.iconSm} color={metinRengi} />
                <View style={{ width: rhythm.group }} />
              </>
            ) : null}
            <Txt role={textRole} tone={metinRengi} numberOfLines={1}>
              {metin}
            </Txt>
            {loading ? (
              <>
                <View style={{ width: rhythm.group }} />
                <View style={stil.spinner} />
              </>
            ) : null}
          </>
        );
      }}
    </Pressable>
  );
}

const stil = StyleSheet.create({
  taban: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  spinner: {
    width: size.iconSm,
    height: size.iconSm,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    borderTopColor: color.onPrimary,
  },
});
