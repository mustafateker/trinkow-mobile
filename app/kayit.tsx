import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthShell } from '@/components/AuthShell';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { InfoStrip } from '@/components/InfoStrip';
import { LegalConsentText } from '@/components/LegalConsentText';
import { PasswordField } from '@/components/PasswordField';
import { PasswordRuleLine } from '@/components/PasswordRuleLine';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { ApiAgHatasi, ApiHatasi, benKimim, kayitOl } from '@/lib/api';
import { kayitGonderPasifMi, sifreTekrarHatasi } from '@/lib/kayitKurallari';
import { oturumYaz } from '@/lib/oturumDeposu';
import { color, rhythm } from '@/theme/tokens';

const EPOSTA_BICIMI = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIFRE_MIN_UZUNLUK = 8;

/**
 * D-2c-3 · E-16 Hesap oluştur — rev2-onboarding-kayit.md §7 (REV2-r1).
 * K-080 ile "Hesapsız devam et" YOK — hesap zorunlu. `PushHeader` KAYAR
 * (§7.0 — bu ekranın kendine özgü kararı, kurulumun sabit gösterge kuralı
 * BURAYA uygulanmaz). Mahremiyet şeridi ve tek pasif onay cümlesi
 * kaldırıldı; yerine iki `Checkbox` + iki 44pt `button.ghost` belge satırı
 * geldi (Ö4). Sosyal düğmeler ETKİN kalır (B1) — onaysız dokunuşta akış
 * durur, iki `Checkbox` `error` olur.
 */
export default function KayitEkrani() {
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const [epostaHata, setEpostaHata] = useState<string | null>(null);
  const [sifreTekrarHata, setSifreTekrarHata] = useState<string | null>(null);
  const [onayKosullar, setOnayKosullar] = useState(false);
  const [onayGizlilik, setOnayGizlilik] = useState(false);
  const [onayHata, setOnayHata] = useState(false);
  const [agHatasi, setAgHatasi] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const kuralKarsilandi = sifre.length >= SIFRE_MIN_UZUNLUK;

  function epostaBicimDogrula() {
    if (eposta.trim().length === 0) return;
    setEpostaHata(EPOSTA_BICIMI.test(eposta.trim()) ? null : t['hata.eposta_bicim']);
  }

  function sifreTekrarDogrula() {
    setSifreTekrarHata(sifreTekrarHatasi(sifre, sifreTekrar));
  }

  function onayIsaretle(hangi: 'kosullar' | 'gizlilik') {
    if (hangi === 'kosullar') setOnayKosullar((v) => !v);
    else setOnayGizlilik((v) => !v);
    if (onayHata) setOnayHata(false);
  }

  const gonderPasif = kayitGonderPasifMi({
    eposta,
    sifreKuralKarsilandi: kuralKarsilandi,
    sifre,
    sifreTekrar,
    onayKosullar,
    onayGizlilik,
  });

  async function gonder() {
    if (gonderPasif || gonderiliyor) return;
    if (!EPOSTA_BICIMI.test(eposta.trim())) {
      setEpostaHata(t['hata.eposta_bicim']);
      return;
    }
    if (sifre !== sifreTekrar) {
      setSifreTekrarHata(t['hata.sifre_eslesmiyor']);
      return;
    }
    setEpostaHata(null);
    setSifreTekrarHata(null);
    setAgHatasi(false);
    setGonderiliyor(true);
    try {
      const cift = await kayitOl(eposta.trim(), sifre);
      const ben = await benKimim(cift.erisimTokeni);
      await oturumYaz({
        erisimTokeni: cift.erisimTokeni,
        yenilemeTokeni: cift.yenilemeTokeni,
        kullaniciId: ben.id,
        email: ben.email,
        kimlikSaglayici: ben.kimlikSaglayici,
      });
      // Yönlendirmeyi kök oturum koruyucusu yapar.
    } catch (hata) {
      if (hata instanceof ApiAgHatasi) {
        setAgHatasi(true);
      } else if (hata instanceof ApiHatasi && hata.durum === 409) {
        setEpostaHata(t['hata.eposta_kayitli']);
      } else {
        setAgHatasi(true);
      }
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <AuthShell title="Hesabını oluştur" subtitle="Günlük harcamalarını birkaç saniyede görmeye başla." onBack={() => router.replace('/giris')}>

          {agHatasi ? (
            <>
              <InfoStrip variant="warning" icon="wifi-off" metin={`${t['hata.baglanti.kayit']} ${t['hata.baglanti.kayit.ek']}`} />
              <View style={{ height: rhythm.section }} />
            </>
          ) : null}

          <TextField
            label={t['alan.eposta']}
            placeholder={t['alan.eposta_ph']}
            value={eposta}
            onChangeText={(v) => {
              setEposta(v);
              if (epostaHata) setEpostaHata(null);
            }}
            onBlur={epostaBicimDogrula}
            error={epostaHata ?? undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            accessibilityLabel={t['alan.eposta']}
          />
          <View style={{ height: rhythm.blockInCard }} />
          <PasswordField
            label={t['alan.sifre']}
            placeholder={t['alan.sifre_ph.kayit']}
            value={sifre}
            onChangeText={setSifre}
            autoComplete="new-password"
            textContentType="newPassword"
            accessibilityLabel={t['alan.sifre']}
          />
          <View style={{ height: rhythm.group }} />
          <PasswordRuleLine met={kuralKarsilandi} />

          <View style={{ height: rhythm.blockInCard }} />
          <PasswordField
            label={t['alan.sifre_tekrar']}
            placeholder={t['alan.sifre_tekrar_ph']}
            value={sifreTekrar}
            onChangeText={(v) => {
              setSifreTekrar(v);
              if (sifreTekrarHata) setSifreTekrarHata(null);
            }}
            onBlur={sifreTekrarDogrula}
            error={sifreTekrarHata ?? undefined}
            autoComplete="new-password"
            textContentType="newPassword"
            accessibilityLabel={t['alan.sifre_tekrar']}
          />

          <View style={{ height: rhythm.section }} />
          <Checkbox
            checked={onayKosullar}
            onPress={() => onayIsaretle('kosullar')}
            error={onayHata}
            label={<LegalConsentText metin="**Kullanım şartlarını** okudum, kabul ediyorum." onLinkPress={() => router.push({ pathname: '/legal', params: { belge: 'kosullar' } })} />}
            accessibilityLabel={t['a11y.onay.kosullar']}
          />
          <View style={{ height: rhythm.group }} />
          <Checkbox
            checked={onayGizlilik}
            onPress={() => onayIsaretle('gizlilik')}
            error={onayHata}
            label={<LegalConsentText metin="**Gizlilik politikasını** okudum, kabul ediyorum." onLinkPress={() => router.push({ pathname: '/legal', params: { belge: 'gizlilik' } })} />}
            accessibilityLabel={t['a11y.onay.gizlilik']}
          />
          <View style={{ height: rhythm.group }} />
          {onayHata ? (
            <Txt role="caption" tone={color.dangerInk} accessibilityLiveRegion="polite">
              {t['hata.onay_gerekli']}
            </Txt>
          ) : null}

          <View style={{ height: rhythm.section }} />
          <View style={stil.aralik}>
            <Txt role="caption">{t['kayit.giris_kapisi.soru']}</Txt>
            <Button label={t['kayit.giris_kapisi.aksiyon']} variant="ghost" textRole="label" auto onPress={() => router.replace('/giris')} />
          </View>

          <View style={{ height: rhythm.section }} />
          <Button
            label={t['kayit.eylem']}
            loadingLabel={t['kayit.mesgul']}
            variant="primary"
            disabled={gonderPasif}
            loading={gonderiliyor}
            onPress={() => void gonder()}
          />
    </AuthShell>
  );
}

const stil = StyleSheet.create({
  aralik: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
