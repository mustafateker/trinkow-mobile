import type { Dil } from '@/i18n/cekirdek';
import type { Belge, Bolum } from './kosullar';

const VERI_SORUMLUSU = 'Triworkster';
const ILETISIM = 'trinkow@gmail.com';
const REVENUECAT_GIZLILIK = 'https://www.revenuecat.com/privacy';

/* ------------------------------------------------------------- 1. TÜRKÇE */
const tr: Bolum[] = [
  {
    baslik: '1. Veri sorumlusu ve kapsam',
    paragraflar: [
      `Bu Gizlilik Politikası, veri sorumlusu ${VERI_SORUMLUSU} tarafından sunulan Trinkow mobil uygulamasında kişisel verilerin nasıl işlendiğini açıklar. Gizlilik ve kişisel veri talepleri için ${ILETISIM} adresine ulaşabilirsin.`,
      'Trinkow; kullanıcının kendi girdiği verilerle bütçe, harcama, borç, birikim, abonelik ve rutin takibi sağlayan bir kişisel finans planlama aracıdır. Banka hesabına bağlanmaz ve yatırım hizmeti sunmaz. İsteğe bağlı Trinkow Premium üyeliğinin ödemelerini Trinkow değil, Google Play veya App Store alır.',
    ],
  },
  {
    baslik: '2. İşlenen veriler',
    paragraflar: [
      'Hesap ve kimlik doğrulama verileri: e-posta adresi, hashlenmiş parola, Google ile giriş yapıldığında Google hesap kimliği (sub), doğrulanmış e-posta ve oturum kayıtları.',
      'Kullanıcının girdiği finans ve planlama verileri: gelir ve maaş günü, bütçe, sabit giderler, borçlar, tasarruf hedefleri ve hareketleri, harcama tutarı, kategori, ürün adı, not, tarih/saat, ödeme türü, taksitler, abonelikler, rutinler, favoriler, kategori limitleri ve harcamasız gün kayıtları.',
      'Tercih ve alışkanlık verileri: uygulama tercihleri, onboarding cevapları, bildirim tercihi ve zamanı ile kullanıcının isteğe bağlı olarak girdiği kahve, sigara, alkol, dışarıda yeme gibi rutinler.',
      'Güvenlik ve teknik veriler: oturum tokenları, parola sıfırlama ve kötüye kullanımı önleme kayıtları ile sunucu erişim kayıtlarında bulunabilecek IP adresi, istek zamanı ve temel cihaz/ağ bilgileri.',
      'Premium üyelik ve satın alma verileri: Trinkow Premium satın aldığında veya deneme başlattığında Trinkow hesap kimliğin; satın alınan ürün ve plan; satın alma, deneme, yenileme ve bitiş tarihleri; mağaza işlem kimliği; mağaza (Google Play veya App Store); fiyat, para birimi ve ülke bilgisi ile abonelik durumu. Kart ve ödeme bilgilerin Trinkow’a veya RevenueCat’e iletilmez; ödemeyi mağaza alır.',
      'Sesli harcama özelliğini seçtiğinde mikrofon yalnız konuşmanı cihazın iOS veya Android konuşma tanıma hizmetiyle metne dönüştürmek için kullanılır. Trinkow ham ses kaydını saklamaz veya kendi sunucularına göndermez. Cihazındaki konuşma tanıma hizmeti, işletim sistemi ve cihaz ayarlarına bağlı olarak sesi cihazda ya da kendi hizmet altyapısında işleyebilir.',
      'Trinkow banka/kredi kartı numarası, banka giriş bilgisi, kesin konum, rehber, kamera, ham mikrofon kaydı, fotoğraf veya reklam kimliği toplamaz.',
    ],
  },
  {
    baslik: '3. Verilerin toplanması ve saklanması',
    paragraflar: [
      'Veriler doğrudan uygulamada yaptığın girişlerden, hesap işlemlerinden ve Google ile giriş sırasında Google tarafından sağlanan kimlik bilgilerinden elektronik ortamda elde edilir.',
      'Sesli girişte oluşan metin cihazda harcama taslağına dönüştürülür. Yalnız sen alanları kontrol edip Kaydet dediğinde oluşan harcama alanları Trinkow backend hizmetine gönderilir.',
      'Finansal ve profil verileri Trinkow backend hizmetindeki PostgreSQL veritabanında tutulur; uygulama bu veriler için yerel SQLite veritabanı kullanmaz. “Beni hatırla” seçildiğinde oturum tokenları ve hesap e-postası iOS Keychain veya Android Keystore tabanlı güvenli cihaz deposunda saklanır. Seçilmediğinde oturum bilgileri uygulama belleğiyle sınırlıdır.',
      'Premium satın alma bilgileri, satın almayı yaptığın mağazadan uygulama içi satın alma altyapısı RevenueCat aracılığıyla elde edilir. Premium durumunun bir kopyası, erişimini doğrulamak için Trinkow backend veritabanında tutulur.',
    ],
  },
  {
    baslik: '4. İşleme amaçları ve hukuki sebepler',
    paragraflar: [
      'Veriler; hesap oluşturmak ve oturum açmak, bütçe ve tasarruf hesaplamalarını sunmak, kayıtlarını cihazların arasında erişilebilir kılmak, Premium satın almalarını doğrulamak, geri yüklemek ve Premium özelliklerine erişimi sağlamak, abonelik ve gelir durumunu toplu olarak izlemek, destek sağlamak, parola sıfırlamak, güvenliği ve hizmet sürekliliğini korumak ve yasal yükümlülükleri yerine getirmek amacıyla işlenir.',
      'KVKK kapsamındaki işleme; hizmet sözleşmesinin kurulması veya ifası, hukuki yükümlülüklerin yerine getirilmesi ve temel haklarını zedelememek kaydıyla meşru menfaat hukuki sebeplerine dayanır. Açık rıza gereken bir özellik eklenirse ayrıca açık rıza istenir ve rıza geri alınabilir.',
    ],
  },
  {
    baslik: '5. Paylaşım ve hizmet sağlayıcılar',
    paragraflar: [
      'Kişisel veriler satılmaz; reklam hedefleme veya üçüncü taraf pazarlama amacıyla paylaşılmaz.',
      'Hizmetin çalışması için gerekli ölçüde sunucu/barındırma sağlayıcısı, veritabanı altyapısı, parola sıfırlama e-postaları için e-posta iletim sağlayıcısı ve Google ile giriş seçildiğinde Google ile veri paylaşılabilir. Yasal bir zorunluluk doğarsa yetkili kamu kurumlarıyla da paylaşım yapılabilir.',
      `Premium satın almalarında ödemeyi Google Play veya Apple App Store alır. Satın almaları doğrulamak ve abonelik durumunu yönetmek için hesap kimliğin ve satın alma kayıtların, Trinkow adına hizmet veren uygulama içi satın alma altyapısı RevenueCat, Inc. ile paylaşılır (gizlilik politikası: ${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. Yurt dışına aktarım',
    paragraflar: [
      'Kullanılan bulut, e-posta, Google kimlik doğrulama ve RevenueCat (ABD) altyapısının sunucuları Türkiye dışında bulunabilir. Bu nedenle veriler, hizmetin sunulması için gerekli ve sınırlı olmak üzere yurt dışındaki hizmet sağlayıcılara aktarılabilir. Aktarım süreçlerinde yürürlükteki mevzuatın öngördüğü uygun güvencelerin sağlanması amaçlanır.',
    ],
  },
  {
    baslik: '7. Saklama süreleri',
    paragraflar: [
      'Hesap, profil ve finans kayıtları hesabın aktif olduğu süre boyunca veya sen silene kadar saklanır. Yenileme oturum kayıtları varsayılan olarak 30 gün sonra, parola sıfırlama bağlantıları 30 dakika sonra ve kötüye kullanım önleme amacıyla oluşturulan sınırlı hız kayıtları yaklaşık 1 saat sonra geçersiz olur. Premium üyelik ve satın alma kayıtları hesabın aktif olduğu sürece saklanır.',
      'Hesap silindiğinde aktif veritabanındaki hesap, profil, finans ve Premium üyelik kayıtları ile aktif oturumlar silinir; RevenueCat’teki müşteri kaydın ve satın alma geçmişin de silinir. Google Play ve App Store kendi ödeme kayıtlarını kendi politikalarına göre tutar. Hukuki bir saklama zorunluluğu bulunan kayıtlar zorunlu süre kadar; olağan yedeklerde kalan kopyalar ise yedekleme döngüsü tamamlanana kadar erişimi kısıtlı biçimde tutulabilir.',
    ],
  },
  {
    baslik: '8. Güvenlik',
    paragraflar: [
      'Verilerin korunması için HTTPS, parola hashleme, süreli erişim tokenları, dönen yenileme tokenları, güvenli cihaz deposu ve erişim sınırlamaları gibi teknik ve idari önlemler kullanılır. Bununla birlikte hiçbir internet veya saklama yöntemi mutlak güvenlik garantisi vermez.',
    ],
  },
  {
    baslik: '9. Tercihler, dışa aktarma ve silme',
    paragraflar: [
      'Ayarlar ekranından verilerinin bir kopyasını dışa aktarabilir, hesabı koruyarak tüm finansal verilerini silebilir veya “Hesabımı sil” seçeneğiyle hesabını ve hesabına bağlı verileri silebilirsin. Uygulamaya erişemiyorsan kayıtlı hesap e-posta adresinden trinkow@gmail.com adresine talep gönderebilirsin.',
      'Hesabını silmek Premium aboneliğini iptal etmez. Ücretlendirmenin sürmemesi için aboneliğini Google Play’de Ödemeler ve abonelikler bölümünden veya App Store’da Apple Hesabı ayarlarından iptal etmelisin. Aboneliğini aynı yerden istediğin zaman yönetebilirsin.',
      'Bildirimleri uygulama ayarlarından veya cihazın işletim sistemi ayarlarından kapatabilirsin. Google hesabındaki izinleri Google hesap ayarlarından yönetebilirsin.',
    ],
  },
  {
    baslik: '10. KVKK kapsamındaki hakların',
    paragraflar: [
      `KVKK’nın 11. maddesi kapsamında kişisel verilerinin işlenip işlenmediğini öğrenme; işlenmişse bilgi isteme; işleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme; yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme; eksik veya yanlış işlenmişse düzeltilmesini isteme; kanuni şartları varsa silinmesini veya yok edilmesini isteme; düzeltme ve silme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme; yalnız otomatik sistemlerle analiz sonucu aleyhine bir sonuca itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğrarsan tazminat talep etme haklarına sahipsin. Talebini ${ILETISIM} adresine iletebilirsin.`,
    ],
  },
  {
    baslik: '11. Çocukların gizliliği',
    paragraflar: [
      'Trinkow çocuklara yönelik bir hizmet olarak tasarlanmamıştır. Yaş küçüklüğü nedeniyle hukuken gerekli olduğu durumlarda veli veya vasinin gözetimi ve onayı aranır.',
    ],
  },
  {
    baslik: '12. Değişiklikler',
    paragraflar: [
      'Bu politika, hizmet veya mevzuattaki değişikliklere göre güncellenebilir. Önemli değişiklikler uygulamada veya uygun başka bir kanaldan duyurulur; yürürlük tarihi bu sayfada güncellenir.',
    ],
  },
];

/* ------------------------------------------------------------- 2. İNGİLİZCE */
const en: Bolum[] = [
  {
    baslik: '1. Data controller and scope',
    paragraflar: [
      `This Privacy Policy explains how personal data is processed in the Trinkow mobile app provided by ${VERI_SORUMLUSU}, the data controller. For privacy and personal data requests, contact ${ILETISIM}.`,
      'Trinkow is a personal financial planning tool that uses information you enter to track budgets, expenses, debt, savings, subscriptions, and routines. It does not connect to bank accounts or provide investment services. Payments for the optional Trinkow Premium membership are taken by Google Play or the App Store, not by Trinkow.',
    ],
  },
  {
    baslik: '2. Data we process',
    paragraflar: [
      'Account and authentication data: email address, hashed password, Google account identifier (sub) and verified email when you sign in with Google, and session records.',
      'Financial and planning data you enter: income and payday, budget, fixed expenses, debt, savings goals and activity, expense amount, category, item name, note, date/time, payment type, installments, subscriptions, routines, favorites, category limits, and no-spend-day records.',
      'Preference and habit data: app preferences, onboarding answers, notification preference and time, and optional routines you enter, such as coffee, smoking, alcohol, or eating out.',
      'Security and technical data: session tokens, password reset and abuse-prevention records, and server access logs that may include IP address, request time, and basic device/network information.',
      'Premium membership and purchase data: when you buy Trinkow Premium or start a trial, your Trinkow account ID; the product and plan purchased; purchase, trial, renewal, and expiration dates; the store transaction ID; the store (Google Play or the App Store); price, currency, and country; and subscription status. Your card and payment details are not sent to Trinkow or RevenueCat; the store takes the payment.',
      'When you choose voice expense entry, the microphone is used only to turn your speech into text through the iOS or Android speech-recognition service on your device. Trinkow does not store raw audio or send it to its own servers. Depending on your operating-system and device settings, the device speech-recognition service may process audio on-device or through its own service infrastructure.',
      'Trinkow does not collect bank or credit card numbers, bank login credentials, precise location, contacts, camera data, raw microphone recordings, photos, or advertising identifiers.',
    ],
  },
  {
    baslik: '3. Collection and storage',
    paragraflar: [
      'Data is collected electronically from information you enter in the app, account actions, and identity information Google provides when you choose Google sign-in.',
      'For voice entry, the recognized text is converted into an expense draft on the device. Expense fields are sent to Trinkow backend services only after you review them and tap Save.',
      'Financial and profile data is stored in the PostgreSQL database used by Trinkow backend services; the app does not use a local SQLite database for this data. If you select “Remember me,” session tokens and your account email are stored in the secure device storage backed by iOS Keychain or Android Keystore. Otherwise, session information remains in app memory.',
      'Premium purchase information is obtained from the store where you made the purchase through RevenueCat, the in-app purchase infrastructure Trinkow uses. A copy of your Premium status is kept in the Trinkow backend database to verify your access.',
    ],
  },
  {
    baslik: '4. Purposes and legal bases',
    paragraflar: [
      'Data is processed to create accounts and sign users in, provide budget and savings calculations, make records available across your devices, verify and restore Premium purchases and provide access to Premium features, monitor subscription and revenue status in aggregate, provide support, reset passwords, maintain security and service continuity, and meet legal obligations.',
      'Processing is based on establishing or performing a service contract, fulfilling legal obligations, and legitimate interests provided that your fundamental rights are not harmed. If a feature requires explicit consent, it will be requested separately and may be withdrawn.',
    ],
  },
  {
    baslik: '5. Sharing and service providers',
    paragraflar: [
      'Personal data is not sold or shared for ad targeting or third-party marketing.',
      'As needed to operate the service, data may be shared with server/hosting and database providers, an email delivery provider for password reset messages, and Google if you choose Google sign-in. Data may also be shared with competent public authorities when legally required.',
      `For Premium purchases, Google Play or the Apple App Store takes the payment. To verify purchases and manage subscription status, your account ID and purchase records are shared with RevenueCat, Inc., the in-app purchase infrastructure that works on Trinkow’s behalf (privacy policy: ${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. International transfers',
    paragraflar: [
      'Servers used by cloud, email, Google authentication, and RevenueCat (United States) providers may be located outside your home country. Data may therefore be transferred to service providers abroad to the limited extent necessary to provide the service with appropriate safeguards.',
    ],
  },
  {
    baslik: '7. Retention',
    paragraflar: [
      'Account, profile, and financial records are retained while your account is active or until you delete them. Refresh-session records expire by default after 30 days, password reset links after 30 minutes, and limited rate records created to prevent abuse after approximately one hour. Premium membership and purchase records are retained while your account is active.',
      'When an account is deleted, the account, profile, financial and Premium membership records, and active sessions are deleted from the active database, and your customer record and purchase history at RevenueCat are deleted as well. Google Play and the App Store keep their own payment records under their own policies. Records subject to a legal retention obligation may be kept for the required period; copies remaining in routine backups may be retained with access restricted until the backup cycle is complete.',
    ],
  },
  {
    baslik: '8. Security',
    paragraflar: [
      'Technical and organizational measures such as HTTPS, password hashing, time-limited access tokens, rotating refresh tokens, secure device storage, and access restrictions are used to protect data. However, no internet transmission or storage method can guarantee absolute security.',
    ],
  },
  {
    baslik: '9. Preferences, export, and deletion',
    paragraflar: [
      'In Settings, you can export a copy of your data, delete all financial data while keeping your account, or choose “Delete my account” to delete your account and its associated data. If you cannot access the app, you can send a request from your registered account email to trinkow@gmail.com.',
      'Deleting your account doesn’t cancel your Premium subscription. To stop being charged, cancel it in Google Play under Payments & subscriptions or in your Apple Account settings for the App Store. You can manage your subscription there at any time.',
      'You can turn off notifications in the app or your device settings. You can manage Google account permissions in your Google account settings.',
    ],
  },
  {
    baslik: '10. Your privacy rights',
    paragraflar: [
      `Under applicable data protection laws (such as GDPR or KVKK), you have the right to access, correct, delete, or export your personal data, restrict or object to certain processing, and lodge a complaint with a supervisory authority. Submit requests to ${ILETISIM}.`,
    ],
  },
  {
    baslik: '11. Children’s privacy',
    paragraflar: [
      'Trinkow is not designed for children. Where legally required because of a person’s age, the supervision and approval of a parent or guardian are required.',
    ],
  },
  {
    baslik: '12. Changes',
    paragraflar: [
      'This policy may be updated to reflect changes to the service or applicable law. Significant changes will be announced in the app or through another appropriate channel; the effective date will be updated on this page.',
    ],
  },
];

/* ------------------------------------------------------------- 3. ALMANCA */
const de: Bolum[] = [
  {
    baslik: '1. Verantwortlicher und Geltungsbereich',
    paragraflar: [
      `Diese Datenschutzerklärung erläutert, wie personenbezogene Daten in der Trinkow-App durch ${VERI_SORUMLUSU} als Verantwortlichen verarbeitet werden. Kontakt: ${ILETISIM}.`,
      'Trinkow ist ein persönliches Finanzplanungstool zur Erfassung von Budgets, Ausgaben und Ersparnissen. Trinkow verbindet sich nicht direkt mit Bankkonten und bietet keine Anlageberatung.',
    ],
  },
  {
    baslik: '2. Verarbeitete Daten',
    paragraflar: [
      'Konto- und Anmeldedaten (E-Mail, gehashtes Passwort, Google-ID bei Google-Login).',
      'Vom Nutzer eingegebene Finanzdaten: Einnahmen, Ausgaben, Raten, Abonnements, Schulden und Sparziele.',
      'Nutzungspräferenzen und App-Einstellungen.',
      'Kauf- und Abonnementdaten bei Abschluss von Trinkow Premium (verwaltet über RevenueCat und die App-Stores).',
      'Trinkow erfasst keine Bankkartennummern, Kameraaufnahmen oder Werbe-IDs.',
    ],
  },
  {
    baslik: '3. Erhebung und Speicherung',
    paragraflar: [
      'Daten werden über deine Eingaben in der App elektronisch erhoben und in einer sicheren PostgreSQL-Datenbank gespeichert.',
      'Zugangstoken werden bei aktivierter Option „Angemeldet bleiben“ im sicheren Schlüsselspeicher deines Geräts (iOS Keychain / Android Keystore) verwahrt.',
    ],
  },
  {
    baslik: '4. Zwecke und Rechtsgrundlagen',
    paragraflar: [
      'Die Verarbeitung erfolgt zur Vertragserfüllung (Bereitstellung des Dienstes), Wahrung berechtigter Interessen und Erfüllung gesetzlicher Vorgaben gemäß DSGVO.',
    ],
  },
  {
    baslik: '5. Datenweitergabe und Drittanbieter',
    paragraflar: [
      'Personenbezogene Daten werden weder verkauft noch für Werbezwecke weitergegeben.',
      `Zur Abwicklung von In-App-Käufen werden Daten über RevenueCat, Inc. verarbeitet (${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. Internationale Übermittlung',
    paragraflar: [
      'Dienstleister können Server außerhalb deines Wohnsitzlandes betreiben. Datenübertragungen erfolgen unter Einhaltung angemessener Datenschutzgarantien.',
    ],
  },
  {
    baslik: '7. Speicherdauer',
    paragraflar: [
      'Daten werden gespeichert, solange dein Konto aktiv ist. Bei Kontolöschung werden deine Daten aus der Datenbank entfernt.',
    ],
  },
  {
    baslik: '8. Datensicherheit',
    paragraflar: [
      'Wir setzen moderne Verschlüsselungsmethoden (HTTPS, Passwort-Hashing) und organisatorische Sicherheitsmaßnahmen ein.',
    ],
  },
  {
    baslik: '9. Einstellungen, Export und Kontolöschung',
    paragraflar: [
      'In den Einstellungen kannst du deine Daten exportieren oder dein Konto löschen. Beachte: Ein Store-Abonnement muss im Store gekündigt werden.',
    ],
  },
  {
    baslik: '10. Deine Rechte',
    paragraflar: [
      `Nach der DSGVO hast du das Recht auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit. Anfragen bitte an ${ILETISIM}.`,
    ],
  },
  {
    baslik: '11. Schutz von Minderjährigen',
    paragraflar: [
      'Trinkow richtet sich nicht an Kinder unter dem gesetzlichen Mindestalter.',
    ],
  },
  {
    baslik: '12. Änderungen',
    paragraflar: [
      'Aktualisierungen dieser Erklärung werden mit neuem Datum in der App veröffentlicht.',
    ],
  },
];

/* ------------------------------------------------------------- 4. FRANSIZCA */
const fr: Bolum[] = [
  {
    baslik: '1. Responsable du traitement et champ d’application',
    paragraflar: [
      `Cette Politique de confidentialité décrit le traitement de vos données par ${VERI_SORUMLUSU} pour l'application Trinkow. Contact : ${ILETISIM}.`,
      'Trinkow est un outil de suivi budgétaire personnel sans connexion bancaire directe ni service d’investissement.',
    ],
  },
  {
    baslik: '2. Données traitées',
    paragraflar: [
      'Données de compte (e-mail, mot de passe haché, identifiant Google).',
      'Données financières saisies : revenus, dépenses, dettes, abonnements et objectifs d’épargne.',
      'Données d’abonnement Premium traitées via RevenueCat et les magasins d’applications.',
      'Trinkow ne collecte aucun numéro de carte bancaire, contact ou identifiant publicitaire.',
    ],
  },
  {
    baslik: '3. Collecte et conservation',
    paragraflar: [
      'Les données sont stockées sur une base de données sécurisée PostgreSQL et dans le trousseau sécurisé de votre appareil.',
    ],
  },
  {
    baslik: '4. Finalités et bases légales',
    paragraflar: [
      'Les traitements reposent sur l’exécution du contrat d’utilisation et le respect des obligations légales (RGPD).',
    ],
  },
  {
    baslik: '5. Partage et sous-traitants',
    paragraflar: [
      `Vos données ne sont jamais vendues. La gestion des abonnements utilise l’infrastructure RevenueCat (${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. Transferts internationaux',
    paragraflar: [
      'Les transferts éventuels de données hors de votre pays s’effectuent avec les garanties de protection appropriées.',
    ],
  },
  {
    baslik: '7. Durée de conservation',
    paragraflar: [
      'Les données sont conservées pendant la durée d’activité de votre compte et supprimées lors de sa clôture.',
    ],
  },
  {
    baslik: '8. Sécurité',
    paragraflar: [
      'Nous appliquons des mesures techniques rigoureuses (HTTPS, hachage des mots de passe, jetons sécurisés).',
    ],
  },
  {
    baslik: '9. Préférences et suppression',
    paragraflar: [
      'Vous pouvez exporter vos données ou supprimer votre compte dans les Paramètres. Résiliez l’abonnement sur l’App Store / Google Play séparément.',
    ],
  },
  {
    baslik: '10. Vos droits',
    paragraflar: [
      `Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données via ${ILETISIM}.`,
    ],
  },
  {
    baslik: '11. Mineurs',
    paragraflar: [
      'L’application n’est pas destinée aux mineurs sans accord parental.',
    ],
  },
  {
    baslik: '12. Modifications',
    paragraflar: [
      'Toute modification sera communiquée via l’application avec la date de mise à jour.',
    ],
  },
];

/* ------------------------------------------------------------- 5. İSPANYOLCA */
const es: Bolum[] = [
  {
    baslik: '1. Responsable del tratamiento y alcance',
    paragraflar: [
      `Esta Política explica el tratamiento de datos personales en Trinkow por parte de ${VERI_SORUMLUSU}. Contacto: ${ILETISIM}.`,
      'Trinkow es una herramienta personal de gestión de gastos que no se conecta directamente a cuentas bancarias.',
    ],
  },
  {
    baslik: '2. Datos que tratamos',
    paragraflar: [
      'Datos de cuenta (correo, contraseña encriptada, cuenta de Google).',
      'Registros financieros introducidos: ingresos, gastos, ahorros y suscripciones.',
      'Datos de compra Premium a través de RevenueCat y tiendas oficiales.',
      'No recopilamos números de tarjeta de crédito, contactos ni identificadores de publicidad.',
    ],
  },
  {
    baslik: '3. Recopilación y almacenamiento',
    paragraflar: [
      'Los datos se almacenan de forma segura en PostgreSQL y en el almacenamiento cifrado de tu dispositivo móvil.',
    ],
  },
  {
    baslik: '4. Fines y bases legales',
    paragraflar: [
      'El tratamiento se fundamenta en la ejecución del servicio y el cumplimiento legal conforme al RGPD.',
    ],
  },
  {
    baslik: '5. Destinatarios y proveedores',
    paragraflar: [
      `No vendemos datos personales. Las suscripciones Premium se verifican mediante RevenueCat (${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. Transferencias internacionales',
    paragraflar: [
      'Las transferencias internacionales de datos se realizan bajo salvaguardas legales adecuadas.',
    ],
  },
  {
    baslik: '7. Conservación',
    paragraflar: [
      'Los datos se conservan mientras la cuenta permanezca activa.',
    ],
  },
  {
    baslik: '8. Seguridad',
    paragraflar: [
      'Implementamos protocolos HTTPS, hash de contraseñas y control de accesos.',
    ],
  },
  {
    baslik: '9. Preferencias y eliminación',
    paragraflar: [
      'Puedes exportar o eliminar tu cuenta desde Ajustes. Recuerda cancelar tu suscripción en la tienda.',
    ],
  },
  {
    baslik: '10. Sus derechos',
    paragraflar: [
      `Bajo el RGPD tienes derecho de acceso, rectificación y supresión. Escríbenos a ${ILETISIM}.`,
    ],
  },
  {
    baslik: '11. Menores',
    paragraflar: [
      'Trinkow no está dirigida a niños sin autorización de tutores legales.',
    ],
  },
  {
    baslik: '12. Modificaciones',
    paragraflar: [
      'Las actualizaciones se publican en esta sección con su fecha de vigencia.',
    ],
  },
];

/* ------------------------------------------------------------- 6. İTALYANCA */
const it: Bolum[] = [
  {
    baslik: '1. Titolare del trattamento e ambito',
    paragraflar: [
      `La presente Informativa descrive il trattamento dei dati personali su Trinkow da parte di ${VERI_SORUMLUSU}. Contatto: ${ILETISIM}.`,
      'Trinkow è un’applicazione di pianificazione finanziaria personale priva di connessione bancaria diretta.',
    ],
  },
  {
    baslik: '2. Dati trattati',
    paragraflar: [
      'Dati dell’account (e-mail, password cifrata, identificativo Google).',
      'Dati finanziari inseriti dall’utente (spese, entrate, scadenze, abbonamenti).',
      'Dati di acquisto Premium elaborati tramite RevenueCat e app store.',
      'Trinkow non raccoglie coordinate bancarie, rubrica né dati di geolocalizzazione precisa.',
    ],
  },
  {
    baslik: '3. Raccolta e conservazione',
    paragraflar: [
      'I dati vengono memorizzati sul database PostgreSQL e nel portachiavi sicuro del dispositivo.',
    ],
  },
  {
    baslik: '4. Finalità e basi giuridiche',
    paragraflar: [
      'Il trattamento avviene per l’esecuzione del contratto d’uso e obblighi di legge (GDPR).',
    ],
  },
  {
    baslik: '5. Fornitori e condivisione',
    paragraflar: [
      `Non vendiamo i dati. Gli abbonamenti sono gestiti tramite RevenueCat (${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. Trasferimenti internazionali',
    paragraflar: [
      'I trasferimenti transfrontalieri di dati avvengono nel rispetto di garanzie adeguate.',
    ],
  },
  {
    baslik: '7. Conservazione',
    paragraflar: [
      'I dati sono conservati fino alla cancellazione dell’account da parte dell’utente.',
    ],
  },
  {
    baslik: '8. Sicurezza',
    paragraflar: [
      'Adottiamo crittografia HTTPS, hashing e meccanismi di protezione dell’accesso.',
    ],
  },
  {
    baslik: '9. Preferenze e cancellazione',
    paragraflar: [
      'Puoi esportare i dati o eliminare l’account nelle Impostazioni.',
    ],
  },
  {
    baslik: '10. Diritti dell’utente',
    paragraflar: [
      `Ai sensi del GDPR hai diritto di accesso, rettifica e cancellazione. Contatto: ${ILETISIM}.`,
    ],
  },
  {
    baslik: '11. Minori',
    paragraflar: [
      'L’app non è destinata a minori senza consenso genitoriale.',
    ],
  },
  {
    baslik: '12. Modifiche',
    paragraflar: [
      'Eventuali modifiche saranno pubblicate in questa pagina.',
    ],
  },
];

/* ------------------------------------------------------------- 7. PORTEKİZCE */
const pt: Bolum[] = [
  {
    baslik: '1. Responsável pelo tratamento e âmbito',
    paragraflar: [
      `Esta Política explica como a ${VERI_SORUMLUSU} trata os dados pessoais na Trinkow. Contacto: ${ILETISIM}.`,
      'A Trinkow é uma aplicação de planeamento financeiro pessoal sem ligação bancária direta.',
    ],
  },
  {
    baslik: '2. Dados tratados',
    paragraflar: [
      'Dados de conta (e-mail, palavra-passe em hash, conta Google).',
      'Registos financeiros: receitas, despesas, dívidas, objetivos e subscrições.',
      'Dados de compra Premium através da RevenueCat e lojas de aplicações.',
      'Não recolhemos números de cartão bancário, contactos ou identificadores de publicidade.',
    ],
  },
  {
    baslik: '3. Recolha e armazenamento',
    paragraflar: [
      'Os dados são guardados de forma segura em base de dados PostgreSQL e no armazenamento seguro do dispositivo.',
    ],
  },
  {
    baslik: '4. Finalidades e fundamentos',
    paragraflar: [
      'O tratamento tem como base a execução contratual do serviço e obrigações legais (RGPD).',
    ],
  },
  {
    baslik: '5. Partilha com terceiros',
    paragraflar: [
      `Não comercializamos dados pessoais. As subscrições utilizam o serviço da RevenueCat (${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. Transferências internacionais',
    paragraflar: [
      'Transferências de dados para o exterior obedecem a garantias legais apropriadas.',
    ],
  },
  {
    baslik: '7. Conservação',
    paragraflar: [
      'Os dados são mantidos enquanto a conta estiver ativa.',
    ],
  },
  {
    baslik: '8. Segurança',
    paragraflar: [
      'Utilizamos encriptação HTTPS, hashing seguro e controlo de acessos.',
    ],
  },
  {
    baslik: '9. Eliminação e preferências',
    paragraflar: [
      'Podes exportar dados ou eliminar a conta nas Definições. Cancela também a subscrição na loja.',
    ],
  },
  {
    baslik: '10. Os teus direitos',
    paragraflar: [
      `Tens direito de acesso, retificação e eliminação de dados pessoais. Contacta ${ILETISIM}.`,
    ],
  },
  {
    baslik: '11. Menores',
    paragraflar: [
      'A aplicação não se destina a menores sem consentimento dos pais.',
    ],
  },
  {
    baslik: '12. Alterações',
    paragraflar: [
      'Alterações a esta política entram em vigor com a sua publicação na app.',
    ],
  },
];

/* ------------------------------------------------------------- 8. ROMENCE */
const ro: Bolum[] = [
  {
    baslik: '1. Operatorul de date și domeniul de aplicare',
    paragraflar: [
      `Această Politică explică prelucrarea datelor în Trinkow de către ${VERI_SORUMLUSU}. Contact: ${ILETISIM}.`,
      'Trinkow este un instrument de evidență financiară personală fără conectare bancară directă.',
    ],
  },
  {
    baslik: '2. Date prelucrate',
    paragraflar: [
      'Date de cont (e-mail, parolă hash, identificator Google).',
      'Date financiare introduse: venituri, cheltuieli, bugete, economii și abonamente.',
      'Date de tranzacție Premium prin RevenueCat și magazinele oficiale.',
      'Nu colectăm numere de card, contacte sau identificatori de publicitate.',
    ],
  },
  {
    baslik: '3. Colectare și stocare',
    paragraflar: [
      'Datele sunt stocate în mod securizat în baza de date PostgreSQL și în depozitul securizat al dispozitivului.',
    ],
  },
  {
    baslik: '4. Scopuri și temeiuri juridice',
    paragraflar: [
      'Prelucrarea se bazează pe executarea contractului de furnizare a serviciului (GDPR).',
    ],
  },
  {
    baslik: '5. Partajare și furnizori',
    paragraflar: [
      `Nu vindem date personale. Gestionarea abonamentelor se realizează prin RevenueCat (${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. Transferuri internaționale',
    paragraflar: [
      'Transferurile internaționale de date se realizează cu garanții adecvate de securitate.',
    ],
  },
  {
    baslik: '7. Păstrarea datelor',
    paragraflar: [
      'Datele sunt păstrate pe durata activității contului dumneavoastră.',
    ],
  },
  {
    baslik: '8. Securitate',
    paragraflar: [
      'Folosim criptare HTTPS, hashing de parole și mecanisme stricte de autentificare.',
    ],
  },
  {
    baslik: '9. Preferințe și ștergere',
    paragraflar: [
      'Puteți exporta datele sau șterge contul din Setări.',
    ],
  },
  {
    baslik: '10. Drepturile dumneavoastră',
    paragraflar: [
      `Conform GDPR aveți dreptul la acces, rectificare și ștergere prin ${ILETISIM}.`,
    ],
  },
  {
    baslik: '11. Minori',
    paragraflar: [
      'Trinkow nu este destinat minorilor fără acordul reprezentanților legali.',
    ],
  },
  {
    baslik: '12. Modificări',
    paragraflar: [
      'Orice modificare intră în vigoare la data publicării în aplicație.',
    ],
  },
];

/* ------------------------------------------------------------- 9. LEHÇE */
const pl: Bolum[] = [
  {
    baslik: '1. Administrator danych i zakres',
    paragraflar: [
      `Niniejsza Polityka wyjaśnia zasady przetwarzania danych w Trinkow przez ${VERI_SORUMLUSU}. Kontakt: ${ILETISIM}.`,
      'Trinkow to narzędzie budżetowe bez bezpośredniej integracji z rachunkami bankowymi.',
    ],
  },
  {
    baslik: '2. Przetwarzane dane',
    paragraflar: [
      'Dane konta (adres e-mail, zahashowane hasło, identyfikator logowania Google).',
      'Wprowadzane dane finansowe: przychody, wydatki, długi, subskrypcje i cele oszczędnościowe.',
      'Informacje o zakupach subskrypcji Premium obsługiwane przez RevenueCat i sklepy z aplikacjami.',
      'Nie gromadzimy numerów kart płatniczych, kontaktów ani identyfikatorów reklamowych.',
    ],
  },
  {
    baslik: '3. Zbieranie i przechowywanie',
    paragraflar: [
      'Dane są bezpiecznie zapisywane w bazie danych PostgreSQL oraz w bezpiecznym magazynie urządzenia.',
    ],
  },
  {
    baslik: '4. Cele i podstawy prawne',
    paragraflar: [
      'Przetwarzanie opiera się na wykonaniu umowy świadczenia usług oraz przepisach RODO.',
    ],
  },
  {
    baslik: '5. Odbiorcy danych',
    paragraflar: [
      `Nie sprzedajemy danych użytkowników. Obsługa subskrypcji odbywa się za pośrednictwem RevenueCat (${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. Przekazywanie międzynarodowe',
    paragraflar: [
      'Ewentualny transfer danych poza EOG realizowany jest z zachowaniem odpowiednich zabezpieczeń prawnych.',
    ],
  },
  {
    baslik: '7. Okres przechowywania',
    paragraflar: [
      'Dane są przechowywane przez okres aktywności konta użytkownika.',
    ],
  },
  {
    baslik: '8. Bezpieczeństwo',
    paragraflar: [
      'Stosujemy protokoły HTTPS, hashowanie haseł i autoryzację tokenami.',
    ],
  },
  {
    baslik: '9. Eksport i usuwanie danych',
    paragraflar: [
      'Możesz wyeksportować dane lub usunąć konto w Ustawieniach. Pamiętaj o anulowaniu subskrypcji w sklepie.',
    ],
  },
  {
    baslik: '10. Prawa użytkownika',
    paragraflar: [
      `Na mocy RODO przysługuje Ci prawo dostępu, sprostowania i usunięcia danych pod adresem ${ILETISIM}.`,
    ],
  },
  {
    baslik: '11. Prywatność dzieci',
    paragraflar: [
      'Aplikacja nie jest przeznaczona dla dzieci bez zgody opiekunów prawnych.',
    ],
  },
  {
    baslik: '12. Zmiany',
    paragraflar: [
      'Aktualizacje polityki wchodzą w życie z dniem ich opublikowania w aplikacji.',
    ],
  },
];

/* ------------------------------------------------------------- 10. RUSÇA */
const ru: Bolum[] = [
  {
    baslik: '1. Оператор данных и сфера действия',
    paragraflar: [
      `Настоящая Политика описывает обработку персональных данных в Trinkow компанией ${VERI_SORUMLUSU}. Контакт: ${ILETISIM}.`,
      'Trinkow — сервис учёта личных финансов, не подключающийся к банковским счетам.',
    ],
  },
  {
    baslik: '2. Обрабатываемые данные',
    paragraflar: [
      'Данные учётной записи (email, хэшированный пароль, идентификатор Google).',
      'Финансовые записи: доходы, расходы, задолженности, подписки и цели накоплений.',
      'Данные о покупке Premium-подписки через RevenueCat и магазины приложений.',
      'Мы не собираем номера банковских карт, контакты и рекламные идентификаторы.',
    ],
  },
  {
    baslik: '3. Сбор и хранение',
    paragraflar: [
      'Данные безопасно хранятся в базе данных PostgreSQL и в защищённом хранилище мобильного устройства.',
    ],
  },
  {
    baslik: '4. Цели и правовые основания',
    paragraflar: [
      'Обработка осуществляется для исполнения пользовательского соглашения и требований законодательства.',
    ],
  },
  {
    baslik: '5. Передача данных',
    paragraflar: [
      `Мы не продаём персональные данные. Управление покупками осуществляется через RevenueCat (${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. Трансграничная передача',
    paragraflar: [
      'Передача данных поставщикам инфраструктуры осуществляется с соблюдением стандартов защиты.',
    ],
  },
  {
    baslik: '7. Сроки хранения',
    paragraflar: [
      'Данные хранятся до тех пор, пока аккаунт активен, и удаляются при удалении аккаунта.',
    ],
  },
  {
    baslik: '8. Безопасность',
    paragraflar: [
      'Используются протоколы шифрования HTTPS, хэширование паролей и защищённые токены.',
    ],
  },
  {
    baslik: '9. Настройки и удаление',
    paragraflar: [
      'В Настройках можно экспортировать данные или удалить аккаунт.',
    ],
  },
  {
    baslik: '10. Ваши права',
    paragraflar: [
      `Вы имеете право на доступ, изменение и удаление своих персональных данных через ${ILETISIM}.`,
    ],
  },
  {
    baslik: '11. Несовершеннолетние',
    paragraflar: [
      'Приложение не предназначено для детей без разрешения родителей.',
    ],
  },
  {
    baslik: '12. Изменения',
    paragraflar: [
      'Изменения вступают в силу с момента их публикации в приложении.',
    ],
  },
];

/* ------------------------------------------------------------- 11. ÇEKÇE */
const cs: Bolum[] = [
  {
    baslik: '1. Správce údajů a rozsah',
    paragraflar: [
      `Tyto Zásady vysvětlují zpracování osobních údajů v aplikaci Trinkow správcem ${VERI_SORUMLUSU}. Kontakt: ${ILETISIM}.`,
      'Trinkow je nástroj pro osobní rozpočet bez přímého napojení na bankovní účty.',
    ],
  },
  {
    baslik: '2. Zpracovávané údaje',
    paragraflar: [
      'Údaje účtu (e-mail, hashované heslo, Google ID).',
      'Zadané finanční záznamy: příjmy, výdaje, dluhy, předplatná a úspory.',
      'Informace o předplatném Premium zpracovávané přes RevenueCat a aplikační obchody.',
      'Neshromažďujeme čísla platebních karet, kontakty ani reklamní identifikátory.',
    ],
  },
  {
    baslik: '3. Shromažďování a ukládání',
    paragraflar: [
      'Data jsou bezpečně uložena v databázi PostgreSQL a v zabezpečeném úložišti zařízení.',
    ],
  },
  {
    baslik: '4. Účely a právní základy',
    paragraflar: [
      'Zpracování vychází z plnění smlouvy o poskytování služby a nařízení GDPR.',
    ],
  },
  {
    baslik: '5. Sdílení a partneři',
    paragraflar: [
      `Osobní údaje neprodáváme. Správa předplatného využívá RevenueCat (${REVENUECAT_GIZLILIK}).`,
    ],
  },
  {
    baslik: '6. Mezinárodní předávání',
    paragraflar: [
      'Předávání údajů partnerům probíhá v souladu s odpovídajícími zárukami ochrany.',
    ],
  },
  {
    baslik: '7. Doba uchovávání',
    paragraflar: [
      'Údaje jsou uchovávány po dobu aktivity vašeho účtu.',
    ],
  },
  {
    baslik: '8. Zabezpečení',
    paragraflar: [
      'Využíváme šifrování HTTPS, hashování hesel a řízený přístup k datům.',
    ],
  },
  {
    baslik: '9. Předvolby a výmaz',
    paragraflar: [
      'V Nastavení můžete data exportovat nebo účet smazat. Předplatné zrušte v obchodě s aplikacemi.',
    ],
  },
  {
    baslik: '10. Vaše práva',
    paragraflar: [
      `Dle GDPR máte právo na přístup, opravu a výmaz osobních údajů na ${ILETISIM}.`,
    ],
  },
  {
    baslik: '11. Ochrana dětí',
    paragraflar: [
      'Aplikace není určena dětem bez souhlasu zákonných zástupců.',
    ],
  },
  {
    baslik: '12. Změny',
    paragraflar: [
      'Změny nabývají účinnosti okamžikem zveřejnění v aplikaci.',
    ],
  },
];

export const gizlilikDiller: Record<Dil, Belge> = {
  tr: { baslik: 'Gizlilik politikası', bilgi: 'Yürürlük tarihi: 28 Ekim 2026 • Sürüm 1.1', bolumler: tr },
  en: { baslik: 'Privacy Policy', bilgi: 'Effective date: October 28, 2026 • Version 1.1', bolumler: en },
  de: { baslik: 'Datenschutzerklärung', bilgi: 'Gültig ab: 28. Oktober 2026 • Version 1.1', bolumler: de },
  fr: { baslik: 'Politique de confidentialité', bilgi: "Date d'effet : 28 octobre 2026 • Version 1.1", bolumler: fr },
  es: { baslik: 'Política de privacidad', bilgi: 'Fecha de vigencia: 28 de octubre de 2026 • Versión 1.1', bolumler: es },
  it: { baslik: 'Informativa sulla privacy', bilgi: 'Data di efficacia: 28 ottobre 2026 • Versione 1.1', bolumler: it },
  pt: { baslik: 'Política de Privacidade', bilgi: 'Data de vigência: 28 de outubro de 2026 • Versão 1.1', bolumler: pt },
  ro: { baslik: 'Politică de confidențialitate', bilgi: 'Data intrării în vigoare: 28 octombrie 2026 • Versiunea 1.1', bolumler: ro },
  pl: { baslik: 'Polityka prywatności', bilgi: 'Data wejścia w życie: 28 października 2026 • Wersja 1.1', bolumler: pl },
  ru: { baslik: 'Политика конфиденциальности', bilgi: 'Дата вступления в силу: 28 октября 2026 г. • Версия 1.1', bolumler: ru },
  cs: { baslik: 'Zásady ochrany soukromí', bilgi: 'Datum účinnosti: 28. října 2026 • Verze 1.1', bolumler: cs },
};

