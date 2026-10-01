import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { InfoStrip } from '@/components/InfoStrip';
import { Txt } from '@/components/Txt';
import { profGun, t } from '@/content/metinler';
import { color, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri §5 `ProfilingSheet` (F-12, eski `ProfilingPrompt`) —
 * E-20. Pano içinde kart DEĞİL, bottom sheet: `micro` gün sayacı + kapatma
 * → `h1` tek soru → `caption` karşılığı → 2-3 seçenek → "Şimdi değil"
 * (`ghost`, tam genişlik). Kapatma (X) ve "Şimdi değil" AYNI eylemi
 * tetikler (`onReddet`) — not-kutu: "iki ayrı çıkış kapısı" eşit ağırlıklı,
 * ayrı davranış değil.
 */
export function ProfilingSheet({
  visible,
  gun,
  baslik,
  aciklama,
  bilgiSeridi,
  onReddet,
  children,
}: {
  visible: boolean;
  gun: number;
  baslik: string;
  aciklama: string;
  /** Yalnız Yatırım sorusunun K-053 sınır şeridi (tavsiye yok, enstrüman yok). */
  bilgiSeridi?: string;
  onReddet: () => void;
  /** 2-4 seçim kartı. */
  children: ReactNode;
}) {
  return (
    <BottomSheet visible={visible} onClose={onReddet}>
      <View style={stil.ustSatir}>
        <Txt role="micro" tone={color.text2}>
          {profGun(gun)}
        </Txt>
        <IconButton icon="x" accessibilityLabel={t['a11y.prof.kapat']} onPress={onReddet} />
      </View>
      <View style={{ height: rhythm.group }} />
      <Txt role="h1">{baslik}</Txt>
      <View style={{ height: rhythm.group }} />
      <Txt role="caption">{aciklama}</Txt>
      <View style={{ height: rhythm.section }} />
      <View>{children}</View>
      {bilgiSeridi ? (
        <>
          <View style={{ height: rhythm.pad }} />
          <InfoStrip variant="info" metin={bilgiSeridi} />
        </>
      ) : null}
      <View style={{ height: rhythm.blockInCard }} />
      <Button label={t['prof.simdi_degil']} variant="ghost" onPress={onReddet} />
    </BottomSheet>
  );
}

const stil = StyleSheet.create({
  ustSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
