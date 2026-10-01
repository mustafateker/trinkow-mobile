import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadBar } from '@/components/LoadBar';
import { Txt } from '@/components/Txt';
import {
  t,
  tasarrufBirikimAyCekmeBuAy,
  tasarrufBirikimAyCekmeGecmisAy,
  tasarrufBirikimAyEklemeBuAy,
  tasarrufBirikimAyEklemeGecmisAy,
  tasarrufBirikimAyYokGecmisAy,
  tasarrufBirikimHedef,
} from '@/content/metinler';
import { paraYaz } from '@/lib/para';
import { color, rhythm } from '@/theme/tokens';

/**
 * rev2-tasarruf-profil.md §3.5/§3.12 — akordiyon bölümü B'nin ÜST yarısı
 * (*gerçek birikim* — *hesaplanan tasarruf*tan AYRI). REV3: `h2` başlık ve
 * tutar artık `Accordion`'da/içeriğin ilk satırında değil, başlık kabuğa
 * taşındı; tutar başlık satırından çıkıp İÇERİĞİN İLK satırına indi (solda
 * ay-satırı `caption`, sağda `amount` 17 tutar). Motivasyon şeridi (REV3
 * §3.3) düğmenin hemen üstüne indi — `motivasyonStrip` olarak dışarıdan verilir.
 */
export function RealSavingsCard({
  guncelAyMi,
  ayLokatifDeger,
  gercekBirikimKurus,
  ayBirikimKurus,
  hedefBirikimKurus,
  motivasyonStrip,
  onEklePress,
  onHedefPress,
}: {
  guncelAyMi: boolean;
  ayLokatifDeger: string;
  gercekBirikimKurus: number;
  ayBirikimKurus: number;
  hedefBirikimKurus: number;
  motivasyonStrip?: ReactNode;
  onEklePress: () => void;
  onHedefPress: () => void;
}) {
  const hedefVar = hedefBirikimKurus > 0;
  const yuzde = hedefVar ? Math.round(Math.min(1, gercekBirikimKurus / hedefBirikimKurus) * 100) : 0;

  return (
    <View>
      <View style={stil.aralik}>
        <Txt role="caption" style={stil.esnek}>
          {birikimAySatiri(guncelAyMi, ayLokatifDeger, ayBirikimKurus)}
        </Txt>
        <Txt role="amount">{paraYaz(gercekBirikimKurus)}</Txt>
      </View>
      <View style={{ height: rhythm.blockInCard }} />
      {hedefVar ? (
        <>
          <LoadBar oran={gercekBirikimKurus / hedefBirikimKurus} />
          <View style={{ height: rhythm.sameObject }} />
          <View style={stil.aralik}>
            <Txt role="caption">{tasarrufBirikimHedef(paraYaz(hedefBirikimKurus))}</Txt>
            <Txt role="label" tone={color.text2}>
              %{yuzde}
            </Txt>
          </View>
        </>
      ) : (
        <View style={stil.aralik}>
          <Txt role="caption">{t['tasarruf.birikim.hedefYok']}</Txt>
          <Button variant="ghost" label={t['tasarruf.birikim.hedefBtn']} auto onPress={onHedefPress} />
        </View>
      )}
      {motivasyonStrip ? (
        <>
          <View style={{ height: rhythm.blockInCard }} />
          {motivasyonStrip}
        </>
      ) : null}
      <View style={{ height: rhythm.blockInCard }} />
      <Button variant="secondary" icon="plus" label={t['tasarruf.birikim.ekleBtn']} onPress={onEklePress} />
    </View>
  );
}

/** Kapalı akordiyon özetinde de ("… kayıt yok" varyantı) kullanılır — bkz. `tasarruflar.tsx`. */
export function birikimAySatiri(guncelAyMi: boolean, ayLokatifDeger: string, ayBirikimKurus: number): string {
  if (ayBirikimKurus === 0) return guncelAyMi ? t['tasarruf.birikim.ayYok.buAy'] : tasarrufBirikimAyYokGecmisAy(ayLokatifDeger);
  const tutar = paraYaz(Math.abs(ayBirikimKurus));
  if (ayBirikimKurus > 0) return guncelAyMi ? tasarrufBirikimAyEklemeBuAy(tutar) : tasarrufBirikimAyEklemeGecmisAy(ayLokatifDeger, tutar);
  return guncelAyMi ? tasarrufBirikimAyCekmeBuAy(tutar) : tasarrufBirikimAyCekmeGecmisAy(ayLokatifDeger, tutar);
}

const stil = StyleSheet.create({
  aralik: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  esnek: { flex: 1, minWidth: 0 },
});
