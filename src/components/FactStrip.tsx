import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri §5 `FactStrip` (`InfoStrip`'in nötr kipi) —
 * rev2-tasarruf-profil.md §4.2.1: zemin `well` (`clay.sunken`), 20pt ikon +
 * `label` olgu + `caption` bağlam, **dokunulamaz** (kendi basma hedefi/
 * chevron'u yok — panelin tamamı tek basma hedefidir). Skeleton hariç şerit
 * ASLA boş çizilmez; üç metin varyantı §4.2.1 tablosunda.
 */
export function FactStrip({ icon, olgu, baglam }: { icon: IconName; olgu: string; baglam: string }) {
  return (
    <View style={stil.serit}>
      <Icon name={icon} size={20} color={color.primaryText} />
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.esnek}>
        <Txt role="label">{olgu}</Txt>
        <View style={{ height: rhythm.sameObject }} />
        <Txt role="caption">{baglam}</Txt>
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  serit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: rhythm.blockInCard,
    paddingHorizontal: rhythm.pad,
    borderRadius: radius.tile,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
  },
  esnek: { flex: 1, minWidth: 0 },
});
