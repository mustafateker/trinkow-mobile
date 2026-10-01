import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * tokens.md §7.13 `MonthNav` — `ay_secici`nin pasif oklu sürümü. Uçta ok
 * GİZLENMEZ, pasifleşir (§6): "Sonraki ay yok" / "Önceki ay yok" a11y ile.
 */
export function MonthNav({
  baslik,
  altMetin,
  oncekiPasif,
  sonrakiPasif,
  onOnceki,
  onSonraki,
}: {
  baslik: string;
  altMetin: string;
  oncekiPasif: boolean;
  sonrakiPasif: boolean;
  onOnceki: () => void;
  onSonraki: () => void;
}) {
  return (
    <View style={stil.kuyu}>
      <IconButton
        icon="chevron-left"
        accessibilityLabel={oncekiPasif ? t['gunsec.onceki_ay_yok'] : t['gunsec.onceki_ay']}
        onPress={onOnceki}
        disabled={oncekiPasif}
      />
      <View style={stil.orta}>
        <Txt role="bodyStrong">{baslik}</Txt>
        <View style={{ height: rhythm.sameObject }} />
        <Txt role="caption" tone={color.text2}>
          {altMetin}
        </Txt>
      </View>
      <IconButton
        icon="chevron-right"
        accessibilityLabel={sonrakiPasif ? t['gunsec.sonraki_ay_yok'] : t['gunsec.sonraki_ay']}
        onPress={onSonraki}
        disabled={sonrakiPasif}
      />
    </View>
  );
}

const stil = StyleSheet.create({
  kuyu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: rhythm.pad,
    borderRadius: radius.tile,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
  },
  orta: { alignItems: 'center' },
});
