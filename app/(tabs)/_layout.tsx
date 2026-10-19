import { Tabs } from 'expo-router';
import { t } from '@/content/metinler';

/**
 * Dört ana ekranın kalıcı navigator'ı. Ekranlar ilk ziyaretlerinden sonra
 * mounted kalır; sekme geçişi Stack route'unu replace edip tüm ağacı yeniden
 * kurmak yerine yalnız aktif sahneyi değiştirir. Görsel dock uygulamanın
 * kendi `TabDock` bileşenidir, native tab bar bu yüzden gizlidir.
 */
export default function AnaSekmelerLayout() {
  return (
    <Tabs
      backBehavior="none"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        animation: 'none',
        freezeOnBlur: false,
        lazy: true,
      }}>
      <Tabs.Screen name="index" options={{ title: t['ui.common.today'] }} />
      <Tabs.Screen name="tasarruflar" options={{ title: t['tasarruf.baslik'] }} />
      <Tabs.Screen name="analizler" options={{ title: t['ui.analysis.title'] }} />
      <Tabs.Screen name="profil" options={{ title: t['ui.tabs.profile'] }} />
    </Tabs>
  );
}
