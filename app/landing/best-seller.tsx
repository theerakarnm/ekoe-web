import { ProductCard } from "~/components/share/product-card"
import type { IProduct } from "~/interface/product.interface"

const products: IProduct[] = [{
  productId: 1,
  image: {
    description: 'Ekoe The Body Oil bottle',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMWD0UlI9Zv08FrG3RRK9WIwuY7mFY8VK9qwy5EBASexs1YO5iK5T-4pgyPROx5GiEarYfmDqDlM032nifMSH0r5PI7_vTYvkAh7nGRpf7Y2E5LB3KVmDHEGtqKBTyBS8AEMCaaoPU7hafw2uev0SUYA3Dbr9pumaueb7vkWGpvPNPVkQv0RGLRzWjfV88GsrXOEWcW-FhamCBhcXPKTt9rceBNC5vbFnAzdbUNll9BEh_x9kcra7cUXt37mpBpsuRdyvrPd6UoE0'
  },
  productName: 'The Body Oil',
  priceTitle: '$722.00 - $1,062.00',
  quickCartPrice: 72200,
},
{
  productId: 2,
  image: {
    description: 'Model holding Ekoe The Essence spray',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFUHYgi1kzk32fLykKFqIV5fnQ7DrgMkvxMARNM2_W4kVlbYsMHFdDA40VYN0IWwL1S8-wkyY-GEWYBCgXadp02IgIBlUIxLffHdRUdTpdd0ZfKRqlIetPtADSU4CXlP2rlwuxCvweG7ZzNEtVw54xAnrhI-Ji0S3uZPOHzDI4MHRSOSozfSjWfSlfK5kPpPpfxeEXwdOK0Gud9O3aje5zT2dpo57vgITiK0H6ZBJUEtCKIXSmgiHMQEAtDnRX4QT-L3_L_0nIpOg'
  },
  productName: 'The Essence',
  priceTitle: '$650.00 - $980.00',
  quickCartPrice: 65000,
},
{
  productId: 3,
  image: {
    description: 'Ekoe The Essence dropper bottle in water',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb5ZLDveTZPRtZul7BRjaYG7UO5YA58nDnN22KkrrfwbeIMTcgwju7XNXmY4F72EKufiQUlcwP7OBbSkdig_NqT-letNyh2F9yJdDgoliwDurVTZWMuFNM62GskjnN54JzaHk3jtSRsY49smvm3taQlBtE7U-YBuQln8A0sJjogNNr863zfp4-EC76ls8YE1nFYi9yOeQiqztNoV6Fr33tduhck0BaIVn4_VpkVuQBa0u-dEUdgjpC3rRzx6hnB_Tb99veSSWeG8E'
  },
  productName: 'The Essencie',
  priceTitle: '$650.00 - $980.00',
  quickCartPrice: 65000,
},
{
  productId: 4,
  image: {
    description: 'Ekoe Own The Glow product set in splashing water',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALZdRHfFOlkl42uNdWpkFuFj9skRey98s7fezqNHlI9zZSQfoNwYoyUXVm5cabqpSS47Fu8cTmvmt7a5s7uSvfET9XN_hXW_89LApzhHGrJpRQfwzz9zwBWO8wP_i3hF5Cdu8_plaeCQHQCf9cYG-nDqgsQnDePmtrK1zYjJSBEhRI6ozOIZhJP3JtJ58UUbNIl32oZK23nBuVjojkYs-BwSfaJKVSj8yU1YEsJYVhIULmRt5mRSxcxNszpEflF7H5v3YORGGux2g'
  },
  productName: 'Own The Glow',
  priceTitle: '$650.00 - $980.00',
  quickCartPrice: 65000,
}]

function BestSellerSection() {
  return (
    <div className="container mx-auto px-6 mt-24">
      <h2 className="font-serif text-4xl md:text-5xl text-center mb-10 text-[#858585]">Our Best Seller</h2>
      <div className="relative">
        <div className="flex space-x-6 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {
            products.map(product => <ProductCard key={product.productId} product={product} />)
          }
        </div>
      </div>
    </div>
  )
}

export {
  BestSellerSection
}