import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { PushHeader } from '@/components/PushHeader';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { t, tasarrufHareketBosAltGecmisAy } from '@/content/metinler';
import { movementsGet, movementsPeriodGet, bugun, type Movement } from '@/lib/revApi';
import { useRevLoad } from '@/components/RevScreen';
import { ayAdiTek, ayAnahtari, tarihtenGun } from '@/lib/tarih';
import { paraYaz } from '@/lib/para';
import { color, layout, radius, rhythm } from '@/theme/tokens';

/**
 * rev2-tasarruf-profil.md §3.6 "Tüm hareketler" hedefi — E-27'nin bölüm
 * başlığı bu ekrana yönlendiriyor. Kapsam bu turda yalnız E-27/E-28
 * olduğundan, bu ekran salt-okunur bir liste (düzenleme/silme ana ekranda
 * kalır); ghost düğmesi ölü bağlantı bırakmasın diye eklendi (PM'e raporlanmıştır).
 */
export default function TumHareketlerEkrani() {
  const { ay, baslangic, bitis } = useLocalSearchParams<{ ay?: string; baslangic?: string; bitis?: string; donem?: string }>();
  const gosterilenAy = ay ?? bugun().slice(0, 7);
  const insets = useSafeAreaInsets();
  const load = useRevLoad(useCallback(
    () => baslangic && bitis ? movementsPeriodGet(baslangic, bitis) : movementsGet(gosterilenAy),
    [baslangic, bitis, gosterilenAy],
  ));
  const guncelAyMi = gosterilenAy === bugun().slice(0, 7);

  return (
    <View style={stil.sayfa}>
      <View style={{ height: insets.top, backgroundColor: color.navDark }} />
      <PushHeader baslik={t['tasarruf.hareket.baslik']} onGeri={() => (router.canGoBack() ? router.back() : router.replace('/tasarruflar'))} />
      <View style={[stil.panel, { paddingBottom: insets.bottom }]}>
        {load.loading ? (
          <View style={stil.pad}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={i > 0 ? { marginTop: rhythm.group } : undefined}>
                <Skeleton width="100%" height={68} borderRadius={16} />
              </View>
            ))}
          </View>
        ) : load.error ? (
          <View style={stil.pad}>
            <ErrorState onRetry={load.reload} />
          </View>
        ) : (
          <FlatList
            data={load.data?.hareketler ?? []}
            keyExtractor={(m) => m.id}
            contentContainerStyle={stil.liste}
            renderItem={({ item }) => <Satir movement={item} />}
            ListEmptyComponent={
              <EmptyState
                icon="banknote"
                baslik={t['tasarruf.hareket.bos.baslik']}
                govde={baslangic && bitis ? 'Bu dönemde birikim hareketi yok.' : guncelAyMi ? t['tasarruf.hareket.bos.alt.buAy'] : tasarrufHareketBosAltGecmisAy(ayAdiTek(gosterilenAy))}
              />
            }
          />
        )}
      </View>
    </View>
  );
}

function Satir({ movement }: { movement: Movement }) {
  const cekildiMi = movement.tutar_kurus < 0;
  const tarih = tarihtenGun(movement.gun);
  return (
    <View style={stil.satir}>
      <View style={stil.gunKutu}>
        <Txt role="label">{tarih.getDate()}</Txt>
        <Txt role="micro" tone={color.text2}>
          {ayAdiTek(ayAnahtari(tarih)).slice(0, 3)}
        </Txt>
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.esnek}>
        <Txt role="body" numberOfLines={1}>
          {cekildiMi ? t['tasarruf.hareket.cekildi'] : t['tasarruf.hareket.eklendi']}
        </Txt>
        {movement.not_metni ? (
          <Txt role="caption" numberOfLines={1}>
            {movement.not_metni}
          </Txt>
        ) : null}
      </View>
      <View style={stil.sag}>
        <Txt role="amount">{paraYaz(Math.abs(movement.tutar_kurus))}</Txt>
        {cekildiMi ? <Txt role="caption">{t['tasarruf.hareket.cekildiEtiket']}</Txt> : null}
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  sayfa: { flex: 1, backgroundColor: color.navDark },
  panel: {
    flex: 1,
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    paddingTop: rhythm.section,
  },
  pad: { paddingHorizontal: layout.screenPaddingX },
  liste: { paddingHorizontal: layout.screenPaddingX, paddingBottom: layout.scrollPadBottom, gap: rhythm.group },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    paddingVertical: rhythm.blockInCard,
    paddingHorizontal: rhythm.pad,
    backgroundColor: color.surface,
    borderRadius: 16,
  },
  gunKutu: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: color.well },
  esnek: { flex: 1, minWidth: 0 },
  sag: { alignItems: 'flex-end' },
});
