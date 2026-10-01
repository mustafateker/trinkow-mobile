import { StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import { color, radius, rhythm, v4 } from '@/theme/tokens';

/** E-21/E-24 ortak lejant satırı — üç durum karesi + etiket. */
export function Legend({
  altindaEtiket,
  disindaEtiket,
  kayitYokEtiket,
}: {
  altindaEtiket: string;
  disindaEtiket: string;
  kayitYokEtiket: string;
}) {
  return (
    <View style={stil.satir}>
      <Swatch renk={color.primaryDeep} etiket={altindaEtiket} />
      <View style={{ width: rhythm.pad }} />
      <Swatch renk={color.warningSoft} etiket={disindaEtiket} />
      <View style={{ width: rhythm.pad }} />
      <Swatch renk={color.well} etiket={kayitYokEtiket} />
    </View>
  );
}

function Swatch({ renk, etiket }: { renk: string; etiket: string }) {
  return (
    <View style={stil.oge}>
      <View style={[stil.kare, { backgroundColor: renk }]} />
      <View style={{ width: rhythm.group }} />
      <Txt role="micro" tone={color.text2}>
        {etiket}
      </Txt>
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  oge: { flexDirection: 'row', alignItems: 'center' },
  kare: { width: v4.legendSwatch, height: v4.legendSwatch, borderRadius: radius.tile },
});
