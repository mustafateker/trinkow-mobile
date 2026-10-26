import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthShell } from '@/components/AuthShell';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { InfoStrip } from '@/components/InfoStrip';
import { OrDivider } from '@/components/OrDivider';
import { PasswordField } from '@/components/PasswordField';
import { SettingRow } from '@/components/SettingRow';
import { SocialAuthButton } from '@/components/SocialAuthButton';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { ApiAgHatasi, ApiHatasi, GELISTIRME_GIRISI, benKimim, girisYap, googleIleGirisYap, googleYapilandirmasiniGetir } from '@/lib/api';
import { oturumYaz } from '@/lib/oturumDeposu';
import { SosyalGirisHatasi, appleIleDevamEt, googleIleDevamEt, sosyalSaglayicilar } from '@/lib/sosyalGiris';
import { rhythm } from '@/theme/tokens';
import { t } from '@/content/metinler';
import { useDil } from '@/i18n/useDil';

export default function GirisEkrani() {
  useDil();
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [hatirla, setHatirla] = useState(true);
  const [demo, setDemo] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [mesgul, setMesgul] = useState(false);
  const [sosyalMesgul, setSosyalMesgul] = useState(false);
  async function gonder() {
    if (mesgul) return;
    if (!demo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta.trim())) { setHata(t['ui.login.invalid_email']); return; }
    setHata(null); setMesgul(true);
    try {
      const cift = await girisYap(eposta.trim(), sifre, demo);
      const ben = await benKimim(cift.erisimTokeni);
      await oturumYaz({ ...cift, kullaniciId: ben.id, email: ben.email, kimlikSaglayici: ben.kimlikSaglayici }, hatirla);
    } catch (e) {
      setHata(e instanceof ApiHatasi && e.durum === 401 ? t['ui.login.invalid_credentials'] : t['ui.login.failed']);
    } finally { setMesgul(false); }
  }
  async function googleGonder() {
    if (mesgul || sosyalMesgul) return;
    setHata(null); setSosyalMesgul(true);
    try {
      const { webClientId } = await googleYapilandirmasiniGetir();
      const idTokeni = await googleIleDevamEt(webClientId);
      if (!idTokeni) return;
      const cift = await googleIleGirisYap(idTokeni);
      const ben = await benKimim(cift.erisimTokeni);
      await oturumYaz({ ...cift, kullaniciId: ben.id, email: ben.email, kimlikSaglayici: ben.kimlikSaglayici }, hatirla);
    } catch (e) {
      if (e instanceof SosyalGirisHatasi && e.kod === 'yapilandirma') {
        setHata(t['ui.login.google_not_configured']);
      } else if (e instanceof SosyalGirisHatasi && e.kod === 'native-modul') {
        setHata(t['ui.login.google_native_required']);
      } else if (e instanceof SosyalGirisHatasi && e.kod === 'play-services') {
        setHata(t['ui.login.google_play_services']);
      } else if (e instanceof SosyalGirisHatasi && e.kod === 'oauth-yapilandirma') {
        setHata(t['ui.login.google_signature_mismatch']);
      } else if (e instanceof ApiHatasi && e.hataKodu === 'GOOGLE_GIRISI_YAPILANDIRILMADI') {
        setHata(t['ui.login.google_unavailable']);
      } else if (e instanceof ApiHatasi && e.hataKodu === 'GECERSIZ_GOOGLE_KIMLIGI') {
        setHata(t['ui.login.google_invalid']);
      } else if (e instanceof ApiHatasi && e.hataKodu === 'GOOGLE_DOGRULAMA_KULLANILAMIYOR') {
        setHata(t['ui.login.google_verification_unavailable']);
      } else if (e instanceof ApiAgHatasi) {
        setHata(t['ui.login.google_network_failed']);
      } else {
        setHata(t['ui.login.google_failed']);
      }
    } finally { setSosyalMesgul(false); }
  }
  return <AuthShell title={t['ui.login.title']} subtitle={t['ui.login.tagline']} onBack={router.canGoBack() ? () => router.back() : undefined}>
        {hata ? <InfoStrip variant="warning" icon="info" metin={hata} /> : null}
        {hata ? <View style={{ height: rhythm.blockInCard }} /> : null}
        <TextField label={demo ? t['ui.login.test_name'] : t['alan.eposta']} value={eposta} onChangeText={setEposta} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
        <View style={{ height: rhythm.blockInCard }} />
        <PasswordField label={t['alan.sifre']} value={sifre} onChangeText={setSifre} autoComplete="current-password" textContentType="password" />
        <View style={{ height: rhythm.group }} />
        <View style={stil.hatirlaSatiri}>
          <View style={stil.hatirla}><Checkbox checked={hatirla} onPress={() => setHatirla(!hatirla)} label={t['ui.login.remember']} /></View>
          <Button label={t['ui.login.forgot']} variant="ghost" textRole="label" auto onPress={() => router.push('/sifremi-unuttum')} />
        </View>
        <View style={{ height: rhythm.blockInCard }} />
        <Button label={t['ui.login.submit']} loadingLabel={t['ui.login.loading']} variant="primary" loading={mesgul} disabled={sosyalMesgul || !eposta.trim() || !sifre} onPress={() => void gonder()} />
        <View style={{ height: rhythm.section }} />
        <OrDivider />
        <View style={{ height: rhythm.blockInCard }} />
        {sosyalSaglayicilar().map((provider, index) => <View key={provider}>{index > 0 ? <View style={{ height: rhythm.group }} /> : null}<SocialAuthButton provider={provider} disabled={mesgul || sosyalMesgul || provider === 'apple'} onPress={() => void (provider === 'apple' ? appleIleDevamEt() : googleGonder())} /></View>)}
        {GELISTIRME_GIRISI ? <><View style={{ height: rhythm.blockInCard }} /><SettingRow baslik={t['ui.login.dev_title']} aciklama={t['ui.login.dev_description']} anahtarDegeri={demo} onAnahtarDegistir={() => setDemo(!demo)} /></> : null}
        <View style={{ height: rhythm.section }} />
        <View style={stil.altSatir}><Txt role="caption">{t['ui.login.no_account']}</Txt><Button label={t['ui.login.create_account']} variant="ghost" textRole="label" auto onPress={() => router.replace('/kayit')} /></View>
        <Button label={t['ui.login.legal']} variant="ghost" textRole="caption" onPress={() => router.push('/legal')} />
  </AuthShell>;
}
const stil = StyleSheet.create({
  hatirlaSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hatirla: { flex: 1, minWidth: 0 },
  altSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rhythm.group },
});
