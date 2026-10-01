import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, radius } from '@/theme/tokens';

/**
 * Tasarım kiti §6.I — üst köşeler 28 (`radius.hero`), zemin `bg`, gölge
 * `shadow-float`, scrim `color.scrim`. Ekranın tamamını KAPLAMAZ —
 * arkadaki yüzey (RN `Modal` altındaki ekran) görünür kalır.
 * Üstte 44×4 tutamak.
 *
 * `footer` (rev2 · §5.2 `RoutineSheet`) — verilirse ÜÇ bölge oluşur:
 * tutamak (sabit) · `children` (kayan `ScrollView`) · `footer` (sabit).
 * Birincil eylem klavye açıkken bile görünür kalır. Verilmezse davranış
 * ÖNCEKİYLE AYNI (geriye dönük uyumlu — CategoryGridSheet/ProfilingSheet).
 */
export function BottomSheet({
  visible,
  onClose,
  children,
  footer,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      <KeyboardAvoidingView style={stil.katman} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable
          style={[StyleSheet.absoluteFill, stil.scrim]}
          accessibilityRole="button"
          accessibilityLabel="Kapat"
          onPress={onClose}
        />
        <View style={[stil.sheet, { paddingBottom: footer ? 0 : insets.bottom + 16 }]}>
          <View style={stil.tutamacSatiri}>
            <View style={stil.tutamac} />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={footer ? stil.esnek : undefined}
            contentContainerStyle={{ paddingBottom: footer ? 0 : 8 }}>
            {children}
          </ScrollView>
          {footer ? <View style={{ paddingBottom: insets.bottom + 16 }}>{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const stil = StyleSheet.create({
  katman: { flex: 1, justifyContent: 'flex-end' },
  scrim: { backgroundColor: color.scrim },
  sheet: {
    backgroundColor: color.surface,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    paddingHorizontal: 24,
    maxHeight: '90%',
    boxShadow: '0 -12px 30px rgba(23,28,66,0.12)',
  },
  esnek: { flexShrink: 1 },
  tutamacSatiri: { alignItems: 'center', paddingVertical: 12 },
  tutamac: { width: 44, height: 4, borderRadius: radius.pill, backgroundColor: color.line },
});
