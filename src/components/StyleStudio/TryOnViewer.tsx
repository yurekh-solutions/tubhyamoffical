import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getTryOnCandidates } from '@/data/tryonResolver';
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
 * Shows the mannequin plate for the selected size + skin tone.
 * Falls back to SVG Mannequin if the plate fails to load.
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

  const candidates = useMemo(
    () => getTryOnCandidates(product, bodyShape, skinTone, size),
    [product, bodyShape, skinTone, size]
  );

  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Reset when selection changes
  useEffect(() => {
    setIndex(0);
    setLoaded(false);
  }, [candidates]);

  const surface = isLight ? '#FFFFFF' : '#1C1714';
  const shimmer = isLight ? '#F0E7DB' : '#241E18';

  const exhausted = index >= candidates.length;
  const current = candidates[index];

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex items-center justify-center min-h-[600px]"
      style={{ background: surface, border: `1px solid ${isLight ? '#E0D5C8' : 'rgba(255,211,172,0.15)'}` }}
    >
      {exhausted ? (
        // Final fallback: SVG mannequin
        <Mannequin
          size={size}
          skinTone={skinTone}
          garmentColor={garmentColor}
          topColor="#FFFFFF"
          height={560}
          width={420}
          gender="female"
          bodyShape={bodyShape}
          garmentType={garmentType}
        />
      ) : (
        <>
          {!loaded && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{ background: shimmer }}
              aria-hidden
            />
          )}
          <img
            key={current}
            src={current}
            alt={`${bodyShape} ${skinTone} mannequin, size ${size}`}
            className="block transition-opacity duration-300"
            style={{ 
              opacity: loaded ? 1 : 0, 
              maxHeight: 620, 
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain'
            }}
            loading="eager"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(false);
              setIndex(i => i + 1);
            }}
          />
        </>
      )}
    </div>
  );
};

export default TryOnViewer;
