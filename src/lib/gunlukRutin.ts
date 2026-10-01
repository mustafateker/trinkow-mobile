/**
 * rev3-gunluk-rutin.md §5 (sıralama kuralı) · §5/6 (yükleniyor kilidi) —
 * Günlük'ün rutin hızlı eylem satırı için SAF mantık. RN/bileşen bağımlılığı
 * yok ki `tests/*.test.cjs` doğrudan yükleyebilsin (bkz. `tests/yukle.cjs`).
 */

/** Açık listede en çok kaç satır çizilir (§5/9 "Çok rutin"). */
export const GUNLUK_RUTIN_GORUNEN_LIMIT = 5;

export type RutinSiralamaGirdisi = {
  id: string;
  /** Mount anında bu rutin işaretli mi (yalnız "Aldım" — o an henüz vazgeçme olamaz). */
  isaretliMi: boolean;
  tutarKurus: number;
};

/**
 * Sıralama **yalnız** ≤5 rutinde HİÇ çalışmaz (kullanıcının `/rutinler`
 * sırası korunur); >5 rutinde işaretsizler önce, eşitlikte tutarı büyük olan
 * önce sıralanır. Çağıran bunu YALNIZ mount anında bir kez çağırmalı ve
 * sonucu dondurmalı — işaretleme sonrası yeniden çağrılırsa satır zıplar
 * (bağlayıcı kural, B4).
 */
export function rutinSiralamasi<T extends RutinSiralamaGirdisi>(rutinler: readonly T[]): T[] {
  if (rutinler.length <= GUNLUK_RUTIN_GORUNEN_LIMIT) return [...rutinler];
  return [...rutinler].sort((a, b) => {
    if (a.isaretliMi !== b.isaretliMi) return a.isaretliMi ? 1 : -1;
    return b.tutarKurus - a.tutarKurus;
  });
}

/** Bir satırın o anki durumu — idle · yazılıyor/işaretleniyor · aldı · vazgeçti. */
export type RutinSatirDurumu = 'isaretsiz' | 'aldi' | 'vazgecti' | 'aldimYaziliyor' | 'almadimIsaretleniyor';

/**
 * §5/6 — "Yazılıyor" durumunda dokunulan/dokunulmayan fark etmeksizin İKİ
 * düğme de kilitlenir (aynı güne iki çelişik işaret yazma yarışı önlenir).
 * "Aldım" işaretliyken "Almadım" pasif kalır; ancak `+` açık kalır çünkü
 * aynı rutin gün içinde birden fazla kez gerçekleşebilir.
 * §5/4 — "Almadım" işaretliyken "Aldım" ETKİN kalır (fikir değiştirebilir).
 */
export function rutinButonlariKilitli(durum: RutinSatirDurumu): { aldim: boolean; almadim: boolean } {
  switch (durum) {
    case 'aldimYaziliyor':
    case 'almadimIsaretleniyor':
      return { aldim: true, almadim: true };
    case 'aldi':
      return { aldim: false, almadim: true };
    case 'vazgecti':
    case 'isaretsiz':
    default:
      return { aldim: false, almadim: false };
  }
}

/**
 * `GET /butce/rutinler`'in döndürdüğü `vazgecilen_adet` GÜNÜN TAMAMI için mi
 * ("bu satır vazgeçti" göstermeye yeter) yoksa KISMİ mi (rev3-gunluk-
 * rutin.md §7: "Kısmi adet (2 kahveden 1'i) bu satırda ele alınmaz. Satırın
 * kapsamı 'bugünün rutini'dir ve gösterdiği tutar günün tam değeridir.")
 * karar verir.
 *
 * Karar (PM görev tanımı — kısmi durumu 'vazgecti' göstermek YASAK, çünkü
 * kullanıcıya "günün TAMAMINDAN vazgeçtin" diye yalan söyler):
 * `vazgecilen_adet < gunluk_adet` olan her durum bu fonksiyon için "hayır"
 * döner; çağıran taraf bunu 'isaretsiz' sayar. Kısmi bilgi bu satırda HİÇ
 * gösterilmez (adet görünmez, §7 sadeliği), yalnız yanlış bilgi verilmez —
 * kullanıcı "Almadım"a tekrar dokunursa sunucu zaten günün TAMAMINI yazar.
 */
export function tamGunVazgecildiMi(vazgecilenAdet: number, gunlukAdet: number): boolean {
  return gunlukAdet > 0 && vazgecilenAdet >= gunlukAdet;
}

/** `durum()`ün saf çekirdeği — sırasıyla yazılıyor > işaretleniyor > aldı (gerçek harcama kaydı, satın alma vazgeçmeyi HER ZAMAN geçersiz kılar) > tam gün vazgeçti > işaretsiz. */
export function rutinSatirDurumuHesapla(girdi: {
  yaziliyor: boolean;
  isaretleniyor: boolean;
  aldiMi: boolean;
  vazgecilenAdet: number;
  gunlukAdet: number;
}): RutinSatirDurumu {
  if (girdi.yaziliyor) return 'aldimYaziliyor';
  if (girdi.isaretleniyor) return 'almadimIsaretleniyor';
  if (girdi.aldiMi) return 'aldi';
  if (tamGunVazgecildiMi(girdi.vazgecilenAdet, girdi.gunlukAdet)) return 'vazgecti';
  return 'isaretsiz';
}

/**
 * "Almadım" dokunuşunun yazacağı adet — hâlihazırda GÜNÜN TAMAMI
 * işaretliyse (§5/7 "Geri alma") kaldırır (`0`), değilse günün tamamını
 * işaretler (`gunluk_adet`). Kısmi bir önceki değer varsa da (yarım yamalak
 * "kaldırma" yerine) yine tam gün yazılır — düğmenin tek anlamı budur.
 */
export function almadimYeniAdet(rutin: { vazgecilen_adet: number; gunluk_adet: number }): number {
  return tamGunVazgecildiMi(rutin.vazgecilen_adet, rutin.gunluk_adet) ? 0 : rutin.gunluk_adet;
}
