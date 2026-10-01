import { StyleSheet, View } from 'react-native';

import { LoadBar } from '@/components/LoadBar';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { color, radius, rhythm } from '@/theme/tokens';

const AY_SUTUN = 56;
const TUTAR_SUTUN = 88;

/**
 * Bileşen envanteri §3 `MonthLoadRow` (E-18) — ay adı (56pt sabit) ·
 * `LoadBar` (esner) · tutar (88pt sabit, sağa hizalı). Çubuklar aynı
 * ölçeği paylaşır: en yüklü ay %100 (`oran` çağıran tarafından hesaplanır).
 */
export function MonthLoadRow({
  ay,
  tutar,
  oran,
  current = false,
}: {
  ay: string;
  tutar: string;
  oran: number;
  current?: boolean;
}) {
  return (
    <View style={stil.satir}>
      <Txt role="label" tone={current ? color.text : color.text2} style={stil.ay} numberOfLines={1}>
        {ay}
      </Txt>
      <View style={{ width: rhythm.blockInCard }} />
      <LoadBar oran={oran} />
      <View style={{ width: rhythm.blockInCard }} />
      <Txt role="amount" style={stil.tutar} numberOfLines={1}>
        {tutar}
      </Txt>
    </View>
  );
}

export function MonthLoadRowSkeleton() {
  return (
    <View style={stil.satir}>
      <Skeleton width={AY_SUTUN} height={18} />
      <View style={{ width: rhythm.blockInCard }} />
      <Skeleton width="100%" height={12} borderRadius={radius.pill} />
      <View style={{ width: rhythm.blockInCard }} />
      <Skeleton width={TUTAR_SUTUN} height={24} />
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'center' },
  ay: { width: AY_SUTUN, flexShrink: 0 },
  tutar: { width: TUTAR_SUTUN, flexShrink: 0, textAlign: 'right' },
});
