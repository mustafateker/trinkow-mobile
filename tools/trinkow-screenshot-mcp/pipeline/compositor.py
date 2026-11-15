import math
import os
import time
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT_EXTRABOLD = "/Users/mustafa/Desktop/cod/trinkow-mobile/node_modules/@expo-google-fonts/plus-jakarta-sans/800ExtraBold/PlusJakartaSans_800ExtraBold.ttf"
FONT_BOLD = "/Users/mustafa/Desktop/cod/trinkow-mobile/node_modules/@expo-google-fonts/plus-jakarta-sans/700Bold/PlusJakartaSans_700Bold.ttf"
FONT_MEDIUM = "/Users/mustafa/Desktop/cod/trinkow-mobile/node_modules/@expo-google-fonts/plus-jakarta-sans/500Medium/PlusJakartaSans_500Medium.ttf"
LOGO_PATH = "/Users/mustafa/Desktop/cod/trinkow-mobile/assets/images/trinkow-app-icon.png"

_BG_CACHE = {}


def create_rich_bg(w: int, h: int, glow_cx_ratio: float = 0.55, glow_cy_ratio: float = 0.55) -> Image.Image:
    key = (w, h, round(glow_cx_ratio, 2), round(glow_cy_ratio, 2))
    if key in _BG_CACHE:
        return _BG_CACHE[key].copy()

    base = Image.new("RGBA", (w, h), (7, 10, 26, 255))
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)

    cx = int(w * glow_cx_ratio)
    cy = int(h * glow_cy_ratio)
    radius_x = int(w * 0.44)
    radius_y = int(h * 0.42)

    draw.ellipse([cx - radius_x, cy - radius_y, cx + radius_x, cy + radius_y], fill=(30, 58, 168, 160))
    draw.ellipse(
        [cx - int(radius_x * 0.55), cy - int(radius_y * 0.55), cx + int(radius_x * 0.55), cy + int(radius_y * 0.55)],
        fill=(54, 214, 231, 80),
    )

    down_w = max(64, w // 8)
    down_h = max(64, h // 8)
    glow_small = glow.resize((down_w, down_h), Image.Resampling.BILINEAR)
    glow_small = glow_small.filter(ImageFilter.GaussianBlur(radius=max(12, int(w * 0.012))))
    glow_blurred = glow_small.resize((w, h), Image.Resampling.BICUBIC)

    base.alpha_composite(glow_blurred, (0, 0))
    _BG_CACHE[key] = base
    return base.copy()


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size[0], size[1]], radius=radius, fill=255)
    return mask


def fit_and_wrap(
    text: str,
    font_path: str,
    initial_size: int,
    max_width: int,
    max_lines: int,
    draw: ImageDraw.ImageDraw,
) -> tuple[ImageFont.FreeTypeFont, list[str]]:
    size = initial_size
    min_size = max(14, int(initial_size * 0.68))

    raw_paragraphs = text.split("\n")

    while size >= min_size:
        font = ImageFont.truetype(font_path, size)
        all_lines = []
        overflow = False

        for para in raw_paragraphs:
            words = para.split()
            current_line = []
            for w in words:
                test_line = " ".join(current_line + [w])
                bbox = draw.textbbox((0, 0), test_line, font=font)
                if bbox[2] - bbox[0] <= max_width:
                    current_line.append(w)
                else:
                    if current_line:
                        all_lines.append(" ".join(current_line))
                        current_line = [w]
                        wb = draw.textbbox((0, 0), w, font=font)
                        if wb[2] - wb[0] > max_width:
                            overflow = True
                            break
                    else:
                        overflow = True
                        break
            if current_line:
                all_lines.append(" ".join(current_line))
            if overflow:
                break

        if not overflow and len(all_lines) <= max_lines:
            return font, all_lines
        size -= 2

    font = ImageFont.truetype(font_path, size)
    return font, all_lines


def render_framed_phone(raw_img: Image.Image, phone_w: int, angle: float = 0.0) -> Image.Image:
    raw_aspect = raw_img.height / raw_img.width
    phone_h = int(phone_w * raw_aspect)
    bezel = max(6, int(phone_w * 0.022))
    outer_w = phone_w + bezel * 2
    outer_h = phone_h + bezel * 2
    corner_r = int(phone_w * 0.115)
    outer_r = corner_r + bezel

    pad = int(outer_w * 0.10)
    card = Image.new("RGBA", (outer_w + pad * 2, outer_h + pad * 2), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(card)
    sdraw.rounded_rectangle(
        [pad - 4, pad + int(bezel * 1.2), pad + outer_w + 4, pad + outer_h + int(bezel * 2.0)],
        radius=outer_r,
        fill=(2, 6, 26, 185),
    )
    card = card.filter(ImageFilter.GaussianBlur(radius=max(6, int(phone_w * 0.03))))

    fdraw = ImageDraw.Draw(card)
    fdraw.rounded_rectangle(
        [pad, pad, pad + outer_w, pad + outer_h],
        radius=outer_r,
        fill=(14, 21, 58, 255),
        outline=(54, 214, 231, 225),
        width=max(2, int(phone_w * 0.006)),
    )

    scr = raw_img.resize((phone_w, phone_h), Image.Resampling.LANCZOS).convert("RGBA")
    mask = rounded_mask((phone_w, phone_h), corner_r)
    card.paste(scr, (pad + bezel, pad + bezel), mask)

    if abs(angle) > 0.1:
        card = card.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    return card


def draw_feature_bullet(
    canvas: Image.Image,
    x: int,
    y: int,
    w: int,
    h: int,
    badge_hex: str,
    badge_symbol: str,
    title: str,
    desc: str,
    scale: float,
) -> Image.Image:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    r = int(20 * scale)
    draw.rounded_rectangle(
        [x, y, x + w, y + h],
        radius=r,
        fill=(24, 42, 118, 185),
        outline=(110, 140, 240, 85),
        width=max(1, int(2 * scale)),
    )

    icon_s = int(h * 0.58)
    icon_x = x + int(18 * scale)
    icon_y = y + (h - icon_s) // 2

    # parse hex
    hex_clean = badge_hex.lstrip("#")
    badge_rgb = tuple(int(hex_clean[i : i + 2], 16) for i in (0, 2, 4))

    draw.rounded_rectangle(
        [icon_x, icon_y, icon_x + icon_s, icon_y + icon_s],
        radius=int(14 * scale),
        fill=(*badge_rgb, 255),
    )
    sym_font = ImageFont.truetype(FONT_EXTRABOLD, int(icon_s * 0.48))
    sb = draw.textbbox((0, 0), badge_symbol, font=sym_font)
    draw.text(
        (icon_x + (icon_s - (sb[2] - sb[0])) // 2, icon_y + (icon_s - (sb[3] - sb[1])) // 2 - sb[1]),
        badge_symbol,
        font=sym_font,
        fill=(255, 255, 255, 255),
    )

    tx = icon_x + icon_s + int(18 * scale)
    max_text_w = w - (tx - x) - int(16 * scale)

    t_font, t_lines = fit_and_wrap(title, FONT_BOLD, int(21 * scale), max_text_w, 1, draw)
    d_font, d_lines = fit_and_wrap(desc, FONT_MEDIUM, int(16 * scale), max_text_w, 1, draw)

    t_str = t_lines[0] if t_lines else title
    d_str = d_lines[0] if d_lines else desc

    tb = draw.textbbox((0, 0), t_str, font=t_font)
    db = draw.textbbox((0, 0), d_str, font=d_font)
    total_th = (tb[3] - tb[1]) + int(6 * scale) + (db[3] - db[1])
    ty = y + (h - total_th) // 2

    draw.text((tx, ty - tb[1]), t_str, font=t_font, fill=(255, 255, 255, 255))
    draw.text((tx, ty + (tb[3] - tb[1]) + int(6 * scale) - db[1]), d_str, font=d_font, fill=(195, 210, 255, 240))

    return Image.alpha_composite(canvas, layer)


def render_hero_showcase(
    w: int,
    h: int,
    logo: Image.Image,
    scr_center: Image.Image,
    scr_left: Image.Image,
    scr_right: Image.Image,
    headline_lines: list[list[str]],
    subtitle_lines: list[str],
    bullets: list[list[str]],
    tagline: str,
) -> Image.Image:
    aspect = w / h
    canvas = create_rich_bg(w, h, glow_cx_ratio=0.68, glow_cy_ratio=0.52)
    draw = ImageDraw.Draw(canvas)

    scale = (h / 1080.0) * (0.86 if aspect < 1.6 else 1.0)
    left_x = int(w * 0.052)
    cursor_y = int(h * 0.075)

    logo_size = int(94 * scale)
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS).convert("RGBA")
    logo_mask = rounded_mask((logo_size, logo_size), int(logo_size * 0.24))

    border_pad = max(2, int(4 * scale))
    draw.rounded_rectangle(
        [left_x - border_pad, cursor_y - border_pad, left_x + logo_size + border_pad, cursor_y + logo_size + border_pad],
        radius=int(logo_size * 0.26),
        fill=(20, 38, 110, 225),
        outline=(110, 150, 255, 140),
        width=max(2, int(2 * scale)),
    )
    canvas.paste(logo_resized, (left_x, cursor_y), logo_mask)

    brand_font = ImageFont.truetype(FONT_EXTRABOLD, int(66 * scale))
    bb = draw.textbbox((0, 0), "Trinkow", font=brand_font)
    draw.text(
        (left_x + logo_size + int(22 * scale), cursor_y + (logo_size - (bb[3] - bb[1])) // 2 - bb[1]),
        "Trinkow",
        font=brand_font,
        fill=(255, 255, 255, 255),
    )

    cursor_y += logo_size + int(24 * scale)

    max_hero_text_w = int(w * 0.46)
    tag_font, tlines = fit_and_wrap(tagline, FONT_BOLD, int(30 * scale), max_hero_text_w, 1, draw)
    ttext = tlines[0] if tlines else tagline
    tb = draw.textbbox((0, 0), ttext, font=tag_font)
    draw.text((left_x, cursor_y - tb[1]), ttext, font=tag_font, fill=(235, 242, 255, 255))
    cursor_y += (tb[3] - tb[1]) + int(12 * scale)
    draw.rounded_rectangle(
        [left_x, cursor_y, left_x + int(145 * scale), cursor_y + max(3, int(5 * scale))],
        radius=max(2, int(3 * scale)),
        fill=(54, 214, 231, 255),
    )

    cursor_y += int(30 * scale)

    h_initial = int(56 * scale)
    for text, col_type in headline_lines:
        col = (54, 214, 231, 255) if col_type == "accent" else (255, 255, 255, 255)
        h_font, hlines = fit_and_wrap(text, FONT_EXTRABOLD, h_initial, max_hero_text_w, 1, draw)
        for hline in hlines:
            hb = draw.textbbox((0, 0), hline, font=h_font)
            draw.text((left_x, cursor_y - hb[1]), hline, font=h_font, fill=col)
            cursor_y += (hb[3] - hb[1]) + int(10 * scale)

    cursor_y += int(16 * scale)

    sub_initial = int(22 * scale)
    for sline in subtitle_lines:
        s_font, slines = fit_and_wrap(sline, FONT_MEDIUM, sub_initial, max_hero_text_w, 2, draw)
        for line in slines:
            sb = draw.textbbox((0, 0), line, font=s_font)
            draw.text((left_x, cursor_y - sb[1]), line, font=s_font, fill=(198, 212, 252, 240))
            cursor_y += (sb[3] - sb[1]) + int(7 * scale)

    cursor_y += int(24 * scale)
    bullet_w = int(w * (0.38 if aspect < 1.65 else 0.35))
    bullet_h = int(72 * scale)
    bullet_gap = int(14 * scale)

    for bhex, bsym, btitle, bdesc in bullets:
        if cursor_y + bullet_h <= h - int(32 * scale):
            canvas = draw_feature_bullet(canvas, left_x, cursor_y, bullet_w, bullet_h, bhex, bsym, btitle, bdesc, scale)
            cursor_y += bullet_h + bullet_gap

    phone_main_w = int(min(h * 0.39, w * 0.22))
    phone_sec_w = int(phone_main_w * 0.89)

    p_right = render_framed_phone(scr_right, phone_sec_w, angle=-5.0)
    p_left = render_framed_phone(scr_left, phone_sec_w, angle=6.0)
    p_center = render_framed_phone(scr_center, phone_main_w, angle=1.5)

    right_cx = int(w * (0.73 if aspect >= 1.65 else 0.72))
    cy = int(h * 0.53)

    canvas.alpha_composite(p_right, (right_cx + int(phone_main_w * 0.42) - p_right.width // 2, cy - p_right.height // 2 + int(24 * scale)))
    canvas.alpha_composite(p_left, (right_cx - int(phone_main_w * 0.52) - p_left.width // 2, cy - p_left.height // 2 + int(32 * scale)))
    canvas.alpha_composite(p_center, (right_cx - p_center.width // 2 - int(16 * scale), cy - p_center.height // 2 - int(10 * scale)))

    return canvas.convert("RGB")


def render_portrait_card(
    raw_img: Image.Image,
    pair_img: Image.Image,
    w: int,
    h: int,
    meta: dict,
    layout_type: str,
) -> Image.Image:
    canvas = create_rich_bg(w, h, glow_cx_ratio=0.5, glow_cy_ratio=0.60)
    draw = ImageDraw.Draw(canvas)

    if layout_type == "iphone_tall":
        scale = w / 1320.0
        pad_x = int(76 * scale)
        top_y = int(92 * scale)
        b_size = int(28 * scale)
        t_size = int(68 * scale)
        s_size = int(33 * scale)
        phone_w = int(w * 0.83)
    elif layout_type == "duo_portrait":
        scale = w / 2007.0
        pad_x = int(110 * scale)
        top_y = int(88 * scale)
        b_size = int(32 * scale)
        t_size = int(82 * scale)
        s_size = int(38 * scale)
        phone_w = int(w * 0.46)
    else:  # ipad_portrait
        scale = w / 2064.0
        pad_x = int(130 * scale)
        top_y = int(84 * scale)
        b_size = int(32 * scale)
        t_size = int(78 * scale)
        s_size = int(37 * scale)
        phone_w = int(w * 0.50)

    cursor_y = top_y
    max_text_w = w - pad_x * 2

    # Badge Pill
    badge_font, b_lines = fit_and_wrap(meta["badge"], FONT_BOLD, b_size, max_text_w, 1, draw)
    b_text = b_lines[0] if b_lines else meta["badge"]
    b_bbox = draw.textbbox((0, 0), b_text, font=badge_font)
    bw = b_bbox[2] - b_bbox[0]
    bh = b_bbox[3] - b_bbox[1]
    pill_px = int(28 * scale)
    pill_py = int(14 * scale)
    pill_w = bw + pill_px * 2
    pill_h = bh + pill_py * 2
    pill_x = (w - pill_w) // 2

    draw.rounded_rectangle(
        [pill_x, cursor_y, pill_x + pill_w, cursor_y + pill_h],
        radius=pill_h // 2,
        fill=(22, 46, 138, 220),
        outline=(54, 214, 231, 150),
        width=max(2, int(2.5 * scale)),
    )
    draw.text((pill_x + pill_px, cursor_y + pill_py - b_bbox[1]), b_text, font=badge_font, fill=(54, 214, 231, 255))
    cursor_y += pill_h + int(28 * scale)

    line_gap = int(12 * scale)

    # Title White
    t_font, w_lines = fit_and_wrap(meta["title_white"], FONT_EXTRABOLD, t_size, max_text_w, 2, draw)
    for line in w_lines:
        lb = draw.textbbox((0, 0), line, font=t_font)
        draw.text(((w - (lb[2] - lb[0])) // 2, cursor_y - lb[1]), line, font=t_font, fill=(255, 255, 255, 255))
        cursor_y += (lb[3] - lb[1]) + line_gap

    # Title Accent
    a_font, a_lines = fit_and_wrap(meta["title_accent"], FONT_EXTRABOLD, t_size, max_text_w, 1, draw)
    for line in a_lines:
        lb = draw.textbbox((0, 0), line, font=a_font)
        draw.text(((w - (lb[2] - lb[0])) // 2, cursor_y - lb[1]), line, font=a_font, fill=(54, 214, 231, 255))
        cursor_y += (lb[3] - lb[1]) + line_gap

    cursor_y += int(12 * scale)

    # Subtitle
    s_font, s_lines = fit_and_wrap(meta["subtitle"], FONT_MEDIUM, s_size, int(max_text_w * 0.94), 2, draw)
    for line in s_lines:
        sb = draw.textbbox((0, 0), line, font=s_font)
        draw.text(((w - (sb[2] - sb[0])) // 2, cursor_y - sb[1]), line, font=s_font, fill=(208, 218, 255, 238))
        cursor_y += (sb[3] - sb[1]) + int(10 * scale)

    phone_top = cursor_y + int(32 * scale)

    if layout_type == "duo_portrait":
        p_back = render_framed_phone(pair_img, int(phone_w * 0.88), angle=5.5)
        p_front = render_framed_phone(raw_img, phone_w, angle=-2.0)
        canvas.alpha_composite(p_back, (int(w * 0.44), phone_top + int(36 * scale)))
        canvas.alpha_composite(p_front, (int(w * 0.08), phone_top - int(10 * scale)))
    else:
        raw_aspect = raw_img.height / raw_img.width
        phone_h = int(phone_w * raw_aspect)
        avail_h = h - phone_top - int(40 * scale)
        if layout_type == "ipad_portrait" and phone_h > avail_h:
            phone_h = avail_h
            phone_w = int(phone_h / raw_aspect)
        p_main = render_framed_phone(raw_img, phone_w, angle=0.0)
        canvas.alpha_composite(p_main, ((w - p_main.width) // 2, phone_top - int(20 * scale)))

    return canvas.convert("RGB")


def render_landscape_card(
    raw_img: Image.Image,
    pair_img: Image.Image,
    logo: Image.Image,
    w: int,
    h: int,
    meta: dict,
) -> Image.Image:
    canvas = create_rich_bg(w, h, glow_cx_ratio=0.70, glow_cy_ratio=0.52)
    draw = ImageDraw.Draw(canvas)

    aspect = w / h
    scale = (h / 1206.0) * (0.86 if aspect < 1.5 else 1.0)
    left_x = int(w * 0.055)
    cy = int(h * 0.12)

    logo_s = int(68 * scale)
    logo_r = logo.resize((logo_s, logo_s), Image.Resampling.LANCZOS).convert("RGBA")
    canvas.paste(logo_r, (left_x, cy), rounded_mask((logo_s, logo_s), int(logo_s * 0.24)))

    b_font = ImageFont.truetype(FONT_EXTRABOLD, int(48 * scale))
    bb = draw.textbbox((0, 0), "Trinkow", font=b_font)
    draw.text(
        (left_x + logo_s + int(18 * scale), cy + (logo_s - (bb[3] - bb[1])) // 2 - bb[1]),
        "Trinkow",
        font=b_font,
        fill=(255, 255, 255, 255),
    )

    cy += logo_s + int(34 * scale)

    # Feature Pill Badge
    max_tw = int(w * 0.44)
    badge_font, blines = fit_and_wrap(meta["badge"], FONT_BOLD, int(24 * scale), max_tw, 1, draw)
    badge_text = blines[0] if blines else meta["badge"]
    pb = draw.textbbox((0, 0), badge_text, font=badge_font)
    pw = (pb[2] - pb[0]) + int(44 * scale)
    ph = (pb[3] - pb[1]) + int(22 * scale)
    draw.rounded_rectangle(
        [left_x, cy, left_x + pw, cy + ph],
        radius=ph // 2,
        fill=(22, 46, 138, 220),
        outline=(54, 214, 231, 150),
        width=max(2, int(2 * scale)),
    )
    draw.text((left_x + int(22 * scale), cy + int(11 * scale) - pb[1]), badge_text, font=badge_font, fill=(54, 214, 231, 255))
    cy += ph + int(28 * scale)

    # Title White
    t_font, wlines = fit_and_wrap(meta["title_white"], FONT_EXTRABOLD, int(62 * scale), max_tw, 2, draw)
    for line in wlines:
        lb = draw.textbbox((0, 0), line, font=t_font)
        draw.text((left_x, cy - lb[1]), line, font=t_font, fill=(255, 255, 255, 255))
        cy += (lb[3] - lb[1]) + int(10 * scale)

    # Title Accent
    a_font, alines = fit_and_wrap(meta["title_accent"], FONT_EXTRABOLD, int(62 * scale), max_tw, 1, draw)
    for line in alines:
        lb = draw.textbbox((0, 0), line, font=a_font)
        draw.text((left_x, cy - lb[1]), line, font=a_font, fill=(54, 214, 231, 255))
        cy += (lb[3] - lb[1]) + int(10 * scale)

    cy += int(16 * scale)

    # Subtitle
    s_font, slines = fit_and_wrap(meta["subtitle"], FONT_MEDIUM, int(28 * scale), max_tw, 2, draw)
    for line in slines:
        sb = draw.textbbox((0, 0), line, font=s_font)
        draw.text((left_x, cy - sb[1]), line, font=s_font, fill=(205, 218, 255, 240))
        cy += (sb[3] - sb[1]) + int(8 * scale)

    phone_main_w = int(min(h * 0.43, w * 0.23))
    phone_sec_w = int(phone_main_w * 0.88)

    p_back = render_framed_phone(pair_img, phone_sec_w, angle=6.0)
    p_front = render_framed_phone(raw_img, phone_main_w, angle=-2.0)

    rcx = int(w * 0.73)
    rcy = int(h * 0.52)
    canvas.alpha_composite(p_back, (rcx + int(phone_main_w * 0.34) - p_back.width // 2, rcy - p_back.height // 2 + int(24 * scale)))
    canvas.alpha_composite(p_front, (rcx - int(phone_main_w * 0.28) - p_front.width // 2, rcy - p_front.height // 2 - int(8 * scale)))

    return canvas.convert("RGB")
