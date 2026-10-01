import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Txt } from '@/components/Txt';
import { TabDock, type TabKey } from '@/components/TabBar';
import { t } from '@/content/metinler';
import { color,radius,layout,rhythm } from '@/theme/tokens';
import { paraYaz } from '@/lib/para';
export const money = (n:number|null|undefined) => n == null ? 'Henüz bilinmiyor' : paraYaz(n,true);
export function Card({children}:{children:ReactNode}) { return <View style={s.card}>{children}</View>; }
/**
 * Koyu üst bar altından başlayan, açık ve üst köşesi yuvarlak tek içerik
 * paneli — `RevScreen` (Bütçe, Favoriler, Limitler, Özet, Profil, Rutinlerim,
 * Tasarruf) VE Günlük (`GunlukSayfa`) bu AYNI bileşeni kullanır; şekil tek
 * yerde tanımlı olsun diye ekrana özgü iç boşluk `style` ile eklenir.
 */
export function ContentPanel({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.panelBase, style]}>{children}</View>;
}
/**
 * Tasarım kiti §6.A/§6.B — koyu üst bar + altından başlayan açık, üst köşesi
 * yuvarlak içerik paneli. Tüm `RevScreen` tüketicileri (Bütçe, Favoriler,
 * Limitler, Özet, Profil, Rutinlerim, Tasarruf) bu kabuğu tek noktadan alır.
 */
export function RevScreen({title,children,tab,header,contentGap=24}:{title:string;children:ReactNode;tab?:TabKey;
  /** verilirse varsayılan başlık satırının YERİNE geçer (ekrana özgü başlık düzeni). Verilmezse davranış ÖNCEKİYLE AYNI. */
  header?: ReactNode;
  /** YALNIZ tab-kök ekranlar (Profil/Tasarruf) `0` geçer; diğer ekranlar varsayılan 24 ile değişmeden kalır. */
  contentGap?: 0 | 24;
}) {
  const i=useSafeAreaInsets();
  const [klavyeAcik, setKlavyeAcik] = useState(false);

  useEffect(() => {
    const acildi = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKlavyeAcik(true));
    const kapandi = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKlavyeAcik(false));
    return () => { acildi.remove(); kapandi.remove(); };
  }, []);

  return <View style={s.disKap}>
    <View style={{height:i.top,backgroundColor:color.navDark}} />
    <KeyboardAvoidingView style={[s.screen,{paddingBottom:tab?0:i.bottom}]} behavior={Platform.OS==='ios'?'padding':'height'}>
      <View style={s.koyuBasi}>
        {header ?? <View style={s.header}>
          {tab ? null : <IconButton icon="chevron-left" accessibilityLabel={t['eylem.geri']} tone="#FFFFFF" background={color.navGlassBg} pressedBackground={color.navGlassBgPressed} onPress={()=>router.canGoBack()?router.back():router.replace('/')} />}
          <Txt role="h2" tone="#FFFFFF" style={{flex:1}}>{title}</Txt>
          {tab ? null : <IconButton icon="ayarlar" accessibilityLabel={t['ayar.baslik']} tone="#FFFFFF" background={color.navGlassBg} pressedBackground={color.navGlassBgPressed} onPress={()=>router.push('/ayarlar')}/>}
        </View>}
      </View>
      <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={s.scrollIcerik}>
        <ContentPanel style={{padding:layout.screenPaddingX,paddingBottom:32,gap:contentGap}}>{children}</ContentPanel>
      </ScrollView>
      {tab && !klavyeAcik ? <TabDock active={tab} /> : null}
    </KeyboardAvoidingView>
  </View>;
}
export function useRevLoad<T>(fetcher:()=>Promise<T>) {
  const [data,setDataState]=useState<T|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
  const veriVar = useRef(false);
  const setData = useCallback((value:T|null)=>{ veriVar.current=value!==null; setDataState(value); },[]);
  const reload=useCallback(async()=>{
    // Sekmeye geri dönüldüğünde mevcut içerik korunur; yalnız ilk yükleme
    // tam ekran loading durumuna geçer. Yeni veri sessizce yerine yazılır.
    if(!veriVar.current)setLoading(true);
    setError('');
    try{setData(await fetcher());}
    catch{setError('Bilgiler yüklenemedi. Bağlantını kontrol edip yeniden deneyebilirsin.');}
    finally{setLoading(false);}
  },[fetcher,setData]);
  useFocusEffect(useCallback(()=>{void reload();},[reload]));
  return {data,error,loading,reload,setData};
}
export function LoadState({loading,error,reload}:{loading:boolean;error:string;reload:()=>void}) { return loading?<Txt role="body">Yükleniyor…</Txt>:error?<Card><Txt role="body">{error}</Txt><Button variant="secondary" label="Yeniden dene" onPress={reload}/></Card>:null; }
export const s=StyleSheet.create({
  disKap:{flex:1,backgroundColor:color.bg},
  screen:{flex:1},
  koyuBasi:{backgroundColor:color.navDark,paddingBottom:layout.headerPadBottom},
  header:{flexDirection:'row',alignItems:'center',paddingHorizontal:layout.screenPaddingX,gap:rhythm.group,paddingTop:layout.headerPadTop},
  // Koyu zemin, panelin üst köşe yarıçaplarının Günlük ekranındaki gibi
  // görünmesini sağlar. Tasarruf ve Profil de aynı koyu→açık geçişi alır.
  scroll:{flex:1,minHeight:0,backgroundColor:color.navDark},
  scrollIcerik:{flexGrow:1},
  panelBase:{flex:1,backgroundColor:color.surface,borderTopLeftRadius:radius.hero,borderTopRightRadius:radius.hero,paddingTop:rhythm.section},
  card:{padding:16,borderRadius:radius.tile,backgroundColor:color.surface,borderWidth:1,borderColor:color.line,gap:12},
  row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},
});
