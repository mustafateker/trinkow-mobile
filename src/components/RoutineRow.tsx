import { StyleSheet, View } from 'react-native';

import { ClayPressable } from '@/components/ClayPressable';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { KATEGORILER, type KategoriKodu } from '@/lib/kategoriler';
import { catColor, radius, rhythm, color } from '@/theme/tokens';

/**
 * rev2-onboarding-kayit.md §5.1 — YENİ varyant (`SpendRow` ölçüleri).
 * Satıra dokunmak = düzenle; yıkıcı hedef ("Rutini kaldır") satırda değil,
 * sheet'in içinde durur (yanlış dokunma maliyeti, §5 karar tablosu).
 */
export function RoutineRow({
  ad,
  kategori,
  altYazi,
  gunlukTutarYazi,
  onPress,
}: {
  ad: string;
  kategori: KategoriKodu;
  altYazi: string;
  gunlukTutarYazi: string;
  onPress: () => void;
}) {
  const k = KATEGORILER[kategori];
  const renk = catColor[k.aile];

  return (
    <ClayPressable
      onPress={onPress}
      accessibilityLabel={`${ad}, ${altYazi}, günlük ${gunlukTutarYazi}. Düzenle`}
      borderRadius={radius.tile}
      style={stil.satir}>
      <View style={[stil.kategoriKabi, { backgroundColor: renk.soft }]}>
        <Icon name={k.ikon} size={20} color={renk.solid} />
      </View>
      <View style={{ width: rhythm.pad }} />
      <View style={stil.orta}>
        <Txt role="body" numberOfLines={1}>
          {ad}
        </Txt>
        <View style={{ height: rhythm.sameObject }} />
        <Txt role="caption" tone={color.text2} numberOfLines={1}>
          {altYazi}
        </Txt>
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <Txt role="amount" numberOfLines={1}>
        {gunlukTutarYazi}
      </Txt>
      <View style={{ width: rhythm.blockInCard }} />
      <Icon name="pencil" size={20} color={color.text2} />
    </ClayPressable>
  );
}

const stil = StyleSheet.create({
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    paddingVertical: rhythm.blockInCard,
    paddingHorizontal: rhythm.pad,
  },
  kategoriKabi: { width: 44, height: 44, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  orta: { flex: 1, minWidth: 0 },
});
