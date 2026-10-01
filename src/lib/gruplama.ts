import type { Harcama } from '@/db/harcama';

/** E-14 — gün gruplama. Her grup bir `FlatList` bölüm başlığı + satırları. */
export type GunGrubu = {
  gun: string;
  harcamalar: Harcama[];
  toplamKurus: number;
};

/**
 * Harcamaları gün anahtarına göre gruplar. Günler YENİDEN ESKİYE (bugün en
 * üstte), her günün İÇİNDEKİ satırlar saat sırasına göre (erken → geç) —
 * prototipteki "08.20 → 09.05 → 18.40" düzeni.
 */
export function gunGruplariOlustur(harcamalar: Harcama[]): GunGrubu[] {
  const gruplar = new Map<string, Harcama[]>();
  for (const h of harcamalar) {
    const liste = gruplar.get(h.gun);
    if (liste) liste.push(h);
    else gruplar.set(h.gun, [h]);
  }
  return Array.from(gruplar.entries())
    .map(([gun, liste]) => {
      const siraliListe = [...liste].sort((a, b) => a.zaman.localeCompare(b.zaman));
      const toplamKurus = siraliListe.reduce((t, h) => t + h.tutarKurus, 0);
      return { gun, harcamalar: siraliListe, toplamKurus };
    })
    .sort((a, b) => b.gun.localeCompare(a.gun));
}

/** `FlatList` için düz veri: gün başlığı + satırlar tek dizide, `tip` alanıyla ayrılır. */
export type ListeOgesi =
  | { tip: 'baslik'; gun: string; toplamKurus: number; limitDisi: boolean }
  | { tip: 'satir'; harcama: Harcama; limitDisi: boolean };

export function duzListeOlustur(
  gruplar: GunGrubu[],
  gunlukLimitKurus: number | null,
): ListeOgesi[] {
  const oge: ListeOgesi[] = [];
  for (const g of gruplar) {
    const gunLimitDisi = gunlukLimitKurus !== null && g.toplamKurus > gunlukLimitKurus;
    oge.push({ tip: 'baslik', gun: g.gun, toplamKurus: g.toplamKurus, limitDisi: gunLimitDisi });
    // §5.2 (E-10 ile aynı mantık) — satır bazında "limit dışı" yürüyen
    // toplama göre işaretlenir: günü limitin üzerine ÇIKARAN satırdan
    // itibaren, o günün öncesindeki satırlar işaretlenmez.
    let yuruyenToplam = 0;
    for (const h of g.harcamalar) {
      yuruyenToplam += h.tutarKurus;
      const satirLimitDisi = gunlukLimitKurus !== null && yuruyenToplam > gunlukLimitKurus;
      oge.push({ tip: 'satir', harcama: h, limitDisi: satirLimitDisi });
    }
  }
  return oge;
}
