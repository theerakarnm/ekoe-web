function FeatureSection() {
  return (
    <section className="grid md:grid-cols-2 gap-0">
      <div className="bg-gray-50 p-12 md:p-16 flex items-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-serif text-gray-900 mb-6">
            Glow That's Worth Obsessing Over
          </h2>
          <div className="w-20 h-0.5 bg-black my-6 mx-auto md:mx-0"></div>
          <p className="text-gray-700 mb-2 leading-relaxed">
            ความงามของคนเรานั้น ไม่ได้ถูกสร้างด้วย ความสวยงามภายนอกเพียงอย่างเดียว
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            แต่มาจากภายในหน่อยที่เปล่งประกายออกมา หากมีภายในที่ดีแล้ว ก็จะสามารถส่งผลออกภายนอกได้
          </p>
          <p className="text-gray-700 mb-8 leading-relaxed">
            แต่อย่าลืมว่า ภายในที่สดใส่ เริ่มมันจากภายนอกได้ด้วยเช่นกัน
          </p>
          <button className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300">
            Keep Me Glowing
          </button>
        </div>
      </div>

      <div className="relative h-96 md:h-auto">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqDytMpmTsIwR1baoqTJWp2YnXc5G7m5H-3tC5ccnZ_SLz1Bx4z3sDKCDuHvZT1tUI-9-SXB6tan3QPIqmwewvxpipTpBSoANV-T2qgJjxobMo99lnJLtASEBGg-f2nTTNety4iMwX-_OwfPCxIUsh9GCfWBNQVeYWrd32JseGiS_wrhuAMRjBtx2nmXxfXFGfWoIVOXoYG0C8ScsIJNNGdt8wKXK3jZVpzNHb_c4sFFvhWWonPyA4W5y0ADSd1AFcDIaMb28s27A"
          alt="Ekoe Product"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative h-96 md:h-auto order-4 md:order-3">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF8s5R1ekzjdJ-_1bl48aGTFPzrCzWBYhc1-qUGqXQhuBgLZP_GMsQDKvHa6UX7zecMaaZzU-45AJULnrs96qZk0ub-o1e6xjFZBs_RHZewfulTak4eWXgyokVN4IHx2sIr-_ZCOV0M6yCWrxXON7W29cceODOWuFNCusiCuB8EyfB98O004DdMx3q8QzC3aZ-ETIo-xXKRPMe4Ap7hx81CTk7P_be7AHzDjKfyVZv5obaPy-9QbLjsV6Q8TsfBUPLnlXd6vdB7gA"
          alt="Ekoe Products Collection"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-white p-12 md:p-16 flex items-center order-3 md:order-4">
        <div className="max-w-md">
          <h2 className="text-3xl font-serif text-gray-900 mb-6">
            ปรัชญาแห่งความเรียบง่าย เพื่อชีวิตที่ดีกว่า
          </h2>
          <div className="w-20 h-0.5 bg-black my-6 mx-auto md:mx-0"></div>
          <p className="text-gray-700 mb-2 leading-relaxed">
            ดี ในทุก วางสิ่งดีอย่างมีหลักการเพื่อ สายใครที่ใช้ชีวิตให้ดี จำเป็นต้องหัดพอ และเพียงพอจึงไม่เกินไป
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            เราจึงคิด้า จะดีแค่ใดเพียงพอถ้าหากปรับปรุงสิ่งพื้นฐาณที่ควรทำการได้ทำการได้
          </p>
          <p className="text-gray-900 font-medium mb-8">
            ตอบคำที่จำ "ช่วงดี เริ่มง่ายเกินกล่องชีวิตดีขึ้นๆ"
          </p>
          <button className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300">
            Begin Your Glow
          </button>
        </div>
      </div>
    </section>
  );
}

export {
  FeatureSection
}