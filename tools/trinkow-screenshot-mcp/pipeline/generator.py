import json
import multiprocessing
import os
import time
from PIL import Image

from pipeline.compositor import (
    LOGO_PATH,
    render_hero_showcase,
    render_landscape_card,
    render_portrait_card,
)

RAW_BASE = "/Users/mustafa/.gemini/antigravity/brain/7572fe9d-c67b-4d19-8172-1ff3280cddb3/scratch/raw_by_lang"
CONFIG_DIR = "/Users/mustafa/Desktop/cod/trinkow-mobile/tools/trinkow-screenshot-mcp/config"
OUT_BASE_DOCS = "/Users/mustafa/Documents/Trinkow Assets/store-localized-packages"
OUT_BASE_PROJECT = "/Users/mustafa/Desktop/cod/trinkow-mobile/assets/store/localized"


def load_configs():
    with open(os.path.join(CONFIG_DIR, "copy_matrix.json"), "r", encoding="utf-8") as f:
        copy_matrix = json.load(f)
    with open(os.path.join(CONFIG_DIR, "devices.json"), "r", encoding="utf-8") as f:
        devices = json.load(f)
    return copy_matrix, devices


def render_single_task(task: dict):
    kind = task["kind"]
    out_path = task["out_path"]
    w = task["w"]
    h = task["h"]

    if os.path.exists(out_path):
        return out_path

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    if kind == "hero":
        logo = Image.open(LOGO_PATH).convert("RGBA")
        scr_center = Image.open(task["center_path"]).convert("RGBA")
        scr_left = Image.open(task["left_path"]).convert("RGBA")
        scr_right = Image.open(task["right_path"]).convert("RGBA")

        img = render_hero_showcase(
            w=w,
            h=h,
            logo=logo,
            scr_center=scr_center,
            scr_left=scr_left,
            scr_right=scr_right,
            headline_lines=task["headline_lines"],
            subtitle_lines=task["subtitle_lines"],
            bullets=task["bullets"],
            tagline=task["tagline"],
        )
        img.save(out_path, format="PNG", optimize=True)

    elif kind == "portrait":
        scr_raw = Image.open(task["raw_path"]).convert("RGBA")
        scr_pair = Image.open(task["pair_path"]).convert("RGBA")
        img = render_portrait_card(
            raw_img=scr_raw,
            pair_img=scr_pair,
            w=w,
            h=h,
            meta=task["meta"],
            layout_type=task["layout_type"],
        )
        img.save(out_path, format="PNG", optimize=True)

    elif kind == "landscape":
        logo = Image.open(LOGO_PATH).convert("RGBA")
        scr_raw = Image.open(task["raw_path"]).convert("RGBA")
        scr_pair = Image.open(task["pair_path"]).convert("RGBA")
        img = render_landscape_card(
            raw_img=scr_raw,
            pair_img=scr_pair,
            logo=logo,
            w=w,
            h=h,
            meta=task["meta"],
        )
        img.save(out_path, format="PNG", optimize=True)

    return out_path


def build_tasks_for_lang(lang_code: str, copy_matrix: dict, devices: dict, out_root: str) -> list[dict]:
    lang_info = copy_matrix[lang_code]
    lang_raw_dir = os.path.join(RAW_BASE, lang_code)
    tasks = []

    # 1. Header Assets: 5244x2950, 3840x1646
    for dev in devices["header"]:
        w, h, name = dev["width"], dev["height"], dev["name"]
        folder = os.path.join(out_root, lang_code, "01-Header-Assets", name)
        for h_meta in lang_info["heroes"][:2]:
            slug = h_meta["slug"]
            tasks.append({
                "kind": "hero",
                "out_path": os.path.join(folder, f"{slug}_{w}x{h}.png"),
                "w": w,
                "h": h,
                "center_path": os.path.join(lang_raw_dir, h_meta["center_raw"]),
                "left_path": os.path.join(lang_raw_dir, h_meta["left_raw"]),
                "right_path": os.path.join(lang_raw_dir, h_meta["right_raw"]),
                "headline_lines": h_meta["headline_lines"],
                "subtitle_lines": h_meta["subtitle_lines"],
                "bullets": h_meta["bullets"],
                "tagline": lang_info["tagline"],
            })

    # 2. Search Result Assets: 5244x2950, 3840x2560, 1920x1280
    for dev in devices["search"]:
        w, h, name = dev["width"], dev["height"], dev["name"]
        folder = os.path.join(out_root, lang_code, "02-Search-Result-Assets", name)
        for h_meta in lang_info["heroes"]:
            slug = h_meta["slug"]
            tasks.append({
                "kind": "hero",
                "out_path": os.path.join(folder, f"{slug}_{w}x{h}.png"),
                "w": w,
                "h": h,
                "center_path": os.path.join(lang_raw_dir, h_meta["center_raw"]),
                "left_path": os.path.join(lang_raw_dir, h_meta["left_raw"]),
                "right_path": os.path.join(lang_raw_dir, h_meta["right_raw"]),
                "headline_lines": h_meta["headline_lines"],
                "subtitle_lines": h_meta["subtitle_lines"],
                "bullets": h_meta["bullets"],
                "tagline": lang_info["tagline"],
            })

    # Device specs map
    device_groups = [
        ("03-iPhone-6.1-ve-6.3-Island", devices["iphone_island"]),
        ("04-iPad-12.9-ve-13", devices["ipad_pro"]),
        ("05-iPhone-Duo", devices["iphone_duo"]),
    ]

    for group_name, group_spec in device_groups:
        all_specs = group_spec.get("previews", []) + group_spec.get("screenshots", [])
        for dev in all_specs:
            w, h, name = dev["width"], dev["height"], dev["name"]
            orientation = dev["orientation"]
            layout = dev["layout"]
            folder = os.path.join(out_root, lang_code, group_name, name)

            for s_meta in lang_info["screens"]:
                slug = s_meta["slug"]
                if orientation == "portrait":
                    tasks.append({
                        "kind": "portrait",
                        "out_path": os.path.join(folder, f"{slug}_{w}x{h}.png"),
                        "w": w,
                        "h": h,
                        "raw_path": os.path.join(lang_raw_dir, s_meta["raw"]),
                        "pair_path": os.path.join(lang_raw_dir, s_meta["pair_raw"]),
                        "meta": s_meta,
                        "layout_type": layout,
                    })
                else:  # landscape
                    tasks.append({
                        "kind": "landscape",
                        "out_path": os.path.join(folder, f"{slug}_{w}x{h}.png"),
                        "w": w,
                        "h": h,
                        "raw_path": os.path.join(lang_raw_dir, s_meta["raw"]),
                        "pair_path": os.path.join(lang_raw_dir, s_meta["pair_raw"]),
                        "meta": s_meta,
                    })

    return tasks


def run_batch_generation(target_langs: list[str] = None, out_root: str = OUT_BASE_DOCS, max_workers: int = None):
    copy_matrix, devices = load_configs()
    if target_langs is None:
        target_langs = list(copy_matrix.keys())

    all_tasks = []
    for lang in target_langs:
        all_tasks.extend(build_tasks_for_lang(lang, copy_matrix, devices, out_root))

    workers = max_workers or min(multiprocessing.cpu_count(), 10)
    print(f"Starting batch generation: {len(all_tasks)} tasks across {len(target_langs)} languages on {workers} workers.")

    t0 = time.time()
    with multiprocessing.Pool(workers) as pool:
        for idx, _ in enumerate(pool.imap_unordered(render_single_task, all_tasks, chunksize=4), 1):
            if idx % 50 == 0 or idx == len(all_tasks):
                print(f"  [{idx}/{len(all_tasks)}] assets generated... ({time.time() - t0:.1f}s)")

    print(f"Finished generating {len(all_tasks)} assets in {time.time() - t0:.1f}s.")
    return len(all_tasks)


if __name__ == "__main__":
    import sys
    langs = sys.argv[1].split(",") if len(sys.argv) > 1 else None
    run_batch_generation(target_langs=langs)

