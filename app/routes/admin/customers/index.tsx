import { useLoaderData, useSearchParams, useNavigate, useRevalidator, useNavigation } from 'react-router';
import type { Route } from './+types/index';
import { getCustomers } from '~/lib/services/admin/customer-admin.service';
import { CustomerTable } from '~/components/admin/customers/customer-table';
import { TableSkeleton } from '~/components/admin/layout/table-skeleton';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const search = url.searchParams.get('search') || undefined;
  const sortBy = url.searchParams.get('sortBy') || undefined;
  const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc') || undefined;

  const response = await getCustomers(
    {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    },
    request.headers
  );

  return {
    customers: response.data,
    total: response.total,
    page: response.page,
    limit: response.limit,
  };
}

export default function CustomersIndexPage() {
  const { customers, total, page, limit } = useLoaderData<typeof loader>();
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

  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    navigate(`?${params.toString()}`);
  };

  const handleViewCustomer = (id: string) => {
    navigate(`/admin/customers/${id}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-2">
            View and manage customer accounts and order history
          </p>
        </div>
      </header>

      {isLoading ? (
        <TableSkeleton columns={6} rows={10} />
      ) : (
        <CustomerTable
          customers={customers}
          totalCount={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onSort={handleSort}
          onViewCustomer={handleViewCustomer}
          currentSearch={searchParams.get('search') || ''}
          currentSortBy={searchParams.get('sortBy') || ''}
          currentSortOrder={(searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'}
        />
      )}
    </div>
  );
}
