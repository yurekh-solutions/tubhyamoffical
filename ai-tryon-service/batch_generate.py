"""
Batch AI photo generator for all Tubhyam products.

Generates AI model photos for every product × every body type,
saves them to /public/images/products/, and updates products.ts.

Usage:
    venv\\Scripts\\python.exe batch_generate.py [--resume] [--new-only]

Options:
    --resume      Continue from where the last run stopped
    --new-only    Only generate for products without any tryOnBodyVariants
"""

import sys
import os
import time
import io
import json
import re
from pathlib import Path

import requests
from PIL import Image

BASE = "http://localhost:8000"
PRODUCTS_FILE = Path(r"..\src\data\products.ts")
IMAGES_DIR = Path(r"..\public\images\products")
PROGRESS_FILE = Path("batch_progress.json")

BODY_TYPES = ['slim', 'average', 'plus-size']
SKIN_TONE = 'medium'  # Default skin tone for batch generation


def load_products():
    """Parse products from products.ts (simple regex extraction)."""
    content = PRODUCTS_FILE.read_text(encoding='utf-8')
    
    # Extract product IDs and image paths
    products = []
    pattern = r'\{\s*id:\s*["\']([^"\']+)["\'].*?image:\s*["\']([^"\']+)["\']'
    for match in re.finditer(pattern, content, re.DOTALL):
        product_id, image_path = match.groups()
        if product_id != 'test-001':
            products.append({
                'id': product_id,
                'image': image_path,
            })
    
    return products


def load_progress():
    """Load saved progress from previous run."""
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text())
    return {'completed': [], 'failed': []}


def save_progress(progress):
    """Save current progress."""
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2))


def generate_ai_photo(product_id, image_path, body_type, skin_tone=SKIN_TONE, retries=2):
    """Generate one AI model photo. Returns the image bytes or None on failure."""
    # image_path is a public URL like /images/products/xyz.jpg
    # Resolve it relative to the public folder (IMAGES_DIR.parent.parent == ../public)
    image_full_path = IMAGES_DIR.parent.parent / image_path.lstrip('/')
    
    if not image_full_path.exists():
        print(f"  [SKIP] Image not found: {image_full_path}")
        return None
    
    with open(image_full_path, 'rb') as f:
        garment_bytes = f.read()
    
    for attempt in range(retries + 1):
        try:
            r = requests.post(
                f"{BASE}/api/try-on/ai-model",
                files={"garment_image": ("garment.jpg", garment_bytes, "image/jpeg")},
                data={"body_type": body_type, "skin_tone": skin_tone},
                timeout=900,  # 15 minutes max
            )
            
            if r.ok and r.headers.get("content-type", "").startswith("image/"):
                return r.content
            else:
                print(f"  [FAIL] HTTP {r.status_code}: {r.text[:100]}")
                if attempt < retries:
                    print(f"  [RETRY] Attempt {attempt + 2}/{retries + 1}")
                    time.sleep(5)
        except Exception as e:
            print(f"  [ERROR] {type(e).__name__}: {e}")
            if attempt < retries:
                print(f"  [RETRY] Attempt {attempt + 2}/{retries + 1}")
                time.sleep(5)
    
    return None


def save_generated_image(product_id, body_type, image_bytes):
    """Save generated image to /public/images/products/ and return the relative path."""
    filename = f"{product_id}-{body_type}.jpg"
    filepath = IMAGES_DIR / filename
    
    img = Image.open(io.BytesIO(image_bytes))
    img.save(filepath, 'JPEG', quality=90)
    
    return f"/images/products/{filename}"


def update_products_ts(products_with_variants):
    """Update products.ts to add tryOnBodyVariants for each product."""
    content = PRODUCTS_FILE.read_text(encoding='utf-8')
    
    for product_id, variants in products_with_variants.items():
        # Build the tryOnBodyVariants array
        variants_str = "tryOnBodyVariants: [\n"
        for v in variants:
            variants_str += f"      {{\n        bodyType: '{v['bodyType']}',\n        images: ['{v['images'][0]}']\n      }},\n"
        variants_str += "    ]"
        
        # Find the product block and insert tryOnBodyVariants before the closing brace
        # Look for: id: "product-id", ... (then find the closing })
        pattern = rf'(id:\s*["\']{re.escape(product_id)}["\'].*?)(\n\s*\}})'
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            # Check if tryOnBodyVariants already exists
            product_block = match.group(1)
            if 'tryOnBodyVariants' not in product_block:
                # Insert before the closing brace
                replacement = match.group(1) + ",\n    " + variants_str + match.group(2)
                content = content[:match.start()] + replacement + content[match.end():]
                print(f"  [UPDATED] {product_id}")
    
    PRODUCTS_FILE.write_text(content, encoding='utf-8')


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--resume', action='store_true', help='Continue from last run')
    parser.add_argument('--new-only', action='store_true', help='Only generate for products without variants')
    parser.add_argument('--limit', type=int, default=0, help='Limit number of products to process')
    args = parser.parse_args()
    
    print("=" * 70)
    print("Tubhyam Batch AI Photo Generator")
    print("=" * 70)
    
    # Load products
    products = load_products()
    print(f"Found {len(products)} products")
    
    # Load progress
    progress = load_progress() if args.resume else {'completed': [], 'failed': []}
    print(f"Progress: {len(progress['completed'])} completed, {len(progress['failed'])} failed")
    
    # Filter products to process
    to_process = []
    for p in products:
        key = p['id']
        if key in progress['completed']:
            continue
        if args.new_only:
            # Check if product already has tryOnBodyVariants in products.ts
            content = PRODUCTS_FILE.read_text()
            if f'id: "{key}"' in content and 'tryOnBodyVariants' in content.split(f'id: "{key}"')[1].split('},')[0]:
                print(f"[SKIP] {key} already has variants")
                continue
        to_process.append(p)
    
    # Apply limit if specified
    if args.limit > 0:
        to_process = to_process[:args.limit]
        print(f"[LIMIT] Processing only first {args.limit} products")
    
    print(f"Processing {len(to_process)} products × {len(BODY_TYPES)} body types = {len(to_process) * len(BODY_TYPES)} generations")
    print()
    
    # Wait for AI service to be ready
    print("Checking AI service...")
    while True:
        try:
            r = requests.get(f"{BASE}/api/try-on/health", timeout=30)
            if r.ok:
                data = r.json()
                if data.get("model_loaded"):
                    print(f"[OK] Service ready (device={data.get('device')})")
                    break
                else:
                    # Service healthy but model not loaded yet.
                    # First generation request triggers model load.
                    print(f"[..] Service healthy but model not loaded yet...")
                    print(f"[..] First generation will trigger model loading.")
                    # Send a small probe generation to trigger load
                    print(f"[..] Probing generation to start model load...")
                    break
            else:
                print(f"[..] Service returned HTTP {r.status_code}")
        except Exception as e:
            print(f"[..] Service not ready: {type(e).__name__}")
        time.sleep(15)
    
    # Generate photos
    products_with_variants = {}
    
    for i, product in enumerate(to_process, 1):
        print(f"\n[{i}/{len(to_process)}] {product['id']}")
        variants = []
        
        for body_type in BODY_TYPES:
            print(f"  Generating {body_type}...", end=' ', flush=True)
            
            image_bytes = generate_ai_photo(product['id'], product['image'], body_type)
            
            if image_bytes:
                image_path = save_generated_image(product['id'], body_type, image_bytes)
                variants.append({
                    'bodyType': body_type,
                    'images': [image_path],
                })
                print(f"[OK] {image_path}")
            else:
                print(f"[FAIL]")
                progress['failed'].append({'id': product['id'], 'bodyType': body_type})
        
        if variants:
            products_with_variants[product['id']] = variants
            progress['completed'].append(product['id'])
            save_progress(progress)
        
        # Small delay between products to avoid overwhelming the service
        time.sleep(2)
    
    # Update products.ts
    print("\n" + "=" * 70)
    print("Updating products.ts...")
    update_products_ts(products_with_variants)
    
    # Summary
    print("\n" + "=" * 70)
    print("BATCH GENERATION COMPLETE")
    print("=" * 70)
    print(f"Completed: {len(progress['completed'])} products")
    print(f"Failed: {len(progress['failed'])} products")
    print(f"Progress saved to: {PROGRESS_FILE}")
    print()
    print("To resume failed generations:")
    print("  venv\\Scripts\\python.exe batch_generate.py --resume")
    print()
    print("To generate only for new products:")
    print("  venv\\Scripts\\python.exe batch_generate.py --new-only")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
