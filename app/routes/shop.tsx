import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";
import { ProductCard } from "~/components/share/product-card";
import type { IProduct } from "~/interface/product.interface";

// Mock Data
const PRODUCTS: IProduct[] = [
  {
    productId: 1,
    image: {
      description: "The Body Oil",
      url: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=800&auto=format&fit=crop",
    },
    productName: "The Body Oil",
    priceTitle: "$722.00 - $1,062.00",
    quickCartPrice: 125000, // $1,250.00
  },
  {
    productId: 2,
    image: {
      description: "The Serum",
      url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
    },
    productName: "The Serum",
    priceTitle: "$722.00 - $1,062.00",
    quickCartPrice: 125000,
  },
  {
    productId: 3,
    image: {
      description: "The Body Oil Set",
      url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    },
    productName: "The Body Oil",
    priceTitle: "$722.00 - $1,062.00",
    quickCartPrice: 125000,
  },
  {
    productId: 4,
    image: {
      description: "The Body Oil",
      url: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=800&auto=format&fit=crop",
    },
    productName: "The Body Oil",
    priceTitle: "$722.00 - $1,062.00",
    quickCartPrice: 125000,
  },
  {
    productId: 5,
    image: {
      description: "The Body Oil",
      url: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop",
    },
    productName: "The Body Oil",
    priceTitle: "$722.00 - $1,062.00",
    quickCartPrice: 125000,
  },
  {
    productId: 6,
    image: {
      description: "The Body Oil Box",
      url: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=800&auto=format&fit=crop",
    },
    productName: "The Body Oil",
    priceTitle: "$722.00 - $1,062.00",
    quickCartPrice: 125000,
  },
  {
    productId: 7,
    image: {
      description: "The Body Oil",
      url: "https://images.unsplash.com/photo-1571781926291-280553fd18d4?q=80&w=800&auto=format&fit=crop",
    },
    productName: "The Body Oil",
    priceTitle: "$722.00 - $1,062.00",
    quickCartPrice: 125000,
  },
];

export default function Shop() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="pt-8 sm:pt-8">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 font-serif">
            <a href="/" className="hover:text-black">Home</a> / <span className="font-bold text-black">Shop</span>
          </p>
        </div>

        {/* Hero Section */}
        <section className="relative h-[400px] sm:h-[500px] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop"
            alt="Spa Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="bg-white/60 backdrop-blur-sm p-8 sm:p-12 text-center max-w-2xl w-full shadow-lg">
              <h1 className="text-3xl sm:text-4xl font-serif mb-4 text-gray-900">Complete Collection</h1>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-serif">
                ประสบการณ์ดูแลผิวที่ออกแบบมาเพื่อคุณ<br />
                ครบทุกขั้นตอนของการดูแลผิวให้เปล่งประกาย เติบโต และเป็น<br />
                ของคุณ ด้วยสูตรประสิทธิภาพสูงจากธรรมชาติ ผสานกับ<br />
                วิทยาศาสตร์ที่แม่นยำ ให้ผลลัพธ์ยาวนาน
              </p>
            </div>
          </div>
        </section>

        {/* Filter & Sort Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
          <p className="text-sm font-serif text-gray-900">Showing {PRODUCTS.length} products</p>
          <button className="flex items-center text-sm font-serif text-gray-900 hover:text-gray-600">
            Sort By <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
