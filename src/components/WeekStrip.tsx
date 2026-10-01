import { StyleSheet, View } from 'react-native';

import { GradFill } from '@/components/GradFill';
import { Txt } from '@/components/Txt';
import { HAFTA_GUN_KISA } from '@/lib/tarih';
import { color, gradient, radius } from '@/theme/tokens';

const CIZELGE_YUKSEKLIGI = 104;
const CUBUK_GENISLIGI = 20;

export type WeekStripGun = {
  /** kuruş integer, veri yoksa 0 */
  toplamKurus: number;
  /** henüz gelmemiş gün — yalnız oluk, etiket `text-3` */
  gelecek?: boolean;
};

/**
 * Bileşen envanteri §3 `WeekStrip` — 7 günlük sütun şeridi. Sütun oluğu
 * `well` + `clay.sunken`, dolgu `primary`, limit çizgisi kesikli `text-2`,
 * eşiği aşan gün TÜM sütunuyla `warning`. E-16 (Özet) haftalık grafiği bu
 * bileşenle çizilir — F-5'in yanı sıra ikinci kullanım yeri.
 */
export function WeekStrip({
  gunler,
  limitKurus,
  aktifIndex,
}: {
  gunler: WeekStripGun[];
  limitKurus: number | null;
  /** Bugünün sütun indexi (0=Pzt…6=Paz) — etiketi `primary-text` + SemiBold olur. */
  aktifIndex?: number;
}) {
  const olcek = Math.max(limitKurus ?? 0, ...gunler.map((g) => g.toplamKurus), 1);
  const limitOrani = limitKurus && limitKurus > 0 ? Math.min(limitKurus / olcek, 1) : null;

  return (
    <View>
      <View style={stil.cizelge}>
        {limitOrani !== null ? (
          <View style={[stil.limitCizgisi, { bottom: `${limitOrani * 100}%` }]} />
        ) : null}
        <View style={stil.sutunSira}>
          {gunler.map((g, i) => {
            const asimda = limitKurus !== null && g.toplamKurus > limitKurus;
            const oran = g.gelecek ? 0 : Math.min(g.toplamKurus / olcek, 1);
            return (
              <View key={i} style={stil.sutunKab}>
                <View style={stil.oluk}>
                  {oran > 0 ? (
                    <View style={[stil.dolguSarma, { height: `${oran * 100}%` }]}>
                      <View style={stil.dolgu}>
                        <GradFill colors={asimda ? gradient.arcOver : gradient.arc} />
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View style={{ height: 8 }} />
      <View style={stil.etiketSira}>
        {HAFTA_GUN_KISA.map((etiket, i) => {
          const gelecek = gunler[i]?.gelecek;
          const aktif = i === aktifIndex;
          return (
            <Txt
              key={etiket}
              role={aktif ? 'label' : 'micro'}
              tone={aktif ? color.primaryText : gelecek ? color.text3 : color.text2}
              style={stil.etiket}>
              {etiket}
            </Txt>
          );
        })}
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  cizelge: { height: CIZELGE_YUKSEKLIGI },
  limitCizgisi: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderTopColor: color.text2,
  },
  sutunSira: { flexDirection: 'row', height: '100%', alignItems: 'flex-end', justifyContent: 'space-between' },
  sutunKab: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  oluk: {
    width: CUBUK_GENISLIGI,
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: color.well,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  dolguSarma: { width: '100%' },
  dolgu: { flex: 1, borderRadius: radius.pill, overflow: 'hidden' },
  etiketSira: { flexDirection: 'row' },
  etiket: { flex: 1, textAlign: 'center' },
});
