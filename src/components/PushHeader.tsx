import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/IconButton';
import type { IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { color, layout, radius, size } from '@/theme/tokens';

/**
 * Bileşen envanteri §4 `PushHeader` — itilen ekranlar. Tasarım kiti §6.A
 * "Koyu app header" — koyu (`ink-950`) zemin, üstte geri `IconButton`
 * (cam zemin), ortada `h1` tek satır (beyaz), sağda isteğe bağlı eylem ya da
 * 44pt denge kutusu. Çağıran ekran bu bileşenin ALTINA açık, üst köşesi
 * yuvarlak bir panel yerleştirmelidir (bkz. `PANEL_RADIUS`).
 */
export const PANEL_RADIUS = radius.hero;

export function PushHeader({
  baslik,
  onGeri,
  sagIkon,
  sagEtiket,
  onSagPress,
}: {
  baslik: string;
  onGeri: () => void;
  sagIkon?: IconName;
  sagEtiket?: string;
  onSagPress?: () => void;
}) {
  return (
    <View style={stil.kutu}>
      <IconButton
        icon="chevron-left"
        accessibilityLabel={t['eylem.geri']}
        tone="#FFFFFF"
        background={color.navGlassBg}
        pressedBackground={color.navGlassBgPressed}
        onPress={onGeri}
      />
      <View style={stil.orta}>
        <Txt role="h2" tone="#FFFFFF" numberOfLines={1}>
          {baslik}
        </Txt>
      </View>
      {sagIkon && sagEtiket ? (
        <IconButton
          icon={sagIkon}
          accessibilityLabel={sagEtiket}
          tone="#FFFFFF"
          background={color.navGlassBg}
          pressedBackground={color.navGlassBgPressed}
          onPress={onSagPress}
        />
      ) : (
        <View style={stil.denge} />
      )}
    </View>
  );
}

const stil = StyleSheet.create({
  kutu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.navDark,
    paddingTop: layout.headerPadTop,
    paddingBottom: layout.headerPadBottom,
    paddingHorizontal: layout.screenPaddingX,
  },
  orta: { flex: 1, minWidth: 0, alignItems: 'center' },
  denge: { width: size.iconButton, height: size.iconButton },
});
