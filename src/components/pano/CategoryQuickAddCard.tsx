import { Pressable, StyleSheet, View } from 'react-native';

import { CategoryIconBox } from '@/components/CategoryIconBox';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import type { Harcama } from '@/db/harcama';
import { GUNLUK_HARCAMA_KATEGORILERI, KATEGORILER, type KategoriKodu } from '@/lib/kategoriler';
import { paraYaz } from '@/lib/para';
import { saatYaz } from '@/lib/tarih';
import { a11y, color, radius, rhythm, size } from '@/theme/tokens';

export function CategoryQuickAddCard({
  harcamalar,
  onEkle,
  onHarcamaPress,
}: {
  harcamalar: Harcama[];
  onEkle: (kategori: KategoriKodu) => void;
  onHarcamaPress: (harcama: Harcama) => void;
}) {
  return (
    <View>
      {GUNLUK_HARCAMA_KATEGORILERI.map((kod, index) => {
        const kategori = KATEGORILER[kod];
        const kategoriHarcamalari = harcamalar.filter((harcama) => harcama.kategori === kod);
        const toplam = kategoriHarcamalari.reduce((sum, harcama) => sum + harcama.tutarKurus, 0);
        return (
          <View key={kod}>
            {index > 0 ? <View style={stil.ayrac} /> : null}
            <View style={stil.satir}>
              <CategoryIconBox kategori={kategori} />
              <View style={{ width: rhythm.blockInCard }} />
              <View style={stil.metin}>
                <Txt role="bodyStrong" numberOfLines={1}>{kategori.ad}</Txt>
                <Txt role="caption">{toplam > 0 ? `Bugün ${paraYaz(toplam)}` : 'Bugün harcama yok'}</Txt>
              </View>
              <Pressable
                onPress={() => onEkle(kod)}
                accessibilityRole="button"
                accessibilityLabel={`${kategori.ad} kategorisine harcama ekle`}
                hitSlop={a11y.minTarget - size.iconButton}
                style={({ pressed }) => [
                  stil.ekle,
                  { backgroundColor: pressed ? color.primarySoft : color.groove },
                ]}>
                <Icon name="plus" size={20} color={color.primaryText} />
              </Pressable>
            </View>
            {kategoriHarcamalari.length > 0 ? (
              <View style={stil.harcamaListesi}>
                {kategoriHarcamalari.map((harcama) => (
                  <Pressable
                    key={harcama.id}
                    onPress={() => onHarcamaPress(harcama)}
                    accessibilityRole="button"
                    accessibilityLabel={`${harcama.urunAdi ?? kategori.ad}, ${paraYaz(harcama.tutarKurus)}`}
                    style={({ pressed }) => [stil.harcama, pressed && stil.harcamaBasili]}>
                    <View style={stil.harcamaMetni}>
                      <Txt role="body" numberOfLines={1}>{harcama.urunAdi ?? kategori.ad}</Txt>
                      <Txt role="micro">{saatYaz(harcama.zaman)}</Txt>
                    </View>
                    <Txt role="amount">{paraYaz(harcama.tutarKurus)}</Txt>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { minHeight: a11y.minTarget, flexDirection: 'row', alignItems: 'center' },
  metin: { flex: 1, minWidth: 0 },
  ayrac: { height: 1, marginVertical: rhythm.group, marginLeft: size.iconButton + rhythm.blockInCard, backgroundColor: color.line },
  ekle: {
    width: size.iconButton,
    height: size.iconButton,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  harcamaListesi: { marginTop: rhythm.group, marginLeft: size.iconButton + rhythm.blockInCard, gap: rhythm.sameObject },
  harcama: {
    minHeight: a11y.minTarget,
    paddingHorizontal: rhythm.blockInCard,
    borderRadius: radius.tile,
    backgroundColor: color.groove,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: rhythm.group,
  },
  harcamaBasili: { backgroundColor: color.well },
  harcamaMetni: { flex: 1, minWidth: 0 },
});
