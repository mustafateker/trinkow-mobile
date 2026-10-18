import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { ClayPressable } from '@/components/ClayPressable';
import { InfoStrip } from '@/components/InfoStrip';
import { MoneyInput } from '@/components/MoneyInput';
import { SearchField } from '@/components/SearchField';
import { SegmentedControl } from '@/components/SegmentedControl';
import { SettingRow } from '@/components/SettingRow';
import { SubscriptionBrandLogo } from '@/components/SubscriptionBrandLogo';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import {
  ABONELIK_MARKALARI,
  abonelikMarkalariniAra,
  abonelikMarkasiBul,
  populerAbonelikMarkalari,
  type SubscriptionBrand,
} from '@/lib/abonelikMarkalari';
import { kurustanTutarGirisi, tutarGirisindenKurus } from '@/lib/para';
import { yeniId, type Subscription } from '@/lib/revApi';
import { color, radius, rhythm } from '@/theme/tokens';

const ODEME = [
  { value: 'kart' as const, label: 'Kart', icon: 'credit-card' as const },
  { value: 'nakit' as const, label: 'Nakit', icon: 'banknote' as const },
];

const DIGER_MARKA = ABONELIK_MARKALARI.find((marka) => marka.id === 'diger')!;

export function SubscriptionSheet({
  visible,
  abonelik,
  busy,
  onClose,
  onSave,
  onDeleteRequest,
}: {
  visible: boolean;
  abonelik: Subscription | null;
  busy: boolean;
  onClose: () => void;
  onSave: (abonelik: Omit<Subscription, 'son_odeme_gunu'>) => Promise<void>;
  onDeleteRequest?: () => void;
}) {
  const [id, setId] = useState(yeniId);
  const [ad, setAd] = useState('');
  const [saglayici, setSaglayici] = useState<string>('diger');
  const [arama, setArama] = useState('');
  const [tutar, setTutar] = useState('');
  const [gun, setGun] = useState('');
  const [odeme, setOdeme] = useState<'kart' | 'nakit'>('kart');
  const [aktif, setAktif] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setId(abonelik?.id ?? yeniId());
    setAd(abonelik?.ad ?? '');
    setSaglayici(abonelikMarkasiBul(abonelik?.saglayici, abonelik?.ad ?? '').id);
    setArama('');
    setTutar(abonelik ? kurustanTutarGirisi(abonelik.tutar_kurus) : '');
    setGun(abonelik ? String(abonelik.yenilenme_gunu) : '');
    setOdeme(abonelik?.odeme ?? 'kart');
    setAktif(abonelik?.aktif ?? true);
  }, [visible, abonelik]);

  const yenilenmeGunu = Number(gun);
  const aramaSonuclari = useMemo(() => abonelikMarkalariniAra(arama), [arama]);
  const populerMarkalar = useMemo(() => populerAbonelikMarkalari(), []);
  const gecerli = ad.trim().length > 0 && tutarGirisindenKurus(tutar) > 0 && Number.isInteger(yenilenmeGunu) && yenilenmeGunu >= 1 && yenilenmeGunu <= 31;

  function markaSec(marka: SubscriptionBrand) {
    setSaglayici(marka.id);
    setAd(marka.id === 'diger' ? '' : marka.ad);
    setArama('');
  }

  function ozelAbonelikSec() {
    const ozelAd = arama.trim();
    if (!ozelAd) return;
    setSaglayici('diger');
    setAd(ozelAd);
    setArama('');
  }

  function markaKartlari(markalar: readonly SubscriptionBrand[]) {
    return (
      <View style={stil.markaIzgara}>
        {markalar.map((marka) => {
          const secili = saglayici === marka.id;
          return (
            <ClayPressable
              key={marka.id}
              accessibilityLabel={`${marka.ad}${secili ? ', seçili' : ''}`}
              selected={secili}
              onPress={() => markaSec(marka)}
              borderRadius={radius.tile}
              shadow="none"
              background={secili ? color.primarySoft : color.surface}
              pressedBackground={color.groove}
              style={[stil.markaKart, secili ? stil.markaKartSecili : null]}>
              <SubscriptionBrandLogo marka={marka} size={40} />
              <View style={{ height: rhythm.group }} />
              <Txt role="micro" tone={secili ? color.primaryText : color.text} numberOfLines={2} style={stil.markaAdi}>{marka.ad}</Txt>
            </ClayPressable>
          );
        })}
      </View>
    );
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      footer={
        <View style={stil.footer}>
          <Button
            variant="primary"
            label={abonelik ? 'Değişiklikleri kaydet' : 'Aboneliği kaydet'}
            loading={busy}
            disabled={!gecerli}
            onPress={() => void onSave({ id, ad: ad.trim(), saglayici, tutar_kurus: tutarGirisindenKurus(tutar), yenilenme_gunu: yenilenmeGunu, odeme, aktif })}
          />
          {abonelik && onDeleteRequest ? (
            <>
              <View style={{ height: rhythm.group }} />
              <Button
                variant="danger"
                icon="trash"
                label="Aboneliği sil"
                disabled={busy}
                onPress={onDeleteRequest}
              />
            </>
          ) : null}
        </View>
      }>
      <Txt role="h2">{abonelik ? 'Aboneliği düzenle' : 'Abonelik ekle'}</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <Txt role="bodyStrong">Aboneliğini bul</Txt>
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="caption">Dünya genelindeki popüler servislerde ara. Logosu kaydında ve ödeme listende görünür.</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <SearchField
        deger={arama}
        onDegerDegisti={setArama}
        secili={null}
        onKaldir={() => setArama('')}
        placeholder="Netflix, Spotify, ChatGPT…"
        accessibilityLabel="Abonelik ara"
        temizleEtiketi="Aramayı temizle"
        kaldirEtiketi="Seçimi kaldır"
      />
      <View style={{ height: rhythm.blockInCard }} />
      {arama.trim() ? (
        <>
          <View style={stil.bolumBasligi}>
            <Txt role="bodyStrong">Arama sonuçları</Txt>
            <Txt role="caption" tone={color.text2}>{aramaSonuclari.length} servis</Txt>
          </View>
          <View style={{ height: rhythm.group }} />
          {aramaSonuclari.length > 0 ? markaKartlari(aramaSonuclari) : (
            <Txt role="caption" tone={color.text2}>Bu adla eşleşen hazır bir servis bulamadık.</Txt>
          )}
          <View style={{ height: rhythm.group }} />
          <ClayPressable
            accessibilityLabel={`${arama.trim()} adıyla abonelik ekle`}
            onPress={ozelAbonelikSec}
            borderRadius={radius.tile}
            shadow="none"
            background={color.primarySoft}
            pressedBackground={color.groove}
            style={stil.ozelSecim}>
            <SubscriptionBrandLogo marka={DIGER_MARKA} size={40} />
            <View style={stil.ozelMetin}>
              <Txt role="bodyStrong" numberOfLines={1}>“{arama.trim()}” adıyla ekle</Txt>
              <Txt role="caption" tone={color.text2}>Katalogda yoksa kendi aboneliğini oluştur</Txt>
            </View>
          </ClayPressable>
        </>
      ) : (
        <>
          <View style={stil.bolumBasligi}>
            <Txt role="bodyStrong">Dünya genelinde popüler</Txt>
            <Txt role="caption" tone={color.text2}>Hızlı seçim</Txt>
          </View>
          <View style={{ height: rhythm.group }} />
          {markaKartlari(populerMarkalar)}
          <View style={{ height: rhythm.group }} />
          <ClayPressable
            accessibilityLabel="Listede olmayan başka bir abonelik ekle"
            onPress={() => markaSec(DIGER_MARKA)}
            borderRadius={radius.tile}
            shadow="none"
            background={saglayici === 'diger' ? color.primarySoft : color.surface}
            pressedBackground={color.groove}
            style={[stil.digerSecim, saglayici === 'diger' ? stil.markaKartSecili : null]}>
            <SubscriptionBrandLogo marka={DIGER_MARKA} size={40} />
            <View style={stil.ozelMetin}>
              <Txt role="bodyStrong">Diğer</Txt>
              <Txt role="caption" tone={color.text2}>Listede olmayan bir abonelik ekle</Txt>
            </View>
          </ClayPressable>
        </>
      )}
      <View style={{ height: rhythm.blockInCard }} />
      <TextField label="Abonelik adı" value={ad} onChangeText={setAd} />
      <View style={{ height: rhythm.blockInCard }} />
      <MoneyInput label="Aylık ücret · ₺" value={tutar} onChangeText={setTutar} />
      <View style={{ height: rhythm.blockInCard }} />
      <TextField label="Her ay yenilenme günü · 1–31" value={gun} onChangeText={(deger) => setGun(deger.replace(/\D/g, '').slice(0, 2))} keyboardType="number-pad" />
      <View style={{ height: rhythm.blockInCard }} />
      <SegmentedControl secenekler={ODEME} deger={odeme} onChange={setOdeme} />
      {abonelik ? (
        <>
          <View style={{ height: rhythm.blockInCard }} />
          <SettingRow
            icon="repeat"
            iconTone="primary"
            baslik="Takibi açık tut"
            aciklama={aktif ? 'Yenilenme listesinde gösterilir' : 'Duraklatıldı; toplamdan çıkarılır'}
            anahtarDegeri={aktif}
            onAnahtarDegistir={() => setAktif((deger) => !deger)}
          />
        </>
      ) : null}
      <View style={{ height: rhythm.blockInCard }} />
      <InfoStrip variant="info" icon="info" metin="Banka hesabınla otomatik eşleşmez. Ödeme gerçekleşince bu ay ödendi olarak işaretleyebilirsin." />
      <View style={{ height: rhythm.pad }} />
    </BottomSheet>
  );
}

const stil = StyleSheet.create({
  markaIzgara: { flexDirection: 'row', flexWrap: 'wrap', gap: rhythm.group },
  markaKart: { width: '31%', minHeight: 88, padding: rhythm.group, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: color.line },
  markaKartSecili: { borderWidth: 2, borderColor: color.primary },
  markaAdi: { minHeight: 32, textAlign: 'center' },
  bolumBasligi: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: rhythm.group },
  ozelSecim: { minHeight: 68, padding: rhythm.group, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: color.primary },
  digerSecim: { minHeight: 68, padding: rhythm.group, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: color.line },
  ozelMetin: { flex: 1, minWidth: 0, marginLeft: rhythm.blockInCard },
  footer: { paddingHorizontal: rhythm.pad + rhythm.group, paddingTop: rhythm.blockInCard },
});
