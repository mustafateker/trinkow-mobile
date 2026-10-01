import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryIconBox } from '@/components/CategoryIconBox';
import { CategoryPicker } from '@/components/CategoryPicker';
import { IconButton } from '@/components/IconButton';
import { LoadState, RevScreen, money, useRevLoad } from '@/components/RevScreen';
import { GrupBasligi, SettingRow } from '@/components/SettingRow';
import { MoneyInput } from '@/components/MoneyInput';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { kategori as kategoriGetir, type KategoriKodu } from '@/lib/kategoriler';
import { tutarGirisindenKurus } from '@/lib/para';
import { favoriteDelete, favoritePut, favoritesGet, yeniId } from '@/lib/revApi';
import { rhythm } from '@/theme/tokens';

export default function Favoriler() {
  const load = useRevLoad(favoritesGet);
  const [ad, setAd] = useState('');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState<KategoriKodu | null>(null);
  const [id, setId] = useState(yeniId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function run(fn: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await fn();
      await load.reload();
    } catch {
      setError('İşlem tamamlanamadı. Yeniden deneyebilirsin.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <RevScreen title="Sık kullanılanlar">
      <LoadState {...load} />

      {load.data && load.data.kalemler.length > 0 ? (
        <View>
          {load.data.kalemler.map((f, i) => {
            const kat = kategoriGetir(f.kategori);
            const ozet = `${kat.ad} · Son fiyat ${money(f.tutar_kurus)}`;
            return (
              <View key={f.id}>
                {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                <SettingRow
                  leading={<CategoryIconBox kategori={kat} />}
                  baslik={f.ad}
                  aciklama={ozet}
                  onPress={() => router.push({ pathname: '/harcama-ekle', params: { kategori: f.kategori, ad: f.ad, tutarKurus: String(f.tutar_kurus) } })}
                  accessibilityLabel={`${f.ad}. ${ozet}. Harcama ekle.`}
                  deger={
                    f.sabitlenmis ? (
                      <IconButton
                        icon="x"
                        accessibilityLabel={`${f.ad} sık kullanılanlardan kaldır`}
                        disabled={busy}
                        onPress={() => void run(() => favoriteDelete(f.id))}
                      />
                    ) : undefined
                  }
                />
              </View>
            );
          })}
        </View>
      ) : null}

      <View>
        <GrupBasligi metin="Ürün ekle" />
        <TextField label="Ürün adı" value={ad} onChangeText={setAd} />
        <View style={{ height: rhythm.blockInCard }} />
        <CategoryPicker value={cat} onChange={setCat} />
        <View style={{ height: rhythm.blockInCard }} />
        <MoneyInput label="Son fiyat · ₺" value={amount} onChangeText={setAmount} />
        <View style={{ height: rhythm.blockInCard }} />
        <Button
          variant="primary"
          label="Sık kullanılanlara kaydet"
          loading={busy}
          disabled={!ad.trim() || !cat || tutarGirisindenKurus(amount) <= 0}
          onPress={() =>
            void run(async () => {
              await favoritePut({ id, ad: ad.trim(), kategori: cat!, tutar_kurus: tutarGirisindenKurus(amount) });
              setId(yeniId());
              setAd('');
              setAmount('');
              setCat(null);
            })
          }
        />
      </View>

      {error ? <Txt role="body">{error}</Txt> : null}
    </RevScreen>
  );
}
