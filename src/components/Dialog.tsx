import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ClayPressable } from '@/components/ClayPressable';
import { ClaySurface } from '@/components/ClaySurface';
import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm } from '@/theme/tokens';

/**
 * Bileşen envanteri §4 `Dialog` — YALNIZ yüksek etkili, geri alınamaz
 * işlem için (K-029): taksit serisi silme · tüm verileri silme. Tek
 * harcama silme dialog AÇMAZ (bkz. E-12 — 6 sn'lik geri al toast'ı).
 *
 * Yapı: çukur `danger-soft` ikon kabı → h2 başlık → tek satır sonuç →
 * (isteğe bağlı) özet → dikey butonlar: üstte "Sil" (danger), altında
 * "Vazgeç" (ghost). `danger` renginin izinli dört bağlamından biri.
 */
export function Dialog({
  visible,
  icon = 'trash',
  baslik,
  govde,
  ozet,
  silEtiketi,
  vazgecEtiketi,
  siliniyor = false,
  onSil,
  onVazgec,
}: {
  visible: boolean;
  icon?: IconName;
  baslik: string;
  govde: string;
  ozet?: ReactNode;
  silEtiketi: string;
  vazgecEtiketi: string;
  siliniyor?: boolean;
  onSil: () => void;
  onVazgec: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onVazgec}>
      <View style={stil.katman}>
        <Pressable
          style={stil.scrim}
          accessibilityRole="button"
          accessibilityLabel="Vazgeç"
          onPress={siliniyor ? undefined : onVazgec}
        />
        <View style={stil.pad}>
          <ClaySurface level="raisedLg" borderRadius={radius.card} style={stil.dialog}>
            <View style={stil.ikonKab}>
              <Icon name={icon} size={20} color={color.dangerInk} />
            </View>
            <View style={{ height: rhythm.blockInCard }} />
            <Txt role="h2">{baslik}</Txt>
            <View style={{ height: rhythm.group }} />
            <Txt role="body">{govde}</Txt>
            {ozet ? (
              <>
                <View style={{ height: rhythm.blockInCard }} />
                {ozet}
              </>
            ) : null}
            <View style={{ height: rhythm.blockInCard }} />
            <DangerButton label={silEtiketi} loading={siliniyor} onPress={onSil} />
            <View style={{ height: rhythm.group }} />
            <Button label={vazgecEtiketi} variant="ghost" onPress={onVazgec} disabled={siliniyor} />
          </ClaySurface>
        </View>
      </View>
    </Modal>
  );
}

/**
 * "Sil" — `danger` renkli birincil eylem. tokens §7.1'in genel `Button`
 * bileşeni yalnız 3 varyant taşır (primary/secondary/ghost); bu, o
 * varyanlardan biri DEĞİL, yalnız `Dialog` içinde kullanılan renk
 * istisnasıdır (K-029'un izinli dört `danger` bağlamından biri).
 */
function DangerButton({
  label,
  loading,
  onPress,
}: {
  label: string;
  loading: boolean;
  onPress: () => void;
}) {
  return (
    <ClayPressable
      onPress={loading ? undefined : onPress}
      disabled={loading}
      accessibilityLabel={loading ? 'Siliniyor' : label}
      accessibilityHint="Bu işlem geri alınamaz"
      borderRadius={radius.pill}
      background={color.danger}
      pressedBackground={color.dangerInk}
      shadow={clay.action}
      pressedShadow={clay.actionPressed}
      gloss={false}
      style={stil.silBtn}>
      <Txt role="bodyStrong" tone={color.onPrimary}>
        {loading ? 'Siliniyor' : label}
      </Txt>
    </ClayPressable>
  );
}

const stil = StyleSheet.create({
  katman: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrim: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: color.scrim },
  pad: { width: '100%', paddingHorizontal: rhythm.pad },
  dialog: { padding: rhythm.pad, borderWidth: 1, borderColor: color.line },
  ikonKab: {
    width: 44,
    height: 44,
    borderRadius: radius.tile,
    backgroundColor: color.dangerSoft,
    boxShadow: clay.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  silBtn: { height: 56, alignItems: 'center', justifyContent: 'center' },
});
