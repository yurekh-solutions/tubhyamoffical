"""
Size x Skin-tone matrix batch generator for the Tubhyam Style Studio.

Generates one AI try-on photo per product x size x skin-tone and saves it as

    public/images/tryon/{productId}__{skin}-{size}.jpg

which is EXACTLY the filename the frontend cascade resolves first
(src/data/tryonResolver.ts -> getTryOnImageCandidates). Files produced here
light up in the Style Studio automatically - no code change needed.

The local service is extended with a `size` form param so the generated body
actually changes per UI size (XXS..5XL) and per skin token
(fair/medium/wheatish/dusky/deep - the same tokens as the mannequin plates).

RESUMABLE: existing output files are skipped, so the run can be stopped and
restarted at any time (e.g. overnight for the full catalog).

Usage:
    venv\\Scripts\\python.exe batch_matrix.py --products fp-001
    venv\\Scripts\\python.exe batch_matrix.py --products fp-001,jn-003 --skins medium --sizes m,l,xl
    venv\\Scripts\\python.exe batch_matrix.py                       # full catalog (long!)
"""

import argparse
import hashlib
import io
import re
import sys
import time
from pathlib import Path

import requests
from PIL import Image

BASE = "http://localhost:8000"
PRODUCTS_FILE = Path(r"..\src\data\products.ts")
IMAGES_DIR = Path(r"..\public\images\products")
OUT_DIR = Path(r"..\public\images\tryon")

# Same tokens as the mannequin plates (public/images/models/{skin}-{size}.jpg)
ALL_SKINS = ["fair", "medium", "wheatish", "dusky", "deep"]
ALL_SIZES = ["xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl", "4xl", "5xl"]

# Top fraction of the generated image removed so the composition is a
# neck-down crop (no face visible) - matches the FACELESS asset standard.
NECK_CROP_FRACTION = 0.24


def load_products():
    """Parse product ids + flat catalog image paths from products.ts."""
    content = PRODUCTS_FILE.read_text(encoding="utf-8")
    products = []
    pattern = r'\{\s*id:\s*["\']([^"\']+)["\'].*?image:\s*["\']([^"\']+)["\']'
    for match in re.finditer(pattern, content, re.DOTALL):
        pid, image_path = match.groups()
        if pid != "test-001":
            products.append({"id": pid, "image": image_path})
    return products


def combo_seed(pid: str, skin: str, size: str) -> int:
    """Deterministic per-combo seed so re-runs reproduce the same image."""
    digest = hashlib.md5(f"{pid}__{skin}-{size}".encode()).hexdigest()
    return int(digest[:8], 16)


def crop_neck_down(img: Image.Image) -> Image.Image:
    w, h = img.size
    return img.crop((0, int(h * NECK_CROP_FRACTION), w, h))


def generate_one(pid: str, image_path: str, skin: str, size: str, retries: int = 1):
    """Call the local service for one combo. Returns the cropped PIL image or None."""
    garment_full = IMAGES_DIR.parent.parent / image_path.lstrip("/")
    if not garment_full.exists():
        print(f"    [SKIP] garment not found: {garment_full}")
        return None

    with open(garment_full, "rb") as f:
        garment_bytes = f.read()

    for attempt in range(retries + 1):
        try:
            r = requests.post(
                f"{BASE}/api/try-on/ai-model",
                files={"garment_image": ("garment.jpg", garment_bytes, "image/jpeg")},
                data={
                    "size": size,
                    "skin_tone": skin,
                    "seed": combo_seed(pid, skin, size),
                },
                timeout=900,
            )
            if r.ok and r.headers.get("content-type", "").startswith("image/"):
                img = Image.open(io.BytesIO(r.content)).convert("RGB")
                return crop_neck_down(img)
            print(f"    [FAIL] HTTP {r.status_code}: {r.text[:120]}")
        except Exception as e:
            print(f"    [ERROR] {type(e).__name__}: {e}")
        if attempt < retries:
            print("    [RETRY]")
            time.sleep(5)
    return None


def wait_for_service():
    print("Waiting for AI service...")
    while True:
        try:
            r = requests.get(f"{BASE}/api/try-on/health", timeout=30)
            if r.ok:
                print(f"[OK] Service ready (device={r.json().get('device')})")
                return
        except Exception:
            pass
        print("[..] not up yet, retrying in 10s")
        time.sleep(10)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--products", default="", help="comma separated product ids (default: all)")
    parser.add_argument("--skins", default=",".join(ALL_SKINS))
    parser.add_argument("--sizes", default=",".join(ALL_SIZES))
    args = parser.parse_args()

    skins = [s.strip() for s in args.skins.split(",") if s.strip()]
    sizes = [s.strip() for s in args.sizes.split(",") if s.strip()]

    products = load_products()
    if args.products:
        wanted = {p.strip() for p in args.products.split(",") if p.strip()}
        products = [p for p in products if p["id"] in wanted]

    combos = [(p, s, z) for p in products for s in skins for z in sizes]
    total = len(combos)
    print("=" * 70)
    print(f"Tubhyam Size x Tone Matrix Generator: {len(products)} products x "
          f"{len(skins)} skins x {len(sizes)} sizes = {total} images")
    print("=" * 70)

    wait_for_service()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    done = skipped = failed = 0
    t0 = time.time()
    for i, (product, skin, size) in enumerate(combos, 1):
        out_file = OUT_DIR / f"{product['id']}__{skin}-{size}.jpg"
        if out_file.exists():
            skipped += 1
            continue

        print(f"[{i}/{total}] {product['id']} __ {skin}-{size} ...", end=" ", flush=True)
        img = generate_one(product["id"], product["image"], skin, size)
        if img is not None:
            img.save(out_file, "JPEG", quality=90)
            done += 1
            rate = (time.time() - t0) / max(done + skipped, 1)
            eta_min = rate * (total - i) / 60
            print(f"[OK] ({done} done, ETA {eta_min:.0f} min)")
        else:
            failed += 1
            print("[FAIL]")

    print("=" * 70)
    print(f"DONE: {done} generated, {skipped} skipped (already existed), {failed} failed")
    print("=" * 70)


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
