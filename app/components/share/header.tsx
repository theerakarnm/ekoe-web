import { Search, User, ShoppingCart, ChevronDown } from 'lucide-react';

export default function Header({
  isLandingMagic
}: {
  isLandingMagic: boolean
}) {
  return (
    <>
      <div className="bg-[#6E604D] text-white text-center py-2 text-sm">
        FREE SHIPPING ON ALL ORDERS WITHIN THAILAND
      </div>
      {
        !isLandingMagic ? <>
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <nav className="flex items-center space-x-8">
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

                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <h1 className="text-2xl font-serif text-gray-800">Ekoe</h1>
                </div>

                <div className="flex items-center space-x-6">
                  <button className="text-gray-700 hover:text-gray-900">
                    <Search className="h-5 w-5" />
                  </button>
                  <a href="#" className="text-gray-700 hover:text-gray-900 text-sm">
                    SEARCH
                  </a>
                  <a href="#" className="text-gray-700 hover:text-gray-900 text-sm">
                    LOGIN/REGISTER
                  </a>
                  <button className="text-gray-700 hover:text-gray-900 relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      0
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </header></> : null
      }
    </>
  );
}

export { Header }
