import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ClaySwitch } from '@/components/ClaySwitch';
import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { catColor, clay, color, radius, rhythm, size } from '@/theme/tokens';

export type MenuIconTone = 'primary' | 'blue' | 'green' | 'orange' | 'pink' | 'neutral';

const menuTonlari: Record<MenuIconTone, { background: string; foreground: string }> = {
  primary: { background: color.primarySoft, foreground: color.primary },
  blue: { background: catColor.mavi.soft, foreground: catColor.mavi.solid },
  green: { background: catColor.yesil.soft, foreground: catColor.yesil.solid },
  orange: { background: catColor.amber.soft, foreground: catColor.amber.solid },
  pink: { background: catColor.kiremit.soft, foreground: catColor.kiremit.solid },
  neutral: { background: color.groove, foreground: color.text2 },
};

/**
 * Bileşen envanteri §2 `SettingRow` — kabarık tek karar satırı. Solda
 * başlık + `caption` açıklama, sağda kontrol (`ClaySwitch` ya da serbest
 * `deger`). İç boşluk 12/16, minimum 68 (§7.3/§7.12 ile aynı ölçek).
 *
 * Anahtar varsa satırın TAMAMI dokunma hedefidir (tokens §7.12 `ClaySwitch`
 * notu) — anahtarın kendisi ayrı bir dokunma alanı DEĞİLDİR.
 *
 * `icon` + `onPress` — rev2-tasarruf-profil.md §4.3 **gezinme varyantı**:
 * solda 44 `kat-kab.notr` ikon kabı, sağda `chevron-right`, ikincil satır
 * (`aciklama`) satırın gerçek değerini taşır. Anahtar/gezinme aynı anda
 * verilmez; ikisi de yoksa satır dokunulamaz (eski davranış korunur).
 */
/** Profil/Tasarruf'taki grup başlığı — Kart yığını yerine düz grup+satır dilini paylaşan her ekran kullanır. */
export function GrupBasligi({ metin }: { metin: string }) {
  return (
    <Txt role="h2" style={stil.grupBasligi}>
      {metin}
    </Txt>
  );
}

/** Birbiriyle ilişkili ayarları ayrı kart yığınına çevirmeden tek yüzeyde toplar. */
export function SettingGroup({ children }: { children: ReactNode }) {
  const satirlar = Children.toArray(children);
  return (
    <View style={stil.grup}>
      {satirlar.map((child, index) => (
        <Fragment key={index}>
          {index > 0 ? <View style={stil.ayrac} /> : null}
          {child}
        </Fragment>
      ))}
    </View>
  );
}

export function SettingRow({
  baslik,
  aciklama,
  icon,
  iconTone = 'primary',
  leading,
  onPress,
  anahtarDegeri,
  anahtarKapali,
  onAnahtarDegistir,
  deger,
  disabled = false,
  accessibilityLabel,
}: {
  baslik: string;
  aciklama?: string;
  /** Gezinme varyantı — sol ikon kabı (§4.3), nötr zeminli. */
  icon?: IconName;
  /** Tasarım kitindeki kontrollü küçük işlev bloklarından biri. */
  iconTone?: MenuIconTone;
  /** `icon` yerine solda SERBEST bir kap çizer (ör. renkli `CategoryIconBox`) — kit §6.F "renkli ikon kutusu". */
  leading?: ReactNode;
  /** Gezinme varyantı — verilirse satır `Pressable` olur, sağda `chevron-right` görünür. */
  onPress?: () => void;
  /** Verilirse satır bir `ClaySwitch` çizer. */
  anahtarDegeri?: boolean;
  /** §6 — izin yokken anahtar pasif ama GİZLENMEZ. */
  anahtarKapali?: boolean;
  onAnahtarDegistir?: () => void;
  /** `anahtarDegeri` verilmezse sağda serbest içerik (ör. yalnız metin). */
  deger?: ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const anahtarVar = anahtarDegeri !== undefined;
  const gezinmeMi = !anahtarVar && onPress !== undefined;
  const gorunum = (
    <>
      {leading ? (
        <>
          {leading}
          <View style={{ width: rhythm.blockInCard }} />
        </>
      ) : icon ? (
        <>
          <View style={[stil.ikonKutu, { backgroundColor: menuTonlari[iconTone].background }]}>
            <Icon name={icon} size={size.iconSm} color={menuTonlari[iconTone].foreground} />
          </View>
          <View style={{ width: rhythm.blockInCard }} />
        </>
      ) : null}
      <View style={stil.esnek}>
        <Txt role="bodyStrong" numberOfLines={gezinmeMi ? 1 : undefined} ellipsizeMode="tail">
          {baslik}
        </Txt>
        {aciklama ? (
          <>
            <View style={{ height: rhythm.sameObject }} />
            <Txt role="caption" numberOfLines={gezinmeMi ? 1 : undefined} ellipsizeMode="tail">
              {aciklama}
            </Txt>
          </>
        ) : null}
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      {anahtarVar ? (
        <ClaySwitch value={anahtarDegeri} disabled={disabled || anahtarKapali} />
      ) : gezinmeMi ? (
        (deger ?? <Icon name="chevron-right" size={size.iconSm} color={color.text2} />)
      ) : (
        deger
      )}
    </>
  );

  if (anahtarVar) {
    return (
      <Pressable
        onPress={disabled || anahtarKapali ? undefined : onAnahtarDegistir}
        disabled={disabled || anahtarKapali}
        accessibilityRole="switch"
        accessibilityState={{ checked: anahtarDegeri, disabled: disabled || anahtarKapali }}
        accessibilityLabel={accessibilityLabel ?? baslik}
        style={({ pressed }) => [
          stil.satir,
          pressed && !disabled && !anahtarKapali ? { backgroundColor: color.groove, boxShadow: clay.pressed } : null,
        ]}>
        {gorunum}
      </Pressable>
    );
  }

  if (gezinmeMi) {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={accessibilityLabel ?? baslik}
        style={({ pressed }) => [
          stil.satir,
          pressed && !disabled ? { backgroundColor: color.groove } : null,
        ]}>
        {gorunum}
      </Pressable>
    );
  }

  return <View style={stil.satir}>{gorunum}</View>;
}

const stil = StyleSheet.create({
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: size.rowMinHeight,
    paddingVertical: size.rowPadY,
    paddingHorizontal: size.rowPadX,
    borderRadius: radius.tile,
  },
  esnek: { flex: 1, minWidth: 0 },
  grupBasligi: { marginBottom: rhythm.group },
  grup: {
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.tile,
    overflow: 'hidden',
  },
  ayrac: { height: 1, marginLeft: 72, backgroundColor: color.line },
  ikonKutu: { width: size.catBox, height: size.catBox, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
