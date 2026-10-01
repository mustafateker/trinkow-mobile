import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import { seriGorunumuGetir, type GunSeriDurumu, type SeriDurumu } from '@/db/seri';
import { haftaAraligi, tarihtenGun } from '@/lib/tarih';
import { veriDegisimineAbone } from '@/lib/veriBus';

export type SeriIzgaraGunu = { gun: number; anahtar: string; durum: GunSeriDurumu };

export type SeriEkraniVerisi = {
  yukleniyor: boolean;
  hata: boolean;
  durum: SeriDurumu | null;
  izgara: SeriIzgaraGunu[];
  pencereEtiketi: string;
};

/**
 * E-21 Seri ekranı — seri durumu + son 30 günün ızgarası (K-048+K-064/1).
 * BE-6c: hesabın TAMAMI `GET /ozet/seri`den (`db/seri.ts#seriGorunumuGetir`)
 * gelir — istemcide bir daha "son 4 hafta" toplama yapılmaz. Pencere artık
 * sunucunun sabitlediği 30 gün (bugün DAHİL, önceki 28 günlük/"bugün hariç"
 * pencereden FARKLI — bkz. rapor "sapmalar").
 */
export function useSeriEkrani(): SeriEkraniVerisi & { yenile: () => void } {
  const db = useSQLiteContext();
  const [veri, setVeri] = useState<SeriEkraniVerisi>({
    yukleniyor: true,
    hata: false,
    durum: null,
    izgara: [],
    pencereEtiketi: '',
  });

  const oku = useCallback(async () => {
    try {
      const { durum, izgara: hamIzgara } = await seriGorunumuGetir(db);
      const izgara: SeriIzgaraGunu[] = hamIzgara.map((h) => ({
        gun: tarihtenGun(h.gun).getDate(),
        anahtar: h.gun,
        durum: h.durum,
      }));
      const pencereEtiketi =
        izgara.length > 0
          ? haftaAraligi(tarihtenGun(izgara[0].anahtar), tarihtenGun(izgara[izgara.length - 1].anahtar))
          : '';
      setVeri({ yukleniyor: false, hata: false, durum, izgara, pencereEtiketi });
    } catch {
      setVeri((o) => ({ ...o, yukleniyor: false, hata: true }));
    }
  }, [db]);

  useEffect(() => {
    void oku();
  }, [oku]);
  useEffect(() => veriDegisimineAbone(() => void oku()), [oku]);

  return { ...veri, yenile: () => void oku() };
}
