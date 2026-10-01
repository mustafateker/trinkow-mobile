/**
 * §7.9 toast — kök düzeyde tek `ToastHost` bunu dinler, ekranlar arası
 * gezinmeden (ör. E-12 sheet'i kapatıp E-14'e dönme) sağ çıkar.
 *
 * `undo` — 6 sn, **danger** göstergesi. Yalnız yıkıcı geri alma
 * (`toast.silindi`) — K-029'un izinli dört `danger` bağlamından biri.
 * `undoInfo` — 6 sn, **primary** göstergesi. Geri alınabilir ama yıkıcı
 * OLMAYAN işlem (`toast.tekrarlandi` — metinler.md §15 şerit rengi `accent`).
 */
export type ToastVaryant = 'info' | 'warning' | 'undo' | 'undoInfo';

export type ToastGirdi = {
  tur: ToastVaryant;
  metin: string;
  /** ms — verilmezse varyanta göre 4000/6000 (tokens.md §7.9). */
  sure?: number;
  eylemEtiketi?: string;
  onEylem?: () => void;
};

type Dinleyici = (t: ToastGirdi) => void;

const dinleyiciler = new Set<Dinleyici>();

export function toastGoster(t: ToastGirdi): void {
  for (const d of dinleyiciler) d(t);
}

export function toastAbone(dinleyici: Dinleyici): () => void {
  dinleyiciler.add(dinleyici);
  return () => dinleyiciler.delete(dinleyici);
}
