import type { ReactNode } from 'react';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { ClaySurface } from '@/components/ClaySurface';
import { Txt } from '@/components/Txt';
import { useIlerleme } from '@/lib/hareket';
import { sayiyaCevir, SIMGE } from '@/lib/para';
import { yayUzunlugu, yayYolu, noktaBul } from '@/lib/yay';
import { color, gauge, gradient, motion, radius, rhythm } from '@/theme/tokens';

/**
 * §7.5 — kahraman gösterge (clay dairesel yay).
 *
 * BU BİLEŞEN YALNIZ "LİMİTLİ" DURUMU ÇİZER. Günlük limit tanımsız varyantı
 * (`pano.limitsiz.*`) `HeroPlain` adında AYRI bir bileşendir, bunun varyantı
 * değildir — bağlayıcı kural, tasarım denetiminden devir.
 *
 * Kurallar:
 *  · Yay limit içinde HER oranda `grad.arc` — doluluğa göre renk değişmez.
 *  · %100'ü aşınca ana yay dolu kalır, DIŞINA ikinci amber yay çıkar.
 *    Kırmızı yok, ünlem yok, yanıp sönme yok, titreme yok.
 *  · Topuz zorunlu.
 */

type Props = {
  /** kuruş integer — `mod="birikim"` iken `hesaplanan_tasarruf_kurus` (NEGATİF olabilir) */
  harcananKurus: number;
  /** kuruş integer — `mod="birikim"` iken `harcanabilir_kurus` */
  limitKurus: number;
  /** Gösterge ortasındaki etiket (metinler.md §3.1 / §3.2) */
  etiket: string;
  /** §7.8 — ilk gün: dolgu yok, topuz yok, taşma yayı yok, küçük disk */
  bos?: boolean;
  /**
   * v4 E-10 — kapanmış (geçmiş) günde ortadaki sayı "kalan/taşma" değil,
   * o günün TOPLAM harcamasıdır (metinler.md §23.2 `gunluk.hero.gecmis`).
   * Verilmezse davranış değişmez (kalan/taşma hesaplanır).
   */
  merkezTutarKurus?: number;
  /**
   * rev2-tasarruf-profil.md §3.2/§5/§7.3 — `birikim`: dolgu
   * `max(0,harcananKurus)/limitKurus` ("bu ay biriken"). `harcananKurus<0`
   * ("bütçe dışı") ⇒ dolgu 0, ana yay VE topuz çizilmez (`gunluk`'ta topuz
   * doluluk 0'da bile başlangıç açısında durur — iki kipin TEK farkı bu).
   */
  mod?: 'gunluk' | 'birikim';
  /** rev2-tasarruf-profil.md §3.2 `no-budget` — merkez sayı/etiketin YERİNE geçer (ör. 32pt `landmark` ikonu). */
  centerOverride?: ReactNode;
  accessibilityLabel?: string;
};

let gaugeSayac = 0;

export function LimitGauge({
  harcananKurus,
  limitKurus,
  etiket,
  bos = false,
  merkezTutarKurus,
  mod = 'gunluk',
  centerOverride,
  accessibilityLabel = 'Günlük limit kullanımı',
}: Props) {
  // §12 no.29 — aynı sayfada birden çok gösterge olursa id benzersizleşir
  const kimlik = useRef(++gaugeSayac).current;
  const arcId = `gArc${kimlik}`;
  const overId = `gOver${kimlik}`;

  const cap = bos ? gauge.emptyDiameter : gauge.diameter;
  const merkez = cap / 2;
  const oluk = bos ? gauge.emptyTrackRadius : gauge.trackRadius;
  const kalinlik = bos ? gauge.emptyTrackWidth : gauge.trackWidth;
  const disKenarR = bos ? gauge.emptyEdgeOuterRadius : gauge.edgeOuterRadius;
  const icKenarR = bos ? gauge.emptyEdgeInnerRadius : gauge.edgeInnerRadius;

  const birikimMi = mod === 'birikim';
  // `disi` — gunluk'ta "limit dışı" (harcanan>limit), birikim'de "bütçe dışı" (hesaplanan_tasarruf<0)
  const disi = birikimMi ? harcananKurus < 0 : harcananKurus > limitKurus;
  const kalanKurus = birikimMi
    ? Math.abs(harcananKurus)
    : disi
      ? harcananKurus - limitKurus
      : limitKurus - harcananKurus;

  // Ana yayın hedef doluluğu (0..1) ve taşma oranı — §3.2/§7.3 tek formül
  const hedefDoluluk = birikimMi
    ? disi || limitKurus <= 0
      ? 0
      : Math.min(harcananKurus / limitKurus, 1)
    : limitKurus > 0
      ? Math.min(harcananKurus / limitKurus, 1)
      : 0;
  const hedefTasma = birikimMi
    ? disi && limitKurus > 0
      ? Math.abs(harcananKurus) / limitKurus
      : 0
    : limitKurus > 0 && disi
      ? (harcananKurus - limitKurus) / limitKurus
      : 0;

  // §8 — yay 250ms ease-out, sayı eş zamanlı sayar (tek ilerleme kaynağı)
  const ilerleme = useIlerleme(bos ? 0 : 1, motion.arc);
  const doluluk = hedefDoluluk * ilerleme;
  const tasma = hedefTasma * ilerleme;

  const olukYolu = yayYolu(merkez, oluk, gauge.startAngleDeg, gauge.sweepDegrees);
  const olukUzunluk = yayUzunlugu(oluk, gauge.sweepDegrees);
  const bosluk = olukUzunluk + 60; // prototipteki 465.27 = 405.27 + 60
  const doluUzunluk = olukUzunluk * doluluk;

  // Topuz ana yayın ucunda durur
  const topuzAci = gauge.startAngleDeg + gauge.sweepDegrees * doluluk;
  const topuz = noktaBul(merkez, oluk, topuzAci);

  // §7.5 — taşma yayı saat 12'den (−90°) saat yönünde
  const tasmaAcilim = gauge.sweepDegrees * Math.min(tasma, 1);

  // §7.5 uzun tutar kuralı: sayı 6+ karakterse rol bir basamak iner
  const sayi = sayiyaCevir(merkezTutarKurus ?? kalanKurus);
  const uzun = sayi.length >= gauge.heroDigitLimit;
  const sayiRolu = uzun ? 'display' : 'hero';
  const simgeRolu = uzun ? 'amount' : 'display';
  // §7.5 — limit/bütçe dışında kahraman sayı `warning-ink` olur
  const sayiRengi = disi ? color.warningInk : color.text;
  // §3.2/§7 — birikim modunda bütçe dışıyken ana yay VE topuz çizilmez (gunluk'ta topuz her zaman durur)
  const topuzGoster = !bos && !(birikimMi && disi);

  return (
    <ClaySurface
      level="raisedLg"
      borderRadius={radius.pill}
      style={{ width: cap, height: cap }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: limitKurus, now: harcananKurus }}>
      <Svg width={cap} height={cap} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id={arcId} x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor={gradient.arc[0]} />
            <Stop offset="1" stopColor={gradient.arc[1]} />
          </LinearGradient>
          <LinearGradient id={overId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={gradient.arcOver[0]} />
            <Stop offset="1" stopColor={gradient.arcOver[1]} />
          </LinearGradient>
        </Defs>

        {/* oluk */}
        <Path d={olukYolu} stroke={color.well} strokeWidth={kalinlik} strokeLinecap="round" fill="none" />
        {/* çukurluğun iki ince kenar yayı — clay'in "oyuk" hissi */}
        <Path
          d={yayYolu(merkez, disKenarR, gauge.startAngleDeg, gauge.sweepDegrees)}
          stroke={gauge.edgeOuterColor}
          strokeWidth={gauge.edgeWidth}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={yayYolu(merkez, icKenarR, gauge.startAngleDeg, gauge.sweepDegrees)}
          stroke={gauge.edgeInnerColor}
          strokeWidth={gauge.edgeWidth}
          strokeLinecap="round"
          fill="none"
        />

        {!bos && doluUzunluk > 0 ? (
          <>
            {/* dolgu — doluluktan bağımsız daima grad.arc */}
            <Path
              d={olukYolu}
              stroke={`url(#${arcId})`}
              strokeWidth={kalinlik}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${doluUzunluk.toFixed(2)} ${bosluk.toFixed(2)}`}
            />
            {/* dolgu parlaması — yuvarlaklık hissi */}
            {doluUzunluk > 14 ? (
              <Path
                d={olukYolu}
                stroke={gauge.fillGlossColor}
                strokeWidth={gauge.fillGlossWidth}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${(doluUzunluk - 14).toFixed(2)} ${bosluk.toFixed(2)}`}
                strokeDashoffset={-7}
              />
            ) : null}
          </>
        ) : null}

        {/* taşma yayı — ana yayın 8pt dışında, yalnız limit dışında */}
        {!bos && tasmaAcilim > 0 ? (
          <>
            <Path
              d={yayYolu(merkez, gauge.overRadius, -90, tasmaAcilim)}
              stroke={`url(#${overId})`}
              strokeWidth={gauge.overWidth}
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d={yayYolu(merkez, gauge.overRadius, -90, tasmaAcilim)}
              stroke={gauge.overGlossColor}
              strokeWidth={gauge.overGlossWidth}
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : null}

        {/* topuz — zorunlu (§7.5); birikim modunda bütçe dışıyken istisna (§3.2) */}
        {topuzGoster ? (
          <>
            <Circle cx={topuz.x} cy={topuz.y + 2} r={gauge.knobShadowRadius} fill={gauge.knobShadowColor} />
            <Circle cx={topuz.x} cy={topuz.y} r={gauge.knobRadius} fill={color.surface} />
            <Circle
              cx={topuz.x}
              cy={topuz.y}
              r={gauge.knobRingRadius}
              fill="none"
              stroke={color.primaryDeep}
              strokeWidth={gauge.knobRingWidth}
            />
            <Circle
              cx={topuz.x}
              cy={topuz.y - 2}
              r={gauge.knobGlossRadius}
              fill="none"
              stroke={gauge.knobGlossColor}
              strokeWidth={gauge.knobGlossWidth}
            />
          </>
        ) : null}
      </Svg>

      <View style={[StyleSheet.absoluteFill, stil.orta]} pointerEvents="none">
        {centerOverride ?? (
          <>
            <View style={stil.paraSatiri}>
              <Txt
                role={sayiRolu}
                tone={sayiRengi}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.55}
                style={stil.esnekSayi}>
                {sayi}
              </Txt>
              <View style={{ width: rhythm.sameObject }} />
              <Txt role={simgeRolu} tone={sayiRengi}>
                {SIMGE}
              </Txt>
            </View>
            <Txt role="label" tone={color.text2}>
              {etiket}
            </Txt>
          </>
        )}
      </View>
    </ClaySurface>
  );
}

const stil = StyleSheet.create({
  orta: { alignItems: 'center', justifyContent: 'center' },
  // §7.5 — `₺` taban çizgisine hizalı, sayıyla aynı renk
  paraSatiri: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    width: gauge.innerWidth,
  },
  esnekSayi: { flexShrink: 1, minWidth: 0 },
});
