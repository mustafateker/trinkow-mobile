import { StyleSheet, View } from 'react-native';

import { CategoryIconBox } from '@/components/CategoryIconBox';
import { Txt } from '@/components/Txt';
import { tasarrufKategoriPay, tasarrufKategoriRutin } from '@/content/metinler';
import { aileRenkleri, kategori } from '@/lib/kategoriler';
import { paraYaz } from '@/lib/para';
import { clay, color, radius, rhythm, size } from '@/theme/tokens';

/**
 * Bileşen envanteri §5 `CategoryShareRow` (rev2 · yeni bileşim) —
 * `CategoryLimitBar` + `MonthLoadRow` geometrisi: 44 kap · ad/tutar ·
 * 12pt kategori çubuğu · pay/rutin satırı. rev2-tasarruf-profil.md §3.8:
 * çubuklar ORTAK ölçeği paylaşır (en yüklü kategori %100), `oran` çağıran
 * tarafından hesaplanır — bu satır kendi limitine göre DOLMAZ.
 */
export function CategoryShareRow({
  kategoriKodu,
  harcananKurus,
  oran,
  payYuzdesi,
  rutinKurus,
}: {
  kategoriKodu: string;
  harcananKurus: number;
  /** En yüklü kategoriye göre 0..1 (ortak ölçek). */
  oran: number;
  /** Toplam harcamaya göre yüzde — ayrı bilgi, ayrı etiket. */
  payYuzdesi: number;
  /** Yalnız `> 0` iken "rutin {tutar}" etiketi çizilir (§3.8). */
  rutinKurus?: number;
}) {
  const kat = kategori(kategoriKodu);
  const renk = aileRenkleri(kat.aile);
  const genislik = Math.max(0, Math.min(1, oran));

  return (
    <View style={stil.satir}>
      <CategoryIconBox kategori={kat} />
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.orta}>
        <View style={stil.aralik}>
          <Txt role="bodyStrong" numberOfLines={1} ellipsizeMode="tail" style={stil.ad}>
            {kat.ad}
          </Txt>
          <Txt role="amount" numberOfLines={1}>
            {paraYaz(harcananKurus)}
          </Txt>
        </View>
        <View style={{ height: rhythm.group }} />
        <View
          style={stil.oluk}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={`${kat.ad} payı`}
          accessibilityValue={{ min: 0, max: 100, now: Math.round(payYuzdesi) }}>
          {genislik > 0 ? <View style={[stil.dolgu, { width: `${genislik * 100}%`, backgroundColor: renk.solid }]} /> : null}
        </View>
        <View style={{ height: rhythm.sameObject }} />
        <View style={stil.aralik}>
          <Txt role="caption">{tasarrufKategoriPay(Math.round(payYuzdesi))}</Txt>
          {rutinKurus && rutinKurus > 0 ? (
            <Txt role="label" tone={color.text2}>
              {tasarrufKategoriRutin(paraYaz(rutinKurus))}
            </Txt>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'center' },
  orta: { flex: 1, minWidth: 0 },
  aralik: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ad: { flexShrink: 1, minWidth: 0 },
  oluk: {
    height: size.catBarHeight,
    borderRadius: radius.pill,
    backgroundColor: color.groove,
    boxShadow: clay.sunken,
    overflow: 'hidden',
  },
  dolgu: { height: size.catBarHeight, borderRadius: radius.pill },
});
