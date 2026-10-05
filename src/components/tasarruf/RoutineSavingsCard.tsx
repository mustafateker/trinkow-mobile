import { Fragment, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryIconBox } from '@/components/CategoryIconBox';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import {
  t,
  tasarrufRutinFazlaGun,
  tasarrufRutinGunDetay,
  tasarrufRutinOzet,
} from '@/content/metinler';
import { kategori } from '@/lib/kategoriler';
import { paraYaz } from '@/lib/para';
import {
  rutinTasarrufGunleriniGoster,
  rutinTasarrufSayilari,
  rutinTasarruflariniSirala,
  type RutinTasarrufu,
} from '@/lib/rutinTasarruf';
import { kisaTarih, tarihtenGun } from '@/lib/tarih';
import { color, radius, rhythm } from '@/theme/tokens';

export function RoutineSavingsCard({
  rutinler,
  toplamKurus,
  toplamRutinSayisi,
  onRutinleriAcPress,
}: {
  rutinler: RutinTasarrufu[];
  toplamKurus: number;
  toplamRutinSayisi: number;
  onRutinleriAcPress: () => void;
}) {
  const [acikRutinId, setAcikRutinId] = useState<string | null>(null);
  const hicRutinYok = toplamRutinSayisi === 0;
  const siraliRutinler = rutinTasarruflariniSirala(rutinler);
  const enYuksek = siraliRutinler[0]?.tasarruf_kurus ?? 0;

  return (
    <View style={stil.kart}>
      <View style={stil.ustSatir}>
        <Txt role="h2" style={stil.ustMetin}>Rutin tasarrufları</Txt>
        <Txt role="amount" numberOfLines={1}>{paraYaz(toplamKurus)}</Txt>
      </View>

      <View style={{ height: rhythm.blockInCard }} />
      {siraliRutinler.length === 0 ? (
        <Txt role="body" tone={color.text2}>
          {hicRutinYok ? t['tasarruf.rutin.hicYok'] : 'Bu dönemde rutin tasarrufu oluşmadı.'}
        </Txt>
      ) : (
        <>
          <View>
            {siraliRutinler.map((rutin, index) => (
              <Fragment key={rutin.rutin_id}>
                {index > 0 ? <View style={stil.ayrac} /> : null}
                <RutinAkordiyonu
                  rutin={rutin}
                  enYuksekKurus={enYuksek}
                  acik={acikRutinId === rutin.rutin_id}
                  onToggle={() => setAcikRutinId((mevcut) => mevcut === rutin.rutin_id ? null : rutin.rutin_id)}
                />
              </Fragment>
            ))}
          </View>
        </>
      )}
      <View style={{ height: rhythm.blockInCard }} />
      <Button variant="ghost" label={t['tasarruf.rutin.btn']} auto onPress={onRutinleriAcPress} />
    </View>
  );
}

function RutinAkordiyonu({
  rutin,
  enYuksekKurus,
  acik,
  onToggle,
}: {
  rutin: RutinTasarrufu;
  enYuksekKurus: number;
  acik: boolean;
  onToggle: () => void;
}) {
  const { gunler, kalanGunSayisi } = rutinTasarrufGunleriniGoster(rutin);
  const { gunSayisi, adet } = rutinTasarrufSayilari(rutin);
  const detayVar = gunler.length > 0;
  const ozet = detayVar ? tasarrufRutinOzet(gunSayisi, adet) : t['tasarruf.rutin.otomatikKisa'];
  const oran = enYuksekKurus > 0 ? rutin.tasarruf_kurus / enYuksekKurus : 0;

  return (
    <View>
      <Pressable
        onPress={detayVar ? onToggle : undefined}
        disabled={!detayVar}
        accessibilityRole="button"
        accessibilityState={{ expanded: detayVar ? acik : undefined, disabled: !detayVar }}
        accessibilityLabel={`${rutin.ad}. ${ozet}. ${paraYaz(rutin.tasarruf_kurus)}`}
        style={({ pressed }) => [stil.rutinBaslik, pressed && stil.rutinBasili]}>
        <CategoryIconBox kategori={kategori(rutin.kategori ?? 'diger')} />
        <View style={stil.rutinOrta}>
          <Txt role="bodyStrong" numberOfLines={1}>{rutin.ad}</Txt>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="micro" tone={color.text2}>{ozet}</Txt>
          <View style={{ height: rhythm.group }} />
          <View style={stil.oluk}>
            <View style={[stil.dolgu, { width: `${oran * 100}%` }]} />
          </View>
        </View>
        <View style={stil.rutinSag}>
          <Txt role="amount">{paraYaz(rutin.tasarruf_kurus)}</Txt>
          {detayVar ? (
            <View style={[stil.ok, acik && stil.okAcik]}>
              <Icon name="chevron-down" size={20} color={color.text2} />
            </View>
          ) : null}
        </View>
      </Pressable>

      {acik && gunler.length > 0 ? (
        <View style={stil.detay}>
          <Txt role="label" tone={color.text2}>{t['tasarruf.rutin.gunGun']}</Txt>
          <View style={{ height: rhythm.group }} />
          {gunler.map((gun, index) => (
            <Fragment key={gun.gun}>
              {index > 0 ? <View style={stil.detayAyrac} /> : null}
              <View style={stil.detaySatir}>
                <View style={stil.esnek}>
                  <Txt role="bodyStrong">{kisaTarih(tarihtenGun(gun.gun))}</Txt>
                  <Txt role="micro" tone={color.text2}>{tasarrufRutinGunDetay(gun.adet, paraYaz(gun.birim_fiyat_kurus))}</Txt>
                </View>
                <Txt role="amount">{paraYaz(gun.tasarruf_kurus)}</Txt>
              </View>
            </Fragment>
          ))}
          {kalanGunSayisi > 0 ? (
            <>
              <View style={stil.detayAyrac} />
              <Txt role="caption" tone={color.text2}>{tasarrufRutinFazlaGun(kalanGunSayisi)}</Txt>
            </>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const stil = StyleSheet.create({
  kart: {
    padding: rhythm.pad,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.card,
    backgroundColor: color.surface,
  },
  ustSatir: { flexDirection: 'row', alignItems: 'center' },
  ustMetin: { flex: 1, minWidth: 0 },
  rutinBaslik: { minHeight: 80, paddingVertical: rhythm.blockInCard, flexDirection: 'row', alignItems: 'center', gap: rhythm.blockInCard },
  rutinBasili: { backgroundColor: color.groove },
  rutinOrta: { flex: 1, minWidth: 0 },
  rutinSag: { alignItems: 'flex-end', gap: rhythm.group },
  oluk: { height: 8, borderRadius: 999, backgroundColor: color.groove, overflow: 'hidden' },
  dolgu: { height: 8, borderRadius: 999, backgroundColor: color.primary },
  ok: { transform: [{ rotate: '0deg' }] },
  okAcik: { transform: [{ rotate: '180deg' }] },
  ayrac: { height: 1, backgroundColor: color.line, marginLeft: 56 },
  detay: { marginLeft: 56, paddingBottom: rhythm.blockInCard },
  detaySatir: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
  detayAyrac: { height: 1, backgroundColor: color.line },
  esnek: { flex: 1, minWidth: 0 },
});
