import { useState } from 'react';
import { Text } from 'react-native';

import { color, type } from '@/theme/tokens';

/**
 * Bileşen envanteri (delta-v4 T-2) `LegalConsentText` — E-23. `default` /
 * `pressed` (bağlantı rengi `primary-press`). RN inşa notu 6: iç içe
 * `Text` + `onPress` + `accessibilityRole="link"`.
 *
 * `metin` kaynak metnin KENDİSİDİR (`**...**` Markdown kalın imi bağlantı
 * sınırını işaretler) — metinler.md'deki cümle birebir korunur, burada
 * yalnız ayrıştırılır. Belgeler henüz yazılmadı (delta-v4 çelişki #7):
 * `onLinkPress` verilmezse dokunma yalnız görsel geri bildirim üretir.
 */
export function LegalConsentText({
  metin,
  onLinkPress,
}: {
  metin: string;
  onLinkPress?: (baglantiIndeksi: number) => void;
}) {
  const parcalar = metin.split('**');
  const [basiliIndeks, setBasiliIndeks] = useState<number | null>(null);

  return (
    <Text style={[type.micro, { color: color.text2 }]}>
      {parcalar.map((parca, i) => {
        const baglantiMi = i % 2 === 1;
        if (!baglantiMi) return <Text key={i}>{parca}</Text>;
        const baglantiIndeksi = (i - 1) / 2;
        return (
          <Text
            key={i}
            accessibilityRole="link"
            onPress={(event) => { event.stopPropagation(); onLinkPress?.(baglantiIndeksi); }}
            onPressIn={() => setBasiliIndeks(baglantiIndeksi)}
            onPressOut={() => setBasiliIndeks(null)}
            style={{ color: basiliIndeks === baglantiIndeksi ? color.primaryPress : color.primaryText }}>
            {parca}
          </Text>
        );
      })}
    </Text>
  );
}
