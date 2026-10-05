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
  const ustEtiket = limitli ? 'Günlük bütçe' : etiket;

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
          {ustEtiket}
        </Txt>
        <IconButton
          icon="chevron-right"
          accessibilityLabel={t['gunluk.sonraki_gun']}
          onPress={onSonraki}
          disabled={bugunMu}
        />
      </View>

      <View style={{ height: rhythm.group }} />

      {limitli ? (
        <GunlukCircleChart
          bugunMu={bugunMu}
          harcananKurus={harcananKurus}
          kalanKurus={kalanKurus}
          limitKurus={limitKurus}
          doluluk={doluluk}
          yuzde={yuzde}
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

      {limitli ? null : (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="body" tone={color.text2} style={stil.ortali}>
            {altMetin}
          </Txt>
        </>
      )}
    </View>
  );
}

const GRAFIK_BOYUT = 184;
const GRAFIK_YARICAP = 72;
const GRAFIK_CEVRE = 2 * Math.PI * GRAFIK_YARICAP;

function GunlukCircleChart({
  bugunMu,
  harcananKurus,
  kalanKurus,
  limitKurus,
  doluluk,
  yuzde,
  limitDisi,
}: {
  bugunMu: boolean;
  harcananKurus: number;
  kalanKurus: number;
  limitKurus: number;
  doluluk: number;
  yuzde: number;
  limitDisi: boolean;
}) {
  const kalanEtiketi = limitDisi ? 'Bütçe dışı' : 'Kalan';
  const kalanTutar = paraYaz(Math.abs(kalanKurus));
  const vurgu = limitDisi ? color.warning : color.primary;
  const gunBaglami = bugunMu ? 'Bugünkü' : 'O günkü';
  const durumMetni = limitDisi
    ? `${gunBaglami} limitinin ${kalanTutar} üzerine çıktın.`
    : `${gunBaglami} limitinin yüzde ${yuzde} kadarı kullanıldı.`;

  return (
    <View
      style={stil.grafikAlan}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Harcanan ${paraYaz(harcananKurus)}. ${kalanEtiketi} ${kalanTutar}`}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(doluluk * 100) }}>
      <View style={stil.grafikKabi}>
        <Svg width={GRAFIK_BOYUT} height={GRAFIK_BOYUT}>
          <Circle
            cx={GRAFIK_BOYUT / 2}
            cy={GRAFIK_BOYUT / 2}
            r={GRAFIK_YARICAP}
            fill="none"
            stroke={color.well}
            strokeWidth={16}
          />
          <Circle
            cx={GRAFIK_BOYUT / 2}
            cy={GRAFIK_BOYUT / 2}
            r={GRAFIK_YARICAP}
            fill="none"
            stroke={vurgu}
            strokeWidth={16}
            strokeLinecap="round"
            strokeDasharray={`${GRAFIK_CEVRE} ${GRAFIK_CEVRE}`}
            strokeDashoffset={GRAFIK_CEVRE * (1 - doluluk)}
            rotation={-90}
            origin={`${GRAFIK_BOYUT / 2}, ${GRAFIK_BOYUT / 2}`}
          />
        </Svg>
        <View style={stil.grafikMerkez}>
          <Txt role="caption" tone={color.text2}>{kalanEtiketi}</Txt>
          <Txt
            role="display"
            tone={limitDisi ? color.warningInk : color.text}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.65}>
            {kalanTutar}
          </Txt>
        </View>
      </View>

      <View style={stil.ozetSeridi}>
        <View style={stil.ozetHucre}>
          <View style={stil.ozetEtiketSatiri}>
            <View style={[stil.grafikNokta, { backgroundColor: vurgu }]} />
            <Txt role="caption" tone={color.text2}>Harcanan</Txt>
          </View>
          <Txt role="amount" numberOfLines={1} adjustsFontSizeToFit>{paraYaz(harcananKurus)}</Txt>
        </View>
        <View style={stil.ozetAyrac} />
        <View style={stil.ozetHucre}>
          <View style={stil.ozetEtiketSatiri}>
            <View style={[stil.grafikNokta, { backgroundColor: color.text3 }]} />
            <Txt role="caption" tone={color.text2}>Günlük limit</Txt>
          </View>
          <Txt role="amount" numberOfLines={1} adjustsFontSizeToFit>{paraYaz(limitKurus)}</Txt>
        </View>
      </View>

      <Txt role="caption" tone={limitDisi ? color.warningInk : color.text2} style={stil.ortali}>
        {durumMetni}
      </Txt>
    </View>
  );
}

const stil = StyleSheet.create({
  ustSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  tutarSatiri: { alignItems: 'center' },
  grafikAlan: { alignItems: 'center', width: '100%', gap: rhythm.blockInCard },
  grafikKabi: { width: GRAFIK_BOYUT, height: GRAFIK_BOYUT, alignItems: 'center', justifyContent: 'center' },
  grafikMerkez: { position: 'absolute', width: 132, alignItems: 'center', gap: rhythm.sameObject },
  ozetSeridi: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: color.well,
    borderRadius: radius.tile,
    paddingVertical: rhythm.blockInCard,
    paddingHorizontal: rhythm.pad,
  },
  ozetHucre: { flex: 1, minWidth: 0, gap: rhythm.sameObject },
  ozetEtiketSatiri: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
  ozetAyrac: { width: 1, backgroundColor: color.line, marginHorizontal: rhythm.pad },
  grafikNokta: { width: 8, height: 8, borderRadius: radius.pill },
  oluk: { height: 8, borderRadius: radius.pill, backgroundColor: color.well, overflow: 'hidden' },
  dolgu: { height: '100%', borderRadius: radius.pill },
  ortali: { textAlign: 'center' },
});
