import { StyleSheet, View } from 'react-native';

import { Button, type ButtonVariant } from '@/components/Button';
import { ClaySurface } from '@/components/ClaySurface';
import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri §5 `ErrorState`. 96pt çukur daire — boş durumdan
 * FARKLI illüstrasyon. Teknik hata kodu / depolama açıklaması yok.
 *
 * rev2-tasarruf-profil.md §3.10/§7·6 (E-27) — `icon`/metin/`buttonVariant`
 * override edilebilir (`wifi-off` + `secondary` "Yeniden dene"); verilmezse
 * eski varsayılanlar korunur (geriye dönük uyumlu).
 */
export function ErrorState({
  onRetry,
  icon = 'refresh-cw',
  baslik,
  govde,
  butonEtiketi,
  buttonVariant = 'primary',
}: {
  onRetry?: () => void;
  icon?: IconName;
  baslik?: string;
  govde?: string;
  butonEtiketi?: string;
  buttonVariant?: ButtonVariant;
}) {
  return (
    <ClaySurface level="raised" borderRadius={radius.card} style={stil.kart}>
      <View style={stil.disk}>
        <Icon name={icon} size={32} color={color.text2} />
      </View>
      <View style={{ height: rhythm.blockInCard }} />
      <Txt role="h2">{baslik ?? t['hata.okuma.baslik']}</Txt>
      <View style={{ height: rhythm.group }} />
      <Txt role="body" style={stil.metin}>
        {govde ?? t['hata.okuma.govde']}
      </Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <Button
        label={butonEtiketi ?? t['hata.okuma.eylem']}
        variant={buttonVariant}
        icon={buttonVariant === 'primary' ? 'refresh-cw' : undefined}
        onPress={onRetry}
        auto
      />
    </ClaySurface>
  );
}

const stil = StyleSheet.create({
  kart: { padding: rhythm.pad, alignItems: 'center' },
  disk: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: color.groove,
    boxShadow: clay.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metin: { textAlign: 'center' },
});
