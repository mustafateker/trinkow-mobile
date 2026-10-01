import { StyleSheet, View } from 'react-native';

import { clay, color, radius } from '@/theme/tokens';

export type ShareSegment = { color: string; kurus: number };

/**
 * Bileşen envanteri `ShareBar` (E-26) — tek oluk, segmentler arası 4pt boşluk
 * (oluk aradan görünür, WCAG 1.4.11 komşu grafik nesne). **Metin taşımaz**
 * (K-066) — pay adları `ShareRow`da. 2 pay (birikim girilmedi) da desteklenir.
 */
export function ShareBar({ segments, toplamKurus }: { segments: ShareSegment[]; toplamKurus: number }) {
  const gecerli = segments.filter((s) => s.kurus > 0);
  return (
    <View style={stil.oluk}>
      {gecerli.map((s, i) => (
        <View key={i} style={{ flexDirection: 'row', flex: toplamKurus > 0 ? s.kurus / toplamKurus : 0 }}>
          {i > 0 ? <View style={stil.ara} /> : null}
          <View style={[stil.dolgu, { flex: 1, backgroundColor: s.color }]} />
        </View>
      ))}
    </View>
  );
}

const stil = StyleSheet.create({
  oluk: {
    flexDirection: 'row',
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
    overflow: 'hidden',
  },
  ara: { width: 4 },
  dolgu: { height: 12, borderRadius: radius.pill },
});
