import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ClayPressable } from '@/components/ClayPressable';
import { Dialog } from '@/components/Dialog';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { InfoStrip } from '@/components/InfoStrip';
import { LoadState, RevScreen, useRevLoad } from '@/components/RevScreen';
import { SubscriptionBrandLogo } from '@/components/SubscriptionBrandLogo';
import { SubscriptionSheet } from '@/components/SubscriptionSheet';
import { GrupBasligi } from '@/components/SettingRow';
import { Txt } from '@/components/Txt';
import { abonelikDurumEtiketi, abonelikTarihBilgisi, abonelikTarihEtiketi } from '@/lib/abonelik';
import { abonelikMarkasiBul } from '@/lib/abonelikMarkalari';
import { paraYaz } from '@/lib/para';
import { bugun, subscriptionDelete, subscriptionPut, subscriptionsGet, type Subscription } from '@/lib/revApi';
import { veriDegisti } from '@/lib/veriBus';
import { color, radius, rhythm, size } from '@/theme/tokens';

export default function AboneliklerEkrani() {
  const load = useRevLoad(subscriptionsGet);
  const [sheetAcik, setSheetAcik] = useState(false);
  const [secili, setSecili] = useState<Subscription | null>(null);
  const [silinecek, setSilinecek] = useState<Subscription | null>(null);
  const [busy, setBusy] = useState(false);
  const [mesaj, setMesaj] = useState('');

  const aktif = useMemo(() => (load.data?.abonelikler ?? [])
    .filter((abonelik) => abonelik.aktif)
    .sort((a, b) => abonelikTarihBilgisi(a.yenilenme_gunu, bugun(), a.son_odeme_gunu).gunFarki - abonelikTarihBilgisi(b.yenilenme_gunu, bugun(), b.son_odeme_gunu).gunFarki), [load.data]);
  const duraklatilan = (load.data?.abonelikler ?? []).filter((abonelik) => !abonelik.aktif);
  const aylikToplam = aktif.reduce((toplam, abonelik) => toplam + abonelik.tutar_kurus, 0);
  const siradaki = aktif[0] ? abonelikTarihBilgisi(aktif[0].yenilenme_gunu, bugun(), aktif[0].son_odeme_gunu) : null;

  function yeniAc() {
    setSecili(null);
    setMesaj('');
    setSheetAcik(true);
  }

  function duzenle(abonelik: Subscription) {
    setSecili(abonelik);
    setMesaj('');
    setSheetAcik(true);
  }

  const calistir = useCallback(async (islem: () => Promise<unknown>, basari: string) => {
    if (busy) return;
    setBusy(true);
    setMesaj('');
    try {
      await islem();
      await load.reload();
      veriDegisti();
      setSheetAcik(false);
      setMesaj(basari);
    } catch {
      setMesaj('İşlem tamamlanamadı. Bağlantını kontrol edip yeniden dene.');
    } finally {
      setBusy(false);
    }
  }, [busy, load]);

  async function sil() {
    if (!silinecek || busy) return;
    setBusy(true);
    setMesaj('');
    try {
      await subscriptionDelete(silinecek.id);
      await load.reload();
      veriDegisti();
      setSilinecek(null);
      setMesaj('Abonelik silindi. Geçmiş gider kayıtların korundu.');
    } catch {
      setMesaj('İşlem tamamlanamadı. Bağlantını kontrol edip yeniden dene.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <RevScreen title="Aboneliklerim">
        <LoadState {...load} />
        {load.data ? (
          <>
            <View style={stil.ozet}>
              <View style={stil.ozetKolon}>
                <Txt role="caption" tone={color.text2}>Aylık toplam</Txt>
                <View style={{ height: rhythm.sameObject }} />
                <Txt role="display">{paraYaz(aylikToplam)}</Txt>
              </View>
              <View style={stil.ozetAyrac} />
              <View style={stil.ozetKolon}>
                <Txt role="caption" tone={color.text2}>Sıradaki ödeme</Txt>
                <View style={{ height: rhythm.sameObject }} />
                <Txt role="bodyStrong" numberOfLines={1}>{siradaki ? abonelikTarihEtiketi(siradaki.siradakiGun) : 'Planlanmadı'}</Txt>
              </View>
            </View>

            <Button variant="primary" icon="plus" label="Abonelik ekle" onPress={yeniAc} />

            {mesaj ? <InfoStrip variant={mesaj.startsWith('İşlem') ? 'warning' : 'info'} icon={mesaj.startsWith('İşlem') ? 'alert-circle' : 'check'} metin={mesaj} /> : null}

            {aktif.length > 0 ? (
              <View>
                <GrupBasligi metin="Yaklaşan ödemeler" />
                <View style={stil.liste}>
                  {aktif.map((abonelik, index) => <AbonelikSatiri key={abonelik.id} abonelik={abonelik} ayrac={index > 0} onPress={() => duzenle(abonelik)} />)}
                </View>
              </View>
            ) : duraklatilan.length > 0 ? (
              <InfoStrip variant="info" icon="calendar-clock" metin="Aktif aboneliğin yok. Duraklatılan bir aboneliğe dokunup takibi yeniden açabilirsin." />
            ) : (
              <EmptyState icon="calendar-clock" baslik="Aylık ödemelerini tek yerde gör" govde="YouTube, yapay zeka veya diğer aboneliklerini ekle; yenilenme gününü kaçırma." />
            )}

            {duraklatilan.length > 0 ? (
              <View>
                <GrupBasligi metin="Duraklatılanlar" />
                <View style={stil.liste}>
                  {duraklatilan.map((abonelik, index) => <AbonelikSatiri key={abonelik.id} abonelik={abonelik} ayrac={index > 0} onPress={() => duzenle(abonelik)} />)}
                </View>
              </View>
            ) : null}

            <Txt role="caption" tone={color.text2}>Yenilenme gününde Bugün ekranındaki + düğmesine dokunduğunda ücret giderlerine işlenir. Banka işlemleri otomatik doğrulanmaz.</Txt>
          </>
        ) : null}
      </RevScreen>

      <SubscriptionSheet
        visible={sheetAcik}
        abonelik={secili}
        busy={busy}
        onClose={() => !busy && setSheetAcik(false)}
        onSave={async (abonelik) => calistir(() => subscriptionPut(abonelik), secili ? 'Abonelik güncellendi.' : 'Abonelik eklendi.')}
        onDeleteRequest={secili ? () => {
          setSheetAcik(false);
          setSilinecek(secili);
        } : undefined}
      />
      <Dialog
        visible={silinecek !== null}
        baslik="Abonelik silinsin mi?"
        govde={`${silinecek?.ad ?? 'Bu abonelik'} takip listesinden kaldırılacak. Geçmiş gider kayıtların silinmeyecek.`}
        silEtiketi="Aboneliği sil"
        vazgecEtiketi="Vazgeç"
        siliniyor={busy}
        onSil={() => void sil()}
        onVazgec={() => !busy && setSilinecek(null)}
      />
    </>
  );
}

function AbonelikSatiri({ abonelik, ayrac, onPress }: { abonelik: Subscription; ayrac: boolean; onPress: () => void }) {
  const bilgi = abonelikTarihBilgisi(abonelik.yenilenme_gunu, bugun(), abonelik.son_odeme_gunu);
  const marka = abonelikMarkasiBul(abonelik.saglayici, abonelik.ad);
  const ton = !abonelik.aktif ? color.text2 : bilgi.durum === 'gecikti' ? color.warningInk : bilgi.durum === 'odendi' ? color.successInk : color.primaryText;
  const zemin = !abonelik.aktif ? color.groove : bilgi.durum === 'gecikti' ? color.warningSoft : bilgi.durum === 'odendi' ? color.successSoft : color.primarySoft;
  const durum = abonelik.aktif ? abonelikDurumEtiketi(bilgi) : 'Takip duraklatıldı';
  return (
    <>
      {ayrac ? <View style={stil.ayrac} /> : null}
      <ClayPressable
        accessibilityLabel={`${abonelik.ad}, ${paraYaz(abonelik.tutar_kurus)}, ${durum}. Düzenle.`}
        onPress={onPress}
        shadow="none"
        borderRadius={radius.tile}
        style={stil.satir}>
        <SubscriptionBrandLogo marka={marka} />
        <View style={stil.satirMetin}>
          <View style={stil.satirUst}>
            <Txt role="bodyStrong" numberOfLines={1} style={stil.esnek}>{abonelik.ad}</Txt>
            <Txt role="amount">{paraYaz(abonelik.tutar_kurus)}</Txt>
          </View>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="caption" tone={color.text2}>{abonelik.odeme === 'kart' ? 'Kart' : 'Nakit'} · Her ayın {abonelik.yenilenme_gunu}. günü</Txt>
          <View style={{ height: rhythm.group }} />
          <View style={[stil.durum, { backgroundColor: zemin }]}><Txt role="micro" tone={ton}>{durum}</Txt></View>
        </View>
        <Icon name="chevron-right" size={size.iconSm} color={color.text2} />
      </ClayPressable>
    </>
  );
}

const stil = StyleSheet.create({
  ozet: { flexDirection: 'row', alignItems: 'stretch', padding: rhythm.pad, borderWidth: 1, borderColor: color.line, borderRadius: radius.card, backgroundColor: color.surface },
  ozetKolon: { flex: 1, minWidth: 0 },
  ozetAyrac: { width: 1, backgroundColor: color.line, marginHorizontal: rhythm.pad },
  liste: { borderWidth: 1, borderColor: color.line, borderRadius: radius.tile, overflow: 'hidden', backgroundColor: color.surface },
  satir: { flexDirection: 'row', alignItems: 'center', minHeight: 92, padding: rhythm.blockInCard, backgroundColor: color.surface },
  satirMetin: { flex: 1, minWidth: 0, marginHorizontal: rhythm.blockInCard },
  satirUst: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
  esnek: { flex: 1, minWidth: 0 },
  durum: { alignSelf: 'flex-start', minHeight: 24, justifyContent: 'center', paddingHorizontal: rhythm.group, borderRadius: radius.pill },
  ayrac: { height: 1, marginLeft: 68, backgroundColor: color.line },
});
