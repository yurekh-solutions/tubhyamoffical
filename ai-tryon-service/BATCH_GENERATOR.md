# Tubhyam AI Photo Batch Generator

Automatically generates AI model photos for all Tubhyam products.

## What it does

- Generates AI model photos for every product × every body type (Slim / Average / Plus Size)
- Saves photos to `/public/images/products/{product-id}-{bodyType}.jpg`
- Updates `src/data/products.ts` to add `tryOnBodyVariants` field
- Progress is saved — if it crashes, you can resume from where it stopped

## Files created

- `batch_generate.py` — Main generation script
- `generate_new.bat` — Windows batch file for easy use
- `batch_progress.json` — Auto-generated progress file (don't delete)

## Usage

### First time (generate for ALL products)

1. Make sure AI service is running:
   ```
   start.bat
   ```

2. Run batch generation:
   ```
   venv\Scripts\python.exe batch_generate.py
   ```
   
   OR double-click `generate_all.bat` (if you create one)

3. Wait 2-3 hours (43 products × 3 body types = 129 generations, ~30-90s each)

4. Progress is auto-saved. If it crashes, just run again with `--resume`:
   ```
   venv\Scripts\python.exe batch_generate.py --resume
   ```

### Future: Generate for NEW products only

When you add new products to `src/data/products.ts`, run:

```
venv\Scripts\python.exe batch_generate.py --new-only
```

OR double-click `generate_new.bat`

This only generates photos for products that don't have `tryOnBodyVariants` yet.

## Output

For each product, three photos are generated:
- `{product-id}-slim.jpg` — Slim body type
- `{product-id}-average.jpg` — Average body type  
- `{product-id}-plus-size.jpg` — Plus Size body type

Example:
- `cord-set-001-slim.jpg`
- `cord-set-001-average.jpg`
- `cord-set-001-plus-size.jpg`

## Progress tracking

The script creates `batch_progress.json` with:
```json
{
  "completed": ["cord-set-001", "pt-004", ...],
  "failed": []
}
```

- `completed` — Products that finished successfully
- `failed` — Products that failed (can retry with `--resume`)

## Requirements

- AI service running on `http://localhost:8000`
- Model must be loaded (`model_loaded: true` in health check)
- First run downloads ~4.3GB model weights (one-time, ~1 hour)

## Troubleshooting

**"Service not ready"**
- Run `start.bat` to start the AI service
- Wait for model to load (check terminal output)

**"Image not found"**
- Make sure product images exist in `/public/images/products/`
- Check the `image` field in `src/data/products.ts`

**Generation failed**
- Check AI service terminal for errors
- Run with `--resume` to retry failed products
- If persistent, check GPU memory (need 4GB+ VRAM)

**Slow generation**
- First generation is slow (model loading)
- Subsequent generations: 30-90 seconds each
- RTX 3050 Ti (4GB) is minimum recommended

## Integration with product workflow

When adding a new product:

1. Add product to `src/data/products.ts`:
   ```typescript
   {
     id: "new-product-001",
     name: "New Product",
     image: "/images/products/new-product.jpg",
     // ... other fields
   }
   ```

2. Add product image to `/public/images/products/new-product.jpg`

3. Run batch generator for new products:
   ```
   generate_new.bat
   ```

4. Script automatically adds `tryOnBodyVariants` to the product

5. Product now appears on /try-on page with AI model photos!

## Performance

- **43 products × 3 body types = 129 generations**
- **Time per generation**: 30-90 seconds
- **Total time**: ~2-3 hours
- **Disk space**: ~500MB for all generated photos
- **GPU**: RTX 3050 Ti (4GB) or better

## Future enhancements

- [ ] Parallel generation (multiple products at once)
- [ ] Color variant generation (8 colors × 3 body types = 24 photos per product)
- [ ] Progress bar with ETA
- [ ] Email/notification on completion
- [ ] Web UI for monitoring generation progress
