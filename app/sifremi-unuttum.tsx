import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { AuthShell } from '@/components/AuthShell';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { Txt } from '@/components/Txt';
import { InfoStrip } from '@/components/InfoStrip';
import { ApiHatasi, sifirlamaIste } from '@/lib/api';
import { rhythm } from '@/theme/tokens';
import { t } from '@/content/metinler';
export default function SifremiUnuttum() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [mesgul, setMesgul] = useState(false);
  const [bitti, setBitti] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  async function gonder() {
    if (mesgul) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setHata('Geçerli bir e-posta adresi gir.'); return; }
    setMesgul(true); setHata(null);
    try { await sifirlamaIste(email.trim()); setBitti(true); }
    catch (e) { setHata(e instanceof ApiHatasi && e.durum === 503 ? 'Şifre kurtarma şu anda kullanılamıyor. Daha sonra yeniden dene.' : 'İstek gönderilemedi. Bağlantını kontrol edip yeniden dene.'); }
    finally { setMesgul(false); }
  }
  return <AuthShell title={t['ui.password.forgot_title']} subtitle={t['ui.password.forgot_subtitle']} onBack={() => router.back()}>
    <Txt role="body">{t['ui.password.forgot_body']}</Txt>
    <View style={{ height: rhythm.blockInCard }} />
    {hata ? <InfoStrip variant="warning" icon="info" metin={hata} /> : null}
    {hata ? <View style={{ height: rhythm.blockInCard }} /> : null}
    {bitti ? <InfoStrip variant="info" icon="info" metin={t['ui.password.forgot_notice']} /> : <>
      <TextField label={t['ui.password.email']} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
      <View style={{ height: rhythm.blockInCard }} />
      <Button label={t['ui.password.send_link']} variant="primary" loading={mesgul} disabled={!email.trim()} onPress={() => void gonder()} />
    </>}
  </AuthShell>;
}
