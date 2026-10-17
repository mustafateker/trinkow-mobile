import { faAmazon } from '@fortawesome/free-brands-svg-icons/faAmazon';
import { faApple } from '@fortawesome/free-brands-svg-icons/faApple';
import { faAudible } from '@fortawesome/free-brands-svg-icons/faAudible';
import { faDeezer } from '@fortawesome/free-brands-svg-icons/faDeezer';
import { faDropbox } from '@fortawesome/free-brands-svg-icons/faDropbox';
import { faDuolingo } from '@fortawesome/free-brands-svg-icons/faDuolingo';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons/faGoogleDrive';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons/faMicrosoft';
import { faOpenai } from '@fortawesome/free-brands-svg-icons/faOpenai';
import { faPlaystation } from '@fortawesome/free-brands-svg-icons/faPlaystation';
import { faSoundcloud } from '@fortawesome/free-brands-svg-icons/faSoundcloud';
import { faSpotify } from '@fortawesome/free-brands-svg-icons/faSpotify';
import { faStrava } from '@fortawesome/free-brands-svg-icons/faStrava';
import { faTidal } from '@fortawesome/free-brands-svg-icons/faTidal';
import { faXbox } from '@fortawesome/free-brands-svg-icons/faXbox';
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import type { SubscriptionBrand } from '@/lib/abonelikMarkalari';
import { color, radius } from '@/theme/tokens';

type MarkaIkonu = typeof faYoutube;

const MARKA_IKONLARI: Partial<Record<string, MarkaIkonu>> = {
  'amazon-prime': faAmazon,
  'youtube-premium': faYoutube,
  'apple-tv-plus': faApple,
  spotify: faSpotify,
  'apple-music': faApple,
  'youtube-music': faYoutube,
  'amazon-music': faAmazon,
  audible: faAudible,
  tidal: faTidal,
  deezer: faDeezer,
  'soundcloud-go': faSoundcloud,
  chatgpt: faOpenai,
  gemini: faGoogle,
  'microsoft-copilot': faMicrosoft,
  'google-one': faGoogleDrive,
  'apple-one': faApple,
  'icloud-plus': faApple,
  'microsoft-365': faMicrosoft,
  dropbox: faDropbox,
  'github-copilot': faGithub,
  'playstation-plus': faPlaystation,
  'xbox-game-pass': faXbox,
  strava: faStrava,
  'duolingo-super': faDuolingo,
};

export function SubscriptionBrandLogo({ marka, size = 44 }: { marka: SubscriptionBrand; size?: number }) {
  const ikon = MARKA_IKONLARI[marka.id];
  const ikonBoyutu = Math.round(size * 0.55);
  const paths = ikon?.icon[4];
  const markaRengi = marka.renk ?? color.text2;
  return (
    <View style={[stil.kutu, { width: size, height: size, borderRadius: size >= 44 ? radius.tile : radius.pill }]}>
      {ikon && paths ? (
        <Svg width={ikonBoyutu} height={ikonBoyutu} viewBox={`0 0 ${ikon.icon[0]} ${ikon.icon[1]}`} accessibilityElementsHidden>
          {(Array.isArray(paths) ? paths : [paths]).map((path, index) => <Path key={index} d={path} fill={markaRengi} />)}
        </Svg>
      ) : marka.id === 'diger' ? (
        <Icon name="plus" size={20} color={markaRengi} />
      ) : (
        <Txt role={marka.monogram && marka.monogram.length > 2 ? 'micro' : 'h2'} tone={markaRengi} numberOfLines={1}>{marka.monogram}</Txt>
      )}
    </View>
  );
}

const stil = StyleSheet.create({
  kutu: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
  },
});
