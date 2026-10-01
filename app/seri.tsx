import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ClaySurface } from '@/components/ClaySurface';
import { ErrorState } from '@/components/ErrorState';
import { PushHeader } from '@/components/PushHeader';
import { Skeleton } from '@/components/Skeleton';
import { MilestoneRail } from '@/components/streak/MilestoneRail';
import { Legend } from '@/components/streak/Legend';
import { StreakDayGrid } from '@/components/streak/StreakDayGrid';
import { Txt } from '@/components/Txt';
import { seriAktifGovde, seriDurakKalan, seriDurakSonraki, SERI_PENCERE_BASLIK, t } from '@/content/metinler';
import { useSeriEkrani } from '@/db/useSeriEkrani';
import { clay, color, layout, radius, rhythm } from '@/theme/tokens';

/**
 * E-21 · Seri. Referans: prototip-v4/13-seri.html (5 durum).
 * Rozet/puan/seviye/lig YOK (K-048) — bu ekran bir çetele, kupa vitrini değil.
 */
export default function SeriEkrani() {
  const insets = useSafeAreaInsets();
  const veri = useSeriEkrani();

  return (
    <View style={stil.ekran}>
      <View style={{ height: insets.top, backgroundColor: color.navDark }} />
      <PushHeader baslik={t['seri.baslik']} onGeri={() => router.back()} />
      <ScrollView contentContainerStyle={stil.scrollIcerik} showsVerticalScrollIndicator={false}>
        <View style={stil.panel}>
        {veri.hata ? (
          <View style={stil.pad}>
            <ErrorState onRetry={veri.yenile} />
          </View>
        ) : veri.yukleniyor || !veri.durum ? (
          <SeriIskeleti />
        ) : veri.durum.kapali ? (
          <SeriKapali enUzunSeri={veri.durum.enUzunSeri} enUzunSeriEtiketi={veri.durum.enUzunSeriEtiketi} />
        ) : (
          <>
            <View style={stil.pad}>
              <ClaySurface level="raised" borderRadius={radius.hero} style={stil.heroKart}>
                <View style={stil.heroOrta}>
                  <Txt role="hero">{veri.durum.mevcutSeri}</Txt>
                  <Txt role="label" tone={color.text2}>
                    {t['seri.hero.birim']}
                  </Txt>
                  <View style={{ height: rhythm.blockInCard }} />
                  <Txt role="body" style={stil.ortali}>
                    {veri.durum.mevcutSeri > 0
                      ? seriAktifGovde(veri.durum.mevcutSeri)
                      : veri.durum.kirildiMi
                        ? t['seri.kirildi']
                        : t['seri.bos.govde']}
                  </Txt>
                </View>
                <View style={{ height: rhythm.blockInCard }} />
                <View style={stil.enUzunKuyu}>
                  <View>
                    <Txt role="bodyStrong">{t['seri.en_uzun']}</Txt>
                    <View style={{ height: 4 }} />
                    <Txt role="caption" tone={color.text2}>
                      {veri.durum.enUzunSeriEtiketi ?? t['seri.en_uzun_bos']}
                    </Txt>
                  </View>
                  <Txt role="amount">
                    {veri.durum.enUzunSeri > 0 ? `${veri.durum.enUzunSeri} ${t['seri.hero.birim']}` : t['seri.en_uzun_bos']}
                  </Txt>
                </View>
              </ClaySurface>
            </View>

            <View style={{ height: rhythm.section }} />
            <View style={[stil.pad, stil.baslikSatiri]}>
              <Txt role="h2">{t['seri.duraklar']}</Txt>
              <Txt role="label" tone={color.text2}>
                {veri.durum.mevcutSeri > 0 && veri.durum.kalanGun !== null
                  ? seriDurakKalan(veri.durum.kalanGun)
                  : veri.durum.sonrakiDurak
                    ? seriDurakSonraki(veri.durum.sonrakiDurak)
                    : ''}
              </Txt>
            </View>
            <View style={{ height: rhythm.group }} />
            <MilestoneRail
              mevcutSeri={veri.durum.mevcutSeri}
              sonrakiDurak={veri.durum.sonrakiDurak}
              oncekiDurak={veri.durum.oncekiDurak}
              aralikYuzde={veri.durum.aralikYuzde}
            />

            <View style={{ height: rhythm.section }} />
            <View style={[stil.pad, stil.baslikSatiri]}>
              <Txt role="h2">{SERI_PENCERE_BASLIK}</Txt>
              <Txt role="label" tone={color.text2}>
                {veri.pencereEtiketi}
              </Txt>
            </View>
            <View style={{ height: rhythm.group }} />
            <View style={stil.pad}>
              <StreakDayGrid gunler={veri.izgara} />
            </View>
            <View style={{ height: rhythm.blockInCard }} />
            <View style={stil.pad}>
              <Legend
                altindaEtiket={t['seri.lejant.altinda']}
                disindaEtiket={t['seri.lejant.disinda']}
                kayitYokEtiket={t['seri.lejant.kayit_yok']}
              />
            </View>

            <SeriKuralKarti />
          </>
        )}
        </View>
      </ScrollView>
    </View>
  );
}

function SeriKuralKarti() {
  return (
    <>
      <View style={{ height: rhythm.section }} />
      <View style={stil.pad}>
        <ClaySurface level="raised" borderRadius={radius.card} style={stil.kuralKart}>
          <Txt role="h2">{t['seri.kural.baslik']}</Txt>
          <View style={{ height: rhythm.group }} />
          <Txt role="body">{t['seri.kural.1']}</Txt>
          <View style={{ height: rhythm.group }} />
          <Txt role="body">{t['seri.kural.2']}</Txt>
        </ClaySurface>
      </View>
      <View style={{ height: rhythm.section }} />
    </>
  );
}

function SeriKapali({
  enUzunSeri,
  enUzunSeriEtiketi,
}: {
  enUzunSeri: number;
  enUzunSeriEtiketi: string | null;
}) {
  return (
    <>
      <View style={stil.pad}>
        <ClaySurface level="raised" borderRadius={radius.hero} style={stil.kuralKart}>
          <Txt role="h2">{t['seri.kapali.baslik']}</Txt>
          <View style={{ height: rhythm.group }} />
          <Txt role="body">{t['seri.kapali.govde']}</Txt>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={color.text2}>
            {t['seri.kapali.ipucu']}
          </Txt>
          <View style={{ height: rhythm.blockInCard }} />
          <Button label={t['kategori.limit_ekle']} variant="secondary" auto onPress={() => router.push('/limitler')} />
          <View style={{ height: rhythm.blockInCard }} />
          <View style={stil.enUzunKuyu}>
            <View>
              <Txt role="bodyStrong">{t['seri.en_uzun']}</Txt>
              <View style={{ height: 4 }} />
              <Txt role="caption" tone={color.text2}>
                {enUzunSeriEtiketi ?? t['seri.en_uzun_bos']}
              </Txt>
            </View>
            <Txt role="amount">{enUzunSeri > 0 ? `${enUzunSeri} ${t['seri.hero.birim']}` : t['seri.en_uzun_bos']}</Txt>
          </View>
        </ClaySurface>
      </View>
      <SeriKuralKarti />
    </>
  );
}

function SeriIskeleti() {
  return (
    <View style={stil.pad}>
      <ClaySurface level="raised" borderRadius={radius.hero} style={stil.heroKart}>
        <Skeleton width={104} height={56} />
        <View style={{ height: rhythm.group }} />
        <Skeleton width={48} height={16} />
        <View style={{ height: rhythm.blockInCard }} />
        <Skeleton width={240} height={16} />
      </ClaySurface>
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
  baslikSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroKart: { padding: rhythm.pad },
  heroOrta: { alignItems: 'center' },
  ortali: { textAlign: 'center' },
  enUzunKuyu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: rhythm.pad,
    borderRadius: radius.tile,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
  },
  kuralKart: { padding: rhythm.pad },
});
