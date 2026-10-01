/**
 * D-2c-2 — Ayarlar E-19 Hesap bölümünün gerçek eylemleri (D-2c-1'in
 * yalnız-görünüm iskeleti burada dolduruldu). Backend: kendi `auth`
 * modülümüz, JWT ile (K-068 — Supabase düştü).
 *
 * `oturumuKapat`: yenileme token'ını sunucuda iptal eder (`/auth/cikis`)
 * + yerel `oturum` kaydını siler. Sunucuya ulaşılamasa BİLE yerel çıkış
 * tamamlanır — kullanıcı cihazında hapis kalmaz (yenileme token'ı zaten
 * kısa TTL'li, kendiliğinden düşer). Harcama verisi SİLİNMEZ
 * (metinler.md §25.4 "Çıkınca kayıtların sende kalır.").
 *
 * `hesabiSil`: `/auth/hesap` (DELETE) — geri alınamaz (App Store 5.1.1(v)).
 * Başarısız olursa (ağ/sunucu) hata yukarı fırlatılır; `app/ayarlar.tsx`
 * dialoğu açık tutar, hesap yerelde "silinmiş" gibi göstermeyiz. Yerel
 * harcama verisi burada da SİLİNMEZ — hesap ve veri iki ayrı kapıdır (K-029).
 */
import { hesapSilIstegi, oturumKapatIstegi } from '@/lib/api';
import { oturumOku, oturumSil } from '@/lib/oturumDeposu';

export async function oturumuKapat(): Promise<void> {
  const oturum = await oturumOku();
  if (oturum) {
    try {
      await oturumKapatIstegi(oturum.yenilemeTokeni);
    } catch {
      // bkz. üstteki not — yerel çıkış yine de tamamlanır.
    }
  }
  await oturumSil();
}

export async function hesabiSil(): Promise<void> {
  await hesapSilIstegi();
  await oturumSil();
}
