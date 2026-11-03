/**
 * Paywall fiyat hesapları. RevenueCat'ten bağımsız saf fonksiyonlardır,
 * testler doğrudan yükler (bkz. `tests/uyelikFiyat.test.cjs`).
 */

/**
 * Ücretsiz deneme süresini gün olarak verir: P7D → 7, P1W → 7.
 * Ay ya da yıl gibi gün sayısı belirsiz birimlerde `null` döner; ekran o
 * zaman deneme metni göstermez.
 */
export function denemeGunSayisi(birim: string | null | undefined, adet: number | null | undefined): number | null {
  if (!birim || !adet || adet <= 0) return null;
  if (birim === 'DAY') return adet;
  if (birim === 'WEEK') return adet * 7;
  return null;
}

/**
 * Standart fiyata göre indirim yüzdesi, tam sayıya yuvarlanmış:
 * 15,99 → 7,99 için 50. İndirim yoksa ya da fiyatlar geçersizse `null`.
 */
export function indirimYuzdesi(standart: number | null | undefined, indirimli: number | null | undefined): number | null {
  if (!standart || !indirimli || standart <= 0 || indirimli <= 0 || indirimli >= standart) return null;
  const yuzde = Math.round((1 - indirimli / standart) * 100);
  return yuzde >= 1 ? yuzde : null;
}
