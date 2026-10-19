import { Image, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import { color, radius, rhythm, space } from '@/theme/tokens';
import { t } from '@/content/metinler';

const TRINKOW_LOGO = require('../../assets/images/trinkow-brand-mark.png');

/**
 * Native splash ile oturum kararı arasındaki markalı açılış yüzeyi.
 * Burada eylem yoktur; kullanıcıyı bekletmek yerine oturum kontrolü
 * sürerken uygulamanın kimliğini kesintisiz gösterir.
 */
export function LaunchScreen({ onReady }: { onReady: () => void }) {
  return (
    <View
      style={stil.ekran}
      onLayout={onReady}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t['ui.common.launching']}>
      <View pointerEvents="none" style={[stil.isik, stil.isikSag]} />
      <View pointerEvents="none" style={[stil.isik, stil.isikSol]} />
      <View pointerEvents="none" style={stil.halka} />

      <View style={stil.icerik}>
        <View style={stil.logoYuvasi}>
          <Image source={TRINKOW_LOGO} style={stil.logo} resizeMode="contain" accessibilityIgnoresInvertColors />
        </View>
        <View style={{ height: rhythm.section }} />
        <Txt role="display" tone={color.onPrimary} style={stil.marka}>
          Trinkow
        </Txt>
        <View style={{ height: rhythm.group }} />
        <Txt role="body" tone={color.launchText} style={stil.slogan}>
          {t['ui.common.slogan']}</Txt>
      </View>

      <View style={stil.yukleme} accessibilityElementsHidden>
        <View style={stil.yuklemeIzi}>
          <View style={stil.yuklemeVurgu} />
        </View>
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  ekran: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: color.launchBg,
  },
  icerik: {
    alignItems: 'center',
    paddingHorizontal: space[6],
    transform: [{ translateY: -space[4] }],
  },
  logoYuvasi: {
    width: space[8] * 4,
    height: space[8] * 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.hero * 2,
    backgroundColor: color.launchGlass,
    borderWidth: 1,
    borderColor: color.launchLine,
    boxShadow: '0 24px 54px rgba(1,8,48,0.34)',
  },
  logo: {
    width: space[8] * 3.5,
    height: space[8] * 3.5,
  },
  marka: {
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  slogan: {
    maxWidth: 280,
    textAlign: 'center',
  },
  isik: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: radius.pill,
  },
  isikSag: {
    top: -120,
    right: -120,
    backgroundColor: color.launchCyanGlow,
  },
  isikSol: {
    left: -160,
    bottom: -120,
    backgroundColor: color.launchPurpleGlow,
  },
  halka: {
    position: 'absolute',
    width: 440,
    height: 440,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.launchLine,
  },
  yukleme: {
    position: 'absolute',
    bottom: space[8],
    alignItems: 'center',
  },
  yuklemeIzi: {
    width: 48,
    height: 4,
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: color.launchTrack,
  },
  yuklemeVurgu: {
    width: 24,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: color.launchAccent,
  },
});
