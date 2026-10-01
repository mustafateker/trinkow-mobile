import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClaySurface } from '@/components/ClaySurface';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { toastAbone, toastGoster, type ToastGirdi, type ToastVaryant } from '@/lib/toastBus';
import { a11y, color, radius, rhythm } from '@/theme/tokens';

/**
 * §7.9 Toast — kök düzeyde (`app/_layout.tsx`) TEK örnek. Ekranlar
 * `toastGoster()` çağırır, konum/süre/gösterge burada yönetilir.
 */
const gostergeRengi: Record<ToastVaryant, string> = {
  info: color.primary,
  warning: color.warning,
  undo: color.danger,
  undoInfo: color.primary,
};

const varsayilanSure: Record<ToastVaryant, number> = {
  info: 4000,
  warning: 4000,
  undo: 6000,
  undoInfo: 6000,
};

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastGirdi | null>(null);
  const zamanlayici = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () =>
      toastAbone((t) => {
        if (zamanlayici.current) clearTimeout(zamanlayici.current);
        setToast(t);
        AccessibilityInfo.announceForAccessibility(t.metin);
        zamanlayici.current = setTimeout(() => setToast(null), t.sure ?? varsayilanSure[t.tur]);
      }),
    [],
  );

  if (!toast) return null;

  return (
    <View pointerEvents="box-none" style={[stil.katman, { paddingTop: insets.top + rhythm.group }]}>
      <View style={stil.pad} pointerEvents="box-none">
        <ClaySurface level="raisedLg" borderRadius={radius.card} style={stil.toast}>
          <View style={[stil.nokta, { backgroundColor: gostergeRengi[toast.tur] }]} />
          <View style={{ width: rhythm.blockInCard }} />
          <Txt role="body" style={stil.metin} numberOfLines={2}>
            {toast.metin}
          </Txt>
          {toast.eylemEtiketi ? (
            <>
              <View style={{ width: rhythm.blockInCard }} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={toast.eylemEtiketi}
                hitSlop={a11y.minTarget}
                style={stil.eylem}
                onPress={() => {
                  void Promise.resolve().then(() => toast.onEylem?.()).catch(() => {
                    toastGoster({ tur: 'warning', metin: t['hata.okuma.govde'] });
                  });
                  if (zamanlayici.current) clearTimeout(zamanlayici.current);
                  setToast(null);
                }}>
                <Txt role="bodyStrong" tone={color.primaryText}>
                  {toast.eylemEtiketi}
                </Txt>
              </Pressable>
            </>
          ) : null}
        </ClaySurface>
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  katman: { position: 'absolute', left: 0, right: 0, top: 0 },
  pad: { paddingHorizontal: rhythm.pad },
  toast: { flexDirection: 'row', alignItems: 'center', padding: rhythm.pad },
  nokta: { width: 8, height: 8, borderRadius: radius.pill },
  metin: { flex: 1, minWidth: 0 },
  eylem: { minHeight: a11y.minTarget, justifyContent: 'center', paddingHorizontal: rhythm.pad },
});
