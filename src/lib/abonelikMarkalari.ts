export type SubscriptionBrandGroup =
  | 'video'
  | 'muzik'
  | 'yapay-zeka'
  | 'is'
  | 'oyun'
  | 'saglik'
  | 'egitim'
  | 'diger';

export type SubscriptionBrand = {
  id: string;
  ad: string;
  grup: SubscriptionBrandGroup;
  renk?: string;
  monogram?: string;
  eslesenAdlar?: readonly string[];
};

export const ABONELIK_MARKALARI = [
  { id: 'netflix', ad: 'Netflix', grup: 'video', renk: '#E50914', monogram: 'N' },
  { id: 'amazon-prime', ad: 'Prime Video', grup: 'video', renk: '#00A8E1', monogram: 'P', eslesenAdlar: ['amazon prime', 'prime'] },
  { id: 'disney-plus', ad: 'Disney+', grup: 'video', renk: '#113CCF', monogram: 'D+' },
  { id: 'max', ad: 'Max', grup: 'video', renk: '#002BE7', monogram: 'max', eslesenAdlar: ['hbo max'] },
  { id: 'youtube-premium', ad: 'YouTube Premium', grup: 'video', renk: '#FF0000', monogram: 'YT', eslesenAdlar: ['youtube'] },
  { id: 'hulu', ad: 'Hulu', grup: 'video', renk: '#1CE783', monogram: 'hulu' },
  { id: 'apple-tv-plus', ad: 'Apple TV+', grup: 'video', renk: '#111111', monogram: 'tv+' },
  { id: 'paramount-plus', ad: 'Paramount+', grup: 'video', renk: '#0064FF', monogram: 'P+' },
  { id: 'peacock', ad: 'Peacock', grup: 'video', renk: '#111111', monogram: 'P' },
  { id: 'crunchyroll', ad: 'Crunchyroll', grup: 'video', renk: '#F47521', monogram: 'C' },
  { id: 'discovery-plus', ad: 'Discovery+', grup: 'video', renk: '#006CFF', monogram: 'd+' },
  { id: 'mubi', ad: 'MUBI', grup: 'video', renk: '#111111', monogram: 'M' },
  { id: 'dazn', ad: 'DAZN', grup: 'video', renk: '#111111', monogram: 'DAZN' },
  { id: 'exxen', ad: 'Exxen', grup: 'video', renk: '#F4B400', monogram: 'E' },
  { id: 'gain', ad: 'GAİN', grup: 'video', renk: '#E51B42', monogram: 'G' },
  { id: 'tod', ad: 'TOD', grup: 'video', renk: '#6F2CFF', monogram: 'TOD' },

  { id: 'spotify', ad: 'Spotify', grup: 'muzik', renk: '#1DB954', monogram: 'S' },
  { id: 'apple-music', ad: 'Apple Music', grup: 'muzik', renk: '#FA243C', monogram: '♪' },
  { id: 'youtube-music', ad: 'YouTube Music', grup: 'muzik', renk: '#FF0000', monogram: 'YT' },
  { id: 'amazon-music', ad: 'Amazon Music', grup: 'muzik', renk: '#25D1DA', monogram: 'a' },
  { id: 'audible', ad: 'Audible', grup: 'muzik', renk: '#F7991C', monogram: 'A' },
  { id: 'tidal', ad: 'TIDAL', grup: 'muzik', renk: '#111111', monogram: 'T' },
  { id: 'deezer', ad: 'Deezer', grup: 'muzik', renk: '#A238FF', monogram: 'D' },
  { id: 'soundcloud-go', ad: 'SoundCloud Go', grup: 'muzik', renk: '#FF5500', monogram: 'SC', eslesenAdlar: ['soundcloud'] },

  { id: 'chatgpt', ad: 'ChatGPT', grup: 'yapay-zeka', renk: '#10A37F', monogram: 'AI', eslesenAdlar: ['openai', 'chatgpt plus', 'chatgpt pro'] },
  { id: 'gemini', ad: 'Gemini', grup: 'yapay-zeka', renk: '#6E5AE6', monogram: 'G', eslesenAdlar: ['google gemini', 'google ai'] },
  { id: 'claude', ad: 'Claude', grup: 'yapay-zeka', renk: '#D97757', monogram: 'C', eslesenAdlar: ['anthropic', 'claude pro'] },
  { id: 'perplexity', ad: 'Perplexity', grup: 'yapay-zeka', renk: '#20808D', monogram: 'P', eslesenAdlar: ['perplexity pro'] },
  { id: 'microsoft-copilot', ad: 'Microsoft Copilot', grup: 'yapay-zeka', renk: '#6750A4', monogram: 'Co', eslesenAdlar: ['copilot pro'] },
  { id: 'midjourney', ad: 'Midjourney', grup: 'yapay-zeka', renk: '#111111', monogram: 'MJ' },

  { id: 'google-one', ad: 'Google One', grup: 'is', renk: '#4285F4', monogram: 'G1', eslesenAdlar: ['google drive'] },
  { id: 'apple-one', ad: 'Apple One', grup: 'is', renk: '#111111', monogram: 'A1' },
  { id: 'icloud-plus', ad: 'iCloud+', grup: 'is', renk: '#147EFB', monogram: 'iC', eslesenAdlar: ['icloud', 'apple icloud'] },
  { id: 'microsoft-365', ad: 'Microsoft 365', grup: 'is', renk: '#5E5CE6', monogram: 'M', eslesenAdlar: ['office 365'] },
  { id: 'adobe-creative-cloud', ad: 'Adobe Creative Cloud', grup: 'is', renk: '#EB1000', monogram: 'A', eslesenAdlar: ['adobe'] },
  { id: 'canva-pro', ad: 'Canva Pro', grup: 'is', renk: '#7D2AE8', monogram: 'C', eslesenAdlar: ['canva'] },
  { id: 'dropbox', ad: 'Dropbox', grup: 'is', renk: '#0061FF', monogram: 'D' },
  { id: 'notion', ad: 'Notion', grup: 'is', renk: '#111111', monogram: 'N' },
  { id: 'github-copilot', ad: 'GitHub Copilot', grup: 'is', renk: '#24292F', monogram: 'GH', eslesenAdlar: ['github'] },

  { id: 'playstation-plus', ad: 'PlayStation Plus', grup: 'oyun', renk: '#0070D1', monogram: 'PS', eslesenAdlar: ['playstation+', 'ps plus'] },
  { id: 'xbox-game-pass', ad: 'Xbox Game Pass', grup: 'oyun', renk: '#107C10', monogram: 'X', eslesenAdlar: ['game pass', 'xbox'] },
  { id: 'nintendo-switch-online', ad: 'Nintendo Switch Online', grup: 'oyun', renk: '#E60012', monogram: 'NSO', eslesenAdlar: ['nintendo online'] },
  { id: 'ea-play', ad: 'EA Play', grup: 'oyun', renk: '#FF4747', monogram: 'EA' },
  { id: 'ubisoft-plus', ad: 'Ubisoft+', grup: 'oyun', renk: '#006EF5', monogram: 'U+' },
  { id: 'geforce-now', ad: 'GeForce NOW', grup: 'oyun', renk: '#76B900', monogram: 'GFN', eslesenAdlar: ['nvidia geforce now'] },

  { id: 'strava', ad: 'Strava', grup: 'saglik', renk: '#FC4C02', monogram: 'S' },
  { id: 'headspace', ad: 'Headspace', grup: 'saglik', renk: '#F47D31', monogram: 'H' },
  { id: 'calm', ad: 'Calm', grup: 'saglik', renk: '#4D9DE0', monogram: 'C' },

  { id: 'duolingo-super', ad: 'Super Duolingo', grup: 'egitim', renk: '#58CC02', monogram: 'D', eslesenAdlar: ['duolingo'] },
  { id: 'coursera-plus', ad: 'Coursera Plus', grup: 'egitim', renk: '#0056D2', monogram: 'C', eslesenAdlar: ['coursera'] },
  { id: 'skillshare', ad: 'Skillshare', grup: 'egitim', renk: '#00B86B', monogram: 'S' },
  { id: 'masterclass', ad: 'MasterClass', grup: 'egitim', renk: '#D81F26', monogram: 'M' },

  { id: 'diger', ad: 'Diğer', grup: 'diger', monogram: '+' },
] as const satisfies readonly SubscriptionBrand[];

export type SubscriptionBrandId = (typeof ABONELIK_MARKALARI)[number]['id'];
const ABONELIK_MARKA_LISTESI: readonly SubscriptionBrand[] = ABONELIK_MARKALARI;
const ESKI_SAGLAYICI_KODLARI: Readonly<Record<string, SubscriptionBrandId>> = {
  youtube: 'youtube-premium',
  apple: 'apple-one',
  adobe: 'adobe-creative-cloud',
  canva: 'canva-pro',
};

export const POPULER_ABONELIK_IDS: readonly SubscriptionBrandId[] = [
  'netflix',
  'amazon-prime',
  'disney-plus',
  'youtube-premium',
  'spotify',
  'apple-music',
  'chatgpt',
  'google-one',
  'microsoft-365',
  'adobe-creative-cloud',
  'playstation-plus',
  'xbox-game-pass',
];

export const ABONELIK_MARKA_GRUPLARI: ReadonlyArray<{ id: SubscriptionBrandGroup; baslik: string }> = [
  { id: 'video', baslik: 'Dizi ve video' },
  { id: 'muzik', baslik: 'Müzik ve ses' },
  { id: 'yapay-zeka', baslik: 'Yapay zekâ' },
  { id: 'is', baslik: 'Bulut ve üretkenlik' },
  { id: 'oyun', baslik: 'Oyun' },
  { id: 'saglik', baslik: 'Sağlık ve spor' },
  { id: 'egitim', baslik: 'Eğitim' },
  { id: 'diger', baslik: 'Diğer' },
];

function aramaAnahtari(deger: string) {
  return deger
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .toLocaleLowerCase('en-US')
    .trim();
}

export function abonelikMarkalariniAra(arama: string): SubscriptionBrand[] {
  const parcalar = aramaAnahtari(arama).split(/\s+/).filter(Boolean);
  if (parcalar.length === 0) return [];
  return ABONELIK_MARKA_LISTESI.filter((marka) => {
    if (marka.id === 'diger') return false;
    const anahtar = aramaAnahtari([marka.ad, marka.id, ...(marka.eslesenAdlar ?? [])].join(' '));
    return parcalar.every((parca) => anahtar.includes(parca));
  });
}

export function populerAbonelikMarkalari(): SubscriptionBrand[] {
  return POPULER_ABONELIK_IDS.map((id) => ABONELIK_MARKA_LISTESI.find((marka) => marka.id === id)!);
}

export function abonelikMarkasiBul(saglayici: string | null | undefined, ad: string): SubscriptionBrand {
  const kodla = ABONELIK_MARKA_LISTESI.find((marka) => marka.id === saglayici);
  if (kodla) return kodla;
  const eskiKodla = saglayici ? ESKI_SAGLAYICI_KODLARI[saglayici] : undefined;
  if (eskiKodla) return ABONELIK_MARKA_LISTESI.find((marka) => marka.id === eskiKodla)!;
  const aranan = aramaAnahtari(ad);
  if (aranan) {
    const adla = ABONELIK_MARKA_LISTESI.find((marka) =>
      marka.id !== 'diger' && [marka.ad, ...(marka.eslesenAdlar ?? [])]
        .some((etiket) => aranan.includes(aramaAnahtari(etiket))));
    if (adla) return adla;
  }
  return ABONELIK_MARKA_LISTESI.find((marka) => marka.id === 'diger')!;
}
