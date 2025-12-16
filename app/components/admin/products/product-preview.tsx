import { useMemo, useState, useEffect } from "react";
import type { ProductFormData } from "~/lib/admin/validation";
import type { ProductImage } from "~/lib/services/admin/product-admin.service";
import type { IProduct } from "~/interface/product.interface";
import { ProductGallery } from "~/components/product/product-gallery";
import { ComplimentaryGift } from "~/components/product/complimentary-gift";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { formatCurrencyFromCents } from "~/lib/formatter";

interface ProductPreviewProps {
  data: ProductFormData;
  images: ProductImage[];
}

interface ExtendedSize {
  label: string;
  value: string;
  price: number;
  stockQuantity: number;
  variantId: string;
  variantType: string;
}

interface GroupedVariant {
  type: string;
  options: ExtendedSize[];
}

export function ProductPreview({ data, images }: ProductPreviewProps) {
  // Transform form data to IProduct format
  const productData = useMemo(() => {
    const primaryImage = images.find(img => img.isPrimary) || images[0];

    // Map existing images
    const galleryImages = images.map(img => ({
      url: img.url,
      description: img.altText || img.description || data.name || "Product Image",
      associatedSize: undefined // Form doesn't link images to variants yet in the same way
    }));

    // Map variants
    // Note: The form data structure for variants might need some adaptation
    const formVariants = data.variants || [];

    const extendedSizes: ExtendedSize[] = formVariants.map((v, index) => ({
      label: v.name || 'Unknown',
      value: v.value || `var-${index}`,
      price: v.price || data.basePrice || 0,
      stockQuantity: v.stockQuantity || 0,
      variantId: v.id || `temp-${index}`,
      variantType: v.variantType || 'Size'
    }));

    // Group variants by variantType
    const variantsByType = new Map<string, ExtendedSize[]>();
    extendedSizes.forEach(variant => {
      const type = variant.variantType;
      if (!variantsByType.has(type)) {
        variantsByType.set(type, []);
      }
      variantsByType.get(type)!.push(variant);
    });

    const groupedVariants: GroupedVariant[] = Array.from(variantsByType.entries()).map(([type, options]) => ({
      type,
      options
    }));

    // Calculate price range
    const prices = extendedSizes.length > 0 ? extendedSizes.map(s => s.price) : [data.basePrice || 0];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceTitle = minPrice !== maxPrice
      ? `${formatCurrencyFromCents(minPrice, { symbolPosition: 'suffix', symbol: ' THB' })} - ${formatCurrencyFromCents(maxPrice, { symbolPosition: 'suffix', symbol: ' THB' })}`
      : `${formatCurrencyFromCents(minPrice || 0, { symbolPosition: 'suffix', symbol: ' THB' })}`;

    return {
      productId: "preview",
      productName: data.name || "Product Name",
      subtitle: data.subtitle || "Product Subtitle",
      priceTitle,
      quickCartPrice: data.basePrice || 0,
      image: {
        url: primaryImage?.url || "",
        description: primaryImage?.altText || "",
      },
      galleryImages,
      rating: 5, // Default for preview
      reviewCount: 0,
      description: data.description ? [data.description] : [],
      extendedSizes,
      groupedVariants,
      ingredients: {
        keyIngredients: data.ingredients?.keyIngredients || [],
        fullList: data.ingredients?.fullList || '',
        image: data.ingredients?.image || ''
      },
      howToUse: {
        steps: data.howToUse?.steps || [],
        proTips: data.howToUse?.proTips || [],
        note: data.howToUse?.note || ''
      },
      goodFor: data.goodFor || '',
      whyItWorks: data.whyItWorks || '',
      feelsLike: data.feelsLike || '',
      smellsLike: data.smellsLike || '',
      complimentaryGift: data.complimentaryGift?.name ? {
        name: data.complimentaryGift.name,
        description: data.complimentaryGift.description,
        image: data.complimentaryGift.image,
        value: data.complimentaryGift.value,
      } : undefined,
      realUserReviews: data.realUserReviews?.content ? {
        image: data.realUserReviews.image,
        content: data.realUserReviews.content
      } : undefined,
      tags: [], // Form doesn't seem to have tags as strings yet, maybe ids
    };
  }, [data, images]);

  // --- Logic from ProductDetail adapted for preview ---

  // Use extended sizes if available, otherwise fake one based on base price
  const availableSizes = useMemo(() =>
    productData.extendedSizes.length > 0
      ? productData.extendedSizes
      : [{
        label: "Standard",
        value: "standard",
        price: productData.quickCartPrice,
        stockQuantity: 999,
        variantId: "default",
        variantType: "Size"
      }],
    [productData.extendedSizes, productData.quickCartPrice]
  );

  const initialSelections = useMemo(() => {
    const selections: Record<string, ExtendedSize> = {};
    if (productData.groupedVariants && productData.groupedVariants.length > 0) {
      productData.groupedVariants.forEach(group => {
        if (group.options.length > 0) {
          selections[group.type] = group.options[0];
        }
      });
    } else if (availableSizes.length > 0) {
      selections['Size'] = availableSizes[0];
    }
    return selections;
  }, [productData.groupedVariants, availableSizes]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, ExtendedSize>>(initialSelections);
  const [selectedImage, setSelectedImage] = useState(productData.galleryImages[0]?.url || "");

  // Update selected image when images change (e.g. upload new one)
  useEffect(() => {
    if (!selectedImage && productData.galleryImages.length > 0) {
      setSelectedImage(productData.galleryImages[0].url);
    }
  }, [productData.galleryImages, selectedImage]);

  // Update selections when available sizes change (e.g. added new variant)
  useEffect(() => {
    setSelectedOptions(initialSelections);
  }, [initialSelections]);

  const handleOptionSelect = (type: string, option: ExtendedSize) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: option
    }));
  };

  const handleImageClick = (img: { url: string; associatedSize?: string }) => {
    setSelectedImage(img.url);
  };

  const isOutOfStock = Object.values(selectedOptions).some(opt => opt.stockQuantity === 0);
  const currentPrice = Object.values(selectedOptions).reduce((sum, opt) => sum + opt.price, 0) || productData.quickCartPrice;

  if (images.length === 0 && !data.name) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
        <p>Start editing to see preview</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 h-full overflow-y-auto custom-scrollbar">
      {/* Simulate Mobile/Narrow Viewport */}
      <div className="max-w-[480px] mx-auto bg-white min-h-full pb-8">

        {/* Navigation Mock */}
        <div className="h-14 border-b flex items-center justify-between px-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="font-serif font-bold text-lg tracking-tight">Ekoe</div>
          <div className="flex gap-4">
            <ShoppingBag size={20} className="text-gray-800" />
          </div>
        </div>

        {/* Gallery */}
        <div className="pt-4 px-4 pb-0">
          {productData.galleryImages.length > 0 ? (
            <ProductGallery
              images={productData.galleryImages}
              selectedImage={selectedImage || productData.galleryImages[0]?.url}
              onImageClick={handleImageClick}
              enableZoom={false}
              enableFullscreen={false} // Disable strictly for preview context if needed, or enable
            />
          ) : (
            <div className="aspect-4/5 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400 mb-4">
              No Images
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="px-4 mt-6">
          <div className="flex gap-2 mb-2">
            <span className="bg-black text-white text-[10px] px-2 py-1 uppercase tracking-wider">
              New Arrival
            </span>
          </div>

          <h1 className="text-2xl font-serif mb-1">{productData.productName}</h1>
          <p className="text-sm text-gray-600 italic mb-3">{productData.subtitle}</p>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="text-xs text-gray-500">(0 Reviews)</span>
          </div>

          <div className="text-xl font-medium mb-6">
            {productData.priceTitle}
          </div>

          {/* Description */}
          <div className="text-sm text-gray-700 leading-relaxed mb-6 space-y-3">
            {productData.description.map((desc, i) => <p key={i}>{desc}</p>)}
            {!data.description && <p className="text-gray-400 italic">No description added yet.</p>}
          </div>

          {/* Accordions */}
          {(productData.whyItWorks || productData.goodFor) && (
            <Accordion type="single" collapsible className="w-full border-t border-gray-100 mb-6">
              {productData.whyItWorks && (
                <AccordionItem value="why-it-works">
                  <AccordionTrigger className="text-sm font-medium py-3">Why it works</AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm pb-3">
                    {productData.whyItWorks}
                  </AccordionContent>
                </AccordionItem>
              )}
              {productData.feelsLike && (
                <AccordionItem value="feels-like">
                  <AccordionTrigger className="text-sm font-medium py-3">Feels Like</AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm pb-3">
                    {productData.feelsLike}
                  </AccordionContent>
                </AccordionItem>
              )}
              {productData.smellsLike && (
                <AccordionItem value="smells-like">
                  <AccordionTrigger className="text-sm font-medium py-3">Smells Like</AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm pb-3">
                    {productData.smellsLike}
                  </AccordionContent>
                </AccordionItem>
              )}
              {productData.goodFor && (
                <AccordionItem value="good-for">
                  <AccordionTrigger className="text-sm font-medium py-3">Good for</AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm pb-3">
                    {productData.goodFor}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          )}

          {/* Variants */}
          <div className="border-t border-gray-100 pt-6 mb-6">
            {productData.groupedVariants && productData.groupedVariants.length > 0 ? (
              productData.groupedVariants.map((group) => (
                <div key={group.type} className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{group.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const isSelected = selectedOptions[group.type]?.value === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleOptionSelect(group.type, option)}
                          className={`px-3 py-1.5 border text-xs transition-all ${isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-gray-400"
                            }`}
                          type="button"
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              // Default view if no variants defined but we have base price
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Standard</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-black bg-black text-white text-xs">
                    Default
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart Mock */}
          <Button
            className="w-full h-12 text-sm uppercase tracking-wide bg-black hover:bg-gray-800 mb-2"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : `Add to Cart - ${formatCurrencyFromCents(currentPrice, { symbolPosition: 'suffix', symbol: ' THB' })}`}
          </Button>
          <p className="text-[10px] text-center text-gray-400 mb-8">
            Free shipping for orders over 2,000 THB
          </p>

          {/* Complimentary Gift */}
          {productData.complimentaryGift && (
            <div className="mb-8">
              <ComplimentaryGift gift={productData.complimentaryGift} />
            </div>
          )}
        </div>

        {/* Ingredients Block Preview */}
        {productData.ingredients.keyIngredients && productData.ingredients.keyIngredients.length > 0 && (
          <div className="bg-[#F9F5F0] py-8 px-4 mb-8">
            <h2 className="text-lg font-serif mb-4">THE ACTIVES WITHIN</h2>
            <div className="space-y-3">
              {productData.ingredients.keyIngredients.map((ing, i) => (
                <div key={i} className="border-b border-gray-200/50 pb-2 last:border-0">
                  <h3 className="text-sm font-medium uppercase tracking-wide mb-1">{ing.name}</h3>
                  <p className="text-xs text-gray-600">{ing.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How To Use Preview */}
        {productData.howToUse.steps && productData.howToUse.steps.length > 0 && (
          <div className="px-4 mb-10 text-center">
            <h2 className="text-xl font-serif mb-6">How to Use</h2>
            <div className="grid grid-cols-2 gap-4">
              {productData.howToUse.steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mb-3 text-lg font-serif">
                    {i + 1}
                  </div>
                  <h3 className="text-xs font-medium text-[#4A90E2] mb-1">{step.title}</h3>
                  <p className="text-[10px] text-gray-600 line-clamp-3">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real User Reviews Preview */}
        {(productData.realUserReviews?.image || productData.realUserReviews?.content) && (
          <div className="px-4 mb-8">
            <div className="bg-[#F9F5F0] p-6 rounded-xl">
              {productData.realUserReviews.image && (
                <div className="aspect-square w-full rounded-lg overflow-hidden mb-4 relative">
                  <img
                    src={productData.realUserReviews.image}
                    alt="Review"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-2xl font-serif italic mb-1">Loved</div>
                    <div className="text-xs uppercase tracking-widest">By Real Users</div>
                  </div>
                </div>
              )}
              <h3 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">เสียงจากผู้ใช้จริง</h3>
              <p className="text-sm font-medium whitespace-pre-line">{productData.realUserReviews.content}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
