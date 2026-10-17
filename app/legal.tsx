import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { InfoStrip } from '@/components/InfoStrip';
import { SettingsPage } from '@/components/SettingsPage';
import { Txt } from '@/components/Txt';
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
const YURURLUK_TARIHI = '17 Ekim 2026';

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
      'Trinkow banka/kredi kartı numarası, banka giriş bilgisi, kesin konum, rehber, kamera, mikrofon, fotoğraf veya reklam kimliği toplamaz.',
    ],
  },
  {
    baslik: '3. Verilerin toplanması ve saklanması',
    paragraflar: [
      'Veriler doğrudan uygulamada yaptığın girişlerden, hesap işlemlerinden ve Google ile giriş sırasında Google tarafından sağlanan kimlik bilgilerinden elektronik ortamda elde edilir.',
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

export default function Legal() {
  const { belge } = useLocalSearchParams<{ belge?: string }>();
  const secili = belge ? belgeler[belge] : null;

  return (
    <SettingsPage baslik={secili?.baslik ?? 'Yasal belgeler'}>
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
        Object.entries(belgeler).map(([anahtar, belgeDetayi]) => (
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
