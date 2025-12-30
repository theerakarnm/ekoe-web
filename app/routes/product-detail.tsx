import { useState, useMemo, useEffect } from "react";
import { useCartStore } from "~/store/cart";
import { toast } from "sonner";
import type { Route } from "./+types/product-detail";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";
import type { IProduct } from "~/interface/product.interface";
import { Button } from "~/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { ProductGallery } from "~/components/product/product-gallery";
import { QuantitySelector } from "~/components/product/quantity-selector";
import { DiscountCodes } from "~/components/product/discount-codes";
import { ComplimentaryGift } from "~/components/product/complimentary-gift";
import { ProductTabs } from "~/components/product/product-tabs";
import { RelatedProducts } from "~/components/product/related-products";
import { ProductHeroCTA } from "~/components/product/product-hero-cta";
import { HowToUseMedia } from "~/components/product/how-to-use-media";
import { StickyImageScroll } from "~/components/product/sticky-image-scroll";

import { getProduct, getLinkedCoupons, type Product } from "~/lib/services/product.service";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { Link } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const { id } = params as { id: string };
    if (!id) {
      throw new Response("Product ID is required", { status: 400 });
    }

    // Fetch product only - related products now handled by component
    const product = await getProduct(id);

    // Fetch linked coupons
    let linkedCoupons: any[] = [];
    try {
      linkedCoupons = await getLinkedCoupons(product.id);
    } catch (error) {
      console.error("Failed to fetch linked coupons", error);
    }

    return { product, linkedCoupons };
  } catch (error: any) {
    // Handle 404 errors for non-existent products
    if (error?.statusCode === 404 || error?.response?.status === 404) {
      throw new Response("Product Not Found", { status: 404 });
    }

    // Re-throw other errors
    throw new Response("Failed to load product", { status: 500 });
  }
}

interface ExtendedSize {
  label: string;
  value: string;
  price: number;
  stockQuantity: number;
  variantId: string;
  variantType: string;
}

// Grouped variants by type
interface GroupedVariant {
  type: string;
  options: ExtendedSize[];
}

function mapApiProductToDetail(apiProduct: Product): IProduct & {
  extendedSizes?: ExtendedSize[];
  groupedVariants?: GroupedVariant[];
  productType: 'single' | 'set' | 'bundle';
  setItems?: {
    productId: string;
    name: string;
    description: string | null;
    subtitle: string | null;
    image: string | null;
    quantity: number | null;
  }[];
  benefits?: string[];
} {
  const primaryImage = apiProduct.images?.find(img => img.isPrimary) || apiProduct.images?.[0];
  const galleryImages = apiProduct.images?.map(img => ({
    url: img.url,
    description: img.altText || img.description || apiProduct.name,
    associatedSize: img.variantId ? apiProduct.variants?.find(v => v.id === img.variantId?.toString())?.value : undefined
  })) || [];

  const sizes = apiProduct.variants?.map(v => ({
    label: v.name,
    value: v.value,
    price: v.price
  })) || [];

  // Extended sizes with stock and variant type information
  const extendedSizes = apiProduct.variants?.map(v => ({
    label: v.name,
    value: v.value,
    price: v.price,
    stockQuantity: v.stockQuantity,
    variantId: v.id,
    variantType: (v as { variantType?: string }).variantType || 'Size'
  })) || [];

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

  const variants = groupedVariants.map(g => ({
    label: g.type,
    details: g.options.map(o => ({
      id: o.variantId,
      label: o.label,
      value: o.value,
      price: o.price,
      stockQuantity: o.stockQuantity,
    }))
  }));

  return {
    productId: apiProduct.id,
    productName: apiProduct.name,
    subtitle: apiProduct.subtitle || "",
    priceTitle: sizes && sizes.length > 0
      ? `${formatCurrencyFromCents(Math.min(...sizes.map(s => s.price)), { symbolPosition: 'suffix', symbol: ' THB' })} - ${formatCurrencyFromCents(Math.max(...sizes.map(s => s.price)), { symbolPosition: 'suffix', symbol: ' THB' })}`
      : `${formatCurrencyFromCents(apiProduct.basePrice, { symbolPosition: 'suffix', symbol: ' THB' })}`,
    quickCartPrice: apiProduct.basePrice,
    image: {
      url: primaryImage?.url || "",
      description: primaryImage?.altText || "",
    },
    galleryImages: galleryImages?.length ? galleryImages : [],
    rating: parseFloat(apiProduct.rating || '0') || 0,
    description: apiProduct.description ? [apiProduct.description] : [],
    sizes: sizes?.length ? sizes : [],
    extendedSizes: extendedSizes.length ? extendedSizes : undefined,
    groupedVariants: groupedVariants.length ? groupedVariants : undefined,
    variants: variants.length ? variants : undefined,
    // Additional product details from API
    ingredients: apiProduct.ingredients,
    howToUse: apiProduct.howToUse,
    goodFor: apiProduct.goodFor || undefined,
    whyItWorks: apiProduct.whyItWorks || undefined,
    feelsLike: apiProduct.feelsLike || undefined,
    smellsLike: apiProduct.smellsLike || undefined,
    complimentaryGift: apiProduct.complimentaryGift ? {
      name: apiProduct.complimentaryGift.name || "",
      description: apiProduct.complimentaryGift.description || "",
      image: apiProduct.complimentaryGift.image || "",
      value: apiProduct.complimentaryGift.value,
    } : undefined,
    realUserReviews: apiProduct.realUserReviews ? {
      image: apiProduct.realUserReviews.image || "",
      content: apiProduct.realUserReviews.content || "",
    } : undefined,
    // Product type and set-specific data
    productType: apiProduct.productType,
    setItems: apiProduct.setItems,
    benefits: apiProduct.benefits,
    tags: apiProduct.tags?.map(t => t.name) || [],
    // CTA Hero Section
    ctaBackgroundUrl: apiProduct.ctaBackgroundUrl || undefined,
    ctaBackgroundType: apiProduct.ctaBackgroundType as 'image' | 'video' | undefined,
    // Scrolling Experience
    scrollingExperience: apiProduct.scrollingExperience || undefined,
  };
}



export function meta({ data }: Route.MetaArgs) {
  const product = data?.product;
  return [
    { title: `${product?.name || 'Product'} - Ekoe` },
    { name: "description", content: product?.metaDescription || product?.shortDescription || "Product Detail" },
  ];
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  const { product: apiProduct, linkedCoupons } = loaderData;
  const productData = useMemo(() => {
    const details = mapApiProductToDetail(apiProduct);

    // Attach linked coupons if available
    if (linkedCoupons && linkedCoupons.length > 0) {
      return {
        ...details,
        discountCodes: linkedCoupons.map((c: any) => ({
          code: c.code,
          title: c.title,
          condition: c.description || (c.minPurchaseAmount ? `เมื่อช้อปครบ ${(c.minPurchaseAmount / 100).toLocaleString()} บาท` : 'ไม่มีขั้นต่ำ')
        }))
      };
    }

    return details;
  }, [apiProduct, linkedCoupons]);

  console.log(productData);

  // Use extended sizes if available, otherwise fall back to regular sizes
  const availableSizes = useMemo(() =>
    productData.extendedSizes || productData.sizes?.map((s: { label: string; value: string; price: number }) => ({ ...s, stockQuantity: 999, variantId: '', variantType: 'Size' })) || [],
    [productData]
  );

  // Initialize selections
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

  // Sync state if initialSelections changes
  useEffect(() => {
    setSelectedOptions(initialSelections);
  }, [initialSelections]);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(productData.image.url);

  // Sync image when product changes
  useEffect(() => {
    setSelectedImage(productData.image.url);
  }, [productData.image.url]);

  // Derived state
  const isOutOfStock = Object.values(selectedOptions).some(opt => opt.stockQuantity === 0);

  const maxQuantity = Object.values(selectedOptions).length > 0
    ? Math.min(...Object.values(selectedOptions).map(o => o.stockQuantity))
    : 999;

  const currentPrice = useMemo(() => {
    const variantsPrice = Object.values(selectedOptions).reduce((sum, opt) => sum + opt.price, 0);
    return variantsPrice > 0 ? variantsPrice : productData.quickCartPrice;
  }, [selectedOptions, productData.quickCartPrice]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      return Math.max(1, Math.min(newQuantity, maxQuantity));
    });
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const selectedInfos = Object.values(selectedOptions).sort((a, b) => a.variantType.localeCompare(b.variantType));
    const variantName = selectedInfos.map(s => `${s.variantType}: ${s.label}`).join(', ');

    // Build composite variantId from all selected options (sorted for consistency)
    const variantId = selectedInfos.map(s => s.variantId).join('-') || undefined;

    // Use the currently selected image (which updates when variant changes)
    // This ensures the cart shows the correct product image for the selected variant
    const cartImage = selectedImage || productData.image.url;

    addItem({
      productId: String(productData.productId),
      variantId: variantId,
      productName: productData.productName,
      image: cartImage,
      price: currentPrice,
      quantity: quantity,
      variantName: variantName || undefined,
    });

    toast.success(`Added ${quantity} x ${productData.productName} to cart`);
  };

  const handleOptionSelect = (type: string, option: ExtendedSize) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: option
    }));

    // Reset quantity if strictly needed, though logic uses derived maxQuantity
    if (quantity > option.stockQuantity) {
      setQuantity(Math.max(1, option.stockQuantity));
    }

    // Update image if associated
    const associatedImage = productData.galleryImages?.find(
      (img) => img.associatedSize === option.value
    );
    if (associatedImage) {
      setSelectedImage(associatedImage.url);
    }
  };

  const handleImageClick = (img: { url: string; associatedSize?: string }) => {
    setSelectedImage(img.url);
    if (img.associatedSize) {
      if (productData.groupedVariants) {
        for (const group of productData.groupedVariants) {
          const opt = group.options.find(o => o.value === img.associatedSize);
          if (opt) {
            handleOptionSelect(group.type, opt);
            break;
          }
        }
      } else {
        const foundOption = availableSizes.find((s: ExtendedSize) => s.value === img.associatedSize);
        if (foundOption) {
          handleOptionSelect('Size', foundOption);
        }
      }
    }
  };


  const baseUrl = "https://ekoe.com"; // ideally from env

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": productData.productName,
    "image": productData.galleryImages?.map(img => img.url) || [productData.image.url],
    "description": productData.description?.join(" ") || productData.subtitle,
    "brand": {
      "@type": "Brand",
      "name": "Ekoe"
    },
    "sku": productData.productId,
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/product-detail/${productData.productId}`,
      "priceCurrency": "THB",
      "price": currentPrice / 100, // Assuming price is in cents
      "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": productData.rating ? {
      "@type": "AggregateRating",
      "ratingValue": productData.rating,
      "reviewCount": productData.reviewCount || 1
    } : undefined
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${baseUrl}/`
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": "Shop",
      "item": `${baseUrl}/shop`
    }, {
      "@type": "ListItem",
      "position": 3,
      "name": productData.productName,
      "item": `${baseUrl}/product-detail/${productData.productId}`
    }]
  };

  const hasCTABackground = productData.ctaBackgroundUrl && productData.ctaBackgroundType;

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header isTransparent={hasCTABackground ? true : undefined} />

      {/* CTA Hero Section - shown when background is configured */}
      {hasCTABackground && (
        <ProductHeroCTA
          key={productData.productId}
          productName={productData.productName}
          rating={productData.rating || 0}
          reviewCount={productData.reviewCount}
          price={currentPrice}
          primaryImage={productData.image.url}
          backgroundUrl={productData.ctaBackgroundUrl!}
          backgroundType={productData.ctaBackgroundType!}
          isOutOfStock={isOutOfStock}
          onAddToCart={handleAddToCart}
        />
      )}

      <main className={hasCTABackground ? "pb-16" : "pt-16 pb-16"}>
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Breadcrumb */}
          <div className={`text-sm text-gray-500 mb-8 ${hasCTABackground ? 'mt-8' : ''}`}>
            <Link to="/" className=" hover:text-gray-900">Home</Link>
            {' / '}
            <Link to="/shop" className=" hover:text-gray-900">Shop</Link>
            {apiProduct.category?.name ? ` / ${apiProduct.category.name}` : ''} / {productData.productName}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            {/* Left Column - Images */}
            <ProductGallery
              images={productData.galleryImages || []}
              selectedImage={selectedImage}
              onImageClick={handleImageClick}
              enableZoom={true}
              enableFullscreen={true}
            />

            {/* Right Column - Product Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-2 mb-2">
                    {/* <span className="bg-black text-white text-xs px-2 py-1">
                      15% OFF
                    </span> */}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-heading mb-2">
                    {productData.productName}
                  </h1>
                  <p className="text-lg text-gray-600 italic mb-4">
                    {productData.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.floor(productData.rating || 5) ? "currentColor" : "none"}
                          className={i < Math.floor(productData.rating || 5) ? "" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({productData.reviewCount || 20} Reviews)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {productData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-[#ffefce] px-3 py-1 rounded-full text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart size={24} />
                </button>
              </div>



              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div className="flex flex-wrap w-full">
                  {productData.description?.map((desc, idx) => (
                    <p key={idx} className="wrap-break-word font-thai w-full">{desc}</p>
                  ))}
                </div>
                {productData.productType === 'set' && productData.setItems && productData.setItems.length > 0 ? (
                  <div className="mt-8 space-y-6">
                    {productData.setItems.map((item, idx) => (
                      <div key={idx} className={`flex gap-4 items-center ${idx < (productData.setItems?.length || 0) - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
                        <div className="w-16 h-16 bg-gray-50 rounded shrink-0 overflow-hidden mix-blend-multiply">
                          <img
                            src={item.image || productData.image.url}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium uppercase tracking-wide">{item.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{item.subtitle || item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-gray-600 mt-4">
                    {productData.benefits?.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Accordions: Why it works / Good for */}
              <Accordion type="single" collapsible className="w-full border-t border-gray-100 mt-6">
                {
                  productData.whyItWorks && (
                    <AccordionItem value="why-it-works">
                      <AccordionTrigger className="text-sm font-medium">Why it works</AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-sm font-thai">
                        {productData.whyItWorks}
                      </AccordionContent>
                    </AccordionItem>
                  )
                }
                {
                  productData.feelsLike && (
                    <AccordionItem value="feels-like">
                      <AccordionTrigger className="text-sm font-medium">Feels Like</AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-sm font-thai">
                        {productData.feelsLike}
                      </AccordionContent>
                    </AccordionItem>
                  )
                }
                {
                  productData.smellsLike && (
                    <AccordionItem value="smells-like">
                      <AccordionTrigger className="text-sm font-medium">Smells Like</AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-sm font-thai">
                        {productData.smellsLike}
                      </AccordionContent>
                    </AccordionItem>
                  )
                }
                {
                  productData.goodFor && (
                    <AccordionItem value="good-for">
                      <AccordionTrigger className="text-sm font-medium">Good for</AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-sm font-thai">
                        {productData.goodFor}
                      </AccordionContent>
                    </AccordionItem>
                  )
                }
              </Accordion>

              <div className="space-y-6 pt-6 border-t border-gray-100">
                {/* Size Selection */}
                {/* Variant Selection */}
                <div className="space-y-6">
                  {productData.groupedVariants && productData.groupedVariants.length > 0 ? (
                    productData.groupedVariants.map((group) => (
                      <div key={group.type}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{group.type}</span>
                          {group.type === 'Size' && (
                            <Button variant={'link'} className="text-xs text-gray-500 underline">
                              Size Guide
                            </Button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {group.options.map((option) => {
                            const outOfStock = option.stockQuantity === 0;
                            const isSelected = selectedOptions[group.type]?.value === option.value;
                            return (
                              <button
                                key={option.value}
                                onClick={() => !outOfStock && handleOptionSelect(group.type, option)}
                                disabled={outOfStock}
                                className={`px-4 py-2 border text-sm transition-all relative ${isSelected
                                  ? "border-black bg-black text-white"
                                  : outOfStock
                                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "border-gray-200 hover:border-gray-400"
                                  }`}
                              >
                                {option.label}
                                {outOfStock && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="w-full h-px bg-gray-400 rotate-[-20deg]"></span>
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Size</span>
                        <Button variant={'link'} className="text-xs text-gray-500 underline">
                          Size Guide
                        </Button>
                      </div>
                      <div className="flex gap-3">
                        {availableSizes.map((size: ExtendedSize) => {
                          const isSelected = selectedOptions['Size']?.value === size.value;
                          const sizeOutOfStock = size.stockQuantity === 0;
                          const isLowStock = size.stockQuantity > 0 && size.stockQuantity <= 5;
                          return (
                            <button
                              key={size.value}
                              onClick={() => !sizeOutOfStock && handleOptionSelect('Size', size)}
                              disabled={sizeOutOfStock}
                              className={`px-4 py-2 border text-sm transition-all relative ${isSelected
                                ? "border-black bg-black text-white"
                                : sizeOutOfStock
                                  ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "border-gray-200 hover:border-gray-400"
                                }`}
                            >
                              {size.label}
                              {sizeOutOfStock && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="w-full h-px bg-gray-400 rotate-[-20deg]"></span>
                                </span>
                              )}
                              {isLowStock && !sizeOutOfStock && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  {isOutOfStock && (
                    <p className="text-sm text-red-600 mt-2">Out of Stock</p>
                  )}
                  {!isOutOfStock && maxQuantity <= 5 && (
                    <p className="text-sm text-orange-600 mt-2">
                      Only {maxQuantity} left in stock
                    </p>
                  )}
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex gap-4">
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => handleQuantityChange(1)}
                    onDecrease={() => handleQuantityChange(-1)}
                    disabled={isOutOfStock}
                  />
                  <Button
                    className="flex-1 h-12 text-base uppercase tracking-wide bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    {isOutOfStock ? 'Out of Stock' : `Add to Cart - ${formatCurrencyFromCents(currentPrice * quantity, { symbolPosition: 'suffix', symbol: ' THB' })}`}
                  </Button>
                </div>

                <div className="text-xs text-center text-gra-y-500">
                  Free shipping for every orders
                </div>

                {/* Discount Codes - New Position & Design */}
                {productData.discountCodes && (
                  <DiscountCodes codes={productData.discountCodes} />
                )}

                {/* Complimentary Gift */}
                {(productData.complimentaryGift && (productData.complimentaryGift?.name?.length || 0) > 0) ? (
                  <ComplimentaryGift gift={productData.complimentaryGift} />
                ) : null}
              </div>
            </div>
          </div>

          {/* Conditional Section: Ingredients (single) OR About/Benefits (set) */}
          {productData.productType === 'set' ? (
            /* About & Benefits Section for Product Sets */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-serif mb-4">About {productData.productName}</h2>
                  <div className="w-12 h-0.5 bg-black mb-6"></div>
                  <div className="flex flex-wrap w-full text-gray-600 leading-relaxed">
                    {productData.description?.map((desc, idx) => (
                      <p key={idx} className="wrap-break-word w-full">{productData.description?.join(' ')}</p>
                    ))}
                  </div>
                </div>
                {productData.benefits && productData.benefits.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-serif mb-4">Benefit</h2>
                    <div className="w-12 h-0.5 bg-black mb-6"></div>
                    <div className="space-y-2">
                      <ul className="space-y-2">
                        {productData.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1 h-1 bg-black rounded-full"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative aspect-square lg:aspect-4/3 bg-gray-100">
                <img
                  src={productData.ingredients?.image || productData.galleryImages?.[1]?.url || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000"}
                  alt={`About ${productData.productName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            /* Key Ingredients Section for Single Products */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">
              <div>
                <h2 className="text-3xl font-heading mb-10 font-bold">THE ACTIVES WITHIN</h2>
                <div className="space-y-8">
                  {productData.ingredients?.keyIngredients?.map((ing, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-2xl font-heading font-bold uppercase tracking-wide">
                        {ing.name}
                      </h3>
                      <p className="text-base uppercase tracking-wider text-gray-800">
                        {ing.description}
                      </p>
                    </div>
                  ))}
                  {productData.ingredients?.fullList && (
                    <Accordion type="single" collapsible className="w-full mt-8">
                      <AccordionItem value="full-list">
                        <AccordionTrigger className="text-lg font-bold uppercase tracking-wide">
                          Full Ingredients List
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed text-sm font-mono">
                          {productData.ingredients?.fullList}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              </div>
              <div className="relative aspect-square lg:aspect-4/3 bg-gray-100">
                <img
                  src={productData.ingredients?.image || "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&q=80&w=1200"}
                  alt="Ingredients"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Sticky Image Scroll Section */}
          {/* {productData.scrollingExperience && productData.scrollingExperience.length > 0 && (
            <StickyImageScroll blocks={productData.scrollingExperience} />
          )} */}

          {/* Conditional Section: Real User Reviews (single) OR This Set Includes (set) */}
          {productData.productType === 'set' && productData.setItems && productData.setItems.length > 0 ? (
            /* This Set Includes Section for Product Sets */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
              <div className="relative aspect-square lg:aspect-4/3 bg-gray-100 order-2 lg:order-1">
                <img
                  src={productData.galleryImages?.[0]?.url || productData.image.url}
                  alt="Set Includes"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl font-serif mb-2">This Set Includes</h2>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                  {productData.setItems.map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-lg font-medium uppercase tracking-wide">
                        {item.name}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed space-y-2">
                        <p>{item.description || item.subtitle}</p>
                        {item.quantity && item.quantity > 1 && (
                          <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ) : (
            /* Loved by Real Users - เสียงจากผู้ใช้จริง for Single Products */
            (productData.realUserReviews?.image || (productData.realUserReviews?.content?.length || 0) > 0) && (
              <div className="mb-24 bg-[#F9F5F0] p-8 md:p-16 rounded-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center font-heading">
                  <div className="relative aspect-4/5 lg:aspect-square overflow-hidden rounded-lg">
                    <img
                      src={productData.realUserReviews?.image || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000"}
                      alt="Real User Reviews"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                      <div className="text-5xl font-serif italic mb-2">Loved</div>
                      <div className="text-xl uppercase tracking-widest">By Real Users</div>
                    </div>
                  </div>
                  <div className="space-y-12">
                    <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-8">
                      เสียงจากผู้ใช้จริง
                    </h3>
                    <div className="space-y-10">
                      <div className="text-xl md:text-2xl font-medium whitespace-pre-line">
                        {productData.realUserReviews?.content || productData.userStats}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-8 italic">
                      ผลลัพธ์ที่พิสูจน์ได้ด้วยตัวเองจากการใช้จริงในทุกวัน
                    </p>
                  </div>
                </div>
              </div>
            )
          )}

          {/* How to Use Section - Text Steps */}
          {productData.howToUse?.steps && productData.howToUse.steps.length > 0 && (
            <div className="mb-24">
              <h2 className="text-3xl font-serif mb-8 text-start font-bold">How to Use</h2>
              <div className="text-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  {productData.howToUse.steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center group">
                      <div className="w-24 h-24 rounded-full border border-gray-200 flex items-center justify-center mb-6 group-hover:border-black transition-colors duration-300">
                        <div className="text-2xl font-serif">{idx + 1}</div>
                      </div>
                      <h3 className="text-lg font-medium text-[#4A90E2] mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pro Tips */}
                {productData.howToUse?.proTips && productData.howToUse.proTips.length > 0 && (
                  <div className="max-w-2xl mx-auto mb-12 space-y-4">
                    <h3 className="text-lg font-medium text-center mb-4">💡 Pro Tips</h3>
                    {productData.howToUse.proTips.map((tip, index) => (
                      <div key={index} className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                        <p className="text-sm text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Application Section - Video/Image Media */}
          {productData.howToUse?.mediaUrl && productData.howToUse?.mediaType && (
            <div className="mb-24">
              <h2 className="text-3xl font-serif mb-8 text-start font-bold">Application</h2>
              <HowToUseMedia
                productName={productData.productName}
                productImage={productData.image.url}
                price={currentPrice}
                mediaUrl={productData.howToUse.mediaUrl}
                mediaType={productData.howToUse.mediaType}
                onAddToCart={handleAddToCart}
              />
            </div>
          )}

          {/* Related Products */}
          <RelatedProducts
            productId={apiProduct.id}
            title="You May Also Like"
            limit={4}
          />
        </div>
      </main >

      <Footer />
    </div >
  );
}
