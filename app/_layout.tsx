// Tasarım kiti §4 — birincil font Plus Jakarta Sans, TOPLAM 3 AĞIRLIK.
// Paket kökünden (barrel) import edilirse Google Fonts paketinin BÜTÜN
// ağırlıkları paketlenir; bu yüzden yalnız ilgili alt yollar import edilir.
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { useFonts } from 'expo-font';
import { router, Stack, useRootNavigationState } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { DB_ADI, semayiKur } from '@/db';
import { onboardingTamamlandiMi } from '@/db/profil';
import { gunSiniriOku, kurulumGunuBaslat } from '@/db/ayarTercihleri';
import { katalogTazele } from '@/db/katalog';
import { ProfilingHost } from '@/components/ProfilingHost';
import { ToastHost } from '@/components/ToastHost';
import { ApiHatasi, benKimim } from '@/lib/api';
import { oturumDegisimineAbone, oturumOku, oturumSil } from '@/lib/oturumDeposu';
import { gunSiniriSaatiniAyarla } from '@/lib/tarih';
import { Spinner } from '@/components/Spinner';
import { t } from '@/content/metinler';
import { toastGoster } from '@/lib/toastBus';
import { color } from '@/theme/tokens';

function IlkYonlendirme({ onboarding }: { onboarding: boolean }) {
  const gezinme = useRootNavigationState();
  const [tamam, setTamam] = useState(false);
  useEffect(() => {
    if (!gezinme?.key || tamam) return;
    setTamam(true);
    if (onboarding) router.replace('/onboarding');
  }, [gezinme?.key, onboarding, tamam]);
  return null;
}

/** Ekranlar oturum ve gün sınırı okunmadan API çağırmaya başlamaz. */
function OturumGezgini() {
  const db = useSQLiteContext();
  const [tetik, setTetik] = useState(0);
  const [durum, setDurum] = useState<'yukleniyor' | 'kapali' | 'acik'>('yukleniyor');
  const [ilkEkran, setIlkEkran] = useState('(tabs)');

  useEffect(() => oturumDegisimineAbone(() => {
    setDurum('yukleniyor');
    setTetik((n) => n + 1);
  }), []);

  useEffect(() => {
    let iptal = false;
    async function baslat() {
      try {
        const kayit = await oturumOku();
        if (iptal) return;
        if (!kayit) {
          gunSiniriSaatiniAyarla(0);
          setDurum('kapali');
          return;
        }
        await benKimim();
        const [saat, tamam] = await Promise.all([gunSiniriOku(db), onboardingTamamlandiMi(db)]);
        if (iptal) return;
        gunSiniriSaatiniAyarla(saat);
        await kurulumGunuBaslat(db);
        if (iptal) return;
        setIlkEkran(tamam ? '(tabs)' : 'onboarding');
        setDurum('acik');
        void katalogTazele(db).catch(() => {});
      } catch (hata) {
        if (iptal) return;
        if (hata instanceof ApiHatasi && [401, 403, 404].includes(hata.durum)) {
          await oturumSil();
        } else {
          // Geçici ağ/sunucu hatasında açılışta hata ekranı GÖSTERİLMEZ —
          // doğrudan giriş ekranına düşülür (token silinmez, bir sonraki
          // başarılı doğrulamada oturum kaldığı yerden açılabilir) ve
          // kullanıcı toast ile bilgilendirilir.
          setDurum('kapali');
          toastGoster({ tur: 'warning', metin: t['giris.oturum_dogrulanamadi'] });
        }
      }
    }
    void baslat();
    return () => { iptal = true; };
  }, [db, tetik]);

  if (durum === 'yukleniyor') {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <Spinner />
    </View>;
  }

  return <>
    <Stack initialRouteName={durum === 'acik' ? ilkEkran : 'giris'} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg } }}>
      <Stack.Screen name="legal" />
      <Stack.Screen name="yardim" />
      <Stack.Screen name="sifremi-unuttum" />
      <Stack.Screen name="sifre-sifirla" />
      <Stack.Protected guard={durum === 'kapali'}>
        <Stack.Screen name="giris" />
        <Stack.Screen name="kayit" />
      </Stack.Protected>
      <Stack.Protected guard={durum === 'acik'}>
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="tanisma" options={{ gestureEnabled: false }} />
        <Stack.Screen name="plan" options={{ gestureEnabled: false }} />
        <Stack.Screen name="harcama-ekle" options={{ presentation: 'modal' }} />
        <Stack.Screen name="harcama/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="ayarlar" />
        <Stack.Screen name="hesap-sil" />
        <Stack.Screen name="birikimler" />
        <Stack.Screen name="rutinler" />
        <Stack.Screen name="favoriler" />
        <Stack.Screen name="butce" />
        <Stack.Screen name="kategori/[kod]" />
        <Stack.Screen name="ozet" />
        <Stack.Screen name="limitler" />
        <Stack.Screen name="kayitlar" />
        <Stack.Screen name="seri" />
        <Stack.Screen name="taksitler" />
        <Stack.Screen name="gun-sec" />
      </Stack.Protected>
    </Stack>
    {durum === 'acik' ? <IlkYonlendirme onboarding={ilkEkran === 'onboarding'} /> : null}
    {durum === 'acik' ? <ProfilingHost /> : null}
  </>;
}

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash zaten kapanmışsa sorun değil.
});

export default function RootLayout() {
  const [fontHazir, fontHatasi] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontHazir || fontHatasi) SplashScreen.hideAsync().catch(() => {});
  }, [fontHazir, fontHatasi]);

  if (!fontHazir && !fontHatasi) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Tasarım kiti §6.A — her ekran koyu bir üst bar/header taşır, bu yüzden
            durum çubuğu ikonları hep açık renk. useColorScheme kullanılmaz. */}
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: color.bg }}>
          <SQLiteProvider databaseName={DB_ADI} onInit={semayiKur}>
            <OturumGezgini />
            <ToastHost />
          </SQLiteProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
