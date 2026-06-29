import { useState, useCallback, useMemo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  lazy?: boolean;
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
  width?: number;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Route images through Vercel's Image Optimization API in production.
 * Converts to WebP/AVIF automatically — typically 60-80% smaller.
 */
function getOptimizedSrc(src: string, width: number, quality: number): string {
  if (!src || typeof window === 'undefined') return src;
  // Already a Vercel-optimized URL
  if (src.includes('/_vercel/image')) return src;
  // In production, use Vercel Image Optimization
  if (import.meta.env.PROD) {
    const encoded = encodeURIComponent(src);
    return `/_vercel/image?url=${encoded}&w=${width}&q=${quality}`;
  }
  return src;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = '3/4',
  lazy = true,
  priority = false,
  objectFit = 'cover',
  width = 640,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = useMemo(() => getOptimizedSrc(src, width, 75), [src, width]);
  // Smaller srcSet for responsive images on mobile
  const smallSrc = useMemo(() => getOptimizedSrc(src, 400, 70), [src]);
  const largeSrc = useMemo(() => getOptimizedSrc(src, 960, 80), [src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const isAbsolute = containerClassName.includes('absolute');

  return (
    <div
      className={`${isAbsolute ? 'overflow-hidden' : 'relative overflow-hidden'} ${containerClassName}`}
      style={isAbsolute ? undefined : { aspectRatio }}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-background animate-pulse" />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-background flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Image unavailable</span>
        </div>
      )}

      {/* Actual image — served as optimized WebP from Vercel CDN */}
      <img
        src={optimizedSrc}
        srcSet={`${smallSrc} 400w, ${optimizedSrc} ${width}w, ${largeSrc} 960w`}
        sizes="(max-width: 640px) 400px, (max-width: 1024px) 640px, 960px"
        alt={alt}
        loading={priority ? 'eager' : lazy ? 'lazy' : 'eager'}
        decoding={priority ? 'sync' : 'async'}
        // @ts-expect-error React doesn't recognize fetchpriority yet
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-500 ${
          objectFit === 'contain' ? 'object-contain' : 'object-cover'
        } ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
};

export default OptimizedImage;
