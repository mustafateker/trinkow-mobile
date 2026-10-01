import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MoneyInput } from '@/components/MoneyInput';
import { Txt } from '@/components/Txt';
import { useBuyukYaziMi } from '@/lib/erisilebilirlik';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * rev2-onboarding-kayit.md §4.3 — `ValueWellRow`un düzenlenebilir ikizi.
 * YENİ varyant, yeni bileşen değil. `birim` parametresi ZORUNLU: kuyunun
 * son eki gövdeye gömülü değildir (B5 bulgusu — "Günlük adet" alanında
 * yanlışlıkla `₺` yazılıyordu). Kuyu genişliği iki durumda da 144 sabit.
 *
 * Ö5: `fontScale > 1.3` iken satır dikey düzene döner (etiket üstte tam
 * genişlik, sarar; kuyu altında, genişliği yine 144). Eşik tek yardımcıdan
 * (`useBuyukYaziMi`) okunur — ekrana dağıtılmaz (K-040).
 */
export function MoneyRow({
  label,
  value,
  onChangeText,
  onBlur,
  birim,
  error,
  accessibilityLabel,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  onBlur?: () => void;
  /** `"₺"` → değer + 8 + ₺ · `""` → son ek yok (integer alan, `number-pad`). */
  birim: '₺' | '';
  error?: string;
  accessibilityLabel?: string;
}) {
  const [odakli, setOdakli] = useState(false);
  const dikey = useBuyukYaziMi();
  const halka = error ? color.danger : odakli ? color.primaryText : null;

  const kuyu = (
    <View style={[stil.kuyu, { boxShadow: halka ? `${clay.sunken}, 0 0 0 2px ${halka}` : clay.sunken }]}>
      <MoneyInput
        hideLabel
        integerOnly={birim === ''}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setOdakli(true)}
        onBlur={() => {
          setOdakli(false);
          onBlur?.();
        }}
        label={accessibilityLabel ?? label}
        style={stil.girdi}
      />
      {birim ? (
        <>
          <View style={{ width: rhythm.group }} />
          <Txt role="label" tone={color.text2}>
            {birim}
          </Txt>
        </>
      ) : null}
    </View>
  );

  return (
    <View>
      <View style={dikey ? stil.satirDikey : stil.satir}>
        {dikey ? (
          <Txt role="body">{label}</Txt>
        ) : (
          <Txt role="body" style={stil.etiket} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Txt>
        )}
        {dikey ? <View style={{ height: rhythm.group }} /> : null}
        {kuyu}
      </View>
      {error ? (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={color.dangerInk}>
            {error}
          </Txt>
        </>
      ) : null}
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 56 },
  satirDikey: { flexDirection: 'column', alignItems: 'flex-start' },
  etiket: { flex: 1, minWidth: 0, marginRight: rhythm.blockInCard },
  kuyu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 144,
    height: 44,
    paddingHorizontal: rhythm.blockInCard,
    borderRadius: radius.tile,
    backgroundColor: color.well,
  },
  girdi: {
    flexShrink: 1,
    minWidth: 0,
    backgroundColor: 'transparent',
    minHeight: 0,
    padding: 0,
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'right',
  },
});
