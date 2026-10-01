import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { color, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri (delta-v4 T-2) `PasswordRuleLine` — E-23. `unmet`
 * (yalnız caption) / `met` (20pt `check` + caption). Renkli güç çubuğu
 * ve dört maddelik onay listesi ÜRETİLMEDİ (bilinçli tasarım kararı #5,
 * K-050: sahte skor mantığı). Tek kural: en az 8 karakter.
 */
export function PasswordRuleLine({ met }: { met: boolean }) {
  if (!met) {
    return <Txt role="caption">{t['kayit.sifre_kural']}</Txt>;
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="check" size={20} color={color.successInk} />
      <View style={{ width: rhythm.group }} />
      <Txt role="caption">{t['kayit.sifre_kural_tamam']}</Txt>
    </View>
  );
}
