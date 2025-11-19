import { useState } from "react";
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
import { Star, Heart, Minus, Plus, ShoppingBag } from "lucide-react";

// Mock Data
const productData: IProduct = {
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
      description: "The Body Oil Front",
    },
    {
      url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
      description: "The Body Oil Texture",
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
  userStats: [
    {
      percentage: 98,
      description: "รู้สึกถึงการซึมซาบอย่างรวดเร็ว",
    },
    {
      percentage: 93,
      description: "สังเกตว่าผิวดูกระจ่างใสขึ้น",
    },
    {
      percentage: 96,
      description: "รู้สึกว่าผิวชุ่มชื้นทันที",
    },
  ],
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
};

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "The Body Oil - Ekoe" },
    { name: "description", content: "Absolute Rebalance Revitalizing Body Oil" },
  ];
}

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState(productData.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(productData.image.url);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <Header isLandingMagic={false} />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Breadcrumb - simplified for now */}
          <div className="text-sm text-gray-500 mb-8">
            Home / Body / The Body Oil
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="aspect-4/5 bg-gray-100 overflow-hidden rounded-lg relative">
                <img
                  src={selectedImage}
                  alt="Product Main"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 uppercase tracking-wider">
                  Best Seller
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {productData.galleryImages?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
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

              <div className="space-y-6 pt-6 border-t border-gray-100">
                {/* Size Selection */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Size</span>
                    <button className="text-xs text-gray-500 underline">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-3">
                    {productData.sizes?.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border text-sm transition-all ${selectedSize?.value === size.value
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400"
                          }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex gap-4">
                  <div className="flex items-center border border-gray-200 w-32">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-10 h-12 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="flex-1 text-center font-medium">
                      {quantity}
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-12 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <Button className="flex-1 h-12 text-base uppercase tracking-wide bg-black hover:bg-gray-800">
                    Add to Cart - {(selectedSize?.price || 0) * quantity} THB
                  </Button>
                </div>

                <div className="text-xs text-center text-gray-500">
                  Free shipping for orders over 2,000 THB
                </div>

                {/* Discount Codes - New Position & Design */}
                {productData.discountCodes && productData.discountCodes.length > 0 && (
                  <div className="pt-4">
                    <div className="flex justify-between items-baseline mb-4">
                      <h3 className="text-lg font-serif">Discount Code</h3>
                      <button className="text-xs text-gray-500 underline hover:text-black">see all</button>
                    </div>
                    <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 scrollbar-hide">
                      {productData.discountCodes.map((code, idx) => (
                        <div key={idx} className="flex-shrink-0 w-72 flex border-r border-gray-200 last:border-0 pr-4 mr-4 last:mr-0 last:pr-0">
                          <div className="flex-1 pr-4">
                            <div className="font-bold text-base mb-1">{code.title}</div>
                            <div className="text-xs text-gray-400 mb-2">{code.condition}</div>
                            <button className="text-xs text-gray-500 underline hover:text-black">รายละเอียด</button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => copyToClipboard(code.code)}
                              className="h-10 px-4 border border-gray-200 text-sm font-medium hover:border-black hover:bg-black hover:text-white transition-all whitespace-nowrap"
                            >
                              {copiedCode === code.code ? "คัดลอกแล้ว" : "คัดลอกโค้ด"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complimentary Gift */}
                {productData.complimentaryGift && (
                  <div className="bg-[#F9F5F0] p-4 rounded-lg flex gap-4 items-center border border-[#E6DCC8]">
                    <div className="w-16 h-16 bg-white rounded-md overflow-hidden shrink-0 border border-gray-100">
                      <img
                        src={productData.complimentaryGift.image}
                        alt="Gift"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#D4A373] text-white text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium">
                          Free Gift
                        </span>
                        {productData.complimentaryGift.value && (
                          <span className="text-xs text-gray-500 line-through">
                            {productData.complimentaryGift.value}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {productData.complimentaryGift.name}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {productData.complimentaryGift.description}
                      </p>
                    </div>
                  </div>
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
                  Consumer Perception Study
                </h3>
                <div className="space-y-10">
                  {productData.userStats?.map((stat, idx) => (
                    <div key={idx}>
                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-5xl md:text-6xl font-serif text-[#D4A373]">
                          {stat.percentage}%
                        </span>
                        <span className="text-xl md:text-2xl font-medium">
                          {stat.description}
                        </span>
                      </div>
                      {stat.subtext && (
                        <p className="text-gray-500 ml-20">
                          {stat.subtext}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-8 italic">
                  *Based on a consumer perception study of 50 participants over 4 weeks.
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

          {/* Newsletter Section - Matching the image */}
          <div className="relative h-64 rounded-2xl overflow-hidden mb-24">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600"
              alt="Beach"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-full max-w-xl px-4 flex gap-2">
                <div className="flex-1 bg-white/90 backdrop-blur rounded-l-full pl-6 pr-4 py-4 flex items-center">
                  <span className="text-gray-500 text-sm mr-4">Join our newsletter</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent border-none outline-none flex-1 text-sm"
                  />
                </div>
                <button className="bg-black text-white px-8 py-4 rounded-r-full uppercase text-xs tracking-widest font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
