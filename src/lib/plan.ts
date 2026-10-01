/**
 * tokens.md §14 — türetilmiş değerlerin TEK kaynağı (K-040: yazılı olmayan
 * bir sayı iki kez kodlanır, ayrışır). Bu turda kullanılan formüller:
 *  · §14.1 `kalanGun`
 *  · §14.2 madde 6 (`gunlukLimitKurus` — genel "pay ÷ kalan gün, aşağı
 *    yuvarla" şekli; Katman 2/plan ekranı bir sonraki tur AYNI fonksiyonu
 *    `sosyal_kurus` ile çağıracak, ikinci bir tanım yazılmaz)
 *  · §14.3 `oneriLimitKurus` (Katman 1 çıkışı · K-059/5)
 *
 * Para daima kuruş cinsinden integer; yuvarlama yalnız gösterimde/aşağı.
 */

/** "Düzensiz" maaş günü — dönem 30 gün kabul edilir (tokens §14.1). */
export const DUZENSIZ_DONEM_GUN = 30;

/** K-059/5 varsayılan dağılım: %50 zorunlu / %30 sosyal ve keyfi / %20 birikim. */
export const ONERI_SOSYAL_YUZDE = 30;

function ayinSonGunu(yil: number, ay0: number): number {
  return new Date(yil, ay0 + 1, 0).getDate();
}

/** Hedef gün o ayda yoksa (31 → Şubat) ayın son gününe düşürür. */
function maasGunuTarihi(yil: number, ay0: number, hedefGun: number): Date {
  const gun = Math.min(hedefGun, ayinSonGunu(yil, ay0));
  return new Date(yil, ay0, gun, 12, 0, 0);
}

/** Saat/TZ'den bağımsız gün karşılaştırması için öğlene sabitler. */
function gunNormalize(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
}

/**
 * tokens.md §14.1 — BAĞLAYICI, tek tanım. Maaş gününden kurulan dönemde
 * bugün DAHİL kalan gün sayısı. `maasGunu === null` ise ("Düzensiz")
 * dönem 30 gün sayılır.
 */
export function kalanGun(bugun: Date, maasGunu: number | null): number {
  if (maasGunu === null) return DUZENSIZ_DONEM_GUN;
  const b = gunNormalize(bugun);
  const buAyOdemesi = maasGunuTarihi(b.getFullYear(), b.getMonth(), maasGunu);
  const donemSonu =
    b.getTime() >= buAyOdemesi.getTime()
      ? maasGunuTarihi(b.getFullYear(), b.getMonth() + 1, maasGunu)
      : buAyOdemesi;
  return Math.round((donemSonu.getTime() - b.getTime()) / 86_400_000);
}

/**
 * tokens.md §14.2 madde 6 — bir payı kalan güne böler, TAM LİRAYA AŞAĞI
 * yuvarlar. Yukarı yuvarlamak limiti her gün bir miktar aşındırır.
 */
export function gunlukLimitKurus(payKurus: number, gunSayisi: number): number {
  if (gunSayisi <= 0) return 0;
  const gunlukTamKurus = Math.floor(payKurus / gunSayisi);
  return Math.floor(gunlukTamKurus / 100) * 100;
}

/** K-059/5 önerisinin "sosyal ve keyfi" varsayımı — sheet'in denklem kutusunda da gösterilir. */
export function oneriSosyalKurus(gelirKurus: number): number {
  return Math.floor((gelirKurus * ONERI_SOSYAL_YUZDE) / 100);
}

/* ------------------------------------------------------------------------
 * D-2d-3b · tokens.md §14.2 "Plan zinciri (E-25 → E-26)" — BAĞLAYICI, tek
 * kaynak. Katman 2 (E-25) cevaplarından "Planın hazır" (E-26) ekranını
 * üreten tüm hesap burada durur; iki ekranda iki kez yazılmaz (K-040).
 * ------------------------------------------------------------------------ */

/** E-25 kart 1 "Sabit giderler" — cevaplanmamış alan `null`, 0 ile DOLDURULMAZ. */
export type SabitGiderler = {
  kiraAidatKurus: number | null;
  faturalarKurus: number | null;
  ulasimYakitKurus: number | null;
  krediTaksitKurus: number | null;
};

/** §14.2 madde 1 — yalnız kullanıcı girdisi, boş alan 0 sayılır. */
export function zorunluKurus(g: SabitGiderler): number {
  return (g.kiraAidatKurus ?? 0) + (g.faturalarKurus ?? 0) + (g.ulasimYakitKurus ?? 0) + (g.krediTaksitKurus ?? 0);
}

/** §14.2 madde 2. */
export function birikimKurus(gelirKurus: number, birikimYuzde: number): number {
  return Math.round((gelirKurus * birikimYuzde) / 100);
}

/** §14.2 madde 3 — negatif olabilir (arayüz negatif kalanı ayrıca ele alır, madde 9). */
export function sosyalKurus(gelirKurus: number, zorunluGiderKurus: number, birikimGiderKurus: number): number {
  return gelirKurus - zorunluGiderKurus - birikimGiderKurus;
}

/**
 * §14.2 madde 4 — birikim kaydırıcısının üst sınırı: `100 − zorunlu_yuzde`.
 * `zorunlu_yuzde` burada da §14.2 madde 5'teki YUVARLANMIŞ değerdir (prototip
 * örneği: zorunlu 18.800/32.000 = %58,75 → yuvarlanır %59 → üst sınır %41).
 */
export function birikimYuzdeUstSiniri(gelirKurus: number, zorunluGiderKurus: number): number {
  if (gelirKurus <= 0) return 0;
  return Math.max(0, 100 - zorunluYuzdeYuvarlanmis(gelirKurus, zorunluGiderKurus));
}

/** §14.2 madde 4'ün paylaştığı YUVARLANMIŞ zorunlu yüzde — üst sınır ve "Zorunlu payın %X" notu AYNI sayıyı kullanır (K-040). */
export function zorunluYuzdeYuvarlanmis(gelirKurus: number, zorunluGiderKurus: number): number {
  if (gelirKurus <= 0) return 0;
  return Math.min(100, Math.round((zorunluGiderKurus * 100) / gelirKurus));
}

export type PlanPaylari = { zorunlu: number; sosyal: number; birikim: number };

/**
 * §14.2 madde 5 — RN inşa notu 8: yüzdeye TEK yardımcı fonksiyon (K-040).
 * Her pay `floor(pay×100/gelir)`e yuvarlanır, kalan kuruş "en büyük kalan"
 * (largest remainder) yöntemiyle en büyük kesirli paya eklenerek 100'e
 * tamamlanır. Örnek (32.000 ₺ gelir, 18.800/8.400/4.800): 58,75/26,25/15,0
 * → taban 58/26/15 (toplam 99) → kalan 1, en büyük kesir zorunlu(0,75) →
 * %59/%26/%15.
 */
export function dagitimYuzdeleri(gelirKurus: number, zorunluGiderKurus: number, sosyalPayKurus: number, birikimGiderKurus: number): PlanPaylari {
  if (gelirKurus <= 0) return { zorunlu: 0, sosyal: 0, birikim: 0 };
  const hamlar = [
    { anahtar: 'zorunlu' as const, ham: (zorunluGiderKurus * 100) / gelirKurus },
    { anahtar: 'sosyal' as const, ham: (Math.max(0, sosyalPayKurus) * 100) / gelirKurus },
    { anahtar: 'birikim' as const, ham: (birikimGiderKurus * 100) / gelirKurus },
  ];
  const tabanlar = hamlar.map((h) => ({ ...h, taban: Math.floor(h.ham), kesir: h.ham - Math.floor(h.ham) }));
  const toplamTaban = tabanlar.reduce((s, h) => s + h.taban, 0);
  const kalan = Math.max(0, 100 - toplamTaban);
  const kesreGoreSirali = [...tabanlar].sort((a, b) => b.kesir - a.kesir);
  const sonuc: PlanPaylari = { zorunlu: 0, sosyal: 0, birikim: 0 };
  for (const h of tabanlar) sonuc[h.anahtar] = h.taban;
  for (let i = 0; i < kalan && i < kesreGoreSirali.length; i += 1) sonuc[kesreGoreSirali[i].anahtar] += 1;
  return sonuc;
}

/** §14.2 madde 9 — sabit giderler gelirden fazlaysa plan kurulmaz. */
export function planNegatifMi(gelirKurus: number, zorunluGiderKurus: number): boolean {
  return zorunluGiderKurus > gelirKurus;
}

/** Negatif kalan tutarı — arayüzde her zaman POZİTİF gösterilir ("1.400 ₺ eksik", negatif sayı yazılmaz). */
export function eksikKurus(gelirKurus: number, zorunluGiderKurus: number): number {
  return Math.max(0, zorunluGiderKurus - gelirKurus);
}

/**
 * E-25 alışkanlık kartları (kahve · sigara · alkol · dışarıda yemek) —
 * "Ne sıklıkla" çipi. `serbest` seçilirse kullanıcı GÜNDE kaç tane
 * tükettiğini kendi yazar (prototip: "Günde kaç fincan").
 */
export type Siklik = 'gun1' | 'gun2' | 'hafta2_3' | 'hafta1' | 'ay1_2' | 'hic' | 'serbest';

/**
 * §14.2 madde 7 — "Haftada 2-3" ve "Ayda 1-2" birer ARALIK; ne delta-v4.md
 * ne tokens.md tek bir sayı vermiyor (K-040 tuzağı, bu turda tekrarlanmasın
 * diye TEK yerde sabitlendi). Orta değerler bu turun PM'e bildirilen
 * varsayımıdır — metinler.md/tokens.md'ye işlenmesi gerekir:
 *  · "Haftada 2-3" → 2,5/hafta (÷7 günlük)
 *  · "Ayda 1-2" → 1,5/ay (aylık sayı, ×30 UYGULANMAZ — zaten aylık)
 */
const SIKLIK_GUNLUK: Partial<Record<Siklik, number>> = {
  gun1: 1,
  gun2: 2,
  hafta2_3: 2.5 / 7,
  hafta1: 1 / 7,
};
const SIKLIK_AYLIK_SAYI: Partial<Record<Siklik, number>> = {
  ay1_2: 1.5,
};

/** §14.2 madde 7 — "Hiç" ya da fiyat/sıklık eksikse kalem hiç üretilmez (0 ₺ satırı yazılmaz). */
export function aliskanlikAylikKurus(siklik: Siklik | null, fiyatKurus: number | null, serbestGunlukSayi: number | null): number {
  if (!siklik || siklik === 'hic' || fiyatKurus === null || fiyatKurus <= 0) return 0;
  if (siklik === 'serbest') {
    if (serbestGunlukSayi === null || serbestGunlukSayi <= 0) return 0;
    return Math.round(serbestGunlukSayi * fiyatKurus * 30);
  }
  const gunluk = SIKLIK_GUNLUK[siklik];
  if (gunluk !== undefined) return Math.round(gunluk * fiyatKurus * 30);
  const aylikSayi = SIKLIK_AYLIK_SAYI[siklik];
  if (aylikSayi !== undefined) return Math.round(aylikSayi * fiyatKurus);
  return 0;
}

/** Abonelikler kartı — sıklık çipi YOK (K-050'ye rağmen tasarımda örneklenmemiş, bkz. rapor): kaç abonelik × ortalama aylık ücret. */
export function abonelikAylikKurus(adet: number | null, ortalamaKurus: number | null): number {
  if (!adet || !ortalamaKurus || adet <= 0 || ortalamaKurus <= 0) return 0;
  return adet * ortalamaKurus;
}

/** §14.2 madde 8 — yatırım payı yalnız bir ETİKET, ayrı bir kova değil. */
export function yatirimPayiKurus(birikimGiderKurus: number, yatirimYuzde: number): number {
  return Math.round((birikimGiderKurus * yatirimYuzde) / 100);
}

/** E-25 kart 7 "Yatırım" — nitel niyet sorusu, oran sormaz (SPK sınırı, K-053). */
export type YatirimNiyet = 'yapiyorum' | 'dusunuyorum' | 'ilgilenmiyorum';

/**
 * Hiçbir belgede birikimin yüzde kaçının "yatırım payı" etiketini alacağı
 * yazmıyor — prototip örneği (4.800 ₺ birikim → 1.920 ₺ yatırım) %40'a denk
 * düşüyor ama kaynağı belirtilmemiş. Bu turun PM'e bildirilen varsayımı:
 * "Yapıyorum" %40 · "Yapmayı düşünüyorum" %20 · "İlgilenmiyorum" %0 (satır
 * hiç gösterilmez). metinler.md/tokens.md'ye işlenmeli.
 */
const YATIRIM_YUZDE: Record<YatirimNiyet, number> = { yapiyorum: 40, dusunuyorum: 20, ilgilenmiyorum: 0 };

export function yatirimYuzdeVarsayimi(niyet: YatirimNiyet | null): number {
  return niyet ? YATIRIM_YUZDE[niyet] : 0;
}

/**
 * tokens.md §14.3 — `floor(gelir_kurus × 0.30 / kalan_gun)`, tam liraya
 * aşağı. Onaylanana kadar sunucudaki `gunluk_limit_kurus` YAZILMAZ (db/profil.ts).
 */
export function oneriLimitKurus(gelirKurus: number, gunSayisi: number): number {
  return gunlukLimitKurus(oneriSosyalKurus(gelirKurus), gunSayisi);
}
