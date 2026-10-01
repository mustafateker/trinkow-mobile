import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View, type ViewToken } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabDock } from '@/components/TabBar';
import { GunlukSayfa } from '@/components/pano/GunlukSayfa';
import { milestoneGosterildiIsaretle } from '@/db/seri';
import { useGunlukSinir } from '@/db/useGunlukSinir';
import { useSeriOzet } from '@/db/useSeriOzet';
import { color } from '@/theme/tokens';

/**
 * E-10 · Günlük — yatay tarih sayfalama (K-049/K-055). **Bugün en sağdaki
 * sayfadır**, geçmiş günler sola dizilir; geçmişe gitmek için parmak sağa
 * kaydırılır (takvim konvansiyonu). Sol uç = ilk kayıt/kurulum günü.
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

  // En eski günden bugüne dizilmiş gün farkları — bugün DAİMA son (en sağ) eleman.
  const sayfalar = useMemo(() => {
    if (!sinir.hazir) return [0];
    const dizi: number[] = [];
    for (let f = sinir.enEskiGunFarki; f <= 0; f += 1) dizi.push(f);
    return dizi;
  }, [sinir.hazir, sinir.enEskiGunFarki]);

  const [aktifIndex, setAktifIndex] = useState(sayfalar.length - 1);
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
    const yeniIndex = Math.min(Math.max(aktifIndex + delta, 0), sayfalar.length - 1);
    if (yeniIndex === aktifIndex) return;
    setAktifIndex(yeniIndex);
    listRef.current?.scrollToIndex({ index: yeniIndex, animated: true });
  }

  const gorunenDegisti = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (kaydirmaKilidi.current) return;
    const ilk = viewableItems[0];
    if (ilk && typeof ilk.index === 'number') setAktifIndex(ilk.index);
  }).current;

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
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={aktifIndex}
        getItemLayout={(_, i) => ({ length: genislik, offset: genislik * i, index: i })}
        onScrollToIndexFailed={() => {}}
        onViewableItemsChanged={gorunenDegisti}
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
