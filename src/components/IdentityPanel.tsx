import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { color, radius, rhythm } from '@/theme/tokens';

type Olgu = { icon: 'trending-up'; olgu: string; baglam: string };

/** Profilin kompakt kimlik özeti; menüden görsel rol çalmayan tek satırlı yüzey. */
export function IdentityPanel(
  props:
    | { variant: 'signed-in'; eposta: string; saglayiciEtiketi: string; olgu: Olgu; onPress: () => void }
    | { variant: 'signed-out'; onOturumAc: () => void }
    | { variant: 'error'; onRetry: () => void }
    | { variant: 'skeleton' },
) {
  if (props.variant === 'skeleton') {
    return (
      <View style={stil.panel}>
        <Skeleton width={48} height={48} borderRadius={radius.tile} />
        <View style={{ width: rhythm.blockInCard }} />
        <View style={stil.esnek}>
          <Skeleton width="72%" height={16} />
          <View style={{ height: rhythm.group }} />
          <Skeleton width="48%" height={13} />
        </View>
      </View>
    );
  }

  if (props.variant === 'signed-out') {
    return (
      <View style={[stil.panel, stil.dikey]}>
        <Txt role="bodyStrong">{t['profil.kimlik.hesapsiz.baslik']}</Txt>
        <View style={{ height: rhythm.sameObject }} />
        <Txt role="caption" tone={color.text2}>{t['profil.kimlik.hesapsiz.alt']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <Button variant="secondary" label={t['profil.kimlik.hesapsiz.btn']} auto onPress={props.onOturumAc} />
      </View>
    );
  }

  if (props.variant === 'error') {
    return (
      <View style={[stil.panel, stil.dikey]}>
        <Txt role="bodyStrong">{t['profil.kimlik.hata.baslik']}</Txt>
        <View style={{ height: rhythm.sameObject }} />
        <Txt role="caption" tone={color.text2}>{t['profil.kimlik.hata.alt']}</Txt>
        <View style={{ height: rhythm.blockInCard }} />
        <Button variant="secondary" label={t['profil.kimlik.hata.btn']} auto onPress={props.onRetry} />
      </View>
    );
  }

  const { eposta, saglayiciEtiketi, olgu, onPress } = props;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Hesabını aç. ${eposta}. ${olgu.olgu}, ${olgu.baglam}`}
      style={({ pressed }) => [stil.panel, pressed && stil.basili]}>
      <View style={stil.avatar}>
        <Icon name="user" size={22} color="#FFFFFF" />
      </View>
      <View style={{ width: rhythm.blockInCard }} />
      <View style={stil.esnek}>
        <Txt role="bodyStrong" numberOfLines={1} ellipsizeMode="tail">{eposta}</Txt>
        <View style={{ height: rhythm.sameObject }} />
        <Txt role="caption" tone={color.text2} numberOfLines={1}>{saglayiciEtiketi}</Txt>
      </View>
      <View style={stil.seriPill}>
        <Icon name={olgu.icon} size={20} color={color.successInk} />
        <View style={{ width: rhythm.sameObject }} />
        <Txt role="label" tone={color.successInk} numberOfLines={1}>{olgu.olgu}</Txt>
      </View>
      <View style={{ width: rhythm.group }} />
      <Icon name="chevron-right" size={20} color={color.text2} />
    </Pressable>
  );
}

const stil = StyleSheet.create({
  panel: {
    minHeight: 80,
    padding: rhythm.pad,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.tile,
  },
  dikey: { alignItems: 'flex-start', flexDirection: 'column' },
  basili: { backgroundColor: color.groove },
  avatar: { width: 48, height: 48, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center', backgroundColor: color.navDark },
  seriPill: { minHeight: 32, maxWidth: 112, paddingHorizontal: rhythm.group, flexDirection: 'row', alignItems: 'center', borderRadius: radius.pill, backgroundColor: color.successSoft },
  esnek: { flex: 1, minWidth: 0 },
});
