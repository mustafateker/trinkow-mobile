import { StyleSheet, View } from 'react-native';

import { DayStatusBox } from '@/components/streak/DayStatusBox';
import { seriGunA11y } from '@/content/metinler';
import type { SeriIzgaraGunu } from '@/db/useSeriEkrani';
import { v4 } from '@/theme/tokens';

/**
 * tokens.md §7.13 `StreakDayGrid` — E-21 "Son 4 hafta". 7 sütun `flexWrap`,
 * gutter 8. CSS grid yok; eşit dağılım `flex-basis` ile.
 */
export function StreakDayGrid({ gunler }: { gunler: SeriIzgaraGunu[] }) {
  return (
    <View style={stil.izgara}>
      {gunler.map((g) => (
        <View key={g.anahtar} style={stil.hucre}>
          <DayStatusBox
            gun={g.gun}
            durum={g.durum}
            accessibilityLabel={seriGunA11y(String(g.gun), g.durum)}
          />
        </View>
      ))}
    </View>
  );
}

const stil = StyleSheet.create({
  izgara: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -v4.gridGap / 2 },
  hucre: { width: '14.2857%', alignItems: 'center', marginBottom: v4.gridGap },
});
