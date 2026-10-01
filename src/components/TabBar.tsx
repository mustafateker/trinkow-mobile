import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { color, layout, radius, rhythm, size } from '@/theme/tokens';

/**
 * Tasarım kiti §6.J — koyu lacivert (`ink-950`) sabit dock. REV2: merkez "+"
 * FAB kaldırıldı (harcama ekleme artık yalnız Günlük kategori satırındaki
 * "+", favoriler ve rutinlerden yapılır — bkz. app/index.tsx, favoriler.tsx,
 * rutinler.tsx). 3 sekme çubuk içinde eşit ve ortalanmış dağılır. Ekranın alt
 * kenarına bitişik, tam genişlikte sabit bar — yüzen/ada görünümü yok.
 */
export type TabKey = 'gunluk' | 'tasarruflar' | 'profil';

const PASIF_TON = color.navMuted;

const SEKMELER: { key: TabKey; ad: string; ikon: IconName }[] = [
  { key: 'gunluk', ad: 'Bugün', ikon: 'gauge' },
  { key: 'tasarruflar', ad: 'Tasarruf', ikon: 'notebook' },
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
      {SEKMELER.map((s) => {
        const aktif = s.key === active;
        const tone = aktif ? '#FFFFFF' : PASIF_TON;
        return (
          <Pressable
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
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Günlük/Tasarruf/Profil kök ekranlarının ORTAK alt dock sarmalayıcısı —
 * güvenli alan + kaldırma boşluğu ve sekme değiştirme gezinmesi tek yerden
 * yönetilir; üç ekran da bu bileşeni kullanır, aralarında ayrı hizalama/
 * boşluk kodu olmaz.
 */
export function TabDock({ active }: { active: TabKey }) {
  const insets = useSafeAreaInsets();
  const yukseklik = size.tabBarHeight + insets.bottom;
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
            router.navigate(key === 'gunluk' ? '/' : key === 'tasarruflar' ? '/tasarruflar' : '/profil');
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
    overflow: 'hidden',
  },
  cubuk: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: size.tabBarHeight,
    paddingHorizontal: layout.screenPaddingX,
    backgroundColor: color.navDark,
  },
  sekme: {
    flex: 1,
    minWidth: 0,
    height: size.tabItemHeight,
    alignItems: 'center',
    justifyContent: 'center',
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
