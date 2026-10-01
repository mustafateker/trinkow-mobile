import { Pressable, StyleSheet, View } from 'react-native';

import { CategoryIconBox } from '@/components/CategoryIconBox';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { gunlukA11yGrubaEkle, gunlukGrupBugun, gunlukGrupKalan, gunlukGrupLimitDisi, t } from '@/content/metinler';
import { aileRenkleri, kategori } from '@/lib/kategoriler';
import { paraYaz } from '@/lib/para';
import { a11y, clay, color, radius, rhythm, size } from '@/theme/tokens';

/**
 * §7.5 kategori çubuğu — yükseklik 12, radius 999, oluk `groove` +
 * `clay.sunken`, dolgu `cat.*.solid`, taşma `warning`.
 *
 * K-056 (v4) — satırın BİRİNCİL ölçeği daima **aylık/aylık** (çubukla aynı
 * zaman ölçeği); `bugunKurus` verilirse günün tutarı yalnız İKİNCİL satırda
 * görünür ("bugün {tutar} · kalan {tutar}"). Uydurma "günlük kategori
 * limiti" YOK. `bugunKurus` verilmezse (E-15 kategori detayı gibi eski
 * kullanım yerleri) ikincil satır hiç çizilmez — geriye dönük uyumlu.
 */
export function CategoryLimitRow({
  kategoriKodu,
  harcananKurus,
  limitKurus,
  bugunKurus,
  onEkle,
}: {
  kategoriKodu: string;
  harcananKurus: number;
  limitKurus: number;
  /** v4 E-10 — o günün bu kategorideki toplamı (K-056 ikincil satır) */
  bugunKurus?: number;
  /** v4 E-10 — satırdaki hızlı "+" (K-051). Verilmezse buton çizilmez. */
  onEkle?: () => void;
}) {
  const kat = kategori(kategoriKodu);
  const renk = aileRenkleri(kat.aile);
  const limitDisi = harcananKurus > limitKurus;

  // Limit dışında çubuk iki parçaya bölünür: limit payı + taşma payı
  const toplam = Math.max(harcananKurus, limitKurus);
  const anaOran = limitDisi ? limitKurus / toplam : harcananKurus / limitKurus;
  const tasmaOran = limitDisi ? (harcananKurus - limitKurus) / toplam : 0;

  return (
    <View style={stil.satir}>
      <CategoryIconBox kategori={kat} />
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.orta}>
        <View style={stil.aralik}>
          <Txt role="bodyStrong" numberOfLines={1} ellipsizeMode="tail" style={stil.ad}>
            {kat.ad}
          </Txt>
          <View style={stil.satirYatay}>
            <Txt role="amount">{paraYaz(harcananKurus)}</Txt>
            <View style={{ width: rhythm.group }} />
            <Txt role="caption">{`/ ${paraYaz(limitKurus)}`}</Txt>
          </View>
        </View>
        <View style={{ height: rhythm.group }} />
        <View
          style={stil.oluk}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={`${kat.ad} kategori limiti`}
          accessibilityValue={{ min: 0, max: limitKurus, now: harcananKurus }}>
          <View style={[stil.dolgu, { flexGrow: anaOran, backgroundColor: renk.solid }]} />
          {tasmaOran > 0 ? (
            <View style={[stil.dolgu, { flexGrow: tasmaOran, backgroundColor: color.warning }]} />
          ) : null}
          <View style={{ flexGrow: Math.max(0, 1 - anaOran - tasmaOran) }} />
        </View>
        <View style={{ height: rhythm.sameObject }} />
        {bugunKurus === undefined ? (
          <View style={stil.aralik}>
            <Txt role="caption">{t['kategori.bar_periyot']}</Txt>
            {limitDisi ? (
              <Txt role="label" tone={color.warningInk}>
                {gunlukGrupLimitDisi(paraYaz(limitKurus))}
              </Txt>
            ) : (
              <Txt role="label" tone={color.text2}>
                {paraYaz(limitKurus)}
              </Txt>
            )}
          </View>
        ) : (
          <View style={stil.aralik}>
            <Txt role="caption">{bugunKurus > 0 ? gunlukGrupBugun(paraYaz(bugunKurus)) : t['gunluk.grup.bugun_yok']}</Txt>
            <Txt role="label" tone={color.text2}>
              {gunlukGrupKalan(paraYaz(Math.max(limitKurus - harcananKurus, 0)))}
            </Txt>
          </View>
        )}
      </View>
      {onEkle ? (
        <>
          <View style={{ width: rhythm.blockInCard }} />
          <Pressable
            onPress={onEkle}
            accessibilityRole="button"
            accessibilityLabel={gunlukA11yGrubaEkle(kat.ad)}
            hitSlop={a11y.minTarget - size.iconButton}
            style={({ pressed }) => [stil.ekleBtn, { backgroundColor: pressed ? color.well : color.surface }]}>
            <Icon name="plus" size={20} color={color.primaryText} />
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'center' },
  orta: { flex: 1, minWidth: 0 },
  aralik: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  satirYatay: { flexDirection: 'row', alignItems: 'baseline', flexShrink: 0 },
  ad: { flexShrink: 1, minWidth: 0 },
  oluk: {
    flexDirection: 'row',
    height: size.catBarHeight,
    borderRadius: radius.pill,
    backgroundColor: color.groove,
    boxShadow: clay.sunken,
    overflow: 'hidden',
  },
  dolgu: { height: size.catBarHeight, borderRadius: radius.pill, flexBasis: 0 },
  ekleBtn: {
    width: size.iconButton,
    height: size.iconButton,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: clay.raised,
  },
});
