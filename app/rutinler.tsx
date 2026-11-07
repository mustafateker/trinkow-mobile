import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryIconBox } from '@/components/CategoryIconBox';
import { CategoryPicker } from '@/components/CategoryPicker';
import { ClayPressable } from '@/components/ClayPressable';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { MoneyInput } from '@/components/MoneyInput';
import { LoadState, RevScreen, money, useRevLoad } from '@/components/RevScreen';
import { GrupBasligi, SettingGroup, SettingRow } from '@/components/SettingRow';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { aileRenkleri, kategori as kategoriGetir, type KategoriKodu } from '@/lib/kategoriler';
import { kurustanTutarGirisi, tutarGirisindenKurus } from '@/lib/para';
import { routinePut, routinesGet, yeniId, type Routine } from '@/lib/revApi';
import { clay, color, radius, rhythm } from '@/theme/tokens';
import { veriDegisti } from '@/lib/veriBus';
import { posthog } from '@/config/posthog';
import { rutinGunlukOzeti, rutinKaldirA11y, rutinSatiriA11y, t } from '@/content/metinler';
import { butunDillerde } from '@/i18n/cekirdek';
import { useDil } from '@/i18n/useDil';

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

  async function run(
    fn: () => Promise<unknown>,
    success: string = t['ui.common.saved'],
    captureProperties?: { action: 'created' | 'updated'; category: KategoriKodu | null },
  ) {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      await fn();
      if (captureProperties) posthog?.capture('routine_saved', captureProperties);
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
          <GrupBasligi metin={t['ui.routines.daily_routines']} />
          <View style={{ height: rhythm.group }} />
          <View style={stil.hazirIzgara}>
            {HAZIR_RUTINLER.map(([name, kategoriKodu, labelKey]) => {
              // Öneri aktif dildeki adla kaydedilir; "zaten eklendi" eşleşmesi önerinin
              // BÜTÜN dillerdeki adlarıyla yapılır (Türkçe'yken eklenen "Kahve",
              // uygulama İngilizce'yken "Coffee" önerisini işaretli gösterir).
              const adlar = [name, ...butunDillerde(labelKey)];
              const existing = active.find((rutin) => adlar.includes(rutin.ad));
              const secili = Boolean(existing);
              const label = t[labelKey];
              const suAnSecili = existing ? id === existing.id : cat === kategoriKodu && ad === label;
              const kat = kategoriGetir(kategoriKodu);
              const renk = aileRenkleri(kat.aile);

              return (
                <View key={name} style={stil.hazirOge}>
                  <ClayPressable
                    onPress={() => {
                      if (existing) edit(existing);
                      else {
                        clear();
                        setAd(label);
                        setCat(kategoriKodu);
                      }
                    }}
                    accessibilityLabel={`${label}${secili ? `, ${t['ui.routines.selected']}` : ''}`}
                    selected={suAnSecili}
                    borderRadius={radius.tile}
                    background={suAnSecili ? color.primarySoft : color.surface}
                    shadow={suAnSecili ? clay.sunken : clay.raised}
                    style={[
                      stil.hazirKart,
                      suAnSecili ? stil.hazirKartSecili : null,
                    ]}>
                    {secili ? (
                      <View style={stil.rozet}>
                        <Icon name="check" size={20} color={color.onPrimary} />
                      </View>
                    ) : null}
                    <View style={[stil.kartIkon, { backgroundColor: renk.soft }]}>
                      <Icon name={kat.ikon} size={20} color={renk.solid} />
                    </View>
                    <View style={{ height: 6 }} />
                    <View style={stil.baslikAlani}>
                      <Txt role="label" numberOfLines={2} style={stil.kartBaslik}>
                        {label}
                      </Txt>
                    </View>
                  </ClayPressable>
                </View>
              );
            })}
            <View style={stil.hazirOge}>
              <ClayPressable
                onPress={clear}
                accessibilityLabel={t['ui.routines.custom']}
                borderRadius={radius.tile}
                background={!duzenleniyor && !cat && !ad ? color.primarySoft : color.surface}
                shadow={!duzenleniyor && !cat && !ad ? clay.sunken : clay.raised}
                style={[
                  stil.hazirKart,
                  !duzenleniyor && !cat && !ad ? stil.hazirKartSecili : null,
                ]}>
                <View style={[stil.kartIkon, { backgroundColor: color.primarySoft }]}>
                  <Icon name="plus" size={20} color={color.primaryText} />
                </View>
                <View style={{ height: 6 }} />
                <View style={stil.baslikAlani}>
                  <Txt role="label" numberOfLines={2} style={stil.kartBaslik}>
                    {t['ui.routines.custom']}
                  </Txt>
                </View>
              </ClayPressable>
            </View>
          </View>
          <View style={{ height: rhythm.section }} />
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
            }, duzenleniyor ? t['ui.routines.updated'] : t['ui.routines.added'], {
              action: duzenleniyor ? 'updated' : 'created',
              category: cat,
            })
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
          <View style={{ height: rhythm.group }} />
          <SettingGroup>
            {active.map((rutin) => {
              const kat = kategoriGetir(rutin.kategori);
              return (
                <SettingRow
                  key={rutin.id}
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
              );
            })}
          </SettingGroup>
        </View>
      ) : null}

      {!onboarding ? <Txt role="caption">{t['ui.routines.changes_notice']}</Txt> : null}
    </>
  );
}

export default function Rutinler() {
  useDil();
  return (
    <RevScreen title={t['ui.settings.routines_title']}>
      <RoutinePanel />
    </RevScreen>
  );
}

const stil = StyleSheet.create({
  hazirIzgara: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  hazirOge: {
    width: '33.333%',
    padding: 4,
  },
  hazirKart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 88,
    position: 'relative',
  },
  hazirKartSecili: {
    borderWidth: 1.5,
    borderColor: color.primary,
  },
  kartIkon: {
    width: 38,
    height: 38,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: clay.sunken,
  },
  baslikAlani: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kartBaslik: {
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  rozet: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: color.success,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
