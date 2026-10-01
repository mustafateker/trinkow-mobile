import { t } from '@/content/metinler';
import type { Niyet } from '@/db/profil';

/**
 * `app/onboarding.tsx`dan çıkarıldı (test edilebilirlik — niyet↔metin
 * eşleşmesi sessizce bozulabilecek bir yer). Davranış DEĞİŞMEDİ, yalnız
 * konum: adım 2 hedef alanı etiketi ve adım 4 özet açıklaması burada.
 */
export const HEDEF_ETIKET_ALAN: Record<Niyet, string> = {
  tasarruf: t['alan.hedef.tasarruf'],
  borc: t['alan.hedef.borc'],
  takip: t['alan.hedef.takip'],
};

export const OZET_ACIKLAMA: Record<Niyet, string> = {
  tasarruf: t['ob.ozet.aciklama.tasarruf'],
  borc: t['ob.ozet.aciklama.borc'],
  takip: t['ob.ozet.aciklama.takip'],
};
