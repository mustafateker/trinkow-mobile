import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ClaySurface } from '@/components/ClaySurface';
import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * tokens.md §7.8 — boş durum. `EmptyGauge` yerine burada 176pt çukur
 * disk + ortada ikon (markanın kil primitifi). Her yüzeyde farklı metin
 * (metinler.md §13); "Henüz veri yok" hiçbir yerde yazılmaz.
 */
export function EmptyState({
  icon,
  baslik,
  govde,
  butonEtiketi,
  onButonPress,
}: {
  icon: IconName;
  baslik?: string;
  govde: string;
  butonEtiketi?: string;
  onButonPress?: () => void;
}) {
  return (
    <ClaySurface level="raisedLg" borderRadius={radius.card} style={stil.kart}>
      <View style={stil.disk}>
        <Icon name={icon} size={32} color={color.text2} />
      </View>
      <View style={{ height: rhythm.blockInCard }} />
      {baslik ? (
        <>
          <Txt role="h2">{baslik}</Txt>
          <View style={{ height: rhythm.group }} />
        </>
      ) : null}
      <Txt role="body" style={stil.metin}>
        {govde}
      </Txt>
      {butonEtiketi ? (
        <>
          <View style={{ height: rhythm.blockInCard }} />
          <Button label={butonEtiketi} variant="primary" icon="plus" onPress={onButonPress} auto />
        </>
      ) : null}
    </ClaySurface>
  );
}

const stil = StyleSheet.create({
  kart: { padding: rhythm.pad, alignItems: 'center' },
  disk: {
    width: 176,
    height: 176,
    borderRadius: radius.pill,
    backgroundColor: color.groove,
    boxShadow: clay.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metin: { textAlign: 'center' },
});
