import { islemHatasiniGoster } from '@/lib/islemHatasi';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Platform, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountSection } from '@/components/AccountSection';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { DilSecimSheet, dilA11yEtiketi, dilAdi } from '@/components/DilSecici';
import { InfoStrip } from '@/components/InfoStrip';
import { PushHeader } from '@/components/PushHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { SettingGroup, SettingRow } from '@/components/SettingRow';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import {
  ayarSurum,
  ayarVeriSilOzet,
  hesapsilVeri,
  t,
} from '@/content/metinler';
import {
  gunSiniriKaydet,
  gunSiniriOku,
  dilKaydet,
  paraBirimiKaydet,
  varsayilanOdemeKaydet,
  varsayilanOdemeOku,
  yerellestirmeOku,
  type GunSiniriSaat,
} from '@/db/ayarTercihleri';
import { ilkKayitGunu, tumKayitSayisi, tumSayfalariGetir, tumVeriyiSil, type OdemeTipi } from '@/db/harcama';
import { budgetGet, favoritesGet, movementsGet, routinesGet, subscriptionsGet } from '@/lib/revApi';
import { hesabiSil, oturumuKapat } from '@/lib/hesapEylemleri';
import { type Oturum, oturumOku } from '@/lib/oturumDeposu';
import { toastGoster } from '@/lib/toastBus';
import { MAGAZA_ADI, abonelikYonetimAdresi, geriYukle, useUyelik, uyelikEtkin } from '@/lib/uyelik';
import { metin } from '@/i18n/cekirdek';
import { ayAnahtari, ayBasligi, tarihtenGun } from '@/lib/tarih';
import { veriDegisti } from '@/lib/veriBus';
import { color, layout, radius, rhythm } from '@/theme/tokens';
import { useDil } from '@/i18n/useDil';
import type { ParaBirimi } from '@/lib/yerellestirme';
import { yerellestirmeyiSakla } from '@/lib/yerellestirmeDeposu';
import { useYerellestirme } from '@/lib/useYerellestirme';
import {
  anaEkranWidgetiIste,
  hizliAyarKutusunuIste,
  type HizliErisimSonucu,
} from '@/lib/hizliErisim';

/**
 * D-2c-1 · E-19 Ayarlar. Referans: prototip-v4/11-ayarlar.html (4 yüzey).
 * Arka oda — **Kaydet yok**: her anahtar dokunulduğu an yazılır, ekranda
 * birincil buton ve alt sabit blok bulunmaz (bkz. prototip not-kutusu).
 *
 * Hesap bölümü D-2c-2'de gerçek oturuma bağlandı (bkz. `src/lib/api.ts` ·
 * `src/lib/oturumDeposu.ts`). `oturum` yerel depodan okunur — Ayarlar her
 * odaklandığında (`useFocusEffect`) tazelenir, bu yüzden giriş/kayıt/çıkış
 * sonrası buraya dönüldüğünde satır güncel görünür.
 */
export default function AyarlarEkrani() {
  const insets = useSafeAreaInsets();
  useYerellestirme();
  // Ekrandaki dil cihazdaki seçimdir (11 dil); sunucudan okunmaz.
  const dil = useDil();

  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(false);
  const [gunSiniri, setGunSiniri] = useState<GunSiniriSaat>(0);
  const [odeme, setOdeme] = useState<OdemeTipi>('kart');
  const [dilSheetAcik, setDilSheetAcik] = useState(false);
  const [paraBirimi, setParaBirimi] = useState<ParaBirimi>('TRY');
  const [tercihlerHazir, setTercihlerHazir] = useState(false);
  const [kayitAdedi, setKayitAdedi] = useState(0);
  const [ilkKayitAyYil, setIlkKayitAyYil] = useState<string | null>(null);

  const [veriSilAcik, setVeriSilAcik] = useState(false);
  const [veriSiliniyor, setVeriSiliniyor] = useState(false);
  const [hesapSilAcik, setHesapSilAcik] = useState(false);
  const [hesapSiliniyor, setHesapSiliniyor] = useState(false);
  const [oturum, setOturum] = useState<Oturum | null>(null);
  const [widgetYardimiAcik, setWidgetYardimiAcik] = useState(false);
  const [hizliErisimIslemi, setHizliErisimIslemi] = useState<'widget' | 'tile' | null>(null);
  const uyelik = useUyelik();
  const [geriYukleniyor, setGeriYukleniyor] = useState(false);

  async function satinAlimlariGeriYukle() {
    if (geriYukleniyor) return;
    setGeriYukleniyor(true);
    try {
      const acildi = await geriYukle();
      toastGoster({ tur: 'info', metin: acildi ? t['premium.toast.geri_yuklendi'] : t['premium.toast.geri_yukleme_yok'] });
    } catch {
      toastGoster({ tur: 'warning', metin: t['premium.toast.geri_yukleme_hata'] });
    } finally {
      setGeriYukleniyor(false);
    }
  }

  async function aboneligiYonet() {
    await Linking.openURL(await abonelikYonetimAdresi()).catch(() => {});
  }

  const oku = useCallback(async () => {
    setYukleniyor(true);
    setHata(false);
    try {
      const sonuclar = await Promise.allSettled([
        gunSiniriOku(),
        varsayilanOdemeOku(),
        yerellestirmeOku(),
        tumKayitSayisi(),
        ilkKayitGunu(),
        oturumOku(),
      ]);
      const [sinir, odemeD, yerellestirme, adet, ilkGun, oturumKaydi] = sonuclar;
      if (sinir.status === 'fulfilled') setGunSiniri(sinir.value);
      if (odemeD.status === 'fulfilled') setOdeme(odemeD.value);
      // Sunucunun dil alanı yalnız tr/en tutar ve uygulanmaz; buradan yalnız para birimi alınır.
      if (yerellestirme.status === 'fulfilled') setParaBirimi(yerellestirme.value.paraBirimi);
      if (adet.status === 'fulfilled') setKayitAdedi(adet.value);
      if (ilkGun.status === 'fulfilled') setIlkKayitAyYil(ilkGun.value ? ayBasligi(ayAnahtari(tarihtenGun(ilkGun.value))) : null);
      if (oturumKaydi.status === 'fulfilled') setOturum(oturumKaydi.value);
      setHata(sonuclar.some((sonuc) => sonuc.status === 'rejected'));
    } catch {
      setHata(true);
    } finally {
      setYukleniyor(false);
      setTercihlerHazir(true);
    }
  }, []);

  useEffect(() => {
    if (!tercihlerHazir) return;
    void yerellestirmeyiSakla(dil, paraBirimi).catch(islemHatasiniGoster);
  }, [dil, paraBirimi, tercihlerHazir]);

  // Dil seçim sayfasında dil değişince sunucuya da yazılır (sunucu yalnız tr/en tutar, bkz. `dilKaydet`).
  const sunucuyaYazilanDil = useRef(dil);
  useEffect(() => {
    if (!tercihlerHazir || dil === sunucuyaYazilanDil.current) return;
    sunucuyaYazilanDil.current = dil;
    void dilKaydet(dil).catch(yerellestirmeYazmaBasarisiz);
  }, [dil, tercihlerHazir]);

  useFocusEffect(
    useCallback(() => {
      void oku();
    }, [oku]),
  );

  function yazmaBasarisiz() {
    islemHatasiniGoster();
    void oku();
  }

  function yerellestirmeYazmaBasarisiz() {
    islemHatasiniGoster();
  }

  async function gunSiniriSec(deger: `${GunSiniriSaat}`) {
    const saat = Number(deger) as GunSiniriSaat;
    setGunSiniri(saat);
    await gunSiniriKaydet(saat);
  }

  async function odemeSec(deger: OdemeTipi) {
    setOdeme(deger);
    await varsayilanOdemeKaydet(deger);
  }

  async function paraBirimiSec(deger: ParaBirimi) {
    setParaBirimi(deger);
    await paraBirimiKaydet(deger);
  }

  async function veriyiSil() {
    setVeriSiliniyor(true);
    try {
      await tumVeriyiSil();
      setVeriSilAcik(false);
      veriDegisti();
      router.replace('/onboarding');
    } finally {
      setVeriSiliniyor(false);
    }
  }

  async function verileriDisaAktar() {
    try {
      const [butce, rutinler, abonelikler, favoriler, birikimler, harcamalar] = await Promise.all([
        budgetGet(), routinesGet(), subscriptionsGet(), favoritesGet(), movementsGet(''), tumSayfalariGetir({}),
      ]);
      await Share.share({
        title: t['ui.settings.export_title'],
        message: JSON.stringify({ surum: 1, aktarim_tarihi: new Date().toISOString(), butce, rutinler, abonelikler, favoriler, birikimler, harcamalar }, null, 2),
      });
    } catch { toastGoster({ tur: 'warning', metin: t['ui.settings.export_failed'] }); }
  }

  async function oturumuKapatVeGirisEkraninaDon() {
    await oturumuKapat();
    // K-080 — hesapsız kullanım yok; çıkış sonrası giriş ekranına düşer.
    // K-082/2 — üstteki yığın da kapatılır (geri tuşuyla eskiye dönülemez).
    // Kök koruyucu oturum değişiminde yığını kaldırır.
  }

  async function hesabiSilOnayla() {
    setHesapSiliniyor(true);
    try {
      await hesabiSil();
      setHesapSilAcik(false);
      // K-080 — hesap silinince uygulama kullanılamaz, giriş ekranına düşer.
      // Kök koruyucu oturum değişiminde yığını kaldırır.
    } catch {
      // Ağ/sunucu hatası — hesap yerelde "silinmiş" gösterilmez, diyalog
      // açık kalır (K-029: geri alınamaz işlemde sessiz başarısızlık yok).
      toastGoster({ tur: 'warning', metin: t['hata.okuma.govde'] });
    } finally {
      setHesapSiliniyor(false);
    }
  }

  function hizliErisimSonucunuGoster(sonuc: HizliErisimSonucu) {
    if (sonuc === 'requested') {
      toastGoster({ tur: 'info', metin: t['ui.settings.quick_requested'] });
    } else if (sonuc === 'added') {
      toastGoster({ tur: 'info', metin: t['ui.settings.quick_added'] });
    } else if (sonuc === 'already_added') {
      toastGoster({ tur: 'info', metin: t['ui.settings.quick_already_added'] });
    } else if (sonuc === 'dismissed') {
      toastGoster({ tur: 'info', metin: t['ui.settings.quick_dismissed'] });
    } else if (sonuc === 'manual_opened') {
      toastGoster({ tur: 'info', metin: t['ui.settings.quick_manual'] });
    } else if (sonuc === 'manual_required') {
      toastGoster({ tur: 'info', metin: t['ui.settings.quick_manual_required'] });
    } else {
      toastGoster({ tur: 'warning', metin: t['ui.settings.quick_unavailable'] });
    }
  }

  async function anaEkranWidgetiEkle() {
    if (Platform.OS === 'ios') {
      setWidgetYardimiAcik(true);
      return;
    }
    setHizliErisimIslemi('widget');
    try {
      hizliErisimSonucunuGoster(await anaEkranWidgetiIste());
    } catch {
      hizliErisimSonucunuGoster('unavailable');
    } finally {
      setHizliErisimIslemi(null);
    }
  }

  async function hizliAyarKutusunuEkle() {
    setHizliErisimIslemi('tile');
    try {
      hizliErisimSonucunuGoster(await hizliAyarKutusunuIste());
    } catch {
      hizliErisimSonucunuGoster('unavailable');
    } finally {
      setHizliErisimIslemi(null);
    }
  }

  const saglayiciEtiketi: Record<string, string> = {
    google: t['ayar.hesap.saglayici.google'], apple: t['ayar.hesap.saglayici.apple'], eposta: t['ayar.hesap.saglayici.sifre'],
  };
  const gunSiniriSecenekleri: { value: `${GunSiniriSaat}`; label: string }[] = [
    { value: '0', label: t['ayar.gun_siniri.0'] }, { value: '3', label: t['ayar.gun_siniri.3'] }, { value: '6', label: t['ayar.gun_siniri.6'] },
  ];
  const odemeSecenekleri: { value: OdemeTipi; label: string; icon: 'banknote' | 'credit-card' }[] = [
    { value: 'nakit', label: t['ekle.odeme.nakit'], icon: 'banknote' }, { value: 'kart', label: t['ekle.odeme.kart'], icon: 'credit-card' },
  ];

  if (yukleniyor) {
    return (
      <View style={stil.ekran}>
        <View style={{ height: insets.top, backgroundColor: color.navDark }} />
        <PushHeader baslik={t['ayar.baslik']} onGeri={() => router.back()} />
        <View style={[stil.panel, stil.pad]}>
          <Skeleton width="100%" height={140} borderRadius={radius.card} />
          <View style={{ height: rhythm.section }} />
          <Skeleton width="100%" height={100} borderRadius={radius.card} />
          <View style={{ height: rhythm.section }} />
          <Skeleton width="100%" height={220} borderRadius={radius.card} />
        </View>
      </View>
    );
  }

  return (
    <View style={stil.ekran}>
      <View style={{ height: insets.top, backgroundColor: color.navDark }} />
      <PushHeader baslik={t['ayar.baslik']} onGeri={() => router.back()} />

      <ScrollView style={stil.kaydir} contentContainerStyle={stil.scrollIcerik} showsVerticalScrollIndicator={false}>
        <View style={[stil.panel, stil.pad, { paddingBottom: layout.scrollPadBottom + insets.bottom }]}>
        {hata ? (
          <>
            <InfoStrip variant="warning" icon="refresh-cw" metin={t['ui.settings.load_error']} />
            <View style={{ height: rhythm.group }} />
            <Button label={t['ui.settings.retry']} variant="ghost" icon="refresh-cw" auto onPress={() => void oku()} />
            <View style={{ height: rhythm.section }} />
          </>
        ) : null}
        {uyelikEtkin ? (
          <>
            <Txt role="h2">{t['premium.ayar.baslik']}</Txt>
            <View style={{ height: rhythm.blockInCard }} />
            <SettingGroup>
              {uyelik.premium ? (
                <SettingRow
                  icon="crown"
                  iconTone="orange"
                  baslik={t['premium.ayar.aktif']}
                  aciklama={metin('premium.ayar.yonet', { magaza: MAGAZA_ADI })}
                  onPress={() => void aboneligiYonet()}
                />
              ) : (
                <SettingRow
                  icon="crown"
                  iconTone="orange"
                  baslik={t['premium.ayar.gec']}
                  aciklama={t['premium.ayar.gec.alt']}
                  onPress={() => router.push({ pathname: '/premium', params: { tur: 'indirim', kaynak: 'ayarlar' } })}
                />
              )}
              <SettingRow
                icon="refresh-cw"
                iconTone="neutral"
                baslik={t['premium.eylem.geri_yukle']}
                disabled={geriYukleniyor}
                onPress={() => void satinAlimlariGeriYukle()}
              />
            </SettingGroup>
            <View style={{ height: rhythm.section }} />
          </>
        ) : null}
        <Txt role="h2">{t['ui.settings.defaults']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <View style={stil.bolum}>
          <Txt role="bodyStrong">{t['ayar.dil']}</Txt>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="caption" tone={color.text2}>{t['ayar.dil_aciklama']}</Txt>
          <View style={{ height: rhythm.blockInCard }} />
          <SettingRow
            icon="globe"
            iconTone="primary"
            baslik={dilAdi(dil)}
            onPress={() => setDilSheetAcik(true)}
            accessibilityLabel={dilA11yEtiketi(dil)}
          />
          <View style={stil.bolumAyraci} />
          <Txt role="bodyStrong">{t['ayar.para_birimi']}</Txt>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="caption" tone={color.text2}>{t['ayar.para_birimi_aciklama']}</Txt>
          <View style={{ height: rhythm.blockInCard }} />
          <SegmentedControl secenekler={[{ value: 'TRY' as ParaBirimi, label: '₺ TL' }, { value: 'USD' as ParaBirimi, label: '$ USD' }, { value: 'EUR' as ParaBirimi, label: '€ EUR' }]} deger={paraBirimi} onChange={(v) => void paraBirimiSec(v).catch(yerellestirmeYazmaBasarisiz)} />
          <View style={stil.bolumAyraci} />
          <Txt role="bodyStrong">{t['ayar.gun_siniri']}</Txt>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="caption" tone={color.text2}>{t['ayar.gun_siniri_aciklama']}</Txt>
          <View style={{ height: rhythm.blockInCard }} />
          <SegmentedControl secenekler={gunSiniriSecenekleri} deger={`${gunSiniri}` as `${GunSiniriSaat}`} onChange={(v) => void gunSiniriSec(v).catch(yazmaBasarisiz)} />
          <View style={stil.bolumAyraci} />
          <Txt role="bodyStrong">{t['ayar.varsayilan_odeme']}</Txt>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="caption" tone={color.text2}>{t['ayar.odeme_aciklama']}</Txt>
          <View style={{ height: rhythm.blockInCard }} />
          <SegmentedControl secenekler={odemeSecenekleri} deger={odeme} onChange={(v) => void odemeSec(v).catch(yazmaBasarisiz)} />
        </View>

        <View style={{ height: rhythm.section }} />

        <Txt role="h2">{t['ui.settings.quick_access']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <SettingGroup>
          <SettingRow
            icon="mic"
            iconTone="pink"
            baslik={t['ui.settings.widget_title']}
            aciklama={Platform.OS === 'ios' ? t['ui.settings.widget_description.ios'] : t['ui.settings.widget_description.android']}
            disabled={hizliErisimIslemi !== null}
            onPress={() => void anaEkranWidgetiEkle()}
          />
          {Platform.OS === 'android' ? (
            <SettingRow
              icon="bell"
              iconTone="primary"
              baslik={t['ui.settings.quick_tile_title']}
              aciklama={t['ui.settings.quick_tile_description']}
              disabled={hizliErisimIslemi !== null}
              onPress={() => void hizliAyarKutusunuEkle()}
            />
          ) : null}
        </SettingGroup>
        <View style={{ height: rhythm.group }} />
        <InfoStrip variant="info" icon="mic" metin={t['ui.settings.quick_access_note']} />

        <View style={{ height: rhythm.section }} />

        {/* Hesap — D-2c-2: gerçek oturuma bağlandı; D-2c-3/K-080: hesap
            zorunlu, çıkış/silme sonrası `_layout.tsx`'in giriş duvarı
            devreye girer (bkz. src/lib/hesapEylemleri.ts). */}
        <Txt role="h2">{t['ui.settings.account_data']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <View style={stil.bolum}>
          <Txt role="h2">{t['ayar.hesap.baslik']}</Txt>
          <View style={{ height: rhythm.group }} />
          {oturum ? (
            <AccountSection
              variant="signed-in"
              eposta={oturum.email}
              saglayiciEtiketi={saglayiciEtiketi[oturum.kimlikSaglayici] ?? t['ayar.hesap.saglayici.sifre']}
              onCikisYap={() => void oturumuKapatVeGirisEkraninaDon().catch(yazmaBasarisiz)}
              onHesabiSil={() => router.push('/hesap-sil')}
            />
          ) : (
            <AccountSection variant="signed-out" onOturumAcKapisi={() => router.push('/giris')} />
          )}
          <View style={stil.bolumAyraci} />
          <Txt role="bodyStrong">{t['ayar.veri']}</Txt>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="caption" tone={color.text2}>{t['ayar.veri_aciklama']}</Txt>
          <View style={{ height: rhythm.blockInCard }} />
          <Button label={t['ui.settings.export_data']} variant="secondary" onPress={() => void verileriDisaAktar()} />
          <View style={{ height: rhythm.group }} />
          <Button label={t['ayar.veri_sil']} variant="ghost" icon="trash" auto disabled={kayitAdedi === 0} onPress={() => setVeriSilAcik(true)} />
        </View>

        <View style={{ height: rhythm.section }} />

        <Txt role="h2">{t['ui.settings.support']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <SettingGroup>
          <SettingRow icon="info" iconTone="primary" baslik={t['ui.settings.help_title']} aciklama={t['ui.settings.help_description']} onPress={() => router.push('/yardim')} />
          <SettingRow icon="eye" iconTone="neutral" baslik={t['ui.settings.legal_title']} aciklama={t['ui.settings.legal_description']} onPress={() => router.push('/legal')} />
        </SettingGroup>

        <View style={{ height: rhythm.section }} />
        <Txt role="micro" tone={color.text2}>
          {ayarSurum('1.0.0')}
        </Txt>
        </View>
      </ScrollView>

      <BottomSheet visible={widgetYardimiAcik} onClose={() => setWidgetYardimiAcik(false)}>
        <Txt role="h2">{t['ui.settings.widget_help_title']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <InfoStrip variant="info" icon="mic" metin={t['ui.settings.widget_help_body']} />
        <View style={{ height: rhythm.pad }} />
        <Button
          label={t['ui.settings.widget_help_action']}
          icon="mic"
          variant="primary"
          onPress={() => {
            setWidgetYardimiAcik(false);
            router.push('/harcama-ekle?sesli=1');
          }}
        />
        <View style={{ height: rhythm.pad }} />
      </BottomSheet>

      {/* Dil — 11 dil; seçim anında uygulanır ve cihazda saklanır. */}
      <DilSecimSheet visible={dilSheetAcik} onClose={() => setDilSheetAcik(false)} />

      <Dialog
        visible={veriSilAcik}
        baslik={t['ayar.veri_sil_baslik']}
        govde={t['ayar.veri_sil_govde']}
        ozet={
          <InfoStrip
            variant="danger"
            icon="notebook"
            metin={ilkKayitAyYil ? ayarVeriSilOzet(kayitAdedi, ilkKayitAyYil) : `${kayitAdedi}`}
          />
        }
        silEtiketi={t['ayar.veri_sil']}
        vazgecEtiketi={t['eylem.vazgec']}
        siliniyor={veriSiliniyor}
        onSil={() => void veriyiSil().catch(yazmaBasarisiz)}
        onVazgec={() => setVeriSilAcik(false)}
      />

      <Dialog
        visible={hesapSilAcik}
        baslik={t['hesapsil.baslik']}
        govde={t['hesapsil.govde']}
        ozet={<InfoStrip variant="danger" icon="notebook" metin={hesapsilVeri(kayitAdedi)} />}
        silEtiketi={t['hesapsil.eylem']}
        vazgecEtiketi={t['eylem.vazgec']}
        siliniyor={hesapSiliniyor}
        onSil={() => void hesabiSilOnayla().catch(yazmaBasarisiz)}
        onVazgec={() => setHesapSilAcik(false)}
      />
    </View>
  );
}

const stil = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: color.navDark },
  kaydir: { flex: 1 },
  scrollIcerik: { flexGrow: 1 },
  panel: {
    flex: 1,
    backgroundColor: color.surface,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    paddingTop: rhythm.section,
  },
  pad: { paddingHorizontal: layout.screenPaddingX },
  kart: { padding: rhythm.pad },
  bolum: { padding: rhythm.pad, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.tile },
  bolumAyraci: { height: 1, backgroundColor: color.line, marginVertical: rhythm.pad },
});
