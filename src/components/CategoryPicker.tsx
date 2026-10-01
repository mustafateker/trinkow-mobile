import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { ClayPressable } from '@/components/ClayPressable';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { aileRenkleri, KATEGORILER, ILK_ALTI, TUM_KATEGORILER, type KategoriKodu } from '@/lib/kategoriler';
import { clay, color, layout, radius, rhythm, size } from '@/theme/tokens';

/**
 * Bileşen envanteri §2 `CategoryPicker` — frekansa göre sıralı ilk 6 çip +
 * "Tüm kategoriler" → 3 sütunlu kutu ızgarası (`flexWrap`, grid yok).
 * K-032 (bağlayıcı): kategori ÖNCEDEN SEÇİLİ GELMEZ.
 *
 * K-040 tutarlılığı: seçili durum HER YERDE çukurluk + `primary-soft` +
 * (çipte) nokta ile anlatılır — ızgara kutusunda da 2pt halka YOKTUR,
 * prototipteki inset ring geçersizdir (tokens.md tek otorite).
 */
export function CategoryPicker({
  value,
  onChange,
  error,
  secenekler = ILK_ALTI,
}: {
  value: KategoriKodu | null;
  onChange: (k: KategoriKodu) => void;
  error?: string;
  /** rev2 `RoutineSheet` (§5.2) — rutine özgü 6 kategori. Verilmezse §4 ILK_ALTI (geriye dönük uyumlu). */
  secenekler?: KategoriKodu[];
}) {
  const [acik, setAcik] = useState(false);
  const gorunecekler: KategoriKodu[] =
    value && !secenekler.includes(value) ? [value, ...secenekler] : secenekler;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[stil.satir, { paddingHorizontal: layout.screenPaddingX }]}>
        {gorunecekler.map((kod) => {
          const k = KATEGORILER[kod];
          const secili = value === kod;
          return (
            <Chip
              key={kod}
              ad={k.ad}
              selected={secili}
              dotColor={aileRenkleri(k.aile).solid}
              onPress={() => onChange(kod)}
            />
          );
        })}
        <ClayPressable
          onPress={() => setAcik(true)}
          accessibilityLabel={t['eylem.tum_kategoriler']}
          borderRadius={radius.pill}
          style={stil.hepsiBtn}>
          <Icon name="chevron-down" size={20} color={color.text2} />
        </ClayPressable>
      </ScrollView>
      {error ? (
        <>
          <View style={{ height: rhythm.group }} />
          <View style={{ paddingHorizontal: layout.screenPaddingX }}>
            <Txt role="caption" tone={color.dangerInk}>
              {error}
            </Txt>
          </View>
        </>
      ) : null}
      <CategoryGridSheet
        visible={acik}
        value={value}
        onSelect={(k) => {
          onChange(k);
          setAcik(false);
        }}
        onClose={() => setAcik(false)}
      />
    </View>
  );
}

/** Tam 13 kategori ızgarası — E-11 "Tüm kategoriler" ve E-12 kategori değiştirme ortak sheet'i. */
export function CategoryGridSheet({
  visible,
  value,
  onSelect,
  onClose,
}: {
  visible: boolean;
  value: KategoriKodu | null;
  onSelect: (k: KategoriKodu) => void;
  onClose: () => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={stil.basSatiri}>
        <Txt role="h2">Kategori</Txt>
        <IconButton icon="x" accessibilityLabel="Kapat" onPress={onClose} />
      </View>
      <View style={{ height: rhythm.blockInCard }} />
      <View style={stil.izgara}>
        {TUM_KATEGORILER.map((kod) => {
          const k = KATEGORILER[kod];
          const renk = aileRenkleri(k.aile);
          const secili = value === kod;
          return (
            <View key={kod} style={stil.izgaraOge}>
              <ClayPressable
                onPress={() => onSelect(kod)}
                accessibilityLabel={k.ad}
                selected={secili}
                borderRadius={radius.tile}
                background={secili ? color.primarySoft : color.surface}
                pressedBackground={color.groove}
                shadow={secili ? clay.sunken : clay.raised}
                gloss={!secili}
                style={stil.izgaraKutu}>
                <View style={[stil.izgaraIkon, { backgroundColor: renk.soft }]}>
                  <Icon name={k.ikon} size={20} color={renk.solid} />
                </View>
                <View style={{ height: rhythm.group }} />
                <Txt role="label" style={stil.izgaraEtiket}>
                  {k.ad}
                </Txt>
              </ClayPressable>
            </View>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
  hepsiBtn: {
    width: size.iconButton,
    height: size.chipHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  // §3.3 negatif oluk telafisi −4 (kat-sec)
  izgara: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  izgaraOge: { width: '33.33%', padding: 4 },
  izgaraKutu: { alignItems: 'center', paddingVertical: rhythm.blockInCard, paddingHorizontal: 4 },
  izgaraIkon: {
    width: size.catBox,
    height: size.catBox,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  izgaraEtiket: { textAlign: 'center' },
});
