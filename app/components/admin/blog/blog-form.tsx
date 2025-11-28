import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { blogPostSchema, generateSlug, type BlogPostFormData } from '~/lib/admin/validation';
import type { BlogPost } from '~/lib/services/admin/blog-admin.service';
import { useKeyboardShortcuts } from '~/lib/admin/use-keyboard-shortcuts';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { RichTextEditor } from './rich-text-editor';

interface BlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function BlogForm({ initialData, onSubmit, onCancel }: BlogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | undefined>(
    initialData?.featuredImageUrl
  );

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      handler: (e) => {
        e.preventDefault();
        handleSubmit(onFormSubmit)();
      },
      description: 'Save blog post',
    },
    {
      key: 'Escape',
      handler: () => {
        onCancel();
      },
      description: 'Cancel and return to blog list',
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          excerpt: initialData.excerpt || '',
          content: initialData.content || '',
          featuredImageUrl: initialData.featuredImageUrl || '',
          featuredImageAlt: initialData.featuredImageAlt || '',
          authorName: initialData.authorName || '',
          categoryName: initialData.categoryName || '',
          metaTitle: initialData.metaTitle || '',
          metaDescription: initialData.metaDescription || '',
          status: initialData.status,
        }
      : {
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          featuredImageUrl: '',
          featuredImageAlt: '',
          authorName: '',
          categoryName: '',
          metaTitle: '',
          metaDescription: '',
          status: 'draft' as const,
        },
  });

  const title = watch('title');
  const content = watch('content');
  const featuredImageUrl = watch('featuredImageUrl');
  const status = watch('status');

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !initialData) {
      const slug = generateSlug(title);
      setValue('slug', slug);
    }
  }, [title, initialData, setValue]);

  // Update image preview
  useEffect(() => {
    setFeaturedImagePreview(featuredImageUrl || undefined);
  }, [featuredImageUrl]);

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('featuredImageUrl', url);
  };

  const clearFeaturedImage = () => {
    setValue('featuredImageUrl', '');
    setValue('featuredImageAlt', '');
    setFeaturedImagePreview(undefined);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the title and basic details of your blog post
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter blog post title"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="url-friendly-slug"
              disabled={isSubmitting}
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              URL-friendly version of the title (auto-generated)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              {...register('excerpt')}
              placeholder="Brief summary of the article"
              rows={3}
              disabled={isSubmitting}
            />
            {errors.excerpt && (
              <p className="text-sm text-destructive">{errors.excerpt.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Short description shown in article listings
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="authorName">
                Author Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="authorName"
                {...register('authorName')}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {errors.authorName && (
                <p className="text-sm text-destructive">{errors.authorName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryName">Category</Label>
              <Input
                id="categoryName"
                {...register('categoryName')}
                placeholder="Technology"
                disabled={isSubmitting}
              />
              {errors.categoryName && (
                <p className="text-sm text-destructive">{errors.categoryName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value as 'draft' | 'published' | 'archived')}
              disabled={isSubmitting}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Write the main content of your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-destructive">*</span>
            </Label>
            <RichTextEditor
              value={content}
              onChange={(value) => setValue('content', value)}
              placeholder="Write your blog post content here..."
              error={errors.content?.message}
            />
          </div>
        </CardContent>
      </Card>

      {/* Featured Image */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Image</CardTitle>
          <CardDescription>
            Add a featured image for your blog post
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="featuredImageUrl">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="featuredImageUrl"
                {...register('featuredImageUrl')}
                onChange={handleImageUrlChange}
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
              />
              {featuredImagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={clearFeaturedImage}
                  disabled={isSubmitting}
                  title="Clear image"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
            {errors.featuredImageUrl && (
              <p className="text-sm text-destructive">{errors.featuredImageUrl.message}</p>
            )}
          </div>

          {featuredImagePreview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border">
                <img
                  src={featuredImagePreview}
                  alt="Featured image preview"
                  className="size-full object-cover"
                  onError={() => setFeaturedImagePreview(undefined)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="featuredImageAlt">Alt Text</Label>
            <Input
              id="featuredImageAlt"
              {...register('featuredImageAlt')}
              placeholder="Description of the image"
              disabled={isSubmitting}
            />
            {errors.featuredImageAlt && (
              <p className="text-sm text-destructive">{errors.featuredImageAlt.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Describe the image for accessibility
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>
            Optimize your blog post for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              {...register('metaTitle')}
              placeholder="SEO-optimized title"
              disabled={isSubmitting}
              maxLength={255}
            />
            {errors.metaTitle && (
              <p className="text-sm text-destructive">{errors.metaTitle.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watch('metaTitle')?.length || 0}/255 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              {...register('metaDescription')}
              placeholder="Brief description for search results"
              rows={3}
              disabled={isSubmitting}
              maxLength={500}
            />
            {errors.metaDescription && (
              <p className="text-sm text-destructive">{errors.metaDescription.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watch('metaDescription')?.length || 0}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {initialData ? 'Update' : 'Create'} Blog Post
        </Button>
      </div>
    </form>
  );
}
