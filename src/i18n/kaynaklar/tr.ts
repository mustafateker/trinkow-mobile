/**
 * Türkçe dil paketi — KAYNAK DİL.
 *
 * Anahtar listesinin tek kaynağı bu dosyadır: diğer 10 dil (`en.ts`, `de.ts`…)
 * aynı anahtarları taşımak zorundadır; eksik ya da fazla anahtar derleme
 * hatasıdır (bkz. `../tip.ts`). Metinler
 * ../agency/projects/trinkow/docs/content/metinler.md ile birebir.
 *
 * Şablon sözdizimi (ICU alt kümesi, bkz. `../cekirdek.ts#bicimle`):
 *  - `{tutar}` yer tutucu
 *  - `{n, plural, one {# gün} other {# gün}}` çoğul — Türkçe'de gerekmez, diğer dillerde gerekir
 *  - `{hal, select, gecildi {geçildi} other {ileride}}` seçim
 */
import type { DilPaketi } from '../tip';

export const metinler = {
  // ---- Eski metinler.ts `t` nesnesi (birebir)

  // §1 genel ve navigasyon
  'sekme.gunluk': 'Günlük',
  'sekme.kayitlar': 'Tasarruf',
  'sekme.ozet': 'Profil',
  'eylem.kaydet': 'Kaydet',
  'eylem.vazgec': 'Vazgeç',
  'eylem.sil': 'Sil',
  'eylem.kapat': 'Kapat',
  'eylem.yeniden_dene': 'Yeniden dene',
  'eylem.harcama_ekle': 'Harcama ekle',
  'eylem.tum_kategoriler': 'Tüm kategoriler',
  'eylem.tekrarla': 'Tekrarla',
  'eylem.geri': 'Geri',
  'eylem.simdi_degil': 'Şimdi değil',
  'eylem.devam': 'Devam',

  // §2 Kurulum (onboarding 1-4) — rev2-onboarding-kayit.md §8 (REV2-r1)
  'ob.sayac': '{adim}/4',
  'a11y.kurulum_ilerlemesi': 'Kurulum ilerlemesi',
  'a11y.onceki_adim': 'Önceki adıma dön',
  'ob.devam': 'Devam',
  // 1/4 niyet
  'ob.niyet.baslik': 'Hadi başlayalım',
  'ob.niyet.aciklama': 'Neyi hedefliyorsun? Günlük harcama limitini buna göre kuruyoruz.',
  'ob.niyet.tasarruf': 'Birikim yapmak',
  'ob.niyet.tasarruf.alt': 'Her ay kenara bir pay ayıracaksın.',
  'ob.niyet.takip': 'Paramı kontrol altına almak',
  'ob.niyet.takip.alt': 'Günün nereye gittiğini net göreceksin.',
  'ob.niyet.borc': 'Borcumu bitirmek',
  'ob.niyet.borc.alt': 'Kalan borcu adım adım eriteceksin.',
  'ob.niyet.ipucu': 'Birini seçince devam edebilirsin.',
  // 2/4 gelir ve gider
  'ob.butce.baslik': 'Gelir ve gider',
  'ob.butce.aciklama': 'Gelirini ve giderlerini inceleyip sana en uygun planı kuruyoruz. Hedefine en kısa yoldan ulaşırsın.',
  'ob.butce.gelir_bolum': 'Gelirin',
  'ob.butce.gider_bolum': 'Sabit giderlerin',
  'ob.butce.hedef_bolum': 'Hedefin',
  'alan.gelir': 'Aylık net gelir',
  'alan.gelir.not': 'Eline geçen tutar, kesintiden sonrası.',
  'alan.kira': 'Kira ya da aidat',
  'alan.fatura': 'Sabit faturalar',
  'alan.ulasim': 'Zorunlu ulaşım',
  'alan.kredi': 'Kredi ve taksitler',
  'alan.hedef.tasarruf': 'Aylık hedef birikim',
  'alan.hedef.borc': 'Aylık hedef borç kapatma',
  'alan.hedef.takip': 'Aylık kenara ayırmak istediğin tutar',
  'alan.hedef.not': "Zorunlu değil. Sonra Profil'den değiştirebilirsin.",
  'alan.borc': 'Kalan toplam borç',
  'alan.borc.not': 'Borcun yoksa boş bırakabilirsin.',
  'hata.gelir_bos': 'Planı kurmak için gelirini yazman gerekiyor.',
  'ob.butce.mesgul': 'Plan kuruluyor',
  'hata.butce_yazma': 'Plan kaydedilemedi.',
  'hata.butce_yazma.ek': 'Yazdıkların duruyor, yeniden deneyebilirsin.',
  'genel.yeniden_dene': 'Yeniden dene',
  // 3/4 rutinler
  'ob.rutin.baslik': 'Günlük rutinlerin',
  'ob.rutin.aciklama': 'Kahve, sigara, ulaşım gibi her gün tekrar edenler. Ekledikçe planın gerçeğe yaklaşır.',
  'ob.rutin.bolum': 'Eklediklerin',
  'ob.rutin.bos': 'Eklediğin rutinler burada sıralanır.',
  'ob.rutin.ekle': 'Rutin ekle',
  'ob.rutin.yok': 'Rutin harcamam yok',
  'ob.rutin.devam': 'Plan özetine geç',
  'ob.rutin.sheet_baslik': 'Rutin ekle',
  'ob.rutin.sheet_baslik.duzenle': 'Rutini düzenle',
  'ob.rutin.ad': 'Ne?',
  'ob.rutin.ad_ph': 'Sabah kahvesi',
  'ob.rutin.kategori': 'Kategori',
  'ob.rutin.adet': 'Günlük adet',
  'ob.rutin.fiyat': 'Birim fiyat',
  'ob.rutin.sheet_eylem': 'Rutini ekle',
  'ob.rutin.sheet_eylem.duzenle': 'Değişikliği kaydet',
  'ob.rutin.kaldir': 'Rutini kaldır',
  /** `MirrorWell`in sabit sol etiketi — `ob.rutin.ayna` ("Ayda {tutar}") şablonunun değişmeyen sözcüğü, iki sütunlu satır için ayrıştırıldı. */
  'ob.rutin.ayna_baslik': 'Ayda',
  'hata.rutin_fiyat_bos': 'Rutini kaydetmek için birim fiyat gerekiyor.',
  'ob.rutin.sonra': "Rutinleri sonra Profil → Rutinler ve Abonelikler'den değiştirebilirsin.",
  'hata.rutin_yazma': 'Rutinler kaydedilemedi.',
  'hata.rutin_yazma.ek': 'Yazdıkların duruyor, yeniden deneyebilirsin.',
  // 4/4 plan özeti
  'ob.ozet.baslik': 'Planın hazır',
  'ob.ozet.aciklama.tasarruf': 'Bu limitin altında kaldığın her gün birikimin büyür.',
  'ob.ozet.aciklama.borc': 'Bu limitin altında kaldığın her gün borcun küçülür.',
  'ob.ozet.aciklama.takip': 'Bu limitin altında kaldığın her gün planın tutar.',
  'ob.ozet.limit_etiket': 'Günlük harcama limitin',
  'ob.ozet.hesaplaniyor': 'Hesaplanıyor',
  'ob.ozet.amac': 'Amacın',
  'ob.ozet.gelir': 'Aylık gelirin',
  'ob.ozet.gider': 'Sabit giderlerin',
  'ob.ozet.rutin': 'Günlük rutinlerin',
  'ob.ozet.hedef.takip': 'Aylık kenara ayırdığın',
  'ob.ozet.nasil': 'Gelirinden sabit giderlerini ve hedefini çıkarıp 30 güne bölüyoruz.',
  'ob.ozet.rutin_not': 'Rutinlerin bu limitin içinden harcanır.',
  'ob.ozet.degistir': "Limitini Profil → Gelir ve bütçe'den her zaman değiştirebilirsin.",
  'ob.ozet.eylem': "Trinkow'u kullanmaya başla",
  'hata.kurulum': 'Kurulum tamamlanamadı.',
  'hata.kurulum.ek': 'Yeniden deneyebilirsin.',
  // Ayarlar > Plan ve profil "Maaş günü" satırı hâlâ bu iki anahtarı kullanır (kurulum artık maaş günü sormuyor).
  'ob.maas.duzensiz': 'Düzensiz geliyor',
  'ob.maas.duzensiz.not': 'Dönem 30 gün sayılır. Maaş günü değişirse ayarlardan düzeltebilirsin.',

  // §27.2 Günlük limit önerisi (Katman 1 çıkışı · K-059/5 · D-2d-3a)
  'oneri.baslik': 'Günlük limit önerimiz',
  'oneri.pul': 'Öneri',
  'oneri.alt': 'Sen onaylamadan limit olmaz.',
  'oneri.nasil.baslik': 'Nasıl hesaplandı',
  'oneri.nasil.2':
    'Yaygın bir varsayılan dağılım kullandık: %50 zorunlu, %30 sosyal ve keyfi, %20 birikim.',
  'oneri.serit.1': 'Bu sayı senin cevaplarından değil, varsayılan dağılımdan çıktı.',
  'oneri.serit.2': 'Sekiz kartı doldurursan plan kendi giderlerinle kurulur.',
  'oneri.btn.kabul': 'Limiti kabul et',
  'oneri.btn.degistir': 'Başka bir sayı yaz',
  'oneri.btn.red': 'Limitsiz devam et',
  /**
   * Denklem kutusunun mikro etiketleri — prototipte (satır 430-434) var ama
   * metinler.md §27.2 tablosunda henüz ayrı anahtar değil. PM'e bildirildi.
   */
  'oneri.denklem.sosyal': 'sosyal ve keyfi pay',
  'oneri.denklem.kalan_gun': 'kalan gün',
  'oneri.denklem.gunluk': 'günlük',

  // §23.1 E-10 Günlük — sayfalama ve gün başlığı (v4 · K-049/K-055)
  'gunluk.onceki_gun': 'Önceki gün',
  'gunluk.sonraki_gun': 'Sonraki gün',
  'gunluk.ipucu': 'Geçmiş günler solda. Sağa kaydır.',
  'gunluk.ipucu_kapat': 'İpucunu kapat',
  'gunluk.sinir.ilk_kayit': 'İlk kaydın bu gün. Daha geriye kayıt yok.',
  'gunluk.a11y.takvim': 'Gün seç',
  'gunluk.harcama_ekle': 'Harcama ekle',

  // §23.2 kapanmış (geçmiş) sayfa
  'gunluk.hero.gecmis': 'O gün harcanan',
  'gunluk.seriye_sayildi': 'Bu gün seriye sayıldı.',
  'gunluk.seriye_sayilmadi': 'Bu gün seriye sayılmadı.',
  'gunluk.liste_baslik.gecmis': 'O günün kayıtları',

  // §23.3 harcamasız gün
  'gunluk.harcamasiz.baslik': 'Harcamasız gün',
  'gunluk.harcamasiz.govde': 'O gün kayıt yok. Kayıtsız gün seriye sayılmaz.',
  'gunluk.harcamasiz.ipucu': 'Harcamasız geçtiyse işaretle, seri korunur.',
  'gunluk.harcamasiz.eylem': 'Harcamasız işaretle',
  'gunluk.harcamasiz.isaretli': 'Harcamasız gün. Seriye sayıldı.',
  'gunluk.seri_baslar.baslik': 'Seri bugün başlar',
  'gunluk.seri_baslar.govde': 'Bugün bir kayıt eklersen seri 1 gün olur.',

  // §23.4 kategoriler kartı (yalnız Bugün sayfası)
  'gunluk.grup.baslik': 'Kategoriler',
  'gunluk.grup.alt': 'Bu ay · kategori limiti',
  'gunluk.grup.bugun_yok': 'bugün kayıt yok',

  // §23.5 E-21 Seri
  'seri.baslik': 'Seri',
  /** Büyük seri sayısının altındaki birim; `{n}` = o sayı (diğer diller çoğul için kullanır: "1 day" / "5 days"). */
  'seri.hero.birim': '{n, plural, other {gün}}',
  'seri.kirildi': 'Seri dün kırıldı. Bugün yeniden başlıyor.',
  'seri.bos.govde': 'Seri henüz başlamadı. Bugüne bir kayıt ekle.',
  'seri.en_uzun': 'En uzun seri',
  'seri.en_uzun_bos': 'Henüz yok',
  'seri.duraklar': 'Duraklar',
  'seri.pencere.bos': 'Günleri yazdıkça buraya dolacak.',
  'seri.lejant.altinda': 'limit altında',
  'seri.lejant.disinda': 'limit dışı',
  'seri.lejant.kayit_yok': 'kayıt yok',
  'seri.kural.baslik': 'Seri nasıl işler',
  'seri.kural.1': 'Her gün kayıt girdiğin sürece seri sürer. Limiti aşman seriyi bozmaz.',
  'seri.kural.2': 'Kayıt yazmadığın gün sayılmaz. Harcamasız geçtiyse işaretle.',
  'seri.kapali.baslik': 'Seri kapalı',
  'seri.kapali.govde': 'Seri için günlük limit gerekir.',
  'seri.kapali.ipucu': 'Limit kurduğunda duraklar ve günler burada görünür.',
  'kutlama.kapat': 'Dokununca kapanır',
  'kutlama.a11y_kapat': 'Kutlamayı kapat',

  // §24 E-24 Gün seçici
  'gunsec.baslik': 'Gün seç',
  'gunsec.bugune_don': 'Bugüne dön',
  'gunsec.alt.kayit_yok': 'kayıt yok',
  'gunsec.lejant.altinda': 'limit altı',
  'gunsec.lejant.disinda': 'limit dışı',
  'gunsec.lejant.kayit_yok': 'kayıt yok',
  'gunsec.lejant.bugun': 'Kutunun altındaki nokta bugünü gösterir.',
  'gunsec.bos.baslik': 'Bu ayda kayıt yok',
  'gunsec.bos.govde': 'Kayıt yazdığın günler burada işaretlenir. Bugünden başlayabilirsin.',
  'gunsec.ozet.kayitli_gun': 'Kayıt yazılan gün',
  'gunsec.ozet.limit_alti': 'Limit altı gün',
  'gunsec.ozet.biriken': 'Limit altı günlerde biriken',
  'gunsec.onceki_ay': 'Önceki ay',
  'gunsec.sonraki_ay': 'Sonraki ay',
  'gunsec.onceki_ay_yok': 'Önceki ay yok',
  'gunsec.sonraki_ay_yok': 'Sonraki ay yok',

  // §4 E-11 harcama ekle
  'ekle.baslik': 'Harcama ekle',
  'ekle.tutar.etiket': 'Tutar',
  'ekle.kategori.etiket': 'Kategori',
  'ekle.odeme.etiket': 'Ödeme',
  'ekle.odeme.nakit': 'Nakit',
  'ekle.odeme.kart': 'Kart',
  'ekle.taksit.baglanti': 'Taksitli',
  'ekle.taksit.baslik': 'Kaç taksit',
  'ekle.tarih.bugun': 'Bugün',
  'ekle.tarih.dun': 'Dün',
  'ekle.not.ac': 'Not',
  'ekle.not.etiket': 'Not (isteğe bağlı)',
  'ekle.not.placeholder': 'Kısa bir not',
  'ekle.urun.placeholder': 'Ne aldın? (isteğe bağlı)',
  'ekle.sik_alinanlar': 'Sık alınanlar',

  // §27.1 E-11 ürün arama (F-18 · T-4)
  'ekle.arama.placeholder': 'Ne aldın? (isteğe bağlı)',
  'ekle.arama.grup.gecmis': 'Son kullandıkların',
  'ekle.arama.grup.katalog': 'Ürünler',
  'ekle.tutar.alt.gecmisten': 'Tutar geçen seferkinden geldi. Değiştirebilirsin.',
  'ekle.tutar.alt.katalogdan': 'Tutarı sen yaz. Fiyat tahmini yapmıyoruz.',
  'ekle.tutar.alt.kategori': 'Kategori üründen geldi. Değiştirebilirsin.',
  'ekle.hata.tutar': 'Tutar sıfırdan büyük olmalı.',
  // REV2 — 'ekle.hata.kategori' kaldırıldı: harcama-ekle'de kategori artık
  // seçilemiyor, dolayısıyla "kategori seçilmedi" hatası oluşamaz.
  'ekle.hata.yazilamadi': 'Kayıt yazılamadı. Yeniden dene.',
  'a11y.ekle.arama': 'Ürün ara, isteğe bağlı',
  'a11y.ekle.aramaTemizle': 'Aramayı temizle',
  'a11y.ekle.urunKaldir': 'Ürünü kaldır',

  // §14 hata ve doğrulama
  'hata.tutar_buyuk': 'Bu tutar çok büyük görünüyor. Kontrol et.',
  'hata.kategori_yok': 'Bir kategori seç.',
  'hata.yazma': 'Kayıt yazılamadı. Yeniden dene.',
  'hata.okuma.baslik': 'Kayıtlar açılamadı',
  'hata.okuma.govde': 'Bir şey ters gitti. Yeniden denemek çoğu zaman yeterli.',
  'hata.okuma.eylem': 'Yeniden dene',

  // §5 / §21.3 E-12 / E-13 detay ve silme
  'detay.baslik': 'Harcama',
  'detay.taksit_uyari': 'Düzenleme tüm taksit serisini etkiler.',
  'detay.tutar_kilit': 'Taksitli kayıtta tutar değiştirilemez.',
  'detay.sil_taksit': 'Taksit serisini sil',
  'detay.not.etiket': 'Not',
  'detay.sil': 'Bu harcamayı sil',
  'detay.bulunamadi.baslik': 'Bu kayıt bulunamadı',
  'detay.bulunamadi.govde': 'Silinmiş olabilir. Listeye dönebilirsin.',
  'detay.bulunamadi.eylem': 'Listeye dön',
  'sil.baslik': 'Bu taksit serisi silinecek',
  'sil.onayla': 'Sil',
  'sil.vazgec': 'Vazgeç',
  'sil.siliniyor': 'Siliniyor',

  // §21.1 E-14 kayıtlar
  'kayitlar.baslik': 'Tasarruf',
  'kayitlar.taksitleri_ac': 'Taksitli işlemleri aç',
  'kayitlar.onceki_ay': 'Önceki ay',
  'kayitlar.sonraki_ay': 'Sonraki ay',
  'kayitlar.ay_ozet_bos': '0 kayıt',
  'kayitlar.yer_tutucu.govde': 'Liste açılınca burada görünür.',
  // metinler.md §13'te anahtarsız verilen boş durum metinleri
  'bos.kayitlar.baslik': 'Kayıt yok',
  'bos.kayitlar.govde': 'Aşağıdaki butonla ilkini ekle.',
  'bos.kayitlar_ay.baslik': 'Bu ayda kayıt yok',
  'bos.kayitlar_ay.govde': 'Başka bir ay seçebilirsin.',

  // §15 toast
  'toast.silindi': 'Harcama silindi',
  'toast.geri_al': 'Geri al',
  'toast.geri_alindi': 'İşlem geri alındı',
  'toast.taksit_silindi': 'Taksit serisi silindi.',

  // §3 E-10 pano
  'pano.bugun_baslik': 'Bugün',
  'pano.liste_baslik': 'Bugünkü kayıtlar',
  'pano.kalan_kategori': 'Kategori limitleri',
  'pano.tumunu_gor': 'Tümünü gör',
  'pano.kip.takip': 'Takip',
  'pano.kip.tasarruf': 'Tasarruf',
  'pano.kip.borc': 'Borç',
  'pano.hero.takip': 'Bugün kalan',
  'pano.hero.tasarruf': 'bu ay biriken',
  'pano.hero.borc': 'kalan borç',
  /**
   * tokens.md §7.5 / §1.5 — limit dışında kahraman sayının altındaki etiket
   * birebir "limit dışı" sözcüğüdür. metinler.md'de henüz anahtarı yok;
   * PM'e bildirildi (öneri: `pano.hero.limit_disi`).
   */
  'pano.hero.limit_disi': 'Limitin üzerinde',
  'pano.alt.bos': 'Bugün henüz bir şey yazmadın.',
  'pano.limit_sorgu.govde': 'Limit gerçekçi mi. Birlikte bakalım.',
  'pano.limit_sorgu.eylem': 'Limiti gözden geçir',

  // §3.2b limitsiz varyant (`HeroPlain`)
  'pano.limitsiz.deger': 'Limit yok',
  'pano.hero.limitsiz': 'Bugün harcanan',
  'pano.liste.adet': 'kayıt',

  // §13 boş durumlar — E-10 ilk gün
  'bos.pano.baslik': 'Bugün boş',
  'bos.pano.govde': 'Henüz harcama eklemedin.',
  // CTA artık formu kategorisiz açmıyor, aşağıdaki kategori listesine kaydırıyor.
  'bos.pano.eylem': 'Kategori seç',

  // diğer ekranlardan ödünç alınan, E-10'da geçen dizeler
  'limitler.kategori_aciklama': 'Aylık. Boş bırakırsan takip edilmez.',
  'kategori.limit_ekle': 'Limit belirle',

  // §7 / §22.1 E-15 kategori detayı
  'kategori.limit_yok': 'Bu kategoride limit yok.',
  'kategori.bar_periyot': 'aylık',
  'kategori.liste_baslik': 'Bu ayki kayıtlar',
  'kategori.bos_govde': 'Bu ay bu kategoride harcama yazmadın.',

  // §8 / §21.2 E-16 özet
  'ozet.baslik': 'Özet',
  'ozet.hafta_bu': 'Bu hafta',
  'ozet.hafta_tamamlanan': 'Tamamlanan hafta',
  'ozet.onceki_hafta': 'Önceki hafta',
  'ozet.sonraki_hafta': 'Sonraki hafta',
  'ozet.hafta_toplam': 'Haftalık toplam',
  'ozet.gunluk_ortalama': 'Günlük ortalama',
  'ozet.gunluk_toplam': 'Günlük toplam',
  'ozet.en_cok': 'En çok harcadığın kategori',
  'ozet.kategori_dagilimi': 'Kategori dağılımı',
  'ozet.kucuk_harcama_baslik': '50 ₺ altı harcamalar',
  'ozet.taksitleri_gor': 'Taksitleri gör',
  /**
   * Prototipte E-16 üst sağ ikon butonunun `aria-label`'ı — metinler.md'de
   * henüz anahtarı yok (05-ozet.html satır 36). `kayitlar.taksitleri_ac` ile
   * aynı desen ("X'i aç"); PM'e bildirildi.
   */
  'ozet.limitleri_ac': 'Kategori limitlerini aç',

  // §13 E-16 boş hafta
  'bos.ozet.baslik': 'Özet için erken',
  'bos.ozet.govde': 'Birkaç kayıt sonra burada haftalık dağılımı görürsün.',

  // §9 / §22.2 E-17 limitler
  'limitler.baslik': 'Limitler',
  'limitler.gunluk': 'Günlük limit',
  'limitler.gunluk_aciklama': 'Her gün sıfırlanır. Aylık plan değildir.',
  'limitler.kategori_baslik': 'Kategori limitleri',
  'limitler.kategori_periyot': 'Aylık',
  'limitler.limit_yok': 'Limit yok',
  'limitler.limit_kaldir': 'Limiti kaldır',
  'limitler.bos_takip': 'Boş bırakılan kategori takip edilmez.',
  'limitler.kategori_bos': 'Kategori limiti koymak zorunda değilsin. Günlük limit tek başına çalışır.',
  'limitler.kategori_ekle': 'Kategori limiti ekle',
  'hata.limit_sifir': 'Limit sıfırdan büyük olmalı. Takip istemiyorsan limiti kaldır.',
  'hata.limit_negatif': 'Limit sıfırdan küçük olamaz.',
  'a11y.gunluk_limit_degistir': 'Günlük limiti değiştir',

  // §10 / §22.3 E-18 taksitler
  'taksit.baslik': 'Taksitler',
  'taksit.bu_ay_etiket': 'Bu ay',
  'taksit.aciklama': 'Taksitler girildiği güne değil, ait olduğu aya yazılır.',
  'taksit.gelecek_baslik': 'Önümüzdeki aylar',
  // REV3 (rev3-taksitler.md §9/§30) — çok kategorili düzende bölüm başlığı;
  // tek kategoride düşer (§4.2). "seri" yerine kullanıcının sözcüğü "ürün".
  'taksit.seriler_baslik': 'Süren taksitler',
  'taksit.son_taksit': 'Son taksit bu ay',
  'taksit.tumunu_goster': 'Tümünü göster',
  'bos.taksit.baslik': 'Taksitli işlem yok',
  'bos.taksit.govde': 'Kartla taksitli harcama girdiğinde burada listelenir.',
  'hata.okuma.taksit': 'Taksitler açılamadı',

  // §26/§27 D-2d-3b · Katman 2 "Seni tanıyalım" (E-25)
  'tan.baslik': 'Seni tanıyalım',
  'tan.aciklama': 'Sekiz kart. Her birini atlayabilirsin.',
  'tan.fiyat_vaadi': 'Fiyatları biz tahmin etmiyoruz.',
  'tan.fiyat_vaadi.alt': 'Ne kadar ödediğini sen yazıyorsun.',
  'tan.atla': 'Bu kartı atla',
  /** Kapı (giriş) yüzeyi "Neler soracağız" özeti — prototipte anahtarsız, PM'e bildirildi. */
  'tan.kapi.neler': 'Neler soracağız',
  'tan.kapi.aliskanlik.baslik': 'Alışkanlıklar',
  'tan.kapi.aliskanlik.alt': 'Sıklığı ve kendi ödediğin fiyatı.',
  'tan.kapi.birikim.alt': 'Gelirinin ne kadarını ayırmak istiyorsun.',
  /** Katman 2'nin birikim kartında gelir paylaşılmamışsa — prototipte örneklenmedi (yalnız E-26'da var), PM'e bildirildi. */
  'tan.birikim.gelirsiz': 'Gelirini paylaşmadığın için yüzde hesaplanamıyor. Bu kartı atlayabilirsin.',
  'a11y.tan.geri': 'Geri dön',
  'a11y.tan.kapat': 'Kapat',
  'tan.sabit.baslik': 'Sabit giderler',
  'tan.sabit.aciklama': 'Her ay kesin çıkan tutarlar. Bilmediğini boş bırak.',
  'tan.sabit.kira': 'Kira ve aidat',
  'tan.sabit.fatura': 'Faturalar',
  'tan.sabit.ulasim': 'Ulaşım ve yakıt',
  'tan.sabit.kredi': 'Kredi ve taksit',
  'tan.sabit.toplam': 'Toplam',
  'tan.girilmedi': 'Girilmedi',
  'tan.siklik.etiket': 'Ne sıklıkla',
  'tan.siklik.gun1': 'Günde 1',
  'tan.siklik.gun2': 'Günde 2',
  'tan.siklik.hafta2_3': 'Haftada 2-3',
  'tan.siklik.hafta1': 'Haftada 1',
  'tan.siklik.ay1_2': 'Ayda 1-2',
  'tan.siklik.hic': 'Hiç',
  'tan.siklik.serbest': 'Kendim yazayım',
  'tan.ayda': 'Ayda',
  'tan.kahve.baslik': 'Kahve',
  'tan.kahve.aciklama': 'Dışarıda aldığın kahve. Evde yaptığın sayılmaz.',
  'tan.kahve.fiyat': 'Bir fincan kaç lira',
  'tan.kahve.birim': 'fincan',
  'tan.sigara.baslik': 'Sigara',
  'tan.sigara.aciklama': 'Sıklığı ve kendi ödediğin fiyatı yazıyorsun.',
  'tan.sigara.fiyat': 'Bir paket kaç lira',
  'tan.sigara.birim': 'paket',
  /**
   * `tan.alkol.*` ve `tan.abonelik.*` onaylı prototipte (17-tanisma.html)
   * kart olarak ÖRNEKLENMEDİ — yalnız E-26'nın örnek verisinde adları geçiyor
   * ("Alkol · Haftada 1 × 220 ₺", "Abonelikler · Ayda 4 abonelik"). Metinler
   * sigara kartının BİREBİR kalıbından (K-053: "yargılamayan kart, aynı
   * bileşen") türetildi; PM/içerik yazarına bildirildi, metinler.md'ye
   * işlenmeli.
   */
  'tan.alkol.baslik': 'Alkol',
  'tan.alkol.aciklama': 'Sıklığı ve kendi ödediğin fiyatı yazıyorsun.',
  'tan.alkol.fiyat': 'Bir kadeh kaç lira',
  'tan.alkol.birim': 'kadeh',
  'tan.hic.not': 'Hiç dedin. Bu kart planda görünmez.',
  'tan.yemek.baslik': 'Dışarıda yemek',
  'tan.yemek.aciklama': 'Öğle yemeği, akşam yemeği, paket sipariş.',
  'tan.yemek.fiyat': 'Bir yemek kaç lira',
  'tan.yemek.birim': 'yemek',
  'tan.abonelik.baslik': 'Abonelikler',
  'tan.abonelik.aciklama': 'Dijital ve fiziksel tüm abonelikler.',
  'tan.abonelik.adet': 'Kaç abonelik',
  'tan.abonelik.ortalama': 'Ortalama aylık ücret',
  'tan.yatirim.baslik': 'Yatırım',
  'tan.yatirim.aciklama': 'Cevabın yalnız birikimini adlandırmak için.',
  'tan.yatirim.yapiyorum': 'Yapıyorum',
  'tan.yatirim.dusunuyorum': 'Yapmayı düşünüyorum',
  'tan.yatirim.ilgilenmiyorum': 'İlgilenmiyorum',
  'tan.yatirim.sinir': 'Yatırım tavsiyesi vermiyoruz.',
  'tan.yatirim.sinir.alt': 'Birikimin bir kısmını yatırım payı diye etiketleriz.',
  'tan.birikim.baslik': 'Birikim hedefi',
  'tan.birikim.aciklama': 'Sabit giderlerinden sonra kalanın içinden ayrılır.',
  'tan.birikim.etiket': 'Gelirin yüzdesi',
  'tan.birikim.sinir': 'Üst sınıra geldin. Kaydırıcı burada durur.',
  'tan.birikim.sinir.alt': 'Sosyal ve keyfi payı 0 ₺ kalır.',
  'tan.donus.baslik': 'Kaldığın yerden',
  'tan.donus.bekleyen': 'Bekleyen kartlar',
  'tan.donus.cevaplanmadi': 'Cevaplanmadı',
  'tan.donus.plan': 'Planı şimdi gör',
  'tan.donus.devam': 'Devam et',
  'tan.fiyat.bos': 'Fiyatını yaz',
  'tan.gor.plan': 'Planı gör',

  // §28 D-2d-3b · Plan (E-26)
  'plan.ustbaslik': 'Plan',
  'plan.baslik': 'Planın hazır',
  'plan.aciklama': 'Cevaplarından çıkardık. Değiştirebilirsin.',
  'plan.aylik_planin': 'Aylık planın',
  'plan.turetildi': 'Türetildi',
  'plan.pay.zorunlu': 'Zorunlu',
  'plan.pay.zorunlu.alt': 'Kira, fatura, ulaşım, kredi taksiti.',
  'plan.pay.sosyal': 'Sosyal ve keyfi',
  'plan.pay.sosyal.alt': 'Günlük limitin buradan çıkar.',
  'plan.pay.birikim': 'Birikim',
  'plan.limit.baslik': 'Günlük limit',
  'plan.limit.pano': 'Panodaki büyük sayı bu olur.',
  'plan.limit.pano.alt': 'Her gelir döneminde yeniden bölünür.',
  'plan.denklem.sosyal': 'sosyal pay',
  'plan.denklem.kalan_gun': 'kalan gün',
  'plan.denklem.gunluk': 'günlük',
  'plan.nasil': 'Nasıl hesaplandı',
  'plan.nasil.hesap': 'Hesap',
  'plan.nasil.anladim': 'Anladım',
  'plan.nasil.1': 'Sabit giderlerini topladık',
  'plan.nasil.2': 'Birikim hedefini ayırdık',
  'plan.nasil.3': 'Kalanı sosyal ve keyfi paya yazdık',
  'plan.nasil.4': 'Dönemde kalan güne böldük',
  'plan.nasil.yuvarlama': 'Hesap kuruş üzerinden yapılır.',
  'plan.nasil.yuvarlama.alt':
    'Günlük limit tam liraya aşağı yuvarlanır. Yüzdeler tam sayıya yuvarlanır, toplamı 100\'e tamamlanır.',
  'plan.aliskanlik.baslik': 'Alışkanlık maliyeti',
  'plan.aliskanlik.sag': 'Kendi fiyatlarınla',
  'plan.aliskanlik.bos': 'Alışkanlık kartlarını cevaplamadın.',
  'plan.aliskanlik.bos.alt': 'Sıklığı ve kendi fiyatını yazarsan aylık tutarı burada görürsün.',
  'plan.aliskanlik.kartlara_don': 'Kartlara dön',
  'plan.ayar.baslik': 'Payları ayarla',
  'plan.ayar.tek_kaydirici': 'Tek kaydırıcı',
  'plan.ayar.etiket': 'Birikim payı',
  'plan.ayar.not': 'Zorunlu pay sabit kalır. O senin girdiğin sabit giderlerin toplamı.',
  'plan.ayar.aralik_en_az': 'En az %0',
  'plan.gelirsiz.baslik': 'Limitini yazalım',
  'plan.gelirsiz.aciklama': 'Gelirini paylaşmadın. Yüzde planı kurulmadı.',
  'plan.gelirsiz.limit_etiket': 'Günlük limit',
  'plan.gelirsiz.elimizde_baslik': 'Elimizde ne var',
  'plan.gelirsiz.elimizde_alt': 'Gelir olmadan',
  'plan.gelirsiz.eldeki': 'Alışkanlık maliyeti gelirsiz de çalışır.',
  'plan.gelirsiz.eldeki_alt': 'Sıklığı ve fiyatı sen yazdığın için bu kart eksiksiz.',
  'plan.gelirsiz.aylik_toplam': 'Aylık alışkanlık toplamı',
  'plan.gelirsiz.limit_not': 'Günlük limitini yazarken bu sayıyı hesaba katabilirsin.',
  'plan.gelirsiz.sonra': 'Gelirini sonra da ekleyebilirsin.',
  'plan.gelirsiz.sonra_alt': 'Ayarlar, Plan ve profil bölümü. Yüzde planı o an kurulur.',
  'plan.gelirsiz.kaydet': 'Limiti kaydet',
  'plan.eksi.baslik': 'Plan bu ay kurulamadı',
  'plan.eksi.aciklama': 'Sabit giderlerin gelirinden fazla.',
  'plan.eksi.normalize': 'Bu çok rastlanan bir durum. Ölçülebilir olması iyi haber.',
  'plan.eksi.hesap': 'Hesap',
  'plan.eksi.bu_ay': 'Bu ay',
  'plan.eksi.net_gelir': 'Aylık net gelir',
  'plan.eksi.sabit_giderler': 'Sabit giderler',
  'plan.eksi.kalan_etiket': 'Kalan',
  'plan.eksi.yuzde_yok': 'Yüzde planı kalan tutar üzerine kurulur. Kalan olmadığı için pay dağılımı yazılmadı.',
  'plan.eksi.cikis_baslik': 'Çıkış yolu',
  'plan.eksi.cikis_alt': 'Seçim senin',
  'plan.eksi.uc_yol': 'Buradan üç yol var.',
  'plan.eksi.yol1': 'Giderleri gözden geçir',
  'plan.eksi.yol1.alt': 'Kredi taksiti bitiyor mu, fatura tahmini yüksek mi.',
  'plan.eksi.yol2': 'Limiti elle yaz',
  'plan.eksi.yol2.alt': 'Plan olmadan da günlük limit koyabilirsin.',
  'plan.eksi.yol3': 'Limitsiz devam et',
  'plan.eksi.yol3.alt': 'Takip etmek için plana ihtiyacın yok. Kayıt tutmak tek başına işe yarar.',
  'plan.yarim.baslik': 'Plan yarım hazır',
  'plan.yarim.aciklama': 'Dört kart boş. Eldekiyle böldük.',
  'plan.yarim.birikim': 'Hedef girmedin.',
  'plan.yarim.not': 'Birikim hedefi girmedin. Şimdilik kalanın tamamı sosyal ve keyfi payında.',
  'plan.yarim.limit_not': 'Birikim hedefi girersen bu sayı düşer.',
  'plan.yarim.kalan_kartlara_don': 'Kalan kartlara dön',
  'plan.kur': 'Planı kur',

  // §11 · §22.4 D-2c-1 · E-19 — Ayarlar
  'ayar.baslik': 'Ayarlar',
  'ayar.bildirim': 'Akşam özeti',
  'ayar.bildirim_aciklama': 'Günde en fazla bir bildirim.',
  'ayar.bildirim_saat': 'Bildirim saati',
  'ayar.bildirim_izni_kapali_not': 'Bildirim izni kapalı. Cihaz ayarlarından açabilirsin.',
  'ayar.bildirim_kapali_not': 'İzin verilene kadar akşam özeti gönderilmez.',
  'ayar.gun_siniri': 'Gün Dönümü',
  'ayar.gun_siniri_aciklama': 'Günlük limitin bu saatte sıfırlanır.',
  'ayar.gun_siniri.0': '00.00',
  'ayar.gun_siniri.3': '03.00',
  'ayar.gun_siniri.6': '06.00',
  'ayar.varsayilan_odeme': 'Varsayılan ödeme',
  'ayar.odeme_aciklama': 'Yeni harcama bu seçimle açılır.',
  'ayar.kip': 'Hedef',
  'ayar.kip_aciklama': 'Trinkow’u hangi amaçla kullandığını belirler.',
  'ayar.kip_degistir': 'Hedef seç',
  'ayar.plan.baslik': 'Plan ve profil',
  'ayar.plan.aciklama': 'Plan cevaplarından çıkar. İstediğin an değiştir.',
  'ayar.plan.gelir': 'Aylık net gelir',
  'ayar.plan.gelir_girilmedi': 'Girilmedi',
  // "Maaş günü" bilinçli tutuldu: burada gelirin GÜNÜ soruluyor, "gelir günü" ifadesi kavramı bulanıklaştırır.
  'ayar.plan.maas_gunu': 'Maaş günü',
  'ayar.plan.gelirsiz': 'Gelirini girmedin. Plan onsuz kurulmuyor.',
  'ayar.plan.tanit': 'Seni tanıyalım',
  'ayar.plan.gor': 'Planı gör',
  'ayar.hesap.baslik': 'Hesap',
  'ayar.hesap.aciklama': 'Hesap yalnız seni tanımak için.',
  'ayar.hesap.eposta': 'E-posta',
  'ayar.hesap.saglayici.google': 'Google ile bağlı.',
  'ayar.hesap.saglayici.apple': 'Apple ile bağlı.',
  'ayar.hesap.saglayici.sifre': 'Şifre ile bağlı.',
  'ayar.hesap.cikis': 'Çıkış yap',
  'ayar.hesap.cikis_not': 'Çıkınca kayıtların hesabında kalır.',
  'ayar.hesap.sil': 'Hesabı sil',
  'ayar.hesap.kapali': 'Hesap zorunlu. Kayıtların hesabında kalır.',
  'ayar.hesap.kapali_kapi': 'Oturum aç ya da hesap oluştur',

  // §25 D-2c-2 · E-22 Oturum aç · E-23/E-16 Hesap oluştur (metinler.md §25)
  // `hesap.mahremiyet` / `.ek` / `kayit.yasal` REV2'de kaldırıldı (§7 delta
  // tablosu — Mustafa kararı, PM onaylı): mahremiyet şeridi düştü, tek
  // pasif onay cümlesi yerine iki ayrı `Checkbox` geldi.
  'giris.ayirac': 'ya da',
  'giris.hesapsiz': 'Hesapsız devam et',
  'giris.sosyal.apple': 'Apple ile Devam Et',
  'giris.sosyal.google': 'Google ile devam et',
  'alan.eposta': 'E-posta',
  'alan.eposta_ph': 'ornek@eposta.com',
  'alan.sifre': 'Şifre',
  'alan.sifre_ph.giris': 'Şifreni yaz',
  'alan.sifre_ph.kayit': 'Şifre belirle',
  'alan.sifre.gorunur': 'Şifreyi göster',
  'alan.sifre.gizli': 'Şifreyi gizle',
  'giris.baslik': 'Oturum aç',
  'giris.test_modu': 'Test modu: herhangi bir ad ve şifreyle giriş yapabilirsin. Aynı ad, aynı test hesabını açar.',
  'giris.sifirlama_yok': 'Şifre sıfırlama henüz kullanıma açık değil.',
  'giris.sosyal_yok': 'Bu giriş yöntemi henüz kullanıma açık değil. E-posta alanıyla devam edebilirsin.',
  'giris.oturum_dogrulanamadi': 'Bağlantı kurulamadı. Yeniden giriş yapmayı dene.',
  'giris.eylem': 'Oturum aç',
  'giris.mesgul': 'Oturum açılıyor',
  'giris.unuttum': 'Şifremi unuttum',
  'giris.kayit_kapisi': 'Hesap oluştur',
  'hata.eposta_bicim': 'Geçerli bir e-posta yaz.',
  'hata.kimlik': 'E-posta ya da şifre yanlış. Yeniden dene.',
  'hata.eposta_bos': 'Önce e-postanı yaz.',
  'hata.baglanti.giris': 'Oturum açmak için bağlantı gerekir.',
  'sifirla.baslik': 'Bağlantıyı gönderdik',
  'sifirla.ipucu': 'Gelmediyse istenmeyen klasörüne bak.',
  'sifirla.yeniden': 'Yeniden gönder',
  'sifirla.bekle': '60 saniye sonra yeniden gönderebilirsin.',
  'sifirla.geri': 'Oturum açmaya dön',
  'kayit.baslik': 'Hesap oluştur',
  'kayit.eylem': 'Hesap oluştur',
  'kayit.mesgul': 'Hesap oluşturuluyor',
  'kayit.sifre_kural': 'En az 8 karakter.',
  'kayit.sifre_kural_tamam': 'Uzunluk yeterli.',
  'alan.sifre_tekrar': 'Şifre tekrar',
  'alan.sifre_tekrar_ph': 'Şifreyi yeniden yaz',
  'hata.sifre_eslesmiyor': 'İki şifre aynı değil. Yeniden yaz.',
  'kayit.onay.kosullar': 'Kullanım şartlarını okudum, kabul ediyorum.',
  'kayit.onay.gizlilik': 'Gizlilik politikasını okudum, kabul ediyorum.',
  'kayit.belge.kosullar': 'Kullanım şartları',
  'kayit.belge.gizlilik': 'Gizlilik politikası',
  'kayit.onay.ipucu': 'İki onayı da işaretleyince hesabını oluşturabilirsin.',
  'a11y.onay.kosullar': 'Kullanım şartlarını kabul et',
  'a11y.onay.gizlilik': 'Gizlilik politikasını kabul et',
  'a11y.belge.kosullar': 'Kullanım şartları belgesini aç',
  'a11y.belge.gizlilik': 'Gizlilik politikası belgesini aç',
  'hata.onay_gerekli': 'Devam etmek için iki onay da gerekiyor.',
  'kayit.giris_kapisi.soru': 'Hesabın var mı',
  'kayit.giris_kapisi.aksiyon': 'Oturum aç',
  'hata.eposta_kayitli': 'Bu e-posta ile hesap var. Oturum aç.',
  'hata.baglanti.kayit': 'Hesap açmak için bağlantı gerekir.',
  'hata.baglanti.kayit.ek': 'Yazdıkların duruyor.',

  'hesapsil.baslik': 'Hesabın silinecek',
  'hesapsil.govde': 'Geri alınamaz. Bu e-posta ile bir daha oturum açamazsın.',
  'hesapsil.eylem': 'Hesabı sil',
  'ayar.veri': 'Veri',
  'ayar.veri_aciklama': 'Kayıtların hesabında kalır. İstediğin an hepsini silebilirsin.',
  'ayar.veri_sil': 'Tüm verileri sil',
  'ayar.veri_sil_baslik': 'Tüm kayıtların silinecek',
  'ayar.veri_sil_govde': 'Geri alınamaz. Limitlerin ve kurulumun kalır.',
  'ayar.surum': 'Sürüm {surum}',

  // §12 · §22.5 D-2c-1 · E-20 — Aşamalı profilleme (F-12). K-061/3: gelir sorusu
  // (`prof.gelir`) EMEKLİYE AYRILDI, kodlanmadı — bkz. task brief madde 4.
  'prof.yatirim': 'Yatırım yapıyor musun?',
  'prof.taksit': 'Taksitli alışveriş yapar mısın?',
  'prof.taksit.sik_sik': 'Sık sık',
  'prof.taksit.bazen': 'Bazen',
  'prof.taksit.nadiren': 'Neredeyse hiç',
  'prof.bildirim': 'Akşam kısa bir özet göndereyim mi?',
  'prof.bildirim.gonder': 'Gönder',
  'prof.bildirim.gonderme': 'Gönderme',
  'prof.aciklama': 'Cevabın panonu sana göre ayarlar.',
  'prof.simdi_degil': 'Şimdi değil',
  'prof.degisti': 'Cevabına göre eklendi. Ayarlardan kaldırabilirsin.',
  'a11y.prof.kapat': 'Profilleme sorusunu kapat',

  // §28 rev2-tasarruf-profil.md — E-27 Tasarruf (28.1)
  'tasarruf.baslik': 'Tasarruf',
  /** Prototipte var, §28.1 tablosunda anahtarsız kalmış (PM'e raporlanmıştır). */
  'tasarruf.ustSatir.hata': 'Tasarruf verisi',
  'tasarruf.kip.cip': 'Tasarruf',
  'tasarruf.gosterge.etiket': 'bu ay biriken',
  'tasarruf.gosterge.etiketDisinda': 'bütçe dışı',
  'tasarruf.gosterge.ayYeni': 'Ay yeni başladı. İlk tamamlanan günle hesap başlar.',
  'tasarruf.gosterge.hesaplaniyor': 'Hesaplanıyor',
  'tasarruf.gelirYok.baslik': 'Gelirini ekle',
  'tasarruf.gelirYok.alt': 'Aylık gelirini yazınca bu ayın payını hesaplarız.',
  'tasarruf.gelirYok.btn': 'Bütçeyi düzenle',
  'tasarruf.motivasyon.birikim': 'Bu tutarı birikim hedefin için ayırmayı düşünebilirsin.',
  'tasarruf.butce.baslik.buAy': 'Bu ayın bütçesi',
  'tasarruf.butce.baslik.gecmisAy': 'Ayın bütçesi',
  'tasarruf.butce.harcanabilir': 'Harcanabilir',
  'tasarruf.butce.harcanan': 'Harcanan',
  'tasarruf.butce.kalan': 'Kalan',
  'tasarruf.butce.disinda': 'Bütçe dışı',
  'tasarruf.butce.gunSayaci': 'Tamamlanan gün',
  'tasarruf.birikim.baslik': 'Gerçek birikim',
  'tasarruf.birikim.ayYok.buAy': 'Bu ay kayıt yok',
  'tasarruf.birikim.hedefYok': 'Hedef koymadın',
  'tasarruf.birikim.hedefBtn': 'Hedef koy',
  'tasarruf.birikim.ekleBtn': 'Birikim hareketi ekle',
  'tasarruf.hareket.baslik': 'Birikim hareketleri',
  'tasarruf.hareket.eklendi': 'Birikime eklendi',
  'tasarruf.hareket.cekildi': 'Birikimden çekildi',
  'tasarruf.hareket.cekildiEtiket': 'çekildi',
  'tasarruf.hareket.tumu': 'Tüm hareketler',
  'tasarruf.hareket.bos.baslik': 'Birikim kaydı yok',
  'tasarruf.hareket.bos.alt.buAy': 'Kenara para ayırdığında buraya yazarsın.',
  'tasarruf.kategori.baslik': 'Kategori dağılımı',
  'tasarruf.kategori.tumu': 'Tümünü gör',
  'tasarruf.kategori.bos.buAy': 'Bu ay henüz harcama yazmadın.',
  'tasarruf.kategori.bos.alt': 'İlk kaydından sonra kategori payları burada görünür.',
  'tasarruf.rutin.baslik': 'Rutin tasarrufu',
  'tasarruf.rutin.alt': 'Vazgeçtiğin rutinler. Bütçedeki kalana eklenmez.',
  'tasarruf.rutin.bos.buAy': 'Bu ay vazgeçtiğin rutin yok.',
  'tasarruf.rutin.hicYok': 'Rutin eklemedin. Vazgeçtiğin harcamalar burada toplanır.',
  'tasarruf.rutin.btn': 'Rutinleri aç',
  'tasarruf.hata.baslik': 'Bilgiler yüklenemedi',
  'tasarruf.hata.alt': 'Bağlantını kontrol edip yeniden dene.',
  'tasarruf.hata.btn': 'Yeniden dene',

  'birikimSheet.baslik.ekle': 'Birikim hareketi',
  'birikimSheet.baslik.duzenle': 'Hareketi düzenle',
  'birikimSheet.segment.ekle': 'Ekledim',
  'birikimSheet.segment.cek': 'Çektim',
  'birikimSheet.tutar': 'Tutar',
  'birikimSheet.tarih': 'Tarih',
  'birikimSheet.not': 'Not',
  'birikimSheet.notPlaceholder': 'İsteğe bağlı',
  'birikimSheet.kaydet': 'Kaydet',
  'birikimSheet.kaydediliyor': 'Kaydediliyor',
  'birikimSheet.sil': 'Sil',
  'birikimSheet.hata.tutarBos': 'Tutar boş kalamaz.',
  'birikimSheet.hata.bakiye': 'Birikimin bu kadar düşmez. Tutarı azalt.',
  'birikimSheet.hata.ileriTarih': 'Tarih ileri bir gün olamaz.',
  'birikimSheet.hata.ag': 'Kaydedilemedi. Yeniden dene.',

  'a11y.tasarruf.gosterge': 'Bu ayın biriken payı',
  'a11y.tasarruf.kipCip': 'Kip: Tasarruf. Değiştirmek için ayarları aç',
  'a11y.tasarruf.oncekiAy': 'Önceki ay',
  'a11y.tasarruf.sonrakiAy': 'Sonraki ay',
  'a11y.tasarruf.hareketSil': 'Bu hareketi sil',

  // §28.3 rev2-tasarruf-profil.md §3.12 — E-27 akordiyon başlıkları/özetleri (REV3)
  'tasarruf.bolum.butce': 'Bu ayın bütçesi',
  'tasarruf.bolum.butceGecmis': 'Ayın bütçesi',
  'tasarruf.bolum.birikim': 'Gerçek birikim',
  'tasarruf.bolum.kategori': 'Kategori dağılımı',
  'tasarruf.bolum.rutin': 'Rutin tasarrufu',
  'tasarruf.ozet.butceGelirYok': 'Gelir eksik',
  'tasarruf.ozet.kategoriYok': 'Harcama yok',
  'tasarruf.ozet.rutinYok': 'Rutin eklemedin',
  'tasarruf.ozet.acilamadi': 'Açılamadı',
  'tasarruf.bolum.sonHareketler': 'Son hareketler',
  'tasarruf.butce.gelirYokSatir': 'Gelirini yazınca harcanabilir, harcanan ve kalan burada görünür.',
  'tasarruf.birikim.acilamadi': 'Birikim kayıtları açılamadı.',
  'tasarruf.rutin.tutarEtiket': 'Vazgeçtiğin rutinler',
  'tasarruf.rutin.kural': 'Bütçedeki kalana eklenmez.',

  // §29 rev3-gunluk-rutin.md — E-10 Günlük rutin hızlı eylem satırı (REV3)
  'gunlukRutin.baslik': 'Rutinler ve Abonelikler',
  'gunlukRutin.aldim': 'Aldım',
  'gunlukRutin.almadim': 'Almadım',
  'gunlukRutin.durum.almadim': 'Vazgeçtin · rutin tasarrufu',
  'gunlukRutin.tumu': 'Tüm rutinleri yönet',
  'gunlukRutin.toast.geriAl': 'Geri al',
  'gunlukRutin.hata.isaret': 'Rutin harcaması kaydedilemedi. Yeniden dene.',

  // §28.2 — E-28 Profil
  'profil.baslik': 'Profil',
  'profil.ustSatir': 'Hesabın ve planın',
  'profil.kimlik.saglayici.google': 'Google ile oturum açıldı',
  'profil.kimlik.saglayici.apple': 'Apple ile oturum açıldı',
  /** Spesifikasyonda tanımsız (yalnız google/apple yazıyor) — aynı kalıbın
   * e-posta/şifre hesabına genellemesi; PM'e raporlanmıştır. */
  'profil.kimlik.saglayici.eposta': 'E-posta ile oturum açıldı',
  'profil.kimlik.hesapsiz.baslik': 'Hesapsız kullanıyorsun',
  'profil.kimlik.hesapsiz.alt': 'Harcamaların telefonunda kalır.',
  'profil.kimlik.hesapsiz.btn': 'Oturum aç',
  'profil.kimlik.hata.baslik': 'Hesap bilgisi açılamadı',
  'profil.kimlik.hata.alt': 'Ayarların ve yasal metinler açık kalır.',
  'profil.kimlik.hata.btn': 'Yeniden dene',
  'profil.kimlik.serit.yok': 'Seri bekliyor',
  'profil.kimlik.serit.yokAlt': 'İlk kaydınla ilk gün sayılır.',
  'profil.kimlik.serit.altRekor': 'En uzun serin bu.',
  /** Kapanış QA düzeltmesi — `ayarVerisi` ağ hatasında (data===null) Planın/
   * Kayıt kolaylıkları grupları tek `ErrorState` ile değişir; boş-durum
   * metinleriyle karıştırılmaz (`ayarGorunumu.ts`). */
  'profil.ayarlar.hata.baslik': 'Ayar bilgilerin açılamadı',
  'profil.ayarlar.hata.alt': 'Bağlantını kontrol edip yeniden dene.',
  'profil.grup.plan': 'Planın',
  'profil.grup.kayit': 'Kayıt kolaylıkları',
  'profil.grup.takip': 'Takip',
  'profil.grup.uygulama': 'Uygulama',
  'profil.satir.butce': 'Gelir ve bütçe',
  'profil.satir.limitler': 'Limitler',
  'profil.satir.limitlerBos': 'Günlük ve kategori limitlerini belirle',
  /** Yalnız veri okunamadığında (ağ hatası) — spesifikasyonda tanımsız üç
   * satır için inferred fallback, PM'e raporlanmıştır. */
  'profil.satir.butceBos': 'Aylık gelirini ve bütçeni belirle',
  'profil.satir.rutinlerBos': 'Rutinlerini ve aboneliklerini buradan yönet',
  'profil.satir.favorilerBos': 'Sık kullandığın harcamaları kaydet',
  'profil.satir.taksitlerBos': 'Taksitli harcamalarını buradan takip et',
  'profil.satir.rutinler': 'Rutinler ve Abonelikler',
  'profil.satir.favoriler': 'Favoriler',
  'profil.satir.taksitler': 'Taksitler',
  'profil.satir.ozet': 'Aylık özet',
  'profil.satir.ozetDeger': 'Kategori payları ve haftalık ritim',
  'profil.satir.seri': 'Seri',
  'profil.satir.ayarlar': 'Tüm ayarlar',
  'profil.satir.ayarlarDeger': 'Hesap, bildirim, gün sınırı, yasal',
  'profil.satir.yardim': 'Yardım',
  'profil.satir.yardimDeger': 'Sık sorulan sorular',
  'profil.alt.sartlar': 'Kullanım şartları',
  'profil.alt.gizlilik': 'Gizlilik',

  'a11y.profil.ayarlar': 'Ayarları aç',
  'a11y.profil.sartlar': 'Kullanım şartlarını aç',
  'a11y.profil.gizlilik': 'Gizlilik metnini aç',


  // ---- Cümle şablonları (eski metinler.ts fonksiyonları; {parametre} yer tutucuları)
  /** `Bugün {harcanan}. Limitinin {fark} altındasın.` */
  'cumle.altAltinda': 'Bugün {harcanan}. Limitinin {fark} altındasın.',
  /** `Günlük limitin doldu. Bugün {harcanan}.` */
  'cumle.altDoldu': 'Günlük limitin doldu. Bugün {harcanan}.',
  /** `Limitin {fark} üzerindesin.` */
  'cumle.altDisinda': 'Limitin {fark} üzerindesin.',
  /** `pano.limitsiz.ozet` — "Bugün {adet} kayıt yazdın. Limit koymadığın için kalan gösterilmiyor." */
  'cumle.panoLimitsizOzet': 'Bugün {adet} kayıt yazdın. Limit koymadığın için kalan gösterilmiyor.',
  /** `ob.sayac` — "{adim}/4" (kurulum başlık çubuğunun tek metni, §2.1). */
  'cumle.obSayac': '{adim}/{toplam}',
  /** `ob.rutin.gunluk_toplam` — "Günlük {tutar}" (3/4 bölüm başlığının sağı). */
  'cumle.obRutinGunlukToplam': 'Günlük {tutar}',
  /** `ob.rutin.satir_alt` — "Her gün {adet} × {fiyat}" (`RoutineRow` alt yazısı). */
  'cumle.obRutinSatirAlt': 'Her gün {adet} × {fiyat}',
  /** `ob.rutin.ayna` — "Ayda {tutar}" (`MirrorWell` üst satırı). */
  'cumle.obRutinAyna': 'Ayda {tutar}',
  /** `ob.rutin.ayna_formul` — "Her gün {adet} × {fiyat} × 30 gün" (`MirrorWell` formülü). */
  'cumle.obRutinAynaFormul': 'Her gün {adet} × {fiyat} × 30 gün',
  /** `Günlük limit {tutar}` — kahraman kartın sağ üst etiketi (prototip). */
  'cumle.gunlukLimitEtiketi': 'Günlük limit {tutar}',
  /** `Günlük toplam {tutar}` — `kayitlar.gun_toplam` */
  'cumle.gunToplamEtiketi': 'Günlük toplam {tutar}',
  /** `Bu ay {sira}. limit aşımı` — `pano.limit_sorgu.baslik` */
  'cumle.limitSorguBasligi': 'Bu ay {sira}. limit aşımı',
  /** `ekle.taksit.onizleme` — "Ayda {tutar} · {ay} ay" */
  'cumle.ekleTaksitOnizleme': 'Ayda {tutar} · {ay} ay',
  /** `ekle.limit_disi_uyari` — "Bu harcama günlük limitin {fark} üzerine çıkarır." */
  'cumle.ekleLimitDisiUyari': 'Bu harcama günlük limitin {fark} üzerine çıkarır.',
  /** `toast.kaydedildi` — "{tutar} kaydedildi" */
  'cumle.toastKaydedildi': '{tutar} kaydedildi',
  /** `toast.kaydedildi_limit_disi` — "{tutar} kaydedildi · {fark} limit dışı" */
  'cumle.toastKaydedildiLimitDisi': '{tutar} kaydedildi · {fark} limit dışı',
  /** `toast.tekrarlandi` — "{tutar} yeniden eklendi" (Akış C · Latte Faktörü) */
  'cumle.toastTekrarlandi': '{tutar} yeniden eklendi',
  /** `detay.taksit_bilgi` — "{mevcut}/{toplam} taksit · her ay {tutar}" */
  'cumle.detayTaksitBilgi': '{mevcut}/{toplam} taksit · her ay {tutar}',
  /** `sil.govde_taksit` — "Kalan {adet} taksit de silinecek. Geri alınamaz." */
  'cumle.silGovdeTaksit': 'Kalan {adet} taksit de silinecek. Geri alınamaz.',
  /** `kayitlar.gun_toplam_limit_disi` — "{tutar} · limit dışı" */
  'cumle.kayitlarGunToplamLimitDisi': '{tutar} · limit dışı',
  /** `kayitlar.ay_ozet` — "{adet} kayıt · {tutar}" */
  'cumle.kayitlarAyOzeti': '{adet} kayıt · {tutar}',
  /** `kayitlar.yer_tutucu.baslik` — "{ay} kayıtları" */
  'cumle.kayitlarYerTutucuBasligi': '{ay} kayıtları',
  /** `kategori.bu_ay` — "Bu ay {tutar}" */
  'cumle.kategoriBuAy': 'Bu ay {tutar}',
  /** `kategori.limit_ust` — "Aylık limit {tutar}" */
  'cumle.kategoriLimitUst': 'Aylık limit {tutar}',
  /** `kategori.limit_disi` — "Aylık limitin {fark} üzerinde" */
  'cumle.kategoriLimitDisi': 'Aylık limitin {fark} üzerinde',
  /** `kategori.ortalama` — "Günlük ortalama {tutar}. Tahmini." */
  'cumle.kategoriOrtalama': 'Günlük ortalama {tutar}. Tahmini.',
  /** `kategori.adet` — "{adet} kayıt" */
  'cumle.kategoriAdet': '{adet} kayıt',
  /** boş durum başlığı — "{kategori} için kayıt yok" */
  'cumle.kategoriBosBaslik': '{kategoriAdi} için kayıt yok',
  /** `a11y.kategori_gun` — "{gun} {ay}" (E-15 satır erişilebilirliği) */
  'cumle.kategoriGunEtiketi': '{gun} {ay}',
  /** `ozet.hafta_araligi` biçiminde tarih aralığı zaten `lib/tarih.ts#haftaAraligi`de. */
  /** `ozet.gecen_gun_ortalama` — "Geçen {adet} günün ortalaması" */
  'cumle.ozetGecenGunOrtalama': 'Geçen {adet} günün ortalaması',
  /** `ozet.limit_cizgisi` — "günlük limit {tutar}" */
  'cumle.ozetLimitCizgisi': 'günlük limit {tutar}',
  /** `ozet.limit_alti_gun` — "Bu hafta {adet} gün limit altında." */
  'cumle.ozetLimitAltiGun': 'Bu hafta {adet} gün limit altında.',
  /** `ozet.limit_disi_gun` — "Bu hafta {adet} gün limit dışı." */
  'cumle.ozetLimitDisiGun': 'Bu hafta {adet} gün limit dışı.',
  /** `ozet.en_cok` + kategori adı — "En çok harcadığın kategori {kategori}" */
  'cumle.ozetEnCok': 'En çok harcadığın kategori {kategoriAdi}',
  /** `ozet.dagilim_gun` — "{adet} gün" */
  'cumle.ozetDagilimGun': '{adet} gün',
  /** `ozet.pay` — "%{oran}" */
  'cumle.ozetPay': '%{oran}',
  /** `ozet.kucuk_harcama_alt` — "{adet} harcama · ortalama {tutar}" */
  'cumle.ozetKucukHarcamaAlt': '{adet} harcama · ortalama {ortalama}',
  /** `ozet.taksit_yuku` — "Önümüzdeki ay taksit yükü {tutar}" */
  'cumle.ozetTaksitYuku': 'Önümüzdeki ay taksit yükü {tutar}',
  /** `ozet.limit_sorgu.baslik` — "Günlük limit {tutar}" */
  'cumle.ozetLimitSorguBasligi': 'Günlük limit {tutar}',
  /**
   * `pano.taksit_yuku.alt` (§22.5) — "{adet} seri sürüyor. Sonuncusu {ayYil}
   * tarihinde bitiyor." E-16'daki taksit yükü kartı da aynı cümleyi kullanır
   * (E-10 ve E-16 aynı kavramı — gelecek ayın taksit yükünü — anlatır).
   */
  'cumle.taksitYukuAltMetni': '{adet} seri sürüyor. Sonuncusu {ayYil} tarihinde bitiyor.',
  /** `limitler.toplam_notu` — "Kategori limitleri toplamı {tutar}. Günlük limitinle karşılaştır." */
  'cumle.limitlerToplamNotu': 'Kategori limitleri toplamı {tutar}. Günlük limitinle karşılaştır.',
  /** `limitler.su_anki` — "Şu anki limitin {tutar}." */
  'cumle.limitlerSuAnki': 'Şu anki limitin {tutar}.',
  /** `toast.limit_kaldirildi` — "{kategori} limiti kaldırıldı" */
  'cumle.toastLimitKaldirildi': '{kategoriAdi} limiti kaldırıldı',
  /** `toast.limit_guncellendi` — "Günlük limit {tutar} olarak güncellendi" */
  'cumle.toastLimitGuncellendi': 'Günlük limit {tutar} olarak güncellendi',
  /** `a11y.kategori_limit_degistir` — "{kategori} limitini değiştir" */
  'cumle.a11yKategoriLimitDegistir': '{kategoriAdi} limitini değiştir',
  /** `a11y.kategori_limit_kaldir` — "{kategori} limitini kaldır" */
  'cumle.a11yKategoriLimitKaldir': '{kategoriAdi} limitini kaldır',
  /** `taksit.gelecek` — "{ay} ayında {tutar}" */
  'cumle.taksitGelecek': '{ay} ayında {tutar}',
  /** `taksit.kalan_toplam` — "Kalan toplam {tutar}. Sonuncusu {ayYil} tarihinde bitiyor." */
  'cumle.taksitKalanToplam': 'Kalan toplam {tutar}. Sonuncusu {ayYil} tarihinde bitiyor.',
  /** `taksit.seri_bitti` — ürün adı yoksa yedek: "{kategori} serisi {ay} ayında bitti. Aylık yük {tutar} düştü." */
  'cumle.taksitSeriBitti': '{kategoriAdi} serisi {ay} ayında bitti. Aylık yük {tutar} düştü.',
  /** REV3 §30.2 `taksit.seri_bitti_urun` — "{urun} taksidi {ay} ayında bitti. Aylık yük {tutar} düştü." */
  'cumle.taksitSeriBittiUrun': '{urunAdi} taksidi {ay} ayında bitti. Aylık yük {tutar} düştü.',
  /** REV3 §30.2 `taksit.ozet_kategorili` — çok kategorili bölüm başlığının sağı: "{n} kategori · {n} ürün". */
  'cumle.taksitOzetKategorili': '{kategoriSayisi} kategori · {urunSayisi} ürün',
  /** REV3 §30.2 `taksit.ozet_tek_kategori` — tek kategoride bölüm başlığının sağı: "{n} ürün". */
  'cumle.taksitOzetTekKategori': '{urunSayisi} ürün',
  /** REV3 §30.2 `taksit.kategori_ozet` — kapalı kategori akordiyonunun özeti: "{tutar} · {n} ürün". */
  'cumle.taksitKategoriOzet': '{tutar} · {urunSayisi} ürün',
  /** REV3 §30.2 `taksit.seri_kalan` — ürün satırının ikincil satırı: "{mevcut}/{toplam} · kalan {tutar}". */
  'cumle.taksitSeriKalan': '{mevcut}/{toplam} · kalan {kalanTutar}',
  /** REV3 §30.2 `taksit.urun_yok` — ürün adı boş kaydedilmiş serinin satır başlığı: "{Kategori} taksidi". */
  'cumle.taksitUrunYok': '{kategoriAdi} taksidi',
  /** REV3 §30.4 `a11y.taksit.kategori` — "{kategori}. {tutar}, {n} ürün". */
  'cumle.a11yTaksitKategori': '{kategoriAdi}. {tutar}, {urunSayisi} ürün',
  /** REV3 §30.4 `a11y.taksit.seri` — "{urun}. Bu ay {tutar}. {mevcut}. taksit, {toplam} taksitten. Kalan {kalan}. Ayrıntıyı aç" */
  'cumle.a11yTaksitSeri': '{urunAdi}. Bu ay {tutar}. {mevcut}. taksit, {toplam} taksitten. Kalan {kalanTutar}. Ayrıntıyı aç',
  /** REV3 §30.4 `a11y.taksit.seri_son` — "{urun}. Bu ay {tutar}. Son taksit. Ayrıntıyı aç" */
  'cumle.a11yTaksitSeriSon': '{urunAdi}. Bu ay {tutar}. Son taksit. Ayrıntıyı aç',
  /** REV3 §30.4 `a11y.taksit.tumunu_goster` — "{n} ürünün tamamını göster" */
  'cumle.a11yTaksitTumunuGoster': '{urunSayisi} ürünün tamamını göster',
  /** `gunluk.o_gun_limiti` — "O gün limiti {tutar}" */
  'cumle.gunlukOGunLimiti': 'O gün limiti {tutar}',
  /** `gunluk.gun_kapandi` — "Gün kapandı. {adet} kayıt, {tutar}." */
  'cumle.gunlukGunKapandi': 'Gün kapandı. {adet} kayıt, {tutar}.',
  /** `gunluk.gun_kapandi_disinda` — "Gün kapandı. {tutar}, limitin {fark} üzerinde." */
  'cumle.gunlukGunKapandiDisinda': 'Gün kapandı. {tutar}, limitin {fark} üzerinde.',
  /** `seri.cip` a11y — "Seri {n} gün. Seri ekranını aç" · görünen etiket "Seri {n} gün" */
  'cumle.seriCipEtiketi': 'Seri {n} gün',
  'cumle.seriCipA11y': 'Seri {n} gün. Seri ekranını aç',
  /** `gunluk.grup.bugun` / `.kalan` / `.limit_disi` — kategori satırı ikincil bilgisi */
  'cumle.gunlukGrupBugun': 'bugün {tutar}',
  'cumle.gunlukGrupKalan': 'kalan {tutar}',
  'cumle.gunlukGrupLimitDisi': '{tutar} limit dışı',
  /** `gunluk.a11y.gruba_ekle` — "{kategori} kategorisine harcama ekle" */
  'cumle.gunlukA11yGrubaEkle': '{kategoriAdi} kategorisine harcama ekle',
  /** `seri.aktif.govde` — "{n} gündür kayıt giriyorsun." */
  'cumle.seriAktifGovde': '{n} gündür kayıt giriyorsun.',
  /** `seri.durak.kalan` — "{n} gün kaldı" */
  'cumle.seriDurakKalan': '{n} gün kaldı',
  /** `seri.durak.sonraki` — "Sıradaki durak {n} gün" */
  'cumle.seriDurakSonraki': 'Sıradaki durak {n} gün',
  /** `seri.durak.a11y` — "{n} gün durağı geçildi / sırada / ileride" */
  'cumle.seriDurakA11y': '{n} gün durağı {hal, select, gecildi {geçildi} sirada {sırada} other {ileride}}',
  /** `seri.gun.a11y` — "{g} {Ay}, limit altında / limit dışı / kayıt yok" */
  'cumle.seriGunA11y': '{gunAy}, {durum, select, altinda {limit altında} disinda {limit dışı} other {kayıt yok}}',
  /** `kutlama.baslik` — "{n} gün" */
  'cumle.kutlamaBaslik': '{n} gün',
  /** `kutlama.govde` — "Seri {n} güne ulaştı. Sıradaki durak {m} gün." (son durak: "Sıradaki durak yok.") */
  'cumle.kutlamaGovde': 'Seri {n} güne ulaştı. Sıradaki durak {sonrakiDurak} gün.',
  'cumle.kutlamaGovde.son': 'Seri {n} güne ulaştı.',
  /** `gunsec.alt.kayitli` — "{n} gün kayıtlı" */
  'cumle.gunsecAltKayitli': '{n} gün kayıtlı',
  /** `gunsec.alt.acik_gun` — "Açık gün {g} {Ay}" */
  'cumle.gunsecAltAcikGun': 'Açık gün {gAy}',
  /** `gunsec.sinir.baslangic` — "Trinkow'a {g} {Ay}'ta başladın. Daha öncesi yok." */
  'cumle.gunsecSinirBaslangic': "Trinkow'a {gAy}'ta başladın. Daha öncesi yok.",
  /** `gunsec.ozet.baslik` — "{Ay} özeti" */
  'cumle.gunsecOzetBasligi': '{ayAdi} özeti',
  /** `gunsec.a11y.gun` — "{g} {Ay} {GünAdı}, {durum}[, bugün]" */
  'cumle.gunsecA11yGun': '{gAyGunAdi}, {durum}',
  'cumle.gunsecA11yGun.bugun': '{gAyGunAdi}, {durum}, bugün',
  /** `ekle.arama.satir.gecen` — "{kategori} · geçen sefer {tutar}" */
  'cumle.ekleAramaSatirGecen': '{kategoriAdi} · geçen sefer {tutar}',
  /** `ekle.arama.yeni.baslik` — `"{arama}" olarak ekle` */
  'cumle.ekleAramaYeniBaslik': '"{arama}" olarak ekle',
  /** `ekle.tutar.oneri.cip` — "Geçen sefer {tutar}" */
  'cumle.ekleTutarOneriCip': 'Geçen sefer {tutar}',
  /** `ekle.gun.serit` — "Bu kayıt {gün}'e yazılacak." */
  'cumle.ekleGunSeridi': "Bu kayıt {gun}'e yazılacak.",
  /** `a11y.ekle.gun` — "Gün seç, şu an {gün}" */
  'cumle.a11yEkleGun': 'Gün seç, şu an {gun}',
  /** `a11y.ekle.oneriCip` — "Geçen sefer ödediğin {tutar} tutarını kullan" */
  'cumle.a11yEkleOneriCip': 'Geçen sefer ödediğin {tutar} tutarını kullan',
  /** `a11y.ekle.sonKullanilan` — "{ad}, geçen sefer {tutar}" */
  'cumle.a11yEkleSonKullanilan': '{ad}, geçen sefer {tutar}',
  /** `a11y.ob.gun` — "Ayın {n}. günü" (E-03 gün ızgarası, prototip aria-label deseni). */
  'cumle.a11yObGun': 'Ayın {gun}. günü',
  /**
   * `ob.maas.donem` — metinler.md şablonu "Dönem ayın {gun}'inde başlar."
   * statik "'inde" ekini yalnız örnek gün (15) için doğru yazmıştı; 31 günün
   * çoğunda ünlü uyumu farklıdır (bkz. `lib/tarih.ts#gunBulunmaEki`). PM'e
   * bildirildi — metinler.md §2 şablonu güncellenmeli, ek burada TEK yerden
   * hesaplanır (K-040).
   */
  'cumle.obMaasDonem': 'Dönem ayın {gunEki} başlar. Limit kalan güne bölünür.',
  /** `ob.ozet` maaş günü değeri — 15 → "Ayın 15'i" (`lib/tarih.ts#gunIyelikEki`). */
  'cumle.obOzetMaasGunu': 'Ayın {gunEki}',
  /** `oneri.nasil.1` — "Aylık net gelirin {tutar}." */
  'cumle.oneriNasil1': 'Aylık net gelirin {tutar}.',
  /** `oneri.nasil.3` — "Sosyal ve keyfi pay {tutar} oldu, gelir döneminde kalan {n} güne bölündü." */
  'cumle.oneriNasil3': 'Sosyal ve keyfi pay {tutar} oldu, gelir döneminde kalan {gunSayisi} güne bölündü.',
  /** `oneri.denklem.kalan_gun` değeri — "{n} gün" */
  'cumle.oneriDenklemKalanGun': '{gunSayisi} gün',
  /** Alışkanlık kartı ayna kuyusu formül satırı — "Günde 1 × 90 ₺ × 30 gün" / "Haftada 1 × 380 ₺ × 30 gün ÷ 7" / "Ayda 1-2 × 130 ₺". */
  'cumle.tanFormulMetni': '{siklikEtiket} × {fiyatYazi} × 30 gün',
  'cumle.tanFormulMetni.haftalik': '{siklikEtiket} × {fiyatYazi} × 30 gün ÷ 7',
  'cumle.tanFormulMetni.aylik': '{siklikEtiket} × {fiyatYazi}',
  /** `tan.yemek.birim` notu — "Günde kaç {birim}" (serbest sayı sorusu etiketi). */
  'cumle.tanGundeKac': 'Günde kaç {birim}',
  /** Birikim kartı (E-25) kaydırıcı altı — "Ayda 4.800 ₺ ayırmayı hedefliyorsun." (prototip 17-tanisma.html, anahtarsız). */
  'cumle.tanBirikimHedef': 'Ayda {tutar} ayırmayı hedefliyorsun.',
  /** Birikim kartı alt notu — "Üst sınır sabit giderlerine göre hesaplandı. Zorunlu payın %59." */
  'cumle.tanBirikimUstSinirNotu': 'Üst sınır sabit giderlerine göre hesaplandı. Zorunlu payın %{zorunluYuzde}.',
  /** `tan.donus.aciklama` — "Dört kart cevapladın. Dördü bekliyor." */
  'cumle.tanDonusAciklama': '{cevaplanan} kart cevapladın. {bekleyen} bekliyor.',
  /** `tan.X.Y kartın Z. kartı` a11y — "8 kartın {n}. kartı" */
  'cumle.a11yTanKart': '8 kartın {n}. kartı',
  /** Plan kartı başlığı altı — "Gelir 32.000 ₺" */
  'cumle.planGelirEtiketi': 'Gelir {tutar}',
  /** `plan.pay.yatirim` — "Bunun {tutar}'si yatırım payı." */
  'cumle.planPayYatirim': "Bunun {tutar}'si yatırım payı.",
  /** Pay satırı yüzde — "%59" (işaret önce, boşluk yok — K-053/K-059/1). */
  'cumle.planYuzde': '%{yuzde}',
  /** `plan.denklem.kalan_gun` değeri — "{n} gün" */
  'cumle.planDenklemKalanGun': '{gunSayisi} gün',
  /** `plan.nasil.1` — "12.500 + 2.840 + 1.900 + 1.560 = 18.800 ₺. Zorunlu payın bu." (kalemler sıfırsa listeden düşer). */
  'cumle.planNasil1': '{kalemler} = {toplam}. Zorunlu payın bu.',
  /** `plan.nasil.2` — "32.000 ₺ gelirin %15'i = 4.800 ₺." */
  'cumle.planNasil2': "{gelir} gelirin %{yuzde}'i = {tutar}.",
  /** `plan.nasil.3` — "32.000 − 18.800 − 4.800 = 8.400 ₺." */
  'cumle.planNasil3': '{gelir} − {zorunlu} − {birikim} = {sosyal}.',
  /** `plan.nasil.4` — "8.400 ₺ ÷ 28 gün = 300 ₺ günlük limit." */
  'cumle.planNasil4': '{sosyal} ÷ {gunSayisi} gün = {gunlukLimit} günlük limit.',
  /** Alışkanlık maliyeti listesi satır altı — "Günde 1 × 90 ₺" (formülün kısa hâli, ×30 kartın kendisinde). */
  'cumle.planAliskanlikSatirAlt': '{siklikEtiket} × {fiyatYazi}',
  /** Abonelikler satır altı / ayna kuyusu formülü — "{adet} × {tutar}" (E-25 ve E-26 aynı biçimi kullanır, K-040). */
  'cumle.abonelikFormulMetni': '{adet} × {ortalamaTutar}',
  /** `plan.aliskanlik.toplam_not` — "Sosyal ve keyfi payının {tutar}'si. Yasak değil, görünür." */
  'cumle.planAliskanlikToplamNot': "Sosyal ve keyfi payının {tutar}'si. Yasak değil, görünür.",
  /** `plan.ayar.degisim` — "Sosyal ve keyfi pay {tutar} azaldı. Zorunlu pay değişmedi." */
  'cumle.planAyarDegisim.azaldi': 'Sosyal ve keyfi pay {tutar} azaldı. Zorunlu pay değişmedi.',
  'cumle.planAyarDegisim.artti': 'Sosyal ve keyfi pay {tutar} arttı. Zorunlu pay değişmedi.',
  /** Kaydırıcı altı ilk metin (henüz değiştirilmemiş) — "Ayda {tutar}. Fark sosyal ve keyfi paydan iner." */
  'cumle.planAyarAltMetin': 'Ayda {tutar}. Fark sosyal ve keyfi paydan iner.',
  /** `plan.ayar.aralik_en_cok` — "En çok %41" */
  'cumle.planAralikEnCok': 'En çok %{yuzde}',
  /** Gelirsiz limit kartı — "Ayda yaklaşık {tutar}. Tahmini." (günlük × 30) */
  'cumle.planGelirsizAylikTahmin': 'Ayda yaklaşık {tutar}. Tahmini.',
  /** `plan.eksi.tutar` — "Sabit giderlerin gelirini {tutar} aşıyor." */
  'cumle.planEksiTutar': 'Sabit giderlerin gelirini {tutar} aşıyor.',
  /** `plan.eksi.kalan` — "{tutar} eksik" */
  'cumle.planEksiKalan': '{tutar} eksik',
  /** `ayar.surum` — "Sürüm {surum}" */
  'cumle.ayarSurum': 'Sürüm {surum}',
  /** `ayar.plan.kalan` / `.bekliyor` — "{n} kart kaldı" · "8 kart bekliyor" (metinler.md §26.3). */
  'cumle.ayarPlanKalan': '{n} kart kaldı',
  'cumle.ayarPlanBekliyor': '{n} kart bekliyor',
  /** `a11y` — "Maaş günü: {deger}. Değiştir" / "Kip: {deger}. Değiştir" / "Bildirim saati: {deger}. Değiştir" desenleri. */
  'cumle.a11yDegerDegistir': '{etiket}: {deger}. Değiştir',
  /** `hesapsil.veri` — "{n} kayıt dahil tüm verilerin silinir." */
  'cumle.hesapsilVeri': '{n} kayıt dahil tüm verilerin silinir.',
  /** `sifirla.govde` — "{eposta} adresine şifre bağlantısı gitti." */
  'cumle.sifirlaGovde': '{eposta} adresine şifre bağlantısı gitti.',
  /** `ayar.veri_sil_ozet` — "{adet} kayıt · {ay} {yil}'dan bugüne" */
  'cumle.ayarVeriSilOzet': "{adet} kayıt · {ayYil}'dan bugüne",
  /** `prof.gun` — "{n}. gün" */
  'cumle.profGun': '{n}. gün',
  /** `tasarruf.ustSatir.devam` / `.kapandi` — "{Ay} {yıl} · ay devam ediyor" / "· ay kapandı" */
  'cumle.tasarrufUstSatir.devam': '{ayYil} · ay devam ediyor',
  'cumle.tasarrufUstSatir.kapandi': '{ayYil} · ay kapandı',
  /** `tasarruf.butce.cip` / `.cipYok` — "Bütçe {tutar}" · "Bütçe yok" */
  'cumle.tasarrufButceCip': 'Bütçe {tutar}',
  'cumle.tasarrufButceCip.yok': 'Bütçe yok',
  /** `tasarruf.gosterge.cumle.buAy` — "Kaydettiğin gelir ve harcamalara göre {n} gün hesaplandı." */
  'cumle.tasarrufGostergeCumleBuAy': 'Kaydettiğin gelir ve harcamalara göre {gunSayisi} gün hesaplandı.',
  /** `tasarruf.gosterge.cumle.gecmisAy` — "{AyLokatif} kaydettiğin gelir ve harcamalara göre {n} gün hesaplandı." */
  'cumle.tasarrufGostergeCumleGecmisAy': '{ayLokatifDeger} kaydettiğin gelir ve harcamalara göre {gunSayisi} gün hesaplandı.',
  /** `tasarruf.gosterge.disinda.buAy` — "Bu ay harcaman bütçenin {tutar} üzerinde." */
  'cumle.tasarrufGostergeDisindaBuAy': 'Bu ay harcaman bütçenin {tutar} üzerinde.',
  /** `tasarruf.gosterge.disinda.gecmisAy` — "{AyLokatif} harcaman bütçenin {tutar} üzerinde." */
  'cumle.tasarrufGostergeDisindaGecmisAy': '{ayLokatifDeger} harcaman bütçenin {tutar} üzerinde.',
  /** `tasarruf.motivasyon.borc` — "Bu tutar borcunun %{n}'ine denk geliyor." */
  'cumle.tasarrufMotivasyonBorc': "Bu tutar borcunun %{yuzde}'ine denk geliyor.",
  /** `tasarruf.butce.aralik` — "{n}–{n} {Ay}" */
  'cumle.tasarrufButceAralik': '{baslangicGun}–{bitisGun} {ay}',
  /** `tasarruf.butce.sabit` — "Sabit ödemeler dahil toplam {tutar}" */
  'cumle.tasarrufButceSabit': 'Sabit ödemeler dahil toplam {tutar}',
  /** `tasarruf.butce.gunDeger` — "{n}/{n} gün" */
  'cumle.tasarrufButceGunDeger': '{tamamlanan}/{toplam} gün',
  /** `tasarruf.butce.kumulatif` — "Takip başından beri biriken {tutar}" */
  'cumle.tasarrufButceKumulatif': 'Takip başından beri biriken {tutar}',
  /** `tasarruf.butce.eksikGun` — "{n} günün geliri eksik. O günler hesaba katılmadı." */
  'cumle.tasarrufButceEksikGun': '{gunSayisi} günün geliri eksik. O günler hesaba katılmadı.',
  /** `tasarruf.butce.takipBasi` — "Takip {n} {AyLokatif} başladı. Ayın {n} günü hesaplanacak." (`ay` 1-12) */
  'cumle.tasarrufButceTakipBasi': 'Takip {gun} {ayIcinde} başladı. Ayın {hesaplanacakGun} günü hesaplanacak.',
  /** `tasarruf.birikim.ayEkleme.buAy` — "Bu ay {tutar} eklendi" */
  'cumle.tasarrufBirikimAyEklemeBuAy': 'Bu ay {tutar} eklendi',
  /** `tasarruf.birikim.ayEkleme.gecmisAy` — "{AyLokatif} {tutar} eklendi" */
  'cumle.tasarrufBirikimAyEklemeGecmisAy': '{ayLokatifDeger} {tutar} eklendi',
  /** `tasarruf.birikim.ayCekme.buAy` — "Bu ay {tutar} çekildi" */
  'cumle.tasarrufBirikimAyCekmeBuAy': 'Bu ay {tutar} çekildi',
  /** `tasarruf.birikim.ayCekme.gecmisAy` — "{AyLokatif} {tutar} çekildi" */
  'cumle.tasarrufBirikimAyCekmeGecmisAy': '{ayLokatifDeger} {tutar} çekildi',
  /** `tasarruf.birikim.ayYok.gecmisAy` — "{AyLokatif} kayıt yok" */
  'cumle.tasarrufBirikimAyYokGecmisAy': '{ayLokatifDeger} kayıt yok',
  /** `tasarruf.birikim.hedef` — "Hedef {tutar}" */
  'cumle.tasarrufBirikimHedef': 'Hedef {tutar}',
  /** `tasarruf.hareket.sayi` — "{n} kayıt" */
  'cumle.tasarrufHareketSayi': '{adet} kayıt',
  /** `tasarruf.hareket.bos.alt.gecmisAy` — "{AyLokatif} kenara ayırdığın para yok." */
  'cumle.tasarrufHareketBosAltGecmisAy': '{ayLokatifDeger} kenara ayırdığın para yok.',
  /** `tasarruf.hareket.silindiToast` — "{tutar} silindi · Geri al" (eylem etiketi ayrı geçilir, bkz. toastGoster) */
  'cumle.tasarrufHareketSilindiToast': '{tutar} silindi',
  /** `tasarruf.hareket.kaydedildiToast` — "{tutar} birikime eklendi" */
  'cumle.tasarrufHareketKaydedildiToast': '{tutar} birikime eklendi',
  /** `tasarruf.kategori.harcanan` — "Harcanan {tutar}" */
  'cumle.tasarrufKategoriHarcanan': 'Harcanan {tutar}',
  /** `tasarruf.kategori.pay` — "payı %{n}" (işaret önce, boşluksuz) */
  'cumle.tasarrufKategoriPay': 'payı %{yuzde}',
  /** `tasarruf.kategori.rutin` — "rutin {tutar}" */
  'cumle.tasarrufKategoriRutin': 'rutin {tutar}',
  /** `tasarruf.kategori.bos.gecmisAy` — "{AyLokatif} harcama yazmamışsın." */
  'cumle.tasarrufKategoriBosGecmisAy': '{ayLokatifDeger} harcama yazmamışsın.',
  /** `tasarruf.rutin.bos.gecmisAy` — "{AyLokatif} vazgeçtiğin rutin yok." */
  'cumle.tasarrufRutinBosGecmisAy': '{ayLokatifDeger} vazgeçtiğin rutin yok.',
  /** `tasarruf.ozet.butce` — "Kalan {tutar}" */
  'cumle.tasarrufOzetButce': 'Kalan {tutar}',
  /** `tasarruf.ozet.butceDisinda` — "Bütçe dışı {tutar}" */
  'cumle.tasarrufOzetButceDisinda': 'Bütçe dışı {tutar}',
  /** `tasarruf.ozet.birikim` — "{tutar} · hedefin %{n}'i" */
  'cumle.tasarrufOzetBirikim': "{tutar} · hedefin %{yuzde}'i",
  /** `tasarruf.ozet.birikimAyYok.buAy` — "{tutar} · bu ay kayıt yok" */
  'cumle.tasarrufOzetBirikimAyYokBuAy': '{tutar} · bu ay kayıt yok',
  /** `tasarruf.ozet.birikimAyYok.gecmisAy` — "{tutar} · {AyLokatif} kayıt yok" */
  'cumle.tasarrufOzetBirikimAyYokGecmisAy': '{tutar} · {ayLokatifDeger} kayıt yok',
  /** `tasarruf.ozet.birikimHedefYok` — "{tutar} · hedef koymadın" */
  'cumle.tasarrufOzetBirikimHedefYok': '{tutar} · hedef koymadın',
  /** `tasarruf.ozet.kategori` — "Harcanan {tutar}" */
  'cumle.tasarrufOzetKategori': 'Harcanan {tutar}',
  /** `tasarruf.ozet.rutin` — "{tutar} · {n} rutin" */
  'cumle.tasarrufOzetRutin': '{tutar} · {rutinSayisi} rutin',
  /** `a11y.tasarruf.bolum` — "{başlık}. {özet}" */
  'cumle.a11yTasarrufBolum': '{baslik}. {ozet}',
  /** `gunlukRutin.ozet` — "{n} rutin · {n} işaretsiz" */
  'cumle.gunlukRutinOzet': '{toplam} rutin · {isaretsiz} işaretsiz',
  /** `gunlukRutin.ozetHepsi` — "{n} rutin · hepsi işaretli" */
  'cumle.gunlukRutinOzetHepsi': '{toplam} rutin · hepsi işaretli',
  /** `gunlukRutin.ozetHicbiri` — "{n} rutin · işaretlenmedi" */
  'cumle.gunlukRutinOzetHicbiri': '{toplam} rutin · işaretlenmedi',
  /** `gunlukRutin.ozetHata` — "{n} rutin · işaret bekliyor" */
  'cumle.gunlukRutinOzetHata': '{toplam} rutin · işaret bekliyor',
  /** `gunlukRutin.durum.aldim` — "Yazıldı · {saat}" */
  'cumle.gunlukRutinDurumAldim': 'Yazıldı · {saat}',
  /** `gunlukRutin.toast.aldim` — "{ad} {tutar} yazıldı." */
  'cumle.gunlukRutinToastAldim': '{ad} {tutar} yazıldı.',
  /** `gunlukRutin.toast.almadim` — "{ad} almadın olarak işaretlendi." */
  'cumle.gunlukRutinToastAlmadim': '{ad} almadın olarak işaretlendi.',
  /** `a11y.gunlukRutin.bolum` — "Rutinler. {özet}" */
  'cumle.a11yGunlukRutinBolum': '{baslik}. {ozet}',
  /** `a11y.gunlukRutin.bolumGecmis` — "Rutinler. {gün}. {özet}" */
  'cumle.a11yGunlukRutinBolumGecmis': '{baslik}. {gun}. {ozet}',
  /** `a11y.gunlukRutin.aldim` — "{ad} aldım olarak işaretle, {tutar}" */
  'cumle.a11yGunlukRutinAldim': '{ad} aldım olarak işaretle, {tutar}',
  /** `a11y.gunlukRutin.almadim` — "{ad} almadım olarak işaretle, {tutar} rutin tasarrufu" */
  'cumle.a11yGunlukRutinAlmadim': '{ad} almadım olarak işaretle, {tutar} rutin tasarrufu',
  /** `a11y.gunlukRutin.yaziliyor` — "{ad} yazılıyor" */
  'cumle.a11yGunlukRutinYaziliyor': '{ad} yazılıyor',
  /** `a11y.gunlukRutin.isaretleniyor` — "{ad} işaretleniyor" */
  'cumle.a11yGunlukRutinIsaretleniyor': '{ad} işaretleniyor',
  /** `a11y.gunlukRutin.aldimGecmis` — "{ad}, {gün}. Aldım olarak işaretle, {tutar}" */
  'cumle.a11yGunlukRutinAldimGecmis': '{ad}, {gun}. Aldım olarak işaretle, {tutar}',
  /** `a11y.gunlukRutin.almadimGecmis` — "{ad}, {gün}. Almadım olarak işaretle, {tutar} rutin tasarrufu" */
  'cumle.a11yGunlukRutinAlmadimGecmis': '{ad}, {gun}. Almadım olarak işaretle, {tutar} rutin tasarrufu',
  /**
   * `a11y.bolumYukleniyor` — "{başlık}. Yükleniyor". Ö5 — E-10 rutin bölümü VE
   * E-27 akordiyonunun dört bölümü PAYLAŞIR (aynı anahtar, farklı `baslik`).
   */
  'cumle.a11yBolumYukleniyor': '{baslik}. Yükleniyor',
  /** `a11y.tasarruf.gostergeDisinda` — "Bütçe dışı {tutar}" */
  'cumle.a11yTasarrufGostergeDisinda': 'Bütçe dışı {tutar}',
  /** `a11y.tasarruf.butceCip` — "Bütçe {tutar}. Bütçeyi aç" */
  'cumle.a11yTasarrufButceCip': 'Bütçe {tutar}. Bütçeyi aç',
  'cumle.a11yTasarrufButceCip.yok': 'Bütçe tanımlı değil. Bütçeyi aç',
  /** `a11y.tasarruf.hareket` — "{yön}, {tarih}, {tutar}, not: {not}" (tarih `kisaTarih` ile gelir). */
  'cumle.a11yTasarrufHareket': '{yon}, {tarih}, {tutar}',
  'cumle.a11yTasarrufHareket.not': '{yon}, {tarih}, {tutar}, not: {notMetni}',
  /** `a11y.tasarruf.gunSayaci` — "Ayın tamamlanan günleri: {n} / {n}" */
  'cumle.a11yTasarrufGunSayaci': 'Ayın tamamlanan günleri: {tamamlanan} / {toplam}',
  /** `profil.satir.butceDeger` — "Aylık net gelir {tutar} · {n} sabit gider" */
  'cumle.profilSatirButceDeger': 'Aylık net gelir {tutar} · {sabitGiderSayisi} sabit gider',
  /** `profil.satir.limitlerDeger` — "Günlük {tutar} · {n} kategori limiti" */
  'cumle.profilSatirLimitlerDeger': 'Günlük {gunlukTutar} · {kategoriLimitSayisi} kategori limiti',
  /** `profil.satir.rutinlerDeger` — "{n} rutin · bu ay {tutar} tasarruf" */
  'cumle.profilSatirRutinlerDeger': '{rutinSayisi} rutin · bu ay {tutar} tasarruf',
  /** `profil.satir.favorilerDeger` — "{n} ürün, son fiyatlarıyla" */
  'cumle.profilSatirFavorilerDeger': '{urunSayisi} ürün, son fiyatlarıyla',
  /** `profil.satir.taksitlerDeger` — "{n} seri · bu ay {tutar}" */
  'cumle.profilSatirTaksitlerDeger': '{seriSayisi} seri · bu ay {tutar}',
  /** `profil.satir.seriDeger` — "{n} gün · en uzun {n} gün" */
  'cumle.profilSatirSeriDeger': '{mevcutSeri} gün · en uzun {enUzunSeri} gün',
  /** `profil.alt.surum` — "Trinkow · sürüm {n}" */
  'cumle.profilAltSurum': 'Trinkow · sürüm {surum}',
  /** `profil.kimlik.serit.gun` — "{n} gündür kayıt giriyorsun" */
  'cumle.profilKimlikSeritGun': '{mevcutSeri} gündür kayıt giriyorsun',
  /** `profil.kimlik.serit.altEnUzun` — "En uzun {n} gün." */
  'cumle.profilKimlikSeritAltEnUzun': 'En uzun {enUzunSeri} gün.',
  /** `a11y.profil.satir` — "{başlık}. {değer}" */
  'cumle.a11yProfilSatir': '{baslik}. {deger}',
  /** `seri.pencere` başlığı (eski `SERI_PENCERE_BASLIK` sabiti). */
  'seri.pencere_baslik': 'Son 4 hafta',
  /** `ekle.arama.yeni.alt` (eski `EKLE_ARAMA_YENI_ALT` sabiti). */
  'ekle.arama.yeni.alt': 'Kategoriyi ve tutarı sen seç.',

  // ---- Şifre, hesap silme, yasal ve yardım ekranları (app/sifre-sifirla, sifremi-unuttum, hesap-sil, legal, yardim)
  // ---- app/sifre-sifirla.tsx — e-postadaki bağlantıyla yeni şifre belirleme
  /** Ekran başlığı. */
  'sifre_sifirla.baslik': 'Yeni şifre belirle',
  /** Ekran alt başlığı. */
  'sifre_sifirla.alt_baslik': 'Hesabın için güçlü ve hatırlayabileceğin bir şifre seç.',
  /** Alan etiketi. */
  'sifre_sifirla.yeni_sifre': 'Yeni şifre',
  /** Alan etiketi — yeni şifrenin ikinci kez yazıldığı alan. */
  'sifre_sifirla.yeni_sifre_tekrar': 'Yeni şifre tekrar',
  /** Birincil buton. */
  'sifre_sifirla.eylem': 'Şifreyi yenile',
  /** Buton. «Bağlantı» = e-postayla gelen şifre yenileme bağlantısı (link). */
  'sifre_sifirla.yeni_baglanti': 'Yeni bağlantı iste',
  /** Şifre yenilendikten sonra gösterilen metin. */
  'sifre_sifirla.basarili': 'Şifren yenilendi. Tüm cihazlardaki eski oturumların kapatıldı.',
  /** Başarıdan sonra giriş ekranına götüren buton. */
  'sifre_sifirla.giris_yap': 'Giriş yap',
  'sifre_sifirla.hata.sifre': 'En az 8 karakterlik şifre gir ve iki alanda aynı şifreyi kullan.',
  /** «Bağlantı» = e-postadaki şifre yenileme bağlantısı (link), internet bağlantısı değil. */
  'sifre_sifirla.hata.baglanti_gecersiz': 'Bağlantı geçersiz veya süresi dolmuş. Yeni bağlantı iste.',
  /** Ekran, bağlantıdaki anahtar (token) olmadan açıldığında. */
  'sifre_sifirla.hata.baglanti_eksik': 'Şifre yenileme bağlantısı eksik. Yeni bağlantı iste.',
  'sifre_sifirla.hata.genel': 'Şifre yenilenemedi. Yeniden dene.',

  // ---- app/sifremi-unuttum.tsx — şifre yenileme bağlantısı isteme
  /** Ekran başlığı. */
  'sifremi_unuttum.baslik': 'Şifreni yenile',
  /** Ekran alt başlığı. */
  'sifremi_unuttum.alt_baslik': 'E-postana güvenli, tek kullanımlık bir bağlantı gönderelim.',
  'sifremi_unuttum.aciklama': 'E-posta adresine 30 dakika geçerli bir şifre yenileme bağlantısı göndereceğiz.',
  /** İstek gönderildikten sonraki bilgi şeridi. */
  'sifremi_unuttum.gonderildi': 'Bu e-posta ile bir hesabın varsa şifre yenileme bağlantısı gönderilecek. Gelen kutunu ve spam klasörünü kontrol et.',
  /** Birincil buton. */
  'sifremi_unuttum.eylem': 'Bağlantı gönder',
  'sifremi_unuttum.hata.eposta': 'Geçerli bir e-posta adresi gir.',
  'sifremi_unuttum.hata.kullanilamiyor': 'Şifre kurtarma şu anda kullanılamıyor. Daha sonra yeniden dene.',
  /** «Bağlantını» = internet bağlantın. */
  'sifremi_unuttum.hata.gonderilemedi': 'İstek gönderilemedi. Bağlantını kontrol edip yeniden dene.',

  // ---- app/hesap-sil.tsx — hesabı kalıcı silme
  /** Ekran başlığı (Ayarlar → Hesabımı sil). */
  'hesap_sil.baslik': 'Hesabımı sil',
  'hesap_sil.uyari': 'Bu işlem geri alınamaz.',
  'hesap_sil.aciklama': 'Hesabın, gelir ve borç bilgilerin, harcamaların, rutinlerin, sık kullanılanların ve bütçe geçmişin silinir. Tüm oturumların kapanır.',
  /** Onay anahtarının (switch) etiketi. */
  'hesap_sil.onay': 'Hesabımın ve kayıtlarımın silinmesini istiyorum',
  /** Tehlikeli eylem butonu. */
  'hesap_sil.eylem': 'Hesabımı kalıcı olarak sil',
  /** «Bağlantını» = internet bağlantın. */
  'hesap_sil.hata': 'Hesap silinemedi. Bağlantını kontrol et ve yeniden dene. İşlem tamamlandı olarak işaretlenmedi.',

  // ---- app/legal.tsx — yasal belgeler. Metinler TASLAKTIR; çevirileri de hukuki incelemeden geçmelidir.
  // Belge başlıkları tr.ts'teki `kayit.belge.kosullar` ve `kayit.belge.gizlilik` anahtarlarından okunur.
  /** Belge listesi ekranının başlığı. */
  'legal.baslik': 'Yasal belgeler',
  /** Her belgenin üstündeki uyarı şeridi. Tarihi hedef dilin tarih biçimiyle yaz; «v0.1» sürüm numarasıdır. */
  'legal.taslak_uyari': 'Taslak • 23 Eylül 2026 • v0.1. İşletme bilgileri ve nihai metinler yayın öncesinde tamamlanacaktır.',
  'legal.kosullar.p1': 'Trinkow, girdiğin gelir, gider ve alışkanlık bilgilerini düzenleyip hesaplanan bütçe ve tasarruf özetlerini gösterir. Gösterilen tutarlar bir banka hesabının bakiyesini veya yapılmış bir yatırımı temsil etmez.',
  /** «Günlük», «Bütçem», «Rutinlerim»: uygulamadaki ekran adları. */
  'legal.kosullar.p2': 'Hesabının erişim bilgilerini koru. Girdiğin bilgileri Günlük, Bütçem ve Rutinlerim ekranlarından kontrol edip düzeltebilirsin. Çıkış yapmak hesabını silmez.',
  'legal.kosullar.p3': 'Hizmet sağlayıcının unvanı, iletişim bilgileri, sorumluluk hükümleri ve yürürlük koşulları tamamlanacaktır. Bu taslak henüz nihai kullanım sözleşmesi değildir.',
  'legal.gizlilik.p1': 'Uygulama e-posta, kimlik doğrulama bilgileri, kullanıcı tercihleri ve kaydettiğin gelir, gider, borç ve rutin bilgilerini işler. Şifren sunucuda hash olarak saklanır.',
  /** «Beni hatırla»: giriş ekranındaki seçeneğin adı. */
  'legal.gizlilik.p2': 'Beni hatırla açıkken mobil cihazındaki oturum bilgileri işletim sisteminin güvenli deposunda tutulur. Kapalıyken oturum yalnız uygulamanın belleğinde tutulur. Şifre kurtarma için e-posta gönderimi kullanılır.',
  /** «Ayarlar → Hesabımı sil»: menü yolu (ekran adları `ayar.baslik` → `hesap_sil.baslik`). */
  'legal.gizlilik.p3': 'Hesabını Ayarlar → Hesabımı sil üzerinden silebilirsin. Hizmet sağlayıcı, hizmet alınan taraflar, saklama süreleri ve başvuru iletişimi tamamlanmadan bu taslak nihai gizlilik politikası sayılmaz.',
  /** KVKK: Türkiye'nin Kişisel Verilerin Korunması Kanunu; aydınlatma metni = bu kanunun öngördüğü bilgilendirme metni. */
  'legal.aydinlatma.baslik': 'KVKK aydınlatma metni',
  'legal.aydinlatma.p1': 'Bu sayfa yayın öncesi hazırlanacak aydınlatma metni için ayrılmıştır. Veri sorumlusunun kimliği ve iletişim bilgileri henüz tanımlanmamıştır.',
  'legal.aydinlatma.p2': 'Uygulamanın temel veri grupları: hesap bilgileri, bütçe/harcama kayıtları, alışkanlıklar ve kullanım tercihleridir. Bunlar oturum açma ve talep ettiğin bütçe hesaplarını göstermek için kullanılır.',
  'legal.aydinlatma.p3': 'İşleme koşulları, alıcı grupları, saklama/aktarım bilgileri ve başvuru yöntemi hizmetin gerçek işletme bilgilerine göre tamamlanacaktır. Bu sayfa taslaktır; nihai aydınlatma yerine sunulmaz.',

  // ---- app/yardim.tsx — yardım ve sık sorulan sorular (soru = ara başlık, cevap = gövde metni)
  /** Ekran başlığı. */
  'yardim.baslik': 'Yardım ve sık sorulanlar',
  'yardim.s1.soru': 'Harcama nasıl eklenir?',
  'yardim.s1.cevap': 'Artı düğmesine dokun, kategori ve tutarı seçip kaydet. Sık kullanılan bir ürünü seçtiğinde son fiyatı dolar; kaydetmeden önce değiştirebilirsin.',
  'yardim.s2.soru': 'Tasarruf tutarı neyi gösterir?',
  'yardim.s2.cevap': 'Kaydettiğin gelir ve giderlerden hesaplanan kalan tutarı görürsün. Rutin harcamalarındaki fark ayrıca gösterilir ve toplama ikinci kez eklenmez. Bu tutar banka bakiyen değildir.',
  'yardim.s3.soru': 'Limit değiştirince geçmiş değişir mi?',
  'yardim.s3.cevap': 'Yeni limit düzenlediğin günden itibaren uygulanır. Önceki günlerin limitleri korunur.',
  /**
   * Başlığı tr.ts'teki `giris.unuttum` ('Şifremi unuttum'). Cevaptaki «Şifremi unuttum»
   * da giriş ekranındaki aynı bağlantının adıdır; çeviride `giris.unuttum` ile aynı yazılmalı.
   */
  'yardim.s4.cevap': 'Giriş ekranındaki Şifremi unuttum bağlantısıyla e-postana yenileme bağlantısı iste. Bağlantı 30 dakika geçerlidir ve bir kez kullanılabilir.',
  'yardim.s5.soru': 'Hesabımı nasıl silerim?',
  /** «Ayarlar → Hesabımı sil»: menü yolu (ekran adları `ayar.baslik` → `hesap_sil.baslik`). */
  'yardim.s5.cevap': 'Ayarlar → Hesabımı sil sayfasını aç. Silme işlemi hesabını ve kayıtlarını kaldırır; geri alınamaz. Çıkış yapmak kayıtlarını silmez.',
  'yardim.s6.soru': 'Destek',
  'yardim.s6.cevap': 'Destek iletişim adresi henüz tanımlanmamıştır. Sorun bildirirken şifreni veya şifre yenileme bağlantını paylaşma.',

  // ---- Bütçe, limitler, rutinler, favoriler (app/butce, limitler, rutinler, favoriler · RevScreen)
  // ---- RevScreen kabuğu (src/components/RevScreen.tsx) — Bütçem, Limitler, Rutinlerim, Sık kullanılanlar, Özet ekranları ortak
  /** Tutar henüz bilinmediğinde tutarın yerine yazılır (ör. gelir girilmemişse günlük limit). */
  'rev.henuz_bilinmiyor': 'Henüz bilinmiyor',
  /** Ekran verisi yüklenirken gösterilen tek satır. */
  'rev.yukleniyor': 'Yükleniyor…',
  'rev.hata.yukleme': 'Bilgiler yüklenemedi. Bağlantını kontrol edip yeniden deneyebilirsin.',

  // ---- Bütçem (app/butce.tsx)
  /** Ekran başlığı. */
  'butce.baslik': 'Bütçem',
  'butce.aciklama': 'Değişiklikler bugünden itibaren geçerli olur; geçmiş günlerin hesabı değişmez.',
  /** Bölüm başlığı. */
  'butce.grup.gelir_gider': 'Gelir ve giderler',
  /** Tutar alanı etiketleri — tutar ₺ cinsinden girilir. */
  'butce.alan.gelir': 'Aylık gelir · ₺',
  'butce.alan.kira': 'Kira · ₺',
  'butce.alan.fatura': 'Faturalar · ₺',
  'butce.alan.ulasim': 'Zorunlu ulaşım · ₺',
  'butce.alan.kredi': 'Aylık kredi ödemesi · ₺',
  'butce.alan.hedef': 'Aylık hedef birikim · ₺',
  'butce.alan.borc': 'Kalan toplam borç · ₺',
  'butce.alan.not': 'Gelir veya borç bilinmiyorsa boş bırakabilirsin. Hedef birikim, gerçekleşmiş birikim sayılmaz.',
  /** Bölüm başlığı — altında hesaplanan günlük limit tutarı durur. */
  'butce.grup.otomatik_limit': 'Otomatik günlük limit',
  /** {tutar}: biçimlenmiş tutar, ör. "1.250 ₺". */
  'butce.acik': 'Aylık bütçe açığı: {tutar}',
  /** Otomatik günlük limitin nasıl hesaplandığını anlatan formül satırı. */
  'butce.limit_formulu': 'Gelir − sabit ödemeler − hedef birikim, ayın günlerine dağıtılır.',
  /** Buton — henüz bütçe yokken (bütçe varken buton `eylem.kaydet` olur). */
  'butce.olustur': 'Bütçemi oluştur',
  /** Buton — Limitler ekranını açar. */
  'butce.limitlere_git': 'Günlük ve kategori limitleri',
  'butce.mesaj.kaydedildi': 'Bütçen bugünden itibaren güncellendi.',
  'butce.mesaj.hata': 'Kaydedilemedi. Geliri ve kategori paylarını kontrol et.',

  // ---- Limitler (app/limitler.tsx) — ekran başlığı mevcut `limitler.baslik`
  /** Boş durum — henüz bütçe yokken. */
  'limitler.butcesiz.baslik': 'Önce bütçeni oluştur',
  'limitler.butcesiz.govde': 'Günlük limit için gelir veya manuel tutar bilgisi gerekli.',
  /** Buton — Bütçem ekranını açar. */
  'limitler.butcesiz.eylem': 'Bütçeme git',
  'limitler.aciklama': 'Düzenleme bugün ve sonraki günlere uygulanır. Önceki günler değişmez.',
  /** Günlük limit modu seçimi (iki seçenekli segment). */
  'limitler.mod.otomatik': 'Gelire göre otomatik',
  'limitler.mod.manuel': 'Ben belirleyeceğim',
  /** Tutar alanı etiketi — tutar ₺ cinsinden girilir. */
  'limitler.alan.gunluk': 'Günlük limit · ₺',
  /** {tutar}: biçimlenmiş tutar. */
  'limitler.gelir_payi': 'Gelirine göre günlük pay: {tutar}',
  /** Bölüm başlığı — günlük limitin kategorilere ayrılan payları. */
  'limitler.pay.baslik': 'Kategori payları',
  'limitler.pay.not': 'Bu paylar günlük limitin içindedir. Dağıtılmayan tutarı diğer harcamalarda kullanabilirsin.',
  /** Tutar alanı etiketi — {kategori}: kategori adı; tutar ₺ cinsinden, günlük. */
  'limitler.pay.alan': '{kategori} · günlük ₺',
  /** Erişilebilirlik etiketi (çöp kutusu ikonu) — {kategori}: kategori adı. */
  'limitler.pay.kaldir': '{kategori} payını kaldır',
  /** Buton. */
  'limitler.pay.ekle': 'Kategori payı ekle',
  'limitler.pay.toplam': 'Kategori toplamı',
  /** Günlük limitin kategorilere dağıtılmamış kısmı. */
  'limitler.pay.dagitilmamis': 'Dağıtılmamış',
  'limitler.eski_limitler_arsiv': 'Önceki aylık kategori limitlerin arşivlendi; günlük tutara çevrilmedi.',
  /** Buton. */
  'limitler.kaydet': 'Limitleri kaydet',
  'limitler.mesaj.kaydedildi': 'Limitler bugünden itibaren kaydedildi.',
  'limitler.mesaj.hata': 'Kaydedilemedi. Kategori toplamı günlük limiti aşmamalı.',

  // ---- Rutinlerim (app/rutinler.tsx)
  /** Ekran başlığı; Bütçem'deki bu ekranı açan buton da aynı adı taşır. */
  'rutinler.baslik': 'Rutinlerim',
  'rutinler.aciklama': 'Günlük rutinlerini seç, kendi adet ve fiyatını yaz. Birden fazla rutin ekleyebilirsin.',
  /**
   * Hazır rutin önerileri. Seçilince rutin bu adla kaydedilir (ad sonra
   * kullanıcı verisi olur), bu yüzden kısa bir harcama adı olmalı.
   */
  'rutinler.oneri.kahve': 'Kahve',
  'rutinler.oneri.sigara': 'Sigara',
  'rutinler.oneri.yemek': 'Yemek',
  'rutinler.oneri.ulasim': 'Ulaşım',
  'rutinler.oneri.atistirmalik': 'Atıştırmalık',
  /** Erişilebilirlik etiketi — {ad}: öneri adı; zaten eklenmiş öneri satırı. */
  'rutinler.oneri.secili': '{ad}, seçili',
  /** Buton — öneri seçmeden boş formla rutin ekler. */
  'rutinler.kendim_ekle': 'Kendim ekleyeyim',
  /** Alan etiketi — rutinin adı. */
  'rutinler.alan.ad': 'Harcamanın adı',
  /** Tutar alanı etiketi — tutar ₺ cinsinden girilir. */
  'rutinler.alan.fiyat': 'Birim fiyat · ₺',
  /** Buton — yeni rutin. */
  'rutinler.kaydet': 'Rutini kaydet',
  /** Buton — var olan rutini düzenlerken. */
  'rutinler.kaydet.duzenle': 'Değişiklikleri kaydet',
  /** Bölüm başlığı. */
  'rutinler.aktif': 'Aktif rutinler',
  /** Rutin satırının alt yazısı — {kategori}: kategori adı, {adet}: günlük adet, {fiyat}: biçimlenmiş birim fiyat. */
  'rutinler.satir.alt': '{kategori} · Günde {adet} × {fiyat}',
  /** Rutin satırının erişilebilirlik etiketi — {ad}: rutin adı (kullanıcı verisi). */
  'rutinler.satir.a11y': '{ad}. {kategori}, günde {adet} × {fiyat}. Düzenle.',
  /** Erişilebilirlik etiketi (çöp kutusu ikonu) — {ad}: rutin adı. */
  'rutinler.kaldir.a11y': '{ad} rutinini kaldır',
  'rutinler.not': 'Rutin değişiklikleri bugünden itibaren geçerlidir. Harcama girmemek otomatik tasarruf sayılmaz.',
  /** Rutin kaydedildiğinde VE kaldırıldığında gösterilen ortak onay mesajı. */
  'rutinler.mesaj.kaydedildi': 'Kaydedildi.',
  'rutinler.mesaj.hata': 'İşlem tamamlanamadı. Bilgileri kontrol edip yeniden dene.',

  // ---- Sık kullanılanlar (app/favoriler.tsx)
  /** Ekran başlığı — sık alınan ürünlerin son fiyatlarıyla listesi. */
  'favoriler.baslik': 'Sık kullanılanlar',
  /** Satır alt yazısı — {kategori}: kategori adı, {fiyat}: biçimlenmiş son fiyat. */
  'favoriler.satir.ozet': '{kategori} · Son fiyat {fiyat}',
  /** Satırın erişilebilirlik etiketi — {ad}: ürün adı (kullanıcı verisi), {ozet}: `favoriler.satir.ozet`. Dokununca harcama ekleme açılır. */
  'favoriler.satir.a11y': '{ad}. {ozet}. Harcama ekle.',
  /** Erişilebilirlik etiketi (x ikonu) — {ad}: ürün adı. */
  'favoriler.kaldir.a11y': '{ad} sık kullanılanlardan kaldır',
  /** Bölüm başlığı — yeni ürün formu. */
  'favoriler.ekle.baslik': 'Ürün ekle',
  /** Alan etiketi. */
  'favoriler.alan.ad': 'Ürün adı',
  /** Tutar alanı etiketi — tutar ₺ cinsinden girilir. */
  'favoriler.alan.fiyat': 'Son fiyat · ₺',
  /** Buton. */
  'favoriler.kaydet': 'Sık kullanılanlara kaydet',
  'favoriler.mesaj.hata': 'İşlem tamamlanamadı. Yeniden deneyebilirsin.',

  // ---- Diğer ekranlar (özet, harcama ekle/detay, kategori, sekmeler, profil, tasarruf, onboarding, seri)
  // app/(tabs)/_layout.tsx — sekme başlıkları (Tasarruf ve Profil mevcut `sekme.kayitlar` / `sekme.ozet` anahtarlarını kullanır)
  'sekme.bugun': 'Bugün',

  // app/ozet.tsx — Aylık özet ekranı (Profil → Aylık özet)
  /** Üst satır — `{ay}` biçimlenmiş ay başlığı ("Ekim 2026", `ayBasligi`). */
  'ozet_ekran.ust_satir': '{ay} · Bu ayın analizi',
  'ozet_ekran.grup.gelir_harcama': 'Gelir ve harcama',
  'ozet_ekran.harcadigin': 'Harcadığın',
  'ozet_ekran.grup.tasarruflar': 'Tasarrufların',
  'ozet_ekran.tamamlanan_gunler': 'Tamamlanan günlerden',
  'ozet_ekran.rutin_vazgecisler': 'Rutinlerinden vazgeçişler',
  'ozet_ekran.gercek_birikim': 'Gerçek birikim bakiyen',
  'ozet_ekran.olcum_notu':
    'Bu üç değer ayrı ölçümlerdir; birbirine eklenmez. Eksik gelir bilgisi olan dönemler bilinmiyor olarak gösterilir.',
  'ozet_ekran.grup.kategori_analizi': 'Kategori analizi',
  /** Kategori satırının alt yazısı — "Rutin tasarrufu 120 ₺". */
  'ozet_ekran.kategori_rutin_tasarrufu': 'Rutin tasarrufu {tutar}',
  'ozet_ekran.kategori_bos': 'İlk harcamanı eklediğinde kategorilerin burada görünür.',
  'ozet_ekran.tasarruflari_incele': 'Aylık tasarruflarını incele',
  'ozet_ekran.butceyi_duzenle': 'Bütçemi düzenle',
  'ozet_ekran.sik_kullanilanlar': 'Sık kullanılanlar',

  // app/harcama-ekle.tsx — E-11 Harcama ekle
  'ekle.hata.adet': 'Adet pozitif bir tam sayı olmalı.',
  /** Hem "son kullanılanlar" çip şeridinin hem de geçmişten gelen arama sonuçlarının başlığı. */
  'ekle.favoriler_baslik': 'Favoriler ve sık kullanılanlar',
  'ekle.rutin.baglanti': 'Rutin harcama bağlantısı',
  /** Rutin seçim çipi — kaydı hiçbir rutine bağlamaz. */
  'ekle.rutin.degil': 'Rutin değil',
  'ekle.rutin.adet_aciklama': 'Kaç adet aldın? Yukarıdaki tutar toplam harcama tutarıdır.',
  'ekle.rutin.adet_etiket': 'Alınan adet',
  /** Taksit sayısı çipi — "3 taksit", "12 taksit". */
  'ekle.taksit.secenek': '{n} taksit',
  'ekle.a11y.not_ekle': 'Not ekle',

  // app/harcama/[id].tsx — E-12 Harcama detayı (erişilebilirlik etiketleri)
  'detay.a11y.tutar_duzenle': 'Tutarı düzenle',
  'detay.a11y.tutar_duzenleyici_kapat': 'Tutar düzenleyiciyi kapat',
  'detay.a11y.kategori_degistir': 'Kategoriyi değiştir',

  // app/(tabs)/profil.tsx — E-28 Profil grup başlıkları
  'profil.grup.para_plani': 'Para planın',
  'profil.grup.kayitlar_analiz': 'Kayıtlar ve analiz',
  'profil.grup.uygulama_destek': 'Uygulama ve destek',

  // app/(tabs)/tasarruflar.tsx — E-27 Tasarruf
  'tasarruf_ekran.aylik_analiz': 'Aylık analiz',

  // app/seri.tsx — E-21 Seri
  /** "En uzun seri" kuyusundaki değer — "12 gün". */
  'seri.en_uzun_deger': '{n} gün',

  // ---- Ortak bileşenler (src/components)
  // AccountSection
  /** Ekran okuyucu etiketi — Ayarlar > Hesap bölümündeki e-posta adresi. */
  'bilesen.accountsection.a11y.eposta': 'Hesap e-postası {eposta}',

  // CategoryLimitRow
  /** Ekran okuyucu etiketi — kategori limit çubuğu (progressbar). */
  'bilesen.categorylimitrow.a11y': '{kategoriAdi} kategori limiti',

  // CategoryShareRow
  /** Ekran okuyucu etiketi — kategorinin toplam harcamadaki payını gösteren çubuk (progressbar). */
  'bilesen.categorysharerow.a11y': '{kategoriAdi} payı',

  // ClayKeypad (tutar tuş takımı)
  /** Ekran okuyucu etiketi — tuş takımındaki geri silme (⌫) tuşu. */
  'bilesen.claykeypad.a11y.sil': 'Son rakamı sil',
  /** Ekran okuyucu etiketi — tuş takımındaki ondalık ayırıcı (",") tuşu. */
  'bilesen.claykeypad.a11y.virgul': 'Virgül',

  // DateField
  /** Ekran okuyucu etiketi — tarih alanı: alanın etiketi + seçili tarih ("Tarih: 10 Eylül 2026"). */
  'bilesen.datefield.a11y': '{etiket}: {tarih}',

  // Dialog
  /** Ekran okuyucu ipucu (accessibilityHint) — onay penceresindeki geri alınamaz silme düğmesi. */
  'bilesen.dialog.a11y.geri_alinamaz': 'Bu işlem geri alınamaz',

  // ExpenseRow
  /** Harcama satırının ikincil bilgisi — kaçıncı taksit olduğu: "3/12 taksit". */
  'bilesen.expenserow.taksit': '{mevcut}/{toplam} taksit',

  // IdentityPanel
  /** Ekran okuyucu etiketi — Profil'deki kimlik paneli düğmesi; {olgu} ve {baglam} seri bilgisi. */
  'bilesen.identitypanel.a11y': 'Hesabını aç. {eposta}. {olgu}, {baglam}',

  // LimitGauge
  /** Ekran okuyucu etiketi (varsayılan) — dairesel günlük limit göstergesi. */
  'bilesen.limitgauge.a11y': 'Günlük limit kullanımı',

  // MoneyInput
  /** iOS'ta klavyenin üstündeki araç çubuğunda klavyeyi kapatan düğme. */
  'bilesen.moneyinput.bitti': 'Bitti',

  // RoutineRow
  /** Ekran okuyucu etiketi — rutin satırı; {altYazi} "Her gün 2 × 90 ₺", {gunlukTutar} günlük toplam tutar. */
  'bilesen.routinerow.a11y': '{ad}, {altYazi}, günlük {gunlukTutar}. Düzenle',

  // ScreenHeader
  /** Ekran okuyucu etiketi (varsayılan) — ekran başlığındaki limitler ikon düğmesi. */
  'bilesen.screenheader.a11y.limitleri_ac': 'Limitleri aç',

  // TabBar
  /** Ekran okuyucu etiketi — sekme düğmesi; {sekme} sekmenin adı. */
  'bilesen.tabbar.a11y': '{sekme} sekmesi',

  // TextField
  /** Ekran okuyucu etiketi — metin alanının içeriğini silen (x) düğme. */
  'bilesen.textfield.a11y.temizle': 'Temizle',
  /** Karakter sayacı — yazılabilecek kalan karakter sayısı. */
  'bilesen.textfield.kaldi': '{kalan} kaldı',

  // pano/CategoryQuickAddCard
  /** Günlük'teki kategori kartının açıklaması (her satırın sağında bir "+" düğmesi var). */
  'bilesen.categoryquickaddcard.aciklama': 'Harcama eklemek istediğin kategorinin yanındaki artıya dokun.',
  /** Kategori satırı alt yazısı — o kategoride bugün harcanan toplam. */
  'bilesen.categoryquickaddcard.bugun': 'Bugün {tutar}',
  'bilesen.categoryquickaddcard.bugun_yok': 'Bugün harcama yok',

  // pano/GunlukSayfa
  /** Bugün sayfasında sabit ödeme (kira, fatura…) kayıtlarının liste başlığı. */
  'bilesen.gunluksayfa.planli_odemeler': 'Planlı ödemeler',

  // pano/HeroCard
  /** Ekran okuyucu etiketi — limit yokken kullanım halkası. */
  'bilesen.herocard.a11y.harcandi': 'Bugün {tutar} harcandı',
  /** Ekran okuyucu etiketi — limit varken kullanım halkası; {yuzde} tam sayı. */
  'bilesen.herocard.a11y.yuzde': 'Limitin yüzde {yuzde} kadarı kullanıldı',
  /** Kullanım halkasının ortasında, ∞ işaretinin altında (limit yok). */
  'bilesen.herocard.limitsiz': 'Limitsiz',
  /** Kullanım halkasının ortasında, yüzdenin altında ("%40" / "kullanıldı"). */
  'bilesen.herocard.kullanildi': 'kullanıldı',

  // pano/LimitReviewCard
  /** Ekran okuyucu etiketi — limit sorgu kartının kapatma (x) düğmesi. */
  'bilesen.limitreviewcard.a11y.kapat': 'Kartı kapat',

  // pano/RoutineQuickSection
  /** Rutin satırının alt yazısı — o gün kaç kez "Aldım" işaretlendiği. */
  'bilesen.routinequicksection.bugun_adet': 'Bugün {adet} kez',

  // tasarruf/SavingsHeroCard
  /** Ekran okuyucu etiketi — Tasarruf özetinin üç değeri (tutarlar biçimlenmiş gelir). */
  'bilesen.savingsherocard.a11y': 'Harcanabilir {harcanabilir}, harcanan {harcanan}, kalan {kalan}',

  // tasarruf/SavingsSkeleton
  /** Tasarruf ekranı yüklenirken iskelette görünen bölüm başlığı. */
  'bilesen.savingsskeleton.aylik_analiz': 'Aylık analiz',

  // ---- Ayarlar, giriş, kayıt
  // E-22 Giriş ekranı (app/giris.tsx)
  'giris.ekran.baslik': 'Hoş geldin',
  'giris.ekran.alt_baslik': 'Günün parasını, yargılamadan gör.',
  'giris.hata.eposta_gecersiz': 'Geçerli bir e-posta adresi gir.',
  'giris.hata.kimlik': 'E-posta ya da şifre yanlış.',
  'giris.hata.baglanti': 'Oturum açılamadı. Bağlantını kontrol edip yeniden dene.',
  /** Geliştirme test girişi açıkken e-posta alanının etiketi. */
  'giris.test_adi': 'Test adı',
  'giris.hatirla': 'Beni hatırla',
  /** Birincil düğme ve yüklenirken etiketi. */
  'giris.giris_yap': 'Giriş yap',
  'giris.giris_yapiliyor': 'Giriş yapılıyor…',
  'giris.gelistirme.baslik': 'Geliştirme test girişi',
  'giris.gelistirme.aciklama': 'Yalnız test hesabıyla giriş yapar.',
  'giris.hesap_yok': 'Hesabın yok mu?',
  'giris.yasal': 'Gizlilik ve kullanım şartları',

  // E-16 Hesap oluştur (app/kayit.tsx)
  'kayit.ekran.baslik': 'Hesabını oluştur',
  'kayit.ekran.alt_baslik': 'Günlük harcamalarını birkaç saniyede görmeye başla.',
  /** `**…**` arası dokunulabilir bağlantıdır (Kullanım şartları belgesini açar) — işaretler korunmalı. */
  'kayit.onay.kosullar_baglanti': '**Kullanım şartlarını** okudum, kabul ediyorum.',
  /** `**…**` arası dokunulabilir bağlantıdır (Gizlilik politikasını açar) — işaretler korunmalı. */
  'kayit.onay.gizlilik_baglanti': '**Gizlilik politikasını** okudum, kabul ediyorum.',

  // E-19 Ayarlar (app/ayarlar.tsx)
  'ayar.grup.gunluk': 'Günlük kullanım',
  'ayar.grup.hedef': 'Hedef ve plan',
  'ayar.grup.hesap': 'Hesap ve veri',
  'ayar.grup.finans': 'Finans araçları',
  'ayar.grup.destek': 'Destek',
  'ayar.motivasyon.baslik': 'Akşam motivasyon kartı',
  'ayar.motivasyon.aciklama': 'Günün kısa özetini uygulama içinde gösterir.',
  /** Ekran okuyucu: anahtarın durumu. */
  'a11y.ayar.motivasyon': 'Uygulama içi motivasyon, {durum, select, acik {açık} other {kapalı}}',
  'ayar.plan.gelir_kaydet': 'Geliri kaydet',
  'ayar.disa_aktar': 'Verilerimi dışa aktar',
  /** Paylaşım sayfasının başlığı (dışa aktarılan JSON). */
  'ayar.disa_aktar.baslik': 'Trinkow veri dışa aktarımı',
  'ayar.disa_aktar.hata': 'Veriler dışa aktarılamadı. Bağlantını kontrol edip yeniden dene.',
  'ayar.yasal_buton': 'Kullanım şartları ve gizlilik',
  'ayar.finans.butce': 'Gelir ve bütçem',
  'ayar.finans.butce_aciklama': 'Gelirini ve sabit giderlerini düzenle',
  'ayar.finans.limitler_aciklama': 'Günlük ve kategori sınırlarını düzenle',
  'ayar.finans.rutinler': 'Rutinlerim',
  'ayar.finans.rutinler_aciklama': 'Düzenli harcamalarını yönet',
  'ayar.finans.favoriler': 'Favorilerim',
  'ayar.finans.favoriler_aciklama': 'Hızlı ekleme kalemlerini düzenle',
  'ayar.destek.yardim': 'Yardım ve sık sorulanlar',
  'ayar.destek.yardim_aciklama': 'Trinkow kullanımıyla ilgili yanıtlar',
  'ayar.destek.yasal': 'Yasal ve gizlilik',
  /** KVKK: Türkiye'nin kişisel veri kanunu — yasal sayfadaki "KVKK aydınlatma metni"ne işaret eder. */
  'ayar.destek.yasal_aciklama': 'Koşullar, gizlilik ve KVKK',

  // E-16 Özet — motivasyon şeridi. Eskiden sunucunun Türkçe `motivasyon.mesaj`ı gösteriliyordu
  // (tasarruf_service.py); metin artık `tur` + `borc_yuzde`den istemcide, aktif dilde kurulur.
  /** Gerçek birikimin borca oranı; `{yuzde}` 0-100 tam sayı. */
  'ozet_ekran.motivasyon.borc': 'Gerçek birikimin borcunun %{yuzde} tutarına denk geliyor. Adım adım devam edebilirsin.',
  'ozet_ekran.motivasyon.birikim': 'Küçük adımlar birikimine dönüşebilir.',

  // ---- Tarih biçimleri (src/lib/tarih.ts). Ay/gün adları aşağıdaki `takvim`de.
  'tarih.bugun': 'Bugün',
  'tarih.dun': 'Dün',
  /** "10 Eylül Perşembe" — `{ay}` takvim.aylarTarih, `{haftaGunu}` takvim.gunler */
  'tarih.uzun': '{gun} {ay} {haftaGunu}',
  /** "10 Eylül" */
  'tarih.kisa': '{gun} {ay}',
  /** "10 Eylül 2026" */
  'tarih.tam': '{gun} {ay} {yil}',
  /** "Eylül 2026" — `{ay}` takvim.aylar */
  'tarih.ay_yil': '{ay} {yil}',
  /** "08.20" — prototipteki saat düzeni (iki nokta değil nokta) */
  'tarih.saat': '{saat}.{dakika}',
  /** "10 Eylül · 21.30 eklendi" (E-12 alt bilgi) */
  'tarih.eklenme': '{tarih} · {saat} eklendi',
  /** E-10 geçmiş gün başlığı — "17/09 Perşembe" (gg/aa) */
  'tarih.gunluk_baslik': '{gg}/{aa} {haftaGunu}',
  /** E-10 geçmiş gün üst satırı — "3 gün önce" */
  'tarih.gun_once': '{n} gün önce',

  // ---- Kategori adları (src/lib/kategoriler.ts — kod sabit, ad çeviriden)
  'kategori.ad.market': 'Market',
  'kategori.ad.kafe': 'Kafe',
  'kategori.ad.ulasim': 'Ulaşım',
  'kategori.ad.restoran': 'Restoran',
  'kategori.ad.fatura': 'Fatura',
  'kategori.ad.akaryakit': 'Akaryakıt',
  'kategori.ad.saglik': 'Sağlık',
  'kategori.ad.kiraev': 'Kira ve ev',
  'kategori.ad.abonelik': 'Abonelik',
  'kategori.ad.eglence': 'Eğlence',
  'kategori.ad.giyim': 'Giyim',
  'kategori.ad.aliskanliklar': 'Alışkanlıklar',
  'kategori.ad.diger': 'Diğer',

  // ---- Dil seçimi (Ayarlar + giriş ekranları)
  'dil.baslik': 'Dil',
  'dil.aciklama': 'Uygulama bu dilde görünür.',
  'dil.sec': 'Dil seç',
  'a11y.dil.degistir': 'Dili değiştir, şu an {dil}',
  // ── main birleşmesi (quick-access dalı, 2026-10-25): yeni ekranlar ve cümleler ──
  'gunluk.hareketler': 'Bugünün hareketleri',
  'gunluk.tumunu_gor': 'Tümünü gör',
  'gunluk.sik_kullanilanlar': 'Sık harcamalarım',
  'gunluk.kategoriler': 'Kategoriler',
  'gunluk.kategoriler.ozet': 'Limit ve hızlı ekleme',
  'ekle.sesli.baslik': 'Sesle doldur',
  'ekle.sesli.aciklama': '“Dün markette kartla 750 lira” gibi söyle.',
  'ekle.sesli.baslat': 'Konuşmaya başla',
  'ekle.sesli.dinliyor': 'Dinliyorum…',
  'ekle.sesli.isleniyor': 'Söylediklerin işleniyor…',
  'ekle.sesli.durdur': 'Dinlemeyi bitir',
  'ekle.sesli.hazir': 'Alanları doldurdum. Kontrol edip kaydedebilirsin.',
  'ekle.sesli.tutar_yok': 'Tutarı anlayamadım. Diğer alanları doldurdum; tutarı sen yazabilirsin.',
  'ekle.sesli.izin_yok': 'Sesle eklemek için mikrofon ve konuşma tanıma izni gerekiyor.',
  'ekle.sesli.kullanilamiyor': 'Bu cihazda konuşma tanıma kullanılamıyor.',
  'ekle.sesli.ses_yok': 'Bir şey duyamadım. Mikrofona biraz daha yakın konuşup yeniden dene.',
  'ekle.sesli.hata': 'Söylediklerin anlaşılamadı. Yeniden deneyebilirsin.',
  'a11y.ekle.sesli': 'Harcama alanlarını sesle doldur',
  'ayar.dil': 'Dil',
  'ayar.dil_aciklama': 'Uygulamada kullanılacak dili seç.',
  'ayar.para_birimi': 'Para birimi',
  'ayar.para_birimi_aciklama': 'Simge ve sayı biçimini değiştirir. Mevcut tutarlar dönüştürülmez.',
  'tasarruf.kazanim.etiket': 'AYIN KAZANIMI',
  'tasarruf.kazanim.pozitif': 'Tamamlanan günlerden kalan',
  'tasarruf.kazanim.negatif': 'Tamamlanan günlerin bütçe farkı',
  'tasarruf.birikim.toplam': 'Toplam birikim',
  'tasarruf.rutin.kazanimEtiket': 'Bu ay rutinlerden',
  'tasarruf.rutin.otomatik': 'Harcama eklenmeyen rutinler otomatik hesaplanır.',
  'tasarruf.rutin.otomatikKisa': 'Otomatik hesaplandı',
  'tasarruf.rutin.gunGun': 'GÜN GÜN TASARRUF',
  'tasarruf.bolum.birikimAlt': 'Gerçekten kenara ayırdığın parayı burada takip et.',
  'tasarruf.bolum.kategoriAlt': 'Bu ay paran en çok hangi alanlara gitti?',
  'tasarruf.bolum.rutinAlt': 'Almadığın küçük rutinlerin ay boyunca bıraktığı alan.',
  'ui.settings.defaults': 'Varsayılan',
  'ui.settings.goal_plan': 'Hedef ve plan',
  'ui.settings.account_data': 'Hesap ve veri',
  'ui.settings.finance_tools': 'Finans araçları',
  'ui.settings.quick_access': 'Hızlı erişim',
  'ui.settings.quick_access_note': 'Uygulama simgesine basılı tutarak “Sesli harcama” kısayolunu da kullanabilirsin.',
  'ui.settings.widget_title': 'Ana ekran widget’ı',
  'ui.settings.widget_description.android': 'Tek dokunuşla sesli harcama ekranını aç',
  'ui.settings.widget_description.ios': 'Ana veya kilit ekranından sesli harcama ekle',
  'ui.settings.quick_tile_title': 'Hızlı Ayarlar düğmesi',
  'ui.settings.quick_tile_description': 'Bildirim panelinden sesli harcama ekle',
  'ui.settings.widget_help_title': 'Widget’ı ekle',
  'ui.settings.widget_help_body': 'Ana ekranda veya kilit ekranında boş bir alana basılı tut. Düzenle ya da + düğmesine dokun, Trinkow’u bul ve “Sesli harcama” widget’ını ekle.',
  'ui.settings.widget_help_action': 'Sesli harcamayı aç',
  'ui.settings.quick_requested': 'Sistem ekleme penceresi açıldı.',
  'ui.settings.quick_added': 'Hızlı erişim eklendi.',
  'ui.settings.quick_already_added': 'Bu hızlı erişim zaten ekli.',
  'ui.settings.quick_dismissed': 'Ekleme işlemi iptal edildi.',
  'ui.settings.quick_manual': 'Hızlı Ayarlar açıldı. Düzenle düğmesinden Sesli harcama’yı ekleyebilirsin.',
  'ui.settings.quick_manual_required': 'Bildirim panelini açıp Düzenle düğmesinden Sesli harcama’yı ekleyebilirsin.',
  'ui.settings.quick_unavailable': 'Bu cihazda otomatik ekleme desteklenmiyor. Sistem widget veya Hızlı Ayarlar menüsünden elle ekleyebilirsin.',
  'ui.settings.support': 'Destek',
  'ui.settings.retry': 'Tekrar dene',
  'ui.settings.save_income': 'Geliri kaydet',
  'ui.settings.export_data': 'Verilerimi dışa aktar',
  'ui.settings.export_title': 'Trinkow veri dışa aktarımı',
  'ui.settings.export_failed': 'Veriler dışa aktarılamadı. Bağlantını kontrol edip yeniden dene.',
  'ui.settings.budget_title': 'Gelir ve bütçem',
  'ui.settings.budget_description': 'Gelirini ve sabit giderlerini düzenle',
  'ui.settings.limits_title': 'Limitler',
  'ui.settings.limits_description': 'Günlük ve kategori sınırlarını düzenle',
  'ui.settings.routines_title': 'Rutinler ve Abonelikler',
  'ui.settings.routines_description': 'Düzenli harcamalarını ve yenilenmeleri yönet',
  'ui.settings.favorites_title': 'Favorilerim',
  'ui.settings.favorites_description': 'Hızlı ekleme kalemlerini düzenle',
  'ui.settings.help_title': 'Yardım ve sık sorulanlar',
  'ui.settings.help_description': 'Trinkow kullanımıyla ilgili yanıtlar',
  'ui.settings.legal_title': 'Yasal ve gizlilik',
  'ui.settings.legal_description': 'Koşullar, gizlilik ve KVKK',
  'ui.budget.title': 'Bütçem',
  'ui.budget.changes_notice': 'Değişiklikler bugünden itibaren geçerli olur; geçmiş günlerin hesabı değişmez.',
  'ui.budget.income_expenses': 'Gelir ve giderler',
  'ui.budget.unknown_notice': 'Gelir veya borç bilinmiyorsa boş bırakabilirsin. Hedef birikim, gerçekleşmiş birikim sayılmaz.',
  'ui.budget.daily_limit': 'Otomatik günlük limit',
  'ui.budget.monthly_shortfall': 'Aylık bütçe açığı:',
  'ui.budget.distribution_notice': 'Gelir − sabit ödemeler − hedef birikim, ayın günlerine dağıtılır.',
  'ui.budget.save': 'Kaydet',
  'ui.budget.create': 'Bütçemi oluştur',
  'ui.budget.limits': 'Günlük ve kategori limitleri',
  'ui.budget.routines': 'Rutinler ve Abonelikler',
  'ui.analysis.expense_view': 'Gider görünümü',
  'ui.analysis.title': 'Analizler',
  'ui.analysis.selected_period': 'Seçili dönem',
  'ui.analysis.category_distribution': 'Kategori dağılımı',
  'ui.analysis.expense_share': 'Gider içindeki yüzdesel pay',
  'ui.analysis.category_load': 'Kategori yükü',
  'ui.analysis.income_share': 'Gelirinin ne kadarını kullandı?',
  'ui.analysis.no_expenses': 'Bu dönemde harcama yok.',
  'ui.analysis.no_expenses_detail': 'Harcama eklediğinde kategori oranları burada görünür.',
  'ui.analysis.highest': 'En yüksek',
  'ui.analysis.average': 'ortalama',
  'ui.analysis.total': 'Toplam',
  'ui.analysis.expense_percent': 'Giderin %',
  'ui.analysis.income_percent': 'Gelire yük %',
  'ui.subscriptions.title': 'Aboneliklerim',
  'ui.subscriptions.monthly_total': 'Aylık toplam',
  'ui.subscriptions.next_payment': 'Sıradaki ödeme',
  'ui.subscriptions.add': 'Abonelik ekle',
  'ui.subscriptions.notice': 'Yenilenme gününde Bugün ekranındaki + düğmesine dokunduğunda ücret giderlerine işlenir. Banka işlemleri otomatik doğrulanmaz.',
  'ui.subscriptions.every_month': '· Her ayın',
  'ui.subscriptions.day': '. günü',
  'ui.favorites.title': 'Sık kullanılanlar',
  'ui.favorites.name': 'Ürün adı',
  'ui.favorites.last_price': 'Son fiyat',
  'ui.favorites.save': 'Sık kullanılanlara kaydet',
  'ui.login.title': 'Hoş geldin',
  'ui.login.remember': 'Beni hatırla',
  'ui.login.forgot': 'Şifremi unuttum',
  'ui.login.submit': 'Giriş yap',
  'ui.login.no_account': 'Hesabın yok mu?',
  'ui.login.create_account': 'Hesap oluştur',
  'ui.login.legal': 'Gizlilik ve kullanım şartları',
  'ui.expense.new': 'Yeni kayıt',
  'ui.expense.favorites': 'Favoriler ve sık kullanılanlar',
  'ui.expense.routines': 'Rutin harcamalar',
  'ui.expense.quick_fill': 'Tek dokunuşla tutar ve kategoriyi doldur.',
  'ui.expense.item_or_note': 'Ürün veya açıklama',
  'ui.expense.payment_period': 'Ödeme periyodu',
  'ui.expense.subscription_monthly': 'Abonelik tutarı aylık gider olarak kaydedilir.',
  'ui.expense.other_details': 'Diğer detaylar',
  'ui.expense.save': 'Harcamayı kaydet',
  'ui.expense.change_category': 'Kategoriyi değiştir',
  'ui.expense.category': 'Kategori',
  'ui.expense.subscription_period_a11y': 'Abonelik ödeme periyodu, aylık',
  'ui.expense.add_note': 'Not ekle',
  'ui.account.delete_body': 'Hesabın, gelir ve borç bilgilerin, harcamaların, rutinlerin, sık kullanılanların ve bütçe geçmişin silinir. Tüm oturumların kapanır.',
  'ui.account.delete': 'Hesabımı kalıcı olarak sil',
  'ui.limits.title': 'Limitler',
  'ui.limits.changes_notice': 'Düzenleme bugün ve sonraki günlere uygulanır. Önceki günler değişmez.',
  'ui.limits.daily_limit': 'Günlük limit',
  'ui.limits.income_share': 'Gelirine göre günlük pay:',
  'ui.limits.distribution_notice': 'Bu paylar günlük limitin içindedir. Dağıtılmayan tutarı diğer harcamalarda kullanabilirsin.',
  'ui.limits.add_category': 'Kategori payı ekle',
  'ui.limits.archive_notice': 'Önceki aylık kategori limitlerin arşivlendi; günlük tutara çevrilmedi.',
  'ui.limits.save': 'Limitleri kaydet',
  'ui.summary.title': 'Özet',
  'ui.summary.month_analysis': '· Bu ayın analizi',
  'ui.summary.metrics_notice': 'Bu üç değer ayrı ölçümlerdir; birbirine eklenmez. Eksik gelir bilgisi olan dönemler bilinmiyor olarak gösterilir.',
  'ui.summary.empty_categories': 'İlk harcamanı eklediğinde kategorilerin burada görünür.',
  'ui.summary.savings': 'Aylık tasarruflarını incele',
  'ui.summary.edit_budget': 'Bütçemi düzenle',
  'ui.summary.favorites': 'Sık kullanılanlar',
  'ui.routines.description': 'Günlük rutinlerini seç, kendi adet ve fiyatını yaz. Birden fazla rutin ekleyebilirsin.',
  'ui.routines.custom': 'Kendim ekleyeyim',
  'ui.routines.name': 'Harcamanın adı',
  'ui.routines.daily_quantity': 'Günlük adet',
  'ui.routines.unit_price': 'Birim fiyat',
  'ui.routines.changes_notice': 'Rutin değişiklikleri bugünden itibaren geçerlidir. Harcama girmemek otomatik tasarruf sayılmaz.',
  'ui.routines.title': 'Rutinler ve Abonelikler',
  'ui.password.reset_title': 'Yeni şifre belirle',
  'ui.password.reset_success': 'Şifren yenilendi. Tüm cihazlardaki eski oturumların kapatıldı.',
  'ui.password.new': 'Yeni şifre',
  'ui.password.confirm_new': 'Yeni şifre tekrar',
  'ui.password.reset': 'Şifreyi yenile',
  'ui.password.request_link': 'Yeni bağlantı iste',
  'ui.password.forgot_title': 'Şifreni yenile',
  'ui.password.forgot_body': 'E-posta adresine 30 dakika geçerli bir şifre yenileme bağlantısı göndereceğiz.',
  'ui.password.email': 'E-posta',
  'ui.password.send_link': 'Bağlantı gönder',
  'ui.help.expense_question': 'Harcama nasıl eklenir?',
  'ui.help.expense_answer': 'Artı düğmesine dokun, kategori ve tutarı seçip kaydet. Sık kullanılan bir ürünü seçtiğinde son fiyatı dolar; kaydetmeden önce değiştirebilirsin.',
  'ui.help.savings_question': 'Tasarruf tutarı neyi gösterir?',
  'ui.help.savings_answer': 'Kaydettiğin gelir ve giderlerden hesaplanan kalan tutarı görürsün. Rutin harcamalarındaki fark ayrıca gösterilir ve toplama ikinci kez eklenmez. Bu tutar banka bakiyen değildir.',
  'ui.help.limits_question': 'Limit değiştirince geçmiş değişir mi?',
  'ui.help.limits_answer': 'Yeni limit düzenlediğin günden itibaren uygulanır. Önceki günlerin limitleri korunur.',
  'ui.help.password_question': 'Şifremi unuttum',
  'ui.help.password_answer': 'Giriş ekranındaki Şifremi unuttum bağlantısıyla e-postana yenileme bağlantısı iste. Bağlantı 30 dakika geçerlidir ve bir kez kullanılabilir.',
  'ui.help.delete_question': 'Hesabımı nasıl silerim?',
  'ui.help.delete_answer': 'Ayarlar → Hesabımı sil sayfasını aç. Silme işlemi hesabını ve kayıtlarını kaldırır; geri alınamaz. Çıkış yapmak kayıtlarını silmez.',
  'ui.help.support_title': 'Destek',
  'ui.help.support_body': 'Destek iletişim adresi henüz tanımlanmamıştır. Sorun bildirirken şifreni veya şifre yenileme bağlantını paylaşma.',
  'ui.common.back': 'Geri',
  'ui.common.cancel': 'Vazgeç',
  'ui.common.close': 'Kapat',
  'ui.common.undo_unavailable': 'Bu işlem geri alınamaz',
  'ui.common.over_limit': 'limit dışı',
  'ui.common.new_version': 'Yeni sürüm hazır',
  'ui.common.update_message': 'Trinkow’un yeni sürümü yayınlandı. Güncelleme şimdi güvenli biçimde indirilecek ve uygulama yeniden açılacak.',
  'ui.common.update_now': 'Şimdi güncelle',
  'ui.common.update_notice': 'Trinkow’un yeni sürümü yayınlandı. Güncelleme şimdi güvenli biçimde indirilecek ve uygulama yeniden açılacak.',
  'ui.common.play_version': 'Google Play sürüm kodu:',
  'ui.common.update_failed': 'Güncelleme başlatılamadı. İnternet bağlantını kontrol edip tekrar dene.',
  'ui.common.launching': 'Trinkow açılıyor',
  'ui.common.slogan': 'Evdeki Hesabı Çarşıya Uydurur',
  'ui.common.done': 'Bitti',
  'ui.common.loading': 'Yükleniyor…',
  'ui.common.load_failed': 'Bilgiler yüklenemedi. Bağlantını kontrol edip yeniden deneyebilirsin.',
  'ui.common.unknown': 'Henüz bilinmiyor',
  'ui.common.retry': 'Yeniden dene',
  'ui.subscription.delete': 'Aboneliği sil',
  'ui.subscription.find': 'Aboneliğini bul',
  'ui.subscription.search_help': 'Dünya genelindeki popüler servislerde ara. Logosu kaydında ve ödeme listende görünür.',
  'ui.subscription.search': 'Abonelik ara',
  'ui.subscription.results': 'Arama sonuçları',
  'ui.subscription.service': 'servis',
  'ui.subscription.not_found': 'Bu adla eşleşen hazır bir servis bulamadık.',
  'ui.subscription.add_named': '” adıyla ekle',
  'ui.subscription.custom_hint': 'Katalogda yoksa kendi aboneliğini oluştur',
  'ui.subscription.popular': 'Dünya genelinde popüler',
  'ui.subscription.quick_pick': 'Hızlı seçim',
  'ui.subscription.other': 'Diğer',
  'ui.subscription.other_hint': 'Listede olmayan bir abonelik ekle',
  'ui.subscription.name': 'Abonelik adı',
  'ui.subscription.monthly_price': 'Aylık ücret',
  'ui.subscription.renewal_day': 'Her ay yenilenme günü · 1–31',
  'ui.common.clear': 'Temizle',
  'ui.common.remaining': 'kaldı',
  'ui.common.remaining_amount': 'Kalan',
  'ui.common.swipe': 'Yana kaydır',
  'ui.common.spent': 'Harcanan',
  'ui.common.daily_limit': 'Günlük limit',
  'ui.common.daily_budget': 'Günlük bütçe',
  'ui.common.over_budget': 'Bütçe dışı',
  'ui.common.dismiss_card': 'Kartı kapat',
  'ui.common.manage_subscriptions': 'Abonelikleri yönet',
  'ui.common.renewing_today': 'Bugün yenilenen abonelikler',
  'ui.common.today': 'Bugün',
  'ui.common.times': 'kez',
  'ui.common.not_planned': 'Planlanmadı',
  'ui.common.selected': 'seçili',
  'ui.common.amount': 'Tutar',
  'ui.common.monthly_total': 'Aylık toplam',
  'ui.common.next_payment': 'Sıradaki ödeme',
  'ui.common.failed': 'İşlem tamamlanamadı. Bağlantını kontrol edip yeniden dene.',
  'ui.common.saved': 'Kaydedildi.',
  'ui.common.previous_month': 'Önceki ay',
  'ui.common.next_month': 'Sonraki ay',
  'ui.savings.category_empty': 'Bu dönemde kategori harcaması yok.',
  'ui.savings.net_activity': 'Bu dönem net hareket',
  'ui.savings.routine_savings': 'Rutin tasarrufları',
  'ui.savings.overview': 'Genel tasarruf durumu',
  'ui.savings.period': 'Tasarruf dönemi',
  'ui.analysis.load_error': 'Analizler yüklenemedi',
  'ui.profile.plan_load_error': 'Bazı plan bilgileri yenilenemedi. Menüleri yine de kullanabilirsin.',
  'ui.profile.plan': 'Planın',
  'ui.profile.account': 'Hesabın',
  'ui.subscriptions.upcoming': 'Yaklaşan ödemeler',
  'ui.subscriptions.empty_title': 'Aktif aboneliğin yok.',
  'ui.subscriptions.empty_body': 'Duraklatılan bir aboneliğe dokunup takibi yeniden açabilirsin.',
  'ui.subscriptions.paused': 'Duraklatılanlar',
  'ui.settings.load_error': 'Bazı bilgiler yenilenemedi. Görünen ayarları kullanabilir veya tekrar deneyebilirsin.',
  'ui.favorites.add_product': 'Ürün ekle',
  'ui.login.tagline': 'Harcama ve Bütçe Takibi ile Evdeki Hesabı Çarşıya Uydur',
  'ui.login.loading': 'Giriş yapılıyor…',
  'ui.login.dev_title': 'Geliştirme test girişi',
  'ui.login.dev_description': 'Yalnız test hesabıyla giriş yapar.',
  'ui.expense.remove_routine_link': 'Rutin bağlantısını kaldır',
  'ui.common.monthly': 'Aylık',
  'ui.account.delete_title': 'Hesabımı sil',
  'ui.account.delete_warning': 'Bu işlem geri alınamaz.',
  'ui.account.delete_confirm': 'Hesabımın ve kayıtlarımın silinmesini istiyorum',
  'ui.account.delete_error': 'Hesap silinemedi. Bağlantını kontrol et ve yeniden dene. İşlem tamamlandı olarak işaretlenmedi.',
  'ui.registration.title': 'Hesabını oluştur',
  'ui.registration.subtitle': 'Günlük harcamalarını birkaç saniyede görmeye başla.',
  'ui.registration.terms': '**Kullanım şartlarını** okudum, kabul ediyorum.',
  'ui.registration.privacy': '**Gizlilik politikasını** okudum, kabul ediyorum.',
  'ui.limits.budget_required_title': 'Önce bütçeni oluştur',
  'ui.limits.budget_required_body': 'Günlük limit için gelir veya manuel tutar bilgisi gerekli.',
  'ui.limits.go_to_budget': 'Bütçeme git',
  'ui.limits.category_allocations': 'Kategori payları',
  'ui.limits.total': 'Kategori toplamı',
  'ui.limits.undistributed': 'Dağıtılmamış',
  'ui.summary.spent': 'Harcadığın',
  'ui.summary.income_and_spending': 'Gelir ve harcama',
  'ui.summary.spendable': 'Harcanabilir',
  'ui.summary.remaining': 'Kalan',
  'ui.summary.category_analysis': 'Kategori analizi',
  'ui.summary.savings_title': 'Tasarrufların',
  'ui.summary.completed_days': 'Tamamlanan günlerden',
  'ui.summary.routine_skips': 'Rutinlerinden vazgeçişler',
  'ui.summary.savings_balance': 'Gerçek birikim bakiyen',
  'ui.routines.monthly_subscriptions': 'Aylık aboneliklerim',
  'ui.routines.subscriptions_description': 'Ücretleri ve yenilenme günlerini takip et',
  'ui.routines.daily_routines': 'Günlük rutinler',
  'ui.routines.remove_link': 'Rutin bağlantısını kaldır',
  'ui.password.reset_subtitle': 'Hesabın için güçlü ve hatırlayabileceğin bir şifre seç.',
  'ui.password.forgot_subtitle': 'E-postana güvenli, tek kullanımlık bir bağlantı gönderelim.',
  'ui.password.forgot_notice': 'Bu e-posta ile bir hesabın varsa şifre yenileme bağlantısı gönderilecek. Gelen kutunu ve spam klasörünü kontrol et.',
  'ui.common.update_launching': 'Güncelleme açılıyor',
  'ui.subscription.remove_selection': 'Seçimi kaldır',
  'ui.subscription.keep_tracking': 'Takibi açık tut',
  'ui.subscription.payment_notice': 'Banka hesabınla otomatik eşleşmez. Ödeme gerçekleşince bu ay ödendi olarak işaretleyebilirsin.',
  'ui.routines.load_error': 'Rutinler yüklenemedi. Yeniden dene.',
  'ui.subscriptions.load_error': 'Abonelikler yüklenemedi. Yeniden dene.',
  'ui.subscriptions.renewed_prompt': 'Aboneliğini yeniledin mi? Yenilendiyse + düğmesine dokun; giderlerine ekleyelim.',
  'ui.subscriptions.updated': 'Abonelik güncellendi.',
  'ui.subscriptions.added': 'Abonelik eklendi.',
  'ui.subscriptions.deleted': 'Abonelik silindi. Geçmiş gider kayıtların korundu.',
  'ui.subscriptions.delete_title': 'Abonelik silinsin mi?',
  'ui.subscriptions.delete_body': 'takip listesinden kaldırılacak. Geçmiş gider kayıtların silinmeyecek.',
  'ui.subscriptions.paused_status': 'Takip duraklatıldı',
  'ui.subscriptions.paid_status': 'Bu ay ödendi',
  'ui.subscriptions.renewing_status': 'Bugün yenileniyor',
  'ui.subscriptions.pay_by_card': 'Kart',
  'ui.subscriptions.pay_by_cash': 'Nakit',
  'ui.subscriptions.recorded': 'Giderlere işlendi',
  'ui.subscriptions.renewing_unprocessed': 'Bugün yenileniyor · İşlenmedi',
  'ui.subscriptions.renewal_day': '· Her ayın {gun}. günü',
  'ui.budget.updated': 'Bütçen bugünden itibaren güncellendi.',
  'ui.budget.save_failed': 'Kaydedilemedi. Geliri ve kategori paylarını kontrol et.',
  'ui.limits.automatic': 'Gelire göre otomatik',
  'ui.limits.manual': 'Ben belirleyeceğim',
  'ui.limits.saved': 'Limitler bugünden itibaren kaydedildi.',
  'ui.limits.save_failed': 'Kaydedilemedi. Kategori toplamı günlük limiti aşmamalı.',
  'ui.favorites.save_failed': 'İşlem tamamlanamadı. Yeniden deneyebilirsin.',
  'ui.expense.amount_editor_close': 'Tutar düzenleyiciyi kapat',
  'ui.expense.amount_editor_open': 'Tutarı düzenle',
  'ui.login.invalid_email': 'Geçerli bir e-posta adresi gir.',
  'ui.login.invalid_credentials': 'E-posta ya da şifre yanlış.',
  'ui.login.failed': 'Oturum açılamadı. Bağlantını kontrol edip yeniden dene.',
  'ui.login.google_not_configured': 'Google ile giriş bu uygulama sürümünde yapılandırılmamış.',
  'ui.login.google_native_required': 'Google ile giriş için uygulamayı yeniden yükleyip native geliştirme sürümünü aç.',
  'ui.login.google_play_services': 'Google Play Hizmetleri kullanılamıyor veya güncel değil.',
  'ui.login.google_signature_mismatch': 'Google ile giriş yapılandırması bu uygulama imzasıyla eşleşmiyor.',
  'ui.login.google_unavailable': 'Google ile giriş şu anda kullanılamıyor.',
  'ui.login.google_invalid': 'Google oturumu doğrulanamadı. Yeniden deneyebilirsin.',
  'ui.login.google_verification_unavailable': 'Google oturumu şu anda doğrulanamıyor. Biraz sonra yeniden dene.',
  'ui.login.google_network_failed': 'Google ile oturum açılamadı. Bağlantını kontrol edip yeniden dene.',
  'ui.login.google_failed': 'Google ile oturum açılamadı. Yeniden dene.',
  'ui.login.test_name': 'Test adı',
  'ui.account.email_label': 'Hesap e-postası',
  'ui.expense.edit_amount': 'Tutarı düzenle',
  'ui.expense.close_amount_editor': 'Tutar düzenleyiciyi kapat',
  'ui.routines.edit': 'Rutini düzenle',
  'ui.routines.add': 'Rutin ekle',
  'ui.routines.save_changes': 'Değişiklikleri kaydet',
  'ui.routines.save': 'Rutini kaydet',
  'ui.routines.active': 'Aktif rutinler',
  'ui.routines.selected': 'seçili',
  'ui.routines.remove': 'rutinini kaldır',
  'ui.routines.preset.coffee': 'Kahve',
  'ui.routines.preset.smoking': 'Sigara',
  'ui.routines.preset.meal': 'Yemek',
  'ui.routines.preset.transport': 'Ulaşım',
  'ui.routines.preset.snack': 'Atıştırmalık',
  'ui.routines.added': 'Rutin eklendi.',
  'ui.routines.updated': 'Rutin güncellendi.',
  'ui.routines.removed': 'Rutin kaldırıldı.',
  'ui.subscriptions.save_changes': 'Değişiklikleri kaydet',
  'ui.subscriptions.save': 'Aboneliği kaydet',
  'ui.subscriptions.edit': 'Aboneliği düzenle',
  'ui.subscriptions.show_in_renewal_list': 'Yenilenme listesinde gösterilir',
  'ui.subscriptions.paused_total': 'Duraklatıldı; toplamdan çıkarılır',
  'ui.subscriptions.add_named_accessibility': 'adıyla abonelik ekle',
  'ui.subscriptions.selected': 'seçili',
  'ui.tabs.today': 'Bugün',
  'ui.tabs.savings': 'Tasarruf',
  'ui.tabs.analytics': 'Analizler',
  'ui.common.limit_tools': 'Limitleri aç',
  'ui.common.lower_limit': 'Daha az göster',
  'ui.common.add_expense_for_day': 'Bu güne harcama ekle',
  'ui.common.no_spend_today': 'Bugün harcama yok',
  'ui.common.today_prefix': 'Bugün',
  'ui.common.budget_overrun': 'Limitin üzerinde',
  'ui.common.spending_no_limit': 'Günlük bütçe',
  'ui.common.over_limit_suffix': 'limit dışı',
  'ui.common.share': 'payı',
  'ui.savings.routine_empty': 'Bu dönemde rutin tasarrufu oluşmadı.',
  'ui.savings.not_calculated': 'henüz hesaplanmadı',
  'ui.savings.period_label': 'Tasarruf dönemi: ',
  'ui.savings.movements_empty': 'Bu dönemde birikim hareketi yok.',
  'ui.subscriptions.empty_prompt_title': 'Aylık ödemelerini tek yerde gör',
  'ui.subscriptions.empty_prompt_body': 'YouTube, yapay zeka veya diğer aboneliklerini ekle; yenilenme gününü kaçırma.',
  'ui.subscriptions.resume_prompt': 'Aktif aboneliğin yok. Duraklatılan bir aboneliğe dokunup takibi yeniden açabilirsin.',
  'ui.subscription.other_accessibility': 'Listede olmayan başka bir abonelik ekle',
  'ui.analysis.period_week': 'Hafta',
  'ui.analysis.period_day': 'Gün',
  'ui.analysis.period_month': 'Ay',
  'ui.analysis.period_year': 'Yıl',
  'ui.analysis.graph_week': 'Son 7 günün günlük harcamaları',
  'ui.analysis.graph_month': 'Son 30 günün günlük harcamaları',
  'ui.analysis.graph_year': 'Ocak–Aralık aylık harcama toplamları',
  'ui.analysis.highest_day': 'En yüksek gün',
  'ui.analysis.highest_month': 'En yüksek ay',
  'ui.analysis.no_spending': 'Harcama yok',
  'ui.analysis.frequency_day': 'Günlük',
  'ui.analysis.frequency_month': 'Aylık',
  'ui.tabs.profile': 'Profil',
  'cumle.analizGiderPay': "Giderin %{yuzde}'i",
  'cumle.analizGelirPay': 'Gelire yük %{yuzde}',
  'cumle.analizHalkaA11y': 'Kategori dağılımı, toplam {toplam}',
  'cumle.heroLimitKullanimA11y': '{bugun, select, evet {Bugünkü} other {O günkü}} limitinin yüzde {yuzde} kadarı kullanıldı',
  'cumle.heroLimitAsimA11y': '{bugun, select, evet {Bugünkü} other {O günkü}} limitinin {fark} üzerine çıktın.',
  'cumle.heroHarcamaA11y': '{tutar} harcandı',
  'cumle.abonelikGecikmeGun': '{gun} gün gecikti',
  'cumle.abonelikKalanGun': '{gun} gün kaldı',
  'cumle.abonelikSilGovde': '{ad} takip listesinden kaldırılacak. Geçmiş gider kayıtların silinmeyecek.',
  'cumle.abonelikAdiylaEkle': '“{ad}” adıyla abonelik ekle',
  'cumle.abonelikServisSayisi': '{adet} servis',
  'cumle.abonelikSatiriA11y': '{ad}, {tutar}, {durum}. Düzenle.',
  'cumle.abonelikKayitliA11y': '{ad} giderlere işlendi',
  'cumle.abonelikYenilendiyseEkleA11y': '{ad} yenilendiyse {tutar} gider olarak ekle',
  'cumle.yarinTekAbonelikUyarisi': 'Yarın {ad} aboneliğin {tutar} tutarla otomatik yenilenecek. Kullanmıyorsan iptal edebilirsin.',
  'cumle.yarinCokluAbonelikUyarisi': 'Yarın {adet} aboneliğin toplam {tutar} tutarla otomatik yenilenecek. Kullanmadıklarını iptal edebilirsin.',
  'cumle.rutinAlimSayisiBugun': 'Bugün {adet} kez',
  'cumle.rutinSatiriA11y': '{ad}. {kategori}, günde {adet} × {tutar}. Düzenle.',
  'cumle.rutinGunlukOzeti': 'Günde {adet} × {tutar}',
  'cumle.rutinKaldirA11y': '{ad} rutinini kaldır',
  'cumle.onboardingRutinSatiriA11y': '{ad}, {altYazi}, günlük toplam {tutar}. Düzenle',
  'cumle.harcamaSatiriA11y': '{birincil}, {tutar}, {ikincil}{limitDisi, select, evet {, limit dışı} other {}}',
  'cumle.hesapAcA11y': 'Hesabını aç. {eposta}. {olgu}, {baglam}',
  'cumle.hesapEpostasiA11y': 'Hesap e-postası {eposta}',
  'cumle.tasarrufGenelDurumA11y': 'Genel tasarruf durumu {tutar}',
  'cumle.kategoriPayA11y': '{kategori} payı',
  'cumle.tasarrufDonemiA11y': 'Tasarruf dönemi: {donem}',
  'cumle.favoriOzet': '{kategori} · Son fiyat {tutar}',
  'cumle.favoriHarcamaA11y': '{ad}. {ozet}. Harcama ekle.',
  'cumle.favoriKaldirA11y': '{ad} sık kullanılanlardan kaldır',
  'cumle.kategoriLimitKaldirA11y': '{kategori} payını kaldır',
  'cumle.taksitKisaEtiketi': '{mevcut}/{toplam} taksit',
  'cumle.seriPencereBaslik': 'Son 4 hafta',
  'cumle.ekleKategoriTahmini': 'Tahmin: {kategoriAdi}. Yanlışsa değiştir.',
  'cumle.ozetRutinTasarrufu': 'Rutin tasarrufu {tutar}',
  'cumle.tasarrufRutinOzet': '{gunSayisi} gün · {adet} adet alınmadı',
  'cumle.tasarrufRutinGunDetay': '{adet} adet alınmadı · birim {birimTutar}',
  'cumle.tasarrufRutinFazlaGun': '+{adet} gün daha bu toplama dahil',
  'ui.expense.note_added': 'Not eklendi',
  'cumle.rutinOzetYuklenemedi': '{toplam} kayıt · yüklenemedi',
  'cumle.rutinOzetAbonelikli': '{rutin} rutin · {abonelik} abonelik',
  'cumle.rutinOzetKaydedilen': '{rutin} rutin · {kaydedilen} kaydedildi',
  'cumle.abonelikGiderIslendi': '{ad} {tutar} gider olarak işlendi.',
  'cumle.sikKullanilanEkleA11y': '{ad}, {tutar}, {kategori}. Harcama olarak ekle',
  'ui.subscriptions.group.video': 'Dizi ve video',
  'ui.subscriptions.group.music': 'Müzik ve ses',
  'ui.subscriptions.group.ai': 'Yapay zekâ',
  'ui.subscriptions.group.cloud': 'Bulut ve üretkenlik',
  'ui.subscriptions.group.gaming': 'Oyun',
  'ui.subscriptions.group.health': 'Sağlık ve spor',
  'ui.subscriptions.group.education': 'Eğitim',
};

/**
 * §28.1 H1 — Türkçe bulunma hâli eki (-da/-de/-ta/-te) ünlü uyumu VE ünsüz
 * benzeşmesiyle değişir; `{Ay}'ta` gibi TEK bir kalıp 12 ayın 8'inde yanlış
 * üretir ("Eylül'ta", "Ağustos'de"). Ek burada TEK yerden, hazır dize
 * olarak okunur — çalışma zamanında hesaplanmaz (K-040 deseni).
 */
const AY_ICINDE = [
  "Ocak'ta", "Şubat'ta", "Mart'ta", "Nisan'da", "Mayıs'ta", "Haziran'da",
  "Temmuz'da", "Ağustos'ta", "Eylül'de", "Ekim'de", "Kasım'da", "Aralık'ta",
];

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

/**
 * Türkçe ünlü uyumlu ek tabloları — ones basamağına göre (bkz. `gunEki`).
 * index 0 kullanılmaz; 10/20/30 kendi sözcüğünün (on/yirmi/otuz) ekini alır,
 * onun dışındaki her sayı SON basamağın (birler) ekini alır ("on beş" →
 * "beş" ekini, "yirmi altı" → "altı" ekini vb.) — TDK'nin bilinen tarih
 * yazım kuralı, algoritma değil sabit tablo (yalnız 1-31 aralığı var).
 */
const EK_BULUNMA = ['', 'inde', 'sinde', 'ünde', 'ünde', 'inde', 'sında', 'sinde', 'inde', 'unda'];
const EK_IYELIK = ['', 'i', 'si', 'ü', 'ü', 'i', 'sı', 'si', 'i', 'u'];

/** 1-9 birler ekinden farklı özel onluklar: on/yirmi/otuz kendi ekini taşır. */
function ozelOnlukEki(gun: number, tablo: 'bulunma' | 'iyelik'): string | null {
  if (gun === 10) return tablo === 'bulunma' ? 'unda' : 'u';
  if (gun === 20) return tablo === 'bulunma' ? 'sinde' : 'si';
  if (gun === 30) return tablo === 'bulunma' ? 'unda' : 'u';
  return null;
}

/** Ürün kataloğu adları — `src/content/urunKatalogu.ts` kimlikleriyle (80 kalem). */
export const katalog = {
  'filtre-kahve': 'Filtre kahve',
  'turk-kahvesi': 'Türk kahvesi',
  'latte': 'Latte',
  'sutlu-kahve': 'Sütlü kahve',
  'soguk-kahve': 'Soğuk kahve',
  'cay': 'Çay',
  'simit': 'Simit',
  'pogaca': 'Poğaça',
  'tatli': 'Tatlı',
  'doner': 'Döner',
  'lahmacun': 'Lahmacun',
  'pide': 'Pide',
  'kebap': 'Kebap',
  'tost': 'Tost',
  'hamburger': 'Hamburger',
  'pizza': 'Pizza',
  'ogle-yemegi': 'Öğle yemeği',
  'kahvalti-tabagi': 'Kahvaltı tabağı',
  'yemek-siparisi': 'Yemek siparişi',
  'haftalik-market': 'Haftalık market',
  'ekmek': 'Ekmek',
  'sut': 'Süt',
  'yumurta': 'Yumurta',
  'peynir': 'Peynir',
  'meyve-sebze': 'Meyve ve sebze',
  'et-tavuk': 'Et ve tavuk',
  'su-damacanasi': 'Su damacanası',
  'temizlik-malzemesi': 'Temizlik malzemesi',
  'kisisel-bakim': 'Kişisel bakım',
  'atistirmalik': 'Atıştırmalık',
  'toplu-tasima-yuklemesi': 'Toplu taşıma yüklemesi',
  'sehirlerarasi-otobus-bileti': 'Şehirlerarası otobüs bileti',
  'taksi': 'Taksi',
  'otopark': 'Otopark',
  'kopru-otoyol-gecisi': 'Köprü ve otoyol geçişi',
  'ucak-bileti': 'Uçak bileti',
  'kargo': 'Kargo',
  'arac-bakimi': 'Araç bakımı',
  'benzin': 'Benzin',
  'motorin': 'Motorin',
  'lpg': 'LPG',
  'elektrik-faturasi': 'Elektrik faturası',
  'su-faturasi': 'Su faturası',
  'dogalgaz-faturasi': 'Doğalgaz faturası',
  'internet-faturasi': 'İnternet faturası',
  'telefon-faturasi': 'Telefon faturası',
  'aidat': 'Aidat',
  'motorlu-tasitlar-vergisi': 'Motorlu taşıtlar vergisi',
  'kira': 'Kira',
  'ev-esyasi': 'Ev eşyası',
  'mobilya': 'Mobilya',
  'tadilat-usta': 'Tadilat ve usta',
  'ev-tekstili': 'Ev tekstili',
  'muzik-aboneligi': 'Müzik aboneliği',
  'dizi-film-aboneligi': 'Dizi ve film aboneliği',
  'spor-salonu-uyeligi': 'Spor salonu üyeliği',
  'bulut-depolama': 'Bulut depolama',
  'oyun-aboneligi': 'Oyun aboneliği',
  'yazilim-aboneligi': 'Yazılım aboneliği',
  'sinema-bileti': 'Sinema bileti',
  'konser-bileti': 'Konser bileti',
  'mac-bileti': 'Maç bileti',
  'oyun-ici-satin-alma': 'Oyun içi satın alma',
  'kitap': 'Kitap',
  'muze-sergi': 'Müze ve sergi',
  'ust-giyim': 'Üst giyim',
  'pantolon': 'Pantolon',
  'ayakkabi': 'Ayakkabı',
  'dis-giyim': 'Dış giyim',
  'eczane': 'Eczane',
  'doktor-muayenesi': 'Doktor muayenesi',
  'dis-hekimi': 'Diş hekimi',
  'gozluk-lens': 'Gözlük ve lens',
  'tahlil-goruntuleme': 'Tahlil ve görüntüleme',
  'vitamin-takviye': 'Vitamin ve takviye',
  'sigara-paketi': 'Sigara paketi',
  'sarma-tutun': 'Sarma tütün',
  'nargile': 'Nargile',
  'bira': 'Bira',
  'sans-oyunu': 'Şans oyunu',
};

const tr: DilPaketi = {
  metinler,
  takvim: {
    aylar: AYLAR,
    aylarTarih: AYLAR,
    aylarKisa: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    ayIcinde: AY_ICINDE,
    gunler: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    haftaGunKisa: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    haftaGunMikro: ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'],
  },
  /**
   * Ayın günü + bulunma hâli eki: 15 → "15'inde" (`ob.maas.donem` cümlesi).
   * metinler.md'nin şablonu ekini örnek gün (15) için sabit yazmıştı; bu
   * yalnız birler basamağı {1,5,8}'de doğrudur, diğer 21 günde yanlış çıkardı
   * (K-040'ın uyardığı "yazılı olmayan sayı iki kez kodlanır" tuzağının metin
   * tarafı) — PM'e bildirildi, ek burada TEK yerden hesaplanır.
   */
  gunBulunma: (gun) => `${gun}'${ozelOnlukEki(gun, 'bulunma') ?? EK_BULUNMA[gun % 10]}`,
  /** Ayın günü + iyelik eki: 15 → "15'i" (E-03 kurulum özeti değeri). */
  gunIyelik: (gun) => `${gun}'${ozelOnlukEki(gun, 'iyelik') ?? EK_IYELIK[gun % 10]}`,
  katalog,
};

export default tr;
