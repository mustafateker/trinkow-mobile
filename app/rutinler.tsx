import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryIconBox } from '@/components/CategoryIconBox';
import { CategoryPicker } from '@/components/CategoryPicker';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { MoneyInput } from '@/components/MoneyInput';
import { LoadState, RevScreen, money, useRevLoad } from '@/components/RevScreen';
import { GrupBasligi, SettingGroup, SettingRow } from '@/components/SettingRow';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { kategori as kategoriGetir, type KategoriKodu } from '@/lib/kategoriler';
import { kurustanTutarGirisi, tutarGirisindenKurus } from '@/lib/para';
import { routinePut, routinesGet, yeniId, type Routine } from '@/lib/revApi';
import { color, rhythm, size } from '@/theme/tokens';
import { veriDegisti } from '@/lib/veriBus';
import { rutinGunlukOzeti, rutinKaldirA11y, rutinSatiriA11y, t } from '@/content/metinler';

const HAZIR_RUTINLER = [
  ['Kahve', 'kafe', 'ui.routines.preset.coffee'],
  ['Sigara', 'aliskanliklar', 'ui.routines.preset.smoking'],
  ['Yemek', 'restoran', 'ui.routines.preset.meal'],
  ['Ulaşım', 'ulasim', 'ui.routines.preset.transport'],
  ['Atıştırmalık', 'market', 'ui.routines.preset.snack'],
] as const;

export function RoutinePanel({ onboarding = false }: { onboarding?: boolean }) {
  const load = useRevLoad(routinesGet);
  const [ad, setAd] = useState('');
  const [amount, setAmount] = useState('');
  const [count, setCount] = useState('1');
  const [cat, setCat] = useState<KategoriKodu | null>(null);
  const [id, setId] = useState(yeniId);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  function edit(rutin: Routine) {
    setId(rutin.id);
    setAd(rutin.ad);
    setCat(rutin.kategori as KategoriKodu);
    setAmount(kurustanTutarGirisi(rutin.birim_fiyat_kurus));
    setCount(String(rutin.gunluk_adet));
  }

  function clear() {
    setId(yeniId());
    setAd('');
    setCat(null);
    setAmount('');
    setCount('1');
  }

  async function run(fn: () => Promise<unknown>, success: string = t['ui.common.saved']) {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      await fn();
      veriDegisti();
      await load.reload();
      setMessage(success);
    } catch {
      setMessage(t['ui.common.failed']);
    } finally {
      setBusy(false);
    }
  }

  const active = load.data?.rutinler.filter((rutin) => rutin.aktif) ?? [];
  const duzenleniyor = active.some((rutin) => rutin.id === id);

  return (
    <>
      <LoadState {...load} />
      {!onboarding ? (
        <View>
          <Txt role="body">{t['ui.routines.description']}</Txt>
          <View style={{ height: rhythm.blockInCard }} />
          <SettingGroup>
            <SettingRow icon="calendar-clock" iconTone="primary" baslik={t['ui.routines.monthly_subscriptions']} aciklama={t['ui.routines.subscriptions_description']} onPress={() => router.push('/abonelikler' as never)} />
          </SettingGroup>
          <View style={{ height: rhythm.section }} />
          <GrupBasligi metin={t['ui.routines.daily_routines']} />
          {HAZIR_RUTINLER.map(([name, kategoriKodu, labelKey], i) => {
            const secili = active.some((rutin) => rutin.ad === name);
            const kat = kategoriGetir(kategoriKodu);
            const label = t[labelKey];
            return (
              <View key={name}>
                {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                <SettingRow
                  leading={<CategoryIconBox kategori={kat} />}
                  baslik={label}
                  accessibilityLabel={`${label}${secili ? `, ${t['ui.routines.selected']}` : ''}`}
                  deger={secili ? <Icon name="check" size={size.iconSm} color={color.primaryText} /> : false}
                  onPress={() => {
                    const existing = active.find((rutin) => rutin.ad === name);
                    if (existing) edit(existing);
                    else {
                      clear();
                      setAd(name);
                      setCat(kategoriKodu);
                    }
                  }}
                />
              </View>
            );
          })}
          <View style={{ height: rhythm.group }} />
          <Button variant="ghost" label={t['ui.routines.custom']} onPress={clear} />
        </View>
      ) : null}

      <View>
        <GrupBasligi metin={duzenleniyor ? t['ui.routines.edit'] : t['ui.routines.add']} />
        <TextField label={t['ui.routines.name']} value={ad} onChangeText={setAd} />
        <View style={{ height: rhythm.blockInCard }} />
        <CategoryPicker value={cat} onChange={setCat} />
        <View style={{ height: rhythm.blockInCard }} />
        <TextField label={t['ui.routines.daily_quantity']} value={count} onChangeText={(value) => setCount(value.replace(/\D/g, ''))} keyboardType="number-pad" />
        <View style={{ height: rhythm.blockInCard }} />
        <MoneyInput label={t['ui.routines.unit_price']} value={amount} onChangeText={setAmount} />
        <View style={{ height: rhythm.blockInCard }} />
        <Button
          variant="primary"
          label={duzenleniyor ? t['ui.routines.save_changes'] : t['ui.routines.save']}
          loading={busy}
          disabled={!ad.trim() || !cat || Number(count) <= 0 || !Number.isSafeInteger(Number(count)) || tutarGirisindenKurus(amount) <= 0}
          onPress={() =>
            void run(async () => {
              await routinePut({
                id,
                ad: ad.trim(),
                kategori: cat!,
                gunluk_adet: Number(count),
                birim_fiyat_kurus: tutarGirisindenKurus(amount),
                aktif: true,
              });
              clear();
            }, duzenleniyor ? t['ui.routines.updated'] : t['ui.routines.added'])
          }
        />
      </View>

      {message ? (
        <Txt role="body" accessibilityLiveRegion="polite">
          {message}
        </Txt>
      ) : null}

      {/* rev3-gunluk-rutin.md §1/§9/§10.2 — günlük eylem (Aldım/Almadım) buradan
          Günlük'e (`RoutineQuickSection`) taşındı. Bu ekranda yalnız YÖNETİM
          (ekle/düzenle/kaldır, adet/fiyat) kalır. */}
      {active.length > 0 ? (
        <View>
          <GrupBasligi metin={t['ui.routines.active']} />
          {active.map((rutin, i) => {
            const kat = kategoriGetir(rutin.kategori);
            return (
              <View key={rutin.id}>
                {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                <SettingRow
                  leading={<CategoryIconBox kategori={kat} />}
                  baslik={rutin.ad}
                  aciklama={`${kat.ad} · ${rutinGunlukOzeti(rutin.gunluk_adet, money(rutin.birim_fiyat_kurus))}`}
                  onPress={() => edit(rutin)}
                  accessibilityLabel={rutinSatiriA11y(rutin.ad, kat.ad, rutin.gunluk_adet, money(rutin.birim_fiyat_kurus))}
                  deger={
                    <IconButton
                      icon="trash"
                      accessibilityLabel={rutinKaldirA11y(rutin.ad)}
                      disabled={busy}
                      onPress={() => void run(() => routinePut({ ...rutin, aktif: false }), t['ui.routines.removed'])}
                    />
                  }
                />
              </View>
            );
          })}
        </View>
      ) : null}

      {!onboarding ? <Txt role="caption">{t['ui.routines.changes_notice']}</Txt> : null}
    </>
  );
}

export default function Rutinler() {
  return (
    <RevScreen title={t['ui.settings.routines_title']}>
      <RoutinePanel />
    </RevScreen>
  );
}
