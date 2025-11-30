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
 */
function generatePageNumbers(current: number, total: number): (number | string)[] {
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
  const pages = generatePageNumbers(currentPage, totalPages);

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* First page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={disabled || currentPage === 1}
        aria-label="Go to first page"
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
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Page number buttons */}
      {pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
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
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {/* Last page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={disabled || currentPage === totalPages}
        aria-label="Go to last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
