import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadBar } from '@/components/LoadBar';
import { Txt } from '@/components/Txt';
import { t, tasarrufGostergeCumleBuAy, tasarrufGostergeCumleGecmisAy } from '@/content/metinler';
import { paraYaz } from '@/lib/para';
import { color, rhythm } from '@/theme/tokens';

export function SavingsHeroCard({
  harcanabilirKurus,
  harcananKurus,
  kalanKurus,
  tamamlananGun,
  guncelAyMi,
  ayLokatifDeger,
  onButcePress,
}: {
  harcanabilirKurus: number | null;
  harcananKurus: number;
  kalanKurus: number | null;
  tamamlananGun: number;
  guncelAyMi: boolean;
  ayLokatifDeger: string;
  onButcePress: () => void;
}) {
  if (harcanabilirKurus === null) {
    return (
      <View style={stil.butceYok}>
        <Txt role="h2">{t['tasarruf.gelirYok.baslik']}</Txt>
        <View style={{ height: rhythm.group }} />
        <Txt role="body" tone={color.text2}>{t['tasarruf.gelirYok.alt']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <Button variant="primary" label={t['tasarruf.gelirYok.btn']} onPress={onButcePress} />
      </View>
    );
  }

  const oran = harcanabilirKurus > 0 ? harcananKurus / harcanabilirKurus : 0;
  const altMetin = guncelAyMi
    ? tasarrufGostergeCumleBuAy(tamamlananGun)
    : tasarrufGostergeCumleGecmisAy(ayLokatifDeger, tamamlananGun);

  return (
    <View accessible accessibilityLabel={`Harcanabilir ${paraYaz(harcanabilirKurus)}, harcanan ${paraYaz(harcananKurus)}, kalan ${paraYaz(Math.abs(kalanKurus ?? 0))}`}>
      <View style={stil.ozetSatiri}>
        <OzetHucre etiket="Harcanabilir" deger={paraYaz(harcanabilirKurus)} />
        <View style={stil.dikeyAyrac} />
        <OzetHucre etiket="Harcanan" deger={paraYaz(harcananKurus)} />
        <View style={stil.dikeyAyrac} />
        <OzetHucre etiket={kalanKurus != null && kalanKurus < 0 ? 'Bütçe dışı' : 'Kalan'} deger={paraYaz(Math.abs(kalanKurus ?? 0))} vurgu={kalanKurus == null || kalanKurus >= 0} />
      </View>
      <View style={{ height: rhythm.blockInCard }} />
      <LoadBar oran={oran} />
      <View style={{ height: rhythm.group }} />
      <Txt role="caption" tone={color.text2}>{altMetin}</Txt>
    </View>
  );
}

function OzetHucre({ etiket, deger, vurgu = false }: { etiket: string; deger: string; vurgu?: boolean }) {
  return (
    <View style={stil.ozetHucre}>
      <Txt role="micro" tone={color.text2} numberOfLines={1}>{etiket}</Txt>
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="amount" tone={vurgu ? color.successInk : color.text} numberOfLines={1} adjustsFontSizeToFit>{deger}</Txt>
    </View>
  );
}

const stil = StyleSheet.create({
  ozetSatiri: { flexDirection: 'row', alignItems: 'stretch', width: '100%' },
  ozetHucre: { flex: 1, minWidth: 0, alignItems: 'center' },
  dikeyAyrac: { width: 1, backgroundColor: color.line, marginHorizontal: rhythm.group },
  butceYok: { alignItems: 'center' },
});
