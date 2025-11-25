import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";
import { ProductCard } from "~/components/share/product-card";
import type { IProduct } from "~/interface/product.interface";
import { getProducts, type Product } from "~/lib/api-client";

// Helper function to map API Product to IProduct interface
function mapProductToIProduct(product: Product): IProduct {
  // Get the primary image or first image
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];

  // Map variants to sizes
  const sizes = product.variants?.map(variant => ({
    label: variant.name,
    value: variant.value,
    price: variant.price
  }));

  return {
    productId: product.id,
    image: {
      description: primaryImage?.altText || product.name,
      url: primaryImage?.url || 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=800&auto=format&fit=crop',
    },
    productName: product.name,
    priceTitle: sizes && sizes.length > 0
      ? `$${Math.min(...sizes.map(s => s.price))} - $${Math.max(...sizes.map(s => s.price))}`
      : `$${product.basePrice}`,
    quickCartPrice: product.basePrice,
    sizes,
    subtitle: product.subtitle,
    rating: parseFloat(product.rating) || 0,
    reviewCount: product.reviewCount,
  };
}

export default function Shop() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await getProducts({ limit: 20 });
        const mappedProducts = response.data.map(mapProductToIProduct);
        setProducts(mappedProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="pt-8 sm:pt-8">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 font-serif">
            <a href="/" className="hover:text-black">Home</a> / <span className="font-bold text-black">Shop</span>
          </p>
        </div>

        {/* Hero Section */}
        <section className="relative h-[400px] sm:h-[500px] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop"
            alt="Spa Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="bg-white/60 backdrop-blur-sm p-8 sm:p-12 text-center max-w-2xl w-full shadow-lg">
              <h1 className="text-3xl sm:text-4xl font-serif mb-4 text-gray-900">Complete Collection</h1>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-serif">
                ประสบการณ์ดูแลผิวที่ออกแบบมาเพื่อคุณ<br />
                ครบทุกขั้นตอนของการดูแลผิวให้เปล่งประกาย เติบโต และเป็น<br />
                ของคุณ ด้วยสูตรประสิทธิภาพสูงจากธรรมชาติ ผสานกับ<br />
                วิทยาศาสตร์ที่แม่นยำ ให้ผลลัพธ์ยาวนาน
              </p>
            </div>
          </div>
        </section>

        {/* Filter & Sort Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
          <p className="text-sm font-serif text-gray-900">
            {loading ? 'Loading products...' : `Showing ${products.length} products`}
          </p>
          <button className="flex items-center text-sm font-serif text-gray-900 hover:text-gray-600">
            Sort By <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 font-serif text-lg">{error}</p>
            </div>
          )}

          {loading && !error && (
            <div className="text-center py-12">
              <p className="text-gray-600 font-serif text-lg">Loading products...</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 font-serif text-lg">No products available at the moment.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
