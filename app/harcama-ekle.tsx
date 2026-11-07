import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routinesGet, yeniId } from '@/lib/revApi';
import { AmountWell, type AmountWellGunButonu } from '@/components/AmountWell';
import { Button } from '@/components/Button';
import { CategoryPicker } from '@/components/CategoryPicker';
import { Chip } from '@/components/Chip';
import { InfoStrip } from '@/components/InfoStrip';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { SearchField } from '@/components/SearchField';
import { SegmentedControl } from '@/components/SegmentedControl';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { VoiceExpenseInput } from '@/components/VoiceExpenseInput';
import { aktifKatalogu } from '@/content/urunKatalogu';
import {
  a11yEkleGun,
  a11yEkleOneriCip,
  a11yEkleSonKullanilan,
  ekleKategoriTahmini,
  ekleGunSeridi,
  ekleLimitDisiUyari,
  ekleTaksitOnizleme,
  ekleTutarOneriCip,
  t,
  toastKaydedildi,
  toastKaydedildiLimitDisi,
} from '@/content/metinler';
import { metin } from '@/i18n/cekirdek';
import {
  ODEME_VARSAYILAN,
  gunToplami,
  gunlukLimit,
  harcamaEkle,
  sikAlinanlar,
  taksitSerisiOlustur,
  tahminGecmisi,
  type OdemeTipi,
  type SikAlinan,
} from '@/db/harcama';
import { varsayilanOdemeOku } from '@/db/ayarTercihleri';
import { tumOgrenilenKategoriler } from '@/db/urunKategori';
import { aileRenkleri, kategori as kategoriGetir, type KategoriKodu } from '@/lib/kategoriler';
import { TUTAR_BUYUK_ESIK_KURUS, paraYaz, tutarGirisindenKurus, tutarGosterimi, kurustanTutarGirisi } from '@/lib/para';
import { gunAnahtari, gunEkle, kisaTarih, uzunTarih } from '@/lib/tarih';
import { katalogAra, turkceNormalize } from '@/lib/urunArama';
import { tahminEt, type GecmisKayit, type KategoriTahmini } from '@/lib/kategoriTahmin';
import { gunSeciciAbone } from '@/lib/gunSeciciBus';
import { toastGoster } from '@/lib/toastBus';
import { veriDegisti } from '@/lib/veriBus';
import { posthog } from '@/config/posthog';
import type { SesliHarcamaTaslagi } from '@/lib/sesliHarcama';
import { color, layout, radius, rhythm } from '@/theme/tokens';
import { useDil } from '@/i18n/useDil';

/**
 * E-11 · Harcama ekle.
 * Kullanıcı kendi ürün ve açıklamasını doğrudan yazabilir; önceden tanımlı olmayan
 * ürünler arama ekranına kilitlenmeden doğrudan kaydedilir.
 */
const TAKSIT_SECENEKLERI = [3, 6, 9, 12];

/** Tutar kuyusunun altındaki tek cümlelik köken açıklaması. */
type TutarAltMetinTuru = 'gecmisten' | 'katalogdan' | 'kategori' | null;

export default function HarcamaEkleEkrani() {
  useDil();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ gunFarki?: string; kategori?: string; ad?: string; tutarKurus?: string; rutinId?: string; sesli?: string }>();
  const [sesliTetik, setSesliTetik] = useState(params.sesli === '1' ? 1 : 0);

  const gunFarkiParam = params.gunFarki !== undefined ? Number.parseInt(params.gunFarki, 10) : null;
  const sabitGunFarki =
    gunFarkiParam !== null && Number.isFinite(gunFarkiParam) && gunFarkiParam !== 0 && gunFarkiParam !== -1;

  const [buffer, setBuffer] = useState(() => params.tutarKurus && Number(params.tutarKurus) > 0 ? kurustanTutarGirisi(Number(params.tutarKurus)) : '');
  const gonderiliyor = useRef(false);
  const [istemciId] = useState(yeniId);
  const [rutinId, setRutinId] = useState<string | null>(params.rutinId ?? null);
  const [rutinler, setRutinler] = useState<{id:string;ad:string;kategori:string;birim_fiyat_kurus:number}[]>([]);

  const [urunAdi, setUrunAdi] = useState(params.ad ?? '');
  const [ogrenilenKategoriler, setOgrenilenKategoriler] = useState<Map<string, string>>(new Map());
  const [oneriTutarKurus, setOneriTutarKurus] = useState<number | null>(null);
  const [tutarAltMetinTuru, setTutarAltMetinTuru] = useState<TutarAltMetinTuru>(null);

  const [kategoriKodu, setKategoriKodu] = useState<KategoriKodu>(() =>
    kategoriGetir(params.kategori ?? 'diger').kod,
  );
  const [kategoriKilitli, setKategoriKilitli] = useState(params.kategori !== undefined);
  const [tahmin, setTahmin] = useState<KategoriTahmini | null>(null);
  const [gecmisKayitlari, setGecmisKayitlari] = useState<GecmisKayit[]>([]);

  const [odeme, setOdeme] = useState<OdemeTipi>(ODEME_VARSAYILAN);
  const [taksitliAcik, setTaksitliAcik] = useState(false);
  const [taksitSayisi, setTaksitSayisi] = useState<number | null>(null);
  const [secilenGunFarki, setSecilenGunFarki] = useState<number | null>(gunFarkiParam === -1 ? -1 : null);
  const [detaylarAcik, setDetaylarAcik] = useState(false);
  const [notMetni, setNotMetni] = useState('');

  const [tutarHata, setTutarHata] = useState<string | undefined>();
  const [yazmaHata, setYazmaHata] = useState<string | undefined>();
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const [sikAlinanlarListesi, setSikAlinanlarListesi] = useState<SikAlinan[]>([]);
  const [gununToplamiKurus, setGununToplamiKurus] = useState(0);
  const [limitKurus, setLimitKurus] = useState<number | null>(null);

  useEffect(() => {
    let canli = true;
    void sikAlinanlar(30).then((l) => canli && setSikAlinanlarListesi(l)).catch(() => {});
    void routinesGet().then((r) => canli && setRutinler(r.rutinler)).catch(() => {});
    void gunlukLimit().then((l) => canli && setLimitKurus(l)).catch(() => {});
    void tumOgrenilenKategoriler().then((m) => canli && setOgrenilenKategoriler(m)).catch(() => {});
    void tahminGecmisi().then((l) => canli && setGecmisKayitlari(l)).catch(() => {});
    void varsayilanOdemeOku().then((v) => canli && setOdeme(v)).catch(() => {});
    return () => {
      canli = false;
    };
  }, []);

  useEffect(() => gunSeciciAbone(setSecilenGunFarki), []);

  const gunFarki = sabitGunFarki ? gunFarkiParam! : (secilenGunFarki ?? 0);
  const seciliTarih = useMemo(() => gunEkle(new Date(), gunFarki), [gunFarki]);
  const seciliGun = useMemo(() => gunAnahtari(seciliTarih), [seciliTarih]);
  const bugunMu = !sabitGunFarki && gunFarki === 0;

  useEffect(() => {
    let canli = true;
    void gunToplami(seciliGun).then((v) => canli && setGununToplamiKurus(v));
    return () => {
      canli = false;
    };
  }, [seciliGun]);

  const tutarKurus = tutarGirisindenKurus(buffer);
  const abonelikMi = kategoriKodu === 'abonelik';

  useEffect(() => {
    if (!abonelikMi) return;
    setTaksitliAcik(false);
    setTaksitSayisi(null);
  }, [abonelikMi]);

  useEffect(() => {
    if (kategoriKilitli) return;
    const sonuc = tahminEt({
      urunAdi,
      saat: new Date().getHours(),
      tutarKurus,
      ogrenilen: ogrenilenKategoriler,
      gecmis: gecmisKayitlari,
      katalog: aktifKatalogu(),
    });
    setTahmin(sonuc);
    setKategoriKodu(sonuc ? sonuc.kategori : 'diger');
  }, [kategoriKilitli, urunAdi, tutarKurus, ogrenilenKategoriler, gecmisKayitlari]);

  function kategoriSec(kod: KategoriKodu) {
    setKategoriKilitli(true);
    setTahmin(null);
    setKategoriKodu(kod);
  }
  const tutarGosterim = tutarGosterimi(buffer);
  const limitDisiFarkKurus =
    limitKurus !== null && tutarKurus > 0 && gununToplamiKurus + tutarKurus > limitKurus
      ? gununToplamiKurus + tutarKurus - limitKurus
      : 0;

  const sonKullanilanStripGoster = urunAdi.trim() === '' && sikAlinanlarListesi.length > 0;

  const oneriler = useMemo(() => {
    const sorgu = turkceNormalize(urunAdi.trim());
    if (!sorgu || sorgu.length < 2) return [];
    const gecmisten = sikAlinanlarListesi
      .filter((s) => turkceNormalize(s.urunAdi).includes(sorgu))
      .map((s) => ({
        ad: s.urunAdi,
        kategori: kategoriGetir(s.kategori).kod,
        tutarKurus: s.tutarKurus,
        aile: kategoriGetir(s.kategori).aile,
      }));
    const gecmisAdlar = new Set(gecmisten.map((g) => turkceNormalize(g.ad)));
    const katalogtan = katalogAra(urunAdi.trim(), gecmisAdlar)
      .slice(0, 3)
      .map((k) => {
        const efektifKategori = kategoriGetir(ogrenilenKategoriler.get(turkceNormalize(k.ad)) ?? k.kategori);
        return {
          ad: k.ad,
          kategori: efektifKategori.kod,
          tutarKurus: 0,
          aile: efektifKategori.aile,
        };
      });
    return [...gecmisten, ...katalogtan].slice(0, 6);
  }, [urunAdi, sikAlinanlarListesi, ogrenilenKategoriler]);

  const tutarAltMetin =
    tutarAltMetinTuru === 'gecmisten'
      ? t['ekle.tutar.alt.gecmisten']
      : tutarAltMetinTuru === 'katalogdan'
        ? t['ekle.tutar.alt.katalogdan']
        : tutarAltMetinTuru === 'kategori'
          ? t['ekle.tutar.alt.kategori']
          : null;

  const gunEtiket = sabitGunFarki
    ? uzunTarih(seciliTarih)
    : gunFarki === 0
      ? `${t['ekle.tarih.bugun']} · ${kisaTarih(seciliTarih)}`
      : gunFarki === -1
        ? `${t['ekle.tarih.dun']} · ${kisaTarih(seciliTarih)}`
        : uzunTarih(seciliTarih);
  const gunButon: AmountWellGunButonu = {
    etiket: gunEtiket,
    vurgulu: !bugunMu,
    tiklanabilir: !sabitGunFarki,
    // D-2d-2 — dokununca artık Bugün/Dün arasında geçiş YAPMAZ, E-24 Gün
    // seçici'yi seçim kipinde açar (K-049 sınırları orada uygulanır).
    onPress: () => router.push(`/gun-sec?kip=sec${gunFarki !== 0 ? `&acikGun=${gunFarki}` : ''}` as never),
    accessibilityLabel: a11yEkleGun(gunEtiket),
  };

  function tutarDegistir(guncelle: (b: string) => string) {
    if (tutarHata) setTutarHata(undefined);
    // RN inşa notu #3 — kullanıcı elle düzenlemeye başlarsa tutarla ilgili
    // köken açıklaması ve "geçen sefer" önerisi artık geçerli değildir.
    if (tutarAltMetinTuru === 'gecmisten' || tutarAltMetinTuru === 'katalogdan') setTutarAltMetinTuru(null);
    if (oneriTutarKurus !== null) setOneriTutarKurus(null);
    setBuffer(guncelle);
  }

  function odemeSec(v: OdemeTipi) {
    setOdeme(v);
    if (v === 'nakit') {
      // K-023 — nakite dönülürse taksit sessizce sıfırlanır.
      setTaksitliAcik(false);
      setTaksitSayisi(null);
    }
  }

  /** Ürün + kategori + (varsa) tutar tek kaynaktan geldi — kendi geçmişi ya da "Son kullandıkların" çipi. */
  function urunSec(ad: string, kategoriKoduSecilen: KategoriKodu, gecmisTutarKurus: number) {
    setRutinId(null);
    setUrunAdi(ad);
    setKategoriKilitli(true);
    setTahmin(null);
    setKategoriKodu(kategoriKoduSecilen);
    setTutarHata(undefined);
    setBuffer(kurustanTutarGirisi(gecmisTutarKurus));
    setTutarAltMetinTuru('gecmisten');
    setOneriTutarKurus(null);
  }

  function oneriSec(o: { ad: string; kategori: KategoriKodu; tutarKurus: number }) {
    setUrunAdi(o.ad);
    setKategoriKilitli(true);
    setTahmin(null);
    setKategoriKodu(o.kategori);
    if (o.tutarKurus > 0) {
      setBuffer(kurustanTutarGirisi(o.tutarKurus));
      setTutarAltMetinTuru('gecmisten');
    }
  }

  function urunKaldir() {
    setUrunAdi('');
    setOneriTutarKurus(null);
    setTutarAltMetinTuru(null);
  }

  function oneriKabulEt() {
    if (oneriTutarKurus === null) return;
    if (tutarHata) setTutarHata(undefined);
    setBuffer(kurustanTutarGirisi(oneriTutarKurus));
    setOneriTutarKurus(null);
  }

  function sesliTaslagiUygula(taslak: SesliHarcamaTaslagi) {
    setRutinId(null);
    if (taslak.tutarKurus !== null) {
      setBuffer(kurustanTutarGirisi(taslak.tutarKurus));
      setTutarHata(undefined);
    }
    if (taslak.urunAdi) {
      setUrunAdi(taslak.urunAdi);
      setKategoriKilitli(false);
      setTahmin(null);
    }
    if (taslak.gunFarki !== null && !sabitGunFarki) setSecilenGunFarki(taslak.gunFarki);
    if (taslak.odeme) odemeSec(taslak.odeme);
    if (taslak.taksitSayisi !== null) {
      setOdeme('kart');
      setTaksitliAcik(true);
      setTaksitSayisi(taslak.taksitSayisi);
      setDetaylarAcik(true);
    }
    if (taslak.notMetni) {
      setNotMetni(taslak.notMetni);
    }
  }

  async function kaydet() {
    if (gonderiliyor.current) return;
    if (tutarKurus <= 0) {
      setTutarHata(t['ekle.hata.tutar']);
      return;
    }
    if (tutarKurus > TUTAR_BUYUK_ESIK_KURUS) {
      setTutarHata(t['hata.tutar_buyuk']);
      return;
    }
    gonderiliyor.current = true;
    setKaydediliyor(true);
    setYazmaHata(undefined);
    try {
      if (taksitliAcik && taksitSayisi) {
        await taksitSerisiOlustur({
          tutarKurusToplam: tutarKurus,
          taksitSayisi,
          kategori: kategoriKodu,
          urunAdi: urunAdi.trim() || null,
          odeme: 'kart',
          notMetni: notMetni.trim() || null,
          ilkZaman: seciliTarih,
        });
      } else {
        await harcamaEkle({
          istemciId, rutinId, adet: 1,
          tutarKurus,
          kategori: kategoriKodu,
          urunAdi: urunAdi.trim() || null,
          zaman: seciliTarih.toISOString(),
          gun: seciliGun,
          odeme,
          notMetni: notMetni.trim() || null,
          taksitId: null,
          taksitNo: null,
          taksitToplam: null,
        });
      }
      posthog?.capture('expense_created', {
        category: kategoriKodu,
        payment_method: taksitliAcik ? 'installment' : odeme,
        is_recurring: rutinId !== null,
      });
      veriDegisti();
      toastGoster({
        tur: limitDisiFarkKurus > 0 ? 'warning' : 'info',
        metin:
          limitDisiFarkKurus > 0
            ? toastKaydedildiLimitDisi(paraYaz(tutarKurus), paraYaz(limitDisiFarkKurus))
            : toastKaydedildi(paraYaz(tutarKurus)),
      });
      router.back();
    } catch {
      setYazmaHata(t['ekle.hata.yazilamadi']);
    } finally {
      gonderiliyor.current = false;
      setKaydediliyor(false);
    }
  }

  return (
    <KeyboardAvoidingView style={stil.ekran} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <View style={[stil.guvenliAlan, { height: insets.top }]} />
      <View style={stil.koyuBaslik}>
        <View style={stil.baslikMetni}>
          <Txt role="caption" tone={color.navMuted}>{t['ui.expense.new']}</Txt>
          <Txt role="h1" tone="#FFFFFF">{t['ekle.baslik']}</Txt>
        </View>
        <IconButton
          icon="mic"
          accessibilityLabel={t['a11y.ekle.sesli']}
          tone="#FFFFFF"
          background={color.navGlassBg}
          pressedBackground={color.navGlassBgPressed}
          onPress={() => setSesliTetik((n) => n + 1)}
        />
        <IconButton
          icon="x"
          accessibilityLabel={t['eylem.kapat']}
          tone="#FFFFFF"
          background={color.navGlassBg}
          pressedBackground={color.navGlassBgPressed}
          onPress={() => router.back()}
        />
      </View>
      <ScrollView
        style={stil.kaydir}
        contentContainerStyle={stil.kaydirIcerik}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={stil.panel}>
        <View style={stil.pad}>
          <VoiceExpenseInput baslatTetik={sesliTetik} onTaslak={sesliTaslagiUygula} />
          <View style={{ height: rhythm.section }} />
          <AmountWell
            tutarGosterim={tutarGosterim}
            value={buffer}
            onChangeText={(text) => tutarDegistir(() => text)}
            ustSol={t['ekle.tutar.etiket']}
            ustSag={gunEtiket}
            gunButon={gunButon}
            hata={tutarHata}
          />
        </View>

        {!bugunMu ? (
          <>
            <View style={{ height: rhythm.group }} />
            <View style={stil.pad}>
              <InfoStrip variant="info" icon="calendar" metin={ekleGunSeridi(kisaTarih(seciliTarih))} />
            </View>
          </>
        ) : null}

        {tutarAltMetin ? (
          <>
            <View style={{ height: rhythm.group }} />
            <View style={stil.pad}>
              <Txt role="caption">{tutarAltMetin}</Txt>
            </View>
          </>
        ) : null}

        {oneriTutarKurus !== null ? (
          <>
            <View style={{ height: rhythm.group }} />
            <View style={[stil.pad, stil.satir]}>
              <Chip
                ad={ekleTutarOneriCip(paraYaz(oneriTutarKurus))}
                onPress={oneriKabulEt}
                accessibilityLabel={a11yEkleOneriCip(paraYaz(oneriTutarKurus))}
              />
            </View>
          </>
        ) : null}

        {limitDisiFarkKurus > 0 ? (
          <>
            <View style={{ height: rhythm.group }} />
            <View style={stil.pad}>
              <InfoStrip variant="warning" metin={ekleLimitDisiUyari(paraYaz(limitDisiFarkKurus))} />
            </View>
          </>
        ) : null}

        {sonKullanilanStripGoster ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <Txt role="label" tone={color.text2}>
                {t['ui.expense.favorites']}</Txt>
            </View>
            <View style={{ height: rhythm.group }} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[stil.yatayKaydir, { paddingHorizontal: layout.screenPaddingX }]}>
              {sikAlinanlarListesi.map((s) => (
                <Chip
                  key={`${s.kategori}:${s.urunAdi}`}
                  ad={`${s.sabitlenmis ? '★ ' : ''}${s.urunAdi} · ${kategoriGetir(s.kategori).ad}`}
                  tutar={paraYaz(s.tutarKurus)}
                  dotColor={aileRenkleri(kategoriGetir(s.kategori).aile).solid}
                  dotAlways
                  onPress={() => urunSec(s.urunAdi, kategoriGetir(s.kategori).kod, s.tutarKurus)}
                  accessibilityLabel={a11yEkleSonKullanilan(s.urunAdi, paraYaz(s.tutarKurus))}
                />
              ))}
            </ScrollView>
          </>
        ) : null}

        {rutinler.length > 0 && !taksitliAcik ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <Txt role="label" tone={color.text2}>{t['ui.expense.routines']}</Txt>
              <View style={{ height: rhythm.sameObject }} />
              <Txt role="caption">{t['ui.expense.quick_fill']}</Txt>
            </View>
            <View style={{ height: rhythm.group }} />
            <ScrollView
              horizontal
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[stil.yatayKaydir, { paddingHorizontal: layout.screenPaddingX }]}>
              {rutinId ? <Chip ad={t['ui.expense.remove_routine_link']} onPress={() => setRutinId(null)} /> : null}
              {rutinler.map((r) => (
                <Chip
                  key={r.id}
                  ad={`${r.ad} · ${paraYaz(r.birim_fiyat_kurus)}`}
                  selected={rutinId === r.id}
                  dotColor={aileRenkleri(kategoriGetir(r.kategori).aile).solid}
                  onPress={() => {
                    urunSec(r.ad, kategoriGetir(r.kategori).kod, r.birim_fiyat_kurus);
                    setRutinId(r.id);
                  }}
                />
              ))}
            </ScrollView>
          </>
        ) : null}

        <View style={{ height: rhythm.section }} />
        <View style={stil.pad}>
          <Txt role="label" tone={color.text2}>{t['ui.expense.item_or_note']}</Txt>
          <View style={{ height: rhythm.group }} />
          <SearchField
            deger={urunAdi}
            onDegerDegisti={(val) => {
              setUrunAdi(val);
              if (kategoriKilitli && !val) {
                setKategoriKilitli(false);
              }
            }}
            secili={null}
            onKaldir={urunKaldir}
            yukleniyor={false}
            placeholder={t['ekle.urun.placeholder']}
            accessibilityLabel={t['a11y.ekle.arama']}
            temizleEtiketi={t['a11y.ekle.aramaTemizle']}
            kaldirEtiketi={t['a11y.ekle.urunKaldir']}
          />
        </View>

        {oneriler.length > 0 ? (
          <View style={[stil.pad, { marginTop: rhythm.group }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={stil.yatayKaydir}>
              {oneriler.map((o) => (
                <Chip
                  key={`${o.kategori}:${o.ad}`}
                  ad={`${o.ad} · ${kategoriGetir(o.kategori).ad}`}
                  tutar={o.tutarKurus > 0 ? paraYaz(o.tutarKurus) : undefined}
                  dotColor={aileRenkleri(o.aile).solid}
                  onPress={() => oneriSec(o)}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View style={{ height: rhythm.group }} />
        <View style={stil.pad}>
          <TextField
            label={t['ekle.not.etiket']}
            value={notMetni}
            onChangeText={setNotMetni}
            placeholder={t['ekle.not.placeholder']}
            maxLength={100}
          />
        </View>

        <View style={{ height: rhythm.section }} />
        <View style={stil.pad}>
          <Txt role="label" tone={color.text2}>
            {t['ekle.kategori.etiket']}
          </Txt>
        </View>
        <View style={{ height: rhythm.group }} />
        <CategoryPicker value={kategoriKodu} onChange={kategoriSec} />
        {abonelikMi ? (
          <View style={[stil.pad, { marginTop: rhythm.blockInCard }]}>
            <Txt role="label" tone={color.text2}>{t['ui.expense.payment_period']}</Txt>
            <View style={{ height: rhythm.group }} />
            <View style={stil.satir}>
              <Chip
                ad={t['ui.common.monthly']}
                selected
                dotColor={color.primary}
                accessibilityLabel={t['ui.expense.subscription_period_a11y']}
              />
            </View>
            <View style={{ height: rhythm.group }} />
            <Txt role="caption" tone={color.text2}>{t['ui.expense.subscription_monthly']}</Txt>
          </View>
        ) : null}
        {tahmin && !kategoriKilitli ? (
          <View style={[stil.pad, { marginTop: rhythm.group }]}>
            <Txt role="caption" tone={color.text2}>
              {ekleKategoriTahmini(kategoriGetir(tahmin.kategori).ad)}
            </Txt>
          </View>
        ) : null}

        <View style={{ height: rhythm.section }} />
        <View style={stil.pad}>
          <Pressable
            onPress={() => setDetaylarAcik((v) => !v)}
            accessibilityRole="button"
            accessibilityState={{ expanded: detaylarAcik }}
            style={({ pressed }) => [stil.detaySatiri, pressed && stil.detaySatiriBasili]}>
            <View style={stil.detayIkon}><Icon name="limitler" size={20} color={color.primary} /></View>
            <View style={stil.esnek}>
              <Txt role="bodyStrong">{t['ui.expense.other_details']}</Txt>
              <Txt role="caption">{abonelikMi ? `${t['ui.common.monthly']} · ` : ''}{odeme === 'kart' ? t['ekle.odeme.kart'] : t['ekle.odeme.nakit']}{taksitSayisi ? ` · ${metin('ekle.taksit.secenek', { n: taksitSayisi })}` : ''}</Txt>
            </View>
            <View style={detaylarAcik ? stil.okAcik : undefined}>
              <Icon name="chevron-down" size={20} color={color.text2} />
            </View>
          </Pressable>
        </View>

        {detaylarAcik ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <Txt role="label" tone={color.text2}>
                {t['ekle.odeme.etiket']}
              </Txt>
              <View style={{ height: rhythm.group }} />
              <View style={stil.odemeSatiri}>
                <View style={stil.segmentEsnek}>
                  <SegmentedControl
                    secenekler={[
                      { value: 'nakit' as OdemeTipi, label: t['ekle.odeme.nakit'], icon: 'banknote' },
                      { value: 'kart' as OdemeTipi, label: t['ekle.odeme.kart'], icon: 'credit-card' },
                    ]}
                    deger={odeme}
                    onChange={odemeSec}
                  />
                </View>
                {odeme === 'kart' && !abonelikMi ? (
                  <>
                    <View style={{ width: rhythm.blockInCard }} />
                    <Chip
                      ad={t['ekle.taksit.baglanti']}
                      selected={taksitliAcik}
                      dotColor={color.primary}
                      onPress={() => setTaksitliAcik((a) => !a)}
                    />
                  </>
                ) : null}
              </View>
            </View>

            {taksitliAcik ? (
              <>
                <View style={{ height: rhythm.blockInCard }} />
                <View style={stil.pad}>
                  <Txt role="label" tone={color.text2}>
                    {t['ekle.taksit.baslik']}
                  </Txt>
                </View>
                <View style={{ height: rhythm.group }} />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[stil.yatayKaydir, { paddingHorizontal: layout.screenPaddingX }]}>
                  {TAKSIT_SECENEKLERI.map((n) => (
                    <Chip
                      key={n}
                      ad={metin('ekle.taksit.secenek', { n })}
                      selected={taksitSayisi === n}
                      dotColor={color.primary}
                      onPress={() => setTaksitSayisi(n)}
                    />
                  ))}
                </ScrollView>
                {taksitSayisi ? (
                  <>
                    <View style={{ height: rhythm.group }} />
                    <View style={stil.pad}>
                      <Txt role="caption" tone={color.text2}>
                        {ekleTaksitOnizleme(paraYaz(Math.round(tutarKurus / taksitSayisi), true), taksitSayisi)}
                      </Txt>
                    </View>
                  </>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}

        <View style={{ height: rhythm.section }} />
        </View>
      </ScrollView>

      <View style={[stil.altSabit, { paddingBottom: insets.bottom + rhythm.group }]}>
        <View style={stil.pad}>
          {yazmaHata ? (
            <>
              <Txt role="caption" tone={color.dangerInk}>
                {yazmaHata}
              </Txt>
              <View style={{ height: rhythm.group }} />
            </>
          ) : null}
          <Button
            label={t['ui.expense.save']}
            variant="primary"
            disabled={tutarKurus <= 0}
            loading={kaydediliyor}
            onPress={kaydet}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const stil = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: color.navDark },
  guvenliAlan: { backgroundColor: color.navDark },
  koyuBaslik: { backgroundColor: color.navDark, paddingHorizontal: layout.screenPaddingX, paddingTop: rhythm.group, paddingBottom: rhythm.pad, flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
  baslikMetni: { flex: 1, minWidth: 0 },
  kaydir: { flex: 1, backgroundColor: color.navDark },
  kaydirIcerik: { flexGrow: 1 },
  panel: { flexGrow: 1, backgroundColor: color.surface, borderTopLeftRadius: radius.hero, borderTopRightRadius: radius.hero, paddingTop: rhythm.section, paddingBottom: 112 },
  pad: { paddingHorizontal: layout.screenPaddingX },
  esnek: { flex: 1, minWidth: 0 },
  satir: { flexDirection: 'row', alignItems: 'center' },
  odemeSatiri: { flexDirection: 'row', alignItems: 'center' },
  segmentEsnek: { flex: 1 },
  yatayKaydir: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group },
  // §3.1 sabit alt blok üst boşluğu 8
  altSabit: { paddingTop: rhythm.group, backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
  detaySatiri: { minHeight: 68, paddingHorizontal: rhythm.pad, flexDirection: 'row', alignItems: 'center', gap: rhythm.blockInCard, borderRadius: radius.tile, backgroundColor: color.groove },
  detaySatiriBasili: { backgroundColor: color.primarySoft },
  detayIkon: { width: 40, height: 40, borderRadius: 12, backgroundColor: color.primarySoft, alignItems: 'center', justifyContent: 'center' },
  detayBlok: { gap: rhythm.blockInCard, marginTop: rhythm.pad },
  okAcik: { transform: [{ rotate: '180deg' }] },
});
