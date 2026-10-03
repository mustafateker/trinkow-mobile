import { KATEGORILER, type KategoriKodu } from '@/lib/kategoriler';
import { turkceNormalize } from '@/lib/urunArama';

/**
 * Harcama kategorisi tahmini — saf fonksiyon, ağ/UI bilmez. Sıra (ucuzdan
 * pahalıya, ilk yeterli güvenli sonuç kazanır):
 *  1. Kullanıcının öğrettiği ürün→kategori eşlemesi (sunucudaki öğrenme tablosu)
 *  2. Kullanıcının kendi geçmişinde aynı ürün adı
 *  3. Ürün kataloğu (tam ad, adın içinde geçen kalem, tek kategorili ön ek)
 *  4. Bağlam: aynı saat dilimi + benzer tutarda geçmiş kayıtların kategorisi
 * `TAHMIN_ESIGI` altındaki sonuç dönmez; çağıran bu durumda kategori önermez.
 */
export type GecmisKayit = {
  urunAdi: string | null;
  kategori: string;
  tutarKurus: number;
  /** 0-23, yerel saat */
  saat: number;
};

export type KatalogKalemi = { ad: string; kategori: KategoriKodu };

export type TahminKaynagi = 'ogrenilen' | 'gecmis' | 'katalog' | 'baglam';

export type KategoriTahmini = { kategori: KategoriKodu; kaynak: TahminKaynagi; guven: number };

export type TahminGirdisi = {
  urunAdi: string;
  /** Harcamanın yapıldığı yerel saat (0-23). */
  saat: number;
  /** Girilen tutar; henüz yazılmadıysa 0. */
  tutarKurus: number;
  /** Normalize ürün adı → kategori (öğrenilmiş). */
  ogrenilen: ReadonlyMap<string, string>;
  gecmis: readonly GecmisKayit[];
  katalog: readonly KatalogKalemi[];
};

export const TAHMIN_ESIGI = 0.6;

/** Bağlam tahmini için gereken en az geçmiş kayıt sayısı. */
const BAGLAM_MIN_KAYIT = 5;

function gecerliKategori(kod: string | undefined): KategoriKodu | null {
  return kod && Object.hasOwn(KATEGORILER, kod) ? (kod as KategoriKodu) : null;
}

function enCokOylanan(oylar: Map<KategoriKodu, number>): { kategori: KategoriKodu; pay: number; toplam: number } | null {
  let toplam = 0;
  let en: KategoriKodu | null = null;
  let enOy = 0;
  for (const [kod, oy] of oylar) {
    toplam += oy;
    if (oy > enOy) {
      en = kod;
      enOy = oy;
    }
  }
  return en && toplam > 0 ? { kategori: en, pay: enOy / toplam, toplam } : null;
}

function kelimeler(metin: string): string[] {
  return metin.split(/[^a-z0-9]+/).filter(Boolean);
}

/** `kalem` kelimelerinin tümü `ad` içinde ARDIŞIK kelime dizisi olarak geçiyor mu ("sabah latte" ⊃ "latte"). */
function kelimeDizisiIcerir(adKelimeleri: string[], kalemKelimeleri: string[]): boolean {
  if (kalemKelimeleri.length === 0 || kalemKelimeleri.length > adKelimeleri.length) return false;
  for (let i = 0; i + kalemKelimeleri.length <= adKelimeleri.length; i += 1) {
    if (kalemKelimeleri.every((k, j) => adKelimeleri[i + j] === k)) return true;
  }
  return false;
}

function adTahmini(girdi: TahminGirdisi, ad: string): KategoriTahmini | null {
  const ogrenilen = gecerliKategori(girdi.ogrenilen.get(ad));
  if (ogrenilen) return { kategori: ogrenilen, kaynak: 'ogrenilen', guven: 1 };

  const gecmisOylari = new Map<KategoriKodu, number>();
  for (const k of girdi.gecmis) {
    if (!k.urunAdi || turkceNormalize(k.urunAdi) !== ad) continue;
    const kod = gecerliKategori(k.kategori);
    if (kod) gecmisOylari.set(kod, (gecmisOylari.get(kod) ?? 0) + 1);
  }
  const gecmis = enCokOylanan(gecmisOylari);
  if (gecmis && gecmis.pay * 0.85 >= TAHMIN_ESIGI) {
    return { kategori: gecmis.kategori, kaynak: 'gecmis', guven: gecmis.pay * 0.85 };
  }

  // Katalog: kalemin öğrenilmiş kategorisi (varsa) katalogdakinin önüne geçer.
  const kalemKategorisi = (k: KatalogKalemi) => gecerliKategori(girdi.ogrenilen.get(turkceNormalize(k.ad))) ?? k.kategori;
  const adKelimeleri = kelimeler(ad);

  const tam = girdi.katalog.find((k) => turkceNormalize(k.ad) === ad);
  if (tam) return { kategori: kalemKategorisi(tam), kaynak: 'katalog', guven: 0.9 };

  let icinde: KatalogKalemi | null = null;
  for (const k of girdi.katalog) {
    const kk = kelimeler(turkceNormalize(k.ad));
    if (!kelimeDizisiIcerir(adKelimeleri, kk)) continue;
    if (!icinde || kk.length > kelimeler(turkceNormalize(icinde.ad)).length) icinde = k;
  }
  if (icinde) return { kategori: kalemKategorisi(icinde), kaynak: 'katalog', guven: 0.75 };

  if (ad.length >= 3) {
    const oylar = new Map<KategoriKodu, number>();
    for (const k of girdi.katalog) {
      if (turkceNormalize(k.ad).startsWith(ad)) {
        const kod = kalemKategorisi(k);
        oylar.set(kod, (oylar.get(kod) ?? 0) + 1);
      }
    }
    const on = enCokOylanan(oylar);
    if (on && on.pay === 1) return { kategori: on.kategori, kaynak: 'katalog', guven: 0.65 };
  }
  return null;
}

function saatAgirligi(a: number, b: number): number {
  const fark = Math.abs(a - b);
  const d = Math.min(fark, 24 - fark);
  return d <= 1 ? 1 : d <= 2 ? 0.5 : 0;
}

function tutarAgirligi(a: number, b: number): number {
  if (a <= 0 || b <= 0) return 0;
  const oran = Math.max(a, b) / Math.min(a, b);
  return oran <= 1.25 ? 1 : oran <= 2 ? 0.5 : oran <= 4 ? 0.15 : 0;
}

function baglamTahmini(girdi: TahminGirdisi): KategoriTahmini | null {
  if (girdi.gecmis.length < BAGLAM_MIN_KAYIT) return null;
  const tutarVar = girdi.tutarKurus > 0;
  const oylar = new Map<KategoriKodu, number>();
  for (const k of girdi.gecmis) {
    const kod = gecerliKategori(k.kategori);
    if (!kod) continue;
    const w = saatAgirligi(girdi.saat, k.saat) * (tutarVar ? tutarAgirligi(girdi.tutarKurus, k.tutarKurus) : 1);
    if (w > 0) oylar.set(kod, (oylar.get(kod) ?? 0) + w);
  }
  const sonuc = enCokOylanan(oylar);
  if (!sonuc || sonuc.toplam < 2) return null;
  // Tutar yokken yalnız saat bilgisi var — daha az güvenilir.
  const guven = sonuc.pay * Math.min(1, sonuc.toplam / 3) * (tutarVar ? 1 : 0.85);
  return { kategori: sonuc.kategori, kaynak: 'baglam', guven };
}

export function tahminEt(girdi: TahminGirdisi): KategoriTahmini | null {
  const ad = turkceNormalize(girdi.urunAdi);
  if (ad) {
    const adSonucu = adTahmini(girdi, ad);
    if (adSonucu) return adSonucu;
  }
  const baglam = baglamTahmini(girdi);
  if (baglam && baglam.guven >= TAHMIN_ESIGI) return baglam;
  return null;
}
