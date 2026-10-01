import { StyleSheet, View } from 'react-native';

import { ClayPressable } from '@/components/ClayPressable';
import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri `OptionCard` — tam genişlik seçim kartı (onboarding +
 * profilleme). Seçenekler eşit ağırlıktadır, sıralanmaz/griye çekilmez.
 *
 * Seçili durum §5.4 SEÇİM DİLİ (K-061/2, §0 satır 38): çukur `primary-soft`
 * + `clay.sunken`, ikon kabı TERSİNE kabarır. **Halka yok.** Bileşen
 * envanterinin bu bileşene özel "2pt iç çizgi" cümlesi §0'ın K-061/2
 * düzeltmesinden ÖNCEKİ eski metindir — stil.css (`.secim-kart.secili`)
 * ve tokens.md §5.4 ile birebir aynı olan §0 izlendi, PM'e bildirildi.
 */
export function OptionCard({
  icon,
  title,
  caption,
  selected,
  onPress,
  accessibilityLabel,
}: {
  icon: IconName;
  title: string;
  caption: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <ClayPressable
      onPress={onPress}
      selected={selected}
      accessibilityLabel={accessibilityLabel ?? `${title}, ${caption}`}
      borderRadius={radius.card}
      background={selected ? color.primarySoft : color.surface}
      pressedBackground={color.groove}
      shadow={selected ? clay.sunken : clay.raised}
      pressedShadow={clay.pressed}
      style={stil.kart}>
      <View style={[stil.ikonKabi, selected ? stil.ikonKabiSecili : stil.ikonKabiTaban]}>
        <Icon name={icon} size={24} color={color.primaryText} />
      </View>
      <View style={{ width: rhythm.pad }} />
      <View style={stil.esnek}>
        <Txt role="bodyStrong">{title}</Txt>
        <View style={{ height: rhythm.group }} />
        <Txt role="caption">{caption}</Txt>
      </View>
    </ClayPressable>
  );
}

const stil = StyleSheet.create({
  kart: { flexDirection: 'row', alignItems: 'center', width: '100%', padding: rhythm.pad },
  ikonKabi: {
    width: 48,
    height: 48,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ikonKabiTaban: { backgroundColor: color.groove, boxShadow: clay.sunken },
  ikonKabiSecili: { backgroundColor: color.surface, boxShadow: clay.raised },
  esnek: { flex: 1, minWidth: 0 },
});
