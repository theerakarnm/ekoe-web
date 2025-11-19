import { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Menu, X } from 'lucide-react';

export default function Header({
  isLandingMagic
}: {
  isLandingMagic?: boolean
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <div className="bg-[#6E604D] text-white text-center py-1 sm:py-2 text-xs sm:text-sm">
        <span className="hidden sm:inline">FREE SHIPPING ON ALL ORDERS WITHIN THAILAND</span>
        <span className="sm:hidden">FREE SHIPPING</span>
      </div>
      {
        !isLandingMagic ? <>
          <header className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out ${isLandingMagic ? '-translate-y-full' : 'translate-y-0'}`}>
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
                  <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                    ONLINE EXECUTIVE
                  </a>
                  <button className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium">
                    SHOP <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <button className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium">
                    DISCOVER <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </nav>

                {/* Centered logo - adjust size for mobile */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-serif text-gray-800">Ekoe</h1>
                </div>

                {/* Desktop right-side navigation */}
                <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
                  <button className="text-gray-700 hover:text-gray-900">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <a href="#" className="text-gray-700 hover:text-gray-900 text-sm hidden xl:block">
                    SEARCH
                  </a>
                  <a href="#" className="text-gray-700 hover:text-gray-900 text-sm hidden xl:block">
                    LOGIN/REGISTER
                  </a>
                  <button className="text-gray-700 hover:text-gray-900 relative">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center">
                      0
                    </span>
                  </button>
                </div>

                {/* Mobile right-side icons */}
                <div className="lg:hidden flex items-center space-x-3">
                  <button className="text-gray-700 hover:text-gray-900">
                    <Search className="h-5 w-5" />
                  </button>
                  <button className="text-gray-700 hover:text-gray-900 relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      0
                    </span>
                  </button>
                </div>
              </div>

              {/* Mobile menu */}
              {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-14 sm:top-16 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
                  <nav className="flex flex-col p-4 space-y-3">
                    <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium py-2">
                      ONLINE EXECUTIVE
                    </a>
                    <button className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium py-2">
                      SHOP <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    <button className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium py-2">
                      DISCOVER <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    <div className="border-t border-gray-200 pt-3 space-y-3">
                      <a href="#" className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium py-2">
                        <Search className="h-4 w-4 mr-2" /> SEARCH
                      </a>
                      <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium py-2">
                        LOGIN/REGISTER
                      </a>
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
