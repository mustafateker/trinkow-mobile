import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Txt } from '@/components/Txt';
import { aktifDil, aktifEtiket } from '@/i18n/cekirdek';
import { useDil } from '@/i18n/useDil';
import { paraSimgesi } from '@/lib/para';
import { clay, color, layout, radius, rhythm } from '@/theme/tokens';

type Dilim = {
  renk: string;
  etiket: Record<string, string>;
  alt?: Record<string, string>;
  kazananMi?: boolean;
};

const DILIMLER: Dilim[] = [
  {
    renk: '#5C5AF6', // Trinkow Indigo
    etiket: {
      tr: '%50',
      en: '50%',
      de: '50%',
      fr: '50%',
      es: '50%',
      it: '50%',
      pt: '50%',
      ro: '50%',
      pl: '50%',
      ru: '50%',
      cs: '50%',
    },
    alt: {
      tr: 'İNDİRİM',
      en: 'OFF',
      de: 'RABATT',
      fr: 'RÉDUCTION',
      es: 'DESCUENTO',
      it: 'SCONTO',
      pt: 'DESCONTO',
      ro: 'REDUCERE',
      pl: 'ZNIŻKI',
      ru: 'СКИДКА',
      cs: 'SLEVA',
    },
    kazananMi: true,
  },
  {
    renk: '#171C42', // Deep Navy
    etiket: {
      tr: '%20',
      en: '20%',
      de: '20%',
      fr: '20%',
      es: '20%',
      it: '20%',
      pt: '20%',
      ro: '20%',
      pl: '20%',
      ru: '20%',
      cs: '20%',
    },
    alt: {
      tr: 'İNDİRİM',
      en: 'OFF',
      de: 'RABATT',
      fr: 'RÉDUCTION',
      es: 'DESCUENTO',
      it: 'SCONTO',
      pt: 'DESCONTO',
      ro: 'REDUCERE',
      pl: 'ZNIŻKI',
      ru: 'СКИДКА',
      cs: 'SLEVA',
    },
  },
  {
    renk: '#F45B6B', // Coral
    etiket: {
      tr: '%40',
      en: '40%',
      de: '40%',
      fr: '40%',
      es: '40%',
      it: '40%',
      pt: '40%',
      ro: '40%',
      pl: '40%',
      ru: '40%',
      cs: '40%',
    },
    alt: {
      tr: 'İNDİRİM',
      en: 'OFF',
      de: 'RABATT',
      fr: 'RÉDUCTION',
      es: 'DESCUENTO',
      it: 'SCONTO',
      pt: 'DESCONTO',
      ro: 'REDUCERE',
      pl: 'ZNIŻKI',
      ru: 'СКИДКА',
      cs: 'SLEVA',
    },
  },
  {
    renk: '#F39B42', // Amber
    etiket: {
      tr: '7 GÜN',
      en: '7 DAYS',
      de: '7 TAGE',
      fr: '7 JOURS',
      es: '7 DÍAS',
      it: '7 GIORNI',
      pt: '7 DIAS',
      ro: '7 ZILE',
      pl: '7 DNI',
      ru: '7 ДНЕЙ',
      cs: '7 DNÍ',
    },
    alt: {
      tr: 'ÜCRETSİZ',
      en: 'FREE',
      de: 'GRATIS',
      fr: 'GRATUIT',
      es: 'GRATIS',
      it: 'GRATIS',
      pt: 'GRÁTIS',
      ro: 'GRATUIT',
      pl: 'GRATIS',
      ru: 'БЕСПЛАТНО',
      cs: 'ZDARMA',
    },
  },
  {
    renk: '#7D60E8', // Violet
    etiket: {
      tr: '%30',
      en: '30%',
      de: '30%',
      fr: '30%',
      es: '30%',
      it: '30%',
      pt: '30%',
      ro: '30%',
      pl: '30%',
      ru: '30%',
      cs: '30%',
    },
    alt: {
      tr: 'İNDİRİM',
      en: 'OFF',
      de: 'RABATT',
      fr: 'RÉDUCTION',
      es: 'DESCUENTO',
      it: 'SCONTO',
      pt: 'DESCONTO',
      ro: 'REDUCERE',
      pl: 'ZNIŻKI',
      ru: 'СКИДКА',
      cs: 'SLEVA',
    },
  },
  {
    renk: '#29AD7B', // Emerald
    etiket: {
      tr: 'VIP',
      en: 'VIP',
      de: 'VIP',
      fr: 'VIP',
      es: 'VIP',
      it: 'VIP',
      pt: 'VIP',
      ro: 'VIP',
      pl: 'VIP',
      ru: 'VIP',
      cs: 'VIP',
    },
    alt: {
      tr: 'FIRSAT',
      en: 'DEAL',
      de: 'DEAL',
      fr: 'OFFRE',
      es: 'OFERTA',
      it: 'OFFERTA',
      pt: 'OFERTA',
      ro: 'OFERTĂ',
      pl: 'OKAZJA',
      ru: 'БОНУС',
      cs: 'AKCE',
    },
  },
];

const YEREL_METINLER: Record<string, Record<string, string>> = {
  tr: {
    ustRozet: 'TEBRİKLER! KURULUM BİTTİ',
    baslik: 'Trinkow Şans Çarkı',
    aciklama: 'Bugüne özel şansını dene, Premium indirimini anında yakala!',
    cevirBtn: 'Çarkı Çevir',
    cevriliyor: 'Çevriliyor...',
    kazandinBaslik: 'Tebrikler! %50 İndirim Kazandın! 🎉',
    kazandinAciklama: 'Bugüne özel %50 indirimli Trinkow Premium fırsatı hesabına tanımlandı.',
    normalFiyat: 'Standart fiyat:',
    indirimliFiyat: 'Özel fiyatın:',
    tasarruf: '%50 Kazanç',
    denemeBilgi: '7 gün boyunca tamamen ücretsiz dene.',
    eylemKullan: 'Fırsatı Yakala',
    eylemGec: 'Ücretsiz devam et',
  },
  en: {
    ustRozet: 'CONGRATULATIONS! SETUP COMPLETE',
    baslik: 'Trinkow Lucky Wheel',
    aciklama: 'Spin the wheel now to unlock your exclusive Premium discount!',
    cevirBtn: 'Spin the Wheel',
    cevriliyor: 'Spinning...',
    kazandinBaslik: 'Congratulations! You Won 50% Off! 🎉',
    kazandinAciklama: 'An exclusive 50% discount for Trinkow Premium is now unlocked.',
    normalFiyat: 'Standard price:',
    indirimliFiyat: 'Your special price:',
    tasarruf: '50% Savings',
    denemeBilgi: 'Try it free for 7 days.',
    eylemKullan: 'Claim 50% Discount',
    eylemGec: 'Continue for free',
  },
  de: {
    ustRozet: 'GLÜCKWUNSCH! EINRICHTUNG FERTIG',
    baslik: 'Trinkow Glücksrad',
    aciklama: 'Drehe jetzt am Rad und sichere dir deinen exklusiven Premium-Rabatt!',
    cevirBtn: 'Rad drehen',
    cevriliyor: 'Dreht sich...',
    kazandinBaslik: 'Glückwunsch! 50% Rabatt gewonnen! 🎉',
    kazandinAciklama: 'Ein exklusiver Rabatt von 50% auf Trinkow Premium wurde freigeschaltet.',
    normalFiyat: 'Regulärer Preis:',
    indirimliFiyat: 'Dein Sonderpreis:',
    tasarruf: '50% Ersparnis',
    denemeBilgi: '7 Tage völlig kostenlos testen.',
    eylemKullan: 'Rabatt sichern',
    eylemGec: 'Kostenlos fortfahren',
  },
  fr: {
    ustRozet: 'FÉLICITATIONS ! CONFIGURATION TERMINÉE',
    baslik: 'Roue de la Fortune Trinkow',
    aciklama: 'Tourne la roue et débloque ta réduction Premium exclusive !',
    cevirBtn: 'Tourner la roue',
    cevriliyor: 'En cours...',
    kazandinBaslik: 'Félicitations ! 50% de réduction gagnés ! 🎉',
    kazandinAciklama: 'Une remise exclusive de 50% sur Trinkow Premium a été débloquée.',
    normalFiyat: 'Prix standard :',
    indirimliFiyat: 'Ton prix spécial :',
    tasarruf: '50% d’économie',
    denemeBilgi: 'Essai gratuit pendant 7 jours.',
    eylemKullan: 'Profiter de l’offre',
    eylemGec: 'Continuer gratuitement',
  },
  es: {
    ustRozet: '¡ENHORABUENA! CONFIGURACIÓN LISTA',
    baslik: 'Ruleta de la Suerte Trinkow',
    aciklama: '¡Gira la ruleta ahora y consigue tu descuento exclusivo en Premium!',
    cevirBtn: 'Girar la ruleta',
    cevriliyor: 'Girando...',
    kazandinBaslik: '¡Enhorabuena! ¡Ganaste un 50% de descuento! 🎉',
    kazandinAciklama: 'Se ha desbloqueado un 50% de descuento exclusivo en Trinkow Premium.',
    normalFiyat: 'Precio habitual:',
    indirimliFiyat: 'Tu precio especial:',
    tasarruf: '50% de ahorro',
    denemeBilgi: 'Pruébalo gratis durante 7 días.',
    eylemKullan: 'Aprovechar descuento',
    eylemGec: 'Continuar gratis',
  },
  it: {
    ustRozet: 'CONGRATULAZIONI! CONFIGURAZIONE PRONTA',
    baslik: 'Ruota della Fortuna Trinkow',
    aciklama: 'Gira la ruota e sblocca il tuo sconto Premium esclusivo!',
    cevirBtn: 'Gira la ruota',
    cevriliyor: 'Gira...',
    kazandinBaslik: 'Congratulazioni! Hai vinto il 50% di sconto! 🎉',
    kazandinAciklama: 'È stato sbloccato uno sconto esclusivo del 50% su Trinkow Premium.',
    normalFiyat: 'Prezzo standard:',
    indirimliFiyat: 'Il tuo prezzo speciale:',
    tasarruf: 'Risparmio del 50%',
    denemeBilgi: 'Prova gratis per 7 giorni.',
    eylemKullan: 'Riscatta lo sconto',
    eylemGec: 'Continua gratis',
  },
  pt: {
    ustRozet: 'PARABÉNS! CONFIGURAÇÃO CONCLUÍDA',
    baslik: 'Roda da Sorte Trinkow',
    aciklama: 'Gira a roda e desbloqueia o teu desconto Premium exclusivo!',
    cevirBtn: 'Girar a roda',
    cevriliyor: 'A girar...',
    kazandinBaslik: 'Parabéns! Ganhaste 50% de desconto! 🎉',
    kazandinAciklama: 'Foi desbloqueado um desconto exclusivo de 50% no Trinkow Premium.',
    normalFiyat: 'Preço normal:',
    indirimliFiyat: 'O teu preço especial:',
    tasarruf: 'Poupança de 50%',
    denemeBilgi: 'Experimenta grátis durante 7 dias.',
    eylemKullan: 'Aproveitar desconto',
    eylemGec: 'Continuar grátis',
  },
  ro: {
    ustRozet: 'FELICITĂRI! CONFIGURARE FINALIZATĂ',
    baslik: 'Roata Norocului Trinkow',
    aciklama: 'Învârte roata acum și obține reducerea ta exclusivă Premium!',
    cevirBtn: 'Învârte roata',
    cevriliyor: 'Se învârte...',
    kazandinBaslik: 'Felicitări! Ai câștigat 50% reducere! 🎉',
    kazandinAciklama: 'O reducere exclusivă de 50% pentru Trinkow Premium este activată.',
    normalFiyat: 'Preț standard:',
    indirimliFiyat: 'Prețul tău special:',
    tasarruf: '50% economie',
    denemeBilgi: 'Încearcă gratuit timp de 7 zile.',
    eylemKullan: 'Revendică reducerea',
    eylemGec: 'Continuă gratuit',
  },
  pl: {
    ustRozet: 'GRATULACJE! KONFIGURACJA ZAKOŃCZONA',
    baslik: 'Koło Szczęścia Trinkow',
    aciklama: 'Zakręć kołem i odbierz wyjątkową zniżkę na Trinkow Premium!',
    cevirBtn: 'Zakręć kołem',
    cevriliyor: 'Kręci się...',
    kazandinBaslik: 'Gratulacje! Wygrałeś 50% zniżki! 🎉',
    kazandinAciklama: 'Dla Ciebie odblokowano 50% rabatu na Trinkow Premium.',
    normalFiyat: 'Cena standardowa:',
    indirimliFiyat: 'Twoja cena:',
    tasarruf: '50% oszczędności',
    denemeBilgi: 'Wypróbuj za darmo przez 7 dni.',
    eylemKullan: 'Odbierz zniżkę',
    eylemGec: 'Kontynuuj za darmo',
  },
  ru: {
    ustRozet: 'ПОЗДРАВЛЯЕМ! НАСТРОЙКА ЗАВЕРШЕНА',
    baslik: 'Колесо Удачи Trinkow',
    aciklama: 'Крутите колесо и получите эксклюзивную скидку на Premium!',
    cevirBtn: 'Крутить колесо',
    cevriliyor: 'Крутится...',
    kazandinBaslik: 'Поздравляем! Вы выиграли скидку 50%! 🎉',
    kazandinAciklama: 'Для вас открыта эксклюзивная скидка 50% на Trinkow Premium.',
    normalFiyat: 'Стандартная цена:',
    indirimliFiyat: 'Специальная цена:',
    tasarruf: 'Экономия 50%',
    denemeBilgi: 'Попробуйте бесплатно на 7 дней.',
    eylemKullan: 'Забрать скидку',
    eylemGec: 'Продолжить бесплатно',
  },
  cs: {
    ustRozet: 'GRATULUJEME! NASTAVENÍ DOKONČENO',
    baslik: 'Kolo Štěstí Trinkow',
    aciklama: 'Roztoč kolo a získej svou exkluzivní slevu na Premium!',
    cevirBtn: 'Roztočit kolo',
    cevriliyor: 'Točí se...',
    kazandinBaslik: 'Gratulujeme! Vyhrál jsi 50% slevu! 🎉',
    kazandinAciklama: 'Byla ti odemčena exkluzivní sleva 50% na Trinkow Premium.',
    normalFiyat: 'Běžná cena:',
    indirimliFiyat: 'Tvoje speciální cena:',
    tasarruf: 'Úspora 50%',
    denemeBilgi: 'Vyzkoušej na 7 dní zdarma.',
    eylemKullan: 'Získat slevu',
    eylemGec: 'Pokračovat zdarma',
  },
};

export type HediyeCarkiProps = {
  standartFiyat?: string | null;
  indirimliFiyat?: string | null;
  denemeGunu?: number | null;
  onFirsatiKullan: () => void;
  onVazgec: () => void;
};

const BOYUT = 300;
const YARICAP = 140;
const MERKEZ = BOYUT / 2;
const DILIM_SAYISI = DILIMLER.length;
const DILIM_ACISI = 360 / DILIM_SAYISI; // 60 derece

export function HediyeCarki({
  standartFiyat,
  indirimliFiyat,
  denemeGunu = 7,
  onFirsatiKullan,
  onVazgec,
}: HediyeCarkiProps) {
  useDil();
  const dil = aktifDil();
  const metin = YEREL_METINLER[dil] ?? YEREL_METINLER.en;

  const [donuyor, setDonuyor] = useState(false);
  const [bitti, setBitti] = useState(false);
  const [modalAcik, setModalAcik] = useState(false);

  const donusAnim = useRef(new Animated.Value(0)).current;
  const sonDilimRef = useRef(-1);

  // Dilim sınırlarını geçtikçe dokunsal tıklama (tick) hissi
  useEffect(() => {
    const id = donusAnim.addListener(({ value }) => {
      const gecilenDilim = Math.floor(value / DILIM_ACISI);
      if (gecilenDilim !== sonDilimRef.current) {
        sonDilimRef.current = gecilenDilim;
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
    });
    return () => {
      donusAnim.removeListener(id);
    };
  }, [donusAnim]);

  const cevir = useCallback(() => {
    if (donuyor || bitti) return;
    setDonuyor(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    // Dilim 0 (%50 İndirim) tam tepede (-90 derecede) yer alır.
    // 5 tam tur (1800 derece) + 0 offset ile dönünce doğrudan %50 dilimine oturur.
    const hedefAci = 360 * 5;

    Animated.timing(donusAnim, {
      toValue: hedefAci,
      duration: 4000,
      easing: Easing.bezier(0.12, 0.8, 0.28, 1),
      useNativeDriver: true,
    }).start(() => {
      setDonuyor(false);
      setBitti(true);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setTimeout(() => {
        setModalAcik(true);
      }, 500);
    });
  }, [donuyor, bitti, donusAnim]);

  const donusStili = {
    transform: [
      {
        rotate: donusAnim.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  // Yedek gösterim fiyatları
  const simge = paraSimgesi();
  const gorunenStandart = standartFiyat ?? (simge === '₺' ? '699,99 ₺' : simge === '€' ? '49,99 €' : '$49.99');
  const gorunenIndirimli = indirimliFiyat ?? (simge === '₺' ? '349,99 ₺' : simge === '€' ? '24,99 €' : '$24.99');

  return (
    <View style={stil.kapsayici}>
      {/* Üst Kapat Butonu */}
      <View style={stil.ustBar}>
        <View style={stil.ustRozetKapsayici}>
          <Icon name="sparkles" size={14} color="#F39B42" />
          <Txt role="label" tone="#F39B42">
            {metin.ustRozet.toLocaleUpperCase(aktifEtiket())}
          </Txt>
        </View>
        <IconButton
          icon="x"
          accessibilityLabel="Kapat"
          tone="#FFFFFF"
          background={color.navGlassBg}
          pressedBackground={color.navGlassBgPressed}
          onPress={onVazgec}
        />
      </View>

      <View style={{ height: rhythm.group }} />

      {/* Başlık & Açıklama */}
      <Txt role="h1" tone="#FFFFFF" style={stil.ortaliMetin}>
        {metin.baslik}
      </Txt>
      <View style={{ height: rhythm.sameObject }} />
      <Txt role="body" tone={color.navMuted} style={stil.ortaliMetin}>
        {metin.aciklama}
      </Txt>

      <View style={{ height: rhythm.section }} />

      {/* Çark ve İbre */}
      <View style={stil.carkAlani}>
        {/* Sabit İbre (Pointer) - Tepede durup aşağıyı işaret eder */}
        <View style={stil.ibreKapsayici}>
          <Svg width={32} height={36} viewBox="0 0 32 36">
            <Defs>
              <LinearGradient id="ibreGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#FFE082" />
                <Stop offset="100%" stopColor="#F39B42" />
              </LinearGradient>
            </Defs>
            {/* İbre üçgeni */}
            <Path d="M 6 0 L 26 0 L 16 32 Z" fill="url(#ibreGrad)" />
            {/* İbre başı çemberi */}
            <Circle cx={16} cy={8} r={6} fill="#FFFFFF" />
          </Svg>
        </View>

        {/* Dönen Çark */}
        <Animated.View style={[stil.carkGövde, donusStili]}>
          <Svg width={BOYUT} height={BOYUT} viewBox={`0 0 ${BOYUT} ${BOYUT}`}>
            <Defs>
              <LinearGradient id="bezelGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#31396D" />
                <Stop offset="50%" stopColor="#1E234D" />
                <Stop offset="100%" stopColor="#0E122B" />
              </LinearGradient>
              <LinearGradient id="hubGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#7D60E8" />
                <Stop offset="100%" stopColor="#5C5AF6" />
              </LinearGradient>
            </Defs>

            {/* Dış Çerçeve (Bezel) */}
            <Circle
              cx={MERKEZ}
              cy={MERKEZ}
              r={YARICAP + 8}
              fill="url(#bezelGrad)"
              stroke="#5C5AF6"
              strokeWidth={3}
            />

            {/* Dilimler */}
            <G>
              {DILIMLER.map((dilim, i) => {
                // Dilim 0 tam tepede (-90 derece) merkezlenir.
                const merkezAci = -90 + i * DILIM_ACISI;
                const baslangicAci = merkezAci - DILIM_ACISI / 2;
                const bitisAci = merkezAci + DILIM_ACISI / 2;

                const rad1 = (baslangicAci * Math.PI) / 180;
                const rad2 = (bitisAci * Math.PI) / 180;
                const radMerkez = (merkezAci * Math.PI) / 180;

                const x1 = MERKEZ + YARICAP * Math.cos(rad1);
                const y1 = MERKEZ + YARICAP * Math.sin(rad1);
                const x2 = MERKEZ + YARICAP * Math.cos(rad2);
                const y2 = MERKEZ + YARICAP * Math.sin(rad2);

                const d = `M ${MERKEZ} ${MERKEZ} L ${x1} ${y1} A ${YARICAP} ${YARICAP} 0 0 1 ${x2} ${y2} Z`;

                // Metin koordinatları
                const metinYaricap = YARICAP * 0.68;
                const tx = MERKEZ + metinYaricap * Math.cos(radMerkez);
                const ty = MERKEZ + metinYaricap * Math.sin(radMerkez);
                // Metin yönü
                const textRot = merkezAci + 90;

                const anaMetin = dilim.etiket[dil] ?? dilim.etiket.en;
                const altMetin = dilim.alt ? (dilim.alt[dil] ?? dilim.alt.en) : '';

                return (
                  <G key={i}>
                    <Path
                      d={d}
                      fill={dilim.renk}
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                      strokeOpacity={0.15}
                    />
                    <G transform={`translate(${tx}, ${ty}) rotate(${textRot})`}>
                      <SvgText
                        x={0}
                        y={altMetin ? -3 : 4}
                        fill="#FFFFFF"
                        fontSize={15}
                        fontWeight="900"
                        textAnchor="middle">
                        {anaMetin}
                      </SvgText>
                      {altMetin ? (
                        <SvgText
                          x={0}
                          y={11}
                          fill="rgba(255,255,255,0.85)"
                          fontSize={9}
                          fontWeight="700"
                          textAnchor="middle">
                          {altMetin}
                        </SvgText>
                      ) : null}
                    </G>
                  </G>
                );
              })}
            </G>

            {/* Dış Çerçeve Işıkları (Dots / Studs) */}
            {Array.from({ length: 12 }).map((_, idx) => {
              const aci = (idx * 30 * Math.PI) / 180;
              const noktaX = MERKEZ + (YARICAP + 4) * Math.cos(aci);
              const noktaY = MERKEZ + (YARICAP + 4) * Math.sin(aci);
              return (
                <Circle
                  key={idx}
                  cx={noktaX}
                  cy={noktaY}
                  r={2.5}
                  fill={idx % 2 === 0 ? '#FFE082' : '#FFFFFF'}
                />
              );
            })}

            {/* Merkez Göbek (Center Hub) */}
            <Circle
              cx={MERKEZ}
              cy={MERKEZ}
              r={34}
              fill="#101432"
              stroke="#5C5AF6"
              strokeWidth={3}
            />
            <Circle cx={MERKEZ} cy={MERKEZ} r={24} fill="url(#hubGrad)" />
          </Svg>

          {/* Merkez Buton / İkon */}
          <Pressable
            style={stil.merkezTikla}
            disabled={donuyor || bitti}
            onPress={cevir}>
            <Icon name="sparkles" size={20} color="#FFFFFF" />
          </Pressable>
        </Animated.View>
      </View>

      <View style={{ height: rhythm.section }} />

      {/* Alt Aksiyon Butonları */}
      <View style={stil.altEylemAlani}>
        <Button
          variant="primary"
          icon="sparkles"
          label={donuyor ? metin.cevriliyor : bitti ? metin.eylemKullan : metin.cevirBtn}
          disabled={donuyor}
          onPress={bitti ? () => setModalAcik(true) : cevir}
        />
        <View style={{ height: rhythm.group }} />
        <Button
          variant="ghost"
          label={metin.eylemGec}
          disabled={donuyor}
          onPress={onVazgec}
        />
      </View>

      {/* Kazandın Kutlama Modalı */}
      <Modal
        visible={modalAcik}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAcik(false)}>
        <View style={stil.modalZemin}>
          <View style={stil.modalKart}>
            <View style={stil.kutlamaTacAlani}>
              <View style={stil.kutlamaTacDaire}>
                <Icon name="crown" size={32} color="#F39B42" />
              </View>
            </View>

            <View style={{ height: rhythm.group }} />

            <Txt role="h1" style={stil.ortaliMetin}>
              {metin.kazandinBaslik}
            </Txt>
            <View style={{ height: rhythm.sameObject }} />
            <Txt role="body" tone={color.text2} style={stil.ortaliMetin}>
              {metin.kazandinAciklama}
            </Txt>

            <View style={{ height: rhythm.section }} />

            {/* Fiyat Karşılaştırma Paneli */}
            <View style={stil.fiyatPaneli}>
              <View style={stil.fiyatSatiri}>
                <Txt role="label" tone={color.text2}>
                  {metin.normalFiyat}
                </Txt>
                <Txt role="body" tone={color.text3} style={stil.ustuCizili}>
                  {gorunenStandart}
                </Txt>
              </View>

              <View style={stil.fiyatAyirici} />

              <View style={stil.fiyatSatiri}>
                <View>
                  <Txt role="label" tone={color.primaryDeep}>
                    {metin.indirimliFiyat}
                  </Txt>
                  <View style={{ height: 2 }} />
                  <View style={stil.tasarrufRozet}>
                    <Txt role="micro" tone="#FFFFFF">
                      {metin.tasarruf}
                    </Txt>
                  </View>
                </View>
                <Txt role="display" tone={color.primaryDeep}>
                  {gorunenIndirimli}
                </Txt>
              </View>
            </View>

            <View style={{ height: rhythm.group }} />
            <Txt role="caption" tone={color.text2} style={stil.ortaliMetin}>
              {denemeGunu ? `${denemeGunu} ${metin.denemeBilgi.replace(/^\d+\s*/, '')}` : metin.denemeBilgi}
            </Txt>

            <View style={{ height: rhythm.section }} />

            <Button
              variant="primary"
              icon="sparkles"
              label={metin.eylemKullan}
              onPress={() => {
                setModalAcik(false);
                onFirsatiKullan();
              }}
            />
            <View style={{ height: rhythm.group }} />
            <Button
              variant="ghost"
              label={metin.eylemGec}
              onPress={() => {
                setModalAcik(false);
                onVazgec();
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const stil = StyleSheet.create({
  kapsayici: {
    flex: 1,
    backgroundColor: '#0B0E23',
    paddingHorizontal: layout.screenPaddingX,
    justifyContent: 'space-between',
    paddingBottom: rhythm.pad,
  },
  ustBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: rhythm.group,
  },
  ustRozetKapsayici: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(243, 155, 66, 0.15)',
    paddingHorizontal: rhythm.group,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(243, 155, 66, 0.3)',
  },
  ortaliMetin: {
    textAlign: 'center',
  },
  carkAlani: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: rhythm.group,
  },
  ibreKapsayici: {
    position: 'absolute',
    top: -14,
    zIndex: 20,
    alignItems: 'center',
  },
  carkGövde: {
    width: BOYUT,
    height: BOYUT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merkezTikla: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  altEylemAlani: {
    paddingBottom: rhythm.group,
  },
  modalZemin: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingX,
  },
  modalKart: {
    width: '100%',
    backgroundColor: color.surface,
    borderRadius: radius.hero,
    padding: rhythm.pad,
    boxShadow: clay.raisedLg,
  },
  kutlamaTacAlani: {
    alignItems: 'center',
    marginTop: -rhythm.section,
  },
  kutlamaTacDaire: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF4E5',
    borderWidth: 3,
    borderColor: '#F39B42',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: clay.raised,
  },
  fiyatPaneli: {
    backgroundColor: color.well,
    borderRadius: radius.card,
    padding: rhythm.pad,
    boxShadow: clay.sunken,
  },
  fiyatSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ustuCizili: {
    textDecorationLine: 'line-through',
  },
  fiyatAyirici: {
    height: 1,
    backgroundColor: color.groove,
    marginVertical: rhythm.group,
  },
  tasarrufRozet: {
    backgroundColor: color.primaryDeep,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});
