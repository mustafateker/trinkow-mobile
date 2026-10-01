import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '@/components/Chip';
import { ClaySurface } from '@/components/ClaySurface';
import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { InfoStrip } from '@/components/InfoStrip';
import { Skeleton } from '@/components/Skeleton';
import { Legend } from '@/components/streak/Legend';
import { MonthGrid } from '@/components/streak/MonthGrid';
import { MonthNav } from '@/components/streak/MonthNav';
import { Txt } from '@/components/Txt';
import { gunsecAltAcikGun, gunsecAltKayitli, gunsecOzetBasligi, gunsecSinirBaslangic, t } from '@/content/metinler';
import { useGunSecici, type GunSeciciGunu } from '@/db/useGunSecici';
import { gunSecildi } from '@/lib/gunSeciciBus';
import { paraYaz } from '@/lib/para';
import {
  ayAdiTek,
  ayAnahtari,
  ayBasligi,
  ayAnahtariFarkli,
  gunEkle,
  gunFarkiHesapla,
  kisaTarih,
  uzunTarih,
} from '@/lib/tarih';
import { color, layout, radius, rhythm, size } from '@/theme/tokens';

/**
 * E-24 · Gün seçici. Referans: prototip-v4/14-gun-secici.html (5 durum).
 * Ay ızgarası; gün seçilince Günlük o güne gider (`?gun=<fark>`).
 *
 * K-064/2 — Günlük'ten bugün olmayan bir günde açılırsa `acikGun` (fark)
 * parametresi gelir. Seçim halkası kaldırıldığı için (K-061) o gün ızgarada
 * görsel olarak işaretlenmez; bunun yerine ay başlığının altında
 * "Açık gün {g} {Ay}" yazılı olarak söylenir (`gunsec.alt.acik_gun`,
 * metinler.md §24). Açık gün bugünse ya da görüntülenen aydan farklıysa bu
 * cümle anlamsızdır, o durumda normal "{n} gün kayıtlı" özetine dönülür.
 *
 * D-2d-2 düzeltmesi — `kip=sec` (F-18 `gun-btn`, E-11 harcama ekle): bir güne
 * dokunmak Günlük'e GİTMEZ, seçilen gün `gunSeciciBus` ile çağıran ekrana
 * bildirilip `router.back()` ile geri dönülür. Parametre yoksa (Günlük'ten
 * açılan orijinal akış) davranış AYNEN korunur.
 */
export default function GunSeciciEkrani() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ acikGun?: string; kip?: string }>();
  const secimKipiMi = params.kip === 'sec';
  const acikGunFarki = params.acikGun !== undefined ? Number.parseInt(params.acikGun, 10) : null;
  const bugun = new Date();
  const acikGunTarihi =
    acikGunFarki !== null && Number.isFinite(acikGunFarki) && acikGunFarki !== 0
      ? gunEkle(bugun, acikGunFarki)
      : null;

  const [ay, setAy] = useState(() => ayAnahtari(acikGunTarihi ?? new Date()));
  const veri = useGunSecici(ay);
  const enSonAyMi = ay >= veri.enSonAy;
  const ilkAyMi = ay <= veri.ilkAy;

  const acikGunAltMetin =
    acikGunTarihi && ayAnahtari(acikGunTarihi) === ay ? gunsecAltAcikGun(kisaTarih(acikGunTarihi)) : null;

  function gunSec(gun: GunSeciciGunu) {
    const fark = gunFarkiHesapla(gun.tarih, bugun);
    if (secimKipiMi) {
      gunSecildi(fark);
      router.back();
      return;
    }
    router.replace(`/?gun=${fark}` as never);
  }

  return (
    <View style={stil.ekran}>
      <View style={{ height: insets.top, backgroundColor: color.navDark }} />
      <View style={stil.koyuBasi}>
        <IconButton
          icon="chevron-left"
          accessibilityLabel={t['eylem.geri']}
          tone="#FFFFFF"
          background={color.navGlassBg}
          pressedBackground={color.navGlassBgPressed}
          onPress={() => router.back()}
        />
        <View style={stil.ortaBaslik}>
          <Txt role="h2" tone="#FFFFFF" numberOfLines={1}>
            {t['gunsec.baslik']}
          </Txt>
        </View>
        {enSonAyMi ? (
          <View style={stil.denge} />
        ) : (
          <Chip ad={t['gunsec.bugune_don']} onPress={() => setAy(veri.enSonAy)} />
        )}
      </View>

      <ScrollView contentContainerStyle={stil.scrollIcerik} showsVerticalScrollIndicator={false}>
        <View style={stil.panel}>
        <View style={stil.pad}>
          <MonthNav
            baslik={ayBasligi(ay)}
            altMetin={
              acikGunAltMetin ??
              (veri.ozet.kayitliGun > 0 ? gunsecAltKayitli(veri.ozet.kayitliGun) : t['gunsec.alt.kayit_yok'])
            }
            oncekiPasif={ilkAyMi}
            sonrakiPasif={enSonAyMi}
            onOnceki={() => setAy((a) => ayAnahtariFarkli(a, -1))}
            onSonraki={() => setAy((a) => ayAnahtariFarkli(a, 1))}
          />
        </View>

        {/* K-049/K-055 sınırı — bu ay içinde ilk kayıt/kurulum gününden önceki günler var */}
        {ilkAyMi && !veri.yukleniyor ? (
          <>
            <View style={{ height: rhythm.pad }} />
            <View style={stil.pad}>
              <InfoStrip
                variant="info"
                metin={gunsecSinirBaslangic(uzunTarih(veri.gunler.find((g) => !g.pasif)?.tarih ?? bugun))}
              />
            </View>
          </>
        ) : null}

        <View style={{ height: rhythm.pad }} />

        {veri.hata ? (
          <View style={stil.pad}>
            <ErrorState onRetry={veri.yenile} />
          </View>
        ) : veri.yukleniyor ? (
          <View style={stil.pad}>
            <ClaySurface level="raised" borderRadius={radius.card} style={stil.izgaraKart}>
              <Skeleton width="100%" height={220} borderRadius={16} />
            </ClaySurface>
          </View>
        ) : veri.ozet.kayitliGun === 0 && ilkAyMi && enSonAyMi ? (
          <View style={stil.pad}>
            <ClaySurface level="raisedLg" borderRadius={radius.card} style={stil.bosKart}>
              <Txt role="h2">{t['gunsec.bos.baslik']}</Txt>
              <View style={{ height: rhythm.group }} />
              <Txt role="body" style={stil.ortali}>
                {t['gunsec.bos.govde']}
              </Txt>
            </ClaySurface>
          </View>
        ) : (
          <>
            <View style={stil.pad}>
              <ClaySurface level="raised" borderRadius={radius.card} style={stil.izgaraKart}>
                <MonthGrid ay={ay} gunler={veri.gunler} onGunSec={gunSec} />
                <View style={{ height: rhythm.pad }} />
                <Legend
                  altindaEtiket={t['gunsec.lejant.altinda']}
                  disindaEtiket={t['gunsec.lejant.disinda']}
                  kayitYokEtiket={t['gunsec.lejant.kayit_yok']}
                />
                <View style={{ height: rhythm.group }} />
                <Txt role="micro" tone={color.text2}>
                  {t['gunsec.lejant.bugun']}
                </Txt>
              </ClaySurface>
            </View>

            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <ClaySurface level="raised" borderRadius={radius.card} style={stil.izgaraKart}>
                <Txt role="h2">{gunsecOzetBasligi(ayAdiTek(ay))}</Txt>
                <View style={{ height: rhythm.blockInCard }} />
                <OzetSatiri etiket={t['gunsec.ozet.kayitli_gun']} deger={String(veri.ozet.kayitliGun)} />
                <View style={{ height: rhythm.blockInCard }} />
                <OzetSatiri etiket={t['gunsec.ozet.limit_alti']} deger={String(veri.ozet.limitAltiGun)} />
                <View style={{ height: rhythm.blockInCard }} />
                <OzetSatiri etiket={t['gunsec.ozet.biriken']} deger={paraYaz(veri.ozet.birikenKurus)} />
              </ClaySurface>
            </View>
          </>
        )}

        <View style={{ height: rhythm.section }} />
        </View>
      </ScrollView>
    </View>
  );
}

function OzetSatiri({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <View style={stil.ozetSatiri}>
      <Txt role="body" style={stil.esnek}>
        {etiket}
      </Txt>
      <Txt role="amount">{deger}</Txt>
    </View>
  );
}

const stil = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: color.navDark },
  scrollIcerik: { flexGrow: 1 },
  panel: {
    flex: 1,
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    paddingTop: rhythm.section,
    paddingBottom: layout.scrollPadBottom,
  },
  pad: { paddingHorizontal: layout.screenPaddingX },
  koyuBasi: {
    backgroundColor: color.navDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: layout.headerPadTop,
    paddingBottom: layout.headerPadBottom,
    paddingHorizontal: layout.screenPaddingX,
  },
  ortaBaslik: { flex: 1, minWidth: 0, alignItems: 'center' },
  denge: { width: size.iconButton, height: size.iconButton },
  izgaraKart: { padding: rhythm.pad },
  bosKart: { padding: rhythm.pad, alignItems: 'center' },
  ortali: { textAlign: 'center' },
  ozetSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  esnek: { flex: 1, minWidth: 0 },
});
