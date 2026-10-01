import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Txt } from '@/components/Txt';
import { profilAltSurum, t } from '@/content/metinler';
import { color, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri §5 `AppFooter` (yeni) — rev2-tasarruf-profil.md §4.4:
 * sürüm satırı + iki `ghost` yasal bağlantı, ikisi de HER durumda erişilebilir
 * (hata durumunda da) — yasal metinlerin gösterimi rev sözleşmesinin gereği.
 */
export function AppFooter({ surum, onSartlar, onGizlilik }: { surum: string; onSartlar: () => void; onGizlilik: () => void }) {
  return (
    <View style={stil.kolon}>
      <Txt role="micro" tone={color.text2}>
        {profilAltSurum(surum)}
      </Txt>
      <View style={{ height: rhythm.group }} />
      <View style={stil.satir}>
        <Button variant="ghost" label={t['profil.alt.sartlar']} auto onPress={onSartlar} />
        <Txt role="micro" tone={color.text2}>
          ·
        </Txt>
        <Button variant="ghost" label={t['profil.alt.gizlilik']} auto onPress={onGizlilik} />
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  kolon: { alignItems: 'center' },
  satir: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
});
