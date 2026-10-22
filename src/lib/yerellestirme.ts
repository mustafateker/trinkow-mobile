export type Dil = 'tr' | 'en';
export type ParaBirimi = 'TRY' | 'USD' | 'EUR';

export type YerellestirmeTercihi = {
  dil: Dil;
  paraBirimi: ParaBirimi;
};

let tercih: YerellestirmeTercihi = { dil: 'tr', paraBirimi: 'TRY' };
const dinleyiciler = new Set<() => void>();

export function yerellestirmeTercihi(): YerellestirmeTercihi {
  return tercih;
}

export function dilKodu(): Dil {
  return tercih.dil;
}

export function ingilizceMi(): boolean {
  return tercih.dil === 'en';
}

export function localeKodu(): 'tr-TR' | 'en-US' {
  return tercih.dil === 'en' ? 'en-US' : 'tr-TR';
}

export function paraBirimi(): ParaBirimi {
  return tercih.paraBirimi;
}

export function yerellestirmeAyarla(yeni: Partial<YerellestirmeTercihi>): void {
  const sonraki = { ...tercih, ...yeni };
  if (sonraki.dil === tercih.dil && sonraki.paraBirimi === tercih.paraBirimi) return;
  tercih = sonraki;
  for (const dinleyici of dinleyiciler) dinleyici();
}

export function yerellestirmeDegisimineAbone(dinleyici: () => void): () => void {
  dinleyiciler.add(dinleyici);
  return () => dinleyiciler.delete(dinleyici);
}

export function yerellestirmeAnlikDeger(): string {
  return `${tercih.dil}:${tercih.paraBirimi}`;
}
