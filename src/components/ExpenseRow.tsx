import { islemHatasiniGoster } from '@/lib/islemHatasi';
import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { Pressable, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { CategoryIconBox } from '@/components/CategoryIconBox';
import { ClayPressable } from '@/components/ClayPressable';
import { Dialog } from '@/components/Dialog';
import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { silGovdeTaksit, t } from '@/content/metinler';
import type { Harcama } from '@/db/harcama';
import { harcamaTekilSilVeGeriAlSun, harcamaTekrarla, taksitSerisiSilVeToastGoster } from '@/lib/harcamaEylemleri';
import { kategori } from '@/lib/kategoriler';
import { paraYaz } from '@/lib/para';
import { saatYaz } from '@/lib/tarih';
import { color, radius, rhythm, size } from '@/theme/tokens';

const EYLEM_GENISLIK = 84;

/**
 * §7.3 — liste satırı. Her satır AYRI kabarık yüzey, aralarında 8.
 * Limit dışı satır: zemin `warning-soft`, tutarın altında "limit dışı".
 * Ünlem / üstü çizili / kırmızı yok.
 *
 * Akış C/D (ekran-envanteri §3, K-035 onaylı) — `kaydirilabilir` true iken
 * (E-10 · E-14): sola kaydır → **Tekrarla** (aynı tutar/kategori/ödeme,
 * bugüne yeni kayıt) · sağa kaydır → **Sil** (K-029: tek harcama onaysız +
 * 6 sn geri al toast'ı, taksit serisi `Dialog`). E-13 özet satırı gibi
 * statik kullanımlarda prop verilmez, kaydırma eklenmez.
 *
 * K-043 (Tur F) — silme kaydırma zemini `danger-soft` / metin-ikon
 * `danger-ink` oldu: silme her zaman geri alınabilir (6 sn toast), bu
 * yüzden §1.3'ün dört `danger` bağlamı ihlal edilmez (bkz. K-029 gerekçesi
 * D-2a raporunda); yalnız zemin artık işlemi daha net "silme" olarak işaretliyor.
 */
export function ExpenseRow({
  harcama,
  limitDisi = false,
  onPress,
  kaydirilabilir = false,
}: {
  harcama: Harcama;
  limitDisi?: boolean;
  onPress?: () => void;
  /** E-10/E-14 satırlarında true — Akış C/D kaydırma eylemlerini açar. */
  kaydirilabilir?: boolean;
}) {
  const db = useSQLiteContext();
  const [silDialogAcik, setSilDialogAcik] = useState(false);
  const [siliniyor, setSiliniyor] = useState(false);

  const kat = kategori(harcama.kategori);
  const tutar = paraYaz(harcama.tutarKurus);
  // Birincil satır: ürün adı varsa o, yoksa kategori adı (Ü-5: ayrı alan)
  const birincil = harcama.urunAdi ?? kat.ad;
  const odemeEtiketi = harcama.odeme === 'nakit' ? 'Nakit' : 'Kart';
  // §7.3 `installment` durumu — "3/12 taksit" ikincil satıra eklenir, ikon değişmez.
  const taksitEtiketi =
    harcama.taksitId && harcama.taksitNo && harcama.taksitToplam
      ? ` · ${harcama.taksitNo}/${harcama.taksitToplam} taksit`
      : '';
  const ikincil = `${saatYaz(harcama.zaman)} · ${odemeEtiketi}${taksitEtiketi}`;
  // "Kalan {adet} taksit" — bu kayıttan SONRAKİ ödenmemiş taksit sayısı (E-13 ile aynı formül).
  const seriKalan = Math.max((harcama.taksitToplam ?? 0) - (harcama.taksitNo ?? 0), 0);

  function tekrarla() {
    void harcamaTekrarla(db, harcama).catch(islemHatasiniGoster);
  }

  function silBaslat() {
    if (harcama.taksitId) {
      setSilDialogAcik(true);
    } else {
      void harcamaTekilSilVeGeriAlSun(db, harcama).catch(islemHatasiniGoster);
    }
  }

  async function taksitSerisiniSil() {
    if (!harcama.taksitId) return;
    setSiliniyor(true);
    try {
      await taksitSerisiSilVeToastGoster(db, harcama.taksitId);
      setSilDialogAcik(false);
    } catch {
      islemHatasiniGoster();
    } finally {
      setSiliniyor(false);
    }
  }

  const satir = (
    <ClayPressable
      onPress={onPress}
      accessibilityLabel={`${birincil}, ${tutar}, ${ikincil}${limitDisi ? ', limit dışı' : ''}`}
      borderRadius={radius.tile}
      background={limitDisi ? color.warningSoft : color.surface}
      pressedBackground={color.groove}
      style={stil.satir}
      accessibilityActions={
        kaydirilabilir
          ? [
              { name: 'tekrarla', label: t['eylem.tekrarla'] },
              { name: 'sil', label: t['eylem.sil'] },
            ]
          : undefined
      }
      onAccessibilityAction={
        kaydirilabilir
          ? (e) => {
              if (e.nativeEvent.actionName === 'tekrarla') tekrarla();
              else if (e.nativeEvent.actionName === 'sil') silBaslat();
            }
          : undefined
      }>
      <CategoryIconBox kategori={kat} />
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.orta}>
        <Txt role="body" numberOfLines={1} ellipsizeMode="tail">
          {birincil}
        </Txt>
        <Txt role="caption" numberOfLines={1}>
          {ikincil}
        </Txt>
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.sag}>
        <Txt role="amount">{tutar}</Txt>
        {limitDisi ? (
          <Txt role="caption" tone={color.warningInk}>
            limit dışı
          </Txt>
        ) : null}
      </View>
    </ClayPressable>
  );

  if (!kaydirilabilir) return satir;

  return (
    <>
      <Swipeable
        overshootLeft={false}
        overshootRight={false}
        leftThreshold={40}
        rightThreshold={40}
        renderLeftActions={(_progress, _drag, sw) => (
          <EylemPaneli
            kenar="left"
            zemin={color.dangerSoft}
            tonu={color.dangerInk}
            icon="trash"
            etiket={t['eylem.sil']}
            onPress={() => {
              sw.close();
              silBaslat();
            }}
          />
        )}
        renderRightActions={(_progress, _drag, sw) => (
          <EylemPaneli
            kenar="right"
            zemin={color.primarySoft}
            tonu={color.primaryText}
            icon="repeat"
            etiket={t['eylem.tekrarla']}
            onPress={() => {
              sw.close();
              tekrarla();
            }}
          />
        )}>
        {satir}
      </Swipeable>

      {harcama.taksitId ? (
        <Dialog
          visible={silDialogAcik}
          baslik={t['sil.baslik']}
          govde={silGovdeTaksit(seriKalan)}
          ozet={<ExpenseRow harcama={harcama} limitDisi={limitDisi} />}
          silEtiketi={t['sil.onayla']}
          vazgecEtiketi={t['sil.vazgec']}
          siliniyor={siliniyor}
          onSil={() => void taksitSerisiniSil()}
          onVazgec={() => setSilDialogAcik(false)}
        />
      ) : null}
    </>
  );
}

function EylemPaneli({
  kenar,
  zemin,
  tonu,
  icon,
  etiket,
  onPress,
}: {
  kenar: 'left' | 'right';
  zemin: string;
  tonu: string;
  icon: IconName;
  etiket: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={etiket}
      style={[
        stil.eylem,
        { backgroundColor: zemin },
        kenar === 'left'
          ? { borderTopLeftRadius: radius.tile, borderBottomLeftRadius: radius.tile }
          : { borderTopRightRadius: radius.tile, borderBottomRightRadius: radius.tile },
      ]}>
      <Icon name={icon} size={22} color={tonu} />
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="caption" tone={tonu}>
        {etiket}
      </Txt>
    </Pressable>
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
  // tutar hiç kırpılmaz
  sag: { alignItems: 'flex-end', flexShrink: 0 },
  eylem: {
    width: EYLEM_GENISLIK,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
