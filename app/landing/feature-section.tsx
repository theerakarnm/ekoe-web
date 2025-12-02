import { Link } from "react-router";

function FeatureSection() {
  return (
    <section className="grid md:grid-cols-2 gap-0">
      <div className="bg-gray-50 py-12 md:py-16 px-8 flex items-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-serif text-gray-900 mb-6">
            Glow That's Worth Obsessing Over
          </h2>
          <div className="w-20 h-0.5 bg-black my-6 mx-auto md:mx-0"></div>
          <p className="text-gray-700 mb-2 leading-relaxed font-light font-thai">
            ความงามของคนเรานั้น ไม่ได้ถูกสร้างด้วย ความสวยงามภายนอกเพียงอย่างเดียว
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed font-light font-thai">
            แต่มาจากภายในหน่อยที่เปล่งประกายออกมา หากมีภายในที่ดีแล้ว ก็จะสามารถส่งผลออกภายนอกได้
          </p>
          <p className="text-gray-700 mb-8 leading-relaxed font-light font-thai">
            แต่อย่าลืมว่า ภายในที่สดใส่ เริ่มมันจากภายนอกได้ด้วยเช่นกัน
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
            ปรัชญาแห่งความเรียบง่าย เพื่อชีวิตที่ดีกว่า
          </h2>
          <div className="w-20 h-0.5 bg-black my-6 mx-auto md:mx-0"></div>
          <p className="text-gray-700 mb-2 leading-relaxed font-thai font-light">
            ดี ในทุก วางสิ่งดีอย่างมีหลักการเพื่อ สายใครที่ใช้ชีวิตให้ดี จำเป็นต้องหัดพอ และเพียงพอจึงไม่เกินไป
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed font-thai font-light">
            เราจึงคิด้า จะดีแค่ใดเพียงพอถ้าหากปรับปรุงสิ่งพื้นฐาณที่ควรทำการได้ทำการได้
          </p>
          <p className="text-gray-900 font-medium mb-8 font-thai">
            ตอบคำที่จำ "ช่วงดี เริ่มง่ายเกินกล่องชีวิตดีขึ้นๆ"
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