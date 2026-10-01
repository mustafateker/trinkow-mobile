import { StyleSheet, View } from 'react-native';

import { ClayPressable } from '@/components/ClayPressable';
import { DayBox } from '@/components/DayBox';
import { Txt } from '@/components/Txt';
import { kategoriGunEtiketi } from '@/content/metinler';
import type { Harcama } from '@/db/harcama';
import { paraYaz } from '@/lib/para';
import { ayKisaAdi, saatYaz, tarihtenGun } from '@/lib/tarih';
import { color, radius, rhythm, size } from '@/theme/tokens';

/**
 * E-15 — `SpendRow` varyantı: kategori sabitken sol sütunda kategori kabı
 * yerine `DayBox` (gün) durur (bileşen envanteri §3). Kaydırma yok —
 * bu ekranda satırlar yalnız dokunulduğunda harcama detayına gider.
 */
export function CategoryDetailRow({
  harcama,
  limitDisi = false,
  onPress,
}: {
  harcama: Harcama;
  limitDisi?: boolean;
  onPress?: () => void;
}) {
  const gunTarihi = tarihtenGun(harcama.gun);
  const odemeEtiketi = harcama.odeme === 'nakit' ? 'Nakit' : 'Kart';
  const notEki = harcama.notMetni ? ` · ${harcama.notMetni}` : '';
  const birincil = `${saatYaz(harcama.zaman)} · ${odemeEtiketi}${notEki}`;
  const tutar = paraYaz(harcama.tutarKurus);

  return (
    <ClayPressable
      onPress={onPress}
      accessibilityLabel={`${kategoriGunEtiketi(String(gunTarihi.getDate()), ayKisaAdi(gunTarihi))}, ${tutar}, ${birincil}${limitDisi ? ', limit dışı' : ''}`}
      borderRadius={radius.tile}
      background={limitDisi ? color.warningSoft : color.surface}
      pressedBackground={color.groove}
      style={stil.satir}>
      <DayBox gun={gunTarihi.getDate()} ayKisa={ayKisaAdi(gunTarihi)} />
      <View style={{ width: rhythm.blockInCard }} />
      <Txt role="body" style={stil.esnek} numberOfLines={1} ellipsizeMode="tail">
        {birincil}
      </Txt>
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.sag}>
        <Txt role="amount">{tutar}</Txt>
        {limitDisi ? (
          <>
            <View style={{ height: rhythm.sameObject }} />
            <Txt role="caption" tone={color.warningInk}>
              limit dışı
            </Txt>
          </>
        ) : null}
      </View>
    </ClayPressable>
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
  esnek: { flex: 1, minWidth: 0 },
  sag: { alignItems: 'flex-end', flexShrink: 0 },
});
