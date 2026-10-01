import { StyleSheet, View } from 'react-native';

import { CategoryIconBox, NeutralIconBox } from '@/components/CategoryIconBox';
import { ClayPressable } from '@/components/ClayPressable';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import type { Kategori } from '@/lib/kategoriler';
import { color, radius, rhythm, size } from '@/theme/tokens';

/**
 * Bileşen envanteri `SearchResultRow` (`sonuc-satiri`, E-11 · F-18).
 * `default` / `pressed` / `"… olarak ekle"` (nötr kap, `kategori` verilmez).
 * Sağda tutar sütunu YOKTUR — olmayan bir fiyat otoritesi ima edilmez;
 * kullanıcının kendi tutarı ikinci satırda "geçen sefer" sözcüğüyle,
 * `caption` ağırlığında durur (çağıran taraf `altBaslik`'i kurar).
 */
export function SearchResultRow({
  kategori,
  baslik,
  altBaslik,
  onPress,
  accessibilityLabel,
}: {
  /** Verilmezse nötr kap çizilir ("… olarak ekle" — henüz kategorisi yok). */
  kategori?: Kategori;
  baslik: string;
  altBaslik: string;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <ClayPressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? `${baslik}, ${altBaslik}`}
      borderRadius={radius.tile}
      background={color.surface}
      pressedBackground={color.groove}
      style={stil.satir}>
      {kategori ? <CategoryIconBox kategori={kategori} /> : <NeutralIconBox />}
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.orta}>
        <Txt role="body" numberOfLines={1} ellipsizeMode="tail">
          {baslik}
        </Txt>
        <Txt role="caption" tone={color.text2} numberOfLines={1} ellipsizeMode="tail">
          {altBaslik}
        </Txt>
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <Icon name="plus" size={size.iconSm} color={color.text2} />
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
  orta: { flex: 1, minWidth: 0 },
});
