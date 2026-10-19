import { useState } from 'react';
import { router } from 'expo-router';
import { SettingsPage } from '@/components/SettingsPage';
import { Button } from '@/components/Button';
import { SettingRow } from '@/components/SettingRow';
import { InfoStrip } from '@/components/InfoStrip';
import { Txt } from '@/components/Txt';
import { hesabiSil } from '@/lib/hesapEylemleri';
import { t } from '@/content/metinler';
export default function HesapSil() {
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
  return <SettingsPage baslik={t['ui.account.delete_title']}>
    <InfoStrip variant="danger" icon="trash" metin={t['ui.account.delete_warning']} />
    <Txt role="body">{t['ui.account.delete_body']}</Txt>
    <SettingRow baslik={t['ui.account.delete_confirm']} anahtarDegeri={onay} onAnahtarDegistir={() => setOnay(!onay)} disabled={mesgul} />
    {hata ? <InfoStrip variant="warning" icon="info" metin={t['ui.account.delete_error']} /> : null}
    <Button label={t['ui.account.delete']} variant="danger" disabled={!onay} loading={mesgul} onPress={() => void sil()} />
    <Button label={t['ui.common.cancel']} variant="ghost" disabled={mesgul} onPress={() => router.back()} />
  </SettingsPage>;
}
