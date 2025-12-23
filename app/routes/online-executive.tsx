
import { useLoaderData, Link } from 'react-router';
import { Header } from "../components/share/header";
import { Footer } from "../components/share/footer";
import { Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { getActivePromotions, type PromotionDisplayData } from '~/lib/services/promotion.service';

// Loader function to fetch active promotions
export async function loader() {
  try {
    const promotionData = await getActivePromotions();
    return { promotionData };
  } catch (error) {
    console.error('Failed to load promotions:', error);
    // Return fallback data if API fails
    return {
      promotionData: {
        dateRange: "ตั้งแต 15 พฤศจิกายน - 15 มกราคม 2569",
        promotions: [
          {
            id: "fallback-1",
            name: "สำหรับการเริ่มต้นที่ดีที่สุด",
            description: "โปรโมชั่นพิเศษสำหรับลูกค้าใหม่",
            type: "percentage_discount",
            benefits: [
              "ลด 15% ทุกคำสั่งซื้อ — ไม่มีขั้นต่ำ",
              "ลด 20% สำหรับ Duo Set — คู่ดูแลที่ออกแบบมาเพื่อผิวที่ดีที่สุดของคุณ"
            ],
            conditions: []
          }
        ]
      }
    };
  }
}

export default function OnlineExecutive() {
  const { promotionData } = useLoaderData<{ promotionData: PromotionDisplayData }>();

  return (
    <div className="min-h-screen bg-white font-serif">
      <Header />

      <main className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-8 pt-10">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-2">
                  EXCLUSIVE PRIVILEGES
                </h1>
                <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight border-b-2 border-black pb-6 inline-block">
                  ONLY HERE
                </h1>
              </div>

              <div className="space-y-4 text-gray-600 font-sans font-thai">
                <p>
                  ประสบการณ์ดูแลผิวที่เหนือกว่ารอคุณอยู่ที่ Ekoe Online Store พบกับของขวัญ
                  แทนความใส่ใจ และข้อเสนอสุดพิเศษที่ ตั้งใจเลือกมาเพื่อคุณโดยเฉพาะ
                  เป็นคำขอบคุณสุดพิเศษเพื่อตอบแทนคุณ
                </p>
                <p>
                  เพราะการดูแลปรนนิบัติผิวที่มาพร้อมความคุ้มค่า และสิทธิพิเศษ
                  พบข้อเสนอพิเศษตลอดช่วงเวลาแคมเปญนี้เพื่อสุขภาพผิวที่ ดีที่สุดของคุณ
                </p>
              </div>


              {promotionData.promotions.length > 0 ? (
                promotionData.promotions.map((promotion) => (
                  <>
                    <div className="flex items-center space-x-2 text-gray-800 font-medium">
                      <Calendar className="h-5 w-5" />
                      <span className='font-thai font-semibold'>
                        {promotion.dateRange}
                      </span>
                    </div>

                    <Card key={promotion.id} className="bg-gray-50 border-gray-100 shadow-2xl rounded-sm">
                      <CardContent className="p-8">
                        <h3 className="text-2xl text-gray-900 mb-4 font-thai font-bold">
                          {promotion.name}
                        </h3>

                        {promotion.benefits.length > 0 && (
                          <ul className="space-y-2 text-gray-600 mb-6 font-thai list-disc list-inside">
                            {promotion.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        )}

                        {promotion.description && (
                          <p className="text-gray-600 mb-4 font-thai whitespace-pre-line">
                            {promotion.description}
                          </p>
                        )}

                        <Link to="/shop">
                          <Button className="bg-black text-white px-6 py-6 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-none">
                            DISCOVER MORE
                          </Button>
                        </Link>
                      </CardContent>
                    </Card></>
                ))
              ) : (
                // Fallback content when no promotions are available
                <Card className="bg-gray-50 border-gray-100 shadow-sm rounded-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif text-gray-900 mb-4">
                      สำหรับการเริ่มต้นที่ดีที่สุด
                    </h3>
                    <ul className="space-y-2 text-gray-600 mb-6 font-sans list-disc list-inside">
                      <li>ลด 15% ทุกคำสั่งซื้อ — ไม่มีขั้นต่ำ</li>
                      <li>
                        ลด 20% สำหรับ Duo Set — คู่ดูแลที่ออกแบบมาเพื่อผิวที่ดีที่สุดของคุณ
                      </li>
                    </ul>
                    <Link to="/shop">
                      <Button className="bg-black text-white px-6 py-6 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-none">
                        DISCOVER MORE
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              <div className="text-xs text-gray-400 space-y-1 font-sans">
                <p>*โปรโมชั่นนี้สำหรับ Ekoe Online Store เท่านั้น</p>
                <p>*เงื่อนไขเป็นไปตามที่บริษัทกำหนด</p>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative mt-10 lg:mt-0">
              <div className="aspect-4/5 bg-gray-100 rounded-lg overflow-hidden relative">
                {/* Placeholder for the product set image */}
                <img
                  src="/ekoe-asset/ONLINE_EXECUTIVE/ONLINE_EXECUTIVE.png"
                  alt="Ekoe Product Set"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-20 relative h-80 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gray-900">
            <img
              src="https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=2000&auto=format&fit=crop"
              alt="Ocean Wave"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <span className="text-white text-6xl font-serif opacity-80 absolute top-10 left-1/4">“</span>
            <h2 className="text-2xl md:text-3xl text-white font-serif max-w-3xl leading-relaxed">
              Ekoe สร้างประสบการณ์พิเศษใน<br />
              การดูแลผิว ให้เป็นเรื่องธรรมดาสำหรับคุณ
            </h2>
            <span className="text-white text-6xl font-serif opacity-80 absolute bottom-10 right-1/4">”</span>
          </div>
        </div>

        {/* Newsletter Section */}

      </main>

      <Footer />
    </div>
  );
}
