import { t } from '@/content/metinler';
import type { Niyet } from '@/db/profil';

/**
 * `app/onboarding.tsx`dan çıkarıldı (test edilebilirlik — niyet↔metin
 * eşleşmesi sessizce bozulabilecek bir yer). Davranış DEĞİŞMEDİ, yalnız
 * konum: adım 2 hedef alanı etiketi ve adım 4 özet açıklaması burada.
 * Değerler getter: her okunuşta AKTİF dilin metnini verir.
 */
export const HEDEF_ETIKET_ALAN: Record<Niyet, string> = {
  get tasarruf() { return t['alan.hedef.tasarruf']; },
  get borc() { return t['alan.hedef.borc']; },
  get takip() { return t['alan.hedef.takip']; },
};

export const OZET_ACIKLAMA: Record<Niyet, string> = {
  get tasarruf() { return t['ob.ozet.aciklama.tasarruf']; },
  get borc() { return t['ob.ozet.aciklama.borc']; },
  get takip() { return t['ob.ozet.aciklama.takip']; },
};
