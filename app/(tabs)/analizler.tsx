import { Fragment, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { CategoryIconBox } from '@/components/CategoryIconBox';
import { ErrorState } from '@/components/ErrorState';
import { PremiumKilidi } from '@/components/PremiumKilidi';
import { RevScreen, useRevLoad } from '@/components/RevScreen';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { harcamaAraligi } from '@/db/harcama';
import {
  analizAraligi,
  donemGeliriHesapla,
  grafikNoktalariOlustur,
  type AnalizDonemi,
  type GrafikNoktasi,
} from '@/lib/analiz';
import { aileRenkleri, kategori } from '@/lib/kategoriler';
import { paraYaz } from '@/lib/para';
import { budgetGet } from '@/lib/revApi';
import { gunAnahtari } from '@/lib/tarih';
import { useUyelik } from '@/lib/uyelik';
import { localeKodu } from '@/lib/yerellestirme';
import { color, layout, radius, rhythm } from '@/theme/tokens';
import { analizGiderPay, analizGelirPay, analizHalkaA11y, t } from '@/content/metinler';
import { useDil } from '@/i18n/useDil';

type KategoriOzeti = { kod: string; tutar: number; renk: string; pay: number; gelirYuku: number };
type AnalizVerisi = {
  donem: AnalizDonemi;
  baslik: string;
  gider: number;
  kategoriler: KategoriOzeti[];
  noktalar: GrafikNoktasi[];
};

const DONEMLER: AnalizDonemi[] = ['hafta', 'ay', 'yil'];
const DONEM_METNI: Record<AnalizDonemi, keyof typeof t> = {
  hafta: 'ui.analysis.period_week',
  ay: 'ui.analysis.period_month',
  yil: 'ui.analysis.period_year',
};

/** Analizler Premium'a özeldir; ücretsiz kullanıcı tanıtım ve kilit görür. */
export default function AnalizlerEkrani() {
  useDil();
  const uyelik = useUyelik();
  if (!uyelik.kilitli) return <AnalizlerIcerik />;
  const header = <View style={stil.header}>
    <View style={stil.esnek}>
      <Txt role="caption" tone={color.navMuted}>{t['premium.ayar.baslik']}</Txt>
      <Txt role="h2" tone="#FFFFFF">{t['ui.analysis.title']}</Txt>
    </View>
  </View>;
  return <RevScreen title={t['ui.analysis.title']} tab="analizler" header={header} contentGap={0}>
    <PremiumKilidi ozellik="analiz" hazir={uyelik.hazir} />
  </RevScreen>;
}

function AnalizlerIcerik() {
  useDil();
  const [donem, setDonem] = useState<AnalizDonemi>('hafta');
  const veri = useRevLoad(useCallback(async (): Promise<AnalizVerisi> => {
    const secim = analizAraligi(donem);
    const [harcamalar, butce] = await Promise.all([
      harcamaAraligi(gunAnahtari(secim.baslangic), gunAnahtari(secim.bitis)),
      budgetGet(),
    ]);
    const gider = harcamalar.reduce((toplam, harcama) => toplam + harcama.tutarKurus, 0);
    const gelir = donemGeliriHesapla(butce.butce?.gelir_kurus ?? 0, donem, secim.baslangic, secim.bitis);
    const toplamlar = new Map<string, number>();
    harcamalar.forEach((harcama) => toplamlar.set(harcama.kategori, (toplamlar.get(harcama.kategori) ?? 0) + harcama.tutarKurus));
    const kategoriler = [...toplamlar.entries()].sort((a, b) => b[1] - a[1]).map(([kod, tutar]) => ({
      kod,
      tutar,
      renk: aileRenkleri(kategori(kod).aile).solid,
      pay: gider > 0 ? tutar / gider : 0,
      gelirYuku: gelir > 0 ? tutar / gelir : 0,
    }));
    return {
      donem,
      baslik: secim.baslik,
      gider,
      kategoriler,
      noktalar: grafikNoktalariOlustur(harcamalar, donem, secim.baslangic, secim.bitis),
    };
  }, [donem]));

  const header = <View style={stil.header}>
    <View style={stil.esnek}>
      <Txt role="caption" tone={color.navMuted}>{t['ui.analysis.expense_view']}</Txt>
      <Txt role="h2" tone="#FFFFFF">{t['ui.analysis.title']}</Txt>
    </View>
    <View style={stil.donemSecici} accessibilityRole="tablist">
      {DONEMLER.map((secenek) => (
        <Pressable
          key={secenek}
          onPress={() => setDonem(secenek)}
          accessibilityRole="tab"
          accessibilityState={{ selected: donem === secenek }}
          style={[stil.donem, donem === secenek && stil.donemAktif]}>
          <Txt role="micro" tone={donem === secenek ? color.text : color.navMuted}>{t[DONEM_METNI[secenek]]}</Txt>
        </Pressable>
      ))}
    </View>
  </View>;

  return <RevScreen title={t['ui.analysis.title']} tab="analizler" header={header} contentGap={0}>
    {veri.loading && !veri.data ? <AnalizIskeleti /> : veri.error ? <ErrorState baslik={t['ui.analysis.load_error']} govde={veri.error} onRetry={veri.reload} /> : veri.data ? <AnalizIcerigi veri={veri.data} /> : null}
  </RevScreen>;
}

function AnalizIcerigi({ veri }: { veri: AnalizVerisi }) {
  return <>
    <View style={stil.ustSatir}>
      <View>
        <Txt role="caption">{t['ui.analysis.selected_period']}</Txt>
        <Txt role="bodyStrong">{veri.baslik}</Txt>
      </View>
    </View>
    <View style={{ height: rhythm.section }} />
    <GiderGrafigi noktalar={veri.noktalar} gider={veri.gider} donem={veri.donem} />
    <View style={{ height: rhythm.section }} />
    <View style={stil.bolumBasligi}><View><Txt role="h2">{t['ui.analysis.category_distribution']}</Txt><Txt role="caption">{t['ui.analysis.expense_share']}</Txt></View></View>
    <View style={{ height: rhythm.pad }} />
    <View style={stil.halkaBolumu}>
      <Halka kategoriler={veri.kategoriler} toplam={veri.gider} />
      <View style={stil.halkaLejant}>
        {veri.kategoriler.slice(0, 5).map((kategoriOzeti) => (
          <View key={kategoriOzeti.kod} style={stil.lejantSatiri}>
            <View style={[stil.nokta, { backgroundColor: kategoriOzeti.renk }]} />
            <Txt role="caption" style={stil.esnek} numberOfLines={1}>{kategori(kategoriOzeti.kod).ad}</Txt>
            <Txt role="label">{new Intl.NumberFormat(localeKodu(), { style: 'percent', maximumFractionDigits: 0 }).format(kategoriOzeti.pay)}</Txt>
          </View>
        ))}
      </View>
    </View>
    <View style={{ height: rhythm.section }} />
    <View style={stil.bolumBasligi}><View><Txt role="h2">{t['ui.analysis.category_load']}</Txt><Txt role="caption">{t['ui.analysis.income_share']}</Txt></View></View>
    <View style={{ height: rhythm.group }} />
    {veri.kategoriler.length === 0 ? (
      <View style={stil.bos}><Txt role="bodyStrong">{t['ui.analysis.no_expenses']}</Txt><Txt role="caption">{t['ui.analysis.no_expenses_detail']}</Txt></View>
    ) : veri.kategoriler.map((kategoriOzeti, index) => (
      <Fragment key={kategoriOzeti.kod}>
        {index > 0 ? <View style={stil.ayrac} /> : null}
        <KategoriYuku item={kategoriOzeti} />
      </Fragment>
    ))}
  </>;
}

function GiderGrafigi({ noktalar, gider, donem }: { noktalar: GrafikNoktasi[]; gider: number; donem: AnalizDonemi }) {
  const gecerliNoktalar = noktalar.filter((nokta) => !nokta.gelecek);
  const enYuksek = gecerliNoktalar.reduce<GrafikNoktasi | null>((sonuc, nokta) => !sonuc || nokta.gider > sonuc.gider ? nokta : sonuc, null);
  const ortalama = Math.round(gider / Math.max(1, gecerliNoktalar.length));
  const birim = donem === 'yil' ? t['ui.analysis.frequency_month'] : t['ui.analysis.frequency_day'];
  const aciklama = t[donem === 'hafta' ? 'ui.analysis.graph_week' : donem === 'ay' ? 'ui.analysis.graph_month' : 'ui.analysis.graph_year'];
  const erisilebilirOzet = `${aciklama}. ${t['ui.analysis.total']} ${paraYaz(gider)}. ${birim} ${t['ui.analysis.average']} ${paraYaz(ortalama)}.`;
  const enYuksekEtiketi = donem === 'yil' ? t['ui.analysis.highest_month'] : t['ui.analysis.highest_day'];

  return <View style={stil.grafikKart} accessible accessibilityLabel={erisilebilirOzet}>
    <Txt role="caption">{aciklama}</Txt>
    <View style={{ height: rhythm.sameObject }} />
    <Txt role="display">{paraYaz(gider)}</Txt>
    <View style={{ height: rhythm.pad }} />
    {donem === 'ay' ? <CizgiGrafik noktalar={noktalar} /> : <CubukGrafik noktalar={noktalar} donem={donem} />}
    <View style={{ height: rhythm.pad }} />
    <View style={stil.istatistikSatiri}>
      <View style={stil.istatistik}>
        <Txt role="micro" tone={color.text2}>{enYuksekEtiketi}</Txt>
        <Txt role="label" numberOfLines={1}>{enYuksek && enYuksek.gider > 0 ? `${enYuksek.eksenEtiketi} · ${paraYaz(enYuksek.gider)}` : t['ui.analysis.no_spending']}</Txt>
      </View>
      <View style={stil.istatistikAyrac} />
      <View style={stil.istatistik}>
        <Txt role="micro" tone={color.text2}>{birim} {t['ui.analysis.average']}</Txt>
        <Txt role="label" numberOfLines={1}>{paraYaz(ortalama)}</Txt>
      </View>
    </View>
  </View>;
}

function CubukGrafik({ noktalar, donem }: { noktalar: GrafikNoktasi[]; donem: 'hafta' | 'yil' }) {
  const max = Math.max(1, ...noktalar.map((nokta) => nokta.gider));
  const enYuksek = Math.max(...noktalar.map((nokta) => nokta.gider));
  return <View style={[stil.cubukAlan, donem === 'yil' && stil.cubukAlanYil]} importantForAccessibility="no-hide-descendants">
    {noktalar.map((nokta) => {
      const yukseklik = nokta.gider === 0 ? 3 : Math.max(8, (nokta.gider / max) * 104);
      const zirve = nokta.gider > 0 && nokta.gider === enYuksek;
      return <View key={nokta.anahtar} style={stil.cubukKolon}>
        <View style={[stil.cubukYuvasi, donem === 'yil' && stil.cubukYuvasiYil]}>
          <View style={[
            stil.cubuk,
            donem === 'yil' && stil.cubukYil,
            { height: yukseklik, backgroundColor: nokta.gelecek ? color.line : zirve ? color.primaryDeep : color.primary },
          ]} />
        </View>
        {donem === 'hafta' ? (
          <View style={stil.gunEtiketi}>
            <Txt role="label" tone={zirve ? color.primaryText : color.text}>{nokta.eksenEtiketi.split(' ')[0]}</Txt>
            <Txt role="micro" tone={color.text2}>{nokta.etiket}</Txt>
          </View>
        ) : <Txt role="micro" tone={nokta.gelecek ? color.text3 : color.text2}>{nokta.etiket}</Txt>}
      </View>;
    })}
  </View>;
}

function CizgiGrafik({ noktalar }: { noktalar: GrafikNoktasi[] }) {
  const [genislik, setGenislik] = useState(0);
  const yukseklik = 144;
  const ust = 10;
  const alt = 128;
  const cizimGenisligi = Math.max(1, genislik);
  const max = Math.max(1, ...noktalar.map((nokta) => nokta.gider));
  const koordinatlar = noktalar.map((nokta, index) => ({
    x: noktalar.length === 1 ? 0 : (index / (noktalar.length - 1)) * cizimGenisligi,
    y: alt - (nokta.gider / max) * (alt - ust),
    gider: nokta.gider,
  }));
  const cizgi = koordinatlar.map((nokta, index) => `${index === 0 ? 'M' : 'L'} ${nokta.x} ${nokta.y}`).join(' ');
  const alan = `${cizgi} L ${cizimGenisligi} ${alt} L 0 ${alt} Z`;
  const etiketIndeksleri = [0, 7, 14, 21, 29];

  return <View importantForAccessibility="no-hide-descendants">
    <View style={stil.cizgiGrafik} onLayout={(olay) => setGenislik(Math.round(olay.nativeEvent.layout.width))}>
      {genislik > 0 ? (
        <Svg width="100%" height={yukseklik} viewBox={`0 0 ${cizimGenisligi} ${yukseklik}`}>
          <Defs>
            <LinearGradient id="harcamaAlani" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor={color.primary} stopOpacity="0.28" />
              <Stop offset="1" stopColor={color.primary} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>
          {[ust, (ust + alt) / 2, alt].map((y) => <Line key={y} x1="0" x2={cizimGenisligi} y1={y} y2={y} stroke={color.line} strokeWidth="1" />)}
          <Path d={alan} fill="url(#harcamaAlani)" />
          <Path d={cizgi} fill="none" stroke={color.primaryDeep} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {koordinatlar.map((nokta, index) => nokta.gider > 0 ? (
            <Circle key={noktalar[index].anahtar} cx={nokta.x} cy={nokta.y} r={nokta.gider === max ? 4 : 2.5} fill={color.surface} stroke={color.primaryDeep} strokeWidth="2" />
          ) : null)}
        </Svg>
      ) : null}
    </View>
    <View style={stil.cizgiEtiketleri}>
      {etiketIndeksleri.map((index) => <Txt key={noktalar[index].anahtar} role="micro" tone={color.text2}>{noktalar[index].eksenEtiketi}</Txt>)}
    </View>
  </View>;
}

function Halka({ kategoriler, toplam }: { kategoriler: KategoriOzeti[]; toplam: number }) {
  const cap = 132;
  const yariCap = 51;
  const cevre = 2 * Math.PI * yariCap;
  let offset = 0;
  return <View style={stil.halkaKap} accessibilityLabel={analizHalkaA11y(paraYaz(toplam))}>
    <Svg width={cap} height={cap} viewBox="0 0 132 132" accessibilityElementsHidden>
      <G rotation="-90" origin="66, 66">
        <Circle cx="66" cy="66" r={yariCap} stroke={color.groove} strokeWidth="14" fill="none" />
        {kategoriler.map((kategoriOzeti) => {
          const uzunluk = kategoriOzeti.pay * cevre;
          const baslangic = offset;
          offset += uzunluk;
          return <Circle key={kategoriOzeti.kod} cx="66" cy="66" r={yariCap} stroke={kategoriOzeti.renk} strokeWidth="14" fill="none" strokeDasharray={`${uzunluk} ${cevre - uzunluk}`} strokeDashoffset={-baslangic} />;
        })}
      </G>
    </Svg>
    <View style={stil.halkaMerkez}><Txt role="micro">{t['ui.analysis.total']}</Txt><Txt role="amount">{paraYaz(toplam)}</Txt></View>
  </View>;
}

function KategoriYuku({ item }: { item: KategoriOzeti }) {
  const kat = kategori(item.kod);
  return <View style={stil.kategoriSatiri}>
    <CategoryIconBox kategori={kat} />
    <View style={stil.kategoriOrta}>
      <View style={stil.ozetSatiri}><Txt role="bodyStrong" style={stil.esnek}>{kat.ad}</Txt><Txt role="amount">{paraYaz(item.tutar)}</Txt></View>
      <View style={stil.yukEtiketleri}><Txt role="caption">{analizGiderPay(Math.round(item.pay * 100))}</Txt><Txt role="label" tone={color.text2}>{analizGelirPay(Math.round(item.gelirYuku * 100))}</Txt></View>
    </View>
  </View>;
}

function AnalizIskeleti() {
  return <View style={{ gap: rhythm.pad }}><Skeleton width="55%" height={22} /><Skeleton width="100%" height={280} borderRadius={radius.tile} /><Skeleton width="45%" height={26} /><Skeleton width="100%" height={150} borderRadius={radius.tile} /></View>;
}

const stil = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: layout.headerPadTop, paddingHorizontal: layout.screenPaddingX, gap: rhythm.group },
  esnek: { flex: 1, minWidth: 0 },
  donemSecici: { flexDirection: 'row', backgroundColor: color.navGlassBg, borderRadius: radius.pill, padding: 4 },
  donem: { minHeight: 36, minWidth: 48, paddingHorizontal: rhythm.group, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  donemAktif: { backgroundColor: color.surface },
  ustSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: rhythm.group },
  grafikKart: { borderWidth: 1, borderColor: color.line, borderRadius: radius.card, padding: rhythm.pad, backgroundColor: color.surface },
  ozetSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: rhythm.group },
  nokta: { width: 8, height: 8, borderRadius: radius.pill },
  cubukAlan: { height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: rhythm.sameObject },
  cubukAlanYil: { gap: 2 },
  cubukKolon: { flex: 1, minWidth: 0, alignItems: 'center', gap: rhythm.sameObject },
  cubukYuvasi: { height: 104, width: 24, borderRadius: radius.pill, backgroundColor: color.groove, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  cubukYuvasiYil: { width: 14 },
  cubuk: { width: '100%', borderRadius: radius.pill },
  cubukYil: { minWidth: 10 },
  gunEtiketi: { alignItems: 'center' },
  cizgiGrafik: { height: 144, width: '100%' },
  cizgiEtiketleri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  istatistikSatiri: { flexDirection: 'row', alignItems: 'stretch', borderRadius: radius.tile, backgroundColor: color.groove, paddingVertical: rhythm.blockInCard, paddingHorizontal: rhythm.pad },
  istatistik: { flex: 1, minWidth: 0, gap: rhythm.sameObject },
  istatistikAyrac: { width: 1, backgroundColor: color.line, marginHorizontal: rhythm.pad },
  bolumBasligi: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  halkaBolumu: { flexDirection: 'row', alignItems: 'center', gap: rhythm.pad },
  halkaKap: { width: 132, height: 132, alignItems: 'center', justifyContent: 'center' },
  halkaMerkez: { position: 'absolute', alignItems: 'center' },
  halkaLejant: { flex: 1, gap: rhythm.group },
  lejantSatiri: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group, minHeight: 20 },
  kategoriSatiri: { flexDirection: 'row', alignItems: 'center', minHeight: 72, paddingVertical: rhythm.blockInCard },
  kategoriOrta: { flex: 1, minWidth: 0, marginLeft: rhythm.blockInCard },
  yukEtiketleri: { marginTop: rhythm.sameObject, flexDirection: 'row', justifyContent: 'space-between', gap: rhythm.group },
  ayrac: { height: 1, backgroundColor: color.line, marginLeft: 56 },
  bos: { backgroundColor: color.groove, borderRadius: radius.tile, padding: rhythm.pad, gap: rhythm.sameObject },
});
