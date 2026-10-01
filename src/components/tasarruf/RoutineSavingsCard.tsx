import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Txt } from '@/components/Txt';
import { t, tasarrufRutinBosGecmisAy } from '@/content/metinler';
import { paraYaz } from '@/lib/para';
import { rhythm } from '@/theme/tokens';

/**
 * rev2-tasarruf-profil.md §3.9/§3.12 — akordiyon bölümü D'nin İÇERİĞİ.
 * *Rutin tasarrufu* üçüncü ve en dar kavım; *hesaplanan tasarruf* /
 * *gerçek birikim* ile TOPLANMAZ. REV3: `h2`+toplam kabuğa taşındı; içerikte
 * tutarın etiketi ("Vazgeçtiğin rutinler") ve kuralı ("Bütçedeki kalana
 * eklenmez.") artık İKİ ayrı satır (aynı iki olgu, biri tutarın etiketi,
 * öteki kuralın kendisi). Satırlardaki 44pt `repeat` ikon kabı düştü — üç
 * satırın üçü de rutin, aynı glif hiçbir şeyi ayırmıyordu (Ö8).
 *
 * `toplamRutinSayisi` — `GET /butce/rutinler`den (mevcut uç, yeni alan
 * DEĞİL): tanımlı hiç rutin yoksa ayrı bir tanım cümlesi gösterir; tanımlı
 * rutin var ama bu ay vazgeçme yoksa ayrı cümle (§3.9 iki durum tablosu).
 */
export function RoutineSavingsCard({
  guncelAyMi,
  ayLokatifDeger,
  rutinler,
  toplamKurus,
  toplamRutinSayisi,
  onRutinleriAcPress,
}: {
  guncelAyMi: boolean;
  ayLokatifDeger: string;
  rutinler: { rutin_id: string; ad: string; tasarruf_kurus: number }[];
  toplamKurus: number;
  toplamRutinSayisi: number;
  onRutinleriAcPress: () => void;
}) {
  const hicRutinYok = toplamRutinSayisi === 0;

  return (
    <View>
      {rutinler.length === 0 ? (
        <Txt role="caption">
          {hicRutinYok ? t['tasarruf.rutin.hicYok'] : guncelAyMi ? t['tasarruf.rutin.bos.buAy'] : tasarrufRutinBosGecmisAy(ayLokatifDeger)}
        </Txt>
      ) : (
        <>
          <View style={stil.aralik}>
            <Txt role="caption" style={stil.esnek}>
              {t['tasarruf.rutin.tutarEtiket']}
            </Txt>
            <Txt role="amount">{paraYaz(toplamKurus)}</Txt>
          </View>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="caption">{t['tasarruf.rutin.kural']}</Txt>
          <View style={{ height: rhythm.blockInCard }} />
          {rutinler.map((r, i) => (
            <Fragment key={r.rutin_id}>
              {i > 0 ? <View style={{ height: rhythm.blockInCard }} /> : null}
              <View style={stil.satir}>
                <Txt role="body" numberOfLines={1} ellipsizeMode="tail" style={stil.esnek}>
                  {r.ad}
                </Txt>
                <Txt role="amount">{paraYaz(r.tasarruf_kurus)}</Txt>
              </View>
            </Fragment>
          ))}
        </>
      )}
      <View style={{ height: rhythm.blockInCard }} />
      <Button variant="ghost" label={t['tasarruf.rutin.btn']} auto onPress={onRutinleriAcPress} />
    </View>
  );
}

const stil = StyleSheet.create({
  aralik: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  satir: { flexDirection: 'row', alignItems: 'center' },
  esnek: { flex: 1, minWidth: 0 },
});
