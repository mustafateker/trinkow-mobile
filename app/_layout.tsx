// Dil paketleri HER ŞEYDEN ÖNCE kaydedilir (ActivationKing `LocalizationService.Register`).
import '@/i18n/kaynaklar';
// Tasarım kiti §4 — birincil font Plus Jakarta Sans, TOPLAM 3 AĞIRLIK.
// Paket kökünden (barrel) import edilirse Google Fonts paketinin BÜTÜN
// ağırlıkları paketlenir; bu yüzden yalnız ilgili alt yollar import edilir.
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { useFonts } from 'expo-font';
import { router, Stack, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';

import { onboardingTamamlandiMi } from '@/db/profil';
import { gunSiniriOku, kurulumGunuBaslat, yerellestirmeOku } from '@/db/ayarTercihleri';
import { katalogTazele } from '@/db/katalog';
import { ProfilingHost } from '@/components/ProfilingHost';
import { LaunchScreen } from '@/components/LaunchScreen';
import { InAppUpdateHost } from '@/components/InAppUpdateHost';
import { ToastHost } from '@/components/ToastHost';
import { ApiHatasi } from '@/lib/api';
import { oturumDegisimineAbone, oturumOku, oturumSil } from '@/lib/oturumDeposu';
import { gunSiniriSaatiniAyarla } from '@/lib/tarih';
import { t } from '@/content/metinler';
import { dilBaslat } from '@/i18n/dilDeposu';
import { toastGoster } from '@/lib/toastBus';
import { color } from '@/theme/tokens';
import { sunucuYerellestirmesiniUygula, yerellestirmeyiBaslat } from '@/lib/yerellestirmeDeposu';
import { useYerellestirme } from '@/lib/useYerellestirme';
import { oturumOnbelleginiTemizle, queryClient } from '@/lib/queryClient';
import { standartPaywallGosterilsinMi, uyelikBaslatBekle, uyelikKapat } from '@/lib/uyelik';
import { initializeVoiceExpenseWidget } from '@/widgets/VoiceExpenseWidget';

// Android gesture navigation is transparent in edge-to-edge mode. The native
// root behind it must therefore match our dock instead of falling back to
// white while React is mounting or when an OEM reports a zero bottom inset.
if (Platform.OS === 'android') {
  void SystemUI.setBackgroundColorAsync(color.navDark);
}

/**
 * Kurulumu bitmemiş kullanıcı önce standart fiyatlı paywall'ı (kullanıcı
 * başına bir kez), sonra onboarding'i görür; bitmişse doğrudan sekmeler.
 */
type IlkEkran = '(tabs)' | 'onboarding' | 'premium';

function IlkYonlendirme({ ilkEkran }: { ilkEkran: IlkEkran }) {
  const gezinme = useRootNavigationState();
  const [tamam, setTamam] = useState(false);
  useEffect(() => {
    if (!gezinme?.key || tamam) return;
    setTamam(true);
    if (ilkEkran === 'onboarding') router.replace('/onboarding');
    else if (ilkEkran === 'premium') router.replace({ pathname: '/premium', params: { tur: 'standart', kaynak: 'kayit' } });
  }, [gezinme?.key, ilkEkran, tamam]);
  return null;
}

/** Ekranlar oturum ve gün sınırı okunmadan API çağırmaya başlamaz. */
function OturumGezgini() {
  const [tetik, setTetik] = useState(0);
  const [durum, setDurum] = useState<'yukleniyor' | 'kapali' | 'acik'>('yukleniyor');
  const [ilkEkran, setIlkEkran] = useState<IlkEkran>('(tabs)');

  useEffect(() => oturumDegisimineAbone(() => {
    oturumOnbelleginiTemizle();
    setDurum('yukleniyor');
    setTetik((n) => n + 1);
  }), []);

  useEffect(() => {
    let iptal = false;
    async function baslat() {
      const enErkenGecis = Date.now() + 300;
      async function acilisSuresiniTamamla() {
        const kalan = enErkenGecis - Date.now();
        if (kalan > 0) await new Promise((tamamla) => setTimeout(tamamla, kalan));
      }
      try {
        const kayit = await oturumOku();
        if (iptal) return;
        if (!kayit) {
          void uyelikKapat();
          gunSiniriSaatiniAyarla(0);
          await acilisSuresiniTamamla();
          if (iptal) return;
          setDurum('kapali');
          return;
        }
        // Premium durumu arka planda yüklenir; yalnız kurulumu bitmemiş
        // kullanıcıda (paywall kararı için) en fazla 3 sn beklenir.
        const uyelik = uyelikBaslatBekle(kayit.kullaniciId, 3000);
        const [saat, tamam, yerellestirme] = await Promise.all([
          gunSiniriOku(),
          onboardingTamamlandiMi(),
          yerellestirmeOku(),
        ]);
        if (iptal) return;
        gunSiniriSaatiniAyarla(saat);
        await sunucuYerellestirmesiniUygula(yerellestirme.dil, yerellestirme.paraBirimi);
        await kurulumGunuBaslat();
        if (!tamam) await uyelik;
        if (iptal) return;
        await acilisSuresiniTamamla();
        if (iptal) return;
        setIlkEkran(tamam ? '(tabs)' : standartPaywallGosterilsinMi(kayit.kullaniciId) ? 'premium' : 'onboarding');
        setDurum('acik');
        void katalogTazele().catch(() => {});
      } catch (hata) {
        if (iptal) return;
        if (hata instanceof ApiHatasi && [401, 403, 404].includes(hata.durum)) {
          await oturumSil();
        } else {
          // Geçici ağ/sunucu hatasında açılışta hata ekranı GÖSTERİLMEZ —
          // doğrudan giriş ekranına düşülür (token silinmez, bir sonraki
          // başarılı doğrulamada oturum kaldığı yerden açılabilir) ve
          // kullanıcı toast ile bilgilendirilir.
          await acilisSuresiniTamamla();
          if (iptal) return;
          setDurum('kapali');
          toastGoster({ tur: 'warning', metin: t['giris.oturum_dogrulanamadi'] });
        }
      }
    }
    void baslat();
    return () => { iptal = true; };
  }, [tetik]);

  if (durum === 'yukleniyor') {
    return <LaunchScreen onReady={() => SplashScreen.hideAsync().catch(() => {})} />;
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
        <Stack.Screen name="premium" options={{ gestureEnabled: false }} />
        <Stack.Screen name="harcama-ekle" options={{ presentation: 'modal' }} />
        <Stack.Screen name="harcama/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="ayarlar" />
        <Stack.Screen name="hesap-sil" />
        <Stack.Screen name="birikimler" />
        <Stack.Screen name="rutinler" />
        <Stack.Screen name="abonelikler" />
        <Stack.Screen name="favoriler" />
        <Stack.Screen name="butce" />
        <Stack.Screen name="kategori/[kod]" />
        <Stack.Screen name="ozet" />
        <Stack.Screen name="limitler" />
        <Stack.Screen name="seri" />
        <Stack.Screen name="taksitler" />
        <Stack.Screen name="gun-sec" />
      </Stack.Protected>
    </Stack>
    {durum === 'acik' ? <IlkYonlendirme ilkEkran={ilkEkran} /> : null}
    {durum === 'acik' ? <ProfilingHost /> : null}
  </>;
}

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash zaten kapanmışsa sorun değil.
});

export default function RootLayout() {
  // Kayıtlı dil ya da (ilk açılışta) telefonun dili — ilk çizimden ÖNCE, senkron (bkz. `src/i18n/dilDeposu.ts`).
  useState(dilBaslat);
  // Dil ya da para birimi değişince kök yeniden çizilir; para birimi aşağıda cihazdan yüklenir.
  useYerellestirme();
  const [yerellestirmeHazir, setYerellestirmeHazir] = useState(false);
  const [fontHazir, fontHatasi] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    let etkin = true;
    void yerellestirmeyiBaslat().finally(() => {
      if (etkin) setYerellestirmeHazir(true);
    });
    return () => { etkin = false; };
  }, []);

  useEffect(() => {
    initializeVoiceExpenseWidget();
  }, []);

  if ((!fontHazir && !fontHatasi) || !yerellestirmeHazir) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
        {/* Tasarım kiti §6.A — her ekran koyu bir üst bar/header taşır, bu yüzden
            durum çubuğu ikonları hep açık renk. useColorScheme kullanılmaz. */}
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: color.bg }}>
          <OturumGezgini />
          <ToastHost />
          <InAppUpdateHost />
        </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
