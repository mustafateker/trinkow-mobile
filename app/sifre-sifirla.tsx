import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { AuthShell } from '@/components/AuthShell';
import { PasswordField } from '@/components/PasswordField';
import { Button } from '@/components/Button';
import { InfoStrip } from '@/components/InfoStrip';
import { Txt } from '@/components/Txt';
import { ApiHatasi, sifreyiYenile } from '@/lib/api';
import { oturumSil } from '@/lib/oturumDeposu';
import { rhythm } from '@/theme/tokens';
import { t } from '@/content/metinler';
import { useDil } from '@/i18n/useDil';
export default function SifreSifirla() {
  useDil();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [sifre, setSifre] = useState('');
  const [tekrar, setTekrar] = useState('');
  const [mesgul, setMesgul] = useState(false);
  const [bitti, setBitti] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  async function kaydet() {
    if (mesgul || !token) return;
    if (sifre.length < 8 || sifre !== tekrar) { setHata(t['sifre_sifirla.hata.sifre']); return; }
    setMesgul(true); setHata(null);
    try { await sifreyiYenile(token, sifre); setBitti(true); await oturumSil(); }
    catch (e) { setHata(e instanceof ApiHatasi && e.durum === 400 ? t['sifre_sifirla.hata.baglanti_gecersiz'] : t['sifre_sifirla.hata.genel']); }
    finally { setMesgul(false); }
  }
  return <AuthShell title={t['ui.password.reset_title']} subtitle={t['ui.password.reset_subtitle']} onBack={() => router.replace('/giris')}>
    {bitti ? <><Txt role="body">{t['ui.password.reset_success']}</Txt><View style={{ height: rhythm.blockInCard }} /><Button label={t['ui.login.submit']} variant="primary" onPress={() => router.replace('/giris')} /></> : <>
      {hata || !token ? <InfoStrip variant="warning" icon="info" metin={hata ?? t['sifre_sifirla.hata.baglanti_eksik']} /> : null}
      {hata || !token ? <View style={{ height: rhythm.blockInCard }} /> : null}
      <PasswordField label={t['ui.password.new']} value={sifre} onChangeText={setSifre} autoComplete="new-password" textContentType="newPassword" />
      <View style={{ height: rhythm.blockInCard }} />
      <PasswordField label={t['ui.password.confirm_new']} value={tekrar} onChangeText={setTekrar} autoComplete="new-password" textContentType="newPassword" />
      <View style={{ height: rhythm.blockInCard }} />
      <Button label={t['ui.password.reset']} variant="primary" loading={mesgul} disabled={!token || sifre.length < 8 || !tekrar} onPress={() => void kaydet()} />
      <Button label={t['ui.password.request_link']} variant="ghost" onPress={() => router.replace('/sifremi-unuttum')} />
    </>}
  </AuthShell>;
}
