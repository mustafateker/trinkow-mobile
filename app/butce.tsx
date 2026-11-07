import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { DayBox } from '@/components/DayBox';
import { MoneyInput } from '@/components/MoneyInput';
import { LoadState, RevScreen, money, useRevLoad } from '@/components/RevScreen';
import { GrupBasligi } from '@/components/SettingRow';
import { Txt } from '@/components/Txt';
import { ValueWell } from '@/components/ValueWell';
import { posthog } from '@/config/posthog';
import { a11yDegerDegistir, a11yObGun, obOzetMaasGunu, t } from '@/content/metinler';
import { gelirKaydet, maasGunuKaydet, profilOku } from '@/db/profil';
import { useDil } from '@/i18n/useDil';
import { kurustanTutarGirisi, tutarGirisindenKurus } from '@/lib/para';
import { budgetBody, budgetGet, budgetPut, type BudgetInput } from '@/lib/revApi';
import { gunIyelikEki } from '@/lib/tarih';
import { veriDegisti } from '@/lib/veriBus';
import { color, radius, rhythm, v4 } from '@/theme/tokens';

type Alan = 'gelir' | 'kira' | 'fatura' | 'ulasim' | 'kredi' | 'hedef' | 'borc';
const alanlar: [Alan, keyof typeof t][] = [
  ['gelir', 'alan.gelir'],
  ['kira', 'alan.kira'],
  ['fatura', 'alan.fatura'],
  ['ulasim', 'alan.ulasim'],
  ['kredi', 'alan.kredi'],
  ['hedef', 'alan.hedef.tasarruf'],
  ['borc', 'alan.borc'],
];

const MAAS_GUNLERI = Array.from({ length: 31 }, (_, i) => i + 1);

export default function Butce() {
  useDil();
  const load = useRevLoad(budgetGet);
  const [fields, setFields] = useState<Record<Alan, string>>({ gelir: '', kira: '', fatura: '', ulasim: '', kredi: '', hedef: '', borc: '' });
  const [maasGunu, setMaasGunu] = useState<number | null>(null);
  const [maasDuzensiz, setMaasDuzensiz] = useState(false);
  const [maasDuzenleAcik, setMaasDuzenleAcik] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void profilOku().then((p) => {
      setMaasGunu(p.maasGunu);
      setMaasDuzensiz(p.maasDuzensiz);
    });
  }, []);

  useEffect(() => {
    const b = load.data?.butce;
    if (!b) return;
    setFields({
      gelir: b.gelir_kurus == null ? '' : kurustanTutarGirisi(b.gelir_kurus),
      borc: b.borc_kurus == null ? '' : kurustanTutarGirisi(b.borc_kurus),
      hedef: kurustanTutarGirisi(b.hedef_birikim_kurus),
      kira: kurustanTutarGirisi(b.sabit_giderler.kira),
      fatura: kurustanTutarGirisi(b.sabit_giderler.fatura),
      ulasim: kurustanTutarGirisi(b.sabit_giderler.ulasim),
      kredi: kurustanTutarGirisi(b.sabit_giderler.kredi),
    });
  }, [load.data]);

  async function maasGunuSec(gun: number) {
    setMaasGunu(gun);
    setMaasDuzensiz(false);
    setMaasDuzenleAcik(false);
    await maasGunuKaydet(gun, false);
    veriDegisti();
  }

  async function maasDuzensizSec() {
    setMaasGunu(null);
    setMaasDuzensiz(true);
    setMaasDuzenleAcik(false);
    await maasGunuKaydet(null, true);
    veriDegisti();
  }

  async function save() {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      const kurusGelir = fields.gelir ? tutarGirisindenKurus(fields.gelir) : null;
      const base = budgetBody(load.data?.butce ?? null);
      const body: BudgetInput = {
        ...base,
        gelir_kurus: kurusGelir,
        borc_kurus: fields.borc ? tutarGirisindenKurus(fields.borc) : null,
        hedef_birikim_kurus: tutarGirisindenKurus(fields.hedef),
        sabit_giderler: {
          kira: tutarGirisindenKurus(fields.kira),
          fatura: tutarGirisindenKurus(fields.fatura),
          ulasim: tutarGirisindenKurus(fields.ulasim),
          kredi: tutarGirisindenKurus(fields.kredi),
        },
      };
      const [result] = await Promise.all([
        budgetPut(body),
        gelirKaydet(kurusGelir),
        maasGunuKaydet(maasDuzensiz ? null : maasGunu, maasDuzensiz),
      ]);
      posthog?.capture('budget_saved', { action: load.data?.butce ? 'updated' : 'created' });
      load.setData(result);
      veriDegisti();
      setMessage(t['ui.budget.updated']);
    } catch {
      setMessage(t['ui.budget.save_failed']);
    } finally {
      setBusy(false);
    }
  }

  const b = load.data?.butce;
  const maasGunuDegeri = maasDuzensiz ? t['ob.maas.duzensiz'] : maasGunu !== null ? obOzetMaasGunu(gunIyelikEki(maasGunu)) : t['tan.girilmedi'];

  return (
    <RevScreen title={t['ui.budget.title']}>
      <LoadState {...load} />
      {load.data && !load.loading && !load.error ? (
        <>
          <Txt role="body">{t['ui.budget.changes_notice']}</Txt>

          <View>
            <GrupBasligi metin={t['ui.budget.income_expenses']} />
            {alanlar.map(([key, label], i) => (
              <View key={key}>
                {i > 0 ? <View style={{ height: rhythm.blockInCard }} /> : null}
                <MoneyInput label={t[label]} value={fields[key]} onChangeText={(value) => setFields((old) => ({ ...old, [key]: value }))} />
              </View>
            ))}
            <View style={{ height: rhythm.blockInCard }} />
            <Txt role="caption">{t['ui.budget.unknown_notice']}</Txt>
          </View>

          <View>
            <GrupBasligi metin={t['ayar.plan.maas_gunu']} />
            <ValueWell
              etiket={t['ayar.plan.maas_gunu']}
              deger={maasGunuDegeri}
              degerSoluk={maasGunu === null && !maasDuzensiz}
              onPress={() => setMaasDuzenleAcik((a) => !a)}
              accessibilityLabel={a11yDegerDegistir(t['ayar.plan.maas_gunu'], maasGunuDegeri)}
            />
            {maasDuzenleAcik ? (
              <View style={stil.maasSecimKutusu}>
                <View style={stil.gunIzgara}>
                  {MAAS_GUNLERI.map((n) => (
                    <View key={n} style={stil.gunHucre}>
                      <DayBox
                        gun={n}
                        selected={maasGunu === n && !maasDuzensiz}
                        onPress={() => void maasGunuSec(n)}
                        accessibilityLabel={a11yObGun(n)}
                      />
                    </View>
                  ))}
                </View>
                <View style={{ height: rhythm.blockInCard }} />
                <Chip
                  ad={t['ob.maas.duzensiz']}
                  selected={maasDuzensiz}
                  onPress={() => void maasDuzensizSec()}
                />
              </View>
            ) : null}
          </View>

          <View>
            <GrupBasligi metin={t['ui.budget.daily_limit']} />
            <Txt role="display">{money(b?.gunluk_limit_kurus)}</Txt>
            {b?.butce_acigi_kurus ? (
              <>
                <View style={{ height: rhythm.sameObject }} />
                <Txt role="body">{t['ui.budget.monthly_shortfall']} {money(b.butce_acigi_kurus)}</Txt>
              </>
            ) : null}
            <View style={{ height: rhythm.sameObject }} />
            <Txt role="caption">{t['ui.budget.distribution_notice']}</Txt>
          </View>

          {message ? (
            <Txt role="body" accessibilityLiveRegion="polite">
              {message}
            </Txt>
          ) : null}

          <View>
            <Button variant="primary" label={b ? t['ui.budget.save'] : t['ui.budget.create']} loading={busy} onPress={() => void save()} />
            <View style={{ height: rhythm.group }} />
            <Button variant="secondary" label={t['ui.budget.limits']} disabled={!b} onPress={() => router.push('/limitler')} />
            <View style={{ height: rhythm.group }} />
            <Button variant="secondary" label={t['ui.settings.routines_title']} onPress={() => router.push('/rutinler')} />
          </View>
        </>
      ) : null}
    </RevScreen>
  );
}

const stil = StyleSheet.create({
  maasSecimKutusu: {
    marginTop: rhythm.group,
    padding: rhythm.pad,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.tile,
  },
  gunIzgara: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -v4.gridGap / 2,
  },
  gunHucre: {
    width: '14.2857%',
    alignItems: 'center',
    marginBottom: v4.gridGap,
  },
});
