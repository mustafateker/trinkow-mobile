import type { Dil } from '@/i18n/cekirdek';

export type Bolum = {
  baslik: string;
  paragraflar: string[];
};

export type Belge = {
  baslik: string;
  bilgi: string;
  taslak?: boolean;
  bolumler: Bolum[];
};

const VERI_SORUMLUSU = 'Triworkster';
const ILETISIM = 'trinkow@gmail.com';

/* ------------------------------------------------------------- 1. TÜRKÇE */
const tr: Bolum[] = [
  {
    baslik: '1. Taraflar, kapsam ve kabul',
    paragraflar: [
      `Bu Kullanım Şartları, ${VERI_SORUMLUSU} ("Trinkow", "biz") tarafından sunulan Trinkow mobil uygulamasının ve ilişkili tüm dijital servislerin kullanım koşullarını belirler.`,
      'Trinkow uygulamasını indirerek, bir hesap oluşturarak veya uygulamayı kullanarak bu Kullanım Şartları’nı ve Gizlilik Politikası’nı kabul etmiş sayılırsın. Şartları kabul etmiyorsan uygulamayı kullanmamalısın.',
      `Her türlü soru, geri bildirim ve hukuki iletişim için ${ILETISIM} adresinden bizimle iletişime geçebilirsin.`,
    ],
  },
  {
    baslik: '2. Hizmetin niteliği ve finansal sorumluluk reddi',
    paragraflar: [
      'Trinkow; gelir, harcama, taksit, borç, birikim, abonelik ve rutin kayıtlarını düzenleyip bütçe ve tasarruf hedeflerini takip etmeni sağlayan kişisel bir finans ve bütçe planlama aracıdır.',
      'Yatırım veya finansal danışmanlık değildir: Trinkow bir banka, aracı kurum, ödeme kuruluşu veya yatırım danışmanı değildir. Uygulama içerisindeki grafikler, istatistikler, bütçe öngörüleri ve hesaplamalar yalnızca kişisel takip ve bilgilendirme amaçlıdır; yatırım, vergi, yasal veya profesyonel finansal tavsiye niteliği taşımaz.',
      'Banka entegrasyonu ve fon transferi yoktur: Trinkow doğrudan banka hesaplarına bağlanmaz, banka bakiyesi sorgulamaz ve kullanıcı adına herhangi bir para transferi veya ödeme gerçekleştirmez.',
    ],
  },
  {
    baslik: '3. Hesap oluşturma, güvenlik ve kullanım kuralları',
    paragraflar: [
      'Uygulamadan tam anlamıyla yararlanabilmek için e-posta adresiyle veya desteklenen üçüncü taraf oturum açma yöntemleriyle (ör. Google ile Giriş) bir hesap oluşturulmalıdır.',
      'Hesap güvenliği: Oturum açma bilgilerinin ve mobil cihazının güvenliğini sağlamak kullanıcının sorumluluğundadır. Hesabında yetkisiz bir işlem fark edersen vakit kaybetmeden bize bildirmelisin.',
      'Veri doğruluğu: Uygulamaya girilen verilerin doğruluğu ve güncelliği tamamen kullanıcının sorumluluğundadır. Trinkow, hatalı veya eksik girilen verilerden kaynaklanan hesaplama sapmalarından sorumlu tutulamaz.',
      'Kabul edilebilir kullanım: Uygulamayı tersine mühendisliğe tabi tutmamayı, kaynak kodunu deşifre etmemeyi, güvenlik mekanizmalarını aşmamayı, sunucuları aşırı yükleyecek otomatik sorgular (bot, scraper vb.) göndermemeyi ve yasalara aykırı amaçlarla kullanmamayı kabul edersin.',
    ],
  },
  {
    baslik: '4. Trinkow Premium, abonelik ve ödeme şartları',
    paragraflar: [
      'Trinkow Premium; gelişmiş harcama analizleri, detaylı tasarruf takibi, bütçe araçları ve reklamsız deneyim gibi ek yetenekler sunan isteğe bağlı bir ücretli abonelik modelidir.',
      'Mağaza üzerinden ödeme: Premium abonelik ödemeleri doğrudan Apple App Store veya Google Play Store altyapısı üzerinden tahsil edilir. Kredi kartı ve ödeme bilgileriniz Trinkow tarafından tutulmaz ya da işlenmez.',
      'Ücretsiz deneme süresi: Premium için bir deneme süresi tanımlanmışsa (örneğin 7 gün), bu süre boyunca ücret tahakkuk etmez. Deneme süresi sona ermeden en az 24 saat önce mağaza ayarlarından iptal edilmediği sürece abonelik, seçilen dönem üzerinden otomatik olarak ücretlendirilir.',
      'Otomatik yenileme: Abonelikler, dönem bitiminden en az 24 saat önce ilgili uygulama mağazasının hesap ayarlarından kapatılmadığı sürece aylık veya yıllık olarak otomatik yenilenir.',
      'İptal ve iade politikası: Aboneliğini dilediğin zaman Google Play (Ödemeler ve Abonelikler) veya App Store (Abonelikler) ayarlarından iptal edebilirsin. İptal işlemi cari fatura döneminin sonuna kadar geçerliliğini korur; dönem ortasında kullanılmayan süre için Trinkow tarafından para iadesi yapılmaz. İade talepleri satın alma yapılan mağazanın (Apple / Google) tüketici kurallarına tabidir.',
    ],
  },
  {
    baslik: '5. Fikri mülkiyet hakları',
    paragraflar: [
      'Trinkow uygulaması; tasarımı, kullanıcı arayüzü, logoları, grafikleri, metinleri, kaynak kodları ve veritabanı mimarisiyle birlikte telif hakları ve fikri mülkiyet mevzuatı koruması altındadır ve Triworkster’a aittir.',
      'Bu Şartlar, sana uygulamayı kişisel ve ticari olmayan amaçlarla kullanabilmen için sınırlı, devredilemez ve münhasır olmayan bir lisans verir. Önceden yazılı izin alınmaksızın uygulamanın herhangi bir parçasının kopyalanması, çoğaltılması veya dağıtılması yasaktır.',
    ],
  },
  {
    baslik: '6. Veri gizliliği ve korunması',
    paragraflar: [
      'Kişisel verilerinizin nasıl işlendiği, saklandığı ve korunduğu Gizlilik Politikası’nda ayrıntılı olarak açıklanmıştır. Gizlilik Politikası, bu Kullanım Şartları’nın ayrılmaz bir parçasını teşkil eder.',
    ],
  },
  {
    baslik: '7. Hesabın sonlandırılması ve veri silme',
    paragraflar: [
      'Hesabını dilediğin an uygulamanın Ayarlar ekranındaki "Hesabımı Sil" seçeneğiyle silebilirsin. Hesabın silindiğinde veritabanındaki kayıtların ve ilişkilendirilmiş verilerin kalıcı olarak silinir.',
      'Önemli uyarı: Hesabını silmek, Google Play veya App Store üzerinden başlatılmış olan Premium aboneliğini otomatik olarak sonlandırmaz. Ücretlendirilmeye devam etmemek için aboneliğini mağaza ayarlarından ayrıca iptal etmen gerekir.',
      'Trinkow; bu Şartlar’ın, yürürlükteki mevzuatın veya üçüncü taraf haklarının ihlali durumunda kullanıcının hesabını önceden bildirimde bulunarak veya zorunlu hâllerde derhal askıya alma ya da sonlandırma hakkını saklı tutar.',
    ],
  },
  {
    baslik: '8. Sorumluluğun sınırlandırılması ve hizmet garantisi',
    paragraflar: [
      'Trinkow uygulaması "olduğu gibi" ve "mevcut olduğu ölçüde" sunulmaktadır. Hizmetin kesintisiz, sıfır hatalı veya her an erişilebilir olacağına dair zımni veya açık bir garanti verilmez.',
      'Trinkow; planlanan bütçe veya tasarruf hedeflerine ulaşılamamasından, internet/cihaz arızalarından, veri kaybından veya kullanıcının aldığı bireysel finansal kararlardan kaynaklanan doğrudan ya da dolaylı zararlardan hukuken izin verilen azami ölçüde sorumlu değildir.',
    ],
  },
  {
    baslik: '9. Değişiklikler ve yürürlük',
    paragraflar: [
      'Hizmetin geliştirilmesi, yeni özelliklerin eklenmesi veya mevzuat güncellemeleri nedeniyle bu Kullanım Şartları zaman zaman güncellenebilir.',
      'Önemli değişiklikler uygulama içerisinden veya uygun bildirim kanallarıyla kullanıcılara duyurulur. Güncellenen şartlar bu sayfada yayımlandığı andan itibaren yürürlüğe girer.',
    ],
  },
  {
    baslik: '10. Uygulanacak hukuk ve yetkili yargı',
    paragraflar: [
      'Bu Kullanım Şartları, Türkiye Cumhuriyeti kanunlarına tabidir.',
      'Bu şartlardan veya uygulamanın kullanımından doğabilecek her türlü ihtilafın çözümünde, yasal parasal sınırlar dâhilinde Tüketici Hakem Heyetleri ile Kayseri Mahkemeleri ve İcra Daireleri yetkilidir.',
    ],
  },
];

/* ------------------------------------------------------------- 2. İNGİLİZCE */
const en: Bolum[] = [
  {
    baslik: '1. Parties, scope, and acceptance',
    paragraflar: [
      `These Terms of Use govern your access to and use of the Trinkow mobile application and related digital services provided by ${VERI_SORUMLUSU} ("Trinkow", "we", "us").`,
      'By downloading, creating an account, or using Trinkow, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, you must not use the application.',
      `For any questions, feedback, or legal inquiries, you can reach us at ${ILETISIM}.`,
    ],
  },
  {
    baslik: '2. Nature of the service and financial disclaimer',
    paragraflar: [
      'Trinkow is a personal financial planning and budget tracking tool that allows users to record, organize, analyze, and track their income, expenses, installments, debts, savings, subscriptions, and routines.',
      'Not investment or financial advice: Trinkow is not a bank, brokerage, payment institution, or financial advisory firm. All charts, summaries, projections, and calculations are strictly for personal tracking and informational purposes; they do not constitute investment, tax, legal, or professional financial advice.',
      'No bank integration or money movement: Trinkow does not link directly to bank accounts, query actual bank balances, or initiate payments or fund transfers on your behalf.',
    ],
  },
  {
    baslik: '3. Account creation, security, and acceptable use',
    paragraflar: [
      'To access full features, an account must be created using an email address or supported third-party sign-in providers (e.g., Sign in with Google).',
      'Account security: You are responsible for safeguarding your login credentials and maintaining the security of your device. Notify us immediately if you suspect unauthorized access to your account.',
      'Data accuracy: You are solely responsible for the accuracy and completeness of data entered into the app. Trinkow is not liable for calculation discrepancies resulting from incorrect or missing user entries.',
      'Acceptable use: You agree not to reverse engineer, decompile, bypass security controls, send automated queries (bots, scrapers), overload our servers, or use the application for any unlawful purpose.',
    ],
  },
  {
    baslik: '4. Trinkow Premium, subscriptions, and payments',
    paragraflar: [
      'Trinkow Premium is an optional paid subscription providing advanced analytics, comprehensive savings projections, dedicated budget tools, and an ad-free experience.',
      'Store payments: Subscription payments are processed exclusively through Apple App Store or Google Play Store. Your credit card and payment details are handled by the respective store and never stored by Trinkow.',
      'Free trial: If a free trial is offered (e.g., 7 days), no charges apply during the trial period. Unless cancelled in your store settings at least 24 hours before the trial ends, the subscription will automatically convert to a paid subscription at the chosen plan rate.',
      'Automatic renewal: Subscriptions renew automatically on a monthly or annual basis unless cancelled in your store account settings at least 24 hours before the end of the current billing cycle.',
      'Cancellation and refund policy: You can cancel your subscription at any time via Google Play (Payments & subscriptions) or App Store (Subscriptions) settings. Cancellation takes effect at the end of the current period; prorated refunds are not provided by Trinkow. Refund requests are subject to the applicable store’s (Apple / Google) refund policies.',
    ],
  },
  {
    baslik: '5. Intellectual property',
    paragraflar: [
      'Trinkow, including its software, user interface design, logos, graphics, text, and database structure, is protected by copyright and intellectual property laws and belongs to Triworkster.',
      'These Terms grant you a limited, revocable, non-exclusive, non-transferable license to use the app for personal, non-commercial purposes. Copying, reproducing, or distributing any part of the service without prior written consent is strictly prohibited.',
    ],
  },
  {
    baslik: '6. Privacy and data protection',
    paragraflar: [
      'Our collection and processing of your personal data are governed by our Privacy Policy, which forms an integral part of these Terms of Use.',
    ],
  },
  {
    baslik: '7. Termination and account deletion',
    paragraflar: [
      'You can delete your account and associated personal data at any time via the "Delete My Account" option in the Settings screen.',
      'Important notice: Deleting your account does not automatically cancel an active Premium subscription in Google Play or App Store. You must cancel your subscription through your store account to avoid further billing.',
      'Trinkow reserves the right to suspend or terminate accounts that violate these Terms, applicable laws, or third-party rights.',
    ],
  },
  {
    baslik: '8. Limitation of liability and warranties',
    paragraflar: [
      'The application is provided "as is" and "as available" without warranties of any kind, whether express or implied. We do not warrant that the service will be uninterrupted or error-free.',
      'To the maximum extent permitted by law, Trinkow is not liable for indirect, incidental, or consequential damages, financial losses, or missed budget goals arising from your use of or inability to use the service.',
    ],
  },
  {
    baslik: '9. Changes to terms',
    paragraflar: [
      'We may update these Terms of Use from time to time to reflect product enhancements, operational changes, or legal requirements.',
      'Significant changes will be notified via in-app alerts or email. Updated terms take effect immediately upon posting.',
    ],
  },
  {
    baslik: '10. Governing law and dispute resolution',
    paragraflar: [
      'These Terms of Use are governed by the laws of the Republic of Türkiye. Any disputes shall be submitted to the competent Consumer Arbitration Committees and Courts of Kayseri, Türkiye.',
    ],
  },
];

/* ------------------------------------------------------------- 3. ALMANCA */
const de: Bolum[] = [
  {
    baslik: '1. Parteien, Geltungsbereich und Zustimmung',
    paragraflar: [
      `Diese Nutzungsbedingungen regeln den Zugriff auf und die Nutzung der mobilen Trinkow-Anwendung und zugehöriger digitaler Dienste durch ${VERI_SORUMLUSU} ("Trinkow", "wir", "uns").`,
      'Durch das Herunterladen, Erstellen eines Kontos oder die Nutzung von Trinkow stimmst du diesen Nutzungsbedingungen und unserer Datenschutzerklärung zu.',
      `Bei Fragen oder rechtlichen Mitteilungen erreichst du uns unter ${ILETISIM}.`,
    ],
  },
  {
    baslik: '2. Art der Dienstleistung und Haftungsausschluss',
    paragraflar: [
      'Trinkow ist ein persönliches Tool zur Finanz- und Budgetplanung, mit dem du Einnahmen, Ausgaben, Raten, Schulden, Ersparnisse, Abonnements und Routinen erfassen und analysieren kannst.',
      'Keine Anlage- oder Finanzberatung: Trinkow ist weder eine Bank noch ein Finanzberater. Alle Diagramme, Berechnungen und Prognosen dienen ausschließlich der persönlichen Information und stellen keine finanzielle oder steuerliche Beratung dar.',
      'Keine direkte Bankanbindung: Trinkow stellt keine direkte Verbindung zu Bankkonten her und führt keine Geldtransfers durch.',
    ],
  },
  {
    baslik: '3. Konto, Sicherheit und zulässige Nutzung',
    paragraflar: [
      'Für die vollständige Nutzung ist ein Konto per E-Mail oder Google-Login erforderlich.',
      'Die Geheimhaltung deiner Zugangsdaten liegt in deiner Verantwortung. Informiere uns sofort bei unbefugtem Kontozugriff.',
      'Du verpflichtest dich, die App nicht zu dekompilieren, Server nicht zu überlasten und keine automatisierten Bots einzusetzen.',
    ],
  },
  {
    baslik: '4. Trinkow Premium, Abonnements und Zahlungsbedingungen',
    paragraflar: [
      'Trinkow Premium ist ein optionales kostenpflichtiges Abonnement mit erweiterten Analysen, detaillierten Sparzielen und werbefreier Nutzung.',
      'Zahlungen werden direkt über den Apple App Store oder Google Play Store abgewickelt. Trinkow speichert keine Kreditkartendaten.',
      'Kostenlose Testphase: Sofern angeboten (z. B. 7 Tage), fallen während des Testzeitraums keine Kosten an. Wird das Probeabo nicht mindestens 24 Stunden vor Ablauf gekündigt, verlängert es sich kostenpflichtig.',
      'Kündigung: Du kannst dein Abonnement jederzeit in den Einstellungen deines Google Play- oder App Store-Kontos verwalten und kündigen.',
    ],
  },
  {
    baslik: '5. Geistiges Eigentum',
    paragraflar: [
      'Sämtliche Rechte an Design, Code, Benutzeroberfläche, Marken und Inhalten von Trinkow verbleiben bei Triworkster.',
      'Du erhältst eine persönliche, nicht-exklusive und widerrufliche Lizenz zur privaten Nutzung.',
    ],
  },
  {
    baslik: '6. Datenschutz',
    paragraflar: [
      'Die Verarbeitung deiner personenbezogenen Daten wird in der Datenschutzerklärung ausführlich geregelt.',
    ],
  },
  {
    baslik: '7. Kontokündigung und Datenlöschung',
    paragraflar: [
      'Du kannst dein Konto jederzeit unter Einstellungen → Mein Konto löschen entfernen.',
      'Wichtiger Hinweis: Das Löschen des Kontos beendet nicht automatisch ein laufendes Abonnement im App Store oder bei Google Play.',
    ],
  },
  {
    baslik: '8. Haftungsbeschränkung',
    paragraflar: [
      'Die Bereitstellung erfolgt "wie besehen". Wir haften im gesetzlich zulässigen Rahmen nicht für entgangene Sparziele oder Datenverluste.',
    ],
  },
  {
    baslik: '9. Änderungen',
    paragraflar: [
      'Aktualisierungen dieser Bedingungen treten mit ihrer Veröffentlichung in der Anwendung in Kraft.',
    ],
  },
  {
    baslik: '10. Anwendbares Recht',
    paragraflar: [
      'Es gilt das Recht der Republik Türkei. Gerichtsstand ist Kayseri, Türkei.',
    ],
  },
];

/* ------------------------------------------------------------- 4. FRANSIZCA */
const fr: Bolum[] = [
  {
    baslik: "1. Parties, champ d'application et acceptation",
    paragraflar: [
      `Les présentes Conditions d'utilisation régissent l'accès et l'utilisation de l'application mobile Trinkow fournie par ${VERI_SORUMLUSU} ("Trinkow", "nous").`,
      'En téléchargeant ou utilisant Trinkow, vous acceptez les présentes Conditions et notre Politique de confidentialité.',
      `Pour toute question, contactez-nous à ${ILETISIM}.`,
    ],
  },
  {
    baslik: '2. Nature du service et exclusion de conseil financier',
    paragraflar: [
      'Trinkow est un outil de planification budgétaire personnelle permettant d’enregistrer et de suivre revenus, dépenses, abonnements et épargne.',
      'Pas de conseil en investissement : Trinkow n’est pas une banque ni un conseiller financier. Les graphiques et résumés sont purement informatifs.',
      'Pas d’intégration bancaire directe : Trinkow n’initie aucun virement ni mouvement de fonds.',
    ],
  },
  {
    baslik: '3. Compte, sécurité et utilisation acceptable',
    paragraflar: [
      'Vous êtes responsable du maintien de la confidentialité de vos identifiants et de l’exactitude des données saisies.',
      'Toute ingénierie inverse, extraction de code ou utilisation abusive de nos serveurs est strictement interdite.',
    ],
  },
  {
    baslik: '4. Trinkow Premium, abonnements et paiements',
    paragraflar: [
      'Trinkow Premium est un abonnement optionnel payant offrant des analyses détaillées, un suivi d’épargne avancé et une expérience sans publicité.',
      'Paiements via les plateformes : Les règlements sont gérés exclusivement par l’Apple App Store ou Google Play Store. Trinkow ne conserve pas vos coordonnées bancaires.',
      'Essai gratuit : S’il est proposé (ex. 7 jours), l’abonnement ne sera facturé que s’il n’est pas résilié au moins 24 heures avant l’échéance.',
      'Résiliation : Vous pouvez annuler votre abonnement à tout moment dans les réglages de votre compte Google Play ou App Store.',
    ],
  },
  {
    baslik: '5. Propriété intellectuelle',
    paragraflar: [
      'Tous les droits relatifs au design, code, marques et contenu de Trinkow appartiennent à Triworkster.',
    ],
  },
  {
    baslik: '6. Protection des données',
    paragraflar: [
      'Le traitement de vos données est décrit dans notre Politique de confidentialité.',
    ],
  },
  {
    baslik: '7. Résiliation et suppression de compte',
    paragraflar: [
      'Vous pouvez supprimer votre compte dans les Paramètres. Important : supprimer votre compte n’annule pas votre abonnement sur l’App Store ou Google Play.',
    ],
  },
  {
    baslik: '8. Limitation de responsabilité',
    paragraflar: [
      'L’application est fournie "en l’état". Trinkow décline toute responsabilité pour les décisions financières prises par l’utilisateur.',
    ],
  },
  {
    baslik: '9. Modifications',
    paragraflar: [
      'Les modifications prennent effet dès leur publication dans l’application.',
    ],
  },
  {
    baslik: '10. Droit applicable',
    paragraflar: [
      'Les présentes conditions sont régies par le droit turc. Tribunal compétent : Kayseri, Turquie.',
    ],
  },
];

/* ------------------------------------------------------------- 5. İSPANYOLCA */
const es: Bolum[] = [
  {
    baslik: '1. Partes, alcance y aceptación',
    paragraflar: [
      `Estos Términos de uso regulan el acceso y uso de la aplicación móvil Trinkow proporcionada por ${VERI_SORUMLUSU} ("Trinkow", "nosotros").`,
      'Al descargar o usar Trinkow, aceptas estos Términos y nuestra Política de privacidad.',
      `Contacto: ${ILETISIM}.`,
    ],
  },
  {
    baslik: '2. Naturaleza del servicio y descargo de responsabilidad financiera',
    paragraflar: [
      'Trinkow es una herramienta de planificación financiera y control de presupuestos personales.',
      'No constituye asesoramiento financiero ni de inversión: Trinkow no es un banco ni entidad de inversión. Los resúmenes son informativos.',
      'Sin integración bancaria directa: Trinkow no realiza transferencias de dinero ni consultas directas de saldo.',
    ],
  },
  {
    baslik: '3. Cuenta, seguridad y uso aceptable',
    paragraflar: [
      'Eres responsable de la seguridad de tus credenciales y de la veracidad de los datos introducidos.',
      'Queda prohibida la ingeniería inversa, extracción de código o envío de consultas automatizadas (bots).',
    ],
  },
  {
    baslik: '4. Trinkow Premium, suscripciones y pagos',
    paragraflar: [
      'Trinkow Premium es una suscripción de pago opcional con análisis avanzados y sin anuncios.',
      'Los pagos se gestionan exclusivamente a través de Google Play o Apple App Store.',
      'Periodo de prueba gratuito: Si se ofrece (ej. 7 días), debe cancelarse al menos 24 horas antes de su vencimiento para evitar cobros.',
      'Cancelación: Puedes cancelar la suscripción en cualquier momento desde los ajustes de tu tienda de aplicaciones.',
    ],
  },
  {
    baslik: '5. Propiedad intelectual',
    paragraflar: [
      'Todos los derechos sobre el software, diseño y marca Trinkow pertenecen a Triworkster.',
    ],
  },
  {
    baslik: '6. Privacidad',
    paragraflar: [
      'La gestión de datos personales se rige por nuestra Política de privacidad.',
    ],
  },
  {
    baslik: '7. Cancelación de cuenta',
    paragraflar: [
      'Puedes eliminar tu cuenta en Ajustes. Recuerda cancelar tu suscripción en la tienda para evitar cobros futuros.',
    ],
  },
  {
    baslik: '8. Limitación de responsabilidad',
    paragraflar: [
      'El servicio se proporciona "tal cual" sin garantías de ningún tipo.',
    ],
  },
  {
    baslik: '9. Modificaciones',
    paragraflar: [
      'Las modificaciones entran en vigor tras su publicación.',
    ],
  },
  {
    baslik: '10. Ley aplicable',
    paragraflar: [
      'Rige la legislación de la República de Turquía. Tribunales competentes: Kayseri, Turquía.',
    ],
  },
];

/* ------------------------------------------------------------- 6. İTALYANCA */
const it: Bolum[] = [
  {
    baslik: '1. Parti, ambito e accettazione',
    paragraflar: [
      `I presenti Termini di utilizzo regolano l'accesso e l'uso dell'applicazione Trinkow offerta da ${VERI_SORUMLUSU} ("Trinkow", "noi").`,
      'Scaricando o utilizzando Trinkow, accetti i presenti Termini e l’Informativa sulla privacy.',
      `Contatto: ${ILETISIM}.`,
    ],
  },
  {
    baslik: '2. Natura del servizio ed esclusione di consulenza finanziaria',
    paragraflar: [
      'Trinkow è uno strumento di pianificazione finanziaria e monitoraggio del budget personale.',
      'Non costituisce consulenza finanziaria o di investimento: i dati e i grafici sono puramente a scopo informativo.',
      'Nessun collegamento bancario diretto: Trinkow non effettua pagamenti né trasferimenti di fondi.',
    ],
  },
  {
    baslik: '3. Account, sicurezza e utilizzo consentito',
    paragraflar: [
      'Sei responsabile della riservatezza delle credenziali e dell’accuratezza delle informazioni inserite.',
      'È vietato effettuare reverse engineering, decompilazione o sovraccaricare i nostri server.',
    ],
  },
  {
    baslik: '4. Trinkow Premium, abbonamenti e pagamenti',
    paragraflar: [
      'Trinkow Premium è un abbonamento opzionale a pagamento con report approfonditi e assenza di pubblicità.',
      'I pagamenti sono elaborati unicamente da Apple App Store o Google Play Store.',
      'Periodo di prova: se previsto (es. 7 giorni), si rinnova automaticamente se non disdetto almeno 24 ore prima della scadenza.',
      'Disdetta: gestibile in qualsiasi momento nelle impostazioni dello store.',
    ],
  },
  {
    baslik: '5. Proprietà intellettuale',
    paragraflar: [
      'Tutti i diritti su design, codice e marchi Trinkow appartengono a Triworkster.',
    ],
  },
  {
    baslik: '6. Privacy',
    paragraflar: [
      'Il trattamento dei dati personali è descritto nell’Informativa sulla privacy.',
    ],
  },
  {
    baslik: '7. Chiusura dell’account',
    paragraflar: [
      'Puoi eliminare il tuo account nelle Impostazioni. Ricorda di disattivare l’abbonamento nello store.',
    ],
  },
  {
    baslik: '8. Limitazione di responsabilità',
    paragraflar: [
      'Il servizio è fornito "così com’è". Trinkow non risponde di decisioni finanziarie individuali.',
    ],
  },
  {
    baslik: '9. Modifiche',
    paragraflar: [
      'I termini aggiornati hanno efficacia immediata alla pubblicazione.',
    ],
  },
  {
    baslik: '10. Legge applicabile',
    paragraflar: [
      'Si applica la legge turca. Foro competente: Kayseri, Turchia.',
    ],
  },
];

/* ------------------------------------------------------------- 7. PORTEKİZCE */
const pt: Bolum[] = [
  {
    baslik: '1. Partes, âmbito e aceitação',
    paragraflar: [
      `Estes Termos de Uso regulam o acesso e utilização da aplicação Trinkow disponibilizada pela ${VERI_SORUMLUSU} ("Trinkow", "nós").`,
      'Ao transferir ou utilizar a Trinkow, concordas com estes Termos e com a nossa Política de Privacidade.',
      `Contacto: ${ILETISIM}.`,
    ],
  },
  {
    baslik: '2. Natureza do serviço e isenção de responsabilidade financeira',
    paragraflar: [
      'A Trinkow é uma ferramenta de planeamento financeiro pessoal e controlo orçamental.',
      'Não constitui consultoria financeira ou de investimento: gráficos e resumos são meramente informativos.',
      'Sem ligação bancária direta: a aplicação não movimenta dinheiro nem acede a contas bancárias.',
    ],
  },
  {
    baslik: '3. Conta, segurança e regras de utilização',
    paragraflar: [
      'És responsável por manter a confidencialidade das credenciais e pela precisão dos dados registados.',
      'É estritamente proibida a engenharia reversa ou o uso de robôs/scrapers.',
    ],
  },
  {
    baslik: '4. Trinkow Premium, subscrições e pagamentos',
    paragraflar: [
      'O Trinkow Premium é uma subscrição paga opcional com análises aprofundadas e sem anúncios.',
      'Os pagamentos são processados pela Apple App Store ou Google Play Store.',
      'Período de teste gratuito: se aplicável (ex. 7 dias), renova-se automaticamente a menos que seja cancelado 24 horas antes do término.',
      'Cancelamento: pode ser efetuado a qualquer momento nas definições da loja de aplicações.',
    ],
  },
  {
    baslik: '5. Propriedade intelectual',
    paragraflar: [
      'Todos os direitos sobre software, design e marca Trinkow pertencem à Triworkster.',
    ],
  },
  {
    baslik: '6. Privacidade',
    paragraflar: [
      'O tratamento de dados é regido pela nossa Política de Privacidade.',
    ],
  },
  {
    baslik: '7. Eliminação de conta',
    paragraflar: [
      'Podes eliminar a tua conta nas Definições. Nota: deves cancelar a subscrição na loja para evitar novas cobranças.',
    ],
  },
  {
    baslik: '8. Limitação de responsabilidade',
    paragraflar: [
      'O serviço é fornecido "tal como está", sem garantias implícitas.',
    ],
  },
  {
    baslik: '9. Alterações',
    paragraflar: [
      'As atualizações entram em vigor assim que publicadas.',
    ],
  },
  {
    baslik: '10. Lei aplicável',
    paragraflar: [
      'Aplica-se a lei da República da Turquia. Foro competente: Kayseri, Turquia.',
    ],
  },
];

/* ------------------------------------------------------------- 8. ROMENCE */
const ro: Bolum[] = [
  {
    baslik: '1. Părți, domeniu și acceptare',
    paragraflar: [
      `Acești Termeni de utilizare guvernează accesul și utilizarea aplicației mobile Trinkow oferite de ${VERI_SORUMLUSU} („Trinkow”, „noi”).`,
      'Descărcând sau utilizând Trinkow, sunteți de acord cu acești Termeni și cu Politica noastră de confidențialitate.',
      `Contact: ${ILETISIM}.`,
    ],
  },
  {
    baslik: '2. Natura serviciului și declinarea responsabilității financiare',
    paragraflar: [
      'Trinkow este un instrument de planificare financiară personală și evidență a bugetului.',
      'Nu reprezintă consultanță financiară sau de investiții: calculele și graficele au rol strict informativ.',
      'Fără conectare bancară directă: Trinkow nu efectuează transferuri de fonduri.',
    ],
  },
  {
    baslik: '3. Cont, securitate și utilizare permisă',
    paragraflar: [
      'Sunteți responsabil pentru securitatea credențialelor și pentru acuratețea datelor introduse.',
      'Sunt interzise ingineria inversă și utilizarea oricăror sisteme automatizate (bot/scraper).',
    ],
  },
  {
    baslik: '4. Trinkow Premium, abonamente și plăți',
    paragraflar: [
      'Trinkow Premium este un abonament opțional plătit care oferă analize avansate și elimină reclamele.',
      'Plățile sunt procesate direct prin Apple App Store sau Google Play Store.',
      'Perioadă de probă gratuită: dacă este disponibilă (de ex. 7 zile), abonamentul se reînnoiește automat dacă nu este anulat cu 24h înainte.',
      'Anulare: poate fi gestionată oricând din setările magazinului de aplicații.',
    ],
  },
  {
    baslik: '5. Proprietate intelectuală',
    paragraflar: [
      'Toate drepturile asupra aplicației, designului și mărcii Trinkow aparțin Triworkster.',
    ],
  },
  {
    baslik: '6. Confidențialitate',
    paragraflar: [
      'Prelucrarea datelor cu caracter personal este descrisă în Politica de confidențialitate.',
    ],
  },
  {
    baslik: '7. Ștergerea contului',
    paragraflar: [
      'Vă puteți șterge contul din Setări. Rețineți să anulați abonamentul din magazin pentru a evita facturarea.',
    ],
  },
  {
    baslik: '8. Limitarea răspunderii',
    paragraflar: [
      'Aplicația este furnizată „ca atare”, fără garanții exprese sau implicite.',
    ],
  },
  {
    baslik: '9. Modificări',
    paragraflar: [
      'Modificările intră în vigoare odată cu publicarea în aplicație.',
    ],
  },
  {
    baslik: '10. Legea aplicabilă',
    paragraflar: [
      'Se aplică legislația Republicii Turcia. Instanța competentă: Kayseri, Turcia.',
    ],
  },
];

/* ------------------------------------------------------------- 9. LEHÇE */
const pl: Bolum[] = [
  {
    baslik: '1. Strony, zakres i akceptacja',
    paragraflar: [
      `Niniejszy Regulamin określa zasady korzystania z aplikacji mobilnej Trinkow dostarczanej przez ${VERI_SORUMLUSU} („Trinkow”, „my”).`,
      'Pobierając lub korzystając z Trinkow, akceptujesz Regulamin oraz Politykę prywatności.',
      `Kontakt: ${ILETISIM}.`,
    ],
  },
  {
    baslik: '2. Charakter usługi i wyłączenie doradztwa finansowego',
    paragraflar: [
      'Trinkow to narzędzie do osobistego planowania finansowego i kontroli budżetu.',
      'Brak doradztwa inwestycyjnego: wykresy i podsumowania mają charakter wyłącznie informacyjny.',
      'Brak bezpośredniej integracji bankowej: aplikacja nie wykonuje przelewów ani operacji finansowych.',
    ],
  },
  {
    baslik: '3. Konto, bezpieczeństwo i zasady użytkowania',
    paragraflar: [
      'Odpowiadasz za poufność danych logowania oraz dokładność wprowadzanych wpisów.',
      'Zabroniona jest inżynieria wsteczna oraz przeciążanie infrastruktury serwerowej.',
    ],
  },
  {
    baslik: '4. Trinkow Premium, subskrypcje i płatności',
    paragraflar: [
      'Trinkow Premium to płatna subskrypcja oferująca zaawansowane statystyki i brak reklam.',
      'Płatności są realizowane wyłącznie przez Apple App Store lub Google Play Store.',
      'Okres próbny: jeśli jest dostępny (np. 7 dni), odnawia się automatycznie w przypadku braku anulowania 24h przed końcem.',
      'Anulowanie: możesz zarządzać subskrypcją w ustawieniach konta w sklepie z aplikacjami.',
    ],
  },
  {
    baslik: '5. Własność intelektualna',
    paragraflar: [
      'Wszelkie prawa do aplikacji i marki Trinkow przysługują firmie Triworkster.',
    ],
  },
  {
    baslik: '6. Prywatność',
    paragraflar: [
      'Zasady przetwarzania danych określa Polityka prywatności.',
    ],
  },
  {
    baslik: '7. Usunięcie konta',
    paragraflar: [
      'Możesz usunąć konto w Ustawieniach. Pamiętaj o anulowaniu subskrypcji w sklepie.',
    ],
  },
  {
    baslik: '8. Ograniczenie odpowiedzialności',
    paragraflar: [
      'Usługa jest świadczona „w stanie, w jakim się znajduje” (as-is).',
    ],
  },
  {
    baslik: '9. Zmiany regulaminu',
    paragraflar: [
      'Zmiany wchodzą w życie z chwilą opublikowania w aplikacji.',
    ],
  },
  {
    baslik: '10. Prawo właściwe',
    paragraflar: [
      'Prawem właściwym jest prawo Republiki Turcji. Sąd właściwy: Kayseri, Turcja.',
    ],
  },
];

/* ------------------------------------------------------------- 10. RUSÇA */
const ru: Bolum[] = [
  {
    baslik: '1. Стороны, предмет и принятие условий',
    paragraflar: [
      `Настоящие Условия регулируют использование мобильного приложения Trinkow, предоставляемого ${VERI_SORUMLUSU} («Trinkow», «мы»).`,
      'Загружая или используя приложение, вы соглашаетесь с настоящими Условиями и Политикой конфиденциальности.',
      `Контакт: ${ILETISIM}.`,
    ],
  },
  {
    baslik: '2. Характер сервиса и отказ от финансовой ответственности',
    paragraflar: [
      'Trinkow — это персональный инструмент для ведения бюджета и планирования личных финансов.',
      'Не является инвестиционной или финансовой консультацией: графики и сводки носят исключительно ознакомительный характер.',
      'Отсутствие банковских переводов: Trinkow не подключается к банковским счетам и не осуществляет денежные переводы.',
    ],
  },
  {
    baslik: '3. Учётная запись, безопасность и правила использования',
    paragraflar: [
      'Вы несёте ответственность за сохранность данных учётной записи и точность введённых данных.',
      'Запрещается обратная разработка приложения или отправка автоматизированных запросов.',
    ],
  },
  {
    baslik: '4. Trinkow Premium, подписки и платежи',
    paragraflar: [
      'Trinkow Premium — платная подписка с расширенной аналитикой и отключением рекламы.',
      'Оплата обрабатывается магазинами Apple App Store или Google Play Store. Trinkow не хранит данные карт.',
      'Пробный период: если предусмотрен (например, 7 дней), подписка продлевается автоматически, если не отменена за 24 часа.',
      'Отмена подписки: осуществляется в настройках учётной записи магазина приложений.',
    ],
  },
  {
    baslik: '5. Интеллектуальная собственность',
    paragraflar: [
      'Все права на дизайн, код и бренд Trinkow принадлежат Triworkster.',
    ],
  },
  {
    baslik: '6. Конфиденциальность',
    paragraflar: [
      'Обработка данных регулируется Политикой конфиденциальности.',
    ],
  },
  {
    baslik: '7. Удаление аккаунта',
    paragraflar: [
      'Вы можете удалить аккаунт в Настройках. Важно: для прекращения списаний отмените подписку в магазине.',
    ],
  },
  {
    baslik: '8. Ограничение ответственности',
    paragraflar: [
      'Сервис предоставляется на условиях «как есть». Trinkow не несёт ответственности за финансовые решения пользователя.',
    ],
  },
  {
    baslik: '9. Изменения',
    paragraflar: [
      'Изменения вступают в силу с момента публикации в приложении.',
    ],
  },
  {
    baslik: '10. Применимое право',
    paragraflar: [
      'Применяется законодательство Турецкой Республики. Компетентный суд: г. Кайсери, Турция.',
    ],
  },
];

/* ------------------------------------------------------------- 11. ÇEKÇE */
const cs: Bolum[] = [
  {
    baslik: '1. Smluvní strany, rozsah a souhlas',
    paragraflar: [
      `Tyto Podmínky použití upravují přístup a používání mobilní aplikace Trinkow poskytované společností ${VERI_SORUMLUSU} („Trinkow“, „my“).`,
      'Stažením nebo používáním Trinkow souhlasíte s těmito Podmínkami a našimi Zásadami ochrany soukromí.',
      `Kontakt: ${ILETISIM}.`,
    ],
  },
  {
    baslik: '2. Povaha služby a vyloučení finančního poradenství',
    paragraflar: [
      'Trinkow je nástroj pro osobní finanční plánování a sledování rozpočtu.',
      'Nejedná se o investiční ani finanční poradenství: přehledy a grafy mají výhradně informativní charakter.',
      'Žádné přímé bankovní převody: aplikace neprovádí finanční transakce ani nenahlíží na bankovní účty.',
    ],
  },
  {
    baslik: '3. Účet, bezpečnost a pravidla použití',
    paragraflar: [
      'Odpovídáte za zabezpečení přihlašovacích údajů a správnost zadaných údajů.',
      'Je zakázáno zpětné inženýrství nebo přetěžování naší serverové infrastruktury.',
    ],
  },
  {
    baslik: '4. Trinkow Premium, předplatné a platby',
    paragraflar: [
      'Trinkow Premium je volitelné předplatné s pokročilými analýzami a bez reklam.',
      'Platby jsou zpracovávány výhradně přes Apple App Store nebo Google Play Store.',
      'Bezplatná zkušební doba: pokud je nabízena (např. 7 dní), předplatné se automaticky obnoví, pokud není zrušeno 24 hodin předem.',
      'Zrušení: předplatné lze kdykoli zrušit v nastavení vašeho obchodu s aplikacemi.',
    ],
  },
  {
    baslik: '5. Duševní vlastnictví',
    paragraflar: [
      'Veškerá práva k softwaru, designu a značce Trinkow náleží společnosti Triworkster.',
    ],
  },
  {
    baslik: '6. Ochrana soukromí',
    paragraflar: [
      'Zpracování údajů se řídí našimi Zásadami ochrany soukromí.',
    ],
  },
  {
    baslik: '7. Zrušení účtu',
    paragraflar: [
      'Účet můžete smazat v Nastavení. Nezapomeňte také zrušit předplatné v obchodě s aplikacemi.',
    ],
  },
  {
    baslik: '8. Omezení odpovědnosti',
    paragraflar: [
      'Služba je poskytována „tak, jak je“, bez jakýchkoli záruk.',
    ],
  },
  {
    baslik: '9. Změny',
    paragraflar: [
      'Změny nabývají účinnosti okamžikem zveřejnění v aplikaci.',
    ],
  },
  {
    baslik: '10. Rozhodné právo',
    paragraflar: [
      'Řídí se právem Turecké republiky. Příslušný soud: Kayseri, Turecko.',
    ],
  },
];

export const kosullarDiller: Record<Dil, Belge> = {
  tr: { baslik: 'Kullanım şartları', bilgi: 'Yürürlük tarihi: 28 Ekim 2026 • Sürüm 1.1', bolumler: tr },
  en: { baslik: 'Terms of Use', bilgi: 'Effective date: October 28, 2026 • Version 1.1', bolumler: en },
  de: { baslik: 'Nutzungsbedingungen', bilgi: 'Gültig ab: 28. Oktober 2026 • Version 1.1', bolumler: de },
  fr: { baslik: "Conditions d'utilisation", bilgi: "Date d'effet : 28 octobre 2026 • Version 1.1", bolumler: fr },
  es: { baslik: 'Términos de uso', bilgi: 'Fecha de vigencia: 28 de octubre de 2026 • Versión 1.1', bolumler: es },
  it: { baslik: 'Termini di utilizzo', bilgi: 'Data di efficacia: 28 ottobre 2026 • Versione 1.1', bolumler: it },
  pt: { baslik: 'Termos de Uso', bilgi: 'Data de vigência: 28 de outubro de 2026 • Versão 1.1', bolumler: pt },
  ro: { baslik: 'Termeni și condiții de utilizare', bilgi: 'Data intrării în vigoare: 28 octombrie 2026 • Versiunea 1.1', bolumler: ro },
  pl: { baslik: 'Regulamin korzystania', bilgi: 'Data wejścia w życie: 28 października 2026 • Wersja 1.1', bolumler: pl },
  ru: { baslik: 'Условия использования', bilgi: 'Дата вступления в силу: 28 октября 2026 г. • Версия 1.1', bolumler: ru },
  cs: { baslik: 'Podmínky použití', bilgi: 'Datum účinnosti: 28. října 2026 • Verze 1.1', bolumler: cs },
};

