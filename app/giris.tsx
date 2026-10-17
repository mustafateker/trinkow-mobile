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
import { ApiHatasi, GELISTIRME_GIRISI, benKimim, girisYap, googleIleGirisYap, googleYapilandirmasiniGetir } from '@/lib/api';
import { oturumYaz } from '@/lib/oturumDeposu';
import { SosyalGirisHatasi, appleIleDevamEt, googleIleDevamEt, sosyalSaglayicilar } from '@/lib/sosyalGiris';
import { rhythm } from '@/theme/tokens';

export default function GirisEkrani() {
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [hatirla, setHatirla] = useState(true);
  const [demo, setDemo] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [mesgul, setMesgul] = useState(false);
  const [sosyalMesgul, setSosyalMesgul] = useState(false);
  async function gonder() {
    if (mesgul) return;
    if (!demo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta.trim())) { setHata('Geçerli bir e-posta adresi gir.'); return; }
    setHata(null); setMesgul(true);
    try {
      const cift = await girisYap(eposta.trim(), sifre, demo);
      const ben = await benKimim(cift.erisimTokeni);
      await oturumYaz({ ...cift, kullaniciId: ben.id, email: ben.email, kimlikSaglayici: ben.kimlikSaglayici }, hatirla);
    } catch (e) {
      setHata(e instanceof ApiHatasi && e.durum === 401 ? 'E-posta ya da şifre yanlış.' : 'Oturum açılamadı. Bağlantını kontrol edip yeniden dene.');
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
        setHata('Google ile giriş bu uygulama sürümünde yapılandırılmamış.');
      } else if (e instanceof SosyalGirisHatasi && e.kod === 'native-modul') {
        setHata('Google ile giriş için uygulamayı yeniden yükleyip native geliştirme sürümünü aç.');
      } else if (e instanceof SosyalGirisHatasi && e.kod === 'play-services') {
        setHata('Google Play Hizmetleri kullanılamıyor veya güncel değil.');
      } else if (e instanceof ApiHatasi && e.hataKodu === 'GOOGLE_GIRISI_YAPILANDIRILMADI') {
        setHata('Google ile giriş şu anda kullanılamıyor.');
      } else {
        setHata('Google ile oturum açılamadı. Bağlantını kontrol edip yeniden dene.');
      }
    } finally { setSosyalMesgul(false); }
  }
  return <AuthShell title="Hoş geldin" subtitle="Harcama ve Bütçe Takibi ile Evdeki Hesabı Çarşıya Uydur" onBack={router.canGoBack() ? () => router.back() : undefined}>
        {hata ? <InfoStrip variant="warning" icon="info" metin={hata} /> : null}
        {hata ? <View style={{ height: rhythm.blockInCard }} /> : null}
        <TextField label={demo ? 'Test adı' : 'E-posta'} value={eposta} onChangeText={setEposta} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
        <View style={{ height: rhythm.blockInCard }} />
        <PasswordField label="Şifre" value={sifre} onChangeText={setSifre} autoComplete="current-password" textContentType="password" />
        <View style={{ height: rhythm.group }} />
        <View style={stil.hatirlaSatiri}>
          <View style={stil.hatirla}><Checkbox checked={hatirla} onPress={() => setHatirla(!hatirla)} label="Beni hatırla" /></View>
          <Button label="Şifremi unuttum" variant="ghost" textRole="label" auto onPress={() => router.push('/sifremi-unuttum')} />
        </View>
        <View style={{ height: rhythm.blockInCard }} />
        <Button label="Giriş yap" loadingLabel="Giriş yapılıyor…" variant="primary" loading={mesgul} disabled={sosyalMesgul || !eposta.trim() || !sifre} onPress={() => void gonder()} />
        <View style={{ height: rhythm.section }} />
        <OrDivider />
        <View style={{ height: rhythm.blockInCard }} />
        {sosyalSaglayicilar().map((provider, index) => <View key={provider}>{index > 0 ? <View style={{ height: rhythm.group }} /> : null}<SocialAuthButton provider={provider} disabled={mesgul || sosyalMesgul || provider === 'apple'} onPress={() => void (provider === 'apple' ? appleIleDevamEt() : googleGonder())} /></View>)}
        {GELISTIRME_GIRISI ? <><View style={{ height: rhythm.blockInCard }} /><SettingRow baslik="Geliştirme test girişi" aciklama="Yalnız test hesabıyla giriş yapar." anahtarDegeri={demo} onAnahtarDegistir={() => setDemo(!demo)} /></> : null}
        <View style={{ height: rhythm.section }} />
        <View style={stil.altSatir}><Txt role="caption">Hesabın yok mu?</Txt><Button label="Hesap oluştur" variant="ghost" textRole="label" auto onPress={() => router.replace('/kayit')} /></View>
        <Button label="Gizlilik ve kullanım şartları" variant="ghost" textRole="caption" onPress={() => router.push('/legal')} />
  </AuthShell>;
}
const stil = StyleSheet.create({
  hatirlaSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hatirla: { flex: 1, minWidth: 0 },
  altSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rhythm.group },
});
