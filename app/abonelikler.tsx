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
import { abonelikSilGovde, abonelikSatiriA11y, t } from '@/content/metinler';

export default function AboneliklerEkrani() {
  const load = useRevLoad(subscriptionsGet);
  const [sheetAcik, setSheetAcik] = useState(false);
  const [secili, setSecili] = useState<Subscription | null>(null);
  const [silinecek, setSilinecek] = useState<Subscription | null>(null);
  const [busy, setBusy] = useState(false);
  const [mesaj, setMesaj] = useState('');
  const [mesajUyari, setMesajUyari] = useState(false);

  const aktif = useMemo(() => (load.data?.abonelikler ?? [])
    .filter((abonelik) => abonelik.aktif)
    .sort((a, b) => abonelikTarihBilgisi(a.yenilenme_gunu, bugun(), a.son_odeme_gunu).gunFarki - abonelikTarihBilgisi(b.yenilenme_gunu, bugun(), b.son_odeme_gunu).gunFarki), [load.data]);
  const duraklatilan = (load.data?.abonelikler ?? []).filter((abonelik) => !abonelik.aktif);
  const aylikToplam = aktif.reduce((toplam, abonelik) => toplam + abonelik.tutar_kurus, 0);
  const siradaki = aktif[0] ? abonelikTarihBilgisi(aktif[0].yenilenme_gunu, bugun(), aktif[0].son_odeme_gunu) : null;

  function yeniAc() {
    setSecili(null);
    setMesaj('');
    setMesajUyari(false);
    setSheetAcik(true);
  }

  function duzenle(abonelik: Subscription) {
    setSecili(abonelik);
    setMesaj('');
    setMesajUyari(false);
    setSheetAcik(true);
  }

  const calistir = useCallback(async (islem: () => Promise<unknown>, basari: string) => {
    if (busy) return;
    setBusy(true);
    setMesaj('');
    setMesajUyari(false);
    try {
      await islem();
      await load.reload();
      veriDegisti();
      setSheetAcik(false);
      setMesaj(basari);
    } catch {
      setMesaj(t['ui.common.failed']);
      setMesajUyari(true);
    } finally {
      setBusy(false);
    }
  }, [busy, load]);

  async function sil() {
    if (!silinecek || busy) return;
    setBusy(true);
    setMesaj('');
    setMesajUyari(false);
    try {
      await subscriptionDelete(silinecek.id);
      await load.reload();
      veriDegisti();
      setSilinecek(null);
      setMesaj(t['ui.subscriptions.deleted']);
    } catch {
      setMesaj(t['ui.common.failed']);
      setMesajUyari(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <RevScreen title={t['ui.subscriptions.title']}>
        <LoadState {...load} />
        {load.data ? (
          <>
            <View style={stil.ozet}>
              <View style={stil.ozetKolon}>
                <Txt role="caption" tone={color.text2}>{t['ui.subscriptions.monthly_total']}</Txt>
                <View style={{ height: rhythm.sameObject }} />
                <Txt role="display">{paraYaz(aylikToplam)}</Txt>
              </View>
              <View style={stil.ozetAyrac} />
              <View style={stil.ozetKolon}>
                <Txt role="caption" tone={color.text2}>{t['ui.subscriptions.next_payment']}</Txt>
                <View style={{ height: rhythm.sameObject }} />
                <Txt role="bodyStrong" numberOfLines={1}>{siradaki ? abonelikTarihEtiketi(siradaki.siradakiGun) : t['ui.common.not_planned']}</Txt>
              </View>
            </View>

            <Button variant="primary" icon="plus" label={t['ui.subscriptions.add']} onPress={yeniAc} />

            {mesaj ? <InfoStrip variant={mesajUyari ? 'warning' : 'info'} icon={mesajUyari ? 'alert-circle' : 'check'} metin={mesaj} /> : null}

            {aktif.length > 0 ? (
              <View>
                <GrupBasligi metin={t['ui.subscriptions.upcoming']} />
                <View style={stil.liste}>
                  {aktif.map((abonelik, index) => <AbonelikSatiri key={abonelik.id} abonelik={abonelik} ayrac={index > 0} onPress={() => duzenle(abonelik)} />)}
                </View>
              </View>
            ) : duraklatilan.length > 0 ? (
              <InfoStrip variant="info" icon="calendar-clock" metin={t['ui.subscriptions.resume_prompt']} />
            ) : (
              <EmptyState icon="calendar-clock" baslik={t['ui.subscriptions.empty_prompt_title']} govde={t['ui.subscriptions.empty_prompt_body']} />
            )}

            {duraklatilan.length > 0 ? (
              <View>
                <GrupBasligi metin={t['ui.subscriptions.paused']} />
                <View style={stil.liste}>
                  {duraklatilan.map((abonelik, index) => <AbonelikSatiri key={abonelik.id} abonelik={abonelik} ayrac={index > 0} onPress={() => duzenle(abonelik)} />)}
                </View>
              </View>
            ) : null}

            <Txt role="caption" tone={color.text2}>{t['ui.subscriptions.notice']}</Txt>
          </>
        ) : null}
      </RevScreen>

      <SubscriptionSheet
        visible={sheetAcik}
        abonelik={secili}
        busy={busy}
        onClose={() => !busy && setSheetAcik(false)}
        onSave={async (abonelik) => calistir(() => subscriptionPut(abonelik), secili ? t['ui.subscriptions.updated'] : t['ui.subscriptions.added'])}
        onDeleteRequest={secili ? () => {
          setSheetAcik(false);
          setSilinecek(secili);
        } : undefined}
      />
      <Dialog
        visible={silinecek !== null}
        baslik={t['ui.subscriptions.delete_title']}
        govde={abonelikSilGovde(silinecek?.ad ?? 'Bu abonelik')}
        silEtiketi={t['ui.subscription.delete']}
        vazgecEtiketi={t['ui.common.cancel']}
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
  const durum = abonelik.aktif ? abonelikDurumEtiketi(bilgi) : t['ui.subscriptions.paused_status'];
  return (
    <>
      {ayrac ? <View style={stil.ayrac} /> : null}
      <ClayPressable
        accessibilityLabel={abonelikSatiriA11y(abonelik.ad, paraYaz(abonelik.tutar_kurus), durum)}
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
          <Txt role="caption" tone={color.text2}>{abonelik.odeme === 'kart' ? t['ui.subscriptions.pay_by_card'] : t['ui.subscriptions.pay_by_cash']} {t['ui.subscriptions.every_month_prefix']}{abonelik.yenilenme_gunu}{t['ui.subscriptions.renewal_day_suffix']}</Txt>
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
