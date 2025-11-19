import { useState } from "react";
import type { Route } from "./+types/set-product-detail";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";
import type { ISetProduct } from "~/interface/set-product.interface";
import { Button } from "~/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { ProductCard } from "~/components/share/product-card";
import { ProductGallery } from "~/components/product/product-gallery";
import { QuantitySelector } from "~/components/product/quantity-selector";
import { DiscountCodes } from "~/components/product/discount-codes";
import { ComplimentaryGift } from "~/components/product/complimentary-gift";

// Mock Data for "OWN THE GLOW" Set
const setProductData: ISetProduct = {
  productId: 101,
  productName: "OWN THE GLOW",
  subtitle: "DESIGNED TO WORK IN CONCERT",
  priceTitle: "3,400 THB",
  quickCartPrice: 3400,
  image: {
    url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
    description: "Own The Glow Set",
  },
  galleryImages: [
    {
      url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
      description: "Set Front",
    },
    {
      url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
      description: "Texture",
    },
    {
      url: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800",
      description: "Bottle",
    },
  ],
  rating: 4.9,
  reviewCount: 28,
  tags: ["Easy", "Deep Hydration", "Radiant Skin", "Lightweight"],
  description: [
    "ชุดจับคู่ 2 ไอเทมที่ช่วยเติมความชุ่มชื้นและปลอบประโลมผิวอย่างล้ำลึก",
    "ในราคาพิเศษ (จากปกติ 4,000 บาท) ให้คุณเผยผิวโกลว์สวยสุขภาพดี",
    "ตั้งแต่ขั้นตอนแรก",
  ],
  includedProducts: [
    {
      name: "The Body Oil : ABSOLUTE REBALANCE MOISTURIZING",
      description: "ออยล์บำรุงผิวกายเนื้อบางเบา ซึมซาบไว ช่วยเติมความชุ่มชื้นให้ผิวดูโกลว์",
      image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=200",
      size: "100 ml",
    },
    {
      name: "The Oil Bar : REFINED OLIVE MOISTURE ESSENCE",
      description: "สบู่ทำความสะอาดผิวสูตรอ่อนโยน คงความชุ่มชื้น ไม่ทำให้ผิวแห้งตึง",
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=200",
      size: "120 g",
    },
  ],
  whyItWorks: "การทำงานร่วมกันของ The Oil Bar ที่ทำความสะอาดพร้อมคงความชุ่มชื้น และ The Body Oil ที่ช่วยล็อคความชุ่มชื้นและบำรุงล้ำลึก ทำให้ผิวได้รับการดูแลอย่างเต็มประสิทธิภาพในทุกขั้นตอน",
  goodFor: "เหมาะสำหรับทุกสภาพผิว โดยเฉพาะผิวแห้งที่ต้องการความชุ่มชื้นเป็นพิเศษ และผู้ที่ต้องการผิวโกลว์สวยอย่างเป็นธรรมชาติ",
  about: "ชุดผลิตภัณฑ์ที่คัดสรรมาเพื่อการดูแลผิวแบบองค์รวม เริ่มต้นจากการทำความสะอาดที่อ่อนโยน ไปจนถึงการบำรุงที่ล้ำลึก เพื่อผลลัพธ์ผิวสวยสุขภาพดีที่คุณสัมผัสได้",
  setBenefits: [
    "Deep Hydration: เติมความชุ่มชื้นล้ำลึก",
    "Radiant Skin: ผิวดูโกลว์กระจ่างใส",
    "Soothing: ปลอบประโลมผิว",
    "Barrier Support: เสริมเกราะป้องกันผิว",
  ],
  discountCodes: [
    { title: "ลดทันที 999.-", condition: "เมื่อยอดสั่งซื้อมากกว่า 1,500 บาท", code: "WELCOME10" },
    { title: "ลดทันที 999.-", condition: "เมื่อยอดสั่งซื้อมากกว่า 1,500 บาท", code: "BODYOIL20" },
  ],
  complimentaryGift: {
    name: "The Oil Bar",
    description: "Refined Olive Moisture Essence",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=200",
    value: "30 ml",
  },
};

const relatedProducts = [
  {
    productId: 1,
    image: {
      url: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800",
      description: "The Body Oil",
    },
    productName: "The Body Oil",
    priceTitle: "2,590 THB",
    quickCartPrice: 2590,
  },
  {
    productId: 2,
    image: {
      url: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=800",
      description: "The Oil Bar",
    },
    productName: "The Oil Bar",
    priceTitle: "790 THB",
    quickCartPrice: 790,
  },
  {
    productId: 3,
    image: {
      url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
      description: "The Serum",
    },
    productName: "The Serum",
    priceTitle: "3,200 THB",
    quickCartPrice: 3200,
  },
];

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Own The Glow Set - Ekoe" },
    { name: "description", content: "Own The Glow Set - Absolute Rebalance & Refined Olive" },
  ];
}

export default function SetProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(setProductData.image.url);
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <Header />

      <main className="pt-16 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-8">
            Home / Sets / OWN THE GLOW
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            {/* Left Column - Images */}
            <ProductGallery
              images={setProductData.galleryImages || []}
              selectedImage={selectedImage}
              onImageClick={(img) => setSelectedImage(img.url)}
              badgeText="15% OFF"
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
                  <h1 className="text-3xl md:text-4xl font-serif mb-2 uppercase">
                    {setProductData.productName}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.floor(setProductData.rating || 0) ? "currentColor" : "none"}
                          className={i < Math.floor(setProductData.rating || 0) ? "" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({setProductData.reviewCount} Reviews)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {setProductData.tags?.map((tag) => (
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
                {setProductData.description?.map((desc, idx) => (
                  <p key={idx}>{desc}</p>
                ))}
              </div>

              {/* Included Products List (Small) */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {setProductData.includedProducts.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.size}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Accordions: Why it works / Good for */}
              <Accordion type="single" collapsible className="w-full border-t border-gray-100 mt-6">
                <AccordionItem value="why-it-works">
                  <AccordionTrigger className="text-sm font-medium">Why it works</AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm">
                    {setProductData.whyItWorks}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="good-for">
                  <AccordionTrigger className="text-sm font-medium">Good for</AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm">
                    {setProductData.goodFor}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="space-y-6 pt-6 border-t border-gray-100">
                {/* Quantity & Add to Cart */}
                <div className="flex gap-4">
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => handleQuantityChange(1)}
                    onDecrease={() => handleQuantityChange(-1)}
                  />
                  <Button className="flex-1 h-12 text-base uppercase tracking-wide bg-black hover:bg-gray-800 flex justify-between px-6">
                    <span>ADD TO CART</span>
                    <span>{setProductData.quickCartPrice * quantity} THB (4,000 THB)</span>
                  </Button>
                </div>

                <div className="text-xs text-center text-gray-500">
                  Free shipping for All Orders Within Thailand
                </div>

                {/* Discount Codes */}
                {setProductData.discountCodes && (
                  <DiscountCodes codes={setProductData.discountCodes} />
                )}

                {/* Complimentary Gift */}
                {setProductData.complimentaryGift && (
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-3">Complimentary Gift for You</h4>
                    <ComplimentaryGift gift={setProductData.complimentaryGift} />
                    <p className="text-[10px] text-gray-400 mt-2">
                      *Limited availability. Subject to change.<br />
                      *Excludes Gift Sets. T&Cs apply.<br />
                      *One Gift per order.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Section 1: About & Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-serif mb-4">About Own the Glow</h2>
                <div className="w-12 h-0.5 bg-black mb-6"></div>
                <p className="text-gray-600 leading-relaxed">
                  {setProductData.about}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-serif mb-4">Benefit</h2>
                <div className="w-12 h-0.5 bg-black mb-6"></div>
                <div className="space-y-2">
                  <p className="text-sm font-medium mb-2">Unlock Your Own The Glow</p>
                  <ul className="space-y-2">
                    {setProductData.setBenefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1 h-1 bg-black rounded-full"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-4/3 bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000"
                alt="Lifestyle"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info Section 2: Set Includes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
            <div className="relative aspect-square lg:aspect-4/3 bg-gray-100 order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1000"
                alt="Set Includes"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl font-serif mb-8">This Set Includes</h2>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {setProductData.includedProducts.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-lg font-medium uppercase tracking-wide">
                      {item.name}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed space-y-2">
                      <p>{item.description}</p>
                      <p className="text-xs text-gray-500">{item.size}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="w-12 h-0.5 bg-black mb-12"></div>

          {/* Recommendations */}
          <div className="mb-24">
            <h2 className="text-2xl font-serif mb-8">Also Loved</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
