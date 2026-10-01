/**
 * Yay geometrisi — ../agency/projects/trinkow/docs/design/prototip-v3/01-bugun.html'deki SVG yollarının
 * üreticisi. Prototipteki sayılar birebir doğrulandı:
 *   r=86, başlangıç 135°, açıklık 270° → "M 51.19 172.81 A 86 86 0 1 1 172.82 172.80"
 */

const RAD = Math.PI / 180;

export function noktaBul(merkez: number, r: number, aciDeg: number) {
  return {
    x: merkez + r * Math.cos(aciDeg * RAD),
    y: merkez + r * Math.sin(aciDeg * RAD),
  };
}

/** Saat yönünde tek `A` komutlu yay yolu. */
export function yayYolu(merkez: number, r: number, baslangicDeg: number, acilimDeg: number): string {
  const bas = noktaBul(merkez, r, baslangicDeg);
  const son = noktaBul(merkez, r, baslangicDeg + acilimDeg);
  const buyukYay = acilimDeg > 180 ? 1 : 0;
  return `M ${bas.x.toFixed(2)} ${bas.y.toFixed(2)} A ${r} ${r} 0 ${buyukYay} 1 ${son.x.toFixed(2)} ${son.y.toFixed(2)}`;
}

/** Yay uzunluğu (dasharray hesapları için). */
export function yayUzunlugu(r: number, acilimDeg: number): number {
  return 2 * Math.PI * r * (acilimDeg / 360);
}
