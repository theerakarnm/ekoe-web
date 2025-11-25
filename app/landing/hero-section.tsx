
import { useState } from 'react';
import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useCartStore } from '~/store/cart';

const slides = [
  {
    id: 1,
    title: "One of Everything Really Good",
    subtitle: "ที่ Ekoe - ปรัชญาที่เรียบง่ายของเราคือ การทําให้ทุกอย่างดีจริงๆ สําหรับเรา นั่นหมายถึงผลิตภัณฑ์ที่จําเป็น ไว้ใจได้และมีประสิทธิภาพสูง ให้คุณหยิบใช้ได้ทุกวัน เป็นสิ่งที่คุณรัก และกลับมาใช้ เสมอเพื่อบํารุงผิวที่ดีที่สุดของคุณ",
    description: "",
    media: {
      type: 'video',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' // Placeholder nature video
    }
  },
  {
    id: 2,
    title: "Nature's Best Kept Secret",
    subtitle: "ความลับจากธรรมชาติที่ดีที่สุด",
    description: "สัมผัสประสบการณ์การดูแลผิวที่เหนือระดับ ด้วยส่วนผสมที่คัดสรรมาจากธรรมชาติ",
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop'
    }
  }
];

function HeroSection() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((state) => state.getTotalItems());
  const displayCount = mounted ? totalItems : 0;

  // Update current slide index when carousel changes
  if (api) {
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }

  return (
    <section className='px-4 sm:px-8'>
      <div className="relative rounded-2xl mt-6 overflow-hidden h-[80vh] min-h-[600px] bg-[#858585]">
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            duration: 60
          }}
          plugins={[
            Autoplay({
              delay: 8000,
            }),
          ]}
          className="absolute inset-0 w-full h-full **:data-[slot=carousel-content]:h-full"
        >
          <CarouselContent className="h-full ml-0">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="h-full pl-0 relative">
                {/* Background Media */}
                <div className="absolute inset-0 w-full h-full">
                  {slide.media.type === 'video' ? (
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={slide.media.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={slide.media.url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 lg:px-8 pt-20">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-4 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 max-w-3xl mx-auto drop-shadow-md font-light font-sans">
                    {slide.subtitle}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto opacity-90 drop-shadow-md  font-sans">
                    {slide.description}
                  </p>
                  <button className="border-2 border-white text-white px-8 py-3 rounded-full font-serif hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm sm:text-base uppercase tracking-wider backdrop-blur-sm">
                    Shop Ekoe
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Header / Navigation Overlay */}
        <header data-hero-nav className="absolute top-0 left-0 right-0 z-10 font-mono">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white hover:text-gray-200 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Desktop navigation */}
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                <Link to="/online-executive" className="text-white hover:text-gray-200 text-sm font-medium">
                  ONLINE EXECUTIVE
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-white hover:text-gray-200 text-sm font-medium outline-none">
                    SHOP <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 bg-white">
                    <DropdownMenuItem asChild>
                      <Link to="/shop?category=new-arrivals" className="w-full cursor-pointer">New Arrivals</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/shop?category=best-sellers" className="w-full cursor-pointer">Best Sellers</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/shop?category=skincare" className="w-full cursor-pointer">Skincare</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/shop?category=sets" className="w-full cursor-pointer">Sets & Bundles</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/shop" className="w-full cursor-pointer">View All</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-white hover:text-gray-200 text-sm font-medium outline-none">
                    DISCOVER <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 bg-white">
                    <DropdownMenuItem asChild>
                      <Link to="/about" className="w-full cursor-pointer">Our Story</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/ingredients" className="w-full cursor-pointer">Ingredients</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/blog" className="w-full cursor-pointer">Blog</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>

              {/* Centered logo */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight">Ekoe</h1>
              </div>

              {/* Desktop right-side navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <button className="text-white hover:text-gray-200 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
                <a href="#" className="text-white hover:text-gray-200 text-sm tracking-wide transition-colors">
                  SEARCH
                </a>
                <Link to="/admin/login" className="text-white hover:text-gray-200 text-sm hidden xl:block">
                  LOGIN/REGISTER
                </Link>
                <Link to="/cart" className="text-white hover:text-gray-200 relative">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center">
                    {displayCount}
                  </span>
                </Link>
              </div>

              {/* Mobile right-side icons */}
              <div className="lg:hidden flex items-center space-x-4">
                <button className="text-white hover:text-gray-200">
                  <ShoppingCart className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden absolute top-20 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 text-white z-50 rounded-b-2xl shadow-xl">
                <nav className="flex flex-col p-6 space-y-4">
                  <a href="/online-executive" className="text-lg font-medium py-2 border-b border-white/10">
                    ONLINE EXECUTIVE
                  </a>
                  <button className="flex items-center justify-between text-lg font-medium py-2 border-b border-white/10">
                    SHOP <ChevronDown className="h-5 w-5" />
                  </button>
                  <button className="flex items-center justify-between text-lg font-medium py-2 border-b border-white/10">
                    DISCOVER <ChevronDown className="h-5 w-5" />
                  </button>
                  <div className="pt-4 space-y-4">
                    <a href="#" className="flex items-center text-lg font-medium py-2">
                      <Search className="h-5 w-5 mr-3" /> SEARCH
                    </a>
                    <a href="#" className="block text-lg font-medium py-2">
                      LOGIN/REGISTER
                    </a>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === current ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'
                }`}
              aria-label={`Go to slide ${index + 1}`}
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