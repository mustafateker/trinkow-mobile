/**
 * Profil ekranındaki "Planın"/"Kayıt kolaylıkları" gruplarının hangi
 * yüzeyi çizeceğine karar veren saf yardımcı — `useRevLoad`'ın
 * `{ loading, error, data }` üçlüsünden türer.
 *
 * Kapanış QA bulgusu: `ayarVerisi.error` hiçbir yerde okunmuyordu; bu da
 * ağ hatasında sessizce "Henüz ayarlanmadı" tipi boş-durum metnine
 * düşülmesine yol açıyordu (kullanıcıya yanlış finansal durum gösterimi).
 * Bu yardımcı, veri YOKLUĞU (`data === null` ama hata da yok — henüz hiç
 * yüklenmemiş) ile veri OKUNAMAMASI (`error` set + elde hiç veri yok)
 * arasındaki farkı ayırt eder. Daha önce başarıyla yüklenmiş veri varsa
 * (yeniden deneme başarısız oldu ama eski veri elde) kullanıcıyı eski
 * veriden mahrum bırakmamak için `hazir` döner — bu davranış DEĞİŞMEDİ.
 */
export type AyarGorunumDurumu = 'iskelet' | 'hata' | 'hazir';

export function ayarGorunumDurumu<T>(ayarVerisi: { loading: boolean; error: string; data: T | null }): AyarGorunumDurumu {
  if (ayarVerisi.loading) return 'iskelet';
  if (ayarVerisi.error && !ayarVerisi.data) return 'hata';
  return 'hazir';
}
