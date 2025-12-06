import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";

// ============================================================================
// Types
// ============================================================================

export interface Review {
  id: string;
  productId: string;
  userId: string | null;
  orderId: string | null;
  rating: number; // 1-5
  title: string | null;
  comment: string | null;
  reviewerName: string | null;
  reviewerEmail: string | null;
  status: "pending" | "approved" | "rejected";
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
}

export interface ReviewsSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewsTabProps {
  productId: string;
}

// ============================================================================
// Component
// ============================================================================

export function ReviewsTab({ productId }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  // Fetch reviews on mount
  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        // TODO: Replace with actual API call when backend is ready
        // For now, using mock data
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Mock data
        const mockReviews: Review[] = [];
        const mockSummary: ReviewsSummary = {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };

        setReviews(mockReviews);
        setSummary(mockSummary);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [productId]);

  // Filter reviews by rating
  const filteredReviews = selectedRating
    ? reviews.filter((review) => review.rating === selectedRating)
    : reviews;

  // Paginate reviews
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of reviews
    document.getElementById("reviews-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Handle rating filter change
  const handleRatingFilter = (rating: number | null) => {
    setSelectedRating(rating);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!summary || summary.totalReviews === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <Star className="w-12 h-12 text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
        <p className="text-gray-600 mb-6">
          Be the first to review this product and help others make informed decisions.
        </p>
        <Button variant="outline">Write a Review</Button>
      </div>
    );
  }

  return (
    <div id="reviews-section" className="space-y-8">
      {/* Rating Summary */}
      <div className="border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Overall Rating */}
          <div className="flex flex-col items-center md:items-start">
            <div className="text-5xl font-bold mb-2">
              {summary.averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(summary.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Star Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution];
              const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;

              return (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(selectedRating === rating ? null : rating)}
                  className={`flex items-center gap-3 w-full hover:bg-gray-50 p-2 rounded transition-colors ${
                    selectedRating === rating ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter */}
        {selectedRating && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Showing:</span>
              <Badge variant="secondary" className="gap-1">
                {selectedRating} <Star className="w-3 h-3 fill-current" />
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRatingFilter(null)}
                className="text-sm"
              >
                Clear filter
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {paginatedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-6 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            // Show first page, last page, current page, and pages around current
            const showPage =
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1);

            if (!showPage) {
              // Show ellipsis
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 py-1 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Review Card Component
// ============================================================================

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  const reviewDate = new Date(review.createdAt);
  const formattedDate = reviewDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          {/* Star Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-semibold text-lg">{review.title}</h4>
          )}

          {/* Reviewer Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">
              {review.reviewerName || "Anonymous"}
            </span>
            <span>•</span>
            <span>{formattedDate}</span>
            {review.isVerifiedPurchase && (
              <>
                <span>•</span>
                <Badge variant="secondary" className="text-xs">
                  Verified Purchase
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Review Text */}
      {review.comment && (
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {review.comment}
        </p>
      )}

      {/* Helpful Count */}
      {review.helpfulCount > 0 && (
        <div className="text-sm text-gray-600 pt-2 border-t">
          {review.helpfulCount} {review.helpfulCount === 1 ? "person" : "people"} found this helpful
        </div>
      )}
    </div>
  );
}
