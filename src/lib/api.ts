/**
 * D-2c-2 — API istemcisi. Taban URL Expo'nun yerleşik `EXPO_PUBLIC_*`
 * ortam değişkeni desteğiyle gelir (SDK'ya dahil, YENİ BAĞIMLILIK DEĞİL);
 * `.env` yoksa yerel geliştirme adresine düşer.
 *
 * Sözleşmenin kaynağı: `backend/README.md` "Uç noktalar"
 * tablosu + `app/modules/auth/auth_dto.py` (alan adları BİREBİR) +
 * `app/core/errors.py` (durum kodu ↔ `hata_kodu` eşlemesi). Backend hata
 * gövdesi yalnız log/yedek amaçlıdır (`app/core/errors.py` yorumu) — bu
 * yüzden ekranlar `mesaj` alanını GÖSTERMEZ, `durum`/`hataKodu`na göre
 * kendi `metinler.md` cümlesini seçer (RN inşa notu 7).
 *
 * Erişim token'ı süresi dolunca (401, `tokenGerekli` istek) `token/yenile`
 * ile TEK SEFERLİK otomatik tekrar dener; o da başarısızsa oturum silinir
 * ve orijinal 401 hatası fırlatılır.
 */
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { apiAdresiniCoz } from '@/lib/apiAdres';
import { oturumErisimTokeniGuncelle, oturumOku, oturumGecersizKil } from '@/lib/oturumDeposu';

const TEMEL_URL = apiAdresiniCoz(process.env.EXPO_PUBLIC_API_URL, __DEV__ ? Constants.expoConfig?.hostUri : undefined, Platform.OS);
export const GELISTIRME_GIRISI = __DEV__ && process.env.EXPO_PUBLIC_DEV_LOGIN === '1';
const ZAMAN_ASIMI_MS = 10000;

export class ApiHatasi extends Error {
  readonly durum: number;
  readonly hataKodu: string;

  constructor(durum: number, hataKodu: string, mesaj: string) {
    super(mesaj);
    this.durum = durum;
    this.hataKodu = hataKodu;
  }
}

/** Sunucuya ulaşılamadı / zaman aşımı — ekran kendi "ağ şeridi" metnini gösterir. */
export class ApiAgHatasi extends Error {}

type Yontem = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type IstekSecenekleri = {
  yontem?: Yontem;
  govde?: unknown;
  /** `Authorization: Bearer <erişim token>` gerektiren uçlar (`/auth/ben`, `/auth/hesap`). */
  tokenGerekli?: boolean;
  erisimTokeni?: string;
};

export async function istek<T>(yol: string, secenekler: IstekSecenekleri = {}, tekrarDenendi = false): Promise<T> {
  const { yontem = 'GET', govde, tokenGerekli = false } = secenekler;
  const oturum = tokenGerekli ? await oturumOku() : null;
  if (tokenGerekli && !oturum) throw new ApiHatasi(401, 'OTURUM_YOK', 'Oturum açmalısın.');
  const denetimci = new AbortController();
  const zamanAsimi = setTimeout(() => denetimci.abort(), ZAMAN_ASIMI_MS);

  let yanit: Response;
  try {
    yanit = await fetch(`${TEMEL_URL}${yol}`, {
      method: yontem,
      headers: {
        'Content-Type': 'application/json',
        ...(secenekler.erisimTokeni || oturum ? { Authorization: `Bearer ${secenekler.erisimTokeni ?? oturum?.erisimTokeni}` } : {}),
      },
      body: govde !== undefined ? JSON.stringify(govde) : undefined,
      signal: denetimci.signal,
    });
  } catch {
    throw new ApiAgHatasi('Sunucuya ulaşılamadı.');
  } finally {
    clearTimeout(zamanAsimi);
  }

  if (oturum && (await oturumOku())?.oturumKimligi !== oturum.oturumKimligi) {
    throw new ApiHatasi(401, 'OTURUM_DEGISTI', 'Oturum değişti.');
  }

  if (yanit.status === 401 && oturum) {
    if (!tekrarDenendi && ((await oturumOku())?.yenilemeTokeni !== oturum.yenilemeTokeni || await tokenYenileDene(oturum.yenilemeTokeni))) return istek<T>(yol, secenekler, true);
    await oturumGecersizKil(oturum.yenilemeTokeni);
  }

  if (yanit.status === 204) return undefined as T;

  if (!yanit.ok) {
    let hataKodu = 'bilinmeyen';
    let mesaj = 'Bir şey ters gitti. Yeniden dene.';
    try {
      const ayrisik = (await yanit.json()) as { hata_kodu?: string; mesaj?: string };
      hataKodu = ayrisik.hata_kodu ?? hataKodu;
      mesaj = ayrisik.mesaj ?? mesaj;
    } catch {
      // gövde JSON değilse (ör. 5xx HTML sayfası) varsayılan mesaj kalır.
    }
    throw new ApiHatasi(yanit.status, hataKodu, mesaj);
  }

  return (await yanit.json()) as T;
}

const yenilemeler = new Map<string, Promise<boolean>>();

function tokenYenileDene(yenilemeTokeni: string): Promise<boolean> {
  const mevcut = yenilemeler.get(yenilemeTokeni);
  if (mevcut) return mevcut;
  const islem = tokenYenile(yenilemeTokeni).finally(() => yenilemeler.delete(yenilemeTokeni));
  yenilemeler.set(yenilemeTokeni, islem);
  return islem;
}

async function tokenYenile(yenilemeTokeni: string): Promise<boolean> {
  const oturum = await oturumOku();
  if (!oturum || oturum.yenilemeTokeni !== yenilemeTokeni) return false;
  try {
    const yeni = await istek<{ erisim_tokeni: string; yenileme_tokeni: string }>('/auth/token/yenile', {
      yontem: 'POST',
      govde: { yenileme_tokeni: oturum.yenilemeTokeni },
    });
    await oturumErisimTokeniGuncelle(yeni.erisim_tokeni, yenilemeTokeni, yeni.yenileme_tokeni);
    return true;
  } catch (hata) {
    if (hata instanceof ApiHatasi && (hata.durum === 401 || hata.durum === 403)) return false;
    throw hata; // Bağlantı/5xx hatası oturumu geçersiz kılmaz.
  }
}

/* --------------------------------------------------- §"auth" uç noktaları */

export type TokenCifti = { erisimTokeni: string; yenilemeTokeni: string };

/** `POST /auth/kayit` — 201, doğrudan oturum açtırır. 409 → e-posta kayıtlı. */
export async function kayitOl(email: string, sifre: string): Promise<TokenCifti> {
  const yanit = await istek<{ erisim_tokeni: string; yenileme_tokeni: string }>('/auth/kayit', {
    yontem: 'POST',
    govde: { email, sifre },
  });
  return { erisimTokeni: yanit.erisim_tokeni, yenilemeTokeni: yanit.yenileme_tokeni };
}

/** `POST /auth/giris` — 401 → kimlik hatası (e-posta/şifre ayrımı sızdırılmaz). */
export async function girisYap(email: string, sifre: string, demo = false): Promise<TokenCifti> {
  const yanit = await istek<{ erisim_tokeni: string; yenileme_tokeni: string }>(demo && GELISTIRME_GIRISI ? '/auth/gelistirme-giris' : '/auth/giris', {
    yontem: 'POST',
    govde: { email, sifre },
  });
  return { erisimTokeni: yanit.erisim_tokeni, yenilemeTokeni: yanit.yenileme_tokeni };
}

export type KullaniciBilgisi = { id: string; email: string; kimlikSaglayici: string };

/** `GET /auth/ben` — Ayarlar E-19 hesap satırının gerçek e-posta/sağlayıcı kaynağı. */
export async function benKimim(erisimTokeni?: string): Promise<KullaniciBilgisi> {
  const yanit = await istek<{ id: string; email: string; kimlik_saglayici: string }>('/auth/ben', {
    tokenGerekli: !erisimTokeni,
    erisimTokeni,
  });
  return { id: yanit.id, email: yanit.email, kimlikSaglayici: yanit.kimlik_saglayici };
}

/** `POST /auth/cikis` — 204, yenileme token'ını iptal eder. */
export async function oturumKapatIstegi(yenilemeTokeni: string): Promise<void> {
  await istek('/auth/cikis', { yontem: 'POST', govde: { yenileme_tokeni: yenilemeTokeni } });
}

/** `DELETE /auth/hesap` — 204, geri alınamaz (App Store 5.1.1(v)). */
export async function hesapSilIstegi(): Promise<void> {
  await istek('/auth/hesap', { yontem: 'DELETE', tokenGerekli: true });
}

/* ---------------------------------------------- §"kullanici" uç noktaları
 * Alan adları backend'in `kullanici_dto.py`sıyle BİREBİR (snake_case, tel
 * gövdesi) — istemci tarafı camelCase eşlemesi `src/db/profil.ts` ve
 * `src/db/ayarTercihleri.ts`'te yapılır, bu dosya yalnız telin biçimini taşır.
 */

export type AliskanlikYaniti = { siklik: string | null; serbest_sayi: number | null; fiyat_kurus: number | null };

export type AliskanlikGirdisi = { siklik: string | null; serbest_sayi: number | null; fiyat_kurus: number | null };

export type KullaniciProfilYaniti = {
  niyet: 'takip' | 'tasarruf' | 'borc' | null;
  gelir_kurus: number | null;
  maas_gunu: number | null;
  maas_duzensiz: boolean;
  onboarding_tamamlandi: boolean;
  kira_aidat_kurus: number | null;
  faturalar_kurus: number | null;
  ulasim_yakit_kurus: number | null;
  kredi_taksit_kurus: number | null;
  kahve: AliskanlikYaniti;
  sigara: AliskanlikYaniti;
  alkol: AliskanlikYaniti;
  yemek: AliskanlikYaniti;
  abonelik_adet: number | null;
  abonelik_ortalama_kurus: number | null;
  yatirim_niyet: 'yapiyorum' | 'dusunuyorum' | 'ilgilenmiyorum' | null;
  birikim_yuzde: number | null;
  taksit_siklik: 'sik_sik' | 'bazen' | 'nadiren' | null;
  plan_kuruldu: boolean;
  zorunlu_kurus: number | null;
  zorunlu_pay_yuzde: number | null;
  sosyal_kurus: number | null;
  sosyal_pay_yuzde: number | null;
  birikim_kurus: number | null;
  birikim_pay_yuzde: number | null;
  gunluk_limit_kurus: number | null;
  plan_kurulum_tarihi: string | null;
  katman2_dolan_kart_sayisi: number;
  gunluk_limit_onerisi_kurus: number | null;
  son_kart: number;
};

export type Katman1IstegiGovdesi = {
  niyet: 'takip' | 'tasarruf' | 'borc' | null;
  gelir_kurus: number | null;
  maas_gunu: number | null;
  maas_duzensiz: boolean;
  gunluk_limit_onerisi_kurus: number | null;
};

/** E-25'in kısmi güncellemesi — yalnız GERÇEKTEN gönderilen alan içerilmeli (`Partial`). */
export type Katman2IstegiGovdesi = Partial<{
  kira_aidat_kurus: number | null;
  faturalar_kurus: number | null;
  ulasim_yakit_kurus: number | null;
  kredi_taksit_kurus: number | null;
  kahve: AliskanlikGirdisi;
  sigara: AliskanlikGirdisi;
  alkol: AliskanlikGirdisi;
  yemek: AliskanlikGirdisi;
  abonelik_adet: number | null;
  abonelik_ortalama_kurus: number | null;
  yatirim_niyet: 'yapiyorum' | 'dusunuyorum' | 'ilgilenmiyorum' | null;
  birikim_yuzde: number | null;
  taksit_siklik: 'sik_sik' | 'bazen' | 'nadiren' | null;
  son_kart: number;
}>;

/** `GET /kullanici/profil` — hiç veri girilmemişse varsayılan (boş) profil döner. */
export async function kullaniciProfiliGetir(): Promise<KullaniciProfilYaniti> {
  return istek<KullaniciProfilYaniti>('/kullanici/profil', { tokenGerekli: true });
}

/** `PUT /kullanici/profil/katman1` — E-01..E-03, onboarding'i tamamlanmış işaretler. */
export async function katman1Kaydet(govde: Katman1IstegiGovdesi): Promise<KullaniciProfilYaniti> {
  return istek<KullaniciProfilYaniti>('/kullanici/profil/katman1', { yontem: 'PUT', govde, tokenGerekli: true });
}

/** `PATCH /kullanici/profil/katman2` — E-25'in 8 kartı, kısmi güncelleme. */
export async function katman2Kaydet(govde: Katman2IstegiGovdesi): Promise<KullaniciProfilYaniti> {
  return istek<KullaniciProfilYaniti>('/kullanici/profil/katman2', { yontem: 'PATCH', govde, tokenGerekli: true });
}

/**
 * `POST /kullanici/plan/kur` — sunucu mevcut Katman 1/2 verisinden hesaplar
 * (K-075); gövde boştur, `bugun` SORGU parametresidir (README "Uç noktalar"
 * tablosu). `bugun` HER ZAMAN gönderilir — istemcinin gün sınırı tercihine
 * göre hesapladığı YEREL gün (`gunAnahtari`); yoksa sunucu UTC gününe düşer
 * ve 00:00–03:00 arası kurulan plan yanlış güne sayılabilir (K-089 BLOCKER 1
 * düzeltmesi, K-087 ile aynı desen).
 */
export async function planiKurIstegi(bugun: string): Promise<KullaniciProfilYaniti> {
  return istek<KullaniciProfilYaniti>(`/kullanici/plan/kur${sorguDizesi({ bugun })}`, {
    yontem: 'POST',
    tokenGerekli: true,
  });
}

/**
 * `PUT /kullanici/plan/gunluk-limit` — E-17 elle yazma; bekleyen öneriyi de
 * temizler. Gövde yalnız `gunluk_limit_kurus` içerir; `bugun` SORGU
 * parametresidir (README "Uç noktalar" tablosu) — bu uç `limit_gecmisi`ni de
 * yazar (K-085 Madde 6); yanlış güne düşen satır geçmiş seriyi yanlış
 * hesaplatır (K-064) — aynı desen K-087/K-089. `bugun` HER ZAMAN gönderilir.
 */
export async function gunlukLimitiAyarlaIstegi(gunlukLimitKurus: number, bugun: string): Promise<KullaniciProfilYaniti> {
  return istek<KullaniciProfilYaniti>(`/kullanici/plan/gunluk-limit${sorguDizesi({ bugun })}`, {
    yontem: 'PUT',
    govde: { gunluk_limit_kurus: gunlukLimitKurus },
    tokenGerekli: true,
  });
}

/** `DELETE /kullanici/plan/gunluk-limit-onerisi` — "Limitsiz devam et". */
export async function gunlukLimitOnerisiniReddetIstegi(): Promise<KullaniciProfilYaniti> {
  return istek<KullaniciProfilYaniti>('/kullanici/plan/gunluk-limit-onerisi', { yontem: 'DELETE', tokenGerekli: true });
}

export type TercihlerYaniti = {
  bildirim_aksam_ozet: boolean;
  bildirim_tercih_belirlendi: boolean;
  bildirim_saati: string;
  gun_siniri: 0 | 3 | 6;
  varsayilan_odeme: 'nakit' | 'kart';
  kurulum_gunu: string | null;
};

export type TercihlerGuncellemeGovdesi = Partial<{
  bildirim_aksam_ozet: boolean;
  bildirim_saati: string;
  gun_siniri: 0 | 3 | 6;
  varsayilan_odeme: 'nakit' | 'kart';
  kurulum_gunu: string;
}>;

/** `GET /kullanici/tercihler` — E-19 Ayarlar tercihleri. */
export async function tercihleriGetir(): Promise<TercihlerYaniti> {
  return istek<TercihlerYaniti>('/kullanici/tercihler', { tokenGerekli: true });
}

/** `PATCH /kullanici/tercihler` — yalnız gönderilen alan güncellenir. */
export async function tercihleriGuncelle(govde: TercihlerGuncellemeGovdesi): Promise<TercihlerYaniti> {
  return istek<TercihlerYaniti>('/kullanici/tercihler', { yontem: 'PATCH', govde, tokenGerekli: true });
}

/* ------------------------------------------------- §"harcama" uç noktaları
 * Alan adları backend'in `harcama_dto.py`sıyle BİREBİR (BE-6b). `id` Mongo
 * ObjectId'nin STRING hâlidir — `auth`/`kullanici` modüllerindeki kimliklerle
 * aynı desen, SAYISAL DEĞİLDİR (istemcideki eski SQLite INTEGER PRIMARY KEY
 * varsayımı geçersiz — bkz. `src/db/harcama.ts` başı).
 */

export type OdemeTipiGovde = 'nakit' | 'kart';

export type HarcamaYaniti = {
  rutin_id?: string | null;
  adet?: number;
  sabit_gider_kodu?: 'kira' | 'fatura' | 'ulasim' | 'kredi' | null;
  id: string;
  tutar_kurus: number;
  kategori: string;
  urun_adi: string | null;
  zaman: string;
  gun: string;
  odeme: OdemeTipiGovde;
  not_metni: string | null;
  taksit_id: string | null;
  taksit_no: number | null;
  taksit_toplam: number | null;
};

export type HarcamaEkleGovdesi = {
  istemci_id?: string;
  rutin_id?: string | null;
  adet?: number;
  sabit_gider_kodu?: 'kira' | 'fatura' | 'ulasim' | 'kredi' | null;
  tutar_kurus: number;
  kategori: string;
  urun_adi: string | null;
  zaman: string;
  gun: string;
  odeme: OdemeTipiGovde;
  not_metni: string | null;
  taksit_id: string | null;
  taksit_no: number | null;
  taksit_toplam: number | null;
};

export type HarcamaGuncellemeGovdesi = Partial<{
  rutin_id?: string | null;
  adet?: number;
  sabit_gider_kodu?: 'kira' | 'fatura' | 'ulasim' | 'kredi' | null;
  tutar_kurus: number;
  kategori: string;
  urun_adi: string | null;
  zaman: string;
  gun: string;
  odeme: OdemeTipiGovde;
  not_metni: string | null;
}>;

export type HarcamaListesiYaniti = {
  kayitlar: HarcamaYaniti[];
  toplam_kayit: number;
  sayfa: number;
  sayfa_boyutu: number;
};

export type HarcamaListeSuzgeci = Partial<{
  gun: string;
  baslangic_gun: string;
  bitis_gun: string;
  kategori: string;
  sayfa: number;
  sayfa_boyutu: number;
}>;

function sorguDizesi(parametreler: Record<string, string | number | undefined>): string {
  const parcalar = Object.entries(parametreler)
    .filter(([, deger]) => deger !== undefined)
    .map(([anahtar, deger]) => `${anahtar}=${encodeURIComponent(String(deger))}`);
  return parcalar.length > 0 ? `?${parcalar.join('&')}` : '';
}

/** `POST /harcama/` — 201; ürün adı verilmişse sunucu ürün→kategori öğrenmesini de günceller. */
export async function harcamaEkleIstegi(govde: HarcamaEkleGovdesi): Promise<HarcamaYaniti> {
  return istek<HarcamaYaniti>('/harcama/', { yontem: 'POST', govde, tokenGerekli: true });
}

/** `GET /harcama/` — `gun` / `baslangic_gun`+`bitis_gun` / `kategori` süzgeciyle sayfalanmış listeleme (`sayfa_boyutu` ≤ 200). */
export async function harcamalariListeleIstegi(suzgec: HarcamaListeSuzgeci = {}): Promise<HarcamaListesiYaniti> {
  return istek<HarcamaListesiYaniti>(`/harcama/${sorguDizesi(suzgec)}`, { tokenGerekli: true });
}

/** `GET /harcama/{id}` — tek kayıt. */
export async function harcamaGetirIstegi(id: string): Promise<HarcamaYaniti> {
  return istek<HarcamaYaniti>(`/harcama/${id}`, { tokenGerekli: true });
}

/** `PATCH /harcama/{id}` — yalnız gönderilen alanlar; taksitli kayıtta `tutar_kurus` → 422. */
export async function harcamaGuncelleIstegi(id: string, govde: HarcamaGuncellemeGovdesi): Promise<HarcamaYaniti> {
  return istek<HarcamaYaniti>(`/harcama/${id}`, { yontem: 'PATCH', govde, tokenGerekli: true });
}

/** `DELETE /harcama/{id}` — 204, kalıcı; taksitli kayıtta → 422 (çağıran taksit serisini kullanmalı). */
export async function harcamaSilIstegi(id: string): Promise<void> {
  await istek(`/harcama/${id}`, { yontem: 'DELETE', tokenGerekli: true });
}

/** `DELETE /harcama/taksit/{taksit_id}` — 204, seriyi TAMAMEN siler. */
export async function taksitSerisiSilIstegi(taksitId: string): Promise<void> {
  await istek(`/harcama/taksit/${taksitId}`, { yontem: 'DELETE', tokenGerekli: true });
}

export type KategoriLimitiYaniti = { kategori: string; limit_kurus: number; sira: number };

/** `GET /harcama/ayar/kategori-limitleri` — yalnız değeri olanlar, `sira`ya göre. */
export async function kategoriLimitleriGetirIstegi(): Promise<KategoriLimitiYaniti[]> {
  return istek<KategoriLimitiYaniti[]>('/harcama/ayar/kategori-limitleri', { tokenGerekli: true });
}

/** `PUT /harcama/ayar/kategori-limitleri` — yaz/güncelle. */
export async function kategoriLimitiYazIstegi(
  kategori: string,
  limitKurus: number,
  sira: number,
): Promise<KategoriLimitiYaniti> {
  return istek<KategoriLimitiYaniti>('/harcama/ayar/kategori-limitleri', {
    yontem: 'PUT',
    govde: { kategori, limit_kurus: limitKurus, sira },
    tokenGerekli: true,
  });
}

/** `DELETE /harcama/ayar/kategori-limitleri/{kategori}` — K-085 Madde 2, 204, idempotent. */
export async function kategoriLimitiSilIstegi(kategori: string): Promise<void> {
  await istek(`/harcama/ayar/kategori-limitleri/${encodeURIComponent(kategori)}`, {
    yontem: 'DELETE',
    tokenGerekli: true,
  });
}

export type LimitGecmisiYaniti = { yururluk_tarihi: string; kurus: number };

/** `POST /harcama/ayar/limit-gecmisi` — K-064/1, günlük limit değiştiğinde yürürlük tarihiyle bir satır yazar. */
export async function limitGecmisiYazIstegi(yururlukTarihi: string, kurus: number): Promise<LimitGecmisiYaniti> {
  return istek<LimitGecmisiYaniti>('/harcama/ayar/limit-gecmisi', {
    yontem: 'POST',
    govde: { yururluk_tarihi: yururlukTarihi, kurus },
    tokenGerekli: true,
  });
}

export type UrunKategoriOgrenmeYaniti = { urun_anahtari: string; kategori: string };

/** `GET /harcama/ayar/urun-kategori-ogrenme` — tüm öğrenilmiş ürün→kategori eşlemeleri. */
export async function urunKategoriOgrenmeleriGetirIstegi(): Promise<UrunKategoriOgrenmeYaniti[]> {
  return istek<UrunKategoriOgrenmeYaniti[]>('/harcama/ayar/urun-kategori-ogrenme', { tokenGerekli: true });
}

/** `PUT /harcama/ayar/urun-kategori-ogrenme` — bir ürün adı için kategoriyi elle öğretir/düzeltir. */
export async function urunKategoriOgrenIstegi(urunAdi: string, kategori: string): Promise<UrunKategoriOgrenmeYaniti> {
  return istek<UrunKategoriOgrenmeYaniti>('/harcama/ayar/urun-kategori-ogrenme', {
    yontem: 'PUT',
    govde: { urun_adi: urunAdi, kategori },
    tokenGerekli: true,
  });
}

export type GunDurumuYaniti = { gun: string; harcamasiz: boolean };

/** `PUT /harcama/gun-durumu` — K-048 hile kapısı (b): bir günü "harcamasız" işaretler/kaldırır (BE-6c). */
export async function gunDurumuYazIstegi(gun: string, harcamasiz = true): Promise<GunDurumuYaniti> {
  return istek<GunDurumuYaniti>('/harcama/gun-durumu', {
    yontem: 'PUT',
    govde: { gun, harcamasiz },
    tokenGerekli: true,
  });
}

export type EnEskiKayitGunuYaniti = { gun: string | null };

/** `GET /harcama/ayar/en-eski-kayit-gunu` — K-085 Madde 4: istemcinin seri sınırı hesabı için. */
export async function enEskiKayitGunuGetirIstegi(): Promise<EnEskiKayitGunuYaniti> {
  return istek<EnEskiKayitGunuYaniti>('/harcama/ayar/en-eski-kayit-gunu', { tokenGerekli: true });
}

/** `DELETE /harcama/ayar/tum-veriler` — K-085 Madde 3: "Tüm verileri sil" (204); hesabı/profili SİLMEZ. */
export async function tumVerileriSilIstegi(): Promise<void> {
  await istek('/harcama/ayar/tum-veriler', { yontem: 'DELETE', tokenGerekli: true });
}

/* ----------------------------------------------------------- §"ozet" uç noktaları
 * Alan adları `backend/app/modules/ozet/ozet_dto.py` ile BİREBİR — bu modülün
 * kendi Mongo koleksiyonu yok (K-076/BE-5), yalnız `harcama`/`kullanici`yi
 * okur. Toplama/seri hesabı TAMAMEN burada, sunucuda yapılır (K-068) —
 * istemci bir daha kayıt çekip kendi toplamaz (bkz. `src/db/seri.ts` başı).
 */

export type OzetPanoKategoriYaniti = { kategori: string; limit_kurus: number; harcanan_kurus: number; bugun_kurus: number };
export type OzetGunSeriBilgisiYaniti = {
  harcanan_kurus: number;
  kayit_adedi: number;
  harcamasiz_isaretli: boolean;
  seriye_sayildi_mi: boolean | null;
};
export type OzetLimitDurumu = 'altinda' | 'asimda' | 'tanimsiz';

export type OzetPanoYaniti = {
  gun: string;
  niyet: string;
  limit_kurus: number | null;
  harcanan_kurus: number;
  kayit_adedi: number;
  limit_durumu: OzetLimitDurumu;
  kategoriler: OzetPanoKategoriYaniti[];
  ay_asimi: number;
  seri: OzetGunSeriBilgisiYaniti;
  ilk_gun_mu: boolean;
};

/** `GET /ozet/pano` — E-10: seçilen günün (verilmezse bugünün) toplam/limit/kategori/seri durumu. */
export async function ozetPanoGetir(gun?: string): Promise<OzetPanoYaniti> {
  return istek<OzetPanoYaniti>(`/ozet/pano${sorguDizesi({ gun })}`, { tokenGerekli: true });
}

export type OzetKategoriPayiYaniti = { kategori: string; toplam_kurus: number; yuzde: number };
export type OzetKucukHarcamaYaniti = { esik_kurus: number; adet: number; toplam_kurus: number };

export type OzetDonemYaniti = {
  baslangic_gun: string;
  bitis_gun: string;
  toplam_kurus: number;
  kategori_dagilimi: OzetKategoriPayiYaniti[];
  en_cok_harcanan_kategoriler: string[];
  kucuk_harcama: OzetKucukHarcamaYaniti;
};

/** `GET /ozet/donem` — E-16: dönem toplamı, kategori dağılımı (₺+%), Latte Faktörü. */
export async function ozetDonemGetir(baslangicGun: string, bitisGun: string, esikKurus?: number): Promise<OzetDonemYaniti> {
  return istek<OzetDonemYaniti>(
    `/ozet/donem${sorguDizesi({ baslangic_gun: baslangicGun, bitis_gun: bitisGun, esik_kurus: esikKurus })}`,
    { tokenGerekli: true },
  );
}

export type OzetIzgaraDurumu = 'altinda' | 'disinda' | 'bos';
export type OzetGunIzgaraHucresiYaniti = { gun: string; durum: OzetIzgaraDurumu };

export type OzetSeriYaniti = {
  mevcut_seri: number;
  en_uzun_seri: number;
  en_uzun_seri_bitis_gunu: string | null;
  kapali: boolean;
  kirildi_mi: boolean;
  sonraki_durak: number | null;
  onceki_durak: number;
  kalan_gun: number | null;
  aralik_yuzde: number;
  gecilen_milestoneler: number[];
  izgara: OzetGunIzgaraHucresiYaniti[];
};

/**
 * `GET /ozet/seri` — E-21 (K-048+K-064/1+K-087): mevcut/en uzun seri, son 30
 * günün ızgarası, milestone durumu. `bugun` HER ZAMAN gönderilir — istemcinin
 * gün sınırı tercihine göre hesapladığı YEREL gün (`gunAnahtari`); yoksa
 * sunucu UTC gününe düşer ve 00:00–03:00 arası eklenen harcama yanlış güne
 * sayılabilir (K-087 düzeltmesi).
 */
export async function ozetSeriGetir(bugun: string): Promise<OzetSeriYaniti> {
  return istek<OzetSeriYaniti>(`/ozet/seri${sorguDizesi({ bugun })}`, { tokenGerekli: true });
}

/* --------------------------------------------------------- §"katalog" uç noktaları
 * `harcama`/`kullanici` gibi oturum ister ama yanıt HTTP `ETag`/304 ile
 * önbelleklenir — `istek()`in "JSON gövde bekle" sözleşmesi 304'ü (gövdesiz)
 * hataya düşürür, bu yüzden burada AYRI, ETag'e duyarlı bir istemci var.
 * 401→tek seferlik token yenileme aynı `tokenYenileDene`yi (bu dosyanın
 * üstünde tanımlı, modül-özel) paylaşır.
 */

export type KatalogOgesiYaniti = { kod: string; ad: string; kategori: string };
export type KatalogListesiYaniti = { ogeler: KatalogOgesiYaniti[]; surum: string };
export type KatalogSonucu = { degisti: true; katalog: KatalogListesiYaniti } | { degisti: false };

/** `GET /katalog/` — `bilinenSurum` `If-None-Match` ile gönderilir; değişmediyse 304 (`{degisti:false}`, gövde yok). */
export async function katalogGetir(bilinenSurum: string | null, tekrarDenendi = false): Promise<KatalogSonucu> {
  const oturum = await oturumOku();
  if (!oturum) throw new ApiHatasi(401, 'OTURUM_YOK', 'Oturum açmalısın.');
  const denetimci = new AbortController();
  const zamanAsimi = setTimeout(() => denetimci.abort(), ZAMAN_ASIMI_MS);
  let yanit: Response;
  try {
    yanit = await fetch(`${TEMEL_URL}/katalog/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(oturum ? { Authorization: `Bearer ${oturum.erisimTokeni}` } : {}),
        ...(bilinenSurum ? { 'If-None-Match': `"${bilinenSurum}"` } : {}),
      },
      signal: denetimci.signal,
    });
  } catch {
    throw new ApiAgHatasi('Sunucuya ulaşılamadı.');
  } finally {
    clearTimeout(zamanAsimi);
  }

  if (yanit.status === 401) {
    if (!tekrarDenendi && await tokenYenileDene(oturum.yenilemeTokeni)) return katalogGetir(bilinenSurum, true);
    await oturumGecersizKil(oturum.yenilemeTokeni);
  }

  if (yanit.status === 304) return { degisti: false };
  if (!yanit.ok) throw new ApiHatasi(yanit.status, 'bilinmeyen', 'Katalog okunamadı.');
  const katalog = (await yanit.json()) as KatalogListesiYaniti;
  return { degisti: true, katalog };
}

export async function sifirlamaIste(email: string): Promise<void> {
  await istek('/auth/sifre/sifirlama-iste', { yontem: 'POST', govde: { email } });
}
export async function sifreyiYenile(token: string, sifre: string): Promise<void> {
  await istek('/auth/sifre/sifirla', { yontem: 'POST', govde: { token, sifre } });
}
