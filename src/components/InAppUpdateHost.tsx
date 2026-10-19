import { useEffect, useRef, useState } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ClaySurface } from '@/components/ClaySurface';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { clay, color, radius, rhythm } from '@/theme/tokens';
import { t } from '@/content/metinler';

type GuncellemeBilgisi = {
  storeVersion?: string;
  immediateAllowed?: boolean;
};

/**
 * Google Play'den kurulmuş production Android sürümlerinde açılışta yeni
 * versionCode'u kontrol eder. Expo Go ve development build'lerde native Play
 * güncelleme akışı bulunmadığından hiçbir şey çizmez.
 */
export function InAppUpdateHost() {
  const [bilgi, setBilgi] = useState<GuncellemeBilgisi | null>(null);
  const [guncelleniyor, setGuncelleniyor] = useState(false);
  const [hata, setHata] = useState(false);
  const aktif = useRef(true);

  useEffect(() => {
    aktif.current = true;
    if (__DEV__ || Platform.OS !== 'android') return () => { aktif.current = false; };

    void import('expo-in-app-updates')
      .then(async (guncelleme) => {
        const sonuc = await guncelleme.checkForUpdate();
        if (aktif.current && sonuc.updateAvailable) {
          setBilgi({
            storeVersion: sonuc.storeVersion,
            immediateAllowed: sonuc.immediateAllowed,
          });
        }
      })
      .catch(() => {
        // Play Store dışından kurulan paketlerde kontrol sessizce atlanır.
      });

    return () => { aktif.current = false; };
  }, []);

  async function guncelle() {
    setGuncelleniyor(true);
    setHata(false);
    try {
      const guncelleme = await import('expo-in-app-updates');
      // Google Play izin veriyorsa tam ekran immediate akışı kullanılır.
      // İzin vermiyorsa kütüphane uygun Play akışını (flexible) seçer.
      const basladi = await guncelleme.startUpdate(bilgi?.immediateAllowed ? true : undefined);
      if (!basladi) setHata(true);
    } catch {
      setHata(true);
    } finally {
      if (aktif.current) setGuncelleniyor(false);
    }
  }

  return (
    <Modal
      visible={bilgi !== null}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}>
      <View style={stil.katman} accessibilityViewIsModal>
        <View style={stil.scrim} />
        <View style={stil.pad}>
          <ClaySurface level="raisedLg" borderRadius={radius.card} style={stil.kart}>
            <View style={stil.ikonKab}>
              <Icon name="refresh-cw" size={24} color={color.primary} />
            </View>
            <View style={{ height: rhythm.blockInCard }} />
            <Txt role="h2">{t['ui.common.new_version']}</Txt>
            <View style={{ height: rhythm.group }} />
            <Txt role="body">{t['ui.common.update_message']}</Txt>
            {bilgi?.storeVersion ? (
              <>
                <View style={{ height: rhythm.group }} />
                <Txt role="caption" tone={color.text2}>{t['ui.common.play_version']}{bilgi.storeVersion}</Txt>
              </>
            ) : null}
            {hata ? (
              <>
                <View style={{ height: rhythm.group }} />
                <Txt role="caption" tone={color.dangerInk}>
                  {t['ui.common.update_failed']}</Txt>
              </>
            ) : null}
            <View style={{ height: rhythm.blockInCard }} />
            <Button
              label={hata ? t['ui.common.retry'] : t['ui.common.update_now']}
              loading={guncelleniyor}
              loadingLabel={t['ui.common.update_launching']}
              variant="primary"
              icon="refresh-cw"
              onPress={() => void guncelle()}
            />
          </ClaySurface>
        </View>
      </View>
    </Modal>
  );
}

const stil = StyleSheet.create({
  katman: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrim: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: color.scrim },
  pad: { width: '100%', paddingHorizontal: rhythm.pad },
  kart: { padding: rhythm.pad, borderWidth: 1, borderColor: color.line },
  ikonKab: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.tile,
    backgroundColor: color.primarySoft,
    boxShadow: clay.sunken,
  },
});
