import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { CategoryPicker } from '@/components/CategoryPicker';
import { MirrorWell } from '@/components/MirrorWell';
import { MoneyRow } from '@/components/MoneyRow';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { obRutinAynaFormul, t } from '@/content/metinler';
import { RUTIN_KATEGORILERI, type KategoriKodu } from '@/lib/kategoriler';
import { kurustanTutarGirisi, paraYaz, tutarGirisindenKurus } from '@/lib/para';
import type { Routine } from '@/lib/revApi';
import { color, layout, rhythm } from '@/theme/tokens';

export type RutinGirdisi = {
  ad: string;
  kategori: KategoriKodu;
  gunluk_adet: number;
  birim_fiyat_kurus: number;
};

/**
 * rev2-onboarding-kayit.md §5.2 — YENİ bileşen, `BottomSheet` varyantı.
 * ÜÇ bölge: tutamak (sabit) · form (kayan `ScrollView`, `BottomSheet`
 * içinde) · alt blok (sabit — birincil düğme klavyenin altında KALMAZ).
 *
 * `ilkAcilisMi` — yalnız 3/4'e kendiliğinden açılan İLK sheet'te `true`:
 * rutini olmayan kullanıcı sheet'i kapatmak zorunda kalmasın diye alt
 * blokta `ghost` "Rutin harcamam yok" çıkışı ekrandaki aynı adlı çıkışın
 * BİREBİR AYNI işini yapar (B4/b).
 */
export function RoutineSheet({
  visible,
  editing,
  ilkAcilisMi,
  mesgul,
  onKaydet,
  onKaldir,
  onVazgec,
  onClose,
}: {
  visible: boolean;
  editing: Routine | null;
  ilkAcilisMi: boolean;
  mesgul: boolean;
  onKaydet: (girdi: RutinGirdisi) => void;
  onKaldir?: () => void;
  onVazgec?: () => void;
  onClose: () => void;
}) {
  const [ad, setAd] = useState('');
  const [kategori, setKategori] = useState<KategoriKodu | null>(null);
  const [adet, setAdet] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [fiyatDokunuldu, setFiyatDokunuldu] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (editing) {
      setAd(editing.ad);
      setKategori(editing.kategori as KategoriKodu);
      setAdet(String(editing.gunluk_adet));
      setFiyat(kurustanTutarGirisi(editing.birim_fiyat_kurus));
    } else {
      setAd('');
      setKategori(null);
      setAdet('');
      setFiyat('');
    }
    setFiyatDokunuldu(false);
  }, [visible, editing]);

  const adetSayi = Number(adet || '0');
  const fiyatKurus = tutarGirisindenKurus(fiyat);
  const gunlukKurus = adetSayi * fiyatKurus;
  const aynaGoster = adetSayi > 0 && fiyatKurus > 0;
  const fiyatHatasi = fiyatDokunuldu && fiyatKurus <= 0 ? t['hata.rutin_fiyat_bos'] : undefined;
  const pasif = !ad.trim() || !kategori || fiyatKurus <= 0 || adetSayi <= 0;
  const duzenlemeMi = editing !== null;

  function kaydet() {
    if (pasif || mesgul || !kategori) return;
    onKaydet({ ad: ad.trim(), kategori, gunluk_adet: adetSayi, birim_fiyat_kurus: fiyatKurus });
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      footer={
        <View style={stil.altBlok}>
          <Button
            variant="primary"
            label={duzenlemeMi ? t['ob.rutin.sheet_eylem.duzenle'] : t['ob.rutin.sheet_eylem']}
            disabled={pasif}
            loading={mesgul}
            onPress={kaydet}
          />
          {duzenlemeMi && onKaldir ? (
            <>
              <View style={{ height: rhythm.group }} />
              <Button variant="ghost" label={t['ob.rutin.kaldir']} disabled={mesgul} onPress={onKaldir} />
            </>
          ) : ilkAcilisMi && onVazgec ? (
            <>
              <View style={{ height: rhythm.group }} />
              <Button variant="ghost" label={t['ob.rutin.yok']} disabled={mesgul} onPress={onVazgec} />
            </>
          ) : null}
        </View>
      }>
      <Txt role="h2">{duzenlemeMi ? t['ob.rutin.sheet_baslik.duzenle'] : t['ob.rutin.sheet_baslik']}</Txt>
      <View style={{ height: rhythm.pad }} />
      <TextField
        label={t['ob.rutin.ad']}
        placeholder={t['ob.rutin.ad_ph']}
        value={ad}
        onChangeText={setAd}
        accessibilityLabel={t['ob.rutin.ad']}
      />
      <View style={{ height: rhythm.pad }} />
      <Txt role="label" tone={color.text2}>
        {t['ob.rutin.kategori']}
      </Txt>
      <View style={{ height: rhythm.group }} />
      <View style={{ marginHorizontal: -layout.screenPaddingX }}>
        <CategoryPicker value={kategori} onChange={setKategori} secenekler={RUTIN_KATEGORILERI} />
      </View>
      <View style={{ height: rhythm.pad }} />
      <MoneyRow label={t['ob.rutin.adet']} birim="" value={adet} onChangeText={setAdet} />
      <View style={{ height: rhythm.group }} />
      <MoneyRow
        label={t['ob.rutin.fiyat']}
        birim="₺"
        value={fiyat}
        onChangeText={setFiyat}
        onBlur={() => setFiyatDokunuldu(true)}
        error={fiyatHatasi}
      />
      {aynaGoster ? (
        <>
          <View style={{ height: rhythm.pad }} />
          <MirrorWell
            baslik={t['ob.rutin.ayna_baslik']}
            tutarYazi={paraYaz(gunlukKurus * 30)}
            formulYazi={obRutinAynaFormul(adetSayi, paraYaz(fiyatKurus))}
          />
        </>
      ) : null}
    </BottomSheet>
  );
}

const stil = StyleSheet.create({
  altBlok: { paddingTop: rhythm.pad },
});
