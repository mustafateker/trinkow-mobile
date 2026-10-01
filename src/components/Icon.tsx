import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { icon } from '@/theme/tokens';

/**
 * §9 — tek ikon seti: Lucide. Çizgi kalınlığı 2.0, dolgulu ikon yok.
 *
 * `lucide-react-native` onaylı bağımlılık listesinde olmadığı için Lucide
 * yol verileri prototipten (../agency/projects/trinkow/docs/design/prototip-v3/01-bugun.html) BİREBİR
 * alınıp `react-native-svg` ile çizilir. 24×24 viewBox korunur.
 */
type Sekil =
  | { t: 'p'; d: string }
  | { t: 'c'; cx: number; cy: number; r: number }
  | { t: 'r'; x: number; y: number; w: number; h: number; rx: number };

const p = (d: string): Sekil => ({ t: 'p', d });

export const icons = {
  /** ekran başlığı — limitleri aç */
  limitler: [
    p('M21 4h-7'),
    p('M10 4H3'),
    p('M21 12h-9'),
    p('M8 12H3'),
    p('M21 20h-5'),
    p('M12 20H3'),
    p('M14 2v4'),
    p('M8 10v4'),
    p('M16 18v4'),
  ],
  plus: [p('M5 12h14'), p('M12 5v14')],
  x: [p('M18 6 6 18'), p('m6 6 12 12')],
  info: [{ t: 'c', cx: 12, cy: 12, r: 10 } as Sekil, p('M12 16v-4'), p('M12 8h.01')],
  /** sekme: Bugün */
  gauge: [p('m12 14 4-4'), p('M3.3 19a10 10 0 1 1 17.3 0')],
  /** sekme: Kayıtlar */
  notebook: [
    p('M2 6h4'),
    p('M2 10h4'),
    p('M2 14h4'),
    p('M2 18h4'),
    { t: 'r', x: 4, y: 2, w: 16, h: 20, rx: 2 } as Sekil,
    p('M9.5 8h5'),
    p('M9.5 12H16'),
    p('M9.5 16H14'),
  ],
  /** sekme: Özet */
  chart: [p('M18 20V10'), p('M12 20V4'), p('M6 20v-6')],
  /** sekme: Profil */
  user: [
    { t: 'c', cx: 12, cy: 8, r: 4 } as Sekil,
    p('M4 22a8 8 0 0 1 16 0'),
  ],

  // --- kategori ikonları (§1.4) ---
  'shopping-basket': [
    p('m15 11-1 9'),
    p('m19 11-4-7'),
    p('M2 11h20'),
    p('m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4'),
    p('M4.5 15.5h15'),
    p('m5 11 4-7'),
    p('m9 11 1 9'),
  ],
  coffee: [
    p('M10 2v2'),
    p('M14 2v2'),
    p('M6 2v2'),
    p('M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1'),
  ],
  bus: [
    p('M8 6v6'),
    p('M15 6v6'),
    p('M2 12h19.6'),
    p(
      'M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3',
    ),
    { t: 'c', cx: 7, cy: 18, r: 2 } as Sekil,
    p('M9 18h5'),
    { t: 'c', cx: 16, cy: 18, r: 2 } as Sekil,
  ],
  utensils: [p('M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2'), p('M7 2v20'), p('M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7')],
  'receipt-text': [
    p('M4 2v20a1 1 0 0 0 1.5.9l2-1.2a1 1 0 0 1 1 0l2.5 1.4a1 1 0 0 0 1 0l2.5-1.4a1 1 0 0 1 1 0l2 1.2A1 1 0 0 0 20 22V2a1 1 0 0 0-1.5-.9l-2 1.2a1 1 0 0 1-1 0L13 .9a1 1 0 0 0-1 0L9.5 2.3a1 1 0 0 1-1 0l-2-1.2A1 1 0 0 0 4 2'),
    p('M8 12h8'),
    p('M8 7h6'),
  ],
  pill: [
    p('m10.5 20.5 10-10a5 5 0 1 0-7-7l-10 10a5 5 0 1 0 7 7Z'),
    p('m8.5 8.5 7 7'),
  ],
  fuel: [
    p('M3 22h12'),
    p('M4 9h10'),
    p('M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18'),
    p('M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.8a2 2 0 0 0-.6-1.4L18 5'),
  ],
  house: [
    p('M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'),
    p('M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'),
  ],
  repeat: [
    p('m17 2 4 4-4 4'),
    p('M3 11v-1a4 4 0 0 1 4-4h14'),
    p('m7 22-4-4 4-4'),
    p('M21 13v1a4 4 0 0 1-4 4H3'),
  ],
  ticket: [
    p('M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z'),
    p('M13 5v2'),
    p('M13 11v2'),
    p('M13 17v2'),
  ],
  shirt: [
    p(
      'M20.4 3.5 16 2a4 4 0 0 1-8 0L3.6 3.5a2 2 0 0 0-1.3 2.2l.6 3.5a1 1 0 0 0 1 .8H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.1a1 1 0 0 0 1-.8l.6-3.5a2 2 0 0 0-1.3-2.2z',
    ),
  ],
  footprints: [
    p('M4 16v-2.4C4 11.5 3 10.5 3 8c0-2.7 1.5-6 4.5-6C9.4 2 10 3.8 10 5.5c0 3.1-2 5.7-2 8.7V16a2 2 0 1 1-4 0Z'),
    p('M20 20v-2.4c0-2.1 1-3.1 1-5.6 0-2.7-1.5-6-4.5-6C14.6 6 14 7.8 14 9.5c0 3.1 2 5.7 2 8.7V20a2 2 0 1 0 4 0Z'),
    p('M16 17h4'),
    p('M4 13h4'),
  ],
  'circle-dashed': [
    p('M10.1 2.2a10 10 0 0 1 3.8 0'),
    p('M17.6 3.7a10 10 0 0 1 2.7 2.7'),
    p('M21.8 10.1a10 10 0 0 1 0 3.8'),
    p('M20.3 17.6a10 10 0 0 1-2.7 2.7'),
    p('M13.9 21.8a10 10 0 0 1-3.8 0'),
    p('M6.4 20.3a10 10 0 0 1-2.7-2.7'),
    p('M2.2 13.9a10 10 0 0 1 0-3.8'),
    p('M3.7 6.4a10 10 0 0 1 2.7-2.7'),
  ],
  'chevron-down': [p('m6 9 6 6 6-6')],
  'chevron-left': [p('m15 18-6-6 6-6')],
  'chevron-right': [p('m9 18 6-6-6-6')],
  trash: [
    p('M3 6h18'),
    p('M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'),
    p('M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'),
    p('M10 11v6'),
    p('M14 11v6'),
  ],
  banknote: [
    { t: 'r', x: 2, y: 6, w: 20, h: 12, rx: 3 } as Sekil,
    { t: 'c', cx: 12, cy: 12, r: 2 } as Sekil,
    p('M6 12h.01M18 12h.01'),
  ],
  'credit-card': [
    { t: 'r', x: 2, y: 5, w: 20, h: 14, rx: 3 } as Sekil,
    p('M2 10h20'),
  ],
  calendar: [
    p('M8 2v4'),
    p('M16 2v4'),
    { t: 'r', x: 3, y: 4, w: 18, h: 18, rx: 2 } as Sekil,
    p('M3 10h18'),
    p('M8 14h.01'),
    p('M12 14h.01'),
    p('M16 14h.01'),
    p('M8 18h.01'),
    p('M12 18h.01'),
  ],
  'refresh-cw': [
    p('M3 12a9 9 0 0 1 9-9 9.8 9.8 0 0 1 6.7 2.7L21 8'),
    p('M21 3v5h-5'),
    p('M21 12a9 9 0 0 1-9 9 9.8 9.8 0 0 1-6.7-2.7L3 16'),
    p('M3 21v-5h5'),
  ],
  'list-x': [p('M11 5h10'), p('M11 12h10'), p('M11 19h4'), p('m3 5 4 4'), p('m7 5-4 4')],
  /** kil tuş takımı silme tuşu (§7.11) — backspace şekli, çöp kutusu DEĞİL */
  delete: [p('M21 5H9l-7 7 7 7h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z'), p('m15 9-6 6'), p('m9 9 6 6')],
  /** E-17 `ValueWell` düzenle ikonu (prototip: kuyu-btn sağ ucu) */
  pencil: [
    p('M21.2 4.8a2.7 2.7 0 0 0-3.9 0L4 18v3h3L20.3 8.7a2.7 2.7 0 0 0 .9-3.9Z'),
    p('m15 5 4 4'),
  ],
  /** E-18 boş durum ikonu — taksitli işlem yok */
  'calendar-clock': [
    p('M16 2v4'),
    p('M8 2v4'),
    p('M3 10h5'),
    p('M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6'),
    { t: 'c', cx: 17.5, cy: 17.5, r: 4.5 } as Sekil,
    p('M17.5 15.5v2.2l1.5 1'),
  ],
  /** E-16 "En çok harcadığın kategori" satırı */
  'trending-up': [p('M22 17 13.5 8.5 8.5 13.5 2 7'), p('M16 17h6v-6')],
  /** E-17 "Limiti kaldır" ghost buton ikonu (çukur satırın altı) */
  'limit-kaldir': [{ t: 'c', cx: 12, cy: 12, r: 10 } as Sekil, p('m4.9 4.9 14.2 14.2')],
  /** v4 E-10/E-21 — "seriye sayıldı" şeridi + "Harcamasız işaretle" butonu */
  check: [p('M20 6 9 17l-5-5')],
  /** v4 E-10 — "seriye sayılmadı" uyarı şeridi (aynı geometri: `limit-kaldir`) */
  'alert-circle': [{ t: 'c', cx: 12, cy: 12, r: 10 } as Sekil, p('m4.9 4.9 14.2 14.2')],
  /** F-18 E-11 arama alanı ikonu */
  search: [{ t: 'c', cx: 11, cy: 11, r: 8 } as Sekil, p('m21 21-4.3-4.3')],
  /** D-2d-3a E-01 niyet — "Param nereye gidiyor" (Takip) */
  target: [
    { t: 'c', cx: 12, cy: 12, r: 10 } as Sekil,
    { t: 'c', cx: 12, cy: 12, r: 6 } as Sekil,
    { t: 'c', cx: 12, cy: 12, r: 2 } as Sekil,
  ],
  /** D-2d-3a E-01 niyet — "Bütçe yaratmak" (Tasarruf) */
  landmark: [
    p('M3 22h18'),
    p('M6 18v-7'),
    p('M10 18v-7'),
    p('M14 18v-7'),
    p('M18 18v-7'),
    p('M12 2 21 7H3Z'),
  ],
  /** D-2c-1 E-19 — "Bildirim izni kapalı" bilgi şeridi */
  bell: [
    p('M10.3 21a1.9 1.9 0 0 0 3.4 0'),
    p('M4 17h16a2 2 0 0 1-2-2V9a6 6 0 1 0-12 0v6a2 2 0 0 1-2 2Z'),
  ],
  /** D-2c-1 E-19 — Hesap bölümü "Çıkış yap" */
  'log-out': [
    p('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'),
    p('m16 17 5-5-5-5'),
    p('M21 12H9'),
  ],
  /** D-2c-2 · E-22/E-23 — şifre alanı görünürlük düğmesi (Lucide "eye"). */
  eye: [
    p('M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0'),
    { t: 'c', cx: 12, cy: 12, r: 3 } as Sekil,
  ],
  /** D-2c-2 · E-22/E-23 — şifre gizli (Lucide "eye-off"). */
  'eye-off': [
    p('M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68'),
    p('M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61'),
    p('M14.12 14.12a3 3 0 1 1-4.24-4.24'),
    p('m2 2 20 20'),
  ],
  /** D-2c-2 · E-22 — bağlantı hatası şeridi (Lucide "wifi-off"). */
  'wifi-off': [
    p('M12 20h.01'),
    p('M8.5 16.42a5 5 0 0 1 7 0'),
    p('M5 12.86a10 10 0 0 1 5.2-2.7'),
    p('M19 12.86a10 10 0 0 0-3.6-2.4'),
    p('M2 8.82a16 16 0 0 1 4.6-2.9'),
    p('M22 8.82a16 16 0 0 0-10.7-4.1'),
    p('m2 2 20 20'),
  ],
  /** D-2c-2 · E-22 — "Bağlantıyı gönderdik" kartı (Lucide "mail-check"). */
  'mail-check': [
    p('M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8'),
    p('m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'),
    p('m16 19 2 2 4-4'),
  ],
  /** D-2c-1b K-072 — E-16 başlığı, Ayarlar'a giriş (Lucide "settings"). */
  ayarlar: [
    p(
      'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    ),
    { t: 'c', cx: 12, cy: 12, r: 3 } as Sekil,
  ],
} as const;

export type IconName = keyof typeof icons;

type Props = {
  name: IconName;
  /** §9 — yalnız 20 / 24 / 28. Ara boyut yok. */
  size: 20 | 22 | 24 | 28 | 32;
  color: string;
  strokeWidth?: number;
};

export function Icon({ name, size, color: renk, strokeWidth = icon.strokeWidth }: Props) {
  const sekiller = icons[name] as readonly Sekil[];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" pointerEvents="none">
      {sekiller.map((s, i) => {
        if (s.t === 'p') {
          return (
            <Path
              key={i}
              d={s.d}
              fill="none"
              stroke={renk}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        }
        if (s.t === 'c') {
          return (
            <Circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="none"
              stroke={renk}
              strokeWidth={strokeWidth}
            />
          );
        }
        return (
          <Rect
            key={i}
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            rx={s.rx}
            fill="none"
            stroke={renk}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        );
      })}
    </Svg>
  );
}
