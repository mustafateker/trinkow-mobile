import { router } from 'expo-router';
import { useVeriBaglami } from '@/db/baglam';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import type { IconName } from '@/components/Icon';

import { AppFooter } from '@/components/AppFooter';
import { IconButton } from '@/components/IconButton';
import { IdentityPanel } from '@/components/IdentityPanel';
import { InfoStrip } from '@/components/InfoStrip';
import { RevScreen, useRevLoad } from '@/components/RevScreen';
import { GrupBasligi, SettingGroup, SettingRow, type MenuIconTone } from '@/components/SettingRow';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import {
  a11yProfilSatir,
  profilKimlikSeritAltEnUzun,
  profilKimlikSeritGun,
  profilSatirButceDeger,
  profilSatirFavorilerDeger,
  profilSatirLimitlerDeger,
  profilSatirRutinlerDeger,
  profilSatirSeriDeger,
  profilSatirTaksitlerDeger,
  t,
} from '@/content/metinler';
import { surenSeriler, taksitBuAyToplam } from '@/db/harcama';
import { seriDurumuHesapla } from '@/db/seri';
import type { Oturum } from '@/lib/oturumDeposu';
import { oturumOku } from '@/lib/oturumDeposu';
import { paraYaz } from '@/lib/para';
import { budgetGet, bugun, favoritesGet, routinesGet, savingsGet } from '@/lib/revApi';
import { color, layout, rhythm } from '@/theme/tokens';

const SURUM = '1.0.0';

type AyarVerisi = {
  gelirKurus: number | null;
  sabitGiderSayisi: number;
  gunlukLimitKurus: number | null;
  kategoriLimitSayisi: number;
  rutinSayisi: number;
  rutinTasarrufBuAyKurus: number;
  favoriSayisi: number;
  taksitSeriSayisi: number;
  taksitBuAyToplamKurus: number;
  seri: { mevcutSeri: number; enUzunSeri: number };
  eksik: boolean;
};

/**
 * rev2-tasarruf-profil.md §4 — E-28 Profil. Kimlik paneli (kahraman panel,
 * kendi bağımsız durumu — §4.2) + 4 grupta 9 gezinme satırı (§4.3: gerçek
 * değer + chevron, ikincil satır asla boş kalmaz). Kip çipi burada YOK; kip
 * yalnız Ayarlar'dan değişir (§26.3), tek eylem hiyerarşisi §7/5 gereği.
 */
export default function ProfilEkrani() {
  const db = useVeriBaglami();
  const oturum = useRevLoad(useCallback(oturumOku, []));

  const ayarVerisi = useRevLoad(
    useCallback(async (): Promise<AyarVerisi> => {
      const buAy = bugun().slice(0, 7);
      const sonuclar = await Promise.allSettled([
        budgetGet(),
        routinesGet(),
        favoritesGet(),
        savingsGet(buAy),
        surenSeriler(db, buAy),
        taksitBuAyToplam(db, buAy),
        seriDurumuHesapla(db),
      ]);
      const [butceYaniti, rutinYaniti, favoriYaniti, tasarrufAy, taksitSeriler, buAyTaksitToplam, seriYaniti] = sonuclar;
      const butce = butceYaniti.status === 'fulfilled' ? butceYaniti.value.butce : null;
      const rutinler = rutinYaniti.status === 'fulfilled' ? rutinYaniti.value.rutinler : [];
      const favoriler = favoriYaniti.status === 'fulfilled' ? favoriYaniti.value.kalemler : [];
      const tasarruf = tasarrufAy.status === 'fulfilled' ? tasarrufAy.value.rutin_tasarruf_kurus : 0;
      const taksitler = taksitSeriler.status === 'fulfilled' ? taksitSeriler.value : [];
      const taksitToplam = buAyTaksitToplam.status === 'fulfilled' ? buAyTaksitToplam.value : 0;
      const seri = seriYaniti.status === 'fulfilled' ? seriYaniti.value : { mevcutSeri: 0, enUzunSeri: 0 };
      return {
        gelirKurus: butce?.gelir_kurus ?? null,
        sabitGiderSayisi: butce ? Object.values(butce.sabit_giderler).filter((v) => v > 0).length : 0,
        gunlukLimitKurus: butce?.gunluk_limit_kurus ?? null,
        kategoriLimitSayisi: butce ? Object.values(butce.kategori_limitleri).filter((v) => v > 0).length : 0,
        rutinSayisi: rutinler.filter((r) => r.aktif).length,
        rutinTasarrufBuAyKurus: tasarruf,
        favoriSayisi: favoriler.length,
        taksitSeriSayisi: taksitler.length,
        taksitBuAyToplamKurus: taksitToplam,
        seri,
        eksik: sonuclar.some((sonuc) => sonuc.status === 'rejected'),
      };
    }, [db]),
  );

  const panelYukleniyor = oturum.loading || (oturum.data !== null && ayarVerisi.loading);
  const seri = ayarVerisi.data?.seri ?? { mevcutSeri: 0, enUzunSeri: 0 };

  const header = (
    <View style={stil.ekranBasi}>
      <View style={stil.esnek}>
        <Txt role="caption" tone={color.navMuted}>
          {t['profil.ustSatir']}
        </Txt>
        <Txt role="h2" tone="#FFFFFF" numberOfLines={1}>
          {t['profil.baslik']}
        </Txt>
      </View>
      <View style={{ width: rhythm.group }} />
      <IconButton
        icon="ayarlar"
        accessibilityLabel={t['a11y.profil.ayarlar']}
        tone="#FFFFFF"
        background={color.navGlassBg}
        pressedBackground={color.navGlassBgPressed}
        onPress={() => router.push('/ayarlar')}
      />
    </View>
  );

  return (
    <RevScreen title={t['profil.baslik']} tab="profil" header={header} contentGap={0}>
      <Kimlik panelYukleniyor={panelYukleniyor} oturum={oturum} seri={seri} />

      <View style={{ height: rhythm.section }} />
      {ayarVerisi.data?.eksik ? (
        <>
          <InfoStrip variant="warning" icon="refresh-cw" metin={t['ui.profile.plan_load_error']} />
          <View style={{ height: rhythm.group }} />
        </>
      ) : null}
          <GrupBasligi metin={t['ui.profile.plan']} />
          <SettingGroup>
            <AyarSatiri icon="banknote" iconTone="green" baslik={t['profil.satir.butce']} yukleniyor={ayarVerisi.loading} deger={ayarVerisi.data ? (ayarVerisi.data.gelirKurus != null ? profilSatirButceDeger(paraYaz(ayarVerisi.data.gelirKurus), ayarVerisi.data.sabitGiderSayisi) : t['tasarruf.gelirYok.baslik']) : t['profil.satir.butceBos']} onPress={() => router.push('/butce')} />
            <AyarSatiri icon="limitler" iconTone="blue" baslik={t['profil.satir.limitler']} yukleniyor={ayarVerisi.loading} deger={ayarVerisi.data ? (ayarVerisi.data.gunlukLimitKurus != null ? profilSatirLimitlerDeger(paraYaz(ayarVerisi.data.gunlukLimitKurus), ayarVerisi.data.kategoriLimitSayisi) : t['profil.satir.limitlerBos']) : t['profil.satir.limitlerBos']} onPress={() => router.push('/limitler')} />
            <AyarSatiri icon="repeat" iconTone="orange" baslik={t['profil.satir.rutinler']} yukleniyor={ayarVerisi.loading} deger={ayarVerisi.data ? profilSatirRutinlerDeger(ayarVerisi.data.rutinSayisi, paraYaz(ayarVerisi.data.rutinTasarrufBuAyKurus)) : t['profil.satir.rutinlerBos']} onPress={() => router.push('/rutinler')} />
            <AyarSatiri icon="notebook" iconTone="pink" baslik={t['profil.satir.favoriler']} yukleniyor={ayarVerisi.loading} deger={ayarVerisi.data ? profilSatirFavorilerDeger(ayarVerisi.data.favoriSayisi) : t['profil.satir.favorilerBos']} onPress={() => router.push('/favoriler')} />
            <AyarSatiri icon="calendar-clock" iconTone="orange" baslik={t['profil.satir.taksitler']} yukleniyor={ayarVerisi.loading} deger={ayarVerisi.data ? profilSatirTaksitlerDeger(ayarVerisi.data.taksitSeriSayisi, paraYaz(ayarVerisi.data.taksitBuAyToplamKurus)) : t['profil.satir.taksitlerBos']} onPress={() => router.push('/taksitler')} />
            <SettingRow icon="trending-up" iconTone="green" baslik={t['profil.satir.seri']} aciklama={profilSatirSeriDeger(seri.mevcutSeri, seri.enUzunSeri)} onPress={() => router.push('/seri')} accessibilityLabel={a11yProfilSatir(t['profil.satir.seri'], profilSatirSeriDeger(seri.mevcutSeri, seri.enUzunSeri))} />
          </SettingGroup>

      <View style={{ height: rhythm.section }} />
      <GrupBasligi metin={t['ui.profile.account']} />
      <SettingGroup>
        <SettingRow icon="ayarlar" iconTone="primary" baslik={t['profil.satir.ayarlar']} aciklama={t['profil.satir.ayarlarDeger']} onPress={() => router.push('/ayarlar')} accessibilityLabel={a11yProfilSatir(t['profil.satir.ayarlar'], t['profil.satir.ayarlarDeger'])} />
        <SettingRow icon="info" iconTone="neutral" baslik={t['profil.satir.yardim']} aciklama={t['profil.satir.yardimDeger']} onPress={() => router.push('/yardim')} accessibilityLabel={a11yProfilSatir(t['profil.satir.yardim'], t['profil.satir.yardimDeger'])} />
      </SettingGroup>

      <View style={{ height: rhythm.section }} />
      <AppFooter
        surum={SURUM}
        onSartlar={() => router.push({ pathname: '/legal', params: { belge: 'kosullar' } })}
        onGizlilik={() => router.push({ pathname: '/legal', params: { belge: 'gizlilik' } })}
      />
    </RevScreen>
  );
}

/** Yükleme sürerken §4.3'ün skeleton satırı; bitince gerçek `SettingRow`. */
function AyarSatiri({
  icon,
  iconTone,
  baslik,
  deger,
  yukleniyor,
  onPress,
}: {
  icon: IconName;
  iconTone: MenuIconTone;
  baslik: string;
  deger: string;
  yukleniyor: boolean;
  onPress: () => void;
}) {
  if (yukleniyor) return <SatirIskeleti />;
  return <SettingRow icon={icon} iconTone={iconTone} baslik={baslik} aciklama={deger} onPress={onPress} accessibilityLabel={a11yProfilSatir(baslik, deger)} />;
}

function SatirIskeleti() {
  return (
    <View style={stil.satirIskelet}>
      <Skeleton width={44} height={44} borderRadius={16} />
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.esnek}>
        <Skeleton width={120} height={16} />
        <View style={{ height: rhythm.sameObject }} />
        <Skeleton width={176} height={13} />
      </View>
    </View>
  );
}

function Kimlik({
  panelYukleniyor,
  oturum,
  seri,
}: {
  panelYukleniyor: boolean;
  oturum: { data: Oturum | null; error: string; reload: () => void };
  seri: { mevcutSeri: number; enUzunSeri: number };
}) {
  if (panelYukleniyor) return <IdentityPanel variant="skeleton" />;
  if (oturum.error) return <IdentityPanel variant="error" onRetry={oturum.reload} />;
  if (!oturum.data) return <IdentityPanel variant="signed-out" onOturumAc={() => router.push('/giris')} />;

  const olguMetin =
    seri.mevcutSeri === 0
      ? { olgu: t['profil.kimlik.serit.yok'], baglam: t['profil.kimlik.serit.yokAlt'] }
      : seri.enUzunSeri <= seri.mevcutSeri
        ? { olgu: profilKimlikSeritGun(seri.mevcutSeri), baglam: t['profil.kimlik.serit.altRekor'] }
        : { olgu: profilKimlikSeritGun(seri.mevcutSeri), baglam: profilKimlikSeritAltEnUzun(seri.enUzunSeri) };

  const saglayiciEtiketi =
    oturum.data.kimlikSaglayici === 'google'
      ? t['profil.kimlik.saglayici.google']
      : oturum.data.kimlikSaglayici === 'apple'
        ? t['profil.kimlik.saglayici.apple']
        : t['profil.kimlik.saglayici.eposta'];

  return (
    <IdentityPanel
      variant="signed-in"
      eposta={oturum.data.email}
      saglayiciEtiketi={saglayiciEtiketi}
      olgu={{ icon: 'trending-up', ...olguMetin }}
      onPress={() => router.push('/ayarlar')}
    />
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
  satirIskelet: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 76,
    paddingHorizontal: rhythm.pad,
  },
});
