import { router } from 'expo-router';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { aktifDil } from '@/i18n/cekirdek';
import { useDil } from '@/i18n/useDil';
import { useUyelik } from '@/lib/uyelik';
import { color, radius, rhythm } from '@/theme/tokens';

const REKLAM_METINLERI: Record<
  string,
  { etiket: string; baslik: string; alt: string; kaldir: string }
> = {
  tr: {
    etiket: 'REKLAM',
    baslik: 'Trinkow Premium ile sınırları kaldır',
    alt: 'Haftalık/aylık analizler, tasarruf takibi ve reklamsız deneyim.',
    kaldir: 'Reklamları kaldır',
  },
  en: {
    etiket: 'AD',
    baslik: 'Unlock full insights with Trinkow Premium',
    alt: 'Weekly/monthly analytics, savings tracking, and an ad-free experience.',
    kaldir: 'Remove ads',
  },
  de: {
    etiket: 'ANZEIGE',
    baslik: 'Mehr Überblick mit Trinkow Premium',
    alt: 'Wochen-/Monatsanalysen, Spar-Tracking und werbefreie Nutzung.',
    kaldir: 'Werbung entfernen',
  },
  fr: {
    etiket: 'PUB',
    baslik: 'Passez à Trinkow Premium',
    alt: 'Analyses détaillées, suivi d’épargne et expérience sans publicité.',
    kaldir: 'Supprimer les pubs',
  },
  es: {
    etiket: 'ANUNCIO',
    baslik: 'Descubre Trinkow Premium',
    alt: 'Análisis detallados, control de ahorro y uso sin anuncios.',
    kaldir: 'Quitar anuncios',
  },
  it: {
    etiket: 'ANNUNCIO',
    baslik: 'Passa a Trinkow Premium',
    alt: 'Analisi approfondite, monitoraggio risparmi e zero pubblicità.',
    kaldir: 'Rimuovi annunci',
  },
  pt: {
    etiket: 'ANÚNCIO',
    baslik: 'Desbloqueia o Trinkow Premium',
    alt: 'Análises completas, controlo de poupança e utilização sem anúncios.',
    kaldir: 'Remover anúncios',
  },
  ro: {
    etiket: 'RECLAMĂ',
    baslik: 'Descoperă Trinkow Premium',
    alt: 'Analize detaliate, urmărirea economiilor și utilizare fără reclame.',
    kaldir: 'Elimină reclamele',
  },
  pl: {
    etiket: 'REKLAMA',
    baslik: 'Odkryj Trinkow Premium',
    alt: 'Szczegółowe analizy, śledzenie oszczędności i brak reklam.',
    kaldir: 'Usuń reklamy',
  },
  ru: {
    etiket: 'РЕКЛАМА',
    baslik: 'Откройте Trinkow Premium',
    alt: 'Подробная аналитика, учет накоплений и работа без рекламы.',
    kaldir: 'Убрать рекламу',
  },
  cs: {
    etiket: 'REKLAMA',
    baslik: 'Objev Trinkow Premium',
    alt: 'Podrobné analýzy, sledování úspor a používání bez reklam.',
    kaldir: 'Odstranit reklamy',
  },
};

/**
 * Ücretsiz planda gösterilen, Premium üyelik aktif olduğunda otomatik gizlenen
 * yerel sponsorlu tanıtım/reklam alanı (iOS & Android).
 */
export function ReklamSeridi({ style }: { style?: StyleProp<ViewStyle> } = {}) {
  useDil();
  const uyelik = useUyelik();
  // Premium kullanıcı reklam görmez
  if (uyelik.premium) return null;

  const dil = aktifDil();
  const m = REKLAM_METINLERI[dil] ?? REKLAM_METINLERI.tr;

  const premiumAc = () => {
    router.push({ pathname: '/premium', params: { tur: 'indirim', kaynak: 'kilit' } });
  };

  return (
    <Pressable
      onPress={premiumAc}
      accessibilityRole="button"
      accessibilityLabel={`${m.etiket}: ${m.baslik}. ${m.kaldir}`}
      style={({ pressed }) => [stil.kutu, pressed ? stil.basili : null, style]}>
      <View style={stil.ustSatir}>
        <View style={stil.etiketHap}>
          <Txt role="micro" tone={color.text2} style={stil.etiketYazi}>
            {m.etiket}
          </Txt>
        </View>
        <View style={stil.kaldirBaglanti}>
          <Icon name="eye-off" size={14} color={color.primaryText} />
          <Txt role="micro" tone={color.primaryText} style={stil.kaldirYazi}>
            {m.kaldir}
          </Txt>
        </View>
      </View>
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="bodyStrong" numberOfLines={1}>
        {m.baslik}
      </Txt>
      <View style={{ height: 2 }} />
      <Txt role="caption" tone={color.text2} numberOfLines={2}>
        {m.alt}
      </Txt>
    </Pressable>
  );
}

const stil = StyleSheet.create({
  kutu: {
    padding: rhythm.blockInCard,
    borderRadius: radius.tile,
    backgroundColor: color.well,
    borderWidth: 1,
    borderColor: color.line,
    marginBottom: rhythm.group,
  },
  basili: {
    opacity: 0.85,
  },
  ustSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etiketHap: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
  },
  etiketYazi: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  kaldirBaglanti: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  kaldirYazi: {
    fontWeight: '600',
  },
});
