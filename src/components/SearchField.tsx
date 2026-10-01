import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Spinner } from '@/components/Spinner';
import { Txt } from '@/components/Txt';
import { a11y, clay, color, fontFamily, radius, rhythm, size } from '@/theme/tokens';

/**
 * Bileşen envanteri `SearchField` (`arama-alani`, E-11 · F-18) — mevcut
 * `.giris` ölçüsü (56 · `well` · `clay.sunken`) aynen, yeni bir giriş biçimi
 * icat edilmedi. Durumlar: `empty` / `focused` / `typing` (+ temizle) /
 * `loading` (+ spinner) / `selected` (ürün seçili + kaldır).
 *
 * Boşken akışa karışmaz: odaklanmaz zorlanmaz, doğrulama hatası üretmez,
 * Kaydet'i engellemez (çağıran taraf zaten tutar>0 kuralını kullanır).
 */
export function SearchField({
  deger,
  onDegerDegisti,
  secili,
  onKaldir,
  yukleniyor = false,
  placeholder,
  accessibilityLabel,
  temizleEtiketi,
  kaldirEtiketi,
}: {
  /** Yazılmakta olan ham metin — `secili` doluyken görmezden gelinir. */
  deger: string;
  onDegerDegisti: (v: string) => void;
  /** Seçilmiş ürünün görünen adı — doluysa alan düzenlenemez, "kaldır" ikonu çıkar. */
  secili: string | null;
  onKaldir: () => void;
  yukleniyor?: boolean;
  placeholder: string;
  accessibilityLabel: string;
  temizleEtiketi: string;
  kaldirEtiketi: string;
}) {
  const seciliMi = secili !== null;
  const [odakli, setOdakli] = useState(false);

  return (
    <View
      style={[
        stil.kuyu,
        { boxShadow: odakli ? `${clay.sunken}, 0 0 0 2px ${color.primaryText}` : clay.sunken },
      ]}>
      <Icon name="search" size={size.iconSm} color={color.text2} />
      <View style={{ width: rhythm.blockInCard }} />
      {seciliMi ? (
        <Txt role="body" numberOfLines={1} style={stil.esnek}>
          {secili}
        </Txt>
      ) : (
        <TextInput
          value={deger}
          onChangeText={onDegerDegisti}
          onFocus={() => setOdakli(true)}
          onBlur={() => setOdakli(false)}
          placeholder={placeholder}
          placeholderTextColor={color.text2}
          numberOfLines={1}
          accessibilityLabel={accessibilityLabel}
          style={stil.girdi}
        />
      )}
      {seciliMi ? (
        <Pressable
          onPress={onKaldir}
          hitSlop={a11y.minTarget}
          accessibilityRole="button"
          accessibilityLabel={kaldirEtiketi}>
          <Icon name="x" size={20} color={color.text2} />
        </Pressable>
      ) : (
        <>
          {yukleniyor ? (
            <>
              <Spinner size={20} varyant="dark" />
              <View style={{ width: rhythm.group }} />
            </>
          ) : null}
          {deger.length > 0 ? (
            <Pressable
              onPress={() => onDegerDegisti('')}
              hitSlop={a11y.minTarget}
              accessibilityRole="button"
              accessibilityLabel={temizleEtiketi}>
              <Icon name="x" size={20} color={color.text2} />
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
}

const stil = StyleSheet.create({
  kuyu: {
    flexDirection: 'row',
    alignItems: 'center',
    height: size.input,
    paddingHorizontal: rhythm.pad,
    borderRadius: radius.tile,
    backgroundColor: color.well,
  },
  esnek: { flex: 1, minWidth: 0 },
  girdi: {
    flex: 1,
    minWidth: 0,
    fontFamily: fontFamily.uiRegular,
    fontSize: 16,
    lineHeight: 24,
    color: color.text,
    padding: 0,
  },
});
