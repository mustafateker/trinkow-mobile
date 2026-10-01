import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { IconButton } from '@/components/IconButton';
import { InfoStrip } from '@/components/InfoStrip';
import { MoneyInput } from '@/components/MoneyInput';
import { SegmentedControl } from '@/components/SegmentedControl';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { bugun, type Movement } from '@/lib/revApi';
import { kurustanTutarGirisi, SIMGE, tutarGirisindenKurus } from '@/lib/para';
import { clay, color, radius, rhythm } from '@/theme/tokens';

export type BirikimGirdisi = { id: string; gun: string; tutar_kurus: number; not_metni: string };

/**
 * Bileşen envanteri §5 `SavingsSheet` (yeni ekran parçası) —
 * rev2-tasarruf-profil.md §3.7: iki kip tek sheet. `mode="create"` →
 * başlık "Birikim hareketi" + yalnız `Kaydet`; `mode="edit"` → başlık
 * "Hareketi düzenle" + `Kaydet` + `ghost` "Sil". Yön tek `SegmentedControl`
 * (eski kodun iki yarışan düğmesi kaldırıldı).
 */
export function SavingsSheet({
  visible,
  editing,
  yeniId,
  busy,
  hata,
  mevcutBakiyeKurus,
  onKaydet,
  onSil,
  onClose,
}: {
  visible: boolean;
  editing: Movement | null;
  /** Yeni kayıt için önceden üretilmiş id (idempotent PUT — K-029 deseniyle aynı). */
  yeniId: string;
  busy: boolean;
  /** Ağ/kayıt hatası — alan değil, Kaydet'in üstünde `serit-warn` (§3.7). */
  hata?: string;
  /** Bakiye doğrulaması için mevcut gerçek birikim (kuruş). */
  mevcutBakiyeKurus: number;
  onKaydet: (girdi: BirikimGirdisi) => void;
  onSil?: () => void;
  onClose: () => void;
}) {
  const [yon, setYon] = useState<'ekle' | 'cek'>('ekle');
  const [tutar, setTutar] = useState('');
  const [tarih, setTarih] = useState(bugun());
  const [not, setNot] = useState('');
  const [tutarDokunuldu, setTutarDokunuldu] = useState(false);

  const duzenlemeMi = editing !== null;

  useEffect(() => {
    if (!visible) return;
    if (editing) {
      setYon(editing.tutar_kurus < 0 ? 'cek' : 'ekle');
      setTutar(kurustanTutarGirisi(Math.abs(editing.tutar_kurus)));
      setTarih(editing.gun);
      setNot(editing.not_metni ?? '');
    } else {
      setYon('ekle');
      setTutar('');
      setTarih(bugun());
      setNot('');
    }
    setTutarDokunuldu(false);
  }, [visible, editing]);

  const tutarKurus = tutarGirisindenKurus(tutar);
  const imzaliTutar = yon === 'cek' ? -tutarKurus : tutarKurus;
  // Düzenlerken kaydın KENDİ eski etkisi bakiyeden düşülüp yeni değer eklenir.
  const bakiyeSonrasi = mevcutBakiyeKurus - (editing?.tutar_kurus ?? 0) + imzaliTutar;
  const ileriTarihMi = tarih > bugun();

  const tutarHatasi = !tutarDokunuldu
    ? undefined
    : tutarKurus <= 0
      ? t['birikimSheet.hata.tutarBos']
      : bakiyeSonrasi < 0
        ? t['birikimSheet.hata.bakiye']
        : undefined;

  const pasif = tutarKurus <= 0 || bakiyeSonrasi < 0 || ileriTarihMi;

  function kaydet() {
    setTutarDokunuldu(true);
    if (pasif || busy) return;
    onKaydet({ id: editing?.id ?? yeniId, gun: tarih, tutar_kurus: imzaliTutar, not_metni: not.trim() });
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      footer={
        <View style={stil.altBlok}>
          {hata ? (
            <>
              <InfoStrip variant="warning" metin={hata} textTone={color.warningInk} />
              <View style={{ height: rhythm.group }} />
            </>
          ) : null}
          <Button
            variant="primary"
            label={t['birikimSheet.kaydet']}
            loadingLabel={t['birikimSheet.kaydediliyor']}
            disabled={pasif}
            loading={busy}
            onPress={kaydet}
          />
          {duzenlemeMi && onSil ? (
            <>
              <View style={{ height: rhythm.group }} />
              <Button variant="ghost" label={t['birikimSheet.sil']} disabled={busy} onPress={onSil} />
            </>
          ) : null}
        </View>
      }>
      <View style={stil.baslikSatiri}>
        <Txt role="h2" style={stil.esnek}>
          {duzenlemeMi ? t['birikimSheet.baslik.duzenle'] : t['birikimSheet.baslik.ekle']}
        </Txt>
        <IconButton icon="x" accessibilityLabel={t['eylem.kapat']} onPress={onClose} />
      </View>
      <View style={{ height: rhythm.pad }} />
      <SegmentedControl
        secenekler={[
          { value: 'ekle', label: t['birikimSheet.segment.ekle'] },
          { value: 'cek', label: t['birikimSheet.segment.cek'] },
        ]}
        deger={yon}
        onChange={setYon}
      />
      <View style={{ height: rhythm.pad }} />
      <Txt role="label" tone={color.text2}>
        {t['birikimSheet.tutar']}
      </Txt>
      <View style={{ height: rhythm.group }} />
      <View style={[stil.tutarKuyu, tutarHatasi ? { boxShadow: `${clay.sunken}, 0 0 0 2px ${color.danger}` } : { boxShadow: clay.sunken }]}>
        <MoneyInput
          hideLabel
          value={tutar}
          onChangeText={setTutar}
          onBlur={() => setTutarDokunuldu(true)}
          label={t['birikimSheet.tutar']}
          style={stil.tutarGirdi}
        />
        <Txt role="amount" tone={color.text2}>
          {SIMGE}
        </Txt>
      </View>
      {tutarHatasi ? (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={color.dangerInk}>
            {tutarHatasi}
          </Txt>
        </>
      ) : null}
      <View style={{ height: rhythm.pad }} />
      <DateField gun={tarih} onChange={setTarih} label={t['birikimSheet.tarih']} hata={ileriTarihMi} />
      {ileriTarihMi ? (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={color.dangerInk}>
            {t['birikimSheet.hata.ileriTarih']}
          </Txt>
        </>
      ) : null}
      <View style={{ height: rhythm.pad }} />
      <TextField
        label={t['birikimSheet.not']}
        placeholder={t['birikimSheet.notPlaceholder']}
        placeholderTone={color.text2}
        value={not}
        onChangeText={setNot}
        accessibilityLabel={t['birikimSheet.not']}
      />
    </BottomSheet>
  );
}

const stil = StyleSheet.create({
  altBlok: { paddingTop: rhythm.pad },
  baslikSatiri: { flexDirection: 'row', alignItems: 'center' },
  esnek: { flex: 1, minWidth: 0 },
  tutarKuyu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: radius.tile,
    backgroundColor: color.well,
  },
  tutarGirdi: { fontSize: 32, lineHeight: 38, textAlign: 'right', flexShrink: 1, minWidth: 40 },
});
