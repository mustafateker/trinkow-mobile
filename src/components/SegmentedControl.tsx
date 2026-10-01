import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { a11y, clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri §1 `SegmentedControl` — track çukur, seçili segment
 * KABARIK (seçim renkle değil yükseklikle okunur). Kullanım: ödeme tipi
 * (Nakit/Kart, ikonlu) · E-19 gün sınırı (00.00/03.00/06.00, ikonsuz —
 * prototipte üç düz sayı, `icon` isteğe bağlı).
 */
export type SegmentSecenek<T extends string> = { value: T; label: string; icon?: IconName };

export function SegmentedControl<T extends string>({
  secenekler,
  deger,
  onChange,
}: {
  secenekler: SegmentSecenek<T>[];
  deger: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={stil.track} accessibilityRole="tablist">
      {secenekler.map((s) => {
        const secili = s.value === deger;
        return (
          <Pressable
            key={s.value}
            onPress={() => onChange(s.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: secili }}
            accessibilityLabel={s.label}
            hitSlop={a11y.minTarget - 44 > 0 ? a11y.minTarget - 44 : 0}
            style={({ pressed }) => [
              stil.btn,
              secili && { backgroundColor: color.surface, boxShadow: clay.raised },
              !secili && pressed && { backgroundColor: color.groove },
            ]}>
            {s.icon ? (
              <>
                <Icon name={s.icon} size={20} color={secili ? color.text : color.text2} />
                <View style={{ width: rhythm.group }} />
              </>
            ) : null}
            <Txt role="bodyStrong" tone={secili ? color.text : color.text2}>
              {s.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const stil = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
