import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { paraYaz } from '@/lib/para';
import { color, radius, rhythm } from '@/theme/tokens';

export function SavingsHeroCard({
  harcanabilirKurus,
  hesaplananTasarrufKurus,
  donemBasligi,
  onButcePress,
}: {
  harcanabilirKurus: number | null;
  hesaplananTasarrufKurus: number | null;
  donemBasligi: string;
  onButcePress: () => void;
}) {
  if (harcanabilirKurus === null) {
    return (
      <View style={stil.butceYok}>
        <Txt role="h2">{t['tasarruf.gelirYok.baslik']}</Txt>
        <View style={{ height: rhythm.group }} />
        <Txt role="body" tone={color.text2} style={stil.ortaMetin}>{t['tasarruf.gelirYok.alt']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <Button variant="primary" label={t['tasarruf.gelirYok.btn']} onPress={onButcePress} />
      </View>
    );
  }

  const tasarrufBiliniyor = hesaplananTasarrufKurus !== null;
  const pozitifMi = (hesaplananTasarrufKurus ?? 0) >= 0;
  const durumRengi = pozitifMi ? color.success : color.warning;
  const tutarRengi = pozitifMi ? color.text : color.warningInk;
  return (
    <View
      style={stil.kazanim}
      accessible
      accessibilityLabel={`Genel tasarruf durumu ${tasarrufBiliniyor ? paraYaz(hesaplananTasarrufKurus) : 'henüz hesaplanmadı'}`}>
      <View style={stil.baslikSatiri}>
        <Txt role="h2" style={stil.esnek}>Genel tasarruf durumu</Txt>
        <View style={[stil.durumNokta, { backgroundColor: durumRengi }]} />
      </View>
      <View style={{ height: rhythm.group }} />
      <Txt role="display" tone={tutarRengi} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.62}>
        {tasarrufBiliniyor ? paraYaz(hesaplananTasarrufKurus) : '—'}
      </Txt>
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="caption" tone={color.text2}>{donemBasligi}</Txt>
    </View>
  );
}

const stil = StyleSheet.create({
  kazanim: {
    padding: rhythm.pad,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.card,
    backgroundColor: color.surface,
  },
  baslikSatiri: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
  durumNokta: { width: 8, height: 8, borderRadius: 4 },
  esnek: { flex: 1, minWidth: 0 },
  butceYok: { alignItems: 'center', padding: rhythm.pad, borderWidth: 1, borderColor: color.line, borderRadius: radius.card, backgroundColor: color.surface },
  ortaMetin: { textAlign: 'center' },
});
