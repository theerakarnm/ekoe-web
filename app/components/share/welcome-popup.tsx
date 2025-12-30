import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Copy, Check, X } from 'lucide-react';
import { apiClient, type SuccessResponseWrapper } from '~/lib/api-client';

const WELCOME_POPUP_KEY = 'ekoe_welcome_popup_shown';

interface WelcomePopupProps {
  imageUrl?: string;
  couponCode?: string;
  discountText?: string;
}

export function WelcomePopup({
  imageUrl = '/ekoe-asset/HOME/POPUP.JPG',
  couponCode = 'WELCOMEXXX',
  discountText = 'ลดเพิ่ม 100 บาท ทุกยอดซื้อ 500 บาท',
}: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

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

        }
      } catch (error) {
        console.error('Failed to fetch featured coupon', error);
      } finally {
        setTimeout(() => setIsOpen(true), 500);
      }
    }

    checkFeatured();
  }, [couponCode]);

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
        className="relative bg-white w-[95vw] max-w-[1000px] max-h-[90vh] overflow-hidden rounded-lg shadow-2xl animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex flex-col md:flex-row w-full">
          {/* Left Side - Image */}
          <div className="w-full md:w-[45%] h-64 md:h-auto md:min-h-[520px] relative overflow-hidden">
            <img
              src={imageUrl}
              alt="Welcome to Ekoe"
              className="absolute inset-0 w-full h-full object-cover object-[50%_70%]"
            />
          </div>

          {/* Right Side - Content */}
          <div className="w-full md:w-[55%] p-6 md:p-10 flex flex-col justify-center bg-white">
            {/* Header */}
            <h2
              className="text-2xl md:text-4xl font-serif mb-4"
              style={{ fontFamily: "'Noto Serif Thai', serif" }}
            >
              เปิดประสบการณ์ใหม่กับ <span className="font-normal">Ekoe</span>
            </h2>

            <p className="text-gray-600 text-sm md:text-base mb-8">
              Effective natural formulations<br />
              for skin that's alive, evolving, beautifully yours.
            </p>

            {/* Promo Section */}
            <div className="mb-8">
              <p
                className="text-lg md:text-xl font-medium mb-2"
                style={{ fontFamily: "'Noto Serif Thai', serif" }}
              >
                โค้ดพิเศษสำหรับคุณ
              </p>
              <p
                className="text-xl md:text-2xl font-bold text-black mb-6"
                style={{ fontFamily: "'Noto Serif Thai', serif" }}
              >
                {couponData.text}
              </p>
              {couponData.description && couponData.description !== couponData.text && (
                <p className="text-sm text-gray-600 mb-6 text-center md:text-left">{couponData.description}</p>
              )}

              {/* Coupon Code Box and Buttons */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="border-2 border-black px-6 py-3 text-center w-full md:w-auto min-w-[180px]">
                  <span className="font-mono text-lg font-semibold tracking-wider">
                    {couponData.code}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
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
                  className="border-2 border-black px-6 py-3 text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap w-full md:w-auto"
                >
                  ยังไม่ใช่ตอนนี้
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-500 space-y-0.5">
              <p>*โค้ดมีจำนวนจำกัด</p>
              <p>*เฉพาะการสั่งซื้อครั้งแรกที่ Ekoe</p>
              <p>*ใช้ได้กับยอดหลังหักส่วนลด</p>
              <p>*ใช้ร่วมกับ Online Executive ได้</p>
              <p>*ส่งฟรีทุกออร์เดอร์</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
