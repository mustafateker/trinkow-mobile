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

function AnalizOnizleme() {
  const barlar = [38, 65, 45, 88, 52, 75, 96];
  return (
    <View style={stil.onizlemeKarti}>
      <View style={stil.onizlemeBaslikSatiri}>
        <View style={stil.onizlemeSol}>
          <Icon name="chart" size={16} color={color.primaryText} />
          <Txt role="label" tone={color.text2}>Harcama Trendi & Analiz</Txt>
        </View>
        <View style={stil.canliEtiket}>
          <View style={stil.canliNokta} />
          <Txt role="micro" tone={color.primaryText}>Önizleme</Txt>
        </View>
      </View>

      <View style={stil.grafikKonteyner}>
        {barlar.map((h, i) => {
          const tepe = i === barlar.length - 1;
          return (
            <View key={i} style={stil.barSutun}>
              <View
                style={[
                  stil.bar,
                  {
                    height: h,
                    backgroundColor: tepe ? color.primary : color.primarySoft,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>

      <View style={stil.cipSatiri}>
        <View style={[stil.miniCip, { backgroundColor: '#E7EFFF' }]}>
          <Icon name="shopping-basket" size={14} color="#4B87FF" />
          <Txt role="micro" tone="#272F66">Market %42</Txt>
        </View>
        <View style={[stil.miniCip, { backgroundColor: '#EFEAFC' }]}>
          <Icon name="coffee" size={14} color="#7D60E8" />
          <Txt role="micro" tone="#272F66">Kafe %26</Txt>
        </View>
        <View style={[stil.miniCip, { backgroundColor: '#E2F6ED' }]}>
          <Icon name="utensils" size={14} color="#29AD7B" />
          <Txt role="micro" tone="#272F66">Yemek %18</Txt>
        </View>
      </View>
    </View>
  );
}

function TasarrufOnizleme() {
  return (
    <View style={stil.onizlemeKarti}>
      <View style={stil.onizlemeBaslikSatiri}>
        <View style={stil.onizlemeSol}>
          <Icon name="landmark" size={16} color={color.primaryText} />
          <Txt role="label" tone={color.text2}>Birikim & Tasarruf</Txt>
        </View>
        <View style={stil.canliEtiket}>
          <View style={stil.canliNokta} />
          <Txt role="micro" tone={color.primaryText}>Önizleme</Txt>
        </View>
      </View>

      <View style={{ height: rhythm.sameObject }} />
      <View style={stil.tasarrufIlerlemeSatiri}>
        <Txt role="bodyStrong">Aylık Birikim Hedefi</Txt>
        <Txt role="amount" tone={color.successInk}>%78</Txt>
      </View>
      <View style={{ height: rhythm.sameObject }} />
      <View style={stil.progressRay}>
        <View style={[stil.progressDolgu, { width: '78%' }]} />
      </View>

      <View style={{ height: rhythm.blockInCard }} />
      <View style={stil.cipSatiri}>
        <View style={[stil.miniCip, { backgroundColor: '#E2F6ED' }]}>
          <Txt role="micro" tone={color.successInk}>+₺1.450 Bu Ay Tasarruf</Txt>
        </View>
        <View style={[stil.miniCip, { backgroundColor: '#FFF2DB' }]}>
          <Txt role="micro" tone={color.warningInk}>Rutin Takipte</Txt>
        </View>
      </View>
    </View>
  );
}

/**
 * Ücretsiz kullanıcının Analizler ve Tasarruf sekmelerinde gördüğü zengin tanıtım vitrini.
 * Kilit ikonları yerine modern finans grafik önizlemesi ve fayda kartları sunar.
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
    <View style={stil.konteyner}>
      <View style={stil.tacRozet}>
        <Icon name="sparkles" size={14} color={color.warningDeep} />
        <Txt role="label" tone={color.warningDeep}>
          TRİNKOW PREMIUM
        </Txt>
      </View>

      <View style={{ height: rhythm.group }} />
      <Txt role="h1">{t[METIN[ozellik].baslik]}</Txt>
      <View style={{ height: rhythm.group }} />
      <Txt role="body" tone={color.text2}>
        {t[METIN[ozellik].govde]}
      </Txt>

      <View style={{ height: rhythm.pad }} />
      {ozellik === 'analiz' ? <AnalizOnizleme /> : <TasarrufOnizleme />}

      <View style={{ height: rhythm.section }} />
      <PremiumOzellikleri compact />

      <View style={{ height: rhythm.section }} />
      <Button
        variant="primary"
        icon="crown"
        label={t['premium.kilit.eylem']}
        onPress={() => router.push({ pathname: '/premium', params: { tur: 'indirim', kaynak: 'kilit' } })}
      />
      <View style={{ height: rhythm.blockInCard }} />
      <View style={stil.guvence}>
        <Icon name="shield-check" size={16} color={color.text3} />
        <Txt role="micro" tone={color.text3}>
          7 gün ücretsiz deneme • İstediğin zaman iptal et
        </Txt>
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  iskelet: { gap: rhythm.pad },
  konteyner: {
    paddingBottom: rhythm.section,
  },
  tacRozet: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: rhythm.blockInCard,
    paddingVertical: rhythm.sameObject,
    borderRadius: radius.pill,
    backgroundColor: color.warningSoft,
    borderWidth: 1,
    borderColor: 'rgba(216, 135, 24, 0.15)',
  },
  onizlemeKarti: {
    padding: rhythm.pad,
    borderRadius: radius.card,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: 'rgba(23, 28, 66, 0.08)',
    shadowColor: '#171C42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  onizlemeBaslikSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: rhythm.blockInCard,
  },
  onizlemeSol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rhythm.group,
  },
  canliEtiket: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: rhythm.group,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: color.primarySoft,
  },
  canliNokta: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: color.primary,
  },
  grafikKonteyner: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: rhythm.group,
    paddingHorizontal: rhythm.group,
    backgroundColor: color.well,
    borderRadius: radius.tile,
    marginBottom: rhythm.blockInCard,
  },
  barSutun: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 18,
    borderRadius: radius.pill,
  },
  cipSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: rhythm.group,
  },
  miniCip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: rhythm.group,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  tasarrufIlerlemeSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressRay: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: color.well,
    overflow: 'hidden',
  },
  progressDolgu: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: color.success,
  },
  guvence: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
