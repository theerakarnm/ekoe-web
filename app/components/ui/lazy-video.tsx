import { useState, useEffect, useRef, useCallback } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preloadStrategy?: 'none' | 'metadata' | 'auto';
  rootMargin?: string;
  threshold?: number;
  className?: string;
  onLoad?: () => void;
  priority?: boolean;
  controls?: boolean;
}

export function LazyVideo({
  src,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  preloadStrategy = 'metadata',
  rootMargin = '200px',
  threshold = 0.1,
  className = '',
  onLoad,
  priority = false,
  controls = false,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Once in view, disconnect to avoid re-triggering
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [priority, rootMargin, threshold]);

  // Handle video loading and autoplay
  const handleLoadedData = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Start playback when in view and loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView || !isLoaded || hasStartedPlaying) return;

    if (autoPlay) {
      video.play().catch((error) => {
        // Autoplay might be blocked by browser policies
        console.warn('Video autoplay was prevented:', error);
      });
      setHasStartedPlaying(true);
    }
  }, [isInView, isLoaded, autoPlay, hasStartedPlaying]);

  // Handle muted state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
  }, [muted]);

  // Determine current preload value
  const currentPreload = isInView ? 'auto' : preloadStrategy;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Show poster until video is loaded */}
      {poster && !isLoaded && (
        <img
          src={poster}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Loading skeleton when no poster */}
      {!poster && !isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      )}

      {/* Video element - only renders src when in view */}
      {isInView && (
        <video
          ref={videoRef}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          preload={currentPreload}
          poster={poster}
          onLoadedData={handleLoadedData}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
