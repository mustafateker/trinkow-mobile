import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryPicker } from '@/components/CategoryPicker';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { MoneyInput } from '@/components/MoneyInput';
import { LoadState, RevScreen, money, useRevLoad } from '@/components/RevScreen';
import { SegmentedControl } from '@/components/SegmentedControl';
import { GrupBasligi, SettingRow } from '@/components/SettingRow';
import { Txt } from '@/components/Txt';
import { kategori as kategoriGetir, type KategoriKodu } from '@/lib/kategoriler';
import { kurustanTutarGirisi, tutarGirisindenKurus } from '@/lib/para';
import { budgetBody, budgetGet, budgetPut } from '@/lib/revApi';
import { rhythm } from '@/theme/tokens';
import { veriDegisti } from '@/lib/veriBus';

export default function Limitler() {
  const load = useRevLoad(budgetGet);
  const [mode, setMode] = useState<'otomatik' | 'manuel'>('otomatik');
  const [amount, setAmount] = useState('');
  const [cats, setCats] = useState<Record<string, string>>({});
  const [cat, setCat] = useState<KategoriKodu | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const b = load.data?.butce;
    if (!b) return;
    setMode(b.limit_modu);
    setAmount(b.manuel_limit_kurus == null ? '' : kurustanTutarGirisi(b.manuel_limit_kurus));
    setCats(Object.fromEntries(Object.entries(b.kategori_limitleri).map(([k, v]) => [k, kurustanTutarGirisi(v)])));
  }, [load.data]);

  const b = load.data?.butce;
  const total = Object.values(cats).reduce((a, v) => a + tutarGirisindenKurus(v), 0);
  const limit = mode === 'manuel' ? tutarGirisindenKurus(amount) : (b?.gunluk_gelir_payi_kurus ?? null);

  async function save() {
    if (!b || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await budgetPut({
        ...budgetBody(b),
        limit_modu: mode,
        manuel_limit_kurus: mode === 'manuel' ? tutarGirisindenKurus(amount) : null,
        kategori_limitleri: Object.fromEntries(Object.entries(cats).map(([k, v]) => [k, tutarGirisindenKurus(v)])),
      });
      load.setData(result);
      veriDegisti();
      setMessage('Limitler bugünden itibaren kaydedildi.');
    } catch {
      setMessage('Kaydedilemedi. Kategori toplamı günlük limiti aşmamalı.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <RevScreen title="Limitler">
      <LoadState {...load} />

      {load.data && !b ? (
        <EmptyState
          icon="banknote"
          baslik="Önce bütçeni oluştur"
          govde="Günlük limit için gelir veya manuel tutar bilgisi gerekli."
          butonEtiketi="Bütçeme git"
          onButonPress={() => router.replace('/butce')}
        />
      ) : null}

      {b ? (
        <>
          <Txt role="body">Düzenleme bugün ve sonraki günlere uygulanır. Önceki günler değişmez.</Txt>

          <View>
            <SegmentedControl
              secenekler={[
                { value: 'otomatik', label: 'Gelire göre otomatik' },
                { value: 'manuel', label: 'Ben belirleyeceğim' },
              ]}
              deger={mode}
              onChange={setMode}
            />
            <View style={{ height: rhythm.blockInCard }} />
            {mode === 'manuel' ? (
              <MoneyInput label="Günlük limit · ₺" value={amount} onChangeText={setAmount} />
            ) : (
              <Txt role="body">Gelirine göre günlük pay: {money(b.gunluk_gelir_payi_kurus)}</Txt>
            )}
          </View>

          <View>
            <GrupBasligi metin="Kategori payları" />
            <Txt role="caption">Bu paylar günlük limitin içindedir. Dağıtılmayan tutarı diğer harcamalarda kullanabilirsin.</Txt>
            <View style={{ height: rhythm.blockInCard }} />

            {Object.entries(cats).map(([k, v], i) => (
              <View key={k}>
                {i > 0 ? <View style={{ height: rhythm.blockInCard }} /> : null}
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  <View style={{ flex: 1 }}>
                    <MoneyInput label={`${kategoriGetir(k).ad} · günlük ₺`} value={v} onChangeText={(n) => setCats((old) => ({ ...old, [k]: n }))} />
                  </View>
                  <View style={{ width: rhythm.group }} />
                  <IconButton
                    icon="trash"
                    accessibilityLabel={`${kategoriGetir(k).ad} payını kaldır`}
                    onPress={() =>
                      setCats((old) => {
                        const next = { ...old };
                        delete next[k];
                        return next;
                      })
                    }
                  />
                </View>
              </View>
            ))}

            <View style={{ height: rhythm.blockInCard }} />
            <CategoryPicker value={cat} onChange={setCat} />
            <View style={{ height: rhythm.blockInCard }} />
            <Button
              variant="secondary"
              label="Kategori payı ekle"
              disabled={!cat}
              onPress={() => {
                if (cat) setCats((old) => ({ ...old, [cat]: old[cat] || '' }));
                setCat(null);
              }}
            />

            <View style={{ height: rhythm.section }} />
            <SettingRow baslik="Kategori toplamı" deger={<Txt role="amount">{money(total)}</Txt>} />
            <View style={{ height: rhythm.group }} />
            <SettingRow baslik="Dağıtılmamış" deger={<Txt role="amount">{money(limit == null ? null : limit - total)}</Txt>} />
          </View>

          {load.data?.eski_aylik_kategori_limitleri.length ? (
            <Txt role="caption">Önceki aylık kategori limitlerin arşivlendi; günlük tutara çevrilmedi.</Txt>
          ) : null}

          {message ? (
            <Txt role="body" accessibilityLiveRegion="polite">
              {message}
            </Txt>
          ) : null}

          <Button variant="primary" label="Limitleri kaydet" loading={busy} disabled={limit == null || limit <= 0 || total > limit} onPress={() => void save()} />
        </>
      ) : null}
    </RevScreen>
  );
}
