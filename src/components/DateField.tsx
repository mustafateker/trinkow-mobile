import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ClayPressable } from '@/components/ClayPressable';
import { DayBox } from '@/components/DayBox';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { ayAdiTek, ayAnahtari, gunAnahtari, gunEkle, tarihtenGun } from '@/lib/tarih';
import { clay, color, radius, rhythm, size } from '@/theme/tokens';

const GUN_SAYISI = 21;

/**
 * rev2-tasarruf-profil.md §3.7 — "Metin girişi değil (`YYYY-AA-GG` biçim
 * dayatması kaldırıldı) → `DateField` çukur satırı, varsayılan bugün,
 * gelecek gün seçilemez."
 *
 * **Sapma (raporlanmış):** onaylı bir takvim/date-picker kütüphanesi
 * bulunmadığından (yeni paket eklemek onay gerektirir) tam ay ızgarası
 * yerine son 21 günü listeleyen dokunulabilir bir gün şeridi kullanılır —
 * gelecek gün üretilmediği için kural karşılanır; daha eski bir kaydı
 * düzenlerken tarih bu şeridin dışındaysa şerit o günü de gösterecek
 * şekilde genişler.
 */
export function DateField({
  gun,
  onChange,
  label,
  hata = false,
  accessibilityLabel,
}: {
  /** "YYYY-AA-GG" */
  gun: string;
  onChange: (gun: string) => void;
  label: string;
  hata?: boolean;
  accessibilityLabel?: string;
}) {
  const [acik, setAcik] = useState(false);
  const bugunAnahtari = gunAnahtari(new Date());

  const gunler = useMemo(() => {
    const bugun = tarihtenGun(bugunAnahtari);
    const secili = tarihtenGun(gun);
    // Seçili gün 20 günden daha eskiyse şerit onu da kapsayacak şekilde uzar.
    const gerigidilenGun = Math.max(GUN_SAYISI - 1, Math.round((bugun.getTime() - secili.getTime()) / 86_400_000));
    const dizi: Date[] = [];
    for (let i = gerigidilenGun; i >= 0; i -= 1) dizi.push(gunEkle(bugun, -i));
    return dizi;
  }, [bugunAnahtari, gun]);

  const seciliTarih = tarihtenGun(gun);
  const bicimliTarih = `${seciliTarih.getDate()} ${ayAdiTek(ayAnahtari(seciliTarih))} ${seciliTarih.getFullYear()}`;

  return (
    <View>
      <Txt role="label" tone={color.text2}>
        {label}
      </Txt>
      <View style={{ height: rhythm.group }} />
      <ClayPressable
        onPress={() => setAcik((v) => !v)}
        accessibilityLabel={accessibilityLabel ?? `${label}: ${bicimliTarih}`}
        borderRadius={radius.tile}
        background={color.well}
        pressedBackground={color.groove}
        shadow={hata ? `${clay.sunken}, 0 0 0 2px ${color.danger}` : clay.sunken}
        gloss={false}
        style={stil.kuyu}>
        <Txt role="body" style={stil.esnek}>
          {bicimliTarih}
        </Txt>
        <Icon name="calendar" size={size.iconSm} color={color.text2} />
      </ClayPressable>
      {acik ? (
        <>
          <View style={{ height: rhythm.group }} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={stil.serit}
            contentOffset={{ x: Math.max(0, (gunler.length - 6) * (size.catBox + rhythm.group)), y: 0 }}>
            {gunler.map((d) => {
              const anahtar = gunAnahtari(d);
              return (
                <View key={anahtar} style={{ marginRight: rhythm.group }}>
                  <DayBox
                    gun={d.getDate()}
                    selected={anahtar === gun}
                    onPress={() => {
                      onChange(anahtar);
                      setAcik(false);
                    }}
                    accessibilityLabel={`${d.getDate()} ${ayAdiTek(ayAnahtari(d))}`}
                  />
                </View>
              );
            })}
          </ScrollView>
        </>
      ) : null}
    </View>
  );
}

const stil = StyleSheet.create({
  kuyu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: size.input,
    paddingHorizontal: rhythm.pad,
  },
  esnek: { flex: 1, minWidth: 0 },
  serit: { flexDirection: 'row', paddingVertical: 2 },
});
