import { StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import { clay, color, radius } from '@/theme/tokens';

/**
 * Bileşen envanteri `SuggestionTag` (`oneri-pul`) — dokunulamaz, sayının
 * ONAYLANMAMIŞ olduğunu söyleyen çukur etiket (K-059/5). Kabul edilince
 * çağıran taraf pulu kaldırır (bileşenin kendisi durum tutmaz).
 *
 * Not: prototipin CSS'i 12px/600 kullanıyor; tokens'ın 10 tip rolüne birebir
 * denk düşmüyor (§2.2). En yakın uyumlu rol `label` (13pt SemiBold) seçildi
 * — PM'e bildirildi, metinler.md/tokens.md'de ayrı bir rol tanımlanmadı.
 */
export function SuggestionTag({ label }: { label: string }) {
  return (
    <View style={stil.pul}>
      <Txt role="label" tone={color.primaryText}>
        {label}
      </Txt>
    </View>
  );
}

const stil = StyleSheet.create({
  pul: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: color.primarySoft,
    boxShadow: clay.sunken,
    alignSelf: 'flex-start',
  },
});
