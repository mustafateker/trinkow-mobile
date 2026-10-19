import { en, enDinamik } from '@/content/metinler.en';
import { ingilizceMi } from '@/lib/yerellestirme';

/**
 * Arayüz metinleri — tek kaynak: ../agency/projects/trinkow/docs/content/metinler.md.
 * Kodda cümle uydurulmaz. Yeni metin gerekiyorsa önce metinler.md'ye eklenir.
 *
 * Anahtarlar metinler.md'deki i18n anahtarlarıyla birebir aynıdır.
 */
const tr = {
  'eylem.kaydet': 'Kaydet',
  'eylem.vazgec': 'Vazgeç',
  'eylem.sil': 'Sil',
  'eylem.kapat': 'Kapat',
  'eylem.tum_kategoriler': 'Tüm kategoriler',
  'eylem.tekrarla': 'Tekrarla',
  'eylem.geri': 'Geri',
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

  // §23.1 E-10 Günlük — sayfalama ve gün başlığı (v4 · K-049/K-055)
  'gunluk.onceki_gun': 'Önceki gün',
  'gunluk.sonraki_gun': 'Sonraki gün',
  'gunluk.ipucu': 'Geçmiş günler solda. Sağa kaydır.',
  'gunluk.ipucu_kapat': 'İpucunu kapat',
  'gunluk.sinir.ilk_kayit': 'İlk kaydın bu gün. Daha geriye kayıt yok.',
  'gunluk.a11y.takvim': 'Gün seç',
  'gunluk.harcama_ekle': 'Harcama ekle',
  'gunluk.hareketler': 'Bugünün hareketleri',
  'gunluk.tumunu_gor': 'Tümünü gör',
  'gunluk.sik_kullanilanlar': 'Sık harcamalarım',
  'gunluk.kategoriler': 'Kategoriler',
  'gunluk.kategoriler.ozet': 'Limit ve hızlı ekleme',

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
  'gunluk.grup.bugun_yok': 'bugün kayıt yok',

  // §23.5 E-21 Seri
  'seri.baslik': 'Seri',
  'seri.hero.birim': 'gün',
  'seri.kirildi': 'Seri dün kırıldı. Bugün yeniden başlıyor.',
  'seri.bos.govde': 'Seri henüz başlamadı. Bugüne bir kayıt ekle.',
  'seri.en_uzun': 'En uzun seri',
  'seri.en_uzun_bos': 'Henüz yok',
  'seri.duraklar': 'Duraklar',
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

  // §27.1 E-11 ürün arama (F-18 · T-4)
  'ekle.arama.placeholder': 'Ne aldın? (isteğe bağlı)',
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

  // §15 toast
  'toast.silindi': 'Harcama silindi',
  'toast.geri_al': 'Geri al',
  'toast.geri_alindi': 'İşlem geri alındı',
  'toast.taksit_silindi': 'Taksit serisi silindi.',
  'pano.kip.takip': 'Takip',
  'pano.kip.tasarruf': 'Tasarruf',
  'pano.kip.borc': 'Borç',
  'pano.hero.takip': 'Bugün kalan',
  /**
   * tokens.md §7.5 / §1.5 — limit dışında kahraman sayının altındaki etiket
   * birebir "limit dışı" sözcüğüdür. metinler.md'de henüz anahtarı yok;
   * PM'e bildirildi (öneri: `pano.hero.limit_disi`).
   */
  'pano.hero.limit_disi': 'Limitin üzerinde',
  'pano.limit_sorgu.govde': 'Limit gerçekçi mi. Birlikte bakalım.',
  'pano.limit_sorgu.eylem': 'Limiti gözden geçir',
  'pano.hero.limitsiz': 'Bugün harcanan',

  // §13 boş durumlar — E-10 ilk gün
  'bos.pano.govde': 'Henüz harcama eklemedin.',
  'kategori.limit_ekle': 'Limit belirle',

  // §7 / §22.1 E-15 kategori detayı
  'kategori.limit_yok': 'Bu kategoride limit yok.',
  'kategori.bar_periyot': 'aylık',
  'kategori.liste_baslik': 'Bu ayki kayıtlar',
  'kategori.bos_govde': 'Bu ay bu kategoride harcama yazmadın.',

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
  'tan.girilmedi': 'Girilmedi',
  'tan.yatirim.aciklama': 'Cevabın yalnız birikimini adlandırmak için.',
  'tan.yatirim.yapiyorum': 'Yapıyorum',
  'tan.yatirim.dusunuyorum': 'Yapmayı düşünüyorum',
  'tan.yatirim.ilgilenmiyorum': 'İlgilenmiyorum',
  'tan.yatirim.sinir': 'Yatırım tavsiyesi vermiyoruz.',
  'tan.yatirim.sinir.alt': 'Birikimin bir kısmını yatırım payı diye etiketleriz.',

  // §11 · §22.4 D-2c-1 · E-19 — Ayarlar
  'ayar.baslik': 'Ayarlar',
  'ayar.dil': 'Dil',
  'ayar.dil_aciklama': 'Uygulamada kullanılacak dili seç.',
  'ayar.para_birimi': 'Para birimi',
  'ayar.para_birimi_aciklama': 'Simge ve sayı biçimini değiştirir. Mevcut tutarlar dönüştürülmez.',
  'ayar.bildirim_saat': 'Bildirim saati',
  'ayar.gun_siniri': 'Gün Dönümü',
  'ayar.gun_siniri_aciklama': 'Günlük limitin bu saatte sıfırlanır.',
  'ayar.gun_siniri.0': '00.00',
  'ayar.gun_siniri.3': '03.00',
  'ayar.gun_siniri.6': '06.00',
  'ayar.varsayilan_odeme': 'Varsayılan ödeme',
  'ayar.odeme_aciklama': 'Yeni harcama bu seçimle açılır.',
  'ayar.kip': 'Hedef',
  'ayar.kip_degistir': 'Hedef seç',
  'ayar.plan.gelir': 'Aylık net gelir',
  'ayar.plan.gelir_girilmedi': 'Girilmedi',
  // "Maaş günü" bilinçli tutuldu: burada gelirin GÜNÜ soruluyor, "gelir günü" ifadesi kavramı bulanıklaştırır.
  'ayar.plan.maas_gunu': 'Maaş günü',
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
  'giris.sosyal.apple': 'Apple ile Devam Et',
  'giris.sosyal.google': 'Google ile devam et',
  'alan.eposta': 'E-posta',
  'alan.eposta_ph': 'ornek@eposta.com',
  'alan.sifre': 'Şifre',
  'alan.sifre_ph.kayit': 'Şifre belirle',
  'alan.sifre.gorunur': 'Şifreyi göster',
  'alan.sifre.gizli': 'Şifreyi gizle',
  'giris.sosyal_yok': 'Bu giriş yöntemi henüz kullanıma açık değil. E-posta alanıyla devam edebilirsin.',
  'giris.oturum_dogrulanamadi': 'Bağlantı kurulamadı. Yeniden giriş yapmayı dene.',
  'hata.eposta_bicim': 'Geçerli bir e-posta yaz.',
  'kayit.eylem': 'Hesap oluştur',
  'kayit.mesgul': 'Hesap oluşturuluyor',
  'kayit.sifre_kural': 'En az 8 karakter.',
  'kayit.sifre_kural_tamam': 'Uzunluk yeterli.',
  'alan.sifre_tekrar': 'Şifre tekrar',
  'alan.sifre_tekrar_ph': 'Şifreyi yeniden yaz',
  'hata.sifre_eslesmiyor': 'İki şifre aynı değil. Yeniden yaz.',
  'a11y.onay.kosullar': 'Kullanım şartlarını kabul et',
  'a11y.onay.gizlilik': 'Gizlilik politikasını kabul et',
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
  'tasarruf.gelirYok.baslik': 'Gelirini ekle',
  'tasarruf.gelirYok.alt': 'Aylık gelirini yazınca bu ayın payını hesaplarız.',
  'tasarruf.gelirYok.btn': 'Bütçeyi düzenle',
  'tasarruf.kazanim.etiket': 'AYIN KAZANIMI',
  'tasarruf.kazanim.pozitif': 'Tamamlanan günlerden kalan',
  'tasarruf.kazanim.negatif': 'Tamamlanan günlerin bütçe farkı',
  'tasarruf.butce.harcanan': 'Harcanan',
  'tasarruf.birikim.ayYok.buAy': 'Bu ay kayıt yok',
  'tasarruf.birikim.toplam': 'Toplam birikim',
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
  'tasarruf.kategori.tumu': 'Tümünü gör',
  'tasarruf.kategori.bos.buAy': 'Bu ay henüz harcama yazmadın.',
  'tasarruf.kategori.bos.alt': 'İlk kaydından sonra kategori payları burada görünür.',
  'tasarruf.rutin.bos.buAy': 'Bu ay vazgeçtiğin rutin yok.',
  'tasarruf.rutin.hicYok': 'Rutin eklemedin. Vazgeçtiğin harcamalar burada toplanır.',
  'tasarruf.rutin.btn': 'Rutinleri aç',
  'tasarruf.rutin.kazanimEtiket': 'Bu ay rutinlerden',
  'tasarruf.rutin.otomatik': 'Harcama eklenmeyen rutinler otomatik hesaplanır.',
  'tasarruf.rutin.otomatikKisa': 'Otomatik hesaplandı',
  'tasarruf.rutin.gunGun': 'GÜN GÜN TASARRUF',
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
  'a11y.tasarruf.oncekiAy': 'Önceki ay',
  'a11y.tasarruf.sonrakiAy': 'Sonraki ay',
  'a11y.tasarruf.hareketSil': 'Bu hareketi sil',
  'tasarruf.bolum.birikim': 'Gerçek birikim',
  'tasarruf.bolum.birikimAlt': 'Gerçekten kenara ayırdığın parayı burada takip et.',
  'tasarruf.bolum.kategori': 'Kategori dağılımı',
  'tasarruf.bolum.kategoriAlt': 'Bu ay paran en çok hangi alanlara gitti?',
  'tasarruf.bolum.rutin': 'Rutin tasarrufu',
  'tasarruf.bolum.rutinAlt': 'Almadığın küçük rutinlerin ay boyunca bıraktığı alan.',
  'tasarruf.ozet.kategoriYok': 'Harcama yok',
  'tasarruf.ozet.rutinYok': 'Rutin eklemedin',
  'tasarruf.ozet.acilamadi': 'Açılamadı',
  'tasarruf.bolum.sonHareketler': 'Son hareketler',
  'tasarruf.rutin.tutarEtiket': 'Vazgeçtiğin rutinler',
  'tasarruf.rutin.kural': 'Bütçedeki kalana eklenmez.',

  // §29 rev3-gunluk-rutin.md — E-10 Günlük rutin hızlı eylem satırı (REV3)
  'gunlukRutin.baslik': 'Rutinler ve Abonelikler',
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
  'kategori.ad.market': 'Market',
  'kategori.ad.saglik': 'Sağlık',
  'kategori.ad.kafe': 'Kafe',
  'kategori.ad.restoran': 'Restoran',
  'kategori.ad.ulasim': 'Ulaşım',
  'kategori.ad.akaryakit': 'Akaryakıt',
  'kategori.ad.fatura': 'Fatura',
  'kategori.ad.kiraev': 'Kira ve ev',
  'kategori.ad.abonelik': 'Abonelik',
  'kategori.ad.eglence': 'Eğlence',
  'kategori.ad.giyim': 'Giyim',
  'kategori.ad.aliskanliklar': 'Alışkanlıklar',
  'kategori.ad.diger': 'Diğer',
  'ui.settings.defaults': 'Varsayılan',
  'ui.settings.goal_plan': 'Hedef ve plan',
  'ui.settings.account_data': 'Hesap ve veri',
  'ui.settings.finance_tools': 'Finans araçları',
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
  'ui.subscriptions.every_month_prefix': '· Her ayın ',
  'ui.subscriptions.renewal_day_suffix': '. günü',
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
} as const;

export type MetinAnahtari = keyof typeof tr;

/** Mevcut `t['anahtar']` çağrılarını bozmadan aktif dildeki metni döndürür. */
export const t = new Proxy(tr, {
  get(hedef, ozellik: string | symbol) {
    if (typeof ozellik !== 'string') return Reflect.get(hedef, ozellik);
    return ingilizceMi() ? en[ozellik] ?? hedef[ozellik as MetinAnahtari] : hedef[ozellik as MetinAnahtari];
  },
}) as typeof tr;

function dinamikMetin(anahtar: string, degerler: readonly unknown[]): string | null {
  if (!ingilizceMi()) return null;
  const sablon = enDinamik[anahtar];
  if (sablon === undefined) return null;
  return sablon.replace(/\{(\d+)(?:\|([^|{}]+)\|([^{}]+))?\}/g, (_eslesme, indeks: string, tekil?: string, cogul?: string) => {
    const deger = degerler[Number(indeks)];
    if (tekil !== undefined && cogul !== undefined) return Number(deger) === 1 ? tekil : cogul;
    return String(deger ?? '');
  });
}

export function analizGiderPay(yuzde: number): string {
  const englishText = dinamikMetin('analizGiderPay', [yuzde]);
  return englishText ?? `Giderin %${yuzde}'i`;
}

export function analizGelirPay(yuzde: number): string {
  const englishText = dinamikMetin('analizGelirPay', [yuzde]);
  return englishText ?? `Gelire yük %${yuzde}`;
}

export function analizHalkaA11y(toplam: string): string {
  const englishText = dinamikMetin('analizHalkaA11y', [toplam]);
  return englishText ?? `Kategori dağılımı, toplam ${toplam}`;
}

export function heroLimitKullanimA11y(yuzde: number, bugunMu: boolean): string {
  const englishText = dinamikMetin('heroLimitUseA11y', [yuzde, bugunMu ? "today's" : "that day's"]);
  return englishText ?? `Limitin yüzde ${yuzde} kadarı kullanıldı`;
}

export function heroLimitAsimA11y(fark: string, bugunMu: boolean): string {
  const englishText = dinamikMetin('heroOverLimitA11y', [fark, bugunMu ? "today's" : "that day's"]);
  return englishText ?? `${bugunMu ? 'Bugünkü' : 'O günkü'} limitinin ${fark} üzerine çıktın.`;
}

export function heroHarcamaA11y(tutar: string): string {
  const englishText = dinamikMetin('heroSpendingA11y', [tutar]);
  return englishText ?? `${tutar} harcandı`;
}

export function abonelikGecikmeGun(gun: number): string {
  return dinamikMetin('subscriptionOverdueDays', [gun]) ?? `${gun} gün gecikti`;
}

export function abonelikKalanGun(gun: number): string {
  return dinamikMetin('subscriptionRemainingDays', [gun]) ?? `${gun} gün kaldı`;
}

export function abonelikSilGovde(ad: string): string {
  return dinamikMetin('subscriptionDeleteBody', [ad]) ?? `${ad} takip listesinden kaldırılacak. Geçmiş gider kayıtların silinmeyecek.`;
}

export function abonelikAdiylaEkle(ad: string): string {
  return dinamikMetin('subscriptionAddByName', [ad]) ?? `“${ad}” adıyla abonelik ekle`;
}

export function abonelikServisSayisi(adet: number): string {
  return dinamikMetin('subscriptionServiceCount', [adet]) ?? `${adet} servis`;
}

export function abonelikSatiriA11y(ad: string, tutar: string, durum: string): string {
  return dinamikMetin('subscriptionRowA11y', [ad, tutar, durum]) ?? `${ad}, ${tutar}, ${durum}. Düzenle.`;
}

export function abonelikKayitliA11y(ad: string): string {
  return dinamikMetin('subscriptionRecordedA11y', [ad]) ?? `${ad} giderlere işlendi`;
}

export function abonelikYenilendiyseEkleA11y(ad: string, tutar: string): string {
  return dinamikMetin('subscriptionAddRenewedA11y', [ad, tutar]) ?? `${ad} yenilendiyse ${tutar} gider olarak ekle`;
}

export function yarinTekAbonelikUyarisi(ad: string, tutar: string): string {
  return dinamikMetin('tomorrowSubscriptionSingle', [ad, tutar]) ?? `Yarın ${ad} aboneliğin ${tutar} tutarla otomatik yenilenecek. Kullanmıyorsan iptal edebilirsin.`;
}

export function yarinCokluAbonelikUyarisi(adet: number, tutar: string): string {
  return dinamikMetin('tomorrowSubscriptionsMultiple', [adet, tutar]) ?? `Yarın ${adet} aboneliğin toplam ${tutar} tutarla otomatik yenilenecek. Kullanmadıklarını iptal edebilirsin.`;
}

export function rutinAlimSayisiBugun(adet: number): string {
  return dinamikMetin('routinePurchasesToday', [adet]) ?? `Bugün ${adet} kez`;
}

export function rutinSatiriA11y(ad: string, kategori: string, adet: number, tutar: string): string {
  return dinamikMetin('routineRowA11y', [ad, kategori, adet, tutar]) ?? `${ad}. ${kategori}, günde ${adet} × ${tutar}. Düzenle.`;
}

export function rutinGunlukOzeti(adet: number, tutar: string): string {
  return dinamikMetin('routineDailySummary', [adet, tutar]) ?? `Günde ${adet} × ${tutar}`;
}

export function rutinKaldirA11y(ad: string): string {
  return dinamikMetin('routineRemoveA11y', [ad]) ?? `${ad} rutinini kaldır`;
}

export function onboardingRutinSatiriA11y(ad: string, altYazi: string, tutar: string): string {
  return dinamikMetin('onboardingRoutineRowA11y', [ad, altYazi, tutar]) ?? `${ad}, ${altYazi}, günlük toplam ${tutar}. Düzenle`;
}

export function harcamaSatiriA11y(birincil: string, tutar: string, ikincil: string, limitDisi: boolean): string {
  const englishText = dinamikMetin('expenseRowA11y', [birincil, tutar, ikincil, limitDisi ? ', over the limit' : '']);
  return englishText ?? `${birincil}, ${tutar}, ${ikincil}${limitDisi ? ', limit dışı' : ''}`;
}

export function hesapAcA11y(eposta: string, olgu: string, baglam: string): string {
  return dinamikMetin('accountOpenA11y', [eposta, olgu, baglam]) ?? `Hesabını aç. ${eposta}. ${olgu}, ${baglam}`;
}

export function hesapEpostasiA11y(eposta: string): string {
  return dinamikMetin('accountEmailA11y', [eposta]) ?? `Hesap e-postası ${eposta}`;
}

export function tasarrufGenelDurumA11y(tutar: string): string {
  return dinamikMetin('savingsOverallA11y', [tutar]) ?? `Genel tasarruf durumu ${tutar}`;
}

export function kategoriPayA11y(kategori: string): string {
  return dinamikMetin('categoryShareA11y', [kategori]) ?? `${kategori} payı`;
}

export function tasarrufDonemiA11y(donem: string): string {
  return dinamikMetin('savingsPeriodA11y', [donem]) ?? `Tasarruf dönemi: ${donem}`;
}

export function favoriOzet(kategori: string, tutar: string): string {
  return dinamikMetin('favoriteSummary', [kategori, tutar]) ?? `${kategori} · Son fiyat ${tutar}`;
}

export function favoriHarcamaA11y(ad: string, ozet: string): string {
  return dinamikMetin('favoriteAddExpenseA11y', [ad, ozet]) ?? `${ad}. ${ozet}. Harcama ekle.`;
}

export function favoriKaldirA11y(ad: string): string {
  return dinamikMetin('favoriteRemoveA11y', [ad]) ?? `${ad} sık kullanılanlardan kaldır`;
}

export function kategoriLimitKaldirA11y(kategori: string): string {
  return dinamikMetin('categoryLimitRemoveA11y', [kategori]) ?? `${kategori} payını kaldır`;
}

export function taksitKisaEtiketi(mevcut: number, toplam: number): string {
  return dinamikMetin('installmentShortLabel', [mevcut, toplam]) ?? ` · ${mevcut}/${toplam} taksit`;
}

export function tutarDuzeltA11y(acik: boolean): string {
  return acik ? t['ui.expense.amount_editor_close'] : t['ui.expense.amount_editor_open'];
}

/** `Bugün {harcanan}. Limitinin {fark} altındasın.` */
export function altAltinda(harcanan: string, fark: string): string {
  const englishText = dinamikMetin('altAltinda', [harcanan, fark]);
  if (englishText !== null) return englishText;
  return `Bugün ${harcanan}. Limitinin ${fark} altındasın.`;
}

/** `Günlük limitin doldu. Bugün {harcanan}.` */
export function altDoldu(harcanan: string): string {
  const englishText = dinamikMetin('altDoldu', [harcanan]);
  if (englishText !== null) return englishText;
  return `Günlük limitin doldu. Bugün ${harcanan}.`;
}

/** `Limitin {fark} üzerindesin.` */
export function altDisinda(fark: string): string {
  const englishText = dinamikMetin('altDisinda', [fark]);
  if (englishText !== null) return englishText;
  return `Limitin ${fark} üzerindesin.`;
}

/** `pano.limitsiz.ozet` — "Bugün {adet} kayıt yazdın. Limit koymadığın için kalan gösterilmiyor." */
export function panoLimitsizOzet(adet: number): string {
  const englishText = dinamikMetin('panoLimitsizOzet', [adet]);
  if (englishText !== null) return englishText;
  return `Bugün ${adet} kayıt yazdın. Limit koymadığın için kalan gösterilmiyor.`;
}

/** `ob.rutin.gunluk_toplam` — "Günlük {tutar}" (3/4 bölüm başlığının sağı). */
export function obRutinGunlukToplam(tutar: string): string {
  const englishText = dinamikMetin('obRutinGunlukToplam', [tutar]);
  if (englishText !== null) return englishText;
  return `Günlük ${tutar}`;
}

/** `ob.rutin.satir_alt` — "Her gün {adet} × {fiyat}" (`RoutineRow` alt yazısı). */
export function obRutinSatirAlt(adet: number, fiyat: string): string {
  const englishText = dinamikMetin('obRutinSatirAlt', [adet, fiyat]);
  if (englishText !== null) return englishText;
  return `Her gün ${adet} × ${fiyat}`;
}

/** `ob.rutin.ayna_formul` — "Her gün {adet} × {fiyat} × 30 gün" (`MirrorWell` formülü). */
export function obRutinAynaFormul(adet: number, fiyat: string): string {
  const englishText = dinamikMetin('obRutinAynaFormul', [adet, fiyat]);
  if (englishText !== null) return englishText;
  return `Her gün ${adet} × ${fiyat} × 30 gün`;
}

/** `Günlük toplam {tutar}` — `kayitlar.gun_toplam` */
export function gunToplamEtiketi(tutar: string): string {
  const englishText = dinamikMetin('gunToplamEtiketi', [tutar]);
  if (englishText !== null) return englishText;
  return `Günlük toplam ${tutar}`;
}

/** `Bu ay {sira}. limit aşımı` — `pano.limit_sorgu.baslik` */
export function limitSorguBasligi(sira: number): string {
  const englishText = dinamikMetin('limitSorguBasligi', [sira]);
  if (englishText !== null) return englishText;
  return `Bu ay ${sira}. limit aşımı`;
}

/** `ekle.taksit.onizleme` — "Ayda {tutar} · {ay} ay" */
export function ekleTaksitOnizleme(tutar: string, ay: number): string {
  const englishText = dinamikMetin('ekleTaksitOnizleme', [tutar, ay]);
  if (englishText !== null) return englishText;
  return `Ayda ${tutar} · ${ay} ay`;
}

/** `ekle.limit_disi_uyari` — "Bu harcama günlük limitin {fark} üzerine çıkarır." */
export function ekleLimitDisiUyari(fark: string): string {
  const englishText = dinamikMetin('ekleLimitDisiUyari', [fark]);
  if (englishText !== null) return englishText;
  return `Bu harcama günlük limitin ${fark} üzerine çıkarır.`;
}

/** `toast.kaydedildi` — "{tutar} kaydedildi" */
export function toastKaydedildi(tutar: string): string {
  const englishText = dinamikMetin('toastKaydedildi', [tutar]);
  if (englishText !== null) return englishText;
  return `${tutar} kaydedildi`;
}

/** `toast.kaydedildi_limit_disi` — "{tutar} kaydedildi · {fark} limit dışı" */
export function toastKaydedildiLimitDisi(tutar: string, fark: string): string {
  const englishText = dinamikMetin('toastKaydedildiLimitDisi', [tutar, fark]);
  if (englishText !== null) return englishText;
  return `${tutar} kaydedildi · ${fark} limit dışı`;
}

/** `toast.tekrarlandi` — "{tutar} yeniden eklendi" (Akış C · Latte Faktörü) */
export function toastTekrarlandi(tutar: string): string {
  const englishText = dinamikMetin('toastTekrarlandi', [tutar]);
  if (englishText !== null) return englishText;
  return `${tutar} yeniden eklendi`;
}

/** `detay.taksit_bilgi` — "{mevcut}/{toplam} taksit · her ay {tutar}" */
export function detayTaksitBilgi(mevcut: number, toplam: number, tutar: string): string {
  const englishText = dinamikMetin('detayTaksitBilgi', [mevcut, toplam, tutar]);
  if (englishText !== null) return englishText;
  return `${mevcut}/${toplam} taksit · her ay ${tutar}`;
}

/** `sil.govde_taksit` — "Kalan {adet} taksit de silinecek. Geri alınamaz." */
export function silGovdeTaksit(adet: number): string {
  const englishText = dinamikMetin('silGovdeTaksit', [adet]);
  if (englishText !== null) return englishText;
  return `Kalan ${adet} taksit de silinecek. Geri alınamaz.`;
}

/** `kategori.limit_ust` — "Aylık limit {tutar}" */
export function kategoriLimitUst(tutar: string): string {
  const englishText = dinamikMetin('kategoriLimitUst', [tutar]);
  if (englishText !== null) return englishText;
  return `Aylık limit ${tutar}`;
}

/** `kategori.limit_disi` — "Aylık limitin {fark} üzerinde" */
export function kategoriLimitDisi(fark: string): string {
  const englishText = dinamikMetin('kategoriLimitDisi', [fark]);
  if (englishText !== null) return englishText;
  return `Aylık limitin ${fark} üzerinde`;
}

/** `kategori.ortalama` — "Günlük ortalama {tutar}. Tahmini." */
export function kategoriOrtalama(tutar: string): string {
  const englishText = dinamikMetin('kategoriOrtalama', [tutar]);
  if (englishText !== null) return englishText;
  return `Günlük ortalama ${tutar}. Tahmini.`;
}

/** `kategori.adet` — "{adet} kayıt" */
export function kategoriAdet(adet: number): string {
  const englishText = dinamikMetin('kategoriAdet', [adet]);
  if (englishText !== null) return englishText;
  return `${adet} kayıt`;
}

/** boş durum başlığı — "{kategori} için kayıt yok" */
export function kategoriBosBaslik(kategoriAdi: string): string {
  const englishText = dinamikMetin('kategoriBosBaslik', [kategoriAdi]);
  if (englishText !== null) return englishText;
  return `${kategoriAdi} için kayıt yok`;
}

/** `a11y.kategori_gun` — "{gun} {ay}" (E-15 satır erişilebilirliği) */
export function kategoriGunEtiketi(gun: string, ay: string): string {
  const englishText = dinamikMetin('kategoriGunEtiketi', [gun, ay]);
  if (englishText !== null) return englishText;
  return `${gun} ${ay}`;
}

/** `taksit.kalan_toplam` — "Kalan toplam {tutar}. Sonuncusu {ayYil} tarihinde bitiyor." */
export function taksitKalanToplam(tutar: string, ayYil: string): string {
  const englishText = dinamikMetin('taksitKalanToplam', [tutar, ayYil]);
  if (englishText !== null) return englishText;
  return `Kalan toplam ${tutar}. Sonuncusu ${ayYil} tarihinde bitiyor.`;
}

/** `taksit.seri_bitti` — ürün adı yoksa yedek: "{kategori} serisi {ay} ayında bitti. Aylık yük {tutar} düştü." */
export function taksitSeriBitti(kategoriAdi: string, ay: string, tutar: string): string {
  const englishText = dinamikMetin('taksitSeriBitti', [kategoriAdi, ay, tutar]);
  if (englishText !== null) return englishText;
  return `${kategoriAdi} serisi ${ay} ayında bitti. Aylık yük ${tutar} düştü.`;
}

/** REV3 §30.2 `taksit.seri_bitti_urun` — "{urun} taksidi {ay} ayında bitti. Aylık yük {tutar} düştü." */
export function taksitSeriBittiUrun(urunAdi: string, ay: string, tutar: string): string {
  const englishText = dinamikMetin('taksitSeriBittiUrun', [urunAdi, ay, tutar]);
  if (englishText !== null) return englishText;
  return `${urunAdi} taksidi ${ay} ayında bitti. Aylık yük ${tutar} düştü.`;
}

/** REV3 §30.2 `taksit.ozet_kategorili` — çok kategorili bölüm başlığının sağı: "{n} kategori · {n} ürün". */
export function taksitOzetKategorili(kategoriSayisi: number, urunSayisi: number): string {
  const englishText = dinamikMetin('taksitOzetKategorili', [kategoriSayisi, urunSayisi]);
  if (englishText !== null) return englishText;
  return `${kategoriSayisi} kategori · ${urunSayisi} ürün`;
}

/** REV3 §30.2 `taksit.ozet_tek_kategori` — tek kategoride bölüm başlığının sağı: "{n} ürün". */
export function taksitOzetTekKategori(urunSayisi: number): string {
  const englishText = dinamikMetin('taksitOzetTekKategori', [urunSayisi]);
  if (englishText !== null) return englishText;
  return `${urunSayisi} ürün`;
}

/** REV3 §30.2 `taksit.kategori_ozet` — kapalı kategori akordiyonunun özeti: "{tutar} · {n} ürün". */
export function taksitKategoriOzet(tutar: string, urunSayisi: number): string {
  const englishText = dinamikMetin('taksitKategoriOzet', [tutar, urunSayisi]);
  if (englishText !== null) return englishText;
  return `${tutar} · ${urunSayisi} ürün`;
}

/** REV3 §30.2 `taksit.seri_kalan` — ürün satırının ikincil satırı: "{mevcut}/{toplam} · kalan {tutar}". */
export function taksitSeriKalan(mevcut: number, toplam: number, kalanTutar: string): string {
  const englishText = dinamikMetin('taksitSeriKalan', [mevcut, toplam, kalanTutar]);
  if (englishText !== null) return englishText;
  return `${mevcut}/${toplam} · kalan ${kalanTutar}`;
}

/** REV3 §30.2 `taksit.urun_yok` — ürün adı boş kaydedilmiş serinin satır başlığı: "{Kategori} taksidi". */
export function taksitUrunYok(kategoriAdi: string): string {
  const englishText = dinamikMetin('taksitUrunYok', [kategoriAdi]);
  if (englishText !== null) return englishText;
  return `${kategoriAdi} taksidi`;
}

/** REV3 §30.4 `a11y.taksit.kategori` — "{kategori}. {tutar}, {n} ürün". */
export function a11yTaksitKategori(kategoriAdi: string, tutar: string, urunSayisi: number): string {
  const englishText = dinamikMetin('a11yTaksitKategori', [kategoriAdi, tutar, urunSayisi]);
  if (englishText !== null) return englishText;
  return `${kategoriAdi}. ${tutar}, ${urunSayisi} ürün`;
}

/** REV3 §30.4 `a11y.taksit.seri` — "{urun}. Bu ay {tutar}. {mevcut}. taksit, {toplam} taksitten. Kalan {kalan}. Ayrıntıyı aç" */
export function a11yTaksitSeri(urunAdi: string, tutar: string, mevcut: number, toplam: number, kalanTutar: string): string {
  const englishText = dinamikMetin('a11yTaksitSeri', [urunAdi, tutar, mevcut, toplam, kalanTutar]);
  if (englishText !== null) return englishText;
  return `${urunAdi}. Bu ay ${tutar}. ${mevcut}. taksit, ${toplam} taksitten. Kalan ${kalanTutar}. Ayrıntıyı aç`;
}

/** REV3 §30.4 `a11y.taksit.seri_son` — "{urun}. Bu ay {tutar}. Son taksit. Ayrıntıyı aç" */
export function a11yTaksitSeriSon(urunAdi: string, tutar: string): string {
  const englishText = dinamikMetin('a11yTaksitSeriSon', [urunAdi, tutar]);
  if (englishText !== null) return englishText;
  return `${urunAdi}. Bu ay ${tutar}. Son taksit. Ayrıntıyı aç`;
}

/** REV3 §30.4 `a11y.taksit.tumunu_goster` — "{n} ürünün tamamını göster" */
export function a11yTaksitTumunuGoster(urunSayisi: number): string {
  const englishText = dinamikMetin('a11yTaksitTumunuGoster', [urunSayisi]);
  if (englishText !== null) return englishText;
  return `${urunSayisi} ürünün tamamını göster`;
}

/** `gunluk.gun_kapandi` — "Gün kapandı. {adet} kayıt, {tutar}." */
export function gunlukGunKapandi(adet: number, tutar: string): string {
  const englishText = dinamikMetin('gunlukGunKapandi', [adet, tutar]);
  if (englishText !== null) return englishText;
  return `Gün kapandı. ${adet} kayıt, ${tutar}.`;
}

/** `gunluk.gun_kapandi_disinda` — "Gün kapandı. {tutar}, limitin {fark} üzerinde." */
export function gunlukGunKapandiDisinda(tutar: string, fark: string): string {
  const englishText = dinamikMetin('gunlukGunKapandiDisinda', [tutar, fark]);
  if (englishText !== null) return englishText;
  return `Gün kapandı. ${tutar}, limitin ${fark} üzerinde.`;
}

/** `seri.cip` a11y — "Seri {n} gün. Seri ekranını aç" · görünen etiket "Seri {n} gün" */
export function seriCipEtiketi(n: number): string {
  const englishText = dinamikMetin('seriCipEtiketi', [n]);
  if (englishText !== null) return englishText;
  return `Seri ${n} gün`;
}
export function seriCipA11y(n: number): string {
  const englishText = dinamikMetin('seriCipA11y', [n]);
  if (englishText !== null) return englishText;
  return `Seri ${n} gün. Seri ekranını aç`;
}

/** `gunluk.grup.bugun` / `.kalan` / `.limit_disi` — kategori satırı ikincil bilgisi */
export function gunlukGrupBugun(tutar: string): string {
  const englishText = dinamikMetin('gunlukGrupBugun', [tutar]);
  if (englishText !== null) return englishText;
  return `bugün ${tutar}`;
}
export function gunlukGrupKalan(tutar: string): string {
  const englishText = dinamikMetin('gunlukGrupKalan', [tutar]);
  if (englishText !== null) return englishText;
  return `kalan ${tutar}`;
}
export function gunlukGrupLimitDisi(tutar: string): string {
  const englishText = dinamikMetin('gunlukGrupLimitDisi', [tutar]);
  if (englishText !== null) return englishText;
  return `${tutar} limit dışı`;
}

/** `gunluk.a11y.gruba_ekle` — "{kategori} kategorisine harcama ekle" */
export function gunlukA11yGrubaEkle(kategoriAdi: string): string {
  const englishText = dinamikMetin('gunlukA11yGrubaEkle', [kategoriAdi]);
  if (englishText !== null) return englishText;
  return `${kategoriAdi} kategorisine harcama ekle`;
}

/* --------------------------------------------------------- v4 · E-21 Seri */

/** `seri.aktif.govde` — "{n} gündür kayıt giriyorsun." */
export function seriAktifGovde(n: number): string {
  const englishText = dinamikMetin('seriAktifGovde', [n]);
  if (englishText !== null) return englishText;
  return `${n} gündür kayıt giriyorsun.`;
}

/** `seri.durak.kalan` — "{n} gün kaldı" */
export function seriDurakKalan(n: number): string {
  const englishText = dinamikMetin('seriDurakKalan', [n]);
  if (englishText !== null) return englishText;
  return `${n} gün kaldı`;
}

/** `seri.durak.sonraki` — "Sıradaki durak {n} gün" */
export function seriDurakSonraki(n: number): string {
  const englishText = dinamikMetin('seriDurakSonraki', [n]);
  if (englishText !== null) return englishText;
  return `Sıradaki durak ${n} gün`;
}

/** `seri.durak.a11y` — "{n} gün durağı geçildi / sırada / ileride" */
export function seriDurakA11y(n: number, hal: 'gecildi' | 'sirada' | 'ileride'): string {
  if (ingilizceMi()) {
    const durum = hal === 'gecildi' ? 'reached' : hal === 'sirada' ? 'next' : 'upcoming';
    return `${n}-day milestone ${durum}`;
  }
  const kelime = hal === 'gecildi' ? 'geçildi' : hal === 'sirada' ? 'sırada' : 'ileride';
  return `${n} gün durağı ${kelime}`;
}

/** `seri.pencere` — "Son 4 hafta" başlığının altındaki tarih aralığı zaten `haftaAraligi`de. */
export function seriPencereBaslik(): string {
  return ingilizceMi() ? 'Last 4 weeks' : 'Son 4 hafta';
}

/** `seri.gun.a11y` — "{g} {Ay}, limit altında / limit dışı / kayıt yok" */
export function seriGunA11y(gunAy: string, durum: 'altinda' | 'disinda' | 'bos'): string {
  if (ingilizceMi()) {
    const metin = durum === 'altinda' ? 'under the limit' : durum === 'disinda' ? 'over the limit' : 'no records';
    return `${gunAy}, ${metin}`;
  }
  const metin = durum === 'altinda' ? 'limit altında' : durum === 'disinda' ? 'limit dışı' : 'kayıt yok';
  return `${gunAy}, ${metin}`;
}

/** `kutlama.baslik` — "{n} gün" */
export function kutlamaBaslik(n: number): string {
  const englishText = dinamikMetin('kutlamaBaslik', [n]);
  if (englishText !== null) return englishText;
  return `${n} gün`;
}

/** `kutlama.govde` — "Seri {n} güne ulaştı. Sıradaki durak {m} gün." (son durak: "Sıradaki durak yok.") */
export function kutlamaGovde(n: number, sonrakiDurak: number | null): string {
  if (ingilizceMi()) {
    return sonrakiDurak
      ? `You reached a ${n}-day streak. Next milestone: ${sonrakiDurak} days.`
      : `You reached a ${n}-day streak.`;
  }
  return sonrakiDurak
    ? `Seri ${n} güne ulaştı. Sıradaki durak ${sonrakiDurak} gün.`
    : `Seri ${n} güne ulaştı.`;
}

/* ----------------------------------------------------- v4 · E-24 Gün seçici */

/** `gunsec.alt.kayitli` — "{n} gün kayıtlı" */
export function gunsecAltKayitli(n: number): string {
  const englishText = dinamikMetin('gunsecAltKayitli', [n]);
  if (englishText !== null) return englishText;
  return `${n} gün kayıtlı`;
}

/** `gunsec.alt.acik_gun` — "Açık gün {g} {Ay}" */
export function gunsecAltAcikGun(gAy: string): string {
  const englishText = dinamikMetin('gunsecAltAcikGun', [gAy]);
  if (englishText !== null) return englishText;
  return `Açık gün ${gAy}`;
}

/** `gunsec.sinir.baslangic` — "Trinkow'a {g} {Ay}'ta başladın. Daha öncesi yok." */
export function gunsecSinirBaslangic(gAy: string): string {
  const englishText = dinamikMetin('gunsecSinirBaslangic', [gAy]);
  if (englishText !== null) return englishText;
  return `Trinkow'a ${gAy}'ta başladın. Daha öncesi yok.`;
}

/** `gunsec.ozet.baslik` — "{Ay} özeti" */
export function gunsecOzetBasligi(ayAdi: string): string {
  const englishText = dinamikMetin('gunsecOzetBasligi', [ayAdi]);
  if (englishText !== null) return englishText;
  return `${ayAdi} özeti`;
}

/** `gunsec.a11y.gun` — "{g} {Ay} {GünAdı}, {durum}[, bugün]" */
export function gunsecA11yGun(gAyGunAdi: string, durum: string, bugunMu: boolean): string {
  if (ingilizceMi()) return bugunMu ? `${gAyGunAdi}, ${durum}, today` : `${gAyGunAdi}, ${durum}`;
  return bugunMu ? `${gAyGunAdi}, ${durum}, bugün` : `${gAyGunAdi}, ${durum}`;
}

/* ----------------------------------------------------- v4 · E-11 ürün arama */

/** `ekle.arama.satir.gecen` — "{kategori} · geçen sefer {tutar}" */
export function ekleAramaSatirGecen(kategoriAdi: string, tutar: string): string {
  const englishText = dinamikMetin('ekleAramaSatirGecen', [kategoriAdi, tutar]);
  if (englishText !== null) return englishText;
  return `${kategoriAdi} · geçen sefer ${tutar}`;
}

/** Kategori tahmini notu — kullanıcı seçmediyse form tahmini ön-seçer. */
export function ekleKategoriTahmini(kategoriAdi: string): string {
  const englishText = dinamikMetin('ekleKategoriTahmini', [kategoriAdi]);
  if (englishText !== null) return englishText;
  return `Tahmin: ${kategoriAdi}. Yanlışsa değiştir.`;
}

/** `ekle.arama.yeni.baslik` — `"{arama}" olarak ekle` */
export function ekleAramaYeniBaslik(arama: string): string {
  const englishText = dinamikMetin('ekleAramaYeniBaslik', [arama]);
  if (englishText !== null) return englishText;
  return `"${arama}" olarak ekle`;
}

/** `ekle.arama.yeni.alt` — "Kategoriyi ve tutarı sen seç." */
export const EKLE_ARAMA_YENI_ALT = 'Kategoriyi ve tutarı sen seç.';

/** `ekle.tutar.oneri.cip` — "Geçen sefer {tutar}" */
export function ekleTutarOneriCip(tutar: string): string {
  const englishText = dinamikMetin('ekleTutarOneriCip', [tutar]);
  if (englishText !== null) return englishText;
  return `Geçen sefer ${tutar}`;
}

/** `ekle.gun.serit` — "Bu kayıt {gün}'e yazılacak." */
export function ekleGunSeridi(gun: string): string {
  const englishText = dinamikMetin('ekleGunSeridi', [gun]);
  if (englishText !== null) return englishText;
  return `Bu kayıt ${gun}'e yazılacak.`;
}

/** `a11y.ekle.gun` — "Gün seç, şu an {gün}" */
export function a11yEkleGun(gun: string): string {
  const englishText = dinamikMetin('a11yEkleGun', [gun]);
  if (englishText !== null) return englishText;
  return `Gün seç, şu an ${gun}`;
}

/** `a11y.ekle.oneriCip` — "Geçen sefer ödediğin {tutar} tutarını kullan" */
export function a11yEkleOneriCip(tutar: string): string {
  const englishText = dinamikMetin('a11yEkleOneriCip', [tutar]);
  if (englishText !== null) return englishText;
  return `Geçen sefer ödediğin ${tutar} tutarını kullan`;
}

/** `a11y.ekle.sonKullanilan` — "{ad}, geçen sefer {tutar}" */
export function a11yEkleSonKullanilan(ad: string, tutar: string): string {
  const englishText = dinamikMetin('a11yEkleSonKullanilan', [ad, tutar]);
  if (englishText !== null) return englishText;
  return `${ad}, geçen sefer ${tutar}`;
}

/* ------------------------------------------------- D-2d-3a · Onboarding */

/** `a11y.ob.gun` — "Ayın {n}. günü" (E-03 gün ızgarası, prototip aria-label deseni). */
export function a11yObGun(gun: number): string {
  const englishText = dinamikMetin('a11yObGun', [gun]);
  if (englishText !== null) return englishText;
  return `Ayın ${gun}. günü`;
}

/** `ob.ozet` maaş günü değeri — 15 → "Ayın 15'i" (`lib/tarih.ts#gunIyelikEki`). */
export function obOzetMaasGunu(gunEki: string): string {
  const englishText = dinamikMetin('obOzetMaasGunu', [gunEki]);
  if (englishText !== null) return englishText;
  return `Ayın ${gunEki}`;
}

/* ---------------------------------------------------------- D-2c-1 · E-19 */

/** `ayar.surum` — "Sürüm {surum}" */
export function ayarSurum(surum: string): string {
  const englishText = dinamikMetin('ayarSurum', [surum]);
  if (englishText !== null) return englishText;
  return `Sürüm ${surum}`;
}

/** `ayar.plan.kalan` / `.bekliyor` — "{n} kart kaldı" · "8 kart bekliyor" (metinler.md §26.3). */
export function ayarPlanKalan(n: number): string {
  const englishText = dinamikMetin('ayarPlanKalan', [n]);
  if (englishText !== null) return englishText;
  return `${n} kart kaldı`;
}
export function ayarPlanBekliyor(n: number): string {
  const englishText = dinamikMetin('ayarPlanBekliyor', [n]);
  if (englishText !== null) return englishText;
  return `${n} kart bekliyor`;
}

/** `a11y` — "Maaş günü: {deger}. Değiştir" / "Kip: {deger}. Değiştir" / "Bildirim saati: {deger}. Değiştir" desenleri. */
export function a11yDegerDegistir(etiket: string, deger: string): string {
  const englishText = dinamikMetin('a11yDegerDegistir', [etiket, deger]);
  if (englishText !== null) return englishText;
  return `${etiket}: ${deger}. Değiştir`;
}

/** `hesapsil.veri` — "{n} kayıt dahil tüm verilerin silinir." */
export function hesapsilVeri(n: number): string {
  const englishText = dinamikMetin('hesapsilVeri', [n]);
  if (englishText !== null) return englishText;
  return `${n} kayıt dahil tüm verilerin silinir.`;
}

/** `ayar.veri_sil_ozet` — "{adet} kayıt · {ay} {yil}'dan bugüne" */
export function ayarVeriSilOzet(adet: number, ayYil: string): string {
  const englishText = dinamikMetin('ayarVeriSilOzet', [adet, ayYil]);
  if (englishText !== null) return englishText;
  return `${adet} kayıt · ${ayYil}'dan bugüne`;
}

/* ---------------------------------------------------------- D-2c-1 · E-20 */

/** `prof.gun` — "{n}. gün" */
export function profGun(n: number): string {
  const englishText = dinamikMetin('profGun', [n]);
  if (englishText !== null) return englishText;
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
  if (ingilizceMi()) {
    const ayAdi = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2024, ((ay - 1) % 12 + 12) % 12, 1));
    return `in ${ayAdi}`;
  }
  return AY_LOKATIF[((ay - 1) % 12 + 12) % 12];
}

/** `tasarruf.ustSatir.devam` / `.kapandi` — "{Ay} {yıl} · ay devam ediyor" / "· ay kapandı" */
export function tasarrufUstSatir(ayYil: string, kapandiMi: boolean): string {
  if (ingilizceMi()) return `${ayYil} · ${kapandiMi ? 'month closed' : 'month in progress'}`;
  return `${ayYil} · ay ${kapandiMi ? 'kapandı' : 'devam ediyor'}`;
}

/** `tasarruf.gosterge.cumle.buAy` — "Kaydettiğin gelir ve harcamalara göre {n} gün hesaplandı." */
export function tasarrufGostergeCumleBuAy(gunSayisi: number): string {
  const englishText = dinamikMetin('tasarrufGostergeCumleBuAy', [gunSayisi]);
  if (englishText !== null) return englishText;
  return `Kaydettiğin gelir ve harcamalara göre ${gunSayisi} gün hesaplandı.`;
}

/** `tasarruf.gosterge.cumle.gecmisAy` — "{AyLokatif} kaydettiğin gelir ve harcamalara göre {n} gün hesaplandı." */
export function tasarrufGostergeCumleGecmisAy(ayLokatifDeger: string, gunSayisi: number): string {
  const englishText = dinamikMetin('tasarrufGostergeCumleGecmisAy', [ayLokatifDeger, gunSayisi]);
  if (englishText !== null) return englishText;
  return `${ayLokatifDeger} kaydettiğin gelir ve harcamalara göre ${gunSayisi} gün hesaplandı.`;
}

/** `tasarruf.birikim.ayEkleme.buAy` — "Bu ay {tutar} eklendi" */
export function tasarrufBirikimAyEklemeBuAy(tutar: string): string {
  const englishText = dinamikMetin('tasarrufBirikimAyEklemeBuAy', [tutar]);
  if (englishText !== null) return englishText;
  return `Bu ay ${tutar} eklendi`;
}

/** `tasarruf.birikim.ayEkleme.gecmisAy` — "{AyLokatif} {tutar} eklendi" */
export function tasarrufBirikimAyEklemeGecmisAy(ayLokatifDeger: string, tutar: string): string {
  const englishText = dinamikMetin('tasarrufBirikimAyEklemeGecmisAy', [ayLokatifDeger, tutar]);
  if (englishText !== null) return englishText;
  return `${ayLokatifDeger} ${tutar} eklendi`;
}

/** `tasarruf.birikim.ayCekme.buAy` — "Bu ay {tutar} çekildi" */
export function tasarrufBirikimAyCekmeBuAy(tutar: string): string {
  const englishText = dinamikMetin('tasarrufBirikimAyCekmeBuAy', [tutar]);
  if (englishText !== null) return englishText;
  return `Bu ay ${tutar} çekildi`;
}

/** `tasarruf.birikim.ayCekme.gecmisAy` — "{AyLokatif} {tutar} çekildi" */
export function tasarrufBirikimAyCekmeGecmisAy(ayLokatifDeger: string, tutar: string): string {
  const englishText = dinamikMetin('tasarrufBirikimAyCekmeGecmisAy', [ayLokatifDeger, tutar]);
  if (englishText !== null) return englishText;
  return `${ayLokatifDeger} ${tutar} çekildi`;
}

/** `tasarruf.birikim.ayYok.gecmisAy` — "{AyLokatif} kayıt yok" */
export function tasarrufBirikimAyYokGecmisAy(ayLokatifDeger: string): string {
  const englishText = dinamikMetin('tasarrufBirikimAyYokGecmisAy', [ayLokatifDeger]);
  if (englishText !== null) return englishText;
  return `${ayLokatifDeger} kayıt yok`;
}

/** `tasarruf.birikim.hedef` — "Hedef {tutar}" */
export function tasarrufBirikimHedef(tutar: string): string {
  const englishText = dinamikMetin('tasarrufBirikimHedef', [tutar]);
  if (englishText !== null) return englishText;
  return `Hedef ${tutar}`;
}

/** `tasarruf.hareket.sayi` — "{n} kayıt" */
export function tasarrufHareketSayi(adet: number): string {
  const englishText = dinamikMetin('tasarrufHareketSayi', [adet]);
  if (englishText !== null) return englishText;
  return `${adet} kayıt`;
}

/** `tasarruf.hareket.bos.alt.gecmisAy` — "{AyLokatif} kenara ayırdığın para yok." */
export function tasarrufHareketBosAltGecmisAy(ayLokatifDeger: string): string {
  const englishText = dinamikMetin('tasarrufHareketBosAltGecmisAy', [ayLokatifDeger]);
  if (englishText !== null) return englishText;
  return `${ayLokatifDeger} kenara ayırdığın para yok.`;
}

/** `tasarruf.hareket.silindiToast` — "{tutar} silindi · Geri al" (eylem etiketi ayrı geçilir, bkz. toastGoster) */
export function tasarrufHareketSilindiToast(tutar: string): string {
  const englishText = dinamikMetin('tasarrufHareketSilindiToast', [tutar]);
  if (englishText !== null) return englishText;
  return `${tutar} silindi`;
}

/** `tasarruf.hareket.kaydedildiToast` — "{tutar} birikime eklendi" */
export function tasarrufHareketKaydedildiToast(tutar: string): string {
  const englishText = dinamikMetin('tasarrufHareketKaydedildiToast', [tutar]);
  if (englishText !== null) return englishText;
  return `${tutar} birikime eklendi`;
}

/** `tasarruf.kategori.pay` — "payı %{n}" (işaret önce, boşluksuz) */
export function tasarrufKategoriPay(yuzde: number): string {
  const englishText = dinamikMetin('tasarrufKategoriPay', [yuzde]);
  if (englishText !== null) return englishText;
  return `payı %${yuzde}`;
}

/** `tasarruf.kategori.rutin` — "rutin {tutar}" */
export function tasarrufKategoriRutin(tutar: string): string {
  const englishText = dinamikMetin('tasarrufKategoriRutin', [tutar]);
  if (englishText !== null) return englishText;
  return `rutin ${tutar}`;
}

export function ozetRutinTasarrufu(tutar: string): string {
  const englishText = dinamikMetin('summaryRoutineSavings', [tutar]);
  if (englishText !== null) return englishText;
  return `Rutin tasarrufu ${tutar}`;
}

/** `tasarruf.kategori.bos.gecmisAy` — "{AyLokatif} harcama yazmamışsın." */
export function tasarrufKategoriBosGecmisAy(ayLokatifDeger: string): string {
  const englishText = dinamikMetin('tasarrufKategoriBosGecmisAy', [ayLokatifDeger]);
  if (englishText !== null) return englishText;
  return `${ayLokatifDeger} harcama yazmamışsın.`;
}

/** `tasarruf.rutin.bos.gecmisAy` — "{AyLokatif} vazgeçtiğin rutin yok." */
export function tasarrufRutinBosGecmisAy(ayLokatifDeger: string): string {
  const englishText = dinamikMetin('tasarrufRutinBosGecmisAy', [ayLokatifDeger]);
  if (englishText !== null) return englishText;
  return `${ayLokatifDeger} vazgeçtiğin rutin yok.`;
}

/** Rutin akordiyonu kapalı özeti: kaç gün ve kaç adet alınmadı. */
export function tasarrufRutinOzet(gunSayisi: number, adet: number): string {
  const englishText = dinamikMetin('tasarrufRutinOzet', [gunSayisi, adet]);
  if (englishText !== null) return englishText;
  return `${gunSayisi} gün · ${adet} adet alınmadı`;
}

/** Rutin akordiyonu günlük satır açıklaması. */
export function tasarrufRutinGunDetay(adet: number, birimTutar: string): string {
  const englishText = dinamikMetin('tasarrufRutinGunDetay', [adet, birimTutar]);
  if (englishText !== null) return englishText;
  return `${adet} adet alınmadı · birim ${birimTutar}`;
}

/** Akordiyonda ilk yedi günün arkasındaki günler de toplama dahildir. */
export function tasarrufRutinFazlaGun(adet: number): string {
  const englishText = dinamikMetin('tasarrufRutinFazlaGun', [adet]);
  if (englishText !== null) return englishText;
  return `+${adet} gün daha bu toplama dahil`;
}

// §28.3 — E-27 akordiyon özetleri (REV3)

/** `tasarruf.ozet.butce` — "Kalan {tutar}" */
export function tasarrufOzetButce(tutar: string): string {
  const englishText = dinamikMetin('tasarrufOzetButce', [tutar]);
  if (englishText !== null) return englishText;
  return `Kalan ${tutar}`;
}

/** `tasarruf.ozet.birikim` — "{tutar} · hedefin %{n}'i" */
export function tasarrufOzetBirikim(tutar: string, yuzde: number): string {
  const englishText = dinamikMetin('tasarrufOzetBirikim', [tutar, yuzde]);
  if (englishText !== null) return englishText;
  return `${tutar} · hedefin %${yuzde}'i`;
}

/** `tasarruf.ozet.rutin` — "{tutar} · {n} rutin" */
export function tasarrufOzetRutin(tutar: string, rutinSayisi: number): string {
  const englishText = dinamikMetin('tasarrufOzetRutin', [tutar, rutinSayisi]);
  if (englishText !== null) return englishText;
  return `${tutar} · ${rutinSayisi} rutin`;
}

/** `a11y.tasarruf.bolum` — "{başlık}. {özet}" */
export function a11yTasarrufBolum(baslik: string, ozet: string): string {
  const englishText = dinamikMetin('a11yTasarrufBolum', [baslik, ozet]);
  if (englishText !== null) return englishText;
  return `${baslik}. ${ozet}`;
}

// §29 — E-10 Günlük rutin hızlı eylem satırı (REV3)

/** `gunlukRutin.ozet` — "{n} rutin · {n} işaretsiz" */
export function gunlukRutinOzet(toplam: number, isaretsiz: number): string {
  const englishText = dinamikMetin('gunlukRutinOzet', [toplam, isaretsiz]);
  if (englishText !== null) return englishText;
  return `${toplam} rutin · ${isaretsiz} işaretsiz`;
}

/** `gunlukRutin.ozetHepsi` — "{n} rutin · hepsi işaretli" */
export function gunlukRutinOzetHepsi(toplam: number): string {
  const englishText = dinamikMetin('gunlukRutinOzetHepsi', [toplam]);
  if (englishText !== null) return englishText;
  return `${toplam} rutin · hepsi işaretli`;
}

/** `gunlukRutin.ozetHicbiri` — "{n} rutin · işaretlenmedi" */
export function gunlukRutinOzetHicbiri(toplam: number): string {
  const englishText = dinamikMetin('gunlukRutinOzetHicbiri', [toplam]);
  if (englishText !== null) return englishText;
  return `${toplam} rutin · işaretlenmedi`;
}

/** `gunlukRutin.ozetHata` — "{n} rutin · işaret bekliyor" */
export function gunlukRutinOzetHata(toplam: number): string {
  const englishText = dinamikMetin('gunlukRutinOzetHata', [toplam]);
  if (englishText !== null) return englishText;
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

/** `gunlukRutin.toast.aldim` — "{ad} {tutar} yazıldı." */
export function gunlukRutinToastAldim(ad: string, tutar: string): string {
  const englishText = dinamikMetin('gunlukRutinToastAldim', [ad, tutar]);
  if (englishText !== null) return englishText;
  return `${ad} ${tutar} yazıldı.`;
}

/** `gunlukRutin.toast.almadim` — "{ad} almadın olarak işaretlendi." */
export function gunlukRutinToastAlmadim(ad: string): string {
  const englishText = dinamikMetin('gunlukRutinToastAlmadim', [ad]);
  if (englishText !== null) return englishText;
  return `${ad} almadın olarak işaretlendi.`;
}

/** `a11y.gunlukRutin.bolum` — "Rutinler. {özet}" */
export function a11yGunlukRutinBolum(ozet: string): string {
  const englishText = dinamikMetin('a11yGunlukRutinBolum', [ozet]);
  if (englishText !== null) return englishText;
  return `${t['gunlukRutin.baslik']}. ${ozet}`;
}

/** `a11y.gunlukRutin.bolumGecmis` — "Rutinler. {gün}. {özet}" */
export function a11yGunlukRutinBolumGecmis(gun: string, ozet: string): string {
  const englishText = dinamikMetin('a11yGunlukRutinBolumGecmis', [gun, ozet]);
  if (englishText !== null) return englishText;
  return `${t['gunlukRutin.baslik']}. ${gun}. ${ozet}`;
}

/** `a11y.gunlukRutin.aldim` — "{ad} aldım olarak işaretle, {tutar}" */
export function a11yGunlukRutinAldim(ad: string, tutar: string): string {
  const englishText = dinamikMetin('a11yGunlukRutinAldim', [ad, tutar]);
  if (englishText !== null) return englishText;
  return `${ad} aldım olarak işaretle, ${tutar}`;
}

/** `a11y.gunlukRutin.almadim` — "{ad} almadım olarak işaretle, {tutar} rutin tasarrufu" */
export function a11yGunlukRutinAlmadim(ad: string, tutar: string): string {
  const englishText = dinamikMetin('a11yGunlukRutinAlmadim', [ad, tutar]);
  if (englishText !== null) return englishText;
  return `${ad} almadım olarak işaretle, ${tutar} rutin tasarrufu`;
}

/** `a11y.gunlukRutin.yaziliyor` — "{ad} yazılıyor" */
export function a11yGunlukRutinYaziliyor(ad: string): string {
  const englishText = dinamikMetin('a11yGunlukRutinYaziliyor', [ad]);
  if (englishText !== null) return englishText;
  return `${ad} yazılıyor`;
}

/** `a11y.gunlukRutin.isaretleniyor` — "{ad} işaretleniyor" */
export function a11yGunlukRutinIsaretleniyor(ad: string): string {
  const englishText = dinamikMetin('a11yGunlukRutinIsaretleniyor', [ad]);
  if (englishText !== null) return englishText;
  return `${ad} işaretleniyor`;
}

/** `a11y.gunlukRutin.aldimGecmis` — "{ad}, {gün}. Aldım olarak işaretle, {tutar}" */
export function a11yGunlukRutinAldimGecmis(ad: string, gun: string, tutar: string): string {
  const englishText = dinamikMetin('a11yGunlukRutinAldimGecmis', [ad, gun, tutar]);
  if (englishText !== null) return englishText;
  return `${ad}, ${gun}. Aldım olarak işaretle, ${tutar}`;
}

/** `a11y.gunlukRutin.almadimGecmis` — "{ad}, {gün}. Almadım olarak işaretle, {tutar} rutin tasarrufu" */
export function a11yGunlukRutinAlmadimGecmis(ad: string, gun: string, tutar: string): string {
  const englishText = dinamikMetin('a11yGunlukRutinAlmadimGecmis', [ad, gun, tutar]);
  if (englishText !== null) return englishText;
  return `${ad}, ${gun}. Almadım olarak işaretle, ${tutar} rutin tasarrufu`;
}

/**
 * `a11y.bolumYukleniyor` — "{başlık}. Yükleniyor". Ö5 — E-10 rutin bölümü VE
 * E-27 akordiyonunun dört bölümü PAYLAŞIR (aynı anahtar, farklı `baslik`).
 */
export function a11yBolumYukleniyor(baslik: string): string {
  const englishText = dinamikMetin('a11yBolumYukleniyor', [baslik]);
  if (englishText !== null) return englishText;
  return `${baslik}. Yükleniyor`;
}

/** `a11y.tasarruf.hareket` — "{yön}, {gün} {Ay}, {tutar}, not: {not}" */
export function a11yTasarrufHareket(yon: string, gun: number, ay: string, tutar: string, notMetni?: string): string {
  if (ingilizceMi()) return `${yon}, ${ay} ${gun}, ${tutar}${notMetni ? `, note: ${notMetni}` : ''}`;
  return `${yon}, ${gun} ${ay}, ${tutar}${notMetni ? `, not: ${notMetni}` : ''}`;
}

/** `profil.satir.butceDeger` — "Aylık net gelir {tutar} · {n} sabit gider" */
export function profilSatirButceDeger(tutar: string, sabitGiderSayisi: number): string {
  const englishText = dinamikMetin('profilSatirButceDeger', [tutar, sabitGiderSayisi]);
  if (englishText !== null) return englishText;
  return `Aylık net gelir ${tutar} · ${sabitGiderSayisi} sabit gider`;
}

/** `profil.satir.limitlerDeger` — "Günlük {tutar} · {n} kategori limiti" */
export function profilSatirLimitlerDeger(gunlukTutar: string, kategoriLimitSayisi: number): string {
  const englishText = dinamikMetin('profilSatirLimitlerDeger', [gunlukTutar, kategoriLimitSayisi]);
  if (englishText !== null) return englishText;
  return `Günlük ${gunlukTutar} · ${kategoriLimitSayisi} kategori limiti`;
}

/** `profil.satir.rutinlerDeger` — "{n} rutin · bu ay {tutar} tasarruf" */
export function profilSatirRutinlerDeger(rutinSayisi: number, tutar: string): string {
  const englishText = dinamikMetin('profilSatirRutinlerDeger', [rutinSayisi, tutar]);
  if (englishText !== null) return englishText;
  return `${rutinSayisi} rutin · bu ay ${tutar} tasarruf`;
}

/** `profil.satir.favorilerDeger` — "{n} ürün, son fiyatlarıyla" */
export function profilSatirFavorilerDeger(urunSayisi: number): string {
  const englishText = dinamikMetin('profilSatirFavorilerDeger', [urunSayisi]);
  if (englishText !== null) return englishText;
  return `${urunSayisi} ürün, son fiyatlarıyla`;
}

/** `profil.satir.taksitlerDeger` — "{n} seri · bu ay {tutar}" */
export function profilSatirTaksitlerDeger(seriSayisi: number, tutar: string): string {
  const englishText = dinamikMetin('profilSatirTaksitlerDeger', [seriSayisi, tutar]);
  if (englishText !== null) return englishText;
  return `${seriSayisi} seri · bu ay ${tutar}`;
}

/** `profil.satir.seriDeger` — "{n} gün · en uzun {n} gün" */
export function profilSatirSeriDeger(mevcutSeri: number, enUzunSeri: number): string {
  const englishText = dinamikMetin('profilSatirSeriDeger', [mevcutSeri, enUzunSeri]);
  if (englishText !== null) return englishText;
  return `${mevcutSeri} gün · en uzun ${enUzunSeri} gün`;
}

/** `profil.alt.surum` — "Trinkow · sürüm {n}" */
export function profilAltSurum(surum: string): string {
  const englishText = dinamikMetin('profilAltSurum', [surum]);
  if (englishText !== null) return englishText;
  return `Trinkow · sürüm ${surum}`;
}

/** `profil.kimlik.serit.gun` — "{n} gündür kayıt giriyorsun" */
export function profilKimlikSeritGun(mevcutSeri: number): string {
  const englishText = dinamikMetin('profilKimlikSeritGun', [mevcutSeri]);
  if (englishText !== null) return englishText;
  return `${mevcutSeri} gündür kayıt giriyorsun`;
}

/** `profil.kimlik.serit.altEnUzun` — "En uzun {n} gün." */
export function profilKimlikSeritAltEnUzun(enUzunSeri: number): string {
  const englishText = dinamikMetin('profilKimlikSeritAltEnUzun', [enUzunSeri]);
  if (englishText !== null) return englishText;
  return `En uzun ${enUzunSeri} gün.`;
}

/** `a11y.profil.satir` — "{başlık}. {değer}" */
export function a11yProfilSatir(baslik: string, deger: string): string {
  const englishText = dinamikMetin('a11yProfilSatir', [baslik, deger]);
  if (englishText !== null) return englishText;
  return `${baslik}. ${deger}`;
}
