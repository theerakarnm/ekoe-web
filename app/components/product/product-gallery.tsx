import { useState, useEffect, useRef } from "react";
import { FullscreenLightbox } from "./fullscreen-lightbox";

interface ProductGalleryProps {
  images: { url: string; description: string; associatedSize?: string }[];
  selectedImage: string;
  onImageClick: (img: { url: string; description: string; associatedSize?: string }) => void;
  badgeText?: string;
  enableZoom?: boolean;
  enableFullscreen?: boolean;
  selectedVariant?: string;
}

// Zoom lens size (percentage of main image)
const LENS_SIZE_PERCENT = 25;
// Zoom magnification factor
const ZOOM_FACTOR = 2.5;

export function ProductGallery({
  images,
  selectedImage,
  onImageClick,
  badgeText = "Best Seller",
  enableZoom = true,
  enableFullscreen = true,
  selectedVariant,
}: ProductGalleryProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [displayImages, setDisplayImages] = useState(images);
  const [isMobile, setIsMobile] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter images by variant when variant is selected
  useEffect(() => {
    if (selectedVariant) {
      const variantImages = images.filter(
        (img) => img.associatedSize === selectedVariant
      );

      // If variant-specific images exist, use them; otherwise fall back to all images
      if (variantImages.length > 0) {
        setDisplayImages(variantImages);
        // Automatically update primary image to first variant image
        if (!variantImages.find((img) => img.url === selectedImage)) {
          onImageClick(variantImages[0]);
        }
      } else {
        setDisplayImages(images);
      }
    } else {
      setDisplayImages(images);
    }
  }, [selectedVariant, images, selectedImage, onImageClick]);

  // Desktop hover zoom with lens
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom || isMobile) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Calculate lens position (centered on cursor)
    const halfLens = LENS_SIZE_PERCENT / 2;
    const lensX = Math.max(halfLens, Math.min(100 - halfLens, x));
    const lensY = Math.max(halfLens, Math.min(100 - halfLens, y));

    setZoomPosition({ x, y });
    setLensPosition({ x: lensX, y: lensY });
    setIsZooming(true);
  };

  const handleMouseEnter = () => {
    if (!enableZoom || isMobile) return;
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  // Mobile fullscreen lightbox
  const openFullscreen = () => {
    if (enableFullscreen && isMobile) {
      setIsFullscreen(true);
    }
  };

  // Thumbnail click handler
  const handleThumbnailClick = (img: { url: string; description: string; associatedSize?: string }) => {
    onImageClick(img);
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full relative">
        {/* Main image container with zoom functionality */}
        <div className="relative flex gap-4">
          {/* Main Image */}
          <div
            ref={imageContainerRef}
            className={`aspect-4/5 bg-gray-100 overflow-hidden rounded-lg relative w-full ${isMobile ? "cursor-zoom-in" : enableZoom ? "cursor-crosshair" : ""
              }`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={openFullscreen}
          >
            <img
              src={selectedImage}
              alt="Product Main"
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Zoom Lens Indicator - Desktop only */}
            {isZooming && !isMobile && enableZoom && (
              <div
                className="absolute pointer-events-none border-2 border-black/40 bg-white/20 backdrop-blur-[1px] transition-opacity duration-150"
                style={{
                  width: `${LENS_SIZE_PERCENT}%`,
                  height: `${LENS_SIZE_PERCENT}%`,
                  left: `${lensPosition.x - LENS_SIZE_PERCENT / 2}%`,
                  top: `${lensPosition.y - LENS_SIZE_PERCENT / 2}%`,
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.15)",
                }}
              />
            )}

            {badgeText && (
              <div className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 uppercase tracking-wider z-10">
                {badgeText}
              </div>
            )}

            {/* Click to see full view text - Desktop only */}
            {!isMobile && enableZoom && (
              <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                Hover to zoom
              </div>
            )}
          </div>

          {/* Zoomed Image Panel - Desktop only, appears on hover */}
          {isZooming && !isMobile && enableZoom && (
            <div
              className="hidden lg:block absolute left-full ml-4 top-0 w-full aspect-4/5 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl z-50"
              style={{
                maxWidth: "500px",
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${selectedImage})`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundSize: `${ZOOM_FACTOR * 100}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-4 overflow-x-auto w-full pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(img)}
              className={`w-20 h-24 shrink-0 border-2 transition-all rounded ${selectedImage === img.url
                  ? "border-black ring-2 ring-black"
                  : "border-gray-200 hover:border-gray-400"
                }`}
            >
              <img
                src={img.url}
                alt={img.description}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox - Mobile */}
      {isFullscreen && (
        <FullscreenLightbox
          images={displayImages}
          initialImage={selectedImage}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </>
  );
}
