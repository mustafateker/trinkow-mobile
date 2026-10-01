import { router } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryIconBox } from '@/components/CategoryIconBox';
import { InfoStrip } from '@/components/InfoStrip';
import { LoadState, RevScreen, money, useRevLoad } from '@/components/RevScreen';
import { GrupBasligi, SettingRow } from '@/components/SettingRow';
import { Txt } from '@/components/Txt';
import { a11yProfilSatir } from '@/content/metinler';
import { kategori as kategoriGetir } from '@/lib/kategoriler';
import { bugun, savingsGet } from '@/lib/revApi';
import { rhythm } from '@/theme/tokens';

export default function Ozet() {
  const load = useRevLoad(useCallback(() => savingsGet(bugun().slice(0, 7)), []));
  const d = load.data;

  return (
    <RevScreen title="Özet">
      <LoadState {...load} />
      {d && !load.loading && !load.error ? (
        <>
          <Txt role="caption">{d.ay} · Bu ayın analizi</Txt>

          <View>
            <GrupBasligi metin="Gelir ve harcama" />
            <SettingRow baslik="Harcanabilir" deger={<Txt role="amount">{money(d.harcanabilir_kurus)}</Txt>} />
            <View style={{ height: rhythm.group }} />
            <SettingRow baslik="Harcadığın" deger={<Txt role="amount">{money(d.harcanan_kurus)}</Txt>} />
            <View style={{ height: rhythm.group }} />
            <SettingRow baslik="Kalan" deger={<Txt role="amount">{money(d.kalan_kurus)}</Txt>} />
          </View>

          <View>
            <GrupBasligi metin="Tasarrufların" />
            <SettingRow baslik="Tamamlanan günlerden" deger={<Txt role="amount">{money(d.hesaplanan_tasarruf_kurus)}</Txt>} />
            <View style={{ height: rhythm.group }} />
            <SettingRow baslik="Rutinlerinden vazgeçişler" deger={<Txt role="amount">{money(d.rutin_tasarruf_kurus)}</Txt>} />
            <View style={{ height: rhythm.group }} />
            <SettingRow baslik="Gerçek birikim bakiyen" deger={<Txt role="amount">{money(d.gercek_birikim_kurus)}</Txt>} />
            <View style={{ height: rhythm.blockInCard }} />
            <Txt role="caption">Bu üç değer ayrı ölçümlerdir; birbirine eklenmez. Eksik gelir bilgisi olan dönemler bilinmiyor olarak gösterilir.</Txt>
          </View>

          <View>
            <GrupBasligi metin="Kategori analizi" />
            {d.kategoriler.length ? (
              d.kategoriler.map((k, i) => {
                const kat = kategoriGetir(k.kategori);
                return (
                  <View key={k.kategori}>
                    {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                    <SettingRow
                      leading={<CategoryIconBox kategori={kat} />}
                      baslik={kat.ad}
                      aciklama={`Rutin tasarrufu ${money(k.rutin_tasarruf_kurus)}`}
                      deger={<Txt role="amount">{money(k.harcanan_kurus)}</Txt>}
                      accessibilityLabel={a11yProfilSatir(kat.ad, money(k.harcanan_kurus))}
                    />
                  </View>
                );
              })
            ) : (
              <Txt role="body">İlk harcamanı eklediğinde kategorilerin burada görünür.</Txt>
            )}
          </View>

          <InfoStrip variant="info" metin={d.motivasyon.mesaj} />

          <View>
            <Button variant="primary" label="Aylık tasarruflarını incele" onPress={() => router.push('/tasarruflar')} />
            <View style={{ height: rhythm.group }} />
            <Button variant="secondary" label="Bütçemi düzenle" onPress={() => router.push('/butce')} />
            <View style={{ height: rhythm.group }} />
            <Button variant="secondary" label="Sık kullanılanlar" onPress={() => router.push('/favoriler')} />
          </View>
        </>
      ) : null}
    </RevScreen>
  );
}
