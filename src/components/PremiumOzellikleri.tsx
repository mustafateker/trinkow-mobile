import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { t, type MetinAnahtari } from '@/content/metinler';
import { color, radius, rhythm } from '@/theme/tokens';

const OZELLIKLER: { icon: IconName; baslik: MetinAnahtari; alt: MetinAnahtari }[] = [
  { icon: 'chart', baslik: 'premium.ozellik.analiz', alt: 'premium.ozellik.analiz.alt' },
  { icon: 'landmark', baslik: 'premium.ozellik.tasarruf', alt: 'premium.ozellik.tasarruf.alt' },
  { icon: 'eye-off', baslik: 'premium.ozellik.reklamsiz', alt: 'premium.ozellik.reklamsiz.alt' },
];

/** Premium'un getirdikleri — paywall ve kilitli ekranlar aynı listeyi gösterir. */
export function PremiumOzellikleri() {
  return (
    <View style={stil.liste}>
      {OZELLIKLER.map((ozellik) => (
        <View key={ozellik.baslik} style={stil.satir}>
          <View style={stil.ikonKabi}>
            <Icon name={ozellik.icon} size={20} color={color.primaryText} />
          </View>
          <View style={stil.esnek}>
            <Txt role="bodyStrong">{t[ozellik.baslik]}</Txt>
            <View style={{ height: rhythm.sameObject }} />
            <Txt role="caption">{t[ozellik.alt]}</Txt>
          </View>
        </View>
      ))}
    </View>
  );
}

const stil = StyleSheet.create({
  liste: { gap: rhythm.pad },
  satir: { flexDirection: 'row', alignItems: 'flex-start', gap: rhythm.blockInCard },
  ikonKabi: {
    width: 40,
    height: 40,
    borderRadius: radius.tile,
    backgroundColor: color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  esnek: { flex: 1, minWidth: 0 },
});
