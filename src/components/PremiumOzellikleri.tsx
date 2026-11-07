import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { t, type MetinAnahtari } from '@/content/metinler';
import { color, radius, rhythm } from '@/theme/tokens';

const OZELLIKLER: {
  icon: IconName;
  baslik: MetinAnahtari;
  alt: MetinAnahtari;
  renk: { bg: string; icon: string };
}[] = [
  {
    icon: 'chart',
    baslik: 'premium.ozellik.analiz',
    alt: 'premium.ozellik.analiz.alt',
    renk: { bg: '#EEF2FF', icon: '#4F46E5' },
  },
  {
    icon: 'landmark',
    baslik: 'premium.ozellik.tasarruf',
    alt: 'premium.ozellik.tasarruf.alt',
    renk: { bg: '#E2F6ED', icon: '#187F5A' },
  },
  {
    icon: 'eye-off',
    baslik: 'premium.ozellik.reklamsiz',
    alt: 'premium.ozellik.reklamsiz.alt',
    renk: { bg: '#FFF2DB', icon: '#B4700F' },
  },
];

/** Premium'un getirdikleri — paywall ve kilitli ekranlar aynı listeyi gösterir. */
export function PremiumOzellikleri({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[stil.liste, compact && stil.listeKompakt]}>
      {OZELLIKLER.map((ozellik) => (
        <View key={ozellik.baslik} style={[stil.satir, compact && stil.satirKompakt]}>
          <View style={[stil.ikonKabi, { backgroundColor: ozellik.renk.bg }]}>
            <Icon name={ozellik.icon} size={20} color={ozellik.renk.icon} />
          </View>
          <View style={stil.esnek}>
            <Txt role="bodyStrong">{t[ozellik.baslik]}</Txt>
            <View style={{ height: 2 }} />
            <Txt role="caption" tone={color.text2}>
              {t[ozellik.alt]}
            </Txt>
          </View>
        </View>
      ))}
    </View>
  );
}

const stil = StyleSheet.create({
  liste: { gap: rhythm.blockInCard },
  listeKompakt: { gap: rhythm.group },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rhythm.blockInCard,
    padding: rhythm.blockInCard,
    borderRadius: radius.card,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: 'rgba(23, 28, 66, 0.06)',
  },
  satirKompakt: {
    paddingVertical: rhythm.group,
    paddingHorizontal: rhythm.blockInCard,
  },
  ikonKabi: {
    width: 40,
    height: 40,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  esnek: { flex: 1, minWidth: 0 },
});
