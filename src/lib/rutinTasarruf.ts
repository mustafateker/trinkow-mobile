export type RutinTasarrufGunu = {
  gun: string;
  adet: number;
  birim_fiyat_kurus: number;
  tasarruf_kurus: number;
};

export type RutinTasarrufu = {
  rutin_id: string;
  ad: string;
  kategori?: string;
  tasarruf_kurus: number;
  adet?: number;
  gun_sayisi?: number;
  gunler?: RutinTasarrufGunu[];
};

/** En çok tasarruf sağlayan rutin üstte; eşitlikte Türkçe ad sırası kararlıdır. */
export function rutinTasarruflariniSirala(rutinler: RutinTasarrufu[]): RutinTasarrufu[] {
  return [...rutinler].sort((a, b) => b.tasarruf_kurus - a.tasarruf_kurus || a.ad.localeCompare(b.ad, 'tr'));
}

/** Açılan satır ekranı uzatmasın; en yeni günler önce görünür. */
export function rutinTasarrufGunleriniGoster(rutin: RutinTasarrufu, limit = 7): {
  gunler: RutinTasarrufGunu[];
  kalanGunSayisi: number;
} {
  const tumGunler = rutin.gunler ?? [];
  const gunler = [...tumGunler].sort((a, b) => b.gun.localeCompare(a.gun)).slice(0, limit);
  return { gunler, kalanGunSayisi: Math.max(0, tumGunler.length - gunler.length) };
}

/** Yeni detay alanları gelmeyen eski backend yanıtında güvenli sıfır özeti. */
export function rutinTasarrufSayilari(rutin: RutinTasarrufu): { gunSayisi: number; adet: number } {
  const gunler = rutin.gunler ?? [];
  return {
    gunSayisi: rutin.gun_sayisi ?? gunler.length,
    adet: rutin.adet ?? gunler.reduce((toplam, gun) => toplam + gun.adet, 0),
  };
}
