import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Copy, Check, X, Info } from 'lucide-react';
import { apiClient, type SuccessResponseWrapper } from '~/lib/api-client';
import type { WelcomePopupSetting } from '~/lib/services/site-settings.service';

const WELCOME_POPUP_KEY = 'ekoe_welcome_popup_shown';

// Default settings for fallback
const defaultPopupSettings: WelcomePopupSetting = {
  image: '/ekoe-asset/HOME/POPUP.JPG',
  title: 'เปิดประสบการณ์ใหม่กับ Ekoe',
  subtitle: "Effective natural formulations for skin that's alive, evolving, beautifully yours.",
  description: 'โค้ดพิเศษสำหรับคุณ',
  terms: [
    '*โค้ดมีจำนวนจำกัด',
    '*เฉพาะการสั่งซื้อครั้งแรกที่ Ekoe',
    '*ใช้ได้กับยอดหลังหักส่วนลด',
    '*ใช้ร่วมกับ Online Executive ได้',
    '*ส่งฟรีทุกออร์เดอร์',
  ],
};

interface WelcomePopupProps {
  settings?: WelcomePopupSetting;
  couponCode?: string;
  discountText?: string;
}

export function WelcomePopup({
  settings: propSettings,
  couponCode = 'WELCOMEXXX',
  discountText = 'ลดเพิ่ม 100 บาท ทุกยอดซื้อ 500 บาท',
}: WelcomePopupProps) {
  const popupSettings = propSettings ?? defaultPopupSettings;
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showTermsTooltip, setShowTermsTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [couponData, setCouponData] = useState({
    code: couponCode,
    text: discountText,
    description: ''
  });


  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(WELCOME_POPUP_KEY)) return;

    async function checkFeatured() {
      try {
        const res = await apiClient.get<SuccessResponseWrapper<any>>('/api/coupons/featured');
        const json = res.data;

        if (json.success && json.data) {
          const c = json.data;
          let text = '';
          if (c.discountType === 'percentage') text = `ลด ${c.discountValue}%`;
          else if (c.discountType === 'fixed_amount') text = `ลด ${(c.discountValue / 100).toLocaleString()} บาท`;
          else if (c.discountType === 'free_shipping') text = 'ส่งฟรี';

          if (c.minPurchaseAmount) {
            text += ` เมื่อช้อปครบ ${(c.minPurchaseAmount / 100).toLocaleString()} บาท`;
          }

          setCouponData({
            code: c.code,
            text: c.title || text, // Use title as main text if available
            description: c.description || text
          });

          // Only show popup if there's a featured coupon
          setTimeout(() => setIsOpen(true), 500);
        }
      } catch (error) {
        console.error('Failed to fetch featured coupon', error);
        // Don't show popup if there's no featured coupon or an error occurred
      }
    }

    checkFeatured();
  }, [couponCode]);

  // Close tooltip when tapping outside
  useEffect(() => {
    if (!showTermsTooltip) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTermsTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTermsTooltip]);

  const handleClose = () => {
    sessionStorage.setItem(WELCOME_POPUP_KEY, 'true');
    setIsOpen(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(couponData.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white w-[95vw] max-w-[1000px] max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-1.5 md:p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
          aria-label="Close popup"
        >
          <X className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>

        <div className="flex flex-col md:flex-row w-full">
          {/* Left Side - Image (visible on mobile too) */}
          <div className="w-full md:w-[45%] md:h-auto md:min-h-[520px] relative overflow-hidden">
            <img
              src={popupSettings.image}
              alt="Welcome to Ekoe"
              className="w-full h-auto object-contain md:absolute md:inset-0 md:h-full md:object-cover md:object-[50%_70%]"
            />
          </div>

          {/* Right Side - Content */}
          <div className="w-full md:w-[55%] p-4 md:p-10 flex flex-col justify-center bg-white">
            {/* Header */}
            <h2
              className="text-lg sm:text-xl md:text-4xl font-serif mb-2 md:mb-4"
              style={{ fontFamily: "'Noto Serif Thai', serif" }}
            >
              {popupSettings.title.includes('Ekoe') ? (
                <>{popupSettings.title.replace('Ekoe', '')} <span className="font-normal">Ekoe</span></>
              ) : (
                popupSettings.title
              )}
            </h2>

            <p className="text-gray-600 text-xs md:text-base mb-4 md:mb-8">
              {popupSettings.subtitle}
            </p>

            {/* Promo Section */}
            <div className="mb-4 md:mb-8">
              <p
                className="text-sm sm:text-base md:text-xl font-medium mb-1 md:mb-2"
                style={{ fontFamily: "'Noto Serif Thai', serif" }}
              >
                {popupSettings.description}
              </p>
              <p
                className="text-base sm:text-lg md:text-2xl font-bold text-black mb-3 md:mb-6"
                style={{ fontFamily: "'Noto Serif Thai', serif" }}
              >
                {couponData.text}
              </p>
              {couponData.description && couponData.description !== couponData.text && (
                <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-6 text-center md:text-left">{couponData.description}</p>
              )}

              {/* Coupon Code Box and Buttons */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
                {/* Mobile: tappable code container that copies */}
                <button
                  onClick={handleCopyCode}
                  className="md:hidden border-2 border-black px-4 py-2.5 text-center w-full flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
                >
                  <span className="font-mono text-base font-semibold tracking-wider">
                    {couponData.code}
                  </span>
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  )}
                </button>
                {isCopied && (
                  <p className="md:hidden text-xs text-green-600 text-center -mt-1">คัดลอกแล้ว!</p>
                )}

                {/* Desktop: original code box + copy button */}
                <div className="hidden md:block border-2 border-black px-6 py-3 text-center min-w-[180px]">
                  <span className="font-mono text-lg font-semibold tracking-wider">
                    {couponData.code}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="hidden md:flex bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors items-center justify-center gap-2"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      คัดลอกแล้ว
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      คัดลอก
                    </>
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="border-2 border-black px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap w-full md:w-auto"
                >
                  ยังไม่ใช่ตอนนี้
                </button>
              </div>
            </div>

            {/* Terms - Desktop: visible list, Mobile: tooltip on tap */}
            {/* Desktop terms */}
            <div className="hidden md:block text-xs text-gray-500 space-y-0.5">
              {popupSettings.terms.map((term, index) => (
                <p key={index}>{term}</p>
              ))}
            </div>

            {/* Mobile terms tooltip */}
            <div className="md:hidden relative" ref={tooltipRef}>
              <button
                onClick={() => setShowTermsTooltip(!showTermsTooltip)}
                className="flex items-center gap-1 text-[10px] text-gray-400"
              >
                <Info className="w-3 h-3" />
                <span>เงื่อนไข</span>
              </button>
              {showTermsTooltip && (
                <div className="absolute bottom-full left-0 mb-2 bg-gray-900 text-white text-[10px] rounded-lg px-3 py-2 shadow-lg w-[250px] z-10 space-y-0.5">
                  {popupSettings.terms.map((term, index) => (
                    <p key={index}>{term}</p>
                  ))}
                  <div className="absolute bottom-0 left-3 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
