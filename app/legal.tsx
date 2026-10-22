import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { InfoStrip } from '@/components/InfoStrip';
import { SettingsPage } from '@/components/SettingsPage';
import { Txt } from '@/components/Txt';
import { useYerellestirme } from '@/lib/useYerellestirme';
import { rhythm } from '@/theme/tokens';

type Bolum = {
  baslik: string;
  paragraflar: string[];
};

type Belge = {
  baslik: string;
  bilgi: string;
  taslak?: boolean;
  bolumler: Bolum[];
};

const VERI_SORUMLUSU = 'Triworkster';
const ILETISIM = 'trinkow@gmail.com';
const YURURLUK_TARIHI = '22 Ekim 2026';
const YURURLUK_TARIHI_EN = 'October 22, 2026';

const gizlilikBolumleri: Bolum[] = [
  {
    baslik: '1. Veri sorumlusu ve kapsam',
    paragraflar: [
      `Bu Gizlilik Politikası, veri sorumlusu ${VERI_SORUMLUSU} tarafından sunulan Trinkow mobil uygulamasında kişisel verilerin nasıl işlendiğini açıklar. Gizlilik ve kişisel veri talepleri için ${ILETISIM} adresine ulaşabilirsin.`,
      'Trinkow; kullanıcının kendi girdiği verilerle bütçe, harcama, borç, birikim, abonelik ve rutin takibi sağlayan bir kişisel finans planlama aracıdır. Banka hesabına bağlanmaz, ödeme işlemez ve yatırım hizmeti sunmaz.',
    ],
  },
  {
    baslik: '2. İşlenen veriler',
    paragraflar: [
      'Hesap ve kimlik doğrulama verileri: e-posta adresi, hashlenmiş parola, Google ile giriş yapıldığında Google hesap kimliği (sub), doğrulanmış e-posta ve oturum kayıtları.',
      'Kullanıcının girdiği finans ve planlama verileri: gelir ve maaş günü, bütçe, sabit giderler, borçlar, tasarruf hedefleri ve hareketleri, harcama tutarı, kategori, ürün adı, not, tarih/saat, ödeme türü, taksitler, abonelikler, rutinler, favoriler, kategori limitleri ve harcamasız gün kayıtları.',
      'Tercih ve alışkanlık verileri: uygulama tercihleri, onboarding cevapları, bildirim tercihi ve zamanı ile kullanıcının isteğe bağlı olarak girdiği kahve, sigara, alkol, dışarıda yeme gibi rutinler.',
      'Güvenlik ve teknik veriler: oturum tokenları, parola sıfırlama ve kötüye kullanımı önleme kayıtları ile sunucu erişim kayıtlarında bulunabilecek IP adresi, istek zamanı ve temel cihaz/ağ bilgileri.',
      'Sesli harcama özelliğini seçtiğinde mikrofon yalnız konuşmanı cihazın iOS veya Android konuşma tanıma hizmetiyle metne dönüştürmek için kullanılır. Trinkow ham ses kaydını saklamaz veya kendi sunucularına göndermez. Cihazındaki konuşma tanıma hizmeti, işletim sistemi ve cihaz ayarlarına bağlı olarak sesi cihazda ya da kendi hizmet altyapısında işleyebilir.',
      'Trinkow banka/kredi kartı numarası, banka giriş bilgisi, kesin konum, rehber, kamera, ham mikrofon kaydı, fotoğraf veya reklam kimliği toplamaz.',
    ],
  },
  {
    baslik: '3. Verilerin toplanması ve saklanması',
    paragraflar: [
      'Veriler doğrudan uygulamada yaptığın girişlerden, hesap işlemlerinden ve Google ile giriş sırasında Google tarafından sağlanan kimlik bilgilerinden elektronik ortamda elde edilir.',
      'Sesli girişte oluşan metin cihazda harcama taslağına dönüştürülür. Yalnız sen alanları kontrol edip Kaydet dediğinde oluşan harcama alanları Trinkow backend hizmetine gönderilir.',
      'Finansal ve profil verileri Trinkow backend hizmetindeki MongoDB veritabanında tutulur; uygulama bu veriler için yerel SQLite veritabanı kullanmaz. “Beni hatırla” seçildiğinde oturum tokenları ve hesap e-postası iOS Keychain veya Android Keystore tabanlı güvenli cihaz deposunda saklanır. Seçilmediğinde oturum bilgileri uygulama belleğiyle sınırlıdır.',
    ],
  },
  {
    baslik: '4. İşleme amaçları ve hukuki sebepler',
    paragraflar: [
      'Veriler; hesap oluşturmak ve oturum açmak, bütçe ve tasarruf hesaplamalarını sunmak, kayıtlarını cihazların arasında erişilebilir kılmak, destek sağlamak, parola sıfırlamak, güvenliği ve hizmet sürekliliğini korumak ve yasal yükümlülükleri yerine getirmek amacıyla işlenir.',
      'KVKK kapsamındaki işleme; hizmet sözleşmesinin kurulması veya ifası, hukuki yükümlülüklerin yerine getirilmesi ve temel haklarını zedelememek kaydıyla meşru menfaat hukuki sebeplerine dayanır. Açık rıza gereken bir özellik eklenirse ayrıca açık rıza istenir ve rıza geri alınabilir.',
    ],
  },
  {
    baslik: '5. Paylaşım ve hizmet sağlayıcılar',
    paragraflar: [
      'Kişisel veriler satılmaz; reklam hedefleme veya üçüncü taraf pazarlama amacıyla paylaşılmaz.',
      'Hizmetin çalışması için gerekli ölçüde sunucu/barındırma sağlayıcısı, MongoDB Atlas veritabanı altyapısı, parola sıfırlama e-postaları için e-posta iletim sağlayıcısı ve Google ile giriş seçildiğinde Google ile veri paylaşılabilir. Yasal bir zorunluluk doğarsa yetkili kamu kurumlarıyla da paylaşım yapılabilir.',
    ],
  },
  {
    baslik: '6. Yurt dışına aktarım',
    paragraflar: [
      'Kullanılan bulut, e-posta ve Google kimlik doğrulama altyapısının sunucuları Türkiye dışında bulunabilir. Bu nedenle veriler, hizmetin sunulması için gerekli ve sınırlı olmak üzere yurt dışındaki hizmet sağlayıcılara aktarılabilir. Aktarım süreçlerinde yürürlükteki mevzuatın öngördüğü uygun güvencelerin sağlanması amaçlanır.',
    ],
  },
  {
    baslik: '7. Saklama süreleri',
    paragraflar: [
      'Hesap, profil ve finans kayıtları hesabın aktif olduğu süre boyunca veya sen silene kadar saklanır. Yenileme oturum kayıtları varsayılan olarak 30 gün sonra, parola sıfırlama bağlantıları 30 dakika sonra ve kötüye kullanım önleme amacıyla oluşturulan sınırlı hız kayıtları yaklaşık 1 saat sonra geçersiz olur.',
      'Hesap silindiğinde aktif veritabanındaki hesap, profil, finans kayıtları ve aktif oturumlar silinir. Hukuki bir saklama zorunluluğu bulunan kayıtlar zorunlu süre kadar; olağan yedeklerde kalan kopyalar ise yedekleme döngüsü tamamlanana kadar erişimi kısıtlı biçimde tutulabilir.',
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

const belgeler: Record<string, Belge> = {
  kosullar: {
    baslik: 'Kullanım şartları',
    bilgi: 'Taslak • Yayın öncesinde ticari ve hukuki inceleme gerektirir.',
    taslak: true,
    bolumler: [
      {
        baslik: 'Hizmetin kapsamı',
        paragraflar: [
          'Trinkow, girdiğin gelir, gider ve alışkanlık bilgilerini düzenleyip hesaplanan bütçe ve tasarruf özetlerini gösterir. Gösterilen tutarlar bir banka hesabının bakiyesini veya yapılmış bir yatırımı temsil etmez.',
          'Hesabının erişim bilgilerini koru. Girdiğin bilgileri Günlük, Bütçem, Rutinler ve Abonelikler ekranlarından kontrol edip düzeltebilirsin. Çıkış yapmak hesabını silmez.',
          'Sorumluluk hükümleri ve diğer ticari koşullar yayın öncesinde tamamlanacaktır. Bu belge henüz nihai kullanım sözleşmesi değildir.',
        ],
      },
    ],
  },
  gizlilik: {
    baslik: 'Gizlilik politikası',
    bilgi: `Yürürlük tarihi: ${YURURLUK_TARIHI} • Sürüm 1.0`,
    bolumler: gizlilikBolumleri,
  },
  aydinlatma: {
    baslik: 'KVKK aydınlatma metni',
    bilgi: `Yürürlük tarihi: ${YURURLUK_TARIHI} • Veri sorumlusu: ${VERI_SORUMLUSU}`,
    bolumler: [
      {
        baslik: 'Veri sorumlusu',
        paragraflar: [
          `Trinkow kapsamında kişisel veriler, veri sorumlusu ${VERI_SORUMLUSU} tarafından işlenir. İletişim ve başvuru adresi: ${ILETISIM}.`,
        ],
      },
      {
        baslik: 'Veriler ve amaçlar',
        paragraflar: [
          'Hesap ve kimlik doğrulama bilgileri; profil, bütçe, harcama, borç, birikim, abonelik, rutin ve tercih kayıtları; güvenlik ve temel sunucu erişim kayıtları işlenir. Amaçlar hesabı ve talep edilen finansal planlama özelliklerini sunmak, güvenliği sağlamak, destek vermek ve hukuki yükümlülükleri yerine getirmektir.',
        ],
      },
      {
        baslik: 'Toplama yöntemi, hukuki sebep ve aktarım',
        paragraflar: [
          'Veriler uygulamadaki girişlerin, hesap işlemlerin ve Google ile giriş tercihin üzerinden otomatik veya kısmen otomatik yollarla toplanır. İşleme; sözleşmenin kurulması veya ifası, hukuki yükümlülük ve meşru menfaat sebeplerine; gerekli hâllerde açık rızaya dayanır.',
          'Veriler, hizmetin çalışması için gerekli ölçüde barındırma, MongoDB Atlas, e-posta iletim ve Google kimlik doğrulama sağlayıcılarına; hukuki zorunluluk hâlinde yetkili kamu kurumlarına aktarılabilir. Bu sağlayıcıların altyapıları nedeniyle yurt dışına aktarım söz konusu olabilir.',
        ],
      },
      {
        baslik: 'Haklar ve başvuru',
        paragraflar: [
          `KVKK’nın 11. maddesindeki bilgi alma, düzeltme, silme/yok etme, aktarım yapılan taraflara bildirim, otomatik işlem sonucuna itiraz ve tazminat haklarını kullanmak için ${ILETISIM} adresine başvurabilirsin. Kimliğini doğrulamak ve hesabı bulmak için kayıtlı e-posta adresinden yazman istenebilir. Ayrıntılar Gizlilik Politikası’nda yer alır.`,
        ],
      },
    ],
  },
  lisanslar: {
    baslik: 'Açık kaynak lisansları',
    bilgi: 'Üçüncü taraf bildirimleri',
    bolumler: [
      {
        baslik: 'Markalar ve simgeler',
        paragraflar: [
          'Abonelik sağlayıcılarını tanımaya yardımcı olan bazı marka simgeleri Font Awesome Free paketinden alınmıştır. Font Awesome, Fonticons, Inc. tarafından CC BY 4.0 lisansıyla sunulur: https://fontawesome.com',
          'Gösterilen şirket ve ürün adları ile logolar ilgili hak sahiplerinin ticari markalarıdır. Trinkow ile sponsorluk veya ortaklık ilişkisi ifade etmez.',
        ],
      },
    ],
  },
};

const gizlilikBolumleriEn: Bolum[] = [
  {
    baslik: '1. Data controller and scope',
    paragraflar: [
      `This Privacy Policy explains how personal data is processed in the Trinkow mobile app provided by ${VERI_SORUMLUSU}, the data controller. For privacy and personal data requests, contact ${ILETISIM}.`,
      'Trinkow is a personal financial planning tool that uses information you enter to track budgets, expenses, debt, savings, subscriptions, and routines. It does not connect to bank accounts, process payments, or provide investment services.',
    ],
  },
  {
    baslik: '2. Data we process',
    paragraflar: [
      'Account and authentication data: email address, hashed password, Google account identifier (sub) and verified email when you sign in with Google, and session records.',
      'Financial and planning data you enter: income and payday, budget, fixed expenses, debt, savings goals and activity, expense amount, category, item name, note, date/time, payment type, installments, subscriptions, routines, favorites, category limits, and no-spend-day records.',
      'Preference and habit data: app preferences, onboarding answers, notification preference and time, and optional routines you enter, such as coffee, smoking, alcohol, or eating out.',
      'Security and technical data: session tokens, password reset and abuse-prevention records, and server access logs that may include IP address, request time, and basic device/network information.',
      'When you choose voice expense entry, the microphone is used only to turn your speech into text through the iOS or Android speech-recognition service on your device. Trinkow does not store raw audio or send it to its own servers. Depending on your operating-system and device settings, the device speech-recognition service may process audio on-device or through its own service infrastructure.',
      'Trinkow does not collect bank or credit card numbers, bank login credentials, precise location, contacts, camera data, raw microphone recordings, photos, or advertising identifiers.',
    ],
  },
  {
    baslik: '3. Collection and storage',
    paragraflar: [
      'Data is collected electronically from information you enter in the app, account actions, and identity information Google provides when you choose Google sign-in.',
      'For voice entry, the recognized text is converted into an expense draft on the device. Expense fields are sent to Trinkow backend services only after you review them and tap Save.',
      'Financial and profile data is stored in the MongoDB database used by Trinkow backend services; the app does not use a local SQLite database for this data. If you select “Remember me,” session tokens and your account email are stored in the secure device storage backed by iOS Keychain or Android Keystore. Otherwise, session information remains in app memory.',
    ],
  },
  {
    baslik: '4. Purposes and legal bases',
    paragraflar: [
      'Data is processed to create accounts and sign users in, provide budget and savings calculations, make records available across your devices, provide support, reset passwords, maintain security and service continuity, and meet legal obligations.',
      'Under the Turkish Personal Data Protection Law (KVKK), processing is based on establishing or performing a service contract, fulfilling legal obligations, and legitimate interests provided that your fundamental rights are not harmed. If a feature requires explicit consent, it will be requested separately and may be withdrawn.',
    ],
  },
  {
    baslik: '5. Sharing and service providers',
    paragraflar: [
      'Personal data is not sold or shared for ad targeting or third-party marketing.',
      'As needed to operate the service, data may be shared with server/hosting providers, MongoDB Atlas, an email delivery provider for password reset messages, and Google if you choose Google sign-in. Data may also be shared with competent public authorities when legally required.',
    ],
  },
  {
    baslik: '6. International transfers',
    paragraflar: [
      'Servers used by cloud, email, and Google authentication providers may be located outside Türkiye. Data may therefore be transferred to service providers abroad to the limited extent necessary to provide the service. The aim is to apply appropriate safeguards required by applicable law.',
    ],
  },
  {
    baslik: '7. Retention',
    paragraflar: [
      'Account, profile, and financial records are retained while your account is active or until you delete them. Refresh-session records expire by default after 30 days, password reset links after 30 minutes, and limited rate records created to prevent abuse after approximately one hour.',
      'When an account is deleted, the account, profile, financial records, and active sessions are deleted from the active database. Records subject to a legal retention obligation may be kept for the required period; copies remaining in routine backups may be retained with access restricted until the backup cycle is complete.',
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
      'You can turn off notifications in the app or your device settings. You can manage Google account permissions in your Google account settings.',
    ],
  },
  {
    baslik: '10. Your rights under the KVKK',
    paragraflar: [
      `Under Article 11 of the KVKK, you may ask whether your personal data is processed; request information if it is; learn the purpose of processing and whether data is used accordingly; learn the third parties to whom it is transferred in Türkiye or abroad; request correction of incomplete or inaccurate data; request deletion or destruction where legal conditions are met; request that corrections and deletions be notified to recipients; object to a result against you arising solely from automated analysis; and claim compensation for damage caused by unlawful processing. You can submit a request to ${ILETISIM}.`,
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

const belgelerEn: Record<string, Belge> = {
  kosullar: {
    baslik: 'Terms of Use',
    bilgi: 'Draft • Requires commercial and legal review before release.',
    taslak: true,
    bolumler: [
      {
        baslik: 'Scope of the service',
        paragraflar: [
          'Trinkow organizes the income, expense, and habit information you enter and presents calculated budget and savings summaries. Displayed amounts do not represent a bank account balance or an investment made.',
          'Keep your account credentials secure. You can review and correct information you enter in the Daily, Budget, Routines, and Subscriptions screens. Signing out does not delete your account.',
          'Liability provisions and other commercial terms will be completed before release. This document is not yet a final service agreement.',
        ],
      },
    ],
  },
  gizlilik: {
    baslik: 'Privacy Policy',
    bilgi: `Effective date: ${YURURLUK_TARIHI_EN} • Version 1.0`,
    bolumler: gizlilikBolumleriEn,
  },
  aydinlatma: {
    baslik: 'KVKK Privacy Notice',
    bilgi: `Effective date: ${YURURLUK_TARIHI_EN} • Data controller: ${VERI_SORUMLUSU}`,
    bolumler: [
      {
        baslik: 'Data controller',
        paragraflar: [
          `Personal data in connection with Trinkow is processed by ${VERI_SORUMLUSU} as the data controller. Contact and request address: ${ILETISIM}.`,
        ],
      },
      {
        baslik: 'Data and purposes',
        paragraflar: [
          'Account and authentication information; profile, budget, expense, debt, savings, subscription, routine, and preference records; and security and basic server access logs are processed. The purposes are to provide your account and requested financial planning features, maintain security, provide support, and meet legal obligations.',
        ],
      },
      {
        baslik: 'Collection, legal basis, and transfers',
        paragraflar: [
          'Data is collected automatically or partly automatically through your app entries, account actions, and choice to sign in with Google. Processing is based on establishing or performing a contract, legal obligations, legitimate interests, and, where required, explicit consent.',
          'To the extent necessary to operate the service, data may be transferred to hosting, MongoDB Atlas, email delivery, and Google authentication providers; it may also be transferred to competent public authorities where legally required. The infrastructure of these providers may involve transfers abroad.',
        ],
      },
      {
        baslik: 'Your rights and how to apply',
        paragraflar: [
          `To exercise your rights under Article 11 of the KVKK, including access, correction, deletion/destruction, notification to recipients, objection to automated decisions, and compensation, contact ${ILETISIM}. You may be asked to write from your registered email address to verify your identity and locate your account. See the Privacy Policy for details.`,
        ],
      },
    ],
  },
  lisanslar: {
    baslik: 'Open-source licenses',
    bilgi: 'Third-party notices',
    bolumler: [
      {
        baslik: 'Trademarks and icons',
        paragraflar: [
          'Some brand icons that help identify subscription providers are from the Font Awesome Free package. Font Awesome is provided by Fonticons, Inc. under the CC BY 4.0 license: https://fontawesome.com',
          'Company and product names and logos shown are trademarks of their respective owners. Their display does not imply sponsorship or affiliation with Trinkow.',
        ],
      },
    ],
  },
};

export default function Legal() {
  const { dil } = useYerellestirme();
  const { belge } = useLocalSearchParams<{ belge?: string }>();
  const belgelerAktif = dil === 'en' ? belgelerEn : belgeler;
  const secili = belge ? belgelerAktif[belge] : null;

  return (
    <SettingsPage baslik={secili?.baslik ?? (dil === 'en' ? 'Legal documents' : 'Yasal belgeler')}>
      {secili ? (
        <>
          <InfoStrip
            variant={secili.taslak ? 'warning' : 'info'}
            icon="info"
            metin={secili.bilgi}
          />
          {secili.bolumler.map((bolum) => (
            <View key={bolum.baslik} style={{ gap: rhythm.group }}>
              <Txt role="h2">{bolum.baslik}</Txt>
              {bolum.paragraflar.map((paragraf) => (
                <Txt key={paragraf} role="body">{paragraf}</Txt>
              ))}
            </View>
          ))}
        </>
      ) : (
        Object.entries(belgelerAktif).map(([anahtar, belgeDetayi]) => (
          <Button
            key={anahtar}
            label={belgeDetayi.baslik}
            variant="ghost"
            onPress={() => router.push({ pathname: '/legal', params: { belge: anahtar } })}
          />
        ))
      )}
    </SettingsPage>
  );
}
