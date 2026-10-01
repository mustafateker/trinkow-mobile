import { t } from '@/content/metinler';
import { toastGoster } from '@/lib/toastBus';

export function islemHatasiniGoster(): void {
  toastGoster({ tur: 'warning', metin: t['hata.okuma.govde'] });
}
