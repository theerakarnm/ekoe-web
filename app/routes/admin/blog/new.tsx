import type { Route } from './+types/new';
import { useNavigate } from 'react-router';
import { BlogForm } from '~/components/admin/blog/blog-form';
import { createBlogPost } from '~/lib/admin/api-client';
import type { BlogPostFormData } from '~/lib/admin/validation';
import { showSuccess, showError } from '~/lib/admin/toast';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Create Blog Post - Admin Portal' },
    { name: 'description', content: 'Create a new blog post' },
  ];
}

export default function NewBlogPost() {
  const navigate = useNavigate();

  const handleSubmit = async (data: BlogPostFormData) => {
    try {
      await createBlogPost(data);
      showSuccess('Blog post created successfully');
      navigate('/admin/blog');
    } catch (error: any) {
      showError(error.message || 'Failed to create blog post');
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/admin/blog');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>
        <p className="text-muted-foreground mt-2">
          Add a new article to your blog
        </p>
      </div>

      <BlogForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
