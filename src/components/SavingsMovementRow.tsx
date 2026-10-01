import { Pressable, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { ClayPressable } from '@/components/ClayPressable';
import { DayBox } from '@/components/DayBox';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { a11yTasarrufHareket, t } from '@/content/metinler';
import type { Movement } from '@/lib/revApi';
import { ayAdiTek, ayAnahtari, tarihtenGun } from '@/lib/tarih';
import { paraYaz } from '@/lib/para';
import { color, radius, rhythm, size } from '@/theme/tokens';

const EYLEM_GENISLIK = 84;

/**
 * Bileşen envanteri §5 `SavingsMovementRow` (`SpendRow` varyantı) —
 * rev2-tasarruf-profil.md §3.6: sol sütun İKON değil `.gun-kutu` (E-15
 * deseni, dokunulamaz); yön METİNLE anlatılır, eksi işareti yazılmaz.
 * Satıra dokunmak düzenleme kipini açar; kaydırma **yalnız trailing**
 * (sağdan sola) — iOS sistem geri hareketiyle çakışmasın diye soldan sağa
 * hiç tanımlanmaz (K4/K5, tokens §7.3 düzeltmesi).
 */
export function SavingsMovementRow({
  movement,
  onPress,
  onSwipeDelete,
}: {
  movement: Movement;
  onPress: () => void;
  /** Trailing kaydırma → Sil (6 sn "Geri al" çağıranın sorumluluğunda). */
  onSwipeDelete: () => void;
}) {
  const cekildiMi = movement.tutar_kurus < 0;
  const tarih = tarihtenGun(movement.gun);
  const tutar = paraYaz(Math.abs(movement.tutar_kurus));
  const birincil = cekildiMi ? t['tasarruf.hareket.cekildi'] : t['tasarruf.hareket.eklendi'];
  const etiket = a11yTasarrufHareket(birincil, tarih.getDate(), ayAdiTek(ayAnahtari(tarih)), tutar, movement.not_metni || undefined);

  const satir = (
    <ClayPressable
      onPress={onPress}
      accessibilityLabel={etiket}
      borderRadius={radius.tile}
      style={stil.satir}>
      <DayBox gun={tarih.getDate()} ayKisa={ayAdiTek(ayAnahtari(tarih)).slice(0, 3)} />
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.orta}>
        <Txt role="body" numberOfLines={1} ellipsizeMode="tail">
          {birincil}
        </Txt>
        {movement.not_metni ? (
          <Txt role="caption" numberOfLines={1} ellipsizeMode="tail">
            {movement.not_metni}
          </Txt>
        ) : null}
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.sag}>
        <Txt role="amount" numberOfLines={1}>
          {tutar}
        </Txt>
        {cekildiMi ? (
          <>
            <View style={{ height: rhythm.sameObject }} />
            <Txt role="caption">{t['tasarruf.hareket.cekildiEtiket']}</Txt>
          </>
        ) : null}
      </View>
    </ClayPressable>
  );

  return (
    <Swipeable
      overshootRight={false}
      rightThreshold={40}
      renderRightActions={(_progress, _drag, sw) => (
        <Pressable
          onPress={() => {
            sw.close();
            onSwipeDelete();
          }}
          accessibilityRole="button"
          accessibilityLabel={t['a11y.tasarruf.hareketSil']}
          style={stil.eylem}>
          <Icon name="trash" size={22} color={color.dangerInk} />
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="caption" tone={color.dangerInk}>
            {t['eylem.sil']}
          </Txt>
        </Pressable>
      )}>
      {satir}
    </Swipeable>
  );
}

const stil = StyleSheet.create({
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: size.rowMinHeight,
    paddingVertical: size.rowPadY,
    paddingHorizontal: size.rowPadX,
  },
  orta: { flex: 1, minWidth: 0 },
  sag: { alignItems: 'flex-end', flexShrink: 0 },
  eylem: {
    width: EYLEM_GENISLIK,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.dangerSoft,
    borderTopRightRadius: radius.tile,
    borderBottomRightRadius: radius.tile,
  },
});
