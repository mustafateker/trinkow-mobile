import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { color, radius } from '@/theme/tokens';

/**
 * Bileşen envanteri `NeutralIconBox` (`ikon_kab`) — 48×48, radius 16,
 * `primary-soft` + `primary-text`. Daire DEĞİL — "daire ikon + başlık + tek
 * cümle" üçlü sütun şablonundan kaçınmanın yapısal karşılığı (anti-pattern
 * öz-denetimi). E-25 kart başlıklarının solunda kullanılır.
 */
export function NeutralIconBox({ icon }: { icon: IconName }) {
  return (
    <View style={stil.kutu}>
      <Icon name={icon} size={24} color={color.primaryText} />
    </View>
  );
}

const stil = StyleSheet.create({
  kutu: {
    width: 48,
    height: 48,
    borderRadius: radius.tile,
    backgroundColor: color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
