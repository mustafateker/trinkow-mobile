import { StyleSheet, Text, View } from 'react-native';

import { ClayPressable } from '@/components/ClayPressable';
import { Icon } from '@/components/Icon';
import { TABULAR, color, fontFamily, radius, rhythm } from '@/theme/tokens';

/**
 * tokens.md §7.11 — kil tuş takımı. Sistem klavyesi yerine tutar girişi.
 * 4×3: `1 2 3 / 4 5 6 / 7 8 9 / , 0 ⌫`. Nokta tuşu YOK — binlik ayracı
 * otomatik eklenir (`lib/para.ts`).
 */
const SATIRLAR: readonly (readonly string[])[] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [',', '0', '⌫'],
];

export function ClayKeypad({
  onDigit,
  onComma,
  onBackspace,
}: {
  onDigit: (d: string) => void;
  onComma: () => void;
  onBackspace: () => void;
}) {
  return (
    <View style={stil.kolon}>
      {SATIRLAR.map((satir, i) => (
        <View key={i}>
          {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
          <View style={stil.satir}>
            {satir.map((tus) => (
              <Tus
                key={tus}
                etiket={tus}
                onPress={() => {
                  if (tus === ',') onComma();
                  else if (tus === '⌫') onBackspace();
                  else onDigit(tus);
                }}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function Tus({ etiket, onPress }: { etiket: string; onPress: () => void }) {
  const silme = etiket === '⌫';
  return (
    <View style={stil.tusKabi}>
      <ClayPressable
        onPress={onPress}
        accessibilityLabel={silme ? 'Son rakamı sil' : etiket === ',' ? 'Virgül' : etiket}
        borderRadius={radius.tile}
        style={stil.tus}>
        {silme ? (
          <Icon name="delete" size={24} color={color.text} />
        ) : (
          <Text style={stil.tusMetin}>{etiket}</Text>
        )}
      </ClayPressable>
    </View>
  );
}

const stil = StyleSheet.create({
  kolon: { flexDirection: 'column' },
  // §3.3 negatif oluk telafisi −4 (tuş takımı satırı)
  satir: { flexDirection: 'row', marginHorizontal: -4 },
  tusKabi: { flex: 1, paddingHorizontal: 4 },
  tus: { height: 56, alignItems: 'center', justifyContent: 'center' },
  tusMetin: {
    fontFamily: fontFamily.uiSemibold,
    fontSize: 26,
    lineHeight: 32,
    color: color.text,
    fontVariant: TABULAR,
  },
});
