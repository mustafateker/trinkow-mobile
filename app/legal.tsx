import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { InfoStrip } from '@/components/InfoStrip';
import { SettingsPage } from '@/components/SettingsPage';
import { Txt } from '@/components/Txt';
import { gizlilikDiller } from '@/content/legal/gizlilik';
import { kosullarDiller, type Belge } from '@/content/legal/kosullar';
import { t } from '@/content/metinler';
import { useYerellestirme } from '@/lib/useYerellestirme';
import { rhythm } from '@/theme/tokens';

const VERI_SORUMLUSU = 'Triworkster';
const ILETISIM = 'trinkow@gmail.com';
const YURURLUK_TARIHI = '28 Ekim 2026';
const YURURLUK_TARIHI_EN = 'October 28, 2026';

const belgeler: Record<string, Belge> = {
  kosullar: kosullarDiller.tr,
  gizlilik: gizlilikDiller.tr,
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
          'Hesap ve kimlik doğrulama bilgileri; profil, bütçe, harcama, borç, birikim, abonelik, rutin ve tercih kayıtları; Premium üyelik ve satın alma kayıtları; güvenlik ve temel sunucu erişim kayıtları işlenir. Amaçlar hesabı ve talep edilen finansal planlama özelliklerini sunmak, Premium üyeliği sağlamak, güvenliği sağlamak, destek vermek ve hukuki yükümlülükleri yerine getirmektir.',
        ],
      },
      {
        baslik: 'Toplama yöntemi, hukuki sebep ve aktarım',
        paragraflar: [
          'Veriler uygulamadaki girişlerin, hesap işlemlerin, Google ile giriş tercihin ve Premium satın almalarında mağaza ile RevenueCat üzerinden otomatik veya kısmen otomatik yollarla toplanır. İşleme; sözleşmenin kurulması veya ifası, hukuki yükümlülük ve meşru menfaat sebeplerine; gerekli hâllerde açık rızaya dayanır.',
          'Veriler, hizmetin çalışması için gerekli ölçüde barındırma ve veritabanı, e-posta iletim, Google kimlik doğrulama ve uygulama içi satın alma altyapısı RevenueCat sağlayıcılarına; Premium ödemelerinde Google Play veya App Store’a; hukuki zorunluluk hâlinde yetkili kamu kurumlarına aktarılabilir. Bu sağlayıcıların altyapıları nedeniyle yurt dışına aktarım söz konusu olabilir.',
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

const belgelerEn: Record<string, Belge> = {
  kosullar: kosullarDiller.en,
  gizlilik: gizlilikDiller.en,
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
          'Account and authentication information; profile, budget, expense, debt, savings, subscription, routine, and preference records; Premium membership and purchase records; and security and basic server access logs are processed. The purposes are to provide your account and requested financial planning features, provide Premium membership, maintain security, provide support, and meet legal obligations.',
        ],
      },
      {
        baslik: 'Collection, legal basis, and transfers',
        paragraflar: [
          'Data is collected automatically or partly automatically through your app entries, account actions, your choice to sign in with Google, and, for Premium purchases, the store and RevenueCat. Processing is based on establishing or performing a contract, legal obligations, legitimate interests, and, where required, explicit consent.',
          'To the extent necessary to operate the service, data may be transferred to hosting and database, email delivery, Google authentication, and RevenueCat in-app purchase providers, and to Google Play or the App Store for Premium payments; it may also be transferred to competent public authorities where legally required. The infrastructure of these providers may involve transfers abroad.',
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
  // 11 dilde tam Kullanım Şartları ve Gizlilik Politikası: kullanıcının seçili dilinde açılır
  const kosullarAktif = kosullarDiller[dil] ?? kosullarDiller.en ?? kosullarDiller.tr;
  const gizlilikAktif = gizlilikDiller[dil] ?? gizlilikDiller.en ?? gizlilikDiller.tr;
  const tabanBelgeler = dil === 'tr' ? belgeler : belgelerEn;
  const belgelerAktif: Record<string, Belge> = {
    ...tabanBelgeler,
    kosullar: kosullarAktif,
    gizlilik: gizlilikAktif,
  };
  const secili = belge ? belgelerAktif[belge] : null;

  return (
    <SettingsPage baslik={secili?.baslik ?? t['legal.baslik']}>
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
