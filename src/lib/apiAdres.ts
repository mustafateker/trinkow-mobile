/** Expo geliştirme sunucusunun bilgisayarı, telefondaki localhost değildir. */
export function apiAdresiniCoz(ozelAdres: string | undefined, hostUri: string | undefined, platform: string): string {
  if (ozelAdres?.trim()) return ozelAdres.trim().replace(/\/+$/, '');
  if (hostUri) {
    const host = new URL(hostUri.includes('://') ? hostUri : `http://${hostUri}`).hostname;
    if (host !== 'localhost' && host !== '127.0.0.1' && host !== '[::1]') return `http://${host}:8000`;
  }
  return platform === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
}
