import { StyleSheet, View } from 'react-native';

import { EquationRow } from '@/components/EquationRow';
import { InfoStrip } from '@/components/InfoStrip';
import { Txt } from '@/components/Txt';
import {
  a11yTasarrufGunSayaci,
  t,
  tasarrufButceEksikGun,
  tasarrufButceGunDeger,
  tasarrufButceKumulatif,
  tasarrufButceSabit,
} from '@/content/metinler';
import { paraYaz } from '@/lib/para';
import { color, rhythm } from '@/theme/tokens';

/**
 * rev2-tasarruf-profil.md §3.4/§3.12 — akordiyon bölümü A'nın İÇERİĞİ. Başlık
 * ve kapalı özet artık `Accordion`'da (`tasarruflar.tsx`); burada yalnız
 * denklem + sabit ödeme notu + "tamamlanan gün" METİN satırı (çubuk DEĞİL —
 * ekranın tek mavi ilerleme çubuğu §3.5'teki hedef çubuğudur) kalıyor.
 * `bilinmeyenGunSayisi` şeridi REV3'te içeriğin İLK satırı (kartın üstü değil).
 */
export function BudgetCard({
  harcanabilirKurus,
  harcananKurus,
  kalanKurus,
  toplamHarcamaKurus,
  tamamlananGun,
  ayGunSayisi,
  kumulatifKurus,
  bilinmeyenGunSayisi,
  overflowMi,
}: {
  harcanabilirKurus: number;
  harcananKurus: number;
  kalanKurus: number;
  toplamHarcamaKurus: number;
  tamamlananGun: number;
  ayGunSayisi: number;
  kumulatifKurus: number | null;
  bilinmeyenGunSayisi: number;
  overflowMi: boolean;
}) {
  return (
    <View>
      {bilinmeyenGunSayisi > 0 ? (
        <>
          <InfoStrip variant="warning" icon="alert-circle" metin={tasarrufButceEksikGun(bilinmeyenGunSayisi)} textTone={color.text} />
          <View style={{ height: rhythm.blockInCard }} />
        </>
      ) : null}
      <EquationRow
        operators={['−', '=']}
        sonucVaryant={overflowMi ? 'disinda' : 'normal'}
        items={[
          { value: paraYaz(harcanabilirKurus), label: t['tasarruf.butce.harcanabilir'] },
          { value: paraYaz(harcananKurus), label: t['tasarruf.butce.harcanan'] },
          {
            value: paraYaz(Math.abs(kalanKurus)),
            label: overflowMi ? t['tasarruf.butce.disinda'] : t['tasarruf.butce.kalan'],
          },
        ]}
      />
      <View style={{ height: rhythm.blockInCard }} />
      <Txt role="caption">{tasarrufButceSabit(paraYaz(toplamHarcamaKurus))}</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <View
        style={stil.aralik}
        accessible
        accessibilityLabel={a11yTasarrufGunSayaci(tamamlananGun, ayGunSayisi)}>
        <Txt role="caption" style={stil.esnek}>
          {t['tasarruf.butce.gunSayaci']}
        </Txt>
        <Txt role="micro" tone={color.text2}>
          {tasarrufButceGunDeger(tamamlananGun, ayGunSayisi)}
        </Txt>
      </View>
      {kumulatifKurus !== null ? (
        <>
          <View style={{ height: rhythm.blockInCard }} />
          <Txt role="caption">{tasarrufButceKumulatif(paraYaz(kumulatifKurus))}</Txt>
        </>
      ) : null}
    </View>
  );
}

const stil = StyleSheet.create({
  aralik: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  esnek: { flex: 1, minWidth: 0 },
});
