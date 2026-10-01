import { StyleSheet, View } from 'react-native';

import { DayStatusBox } from '@/components/streak/DayStatusBox';
import { Txt } from '@/components/Txt';
import { gunsecA11yGun } from '@/content/metinler';
import type { GunSeciciGunu } from '@/db/useGunSecici';
import { ayIlkGununHaftaIndeksi, HAFTA_GUN_MIKRO, uzunTarih } from '@/lib/tarih';
import { color, v4 } from '@/theme/tokens';

const DURUM_ADI: Record<GunSeciciGunu['durum'], string> = {
  altinda: 'limit altı',
  disinda: 'limit dışı',
  bos: 'kayıt yok',
};

/**
 * tokens.md §7.13 `MonthGrid` — E-24 ay ızgarası. Satır = 7 eşit hücre
 * (`flex: 1`), CSS grid yok. Baş boşluğu ayın 1'inin haftadaki yerine göre.
 */
export function MonthGrid({ ay, gunler, onGunSec }: { ay: string; gunler: GunSeciciGunu[]; onGunSec: (gun: GunSeciciGunu) => void }) {
  const basBosluk = ayIlkGununHaftaIndeksi(ay);
  const hucreler: (GunSeciciGunu | null)[] = [
    ...Array.from({ length: basBosluk }, () => null),
    ...gunler,
  ];
  // 7'nin katına tamamla — son satır da eşit 7 hücre olsun.
  while (hucreler.length % 7 !== 0) hucreler.push(null);

  const satirlar: (GunSeciciGunu | null)[][] = [];
  for (let i = 0; i < hucreler.length; i += 7) satirlar.push(hucreler.slice(i, i + 7));

  return (
    <View>
      <View style={stil.satir}>
        {HAFTA_GUN_MIKRO.map((etiket) => (
          <View key={etiket} style={stil.hucre}>
            <Txt role="micro" tone={color.text2}>
              {etiket}
            </Txt>
          </View>
        ))}
      </View>
      <View style={{ height: v4.gridGap }} />
      {satirlar.map((satir, i) => (
        <View key={i}>
          {i > 0 ? <View style={{ height: v4.gridGap }} /> : null}
          <View style={stil.satir}>
            {satir.map((g, j) =>
              g ? (
                <View key={g.tarih.toISOString()} style={stil.hucre}>
                  <DayStatusBox
                    gun={g.gun}
                    durum={g.durum}
                    pasif={g.pasif}
                    bugunMu={g.bugunMu}
                    onPress={g.pasif ? undefined : () => onGunSec(g)}
                    accessibilityLabel={gunsecA11yGun(uzunTarih(g.tarih), DURUM_ADI[g.durum], g.bugunMu)}
                  />
                </View>
              ) : (
                <View key={j} style={stil.hucre} />
              ),
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const stil = StyleSheet.create({
  satir: { flexDirection: 'row' },
  hucre: { flex: 1, alignItems: 'center' },
});
