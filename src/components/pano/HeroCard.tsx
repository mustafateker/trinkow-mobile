import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { ClaySurface } from '@/components/ClaySurface';
import { IconButton } from '@/components/IconButton';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { paraYaz } from '@/lib/para';
import { color, gauge, radius, rhythm } from '@/theme/tokens';

/**
 * Günlük özet: solda harcanan, ortada dairesel limit kullanımı, sağda kalan.
 * Kalan değer limit aşımında sıfıra sıkıştırılmaz; negatif gösterilir.
 */
type Props = {
  gunFarki: number;
  harcananKurus: number;
  limitKurus: number | null;
  /** Bu günün hiç kaydı yok */
  bos: boolean;
  oncekiPasif: boolean;
  onOnceki: () => void;
  onSonraki: () => void;
  altMetin: string;
};

export function HeroCard({
  gunFarki,
  harcananKurus,
  limitKurus,
  bos,
  oncekiPasif,
  onOnceki,
  onSonraki,
  altMetin,
}: Props) {
  const bugunMu = gunFarki === 0;
  const limitDisi = limitKurus !== null && harcananKurus > limitKurus;
  const kalanKurus = limitKurus !== null ? limitKurus - harcananKurus : null;

  const etiket = limitKurus === null
    ? bugunMu
      ? t['pano.hero.limitsiz']
      : t['gunluk.hero.gecmis']
    : bugunMu
      ? limitDisi
        ? t['pano.hero.limit_disi']
        : t['pano.hero.takip']
      : t['gunluk.hero.gecmis'];

  return (
    <ClaySurface level="raised" borderRadius={radius.hero} style={stil.kart}>
      <View style={stil.ustSatir}>
        <IconButton
          icon="chevron-left"
          accessibilityLabel={t['gunluk.onceki_gun']}
          onPress={onOnceki}
          disabled={oncekiPasif}
        />
        <Txt role="label" tone={color.text2}>
          {etiket}
        </Txt>
        <IconButton
          icon="chevron-right"
          accessibilityLabel={t['gunluk.sonraki_gun']}
          onPress={onSonraki}
          disabled={bugunMu}
        />
      </View>

      <View style={{ height: rhythm.blockInCard }} />

      <View style={stil.ozetSatiri}>
        <OzetDegeri etiket="Harcanan" kurus={harcananKurus} />
        <KullanimHalkasi harcananKurus={harcananKurus} limitKurus={limitKurus} bos={bos} />
        <OzetDegeri etiket="Kalan" kurus={kalanKurus} uyari={limitDisi} />
      </View>

      <View style={{ height: rhythm.blockInCard }} />

      <Txt role="body" tone={color.text2}>
        {altMetin}
      </Txt>
    </ClaySurface>
  );
}

function OzetDegeri({ etiket, kurus, uyari = false }: { etiket: string; kurus: number | null; uyari?: boolean }) {
  return (
    <View style={stil.degerBlogu}>
      <Txt role="caption" tone={color.text2}>{etiket}</Txt>
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="amount" tone={uyari ? color.warningInk : color.text} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.65}>
        {kurus === null ? '—' : paraYaz(kurus)}
      </Txt>
    </View>
  );
}

function KullanimHalkasi({ harcananKurus, limitKurus, bos }: { harcananKurus: number; limitKurus: number | null; bos: boolean }) {
  const cap = gauge.summaryDiameter;
  const kalinlik = gauge.summaryTrackWidth;
  const yaricap = (cap - kalinlik * 2) / 2;
  const cevre = 2 * Math.PI * yaricap;
  const oran = limitKurus && limitKurus > 0 ? harcananKurus / limitKurus : 0;
  const doluluk = bos ? 0 : Math.min(Math.max(oran, 0), 1);
  const tasma = Math.min(Math.max(oran - 1, 0), 1);
  const yuzde = limitKurus && limitKurus > 0 ? Math.max(0, Math.round(oran * 100)) : null;

  return (
    <View
      style={stil.halka}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={limitKurus === null ? `Bugün ${paraYaz(harcananKurus)} harcandı` : `Limitin yüzde ${yuzde ?? 0} kadarı kullanıldı`}
      accessibilityValue={limitKurus === null ? undefined : { min: 0, max: limitKurus, now: harcananKurus }}>
      <Svg width={cap} height={cap} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Circle cx={cap / 2} cy={cap / 2} r={yaricap} fill="none" stroke={color.well} strokeWidth={kalinlik} />
        {doluluk > 0 ? (
          <Circle
            cx={cap / 2}
            cy={cap / 2}
            r={yaricap}
            fill="none"
            stroke={color.primary}
            strokeWidth={kalinlik}
            strokeLinecap="round"
            strokeDasharray={`${cevre * doluluk} ${cevre}`}
            rotation={-90}
            origin={`${cap / 2}, ${cap / 2}`}
          />
        ) : null}
        {tasma > 0 ? (
          <Circle
            cx={cap / 2}
            cy={cap / 2}
            r={cap / 2 - gauge.summaryOverWidth / 2}
            fill="none"
            stroke={color.warning}
            strokeWidth={gauge.summaryOverWidth}
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * cap * tasma} ${Math.PI * cap}`}
            rotation={-90}
            origin={`${cap / 2}, ${cap / 2}`}
          />
        ) : null}
      </Svg>
      <Txt role="h2" tone={tasma > 0 ? color.warningInk : color.text}>{yuzde === null ? '∞' : `%${yuzde}`}</Txt>
      <Txt role="micro" tone={color.text2}>{yuzde === null ? 'Limitsiz' : 'kullanıldı'}</Txt>
    </View>
  );
}

const stil = StyleSheet.create({
  kart: { width: '100%', padding: rhythm.pad },
  ustSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  ozetSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  degerBlogu: { flex: 1, minWidth: 0, alignItems: 'center' },
  halka: { width: gauge.summaryDiameter, height: gauge.summaryDiameter, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
