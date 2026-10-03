import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Accordion } from '@/components/Accordion';
import { Button } from '@/components/Button';
import { ClaySurface } from '@/components/ClaySurface';
import { CelebrationOverlay } from '@/components/streak/CelebrationOverlay';
import { Chip } from '@/components/Chip';
import { ErrorState } from '@/components/ErrorState';
import { ExpenseRow } from '@/components/ExpenseRow';
import { IconButton } from '@/components/IconButton';
import { InfoStrip } from '@/components/InfoStrip';
import { Skeleton } from '@/components/Skeleton';
import { Txt } from '@/components/Txt';
import { CategoryQuickAddCard } from '@/components/pano/CategoryQuickAddCard';
import { HeroCard } from '@/components/pano/HeroCard';
import { LimitReviewCard } from '@/components/pano/LimitReviewCard';
import { RoutineQuickSection } from '@/components/pano/RoutineQuickSection';
import { ContentPanel, s as kabukStil } from '@/components/RevScreen';
import {
  altAltinda,
  altDisinda,
  altDoldu,
  gunlukGunKapandi,
  gunlukGunKapandiDisinda,
  gunToplamEtiketi,
  panoLimitsizOzet,
  seriCipA11y,
  seriCipEtiketi,
  t,
} from '@/content/metinler';
import { ayarOku, ayarYaz, sikAlinanlar, type SikAlinan } from '@/db/harcama';
import { gunHarcamasizIsaretle } from '@/db/seri';
import type { SeriDurumu } from '@/db/seri';
import { usePano } from '@/db/usePano';
import { paraYaz } from '@/lib/para';
import { aileRenkleri, kategori as kategoriGetir } from '@/lib/kategoriler';
import { gunAnahtari, gunlukBaslik } from '@/lib/tarih';
import { veriDegisimineAbone, veriDegisti } from '@/lib/veriBus';
import { color, layout, radius, rhythm } from '@/theme/tokens';

/**
 * v4 E-10 Günlük — tek bir gün sayfası. `app/index.tsx`'teki yatay
 * `FlatList` bu bileşeni her gün farkı için ayrı ayrı monte eder; her
 * sayfa kendi verisini `usePano(gunFarki)` ile okur (K-049 sayfalama).
 */
export function GunlukSayfa({
  gunFarki,
  aktifMi,
  seriDurum,
  seriYukleniyor,
  onKutlamaGosterildi,
  onBugunBosDegisti,
  onGunDegistir,
}: {
  gunFarki: number;
  /** Bu sayfa şu an ekranda mı (FlatList'in görünür sayfası) */
  aktifMi: boolean;
  seriDurum: SeriDurumu | null;
  seriYukleniyor: boolean;
  onKutlamaGosterildi: () => void;
  /** Yalnız bugün sayfası çağırır — FAB'ın "boş bugün" CTA'sıyla çakışmaması için. */
  onBugunBosDegisti?: (bos: boolean) => void;
  /** Ok butonları — `FlatList`'i `app/index.tsx`'te kaydırır (route param DEĞİL). */
  onGunDegistir: (delta: number) => void;
}) {
  const db = useSQLiteContext();
  const veri = usePano(gunFarki);
  const bugunMu = gunFarki === 0;
  const bos = veri.harcamalar.length === 0;

  const [tumHareketler, setTumHareketler] = useState(false);
  const [kategorilerAcik, setKategorilerAcik] = useState(false);
  const [sikKullanilanlar, setSikKullanilanlar] = useState<SikAlinan[]>([]);
  const hareketSayisi = veri.harcamalar.length;

  // "Sık kullanılanlar" — yalnız Bugün sayfasında; harcama eklenip silindikçe tazelenir.
  useEffect(() => {
    if (!bugunMu) return;
    let canli = true;
    const yukle = () => {
      void sikAlinanlar(db, 6).then((l) => canli && setSikKullanilanlar(l)).catch(() => {});
    };
    yukle();
    const iptal = veriDegisimineAbone(yukle);
    return () => {
      canli = false;
      iptal();
    };
  }, [db, bugunMu]);

  const [ipucuKapatildi, setIpucuKapatildi] = useState(true);
  useEffect(() => {
    if (!bugunMu) return;
    let canli = true;
    void ayarOku(db, 'gunluk_ipucu_kapatildi').then((v) => {
      if (canli) setIpucuKapatildi(v === '1');
    });
    return () => {
      canli = false;
    };
  }, [db, bugunMu]);

  useEffect(() => {
    if (bugunMu) onBugunBosDegisti?.(bos && !veri.yukleniyor);
  }, [bugunMu, bos, veri.yukleniyor, onBugunBosDegisti]);

  function ipucuKapat() {
    setIpucuKapatildi(true);
    void ayarYaz(db, 'gunluk_ipucu_kapatildi', '1');
  }

  async function harcamasizIsaretle() {
    await gunHarcamasizIsaretle(db, gunAnahtari(veri.tarih));
    veriDegisti();
  }

  /** `kategoriKodu` verilmezse form kategoriyi kendisi tahmin eder. */
  function harcamaEkleyeGit(kategoriKodu?: string) {
    const parcalar: string[] = [];
    if (!bugunMu) parcalar.push(`gunFarki=${gunFarki}`);
    if (kategoriKodu) parcalar.push(`kategori=${kategoriKodu}`);
    router.push((parcalar.length > 0 ? `/harcama-ekle?${parcalar.join('&')}` : '/harcama-ekle') as never);
  }

  function sikKullanilanaGit(k: SikAlinan) {
    router.push(
      `/harcama-ekle?kategori=${k.kategori}&ad=${encodeURIComponent(k.urunAdi)}&tutarKurus=${k.tutarKurus}` as never,
    );
  }

  if (veri.hata) {
    return (
      <View style={stil.sayfa}>
        <View style={stil.koyuBasi}>
          <Baslik gunFarki={gunFarki} tarih={veri.tarih} seriDurum={null} seriYukleniyor={false} />
        </View>
        <ScrollView style={kabukStil.scroll} contentContainerStyle={stil.kaydirIcerik} showsVerticalScrollIndicator={false}>
          <ContentPanel style={stil.pad}>
            <ErrorState onRetry={veri.yenile} />
          </ContentPanel>
        </ScrollView>
      </View>
    );
  }

  if (veri.yukleniyor) {
    return (
      <View style={stil.sayfa}>
        <View style={stil.koyuBasi}>
          <Baslik gunFarki={gunFarki} tarih={veri.tarih} seriDurum={null} seriYukleniyor />
        </View>
        <ScrollView style={kabukStil.scroll} contentContainerStyle={stil.kaydirIcerik} showsVerticalScrollIndicator={false}>
          <ContentPanel>
            <GunlukIskeleti />
          </ContentPanel>
        </ScrollView>
      </View>
    );
  }

  const limitKurus = veri.limitKurus;
  const limitDisi = limitKurus !== null && veri.harcananKurus > limitKurus;
  const doldu = limitKurus !== null && veri.harcananKurus === limitKurus;

  let altMetin: string;
  if (!bugunMu && bos) {
    altMetin = t['gunluk.harcamasiz.govde'];
  } else if (bugunMu) {
    altMetin =
      limitKurus === null
        ? panoLimitsizOzet(veri.harcamalar.length)
        : bos
          ? t['bos.pano.govde']
          : limitDisi
            ? altDisinda(paraYaz(veri.harcananKurus - limitKurus))
            : doldu
              ? altDoldu(paraYaz(veri.harcananKurus))
              : altAltinda(paraYaz(veri.harcananKurus), paraYaz(limitKurus - veri.harcananKurus));
  } else {
    altMetin =
      limitDisi && limitKurus !== null
        ? gunlukGunKapandiDisinda(paraYaz(veri.harcananKurus), paraYaz(veri.harcananKurus - limitKurus))
        : gunlukGunKapandi(veri.harcamalar.length, paraYaz(veri.harcananKurus));
  }

  // Limit dışı gün: hangi satırların limiti aştığını yürüyen toplam söyler
  // (yalnız aşımdan SONRAKİ satırlar işaretlenir, tüm gün değil).
  let yuruyenToplam = 0;
  const satirlar = veri.harcamalar.map((h) => {
    yuruyenToplam += h.tutarKurus;
    return { harcama: h, limitDisi: limitKurus !== null && yuruyenToplam > limitKurus };
  });
  // Tasarım kiti §7.3 — Bugün'de en son 3 hareket; "Tümünü gör" hepsini açar.
  const sonHareketler = [...satirlar].reverse();
  const gorunenHareketler = tumHareketler ? sonHareketler : sonHareketler.slice(0, 3);

  const bugunBos = bugunMu && bos && limitKurus !== null;
  const seriBugunBaslar = bugunBos && seriDurum && !seriDurum.kapali && seriDurum.mevcutSeri === 0;
  const kutlama = aktifMi && bugunMu && seriDurum?.kutlanacakMilestone != null;

  return (
    <View style={stil.sayfa}>
      <View style={stil.koyuBasi}>
        <Baslik gunFarki={gunFarki} tarih={veri.tarih} seriDurum={seriDurum} seriYukleniyor={seriYukleniyor} />
      </View>

      <ScrollView style={kabukStil.scroll} contentContainerStyle={stil.kaydirIcerik} showsVerticalScrollIndicator={false}>
        <ContentPanel>
        <View style={stil.pad}>
          <HeroCard
            gunFarki={gunFarki}
            harcananKurus={veri.harcananKurus}
            limitKurus={limitKurus}
            oncekiPasif={veri.ilkGunMu}
            onOnceki={() => onGunDegistir(-1)}
            onSonraki={() => onGunDegistir(1)}
            altMetin={altMetin}
          />
        </View>

        {/* Tasarım kiti §7.3 — özet, tek coral CTA, hareketler, sık kullanılanlar;
            rutin ve kategori bölümleri bunların ALTINDA açılır kaplardır. */}
        {bugunMu ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <Button label={t['gunluk.harcama_ekle']} variant="primary" icon="plus" onPress={() => harcamaEkleyeGit()} />
            </View>
          </>
        ) : null}

        {seriBugunBaslar ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <InfoStrip variant="info" metin={`${t['gunluk.seri_baslar.baslik']}. ${t['gunluk.seri_baslar.govde']}`} />
            </View>
          </>
        ) : null}

        {bugunMu && ipucuKapatildi === false && !veri.ilkGunMu ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <InfoStrip variant="info" icon="chevron-left" metin={t['gunluk.ipucu']} onKapat={ipucuKapat} kapatEtiketi={t['gunluk.ipucu_kapat']} />
            </View>
          </>
        ) : null}

        {!bugunMu ? (
          <GecmisSeritleri
            veri={veri}
            onHarcamasizIsaretle={() => void harcamasizIsaretle()}
          />
        ) : null}

        {bugunMu && limitDisi && veri.ayAsimi > 5 ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <LimitReviewCard asimSirasi={veri.ayAsimi} />
            </View>
          </>
        ) : null}

        {bugunMu && gorunenHareketler.length > 0 ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={[stil.pad, stil.listeBasligi]}>
              <Txt role="h2">{t['gunluk.hareketler']}</Txt>
              <Txt role="label" tone={color.text2}>
                {gunToplamEtiketi(paraYaz(veri.harcananKurus))}
              </Txt>
            </View>
            <View style={{ height: rhythm.group }} />
            <View style={stil.pad}>
              {gorunenHareketler.map((s, i) => (
                <View key={s.harcama.id}>
                  {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                  <ExpenseRow
                    harcama={s.harcama}
                    limitDisi={s.limitDisi}
                    kaydirilabilir
                    onPress={() => router.push(`/harcama/${s.harcama.id}`)}
                  />
                </View>
              ))}
              {hareketSayisi > 3 ? (
                <>
                  <View style={{ height: rhythm.group }} />
                  <Button
                    label={tumHareketler ? 'Daha az göster' : `${t['gunluk.tumunu_gor']} (${hareketSayisi})`}
                    variant="secondary"
                    auto
                    onPress={() => setTumHareketler((a) => !a)}
                  />
                </>
              ) : null}
            </View>
          </>
        ) : null}

        {bugunMu && sikKullanilanlar.length > 0 ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <Txt role="h2">{t['gunluk.sik_kullanilanlar']}</Txt>
            </View>
            <View style={{ height: rhythm.group }} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={stil.yatayCipler}>
              {sikKullanilanlar.map((k) => {
                const kat = kategoriGetir(k.kategori);
                return (
                  <Chip
                    key={`${k.kategori}:${k.urunAdi}`}
                    ad={k.urunAdi}
                    tutar={paraYaz(k.tutarKurus)}
                    dotColor={aileRenkleri(kat.aile).solid}
                    dotAlways
                    onPress={() => sikKullanilanaGit(k)}
                    accessibilityLabel={`${k.urunAdi}, ${paraYaz(k.tutarKurus)}, ${kat.ad}. Harcama olarak ekle`}
                  />
                );
              })}
            </ScrollView>
          </>
        ) : null}

        <RoutineQuickSection
          gapUstu={rhythm.section}
          tarih={veri.tarih}
          gunAnahtariDeger={gunAnahtari(veri.tarih)}
          bugunMu={bugunMu}
          harcamalar={veri.harcamalar}
        />

        {bugunMu ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={stil.pad}>
              <Accordion
                title={t['gunluk.kategoriler']}
                summary={t['gunluk.kategoriler.ozet']}
                expanded={kategorilerAcik}
                onToggle={() => setKategorilerAcik((a) => !a)}
                accessibilityLabel={`${t['gunluk.kategoriler']}. ${t['gunluk.kategoriler.ozet']}`}>
                <CategoryQuickAddCard
                  harcamalar={veri.harcamalar}
                  onEkle={(kategori) => harcamaEkleyeGit(kategori)}
                  onHarcamaPress={(harcama) => router.push(`/harcama/${harcama.id}`)}
                />
              </Accordion>
            </View>
          </>
        ) : null}

        {!bugunMu && satirlar.length > 0 ? (
          <>
            <View style={{ height: rhythm.section }} />
            <View style={[stil.pad, stil.listeBasligi]}>
              <Txt role="h2">{t['gunluk.liste_baslik.gecmis']}</Txt>
              <Txt role="label" tone={color.text2}>
                {gunToplamEtiketi(paraYaz(veri.harcananKurus))}
              </Txt>
            </View>
            <View style={{ height: rhythm.group }} />
            <View style={stil.pad}>
              {satirlar.map((s, i) => (
                <View key={s.harcama.id}>
                  {i > 0 ? <View style={{ height: rhythm.group }} /> : null}
                  <ExpenseRow
                    harcama={s.harcama}
                    limitDisi={s.limitDisi}
                    kaydirilabilir
                    onPress={() => router.push(`/harcama/${s.harcama.id}`)}
                  />
                </View>
              ))}
            </View>
          </>
        ) : null}
        </ContentPanel>
      </ScrollView>

      {kutlama && seriDurum ? (
        <CelebrationOverlay
          milestone={seriDurum.kutlanacakMilestone!}
          sonrakiDurak={seriDurum.sonrakiDurak}
          onKapat={onKutlamaGosterildi}
        />
      ) : null}
    </View>
  );
}

function Baslik({
  gunFarki,
  tarih,
  seriDurum,
  seriYukleniyor,
}: {
  gunFarki: number;
  tarih: Date;
  seriDurum: SeriDurumu | null;
  seriYukleniyor: boolean;
}) {
  const { h1, ustSatir } = gunlukBaslik(gunFarki, tarih);
  return (
    <View style={stil.ekranBasi}>
      <View style={stil.esnek}>
        <Txt role="caption" tone={color.navMuted}>
          {ustSatir}
        </Txt>
        <Txt role="h2" tone="#FFFFFF" numberOfLines={1}>
          {h1}
        </Txt>
      </View>
      <View style={{ width: rhythm.group }} />
      {seriYukleniyor ? (
        <Skeleton width={104} height={40} />
      ) : seriDurum && !seriDurum.kapali ? (
        <Chip
          ad={seriCipEtiketi(seriDurum.mevcutSeri)}
          onPress={() => router.push('/seri')}
          accessibilityLabel={seriCipA11y(seriDurum.mevcutSeri)}
        />
      ) : null}
      <View style={{ width: rhythm.group }} />
      <IconButton
        icon="calendar"
        accessibilityLabel={t['gunluk.a11y.takvim']}
        tone="#FFFFFF"
        background={color.navGlassBg}
        pressedBackground={color.navGlassBgPressed}
        gloss={false}
        // K-064/2 — Günlük'te bakılan gün bugün değilse Gün seçici'ye taşınır;
        // seçim halkası kaldırıldığı için (K-061) o gün "Açık gün {g} {Ay}"
        // metniyle söylenir (bkz. gun-sec.tsx).
        onPress={() => router.push(`/gun-sec${gunFarki !== 0 ? `?acikGun=${gunFarki}` : ''}` as never)}
      />
    </View>
  );
}

/** Geçmiş sayfa şeritleri — öncelik sırası: sol sınır → harcamasız → seri sonucu. */
function GecmisSeritleri({
  veri,
  onHarcamasizIsaretle,
}: {
  veri: ReturnType<typeof usePano>;
  onHarcamasizIsaretle: () => void;
}) {
  const bos = veri.harcamalar.length === 0;

  if (veri.ilkGunMu) {
    return (
      <>
        <View style={{ height: rhythm.section }} />
        <View style={stil.pad}>
          <InfoStrip variant="info" icon="chevron-left" metin={t['gunluk.sinir.ilk_kayit']} />
        </View>
      </>
    );
  }

  if (bos && veri.limitKurus !== null) {
    if (veri.seri.harcamasizIsaretli) {
      return (
        <>
          <View style={{ height: rhythm.section }} />
          <View style={stil.pad}>
            <InfoStrip variant="info" icon="check" metin={t['gunluk.harcamasiz.isaretli']} />
          </View>
        </>
      );
    }
    return (
      <>
        <View style={{ height: rhythm.section }} />
        <View style={stil.pad}>
          <ClaySurface level="raised" borderRadius={radius.card} style={stil.kartIc}>
            <Txt role="h2">{t['gunluk.harcamasiz.baslik']}</Txt>
            <View style={{ height: rhythm.group }} />
            <Txt role="body">{t['gunluk.harcamasiz.govde']}</Txt>
            <View style={{ height: rhythm.group }} />
            <Txt role="caption" tone={color.text2}>
              {t['gunluk.harcamasiz.ipucu']}
            </Txt>
            <View style={{ height: rhythm.blockInCard }} />
            <Button
              label={t['gunluk.harcamasiz.eylem']}
              variant="secondary"
              icon="check"
              auto
              onPress={onHarcamasizIsaretle}
            />
          </ClaySurface>
        </View>
      </>
    );
  }

  if (veri.seri.seriyeSayildiMi === true) {
    return (
      <>
        <View style={{ height: rhythm.section }} />
        <View style={stil.pad}>
          <InfoStrip variant="info" icon="check" metin={t['gunluk.seriye_sayildi']} />
        </View>
      </>
    );
  }
  if (veri.seri.seriyeSayildiMi === false) {
    return (
      <>
        <View style={{ height: rhythm.section }} />
        <View style={stil.pad}>
          <InfoStrip variant="warning" icon="alert-circle" metin={t['gunluk.seriye_sayilmadi']} />
        </View>
      </>
    );
  }
  return null;
}

/**
 * Yükleniyor — gerçek düzenin ana hatları yerinde durur (kit'in düz kahraman
 * bloğuyla aynı ritim: etiket → büyük tutar → ince çubuk → alt cümle).
 * Başlık (gerçek tarih) ve gün okları `Baslik`'te zaten gerçek kalıyor;
 * yalnız hesaplanan içerik (kahraman blok, kategoriler, liste) iskelete döner.
 */
function GunlukIskeleti() {
  return (
    <View style={stil.pad}>
      <View style={stil.aralik}>
        <Skeleton width={64} height={16} />
        <Skeleton width={64} height={16} />
      </View>
      <View style={{ height: rhythm.group }} />
      <Skeleton width={180} height={40} />
      <View style={{ height: rhythm.blockInCard }} />
      <Skeleton width="100%" height={8} borderRadius={radius.pill} />
      <View style={{ height: rhythm.group }} />
      <Skeleton width={240} height={16} />
      <View style={{ height: rhythm.section }} />
      <ClaySurface level="raised" borderRadius={radius.card} style={stil.kartIc}>
        <Skeleton width={160} height={20} />
        <View style={{ height: rhythm.blockInCard }} />
        <Skeleton width="100%" height={44} borderRadius={16} />
      </ClaySurface>
    </View>
  );
}

const stil = StyleSheet.create({
  sayfa: { flex: 1, backgroundColor: color.navDark },
  kaydirIcerik: { paddingBottom: layout.scrollPadBottom, flexGrow: 1 },
  koyuBasi: { backgroundColor: color.navDark, paddingBottom: layout.headerPadBottom },
  pad: { paddingHorizontal: layout.screenPaddingX },
  ekranBasi: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: layout.headerPadTop,
    paddingHorizontal: layout.screenPaddingX,
  },
  esnek: { flex: 1, minWidth: 0 },
  listeBasligi: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kartIc: { padding: rhythm.pad, alignItems: 'center' },
  aralik: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  ortali: { alignItems: 'center' },
  yatayCipler: { flexDirection: 'row', alignItems: 'center', gap: rhythm.group, paddingHorizontal: layout.screenPaddingX },
});
