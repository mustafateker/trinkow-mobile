import { QueryClient } from '@tanstack/react-query';

const OTUZ_SANIYE = 30_000;
const BES_DAKIKA = 5 * 60_000;
const YIRMI_DORT_SAAT = 24 * 60 * 60_000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: OTUZ_SANIYE,
      gcTime: 30 * 60_000,
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
});

export function apiStaleTime(yol: string): number {
  if (yol.startsWith('/katalog') || yol === '/auth/google/yapilandirma') return YIRMI_DORT_SAAT;
  if (
    yol.startsWith('/kullanici/profil')
    || yol.startsWith('/kullanici/tercihler')
    || yol === '/butce'
    || yol.startsWith('/butce?')
    || yol === '/auth/ben'
  ) return BES_DAKIKA;
  return OTUZ_SANIYE;
}

type ApiQueryKey = readonly ['api', string, string];

function apiYolu(queryKey: readonly unknown[]): string {
  return (queryKey as ApiQueryKey)[2] ?? '';
}

function gunleIlgiliMi(yol: string, gun: string): boolean {
  const soru = yol.indexOf('?');
  if (soru < 0) return true;
  const kok = yol.slice(0, soru);
  const parametreler = new URLSearchParams(yol.slice(soru + 1));
  if (kok === '/ozet/seri') return true;
  const tekGun = parametreler.get('gun');
  if (tekGun) return tekGun === gun;
  const baslangic = parametreler.get('baslangic_gun') ?? parametreler.get('baslangic');
  const bitis = parametreler.get('bitis_gun') ?? parametreler.get('bitis');
  if (baslangic && bitis) return baslangic <= gun && gun <= bitis;
  const ay = parametreler.get('ay');
  if (ay) return gun.startsWith(ay);
  return true;
}

export async function mutasyonSonrasiOnbellekGecersizKil(yol: string, govde?: unknown): Promise<void> {
  if (yol.startsWith('/auth/')) {
    if (yol === '/auth/cikis' || yol === '/auth/hesap') queryClient.clear();
    return;
  }

  const girdi = (govde ?? {}) as Record<string, unknown>;
  const degisenGun = yol === '/harcama/taksit-serisi'
    ? null
    : typeof girdi.gun === 'string'
    ? girdi.gun
    : typeof girdi.ilk_gun === 'string' ? girdi.ilk_gun : null;
  const kokler = yol.startsWith('/harcama')
    ? ['/harcama', '/ozet', '/tasarruf', '/butce/rutinler', '/butce/sik-kullanilanlar']
    : yol.startsWith('/butce')
      ? ['/butce', '/ozet', '/tasarruf', '/kullanici/profil']
      : yol.startsWith('/tasarruf')
        ? ['/tasarruf']
        : yol.startsWith('/kullanici')
          ? ['/kullanici', '/butce', '/ozet', '/tasarruf']
          : [];

  await queryClient.invalidateQueries({
    predicate: (query) => {
      const aday = apiYolu(query.queryKey);
      if (!kokler.some((kok) => aday.startsWith(kok))) return false;
      return !degisenGun || gunleIlgiliMi(aday, degisenGun);
    },
    refetchType: 'none',
  });
}

export function oturumOnbelleginiTemizle(): void {
  queryClient.clear();
}
