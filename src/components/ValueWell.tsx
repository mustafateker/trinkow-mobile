import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ClayPressable } from '@/components/ClayPressable';
import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm, size } from '@/theme/tokens';

/**
 * Bileşen envanteri §2 `ValueWell` — dokunulabilir çukur değer satırı.
 * Nerede: E-17 limit satırları. `focused` durumunda sağdaki ikon yerine
 * düzenlenen tutar + imleç gösterilir (E-17 "limit kaldırma" sahnesi).
 */
export function ValueWell({
  sol,
  etiket,
  deger,
  degerSonek,
  degerSoluk = false,
  trailingIcon = 'chevron-right',
  focused = false,
  hata = false,
  onPress,
  accessibilityLabel,
}: {
  /** Sol taraf — kategori kabı gibi bir görsel (isteğe bağlı). */
  sol?: ReactNode;
  etiket: string;
  /** Odaklıyken görünen ham girdi metni (yazılırken). */
  deger: string;
  degerSonek?: string;
  /** "Limit yok" gibi ikincil değerler için soluk stil. */
  degerSoluk?: boolean;
  trailingIcon?: IconName;
  focused?: boolean;
  hata?: boolean;
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  return (
    <ClayPressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      borderRadius={radius.tile}
      background={color.well}
      pressedBackground={color.groove}
      shadow={
        focused ? `${clay.sunken}, 0 0 0 2px ${color.primaryText}` : hata ? `${clay.sunken}, 0 0 0 2px ${color.danger}` : clay.sunken
      }
      pressedShadow={clay.pressed}
      gloss={false}
      style={stil.kuyu}>
      {sol ? (
        <>
          {sol}
          <View style={{ width: rhythm.blockInCard }} />
        </>
      ) : null}
      <Txt role="bodyStrong" numberOfLines={1} style={stil.esnek}>
        {etiket}
      </Txt>
      <View style={{ width: rhythm.blockInCard }} />
      {degerSoluk ? (
        <Txt role="caption" tone={color.text2} numberOfLines={1}>
          {deger}
        </Txt>
      ) : (
        <Txt role="amount" numberOfLines={1}>
          {deger}
        </Txt>
      )}
      {degerSonek ? (
        <>
          <View style={{ width: rhythm.sameObject }} />
          <Txt role="caption" tone={color.text2}>
            {degerSonek}
          </Txt>
        </>
      ) : null}
      <View style={{ width: rhythm.blockInCard }} />
      {focused ? <View style={stil.imlec} /> : <Icon name={trailingIcon} size={size.iconSm} color={color.text2} />}
    </ClayPressable>
  );
}

const stil = StyleSheet.create({
  kuyu: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: size.rowMinHeight,
    paddingVertical: size.rowPadY,
    paddingHorizontal: size.rowPadX,
  },
  esnek: { flex: 1, minWidth: 0 },
  imlec: { width: 3, height: 24, borderRadius: radius.pill, backgroundColor: color.primary },
});
