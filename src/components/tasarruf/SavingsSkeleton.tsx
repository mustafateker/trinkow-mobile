import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { color, radius, rhythm } from '@/theme/tokens';

/** Yeni üç katmanlı Tasarruf düzeninin sakin, zıplamayan yükleme karşılığı. */
export function SavingsSkeleton() {
  return (
    <View>
      <View style={stil.ozet}>
        <View style={stil.ucKolon}>
          {[0, 1, 2].map((i) => <Skeleton key={i} width="28%" height={44} borderRadius={radius.tile} />)}
        </View>
        <View style={{ height: rhythm.blockInCard }} />
        <Skeleton width="100%" height={8} borderRadius={radius.pill} />
      </View>

      <View style={{ height: rhythm.section }} />
      <Txt role="h2">Gerçek birikim</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <View style={stil.bolum}>
        <Skeleton width="58%" height={24} />
        <View style={{ height: rhythm.blockInCard }} />
        <Skeleton width="100%" height={8} borderRadius={radius.pill} />
        <View style={{ height: rhythm.section }} />
        <Skeleton width="100%" height={52} borderRadius={radius.pill} />
      </View>

      <View style={{ height: rhythm.section }} />
      <Txt role="h2">Aylık analiz</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <View style={stil.bolum}>
        <Skeleton width="100%" height={68} borderRadius={radius.tile} />
        <View style={{ height: 1, backgroundColor: color.line }} />
        <Skeleton width="100%" height={68} borderRadius={radius.tile} />
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  ozet: { paddingBottom: rhythm.section, borderBottomWidth: 1, borderBottomColor: color.line },
  ucKolon: { flexDirection: 'row', justifyContent: 'space-between' },
  bolum: { padding: rhythm.pad, borderWidth: 1, borderColor: color.line, borderRadius: radius.tile },
});
