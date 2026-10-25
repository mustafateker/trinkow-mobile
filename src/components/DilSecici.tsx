import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { SettingGroup } from '@/components/SettingRow';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { DILLER, metin, type Dil } from '@/i18n/cekirdek';
import { diliDegistir } from '@/i18n/dilDeposu';
import { useDil } from '@/i18n/useDil';
import { color, rhythm, size } from '@/theme/tokens';

/** Dilin KENDİ dilindeki adı — "Türkçe", "English", "Deutsch". */
export function dilAdi(dil: Dil): string {
  return DILLER.find((d) => d.kod === dil)?.ad ?? dil;
}

/** "Dili değiştir, şu an Türkçe" — dil satırı/düğmesi için ekran okuyucu etiketi. */
export function dilA11yEtiketi(dil: Dil): string {
  return metin('a11y.dil.degistir', { dil: dilAdi(dil) });
}

/**
 * Dil seçim sayfası — ActivationKing'in dil açılır menüsünün karşılığı.
 * 11 dil, her biri KENDİ dilindeki adıyla listelenir (kullanıcı okuyamadığı
 * bir dilde takılı kalmasın). Seçim anında uygulanır, ekranlar yenilenir ve
 * cihazda saklanır (`dilDeposu.ts#diliDegistir`).
 */
export function DilSecimSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const aktif = useDil();
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Txt role="h2">{t['dil.sec']}</Txt>
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="caption" tone={color.text2}>{t['dil.aciklama']}</Txt>
      <View style={{ height: rhythm.blockInCard }} />
      <SettingGroup>
        {DILLER.map((d) => {
          const secili = d.kod === aktif;
          return (
            <Pressable
              key={d.kod}
              onPress={() => {
                diliDegistir(d.kod);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: secili }}
              accessibilityLabel={d.ad}
              accessibilityLanguage={d.etiket}
              style={({ pressed }) => [stil.satir, pressed ? { backgroundColor: color.groove } : null]}>
              <Txt role={secili ? 'bodyStrong' : 'body'} style={stil.esnek}>{d.ad}</Txt>
              {secili ? <Icon name="check" size={20} color={color.primaryText} /> : null}
            </Pressable>
          );
        })}
      </SettingGroup>
      <View style={{ height: rhythm.pad }} />
    </BottomSheet>
  );
}

/**
 * Giriş ekranlarının koyu üst barındaki dil düğmesi (`AuthShell`) —
 * ActivationKing'de login sayfasındaki dil seçicinin karşılığı: kullanıcı
 * hesap açmadan önce dili değiştirebilir.
 */
export function DilDugmesi() {
  const dil = useDil();
  const [acik, setAcik] = useState(false);
  return (
    <>
      <IconButton
        icon="globe"
        accessibilityLabel={dilA11yEtiketi(dil)}
        tone="#FFFFFF"
        background={color.navGlassBg}
        pressedBackground={color.navGlassBgPressed}
        onPress={() => setAcik(true)}
      />
      <DilSecimSheet visible={acik} onClose={() => setAcik(false)} />
    </>
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
});
