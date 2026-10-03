import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Accordion } from '@/components/Accordion';
import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { RevScreen, useRevLoad } from '@/components/RevScreen';
import { SavingsSheet, type BirikimGirdisi } from '@/components/SavingsSheet';
import { CategoryDistributionCard } from '@/components/tasarruf/CategoryDistributionCard';
import { MovementsSection } from '@/components/tasarruf/MovementsSection';
import { RealSavingsCard } from '@/components/tasarruf/RealSavingsCard';
import { RoutineSavingsCard } from '@/components/tasarruf/RoutineSavingsCard';
import { SavingsHeroCard } from '@/components/tasarruf/SavingsHeroCard';
import { SavingsSkeleton } from '@/components/tasarruf/SavingsSkeleton';
import { Txt } from '@/components/Txt';
import { ayLokatif, t, tasarrufHareketKaydedildiToast, tasarrufHareketSilindiToast, tasarrufOzetRutin, tasarrufUstSatir } from '@/content/metinler';
import { bugun, movementDelete, movementPut, routinesGet, savingsGet, movementsGet, yeniId, type Movement } from '@/lib/revApi';
import { paraYaz } from '@/lib/para';
import { ayAnahtariFarkli, ayBasligi } from '@/lib/tarih';
import { toastGoster } from '@/lib/toastBus';
import { veriDegisti } from '@/lib/veriBus';
import { color, layout, rhythm } from '@/theme/tokens';

/**
 * rev2-tasarruf-profil.md §3.12 — E-27 Tasarruf. Kahraman gösterge + DÖRT
 * akordiyon bölümü (A bütçe · B gerçek birikim+hareketler · C kategori ·
 * D rutin tasarrufu). Sözlük ayrımı korunur: *hesaplanan tasarruf* (A) ·
 * *gerçek birikim* (B) · *rutin tasarrufu* (D) — üçü hiçbir yerde toplanmaz.
 */
export default function TasarruflarEkrani() {
  const [ay, setAy] = useState(() => bugun().slice(0, 7));
  const guncelAyMi = ay === bugun().slice(0, 7);

  const fetcher = useCallback(async () => {
    const [savings, ledger, rutinYaniti] = await Promise.all([savingsGet(ay), movementsGet(ay), routinesGet()]);
    return { savings, ledger, toplamRutinSayisi: rutinYaniti.rutinler.length };
  }, [ay]);
  const load = useRevLoad(fetcher);
  const d = load.data?.savings;
  const ledger = load.data?.ledger;
  const toplamRutinSayisi = load.data?.toplamRutinSayisi;

  const [rutinAcik, setRutinAcik] = useState(false);

  const [sheetAcik, setSheetAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<Movement | null>(null);
  const [sheetYeniId, setSheetYeniId] = useState(yeniId);
  const [sheetBusy, setSheetBusy] = useState(false);
  const [sheetHata, setSheetHata] = useState<string>();

  function ayDegistir(fark: number) {
    setAy((onceki) => ayAnahtariFarkli(onceki, fark));
  }

  const ayAdiYil = ayBasligi(ay);
  const ayLokatifDeger = ayLokatif(Number(ay.split('-')[1]));

  function ekleAc() {
    setDuzenlenen(null);
    setSheetYeniId(yeniId());
    setSheetHata(undefined);
    setSheetAcik(true);
  }
  function duzenleAc(m: Movement) {
    setDuzenlenen(m);
    setSheetHata(undefined);
    setSheetAcik(true);
  }
  function sheetKapat() {
    if (sheetBusy) return;
    setSheetAcik(false);
  }

  async function kaydet(girdi: BirikimGirdisi) {
    setSheetBusy(true);
    setSheetHata(undefined);
    try {
      await movementPut(girdi);
      veriDegisti();
      await load.reload();
      setSheetAcik(false);
      toastGoster({ tur: 'info', metin: tasarrufHareketKaydedildiToast(paraYaz(Math.abs(girdi.tutar_kurus))) });
    } catch {
      setSheetHata(t['birikimSheet.hata.ag']);
    } finally {
      setSheetBusy(false);
    }
  }

  function silBaslat(m: Movement) {
    void silVeGeriAlSun(m);
    setSheetAcik(false);
  }

  async function silVeGeriAlSun(m: Movement) {
    await movementDelete(m.id);
    veriDegisti();
    await load.reload();
    toastGoster({
      tur: 'undo',
      metin: tasarrufHareketSilindiToast(paraYaz(Math.abs(m.tutar_kurus))),
      eylemEtiketi: t['toast.geri_al'],
      onEylem: async () => {
        await movementPut({ id: m.id, gun: m.gun, tutar_kurus: m.tutar_kurus, not_metni: m.not_metni });
        veriDegisti();
        await load.reload();
      },
    });
  }

  const header = (
    <View style={stil.ekranBasi}>
      <View style={stil.esnek}>
        <Txt role="caption" tone={color.navMuted}>
          {load.error ? t['tasarruf.ustSatir.hata'] : load.loading ? ayAdiYil : tasarrufUstSatir(ayAdiYil, !guncelAyMi)}
        </Txt>
        <Txt role="h2" tone="#FFFFFF" numberOfLines={1}>
          {t['tasarruf.baslik']}
        </Txt>
      </View>
      <View style={stil.ayGezinme}>
        <IconButton icon="chevron-left" accessibilityLabel={t['a11y.tasarruf.oncekiAy']} tone="#FFFFFF" background={color.navGlassBg} pressedBackground={color.navGlassBgPressed} onPress={() => ayDegistir(-1)} />
        <IconButton icon="chevron-right" accessibilityLabel={t['a11y.tasarruf.sonrakiAy']} tone="#FFFFFF" background={color.navGlassBg} pressedBackground={color.navGlassBgPressed} onPress={() => ayDegistir(1)} disabled={guncelAyMi} />
      </View>
    </View>
  );

  return (
    <RevScreen title={t['tasarruf.baslik']} tab="tasarruflar" header={header} contentGap={0}>
      {load.loading ? <SavingsSkeleton /> : null}

      {load.error ? (
        <>
          <View style={stil.hataPagerSatiri}>
            <IconButton icon="chevron-left" accessibilityLabel={t['a11y.tasarruf.oncekiAy']} onPress={() => ayDegistir(-1)} />
            <Txt role="label">{ayAdiYil}</Txt>
            <IconButton
              icon="chevron-right"
              accessibilityLabel={t['a11y.tasarruf.sonrakiAy']}
              onPress={() => ayDegistir(1)}
              disabled={guncelAyMi}
            />
          </View>
          <View style={{ height: rhythm.section }} />
          <ErrorState
            icon="wifi-off"
            baslik={t['tasarruf.hata.baslik']}
            govde={t['tasarruf.hata.alt']}
            butonEtiketi={t['tasarruf.hata.btn']}
            buttonVariant="secondary"
            onRetry={load.reload}
          />
        </>
      ) : null}

      {d && ledger && toplamRutinSayisi !== undefined && !load.loading && !load.error ? (
        <>
          <View style={stil.ozetBolumu}>
            <SavingsHeroCard
            harcanabilirKurus={d.harcanabilir_kurus}
            harcananKurus={d.harcanan_kurus}
            kalanKurus={d.kalan_kurus}
            tamamlananGun={d.tamamlanan_gun_sayisi}
            guncelAyMi={guncelAyMi}
            ayLokatifDeger={ayLokatifDeger}
            onButcePress={() => router.push('/butce')}
          />
          </View>

          <View style={{ height: rhythm.section }} />
          <Txt role="h2">{t['tasarruf.bolum.birikim']}</Txt>
          <View style={{ height: rhythm.blockInCard }} />
          <RealSavingsCard
            guncelAyMi={guncelAyMi}
            ayLokatifDeger={ayLokatifDeger}
            gercekBirikimKurus={d.gercek_birikim_kurus}
            ayBirikimKurus={d.ay_birikim_kurus}
            hedefBirikimKurus={d.hedef_birikim_kurus}
            onEklePress={ekleAc}
            onHedefPress={() => router.push('/butce')}
          />
          <View style={{ height: rhythm.section }} />
          <MovementsSection
            guncelAyMi={guncelAyMi}
            ayLokatifDeger={ayLokatifDeger}
            hareketler={ledger.hareketler}
            toplamKayit={ledger.hareketler.length}
            onRowPress={duzenleAc}
            onSwipeDelete={silBaslat}
            onTumuPress={() => router.push({ pathname: '/birikimler', params: { ay } })}
          />

          <View style={{ height: rhythm.section }} />
          <Txt role="h2">{t['tasarruf.bolum.kategori']}</Txt>
          <View style={{ height: rhythm.blockInCard }} />
          <CategoryDistributionCard
            guncelAyMi={guncelAyMi}
            ayLokatifDeger={ayLokatifDeger}
            kategoriler={d.kategoriler}
            harcananToplam={d.harcanan_kurus}
            onTumunuGorPress={() => router.push('/ozet')}
          />

          <View style={{ height: rhythm.section }} />
          <Accordion
            title={t['tasarruf.bolum.rutin']}
            summary={toplamRutinSayisi === 0 ? t['tasarruf.ozet.rutinYok'] : tasarrufOzetRutin(paraYaz(d.rutin_tasarruf_kurus), toplamRutinSayisi)}
            expanded={rutinAcik}
            onToggle={() => setRutinAcik((a) => !a)}
            accessibilityLabel={`${t['tasarruf.bolum.rutin']}. ${toplamRutinSayisi === 0 ? t['tasarruf.ozet.rutinYok'] : tasarrufOzetRutin(paraYaz(d.rutin_tasarruf_kurus), toplamRutinSayisi)}`}>
            <RoutineSavingsCard
              guncelAyMi={guncelAyMi}
              ayLokatifDeger={ayLokatifDeger}
              rutinler={d.rutinler}
              toplamKurus={d.rutin_tasarruf_kurus}
              toplamRutinSayisi={toplamRutinSayisi}
              onRutinleriAcPress={() => router.push('/rutinler')}
            />
          </Accordion>
        </>
      ) : null}

      <SavingsSheet
        visible={sheetAcik}
        editing={duzenlenen}
        yeniId={sheetYeniId}
        busy={sheetBusy}
        hata={sheetHata}
        mevcutBakiyeKurus={d?.gercek_birikim_kurus ?? 0}
        onKaydet={(girdi) => void kaydet(girdi)}
        onSil={duzenlenen ? () => silBaslat(duzenlenen) : undefined}
        onClose={sheetKapat}
      />
    </RevScreen>
  );
}

const stil = StyleSheet.create({
  ekranBasi: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: layout.headerPadTop,
    paddingHorizontal: layout.screenPaddingX,
  },
  esnek: { flex: 1, minWidth: 0 },
  hataPagerSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ayGezinme: { flexDirection: 'row', gap: rhythm.group },
  ozetBolumu: { paddingBottom: rhythm.section, borderBottomWidth: 1, borderBottomColor: color.line },
});
