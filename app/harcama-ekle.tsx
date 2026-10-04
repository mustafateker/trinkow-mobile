import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
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
import { SearchResultRow } from '@/components/SearchResultRow';
import { SearchResultSkeleton } from '@/components/SearchResultSkeleton';
import { SegmentedControl } from '@/components/SegmentedControl';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { aktifKatalogu, type KatalogOgesi } from '@/content/urunKatalogu';
import {
  a11yEkleGun,
  a11yEkleOneriCip,
  a11yEkleSonKullanilan,
  ekleAramaSatirGecen,
  ekleAramaYeniBaslik,
  ekleKategoriTahmini,
  ekleGunSeridi,
  ekleLimitDisiUyari,
  ekleTaksitOnizleme,
  ekleTutarOneriCip,
  EKLE_ARAMA_YENI_ALT,
  t,
  toastKaydedildi,
  toastKaydedildiLimitDisi,
} from '@/content/metinler';
import {
  ODEME_VARSAYILAN,
  gunToplami,
  gunlukLimit,
  harcamaEkle,
  sikAlinanlar,
  taksitSerisiOlustur,
  tahminGecmisi,
  urunAra,
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
import { color, layout, radius, rhythm } from '@/theme/tokens';

/**
 * E-11 · Harcama ekle. Referans: prototip-v4/02-harcama-ekle.html (17 yüzey, T-4).
 * Dokunuş bütçesi (ekran-envanteri §4): 1) Harcama ekle 2) Kategori 3) Kaydet.
 * Ürün arama (F-18) bu bütçeyi UZATMAZ: arama boş bırakılırsa hiçbir dalda
 * doğrulama hatası doğmaz (delta-v4.md "Bilinçli tasarım kararları" #1).
 *
 * Kategori bu ekranda seçilir (`CategoryPicker`): `?kategori=` route param'ı ya da
 * seçilen ürün ön-seçim verir, param yoksa "Diğer" ile açılır; kullanıcı kaydetmeden
 * önce tek dokunuşla değiştirebilir.
 * Nakite dönülürse taksit sessizce sıfırlanır (K-023). Kaydet yalnız
 * tutar>0 iken etkin.
 */
const TAKSIT_SECENEKLERI = [3, 6, 9, 12];

/** Tutar kuyusunun altındaki tek cümlelik köken açıklaması (design point #5 — tekrar yok). */
type TutarAltMetinTuru = 'gecmisten' | 'katalogdan' | 'kategori' | null;

export default function HarcamaEkleEkrani() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ gunFarki?: string; kategori?: string; ad?: string; tutarKurus?: string; rutinId?: string }>();

  // v4 K-049 — Günlük'ün geçmiş sayfasından açılınca tarih o güne SABİTLENİR
  // (0/-1 dışındaki bir gün farkı geldiyse Bugün/Dün seçici gizlenir).
  const gunFarkiParam = params.gunFarki !== undefined ? Number.parseInt(params.gunFarki, 10) : null;
  const sabitGunFarki =
    gunFarkiParam !== null && Number.isFinite(gunFarkiParam) && gunFarkiParam !== 0 && gunFarkiParam !== -1;

  const [buffer, setBuffer] = useState(() => params.tutarKurus && Number(params.tutarKurus) > 0 ? kurustanTutarGirisi(Number(params.tutarKurus)) : '');
  const gonderiliyor = useRef(false);
  const [istemciId] = useState(yeniId);
  const [rutinId, setRutinId] = useState<string | null>(params.rutinId ?? null);
  const [rutinler, setRutinler] = useState<{id:string;ad:string;kategori:string;birim_fiyat_kurus:number}[]>([]);

  // F-18 — arama alanı. `urunAdi` doluysa alan "seçili" durumdadır (ürün
  // kaydın AYRI alanı, K-033); `aramaMetni` yalnız seçim yokken canlıdır.
  const [urunAdi, setUrunAdi] = useState(params.ad ?? '');
  const [aramaMetni, setAramaMetni] = useState('');
  const [gecmisSonuclar, setGecmisSonuclar] = useState<SikAlinan[]>([]);
  const [gecmisYukleniyor, setGecmisYukleniyor] = useState(false);
  const [ogrenilenKategoriler, setOgrenilenKategoriler] = useState<Map<string, string>>(new Map());
  const [oneriTutarKurus, setOneriTutarKurus] = useState<number | null>(null);
  const [tutarAltMetinTuru, setTutarAltMetinTuru] = useState<TutarAltMetinTuru>(null);

  // Kategori seçim arayüzü YOK (REV2) — değer daima param'dan ya da seçilen
  // üründen gelir. "Diğer" düşüşü artık yalnız savunma amaçlıdır: bilinen
  // hiçbir akış bu ekranı param'sız açmaz (bkz. dosya başındaki not).
  // Serbest ürün girişinde de mevcut değer olduğu gibi korunur; kullanıcı
  // isterse arama/favorilerden doğru kategoriyi taşıyan bir ürün seçer.
  const [kategoriKodu, setKategoriKodu] = useState<KategoriKodu>(() =>
    kategoriGetir(params.kategori ?? 'diger').kod,
  );
  // Kategori tahmini: param, ürün seçimi ya da elle seçim kategoriyi KİLİTLER;
  // kilitli değilken ürün adı/tutar/saat değiştikçe tahmin güncellenir.
  const [kategoriKilitli, setKategoriKilitli] = useState(params.kategori !== undefined);
  const [tahmin, setTahmin] = useState<KategoriTahmini | null>(null);
  const [gecmisKayitlari, setGecmisKayitlari] = useState<GecmisKayit[]>([]);

  // D-2c-1b — Ayarlar'daki "varsayılan ödeme" ön-seçim olarak gelir; burada
  // değiştirmek yalnız BU kaydı etkiler, tercihi KALICI değiştirmez.
  const [odeme, setOdeme] = useState<OdemeTipi>(ODEME_VARSAYILAN);
  const [taksitliAcik, setTaksitliAcik] = useState(false);
  const [taksitSayisi, setTaksitSayisi] = useState<number | null>(null);
  // D-2d-2 — gün yalnız E-24 Gün seçici'den değişir (kip=sec); Günlük'ün
  // "Dün" sayfasından açılan akışın ilk değeri korunur (K-049).
  const [secilenGunFarki, setSecilenGunFarki] = useState<number | null>(gunFarkiParam === -1 ? -1 : null);
  const [notAcik, setNotAcik] = useState(false);
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
    void sikAlinanlar(db, 30).then((l) => canli && setSikAlinanlarListesi(l)).catch(() => {});
    void routinesGet().then((r) => canli && setRutinler(r.rutinler)).catch(() => {});
    void gunlukLimit(db).then((l) => canli && setLimitKurus(l)).catch(() => {});
    void tumOgrenilenKategoriler(db).then((m) => canli && setOgrenilenKategoriler(m)).catch(() => {});
    void tahminGecmisi(db).then((l) => canli && setGecmisKayitlari(l)).catch(() => {});
    // K-072 — yalnız İLK yüklemede ön-seçim olarak uygulanır; kullanıcının
    // ekranda `odemeSec` ile yaptığı değişikliği bu efekt geç render'da EZMEZ
    // (bağımlılık dizisi yalnız `db`, taksitliAcik/odeme buraya eklenmez).
    void varsayilanOdemeOku(db).then((v) => canli && setOdeme(v)).catch(() => {});
    return () => {
      canli = false;
    };
  }, [db]);

  // D-2d-2 — E-24 Gün seçici (kip=sec) seçtiği günü bu bus'la bildirir.
  useEffect(() => gunSeciciAbone(setSecilenGunFarki), []);

  const gunFarki = sabitGunFarki ? gunFarkiParam! : (secilenGunFarki ?? 0);
  const seciliTarih = useMemo(() => gunEkle(new Date(), gunFarki), [gunFarki]);
  const seciliGun = useMemo(() => gunAnahtari(seciliTarih), [seciliTarih]);
  const bugunMu = !sabitGunFarki && gunFarki === 0;

  useEffect(() => {
    let canli = true;
    void gunToplami(db, seciliGun).then((v) => canli && setGununToplamiKurus(v));
    return () => {
      canli = false;
    };
  }, [db, seciliGun]);

  // F-18 — kullanıcının kendi geçmişinde arama (SQLite, tipik <50ms).
  // Katalog senkron/RAM-içi olduğu için burada beklenmez (RN inşa notu #1).
  useEffect(() => {
    if (urunAdi.trim() !== '') return;
    const sorgu = aramaMetni.trim();
    if (!sorgu) {
      setGecmisSonuclar([]);
      setGecmisYukleniyor(false);
      return;
    }
    let canli = true;
    setGecmisYukleniyor(true);
    void urunAra(db, sorgu, 20).then((sonuc) => {
      if (!canli) return;
      setGecmisSonuclar(sonuc);
      setGecmisYukleniyor(false);
    });
    return () => {
      canli = false;
    };
  }, [db, aramaMetni, urunAdi]);

  const tutarKurus = tutarGirisindenKurus(buffer);
  const abonelikMi = kategoriKodu === 'abonelik';

  // Abonelik kategorisi aylık periyottadır; taksit, aynı harcamayı aylara
  // bölmek anlamına geldiği için abonelik periyoduyla birlikte kullanılamaz.
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

  // F-18 — arama sonuçları açıkken kategori kontrolü ekranda YOKTUR (katlama
  // tablosu istisnası): kategori bir sonraki dokunuşta üründen gelecek.
  const aramaAktif = urunAdi.trim() === '' && aramaMetni.trim() !== '';
  const sonKullanilanStripGoster = urunAdi.trim() === '' && aramaMetni.trim() === '' && sikAlinanlarListesi.length > 0;

  const gecmisAdlarNormalize = useMemo(
    () => new Set(gecmisSonuclar.map((g) => turkceNormalize(g.urunAdi))),
    [gecmisSonuclar],
  );
  const katalogSonuclari = useMemo(
    () => (aramaAktif ? katalogAra(aramaMetni, gecmisAdlarNormalize) : []),
    [aramaAktif, aramaMetni, gecmisAdlarNormalize],
  );
  const aramaSonucYok =
    aramaAktif && !gecmisYukleniyor && gecmisSonuclar.length === 0 && katalogSonuclari.length === 0;

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
    setAramaMetni('');
    setKategoriKilitli(true);
    setTahmin(null);
    setKategoriKodu(kategoriKoduSecilen);
    setTutarHata(undefined);
    setBuffer(kurustanTutarGirisi(gecmisTutarKurus));
    setTutarAltMetinTuru('gecmisten');
    setOneriTutarKurus(null);
  }

  function katalogSec(oge: KatalogOgesi) {
    const efektifKod = kategoriGetir(ogrenilenKategoriler.get(turkceNormalize(oge.ad)) ?? oge.kategori).kod;
    setUrunAdi(oge.ad);
    setAramaMetni('');
    setKategoriKilitli(true);
    setTahmin(null);
    setKategoriKodu(efektifKod);
    setOneriTutarKurus(null);
    // Katalogda fiyat yok (K-050/K-037): tutar 0 kalırsa "sen yaz" denir.
    setTutarAltMetinTuru(tutarKurus === 0 ? 'katalogdan' : 'kategori');
  }

  function serbestEkle() {
    const ad = aramaMetni.trim();
    if (!ad) return;
    setUrunAdi(ad);
    setAramaMetni('');
    // Serbest ürün girişinde seçili kategori olduğu gibi korunur.
    setOneriTutarKurus(null);
    setTutarAltMetinTuru(null);
  }

  function urunKaldir() {
    setUrunAdi('');
    setAramaMetni('');
    setOneriTutarKurus(null);
    setTutarAltMetinTuru(null);
    // RN inşa notu #4 — ürün silinince kategori ve tutar SİLİNMEZ.
  }

  function oneriKabulEt() {
    if (oneriTutarKurus === null) return;
    if (tutarHata) setTutarHata(undefined);
    setBuffer(kurustanTutarGirisi(oneriTutarKurus));
    setOneriTutarKurus(null);
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
        await taksitSerisiOlustur(db, {
          tutarKurusToplam: tutarKurus,
          taksitSayisi,
          kategori: kategoriKodu,
          urunAdi: urunAdi.trim() || null,
          odeme: 'kart',
          notMetni: notMetni.trim() || null,
          ilkZaman: seciliTarih,
        });
      } else {
        await harcamaEkle(db, {
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
          <Txt role="caption" tone={color.navMuted}>Yeni kayıt</Txt>
          <Txt role="h1" tone="#FFFFFF">{t['ekle.baslik']}</Txt>
        </View>
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
                Favoriler ve sık kullanılanlar
              </Txt>
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
              <Txt role="label" tone={color.text2}>Rutin harcamalar</Txt>
              <View style={{ height: rhythm.sameObject }} />
              <Txt role="caption">Tek dokunuşla tutar ve kategoriyi doldur.</Txt>
            </View>
            <View style={{ height: rhythm.group }} />
            <ScrollView
              horizontal
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[stil.yatayKaydir, { paddingHorizontal: layout.screenPaddingX }]}>
              {rutinId ? <Chip ad="Rutin bağlantısını kaldır" onPress={() => setRutinId(null)} /> : null}
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
          <Txt role="label" tone={color.text2}>Ürün veya açıklama</Txt>
          <View style={{ height: rhythm.group }} />
          <SearchField
            deger={aramaMetni}
            onDegerDegisti={setAramaMetni}
            secili={urunAdi.trim() ? urunAdi : null}
            onKaldir={urunKaldir}
            yukleniyor={gecmisYukleniyor}
            placeholder={t['ekle.arama.placeholder']}
            accessibilityLabel={t['a11y.ekle.arama']}
            temizleEtiketi={t['a11y.ekle.aramaTemizle']}
            kaldirEtiketi={t['a11y.ekle.urunKaldir']}
          />
        </View>

        {aramaAktif ? (
          <View style={stil.pad}>
            <View style={{ height: rhythm.section }} />
            {gecmisYukleniyor ? (
              <SearchResultSkeleton />
            ) : aramaSonucYok ? (
              <SearchResultRow
                baslik={ekleAramaYeniBaslik(aramaMetni.trim())}
                altBaslik={EKLE_ARAMA_YENI_ALT}
                onPress={serbestEkle}
              />
            ) : (
              <>
                {gecmisSonuclar.length > 0 ? (
                  <>
                    <Txt role="label" tone={color.text2}>
                      Favoriler ve sık kullanılanlar
                    </Txt>
                    <View style={{ height: rhythm.group }} />
                    {gecmisSonuclar.map((s, i) => (
                      <View key={`${s.kategori}:${s.urunAdi}`} style={i > 0 ? { marginTop: rhythm.group } : undefined}>
                        <SearchResultRow
                          kategori={kategoriGetir(s.kategori)}
                          baslik={s.urunAdi}
                          altBaslik={ekleAramaSatirGecen(kategoriGetir(s.kategori).ad, paraYaz(s.tutarKurus))}
                          onPress={() => urunSec(s.urunAdi, kategoriGetir(s.kategori).kod, s.tutarKurus)}
                        />
                      </View>
                    ))}
                  </>
                ) : null}
                {katalogSonuclari.length > 0 ? (
                  <>
                    {gecmisSonuclar.length > 0 ? <View style={{ height: rhythm.section }} /> : null}
                    <Txt role="label" tone={color.text2}>
                      {t['ekle.arama.grup.katalog']}
                    </Txt>
                    <View style={{ height: rhythm.group }} />
                    {katalogSonuclari.map((k, i) => {
                      const efektifKategori = kategoriGetir(ogrenilenKategoriler.get(turkceNormalize(k.ad)) ?? k.kategori);
                      return (
                        <View key={k.id} style={i > 0 ? { marginTop: rhythm.group } : undefined}>
                          <SearchResultRow
                            kategori={efektifKategori}
                            baslik={k.ad}
                            altBaslik={efektifKategori.ad}
                            onPress={() => katalogSec(k)}
                          />
                        </View>
                      );
                    })}
                  </>
                ) : null}
              </>
            )}
          </View>
        ) : (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <Txt role="label" tone={color.text2}>
                {t['ekle.kategori.etiket']}
              </Txt>
            </View>
            <View style={{ height: rhythm.group }} />
            {/* Tasarım kiti §7.4 — kategori bu sheet'te seçilir. Param'dan ya da
                seçilen üründen gelen değer ön-seçili durur, tek dokunuşla değişir. */}
            <CategoryPicker value={kategoriKodu} onChange={kategoriSec} />
            {abonelikMi ? (
              <View style={[stil.pad, { marginTop: rhythm.blockInCard }]}>
                <Txt role="label" tone={color.text2}>Ödeme periyodu</Txt>
                <View style={{ height: rhythm.group }} />
                <View style={stil.satir}>
                  <Chip
                    ad="Aylık"
                    selected
                    dotColor={color.primary}
                    accessibilityLabel="Abonelik ödeme periyodu, aylık"
                  />
                </View>
                <View style={{ height: rhythm.group }} />
                <Txt role="caption" tone={color.text2}>Abonelik tutarı aylık gider olarak kaydedilir.</Txt>
              </View>
            ) : null}
            {tahmin && !kategoriKilitli ? (
              <View style={[stil.pad, { marginTop: rhythm.group }]}>
                <Txt role="caption" tone={color.text2}>
                  {ekleKategoriTahmini(kategoriGetir(tahmin.kategori).ad)}
                </Txt>
              </View>
            ) : null}
          </>
        )}

        {!aramaAktif ? <>
          <View style={{ height: rhythm.section }} />
          <View style={stil.pad}>
            <Pressable
              onPress={() => setDetaylarAcik((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ expanded: detaylarAcik }}
              style={({ pressed }) => [stil.detaySatiri, pressed && stil.detaySatiriBasili]}>
              <View style={stil.detayIkon}><Icon name="limitler" size={20} color={color.primary} /></View>
              <View style={stil.esnek}>
                <Txt role="bodyStrong">Diğer detaylar</Txt>
                <Txt role="caption">{abonelikMi ? 'Aylık · ' : ''}{odeme === 'kart' ? 'Kart' : 'Nakit'}{taksitSayisi ? ` · ${taksitSayisi} taksit` : ''}{notMetni.trim() ? ' · Not eklendi' : ''}</Txt>
              </View>
              <View style={detaylarAcik ? stil.okAcik : undefined}>
                <Icon name="chevron-down" size={20} color={color.text2} />
              </View>
            </Pressable>
          </View>
        </> : null}

        {detaylarAcik && !aramaAktif ? <>
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
                  ad={`${n} taksit`}
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

        <View style={{ height: rhythm.section }} />
        <View style={[stil.pad, stil.satir]}>
          <Chip
            ad={t['ekle.not.ac']}
            selected={notAcik}
            dotColor={color.primary}
            onPress={() => setNotAcik((a) => !a)}
            accessibilityLabel="Not ekle"
          />
        </View>

        {notAcik ? (
          <>
            <View style={{ height: rhythm.group }} />
            <View style={stil.pad}>
              <TextField
                label={t['ekle.not.etiket']}
                value={notMetni}
                onChangeText={setNotMetni}
                placeholder={t['ekle.not.placeholder']}
                maxLength={60}
              />
            </View>
          </>
        ) : null}
        </> : null}

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
            label="Harcamayı kaydet"
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
