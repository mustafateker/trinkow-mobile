import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Accordion } from '@/components/Accordion';
import { Button } from '@/components/Button';
import { Icon, type IconName } from '@/components/Icon';
import { InfoStrip } from '@/components/InfoStrip';
import { Skeleton } from '@/components/Skeleton';
import { Spinner } from '@/components/Spinner';
import { Txt } from '@/components/Txt';
import {
  a11yBolumYukleniyor,
  a11yGunlukRutinAldim,
  a11yGunlukRutinAldimGecmis,
  a11yGunlukRutinBolum,
  a11yGunlukRutinBolumGecmis,
  a11yGunlukRutinYaziliyor,
  gunlukRutinToastAldim,
  t,
} from '@/content/metinler';
import { ayarOku, ayarYaz, harcamaEkle, harcamaSil, ODEME_VARSAYILAN, type Harcama } from '@/db/harcama';
import {
  GUNLUK_RUTIN_GORUNEN_LIMIT,
  rutinButonlariKilitli,
  rutinSatirDurumuHesapla,
  rutinSiralamasi,
  type RutinSatirDurumu,
} from '@/lib/gunlukRutin';
import { paraYaz } from '@/lib/para';
import { kisaTarih } from '@/lib/tarih';
import { toastGoster } from '@/lib/toastBus';
import { veriDegisimineAbone, veriDegisti } from '@/lib/veriBus';
import { routinesGet, yeniId, type Routine } from '@/lib/revApi';
import { a11y, clay, color, layout, radius, rhythm, size } from '@/theme/tokens';

/** Bu bölümün cihazda kalıcı açık/kapalı ayarı (§10.2 — `Accordion`'un DEĞİL, ekran sahibinin hafızası). */
const AYAR_ACIK_ANAHTARI = 'gunluk_rutin_bolum_acik';

/**
 * rev3-gunluk-rutin.md — Günlük'ün kategori kartının ALTINA (8pt) inen
 * açılır rutin bölümü. Rutin YÖNETİMİ (ekle/düzenle/sil/adet) `/rutinler`de
 * kalır; burada yalnız günlük hızlı eylem var (§1).
 *
 * Kullanıcı yalnız gerçekleşen rutini `+` ile kaydeder. Kaydedilmeyen adetler
 * kullanıcıdan ek bir onay istenmeden, gün kapandıktan sonra backend tarafından
 * otomatik rutin tasarrufu olarak hesaplanır; bugün henüz tamamlanmadığı için
 * tasarrufa dahil edilmez.
 */
export function RoutineQuickSection({
  gapUstu,
  gapAlti = 0,
  tarih,
  gunAnahtariDeger,
  bugunMu,
  harcamalar,
}: {
  /** Bir önceki bloğa göre üst boşluk (§2.2) — bileşenin İÇİNDE, ki rutin
   * yokken (§5/1) hiçbir iz (boş boşluk dahil) kalmasın. */
  gapUstu: number;
  /** Bölüm gerçekten çizildiğinde sonraki bloğa bırakılacak boşluk. */
  gapAlti?: number;
  tarih: Date;
  gunAnahtariDeger: string;
  bugunMu: boolean;
  harcamalar: Harcama[];
}) {
  const db = useSQLiteContext();

  const [rutinler, setRutinler] = useState<Routine[] | null>(null);
  const [okumaHatasi, setOkumaHatasi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yazmaHatasi, setYazmaHatasi] = useState(false);

  const oku = useCallback(async () => {
    try {
      // Bakılan gün ne ise (bugün ya da geçmiş takipli gün) `vazgecilen_adet`
      // O GÜNE ait gelsin diye `gun` her zaman açıkça geçilir (§6).
      const yanit = await routinesGet(gunAnahtariDeger);
      setRutinler(yanit.rutinler.filter((r) => r.aktif));
      setOkumaHatasi(false);
    } catch {
      setOkumaHatasi(true);
    } finally {
      setYukleniyor(false);
    }
  }, [gunAnahtariDeger]);

  useEffect(() => {
    void oku();
  }, [oku]);
  useEffect(() => veriDegisimineAbone(() => void oku()), [oku]);

  // §3 "Hafıza" — ilk kurulumda açık, sonrasında cihazın son bıraktığı hâl.
  const [acik, setAcik] = useState(true);
  useEffect(() => {
    let canli = true;
    void ayarOku(db, AYAR_ACIK_ANAHTARI).then((v) => {
      if (canli && v !== null) setAcik(v === '1');
    });
    return () => {
      canli = false;
    };
  }, [db]);
  function acikDegistir() {
    setAcik((onceki) => {
      const yeni = !onceki;
      void ayarYaz(db, AYAR_ACIK_ANAHTARI, yeni ? '1' : '0');
      return yeni;
    });
  }

  // Sıralama YALNIZ mount'ta, YALNIZ >5 rutinde çalışır ve sonra donar (B4).
  // ≤5 rutinde hiç dondurulmaz — canlı `/rutinler` sırası her render'da okunur,
  // ki sonradan eklenen bir rutin de görünsün (dondurma yalnız "hangi 5"i
  // seçmenin bedelidir, kullanıcı sırasını taşımanın bedeli değildir).
  const [sabitSira, setSabitSira] = useState<string[] | null>(null);
  useEffect(() => {
    if (sabitSira !== null || rutinler === null || rutinler.length <= GUNLUK_RUTIN_GORUNEN_LIMIT) return;
    const girdi = rutinler.map((r) => ({
      id: r.id,
      isaretliMi: harcamalar.some((h) => h.rutinId === r.id),
      tutarKurus: r.birim_fiyat_kurus * r.gunluk_adet,
    }));
    setSabitSira(rutinSiralamasi(girdi).map((g) => g.id));
    // Yalnız İLK >5 anında donar — `harcamalar`/sonraki `rutinler`
    // değişimleri kasıtlı olarak İZLENMİYOR (satır zıplamasın, B4).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rutinler, sabitSira]);

  const [yaziliyorSet, setYaziliyorSet] = useState<Set<string>>(new Set());

  function harcamaKaydi(rutinId: string): Harcama | undefined {
    return harcamalar.find((h) => h.rutinId === rutinId);
  }

  function alinanAdet(rutinId: string): number {
    return harcamalar
      .filter((h) => h.rutinId === rutinId)
      .reduce((toplam, h) => toplam + (h.adet ?? 1), 0);
  }

  function durum(rutin: Routine): RutinSatirDurumu {
    return rutinSatirDurumuHesapla({
      yaziliyor: yaziliyorSet.has(rutin.id),
      isaretleniyor: false,
      aldiMi: !!harcamaKaydi(rutin.id),
      vazgecilenAdet: 0,
      gunlukAdet: rutin.gunluk_adet,
    });
  }

  async function aldimYaz(rutin: Routine) {
    // Hızlı çift dokunuşta (Pressable `disabled` yeniden render'ı bekler)
    // aynı güne iki yazma isteği atılmasın (§5/6 kilidin GERÇEK karşılığı).
    if (yaziliyorSet.has(rutin.id)) return;
    setYazmaHatasi(false);
    setYaziliyorSet((s) => new Set(s).add(rutin.id));
    try {
      // Her dokunuş bir gerçekleşme ekler. Aynı güne ayrı kayıt yazmak,
      // hızlı işlemi adet sınırından bağımsız ve geri alınabilir tutar.
      const tutarKurus = rutin.birim_fiyat_kurus;
      const id = await harcamaEkle(db, {
        istemciId: yeniId(),
        rutinId: rutin.id,
        adet: 1,
        sabitGiderKodu: null,
        tutarKurus,
        kategori: rutin.kategori,
        urunAdi: rutin.ad,
        zaman: tarih.toISOString(),
        gun: gunAnahtariDeger,
        odeme: ODEME_VARSAYILAN,
        notMetni: null,
        taksitId: null,
        taksitNo: null,
        taksitToplam: null,
      });
      veriDegisti();
      toastGoster({
        tur: 'undoInfo',
        metin: gunlukRutinToastAldim(rutin.ad, paraYaz(tutarKurus)),
        eylemEtiketi: t['gunlukRutin.toast.geriAl'],
        onEylem: async () => {
          await harcamaSil(db, id);
          veriDegisti();
        },
      });
    } catch {
      setYazmaHatasi(true);
    } finally {
      setYaziliyorSet((s) => {
        const n = new Set(s);
        n.delete(rutin.id);
        return n;
      });
    }
  }

  // §5/1 — rutin hiç yoksa bölüm HİÇ ÇİZİLMEZ (yükleniyorken de değil: bu
  // durum yalnız gerçek veri "hiç rutin yok" dediğinde geçerlidir).
  if (!yukleniyor && !okumaHatasi && (rutinler?.length ?? 0) === 0) return null;

  const gun = kisaTarih(tarih);
  const toplam = rutinler?.length ?? 0;
  const hataMi = okumaHatasi || yazmaHatasi;
  const kaydedilen = rutinler?.filter((r) => !!harcamaKaydi(r.id)).length ?? 0;
  const ozet = hataMi ? `${toplam} rutin · yüklenemedi` : `${toplam} rutin · ${kaydedilen} kaydedildi`;

  const baslikA11y = yukleniyor
    ? a11yBolumYukleniyor(t['gunlukRutin.baslik'])
    : bugunMu
      ? a11yGunlukRutinBolum(ozet)
      : a11yGunlukRutinBolumGecmis(gun, ozet);

  const sirali = sabitSira
    ? (sabitSira.map((id) => rutinler?.find((r) => r.id === id)).filter(Boolean) as Routine[])
    : (rutinler ?? []);
  const gorunenler = sirali.slice(0, GUNLUK_RUTIN_GORUNEN_LIMIT);
  const dahaFazlaVar = sirali.length > GUNLUK_RUTIN_GORUNEN_LIMIT;

  return (
    <>
      <View style={{ height: gapUstu }} />
      <View style={stil.pad}>
        <Accordion
          title={t['gunlukRutin.baslik']}
          summary={ozet}
          loadingSummary={yukleniyor}
          trailingOverride={!bugunMu && !yukleniyor ? gun : undefined}
          expanded={acik}
          onToggle={acikDegistir}
          accessibilityLabel={baslikA11y}>
          {yukleniyor ? (
            <RoutineSectionSkeleton />
          ) : okumaHatasi ? (
            <View accessibilityLiveRegion="polite">
              <InfoStrip variant="warning" icon="wifi-off" metin={t['gunlukRutin.hata.isaret']} textTone={color.text} />
            </View>
          ) : (
            <View>
              <Txt role="caption" tone={color.text2}>
                Kaydetmediklerin gün tamamlandığında otomatik tasarruf sayılır.
              </Txt>
              <View style={{ height: rhythm.blockInCard }} />
              {gorunenler.map((rutin, i) => (
                <View key={rutin.id}>
                  {i > 0 ? <View style={{ height: rhythm.blockInCard }} /> : null}
                  <RoutineQuickRow
                    rutin={rutin}
                    alinanAdet={alinanAdet(rutin.id)}
                    durum={durum(rutin)}
                    bugunMu={bugunMu}
                    gun={gun}
                    onAldim={() => void aldimYaz(rutin)}
                  />
                </View>
              ))}
              {dahaFazlaVar ? (
                <>
                  <View style={{ height: rhythm.blockInCard }} />
                  <Button variant="ghost" label={t['gunlukRutin.tumu']} auto onPress={() => router.push('/rutinler')} />
                </>
              ) : null}
              {yazmaHatasi ? (
                <>
                  <View style={{ height: rhythm.blockInCard }} />
                  <View accessibilityLiveRegion="polite">
                    <InfoStrip variant="warning" icon="wifi-off" metin={t['gunlukRutin.hata.isaret']} textTone={color.text} />
                  </View>
                </>
              ) : null}
            </View>
          )}
        </Accordion>
      </View>
      {gapAlti > 0 ? <View style={{ height: gapAlti }} /> : null}
    </>
  );
}

function RoutineQuickRow({
  rutin,
  alinanAdet,
  durum,
  bugunMu,
  gun,
  onAldim,
}: {
  rutin: Routine;
  alinanAdet: number;
  durum: RutinSatirDurumu;
  bugunMu: boolean;
  gun: string;
  onAldim: () => void;
}) {
  const tutarKurus = rutin.birim_fiyat_kurus;
  const tutar = paraYaz(tutarKurus);
  const kilit = rutinButonlariKilitli(durum);

  const aldimEtiket =
    durum === 'aldimYaziliyor'
      ? a11yGunlukRutinYaziliyor(rutin.ad)
      : bugunMu
        ? a11yGunlukRutinAldim(rutin.ad, tutar)
        : a11yGunlukRutinAldimGecmis(rutin.ad, gun, tutar);

  return (
    <View style={stil.satir}>
      <View style={stil.metin}>
        <Txt role="bodyStrong" numberOfLines={1} ellipsizeMode="tail">
          {rutin.ad}
        </Txt>
        {alinanAdet > 0 ? <Txt role="caption" tone={color.text2}>Bugün {alinanAdet} kez</Txt> : null}
      </View>
      <Txt role="amount" numberOfLines={1}>
        {tutar}
      </Txt>
      <View style={{ width: rhythm.blockInCard }} />
      <RoutineActionButton
        icon="plus"
        selected={durum === 'aldi'}
        disabled={kilit.aldim}
        loading={durum === 'aldimYaziliyor'}
        accessibilityLabel={aldimEtiket}
        onPress={onAldim}
      />
    </View>
  );
}

/**
 * 44×44 hızlı rutin kayıt düğmesi (kit §6.E). Aynı rutin gün içinde birden
 * fazla gerçekleşebildiği için başarılı kayıttan sonra da kullanılabilir.
 */
function RoutineActionButton({
  icon,
  selected,
  disabled,
  loading,
  accessibilityLabel,
  onPress,
}: {
  icon: IconName;
  selected: boolean;
  disabled: boolean;
  loading: boolean;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const kilitli = disabled || loading;
  // Öncelik SEÇİLİ > pasif > idle. `+` seçili görünse de kilitlenmez;
  // sonraki dokunuş aynı rutinin bugünkü adedini artırır.
  const oncelSecili = selected || loading;
  const pasifGorunum = disabled && !oncelSecili;
  const seciliDolu = color.primary;
  const seciliBasili = color.primaryDeep;
  const bosZemin = color.primarySoft;
  const bosIkon = color.primaryText;

  return (
    <Pressable
      onPress={onPress}
      disabled={kilitli}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, disabled: kilitli }}
      style={({ pressed }) => [
        stil.eylem,
        {
          backgroundColor: oncelSecili
            ? pressed && !loading
              ? seciliBasili
              : seciliDolu
            : pasifGorunum
              ? color.disabledBg
              : pressed
                ? color.groove
                : bosZemin,
          boxShadow: oncelSecili
            ? pressed && !loading
              ? clay.actionPressed
              : clay.raised
            : pasifGorunum
              ? clay.sunken
              : pressed
                ? clay.pressed
                : clay.sunken,
        },
      ]}>
      {loading ? <Spinner size={size.iconSm} varyant="light" /> : <Icon name={icon} size={size.iconSm} color={oncelSecili ? color.onPrimary : pasifGorunum ? color.text2 : bosIkon} />}
    </Pressable>
  );
}

function RoutineSectionSkeleton() {
  return (
    <View>
      {[0, 1].map((i) => (
        <View key={i}>
          {i > 0 ? <View style={{ height: rhythm.blockInCard }} /> : null}
          <View style={stil.satir}>
            <View style={stil.metin}>
              <Skeleton width={120} height={16} />
            </View>
            <Skeleton width={56} height={24} />
            <View style={{ width: rhythm.blockInCard }} />
            <Skeleton width={a11y.minTarget} height={a11y.minTarget} borderRadius={radius.tile} />
          </View>
        </View>
      ))}
    </View>
  );
}

const stil = StyleSheet.create({
  pad: { paddingHorizontal: layout.screenPaddingX },
  satir: { minHeight: 46, flexDirection: 'row', alignItems: 'center' },
  metin: { flex: 1, minWidth: 0 },
  eylem: {
    width: a11y.minTarget,
    height: a11y.minTarget,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
