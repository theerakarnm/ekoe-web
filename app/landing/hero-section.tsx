
import { useEffect, useState, useRef, useMemo } from 'react';
import { ChevronDown, Menu, Search, ShoppingCart, X, User, LogOut } from "lucide-react";
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
import { useAuthStore } from '~/store/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useMenuProductsStore } from '~/store/menu-products';
import type { HeroSlide } from '~/lib/services/site-settings.service';

// Format price from cents to display format
function formatPrice(priceInCents: number): string {
  return `฿${(priceInCents / 100).toLocaleString('th-TH', { minimumFractionDigits: 0 })}`;
}

// Default slides for fallback
const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    title: "One of Everything Really Good",
    subtitle: "ที่ Ekoe - ปรัชญาที่เรียบง่ายของเราคือ การทําให้ทุกอย่างดีจริงๆ สําหรับเรา นั่นหมายถึงผลิตภัณฑ์ที่จําเป็น ไว้ใจได้และมีประสิทธิภาพสูง ให้คุณหยิบใช้ได้ทุกวัน เป็นสิ่งที่คุณรัก และกลับมาใช้ เสมอเพื่อบํารุงผิวที่ดีที่สุดของคุณ",
    description: "",
    media: {
      type: 'video',
      url: '/ekoe-asset/branding-vid.mp4'
    }
  },
  {
    id: 2,
    title: "Nature's Best Kept Secret",
    subtitle: "ความลับจากธรรมชาติที่ดีที่สุด",
    description: "สัมผัสประสบการณ์การดูแลผิวที่เหนือระดับ ด้วยส่วนผสมที่คัดสรรมาจากธรรมชาติ",
    media: {
      type: 'image',
      url: '/ekoe-asset/branding-img2.png'
    }
  }
];

interface HeroSectionProps {
  slides?: HeroSlide[];
}

function HeroSection({ slides: propSlides }: HeroSectionProps) {
  const slides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthStore();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { products, fetchProducts } = useMenuProductsStore();

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle search button click
  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  // Handle close search
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    setMounted(true);
    // Ensure auth state is fresh
    useAuthStore.getState().checkAuth();
    // Fetch products from shared store (handles deduplication internally)
    fetchProducts();
  }, [fetchProducts]);

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
                  <Link to="/shop" className="border-2 border-white text-white px-8 py-3 rounded-full font-serif hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm sm:text-base uppercase tracking-wider backdrop-blur-sm">
                    Begin with Balance
                  </Link>
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
                  <DropdownMenuContent align="start" className="w-48 bg-white max-h-[80vh] overflow-y-auto">
                    <DropdownMenuItem asChild>
                      <Link to="/shop" className="w-full cursor-pointer">Shop All</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/shop?product_type=set" className="w-full cursor-pointer">Set All</Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem asChild>
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
                    </DropdownMenuItem> */}
                    {products.map((product) => (
                      <DropdownMenuItem key={product.id} asChild>
                        <Link to={`/p/${product.slug}`} className="w-full cursor-pointer truncate">
                          {product.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-white hover:text-gray-200 text-sm font-medium outline-none">
                    DISCOVER <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 bg-white">
                    <DropdownMenuItem asChild>
                      <Link to="/about" className="w-full cursor-pointer">About Us</Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem asChild>
                      <Link to="/ingredients" className="w-full cursor-pointer">Ingredients</Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem asChild>
                      <Link to="/blogs" className="w-full cursor-pointer">Blog</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>

              {/* Centered logo */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link to="/">
                  <img src="/ekoe-asset/Ekoe_Logo-01.png" alt="Ekoe Logo" className='w-32 invert' />
                </Link>
              </div>

              {/* Desktop right-side navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <button onClick={handleSearchClick} className="text-white hover:text-gray-200 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
                <button onClick={handleSearchClick} className="text-white hover:text-gray-200 text-sm tracking-wide transition-colors">
                  SEARCH
                </button>
                {mounted && isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <Avatar className="h-8 w-8 cursor-pointer border border-white/20">
                        <AvatarImage src={user.image || ''} alt={user.name} />
                        <AvatarFallback className="bg-white/10 text-white">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white text-gray-900">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          {user.name && <p className="font-medium">{user.name}</p>}
                          {user.email && (
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link to="/account" className="w-full cursor-pointer flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 cursor-pointer flex items-center"
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/auth/login" className="text-white hover:text-gray-200 text-sm hidden xl:block">
                    LOGIN
                  </Link>
                )}
                {!mounted || !isAuthenticated ? (
                  <Link to="/auth/login" className="text-white hover:text-gray-200 xl:hidden">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                ) : null}
                <Link to="/cart" className="text-white hover:text-gray-200 relative">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center">
                    {displayCount}
                  </span>
                </Link>
              </div>

              {/* Mobile right-side icons */}
              <div className="lg:hidden flex items-center space-x-4">
                {mounted && isAuthenticated && user ? (
                  <Link to="/account" className="text-white hover:text-gray-200">
                    <Avatar className="h-6 w-6 border border-white/20">
                      <AvatarImage src={user.image || ''} alt={user.name} />
                      <AvatarFallback className="bg-white/10 text-white text-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                ) : (
                  <Link to="/auth/login" className="text-white hover:text-gray-200">
                    <User className="h-6 w-6" />
                  </Link>
                )}
                <button className="text-white hover:text-gray-200">
                  <ShoppingCart className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden absolute top-20 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 text-white z-50 rounded-b-2xl shadow-xl">
                <nav className="flex flex-col p-6 space-y-4">
                  <Link
                    to="/online-executive"
                    className="text-lg font-medium py-2 border-b border-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ONLINE EXECUTIVE
                  </Link>
                  <div>
                    <button
                      onClick={() => setIsShopOpen(!isShopOpen)}
                      className="flex items-center justify-between w-full text-lg font-medium py-2 border-b border-white/10"
                    >
                      SHOP <ChevronDown className={`h-5 w-5 transform transition-transform ${isShopOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isShopOpen && (
                      <div className="pl-4 py-2 space-y-2 flex flex-col mt-1">
                        <Link to="/shop" className="text-gray-300 text-base py-1 font-bold" onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
                        {products.map((product) => (
                          <Link
                            key={product.id}
                            to={`/p/${product.slug}?allow_modal=F`}
                            className="text-gray-300 text-base py-1 truncate"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {product.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => setIsDiscoverOpen(!isDiscoverOpen)}
                      className="flex items-center justify-between w-full text-lg font-medium py-2 border-b border-white/10"
                    >
                      DISCOVER <ChevronDown className={`h-5 w-5 transform transition-transform ${isDiscoverOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDiscoverOpen && (
                      <div className="pl-4 py-2 space-y-2 flex flex-col mt-1">
                        <Link to="/about" className="text-gray-300 text-base py-1" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                        {/* <Link to="/ingredients" className="text-gray-300 text-base py-1" onClick={() => setIsMobileMenuOpen(false)}>Ingredients</Link> */}
                        <Link to="/blogs" className="text-gray-300 text-base py-1" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 space-y-4">
                    <button onClick={() => { handleSearchClick(); setIsMobileMenuOpen(false); }} className="flex items-center text-lg font-medium py-2 w-full">
                      <Search className="h-5 w-5 mr-3" /> SEARCH
                    </button>
                    {mounted && isAuthenticated && user ? (
                      <>
                        <Link
                          to="/account"
                          className="flex items-center text-lg font-medium py-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-5 w-5 mr-3" /> MY ACCOUNT
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center text-red-500 hover:text-red-400 text-lg font-medium py-2 w-full text-left"
                        >
                          <LogOut className="h-5 w-5 mr-3" /> LOGOUT
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/auth/login"
                        className="block text-lg font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        LOGIN/REGISTER
                      </Link>
                    )}
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

      {/* Search Sidebar Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={searchContainerRef}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl animate-in slide-in-from-right duration-300 flex flex-col"
          >
            {/* Search Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-200">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E604D] focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={handleCloseSearch}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredProducts.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/p/${product.slug}`}
                      onClick={handleCloseSearch}
                      className="group flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-[#6E604D] hover:shadow-md transition-all duration-200"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Search className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-[#6E604D] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-[#6E604D] font-semibold mt-1">
                          {formatPrice(product.basePrice)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchQuery ? `No products found for "${searchQuery}"` : 'Start typing to search products...'}
                  </p>
                </div>
              )}
            </div>

            {/* View All Products Link */}
            {filteredProducts.length > 0 && (
              <div className="p-4 border-t border-gray-100 text-center">
                <Link
                  to="/shop"
                  onClick={handleCloseSearch}
                  className="inline-flex items-center text-[#6E604D] hover:text-[#5a5040] font-medium transition-colors"
                >
                  View all products
                  <ChevronDown className="ml-1 h-4 w-4 -rotate-90" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export {
  HeroSection
}