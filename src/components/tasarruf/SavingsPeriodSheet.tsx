import { View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Txt } from '@/components/Txt';
import { TASARRUF_DONEMLERI, type TasarrufDonemi } from '@/lib/tasarrufDonem';
import { rhythm } from '@/theme/tokens';
import { t } from '@/content/metinler';

export function SavingsPeriodSheet({
  visible,
  value,
  onChange,
  onClose,
}: {
  visible: boolean;
  value: TasarrufDonemi;
  onChange: (value: TasarrufDonemi) => void;
  onClose: () => void;
}) {
  const secenekler = TASARRUF_DONEMLERI.map((secenek) => ({
    value: secenek.value,
    label: t[secenek.labelKey],
  }));

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Txt role="h2">{t['ui.savings.period']}</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <SegmentedControl
        secenekler={secenekler}
        deger={value}
        onChange={(yeni) => {
          onChange(yeni);
          onClose();
        }}
      />
      <View style={{ height: rhythm.group }} />
    </BottomSheet>
  );
}
