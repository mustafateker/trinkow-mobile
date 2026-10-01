import { Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import type { GunSeriDurumu } from '@/db/seri';
import { clay, color, radius, v4 } from '@/theme/tokens';

/**
 * §5.4 dolgu dili (K-040/K-054 — halka YOK). Durum zeminle anlatılır:
 *  · `altinda` → düz `primary-deep` + beyaz sayı (kabartma)
 *  · `disinda` → yumuşak `warning-soft`
 *  · `bos`     → çukur `well` + `clay.sunken` (veri yok)
 *  · `pasif`   → düz `disabled-bg`, gölge YOK (E-24 — bu dilde gölge "basılabilir" demek)
 * Bugün noktası kutunun ALTINDA ayrı bir görsel — ızgarada "seçili" diye
 * dördüncü bir dil üretilmez (K-040 halka kararı).
 */
export function DayStatusBox({
  gun,
  durum,
  pasif = false,
  bugunMu = false,
  onPress,
  accessibilityLabel,
}: {
  gun: number;
  durum: GunSeriDurumu;
  pasif?: boolean;
  bugunMu?: boolean;
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  const dolu = durum === 'altinda';

  function kutuStili(basili: boolean) {
    // §6 pressed zorunlu — basılıyken TÜM durumlar aynı dile döner:
    // kutu içe çöker, zemin `groove`'a (prototip "basılı" notu).
    if (basili) return { backgroundColor: color.groove, boxShadow: clay.pressed };
    if (pasif) return { backgroundColor: color.disabledBg, boxShadow: undefined };
    if (dolu) return { backgroundColor: color.primaryDeep, boxShadow: clay.raised };
    if (durum === 'disinda') return { backgroundColor: color.warningSoft, boxShadow: clay.sunken };
    return { backgroundColor: color.well, boxShadow: clay.sunken };
  }

  const metinRengi = (basili: boolean) =>
    basili ? color.text : pasif ? color.text3 : dolu ? color.onPrimary : durum === 'disinda' ? color.warningInk : color.text2;

  return (
    <View style={stil.kolon}>
      {onPress ? (
        <Pressable
          onPress={onPress}
          disabled={pasif}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ disabled: pasif, selected: bugunMu }}
          hitSlop={0}>
          {({ pressed }) => (
            <View style={[stil.kutu, kutuStili(pressed)]}>
              <Txt role="label" tone={metinRengi(pressed)}>
                {gun}
              </Txt>
            </View>
          )}
        </Pressable>
      ) : (
        <View accessible accessibilityLabel={accessibilityLabel} style={[stil.kutu, kutuStili(false)]}>
          <Txt role="label" tone={metinRengi(false)}>
            {gun}
          </Txt>
        </View>
      )}
      <View style={stil.noktaAlani}>{bugunMu ? <View style={stil.nokta} /> : null}</View>
    </View>
  );
}

const stil = StyleSheet.create({
  kolon: { alignItems: 'center' },
  kutu: {
    width: v4.dayBox,
    height: v4.dayBox,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  noktaAlani: { height: v4.monthTodayDot, marginTop: 4, alignItems: 'center', justifyContent: 'center' },
  nokta: { width: v4.monthTodayDot, height: v4.monthTodayDot, borderRadius: radius.pill, backgroundColor: color.primaryText },
});
