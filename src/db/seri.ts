import type { SQLiteDatabase } from 'expo-sqlite';

import { ayarOku, ayarYaz } from '@/db/harcama';
import {
  enEskiKayitGunuGetirIstegi,
  gunDurumuYazIstegi,
  ozetSeriGetir,
  tercihleriGetir,
  type OzetSeriYaniti,
} from '@/lib/api';
import { ayAnahtari, ayBasligi, gunAnahtari, tarihtenGun } from '@/lib/tarih';

/**
 * K-048 — seri (streak). BE-6c: hesabın TAMAMI artık sunucudadır
 * (`GET /ozet/seri`, backend/README.md "ozet" bölümü + K-064/1) — mevcut
 * seri · en uzun seri (+bittiği gün, KALICI ratchet, `kullanici_profilleri`de)
 * · son 30 günün ızgarası · geçilen milestone'lar hep oradan gelir. Bu
 * dosyada bir daha `harcama`/`limit_gecmisi` toplama mantığı YOKTUR (K-068 —
 * iki yerde iki farklı seri sayısı çıkmasın).
 *
 * `MILESTONES` sabiti ve pure `gunSeriDurumu` sınıflandırması bilerek
 * kalıyor: ilki `MilestoneRail`in render girdisidir, ikincisi sunucudaki
 * `gun_izgara_durumu` ile BİREBİR aynı saf kural (K-068 ihlali değil —
 * "toplama" değil, zaten hesaplanmış tek bir günün tutarını sınıflandırıyor)
 * ve `useGunSecici.ts`in ay ızgarasında hâlâ kullanılıyor.
 *
 * "Bugün YENİ geçilen ve daha önce hiç gösterilmemiş milestone" (kutlama
 * tetiği) SAF bir UI durumudur, finansal veri DEĞİLDİR (K-068 kapsamı
 * dışı) — bu yüzden yalnız burada, yerel `ayar.seri_en_yuksek_gosterilen_donum`
 * ile takip edilmeye devam eder; sunucu `gecilen_milestoneler`i (TÜM
 * zamanların) döner ama "daha önce gösterildi mi" bayrağını TUTMAZ.
 */

/** K-048 — milestone dizisi. Artırılamaz/uydurulmaz (bağlayıcı liste, sunucudakiyle BİREBİR aynı). */
export const MILESTONES = [3, 7, 14, 30, 60, 100, 180, 365] as const;

/** K-048 hile kapısı (b) — `PUT /harcama/gun-durumu` (BE-6c). */
export async function gunHarcamasizIsaretle(_db: SQLiteDatabase, gun: string): Promise<void> {
  await gunDurumuYazIstegi(gun, true);
}

/**
 * K-049 sol sınır: kayıt varsa ilk kaydın günü, yoksa kurulum günü — ikisinin
 * DE ERKEN olanı (sunucudaki `seri_sinir_gunu_belirle` ile AYNI kural,
 * backend/ozet_service.py). BE-6c/K-084-2: yerel `ayar.kurulum_gunu` ARTIK
 * OKUNMAZ — sunucudaki `tercihler.kurulum_gunu` TEK otoritedir.
 * `app/index.tsx#useGunlukSinir` (Günlük sekmesi sayfalaması) ve
 * `useGunSecici.ts` (ay ızgarası) bunu paylaşır.
 */
export async function ilkSinirGunu(_db: SQLiteDatabase): Promise<string> {
  const bugunGun = gunAnahtari(new Date());
  const [tercihler, enEski] = await Promise.all([tercihleriGetir(), enEskiKayitGunuGetirIstegi()]);
  const kurulum = tercihler.kurulum_gunu ?? bugunGun;
  return enEski.gun !== null && enEski.gun < kurulum ? enEski.gun : kurulum;
}

/**
 * Bir günün veriye dayalı durumu. "pasif" (dokunulamaz — ilk kayıt öncesi/
 * gelecek) BUNUN parçası değildir; ayrı bir alan (`GunSeciciGunu.pasif`),
 * çünkü bir gün AYNI ANDA hem "bos" hem "pasif" olabilir (K-040 — iki dil
 * aynı elemanda birleşmez, tek bir "durum" alanına sıkıştırılmaz).
 */
export type GunSeriDurumu = 'altinda' | 'disinda' | 'bos';

/** Tek bir günün ızgara/seri durumu — E-24 ay ızgarası sınıflandırması (sunucudaki `gun_izgara_durumu` ile birebir aynı SAF kural). */
export function gunSeriDurumu(
  harcananKurus: number,
  kayitAdedi: number,
  limitKurus: number | null,
): GunSeriDurumu {
  if (kayitAdedi === 0) return 'bos';
  if (limitKurus !== null && harcananKurus > limitKurus) return 'disinda';
  return 'altinda';
}

/** E-10 günün seri/UI durumu — `/ozet/pano`nun `seri` alanından BİREBİR gelir (bkz. `usePano.ts`). */
export type GunSeriBilgisi = {
  harcananKurus: number;
  kayitAdedi: number;
  harcamasizIsaretli: boolean;
  /** `limitKurus` tanımsızsa `null` (seri hiç değerlendirilmez). */
  seriyeSayildiMi: boolean | null;
};

export type SeriDurumu = {
  /** Bugün dahil, geriye doğru kesintisiz seriye sayılan gün sayısı. */
  mevcutSeri: number;
  enUzunSeri: number;
  /** "Temmuz 2026" — en uzun serinin bittiği ay. Hiç yoksa `null`. */
  enUzunSeriEtiketi: string | null;
  /** Limitsiz mod — seri işlemez (K-048). */
  kapali: boolean;
  /** `mevcutSeri === 0` ama daha önce bir seri vardıysa (suçlayıcı olmayan dil). */
  kirildiMi: boolean;
  sonrakiDurak: number | null;
  oncekiDurak: number;
  /** `sonrakiDurak - mevcutSeri` — yalnız `mevcutSeri > 0`. */
  kalanGun: number | null;
  /** Önceki↔sonraki durak arasındaki ilerleme oranı, 0..1. */
  aralikYuzde: number;
  /** Bugün YENİ geçilen ve daha önce hiç gösterilmemiş milestone — kutlama tetiği. */
  kutlanacakMilestone: number | null;
};

/** E-21 ızgara hücresi — ham gün anahtarı (`YYYY-MM-DD`) + sınıflandırma. `useSeriEkrani.ts` gün numarasına/etikete kendi çevirir. */
export type SeriIzgaraHucresi = { gun: string; durum: GunSeriDurumu };

export type SeriGorunumu = { durum: SeriDurumu; izgara: SeriIzgaraHucresi[] };

async function kutlanacakMilestoneBul(db: SQLiteDatabase, mevcutSeri: number): Promise<number | null> {
  const gosterilenDonum = Number((await ayarOku(db, 'seri_en_yuksek_gosterilen_donum')) ?? '0');
  return (MILESTONES as readonly number[]).includes(mevcutSeri) && mevcutSeri > gosterilenDonum ? mevcutSeri : null;
}

/** Kutlama gösterildikten sonra kalıcı işaretle — uygulama yeniden açılınca tekrar oynamaz. */
export async function milestoneGosterildiIsaretle(db: SQLiteDatabase, milestone: number): Promise<void> {
  const mevcut = Number((await ayarOku(db, 'seri_en_yuksek_gosterilen_donum')) ?? '0');
  if (milestone <= mevcut) return;
  await ayarYaz(db, 'seri_en_yuksek_gosterilen_donum', String(milestone));
}

function yanitiSeriDurumunaCevir(y: OzetSeriYaniti, kutlanacakMilestone: number | null): SeriDurumu {
  return {
    mevcutSeri: y.mevcut_seri,
    enUzunSeri: y.en_uzun_seri,
    enUzunSeriEtiketi: y.en_uzun_seri_bitis_gunu ? ayBasligi(ayAnahtari(tarihtenGun(y.en_uzun_seri_bitis_gunu))) : null,
    kapali: y.kapali,
    kirildiMi: y.kirildi_mi,
    sonrakiDurak: y.sonraki_durak,
    oncekiDurak: y.onceki_durak,
    kalanGun: y.kalan_gun,
    aralikYuzde: y.aralik_yuzde,
    kutlanacakMilestone,
  };
}

/** E-21 — seri durumu + son 30 günün ızgarası, TEK ağ isteğiyle (`useSeriEkrani.ts`). */
export async function seriGorunumuGetir(db: SQLiteDatabase): Promise<SeriGorunumu> {
  // K-087 — sunucuya "bugün"ü YEREL gün sınırı hesabıyla gönderiyoruz (UTC'ye düşerse
  // gece 00:00-03:00 arası eklenen harcama yanlış güne sayılabilir).
  const yanit = await ozetSeriGetir(gunAnahtari(new Date()));
  const kutlanacak = await kutlanacakMilestoneBul(db, yanit.mevcut_seri);
  return {
    durum: yanitiSeriDurumunaCevir(yanit, kutlanacak),
    izgara: yanit.izgara.map((h) => ({ gun: h.gun, durum: h.durum })),
  };
}

/** E-10 başlığındaki seri özeti + milestone tetiği (`useSeriOzet.ts`) — ızgarayı kullanmaz, aynı yanıtı atar. */
export async function seriDurumuHesapla(db: SQLiteDatabase): Promise<SeriDurumu> {
  return (await seriGorunumuGetir(db)).durum;
}
