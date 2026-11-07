import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ClayPressable } from '@/components/ClayPressable';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { InfoStrip } from '@/components/InfoStrip';
import { LegalConsentText } from '@/components/LegalConsentText';
import { PremiumOzellikleri } from '@/components/PremiumOzellikleri';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { metin } from '@/i18n/cekirdek';
import { useDil } from '@/i18n/useDil';
import { toastGoster } from '@/lib/toastBus';
import { posthog } from '@/config/posthog';
import {
  MAGAZA_ADI,
  geriYukle,
  paywallPaketleri,
  satinAl,
  standartPaywallGosterildi,
  useUyelik,
  type PaywallPaketi,
  type PaywallTuru,
} from '@/lib/uyelik';
import { clay, color, layout, radius, rhythm } from '@/theme/tokens';

/**
 * Trinkow Premium paywall'ı. `kaynak` ekranın nereden açıldığını ve
 * kullanıcının sonra nereye gideceğini belirler:
 *  - `kayit`: kayıttan hemen sonra, onboarding'den önce. Standart fiyat,
 *    "Şimdilik geç" onboarding'e götürür.
 *  - `onboarding`: onboarding bitince. %50 indirim ve 7 gün deneme,
 *    "Ücretsiz devam et" ana ekrana götürür.
 *  - `kilit` / `ayarlar`: kilitli sekme ya da Ayarlar. İndirimli teklif,
 *    kapatılınca geldiği ekrana döner.
 */
type Kaynak = 'kayit' | 'onboarding' | 'kilit' | 'ayarlar';
const KAYNAKLAR: Kaynak[] = ['kayit', 'onboarding', 'kilit', 'ayarlar'];

function devamEt(kaynak: Kaynak) {
  if (kaynak === 'kayit') router.replace('/onboarding');
  else if (kaynak === 'onboarding') router.replace('/');
  else if (router.canGoBack()) router.back();
  else router.replace('/');
}

function donemliFiyat(paket: PaywallPaketi): string {
  return metin(paket.donem === 'yillik' ? 'premium.fiyat.yillik' : 'premium.fiyat.aylik', { fiyat: paket.fiyat });
}

export default function PremiumEkrani() {
  useDil();
  const insets = useSafeAreaInsets();
  const parametreler = useLocalSearchParams<{ tur?: string; kaynak?: string }>();
  const tur: PaywallTuru = parametreler.tur === 'indirim' ? 'indirim' : 'standart';
  const kaynak: Kaynak = KAYNAKLAR.find((k) => k === parametreler.kaynak) ?? 'kayit';
  const kapatilabilir = kaynak === 'kilit' || kaynak === 'ayarlar';
  const { premium } = useUyelik();

  const [paketler, setPaketler] = useState<PaywallPaketi[] | null>(null);
  const [yuklemeHatasi, setYuklemeHatasi] = useState(false);
  const [yuklemeDenemesi, setYuklemeDenemesi] = useState(0);
  const [seciliKimlik, setSeciliKimlik] = useState<string | null>(null);
  const [mesgul, setMesgul] = useState<'satin' | 'geri' | null>(null);
  const [satinAlmaHatasi, setSatinAlmaHatasi] = useState(false);

  useEffect(() => {
    let iptal = false;
    paywallPaketleri(tur)
      .then((sonuc) => {
        if (!iptal) setPaketler(sonuc);
      })
      .catch(() => {
        if (!iptal) setYuklemeHatasi(true);
      });
    return () => {
      iptal = true;
    };
  }, [tur, yuklemeDenemesi]);

  useEffect(() => {
    if (kaynak === 'kayit') standartPaywallGosterildi();
  posthog?.capture('paywall_viewed', {
    paywall_type: tur,
    paywall_source: kaynak,
  });
}, [kaynak, tur]);

function vazgec(eylemTuru: 'atla' | 'kapat') {
  posthog?.capture('paywall_dismissed', {
    paywall_type: tur,
    paywall_source: kaynak,
    dismiss_action: eylemTuru,
    selected_package: secili?.donem ?? null,
    has_trial: secili?.denemeGunu !== null,
  });
  devamEt(kaynak);
}

function tekrarDene() {
  setYuklemeHatasi(false);
  setPaketler(null);
  setYuklemeDenemesi((n) => n + 1);
}

const secili = paketler?.find((paket) => paket.kimlik === seciliKimlik) ?? paketler?.[0] ?? null;
const denemeGunu = secili?.denemeGunu ?? null;
const rozetYuzdesi = tur === 'indirim' ? (paketler?.find((paket) => paket.indirimYuzdesi !== null)?.indirimYuzdesi ?? null) : null;
const ikincilEtiket =
  kaynak === 'kayit' ? t['premium.eylem.atla'] : kaynak === 'onboarding' ? t['premium.eylem.ucretsiz_devam'] : t['eylem.simdi_degil'];

async function satinAlmayiBaslat() {
  if (!secili || mesgul) return;
  posthog?.capture('paywall_purchase_started', {
    billing_period: secili.donem,
    paywall_source: kaynak,
    paywall_type: tur,
    has_trial: secili.denemeGunu !== null,
  });
  setMesgul('satin');
  setSatinAlmaHatasi(false);
  const sonuc = await satinAl(secili.paket);
  setMesgul(null);
  if (sonuc === 'premium') {
    posthog?.capture('premium_purchased', { billing_period: secili.donem, paywall_source: kaynak, has_trial: secili.denemeGunu !== null });
    toastGoster({ tur: 'info', metin: t['premium.toast.basarili'] });
    devamEt(kaynak);
  } else if (sonuc === 'beklemede') {
    toastGoster({ tur: 'info', metin: t['premium.toast.beklemede'] });
    devamEt(kaynak);
  } else if (sonuc === 'iptal') {
    posthog?.capture('paywall_purchase_cancelled', { billing_period: secili.donem, paywall_source: kaynak });
  } else if (sonuc === 'hata') {
    posthog?.capture('paywall_purchase_failed', { billing_period: secili.donem, paywall_source: kaynak });
    setSatinAlmaHatasi(true);
  }
}

async function geriYuklemeyiBaslat() {
  if (mesgul) return;
  setMesgul('geri');
  try {
    const acildi = await geriYukle();
    toastGoster({ tur: 'info', metin: acildi ? t['premium.toast.geri_yuklendi'] : t['premium.toast.geri_yukleme_yok'] });
    if (acildi) devamEt(kaynak);
  } catch {
    toastGoster({ tur: 'warning', metin: t['premium.toast.geri_yukleme_hata'] });
  } finally {
    setMesgul(null);
  }
}

return (
  <View style={stil.ekran}>
    <View style={{ height: insets.top, backgroundColor: color.navDark }} />
    <ScrollView style={stil.kaydir} contentContainerStyle={stil.kaydirIcerik} showsVerticalScrollIndicator={false}>
      <View style={stil.kahraman}>
        {kapatilabilir ? (
          <View style={stil.kapatSatiri}>
            <IconButton
              icon="x"
              accessibilityLabel={t['eylem.kapat']}
              tone="#FFFFFF"
              background={color.navGlassBg}
              pressedBackground={color.navGlassBgPressed}
              onPress={() => vazgec('kapat')}
            />
          </View>
        ) : null}

        <View style={stil.heroRozetSatiri}>
          <View style={stil.heroIkonKapsayici}>
            <View style={stil.heroIkonGlow} />
            <View style={stil.tac}>
              <Icon name="crown" size={28} color={color.warning} />
            </View>
          </View>
          {rozetYuzdesi !== null && !premium ? (
            <View style={stil.indirimRozet}>
              <Icon name="sparkles" size={14} color={color.warning} />
              <Txt role="label" tone={color.warning}>
                {metin('premium.rozet.indirim', { yuzde: rozetYuzdesi }).toUpperCase()}
              </Txt>
            </View>
          ) : null}
        </View>

        <View style={{ height: rhythm.group }} />
        <Txt role="h1" tone="#FFFFFF">
          {t['premium.baslik']}
        </Txt>
        <View style={{ height: rhythm.group }} />
        <Txt role="body" tone={color.navMuted}>
          {t[tur === 'indirim' ? 'premium.alt.indirim' : 'premium.alt.standart']}
        </Txt>
      </View>

      <View style={stil.panel}>
        {premium ? (
          <View style={stil.aktifKart}>
            <Icon name="check" size={24} color={color.successInk} />
            <View style={{ height: rhythm.group }} />
            <Txt role="h2">{t['premium.aktif.baslik']}</Txt>
            <View style={{ height: rhythm.sameObject }} />
            <Txt role="body" tone={color.text2}>
              {t['premium.aktif.govde']}
            </Txt>
          </View>
        ) : (
          <>
            <PremiumOzellikleri compact />
            <View style={{ height: rhythm.section }} />
            {yuklemeHatasi ? (
              <>
                <InfoStrip variant="warning" icon="wifi-off" metin={t['premium.hata.yukleme']} />
                <View style={{ height: rhythm.blockInCard }} />
                <Button variant="secondary" icon="refresh-cw" label={t['genel.yeniden_dene']} onPress={tekrarDene} />
              </>
            ) : paketler === null ? (
              <View style={stil.planlar}>
                <Skeleton width="100%" height={92} borderRadius={radius.card} />
                <Skeleton width="100%" height={76} borderRadius={radius.card} />
              </View>
            ) : (
              <View style={stil.planlar}>
                {paketler.map((paket) => (
                  <PlanKarti
                    key={paket.kimlik}
                    paket={paket}
                    secili={paket.kimlik === secili?.kimlik}
                    onPress={() => {
                      setSeciliKimlik(paket.kimlik);
                      posthog?.capture('paywall_package_selected', {
                        billing_period: paket.donem,
                        has_trial: paket.denemeGunu !== null,
                        is_discounted: paket.indirimYuzdesi !== null,
                      });
                    }}
                  />
                ))}
              </View>
            )}
            {secili ? (
              <>
                <View style={{ height: rhythm.blockInCard }} />
                <Txt role="micro">
                  {denemeGunu !== null
                    ? metin('premium.not.deneme', { gun: denemeGunu, fiyat: donemliFiyat(secili), magaza: MAGAZA_ADI })
                    : metin('premium.not.abonelik', { fiyat: donemliFiyat(secili), magaza: MAGAZA_ADI })}
                </Txt>
              </>
            ) : null}
            <View style={{ height: rhythm.section }} />
            <Button
              variant="ghost"
              auto
              icon="refresh-cw"
              label={t['premium.eylem.geri_yukle']}
              loading={mesgul === 'geri'}
              loadingLabel={t['premium.isleniyor']}
              disabled={mesgul === 'satin'}
              onPress={() => void geriYuklemeyiBaslat()}
            />
            <View style={{ height: rhythm.group }} />
            <LegalConsentText
              metin={t['premium.yasal']}
              onLinkPress={(indeks) => router.push({ pathname: '/legal', params: { belge: indeks === 0 ? 'kosullar' : 'gizlilik' } })}
            />
          </>
        )}
      </View>
    </ScrollView>

    <View style={[stil.altSabit, { paddingBottom: Math.max(insets.bottom, rhythm.group) }]}>
      {premium ? (
        <Button variant="primary" label={t['premium.eylem.devam']} onPress={() => devamEt(kaynak)} />
      ) : (
        <>
          {satinAlmaHatasi ? (
            <>
              <Txt role="caption" tone={color.warningInk}>
                {t['premium.hata.satin_alma']}
              </Txt>
              <View style={{ height: rhythm.group }} />
            </>
          ) : null}
          <View style={stil.guvenceSatiri}>
            <Icon name="shield-check" size={14} color={color.text3} />
            <Txt role="micro" tone={color.text3}>
              İstediğin zaman {MAGAZA_ADI} üzerinden tek tıkla iptal et
            </Txt>
          </View>
          <Button
            variant="primary"
            icon="crown"
            label={denemeGunu !== null ? metin('premium.eylem.deneme', { gun: denemeGunu }) : t['premium.eylem.satin_al']}
            loading={mesgul === 'satin'}
            loadingLabel={t['premium.isleniyor']}
            disabled={secili === null || mesgul === 'geri'}
            onPress={() => void satinAlmayiBaslat()}
          />
          <View style={{ height: rhythm.group }} />
          <Button variant="ghost" label={ikincilEtiket} disabled={mesgul !== null} onPress={() => vazgec('atla')} />
        </>
      )}
    </View>
  </View>
);
}

function PlanKarti({ paket, secili, onPress }: { paket: PaywallPaketi; secili: boolean; onPress: () => void }) {
  const yillik = paket.donem === 'yillik';
  const etiket = t[yillik ? 'premium.plan.yillik' : 'premium.plan.aylik'];
  const fiyat = donemliFiyat(paket);
  const deneme = paket.denemeGunu !== null ? metin('premium.deneme.gun', { gun: paket.denemeGunu }) : null;
  const ustuCizili = paket.indirimYuzdesi !== null ? paket.standartFiyat : null;

  return (
    <ClayPressable
      onPress={onPress}
      selected={secili}
      accessibilityLabel={[etiket, fiyat, deneme].filter(Boolean).join(', ')}
      borderRadius={radius.card}
      background={secili ? '#F5F6FF' : color.surface}
      pressedBackground={color.groove}
      shadow={secili ? clay.raised : clay.raised}
      pressedShadow={clay.pressed}
      style={[stil.plan, secili ? stil.planSecili : stil.planSeciliDegil]}>
      {yillik ? (
        <View style={stil.avantajBadge}>
          <Icon name="sparkles" size={14} color="#FFFFFF" />
          <Txt role="micro" tone="#FFFFFF">
            {t['premium.plan.en_avantajli'].toUpperCase()}
          </Txt>
        </View>
      ) : null}

      <View style={[stil.secimGostergesi, secili ? stil.secimGostergesiSecili : null]}>
        {secili ? <Icon name="check" size={14} color="#FFFFFF" strokeWidth={2.5} /> : null}
      </View>

      <View style={stil.planOrta}>
        <View style={stil.planBaslik}>
          <Txt role="bodyStrong">{etiket}</Txt>
        </View>
        {yillik && paket.aylikKarsilik ? (
          <Txt role="caption" tone={color.primaryText}>
            {metin('premium.fiyat.aylik_karsilik', { fiyat: paket.aylikKarsilik })}
          </Txt>
        ) : null}
        {deneme ? (
          <Txt role="caption" tone={color.successInk}>
            {deneme}
          </Txt>
        ) : (
          <Txt role="caption" tone={color.text3}>
            {yillik ? 'Yıllık faturalandırılır' : 'Aylık yenilenir'}
          </Txt>
        )}
      </View>

      <View style={stil.planFiyat}>
        {ustuCizili ? (
          <Txt role="caption" tone={color.text3} style={stil.ustuCizili}>
            {ustuCizili}
          </Txt>
        ) : null}
        <Txt role="amount" tone={secili ? color.primary : color.text}>
          {fiyat}
        </Txt>
      </View>
    </ClayPressable>
  );
}

const stil = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: color.navDark },
  kaydir: { flex: 1, minHeight: 0, backgroundColor: color.navDark },
  kaydirIcerik: { flexGrow: 1 },
  kahraman: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.headerPadTop,
    paddingBottom: rhythm.pad,
  },
  kapatSatiri: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: rhythm.group },
  heroRozetSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: rhythm.blockInCard,
  },
  heroIkonKapsayici: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIkonGlow: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
  },
  tac: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indirimRozet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: rhythm.blockInCard,
    paddingVertical: rhythm.sameObject,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  panel: {
    flex: 1,
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: rhythm.section,
    paddingBottom: rhythm.section,
  },
  aktifKart: { padding: rhythm.pad, borderRadius: radius.card, backgroundColor: color.successSoft },
  planlar: { gap: rhythm.pad },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rhythm.blockInCard,
    padding: rhythm.pad,
    paddingVertical: 18,
    borderRadius: radius.card,
    position: 'relative',
  },
  planSecili: {
    borderWidth: 2,
    borderColor: color.primary,
  },
  planSeciliDegil: {
    borderWidth: 1.5,
    borderColor: 'rgba(23, 28, 66, 0.08)',
  },
  secimGostergesi: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  secimGostergesiSecili: {
    borderColor: color.primary,
    backgroundColor: color.primary,
  },
  avantajBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: rhythm.group,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: color.primary,
    zIndex: 2,
    shadowColor: '#5C5AF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  planOrta: { flex: 1, minWidth: 0, gap: 2 },
  planBaslik: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: rhythm.group },
  planFiyat: { alignItems: 'flex-end', flexShrink: 0 },
  ustuCizili: { textDecorationLine: 'line-through' },
  altSabit: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: rhythm.blockInCard,
    backgroundColor: color.bg,
    borderTopWidth: 1,
    borderTopColor: color.line,
  },
  guvenceSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: rhythm.group,
  },
});
