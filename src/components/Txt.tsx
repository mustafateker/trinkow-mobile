import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { color, type } from '@/theme/tokens';

export type TypeRole = keyof typeof type;

/**
 * Tek metin bileşeni. Tip rolü tokens.md §2.2'den gelir; punto/satır
 * yüksekliği bileşen içinde tanımlanmaz. Varsayılan renkler §2/§1.2'deki
 * prototip eşlemesiyle aynıdır (caption/micro → text-2, diğerleri → text).
 */
const varsayilanRenk: Record<TypeRole, string> = {
  hero: color.text,
  display: color.text,
  amount: color.text,
  h1: color.text,
  h2: color.text,
  body: color.text,
  bodyStrong: color.text,
  label: color.text,
  caption: color.text2,
  micro: color.text2,
};

// RN'in `TextProps.role`'ü web ARIA rolüdür; burada tip rolü anlamında
// kullanıldığı için dışarıda bırakılır (ARIA kullanılmaz — §6).
type Props = Omit<TextProps, 'role'> & {
  role: TypeRole;
  /** Rolün varsayılan renginin üzerine yazar. Yalnız tokens'taki renkler. */
  tone?: string;
  style?: StyleProp<TextStyle>;
};

export function Txt({ role, tone, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      // Kullanıcının sistem yazı boyutu ayarı düzeni bozmamalı: kahraman
      // sayı ve tutarlar piksele kilitli kutularda durur (§7.5 iç alan 156).
      maxFontSizeMultiplier={role === 'hero' || role === 'display' ? 1.2 : 1.5}
      style={[type[role], { color: tone ?? varsayilanRenk[role] }, style]}
    />
  );
}
