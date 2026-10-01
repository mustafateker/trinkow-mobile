import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/IconButton';
import type { IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { layout, rhythm } from '@/theme/tokens';

/**
 * §3.1 `.ekran-basi` — üst 8 / alt 16, yatay 16. Bileşen envanteri §4 "sağda
 * tek IconButton" der; K-072 (D-2c-1b) yalnız E-16 Özet'e ikinci bir eylem
 * (Ayarlar dişlisi) ekletti — `ikinciActionIcon` bu tek istisna için var,
 * yeni bir başlık bileşeni değil.
 */
export function ScreenHeader({
  ustSatir,
  baslik,
  actionIcon = 'limitler',
  actionLabel = 'Limitleri aç',
  onActionPress,
  ikinciActionIcon,
  ikinciActionLabel,
  onIkinciActionPress,
}: {
  ustSatir?: string;
  baslik: string;
  actionIcon?: IconName;
  actionLabel?: string;
  onActionPress?: () => void;
  ikinciActionIcon?: IconName;
  ikinciActionLabel?: string;
  onIkinciActionPress?: () => void;
}) {
  return (
    <View style={stil.kutu}>
      <View>
        {ustSatir ? <Txt role="caption">{ustSatir}</Txt> : null}
        <Txt role="h1">{baslik}</Txt>
      </View>
      <View style={stil.eylemler}>
        {ikinciActionIcon && ikinciActionLabel ? (
          <IconButton icon={ikinciActionIcon} accessibilityLabel={ikinciActionLabel} onPress={onIkinciActionPress} />
        ) : null}
        <IconButton icon={actionIcon} accessibilityLabel={actionLabel} onPress={onActionPress} />
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  kutu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: layout.headerPadTop,
    paddingBottom: layout.headerPadBottom,
    paddingHorizontal: layout.screenPaddingX,
  },
  eylemler: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
});
