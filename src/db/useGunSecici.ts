import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import { gunAraligiToplamlari } from '@/db/harcama';
import { gunSeriDurumu, ilkSinirGunu, type GunSeriDurumu } from '@/db/seri';
import { kullaniciProfiliGetir } from '@/lib/api';
import { ayAnahtari, ayGunSayisi, gunAnahtari, gunEkle, tarihtenGun } from '@/lib/tarih';
import { veriDegisimineAbone } from '@/lib/veriBus';

export type GunSeciciGunu = {
  tarih: Date;
  gun: number;
  durum: GunSeriDurumu;
  /** İlk kayıt gününden önce ya da bugünden sonra — dokunulamaz (K-049). */
  pasif: boolean;
  bugunMu: boolean;
};

export type GunSeciciOzeti = { kayitliGun: number; limitAltiGun: number; birikenKurus: number };

export type GunSeciciVerisi = {
  yukleniyor: boolean;
  hata: boolean;
  gunler: GunSeciciGunu[];
  ozet: GunSeciciOzeti;
  /** Geriye sınır — bu aydan öncesine gidilemez. */
  ilkAy: string;
  /** İleriye sınır — bu aydan sonrasına gidilemez (bugünün ayı). */
  enSonAy: string;
  limitKurus: number | null;
};

const BOS_OZET: GunSeciciOzeti = { kayitliGun: 0, limitAltiGun: 0, birikenKurus: 0 };

/**
 * E-24 Gün seçici — bir ayın ızgarası + özet istatistikleri.
 * "Biriken" formülü tokens.md §14.4: yalnız KAPANMIŞ (bugünden önceki) ve
 * limit altında kapanan günler toplanır; harcamasız-işaretli/kayıtsız
 * günler ve limit dışı günler toplama girmez.
 *
 * BE-6c: günlük limit `kullaniciProfiliGetir()`den (sunucu, BE-6a) gelir;
 * ay içindeki gün toplamları `gunAraligiToplamlari` ile ham kayıt listesinden
 * İSTEMCİDE gruplanır (sunucuda bu aralık için hazır bir uç yok, bkz.
 * `db/harcama.ts` başı) — sınıflandırmanın kendisi (`gunSeriDurumu`) saf ve
 * sunucudakiyle birebir aynı kuralı uygular.
 */
export function useGunSecici(ay: string): GunSeciciVerisi & { yenile: () => void } {
  const db = useSQLiteContext();
  const [veri, setVeri] = useState<GunSeciciVerisi>({
    yukleniyor: true,
    hata: false,
    gunler: [],
    ozet: BOS_OZET,
    ilkAy: ay,
    enSonAy: ay,
    limitKurus: null,
  });

  const oku = useCallback(async () => {
    try {
      const bugun = new Date();
      const bugunGun = gunAnahtari(bugun);
      const [profil, ilkGun] = await Promise.all([kullaniciProfiliGetir(), ilkSinirGunu(db)]);
      const limitKurus = profil.gunluk_limit_kurus;
      const gunSayisi = ayGunSayisi(ay);
      const ilkTarih = tarihtenGun(`${ay}-01`);
      const sonTarih = gunEkle(ilkTarih, gunSayisi - 1);
      const toplamlar = await gunAraligiToplamlari(db, gunAnahtari(ilkTarih), gunAnahtari(sonTarih));

      const gunler: GunSeciciGunu[] = [];
      let kayitliGun = 0;
      let limitAltiGun = 0;
      let birikenKurus = 0;
      for (let i = 0; i < gunSayisi; i += 1) {
        const tarih = gunEkle(ilkTarih, i);
        const anahtar = gunAnahtari(tarih);
        const pasif = anahtar < ilkGun || anahtar > bugunGun;
        const t = toplamlar.get(anahtar);
        const harcananKurus = t?.toplamKurus ?? 0;
        const kayitAdedi = t?.kayitAdedi ?? 0;

        if (kayitAdedi > 0) {
          kayitliGun += 1;
          if (limitKurus !== null && harcananKurus <= limitKurus) {
            limitAltiGun += 1;
            // §14.4 — yalnız kapanmış (bugünden önceki) günler toplama girer.
            if (anahtar < bugunGun) birikenKurus += limitKurus - harcananKurus;
          }
        }

        gunler.push({
          tarih,
          gun: tarih.getDate(),
          durum: gunSeriDurumu(harcananKurus, kayitAdedi, limitKurus),
          pasif,
          bugunMu: anahtar === bugunGun,
        });
      }

      setVeri({
        yukleniyor: false,
        hata: false,
        gunler,
        ozet: { kayitliGun, limitAltiGun, birikenKurus },
        ilkAy: ayAnahtari(tarihtenGun(ilkGun)),
        enSonAy: ayAnahtari(bugun),
        limitKurus,
      });
    } catch {
      setVeri((o) => ({ ...o, yukleniyor: false, hata: true }));
    }
  }, [db, ay]);

  useEffect(() => {
    void oku();
  }, [oku]);
  useEffect(() => veriDegisimineAbone(() => void oku()), [oku]);

  return { ...veri, yenile: () => void oku() };
}
