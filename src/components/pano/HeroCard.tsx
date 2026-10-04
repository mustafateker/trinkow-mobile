import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { IconButton } from '@/components/IconButton';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { paraYaz } from '@/lib/para';
import { color, radius, rhythm } from '@/theme/tokens';

/**
 * Günlük özet (tasarım kiti §7.3): etiket + tek büyük tutar + ince ilerleme
 * çubuğu + tek cümle. Bugün büyük tutar KALAN'dır; limitsiz gün ve geçmiş
 * günlerde HARCANAN'dır. Limit aşımında kalan sıfıra sıkıştırılmaz, negatif
 * ve uyarı renginde gösterilir.
 */
type Props = {
  gunFarki: number;
  harcananKurus: number;
  limitKurus: number | null;
  oncekiPasif: boolean;
  onOnceki: () => void;
  onSonraki: () => void;
  altMetin: string;
};

export function HeroCard({ gunFarki, harcananKurus, limitKurus, oncekiPasif, onOnceki, onSonraki, altMetin }: Props) {
  const bugunMu = gunFarki === 0;
  const limitli = limitKurus !== null && limitKurus > 0;
  const limitDisi = limitKurus !== null && harcananKurus > limitKurus;
  const kalanGoster = bugunMu && limitKurus !== null;

  const etiket = kalanGoster
    ? limitDisi
      ? t['pano.hero.limit_disi']
      : t['pano.hero.takip']
    : bugunMu
      ? t['pano.hero.limitsiz']
      : t['gunluk.hero.gecmis'];
  const tutarKurus = kalanGoster ? limitKurus - harcananKurus : harcananKurus;

  const oran = limitli ? harcananKurus / limitKurus : 0;
  const doluluk = Math.min(Math.max(oran, 0), 1);
  const yuzde = Math.max(0, Math.round(oran * 100));
  const a11yDeger = limitli ? `Limitin yüzde ${yuzde} kadarı kullanıldı` : `${paraYaz(harcananKurus)} harcandı`;
  const kalanKurus = limitKurus !== null ? limitKurus - harcananKurus : 0;

  return (
    <View>
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

      <View style={{ height: rhythm.group }} />

      {bugunMu && limitli ? (
        <GunlukCircleChart
          harcananKurus={harcananKurus}
          kalanKurus={kalanKurus}
          doluluk={doluluk}
          limitDisi={limitDisi}
        />
      ) : (
        <>
          <View style={stil.tutarSatiri} accessible accessibilityLabel={`${etiket} ${paraYaz(tutarKurus)}`}>
            <Txt role="hero" tone={limitDisi && bugunMu ? color.warningInk : color.text} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
              {paraYaz(tutarKurus)}
            </Txt>
          </View>

          {limitli ? (
            <>
              <View style={{ height: rhythm.blockInCard }} />
              <View
                style={stil.oluk}
                accessible
                accessibilityRole="progressbar"
                accessibilityLabel={a11yDeger}
                accessibilityValue={{ min: 0, max: limitKurus, now: Math.min(harcananKurus, limitKurus) }}>
                <View style={[stil.dolgu, { width: `${doluluk * 100}%`, backgroundColor: limitDisi ? color.warning : color.primary }]} />
              </View>
            </>
          ) : null}
        </>
      )}

      <View style={{ height: rhythm.group }} />

      <Txt role="body" tone={color.text2} style={stil.ortali}>
        {altMetin}
      </Txt>
    </View>
  );
}

const GRAFIK_BOYUT = 152;
const GRAFIK_YARICAP = 60;
const GRAFIK_CEVRE = 2 * Math.PI * GRAFIK_YARICAP;

function GunlukCircleChart({
  harcananKurus,
  kalanKurus,
  doluluk,
  limitDisi,
}: {
  harcananKurus: number;
  kalanKurus: number;
  doluluk: number;
  limitDisi: boolean;
}) {
  const kalanEtiketi = limitDisi ? 'Bütçe dışı' : 'Kalan';
  const kalanTutar = paraYaz(Math.abs(kalanKurus));
  const vurgu = limitDisi ? color.warning : color.primary;

  return (
    <View
      style={stil.grafikSatiri}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Harcanan ${paraYaz(harcananKurus)}. ${kalanEtiketi} ${kalanTutar}`}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(doluluk * 100) }}>
      <View style={stil.grafikKabı}>
        <Svg width={GRAFIK_BOYUT} height={GRAFIK_BOYUT}>
          <Circle
            cx={GRAFIK_BOYUT / 2}
            cy={GRAFIK_BOYUT / 2}
            r={GRAFIK_YARICAP}
            fill="none"
            stroke={color.well}
            strokeWidth={14}
          />
          <Circle
            cx={GRAFIK_BOYUT / 2}
            cy={GRAFIK_BOYUT / 2}
            r={GRAFIK_YARICAP}
            fill="none"
            stroke={vurgu}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${GRAFIK_CEVRE} ${GRAFIK_CEVRE}`}
            strokeDashoffset={GRAFIK_CEVRE * (1 - doluluk)}
            rotation={-90}
            origin={`${GRAFIK_BOYUT / 2}, ${GRAFIK_BOYUT / 2}`}
          />
        </Svg>
        <View style={stil.grafikMerkez}>
          <Txt role="caption" tone={color.text2}>{kalanEtiketi}</Txt>
          <Txt role="amount" tone={limitDisi ? color.warningInk : color.text} numberOfLines={1} adjustsFontSizeToFit>
            {kalanTutar}
          </Txt>
        </View>
      </View>

      <View style={stil.grafikOzet}>
        <View style={stil.grafikDeger}>
          <View style={[stil.grafikNokta, { backgroundColor: vurgu }]} />
          <View style={stil.grafikMetin}>
            <Txt role="caption" tone={color.text2}>Harcanan</Txt>
            <Txt role="amount" numberOfLines={1} adjustsFontSizeToFit>{paraYaz(harcananKurus)}</Txt>
          </View>
        </View>
        <View style={stil.grafikDeger}>
          <View style={[stil.grafikNokta, { backgroundColor: color.well }]} />
          <View style={stil.grafikMetin}>
            <Txt role="caption" tone={color.text2}>{kalanEtiketi}</Txt>
            <Txt role="amount" tone={limitDisi ? color.warningInk : color.text} numberOfLines={1} adjustsFontSizeToFit>
              {kalanTutar}
            </Txt>
          </View>
        </View>
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  ustSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  tutarSatiri: { alignItems: 'center' },
  grafikSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rhythm.pad },
  grafikKabı: { width: GRAFIK_BOYUT, height: GRAFIK_BOYUT, alignItems: 'center', justifyContent: 'center' },
  grafikMerkez: { position: 'absolute', width: 104, alignItems: 'center', gap: 4 },
  grafikOzet: { flex: 1, maxWidth: 152, gap: rhythm.pad },
  grafikDeger: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
  grafikNokta: { width: 12, height: 12, borderRadius: radius.pill },
  grafikMetin: { flex: 1, minWidth: 0 },
  oluk: { height: 8, borderRadius: radius.pill, backgroundColor: color.well, overflow: 'hidden' },
  dolgu: { height: '100%', borderRadius: radius.pill },
  ortali: { textAlign: 'center' },
});
