/**
 * Ekranlar arası "veri değişti" sinyali. Harcama ekle/güncelle/sil sonrası
 * çağrılır; hâlâ ekranda duran `usePano`/`useKayitlar` gibi kancalar bunu
 * dinleyip yeniden okur. Redux/Context gerektirmeyecek kadar küçük bir
 * ihtiyaç için minimum pub/sub.
 */
type Dinleyici = () => void;

const dinleyiciler = new Set<Dinleyici>();

export function veriDegisti(): void {
  for (const d of dinleyiciler) d();
}

export function veriDegisimineAbone(dinleyici: Dinleyici): () => void {
  dinleyiciler.add(dinleyici);
  return () => dinleyiciler.delete(dinleyici);
}
