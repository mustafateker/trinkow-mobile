import { useSQLiteContext } from 'expo-sqlite';
import { Fragment, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { CategoryIconBox } from '@/components/CategoryIconBox';
import { ErrorState } from '@/components/ErrorState';
import { RevScreen, useRevLoad } from '@/components/RevScreen';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { harcamaAraligi, type Harcama } from '@/db/harcama';
import { aileRenkleri, kategori } from '@/lib/kategoriler';
import { paraYaz } from '@/lib/para';
import { budgetGet } from '@/lib/revApi';
import { ayGunSayisi, gunAnahtari, kisaTarih } from '@/lib/tarih';
import { color, layout, radius, rhythm } from '@/theme/tokens';

type Donem = 'hafta' | 'ay' | 'yil';
type KategoriOzeti = { kod: string; tutar: number; renk: string; pay: number; gelirYuku: number };
type Cubuk = { etiket: string; gider: number };
type AnalizVerisi = {
  baslik: string;
  gider: number;
  kategoriler: KategoriOzeti[];
  cubuklar: Cubuk[];
};

const DONEMLER: { key: Donem; label: string }[] = [
  { key: 'hafta', label: 'Hafta' },
  { key: 'ay', label: 'Ay' },
  { key: 'yil', label: 'Yıl' },
];

function gunBaslangici(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
}

function aralik(donem: Donem, simdi = new Date()) {
  const bitis = gunBaslangici(simdi);
  if (donem === 'hafta') {
    const baslangic = new Date(bitis);
    baslangic.setDate(bitis.getDate() - ((bitis.getDay() + 6) % 7));
    return { baslangic, bitis, baslik: `${kisaTarih(baslangic)} – ${kisaTarih(bitis)}` };
  }
  if (donem === 'ay') {
    const baslangic = new Date(bitis.getFullYear(), bitis.getMonth(), 1, 12);
    return { baslangic, bitis, baslik: bitis.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) };
  }
  const baslangic = new Date(bitis.getFullYear(), 0, 1, 12);
  return { baslangic, bitis, baslik: `${bitis.getFullYear()} yılı` };
}

function gunSayisi(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000) + 1;
}

function gelirHesapla(aylik: number, donem: Donem, baslangic: Date, bitis: Date) {
  if (donem === 'ay') return aylik;
  if (donem === 'yil') return aylik * 12;
  return Math.round((aylik / ayGunSayisi(`${bitis.getFullYear()}-${String(bitis.getMonth() + 1).padStart(2, '0')}`)) * gunSayisi(baslangic, bitis));
}

function cubuklariOlustur(harcamalar: Harcama[], donem: Donem, baslangic: Date, bitis: Date): Cubuk[] {
  if (donem === 'hafta') {
    const gunler = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];
    return gunler.map((etiket, i) => {
      const d = new Date(baslangic); d.setDate(d.getDate() + i);
      return { etiket, gider: harcamalar.filter((h) => h.gun === gunAnahtari(d)).reduce((t, h) => t + h.tutarKurus, 0) };
    });
  }
  if (donem === 'ay') {
    const dilimler = [1, 8, 15, 22];
    return dilimler.map((ilk, i) => {
      const son = i === 3 ? bitis.getDate() : Math.min(ilk + 6, bitis.getDate());
      const gider = harcamalar.filter((h) => Number(h.gun.slice(8, 10)) >= ilk && Number(h.gun.slice(8, 10)) <= son).reduce((t, h) => t + h.tutarKurus, 0);
      return { etiket: `${i + 1}. hf.`, gider };
    });
  }
  const aylar = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  return aylar.map((etiket, ay) => ({
    etiket,
    gider: harcamalar.filter((h) => Number(h.gun.slice(5, 7)) === ay + 1).reduce((t, h) => t + h.tutarKurus, 0),
  }));
}

export default function AnalizlerEkrani() {
  const db = useSQLiteContext();
  const [donem, setDonem] = useState<Donem>('hafta');
  const veri = useRevLoad(useCallback(async (): Promise<AnalizVerisi> => {
    const secim = aralik(donem);
    const [harcamalar, butce] = await Promise.all([
      harcamaAraligi(db, gunAnahtari(secim.baslangic), gunAnahtari(secim.bitis)),
      budgetGet(),
    ]);
    const gider = harcamalar.reduce((t, h) => t + h.tutarKurus, 0);
    const gelir = gelirHesapla(butce.butce?.gelir_kurus ?? 0, donem, secim.baslangic, secim.bitis);
    const toplamlar = new Map<string, number>();
    harcamalar.forEach((h) => toplamlar.set(h.kategori, (toplamlar.get(h.kategori) ?? 0) + h.tutarKurus));
    const kategoriler = [...toplamlar.entries()].sort((a, b) => b[1] - a[1]).map(([kod, tutar]) => ({
      kod,
      tutar,
      renk: aileRenkleri(kategori(kod).aile).solid,
      pay: gider > 0 ? tutar / gider : 0,
      gelirYuku: gelir > 0 ? tutar / gelir : 0,
    }));
    return { baslik: secim.baslik, gider, kategoriler, cubuklar: cubuklariOlustur(harcamalar, donem, secim.baslangic, secim.bitis) };
  }, [db, donem]));

  const header = <View style={stil.header}>
    <View style={stil.esnek}>
      <Txt role="caption" tone={color.navMuted}>Gider görünümü</Txt>
      <Txt role="h2" tone="#FFFFFF">Analizler</Txt>
    </View>
    <View style={stil.donemSecici} accessibilityRole="tablist">
      {DONEMLER.map((d) => <Pressable key={d.key} onPress={() => setDonem(d.key)} accessibilityRole="tab" accessibilityState={{ selected: donem === d.key }} style={[stil.donem, donem === d.key && stil.donemAktif]}>
        <Txt role="micro" tone={donem === d.key ? color.text : color.navMuted}>{d.label}</Txt>
      </Pressable>)}
    </View>
  </View>;

  return <RevScreen title="Analizler" tab="analizler" header={header} contentGap={0}>
    {veri.loading && !veri.data ? <AnalizIskeleti /> : veri.error ? <ErrorState baslik="Analizler yüklenemedi" govde={veri.error} onRetry={veri.reload} /> : veri.data ? <AnalizIcerigi veri={veri.data} /> : null}
  </RevScreen>;
}

function AnalizIcerigi({ veri }: { veri: AnalizVerisi }) {
  return <>
    <View style={stil.ustSatir}>
      <View><Txt role="caption">Seçili dönem</Txt><Txt role="bodyStrong">{veri.baslik}</Txt></View>
    </View>
    <View style={{ height: rhythm.section }} />
    <GiderGrafigi cubuklar={veri.cubuklar} gider={veri.gider} />
    <View style={{ height: rhythm.section }} />
    <View style={stil.bolumBasligi}><View><Txt role="h2">Kategori dağılımı</Txt><Txt role="caption">Gider içindeki yüzdesel pay</Txt></View></View>
    <View style={{ height: rhythm.pad }} />
    <View style={stil.halkaBolumu}>
      <Halka kategoriler={veri.kategoriler} toplam={veri.gider} />
      <View style={stil.halkaLejant}>
        {veri.kategoriler.slice(0, 5).map((k) => <View key={k.kod} style={stil.lejantSatiri}><View style={[stil.nokta, { backgroundColor: k.renk }]} /><Txt role="caption" style={stil.esnek} numberOfLines={1}>{kategori(k.kod).ad}</Txt><Txt role="label">%{Math.round(k.pay * 100)}</Txt></View>)}
      </View>
    </View>
    <View style={{ height: rhythm.section }} />
    <View style={stil.bolumBasligi}><View><Txt role="h2">Kategori yükü</Txt><Txt role="caption">Gelirinin ne kadarını kullandı?</Txt></View></View>
    <View style={{ height: rhythm.group }} />
    {veri.kategoriler.length === 0 ? <View style={stil.bos}><Txt role="bodyStrong">Bu dönemde harcama yok.</Txt><Txt role="caption">Harcama eklediğinde kategori oranları burada görünür.</Txt></View> : veri.kategoriler.map((k, i) => <Fragment key={k.kod}>{i > 0 ? <View style={stil.ayrac} /> : null}<KategoriYuku item={k} /></Fragment>)}
  </>;
}

function GiderGrafigi({ cubuklar, gider }: { cubuklar: Cubuk[]; gider: number }) {
  const max = Math.max(1, ...cubuklar.map((c) => c.gider));
  return <View style={stil.grafikKart}>
    <View><Txt role="caption">Toplam gider</Txt><Txt role="h2">{paraYaz(gider)}</Txt></View>
    <View style={stil.cubukAlan}>{cubuklar.map((c) => <View key={c.etiket} style={stil.cubukKolon}><View style={stil.cubukYuvasi}><View style={[stil.cubuk, { height: c.gider === 0 ? 3 : Math.max(8, (c.gider / max) * 96) }]} /></View><Txt role="micro" tone={color.text2} numberOfLines={1}>{c.etiket}</Txt></View>)}</View>
  </View>;
}

function Halka({ kategoriler, toplam }: { kategoriler: KategoriOzeti[]; toplam: number }) {
  const cap = 124, r = 48, cevre = 2 * Math.PI * r;
  let offset = 0;
  return <View style={stil.halkaKap}><Svg width={cap} height={cap} viewBox="0 0 124 124"><G rotation="-90" origin="62, 62"><Circle cx="62" cy="62" r={r} stroke={color.groove} strokeWidth="16" fill="none" />{kategoriler.map((k) => { const uzunluk = k.pay * cevre; const baslangic = offset; offset += uzunluk; return <Circle key={k.kod} cx="62" cy="62" r={r} stroke={k.renk} strokeWidth="16" fill="none" strokeDasharray={`${uzunluk} ${cevre - uzunluk}`} strokeDashoffset={-baslangic} />; })}</G></Svg><View style={stil.halkaMerkez}><Txt role="micro">Toplam</Txt><Txt role="amount">{paraYaz(toplam)}</Txt></View></View>;
}

function KategoriYuku({ item }: { item: KategoriOzeti }) {
  const kat = kategori(item.kod);
  return <View style={stil.kategoriSatiri}><CategoryIconBox kategori={kat} /><View style={stil.kategoriOrta}><View style={stil.ozetSatiri}><Txt role="bodyStrong" style={stil.esnek}>{kat.ad}</Txt><Txt role="amount">{paraYaz(item.tutar)}</Txt></View><View style={stil.yukEtiketleri}><Txt role="caption">Giderin %{Math.round(item.pay * 100)}'i</Txt><Txt role="label" tone={color.text2}>Gelire yük %{Math.round(item.gelirYuku * 100)}</Txt></View></View></View>;
}

function AnalizIskeleti() { return <View style={{ gap: rhythm.pad }}><Skeleton width="55%" height={22} /><Skeleton width="100%" height={190} borderRadius={radius.tile} /><Skeleton width="45%" height={26} /><Skeleton width="100%" height={150} borderRadius={radius.tile} /></View>; }

const stil = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: layout.headerPadTop, paddingHorizontal: layout.screenPaddingX, gap: rhythm.group },
  esnek: { flex: 1, minWidth: 0 },
  donemSecici: { flexDirection: 'row', backgroundColor: color.navGlassBg, borderRadius: radius.pill, padding: 4 },
  donem: { minHeight: 36, minWidth: 48, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  donemAktif: { backgroundColor: '#FFFFFF' },
  ustSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: rhythm.group },
  grafikKart: { borderWidth: 1, borderColor: color.line, borderRadius: radius.tile, padding: rhythm.pad },
  ozetSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: rhythm.group },
  nokta: { width: 8, height: 8, borderRadius: 4 },
  cubukAlan: { height: 132, marginTop: rhythm.pad, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: rhythm.sameObject },
  cubukKolon: { flex: 1, minWidth: 0, alignItems: 'center', gap: 6 },
  cubukYuvasi: { height: 96, width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  cubuk: { width: 14, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: color.action },
  bolumBasligi: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  halkaBolumu: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  halkaKap: { width: 124, height: 124, alignItems: 'center', justifyContent: 'center' },
  halkaMerkez: { position: 'absolute', alignItems: 'center' },
  halkaLejant: { flex: 1, gap: 8 },
  lejantSatiri: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 20 },
  kategoriSatiri: { flexDirection: 'row', alignItems: 'center', minHeight: 72, paddingVertical: 12 },
  kategoriOrta: { flex: 1, minWidth: 0, marginLeft: 12 },
  yukEtiketleri: { marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  ayrac: { height: 1, backgroundColor: color.line, marginLeft: 56 },
  bos: { backgroundColor: color.groove, borderRadius: radius.tile, padding: rhythm.pad, gap: 4 },
});
