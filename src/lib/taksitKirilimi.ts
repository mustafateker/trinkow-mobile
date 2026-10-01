import type { SurenSeri } from '@/db/harcama';

/**
 * rev3-taksitler.md — E-18 taksitler ekranının kategori/ürün kırılımı.
 * Saf hesap katmanı: React/RN'e bağımlı değil, `tests/taksitKirilimi.test.cjs`
 * ile ekran koduna dokunmadan doğrulanır.
 *
 * §5.1.1 (K-T13) — yuvarlama YALNIZ yaprakta (ürün satırında) yapılır;
 * üst düzeyler (kategori, ay) ekranda YAZAN değerleri toplar, kendi
 * kuruşundan AYRICA yuvarlanmaz. Yön: kuruş atılır (`// 100`).
 */

/** Kuruş integer → gösterim lirası (kuruş atılır, aşağı yuvarlanır). */
export function kurusToLira(kurus: number): number {
  return Math.floor(kurus / 100);
}

export type UrunSatiri = {
  /** Bu ayki harcama kaydının id'si — satır dokunuşu E-12'ye bunu açar. */
  id: string;
  taksitId: string;
  kategoriKodu: string;
  urunAdi: string | null;
  taksitNo: number;
  taksitToplam: number;
  /** O ayki gerçek taksit — yaprak yuvarlaması uygulanmış (kuruşsuz lira). */
  tutarLira: number;
  /** Bu ay HARİÇ kalan taksitlerin kuruşu atılmış toplamı; son taksitte anlamsız (0). */
  kalanLira: number;
  son: boolean;
};

export type KategoriGrubu = {
  kategoriKodu: string;
  /** Σ tutarLira — kategorinin TÜM ürünleri (liste sınırının arkasındakiler DAHİL). */
  toplamLira: number;
  urunSayisi: number;
  /** Bu ayki tutara göre azalan sıralı — §4.3. */
  satirlar: UrunSatiri[];
};

function urunSatiriOlustur(s: SurenSeri): UrunSatiri {
  return {
    id: s.id,
    taksitId: s.taksitId,
    kategoriKodu: s.kategori,
    urunAdi: s.urunAdi,
    taksitNo: s.taksitNo,
    taksitToplam: s.taksitToplam,
    tutarLira: kurusToLira(s.tutarKurus),
    kalanLira: kurusToLira(s.kalanKurus),
    son: s.taksitNo === s.taksitToplam,
  };
}

/**
 * §4.3 · §5.1.1 — kategori → ürün kırılımını kurar.
 * Kategori içi sıra: bu ayki tutar azalan → `taksitNo` azalan (bitmeye
 * yakın üstte) → ürün adı (tr). Kategoriler arası sıra: bu ay toplamı
 * azalan → eşitlikte `kategoriSirasi` (çağıran `TUM_KATEGORILER` verir).
 */
export function kategoriKirilimiOlustur(seriler: SurenSeri[], kategoriSirasi: string[]): KategoriGrubu[] {
  const gruplar = new Map<string, UrunSatiri[]>();
  for (const s of seriler) {
    const satir = urunSatiriOlustur(s);
    const liste = gruplar.get(satir.kategoriKodu) ?? [];
    liste.push(satir);
    gruplar.set(satir.kategoriKodu, liste);
  }

  const kategoriGruplari: KategoriGrubu[] = [...gruplar.entries()].map(([kategoriKodu, satirlar]) => {
    const sirali = [...satirlar].sort((a, b) => {
      if (b.tutarLira !== a.tutarLira) return b.tutarLira - a.tutarLira;
      if (b.taksitNo !== a.taksitNo) return b.taksitNo - a.taksitNo;
      return (a.urunAdi ?? '').localeCompare(b.urunAdi ?? '', 'tr');
    });
    return {
      kategoriKodu,
      toplamLira: sirali.reduce((toplam, s) => toplam + s.tutarLira, 0),
      urunSayisi: sirali.length,
      satirlar: sirali,
    };
  });

  return kategoriGruplari.sort((a, b) => {
    if (b.toplamLira !== a.toplamLira) return b.toplamLira - a.toplamLira;
    return kategoriSirasi.indexOf(a.kategoriKodu) - kategoriSirasi.indexOf(b.kategoriKodu);
  });
}

/** §5.1.1 — ay toplamı (kahraman) = Σ kategoriToplam(görünen). */
export function ayToplamLiraHesapla(gruplar: KategoriGrubu[]): number {
  return gruplar.reduce((toplam, g) => toplam + g.toplamLira, 0);
}

/** §4.1 — kahraman sayının en büyük parçası: sıralı listenin ilk kategorisi. */
export function enBuyukKategoriKodu(gruplar: KategoriGrubu[]): string | null {
  return gruplar[0]?.kategoriKodu ?? null;
}

/**
 * K-T2 — bölüm başlığı kararı: kategori sayısı 1 ise akordiyon KURULMAZ,
 * kimlik bölüm başlığına taşınır ve jenerik "Süren taksitler" düşer (§4.2).
 * Tek kural, iki durumu kapatır: tek seri de tek kategori demektir.
 */
export function tekKategoriMi(gruplar: KategoriGrubu[]): boolean {
  return gruplar.length === 1;
}

/** §4.3 — kategori içi liste sınırı; fazlası "Tümünü göster" ile açılır. */
export const KATEGORI_SATIR_SINIRI = 6;

export function gorunenSatirlar(satirlar: UrunSatiri[], tumunuGoster: boolean): UrunSatiri[] {
  if (tumunuGoster || satirlar.length <= KATEGORI_SATIR_SINIRI) return satirlar;
  return satirlar.slice(0, KATEGORI_SATIR_SINIRI);
}

/**
 * §5.3.1 — `sonAy`nin `buAy`dan kaç ay SONRA bittiği. 0 = bu ay biter,
 * 1 = gelecek ay biter, vb. `taksitSonAy`ın döndürdüğü "YYYY-MM" ile
 * kullanılır; ay haritasının 6 satırlık penceresinden BAĞIMSIZDIR.
 */
export function kalanAySayisiHesapla(buAy: string, sonAy: string): number {
  const [buYil, buAyNo] = buAy.split('-').map(Number);
  const [sonYil, sonAyNo] = sonAy.split('-').map(Number);
  return (sonYil - buYil) * 12 + (sonAyNo - buAyNo);
}

/**
 * §5.3.1 bağlayıcı garanti. Eşik SABİT DEĞİL: çubuk kartının gösterdiği ay
 * sayısından türetilir (`aylarKurus.length - 1`) — bugün 6 satır ⇒ eşik 5.
 *
 * Koşul sağlanıyorsa (kalan tüm aylar çubuk kartında görünüyorsa) dip,
 * ekranda yazan ay değerlerinin TOPLAMIdır — İLK satır (içinde bulunulan
 * ay) toplamın DIŞINDA kalır, çünkü "kalan" tanımı gereği bu aydan
 * sonrasıdır (B7, r3). Koşul sağlanmıyorsa `null` döner; çağıran o zaman
 * ham kuruş toplamının tek seferlik yuvarlamasını (`kalanToplamHamYuvarla`)
 * kullanmaya devam eder.
 */
export function kalanToplamGorunenKurus(params: { aylarKurus: number[]; kalanAySayisi: number }): number | null {
  const { aylarKurus, kalanAySayisi } = params;
  const esik = aylarKurus.length - 1;
  if (kalanAySayisi > esik) return null;
  return aylarKurus.slice(1).reduce((toplam, kurus) => toplam + kurusToLira(kurus) * 100, 0);
}

/** §5.1 — garanti uygulanmadığında eski yol: tek kuruş toplamı, bir kez aşağı yuvarlanır. */
export function kalanToplamHamYuvarla(hamKurus: number): number {
  return kurusToLira(hamKurus) * 100;
}
