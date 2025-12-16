import { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Menu, X, LogOut, Settings, Cog } from 'lucide-react';
import { useCartStore } from '~/store/cart';
import { useAuthStore } from '~/store/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { getProducts, type Product } from '~/lib/services/product.service';
import { cn } from '~/lib/utils';

export default function Header({
  isLandingMagic,
  isTransparent
}: {
  isLandingMagic?: boolean;
  isTransparent?: boolean;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, signOut } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchProducts = async () => {
      try {
        const result = await getProducts({ limit: 10 }); // Limit to keep menu manageable
        setProducts(result.data);
      } catch (error) {
        console.error("Failed to fetch products for header menu", error);
      }
    };
    fetchProducts();
  }, []);

  const displayCount = mounted ? totalItems : 0;

  // Dynamic classes for transparent mode
  const headerBgClass = isTransparent
    ? "bg-transparent"
    : "bg-white shadow-sm";
  const textColorClass = isTransparent
    ? "text-white"
    : "text-gray-700";
  const hoverTextClass = isTransparent
    ? "hover:text-gray-200"
    : "hover:text-gray-900";
  const logoInvertClass = isTransparent
    ? 'invert'
    : '';

  return (
    <>
      {!isTransparent && (
        <div className="bg-[#6E604D] text-white text-center py-1 sm:py-2 text-xs sm:text-sm">
          <span className="hidden sm:inline">FREE SHIPPING ON ALL ORDERS WITHIN THAILAND</span>
          <span className="sm:hidden">FREE SHIPPING</span>
        </div>
      )}
      {
        !isLandingMagic ? <>
          <header className={`${headerBgClass} font-mono ${isTransparent ? 'absolute' : 'fixed'} top-0 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out ${isLandingMagic ? '-translate-y-full' : 'translate-y-0'}`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
              <div className="flex items-center justify-between h-14 sm:h-16">
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`lg:hidden ${textColorClass} ${hoverTextClass}`}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                </button>

                {/* Desktop navigation */}
                <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                  <Link to="/online-executive" className={`${textColorClass} ${hoverTextClass} text-sm font-medium`}>
                    ONLINE EXECUTIVE
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger className={`flex items-center ${textColorClass} ${hoverTextClass} text-sm font-medium outline-none`}>
                      SHOP <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 bg-white max-h-[80vh] overflow-y-auto">
                      <DropdownMenuItem asChild>
                        <Link to="/shop" className="w-full cursor-pointer font-bold">Shop All</Link>
                      </DropdownMenuItem>
                      {products.map((product) => (
                        <DropdownMenuItem key={product.id} asChild>
                          <Link to={`/product-detail/${product.id}`} className="w-full cursor-pointer truncate">
                            {product.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger className={`flex items-center ${textColorClass} ${hoverTextClass} text-sm font-medium outline-none`}>
                      DISCOVER <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 bg-white">
                      <DropdownMenuItem asChild>
                        <Link to="/about" className="w-full cursor-pointer">Our Story</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/blogs" className="w-full cursor-pointer">Blog</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>

                {/* Centered logo - adjust size for mobile */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <Link to="/" className="text-lg sm:text-xl lg:text-2xl font-serif text-gray-800">
                    <img src="/ekoe-asset/Ekoe_Logo-01.png" alt="Ekoe Logo" className={cn('w-28', logoInvertClass)} />
                  </Link>
                </div>

                {/* Desktop right-side navigation */}
                <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
                  <button className={`${textColorClass} ${hoverTextClass}`}>
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button className={`${textColorClass} ${hoverTextClass} text-sm hidden xl:block`}>
                    SEARCH
                  </button>
                  {mounted && isAuthenticated && user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none">
                        <Avatar className="h-8 w-8 cursor-pointer border border-gray-200">
                          <AvatarImage src={user.image || ''} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-white">
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
                        {/* {
                          <DropdownMenuItem asChild>
                            <Link to="/admin/dashboard" className="w-full cursor-pointer flex items-center">
                              <Cog className="mr-2 h-4 w-4" />
                              Admin Portal
                            </Link>
                          </DropdownMenuItem>
                        } */}
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
                    <Link to="/auth/login" className={`${textColorClass} ${hoverTextClass} text-sm hidden xl:block`}>
                      LOGIN
                    </Link>
                  )}
                  {!mounted || !isAuthenticated ? (
                    <Link to="/auth/login" className={`${textColorClass} ${hoverTextClass} xl:hidden`}>
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  ) : null}
                  <Link to="/cart" className={`${textColorClass} ${hoverTextClass} relative`}>
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center">
                      {displayCount}
                    </span>
                  </Link>
                </div>

                {/* Mobile right-side icons */}
                <div className="lg:hidden flex items-center space-x-3">
                  <button className={`${textColorClass} ${hoverTextClass}`}>
                    <Search className="h-5 w-5" />
                  </button>
                  {mounted && isAuthenticated && user ? (
                    <Link to="/account" className={`${textColorClass} ${hoverTextClass}`}>
                      <Avatar className="h-6 w-6 border border-gray-200">
                        <AvatarImage src={user.image || ''} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  ) : (
                    <Link to="/auth/login" className={`${textColorClass} ${hoverTextClass}`}>
                      <User className="h-5 w-5" />
                    </Link>
                  )}
                  <Link to="/cart" className={`${textColorClass} ${hoverTextClass} relative`}>
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
                          <Link to="/shop" className="text-gray-600 text-sm py-1 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
                          {products.map((product) => (
                            <Link
                              key={product.id}
                              to={`/products/${product.slug}`}
                              className="text-gray-600 text-sm py-1 truncate"
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
                        className="flex items-center justify-between w-full text-gray-700 hover:text-gray-900 text-sm font-medium py-2"
                      >
                        DISCOVER <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isDiscoverOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isDiscoverOpen && (
                        <div className="pl-4 py-2 space-y-2 flex flex-col bg-gray-50 rounded-md mt-1">
                          <Link to="/about" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
                          {/* <Link to="/ingredients" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>Ingredients</Link> */}
                          <Link to="/blogs" className="text-gray-600 text-sm py-1" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-3 space-y-3">
                      <button className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium py-2 w-full text-left">
                        <Search className="h-4 w-4 mr-2" /> SEARCH
                      </button>
                      {mounted && isAuthenticated && user ? (
                        <>
                          <Link
                            to="/account"
                            className="block text-gray-700 hover:text-gray-900 text-sm font-medium py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            MY ACCOUNT
                          </Link>
                          <button
                            onClick={() => {
                              signOut();
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium py-2 w-full text-left"
                          >
                            <LogOut className="h-4 w-4 mr-2" /> LOGOUT
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/auth/login"
                          className="block text-gray-700 hover:text-gray-900 text-sm font-medium py-2"
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
          </header></> : null
      }
    </>
  );
}

export { Header }
