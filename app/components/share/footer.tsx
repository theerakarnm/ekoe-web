import { Instagram, Facebook, Youtube } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

function Footer() {
  return (
    <footer className='relative mt-48'>
      <div className="absolute h-48 w-[95%] md:w-[80%] left-1/2 -translate-x-1/2 -translate-y-[80%]  overflow-hidden py-6">
        <div className="absolute inset-0 bg-gray-300">
          <img
            src="/ekoe-asset/Footer_photo.png"
            alt="Beach Grass"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/20">
          </div>
        </div>
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0 text-center md:text-left w-full md:w-[40%]">
            <h3 className="text-xl font-bold mb-1">ร่วมเดินทางไปกับเรา</h3>
            <p className="text-sm opacity-90">รับข่าวสารพิเศษ และเรื่องราวดีๆที่จะเกิดขึ้นก่อนใคร</p>
          </div>
          <div className="w-full md:w-auto flex">
            <Input
              type="email"
              placeholder="Email"
              className="px-4 py-2 w-full h-12 md:w-50 xl:w-60 rounded-l-full text-gray-900 focus:outline-none"
            />
            <Button className="bg-black text-white px-6 py-2 rounded-r-full rounded-l-none hover:bg-gray-800 transition-colors uppercase text-sm tracking-wider h-auto">
              Subscribe
            </Button>
          </div>
        </div>


      </div>
      <div className="bg-[#282828] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/ekoe-asset/Ekoe_Logo-01.png" alt="Ekoe Logo" className='-translate-x-10 invert' />
              {/* <h3 className="text-[6rem] -mb-6 font-serif">Ekoe</h3> */}
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
      </div></footer>
  );
}

export {
  Footer
}