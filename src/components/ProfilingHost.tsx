import { usePathname } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ClayPressable } from '@/components/ClayPressable';
import { ProfilingSheet } from '@/components/ProfilingSheet';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import type { TaksitSiklik } from '@/db/profil';
import {
  aktifProfillemeSorusu,
  profillemeBildirimCevapla,
  profillemeReddet,
  profillemeTaksitCevapla,
  profillemeYatirimCevapla,
  SORU_GUNU,
  type ProfillemeSoruId,
} from '@/db/profilleme';
import type { YatirimNiyet } from '@/lib/plan';
import { toastGoster } from '@/lib/toastBus';
import { veriDegisimineAbone, veriDegisti } from '@/lib/veriBus';
import { radius, rhythm } from '@/theme/tokens';

const YATIRIM_SECENEK: { v: YatirimNiyet; etiket: string }[] = [
  { v: 'yapiyorum', etiket: t['tan.yatirim.yapiyorum'] },
  { v: 'dusunuyorum', etiket: t['tan.yatirim.dusunuyorum'] },
  { v: 'ilgilenmiyorum', etiket: t['tan.yatirim.ilgilenmiyorum'] },
];

const TAKSIT_SECENEK: { v: TaksitSiklik; etiket: string }[] = [
  { v: 'sik_sik', etiket: t['prof.taksit.sik_sik'] },
  { v: 'bazen', etiket: t['prof.taksit.bazen'] },
  { v: 'nadiren', etiket: t['prof.taksit.nadiren'] },
];

const BILDIRIM_SECENEK: { v: boolean; etiket: string }[] = [
  { v: true, etiket: t['prof.bildirim.gonder'] },
  { v: false, etiket: t['prof.bildirim.gonderme'] },
];

/**
 * D-2c-1 · E-20'nin global barındırıcısı. `app/index.tsx` (Günlük/E-10)
 * BU TURDA DEĞİŞTİRİLMEDİ — `ToastHost` ile aynı desende kök layout'a
 * eklenip rota `/` (Günlük) ile gate'lenir. `BottomSheet` zaten `Modal`
 * olduğu için altındaki Günlük ekranı dokunulmadan görünür kalır
 * (tokens.md "Pano içinde kart değil, bottom sheet").
 *
 * "Taksit yükü" kartının panoya eklenmesi (metinler.md §22.5 `prof.degisti`)
 * Günlük'ün kendisine dokunmayı gerektirir — bu turun kapsamı dışında
 * bırakıldı; onun yerine aynı metinle bir toast gösterilir (bkz. rapor).
 */
export function ProfilingHost() {
  const db = useSQLiteContext();
  const pathname = usePathname();
  const [soruId, setSoruId] = useState<ProfillemeSoruId | null>(null);

  const kontrolEt = useCallback(() => {
    if (pathname !== '/') {
      setSoruId(null);
      return;
    }
    void aktifProfillemeSorusu(db).then(setSoruId).catch(() => setSoruId(null));
  }, [db, pathname]);

  useEffect(() => {
    kontrolEt();
  }, [kontrolEt]);

  useEffect(() => veriDegisimineAbone(kontrolEt), [kontrolEt]);

  if (!soruId) return null;

  async function reddet(id: ProfillemeSoruId) {
    try {
      await profillemeReddet(db, id);
      setSoruId(null);
    } catch {
      toastGoster({ tur: 'warning', metin: t['hata.okuma.govde'] });
    }
  }

  if (soruId === 'yatirim') {
    return (
      <ProfilingSheet
        visible
        gun={SORU_GUNU.yatirim}
        baslik={t['prof.yatirim']}
        aciklama={t['tan.yatirim.aciklama']}
        bilgiSeridi={`${t['tan.yatirim.sinir']} ${t['tan.yatirim.sinir.alt']}`}
        onReddet={() => void reddet('yatirim')}>
        {YATIRIM_SECENEK.map((s, i) => (
          <SecimKart
            key={s.v}
            ilk={i === 0}
            etiket={s.etiket}
            onPress={async () => {
              await profillemeYatirimCevapla(db, s.v);
              setSoruId(null);
              veriDegisti();
            }}
          />
        ))}
      </ProfilingSheet>
    );
  }

  if (soruId === 'taksit') {
    return (
      <ProfilingSheet
        visible
        gun={SORU_GUNU.taksit}
        baslik={t['prof.taksit']}
        aciklama={t['prof.aciklama']}
        onReddet={() => void reddet('taksit')}>
        {TAKSIT_SECENEK.map((s, i) => (
          <SecimKart
            key={s.v}
            ilk={i === 0}
            etiket={s.etiket}
            onPress={async () => {
              await profillemeTaksitCevapla(db, s.v);
              setSoruId(null);
              // "Taksit yükü" kartının panoya eklenmesi Günlük'e dokunmayı
              // gerektirir (kapsam dışı, bkz. rapor) — karşılığı toast'la söylenir.
              if (s.v === 'sik_sik') toastGoster({ tur: 'info', metin: t['prof.degisti'] });
              veriDegisti();
            }}
          />
        ))}
      </ProfilingSheet>
    );
  }

  return (
    <ProfilingSheet
      visible
      gun={SORU_GUNU.bildirim}
      baslik={t['prof.bildirim']}
      aciklama={t['prof.aciklama']}
      onReddet={() => void reddet('bildirim')}>
      {BILDIRIM_SECENEK.map((s, i) => (
        <SecimKart
          key={String(s.v)}
          ilk={i === 0}
          etiket={s.etiket}
          onPress={async () => {
            await profillemeBildirimCevapla(db, s.v);
            setSoruId(null);
            veriDegisti();
          }}
        />
      ))}
    </ProfilingSheet>
  );
}

/** `.secim-kart` (prototip) — tam genişlik, eşit ağırlıklı seçim satırı. Seçilince ANINDA cevaplanır, ayrı bir "seçili" durumu tutulmaz. */
function SecimKart({ etiket, ilk, onPress }: { etiket: string; ilk?: boolean; onPress: () => void }) {
  return (
    <View style={ilk ? undefined : { marginTop: rhythm.group }}>
      <ClayPressable onPress={() => { void Promise.resolve().then(onPress).catch(() => toastGoster({ tur: 'warning', metin: t['hata.okuma.govde'] })); }} accessibilityLabel={etiket} borderRadius={radius.tile} style={stil.secimSatiri}>
        <Txt role="bodyStrong">{etiket}</Txt>
      </ClayPressable>
    </View>
  );
}

const stil = StyleSheet.create({
  secimSatiri: { width: '100%', padding: rhythm.pad },
});
