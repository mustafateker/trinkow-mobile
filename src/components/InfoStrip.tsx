import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri §5 `InfoStrip` — çukur bilgi şeridi. Yargı içermez,
 * sonucu söyler. `danger` yalnız `Dialog` içinde kullanılır (K-029).
 */
export type InfoStripVaryant = 'info' | 'warning' | 'danger';

const zemin: Record<InfoStripVaryant, string> = {
  info: color.primarySoft,
  warning: color.warningSoft,
  danger: color.dangerSoft,
};

const ikonTonu: Record<InfoStripVaryant, string> = {
  info: color.primaryText,
  warning: color.warningInk,
  danger: color.dangerInk,
};

export function InfoStrip({
  variant,
  metin,
  icon = 'info',
  onKapat,
  kapatEtiketi,
  textTone,
}: {
  variant: InfoStripVaryant;
  metin: string;
  icon?: IconName;
  /** v4 E-10 — kaydırma ipucu şeridi gibi kapatılabilir kareler (verilmezse X çizilmez). */
  onKapat?: () => void;
  kapatEtiketi?: string;
  /** rev2-tasarruf-profil.md §3.3/§3.4 — metin rengini varyant mürekkebinin ÜZERİNE yazar (E-27: `text`). Verilmezse davranış ÖNCEKİYLE AYNI. */
  textTone?: string;
}) {
  return (
    <View style={[stil.serit, { backgroundColor: zemin[variant] }]}>
      <Icon name={icon} size={20} color={ikonTonu[variant]} />
      <View style={{ width: rhythm.blockInCard }} />
      <Txt role="caption" tone={textTone ?? ikonTonu[variant]} style={stil.metin}>
        {metin}
      </Txt>
      {onKapat ? (
        <>
          <View style={{ width: rhythm.blockInCard }} />
          <IconButton icon="x" accessibilityLabel={kapatEtiketi ?? 'Kapat'} onPress={onKapat} tone={ikonTonu[variant]} />
        </>
      ) : null}
    </View>
  );
}

const stil = StyleSheet.create({
  serit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: rhythm.blockInCard,
    paddingHorizontal: rhythm.pad,
    borderRadius: radius.tile,
    boxShadow: clay.sunken,
  },
  metin: { flex: 1, minWidth: 0 },
});
