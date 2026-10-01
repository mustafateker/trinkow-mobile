import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryShareRow } from '@/components/CategoryShareRow';
import { Txt } from '@/components/Txt';
import { t, tasarrufKategoriBosGecmisAy } from '@/content/metinler';
import { paraYaz } from '@/lib/para';
import { rhythm } from '@/theme/tokens';

const GORUNEN_LIMIT = 5;

/**
 * rev2-tasarruf-profil.md §3.8/§3.12 — akordiyon bölümü C'nin İÇERİĞİ. Başlık
 * ve kapalı özet artık `Accordion`'da; REV3: açıkken aynı "Harcanan {tutar}"
 * değeri içeriğin ilk satırında durur (kaybolmaz), en çok 5 satır + "Tümünü gör".
 */
export function CategoryDistributionCard({
  guncelAyMi,
  ayLokatifDeger,
  kategoriler,
  harcananToplam,
  onTumunuGorPress,
}: {
  guncelAyMi: boolean;
  ayLokatifDeger: string;
  kategoriler: { kategori: string; harcanan_kurus: number; rutin_tasarruf_kurus: number }[];
  harcananToplam: number;
  onTumunuGorPress: () => void;
}) {
  const siraliListe = [...kategoriler].sort((a, b) => b.harcanan_kurus - a.harcanan_kurus);
  const enYuklu = siraliListe.length > 0 ? siraliListe[0].harcanan_kurus : 0;
  const gorunenler = siraliListe.slice(0, GORUNEN_LIMIT);

  return (
    <View>
      {gorunenler.length === 0 ? (
        <>
          <Txt role="body">{guncelAyMi ? t['tasarruf.kategori.bos.buAy'] : tasarrufKategoriBosGecmisAy(ayLokatifDeger)}</Txt>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption">{t['tasarruf.kategori.bos.alt']}</Txt>
        </>
      ) : (
        <>
          <View style={stil.aralik}>
            <Txt role="caption" style={stil.esnek}>
              {t['tasarruf.butce.harcanan']}
            </Txt>
            <Txt role="amount">{paraYaz(harcananToplam)}</Txt>
          </View>
          <View style={{ height: rhythm.blockInCard }} />
          {gorunenler.map((k, i) => (
            <Fragment key={k.kategori}>
              {i > 0 ? <View style={{ height: rhythm.blockInCard }} /> : null}
              <CategoryShareRow
                kategoriKodu={k.kategori}
                harcananKurus={k.harcanan_kurus}
                oran={enYuklu > 0 ? k.harcanan_kurus / enYuklu : 0}
                payYuzdesi={harcananToplam > 0 ? (k.harcanan_kurus / harcananToplam) * 100 : 0}
                rutinKurus={k.rutin_tasarruf_kurus}
              />
            </Fragment>
          ))}
          <View style={{ height: rhythm.blockInCard }} />
          <Button variant="ghost" label={t['tasarruf.kategori.tumu']} auto onPress={onTumunuGorPress} />
        </>
      )}
    </View>
  );
}

const stil = StyleSheet.create({
  aralik: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  esnek: { flex: 1, minWidth: 0 },
});
