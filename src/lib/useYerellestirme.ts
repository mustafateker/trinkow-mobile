import { useSyncExternalStore } from 'react';

import {
  yerellestirmeAnlikDeger,
  yerellestirmeDegisimineAbone,
  yerellestirmeTercihi,
} from '@/lib/yerellestirme';

export function useYerellestirme() {
  useSyncExternalStore(
    yerellestirmeDegisimineAbone,
    yerellestirmeAnlikDeger,
    yerellestirmeAnlikDeger,
  );
  return yerellestirmeTercihi();
}

