import { Button } from '~/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

/**
 * Generate smart page numbers for pagination display
 * Shows all pages if total <= 7, otherwise uses ellipsis for better UX
 * @param current - Current page number
 * @param total - Total number of pages
 * @param isMobile - Whether to use mobile-optimized display (fewer pages)
 */
function generatePageNumbers(current: number, total: number, isMobile: boolean = false): (number | string)[] {
  // Mobile: Show fewer pages for better touch targets
  if (isMobile) {
    // Show all pages if 5 or fewer
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Show first 2 pages + ellipsis + last page if current is near start
    if (current <= 2) {
      return [1, 2, '...', total];
    }

    // Show first + ellipsis + last 2 pages if current is near end
    if (current >= total - 1) {
      return [1, '...', total - 1, total];
    }

    // Show first + ellipsis + current + ellipsis + last
    return [1, '...', current, '...', total];
  }

  // Desktop: Show more pages
  // Show all pages if 7 or fewer
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Show first 4 pages + ellipsis + last page if current is near start
  if (current <= 3) {
    return [1, 2, 3, 4, '...', total];
  }

  // Show first + ellipsis + last 4 pages if current is near end
  if (current >= total - 2) {
    return [1, '...', total - 3, total - 2, total - 1, total];
  }

  // Show first + ellipsis + current-1, current, current+1 + ellipsis + last
  return [1, '...', current - 1, current, current + 1, '...', total];
}

export function Pagination({ currentPage, totalPages, onPageChange, disabled = false }: PaginationProps) {
  // Detect if we're on mobile (using window width)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const pages = generatePageNumbers(currentPage, totalPages, isMobile);

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8">
      {/* First page button - Hidden on very small screens */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={disabled || currentPage === 1}
        aria-label="Go to first page"
        className="hidden sm:inline-flex"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      
      {/* Previous page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        aria-label="Go to previous page"
        className="touch-manipulation"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Page number buttons */}
      {pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-muted-foreground text-sm">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            onClick={() => onPageChange(page as number)}
            disabled={disabled}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className="min-w-10 touch-manipulation"
            size={isMobile ? 'sm' : 'default'}
          >
            {page}
          </Button>
        )
      ))}
      
      {/* Next page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        aria-label="Go to next page"
        className="touch-manipulation"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {/* Last page button - Hidden on very small screens */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={disabled || currentPage === totalPages}
        aria-label="Go to last page"
        className="hidden sm:inline-flex"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
