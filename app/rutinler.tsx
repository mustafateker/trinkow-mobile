import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryIconBox } from '@/components/CategoryIconBox';
import { CategoryPicker } from '@/components/CategoryPicker';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { MoneyInput } from '@/components/MoneyInput';
import { LoadState, RevScreen, money, useRevLoad } from '@/components/RevScreen';
import { GrupBasligi, SettingRow } from '@/components/SettingRow';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { kategori as kategoriGetir, type KategoriKodu } from '@/lib/kategoriler';
import { kurustanTutarGirisi, tutarGirisindenKurus } from '@/lib/para';
import { routinePut, routinesGet, yeniId, type Routine } from '@/lib/revApi';
import { color, rhythm, size } from '@/theme/tokens';
import { veriDegisti } from '@/lib/veriBus';

const HAZIR_RUTINLER: [string, KategoriKodu][] = [
  ['Kahve', 'kafe'],
  ['Sigara', 'aliskanliklar'],
  ['Yemek', 'restoran'],
  ['Ulaşım', 'ulasim'],
  ['Atıştırmalık', 'market'],
];

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

  async function run(fn: () => Promise<unknown>, success = 'Kaydedildi.') {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      await fn();
      veriDegisti();
      await load.reload();
      setMessage(success);
    } catch {
      setMessage('İşlem tamamlanamadı. Bilgileri kontrol edip yeniden dene.');
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
          <Txt role="body">Günlük rutinlerini seç, kendi adet ve fiyatını yaz. Birden fazla rutin ekleyebilirsin.</Txt>
          <View style={{ height: rhythm.blockInCard }} />
          {HAZIR_RUTINLER.map(([name, kategoriKodu], i) => {
            const secili = active.some((rutin) => rutin.ad === name);
            const kat = kategoriGetir(kategoriKodu);
            return (
              <View key={name}>
                {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                <SettingRow
                  leading={<CategoryIconBox kategori={kat} />}
                  baslik={name}
                  accessibilityLabel={`${name}${secili ? ', seçili' : ''}`}
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
          <Button variant="ghost" label="Kendim ekleyeyim" onPress={clear} />
        </View>
      ) : null}

      <View>
        <GrupBasligi metin={duzenleniyor ? 'Rutini düzenle' : 'Rutin ekle'} />
        <TextField label="Harcamanın adı" value={ad} onChangeText={setAd} />
        <View style={{ height: rhythm.blockInCard }} />
        <CategoryPicker value={cat} onChange={setCat} />
        <View style={{ height: rhythm.blockInCard }} />
        <TextField label="Günlük adet" value={count} onChangeText={(value) => setCount(value.replace(/\D/g, ''))} keyboardType="number-pad" />
        <View style={{ height: rhythm.blockInCard }} />
        <MoneyInput label="Birim fiyat · ₺" value={amount} onChangeText={setAmount} />
        <View style={{ height: rhythm.blockInCard }} />
        <Button
          variant="primary"
          label={duzenleniyor ? 'Değişiklikleri kaydet' : 'Rutini kaydet'}
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
          <GrupBasligi metin="Aktif rutinler" />
          {active.map((rutin, i) => {
            const kat = kategoriGetir(rutin.kategori);
            return (
              <View key={rutin.id}>
                {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                <SettingRow
                  leading={<CategoryIconBox kategori={kat} />}
                  baslik={rutin.ad}
                  aciklama={`${kat.ad} · Günde ${rutin.gunluk_adet} × ${money(rutin.birim_fiyat_kurus)}`}
                  onPress={() => edit(rutin)}
                  accessibilityLabel={`${rutin.ad}. ${kat.ad}, günde ${rutin.gunluk_adet} × ${money(rutin.birim_fiyat_kurus)}. Düzenle.`}
                  deger={
                    <IconButton
                      icon="trash"
                      accessibilityLabel={`${rutin.ad} rutinini kaldır`}
                      disabled={busy}
                      onPress={() => void run(() => routinePut({ ...rutin, aktif: false }))}
                    />
                  }
                />
              </View>
            );
          })}
        </View>
      ) : null}

      {!onboarding ? <Txt role="caption">Rutin değişiklikleri bugünden itibaren geçerlidir. Harcama girmemek otomatik tasarruf sayılmaz.</Txt> : null}
    </>
  );
}

export default function Rutinler() {
  return (
    <RevScreen title="Rutinlerim">
      <RoutinePanel />
    </RevScreen>
  );
}
