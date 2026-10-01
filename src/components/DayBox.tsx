import { Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm, size } from '@/theme/tokens';

/**
 * Bileşen envanteri §3 `DayBox` (E-15 · v4'te E-03 maaş günü seçimi).
 * Taban durum: 44×44, radius 16, zemin `well` + `clay.sunken`.
 *
 * `ayKisa` verilirse E-15'in "gün + ay" biçimi (dokunulamaz, mevcut
 * davranış DEĞİŞMEDİ). Verilmezse "sayı-only" (E-03): dokunulabilir,
 * `selected` §5.4 DOLGU dilini kullanır (K-054/6) — düz `primary-deep` +
 * `clay.action` + beyaz sayı, halka yok. Seçim ile E-15'in "veri" görünümü
 * aynı sınıfı PAYLAŞMAZ (ayrı prop, ayrı dal).
 */
export function DayBox({
  gun,
  ayKisa,
  selected = false,
  onPress,
  accessibilityLabel,
}: {
  gun: number;
  ayKisa?: string;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  function kutuStili(basili: boolean) {
    if (basili) return { backgroundColor: color.groove, boxShadow: clay.pressed };
    if (selected) return { backgroundColor: color.primaryDeep, boxShadow: clay.action };
    return { backgroundColor: color.well, boxShadow: clay.sunken };
  }

  // E-15 dalı (ayKisa var) davranışı korunur: `label` rolünün varsayılan
  // rengi (`text`) değiştirilmez. E-03 dalında (ayKisa yok) seçili değilken
  // CSS `.gun-kutu .t-label{color:text-2}` izlenir.
  function gunRengi(basili: boolean) {
    if (basili) return color.text;
    if (selected) return color.onPrimary;
    return ayKisa ? undefined : color.text2;
  }

  const icerik = (basili: boolean) => (
    <View style={[stil.kutu, kutuStili(basili)]}>
      <Txt role="label" tone={gunRengi(basili)}>
        {gun}
      </Txt>
      {ayKisa ? (
        <>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="micro" tone={color.text2}>
            {ayKisa}
          </Txt>
        </>
      ) : null}
    </View>
  );

  if (!onPress) return icerik(false);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? String(gun)}
      accessibilityState={{ selected }}
      hitSlop={0}>
      {({ pressed }) => icerik(pressed)}
    </Pressable>
  );
}

const stil = StyleSheet.create({
  kutu: {
    width: size.catBox,
    height: size.catBox,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
