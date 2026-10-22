import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
  type ExpoSpeechRecognitionErrorCode,
} from 'expo-speech-recognition';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ClaySurface } from '@/components/ClaySurface';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { localeKodu } from '@/lib/yerellestirme';
import { sesliHarcamaAyristir, type SesliHarcamaTaslagi } from '@/lib/sesliHarcama';
import { color, radius, rhythm } from '@/theme/tokens';

type Durum = 'hazir' | 'izin' | 'dinliyor' | 'isleniyor' | 'sonuc' | 'hata';

function hataMetni(kod: ExpoSpeechRecognitionErrorCode): string {
  if (kod === 'not-allowed') return t['ekle.sesli.izin_yok'];
  if (kod === 'no-speech' || kod === 'speech-timeout') return t['ekle.sesli.ses_yok'];
  if (kod === 'service-not-allowed' || kod === 'language-not-supported') return t['ekle.sesli.kullanilamiyor'];
  return t['ekle.sesli.hata'];
}

export function VoiceExpenseInput({
  baslatTetik,
  onTaslak,
}: {
  baslatTetik: number;
  onTaslak: (taslak: SesliHarcamaTaslagi) => void;
}) {
  const [durum, setDurum] = useState<Durum>('hazir');
  const [metin, setMetin] = useState('');
  const [mesaj, setMesaj] = useState('');
  const sonTetik = useRef(0);
  const finalGeldi = useRef(false);

  useSpeechRecognitionEvent('start', () => {
    setDurum('dinliyor');
    setMesaj('');
  });
  useSpeechRecognitionEvent('result', (olay) => {
    const transcript = olay.results[0]?.transcript?.trim() ?? '';
    if (transcript) setMetin(transcript);
    if (!olay.isFinal || !transcript) return;
    finalGeldi.current = true;
    const taslak = sesliHarcamaAyristir(transcript);
    onTaslak(taslak);
    setDurum('sonuc');
    setMesaj(taslak.tutarKurus === null ? t['ekle.sesli.tutar_yok'] : t['ekle.sesli.hazir']);
  });
  useSpeechRecognitionEvent('error', (olay) => {
    if (olay.error === 'aborted') return;
    setDurum('hata');
    setMesaj(hataMetni(olay.error));
  });
  useSpeechRecognitionEvent('end', () => {
    if (!finalGeldi.current) {
      setDurum((mevcut) => mevcut === 'hata' ? mevcut : 'hazir');
    }
  });

  const baslat = useCallback(async () => {
    try {
      if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
        setDurum('hata');
        setMesaj(t['ekle.sesli.kullanilamiyor']);
        return;
      }
      setDurum('izin');
      setMesaj('');
      setMetin('');
      finalGeldi.current = false;
      const izin = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!izin.granted) {
        setDurum('hata');
        setMesaj(t['ekle.sesli.izin_yok']);
        return;
      }
      ExpoSpeechRecognitionModule.start({
        lang: localeKodu(),
        interimResults: true,
        continuous: false,
        maxAlternatives: 1,
        contextualStrings: ['lira', 'TL', 'nakit', 'kart', 'taksit', 'market', 'kahve', 'yemek', 'ulaşım'],
      });
    } catch {
      setDurum('hata');
      setMesaj(t['ekle.sesli.hata']);
    }
  }, []);

  useEffect(() => {
    if (baslatTetik <= 0 || baslatTetik === sonTetik.current) return;
    sonTetik.current = baslatTetik;
    const zamanlayici = setTimeout(() => void baslat(), 350);
    return () => clearTimeout(zamanlayici);
  }, [baslat, baslatTetik]);

  useEffect(() => () => {
    try {
      ExpoSpeechRecognitionModule.abort();
    } catch {
      // Native tanıyıcı zaten durmuşsa ek işlem gerekmez.
    }
  }, []);

  const dinliyor = durum === 'dinliyor' || durum === 'isleniyor';
  const butonEtiketi =
    durum === 'izin' || durum === 'isleniyor'
      ? t['ekle.sesli.isleniyor']
      : durum === 'dinliyor'
        ? t['ekle.sesli.durdur']
        : t['ekle.sesli.baslat'];

  function eylem() {
    if (durum === 'dinliyor') {
      setDurum('isleniyor');
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    void baslat();
  }

  return (
    <ClaySurface level="sunken" borderRadius={radius.card} style={stil.kart} accessibilityLiveRegion="polite">
      <View style={stil.baslikSatiri}>
        <View style={stil.ikonDisk}>
          <Icon name="mic" size={22} color={durum === 'dinliyor' ? color.action : color.primary} />
        </View>
        <View style={stil.esnek}>
          <Txt role="bodyStrong">{durum === 'dinliyor' ? t['ekle.sesli.dinliyor'] : t['ekle.sesli.baslik']}</Txt>
          <View style={{ height: rhythm.sameObject }} />
          <Txt role="caption" tone={color.text2}>{metin || t['ekle.sesli.aciklama']}</Txt>
        </View>
      </View>
      {mesaj ? (
        <>
          <View style={{ height: rhythm.group }} />
          <Txt role="caption" tone={durum === 'hata' ? color.dangerInk : color.text2}>{mesaj}</Txt>
        </>
      ) : null}
      <View style={{ height: rhythm.blockInCard }} />
      <Button
        variant={dinliyor ? 'primary' : 'secondary'}
        label={butonEtiketi}
        icon="mic"
        loading={durum === 'izin' || durum === 'isleniyor'}
        loadingLabel={t['ekle.sesli.isleniyor']}
        accessibilityLabel={t['a11y.ekle.sesli']}
        onPress={eylem}
      />
    </ClaySurface>
  );
}

const stil = StyleSheet.create({
  kart: { padding: rhythm.pad },
  baslikSatiri: { flexDirection: 'row', alignItems: 'center' },
  ikonDisk: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: rhythm.blockInCard,
  },
  esnek: { flex: 1, minWidth: 0 },
});
