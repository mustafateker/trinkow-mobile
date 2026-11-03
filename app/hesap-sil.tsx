import { useState } from 'react';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import { SettingsPage } from '@/components/SettingsPage';
import { Button } from '@/components/Button';
import { SettingRow } from '@/components/SettingRow';
import { InfoStrip } from '@/components/InfoStrip';
import { Txt } from '@/components/Txt';
import { hesabiSil } from '@/lib/hesapEylemleri';
import { MAGAZA_ADI, abonelikYonetimAdresi, useUyelik } from '@/lib/uyelik';
import { t } from '@/content/metinler';
import { metin } from '@/i18n/cekirdek';
import { useDil } from '@/i18n/useDil';
export default function HesapSil() {
  useDil();
  const uyelik = useUyelik();
  const [onay, setOnay] = useState(false);
  const [mesgul, setMesgul] = useState(false);
  const [hata, setHata] = useState(false);
  async function sil() {
    if (!onay || mesgul) return;
    setMesgul(true); setHata(false);
    try { await hesabiSil(); }
    catch { setHata(true); }
    finally { setMesgul(false); }
  }
  async function aboneligiYonet() {
    await Linking.openURL(await abonelikYonetimAdresi()).catch(() => {});
  }
  return <SettingsPage baslik={t['ui.account.delete_title']}>
    <InfoStrip variant="danger" icon="trash" metin={t['ui.account.delete_warning']} />
    <Txt role="body">{t['ui.account.delete_body']}</Txt>
    {/* Hesap silmek mağazadaki aboneliği iptal etmez; Premium kullanıcı ücretlendirilmeye devam etmesin. */}
    {uyelik.premium ? <>
      <InfoStrip variant="warning" icon="info" metin={metin('premium.hesap_sil.uyari', { magaza: MAGAZA_ADI })} />
      <Button label={metin('premium.ayar.yonet', { magaza: MAGAZA_ADI })} variant="ghost" disabled={mesgul} onPress={() => void aboneligiYonet()} />
    </> : null}
    <SettingRow baslik={t['ui.account.delete_confirm']} anahtarDegeri={onay} onAnahtarDegistir={() => setOnay(!onay)} disabled={mesgul} />
    {hata ? <InfoStrip variant="warning" icon="info" metin={t['ui.account.delete_error']} /> : null}
    <Button label={t['ui.account.delete']} variant="danger" disabled={!onay} loading={mesgul} onPress={() => void sil()} />
    <Button label={t['ui.common.cancel']} variant="ghost" disabled={mesgul} onPress={() => router.back()} />
  </SettingsPage>;
}
