import { istek } from '@/lib/api';
import { gunAnahtari } from '@/lib/tarih';
import type { RutinTasarrufu } from '@/lib/rutinTasarruf';
import type { TasarrufDonemi } from '@/lib/tasarrufDonem';
export const bugun = () => gunAnahtari(new Date());
export const yeniId = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const n = Math.floor(Math.random()*16); return (c === 'x' ? n : (n&3)|8).toString(16); });
export type BudgetInput = { gelir_kurus: number|null; sabit_giderler: Record<'kira'|'fatura'|'ulasim'|'kredi',number>; hedef_birikim_kurus:number; borc_kurus:number|null; limit_modu:'otomatik'|'manuel'; manuel_limit_kurus:number|null; kategori_limitleri:Record<string,number> };
export type Budget = BudgetInput & { yururluk_gunu:string; gunluk_limit_kurus:number|null; gunluk_gelir_payi_kurus:number|null; dagitilmamis_kurus:number|null; butce_acigi_kurus:number };
export type BudgetResponse = {gun:string;butce:Budget|null;eski_aylik_kategori_limitleri:unknown[]};
/** `vazgecilen_adet` — sorgulanan `gun` için fiilen vazgeçilen, satın almayla henüz telafi edilmemiş adet (0 = vazgeçme yok/geçersiz kılınmış). Sunucu salt okunur hesaplar. */
export type Routine = {id:string;ad:string;kategori:string;gunluk_adet:number;birim_fiyat_kurus:number;aktif:boolean;yururluk_gunu?:string;vazgecilen_adet:number};
export type Favorite = {id:string;ad:string;kategori:string;tutar_kurus:number;sabitlenmis:boolean;kullanim_sayisi:number};
export type Movement = {id:string;gun:string;tutar_kurus:number;not_metni:string};
export type Savings = {ay?:string;donem_turu?:TasarrufDonemi;referans_gun?:string;baslangic_gun?:string;bitis_gun?:string;takip_baslangic_gunu:string;harcanabilir_kurus:number|null;harcanan_kurus:number;toplam_harcama_kurus:number;kalan_kurus:number|null;hesaplanan_tasarruf_kurus:number|null;kumulatif_tasarruf_kurus:number|null;gercek_birikim_kurus:number;ay_birikim_kurus:number;donem_birikim_kurus?:number;hedef_birikim_kurus:number;rutin_tasarruf_kurus:number;bilinmeyen_gun_sayisi:number;tamamlanan_gun_sayisi:number;kategoriler:{kategori:string;harcanan_kurus:number;rutin_tasarruf_kurus:number}[];rutinler:RutinTasarrufu[];motivasyon:{tur:string;mesaj:string;borc_kurus:number|null;borc_yuzde:number|null}};
const q = () => `bugun=${bugun()}`;
export const budgetGet = () => istek<BudgetResponse>(`/butce?${q()}`,{tokenGerekli:true});
export const budgetPut = (govde:BudgetInput) => istek<BudgetResponse>(`/butce?${q()}`,{tokenGerekli:true,yontem:'PUT',govde});
/** `gun` verilmezse bugünün vazgeçme durumu okunur; geçmiş takipli günde o günün `vazgecilen_adet`'i için `gun` geçilmeli (rev3-gunluk-rutin.md §6). */
export const routinesGet = (gun?:string) => istek<{rutinler:Routine[]}>(`/butce/rutinler?${q()}${gun?`&gun=${gun}`:''}`,{tokenGerekli:true});
/** `PUT .../rutinler/{id}` `vazgecilen_adet` DÖNDÜRMEZ (yalnız liste ucu `GET .../rutinler` hesaplar) — imza bunu yansıtır, tam `Routine` istemez/vermez. */
export const routinePut = (r:Omit<Routine,'vazgecilen_adet'>) => istek<Omit<Routine,'vazgecilen_adet'>>(`/butce/rutinler/${r.id}?${q()}`,{tokenGerekli:true,yontem:'PUT',govde:{ad:r.ad,kategori:r.kategori,gunluk_adet:r.gunluk_adet,birim_fiyat_kurus:r.birim_fiyat_kurus,aktif:r.aktif}});
/** `gun` verilmezse bugün — rev3-gunluk-rutin.md §6: geçmiş takipli günde de aynı uç, yalnız gövdedeki `gun` değişir. */
export const routineSkip = (id:string,adet:number,gun:string=bugun()) => istek(`/butce/rutinler/${id}/vazgecme?${q()}`,{tokenGerekli:true,yontem:'PUT',govde:{gun,adet}});
export const favoritesGet = () => istek<{kalemler:Favorite[]}>(`/butce/sik-kullanilanlar?${q()}`,{tokenGerekli:true});
export const favoritePut = (f:Pick<Favorite,'id'|'ad'|'kategori'|'tutar_kurus'>) => istek<Favorite>(`/butce/sik-kullanilanlar/${f.id}`,{tokenGerekli:true,yontem:'PUT',govde:{ad:f.ad,kategori:f.kategori,tutar_kurus:f.tutar_kurus}});
export const favoriteDelete = (id:string) => istek<void>(`/butce/sik-kullanilanlar/${id}`,{tokenGerekli:true,yontem:'DELETE'});
export const savingsGet = (ay:string) => istek<Savings>(`/tasarruf/ay?ay=${ay}&${q()}`,{tokenGerekli:true});
export const movementsGet = (ay:string) => istek<{hareketler:Movement[];toplam_kurus:number}>(`/tasarruf/birikimler?ay=${ay}`,{tokenGerekli:true});
export const savingsPeriodGet = (tur:TasarrufDonemi,referans:string) => istek<Savings>(`/tasarruf/donem?tur=${tur}&referans=${referans}&${q()}`,{tokenGerekli:true});
export const movementsPeriodGet = (baslangic:string,bitis:string) => istek<{hareketler:Movement[];toplam_kurus:number}>(`/tasarruf/birikimler?baslangic=${baslangic}&bitis=${bitis}`,{tokenGerekli:true});
export const movementPut = (m:Movement) => istek(`/tasarruf/birikimler/${m.id}?${q()}`,{tokenGerekli:true,yontem:'PUT',govde:{gun:m.gun,tutar_kurus:m.tutar_kurus,not_metni:m.not_metni}});
export const movementDelete = (id:string) => istek<void>(`/tasarruf/birikimler/${id}`,{tokenGerekli:true,yontem:'DELETE'});
export const emptyBudget = (): BudgetInput => ({gelir_kurus:null,sabit_giderler:{kira:0,fatura:0,ulasim:0,kredi:0},hedef_birikim_kurus:0,borc_kurus:null,limit_modu:'otomatik',manuel_limit_kurus:null,kategori_limitleri:{}});
export const budgetBody = (b:Budget|null):BudgetInput => b ? ({gelir_kurus:b.gelir_kurus,sabit_giderler:b.sabit_giderler,hedef_birikim_kurus:b.hedef_birikim_kurus,borc_kurus:b.borc_kurus,limit_modu:b.limit_modu,manuel_limit_kurus:b.manuel_limit_kurus,kategori_limitleri:b.kategori_limitleri}) : emptyBudget();
