import { useState, useEffect } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';
import type { Product } from '~/lib/admin/api-client';
import { formatPrice } from '~/lib/admin/validation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '~/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';

interface ProductTableProps {
  products: Product[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  currentSearch: string;
  currentStatus: string;
  currentSortBy: string;
  currentSortOrder: 'asc' | 'desc';
}

export function ProductTable({
  products,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
  onStatusFilter,
  onSort,
  onEdit,
  onDelete,
  currentSearch,
  currentStatus,
  currentSortBy,
  currentSortOrder,
}: ProductTableProps) {
  const [searchValue, setSearchValue] = useState(currentSearch);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        onSearch(searchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, currentSearch, onSearch]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSortClick = (field: string) => {
    if (currentSortBy === field) {
      // Toggle sort order
      onSort(field, currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      onSort(field, 'desc');
    }
  };

  const getSortIcon = (field: string) => {
    if (currentSortBy !== field) {
      return <ArrowUpDown className="ml-2 size-4" />;
    }
    return currentSortOrder === 'asc' ? (
      <ArrowUp className="ml-2 size-4" />
    ) : (
      <ArrowDown className="ml-2 size-4" />
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="gap-1">
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            Active
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary" className="gap-1">
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            Draft
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="outline" className="gap-1">
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTotalStock = (product: Product) => {
    if (!product.variants || product.variants?.length === 0) {
      return 'N/A';
    }
    const total = product.variants.reduce(
      (sum, variant) => sum + (variant.stockQuantity || 0),
      0
    );
    return total.toString();
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete && !isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete(productToDelete.id);
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        // Error is handled in parent component
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis or pages around current
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis or last page
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
            aria-label="Search products"
            type="search"
          />
        </div>

        <Select value={currentStatus} onValueChange={onStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter products by status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto" role="region" aria-label="Products table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSortClick('name')}
                  className="flex items-center hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`Sort by name ${currentSortBy === 'name' ? (currentSortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Name
                  {getSortIcon('name')}
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSortClick('basePrice')}
                  className="flex items-center hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`Sort by price ${currentSortBy === 'basePrice' ? (currentSortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Price
                  {getSortIcon('basePrice')}
                </button>
              </TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSortClick('createdAt')}
                  className="flex items-center hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`Sort by created date ${currentSortBy === 'createdAt' ? (currentSortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Created
                  {getSortIcon('createdAt')}
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-sm">No products found</p>
                    <p className="text-xs mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images && product.images?.length > 0 ? (
                      <img
                        src={product.images.find((img) => img.isPrimary)?.url || product.images[0].url}
                        alt={product.name}
                        className="size-12 rounded object-cover"
                      />
                    ) : (
                      <div className="size-12 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      {product.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {product.subtitle}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        ${formatPrice(product.basePrice)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getTotalStock(product)}</TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(product.id)}
                        title="Edit product"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteClick(product)}
                        title="Delete product"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount} products
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action
              will soft delete the product and it can be recovered later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
