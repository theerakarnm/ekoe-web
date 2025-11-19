import { ProductCard } from "~/components/share/product-card"
import type { IProduct } from "~/interface/product.interface"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"

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
},
{
  productId: 5,
  image: {
    description: 'Ekoe The Body Oil bottle',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMWD0UlI9Zv08FrG3RRK9WIwuY7mFY8VK9qwy5EBASexs1YO5iK5T-4pgyPROx5GiEarYfmDqDlM032nifMSH0r5PI7_vTYvkAh7nGRpf7Y2E5LB3KVmDHEGtqKBTyBS8AEMCaaoPU7hafw2uev0SUYA3Dbr9pumaueb7vkWGpvPNPVkQv0RGLRzWjfV88GsrXOEWcW-FhamCBhcXPKTt9rceBNC5vbFnAzdbUNll9BEh_x9kcra7cUXt37mpBpsuRdyvrPd6UoE0'
  },
  productName: 'The Body Oil',
  priceTitle: '$722.00 - $1,062.00',
  quickCartPrice: 72200,
},
{
  productId: 6,
  image: {
    description: 'Model holding Ekoe The Essence spray',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFUHYgi1kzk32fLykKFqIV5fnQ7DrgMkvxMARNM2_W4kVlbYsMHFdDA40VYN0IWwL1S8-wkyY-GEWYBCgXadp02IgIBlUIxLffHdRUdTpdd0ZfKRqlIetPtADSU4CXlP2rlwuxCvweG7ZzNEtVw54xAnrhI-Ji0S3uZPOHzDI4MHRSOSozfSjWfSlfK5kPpPpfxeEXwdOK0Gud9O3aje5zT2dpo57vgITiK0H6ZBJUEtCKIXSmgiHMQEAtDnRX4QT-L3_L_0nIpOg'
  },
  productName: 'The Essence',
  priceTitle: '$650.00 - $980.00',
  quickCartPrice: 65000,
},
{
  productId: 7,
  image: {
    description: 'Ekoe The Essence dropper bottle in water',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb5ZLDveTZPRtZul7BRjaYG7UO5YA58nDnN22KkrrfwbeIMTcgwju7XNXmY4F72EKufiQUlcwP7OBbSkdig_NqT-letNyh2F9yJdDgoliwDurVTZWMuFNM62GskjnN54JzaHk3jtSRsY49smvm3taQlBtE7U-YBuQln8A0sJjogNNr863zfp4-EC76ls8YE1nFYi9yOeQiqztNoV6Fr33tduhck0BaIVn4_VpkVuQBa0u-dEUdgjpC3rRzx6hnB_Tb99veSSWeG8E'
  },
  productName: 'The Essencie',
  priceTitle: '$650.00 - $980.00',
  quickCartPrice: 65000,
},
{
  productId: 8,
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
    <div className="mx-auto *:mt-16 sm:*:mt-20 md:*:mt-24 mb-8 sm:mb-12 md:mb-16 container px-4 sm:px-6">
      <div className="relative">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-6 sm:mb-8 md:mb-10 text-[#858585]">Our Best Seller</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.productId}
                className="pl-2 sm:pl-3 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex cursor-pointer" />
          <CarouselNext className="hidden sm:flex cursor-pointer" />
        </Carousel>
      </div>
    </div>
  )
}

export {
  BestSellerSection
}