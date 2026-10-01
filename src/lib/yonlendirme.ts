import { router } from 'expo-router';

/**
 * K-082/2 — oturum sona erdiğinde (çıkış / hesap silme / geçersiz token)
 * giriş ekranına düşmeden ÖNCE üstteki TÜM ekranları kapatır. Yalnız
 * `router.replace('/giris')` mevcut ekranı DEĞİŞTİRİR ama altındaki yığını
 * BOŞALTMAZ — geri tuşu/kaydırma jestiyle artık yetkisiz olan eski ekranlara
 * dönülebilirdi (BE-6 turunda sertleştirilecek denen madde, bkz. DECISIONS).
 */
export function girisEkraninaDon(): void {
  if (router.canDismiss()) router.dismissAll();
  router.replace('/giris');
}
