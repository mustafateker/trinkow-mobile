/**
 * E-24 Gün seçici'nin "seçim kipi"nde (kip=sec) seçilen günü çağıran ekrana
 * taşır. expo-router'da ekranlar arası dönüş değeri yok; toastBus/veriBus'taki
 * minimum pub/sub deseni burada tekrarlanır (F-18 `gun-btn` → E-24
 * entegrasyonu, D-2d-2 düzeltmesi).
 */
type Dinleyici = (gunFarki: number) => void;

const dinleyiciler = new Set<Dinleyici>();

export function gunSecildi(gunFarki: number): void {
  for (const d of dinleyiciler) d(gunFarki);
}

export function gunSeciciAbone(dinleyici: Dinleyici): () => void {
  dinleyiciler.add(dinleyici);
  return () => dinleyiciler.delete(dinleyici);
}
