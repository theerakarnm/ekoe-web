import { useState } from 'react';
import { useLoaderData, useSearchParams, useNavigate, useRevalidator, useNavigation } from 'react-router';
import type { Route } from './+types/index';
import { getBlogPosts, deleteBlogPost, type BlogPost } from '~/lib/services/admin/blog-admin.service';
import { BlogTable } from '~/components/admin/blog/blog-table';
import { TableSkeleton } from '~/components/admin/layout/table-skeleton';
import { showSuccess, showError } from '~/lib/admin/toast';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const search = url.searchParams.get('search') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const sortBy = url.searchParams.get('sortBy') || undefined;
  const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc') || undefined;

  const response = await getBlogPosts({
    page,
    limit,
    search,
    status,
    sortBy,
    sortOrder,
  }, request.headers);

  return {
    posts: response.data,
    total: response.total,
    page: response.page,
    limit: response.limit,
  };
}

export default function BlogIndexPage() {
  const { posts, total, page, limit } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const [isDeleting, setIsDeleting] = useState(false);

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
    params.set('page', '1'); // Reset to first page on search
    navigate(`?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== 'all') {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.set('page', '1'); // Reset to first page on filter
    navigate(`?${params.toString()}`);
  };

  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    navigate(`?${params.toString()}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/blog/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteBlogPost(id);
      showSuccess('Blog post deleted successfully');
      // Revalidate to refresh the data
      revalidator.revalidate();
    } catch (error: any) {
      console.error('Failed to delete blog post:', error);
      showError(error.message || 'Failed to delete blog post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blog articles
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/blog/new')}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add Article
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton columns={6} rows={10} />
      ) : (
        <BlogTable
          posts={posts}
          totalCount={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={() => revalidator.revalidate()}
          currentSearch={searchParams.get('search') || ''}
          currentStatus={searchParams.get('status') || 'all'}
          currentSortBy={searchParams.get('sortBy') || ''}
          currentSortOrder={(searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'}
        />
      )}
    </div>
  );
}
