import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { Icon } from '@/components/Icon';
import { RevScreen, useRevLoad } from '@/components/RevScreen';
import { SavingsSheet, type BirikimGirdisi } from '@/components/SavingsSheet';
import { CategoryDistributionCard } from '@/components/tasarruf/CategoryDistributionCard';
import { MovementsSection } from '@/components/tasarruf/MovementsSection';
import { RealSavingsCard } from '@/components/tasarruf/RealSavingsCard';
import { RoutineSavingsCard } from '@/components/tasarruf/RoutineSavingsCard';
import { SavingsHeroCard } from '@/components/tasarruf/SavingsHeroCard';
import { SavingsPeriodSheet } from '@/components/tasarruf/SavingsPeriodSheet';
import { SavingsSkeleton } from '@/components/tasarruf/SavingsSkeleton';
import { Txt } from '@/components/Txt';
import { t, tasarrufHareketKaydedildiToast, tasarrufHareketSilindiToast } from '@/content/metinler';
import { bugun, movementDelete, movementPut, routinesGet, savingsPeriodGet, movementsPeriodGet, yeniId, type Movement } from '@/lib/revApi';
import { paraYaz } from '@/lib/para';
import { tasarrufDonemBasligi, tasarrufDonemKisaEtiketi, tasarrufDonemSinirlari, type TasarrufDonemi } from '@/lib/tasarrufDonem';
import { toastGoster } from '@/lib/toastBus';
import { veriDegisti } from '@/lib/veriBus';
import { a11y, color, layout, radius, rhythm } from '@/theme/tokens';

/**
 * rev2-tasarruf-profil.md §3.12 — E-27 Tasarruf. Kahraman gösterge + DÖRT
 * akordiyon bölümü (A bütçe · B gerçek birikim+hareketler · C kategori ·
 * D rutin tasarrufu). Sözlük ayrımı korunur: *hesaplanan tasarruf* (A) ·
 * *gerçek birikim* (B) · *rutin tasarrufu* (D) — üçü hiçbir yerde toplanmaz.
 */
export default function TasarruflarEkrani() {
  const [donem, setDonem] = useState<TasarrufDonemi>('ay');
  const [donemSheetAcik, setDonemSheetAcik] = useState(false);
  const referansGun = bugun();
  const sinirlar = tasarrufDonemSinirlari(donem, referansGun);
  const donemBasligi = tasarrufDonemBasligi(donem, referansGun);

  const fetcher = useCallback(async () => {
    const [savings, ledger, rutinYaniti] = await Promise.all([
      savingsPeriodGet(donem, referansGun),
      movementsPeriodGet(sinirlar.baslangic, sinirlar.bitis),
      routinesGet(),
    ]);
    return { savings, ledger, toplamRutinSayisi: rutinYaniti.rutinler.filter((rutin) => rutin.aktif).length };
  }, [donem, referansGun, sinirlar.baslangic, sinirlar.bitis]);
  const load = useRevLoad(fetcher);
  const d = load.data?.savings;
  const ledger = load.data?.ledger;
  const toplamRutinSayisi = load.data?.toplamRutinSayisi;

  const [sheetAcik, setSheetAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<Movement | null>(null);
  const [sheetYeniId, setSheetYeniId] = useState(yeniId);
  const [sheetBusy, setSheetBusy] = useState(false);
  const [sheetHata, setSheetHata] = useState<string>();

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
          {load.error ? t['tasarruf.ustSatir.hata'] : donemBasligi}
        </Txt>
        <Txt role="h2" tone="#FFFFFF" numberOfLines={1}>
          {t['tasarruf.baslik']}
        </Txt>
      </View>
      <Pressable
        onPress={() => setDonemSheetAcik(true)}
        accessibilityRole="button"
        accessibilityLabel={`Tasarruf dönemi: ${tasarrufDonemKisaEtiketi(donem)}`}
        style={({ pressed }) => [stil.donemButonu, pressed && stil.donemButonuBasili]}>
        <Txt role="label" tone="#FFFFFF">{tasarrufDonemKisaEtiketi(donem)}</Txt>
        <Icon name="chevron-down" size={20} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  return (
    <RevScreen title={t['tasarruf.baslik']} tab="tasarruflar" header={header} contentGap={0}>
      {load.loading ? <SavingsSkeleton /> : null}

      {load.error ? (
        <>
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
          <SavingsHeroCard
            harcanabilirKurus={d.harcanabilir_kurus}
            hesaplananTasarrufKurus={d.hesaplanan_tasarruf_kurus}
            donemBasligi={donemBasligi}
            onButcePress={() => router.push('/butce')}
          />

          <View style={{ height: rhythm.section }} />
          <RoutineSavingsCard
            rutinler={d.rutinler}
            toplamKurus={d.rutin_tasarruf_kurus}
            toplamRutinSayisi={toplamRutinSayisi}
            onRutinleriAcPress={() => router.push('/rutinler')}
          />

          <View style={stil.bolumAyraci} />
          <BolumBasligi baslik={t['tasarruf.bolum.kategori']} />
          <View style={{ height: rhythm.blockInCard }} />
          <CategoryDistributionCard
            kategoriler={d.kategoriler}
            harcananToplam={d.harcanan_kurus}
            onTumunuGorPress={() => router.push('/ozet')}
          />

          <View style={stil.bolumAyraci} />
          <BolumBasligi baslik={t['tasarruf.bolum.birikim']} />
          <View style={{ height: rhythm.blockInCard }} />
          <RealSavingsCard
            gercekBirikimKurus={d.gercek_birikim_kurus}
            donemBirikimKurus={d.donem_birikim_kurus ?? d.ay_birikim_kurus}
            hedefBirikimKurus={d.hedef_birikim_kurus}
            onEklePress={ekleAc}
            onHedefPress={() => router.push('/butce')}
          />
          <View style={{ height: rhythm.section }} />
          <MovementsSection
            hareketler={ledger.hareketler}
            toplamKayit={ledger.hareketler.length}
            onRowPress={duzenleAc}
            onSwipeDelete={silBaslat}
            onTumuPress={() => router.push({ pathname: '/birikimler', params: { baslangic: sinirlar.baslangic, bitis: sinirlar.bitis, donem: donemBasligi } })}
          />

        </>
      ) : null}

      <SavingsPeriodSheet
        visible={donemSheetAcik}
        value={donem}
        onChange={setDonem}
        onClose={() => setDonemSheetAcik(false)}
      />

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

function BolumBasligi({ baslik }: { baslik: string }) {
  return (
    <Txt role="h2">{baslik}</Txt>
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
  donemButonu: {
    minWidth: 88,
    height: a11y.minTarget,
    paddingHorizontal: rhythm.blockInCard,
    borderRadius: radius.pill,
    backgroundColor: color.navGlassBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rhythm.sameObject,
  },
  donemButonuBasili: { backgroundColor: color.navGlassBgPressed },
  bolumAyraci: { height: 1, backgroundColor: color.line, marginVertical: rhythm.section },
});
