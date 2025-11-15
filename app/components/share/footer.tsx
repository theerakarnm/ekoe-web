import { Instagram, Facebook, Youtube } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#282828] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-[6rem] -mb-6 font-serif">Ekoe</h3>
            <p className="text-sm text-gray-400 mb-4 font-serif">
              For moments That Matter - Follow Us
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4 font-serif">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors font-serif">Shop All</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-serif">Skin Care</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-serif">The Essence</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-serif">Body Care</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-serif">The Set Glow</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 font-serif">Discover</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors font-serif">About us</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-serif">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-serif">Online Exclusive</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 font-serif">FAQ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors font-serif">Returns Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2024 Ekoe. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export {
  Footer
}