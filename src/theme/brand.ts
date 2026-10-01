/**
 * delta-v4.md T-2 §14/#14 — üçüncü taraf marka renkleri (Apple/Google
 * düğmeleri). BİLİNÇLİ OLARAK `tokens.ts` DIŞINDA: marka değişse bile
 * Apple/Google kendi kılavuzlarını değiştirmez — "kap bizim, içerik
 * onların" (bkz. delta bilinçli tasarım kararı #3). Yalnız
 * `SocialAuthButton` bu dosyayı import eder; başka hiçbir bileşen
 * ham marka rengi kullanmaz.
 */
export const brand = {
  apple: {
    bg: '#000000',
    bgPressed: '#1A1A1A',
    ink: '#FFFFFF',
  },
  google: {
    bg: '#FFFFFF',
    bgPressed: '#F2F2F2',
    ink: '#1F1F1F',
    border: '#747775',
    g: {
      mavi: '#4285F4',
      yesil: '#34A853',
      sari: '#FBBC05',
      kirmizi: '#EA4335',
    },
  },
} as const;
