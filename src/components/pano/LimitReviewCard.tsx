import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ClaySurface } from '@/components/ClaySurface';
import { IconButton } from '@/components/IconButton';
import { Txt } from '@/components/Txt';
import { limitSorguBasligi, t } from '@/content/metinler';
import { radius, rhythm } from '@/theme/tokens';

/**
 * metinler.md §3.3 — imza kart. Ayda BİR kez, 5. aşımdan sonra çıkar,
 * kapatılabilir. Suç kullanıcıya değil kuruluma atılır: kırmızı yok,
 * ünlem yok, utandırma yok.
 */
export function LimitReviewCard({
  asimSirasi,
  baslikOverride,
  onReview,
  onDismiss,
}: {
  asimSirasi: number;
  /** E-16 Özet — "Bu ay N. limit aşımı" yerine "Günlük limit {tutar}" gösterir. */
  baslikOverride?: string;
  onReview?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <ClaySurface level="raised" borderRadius={radius.card} style={stil.kart}>
      <View style={stil.icerik}>
        <Txt role="h2">{baslikOverride ?? limitSorguBasligi(asimSirasi)}</Txt>
        <View style={{ height: rhythm.group }} />
        <Txt role="caption">{t['pano.limit_sorgu.govde']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <Button label={t['pano.limit_sorgu.eylem']} variant="secondary" auto onPress={onReview} />
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <IconButton icon="x" accessibilityLabel="Kartı kapat" onPress={onDismiss} />
    </ClaySurface>
  );
}

const stil = StyleSheet.create({
  kart: { padding: rhythm.pad, flexDirection: 'row', alignItems: 'flex-start' },
  icerik: { flex: 1, minWidth: 0 },
});
