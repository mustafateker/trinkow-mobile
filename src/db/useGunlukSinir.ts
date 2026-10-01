import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { ilkSinirGunu } from '@/db/seri';
import { gunFarkiHesapla, tarihtenGun } from '@/lib/tarih';
import { veriDegisimineAbone } from '@/lib/veriBus';

/**
 * K-049 sol sınır — Günlük sekmesinin en eski sayfası (ilk kayıt/kurulum
 * günü). `app/index.tsx` bunu bir kez okuyup sayfalama dizisini kurar.
 */
export function useGunlukSinir(): { enEskiGunFarki: number; hazir: boolean } {
  const db = useSQLiteContext();
  const [durum, setDurum] = useState({ enEskiGunFarki: 0, hazir: false });

  useEffect(() => {
    let canli = true;
    async function oku() {
      try {
        const ilkGun = await ilkSinirGunu(db);
        const fark = Math.min(gunFarkiHesapla(tarihtenGun(ilkGun), new Date()), 0);
        if (canli) setDurum({ enEskiGunFarki: fark, hazir: true });
      } catch {
        // Pano kendi hata/yeniden deneme durumunu gösterir; sayfalama kilitlenmez.
        if (canli) setDurum((onceki) => ({ ...onceki, hazir: true }));
      }
    }
    void oku();
    const ayril = veriDegisimineAbone(() => void oku());
    return () => { canli = false; ayril(); };
  }, [db]);

  return durum;
}
