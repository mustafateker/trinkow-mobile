import { Pressable, StyleSheet, View } from 'react-native';

import { MoneyInput } from '@/components/MoneyInput';
import { ClaySurface } from '@/components/ClaySurface';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { SIMGE } from '@/lib/para';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * F-18 `gun-btn` (delta-v4.md tokens eklentileri) — tutar kuyusunun İÇİNDEKİ
 * dokunulabilir gün çipi. `vurgulu` = geçmiş gün (K-049): zemin
 * `primary-soft`, mürekkep `primary-text` — amber/kırmızı KULLANILMAZ
 * (§1.5, amber yalnız "limit dışı" demek). `tiklanabilir=false` iken (E-11
 * Günlük'ün geçmiş sayfasından `gunFarki` sabit gelince) düz etiket olur.
 */
export type AmountWellGunButonu = {
  etiket: string;
  vurgulu?: boolean;
  tiklanabilir?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/**
 * tokens.md §7.4/§7.11 — tutar kuyusu. Düzenlenirken gerçek native TextInput kullanır. Uzun tutar kuralı (tokens.md §7.11, K-042):
 * gösterim 7 karakteri AŞARSA (8+) `hero` (56pt) → `display` (32pt)
 * rolüne iner, `₺` de bir basamak iner (`display` → `amount`). Kuyu
 * yüksekliği sabit kalır. Prototip üreteci de aynı kurala göre düzeltildi.
 */
export function AmountWell({
  tutarGosterim,
  ustSol,
  ustSag,
  gunButon,
  hata,
  value, onChangeText, autoFocus = false,
}: {
  tutarGosterim: string;
  ustSol: string;
  /** `gunButon` verilmezse düz altyazı olarak kullanılır (ör. E-12 detay ekranı). */
  ustSag: string;
  /** F-18 — verilirse `ustSag` yerine dokunulabilir `gun-btn` çizilir. */
  gunButon?: AmountWellGunButonu;
  hata?: string;
  cursorGoster?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
}) {
  const uzun = tutarGosterim.length > 7;
  const sayiRolu = uzun ? 'display' : 'hero';
  const simgeRolu = uzun ? 'amount' : 'display';

  return (
    <View>
      <ClaySurface
        level="sunken"
        borderRadius={radius.tile}
        style={[stil.kuyu, hata ? { boxShadow: `${clay.sunken}, 0 0 0 2px ${color.danger}` } : null]}>
        <View style={stil.ustSatir}>
          <Txt role="label" tone={color.text2}>
            {ustSol}
          </Txt>
          {gunButon ? <GunButonu {...gunButon} /> : <Txt role="caption">{ustSag}</Txt>}
        </View>
        <View style={{ height: rhythm.group }} />
        <View style={stil.paraSatiri}>
          {onChangeText ? <MoneyInput hideLabel value={value ?? ''} onChangeText={onChangeText} label={ustSol} autoFocus={autoFocus} style={{ fontSize: uzun ? 32 : 56, lineHeight: 64, textAlign: 'center' }} /> : <Txt role={sayiRolu} numberOfLines={1}>
            {tutarGosterim}
          </Txt>}
          <View style={{ width: rhythm.group }} />
          <Txt role={simgeRolu} tone={color.text2}>
            {SIMGE}
          </Txt>
        </View>
      </ClaySurface>
      {hata ? (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={color.dangerInk}>
            {hata}
          </Txt>
        </>
      ) : null}
    </View>
  );
}

function GunButonu({ etiket, vurgulu = false, tiklanabilir = true, onPress, accessibilityLabel }: AmountWellGunButonu) {
  const govde = (
    <View style={[stil.gunButon, vurgulu ? { backgroundColor: color.primarySoft } : null]}>
      <Icon name="calendar" size={20} color={vurgulu ? color.primaryText : color.text2} />
      <View style={{ width: rhythm.sameObject }} />
      <Txt role={vurgulu ? 'label' : 'caption'} tone={vurgulu ? color.primaryText : color.text}>
        {etiket}
      </Txt>
    </View>
  );
  if (!tiklanabilir) return govde;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? etiket}
      hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
      style={({ pressed }) => [pressed ? { backgroundColor: color.groove, borderRadius: radius.pill } : null]}>
      {govde}
    </Pressable>
  );
}

const stil = StyleSheet.create({
  kuyu: { padding: rhythm.pad },
  ustSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  paraSatiri: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  imlec: { width: 3, height: 44, borderRadius: radius.pill, backgroundColor: color.primary, marginLeft: 2 },
  gunButon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: rhythm.group,
    borderRadius: radius.pill,
  },
});
