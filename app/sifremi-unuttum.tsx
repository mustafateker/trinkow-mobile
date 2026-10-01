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
  return <AuthShell title="Şifreni yenile" subtitle="E-postana güvenli, tek kullanımlık bir bağlantı gönderelim." onBack={() => router.back()}>
    <Txt role="body">E-posta adresine 30 dakika geçerli bir şifre yenileme bağlantısı göndereceğiz.</Txt>
    <View style={{ height: rhythm.blockInCard }} />
    {hata ? <InfoStrip variant="warning" icon="info" metin={hata} /> : null}
    {hata ? <View style={{ height: rhythm.blockInCard }} /> : null}
    {bitti ? <InfoStrip variant="info" icon="info" metin="Bu e-posta ile bir hesabın varsa şifre yenileme bağlantısı gönderilecek. Gelen kutunu ve spam klasörünü kontrol et." /> : <>
      <TextField label="E-posta" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
      <View style={{ height: rhythm.blockInCard }} />
      <Button label="Bağlantı gönder" variant="primary" loading={mesgul} disabled={!email.trim()} onPress={() => void gonder()} />
    </>}
  </AuthShell>;
}
