import { StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { color, radius, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri `ShareRow` (E-26) — 8pt nokta + ad + açıklama + sağda
 * ₺/%. Renk tek başına bilgi taşımaz (WCAG 1.4.1): nokta + ad + tutar birlikte.
 * `yuzde === null` → "Girilmedi" (K-040: %0 yazılmaz, girilmemiş ile
 * "hedef 0" aynı şey değildir).
 */
export function ShareRow({
  dotColor,
  ad,
  aciklama,
  tutarYazi,
  yuzdeYazi,
}: {
  dotColor: string;
  ad: string;
  aciklama: string;
  /** `null` → "Girilmedi" (tutar da yazılmaz). */
  tutarYazi: string | null;
  yuzdeYazi: string | null;
}) {
  return (
    <View style={stil.satir}>
      <View style={stil.noktaKolon}>
        <View style={[stil.nokta, { backgroundColor: dotColor }]} />
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.esnek}>
        <Txt role="bodyStrong">{ad}</Txt>
        <View style={{ height: rhythm.sameObject }} />
        <Txt role="caption">{aciklama}</Txt>
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.sagKolon}>
        {tutarYazi !== null ? (
          <>
            <Txt role="amount" numberOfLines={1}>
              {tutarYazi}
            </Txt>
            <View style={{ height: rhythm.sameObject }} />
            <Txt role="caption">{yuzdeYazi}</Txt>
          </>
        ) : (
          <Txt role="caption" tone={color.text2}>
            {t['tan.girilmedi']}
          </Txt>
        )}
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'flex-start' },
  noktaKolon: { paddingTop: 8 },
  nokta: { width: 8, height: 8, borderRadius: radius.pill },
  esnek: { flex: 1, minWidth: 0 },
  sagKolon: { alignItems: 'flex-end' },
});
