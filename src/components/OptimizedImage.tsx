import { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  lazy?: boolean;
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
  onLoad?: () => void;
  onError?: () => void;
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
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={{ aspectRatio }}
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

      {/* Actual image */}
      <img
        src={src}
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
