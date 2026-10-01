import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri §5 `AccountSection` (E-19) — `signed-in` (e-posta çukuru
 * + sağlayıcı satırı + Çıkış yap + Hesabı sil) / `signed-out` (tek nötr
 * satır). Hesap hiçbir özelliği KİLİTLEMEZ (K-052); tek davet burasıdır.
 *
 * D-2c-1 kapsamı: yalnız GÖRÜNÜM. `onCikisYap`/`onHesabiSil` bu turda
 * `src/lib/hesapEylemleri.ts`'teki iskelet fonksiyonlara bağlanır — gerçek
 * oturum/backend D-2c-2'de gelir (bkz. rapor).
 */
export function AccountSection({
  variant,
  eposta,
  saglayiciEtiketi,
  onCikisYap,
  onHesabiSil,
  onOturumAcKapisi,
}: {
  variant: 'signed-in' | 'signed-out';
  eposta?: string;
  saglayiciEtiketi?: string;
  onCikisYap?: () => void;
  onHesabiSil?: () => void;
  onOturumAcKapisi?: () => void;
}) {
  if (variant === 'signed-out') {
    return (
      <View>
        <Txt role="caption">{t['ayar.hesap.kapali']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <Button label={t['ayar.hesap.kapali_kapi']} variant="secondary" onPress={onOturumAcKapisi} />
      </View>
    );
  }

  return (
    <View>
      <Txt role="caption">{t['ayar.hesap.aciklama']}</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <View style={stil.kuyu}>
        <Txt role="label" tone={color.text2}>
          {t['ayar.hesap.eposta']}
        </Txt>
        <View style={{ height: rhythm.sameObject }} />
        <Txt role="body" numberOfLines={1} ellipsizeMode="tail" accessibilityLabel={`Hesap e-postası ${eposta}`}>
          {eposta}
        </Txt>
      </View>
      <View style={{ height: rhythm.group }} />
      <Txt role="caption">{saglayiciEtiketi}</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <Button label={t['ayar.hesap.cikis']} variant="ghost" icon="log-out" auto onPress={onCikisYap} />
      <View style={{ height: rhythm.group }} />
      <Txt role="caption">{t['ayar.hesap.cikis_not']}</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <Button label={t['ayar.hesap.sil']} variant="ghost" icon="trash" auto onPress={onHesabiSil} />
    </View>
  );
}

const stil = StyleSheet.create({
  kuyu: {
    backgroundColor: color.well,
    boxShadow: clay.sunken,
    borderRadius: radius.tile,
    padding: rhythm.pad,
  },
});
