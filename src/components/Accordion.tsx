import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { useReduceMotion } from '@/lib/hareket';
import { color, motion, radius, rhythm } from '@/theme/tokens';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * rev2-tasarruf-profil.md §3.12.3 · rev3-gunluk-rutin.md §3 — açılır kap.
 * İKİ ekranda paylaşılır (Tasarruf akordiyonu · Günlük rutin bölümü).
 *
 * Hafıza (`expanded`/`onToggle`) EKRAN SAHİBİNDE tutulur; bileşen kendi
 * açık/kapalı durumunu SAKLAMAZ (§10.2). Kapalıyken içerik mount edilmez
 * (`display:none` RN'de yok) — ekran okuyucu kapalı içeriği hiç görmez.
 */
export function Accordion({
  title,
  leading,
  summary,
  loadingSummary = false,
  trailingOverride,
  expanded,
  onToggle,
  accessibilityLabel,
  children,
}: {
  title: string;
  /** rev3-taksitler.md §4 — başlığın SOLUNDA duran 44pt kategori ikon kabı (`.kat-kab`). Verilmezse eski görünüm korunur. */
  leading?: ReactNode;
  /** Kapalıyken sağda görünen özet. `null` yalnız `loadingSummary` ile birlikte anlamlıdır. */
  summary?: string | null;
  /** Ö5/§5·8 — özetin YERİ (104×18) yalnız kapalı yüklenen bölümde korunur. */
  loadingSummary?: boolean;
  /**
   * rev3-gunluk-rutin.md §6 — TEK istisna: geçmiş günde sağdaki etiket
   * (gün) `expanded` olsa BİLE görünür kalır. Verilirse `summary`/
   * `loadingSummary`'nin ÖNÜNE geçer.
   */
  trailingOverride?: string;
  expanded: boolean;
  onToggle: () => void;
  /** "{başlık}. {özet}" — özet açıkken de etikette kalır (§3.12.7). */
  accessibilityLabel: string;
  children?: ReactNode;
}) {
  const reduceMotion = useReduceMotion();
  const donus = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const [basili, setBasili] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      donus.setValue(expanded ? 1 : 0);
      return;
    }
    Animated.timing(donus, {
      toValue: expanded ? 1 : 0,
      duration: motion.accordion,
      useNativeDriver: true,
    }).start();
  }, [expanded, reduceMotion, donus]);

  function basaBas() {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.create(motion.accordion, 'easeInEaseOut', 'opacity'));
    }
    onToggle();
  }

  const donenStil = {
    transform: [
      {
        rotate: donus.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }),
      },
    ],
  };

  return (
    <View
      style={[stil.kap, { backgroundColor: basili ? color.groove : color.surface }]}>
      <Pressable
        onPress={basaBas}
        onPressIn={() => setBasili(true)}
        onPressOut={() => setBasili(false)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={accessibilityLabel}
        style={stil.baslik}>
        {leading ? (
          <>
            {leading}
            <View style={{ width: rhythm.blockInCard }} />
          </>
        ) : null}
        <Txt role="h2" numberOfLines={1} style={stil.esnek}>
          {title}
        </Txt>
        <View style={{ width: rhythm.group }} />
        {/*
         * §3.12.4/§3.1 — "açıkken özet çizilmez". Bilerek TEK yerde (burada)
         * karar veriliyor: `denetim.py`'de yakalanan `iskelet_ozet` hatası
         * (özet yeri açık+yüklü bölümde de korunup başlığı zıplatıyordu) bu
         * kuralı çağıranın ellemesine bırakınca tekrarlanabilirdi.
         */}
        {trailingOverride != null ? (
          <Txt role="label" tone={color.text2} numberOfLines={1} style={stil.ozet}>
            {trailingOverride}
          </Txt>
        ) : !expanded && loadingSummary ? (
          <Skeleton width={104} height={18} />
        ) : !expanded && summary != null ? (
          <Txt role="label" tone={color.text2} numberOfLines={1} style={stil.ozet}>
            {summary}
          </Txt>
        ) : null}
        <View style={{ width: rhythm.group }} />
        <Animated.View style={donenStil}>
          <Icon name="chevron-down" size={20} color={color.text2} />
        </Animated.View>
      </Pressable>
      {expanded ? <View style={stil.icerik}>{children}</View> : null}
    </View>
  );
}

const stil = StyleSheet.create({
  kap: {
    padding: rhythm.pad,
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: color.line,
    overflow: 'hidden',
  },
  baslik: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  esnek: { flex: 1, minWidth: 0 },
  ozet: { flexShrink: 1, maxWidth: 140, textAlign: 'right' },
  icerik: { marginTop: rhythm.blockInCard },
});
