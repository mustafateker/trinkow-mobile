import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { Txt } from '@/components/Txt';
import { color, layout, radius, rhythm } from '@/theme/tokens';

/** Kimlik ekranlarının ortak koyu başlık + açık form paneli. */
export function AuthShell({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={stil.ekran}>
      <View style={{ height: insets.top }} />
      <View style={stil.header}>
        <View style={stil.ustSatir}>
          {onBack ? <IconButton icon="chevron-left" accessibilityLabel="Geri" tone="#FFFFFF" background={color.navGlassBg} pressedBackground={color.navGlassBgPressed} onPress={onBack} /> : <View style={stil.denge} />}
          <Txt role="label" tone={color.navMuted}>TRINKOW</Txt>
          <View style={stil.denge} />
        </View>
        <View style={{ height: rhythm.pad }} />
        <Txt role="h1" tone="#FFFFFF">{title}</Txt>
        <View style={{ height: rhythm.group }} />
        <Txt role="body" tone="#BFC6E5">{subtitle}</Txt>
      </View>
      <KeyboardAvoidingView style={stil.esnek} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={stil.scrollIcerik}>
          <View style={[stil.panel, { paddingBottom: insets.bottom + rhythm.section }]}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const stil = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: color.navDark },
  esnek: { flex: 1, minHeight: 0 },
  header: { paddingHorizontal: layout.screenPaddingX, paddingTop: rhythm.group, paddingBottom: rhythm.section },
  ustSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  denge: { width: 44, height: 44 },
  scrollIcerik: { flexGrow: 1 },
  panel: { flex: 1, backgroundColor: color.surface, borderTopLeftRadius: radius.hero, borderTopRightRadius: radius.hero, paddingHorizontal: layout.screenPaddingX, paddingTop: rhythm.section },
});
