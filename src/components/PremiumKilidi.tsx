import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { PremiumOzellikleri } from '@/components/PremiumOzellikleri';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { color, radius, rhythm } from '@/theme/tokens';

export type KilitliOzellik = 'analiz' | 'tasarruf';

const METIN = {
  analiz: { baslik: 'premium.kilit.analiz.baslik', govde: 'premium.kilit.analiz.govde' },
  tasarruf: { baslik: 'premium.kilit.tasarruf.baslik', govde: 'premium.kilit.tasarruf.govde' },
} as const;

/**
 * Ücretsiz kullanıcının Analizler ve Tasarruf sekmelerinde gördüğü içerik.
 * Premium durumu henüz bilinmiyorsa (`hazir` false) kilit yerine iskelet
 * çizilir; Premium kullanıcıya açılışta kilit görüntüsü yanıp sönmez.
 */
export function PremiumKilidi({ ozellik, hazir }: { ozellik: KilitliOzellik; hazir: boolean }) {
  if (!hazir) {
    return (
      <View style={stil.iskelet}>
        <Skeleton width="60%" height={26} />
        <Skeleton width="100%" height={180} borderRadius={radius.card} />
      </View>
    );
  }
  return (
    <View>
      <View style={stil.ikonKabi}>
        <Icon name="lock" size={28} color={color.primaryText} />
      </View>
      <View style={{ height: rhythm.pad }} />
      <Txt role="h2">{t[METIN[ozellik].baslik]}</Txt>
      <View style={{ height: rhythm.group }} />
      <Txt role="body" tone={color.text2}>
        {t[METIN[ozellik].govde]}
      </Txt>
      <View style={{ height: rhythm.section }} />
      <PremiumOzellikleri />
      <View style={{ height: rhythm.section }} />
      <Button
        variant="primary"
        icon="crown"
        label={t['premium.kilit.eylem']}
        onPress={() => router.push({ pathname: '/premium', params: { tur: 'indirim', kaynak: 'kilit' } })}
      />
    </View>
  );
}

const stil = StyleSheet.create({
  iskelet: { gap: rhythm.pad },
  ikonKabi: {
    width: 56,
    height: 56,
    borderRadius: radius.tile,
    backgroundColor: color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
