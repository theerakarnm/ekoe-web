import { useState, useCallback, type ImgHTMLAttributes } from 'react';
import { cn } from '~/lib/utils';

/**
 * Props for OptimizedImage component.
 */
interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** Image source URL (can be any format - component handles AVIF/WebP detection) */
  src: string;
  /** Alt text for accessibility (required) */
  alt: string;
  /** Optional additional class names */
  className?: string;
  /** Width for layout shift prevention */
  width?: number | string;
  /** Height for layout shift prevention */
  height?: number | string;
  /** Disable lazy loading */
  eager?: boolean;
  /** Disable fade-in animation */
  noAnimation?: boolean;
  /** Fallback image if src fails to load */
  fallbackSrc?: string;
  /** Optional responsive sizes for srcset */
  sizes?: string;
}

/**
 * Derives AVIF and WebP URLs from a base image URL.
 * Handles both URLs with extensions and base URLs without extensions.
 */
function deriveFormats(src: string): { avif?: string; webp?: string; jpeg: string } {
  // If URL already has .avif extension, derive others
  if (src.endsWith('.avif')) {
    const base = src.slice(0, -5);
    return {
      avif: src,
      webp: `${base}.webp`,
      jpeg: `${base}.jpeg`,
    };
  }

  // If URL already has .webp extension, derive others
  if (src.endsWith('.webp')) {
    const base = src.slice(0, -5);
    return {
      avif: `${base}.avif`,
      webp: src,
      jpeg: `${base}.jpeg`,
    };
  }

  // If URL has common image extension, derive modern formats
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  for (const ext of imageExtensions) {
    if (src.toLowerCase().endsWith(ext)) {
      const base = src.slice(0, -ext.length);
      return {
        avif: `${base}.avif`,
        webp: `${base}.webp`,
        jpeg: src, // Keep original as JPEG fallback
      };
    }
  }

  // If no recognized extension, assume it's a base URL and append extensions
  return {
    avif: `${src}.avif`,
    webp: `${src}.webp`,
    jpeg: `${src}.jpeg`,
  };
}

/**
 * OptimizedImage - A smart image component with AVIF/WebP support.
 * 
 * Features:
 * - Automatic <picture> element with AVIF → WebP → JPEG fallback chain
 * - Lazy loading by default
 * - Fade-in animation on load
 * - Layout shift prevention with width/height
 * - Error handling with fallback support
 * 
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="https://cdn.example.com/products/image"
 *   alt="Product photo"
 *   width={800}
 *   height={600}
 *   className="rounded-lg"
 * />
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  eager = false,
  noAnimation = false,
  fallbackSrc,
  sizes,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const formats = deriveFormats(src);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // If error and fallback available, show fallback
  const displaySrc = hasError && fallbackSrc ? fallbackSrc : formats.jpeg;

  // Skip picture element for external URLs that don't have our format variants
  const isExternalUrl = src.startsWith('http') && !src.includes('r2.cloudflarestorage.com') && !src.includes(process.env.R2_PUBLIC_URL || 'NEVER_MATCH');
  const useSimpleImg = isExternalUrl || hasError;

  if (useSimpleImg) {
    return (
      <img
        src={displaySrc}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          noAnimation ? '' : 'transition-opacity duration-300',
          noAnimation ? '' : (isLoaded ? 'opacity-100' : 'opacity-0'),
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
  }

  return (
    <picture>
      {/* AVIF - Best compression, modern browsers */}
      {formats.avif && (
        <source
          srcSet={formats.avif}
          type="image/avif"
          sizes={sizes}
        />
      )}

      {/* WebP - Good compression, wide support */}
      {formats.webp && (
        <source
          srcSet={formats.webp}
          type="image/webp"
          sizes={sizes}
        />
      )}

      {/* Fallback - JPEG for legacy browsers */}
      <img
        src={formats.jpeg}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          noAnimation ? '' : 'transition-opacity duration-300',
          noAnimation ? '' : (isLoaded ? 'opacity-100' : 'opacity-0'),
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </picture>
  );
}

export default OptimizedImage;
