import { View } from 'react-native';

import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';

/**
 * Bileşen envanteri (delta-v4 T-2) `OrDivider` — tek durum. Çizgi yok,
 * ortalanmış tek sözcük (bilinçli tasarım kararı #4: `line` sayfa
 * zemininde 1.08:1 — görünmeyen bir çizgi çizmek yerine boşluk ayırır).
 */
export function OrDivider() {
  return (
    <View style={{ alignItems: 'center' }}>
      <Txt role="caption">{t['giris.ayirac']}</Txt>
    </View>
  );
}
