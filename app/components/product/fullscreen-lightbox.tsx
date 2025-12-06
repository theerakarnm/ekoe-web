import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface FullscreenLightboxProps {
  images: { url: string; description: string; associatedSize?: string }[];
  initialImage: string;
  onClose: () => void;
}

export function FullscreenLightbox({
  images,
  initialImage,
  onClose,
}: FullscreenLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(
    images.findIndex((img) => img.url === initialImage) || 0
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [isPinching, setIsPinching] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setScale(1);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setScale(1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture detected
      setIsPinching(true);
      return;
    }
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isPinching && e.touches.length === 2) {
      // Handle pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Simple zoom based on distance (you can make this more sophisticated)
      const newScale = Math.min(Math.max(distance / 200, 1), 3);
      setScale(newScale);
      return;
    }
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (isPinching) {
      setIsPinching(false);
      return;
    }

    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} of {images.length}
      </div>

      {/* Navigation buttons - desktop only */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 z-10 text-white hover:text-gray-300 transition-colors hidden md:block"
            aria-label="Previous image"
          >
            <ChevronLeft size={48} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-10 text-white hover:text-gray-300 transition-colors hidden md:block"
            aria-label="Next image"
          >
            <ChevronRight size={48} />
          </button>
        </>
      )}

      {/* Image */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].description}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{ transform: `scale(${scale})` }}
        />
      </div>
    </div>
  );
}
