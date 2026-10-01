/**
 * D-2c-1 · E-19 Bildirim izni — STUB. Gerçek OS izni `expo-notifications`
 * gerektirir; bu yeni bağımlılık bu turda EKLENMEDİ (onay gerekir, bkz.
 * rapor). Ayarlar ekranının "izin kapalı" dalı (tokens/prototip 2. sahne)
 * bu fonksiyona bağlı kodlanmıştır ama `true` sabit döndüğü için bugün
 * pratikte hiç tetiklenmez — push bildirim turu geldiğinde yalnız burası
 * değişecek, `app/ayarlar.tsx` DEĞİŞMEYECEK.
 */
export async function bildirimIzniVarMi(): Promise<boolean> {
  return true;
}
