import { useState } from "react";
import { ShoppingBag, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "~/components/ui/button";
import { formatCurrencyFromCents } from "~/lib/formatter";

interface HowToUseMediaProps {
  productName: string;
  productImage: string;
  price: number;
  mediaUrl: string;
  mediaType: "image" | "video";
  onAddToCart: () => void;
}

export function HowToUseMedia({
  productName,
  productImage,
  price,
  mediaUrl,
  mediaType,
  onAddToCart,
}: HowToUseMediaProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-gray-100 rounded-2xl shadow-lg">
      {/* Media Content */}
      {mediaType === "video" ? (
        <>
          <video
            autoPlay
            muted={isMuted}
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isVideoLoaded ? "opacity-100" : "opacity-0"
              }`}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
          {/* Fallback while loading */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}

          {/* Mute/Unmute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors z-20"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </>
      ) : (
        <img
          src={mediaUrl}
          alt={`How to use ${productName}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Close Button */}
      <button className="absolute top-4 right-4 md:right-16 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 transition-colors z-20">
        <X size={20} />
      </button>

      {/* Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        {/* Mini Product Card */}
        <div className="flex items-end gap-4">
          <div className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-3 min-w-[200px] max-w-[320px]">
            {/* Product Thumbnail */}
            <div className="w-12 h-16 bg-gray-50 rounded shrink-0 overflow-hidden">
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium uppercase tracking-wide truncate text-gray-900">
                {productName}
              </h4>
              <p className="text-sm text-gray-600 mt-0.5">
                {formatCurrencyFromCents(price, {
                  symbolPosition: "prefix",
                  symbol: "€",
                })}
              </p>
            </div>

            {/* Cart Icon */}
            <button
              onClick={onAddToCart}
              className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center text-white transition-colors shrink-0"
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>

        {/* Add to Bag Button */}
        <Button
          onClick={onAddToCart}
          className="mt-3 h-12 px-8 text-sm uppercase tracking-wider bg-white text-black hover:bg-gray-100 font-medium flex items-center gap-2 shadow-lg"
        >
          Add to Bag
          <span className="ml-2">→</span>
        </Button>
      </div>

      {/* Additional Controls (right side) */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3">
        {/* Share / Other buttons could go here */}
      </div>
    </div>
  );
}
