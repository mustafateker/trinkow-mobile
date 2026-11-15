import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { PremiumOzellikleri } from '@/components/PremiumOzellikleri';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { aktifEtiket, metin, takvim } from '@/i18n/cekirdek';
import { kategori } from '@/lib/kategoriler';
import { paraYaz } from '@/lib/para';
import { catColor, clay, color, radius, rhythm } from '@/theme/tokens';

export type KilitliOzellik = 'analiz' | 'tasarruf';

const METIN = {
  analiz: { baslik: 'premium.kilit.analiz.baslik', govde: 'premium.kilit.analiz.govde' },
  tasarruf: { baslik: 'premium.kilit.tasarruf.baslik', govde: 'premium.kilit.tasarruf.govde' },
} as const;

function AnalizOnizleme() {
  const haftaninGunleri =
    takvim.haftaGunKisa && takvim.haftaGunKisa.length === 7
      ? takvim.haftaGunKisa
      : ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const marketKat = kategori('market');
  const kafeKat = kategori('kafe');
  const restoranKat = kategori('restoran');

  // 7 günlük pürüzsüz mock harcama eğrisi (Smooth cubic Bezier)
  const cizgiYolu =
    'M 18 72 C 38 72, 44 50, 64 50 C 84 50, 90 62, 110 62 C 130 62, 136 36, 156 36 C 176 36, 182 54, 202 54 C 222 54, 228 16, 248 16 C 268 16, 274 42, 294 42';
  const alanYolu = `${cizgiYolu} L 294 88 L 18 88 Z`;

  const noktalar = [
    { x: 18, y: 72 },
    { x: 64, y: 50 },
    { x: 110, y: 62 },
    { x: 156, y: 36 },
    { x: 202, y: 54 },
    { x: 248, y: 16 }, // Zirve (Cmt)
    { x: 294, y: 42 },
  ];

  return (
    <View style={stil.onizlemeKarti}>
      {/* Kart Üst Barı: Başlık + Canlı Rozet */}
      <View style={stil.onizlemeBaslikSatiri}>
        <View style={stil.onizlemeSol}>
          <Icon name="chart" size={16} color={color.primaryText} />
          <Txt role="label" tone={color.text2} numberOfLines={1} style={stil.esnek}>
            {t['premium.kilit.analiz.onizleme_baslik']}
          </Txt>
        </View>
        <View style={stil.canliEtiket}>
          <View style={stil.canliNokta} />
          <Txt role="micro" tone={color.primaryText}>
            {t['premium.kilit.onizleme']}
          </Txt>
        </View>
      </View>

      {/* Tutar & Dönem Göstergesi */}
      <View style={stil.metrikSatiri}>
        <View style={stil.esnek}>
          <Txt role="caption" tone={color.text3}>
            {t['ui.analysis.total']} ({t['ui.analysis.period_week']})
          </Txt>
          <Txt role="h1" tone={color.text}>
            {paraYaz(588000)}
          </Txt>
        </View>
        <View style={stil.miniDonemKutusu}>
          <View style={stil.miniDonemAktif}>
            <Txt role="micro" tone={color.primaryText} style={stil.kalin}>
              {t['ui.analysis.period_week']}
            </Txt>
          </View>
          <View style={stil.miniDonemPasif}>
            <Txt role="micro" tone={color.text3}>
              {t['ui.analysis.period_month']}
            </Txt>
          </View>
          <View style={stil.miniDonemPasif}>
            <Txt role="micro" tone={color.text3}>
              {t['ui.analysis.period_year']}
            </Txt>
          </View>
        </View>
      </View>

      {/* Zirve Vurgusu Rozeti */}
      <View style={stil.zirveRozet}>
        <Icon name="sparkles" size={14} color={color.primaryDeep} />
        <Txt role="micro" tone={color.primaryDeep} style={stil.kalin}>
          {haftaninGunleri[5]} · {paraYaz(142000)} ({t['ui.analysis.highest_day']})
        </Txt>
      </View>

      {/* SVG Çizgi Grafiği */}
      <View style={stil.svgKonteyner}>
        <Svg width="100%" height={96} viewBox="0 0 312 96" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="analizMockGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={color.primary} stopOpacity={0.24} />
              <Stop offset="100%" stopColor={color.primary} stopOpacity={0.01} />
            </LinearGradient>
          </Defs>

          {/* Izgara Referans Çizgileri */}
          <Line x1="10" y1="16" x2="302" y2="16" stroke={color.line} strokeWidth="1" strokeDasharray="3 3" />
          <Line x1="10" y1="52" x2="302" y2="52" stroke={color.line} strokeWidth="1" strokeDasharray="3 3" />
          <Line x1="10" y1="88" x2="302" y2="88" stroke={color.line} strokeWidth="1" />

          {/* Alan Dolgusu ve Ana Trend Çizgisi */}
          <Path d={alanYolu} fill="url(#analizMockGrad)" />
          <Path
            d={cizgiYolu}
            fill="none"
            stroke={color.primaryDeep}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Noktalar */}
          {noktalar.map((p, i) => {
            const isPeak = i === 5;
            return (
              <G key={i}>
                {isPeak && <Circle cx={p.x} cy={p.y} r={7} fill={color.primarySoft} />}
                <Circle
                  cx={p.x}
                  cy={p.y}
                  r={isPeak ? 4 : 2.5}
                  fill={color.surface}
                  stroke={isPeak ? color.primaryDeep : color.primary}
                  strokeWidth={isPeak ? 2.5 : 1.5}
                />
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Gün Etiketleri */}
      <View style={stil.gunEtiketleriSatiri}>
        {haftaninGunleri.map((gun, i) => (
          <Txt
            key={i}
            role="micro"
            tone={i === 5 ? color.primaryText : color.text3}
            style={[stil.gunEtiket, i === 5 && stil.kalin]}>
            {gun}
          </Txt>
        ))}
      </View>

      <View style={{ height: rhythm.blockInCard }} />

      {/* Kategori Dağılım Çipleri */}
      <View style={stil.cipSatiri}>
        <View style={[stil.miniCip, { backgroundColor: catColor.mavi.soft }]}>
          <Icon name="shopping-basket" size={14} color={catColor.mavi.solid} />
          <Txt role="micro" tone={color.text}>
            {marketKat.ad} %42
          </Txt>
        </View>
        <View style={[stil.miniCip, { backgroundColor: catColor.lacivert.soft }]}>
          <Icon name="coffee" size={14} color={catColor.lacivert.solid} />
          <Txt role="micro" tone={color.text}>
            {kafeKat.ad} %26
          </Txt>
        </View>
        <View style={[stil.miniCip, { backgroundColor: catColor.yesil.soft }]}>
          <Icon name="utensils" size={14} color={catColor.yesil.solid} />
          <Txt role="micro" tone={color.text}>
            {restoranKat.ad} %18
          </Txt>
        </View>
        <View style={[stil.miniCip, { backgroundColor: catColor.duman.soft }]}>
          <Icon name="circle-dashed" size={14} color={catColor.duman.solid} />
          <Txt role="micro" tone={color.text}>
            %14
          </Txt>
        </View>
      </View>
    </View>
  );
}

function TasarrufOnizleme() {
  const kafeKat = kategori('kafe');
  const restoranKat = kategori('restoran');
  const ulasimKat = kategori('ulasim');

  // Birikim artış eğrisi (Cumulative Savings curve: ₺450 -> ₺1.200 -> ₺2.350 -> ₺3.400 -> ₺4.650)
  const tasarrufCizgi =
    'M 18 76 C 42 76, 48 62, 72 62 C 96 62, 102 46, 126 46 C 150 46, 156 32, 180 32 C 204 32, 210 22, 234 22 C 258 22, 268 14, 294 14';
  const tasarrufAlan = `${tasarrufCizgi} L 294 88 L 18 88 Z`;

  const noktalar = [
    { x: 18, y: 76 },
    { x: 72, y: 62 },
    { x: 126, y: 46 },
    { x: 180, y: 32 },
    { x: 234, y: 22 },
    { x: 294, y: 14 }, // Son durum (Bugün)
  ];

  const zamanEtiketleri = [
    `1. ${t['ui.analysis.period_week']}`,
    `2. ${t['ui.analysis.period_week']}`,
    `3. ${t['ui.analysis.period_week']}`,
    `4. ${t['ui.analysis.period_week']}`,
    t['tarih.bugun'],
  ];

  return (
    <View style={stil.onizlemeKarti}>
      {/* Kart Üst Barı: Başlık + Canlı Rozet */}
      <View style={stil.onizlemeBaslikSatiri}>
        <View style={stil.onizlemeSol}>
          <Icon name="landmark" size={16} color={color.successInk} />
          <Txt role="label" tone={color.text2} numberOfLines={1} style={stil.esnek}>
            {t['premium.kilit.tasarruf.onizleme_baslik']}
          </Txt>
        </View>
        <View style={stil.canliEtiket}>
          <View style={stil.canliNokta} />
          <Txt role="micro" tone={color.primaryText}>
            {t['premium.kilit.onizleme']}
          </Txt>
        </View>
      </View>

      {/* Net Birikim Tutarı & Hedef Bilgisi */}
      <View style={stil.tasarrufIlerlemeSatiri}>
        <View style={stil.esnek}>
          <Txt role="caption" tone={color.text3}>
            {t['ui.savings.overview']}
          </Txt>
          <Txt role="h1" tone={color.successInk}>
            +{paraYaz(465000)}
          </Txt>
        </View>
        <View style={stil.oranKutusu}>
          <Icon name="shield-check" size={14} color={color.success} />
          <Txt role="label" tone={color.successInk} style={stil.kalin}>
            {metin('cumle.ozetPay', { oran: 78 })}
          </Txt>
        </View>
      </View>

      <View style={{ height: rhythm.sameObject }} />

      {/* Hedef İlerleme Çubuğu */}
      <View style={stil.progressRay}>
        <View style={[stil.progressDolgu, { width: '78%' }]} />
      </View>
      <View style={stil.hedefAltMetni}>
        <Txt role="micro" tone={color.text3}>
          {t['premium.kilit.tasarruf.hedef']}: {paraYaz(600000)}
        </Txt>
        <Txt role="micro" tone={color.successInk} style={stil.kalin}>
          {metin('premium.kilit.tasarruf.bu_ay', { tutar: paraYaz(465000) })}
        </Txt>
      </View>

      <View style={{ height: rhythm.sameObject }} />

      {/* SVG Kümülatif Birikim Grafiği */}
      <View style={stil.svgKonteyner}>
        <Svg width="100%" height={96} viewBox="0 0 312 96" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="tasarrufMockGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={color.success} stopOpacity={0.28} />
              <Stop offset="100%" stopColor={color.success} stopOpacity={0.01} />
            </LinearGradient>
          </Defs>

          {/* Izgara Çizgileri ve Hedef Hattı */}
          <Line x1="10" y1="14" x2="302" y2="14" stroke={color.warning} strokeWidth="1" strokeDasharray="4 3" />
          <Line x1="10" y1="50" x2="302" y2="50" stroke={color.line} strokeWidth="1" strokeDasharray="3 3" />
          <Line x1="10" y1="88" x2="302" y2="88" stroke={color.line} strokeWidth="1" />

          {/* Birikim Alanı ve Yükselen Çizgi */}
          <Path d={tasarrufAlan} fill="url(#tasarrufMockGrad)" />
          <Path
            d={tasarrufCizgi}
            fill="none"
            stroke={color.success}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Noktalar */}
          {noktalar.map((p, i) => {
            const isLast = i === noktalar.length - 1;
            return (
              <G key={i}>
                {isLast && <Circle cx={p.x} cy={p.y} r={7} fill={color.successSoft} />}
                <Circle
                  cx={p.x}
                  cy={p.y}
                  r={isLast ? 4 : 2.5}
                  fill={color.surface}
                  stroke={color.success}
                  strokeWidth={isLast ? 2.5 : 1.5}
                />
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Zaman Çizelgesi Etiketleri */}
      <View style={stil.gunEtiketleriSatiri}>
        {zamanEtiketleri.map((etiket, i) => (
          <Txt
            key={i}
            role="micro"
            tone={i === zamanEtiketleri.length - 1 ? color.successInk : color.text3}
            style={[stil.gunEtiket, i === zamanEtiketleri.length - 1 && stil.kalin]}>
            {etiket}
          </Txt>
        ))}
      </View>

      <View style={{ height: rhythm.blockInCard }} />

      {/* Rutin Tasarruf Çipleri */}
      <View style={stil.cipSatiri}>
        <View style={[stil.miniCip, { backgroundColor: catColor.lacivert.soft }]}>
          <Icon name="coffee" size={14} color={catColor.lacivert.solid} />
          <Txt role="micro" tone={color.text}>
            {kafeKat.ad}: +{paraYaz(95000)}
          </Txt>
        </View>
        <View style={[stil.miniCip, { backgroundColor: catColor.yesil.soft }]}>
          <Icon name="utensils" size={14} color={catColor.yesil.solid} />
          <Txt role="micro" tone={color.text}>
            {restoranKat.ad}: +{paraYaz(140000)}
          </Txt>
        </View>
        <View style={[stil.miniCip, { backgroundColor: catColor.mavi.soft }]}>
          <Icon name="bus" size={14} color={catColor.mavi.solid} />
          <Txt role="micro" tone={color.text}>
            {ulasimKat.ad}: +{paraYaz(68000)}
          </Txt>
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
          {t['premium.baslik'].toLocaleUpperCase(aktifEtiket())}
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
          {t['premium.kilit.guvence']}
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
  esnek: {
    flex: 1,
    minWidth: 0,
  },
  kalin: {
    fontWeight: '700',
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
    borderColor: color.line,
    boxShadow: clay.raised,
  },
  onizlemeBaslikSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: rhythm.group,
    marginBottom: rhythm.blockInCard,
  },
  onizlemeSol: {
    flex: 1,
    minWidth: 0,
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
  metrikSatiri: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: rhythm.group,
    marginBottom: rhythm.sameObject,
  },
  miniDonemKutusu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.groove,
    borderRadius: radius.pill,
    padding: 3,
    gap: 2,
  },
  miniDonemAktif: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    boxShadow: clay.pressed,
  },
  miniDonemPasif: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  zirveRozet: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: color.primarySoft,
    marginBottom: rhythm.sameObject,
  },
  svgKonteyner: {
    width: '100%',
    height: 96,
    marginVertical: 4,
  },
  gunEtiketleriSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  gunEtiket: {
    textAlign: 'center',
    flex: 1,
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
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  tasarrufIlerlemeSatiri: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: rhythm.group,
  },
  oranKutusu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: color.successSoft,
  },
  progressRay: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: color.groove,
    overflow: 'hidden',
  },
  progressDolgu: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: color.success,
  },
  hedefAltMetni: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  guvence: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
