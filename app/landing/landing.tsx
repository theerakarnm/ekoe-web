import { Button } from "~/components/ui/button";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import { Header } from "~/components/share/header";

import { useState, useEffect } from 'react';
import { ChevronDown, Search, ShoppingCart } from "lucide-react";

const slides = [
  {
    title: "One of Everything Really Good",
    subtitle: "ดี ในทุกอย่างที่ดีจริงแล้ว จะเป็นที่ดีอย่างแท้จริง",
    description: "ผลิตภัณฑ์ที่ดีตามหลักธรรมชาติ เพื่อทุกคน ไม่เคยทอดทิ้งให้ใครทุกข์ และจะเป็นผลิตภัณฑ์ที่คุณภาพดีและมีความหมาย"
  }
];

export function Landing() {
  return (
    <div>
      <Header isLandingMagic />
      <main className="min-h-screen bg-white px-6">
        <HeroSection />
      </main>
    </div>
  );
}

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-[#A29D97] text-white rounded-2xl mt-6">
      <header className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center space-x-8">
              <a href="#" className="text-white hover:text-gray-900 text-sm font-medium">
                ONLINE EXECUTIVE
              </a>
              <button className="flex items-center text-white hover:text-gray-900 text-sm font-medium">
                SHOP <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <button className="flex items-center text-white hover:text-gray-900 text-sm font-medium">
                DISCOVER <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </nav>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-[4rem] mt-3 font-serif text-white">Ekoe</h1>
            </div>

            <div className="flex items-center space-x-6">
              <button className="text-white hover:text-gray-900">
                <Search className="h-5 w-5" />
              </button>
              <a href="#" className="text-white hover:text-gray-900 text-sm">
                SEARCH
              </a>
              <a href="#" className="text-white hover:text-gray-900 text-sm">
                LOGIN/REGISTER
              </a>
              <button className="text-white hover:text-gray-900 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-4">
          {slides[currentSlide].title}
        </h2>
        <p className="text-lg md:text-xl mb-2 max-w-3xl mx-auto">
          {slides[currentSlide].subtitle}
        </p>
        <p className="text-sm md:text-base mb-8 max-w-2xl mx-auto opacity-90">
          {slides[currentSlide].description}
        </p>
        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-serif hover:bg-white hover:text-gray-800 transition-all duration-300">
          Shop Ekoe
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
