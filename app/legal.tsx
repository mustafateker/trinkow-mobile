import { useLocalSearchParams, router } from 'expo-router';
import { SettingsPage } from '@/components/SettingsPage';
import { Button } from '@/components/Button';
import { Txt } from '@/components/Txt';
import { InfoStrip } from '@/components/InfoStrip';
const belgeler: Record<string, { baslik: string; metin: string[] }> = {
  kosullar: { baslik: 'Kullanım şartları', metin: [
    'Trinkow, girdiğin gelir, gider ve alışkanlık bilgilerini düzenleyip hesaplanan bütçe ve tasarruf özetlerini gösterir. Gösterilen tutarlar bir banka hesabının bakiyesini veya yapılmış bir yatırımı temsil etmez.',
    'Hesabının erişim bilgilerini koru. Girdiğin bilgileri Günlük, Bütçem ve Rutinlerim ekranlarından kontrol edip düzeltebilirsin. Çıkış yapmak hesabını silmez.',
    'Hizmet sağlayıcının unvanı, iletişim bilgileri, sorumluluk hükümleri ve yürürlük koşulları tamamlanacaktır. Bu taslak henüz nihai kullanım sözleşmesi değildir.',
  ] },
  gizlilik: { baslik: 'Gizlilik politikası', metin: [
    'Uygulama e-posta, kimlik doğrulama bilgileri, kullanıcı tercihleri ve kaydettiğin gelir, gider, borç ve rutin bilgilerini işler. Şifren sunucuda hash olarak saklanır.',
    'Beni hatırla açıkken mobil cihazındaki oturum bilgileri işletim sisteminin güvenli deposunda tutulur. Kapalıyken oturum yalnız uygulamanın belleğinde tutulur. Şifre kurtarma için e-posta gönderimi kullanılır.',
    'Hesabını Ayarlar → Hesabımı sil üzerinden silebilirsin. Hizmet sağlayıcı, hizmet alınan taraflar, saklama süreleri ve başvuru iletişimi tamamlanmadan bu taslak nihai gizlilik politikası sayılmaz.',
  ] },
  aydinlatma: { baslik: 'KVKK aydınlatma metni', metin: [
    'Bu sayfa yayın öncesi hazırlanacak aydınlatma metni için ayrılmıştır. Veri sorumlusunun kimliği ve iletişim bilgileri henüz tanımlanmamıştır.',
    'Uygulamanın temel veri grupları: hesap bilgileri, bütçe/harcama kayıtları, alışkanlıklar ve kullanım tercihleridir. Bunlar oturum açma ve talep ettiğin bütçe hesaplarını göstermek için kullanılır.',
    'İşleme koşulları, alıcı grupları, saklama/aktarım bilgileri ve başvuru yöntemi hizmetin gerçek işletme bilgilerine göre tamamlanacaktır. Bu sayfa taslaktır; nihai aydınlatma yerine sunulmaz.',
  ] },
};
export default function Legal() {
  const { belge } = useLocalSearchParams<{ belge?: string }>();
  const secili = belge ? belgeler[belge] : null;
  return <SettingsPage baslik={secili?.baslik ?? 'Yasal belgeler'}>
    <InfoStrip variant="warning" icon="info" metin="Taslak • 23 Eylül 2026 • v0.1. İşletme bilgileri ve nihai metinler yayın öncesinde tamamlanacaktır." />
    {secili ? secili.metin.map((p) => <Txt key={p} role="body">{p}</Txt>) : Object.entries(belgeler).map(([anahtar, b]) => <Button key={anahtar} label={b.baslik} variant="ghost" onPress={() => router.push({ pathname: '/legal', params: { belge: anahtar } })} />)}
  </SettingsPage>;
}
