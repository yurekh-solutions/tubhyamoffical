/**
 * optimizeImages.js
 * Converts PNG product images to compressed JPEG, copies JPEGs as-is,
 * all into public/images/products/. Generates a mapping for products.ts.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC_ASSETS = path.join(ROOT, 'src', 'assets');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'products');

// Directories to scan
const SCAN_DIRS = [
  path.join(SRC_ASSETS, 'formals'),
  path.join(SRC_ASSETS, 'Tracks'),
  path.join(SRC_ASSETS, 'products'),
  SRC_ASSETS, // root-level jpeg/png files
];

const IMAGE_EXTS = ['.jpeg', '.jpg', '.png', '.webp'];

// Minimum target width — images smaller than this get upscaled with Lanczos
const MIN_WIDTH = 1200;

function cleanFilename(name) {
  // Replace spaces, commas, special chars with hyphens; lowercase
  return name
    .replace(/[,\s]+/g, '-')
    .replace(/[^a-zA-Z0-9\-_.]/g, '')
    .toLowerCase();
}

async function processImage(srcPath, outDir) {
  const ext = path.extname(srcPath).toLowerCase();
  const baseName = path.basename(srcPath, ext);
  const clean = cleanFilename(baseName);

  let outFile;
  let originalSize, newSize;

  originalSize = fs.statSync(srcPath).size;

  // Get original dimensions
  const meta = await sharp(srcPath).metadata();
  const needsUpscale = meta.width < MIN_WIDTH;

  // Build the sharp pipeline
  let pipeline = sharp(srcPath, { failOnError: false });

  // Upscale small images using high-quality Lanczos3 resampling
  if (needsUpscale) {
    pipeline = pipeline.resize({
      width: MIN_WIDTH,
      kernel: 'lanczos3',
      fit: 'inside',
      withoutEnlargement: false,
    });
  }

  // Convert to JPEG at quality 92
  pipeline = pipeline.jpeg({ quality: 92, mozjpeg: true });

  outFile = path.join(outDir, `${clean}.jpg`);
  await pipeline.toFile(outFile);

  newSize = fs.statSync(outFile).size;
  const upscaleTag = needsUpscale ? ` ⬆️ ${meta.width}→${MIN_WIDTH}px` : '';
  return {
    src: srcPath,
    out: outFile,
    originalName: path.basename(srcPath),
    outName: path.basename(outFile),
    originalSize,
    newSize,
    upscaleTag,
  };
}

async function main() {
  console.log('🖼️  Optimizing product images...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  // Collect all image files (deduplicate by absolute path)
  const allFiles = new Set();
  
  for (const dir of SCAN_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      if (!fs.statSync(fullPath).isFile()) continue;
      const ext = path.extname(entry).toLowerCase();
      if (IMAGE_EXTS.includes(ext)) {
        allFiles.add(fullPath);
      }
    }
  }

  // Skip the hero video, non-image files, etc.
  const files = [...allFiles].filter(f => {
    const ext = path.extname(f).toLowerCase();
    return IMAGE_EXTS.includes(ext);
  });

  console.log(`Found ${files.length} images to process\n`);

  const results = [];
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    try {
      const result = await processImage(file, OUT_DIR);
      if (result) {
        results.push(result);
        totalOriginal += result.originalSize;
        totalOptimized += result.newSize;
        const reduction = ((1 - result.newSize / result.originalSize) * 100).toFixed(0);
        const marker = result.originalName.endsWith('.png') ? '🔄 PNG→JPG' : '📋 JPEG';
        console.log(`  ${marker}  ${result.originalName} → ${result.outName}  (${(result.originalSize/1024).toFixed(0)}KB → ${(result.newSize/1024).toFixed(0)}KB, -${reduction}%)${result.upscaleTag}`);
      }
    } catch (err) {
      console.error(`  ❌ Error processing ${file}: ${err.message}`);
    }
  }

  // Generate mapping: original filename -> output URL path
  const mapping = {};
  for (const r of results) {
    // Key: the original file path relative to src/assets (used in imports)
    const relSrc = path.relative(SRC_ASSETS, r.src).replace(/\\/g, '/');
    // Value: the public URL path
    mapping[relSrc] = `/images/products/${r.outName}`;
  }

  // Save mapping JSON
  const mappingPath = path.join(__dirname, 'imageMapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\n📄 Mapping saved to: scripts/imageMapping.json`);

  // Summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`✅ Processed: ${results.length} images`);
  console.log(`📦 Original total:   ${(totalOriginal / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`📦 Optimized total:  ${(totalOptimized / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`💾 Saved:           ${((1 - totalOptimized / totalOriginal) * 100).toFixed(0)}%`);
  console.log(`${'═'.repeat(60)}`);
}

main().catch(console.error);
