import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm, size } from '@/theme/tokens';

/**
 * Tasarım kiti §6.J — koyu lacivert (`ink-950`) sabit dock. Dört ana sekme
 * çubuk içinde eşit dağılır; Tasarruf ile Analizler arasındaki coral "+"
 * hızlı harcama eylemidir. Ekranın alt kenarına bitişik, tam genişliktedir.
 */
export type TabKey = 'gunluk' | 'tasarruflar' | 'analizler' | 'profil';

const PASIF_TON = color.navMuted;

const SEKMELER: { key: TabKey; ad: string; ikon: IconName }[] = [
  { key: 'gunluk', ad: 'Bugün', ikon: 'gauge' },
  { key: 'tasarruflar', ad: 'Tasarruf', ikon: 'notebook' },
  { key: 'analizler', ad: 'Analizler', ikon: 'chart' },
  { key: 'profil', ad: 'Profil', ikon: 'user' },
];

export function TabBar({
  active,
  onSelect,
}: {
  active: TabKey;
  onSelect?: (key: TabKey) => void;
}) {
  return (
    <View style={stil.cubuk}>
      {SEKMELER.slice(0, 2).map((s) => {
        const aktif = s.key === active;
        const tone = aktif ? '#FFFFFF' : PASIF_TON;
        return <Pressable
            key={s.key}
            onPress={() => onSelect?.(s.key)}
            accessibilityRole="tab"
            accessibilityLabel={`${s.ad} sekmesi`}
            accessibilityState={{ selected: aktif }}
            style={stil.sekme}>
            <View style={[stil.ikonKab, aktif && stil.ikonKabAktif]}>
              <Icon name={s.ikon} size={size.icon} color={aktif ? '#EDEBFF' : PASIF_TON} />
            </View>
            <View style={{ height: rhythm.sameObject }} />
            <Txt
              role={aktif ? 'label' : 'caption'}
              tone={tone}
              numberOfLines={1}
              style={stil.sekmeEtiketi}>
              {s.ad}
            </Txt>
          </Pressable>;
      })}
      <View style={stil.ekleHucre}>
        <Pressable
          onPress={() => router.push('/harcama-ekle')}
          accessibilityRole="button"
          accessibilityLabel="Harcama ekle"
          style={({ pressed }) => [stil.ekle, pressed && stil.ekleBasili]}>
          <Icon name="plus" size={32} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>
      {SEKMELER.slice(2).map((s) => {
        const aktif = s.key === active;
        const tone = aktif ? '#FFFFFF' : PASIF_TON;
        return <Pressable
          key={s.key}
          onPress={() => onSelect?.(s.key)}
          accessibilityRole="tab"
          accessibilityLabel={`${s.ad} sekmesi`}
          accessibilityState={{ selected: aktif }}
          style={stil.sekme}>
          <View style={[stil.ikonKab, aktif && stil.ikonKabAktif]}>
            <Icon name={s.ikon} size={size.icon} color={aktif ? '#EDEBFF' : PASIF_TON} />
          </View>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role={aktif ? 'label' : 'caption'} tone={tone} numberOfLines={1} style={stil.sekmeEtiketi}>
            {s.ad}
          </Txt>
        </Pressable>;
      })}
    </View>
  );
}

/**
 * Günlük/Tasarruf/Analizler/Profil kök ekranlarının ORTAK alt dock sarmalayıcısı —
 * güvenli alan + kaldırma boşluğu ve sekme değiştirme gezinmesi tek yerden
 * yönetilir; üç ekran da bu bileşeni kullanır, aralarında ayrı hizalama/
 * boşluk kodu olmaz.
 */
export function TabDock({ active }: { active: TabKey }) {
  const insets = useSafeAreaInsets();
  // Android edge-to-edge kipinde bazı cihazlar alt inset'i 0 bildirebilir.
  // En az 12 px rezerv, sistem hareket çubuğunu ikon satırından ayrı tutar.
  const altGuvenliAlan = Math.max(insets.bottom, rhythm.blockInCard);
  const yukseklik = size.tabBarHeight + altGuvenliAlan;
  return (
    // Dış kutu, yuvarlatılmış `dock` ile AYNI boyutta düz (köşesiz) koyu zemin
    // sağlar — üst köşelerin kırptığı alan ekranın açık rengini değil, bu
    // zemini gösterir; böylece köşe kesimi "beyaz sızıntı" gibi görünmez.
    <View style={[stil.arkaPlan, { height: yukseklik }]}>
      <View style={[stil.dock, { height: yukseklik }]}>
        <TabBar
          active={active}
          onSelect={(key) => {
            if (key === active) return;
            router.navigate(key === 'gunluk' ? '/' : key === 'tasarruflar' ? '/tasarruflar' : key === 'analizler' ? '/analizler' : '/profil');
          }}
        />
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  arkaPlan: { backgroundColor: color.navDark },
  dock: {
    justifyContent: 'center',
    backgroundColor: color.navDark,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    overflow: 'visible',
  },
  cubuk: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: size.tabBarHeight,
    paddingHorizontal: rhythm.group,
    backgroundColor: color.navDark,
    transform: [{ translateY: Platform.OS === 'android' ? -4 : 0 }],
  },
  sekme: {
    flex: 1,
    minWidth: 0,
    height: size.tabItemHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ekleHucre: { flex: 1, minWidth: 0, height: size.tabItemHeight, alignItems: 'center', justifyContent: 'center' },
  ekle: {
    width: size.fab,
    height: size.fab,
    borderRadius: 999,
    backgroundColor: color.action,
    borderWidth: 3,
    borderColor: color.navDark,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: clay.action,
  },
  ekleBasili: {
    backgroundColor: color.actionPressed,
    transform: [{ scale: 0.98 }],
  },
  ikonKab: {
    width: size.tabIconBox,
    height: size.tabIconBoxHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  ikonKabAktif: {
    height: size.tabIconBoxHeightActive,
    backgroundColor: 'rgba(92,90,246,0.35)',
  },
  sekmeEtiketi: { width: '100%', textAlign: 'center' },
});
