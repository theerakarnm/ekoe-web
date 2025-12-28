import { useState } from "react";
import type { Route } from "./+types/faq";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "FAQ - คำถามที่พบบ่อย - Ekoe" },
    { name: "description", content: "คำถามที่พบบ่อยเกี่ยวกับการสั่งซื้อสินค้า การชำระเงิน และการจัดส่ง Ekoe" },
  ];
}

interface FAQItem {
  id: number;
  question: string;
  answer: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "รหัสโปรโมชั่น/ข้อเสนอพิเศษ \"Offer Code\"",
    answer: (
      <p>
        การใช้สิทธิ์รหัสโปรโมชั่น/ข้อเสนอพิเศษ คุณสามารถรับข้อเสนอพิเศษเพียงใส่ CODE ในช่อง "PROMO CODE" ที่ปรากฏขึ้นในหน้า "ตะกร้าสินค้า" ระหว่างขั้นตอนการสรุปการสั่งซื้อ เมื่อรหัสได้รับการยอมรับแล้วจะแสดงรหัสนี้อีกครั้งในหน้า "ดูคำสั่งซื้อ"
      </p>
    ),
  },
  {
    id: 2,
    question: "รหัสโปรโมชั่นหรือ offer code สามารถนํามาใส่ได้กี่โค้ดต่อคำสั่งซื้อ?",
    answer: (
      <p>
        การใส่รหัสโปรโมชั่นสามารถเลือกใช้ได้แค่ 1 โค้ดต่อ 1 คำสั่งซื้อเท่านั้น ให้ท่านทำการตรวจสอบของแถมที่ปรากฏ ตามหน้าตระกร้าสินค้าก่อนยืนยันคำสั่งซื้อและชำระเงิน
      </p>
    ),
  },
  {
    id: 3,
    question: "สามารถค้นหากิจกรรมพิเศษของ Ekoe ได้อย่างไร?",
    answer: (
      <p>
        คุณสามารถติดตามข่าวสารกิจกรรมพิเศษทางช่องทางโซเชียลมีเดียของ Ekoe ทุกช่องทาง ข่าวสารที่คุณจะได้รับ อาทิเช่น ข้อเสนอสุดพิเศษ และสิทธิพิเศษมากมาย ข้อมูลผลิตภัณฑ์ใหม่ ชุดผลิตภัณฑ์พิเศษ การรับผลิตภัณฑ์ขนาดทดลองใช้และกิจกรรมพิเศษที่ทางอีโค่จัดขึ้นเพื่อคุณ
      </p>
    ),
  },
  {
    id: 4,
    question: "หากพบว่ารายการสั่งซื้อสินค้าผ่านทางเว็บไซต์ครั้งนี้ที่ได้รับชำรุดเสียหาย หรือไม่ครบถ้วนต้องติดต่อที่ใด?",
    answer: (
      <p>
        ภายใน 14 วันนับจากท่านได้รับสินค้า สามารถติดต่อได้ Line official: xxx ในเวลาทำการวันจันทร์-ศุกร์เวลา 9.00‐18.00 น. ยกเว้นวันหยุดทำการของบริษัท พร้อมหลักฐานรูปถ่าย หรือ คลิปวีดีโอ
      </p>
    ),
  },
  {
    id: 5,
    question: "สั่งซื้อสินค้าผิดจะทำการเปลี่ยนเป็นสินค้ารุ่นที่ถูกต้องได้หรือไม่?",
    answer: (
      <p>
        รายการสินค้าที่สั่งซื้อมาผิดจะไม่สามารถเปลี่ยนเป็นสินค้ารายการอื่น ๆ ได้ การจัดส่งสินค้าจะเป็นไปตามการยืนยัน คำสั่งซื้อของคุณที่ทำสำเร็จและชำระเงินเข้ามา
      </p>
    ),
  },
  {
    id: 6,
    question: "การทําคําสั่งซื้อและการยอมรับคําสั่งซื้อ",
    answer: (
      <div className="space-y-4">
        <p>
          ก่อนทําคําสั่งซื้อ ท่านต้องเลือกผลิตภัณฑ์ที่ท่านสนใจและเพิ่มผลิตภัณฑ์นั้นไปยังรถเข็น โดยระบุ ผลิตภัณฑ์ ขนาด และจํานวนที่ต้องการและดําเนินการตามขั้นตอนที่กําหนด ในการมีคําสั่งเพื่อ ซื้อผลิตภัณฑ์ที่ท่านเลือกไว้ในรถเข็นของคุณ คุณต้อง
        </p>
        <ul className="list-none space-y-3 ml-4">
          <li><strong>(ก)</strong> ตรวจสอบสรุปข้อมูลคุณสมบัติสําคัญ ของผลิตภัณฑ์แต่ละรายการที่คุณเลือก</li>
          <li><strong>(ข)</strong> กรอกข้อมูลส่วนบุคคลของคุณ ซึ่งรวมถึงชื่อ หมายเลขติดต่อ ที่อยู่อีเมล ที่อยู่สําหรับการจัดส่งและที่อยู่สําหรับการส่งใบแจ้งหนี้ ไว้ใน แบบฟอร์มคําสั่งซื้อ</li>
          <li><strong>(ค)</strong> อ่านและยอมรับข้อกําหนดการขายและนโยบายความเป็นส่วนตัวโดยการ ทําเครื่องหมายในช่องที่กําหนด และ</li>
          <li><strong>(ง)</strong> ดําเนินการชําระเงินผ่านระบบออนไลน์ให้สําเร็จโดย ระบบจะส่งอีเมลและ/หรือข้อความยืนยันคําสั่งซื้อให้แก่ท่านหลังจากที่ท่านได้มีคําสั่งซื้อสําเร็จแล้ว</li>
        </ul>
        <p className="text-gray-600 text-sm mt-4">
          ท่านต้องรับผิดชอบในการให้ข้อมูลที่ถูกต้องและเป็นความจริงอยู่ในขณะที่ท่านมีคําสั่งซื้อ ข้อมูลส่วนบุคคลที่ท่านให้แก่เราเพื่อมีคําสั่งซื้อจะถูกประมวลผลตามนโยบายความเป็นส่วนตัวของเรา
        </p>
      </div>
    ),
  },
  {
    id: 7,
    question: "วิธีการตรวจสอบคำสั่งซื้อ",
    answer: (
      <div className="space-y-4">
        <p>คุณสามารถตรวจสอบสถานะการสั่งซื้อของท่านได้ 3 วิธี ซึ่งจะเป็นวิธีที่สะดวกและรวดเร็วที่สุด</p>
        <ol className="list-decimal ml-6 space-y-3">
          <li>ผ่านทางหน้า ตรวจสถานะคําสั่งซื้อโดยกรอกหมายเลขคําสั่งซื้อเพื่อทําการตรวจสอบ <a href="/order" className="text-black underline hover:text-gray-600">คลิกที่นี่</a></li>
          <li>หากคุณเป็นสมาชิก คุณสามารถตรวจสอบสถานะคําสั่งซื้อได้ผ่าน <a href="/account" className="text-black underline hover:text-gray-600">บัญชีผู้ใช้ของฉัน</a> อีกช่องทางหนึ่ง</li>
          <li>อีเมล "ยืนยันการสั่งซื้อ" โดยคลิกที่ (ตรวจสอบสถานะการสั่งซื้อ) ระบบจะพาท่านไปยังหน้า สถานะคําสั่งซื้อและแสดงสถานะคําสั่งซื้อ</li>
        </ol>
        <p className="text-gray-600 text-sm">*หากคุณไม่ทราบเลขที่คําสั่งซื้อ <a href="/contact" className="text-black underline hover:text-gray-600">คลิกที่นี่</a></p>
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <p className="text-sm text-gray-700">
            <strong>หมายเหตุ:</strong> หากท่านเลือกวิธีการชําระเงิน ผ่านเคาน์เตอร์ หรือโมบายแบงค์กิ้ง/การโอนเงิน หลังจากท่านดําเนินการชําระเงิน ระบบจะเปลี่ยนสถานะการสั่งซื้อของท่าน ภายใน 1 ชั่วโมง หากท่านมีข้อสงสัย สามารถติดต่อสอบถามเพื่อการบริการลูกค้าผ่านทาง Line official: xxx หรืออีเมลถึงเราที่ <a href="mailto:ekoecare@ekoe.co.th" className="text-black underline">ekoecare@ekoe.co.th</a>
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    question: "การรักษาความปลอดภัยออนไลน์",
    answer: (
      <p>
        อีโค่ออนไลน์ เรารู้ดีว่าการรักษาความปลอดภัยมีความสําคัญสําหรับคุณอย่างไร เมื่อคุณสั่งซื้อผลิตภัณฑ์ออนไลน์ที่อีโค่อนไลน์ เราจะเข้ารหัสข้อมูลของคุณโดยใช้ Secure Socket Layer (SSL) เทคโนโลยีการเข้ารหัสนี้เทคนิคการรักษาความปลอดภัยออนไลน์ของผู้บริโภคที่ ทันสมัยที่สุดในปัจจุบัน คุณสามารถมั่นใจได้ว่าการสั่งซื้อของคุณมีความปลอดภัย
      </p>
    ),
  },
  {
    id: 9,
    question: "สั่งซื้อสําเร็จแล้วจะทําการโอนชําระเงินค่าสินค้าอย่างไร",
    answer: (
      <div className="space-y-6">
        <p>
          สําหรับการโอนชําระคุณจําเป็นต้องทําการเลือกช่องทางและธนาคารที่ท่านสะดวกผ่านทางเว็บไซต์ และเมื่อถึงขั้นตอนสุดท้ายคุณจะได้รับ QR Code และ Bar Code จากหน้าเว็บไซต์ เพื่อนําไปสแกนจ่ายชําระเงินต่อไป รวมถึงคุณจะได้รับอีเมลแจ้งวิธีการชําระเงินที่คุณเลือกสําเร็จด้วย
        </p>
        <p className="text-gray-600 text-sm">
          หากคุณยังเลือกช่องทางการชําระเงินไม่สําเร็จ ท่านจําเป็นต้องทํารายการสั่งซื้อเข้ามาใหม่อีกครั้ง รายการดังกล่าวจะถือว่าการสั่งซื้อยังไม่เสร็จสิ้นสมบูรณ์และจะถูกยกเลิกโดยอัตโนมัติต่อไป
        </p>

        {/* Mobile Banking Section */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">โมบายแบงค์กิ้ง / การโอนเงิน / อินเตอร์เน็ตแบงค์กิ้ง</h4>
          <p className="mb-4">สามารถเลือกธนาคารสําหรับการชําระเงินผ่านระบบการชําระเงิน 2C2P Secure Payment Gateway ได้ดังต่อไปนี้:</p>
          <ul className="list-disc ml-6 space-y-2 text-sm text-gray-700">
            <li><strong>ธนาคารกสิกรไทย:</strong> ATM, Bank Counter และ Mobile Banking</li>
            <li><strong>ธนาคารไทยพาณิชย์:</strong> ATM, Bank Counter, Internet Banking และ Mobile Banking</li>
            <li><strong>ธนาคารกรุงเทพ:</strong> ATM, Bank Counter, Internet Banking และ Mobile Banking</li>
          </ul>
        </div>

        {/* Steps for Mobile Banking */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">ขั้นตอนการชําระเงินผ่านโมบายแบงค์กิ้ง / การโอนเงิน</h5>
          <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-700">
            <li>เลือกวิธีการชําระเงินผ่าน โมบายแบงค์กิ้ง / การโอนเงิน</li>
            <li>ตรวจสอบรายละเอียดคําสั่งซื้อจากนั้นกดดําเนินการชําระเงิน</li>
            <li>เลือกธนาคารสําหรับทํารายการชําระเงิน</li>
            <li>กรอกข้อมูลการชําระเงิน (ช่องทางการชําระเงิน/ชื่อ/อีเมล/หมายเลขโทรศัพท์) และกดดําเนินการต่อ</li>
            <li>ระบบจะมีการสร้างหมายเลขอ้างอิง หรือ คิวอาร์โค้ด เพื่อนําไปชําระเงิน ผ่านธนาคารและช่องทางที่ท่านเลือก</li>
            <li>ระบบจะส่งอีเมลให้ท่านเพื่อแจ้งให้ดําเนินการชําระเงิน พร้อมทั้งบาร์โค้ดสําหรับใช้ในการชําระเงิน</li>
          </ol>
          <p className="text-red-600 text-sm mt-3">* กรุณาทําการชําระเงินภายใน 24 ชั่วโมง ไม่เช่นนั้นระบบจะทําการยกเลิกคําสั่งซื้อโดยอัตโนมัติ</p>
        </div>

        {/* Credit Card Section */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">บัตรเครดิต</h4>
          <p className="mb-4 text-sm text-gray-700">ชนิดของบัตรเครดิตและเดบิตที่รองรับการชําระเงินผ่านทาง 2C2P Secure Payment Gateway (VISA, Mastercard, JCB, UnionPay)</p>
        </div>

        {/* Steps for Credit Card */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">ขั้นตอนการชําระเงินผ่านบัตรเครดิต</h5>
          <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-700">
            <li>เลือกวิธีการชําระเงินผ่าน บัตรเครดิต</li>
            <li>ตรวจสอบรายละเอียดคําสั่งซื้อจากนั้นกดดําเนินการชําระเงิน</li>
            <li>กรอกข้อมูลการชําระเงิน (กรอกหมายเลขบัตร/วันที่หมดอายุ/CVV/ชื่อผู้ถือบัตร/ธนาคารผู้ออกบัตร/อีเมล*) และกดดําเนินการต่อ</li>
            <li>จากนั้นกรอกรหัส OTP ที่ธนาคารจัดส่งให้คุณเพื่อยืนยันการชําระเงิน</li>
          </ol>
        </div>

        {/* Notes */}
        <div className="text-sm text-gray-600 space-y-2">
          <p>* หากคุณกรอกอีเมลหลังจากท่านชําระเงินสําเร็จท่านจะได้รับอีเมล ใบเสร็จรับเงินจากทาง 2C2P</p>
          <p>** กรุณาทําการชําระเงินทันที</p>
          <p>*** เมื่อชําระเงินแล้วท่านจะได้รับอีเมล์ยืนยันการชําระเงินจาก 2C2P จากนั้นออร์เดอร์ของท่านจะเข้าสู่ขั้นตอนการจัดส่งต่อไป ถ้าไม่ได้รับอีเมล์ยืนยันการชําระเงิน โปรดติดต่อสอบถามบริการลูกค้าทาง Line official: xxx หรืออีเมลถึงเราที่ <a href="mailto:ekoecare@ekoe.co.th" className="text-black underline">ekoecare@ekoe.co.th</a></p>
          <p className="text-red-600">* ขออภัยทางเราไม่รับการชําระเงินผ่าน PayPal</p>
          <p>** เพื่อความปลอดภัยของคุณ ชื่อและที่อยู่ที่ต้องการให้เรียกเก็บเงินจะต้องตรงกับบัตรเครดิตที่ใช้ชําระเงิน เราขอสงวนสิทธิในการยกเลิกคําสั่งซื้อใดๆ ที่ไม่ตรงกับกฏเกณฑ์เหล่านี้</p>
        </div>
      </div>
    ),
  },
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-start justify-between text-left gap-4 hover:bg-gray-50 transition-colors px-2 -mx-2 rounded"
      >
        <div className="flex items-start gap-4">
          <span className="inline-flex items-center justify-center min-w-[32px] h-8 bg-gray-900 text-white text-sm font-medium rounded">
            {item.id}
          </span>
          <span className="text-gray-900 font-medium font-thai text-base sm:text-lg leading-relaxed">
            {item.question}
          </span>
        </div>
        <span className="text-gray-400 text-2xl shrink-0 mt-1">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="pb-6 pl-12 pr-4 text-gray-700 font-thai font-light leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="pt-8 sm:pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 font-serif">
            <a href="/" className="hover:text-black">Home</a> / <span className="font-bold text-black">FAQ</span>
          </p>
        </div>

        {/* Header Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-4 text-center">
            FAQ
          </h1>
          <p className="text-gray-500 text-center font-thai">
            คำถามที่พบบ่อย
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {faqItems.map((item) => (
              <FAQAccordion
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-xl font-serif text-gray-900 mb-4">
              ยังมีคำถามเพิ่มเติม?
            </h2>
            <p className="text-gray-600 font-thai mb-6">
              ติดต่อทีมงานของเราได้ตลอดเวลาทำการ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors font-thai"
              >
                ติดต่อเรา
              </a>
              <a
                href="mailto:ekoecare@ekoe.co.th"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-900 text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                ekoecare@ekoe.co.th
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
