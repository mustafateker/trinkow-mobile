/**
 * Arayüz metinleri — uyumluluk katmanı.
 *
 * Metinlerin kendisi dil paketlerinde: `src/i18n/kaynaklar/<dil>.ts` (11 dil).
 * Kaynak dil Türkçe; anahtar listesinin tek kaynağı `kaynaklar/tr.ts`, o da
 * ../agency/projects/trinkow/docs/content/metinler.md ile birebir.
 * Kodda cümle uydurulmaz. Yeni metin önce metinler.md'ye, sonra tr.ts'e ve
 * diğer dil paketlerine eklenir.
 *
 * Bu dosya eski API'yi korur: `t['anahtar']` her zaman AKTİF dilin metnini
 * döner, aşağıdaki cümle fonksiyonları aktif dilin şablonunu doldurur.
 * Okuma render anında yapılmalı — modül seviyesinde sabite kopyalanan metin
 * dil değişince güncellenmez.
 */
import { metin, t, takvim } from '@/i18n/cekirdek';

export { t };
export type { MetinAnahtari } from '@/i18n/cekirdek';

/** `Bugün {harcanan}. Limitinin {fark} altındasın.` */
export function altAltinda(harcanan: string, fark: string): string {
  return metin('cumle.altAltinda', { harcanan, fark });
}

/** `Günlük limitin doldu. Bugün {harcanan}.` */
export function altDoldu(harcanan: string): string {
  return metin('cumle.altDoldu', { harcanan });
}

/** `Limitin {fark} üzerindesin.` */
export function altDisinda(fark: string): string {
  return metin('cumle.altDisinda', { fark });
}

/** `pano.limitsiz.ozet` — "Bugün {adet} kayıt yazdın. Limit koymadığın için kalan gösterilmiyor." */
export function panoLimitsizOzet(adet: number): string {
  return metin('cumle.panoLimitsizOzet', { adet });
}

/** `ob.sayac` — "{adim}/4" (kurulum başlık çubuğunun tek metni, §2.1). */
export function obSayac(adim: number, toplam: number): string {
  return metin('cumle.obSayac', { adim, toplam });
}

/** `ob.rutin.gunluk_toplam` — "Günlük {tutar}" (3/4 bölüm başlığının sağı). */
export function obRutinGunlukToplam(tutar: string): string {
  return metin('cumle.obRutinGunlukToplam', { tutar });
}

/** `ob.rutin.satir_alt` — "Her gün {adet} × {fiyat}" (`RoutineRow` alt yazısı). */
export function obRutinSatirAlt(adet: number, fiyat: string): string {
  return metin('cumle.obRutinSatirAlt', { adet, fiyat });
}

/** `ob.rutin.ayna` — "Ayda {tutar}" (`MirrorWell` üst satırı). */
export function obRutinAyna(tutar: string): string {
  return metin('cumle.obRutinAyna', { tutar });
}

/** `ob.rutin.ayna_formul` — "Her gün {adet} × {fiyat} × 30 gün" (`MirrorWell` formülü). */
export function obRutinAynaFormul(adet: number, fiyat: string): string {
  return metin('cumle.obRutinAynaFormul', { adet, fiyat });
}

/** `Günlük limit {tutar}` — kahraman kartın sağ üst etiketi (prototip). */
export function gunlukLimitEtiketi(tutar: string): string {
  return metin('cumle.gunlukLimitEtiketi', { tutar });
}

/** `Günlük toplam {tutar}` — `kayitlar.gun_toplam` */
export function gunToplamEtiketi(tutar: string): string {
  return metin('cumle.gunToplamEtiketi', { tutar });
}

/** `Bu ay {sira}. limit aşımı` — `pano.limit_sorgu.baslik` */
export function limitSorguBasligi(sira: number): string {
  return metin('cumle.limitSorguBasligi', { sira });
}

/** `ekle.taksit.onizleme` — "Ayda {tutar} · {ay} ay" */
export function ekleTaksitOnizleme(tutar: string, ay: number): string {
  return metin('cumle.ekleTaksitOnizleme', { tutar, ay });
}

/** `ekle.limit_disi_uyari` — "Bu harcama günlük limitin {fark} üzerine çıkarır." */
export function ekleLimitDisiUyari(fark: string): string {
  return metin('cumle.ekleLimitDisiUyari', { fark });
}

/** `toast.kaydedildi` — "{tutar} kaydedildi" */
export function toastKaydedildi(tutar: string): string {
  return metin('cumle.toastKaydedildi', { tutar });
}

/** `toast.kaydedildi_limit_disi` — "{tutar} kaydedildi · {fark} limit dışı" */
export function toastKaydedildiLimitDisi(tutar: string, fark: string): string {
  return metin('cumle.toastKaydedildiLimitDisi', { tutar, fark });
}

/** `toast.tekrarlandi` — "{tutar} yeniden eklendi" (Akış C · Latte Faktörü) */
export function toastTekrarlandi(tutar: string): string {
  return metin('cumle.toastTekrarlandi', { tutar });
}

/** `detay.taksit_bilgi` — "{mevcut}/{toplam} taksit · her ay {tutar}" */
export function detayTaksitBilgi(mevcut: number, toplam: number, tutar: string): string {
  return metin('cumle.detayTaksitBilgi', { mevcut, toplam, tutar });
}

/** `sil.govde_taksit` — "Kalan {adet} taksit de silinecek. Geri alınamaz." */
export function silGovdeTaksit(adet: number): string {
  return metin('cumle.silGovdeTaksit', { adet });
}

/** `kayitlar.gun_toplam_limit_disi` — "{tutar} · limit dışı" */
export function kayitlarGunToplamLimitDisi(tutar: string): string {
  return metin('cumle.kayitlarGunToplamLimitDisi', { tutar });
}

/** `kayitlar.ay_ozet` — "{adet} kayıt · {tutar}" */
export function kayitlarAyOzeti(adet: number, tutar: string): string {
  return metin('cumle.kayitlarAyOzeti', { adet, tutar });
}

/** `kayitlar.yer_tutucu.baslik` — "{ay} kayıtları" */
export function kayitlarYerTutucuBasligi(ay: string): string {
  return metin('cumle.kayitlarYerTutucuBasligi', { ay });
}

/* --------------------------------------------------------- E-15 kategori */
/** `kategori.bu_ay` — "Bu ay {tutar}" */
export function kategoriBuAy(tutar: string): string {
  return metin('cumle.kategoriBuAy', { tutar });
}

/** `kategori.limit_ust` — "Aylık limit {tutar}" */
export function kategoriLimitUst(tutar: string): string {
  return metin('cumle.kategoriLimitUst', { tutar });
}

/** `kategori.limit_disi` — "Aylık limitin {fark} üzerinde" */
export function kategoriLimitDisi(fark: string): string {
  return metin('cumle.kategoriLimitDisi', { fark });
}

/** `kategori.ortalama` — "Günlük ortalama {tutar}. Tahmini." */
export function kategoriOrtalama(tutar: string): string {
  return metin('cumle.kategoriOrtalama', { tutar });
}

/** `kategori.adet` — "{adet} kayıt" */
export function kategoriAdet(adet: number): string {
  return metin('cumle.kategoriAdet', { adet });
}

/** boş durum başlığı — "{kategori} için kayıt yok" */
export function kategoriBosBaslik(kategoriAdi: string): string {
  return metin('cumle.kategoriBosBaslik', { kategoriAdi });
}

/** `a11y.kategori_gun` — "{gun} {ay}" (E-15 satır erişilebilirliği) */
export function kategoriGunEtiketi(gun: string, ay: string): string {
  return metin('cumle.kategoriGunEtiketi', { gun, ay });
}

/* ------------------------------------------------------------- E-16 özet */
/** `ozet.hafta_araligi` biçiminde tarih aralığı zaten `lib/tarih.ts#haftaAraligi`de. */
/** `ozet.gecen_gun_ortalama` — "Geçen {adet} günün ortalaması" */
export function ozetGecenGunOrtalama(adet: number): string {
  return metin('cumle.ozetGecenGunOrtalama', { adet });
}

/** `ozet.limit_cizgisi` — "günlük limit {tutar}" */
export function ozetLimitCizgisi(tutar: string): string {
  return metin('cumle.ozetLimitCizgisi', { tutar });
}

/** `ozet.limit_alti_gun` — "Bu hafta {adet} gün limit altında." */
export function ozetLimitAltiGun(adet: number): string {
  return metin('cumle.ozetLimitAltiGun', { adet });
}

/** `ozet.limit_disi_gun` — "Bu hafta {adet} gün limit dışı." */
export function ozetLimitDisiGun(adet: number): string {
  return metin('cumle.ozetLimitDisiGun', { adet });
}

/** `ozet.en_cok` + kategori adı — "En çok harcadığın kategori {kategori}" */
export function ozetEnCok(kategoriAdi: string): string {
  return metin('cumle.ozetEnCok', { kategoriAdi });
}

/** `ozet.dagilim_gun` — "{adet} gün" */
export function ozetDagilimGun(adet: number): string {
  return metin('cumle.ozetDagilimGun', { adet });
}

/** `ozet.pay` — "%{oran}" */
export function ozetPay(oran: number): string {
  return metin('cumle.ozetPay', { oran });
}

/** `ozet.kucuk_harcama_alt` — "{adet} harcama · ortalama {tutar}" */
export function ozetKucukHarcamaAlt(adet: number, ortalama: string): string {
  return metin('cumle.ozetKucukHarcamaAlt', { adet, ortalama });
}

/** `ozet.taksit_yuku` — "Önümüzdeki ay taksit yükü {tutar}" */
export function ozetTaksitYuku(tutar: string): string {
  return metin('cumle.ozetTaksitYuku', { tutar });
}

/** `ozet.limit_sorgu.baslik` — "Günlük limit {tutar}" */
export function ozetLimitSorguBasligi(tutar: string): string {
  return metin('cumle.ozetLimitSorguBasligi', { tutar });
}

/**
 * `pano.taksit_yuku.alt` (§22.5) — "{adet} seri sürüyor. Sonuncusu {ayYil}
 * tarihinde bitiyor." E-16'daki taksit yükü kartı da aynı cümleyi kullanır
 * (E-10 ve E-16 aynı kavramı — gelecek ayın taksit yükünü — anlatır).
 */
export function taksitYukuAltMetni(adet: number, ayYil: string): string {
  return metin('cumle.taksitYukuAltMetni', { adet, ayYil });
}

/* ---------------------------------------------------------- E-17 limitler */
/** `limitler.toplam_notu` — "Kategori limitleri toplamı {tutar}. Günlük limitinle karşılaştır." */
export function limitlerToplamNotu(tutar: string): string {
  return metin('cumle.limitlerToplamNotu', { tutar });
}

/** `limitler.su_anki` — "Şu anki limitin {tutar}." */
export function limitlerSuAnki(tutar: string): string {
  return metin('cumle.limitlerSuAnki', { tutar });
}

/** `toast.limit_kaldirildi` — "{kategori} limiti kaldırıldı" */
export function toastLimitKaldirildi(kategoriAdi: string): string {
  return metin('cumle.toastLimitKaldirildi', { kategoriAdi });
}

/** `toast.limit_guncellendi` — "Günlük limit {tutar} olarak güncellendi" */
export function toastLimitGuncellendi(tutar: string): string {
  return metin('cumle.toastLimitGuncellendi', { tutar });
}

/** `a11y.kategori_limit_degistir` — "{kategori} limitini değiştir" */
export function a11yKategoriLimitDegistir(kategoriAdi: string): string {
  return metin('cumle.a11yKategoriLimitDegistir', { kategoriAdi });
}

/** `a11y.kategori_limit_kaldir` — "{kategori} limitini kaldır" */
export function a11yKategoriLimitKaldir(kategoriAdi: string): string {
  return metin('cumle.a11yKategoriLimitKaldir', { kategoriAdi });
}

/* --------------------------------------------------------- E-18 taksitler */
/** `taksit.gelecek` — "{ay} ayında {tutar}" */
export function taksitGelecek(ay: string, tutar: string): string {
  return metin('cumle.taksitGelecek', { ay, tutar });
}

/** `taksit.kalan_toplam` — "Kalan toplam {tutar}. Sonuncusu {ayYil} tarihinde bitiyor." */
export function taksitKalanToplam(tutar: string, ayYil: string): string {
  return metin('cumle.taksitKalanToplam', { tutar, ayYil });
}

/** `taksit.seri_bitti` — ürün adı yoksa yedek: "{kategori} serisi {ay} ayında bitti. Aylık yük {tutar} düştü." */
export function taksitSeriBitti(kategoriAdi: string, ay: string, tutar: string): string {
  return metin('cumle.taksitSeriBitti', { kategoriAdi, ay, tutar });
}

/** REV3 §30.2 `taksit.seri_bitti_urun` — "{urun} taksidi {ay} ayında bitti. Aylık yük {tutar} düştü." */
export function taksitSeriBittiUrun(urunAdi: string, ay: string, tutar: string): string {
  return metin('cumle.taksitSeriBittiUrun', { urunAdi, ay, tutar });
}

/** REV3 §30.2 `taksit.ozet_kategorili` — çok kategorili bölüm başlığının sağı: "{n} kategori · {n} ürün". */
export function taksitOzetKategorili(kategoriSayisi: number, urunSayisi: number): string {
  return metin('cumle.taksitOzetKategorili', { kategoriSayisi, urunSayisi });
}

/** REV3 §30.2 `taksit.ozet_tek_kategori` — tek kategoride bölüm başlığının sağı: "{n} ürün". */
export function taksitOzetTekKategori(urunSayisi: number): string {
  return metin('cumle.taksitOzetTekKategori', { urunSayisi });
}

/** REV3 §30.2 `taksit.kategori_ozet` — kapalı kategori akordiyonunun özeti: "{tutar} · {n} ürün". */
export function taksitKategoriOzet(tutar: string, urunSayisi: number): string {
  return metin('cumle.taksitKategoriOzet', { tutar, urunSayisi });
}

/** REV3 §30.2 `taksit.seri_kalan` — ürün satırının ikincil satırı: "{mevcut}/{toplam} · kalan {tutar}". */
export function taksitSeriKalan(mevcut: number, toplam: number, kalanTutar: string): string {
  return metin('cumle.taksitSeriKalan', { mevcut, toplam, kalanTutar });
}

/** REV3 §30.2 `taksit.urun_yok` — ürün adı boş kaydedilmiş serinin satır başlığı: "{Kategori} taksidi". */
export function taksitUrunYok(kategoriAdi: string): string {
  return metin('cumle.taksitUrunYok', { kategoriAdi });
}

/** REV3 §30.4 `a11y.taksit.kategori` — "{kategori}. {tutar}, {n} ürün". */
export function a11yTaksitKategori(kategoriAdi: string, tutar: string, urunSayisi: number): string {
  return metin('cumle.a11yTaksitKategori', { kategoriAdi, tutar, urunSayisi });
}

/** REV3 §30.4 `a11y.taksit.seri` — "{urun}. Bu ay {tutar}. {mevcut}. taksit, {toplam} taksitten. Kalan {kalan}. Ayrıntıyı aç" */
export function a11yTaksitSeri(urunAdi: string, tutar: string, mevcut: number, toplam: number, kalanTutar: string): string {
  return metin('cumle.a11yTaksitSeri', { urunAdi, tutar, mevcut, toplam, kalanTutar });
}

/** REV3 §30.4 `a11y.taksit.seri_son` — "{urun}. Bu ay {tutar}. Son taksit. Ayrıntıyı aç" */
export function a11yTaksitSeriSon(urunAdi: string, tutar: string): string {
  return metin('cumle.a11yTaksitSeriSon', { urunAdi, tutar });
}

/** REV3 §30.4 `a11y.taksit.tumunu_goster` — "{n} ürünün tamamını göster" */
export function a11yTaksitTumunuGoster(urunSayisi: number): string {
  return metin('cumle.a11yTaksitTumunuGoster', { urunSayisi });
}

/* --------------------------------------------------- v4 · E-10 Günlük */
/** `gunluk.o_gun_limiti` — "O gün limiti {tutar}" */
export function gunlukOGunLimiti(tutar: string): string {
  return metin('cumle.gunlukOGunLimiti', { tutar });
}

/** `gunluk.gun_kapandi` — "Gün kapandı. {adet} kayıt, {tutar}." */
export function gunlukGunKapandi(adet: number, tutar: string): string {
  return metin('cumle.gunlukGunKapandi', { adet, tutar });
}

/** `gunluk.gun_kapandi_disinda` — "Gün kapandı. {tutar}, limitin {fark} üzerinde." */
export function gunlukGunKapandiDisinda(tutar: string, fark: string): string {
  return metin('cumle.gunlukGunKapandiDisinda', { tutar, fark });
}

/** `seri.cip` a11y — "Seri {n} gün. Seri ekranını aç" · görünen etiket "Seri {n} gün" */
export function seriCipEtiketi(n: number): string {
  return metin('cumle.seriCipEtiketi', { n });
}


export function seriCipA11y(n: number): string {
  return metin('cumle.seriCipA11y', { n });
}

/** `gunluk.grup.bugun` / `.kalan` / `.limit_disi` — kategori satırı ikincil bilgisi */
export function gunlukGrupBugun(tutar: string): string {
  return metin('cumle.gunlukGrupBugun', { tutar });
}


export function gunlukGrupKalan(tutar: string): string {
  return metin('cumle.gunlukGrupKalan', { tutar });
}


export function gunlukGrupLimitDisi(tutar: string): string {
  return metin('cumle.gunlukGrupLimitDisi', { tutar });
}

/** `gunluk.a11y.gruba_ekle` — "{kategori} kategorisine harcama ekle" */
export function gunlukA11yGrubaEkle(kategoriAdi: string): string {
  return metin('cumle.gunlukA11yGrubaEkle', { kategoriAdi });
}

/* --------------------------------------------------------- v4 · E-21 Seri */
/** `seri.aktif.govde` — "{n} gündür kayıt giriyorsun." */
export function seriAktifGovde(n: number): string {
  return metin('cumle.seriAktifGovde', { n });
}

/** `seri.durak.kalan` — "{n} gün kaldı" */
export function seriDurakKalan(n: number): string {
  return metin('cumle.seriDurakKalan', { n });
}

/** `seri.durak.sonraki` — "Sıradaki durak {n} gün" */
export function seriDurakSonraki(n: number): string {
  return metin('cumle.seriDurakSonraki', { n });
}

/** `seri.durak.a11y` — "{n} gün durağı geçildi / sırada / ileride" */
export function seriDurakA11y(n: number, hal: 'gecildi' | 'sirada' | 'ileride'): string {
  return metin('cumle.seriDurakA11y', { n, hal });
}

/** `seri.gun.a11y` — "{g} {Ay}, limit altında / limit dışı / kayıt yok" */
export function seriGunA11y(gunAy: string, durum: 'altinda' | 'disinda' | 'bos'): string {
  return metin('cumle.seriGunA11y', { gunAy, durum });
}

/** `kutlama.baslik` — "{n} gün" */
export function kutlamaBaslik(n: number): string {
  return metin('cumle.kutlamaBaslik', { n });
}

/** `kutlama.govde` — "Seri {n} güne ulaştı. Sıradaki durak {m} gün." (son durak: "Sıradaki durak yok.") */
export function kutlamaGovde(n: number, sonrakiDurak: number | null): string {
  return sonrakiDurak
    ? metin('cumle.kutlamaGovde', { n, sonrakiDurak })
    : metin('cumle.kutlamaGovde.son', { n });
}

/* ----------------------------------------------------- v4 · E-24 Gün seçici */
/** `gunsec.alt.kayitli` — "{n} gün kayıtlı" */
export function gunsecAltKayitli(n: number): string {
  return metin('cumle.gunsecAltKayitli', { n });
}

/** `gunsec.alt.acik_gun` — "Açık gün {g} {Ay}" */
export function gunsecAltAcikGun(gAy: string): string {
  return metin('cumle.gunsecAltAcikGun', { gAy });
}

/** `gunsec.sinir.baslangic` — "Trinkow'a {g} {Ay}'ta başladın. Daha öncesi yok." */
export function gunsecSinirBaslangic(gAy: string): string {
  return metin('cumle.gunsecSinirBaslangic', { gAy });
}

/** `gunsec.ozet.baslik` — "{Ay} özeti" */
export function gunsecOzetBasligi(ayAdi: string): string {
  return metin('cumle.gunsecOzetBasligi', { ayAdi });
}

/** `gunsec.a11y.gun` — "{g} {Ay} {GünAdı}, {durum}[, bugün]" */
export function gunsecA11yGun(gAyGunAdi: string, durum: string, bugunMu: boolean): string {
  return metin(bugunMu ? 'cumle.gunsecA11yGun.bugun' : 'cumle.gunsecA11yGun', { gAyGunAdi, durum });
}

/* ----------------------------------------------------- v4 · E-11 ürün arama */
/** `ekle.arama.satir.gecen` — "{kategori} · geçen sefer {tutar}" */
export function ekleAramaSatirGecen(kategoriAdi: string, tutar: string): string {
  return metin('cumle.ekleAramaSatirGecen', { kategoriAdi, tutar });
}

/** `ekle.arama.yeni.baslik` — `"{arama}" olarak ekle` */
export function ekleAramaYeniBaslik(arama: string): string {
  return metin('cumle.ekleAramaYeniBaslik', { arama });
}

/** `ekle.tutar.oneri.cip` — "Geçen sefer {tutar}" */
export function ekleTutarOneriCip(tutar: string): string {
  return metin('cumle.ekleTutarOneriCip', { tutar });
}

/** `ekle.gun.serit` — "Bu kayıt {gün}'e yazılacak." */
export function ekleGunSeridi(gun: string): string {
  return metin('cumle.ekleGunSeridi', { gun });
}

/** `a11y.ekle.gun` — "Gün seç, şu an {gün}" */
export function a11yEkleGun(gun: string): string {
  return metin('cumle.a11yEkleGun', { gun });
}

/** `a11y.ekle.oneriCip` — "Geçen sefer ödediğin {tutar} tutarını kullan" */
export function a11yEkleOneriCip(tutar: string): string {
  return metin('cumle.a11yEkleOneriCip', { tutar });
}

/** `a11y.ekle.sonKullanilan` — "{ad}, geçen sefer {tutar}" */
export function a11yEkleSonKullanilan(ad: string, tutar: string): string {
  return metin('cumle.a11yEkleSonKullanilan', { ad, tutar });
}

/* ------------------------------------------------- D-2d-3a · Onboarding */
/** `a11y.ob.gun` — "Ayın {n}. günü" (E-03 gün ızgarası, prototip aria-label deseni). */
export function a11yObGun(gun: number): string {
  return metin('cumle.a11yObGun', { gun });
}

/**
 * `ob.maas.donem` — metinler.md şablonu "Dönem ayın {gun}'inde başlar."
 * statik "'inde" ekini yalnız örnek gün (15) için doğru yazmıştı; 31 günün
 * çoğunda ünlü uyumu farklıdır (bkz. `lib/tarih.ts#gunBulunmaEki`). PM'e
 * bildirildi — metinler.md §2 şablonu güncellenmeli, ek burada TEK yerden
 * hesaplanır (K-040).
 */
export function obMaasDonem(gunEki: string): string {
  return metin('cumle.obMaasDonem', { gunEki });
}

/** `ob.ozet` maaş günü değeri — 15 → "Ayın 15'i" (`lib/tarih.ts#gunIyelikEki`). */
export function obOzetMaasGunu(gunEki: string): string {
  return metin('cumle.obOzetMaasGunu', { gunEki });
}

/** `oneri.nasil.1` — "Aylık net gelirin {tutar}." */
export function oneriNasil1(tutar: string): string {
  return metin('cumle.oneriNasil1', { tutar });
}

/** `oneri.nasil.3` — "Sosyal ve keyfi pay {tutar} oldu, gelir döneminde kalan {n} güne bölündü." */
export function oneriNasil3(tutar: string, gunSayisi: number): string {
  return metin('cumle.oneriNasil3', { tutar, gunSayisi });
}

/** `oneri.denklem.kalan_gun` değeri — "{n} gün" */
export function oneriDenklemKalanGun(gunSayisi: number): string {
  return metin('cumle.oneriDenklemKalanGun', { gunSayisi });
}

/* ------------------------------------------------ D-2d-3b · Katman 2 + Plan */
/** Alışkanlık kartı ayna kuyusu formül satırı — "Günde 1 × 90 ₺ × 30 gün" / "Haftada 1 × 380 ₺ × 30 gün ÷ 7" / "Ayda 1-2 × 130 ₺". */
export function tanFormulMetni(siklikEtiket: string, fiyatYazi: string, haftalikMi: boolean, aylikSayiMi: boolean): string {
  if (aylikSayiMi) return metin('cumle.tanFormulMetni.aylik', { siklikEtiket, fiyatYazi });
  return metin(haftalikMi ? 'cumle.tanFormulMetni.haftalik' : 'cumle.tanFormulMetni', { siklikEtiket, fiyatYazi });
}

/** `tan.yemek.birim` notu — "Günde kaç {birim}" (serbest sayı sorusu etiketi). */
export function tanGundeKac(birim: string): string {
  return metin('cumle.tanGundeKac', { birim });
}

/** Birikim kartı (E-25) kaydırıcı altı — "Ayda 4.800 ₺ ayırmayı hedefliyorsun." (prototip 17-tanisma.html, anahtarsız). */
export function tanBirikimHedef(tutar: string): string {
  return metin('cumle.tanBirikimHedef', { tutar });
}

/** Birikim kartı alt notu — "Üst sınır sabit giderlerine göre hesaplandı. Zorunlu payın %59." */
export function tanBirikimUstSinirNotu(zorunluYuzde: number): string {
  return metin('cumle.tanBirikimUstSinirNotu', { zorunluYuzde });
}

/** `tan.donus.aciklama` — "Dört kart cevapladın. Dördü bekliyor." */
export function tanDonusAciklama(cevaplanan: number, bekleyen: number): string {
  return metin('cumle.tanDonusAciklama', { cevaplanan, bekleyen });
}

/** `tan.X.Y kartın Z. kartı` a11y — "8 kartın {n}. kartı" */
export function a11yTanKart(n: number): string {
  return metin('cumle.a11yTanKart', { n });
}

/** Plan kartı başlığı altı — "Gelir 32.000 ₺" */
export function planGelirEtiketi(tutar: string): string {
  return metin('cumle.planGelirEtiketi', { tutar });
}

/** `plan.pay.yatirim` — "Bunun {tutar}'si yatırım payı." */
export function planPayYatirim(tutar: string): string {
  return metin('cumle.planPayYatirim', { tutar });
}

/** Pay satırı yüzde — "%59" (işaret önce, boşluk yok — K-053/K-059/1). */
export function planYuzde(yuzde: number): string {
  return metin('cumle.planYuzde', { yuzde });
}

/** `plan.denklem.kalan_gun` değeri — "{n} gün" */
export function planDenklemKalanGun(gunSayisi: number): string {
  return metin('cumle.planDenklemKalanGun', { gunSayisi });
}

/** `plan.nasil.1` — "12.500 + 2.840 + 1.900 + 1.560 = 18.800 ₺. Zorunlu payın bu." (kalemler sıfırsa listeden düşer). */
export function planNasil1(kalemler: string[], toplam: string): string {
  return metin('cumle.planNasil1', { kalemler: kalemler.join(' + '), toplam });
}

/** `plan.nasil.2` — "32.000 ₺ gelirin %15'i = 4.800 ₺." */
export function planNasil2(gelir: string, yuzde: number, tutar: string): string {
  return metin('cumle.planNasil2', { gelir, yuzde, tutar });
}

/** `plan.nasil.3` — "32.000 − 18.800 − 4.800 = 8.400 ₺." */
export function planNasil3(gelir: string, zorunlu: string, birikim: string, sosyal: string): string {
  return metin('cumle.planNasil3', { gelir, zorunlu, birikim, sosyal });
}

/** `plan.nasil.4` — "8.400 ₺ ÷ 28 gün = 300 ₺ günlük limit." */
export function planNasil4(sosyal: string, gunSayisi: number, gunlukLimit: string): string {
  return metin('cumle.planNasil4', { sosyal, gunSayisi, gunlukLimit });
}

/** Alışkanlık maliyeti listesi satır altı — "Günde 1 × 90 ₺" (formülün kısa hâli, ×30 kartın kendisinde). */
export function planAliskanlikSatirAlt(siklikEtiket: string, fiyatYazi: string): string {
  return metin('cumle.planAliskanlikSatirAlt', { siklikEtiket, fiyatYazi });
}

/** Abonelikler satır altı / ayna kuyusu formülü — "{adet} × {tutar}" (E-25 ve E-26 aynı biçimi kullanır, K-040). */
export function abonelikFormulMetni(adet: number, ortalamaTutar: string): string {
  return metin('cumle.abonelikFormulMetni', { adet, ortalamaTutar });
}

/** `plan.aliskanlik.toplam_not` — "Sosyal ve keyfi payının {tutar}'si. Yasak değil, görünür." */
export function planAliskanlikToplamNot(tutar: string): string {
  return metin('cumle.planAliskanlikToplamNot', { tutar });
}

/** `plan.ayar.degisim` — "Sosyal ve keyfi pay {tutar} azaldı. Zorunlu pay değişmedi." */
export function planAyarDegisim(tutar: string, azaldiMi: boolean): string {
  return metin(azaldiMi ? 'cumle.planAyarDegisim.azaldi' : 'cumle.planAyarDegisim.artti', { tutar });
}

/** Kaydırıcı altı ilk metin (henüz değiştirilmemiş) — "Ayda {tutar}. Fark sosyal ve keyfi paydan iner." */
export function planAyarAltMetin(tutar: string): string {
  return metin('cumle.planAyarAltMetin', { tutar });
}

/** `plan.ayar.aralik_en_cok` — "En çok %41" */
export function planAralikEnCok(yuzde: number): string {
  return metin('cumle.planAralikEnCok', { yuzde });
}

/** Gelirsiz limit kartı — "Ayda yaklaşık {tutar}. Tahmini." (günlük × 30) */
export function planGelirsizAylikTahmin(tutar: string): string {
  return metin('cumle.planGelirsizAylikTahmin', { tutar });
}

/** `plan.eksi.tutar` — "Sabit giderlerin gelirini {tutar} aşıyor." */
export function planEksiTutar(tutar: string): string {
  return metin('cumle.planEksiTutar', { tutar });
}

/** `plan.eksi.kalan` — "{tutar} eksik" */
export function planEksiKalan(tutar: string): string {
  return metin('cumle.planEksiKalan', { tutar });
}

/* ---------------------------------------------------------- D-2c-1 · E-19 */
/** `ayar.surum` — "Sürüm {surum}" */
export function ayarSurum(surum: string): string {
  return metin('cumle.ayarSurum', { surum });
}

/** `ayar.plan.kalan` / `.bekliyor` — "{n} kart kaldı" · "8 kart bekliyor" (metinler.md §26.3). */
export function ayarPlanKalan(n: number): string {
  return metin('cumle.ayarPlanKalan', { n });
}


export function ayarPlanBekliyor(n: number): string {
  return metin('cumle.ayarPlanBekliyor', { n });
}

/** `a11y` — "Maaş günü: {deger}. Değiştir" / "Kip: {deger}. Değiştir" / "Bildirim saati: {deger}. Değiştir" desenleri. */
export function a11yDegerDegistir(etiket: string, deger: string): string {
  return metin('cumle.a11yDegerDegistir', { etiket, deger });
}

/** `hesapsil.veri` — "{n} kayıt dahil tüm verilerin silinir." */
export function hesapsilVeri(n: number): string {
  return metin('cumle.hesapsilVeri', { n });
}

/** `sifirla.govde` — "{eposta} adresine şifre bağlantısı gitti." */
export function sifirlaGovde(eposta: string): string {
  return metin('cumle.sifirlaGovde', { eposta });
}

/** `ayar.veri_sil_ozet` — "{adet} kayıt · {ay} {yil}'dan bugüne" */
export function ayarVeriSilOzet(adet: number, ayYil: string): string {
  return metin('cumle.ayarVeriSilOzet', { adet, ayYil });
}

/* ---------------------------------------------------------- D-2c-1 · E-20 */
/** `prof.gun` — "{n}. gün" */
export function profGun(n: number): string {
  return metin('cumle.profGun', { n });
}

/** 1-12 ay indeksinden aktif dilde "o ayda" ifadesi — tr "Eylül'de", en "in September". */
export function ayLokatif(ay: number): string {
  return takvim.ayIcinde[((ay - 1) % 12 + 12) % 12];
}

/** `tasarruf.ustSatir.devam` / `.kapandi` — "{Ay} {yıl} · ay devam ediyor" / "· ay kapandı" */
export function tasarrufUstSatir(ayYil: string, kapandiMi: boolean): string {
  return metin(kapandiMi ? 'cumle.tasarrufUstSatir.kapandi' : 'cumle.tasarrufUstSatir.devam', { ayYil });
}

/** `tasarruf.butce.cip` / `.cipYok` — "Bütçe {tutar}" · "Bütçe yok" */
export function tasarrufButceCip(tutar: string | null): string {
  return tutar ? metin('cumle.tasarrufButceCip', { tutar }) : t['cumle.tasarrufButceCip.yok'];
}

/** `tasarruf.gosterge.cumle.buAy` — "Kaydettiğin gelir ve harcamalara göre {n} gün hesaplandı." */
export function tasarrufGostergeCumleBuAy(gunSayisi: number): string {
  return metin('cumle.tasarrufGostergeCumleBuAy', { gunSayisi });
}

/** `tasarruf.gosterge.cumle.gecmisAy` — "{AyLokatif} kaydettiğin gelir ve harcamalara göre {n} gün hesaplandı." */
export function tasarrufGostergeCumleGecmisAy(ayLokatifDeger: string, gunSayisi: number): string {
  return metin('cumle.tasarrufGostergeCumleGecmisAy', { ayLokatifDeger, gunSayisi });
}

/** `tasarruf.gosterge.disinda.buAy` — "Bu ay harcaman bütçenin {tutar} üzerinde." */
export function tasarrufGostergeDisindaBuAy(tutar: string): string {
  return metin('cumle.tasarrufGostergeDisindaBuAy', { tutar });
}

/** `tasarruf.gosterge.disinda.gecmisAy` — "{AyLokatif} harcaman bütçenin {tutar} üzerinde." */
export function tasarrufGostergeDisindaGecmisAy(ayLokatifDeger: string, tutar: string): string {
  return metin('cumle.tasarrufGostergeDisindaGecmisAy', { ayLokatifDeger, tutar });
}

/** `tasarruf.motivasyon.borc` — "Bu tutar borcunun %{n}'ine denk geliyor." */
export function tasarrufMotivasyonBorc(yuzde: number): string {
  return metin('cumle.tasarrufMotivasyonBorc', { yuzde });
}

/** `tasarruf.butce.aralik` — "{n}–{n} {Ay}" */
export function tasarrufButceAralik(baslangicGun: number, bitisGun: number, ay: string): string {
  return metin('cumle.tasarrufButceAralik', { baslangicGun, bitisGun, ay });
}

/** `tasarruf.butce.sabit` — "Sabit ödemeler dahil toplam {tutar}" */
export function tasarrufButceSabit(tutar: string): string {
  return metin('cumle.tasarrufButceSabit', { tutar });
}

/** `tasarruf.butce.gunDeger` — "{n}/{n} gün" */
export function tasarrufButceGunDeger(tamamlanan: number, toplam: number): string {
  return metin('cumle.tasarrufButceGunDeger', { tamamlanan, toplam });
}

/** `tasarruf.butce.kumulatif` — "Takip başından beri biriken {tutar}" */
export function tasarrufButceKumulatif(tutar: string): string {
  return metin('cumle.tasarrufButceKumulatif', { tutar });
}

/** `tasarruf.butce.eksikGun` — "{n} günün geliri eksik. O günler hesaba katılmadı." */
export function tasarrufButceEksikGun(gunSayisi: number): string {
  return metin('cumle.tasarrufButceEksikGun', { gunSayisi });
}

/** `tasarruf.butce.takipBasi` — "Takip {n} {AyLokatif} başladı. Ayın {n} günü hesaplanacak." (`ay` 1-12) */
export function tasarrufButceTakipBasi(gun: number, ay: number, hesaplanacakGun: number): string {
  const i = ((ay - 1) % 12 + 12) % 12;
  return metin('cumle.tasarrufButceTakipBasi', { gun, ay: takvim.aylarTarih[i], ayIcinde: takvim.ayIcinde[i], hesaplanacakGun });
}

/** `tasarruf.birikim.ayEkleme.buAy` — "Bu ay {tutar} eklendi" */
export function tasarrufBirikimAyEklemeBuAy(tutar: string): string {
  return metin('cumle.tasarrufBirikimAyEklemeBuAy', { tutar });
}

/** `tasarruf.birikim.ayEkleme.gecmisAy` — "{AyLokatif} {tutar} eklendi" */
export function tasarrufBirikimAyEklemeGecmisAy(ayLokatifDeger: string, tutar: string): string {
  return metin('cumle.tasarrufBirikimAyEklemeGecmisAy', { ayLokatifDeger, tutar });
}

/** `tasarruf.birikim.ayCekme.buAy` — "Bu ay {tutar} çekildi" */
export function tasarrufBirikimAyCekmeBuAy(tutar: string): string {
  return metin('cumle.tasarrufBirikimAyCekmeBuAy', { tutar });
}

/** `tasarruf.birikim.ayCekme.gecmisAy` — "{AyLokatif} {tutar} çekildi" */
export function tasarrufBirikimAyCekmeGecmisAy(ayLokatifDeger: string, tutar: string): string {
  return metin('cumle.tasarrufBirikimAyCekmeGecmisAy', { ayLokatifDeger, tutar });
}

/** `tasarruf.birikim.ayYok.gecmisAy` — "{AyLokatif} kayıt yok" */
export function tasarrufBirikimAyYokGecmisAy(ayLokatifDeger: string): string {
  return metin('cumle.tasarrufBirikimAyYokGecmisAy', { ayLokatifDeger });
}

/** `tasarruf.birikim.hedef` — "Hedef {tutar}" */
export function tasarrufBirikimHedef(tutar: string): string {
  return metin('cumle.tasarrufBirikimHedef', { tutar });
}

/** `tasarruf.hareket.sayi` — "{n} kayıt" */
export function tasarrufHareketSayi(adet: number): string {
  return metin('cumle.tasarrufHareketSayi', { adet });
}

/** `tasarruf.hareket.bos.alt.gecmisAy` — "{AyLokatif} kenara ayırdığın para yok." */
export function tasarrufHareketBosAltGecmisAy(ayLokatifDeger: string): string {
  return metin('cumle.tasarrufHareketBosAltGecmisAy', { ayLokatifDeger });
}

/** `tasarruf.hareket.silindiToast` — "{tutar} silindi · Geri al" (eylem etiketi ayrı geçilir, bkz. toastGoster) */
export function tasarrufHareketSilindiToast(tutar: string): string {
  return metin('cumle.tasarrufHareketSilindiToast', { tutar });
}

/** `tasarruf.hareket.kaydedildiToast` — "{tutar} birikime eklendi" */
export function tasarrufHareketKaydedildiToast(tutar: string): string {
  return metin('cumle.tasarrufHareketKaydedildiToast', { tutar });
}

/** `tasarruf.kategori.harcanan` — "Harcanan {tutar}" */
export function tasarrufKategoriHarcanan(tutar: string): string {
  return metin('cumle.tasarrufKategoriHarcanan', { tutar });
}

/** `tasarruf.kategori.pay` — "payı %{n}" (işaret önce, boşluksuz) */
export function tasarrufKategoriPay(yuzde: number): string {
  return metin('cumle.tasarrufKategoriPay', { yuzde });
}

/** `tasarruf.kategori.rutin` — "rutin {tutar}" */
export function tasarrufKategoriRutin(tutar: string): string {
  return metin('cumle.tasarrufKategoriRutin', { tutar });
}

/** `tasarruf.kategori.bos.gecmisAy` — "{AyLokatif} harcama yazmamışsın." */
export function tasarrufKategoriBosGecmisAy(ayLokatifDeger: string): string {
  return metin('cumle.tasarrufKategoriBosGecmisAy', { ayLokatifDeger });
}

/** `tasarruf.rutin.bos.gecmisAy` — "{AyLokatif} vazgeçtiğin rutin yok." */
export function tasarrufRutinBosGecmisAy(ayLokatifDeger: string): string {
  return metin('cumle.tasarrufRutinBosGecmisAy', { ayLokatifDeger });
}

// §28.3 — E-27 akordiyon özetleri (REV3)
/** `tasarruf.ozet.butce` — "Kalan {tutar}" */
export function tasarrufOzetButce(tutar: string): string {
  return metin('cumle.tasarrufOzetButce', { tutar });
}

/** `tasarruf.ozet.butceDisinda` — "Bütçe dışı {tutar}" */
export function tasarrufOzetButceDisinda(tutar: string): string {
  return metin('cumle.tasarrufOzetButceDisinda', { tutar });
}

/** `tasarruf.ozet.birikim` — "{tutar} · hedefin %{n}'i" */
export function tasarrufOzetBirikim(tutar: string, yuzde: number): string {
  return metin('cumle.tasarrufOzetBirikim', { tutar, yuzde });
}

/** `tasarruf.ozet.birikimAyYok.buAy` — "{tutar} · bu ay kayıt yok" */
export function tasarrufOzetBirikimAyYokBuAy(tutar: string): string {
  return metin('cumle.tasarrufOzetBirikimAyYokBuAy', { tutar });
}

/** `tasarruf.ozet.birikimAyYok.gecmisAy` — "{tutar} · {AyLokatif} kayıt yok" */
export function tasarrufOzetBirikimAyYokGecmisAy(tutar: string, ayLokatifDeger: string): string {
  return metin('cumle.tasarrufOzetBirikimAyYokGecmisAy', { tutar, ayLokatifDeger });
}

/** `tasarruf.ozet.birikimHedefYok` — "{tutar} · hedef koymadın" */
export function tasarrufOzetBirikimHedefYok(tutar: string): string {
  return metin('cumle.tasarrufOzetBirikimHedefYok', { tutar });
}

/** `tasarruf.ozet.kategori` — "Harcanan {tutar}" */
export function tasarrufOzetKategori(tutar: string): string {
  return metin('cumle.tasarrufOzetKategori', { tutar });
}

/** `tasarruf.ozet.rutin` — "{tutar} · {n} rutin" */
export function tasarrufOzetRutin(tutar: string, rutinSayisi: number): string {
  return metin('cumle.tasarrufOzetRutin', { tutar, rutinSayisi });
}

/** `a11y.tasarruf.bolum` — "{başlık}. {özet}" */
export function a11yTasarrufBolum(baslik: string, ozet: string): string {
  return metin('cumle.a11yTasarrufBolum', { baslik, ozet });
}

// §29 — E-10 Günlük rutin hızlı eylem satırı (REV3)
/** `gunlukRutin.ozet` — "{n} rutin · {n} işaretsiz" */
export function gunlukRutinOzet(toplam: number, isaretsiz: number): string {
  return metin('cumle.gunlukRutinOzet', { toplam, isaretsiz });
}

/** `gunlukRutin.ozetHepsi` — "{n} rutin · hepsi işaretli" */
export function gunlukRutinOzetHepsi(toplam: number): string {
  return metin('cumle.gunlukRutinOzetHepsi', { toplam });
}

/** `gunlukRutin.ozetHicbiri` — "{n} rutin · işaretlenmedi" */
export function gunlukRutinOzetHicbiri(toplam: number): string {
  return metin('cumle.gunlukRutinOzetHicbiri', { toplam });
}

/** `gunlukRutin.ozetHata` — "{n} rutin · işaret bekliyor" */
export function gunlukRutinOzetHata(toplam: number): string {
  return metin('cumle.gunlukRutinOzetHata', { toplam });
}

/**
 * §3.1 (rev3-gunluk-rutin.md) — kapalı bölümün özet metni. `hataMi` daima
 * önce sorulur (§3.12.5/Ö4 ile aynı desen): hata varken özet toplamı
 * söylemez, kullanıcının yapması gerekeni söyler.
 */
export function gunlukRutinOzetSec(toplam: number, isaretsiz: number, hataMi: boolean): string {
  if (hataMi) return gunlukRutinOzetHata(toplam);
  if (isaretsiz === 0) return gunlukRutinOzetHepsi(toplam);
  if (isaretsiz === toplam) return gunlukRutinOzetHicbiri(toplam);
  return gunlukRutinOzet(toplam, isaretsiz);
}

/** `gunlukRutin.durum.aldim` — "Yazıldı · {saat}" */
export function gunlukRutinDurumAldim(saat: string): string {
  return metin('cumle.gunlukRutinDurumAldim', { saat });
}

/** `gunlukRutin.toast.aldim` — "{ad} {tutar} yazıldı." */
export function gunlukRutinToastAldim(ad: string, tutar: string): string {
  return metin('cumle.gunlukRutinToastAldim', { ad, tutar });
}

/** `gunlukRutin.toast.almadim` — "{ad} almadın olarak işaretlendi." */
export function gunlukRutinToastAlmadim(ad: string): string {
  return metin('cumle.gunlukRutinToastAlmadim', { ad });
}

/** `a11y.gunlukRutin.bolum` — "{bölüm başlığı}. {özet}"; başlık `gunlukRutin.baslik`tan gelir. */
export function a11yGunlukRutinBolum(ozet: string): string {
  return metin('cumle.a11yGunlukRutinBolum', { baslik: t['gunlukRutin.baslik'], ozet });
}

/** `a11y.gunlukRutin.bolumGecmis` — "{bölüm başlığı}. {gün}. {özet}" */
export function a11yGunlukRutinBolumGecmis(gun: string, ozet: string): string {
  return metin('cumle.a11yGunlukRutinBolumGecmis', { baslik: t['gunlukRutin.baslik'], gun, ozet });
}

/** `a11y.gunlukRutin.aldim` — "{ad} aldım olarak işaretle, {tutar}" */
export function a11yGunlukRutinAldim(ad: string, tutar: string): string {
  return metin('cumle.a11yGunlukRutinAldim', { ad, tutar });
}

/** `a11y.gunlukRutin.almadim` — "{ad} almadım olarak işaretle, {tutar} rutin tasarrufu" */
export function a11yGunlukRutinAlmadim(ad: string, tutar: string): string {
  return metin('cumle.a11yGunlukRutinAlmadim', { ad, tutar });
}

/** `a11y.gunlukRutin.yaziliyor` — "{ad} yazılıyor" */
export function a11yGunlukRutinYaziliyor(ad: string): string {
  return metin('cumle.a11yGunlukRutinYaziliyor', { ad });
}

/** `a11y.gunlukRutin.isaretleniyor` — "{ad} işaretleniyor" */
export function a11yGunlukRutinIsaretleniyor(ad: string): string {
  return metin('cumle.a11yGunlukRutinIsaretleniyor', { ad });
}

/** `a11y.gunlukRutin.aldimGecmis` — "{ad}, {gün}. Aldım olarak işaretle, {tutar}" */
export function a11yGunlukRutinAldimGecmis(ad: string, gun: string, tutar: string): string {
  return metin('cumle.a11yGunlukRutinAldimGecmis', { ad, gun, tutar });
}

/** `a11y.gunlukRutin.almadimGecmis` — "{ad}, {gün}. Almadım olarak işaretle, {tutar} rutin tasarrufu" */
export function a11yGunlukRutinAlmadimGecmis(ad: string, gun: string, tutar: string): string {
  return metin('cumle.a11yGunlukRutinAlmadimGecmis', { ad, gun, tutar });
}

/**
 * `a11y.bolumYukleniyor` — "{başlık}. Yükleniyor". Ö5 — E-10 rutin bölümü VE
 * E-27 akordiyonunun dört bölümü PAYLAŞIR (aynı anahtar, farklı `baslik`).
 */
export function a11yBolumYukleniyor(baslik: string): string {
  return metin('cumle.a11yBolumYukleniyor', { baslik });
}

/** `a11y.tasarruf.gostergeDisinda` — "Bütçe dışı {tutar}" */
export function a11yTasarrufGostergeDisinda(tutar: string): string {
  return metin('cumle.a11yTasarrufGostergeDisinda', { tutar });
}

/** `a11y.tasarruf.butceCip` — "Bütçe {tutar}. Bütçeyi aç" */
export function a11yTasarrufButceCip(tutar: string | null): string {
  return tutar ? metin('cumle.a11yTasarrufButceCip', { tutar }) : t['cumle.a11yTasarrufButceCip.yok'];
}

/** `a11y.tasarruf.hareket` — "{yön}, {tarih}, {tutar}, not: {not}" (tarih `kisaTarih` ile gelir). */
export function a11yTasarrufHareket(yon: string, tarih: string, tutar: string, notMetni?: string): string {
  return notMetni
    ? metin('cumle.a11yTasarrufHareket.not', { yon, tarih, tutar, notMetni })
    : metin('cumle.a11yTasarrufHareket', { yon, tarih, tutar });
}

/** `a11y.tasarruf.gunSayaci` — "Ayın tamamlanan günleri: {n} / {n}" */
export function a11yTasarrufGunSayaci(tamamlanan: number, toplam: number): string {
  return metin('cumle.a11yTasarrufGunSayaci', { tamamlanan, toplam });
}

/** `profil.satir.butceDeger` — "Aylık net gelir {tutar} · {n} sabit gider" */
export function profilSatirButceDeger(tutar: string, sabitGiderSayisi: number): string {
  return metin('cumle.profilSatirButceDeger', { tutar, sabitGiderSayisi });
}

/** `profil.satir.limitlerDeger` — "Günlük {tutar} · {n} kategori limiti" */
export function profilSatirLimitlerDeger(gunlukTutar: string, kategoriLimitSayisi: number): string {
  return metin('cumle.profilSatirLimitlerDeger', { gunlukTutar, kategoriLimitSayisi });
}

/** `profil.satir.rutinlerDeger` — "{n} rutin · bu ay {tutar} tasarruf" */
export function profilSatirRutinlerDeger(rutinSayisi: number, tutar: string): string {
  return metin('cumle.profilSatirRutinlerDeger', { rutinSayisi, tutar });
}

/** `profil.satir.favorilerDeger` — "{n} ürün, son fiyatlarıyla" */
export function profilSatirFavorilerDeger(urunSayisi: number): string {
  return metin('cumle.profilSatirFavorilerDeger', { urunSayisi });
}

/** `profil.satir.taksitlerDeger` — "{n} seri · bu ay {tutar}" */
export function profilSatirTaksitlerDeger(seriSayisi: number, tutar: string): string {
  return metin('cumle.profilSatirTaksitlerDeger', { seriSayisi, tutar });
}

/** `profil.satir.seriDeger` — "{n} gün · en uzun {n} gün" */
export function profilSatirSeriDeger(mevcutSeri: number, enUzunSeri: number): string {
  return metin('cumle.profilSatirSeriDeger', { mevcutSeri, enUzunSeri });
}

/** `profil.alt.surum` — "Trinkow · sürüm {n}" */
export function profilAltSurum(surum: string): string {
  return metin('cumle.profilAltSurum', { surum });
}

/** `profil.kimlik.serit.gun` — "{n} gündür kayıt giriyorsun" */
export function profilKimlikSeritGun(mevcutSeri: number): string {
  return metin('cumle.profilKimlikSeritGun', { mevcutSeri });
}

/** `profil.kimlik.serit.altEnUzun` — "En uzun {n} gün." */
export function profilKimlikSeritAltEnUzun(enUzunSeri: number): string {
  return metin('cumle.profilKimlikSeritAltEnUzun', { enUzunSeri });
}

/** `a11y.profil.satir` — "{başlık}. {değer}" */
export function a11yProfilSatir(baslik: string, deger: string): string {
  return metin('cumle.a11yProfilSatir', { baslik, deger });
}

/** Geriye dönük: aktif dilin "o ayda" listesi — yerinde güncellenen dizi (bkz. `ayLokatif`). */
export const AY_LOKATIF: readonly string[] = takvim.ayIcinde;

/* ------------------------------------------------ main birleşmesi (2026-10-25) */

export function analizGiderPay(yuzde: number): string {
  return metin('cumle.analizGiderPay', { yuzde });
}

export function analizGelirPay(yuzde: number): string {
  return metin('cumle.analizGelirPay', { yuzde });
}

export function analizHalkaA11y(toplam: string): string {
  return metin('cumle.analizHalkaA11y', { toplam });
}

export function heroLimitKullanimA11y(yuzde: number, bugunMu: boolean): string {
  return metin('cumle.heroLimitKullanimA11y', { yuzde, bugun: bugunMu ? 'evet' : 'hayir' });
}

export function heroLimitAsimA11y(fark: string, bugunMu: boolean): string {
  return metin('cumle.heroLimitAsimA11y', { fark, bugun: bugunMu ? 'evet' : 'hayir' });
}

export function heroHarcamaA11y(tutar: string): string {
  return metin('cumle.heroHarcamaA11y', { tutar });
}

export function abonelikGecikmeGun(gun: number): string {
  return metin('cumle.abonelikGecikmeGun', { gun });
}

export function abonelikKalanGun(gun: number): string {
  return metin('cumle.abonelikKalanGun', { gun });
}

export function abonelikSilGovde(ad: string): string {
  return metin('cumle.abonelikSilGovde', { ad });
}

export function abonelikAdiylaEkle(ad: string): string {
  return metin('cumle.abonelikAdiylaEkle', { ad });
}

export function abonelikServisSayisi(adet: number): string {
  return metin('cumle.abonelikServisSayisi', { adet });
}

export function abonelikSatiriA11y(ad: string, tutar: string, durum: string): string {
  return metin('cumle.abonelikSatiriA11y', { ad, tutar, durum });
}

export function abonelikKayitliA11y(ad: string): string {
  return metin('cumle.abonelikKayitliA11y', { ad });
}

export function abonelikYenilendiyseEkleA11y(ad: string, tutar: string): string {
  return metin('cumle.abonelikYenilendiyseEkleA11y', { ad, tutar });
}

export function yarinTekAbonelikUyarisi(ad: string, tutar: string): string {
  return metin('cumle.yarinTekAbonelikUyarisi', { ad, tutar });
}

export function yarinCokluAbonelikUyarisi(adet: number, tutar: string): string {
  return metin('cumle.yarinCokluAbonelikUyarisi', { adet, tutar });
}

export function rutinAlimSayisiBugun(adet: number): string {
  return metin('cumle.rutinAlimSayisiBugun', { adet });
}

export function rutinSatiriA11y(ad: string, kategori: string, adet: number, tutar: string): string {
  return metin('cumle.rutinSatiriA11y', { ad, kategori, adet, tutar });
}

export function rutinGunlukOzeti(adet: number, tutar: string): string {
  return metin('cumle.rutinGunlukOzeti', { adet, tutar });
}

export function rutinKaldirA11y(ad: string): string {
  return metin('cumle.rutinKaldirA11y', { ad });
}

export function onboardingRutinSatiriA11y(ad: string, altYazi: string, tutar: string): string {
  return metin('cumle.onboardingRutinSatiriA11y', { ad, altYazi, tutar });
}

export function harcamaSatiriA11y(birincil: string, tutar: string, ikincil: string, limitDisi: boolean): string {
  return metin('cumle.harcamaSatiriA11y', { birincil, tutar, ikincil, limitDisi: limitDisi ? 'evet' : 'hayir' });
}

export function hesapAcA11y(eposta: string, olgu: string, baglam: string): string {
  return metin('cumle.hesapAcA11y', { eposta, olgu, baglam });
}

export function hesapEpostasiA11y(eposta: string): string {
  return metin('cumle.hesapEpostasiA11y', { eposta });
}

export function tasarrufGenelDurumA11y(tutar: string): string {
  return metin('cumle.tasarrufGenelDurumA11y', { tutar });
}

export function kategoriPayA11y(kategori: string): string {
  return metin('cumle.kategoriPayA11y', { kategori });
}

export function tasarrufDonemiA11y(donem: string): string {
  return metin('cumle.tasarrufDonemiA11y', { donem });
}

export function favoriOzet(kategori: string, tutar: string): string {
  return metin('cumle.favoriOzet', { kategori, tutar });
}

export function favoriHarcamaA11y(ad: string, ozet: string): string {
  return metin('cumle.favoriHarcamaA11y', { ad, ozet });
}

export function favoriKaldirA11y(ad: string): string {
  return metin('cumle.favoriKaldirA11y', { ad });
}

export function kategoriLimitKaldirA11y(kategori: string): string {
  return metin('cumle.kategoriLimitKaldirA11y', { kategori });
}

export function taksitKisaEtiketi(mevcut: number, toplam: number): string {
  return ` · ${metin('cumle.taksitKisaEtiketi', { mevcut, toplam })}`;
}

export function tutarDuzeltA11y(acik: boolean): string {
  return acik ? t['ui.expense.amount_editor_close'] : t['ui.expense.amount_editor_open'];
}

export function seriPencereBaslik(): string {
  return t['cumle.seriPencereBaslik'];
}

export function ekleKategoriTahmini(kategoriAdi: string): string {
  return metin('cumle.ekleKategoriTahmini', { kategoriAdi });
}

export function ozetRutinTasarrufu(tutar: string): string {
  return metin('cumle.ozetRutinTasarrufu', { tutar });
}

export function tasarrufRutinOzet(gunSayisi: number, adet: number): string {
  return metin('cumle.tasarrufRutinOzet', { gunSayisi, adet });
}

export function tasarrufRutinGunDetay(adet: number, birimTutar: string): string {
  return metin('cumle.tasarrufRutinGunDetay', { adet, birimTutar });
}

export function tasarrufRutinFazlaGun(adet: number): string {
  return metin('cumle.tasarrufRutinFazlaGun', { adet });
}
