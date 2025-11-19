import { useState } from "react";

interface ProductGalleryProps {
  images: { url: string; description: string; associatedSize?: string }[];
  selectedImage: string;
  onImageClick: (img: { url: string; description: string; associatedSize?: string }) => void;
  badgeText?: string;
}

export function ProductGallery({
  images,
  selectedImage,
  onImageClick,
  badgeText = "Best Seller",
}: ProductGalleryProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="aspect-4/5 bg-gray-100 overflow-hidden rounded-lg relative flex-1">
        <img
          src={selectedImage}
          alt="Product Main"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 uppercase tracking-wider">
          {badgeText}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-20 shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onImageClick(img)}
            className={`w-20 h-24 shrink-0 border ${selectedImage === img.url
              ? "border-black"
              : "border-transparent"
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
  );
}
