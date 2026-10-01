import { useState } from 'react';
import { router } from 'expo-router';
import { SettingsPage } from '@/components/SettingsPage';
import { Button } from '@/components/Button';
import { SettingRow } from '@/components/SettingRow';
import { InfoStrip } from '@/components/InfoStrip';
import { Txt } from '@/components/Txt';
import { hesabiSil } from '@/lib/hesapEylemleri';
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
  return <SettingsPage baslik="Hesabımı sil">
    <InfoStrip variant="danger" icon="trash" metin="Bu işlem geri alınamaz." />
    <Txt role="body">Hesabın, gelir ve borç bilgilerin, harcamaların, rutinlerin, sık kullanılanların ve bütçe geçmişin silinir. Tüm oturumların kapanır.</Txt>
    <SettingRow baslik="Hesabımın ve kayıtlarımın silinmesini istiyorum" anahtarDegeri={onay} onAnahtarDegistir={() => setOnay(!onay)} disabled={mesgul} />
    {hata ? <InfoStrip variant="warning" icon="info" metin="Hesap silinemedi. Bağlantını kontrol et ve yeniden dene. İşlem tamamlandı olarak işaretlenmedi." /> : null}
    <Button label="Hesabımı kalıcı olarak sil" variant="danger" disabled={!onay} loading={mesgul} onPress={() => void sil()} />
    <Button label="Vazgeç" variant="ghost" disabled={mesgul} onPress={() => router.back()} />
  </SettingsPage>;
}
