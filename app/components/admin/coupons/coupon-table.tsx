import { useState, useEffect } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Edit, Ban, Calendar, Percent, DollarSign, Truck } from 'lucide-react';
import type { DiscountCode } from '~/lib/admin/api-client';
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

interface CouponTableProps {
  coupons: DiscountCode[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onEdit: (id: number) => void;
  onDeactivate: (id: number) => Promise<void>;
  currentSearch: string;
  currentStatus: string;
  currentSortBy: string;
  currentSortOrder: 'asc' | 'desc';
}

export function CouponTable({
  coupons,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
  onStatusFilter,
  onSort,
  onEdit,
  onDeactivate,
  currentSearch,
  currentStatus,
  currentSortBy,
  currentSortOrder,
}: CouponTableProps) {
  const [searchValue, setSearchValue] = useState(currentSearch);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [couponToDeactivate, setCouponToDeactivate] = useState<DiscountCode | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

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

  const getDiscountTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="size-3" />;
      case 'fixed_amount':
        return <DollarSign className="size-3" />;
      case 'free_shipping':
        return <Truck className="size-3" />;
      default:
        return null;
    }
  };

  const getDiscountTypeBadge = (type: string) => {
    const icon = getDiscountTypeIcon(type);
    const label = type === 'percentage' ? 'Percentage' : type === 'fixed_amount' ? 'Fixed Amount' : 'Free Shipping';

    return (
      <Badge variant="outline" className="flex items-center gap-1 w-fit">
        {icon}
        <span>{label}</span>
      </Badge>
    );
  };

  const formatDiscountValue = (coupon: DiscountCode) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    } else if (coupon.discountType === 'fixed_amount') {
      return `$${(coupon.discountValue / 100).toFixed(2)}`;
    } else {
      return 'Free';
    }
  };

  const getStatusBadge = (coupon: DiscountCode) => {
    const now = new Date();
    const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < now;
    const notStarted = coupon.startsAt && new Date(coupon.startsAt) > now;

    if (!coupon.isActive) {
      return (
        <Badge variant="secondary" className="gap-1">
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          Inactive
        </Badge>
      );
    } else if (isExpired) {
      return (
        <Badge variant="outline" className="gap-1">
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          Expired
        </Badge>
      );
    } else if (notStarted) {
      return (
        <Badge variant="secondary" className="gap-1">
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          Scheduled
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="gap-1">
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          Active
        </Badge>
      );
    }
  };

  const formatDateRange = (coupon: DiscountCode) => {
    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    if (coupon.startsAt && coupon.expiresAt) {
      return `${formatDate(coupon.startsAt)} - ${formatDate(coupon.expiresAt)}`;
    } else if (coupon.expiresAt) {
      return `Until ${formatDate(coupon.expiresAt)}`;
    } else if (coupon.startsAt) {
      return `From ${formatDate(coupon.startsAt)}`;
    } else {
      return <span className="text-muted-foreground text-sm">No expiry</span>;
    }
  };

  const formatUsage = (coupon: DiscountCode) => {
    if (coupon.usageLimit) {
      return `${coupon.currentUsageCount} / ${coupon.usageLimit}`;
    } else {
      return `${coupon.currentUsageCount} / ∞`;
    }
  };

  const handleDeactivateClick = (coupon: DiscountCode) => {
    setCouponToDeactivate(coupon);
    setDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    if (couponToDeactivate && !isDeactivating) {
      setIsDeactivating(true);
      try {
        await onDeactivate(couponToDeactivate.id);
        setDeactivateDialogOpen(false);
        setCouponToDeactivate(null);
      } catch (error) {
        // Error is handled in parent component
      } finally {
        setIsDeactivating(false);
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
            placeholder="Search by code or title..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
            aria-label="Search coupons by code or title"
            type="search"
          />
        </div>

        <Select value={currentStatus} onValueChange={onStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter coupons by status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto" role="region" aria-label="Coupons table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  onClick={() => handleSortClick('code')}
                  className="flex items-center hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`Sort by code ${currentSortBy === 'code' ? (currentSortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Code
                  {getSortIcon('code')}
                </button>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSortClick('expiresAt')}
                  className="flex items-center hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`Sort by expiry date ${currentSortBy === 'expiresAt' ? (currentSortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Valid Dates
                  {getSortIcon('expiresAt')}
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-sm">No coupons found</p>
                    <p className="text-xs mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              coupons?.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <code className="font-mono font-semibold text-sm bg-muted px-2 py-1 rounded">
                      {coupon.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col max-w-xs">
                      <span className="font-medium truncate">{coupon.title}</span>
                      {coupon.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {coupon.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getDiscountTypeBadge(coupon.discountType)}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{formatDiscountValue(coupon)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatUsage(coupon)}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="size-3 text-muted-foreground" />
                      <span>{formatDateRange(coupon)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(coupon.id)}
                        title="Edit coupon"
                      >
                        <Edit className="size-4" />
                      </Button>
                      {coupon.isActive && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeactivateClick(coupon)}
                          title="Deactivate coupon"
                        >
                          <Ban className="size-4 text-destructive" />
                        </Button>
                      )}
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
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount} coupons
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

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate "{couponToDeactivate?.code}"? This will
              prevent customers from using this coupon code. You can reactivate it later by
              editing the coupon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeactivating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateConfirm}
              disabled={isDeactivating}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeactivating ? 'Deactivating...' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
