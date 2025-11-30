import { useSearchParams, useNavigate, useNavigation } from "react-router";
import { useRef } from "react";
import type { Route } from "./+types/shop";
import { ChevronDown } from "lucide-react";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";
import { ProductGrid } from "~/components/shop/product-grid";
import { SearchBar } from "~/components/shop/search-bar";
import { FilterPanel } from "~/components/shop/filter-panel";
import { ActiveFilters } from "~/components/shop/active-filters";
import { Pagination } from "~/components/shop/pagination";
import { ResultCount } from "~/components/shop/result-count";
import type { IProduct } from "~/interface/product.interface";
import { 
  getProducts, 
  getCategories, 
  getPriceRange,
  type ProductFilterParams,
  type Product
} from "~/lib/services/product.service";

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
      ? `${Math.min(...sizes.map(s => s.price))} - ${Math.max(...sizes.map(s => s.price))}`
      : `${product.basePrice}`,
    quickCartPrice: product.basePrice,
    sizes,
    subtitle: product.subtitle ?? undefined,
    rating: parseFloat(product.rating || '0') || 0,
    reviewCount: product.reviewCount,
  };
}

/**
 * Loader function that fetches products, categories, and price range
 * Parses URL query parameters for filters
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  
  // Parse query parameters
  const searchParam = url.searchParams.get('search');
  const categoriesParam = url.searchParams.get('categories');
  const minPriceParam = url.searchParams.get('minPrice');
  const maxPriceParam = url.searchParams.get('maxPrice');
  const pageParam = url.searchParams.get('page');
  const sortByParam = url.searchParams.get('sortBy');
  const sortOrderParam = url.searchParams.get('sortOrder');

  const params: ProductFilterParams = {
    search: searchParam ? searchParam : undefined,
    categories: categoriesParam ? categoriesParam.split(',').filter(Boolean) : undefined,
    minPrice: minPriceParam ? parseFloat(minPriceParam) : undefined,
    maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
    page: pageParam ? parseInt(pageParam) : 1,
    limit: 24,
    sortBy: (sortByParam as 'price' | 'createdAt' | 'name') || 'createdAt',
    sortOrder: (sortOrderParam as 'asc' | 'desc') || 'desc'
  };

  try {
    // Fetch data in parallel
    const [productsData, categories, priceRange] = await Promise.all([
      getProducts(params),
      getCategories(),
      getPriceRange()
    ]);

    return {
      products: productsData.data,
      pagination: productsData.pagination,
      categories,
      priceRange,
      appliedFilters: params,
      error: null
    };
  } catch (error) {
    console.error('Failed to load shop data:', error);
    throw new Response('Failed to load products', { status: 500 });
  }
}

export default function Shop({ loaderData }: Route.ComponentProps) {
  const { products, pagination, categories, priceRange, appliedFilters } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const productsTopRef = useRef<HTMLDivElement>(null);

  // Map products to IProduct interface for ProductCard component
  const mappedProducts = products.map(mapProductToIProduct);
  
  // Check if we're loading (navigating)
  const isLoading = navigation.state === "loading";

  /**
   * Update filters and navigate
   * Resets to page 1 when filters change (except page parameter)
   */
  const updateFilters = (newFilters: Partial<ProductFilterParams>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','));
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, value.toString());
      }
    });
    
    // Reset to page 1 when filters change (except when only page is changing)
    if (Object.keys(newFilters).some(k => k !== 'page')) {
      params.set('page', '1');
    }
    
    setSearchParams(params);
  };

  /**
   * Handle page change with scroll to top
   */
  const handlePageChange = (page: number) => {
    updateFilters({ page });
    
    // Scroll to top of product list
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            initialValue={appliedFilters.search}
            onSearch={(search) => updateFilters({ search: search || undefined })}
          />
        </div>

        {/* Main Content with Sidebar and Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <FilterPanel
                categories={categories}
                priceRange={priceRange}
                appliedFilters={appliedFilters}
                onFilterChange={updateFilters}
              />
            </aside>

            {/* Products Section */}
            <main className="flex-1">
              {/* Results Header - Scroll target */}
              <div ref={productsTopRef} className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <ResultCount total={pagination.total} />
                  <button className="flex items-center text-sm font-serif text-gray-900 hover:text-gray-600">
                    Sort By <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </div>
                
                {/* Active Filters */}
                <ActiveFilters
                  filters={appliedFilters}
                  categories={categories}
                  onRemoveFilter={updateFilters}
                  onClearAll={() => navigate('/shop')}
                />
              </div>

              {/* Product Grid */}
              <ProductGrid products={mappedProducts} loading={isLoading} />

              {/* Pagination - only show if we have products and not loading */}
              {!isLoading && mappedProducts.length > 0 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </main>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
