import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import type { IconName } from '@/components/Icon';
import { InfoStrip } from '@/components/InfoStrip';
import { MoneyField } from '@/components/MoneyField';
import { MoneyRow } from '@/components/MoneyRow';
import { OptionCard } from '@/components/OptionCard';
import { RoutineRow } from '@/components/RoutineRow';
import { RoutineSheet } from '@/components/RoutineSheet';
import { SetupShell, type SetupShellHandle } from '@/components/SetupShell';
import { Txt } from '@/components/Txt';
import { obRutinGunlukToplam, obRutinSatirAlt, t } from '@/content/metinler';
import { HEDEF_ETIKET_ALAN, OZET_ACIKLAMA } from '@/content/hedefEtiketleri';
import { onboardingKaydet, type Niyet } from '@/db/profil';
import { useReduceMotion } from '@/lib/hareket';
import type { KategoriKodu } from '@/lib/kategoriler';
import { paraYaz, sayiyaCevir, tutarGirisindenKurus, SIMGE } from '@/lib/para';
import { budgetPut, emptyBudget, routinePut, routinesGet, yeniId, type Routine } from '@/lib/revApi';
import { veriDegisti } from '@/lib/veriBus';
import { clay, color, motion, radius, rhythm, TABULAR } from '@/theme/tokens';

/**
 * rev2-onboarding-kayit.md — REV2-r1. `SetupShell` kabuğu (§2), 4 adım.
 * Bütçe API alanları DEĞİŞMEDİ (`gelir_kurus`/`sabit_giderler`/
 * `hedef_birikim_kurus`/`borc_kurus`); değişen yalnız etiket/metin.
 *
 * Niyet kart sırası (§3 vs prototip çelişkisi — bağlayıcı §0 kuralı gereği
 * PROTOTİP uygulanır, PM'e raporlandı): Kontrol → Birikim → Borç.
 */
const NIYET_SIRASI: [Niyet, IconName][] = [
  ['takip', 'target'],
  ['tasarruf', 'landmark'],
  ['borc', 'trending-up'],
];

type GiderAlan = 'kira' | 'fatura' | 'ulasim' | 'kredi';

export default function Onboarding() {
  const db = useSQLiteContext();
  const shellRef = useRef<SetupShellHandle>(null);
  const reduceMotion = useReduceMotion();
  const anim = useRef(new Animated.Value(1)).current;
  const [gecis, setGecis] = useState<{ faz: 'settled' | 'exit' | 'enter'; yon: 1 | -1 }>({ faz: 'settled', yon: 1 });

  const [adim, setAdim] = useState(1);

  // 1/4 niyet — varsayılan seçim YOK (§3.0 B3).
  const [niyet, setNiyet] = useState<Niyet | null>(null);

  // 2/4 gelir ve gider
  const [gelir, setGelir] = useState('');
  const [gelirDokunuldu, setGelirDokunuldu] = useState(false);
  const [giderler, setGiderler] = useState<Record<GiderAlan, string>>({ kira: '', fatura: '', ulasim: '', kredi: '' });
  const [hedef, setHedef] = useState('');
  const [borc, setBorc] = useState('');
  const [butceMesgul, setButceMesgul] = useState(false);
  const [butceAgHata, setButceAgHata] = useState(false);
  const [kayitliLimit, setKayitliLimit] = useState<number | null>(null);

  // 3/4 rutinler
  const [rutinler, setRutinler] = useState<Routine[]>([]);
  const [rutinAgHata, setRutinAgHata] = useState(false);
  const [sheetAcik, setSheetAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<Routine | null>(null);
  /** B4/b — yalnız 3/4'e kendiliğinden açılan İLK sheet'te `true` (ghost "Rutin harcamam yok" içeride görünür). */
  const [ilkAcilisMi, setIlkAcilisMi] = useState(false);
  const [rutinMesgul, setRutinMesgul] = useState(false);
  const otomatikAcildiRef = useRef(false);

  // 4/4 plan özeti
  const [bitirMesgul, setBitirMesgul] = useState(false);
  const [bitirHata, setBitirHata] = useState(false);

  function git(sonraki: number) {
    const yon: 1 | -1 = sonraki > adim ? 1 : -1;
    if (reduceMotion) {
      setAdim(sonraki);
      shellRef.current?.scrollToTop();
      return;
    }
    setGecis({ faz: 'exit', yon });
    anim.setValue(1);
    Animated.timing(anim, { toValue: 0, duration: motion.press, useNativeDriver: true }).start(() => {
      setAdim(sonraki);
      shellRef.current?.scrollToTop();
      setGecis({ faz: 'enter', yon });
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: motion.arc, useNativeDriver: true }).start(() => {
        setGecis((g) => ({ ...g, faz: 'settled' }));
      });
    });
  }

  const outputRange =
    gecis.faz === 'exit' ? [0, -8 * gecis.yon] : gecis.faz === 'enter' ? [8 * gecis.yon, 0] : [0, 0];
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange });
  const gecisStili = { opacity: anim, transform: [{ translateX }] };

  // 3/4 — adıma ilk girişte routine listesini yükle, kendiliğinden sheet aç.
  useEffect(() => {
    if (adim !== 3) return;
    let iptal = false;
    routinesGet()
      .then((r) => {
        if (iptal) return;
        setRutinler(r.rutinler.filter((x) => x.aktif));
        setRutinAgHata(false);
        if (!otomatikAcildiRef.current) {
          otomatikAcildiRef.current = true;
          setDuzenlenen(null);
          setIlkAcilisMi(true);
          setSheetAcik(true);
        }
      })
      .catch(() => {
        if (!iptal) setRutinAgHata(true);
      });
    return () => {
      iptal = true;
    };
  }, [adim]);

  async function butceyiKaydet() {
    if (butceMesgul) return;
    if (tutarGirisindenKurus(gelir) <= 0) {
      setGelirDokunuldu(true);
      return;
    }
    setButceMesgul(true);
    setButceAgHata(false);
    try {
      const govde = emptyBudget();
      const sonuc = await budgetPut({
        ...govde,
        gelir_kurus: tutarGirisindenKurus(gelir),
        sabit_giderler: {
          kira: tutarGirisindenKurus(giderler.kira),
          fatura: tutarGirisindenKurus(giderler.fatura),
          ulasim: tutarGirisindenKurus(giderler.ulasim),
          kredi: tutarGirisindenKurus(giderler.kredi),
        },
        hedef_birikim_kurus: tutarGirisindenKurus(hedef),
        borc_kurus: borc ? tutarGirisindenKurus(borc) : null,
      });
      setKayitliLimit(sonuc.butce?.gunluk_limit_kurus ?? null);
      git(3);
    } catch {
      setButceAgHata(true);
    } finally {
      setButceMesgul(false);
    }
  }

  async function rutinKaydet(girdi: { ad: string; kategori: KategoriKodu; gunluk_adet: number; birim_fiyat_kurus: number }) {
    if (rutinMesgul) return;
    setRutinMesgul(true);
    try {
      await routinePut({ id: duzenlenen?.id ?? yeniId(), ...girdi, aktif: true });
      const guncel = await routinesGet();
      setRutinler(guncel.rutinler.filter((x) => x.aktif));
      setRutinAgHata(false);
      setSheetAcik(false);
      setDuzenlenen(null);
      veriDegisti();
    } catch {
      setRutinAgHata(true);
    } finally {
      setRutinMesgul(false);
    }
  }

  async function rutinKaldir() {
    if (!duzenlenen || rutinMesgul) return;
    setRutinMesgul(true);
    try {
      await routinePut({ ...duzenlenen, aktif: false });
      const guncel = await routinesGet();
      setRutinler(guncel.rutinler.filter((x) => x.aktif));
      setRutinAgHata(false);
      setSheetAcik(false);
      setDuzenlenen(null);
      veriDegisti();
    } catch {
      setRutinAgHata(true);
    } finally {
      setRutinMesgul(false);
    }
  }

  function rutinVazgec() {
    setSheetAcik(false);
    git(4);
  }

  async function bitir() {
    if (bitirMesgul) return;
    setBitirMesgul(true);
    setBitirHata(false);
    try {
      await onboardingKaydet(db, {
        niyet,
        gelirKurus: tutarGirisindenKurus(gelir),
        maasGunu: null,
        maasDuzensiz: true,
        gunlukLimitOnerisiKurus: kayitliLimit,
      });
      veriDegisti();
      router.replace('/');
    } catch {
      setBitirHata(true);
    } finally {
      setBitirMesgul(false);
    }
  }

  const giderToplamKurus =
    tutarGirisindenKurus(giderler.kira) +
    tutarGirisindenKurus(giderler.fatura) +
    tutarGirisindenKurus(giderler.ulasim) +
    tutarGirisindenKurus(giderler.kredi);
  const gunlukRutinToplamKurus = rutinler.reduce((acc, r) => acc + r.gunluk_adet * r.birim_fiyat_kurus, 0);
  const gelirHatasi = gelirDokunuldu && tutarGirisindenKurus(gelir) <= 0 ? t['hata.gelir_bos'] : undefined;
  const hedefEtiketi = niyet ? HEDEF_ETIKET_ALAN[niyet] : HEDEF_ETIKET_ALAN.tasarruf;
  const hedefOzetEtiketi = niyet === 'takip' ? t['ob.ozet.hedef.takip'] : hedefEtiketi;
  const limitGosterim = kayitliLimit !== null ? sayiyaCevir(kayitliLimit) : '';
  const limitUzun = limitGosterim.length >= 6;

  return (
    <>
      <SetupShell
        ref={shellRef}
        adim={adim}
        onGeri={adim === 1 ? null : () => git(adim - 1)}
        altSabit={
          adim === 1 ? (
            <>
              {niyet === null ? (
                <>
                  <Txt role="caption" tone={color.text2}>
                    {t['ob.niyet.ipucu']}
                  </Txt>
                  <View style={{ height: rhythm.group }} />
                </>
              ) : null}
              <Button variant="primary" label={t['ob.devam']} disabled={niyet === null} onPress={() => git(2)} />
            </>
          ) : adim === 2 ? (
            <Button
              variant="primary"
              label={butceAgHata ? t['genel.yeniden_dene'] : t['ob.devam']}
              loadingLabel={t['ob.butce.mesgul']}
              loading={butceMesgul}
              onPress={() => void butceyiKaydet()}
            />
          ) : adim === 3 ? (
            <>
              <Button variant="primary" label={t['ob.rutin.devam']} onPress={() => git(4)} />
              <View style={{ height: rhythm.group }} />
              <Button variant="ghost" label={t['ob.rutin.yok']} onPress={rutinVazgec} />
            </>
          ) : (
            <Button
              variant="primary"
              label={bitirHata ? t['genel.yeniden_dene'] : t['ob.ozet.eylem']}
              loading={bitirMesgul}
              disabled={kayitliLimit === null}
              onPress={() => void bitir()}
            />
          )
        }>
        <Animated.View style={gecisStili}>
          {adim === 1 ? (
            <>
              <Txt role="h1">{t['ob.niyet.baslik']}</Txt>
              <View style={{ height: rhythm.group }} />
              <Txt role="body" tone={color.text2}>
                {t['ob.niyet.aciklama']}
              </Txt>
              <View style={{ height: rhythm.section }} />
              {NIYET_SIRASI.map(([k, icon], i) => (
                <View key={k}>
                  {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                  <OptionCard
                    icon={icon}
                    title={t[`ob.niyet.${k}`]}
                    caption={t[`ob.niyet.${k}.alt`]}
                    selected={niyet === k}
                    onPress={() => setNiyet(k)}
                  />
                </View>
              ))}
            </>
          ) : adim === 2 ? (
            <>
              <Txt role="h1">{t['ob.butce.baslik']}</Txt>
              <View style={{ height: rhythm.group }} />
              <Txt role="body" tone={color.text2}>
                {t['ob.butce.aciklama']}
              </Txt>
              {butceAgHata ? (
                <>
                  <View style={{ height: rhythm.section }} />
                  <InfoStrip variant="warning" icon="wifi-off" metin={`${t['hata.butce_yazma']} ${t['hata.butce_yazma.ek']}`} />
                </>
              ) : null}
              <View style={{ height: rhythm.section }} />
              <SectionHeader>{t['ob.butce.gelir_bolum']}</SectionHeader>
              <View style={{ height: rhythm.group }} />
              <Kart>
                <MoneyField
                  label={t['alan.gelir']}
                  value={gelir}
                  onChangeText={setGelir}
                  onBlur={() => setGelirDokunuldu(true)}
                  note={t['alan.gelir.not']}
                  error={gelirHatasi}
                  accessibilityLabel={t['alan.gelir']}
                />
              </Kart>
              <View style={{ height: rhythm.section }} />
              <SectionHeader sag={paraYaz(giderToplamKurus)}>{t['ob.butce.gider_bolum']}</SectionHeader>
              <View style={{ height: rhythm.group }} />
              <Kart>
                <MoneyRow label={t['alan.kira']} birim="₺" value={giderler.kira} onChangeText={(v) => setGiderler((g) => ({ ...g, kira: v }))} />
                <View style={{ height: rhythm.group }} />
                <MoneyRow label={t['alan.fatura']} birim="₺" value={giderler.fatura} onChangeText={(v) => setGiderler((g) => ({ ...g, fatura: v }))} />
                <View style={{ height: rhythm.group }} />
                <MoneyRow label={t['alan.ulasim']} birim="₺" value={giderler.ulasim} onChangeText={(v) => setGiderler((g) => ({ ...g, ulasim: v }))} />
                <View style={{ height: rhythm.group }} />
                <MoneyRow label={t['alan.kredi']} birim="₺" value={giderler.kredi} onChangeText={(v) => setGiderler((g) => ({ ...g, kredi: v }))} />
              </Kart>
              <View style={{ height: rhythm.section }} />
              <SectionHeader>{t['ob.butce.hedef_bolum']}</SectionHeader>
              <View style={{ height: rhythm.group }} />
              <Kart>
                <MoneyField label={hedefEtiketi} value={hedef} onChangeText={setHedef} note={t['alan.hedef.not']} accessibilityLabel={hedefEtiketi} />
                <View style={{ height: rhythm.blockInCard }} />
                <MoneyField label={t['alan.borc']} value={borc} onChangeText={setBorc} note={t['alan.borc.not']} accessibilityLabel={t['alan.borc']} />
              </Kart>
            </>
          ) : adim === 3 ? (
            <>
              <Txt role="h1">{t['ob.rutin.baslik']}</Txt>
              <View style={{ height: rhythm.group }} />
              <Txt role="body" tone={color.text2}>
                {t['ob.rutin.aciklama']}
              </Txt>
              <View style={{ height: rhythm.section }} />
              {rutinAgHata ? (
                <>
                  <InfoStrip variant="warning" icon="wifi-off" metin={`${t['hata.rutin_yazma']} ${t['hata.rutin_yazma.ek']}`} />
                  <View style={{ height: rhythm.section }} />
                </>
              ) : null}
              {rutinler.length === 0 ? (
                <View style={stil.rutinBos}>
                  <Txt role="body" tone={color.text2}>
                    {t['ob.rutin.bos']}
                  </Txt>
                </View>
              ) : (
                <>
                  <SectionHeader sag={obRutinGunlukToplam(paraYaz(gunlukRutinToplamKurus))}>{t['ob.rutin.bolum']}</SectionHeader>
                  <View style={{ height: rhythm.group }} />
                  {rutinler.map((r, i) => (
                    <View key={r.id}>
                      {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                      <RoutineRow
                        ad={r.ad}
                        kategori={r.kategori as KategoriKodu}
                        altYazi={obRutinSatirAlt(r.gunluk_adet, paraYaz(r.birim_fiyat_kurus))}
                        gunlukTutarYazi={paraYaz(r.gunluk_adet * r.birim_fiyat_kurus)}
                        onPress={() => {
                          setDuzenlenen(r);
                          setIlkAcilisMi(false);
                          setSheetAcik(true);
                        }}
                      />
                    </View>
                  ))}
                </>
              )}
              <View style={{ height: rhythm.blockInCard }} />
              <Button
                variant="secondary"
                label={t['ob.rutin.ekle']}
                onPress={() => {
                  setDuzenlenen(null);
                  setIlkAcilisMi(false);
                  setSheetAcik(true);
                }}
              />
              <View style={{ height: rhythm.section }} />
              <InfoStrip variant="info" metin={t['ob.rutin.sonra']} />
            </>
          ) : (
            <>
              <Txt role="h1">{t['ob.ozet.baslik']}</Txt>
              <View style={{ height: rhythm.group }} />
              <Txt role="body" tone={color.text2}>
                {niyet ? OZET_ACIKLAMA[niyet] : ''}
              </Txt>
              {bitirHata ? (
                <>
                  <View style={{ height: rhythm.section }} />
                  <InfoStrip variant="warning" icon="wifi-off" metin={`${t['hata.kurulum']} ${t['hata.kurulum.ek']}`} />
                </>
              ) : null}
              <View style={{ height: rhythm.section }} />
              <View style={stil.heroPanel}>
                <Txt role="label" tone={color.text2}>
                  {t['ob.ozet.limit_etiket']}
                </Txt>
                <View style={{ height: rhythm.group }} />
                {kayitliLimit === null ? (
                  <View style={stil.heroSatir}>
                    <View style={stil.limitIskelet} />
                    <View style={{ width: rhythm.group }} />
                    <Txt role="body" tone={color.text2}>
                      {t['ob.ozet.hesaplaniyor']}
                    </Txt>
                  </View>
                ) : (
                  <View style={stil.heroSatir}>
                    <Txt role={limitUzun ? 'display' : 'hero'}>{limitGosterim}</Txt>
                    <View style={{ width: rhythm.group }} />
                    <Txt role={limitUzun ? 'amount' : 'display'}>{SIMGE}</Txt>
                  </View>
                )}
              </View>
              <View style={{ height: rhythm.section }} />
              <Kart>
                <SummaryRow etiket={t['ob.ozet.amac']} deger={niyet ? t[`ob.niyet.${niyet}`] : ''} sayi={false} />
                <View style={{ height: rhythm.group }} />
                <SummaryRow etiket={t['ob.ozet.gelir']} deger={paraYaz(tutarGirisindenKurus(gelir))} sayi />
                <View style={{ height: rhythm.group }} />
                <SummaryRow etiket={t['ob.ozet.gider']} deger={paraYaz(giderToplamKurus)} sayi />
                <View style={{ height: rhythm.group }} />
                <SummaryRow etiket={hedefOzetEtiketi} deger={paraYaz(tutarGirisindenKurus(hedef))} sayi />
                <View style={{ height: rhythm.group }} />
                <SummaryRow etiket={t['ob.ozet.rutin']} deger={paraYaz(gunlukRutinToplamKurus)} sayi />
              </Kart>
              <View style={{ height: rhythm.group }} />
              <Txt role="caption" tone={color.text2}>
                {t['ob.ozet.nasil']}
              </Txt>
              <View style={{ height: rhythm.sameObject }} />
              <Txt role="caption" tone={color.text2}>
                {t['ob.ozet.rutin_not']}
              </Txt>
              <View style={{ height: rhythm.section }} />
              <InfoStrip variant="info" metin={t['ob.ozet.degistir']} />
            </>
          )}
        </Animated.View>
      </SetupShell>
      <RoutineSheet
        visible={sheetAcik && adim === 3}
        editing={duzenlenen}
        ilkAcilisMi={ilkAcilisMi}
        mesgul={rutinMesgul}
        onKaydet={(girdi) => void rutinKaydet(girdi)}
        onKaldir={duzenlenen ? () => void rutinKaldir() : undefined}
        onVazgec={rutinVazgec}
        onClose={() => setSheetAcik(false)}
      />
    </>
  );
}

function Kart({ children }: { children: ReactNode }) {
  return <View style={stil.kart}>{children}</View>;
}

function SectionHeader({ children, sag }: { children: string; sag?: string }) {
  return (
    <View style={stil.sectionHeader}>
      <Txt role="h2">{children}</Txt>
      {sag ? (
        <Txt role="label" tone={color.text2} style={TABULAR_STYLE}>
          {sag}
        </Txt>
      ) : null}
    </View>
  );
}

function SummaryRow({ etiket, deger, sayi }: { etiket: string; deger: string; sayi: boolean }) {
  return (
    <View style={stil.ozetSatir}>
      <Txt role="body" style={stil.ozetEtiket}>
        {etiket}
      </Txt>
      <Txt role={sayi ? 'amount' : 'bodyStrong'} style={stil.ozetDeger}>
        {deger}
      </Txt>
    </View>
  );
}

const TABULAR_STYLE = { fontVariant: TABULAR };

const stil = StyleSheet.create({
  kart: { padding: rhythm.pad, borderRadius: radius.card, backgroundColor: color.surface, boxShadow: clay.raised },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rutinBos: { padding: rhythm.pad, borderRadius: radius.tile, backgroundColor: color.well, boxShadow: clay.sunken },
  heroPanel: { padding: rhythm.pad, borderRadius: radius.hero, backgroundColor: color.primarySoft, boxShadow: clay.raisedLg },
  heroSatir: { flexDirection: 'row', alignItems: 'baseline' },
  limitIskelet: { width: 132, height: 32, borderRadius: radius.tile, backgroundColor: color.well, boxShadow: clay.sunken },
  ozetSatir: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: rhythm.blockInCard },
  ozetEtiket: { flex: 1, minWidth: 0 },
  ozetDeger: { flexShrink: 0 },
});
