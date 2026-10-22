# Trinkow Gizlilik Politikası

**Veri sorumlusu:** Triworkster  
**İletişim:** trinkow@gmail.com  
**Yürürlük tarihi:** 22 Ekim 2026
**Sürüm:** 1.1

Bu Gizlilik Politikası, Triworkster tarafından sunulan Trinkow mobil uygulamasında kişisel verilerin nasıl toplandığını, kullanıldığını, saklandığını ve silindiğini açıklar.

Trinkow; kullanıcının kendi girdiği verilerle bütçe, harcama, borç, birikim, abonelik ve rutin takibi sağlayan bir kişisel finans planlama aracıdır. Banka hesabına bağlanmaz, ödeme işlemez ve yatırım hizmeti sunmaz.

## 1. İşlenen kişisel veriler

Trinkow aşağıdaki veri kategorilerini işleyebilir:

- **Hesap ve kimlik doğrulama verileri:** E-posta adresi, hashlenmiş parola, Google ile giriş yapıldığında Google hesap kimliği (`sub`), doğrulanmış e-posta ve oturum kayıtları.
- **Finans ve planlama verileri:** Gelir ve maaş günü, bütçe, sabit giderler, borçlar, tasarruf hedefleri ve hareketleri, harcama tutarı, kategori, ürün adı, not, tarih/saat, ödeme türü, taksitler, abonelikler, rutinler, favoriler, kategori limitleri ve harcamasız gün kayıtları.
- **Tercih ve alışkanlık verileri:** Uygulama tercihleri, onboarding cevapları, bildirim tercihi ve zamanı ile kullanıcının isteğe bağlı olarak girdiği kahve, sigara, alkol ve dışarıda yeme gibi rutinler.
- **Güvenlik ve teknik veriler:** Oturum tokenları, parola sıfırlama ve kötüye kullanımı önleme kayıtları ile sunucu erişim kayıtlarında bulunabilecek IP adresi, istek zamanı ve temel cihaz/ağ bilgileri.

Sesli harcama özelliğini seçtiğinizde mikrofon yalnız konuşmanızı cihazın iOS veya Android konuşma tanıma hizmetiyle metne dönüştürmek için kullanılır. Trinkow ham ses kaydını saklamaz veya kendi sunucularına göndermez. Cihazınızdaki konuşma tanıma hizmeti, işletim sistemi ve cihaz ayarlarına bağlı olarak sesi cihazda ya da kendi hizmet altyapısında işleyebilir.

Trinkow banka veya kredi kartı numarası, banka giriş bilgisi, kesin konum, rehber, kamera, ham mikrofon kaydı, fotoğraf ya da reklam kimliği toplamaz.

## 2. Verilerin toplanması ve saklanması

Veriler doğrudan uygulamada yaptığınız girişlerden, hesap işlemlerinden ve Google ile giriş sırasında Google tarafından sağlanan kimlik bilgilerinden elektronik ortamda elde edilir.

Sesli girişte oluşan metin cihazda harcama taslağına dönüştürülür. Yalnız alanları kontrol edip **Kaydet** dediğinizde oluşan harcama alanları Trinkow backend hizmetine gönderilir.

Finansal ve profil verileri Trinkow backend hizmetindeki MongoDB veritabanında tutulur. Uygulama bu veriler için yerel SQLite veritabanı kullanmaz.

“Beni hatırla” seçildiğinde oturum tokenları ve hesap e-postası iOS Keychain veya Android Keystore tabanlı güvenli cihaz deposunda saklanır. Bu seçenek kullanılmadığında oturum bilgileri uygulama belleğiyle sınırlıdır.

## 3. İşleme amaçları ve hukuki sebepler

Kişisel veriler aşağıdaki amaçlarla işlenir:

- Hesap oluşturmak, kimlik doğrulamak ve oturumu yönetmek,
- Bütçe, harcama, borç, birikim ve rutin takibi özelliklerini sunmak,
- Kullanıcı kayıtlarını cihazlar arasında erişilebilir kılmak,
- Parola sıfırlama ve kullanıcı desteği sağlamak,
- Hizmet güvenliğini, kötüye kullanım önlemlerini ve hizmet sürekliliğini sağlamak,
- Yasal yükümlülükleri yerine getirmek ve hukuki talepleri yanıtlamak.

6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamındaki işleme; bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, hukuki yükümlülüklerin yerine getirilmesi ve ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati hukuki sebeplerine dayanır. Açık rıza gerektiren bir özellik sunulursa ayrıca açık rıza alınır ve bu rıza geri çekilebilir.

## 4. Verilerin paylaşılması

Kişisel veriler satılmaz; reklam hedefleme veya üçüncü taraf pazarlama amacıyla paylaşılmaz.

Veriler yalnız hizmetin çalışması için gerekli ve sınırlı ölçüde şu alıcı gruplarıyla paylaşılabilir:

- Sunucu ve barındırma hizmeti sağlayıcıları,
- MongoDB Atlas veritabanı altyapısı,
- Parola sıfırlama e-postaları için e-posta iletim sağlayıcısı,
- Google ile giriş seçildiğinde Google kimlik doğrulama hizmetleri,
- Hukuki zorunluluk hâlinde yetkili kamu kurumları ve adli merciler.

## 5. Yurt dışına aktarım

Kullanılan bulut, e-posta ve Google kimlik doğrulama altyapısının sunucuları Türkiye dışında bulunabilir. Bu nedenle kişisel veriler, hizmetin sunulması için gerekli ve sınırlı olmak üzere yurt dışındaki hizmet sağlayıcılara aktarılabilir. Aktarım süreçlerinde yürürlükteki mevzuatın öngördüğü uygun güvencelerin sağlanması amaçlanır.

## 6. Saklama süreleri

- Hesap, profil ve finans kayıtları hesabınız aktif olduğu süre boyunca veya siz silene kadar saklanır.
- Yenileme oturum kayıtları varsayılan olarak 30 gün sonra geçersiz olur.
- Parola sıfırlama bağlantıları 30 dakika sonra geçersiz olur.
- Kötüye kullanım önleme amacıyla oluşturulan sınırlı hız kayıtları yaklaşık 1 saat sonra geçersiz olur.

Hesap silindiğinde aktif veritabanındaki hesap, profil, finans kayıtları ve aktif oturumlar silinir. Hukuki bir saklama zorunluluğu bulunan kayıtlar zorunlu süre kadar; olağan yedeklerde kalan kopyalar ise yedekleme döngüsü tamamlanana kadar erişimi kısıtlı biçimde tutulabilir.

## 7. Veri güvenliği

Verilerin korunması için HTTPS, parola hashleme, süreli erişim tokenları, dönen yenileme tokenları, güvenli cihaz deposu ve erişim sınırlamaları gibi teknik ve idari önlemler kullanılır. Bununla birlikte hiçbir internet veya saklama yöntemi mutlak güvenlik garantisi vermez.

## 8. Kullanıcı tercihleri, dışa aktarma ve silme

Uygulamanın **Ayarlar** ekranından:

- Verilerinizin bir kopyasını dışa aktarabilir,
- Hesabınızı koruyarak tüm finansal verilerinizi silebilir,
- **Hesabımı sil** seçeneğiyle hesabınızı ve hesabınıza bağlı verileri silebilirsiniz.

Uygulamaya erişemiyorsanız kayıtlı hesap e-posta adresinizden **trinkow@gmail.com** adresine talep gönderebilirsiniz. Kimliğinizi ve hesap sahipliğini doğrulamak için ek bilgi istenebilir.

Bildirimleri uygulama ayarlarından veya cihazın işletim sistemi ayarlarından kapatabilirsiniz. Google hesabındaki Trinkow izinlerini Google hesap ayarlarından yönetebilirsiniz.

## 9. KVKK kapsamındaki haklar

KVKK’nın 11. maddesi kapsamında:

- Kişisel verilerinizin işlenip işlenmediğini öğrenme,
- İşlenmişse buna ilişkin bilgi talep etme,
- İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,
- Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,
- Eksik veya yanlış işlenmişse düzeltilmesini isteme,
- Kanuni şartları varsa silinmesini veya yok edilmesini isteme,
- Düzeltme ve silme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,
- Yalnız otomatik sistemlerle analiz sonucunda aleyhinize bir sonucun ortaya çıkmasına itiraz etme,
- Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde tazminat talep etme

haklarına sahipsiniz. Başvurularınızı **trinkow@gmail.com** adresine iletebilirsiniz.

## 10. Çocukların gizliliği

Trinkow çocuklara yönelik bir hizmet olarakta tasarlanmamıştır. Yaş küçüklüğü nedeniyle hukuken gerekli olduğu durumlarda veli veya vasinin gözetimi ve onayı aranır.

## 11. Politika değişiklikleri

Bu politika, hizmet veya mevzuattaki değişikliklere göre güncellenebilir. Önemli değişiklikler uygulamada veya uygun başka bir kanaldan duyurulur; yeni yürürlük tarihi bu sayfada belirtilir.

## 12. İletişim

Gizlilik, kişisel veriler ve hesap silme talepleri için:

**Triworkster**  
**E-posta:** trinkow@gmail.com
