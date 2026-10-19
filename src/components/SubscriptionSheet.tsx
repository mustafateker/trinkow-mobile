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
import { abonelikAdiylaEkle, abonelikServisSayisi, t } from '@/content/metinler';
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
  const odemeSecenekleri = [
    { value: 'kart' as const, label: t['ekle.odeme.kart'], icon: 'credit-card' as const },
    { value: 'nakit' as const, label: t['ekle.odeme.nakit'], icon: 'banknote' as const },
  ];

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
              accessibilityLabel={`${marka.ad}${secili ? `, ${t['ui.subscriptions.selected']}` : ''}`}
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
            label={abonelik ? t['ui.subscriptions.save_changes'] : t['ui.subscriptions.save']}
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
                label={t['ui.subscription.delete']}
                disabled={busy}
                onPress={onDeleteRequest}
              />
            </>
          ) : null}
        </View>
      }>
      <Txt role="h2">{abonelik ? t['ui.subscriptions.edit'] : t['ui.subscriptions.add']}</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <Txt role="bodyStrong">{t['ui.subscription.find']}</Txt>
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="caption">{t['ui.subscription.search_help']}</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <SearchField
        deger={arama}
        onDegerDegisti={setArama}
        secili={null}
        onKaldir={() => setArama('')}
        placeholder="Netflix, Spotify, ChatGPT…"
        accessibilityLabel={t['ui.subscription.search']}
        temizleEtiketi={t['a11y.ekle.aramaTemizle']}
        kaldirEtiketi={t['ui.subscription.remove_selection']}
      />
      <View style={{ height: rhythm.blockInCard }} />
      {arama.trim() ? (
        <>
          <View style={stil.bolumBasligi}>
            <Txt role="bodyStrong">{t['ui.subscription.results']}</Txt>
            <Txt role="caption" tone={color.text2}>{abonelikServisSayisi(aramaSonuclari.length)}</Txt>
          </View>
          <View style={{ height: rhythm.group }} />
          {aramaSonuclari.length > 0 ? markaKartlari(aramaSonuclari) : (
            <Txt role="caption" tone={color.text2}>{t['ui.subscription.not_found']}</Txt>
          )}
          <View style={{ height: rhythm.group }} />
          <ClayPressable
            accessibilityLabel={abonelikAdiylaEkle(arama.trim())}
            onPress={ozelAbonelikSec}
            borderRadius={radius.tile}
            shadow="none"
            background={color.primarySoft}
            pressedBackground={color.groove}
            style={stil.ozelSecim}>
            <SubscriptionBrandLogo marka={DIGER_MARKA} size={40} />
            <View style={stil.ozelMetin}>
              <Txt role="bodyStrong" numberOfLines={1}>{abonelikAdiylaEkle(arama.trim())}</Txt>
              <Txt role="caption" tone={color.text2}>{t['ui.subscription.custom_hint']}</Txt>
            </View>
          </ClayPressable>
        </>
      ) : (
        <>
          <View style={stil.bolumBasligi}>
            <Txt role="bodyStrong">{t['ui.subscription.popular']}</Txt>
            <Txt role="caption" tone={color.text2}>{t['ui.subscription.quick_pick']}</Txt>
          </View>
          <View style={{ height: rhythm.group }} />
          {markaKartlari(populerMarkalar)}
          <View style={{ height: rhythm.group }} />
          <ClayPressable
            accessibilityLabel={t['ui.subscription.other_accessibility']}
            onPress={() => markaSec(DIGER_MARKA)}
            borderRadius={radius.tile}
            shadow="none"
            background={saglayici === 'diger' ? color.primarySoft : color.surface}
            pressedBackground={color.groove}
            style={[stil.digerSecim, saglayici === 'diger' ? stil.markaKartSecili : null]}>
            <SubscriptionBrandLogo marka={DIGER_MARKA} size={40} />
            <View style={stil.ozelMetin}>
              <Txt role="bodyStrong">{t['ui.subscription.other']}</Txt>
              <Txt role="caption" tone={color.text2}>{t['ui.subscription.other_hint']}</Txt>
            </View>
          </ClayPressable>
        </>
      )}
      <View style={{ height: rhythm.blockInCard }} />
      <TextField label={t['ui.subscription.name']} value={ad} onChangeText={setAd} />
      <View style={{ height: rhythm.blockInCard }} />
      <MoneyInput label={t['ui.subscription.monthly_price']} value={tutar} onChangeText={setTutar} />
      <View style={{ height: rhythm.blockInCard }} />
      <TextField label={t['ui.subscription.renewal_day']} value={gun} onChangeText={(deger) => setGun(deger.replace(/\D/g, '').slice(0, 2))} keyboardType="number-pad" />
      <View style={{ height: rhythm.blockInCard }} />
      <SegmentedControl secenekler={odemeSecenekleri} deger={odeme} onChange={setOdeme} />
      {abonelik ? (
        <>
          <View style={{ height: rhythm.blockInCard }} />
          <SettingRow
            icon="repeat"
            iconTone="primary"
            baslik={t['ui.subscription.keep_tracking']}
            aciklama={aktif ? t['ui.subscriptions.show_in_renewal_list'] : t['ui.subscriptions.paused_total']}
            anahtarDegeri={aktif}
            onAnahtarDegistir={() => setAktif((deger) => !deger)}
          />
        </>
      ) : null}
      <View style={{ height: rhythm.blockInCard }} />
      <InfoStrip variant="info" icon="info" metin={t['ui.subscription.payment_notice']} />
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
