import { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Menu, X } from 'lucide-react';
import { useCartStore } from '~/store/cart';
import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export default function Header({
  isLandingMagic
}: {
  isLandingMagic?: boolean
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCount = mounted ? totalItems : 0;
  return (
    <>
      <div className="bg-[#6E604D] text-white text-center py-1 sm:py-2 text-xs sm:text-sm">
        <span className="hidden sm:inline">FREE SHIPPING ON ALL ORDERS WITHIN THAILAND</span>
        <span className="sm:hidden">FREE SHIPPING</span>
      </div>
      {
        !isLandingMagic ? <>
          <header className={`bg-white font-mono shadow-sm fixed top-0 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out ${isLandingMagic ? '-translate-y-full' : 'translate-y-0'}`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
              <div className="flex items-center justify-between h-14 sm:h-16">
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden text-gray-700 hover:text-gray-900"
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                </button>

                {/* Desktop navigation */}
                <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                  <Link to="/online-executive" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                    ONLINE EXECUTIVE
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium outline-none">
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
                    <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium outline-none">
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

                {/* Centered logo - adjust size for mobile */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <Link to="/" className="text-lg sm:text-xl lg:text-2xl font-serif text-gray-800">Ekoe</Link>
                </div>

                {/* Desktop right-side navigation */}
                <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
                  <button className="text-gray-700 hover:text-gray-900">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button className="text-gray-700 hover:text-gray-900 text-sm hidden xl:block">
                    SEARCH
                  </button>
                  <Link to="/admin/login" className="text-gray-700 hover:text-gray-900 text-sm hidden xl:block">
                    LOGIN/REGISTER
                  </Link>
                  <Link to="/auth/login" className="text-gray-700 hover:text-gray-900">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <Link to="/cart" className="text-gray-700 hover:text-gray-900 relative">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center">
                      {displayCount}
                    </span>
                  </Link>
                </div>

                {/* Mobile right-side icons */}
                <div className="lg:hidden flex items-center space-x-3">
                  <button className="text-gray-700 hover:text-gray-900">
                    <Search className="h-5 w-5" />
                  </button>
                  <Link to="/auth/login" className="text-gray-700 hover:text-gray-900">
                    <User className="h-5 w-5" />
                  </Link>
                  <Link to="/cart" className="text-gray-700 hover:text-gray-900 relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {displayCount}
                    </span>
                  </Link>
                </div>
              </div>

              {/* Mobile menu */}
              {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-14 sm:top-16 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
                  <nav className="flex flex-col p-4 space-y-3">
                    <Link
                      to="/online-executive"
                      className="text-gray-700 hover:text-gray-900 text-sm font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ONLINE EXECUTIVE
                    </Link>

                    <div>
                      <button
                        onClick={() => setIsShopOpen(!isShopOpen)}
                        className="flex items-center justify-between w-full text-gray-700 hover:text-gray-900 text-sm font-medium py-2"
                      >
                        SHOP <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isShopOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isShopOpen && (
                        <div className="pl-4 py-2 space-y-2 flex flex-col bg-gray-50 rounded-md mt-1">
                          <Link to="/shop?category=new-arrivals" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
                          <Link to="/shop?category=best-sellers" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>Best Sellers</Link>
                          <Link to="/shop?category=skincare" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>Skincare</Link>
                          <Link to="/shop?category=sets" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>Sets & Bundles</Link>
                          <Link to="/shop" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>View All</Link>
                        </div>
                      )}
                    </div>

                    <div>
                      <button
                        onClick={() => setIsDiscoverOpen(!isDiscoverOpen)}
                        className="flex items-center justify-between w-full text-gray-700 hover:text-gray-900 text-sm font-medium py-2"
                      >
                        DISCOVER <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isDiscoverOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isDiscoverOpen && (
                        <div className="pl-4 py-2 space-y-2 flex flex-col bg-gray-50 rounded-md mt-1">
                          <Link to="/about" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
                          <Link to="/ingredients" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>Ingredients</Link>
                          <Link to="/blog" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-3 space-y-3">
                      <button className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium py-2 w-full text-left">
                        <Search className="h-4 w-4 mr-2" /> SEARCH
                      </button>
                      <Link
                        to="/admin/login"
                        className="block text-gray-700 hover:text-gray-900 text-sm font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        LOGIN/REGISTER
                      </Link>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          </header></> : null
      }
    </>
  );
}

export { Header }
