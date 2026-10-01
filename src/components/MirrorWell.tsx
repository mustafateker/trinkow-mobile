import { StyleSheet, View } from 'react-native';

import { ClaySurface } from '@/components/ClaySurface';
import { Txt } from '@/components/Txt';
import { color, radius, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri `MirrorWell` (ayna kuyusu) — çukur, "Ayda X ₺" + altında
 * FORMÜL satırı. Formül zorunlu yazılır: sayının nereden geldiğini görmeyen
 * kullanıcı ona güvenmez (delta-v4.md not-kutu). Soru cevaplanmadıysa hiç
 * ÇİZİLMEZ (çağıran taraf sorumluluğunda — `null` döndürülmez, koşullu render).
 */
export function MirrorWell({ baslik, tutarYazi, formulYazi }: { baslik: string; tutarYazi: string; formulYazi: string }) {
  return (
    <ClaySurface level="sunken" borderRadius={radius.tile} style={stil.kuyu}>
      <View style={stil.ustSatir}>
        <Txt role="bodyStrong">{baslik}</Txt>
        <Txt role="amount">{tutarYazi}</Txt>
      </View>
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="caption" tone={color.text2}>
        {formulYazi}
      </Txt>
    </ClaySurface>
  );
}

const stil = StyleSheet.create({
  kuyu: { padding: rhythm.blockInCard },
  ustSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
