import { t } from '@/content/metinler';

/**
 * `app/kayit.tsx`dan çıkarıldı (test edilebilirlik). Davranış DEĞİŞMEDİ.
 * Şifre tekrarı ve yasal onay kapısı — E-16 Hesap oluştur.
 */

/** Şifre ile tekrar alanı doluyken birebir eşleşiyor mu. */
export function sifreTekrarEslesiyorMu(sifre: string, sifreTekrar: string): boolean {
  return sifreTekrar.length > 0 && sifre === sifreTekrar;
}

/** onBlur doğrulaması: kullanıcı tekrar alanına henüz yazmadıysa hata basılmaz. */
export function sifreTekrarHatasi(sifre: string, sifreTekrar: string): string | null {
  if (sifreTekrar.length === 0) return null;
  return sifre === sifreTekrar ? null : t['hata.sifre_eslesmiyor'];
}

/** İki yasal onay da işaretli mi (B1 — sosyal giriş kapısı). */
export function onayVerildiMi(onayKosullar: boolean, onayGizlilik: boolean): boolean {
  return onayKosullar && onayGizlilik;
}

/** Birincil "Hesap oluştur" eylemi pasif mi. */
export function kayitGonderPasifMi(params: {
  eposta: string;
  sifreKuralKarsilandi: boolean;
  sifre: string;
  sifreTekrar: string;
  onayKosullar: boolean;
  onayGizlilik: boolean;
}): boolean {
  return (
    params.eposta.trim().length === 0 ||
    !params.sifreKuralKarsilandi ||
    !sifreTekrarEslesiyorMu(params.sifre, params.sifreTekrar) ||
    !onayVerildiMi(params.onayKosullar, params.onayGizlilik)
  );
}
