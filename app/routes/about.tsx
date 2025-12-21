import type { Route } from "./+types/about";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "About Us - Ekoe" },
    { name: "description", content: "เรียนรู้เรื่องราวของ Ekoe - เราเชื่อว่าทุกคนงดงามได้ในแบบของตัวเอง" },
  ];
}

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="pt-8 sm:pt-8">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 font-serif">
            <a href="/" className="hover:text-black">Home</a> / <span className="font-bold text-black">About Us</span>
          </p>
        </div>

        {/* Hero Section */}
        <section className="relative h-[60vh] sm:h-[70vh] w-full overflow-hidden">
          <img
            src="/ekoe-asset/ABOUT/ABOUT-2.JPG"
            alt="Ekoe - Natural Beauty"
            className="w-full h-full object-cover object-[50%_70%]"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center max-w-3xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-6 drop-shadow-lg">
                About Us
              </h1>
              <p className="text-lg sm:text-xl text-white/90 font-light font-thai drop-shadow-md">
                ใครๆ ก็มีโมเมนต์ดีๆ เป็นของตัวเอง
              </p>
            </div>
          </div>
        </section>

        {/* Main Philosophy Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 mb-8 leading-relaxed">
              <span className="font-thai">ที่ Ekoe เราเชื่อว่าทุกคนงดงามได้ในแบบของตัวเอง</span>
            </h2>
            <div className="w-24 h-0.5 bg-black mx-auto mb-8" />
            <p className="text-gray-700 text-lg leading-relaxed font-light font-thai mb-6">
              ไม่ต้องเป๊ะ ไม่ต้องซ้ำใคร ไม่ต้องรอให้ถึงมาตรฐานของใครทั้งนั้น
            </p>
            <p className="text-gray-700 text-lg leading-relaxed font-light font-thai">
              ชีวิตมันจะสนุกแค่ไหน ถ้าเราได้ใช้ชีวิต?
            </p>
          </div>
        </section>

        {/* Feature Grid - No Standards */}
        <section className="grid md:grid-cols-2 gap-0">
          <div className="relative h-[400px] sm:h-[500px] md:h-auto">
            <img
              src="https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop"
              alt="Natural skincare"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-gray-50 py-12 md:py-20 px-8 md:px-16 flex items-center">
            <div className="max-w-lg">
              <h3 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-6">
                Be Yourself, Be Beautiful
              </h3>
              <div className="w-20 h-0.5 bg-black my-6" />
              <p className="text-gray-700 mb-4 leading-relaxed font-light font-thai">
                ที่นี่ คุณไม่ต้องวิ่งตามบิวตี้สแตนดาร์ดใด ๆ เป็นปาร์ตี้ที่ใครก็เข้าได้ แค่สนุกกับตัวเอง รักตัวเอง และกล้าเป็นตัวเองให้สุด
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed font-light font-thai">
                สำหรับเรา ความสุขของคุณคือพลังงานที่เจิดจ้ามาจากข้างใน เป็นเสน่ห์เฉพาะตัวที่ไม่มีใครลอกเลียนได้ และไม่ต้องพิสูจน์อะไรกับใคร
              </p>
              <p className="text-gray-900 font-medium font-thai">
                เราเชื่อว่าการที่คุณรักตัวเองอย่างมั่นคง ไม่ต้องวิ่งตามใคร คือความเท่ห์ที่แท้จริง
              </p>
            </div>
          </div>
        </section>

        {/* Feature Grid - Lifestyle */}
        <section className="grid md:grid-cols-2 gap-0">
          <div className="bg-white py-12 md:py-20 px-8 md:px-16 flex items-center order-2 md:order-1">
            <div className="max-w-lg">
              <h3 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-6">
                More Than Living, It's Lifestyle
              </h3>
              <div className="w-20 h-0.5 bg-black my-6" />
              <p className="text-gray-700 mb-4 leading-relaxed font-light font-thai">
                Ekoe เชื่อว่าไลฟ์สไตล์เป็นได้มากกว่าแค่การมีชีวิต แต่คือการเลือกที่จะใช้ชีวิตในแบบที่ตัวเองรัก
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed font-light font-thai">
                กล้าที่จะยิ้ม รู้ว่ารอยยิ้มนำมาซึ่งรอยยิ้ม กล้าที่จะเฉลิมฉลองทุกโมเมนต์ของตัวเองในแต่ละวัน
              </p>
            </div>
          </div>
          <div className="relative h-[400px] sm:h-[500px] md:h-auto order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
              alt="Lifestyle beauty"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Feature Grid - Science & Nature */}
        <section className="grid md:grid-cols-2 gap-0">
          <div className="relative h-[400px] sm:h-[500px] md:h-auto">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop"
              alt="Science meets nature"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-gray-50 py-12 md:py-20 px-8 md:px-16 flex items-center">
            <div className="max-w-lg">
              <h3 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-6">
                Science Meets Nature
              </h3>
              <div className="w-20 h-0.5 bg-black my-6" />
              <p className="text-gray-700 mb-4 leading-relaxed font-light font-thai">
                เราสร้างผลิตภัณฑ์โดยพิถีพิถันกับทุกรายละเอียด เอาความแม่นยำของวิทยาศาสตร์มาจับมือกับความดีงามของธรรมชาติ
              </p>
              <p className="text-gray-700 leading-relaxed font-light font-thai">
                เพื่อให้ผิวคุณได้ผลลัพธ์ที่ใช่ โดยไม่ต้องกลัวว่าผิวจะเสื่อมไวหรือซับซ้อนเกินไป และมีความสุขได้ในทุกวัน
              </p>
            </div>
          </div>
        </section>

        {/* Thank You Section */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-700 text-lg leading-relaxed font-light font-thai mb-8">
              เรารู้สึกขอบคุณอย่างยิ่งที่คุณอยู่ตรงนี้ ขอบคุณที่เป็นคุณ ไม่ว่าคุณจะเพิ่งเจอเราครั้งแรก หรือเห็นกันมาสักพักแล้ว
            </p>
            <p className="text-gray-700 text-lg leading-relaxed font-light font-thai mb-8">
              และขอเชิญชวนให้คุณมาร่วมแบ่งปันทุกโมเมนต์ ความฝันเล็กๆ น้อยๆ หรือใหญ่ๆ ที่ยิ่งใหญ่ของคุณ สำหรับอนาคตของเราและคุณทุกคน
            </p>
            <div className="w-16 h-0.5 bg-black mx-auto my-10" />
            <p className="text-gray-900 text-xl font-medium font-thai mb-4">
              สุดท้ายนี้ เราเพิ่งเริ่มต้นเท่านั้น
            </p>
            <p className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">
              ยินดีที่ได้รู้จัก
            </p>
          </div>
        </section>

        {/* Quote Section */}
        <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1596463989378-1232c8cfeb9e?q=80&w=2000&auto=format&fit=crop"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif leading-relaxed mb-8">
              "จะโกลว์แค่ไหน อยู่ที่คุณเลือกเอง"
            </blockquote>
            <div className="w-16 h-0.5 bg-white/50 mx-auto my-10" />
            <p className="text-xl sm:text-2xl font-serif mb-8">
              แล้วจะรออะไร?
            </p>
            <Link
              to="/shop"
              className="inline-block border-2 border-white text-white px-10 py-4 rounded-full font-serif hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm sm:text-base uppercase tracking-wider"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
