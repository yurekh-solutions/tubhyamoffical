"""
Watches the AI service until the model finishes downloading/loading,
then runs one real generation to confirm end-to-end.

Usage:
    venv\\Scripts\\python.exe wait_and_warmup.py
"""

import sys
import time
import io

import requests
from PIL import Image

BASE = "http://localhost:8000"
PRODUCT_IMAGE = r"..\public\images\products\brown-cordset-1.jpg"


def main():
    print("=" * 60)
    print("Waiting for SD1.5 model to finish downloading/loading...")
    print("=" * 60)

    # 1. Poll until model_loaded flips to true (download + load can take 1h+)
    while True:
        try:
            r = requests.get(f"{BASE}/api/try-on/health", timeout=60)
            if r.ok:
                data = r.json()
                if data.get("model_loaded"):
                    print(f"[OK] model loaded (device={data.get('device')})")
                    break
                print(f"[..] healthy but model not loaded yet "
                      f"(model_loaded={data.get('model_loaded')})")
            else:
                print(f"[..] health returned HTTP {r.status_code}")
        except Exception as e:
            print(f"[..] service busy or starting: {type(e).__name__}")
        time.sleep(30)

    # 2. Warmup generation with a real product image
    try:
        with open(PRODUCT_IMAGE, "rb") as f:
            garment_bytes = f.read()
        img = Image.open(io.BytesIO(garment_bytes))
        print(f"[OK] product image loaded {img.size[0]}x{img.size[1]}")
    except Exception as e:
        print(f"[FAIL] product image: {e}")
        sys.exit(1)

    print("Running warmup generation (30-90s expected)...")
    t0 = time.time()
    try:
        r = requests.post(
            f"{BASE}/api/try-on/ai-model",
            files={"garment_image": ("garment.jpg", garment_bytes, "image/jpeg")},
            data={"body_type": "average", "skin_tone": "medium"},
            timeout=900,
        )
        elapsed = time.time() - t0
        if r.ok and r.headers.get("content-type", "").startswith("image/"):
            out = Image.open(io.BytesIO(r.content))
            out.save("test_result_ai_model.png")
            print(f"[PASS] generation OK: {out.size[0]}x{out.size[1]} "
                  f"in {elapsed:.0f}s -> test_result_ai_model.png")
        else:
            print(f"[FAIL] HTTP {r.status_code}: {r.text[:200]} (after {elapsed:.0f}s)")
    except Exception as e:
        print(f"[FAIL] {e} (after {time.time() - t0:.0f}s)")

    print("\nDone.")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
