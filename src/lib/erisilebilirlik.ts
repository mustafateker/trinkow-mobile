import { useWindowDimensions } from 'react-native';

/**
 * rev2-onboarding-kayit.md §4.3/§4.4 (Ö5) — `MoneyRow`un dikey düzene
 * döndüğü tek eşik. Ekranlara/bileşenlere DAĞITILMAZ, yalnız buradan okunur
 * (K-040: iki ekranda iki farklı eşik açılmasın diye tek yardımcı).
 */
export const BUYUK_YAZI_ESIGI = 1.3;

/** `fontScale > 1.3` mi — dinamik yazı boyutu büyütüldüğünde `true`. */
export function useBuyukYaziMi(): boolean {
  const { fontScale } = useWindowDimensions();
  return fontScale > BUYUK_YAZI_ESIGI;
}
