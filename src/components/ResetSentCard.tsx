import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ClaySurface } from '@/components/ClaySurface';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { sifirlaGovde, t } from '@/content/metinler';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri (delta-v4 T-2) `ResetSentCard` — E-22 "Şifremi
 * unuttum" durumu (ayrı ekran DEĞİL, bilinçli tasarım kararı #9). Tek
 * görsel durum; "Yeniden gönder" 60 sn `disabled` kalır — sayaç yerine
 * tek cümle (bilinçli tasarım kararı #5'in aynı gerekçesi: tik tak eden
 * sayı bekleme hissini büyütür).
 *
 * ⚠️ Backend'de şifre sıfırlama ucu YOK (`backend/README.md` uç nokta
 * tablosunda `auth/sifirla` benzeri bir kayıt bulunmuyor) — bu kart bu
 * turda YALNIZ arayüz durumudur, gerçek e-posta gönderilmez (rapora yazıldı).
 */
export function ResetSentCard({
  eposta,
  yenidenGonderPasif,
  onYenidenGonder,
}: {
  eposta: string;
  yenidenGonderPasif: boolean;
  onYenidenGonder: () => void;
}) {
  return (
    <ClaySurface level="raised" borderRadius={radius.card} style={stil.kart}>
      <View style={stil.ikonKuyu}>
        <Icon name="mail-check" size={20} color={color.primaryText} />
      </View>
      <View style={{ height: rhythm.blockInCard }} />
      <Txt role="h2">{t['sifirla.baslik']}</Txt>
      <View style={{ height: rhythm.group }} />
      <Txt role="body">{sifirlaGovde(eposta)}</Txt>
      <View style={{ height: rhythm.group }} />
      <Txt role="caption">{t['sifirla.ipucu']}</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <Button
        label={t['sifirla.yeniden']}
        variant="secondary"
        disabled={yenidenGonderPasif}
        onPress={onYenidenGonder}
      />
      {yenidenGonderPasif ? (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption">{t['sifirla.bekle']}</Txt>
        </>
      ) : null}
    </ClaySurface>
  );
}

const stil = StyleSheet.create({
  kart: { padding: rhythm.pad },
  ikonKuyu: {
    width: 44,
    height: 44,
    borderRadius: radius.tile,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
