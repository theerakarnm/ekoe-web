import { Link } from "react-router";

function FeatureSection() {
  return (
    <section className="grid md:grid-cols-2 gap-0">
      <div className="bg-gray-50 py-12 md:py-16 px-8 flex items-center">
        <div className="max-w-lg">
          <h2 className="text-3xl font-serif text-gray-900 mb-6">
            Glow That's Worth Obsessing Over
          </h2>
          <div className="w-20 h-0.5 bg-black my-6 mx-auto md:mx-0"></div>
          <p className="text-gray-700 mb-8 leading-relaxed font-light font-thai">
            ถ้าคุณชอบความโกลว์ แบบผิวสุขภาพดี และฟิลที่รู้สึกว่า “ผิวตัวเองดีกว่าเมื่อวาน” ลองให้ THE BODY OIL ของเราได้ดูแลผิวของคุณ เนื้อสัมผัสเบาสบาย แต่บำรุงเข้มข้น เติมเต็มความชุ่มชื้น ปลุกความเปล่งประกายให้ทั่วทั้งเรือนร่าง ไม่ว่าผิวแบบไหนหรือไลฟ์สไตล์แบบใด นี่คือออยล์ดูแลผิวที่คนรักผิวทุกคนควรมีไว้ใกล้ตัว
          </p>
          <Link to={'/shop'} className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300">
            Keep Me Glowing
          </Link>
        </div>
      </div>

      <div className="relative h-96 md:h-auto">
        <img
          src="/ekoe-asset/HOME/Glowthat_sworth.png"
          alt="Ekoe Product"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative h-96 md:h-auto order-4 md:order-3">
        <img
          src="/ekoe-asset/HOME/หนึ่งอย่างที่ดีจริง.png"
          alt="Ekoe Products Collection"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-white p-12 md:p-16 flex items-center order-3 md:order-4">
        <div className="max-w-md">
          <h2 className="text-3xl text-gray-900 mb-6 font-thai">
            ปรัชญาแห่งความเรียบง่าย เพื่อผิวที่ดีที่สุด
          </h2>
          <div className="w-20 h-0.5 bg-black my-6 mx-auto md:mx-0"></div>
          <p className="text-gray-700 mb-2 leading-relaxed font-thai font-light">
            ที่ Ekoe เราเชื่อในปรัชญาเรียบง่าย: การทำทุกสิ่งให้ดีจริงๆ สำหรับคุณ ผลิตภัณฑ์ของเราออกแบบมาเพื่อสิ่งที่คุณต้องการจริงๆ — จำเป็น ไว้ใจได้ และมีประสิทธิภาพสูง ให้คุณหยิบใช้ได้ทุกวัน เป็นสิ่งที่คุณรักและอยากกลับมาใช้ซ้ำอย่างต่อเนื่อง
          </p>
          <p className="text-gray-900 mb-8 font-thai">
            เพราะเรารู้ว่า <span className="font-medium text-lg">
              "ผิวที่ดี เริ่มจากสิ่งที่ดีจริงๆ"
            </span>
          </p>
          <Link to={'/shop'} className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300">
            Begin Your Glow
          </Link>
        </div>
      </div>
    </section>
  );
}

export {
  FeatureSection
}