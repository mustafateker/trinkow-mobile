import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { radius, rhythm, size } from '@/theme/tokens';

const ADI_GENISLIKLERI = ['62%', '48%', '55%'] as const;

/**
 * `arama-iskeleti` (F-18) — yalnız kullanıcının KENDİ geçmişi SQLite'tan
 * gelirken görünür (tipik <50ms); katalog senkron olduğu için iskelet
 * görmez (RN inşa notu #1). Spinner değil satır düzeni: içerik gelince
 * zıplama olmaz.
 */
export function SearchResultSkeleton() {
  return (
    <View>
      {ADI_GENISLIKLERI.map((genislik, i) => (
        <View key={i} style={i > 0 ? stil.satirAralik : undefined}>
          <View style={stil.satir}>
            <Skeleton width={size.catBox} height={size.catBox} borderRadius={radius.tile} />
            <View style={{ width: rhythm.blockInCard }} />
            <View style={stil.esnek}>
              <Skeleton width={genislik} height={16} />
              <View style={{ height: rhythm.group }} />
              <Skeleton width="40%" height={12} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const stil = StyleSheet.create({
  satirAralik: { marginTop: rhythm.group },
  satir: { flexDirection: 'row', alignItems: 'center', minHeight: size.rowMinHeight },
  esnek: { flex: 1, minWidth: 0 },
});
