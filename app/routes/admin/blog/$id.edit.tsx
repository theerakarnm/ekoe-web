import type { Route } from './+types/$id.edit';
import { useNavigate, useNavigation } from 'react-router';
import { BlogForm } from '~/components/admin/blog/blog-form';
import { FormSkeleton } from '~/components/admin/layout/form-skeleton';
import { getBlogPost, updateBlogPost } from '~/lib/services/admin/blog-admin.service';
import type { BlogPostFormData } from '~/lib/admin/validation';
import { showSuccess, showError } from '~/lib/admin/toast';

export async function loader({ params, request }: Route.LoaderArgs) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    throw new Response('Invalid blog post ID', { status: 400 });
  }

  try {
    const post = await getBlogPost(id, request.headers);
    return { post };
  } catch (error) {
    throw new Response('Blog post not found', { status: 404 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `Edit ${data?.post?.title || 'Blog Post'} - Admin Portal` },
    { name: 'description', content: 'Edit blog post' },
  ];
}

export default function EditBlogPost({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { post } = loaderData;
  const isLoading = navigation.state === 'loading';

  const handleSubmit = async (data: BlogPostFormData) => {
    try {
      await updateBlogPost(post.id, {
        ...data,
        authorId: data.authorId ? parseInt(data.authorId as unknown as string, 10) : undefined,
        categoryId: data.categoryId ? parseInt(data.categoryId as unknown as string, 10) : undefined,
      });
      showSuccess('Blog post updated successfully');
      navigate('/admin/blog');
    } catch (error: any) {
      showError(error.message || 'Failed to update blog post');
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/admin/blog');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-muted-foreground mt-2">
          Update your blog article
        </p>
      </div>

      {isLoading ? (
        <FormSkeleton />
      ) : (
        <BlogForm
          initialData={post}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
