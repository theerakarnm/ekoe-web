declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

// 1. สร้าง Event ID (UUID หรือ timestamp+random)
export const generateEventId = (): string => {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

// 2. ฟังก์ชัน Track ที่รองรับ Event ID
export const pageview = (eventId?: string) => {
  if (typeof window.fbq !== "function") return;

  // PageView ปกติมักไม่ค่อยทำ Deduplicate แต่ถ้าจะทำก็ส่ง ID ได้
  const options = eventId ? { eventID: eventId } : {};
  window.fbq("track", "PageView", {}, options);
};

// 3. ฟังก์ชันสำหรับ Standard Events (Purchase, Lead, etc.)
// สำคัญมาก: เราต้องรับ eventId เข้ามา เพื่อส่งให้ตรงกับ Server
export const event = (name: string, options: any = {}, eventId?: string) => {
  if (typeof window.fbq !== "function") return;

  const eventOptions = eventId ? { eventID: eventId } : {};

  // Syntax: fbq('track', Name, Data, Options { eventID })
  window.fbq("track", name, options, eventOptions);
};

// ============================================
// Standard E-commerce Events สำหรับ CAPI
// ============================================

interface ViewContentParams {
  content_ids: string[];
  content_name: string;
  content_type: string;
  value: number;
  currency: string;
}

interface AddToCartParams {
  content_ids: string[];
  content_name: string;
  content_type: string;
  value: number;
  currency: string;
  num_items: number;
}

interface InitiateCheckoutParams {
  content_ids: string[];
  value: number;
  currency: string;
  num_items: number;
}

interface PurchaseParams {
  content_ids: string[];
  content_type: string;
  value: number;
  currency: string;
  num_items: number;
  order_id?: string;
}

// ViewContent - เมื่อลูกค้าดูหน้ารายละเอียดสินค้า
export const viewContent = (params: ViewContentParams, eventId?: string) => {
  event("ViewContent", params, eventId);
};

// AddToCart - เมื่อลูกค้าเพิ่มสินค้าลงตะกร้า
export const addToCart = (params: AddToCartParams, eventId?: string) => {
  event("AddToCart", params, eventId);
};

// InitiateCheckout - เมื่อลูกค้าเริ่มขั้นตอนชำระเงิน
export const initiateCheckout = (params: InitiateCheckoutParams, eventId?: string) => {
  event("InitiateCheckout", params, eventId);
};

// Purchase - เมื่อลูกค้าสั่งซื้อสำเร็จ
export const purchase = (params: PurchaseParams, eventId?: string) => {
  event("Purchase", params, eventId);
};