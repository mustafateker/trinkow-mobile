import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { t } from '@/content/metinler';
import type { Siklik } from '@/lib/plan';
import { rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri `FrequencyChips` — sarmalı çip satırı, **serbest sayı en
 * sonda** (F-2: ilk seçenek olsaydı her kullanıcı klavyeyle başlardı).
 * "Hiç" seçilince fiyat alanı kapanır — bu KARAR çağıran tarafta (kart),
 * bileşenin kendisi yalnız seçimi bildirir.
 */
const SIRALAMA: Siklik[] = ['gun1', 'gun2', 'hafta2_3', 'hafta1', 'ay1_2', 'hic', 'serbest'];

const ETIKET: Record<Siklik, string> = {
  gun1: t['tan.siklik.gun1'],
  gun2: t['tan.siklik.gun2'],
  hafta2_3: t['tan.siklik.hafta2_3'],
  hafta1: t['tan.siklik.hafta1'],
  ay1_2: t['tan.siklik.ay1_2'],
  hic: t['tan.siklik.hic'],
  serbest: t['tan.siklik.serbest'],
};

export function siklikEtiketi(s: Siklik): string {
  return ETIKET[s];
}

export function FrequencyChips({ deger, onSecim }: { deger: Siklik | null; onSecim: (s: Siklik) => void }) {
  return (
    <View style={stil.ag}>
      {SIRALAMA.map((s) => (
        <View key={s} style={stil.oge}>
          <Chip ad={ETIKET[s]} selected={deger === s} onPress={() => onSecim(s)} />
        </View>
      ))}
    </View>
  );
}

const stil = StyleSheet.create({
  ag: { flexDirection: 'row', flexWrap: 'wrap', marginRight: -rhythm.group, marginBottom: -rhythm.group },
  oge: { marginRight: rhythm.group, marginBottom: rhythm.group },
});
