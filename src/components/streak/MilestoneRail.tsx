import { ScrollView, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import { seriDurakA11y } from '@/content/metinler';
import { MILESTONES } from '@/db/seri';
import { clay, color, radius, rhythm, v4 } from '@/theme/tokens';

/**
 * tokens.md §7.13 `MilestoneRail` — E-21 "Duraklar". Daire 44, bağlantı
 * yolu 24×8. Yatay kaydırılır (8 durak 390pt'ye sığmaz — bilinçli, yarım
 * görünen son durak kaydırılabildiğini söyler).
 */
export function MilestoneRail({
  mevcutSeri,
  sonrakiDurak,
  oncekiDurak,
  aralikYuzde,
}: {
  mevcutSeri: number;
  sonrakiDurak: number | null;
  oncekiDurak: number;
  aralikYuzde: number;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stil.icerik}>
      {MILESTONES.map((m, i) => {
        const gecildi = m <= mevcutSeri;
        const sirada = m === sonrakiDurak;
        const hal = gecildi ? 'gecildi' : sirada ? 'sirada' : 'ileride';
        return (
          <View key={m} style={stil.oge}>
            <Durak deger={m} hal={hal} />
            {i < MILESTONES.length - 1 ? (
              <Bag
                dolulukOrani={
                  MILESTONES[i + 1] <= mevcutSeri ? 1 : m === oncekiDurak ? aralikYuzde : 0
                }
              />
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

function Durak({ deger, hal }: { deger: number; hal: 'gecildi' | 'sirada' | 'ileride' }) {
  const zemin = hal === 'gecildi' ? color.primaryDeep : hal === 'sirada' ? color.surface : color.well;
  const golge = hal === 'gecildi' ? clay.raised : hal === 'sirada' ? clay.raised : clay.sunken;
  const metinRengi = hal === 'gecildi' ? color.onPrimary : hal === 'sirada' ? color.primaryText : color.text2;
  return (
    <View
      accessible
      accessibilityLabel={seriDurakA11y(deger, hal)}
      style={[stil.durak, { backgroundColor: zemin, boxShadow: golge }]}>
      <Txt role="label" tone={metinRengi}>
        {deger}
      </Txt>
    </View>
  );
}

function Bag({ dolulukOrani }: { dolulukOrani: number }) {
  return (
    <View style={stil.bagOluk}>
      <View style={[stil.bagDolgu, { width: `${Math.max(0, Math.min(1, dolulukOrani)) * 100}%` }]} />
    </View>
  );
}

const stil = StyleSheet.create({
  icerik: { paddingHorizontal: rhythm.pad, alignItems: 'center' },
  oge: { flexDirection: 'row', alignItems: 'center' },
  durak: {
    width: v4.durakDiameter,
    height: v4.durakDiameter,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagOluk: {
    width: v4.durakTrackWidth,
    height: v4.durakTrackHeight,
    borderRadius: radius.pill,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
    overflow: 'hidden',
  },
  bagDolgu: { height: '100%', borderRadius: radius.pill, backgroundColor: color.primaryDeep },
});
