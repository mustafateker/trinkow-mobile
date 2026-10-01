import type { SQLiteBindValue, SQLiteDatabase } from 'expo-sqlite';

import { gunlukLimitKurusOku } from '@/db/profil';
import {
  istek,
  enEskiKayitGunuGetirIstegi,
  harcamaEkleIstegi,
  harcamaGetirIstegi,
  harcamaGuncelleIstegi,
  harcamalariListeleIstegi,
  harcamaSilIstegi,
  taksitSerisiSilIstegi,
  tumVerileriSilIstegi,
  type HarcamaGuncellemeGovdesi,
  type HarcamaListeSuzgeci,
  type HarcamaYaniti,
} from '@/lib/api';
import { ayEkle, gunAnahtari } from '@/lib/tarih';
import { turkceNormalize } from '@/lib/urunArama';

/**
 * Harcama veri modeli — backlog Ü-5'e hazır: ürün adı / tutar / tarih
 * AYRI alanlardır, tek serbest metin değil.
 *
 * PARA: `tutarKurus` DAİMA kuruş cinsinden integer. Float ile para tutmak
 * sessiz kuruş hatası üretir.
 *
 * BE-6b (K-068): harcama CRUD'u, taksit serisi silme, sık alınanlar/ürün
 * arama, ay/gün toplamları artık `/harcama/*` uçlarından okunur — SQLite
 * `harcama` tablosu bu fonksiyonlar için ARTIK YAZILMAZ/OKUNMAZ. `id` bu
 * yüzden Mongo ObjectId'nin string hâlidir, SAYISAL DEĞİLDİR (auth/kullanici
 * modülleriyle aynı desen).
 *
 * BE-6c: `gununHarcamalari` (yalnız `usePano.ts` kullanır) ve
 * `gunAraligiToplamlari` (yalnız `useGunSecici.ts` kullanır) artık `/harcama/`
 * ham liste ucundan çekilen kayıtları GRUPLAR — sunucuda bu aralıklar için
 * hazır bir "gün başına toplam" ucu yok (yalnız tekil gün `/ozet/pano` ve
 * dönem toplamı `/ozet/donem` var); bu, `ayHarcamalari`/`ayOzeti`nin zaten
 * yaptığı istemci-taraflı LİSTE GRUPLAMASIYLA aynı desendir, sunucunun
 * yaptığı toplama/seri hesabının TEKRARI değildir. `ilkKayitGunu` ve
 * `tumVeriyiSil` artık `/harcama/ayar/en-eski-kayit-gunu` ve
 * `/harcama/ayar/tum-veriler`i çağırır (K-085 Madde 3/4). Yerel `harcama`
 * tablosu bu turdan sonra TAMAMEN ölüdür (bkz. `db/semasi.ts`).
 */
export type OdemeTipi = 'nakit' | 'kart';

/** §7 / K-036 — ödeme tipinde tek varsayılan: Kart. */
export const ODEME_VARSAYILAN: OdemeTipi = 'kart';

export type Harcama = {
  /** Mongo ObjectId (string) — BE-6b öncesi SQLite INTEGER idi, artık DEĞİL. */
  id: string;
  rutinId?: string | null;
  adet?: number;
  sabitGiderKodu?: 'kira' | 'fatura' | 'ulasim' | 'kredi' | null;
  istemciId?: string;
  /** kuruş integer */
  tutarKurus: number;
  kategori: string;
  /** Ü-5 — ayrı alan; yoksa kategori adı gösterilir */
  urunAdi: string | null;
  /** ISO 8601 yerel damga */
  zaman: string;
  /** 'YYYY-MM-DD' yerel gün anahtarı */
  gun: string;
  odeme: OdemeTipi;
  /** E-12 "Not" alanı — isteğe bağlı, tek satır */
  notMetni: string | null;
  /** Taksit serisi grubu — null ise tek harcama */
  taksitId: string | null;
  /** 1 tabanlı taksit sırası (3/12 → 3) */
  taksitNo: number | null;
  /** Serideki toplam taksit sayısı (3/12 → 12) */
  taksitToplam: number | null;
};

function cevir(y: HarcamaYaniti): Harcama {
  return {
    id: y.id,
    rutinId: y.rutin_id, adet: y.adet, sabitGiderKodu: y.sabit_gider_kodu,
    tutarKurus: y.tutar_kurus,
    kategori: y.kategori,
    urunAdi: y.urun_adi,
    zaman: y.zaman,
    gun: y.gun,
    odeme: y.odeme,
    notMetni: y.not_metni,
    taksitId: y.taksit_id,
    taksitNo: y.taksit_no,
    taksitToplam: y.taksit_toplam,
  };
}

/** Sunucunun sabitlediği azami sayfa boyutu (`harcama_dto.py`). */
const AZAMI_SAYFA_BOYUTU = 200;

/**
 * Bir süzgece uyan TÜM kayıtları döner — 300+ günlük geçmiş senaryosunda tek
 * istekte çekmek yerine sunucunun sayfa sınırına (≤200) saygılı, `toplam_kayit`e
 * ulaşana kadar sayfa sayfa gerçek bir döngüyle çeker. Dışa açılan fonksiyonlar
 * (ör. `ayHarcamalari`) eskisi gibi tam diziyi döndürmeye devam eder; sayfalama
 * ağ katmanında GİZLİDİR. `db/ozet.ts` (E-16 hafta özeti) ve `useGunSecici.ts`
 * (E-24 ay ızgarası) da aynı sayfalama döngüsünü paylaşmak için EXPORT edilir.
 */
export async function tumSayfalariGetir(suzgec: HarcamaListeSuzgeci): Promise<HarcamaYaniti[]> {
  const kayitlar: HarcamaYaniti[] = [];
  let sayfa = 1;
  for (;;) {
    const yanit = await harcamalariListeleIstegi({ ...suzgec, sayfa, sayfa_boyutu: AZAMI_SAYFA_BOYUTU });
    kayitlar.push(...yanit.kayitlar);
    if (yanit.kayitlar.length === 0 || kayitlar.length >= yanit.toplam_kayit) break;
    sayfa += 1;
  }
  return kayitlar;
}

/** Bir ayın TÜM kayıtları — E-14 gün gruplama burada, `src/lib/gruplama.ts` ile. */
export async function ayHarcamalari(_db: SQLiteDatabase, ay: string): Promise<Harcama[]> {
  const kayitlar = await tumSayfalariGetir({ baslangic_gun: `${ay}-01`, bitis_gun: `${ay}-31` });
  return kayitlar.map(cevir);
}

export type AySpecifiOzeti = { adet: number; toplamKurus: number };

/** `kayitlar.ay_ozet` — "{adet} kayıt · {tutar}" (E-14 ay değiştirici). */
export async function ayOzeti(_db: SQLiteDatabase, ay: string): Promise<AySpecifiOzeti> {
  const kayitlar = await tumSayfalariGetir({ baslangic_gun: `${ay}-01`, bitis_gun: `${ay}-31` });
  return { adet: kayitlar.length, toplamKurus: kayitlar.reduce((t, k) => t + k.tutar_kurus, 0) };
}

/** E-14 — hiç kayıt yok mu (tüm zamanlar)? Ay değiştiricinin gösterilip gösterilmeyeceğini belirler. */
export async function herhangiKayitVarMi(_db: SQLiteDatabase): Promise<boolean> {
  const yanit = await harcamalariListeleIstegi({ sayfa: 1, sayfa_boyutu: 1 });
  return yanit.toplam_kayit > 0;
}

export async function gunToplami(_db: SQLiteDatabase, gun: string): Promise<number> {
  const kayitlar = await tumSayfalariGetir({ gun });
  return kayitlar.reduce((t, k) => t + k.tutar_kurus, 0);
}

/** BE-6c — bir günün ham kayıt listesi (E-10 gün sayfasının satırları). `usePano.ts` kullanır. */
export async function gununHarcamalari(_db: SQLiteDatabase, gun: string): Promise<Harcama[]> {
  const kayitlar = await tumSayfalariGetir({ gun });
  return kayitlar.map(cevir);
}

export type KategoriDurumu = {
  kategori: string;
  harcananKurus: number;
  limitKurus: number;
  /** v4 E-10 — o günün (bugünün) kategori toplamı, K-056 ikincil satır. `gun` verilmezse 0. */
  bugunKurus: number;
};

/**
 * BE-6c — `ayarlar.tsx` (E-19) "ilk kayıt günü" satırı ve silinecek kayıt
 * sayısı diyaloğu. Sunucu ucu K-085 Madde 4/BE-4b ile açıldı.
 */
export async function ilkKayitGunu(_db: SQLiteDatabase): Promise<string | null> {
  return (await enEskiKayitGunuGetirIstegi()).gun;
}

/**
 * D-2c-1 · E-19 "Tüm verileri sil" onay diyaloğu — silinecek kayıt sayısı.
 * BE-6b: gerçek sayfalanmış listeleme ucundan `toplam_kayit` okunur.
 */
export async function tumKayitSayisi(_db: SQLiteDatabase): Promise<number> {
  const yanit = await harcamalariListeleIstegi({ sayfa: 1, sayfa_boyutu: 1 });
  return yanit.toplam_kayit;
}

/**
 * D-2c-1 · E-19 "Tüm verileri sil" — BE-6c ile `DELETE /harcama/ayar/tum-veriler`e
 * taşındı (K-085 Madde 3): harcama/kategori limiti/gün durumu/limit geçmişi/
 * ürün öğrenmeyi sunucuda siler; hesabı ve profili SİLMEZ. Yerel `ayar`
 * bayrağı (`kullanici_verisi`) örnek-veri tazelemesiyle ilgiliydi, o akış bu
 * turda kaldırıldığı için artık yazılmıyor (bkz. `db/semasi.ts`).
 */
export async function tumVeriyiSil(_db: SQLiteDatabase): Promise<void> {
  await tumVerileriSilIstegi();
}

export type GunToplami = { gun: string; toplamKurus: number; kayitAdedi: number };

/**
 * BE-6c — bir aralıktaki gün başına toplam/kayıt adedi. Sunucuda bu aralık
 * için hazır bir uç YOK (yalnız tekil gün `/ozet/pano`, dönem toplamı
 * `/ozet/donem` var); `useGunSecici.ts`in ay ızgarası bu yüzden ham kayıt
 * listesini (`/harcama/`) çekip İSTEMCİDE gruplar — `ayHarcamalari`/
 * `ayOzeti`nin zaten yaptığı liste-gruplamasıyla AYNI desen, sunucunun
 * seri/toplam hesabının tekrarı DEĞİL.
 */
export async function gunAraligiToplamlari(
  _db: SQLiteDatabase,
  baslangicGun: string,
  bitisGun: string,
): Promise<Map<string, GunToplami>> {
  const kayitlar = await tumSayfalariGetir({ baslangic_gun: baslangicGun, bitis_gun: bitisGun });
  const harita = new Map<string, GunToplami>();
  for (const k of kayitlar) {
    const mevcut = harita.get(k.gun) ?? { gun: k.gun, toplamKurus: 0, kayitAdedi: 0 };
    harita.set(k.gun, { gun: k.gun, toplamKurus: mevcut.toplamKurus + k.tutar_kurus, kayitAdedi: mevcut.kayitAdedi + 1 });
  }
  return harita;
}

/* ---------------------------------------------------------- ayar (yerel) */

export async function ayarOku(db: SQLiteDatabase, anahtar: string): Promise<string | null> {
  const r = await db.getFirstAsync<{ deger: string }>(
    'SELECT deger FROM ayar WHERE anahtar = ?',
    anahtar,
  );
  return r?.deger ?? null;
}

export async function ayarYaz(db: SQLiteDatabase, anahtar: string, deger: string): Promise<void> {
  await db.runAsync('INSERT OR REPLACE INTO ayar (anahtar, deger) VALUES (?, ?)', anahtar, deger);
}

/**
 * Günlük limit — kuruş integer, tanımsızsa null (`HeroPlain` varyantı).
 * BE-6d (K-087): TEK otorite `kullanici_profilleri.gunluk_limit_kurus`
 * (`GET /kullanici/profil`) — `db/profil.ts#gunlukLimitKurusOku`ya devreder;
 * `db: SQLiteDatabase` parametresi yalnız dışa verilen imzayı (kayitlar ·
 * limitler · harcama-ekle · ozet · plan ekranlarını değiştirmemek için)
 * korur.
 */
export async function gunlukLimit(_db: SQLiteDatabase): Promise<number | null> {
  return gunlukLimitKurusOku();
}

/* ------------------------------------------------------------- harcama CRUD */

/** Tek kayıt — E-12 detay ekranı. Bulunamazsa `null` (`detay.bulunamadi.*`). */
export async function harcamaGetir(_db: SQLiteDatabase, id: string): Promise<Harcama | null> {
  try {
    return cevir(await harcamaGetirIstegi(id));
  } catch {
    return null;
  }
}

/**
 * Tek harcama yazma — tutar kuruş integer olarak gelir. Ürün→kategori
 * öğrenmesi ARTIK istemcide YAPILMIYOR — sunucu `urun_adi` verilince bunu
 * otomatik günceller (README `harcama` uç nokta tablosu).
 */
export async function harcamaEkle(
  _db: SQLiteDatabase,
  h: Omit<Harcama, 'id'>,
): Promise<string> {
  const yanit = await harcamaEkleIstegi({
    rutin_id: h.rutinId, adet: h.adet, sabit_gider_kodu: h.sabitGiderKodu, istemci_id: h.istemciId,
    tutar_kurus: Math.round(h.tutarKurus),
    kategori: h.kategori,
    urun_adi: h.urunAdi,
    zaman: h.zaman,
    gun: h.gun,
    odeme: h.odeme,
    not_metni: h.notMetni,
    taksit_id: h.taksitId,
    taksit_no: h.taksitNo,
    taksit_toplam: h.taksitToplam,
  });
  return yanit.id;
}

export type HarcamaGuncelleme = Partial<
  Pick<Harcama, 'tutarKurus' | 'kategori' | 'urunAdi' | 'odeme' | 'notMetni' | 'zaman' | 'gun'>
>;

/** E-12 "Kaydet" — yalnız verilen alanları günceller. Taksitli kayıtta `tutarKurus` gönderilirse sunucu 422 döner. */
export async function harcamaGuncelle(
  _db: SQLiteDatabase,
  id: string,
  degisiklik: HarcamaGuncelleme,
): Promise<void> {
  const govde: HarcamaGuncellemeGovdesi = {};
  if (degisiklik.tutarKurus !== undefined) govde.tutar_kurus = Math.round(degisiklik.tutarKurus);
  if (degisiklik.kategori !== undefined) govde.kategori = degisiklik.kategori;
  if (degisiklik.urunAdi !== undefined) govde.urun_adi = degisiklik.urunAdi;
  if (degisiklik.odeme !== undefined) govde.odeme = degisiklik.odeme;
  if (degisiklik.notMetni !== undefined) govde.not_metni = degisiklik.notMetni;
  if (degisiklik.zaman !== undefined) govde.zaman = degisiklik.zaman;
  if (degisiklik.gun !== undefined) govde.gun = degisiklik.gun;
  if (Object.keys(govde).length === 0) return;
  await harcamaGuncelleIstegi(id, govde);
}

/** K-029 — tek harcama silme: onaysız, anında. Geri alma çağıranın sorumluluğunda (6 sn toast).
 * Sunucuda yumuşak silme YOK: "geri al" basılırsa kayıt YENİDEN OLUŞTURULUR ve
 * YENİ bir id alır (bkz. `src/lib/harcamaEylemleri.ts`) — çağıran ekranlar eski
 * id'yi saklamıyor (detay ekranı hemen `router.back()` yapıyor, liste ekranları
 * `veriDegisti()` ile yeniden okuyor), bu yüzden id değişimi görünür bir soruna
 * yol açmıyor. */
export async function harcamaSil(_db: SQLiteDatabase, id: string): Promise<void> {
  await harcamaSilIstegi(id);
}

/** Aynı `taksitId`'ye sahip TÜM satırlar — E-12 taksit bilgi şeridi + E-13 özet satırı. */
export async function taksitSerisi(_db: SQLiteDatabase, taksitId: string): Promise<Harcama[]> {
  const kayitlar = await tumSayfalariGetir({});
  return kayitlar.filter((k) => k.taksit_id === taksitId).sort((a, b) => (a.taksit_no ?? 0) - (b.taksit_no ?? 0)).map(cevir);
}

/** E-13 — taksit serisini TAMAMEN siler (K-029: onaylıdır, geri alma yoktur). */
export async function taksitSerisiSil(_db: SQLiteDatabase, taksitId: string): Promise<void> {
  await taksitSerisiSilIstegi(taksitId);
}

type TaksitSerisiGirdi = {
  tutarKurusToplam: number;
  taksitSayisi: number;
  kategori: string;
  urunAdi: string | null;
  odeme: OdemeTipi;
  notMetni: string | null;
  ilkZaman: Date;
};

/**
 * K-023 taksit serisi — her ay için ayrı satır (E-18 "ay yükü" bunlardan
 * kurulur). Tutar kuruş-hassas dağıtılır: kalan kuruşlar İLK taksitlere
 * eklenir (12 × 833,33 gibi bölünemeyen tutarlarda kuruş kaybolmasın diye).
 *
 * Sunucuda "seri oluştur" ucu YOK (README) — istemci aynı `taksitId` ile
 * taksit sayısı kadar `POST /harcama/` çağırır. KISMİ BAŞARISIZLIK: bir
 * taksit yazılırken ağ koparsa, o ana kadar sunucuya yazılmış taksitler
 * `DELETE /harcama/taksit/{taksitId}` ile GERİ ALINIR ve hata yukarı
 * fırlatılır — kullanıcı yarım bir seriyle KALMAZ, `app/harcama-ekle.tsx`
 * mevcut `catch` bloğuyla "yazılamadı" hatasını gösterir ve baştan dener.
 */
export async function taksitSerisiOlustur(
  db: SQLiteDatabase,
  girdi: TaksitSerisiGirdi,
): Promise<{ taksitId: string; ilkId: string }> {
  const { tutarKurusToplam, taksitSayisi, kategori, urunAdi, odeme, notMetni, ilkZaman } = girdi;
  const taksitId = `t${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
  const taban = Math.floor(tutarKurusToplam / taksitSayisi);
  const kalan = tutarKurusToplam - taban * taksitSayisi;

  let ilkId = '';
  try {
    for (let i = 0; i < taksitSayisi; i += 1) {
      const tutar = taban + (i < kalan ? 1 : 0);
      const zaman = ayEkle(ilkZaman, i);
      const id = await harcamaEkle(db, {
        tutarKurus: tutar,
        kategori,
        urunAdi,
        zaman: zaman.toISOString(),
        gun: gunAnahtari(zaman),
        odeme,
        notMetni,
        taksitId,
        taksitNo: i + 1,
        taksitToplam: taksitSayisi,
      });
      if (i === 0) ilkId = id;
    }
  } catch (hata) {
    // Kısmi seri geride kalmasın — o ana kadar yazılanları geri al.
    try {
      await taksitSerisiSilIstegi(taksitId);
    } catch {
      // Geri alma da başarısız olursa (ör. ağ hâlâ kopuk) elimizden bir şey
      // gelmez — orijinal hata zaten yukarı fırlatılıyor, kullanıcı "Yeniden
      // dene" ile karşılaşır; bir sonraki başarılı denemede AYNI taksitId
      // kullanılmadığı için (her çağrıda yeni üretiliyor) çakışma olmaz.
    }
    throw hata;
  }
  return { taksitId, ilkId };
}

export type SikAlinan = {
  urunAdi: string;
  kategori: string;
  tutarKurus: number;
  sonZaman: string;
  sabitlenmis?: boolean;
};

/** Sunucudan taze çekilecek son kayıt sayısı — sık alınanlar/ürün arama için "yeterince geniş" bir pencere. */
const SIK_ALINAN_PENCERE = 200;

async function urunGecmisiPenceresi(): Promise<HarcamaYaniti[]> {
  return tumSayfalariGetir({ sayfa_boyutu: SIK_ALINAN_PENCERE }).then((kayitlar) => kayitlar.slice(0, SIK_ALINAN_PENCERE));
}

/**
 * E-11 "Sık alınanlar" — kullanıcının kendi geçmişinden gelir, tahminden
 * değil: her satır gerçekten yazılmış bir kayıttır (prototip notu).
 *
 * BE-6b notu: sunucuda bu dedup'ı yapan bir uç yok (README'de "arama
 * istemcide kalır" yalnız katalog için söylenmiş, kullanıcı geçmişi için
 * DEĞİL — burada gerçek bir sözleşme eksiği var, PM'e bildirildi). Geçici
 * çözüm: en yeni `SIK_ALINAN_PENCERE` (200) kayıt çekilir, ürün adına göre
 * son kullanım tarihiyle deduplike edilir. Kullanıcının 200 kayıt önce
 * kullandığı bir ürün bu pencereden düşebilir — tam geçmiş taraması sunucu
 * tarafında bir "distinct" uç noktası gerektirir.
 */
export async function sikAlinanlar(_db: SQLiteDatabase, limit = 3): Promise<SikAlinan[]> {
  const yanit = await istek<{kalemler: {ad:string;kategori:string;tutar_kurus:number;sabitlenmis:boolean}[]}>(`/butce/sik-kullanilanlar?bugun=${gunAnahtari(new Date())}`, {tokenGerekli:true});
  return yanit.kalemler.slice(0, limit).map(k => ({urunAdi:k.ad,kategori:k.kategori,tutarKurus:k.tutar_kurus,sonZaman:'',sabitlenmis:k.sabitlenmis}));
}

/**
 * Ürün adına göre kullanıcının KENDİ geçmişinde arama (E-11 arama sonuçları
 * · "Son kullandıkların" grubu). Türkçe normalizasyon iki tarafa da
 * uygulanır. Aynı pencere sınırı `sikAlinanlar`'daki gibi geçerlidir.
 */
export async function urunAra(_db: SQLiteDatabase, sorgu: string, limit = 20): Promise<SikAlinan[]> {
  const hepsi = await sikAlinanlar(_db, SIK_ALINAN_PENCERE);
  const anahtar = turkceNormalize(sorgu);
  return hepsi.filter((s) => turkceNormalize(s.urunAdi).includes(anahtar)).slice(0, limit);
}

/* --------------------------------------------------------- E-15 kategori */

/** Bir kategorinin bir aydaki TÜM kayıtları, en yeni önce (sunucu varsayılan sıralaması). */
export async function kategoriAyHarcamalari(
  _db: SQLiteDatabase,
  kategoriKodu: string,
  ay: string,
): Promise<Harcama[]> {
  const kayitlar = await tumSayfalariGetir({
    kategori: kategoriKodu,
    baslangic_gun: `${ay}-01`,
    bitis_gun: `${ay}-31`,
  });
  return kayitlar.map(cevir);
}

/** Bir kategorinin bir aydaki toplamı + kayıt adedi. */
export async function kategoriAyOzeti(
  _db: SQLiteDatabase,
  kategoriKodu: string,
  ay: string,
): Promise<AySpecifiOzeti> {
  const kayitlar = await tumSayfalariGetir({
    kategori: kategoriKodu,
    baslangic_gun: `${ay}-01`,
    bitis_gun: `${ay}-31`,
  });
  return { adet: kayitlar.length, toplamKurus: kayitlar.reduce((t, k) => t + k.tutar_kurus, 0) };
}

/* -------------------------------------------------------- E-18 taksitler */

export type TaksitAySatiri = { ay: string; toplamKurus: number };

/** Bugünden başlayarak `aySayisiler` ayının taksit toplamı (§7.12 `LoadBar`). */
export async function taksitAylikYuk(_db: SQLiteDatabase, aySayisiler: string[]): Promise<TaksitAySatiri[]> {
  if (aySayisiler.length === 0) return [];
  const ilkAy = [...aySayisiler].sort()[0];
  const sonAy = [...aySayisiler].sort().at(-1) as string;
  const kayitlar = await tumSayfalariGetir({ baslangic_gun: `${ilkAy}-01`, bitis_gun: `${sonAy}-31` });
  const eslesme = new Map<string, number>();
  for (const k of kayitlar) {
    if (!k.taksit_id) continue;
    const ay = k.gun.slice(0, 7);
    eslesme.set(ay, (eslesme.get(ay) ?? 0) + k.tutar_kurus);
  }
  return aySayisiler.map((ay) => ({ ay, toplamKurus: eslesme.get(ay) ?? 0 }));
}

/** Bu ayın taksit toplamı (E-18 kahraman kartı). */
export async function taksitBuAyToplam(_db: SQLiteDatabase, buAy: string): Promise<number> {
  const kayitlar = await tumSayfalariGetir({ baslangic_gun: `${buAy}-01`, bitis_gun: `${buAy}-31` });
  return kayitlar.filter((k) => k.taksit_id).reduce((t, k) => t + k.tutar_kurus, 0);
}

/**
 * Bu ay HARİÇ kalan TÜM taksit yükü — "Kalan toplam" (6 aylık pencereyle
 * sınırlı değil). K-T7: `kalan` tanımı gereği bu aydan SONRASIdır; bu ayki
 * tutar satırda ve ay toplamında zaten var, ikinci kez sayılmaz
 * (rev3-taksitler.md §5). `buAyBaslangicGunu` yalnız sorgu penceresini
 * daraltır, dışlama ay anahtarı karşılaştırmasıyla yapılır.
 */
export async function taksitKalanToplamKurus(_db: SQLiteDatabase, buAyBaslangicGunu: string): Promise<number> {
  const buAy = buAyBaslangicGunu.slice(0, 7);
  const kayitlar = await tumSayfalariGetir({ baslangic_gun: buAyBaslangicGunu });
  return kayitlar
    .filter((k) => k.taksit_id && k.gun.slice(0, 7) > buAy)
    .reduce((t, k) => t + k.tutar_kurus, 0);
}

/** En geç biten serinin son ay anahtarı ("2027-05") — yoksa null. */
export async function taksitSonAy(_db: SQLiteDatabase, buAyBaslangicGunu: string): Promise<string | null> {
  const kayitlar = await tumSayfalariGetir({ baslangic_gun: buAyBaslangicGunu });
  const gunler = kayitlar.filter((k) => k.taksit_id).map((k) => k.gun);
  if (gunler.length === 0) return null;
  return gunler.reduce((a, b) => (b > a ? b : a)).slice(0, 7);
}

export type SurenSeri = {
  /** BU AYKİ harcama kaydının id'si — satır dokunuşu E-12'ye bunu açar. */
  id: string;
  taksitId: string;
  kategori: string;
  /** rev3-taksitler.md §5 — Ü-5 `urun_adi`; boşsa `null` (satır `taksit.urun_yok` yedeğini kullanır). */
  urunAdi: string | null;
  taksitNo: number;
  taksitToplam: number;
  tutarKurus: number;
  /** "2027-05" — serinin son taksidinin ay anahtarı */
  sonAy: string;
  /** rev3-taksitler.md §5/K-T7 — bu ay HARİÇ, serinin kalan taksitlerinin kuruş toplamı. */
  kalanKurus: number;
};

/**
 * Bu ayda ödemesi düşen (hâlâ süren) taksit serileri — E-18 kategori/ürün
 * kırılımı (rev3-taksitler.md). `urunAdi` ve `kalanKurus` YENİ bir alan/uç
 * DEĞİL: `tumSayfalariGetir({})` zaten çektiği tam geçmişten türetilir.
 */
export async function surenSeriler(_db: SQLiteDatabase, buAy: string): Promise<SurenSeri[]> {
  const buAyKayitlari = (await tumSayfalariGetir({ baslangic_gun: `${buAy}-01`, bitis_gun: `${buAy}-31` })).filter(
    (k) => k.taksit_id,
  );
  if (buAyKayitlari.length === 0) return [];
  // Serinin son ayını ve bu ay sonrası kalan tutarını bulmak için
  // taksit_id başına TÜM geçmiş gerekir.
  const tumKayitlar = await tumSayfalariGetir({});
  const sonGunEslesme = new Map<string, string>();
  const kalanKurusEslesme = new Map<string, number>();
  for (const k of tumKayitlar) {
    if (!k.taksit_id) continue;
    const mevcutSonGun = sonGunEslesme.get(k.taksit_id);
    if (!mevcutSonGun || k.gun > mevcutSonGun) sonGunEslesme.set(k.taksit_id, k.gun);
    if (k.gun.slice(0, 7) > buAy) {
      kalanKurusEslesme.set(k.taksit_id, (kalanKurusEslesme.get(k.taksit_id) ?? 0) + k.tutar_kurus);
    }
  }
  return [...buAyKayitlari]
    .sort((a, b) => b.tutar_kurus - a.tutar_kurus)
    .map((k) => ({
      id: k.id,
      taksitId: k.taksit_id as string,
      kategori: k.kategori,
      urunAdi: k.urun_adi,
      taksitNo: k.taksit_no as number,
      taksitToplam: k.taksit_toplam as number,
      tutarKurus: k.tutar_kurus,
      sonAy: (sonGunEslesme.get(k.taksit_id as string) ?? `${buAy}-01`).slice(0, 7),
      kalanKurus: kalanKurusEslesme.get(k.taksit_id as string) ?? 0,
    }));
}

/** Geçen ay biten (bu ay artık görünmeyen) tek bir seri — "seri bitti" bilgi şeridi. */
export async function gecenAyBitenSeri(
  _db: SQLiteDatabase,
  gecenAy: string,
): Promise<{ kategori: string; urunAdi: string | null; tutarKurus: number } | null> {
  const kayitlar = await tumSayfalariGetir({ baslangic_gun: `${gecenAy}-01`, bitis_gun: `${gecenAy}-31` });
  const biten = kayitlar.find((k) => k.taksit_id && k.taksit_no === k.taksit_toplam);
  return biten ? { kategori: biten.kategori, urunAdi: biten.urun_adi, tutarKurus: biten.tutar_kurus } : null;
}
