import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutAnimation, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Accordion } from '@/components/Accordion';
import { Button } from '@/components/Button';
import { CategoryIconBox } from '@/components/CategoryIconBox';
import { ClaySurface } from '@/components/ClaySurface';
import { ErrorState } from '@/components/ErrorState';
import { Icon } from '@/components/Icon';
import { InfoStrip } from '@/components/InfoStrip';
import { InstallmentSeriesRow } from '@/components/InstallmentSeriesRow';
import { MonthLoadRow, MonthLoadRowSkeleton } from '@/components/MonthLoadRow';
import { PushHeader } from '@/components/PushHeader';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import {
  a11yTaksitKategori,
  a11yTaksitSeri,
  a11yTaksitSeriSon,
  a11yTaksitTumunuGoster,
  t,
  taksitKalanToplam,
  taksitKategoriOzet,
  taksitOzetKategorili,
  taksitOzetTekKategori,
  taksitSeriBitti,
  taksitSeriBittiUrun,
  taksitUrunYok,
} from '@/content/metinler';
import {
  gecenAyBitenSeri,
  surenSeriler,
  taksitAylikYuk,
  taksitKalanToplamKurus,
  taksitSonAy,
  type SurenSeri,
} from '@/db/harcama';
import { useReduceMotion } from '@/lib/hareket';
import { aileRenkleri, kategori, TUM_KATEGORILER } from '@/lib/kategoriler';
import { paraYaz, sayiyaCevir } from '@/lib/para';
import {
  ayToplamLiraHesapla,
  enBuyukKategoriKodu,
  gorunenSatirlar,
  kalanAySayisiHesapla,
  kalanToplamGorunenKurus,
  kalanToplamHamYuvarla,
  kategoriKirilimiOlustur,
  KATEGORI_SATIR_SINIRI,
  tekKategoriMi,
  type KategoriGrubu,
  type UrunSatiri,
} from '@/lib/taksitKirilimi';
import { ayAdiTek, ayAnahtari, ayBasligi, ayEkle } from '@/lib/tarih';
import { veriDegisimineAbone } from '@/lib/veriBus';
import { clay, color, layout, motion, radius, rhythm } from '@/theme/tokens';

const GELECEK_AY_SAYISI = 6;

type Veri = {
  aylar: { ay: string; toplamKurus: number }[];
  kalanToplamKurus: number;
  sonAy: string | null;
  seriler: SurenSeri[];
  bitenSeri: { kategori: string; urunAdi: string | null; tutarKurus: number } | null;
};

/**
 * E-18 · Taksitler — kategori ve ürün bazlı kırılım (rev3-taksitler.md).
 * Sıra (K-T1): bu ay toplamı → kırılım (kategori → ürün) → önümüzdeki
 * aylar → biten seri şeridi. Ay seçici YOK (K-T0), ekran daima bu ayı
 * gösterir.
 */
export default function TaksitlerEkrani() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();

  const [yukleniyor, setYukleniyor] = useState(true);
  const [skeletonGoster, setSkeletonGoster] = useState(false);
  const [hata, setHata] = useState(false);
  const [veri, setVeri] = useState<Veri | null>(null);
  // §4.1/§4 hafıza — yalnız İLK yüklemede en büyük kategoriye açılır; sonraki
  // yeniden okumalarda kullanıcının açtığı/kapattığı durum korunur.
  const [acikKategoriler, setAcikKategoriler] = useState<Set<string> | null>(null);
  // §4.3 "Tümünü göster" — TEK yönlü, bir kez açılınca geri katlanmaz.
  const [tumunuGosterilen, setTumunuGosterilen] = useState<Set<string>>(new Set());

  const oku = useCallback(async () => {
    setYukleniyor(true);
    setHata(false);
    try {
      const bugun = new Date();
      const buAy = ayAnahtari(bugun);
      const buAyBaslangicGunu = `${buAy}-01`;
      const gecenAy = ayAnahtari(ayEkle(bugun, -1));
      const aySayisiler = Array.from({ length: GELECEK_AY_SAYISI }, (_, i) => ayAnahtari(ayEkle(bugun, i)));

      const [aylar, kalanToplamKurus, sonAy, seriler, bitenSeriKaydi] = await Promise.all([
        taksitAylikYuk(db, aySayisiler),
        taksitKalanToplamKurus(db, buAyBaslangicGunu),
        taksitSonAy(db, buAyBaslangicGunu),
        surenSeriler(db, buAy),
        gecenAyBitenSeri(db, gecenAy),
      ]);
      setVeri({ aylar, kalanToplamKurus, sonAy, seriler, bitenSeri: bitenSeriKaydi });
    } catch {
      setHata(true);
    } finally {
      setYukleniyor(false);
    }
  }, [db]);

  useEffect(() => {
    void oku();
  }, [oku]);

  useEffect(() => veriDegisimineAbone(() => void oku()), [oku]);

  useEffect(() => {
    if (!yukleniyor) {
      // Denetçi notu 2 (rev3-taksitler.md §4.2/Ö5) — tek kategoride bölüm
      // başlığı 25 → 44pt büyür, liste 19px aşağı oturur. Kabul edilmiş bir
      // davranış ama animasyonsuz bırakılmaz.
      if (!reduceMotion) {
        LayoutAnimation.configureNext(LayoutAnimation.create(motion.accordion, 'easeInEaseOut', 'opacity'));
      }
      setSkeletonGoster(false);
      return;
    }
    const zamanlayici = setTimeout(() => setSkeletonGoster(true), 150);
    return () => clearTimeout(zamanlayici);
  }, [yukleniyor, reduceMotion]);

  const gruplar = useMemo<KategoriGrubu[]>(
    () => (veri ? kategoriKirilimiOlustur(veri.seriler, TUM_KATEGORILER) : []),
    [veri],
  );

  useEffect(() => {
    if (acikKategoriler !== null || gruplar.length === 0) return;
    const buyuk = enBuyukKategoriKodu(gruplar);
    setAcikKategoriler(new Set(buyuk ? [buyuk] : []));
  }, [gruplar, acikKategoriler]);

  const buAy = ayAnahtari(new Date());
  const ayToplamKurus = ayToplamLiraHesapla(gruplar) * 100;
  const kalanAy = veri?.sonAy ? kalanAySayisiHesapla(buAy, veri.sonAy) : 0;
  const kalanToplamKurusGorunen = veri
    ? (kalanToplamGorunenKurus({ aylarKurus: veri.aylar.map((a) => a.toplamKurus), kalanAySayisi: kalanAy }) ??
      kalanToplamHamYuvarla(veri.kalanToplamKurus))
    : 0;

  const maxAyToplami = useMemo(
    () => Math.max(1, ...(veri?.aylar.map((a) => a.toplamKurus) ?? [1])),
    [veri],
  );

  function kategoriAc(kod: string) {
    setAcikKategoriler((onceki) => {
      const sonraki = new Set(onceki ?? []);
      if (sonraki.has(kod)) sonraki.delete(kod);
      else sonraki.add(kod);
      return sonraki;
    });
  }

  function tumunuAc(kod: string) {
    setTumunuGosterilen((onceki) => new Set(onceki).add(kod));
  }

  function satiraGit(id: string) {
    router.push(`/harcama/${id}`);
  }

  const bosMu = !skeletonGoster && !hata && veri !== null && veri.seriler.length === 0;

  return (
    <View style={stil.ekran}>
      <View style={{ height: insets.top, backgroundColor: color.navDark }} />
      <PushHeader baslik={t['taksit.baslik']} onGeri={() => router.back()} />

      <ScrollView style={stil.kaydir} contentContainerStyle={stil.scrollIcerik} showsVerticalScrollIndicator={false}>
        <View style={[stil.panel, stil.pad, { paddingBottom: layout.scrollPadBottom }]}>
        {skeletonGoster ? (
          <Skeletonlar />
        ) : hata ? (
          <ErrorState onRetry={oku} baslik={t['hata.okuma.taksit']} />
        ) : bosMu ? (
          <BosDurum />
        ) : veri ? (
          <>
            <ClaySurface level="raisedLg" borderRadius={radius.hero} style={stil.kart}>
              <Txt role="label" tone={color.text2}>
                {t['taksit.bu_ay_etiket']}
              </Txt>
              <View style={{ height: rhythm.sameObject }} />
              <View style={stil.paraSatiri}>
                <Txt role="display">{sayiyaCevir(ayToplamKurus)}</Txt>
                <View style={{ width: rhythm.sameObject }} />
                <Txt role="amount" tone={color.text2}>
                  ₺
                </Txt>
              </View>
              <View style={{ height: rhythm.blockInCard }} />
              <Txt role="caption">{t['taksit.aciklama']}</Txt>
            </ClaySurface>

            {gruplar.length > 0 && !tekKategoriMi(gruplar) ? (
              <>
                <View style={{ height: rhythm.section }} />
                <View style={stil.bolumBasligi}>
                  <Txt role="h2">{t['taksit.seriler_baslik']}</Txt>
                  <Txt role="label" tone={color.text2}>
                    {taksitOzetKategorili(
                      gruplar.length,
                      gruplar.reduce((toplam, g) => toplam + g.urunSayisi, 0),
                    )}
                  </Txt>
                </View>
                <View style={{ height: rhythm.group }} />
                {gruplar.map((grup, i) => {
                  const kat = kategori(grup.kategoriKodu);
                  const acik = acikKategoriler?.has(grup.kategoriKodu) ?? false;
                  const tutar = paraYaz(grup.toplamLira * 100);
                  return (
                    <View key={grup.kategoriKodu}>
                      {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                      <Accordion
                        title={kat.ad}
                        leading={<CategoryIconBox kategori={kat} />}
                        summary={taksitKategoriOzet(tutar, grup.urunSayisi)}
                        expanded={acik}
                        onToggle={() => kategoriAc(grup.kategoriKodu)}
                        accessibilityLabel={a11yTaksitKategori(kat.ad, tutar, grup.urunSayisi)}>
                        <KirilimGovde
                          grup={grup}
                          variant="kuyu"
                          aralikRitmi={rhythm.blockInCard}
                          tumunuGosterilen={tumunuGosterilen}
                          onTumunuGoster={tumunuAc}
                          onSatirPress={satiraGit}
                        />
                      </Accordion>
                    </View>
                  );
                })}
              </>
            ) : tekKategoriMi(gruplar) ? (
              <>
                <View style={{ height: rhythm.section }} />
                <TekKategoriBaslik grup={gruplar[0]} />
                <View style={{ height: rhythm.group }} />
                <KirilimGovde
                  grup={gruplar[0]}
                  variant="kabarik"
                  aralikRitmi={rhythm.group}
                  tumunuGosterilen={tumunuGosterilen}
                  onTumunuGoster={tumunuAc}
                  onSatirPress={satiraGit}
                />
              </>
            ) : null}

            <View style={{ height: rhythm.section }} />
            <ClaySurface level="raised" borderRadius={radius.card} style={stil.kart}>
              <Txt role="h2">{t['taksit.gelecek_baslik']}</Txt>
              <View style={{ height: rhythm.group }} />
              {veri.aylar.map((a, i) => (
                <View key={a.ay}>
                  {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                  <MonthLoadRow
                    ay={ayAdiTek(a.ay)}
                    tutar={paraYaz(a.toplamKurus)}
                    oran={a.toplamKurus / maxAyToplami}
                    current={i === 0}
                  />
                </View>
              ))}
              {kalanToplamKurusGorunen > 0 && veri.sonAy ? (
                <>
                  <View style={{ height: rhythm.blockInCard }} />
                  <Txt role="caption">
                    {taksitKalanToplam(paraYaz(kalanToplamKurusGorunen), ayBasligi(veri.sonAy))}
                  </Txt>
                </>
              ) : null}
            </ClaySurface>

            {veri.bitenSeri ? (
              <>
                <View style={{ height: rhythm.section }} />
                <InfoStrip
                  variant="info"
                  metin={
                    veri.bitenSeri.urunAdi
                      ? taksitSeriBittiUrun(
                          veri.bitenSeri.urunAdi,
                          ayAdiTek(ayAnahtari(ayEkle(new Date(), -1))),
                          paraYaz(veri.bitenSeri.tutarKurus),
                        )
                      : taksitSeriBitti(
                          kategori(veri.bitenSeri.kategori).ad,
                          ayAdiTek(ayAnahtari(ayEkle(new Date(), -1))),
                          paraYaz(veri.bitenSeri.tutarKurus),
                        )
                  }
                />
              </>
            ) : null}
          </>
        ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

/** §4.2/K-T2 — tek kategoride akordiyon KURULMAZ; kimlik bölüm başlığına taşınır, kartsız + dokunulamaz. */
function TekKategoriBaslik({ grup }: { grup: KategoriGrubu }) {
  const kat = kategori(grup.kategoriKodu);
  return (
    <View style={stil.tekKategoriBaslik}>
      <CategoryIconBox kategori={kat} />
      <View style={{ width: rhythm.blockInCard }} />
      <Txt role="h2" numberOfLines={1} style={stil.esnek}>
        {kat.ad}
      </Txt>
      <View style={{ width: rhythm.blockInCard }} />
      <Txt role="label" tone={color.text2}>
        {taksitOzetTekKategori(grup.urunSayisi)}
      </Txt>
    </View>
  );
}

/** Ürün satırları + gerekirse "Tümünü göster" — akordiyon içinde (`kuyu`) ve kartsız (`kabarik`) düzende ORTAK govde. */
function KirilimGovde({
  grup,
  variant,
  aralikRitmi,
  tumunuGosterilen,
  onTumunuGoster,
  onSatirPress,
}: {
  grup: KategoriGrubu;
  variant: 'kuyu' | 'kabarik';
  aralikRitmi: number;
  tumunuGosterilen: Set<string>;
  onTumunuGoster: (kod: string) => void;
  onSatirPress: (id: string) => void;
}) {
  const kat = kategori(grup.kategoriKodu);
  const renk = aileRenkleri(kat.aile).solid;
  const acilmis = tumunuGosterilen.has(grup.kategoriKodu);
  const gorunen = gorunenSatirlar(grup.satirlar, acilmis);

  return (
    <>
      {gorunen.map((satir: UrunSatiri, i) => {
        const ad = satir.urunAdi ?? taksitUrunYok(kat.ad);
        const tutar = paraYaz(satir.tutarLira * 100);
        const kalanTutar = satir.son ? null : paraYaz(satir.kalanLira * 100);
        const etiket = satir.son
          ? a11yTaksitSeriSon(ad, tutar)
          : a11yTaksitSeri(ad, tutar, satir.taksitNo, satir.taksitToplam, kalanTutar as string);
        return (
          <View key={satir.taksitId}>
            {i > 0 ? <View style={{ height: aralikRitmi }} /> : null}
            <InstallmentSeriesRow
              urunAdi={ad}
              tutar={tutar}
              mevcut={satir.taksitNo}
              toplam={satir.taksitToplam}
              kalanTutar={kalanTutar}
              son={satir.son}
              solidColor={renk}
              variant={variant}
              accessibilityLabel={etiket}
              onPress={() => onSatirPress(satir.id)}
            />
          </View>
        );
      })}
      {grup.satirlar.length > KATEGORI_SATIR_SINIRI && !acilmis ? (
        <>
          <View style={{ height: aralikRitmi }} />
          <Button
            variant="ghost"
            label={t['taksit.tumunu_goster']}
            accessibilityLabel={a11yTaksitTumunuGoster(grup.urunSayisi)}
            onPress={() => onTumunuGoster(grup.kategoriKodu)}
          />
        </>
      ) : null}
    </>
  );
}

function BosDurum() {
  return (
    <ClaySurface level="raisedLg" borderRadius={radius.hero} style={stil.bosKart}>
      <View style={stil.bosDisk}>
        <Icon name="calendar-clock" size={32} color={color.text2} />
      </View>
      <View style={{ height: rhythm.blockInCard }} />
      <Txt role="h2">{t['bos.taksit.baslik']}</Txt>
      <View style={{ height: rhythm.group }} />
      <Txt role="body" style={stil.ortaMetin}>
        {t['bos.taksit.govde']}
      </Txt>
    </ClaySurface>
  );
}

function Skeletonlar() {
  return (
    <>
      <ClaySurface level="raisedLg" borderRadius={radius.hero} style={stil.kart}>
        <Skeleton width={52} height={18} />
        <View style={{ height: rhythm.sameObject }} />
        <Skeleton width={152} height={38} />
        <View style={{ height: rhythm.blockInCard }} />
        <Skeleton width="100%" height={18} />
      </ClaySurface>

      <View style={{ height: rhythm.section }} />
      {/* T7 — iskelet çok kategorili düzeni tahmin eder: 1 açık bölüm (2
          satır) + 2 kapalı bölüm. Bölüm başlığı için SABİT 25pt ayrılır
          (r3/Ö5) — tek kategori çözülürse liste 19px aşağı oturur, bu
          kabul edilmiş ve yukarıdaki LayoutAnimation ile yumuşatılmıştır. */}
      <Skeleton width={176} height={25} />
      <View style={{ height: rhythm.group }} />
      <ClaySurface level="raised" borderRadius={radius.card} style={stil.kart}>
        <Skeleton width={140} height={19} />
        <View style={{ height: rhythm.group }} />
        {[0, 1].map((i) => (
          <View key={i}>
            {i > 0 ? <View style={{ height: rhythm.blockInCard }} /> : null}
            <View style={stil.satirIskelet}>
              <View style={stil.satirIskeletOrta}>
                <Skeleton width={128} height={24} />
                <View style={{ height: rhythm.sameObject }} />
                <Skeleton width={168} height={18} />
              </View>
              <Skeleton width={72} height={24} />
            </View>
          </View>
        ))}
      </ClaySurface>
      {[0, 1].map((i) => (
        <View key={i}>
          <View style={{ height: rhythm.group }} />
          <ClaySurface level="raised" borderRadius={radius.card} style={[stil.kart, stil.kapaliBaslikIskeleti]}>
            <Skeleton width={44} height={44} borderRadius={radius.tile} />
            <View style={{ width: rhythm.blockInCard }} />
            <Skeleton width={100} height={19} />
          </ClaySurface>
        </View>
      ))}

      <View style={{ height: rhythm.section }} />
      <ClaySurface level="raised" borderRadius={radius.card} style={stil.kart}>
        <Skeleton width={176} height={25} />
        <View style={{ height: rhythm.group }} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i}>
            {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
            <MonthLoadRowSkeleton />
          </View>
        ))}
      </ClaySurface>
    </>
  );
}

const stil = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: color.navDark },
  kaydir: { flex: 1 },
  scrollIcerik: { flexGrow: 1 },
  panel: {
    flex: 1,
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    paddingTop: rhythm.section,
  },
  pad: { paddingHorizontal: layout.screenPaddingX },
  kart: { padding: rhythm.pad },
  paraSatiri: { flexDirection: 'row', alignItems: 'baseline' },
  bolumBasligi: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tekKategoriBaslik: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  esnek: { flex: 1, minWidth: 0 },
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
  satirIskelet: { flexDirection: 'row', alignItems: 'center', minHeight: 68, paddingHorizontal: 16 },
  satirIskeletOrta: { flex: 1, minWidth: 0, paddingHorizontal: rhythm.blockInCard },
  kapaliBaslikIskeleti: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
});
