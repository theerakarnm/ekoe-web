import { useEffect, useState } from 'react';
import { useAuthStore } from '~/store/auth-store';
import { useCartStore } from '~/store/cart';
import { Button } from '~/components/ui/button';
import { Loader2, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { showError, showSuccess } from '~/lib/toast';
import { Link } from 'react-router';

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  slug: string;
  inStock: boolean;
}

interface WishlistItem {
  id: string; // Wishlist ID
  addedAt: string;
  product: Product;
}

export function Wishlist() {
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customers/me/wishlist`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to load wishlist');
      const result = await response.json();
      setWishlist(result.data);
    } catch (error) {
      console.error('Load wishlist error:', error);
      showError('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    setProcessingId(productId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customers/me/wishlist/${productId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to remove from wishlist');

      setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
      showSuccess('Removed from wishlist');
    } catch (error) {
      console.error('Remove wishlist error:', error);
      showError('Failed to remove item');
    } finally {
      setProcessingId(null);
    }
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    setProcessingId(item.product.id);
    try {
      // Add to cart
      await addItem({
        productId: item.product.id,
        productName: item.product.name,
        image: item.product.images[0] || '',
        price: item.product.price,
        quantity: 1,
      });

      // Remove from wishlist
      await handleRemove(item.product.id);
      showSuccess('Moved to cart');
    } catch (error) {
      console.error('Move to cart error:', error);
      showError('Failed to move to cart');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-600 mb-6">
          Save items you love to verify them later
        </p>
        <Button asChild>
          <Link to="/shop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.map((item) => (
        <div key={item.id} className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          {/* Image */}
          <div className="aspect-square bg-gray-100 relative overflow-hidden">
            {item.product.images?.[0] ? (
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image
              </div>
            )}
            {!item.product.inStock && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Out of Stock
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 truncate mb-1">
              {item.product.name}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-gray-900">
                ฿{(item.product.price / 100).toLocaleString()}
              </span>
              {item.product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ฿{(item.product.compareAtPrice / 100).toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={!item.product.inStock || processingId === item.product.id}
                onClick={() => handleMoveToCart(item)}
              >
                {processingId === item.product.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Move to Cart
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemove(item.product.id)}
                disabled={processingId === item.product.id}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
