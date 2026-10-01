import { StyleSheet, View } from 'react-native';

import { ClayPressable } from '@/components/ClayPressable';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { t, taksitSeriKalan } from '@/content/metinler';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * rev3-taksitler.md §3/§6/§11 `InstallmentSeriesRow` — ürün satırı.
 * Yeni bileşen DEĞİL: `.satir-kart`ın iki yüzey basamağının tek yapısı,
 * `ClayPressable` üzerine kurulu (`ExpenseRow` ile aynı primitif). İki
 * `variant`: `kuyu` (akordiyon İÇİNDE, well+sunken) ve `kabarik` (akordiyon
 * KURULMADIĞINDA, surface+raised) — §4.2/K-T2.
 *
 * Silme YOK (K-T9): dokunuş yalnız E-12 detayına açılır, bu yüzden 20pt
 * `chevron-right` dokunulabilirliğin TEK görsel işaretidir (K-T14).
 * İlerleme yalnız SERİ düzeyinde (K-T4), dolgu kategorinin `solid`
 * rengidir (K-T5) — `grad.action` DEĞİL.
 */
export function InstallmentSeriesRow({
  urunAdi,
  tutar,
  mevcut,
  toplam,
  kalanTutar,
  son,
  solidColor,
  variant,
  accessibilityLabel,
  onPress,
}: {
  urunAdi: string;
  /** Bu ayki tutar, kuruşsuz — "1.041 ₺". */
  tutar: string;
  mevcut: number;
  toplam: number;
  /** Son taksit DEĞİLSE kalan tutar metni ("8.333 ₺"); `son` true iken kullanılmaz. */
  kalanTutar: string | null;
  son: boolean;
  solidColor: string;
  variant: 'kuyu' | 'kabarik';
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const oran = toplam > 0 ? Math.min(1, mevcut / toplam) : 0;
  const kuyu = variant === 'kuyu';

  return (
    <ClayPressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      borderRadius={radius.tile}
      background={kuyu ? color.well : color.surface}
      shadow={kuyu ? clay.sunken : clay.raised}
      gloss={!kuyu}
      style={stil.kart}>
      <View style={stil.sol}>
        <View style={stil.ustSatir}>
          <Txt role="bodyStrong" numberOfLines={1} style={stil.ad}>
            {urunAdi}
          </Txt>
          <View style={{ width: rhythm.group }} />
          <Txt role="amount">{tutar}</Txt>
        </View>
        <View style={{ height: rhythm.sameObject }} />
        <View style={stil.oluk} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
          <View style={[stil.dolguKirp, { width: `${oran * 100}%` }]}>
            <View style={[stil.dolgu, { backgroundColor: solidColor }]} />
          </View>
        </View>
        <View style={{ height: rhythm.sameObject }} />
        <Txt role="caption" tone={son ? color.primaryText : color.text2} numberOfLines={1}>
          {son ? t['taksit.son_taksit'] : taksitSeriKalan(mevcut, toplam, kalanTutar ?? '')}
        </Txt>
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <View importantForAccessibility="no" accessibilityElementsHidden>
        <Icon name="chevron-right" size={20} color={color.text2} />
      </View>
    </ClayPressable>
  );
}

const stil = StyleSheet.create({
  kart: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rhythm.blockInCard,
    paddingHorizontal: rhythm.pad,
  },
  sol: { flex: 1, minWidth: 0 },
  ustSatir: { flexDirection: 'row', alignItems: 'baseline' },
  ad: { flex: 1, minWidth: 0 },
  oluk: {
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: color.well,
    boxShadow: clay.sunken,
    overflow: 'hidden',
  },
  dolguKirp: { height: 12, borderRadius: radius.pill, overflow: 'hidden' },
  dolgu: { flex: 1 },
});
