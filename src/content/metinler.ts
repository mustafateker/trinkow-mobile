/**
 * Arayüz metinleri — tek kaynak: ../agency/projects/trinkow/docs/content/metinler.md.
 * Kodda cümle uydurulmaz. Yeni metin gerekiyorsa önce metinler.md'ye eklenir.
 *
 * Anahtarlar metinler.md'deki i18n anahtarlarıyla birebir aynıdır.
 */
export const t = {
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
  'ob.rutin.sonra': "Rutinleri sonra Profil → Rutinlerim'den değiştirebilirsin.",
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
  'ob.ozet.degistir': "Limitini Profil → Bütçe ve rutinler'den her zaman değiştirebilirsin.",
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
  'gunluk.hero.gecmis': 'o gün harcanan',
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
  'seri.hero.birim': 'gün',
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
  'pano.hero.takip': 'bugün kalan',
  'pano.hero.tasarruf': 'bu ay biriken',
  'pano.hero.borc': 'kalan borç',
  /**
   * tokens.md §7.5 / §1.5 — limit dışında kahraman sayının altındaki etiket
   * birebir "limit dışı" sözcüğüdür. metinler.md'de henüz anahtarı yok;
   * PM'e bildirildi (öneri: `pano.hero.limit_disi`).
   */
  'pano.hero.limit_disi': 'limit dışı',
  'pano.alt.bos': 'Bugün henüz bir şey yazmadın.',
  'pano.limit_sorgu.govde': 'Limit gerçekçi mi. Birlikte bakalım.',
  'pano.limit_sorgu.eylem': 'Limiti gözden geçir',

  // §3.2b limitsiz varyant (`HeroPlain`)
  'pano.limitsiz.deger': 'Limit yok',
  'pano.hero.limitsiz': 'bugün harcanan',
  'pano.liste.adet': 'kayıt',

  // §13 boş durumlar — E-10 ilk gün
  'bos.pano.baslik': 'Bugün boş',
  'bos.pano.govde': 'Bugün henüz bir şey yazmadın. İlk kahve iyi bir başlangıç.',
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
  'ayar.gun_siniri': 'Gün sınırı',
  'ayar.gun_siniri_aciklama': 'Gün bu saatte başlar. Gece geç harcayanlar için.',
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
  'gunlukRutin.baslik': 'Rutinler',
  'gunlukRutin.aldim': 'Aldım',
  'gunlukRutin.almadim': 'Almadım',
  'gunlukRutin.durum.almadim': 'Vazgeçtin · rutin tasarrufu',
  'gunlukRutin.tumu': 'Tüm rutinler',
  'gunlukRutin.toast.geriAl': 'Geri al',
  'gunlukRutin.hata.isaret': 'İşaret kaydedilemedi. Yeniden dene.',

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
  'profil.kimlik.serit.yok': 'Seri henüz başlamadı',
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
  'profil.satir.rutinlerBos': 'Vazgeçtiğin rutinleri buradan yönet',
  'profil.satir.favorilerBos': 'Sık kullandığın harcamaları kaydet',
  'profil.satir.taksitlerBos': 'Taksitli harcamalarını buradan takip et',
  'profil.satir.rutinler': 'Rutinler',
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
} as const;

/** `Bugün {harcanan}. Limitinin {fark} altındasın.` */
export function altAltinda(harcanan: string, fark: string): string {
  return `Bugün ${harcanan}. Limitinin ${fark} altındasın.`;
}

/** `Günlük limitin doldu. Bugün {harcanan}.` */
export function altDoldu(harcanan: string): string {
  return `Günlük limitin doldu. Bugün ${harcanan}.`;
}

/** `Limitin {fark} üzerindesin.` */
export function altDisinda(fark: string): string {
  return `Limitin ${fark} üzerindesin.`;
}

/** `pano.limitsiz.ozet` — "Bugün {adet} kayıt yazdın. Limit koymadığın için kalan gösterilmiyor." */
export function panoLimitsizOzet(adet: number): string {
  return `Bugün ${adet} kayıt yazdın. Limit koymadığın için kalan gösterilmiyor.`;
}

/** `ob.sayac` — "{adim}/4" (kurulum başlık çubuğunun tek metni, §2.1). */
export function obSayac(adim: number, toplam: number): string {
  return `${adim}/${toplam}`;
}

/** `ob.rutin.gunluk_toplam` — "Günlük {tutar}" (3/4 bölüm başlığının sağı). */
export function obRutinGunlukToplam(tutar: string): string {
  return `Günlük ${tutar}`;
}

/** `ob.rutin.satir_alt` — "Her gün {adet} × {fiyat}" (`RoutineRow` alt yazısı). */
export function obRutinSatirAlt(adet: number, fiyat: string): string {
  return `Her gün ${adet} × ${fiyat}`;
}

/** `ob.rutin.ayna` — "Ayda {tutar}" (`MirrorWell` üst satırı). */
export function obRutinAyna(tutar: string): string {
  return `Ayda ${tutar}`;
}

/** `ob.rutin.ayna_formul` — "Her gün {adet} × {fiyat} × 30 gün" (`MirrorWell` formülü). */
export function obRutinAynaFormul(adet: number, fiyat: string): string {
  return `Her gün ${adet} × ${fiyat} × 30 gün`;
}

/** `Günlük limit {tutar}` — kahraman kartın sağ üst etiketi (prototip). */
export function gunlukLimitEtiketi(tutar: string): string {
  return `Günlük limit ${tutar}`;
}

/** `Günlük toplam {tutar}` — `kayitlar.gun_toplam` */
export function gunToplamEtiketi(tutar: string): string {
  return `Günlük toplam ${tutar}`;
}

/** `Bu ay {sira}. limit aşımı` — `pano.limit_sorgu.baslik` */
export function limitSorguBasligi(sira: number): string {
  return `Bu ay ${sira}. limit aşımı`;
}

/** `ekle.taksit.onizleme` — "Ayda {tutar} · {ay} ay" */
export function ekleTaksitOnizleme(tutar: string, ay: number): string {
  return `Ayda ${tutar} · ${ay} ay`;
}

/** `ekle.limit_disi_uyari` — "Bu harcama günlük limitin {fark} üzerine çıkarır." */
export function ekleLimitDisiUyari(fark: string): string {
  return `Bu harcama günlük limitin ${fark} üzerine çıkarır.`;
}

/** `toast.kaydedildi` — "{tutar} kaydedildi" */
export function toastKaydedildi(tutar: string): string {
  return `${tutar} kaydedildi`;
}

/** `toast.kaydedildi_limit_disi` — "{tutar} kaydedildi · {fark} limit dışı" */
export function toastKaydedildiLimitDisi(tutar: string, fark: string): string {
  return `${tutar} kaydedildi · ${fark} limit dışı`;
}

/** `toast.tekrarlandi` — "{tutar} yeniden eklendi" (Akış C · Latte Faktörü) */
export function toastTekrarlandi(tutar: string): string {
  return `${tutar} yeniden eklendi`;
}

/** `detay.taksit_bilgi` — "{mevcut}/{toplam} taksit · her ay {tutar}" */
export function detayTaksitBilgi(mevcut: number, toplam: number, tutar: string): string {
  return `${mevcut}/${toplam} taksit · her ay ${tutar}`;
}

/** `sil.govde_taksit` — "Kalan {adet} taksit de silinecek. Geri alınamaz." */
export function silGovdeTaksit(adet: number): string {
  return `Kalan ${adet} taksit de silinecek. Geri alınamaz.`;
}

/** `kayitlar.gun_toplam_limit_disi` — "{tutar} · limit dışı" */
export function kayitlarGunToplamLimitDisi(tutar: string): string {
  return `${tutar} · limit dışı`;
}

/** `kayitlar.ay_ozet` — "{adet} kayıt · {tutar}" */
export function kayitlarAyOzeti(adet: number, tutar: string): string {
  return `${adet} kayıt · ${tutar}`;
}

/** `kayitlar.yer_tutucu.baslik` — "{ay} kayıtları" */
export function kayitlarYerTutucuBasligi(ay: string): string {
  return `${ay} kayıtları`;
}

/* --------------------------------------------------------- E-15 kategori */

/** `kategori.bu_ay` — "Bu ay {tutar}" */
export function kategoriBuAy(tutar: string): string {
  return `Bu ay ${tutar}`;
}

/** `kategori.limit_ust` — "Aylık limit {tutar}" */
export function kategoriLimitUst(tutar: string): string {
  return `Aylık limit ${tutar}`;
}

/** `kategori.limit_disi` — "Aylık limitin {fark} üzerinde" */
export function kategoriLimitDisi(fark: string): string {
  return `Aylık limitin ${fark} üzerinde`;
}

/** `kategori.ortalama` — "Günlük ortalama {tutar}. Tahmini." */
export function kategoriOrtalama(tutar: string): string {
  return `Günlük ortalama ${tutar}. Tahmini.`;
}

/** `kategori.adet` — "{adet} kayıt" */
export function kategoriAdet(adet: number): string {
  return `${adet} kayıt`;
}

/** boş durum başlığı — "{kategori} için kayıt yok" */
export function kategoriBosBaslik(kategoriAdi: string): string {
  return `${kategoriAdi} için kayıt yok`;
}

/** `a11y.kategori_gun` — "{gun} {ay}" (E-15 satır erişilebilirliği) */
export function kategoriGunEtiketi(gun: string, ay: string): string {
  return `${gun} ${ay}`;
}

/* ------------------------------------------------------------- E-16 özet */

/** `ozet.hafta_araligi` biçiminde tarih aralığı zaten `lib/tarih.ts#haftaAraligi`de. */

/** `ozet.gecen_gun_ortalama` — "Geçen {adet} günün ortalaması" */
export function ozetGecenGunOrtalama(adet: number): string {
  return `Geçen ${adet} günün ortalaması`;
}

/** `ozet.limit_cizgisi` — "günlük limit {tutar}" */
export function ozetLimitCizgisi(tutar: string): string {
  return `günlük limit ${tutar}`;
}

/** `ozet.limit_alti_gun` — "Bu hafta {adet} gün limit altında." */
export function ozetLimitAltiGun(adet: number): string {
  return `Bu hafta ${adet} gün limit altında.`;
}

/** `ozet.limit_disi_gun` — "Bu hafta {adet} gün limit dışı." */
export function ozetLimitDisiGun(adet: number): string {
  return `Bu hafta ${adet} gün limit dışı.`;
}

/** `ozet.en_cok` + kategori adı — "En çok harcadığın kategori {kategori}" */
export function ozetEnCok(kategoriAdi: string): string {
  return `${t['ozet.en_cok']} ${kategoriAdi}`;
}

/** `ozet.dagilim_gun` — "{adet} gün" */
export function ozetDagilimGun(adet: number): string {
  return `${adet} gün`;
}

/** `ozet.pay` — "%{oran}" */
export function ozetPay(oran: number): string {
  return `%${oran}`;
}

/** `ozet.kucuk_harcama_alt` — "{adet} harcama · ortalama {tutar}" */
export function ozetKucukHarcamaAlt(adet: number, ortalama: string): string {
  return `${adet} harcama · ortalama ${ortalama}`;
}

/** `ozet.taksit_yuku` — "Önümüzdeki ay taksit yükü {tutar}" */
export function ozetTaksitYuku(tutar: string): string {
  return `Önümüzdeki ay taksit yükü ${tutar}`;
}

/** `ozet.limit_sorgu.baslik` — "Günlük limit {tutar}" */
export function ozetLimitSorguBasligi(tutar: string): string {
  return `Günlük limit ${tutar}`;
}

/**
 * `pano.taksit_yuku.alt` (§22.5) — "{adet} seri sürüyor. Sonuncusu {ayYil}
 * tarihinde bitiyor." E-16'daki taksit yükü kartı da aynı cümleyi kullanır
 * (E-10 ve E-16 aynı kavramı — gelecek ayın taksit yükünü — anlatır).
 */
export function taksitYukuAltMetni(adet: number, ayYil: string): string {
  return `${adet} seri sürüyor. Sonuncusu ${ayYil} tarihinde bitiyor.`;
}

/* ---------------------------------------------------------- E-17 limitler */

/** `limitler.toplam_notu` — "Kategori limitleri toplamı {tutar}. Günlük limitinle karşılaştır." */
export function limitlerToplamNotu(tutar: string): string {
  return `Kategori limitleri toplamı ${tutar}. Günlük limitinle karşılaştır.`;
}

/** `limitler.su_anki` — "Şu anki limitin {tutar}." */
export function limitlerSuAnki(tutar: string): string {
  return `Şu anki limitin ${tutar}.`;
}

/** `toast.limit_kaldirildi` — "{kategori} limiti kaldırıldı" */
export function toastLimitKaldirildi(kategoriAdi: string): string {
  return `${kategoriAdi} limiti kaldırıldı`;
}

/** `toast.limit_guncellendi` — "Günlük limit {tutar} olarak güncellendi" */
export function toastLimitGuncellendi(tutar: string): string {
  return `Günlük limit ${tutar} olarak güncellendi`;
}

/** `a11y.kategori_limit_degistir` — "{kategori} limitini değiştir" */
export function a11yKategoriLimitDegistir(kategoriAdi: string): string {
  return `${kategoriAdi} limitini değiştir`;
}

/** `a11y.kategori_limit_kaldir` — "{kategori} limitini kaldır" */
export function a11yKategoriLimitKaldir(kategoriAdi: string): string {
  return `${kategoriAdi} limitini kaldır`;
}

/* --------------------------------------------------------- E-18 taksitler */

/** `taksit.gelecek` — "{ay} ayında {tutar}" */
export function taksitGelecek(ay: string, tutar: string): string {
  return `${ay} ayında ${tutar}`;
}

/** `taksit.kalan_toplam` — "Kalan toplam {tutar}. Sonuncusu {ayYil} tarihinde bitiyor." */
export function taksitKalanToplam(tutar: string, ayYil: string): string {
  return `Kalan toplam ${tutar}. Sonuncusu ${ayYil} tarihinde bitiyor.`;
}

/** `taksit.seri_bitti` — ürün adı yoksa yedek: "{kategori} serisi {ay} ayında bitti. Aylık yük {tutar} düştü." */
export function taksitSeriBitti(kategoriAdi: string, ay: string, tutar: string): string {
  return `${kategoriAdi} serisi ${ay} ayında bitti. Aylık yük ${tutar} düştü.`;
}

/** REV3 §30.2 `taksit.seri_bitti_urun` — "{urun} taksidi {ay} ayında bitti. Aylık yük {tutar} düştü." */
export function taksitSeriBittiUrun(urunAdi: string, ay: string, tutar: string): string {
  return `${urunAdi} taksidi ${ay} ayında bitti. Aylık yük ${tutar} düştü.`;
}

/** REV3 §30.2 `taksit.ozet_kategorili` — çok kategorili bölüm başlığının sağı: "{n} kategori · {n} ürün". */
export function taksitOzetKategorili(kategoriSayisi: number, urunSayisi: number): string {
  return `${kategoriSayisi} kategori · ${urunSayisi} ürün`;
}

/** REV3 §30.2 `taksit.ozet_tek_kategori` — tek kategoride bölüm başlığının sağı: "{n} ürün". */
export function taksitOzetTekKategori(urunSayisi: number): string {
  return `${urunSayisi} ürün`;
}

/** REV3 §30.2 `taksit.kategori_ozet` — kapalı kategori akordiyonunun özeti: "{tutar} · {n} ürün". */
export function taksitKategoriOzet(tutar: string, urunSayisi: number): string {
  return `${tutar} · ${urunSayisi} ürün`;
}

/** REV3 §30.2 `taksit.seri_kalan` — ürün satırının ikincil satırı: "{mevcut}/{toplam} · kalan {tutar}". */
export function taksitSeriKalan(mevcut: number, toplam: number, kalanTutar: string): string {
  return `${mevcut}/${toplam} · kalan ${kalanTutar}`;
}

/** REV3 §30.2 `taksit.urun_yok` — ürün adı boş kaydedilmiş serinin satır başlığı: "{Kategori} taksidi". */
export function taksitUrunYok(kategoriAdi: string): string {
  return `${kategoriAdi} taksidi`;
}

/** REV3 §30.4 `a11y.taksit.kategori` — "{kategori}. {tutar}, {n} ürün". */
export function a11yTaksitKategori(kategoriAdi: string, tutar: string, urunSayisi: number): string {
  return `${kategoriAdi}. ${tutar}, ${urunSayisi} ürün`;
}

/** REV3 §30.4 `a11y.taksit.seri` — "{urun}. Bu ay {tutar}. {mevcut}. taksit, {toplam} taksitten. Kalan {kalan}. Ayrıntıyı aç" */
export function a11yTaksitSeri(urunAdi: string, tutar: string, mevcut: number, toplam: number, kalanTutar: string): string {
  return `${urunAdi}. Bu ay ${tutar}. ${mevcut}. taksit, ${toplam} taksitten. Kalan ${kalanTutar}. Ayrıntıyı aç`;
}

/** REV3 §30.4 `a11y.taksit.seri_son` — "{urun}. Bu ay {tutar}. Son taksit. Ayrıntıyı aç" */
export function a11yTaksitSeriSon(urunAdi: string, tutar: string): string {
  return `${urunAdi}. Bu ay ${tutar}. Son taksit. Ayrıntıyı aç`;
}

/** REV3 §30.4 `a11y.taksit.tumunu_goster` — "{n} ürünün tamamını göster" */
export function a11yTaksitTumunuGoster(urunSayisi: number): string {
  return `${urunSayisi} ürünün tamamını göster`;
}

/* --------------------------------------------------- v4 · E-10 Günlük */

/** `gunluk.o_gun_limiti` — "O gün limiti {tutar}" */
export function gunlukOGunLimiti(tutar: string): string {
  return `O gün limiti ${tutar}`;
}

/** `gunluk.gun_kapandi` — "Gün kapandı. {adet} kayıt, {tutar}." */
export function gunlukGunKapandi(adet: number, tutar: string): string {
  return `Gün kapandı. ${adet} kayıt, ${tutar}.`;
}

/** `gunluk.gun_kapandi_disinda` — "Gün kapandı. {tutar}, limitin {fark} üzerinde." */
export function gunlukGunKapandiDisinda(tutar: string, fark: string): string {
  return `Gün kapandı. ${tutar}, limitin ${fark} üzerinde.`;
}

/** `seri.cip` a11y — "Seri {n} gün. Seri ekranını aç" · görünen etiket "Seri {n} gün" */
export function seriCipEtiketi(n: number): string {
  return `Seri ${n} gün`;
}
export function seriCipA11y(n: number): string {
  return `Seri ${n} gün. Seri ekranını aç`;
}

/** `gunluk.grup.bugun` / `.kalan` / `.limit_disi` — kategori satırı ikincil bilgisi */
export function gunlukGrupBugun(tutar: string): string {
  return `bugün ${tutar}`;
}
export function gunlukGrupKalan(tutar: string): string {
  return `kalan ${tutar}`;
}
export function gunlukGrupLimitDisi(tutar: string): string {
  return `${tutar} limit dışı`;
}

/** `gunluk.a11y.gruba_ekle` — "{kategori} kategorisine harcama ekle" */
export function gunlukA11yGrubaEkle(kategoriAdi: string): string {
  return `${kategoriAdi} kategorisine harcama ekle`;
}

/* --------------------------------------------------------- v4 · E-21 Seri */

/** `seri.aktif.govde` — "{n} gündür kayıt giriyorsun." */
export function seriAktifGovde(n: number): string {
  return `${n} gündür kayıt giriyorsun.`;
}

/** `seri.durak.kalan` — "{n} gün kaldı" */
export function seriDurakKalan(n: number): string {
  return `${n} gün kaldı`;
}

/** `seri.durak.sonraki` — "Sıradaki durak {n} gün" */
export function seriDurakSonraki(n: number): string {
  return `Sıradaki durak ${n} gün`;
}

/** `seri.durak.a11y` — "{n} gün durağı geçildi / sırada / ileride" */
export function seriDurakA11y(n: number, hal: 'gecildi' | 'sirada' | 'ileride'): string {
  const kelime = hal === 'gecildi' ? 'geçildi' : hal === 'sirada' ? 'sırada' : 'ileride';
  return `${n} gün durağı ${kelime}`;
}

/** `seri.pencere` — "Son 4 hafta" başlığının altındaki tarih aralığı zaten `haftaAraligi`de. */
export const SERI_PENCERE_BASLIK = 'Son 4 hafta';

/** `seri.gun.a11y` — "{g} {Ay}, limit altında / limit dışı / kayıt yok" */
export function seriGunA11y(gunAy: string, durum: 'altinda' | 'disinda' | 'bos'): string {
  const metin = durum === 'altinda' ? 'limit altında' : durum === 'disinda' ? 'limit dışı' : 'kayıt yok';
  return `${gunAy}, ${metin}`;
}

/** `kutlama.baslik` — "{n} gün" */
export function kutlamaBaslik(n: number): string {
  return `${n} gün`;
}

/** `kutlama.govde` — "Seri {n} güne ulaştı. Sıradaki durak {m} gün." (son durak: "Sıradaki durak yok.") */
export function kutlamaGovde(n: number, sonrakiDurak: number | null): string {
  return sonrakiDurak
    ? `Seri ${n} güne ulaştı. Sıradaki durak ${sonrakiDurak} gün.`
    : `Seri ${n} güne ulaştı.`;
}

/* ----------------------------------------------------- v4 · E-24 Gün seçici */

/** `gunsec.alt.kayitli` — "{n} gün kayıtlı" */
export function gunsecAltKayitli(n: number): string {
  return `${n} gün kayıtlı`;
}

/** `gunsec.alt.acik_gun` — "Açık gün {g} {Ay}" */
export function gunsecAltAcikGun(gAy: string): string {
  return `Açık gün ${gAy}`;
}

/** `gunsec.sinir.baslangic` — "Trinkow'a {g} {Ay}'ta başladın. Daha öncesi yok." */
export function gunsecSinirBaslangic(gAy: string): string {
  return `Trinkow'a ${gAy}'ta başladın. Daha öncesi yok.`;
}

/** `gunsec.ozet.baslik` — "{Ay} özeti" */
export function gunsecOzetBasligi(ayAdi: string): string {
  return `${ayAdi} özeti`;
}

/** `gunsec.a11y.gun` — "{g} {Ay} {GünAdı}, {durum}[, bugün]" */
export function gunsecA11yGun(gAyGunAdi: string, durum: string, bugunMu: boolean): string {
  return bugunMu ? `${gAyGunAdi}, ${durum}, bugün` : `${gAyGunAdi}, ${durum}`;
}

/* ----------------------------------------------------- v4 · E-11 ürün arama */

/** `ekle.arama.satir.gecen` — "{kategori} · geçen sefer {tutar}" */
export function ekleAramaSatirGecen(kategoriAdi: string, tutar: string): string {
  return `${kategoriAdi} · geçen sefer ${tutar}`;
}

/** `ekle.arama.yeni.baslik` — `"{arama}" olarak ekle` */
export function ekleAramaYeniBaslik(arama: string): string {
  return `"${arama}" olarak ekle`;
}

/** `ekle.arama.yeni.alt` — "Kategoriyi ve tutarı sen seç." */
export const EKLE_ARAMA_YENI_ALT = 'Kategoriyi ve tutarı sen seç.';

/** `ekle.tutar.oneri.cip` — "Geçen sefer {tutar}" */
export function ekleTutarOneriCip(tutar: string): string {
  return `Geçen sefer ${tutar}`;
}

/** `ekle.gun.serit` — "Bu kayıt {gün}'e yazılacak." */
export function ekleGunSeridi(gun: string): string {
  return `Bu kayıt ${gun}'e yazılacak.`;
}

/** `a11y.ekle.gun` — "Gün seç, şu an {gün}" */
export function a11yEkleGun(gun: string): string {
  return `Gün seç, şu an ${gun}`;
}

/** `a11y.ekle.oneriCip` — "Geçen sefer ödediğin {tutar} tutarını kullan" */
export function a11yEkleOneriCip(tutar: string): string {
  return `Geçen sefer ödediğin ${tutar} tutarını kullan`;
}

/** `a11y.ekle.sonKullanilan` — "{ad}, geçen sefer {tutar}" */
export function a11yEkleSonKullanilan(ad: string, tutar: string): string {
  return `${ad}, geçen sefer ${tutar}`;
}

/* ------------------------------------------------- D-2d-3a · Onboarding */

/** `a11y.ob.gun` — "Ayın {n}. günü" (E-03 gün ızgarası, prototip aria-label deseni). */
export function a11yObGun(gun: number): string {
  return `Ayın ${gun}. günü`;
}

/**
 * `ob.maas.donem` — metinler.md şablonu "Dönem ayın {gun}'inde başlar."
 * statik "'inde" ekini yalnız örnek gün (15) için doğru yazmıştı; 31 günün
 * çoğunda ünlü uyumu farklıdır (bkz. `lib/tarih.ts#gunBulunmaEki`). PM'e
 * bildirildi — metinler.md §2 şablonu güncellenmeli, ek burada TEK yerden
 * hesaplanır (K-040).
 */
export function obMaasDonem(gunEki: string): string {
  return `Dönem ayın ${gunEki} başlar. Limit kalan güne bölünür.`;
}

/** `ob.ozet` maaş günü değeri — 15 → "Ayın 15'i" (`lib/tarih.ts#gunIyelikEki`). */
export function obOzetMaasGunu(gunEki: string): string {
  return `Ayın ${gunEki}`;
}

/** `oneri.nasil.1` — "Aylık net gelirin {tutar}." */
export function oneriNasil1(tutar: string): string {
  return `Aylık net gelirin ${tutar}.`;
}

/** `oneri.nasil.3` — "Sosyal ve keyfi pay {tutar} oldu, gelir döneminde kalan {n} güne bölündü." */
export function oneriNasil3(tutar: string, gunSayisi: number): string {
  return `Sosyal ve keyfi pay ${tutar} oldu, gelir döneminde kalan ${gunSayisi} güne bölündü.`;
}

/** `oneri.denklem.kalan_gun` değeri — "{n} gün" */
export function oneriDenklemKalanGun(gunSayisi: number): string {
  return `${gunSayisi} gün`;
}

/* ------------------------------------------------ D-2d-3b · Katman 2 + Plan */

/** Alışkanlık kartı ayna kuyusu formül satırı — "Günde 1 × 90 ₺ × 30 gün" / "Haftada 1 × 380 ₺ × 30 gün ÷ 7" / "Ayda 1-2 × 130 ₺". */
export function tanFormulMetni(siklikEtiket: string, fiyatYazi: string, haftalikMi: boolean, aylikSayiMi: boolean): string {
  if (aylikSayiMi) return `${siklikEtiket} × ${fiyatYazi}`;
  return haftalikMi ? `${siklikEtiket} × ${fiyatYazi} × 30 gün ÷ 7` : `${siklikEtiket} × ${fiyatYazi} × 30 gün`;
}

/** `tan.yemek.birim` notu — "Günde kaç {birim}" (serbest sayı sorusu etiketi). */
export function tanGundeKac(birim: string): string {
  return `Günde kaç ${birim}`;
}

/** Birikim kartı (E-25) kaydırıcı altı — "Ayda 4.800 ₺ ayırmayı hedefliyorsun." (prototip 17-tanisma.html, anahtarsız). */
export function tanBirikimHedef(tutar: string): string {
  return `Ayda ${tutar} ayırmayı hedefliyorsun.`;
}

/** Birikim kartı alt notu — "Üst sınır sabit giderlerine göre hesaplandı. Zorunlu payın %59." */
export function tanBirikimUstSinirNotu(zorunluYuzde: number): string {
  return `Üst sınır sabit giderlerine göre hesaplandı. Zorunlu payın %${zorunluYuzde}.`;
}

/** `tan.donus.aciklama` — "Dört kart cevapladın. Dördü bekliyor." */
export function tanDonusAciklama(cevaplanan: number, bekleyen: number): string {
  return `${cevaplanan} kart cevapladın. ${bekleyen} bekliyor.`;
}

/** `tan.X.Y kartın Z. kartı` a11y — "8 kartın {n}. kartı" */
export function a11yTanKart(n: number): string {
  return `8 kartın ${n}. kartı`;
}

/** Plan kartı başlığı altı — "Gelir 32.000 ₺" */
export function planGelirEtiketi(tutar: string): string {
  return `Gelir ${tutar}`;
}

/** `plan.pay.yatirim` — "Bunun {tutar}'si yatırım payı." */
export function planPayYatirim(tutar: string): string {
  return `Bunun ${tutar}'si yatırım payı.`;
}

/** Pay satırı yüzde — "%59" (işaret önce, boşluk yok — K-053/K-059/1). */
export function planYuzde(yuzde: number): string {
  return `%${yuzde}`;
}

/** `plan.denklem.kalan_gun` değeri — "{n} gün" */
export function planDenklemKalanGun(gunSayisi: number): string {
  return `${gunSayisi} gün`;
}

/** `plan.nasil.1` — "12.500 + 2.840 + 1.900 + 1.560 = 18.800 ₺. Zorunlu payın bu." (kalemler sıfırsa listeden düşer). */
export function planNasil1(kalemler: string[], toplam: string): string {
  return `${kalemler.join(' + ')} = ${toplam}. Zorunlu payın bu.`;
}

/** `plan.nasil.2` — "32.000 ₺ gelirin %15'i = 4.800 ₺." */
export function planNasil2(gelir: string, yuzde: number, tutar: string): string {
  return `${gelir} gelirin %${yuzde}'i = ${tutar}.`;
}

/** `plan.nasil.3` — "32.000 − 18.800 − 4.800 = 8.400 ₺." */
export function planNasil3(gelir: string, zorunlu: string, birikim: string, sosyal: string): string {
  return `${gelir} − ${zorunlu} − ${birikim} = ${sosyal}.`;
}

/** `plan.nasil.4` — "8.400 ₺ ÷ 28 gün = 300 ₺ günlük limit." */
export function planNasil4(sosyal: string, gunSayisi: number, gunlukLimit: string): string {
  return `${sosyal} ÷ ${gunSayisi} gün = ${gunlukLimit} günlük limit.`;
}

/** Alışkanlık maliyeti listesi satır altı — "Günde 1 × 90 ₺" (formülün kısa hâli, ×30 kartın kendisinde). */
export function planAliskanlikSatirAlt(siklikEtiket: string, fiyatYazi: string): string {
  return `${siklikEtiket} × ${fiyatYazi}`;
}

/** Abonelikler satır altı / ayna kuyusu formülü — "{adet} × {tutar}" (E-25 ve E-26 aynı biçimi kullanır, K-040). */
export function abonelikFormulMetni(adet: number, ortalamaTutar: string): string {
  return `${adet} × ${ortalamaTutar}`;
}

/** `plan.aliskanlik.toplam_not` — "Sosyal ve keyfi payının {tutar}'si. Yasak değil, görünür." */
export function planAliskanlikToplamNot(tutar: string): string {
  return `Sosyal ve keyfi payının ${tutar}'si. Yasak değil, görünür.`;
}

/** `plan.ayar.degisim` — "Sosyal ve keyfi pay {tutar} azaldı. Zorunlu pay değişmedi." */
export function planAyarDegisim(tutar: string, azaldiMi: boolean): string {
  return `Sosyal ve keyfi pay ${tutar} ${azaldiMi ? 'azaldı' : 'arttı'}. Zorunlu pay değişmedi.`;
}

/** Kaydırıcı altı ilk metin (henüz değiştirilmemiş) — "Ayda {tutar}. Fark sosyal ve keyfi paydan iner." */
export function planAyarAltMetin(tutar: string): string {
  return `Ayda ${tutar}. Fark sosyal ve keyfi paydan iner.`;
}

/** `plan.ayar.aralik_en_cok` — "En çok %41" */
export function planAralikEnCok(yuzde: number): string {
  return `En çok %${yuzde}`;
}

/** Gelirsiz limit kartı — "Ayda yaklaşık {tutar}. Tahmini." (günlük × 30) */
export function planGelirsizAylikTahmin(tutar: string): string {
  return `Ayda yaklaşık ${tutar}. Tahmini.`;
}

/** `plan.eksi.tutar` — "Sabit giderlerin gelirini {tutar} aşıyor." */
export function planEksiTutar(tutar: string): string {
  return `Sabit giderlerin gelirini ${tutar} aşıyor.`;
}

/** `plan.eksi.kalan` — "{tutar} eksik" */
export function planEksiKalan(tutar: string): string {
  return `${tutar} eksik`;
}

/* ---------------------------------------------------------- D-2c-1 · E-19 */

/** `ayar.surum` — "Sürüm {surum}" */
export function ayarSurum(surum: string): string {
  return `Sürüm ${surum}`;
}

/** `ayar.plan.kalan` / `.bekliyor` — "{n} kart kaldı" · "8 kart bekliyor" (metinler.md §26.3). */
export function ayarPlanKalan(n: number): string {
  return `${n} kart kaldı`;
}
export function ayarPlanBekliyor(n: number): string {
  return `${n} kart bekliyor`;
}

/** `a11y` — "Maaş günü: {deger}. Değiştir" / "Kip: {deger}. Değiştir" / "Bildirim saati: {deger}. Değiştir" desenleri. */
export function a11yDegerDegistir(etiket: string, deger: string): string {
  return `${etiket}: ${deger}. Değiştir`;
}

/** `hesapsil.veri` — "{n} kayıt dahil tüm verilerin silinir." */
export function hesapsilVeri(n: number): string {
  return `${n} kayıt dahil tüm verilerin silinir.`;
}

/** `sifirla.govde` — "{eposta} adresine şifre bağlantısı gitti." */
export function sifirlaGovde(eposta: string): string {
  return `${eposta} adresine şifre bağlantısı gitti.`;
}

/** `ayar.veri_sil_ozet` — "{adet} kayıt · {ay} {yil}'dan bugüne" */
export function ayarVeriSilOzet(adet: number, ayYil: string): string {
  return `${adet} kayıt · ${ayYil}'dan bugüne`;
}

/* ---------------------------------------------------------- D-2c-1 · E-20 */

/** `prof.gun` — "{n}. gün" */
export function profGun(n: number): string {
  return `${n}. gün`;
}

/* ------------------------------------------- REV2 · E-27 Tasarruf · E-28 Profil */

/**
 * §28.1 H1 — Türkçe bulunma hâli eki (-da/-de/-ta/-te) ünlü uyumu VE ünsüz
 * benzeşmesiyle değişir; `{Ay}'ta` gibi TEK bir kalıp 12 ayın 8'inde yanlış
 * üretir ("Eylül'ta", "Ağustos'de"). Ek burada TEK yerden, hazır dize
 * olarak okunur — çalışma zamanında hesaplanmaz (K-040 deseni).
 */
export const AY_LOKATIF: readonly string[] = [
  "Ocak'ta", "Şubat'ta", "Mart'ta", "Nisan'da", "Mayıs'ta", "Haziran'da",
  "Temmuz'da", "Ağustos'ta", "Eylül'de", "Ekim'de", "Kasım'da", "Aralık'ta",
];

/** 1-12 ay indeksinden `{AyLokatif}` okur — "9" → "Eylül'de". */
export function ayLokatif(ay: number): string {
  return AY_LOKATIF[((ay - 1) % 12 + 12) % 12];
}

/** `tasarruf.ustSatir.devam` / `.kapandi` — "{Ay} {yıl} · ay devam ediyor" / "· ay kapandı" */
export function tasarrufUstSatir(ayYil: string, kapandiMi: boolean): string {
  return `${ayYil} · ay ${kapandiMi ? 'kapandı' : 'devam ediyor'}`;
}

/** `tasarruf.butce.cip` / `.cipYok` — "Bütçe {tutar}" · "Bütçe yok" */
export function tasarrufButceCip(tutar: string | null): string {
  return tutar ? `Bütçe ${tutar}` : 'Bütçe yok';
}

/** `tasarruf.gosterge.cumle.buAy` — "Kaydettiğin gelir ve harcamalara göre {n} gün hesaplandı." */
export function tasarrufGostergeCumleBuAy(gunSayisi: number): string {
  return `Kaydettiğin gelir ve harcamalara göre ${gunSayisi} gün hesaplandı.`;
}

/** `tasarruf.gosterge.cumle.gecmisAy` — "{AyLokatif} kaydettiğin gelir ve harcamalara göre {n} gün hesaplandı." */
export function tasarrufGostergeCumleGecmisAy(ayLokatifDeger: string, gunSayisi: number): string {
  return `${ayLokatifDeger} kaydettiğin gelir ve harcamalara göre ${gunSayisi} gün hesaplandı.`;
}

/** `tasarruf.gosterge.disinda.buAy` — "Bu ay harcaman bütçenin {tutar} üzerinde." */
export function tasarrufGostergeDisindaBuAy(tutar: string): string {
  return `Bu ay harcaman bütçenin ${tutar} üzerinde.`;
}

/** `tasarruf.gosterge.disinda.gecmisAy` — "{AyLokatif} harcaman bütçenin {tutar} üzerinde." */
export function tasarrufGostergeDisindaGecmisAy(ayLokatifDeger: string, tutar: string): string {
  return `${ayLokatifDeger} harcaman bütçenin ${tutar} üzerinde.`;
}

/** `tasarruf.motivasyon.borc` — "Bu tutar borcunun %{n}'ine denk geliyor." */
export function tasarrufMotivasyonBorc(yuzde: number): string {
  return `Bu tutar borcunun %${yuzde}'ine denk geliyor.`;
}

/** `tasarruf.butce.aralik` — "{n}–{n} {Ay}" */
export function tasarrufButceAralik(baslangicGun: number, bitisGun: number, ay: string): string {
  return `${baslangicGun}–${bitisGun} ${ay}`;
}

/** `tasarruf.butce.sabit` — "Sabit ödemeler dahil toplam {tutar}" */
export function tasarrufButceSabit(tutar: string): string {
  return `Sabit ödemeler dahil toplam ${tutar}`;
}

/** `tasarruf.butce.gunDeger` — "{n}/{n} gün" */
export function tasarrufButceGunDeger(tamamlanan: number, toplam: number): string {
  return `${tamamlanan}/${toplam} gün`;
}

/** `tasarruf.butce.kumulatif` — "Takip başından beri biriken {tutar}" */
export function tasarrufButceKumulatif(tutar: string): string {
  return `Takip başından beri biriken ${tutar}`;
}

/** `tasarruf.butce.eksikGun` — "{n} günün geliri eksik. O günler hesaba katılmadı." */
export function tasarrufButceEksikGun(gunSayisi: number): string {
  return `${gunSayisi} günün geliri eksik. O günler hesaba katılmadı.`;
}

/** `tasarruf.butce.takipBasi` — "Takip {n} {AyLokatif} başladı. Ayın {n} günü hesaplanacak." */
export function tasarrufButceTakipBasi(gun: number, ayLokatifDeger: string, hesaplanacakGun: number): string {
  return `Takip ${gun} ${ayLokatifDeger} başladı. Ayın ${hesaplanacakGun} günü hesaplanacak.`;
}

/** `tasarruf.birikim.ayEkleme.buAy` — "Bu ay {tutar} eklendi" */
export function tasarrufBirikimAyEklemeBuAy(tutar: string): string {
  return `Bu ay ${tutar} eklendi`;
}

/** `tasarruf.birikim.ayEkleme.gecmisAy` — "{AyLokatif} {tutar} eklendi" */
export function tasarrufBirikimAyEklemeGecmisAy(ayLokatifDeger: string, tutar: string): string {
  return `${ayLokatifDeger} ${tutar} eklendi`;
}

/** `tasarruf.birikim.ayCekme.buAy` — "Bu ay {tutar} çekildi" */
export function tasarrufBirikimAyCekmeBuAy(tutar: string): string {
  return `Bu ay ${tutar} çekildi`;
}

/** `tasarruf.birikim.ayCekme.gecmisAy` — "{AyLokatif} {tutar} çekildi" */
export function tasarrufBirikimAyCekmeGecmisAy(ayLokatifDeger: string, tutar: string): string {
  return `${ayLokatifDeger} ${tutar} çekildi`;
}

/** `tasarruf.birikim.ayYok.gecmisAy` — "{AyLokatif} kayıt yok" */
export function tasarrufBirikimAyYokGecmisAy(ayLokatifDeger: string): string {
  return `${ayLokatifDeger} kayıt yok`;
}

/** `tasarruf.birikim.hedef` — "Hedef {tutar}" */
export function tasarrufBirikimHedef(tutar: string): string {
  return `Hedef ${tutar}`;
}

/** `tasarruf.hareket.sayi` — "{n} kayıt" */
export function tasarrufHareketSayi(adet: number): string {
  return `${adet} kayıt`;
}

/** `tasarruf.hareket.bos.alt.gecmisAy` — "{AyLokatif} kenara ayırdığın para yok." */
export function tasarrufHareketBosAltGecmisAy(ayLokatifDeger: string): string {
  return `${ayLokatifDeger} kenara ayırdığın para yok.`;
}

/** `tasarruf.hareket.silindiToast` — "{tutar} silindi · Geri al" (eylem etiketi ayrı geçilir, bkz. toastGoster) */
export function tasarrufHareketSilindiToast(tutar: string): string {
  return `${tutar} silindi`;
}

/** `tasarruf.hareket.kaydedildiToast` — "{tutar} birikime eklendi" */
export function tasarrufHareketKaydedildiToast(tutar: string): string {
  return `${tutar} birikime eklendi`;
}

/** `tasarruf.kategori.harcanan` — "Harcanan {tutar}" */
export function tasarrufKategoriHarcanan(tutar: string): string {
  return `Harcanan ${tutar}`;
}

/** `tasarruf.kategori.pay` — "payı %{n}" (işaret önce, boşluksuz) */
export function tasarrufKategoriPay(yuzde: number): string {
  return `payı %${yuzde}`;
}

/** `tasarruf.kategori.rutin` — "rutin {tutar}" */
export function tasarrufKategoriRutin(tutar: string): string {
  return `rutin ${tutar}`;
}

/** `tasarruf.kategori.bos.gecmisAy` — "{AyLokatif} harcama yazmamışsın." */
export function tasarrufKategoriBosGecmisAy(ayLokatifDeger: string): string {
  return `${ayLokatifDeger} harcama yazmamışsın.`;
}

/** `tasarruf.rutin.bos.gecmisAy` — "{AyLokatif} vazgeçtiğin rutin yok." */
export function tasarrufRutinBosGecmisAy(ayLokatifDeger: string): string {
  return `${ayLokatifDeger} vazgeçtiğin rutin yok.`;
}

// §28.3 — E-27 akordiyon özetleri (REV3)

/** `tasarruf.ozet.butce` — "Kalan {tutar}" */
export function tasarrufOzetButce(tutar: string): string {
  return `Kalan ${tutar}`;
}

/** `tasarruf.ozet.butceDisinda` — "Bütçe dışı {tutar}" */
export function tasarrufOzetButceDisinda(tutar: string): string {
  return `Bütçe dışı ${tutar}`;
}

/** `tasarruf.ozet.birikim` — "{tutar} · hedefin %{n}'i" */
export function tasarrufOzetBirikim(tutar: string, yuzde: number): string {
  return `${tutar} · hedefin %${yuzde}'i`;
}

/** `tasarruf.ozet.birikimAyYok.buAy` — "{tutar} · bu ay kayıt yok" */
export function tasarrufOzetBirikimAyYokBuAy(tutar: string): string {
  return `${tutar} · bu ay kayıt yok`;
}

/** `tasarruf.ozet.birikimAyYok.gecmisAy` — "{tutar} · {AyLokatif} kayıt yok" */
export function tasarrufOzetBirikimAyYokGecmisAy(tutar: string, ayLokatifDeger: string): string {
  return `${tutar} · ${ayLokatifDeger} kayıt yok`;
}

/** `tasarruf.ozet.birikimHedefYok` — "{tutar} · hedef koymadın" */
export function tasarrufOzetBirikimHedefYok(tutar: string): string {
  return `${tutar} · hedef koymadın`;
}

/** `tasarruf.ozet.kategori` — "Harcanan {tutar}" */
export function tasarrufOzetKategori(tutar: string): string {
  return `Harcanan ${tutar}`;
}

/** `tasarruf.ozet.rutin` — "{tutar} · {n} rutin" */
export function tasarrufOzetRutin(tutar: string, rutinSayisi: number): string {
  return `${tutar} · ${rutinSayisi} rutin`;
}

/** `a11y.tasarruf.bolum` — "{başlık}. {özet}" */
export function a11yTasarrufBolum(baslik: string, ozet: string): string {
  return `${baslik}. ${ozet}`;
}

// §29 — E-10 Günlük rutin hızlı eylem satırı (REV3)

/** `gunlukRutin.ozet` — "{n} rutin · {n} işaretsiz" */
export function gunlukRutinOzet(toplam: number, isaretsiz: number): string {
  return `${toplam} rutin · ${isaretsiz} işaretsiz`;
}

/** `gunlukRutin.ozetHepsi` — "{n} rutin · hepsi işaretli" */
export function gunlukRutinOzetHepsi(toplam: number): string {
  return `${toplam} rutin · hepsi işaretli`;
}

/** `gunlukRutin.ozetHicbiri` — "{n} rutin · işaretlenmedi" */
export function gunlukRutinOzetHicbiri(toplam: number): string {
  return `${toplam} rutin · işaretlenmedi`;
}

/** `gunlukRutin.ozetHata` — "{n} rutin · işaret bekliyor" */
export function gunlukRutinOzetHata(toplam: number): string {
  return `${toplam} rutin · işaret bekliyor`;
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
  return `Yazıldı · ${saat}`;
}

/** `gunlukRutin.toast.aldim` — "{ad} {tutar} yazıldı." */
export function gunlukRutinToastAldim(ad: string, tutar: string): string {
  return `${ad} ${tutar} yazıldı.`;
}

/** `gunlukRutin.toast.almadim` — "{ad} almadın olarak işaretlendi." */
export function gunlukRutinToastAlmadim(ad: string): string {
  return `${ad} almadın olarak işaretlendi.`;
}

/** `a11y.gunlukRutin.bolum` — "Rutinler. {özet}" */
export function a11yGunlukRutinBolum(ozet: string): string {
  return `${t['gunlukRutin.baslik']}. ${ozet}`;
}

/** `a11y.gunlukRutin.bolumGecmis` — "Rutinler. {gün}. {özet}" */
export function a11yGunlukRutinBolumGecmis(gun: string, ozet: string): string {
  return `${t['gunlukRutin.baslik']}. ${gun}. ${ozet}`;
}

/** `a11y.gunlukRutin.aldim` — "{ad} aldım olarak işaretle, {tutar}" */
export function a11yGunlukRutinAldim(ad: string, tutar: string): string {
  return `${ad} aldım olarak işaretle, ${tutar}`;
}

/** `a11y.gunlukRutin.almadim` — "{ad} almadım olarak işaretle, {tutar} rutin tasarrufu" */
export function a11yGunlukRutinAlmadim(ad: string, tutar: string): string {
  return `${ad} almadım olarak işaretle, ${tutar} rutin tasarrufu`;
}

/** `a11y.gunlukRutin.yaziliyor` — "{ad} yazılıyor" */
export function a11yGunlukRutinYaziliyor(ad: string): string {
  return `${ad} yazılıyor`;
}

/** `a11y.gunlukRutin.isaretleniyor` — "{ad} işaretleniyor" */
export function a11yGunlukRutinIsaretleniyor(ad: string): string {
  return `${ad} işaretleniyor`;
}

/** `a11y.gunlukRutin.aldimGecmis` — "{ad}, {gün}. Aldım olarak işaretle, {tutar}" */
export function a11yGunlukRutinAldimGecmis(ad: string, gun: string, tutar: string): string {
  return `${ad}, ${gun}. Aldım olarak işaretle, ${tutar}`;
}

/** `a11y.gunlukRutin.almadimGecmis` — "{ad}, {gün}. Almadım olarak işaretle, {tutar} rutin tasarrufu" */
export function a11yGunlukRutinAlmadimGecmis(ad: string, gun: string, tutar: string): string {
  return `${ad}, ${gun}. Almadım olarak işaretle, ${tutar} rutin tasarrufu`;
}

/**
 * `a11y.bolumYukleniyor` — "{başlık}. Yükleniyor". Ö5 — E-10 rutin bölümü VE
 * E-27 akordiyonunun dört bölümü PAYLAŞIR (aynı anahtar, farklı `baslik`).
 */
export function a11yBolumYukleniyor(baslik: string): string {
  return `${baslik}. Yükleniyor`;
}

/** `a11y.tasarruf.gostergeDisinda` — "Bütçe dışı {tutar}" */
export function a11yTasarrufGostergeDisinda(tutar: string): string {
  return `Bütçe dışı ${tutar}`;
}

/** `a11y.tasarruf.butceCip` — "Bütçe {tutar}. Bütçeyi aç" */
export function a11yTasarrufButceCip(tutar: string | null): string {
  return tutar ? `Bütçe ${tutar}. Bütçeyi aç` : 'Bütçe tanımlı değil. Bütçeyi aç';
}

/** `a11y.tasarruf.hareket` — "{yön}, {gün} {Ay}, {tutar}, not: {not}" */
export function a11yTasarrufHareket(yon: string, gun: number, ay: string, tutar: string, notMetni?: string): string {
  return `${yon}, ${gun} ${ay}, ${tutar}${notMetni ? `, not: ${notMetni}` : ''}`;
}

/** `a11y.tasarruf.gunSayaci` — "Ayın tamamlanan günleri: {n} / {n}" */
export function a11yTasarrufGunSayaci(tamamlanan: number, toplam: number): string {
  return `Ayın tamamlanan günleri: ${tamamlanan} / ${toplam}`;
}

/** `profil.satir.butceDeger` — "Aylık net gelir {tutar} · {n} sabit gider" */
export function profilSatirButceDeger(tutar: string, sabitGiderSayisi: number): string {
  return `Aylık net gelir ${tutar} · ${sabitGiderSayisi} sabit gider`;
}

/** `profil.satir.limitlerDeger` — "Günlük {tutar} · {n} kategori limiti" */
export function profilSatirLimitlerDeger(gunlukTutar: string, kategoriLimitSayisi: number): string {
  return `Günlük ${gunlukTutar} · ${kategoriLimitSayisi} kategori limiti`;
}

/** `profil.satir.rutinlerDeger` — "{n} rutin · bu ay {tutar} tasarruf" */
export function profilSatirRutinlerDeger(rutinSayisi: number, tutar: string): string {
  return `${rutinSayisi} rutin · bu ay ${tutar} tasarruf`;
}

/** `profil.satir.favorilerDeger` — "{n} ürün, son fiyatlarıyla" */
export function profilSatirFavorilerDeger(urunSayisi: number): string {
  return `${urunSayisi} ürün, son fiyatlarıyla`;
}

/** `profil.satir.taksitlerDeger` — "{n} seri · bu ay {tutar}" */
export function profilSatirTaksitlerDeger(seriSayisi: number, tutar: string): string {
  return `${seriSayisi} seri · bu ay ${tutar}`;
}

/** `profil.satir.seriDeger` — "{n} gün · en uzun {n} gün" */
export function profilSatirSeriDeger(mevcutSeri: number, enUzunSeri: number): string {
  return `${mevcutSeri} gün · en uzun ${enUzunSeri} gün`;
}

/** `profil.alt.surum` — "Trinkow · sürüm {n}" */
export function profilAltSurum(surum: string): string {
  return `Trinkow · sürüm ${surum}`;
}

/** `profil.kimlik.serit.gun` — "{n} gündür kayıt giriyorsun" */
export function profilKimlikSeritGun(mevcutSeri: number): string {
  return `${mevcutSeri} gündür kayıt giriyorsun`;
}

/** `profil.kimlik.serit.altEnUzun` — "En uzun {n} gün." */
export function profilKimlikSeritAltEnUzun(enUzunSeri: number): string {
  return `En uzun ${enUzunSeri} gün.`;
}

/** `a11y.profil.satir` — "{başlık}. {değer}" */
export function a11yProfilSatir(baslik: string, deger: string): string {
  return `${baslik}. ${deger}`;
}
