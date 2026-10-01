import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryLimitRow } from '@/components/CategoryLimitRow';
import { ClaySurface } from '@/components/ClaySurface';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import type { KategoriDurumu } from '@/db/harcama';
import { color, radius, rhythm, size } from '@/theme/tokens';

/**
 * v4 E-10 · "Kategoriler" kartı — yalnız Bugün sayfasında (metinler.md
 * §23.4). K-056: alt başlık "Bu ay · kategori limiti" — satırın birincil
 * ölçeği aylık/aylık, bugünün tutarı ikincil satırda (`CategoryLimitRow`).
 */
export function CategoryLimitCard({
  durumlar,
  onSeeAll,
  onEkle,
}: {
  durumlar: KategoriDurumu[];
  onSeeAll?: () => void;
  /** Satırdaki hızlı "+" — kategori kodu ile çağrılır (K-051). */
  onEkle?: (kategoriKodu: string) => void;
}) {
  return (
    <ClaySurface level="raised" borderRadius={radius.card} style={stil.kart}>
      <View style={stil.baslikSatiri}>
        <View>
          <Txt role="h2">{t['gunluk.grup.baslik']}</Txt>
          <View style={{ height: 4 }} />
          <Txt role="caption" tone={color.text2}>
            {t['gunluk.grup.alt']}
          </Txt>
        </View>
        <Button
          label={t['pano.tumunu_gor']}
          variant="ghost"
          auto
          onPress={onSeeAll}
          accessibilityLabel={t['eylem.tum_kategoriler']}
        />
      </View>
      <View style={{ height: rhythm.pad }} />
      {durumlar.map((d, i) => (
        <View key={d.kategori}>
          {/* §3.1 — kartın İÇİNDE iki bağımsız blok: 12 */}
          {i > 0 ? <View style={{ height: rhythm.blockInCard }} /> : null}
          <CategoryLimitRow
            kategoriKodu={d.kategori}
            harcananKurus={d.harcananKurus}
            limitKurus={d.limitKurus}
            bugunKurus={d.bugunKurus}
            onEkle={onEkle ? () => onEkle(d.kategori) : undefined}
          />
        </View>
      ))}
    </ClaySurface>
  );
}

/** Boş hâl: henüz kategori limiti yok (§7.8 sırası — başlık, gövde, buton). */
export function CategoryLimitEmptyCard({ onSet }: { onSet?: () => void }) {
  return (
    <ClaySurface level="raised" borderRadius={radius.card} style={[stil.kart, stil.bosKart]}>
      <View style={stil.ikonKutu}>
        <Icon name="info" size={size.iconSm} color={color.primaryText} />
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.bosIcerik}>
        <Txt role="bodyStrong">{t['gunluk.grup.baslik']}</Txt>
        <View style={{ height: rhythm.group }} />
        <Txt role="caption">{t['limitler.kategori_aciklama']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <Button label={t['kategori.limit_ekle']} variant="secondary" auto onPress={onSet} />
      </View>
    </ClaySurface>
  );
}

const stil = StyleSheet.create({
  kart: { padding: rhythm.pad },
  bosKart: { flexDirection: 'row', alignItems: 'flex-start' },
  baslikSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ikonKutu: { width: size.iconSm, height: size.iconSm },
  bosIcerik: { flex: 1, minWidth: 0 },
});
