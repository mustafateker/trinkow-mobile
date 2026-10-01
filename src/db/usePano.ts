import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import { gununHarcamalari, type Harcama, type KategoriDurumu } from '@/db/harcama';
import type { Niyet } from '@/db/profil';
import type { GunSeriBilgisi } from '@/db/seri';
import { ozetPanoGetir } from '@/lib/api';
import { gunAnahtari, gunEkle } from '@/lib/tarih';
import { veriDegisimineAbone } from '@/lib/veriBus';

export type PanoVerisi = {
  yukleniyor: boolean;
  hata: boolean;
  tarih: Date;
  /** F-11 — HeroCard kip çipi buna bağlanır (K-053 niyet, varsayılan 'takip'). */
  niyet: Niyet;
  gunFarki: number;
  /** null → günlük limit tanımsız (limitsiz kip) */
  limitKurus: number | null;
  harcananKurus: number;
  harcamalar: Harcama[];
  /** Yalnız `gunFarki === 0` için dolu — K-056/metinler.md §23.4 */
  kategoriler: KategoriDurumu[];
  /** Ay içindeki limit aşımı gün sayısı — imza kartının sayısı */
  ayAsimi: number;
  /** K-048 — bu günün seri durumu (hile kapısı + limit karşılaştırması) */
  seri: GunSeriBilgisi;
  /** K-049 sol sınır — bu gün ilk kaydın (veya kurulumun) günü mü */
  ilkGunMu: boolean;
};

const BOS_SERI: GunSeriBilgisi = {
  harcananKurus: 0,
  kayitAdedi: 0,
  harcamasizIsaretli: false,
  seriyeSayildiMi: null,
};

/**
 * Bir günün panosu (E-10 Günlük — K-049 sayfalama). `gunFarki` bugüne göre
 * kaydırma; 0 = bugün, negatif = geçmiş. Her sayfa kendi kancasını çağırır
 * (`FlatList` yalnız görünür sayfaları monte eder, bkz. `app/index.tsx`).
 *
 * BE-6c: toplam/limit durumu/kategori kırılımı/ay aşımı/seri/`ilkGunMu` artık
 * TEK bir `GET /ozet/pano` isteğiyle sunucudan gelir (K-068 — istemci bir
 * daha kendi toplamaz). Günün HAM kayıt listesi (satır satır göstermek için)
 * ayrıca `gununHarcamalari` ile çekilir — `ozet/pano` yanıtı bir liste
 * DÖNMEZ, yalnız aggregate alanlar döner (backend/README.md "ozet" bölümü).
 */
export function usePano(gunFarki = 0): PanoVerisi & { yenile: () => void } {
  const db = useSQLiteContext();
  const tarih = gunEkle(new Date(), gunFarki);
  const gun = gunAnahtari(tarih);
  const bugunMu = gunFarki === 0;

  const [veri, setVeri] = useState<PanoVerisi>({
    yukleniyor: true,
    hata: false,
    tarih,
    gunFarki,
    niyet: 'takip',
    limitKurus: null,
    harcananKurus: 0,
    harcamalar: [],
    kategoriler: [],
    ayAsimi: 0,
    seri: BOS_SERI,
    ilkGunMu: false,
  });

  const oku = useCallback(async () => {
    try {
      const [pano, harcamalar] = await Promise.all([ozetPanoGetir(gun), gununHarcamalari(db, gun)]);
      setVeri({
        yukleniyor: false,
        hata: false,
        tarih,
        gunFarki,
        niyet: (pano.niyet as Niyet) || 'takip',
        limitKurus: pano.limit_kurus,
        harcananKurus: pano.harcanan_kurus,
        harcamalar,
        // K-056/metinler.md §23.4 — kategori kartları yalnız BUGÜNÜN sayfasında.
        kategoriler: bugunMu
          ? pano.kategoriler.map((k) => ({
              kategori: k.kategori,
              limitKurus: k.limit_kurus,
              harcananKurus: k.harcanan_kurus,
              bugunKurus: k.bugun_kurus,
            }))
          : [],
        ayAsimi: pano.ay_asimi,
        seri: {
          harcananKurus: pano.seri.harcanan_kurus,
          kayitAdedi: pano.seri.kayit_adedi,
          harcamasizIsaretli: pano.seri.harcamasiz_isaretli,
          seriyeSayildiMi: pano.seri.seriye_sayildi_mi,
        },
        ilkGunMu: pano.ilk_gun_mu,
      });
    } catch {
      setVeri((o) => ({ ...o, yukleniyor: false, hata: true }));
    }
    // `tarih` her render'da yeni nesne olduğu için bağımlılık `gun`
  }, [db, gun, bugunMu, gunFarki]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void oku();
  }, [oku]);

  // Harcama ekle/sil/güncelle başka ekranda olsa da bu sayfa güncel kalsın.
  useEffect(() => veriDegisimineAbone(() => void oku()), [oku]);

  return { ...veri, yenile: () => void oku() };
}
