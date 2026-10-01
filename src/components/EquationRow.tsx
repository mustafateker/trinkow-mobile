import { StyleSheet, View } from 'react-native';

import { ClaySurface } from '@/components/ClaySurface';
import { Txt } from '@/components/Txt';
import { color, radius, rhythm } from '@/theme/tokens';

export type EquationItem = { value: string; label: string };

/**
 * Bileşen envanteri `EquationRow` (E-26 için yazıldı, K-059/5 günlük limit
 * önerisi sheet'inde de kullanılıyor — RN inşa notu 8: tek hesap, tek
 * görsel bileşen). Üç çukur kutu + iki işleç + kabarık sonuç kutusu.
 *
 * `operators` verilmezse eski `÷`/`=` davranışı korunur (geriye dönük
 * uyumlu). rev2-tasarruf-profil.md §3.4 — E-27 bütçe kartı `−`/`=` kullanır.
 * `sonucVaryant="disinda"` — bütçe dışı ayda sonuç kutusu `warning-soft` +
 * `warning-ink` olur (tokens §1.9 onaylı çift).
 */
export function EquationRow({
  items,
  operators = ['÷', '='],
  sonucVaryant = 'normal',
}: {
  items: readonly [EquationItem, EquationItem, EquationItem];
  operators?: readonly [string, string];
  sonucVaryant?: 'normal' | 'disinda';
}) {
  return (
    <View style={stil.satir}>
      <Kutu item={items[0]} />
      <Islec sembol={operators[0]} />
      <Kutu item={items[1]} />
      <Islec sembol={operators[1]} />
      <Kutu item={items[2]} sonuc varyant={sonucVaryant} />
    </View>
  );
}

function Kutu({
  item,
  sonuc = false,
  varyant = 'normal',
}: {
  item: EquationItem;
  sonuc?: boolean;
  varyant?: 'normal' | 'disinda';
}) {
  const disinda = sonuc && varyant === 'disinda';
  return (
    <ClaySurface
      level={sonuc ? 'raised' : 'sunken'}
      borderRadius={radius.tile}
      background={sonuc ? (disinda ? color.warningSoft : color.primarySoft) : undefined}
      style={stil.kutu}>
      <Txt role="amount" tone={disinda ? color.warningInk : undefined} numberOfLines={1}>
        {item.value}
      </Txt>
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="micro" tone={disinda ? color.warningInk : color.text2} numberOfLines={1}>
        {item.label}
      </Txt>
    </ClaySurface>
  );
}

function Islec({ sembol }: { sembol: string }) {
  return (
    <View style={stil.islec}>
      <Txt role="body" tone={color.text2}>
        {sembol}
      </Txt>
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'stretch' },
  kutu: {
    flex: 1,
    minWidth: 0,
    padding: rhythm.group,
    alignItems: 'center',
    justifyContent: 'center',
  },
  islec: { width: 16, alignItems: 'center', justifyContent: 'center' },
});
