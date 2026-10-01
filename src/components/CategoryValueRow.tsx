import { StyleSheet, View } from 'react-native';

import { CategoryIconBox } from '@/components/CategoryIconBox';
import { ClayPressable } from '@/components/ClayPressable';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import type { Kategori } from '@/lib/kategoriler';
import { clay, color, radius, rhythm, size } from '@/theme/tokens';

/**
 * F-18 `kategori-deger` (dropdown, delta-v4.md "Yeni bileşenler" tablosu) —
 * kategori ÜRÜNDEN doldurulduğunda çip şeridinin yerine geçen çukur değer
 * satırı. Design point #4: "seçilecek bir şey mi var, değiştirilecek bir
 * değer mi" sorusunun cevabı — ürün seçiliyken kategori artık bir seçim
 * değil bir DEĞERDİR. Dokununca `onPress` çağrılır; çağıran taraf bunu
 * "kullanıcı elle değiştirmek istiyor" olarak yorumlayıp çip şeridine
 * (`CategoryPicker`) geri döner (K-050 dropdown).
 */
export function CategoryValueRow({
  kategori,
  onPress,
  accessibilityLabel,
}: {
  kategori: Kategori;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <ClayPressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      borderRadius={radius.tile}
      background={color.well}
      pressedBackground={color.groove}
      shadow={clay.sunken}
      pressedShadow={clay.pressed}
      gloss={false}
      style={stil.satir}>
      <CategoryIconBox kategori={kategori} />
      <View style={{ width: rhythm.blockInCard }} />
      <Txt role="bodyStrong" numberOfLines={1} style={stil.esnek}>
        {kategori.ad}
      </Txt>
      <View style={{ width: rhythm.blockInCard }} />
      <Icon name="chevron-down" size={size.iconSm} color={color.text2} />
    </ClayPressable>
  );
}

const stil = StyleSheet.create({
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: size.rowMinHeight,
    paddingVertical: size.rowPadY,
    paddingHorizontal: size.rowPadX,
  },
  esnek: { flex: 1, minWidth: 0 },
});
