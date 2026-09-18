import { useState, useEffect, useMemo, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getTryOnAssets, getTryOnImageCandidates } from '@/data/tryonResolver';
import type { Product } from '@/data/products';
import type { BodyShape, SkinTone } from '@/data/styleStudioModels';
import Mannequin from '@/components/StyleStudio/Mannequin';

interface TryOnViewerProps {
  product: Product;
  bodyShape: BodyShape;
  skinTone: SkinTone;
  size: string;
  garmentColor: string;
  garmentType: 'formal' | 'jeans' | 'track';
}

/**
 * Right-hand preview for the Style Studio.
 *
 * Simple layout:
 *   TOP (large)  — try-on photo resolved SIZE + TONE wise:
 *                  1. VTON composite {productId}__{skin}-{size}.jpg
 *                  2. per-body variant photo (model wearing product)
 *                  3. flat catalog photo
 *   BOTTOM (small) — mannequin plate as body reference (size + skin)
 *
 * No AI generation, no sign-in, no overlay. Works instantly.
 */
const TryOnViewer = ({
  product,
  bodyShape,
  skinTone,
  size,
  garmentColor,
  garmentType,
}: TryOnViewerProps) => {
  const { isLight } = useTheme();

  const assets = useMemo(
    () => getTryOnAssets(product, bodyShape, skinTone, size),
    [product, bodyShape, skinTone, size]
  );

  // Size+tone-aware try-on photo cascade. The composite candidate changes with
  // BOTH size and skin tone; missing files fall back to the body variant, then
  // the flat catalog photo.
  const candidates = useMemo(
    () => getTryOnImageCandidates(product, bodyShape, skinTone, size),
    [product, bodyShape, skinTone, size]
  );
  const candidateKey = candidates.join('|');
  const [candidateIdx, setCandidateIdx] = useState(0);

  const [plateLoaded, setPlateLoaded] = useState(false);
  const [plateFailed, setPlateFailed] = useState(false);
  const [productLoaded, setProductLoaded] = useState(false);

  const productImgRef = useRef<HTMLImageElement>(null);
  const plateImgRef = useRef<HTMLImageElement>(null);

  // New selection: restart the cascade from the composite candidate.
  useEffect(() => {
    setCandidateIdx(0);
    setPlateLoaded(false);
    setPlateFailed(false);
    setProductLoaded(false);

    // A cached image can finish loading BEFORE this effect runs, so onLoad
    // never fires again and the image would stay stuck at opacity 0.
    // Un-hide anything that is already complete.
    if (productImgRef.current?.complete) setProductLoaded(true);
    if (plateImgRef.current?.complete) setPlateLoaded(true);
  }, [candidateKey, assets.plateUrl]);

  // Cascade step: current candidate 404'd — advance to the next candidate.
  useEffect(() => {
    setProductLoaded(false);
    if (productImgRef.current?.complete) setProductLoaded(true);
  }, [candidateIdx]);

  // Clamp guards the render between a selection change and the reset effect.
  const tryOnImage = candidates[Math.min(candidateIdx, candidates.length - 1)];

  const surface = isLight ? '#FFFFFF' : '#1C1714';
  const shimmer = isLight ? '#F0E7DB' : '#241E18';

  const showFallback = plateFailed;

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: surface,
        border: `1px solid ${isLight ? '#E0D5C8' : 'rgba(255,211,172,0.15)'}`,
      }}
    >
      {showFallback ? (
        <div className="flex items-center justify-center min-h-[500px]">
          <Mannequin
            size={size}
            skinTone={skinTone}
            garmentColor={garmentColor}
            topColor="#FFFFFF"
            height={460}
            width={360}
            gender="female"
            bodyShape={bodyShape}
            garmentType={garmentType}
          />
        </div>
      ) : (
        <>
          {/* ── Section 1: Product Photo (MAIN, large) ── */}
          <div className="relative flex items-center justify-center" style={{ minHeight: 480, background: isLight ? '#FAF5EF' : '#161210' }}>
            {!productLoaded && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{ background: isLight ? '#F0E7DB' : '#1E1A16' }}
                aria-hidden
              />
            )}
            {tryOnImage ? (
              <img
                ref={productImgRef}
                key={`${candidateKey}-${candidateIdx}`}
                src={tryOnImage}
                alt={`${product.name} tried on by model (${bodyShape}, size ${size}, ${skinTone} skin)`}
                className="block transition-opacity duration-300"
                style={{
                  opacity: productLoaded ? 1 : 0,
                  maxHeight: 480,
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                loading="eager"
                onLoad={() => setProductLoaded(true)}
                onError={() => {
                  if (candidateIdx < candidates.length - 1) {
                    setCandidateIdx(candidateIdx + 1);
                  } else {
                    setProductLoaded(true); // exhausted — show final candidate state
                  }
                }}
              />
            ) : (
              <p className="text-xs py-8" style={{ color: isLight ? '#9B8E82' : 'rgba(255,211,172,0.4)' }}>
                No product image available
              </p>
            )}
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: isLight ? '#E0D5C8' : 'rgba(255,211,172,0.12)' }} />

          {/* ── Section 2: Mannequin Body Reference (small) ─ */}
          <div className="relative flex items-center gap-4 px-4 py-3" style={{ minHeight: 120, background: shimmer }}>
            <div className="shrink-0" style={{ width: 80, height: 110 }}>
              {!plateLoaded && (
                <div
                  className="absolute inset-0 animate-pulse rounded-lg"
                  style={{ background: isLight ? '#E8DDD0' : '#2A2420', width: 80, height: 110 }}
                  aria-hidden
                />
              )}
              <img
                ref={plateImgRef}
                key={assets.plateUrl}
                src={assets.plateUrl}
                alt={`${bodyShape} ${skinTone} mannequin, size ${size}`}
                className="block rounded-lg transition-opacity duration-300"
                style={{
                  opacity: plateLoaded ? 1 : 0,
                  width: 80,
                  height: 110,
                  objectFit: 'cover',
                }}
                loading="eager"
                onLoad={() => setPlateLoaded(true)}
                onError={() => setPlateFailed(true)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#8B5E3C' }}>
                Your Body Reference
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-[9px] uppercase" style={{ color: isLight ? '#9B8E82' : 'rgba(255,211,172,0.5)' }}>Size</p>
                  <p className="font-semibold" style={{ color: isLight ? '#1A1410' : '#FFF5EB' }}>{size}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase" style={{ color: isLight ? '#9B8E82' : 'rgba(255,211,172,0.5)' }}>Skin</p>
                  <p className="font-semibold" style={{ color: isLight ? '#1A1410' : '#FFF5EB' }}>{skinTone}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase" style={{ color: isLight ? '#9B8E82' : 'rgba(255,211,172,0.5)' }}>Shape</p>
                  <p className="font-semibold" style={{ color: isLight ? '#1A1410' : '#FFF5EB' }}>{bodyShape === 'plus-size' ? 'Plus' : bodyShape.charAt(0).toUpperCase() + bodyShape.slice(1)}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TryOnViewer;
