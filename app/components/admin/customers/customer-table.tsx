import { useState, useEffect } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import type { Customer } from '~/lib/services/admin/customer-admin.service';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '~/components/ui/pagination';

interface CustomerTableProps {
  customers: Customer[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onViewCustomer: (id: string) => void;
  currentSearch: string;
  currentSortBy: string;
  currentSortOrder: 'asc' | 'desc';
}

export function CustomerTable({
  customers,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
  onSort,
  onViewCustomer,
  currentSearch,
  currentSortBy,
  currentSortOrder,
}: CustomerTableProps) {
  const [searchValue, setSearchValue] = useState(currentSearch);

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
      onSort(field, currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
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

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

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

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

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
      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search by name or email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
            aria-label="Search customers"
            type="search"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto" role="region" aria-label="Customers table">
        <Table>
          <TableHeader>
            <TableRow>
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
              <TableHead>Email</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSortClick('orderCount')}
                  className="flex items-center hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`Sort by order count ${currentSortBy === 'orderCount' ? (currentSortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Orders
                  {getSortIcon('orderCount')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSortClick('totalSpent')}
                  className="flex items-center hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`Sort by total spent ${currentSortBy === 'totalSpent' ? (currentSortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Total Spent
                  {getSortIcon('totalSpent')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSortClick('createdAt')}
                  className="flex items-center hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`Sort by registration date ${currentSortBy === 'createdAt' ? (currentSortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Registered
                  {getSortIcon('createdAt')}
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-sm">No customers found</p>
                    <p className="text-xs mt-1">
                      Try adjusting your search
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers?.map((customer) => (
                <TableRow 
                  key={customer.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewCustomer(customer.id)}
                >
                  <TableCell>
                    <span className="font-medium">{customer.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{customer.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{customer.orderCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
                  </TableCell>
                  <TableCell>{formatDate(customer.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCustomer(customer.id);
                      }}
                      title="View customer details"
                    >
                      <Eye className="size-4" />
                    </Button>
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
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount} customers
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
    </div>
  );
}
