/**
 * Tarih biçimleri — prototipteki "10 Eylül Perşembe" ve "08.20" düzeni.
 * Ay/gün adları ve biçimler aktif dilden gelir (`src/i18n`); aşağıdaki
 * diziler dil değişince YERİNDE güncellenir, render anında okunmalıdır.
 */
import { gunBulunma, gunIyelik, metin, t, takvim } from '@/i18n/cekirdek';

/** Haftanın günleri, Pazar ilk ("Pazar", "Pazartesi" …). */
export const GUNLER: readonly string[] = takvim.gunler;

/** "Pt · Sa · Ça …" — E-24 ay ızgarası hafta başlığı (Pazartesi başlangıçlı). */
export const HAFTA_GUN_MIKRO: readonly string[] = takvim.haftaGunMikro;

/** Ay ızgarası hafta başlığı, Pazartesi başlangıçlı — aktif dilde. */
export function haftaGunMikro(): string[] {
  return [...takvim.haftaGunMikro];
}

/** "Eyl" — `DayBox` ay kısaltması (E-15). */
export function ayKisaAdi(d: Date): string {
  return takvim.aylarKisa[d.getMonth()];
}

/** "Pzt" · "Sal" · … — E-16 sütun grafiği gün etiketleri (Pazartesi başlangıçlı). */
export const HAFTA_GUN_KISA: readonly string[] = takvim.haftaGunKisa;

/** "10 Eylül Perşembe" */
export function uzunTarih(d: Date): string {
  return metin('tarih.uzun', { gun: d.getDate(), ay: takvim.aylarTarih[d.getMonth()], haftaGunu: takvim.gunler[d.getDay()] });
}

/**
 * F-15 gün sınırı — "bugün" kaçta biter. Ayarlar'daki tercih (D-2c-1b);
 * `gunAnahtari` senkron çalıştığı için db'den okunan değer burada
 * ÖNBELLEKLENİR. Uygulama açılışında ve Ayarlar'da değiştiği anda
 * `gunSiniriSaatiniAyarla` ile güncellenir (bkz. `app/_layout.tsx`,
 * `db/ayarTercihleri.ts#gunSiniriKaydet`). Varsayılan 0 = gece yarısı,
 * yani tercih hiç yüklenmemişse eski (değişmeyen) davranış korunur.
 */
let gunSiniriSaatiOnbellek: 0 | 3 | 6 = 0;

export function gunSiniriSaatiniAyarla(saat: 0 | 3 | 6): void {
  gunSiniriSaatiOnbellek = saat;
}

/**
 * Yerel gün anahtarı: "2026-09-12" (SQLite'ta gün bazlı sorgu için).
 * Gün sınırı 0'dan büyükse ve saat henüz sınıra ulaşmadıysa (örn. 01.00,
 * sınır 03.00) gün bir önceki takvim gününe sayılır — TEK hesaplama yeri
 * burası; çağıranlar değişmedi (bkz. D-2c-1b raporu).
 */
export function gunAnahtari(d: Date): string {
  const efektif = gunSiniriSaatiOnbellek > 0 && d.getHours() < gunSiniriSaatiOnbellek ? gunEkle(d, -1) : d;
  const ay = String(efektif.getMonth() + 1).padStart(2, '0');
  const gun = String(efektif.getDate()).padStart(2, '0');
  return `${efektif.getFullYear()}-${ay}-${gun}`;
}

/** Yerel ay anahtarı: "2026-09" */
export function ayAnahtari(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Bir ay anahtarının geçerli son günü: "2026-02" → "2026-02-28". */
export function aySonGunu(ayAnahtariDeger: string): string {
  const [yil, ay] = ayAnahtariDeger.split('-').map(Number);
  const sonGun = new Date(yil, ay, 0).getDate();
  return `${ayAnahtariDeger}-${String(sonGun).padStart(2, '0')}`;
}

/** "08.20" — prototipteki saat düzeni (iki nokta değil nokta; diğer dillerde "08:20") */
export function saatYaz(isoDamga: string): string {
  const d = new Date(isoDamga);
  return metin('tarih.saat', { saat: String(d.getHours()).padStart(2, '0'), dakika: String(d.getMinutes()).padStart(2, '0') });
}

/** Bugünden `fark` gün ötesi/berisi */
export function gunEkle(d: Date, fark: number): Date {
  const y = new Date(d);
  y.setDate(y.getDate() + fark);
  return y;
}

/** `ay` ay ötesi/berisi — gün-sabiti korunur (E-14 ay değiştirici, taksit serisi). */
export function ayEkle(d: Date, ay: number): Date {
  const y = new Date(d);
  const gun = y.getDate();
  y.setDate(1);
  y.setMonth(y.getMonth() + ay);
  // Ay taşması telafisi: 31 Ocak + 1 ay → 28/29 Şubat (31 değil).
  const ayinSonGunu = new Date(y.getFullYear(), y.getMonth() + 1, 0).getDate();
  y.setDate(Math.min(gun, ayinSonGunu));
  return y;
}

/** "YYYY-MM-DD" gün anahtarını yerel `Date`'e çevirir (öğlen saatine sabitler — TZ kaymasını önler). */
export function tarihtenGun(gunAnahtariDeger: string): Date {
  const [yil, ay, gun] = gunAnahtariDeger.split('-').map(Number);
  return new Date(yil, ay - 1, gun, 12, 0, 0);
}

/** "Eylül 2026" — ay değiştirici başlığı (E-14). */
export function ayBasligi(ayAnahtariDeger: string): string {
  const [yil, ay] = ayAnahtariDeger.split('-').map(Number);
  return metin('tarih.ay_yil', { ay: takvim.aylar[ay - 1], yil });
}

/** "Eylül 2026" — `ayBasligi` ile aynı; özet ekranının ay etiketi. */
export function ayYilEtiketi(ayAnahtariDeger: string): string {
  return ayBasligi(ayAnahtariDeger);
}

/** "Eylül" — yıl olmadan yalnız ay adı (E-18 ay yükü çubuğu etiketi). */
export function ayAdiTek(ayAnahtariDeger: string): string {
  const ay = Number(ayAnahtariDeger.split('-')[1]);
  return takvim.aylar[ay - 1];
}

/** "Bugün" · "Dün" · "8 Eylül Salı" — gün grubu başlığı (E-14). */
export function gunBasligi(gunAnahtariDeger: string, bugun: Date): string {
  const bugunAnahtari = gunAnahtari(bugun);
  const dunAnahtari = gunAnahtari(gunEkle(bugun, -1));
  if (gunAnahtariDeger === bugunAnahtari) return t['tarih.bugun'];
  if (gunAnahtariDeger === dunAnahtari) return t['tarih.dun'];
  return uzunTarih(tarihtenGun(gunAnahtariDeger));
}

/** "10 Eylül" — kısa tarih (E-11 tarih çipi, E-12 eklenme satırı). */
export function kisaTarih(d: Date): string {
  return metin('tarih.kisa', { gun: d.getDate(), ay: takvim.aylarTarih[d.getMonth()] });
}

/** "10 Eylül 2026" — yıllı tarih (tarih alanı). */
export function tamTarih(d: Date): string {
  return metin('tarih.tam', { gun: d.getDate(), ay: takvim.aylarTarih[d.getMonth()], yil: d.getFullYear() });
}

/** Haftanın Pazartesi'si (E-16 hafta değiştirici). Yerel gün, saat sıfırlanmaz. */
export function haftaBaslangici(d: Date): Date {
  const gun = (d.getDay() + 6) % 7; // Pazartesi=0 … Pazar=6
  return gunEkle(d, -gun);
}

/** "31 Ağustos – 6 Eylül" — `ozet.hafta_araligi` (E-16). */
export function haftaAraligi(baslangic: Date, bitis: Date): string {
  return `${kisaTarih(baslangic)} – ${kisaTarih(bitis)}`;
}

/** "10 Eylül · 21.30 eklendi" (E-12 alt bilgi). */
export function eklenmeEtiketi(isoDamga: string): string {
  const d = new Date(isoDamga);
  return metin('tarih.eklenme', { tarih: kisaTarih(d), saat: saatYaz(isoDamga) });
}

/* ------------------------------------------------------- v4 · E-10 sayfalama */

/**
 * E-10 gün başlığı (K-049/metinler.md §23.1). `gunFarki` 0=bugün, -1=dün,
 * daha eskisi tarihli başlığa döner: h1 "17/09 Perşembe", üst satır "N gün önce".
 * Bugün/dün sayfasında üst satır tam tarihtir (`uzunTarih`), h1 "Bugün"/"Dün".
 */
export function gunlukBaslik(gunFarki: number, tarih: Date): { h1: string; ustSatir: string } {
  if (gunFarki === 0) return { h1: t['tarih.bugun'], ustSatir: uzunTarih(tarih) };
  if (gunFarki === -1) return { h1: t['tarih.dun'], ustSatir: uzunTarih(tarih) };
  const gg = String(tarih.getDate()).padStart(2, '0');
  const aa = String(tarih.getMonth() + 1).padStart(2, '0');
  return {
    h1: metin('tarih.gunluk_baslik', { gg, aa, haftaGunu: takvim.gunler[tarih.getDay()] }),
    ustSatir: metin('tarih.gun_once', { n: Math.abs(gunFarki) }),
  };
}

/** İki günün arasındaki gün farkı (saat/TZ'den bağımsız, öğlene sabitlenmiş). */
export function gunFarkiHesapla(hedef: Date, bugun: Date): number {
  const h = new Date(hedef.getFullYear(), hedef.getMonth(), hedef.getDate(), 12, 0, 0);
  const b = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate(), 12, 0, 0);
  return Math.round((h.getTime() - b.getTime()) / 86_400_000);
}

/* ---------------------------------------------------- v4 · E-24 ay ızgarası */

/** Ayın gün sayısı — "2026-09" → 30. */
export function ayGunSayisi(ayAnahtariDeger: string): number {
  const [yil, ay] = ayAnahtariDeger.split('-').map(Number);
  return new Date(yil, ay, 0).getDate();
}

/** Ayın 1'inin haftadaki yeri — Pazartesi=0 … Pazar=6 (ay ızgarası baş boşluğu). */
export function ayIlkGununHaftaIndeksi(ayAnahtariDeger: string): number {
  const [yil, ay] = ayAnahtariDeger.split('-').map(Number);
  return (new Date(yil, ay - 1, 1).getDay() + 6) % 7;
}

/** `ay` ay ötesi/berisi ay anahtarı — "2026-09" + 1 → "2026-10" (E-24 ay değiştirici). */
export function ayAnahtariFarkli(ayAnahtariDeger: string, fark: number): string {
  const [yil, ay] = ayAnahtariDeger.split('-').map(Number);
  return ayAnahtari(ayEkle(new Date(yil, ay - 1, 1), fark));
}

/* ---------------------------------------------- D-2d-3a · E-03 maaş günü */

/**
 * Ayın günü, "o gün" anlamında: tr 15 → "15'inde" (`ob.maas.donem` cümlesi),
 * en → "15th". Türkçe ünlü uyumu tabloları Türkçe dil paketinde
 * (`src/i18n/kaynaklar/tr.ts`), her dil kendi biçimini verir.
 */
export function gunBulunmaEki(gun: number): string {
  return gunBulunma(gun);
}

/** Ayın günü, "ayın X'i" anlamında: tr 15 → "15'i" (E-03 kurulum özeti değeri), en → "15th". */
export function gunIyelikEki(gun: number): string {
  return gunIyelik(gun);
}
