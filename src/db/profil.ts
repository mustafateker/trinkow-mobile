import type { SQLiteDatabase } from 'expo-sqlite';

import { kategoriLimitleriniTohumla } from '@/db/limitler';
import { katman1Kaydet as katman1KaydetIstegi, katman2Kaydet as katman2KaydetIstegi, kullaniciProfiliGetir, gunlukLimitiAyarlaIstegi, planiKurIstegi, type AliskanlikGirdisi as ApiAliskanlikGirdisi, type AliskanlikYaniti as ApiAliskanlikYaniti, type Katman1IstegiGovdesi, type Katman2IstegiGovdesi, type KullaniciProfilYaniti } from '@/lib/api';
import { type Siklik, type YatirimNiyet } from '@/lib/plan';
import { gunAnahtari } from '@/lib/tarih';

/**
 * BE-6a — `profil` tablosu artık tamamen SUNUCUDADIR (K-068). Bu dosya
 * yalnız `src/lib/api.ts`'in `kullanici` uç noktalarını çağırır; yerel
 * SQLite'a `profil` tablosuna bir daha OKUMA/YAZMA YAPILMAZ (aşağıdaki
 * `db: SQLiteDatabase` parametreleri yalnız dışa verilen imzayı — bu
 * modülü çağıran ekranları (onboarding/tanisma/plan/ayarlar) DEĞİŞTİRMEMEK
 * için korunur; gövdede kullanılmazlar).
 *
 * `src/db/semasi.ts`'teki `profil` tablosu şimdilik SİLİNMEDİ (bir sonraki
 * turda harcama verisiyle birlikte topluca temizlenecek, PM talimatı) —
 * yalnız bu dosyanın ona giden yolu kesildi.
 *
 * BE-6d (K-087): `gunluk_limit_kurus` artık TAMAMEN sunucuda — bu dosya tek
 * otorite (`GET /kullanici/profil`) okur, `gunlukLimitKurusOku` tüm ekranların
 * (kayitlar/limitler/harcama-ekle/ozet/plan) TEK okuma noktasıdır. Yazma
 * `db/limitler.ts#gunlukLimitKaydet`/`gunlukLimitGecmisiKaydet` üzerinden.
 */

/** E-01 niyet seçeneği (K-053). Kip çipi (`pano.kip.*`) bunun üstüne kurulur. */
export type Niyet = 'takip' | 'tasarruf' | 'borc';

export type Profil = {
  niyet: Niyet | null;
  gelirKurus: number | null;
  /** 1-31; "Düzensiz" seçildiyse `null` (bkz. `maasDuzensiz`). */
  maasGunu: number | null;
  maasDuzensiz: boolean;
  /** K-059/5 — onaylanana kadar GERÇEK limit değildir (tokens §14.3). */
  gunlukLimitOnerisiKurus: number | null;
  onboardingTamamlandi: boolean;
};

/**
 * Son bilinen sunucu yanıtı — yalnız `profilDetayAlanKaydet`'in alışkanlık
 * kartlarını (kahve/sigara/alkol/yemek) MERGE ederek göndermesi için
 * kullanılır (bkz. aşağıdaki yorum, K-040 tekrar tuzağı değil — sözleşme
 * zorunluluğu): `PATCH /kullanici/profil/katman2`'de bir kart gönderilirse
 * o kartın ÜÇ alt alanı BİRLİKTE yazılır; ekran ise alanları TEK TEK
 * (siklik seçilince, fiyat girilince ayrı ayrı) yazar. Kardeş alanı
 * kaybetmemek için son bilinen değerle birleştiriyoruz. Okuma fonksiyonları
 * (`profilOku`/`profilDetayOku`) HER ZAMAN ağdan taze veri çeker — bu
 * önbellek bir doğruluk kaynağı DEĞİL, yalnız birleştirme yardımcısıdır.
 */
let sonBilinenYanit: KullaniciProfilYaniti | null = null;
let ucustakiIstek: Promise<KullaniciProfilYaniti> | null = null;

/**
 * `profilOku`/`profilDetayOku` aynı ekranda genelde `Promise.all` ile
 * BİRLİKTE çağrılır (tanisma.tsx, plan.tsx) — ikisi de aynı sunucu
 * kaynağını okur. Eşzamanlı çağrıları TEK ağ isteğine indirger (basit
 * istek tekilleştirme, bir önbellekleme/geçerlilik politikası DEĞİL).
 */
async function profilYanitiGetir(): Promise<KullaniciProfilYaniti> {
  if (ucustakiIstek) return ucustakiIstek;
  ucustakiIstek = kullaniciProfiliGetir()
    .then((yanit) => {
      sonBilinenYanit = yanit;
      return yanit;
    })
    .finally(() => {
      ucustakiIstek = null;
    });
  return ucustakiIstek;
}

function yanitiProfileCevir(y: KullaniciProfilYaniti): Profil {
  return {
    niyet: y.niyet,
    gelirKurus: y.gelir_kurus,
    maasGunu: y.maas_gunu,
    maasDuzensiz: y.maas_duzensiz,
    gunlukLimitOnerisiKurus: y.gunluk_limit_onerisi_kurus,
    onboardingTamamlandi: y.onboarding_tamamlandi,
  };
}

export async function profilOku(_db: SQLiteDatabase): Promise<Profil> {
  return yanitiProfileCevir(await profilYanitiGetir());
}

/**
 * Günlük limit — TEK otorite `kullanici_profilleri.gunluk_limit_kurus`
 * (BE-6d/K-087). `kayitlar`/`limitler`/`harcama-ekle`/`ozet`/`plan`
 * ekranlarının hepsi `db/harcama.ts#gunlukLimit` üzerinden buraya gelir —
 * aynı istek tekilleştirmesini (`profilYanitiGetir`) paylaşır, ikinci bir
 * doğruluk kaynağı DEĞİLDİR.
 */
export async function gunlukLimitKurusOku(): Promise<number | null> {
  return (await profilYanitiGetir()).gunluk_limit_kurus;
}

/**
 * İlk açılış yönlendirmesi — bu sorunun TEK cevaplandığı yer burasıdır.
 * `app/_layout.tsx` bunu çağırır; bir sonraki tur (D-2c, E-00 açılış) aynı
 * fonksiyonu kullanacak, ikinci bir "tamamlandı mı" tanımı yazılmaz.
 */
export async function onboardingTamamlandiMi(db: SQLiteDatabase): Promise<boolean> {
  return (await profilOku(db)).onboardingTamamlandi;
}

export type OnboardingGirdisi = {
  niyet: Niyet | null;
  gelirKurus: number | null;
  maasGunu: number | null;
  maasDuzensiz: boolean;
  gunlukLimitOnerisiKurus: number | null;
};

/**
 * Katman 1'in sonu ("Başla") ya da "Şimdi değil" — onboarding'i TEK
 * seferde kapatır. Sunucudaki `gunluk_limit_kurus`a DOKUNMAZ: öneri kabul
 * edilmeden gerçek limit yazılmaz (K-059/5) — bkz. `oneriKabulEt`.
 */
export async function onboardingKaydet(_db: SQLiteDatabase, girdi: OnboardingGirdisi): Promise<void> {
  const govde: Katman1IstegiGovdesi = {
    niyet: girdi.niyet,
    gelir_kurus: girdi.gelirKurus,
    maas_gunu: girdi.maasGunu,
    maas_duzensiz: girdi.maasDuzensiz,
    gunluk_limit_onerisi_kurus: girdi.gunlukLimitOnerisiKurus,
  };
  sonBilinenYanit = await katman1KaydetIstegi(govde);
}

/**
 * "Limiti kabul et" — öneriyi gerçek günlük limite yükseltir (RN inşa notu
 * 7-8). `PUT /kullanici/plan/gunluk-limit` otoriteyi VE `limit_gecmisi`yi TEK
 * istekte yazar (K-085 Madde 6) — istemci ikinci kez yazmaz (BE-6d).
 */
export async function oneriKabulEt(_db: SQLiteDatabase, limitKurus: number): Promise<void> {
  sonBilinenYanit = await gunlukLimitiAyarlaIstegi(limitKurus, gunAnahtari(new Date()));
}

/* --------------------------------------------------------------------------
 * D-2c-1 · Ayarlar > Plan ve profil — E-01/E-02/E-03'ün tek alanlarını
 * onboarding akışının DIŞINDA, tek başına günceller (11-ayarlar.html "Aylık
 * net gelir" / "Maaş günü" / "Kip" satırları).
 *
 * Sözleşme notu (PM'e bildirilecek): `PUT /kullanici/profil/katman1`
 * `Katman2Istegi`nin aksine KISMİ GÜNCELLEME YAPMAZ — niyet/gelir/maaş
 * gününün TAMAMINI birlikte yazar. Tek alanı değiştirmek için önce mevcut
 * profili okuyup diğer alanları AYNEN geri gönderiyoruz (read-modify-write).
 * Bir sonraki backend turunda Katman 2 gibi kısmi bir `PATCH` eklenirse bu
 * ekstra okuma kalkabilir.
 * ------------------------------------------------------------------------ */

async function katman1KismiGuncelle(degisiklik: Partial<Katman1IstegiGovdesi>): Promise<void> {
  const mevcut = sonBilinenYanit ?? (await profilYanitiGetir());
  const govde: Katman1IstegiGovdesi = {
    niyet: mevcut.niyet,
    gelir_kurus: mevcut.gelir_kurus,
    maas_gunu: mevcut.maas_gunu,
    maas_duzensiz: mevcut.maas_duzensiz,
    gunluk_limit_onerisi_kurus: mevcut.gunluk_limit_onerisi_kurus,
    ...degisiklik,
  };
  sonBilinenYanit = await katman1KaydetIstegi(govde);
}

/** Ayarlar > Plan ve profil — "Aylık net gelir" satırı. */
export async function gelirKaydet(_db: SQLiteDatabase, gelirKurus: number | null): Promise<void> {
  await katman1KismiGuncelle({ gelir_kurus: gelirKurus });
}

/** Ayarlar > Plan ve profil — "Maaş günü" satırı. */
export async function maasGunuKaydet(_db: SQLiteDatabase, maasGunu: number | null, maasDuzensiz: boolean): Promise<void> {
  await katman1KismiGuncelle({ maas_gunu: maasDuzensiz ? null : maasGunu, maas_duzensiz: maasDuzensiz });
}

/** Ayarlar — "Kip" satırı: E-01'in niyet cevabını sonradan değiştirir. */
export async function niyetKaydet(_db: SQLiteDatabase, niyet: Niyet): Promise<void> {
  await katman1KismiGuncelle({ niyet });
}

/* ------------------------------------------------------------------------
 * D-2d-3b · E-25 "Seni tanıyalım" (Katman 2) + E-26 "Planın hazır".
 * Cevaplanmamış alan `null`dır, 0 ile DOLDURULMAZ (RN inşa notu 4: 0 = "hiç
 * harcamıyorum", null = "cevaplamadım"; plan ekranı ikisini farklı gösterir).
 * ------------------------------------------------------------------------ */

export type AliskanlikCevabi = {
  siklik: Siklik | null;
  serbestSayi: number | null;
  fiyatKurus: number | null;
};

/** D-2c-1 · E-20 `prof.taksit` sorusunun cevap kümesi (E-25'in 8 kartından değil — bkz. rapor). */
export type TaksitSiklik = 'sik_sik' | 'bazen' | 'nadiren';

export type ProfilDetay = {
  kiraAidatKurus: number | null;
  faturalarKurus: number | null;
  ulasimYakitKurus: number | null;
  krediTaksitKurus: number | null;
  kahve: AliskanlikCevabi;
  sigara: AliskanlikCevabi;
  alkol: AliskanlikCevabi;
  yemek: AliskanlikCevabi;
  abonelikAdet: number | null;
  abonelikOrtalamaKurus: number | null;
  yatirimNiyet: YatirimNiyet | null;
  birikimYuzde: number | null;
  /** "Kaldığın yerden" — en son açık bırakılan kart (1-8). */
  sonKart: number;
  planKuruldu: boolean;
  /** D-2c-1 · E-20 `prof.taksit` — 8 karta dahil değil, yalnız profilleme sheet'i yazar. */
  taksitSiklik: TaksitSiklik | null;
};

function aliskanlikCevir(a: ApiAliskanlikYaniti): AliskanlikCevabi {
  return { siklik: a.siklik as Siklik | null, serbestSayi: a.serbest_sayi, fiyatKurus: a.fiyat_kurus };
}

function yanitiDetayaCevir(y: KullaniciProfilYaniti): ProfilDetay {
  return {
    kiraAidatKurus: y.kira_aidat_kurus,
    faturalarKurus: y.faturalar_kurus,
    ulasimYakitKurus: y.ulasim_yakit_kurus,
    krediTaksitKurus: y.kredi_taksit_kurus,
    kahve: aliskanlikCevir(y.kahve),
    sigara: aliskanlikCevir(y.sigara),
    alkol: aliskanlikCevir(y.alkol),
    yemek: aliskanlikCevir(y.yemek),
    abonelikAdet: y.abonelik_adet,
    abonelikOrtalamaKurus: y.abonelik_ortalama_kurus,
    yatirimNiyet: y.yatirim_niyet,
    birikimYuzde: y.birikim_yuzde,
    sonKart: y.son_kart,
    planKuruldu: y.plan_kuruldu,
    taksitSiklik: y.taksit_siklik,
  };
}

export async function profilDetayOku(_db: SQLiteDatabase): Promise<ProfilDetay> {
  return yanitiDetayaCevir(await profilYanitiGetir());
}

/** Katman 2'nin yazılabilir kolonları — serbest string enterpolasyonunu (SQL) kapatmak için sabit liste. */
export type ProfilDetayKolonu =
  | 'kira_aidat_kurus'
  | 'faturalar_kurus'
  | 'ulasim_yakit_kurus'
  | 'kredi_taksit_kurus'
  | 'kahve_siklik'
  | 'kahve_serbest_sayi'
  | 'kahve_fiyat_kurus'
  | 'sigara_siklik'
  | 'sigara_serbest_sayi'
  | 'sigara_fiyat_kurus'
  | 'alkol_siklik'
  | 'alkol_serbest_sayi'
  | 'alkol_fiyat_kurus'
  | 'yemek_siklik'
  | 'yemek_serbest_sayi'
  | 'yemek_fiyat_kurus'
  | 'abonelik_adet'
  | 'abonelik_ortalama_kurus'
  | 'yatirim_niyet'
  | 'birikim_yuzde'
  | 'taksit_siklik';

type HabitKart = 'kahve' | 'sigara' | 'alkol' | 'yemek';
type HabitAltAlan = 'siklik' | 'serbest_sayi' | 'fiyat_kurus';

/** Alışkanlık kartlarının tekil kolonu → (kart, alt alan) eşlemesi — merge için (bkz. dosya başı notu). */
const HABIT_ALAN: Partial<Record<ProfilDetayKolonu, { kart: HabitKart; alt: HabitAltAlan }>> = {
  kahve_siklik: { kart: 'kahve', alt: 'siklik' },
  kahve_serbest_sayi: { kart: 'kahve', alt: 'serbest_sayi' },
  kahve_fiyat_kurus: { kart: 'kahve', alt: 'fiyat_kurus' },
  sigara_siklik: { kart: 'sigara', alt: 'siklik' },
  sigara_serbest_sayi: { kart: 'sigara', alt: 'serbest_sayi' },
  sigara_fiyat_kurus: { kart: 'sigara', alt: 'fiyat_kurus' },
  alkol_siklik: { kart: 'alkol', alt: 'siklik' },
  alkol_serbest_sayi: { kart: 'alkol', alt: 'serbest_sayi' },
  alkol_fiyat_kurus: { kart: 'alkol', alt: 'fiyat_kurus' },
  yemek_siklik: { kart: 'yemek', alt: 'siklik' },
  yemek_serbest_sayi: { kart: 'yemek', alt: 'serbest_sayi' },
  yemek_fiyat_kurus: { kart: 'yemek', alt: 'fiyat_kurus' },
};

/**
 * Tek bir alanı anında yazar — RN inşa notu 4: "Devam" beklemez. Alışkanlık
 * kartlarında (`HABIT_ALAN`) sunucunun kısmi güncellemesi KART bazlıdır
 * (üç alt alan birlikte), bu yüzden son bilinen kart durumuyla BİRLEŞTİRİP
 * gönderiyoruz — aksi hâlde kardeş alan (ör. daha önce yazılmış fiyat)
 * `None`'a düşer (bkz. dosya başı notu).
 */
export async function profilDetayAlanKaydet(db: SQLiteDatabase, kolon: ProfilDetayKolonu, deger: string | number | null): Promise<void> {
  const habit = HABIT_ALAN[kolon];
  if (habit) {
    const mevcut = sonBilinenYanit ?? (await profilYanitiGetir());
    const yeniKart: ApiAliskanlikGirdisi = { ...mevcut[habit.kart], [habit.alt]: deger };
    const govde: Katman2IstegiGovdesi = { [habit.kart]: yeniKart };
    sonBilinenYanit = await katman2KaydetIstegi(govde);
    return;
  }
  const govde = { [kolon]: deger } as Katman2IstegiGovdesi;
  sonBilinenYanit = await katman2KaydetIstegi(govde);
}

/**
 * E-26 "Planı kur" — zorunlu/sosyal/birikim paylarını ve günlük limiti artık
 * SUNUCU hesaplar (K-075, `POST /kullanici/plan/kur` gövde ALMAZ; mevcut
 * Katman 1/2 verisinden kendi hesaplar, `gunluk_limit_kurus` otoritesini de
 * kaydeder). `gunlukLimitKurus` parametresi çağıran ekranın (plan.tsx) anlık
 * (kaydırıcı) önizlemesidir — GERÇEK değer sunucunun döndürdüğüdür; bu
 * fonksiyon artık onu KULLANMAZ (dışa verilen imza, ekranı değiştirmemek
 * için korunur).
 *
 * QA-1e (K-091 sonrası tur): `plan/kur` artık `limit_gecmisi`yi KENDİSİ yazıyor
 * (`kullanici_service.py#plani_kur`, backend). İstemci ARTIK ikinci bir
 * `limit_gecmisi` satırı eklemez — tek yazan taraf sunucudur (bkz. rapor).
 * Kategori limitleri (`kategoriLimitleriniTohumla`) hâlâ yerelde
 * tohumlanmıyor, sunucuya yazılıyor (bkz. `db/limitler.ts`).
 */
export async function planKur(
  db: SQLiteDatabase,
  gunlukLimitKurus: number,
  aylikKurus: { kafe: number; restoran: number; abonelik: number; aliskanliklar: number },
): Promise<void> {
  sonBilinenYanit = await planiKurIstegi(gunAnahtari(new Date()));
  await kategoriLimitleriniTohumla(db, aylikKurus);
}

/**
 * Ayarlar > Plan ve profil — "{n} kart kaldı" / "8 kart bekliyor" sayacı.
 * `app/tanisma.tsx`'in yerel `kartDolduMu`'suyla AYNI 8 kural (E-25'in 8
 * kartı) — kod tekrarı bilinçli: tanisma.tsx bu turda değiştirilmiyor
 * (kabul edilmiş ekran), bu yüzden kural buraya AYRICA yazıldı.
 */
export function katman2DolanKartSayisi(d: ProfilDetay): number {
  let n = 0;
  if (d.kiraAidatKurus !== null || d.faturalarKurus !== null || d.ulasimYakitKurus !== null || d.krediTaksitKurus !== null) n += 1;
  if (d.kahve.siklik !== null) n += 1;
  if (d.sigara.siklik !== null) n += 1;
  if (d.alkol.siklik !== null) n += 1;
  if (d.yemek.siklik !== null) n += 1;
  if (d.abonelikAdet !== null || d.abonelikOrtalamaKurus !== null) n += 1;
  if (d.yatirimNiyet !== null) n += 1;
  if (d.birikimYuzde !== null) n += 1;
  return n;
}
