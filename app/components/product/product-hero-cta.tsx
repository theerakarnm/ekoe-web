import { useState } from "react";
import { Star, ShoppingBag } from "lucide-react";
import { Button } from "~/components/ui/button";
import { LazyVideo } from "~/components/ui/lazy-video";
import { formatCurrencyFromCents } from "~/lib/formatter";

interface ProductHeroCTAProps {
  productName: string;
  rating: number;
  reviewCount?: number;
  price: number;
  primaryImage: string;
  backgroundUrl: string;
  backgroundType: "image" | "video";
  backgroundPoster?: string;
  isOutOfStock: boolean;
  onAddToCart: () => void;
}

export function ProductHeroCTA({
  productName,
  rating,
  reviewCount = 0,
  price,
  primaryImage,
  backgroundUrl,
  backgroundType,
  backgroundPoster,
  isOutOfStock,
  onAddToCart,
}: ProductHeroCTAProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background */}
      {backgroundType === "video" ? (
        <>
          {/* Video Background with LazyVideo - priority since above fold */}
          <LazyVideo
            src={backgroundUrl}
            poster={backgroundPoster}
            autoPlay
            muted
            loop
            playsInline
            priority={true}
            preloadStrategy="metadata"
            className="absolute inset-0 w-full h-full"
            onLoad={() => setIsVideoLoaded(true)}
          />
          {/* Fallback gradient while video loads (if no poster) */}
          {!isVideoLoaded && !backgroundPoster && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
        </>
      ) : (
        /* Image Background with lazy loading */
        <img
          src={backgroundUrl}
          alt={`${productName} background`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      )}

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Content Container */}
      <div className="absolute inset-0 flex">
        {/* Bottom Left - Product Info */}
        <div className="absolute bottom-8 left-6 md:bottom-16 md:left-12 max-w-md z-10">
          {/* Rating Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                className={
                  i < Math.floor(rating) ? "text-amber-400" : "text-gray-400"
                }
              />
            ))}
            {reviewCount > 0 && (
              <span className="text-white/70 text-sm ml-2">
                ({reviewCount})
              </span>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white uppercase tracking-wide leading-tight mb-6">
            {productName}
          </h1>

          {/* Add to Cart Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onAddToCart}
              disabled={isOutOfStock}
              className="h-12 px-8 text-sm uppercase tracking-wider bg-white text-black hover:bg-white/90 disabled:bg-gray-400 disabled:text-gray-600 font-medium flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              {isOutOfStock
                ? "Out of Stock"
                : `Add to Bag - ${formatCurrencyFromCents(price, {
                  symbolPosition: "prefix",
                  symbol: "฿",
                })}`}
            </Button>

            {/* Quick view / wishlist buttons could go here */}
          </div>
        </div>

        {/* Bottom Right - Product Thumbnail */}
        <div className="absolute bottom-8 right-6 md:bottom-16 md:right-12 z-10">
          <div className="w-24 h-32 md:w-32 md:h-44 bg-white rounded-lg shadow-2xl overflow-hidden p-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <img
              src={primaryImage}
              alt={productName}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
