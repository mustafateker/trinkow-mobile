import json
import os
from PIL import Image

def validate_bundle(root_dir: str) -> dict:
    results = {
        "total_files": 0,
        "valid_files": 0,
        "errors": [],
        "languages": {},
    }

    if not os.path.exists(root_dir):
        results["errors"].append(f"Directory not found: {root_dir}")
        return results

    for lang in sorted(os.listdir(root_dir)):
        lang_path = os.path.join(root_dir, lang)
        if not os.path.isdir(lang_path) or lang.startswith("."):
            continue

        lang_count = 0
        lang_errors = []

        for dirpath, _, filenames in os.walk(lang_path):
            for fname in filenames:
                if not fname.endswith(".png"):
                    continue
                fpath = os.path.join(dirpath, fname)
                results["total_files"] += 1
                lang_count += 1

                try:
                    fsize = os.path.getsize(fpath)
                    if fsize == 0:
                        lang_errors.append(f"Zero byte file: {fpath}")
                        continue
                    if fsize > 10 * 1024 * 1024:
                        lang_errors.append(f"File exceeds 10MB limit ({fsize / (1024*1024):.2f}MB): {fpath}")

                    with Image.open(fpath) as img:
                        w, h = img.size
                        mode = img.mode

                        if mode not in ("RGB", "RGBA"):
                            lang_errors.append(f"Invalid mode {mode}: {fpath}")

                        # check if filename resolution matches image size
                        # e.g., slug_5244x2950.png
                        base_no_ext = os.path.splitext(fname)[0]
                        if "_" in base_no_ext:
                            res_str = base_no_ext.split("_")[-1]
                            if "x" in res_str:
                                try:
                                    exp_w, exp_h = map(int, res_str.split("x"))
                                    if (w, h) != (exp_w, exp_h):
                                        lang_errors.append(f"Dimension mismatch in {fname}: got {w}x{h}, expected {exp_w}x{exp_h}")
                                except ValueError:
                                    pass

                    results["valid_files"] += 1

                except Exception as e:
                    lang_errors.append(f"Corrupt or unreadable image {fpath}: {e}")

        results["languages"][lang] = {
            "count": lang_count,
            "errors": lang_errors,
            "status": "PASS" if not lang_errors else "FAIL",
        }
        results["errors"].extend(lang_errors)

    return results

if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "/Users/mustafa/Documents/Trinkow Assets/store-localized-packages"
    res = validate_bundle(target)
    print(json.dumps(res, indent=2))

