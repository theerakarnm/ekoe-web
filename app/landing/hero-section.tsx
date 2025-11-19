
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";

const slides = [
  {
    title: "One of Everything Really Good",
    subtitle: "ดี ในทุกอย่างที่ดีจริงแล้ว จะเป็นที่ดีอย่างแท้จริง",
    description: "ผลิตภัณฑ์ที่ดีตามหลักธรรมชาติ เพื่อทุกคน ไม่เคยทอดทิ้งให้ใครทุกข์ และจะเป็นผลิตภัณฑ์ที่คุณภาพดีและมีความหมาย"
  }
];

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className='px-8'>
      <div className="relative bg-[#858585] text-white rounded-2xl mt-6">
        <header data-hero-nav className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white hover:text-gray-900"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Desktop navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
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

              {/* Centered logo - adjust size for mobile */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <h1 className="text-2xl sm:text-3xl lg:text-[4rem] mt-3 font-serif text-white">Ekoe</h1>
              </div>

              {/* Desktop right-side navigation */}
              <div className="hidden lg:flex items-center space-x-6">
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

              {/* Mobile right-side icons */}
              <div className="lg:hidden flex items-center space-x-4">
                <button className="text-white hover:text-gray-900">
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#858585] border-t border-gray-600 z-50">
                <nav className="flex flex-col p-4 space-y-4">
                  <a href="#" className="text-white hover:text-gray-900 text-sm font-medium py-2">
                    ONLINE EXECUTIVE
                  </a>
                  <button className="flex items-center text-white hover:text-gray-900 text-sm font-medium py-2">
                    SHOP <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <button className="flex items-center text-white hover:text-gray-900 text-sm font-medium py-2">
                    DISCOVER <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="border-t border-gray-600 pt-4 space-y-4">
                    <a href="#" className="flex items-center text-white hover:text-gray-900 text-sm font-medium py-2">
                      <Search className="h-4 w-4 mr-2" /> SEARCH
                    </a>
                    <a href="#" className="text-white hover:text-gray-900 text-sm font-medium py-2">
                      LOGIN/REGISTER
                    </a>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
            {slides[currentSlide].title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-2 max-w-3xl mx-auto">
            {slides[currentSlide].subtitle}
          </p>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-2xl mx-auto opacity-90">
            {slides[currentSlide].description}
          </p>
          <button className="border-2 border-white text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-serif hover:bg-white hover:text-gray-800 transition-all duration-300 text-sm sm:text-base">
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
    </section>
  );
}

export {
  HeroSection
}