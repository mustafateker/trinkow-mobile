import { router } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryIconBox } from '@/components/CategoryIconBox';
import { InfoStrip } from '@/components/InfoStrip';
import { LoadState, RevScreen, money, useRevLoad } from '@/components/RevScreen';
import { GrupBasligi, SettingRow } from '@/components/SettingRow';
import { Txt } from '@/components/Txt';
import { a11yProfilSatir, ozetRutinTasarrufu, t } from '@/content/metinler';
import { metin } from '@/i18n/cekirdek';
import { kategori as kategoriGetir } from '@/lib/kategoriler';
import { bugun, savingsGet } from '@/lib/revApi';
import { ayYilEtiketi } from '@/lib/tarih';
import { rhythm } from '@/theme/tokens';
import { useDil } from '@/i18n/useDil';

export default function Ozet() {
  useDil();
  const load = useRevLoad(useCallback(() => savingsGet(bugun().slice(0, 7)), []));
  const d = load.data;

  return (
    <RevScreen title={t['ui.summary.title']}>
      <LoadState {...load} />
      {d && !load.loading && !load.error ? (
        <>
          <Txt role="caption">{ayYilEtiketi(d.ay ?? bugun().slice(0, 7))} {t['ui.summary.month_analysis']}</Txt>

          <View>
            <GrupBasligi metin={t['ui.summary.income_and_spending']} />
            <SettingRow baslik={t['ui.summary.spendable']} deger={<Txt role="amount">{money(d.harcanabilir_kurus)}</Txt>} />
            <View style={{ height: rhythm.group }} />
            <SettingRow baslik={t['ui.summary.spent']} deger={<Txt role="amount">{money(d.harcanan_kurus)}</Txt>} />
            <View style={{ height: rhythm.group }} />
            <SettingRow baslik={t['ui.summary.remaining']} deger={<Txt role="amount">{money(d.kalan_kurus)}</Txt>} />
          </View>

          <View>
            <GrupBasligi metin={t['ui.summary.savings_title']} />
            <SettingRow baslik={t['ui.summary.completed_days']} deger={<Txt role="amount">{money(d.hesaplanan_tasarruf_kurus)}</Txt>} />
            <View style={{ height: rhythm.group }} />
            <SettingRow baslik={t['ui.summary.routine_skips']} deger={<Txt role="amount">{money(d.rutin_tasarruf_kurus)}</Txt>} />
            <View style={{ height: rhythm.group }} />
            <SettingRow baslik={t['ui.summary.savings_balance']} deger={<Txt role="amount">{money(d.gercek_birikim_kurus)}</Txt>} />
            <View style={{ height: rhythm.blockInCard }} />
            <Txt role="caption">{t['ui.summary.metrics_notice']}</Txt>
          </View>

          <View>
            <GrupBasligi metin={t['ui.summary.category_analysis']} />
            {d.kategoriler.length ? (
              d.kategoriler.map((k, i) => {
                const kat = kategoriGetir(k.kategori);
                return (
                  <View key={k.kategori}>
                    {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                    <SettingRow
                      leading={<CategoryIconBox kategori={kat} />}
                      baslik={kat.ad}
                      aciklama={ozetRutinTasarrufu(money(k.rutin_tasarruf_kurus))}
                      deger={<Txt role="amount">{money(k.harcanan_kurus)}</Txt>}
                      accessibilityLabel={a11yProfilSatir(kat.ad, money(k.harcanan_kurus))}
                    />
                  </View>
                );
              })
            ) : (
              <Txt role="body">{t['ui.summary.empty_categories']}</Txt>
            )}
          </View>

          {/* Sunucunun Türkçe `mesaj`ı değil, verisi (`tur`, `borc_yuzde`) kullanılır — cümle aktif dilde kurulur. */}
          <InfoStrip
            variant="info"
            metin={d.motivasyon.tur === 'borc'
              ? metin('ozet_ekran.motivasyon.borc', { yuzde: d.motivasyon.borc_yuzde ?? 0 })
              : t['ozet_ekran.motivasyon.birikim']}
          />

          <View>
            <Button variant="primary" label={t['ui.summary.savings']} onPress={() => router.push('/tasarruflar')} />
            <View style={{ height: rhythm.group }} />
            <Button variant="secondary" label={t['ui.summary.edit_budget']} onPress={() => router.push('/butce')} />
            <View style={{ height: rhythm.group }} />
            <Button variant="secondary" label={t['ui.summary.favorites']} onPress={() => router.push('/favoriler')} />
          </View>
        </>
      ) : null}
    </RevScreen>
  );
}
