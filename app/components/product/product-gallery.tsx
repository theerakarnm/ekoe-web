import { useState, useEffect } from "react";
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
  const [isZooming, setIsZooming] = useState(false);
  const [displayImages, setDisplayImages] = useState(images);

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

  // Desktop hover zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  // Mobile fullscreen lightbox
  const openFullscreen = () => {
    if (enableFullscreen) {
      setIsFullscreen(true);
    }
  };

  // Thumbnail click handler
  const handleThumbnailClick = (img: { url: string; description: string; associatedSize?: string }) => {
    onImageClick(img);
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div
          className="aspect-4/5 bg-gray-100 overflow-hidden rounded-lg relative w-full cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={openFullscreen}
        >
          <img
            src={selectedImage}
            alt="Product Main"
            className={`w-full h-full object-cover transition-transform duration-200 ${
              isZooming ? "scale-150" : "scale-100"
            }`}
            style={
              isZooming
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : undefined
            }
          />
          {badgeText && (
            <div className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 uppercase tracking-wider">
              {badgeText}
            </div>
          )}
        </div>
        <div className="flex gap-4 overflow-x-auto w-full pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(img)}
              className={`w-20 h-24 shrink-0 border-2 transition-all rounded ${
                selectedImage === img.url
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

      {/* Fullscreen Lightbox */}
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
