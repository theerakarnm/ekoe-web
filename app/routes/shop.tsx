import { useSearchParams, useNavigate, useNavigation, isRouteErrorResponse } from "react-router";
import { useRef } from "react";
import type { Route } from "./+types/shop";
import { ChevronDown, AlertCircle, RefreshCw } from "lucide-react";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";
import { ProductGrid } from "~/components/shop/product-grid";
import { SearchBar } from "~/components/shop/search-bar";
import { FilterPanel } from "~/components/shop/filter-panel";
import { ActiveFilters } from "~/components/shop/active-filters";
import { Pagination } from "~/components/shop/pagination";
import { ResultCount } from "~/components/shop/result-count";
import { Button } from "~/components/ui/button";
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
    // Fetch data in parallel with individual error handling for partial failures
    const [productsResult, categoriesResult, priceRangeResult] = await Promise.allSettled([
      getProducts(params),
      getCategories(),
      getPriceRange()
    ]);

    // Check if products fetch failed (critical)
    if (productsResult.status === 'rejected') {
      console.error('Failed to load products:', productsResult.reason);
      
      // Determine appropriate error status
      const errorMessage = productsResult.reason?.message || 'Failed to load products';
      const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');
      
      throw new Response(
        isNetworkError 
          ? 'Unable to connect to the server. Please check your connection.' 
          : 'Failed to load products. Please try again.',
        { status: isNetworkError ? 503 : 500 }
      );
    }

    // Get products data (guaranteed to exist since we checked above)
    const productsData = productsResult.value;

    // Handle categories failure (non-critical - use empty array as fallback)
    const categories = categoriesResult.status === 'fulfilled' 
      ? categoriesResult.value 
      : [];
    
    if (categoriesResult.status === 'rejected') {
      console.warn('Failed to load categories, using empty array:', categoriesResult.reason);
    }

    // Handle price range failure (non-critical - use default range as fallback)
    const priceRange = priceRangeResult.status === 'fulfilled'
      ? priceRangeResult.value
      : { min: 0, max: 100000 }; // Default fallback range
    
    if (priceRangeResult.status === 'rejected') {
      console.warn('Failed to load price range, using defaults:', priceRangeResult.reason);
    }

    return {
      products: productsData.data,
      pagination: productsData.pagination,
      categories,
      priceRange,
      appliedFilters: params,
      error: null
    };
  } catch (error) {
    // This catch handles any unexpected errors not caught above
    console.error('Unexpected error loading shop data:', error);
    
    // If it's already a Response, re-throw it
    if (error instanceof Response) {
      throw error;
    }
    
    // Otherwise, throw a generic 500 error
    throw new Response('An unexpected error occurred. Please try again.', { status: 500 });
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
              {/* Show warning if filters failed to load */}
              {(categories.length === 0 || (priceRange.min === 0 && priceRange.max === 100000)) && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800 font-serif">
                    Some filters may be unavailable. Products are still loading normally.
                  </p>
                </div>
              )}
              
              <FilterPanel
                categories={categories}
                priceRange={priceRange}
                appliedFilters={appliedFilters}
                onFilterChange={updateFilters}
                disabled={isLoading}
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

              {/* Pagination */}
              {mappedProducts.length > 0 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  disabled={isLoading}
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

/**
 * Error Boundary for Shop Page
 * Displays user-friendly error messages with retry functionality
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Something went wrong";
  let message = "We encountered an error while loading the shop page.";
  let statusCode: number | undefined;

  // Handle route error responses (thrown Response objects)
  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The shop page you're looking for doesn't exist.";
    } else if (error.status === 500) {
      title = "Server Error";
      message = "We're having trouble loading products right now. Please try again.";
    } else if (error.status === 503) {
      title = "Service Unavailable";
      message = "Our servers are temporarily unavailable. Please try again in a few moments.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || message;
    }
  } 
  // Handle regular Error objects
  else if (error instanceof Error) {
    console.error('Shop page error:', error);
    
    // Check for network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      title = "Connection Error";
      message = "Unable to connect to the server. Please check your internet connection and try again.";
    } else {
      message = import.meta.env.DEV 
        ? error.message 
        : "An unexpected error occurred. Please try again.";
    }
  }

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
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

        {/* Error Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            {/* Error Icon */}
            <div className="bg-red-50 rounded-full p-6 mb-6">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              {title}
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 text-lg mb-8 font-serif">
              {message}
            </p>

            {/* Status Code (if available) */}
            {statusCode && (
              <p className="text-sm text-gray-500 mb-8">
                Error Code: {statusCode}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleRetry}
                size="lg"
                className="font-serif"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Button
                onClick={handleGoHome}
                variant="outline"
                size="lg"
                className="font-serif"
              >
                Go to Home
              </Button>
            </div>

            {/* Development Error Details */}
            {import.meta.env.DEV && error instanceof Error && error.stack && (
              <details className="mt-8 w-full text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  Developer Details
                </summary>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs text-gray-800">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
