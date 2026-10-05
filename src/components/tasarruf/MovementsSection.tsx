import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { SavingsMovementRow } from '@/components/SavingsMovementRow';
import { Txt } from '@/components/Txt';
import { t, tasarrufHareketSayi } from '@/content/metinler';
import type { Movement } from '@/lib/revApi';
import { color, rhythm } from '@/theme/tokens';

const GORUNEN_LIMIT = 5;

/**
 * rev2-tasarruf-profil.md §3.6/§3.12 — akordiyon bölümü B'nin ALT yarısı, en
 * çok 5 satır + "Tüm hareketler". REV3: kendi `h2` başlığı yerine `label`
 * alt satırı (bir bölümde tek başlık olur, §3.6 REV3 notu). Boş durumda
 * düğme YOK (aynı eylem `RealSavingsCard`'da zaten duruyor, §7.8).
 */
export function MovementsSection({
  hareketler,
  toplamKayit,
  onRowPress,
  onSwipeDelete,
  onTumuPress,
}: {
  hareketler: Movement[];
  toplamKayit: number;
  onRowPress: (m: Movement) => void;
  onSwipeDelete: (m: Movement) => void;
  onTumuPress: () => void;
}) {
  const gorunenler = [...hareketler].sort((a, b) => (a.gun < b.gun ? 1 : -1)).slice(0, GORUNEN_LIMIT);

  return (
    <View>
      <View style={stil.aralik}>
        <Txt role="label" tone={color.text2} numberOfLines={1} style={stil.esnek}>
          {t['tasarruf.bolum.sonHareketler']}
        </Txt>
        <Txt role="label" tone={color.text2}>
          {tasarrufHareketSayi(toplamKayit)}
        </Txt>
      </View>
      <View style={{ height: rhythm.group }} />
      {gorunenler.length === 0 ? (
        <EmptyState
          icon="banknote"
          baslik={t['tasarruf.hareket.bos.baslik']}
          govde="Bu dönemde birikim hareketi yok."
        />
      ) : (
        <>
          {gorunenler.map((m, i) => (
            <Fragment key={m.id}>
              {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
              <SavingsMovementRow movement={m} onPress={() => onRowPress(m)} onSwipeDelete={() => onSwipeDelete(m)} />
            </Fragment>
          ))}
          <View style={{ height: rhythm.blockInCard }} />
          <Button variant="ghost" label={t['tasarruf.hareket.tumu']} auto onPress={onTumuPress} />
        </>
      )}
    </View>
  );
}

const stil = StyleSheet.create({
  aralik: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  esnek: { flex: 1, minWidth: 0 },
});
