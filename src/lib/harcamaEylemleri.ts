import type { SQLiteDatabase } from 'expo-sqlite';

import { t, toastTekrarlandi } from '@/content/metinler';
import { harcamaEkle, harcamaSil, taksitSerisiSil, type Harcama } from '@/db/harcama';
import { paraYaz } from '@/lib/para';
import { gunAnahtari } from '@/lib/tarih';
import { toastGoster } from '@/lib/toastBus';
import { veriDegisti } from '@/lib/veriBus';

/**
 * K-029 — tek harcama silme: onaysız, anında + 6 sn'lik `undo` toast'ı.
 * E-12 (detay ekranı "Sil") ve E-10/E-14 satır kaydırması (Akış D) bu
 * TEK fonksiyonu paylaşır — mantık iki yerde yazılmaz.
 */
export async function harcamaTekilSilVeGeriAlSun(db: SQLiteDatabase, yedek: Harcama): Promise<void> {
  await harcamaSil(db, yedek.id);
  veriDegisti();
  toastGoster({
    tur: 'undo',
    metin: t['toast.silindi'],
    eylemEtiketi: t['toast.geri_al'],
    onEylem: async () => {
      await harcamaEkle(db, {
        tutarKurus: yedek.tutarKurus,
        kategori: yedek.kategori,
        urunAdi: yedek.urunAdi,
        zaman: yedek.zaman,
        gun: yedek.gun,
        odeme: yedek.odeme,
        notMetni: yedek.notMetni,
        taksitId: yedek.taksitId,
        taksitNo: yedek.taksitNo,
        taksitToplam: yedek.taksitToplam,
      });
      veriDegisti();
      toastGoster({ tur: 'info', metin: t['toast.geri_alindi'] });
    },
  });
}

/** E-13 — taksit serisi silme: onaylı (Dialog çağıranın sorumluluğunda), geri alma yok. */
export async function taksitSerisiSilVeToastGoster(db: SQLiteDatabase, taksitId: string): Promise<void> {
  await taksitSerisiSil(db, taksitId);
  veriDegisti();
  toastGoster({ tur: 'info', metin: t['toast.taksit_silindi'] });
}

/**
 * Akış C — "Latte Faktörü": aynı tutar/kategori/ödeme tipiyle BUGÜNE yeni,
 * taksitsiz tek kayıt. Not taşınmaz (yeni an, yeni bağlam); taksitli bir
 * kaynaktan tekrarlansa bile sonuç her zaman tek harcamadır. 6 sn geri al.
 */
export async function harcamaTekrarla(db: SQLiteDatabase, kaynak: Harcama): Promise<void> {
  const simdi = new Date();
  const yeniId = await harcamaEkle(db, {
    tutarKurus: kaynak.tutarKurus,
    kategori: kaynak.kategori,
    urunAdi: kaynak.urunAdi,
    zaman: simdi.toISOString(),
    gun: gunAnahtari(simdi),
    odeme: kaynak.odeme,
    notMetni: null,
    taksitId: null,
    taksitNo: null,
    taksitToplam: null,
  });
  veriDegisti();
  toastGoster({
    tur: 'undoInfo',
    metin: toastTekrarlandi(paraYaz(kaynak.tutarKurus)),
    eylemEtiketi: t['toast.geri_al'],
    onEylem: async () => {
      await harcamaSil(db, yeniId);
      veriDegisti();
      toastGoster({ tur: 'info', metin: t['toast.geri_alindi'] });
    },
  });
}
