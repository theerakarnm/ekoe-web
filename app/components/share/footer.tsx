import { useMenuProductsStore } from '~/store/menu-products';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState, useEffect } from 'react';

function Footer() {
  const { products, fetchProducts } = useMenuProductsStore();
  const [mounted, setMounted] = useState(false);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
    // Fetch products from shared store (handles deduplication internally)
    fetchProducts();
  }, [fetchProducts]);
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
            <h3 className="text-xl font-bold mb-1 font-thai">ร่วมเดินทางไปกับเรา</h3>
            <p className="text-sm opacity-90 font-thai">รับข่าวสารพิเศษ และเรื่องราวดีๆที่จะเกิดขึ้นก่อนใคร</p>
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
                For moments that matter | Join our journey, day by day
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/ekoebeauty" target='_blank' className="w-6 h-6 invert">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" /></svg>
                </a>
                <a href="https://www.facebook.com/share/1LXXDUtcqV/?mibextid=wwXIf" target='_blank' className="w-6 h-6 invert">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Facebook</title><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" /></svg>
                </a>
                <a href="https://line.me/R/ti/p/@ekoe" target='_blank' className="w-6 h-6 invert">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LINE</title><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4 font-serif">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/shop" className="hover:text-white transition-colors font-serif">Shop All</a></li>
                <li><a href="/shop?product_type=set" className="hover:text-white transition-colors font-serif">Set All</a></li>
                {products.map((product) => (
                  <li key={product.id}>
                    <a href={`/product-detail/${product.id}`} className="hover:text-white transition-colors font-serif">
                      {product.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 font-serif">Discover</h4>
              <ul className="space-y-2 text-sm text-gray-400 mb-4">
                <li><a href="/about" className="hover:text-white transition-colors font-serif">About Us</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors font-serif">Blog</a></li>
              </ul>
              <h4 className="font-medium mb-4 font-serif">
                <a href="/online-executive">Online Exclusive</a>
              </h4>
            </div>

            <div>
              <h4 className="font-medium mb-4 font-serif">
                <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
              </h4>
              <h4 className="font-medium mb-4 font-serif">
                <a href="/return-policy" className="hover:text-white transition-colors">Returns Policy</a>
              </h4>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-end">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © {currentYear} Ekoe. All rights reserved.
            </p>
            <div className="space-x-4">
              <h4 className="font-medium mb-4 font-serif">Payment</h4>
              <div className="flex items-center space-x-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Thai_QR_Logo.svg/1600px-Thai_QR_Logo.svg.png?20250310160238" alt="Thai QR" className="h-10" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-10" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-10" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/2560px-JCB_logo.svg.png" alt="JCB" className="h-10" />
              </div>

            </div>
          </div>
        </div>
      </div></footer>
  );
}

export {
  Footer
}