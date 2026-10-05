import { View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Txt } from '@/components/Txt';
import { TASARRUF_DONEMLERI, type TasarrufDonemi } from '@/lib/tasarrufDonem';
import { rhythm } from '@/theme/tokens';

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
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Txt role="h2">Tasarruf dönemi</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <SegmentedControl
        secenekler={TASARRUF_DONEMLERI}
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
