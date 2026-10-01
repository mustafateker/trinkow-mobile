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
export default function SifreSifirla() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [sifre, setSifre] = useState('');
  const [tekrar, setTekrar] = useState('');
  const [mesgul, setMesgul] = useState(false);
  const [bitti, setBitti] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  async function kaydet() {
    if (mesgul || !token) return;
    if (sifre.length < 8 || sifre !== tekrar) { setHata('En az 8 karakterlik şifre gir ve iki alanda aynı şifreyi kullan.'); return; }
    setMesgul(true); setHata(null);
    try { await sifreyiYenile(token, sifre); setBitti(true); await oturumSil(); }
    catch (e) { setHata(e instanceof ApiHatasi && e.durum === 400 ? 'Bağlantı geçersiz veya süresi dolmuş. Yeni bağlantı iste.' : 'Şifre yenilenemedi. Yeniden dene.'); }
    finally { setMesgul(false); }
  }
  return <AuthShell title="Yeni şifre belirle" subtitle="Hesabın için güçlü ve hatırlayabileceğin bir şifre seç." onBack={() => router.replace('/giris')}>
    {bitti ? <><Txt role="body">Şifren yenilendi. Tüm cihazlardaki eski oturumların kapatıldı.</Txt><View style={{ height: rhythm.blockInCard }} /><Button label="Giriş yap" variant="primary" onPress={() => router.replace('/giris')} /></> : <>
      {hata || !token ? <InfoStrip variant="warning" icon="info" metin={hata ?? 'Şifre yenileme bağlantısı eksik. Yeni bağlantı iste.'} /> : null}
      {hata || !token ? <View style={{ height: rhythm.blockInCard }} /> : null}
      <PasswordField label="Yeni şifre" value={sifre} onChangeText={setSifre} autoComplete="new-password" textContentType="newPassword" />
      <View style={{ height: rhythm.blockInCard }} />
      <PasswordField label="Yeni şifre tekrar" value={tekrar} onChangeText={setTekrar} autoComplete="new-password" textContentType="newPassword" />
      <View style={{ height: rhythm.blockInCard }} />
      <Button label="Şifreyi yenile" variant="primary" loading={mesgul} disabled={!token || sifre.length < 8 || !tekrar} onPress={() => void kaydet()} />
      <Button label="Yeni bağlantı iste" variant="ghost" onPress={() => router.replace('/sifremi-unuttum')} />
    </>}
  </AuthShell>;
}
