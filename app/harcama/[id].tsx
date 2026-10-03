import { ErrorState } from '@/components/ErrorState';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmountWell } from '@/components/AmountWell';
import { Button } from '@/components/Button';
import { CategoryGridSheet } from '@/components/CategoryPicker';
import { ClayPressable } from '@/components/ClayPressable';
import { ClaySurface } from '@/components/ClaySurface';
import { Dialog } from '@/components/Dialog';
import { ExpenseRow } from '@/components/ExpenseRow';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { InfoStrip } from '@/components/InfoStrip';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Skeleton } from '@/components/Skeleton';
import { TextField } from '@/components/TextField';
import { Txt } from '@/components/Txt';
import { detayTaksitBilgi, silGovdeTaksit, t } from '@/content/metinler';
import { harcamaGetir, harcamaGuncelle, type Harcama, type OdemeTipi } from '@/db/harcama';
import { harcamaTekilSilVeGeriAlSun, taksitSerisiSilVeToastGoster } from '@/lib/harcamaEylemleri';
import { aileRenkleri, kategori as kategoriGetir, type KategoriKodu } from '@/lib/kategoriler';
import { TUTAR_BUYUK_ESIK_KURUS, kurustanTutarGirisi, paraYaz, sayiyaCevir, tutarGirisindenKurus, tutarGosterimi } from '@/lib/para';
import { eklenmeEtiketi, kisaTarih, saatYaz } from '@/lib/tarih';
import { veriDegisti } from '@/lib/veriBus';
import { clay, color, layout, radius, rhythm, size } from '@/theme/tokens';

/**
 * E-12 · Harcama detayı + E-13 · Taksit serisi silme onayı.
 * Referans: prototip-v3/06-harcama-detay.html.
 *
 * K-029: tek harcama silme onaysız + 6 sn geri al toast'ı; taksit serisi
 * silme `Dialog` ile onaylanır.
 *
 * D-2a (M-1) — tutar düzenlenebilir: tutar kuyusuna dokununca E-11'deki
 * `AmountWell` içindeki native para girişi yeniden kullanılır.
 * Taksitli kayıtta tutar KİLİTLİDİR (`detay.tutar_kilit`) — tek bir taksitin
 * tutarını değiştirmek serinin toplamıyla tutarsız kalır; kategori/ödeme/not
 * taksitli kayıtta da düzenlenebilir kalır (mevcut davranış, değişmedi).
 */
export default function HarcamaDetayEkrani() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // BE-6b: `id` artık Mongo ObjectId (string) — `Number(id)` SAYISALLAŞTIRIRDI
  // ve NaN üretirdi (sözleşme uyuşmazlığı, PM'e bildirildi). Route parametresi
  // zaten string, doğrudan kullanılır.
  const harcamaId = id ?? '';
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const [harcama, setHarcama] = useState<Harcama | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [skeletonGoster, setSkeletonGoster] = useState(false);
  const [bulunamadi, setBulunamadi] = useState(false);

  const [kategoriKodu, setKategoriKodu] = useState<KategoriKodu | null>(null);
  const [odeme, setOdeme] = useState<OdemeTipi>('kart');
  const [notMetni, setNotMetni] = useState('');
  const [kategoriSecimAcik, setKategoriSecimAcik] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [yazmaHata, setYazmaHata] = useState<string | undefined>();

  // D-2a (M-1) — tutar metni native TextInput ile düzenlenir.
  const [tutarBuffer, setTutarBuffer] = useState('');
  const [tutarDuzenleAcik, setTutarDuzenleAcik] = useState(false);
  const [tutarHata, setTutarHata] = useState<string | undefined>();

  const [okumaHata, setOkumaHata] = useState(false);
  const [yenidenDene, setYenidenDene] = useState(0);
  const [silDialogAcik, setSilDialogAcik] = useState(false);
  const [silSiliniyor, setSilSiliniyor] = useState(false);
  // "Kalan {adet} taksit" — mevcut kayıttan SONRAKİ ödenmemiş taksit sayısı
  // (12 taksitin 3.'sü görüntüleniyorsa kalan 9'dur; prototip §E-13 birebir).
  const seriKalan = Math.max((harcama?.taksitToplam ?? 0) - (harcama?.taksitNo ?? 0), 0);

  useEffect(() => {
    let canli = true;
    setYukleniyor(true);
    setOkumaHata(false);
    void harcamaGetir(db, harcamaId).then((h) => {
      if (!canli) return;
      if (!h) {
        setBulunamadi(true);
      } else {
        setHarcama(h);
        setKategoriKodu(kategoriGetir(h.kategori).kod);
        setOdeme(h.odeme);
        setNotMetni(h.notMetni ?? '');
        setTutarBuffer(kurustanTutarGirisi(h.tutarKurus));
      }
      setYukleniyor(false);
    }).catch(() => {
      if (canli) { setOkumaHata(true); setYukleniyor(false); }
    });
    return () => {
      canli = false;
    };
  }, [db, harcamaId, yenidenDene]);

  useEffect(() => {
    if (!yukleniyor) {
      setSkeletonGoster(false);
      return;
    }
    const zamanlayici = setTimeout(() => setSkeletonGoster(true), 150);
    return () => clearTimeout(zamanlayici);
  }, [yukleniyor]);

  // Taksitli kayıtta tutar hiç açılamaz; tutarDuzenleAcik yalnız taksitsizde true olur.
  const tutarKurusDuzenlenen = tutarGirisindenKurus(tutarBuffer);
  const tutarGosterim = tutarGosterimi(tutarBuffer);

  function tutarBufferDegistir(guncelle: (b: string) => string) {
    if (tutarHata) setTutarHata(undefined);
    setTutarBuffer(guncelle);
  }

  async function kaydet() {
    if (!harcama || !kategoriKodu) return;
    if (tutarDuzenleAcik) {
      if (tutarKurusDuzenlenen <= 0) return;
      if (tutarKurusDuzenlenen > TUTAR_BUYUK_ESIK_KURUS) {
        setTutarHata(t['hata.tutar_buyuk']);
        return;
      }
    }
    setKaydediliyor(true);
    setYazmaHata(undefined);
    try {
      await harcamaGuncelle(db, harcama.id, {
        kategori: kategoriKodu,
        odeme,
        notMetni: notMetni.trim() || null,
        ...(tutarDuzenleAcik ? { tutarKurus: tutarKurusDuzenlenen } : {}),
      });
      veriDegisti();
      router.back();
    } catch {
      setYazmaHata(t['hata.yazma']);
    } finally {
      setKaydediliyor(false);
    }
  }

  async function silTekHarcama() {
    if (!harcama) return;
    try {
      await harcamaTekilSilVeGeriAlSun(db, harcama);
      router.back();
    } catch {
      setYazmaHata(t['hata.yazma']);
    }
  }

  async function silTaksitSerisi() {
    if (!harcama?.taksitId) return;
    setSilSiliniyor(true);
    try {
      await taksitSerisiSilVeToastGoster(db, harcama.taksitId);
      router.back();
    } catch {
      setYazmaHata(t['hata.yazma']);
    } finally {
      setSilSiliniyor(false);
    }
  }

  if (bulunamadi) {
    return (
      <KeyboardAvoidingView style={stil.ekran} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar style="dark" />
        <View style={{ height: insets.top }} />
        <View style={stil.tutamacSatiri}>
          <View style={stil.tutamac} />
        </View>
        <View style={stil.basSatiri}>
          <Txt role="h2">{t['detay.baslik']}</Txt>
          <IconButton icon="x" accessibilityLabel={t['eylem.kapat']} onPress={() => router.back()} />
        </View>
        <View style={stil.bulunamadiSarmal}>
          <View style={stil.hataDaire}>
            <Icon name="list-x" size={32} color={color.text2} />
          </View>
          <View style={{ height: rhythm.blockInCard }} />
          <Txt role="h2">{t['detay.bulunamadi.baslik']}</Txt>
          <View style={{ height: rhythm.group }} />
          <Txt role="body" style={stil.ortaMetin}>
            {t['detay.bulunamadi.govde']}
          </Txt>
          <View style={{ height: rhythm.blockInCard }} />
          <Button label={t['detay.bulunamadi.eylem']} variant="primary" onPress={() => router.back()} />
        </View>
        <View style={{ height: insets.bottom + rhythm.pad }} />
      </KeyboardAvoidingView>
    );
  }

  const taksitli = Boolean(harcama?.taksitId);
  const kat = kategoriKodu ? kategoriGetir(kategoriKodu) : null;
  const kaydetDisabled = tutarDuzenleAcik && tutarKurusDuzenlenen <= 0;

  if (okumaHata) return <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}><ErrorState onRetry={() => setYenidenDene((n) => n + 1)} /></View>;

  return (
    <KeyboardAvoidingView style={stil.ekran} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="dark" />
      <View style={{ height: insets.top }} />
      <ScrollView
        style={stil.kaydir}
        contentContainerStyle={[stil.pad, { paddingBottom: insets.bottom + rhythm.section }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={stil.tutamacSatiri}>
          <View style={stil.tutamac} />
        </View>
        <View style={stil.basSatiri}>
          <Txt role="h2">{t['detay.baslik']}</Txt>
          <IconButton icon="x" accessibilityLabel={t['eylem.kapat']} onPress={() => router.back()} />
        </View>
        <View style={{ height: rhythm.section }} />

        {skeletonGoster && !harcama ? (
          <DetaySkeleton />
        ) : harcama && kat ? (
          <>
            <Pressable
              disabled={taksitli || tutarDuzenleAcik}
              accessibilityRole="button"
              accessibilityLabel={tutarDuzenleAcik ? 'Tutar düzenleyiciyi kapat' : 'Tutarı düzenle'}
              onPress={() => setTutarDuzenleAcik((a) => !a)}>
              {tutarDuzenleAcik ? (
                <AmountWell
                  tutarGosterim={tutarGosterim}
                  value={tutarBuffer}
                  onChangeText={(text) => tutarBufferDegistir(() => text)}
                  autoFocus
                  ustSol={t['ekle.tutar.etiket']}
                  ustSag={`${kisaTarih(new Date(harcama.zaman))} · ${saatYaz(harcama.zaman)}`}
                  hata={tutarHata}
                />
              ) : (
                <ClaySurface level="sunken" borderRadius={radius.tile} style={stil.tutarKuyusu}>
                  <View style={stil.aralikSatiri}>
                    <Txt role="label" tone={color.text2}>
                      {t['ekle.tutar.etiket']}
                    </Txt>
                    <Txt role="caption">{`${kisaTarih(new Date(harcama.zaman))} · ${saatYaz(harcama.zaman)}`}</Txt>
                  </View>
                  <View style={{ height: rhythm.group }} />
                  <View style={stil.tutarSatiri}>
                    <Txt role="display" numberOfLines={1}>
                      {sayiyaCevir(tutarKurusDuzenlenen, true)}
                    </Txt>
                    <View style={{ width: rhythm.group }} />
                    <Txt role="amount" tone={color.text2}>
                      ₺
                    </Txt>
                  </View>
                </ClaySurface>
              )}
            </Pressable>

            {taksitli ? (
              <>
                <View style={{ height: rhythm.group }} />
                <Txt role="caption" tone={color.text2}>
                  {t['detay.tutar_kilit']}
                </Txt>
                <View style={{ height: rhythm.group }} />
                <InfoStrip
                  variant="info"
                  metin={`${detayTaksitBilgi(harcama.taksitNo ?? 0, harcama.taksitToplam ?? 0, paraYaz(harcama.tutarKurus, true))}\n${t['detay.taksit_uyari']}`}
                />
              </>
            ) : null}

            <View style={{ height: rhythm.section }} />
            <Txt role="label" tone={color.text2}>
              {t['ekle.kategori.etiket']}
            </Txt>
            <View style={{ height: rhythm.group }} />
            <ClayPressable
              onPress={() => setKategoriSecimAcik(true)}
              accessibilityLabel="Kategoriyi değiştir"
              borderRadius={radius.tile}
              style={stil.secimOzeti}>
              <View style={[stil.nokta, { backgroundColor: aileRenkleri(kat.aile).solid }]} />
              <View style={{ width: rhythm.blockInCard }} />
              <Txt role="body" style={stil.esnek}>
                {kat.ad}
              </Txt>
              <View style={{ width: rhythm.blockInCard }} />
              <Icon name="chevron-down" size={20} color={color.text2} />
            </ClayPressable>

            <View style={{ height: rhythm.section }} />
            <Txt role="label" tone={color.text2}>
              {t['ekle.odeme.etiket']}
            </Txt>
            <View style={{ height: rhythm.group }} />
            <SegmentedControl
              secenekler={[
                { value: 'nakit' as OdemeTipi, label: t['ekle.odeme.nakit'], icon: 'banknote' },
                { value: 'kart' as OdemeTipi, label: t['ekle.odeme.kart'], icon: 'credit-card' },
              ]}
              deger={odeme}
              onChange={setOdeme}
            />

            <View style={{ height: rhythm.section }} />
            <TextField
              label={t['detay.not.etiket']}
              value={notMetni}
              onChangeText={setNotMetni}
              placeholder={t['ekle.not.placeholder']}
              maxLength={60}
            />

            <View style={{ height: rhythm.section }} />
            <Txt role="caption" tone={color.text2}>
              {eklenmeEtiketi(harcama.zaman)}
            </Txt>
            <View style={{ height: rhythm.section }} />

            {yazmaHata ? (
              <>
                <Txt role="caption" tone={color.dangerInk}>
                  {yazmaHata}
                </Txt>
                <View style={{ height: rhythm.group }} />
              </>
            ) : null}

            {taksitli ? (
              <>
                <Button
                  label={t['eylem.kaydet']}
                  variant="primary"
                  disabled={kaydetDisabled}
                  loading={kaydediliyor}
                  onPress={kaydet}
                />
                <View style={{ height: rhythm.group }} />
                <Button
                  label={t['detay.sil_taksit']}
                  variant="ghost"
                  icon="trash"
                  accessibilityLabel={t['detay.sil_taksit']}
                  onPress={() => setSilDialogAcik(true)}
                />
              </>
            ) : (
              <View style={stil.altSatir}>
                <Button
                  label={t['eylem.sil']}
                  variant="ghost"
                  icon="trash"
                  auto
                  accessibilityLabel={t['detay.sil']}
                  onPress={silTekHarcama}
                />
                <View style={{ width: rhythm.group }} />
                <View style={stil.esnek}>
                  <Button
                    label={t['eylem.kaydet']}
                    variant="primary"
                    disabled={kaydetDisabled}
                    loading={kaydediliyor}
                    onPress={kaydet}
                  />
                </View>
              </View>
            )}
          </>
        ) : null}
      </ScrollView>


      <CategoryGridSheet
        visible={kategoriSecimAcik}
        value={kategoriKodu}
        onSelect={(k) => {
          setKategoriKodu(k);
          setKategoriSecimAcik(false);
        }}
        onClose={() => setKategoriSecimAcik(false)}
      />

      {harcama ? (
        <Dialog
          visible={silDialogAcik}
          baslik={t['sil.baslik']}
          govde={silGovdeTaksit(seriKalan)}
          ozet={<ExpenseRow harcama={harcama} limitDisi={false} />}
          silEtiketi={t['sil.onayla']}
          vazgecEtiketi={t['sil.vazgec']}
          siliniyor={silSiliniyor}
          onSil={silTaksitSerisi}
          onVazgec={() => setSilDialogAcik(false)}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

function DetaySkeleton() {
  return (
    <View>
      <Skeleton width="100%" height={88} borderRadius={radius.tile} />
      <View style={{ height: rhythm.section }} />
      <Skeleton width={140} height={18} />
      <View style={{ height: rhythm.group }} />
      <Skeleton width="100%" height={56} borderRadius={radius.tile} />
      <View style={{ height: rhythm.section }} />
      <Skeleton width={140} height={18} />
      <View style={{ height: rhythm.group }} />
      <Skeleton width="100%" height={44} borderRadius={radius.pill} />
    </View>
  );
}

const stil = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: color.bg },
  kaydir: { flex: 1 },
  pad: { paddingHorizontal: layout.screenPaddingX },
  tutamacSatiri: { alignItems: 'center', paddingTop: rhythm.group },
  tutamac: { width: 44, height: 4, borderRadius: radius.pill, backgroundColor: color.line },
  basSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: rhythm.group,
  },
  bulunamadiSarmal: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: layout.screenPaddingX },
  hataDaire: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: color.groove,
    boxShadow: clay.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ortaMetin: { textAlign: 'center' },
  tutarKuyusu: { padding: rhythm.pad },
  aralikSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tutarSatiri: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  secimOzeti: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: size.input,
    paddingHorizontal: rhythm.pad,
  },
  nokta: { width: 8, height: 8, borderRadius: radius.pill },
  esnek: { flex: 1, minWidth: 0 },
  altSatir: { flexDirection: 'row', alignItems: 'center' },
  // §3.1 sabit alt blok üst boşluğu 8 — E-11 ile aynı desen (tutar düzenleme klavyesi)
  altSabit: { paddingTop: rhythm.group, backgroundColor: color.bg },
});
