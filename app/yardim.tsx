import { SettingsPage } from '@/components/SettingsPage';
import { Txt } from '@/components/Txt';
export default function Yardim() {
  return <SettingsPage baslik="Yardım ve sık sorulanlar">
    <Txt role="h2">Harcama nasıl eklenir?</Txt>
    <Txt role="body">Artı düğmesine dokun, kategori ve tutarı seçip kaydet. Sık kullanılan bir ürünü seçtiğinde son fiyatı dolar; kaydetmeden önce değiştirebilirsin.</Txt>
    <Txt role="h2">Tasarruf tutarı neyi gösterir?</Txt>
    <Txt role="body">Kaydettiğin gelir ve giderlerden hesaplanan kalan tutarı görürsün. Rutin harcamalarındaki fark ayrıca gösterilir ve toplama ikinci kez eklenmez. Bu tutar banka bakiyen değildir.</Txt>
    <Txt role="h2">Limit değiştirince geçmiş değişir mi?</Txt>
    <Txt role="body">Yeni limit düzenlediğin günden itibaren uygulanır. Önceki günlerin limitleri korunur.</Txt>
    <Txt role="h2">Şifremi unuttum</Txt>
    <Txt role="body">Giriş ekranındaki Şifremi unuttum bağlantısıyla e-postana yenileme bağlantısı iste. Bağlantı 30 dakika geçerlidir ve bir kez kullanılabilir.</Txt>
    <Txt role="h2">Hesabımı nasıl silerim?</Txt>
    <Txt role="body">Ayarlar → Hesabımı sil sayfasını aç. Silme işlemi hesabını ve kayıtlarını kaldırır; geri alınamaz. Çıkış yapmak kayıtlarını silmez.</Txt>
    <Txt role="h2">Destek</Txt>
    <Txt role="body">Destek iletişim adresi henüz tanımlanmamıştır. Sorun bildirirken şifreni veya şifre yenileme bağlantını paylaşma.</Txt>
  </SettingsPage>;
}
