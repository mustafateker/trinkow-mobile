import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { ClayPressable } from '@/components/ClayPressable';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import {
  aileRenkleri,
  kategori as kategoriGetir,
  ILK_ALTI,
  TUM_KATEGORILER,
  type KategoriKodu,
} from '@/lib/kategoriler';
import {
  ozelKategoriEkle,
  ozelKategorileriGetirSync,
  ozelKategorileriYukle,
  type OzelKategori,
} from '@/lib/ozelKategoriler';
import { catColor, clay, color, layout, radius, rhythm, size, type CatFamily } from '@/theme/tokens';

const AILELER: CatFamily[] = ['lacivert', 'mavi', 'yesil', 'amber', 'kiremit', 'duman'];

/**
 * Bileşen envanteri §2 `CategoryPicker` — frekansa göre sıralı ilk 6 çip +
 * özel kategoriler + "Tüm kategoriler" → 3 sütunlu kutu ızgarası (`flexWrap`, grid yok).
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
  const [yeniAcik, setYeniAcik] = useState(false);
  const [ozelKategoriler, setOzelKategoriler] = useState<OzelKategori[]>(ozelKategorileriGetirSync());

  useEffect(() => {
    void ozelKategorileriYukle().then(setOzelKategoriler);
  }, []);

  const ozelKodlar = ozelKategoriler.map((k) => k.kod as KategoriKodu);
  const temelListe = [...secenekler, ...ozelKodlar.filter((k) => !secenekler.includes(k))];
  const gorunecekler: KategoriKodu[] =
    value && !temelListe.includes(value) ? [value, ...temelListe] : temelListe;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[stil.satir, { paddingHorizontal: layout.screenPaddingX }]}>
        {gorunecekler.map((kod) => {
          const k = kategoriGetir(kod);
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
        <Chip
          ad="+ Yeni"
          onPress={() => setYeniAcik(true)}
          accessibilityLabel="Yeni kategori ekle"
        />
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
        onYeniKategori={(k) => {
          setOzelKategoriler(ozelKategorileriGetirSync());
          onChange(k);
          setAcik(false);
        }}
      />
      <YeniKategoriSheet
        visible={yeniAcik}
        onClose={() => setYeniAcik(false)}
        onEklendi={(k) => {
          setOzelKategoriler(ozelKategorileriGetirSync());
          onChange(k);
        }}
      />
    </View>
  );
}

/** Tam kategori ızgarası — E-11 "Tüm kategoriler" ve E-12 kategori değiştirme ortak sheet'i. */
export function CategoryGridSheet({
  visible,
  value,
  onSelect,
  onClose,
  onYeniKategori,
}: {
  visible: boolean;
  value: KategoriKodu | null;
  onSelect: (k: KategoriKodu) => void;
  onClose: () => void;
  onYeniKategori?: (k: KategoriKodu) => void;
}) {
  const [yeniSheetAcik, setYeniSheetAcik] = useState(false);
  const [ozelKategoriler, setOzelKategoriler] = useState<OzelKategori[]>(ozelKategorileriGetirSync());

  useEffect(() => {
    if (visible) {
      void ozelKategorileriYukle().then(setOzelKategoriler);
    }
  }, [visible]);

  const tumu: KategoriKodu[] = [
    ...TUM_KATEGORILER,
    ...ozelKategoriler.map((o) => o.kod as KategoriKodu).filter((kod) => !TUM_KATEGORILER.includes(kod)),
  ];

  return (
    <>
      <BottomSheet visible={visible} onClose={onClose}>
        <View style={stil.basSatiri}>
          <Txt role="h2">{t['ui.expense.category']}</Txt>
          <IconButton icon="x" accessibilityLabel={t['ui.common.close']} onPress={onClose} />
        </View>
        <View style={{ height: rhythm.blockInCard }} />
        <View style={stil.izgara}>
          {tumu.map((kod) => {
            const k = kategoriGetir(kod);
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
                  <Txt role="label" style={stil.izgaraEtiket} numberOfLines={1}>
                    {k.ad}
                  </Txt>
                </ClayPressable>
              </View>
            );
          })}
          <View style={stil.izgaraOge}>
            <ClayPressable
              onPress={() => setYeniSheetAcik(true)}
              accessibilityLabel="Yeni Kategori Ekle"
              borderRadius={radius.tile}
              background={color.surface}
              pressedBackground={color.groove}
              shadow={clay.raised}
              gloss
              style={stil.izgaraKutu}>
              <View style={[stil.izgaraIkon, { backgroundColor: color.primarySoft }]}>
                <Icon name="plus" size={20} color={color.primary} />
              </View>
              <View style={{ height: rhythm.group }} />
              <Txt role="label" style={stil.izgaraEtiket} numberOfLines={1}>
                {'+ Yeni'}
              </Txt>
            </ClayPressable>
          </View>
        </View>
      </BottomSheet>

      <YeniKategoriSheet
        visible={yeniSheetAcik}
        onClose={() => setYeniSheetAcik(false)}
        onEklendi={(k) => {
          setOzelKategoriler(ozelKategorileriGetirSync());
          if (onYeniKategori) {
            onYeniKategori(k);
          } else {
            onSelect(k);
          }
        }}
      />
    </>
  );
}

export function YeniKategoriSheet({
  visible,
  onClose,
  onEklendi,
}: {
  visible: boolean;
  onClose: () => void;
  onEklendi: (kod: KategoriKodu) => void;
}) {
  const [ad, setAd] = useState('');
  const [seciliAile, setSeciliAile] = useState<CatFamily>('lacivert');
  const [hata, setHata] = useState<string | undefined>();
  const [kaydediliyor, setKaydediliyor] = useState(false);

  async function kaydet() {
    const temizAd = ad.trim();
    if (!temizAd) {
      setHata('Lütfen bir kategori adı girin.');
      return;
    }
    setKaydediliyor(true);
    setHata(undefined);
    try {
      const yeni = await ozelKategoriEkle(temizAd, seciliAile);
      setAd('');
      onEklendi(yeni.kod as KategoriKodu);
      onClose();
    } catch {
      setHata('Kategori eklenirken hata oluştu.');
    } finally {
      setKaydediliyor(false);
    }
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={stil.basSatiri}>
        <Txt role="h2">Yeni Kategori Ekle</Txt>
        <IconButton icon="x" accessibilityLabel={t['ui.common.close']} onPress={onClose} />
      </View>
      <View style={{ height: rhythm.blockInCard }} />
      <TextField
        label="Kategori Adı"
        value={ad}
        onChangeText={(v) => {
          setAd(v);
          if (hata) setHata(undefined);
        }}
        placeholder="Ör. Spor, Hobi, Kitap, Evcil Hayvan"
        error={hata}
        autoFocus
      />
      <View style={{ height: rhythm.group }} />
      <Txt role="label" tone={color.text2}>Renk Seç</Txt>
      <View style={{ height: rhythm.group }} />
      <View style={stil.renkSatiri}>
        {AILELER.map((a) => {
          const secili = seciliAile === a;
          const solid = catColor[a].solid;
          return (
            <Pressable
              key={a}
              onPress={() => setSeciliAile(a)}
              style={[
                stil.renkKutusu,
                { backgroundColor: solid },
                secili && stil.renkKutusuSecili,
              ]}>
              {secili ? <Icon name="check" size={20} color="#FFFFFF" /> : null}
            </Pressable>
          );
        })}
      </View>
      <View style={{ height: rhythm.section }} />
      <Button
        label="Kategori Ekle"
        variant="primary"
        loading={kaydediliyor}
        disabled={!ad.trim()}
        onPress={() => void kaydet()}
      />
      <View style={{ height: rhythm.pad }} />
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
  renkSatiri: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
  renkKutusu: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renkKutusuSecili: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
});
