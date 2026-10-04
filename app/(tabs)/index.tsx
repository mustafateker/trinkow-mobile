import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabDock } from '@/components/TabBar';
import { GunlukSayfa } from '@/components/pano/GunlukSayfa';
import { milestoneGosterildiIsaretle } from '@/db/seri';
import { useGunlukSinir } from '@/db/useGunlukSinir';
import { useSeriOzet } from '@/db/useSeriOzet';
import { color } from '@/theme/tokens';

/**
 * E-10 · Günlük — yatay tarih sayfalama (K-049/K-055). Günler kronolojik
 * dizilir: geçmiş gün solda, daha yeni gün sağdadır. Böylece geçmişe
 * giderken eski gün soldan; Bugün'e dönerken yeni gün sağdan gelir.
 *
 * `?gun=-7` gibi bir parametreyle açılırsa (E-24 Gün seçici'den) doğrudan
 * o günün sayfasına gider.
 */
export default function GunlukEkrani() {
  const db = useSQLiteContext();
  const { gun } = useLocalSearchParams<{ gun?: string }>();
  const hedefGunFarki = gun !== undefined ? Number.parseInt(gun, 10) || 0 : 0;
  const insets = useSafeAreaInsets();
  const { width: genislik } = useWindowDimensions();
  const sinir = useGunlukSinir();
  const seriOzet = useSeriOzet();
  const listRef = useRef<FlatList<number>>(null);

  // İlk kayıt gününden bugüne kronolojik sıra — takvim geçiş yönünün görsel
  // beklentiyle aynı kalmasını sağlar.
  const sayfalar = useMemo(() => {
    if (!sinir.hazir) return [0];
    const dizi: number[] = [];
    for (let f = sinir.enEskiGunFarki; f <= 0; f += 1) dizi.push(f);
    return dizi;
  }, [sinir.hazir, sinir.enEskiGunFarki]);

  const [aktifIndex, setAktifIndex] = useState(0);
  const kaydirmaKilidi = useRef(false);

  // Sınır hazır olunca (ya da `?gun=` parametresi geldiğinde) doğru sayfaya atla.
  useEffect(() => {
    if (!sinir.hazir) return;
    const hedefIndex = sayfalar.indexOf(hedefGunFarki);
    const index = hedefIndex >= 0 ? hedefIndex : sayfalar.length - 1;
    setAktifIndex(index);
    kaydirmaKilidi.current = true;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index, animated: false });
      kaydirmaKilidi.current = false;
    });
    // yalnız sınır hazır olduğunda ya da hedef gün değiştiğinde
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sinir.hazir, hedefGunFarki]);

  function gunDegistir(delta: number) {
    const aktifGun = sayfalar[aktifIndex] ?? 0;
    const yeniIndex = sayfalar.indexOf(aktifGun + delta);
    if (yeniIndex < 0) return;
    if (yeniIndex === aktifIndex) return;
    setAktifIndex(yeniIndex);
    listRef.current?.scrollToIndex({ index: yeniIndex, animated: true });
  }

  const gorunenDegisti = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (kaydirmaKilidi.current) return;
    const ilk = viewableItems[0];
    if (ilk && typeof ilk.index === 'number') setAktifIndex(ilk.index);
  }).current;

  function kaydirmaBitti(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (kaydirmaKilidi.current || genislik <= 0) return;
    const index = Math.min(
      Math.max(Math.round(event.nativeEvent.contentOffset.x / genislik), 0),
      sayfalar.length - 1,
    );
    setAktifIndex(index);
  }

  async function kutlamaGosterildi() {
    if (seriOzet.durum?.kutlanacakMilestone != null) {
      await milestoneGosterildiIsaretle(db, seriOzet.durum.kutlanacakMilestone);
      seriOzet.yenile();
    }
  }

  return (
    <View style={stil.ekran}>
      <View style={[{ height: insets.top }, stil.ustGuvenliAlan]} />

      <FlatList
        ref={listRef}
        data={sayfalar}
        keyExtractor={(f) => String(f)}
        horizontal
        pagingEnabled
        snapToInterval={genislik}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        directionalLockEnabled
        nestedScrollEnabled
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={aktifIndex}
        getItemLayout={(_, i) => ({ length: genislik, offset: genislik * i, index: i })}
        onScrollToIndexFailed={({ index }) => {
          requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: index * genislik, animated: false }));
        }}
        onViewableItemsChanged={gorunenDegisti}
        onMomentumScrollEnd={kaydirmaBitti}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item, index }) => (
          <View style={{ width: genislik }}>
            <GunlukSayfa
              gunFarki={item}
              aktifMi={index === aktifIndex}
              seriDurum={seriOzet.durum}
              seriYukleniyor={seriOzet.yukleniyor}
              onKutlamaGosterildi={() => void kutlamaGosterildi()}
              onGunDegistir={gunDegistir}
            />
          </View>
        )}
        style={stil.pager}
      />

      <TabDock active="gunluk" />
    </View>
  );
}

const stil = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: color.bg },
  ustGuvenliAlan: { backgroundColor: color.navDark },
  pager: { flex: 1 },
});
