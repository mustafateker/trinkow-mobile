import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { color, radius, rhythm } from '@/theme/tokens';

/** Son içerikle aynı ritimde kalır; veri gelince bölüm sırası zıplamaz. */
export function SavingsSkeleton() {
  return (
    <View>
      <View style={stil.ozet}>
        <View style={stil.kazanim}>
          <Skeleton width="46%" height={16} borderRadius={radius.pill} />
          <View style={{ height: rhythm.group }} />
          <Skeleton width="58%" height={16} borderRadius={radius.pill} />
          <View style={{ height: rhythm.group }} />
          <Skeleton width="74%" height={38} borderRadius={radius.tile} />
          <View style={{ height: rhythm.group }} />
          <Skeleton width="88%" height={16} borderRadius={radius.pill} />
        </View>
      </View>

      <View style={{ height: rhythm.section }} />
      <Skeleton width="46%" height={26} />
      <View style={{ height: rhythm.blockInCard }} />
      <View>
        <Skeleton width="38%" height={16} />
        <View style={{ height: rhythm.group }} />
        <Skeleton width="62%" height={38} />
        <View style={{ height: rhythm.section }} />
        {[0, 1].map((i) => (
          <View key={i} style={stil.rutinSatiri}>
            <Skeleton width={44} height={44} borderRadius={radius.tile} />
            <View style={stil.esnek}>
              <Skeleton width="100%" height={18} />
              <View style={{ height: rhythm.group }} />
              <Skeleton width="100%" height={8} borderRadius={radius.pill} />
            </View>
          </View>
        ))}
      </View>

      <View style={stil.ayrac} />
      <Skeleton width="52%" height={26} />
      <View style={{ height: rhythm.blockInCard }} />
      {[0, 1, 2].map((i) => (
        <View key={i} style={stil.kategoriSatiri}>
          <Skeleton width={44} height={44} borderRadius={radius.tile} />
          <View style={stil.esnek}>
            <Skeleton width="100%" height={18} />
            <View style={{ height: rhythm.group }} />
            <Skeleton width="100%" height={12} borderRadius={radius.pill} />
          </View>
        </View>
      ))}
    </View>
  );
}

const stil = StyleSheet.create({
  ozet: { paddingBottom: rhythm.section, borderBottomWidth: 1, borderBottomColor: color.line },
  kazanim: { paddingVertical: rhythm.group },
  satir: { flexDirection: 'row', alignItems: 'center', gap: rhythm.blockInCard },
  esnek: { flex: 1, minWidth: 0 },
  ayrac: { height: 1, backgroundColor: color.line, marginVertical: rhythm.section },
  rutinSatiri: { flexDirection: 'row', alignItems: 'center', gap: rhythm.blockInCard, paddingVertical: rhythm.blockInCard, borderBottomWidth: 1, borderBottomColor: color.line },
  kategoriSatiri: { flexDirection: 'row', alignItems: 'center', gap: rhythm.blockInCard, marginBottom: rhythm.blockInCard },
});
