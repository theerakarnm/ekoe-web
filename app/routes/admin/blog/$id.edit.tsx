import type { Route } from './+types/$id.edit';
import { useNavigate } from 'react-router';
import { BlogForm } from '~/components/admin/blog/blog-form';
import { getBlogPost, updateBlogPost } from '~/lib/admin/api-client';
import type { BlogPostFormData } from '~/lib/admin/validation';
import { toast } from 'sonner';

export async function loader({ params }: Route.LoaderArgs) {
  const id = parseInt(params.id, 10);
  
  if (isNaN(id)) {
    throw new Response('Invalid blog post ID', { status: 400 });
  }

  try {
    const post = await getBlogPost(id);
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
  const { post } = loaderData;

  const handleSubmit = async (data: BlogPostFormData) => {
    try {
      await updateBlogPost(post.id, data);
      toast.success('Blog post updated successfully');
      navigate('/admin/blog');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update blog post');
      } else {
        toast.error('Failed to update blog post');
      }
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

      <BlogForm 
        initialData={post} 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
    </div>
  );
}
