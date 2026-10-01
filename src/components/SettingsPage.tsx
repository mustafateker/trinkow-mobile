import type { ReactNode } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PushHeader } from '@/components/PushHeader';
import { color, layout, radius, rhythm } from '@/theme/tokens';
/** Tasarım kiti §6.A/§6.B — koyu üst bar + açık, üst köşesi yuvarlak panel. */
export function SettingsPage({ baslik, children }: { baslik: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, backgroundColor: color.navDark }}>
    <View style={{ height: insets.top, backgroundColor: color.navDark }} />
    <PushHeader baslik={baslik} onGeri={() => router.canGoBack() ? router.back() : router.replace('/giris')} />
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: color.surface,
            borderTopLeftRadius: radius.hero,
            borderTopRightRadius: radius.hero,
            paddingHorizontal: layout.screenPaddingX,
            paddingTop: rhythm.section,
            paddingBottom: insets.bottom + 24,
            gap: rhythm.blockInCard,
          }}>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </View>;
}
