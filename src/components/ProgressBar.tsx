import { StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * Tasarım kiti §5/§7.3 — tek ince oluk + düz dolgu. Segment ÇİZİLMEZ
 * (390px'te 38px'lik parçalara bölünür, ilerleme okunmaz olur). Varsayılan
 * dolgu `primary`; günlük kahraman alanı gibi bağlamlar `tint` ile geçersiz
 * kılar (ör. limit aşımında `warning`). `hideFraction` verilince yanındaki
 * `n/toplam` metni gizlenir (kit'in "Günlük limitin %32'si kullanıldı" gibi
 * yalnız çubuk + ayrı cümleyle anlatıldığı yerlerde).
 */
export function ProgressBar({
  mevcut,
  toplam,
  accessibilityLabel,
  tint = color.primary,
  hideFraction = false,
}: {
  mevcut: number;
  toplam: number;
  accessibilityLabel: string;
  tint?: string;
  hideFraction?: boolean;
}) {
  const oran = toplam > 0 ? Math.min(1, mevcut / toplam) : 0;
  return (
    <View
      style={stil.satir}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 1, max: toplam, now: mevcut }}>
      <View style={stil.oluk}>
        <View style={[stil.dolguKirp, { width: `${oran * 100}%`, backgroundColor: tint }]} />
      </View>
      {hideFraction ? null : (
        <>
          <View style={{ width: rhythm.blockInCard }} />
          <Txt role="micro" tone={color.text2}>
            {mevcut}/{toplam}
          </Txt>
        </>
      )}
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'center' },
  oluk: {
    flex: 1,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
    overflow: 'hidden',
  },
  dolguKirp: { height: 8, borderRadius: radius.pill },
});
