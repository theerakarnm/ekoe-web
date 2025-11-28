import { useState } from 'react';
import { useLoaderData, useSearchParams, useNavigate, useRevalidator, useNavigation } from 'react-router';
import type { Route } from './+types/index';
import { getOrders, type Order } from '~/lib/services/admin/order-admin.service';
import { OrderTable } from '~/components/admin/orders/order-table';
import { TableSkeleton } from '~/components/admin/layout/table-skeleton';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const search = url.searchParams.get('search') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const paymentStatus = url.searchParams.get('paymentStatus') || undefined;
  const sortBy = url.searchParams.get('sortBy') || undefined;
  const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc') || undefined;

  const response = await getOrders(
    {
      page,
      limit,
      search,
      status,
      paymentStatus,
      sortBy,
      sortOrder,
    },
    request.headers
  );

  return {
    orders: response.data,
    total: response.total,
    page: response.page,
    limit: response.limit,
  };
}

export default function OrdersIndexPage() {
  const { orders, total, page, limit } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading' || revalidator.state === 'loading';

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    navigate(`?${params.toString()}`);
  };

  const handleSearch = (search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    navigate(`?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== 'all') {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    navigate(`?${params.toString()}`);
  };

  const handlePaymentStatusFilter = (paymentStatus: string) => {
    const params = new URLSearchParams(searchParams);
    if (paymentStatus && paymentStatus !== 'all') {
      params.set('paymentStatus', paymentStatus);
    } else {
      params.delete('paymentStatus');
    }
    params.set('page', '1');
    navigate(`?${params.toString()}`);
  };

  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    navigate(`?${params.toString()}`);
  };

  const handleViewOrder = (id: string) => {
    navigate(`/admin/orders/${id}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer orders and track fulfillment
          </p>
        </div>
      </header>

      {isLoading ? (
        <TableSkeleton columns={7} rows={10} />
      ) : (
        <OrderTable
          orders={orders}
          totalCount={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onPaymentStatusFilter={handlePaymentStatusFilter}
          onSort={handleSort}
          onViewOrder={handleViewOrder}
          currentSearch={searchParams.get('search') || ''}
          currentStatus={searchParams.get('status') || 'all'}
          currentPaymentStatus={searchParams.get('paymentStatus') || 'all'}
          currentSortBy={searchParams.get('sortBy') || ''}
          currentSortOrder={(searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'}
        />
      )}
    </div>
  );
}
