"""
End-to-end test for the Tubhyam AI Try-On service.

Usage:
    venv\\Scripts\\python.exe test_tryon.py

Checks:
  1. Health endpoint
  2. AI model generation (garment -> AI model wearing it) with a real
     product image from the website's public folder.
"""

import sys
import time
import io

import requests
from PIL import Image

BASE = "http://localhost:8000"
PRODUCT_IMAGE = r"..\public\images\products\brown-cordset-1.jpg"


def check(name, ok, detail=""):
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {name}" + (f" - {detail}" if detail else ""))
    return ok


def main():
    print("=" * 60)
    print("Tubhyam AI Try-On - end-to-end test")
    print("=" * 60)

    # 1. Health
    try:
        r = requests.get(f"{BASE}/api/try-on/health", timeout=10)
        data = r.json()
        check("health endpoint", r.ok and data.get("status") == "healthy",
              f"device={data.get('device')}")
    except Exception as e:
        check("health endpoint", False, str(e))
        print("Is the service running? -> start.bat")
        sys.exit(1)

    # 2. Load a real product image
    try:
        with open(PRODUCT_IMAGE, "rb") as f:
            garment_bytes = f.read()
        img = Image.open(io.BytesIO(garment_bytes))
        check("product image loaded", True, f"{img.size[0]}x{img.size[1]}")
    except Exception as e:
        check("product image loaded", False, str(e))
        sys.exit(1)

    # 3. AI model generation (first call also loads the model - slow)
    print("\nGenerating AI model (first call loads the model, can take 2-5 min)...")
    t0 = time.time()
    try:
        r = requests.post(
            f"{BASE}/api/try-on/ai-model",
            files={"garment_image": ("garment.jpg", garment_bytes, "image/jpeg")},
            data={"body_type": "average", "skin_tone": "medium"},
            timeout=600,
        )
        elapsed = time.time() - t0
        if r.ok and r.headers.get("content-type", "").startswith("image/"):
            out = Image.open(io.BytesIO(r.content))
            out.save("test_result_ai_model.png")
            check("ai-model generation", True,
                  f"{out.size[0]}x{out.size[1]} in {elapsed:.0f}s -> test_result_ai_model.png")
        else:
            check("ai-model generation", False,
                  f"HTTP {r.status_code}: {r.text[:200]} (after {elapsed:.0f}s)")
    except Exception as e:
        check("ai-model generation", False, f"{e} (after {time.time() - t0:.0f}s)")

    print("\nDone.")


if __name__ == "__main__":
    # Windows console: avoid UnicodeEncodeError with non-ASCII markers
    sys.stdout.reconfigure(encoding="utf-8", errors="replace") if hasattr(sys.stdout, "reconfigure") else None
    main()
