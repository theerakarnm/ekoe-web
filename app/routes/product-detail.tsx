import { useState } from "react";
import { useCartStore } from "~/store/cart";
import { toast } from "sonner";
import { useLoaderData } from "react-router";
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
import { Separator } from "~/components/ui/separator";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { ProductCard } from "~/components/share/product-card";
import { ProductGallery } from "~/components/product/product-gallery";
import { QuantitySelector } from "~/components/product/quantity-selector";
import { DiscountCodes } from "~/components/product/discount-codes";
import { ComplimentaryGift } from "~/components/product/complimentary-gift";
import { getProduct, getRelatedProducts, type Product } from "~/lib/services/product.service";
import { formatNumber } from "~/lib/formatter";

// Mock Data used as defaults for missing API fields
const MOCK_DEFAULTS: IProduct = {
  productId: 1,
  productName: "THE BODY OIL",
  subtitle: "Absolute Rebalance Revitalizing",
  priceTitle: "2,590 THB",
  quickCartPrice: 2590,
  image: {
    url: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800",
    description: "The Body Oil Bottle",
  },
  galleryImages: [
    {
      url: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800",
      description: "The Body Oil 100ml Front",
      associatedSize: "100ml",
    },
    {
      url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
      description: "The Body Oil 100ml Texture",
      associatedSize: "100ml",
    },
    {
      url: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800",
      description: "The Body Oil 200ml Front",
      associatedSize: "200ml",
    },
    {
      url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
      description: "The Body Oil 200ml Lifestyle",
      associatedSize: "200ml",
    },
  ],
  rating: 4.9,
  reviewCount: 124,
  tags: ["Vegan", "Cruelty Free", "Non-Toxic", "PEG Free", "Nano Free"],
  description: [
    "ออยล์บำรุงผิวกายเนื้อบางเบา ซึมซาบไว ไม่เหนียวเหนอะหนะ",
    "ช่วยเติมความชุ่มชื้นให้ผิวดูโกลว์ สุขภาพดี",
    "พร้อมกลิ่นหอมผ่อนคลายจากธรรมชาติ",
  ],
  benefits: [
    "เติมความชุ่มชื้น",
    "ผิวดูโกลว์",
    "ซึมซาบไว",
    "กลิ่นหอมผ่อนคลาย",
  ],
  sizes: [
    { label: "100 ml", value: "100ml", price: 2590 },
    { label: "200 ml", value: "200ml", price: 4590 },
  ],
  ingredients: {
    keyIngredients: [
      {
        name: "CHILEAN HAZELNUT OIL",
        description: "Rich in Vitamin A and E, helps to moisturize and nourish the skin.",
      },
      {
        name: "JOJOBA OIL",
        description: "Similar to skin's natural sebum, provides deep hydration without clogging pores.",
      },
    ],
    fullList: "Caprylic/Capric Triglyceride, Helianthus Annuus (Sunflower) Seed Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Gevuina Avellana Seed Oil, ...",
  },
  userStats: "กว่า 98% รู้สึกถึงการซึมซาบอย่างรวดเร็ว 93% สังเกตว่าผิวดูกระจ่างใสขึ้นและ 96% รู้สึกว่าผิวชุ่มชื้นทันที",
  howToUse: {
    steps: [
      {
        title: "ก่อนอาบน้ำ",
        description: "นวดออยล์ลงบนผิวแห้ง ทิ้งไว้ 10-15 นาที เพื่อบำรุงล้ำลึก แล้วล้างออก",
        icon: "shower",
      },
      {
        title: "หลังอาบน้ำ",
        description: "ลูบไล้ออยล์ลงบนผิวหมาดๆ ทันที เพื่อกักเก็บความชุ่มชื้น",
        icon: "drop",
      },
      {
        title: "ระหว่างวัน",
        description: "ทาบริเวณที่แห้งกร้าน เช่น ข้อศอก เข่า เพื่อเพิ่มความชุ่มชื้น",
        icon: "sun",
      },
      {
        title: "Mix",
        description: "ผสมกับโลชั่นที่ใช้ประจำ เพื่อเพิ่มประสิทธิภาพการบำรุง",
        icon: "mix",
      },
    ],
    note: "Pro Tip: วอร์มออยล์บนฝ่ามือ 3-5 วินาที ก่อนทาลงบนผิว เพื่อให้กลิ่นหอมระเหยได้ดีขึ้น",
  },
  discountCodes: [
    { title: "ลดทันที 999.-", condition: "เมื่อยอดสั่งซื้อมากกว่า 1,500 บาท", code: "WELCOME10" },
    { title: "ลดทันที 999.-", condition: "เมื่อยอดสั่งซื้อมากกว่า 1,500 บาท", code: "BODYOIL20" },
  ],
  complimentaryGift: {
    name: "Mini Body Scrub (50g)",
    description: "Exfoliate and renew your skin with our gentle body scrub.",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800",
    value: "390 THB",
  },
  whyItWorks: "การทำงานร่วมกันของ The Oil Bar ที่ทำความสะอาดพร้อมคงความชุ่มชื้น และ The Body Oil ที่ช่วยล็อคความชุ่มชื้นและบำรุงล้ำลึก ทำให้ผิวได้รับการดูแลอย่างเต็มประสิทธิภาพในทุกขั้นตอน",
  goodFor: "เหมาะสำหรับทุกสภาพผิว โดยเฉพาะผิวแห้งที่ต้องการความชุ่มชื้นเป็นพิเศษ และผู้ที่ต้องการผิวโกลว์สวยอย่างเป็นธรรมชาติ",
};

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const { id } = params as { id: string };
    if (!id) {
      throw new Response("Product ID is required", { status: 400 });
    }
    
    // Fetch product and related products in parallel
    const [product, relatedProducts] = await Promise.all([
      getProduct(id),
      getRelatedProducts(id, 4)
    ]);
    
    return { product, relatedProducts };
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
}

function mapApiProductToDetail(apiProduct: Product): IProduct & { extendedSizes?: ExtendedSize[] } {
  const primaryImage = apiProduct.images?.find(img => img.isPrimary) || apiProduct.images?.[0];
  const galleryImages = apiProduct.images?.map(img => ({
    url: img.url,
    description: img.altText || img.description || apiProduct.name,
    associatedSize: img.variantId ? apiProduct.variants?.find(v => v.id === img.variantId?.toString())?.value : undefined
  })) || MOCK_DEFAULTS.galleryImages;

  const sizes = apiProduct.variants?.map(v => ({
    label: v.name,
    value: v.value,
    price: v.price
  })) || MOCK_DEFAULTS.sizes;

  // Extended sizes with stock information
  const extendedSizes = apiProduct.variants?.map(v => ({
    label: v.name,
    value: v.value,
    price: v.price,
    stockQuantity: v.stockQuantity,
    variantId: v.id
  })) || [];

  return {
    ...MOCK_DEFAULTS, // Use defaults for missing fields
    productId: apiProduct.id,
    productName: apiProduct.name,
    subtitle: apiProduct.subtitle || MOCK_DEFAULTS.subtitle,
    priceTitle: sizes && sizes.length > 0
      ? `${formatNumber(Math.min(...sizes.map(s => s.price)), { decimalPlaces: 0 })} - ${formatNumber(Math.max(...sizes.map(s => s.price)), { decimalPlaces: 0 })} THB`
      : `${formatNumber(apiProduct.basePrice, { decimalPlaces: 0 })} THB`,
    quickCartPrice: apiProduct.basePrice,
    image: {
      url: primaryImage?.url || MOCK_DEFAULTS.image.url,
      description: primaryImage?.altText || MOCK_DEFAULTS.image.description,
    },
    galleryImages: galleryImages?.length ? galleryImages : MOCK_DEFAULTS.galleryImages,
    rating: parseFloat(apiProduct.rating || '0') || MOCK_DEFAULTS.rating,
    reviewCount: apiProduct.reviewCount || MOCK_DEFAULTS.reviewCount,
    description: apiProduct.description ? [apiProduct.description] : MOCK_DEFAULTS.description,
    sizes: sizes?.length ? sizes : MOCK_DEFAULTS.sizes,
    extendedSizes: extendedSizes.length ? extendedSizes : undefined,
  };
}



export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data?.product.name || 'Product'} - Ekoe` },
    { name: "description", content: data?.product.metaDescription || data?.product.shortDescription || "Product Detail" },
  ];
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  const { product: apiProduct, relatedProducts: apiRelatedProducts } = loaderData;
  const productData = mapApiProductToDetail(apiProduct);
  const relatedProducts = apiRelatedProducts?.map(p => mapApiProductToDetail(p)) || [];
  
  // Use extended sizes if available, otherwise fall back to regular sizes
  const availableSizes = productData.extendedSizes || productData.sizes?.map(s => ({ ...s, stockQuantity: 999, variantId: '' })) || [];
  const [selectedSize, setSelectedSize] = useState<ExtendedSize | undefined>(availableSizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(productData.image.url);
  
  // Check if selected size is out of stock
  const isOutOfStock = selectedSize ? selectedSize.stockQuantity === 0 : false;
  const maxQuantity = selectedSize ? selectedSize.stockQuantity : 999;
  
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      return Math.max(1, Math.min(newQuantity, maxQuantity));
    });
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedSize || isOutOfStock) return;

    addItem({
      productId: +productData.productId,
      productName: productData.productName,
      image: productData.image.url,
      price: selectedSize.price,
      quantity: quantity,
      size: selectedSize.value,
    });

    toast.success(`Added ${quantity} x ${productData.productName} (${selectedSize.label}) to cart`);
  };

  const handleImageClick = (img: { url: string; associatedSize?: string }) => {
    setSelectedImage(img.url);
    if (img.associatedSize) {
      const size = availableSizes.find((s) => s.value === img.associatedSize);
      if (size) {
        setSelectedSize(size);
        // Reset quantity if it exceeds new size's stock
        if (quantity > size.stockQuantity) {
          setQuantity(Math.max(1, size.stockQuantity));
        }
      }
    }
  };

  const handleSizeClick = (size: ExtendedSize) => {
    setSelectedSize(size);
    // Reset quantity if it exceeds new size's stock
    if (quantity > size.stockQuantity) {
      setQuantity(Math.max(1, size.stockQuantity));
    }
    const associatedImage = productData.galleryImages?.find(
      (img) => img.associatedSize === size.value
    );
    if (associatedImage) {
      setSelectedImage(associatedImage.url);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <Header />

      <main className="pt-16 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Breadcrumb - simplified for now */}
          <div className="text-sm text-gray-500 mb-8">
            Home / Body / The Body Oil
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            {/* Left Column - Images */}
            <ProductGallery
              images={productData.galleryImages || []}
              selectedImage={selectedImage}
              onImageClick={handleImageClick}
            />

            {/* Right Column - Product Info */}
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="bg-black text-white text-xs px-2 py-1">
                      15% OFF
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif mb-2">
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
                          fill={i < Math.floor(productData.rating || 0) ? "currentColor" : "none"}
                          className={i < Math.floor(productData.rating || 0) ? "" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({productData.reviewCount} Reviews)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {productData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-[#F9F5F0] px-3 py-1 rounded-full text-gray-700"
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
                {productData.description?.map((desc, idx) => (
                  <p key={idx}>{desc}</p>
                ))}
                <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-gray-600 mt-4">
                  {productData.benefits?.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>

              {/* Accordions: Why it works / Good for */}
              <Accordion type="single" collapsible className="w-full border-t border-gray-100 mt-6">
                {
                  productData.whyItWorks && (
                    <AccordionItem value="why-it-works">
                      <AccordionTrigger className="text-sm font-medium">Why it works</AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-sm">
                        {productData.whyItWorks}
                      </AccordionContent>
                    </AccordionItem>
                  )
                }
                {
                  productData.goodFor && (
                    <AccordionItem value="good-for">
                      <AccordionTrigger className="text-sm font-medium">Good for</AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-sm">
                        {productData.goodFor}
                      </AccordionContent>
                    </AccordionItem>
                  )
                }
              </Accordion>

              <div className="space-y-6 pt-6 border-t border-gray-100">
                {/* Size Selection */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Size</span>
                    <Button variant={'link'} className="text-xs text-gray-500 underline">
                      Size Guide
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    {availableSizes.map((size) => {
                      const sizeOutOfStock = size.stockQuantity === 0;
                      const isLowStock = size.stockQuantity > 0 && size.stockQuantity <= 5;
                      
                      return (
                        <button
                          key={size.value}
                          onClick={() => !sizeOutOfStock && handleSizeClick(size)}
                          disabled={sizeOutOfStock}
                          className={`px-4 py-2 border text-sm transition-all relative ${
                            selectedSize?.value === size.value
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
                      );
                    })}
                  </div>
                  {isOutOfStock && (
                    <p className="text-sm text-red-600 mt-2">Out of Stock</p>
                  )}
                  {!isOutOfStock && selectedSize && selectedSize.stockQuantity <= 5 && (
                    <p className="text-sm text-orange-600 mt-2">
                      Only {selectedSize.stockQuantity} left in stock
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
                    {isOutOfStock ? 'Out of Stock' : `Add to Cart - ${formatNumber((selectedSize?.price || 0) * quantity, { decimalPlaces: 0 })} THB`}
                  </Button>
                </div>

                <div className="text-xs text-center text-gray-500">
                  Free shipping for orders over 2,000 THB
                </div>

                {/* Discount Codes - New Position & Design */}
                {productData.discountCodes && (
                  <DiscountCodes codes={productData.discountCodes} />
                )}

                {/* Complimentary Gift */}
                {productData.complimentaryGift && (
                  <ComplimentaryGift gift={productData.complimentaryGift} />
                )}

                {/* Delivery Info */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <ShoppingBag size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Standard Delivery</h4>
                      <p className="text-xs text-gray-500">
                        Receive within 2-3 business days
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <ShoppingBag size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Next Day Delivery</h4>
                      <p className="text-xs text-gray-500">
                        Order before 2 PM for next day delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">
            <div>
              <h2 className="text-2xl font-serif mb-8">Key Ingredients</h2>
              <Accordion type="single" collapsible className="w-full">
                {productData.ingredients?.keyIngredients.map((ing, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-lg font-medium uppercase tracking-wide">
                      {ing.name}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {ing.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
                <AccordionItem value="full-list">
                  <AccordionTrigger className="text-lg font-medium uppercase tracking-wide">
                    Full Ingredients List
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-sm font-mono">
                    {productData.ingredients?.fullList}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button variant="outline" className="mt-8 uppercase tracking-widest text-xs h-12 px-8 border-black text-black hover:bg-black hover:text-white transition-colors">
                See All Ingredients
              </Button>
            </div>
            <div className="relative aspect-square lg:aspect-4/3 bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&q=80&w=1200"
                alt="Ingredients"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Real Users Section */}
          <div className="mb-24 bg-[#F9F5F0] p-8 md:p-16 rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-4/5 lg:aspect-square overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000"
                  alt="Model"
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
                  <span className="text-xl md:text-2xl font-medium">
                    {productData.userStats}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-8 italic">
                  ผลลัพธ์ที่พิสูจน์ได้ด้วยตัวเองจากการใช้จริงในทุกวัน
                </p>
              </div>
            </div>
          </div>

          {/* How to Use Section */}
          <div className="mb-24 text-center">
            <h2 className="text-3xl font-serif mb-16">How to Use Block</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {productData.howToUse?.steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-full border border-gray-200 flex items-center justify-center mb-6 group-hover:border-black transition-colors duration-300">
                    {/* Placeholder icons */}
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

            <div className="max-w-2xl mx-auto mb-12 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700 flex items-center justify-center gap-2">
                <span className="text-red-500">⚠️</span> {productData.howToUse?.note}
              </p>
            </div>

            <Button className="h-14 px-12 bg-black text-white uppercase tracking-widest hover:bg-gray-800">
              Add to My Ritual
            </Button>
          </div>

          {/* Recommendations */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mb-24">
              <h2 className="text-2xl font-serif mb-8">Also Loved</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
