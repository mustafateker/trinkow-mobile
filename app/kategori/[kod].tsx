import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { CategoryDetailRow } from '@/components/CategoryDetailRow';
import { CategoryIconBox } from '@/components/CategoryIconBox';
import { ClaySurface } from '@/components/ClaySurface';
import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { PushHeader } from '@/components/PushHeader';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import {
  kategoriAdet,
  kategoriBosBaslik,
  kategoriLimitDisi,
  kategoriLimitUst,
  kategoriOrtalama,
  t,
} from '@/content/metinler';
import { kategoriAyHarcamalari, kategoriAyOzeti, type Harcama } from '@/db/harcama';
import { tumKategoriLimitleri } from '@/db/limitler';
import { aileRenkleri, kategori } from '@/lib/kategoriler';
import { paraYaz, sayiyaCevir } from '@/lib/para';
import { ayBasligi, ayAnahtari, ayEkle } from '@/lib/tarih';
import { veriDegisimineAbone } from '@/lib/veriBus';
import { clay, color, layout, radius, rhythm, size } from '@/theme/tokens';

/**
 * E-15 · Kategori detayı. Referans: prototip-v3/08-kategori-detay.html.
 * Mood: "karne" — ölçüm nesnesi kategori çubuğu, sol sütun `DayBox`.
 */
export default function KategoriDetayEkrani() {
  const { kod } = useLocalSearchParams<{ kod: string }>();
  const kat = kategori(kod ?? 'market');
  const renk = aileRenkleri(kat.aile);
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const [ayGosterge, setAyGosterge] = useState(() => new Date());
  const ay = useMemo(() => ayAnahtari(ayGosterge), [ayGosterge]);

  const [yukleniyor, setYukleniyor] = useState(true);
  const [skeletonGoster, setSkeletonGoster] = useState(false);
  const [hata, setHata] = useState(false);
  const [harcamalar, setHarcamalar] = useState<Harcama[]>([]);
  const [ozet, setOzet] = useState({ adet: 0, toplamKurus: 0 });
  const [limitKurus, setLimitKurus] = useState<number | null>(null);

  const oku = useCallback(async () => {
    setYukleniyor(true);
    setHata(false);
    try {
      const [liste, ozetSonuc, limitler] = await Promise.all([
        kategoriAyHarcamalari(db, kat.kod, ay),
        kategoriAyOzeti(db, kat.kod, ay),
        tumKategoriLimitleri(db),
      ]);
      setHarcamalar(liste);
      setOzet(ozetSonuc);
      setLimitKurus(limitler[kat.kod] ?? null);
    } catch {
      setHata(true);
    } finally {
      setYukleniyor(false);
    }
  }, [db, ay, kat.kod]);

  useEffect(() => {
    void oku();
  }, [oku]);

  useEffect(() => veriDegisimineAbone(() => void oku()), [oku]);

  useEffect(() => {
    if (!yukleniyor) {
      setSkeletonGoster(false);
      return;
    }
    const zamanlayici = setTimeout(() => setSkeletonGoster(true), 150);
    return () => clearTimeout(zamanlayici);
  }, [yukleniyor]);

  const ayDegistir = (fark: number) => setAyGosterge((d) => ayEkle(d, fark));

  const limitDisi = limitKurus !== null && ozet.toplamKurus > limitKurus;
  const anaOran =
    limitKurus && limitKurus > 0
      ? limitDisi
        ? limitKurus / Math.max(ozet.toplamKurus, limitKurus)
        : Math.min(ozet.toplamKurus / limitKurus, 1)
      : 0;
  const tasmaOran =
    limitDisi && limitKurus ? (ozet.toplamKurus - limitKurus) / Math.max(ozet.toplamKurus, limitKurus) : 0;

  const gunSayisi = ay === ayAnahtari(new Date()) ? new Date().getDate() : new Date(Number(ay.slice(0, 4)), Number(ay.slice(5, 7)), 0).getDate();
  const gunlukOrtalamaKurus = gunSayisi > 0 ? Math.round(ozet.toplamKurus / gunSayisi) : 0;

  // Satırlar en yeniden eskiye sıralı; hangi kayıt(lar) ay limitini aşmaya
  // sebep oldu bulmak için KRONOLOJİK yürüyen toplam gerekir (E-10 ile aynı yöntem).
  const limitDisiIdler = useMemo(() => {
    if (limitKurus === null) return new Set<string>();
    let yuruyenToplam = 0;
    const set = new Set<string>();
    for (const h of [...harcamalar].reverse()) {
      yuruyenToplam += h.tutarKurus;
      if (yuruyenToplam > limitKurus) set.add(h.id);
    }
    return set;
  }, [harcamalar, limitKurus]);

  return (
    <View style={stil.ekran}>
      <View style={{ height: insets.top, backgroundColor: color.navDark }} />
      <PushHeader baslik={kat.ad} onGeri={() => router.back()} />

      <FlatList
        style={stil.liste}
        contentContainerStyle={[stil.panel, stil.pad, { paddingBottom: layout.scrollPadBottom }]}
        showsVerticalScrollIndicator={false}
        data={skeletonGoster || hata ? [] : harcamalar}
        keyExtractor={(h) => String(h.id)}
        ListHeaderComponent={
          <>
            <AyDegistirici
              skeleton={skeletonGoster}
              baslik={ayBasligi(ay)}
              adet={kategoriAdet(ozet.adet)}
              onOnceki={() => ayDegistir(-1)}
              onSonraki={() => ayDegistir(1)}
            />
            <View style={{ height: rhythm.section }} />

            {skeletonGoster ? (
              <OzetSkeleton />
            ) : hata ? (
              <ErrorState onRetry={oku} />
            ) : (
              <ClaySurface level="raisedLg" borderRadius={radius.hero} style={stil.ozetKart}>
                <View style={stil.ustSatir}>
                  <CategoryIconBox kategori={kat} />
                  <View style={{ width: rhythm.blockInCard }} />
                  <View style={stil.esnek}>
                    <Txt role="label" tone={color.text2}>
                      {t['taksit.bu_ay_etiket']}
                    </Txt>
                    <View style={{ height: rhythm.sameObject }} />
                    <View style={stil.paraSatiri}>
                      <Txt role="display" tone={limitDisi ? color.warningInk : color.text}>
                        {sayiyaCevir(ozet.toplamKurus)}
                      </Txt>
                      <View style={{ width: rhythm.sameObject }} />
                      <Txt role="amount" tone={color.text2}>
                        ₺
                      </Txt>
                    </View>
                  </View>
                </View>

                {limitKurus !== null ? (
                  <>
                    <View style={{ height: rhythm.blockInCard }} />
                    <View style={stil.oluk}>
                      <View style={[stil.dolgu, { flexGrow: anaOran, backgroundColor: renk.solid }]} />
                      {tasmaOran > 0 ? (
                        <View style={[stil.dolgu, { flexGrow: tasmaOran, backgroundColor: color.warning }]} />
                      ) : null}
                      <View style={{ flexGrow: Math.max(0, 1 - anaOran - tasmaOran) }} />
                    </View>
                    <View style={{ height: rhythm.sameObject }} />
                    <View style={stil.aralik}>
                      <Txt role="caption">{t['kategori.bar_periyot']}</Txt>
                      {limitDisi ? (
                        <Txt role="label" tone={color.warningInk}>
                          {kategoriLimitDisi(paraYaz(ozet.toplamKurus - limitKurus))}
                        </Txt>
                      ) : (
                        <Txt role="label" tone={color.text2}>
                          {kategoriLimitUst(paraYaz(limitKurus))}
                        </Txt>
                      )}
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{ height: rhythm.blockInCard }} />
                    <Txt role="body">{t['kategori.limit_yok']}</Txt>
                    <View style={{ height: rhythm.blockInCard }} />
                    <Button
                      label={t['kategori.limit_ekle']}
                      variant="secondary"
                      auto
                      onPress={() => router.push('/limitler')}
                    />
                  </>
                )}

                <View style={{ height: rhythm.blockInCard }} />
                <View style={stil.aralik}>
                  <Txt role="caption">{kategoriOrtalama(paraYaz(gunlukOrtalamaKurus))}</Txt>
                  <Txt role="caption">{kategoriAdet(ozet.adet)}</Txt>
                </View>
              </ClaySurface>
            )}

            <View style={{ height: rhythm.section }} />
            {!skeletonGoster && !hata && ozet.adet > 0 ? (
              <>
                <View style={stil.bolumBasligi}>
                  <Txt role="h2">{t['kategori.liste_baslik']}</Txt>
                  <Txt role="label" tone={color.text2}>
                    {kategoriAdet(ozet.adet)}
                  </Txt>
                </View>
                <View style={{ height: rhythm.group }} />
              </>
            ) : null}

            {!skeletonGoster && !hata && ozet.adet === 0 ? (
              <KategoriBosDurumu kat={kat} renk={renk} />
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <View style={{ paddingBottom: rhythm.group }}>
            <CategoryDetailRow
              harcama={item}
              limitDisi={limitDisiIdler.has(item.id)}
              onPress={() => router.push(`/harcama/${item.id}`)}
            />
          </View>
        )}
      />
    </View>
  );
}

function AyDegistirici({
  skeleton,
  baslik,
  adet,
  onOnceki,
  onSonraki,
}: {
  skeleton: boolean;
  baslik: string;
  adet: string;
  onOnceki: () => void;
  onSonraki: () => void;
}) {
  return (
    <ClaySurface level="sunken" borderRadius={radius.tile} style={stil.aySarma}>
      {skeleton ? (
        <View style={stil.aySatiri}>
          <Skeleton width={44} height={44} borderRadius={radius.pill} />
          <View style={stil.ayOrta}>
            <Skeleton width={104} height={20} />
            <View style={{ height: rhythm.sameObject }} />
            <Skeleton width={72} height={16} />
          </View>
          <Skeleton width={44} height={44} borderRadius={radius.pill} />
        </View>
      ) : (
        <View style={stil.aySatiri}>
          <IconButton icon="chevron-left" accessibilityLabel="Önceki ay" onPress={onOnceki} />
          <View style={stil.ayOrta}>
            <Txt role="bodyStrong">{baslik}</Txt>
            <View style={{ height: rhythm.sameObject }} />
            <Txt role="caption" tone={color.text2}>
              {adet}
            </Txt>
          </View>
          <IconButton icon="chevron-right" accessibilityLabel="Sonraki ay" onPress={onSonraki} />
        </View>
      )}
    </ClaySurface>
  );
}

function OzetSkeleton() {
  return (
    <ClaySurface level="raisedLg" borderRadius={radius.hero} style={stil.ozetKart}>
      <View style={stil.ustSatir}>
        <Skeleton width={44} height={44} borderRadius={radius.tile} />
        <View style={[stil.esnek, { marginLeft: rhythm.blockInCard }]}>
          <Skeleton width={52} height={18} />
          <View style={{ height: rhythm.sameObject }} />
          <Skeleton width={136} height={38} />
        </View>
      </View>
      <View style={{ height: rhythm.blockInCard }} />
      <Skeleton width="100%" height={12} borderRadius={radius.pill} />
      <View style={{ height: rhythm.sameObject }} />
      <Skeleton width={148} height={18} />
      <View style={{ height: rhythm.blockInCard }} />
      <Skeleton width={196} height={18} />
    </ClaySurface>
  );
}

function KategoriBosDurumu({ kat, renk }: { kat: ReturnType<typeof kategori>; renk: { solid: string; soft: string } }) {
  return (
    <ClaySurface level="raisedLg" borderRadius={radius.hero} style={stil.bosKart}>
      <View style={stil.bosDisk}>
        <CategoryIconBox kategori={kat} />
      </View>
      <View style={{ height: rhythm.blockInCard }} />
      <Txt role="h2">{kategoriBosBaslik(kat.ad)}</Txt>
      <View style={{ height: rhythm.group }} />
      <Txt role="body" style={stil.ortaMetin}>
        {t['kategori.bos_govde']}
      </Txt>
    </ClaySurface>
  );
}

const stil = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: color.navDark },
  liste: { flex: 1 },
  panel: {
    flexGrow: 1,
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    paddingTop: rhythm.section,
  },
  pad: { paddingHorizontal: layout.screenPaddingX },
  aySarma: { padding: rhythm.pad },
  aySatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ayOrta: { alignItems: 'center' },
  ozetKart: { padding: rhythm.pad },
  ustSatir: { flexDirection: 'row', alignItems: 'center' },
  esnek: { flex: 1, minWidth: 0 },
  paraSatiri: { flexDirection: 'row', alignItems: 'baseline' },
  aralik: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  oluk: {
    flexDirection: 'row',
    height: size.catBarHeight,
    borderRadius: radius.pill,
    backgroundColor: color.groove,
    boxShadow: clay.sunken,
    overflow: 'hidden',
  },
  dolgu: { height: size.catBarHeight, borderRadius: radius.pill, flexBasis: 0 },
  bolumBasligi: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bosKart: { padding: rhythm.pad, alignItems: 'center' },
  bosDisk: {
    width: 176,
    height: 176,
    borderRadius: radius.pill,
    backgroundColor: color.groove,
    boxShadow: clay.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ortaMetin: { textAlign: 'center' },
});
