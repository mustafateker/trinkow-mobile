/**
 * Sunucu verisi MongoDB/API üzerinden taşınır. Bu boş bağlam, eski fonksiyon
 * imzalarını çağıran ekranları tek seferde kırmadan SQLite bağımlılığını
 * kaldırmak için kullanılır; herhangi bir yerel veritabanı içermez.
 */
export type VeriBaglami = Readonly<Record<string, never>>;

const VERI_BAGLAMI: VeriBaglami = Object.freeze({});

export function useVeriBaglami(): VeriBaglami {
  return VERI_BAGLAMI;
}
